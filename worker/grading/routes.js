/* The grading routes (docs/ai-grading.md, section 7).
 *
 *   POST /api/attempt             start or resume the attempt for a test
 *   POST /api/mc                  one multiple-choice click
 *   POST /api/grade               written answers, 1 to 10 at a time
 *   POST /api/attempt/<id>/submit settle the attempt: credit, or the lockout
 *   GET  /api/attempt/<id>?code=  where the attempt stands (collect pending results)
 *   POST /api/appeal              ask a person to look at a result again
 *   POST /api/shadow              the production trial: grade and record, change nothing
 *
 * Called from worker/api.js handle() with the helpers that file already has
 * (`h`), so the student code, the failed-lookup throttle and the error shapes
 * are the ones every other route uses.
 */
import { loadScope, loadKeys, loadStudent, loadAttempt, trackOf, nowIso, itemsOf, standing, bankedFor,
  attemptView, resultOf, settle, gradeWritten, gradedThisHour } from './attempts.js';
import { MAX_FILL_CHARS, MAX_SA_CHARS, HOURLY_CAP, OPEN_APPEALS_MAX } from './rules.js';

const LANGS = ['en', 'es', 'fr'];
const pick = (obj, lang) => (obj && (obj[lang] ?? obj.en ?? Object.values(obj)[0])) ?? '';
const MAX_ITEMS = 10;
const MAX_SHADOW = 80;

export async function gradingRoute(path, method, request, env, ctx, h) {
  let m;
  const guard = (fn) => h.guarded(request, env, 'student', fn);
  if (path === '/api/attempt' && method === 'POST') return await guard(() => startAttempt(request, env, h));
  if (path === '/api/mc' && method === 'POST') return await guard(() => answerMC(request, env, h));
  if (path === '/api/grade' && method === 'POST') return await guard(() => gradeAnswers(request, env, h));
  if (path === '/api/appeal' && method === 'POST') return await guard(() => appeal(request, env, h));
  if (path === '/api/shadow' && method === 'POST') return await guard(() => shadow(request, env, ctx, h));
  if ((m = /^\/api\/attempt\/([A-Za-z0-9-]{8,64})\/submit$/.exec(path)) && method === 'POST')
    return await guard(() => submit(request, env, h, m[1]));
  if ((m = /^\/api\/attempt\/([A-Za-z0-9-]{8,64})$/.exec(path)) && method === 'GET')
    return await guard(() => collect(request, env, h, m[1]));
  return null;
}

/* The student a request is for, from the code in `raw`. */
async function studentFor(env, h, raw) {
  const id = await h.resolveCode(env, raw);
  if (!id) throw new h.HttpError(400, 'a student code is required');
  const student = await loadStudent(env, id);
  return student || null;
}
const noStudent = (h) => h.fail(404, 'no record for that student code');

/* An attempt the student owns. A missing one and somebody else's look alike. */
async function ownAttempt(env, h, student, attemptId) {
  const a = await loadAttempt(env, attemptId);
  return a && a.student_id === student.id ? a : null;
}

async function startAttempt(request, env, h) {
  const b = await h.body(request);
  const student = await studentFor(env, h, b.code);
  if (!student) return noStudent(h);
  const scope = await loadScope(env, String(b.scope || ''));
  if (!scope) throw new h.HttpError(400, 'unknown test: its answer keys may not be on the server yet');
  const lang = LANGS.includes(b.lang) ? b.lang : LANGS.includes(student.lang) ? student.lang : 'en';

  const recent = (await env.DB.prepare(
    'SELECT * FROM attempts WHERE student_id = ? AND scope = ? AND shadow = 0 ORDER BY started_at DESC, rowid DESC LIMIT 5')
    .bind(student.id, scope.scope).all()).results ?? [];
  const open = recent.find((a) => a.status === 'open');
  const pending = recent.find((a) => a.status === 'pending');
  const locked = recent.find((a) => a.locked_until && Date.parse(a.locked_until) > Date.now());
  let attempt = open || pending;
  if (!attempt && locked)
    return h.json({ error: 'locked after a failed attempt', lock: { until: locked.locked_until, kind: locked.lock_kind }, track: locked.track }, 423);
  if (attempt && attempt.lang !== lang && attempt.status === 'open') {
    await env.DB.prepare('UPDATE attempts SET lang = ? WHERE id = ?').bind(lang, attempt.id).run();
    attempt = { ...attempt, lang };
  }
  if (!attempt) {
    const id = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO attempts (id, student_id, scope, track, lang, shadow, status, started_at) VALUES (?, ?, ?, ?, ?, 0, 'open', ?)`)
      .bind(id, student.id, scope.scope, trackOf(student), lang, nowIso()).run();
    attempt = await loadAttempt(env, id);
  }
  return h.json(await attemptView(env, attempt, scope));
}

async function answerMC(request, env, h) {
  const b = await h.body(request);
  const student = await studentFor(env, h, b.code);
  if (!student) return noStudent(h);
  const attempt = await ownAttempt(env, h, student, b.attemptId);
  if (!attempt) return h.fail(404, 'no such attempt');
  if (attempt.status !== 'open') throw new h.HttpError(409, 'this attempt is already submitted');
  const qid = String(b.qid || '');
  const choice = b.choice;
  if (!Number.isInteger(choice) || choice < 0 || choice > 9) throw new h.HttpError(400, 'choice must be a whole number');
  const scope = await loadScope(env, attempt.scope);
  if (!scope) throw new h.HttpError(409, 'the test is no longer on the server');
  const banked = await bankedFor(env, student.id, attempt.scope, attempt.id);
  if (banked.mc || !scope.qids.mc.includes(qid)) throw new h.HttpError(400, 'that question is not part of this attempt');
  const key = (await loadKeys(env, [qid])).get(qid);
  if (!key) throw new h.HttpError(409, 'the answer key is not on the server');
  const options = pick(key.key.options, attempt.lang) || [];
  if (choice >= options.length) throw new h.HttpError(400, 'choice is not one of the options');

  const right = choice === key.key.answer;
  const t = nowIso();
  await env.DB.prepare(
    `INSERT INTO answer_grades (attempt_id, student_id, qid, kind, lang, answer_text, verdict, graded_by, created_at, graded_at)
     VALUES (?, ?, ?, 'mc', ?, ?, ?, 'exact', ?, ?) ON CONFLICT(attempt_id, qid) DO NOTHING`)
    .bind(attempt.id, student.id, qid, attempt.lang, String(choice), right ? 'right' : 'wrong', t, t).run();
  // The first answer stands, whoever wrote it: read back what is stored.
  const stored = await env.DB.prepare('SELECT verdict, answer_text FROM answer_grades WHERE attempt_id = ? AND qid = ?').bind(attempt.id, qid).first();
  return h.json({ right: stored.verdict === 'right', answer: key.key.answer, why: pick(key.key.why, attempt.lang) || null, choice: Number(stored.answer_text) });
}

async function gradeAnswers(request, env, h) {
  const b = await h.body(request);
  const student = await studentFor(env, h, b.code);
  if (!student) return noStudent(h);
  const attempt = await ownAttempt(env, h, student, b.attemptId);
  if (!attempt) return h.fail(404, 'no such attempt');
  if (attempt.status !== 'open') throw new h.HttpError(409, 'this attempt is already submitted');
  if (!Array.isArray(b.items) || b.items.length < 1 || b.items.length > MAX_ITEMS) throw new h.HttpError(400, `send 1 to ${MAX_ITEMS} items`);
  const scope = await loadScope(env, attempt.scope);
  if (!scope) throw new h.HttpError(409, 'the test is no longer on the server');

  const rows = await env.DB.prepare('SELECT * FROM answer_grades WHERE attempt_id = ?').bind(attempt.id).all();
  const items = itemsOf(scope, attempt, rows.results ?? []);
  const banked = await bankedFor(env, student.id, attempt.scope, attempt.id);
  const allowed = new Set([...items.fill, ...items.sa]);
  const seen = new Set();
  const asked = [];
  for (const it of b.items) {
    if (!it || typeof it.qid !== 'string' || typeof it.answer !== 'string') throw new h.HttpError(400, 'each item needs a qid and an answer (text)');
    if (!allowed.has(it.qid)) throw new h.HttpError(400, 'that question is not part of this attempt');
    if (seen.has(it.qid)) throw new h.HttpError(400, 'a question appears twice');
    seen.add(it.qid);
    const isFill = items.fill.includes(it.qid);
    const max = isFill ? MAX_FILL_CHARS : MAX_SA_CHARS;
    if (it.answer.length > max) throw new h.HttpError(400, `an answer is longer than ${max} characters`);
    asked.push({ ...it, kind: isFill ? 'fill' : 'sa' });
  }

  // What is already settled: a banked short answer, or an answer given earlier in this attempt.
  const done = new Map((rows.results ?? []).map((r) => [r.qid, r]));
  const fresh = asked.filter((a) => !done.has(a.qid) && !(a.kind === 'sa' && banked.sa.includes(a.qid)));
  if (fresh.length && (await gradedThisHour(env, student.id)) + fresh.length > HOURLY_CAP)
    return h.json({ error: 'too many answers graded this hour. Wait a while and try again.' }, 429, { 'retry-after': '600' });

  let graded = [];
  if (fresh.length) {
    const keys = await loadKeys(env, fresh.map((a) => a.qid));
    if (fresh.some((a) => !keys.get(a.qid))) throw new h.HttpError(409, 'the answer key is not on the server');
    const entries = fresh.map((a) => ({ qid: a.qid, kind: a.kind, answer: a.answer, key: keys.get(a.qid).key, rubricVersion: keys.get(a.qid).rubricVersion }));
    graded = await gradeWritten(env, attempt, entries);
  }
  const byQid = new Map(graded.map((g) => [g.qid, g]));
  // an item answered earlier that was a wrong fill-in: it is final, so the answer wanted may come with it
  const wrongBefore = asked.filter((a) => !byQid.has(a.qid) && a.kind === 'fill' && done.get(a.qid)?.verdict === 'wrong').map((a) => a.qid);
  const wantedKeys = wrongBefore.length ? await loadKeys(env, wrongBefore) : new Map();
  return h.json({
    items: asked.map((a) => {
      if (byQid.has(a.qid)) return byQid.get(a.qid);
      const was = done.get(a.qid);
      if (was) {
        const wanted = wrongBefore.includes(a.qid) ? pick(wantedKeys.get(a.qid)?.key.answer, attempt.lang) : '';
        return { qid: a.qid, gradeId: was.id, verdict: was.verdict, feedback: was.feedback || null, gradedBy: was.graded_by, ...(wanted ? { correctAnswer: wanted } : {}) };
      }
      return { qid: a.qid, verdict: 'met', feedback: null, banked: true };
    }),
  });
}

async function submit(request, env, h, attemptId) {
  const b = await h.body(request);
  const student = await studentFor(env, h, b.code);
  if (!student) return noStudent(h);
  const attempt = await ownAttempt(env, h, student, attemptId);
  if (!attempt) return h.fail(404, 'no such attempt');
  if (attempt.status !== 'open') return h.json(await view(env, attempt));
  const r = await settle(env, attempt.id, { submitting: true });
  return h.json(r.result);
}

async function view(env, attempt) {
  const scope = await loadScope(env, attempt.scope);
  return await resultOf(env, attempt, scope);
}

async function collect(request, env, h, attemptId) {
  const url = new URL(request.url);
  const student = await studentFor(env, h, url.searchParams.get('code'));
  if (!student) return noStudent(h);
  let attempt = await ownAttempt(env, h, student, attemptId);
  if (!attempt) return h.fail(404, 'no such attempt');
  if (attempt.status === 'pending') {
    // A pending item may have been graded by a person since: settle if nothing is left waiting.
    const scope = await loadScope(env, attempt.scope);
    if (scope && (await standing(env, attempt, scope)).verdict.status !== 'pending') {
      await settle(env, attempt.id);
      attempt = await loadAttempt(env, attempt.id);
    }
  }
  return h.json(await view(env, attempt));
}

async function appeal(request, env, h) {
  const b = await h.body(request);
  const student = await studentFor(env, h, b.code);
  if (!student) return noStudent(h);
  let gradeId = Number(b.gradeId);
  if (!Number.isInteger(gradeId) && typeof b.attemptId === 'string' && typeof b.qid === 'string') {
    // the page may name the answer by its attempt and question instead
    gradeId = (await env.DB.prepare('SELECT id FROM answer_grades WHERE attempt_id = ? AND qid = ? AND student_id = ?').bind(b.attemptId, b.qid, student.id).first())?.id;
  }
  if (!Number.isInteger(gradeId)) throw new h.HttpError(400, 'gradeId is required');
  const note = h.str(b.note, 1000, { field: 'note' });
  const g = await env.DB.prepare(
    `SELECT g.id, g.kind, g.verdict, g.student_id, a.shadow FROM answer_grades g JOIN attempts a ON a.id = g.attempt_id WHERE g.id = ?`).bind(gradeId).first();
  if (!g || g.student_id !== student.id || g.shadow) return h.fail(404, 'no such answer');
  if (!['fill', 'sa'].includes(g.kind) || !['not_met', 'partly', 'wrong'].includes(g.verdict))
    throw new h.HttpError(409, 'only a written answer that did not meet the standard can be sent for review');
  const open = (await env.DB.prepare(`SELECT COUNT(*) AS n FROM appeals WHERE student_id = ? AND status = 'open'`).bind(student.id).first())?.n || 0;
  if (open >= OPEN_APPEALS_MAX) return h.json({ error: `you already have ${OPEN_APPEALS_MAX} reviews waiting. Wait for a result before asking for another.` }, 429);
  const dup = await env.DB.prepare(`SELECT 1 FROM appeals WHERE grade_id = ? AND status = 'open'`).bind(gradeId).first();
  if (dup) return h.json({ ok: true, already: true });
  await env.DB.prepare('INSERT INTO appeals (grade_id, student_id, note, status, created_at) VALUES (?, ?, ?, ?, ?)')
    .bind(gradeId, student.id, note, 'open', nowIso()).run();
  return h.json({ ok: true });
}

/* The production trial. The browser keeps grading as it did and sends what it
   did; the server grades the same answers and records them, flagged shadow.
   Students see nothing, credit is untouched, nothing is locked. */
async function shadow(request, env, ctx, h) {
  const b = await h.body(request);
  const student = await studentFor(env, h, b.code);
  if (!student) return noStudent(h);
  const scope = await loadScope(env, String(b.scope || ''));
  if (!scope) throw new h.HttpError(400, 'unknown test');
  if (!Array.isArray(b.answers) || b.answers.length > MAX_SHADOW) throw new h.HttpError(400, `send up to ${MAX_SHADOW} answers`);
  const lang = LANGS.includes(b.lang) ? b.lang : LANGS.includes(student.lang) ? student.lang : 'en';
  const all = new Set([...scope.qids.mc, ...scope.qids.fill, ...scope.qids.sa]);
  const answers = [];
  const seen = new Set();
  for (const a of b.answers) {
    if (!a || typeof a.qid !== 'string' || !all.has(a.qid) || seen.has(a.qid)) continue;
    seen.add(a.qid);
    const kind = scope.qids.mc.includes(a.qid) ? 'mc' : scope.qids.fill.includes(a.qid) ? 'fill' : 'sa';
    if (kind === 'mc') { if (Number.isInteger(a.choice)) answers.push({ qid: a.qid, kind, choice: a.choice }); continue; }
    if (typeof a.answer === 'string') answers.push({ qid: a.qid, kind, answer: a.answer.slice(0, kind === 'fill' ? MAX_FILL_CHARS : MAX_SA_CHARS) });
  }
  const clientResult = JSON.stringify(b.clientResult ?? null).slice(0, 4000);
  const work = shadowWork(env, student, scope, lang, answers, clientResult).catch((e) => console.error('shadow error', e && e.stack || e));
  if (ctx && typeof ctx.waitUntil === 'function') ctx.waitUntil(work); else await work;
  return h.json({ ok: true });
}

export async function shadowWork(env, student, scope, lang, answers, clientResult) {
  const id = crypto.randomUUID();
  const t = nowIso();
  await env.DB.prepare(
    `INSERT INTO attempts (id, student_id, scope, track, lang, shadow, status, started_at, submitted_at, client_result)
     VALUES (?, ?, ?, ?, ?, 1, 'open', ?, ?, ?)`).bind(id, student.id, scope.scope, trackOf(student), lang, t, t, clientResult).run();
  const attempt = await loadAttempt(env, id);
  const mc = answers.filter((a) => a.kind === 'mc');
  const keys = await loadKeys(env, answers.map((a) => a.qid));
  for (const a of mc) {
    const k = keys.get(a.qid);
    if (!k) continue;
    await env.DB.prepare(
      `INSERT INTO answer_grades (attempt_id, student_id, qid, kind, lang, answer_text, verdict, graded_by, created_at, graded_at)
       VALUES (?, ?, ?, 'mc', ?, ?, ?, 'exact', ?, ?) ON CONFLICT(attempt_id, qid) DO NOTHING`)
      .bind(id, student.id, a.qid, lang, String(a.choice), a.choice === k.key.answer ? 'right' : 'wrong', t, t).run();
  }
  const written = answers.filter((a) => a.kind !== 'mc' && keys.get(a.qid));
  if (written.length && (await gradedThisHour(env, student.id)) + written.length <= HOURLY_CAP) {
    for (let i = 0; i < written.length; i += MAX_ITEMS) {
      const part = written.slice(i, i + MAX_ITEMS);
      await gradeWritten(env, attempt, part.map((a) => ({ qid: a.qid, kind: a.kind, answer: a.answer, key: keys.get(a.qid).key, rubricVersion: keys.get(a.qid).rubricVersion })));
    }
  }
  await settle(env, id, { submitting: true });
}
