/* AI grading, end to end: the live build in a real browser, against the real
 * local Worker (AI_FAKE, a real D1, the 15-minute cron). No stub anywhere.
 *
 *   node test/grading-e2e.test.mjs [base-url]     # run by test/run-tests.sh
 *   STATE=.wrangler-local CONFIG=test/wrangler.local.jsonc  (the suite's database)
 *
 * What it proves that the stubbed browser test (grading-ui.test.mjs) and the
 * API test (grading-api.test.mjs) cannot: that the page and the Worker agree on
 * every shape in docs/ai-grading.md sections 7 and 12.
 *
 *   1. Associate student, a unit: multiple choice by clicking, fill-ins exact,
 *      accepted by the (fake) model, and wrong with the answer wanted shown
 *      and an appeal sent from the page; the pass is credited by the server
 *      (unit_progress.source = 'server'); model answers appear only after
 *      Submit and only beside a short answer the student wrote.
 *   2. The same student, a textbook test: the server's draw, a pass, and
 *      textbook_results.source = 'server'.
 *   3. The same student, the last unit of a course: course_completions
 *      .source = 'server', and the page writes cts_done_codes.
 *   4. A second device (new browser context, same code) sees the server's state.
 *   5. Master's student: short answers with hints met / not met, a fail whose
 *      lockout is shown, kept across a reload and enforced by the server; a
 *      retake that keeps what met; a pending answer finished by the cron, which
 *      the open page collects; an appeal of a short answer.
 *   6. No grading request carries a key, and no page carries one.
 *
 * Every name and answer is made up for the test.
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const BASE = process.argv[2] || process.env.API_BASE || 'http://127.0.0.1:8798';
const STATE = process.env.STATE || '.wrangler-local';
const CONFIG = process.env.CONFIG || 'test/wrangler.local.jsonc';
const ORIGIN = new URL(BASE).origin;

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const fails = [];
let checks = 0;
const ok = (c, m, d) => { checks++; if (!c) fails.push(m + (d !== undefined ? `\n        ${typeof d === 'string' ? d : JSON.stringify(d)}` : '')); };
process.on('uncaughtException', (e) => { console.error(`CRASH after ${checks} checks:`, e.stack.split('\n').slice(0, 5).join('\n')); for (const f of fails) console.error('  ✗ ' + f); process.exit(1); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---- the database, the cron, the questions --------------------------------- */
function db(command) {
  const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'chapala-students', '--local', '--persist-to', STATE, '--config', CONFIG, '--json', '--command', command],
    { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }).toString();
  return JSON.parse(out.slice(out.indexOf('['))).map((r) => r.results);
}
const q1 = (command) => db(command)[0];
const cron = async () => (await fetch(`${BASE}/__scheduled?cron=*%2F15+*+*+*+*`)).status;
const unitBank = (prefix, n) => JSON.parse(fs.readFileSync(`src/content/units/${prefix}/${n}.json`, 'utf8'));
const tbBank = (slug) => JSON.parse(fs.readFileSync(`src/content/textbooks/${slug}.json`, 'utf8'));
const RUN = Date.now().toString(36);

/* ---- a student's browser ---------------------------------------------------- */
/* Every /api request a browser makes, recorded, to check what it sends. */
const sent = [];
async function device({ student, code } = {}) {
  const ctx = await browser.newContext();
  await ctx.route('**/*', (r) => (new URL(r.request().url()).origin === ORIGIN ? r.fallback() : r.abort()));
  ctx.on('request', (req) => {
    const u = new URL(req.url());
    if (u.origin === ORIGIN && u.pathname.startsWith('/api/')) sent.push({ method: req.method(), path: u.pathname, search: u.search, body: req.postData() });
  });
  await ctx.addInitScript(({ student }) => {
    // each unit opens on its lesson; these cases are about the exam (assets/js/cts-exam-view.js)
    try { sessionStorage.setItem('cts_exam_view:' + location.pathname, '1'); } catch (e) {}
    window.CTS_GRADING_TEST = { pollMs: [400, 800, 1500], codeWaitMs: 20000, timeoutMs: 60000 };
    try {
      if (!localStorage.getItem('__seeded')) {
        localStorage.setItem('__seeded', '1');
        // the foundation courses, so no course here is gated (cts-curriculum); this is not about gating
        localStorage.setItem('cts_done_codes', JSON.stringify(['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK']));
        if (student) { localStorage.setItem('cts_student', JSON.stringify(student)); localStorage.setItem('cts_track', student.track); }
      }
    } catch (e) {}
  }, { student });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('dialog', (d) => { errs.push('dialog: ' + d.message()); d.dismiss(); });
  return { ctx, p, errs };
}
const body = (p) => p.locator('body').innerText();
const has = async (p, sel, text) => (await p.locator(sel).filter({ hasText: text }).count()) > 0;
const waitText = (p, text, timeout = 15000) => p.waitForFunction((t) => document.body.innerText.includes(t), text, { timeout }).then(() => true, () => false);
const ls = (p, k) => p.evaluate((key) => localStorage.getItem(key), k);
const ready = (p) => p.waitForSelector('.question', { timeout: 15000 }).then(() => true, () => false);
const codeOf = async (p) => { await p.waitForFunction(() => localStorage.getItem('cts_student_code'), null, { timeout: 30000 }); return ls(p, 'cts_student_code'); };

/* The exam, as a student does it. `bank` is the unit's source content. */
async function mcAll(p, bank, wrong = 0) {
  for (let i = 0; i < bank.mc.length; i++) {
    const j = i < wrong ? (bank.mc[i].answer + 1) % bank.mc[i].options.en.length : bank.mc[i].answer;
    await p.locator(`button.option[data-mc="${i}"][data-opt="${j}"]`).click();
    await p.waitForSelector(`.question[data-mc="${i}"] .feedback-text`, { timeout: 15000 });
  }
}
async function fillOne(p, i, text) {
  await p.locator(`input[data-fill="${i}"]`).fill(text);
  // The live engine replaces the question DOM as server replies arrive.
  // Click re-resolves the Check control instead of depending on retained focus
  // between fill() and a keyboard event. Enter is covered by grading-ui.
  await p.locator(`button[data-fill-check="${i}"]`).click();
  await p.waitForSelector(`.question[data-fill="${i}"] .feedback-text`, { timeout: 30000 });
}
async function fillAll(p, bank, { from = 0, special = {} } = {}) {
  for (let i = from; i < bank.fill.length; i++) await fillOne(p, i, special[i] ?? bank.fill[i].answer.en);
}
let salt = 0;
const essay = (hint) => `${++salt}. My own considered explanation of what this passage teaches and why it matters for the church today ${hint}`;
const lockMs = (v) => Number(v) - Date.now();

const john1 = unitBank('CTSJohn', 1);
// a database used twice keeps the first run's saved decisions (an answer the model accepted is then 'cache')
db('DELETE FROM grade_overrides; DELETE FROM grade_cache; DELETE FROM grade_queue');

/* ====================================================================== */
/* 1. An Associate student takes a unit                                    */
/* ====================================================================== */
const assoc = { name: `E2E Associate ${RUN}`, email: `e2e-assoc-${RUN}@example.test`, track: 'associate' };
const d1 = await device({ student: assoc });
const { p } = d1;
await p.goto(`${BASE}/CTSJohnUnit1.html`, { waitUntil: 'load' });
ok(await ready(p), 'the unit page shows its questions');
const codeA = await codeOf(p);
ok(/^CTS-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(codeA), 'the page registered the student and holds a code', codeA);
ok(q1(`SELECT track FROM students WHERE id = '${codeA}'`)[0]?.track === 'associate', 'the server holds the student on the Associate track');

// no key on the page
{
  const data = await p.evaluate(() => JSON.stringify(window.CTS_UNIT));
  ok(!/"(answer|correct|accept|why|model|keywords|rubric|minHits)"/.test(data), 'CTS_UNIT carries no key field');
  const html = await (await fetch(`${BASE}/CTSJohnUnit1.html`)).text();
  ok(!html.includes(john1.sa[0].model.en.slice(0, 40)) && !/"keywords"|"rubric"|"accept"/.test(html), 'the page HTML carries no model answer, keywords, rubric or accept list');
}

// multiple choice: 19 right, the first wrong
await mcAll(p, john1, 1);
// The answer-disclosure policy (Wayne, 18 Oct 2026): while the attempt is open, right or wrong only.
ok(await p.locator('.question[data-mc="0"] .option.wrong').count() === 1 && await p.locator('.question[data-mc="0"] .option.correct').count() === 0,
  'a wrong click marks it wrong and does not show the right option while the attempt is open');
{ const t = await p.locator('#questionsContainer').innerText(), at = t.indexOf('John echoes Genesis to tell us');
  ok(await p.locator('.question[data-mc="0"] .feedback').count() === 0 && at < 0, 'and no explanation', at < 0 ? '' : t.slice(Math.max(0, at - 200), at + 80)); }
ok(!(await has(p, '.question[data-mc="0"] .feedback-text', 'Correct answer')) && !/undefined/.test(await p.locator('.question[data-mc="0"]').innerText()), 'no letter is named, and nothing reads "undefined"');

// fill-ins: exact, accepted by the model, wrong
await fillOne(p, 0, john1.fill[0].answer.en.toUpperCase());               // exact, whatever the capitals
await fillOne(p, 1, 'something else entirely [[right]]');                   // not exact: the (fake) model accepts it
ok(await has(p, '.question[data-fill="1"] .feedback-text', 'Correct') && !(await has(p, '.question[data-fill="1"]', 'it names the same thing')),
  'an answer the model accepts shows Correct; the model\'s own words wait for a pass (#124)');
await fillOne(p, 2, 'zzzz nothing');
ok(await has(p, '.question[data-fill="2"] .feedback-text', 'Incorrect'), 'a wrong fill-in is marked Incorrect');
ok(!(await has(p, '.question[data-fill="2"]', 'Answer: ')) && !(await has(p, '.question[data-fill="2"]', 'Not quite: look again')), 'and, while the attempt is open, neither the answer wanted nor the model\'s comment on it is shown', (await p.locator('.question[data-fill="2"]').innerText()).slice(0, 300));
ok(await has(p, '.question[data-fill="2"]', 'Request a human review') && !(await has(p, '.question[data-fill="0"]', 'Request a human review')),
  'a wrong fill-in offers a human review; an exact one does not');
for (let i = 3; i < john1.fill.length; i++) await fillOne(p, i, john1.fill[i].answer.en);

// the appeal, from the page
await p.locator('.question[data-fill="2"] [data-cts-appeal-open]').click();
await p.locator('.question[data-fill="2"] textarea[data-cts-appeal-note]').fill('I wrote the other accepted name.');
await p.locator('.question[data-fill="2"] [data-cts-appeal-send]').click();
ok(await waitText(p, 'Human review requested.'), 'the appeal is confirmed on the page');

// short answers do not count on this track: no model answer before Submit, then only beside what was written
ok(await has(p, '.cts-ai-note', 'written answers do not count on your track'), 'the page says the written answers are for reflection on this track');
ok(!(await body(p)).includes(john1.sa[0].model.en.slice(0, 30)), 'no model answer is on screen before Submit');
await p.locator('textarea[data-sa="0"]').fill('My reflection on the first question, written in my own words for this unit.');
await p.locator('textarea[data-sa="1"]').fill('A second reflection of mine, also in my own words, about the next question.');
await p.locator('#submitExamBtn').click();
ok(await waitText(p, 'Unit 1 passed'), 'Submit: the server passes the unit (19/20 multiple choice, 10/10 fill-in)', (await body(p)).slice(0, 300));
ok(await has(p, '.question[data-sa="0"] .model-answer', john1.sa[0].model.en.slice(0, 30)) && await p.locator('.question[data-sa="2"] .model-answer').count() === 0,
  'model answers appear after Submit, beside a short answer the student wrote and not beside one they left empty');
// ...and the pass opens the review: the right option and explanation, the answer wanted
ok(await p.locator(`.question[data-mc="0"] .option.correct[data-opt="${john1.mc[0].answer}"]`).count() === 1 && await has(p, '.question[data-mc="0"] .feedback-text', 'Correct answer: ' + 'ABCDEFGH'[john1.mc[0].answer]),
  'after the pass the missed question shows the right option');
ok(await has(p, '.question[data-mc="0"] .feedback', john1.mc[0].why.en.slice(0, 25)), 'and its explanation');
ok(await has(p, '.question[data-fill="2"]', 'Answer: ' + john1.fill[2].answer.en), 'and the wrong fill-in the answer wanted');
ok(JSON.parse(await ls(p, 'cts_john_progress') || '{}').unit1 === true && await ls(p, 'cts_john_u1_mc_passed') === '1', 'the pass is mirrored into the keys the certificate pages read');
{
  const rows = q1(`SELECT source FROM unit_progress WHERE student_id = '${codeA}' AND course = 'john' AND unit = 1`);
  ok(rows.length === 1 && rows[0].source === 'server', "D1: unit_progress holds the pass with source = 'server'", rows);
  const ap = q1(`SELECT a.status, g.qid, g.verdict FROM appeals a JOIN answer_grades g ON g.id = a.grade_id WHERE a.student_id = '${codeA}'`);
  ok(ap.length === 1 && ap[0].status === 'open' && ap[0].qid === 'u:CTSJohn/1/fill/2' && ap[0].verdict === 'wrong', 'D1: the appeal is open, against the wrong fill-in', ap);
  const by = q1(`SELECT qid, graded_by FROM answer_grades WHERE student_id = '${codeA}' AND kind = 'fill' ORDER BY qid`);
  ok(by.some((r) => r.graded_by === 'exact') && by.some((r) => r.graded_by === 'ai'), 'D1: the fill-ins were graded exact and by the model', by.map((r) => r.graded_by));
}
// a reload: the pass is the server's, with nothing asked again
await p.reload({ waitUntil: 'load' });
ok(await waitText(p, 'Unit 1 passed'), 'a reload shows the pass');
ok(await waitText(p, john1.mc[0].why.en.slice(0, 25)), 'and the passed attempt can still be reviewed');

/* ====================================================================== */
/* 2. The same student: a textbook test                                    */
/* ====================================================================== */
const cults = tbBank('cults');
await p.goto(`${BASE}/CTSTextbookCultsTest.html`, { waitUntil: 'load' });
await p.waitForSelector('input[data-cts-fill]', { timeout: 20000 });
ok(await p.locator('input[data-cts-fill]').count() === 20, 'the test page shows the twenty questions the server drew');
const drawn = await p.evaluate(() => window.CTS_TEXTBOOK.draw());
ok(drawn.length === 20 && new Set(drawn).size === 20 && drawn.every((i) => i >= 0 && i < cults.test.questions.length), 'the draw is twenty different bank questions', drawn);
{
  const T = await p.evaluate(() => JSON.stringify(window.CTS_TEXTBOOK_TEST));
  ok(!/"(answer|accept)"/.test(T), 'the textbook bank on the page carries no answer or accept list');
}
for (let k = 0; k < 20; k++) {
  const q = cults.test.questions[drawn[k]];
  // 17 exact, one the model accepts, two wrong: 18 right passes
  const v = k < 17 ? q.answer.en : k === 17 ? 'another way to say it [[right]]' : 'zzz';
  await p.locator(`input[data-cts-fill="${k}"]`).fill(v);
  await p.locator(`input[data-cts-fill="${k}"]`).press('Enter');
  await p.waitForSelector(`.cts-fill-q[data-cts-fill="${k}"] .cts-fill-ok, .cts-fill-q[data-cts-fill="${k}"] .cts-fill-bad`, { timeout: 30000 });
}
await p.locator('#tb-submit').click();
ok(await waitText(p, 'Passed: '), 'the server passes the textbook test at 18 of 20');
// the pass opens the review: the two missed questions, each with its teaching passage from the server
ok(await p.waitForSelector('#tb-review article blockquote', { timeout: 15000 }).then(() => true, () => false) && await p.locator('#tb-review article').count() === 2,
  'after the pass the two missed questions are explained with their teaching passages', await p.locator('#tb-review').innerText().catch(() => ''));
ok(await p.evaluate(() => typeof window.CTS_EXAM_REVIEW === 'undefined'), 'the page never had the passages before the server sent them');
{
  const rows = q1(`SELECT source FROM textbook_results WHERE student_id = '${codeA}' AND textbook = 'cults'`);
  ok(rows.length === 1 && rows[0].source === 'server', "D1: textbook_results holds the pass with source = 'server'", rows);
  const att = q1(`SELECT status, scope FROM attempts WHERE student_id = '${codeA}' AND scope = 'tb:cults'`);
  ok(att.length === 1 && att[0].status === 'passed', 'D1: one attempt, passed', att);
}
ok(/^\d{4}-\d{2}-\d{2}$/.test(await ls(p, 'cts_textbook_cults_passed') || '') && (await ls(p, 'cts_textbooks_passed') || '').includes('cults'), 'the pass is mirrored into the keys the certificate pages read');

/* ====================================================================== */
/* 3. The same student: the last unit of a course                           */
/* ====================================================================== */
const al10 = unitBank('CTSAL', 10);
db(`INSERT INTO unit_progress (student_id, course, unit, completed_at, source) VALUES ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((u) => `('${codeA}', 'al', ${u}, '2026-10-01T00:00:00Z', 'server')`).join(',')}`);
await p.evaluate(() => localStorage.setItem('cts_al_progress', JSON.stringify({ unit1: true, unit2: true, unit3: true, unit4: true, unit5: true, unit6: true, unit7: true, unit8: true, unit9: true })));
await p.goto(`${BASE}/CTSALUnit10.html`, { waitUntil: 'load' });
ok(await ready(p), 'the last unit of the course shows its questions');
await mcAll(p, al10);
await fillAll(p, al10);
await p.locator('#submitExamBtn').click();
ok(await waitText(p, 'Unit 10 passed'), 'the last unit passes');
{
  const rows = q1(`SELECT track, source FROM course_completions WHERE student_id = '${codeA}' AND code = 'CTSAL'`);
  ok(rows.length === 1 && rows[0].source === 'server' && rows[0].track === 'assoc', "D1: course_completions holds the course, source = 'server', at the Associate level", rows);
}
ok((JSON.parse(await ls(p, 'cts_done_codes') || '[]')).includes('CTSAL'), 'the browser wrote CTSAL into cts_done_codes (courseDone from the server)');

/* ====================================================================== */
/* 4. A second device, the same code                                        */
/* ====================================================================== */
{
  const d2 = await device();
  await d2.p.goto(`${BASE}/index.html`, { waitUntil: 'load' });
  const r = await d2.p.evaluate((c) => window.CTS_SYNC.restore(c), codeA);
  ok(r && r.ok === true, 'the second device restores from the code', r);
  await d2.p.goto(`${BASE}/CTSJohnUnit1.html`, { waitUntil: 'load' });
  ok(await waitText(d2.p, 'Unit 1 passed'), 'the second device shows the unit the first passed');
  ok(JSON.parse(await ls(d2.p, 'cts_john_progress') || '{}').unit1 === true, 'and its progress key says so');
  ok(JSON.parse(await ls(d2.p, 'cts_done_codes') || '[]').includes('CTSAL'), 'the course the server completed is complete here too');
  ok((await ls(d2.p, 'cts_textbooks_passed') || '').includes('cults'), 'and so is the textbook test');
  ok(d2.errs.length === 0, 'no page errors on the second device', d2.errs[0]);
  await d2.ctx.close();
}
ok(d1.errs.length === 0, 'no page errors on the first device', d1.errs[0]);
await d1.ctx.close();

/* ====================================================================== */
/* 5. A master's student: short answers, a fail, the lockout, the cron      */
/* ====================================================================== */
// A blank remains the one allowed missed response; there is no new 100% rule.
{
  const d = await device({ student: { name: `E2E Blank ${RUN}`, email: `e2e-blank-${RUN}@example.test`, track: 'thm' } });
  await d.p.goto(`${BASE}/CTSJohnUnit1.html`, { waitUntil: 'load' }); await ready(d.p);
  await mcAll(d.p, john1); await fillAll(d.p, john1);
  for (let i = 0; i < 9; i++) await d.p.locator(`textarea[data-sa="${i}"]`).fill(essay('[[met]]'));
  await d.p.locator('#submitExamBtn').click();
  ok(await waitText(d.p, 'Unit 1 passed', 60000), 'nine met responses and one blank pass through the real browser');
  const code = await codeOf(d.p);
  const result = q1(`SELECT status, sa_met, sa_total, locked_until FROM attempts WHERE student_id = '${code}'`)[0];
  ok(result.status === 'passed' && result.sa_met === 9 && result.sa_total === 10 && !result.locked_until, 'blank response preserves the 90% threshold and records no lock');
  await d.ctx.close();
}
const thm = { name: `E2E Masters ${RUN}`, email: `e2e-thm-${RUN}@example.test`, track: 'thm' };
const dm = await device({ student: thm });
const m = dm.p;
await m.goto(`${BASE}/CTSJohnUnit1.html`, { waitUntil: 'load' });
ok(await ready(m), "the master's student sees the exam");
const codeM = await codeOf(m);
ok(await has(m, '.cts-ai-note', 'graded by an AI assistant'), "the master's page says who grades the written answers");
ok(q1(`SELECT track FROM students WHERE id = '${codeM}'`)[0]?.track === 'thm', "the server holds the student on the Th.M. track");
await mcAll(m, john1);
await fillAll(m, john1);
ok(await has(m, '.cts-ai-note', 'Please answer each question in a short paragraph that demonstrates your understanding of the material.'), 'Wayne’s paragraph instruction is visible');
await m.locator('textarea[data-sa="0"]').fill('Jesus is God.');
await m.locator('#submitExamBtn').click();
ok(await waitText(m, 'Your answer is too short to evaluate.'), 'short response requests expansion in the browser');
ok(await m.locator('textarea[data-sa="0"]').getAttribute('readonly') === null, 'returned answer remains editable');
ok(await m.locator('textarea[data-sa="0"]').evaluate((field) => document.activeElement === field && field.getAttribute('aria-invalid') === 'true' && document.getElementById(field.getAttribute('aria-describedby')).textContent.includes('too short')), 'short answer is focused and has accessible inline guidance');
await m.locator('textarea[data-sa="0"]').fill('An edited draft');
ok(await m.locator('textarea[data-sa="0"]').getAttribute('aria-invalid') === null && await m.locator('.cts-sa-too-short').count() === 0, 'editing clears the field error');
await m.locator('textarea[data-sa="0"]').fill('Jesus is God.');

ok(q1(`SELECT COUNT(*) AS n FROM answer_grades WHERE student_id = '${codeM}' AND kind = 'sa'`)[0].n === 0, 'no failed short-answer grade is recorded');
const sitting = q1(`SELECT id, status, submitted_at, locked_until FROM attempts WHERE student_id = '${codeM}'`)[0];
ok(sitting.status === 'open' && !sitting.submitted_at && !sitting.locked_until, 'no failed examination or lock is recorded');
await m.reload({ waitUntil: 'load' });
await ready(m);
ok(await m.locator('textarea[data-sa="0"]').inputValue() === 'Jesus is God.', 'typing survives reload for revision');
ok(q1(`SELECT id FROM attempts WHERE student_id = '${codeM}'`)[0].id === sitting.id, 'revision resumes the same sitting');
const hints1 = ['[[met]]', '[[met]]', '[[met]]', '[[met]]', '[[met]]', '[[not_met]]', '[[not_met]]', '[[not_met]]', '[[not_met]]', '[[not_met]]'];
for (let i = 0; i < 10; i++) await m.locator(`textarea[data-sa="${i}"]`).fill(essay(hints1[i]));
const before = Date.now();
await m.locator('#submitExamBtn').click();
ok(await waitText(m, 'Not yet', 60000), 'five of ten short answers met: the server fails the attempt');
ok(/short answer 5\/10, need 9/.test(await body(m)), "the page's score line comes from the server's scores", (await body(m)).match(/Not yet[^\n]*/)?.[0]);
{
  const lock = lockMs(await ls(m, 'cts_john_u1_sa_lock')) + (Date.now() - before);
  ok(lock > 13 * 60000 && lock < 16 * 60000, "the master's 15-minute lock is mirrored into cts_john_u1_sa_lock (multiple choice kept)", lock);
  ok(await ls(m, 'cts_john_u1_full_lock') === null, 'and not into the full lock');
}
ok(await has(m, '.question[data-sa="0"] .feedback-text', 'Meets the standard') && await has(m, '.question[data-sa="5"] .feedback-text', 'Does not meet the standard'), 'each short answer shows the verdict the server gave');
// the answer-disclosure policy (Wayne, 18 Oct 2026): what the model says is missing may name the answer, so it waits for a pass
ok(!(await has(m, '.question[data-sa="5"]', 'This does not yet make the main point of the question.')) && !(await has(m, '.question[data-sa="0"]', 'This makes the points the question asks for.')),
  "after a failed attempt the model's feedback is held back on every answer, met or not (#124)");
ok(!(await body(m)).includes(john1.sa[0].model.en.slice(0, 30)), "a failed master's attempt shows no model answer (it would be copied into the retake)");
await m.locator('.question[data-sa="5"] [data-cts-appeal-open]').click();
await m.locator('.question[data-sa="5"] [data-cts-appeal-send]').click();
ok(await waitText(m, 'Human review requested.'), 'a short answer that did not meet the standard can be appealed from the page');
{
  const ap = q1(`SELECT g.qid, g.kind FROM appeals a JOIN answer_grades g ON g.id = a.grade_id WHERE a.student_id = '${codeM}'`);
  ok(ap.length === 1 && ap[0].qid === 'u:CTSJohn/1/sa/5' && ap[0].kind === 'sa', 'D1: the appeal is against that short answer', ap);
}
// the lock survives a reload, and does not depend on the browser's own memory of it
await m.evaluate(() => { localStorage.removeItem('cts_john_u1_sa_lock'); localStorage.removeItem('cts_john_u1_full_lock'); });
await m.reload({ waitUntil: 'load' });
ok(await waitText(m, 'opens again in'), 'after a reload, with the browser\'s lock key wiped, the exam is still locked (the server says so)');
ok(lockMs(await ls(m, 'cts_john_u1_sa_lock')) > 10 * 60000, "and the server's lock is mirrored back");
{
  const r = await fetch(`${BASE}/api/attempt`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code: codeM, scope: 'u:CTSJohn/1', lang: 'en' }) });
  const b = await r.json();
  ok(r.status === 423 && b.lock && b.lock.kind === 'sa' && Date.parse(b.lock.until) > Date.now(), 'the Worker refuses a new attempt while locked (423 with the lock)', { status: r.status, b });
}
{
  const d3 = await device();      // another device: the lock is the server's, not this browser's
  await d3.p.goto(`${BASE}/index.html`, { waitUntil: 'load' });
  await d3.p.evaluate((c) => window.CTS_SYNC.restore(c), codeM);
  await d3.p.goto(`${BASE}/CTSJohnUnit1.html`, { waitUntil: 'load' });
  ok(await waitText(d3.p, 'opens again in'), 'a second device is locked too');
  await d3.ctx.close();
}

// the wait ends
db(`UPDATE attempts SET locked_until = '2000-01-01T00:00:00.000Z' WHERE student_id = '${codeM}' AND locked_until IS NOT NULL`);
await m.evaluate(() => { localStorage.removeItem('cts_john_u1_sa_lock'); localStorage.removeItem('cts_john_u1_full_lock'); });
await m.reload({ waitUntil: 'load' });
await m.waitForFunction(() => document.querySelectorAll('textarea[data-sa]').length === 10 && !document.querySelector('textarea[data-sa="5"]').readOnly, null, { timeout: 20000 });
ok(await has(m, '#questionsContainer', 'Your multiple choice is passed and kept.'), 'the retake keeps the multiple choice passed');
ok(await m.locator('textarea[data-sa="0"]').getAttribute('readonly') !== null && await has(m, '.question[data-sa="0"] .feedback-text', 'Kept from your earlier attempt'), 'a short answer that met the standard is banked');
ok(await m.locator('textarea[data-sa="0"]').inputValue().then((v) => v.includes('My own considered explanation')), "and shows the student's own words, from the server");
ok(await m.locator('textarea[data-sa="5"]').getAttribute('readonly') === null, 'one that did not is open to rewrite');

// retake: fill-ins again; three better answers, one the model cannot take just now, one still short
await fillAll(m, john1);
const hints2 = { 5: '[[met]]', 6: '[[met]]', 7: '[[met]]', 8: '[[error]] [[met]]', 9: '[[not_met]]' };
for (const i of [5, 6, 7, 8, 9]) await m.locator(`textarea[data-sa="${i}"]`).fill(essay(hints2[i]));
await m.locator('#submitExamBtn').click();
ok(await waitText(m, 'Submitted — grading pending.', 60000), 'eight met and one the model could not grade: the attempt is pending');
{
  const q = q1(`SELECT a.status, (SELECT COUNT(*) FROM grade_queue) AS queued FROM attempts a WHERE a.student_id = '${codeM}' ORDER BY a.rowid DESC LIMIT 1`)[0];
  ok(q.status === 'pending' && q.queued >= 1, 'D1: the attempt is pending, with the answer in the grade queue', q);
  ok(q1(`SELECT COUNT(*) AS n FROM unit_progress WHERE student_id = '${codeM}'`)[0].n === 0, 'and there is no credit yet');
}
ok(await ls(m, 'cts_john_u1_pending'), 'the browser remembers the pending attempt');
// the model comes back; Cloudflare's 15-minute schedule fires; the open page collects the result
db(`UPDATE answer_grades SET answer_text = REPLACE(answer_text, '[[error]]', '') WHERE student_id = '${codeM}' AND answer_text LIKE '%[[error]]%'`);
ok((await cron()) === 200, 'the 15-minute cron runs');
ok(await waitText(m, 'Your result is ready.', 45000), 'the open page collects the result the cron produced', (await body(m)).slice(0, 300));
ok(await waitText(m, 'Unit 1 passed'), "and shows the unit passed");
ok(JSON.parse(await ls(m, 'cts_john_progress') || '{}').unit1 === true && await ls(m, 'cts_john_u1_pending') === null, 'the pass is mirrored, and the pending marker goes');
{
  const rows = q1(`SELECT source FROM unit_progress WHERE student_id = '${codeM}' AND course = 'john' AND unit = 1`);
  ok(rows.length === 1 && rows[0].source === 'server', "D1: unit_progress holds the pass with source = 'server'", rows);
}
ok(dm.errs.length === 0, "no page errors for the master's student", dm.errs[0]);
await dm.ctx.close();

/* Track changes must update an open sitting, not just its banner. */
{
  const changed = await device({ student: { name: 'Synthetic Track Reviewer', email: `track-${RUN}@example.test`, track: 'cert', goal: 'assoc' } });
  const p = changed.p;
  await p.goto(BASE + '/CTSGenesisUnit1.html');
  await p.waitForFunction(() => window.CTS_ENGINE?.live()?.status === 'ready');
  ok(await has(p, '.cts-ai-note', 'not graded'), 'track change: Associate written answers begin as reflection');
  const id = await p.evaluate(() => CTS_ENGINE.live().attemptId);
  await p.locator('textarea[data-sa="3"]').fill('Synthetic short response');
  await changed.ctx.route('**/api/sync', route => route.abort('failed'));
  await p.locator('#cts-track-ctl .tg').click();
  await p.locator('#cts-track-ctl [data-t="mdiv"]').click();
  ok(await waitText(p, 'The track change could not be saved.'), 'track change: failed profile save is shown without changing the exam');
  ok(await p.evaluate(() => localStorage.getItem('cts_track') === 'cert' && JSON.parse(localStorage.getItem('cts_student')).goal === 'assoc'), 'track change: failed save restores the old profile');
  ok(await p.locator('textarea[data-sa="3"]').inputValue() === 'Synthetic short response', 'track change: a failed save keeps typing');
  await changed.ctx.unroute('**/api/sync');
  await p.locator('#cts-track-ctl .tg').click();
  await Promise.all([p.waitForEvent('load'), p.locator('#cts-track-ctl [data-t="mdiv"]').click()]);
  await p.waitForFunction(() => window.CTS_ENGINE?.live()?.status === 'ready');
  ok(await p.evaluate(id => CTS_ENGINE.live().attemptId === id && CTS_ENGINE.live().S.track === 'mdiv' && CTS_ENGINE.live().S.needs.sa === 9, id), 'track change: server resumes the same sitting with master’s requirements');
  ok(!(await has(p, '.cts-ai-note', 'not graded')), 'track change: reflection notice disappears');
  ok(await p.locator('textarea[data-sa="3"]').inputValue() === 'Synthetic short response', 'track change: saved written answer survives the reload');
  await p.locator('#submitExamBtn').click();
  ok(await waitText(p, 'Your answer is too short to evaluate.'), 'track change: short response cannot bypass revision on the new track');
  ok(await p.locator('.model-answer').count() === 0, 'track change: no model answer is revealed');
  ok(changed.errs.length === 0, 'track change: no browser exceptions', changed.errs);
  await changed.ctx.close();
}

/* ====================================================================== */
/* 6. What went over the wire                                               */
/* ====================================================================== */
{
  const grading = sent.filter((r) => /^\/api\/(attempt|mc|grade|appeal)(\/|$)/.test(r.path));
  ok(grading.length > 100, 'the browsers made the grading calls', grading.length);
  const allowed = { '/api/attempt': ['code', 'scope', 'lang'], '/api/mc': ['code', 'attemptId', 'qid', 'choice'], '/api/grade': ['code', 'attemptId', 'items'],
    '/api/appeal': ['code', 'gradeId', 'attemptId', 'qid', 'note'] };
  const stray = [];
  for (const r of grading) {
    if (r.method === 'GET') { if (!/^\?code=CTS-[A-Z0-9-]+$/.test(r.search)) stray.push(`GET ${r.path}${r.search}`); continue; }
    const b = JSON.parse(r.body || '{}');
    const submit = /^\/api\/attempt\/[^/]+\/submit$/.test(r.path);
    const want = submit ? ['code'] : allowed[r.path];
    if (!want) { stray.push('unexpected route ' + r.path); continue; }
    for (const k of Object.keys(b)) if (!want.includes(k)) stray.push(`${r.path} carries "${k}"`);
    if (r.path === '/api/grade') for (const it of b.items) for (const k of Object.keys(it)) if (!['qid', 'answer'].includes(k)) stray.push(`/api/grade item carries "${k}"`);
  }
  ok(stray.length === 0, 'no grading request carries anything but the code, the ids and what the student typed or clicked', stray.slice(0, 5));
  const keyish = grading.filter((r) => /"(accept|keywords|rubric|model|correct|minHits)"/.test(r.body || ''));
  ok(keyish.length === 0, 'and none carries a key field', keyish.length);
  // the pages that were opened carry no keys (the build check ran over all of dist/; these are the ones the test used)
  for (const page of ['CTSJohnUnit1.html', 'CTSALUnit10.html', 'CTSTextbookCultsTest.html']) {
    const html = await (await fetch(`${BASE}/${page}`)).text();
    const data = [...html.matchAll(/window\.(CTS_UNIT|CTS_TEXTBOOK_TEST)\s*=\s*(\{[\s\S]*?\});/g)].map((x) => x[2]).join('');
    ok(!/"(answer|accept|keywords|rubric|model|minHits)"/.test(html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')) || !data, `${page}: no key fields in the page data`);
  }
}

console.log(`${checks} checks`);
await browser.close();
if (fails.length) { console.log(`FAIL — ${fails.length}:`); fails.forEach((f) => console.log('  ✗ ' + f)); process.exit(1); }
console.log('PASS — the live pages and the real Worker grade, lock, collect and credit together.');
