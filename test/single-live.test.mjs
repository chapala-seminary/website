/* The courses that grade on engines of their own, in live mode, in a real
 * browser against the real local Worker (AI_FAKE, a real D1). No stub.
 *
 *   node test/single-live.test.mjs [base-url]     # run by test/run-tests.sh
 *   STATE=.wrangler-local CONFIG=test/wrangler.local.jsonc  (the suite's database)
 *
 *   1. Genesis. The Genesis Intensive is a unit course (CTSGenesisUnitN.html,
 *      the unit engine); cts-genesis-engine.js only reads progress for its
 *      certificate page. A unit is passed in the browser, the server writes the
 *      credit, and the engine file carries no questions.
 *   2. Ethics, a master's student: the last unit of the course. Pass it (multiple
 *      choice by clicking, fill-ins, ten written answers graded by the fake
 *      model); the server writes unit_progress and, because the other nine units
 *      are on record, course_completions (source = 'server'); the page learns it.
 *      The page carries no key and no request does.
 *   3. Counseling, units of one page: the Associate track passes unit 10 and
 *      completes the course on the server; a master's student passes a unit and
 *      the course waits for its textbook test until that test is passed, when the
 *      server completes it.
 *   4. Failing, and the wait: a Certificate student fails a unit of Counseling
 *      (2 minutes) and of Narrative Preaching (15 minutes, its own rule); the
 *      lock is shown, kept across a reload and set on the server.
 *   5. French and Spanish pages grade the same.
 *
 * Every name and answer is made up for the test.
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { singleSections } from '../tools/single-pages-lib.mjs';

const BASE = process.argv[2] || process.env.API_BASE || 'http://127.0.0.1:8798';
const STATE = process.env.STATE || '.wrangler-local';
const CONFIG = process.env.CONFIG || 'test/wrangler.local.jsonc';
const ORIGIN = new URL(BASE).origin;
const RUN = Date.now().toString(36);

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
const q1 = (command) => db(command)[0];
const sections = singleSections({ root: '.' });
const sec = (course, unit) => sections.find((s) => s.course === course && s.unit === unit);

const sent = [];
async function device({ student }) {
  const ctx = await browser.newContext();
  await ctx.route('**/*', (r) => (new URL(r.request().url()).origin === ORIGIN ? r.fallback() : r.abort()));
  ctx.on('request', (req) => {
    const u = new URL(req.url());
    if (u.origin === ORIGIN && u.pathname.startsWith('/api/')) sent.push({ method: req.method(), path: u.pathname, body: req.postData() });
  });
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
  p.on('dialog', (d) => { errs.push('dialog: ' + d.message()); d.dismiss(); });
  return { ctx, p, errs };
}
const ls = (p, k) => p.evaluate((key) => localStorage.getItem(key), k);
const codeOf = async (p) => { await p.waitForFunction(() => localStorage.getItem('cts_student_code'), null, { timeout: 30000 }); return ls(p, 'cts_student_code'); };
const waitFor = async (fn, timeout = 20000) => { const t0 = Date.now(); while (Date.now() - t0 < timeout) { if (await fn()) return true; await sleep(250); } return false; };
const student = (track, tag) => ({ name: `Single ${tag} ${RUN}`, email: `single-${tag}-${RUN}@example.test`, track });
const hint = (i, tag = 'met') => `My own considered explanation of question number ${i} of this unit, in my own words and with enough words to count. [[${tag}]]`;

/* The exam of a unit of the one-page courses, as a student does it. */
const U = (unit) => ({
  mc: (i, j) => `#mcq_${unit} input[data-live-mc="${i},${j}"]`,
  fillIn: (i) => `#fill_${unit} .cts-fill-q[data-cts-fill="${i}"] input`,
  sa: (i) => `#essay_${unit} textarea[data-live-sa="${i}"]`,
  submit: `button.submit-btn[onclick="submitUnit(${unit})"]`,
  result: `#result_${unit}`,
});
async function takeUnit(p, s, { wrongMc = 0, fills = true, written = true, tag = 'met' } = {}) {
  const u = U(s.unit);
  for (let i = 0; i < s.mc.length; i++) {
    const j = i < wrongMc ? (s.mc[i].answer + 1) % 4 : s.mc[i].answer;
    // While the server is answering, the page shows the click as "Checking..."
    // with the radios disabled and none of them ticked (the choice is only
    // recorded when the server has marked it). check() re-reads the radio after
    // clicking and, if that happens inside those few milliseconds, reports that
    // the click "did not change its state" although it landed. So the click is
    // made, whatever check() then says of it, and the evidence that it took is
    // the page's feedback. A click that lands as the page redraws its questions
    // is really lost, and is made again.
    for (let tries = 0; ; tries++) {
      await p.locator(u.mc(i, j)).check({ force: true, timeout: 3000 }).catch(() => {});
      try { await p.waitForSelector(`#fb_${s.unit}_${i}.show`, { timeout: 10000 }); break; }
      catch (e) { if (tries >= 3) throw e; }
    }
  }
  if (fills) for (let i = 0; i < s.fill.length; i++) {
    await p.locator(u.fillIn(i)).fill(s.fill[i].answer.en); await p.locator(u.fillIn(i)).press('Enter');
    await p.waitForSelector(`#fill_${s.unit} .cts-fill-q[data-cts-fill="${i}"] .cts-fill-ok`, { timeout: 15000 });
  }
  if (written) for (let i = 0; i < s.sa.length; i++) await p.locator(u.sa(i)).fill(hint(i, tag));
  await p.locator(u.submit).click();
}
async function checkExpansion(p, field, submit) {
  await p.locator(field).fill('A short draft'); await p.locator(submit).click();
  ok(await waitFor(async () => await p.locator('.cts-sa-too-short').count() > 0), 'single-page short response receives inline guidance');
  ok(await p.locator(field).evaluate((el) => document.activeElement === el && el.getAttribute('aria-invalid') === 'true' && !!el.getAttribute('aria-describedby')), 'single-page invalid response is focused and described');
  await p.locator(field).fill(hint(0));
  ok(await p.locator(field).getAttribute('aria-invalid') === null, 'editing clears single-page field feedback');
}
const pageText = (p) => p.locator('body').innerText();
const waitText = (p, text, timeout = 20000) => p.waitForFunction((t) => document.body.innerText.includes(t), text, { timeout }).then(() => true, () => false);

db('DELETE FROM grade_overrides; DELETE FROM grade_cache; DELETE FROM grade_queue');

/* ====================================================================== */
/* 1. Genesis: a unit course; its engine file holds no questions            */
/* ====================================================================== */
{
  const engine = fs.readFileSync('dist/cts-genesis-engine.js', 'utf8');
  const cert = await (await fetch(`${BASE}/CTSGenesisCertificate.html`)).text();
  ok(cert.includes('cts-genesis-engine.js') && !/CTS_UNIT|const mcQuestions|UNITS\[|"correct"|kw_en/.test(cert + engine), 'the Genesis certificate page and its engine file carry no questions: Genesis is graded on the unit pages');
  const g2 = JSON.parse(fs.readFileSync('src/content/units/CTSGenesis/2.json', 'utf8'));
  const d = await device({ student: student('associate', 'gen') });
  const { p } = d;
  await p.goto(`${BASE}/CTSGenesisUnit2.html`, { waitUntil: 'load' });
  await p.waitForSelector('.question[data-mc]', { timeout: 15000 });
  const code = await codeOf(p);
  const html = await (await fetch(`${BASE}/CTSGenesisUnit2.html`)).text();
  ok(html.includes('"grading":"live"') && !/"(answer|accept|keywords|rubric|model)"/.test(html.slice(html.indexOf('window.CTS_UNIT'), html.indexOf('window.CTS_UNIT') + 60000)), 'a Genesis unit page is a live unit page with no key');
  for (let i = 0; i < g2.mc.length; i++) { await p.locator(`button.option[data-mc="${i}"][data-opt="${g2.mc[i].answer}"]`).click(); await p.waitForSelector(`.question[data-mc="${i}"] .feedback-text`, { timeout: 15000 }); }
  for (let i = 0; i < g2.fill.length; i++) {
    await p.locator(`input[data-fill="${i}"]`).fill(g2.fill[i].answer.en); await p.locator(`input[data-fill="${i}"]`).press('Enter');
    await p.waitForSelector(`.question[data-fill="${i}"] .feedback-text`, { timeout: 30000 });
  }
  await p.locator('#submitExamBtn').click();
  ok(await waitFor(() => q1(`SELECT 1 AS x FROM unit_progress WHERE student_id = '${code}' AND course = 'genesis' AND unit = 2 AND source = 'server'`).length === 1), "Genesis unit 2: the server writes the credit (unit_progress.source = 'server')");
  ok(JSON.parse(await ls(p, 'cts_genesis_progress') || '{}').unit2 === true, 'and the page mirrors it into cts_genesis_progress');
  await d.ctx.close();
}

/* ====================================================================== */
/* 2. Ethics, a master's student, the last unit                             */
/* ====================================================================== */
{
  const s = sec('ethics', 1);
  const d = await device({ student: student('thm', 'eth') });
  const { p, errs } = d;
  await p.goto(`${BASE}/ethics_unit01.html`, { waitUntil: 'load' });
  await p.waitForSelector('.question', { timeout: 15000 });
  const code = await codeOf(p);
  // the other nine units are on record, so this one completes the course
  db(`INSERT INTO unit_progress (student_id, course, unit, completed_at, source) VALUES ${[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `('${code}', 'ethics', ${n}, '2026-10-01T00:00:00Z', 'server')`).join(',')}`);

  const html = await (await fetch(`${BASE}/ethics_unit01.html`)).text();
  ok(!/correct\s*:\s*\d\s*[,}]/.test(html), 'the Ethics page carries no answer index');
  ok(JSON.stringify(await p.evaluate(() => [Object.keys(mcQuestions[0]), Object.keys(kwQuestions[0])])) === '[["textEn","textEs","optionsEn","optionsEs"],["textEn","textEs"]]', 'a question in the page is its wording and nothing else');
  const fillData = await (await fetch(`${BASE}/assets/js/fill/ethics.js`)).text();
  ok(!fillData.includes(s.fill[0].answer.en + '"') && !/"accept"|"answer"/.test(fillData), 'and the fill-in data file carries no answer');

  // multiple choice: the first one wrong, the server says what is right
  const wrong = (s.mc[0].answer + 1) % 4;
  await p.locator(`button[data-live-mc="0,${wrong}"]`).click();
  ok(await waitFor(async () => (await p.locator('.question .feedback-text.incorrect').count()) === 1), 'a wrong click is marked wrong');
  ok((await pageText(p)).includes('correct answer: ' + 'ABCD'[s.mc[0].answer]), 'and the server names the right letter');
  for (let i = 1; i < s.mc.length; i++) await p.locator(`button[data-live-mc="${i},${s.mc[i].answer}"]`).click();
  ok(await waitFor(async () => (await p.locator('.question .feedback-text.correct').count()) === 19), 'the other nineteen are marked right');
  for (let i = 0; i < s.fill.length; i++) {
    const inp = p.locator(`.cts-fill-q[data-cts-fill="${i}"] input`);
    await inp.fill(s.fill[i].answer.en); await inp.press('Enter');
    await p.waitForSelector(`.cts-fill-q[data-cts-fill="${i}"] .cts-fill-ok`, { timeout: 15000 });
  }
  await checkExpansion(p, 'textarea[data-live-sa="0"]', '#submitExamBtn');
  for (let i = 0; i < s.sa.length; i++) await p.locator(`textarea[data-live-sa="${i}"]`).fill(hint(i));
  ok(await p.locator('.model-answer').count() === 0, 'no model answer is on screen before the attempt is over');
  await p.locator('#submitExamBtn').click();
  ok(await waitText(p, 'Passed. This unit is recorded.'), 'Submit: the server passes the unit (19/20, 10/10, 10/10)', (await p.locator('#examResult').innerText()));
  ok(JSON.parse(await ls(p, 'cts_ethics_progress') || '{}').unit1 === true, 'cts_ethics_progress holds the pass, where the certificate page reads it');
  ok(await waitFor(() => q1(`SELECT source FROM unit_progress WHERE student_id = '${code}' AND course = 'ethics' AND unit = 1`)[0]?.source === 'server'), "D1: unit_progress holds the pass with source = 'server'");
  const comp = q1(`SELECT code, track, source FROM course_completions WHERE student_id = '${code}'`);
  ok(comp.length === 1 && comp[0].code === 'ETHICS' && comp[0].track === 'thm' && comp[0].source === 'server', "D1: course_completions holds ETHICS at the master's level, written by the server", comp);
  ok(await waitFor(async () => (await ls(p, 'cts_done_codes') || '').includes('ETHICS')), 'the page learns the completion (cts_done_codes)');
  const at = q1(`SELECT status, mc_right, fill_right, sa_met FROM attempts WHERE student_id = '${code}' AND scope = 'sp:ethics_unit01'`);
  ok(at.length === 1 && at[0].status === 'passed' && at[0].mc_right === 19 && at[0].fill_right === 10 && at[0].sa_met === 10, 'the attempt is on record with its scores', at);
  const wire = sent.filter((r) => /^\/api\/(attempt|mc|grade)/.test(r.path)).map((r) => r.body || '').join('\n');
  ok(wire.includes('sp:ethics_unit01/mc/0') && !/"(answer|correct|accept|model|keywords)":\s*\d/.test(wire.replace(/"answer":"/g, '')), 'what went over the wire names questions by id and carries no key');
  ok(errs.length === 0, 'no page error', errs);
  await d.ctx.close();
}

/* ====================================================================== */
/* 3. Counseling: the Associate track completes; a master's waits for the test */
/* ====================================================================== */
{
  const s10 = sec('counseling', 10);
  const d = await device({ student: student('associate', 'couA') });
  const { p, errs } = d;
  await p.goto(`${BASE}/CTSCounseling.html`, { waitUntil: 'load' });
  await p.waitForSelector('.question-card', { timeout: 15000 });
  const code = await codeOf(p);
  db(`INSERT INTO unit_progress (student_id, course, unit, completed_at, source) VALUES ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `('${code}', 'counseling', ${n}, '2026-10-01T00:00:00Z', 'server')`).join(',')}`);
  const html = await (await fetch(`${BASE}/CTSCounseling.html`)).text();
  ok(!/correct\s*:\s*\d\s*[,}]/.test(html), 'the Counseling page carries no answer index');
  ok(JSON.stringify(await p.evaluate(() => [Object.keys(UNITS[1].mcq[0]), Object.keys(UNITS[1].shortAnswer[0]), Object.keys(UNITS[1].mcq[0].options[0])])) === '[["textEn","textEs","options"],["textEn","textEs"],["en","es"]]', 'a question in the page is its wording and nothing else');
  await takeUnit(p, s10, { written: false });
  ok(await waitText(p, 'Passed. This unit is recorded.'), 'Counseling unit 10, Associate track (multiple choice and fill-ins count): passed', (await p.locator(U(10).result).innerText()));
  ok(await waitFor(() => q1(`SELECT track, source FROM course_completions WHERE student_id = '${code}' AND code = 'COUNSELING'`).length === 1), 'the server completes the course');
  const comp = q1(`SELECT track, source FROM course_completions WHERE student_id = '${code}' AND code = 'COUNSELING'`)[0];
  ok(comp && comp.track === 'assoc' && comp.source === 'server', "at the Associate level, source = 'server'", comp);
  ok(JSON.parse(await ls(p, 'cts_drakeford_state') || '{}')[10]?.passed === true, 'the page keeps its own state key (cts_drakeford_state) with the pass');
  ok(await waitFor(async () => (await ls(p, 'cts_done_codes') || '').includes('COUNSELING')), 'the page learns the completion');
  ok(errs.length === 0, 'no page error', errs);
  await d.ctx.close();

  // a master's student: the written part counts, and the textbook test holds the course
  const m = await device({ student: student('thm', 'couM') });
  await m.p.goto(`${BASE}/CTSCounseling.html`, { waitUntil: 'load' });
  await m.p.waitForSelector('.question-card', { timeout: 15000 });
  const mcode = await codeOf(m.p);
  db(`INSERT INTO unit_progress (student_id, course, unit, completed_at, source) VALUES ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `('${mcode}', 'counseling', ${n}, '2026-10-01T00:00:00Z', 'server')`).join(',')}`);
  const s0 = sec('counseling', 0);
  await checkExpansion(m.p, U(s0.unit).sa(0), U(s0.unit).submit);
  await takeUnit(m.p, s0);
  ok(await waitText(m.p, 'Passed. This unit is recorded.'), 'Counseling unit 0, master\'s track (with the ten written answers): passed');
  ok(q1(`SELECT COUNT(*) AS n FROM course_completions WHERE student_id = '${mcode}'`)[0].n === 0, 'every unit is on record, but the course waits for its textbook test on the master\'s tracks');
  // pass the textbook test through the API, the way the test page does
  const tb = JSON.parse(fs.readFileSync('src/content/textbooks/counseling.json', 'utf8'));
  const post = async (path, body) => (await fetch(BASE + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code: mcode, ...body }) })).json();
  const att = await post('/api/attempt', { scope: 'tb:counseling', lang: 'en' });
  const items = att.items.fill.map((qid) => ({ qid, answer: tb.test.questions[Number(qid.split('/').pop())].answer.en }));
  for (let i = 0; i < items.length; i += 10) await post('/api/grade', { attemptId: att.attemptId, items: items.slice(i, i + 10) });
  const res = await post(`/api/attempt/${att.attemptId}/submit`, {});
  ok(res.status === 'passed' && res.courseDone === true, 'passing the textbook test completes the course', res);
  const mc = q1(`SELECT track, source FROM course_completions WHERE student_id = '${mcode}' AND code = 'COUNSELING'`)[0];
  ok(mc && mc.track === 'thm' && mc.source === 'server', "at the master's level, written by the server", mc);
  await m.ctx.close();
}

/* ====================================================================== */
/* 4. Failing, and the wait, which is each course's own                      */
/* ====================================================================== */
for (const [course, unit, file, minutes, stateKey] of [['counseling', 1, 'CTSCounseling.html', 2, 'cts_drakeford_state'], ['narrative', 1, 'CTS_Narrative_Preaching.html', 15, 'cts_storytel_state']]) {
  const s = sec(course, unit);
  const d = await device({ student: student('certificate', 'fail-' + course) });
  const { p, errs } = d;
  await p.goto(`${BASE}/${file}`, { waitUntil: 'load' });
  await p.waitForSelector('.question-card', { timeout: 15000 });
  const code = await codeOf(p);
  await takeUnit(p, s, { wrongMc: 6, fills: false, written: false });
  ok(await waitText(p, 'Not yet passed'), `${course}: a Certificate student with 14 of 20 right is not yet passed`, (await p.locator(U(unit).result).innerText()));
  const row = q1(`SELECT status, locked_until, submitted_at FROM attempts WHERE student_id = '${code}' AND scope = '${s.scope}'`)[0];
  const waited = row && Math.round((Date.parse(row.locked_until) - Date.parse(row.submitted_at)) / 60000);
  ok(row && row.status === 'failed' && waited === minutes, `${course}: the server locks the unit for ${minutes} minutes`, row);
  const local = JSON.parse(await ls(p, stateKey) || '{}')[unit];
  ok(local && local.lockedUntil > Date.now() && !local.passed, `${course}: the lock is mirrored into the page's own state`);
  await p.reload({ waitUntil: 'load' });
  await p.waitForSelector('.question-card', { timeout: 15000 });
  ok(await waitText(p, 'Locked.', 8000), `${course}: after a reload the page still says it is locked`);
  ok(errs.length === 0, `${course}: no page error`, errs);
  await d.ctx.close();
}

/* ====================================================================== */
/* 5. Spanish and French pages grade the same                                */
/* ====================================================================== */
for (const [lang, file, course, unit, marker] of [['fr', 'CTS_WiseSpeak_Preaching.html', 'wisespeak', 2, 'Réussi'], ['es', 'ethics_unit02.html', 'ethics', 2, 'Aprobado']]) {
  const s = sec(course, unit);
  const d = await device({ student: student('thm', 'lang-' + lang) });
  const { p, errs } = d;
  await p.goto(`${BASE}/${lang}/${file}`, { waitUntil: 'load' });
  await p.waitForSelector('.question-card, .question', { timeout: 15000 });
  const code = await codeOf(p);
  if (course === 'wisespeak') await takeUnit(p, s);
  else {
    for (let i = 0; i < s.mc.length; i++) await p.locator(`button[data-live-mc="${i},${s.mc[i].answer}"]`).click();
    for (let i = 0; i < s.fill.length; i++) { const inp = p.locator(`.cts-fill-q[data-cts-fill="${i}"] input`); await inp.fill((s.fill[i].answer.es || s.fill[i].answer.en)); await inp.press('Enter'); await p.waitForSelector(`.cts-fill-q[data-cts-fill="${i}"] .cts-fill-ok`, { timeout: 15000 }); }
    for (let i = 0; i < s.sa.length; i++) await p.locator(`textarea[data-live-sa="${i}"]`).fill(hint(i));
    await p.locator('#submitExamBtn').click();
  }
  ok(await waitText(p, marker, 25000), `${lang}: ${course} unit ${unit} is passed on the ${lang} page and says so in ${lang}`, (await p.locator('body').innerText()).slice(0, 200));
  const c = course === 'wisespeak' ? 'wisespeak' : 'ethics';
  ok(await waitFor(() => q1(`SELECT lang FROM attempts WHERE student_id = '${code}' AND scope = '${s.scope}'`)[0]?.lang === lang), `${lang}: the attempt is recorded in ${lang}, so feedback comes in ${lang}`);
  ok(q1(`SELECT COUNT(*) AS n FROM unit_progress WHERE student_id = '${code}' AND course = '${c === 'wisespeak' ? 'wisespeak' : 'ethics'}' AND unit = ${unit}`)[0].n === 1, `${lang}: the server holds the pass`);
  ok(errs.length === 0, `${lang}: no page error`, errs);
  await d.ctx.close();
}

await browser.close();
if (fails.length) { console.error(`FAIL — ${fails.length} of ${checks}:`); fails.forEach((f) => console.error('  ✗ ' + f)); process.exit(1); }
console.log(`PASS — ${checks} checks: the single-page courses grade on the server (Genesis, Ethics, Counseling, Narrative and WiseSpeak Preaching).`);
