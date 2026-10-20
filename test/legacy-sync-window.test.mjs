/* The cutover grace window (worker/grading/mode.js legacySyncOpen), through the
 * real Worker and D1 in live grading mode (ChatGPT's review of #146, 20 Oct
 * 2026): a student whose passes never left the browser before production
 * switched to live must not lose them, and the window must not become a way
 * to raise credit.
 *
 *   API_BASE=http://127.0.0.1:8798 STATE=.wrangler-local node test/legacy-sync-window.test.mjs
 *
 * The suite's Worker has no LEGACY_SYNC_UNTIL; each request here opens or
 * closes the window with x-test-legacy-sync-until. Every name is made up.
 */
import { execFileSync } from 'node:child_process';

const BASE = process.env.API_BASE || 'http://127.0.0.1:8798';
const STATE = process.env.STATE || '.wrangler-local';
const CONFIG = process.env.CONFIG || 'test/wrangler.local.jsonc';
let checks = 0;
const fails = [];
const ok = (cond, label, detail) => { checks++; if (!cond) fails.push(label + (detail === undefined ? '' : `\n        ${JSON.stringify(detail).slice(0, 400)}`)); };
const FUTURE = '2999-01-01T00:00:00.000Z';
const PAST = '2000-01-01T00:00:00.000Z';
const call = async (method, p, b, until) => {
  const headers = { 'content-type': 'application/json', connection: 'close' };
  if (until) headers['x-test-legacy-sync-until'] = until;
  const r = await fetch(BASE + p, { method, headers, body: b === undefined ? undefined : JSON.stringify(b) });
  return { status: r.status, body: await r.json().catch(() => null) };
};
function db(command) {
  const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'chapala-students', '--local', '--persist-to', STATE, '--config', CONFIG, '--json', '--command', command],
    { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 16 * 1024 * 1024 }).toString();
  return JSON.parse(out.slice(out.indexOf('['))).map((r) => r.results);
}
const RUN = Date.now().toString(36);
let seq = 0;
async function student(track) {
  const r = await call('POST', '/api/register', { name: `Cutover Tester ${RUN} ${++seq}`, email: `cutover-${RUN}-${seq}@example.test`, track, country: 'MX' });
  if (r.status !== 201) throw new Error(`register returned ${r.status}: ${JSON.stringify(r.body)}`);
  return r.body.code;
}
const units = (code, course) => db(`SELECT unit, source FROM unit_progress WHERE student_id = '${code}' AND course = '${course}' ORDER BY unit`)[0];
const completions = (code) => Object.fromEntries(db(`SELECT code, track, source FROM course_completions WHERE student_id = '${code}'`)[0].map((r) => [r.code, r]));
const oldDevice = (code, extra = {}) => ({
  code,
  progress: [1, 2, 3].map((unit) => ({ course: 'ots', unit })),
  textbooks: [{ slug: 'pentateuch', passedAt: '2026-10-01T12:00:00.000Z' }],
  doneCodes: ['CTSNT'],
  ...extra,
});

/* 1. Window closed (no header, or a past time): live sync takes nothing. */
{
  const code = await student('cert');
  await call('POST', '/api/sync', oldDevice(code));
  await call('POST', '/api/sync', oldDevice(code), PAST);
  ok(units(code, 'ots').length === 0, '1: closed window: no unit is taken from the browser', units(code, 'ots'));
  ok(!completions(code).CTSNT, '1: closed window: no completion is taken from the browser', completions(code));
  ok(db(`SELECT COUNT(*) AS n FROM textbook_results WHERE student_id = '${code}'`)[0][0].n === 0, '1: closed window: no textbook pass is taken');
}

/* 2. Window open: the browser's earlier passes arrive, as legacy credit. */
{
  const code = await student('cert');
  const r = await call('POST', '/api/sync', oldDevice(code), FUTURE);
  ok(r.status === 200, '2: the sync succeeds', r);
  const u = units(code, 'ots');
  ok(u.length === 3 && u.every((x) => x.source === 'legacy'), '2: three units recorded, each as legacy credit', u);
  const c = completions(code);
  ok(c.CTSNT && c.CTSNT.track === 'cert' && c.CTSNT.source === 'legacy', '2: a course the record lacked is added at the level reported, as legacy', c);
  ok(db(`SELECT source FROM textbook_results WHERE student_id = '${code}' AND textbook = 'pentateuch'`)[0][0]?.source === 'legacy', '2: the textbook pass is legacy credit');
  const again = await call('POST', '/api/sync', oldDevice(code), FUTURE);
  ok(again.status === 200 && units(code, 'ots').length === 3, '2: replaying the same device changes nothing');
}

/* 3. Window open: no completion the record holds is raised, by any claim. */
{
  const code = await student('thm');
  db(`INSERT INTO course_completions (student_id, code, track, completed_at, source) VALUES ('${code}', 'CTSNT', 'cert', '2026-09-01T00:00:00.000Z', 'server')`);
  await call('POST', '/api/sync', oldDevice(code, { completionTracks: { CTSNT: 'thm' } }), FUTURE);
  await call('POST', '/api/sync', oldDevice(code, { doneCodes: ['CTSNTTHMCERTIFICATE'] }), FUTURE);
  const c = completions(code);
  ok(c.CTSNT.track === 'cert' && c.CTSNT.source === 'server', '3: a held Certificate completion stays a Certificate completion', c);
}

/* 4. A legacy completion with no level is not changed by the window either. */
{
  const code = await student('cert');
  db(`INSERT INTO course_completions (student_id, code, track, completed_at) VALUES ('${code}', 'CTSNT', NULL, '2026-09-01T00:00:00.000Z')`);
  await call('POST', '/api/sync', oldDevice(code, { completionTracks: { CTSNT: 'mdiv' } }), FUTURE);
  ok(completions(code).CTSNT.track === null, '4: the window writes no level onto a held completion', completions(code));
}

/* 5. Legacy units count towards a first completion only (earnedLevel): a
      master's record that held the course at Certificate level is not raised
      by legacy units, even with the window open. Units 1-3 taken above are a
      partial course, so the record simply keeps what it had. */
{
  const code = await student('mdiv');
  db(`INSERT INTO course_completions (student_id, code, track, completed_at, source) VALUES ('${code}', 'CTSOTS', 'cert', '2026-09-01T00:00:00.000Z', 'server')`);
  await call('POST', '/api/sync', oldDevice(code, { doneCodes: ['CTSOTS'], completionTracks: { CTSOTS: 'mdiv' } }), FUTURE);
  ok(completions(code).CTSOTS.track === 'cert', '5: a held completion is not raised by browser lists', completions(code));
}

console.log(`${checks} cutover-window assertions against a live Worker and D1`);
if (fails.length) {
  console.log('FAIL —');
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('PASS — passes held only in a browser are kept as legacy credit while the window is open, and nothing is raised.');
