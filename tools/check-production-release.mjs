import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const PRIMARY = 'https://chapalaseminary.org';
const DIRECT = 'https://chapala-seminary.chapalatheological.workers.dev';
export async function probeProduction(base, expected, request = fetch) {
  const get = async path => {
    const url = `${base}${path}?release=${encodeURIComponent(expected)}`;
    let response;
    try { response = await request(url, { signal: AbortSignal.timeout(10000) }); }
    catch (cause) { throw Object.assign(new Error(`Production probe could not reach ${url}: ${cause.message}`), { unreachable: true }); }
    if (!response.ok) {
      const challenged = response.headers.get('cf-mitigated') === 'challenge';
      throw Object.assign(new Error(`Production probe ${url} failed (HTTP ${response.status}; cf-mitigated=${response.headers.get('cf-mitigated') || 'none'}; cf-ray=${response.headers.get('cf-ray') || 'none'}).`), { challenged });
    }
    return response;
  };
  const version = await get('/version.txt');
  if ((await version.text()).trim() !== expected) throw new Error('Production version does not match the deployed build stamp.');
  const health = await get('/api/health');
  if (!(await health.json()).ok) throw new Error('Production health probe returned an unhealthy response.');
}
export async function checkProduction(expected, request = fetch, pause = ms => new Promise(resolve => setTimeout(resolve, ms))) {
  let last;
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      try { await probeProduction(PRIMARY, expected, request); }
      catch (error) {
        if (!error.challenged && !error.unreachable) throw error;
        console.warn(`Public-domain probe unavailable: ${error.message}`);
        await probeProduction(DIRECT, expected, request);
        console.warn('Exact production release and health verified on the existing direct Worker hostname; custom-domain browser acceptance remains required.');
      }
      console.log(`Production verified: ${expected}`);
      return;
    } catch (error) { last = error; console.warn(`Production probe ${attempt + 1}/10: ${error.message}`); }
    if (attempt < 9) await pause(3000);
  }
  throw last;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const expected = readFileSync('dist/version.txt', 'utf8').trim();
  const sha = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim();
  if (!expected.endsWith(` ${sha}`)) throw new Error('Build stamp does not match this clean commit.');
  await checkProduction(expected);
}
