/* The live-mode browser, against a stubbed grading API (docs/ai-grading.md).
 *
 *   node test/grading-ui.test.mjs [base-url]      # run by test/run-tests.sh
 *
 * The pages are the live build's (dist/): no key in them. Every /api route is
 * answered by test/lib/grading-stub.mjs from the question content, so each case
 * is "the server said X; the student sees Y, and the keys the certificate
 * pages read hold Z". Nothing here is graded by the page: where a case
 * asserts a verdict, the stub gave it.
 *
 * Covers (task 6): multiple choice right and wrong with its explanation;
 * fill-ins exact, accepted by the model, rejected, pending; short answers met,
 * partly, not met, and pending then graded by polling; a retake that keeps
 * what already met; the lockout after a server fail; offline and retry; an
 * appeal; a textbook test drawn by the server; a visitor who has not
 * registered; Spanish and French.
 */
import { chromium } from 'playwright';
import { GradingStub, bankOf, STUB_CODE } from './lib/grading-stub.mjs';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const UNIT = '/CTSJohnUnit1.html', SCOPE = 'u:CTSJohn/1', KEYS = { progress: 'cts_john_progress', mc: 'cts_john_u1_mc_passed', sa: 'cts_john_u1_sa_lock', full: 'cts_john_u1_full_lock', pending: 'cts_john_u1_pending' };
const TB = '/CTSTextbookCultsTest.html';
const bank = bankOf(SCOPE);
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const fails = [];
let checks = 0;
const ok = (c, m, d) => { checks++; if (!c) fails.push(m + (d ? `\n        ${d}` : '')); };
process.on('uncaughtException', (e) => { console.error(`CRASH after ${checks} checks:`, e.stack.split('\n').slice(0, 4).join('\n')); for (const f of fails) console.error('  ✗ ' + f); process.exit(1); });
// ONLY=4,6 runs just those cases while iterating
const want = (n) => !process.env.ONLY || process.env.ONLY.split(',').includes(String(n));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* A student's browser, opened on `path`, with the stub answering /api. */
async function open(stub, { path = UNIT, student = true, code = true, track = stub.track, lang } = {}) {
  const ctx = await browser.newContext();
  await ctx.route('**/*', (r) => { const u = new URL(r.request().url()); return u.origin === new URL(BASE).origin ? r.fallback() : r.abort(); });
  await stub.install(ctx);
  await ctx.addInitScript(({ student, code, track, codeValue, lang }) => {
    // each unit opens on its lesson; these cases are about the exam (assets/js/cts-exam-view.js)
    try { sessionStorage.setItem('cts_exam_view:' + location.pathname, '1'); } catch (e) {}
    window.CTS_GRADING_TEST = { pollMs: [200, 250, 300], codeWaitMs: 2500, timeoutMs: 8000 };
    try {
      if (!localStorage.getItem('__seeded')) {
        localStorage.setItem('__seeded', '1');
        // John is gated behind the seven foundation courses (cts-curriculum); this is not about gating
        localStorage.setItem('cts_done_codes', JSON.stringify(['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK']));
        if (student) { localStorage.setItem('cts_student', JSON.stringify({ name: 'Stub Student', email: 'stub@example.test', track })); localStorage.setItem('cts_track', track); }
        if (student && code) localStorage.setItem('cts_student_code', codeValue);
        if (lang) localStorage.setItem('cts_lang', lang);
      }
    } catch (e) {}
  }, { student, code, track, codeValue: STUB_CODE, lang });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('dialog', (d) => { errs.push('dialog: ' + d.message()); d.dismiss(); });
  await p.goto(BASE + path, { waitUntil: 'load' });
  return { ctx, p, errs };
}
const attemptCalls = (stub, scope) => stub.log.filter((c) => c.method === 'POST' && c.path === '/attempt' && (!scope || c.body?.scope === scope));
const body = (p) => p.locator('body').innerText();
const has = async (p, sel, text) => (await p.locator(sel).filter({ hasText: text }).count()) > 0;
const waitText = (p, text, timeout = 6000) => p.waitForFunction((t) => document.body.innerText.includes(t), text, { timeout }).then(() => true, () => false);
const waitGone = (p, text, timeout = 6000) => p.waitForFunction((t) => !document.body.innerText.includes(t), text, { timeout }).then(() => true, () => false);
const ls = (p, k) => p.evaluate((key) => localStorage.getItem(key), k);
const ready = (p) => p.waitForSelector('.question', { timeout: 8000 }).then(() => true, () => false);

async function mcAnswer(p, i, j) { await p.locator(`button.option[data-mc="${i}"][data-opt="${j}"]`).click(); }
async function mcAll(p, rightCount = bank.mc.length) {
  for (let i = 0; i < bank.mc.length; i++) {
    const j = i < rightCount ? bank.mc[i].answer : (bank.mc[i].answer + 1) % bank.mc[i].options.en.length;
    await mcAnswer(p, i, j);
    await p.waitForSelector(`.question[data-mc="${i}"] .feedback-text`);
  }
}
async function fillAll(p, rightCount = bank.fill.length, check = true) {
  for (let i = 0; i < bank.fill.length; i++) {
    await p.locator(`input[data-fill="${i}"]`).fill(i < rightCount ? bank.fill[i].answer.en : 'zzz wrong');
    if (check) { await p.locator(`input[data-fill="${i}"]`).press('Enter'); await p.waitForSelector(`.question[data-fill="${i}"] .feedback-text`); }
  }
}
async function saAll(p, hints) {
  for (let i = 0; i < bank.sa.length; i++) await p.locator(`textarea[data-sa="${i}"]`).fill(`My answer to ${i + 1}. ${hints[i] || '[[met]]'}`);
}

// ---------------------------------------------------------------------------
// 1. The page carries no key
if (want(1)) {
  const stub = new GradingStub();
  const { ctx, p, errs } = await open(stub);
  await ready(p);
  const data = await p.evaluate(() => JSON.stringify(window.CTS_UNIT));
  ok(!/"(answer|correct|accept|why|model|keywords|rubric|minHits)"/.test(data), 'CTS_UNIT carries no key field', data.slice(0, 120));
  const U = JSON.parse(data);
  ok(U.grading === 'live' && U.scope === SCOPE, 'the page says grading live and names its scope', `${U.grading} ${U.scope}`);
  ok(U.mc[0].qid === `${SCOPE}/mc/0` && U.fill[9].qid === `${SCOPE}/fill/9` && U.sa[3].qid === `${SCOPE}/sa/3`, 'every item has its contract qid');
  const html = await p.content();
  ok(!html.includes(bank.sa[0].model.en.slice(0, 40)), 'the model answer is not anywhere in the page');
  ok(attemptCalls(stub).length === 1 && attemptCalls(stub)[0].body.scope === SCOPE && attemptCalls(stub)[0].body.code === STUB_CODE && attemptCalls(stub)[0].body.lang === 'en', 'one POST /api/attempt with code, scope and language');
  ok(errs.length === 0, 'no page errors', errs[0]);
  ok(await has(p, '.cts-ai-note', 'Written answers are graded by an AI assistant against the course’s standards. You may ask for a human review of any result.'), 'the transparency note sits under the written section (English)');
  await ctx.close();
}

// 2. Multiple choice: disabled while the server answers; right, wrong, and why
if (want(2)) {
  const stub = new GradingStub(); stub.delay['/mc'] = 500;
  const { ctx, p } = await open(stub);
  await ready(p);
  await mcAnswer(p, 0, bank.mc[0].answer);
  await sleep(120);
  ok(await p.locator('.question[data-mc="0"] button.option').first().isDisabled(), 'the options are disabled while the answer is awaited');
  ok(await has(p, '.question[data-mc="0"]', 'Checking…'), '"Checking…" shows while waiting');
  ok(await p.locator('.question[data-mc="0"] .option.correct').count() === 0, 'nothing is marked before the server answers');
  await p.waitForSelector('.question[data-mc="0"] .feedback-text.correct');
  ok(await p.locator(`.question[data-mc="0"] .option.correct[data-opt="${bank.mc[0].answer}"]`).count() === 1, 'the right option chosen is marked right');
  // the answer-disclosure policy (Wayne, 18 Oct 2026): no explanation while the attempt is open
  ok(await p.locator('.question[data-mc="0"] .feedback').count() === 0, 'no explanation (why) while the attempt is open');
  const wrong = (bank.mc[1].answer + 1) % bank.mc[1].options.en.length;
  await mcAnswer(p, 1, wrong);
  await p.waitForSelector('.question[data-mc="1"] .feedback-text.incorrect');
  ok(await p.locator(`.question[data-mc="1"] .option.wrong[data-opt="${wrong}"]`).count() === 1 && await p.locator('.question[data-mc="1"] .option.correct').count() === 0, 'a wrong click marks it wrong and does not show the right one');
  ok(!(await has(p, '.question[data-mc="1"] .feedback-text', 'Correct answer')) && (await p.locator('.question[data-mc="1"] .feedback-text').innerText()).trim() === '✗ Incorrect.', 'no letter is named: "Incorrect." and nothing more');
  const n = stub.calls('/mc').length;
  await mcAnswer(p, 1, bank.mc[1].answer);
  await sleep(700);
  ok(stub.calls('/mc').length === n, 'a second click on an answered question sends nothing');
  const b = stub.calls('/mc')[0].body;
  ok(b.qid === `${SCOPE}/mc/0` && b.choice === bank.mc[0].answer && b.attemptId && b.code === STUB_CODE, 'POST /api/mc carries code, attemptId, qid and choice');
  // a reload brings the answered questions back from the server, verdicts only
  const before = stub.calls('/mc').length;
  await p.reload({ waitUntil: 'load' }); await ready(p);
  await p.waitForSelector('.question[data-mc="1"] .option.wrong');
  await sleep(500);
  ok(await p.locator('.question[data-mc="1"] .option.wrong').count() === 1 && await p.locator('.question[data-mc="0"] .option.correct').count() === 1 && await p.locator('.question[data-mc="1"] .option.correct').count() === 0,
    'a reload restores answered multiple choice: the choices and verdicts, no right option for the wrong one');
  ok(await p.locator('.feedback').count() === 0 && !/undefined/.test(await p.locator('#questionsContainer').innerText()), 'no explanation, and nothing reads "undefined"');
  ok(stub.calls('/mc').length === before, 'the page does not ask again for answers the server withholds');
  await ctx.close();
}

// 3. Fill-ins: exact, accepted by the model, rejected, pending
if (want(3)) {
  const stub = new GradingStub(); stub.delay['/grade'] = 400;
  const { ctx, p } = await open(stub);
  await ready(p);
  await p.locator('input[data-fill="0"]').fill('the GENESIS');
  await p.locator('button[data-fill-check="0"]').click();
  await sleep(120);
  ok(await has(p, '.question[data-fill="0"]', 'Checking…') && await p.locator('input[data-fill="0"]').isDisabled(), '"Checking…" shows and the box is closed while the server answers');
  await p.waitForSelector('.question[data-fill="0"] .feedback-text.correct');
  const g = stub.calls('/grade')[0].body;
  ok(g.items.length === 1 && g.items[0].qid === `${SCOPE}/fill/0` && g.items[0].answer === 'the GENESIS' && g.code === STUB_CODE && g.attemptId, 'Check sends one item: qid and the words typed');
  ok(await p.locator('.question[data-fill="0"] .feedback-text').first().innerText().then((t) => /Correct/.test(t)), 'an exact answer shows Correct');
  stub.delay['/grade'] = 0;
  await p.locator('input[data-fill="1"]').fill('tri-unity [[ai-accept]]'); await p.locator('input[data-fill="1"]').press('Enter');
  ok(await waitText(p, 'Accepted: that is another name for the same thing.'), 'an answer the model accepts shows Correct with its line of feedback');
  await p.locator('input[data-fill="2"]').fill('banana'); await p.locator('input[data-fill="2"]').press('Enter');
  ok(await has(p, '.question[data-fill="2"] .feedback-text', 'Incorrect') || (await p.waitForSelector('.question[data-fill="2"] .feedback-text.incorrect').then(() => true, () => false)), 'a rejected answer is marked Incorrect');
  ok(!(await body(p)).includes('Not quite: that is not what the blank asks for.') && !(await has(p, '.question[data-fill="2"]', 'Answer: ')), 'and, while the attempt is open, neither the model\'s comment nor the answer wanted');
  ok(await has(p, '.question[data-fill="2"]', 'Request a human review'), 'a rejected answer offers "Request a human review"');
  ok(!(await has(p, '.question[data-fill="0"]', 'Request a human review')), 'a right answer offers no appeal');
  await p.locator('input[data-fill="3"]').fill('something [[pending]]'); await p.locator('input[data-fill="3"]').press('Enter');
  ok(await waitText(p, 'Saved — will be graded shortly.'), 'a pending fill-in says "Saved — will be graded shortly."');
  ok(await p.locator('input[data-fill="4"]').isEnabled(), 'the student can carry on with the other questions');
  // the verdicts are the server's, not the page's: a wrong answer typed is Incorrect whatever the page could guess
  ok(await ls(p, 'cts_john_u1_state').then((s) => JSON.parse(s).fillChecked.slice(0, 4).every(Boolean)), 'the checked state is mirrored into the unit state key');
  await ctx.close();
}

// 4. Short answers: met, partly, not met, pending; pending then graded by polling
if (want(4)) {
  const stub = new GradingStub(); stub.delay['/grade'] = 500;
  const { ctx, p, errs } = await open(stub);
  await ready(p);
  await mcAll(p); await fillAll(p);
  await saAll(p, ['[[met]]', '[[partly]]', '[[not_met]]', '[[pending]]', '[[met]]', '[[met]]', '[[met]]', '[[met]]', '[[met]]', '[[met]]']);
  const before = stub.calls('/grade').length;
  await p.locator('#submitExamBtn').click();
  ok(await waitText(p, 'Reviewing your written answers…'), '"Reviewing your written answers…" shows during the one call');
  ok(await p.locator('#submitExamBtn').isDisabled(), 'Submit is closed while the server reviews');
  ok(await waitText(p, 'Submitted — grading pending.'), 'a pending answer makes the unit "Submitted — grading pending."');
  const sa = stub.calls('/grade').slice(before);
  ok(sa.length === 1 && sa[0].body.items.length === 10 && sa[0].body.items.every((x) => x.qid.includes('/sa/')), 'all ten written answers go in one /api/grade call');
  ok(await has(p, '.question[data-sa="0"] .feedback-text', 'Meets the standard'), 'met: "Meets the standard"');
  // the answer-disclosure policy: what the model said is missing waits for a pass
  ok(await has(p, '.question[data-sa="1"] .feedback-text', 'Partly') && !(await has(p, '.question[data-sa="1"]', 'You named the covenant but did not say what God promised.')), 'partly: the verdict, and not what is missing');
  ok(await has(p, '.question[data-sa="2"] .feedback-text', 'Does not meet the standard') && !(await has(p, '.question[data-sa="2"]', 'You did not make the main point.')), 'not met: the verdict only');
  ok(await has(p, '.question[data-sa="0"]', 'You made every essential point.'), 'met: its line of feedback is still shown');
  ok(await has(p, '.question[data-sa="3"] .feedback-text', 'Pending'), 'pending: "Pending"');
  ok(await has(p, '.question[data-sa="1"]', 'Request a human review') && await has(p, '.question[data-sa="2"]', 'Request a human review') && !(await has(p, '.question[data-sa="0"]', 'Request a human review')) && !(await has(p, '.question[data-sa="3"]', 'Request a human review')), 'the appeal link sits by partly and not met only');
  ok(!(await body(p)).includes(bank.sa[0].model.en.slice(0, 30)), 'the model answer is never shown');
  ok(await p.locator('textarea[data-sa]').first().getAttribute('readonly') !== null, 'a graded written answer is read-only');
  const att = stub.calls('/attempt')[0] && [...stub.attempts.keys()][0];
  ok(await ls(p, KEYS.pending) === att, 'the pending attempt is remembered in this browser');
  ok(await ls(p, KEYS.progress) === null || !JSON.parse(await ls(p, KEYS.progress)).unit1, 'pending gives no credit');
  // the student may go on to the next unit
  p.removeAllListeners('dialog');
  let dialogs = 0; p.on('dialog', (d) => { dialogs++; d.dismiss(); });
  await Promise.all([p.waitForURL('**/CTSJohnUnit2.html', { timeout: 5000 }).catch(() => null), p.locator('#cts-next').click()]);
  ok(dialogs === 0 && p.url().endsWith('/CTSJohnUnit2.html'), 'a pending unit does not stop the student going on');
  await p.goBack({ waitUntil: 'load' });
  await waitText(p, 'Submitted — grading pending.');
  if (process.env.DEBUG) console.log(p.url(), JSON.stringify(stub.log.map((c) => c.method + ' ' + c.path)), (await body(p)).slice(0, 600));
  ok(await has(p, 'body', 'Submitted — grading pending.') && attemptCalls(stub, SCOPE).length === 1, 'back on the unit, the pending state returns from GET /api/attempt without a new attempt');
  // the grader catches up; the open page polls and finds the result (here: not met, so a fail and its wait)
  stub.settle(att, 'not_met');
  ok(await waitText(p, 'Not yet', 8000), 'the open page polls, and the graded result appears');
  ok(await ls(p, KEYS.pending) === null && Number(await ls(p, KEYS.sa)) > Date.now(), 'the pending marker is cleared and the server\'s lock is mirrored');
  ok(stub.calls('/attempt/' + att).some((c) => c.method === 'GET'), 'the poll used GET /api/attempt/<id>');
  ok(await has(p, '.question[data-sa="3"] .feedback-text', 'Does not meet the standard') && !(await has(p, '.question[data-sa="3"] .feedback-text', 'Pending')), 'the answer that was pending now shows its verdict');
  await ctx.close();
}

// 4b. Pending, then graded as a pass
if (want(4)) {
  const stub = new GradingStub();
  const { ctx, p } = await open(stub);
  await ready(p);
  await mcAll(p); await fillAll(p);
  await saAll(p, ['[[met]]', '[[met]]', '[[met]]', '[[pending]]', '[[pending]]']);
  await p.locator('#submitExamBtn').click();
  ok(await waitText(p, 'Submitted — grading pending.'), 'one answer pending: the unit is pending');
  ok(JSON.parse((await ls(p, KEYS.progress)) || '{}').unit1 !== true, 'and gives no credit yet');
  stub.settle([...stub.attempts.keys()][0], 'met');
  ok(await waitText(p, 'Unit 1 passed', 8000), 'the open page polls, and a pass appears');
  ok(JSON.parse(await ls(p, KEYS.progress)).unit1 === true && await ls(p, KEYS.mc) === '1' && await ls(p, KEYS.pending) === null, 'the pass is mirrored into cts_john_progress and _mc_passed; the pending marker goes');
  // a reload after the pass: nothing asked of the server for this unit
  const n = attemptCalls(stub).length;
  await p.reload({ waitUntil: 'load' });
  await waitText(p, 'Unit 1 passed');
  ok(attemptCalls(stub).length === n, 'a passed unit opens without a new attempt');
  await ctx.close();
}

// 5. A server fail locks; a retake keeps what already met
if (want(5)) {
  const stub = new GradingStub({ lockMs: 3500 });
  const { ctx, p } = await open(stub);
  await ready(p);
  await mcAll(p); await fillAll(p);
  await saAll(p, ['[[met]]', '[[met]]', '[[met]]', '[[met]]', '[[met]]', '[[not_met]]', '[[not_met]]', '[[not_met]]', '[[not_met]]', '[[not_met]]']);
  await p.locator('#submitExamBtn').click();
  ok(await waitText(p, 'Not yet'), 'the server said failed: the page says Not yet');
  const t = await body(p);
  ok(/short answer 5\/10, need 9/.test(t), 'the score line comes from the server\'s scores', t.match(/Not yet[^\n]*/)?.[0]);
  const lock = Number(await ls(p, KEYS.sa));
  ok(lock > Date.now() && lock < Date.now() + 10000, 'the server\'s lock is mirrored into cts_john_u1_sa_lock (multiple choice kept)');
  ok(await ls(p, KEYS.full) === null, 'and not into the full lock');
  ok(await has(p, '#cts-exam-status', 'opens again in'), 'the lock is said at the top of the exam');
  ok(await p.locator('textarea[data-sa]').first().getAttribute('readonly') !== null, 'the answers are closed during the wait');
  await p.locator('#submitExamBtn').click();
  ok(await has(p, '#examResult', 'Locked'), 'Submit during the wait says Locked');
  ok(await has(p, '.question[data-sa="5"]', 'Request a human review'), 'a failed answer can be appealed after the fail');
  // the wait ends: a new attempt, the multiple choice and met answers kept
  await waitGone(p, 'opens again in', 9000);
  await p.waitForFunction(() => document.querySelectorAll('textarea[data-sa]').length === 10 && !document.querySelector('textarea[data-sa="5"]').readOnly, null, { timeout: 8000 });
  ok(attemptCalls(stub).length === 2, 'a fresh POST /api/attempt starts the retake');
  ok(await has(p, '#questionsContainer', 'Your multiple choice is passed and kept.'), 'the multiple choice shows as passed and kept');
  ok(await p.locator('textarea[data-sa="0"]').getAttribute('readonly') !== null && await has(p, '.question[data-sa="0"] .feedback-text', 'Meets the standard') && await has(p, '.question[data-sa="0"] .feedback-text', 'Kept from your earlier attempt'), 'an answer that met the standard is banked and read-only');
  ok(await p.locator('textarea[data-sa="5"]').getAttribute('readonly') === null, 'an answer that did not is open to rewrite');
  ok(await p.locator('textarea[data-sa="5"]').inputValue().then((v) => v.includes('My answer to 6')), 'and holds what was written before, to improve');
  ok(await p.locator('.question[data-mc] .feedback-text').count() === 0 && await p.locator('input[data-fill="0"]').isEnabled() && await p.locator('input[data-fill="0"]').inputValue() === '', 'the fill-ins start empty');
  await fillAll(p);
  for (let i = 5; i < 10; i++) await p.locator(`textarea[data-sa="${i}"]`).fill(`Better answer ${i + 1}. [[met]]`);
  const g0 = stub.calls('/grade').length;
  await p.locator('#submitExamBtn').click();
  ok(await waitText(p, 'Unit 1 passed'), 'the rewritten answers pass the unit');
  const retake = stub.calls('/grade').slice(g0).find((c) => c.body.items.some((x) => x.qid.includes('/sa/')));
  ok(retake && retake.body.items.length === 5 && retake.body.items.every((x) => +x.qid.split('/').pop() >= 5), 'the retake sends only the five unbanked written answers', JSON.stringify(retake?.body.items.map((x) => x.qid)));
  ok(await ls(p, KEYS.sa) === null && await ls(p, KEYS.full) === null, 'the locks are cleared on the pass');
  await ctx.close();
}

// 6. Offline: an unconfirmed result, preserved typing, then retry
if (want(6)) {
  const stub = new GradingStub();
  const { ctx, p } = await open(stub);
  await ready(p);
  stub.offline = true;
  await mcAnswer(p, 0, bank.mc[0].answer);
  ok(await waitText(p, 'We could not confirm the grading result.'), 'a multiple-choice click with no network reports an unconfirmed result');
  ok(await p.locator('.question[data-mc="0"] .option.correct, .question[data-mc="0"] .option.wrong').count() === 0, 'and marks nothing: the page grades nothing itself');
  stub.offline = false;
  await p.locator('[data-cts-retry]').click();
  await p.waitForSelector('.question[data-mc="0"] .feedback-text.correct');
  ok(await p.locator('[data-cts-retry]').count() === 0, 'Try again repeats the click and clears the message');
  stub.offline = true;
  await p.locator('input[data-fill="0"]').fill(bank.fill[0].answer.en);
  await p.locator('button[data-fill-check="0"]').click();
  ok(await waitText(p, 'Your answers are saved'), 'a fill-in Check with no network fails the same way');
  ok(await p.locator('.question[data-fill="0"] .feedback-text').count() === 0 && await p.locator('input[data-fill="0"]').inputValue() === bank.fill[0].answer.en, 'no verdict is shown, and the typing is kept');
  stub.offline = false;
  await p.locator('[data-cts-retry]').click();
  await p.waitForSelector('.question[data-fill="0"] .feedback-text.correct');
  ok(true, 'a fill-in retry is graded by the server');
  stub.failNext = 503;
  await p.locator('input[data-fill="1"]').fill('x'); await p.locator('input[data-fill="1"]').press('Enter');
  ok(await waitText(p, 'The grading service had a problem.'), 'a server error is said as such');
  stub.failNext = 429;
  await p.locator('[data-cts-retry]').click();
  ok(await waitText(p, 'Too many answers were checked in a short time.'), 'a throttle is said as such');
  // Submit offline, then retry
  await p.reload({ waitUntil: 'load' }); await ready(p);
  await saAll(p, []);
  stub.offline = true;
  await p.locator('#submitExamBtn').click();
  ok(await waitText(p, 'Your answers are saved'), 'Submit with no network confirms the answers are saved');
  ok(await p.locator('textarea[data-sa="0"]').inputValue().then((v) => v.includes('My answer to 1')) && await p.locator('textarea[data-sa="0"]').getAttribute('readonly') === null, 'the written answers are kept, and still open');
  ok(await p.locator('#submitExamBtn').isEnabled(), 'Submit works again for a retry');
  ok(JSON.parse((await ls(p, KEYS.progress)) || '{}').unit1 !== true, 'no credit from a failed call');
  await ctx.close();
}

// 7. Appeal: the link, a note, the request; the limit
if (want(7)) {
  const stub = new GradingStub();
  const { ctx, p } = await open(stub);
  await ready(p);
  for (let i = 0; i < 4; i++) { await p.locator(`input[data-fill="${i}"]`).fill('wrong ' + i); await p.locator(`input[data-fill="${i}"]`).press('Enter'); await p.waitForSelector(`.question[data-fill="${i}"] .feedback-text`); }
  await p.locator('.question[data-fill="0"] [data-cts-appeal-open]').click();
  await p.locator('.question[data-fill="0"] textarea[data-cts-appeal-note]').fill('I wrote the Hebrew name.');
  // an unrelated redraw (another answer checked) must not lose the note
  await p.locator('input[data-fill="5"]').fill('x'); await p.locator('input[data-fill="5"]').press('Enter'); await p.waitForSelector('.question[data-fill="5"] .feedback-text');
  ok(await p.locator('.question[data-fill="0"] textarea[data-cts-appeal-note]').inputValue() === 'I wrote the Hebrew name.', 'the note survives a redraw');
  await p.locator('.question[data-fill="0"] [data-cts-appeal-send]').click();
  ok(await waitText(p, 'Human review requested.'), 'the request is confirmed');
  const a = stub.calls('/appeal')[0].body;
  ok(a.code === STUB_CODE && a.note === 'I wrote the Hebrew name.' && a.gradeId > 100 && a.qid === `${SCOPE}/fill/0`, 'POST /api/appeal carries code, gradeId and the note', JSON.stringify(a));
  for (const i of [1, 2]) { await p.locator(`.question[data-fill="${i}"] [data-cts-appeal-open]`).click(); await p.locator(`.question[data-fill="${i}"] [data-cts-appeal-send]`).click(); await waitText(p, 'Human review requested.'); }
  await p.locator('.question[data-fill="3"] [data-cts-appeal-open]').click();
  await p.locator('.question[data-fill="3"] [data-cts-appeal-send]').click();
  ok(await waitText(p, 'You already have three reviews waiting.'), 'a fourth request says three are waiting');
  await ctx.close();

  // and for a written answer, with no note
  const s2 = new GradingStub();
  const w = await open(s2);
  await ready(w.p);
  await saAll(w.p, ['[[not_met]]']);
  await w.p.locator('#submitExamBtn').click();
  await w.p.waitForSelector('.question[data-sa="0"] [data-cts-appeal-open]');
  await w.p.locator('.question[data-sa="0"] [data-cts-appeal-open]').click();
  await w.p.locator('.question[data-sa="0"] [data-cts-appeal-send]').click();
  ok(await waitText(w.p, 'Human review requested.') && s2.calls('/appeal')[0].body.note === '' && s2.calls('/appeal')[0].body.qid === `${SCOPE}/sa/0`, 'a written answer can be appealed without a note');
  await w.ctx.close();
}

// 8. A lock already on the server: nothing opens
if (want(8)) {
  const stub = new GradingStub();
  stub.locks.set(SCOPE, { until: Date.now() + 60000, kind: 'full' });
  const { ctx, p } = await open(stub);
  await waitText(p, 'opens again in');
  ok(await has(p, '#cts-exam-status', 'opens again in'), 'a page opened during the wait says so');
  ok(Number(await ls(p, KEYS.full)) > Date.now(), 'the server lock is mirrored into _full_lock');
  ok(await p.locator('input[data-fill]:enabled').count() === 0, 'the fill-ins are closed');
  ok(attemptCalls(stub).length === 1, 'the page asked, and was refused');
  await ctx.close();
}

// 9. Not registered: the site's own registration prompt; nothing is sent
if (want(9)) {
  const stub = new GradingStub();
  const { ctx, p } = await open(stub, { student: false });
  await sleep(600);
  ok(await p.locator('#cts-register').isVisible(), 'the registration card shows');
  ok(await has(p, '.cts-grade-register', 'you need a student record') && await p.locator('.cts-grade-register a[href="/cts-backup.html"]').count() === 1, 'the questions are held back with a prompt to register or restore');
  ok(await p.locator('.question').count() === 0, 'no question is shown');
  ok(attemptCalls(stub).length === 0 && stub.calls('/mc').length === 0, 'no grading call is made');
  // registering brings the questions
  await p.locator('#regName').fill('Stub Student'); await p.locator('#regEmail').fill('stub@example.test');
  await p.locator('#regSave').click();
  ok(await ready(p), 'after registering the questions appear');
  ok(attemptCalls(stub)[0].body.code === STUB_CODE, 'the first attempt uses the code the registration produced');
  await ctx.close();

  const t = await open(new GradingStub(), { path: TB, student: false });
  await sleep(500);
  ok(await has(t.p, '#tb-status', 'you need a student record') && await t.p.locator('#tb-status a[href="/index.html#register"]').count() === 1, 'a textbook test page sends the visitor to register');
  ok(await t.p.locator('#tb-submit').isDisabled(), 'and Submit is closed');
  await t.ctx.close();
}

// 10. A cert-track student: written answers are not graded
if (want(10)) {
  const stub = new GradingStub({ track: 'cert' });
  const { ctx, p } = await open(stub);
  await ready(p);
  ok(await has(p, '.cts-ai-note', 'do not count on your track and are not graded'), 'the written section says it is not graded on this track');
  await mcAll(p);
  await saAll(p, []);
  await p.locator('#submitExamBtn').click();
  ok(await waitText(p, 'Unit 1 passed'), 'the certificate track passes on multiple choice');
  ok(stub.calls('/grade').length === 0, 'no written answer is sent to be graded');
  await ctx.close();
}

// 11. Spanish and French
if (want(11)) {
  const words = {
    es: { path: '/es' + UNIT, appeal: 'Pedir una revisión humana', note: 'Un asistente de IA califica las respuestas escritas según los estándares del curso. Puede pedir una revisión humana de cualquier resultado.', checking: 'Comprobando…', wrong: 'Incorrecto', met: 'Cumple el estándar', saved: 'Guardada: se calificará en breve.', pending: 'Enviado: calificación pendiente.', offline: 'No pudimos confirmar el resultado de la calificación', retry: 'Reintentar' },
    fr: { path: '/fr' + UNIT, appeal: 'Demander une révision par une personne', note: 'Les réponses écrites sont corrigées par un assistant d’IA selon les exigences du cours. Vous pouvez demander une révision par une personne pour n’importe quel résultat.', checking: 'Vérification…', wrong: 'Incorrect', met: 'Répond à l’exigence', saved: 'Enregistrée : elle sera corrigée sous peu.', pending: 'Envoyé : correction en attente.', offline: 'Nous n’avons pas pu confirmer le résultat de la correction', retry: 'Réessayer' },
  };
  for (const [lang, w] of Object.entries(words)) {
    const stub = new GradingStub(); stub.delay['/grade'] = 400;
    const { ctx, p } = await open(stub, { path: w.path, lang });
    await ready(p);
    ok(attemptCalls(stub)[0].body.lang === lang, `${lang}: the attempt is opened in the reader's language`);
    ok(await has(p, '.cts-ai-note', w.note), `${lang}: the transparency note`);
    await p.locator('input[data-fill="0"]').fill('nope'); await p.locator('input[data-fill="0"]').press('Enter');
    await sleep(100);
    ok(await has(p, '.question[data-fill="0"]', w.checking), `${lang}: "Checking…"`);
    await p.waitForSelector('.question[data-fill="0"] .feedback-text');
    ok(await has(p, '.question[data-fill="0"]', w.wrong) && await has(p, '.question[data-fill="0"]', w.appeal), `${lang}: Incorrect, and the appeal link`);
    await p.locator('input[data-fill="1"]').fill('x [[pending]]'); await p.locator('input[data-fill="1"]').press('Enter');
    ok(await waitText(p, w.saved), `${lang}: Saved, to be graded shortly`);
    stub.delay['/grade'] = 0;
    stub.offline = true;
    await p.locator('input[data-fill="2"]').fill('x'); await p.locator('input[data-fill="2"]').press('Enter');
    ok(await waitText(p, w.offline) && await has(p, '[data-cts-retry]', w.retry), `${lang}: the offline message and its retry button`);
    stub.offline = false;
    await p.locator('[data-cts-retry]').click();
    await p.waitForSelector('.question[data-fill="2"] .feedback-text');
    await saAll(p, ['[[met]]', '[[pending]]']);
    await p.locator('#submitExamBtn').click();
    ok(await waitText(p, w.met) && await waitText(p, w.pending), `${lang}: a verdict and the pending line`);
    await ctx.close();
  }
}

// 12. The textbook test: the server draws, grades and decides
if (want(12)) {
  const stub = new GradingStub({ lockMs: 3000 });
  const tb = bankOf('tb:cults');
  const { ctx, p, errs } = await open(stub, { path: TB, track: 'cert' });
  await p.waitForSelector('input[data-cts-fill]', { timeout: 8000 });
  const att = attemptCalls(stub)[0].body;
  ok(att.scope === 'tb:cults' && att.code === STUB_CODE, 'POST /api/attempt names the scope tb:cults');
  const drawn = await p.evaluate(() => window.CTS_TEXTBOOK.draw());
  ok(JSON.stringify(drawn) === JSON.stringify(Array.from({ length: 20 }, (_, i) => 39 - i)), 'the twenty on the page are the twenty the server named, in its order', JSON.stringify(drawn));
  ok(await p.locator('input[data-cts-fill]').count() === 20, 'twenty answer boxes');
  const first = await p.locator('.cts-fill-q').first().innerText();
  ok(first.includes(tb.fill[39].prompt.en.slice(0, 30)), 'the first question is the server\'s first');
  const T = await p.evaluate(() => JSON.stringify(window.CTS_TEXTBOOK_TEST));
  ok(!/"(answer|accept)"/.test(T) && JSON.parse(T).grading === 'live', 'the bank carries no answer or accept list');
  ok(await has(p, '#tb-status', 'Written answers are graded by an AI assistant'), 'the transparency note is on the test page');
  // 17 right fails
  for (let k = 0; k < 20; k++) {
    const q = tb.fill[drawn[k]];
    await p.locator(`input[data-cts-fill="${k}"]`).fill(k < 17 ? q.answer.en : 'zzz');
    await p.locator(`input[data-cts-fill="${k}"]`).press('Enter');
    await p.waitForSelector(`.cts-fill-q[data-cts-fill="${k}"] .cts-fill-ok, .cts-fill-q[data-cts-fill="${k}"] .cts-fill-bad`);
  }
  await p.locator('#tb-submit').click();
  ok(await waitText(p, 'Not yet: 17 of 20 right, 18 needed.'), 'seventeen fails, on the server\'s say');
  ok(Number(await ls(p, 'cts_textbook_cults_lock')) > Date.now(), 'the lock is mirrored into cts_textbook_cults_lock');
  ok(await ls(p, 'cts_textbook_cults_passed') === null, 'no pass');
  ok(await p.locator('#tb-submit').isDisabled(), 'Submit is closed during the wait');
  await waitGone(p, 'Locked after a failed attempt', 8000);
  await p.waitForFunction(() => document.querySelectorAll('input[data-cts-fill]:enabled').length === 20, null, { timeout: 6000 });
  ok(attemptCalls(stub).length === 2, 'after the wait a fresh attempt is asked of the server');
  // 18 right passes; one answer is pending until later, one is accepted by the model
  for (let k = 0; k < 20; k++) {
    const q = tb.fill[drawn[k]];
    const v = k === 0 ? q.answer.en + ' [[ai-accept]]' : k === 1 ? 'something [[pending]]' : k < 18 ? q.answer.en : 'zzz';
    await p.locator(`input[data-cts-fill="${k}"]`).fill(v);
    await p.locator(`input[data-cts-fill="${k}"]`).press('Enter');
    await p.waitForSelector(`.cts-fill-q[data-cts-fill="${k}"] .cts-fill-ok, .cts-fill-q[data-cts-fill="${k}"] .cts-fill-bad`);
  }
  ok(await has(p, '.cts-fill-q[data-cts-fill="1"]', 'Saved — will be graded shortly.'), 'a pending answer on the test says so');
  await p.locator('#tb-submit').click();
  ok(await waitText(p, 'Submitted — grading pending.'), 'a test with an answer still pending is "grading pending"');
  const id = [...stub.attempts.keys()].pop();
  ok(await ls(p, 'cts_textbook_cults_pending') === id, 'and remembers the attempt');
  stub.settle(id, 'met');
  ok(await waitText(p, 'Passed: ', 8000), 'the open page polls and shows the pass');
  ok(/^\d{4}-\d{2}-\d{2}$/.test(await ls(p, 'cts_textbook_cults_passed')) && (await ls(p, 'cts_textbooks_passed')).includes('cults'), 'the pass is mirrored into cts_textbook_cults_passed and cts_textbooks_passed');
  ok(errs.length === 0, 'no page errors on the test page', errs[0]);
  await p.reload({ waitUntil: 'load' });
  await waitText(p, 'Passed on ');
  ok(await has(p, '#tb-status', 'Passed on'), 'a reload shows the pass');
  await ctx.close();
}

// 13. A required-reading test page: its scope is rd:
if (want(13)) {
  const stub = new GradingStub();
  const { ctx, p } = await open(stub, { path: '/CTSGenesisReadingsTest.html' });
  await p.waitForSelector('input[data-cts-fill]', { timeout: 8000 }).catch(() => null);
  const a = attemptCalls(stub)[0];
  ok(a && /^rd:/.test(a.body.scope), 'a required-reading test asks for an rd: attempt', a && a.body.scope);
  ok(await p.locator('input[data-cts-fill]').count() === 20, 'and shows the server\'s twenty');
  await ctx.close();
}

await browser.close();
if (fails.length) {
  console.error(`FAIL — ${fails.length} of ${checks} checks:`);
  for (const f of fails) console.error('  ✗ ' + f);
  process.exit(1);
}
console.log(`PASS — ${checks} checks: the live browser against a stubbed grading API.`);
