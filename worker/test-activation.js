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
   to the manifest. */
export const PENDING_FACULTY_REVIEW = new Set(['otsreadings', 'ntreadings', 'streadings', 'evangelismreadings',
  'pmreadings', 'chreadings', 'wisespeakreadings', 'hermeneuticsreadings']);
export function activatedTests(env) {
  const date = env.MASTER_TESTS_ACTIVE_FROM || env.MASTER_TESTS_ACTIVATION;
  if (!date || Number.isNaN(Date.parse(date)) || Date.parse(date) > Date.now()) return {};
  return Object.fromEntries(Object.entries(catalog.textbooks)
    .filter(([slug, t]) => t.requiredFrom === null && !PENDING_FACULTY_REVIEW.has(slug))
    .map(([slug]) => [slug, date]));
}
