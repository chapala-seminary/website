/* What the faculty pages and the Monday digest read about written-answer
 * grading (docs/ai-grading.md, section 9). No HTML here, and no answer text
 * leaves this file except through the explicit queries that ask for it.
 *
 *   isoWeek / lastWeeks         the ISO week a date falls in ("2026-W42")
 *   calibrationSample           this week's 20 AI-graded short answers, the same 20 all week
 *   calibrationAgreement        AI against each grader, and grader against grader, over 4 weeks
 *   aiRecord / keepAiRecord     what the AI said about an answer a person has since re-graded
 *   estimateCost                dollars from tokens, at Cloudflare's published prices
 *   gradingDigestLine           the one line the Monday digest gains
 */
import { normalise, wordCount } from './text.js';

const DAY = 86400000;
export const SAMPLE_SIZE = 20;
export const AGREEMENT_WEEKS = 4;
export const AGREEMENT_FLOOR = 85;       // per cent; below it the digest says so

/* ---- ISO weeks ------------------------------------------------------------- */

const pad = (n) => String(n).padStart(2, '0');

/** The ISO 8601 week of a date, in UTC: "2026-W42". */
export function isoWeek(date = new Date()) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dow = d.getUTCDay() || 7;                      // Monday 1 .. Sunday 7
  d.setUTCDate(d.getUTCDate() + 4 - dow);              // the Thursday of this week decides the year
  const jan1 = Date.UTC(d.getUTCFullYear(), 0, 1);
  return `${d.getUTCFullYear()}-W${pad(Math.ceil(((d.getTime() - jan1) / DAY + 1) / 7))}`;
}
/** Midnight UTC on the Monday of the week a date falls in. */
export function weekStart(date = new Date()) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() || 7) - 1));
  return d;
}
/** This week and the n-1 before it, newest first. */
export const lastWeeks = (date = new Date(), n = AGREEMENT_WEEKS) =>
  Array.from({ length: n }, (_, i) => isoWeek(new Date(date.getTime() - i * 7 * DAY)));

/* ---- what the AI said, kept when a person re-grades ------------------------------ */

const parse = (s) => { try { return s ? JSON.parse(s) : null; } catch { return null; } };

/** { verdict, points, held } as the AI gave them. A re-grade by a person keeps
 *  these inside points_json (keepAiRecord), so the verdict column can change
 *  without the calibration figures forgetting what the AI said. */
export function aiRecord(row) {
  const pj = parse(row.points_json);
  const aiVerdict = row.graded_by === 'ai' && row.verdict !== 'pending' ? row.verdict : null;
  if (Array.isArray(pj)) return { verdict: aiVerdict, points: pj, held: null };
  if (pj && typeof pj === 'object') {
    return { verdict: pj.ai_verdict ?? (pj.held ? null : aiVerdict), points: pj.ai_points ?? null, held: pj.held ?? null };
  }
  return { verdict: aiVerdict, points: null, held: null };
}
/** The points_json to store when a person grades an answer. */
export function keepAiRecord(row) {
  const a = aiRecord(row);
  const out = {};
  if (a.verdict) out.ai_verdict = a.verdict;
  if (a.points) out.ai_points = a.points;
  if (a.held) out.held = a.held;
  return JSON.stringify(out);
}

/* ---- the weekly calibration sample ----------------------------------------------- */

function fnv(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
const AI_GRADED = `g.kind = 'sa' AND a.shadow = 0 AND g.verdict != 'pending' AND g.model IS NOT NULL
  AND (g.graded_by = 'ai' OR g.points_json LIKE '%"ai_verdict"%')`;

/** The grade ids for a week, in a fixed order. Chosen by a hash of the week and
 *  the id, so the same week gives the same twenty. The pool is what was graded
 *  before the week began (so it stops moving), or, while that is fewer than
 *  twenty, everything so far; answers already marked this week always stay. */
export async function calibrationSample(env, week, date = new Date()) {
  const marked = new Set(((await env.DB.prepare('SELECT DISTINCT grade_id FROM calibration WHERE week = ?').bind(week).all()).results ?? []).map((r) => r.grade_id));
  const startOf = weekStart(date).toISOString();
  let pool = ((await env.DB.prepare(`SELECT g.id FROM answer_grades g JOIN attempts a ON a.id = g.attempt_id WHERE ${AI_GRADED} AND g.created_at < ?`).bind(startOf).all()).results ?? []).map((r) => r.id);
  if (pool.length + marked.size < SAMPLE_SIZE)
    pool = ((await env.DB.prepare(`SELECT g.id FROM answer_grades g JOIN attempts a ON a.id = g.attempt_id WHERE ${AI_GRADED}`).all()).results ?? []).map((r) => r.id);
  const score = (id) => fnv(`${week}:${id}`);
  const rest = pool.filter((id) => !marked.has(id)).sort((x, y) => score(x) - score(y) || x - y).slice(0, Math.max(0, SAMPLE_SIZE - marked.size));
  return [...marked, ...rest].sort((x, y) => score(x) - score(y) || x - y);
}

/* ---- agreement ----------------------------------------------------------------------- */

const passes = (v) => v === 'met';
const pct = (same, n) => (n ? Math.round((same * 100) / n) : null);
function tally(pairs) {
  const n = pairs.length;
  const same = pairs.filter(([a, b]) => passes(a) === passes(b)).length;
  const exact = pairs.filter(([a, b]) => a === b).length;
  return { n, same, exact, pct: pct(same, n), exactPct: pct(exact, n) };
}

/** Agreement over the last four ISO weeks. "Agree" means the same outcome for
 *  the student: met, or not met ("partly" counts as not met, as it does for
 *  credit). `exact` also asks for the same one of met / partly / not met. */
export async function calibrationAgreement(env, date = new Date()) {
  const weeks = lastWeeks(date);
  const rows = (await env.DB.prepare(
    `SELECT c.grade_id, c.marked_by, c.human_verdict, g.verdict, g.graded_by, g.points_json
     FROM calibration c JOIN answer_grades g ON g.id = c.grade_id
     WHERE c.week IN (${weeks.map(() => '?').join(',')}) ORDER BY c.marked_by, c.grade_id`).bind(...weeks).all()).results ?? [];
  const marks = rows.map((r) => ({ grade: r.grade_id, by: r.marked_by, human: r.human_verdict, ai: aiRecord(r).verdict })).filter((m) => m.ai);
  const graders = [...new Set(marks.map((m) => m.by))].sort();
  const aiVsGrader = graders.map((by) => ({ grader: by, ...tally(marks.filter((m) => m.by === by).map((m) => [m.ai, m.human])) }));
  const graderVsGrader = [];
  for (let i = 0; i < graders.length; i++) for (let j = i + 1; j < graders.length; j++) {
    const a = new Map(marks.filter((m) => m.by === graders[i]).map((m) => [m.grade, m.human]));
    const pairs = marks.filter((m) => m.by === graders[j] && a.has(m.grade)).map((m) => [a.get(m.grade), m.human]);
    graderVsGrader.push({ a: graders[i], b: graders[j], ...tally(pairs) });
  }
  return { weeks, aiVsAll: tally(marks.map((m) => [m.ai, m.human])), aiVsGrader, graderVsGrader };
}

/* ---- the digest line --------------------------------------------------------------------- */

/** Answers waiting for a person: pending, and not in the model's queue. */
export async function facultyHeld(env) {
  return await env.DB.prepare(
    `SELECT COUNT(*) AS n, MIN(g.created_at) AS oldest FROM answer_grades g JOIN attempts a ON a.id = g.attempt_id
     WHERE g.verdict = 'pending' AND a.shadow = 0 AND g.kind IN ('sa', 'fill') AND g.id NOT IN (SELECT grade_id FROM grade_queue)`).first();
}

/** "Written-answer grading: ..." -- null when the grading tables are not there. */
export async function gradingDigestLine(env, date = new Date()) {
  try {
    const open = (await env.DB.prepare(`SELECT COUNT(*) AS n FROM appeals WHERE status = 'open'`).first())?.n || 0;
    const held = (await facultyHeld(env))?.n || 0;
    const cal = (await calibrationAgreement(env, date)).aiVsAll;
    const agree = cal.n
      ? `AI and faculty agree on ${cal.pct}% of ${cal.n} marked answers over ${AGREEMENT_WEEKS} weeks${cal.pct < AGREEMENT_FLOOR ? ` -- BELOW ${AGREEMENT_FLOOR}%: Robert decides whether to pause AI grading` : ''}`
      : `no calibration marks yet in the last ${AGREEMENT_WEEKS} weeks`;
    return `WRITTEN-ANSWER GRADING: ${open} open appeal${open === 1 ? '' : 's'}, ${held} answer${held === 1 ? '' : 's'} with faculty, ${agree}. ${env.SITE_ORIGIN || 'https://chapalaseminary.org'}/staff/grading`;
  } catch (e) {
    console.error('grading digest line failed', e && e.message);
    return null;
  }
}

/* ---- cost ------------------------------------------------------------------------------------ */

/* Dollars per million tokens, from Cloudflare's published Workers AI prices
   (October 2026). The plan's own per-call figures follow from the first row:
   3,500 tokens in and 1,200 out is about $0.004. A model not listed is priced
   as the first row, and the page says so. */
export const PRICES = {
  '@cf/meta/llama-3.3-70b-instruct-fp8-fast': { input: 0.293, output: 2.253 },
  '@cf/openai/gpt-oss-120b': { input: 0.35, output: 0.75 },
};
export const DEFAULT_PRICE = PRICES['@cf/meta/llama-3.3-70b-instruct-fp8-fast'];
export function estimateCost(model, inputTokens, outputTokens) {
  const known = !!PRICES[model];
  const p = PRICES[model] || DEFAULT_PRICE;
  return { dollars: (inputTokens * p.input + outputTokens * p.output) / 1e6, assumed: !known };
}

/* ---- copying ------------------------------------------------------------------------------------ */

export const COPY_MIN_WORDS = 12;

/** Identical short-answer text (after normalise, 12 words or more) from different
 *  students for the same question. Newest first. Answer text is returned, so
 *  this is for the staff pages only. */
export async function possibleCopying(env, { limit = 20000 } = {}) {
  const rows = (await env.DB.prepare(
    `SELECT g.id, g.qid, g.student_id, g.answer_text, g.verdict, g.created_at, g.lang FROM answer_grades g JOIN attempts a ON a.id = g.attempt_id
     WHERE g.kind = 'sa' AND a.shadow = 0 AND length(g.answer_text) >= 60 ORDER BY g.id DESC LIMIT ?`).bind(limit).all()).results ?? [];
  const groups = new Map();
  for (const r of rows) {
    if (wordCount(r.answer_text) < COPY_MIN_WORDS) continue;
    const key = `${r.qid}\u0000${normalise(r.answer_text).trim()}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }
  return [...groups.values()].filter((g) => new Set(g.map((r) => r.student_id)).size > 1)
    .sort((x, y) => y[0].id - x[0].id);
}
