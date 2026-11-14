/* Ministry papers: submission, AI grading against the rubric, credit
 * (Dr. Cook, 2 Nov 2026). The page is /CTS<Course>Paper.html
 * (src/pages/[paper].astro, public/assets/js/cts-paper.js).
 *
 *   POST /api/assignment  { code, slug, format, topic, lang, body, notes? }
 *        -> 201 { assignment }   graded at once when the model answers in time,
 *                                else status "pending" (the 15-minute cron and
 *                                the next GET try again)
 *   GET  /api/assignment?code=&slug=
 *        -> { slug, pass, latest: assignment | null, history: [{ version, status, total, submittedAt }] }
 *
 * assignment = { id, slug, version, format, topic, lang, status, wordCount,
 *   submittedAt, gradedAt, pass, total, scores: [{ id, points, max, comment }],
 *   feedback, body, notes }   status: pending | passed | revise | unavailable
 *
 * The student is identified by `code` and every call is throttled like the
 * other student routes (api.js guarded). A paper is the student's own text and
 * may be read back by the student (to revise on another device); it is never
 * logged, and Delete My Record removes it (api.js deleteStudent).
 *
 * The rules:
 *   - the paper must be one the catalog lists (worker/catalog.json assessments,
 *     kind "paper"), in one of its formats, on one of its topics;
 *   - the body is at most maxChars (25,000) characters, the notes maxNotesChars
 *     (12,000); together at least minWords words; a sermon needs notes of at
 *     least minNotesWords words. Each refusal is a 422 the page can point at;
 *   - text addressed to the grader (rules.js paperInstruction) is refused, and the passage is returned
 *     with a 422, never sent to the model and not stored: there is no faculty
 *     step to hold it for, so the student is asked to remove it;
 *   - one paper waits for grading at a time; a passed paper is not graded
 *     again; at most DAILY_MAX versions in 24 hours (each is a long model call);
 *   - the AI's scores are the result: total >= pass is a pass (no faculty
 *     confirmation), otherwise "revise" with the comments;
 *   - a pass writes textbook_results under the paper's slug (source 'server')
 *     and runs the course-completion check. The paper is not a requirement of
 *     any track (its catalog entry is requiredFrom null), so nothing about a
 *     credential changes;
 *   - the student is emailed the result only if their email is confirmed.
 */
import catalog from './catalog.json';
import { SITE_LANGUAGES } from '../src/lib/languages.mjs';
import { wordCount } from './grading/text.js';
import { paperInstruction } from './grading/rules.js';
import { loadStudent, trackOf, completeCourseIfDone, nowIso } from './grading/attempts.js';
import { gradePaper, PAPER_BUDGET_MS } from './grading/paper.js';
import { sendEmail, emailConfigured, emailLanguage, languageLink } from './email.js';

export const DAILY_MAX = 3;
export const PAPER_MAX_TRIES = 6;
export const PAPER_GIVE_UP_HOURS = 24;
const CRON_BATCH = 3;

/** The catalog entry of a paper, or null. */
export const paperDef = (slug) => {
  const d = catalog.assessments?.[String(slug || '')];
  return d && d.kind === 'paper' ? d : null;
};

export async function assignmentRoute(path, method, request, env, ctx, h) {
  if (path !== '/api/assignment') return null;
  const guard = (fn) => h.guarded(request, env, 'student', fn);
  if (method === 'POST') return await guard(() => submit(request, env, h));
  if (method === 'GET') return await guard(() => status(request, env, h));
  return null;
}

async function studentFor(env, h, raw) {
  const id = await h.resolveCode(env, raw);
  if (!id) throw new h.HttpError(400, 'a student code is required');
  return await loadStudent(env, id);
}

/** Why a submission is refused, or null. Pure, for the tests. */
export function checkSubmission(def, b) {
  const body = typeof b.body === 'string' ? b.body : '';
  const notes = typeof b.notes === 'string' ? b.notes : '';
  if (!def.formats.includes(b.format)) return { status: 400, error: 'format must be one of: ' + def.formats.join(', ') };
  if (!def.topics.some((t) => t.id === b.topic)) return { status: 400, error: 'topic must be one of: ' + def.topics.map((t) => t.id).join(', ') };
  if (!body.trim()) return { status: 400, error: 'the paper is empty' };
  if (body.length > def.maxChars) return { status: 422, error: `the paper is longer than ${def.maxChars} characters`, tooLong: 'body', max: def.maxChars };
  if (notes.length > def.maxNotesChars) return { status: 422, error: `the notes are longer than ${def.maxNotesChars} characters`, tooLong: 'notes', max: def.maxNotesChars };
  const noteWords = wordCount(notes);
  if (b.format === 'sermon' && noteWords < def.minNotesWords)
    return { status: 422, error: `a sermon needs its study notes (at least ${def.minNotesWords} words)`, needsNotes: true, min: def.minNotesWords, words: noteWords };
  const words = wordCount(body) + noteWords;
  if (words < def.minWords) return { status: 422, error: `the paper is too short (at least ${def.minWords} words)`, tooShort: true, min: def.minWords, words };
  const flagged = paperInstruction(body) || paperInstruction(notes);
  if (flagged)
    return { status: 422, held: 'instruction', match: flagged, error: 'Part of the paper reads as an instruction to the grader. Remove it and submit again.' };
  return null;
}

async function submit(request, env, h) {
  const b = await h.body(request);
  const student = await studentFor(env, h, b.code);
  if (!student) return h.fail(404, 'no record for that student code');
  const def = paperDef(b.slug);
  if (!def) throw new h.HttpError(400, 'unknown paper');
  const refused = checkSubmission(def, b);
  if (refused) { const { status: st, ...rest } = refused; return h.json(rest, st); }
  const lang = SITE_LANGUAGES.includes(b.lang) ? b.lang : SITE_LANGUAGES.includes(student.lang) ? student.lang : 'en';

  const rows = await rowsOf(env, student.id, b.slug);
  const passed = rows.find((r) => r.status === 'passed');
  if (passed) return h.json({ error: 'this paper has already met the standard', assignment: viewOf(passed, def, true) }, 409);
  const waiting = rows.find((r) => r.status === 'pending');
  if (waiting) return h.json({ error: 'your last version is still being graded', assignment: viewOf(waiting, def, true) }, 409);
  const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  if (rows.filter((r) => r.submitted_at >= since).length >= DAILY_MAX)
    return h.json({ error: `at most ${DAILY_MAX} versions a day. Try again tomorrow.` }, 429, { 'retry-after': '3600' });

  const id = crypto.randomUUID();
  const t = nowIso();
  const notes = b.format === 'sermon' || (typeof b.notes === 'string' && b.notes.trim()) ? String(b.notes || '') : null;
  const version = (rows[0]?.version || 0) + 1;
  const ins = await env.DB.prepare(
    `INSERT INTO assignments (id, student_id, slug, version, format, topic, lang, body_text, notes_text, word_count, status, next_try_at, submitted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?) ON CONFLICT(student_id, slug, version) DO NOTHING RETURNING id`)
    .bind(id, student.id, b.slug, version, b.format, b.topic, lang, b.body, notes, wordCount(b.body) + wordCount(notes || ''), t, t).first();
  if (!ins) return h.json({ error: 'another version was submitted at the same moment; reload the page' }, 409);
  const row = await gradeRow(env, await rowById(env, id), { deadline: Date.now() + PAPER_BUDGET_MS });
  return h.json({ assignment: viewOf(row, def, true) }, 201);
}

async function status(request, env, h) {
  const url = new URL(request.url);
  const student = await studentFor(env, h, url.searchParams.get('code'));
  if (!student) return h.fail(404, 'no record for that student code');
  const slug = url.searchParams.get('slug');
  const def = paperDef(slug);
  if (!def) throw new h.HttpError(400, 'unknown paper');
  const rows = await rowsOf(env, student.id, slug);
  let latest = rows.find((r) => r.status === 'passed') || rows[0] || null;
  // A paper still waiting whose next try is due is tried now, so a student
  // watching the page does not wait for the cron.
  if (latest && latest.status === 'pending' && (!latest.next_try_at || latest.next_try_at <= nowIso()))
    latest = await gradeRow(env, latest, { deadline: Date.now() + PAPER_BUDGET_MS });
  return h.json({
    slug, pass: def.pass,
    latest: latest ? viewOf(latest, def, true) : null,
    history: rows.map((r) => ({ version: r.version, status: r.id === latest?.id ? latest.status : r.status, total: r.id === latest?.id ? latest.total : r.total, submittedAt: r.submitted_at })),
  });
}

async function rowsOf(env, studentId, slug) {
  return (await env.DB.prepare('SELECT * FROM assignments WHERE student_id = ? AND slug = ? ORDER BY version DESC').bind(studentId, slug).all()).results ?? [];
}
const rowById = (env, id) => env.DB.prepare('SELECT * FROM assignments WHERE id = ?').bind(id).first();

/** What the page is told. `own`: the student's own text is included (it is their record). */
export function viewOf(r, def, own = false) {
  let scores = [];
  try { scores = r.scores_json ? JSON.parse(r.scores_json) : []; } catch { scores = []; }
  return {
    id: r.id, slug: r.slug, version: r.version, format: r.format, topic: r.topic, lang: r.lang, status: r.status,
    wordCount: r.word_count, submittedAt: r.submitted_at, gradedAt: r.graded_at || null,
    pass: def.pass, total: r.total ?? null, scores, feedback: r.feedback || null,
    ...(own ? { body: r.body_text, notes: r.notes_text || '' } : {}),
  };
}

/** Minutes to wait before try n+1 of a paper the model could not grade: 15, 30, 60, 120, 240. */
const backoff = (tries) => Math.min(15 * 2 ** Math.max(0, tries - 1), 240);

/** Grade a pending row if it still is; write the result, credit and email. Returns the row as it now stands. */
export async function gradeRow(env, row, { deadline } = {}) {
  if (!row || row.status !== 'pending') return row;
  const def = paperDef(row.slug);
  if (!def) return row;
  const r = await gradePaper(env, def, { format: row.format, topic: row.topic, lang: row.lang, body: row.body_text, notes: row.notes_text || '' }, { deadline });
  const t = nowIso();
  if (!r.ok) {
    const tries = (row.tries || 0) + 1;
    const old = Date.now() - Date.parse(row.submitted_at) > PAPER_GIVE_UP_HOURS * 3600 * 1000;
    const giveUp = tries >= PAPER_MAX_TRIES || old;
    await env.DB.prepare(
      `UPDATE assignments SET tries = ?, last_error = ?, next_try_at = ?, status = ?, graded_at = ? WHERE id = ? AND status = 'pending'`)
      .bind(tries, String(r.error || '').slice(0, 300), new Date(Date.now() + backoff(tries) * 60000).toISOString(),
        giveUp ? 'unavailable' : 'pending', giveUp ? t : null, row.id).run();
    return await rowById(env, row.id);
  }
  const passed = r.total >= def.pass;
  const res = await env.DB.prepare(
    `UPDATE assignments SET status = ?, scores_json = ?, total = ?, feedback = ?, record_json = ?, model = ?, prompt_version = ?,
       tries = tries + 1, last_error = NULL, next_try_at = NULL, graded_at = ? WHERE id = ? AND status = 'pending' RETURNING id`)
    .bind(passed ? 'passed' : 'revise', JSON.stringify(r.scores), r.total, r.feedback || null, JSON.stringify(r.record), r.model, r.version, t, row.id).first();
  const now = await rowById(env, row.id);
  if (!res) return now;               // graded meanwhile by another request: its result stands
  const student = await loadStudent(env, row.student_id);
  if (student && passed) await creditPaper(env, student, def, row.slug);
  if (student) await tellStudent(env, student, now, def);
  return now;
}

/* A pass is recorded like a test pass, under the paper's slug, and the course
   check runs (it changes nothing while the paper is not required). Idempotent. */
async function creditPaper(env, student, def, slug) {
  await env.DB.prepare(
    `INSERT INTO textbook_results (student_id, textbook, passed_at, source) VALUES (?, ?, ?, 'server')
     ON CONFLICT(student_id, textbook) DO NOTHING`).bind(student.id, slug, nowIso()).run();
  try { await completeCourseIfDone(env, student, def.code, trackOf(student)); }
  catch (e) { console.error('paper course check failed', e && e.message); }
}

/* A faculty member passes a paper the AI marked "revise" or could not grade,
   after the student asked for a review by email (Dr. Cook, 11 Nov 2026,
   #318: appeals for papers). The AI's scores stay as they were; the ruling,
   who made it and the earlier status are kept in record_json, and the
   faculty note is what the student reads. Credit and the email follow as for
   a pass. Only a paper still at "revise" or "unavailable" changes. */
export async function passPaperByFaculty(env, id, { by, note }) {
  const row = await rowById(env, id);
  if (!row) return { error: 'No such paper.', status: 404 };
  if (row.status !== 'revise' && row.status !== 'unavailable') return { error: row.status === 'passed' ? 'This paper has already passed.' : 'This paper is still waiting for the AI.', status: 409 };
  const def = paperDef(row.slug);
  if (!def) return { error: 'This paper is no longer in the catalog.', status: 409 };
  let rec = {};
  try { rec = row.record_json ? JSON.parse(row.record_json) : {}; } catch { rec = {}; }
  rec.faculty = { by, at: nowIso(), note, before: row.status, total: row.total };
  const res = await env.DB.prepare(
    `UPDATE assignments SET status = 'passed', feedback = ?, record_json = ?, graded_at = ? WHERE id = ? AND status = ? RETURNING id`)
    .bind(note, JSON.stringify(rec), nowIso(), id, row.status).first();
  if (!res) return { error: 'This paper changed meanwhile; reload the page.', status: 409 };
  const student = await loadStudent(env, row.student_id);
  if (student) {
    await creditPaper(env, student, def, row.slug);
    try {
      if (emailConfigured(env) && student.email && student.email_verified_at) {
        const site = env.SITE_ORIGIN || 'https://chapalaseminary.org';
        await sendEmail(env, { to: student.email, ...facultyPaperEmail({ name: student.name, note, link: languageLink(site, `${def.page}.html`, row.lang || student.lang), lang: row.lang || student.lang }) });
      }
    } catch (e) { console.error('paper email failed', e && e.message); }
  }
  return { ok: true, emailed: !!(student && emailConfigured(env) && student.email && student.email_verified_at) };
}
export function facultyPaperEmail({ name, note, link, lang }) {
  lang = emailLanguage(lang);
  return {
    en: { subject: 'Your ministry assignment has been reviewed', text: `Dear ${name},\n\nThe faculty of Chapala Theological Seminary has reviewed your ministry assignment, and it meets the standard.\n\n${note}\n\nThe assignment page:\n${link}\n\nChapala Theological Seminary` },
    es: { subject: 'Su tarea ministerial ha sido revisada', text: `Estimado/a ${name}:\n\nLa facultad del Seminario Teológico de Chapala ha revisado su tarea ministerial, y cumple el nivel.\n\n${note}\n\nLa página de la tarea:\n${link}\n\nSeminario Teológico de Chapala` },
    fr: { subject: 'Votre travail pastoral a été revu', text: `Bonjour ${name},\n\nLa faculté du Séminaire théologique de Chapala a revu votre travail pastoral : il atteint le niveau requis.\n\n${note}\n\nLa page du travail :\n${link}\n\nSéminaire théologique de Chapala` },
  }[lang];
}

/* The result by email, only to a confirmed address. Never fails the request. */
export function paperEmail({ name, passed, total, pass, link, lang }) {
  lang = emailLanguage(lang);
  return {
    en: { subject: passed ? 'Your ministry assignment meets the standard' : 'Your ministry assignment has been graded',
      text: `Dear ${name},\n\nYour ministry assignment at Chapala Theological Seminary has been graded: ${total} of 100 (${pass} meets the standard). ${passed ? 'It meets the standard.' : 'Please read the comments, revise it and submit it again.'}\n\nThe scores and comments are on the assignment page:\n${link}\n\nChapala Theological Seminary` },
    es: { subject: passed ? 'Su tarea ministerial cumple el nivel' : 'Su tarea ministerial ha sido calificada',
      text: `Estimado/a ${name}:\n\nSu tarea ministerial en el Seminario Teológico de Chapala ha sido calificada: ${total} de 100 (${pass} cumple el nivel). ${passed ? 'Cumple el nivel.' : 'Lea los comentarios, revísela y envíela de nuevo.'}\n\nLas puntuaciones y los comentarios están en la página de la tarea:\n${link}\n\nSeminario Teológico de Chapala` },
    fr: { subject: passed ? 'Votre travail pastoral atteint le niveau requis' : 'Votre travail pastoral a été corrigé',
      text: `Bonjour ${name},\n\nVotre travail pastoral au Séminaire théologique de Chapala a été corrigé : ${total} sur 100 (${pass} atteint le niveau requis). ${passed ? 'Il atteint le niveau requis.' : 'Lisez les commentaires, révisez-le et envoyez-le de nouveau.'}\n\nLes notes et les commentaires sont sur la page du travail :\n${link}\n\nSéminaire théologique de Chapala` },
  }[lang];
}
async function tellStudent(env, student, row, def) {
  try {
    if (!emailConfigured(env) || !student.email || !student.email_verified_at) return;
    if (row.status !== 'passed' && row.status !== 'revise') return;
    const site = env.SITE_ORIGIN || 'https://chapalaseminary.org';
    await sendEmail(env, { to: student.email, ...paperEmail({ name: student.name, passed: row.status === 'passed', total: row.total, pass: def.pass,
      link: languageLink(site, `${def.page}.html`, row.lang || student.lang), lang: row.lang || student.lang }) });
  } catch (e) { console.error('paper email failed', e && e.message); }
}

/** The 15-minute cron: papers the model could not grade yet, a few at a time. */
export async function runPaperQueue(env, { limit = CRON_BATCH } = {}) {
  const due = (await env.DB.prepare(
    `SELECT * FROM assignments WHERE status = 'pending' AND (next_try_at IS NULL OR next_try_at <= ?) ORDER BY submitted_at LIMIT ?`)
    .bind(nowIso(), limit).all()).results ?? [];
  const out = { tried: 0, graded: 0 };
  for (const row of due) {
    out.tried++;
    const now = await gradeRow(env, row, { deadline: Date.now() + PAPER_BUDGET_MS });
    if (now && now.status !== 'pending') out.graded++;
  }
  return out;
}
