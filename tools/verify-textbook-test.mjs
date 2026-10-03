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

await browser.close();
console.log(`${checks} assertions on ${PAGE}`);
if (!fails.length) console.log('PASS — the textbook test draws, marks, locks and keeps as Dr. Cook asked.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach((f) => console.log('  ' + f)); process.exit(1); }
