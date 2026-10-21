/* GRADING_MODE (docs/ai-grading.md, section 1).
 *
 *   live    the server is the grader of record; /api/sync writes no credit
 *           (except legacy credit during the cutover window, below).
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

/* The cutover grace window (LEGACY_SYNC_UNTIL, an ISO UTC time; Wayne, 20 Oct
 * 2026). Production switched from shadow to live without the planned trial and
 * notice, so a student may still hold passes in the browser that never reached
 * the server -- studied offline, or last opened before a sync. Until this time a
 * live Worker still takes those from /api/sync as legacy credit, as shadow mode
 * did; after it, nothing. Legacy credit counts towards a first completion and
 * never raises a level (worker/grading/attempts.js earnedLevel), and the window
 * adds no completion level the record already holds. It is limited further
 * below: to records made before the switch, to units and tests with no live
 * attempt, and to completions the server works out itself. Unset, or in the past:
 * closed. The suite may send x-test-legacy-sync-until, heard only by a Worker
 * holding AI_FAKE, like x-test-grading-mode. */
export function legacySyncOpen(env, request, at = Date.now()) {
  const override = env && env.AI_FAKE && request && request.headers.get('x-test-legacy-sync-until');
  const until = override || (env && env.LEGACY_SYNC_UNTIL);
  const end = until ? Date.parse(until) : NaN;
  return !Number.isNaN(end) && at < end;
}

/* Who the window is for (ChatGPT's review of #146, 20 Oct 2026): only a record
 * registered before LEGACY_SYNC_COHORT_BEFORE, the moment of the switch. A
 * record made after it never studied under the old rules, so it has nothing
 * to bring; a student code proves whose record it is, not how old the work it
 * claims is. Unset: no one. The suite may send x-test-legacy-cohort-before
 * (AI_FAKE Workers only). */
export function legacyCohortMember(env, request, createdAt) {
  const override = env && env.AI_FAKE && request && request.headers.get('x-test-legacy-cohort-before');
  const before = Date.parse(override || (env && env.LEGACY_SYNC_COHORT_BEFORE) || '');
  const made = Date.parse(createdAt || '');
  return !Number.isNaN(before) && !Number.isNaN(made) && made < before;
}
