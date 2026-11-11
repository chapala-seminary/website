// The certificate page and the master's final and paper (#318, 11 Nov 2026):
// Old Testament Survey's M.Div. certificate, as shipped (not in force) and
// with its final and paper dated (served in place of cts-required-tests.js),
// for the cases of the acceptance table.
//
//   node tools/verify-masters-assessments-gate.mjs http://127.0.0.1:8798
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const catalog = JSON.parse(fs.readFileSync('worker/catalog.json', 'utf8'));
const c = catalog.courses.ots, slug = 'ots', F = 'CTSOTSMDivCertificate.html';
const shipped = fs.readFileSync('public/assets/js/cts-required-tests.js', 'utf8');
const activeJs = (() => {
  const w = {}; new Function('window', shipped)(w);
  for (const t of w.CTS_REQUIRED_ASSESSMENTS.CTSOTS) t.requiredFrom = '2026-01-01T00:00:00Z';
  return `window.CTS_REQUIRED_TESTS = ${JSON.stringify(w.CTS_REQUIRED_TESTS)};\nwindow.CTS_REQUIRED_ASSESSMENTS = ${JSON.stringify(w.CTS_REQUIRED_ASSESSMENTS)};`;
})();
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const base = (track) => {
  const s = { cts_student: JSON.stringify({ name: 'Prueba Test', track }), cts_track: track }, pr = {};
  for (const u of c.units) { pr[`unit${u}`] = true; s[`cts_${slug}_u${u}_mc_passed`] = '1'; }
  s[`cts_${slug}_progress`] = JSON.stringify(pr);
  for (const t of c.tests || []) s[`cts_textbook_${t}_passed`] = '2026-10-04';
  return s;
};
async function open(seed, active) {
  const ctx = await browser.newContext({ extraHTTPHeaders: { 'x-test-grading-mode': 'shadow' } });
  if (active) await ctx.route(/\/assets\/js\/cts-required-tests\.js(\?.*)?$/, (r) => r.fulfill({ status: 200, contentType: 'application/javascript', body: activeJs }));
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`${BASE}/${c.pages}Unit${c.units[0]}.html`);
  await p.evaluate((s) => { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, seed);
  await p.reload(); await p.waitForTimeout(300);
  await p.goto(`${BASE}/${F}`); await p.waitForTimeout(1200);
  const r = await p.evaluate(() => {
    const vis = (el) => !!(el && el.offsetParent !== null && getComputedStyle(el).display !== 'none');
    const dip = ['#diploma', '#cert-wrap', '.diploma', '#certificate', '.certificate', '#cert', '.cert-wrap', '.sheet'].map((s) => document.querySelector(s)).find(vis);
    const n = document.getElementById('cts-textbook-hold');
    return { diploma: !!dip, note: n && vis(n) ? n.innerText : '' };
  });
  await ctx.close();
  return { ...r, errs };
}
const passed = { cts_textbook_otsfinal_passed: '1', cts_textbook_otspaper_passed: '1' };
const cases = [
  ['as shipped: an M.Div. student without the final and paper gets the diploma, as today', base('mdiv'), false, true],
  ['dated: neither passed -> held, naming both', base('mdiv'), true, false, /final exam and the ministry paper/],
  ['dated: final only -> held for the paper', { ...base('mdiv'), cts_textbook_otsfinal_passed: '1' }, true, false, /ministry paper is still/],
  ['dated: paper only -> held for the final', { ...base('mdiv'), cts_textbook_otspaper_passed: '1' }, true, false, /final synthesis exam is still/],
  ['dated: both passed -> the diploma', { ...base('mdiv'), ...passed }, true, true],
  ['dated: exempt (finished before the date) -> the diploma', { ...base('mdiv'), cts_textbook_otsfinal_exempt: '1', cts_textbook_otspaper_exempt: '1' }, true, true],
  ['dated: a Certificate-track student is not held', base('cert'), true, true],
];
const fails = [];
for (const [label, seed, active, want, note] of cases) {
  const r = await open(seed, active);
  if (r.diploma !== want || r.errs.length || (note && !note.test(r.note))) fails.push(`${label}: diploma ${r.diploma}, note "${r.note.slice(0, 80)}" ${r.errs.join(' | ')}`);
}
await browser.close();
if (fails.length) { console.error('FAIL'); for (const f of fails) console.error('  ' + f); process.exit(1); }
console.log(`PASS — ${cases.length} certificate-page cases for the master's final and paper.`);
