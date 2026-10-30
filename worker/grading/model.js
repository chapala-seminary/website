/* The Workers AI call, its validation, and the fallback
 * (docs/ai-grading.md, section 8).
 *
 *   gradeBatch(env, kind, lang, items) -> { results, unresolved, error }
 *
 * `items` are { qid, key, answer }. Every item comes back in `results`
 * (a verdict, feedback, points) or in `unresolved` (the model could not be
 * made to give a valid answer: the caller marks it pending and queues it).
 *
 * Order of attempts: GRADER_MODEL, GRADER_MODEL again (one retry), then
 * GRADER_MODEL_FALLBACK, each only for the items still without a valid
 * answer. After each call, a point the model claimed whose quote is not the
 * student's words gets ONE repair call on the same model (section 8). A capacity or quota error (3036, 3040, 3007) stops at once: trying
 * another model would meet the same wall, and the queue will try again.
 */
import { normalise, fold } from './text.js';
import { buildMessages, schema, rubricOf, repairMessage } from './prompt.js';
import { fakeAIRun } from './fake-ai.js';
import { shortAnswerFeedback } from './feedback.js';

export const DEFAULT_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
export const DEFAULT_FALLBACK = '@cf/openai/gpt-oss-120b';
export const DEFAULT_VERSION = '2026-10-19.1';
const CAPACITY = /\b(3036|3040|3007)\b/;
const TIMEOUT_MS = 25000;
// Leave the browser's 60-second request deadline time for database writes.
// Retries and quote repairs share this budget rather than each consuming it.
export const GRADING_BUDGET_MS = 40000;

export const modelsOf = (env) => ({
  primary: env.GRADER_MODEL || DEFAULT_MODEL,
  fallback: env.GRADER_MODEL_FALLBACK || DEFAULT_FALLBACK,
  version: env.GRADER_PROMPT_VERSION || DEFAULT_VERSION,
});

/** Whether any grader is reachable at all (a real binding or the test fake). */
export const aiAvailable = (env) => !!(env.AI_FAKE || (env.AI && typeof env.AI.run === 'function'));

/* The text of a reply, whatever shape the model family returns it in. */
function replyText(res) {
  if (res == null) return null;
  if (typeof res === 'string') return res;
  const r = res.response ?? res.result?.response;
  if (r != null) return typeof r === 'string' ? r : JSON.stringify(r);
  const c = res.choices?.[0]?.message?.content;
  if (typeof c === 'string') return c;
  if (Array.isArray(res.output)) {
    const parts = [];
    for (const o of res.output) for (const p of o.content || []) if (typeof p.text === 'string') parts.push(p.text);
    if (parts.length) return parts.join('');
  }
  if (res.items) return JSON.stringify(res);
  return null;
}
function parseJson(text) {
  if (typeof text !== 'string') return null;
  const t = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try { return JSON.parse(t); } catch { /* fall through */ }
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch { /* not JSON */ } }
  return null;
}

async function addUsage(env, model, { calls = 0, input = 0, output = 0, errors = 0 }) {
  try {
    await env.DB.prepare(
      `INSERT INTO ai_usage (day, model, calls, input_tokens, output_tokens, errors) VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(day, model) DO UPDATE SET calls = calls + excluded.calls, input_tokens = input_tokens + excluded.input_tokens,
         output_tokens = output_tokens + excluded.output_tokens, errors = errors + excluded.errors`)
      .bind(new Date().toISOString().slice(0, 10), model, calls, input, output, errors).run();
  } catch (e) { console.error('ai_usage error', e && e.message); }
}

async function call(env, model, kind, lang, items, version, more = [], deadline = Date.now() + GRADING_BUDGET_MS) {
  const remaining = deadline - Date.now();
  if (remaining <= 0) throw new Error('grading request time budget reached');
  const params = {
    messages: [...buildMessages(kind, lang, items, version), ...more],
    response_format: { type: 'json_schema', json_schema: schema(kind) },
    max_tokens: 250 * items.length + 300,
    temperature: 0,
  };
  const run = env.AI_FAKE ? Promise.resolve().then(() => fakeAIRun(env, model, params)) : env.AI.run(model, params);
  let timer;
  const timeout = new Promise((_, rej) => {
    timer = setTimeout(() => {
      const error = new Error(remaining <= TIMEOUT_MS ? 'grading request time budget reached' : 'the model took too long');
      // Timers can fire just before Date.now() reaches the absolute deadline.
      // Once the shared-budget timer fires, its budget is spent regardless of
      // that rounding; do not start another provider call in the remaining ms.
      if (remaining <= TIMEOUT_MS) error.code = 'GRADING_DEADLINE';
      rej(error);
    }, Math.min(TIMEOUT_MS, remaining));
  });
  try { return await Promise.race([run, timeout]); } finally { clearTimeout(timer); }
}

/** The short-answer verdict, derived from the validated points (docs/ai-grading.md, section 5).
 *  The model's own verdict counts only when it is "pending". */
export function deriveVerdict(rubricPoints, points, contradicts) {
  if (contradicts) return 'not_met';
  const made = new Set(points.filter((p) => p.made).map((p) => p.id));
  // (a rubric with no essential point needs at least one point made)
  const essentials = rubricPoints.filter((x) => x.essential);
  if (essentials.length ? essentials.every((x) => made.has(x.id)) : made.size > 0) return 'met';
  return made.size ? 'partly' : 'not_met';
}

/* ---- quotes: is this the student's own text? ------------------------------
 * Both sides go through normalise + fold (case, punctuation, accents), so a
 * model that drops an accent while copying ("Él" -> "El") is not penalised.
 * Three ways in, all of which require the words to be the student's:
 *   1. the quote is a contiguous run of the answer's words;
 *   2. the quote is segments joined by "..." / "…", each of at least 3 words,
 *      each found in order;
 *   3. at least 90% of its words (it has 4 or more) appear in the answer in the
 *      same order (longest common subsequence), and no unmatched word is a
 *      negation, so a model cannot slip a "not" into the student's sentence.
 * A quote whose words are not in the student's text matches none of these. */
export const QUOTE_MIN_SEGMENT_WORDS = 3;
export const QUOTE_FUZZY_MIN_WORDS = 4;
export const QUOTE_FUZZY_SHARE = 0.9;
const NEGATIONS = new Set(['not', 'no', 'never', 'nor', 'neither', 'cannot', 'cant', 'dont', 'doesnt', 'isnt', 'arent', 'wasnt', 'wont', 'nunca', 'jamas', 'ni', 'tampoco', 'nada', 'ningun', 'ninguno', 'ninguna', 'sin', 'pas', 'ne', 'jamais', 'aucun', 'aucune', 'rien', 'plus', 'sans']);
const wordsOf = (s) => normalise(fold(s)).trim().split(' ').filter(Boolean);

function findRun(hay, seg, from) {
  for (let i = from; i + seg.length <= hay.length; i++) {
    let j = 0;
    while (j < seg.length && hay[i + j] === seg[j]) j++;
    if (j === seg.length) return i + seg.length;
  }
  return -1;
}
/** Which of the student's words the quote's words line up with, in order: a boolean per quote word. */
function lcsMatched(hay, q) {
  const n = hay.length, m = q.length;
  const L = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));
  for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--)
    L[i][j] = q[i] === hay[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const hit = new Array(m).fill(false);
  for (let i = 0, j = 0; i < m && j < n;) {
    if (q[i] === hay[j]) { hit[i] = true; i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++;
  }
  return hit;
}
/** { ok, how } for a quote against the answer's words (from wordsOf). */
export function quoteFound(quote, hay) {
  const raw = String(quote || '');
  const segs = raw.split(/\[\s*(?:\.{3}|…)\s*\]|\.{3,}|…/).map(wordsOf).filter((w) => w.length);
  if (!segs.length) return { ok: false, how: 'empty' };
  const all = segs.flat();
  if (segs.length === 1) {
    if (segs[0].join(' ').length >= 2 && findRun(hay, segs[0], 0) >= 0) return { ok: true, how: 'exact' };
  } else if (segs.every((g) => g.length >= QUOTE_MIN_SEGMENT_WORDS)) {
    let at = 0, all_in = true;
    for (const g of segs) { const e = findRun(hay, g, at); if (e < 0) { all_in = false; break; } at = e; }
    if (all_in) return { ok: true, how: 'segments' };
  }
  const q = all.slice(0, 80);
  if (q.length >= QUOTE_FUZZY_MIN_WORDS) {
    const hit = lcsMatched(hay, q);
    const found = hit.filter(Boolean).length;
    if (found >= Math.ceil(QUOTE_FUZZY_SHARE * q.length) && !q.some((w, i) => !hit[i] && NEGATIONS.has(w))) return { ok: true, how: 'fuzzy' };
  }
  return { ok: false, how: 'missing' };
}

/* One item of a short-answer reply, checked: which points were claimed and which claims failed. */
function inspectItem(r, it) {
  const rub = rubricOf(it.key);
  const hay = wordsOf(it.answer);
  const claims = new Map();
  const failed = [];
  let bad = !Array.isArray(r.points), claimed = 0;
  for (const p of Array.isArray(r.points) ? r.points : []) {
    if (!p || typeof p.id !== 'string' || typeof p.made !== 'boolean' || claims.has(p.id) || !rub.points.some((x) => x.id === p.id)) { bad = true; break; }
    let made = p.made;
    if (made) {
      claimed++;
      if (!quoteFound(p.quote, hay).ok) { made = false; failed.push({ id: p.id, quote: String(p.quote || '').slice(0, 300) }); }
    }
    claims.set(p.id, { id: p.id, made, quote: made ? String(p.quote).slice(0, 300) : '' });
  }
  return { rub, claims, failed, claimed, bad };
}

/* The result for a checked item, or null when the reply is not to be trusted:
   malformed, or more than half of the claimed quotes are not the student's words.
   `first` is the inspection of the model's first reply when this is a repaired one. */
function finalise(r, ins, repaired = [], first = null) {
  if (ins.bad || ins.failed.length * 2 > ins.claimed) return null;
  const points = ins.rub.points.map((x) => ins.claims.get(x.id) || { id: x.id, made: false, quote: '' });
  const contradicts = r.contradicts === true;
  const verdict = deriveVerdict(ins.rub.points, points, contradicts);
  const feedback = typeof r.feedback === 'string' ? r.feedback.trim().slice(0, 700) : '';
  const dropped = ins.failed;
  const record = { points, model_verdict: r.verdict, contradicts };
  if (dropped.length) record.dropped = dropped;
  if (dropped.length && verdict !== r.verdict) record.quote_dropped = true;
  if (repaired.length) { record.repaired = repaired; if (first) record.first_failed = first.failed; }
  return { verdict, feedback: verdict === r.verdict ? feedback : '', points, record };
}

/** Check a reply against what was sent. Returns { ok: Map qid->result, wholeBad: bool, repairs }.
 *  `repairs` lists the short-answer items whose reply is sound apart from quotes that are not the
 *  student's words: { qid, r, ins, ids }. They are not in `ok`; gradeBatch asks the model once to
 *  fix them, and finishes them (with the bad points dropped) either way. */
export function inspect(kind, parsed, items) {
  const ok = new Map(), repairs = [];
  if (!parsed || !Array.isArray(parsed.items)) return { ok, wholeBad: true, repairs };
  const sent = new Map(items.map((i) => [i.qid, i]));
  const seen = new Set();
  for (const r of parsed.items) {
    if (!r || typeof r.qid !== 'string' || !sent.has(r.qid) || seen.has(r.qid)) return { ok: new Map(), wholeBad: true, repairs: [] };
    seen.add(r.qid);
  }
  const allowed = kind === 'fill' ? ['right', 'wrong', 'pending'] : ['met', 'partly', 'not_met', 'pending'];
  for (const r of parsed.items) {
    const it = sent.get(r.qid);
    if (!allowed.includes(r.verdict)) continue;
    const feedback = typeof r.feedback === 'string' ? r.feedback.trim().slice(0, 700) : '';
    if (r.verdict === 'pending') { ok.set(r.qid, { verdict: 'pending', feedback: '', points: [], held: true }); continue; }
    if (kind === 'fill') { ok.set(r.qid, { verdict: r.verdict, feedback, points: [] }); continue; }
    // Short answers: a point counts as made only with a quote that is the student's own words.
    // The verdict is derived here, not taken from the model.
    const ins = inspectItem(r, it);
    if (ins.bad) continue;
    if (ins.failed.length) { repairs.push({ qid: r.qid, r, ins, ids: ins.failed.map((f) => f.id) }); continue; }
    const res = finalise(r, ins);
    if (res) ok.set(r.qid, res);
  }
  return { ok, wholeBad: false, repairs };
}

/** validate() with no repair call: failed quotes simply drop their points (used by tests and as the last step). */
export function validate(kind, parsed, items) {
  const { ok, wholeBad, repairs } = inspect(kind, parsed, items);
  for (const x of repairs) { const res = finalise(x.r, x.ins); if (res) ok.set(x.qid, res); }
  return { ok, wholeBad };
}

/* ONE repair call on the same model for the points whose quote was not the student's words:
   the model is told which points and asked for an exact contiguous quote of at most 15 words, or made:false.
   Whatever comes back, each item is finished here: a point still without a good quote is dropped,
   provided the rest of the reply is sound. A failed repair call changes nothing but the count. */
async function repair(env, model, kind, lang, items, version, parsed0, repairs, ok, deadline) {
  const sent = repairs.map((x) => items.find((i) => i.qid === x.qid));
  let again = new Map();
  try {
    const res = await call(env, model, kind, lang, items, version, [
      { role: 'assistant', content: JSON.stringify(parsed0) },
      { role: 'user', content: repairMessage(repairs.map((x) => ({ qid: x.qid, point_ids: x.ids }))) },
    ], deadline);
    const usage = res && res.usage || {};
    const parsed = parseJson(replyText(res));
    const got = parsed && Array.isArray(parsed.items) ? parsed.items.filter((r) => r && repairs.some((x) => x.qid === r.qid)) : [];
    const seen = new Set(got.map((r) => r.qid));
    const sane = got.length === seen.size;
    await addUsage(env, model, { calls: 1, errors: sane && got.length ? 0 : 1, input: Number(usage.prompt_tokens ?? usage.input_tokens) || 0, output: Number(usage.completion_tokens ?? usage.output_tokens) || 0 });
    if (sane) for (const r of got) if (['met', 'partly', 'not_met'].includes(r.verdict)) again.set(r.qid, r);
  } catch (e) {
    await addUsage(env, model, { calls: 1, errors: 1 });
  }
  repairs.forEach((x, k) => {
    const r2 = again.get(x.qid);
    let res = null;
    if (r2) {
      const ins2 = inspectItem(r2, sent[k]);
      if (!ins2.bad) {
        // the points that were claimed and failed at first: which are fixed now
        const fixed = x.ids.filter((id) => ins2.claims.get(id)?.made);
        res = finalise(r2, ins2, fixed, x.ins);
        // the model withdrawing a claim ("made": false) is a decision, not a dropped quote
      }
    }
    if (!res) res = finalise(x.r, x.ins);
    if (res) ok.set(x.qid, res);
  });
}

/* How many answers go to the model in one call. The model writes about three
 * seconds of output per written answer, so ten in one call ran past the 25 s
 * call limit and nearly every written answer fell back to the queue (and an
 * answer that hit a second error was lost from the student's view). Small
 * calls side by side finish well inside the limit. */
export const CHUNK = { fill: 10, sa: 3 };

export async function gradeBatch(env, kind, lang, items, { deadline = Date.now() + GRADING_BUDGET_MS, chunk = 0 } = {}) {
  if (chunk > 0 && items.length > chunk) {
    const parts = [];
    for (let i = 0; i < items.length; i += chunk) parts.push(items.slice(i, i + chunk));
    const done = await Promise.all(parts.map((p) => gradeBatch(env, kind, lang, p, { deadline })));
    const results = new Map();
    const unresolved = [];
    let error = null;
    for (const d of done) {
      for (const [qid, r] of d.results) results.set(qid, r);
      unresolved.push(...d.unresolved);
      if (d.error) error = d.error;
    }
    return { results, unresolved, error: unresolved.length ? error : null };
  }
  const { primary, fallback, version } = modelsOf(env);
  const results = new Map();
  let remaining = items.slice();
  let error = null;
  if (!aiAvailable(env)) return { results, unresolved: remaining, error: 'no AI binding' };

  for (const model of [primary, primary, fallback]) {
    if (!remaining.length) break;
    if (Date.now() >= deadline) { error = 'grading request time budget reached'; break; }
    let res;
    try { res = await call(env, model, kind, lang, remaining, version, [], deadline); }
    catch (e) {
      const msg = String((e && e.message) || e);
      error = msg.slice(0, 300);
      await addUsage(env, model, { calls: 1, errors: 1 });
      if (e?.code === 'GRADING_DEADLINE' || CAPACITY.test(msg) || CAPACITY.test(String(e && e.code))) break;
      continue;
    }
    const usage = res && res.usage || {};
    const parsed = parseJson(replyText(res));
    const { ok, wholeBad, repairs } = inspect(kind, parsed, remaining);
    await addUsage(env, model, {
      calls: 1, errors: wholeBad ? 1 : 0,
      input: Number(usage.prompt_tokens ?? usage.input_tokens) || 0, output: Number(usage.completion_tokens ?? usage.output_tokens) || 0,
    });
    if (repairs.length) await repair(env, model, kind, lang, remaining, version, parsed, repairs, ok, deadline);
    for (const [qid, r] of ok) {
      const feedback = kind === 'sa' ? shortAnswerFeedback(r, remaining.find((i) => i.qid === qid).answer, lang) : r.feedback;
      results.set(qid, { ...r, feedback, model, version });
    }
    if (!ok.size && wholeBad) error = 'the model did not give a valid answer';
    remaining = remaining.filter((i) => !ok.has(i.qid));
    if (remaining.length && !wholeBad && !error) error = 'the model left items out or broke the rules';
  }
  return { results, unresolved: remaining, error: remaining.length ? error : null };
}
