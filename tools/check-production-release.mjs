import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
export async function checkProduction(expected, request = fetch, pause = ms => new Promise(resolve => setTimeout(resolve, ms))) {
  let last;
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      const version = await request(`https://chapalaseminary.org/version.txt?release=${encodeURIComponent(expected)}`, { signal: AbortSignal.timeout(10000) });
      if (!version.ok) throw new Error(`Production version probe returned HTTP ${version.status}`);
      if ((await version.text()).trim() !== expected) throw new Error('Production version does not match the deployed build stamp.');
      const health = await request('https://chapalaseminary.org/api/health', { signal: AbortSignal.timeout(10000) });
      if (!health.ok || !(await health.json()).ok) throw new Error(`Production health probe failed (HTTP ${health.status}).`);
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
