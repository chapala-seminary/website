// Beta's cutoff is recorded once, when the deployed release first answers
// its health check. Later deployments reuse it; production has no default.
import catalog from './catalog.json' with { type: 'json' };
let betaActivation;
export async function activationEnvironment(env) {
  if (env.MASTER_TESTS_ACTIVATION !== 'beta') return env;
  if (!betaActivation) betaActivation = (async () => {
    await env.DB.prepare("INSERT OR IGNORE INTO test_activations (name, activated_at) VALUES ('beta-master-tests', strftime('%Y-%m-%dT%H:%M:%fZ','now'))").run();
    const row = await env.DB.prepare("SELECT activated_at FROM test_activations WHERE name = 'beta-master-tests'").first();
    if (!row?.activated_at || Number.isNaN(Date.parse(row.activated_at))) throw new Error('master test activation is unavailable');
    return row.activated_at;
  })().catch(error => { betaActivation = null; throw error; });
  return {...env, MASTER_TESTS_ACTIVE_FROM: await betaActivation};
}
/* Wayne, 18 Oct 2026: the eight five-reading tests still awaiting faculty
   review (src/data/readings/staged/academic_manifest.json; 299 of their 320
   questions have no accepted alternate answers yet) are optional for now.
   The activation date of every other test is unchanged. Nothing earned is
   taken away: an optional test holds no completion. Remove a slug here once
   faculty approve its bank; test/eight-optional.test.mjs keeps this list equal
   to the manifest.
   Wayne, 26 Oct 2026: their banks have long been reviewed; all eight now carry
   an explicit requiredFrom (2026-10-28T06:00:00Z, src/data/required-from.json),
   which this default never overrides. */
export const PENDING_FACULTY_REVIEW = new Set(['otsreadings', 'ntreadings', 'streadings', 'evangelismreadings',
  'pmreadings', 'chreadings', 'wisespeakreadings', 'hermeneuticsreadings']);
/* The denominational electives' textbook and reading tests (Oct 2026) are
   optional when they arrive: the production activation date never makes one
   of them required on its own. Every test whose slug starts with "elec" is
   in this set, so a new elective test needs no entry here. Making one
   required is a decision for Wayne, by an explicit requiredFrom date
   (tools/activate-required.mjs), not by this default. test/eight-optional.test.mjs
   checks the rule. */
export const ELECTIVE_TEST_PREFIX = 'elec';
export const ELECTIVE_TESTS_PENDING = Object.freeze({
  has: (slug) => typeof slug === 'string' && slug.startsWith(ELECTIVE_TEST_PREFIX),
});
/* `tests` is the catalog's test map; a test passes another to check the rule. */
export function activatedTests(env, tests = catalog.textbooks) {
  const date = env.MASTER_TESTS_ACTIVE_FROM || env.MASTER_TESTS_ACTIVATION;
  if (!date || Number.isNaN(Date.parse(date)) || Date.parse(date) > Date.now()) return {};
  return Object.fromEntries(Object.entries(tests)
    .filter(([slug, t]) => t.requiredFrom === null && !PENDING_FACULTY_REVIEW.has(slug) && !ELECTIVE_TESTS_PENDING.has(slug))
    .map(([slug]) => [slug, date]));
}
