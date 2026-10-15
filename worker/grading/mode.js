/* GRADING_MODE (docs/ai-grading.md, section 1).
 *
 *   live    the server is the grader of record; /api/sync writes no credit.
 *   shadow  the production trial: credit comes from the old rules.
 *
 * Anything else, including unset, is the old behaviour -- there is no "off"
 * for AI grading, but a Worker that has not been given the variable must
 * behave exactly as it did before it existed.
 *
 * The test suite's Worker is live, and the suites for the old rules need the
 * old behaviour from it: a request may carry x-test-grading-mode: shadow, and
 * only a Worker holding AI_FAKE (test/wrangler.local.jsonc, never a deployed
 * configuration -- tools/verify-worker-config.mjs) listens.
 */
export function gradingMode(env, request) {
  const override = env && env.AI_FAKE && request && request.headers.get('x-test-grading-mode');
  return (override || (env && env.GRADING_MODE) || 'shadow') === 'live' ? 'live' : 'shadow';
}
export const isLive = (env, request) => gradingMode(env, request) === 'live';
