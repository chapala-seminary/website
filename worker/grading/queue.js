/* The pending queue and the cron that empties it (docs/ai-grading.md, section 8).
 *
 * An answer the model could not grade (an outage, a capacity limit, a reply
 * that broke the rules twice and on the fallback model) is saved as pending
 * with a row in grade_queue. The fifteen-minute cron (see wrangler.jsonc) calls runQueue():
 * each due answer is asked again, and when its attempt has nothing pending
 * left, the attempt is settled -- which may pass the unit.
 *
 * An answer still pending after 24 hours, or after 6 tries, is escalated: its
 * queue row is removed and its points_json says {"held":"escalated"}. A
 * pending answer with no queue row is one a person must grade (this, an
 * injection-like answer, or a model that answered "pending"): the faculty
 * pages list exactly those.
 */
import { gradeBatch } from './model.js';
import { normAnswer } from './text.js';
import { loadKeys, loadAttempt, loadStudent, settle, cacheDecision, nowIso } from './attempts.js';
import { sendEmail, emailConfigured, emailLanguage } from '../email.js';

export const MAX_TRIES = 6;
export const ESCALATE_HOURS = 24;
const CAPACITY = /\b(3036|3040|3007)\b/;
const BATCH = 10;

/** Minutes to wait before try n+1: 15, 30, 60, 120, 240. */
export const backoffMinutes = (tries) => Math.min(15 * 2 ** Math.max(0, tries - 1), 240);

async function escalate(env, gradeId, why) {
  await env.DB.batch([
    env.DB.prepare('DELETE FROM grade_queue WHERE grade_id = ?').bind(gradeId),
    env.DB.prepare('UPDATE answer_grades SET points_json = ? WHERE id = ? AND verdict = ?').bind(JSON.stringify({ held: 'escalated', why }), gradeId, 'pending'),
  ]);
}

/* What a student is told when a pending result is in. Short, in their language. */
function gradedEmail(name, status, lang, origin) {
  const site = origin || 'https://chapalaseminary.org';
  const m = {
    en: { subject: 'Your written answers have been graded', text: `Dear ${name},\n\nYour written answers at Chapala Theological Seminary have been graded. ${status === 'passed' ? 'You passed.' : 'You did not pass this time; you may try again after the wait.'}\n\nOpen ${site} and go to the page you were on to see each result.\n\nChapala Theological Seminary` },
    es: { subject: 'Sus respuestas escritas han sido calificadas', text: `Estimado/a ${name}:\n\nSus respuestas escritas en el Seminario Teológico de Chapala han sido calificadas. ${status === 'passed' ? 'Usted aprobó.' : 'Esta vez no aprobó; puede intentarlo de nuevo después de la espera.'}\n\nAbra ${site} y vaya a la página en la que estaba para ver cada resultado.\n\nSeminario Teológico de Chapala` },
    fr: { subject: 'Vos réponses écrites ont été corrigées', text: `Bonjour ${name},\n\nVos réponses écrites au Séminaire théologique de Chapala ont été corrigées. ${status === 'passed' ? 'Vous avez réussi.' : 'Vous n’avez pas réussi cette fois ; vous pouvez réessayer après le délai.'}\n\nOuvrez ${site} et allez à la page où vous étiez pour voir chaque résultat.\n\nSéminaire théologique de Chapala` },
  };
  return m[emailLanguage(lang)];
}
export async function tellStudent(env, attempt, status) {
  try {
    if (attempt.shadow || !emailConfigured(env)) return;
    const s = await loadStudent(env, attempt.student_id);
    if (!s || !s.email || !s.email_verified_at) return;
    await sendEmail(env, { to: s.email, ...gradedEmail(s.name, status, attempt.lang || s.lang, env.SITE_ORIGIN) });
  } catch (e) { console.error('graded email failed', e && e.message); }
}

/** Ask again for every answer that is due. Returns counts for the log. */
export async function runQueue(env, { limit = 40 } = {}) {
  const t = nowIso();
  const due = (await env.DB.prepare(
    `SELECT q.grade_id, q.attempts AS tries, q.created_at AS queued_at, g.attempt_id, g.qid, g.kind, g.lang, g.answer_text
     FROM grade_queue q JOIN answer_grades g ON g.id = q.grade_id
     WHERE q.next_try_at <= ? AND g.verdict = 'pending' ORDER BY q.created_at LIMIT ?`).bind(t, limit).all()).results ?? [];
  // rows whose answer is no longer pending have nothing left to wait for
  await env.DB.prepare(`DELETE FROM grade_queue WHERE grade_id NOT IN (SELECT id FROM answer_grades WHERE verdict = 'pending')`).run();

  const stats = { due: due.length, graded: 0, retried: 0, escalated: 0, settled: 0 };
  const touched = new Set();
  const keys = await loadKeys(env, [...new Set(due.map((d) => d.qid))]);
  const groups = new Map();
  for (const d of due) {
    const k = `${d.kind}|${d.lang}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(d);
  }
  for (const [k, rows] of groups) {
    const [kind, lang] = k.split('|');
    for (let i = 0; i < rows.length; i += BATCH) {
      const part = rows.slice(i, i + BATCH);
      // one entry per grade, so give the model a unique id for each
      const items = part.map((d) => ({ qid: `g${d.grade_id}`, key: keys.get(d.qid)?.key, answer: d.answer_text })).filter((x) => x.key);
      let batch = items.length ? await gradeBatch(env, kind, lang, items) : { results: new Map(), unresolved: [], error: 'the question is no longer in grading_keys' };
      /* One answer that the model cannot take must not hold up the others in its
         batch: when nothing came back and the cause is not a capacity limit, ask for each on its own. */
      if (items.length > 1 && !batch.results.size && batch.error && !CAPACITY.test(batch.error)) {
        const each = { results: new Map(), unresolved: [], error: batch.error };
        for (const it of items) {
          const one = await gradeBatch(env, kind, lang, [it]);
          for (const [qid, r] of one.results) each.results.set(qid, r);
          if (one.error) each.error = one.error;
        }
        batch = each;
      }
      for (const d of part) {
        const r = batch.results.get(`g${d.grade_id}`);
        if (r) {
          const held = r.verdict === 'pending';
          await env.DB.batch([
            env.DB.prepare(
              `UPDATE answer_grades SET verdict = ?, feedback = ?, points_json = ?, graded_by = 'ai', model = ?, prompt_version = ?,
                 rubric_version = ?, graded_at = ? WHERE id = ? AND verdict = 'pending'`)
              .bind(r.verdict, held ? null : r.feedback || null, held ? JSON.stringify({ held: 'model' }) : r.points?.length ? JSON.stringify(r.points) : null,
                r.model, r.version, keys.get(d.qid)?.rubricVersion ?? null, nowIso(), d.grade_id),
            env.DB.prepare('DELETE FROM grade_queue WHERE grade_id = ?').bind(d.grade_id),
          ]);
          if (kind === 'fill' && !held) {
            await cacheDecision(env, d.qid, lang, normAnswer(d.answer_text), r.verdict, r.feedback, r.model, r.version);
          }
          stats.graded++; touched.add(d.attempt_id);
          continue;
        }
        const capacity = CAPACITY.test(batch.error || '');
        const tries = d.tries + (capacity ? 0 : 1);
        const age = Date.now() - Date.parse(d.queued_at);
        if (tries >= MAX_TRIES || age >= ESCALATE_HOURS * 3600 * 1000) {
          await escalate(env, d.grade_id, tries >= MAX_TRIES ? 'tries' : 'age');
          stats.escalated++; touched.add(d.attempt_id);
        } else {
          await env.DB.prepare('UPDATE grade_queue SET attempts = ?, next_try_at = ?, last_error = ? WHERE grade_id = ?')
            .bind(tries, new Date(Date.now() + backoffMinutes(capacity ? 1 : tries) * 60000).toISOString(), String(batch.error || '').slice(0, 300), d.grade_id).run();
          stats.retried++;
        }
      }
    }
  }
  // An escalated answer is with a person now; an attempt waits for them, not for the model.
  for (const id of touched) {
    const a = await loadAttempt(env, id);
    if (!a || a.status !== 'pending') continue;
    const r = await settle(env, id);
    if (r && r.status !== 'pending') { stats.settled++; await tellStudent(env, r.attempt, r.status); }
  }
  return stats;
}
