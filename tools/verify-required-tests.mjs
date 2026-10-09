/* A course with two required tests, in a browser, the way a student meets it
 * (Dr. Cook and ChatGPT's authorization, 9 Oct 2026). The pilot course is
 * Pentecostalism & the Charismatic Movement: its textbook test, and a test on
 * the five readings of its reading room.
 *
 *   node tools/verify-required-tests.mjs <base-url>      # run by npm test
 *
 * The reading test page, as shipped (not yet in force):
 *   - says it is not yet required;
 *   - draws twenty distinct questions, four from each of the five readings,
 *     and a fresh attempt draws differently;
 *   - marks each answer at once, showing the right answer to a wrong one;
 *   - eighteen right (90%) passes, in English or in Spanish; seventeen fails
 *     and locks the page for the master's wait (15 minutes); after the wait a
 *     fresh twenty are drawn and a pass is kept; a practice round after a
 *     pass takes nothing away.
 * With the reading test activated (the generated requirements swapped for a
 * copy with an activation date in the past -- the deployed file is never
 * changed by this check):
 *   - the certificate waits on a master's track for whichever test is still
 *     to pass, and says which; with both passed it shows;
 *   - a master's completion the record held before activation (the Worker's
 *     exemption, as cts-sync.js keeps it) is not held;
 *   - the Certificate track is not held at all;
 *   - the last unit's "passed" panel sends a master's student to the first
 *     test still to pass, and passing the reading test with the textbook
 *     still to pass does not complete the course and says so.
 * As shipped, a master's student with the textbook test passed is not held
 * by the reading test.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const CHROME = process.env.CHROME_PATH;
const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const catalog = JSON.parse(fs.readFileSync('worker/catalog.json', 'utf8'));
const fails = [];
let checks = 0;
const ok = (c, m, d) => { checks++; if (!c) fails.push(m + (d !== undefined ? `\n        ${typeof d === 'string' ? d : JSON.stringify(d)}` : '')); };

const SLUG = 'pentecostal', CODE = 'CTSPENTECOSTAL', BOOK = 'pentecostal', READ = 'pentecostalreadings';
const TEST = 'CTSPentecostalReadingsTest.html', CERT = 'CTSPentecostalCertificate.html';
const units = catalog.courses[SLUG].units;
const LAST = `CTSPentecostalUnit${units[units.length - 1]}.html`;

// the generated requirements with the reading test activated a year ago
const shipped = fs.readFileSync('public/assets/js/cts-required-tests.js', 'utf8');
const activeMap = (() => { const w = {}; new Function('window', shipped)(w); const m = JSON.parse(JSON.stringify(w.CTS_REQUIRED_TESTS));
  for (const t of m[CODE]) if (t.slug === READ) t.requiredFrom = new Date(Date.now() - 365 * 864e5).toISOString(); return m; })();
ok(activeMap[CODE].length === 2, 'the generated requirements give Pentecostalism two tests', activeMap[CODE]);

async function context({ active = false } = {}) {
  const ctx = await browser.newContext();
  if (active) {
    const js = `window.CTS_REQUIRED_TESTS = ${JSON.stringify(activeMap)};`;
    await ctx.addInitScript(js);
    await ctx.route(/\/assets\/js\/cts-required-tests\.js(\?.*)?$/, (r) => r.fulfill({ status: 200, contentType: 'application/javascript', body: js }));
  }
  return ctx;
}
async function openOn(ctx, page, seed) {
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`${BASE}/${page}`, { waitUntil: 'load' });
  if (seed) {
    await p.evaluate((s) => { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, seed);
    await p.reload({ waitUntil: 'load' });
  }
  await p.waitForTimeout(250);
  return { p, errs };
}
const who = (track) => ({ cts_student: JSON.stringify({ name: 'Prueba Pentecostal', track }), cts_track: track });
const allUnits = () => {
  const s = {}, progress = {};
  for (const u of units) { progress[`unit${u}`] = true; s[`cts_${SLUG}_u${u}_mc_passed`] = '1'; }
  s[`cts_${SLUG}_progress`] = JSON.stringify(progress);
  return s;
};
const draw = (p) => p.evaluate(() => window.CTS_TEXTBOOK.draw());
const bank = (p) => p.evaluate(() => window.CTS_TEXTBOOK_TEST);
async function answer(p, right, lang = 'en') {
  const T = await bank(p), d = await draw(p);
  for (let i = 0; i < d.length; i++) {
    const q = T.questions[d[i]];
    await p.locator(`input[data-cts-fill="${i}"]`).fill(i < right ? q.answer[lang] : 'xyzzy wrong');
    await p.locator(`button[data-cts-fill-check="${i}"]`).click();
  }
}

/* ---- the reading test page, as shipped ----------------------------------- */
{
  const ctx = await context();
  const { p, errs } = await openOn(ctx, TEST, who('mdiv'));
  const T = await bank(p);
  ok(T.draw === 20 && T.pass === 18 && T.questions.length === 40 && T.perReading === 4, `the test is 20 of 40, 18 to pass, 4 per reading (got ${T.draw}/${T.questions.length}/${T.pass}/${T.perReading})`);
  ok(T.requiredFrom === null, 'the page knows the test is not yet in force');
  ok(/not yet required/i.test(await p.locator('main, body').first().innerText()), 'the page says it is not yet required');
  const per = {};
  for (const q of T.questions) per[q.reading] = (per[q.reading] || 0) + 1;
  ok(JSON.stringify(per) === JSON.stringify({ 1: 8, 2: 8, 3: 8, 4: 8, 5: 8 }), 'eight questions on each of the five readings', per);
  const draws = [];
  for (let k = 0; k < 6; k++) {
    await p.evaluate(() => localStorage.removeItem('cts_textbook_pentecostalreadings_state'));
    await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(100);
    const d = await draw(p);
    draws.push(d);
    const c = {};
    for (const i of d) c[T.questions[i].reading] = (c[T.questions[i].reading] || 0) + 1;
    ok(d.length === 20 && new Set(d).size === 20 && Object.values(c).length === 5 && Object.values(c).every((x) => x === 4),
      `fresh attempt ${k + 1}: twenty distinct questions, four from each reading`, c);
  }
  ok(new Set(draws.map((d) => JSON.stringify(d))).size > 1, 'fresh attempts draw differently');
  // immediate feedback, with the right answer
  const d = await draw(p), q0 = T.questions[d[0]];
  await p.locator('input[data-cts-fill="0"]').fill('xyzzy wrong');
  await p.locator('button[data-cts-fill-check="0"]').click();
  const fb = await p.locator('.cts-fill-bad').first().innerText().catch(() => '');
  ok(fb.includes(q0.answer.en) || fb.includes(q0.answer.es), 'a wrong answer is marked at once and shows the right answer', fb);
  ok(errs.length === 0, 'page errors on the reading test', errs[0]);
  await ctx.close();
}
// 90%: seventeen fails and locks for the master's wait; after it a fresh draw; eighteen in Spanish passes
{
  const ctx = await context();
  const { p } = await openOn(ctx, TEST, who('mdiv'));
  const d1 = await draw(p);
  await answer(p, 17);
  await p.locator('#tb-submit').click(); await p.waitForTimeout(250);
  const res = await p.locator('#tb-result').innerText();
  ok(/17 of 20/.test(res) && /15 minute/.test(res), '17 of 20 (85%) does not pass, and a master\'s student waits 15 minutes', res);
  const lock = Number(await p.evaluate(() => localStorage.getItem('cts_textbook_pentecostalreadings_lock')));
  ok(lock > Date.now() + 14 * 60e3, 'the lock is set for the master\'s wait');
  ok(!(await p.evaluate(() => localStorage.getItem('cts_textbook_pentecostalreadings_passed'))), 'a failed attempt is not a pass');
  await p.evaluate(() => localStorage.setItem('cts_textbook_pentecostalreadings_lock', String(Date.now() - 1000)));
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(200);
  const d2 = await draw(p);
  ok(JSON.stringify(d1) !== JSON.stringify(d2), 'after the wait a fresh twenty are drawn (unlimited retakes)');
  await answer(p, 18, 'es');
  await p.locator('#tb-submit').click(); await p.waitForTimeout(250);
  const res2 = await p.locator('#tb-result').innerText();
  ok(/18 de 20|18 of 20/.test(res2) && /Passed|Aprobado/.test(res2), '18 of 20 (90%) passes, answered in Spanish', res2);
  const passed = await p.evaluate(() => localStorage.getItem('cts_textbook_pentecostalreadings_passed'));
  ok(/^\d{4}-\d{2}-\d{2}$/.test(passed || ''), 'the pass is kept, dated', passed);
  ok(!(await p.evaluate(() => localStorage.getItem('cts_textbook_pentecostal_passed'))), 'a reading pass is not a textbook pass');
  // a practice round after the pass, failed, takes nothing away
  const practice = p.locator('#tb-practice');
  if (await practice.count()) {
    await practice.click(); await p.waitForTimeout(150);
    await answer(p, 0);
    await p.locator('#tb-submit').click(); await p.waitForTimeout(200);
  }
  ok((await p.evaluate(() => localStorage.getItem('cts_textbook_pentecostalreadings_passed'))) === passed, 'a failed practice round after the pass leaves the pass as it was');
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(200);
  ok(/passed|aprobado/i.test(await p.locator('#tb-status').innerText()), 'and the page still says it is passed after a reload');
  await ctx.close();
}

/* ---- the certificate, with the reading test in force --------------------- */
async function certFor(seed, active = true) {
  const ctx = await context({ active });
  // the seed on a unit page first, where a student's progress lives (verify-certificate-unlock.mjs says why)
  await openOn(ctx, LAST, seed);
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`${BASE}/${CERT}`, { waitUntil: 'load' });
  await p.waitForTimeout(900);
  const r = await p.evaluate(() => {
    const visible = (el) => !!(el && el.offsetParent !== null && getComputedStyle(el).display !== 'none');
    const dip = ['#diploma', '#cert-wrap', '.diploma', '#certificate', '.certificate', '#cert', '.cert-wrap', '.sheet'].map((s) => document.querySelector(s)).find(visible);
    const note = document.getElementById('cts-textbook-hold');
    let done = []; try { done = JSON.parse(localStorage.getItem('cts_done_codes') || '[]'); } catch (e) {}
    return { diploma: !!dip, note: note && note.style.display !== 'none' ? note.innerText : '', done };
  });
  await ctx.close();
  return { ...r, errs };
}
const passBook = { cts_textbook_pentecostal_passed: '2026-10-09' }, passRead = { cts_textbook_pentecostalreadings_passed: '2026-10-09' };
{
  const r = await certFor({ ...who('mdiv'), ...allUnits(), ...passBook });
  ok(!r.diploma && /required-reading test/i.test(r.note), 'in force: textbook passed, reading test not -- the M.Div. diploma waits and says for what', r);
  ok(!r.done.includes(CODE), 'and the course is not recorded as complete', r.done);
  ok(r.errs.length === 0, 'page errors on the certificate', r.errs[0]);
}
{
  const r = await certFor({ ...who('thm'), ...allUnits(), ...passRead });
  ok(!r.diploma && /textbook test/i.test(r.note), 'in force: reading test passed, textbook not -- the Th.M. diploma waits for the textbook test', r);
}
{
  const r = await certFor({ ...who('mdiv'), ...allUnits() });
  ok(!r.diploma && /two tests/i.test(r.note), 'in force: neither passed -- the note names both tests', r.note);
}
{
  const r = await certFor({ ...who('mdiv'), ...allUnits(), ...passBook, ...passRead });
  ok(r.diploma && !r.note && r.done.includes(CODE), 'in force: both passed -- the diploma shows and the course is recorded', r);
}
{
  const r = await certFor({ ...who('mdiv'), ...allUnits(), ...passBook, cts_textbook_pentecostalreadings_exempt: 'record' });
  ok(r.diploma && !r.note, 'in force: a master\'s completion the record held before activation is not held by the reading test', r);
}
{
  const r = await certFor({ ...who('cert'), ...allUnits() });
  ok(r.diploma && r.done.includes(CODE), 'in force: a Certificate-track student is held by neither test', r);
}
{
  const r = await certFor({ ...who('mdiv'), ...allUnits(), ...passBook }, false);
  ok(r.diploma && !r.note, 'as shipped: the reading test does not hold a master\'s student who passed the textbook test', r);
}
{
  const r = await certFor({ ...who('mdiv'), ...allUnits() }, false);
  ok(!r.diploma && /textbook test/i.test(r.note) && !/two tests/i.test(r.note), 'as shipped: the textbook test still holds, as since 4 Oct', r.note);
}

/* ---- the last unit and the test pages, in force -------------------------- */
{
  const ctx = await context({ active: true });
  const { p, errs } = await openOn(ctx, LAST, { ...who('mdiv'), ...allUnits() });
  const panel = await p.locator('#cts-passed-banner').innerText().catch(() => '');
  const href = await p.locator('#cts-passed-banner a.btn.solid').first().getAttribute('href').catch(() => null);
  ok(/textbook test and the required-reading test/i.test(panel), 'the last unit\'s panel says both tests are needed', panel);
  ok(href === 'CTSTextbookPentecostalTest.html', 'and sends the student to the textbook test first', href);
  const boxes = await p.locator('aside.cts-textbook').count();
  ok(boxes === 2, `the unit shows a box for each test (${boxes})`);
  ok(errs.length === 0, 'page errors on the unit', errs[0]);
  // pass the reading test with the textbook still to pass: not complete, and it says so
  const t = await openOn(ctx, TEST);
  await answer(t.p, 20);
  await t.p.locator('#tb-submit').click(); await t.p.waitForTimeout(300);
  const res = await t.p.locator('#tb-result').innerText();
  ok(/textbook test/i.test(res) && !/completes the course/i.test(res), 'passing the reading test with the textbook still to pass says the textbook test is needed', res);
  const done = await t.p.evaluate(() => JSON.parse(localStorage.getItem('cts_done_codes') || '[]'));
  ok(!done.includes(CODE), 'and does not complete the course', done);
  await ctx.close();
}

await browser.close();
console.log(`${checks} assertions on a course with two required tests`);
if (!fails.length) console.log('PASS — two tests, each on its own; four from each reading; 90%; retakes; earlier completions protected.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach((f) => console.log('  ' + f)); process.exit(1); }
