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
 * answer. A capacity or quota error (3036, 3040, 3007) stops at once: trying
 * another model would meet the same wall, and the queue will try again.
 */
import { normalise } from './text.js';
import { buildMessages, schema, rubricOf } from './prompt.js';
import { fakeAIRun } from './fake-ai.js';

export const DEFAULT_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
export const DEFAULT_FALLBACK = '@cf/openai/gpt-oss-120b';
export const DEFAULT_VERSION = '2026-10-14.1';
const CAPACITY = /\b(3036|3040|3007)\b/;
const TIMEOUT_MS = 25000;

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

async function call(env, model, kind, lang, items, version) {
  const params = {
    messages: buildMessages(kind, lang, items, version),
    response_format: { type: 'json_schema', json_schema: schema(kind) },
    max_tokens: 250 * items.length + 300,
    temperature: 0,
  };
  const run = env.AI_FAKE ? Promise.resolve().then(() => fakeAIRun(env, model, params)) : env.AI.run(model, params);
  let timer;
  const timeout = new Promise((_, rej) => { timer = setTimeout(() => rej(new Error('the model took too long')), TIMEOUT_MS); });
  try { return await Promise.race([run, timeout]); } finally { clearTimeout(timer); }
}

/** Check a reply against what was sent. Returns { ok: Map qid->result, wholeBad: bool }. */
export function validate(kind, parsed, items) {
  const ok = new Map();
  if (!parsed || !Array.isArray(parsed.items)) return { ok, wholeBad: true };
  const sent = new Map(items.map((i) => [i.qid, i]));
  const seen = new Set();
  for (const r of parsed.items) {
    if (!r || typeof r.qid !== 'string' || !sent.has(r.qid) || seen.has(r.qid)) return { ok: new Map(), wholeBad: true };
    seen.add(r.qid);
  }
  const allowed = kind === 'fill' ? ['right', 'wrong', 'pending'] : ['met', 'partly', 'not_met', 'pending'];
  for (const r of parsed.items) {
    const it = sent.get(r.qid);
    if (!allowed.includes(r.verdict)) continue;
    const feedback = typeof r.feedback === 'string' ? r.feedback.trim().slice(0, 700) : '';
    if (r.verdict === 'pending') { ok.set(r.qid, { verdict: 'pending', feedback: '', points: [], held: true }); continue; }
    if (kind === 'fill') { ok.set(r.qid, { verdict: r.verdict, feedback, points: [] }); continue; }

    // Short answers: every point made must quote the student's own words,
    // and "met" needs every essential point.
    const rub = rubricOf(it.key);
    const hay = normalise(it.answer);
    const byId = new Map();
    let bad = !Array.isArray(r.points);
    for (const p of Array.isArray(r.points) ? r.points : []) {
      if (!p || typeof p.id !== 'string' || typeof p.made !== 'boolean' || byId.has(p.id) || !rub.points.some((x) => x.id === p.id)) { bad = true; break; }
      if (p.made) {
        /* normalise() puts a space at each end, and a quote that begins or ends in punctuation
           ("...in his name.") gets a second one; compare the words, whole words only. */
        const q = normalise(p.quote || '').trim();
        if (q.length < 2 || !hay.includes(` ${q} `)) { bad = true; break; }
      }
      byId.set(p.id, { id: p.id, made: p.made, quote: p.made ? String(p.quote).slice(0, 300) : '' });
    }
    if (bad) continue;
    const points = rub.points.map((x) => byId.get(x.id) || { id: x.id, made: false, quote: '' });
    const essentialsMade = rub.points.every((x) => !x.essential || points.find((p) => p.id === x.id).made);
    if (r.verdict === 'met' && !essentialsMade) continue;
    ok.set(r.qid, { verdict: r.verdict, feedback, points });
  }
  return { ok, wholeBad: false };
}

export async function gradeBatch(env, kind, lang, items) {
  const { primary, fallback, version } = modelsOf(env);
  const results = new Map();
  let remaining = items.slice();
  let error = null;
  if (!aiAvailable(env)) return { results, unresolved: remaining, error: 'no AI binding' };

  for (const model of [primary, primary, fallback]) {
    if (!remaining.length) break;
    let res;
    try { res = await call(env, model, kind, lang, remaining, version); }
    catch (e) {
      const msg = String((e && e.message) || e);
      error = msg.slice(0, 300);
      await addUsage(env, model, { calls: 1, errors: 1 });
      if (CAPACITY.test(msg) || CAPACITY.test(String(e && e.code))) break;
      continue;
    }
    const usage = res && res.usage || {};
    const { ok, wholeBad } = validate(kind, parseJson(replyText(res)), remaining);
    await addUsage(env, model, {
      calls: 1, errors: wholeBad ? 1 : 0,
      input: Number(usage.prompt_tokens ?? usage.input_tokens) || 0, output: Number(usage.completion_tokens ?? usage.output_tokens) || 0,
    });
    for (const [qid, r] of ok) results.set(qid, { ...r, model, version });
    if (!ok.size && wholeBad) error = 'the model did not give a valid answer';
    remaining = remaining.filter((i) => !ok.has(i.qid));
    if (remaining.length && !wholeBad && !error) error = 'the model left items out or broke the rules';
  }
  return { results, unresolved: remaining, error: remaining.length ? error : null };
}
