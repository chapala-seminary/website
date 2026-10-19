// Verify the exact candidate and its policy. A challenged custom-domain probe
// can use the same Worker's direct hostname; it cannot hide a bad build/policy.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
export async function probeBeta(base, expected, request = fetch) {
  const version = await request(`${base}/version.txt?release=${expected}`, { signal: AbortSignal.timeout(5000) });
  const requireOK = response => {
    if (response.ok) return;
    const error = new Error(`beta probe ${response.url || base} returned HTTP ${response.status}${response.headers.get('cf-mitigated') === 'challenge' ? '; Cloudflare challenge' : ''}`);
    error.challenge = response.headers.get('cf-mitigated') === 'challenge';
    throw error;
  };
  requireOK(version);
  if (!(await version.text()).trim().endsWith(` ${expected}`)) throw new Error('beta probe does not match the tested release');
  const response = await request(`${base}/api/health?release=${expected}`, { signal: AbortSignal.timeout(5000) });
  requireOK(response);
  const state = await response.json(), dates = Object.values(state.requiredFrom || {});
  if (!state.ok || dates.length !== 79 || new Set(dates).size !== 1 || dates.some(date => Number.isNaN(Date.parse(date)) || Date.parse(date) > Date.now())) {
    throw new Error('the 79 beta master test requirements were not activated');
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
        console.warn(`Custom-domain probe failed: ${error.message}; trying the direct Worker hostname.`);
        date = await probeBeta('https://chapala-seminary-beta.chapalatheological.workers.dev', expected, request);
        console.warn('Custom-domain probe was challenged or unreachable; exact beta release and activation verified on the direct Worker hostname. Custom-domain browser acceptance remains required.');
      }
      console.log(`Beta ${expected}: 79 master test requirements active since ${date}; production activation remains separate.`);
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
