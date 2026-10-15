// A hard spending cap for the eval (tools/eval-grader.mjs --max-cost <usd>).
//
// budgetAI() wraps the object that has run(model, params), the REST shim in a
// real run, the fake model in a dry run, so every model call, including the
// retry and the fallback model that model.js makes on its own, passes through
// one gate. Before a call goes out the gate adds up
//
//   cost so far     the REAL token counts the API returned for finished calls
//                   (a call whose reply has no usage is counted at its own
//                   worst case: max_tokens as output plus the input estimate)
// + calls in flight each at its worst case, because their real cost is not known yet
// + the worst case of this call
//
// and if that is over the cap the call is not sent: it throws an error whose
// message starts with "[budget]". Calls already in flight finish normally, and once
// one call has been refused every later call is refused too (the stop is sticky).
// Because in-flight calls are counted at their worst case, the real total
// cannot pass the cap (apart from a model whose reply really has more tokens
// than it was allowed; that is the provider's accounting, not ours).
//
// Prices are the per-model list prices in eval-summary.mjs. A model with no
// listed price is charged at the highest listed price, so the cap errs high.
import { PRICE_PER_M, OUT_TOKENS_CEILING, INPUT_MARGIN } from './eval-summary.mjs';

export const BUDGET_TAG = '[budget]';
const maxIn = Math.max(...Object.values(PRICE_PER_M).map(p => p[0]));
const maxOut = Math.max(...Object.values(PRICE_PER_M).map(p => p[1]));
export const priceOf = model => PRICE_PER_M[model] || [maxIn, maxOut];
export const usd = (model, inTok, outTok) => { const p = priceOf(model); return (inTok * p[0] + outTok * p[1]) / 1e6; };

/** Input tokens of a request: everything we send, characters / 4, plus the same margin eval-summary uses. */
export const inputEstimate = params => Math.ceil(JSON.stringify(params).length / 4 * INPUT_MARGIN);

/** Worst-case cost of one call: max_tokens as output (or the tool's own ceiling) plus the input estimate. */
export function worstCase(model, params) {
  const out = Number.isFinite(params && params.max_tokens) ? params.max_tokens : OUT_TOKENS_CEILING;
  return usd(model, inputEstimate(params), out);
}

/** The usage a reply carries, or null if it carries none. */
export function usageOf(res) {
  const u = res && res.usage;
  if (!u) return null;
  const i = u.prompt_tokens ?? u.input_tokens, o = u.completion_tokens ?? u.output_tokens;
  if (!Number.isFinite(i) && !Number.isFinite(o)) return null;
  return { input: Number(i) || 0, output: Number(o) || 0 };
}

export function budgetAI({ capUsd, inner, scaleUsage = 1 }) {
  if (!(capUsd > 0)) throw new Error('budget cap must be a positive number of dollars');
  const b = { capUsd, spentUsd: 0, inFlightUsd: 0, stopped: false, sent: 0, refused: 0, usageMissing: 0, errors: 0 };
  async function run(model, params) {
    const worst = worstCase(model, params);
    if (b.stopped || b.spentUsd + b.inFlightUsd + worst > capUsd) {           // checked and reserved with no await between: safe under concurrency
      b.stopped = true; b.refused++;
      throw Object.assign(new Error(`${BUDGET_TAG} spending cap reached; call not sent`), { code: 'BUDGET' });
    }
    b.inFlightUsd += worst; b.sent++;
    let res;
    try { res = await inner.run(model, params); }
    catch (e) { b.inFlightUsd -= worst; b.errors++; throw e; }   // a call that failed was not billed
    b.inFlightUsd -= worst;
    let u = usageOf(res);
    if (u && scaleUsage !== 1) { u = { input: u.input * scaleUsage, output: u.output * scaleUsage }; res = { ...res, usage: { prompt_tokens: u.input, completion_tokens: u.output } }; }
    if (u) b.spentUsd += usd(model, u.input, u.output);
    else { b.usageMissing++; b.spentUsd += worst; }
    return res;
  }
  return { run, budget: b };
}
