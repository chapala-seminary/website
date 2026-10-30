/* A course completion's level is earned, not raised by a change of track and a
 * textbook test (ChatGPT's review of #125, 19 Oct 2026; worker/grading/attempts.js
 * earnedLevel). Through the real Worker and D1, in live grading mode.
 *
 *   API_BASE=http://127.0.0.1:8798 STATE=.wrangler-local node test/earned-level.test.mjs
 *
 * Its own file, run after test/staff-grading.test.mjs: the calibration sample
 * there is drawn from every AI-graded answer in the database, so answers added
 * before it change which twenty it is shown. Every name here is made up.
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { singleSections } from '../tools/single-pages-lib.mjs';

const BASE = process.env.API_BASE || 'http://127.0.0.1:8798';
const STATE = process.env.STATE || '.wrangler-local';
const CONFIG = process.env.CONFIG || 'test/wrangler.local.jsonc';
let checks = 0;
const fails = [];
const ok = (cond, label, detail) => { checks++; if (!cond) fails.push(label + (detail !== undefined ? `\n        ${JSON.stringify(detail)}` : '')); };
const eq = (a, b, label) => ok(JSON.stringify(a) === JSON.stringify(b), label, `got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`);
async function post(p, b) {
  const r = await fetch(BASE + p, { method: 'POST', headers: { 'content-type': 'application/json', connection: 'close' }, body: JSON.stringify(b) });
  return { status: r.status, body: await r.json().catch(() => null) };
}
function db(command) {
  const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'chapala-students', '--local', '--persist-to', STATE, '--config', CONFIG, '--json', '--command', command],
    { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }).toString();
  return JSON.parse(out.slice(out.indexOf('['))).map((r) => r.results);
}
const q1 = (command) => db(command)[0];
const idx = (qid) => Number(qid.slice(qid.lastIndexOf('/') + 1));
const RUN = Date.now().toString(36);
let n = 0;
async function student(track) {
  const r = await post('/api/register', { name: `Level Tester ${RUN} ${++n} ${track}`, email: `level-${RUN}-${n}-${track}@example.test`, track, country: 'MX' });
  if (r.status !== 201) throw new Error(`register returned ${r.status}: ${JSON.stringify(r.body)}`);
  return r.body.code;
}
const start = (code, scope) => post('/api/attempt', { code, scope, lang: 'en' });
const submit = (code, a) => post(`/api/attempt/${a.attemptId}/submit`, { code });

{
  const { textbookQuestions } = await import('../tools/grading-keys-lib.mjs');
  const bank = textbookQuestions('.', 'cults').questions;
  const passTextbook = async (code) => {
    const a = (await start(code, 'tb:cults')).body;
    for (let i = 0; i < 20; i += 10)
      await post('/api/grade', { code, attemptId: a.attemptId, items: a.items.fill.slice(i, i + 10).map((qid) => ({ qid, answer: bank[idx(qid)].answer.en })) });
    return (await submit(code, a)).body;
  };
  // Cults units passed live at `track` (each a passed attempt and a server unit_progress row)
  const liveUnits = (code, track) => db(
    `INSERT INTO attempts (id, student_id, scope, track, lang, shadow, status, started_at, submitted_at, graded_at) VALUES ${Array.from({ length: 10 }, (_, i) =>
      `('lvl-${code}-${track}-${i + 1}', '${code}', 'u:CTSCults/${i + 1}', '${track}', 'en', 0, 'passed', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z')`).join(', ')};
     INSERT INTO unit_progress (student_id, course, unit, completed_at, source) VALUES ${Array.from({ length: 10 }, (_, i) =>
      `('${code}', 'cults', ${i + 1}, '2026-10-01T00:00:00Z', 'server')`).join(', ')}
     ON CONFLICT(student_id, course, unit) DO NOTHING`);
  const levelOf = (code) => q1(`SELECT track FROM course_completions WHERE student_id = '${code}' AND code = 'CTSCULTS'`)[0]?.track ?? null;

  // 1. Certificate work, completed; then a move to the Th.M. and only the textbook test
  const a = await student('cert');
  liveUnits(a, 'cert');
  db(`INSERT INTO course_completions (student_id, code, track, completed_at, source) VALUES ('${a}', 'CTSCULTS', 'cert', '2026-10-01T00:00:00Z', 'server')`);
  db(`UPDATE students SET track = 'thm' WHERE id = '${a}'`);
  const subA = await passTextbook(a);
  eq(subA.status, 'passed', 'Certificate -> Th.M.: the textbook test itself passes');
  eq(levelOf(a), 'cert', '...but the Certificate-level completion is NOT raised to master\'s without master\'s unit work');

  // 2. The same units with no completion yet, on the Th.M. now: written at the level the units earned
  const b = await student('cert');
  liveUnits(b, 'cert');
  db(`UPDATE students SET track = 'thm' WHERE id = '${b}'`);
  await passTextbook(b);
  eq(levelOf(b), 'cert', 'units passed at Certificate level complete the course at Certificate level, not master\'s');

  // 3. Units passed live at the master's level DO raise an earlier Certificate completion
  const c = await student('thm');
  liveUnits(c, 'thm');
  db(`INSERT INTO course_completions (student_id, code, track, completed_at, source) VALUES ('${c}', 'CTSCULTS', 'cert', '2026-09-01T00:00:00Z', 'server')`);
  await passTextbook(c);
  eq(levelOf(c), 'thm', 'master\'s-level unit passes and the textbook test raise the completion to master\'s');
}


/* ---- the last two units settle at once (ChatGPT's review of #125): the completion is still master's ---- */
let salt = 0;
const essay = () => `${++salt}. Here is my own careful explanation of what the passage teaches and why it matters for the church today [[met]]`;
// Answer every question of a live attempt correctly. `keyOf(kind, qid)` gives the right answer.
async function answerAll(code, a, keyOf) {
  for (const m of a.items.mc) await post('/api/mc', { code, attemptId: a.attemptId, qid: m.qid, choice: keyOf('mc', m.qid) });
  for (let i = 0; i < a.items.fill.length; i += 10)
    await post('/api/grade', { code, attemptId: a.attemptId, items: a.items.fill.slice(i, i + 10).map((qid) => ({ qid, answer: keyOf('fill', qid) })) });
  for (let i = 0; i < a.items.sa.length; i += 10)
    await post('/api/grade', { code, attemptId: a.attemptId, items: a.items.sa.slice(i, i + 10).map((qid) => ({ qid, answer: essay() })) });
}
const seedLive = (code, rows) => db(
  `INSERT INTO attempts (id, student_id, scope, track, lang, shadow, status, started_at, submitted_at, graded_at) VALUES ${rows.map(([scope], i) =>
    `('seed-${code}-${i}', '${code}', '${scope}', 'thm', 'en', 0, 'passed', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z')`).join(', ')};
   INSERT INTO unit_progress (student_id, course, unit, completed_at, source) VALUES ${rows.map(([, course, unit]) =>
    `('${code}', '${course}', ${unit}, '2026-10-01T00:00:00Z', 'server')`).join(', ')}`);
{
  // Cults on the Th.M.: units 1-8 already passed live at master's level, the textbook test passed
  // through the API, then units 9 and 10 answered and both submitted at the same moment.
  const code = await student('thm');
  seedLive(code, Array.from({ length: 8 }, (_, i) => [`u:CTSCults/${i + 1}`, 'cults', i + 1]));
  const { textbookQuestions } = await import('../tools/grading-keys-lib.mjs');
  const bank = textbookQuestions('.', 'cults').questions;
  const tb = (await start(code, 'tb:cults')).body;
  for (let i = 0; i < 20; i += 10)
    await post('/api/grade', { code, attemptId: tb.attemptId, items: tb.items.fill.slice(i, i + 10).map((qid) => ({ qid, answer: bank[idx(qid)].answer.en })) });
  eq((await submit(code, tb)).body?.status, 'passed', 'concurrent: the Cults textbook test passes first');
  const unit = (n) => JSON.parse(fs.readFileSync(`src/content/units/CTSCults/${n}.json`, 'utf8'));
  const keyOf = (kind, qid) => { const u = unit(qid.split('/')[1]); return kind === 'mc' ? u.mc[idx(qid)].answer : u.fill[idx(qid)].answer.en; };
  const a9 = (await start(code, 'u:CTSCults/9')).body, a10 = (await start(code, 'u:CTSCults/10')).body;
  await answerAll(code, a9, keyOf); await answerAll(code, a10, keyOf);
  const [s9, s10] = await Promise.all([submit(code, a9), submit(code, a10)]);
  eq([s9.body?.status, s10.body?.status], ['passed', 'passed'], 'concurrent: both last units pass, submitted together');
  eq(q1(`SELECT track FROM course_completions WHERE student_id = '${code}' AND code = 'CTSCULTS'`)[0]?.track, 'thm',
    'concurrent: the stored completion is master\'s, not Certificate');
}
{
  // Ethics (a single-page course) on the Th.M.: units 1-8 passed live, then 9 and 10 together.
  const code = await student('thm');
  const secs = singleSections({ root: '.' }).filter((x) => x.course === 'ethics');
  const sec = (n) => secs.find((x) => x.unit === n);
  seedLive(code, Array.from({ length: 8 }, (_, i) => [sec(i + 1).scope, 'ethics', i + 1]));
  const keyFor = (n) => (kind, qid) => (kind === 'mc' ? sec(n).mc[idx(qid)].answer : sec(n).fill[idx(qid)].answer.en);
  const a9 = (await start(code, sec(9).scope)).body, a10 = (await start(code, sec(10).scope)).body;
  await answerAll(code, a9, keyFor(9)); await answerAll(code, a10, keyFor(10));
  const [s9, s10] = await Promise.all([submit(code, a9), submit(code, a10)]);
  eq([s9.body?.status, s10.body?.status], ['passed', 'passed'], 'single-page: both last Ethics units pass, submitted together');
  eq(q1(`SELECT track FROM course_completions WHERE student_id = '${code}' AND code = 'ETHICS'`)[0]?.track, 'thm',
    'single-page: the stored Ethics completion is master\'s');
  db(`UPDATE students SET email_verified_at = '2026-10-01T00:00:00Z' WHERE id = '${code}'`);
  const cert = await post('/api/certificate', { code, level: 'course', course: 'ETHICS', title: 'x' });
  ok(cert.status === 201 && / — Master of Theology$/.test(q1(`SELECT title FROM certificates WHERE verify_code = '${cert.body?.verifyCode}'`)[0]?.title || ''),
    'single-page: and its certificate is a Master of Theology award', cert);
}


/* ---- An Associate-earned Hermeneutics course never becomes an M.Div. award
 * by changing enrollment, even if a legacy certificate page supplies the
 * misleading M.Div. title. Synthetic local D1 rows, never real student data.
 * This isolates the server credential boundary; separate frontend test
 * checks that the printed HTML no longer mislabels current enrollment.
 */
{
  const code = await student('cert');
  db("UPDATE students SET track = 'mdiv', email_verified_at = '2026-10-01T00:00:00Z' WHERE id = '" + code + "'");
  db("INSERT INTO course_completions (student_id, code, track, completed_at, source) VALUES ('"
    + code + "', 'CTSHERMENEUTICS', 'assoc', '2026-10-01T00:00:00Z', 'server')");
  db("INSERT INTO unit_progress (student_id, course, unit, completed_at, source) VALUES "
    + Array.from({ length: 11 }, (_, i) => "('"
      + code + "', 'hermeneutics', " + (i + 1) + ", '2026-10-01T00:00:00Z', 'server')").join(", "));
  const req = { code, level: 'course', course: 'CTSHERMENEUTICS',
    title: 'Hermeneutics — Master of Divinity' };
  const first = await post('/api/certificate', req);
  eq(first.status, 201, 'Associate-earned Hermeneutics is eligible for its actual course certificate');
  ok(!!first.body?.verifyCode, 'Associate course certificate has server verification code', first);
  if (first.body?.verifyCode) {
    const records = q1("SELECT title, level, course FROM certificates WHERE verify_code = '"
      + first.body.verifyCode + "'");
    eq(records.length, 1, 'one verified Hermeneutics certificate exists');
    eq(records[0]?.title, 'Hermeneutics — Associate of Divinity',
      'the server records earned Associate level, ignoring the misleading M.Div page title');
    eq(records[0]?.level, 'course', 'a course certificate is not an M.Div. degree');
    const second = await post('/api/certificate', req);
    eq([second.status, second.body?.verifyCode, second.body?.reissued],
      [200, first.body.verifyCode, true],
      'repeated claim reissues the same verified certificate rather than duplicating');
    eq(q1("SELECT COUNT(*) AS n FROM certificates WHERE student_id = '" + code
      + "' AND course = 'hermeneutics'")[0]?.n, 1,
      'only one durable Hermeneutics certificate row');
  }
  eq(q1("SELECT track FROM course_completions WHERE student_id = '" + code
    + "' AND code = 'CTSHERMENEUTICS'")[0]?.track, 'assoc',
    'the course remains Associate-earned after M.Div. enrollment and certificate claim');

  const degree = q1("SELECT courses_done, masters_done, mdiv_core_done FROM degree_progress WHERE student_id = '"
    + code + "'")[0];
  eq([degree?.courses_done, degree?.masters_done, degree?.mdiv_core_done], [1, 0, 0],
    'an Associate Hermeneutics completion is retained but NOT counted toward M.Div degree progress');

}

console.log(`${checks} earned-level assertions against a live Worker and D1`);
if (fails.length) { console.log(`FAIL — ${fails.length}:`); for (const f of fails) console.log('  ✗ ' + f); process.exit(1); }
console.log('PASS — a completion is written only at the level its units were passed at; a track change and a textbook test do not raise it.');
