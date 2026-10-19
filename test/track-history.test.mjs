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

/* 6. A course certificate names the level the course was EARNED at, not the
      student's current track (ChatGPT's review of #125, 19 Oct 2026). */
const UNITS_1PETER = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
async function finished(track, course, code, completionTrack, extra = {}) {
  const s = await student(track, [], 'cert', extra);
  db(`UPDATE students SET email_verified_at = '2026-09-01T00:00:00.000Z' WHERE id = '${s}'`);
  db(`INSERT INTO unit_progress (student_id, course, unit, completed_at, source) VALUES ${UNITS_1PETER.map((u) =>
    `('${s}', '${course}', ${u}, '2026-09-01T00:00:00.000Z', 'server')`).join(', ')}`);
  if (completionTrack !== undefined) db(`INSERT INTO course_completions (student_id, code, track, completed_at, source) VALUES ('${s}', '${code}', ${completionTrack === null ? 'NULL' : `'${completionTrack}'`}, '2026-09-01T00:00:00.000Z', 'server')`);
  return s;
}
const award = (code, course) => call('POST', '/api/certificate', { code, level: 'course', course, title: 'Doctor of Divinity, honoris causa' });
const titleOf = (vc) => db(`SELECT title FROM certificates WHERE verify_code = '${vc}'`)[0][0]?.title;
{
  // Certificate-level work, then a move to the Th.M.: still a Certificate-level award
  const a = await finished('cert', '1peter', 'CTS1PETER', 'cert');
  await switchTo(a, { track: 'thm' });
  const r = await award(a, '1peter');
  ok(r.status === 201 && / — Certificate of Ministry$/.test(titleOf(r.body.verifyCode)), '6: Certificate -> Th.M.: the 1 Peter award stays "Certificate of Ministry"', [r.status, titleOf(r.body?.verifyCode)]);
  // Associate-level work, then a move to the M.Div.: an Associate-level award
  const b = await finished('cert', '1peter', 'CTS1PETER', 'assoc', { goal: 'assoc' });
  await switchTo(b, { track: 'mdiv' });
  const rb = await award(b, '1peter');
  ok(rb.status === 201 && / — Associate of Divinity$/.test(titleOf(rb.body.verifyCode)), '6: Associate -> M.Div.: the award stays "Associate of Divinity"', [rb.status, titleOf(rb.body?.verifyCode)]);
  // Master's-level work, then a move back to the Certificate: the earned level stands
  const m = await finished('thm', '1peter', 'CTS1PETER', 'thm');
  await switchTo(m, { track: 'cert' });
  const rm = await award(m, '1peter');
  ok(rm.status === 201 && / — Master of Theology$/.test(titleOf(rm.body.verifyCode)), '6: master\'s -> Certificate: the master\'s-level award is not taken away', [rm.status, titleOf(rm.body?.verifyCode)]);
  // A Certificate-level completion stays Certificate-level even when the student's units are
  // all there and their track now says master's (the completion is the record of the level)
  const n = await finished('cert', '1peter', 'CTS1PETER', 'cert');
  db(`UPDATE students SET track = 'mdiv' WHERE id = '${n}'`);
  const rn = await award(n, '1peter');
  ok(rn.status === 201 && / — Certificate of Ministry$/.test(titleOf(rn.body.verifyCode)), '6: a changed track alone never raises a recorded completion\'s level', [rn.status, titleOf(rn.body?.verifyCode)]);
  // A master's completion whose required reading test is in force and not passed: refused
  const p = await finished('thm', 'pentecostal', 'CTSPENTECOSTAL', 'thm');
  const rp = await award(p, 'pentecostal');
  ok(rp.status === 409, '6: a master\'s award whose required test is not passed is refused', [rp.status, rp.body]);
  // Reissue: the same award gives back the same code, and the title it was issued with
  await switchTo(a, { track: 'mdiv' });
  const again = await award(a, '1peter');
  ok(again.status === 200 && again.body?.reissued === true && again.body.verifyCode === r.body.verifyCode, '6: asking again returns the same verification code', [again.status, again.body]);
  ok(/ — Certificate of Ministry$/.test(titleOf(r.body.verifyCode)) && db(`SELECT COUNT(*) AS n FROM certificates WHERE student_id = '${a}'`)[0][0].n === 1, '6: and the earlier award is kept unchanged, not duplicated');
  // A completion with no level (before migration 0003) counts at the student's own level
  const l = await finished('thm', '1peter', 'CTS1PETER', null);
  const rl = await award(l, '1peter');
  ok(rl.status === 201 && / — Master of Theology$/.test(titleOf(rl.body.verifyCode)), '6: a pre-0003 completion with no level counts at the student\'s own level', [rl.status, titleOf(rl.body?.verifyCode)]);
}

console.log(`${checks} track and earlier-credit assertions against a live Worker and D1`);
if (fails.length) {
  console.log(`FAIL — ${fails.length}:`);
  for (const f of fails) console.log('  ✗ ' + f);
  process.exit(1);
}
console.log('PASS — track changes keep earned work at its level; no sync imports or upgrades credit.');
