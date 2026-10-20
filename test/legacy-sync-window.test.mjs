/* The cutover grace window (worker/grading/mode.js legacySyncOpen and
 * legacyCohortMember), through the real Worker and D1 in live grading mode
 * (ChatGPT's reviews of #146, 20 Oct 2026): a student registered before the
 * switch whose passes never left the browser must not lose them; and the
 * window must not be a way in for anyone else, nor a way round a live result,
 * nor a source of completions or levels the server has not worked out itself.
 *
 *   API_BASE=http://127.0.0.1:8798 STATE=.wrangler-local node test/legacy-sync-window.test.mjs
 *
 * The suite's Worker sets neither LEGACY_SYNC_UNTIL nor
 * LEGACY_SYNC_COHORT_BEFORE; each request opens or closes the window with
 * x-test-legacy-sync-until, and places the record before or after the switch
 * with x-test-legacy-cohort-before (a record is registered "now"). Every name
 * here is made up.
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
const OPEN = { until: FUTURE, cohort: FUTURE };          // window open, record made before the switch
const call = async (method, p, b, w = {}) => {
  const headers = { 'content-type': 'application/json', connection: 'close' };
  if (w.until) headers['x-test-legacy-sync-until'] = w.until;
  if (w.cohort) headers['x-test-legacy-cohort-before'] = w.cohort;
  const r = await fetch(BASE + p, { method, headers, body: b === undefined ? undefined : JSON.stringify(b) });
  return { status: r.status, body: await r.json().catch(() => null) };
};
// The Worker may still hold the local database for a moment after replying
// (SQLITE_BUSY); a read or seed is retried briefly rather than failing the run.
function db(command) {
  for (let attempt = 1; ; attempt++) {
    try {
      const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'chapala-students', '--local', '--persist-to', STATE, '--config', CONFIG, '--json', '--command', command],
        { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 16 * 1024 * 1024 }).toString();
      return JSON.parse(out.slice(out.indexOf('['))).map((r) => r.results);
    } catch (e) {
      if (attempt >= 5 || !/SQLITE_BUSY|database is locked/.test(String(e.stderr || e.message))) throw e;
      execFileSync('sleep', ['1']);
    }
  }
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
const textbooks = (code) => db(`SELECT textbook, source FROM textbook_results WHERE student_id = '${code}'`)[0];
const ALL_OTS = Array.from({ length: 13 }, (_, i) => ({ course: 'ots', unit: i + 1 }));
const device = (code, extra = {}) => ({ code, progress: ALL_OTS, doneCodes: ['CTSOTS'], ...extra });

/* 1. Window closed (no header, a past end, or no cohort): nothing is taken. */
{
  const code = await student('cert');
  await call('POST', '/api/sync', device(code));
  await call('POST', '/api/sync', device(code), { until: PAST, cohort: FUTURE });
  await call('POST', '/api/sync', device(code), { until: FUTURE });
  ok(units(code, 'ots').length === 0, '1: closed window: no unit is taken from the browser', units(code, 'ots'));
  ok(!completions(code).CTSOTS, '1: closed window: no completion is taken from the browser', completions(code));
}

/* 2. A record registered after the switch brings nothing, even with the window
      open: ChatGPT's reproduction (13 OTS claims and doneCodes on a new
      Certificate record), and its M.Div. variant with a textbook claim. */
{
  const cert = await student('cert');
  await call('POST', '/api/sync', device(cert), { until: FUTURE, cohort: PAST });
  ok(units(cert, 'ots').length === 0 && !completions(cert).CTSOTS, '2: post-switch Certificate record: no units, no completion', { u: units(cert, 'ots'), c: completions(cert) });
  const mdiv = await student('mdiv');
  await call('POST', '/api/sync', device(mdiv, { textbooks: [{ slug: 'oldtestament', passedAt: '2026-10-01T12:00:00.000Z' }], completionTracks: { CTSOTS: 'mdiv' } }), { until: FUTURE, cohort: PAST });
  ok(units(mdiv, 'ots').length === 0 && !completions(mdiv).CTSOTS && textbooks(mdiv).length === 0,
    '2: post-switch M.Div. record: no units, no textbook pass, no completion', { u: units(mdiv, 'ots'), c: completions(mdiv), t: textbooks(mdiv) });
}

/* 3. A pre-switch record with the window open keeps its browser-only passes,
      as legacy credit, and the server -- not the browser's list -- completes the
      course, at the record's level. */
{
  const code = await student('cert');
  const r = await call('POST', '/api/sync', device(code), OPEN);
  ok(r.status === 200, '3: the sync succeeds', r);
  const u = units(code, 'ots');
  ok(u.length === 13 && u.every((x) => x.source === 'legacy'), '3: all thirteen units recorded, each as legacy credit', u);
  ok(completions(code).CTSOTS?.track === 'cert', '3: the server completes the course at the record\'s level', completions(code));
  await call('POST', '/api/sync', device(code), OPEN);
  ok(units(code, 'ots').length === 13 && Object.keys(completions(code)).length === 1, '3: replaying the same device changes nothing');
}

/* 4. A completion the browser lists without the units behind it is not taken:
      the window imports passes, not claims of completion. */
{
  const code = await student('cert');
  await call('POST', '/api/sync', { code, progress: [], doneCodes: ['CTSOTS', 'CTSNT'], completionTracks: { CTSNT: 'thm' } }, OPEN);
  ok(Object.keys(completions(code)).length === 0, '4: no completion from the browser\'s lists alone', completions(code));
}

/* 5. A live result stands: a unit with a live attempt is not taken from the
      browser, so a failed live test cannot be replaced by a browser claim,
      and the course therefore does not complete. */
{
  const code = await student('cert');
  db(`INSERT INTO attempts (id, student_id, scope, track, lang, shadow, status, started_at, submitted_at, graded_at)
      VALUES ('cutover-${RUN}-fail', '${code}', 'u:CTS/2', 'cert', 'en', 0, 'failed', '2026-10-25T00:00:00.000Z', '2026-10-25T00:10:00.000Z', '2026-10-25T00:10:00.000Z')`);
  await call('POST', '/api/sync', device(code), OPEN);
  const u = units(code, 'ots');
  ok(u.length === 12 && !u.some((x) => x.unit === 2), '5: the unit with a live attempt is not taken from the browser', u);
  ok(!completions(code).CTSOTS, '5: so the course is not completed', completions(code));
}

/* 6. No completion the record holds is raised or given a level, by any claim. */
{
  const code = await student('thm');
  db(`INSERT INTO course_completions (student_id, code, track, completed_at, source) VALUES ('${code}', 'CTSOTS', 'cert', '2026-09-01T00:00:00.000Z', 'server')`);
  await call('POST', '/api/sync', device(code, { completionTracks: { CTSOTS: 'thm' } }), OPEN);
  await call('POST', '/api/sync', device(code, { doneCodes: ['CTSOTSTHMCERTIFICATE'] }), OPEN);
  ok(completions(code).CTSOTS.track === 'cert', '6: a held Certificate completion stays a Certificate completion (legacy units never raise a level)', completions(code));
  const none = await student('cert');
  db(`INSERT INTO course_completions (student_id, code, track, completed_at) VALUES ('${none}', 'CTSNT', NULL, '2026-09-01T00:00:00.000Z')`);
  await call('POST', '/api/sync', { code: none, progress: [], doneCodes: ['CTSNT'], completionTracks: { CTSNT: 'mdiv' } }, OPEN);
  ok(completions(none).CTSNT.track === null, '6: the window writes no level onto a held completion', completions(none));
}

console.log(`${checks} cutover-window assertions against a live Worker and D1`);
if (fails.length) {
  console.log('FAIL —');
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('PASS — only records from before the switch keep browser-only passes, as legacy credit; live results stand; the server decides completions; nothing is raised.');
