/* Attempts: the lifecycle of one sitting of one test, the grades written to
 * D1, and the credit that follows (docs/ai-grading.md, sections 5-7).
 *
 * The server is the grader of record. Nothing a browser says about its own
 * result is read here: the track comes from the stored student record, the
 * keys from grading_keys, and credit (unit_progress, textbook_results,
 * course_completions, all source = 'server') is written only by settle().
 */
import catalog from '../catalog.json';
import { courseShortfall, textbookShortfall, resolveCourse, studentLevel } from '../awards.js';
import { testContext } from '../test-context.js';
import { notifyBatch } from '../notify.js';
import { exactFill, normAnswer, wordCount, copiedOnly } from './text.js';
import { counts, requirements, evaluate, lockKind, lockMinutes, need, looksLikeInstruction,
  MIN_SA_WORDS, MAX_FILL_CHARS, MAX_SA_CHARS, HOURLY_CAP } from './rules.js';
import { gradeBatch, modelsOf, GRADING_BUDGET_MS } from './model.js';
import { SINGLES } from './singles.js';

export const nowIso = () => new Date().toISOString();
import { pickText } from './prompt.js';
const pick = (obj, lang) => pickText(obj, lang).text;
const slugOfPages = new Map(Object.entries(catalog.courses).map(([slug, c]) => [c.pages, slug]));

/* ---- scopes and keys ------------------------------------------------------ */

/** What a scope string names, or null. */
export function parseScope(scope) {
  let m;
  if ((m = /^u:([A-Za-z0-9_]{1,40})\/(\d{1,3})$/.exec(scope))) {
    const slug = slugOfPages.get(m[1]);
    return slug ? { type: 'unit', prefix: `u:${m[1]}/${m[2]}/`, pages: m[1], unit: Number(m[2]), slug } : null;
  }
  if ((m = /^(tb|rd):([a-z0-9]{2,60})$/.exec(scope))) {
    const t = catalog.textbooks[m[2]];
    return t && (m[1] === 'rd') === (t.kind === 'reading') ? { type: m[1], prefix: `${m[1]}:${m[2]}/`, testSlug: m[2], code: t.code } : null;
  }
  if ((m = /^sp:([A-Za-z0-9_-]{1,60})$/.exec(scope))) return { type: 'sp', prefix: `sp:${m[1]}/`, page: m[1] };
  return null;
}

/* The upper bound of every qid beginning with `prefix` (which ends in "/"):
   the "/" becomes the next character. A range, not LIKE, since "_" is a
   wildcard in LIKE and appears in qids. */
const upper = (prefix) => prefix.slice(0, -1) + String.fromCharCode(prefix.charCodeAt(prefix.length - 1) + 1);
const indexOf = (qid) => Number(qid.slice(qid.lastIndexOf('/') + 1));

/** The questions a scope holds: { qids: {mc, fill, sa}, meta }. Null when the
 *  keys have not been synced (tools/sync-grading-keys.mjs). */
export async function loadScope(env, scope) {
  const info = parseScope(scope);
  if (!info) return null;
  // Only the test's meta row and a textbook's fill rows (for their group) need their JSON read here;
  // a unit's 40 keys are most of its weight and are fetched one at a time when a question is answered.
  const rows = (await env.DB.prepare(
    `SELECT qid, kind, CASE WHEN kind = 'meta' OR (kind = 'fill' AND source != 'unit') THEN data_json END AS data_json
     FROM grading_keys WHERE qid >= ? AND qid < ?`).bind(info.prefix, upper(info.prefix)).all()).results ?? [];
  const qids = { mc: [], fill: [], sa: [] };
  let meta = null;
  const groups = {};
  for (const r of rows) {
    if (r.kind === 'meta') { meta = JSON.parse(r.data_json); continue; }
    if (qids[r.kind]) {
      qids[r.kind].push(r.qid);
      if (r.kind === 'fill' && r.data_json) groups[r.qid] = JSON.parse(r.data_json).group ?? null;
    }
  }
  for (const k of Object.keys(qids)) qids[k].sort((a, b) => indexOf(a) - indexOf(b));
  if (!qids.mc.length && !qids.fill.length && !qids.sa.length) return null;
  return { ...info, scope, qids, meta, groups };
}

export async function loadKeys(env, qids) {
  const out = new Map();
  for (let i = 0; i < qids.length; i += 50) {
    const part = qids.slice(i, i + 50);
    const rows = (await env.DB.prepare(`SELECT qid, kind, data_json, rubric_version FROM grading_keys WHERE qid IN (${part.map(() => '?').join(',')})`)
      .bind(...part).all()).results ?? [];
    for (const r of rows) out.set(r.qid, { qid: r.qid, kind: r.kind, key: JSON.parse(r.data_json), rubricVersion: r.rubric_version });
  }
  return out;
}

/* ---- the draw of a textbook or reading test --------------------------------
   Twenty from forty, the same way the page used to draw them
   (public/assets/js/cts-textbook.js newDraw): by group when the bank says
   how many to take from each reading or chapter. Seeded by the attempt id, so
   the draw is a function of the attempt and needs no column of its own. */
function seeded(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => {
    h = (h + 0x6D2B79F5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled(list, rnd) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
export function drawFor(scope, attemptId) {
  const all = scope.qids.fill;
  const meta = scope.meta;
  if (!meta || !meta.draw) return all;
  const rnd = seeded(`${attemptId}|${scope.scope}`);
  const per = meta.perReading || meta.perChapter;
  const take = Math.min(meta.draw, all.length);
  if (per) {
    const groups = new Map();
    for (const q of all) { const g = scope.groups[q]; if (!groups.has(g)) groups.set(g, []); groups.get(g).push(q); }
    let picked = [];
    for (const g of [...groups.keys()].sort((a, b) => a - b)) picked = picked.concat(shuffled(groups.get(g), rnd).slice(0, per));
    return shuffled(picked, rnd).slice(0, take);
  }
  return shuffled(all, rnd).slice(0, take);
}

/* ---- students and attempts --------------------------------------------------- */

export async function loadStudent(env, id) {
  return await env.DB.prepare('SELECT id, name, email, email_verified_at, country, track, goal, lang FROM students WHERE id = ?').bind(id).first();
}
export const trackOf = (student) => studentLevel(student.track, student.goal);

export async function loadAttempt(env, id) {
  return await env.DB.prepare('SELECT * FROM attempts WHERE id = ?').bind(String(id || '')).first();
}

/** The questions an attempt shows, in the order the page renders them.
 *  `full` ignores what is banked (used for the totals the rules count against). */
export function itemsOf(scope, attempt, rows) {
  if (attempt.shadow && (scope.type === 'tb' || scope.type === 'rd'))
    return { mc: [], fill: [...new Set(rows.filter((r) => r.kind === 'fill').map((r) => r.qid))], sa: [] };
  return { mc: scope.qids.mc, fill: scope.type === 'tb' || scope.type === 'rd' ? drawFor(scope, attempt.id) : scope.qids.fill, sa: scope.qids.sa };
}

async function gradesOf(env, attemptId) {
  return (await env.DB.prepare('SELECT * FROM answer_grades WHERE attempt_id = ? ORDER BY id').bind(attemptId).all()).results ?? [];
}

/** Earlier work that still counts: a multiple-choice pass, and the short
 *  answers already met. Real attempts only (the shadow trial banks nothing),
 *  and only attempts before this one and after the last pass: once a unit is
 *  passed, another attempt at it is practice and starts from nothing. */
export async function bankedFor(env, studentId, scope, attemptId) {
  const prior = (await env.DB.prepare(
    `SELECT id, status, mc_right, mc_total FROM attempts
     WHERE student_id = ? AND scope = ? AND shadow = 0 AND rowid < COALESCE((SELECT rowid FROM attempts WHERE id = ?), 9223372036854775807)
     ORDER BY rowid DESC`).bind(studentId, scope, attemptId || '').all()).results ?? [];
  const ids = [];
  let mc = false;
  for (const a of prior) {
    if (a.status === 'passed') break;
    ids.push(a.id);
    if (a.mc_total > 0 && a.mc_right * 10 >= a.mc_total * 9) mc = true;
  }
  if (!ids.length) return { mc, sa: [], saText: {} };
  const sa = (await env.DB.prepare(
    `SELECT qid, answer_text FROM answer_grades WHERE kind = 'sa' AND verdict = 'met' AND attempt_id IN (${ids.map(() => '?').join(',')}) ORDER BY id`)
    .bind(...ids).all()).results ?? [];
  // the student's own words that met the standard (the latest, if more than one attempt got there)
  const saText = {};
  for (const r of sa) saText[r.qid] = r.answer_text;
  return { mc, sa: Object.keys(saText), saText };
}

/** Where the student stands on this attempt, by the rules for their track. */
export async function standing(env, attempt, scope) {
  const rows = await gradesOf(env, attempt.id);
  const items = itemsOf(scope, attempt, rows);
  const banked = attempt.shadow ? { mc: false, sa: [], saText: {} } : await bankedFor(env, attempt.student_id, attempt.scope, attempt.id);
  const meta = scope.type === 'tb' || scope.type === 'rd' ? (scope.meta || { pass: items.fill.length }) : null;
  const totals = { mc: scope.type === 'tb' || scope.type === 'rd' ? 0 : items.mc.length, fill: items.fill.length, sa: items.sa.length };
  const req = requirements(attempt.track, totals, meta);
  const mine = (kind, v) => rows.filter((r) => r.kind === kind && r.verdict === v).length;
  const saMetSet = new Set([...banked.sa, ...rows.filter((r) => r.kind === 'sa' && r.verdict === 'met').map((r) => r.qid)]);
  const saPending = rows.filter((r) => r.kind === 'sa' && r.verdict === 'pending' && !saMetSet.has(r.qid)).length;
  const state = {
    mcRight: mine('mc', 'right'), mcBanked: banked.mc, mcPending: 0,
    fillRight: mine('fill', 'right'), fillPending: mine('fill', 'pending'),
    saMet: saMetSet.size, saPending,
  };
  return { rows, items, banked, totals, req, state, verdict: evaluate(req, state) };
}

/* ---- credit ------------------------------------------------------------------- */

/** Record the course as complete when the record now supports it: every unit,
 *  and on the master's tracks every test the course requires. Returns whether
 *  the course is complete and whether this call made it so. */
export async function completeCourseIfDone(env, student, code, level, current) {
  const c = resolveCourse(code);
  // A single-page course (Counseling, Narrative and WiseSpeak Preaching, Ethics) keeps its
  // units under its own name in unit_progress and has no entry in catalog.courses
  if (c && !c.units && SINGLES[c.code]) return await completeSingleIfDone(env, student, c.code, level, current);
  if (!c || !c.units) return { done: false, newly: false };
  const units = ((await env.DB.prepare('SELECT unit FROM unit_progress WHERE student_id = ? AND course = ?').bind(student.id, c.slug).all()).results ?? []).map((r) => r.unit);
  const tbs = ((await env.DB.prepare('SELECT textbook FROM textbook_results WHERE student_id = ?').bind(student.id).all()).results ?? []).map((r) => r.textbook);
  const held = (await env.DB.prepare('SELECT code, track, completed_at FROM course_completions WHERE student_id = ?').bind(student.id).all()).results ?? [];
  if (courseShortfall(c.slug, units, level, tbs, testContext(env, held))) {
    return { done: held.some((r) => r.code === c.code), newly: false };
  }
  const at = await earnedLevel(env, student, c.code, level, held, unitEvidence(env, student.id, c.slug, `u:${catalog.courses[c.slug].pages}/`, (scope) => Number(scope.slice(scope.lastIndexOf('/') + 1)), false, current));
  return at ? await writeCompletion(env, student, c.code, at, held) : { done: held.some((r) => r.code === c.code), newly: false };
}

/* The level a completion may be written at (ChatGPT's review of #125, 19 Oct
   2026). Units and the required tests are not enough to raise a completion: a
   student who finished a course on the Certificate track and moved to the
   Th.M. would otherwise become a master's completion by passing the reading
   tests alone. So an Associate or master's completion needs, for each unit, a
   passed live attempt at that level or above (attempts.track, the record's
   level when the attempt began).
   - A unit credited before live grading (unit_progress.source other than
     'server') still counts towards a FIRST completion, as it always has: that
     record holds no level, and earlier credit is kept.
   - Raising an existing completion (cert -> assoc, assoc -> master's) counts
     only live attempts: earlier credit never raises a level.
   Returns the level to write: the one asked, or, when that is not earned, the
   best level the units support; null when not even that may be written. */
const RANK = { cert: 0, assoc: 1, thm: 2, mdiv: 2 };
async function earnedLevel(env, student, code, level, held, evidence) {
  const want = studentLevel(level);
  if (RANK[want] === 0) return want;
  const prior = held.find((r) => r.code === code);
  const { units, best } = await evidence;          // best: unit -> highest live rank passed; units: unit -> source
  const upgrade = !!prior;
  const ok = (rank) => [...units.keys()].every((u) => (best.get(u) ?? -1) >= rank || (!upgrade && units.get(u) !== 'server'));
  if (ok(RANK[want])) return want;
  if (want !== 'assoc' && ok(RANK.assoc)) return 'assoc';
  return prior ? null : 'cert';
}

/* For one course: the source of each unit's credit, and the highest level of a
   passed live attempt on it. `prefix` is the attempts.scope prefix of its unit
   scopes; `unitOf` reads the unit from a scope (null to skip it). */
async function unitEvidence(env, studentId, course, prefix, unitOf, meta, current) {
  const units = new Map(((await env.DB.prepare('SELECT unit, source FROM unit_progress WHERE student_id = ? AND course = ?').bind(studentId, course).all()).results ?? [])
    .map((r) => [Number(r.unit), r.source]));
  const rows = meta
    ? ((await env.DB.prepare(
        `SELECT a.scope, a.track, k.data_json FROM attempts a JOIN grading_keys k ON k.qid = a.scope || '/meta/0'
         WHERE a.student_id = ? AND a.status = 'passed' AND a.shadow = 0 AND a.scope >= ? AND a.scope < ?`)
        .bind(studentId, prefix, upper(prefix)).all()).results ?? [])
    : ((await env.DB.prepare(
        `SELECT scope, track FROM attempts WHERE student_id = ? AND status = 'passed' AND shadow = 0 AND scope >= ? AND scope < ?`)
        .bind(studentId, prefix, upper(prefix)).all()).results ?? []);
  // The attempt being credited now is marked passed only after its credit is
  // written (creditPass), so it is counted here as the pass it is.
  if (current && current.scope >= prefix && current.scope < upper(prefix)) rows.push(current);
  const best = new Map();
  for (const r of rows) {
    const u = unitOf(r.scope, r.data_json);
    if (u == null || Number.isNaN(u)) continue;
    const rank = RANK[studentLevel(r.track)] ?? 0;
    if (rank > (best.get(u) ?? -1)) best.set(u, rank);
  }
  return { units, best };
}

/** The same check for a single-page course: every one of its units passed (unit_progress
 *  under the course's own name) and, on the master's tracks, its required tests. */
export async function completeSingleIfDone(env, student, code, level, current) {
  const s = SINGLES[code];
  const units = ((await env.DB.prepare('SELECT unit FROM unit_progress WHERE student_id = ? AND course = ?').bind(student.id, s.course).all()).results ?? []).map((r) => r.unit);
  const held = (await env.DB.prepare('SELECT code, track, completed_at FROM course_completions WHERE student_id = ?').bind(student.id).all()).results ?? [];
  const have = new Set(units.map(Number));
  if (s.units.some((u) => !have.has(u))) return { done: held.some((r) => r.code === code), newly: false };
  const tbs = ((await env.DB.prepare('SELECT textbook FROM textbook_results WHERE student_id = ?').bind(student.id).all()).results ?? []).map((r) => r.textbook);
  if (textbookShortfall(code, level, tbs, testContext(env, held))) return { done: held.some((r) => r.code === code), newly: false };
  const at = await earnedLevel(env, student, code, level, held, unitEvidence(env, student.id, s.course, 'sp:', (scope, data) => {
    try { const m = JSON.parse(data || '{}'); return m.course === s.course && m.unit != null ? Number(m.unit) : null; } catch { return null; }
  }, true, current));
  return at ? await writeCompletion(env, student, code, at, held) : { done: held.some((r) => r.code === code), newly: false };
}

export async function writeCompletion(env, student, code, level, held) {
  held = held || (await env.DB.prepare('SELECT code, track, completed_at FROM course_completions WHERE student_id = ?').bind(student.id).all()).results || [];
  const had = held.some((r) => r.code === code);
  // A completion's level only rises (the same rule as /api/sync).
  await env.DB.prepare(
    `INSERT INTO course_completions (student_id, code, track, completed_at, source) VALUES (?, ?, ?, ?, 'server')
     ON CONFLICT(student_id, code) DO UPDATE SET track = excluded.track, source = 'server'
     WHERE (course_completions.track IS NULL AND excluded.track IS NOT NULL)
        OR (course_completions.track = 'cert' AND excluded.track IN ('assoc', 'thm', 'mdiv'))
        OR (course_completions.track = 'assoc' AND excluded.track IN ('thm', 'mdiv'))`)
    .bind(student.id, code, level, nowIso()).run();
  if (!had) await notifyBatch(env, student, [{ kind: 'course', code, track: level }]);
  return { done: true, newly: !had };
}

/* A pass is credit. Idempotent: an earlier pass (a legacy row, or the same
   attempt settled twice) keeps its own time and source. */
async function creditPass(env, attempt, scope) {
  const student = await loadStudent(env, attempt.student_id);
  if (!student) return { unitDone: false, courseDone: false };
  const t = nowIso();
  if (scope.type === 'unit') {
    await env.DB.prepare(
      `INSERT INTO unit_progress (student_id, course, unit, completed_at, source) VALUES (?, ?, ?, ?, 'server')
       ON CONFLICT(student_id, course, unit) DO NOTHING`).bind(student.id, scope.slug, scope.unit, t).run();
    const c = await completeCourseIfDone(env, student, scope.slug, attempt.track, { scope: attempt.scope, track: attempt.track });
    return { unitDone: true, courseDone: c.done, courseNew: c.newly };
  }
  if (scope.type === 'tb' || scope.type === 'rd') {
    await env.DB.prepare(
      `INSERT INTO textbook_results (student_id, textbook, passed_at, source) VALUES (?, ?, ?, 'server')
       ON CONFLICT(student_id, textbook) DO NOTHING`).bind(student.id, scope.testSlug, t).run();
    const c = await completeCourseIfDone(env, student, scope.code, attempt.track);
    return { unitDone: true, courseDone: c.done, courseNew: c.newly };
  }
  if (scope.type === 'sp') {
    // A single-page course: each unit is a scope of its own. A pass is recorded in unit_progress
    // under the course's name, and the course completes when its last unit (and, on the master's
    // tracks, its required tests) is in. The meta row (sp:<page>/meta/0) names the code and unit.
    const m = scope.meta || {};
    if (m.course && m.unit != null) {
      await env.DB.prepare(
        `INSERT INTO unit_progress (student_id, course, unit, completed_at, source) VALUES (?, ?, ?, ?, 'server')
         ON CONFLICT(student_id, course, unit) DO NOTHING`).bind(student.id, m.course, m.unit, t).run();
    }
    if (!m.code) return { unitDone: true, courseDone: false };
    const c = SINGLES[m.code] ? await completeSingleIfDone(env, student, m.code, attempt.track, { scope: attempt.scope, track: attempt.track, data_json: JSON.stringify(m) }) : { done: false, newly: false };
    return { unitDone: true, courseDone: c.done, courseNew: c.newly };
  }
  return { unitDone: false, courseDone: false };
}

/* The completion check for the course an attempt belongs to, read from the
   record as it stands (this attempt already marked passed). */
async function reconcileCourse(env, attempt, scope) {
  const none = { done: false, newly: false };
  const student = await loadStudent(env, attempt.student_id);
  if (!student) return none;
  if (scope.type === 'unit') return await completeCourseIfDone(env, student, scope.slug, attempt.track);
  if (scope.type === 'tb' || scope.type === 'rd') return await completeCourseIfDone(env, student, scope.code, attempt.track);
  if (scope.type === 'sp') {
    const code = scope.meta?.code || Object.keys(SINGLES).find((k) => SINGLES[k].course === scope.meta?.course);
    return code && SINGLES[code] ? await completeSingleIfDone(env, student, code, attempt.track) : none;
  }
  return none;
}

async function alreadyCredited(env, attempt, scope) {
  if (scope.type === 'unit')
    return !!(await env.DB.prepare('SELECT 1 FROM unit_progress WHERE student_id = ? AND course = ? AND unit = ?').bind(attempt.student_id, scope.slug, scope.unit).first());
  if (scope.type === 'tb' || scope.type === 'rd')
    return !!(await env.DB.prepare('SELECT 1 FROM textbook_results WHERE student_id = ? AND textbook = ?').bind(attempt.student_id, scope.testSlug).first());
  if (scope.type === 'sp' && scope.meta && scope.meta.course && scope.meta.unit != null)
    return !!(await env.DB.prepare('SELECT 1 FROM unit_progress WHERE student_id = ? AND course = ? AND unit = ?').bind(attempt.student_id, scope.meta.course, scope.meta.unit).first());
  if (scope.type === 'sp' && scope.meta && scope.meta.code)
    return !!(await env.DB.prepare('SELECT 1 FROM course_completions WHERE student_id = ? AND code = ?').bind(attempt.student_id, scope.meta.code).first());
  return false;
}

/* ---- settling an attempt --------------------------------------------------------- */

/** Work out where an attempt stands and write what follows: credit on a pass,
 *  the lockout on a fail, nothing while an item is still pending. Used by
 *  Submit, by the queue when a pending item is graded, and by the faculty pages
 *  after a human grade or an appeal (which may turn a fail into a pass).
 *  Never takes credit away. A shadow attempt is only measured.
 *  Returns the reply the API gives for a submit. */
export async function settle(env, attemptId, { submitting = false } = {}) {
  const attempt = await loadAttempt(env, attemptId);
  if (!attempt) return null;
  const scope = await loadScope(env, attempt.scope);
  if (!scope) return null;
  const was = attempt.status;
  const st = await standing(env, attempt, scope);
  const t = nowIso();
  let status = st.verdict.status;
  if (was === 'passed') status = 'passed';          // a pass stays

  const s = st.state, tot = st.totals;
  const scores = {
    mc_right: st.banked.mc ? null : s.mcRight, mc_total: st.banked.mc || !tot.mc ? null : tot.mc,
    fill_right: s.fillRight, fill_total: tot.fill || null,
    sa_met: s.saMet, sa_total: tot.sa || null,
  };
  let lockedUntil = attempt.locked_until, lockK = attempt.lock_kind;
  let credit = { unitDone: false, courseDone: false };

  if (status === 'passed') {
    lockedUntil = null; lockK = null;
    if (!attempt.shadow && was !== 'passed') credit = await creditPass(env, attempt, scope);
  } else if (status === 'failed') {
    if (!attempt.shadow && was !== 'failed') {
      // Practising a test already passed never locks anyone out.
      if (!(await alreadyCredited(env, attempt, scope))) {
        const from = submitting ? Date.parse(t) : Date.parse(attempt.submitted_at || t);
        // a single-page course may set its own wait (Narrative and WiseSpeak Preaching: 15 minutes on every track)
        const wait = scope.type === 'sp' && scope.meta?.lockMinutes ? scope.meta.lockMinutes : lockMinutes(attempt.track);
        lockedUntil = new Date(from + wait * 60000).toISOString();
        lockK = scope.type === 'unit' || scope.type === 'sp' ? lockKind(st.verdict.mcOK) : 'full';
      }
    }
  }
  await env.DB.prepare(
    `UPDATE attempts SET status = ?, mc_right = ?, mc_total = ?, fill_right = ?, fill_total = ?, sa_met = ?, sa_total = ?,
       locked_until = ?, lock_kind = ?, submitted_at = COALESCE(submitted_at, ?), graded_at = ? WHERE id = ?`)
    .bind(status, scores.mc_right, scores.mc_total, scores.fill_right, scores.fill_total, scores.sa_met, scores.sa_total,
      lockedUntil, lockK, t, status === 'pending' ? attempt.graded_at : (attempt.graded_at || t), attempt.id).run();

  // Reconcile the course once this pass is on record (ChatGPT's review of #125,
  // 19 Oct 2026). creditPass runs before the attempt is marked passed, so two
  // last units settling together could each see only its own pass and write
  // the completion below the level both earned. Checked again now, whichever
  // settles last sees every pass; and a pass whose reconcile was interrupted
  // is checked again the next time it is settled. Idempotent, and a level
  // only rises (writeCompletion).
  if (status === 'passed' && !attempt.shadow) {
    const again = await reconcileCourse(env, attempt, scope);
    if (again.done) credit = { ...credit, courseDone: true, courseNew: credit.courseNew || again.newly };
  }

  return {
    was, status, attempt: { ...attempt, status, locked_until: lockedUntil, lock_kind: lockK },
    result: await resultOf(env, { ...attempt, status, locked_until: lockedUntil, lock_kind: lockK }, scope, st),
    credit,
  };
}

/* ---- what the API says about an attempt ------------------------------------------- */

const lockOf = (a) => (a.locked_until && Date.parse(a.locked_until) > Date.now() ? { until: a.locked_until, kind: a.lock_kind } : null);

/* ---- what the student may see: the answer-disclosure policy ----------------------
   Wayne Cook, 18 Oct 2026 (it replaces showing the right answer at once):
   while an attempt is open -- and after it is submitted, unless it passed --
   the student is told right or wrong and nothing more: no right option, no
   explanation, no answer wanted, no model answer, no teaching passage, and no
   feedback the AI wrote about a wrong answer (it may name what was wanted).
   Once the attempt has PASSED, all of it may be shown for review.
   Every reply that says anything about an attempt asks this one function. */
export function disclosureOf(attempt) {
  return attempt && !attempt.shadow && attempt.status === 'passed' ? 'review' : 'verdict';
}
/* Feedback on a written answer that may be shown while only the verdict is
   disclosed: ONLY the seminary's own fixed sentences (CANNED: a blank, too
   short, a copied question, held for a person, waiting), matched exactly,
   whoever graded the item. Anything written in free form -- by the model, the
   grading cache or a faculty member, about a right, met, pending or wrong
   answer -- can name what was wanted, so it is held back until the attempt has
   passed (Wayne, 18 Oct 2026: right or wrong only before a pass; ChatGPT's
   review of #124 found AI feedback on a met answer and human feedback on a
   wrong one passing through). */
let FIXED;
export function feedbackFor(row, disclosure) {
  const fb = row.feedback || null;
  if (!fb || disclosure === 'review') return fb;
  FIXED ??= new Set(Object.values(CANNED).flatMap((byLang) => Object.values(byLang)));
  return FIXED.has(fb) ? fb : null;
}

/* What the student has done in an attempt, as the page reads it (docs/ai-grading.md section 12).
   Always: the multiple-choice choice and verdict, the student's own text, who
   graded it (`gradedBy`), feedback as feedbackFor allows, and a banked short
   answer (met, with the text that met it). Only with disclosure 'review' (a
   passed attempt): the right option and explanation of each multiple choice,
   and the answer wanted for a fill-in graded wrong. */
export async function answeredOf(env, rows, banked, lang, disclosure = 'verdict') {
  const review = disclosure === 'review';
  const need = review ? rows.filter((r) => r.kind === 'mc' || (r.kind === 'fill' && r.verdict === 'wrong')).map((r) => r.qid) : [];
  const keys = need.length ? await loadKeys(env, need) : new Map();
  const out = {};
  for (const q of banked.sa) out[q] = { verdict: 'met', feedback: null, banked: true, ...(banked.saText && banked.saText[q] ? { answerText: banked.saText[q] } : {}) };
  for (const r of rows) {
    const a = { gradeId: r.id, verdict: r.verdict, feedback: feedbackFor(r, disclosure), gradedBy: r.graded_by };
    if (r.kind === 'mc') {
      a.choice = Number(r.answer_text);
      const k = review ? keys.get(r.qid)?.key : null;
      if (k) { a.answer = k.answer; a.why = pick(k.why, lang) || null; }
    } else {
      a.answerText = r.answer_text;
      if (review && r.kind === 'fill' && r.verdict === 'wrong') { const k = keys.get(r.qid)?.key; if (k) a.correctAnswer = pick(k.answer, lang) || undefined; }
    }
    out[r.qid] = a;
  }
  return out;
}

/* The model answers of the short answers, for review once the attempt has
   passed -- never while it is open and never after a failure, when they would
   be copied into the retake -- and, as before, only on a track where short
   answers are for reflection and not graded. The page shows each beside a
   short answer the student wrote. */
async function modelAnswersOf(env, attempt, scope, st) {
  if (disclosureOf(attempt) !== 'review' || st.req.sa.need || !st.items.sa.length) return undefined;
  const keys = await loadKeys(env, st.items.sa);
  const out = {};
  for (const q of st.items.sa) { const m = keys.get(q)?.key.model; if (m && typeof m === 'object') out[q] = m; }
  return Object.keys(out).length ? out : undefined;
}

/* The teaching passages for the questions of a textbook or reading test the
   student missed, once the attempt has passed (tools/exam-review.mjs). They are
   chosen because they contain the answer, so a live build does not put them on
   the page: they sit in the static assets as /assets/exam-review/<test>.<lang>.json,
   which worker/index.js refuses to serve, and only this reads them. */
async function reviewPassagesOf(env, attempt, scope, st) {
  if (disclosureOf(attempt) !== 'review' || (scope.type !== 'tb' && scope.type !== 'rd') || !env.ASSETS) return undefined;
  const right = new Set(st.rows.filter((r) => r.kind === 'fill' && r.verdict === 'right').map((r) => r.qid));
  const missed = st.items.fill.filter((q) => !right.has(q));
  if (!missed.length) return undefined;
  let bank = null;
  for (const lang of [attempt.lang, 'en']) {
    try {
      const res = await env.ASSETS.fetch(new Request(`https://assets.local/assets/exam-review/${scope.testSlug}.${lang}.json`));
      if (res.ok) { bank = await res.json(); break; }
    } catch { /* no passages: the page links to the book instead */ }
  }
  if (!bank || bank.slug !== scope.testSlug || !Array.isArray(bank.questions)) return undefined;
  const out = {};
  for (const q of missed) { const p = bank.questions[indexOf(q)]; if (p) out[q] = p; }
  return Object.keys(out).length ? out : undefined;
}

/* The wording of the questions a textbook or reading attempt actually drew.
   The live page ships an empty bank, so this is the only prompt text it gets.
   Language strings only: never answer, accept, or any other key field. */
function promptLanguages(prompt) {
  if (!prompt || typeof prompt !== 'object' || Array.isArray(prompt)) return {};
  const out = {};
  for (const l of ['en', 'es', 'fr']) if (typeof prompt[l] === 'string' && prompt[l]) out[l] = prompt[l];
  return out;
}
export async function promptsFor(env, scope, qids) {
  if (!scope || (scope.type !== 'tb' && scope.type !== 'rd') || !qids?.length) return undefined;
  const keys = await loadKeys(env, qids);
  return qids.map((qid) => ({ qid, prompt: promptLanguages(keys.get(qid)?.key?.prompt) }));
}

export async function resultOf(env, attempt, scope, st) {
  st = st || await standing(env, attempt, scope);
  const disclosure = disclosureOf(attempt);
  const part = (name, right) => ({ right, total: st.req[name].total, need: st.req[name].need });
  const unitDone = attempt.status === 'passed' || await alreadyCredited(env, attempt, scope);
  let courseDone = false;
  const code = scope.type === 'unit' ? resolveCourse(scope.slug)?.code : scope.type === 'sp' ? scope.meta?.code : scope.code;
  if (code) courseDone = !!(await env.DB.prepare('SELECT 1 FROM course_completions WHERE student_id = ? AND code = ?').bind(attempt.student_id, code).first());
  const models = await modelAnswersOf(env, attempt, scope, st);
  const reviews = await reviewPassagesOf(env, attempt, scope, st);
  const prompts = await promptsFor(env, scope, st.items.fill);
  return {
    attemptId: attempt.id, scope: attempt.scope, status: attempt.status, disclosure,
    scores: { mc: { ...part('mc', st.state.mcRight), banked: st.banked.mc }, fill: part('fill', st.state.fillRight), sa: part('sa', st.state.saMet) },
    lock: lockOf(attempt), unitDone, courseDone,
    answered: await answeredOf(env, st.rows, st.banked, attempt.lang, disclosure),
    ...(prompts ? { prompts } : {}),
    ...(models ? { models } : {}),
    ...(reviews ? { reviews } : {}),
  };
}

/** The reply to POST /api/attempt. */
export async function attemptView(env, attempt, scope, keys) {
  const st = await standing(env, attempt, scope);
  const disclosure = disclosureOf(attempt);
  const answered = await answeredOf(env, st.rows, st.banked, attempt.lang, disclosure);
  const mcAsked = st.banked.mc ? [] : st.items.mc;
  const whys = new Map();
  for (const q of mcAsked) if (answered[q] && answered[q].why) whys.set(q, answered[q].why);
  const models = await modelAnswersOf(env, attempt, scope, st);
  const prompts = await promptsFor(env, scope, st.items.fill);
  return {
    attemptId: attempt.id, scope: attempt.scope, status: attempt.status, track: attempt.track, lang: attempt.lang, disclosure,
    needs: { mc: st.req.mc.need, fill: st.req.fill.need, sa: st.req.sa.need },
    totals: { mc: st.req.mc.total, fill: st.req.fill.total, sa: st.req.sa.total },
    banked: { mc: st.banked.mc, fill: [], sa: st.banked.sa },
    answered,
    lock: lockOf(attempt),
    ...(prompts ? { prompts } : {}),
    ...(models ? { models } : {}),
    items: {
      mc: mcAsked.map((q) => (whys.get(q) ? { qid: q, why: whys.get(q) } : { qid: q })),
      fill: st.items.fill,
      sa: st.items.sa.filter((q) => !st.banked.sa.includes(q)),
    },
  };
}

/** A written answer the model could not grade yet: the 15-minute run tries again (queue.js). */
export async function enqueue(env, gradeId, error) {
  const t = nowIso();
  await env.DB.prepare('INSERT OR REPLACE INTO grade_queue (grade_id, attempts, next_try_at, last_error, created_at) VALUES (?, 0, ?, ?, ?)')
    .bind(gradeId, t, String(error || '').slice(0, 300), t).run();
}

/* ---- grading written answers ---------------------------------------------------------- */

const CANNED = {
  short: {
    en: `Your answer is too short to evaluate. Please expand your response to explain your understanding of the question.`,
    es: `Su respuesta es demasiado corta para evaluarla. Amplíe su respuesta para explicar su comprensión de la pregunta.`,
    fr: `Votre réponse est trop courte pour être évaluée. Veuillez la développer pour expliquer votre compréhension de la question.`,
  },
  copied: {
    en: 'This answer mostly repeats the question. Explain the idea in your own words.',
    es: 'Esta respuesta repite en su mayor parte la pregunta. Explique la idea con sus propias palabras.',
    fr: 'Cette réponse reprend surtout la question. Expliquez l’idée avec vos propres mots.',
  },
  held: {
    en: 'This answer has been sent to a faculty grader. You will see the result when it has been reviewed.',
    es: 'Esta respuesta se ha enviado a un profesor para su revisión. Verá el resultado cuando haya sido revisada.',
    fr: 'Cette réponse a été transmise à un correcteur de la faculté. Vous verrez le résultat une fois qu’elle aura été examinée.',
  },
  blank: { en: 'No answer was given.', es: 'No se dio ninguna respuesta.', fr: 'Aucune réponse n’a été donnée.' },
  waiting: {
    en: 'Saved. It will be graded shortly.', es: 'Guardada. Se calificará en breve.', fr: 'Enregistrée. Elle sera corrigée sous peu.',
  },
};
export const canned = (name, lang) => CANNED[name][lang] || CANNED[name].en;

/** Written items graded in the count of the last hour, for the per-student cap. */
export async function gradedThisHour(env, studentId) {
  const since = new Date(Date.now() - 3600 * 1000).toISOString();
  return (await env.DB.prepare(
    `SELECT COUNT(*) AS n FROM answer_grades WHERE student_id = ? AND kind IN ('fill','sa') AND created_at >= ?`).bind(studentId, since).first())?.n || 0;
}

async function lookupDecided(env, qid, lang, norm) {
  const o = await env.DB.prepare('SELECT verdict FROM grade_overrides WHERE qid = ? AND lang = ? AND norm_answer = ?').bind(qid, lang, norm).first();
  if (o) return { by: 'override', verdict: o.verdict, feedback: null };
  const c = await env.DB.prepare('SELECT verdict, feedback FROM grade_cache WHERE qid = ? AND lang = ? AND norm_answer = ?').bind(qid, lang, norm).first();
  if (c) {
    await env.DB.prepare('UPDATE grade_cache SET seen_count = seen_count + 1, last_seen = ? WHERE qid = ? AND lang = ? AND norm_answer = ?')
      .bind(nowIso(), qid, lang, norm).run();
    return { by: 'cache', verdict: c.verdict, feedback: c.feedback };
  }
  return null;
}

export async function cacheDecision(env, qid, lang, norm, verdict, feedback, model, version) {
  const t = nowIso();
  await env.DB.prepare(
    `INSERT INTO grade_cache (qid, lang, norm_answer, verdict, feedback, model, prompt_version, seen_count, first_seen, last_seen)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
     ON CONFLICT(qid, lang, norm_answer) DO UPDATE SET seen_count = seen_count + 1, last_seen = excluded.last_seen`)
    .bind(qid, lang, norm, verdict, feedback || null, model || null, version || null, t, t).run();
}

/** Grade written answers and write the rows. entries: [{ qid, kind, answer, key, rubricVersion }].
 *  The caller has checked ownership, lengths and that none is already graded.
 *  Returns one reply item per entry, in order. */
export async function gradeWritten(env, attempt, entries) {
  const deadline = Date.now() + GRADING_BUDGET_MS;
  const lang = attempt.lang;
  const { version } = modelsOf(env);
  const out = new Array(entries.length);
  const toModel = { fill: [], sa: [] };

  entries.forEach((e, i) => {
    const text = String(e.answer ?? '');
    if (e.kind === 'fill') {
      if (!normAnswer(text)) { out[i] = { verdict: 'wrong', by: 'rule', feedback: canned('blank', lang) }; return; }
      if (exactFill(e.key, text, lang)) { out[i] = { verdict: 'right', by: 'exact', feedback: null }; return; }
      toModel.fill.push(i);
      return;
    }
    if (!text.trim()) { out[i] = { verdict: 'not_met', by: 'rule', feedback: canned('blank', lang) }; return; }
    // short answer, in the order the contract sets: cheap rules, then injection, then the model
    const prompt = pick(e.key.prompt, lang);
    if (wordCount(text) < MIN_SA_WORDS) { out[i] = { verdict: 'needs_expansion', by: 'rule', feedback: canned('short', lang) }; return; }
    if (copiedOnly(prompt, text) || copiedOnly(pick(e.key.prompt, 'en'), text)) { out[i] = { verdict: 'not_met', by: 'rule', feedback: canned('copied', lang) }; return; }
    if (looksLikeInstruction(text)) { out[i] = { verdict: 'pending', by: 'rule', feedback: canned('held', lang), held: 'injection' }; return; }
    toModel.sa.push(i);
  });

  // Fill-ins an exact match did not settle: a faculty ruling, then a saved decision, then the model.
  const fillAsk = [];
  for (const i of toModel.fill) {
    const e = entries[i];
    const norm = normAnswer(e.answer);
    const known = await lookupDecided(env, e.qid, lang, norm);
    if (known) out[i] = { verdict: known.verdict, by: known.by, feedback: known.feedback };
    else fillAsk.push(i);
  }
  for (const [kind, idx] of [['fill', fillAsk], ['sa', toModel.sa]]) {
    if (!idx.length) continue;
    const batch = await gradeBatch(env, kind, lang, idx.map((i) => ({ qid: entries[i].qid, key: entries[i].key, answer: String(entries[i].answer) })), { deadline });
    for (const i of idx) {
      const r = batch.results.get(entries[i].qid);
      if (!r) { out[i] = { verdict: 'pending', by: 'ai', feedback: canned('waiting', lang), queue: batch.error || 'unresolved' }; continue; }
      if (r.verdict === 'pending') { out[i] = { verdict: 'pending', by: 'ai', feedback: canned('held', lang), held: 'model', model: r.model, version: r.version }; continue; }
      out[i] = { verdict: r.verdict, by: 'ai', feedback: r.feedback, points: r.points, record: r.record, model: r.model, version: r.version };
      if (kind === 'fill') await cacheDecision(env, entries[i].qid, lang, normAnswer(entries[i].answer), r.verdict, r.feedback, r.model, r.version);
    }
  }

  const t = nowIso();
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i], r = out[i];
    if (r.verdict === 'needs_expansion') continue; // revision request, never a grade
    const pending = r.verdict === 'pending';
    const res = await env.DB.prepare(
      `INSERT INTO answer_grades (attempt_id, student_id, qid, kind, lang, answer_text, verdict, feedback, points_json, graded_by,
         model, prompt_version, rubric_version, created_at, graded_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(attempt_id, qid) DO NOTHING RETURNING id`)
      .bind(attempt.id, attempt.student_id, e.qid, e.kind, lang, String(e.answer ?? '').slice(0, MAX_SA_CHARS), r.verdict, r.feedback || null,
        r.record ? JSON.stringify(r.record) : r.points ? JSON.stringify(r.points) : r.held ? JSON.stringify({ held: r.held }) : null, r.by,
        r.model || null, r.version || (r.by === 'ai' ? version : null), e.kind === 'sa' ? (e.rubricVersion ?? null) : null, t, pending ? null : t).first();
    if (!res) {
      // A simultaneous request wrote this answer first: its grade stands.
      const was = await env.DB.prepare('SELECT * FROM answer_grades WHERE attempt_id = ? AND qid = ?').bind(attempt.id, e.qid).first();
      out[i] = { verdict: was.verdict, feedback: was.feedback, gradeId: was.id, by: was.graded_by };
      continue;
    }
    r.gradeId = res.id;
    if (r.queue) await enqueue(env, res.id, r.queue);
  }
  // The attempt is open (the caller checked): the reply says only what disclosureOf allows for it.
  return out.map((r, i) => ({
    qid: entries[i].qid, gradeId: r.gradeId, verdict: r.verdict, feedback: feedbackFor(r, disclosureOf(attempt)), gradedBy: r.by || 'ai',
    // Rubric point ids can be words from the rubric; the page does not use
    // them, so they are sent only for review after a pass.
    ...(r.points && disclosureOf(attempt) === 'review' ? { points: r.points.map((p) => ({ id: p.id, made: p.made })) } : {}),
  }));
}

export { MAX_FILL_CHARS, MAX_SA_CHARS, HOURLY_CAP, counts, need };
