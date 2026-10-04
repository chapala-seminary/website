/* The textbook test, driven in a browser the way a student would use it.
 *
 *   node tools/verify-textbook-test.mjs <base-url>      # run by npm test
 *
 * Dr. Cook's rules (3 Oct 2026): twenty questions drawn at random from the
 * forty on each attempt, eighteen right to pass, answers compared without
 * regard to capitals, accents or punctuation. tools/verify-textbooks.mjs
 * checks the data; this checks the page does what the data says:
 *   - a fresh attempt draws twenty distinct questions, and two fresh
 *     browsers draw differently;
 *   - eighteen right passes, and the pass is kept (the book page says so);
 *   - seventeen right fails, locks the page, and -- once the wait is over --
 *     a fresh twenty are drawn;
 *   - a reload mid-attempt brings back the same twenty and the answers typed;
 *   - an answer typed in CAPITALS without its accent is still right;
 *   - the Spanish control works.
 * Answers are read from the page the student has, never from the source
 * tree: a checker that reads the generator's input only confirms the
 * generator agrees with itself.
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const PAGE = 'CTSTextbookCultsTest.html';
const CHROME = process.env.CHROME_PATH;
const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const fails = [];
let checks = 0;
const ok = (c, m, d) => { checks++; if (!c) fails.push(m + (d ? `\n        ${d}` : '')); };

async function open(seed = {}) {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`${BASE}/${PAGE}`, { waitUntil: 'load' });
  await p.evaluate((s) => { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, seed);
  await p.reload({ waitUntil: 'load' });
  await p.waitForTimeout(200);
  return { ctx, p, errs };
}
const draw = (p) => p.evaluate(() => window.CTS_TEXTBOOK.draw());
const bank = (p) => p.evaluate(() => window.CTS_TEXTBOOK_TEST);
/* Type answers into the first `right` inputs from the page's own data, and a
   wrong word into the rest, pressing Check on each as a student would. */
async function answer(p, right, mangle = (a) => a) {
  const T = await bank(p), d = await draw(p);
  for (let i = 0; i < d.length; i++) {
    const q = T.questions[d[i]];
    const input = p.locator(`input[data-cts-fill="${i}"]`);
    await input.fill(i < right ? mangle(q.answer.en) : 'xyzzy wrong');
    await p.locator(`button[data-cts-fill-check="${i}"]`).click();
  }
}
const student = JSON.stringify({ name: 'T', track: 'cert' });

// 1. a fresh draw: twenty distinct questions; another browser draws differently
{
  const a = await open({ cts_student: student }), b = await open({ cts_student: student });
  const da = await draw(a.p), db = await draw(b.p), T = await bank(a.p);
  ok(T.draw === 20 && T.pass === 18 && T.questions.length === 40, `the page says draw ${T.draw}, pass ${T.pass}, ${T.questions.length} questions`);
  ok(da.length === 20 && new Set(da).size === 20 && da.every((i) => i >= 0 && i < 40), 'a fresh attempt draws twenty distinct questions', JSON.stringify(da));
  ok(JSON.stringify(da) !== JSON.stringify(db), 'two fresh browsers draw the same twenty in the same order');
  ok((await a.p.locator('input[data-cts-fill]').count()) === 20, 'twenty answer boxes on the page');
  ok(a.errs.length === 0, 'page errors', a.errs[0]);
  // 4. a reload mid-attempt keeps the draw and the answers
  await a.p.locator('input[data-cts-fill="0"]').fill('something');
  await a.p.waitForTimeout(100);
  await a.p.reload({ waitUntil: 'load' });
  ok(JSON.stringify(await draw(a.p)) === JSON.stringify(da), 'a reload mid-attempt changed the draw');
  ok((await a.p.locator('input[data-cts-fill="0"]').inputValue()) === 'something', 'a reload mid-attempt lost the answer typed');
  await a.ctx.close(); await b.ctx.close();
}
// 2. eighteen right passes; the pass is kept and the book page says so
{
  const { ctx, p, errs } = await open({ cts_student: student });
  await answer(p, 18, (a) => a.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, ''));   // capitals, no accents
  await p.locator('#tb-submit').click();
  await p.waitForTimeout(300);
  const res = await p.locator('#tb-result').textContent();
  ok(/Passed/.test(res) && /18 of 20/.test(res), 'eighteen right (typed in capitals without accents) did not pass', res);
  const passed = await p.evaluate(() => localStorage.getItem('cts_textbook_cults_passed'));
  ok(/^\d{4}-\d{2}-\d{2}$/.test(passed || ''), 'the pass was not recorded as a date', passed);
  ok(await p.locator('#tb-status .cts-passed').isVisible(), 'the pass panel is not shown');
  ok(await p.locator('#tb-submit').isDisabled(), 'submit stays enabled after a pass');
  ok((await p.evaluate(() => JSON.parse(localStorage.getItem('cts_textbooks_passed') || '[]'))).includes('cults'), 'cts_textbooks_passed does not list the book');
  await p.goto(`${BASE}/CTSTextbookCults.html`, { waitUntil: 'load' });
  await p.waitForTimeout(200);
  ok(await p.locator('#tb-passed-note').isVisible() && /passed/i.test(await p.locator('#tb-passed-note').textContent()), 'the book page does not say the test is passed');
  ok(errs.length === 0, 'page errors on the pass', errs[0]);
  await ctx.close();
}
// 3. seventeen right fails, locks for the certificate wait, and the next attempt is a fresh draw
{
  const { ctx, p } = await open({ cts_student: student });
  const before = await draw(p);
  await answer(p, 17);
  await p.locator('#tb-submit').click();
  await p.waitForTimeout(300);
  const res = await p.locator('#tb-result').textContent();
  ok(/Not yet/.test(res) && /17 of 20/.test(res), 'seventeen right did not fail', res);
  const lock = await p.evaluate(() => +localStorage.getItem('cts_textbook_cults_lock'));
  ok(lock > Date.now() && lock - Date.now() <= 2 * 60000 + 2000, 'a failed attempt on the certificate track is not locked for two minutes', String(lock - Date.now()));
  ok(await p.locator('#tb-submit').isDisabled(), 'submit stays enabled while locked');
  ok(await p.locator('input[data-cts-fill="0"]').isDisabled(), 'answers stay open while locked');
  ok(await p.evaluate(() => !localStorage.getItem('cts_textbook_cults_passed')), 'a failed attempt recorded a pass');
  // the wait over: a fresh draw, without a reload
  await p.evaluate(() => { localStorage.setItem('cts_textbook_cults_lock', String(Date.now() - 1000)); const s = JSON.parse(localStorage.getItem('cts_textbook_cults_state')); s.redrawAt = Date.now() - 1000; localStorage.setItem('cts_textbook_cults_state', JSON.stringify(s)); });
  await p.reload({ waitUntil: 'load' });
  await p.waitForTimeout(300);
  const after = await draw(p);
  ok(JSON.stringify(after) !== JSON.stringify(before) && after.length === 20, 'after the wait, the next attempt did not draw a fresh twenty');
  ok(!(await p.locator('#tb-submit').isDisabled()), 'submit is still disabled after the wait');
  ok((await p.locator('input[data-cts-fill="0"]').inputValue()) === '', 'the new attempt did not start empty');
  await ctx.close();
}
// 3b. a master's student waits fifteen minutes
{
  const { ctx, p } = await open({ cts_student: JSON.stringify({ name: 'T', track: 'mdiv' }), cts_track: 'mdiv' });
  await answer(p, 0);
  await p.locator('#tb-submit').click();
  await p.waitForTimeout(300);
  const lock = await p.evaluate(() => +localStorage.getItem('cts_textbook_cults_lock'));
  ok(lock - Date.now() > 14 * 60000, "a master's student's failed attempt is not locked for fifteen minutes", String(lock - Date.now()));
  await ctx.close();
}
// 5. the language control
{
  const { ctx, p } = await open({ cts_student: student });
  await p.locator('button[data-lang="es"]').click();
  ok(await p.evaluate(() => document.body.classList.contains('lang-es') && localStorage.getItem('cts_lang') === 'es'), 'Español did not switch the page');
  ok(await p.locator('#tb-submit .lang-es').isVisible() && !(await p.locator('#tb-submit .lang-en').isVisible()), 'the Spanish label is not what shows');
  await ctx.close();
}

// 6. the course waits for the test on the master's tracks (Dr. Cook, 4 Oct 2026)
{
  const units = {}; for (let u = 1; u <= 10; u++) units['unit' + u] = true;
  const mdiv = { cts_student: JSON.stringify({ name: 'T', track: 'mdiv' }), cts_track: 'mdiv', cts_cults_progress: JSON.stringify(units) };
  // a master's student with every Cults unit passed: not complete, told to take the test
  const { ctx, p, errs } = await open(mdiv);
  await p.goto(`${BASE}/CTSCultsUnit10.html`, { waitUntil: 'load' }); await p.waitForTimeout(400);
  const u = await p.evaluate(() => ({ done: localStorage.getItem('cts_done_codes') || '', banner: (document.getElementById('cts-passed-banner') || {}).innerText || '' }));
  ok(!u.done.includes('CTSCULTS'), `a master's student with all Cults units is recorded complete without the textbook test (${u.done})`);
  ok(/textbook test/i.test(u.banner), `the passed banner does not send the master's student to the textbook test: "${u.banner.slice(0, 120)}"`);
  // the certificate page holds the diploma and says why
  await p.goto(`${BASE}/CTSCultsCertificate.html`, { waitUntil: 'load' }); await p.waitForTimeout(800);
  const c1 = await p.evaluate(() => { const v = (el) => !!(el && el.offsetParent !== null); return { dip: v(document.querySelector('#diploma,#cert-wrap,.diploma,#certificate,.certificate,#cert,.cert-wrap')), hold: v(document.getElementById('cts-textbook-hold')) }; });
  ok(!c1.dip && c1.hold, `the certificate page should hold the diploma and show the textbook note (diploma ${c1.dip}, note ${c1.hold})`);
  // passing the test completes the course
  await p.goto(`${BASE}/${PAGE}`, { waitUntil: 'load' }); await p.waitForTimeout(200);
  await answer(p, 20);
  await p.locator('#tb-submit').click(); await p.waitForTimeout(500);
  const after = await p.evaluate(() => ({ done: localStorage.getItem('cts_done_codes') || '', mdiv: localStorage.getItem('cts_mdiv_done_codes') || '', res: document.getElementById('tb-result').textContent }));
  ok(after.done.includes('CTSCULTS') && after.mdiv.includes('CTSCULTS'), `passing the test did not complete the course on the M.Div. list (${after.done} / ${after.mdiv})`);
  ok(/completes the course/.test(after.res), `the result does not say the course is complete: "${after.res}"`);
  await p.goto(`${BASE}/CTSCultsCertificate.html`, { waitUntil: 'load' }); await p.waitForTimeout(800);
  const c2 = await p.evaluate(() => { const v = (el) => !!(el && el.offsetParent !== null); return { dip: v(document.querySelector('#diploma,#cert-wrap,.diploma,#certificate,.certificate,#cert,.cert-wrap')), hold: v(document.getElementById('cts-textbook-hold')) }; });
  ok(c2.dip && !c2.hold, `after the test the certificate should show (diploma ${c2.dip}, note ${c2.hold})`);
  ok(errs.length === 0, 'page errors in the master\'s flow', errs[0]);
  await ctx.close();
  // a Certificate-track student is not held
  const cert = { ...mdiv, cts_student: JSON.stringify({ name: 'T', track: 'cert' }), cts_track: 'cert' };
  const b = await open(cert);
  await b.p.goto(`${BASE}/CTSCultsUnit10.html`, { waitUntil: 'load' }); await b.p.waitForTimeout(400);
  const d = await b.p.evaluate(() => localStorage.getItem('cts_done_codes') || '');
  ok(d.includes('CTSCULTS'), `a Certificate-track student with all Cults units is held by the textbook test, which does not apply to them (${d})`);
  await b.ctx.close();
}

// 7. the required-reading tests (Dr. Cook's Add-ons, 4 Oct 2026) are the same test
//    on the readings: Genesis Intensive, held on the master's tracks, in its own words
{
  const R = 'CTSGenesisReadingsTest.html';
  const units = {}; for (let u = 1; u <= 12; u++) units['unit' + u] = true;
  const mdiv = { cts_student: JSON.stringify({ name: 'T', track: 'mdiv' }), cts_track: 'mdiv', cts_genesis_progress: JSON.stringify(units) };
  const { ctx, p, errs } = await open(mdiv);
  await p.goto(`${BASE}/${R}`, { waitUntil: 'load' }); await p.waitForTimeout(300);
  const T = await bank(p), d = await draw(p);
  ok(T.kind === 'reading' && T.draw === 20 && T.pass === 18 && T.questions.length === 40, `the Genesis readings test says kind ${T.kind}, draw ${T.draw}, pass ${T.pass}, ${T.questions.length} questions`);
  ok(d.length === 20 && new Set(d).size === 20, 'the readings test draws twenty distinct questions');
  ok(/readings/i.test(await p.locator('.tb-about').textContent()), 'the page does not speak of readings');
  ok(!/textbook/i.test(await p.locator('.cts-masthead').textContent()), 'the masthead calls the readings a textbook');
  // all units passed on the M.Div.: held, and sent to the readings test in those words
  await p.goto(`${BASE}/CTSGenesisUnit12.html`, { waitUntil: 'load' }); await p.waitForTimeout(400);
  const u = await p.evaluate(() => ({ done: localStorage.getItem('cts_done_codes') || '', banner: (document.getElementById('cts-passed-banner') || {}).innerText || '', box: (document.getElementById('cts-textbook') || {}).innerText || '' }));
  ok(!u.done.includes('CTSGENESIS'), `a master's student with all Genesis units is recorded complete without the readings test (${u.done})`);
  ok(/required-reading test/i.test(u.banner) && !/textbook/i.test(u.banner), `the passed banner should send to the required-reading test, not a textbook: "${u.banner.slice(0, 160)}"`);
  ok(/Required readings/i.test(u.box) && /Required-reading test/i.test(u.box), `the unit box should name the readings and their test: "${u.box.slice(0, 120)}"`);
  await p.goto(`${BASE}/CTSGenesisCertificate.html`, { waitUntil: 'load' }); await p.waitForTimeout(800);
  const c1 = await p.evaluate(() => { const v = (el) => !!(el && el.offsetParent !== null); return { dip: v(document.querySelector('#diploma,#cert-wrap,.diploma,#certificate,.certificate,#cert,.cert-wrap')), hold: v(document.getElementById('cts-textbook-hold')), text: (document.getElementById('cts-textbook-hold') || {}).innerText || '' }; });
  ok(!c1.dip && c1.hold && /required-reading/i.test(c1.text), `the Genesis certificate should hold the diploma and name the readings test (diploma ${c1.dip}, note ${c1.hold}: "${c1.text.slice(0, 80)}")`);
  // passing the test completes the course
  await p.goto(`${BASE}/${R}`, { waitUntil: 'load' }); await p.waitForTimeout(200);
  await answer(p, 20, (a) => a);
  await p.locator('#tb-submit').click(); await p.waitForTimeout(500);
  const after = await p.evaluate(() => ({ done: localStorage.getItem('cts_done_codes') || '', passed: localStorage.getItem('cts_textbook_genesisreadings_passed'), res: document.getElementById('tb-result').textContent }));
  ok(!!after.passed && after.done.includes('CTSGENESIS'), `passing the readings test did not complete Genesis on the M.Div. (${after.done}, pass ${after.passed})`);
  ok(/completes the course/.test(after.res), `the result does not say the course is complete: "${after.res}"`);
  ok(errs.length === 0, 'page errors in the readings flow', errs[0]);
  await ctx.close();
  // the accepted alternate, as a student types it: "beginning" marks right
  const b = await open({ cts_student: student });
  await b.p.goto(`${BASE}/${R}`, { waitUntil: 'load' }); await b.p.waitForTimeout(200);
  const right = await b.p.evaluate(() => { const q = window.CTS_TEXTBOOK_TEST.questions[0]; return [window.CTSFill.fillRight(q, 'beginning'), window.CTSFill.fillRight(q, 'The Beginnings'), window.CTSFill.fillRight(q, 'ending')]; });
  ok(right[0] === true && right[1] === true && right[2] === false, '"beginning" and "The Beginnings" should be right for Genesis #1 and "ending" wrong', JSON.stringify(right));
  await b.ctx.close();
}

await browser.close();
console.log(`${checks} assertions on ${PAGE} and the Genesis readings test`);
if (!fails.length) console.log('PASS — the textbook test draws, marks, locks and keeps as Dr. Cook asked.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach((f) => console.log('  ' + f)); process.exit(1); }
