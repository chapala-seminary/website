/* Do the certificate pages take part in student records?
 *
 * A certificate page writes `cts_done_codes` — it is where a completion is
 * recorded. Until now none of the 69 loaded `cts-sync.js`, so that completion
 * only reached the database when the student happened to open a unit page
 * again. docs/student-records.md called this out: "nothing is lost, but the
 * delay is avoidable". For a student who finishes their last course and closes
 * the tab, "again" may be never.
 *
 * Three things are checked, because the first two can both be true while the
 * page still does nothing: the tag is present, the file it names actually
 * resolves, and the script gets far enough to ask whether an API exists. That
 * last one is the promise the whole design rests on — when the database goes
 * live, these pages start syncing by themselves, with no edit to 800 files.
 *
 *   node tools/verify-certificates.mjs http://127.0.0.1:8798
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const DIST = process.argv[3] || 'dist';
const CHROME = process.env.CHROME_PATH;

const pages = fs.readdirSync(DIST).filter((f) => /Certificate\.html$/.test(f)).sort();
if (!pages.length) {
  console.log('FAIL — no certificate pages found in ' + DIST + '; nothing was checked.');
  process.exit(1);
}

const fails = [];

/* 1. Static: every certificate names the sync client. */
const missing = pages.filter((f) => !/cts-sync\.js/.test(fs.readFileSync(`${DIST}/${f}`, 'utf8')));
if (missing.length) {
  fails.push(`${missing.length} certificate page(s) do not load cts-sync.js:\n        ` +
             missing.slice(0, 8).join('\n        ') +
             (missing.length > 8 ? `\n        … and ${missing.length - 8} more` : ''));
}

/* 2 & 3. Live: the script resolves and probes. Sampled across the shapes --
   a course certificate, and the two degree certificates, which are built
   differently (no external scripts of their own). */
const sample = [
  pages.find((f) => /^CTSActs/.test(f)),
  pages.find((f) => /MDiv/.test(f)),
  pages.find((f) => /ThM/.test(f)),
].filter(Boolean);

const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
for (const f of sample) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errs = [], api = [];
  let syncStatus = null;
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('response', (r) => { if (/cts-sync\.js/.test(r.url())) syncStatus = r.status(); });
  page.on('request', (r) => { if (/\/api\//.test(r.url())) api.push(new URL(r.url()).pathname); });

  await page.goto(`${BASE}/${f}`, { waitUntil: 'load' });
  // a registered student with a completion is what the sync client acts on
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('cts_student', JSON.stringify({ name: 'T', track: 'cert' }));
    localStorage.setItem('cts_done_codes', JSON.stringify(['CTSACTS']));
  });
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(1200);

  const loaded = await page.evaluate(() => typeof window.CTS_SYNC === 'object');
  // 304 is a cache hit, which is a load. Only a missing or error response is
  // a failure -- an earlier version of this check demanded exactly 200 and
  // failed on its own second run.
  const ok = syncStatus !== null && (syncStatus === 304 || (syncStatus >= 200 && syncStatus < 300));
  if (!ok) fails.push(`${f}: cts-sync.js did not load (status ${syncStatus ?? 'never requested'})`);
  if (!loaded) fails.push(`${f}: cts-sync.js loaded but window.CTS_SYNC is missing`);
  if (!api.some((u) => /health/.test(u)))
    fails.push(`${f}: never probed for the API — this page will not start syncing when the database goes live`);
  if (errs.length) fails.push(`${f}: page error — ${errs[0].slice(0, 90)}`);
  await ctx.close();
}
await browser.close();

console.log(`${pages.length} certificate pages, ${sample.length} loaded in a browser`);
if (!fails.length) {
  console.log('PASS — every certificate loads the sync client, and it probes for the API.');
} else {
  console.log(`FAIL — ${fails.length}:`);
  fails.forEach((f) => console.log('  ' + f));
  process.exit(1);
}
