/* A student who fails a unit exam can always find the way to retake it
 * (Wayne, 5 Oct 2026). A Th.M. student missed three questions, knew he had to
 * retake, and could not. Submit, wait, retake already worked; two paths around
 * it did not, and said nothing:
 *
 *   - answers given, too many wrong to pass, Submit not pressed: answered
 *     questions cannot be changed, so the page sat there. It now says the
 *     attempt cannot pass and that Submit records it and starts the wait;
 *   - the page opened again during the wait: an empty exam that ignored every
 *     click. It now says the exam is waiting, and for how long.
 *
 * And Reset no longer skips the wait. Each case ends with the retake passing.
 * A Th.M. student on Systematic Theology, and a Certificate student (whose
 * fill-ins do not count), as a student would use the page.
 *
 *   node tools/verify-retake.mjs http://127.0.0.1:8798
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const CHROME = process.env.CHROME_PATH;
const PAGE = 'CTSSTUnit2.html';
const fails = [];
let checks = 0;
const ok = (c, m) => { checks++; if (!c) fails.push(m); };

const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});

async function open(track) {
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => { try { sessionStorage.setItem('cts_exam_view:' + location.pathname, '1'); } catch (e) {} });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(`${BASE}/${PAGE}`, { waitUntil: 'load' });
  await page.evaluate((t) => {
    localStorage.clear();
    localStorage.setItem('cts_student', JSON.stringify({ name: 'T', email: 't@x.org', track: t }));
    localStorage.setItem('cts_track', t);
  }, track);
  await page.reload({ waitUntil: 'load' });
  return { ctx, page, errs };
}
// The first `wrong` multiple-choice questions answered wrong, the rest right.
const answerMC = (page, wrong) => page.evaluate((w) => {
  const U = window.CTS_UNIT;
  U.mc.forEach((q, i) => {
    const want = i < w ? (q.answer === 0 ? 1 : 0) : q.answer;
    const b = document.querySelector(`.question[data-mc="${i}"] button.option[data-opt="${want}"]`);
    if (b) b.click();
  });
}, wrong);
// Fill-ins checked one by one, the first `wrong` wrong; short answers written
// with their keywords.
const answerRest = (page, wrongFill) => page.evaluate((w) => {
  const U = window.CTS_UNIT;
  U.fill.forEach((q, i) => {
    const t = document.querySelector(`input[data-fill="${i}"]`);
    if (!t || t.disabled) return;
    t.value = i < w ? 'not the answer' : q.answer.en;
    t.dispatchEvent(new Event('input', { bubbles: true }));
    const c = document.querySelector(`button[data-fill-check="${i}"]`); if (c) c.click();
  });
  document.querySelectorAll('textarea[data-sa]').forEach((t) => {
    const q = U.sa[+t.dataset.sa];
    const kws = (Array.isArray(q.keywords) ? q.keywords : (q.keywords.en || [])).flat().join(' ');
    t.value = kws + ' ' + ((q.model && q.model.en) || '');
    t.dispatchEvent(new Event('input', { bubbles: true }));
  });
}, wrongFill);
const seen = (page) => page.evaluate(() => ({
  top: (document.getElementById('cts-exam-status') || {}).innerText || '',
  result: (document.getElementById('examResult') || {}).innerText || '',
  answered: document.querySelectorAll('.question[data-mc] .feedback-text').length,
  locked: Object.keys(localStorage).some((k) => /_(full|sa)_lock$/.test(k) && +localStorage[k] > Date.now()),
  passed: /"unit2":true/.test(localStorage.getItem('cts_st_progress') || ''),
}));
const endWait = (page) => page.evaluate(() => Object.keys(localStorage)
  .filter((k) => /_(full|sa)_lock$/.test(k)).forEach((k) => localStorage.setItem(k, String(Date.now() - 1000))));
const submit = (page) => page.click('#submitExamBtn');
const reset = (page) => page.click('#resetExamBtn');
const settle = (page) => page.waitForTimeout(150);

async function retakePasses(page, label) {
  await endWait(page);
  await page.reload({ waitUntil: 'load' });
  let s = await seen(page);
  ok(!s.top.trim(), `${label}: once the wait is over, the exam says nothing in the way (got "${s.top.trim()}")`);
  await answerMC(page, 0); await answerRest(page, 0); await settle(page);
  await submit(page); await settle(page);
  s = await seen(page);
  ok(s.passed, `${label}: the retake passes`);
}

// 1. Three wrong, Submit not pressed.
{
  const { ctx, page, errs } = await open('thm');
  await answerMC(page, 2); await settle(page);
  let s = await seen(page);
  ok(!/cannot pass/i.test(s.top), 'two wrong of twenty can still pass: no notice');
  await ctx.close();
}
{
  const { ctx, page, errs } = await open('thm');
  await answerMC(page, 3); await settle(page);
  let s = await seen(page);
  ok(/cannot pass/i.test(s.top) && /Submit/.test(s.top), `three wrong: the top of the exam says it cannot pass and to press Submit (got "${s.top}")`);
  ok(/cannot pass/i.test(s.result), 'three wrong: and so does the line beside Submit');
  ok(/15-minute/.test(s.top), 'a master\'s student is told the wait is fifteen minutes');
  await page.reload({ waitUntil: 'load' });
  s = await seen(page);
  ok(s.answered === 20 && /cannot pass/i.test(s.top), 'coming back later, the answers are still there and so is the notice');
  await submit(page); await settle(page);
  s = await seen(page);
  ok(s.locked && /Not yet/.test(s.result), 'Submit records the failed attempt and starts the wait');
  await retakePasses(page, 'three wrong, then Submit');
  ok(!errs.length, `no page errors: ${errs.join('; ')}`);
  await ctx.close();
}

// 2. Back during the wait.
{
  const { ctx, page, errs } = await open('thm');
  await answerMC(page, 3); await submit(page); await settle(page);
  await page.reload({ waitUntil: 'load' });
  let s = await seen(page);
  ok(/opens again in 1[45] minute/.test(s.top), `during the wait the page says when the exam opens again (got "${s.top}")`);
  await answerMC(page, 0); await settle(page);
  s = await seen(page);
  ok(s.answered === 0 && /opens again/.test(s.result), 'a click during the wait is answered with the wait, beside Submit');
  await reset(page); await settle(page);
  s = await seen(page);
  ok(s.locked, 'Reset during the wait does not end it');
  await retakePasses(page, 'back during the wait');
  ok(!errs.length, `no page errors: ${errs.join('; ')}`);
  await ctx.close();
}

// 3. Fill-ins: multiple choice passed and kept, three fill-ins wrong.
{
  const { ctx, page, errs } = await open('thm');
  await answerMC(page, 0); await answerRest(page, 3); await settle(page);
  let s = await seen(page);
  ok(/fill in the blank: 3 wrong/.test(s.top), `three fill-ins wrong: the notice names the fill-ins (got "${s.top}")`);
  await submit(page); await settle(page);
  await page.reload({ waitUntil: 'load' });
  s = await seen(page);
  ok(/multiple choice is passed and kept/.test(s.top), 'during the written part\'s wait, the page says multiple choice is kept');
  await retakePasses(page, 'three fill-ins wrong');
  ok(!errs.length, `no page errors: ${errs.join('; ')}`);
  await ctx.close();
}

// 4. Reset on an attempt that cannot pass is Submit, not a way round the wait.
{
  const { ctx, page } = await open('thm');
  await answerMC(page, 3); await settle(page);
  await reset(page); await settle(page);
  const s = await seen(page);
  ok(s.locked && /Not yet/.test(s.result), 'Reset with three wrong records the attempt and starts the wait');
  await ctx.close();
}
{
  const { ctx, page } = await open('thm');
  await answerMC(page, 1); await settle(page);
  await reset(page); await settle(page);
  const s = await seen(page);
  ok(!s.locked && s.answered === 0, 'Reset on an attempt that can still pass just clears it, with no wait');
  await ctx.close();
}

// 5. Certificate: fill-ins do not count, so three wrong there is no notice;
// the wait is two minutes.
{
  const { ctx, page } = await open('cert');
  await answerMC(page, 0); await answerRest(page, 3); await settle(page);
  let s = await seen(page);
  ok(!/cannot pass/i.test(s.top), 'Certificate: wrong fill-ins (which do not count) bring no notice');
  await ctx.close();
}
{
  const { ctx, page } = await open('cert');
  await answerMC(page, 3); await settle(page);
  const s = await seen(page);
  ok(/2-minute/.test(s.top), 'Certificate: the notice gives the two-minute wait');
  await ctx.close();
}

await browser.close();
console.log(`${checks} checks on finding the way to a retake`);
if (fails.length) { console.log('FAIL\n  ' + fails.join('\n  ')); process.exit(1); }
console.log('PASS — a failed attempt always says how to retake.');
