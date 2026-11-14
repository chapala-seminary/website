/* What worker/awards.js testCounts needs to judge a required-reading test:
 * the completions the record holds, the server's clock, and the activation
 * dates. Shared by the records API (api.js) and the grading code
 * (grading/attempts.js), which both decide whether a course is complete.
 *
 * The activation date of a required-reading test comes from worker/catalog.json
 * (worker/awards.js testCounts). The test suite needs to see the rule both
 * before and after a date, so its configuration -- and only its: EMAIL_MODE
 * "log" with no Resend key, the same condition that lets the suite see the
 * notices it would send -- may set TEST_REQUIRED_FROM, a JSON map
 * { slug: ISO time }. tools/verify-worker-config.mjs refuses the variable in
 * the deployed configuration. */
import { activatedTests } from './test-activation.js';
import catalog from './catalog.json';

export function testRequiredFrom(env) {
  if (env.EMAIL_MODE !== 'log' || env.RESEND_API_KEY || !env.TEST_REQUIRED_FROM) return undefined;
  try { const m = JSON.parse(env.TEST_REQUIRED_FROM); return m && typeof m === 'object' ? m : undefined; } catch { return undefined; }
}
/* What testCounts needs: the completions the record holds now, with the time
 * and level the server wrote, and the server's clock. */
export function testContext(env, completions) {
  return { completions: completions || [], now: new Date().toISOString(), requiredFrom: { ...activatedTests(env), ...testRequiredFrom(env) } };
}

/* The dates the browser is sent (cts_required_from): beta's activation, and
 * -- in the test suite only -- the suite's own dates for the finals and
 * papers. Their real dates are in the pages already (cts-required-tests.js,
 * Unit.astro); without this the suite's browser would hold a master's course
 * for a paper the suite's Worker does not require (#318, 11 Nov 2026). The
 * textbook and reading tests' suite dates stay server-side, as before. */
export function browserRequiredFrom(env) {
  const out = { ...activatedTests(env) };
  const t = testRequiredFrom(env);
  if (t) for (const [slug, at] of Object.entries(t)) if ((catalog.assessments || {})[slug]) out[slug] = at;
  return out;
}
