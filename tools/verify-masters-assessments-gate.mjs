// The certificate page and the master's ministry paper (#318): Old Testament
// Survey's M.Div. certificate, as shipped (not in force) and with its paper
// dated (served in place of cts-required-tests.js), for the cases of the
// acceptance table. The paper only: a final is never required (Dr. Cook, 12 Nov 2026).
//
//   node tools/verify-masters-assessments-gate.mjs http://127.0.0.1:8798
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const catalog = JSON.parse(fs.readFileSync('worker/catalog.json', 'utf8'));
const c = catalog.courses.ots, slug = 'ots', F = 'CTSOTSMDivCertificate.html';
const shipped = fs.readFileSync('public/assets/js/cts-required-tests.js', 'utf8');
// not in force: the same map with every paper undated (the pages carry the real dates)
const offJs = (() => {
  const w = {}; new Function('window', shipped)(w);
  for (const list of Object.values(w.CTS_REQUIRED_ASSESSMENTS)) for (const t of list) t.requiredFrom = null;
  return `window.CTS_REQUIRED_TESTS = ${JSON.stringify(w.CTS_REQUIRED_TESTS)};\nwindow.CTS_REQUIRED_ASSESSMENTS = ${JSON.stringify(w.CTS_REQUIRED_ASSESSMENTS)};`;
})();
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
  // the record and the server's dates stay out of these cases: the test
  // suite's server sends its own "not yet" dates for papers (browserRequiredFrom)
  await ctx.route(/\/api\//, (r) => r.abort());
  await ctx.route(/\/assets\/js\/cts-required-tests\.js(\?.*)?$/, (r) => r.fulfill({ status: 200, contentType: 'application/javascript', body: active ? activeJs : offJs }));
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
const cases = [
  ['not in force: an M.Div. student without the paper gets the diploma, as before', base('mdiv'), false, true],
  ['dated: paper not passed -> held, naming the paper only', base('mdiv'), true, false, /^(?![\s\S]*final)[\s\S]*ministry paper is still/],
  ['dated: a final passed is not the paper -> held for the paper', { ...base('mdiv'), cts_textbook_otsfinal_passed: '1' }, true, false, /ministry paper is still/],
  ['dated: paper passed, no final -> the diploma', { ...base('mdiv'), cts_textbook_otspaper_passed: '1' }, true, true],
  ['dated: exempt (finished before the date) -> the diploma', { ...base('mdiv'), cts_textbook_otspaper_exempt: '1' }, true, true],
  ['dated: a Certificate-track student is not held', base('cert'), true, true],
];
const fails = [];
for (const [label, seed, active, want, note] of cases) {
  const r = await open(seed, active);
  if (r.diploma !== want || r.errs.length || (note && !note.test(r.note))) fails.push(`${label}: diploma ${r.diploma}, note "${r.note.slice(0, 80)}" ${r.errs.join(' | ')}`);
}
/* The last unit page's recorder (cts-record.js, data from Unit.astro): it
   records the course only when the dated paper is passed. The
   dates are set as cts-sync.js keeps them (cts_required_from), after the
   page's own sync has written the record's. */
const LAST = `${c.pages}Unit${c.units[c.units.length - 1]}.html`;
// the final is dated too, to show it is never required
const dated = JSON.stringify({ otsfinal: '2026-01-01T00:00:00Z', otspaper: '2026-01-01T00:00:00Z' });
async function unit(seed, isDated) {
  const ctx = await browser.newContext({ extraHTTPHeaders: { 'x-test-grading-mode': 'shadow' } });
  await ctx.route(/\/api\//, (r) => r.abort());   // as above: the dates below are the only ones
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`${BASE}/${LAST}`);
  await p.evaluate((s) => { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, seed);
  await p.reload(); await p.waitForTimeout(1500);
  await p.evaluate((v) => localStorage.setItem('cts_required_from', v), isDated ? dated : JSON.stringify({ otsfinal: '2099-01-01T00:00:00Z', otspaper: '2099-01-01T00:00:00Z' }));
  const r = await p.evaluate(() => { const comp = window.CTS_UNIT && window.CTS_UNIT.completion;
    return { complete: window.CTSRecord.isComplete(comp), pending: window.CTSRecord.pendingTests(comp).map((t) => t.slug) }; });
  await ctx.close();
  return { ...r, errs };
}
for (const [label, seed, isDated, complete, pending] of [
  ['unit page, not in force: complete with units and tests', base('mdiv'), false, true, []],
  ['unit page, dated: held for the paper only', base('mdiv'), true, false, ['otspaper']],
  ['unit page, dated, final passed: still held for the paper', { ...base('mdiv'), cts_textbook_otsfinal_passed: '1' }, true, false, ['otspaper']],
  ['unit page, dated, paper passed: complete', { ...base('mdiv'), cts_textbook_otspaper_passed: '1' }, true, true, []],
  ['unit page, dated, exempt: complete', { ...base('mdiv'), cts_textbook_otspaper_exempt: '1' }, true, true, []],
  ['unit page, dated, Certificate track: complete', base('cert'), true, true, []],
]) {
  const r = await unit(seed, isDated);
  cases.push(label);
  if (r.complete !== complete || JSON.stringify(r.pending) !== JSON.stringify(pending) || r.errs.length) fails.push(`${label}: ${JSON.stringify(r)}`);
}
await browser.close();
if (fails.length) { console.error('FAIL'); for (const f of fails) console.error('  ' + f); process.exit(1); }
console.log(`PASS — ${cases.length} certificate-page and unit-page cases for the master's ministry paper.`);
