/* The answer-disclosure policy in the live pages, against the real Worker and
 * D1 (Wayne Cook, 18 Oct 2026; worker/grading/attempts.js disclosureOf).
 *
 *   STATE=.wrangler-local node test/answer-disclosure-ui.test.mjs http://127.0.0.1:8798
 *
 * 1. A unit, open: a wrong click shows "Incorrect." and nothing else -- no
 *    right option, no explanation, nothing reading "undefined" -- and a reload
 *    shows the same; the page never asks again for what the server withholds.
 * 2. A lost reply: the first click on a question reaches the server but its
 *    reply never arrives; the student clicks another option. The page shows the
 *    choice the server recorded, not the second click.
 * 3. A failed attempt, and the retake: nothing from the failed attempt is shown.
 * 4. The pass: the right options and explanations appear for review.
 * 5. A single-page course (Ethics): a wrong click names no right letter.
 * Every name and answer here is made up for the test.
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { singleSections } from '../tools/single-pages-lib.mjs';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const STATE = process.env.STATE || '.wrangler-local';
const CONFIG = process.env.CONFIG || 'test/wrangler.local.jsonc';
const ORIGIN = new URL(BASE).origin;
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const fails = [];
let checks = 0;
const ok = (c, m, d) => { checks++; if (!c) fails.push(m + (d !== undefined ? `\n        ${typeof d === 'string' ? d : JSON.stringify(d)}` : '')); };
process.on('uncaughtException', (e) => { console.error(`CRASH after ${checks} checks:`, e.stack.split('\n').slice(0, 5).join('\n')); for (const f of fails) console.error('  ✗ ' + f); process.exit(1); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function db(command) {
  const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'chapala-students', '--local', '--persist-to', STATE, '--config', CONFIG, '--json', '--command', command],
    { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }).toString();
  return JSON.parse(out.slice(out.indexOf('['))).map((r) => r.results);
}
const unitBank = (prefix, n) => JSON.parse(fs.readFileSync(`src/content/units/${prefix}/${n}.json`, 'utf8'));
const RUN = Date.now().toString(36);
const L = 'ABCDEFGH';

async function device(student) {
  const ctx = await browser.newContext();
  await ctx.route('**/*', (r) => (new URL(r.request().url()).origin === ORIGIN ? r.fallback() : r.abort()));
  const mc = [];
  ctx.on('request', (req) => { const u = new URL(req.url()); if (u.pathname === '/api/mc') mc.push(JSON.parse(req.postData() || '{}')); });
  await ctx.addInitScript(({ student }) => {
    try { sessionStorage.setItem('cts_exam_view:' + location.pathname, '1'); } catch (e) {}
    window.CTS_GRADING_TEST = { pollMs: [400, 800, 1500], codeWaitMs: 20000, timeoutMs: 60000 };
    try {
      if (!localStorage.getItem('__seeded')) {
        localStorage.setItem('__seeded', '1');
        localStorage.setItem('cts_done_codes', JSON.stringify(['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK']));
        localStorage.setItem('cts_student', JSON.stringify(student)); localStorage.setItem('cts_track', student.track);
      }
    } catch (e) {}
  }, { student });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  return { ctx, p, errs, mc };
}
const ready = (p) => p.waitForFunction(() => window.CTS_ENGINE?.live()?.status === 'ready', null, { timeout: 30000 }).then(() => true, () => false);
const text = (p, sel) => p.locator(sel).innerText().catch(() => '');
const waitText = (p, t, timeout = 20000) => p.waitForFunction((x) => document.body.innerText.includes(x), t, { timeout }).then(() => true, () => false);
async function click(p, i, j) {
  await p.locator(`button.option[data-mc="${i}"][data-opt="${j}"]`).click();
  await p.waitForSelector(`.question[data-mc="${i}"] .feedback-text.correct, .question[data-mc="${i}"] .feedback-text.incorrect`, { timeout: 15000 });
}
const wrongOf = (q) => (q.answer + 1) % q.options.en.length;
const noKeyShown = async (p, bank, i, label) => {
  const q = bank.mc[i], t = await text(p, `.question[data-mc="${i}"]`);
  ok(await p.locator(`.question[data-mc="${i}"] .option.correct`).count() === 0, `${label}: no option is marked right`);
  ok(!/Correct answer|Respuesta correcta|Bonne réponse/.test(t), `${label}: no right letter is named`, t.slice(-120));
  ok(await p.locator(`.question[data-mc="${i}"] .feedback`).count() === 0 && !t.includes(q.why.en.slice(0, 30)), `${label}: no explanation`);
  ok(!/undefined|null|NaN/.test(t), `${label}: nothing reads "undefined"`, t.slice(-120));
};

/* ---- 1, 2, 3, 4: a Certificate student on John 5 -------------------------------------------------- */
const bank = unitBank('CTSJohn', 5);
const d = await device({ name: `Disclosure UI ${RUN}`, email: `disclosure-ui-${RUN}@example.test`, track: 'cert' });
const { p } = d;
await p.goto(`${BASE}/CTSJohnUnit5.html`, { waitUntil: 'load' });
ok(await ready(p), '1: the unit is ready');

await click(p, 0, wrongOf(bank.mc[0]));
ok(await p.locator('.question[data-mc="0"] .option.wrong').count() === 1, '1: a wrong click is marked wrong');
ok((await text(p, '.question[data-mc="0"] .feedback-text')).trim() === '✗ Incorrect.', '1: it says "Incorrect." and nothing more', await text(p, '.question[data-mc="0"] .feedback-text'));
await noKeyShown(p, bank, 0, '1: open attempt');
await click(p, 1, bank.mc[1].answer);
ok(await p.locator(`.question[data-mc="1"] .option.correct[data-opt="${bank.mc[1].answer}"]`).count() === 1 && await p.locator('.question[data-mc="1"] .feedback').count() === 0,
  '1: a right click is marked right, with no explanation yet');

// 2. a lost reply: the server records the first click, the browser never hears; then another option is clicked
{
  let dropped = 0;
  await p.route('**/api/mc', async (route) => {
    if (dropped++ === 0) { await route.fetch().catch(() => null); return route.abort('failed'); }   // reached the server; the reply is lost
    return route.fallback();
  });
  const q = bank.mc[2], first = wrongOf(q), second = q.answer;
  await p.locator(`button.option[data-mc="2"][data-opt="${first}"]`).click();
  ok(await p.waitForSelector('[data-cts-retry]', { timeout: 15000 }).then(() => true, () => false), '2: the lost reply is shown as trouble, with a way to retry');
  // the student picks the other option instead of retrying
  await p.locator('[data-cts-retry]').first().click().catch(() => {});
  await sleep(300);
  if (await p.locator('.question[data-mc="2"] .feedback-text.incorrect, .question[data-mc="2"] .feedback-text.correct').count() === 0)
    await p.locator(`button.option[data-mc="2"][data-opt="${second}"]`).click();
  await p.waitForSelector('.question[data-mc="2"] .feedback-text.correct, .question[data-mc="2"] .feedback-text.incorrect', { timeout: 15000 });
  await p.unroute('**/api/mc');
  const stored = db(`SELECT g.answer_text FROM answer_grades g JOIN attempts a ON a.id = g.attempt_id JOIN students s ON s.id = a.student_id WHERE s.email = 'disclosure-ui-${RUN}@example.test' AND g.qid = 'u:CTSJohn/5/mc/2'`)[0];
  ok(stored.length === 1 && Number(stored[0].answer_text) === first, '2: the server kept the first click', stored);
  ok(await p.locator(`.question[data-mc="2"] .option.selected[data-opt="${first}"]`).count() === 1 && await p.locator(`.question[data-mc="2"] .option.wrong[data-opt="${first}"]`).count() === 1,
    '2: the page shows the choice the server recorded, and its verdict');
  ok(await p.locator(`.question[data-mc="2"] .option.selected[data-opt="${second}"]`).count() === 0, '2: not the later click');
  ok(await p.evaluate(() => CTS_ENGINE.live().attemptId) && JSON.parse(await p.evaluate(() => localStorage.getItem('cts_john_u5_state'))).mcAnswers[2] === first, '2: and saves that choice');
  await noKeyShown(p, bank, 2, '2: the retried question');
}

// a reload: verdicts only, no repeated asking
{
  const before = d.mc.length;
  await p.reload({ waitUntil: 'load' });
  ok(await ready(p), '1: after a reload the attempt resumes');
  await sleep(1500);
  ok(await p.locator('.question[data-mc="0"] .option.wrong').count() === 1, '1: the reload restores the wrong click');
  await noKeyShown(p, bank, 0, '1: after a reload');
  ok(d.mc.length === before, '1: the page does not ask the server again for what it withholds', d.mc.length - before);
}

// 3. fail (16 of 20), then the retake
for (let i = 3; i < bank.mc.length; i++) await click(p, i, i < 6 ? wrongOf(bank.mc[i]) : bank.mc[i].answer);
await p.locator('#submitExamBtn').click();
ok(await waitText(p, 'Not yet'), '3: the attempt fails');
for (const i of [0, 2, 3]) await noKeyShown(p, bank, i, `3: failed attempt, question ${i + 1}`);
ok(await p.locator('.model-answer').count() === 0, '3: no model answer after a failed attempt');
db(`UPDATE attempts SET locked_until = '2000-01-01T00:00:00.000Z' WHERE student_id = (SELECT id FROM students WHERE email = 'disclosure-ui-${RUN}@example.test') AND locked_until IS NOT NULL`);
await p.evaluate(() => { for (const k of Object.keys(localStorage)) if (/_lock$/.test(k)) localStorage.removeItem(k); });
await p.reload({ waitUntil: 'load' });
ok(await ready(p), '3: the retake opens after the wait');
ok(await p.locator('.question .option.selected').count() === 0 && await p.locator('.question .feedback-text').count() === 0, '3: the retake starts empty');
ok(!(await text(p, '#questionsContainer')).includes(bank.mc[0].why.en.slice(0, 30)), '3: nothing from the failed attempt is shown');

// 4. the pass, and the review
await click(p, 0, wrongOf(bank.mc[0]));
await noKeyShown(p, bank, 0, '4: the retake, open');
for (let i = 1; i < bank.mc.length; i++) await click(p, i, bank.mc[i].answer);
await p.locator('#submitExamBtn').click();
ok(await waitText(p, 'Unit 5 passed'), '4: the retake passes (19 of 20)');
ok(await waitText(p, bank.mc[0].why.en.slice(0, 30)), '4: after the pass the explanation of the missed question appears');
ok(await p.locator(`.question[data-mc="0"] .option.correct[data-opt="${bank.mc[0].answer}"]`).count() === 1
  && (await text(p, '.question[data-mc="0"] .feedback-text')).includes('Correct answer: ' + L[bank.mc[0].answer]), '4: with the right option named');
ok(!/undefined/.test(await text(p, '#questionsContainer')), '4: nothing reads "undefined" in the review');
await p.reload({ waitUntil: 'load' });
ok(await waitText(p, bank.mc[0].why.en.slice(0, 30)), '4: a passed unit opened again can still be reviewed');
ok(d.errs.length === 0, 'no page errors', d.errs);
await d.ctx.close();

/* ---- 5. a single-page course: Ethics, a wrong click ------------------------------------------------ */
{
  const s = singleSections({ root: '.' }).find((x) => x.course === 'ethics' && x.unit === 1);
  if (!s || !s.mc.length) ok(false, '5: the Ethics questions could not be read');
  else {
    const e = await device({ name: `Disclosure UI Ethics ${RUN}`, email: `disclosure-uie-${RUN}@example.test`, track: 'cert' });
    await e.p.goto(`${BASE}/ethics_unit01.html`, { waitUntil: 'load' });
    await e.p.waitForSelector('.question', { timeout: 15000 });
    const wrong = (s.mc[0].answer + 1) % 4;
    await e.p.locator(`button[data-live-mc="0,${wrong}"]`).click();
    const fb = await e.p.waitForSelector('.question .feedback-text.incorrect', { timeout: 20000 }).then(() => true, () => false);
    ok(fb, '5: the wrong click is marked wrong');
    const t = await e.p.locator('.question').first().innerText();
    ok(!/correct answer|respuesta correcta|bonne réponse/i.test(t) && !/undefined/.test(t), '5: no right letter is named, nothing reads "undefined"', t.slice(-160));
    ok(e.errs.length === 0, '5: no page errors', e.errs);
    await e.ctx.close();
  }
}

await browser.close();
console.log(`${checks} answer-disclosure browser assertions`);
if (fails.length) { console.log(`FAIL — ${fails.length}:`); for (const f of fails) console.log('  ✗ ' + f); process.exit(1); }
console.log('PASS — the live pages show right or wrong while an attempt is open, the stored choice after a lost reply, and the review only after a pass.');
