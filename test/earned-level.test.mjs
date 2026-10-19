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
  const bank = JSON.parse(fs.readFileSync('src/content/textbooks/cults.json', 'utf8')).test.questions;
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


console.log(`${checks} earned-level assertions against a live Worker and D1`);
if (fails.length) { console.log(`FAIL — ${fails.length}:`); for (const f of fails) console.log('  ✗ ' + f); process.exit(1); }
console.log('PASS — a completion is written only at the level its units were passed at; a track change and a textbook test do not raise it.');
