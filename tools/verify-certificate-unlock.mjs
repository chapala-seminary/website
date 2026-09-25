// Does every certificate page unlock for a student who passed every unit?
//
//   node tools/verify-certificate-unlock.mjs <server>
//
// The unified engine records a pass as cts_<slug>_progress {unitN:true} and
// cts_<slug>_uN_mc_passed = "1". Every certificate page was written against
// its own course's old engine, and not all of them read those keys: Ruth and
// Esther's read re_unitN_passed, which nothing on the new site writes, so a
// student who finished the course was sent back to Unit 1 for ever. This
// seeds a fully-passed student the way the engine would, opens each
// certificate page, and asks the same question cts-completion.js asks before
// it records a completion -- is the diploma visible? -- and, with nothing
// passed, that it is NOT (a page that shows the diploma to everyone has no
// gating at all).
import { chromium } from 'playwright';
import fs from 'fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8823';
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const catalog = JSON.parse(fs.readFileSync('worker/catalog.json', 'utf8'));

// the certificate pages of a course: <prefix>Certificate.html and its
// master's variants; the ethics course names its page differently
const DEGREE = new Set(['CTSMDivCertificate.html', 'CTSThMCertificate.html', 'CTSAssociateCertificate.html', 'CTSCertificateOfMinistry.html']);
// Old Testament Survey's unit pages are CTSUnitN.html but its certificates are CTSOTS*
const pages = (prefix) => (prefix = prefix === 'CTS' ? 'CTSOTS' : prefix, fs.readdirSync('dist'))
  .filter((f) => !DEGREE.has(f))
  .filter((f) => new RegExp(`^${prefix}(MDiv|ThM|Mth)?Certificate\\.html$`, 'i').test(f)
    || (prefix === 'CTSEthics' && f === 'ethics_certificate.html'));

const fails = [];
let checks = 0;
const ok = (c, m) => { checks++; if (!c) fails.push(m); };

const browser = await chromium.launch({ executablePath: CHROME });

// The seed is planted on a unit page and that page is loaded once, because
// that is where a student's progress lives: the engine reconciles the old
// keys the certificate page reads on every unit-page load. Then the
// certificate page is opened in the same browser.
async function open(file, unitPage, seed) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(`${BASE}/${unitPage}`, { waitUntil: 'load' });
  await page.evaluate((s) => { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, seed);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(300);
  await page.goto(`${BASE}/${file}`, { waitUntil: 'load' });
  await page.waitForTimeout(700);
  const r = await page.evaluate(() => {
    const visible = (el) => !!(el && el.offsetParent !== null && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden');
    const sels = ['#diploma', '#cert-wrap', '.diploma', '#certificate', '.certificate', '#cert', '.cert-wrap', '.sheet'];
    const dip = sels.map((s) => document.querySelector(s)).find(visible);
    const name = ['#studentName', '#certName', '#cert-name', '#student-name', '#name', '.cert-name', '.student-name', '[data-student-name]']
      .map((s) => document.querySelector(s)).find(visible);
    let done = []; try { done = JSON.parse(localStorage.getItem('cts_done_codes') || '[]'); } catch (e) {}
    return { diploma: !!dip, nameText: name ? name.textContent.trim().slice(0, 40) : null, done };
  });
  await ctx.close();
  return { ...r, errs };
}

for (const [slug, c] of Object.entries(catalog.courses)) {
  const files = pages(c.pages);
  if (!files.length) { fails.push(`${c.pages}: no certificate page found`); checks++; continue; }
  const passed = { cts_student: JSON.stringify({ name: 'Prueba Test', track: 'mdiv' }), cts_track: 'mdiv' };
  const progress = {};
  for (const u of c.units) { progress[`unit${u}`] = true; passed[`cts_${slug}_u${u}_mc_passed`] = '1'; }
  passed[`cts_${slug}_progress`] = JSON.stringify(progress);
  const none = { cts_student: passed.cts_student, cts_track: 'mdiv' };

  const unitPage = `${c.pages}Unit${c.units[0]}.html`;
  for (const f of files) {
    // the completion code cts-completion.js derives from the page's filename
    let code = f.toLowerCase().replace(/(thm|mth|mdiv)?certificate\.html$/, '').toUpperCase();
    if (code === 'ETHICS_') code = 'ETHICS';
    const yes = await open(f, unitPage, passed);
    ok(yes.errs.length === 0, `${f}: page errors: ${yes.errs.slice(0, 2).join(' | ')}`);
    ok(yes.diploma, `${f}: does NOT unlock for a student who passed every unit of ${slug}`);
    if (yes.diploma) ok(!yes.nameText || !/^[\[{]/.test(yes.nameText), `${f}: shows raw JSON where the student's name should be: "${yes.nameText}"`);
    ok(yes.done.includes(code), `${f}: unlocking did not record the completion code ${code} (got ${JSON.stringify(yes.done)})`);
    const no = await open(f, unitPage, none);
    ok(!no.diploma, `${f}: shows the diploma to a student who passed nothing`);
    ok(!no.done.includes(code), `${f}: records completion ${code} for a student who passed nothing`);
  }
}

/* ---- the degree pages ----------------------------------------------------
 * They count what the course certificates recorded: cts_degree_courses (course
 * names, for the Certificate of Ministry and the Associate) and the master's
 * code lists (for the Th.M. and M.Div.). Seed exactly what a finished student
 * would hold and see that each diploma unlocks -- and, one course short, does
 * not. */
const names = (codes) => codes.map((c) => catalog.completions[c]?.name).filter(Boolean);
const FOUNDATION = ['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK'];
const MDIV_CORE = [...FOUNDATION, 'CTSHERMENEUTICS', 'CTSLA', 'CTSGENESIS', 'CTSPSALMS', 'CTSMATT', 'CTSROMANS', 'CTSACTS',
  'CTSAPOL', 'COUNSELING', 'CTSAL', 'CTSWORSHIP', 'CTSCE', 'CTSMISSIONS'];
const allCodes = Object.keys(catalog.completions);
const electives = (n, avoid) => allCodes.filter((c) => !avoid.includes(c)).slice(0, n);
const student = JSON.stringify({ name: 'Prueba Test', track: 'mdiv' });
const degreeSeed = (codes, masters) => ({
  cts_student: student, cts_track: 'mdiv',
  cts_done_codes: JSON.stringify(codes), cts_degree_courses: JSON.stringify(names(codes)),
  cts_mdiv_done_codes: JSON.stringify(masters ? codes : []), cts_thm_done_codes: JSON.stringify(masters ? codes : []),
});
async function openDegree(file, seed) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(`${BASE}/${file}`, { waitUntil: 'load' });
  await page.evaluate((s) => { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, seed);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(500);
  const r = await page.evaluate(() => {
    const visible = (el) => !!(el && el.offsetParent !== null && getComputedStyle(el).display !== 'none');
    const dip = ['#certCard', '#diploma', '.diploma', '#certificate', '.certificate', '.cert-wrap', '#cert'].map((s) => document.querySelector(s)).find(visible);
    const print = [...document.querySelectorAll('button')].find((b) => /print|imprimir/i.test(b.textContent) && visible(b) && !b.disabled);
    return { diploma: !!dip, print: !!print };
  });
  await ctx.close();
  return { ...r, errs };
}
const DEGREES = [
  ['CTSCertificateOfMinistry.html', [...FOUNDATION, ...electives(5, FOUNDATION)], false],
  ['CTSAssociateCertificate.html', [...FOUNDATION, ...electives(18, FOUNDATION)], false],
  ['CTSThMCertificate.html', [...FOUNDATION, ...electives(5, FOUNDATION)], true],
  ['CTSMDivCertificate.html', [...MDIV_CORE, ...electives(10, MDIV_CORE)], true],
];
for (const [file, codes, masters] of DEGREES) {
  const yes = await openDegree(file, degreeSeed(codes, masters));
  ok(yes.errs.length === 0, `${file}: page errors: ${yes.errs.slice(0, 2).join(' | ')}`);
  // the master's diplomas are shown only in print; the enabled print button is the unlock
  ok(yes.print, `${file}: does not unlock a printable diploma for a student with the ${codes.length} required courses (diploma ${yes.diploma}, print ${yes.print})`);
  const short = await openDegree(file, degreeSeed(codes.slice(0, -1), masters));
  ok(!short.print && !short.diploma, `${file}: unlocks the diploma one course short`);
}

await browser.close();
console.log(`${checks} assertions across the certificate pages of ${Object.keys(catalog.courses).length} courses`);
if (!fails.length) console.log('PASS — every certificate unlocks for a finished course and for nothing less.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach((f) => console.log('  ' + f)); process.exitCode = 1; }
