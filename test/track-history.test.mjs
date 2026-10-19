/* Track changes and earlier credit, through the real Worker and D1, in live
 * grading mode (ChatGPT's final audit, section 3, 18 Oct 2026):
 *
 *   a student who changes track keeps the work they did, at the level they
 *   did it, and gets no higher award for requirements they have not met; and
 *   no sync can raise, import or upgrade credit once the server is the grader.
 *
 *   API_BASE=http://127.0.0.1:8798 STATE=.wrangler-local node test/track-history.test.mjs
 *
 * Completions are written as the server writes them (source = 'server') so
 * each case starts from a known record. Every name here is made up.
 */
import { execFileSync } from 'node:child_process';

const BASE = process.env.API_BASE || 'http://127.0.0.1:8798';
const STATE = process.env.STATE || '.wrangler-local';
const CONFIG = process.env.CONFIG || 'test/wrangler.local.jsonc';
let checks = 0;
const fails = [];
const ok = (cond, label, detail) => { checks++; if (!cond) fails.push(label + (detail === undefined ? '' : `\n        ${JSON.stringify(detail).slice(0, 400)}`)); };
const call = async (method, p, b) => {
  const r = await fetch(BASE + p, { method, headers: { 'content-type': 'application/json', connection: 'close' }, body: b === undefined ? undefined : JSON.stringify(b) });
  return { status: r.status, body: await r.json().catch(() => null) };
};
function db(command) {
  const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'chapala-students', '--local', '--persist-to', STATE, '--config', CONFIG, '--json', '--command', command],
    { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 16 * 1024 * 1024 }).toString();
  return JSON.parse(out.slice(out.indexOf('['))).map((r) => r.results);
}

const FOUNDATION = ['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK'];
const MDIV_CORE = [...FOUNDATION, 'CTSHERMENEUTICS', 'CTSLA', 'CTSGENESIS', 'CTSPSALMS', 'CTSMATT', 'CTSROMANS',
  'CTSACTS', 'CTSAPOL', 'COUNSELING', 'CTSAL', 'CTSWORSHIP', 'CTSCE', 'CTSMISSIONS'];
const ELECTIVES = ['CTS1PETER', 'CTSBIBLE', 'CTSBIBLECHARACTERS', 'CTSBIBLECHARACTERS2', 'CTSCG', 'CTSEVANPREACH',
  'CTSGALATIANS', 'CTSHS', 'CTSJOSH', 'CTSLOC', 'CTSPT', 'CTSPARABLES', 'CTSPENT', 'CTSRE', 'CTSRADICAL', 'CTSREV', 'ETHICS', 'CTSJOHN'];
const RUN = Date.now().toString(36);
let seq = 0;

async function student(track, codes, level, extra = {}) {
  const r = await call('POST', '/api/register', { name: `Track Tester ${RUN} ${++seq}`, email: `track-${RUN}-${seq}@example.test`, track, ...extra });
  if (r.status !== 201) throw new Error(`register returned ${r.status}: ${JSON.stringify(r.body)}`);
  const code = r.body.code;
  if (codes.length) db(`INSERT INTO course_completions (student_id, code, track, completed_at, source) VALUES ${codes.map((c) =>
    `('${code}', '${c}', '${level}', '2026-09-01T00:00:00.000Z', 'server')`).join(', ')}`);
  return code;
}
const degrees = async (code) => (await call('GET', `/api/student/${code}`)).body?.degrees || {};
const switchTo = (code, student) => call('POST', '/api/sync', { code, student });
const levels = (code) => Object.fromEntries(db(`SELECT code, track FROM course_completions WHERE student_id = '${code}'`)[0].map((r) => [r.code, r.track]));

/* 1. Certificate -> Associate: 25 courses done at Certificate level do not
      become an Associate; the Certificate of Ministry stands. */
{
  const code = await student('cert', [...FOUNDATION, ...ELECTIVES], 'cert');
  await switchTo(code, { track: 'cert', goal: 'assoc' });
  const d = await degrees(code);
  ok(d.certificate === true, '1: Certificate -> Associate keeps the Certificate of Ministry', d);
  ok(d.associate === false, '1: but Certificate-level work does not make an Associate', d);
}

/* 2. Associate -> Th.M.: Associate-level work keeps the Associate it earned
      and counts nothing toward the Th.M. */
{
  const code = await student('cert', [...FOUNDATION, ...ELECTIVES], 'assoc', { goal: 'assoc' });
  ok((await degrees(code)).associate === true, '2: 25 Associate-level courses make an Associate');
  await switchTo(code, { track: 'thm' });
  const d = await degrees(code);
  ok(d.associate === true && d.certificate === true, '2: Associate -> Th.M. keeps the Associate and Certificate', d);
  ok(d.thm === false && d.mdiv === false, '2: and grants no master\'s degree for Associate-level work', d);
}

/* 3. Certificate -> M.Div.: thirty Certificate-level courses, core included,
      are not an M.Div. */
{
  const code = await student('cert', [...MDIV_CORE, ...ELECTIVES.slice(0, 10)], 'cert');
  await switchTo(code, { track: 'mdiv' });
  const d = await degrees(code);
  ok(d.certificate === true && d.mdiv === false && d.thm === false, '3: Certificate -> M.Div. keeps the Certificate, grants no master\'s degree', d);
  ok(Object.values(levels(code)).every((t) => t === 'cert'), '3: every completion keeps the level it was earned at');
}

/* 4. Th.M. -> M.Div.: Th.M.-level work is master's-level work and counts
      toward the M.Div. (DEGREES.mdiv.levels); the Th.M. stands. */
{
  const code = await student('thm', [...MDIV_CORE, ...ELECTIVES.slice(0, 10)], 'thm');
  ok((await degrees(code)).thm === true, '4: a Th.M. student with the work has the Th.M.');
  await switchTo(code, { track: 'mdiv' });
  const d = await degrees(code);
  ok(d.thm === true && d.mdiv === true, '4: Th.M. -> M.Div. keeps the Th.M. and counts the master\'s work toward the M.Div.', d);
  const partial = await student('thm', [...FOUNDATION, ...ELECTIVES.slice(0, 8)], 'thm');
  await switchTo(partial, { track: 'mdiv' });
  ok((await degrees(partial)).mdiv === false, '4: without the 20-course core and 30 courses there is no M.Div.');
}

/* 5. No sync can import, upgrade or raise credit in live mode. */
{
  const code = await student('cert', FOUNDATION, 'cert');
  const raised = await call('POST', '/api/sync', { code, doneCodes: FOUNDATION, completionTracks: Object.fromEntries(FOUNDATION.map((c) => [c, 'mdiv'])) });
  ok(raised.status === 200, '5: the sync itself is accepted', raised.status);
  ok(Object.values(levels(code)).every((t) => t === 'cert'), '5: a browser reporting master\'s level does not upgrade a Certificate completion', levels(code));
  const imported = await call('POST', '/api/sync', { code, doneCodes: [...MDIV_CORE, ...ELECTIVES], completionTracks: {},
    progress: [{ course: 'ots', unit: 1, completedAt: '2001-01-01T00:00:00Z' }], textbooks: [{ slug: 'oldtestament', passedAt: '2001-01-01T00:00:00Z' }] });
  ok(Object.keys(levels(code)).length === FOUNDATION.length, '5: completions a browser reports are not imported', Object.keys(levels(code)).length);
  ok(db(`SELECT COUNT(*) AS n FROM textbook_results WHERE student_id = '${code}'`)[0][0].n === 0, '5: nor a back-dated textbook pass');
  ok(db(`SELECT COUNT(*) AS n FROM unit_progress WHERE student_id = '${code}'`)[0][0].n === 0, '5: nor back-dated unit progress');
  ok(imported.body && !imported.body.doneCodes.includes('CTSMATT'), '5: and the reply shows only the server\'s record');
  const d = await degrees(code);
  ok(d.mdiv === false && d.associate === false, '5: so no degree follows from it', d);
}

console.log(`${checks} track and earlier-credit assertions against a live Worker and D1`);
if (fails.length) {
  console.log(`FAIL — ${fails.length}:`);
  for (const f of fails) console.log('  ✗ ' + f);
  process.exit(1);
}
console.log('PASS — track changes keep earned work at its level; no sync imports or upgrades credit.');
