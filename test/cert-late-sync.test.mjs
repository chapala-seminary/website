// A certificate page opened on a second device before the record arrives must
// show the certificate once sync brings the units in -- without the student
// reloading by hand -- and must not reload more than once.
//
//   wrangler dev --config test/wrangler.local.jsonc --port 8798 ...
//   node test/cert-late-sync.test.mjs

import { chromium } from 'playwright';

const BASE = process.env.SYNC_BASE || 'http://127.0.0.1:8798';
const CHROME = process.env.CHROME_PATH;
let checks = 0; const fails = [];
const ok = (c, label, detail) => { checks++; if (!c) fails.push(label + (detail ? `\n        ${detail}` : '')); };

const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const headers = { 'x-test-grading-mode': 'shadow' };

// Device one: a student who passed all 12 Pentateuch units, synced up.
const ctx1 = await browser.newContext({ extraHTTPHeaders: headers });
const one = await ctx1.newPage();
await one.goto(`${BASE}/synctest.html`, { waitUntil: 'load' });
await one.evaluate(() => {
  localStorage.setItem('cts_student', JSON.stringify({ name: 'Late Sync Student', email: `late-sync-${Date.now()}@example.test`, country: 'MX', track: 'cert' }));
  localStorage.setItem('cts_track', 'cert');
  const map = {}; for (let u = 1; u <= 12; u++) map['unit' + u] = true;
  localStorage.setItem('cts_pent_progress', JSON.stringify(map));
});
await one.evaluate(() => window.CTS_SYNC.sync());
const code = await one.evaluate(() => window.CTS_SYNC.code());
ok(!!code, 'device one got a student code');

// Device two: only the code, then straight to the certificate page.
const ctx2 = await browser.newContext({ extraHTTPHeaders: headers });
let loads = 0;
const two = await ctx2.newPage();
two.on('load', () => { loads++; });
await two.goto(`${BASE}/synctest.html`, { waitUntil: 'load' });
// The same student on their second device: registered here (name, code) but
// the passed units live only on the server so far.
const who = await one.evaluate(() => localStorage.getItem('cts_student'));
await two.evaluate(([c, w]) => { localStorage.setItem('cts_student_code', c); localStorage.setItem('cts_student', w); localStorage.setItem('cts_track', 'cert'); }, [code, who]);
loads = 0;
await two.goto(`${BASE}/CTSPentCertificate.html`, { waitUntil: 'load' });
// give sync time to arrive, apply, and (once) reload
await two.waitForTimeout(6000);
const shown = await two.evaluate(() => {
  const w = document.getElementById('certWrap');
  return !!w && getComputedStyle(w).display !== 'none';
});
ok(shown, 'the certificate shows after the record arrives, without a manual reload');
ok(loads <= 2, `the page reloaded at most once (loads=${loads})`);

// A later visit with nothing new must not reload again.
loads = 0;
await two.goto(`${BASE}/CTSPentCertificate.html`, { waitUntil: 'load' });
await two.waitForTimeout(4000);
ok(loads === 1, `no reload when the record adds nothing (loads=${loads})`);

await browser.close();
console.log(`${checks} checks`);
if (fails.length) { console.log('FAIL\n  ' + fails.join('\n  ')); process.exit(1); }
console.log('PASS — certificate pages pick up late-arriving progress.');
