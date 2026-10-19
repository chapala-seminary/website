// Verify the exact candidate and its policy. A challenged custom-domain probe
// can use the same Worker's direct hostname; it cannot hide a bad build/policy.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { activatedTests } from '../worker/test-activation.js';
// How many tests the beta cohort requires: every staged test less the ones
// still awaiting faculty review (worker/test-activation.js). 71 since 18 Oct 2026.
export const EXPECTED = Object.keys(activatedTests({ MASTER_TESTS_ACTIVATION: '2000-01-01T00:00:00.000Z' })).length;
export async function probeBeta(base, expected, request = fetch) {
  const version = await request(`${base}/version.txt?release=${expected}`, { signal: AbortSignal.timeout(5000) });
  const requireOK = response => {
    if (response.ok) return;
    const error = new Error(`beta probe returned HTTP ${response.status}${response.headers.get('cf-mitigated') === 'challenge' ? '; Cloudflare challenge' : ''}`);
    error.challenge = response.headers.get('cf-mitigated') === 'challenge';
    throw error;
  };
  requireOK(version);
  if (!(await version.text()).trim().endsWith(` ${expected}`)) throw new Error('beta probe does not match the tested release');
  const response = await request(`${base}/api/health?release=${expected}`, { signal: AbortSignal.timeout(5000) });
  requireOK(response);
  const state = await response.json(), dates = Object.values(state.requiredFrom || {});
  if (!state.ok || dates.length !== EXPECTED || new Set(dates).size !== 1 || dates.some(date => Number.isNaN(Date.parse(date)) || Date.parse(date) > Date.now())) {
    throw new Error(`the ${EXPECTED} beta master test requirements were not activated`);
  }
  return dates[0];
}
export async function checkBeta(expected, request = fetch, pause = ms => new Promise(resolve => setTimeout(resolve, ms))) {
  let lastError;
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      let date;
      try { date = await probeBeta('https://beta.chapalaseminary.org', expected, request); }
      catch (error) {
        // Only transport/challenge failures permit the alternate entry point.
        if (!error.challenge && !(error instanceof TypeError) && error.name !== 'TimeoutError') throw error;
        date = await probeBeta('https://chapala-seminary-beta.chapalatheological.workers.dev', expected, request);
        console.warn('Custom-domain probe was challenged or unreachable; exact beta release and activation verified on the direct Worker hostname. Custom-domain browser acceptance remains required.');
      }
      console.log(`Beta ${expected}: ${EXPECTED} master test requirements active since ${date}; production activation remains separate.`);
      return;
    } catch (error) { lastError = error; console.warn(`Beta health attempt ${attempt + 1}/10: ${error.message}`); }
    if (attempt < 9) await pause(3000);
  }
  throw lastError;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // Match tools/write-version.mjs, including Git's configured abbreviation.
  await checkBeta(execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim());
}
