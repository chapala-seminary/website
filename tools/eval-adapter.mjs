// How the eval reaches the server's grading code.
//
// tools/eval-grader.mjs asks this adapter for a verdict on one answer. The
// adapter runs the same steps worker/grading/attempts.js gradeWritten() runs,
// minus the database (no grade_cache, grade_overrides, attempts or queue, so
// nothing but the model ever answers for the model):
//
//   fill-in      blank -> wrong; exactFill (text.js) -> right; else the model
//   short answer fewer than 15 words -> needs expansion (ungraded); copiedOnly against the prompt
//                in the student's language or in English (prompt text chosen by
//                prompt.js pickText, the same language fallback the prompt uses)
//                -> not met; looksLikeInstruction (rules.js) -> pending, held
//                for faculty; else the model
//
// "The model" is gradeBatch() in model.js, untouched: prompt.js builds the
// messages, model.js makes the call, validates the reply (quotes must be the
// student's words, "met" needs every essential point), retries once and falls
// back to GRADER_MODEL_FALLBACK. The only things supplied from outside are
//   env.AI      the REST shim (real run) or nothing (dry run)
//   env.AI_FAKE '1' in a dry run, which makes model.js use fake-ai.js
//   env.DB      a stub that only tallies the ai_usage rows model.js writes
// The cheap-check order above is a copy of gradeWritten()'s (it cannot be
// called without a database); test/eval-grader.test.mjs pins it against the
// server modules so a change there shows up here.
import { exactFill, normAnswer, wordCount, copiedOnly } from '../worker/grading/text.js';
import { looksLikeInstruction, MIN_SA_WORDS } from '../worker/grading/rules.js';
import { pickText } from '../worker/grading/prompt.js';
import { gradeBatch, DEFAULT_MODEL, DEFAULT_FALLBACK, DEFAULT_VERSION } from '../worker/grading/model.js';

export { MIN_SA_WORDS };
export const DEFAULTS = { GRADER_MODEL: DEFAULT_MODEL, GRADER_MODEL_FALLBACK: DEFAULT_FALLBACK, GRADER_PROMPT_VERSION: DEFAULT_VERSION };

/** A stand-in for env.DB that records what model.js would write to ai_usage. */
export function makeUsageTally() {
  const t = { calls: 0, input_tokens: 0, output_tokens: 0, errors: 0, byModel: {} };
  const DB = {
    prepare: (sql) => ({
      bind: (...a) => ({
        run: async () => {
          if (!/INSERT INTO ai_usage/.test(sql)) throw new Error(`eval DB stub only takes ai_usage writes, got: ${sql.slice(0, 60)}`);
          const [, model, calls, input, output, errors] = a;
          const m = (t.byModel[model] ||= { calls: 0, input_tokens: 0, output_tokens: 0, errors: 0 });
          for (const o of [t, m]) { o.calls += calls; o.input_tokens += input; o.output_tokens += output; o.errors += errors; }
        },
      }),
    }),
  };
  return { DB, tally: t };
}

/** What model.js reads from the environment. */
export function makeEnv({ ai, dryRun, model, fallbackModel, DB }) {
  return {
    ...(dryRun ? { AI_FAKE: '1' } : {}),
    AI: ai || null,
    DB,
    GRADER_MODEL: model || DEFAULTS.GRADER_MODEL,
    GRADER_MODEL_FALLBACK: fallbackModel || DEFAULTS.GRADER_MODEL_FALLBACK,
    GRADER_PROMPT_VERSION: DEFAULTS.GRADER_PROMPT_VERSION,
  };
}

const pick = (obj, lang) => pickText(obj, lang).text;

/** The checks that settle an answer without the model. Returns a result or null. */
export function cheapCheck({ kind, key, answer, lang }) {
  const text = String(answer ?? '');
  if (kind === 'fill') {
    if (!normAnswer(text)) return { verdict: 'wrong', via: 'rule:blank', graded_by: 'rule' };
    if (exactFill(key, text, lang)) return { verdict: 'right', via: 'exact', graded_by: 'exact' };
    return null;
  }
  if (!text.trim()) return { verdict: 'not_met', via: 'rule:blank', graded_by: 'rule' };
  if (wordCount(text) < MIN_SA_WORDS) return { verdict: 'needs_expansion', via: 'rule:short', graded_by: 'rule' };
  if (copiedOnly(pick(key.prompt, lang), text) || copiedOnly(pick(key.prompt, 'en'), text)) return { verdict: 'not_met', via: 'rule:copied', graded_by: 'rule' };
  if (looksLikeInstruction(text)) return { verdict: 'pending', via: 'rule:injection', graded_by: 'rule' };
  return null;
}

/** Grade one eval item as the server would. `qid` is only a label inside the call. */
export async function gradeOne({ item, key, env }) {
  const rule = cheapCheck({ kind: item.kind, key, answer: item.answer, lang: item.lang });
  if (rule) return rule;
  const batch = await gradeBatch(env, item.kind, item.lang, [{ qid: item.qid, key, answer: String(item.answer) }]);
  const r = batch.results.get(item.qid);
  if (!r) return { verdict: 'pending', via: 'ai', graded_by: 'ai', error: batch.error || 'unresolved' };
  if (r.verdict === 'pending') return { verdict: 'pending', via: 'ai', graded_by: 'ai', held: 'model', model: r.model, prompt_version: r.version };
  return { verdict: r.verdict, via: 'ai', graded_by: 'ai', feedback: r.feedback, points: r.points, record: r.record, model: r.model, prompt_version: r.version };
}

/** The exact request gradeBatch would send for one answer, with no network.
 *  Runs the real gradeBatch against a stand-in AI that records the request and
 *  answers with a capacity error (3036), which makes model.js stop at once. */
export async function capturePrompt({ item, key, env }) {
  const sent = [];
  const probe = { run: async (model, params) => { sent.push({ model, params }); throw Object.assign(new Error('AiError: 3036: print-prompt probe, nothing was sent'), { code: 3036 }); } };
  const { DB } = makeUsageTally();
  await gradeBatch({ ...env, AI: probe, AI_FAKE: undefined, DB }, item.kind, item.lang, [{ qid: item.qid, key, answer: String(item.answer) }]);
  if (!sent.length) throw new Error('model.js made no call');
  return sent[0];                       // { model, params: { messages, response_format, max_tokens, temperature } }
}

/** Does the key give the model a rubric? (contract §3) */
export const hasRubric = key => !!(key.rubric && Array.isArray(key.rubric.points) && key.rubric.points.length);
