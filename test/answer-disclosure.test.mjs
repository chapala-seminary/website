/* The answer-disclosure policy, through the real Worker and a real D1
 * (Wayne Cook, 18 Oct 2026; worker/grading/attempts.js disclosureOf):
 *
 *   while an attempt is open, and after one that failed, the student is told
 *   right or wrong -- never the right option, an explanation, the answer
 *   wanted, a model answer, a teaching passage, or feedback the AI wrote about
 *   an answer that was not right. After a PASS all of it may be shown.
 *
 *   API_BASE=http://127.0.0.1:8798 STATE=.wrangler-local node test/answer-disclosure.test.mjs
 *
 * Every reply is searched two ways: for the fields that carry a key (answer,
 * why, correctAnswer, models, reviews), and for the key text itself -- any
 * explanation, model answer or fill-in answer of the test appearing anywhere
 * in the reply except in the student's own words. Every name and answer here
 * is made up for the test.
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const BASE = process.env.API_BASE || 'http://127.0.0.1:8798';
const STATE = process.env.STATE || '.wrangler-local';
const CONFIG = process.env.CONFIG || 'test/wrangler.local.jsonc';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let checks = 0;
const fails = [];
function ok(cond, label, detail) {
  checks++;
  if (!cond) fails.push(label + (detail !== undefined ? `\n        ${typeof detail === 'string' ? detail : JSON.stringify(detail).slice(0, 600)}` : ''));
}
const eq = (a, b, label) => ok(JSON.stringify(a) === JSON.stringify(b), label, `got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`);

async function call(method, p, b) {
  for (let tries = 0; ; tries++) {
    try {
      const r = await fetch(BASE + p, { method, headers: { 'content-type': 'application/json', connection: 'close' }, body: b === undefined ? undefined : JSON.stringify(b) });
      return { status: r.status, body: await r.json().catch(() => null) };
    } catch (e) { if (tries >= 2) throw e; await sleep(300); }
  }
}
const post = (p, b) => call('POST', p, b);
const get = (p) => call('GET', p);
function db(command) {
  const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'chapala-students', '--local', '--persist-to', STATE, '--config', CONFIG, '--json', '--command', command],
    { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }).toString();
  return JSON.parse(out.slice(out.indexOf('['))).map((r) => r.results);
}
const unlock = (code) => db(`UPDATE attempts SET locked_until = '2000-01-01T00:00:00.000Z' WHERE student_id = '${code}' AND locked_until IS NOT NULL`);

const idx = (qid) => Number(qid.slice(qid.lastIndexOf('/') + 1));
const unit = (prefix, n) => JSON.parse(fs.readFileSync(`src/content/units/${prefix}/${n}.json`, 'utf8'));
const john = (n) => unit('CTSJohn', n);
const RUN = Date.now().toString(36);
let seq = 0;
async function student(track, extra = {}) {
  const r = await post('/api/register', { name: `Disclosure Tester ${RUN} ${++seq}`, email: `disclosure-${RUN}-${seq}@example.test`, track, ...extra });
  if (r.status !== 201) throw new Error(`register returned ${r.status}: ${JSON.stringify(r.body)}`);
  return r.body.code;
}
const start = (code, scope, lang = 'en') => post('/api/attempt', { code, scope, lang });
const submit = (code, id) => post(`/api/attempt/${id}/submit`, { code });
const view = (code, id) => get(`/api/attempt/${id}?code=${code}`);

/* ---- what may not be in a reply -------------------------------------------------- */
const KEY_FIELDS = new Set(['answer', 'why', 'correctAnswer', 'models', 'reviews', 'model', 'accept', 'keywords', 'rubric']);
const strings = (v) => (typeof v === 'string' ? [v] : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);
/* The key text of a unit (or a test bank): explanations, model answers, fill-in answers. */
function secretsOf(bank) {
  const long = [], short = [];
  for (const q of bank.mc || []) long.push(...strings(q.why).filter((s) => s.length >= 25));
  for (const q of bank.sa || []) long.push(...strings(q.model).filter((s) => s.length >= 25));
  for (const q of bank.fill || bank.questions || []) short.push(...strings(q.answer), ...strings(q.accept));
  return { long, short: [...new Set(short.map((s) => s.trim().toLowerCase()).filter((s) => s.length >= 3))] };
}
/* Every place a key is found in a reply: a key field, or key text in any value
   other than the student's own words (answerText). */
function leaks(reply, secrets) {
  const found = [];
  const walk = (v, path) => {
    if (Array.isArray(v)) return v.forEach((x, i) => walk(x, `${path}[${i}]`));
    if (v && typeof v === 'object') {
      for (const [k, x] of Object.entries(v)) {
        if (KEY_FIELDS.has(k)) found.push(`${path}.${k}`);
        if (k === 'answerText') continue;
        walk(x, `${path}.${k}`);
      }
      return;
    }
    if (typeof v !== 'string') return;
    const low = v.trim().toLowerCase();
    for (const s of secrets.long) if (v.includes(s.slice(0, 60))) found.push(`${path}: explanation/model text`);
    for (const s of secrets.short) if (low === s) found.push(`${path}: a fill-in answer "${v}"`);
  };
  walk(reply, '');
  return found;
}
const none = (reply, secrets, label) => { const l = leaks(reply, secrets); ok(l.length === 0, label, l.slice(0, 8)); };

/* Answer an MC question right or wrong. */
const rightOf = (bank, qid) => bank.mc[idx(qid)].answer;
const wrongOf = (bank, qid) => (bank.mc[idx(qid)].answer + 1) % bank.mc[idx(qid)].options.en.length;
const fillOf = (bank, qid) => bank.fill[idx(qid)].answer.en;
let salt = 0;
const essay = (hint) => `${++salt}. In my own words, this passage shows who Jesus is and why the church should listen to him today [[${hint}]]`;

/* ---- 1. an open attempt: wrong MC, lost-response retry, wrong fill-ins, resume ------------------ */
{
  const bank = john(1), S = secretsOf(bank);
  const code = await student('cert');
  const a = (await start(code, 'u:CTSJohn/1')).body;
  eq([a.status, a.disclosure], ['open', 'verdict'], '1: an open attempt discloses verdicts only');
  none(a, S, '1: the new attempt carries no key');

  const q0 = a.items.mc[0];
  const wrong = await post('/api/mc', { code, attemptId: a.attemptId, qid: q0.qid, choice: wrongOf(bank, q0.qid) });
  eq(Object.keys(wrong.body).sort(), ['choice', 'right'], '1: a wrong MC click returns only right and choice', wrong.body);
  eq([wrong.body.right, wrong.body.choice], [false, wrongOf(bank, q0.qid)], '1: ...wrong, and the choice made');
  none(wrong.body, S, '1: the wrong MC reply carries no key');

  // lost-response retry: the first click was stored; the page clicks again on another option
  const retry = await post('/api/mc', { code, attemptId: a.attemptId, qid: q0.qid, choice: rightOf(bank, q0.qid) });
  eq([retry.body.right, retry.body.choice], [false, wrongOf(bank, q0.qid)], '1: a retried click returns the choice the server stored, and its verdict', retry.body);
  none(retry.body, S, '1: the retried MC reply carries no key');

  const q1 = a.items.mc[1];
  const right = await post('/api/mc', { code, attemptId: a.attemptId, qid: q1.qid, choice: rightOf(bank, q1.qid) });
  eq(right.body, { right: true, choice: rightOf(bank, q1.qid) }, '1: a right MC click says so, and nothing more');

  // fill-ins: an exact wrong word (graded by the rule set), a model-graded wrong, a blank
  const f = a.items.fill;
  const g1 = await post('/api/grade', { code, attemptId: a.attemptId, items: [{ qid: f[0], answer: 'zzzz nothing' }, { qid: f[1], answer: 'a near thing [[wrong]]' }, { qid: f[2], answer: fillOf(bank, f[2]) }] });
  eq(g1.status, 200, '1: the fill-ins are graded');
  eq(g1.body.items.map((x) => x.verdict), ['wrong', 'wrong', 'right'], '1: wrong, wrong, right');
  none(g1.body, S, '1: a wrong fill-in reply carries no answer wanted');
  ok(g1.body.items.every((x) => !('correctAnswer' in x)), '1: no correctAnswer field');
  ok(g1.body.items[1].feedback === null, '1: the feedback the AI wrote about a wrong fill-in is held back', g1.body.items[1]);
  const g2 = await post('/api/grade', { code, attemptId: a.attemptId, items: [{ qid: f[0], answer: 'again' }, { qid: f[1], answer: 'again' }] });
  eq(g2.body.items.map((x) => x.verdict), ['wrong', 'wrong'], '1: sending a graded fill-in again returns its first grade');
  none(g2.body, S, '1: ...and still no answer wanted');
  const blank = await post('/api/grade', { code, attemptId: a.attemptId, items: [{ qid: f[3], answer: '   ' }] });
  ok(blank.body.items[0].verdict === 'wrong' && /No answer was given/.test(blank.body.items[0].feedback || ''), '1: the seminary\'s own sentence for a blank is still shown', blank.body);

  // resume and status of the open attempt
  const resumed = (await start(code, 'u:CTSJohn/1')).body;
  eq(resumed.attemptId, a.attemptId, '1: resuming returns the open attempt');
  eq(resumed.answered[q0.qid]?.choice, wrongOf(bank, q0.qid), '1: resume keeps the stored choice');
  ok(resumed.items.mc.every((m) => Object.keys(m).join() === 'qid'), '1: resume names the questions and nothing else', resumed.items.mc.slice(0, 2));
  none(resumed, S, '1: resuming an open attempt reveals nothing');
  const st = (await view(code, a.attemptId)).body;
  eq([st.status, st.disclosure], ['open', 'verdict'], '1: the status of an open attempt');
  none(st, S, '1: the status of an open attempt reveals nothing');
}

/* ---- 2. a failed submit, its later views, and the retake after it ------------------------------------ */
{
  const bank = john(2), S = secretsOf(bank);
  const code = await student('cert');                        // Certificate: short answers are reflection, with model answers
  const a = (await start(code, 'u:CTSJohn/2')).body;
  for (const [i, m] of a.items.mc.entries()) await post('/api/mc', { code, attemptId: a.attemptId, qid: m.qid, choice: i < 4 ? wrongOf(bank, m.qid) : rightOf(bank, m.qid) });
  await post('/api/grade', { code, attemptId: a.attemptId, items: a.items.fill.slice(0, 3).map((qid) => ({ qid, answer: 'zzzz nothing' })) });
  const sub = (await submit(code, a.attemptId)).body;
  eq([sub.status, sub.disclosure], ['failed', 'verdict'], '2: 16 of 20 fails, and a failed attempt discloses verdicts only', sub.status);
  none(sub, S, '2: the failed submit reveals no key, explanation, answer wanted or model answer');
  ok(!sub.models, '2: no model answers after a failed Certificate attempt');
  none((await view(code, a.attemptId)).body, S, '2: the status of the failed attempt reveals nothing');
  none((await submit(code, a.attemptId)).body, S, '2: submitting the failed attempt again reveals nothing');
  const locked = await start(code, 'u:CTSJohn/2');
  eq(locked.status, 423, '2: the retake waits for the lock');
  none(locked.body, S, '2: the lock reply reveals nothing');

  unlock(code);
  const b = (await start(code, 'u:CTSJohn/2')).body;
  ok(b.attemptId && b.attemptId !== a.attemptId, '2: the retake is a new attempt');
  none(b, S, '2: the retake reveals nothing from the failed attempt');
  ok(Object.keys(b.answered || {}).every((q) => !q.includes('/mc/')), '2: and carries none of its choices', Object.keys(b.answered || {}));
  // the failed retake
  for (const m of b.items.mc) await post('/api/mc', { code, attemptId: b.attemptId, qid: m.qid, choice: wrongOf(bank, m.qid) });
  const sub2 = (await submit(code, b.attemptId)).body;
  eq(sub2.status, 'failed', '2: a failed retake');
  none(sub2, S, '2: a failed retake reveals nothing');
  none((await view(code, a.attemptId)).body, S, '2: nor does the first attempt, asked for again');
}

/* ---- 3. a pass, and the review that follows ------------------------------------------------------------ */
{
  const bank = john(3), S = secretsOf(bank);
  const code = await student('cert');
  const a = (await start(code, 'u:CTSJohn/3')).body;
  const missed = a.items.mc[0].qid;
  for (const [i, m] of a.items.mc.entries()) await post('/api/mc', { code, attemptId: a.attemptId, qid: m.qid, choice: i === 0 ? wrongOf(bank, m.qid) : rightOf(bank, m.qid) });
  const wf = a.items.fill[0];
  await post('/api/grade', { code, attemptId: a.attemptId, items: [{ qid: wf, answer: 'zzzz nothing' }, { qid: a.items.fill[1], answer: 'near [[wrong]]' }] });
  const open = (await start(code, 'u:CTSJohn/3')).body;
  none(open, S, '3: until it is submitted, the attempt reveals nothing');
  const sub = (await submit(code, a.attemptId)).body;
  eq([sub.status, sub.disclosure, sub.unitDone], ['passed', 'review', true], '3: 19 of 20 passes, the credit is written, and the answers may be reviewed');
  const m = sub.answered[missed];
  eq([m.choice, m.answer], [wrongOf(bank, missed), rightOf(bank, missed)], '3: the missed question shows the choice made and the right option');
  ok(m.why && m.why === bank.mc[idx(missed)].why.en, '3: ...and its explanation', m);
  ok(sub.answered[a.items.mc[1].qid].why, '3: a question answered right has its explanation too');
  eq(sub.answered[wf].correctAnswer, bank.fill[idx(wf)].answer.en, '3: a wrong fill-in shows the answer wanted');
  ok(sub.answered[a.items.fill[1]].feedback, '3: the AI\'s feedback on a wrong fill-in is shown after the pass', sub.answered[a.items.fill[1]]);
  // models: only for short answers the student wrote? the server sends every model of a reflection track
  ok(sub.models && Object.keys(sub.models).length === bank.sa.length, '3: the model answers are sent after a Certificate pass', sub.models && Object.keys(sub.models));
  const again = (await view(code, a.attemptId)).body;
  eq([again.status, again.answered[missed].answer, !!again.models], ['passed', rightOf(bank, missed), true], '3: the passed attempt can be reviewed later');
  eq((await submit(code, a.attemptId)).body.answered[missed].answer, rightOf(bank, missed), '3: and a repeated submit shows the same review');

  // practising a passed unit: a new attempt, open, reveals nothing until it passes
  const p = (await start(code, 'u:CTSJohn/3')).body;
  ok(p.attemptId !== a.attemptId && p.disclosure === 'verdict', '3: practice after a pass is a new, open attempt');
  none(p, S, '3: which reveals nothing');
  const pw = await post('/api/mc', { code, attemptId: p.attemptId, qid: missed, choice: wrongOf(bank, missed) });
  none(pw.body, S, '3: a wrong click in practice reveals nothing either');
}

/* ---- 4. a master's attempt: pending written answers, AI feedback ----------------------------------------- */
{
  const bank = john(4), S = secretsOf(bank);
  const code = await student('thm');
  const a = (await start(code, 'u:CTSJohn/4')).body;
  for (const m of a.items.mc) await post('/api/mc', { code, attemptId: a.attemptId, qid: m.qid, choice: rightOf(bank, m.qid) });
  await post('/api/grade', { code, attemptId: a.attemptId, items: a.items.fill.map((qid) => ({ qid, answer: fillOf(bank, qid) })) });
  const sa = await post('/api/grade', { code, attemptId: a.attemptId, items: a.items.sa.map((qid, i) => ({ qid, answer: essay(i === 0 ? 'not_met' : i === 1 ? 'pending' : 'met') })) });
  eq(sa.status, 200, '4: the written answers are graded');
  const nm = sa.body.items[0];
  eq([nm.verdict, nm.feedback], ['not_met', null], '4: the AI\'s feedback on an answer not met is held back while the attempt is open', nm);
  // ChatGPT's review of #124: feedback on a met answer can name what another
  // item wants, so it too waits for a pass; the seminary's fixed sentences stay.
  eq([sa.body.items[2].verdict, sa.body.items[2].feedback], ['met', null], '4: the AI\'s feedback on an answer met is also held back while the attempt is open');
  ok(sa.body.items[1].verdict !== 'pending' || /faculty grader|graded shortly/.test(sa.body.items[1].feedback || ''), '4: a pending answer keeps the fixed sentence saying it is waiting or with a person', sa.body.items[1]);
  none(sa.body, S, '4: no model answer in the reply');
  const sub = (await submit(code, a.attemptId)).body;
  eq([sub.status, sub.disclosure], ['pending', 'verdict'], '4: a pending answer leaves the attempt pending, verdicts only');
  none(sub, S, '4: the pending submit reveals nothing');
  none((await view(code, a.attemptId)).body, S, '4: nor does collecting the pending attempt');
  none((await start(code, 'u:CTSJohn/4')).body, S, '4: nor does opening the page again while it is pending');
}

/* ---- 5. a textbook test: fail, retake, pass with the teaching passages ----------------------------------- */
{
  const { textbookQuestions } = await import('../tools/grading-keys-lib.mjs');
  const tbQs = textbookQuestions('.', 'cults').questions;
  const S = secretsOf({ questions: tbQs });
  const ans = (qid) => tbQs[idx(qid)].answer.en;
  const code = await student('thm');
  const a = (await start(code, 'tb:cults')).body;
  none(a, S, '5: a textbook attempt carries no key');
  const g = await post('/api/grade', { code, attemptId: a.attemptId, items: a.items.fill.slice(0, 10).map((qid, i) => ({ qid, answer: i < 3 ? 'zzzz nothing' : ans(qid) })) });
  none(g.body, S, '5: a wrong textbook answer reveals no answer');
  await post('/api/grade', { code, attemptId: a.attemptId, items: a.items.fill.slice(10).map((qid) => ({ qid, answer: ans(qid) })) });
  const sub = (await submit(code, a.attemptId)).body;
  eq(sub.status, 'failed', '5: 17 of 20 fails the textbook test');
  none(sub, S, '5: the failed test reveals no answer');
  ok(!sub.reviews, '5: and no teaching passage');
  unlock(code);
  const b = (await start(code, 'tb:cults')).body;
  ok(JSON.stringify(b.items.fill) !== JSON.stringify(a.items.fill), '5: the retake draws a fresh twenty');
  none(b, S, '5: the retake reveals nothing from the failed attempt');
  const miss = b.items.fill[0];
  for (let i = 0; i < 20; i += 10)
    await post('/api/grade', { code, attemptId: b.attemptId, items: b.items.fill.slice(i, i + 10).map((qid) => ({ qid, answer: qid === miss ? 'zzzz nothing' : ans(qid) })) });
  const pass = (await submit(code, b.attemptId)).body;
  eq([pass.status, pass.disclosure], ['passed', 'review'], '5: 19 of 20 passes the textbook test');
  eq(pass.answered[miss].correctAnswer, ans(miss), '5: the missed question shows the answer wanted');
  const rv = pass.reviews && pass.reviews[miss];
  ok(rv && Array.isArray(rv.paragraphs) && rv.paragraphs.length >= 1 && rv.href, '5: and its teaching passage, after the pass', pass.reviews);
  eq(Object.keys(pass.reviews || {}), [miss], '5: only for the question missed');
  const later = (await view(code, b.attemptId)).body;
  ok(later.reviews && later.reviews[miss], '5: the review is there when the passed attempt is asked for again');
  none((await view(code, a.attemptId)).body, S, '5: the failed attempt still reveals nothing');
}

/* ---- 7. free-form feedback of every kind waits for a pass --------------------------------------------------
   ChatGPT's review of #124 (18 Oct 2026): feedback on right, met and pending
   answers, and anything a faculty member, the cache or an override wrote, can
   carry the answer. Plant answer-bearing feedback on every graded row of an
   open attempt, then ask for the attempt every way a page does: none of it may
   come back until the attempt has passed, and then all of it may. */
{
  const code = await student('thm');
  const a = (await start(code, 'u:CTSJohn/5')).body;
  const bank = john(5);
  for (const m of a.items.mc) await post('/api/mc', { code, attemptId: a.attemptId, qid: m.qid, choice: rightOf(bank, m.qid) });
  await post('/api/grade', { code, attemptId: a.attemptId, items: a.items.fill.map((qid) => ({ qid, answer: fillOf(bank, qid) })) });
  await post('/api/grade', { code, attemptId: a.attemptId, items: a.items.sa.map((qid, i) => ({ qid, answer: essay(i % 3 === 0 ? 'met' : i % 3 === 1 ? 'pending' : 'not_met') })) });
  const SENTINEL = `ANSWER-BEARING-${RUN}`;
  const sources = ['ai', 'cache', 'override', 'human', 'rule', 'exact'];
  const verdicts = ['right', 'wrong', 'met', 'partly', 'not_met', 'pending'];
  const rows = db(`SELECT id FROM answer_grades WHERE attempt_id = '${a.attemptId}' ORDER BY id`)[0];
  ok(rows.length >= 12, '7: the attempt has graded rows to plant feedback in', rows.length);
  rows.forEach((r, i) => db(`UPDATE answer_grades SET feedback = 'The correct answer is ${SENTINEL}-${i}.', graded_by = '${sources[i % sources.length]}', verdict = '${verdicts[i % verdicts.length]}' WHERE id = ${r.id}`));
  const has = (reply) => JSON.stringify(reply).includes(SENTINEL);
  ok(!has((await view(code, a.attemptId)).body), '7: viewing the open attempt shows no planted feedback');
  ok(!has((await start(code, 'u:CTSJohn/5')).body), '7: resuming the open attempt shows none');
  db(`UPDATE attempts SET status = 'failed' WHERE id = '${a.attemptId}'`);
  ok(!has((await view(code, a.attemptId)).body), '7: a failed attempt shows none');
  unlock(code);
  const retake = (await start(code, 'u:CTSJohn/5')).body;
  ok(!has(retake), '7: the retake after a failure shows none');
  db(`UPDATE attempts SET status = 'passed' WHERE id = '${a.attemptId}'`);
  const passed = (await view(code, a.attemptId)).body;
  ok(has(passed), '7: after a pass the feedback is shown for review', Object.values(passed.answered || {}).slice(0, 2));
}

/* ---- 6. the passages are not served to a browser ----------------------------------------------------------- */
{
  const files = fs.existsSync('dist/assets/exam-review') ? fs.readdirSync('dist/assets/exam-review') : [];
  ok(files.length > 0 && files.every((f) => f.endsWith('.json')), '6: the live build keeps the passages as JSON for the Worker', files.slice(0, 3));
  const r = await fetch(`${BASE}/assets/exam-review/cults.en.json`);
  eq(r.status, 404, '6: a browser asking for them gets nothing');
  for (const alt of ['/assets/exam%2Dreview/cults.en.json', '/assets//exam-review/cults.en.json', '/ASSETS/EXAM-REVIEW/cults.en.json', '/assets/exam-review/'])
    eq((await fetch(BASE + alt)).status, 404, `6: nor by another spelling (${alt})`);
  const page = await (await fetch(`${BASE}/CTSTextbookCultsTest.html`)).text().catch(() => '');
  ok(page && !/exam-review|CTS_EXAM_REVIEW/.test(page), '6: the test page does not load them');
}

console.log(`${checks} answer-disclosure assertions`);
if (fails.length) {
  console.log(`FAIL — ${fails.length}:`);
  for (const f of fails) console.log('  ✗ ' + f);
  process.exit(1);
}
console.log('PASS — open and failed attempts disclose right or wrong only; a passed attempt may be reviewed.');
