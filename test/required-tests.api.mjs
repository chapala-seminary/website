// A course with two required tests, through the real Worker and a real D1
// (Dr. Cook and ChatGPT's authorization, 9 Oct 2026): Pentecostalism & the
// Charismatic Movement requires its textbook test and its five-reading test
// of a master's student, each passed on its own, and the record's master's
// completions from before the reading test was activated stand as they are.
//
//   API_BASE=http://127.0.0.1:8798 STATE=.wrangler-local node test/required-tests.api.mjs
//
// The suite's Worker treats the reading test as activated on 1 Jan 2001
// (TEST_REQUIRED_FROM in test/wrangler.local.jsonc; worker/api.js
// testRequiredFrom), so every completion it records is "after". A completion
// from before is written straight into the local database, as the record of
// a student who finished before activation would already hold it.

import { execFileSync } from 'node:child_process';

const BASE = process.env.API_BASE || 'http://127.0.0.1:8798';
const STATE = process.env.STATE || '.wrangler-local';
const CONFIG = process.env.CONFIG || 'test/wrangler.local.jsonc';

let checks = 0;
const fails = [];
function ok(cond, label, detail) {
  checks++;
  if (!cond) fails.push(label + (detail !== undefined ? `\n        ${typeof detail === 'string' ? detail : JSON.stringify(detail)}` : ''));
}
const jpost = async (p, b) => { const r = await fetch(BASE + p, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }); return { status: r.status, body: await r.json().catch(() => null) }; };
const jget = async (p) => { const r = await fetch(BASE + p); return { status: r.status, body: await r.json().catch(() => null) }; };
const sql = (command) => execFileSync('npx', ['wrangler', 'd1', 'execute', 'chapala-students', '--local', '--persist-to', STATE, '--config', CONFIG, '--command', command], { stdio: ['ignore', 'pipe', 'pipe'] }).toString();

const CODE = 'CTSPENTECOSTAL', BOOK = 'pentecostal', READ = 'pentecostalreadings';
const UNITS = Array.from({ length: 12 }, (_, i) => i + 1);
const AT = '2026-10-10T12:00:00.000Z';
const allUnits = UNITS.map((u) => ({ course: 'pentecostal', unit: u, completedAt: AT }));
const done = (track) => ({ doneCodes: [CODE], completionTracks: track === 'cert' ? {} : { [CODE]: track } });
const has = (st, track) => (st.completions || []).some((c) => c.code === CODE && (!track || c.track === track));
let n = 0;
const student = async (track, extra = {}) => {
  const r = await jpost('/api/register', { name: `Pentecostal Tester ${++n} ${track}`, track, ...extra });
  if (r.status !== 201) throw new Error(`register returned ${r.status}: ${JSON.stringify(r.body)}`);
  return r.body.code;
};
const verify = async (code, email) => {
  const s = await jpost('/api/email/start', { code, email });
  return (await jpost('/api/email/confirm', { code, verification: s.body?.devCode })).status === 200;
};

{
  const units = (await jget('/api/health')).status;
  ok(units === 200, 'the Worker answers');
}

/* ---- both tests, each on its own ---------------------------------------- */

// Textbook passed, reading test not: the M.Div. completion is not recorded.
{
  const c = await student('mdiv');
  let st = (await jpost('/api/sync', { code: c, progress: allUnits, textbooks: [{ slug: BOOK, passedAt: AT }], ...done('mdiv') })).body;
  ok(!has(st), 'textbook passed, reading test not: the M.Div. completion is not recorded', st.completions);
  ok(st.textbooks.some((t) => t.textbook === BOOK) && !st.textbooks.some((t) => t.textbook === READ), 'the record holds the textbook pass and no reading pass', st.textbooks);
  ok(JSON.stringify(st.exemptions) === '[]', 'and names no exemption', st.exemptions);
  // Then the reading test: both passes, kept apart, and the course recorded at the master's level.
  st = (await jpost('/api/sync', { code: c, textbooks: [{ slug: READ, passedAt: AT }], ...done('mdiv') })).body;
  ok(has(st, 'mdiv'), 'with the reading test passed too, the course is recorded at the M.Div. level', st.completions);
  ok(['pentecostal', 'pentecostalreadings'].every((s) => st.textbooks.some((t) => t.textbook === s)), 'two passes in the record, one per test', st.textbooks);
  // A later device that knows neither pass takes nothing away.
  st = (await jpost('/api/sync', { code: c, textbooks: [], doneCodes: [], completionTracks: {} })).body;
  ok(st.textbooks.length === 2 && has(st, 'mdiv'), 'a device without the passes takes nothing from the record', st);
}

// Reading test passed, textbook not: held for the textbook.
{
  const c = await student('thm');
  const st = (await jpost('/api/sync', { code: c, progress: allUnits, textbooks: [{ slug: READ, passedAt: AT }], ...done('thm') })).body;
  ok(!has(st), 'reading test passed, textbook not: the Th.M. completion is not recorded', st.completions);
}

// Certificate and Associate: unchanged, no test needed.
for (const [track, extra] of [['cert', {}], ['cert', { goal: 'assoc' }]]) {
  const c = await student(track, extra);
  const st = (await jpost('/api/sync', { code: c, progress: allUnits, ...done('cert') })).body;
  ok(has(st), `a ${extra.goal ? 'Associate' : 'Certificate'} student's completion is recorded with no test at all`, st.completions);
}

/* ---- the four student-record cases -------------------------------------- */

// Case 1: a master's completion the record held before activation.
{
  const c = await student('mdiv');
  ok(await verify(c, `case1.${Date.now()}@example.org`), 'Case 1: the student verifies an email (a certificate needs one)');
  const id = (await jget(`/api/student/${c}`)).body?.student?.id;
  let inserted = false;
  try {
    sql(`INSERT INTO course_completions (student_id, code, track, completed_at) VALUES ('${String(id).replace(/'/g, "''")}', '${CODE}', 'mdiv', '2000-06-01T12:00:00.000Z')`);
    inserted = true;
  } catch (e) { ok(false, 'Case 1: could not write the earlier completion into the local database', String(e.stderr || e.message).slice(0, 300)); }
  if (inserted) {
    await jpost('/api/sync', { code: c, progress: allUnits, textbooks: [{ slug: BOOK, passedAt: AT }], ...done('mdiv') });
    const st = (await jget(`/api/student/${c}`)).body;
    ok(has(st, 'mdiv'), 'Case 1: the earlier M.Div. completion is still in the record', st.completions);
    ok(JSON.stringify(st.exemptions) === JSON.stringify([READ]), 'Case 1: the record names the reading test as not needed for it', st.exemptions);
    const cert = await jpost('/api/certificate', { code: c, level: 'course', course: 'pentecostal', title: 'Pentecostalism & the Charismatic Movement' });
    ok(cert.status === 201, `Case 1: its certificate is issued without the reading test (${cert.status}: ${cert.body?.error})`);
  }
}

// Case 2: finished before, but first reported after activation.
{
  const c = await student('mdiv');
  const st = (await jpost('/api/sync', { code: c, progress: allUnits, textbooks: [{ slug: BOOK, passedAt: AT }], ...done('mdiv') })).body;
  ok(!has(st), 'Case 2: a completion the server first hears of after activation needs the reading test', st.completions);
  ok(JSON.stringify(st.exemptions) === '[]', 'Case 2: no exemption', st.exemptions);
}

// Case 3: a Certificate completion from before, then the move to the M.Div.
{
  const c = await student('cert');
  let st = (await jpost('/api/sync', { code: c, progress: allUnits, ...done('cert') })).body;
  ok(has(st, 'cert'), 'Case 3: the Certificate completion is recorded', st.completions);
  st = (await jpost('/api/sync', { code: c, student: { track: 'mdiv' }, textbooks: [{ slug: BOOK, passedAt: AT }], ...done('mdiv') })).body;
  ok(has(st, 'cert') && !has(st, 'mdiv'), 'Case 3: moved to the M.Div., the course is not raised to the master\'s level without the reading test', st.completions);
  ok(JSON.stringify(st.exemptions) === '[]', 'Case 3: the earlier Certificate completion is no exemption', st.exemptions);
  ok((st.progress || []).filter((p) => p.course === 'pentecostal').length === 12, 'Case 3: the units passed stay passed');
  st = (await jpost('/api/sync', { code: c, textbooks: [{ slug: READ, passedAt: AT }], ...done('mdiv') })).body;
  ok(has(st, 'mdiv'), 'Case 3: with the reading test passed, the course rises to the M.Div. level', st.completions);
}

// Case 4: started, not finished, at activation.
{
  const c = await student('mdiv');
  let st = (await jpost('/api/sync', { code: c, progress: allUnits.slice(0, 5) })).body;
  ok(!has(st) && st.progress.length === 5, 'Case 4: five units in, no completion');
  st = (await jpost('/api/sync', { code: c, progress: allUnits, textbooks: [{ slug: BOOK, passedAt: AT }], ...done('mdiv') })).body;
  ok(!has(st), 'Case 4: finishing the units and the textbook is not enough; the reading test is required', st.completions);
  ok(st.progress.length === 12, 'Case 4: the units passed before stay passed');
}

/* ---- the courses the pilot does not touch -------------------------------- */
{
  const c = await student('mdiv');
  const gen = Array.from({ length: 12 }, (_, i) => ({ course: 'genesis', unit: i + 1, completedAt: AT }));
  let st = (await jpost('/api/sync', { code: c, progress: gen, doneCodes: ['CTSGENESIS'], completionTracks: { CTSGENESIS: 'mdiv' } })).body;
  ok(!st.completions.some((x) => x.code === 'CTSGENESIS'), 'Genesis is held for its reading test exactly as before');
  st = (await jpost('/api/sync', { code: c, textbooks: [{ slug: 'genesisreadings', passedAt: AT }], doneCodes: ['CTSGENESIS'], completionTracks: { CTSGENESIS: 'mdiv' } })).body;
  ok(st.completions.some((x) => x.code === 'CTSGENESIS' && x.track === 'mdiv'), 'and recorded with it', st.completions);
}

if (fails.length) {
  console.log(`FAIL — ${fails.length} of ${checks} required-test API checks:`);
  for (const f of fails) console.log('  - ' + f);
  process.exit(1);
}
console.log(`PASS — ${checks} required-test API checks: both tests on their own, the four record cases, Certificate and Associate unchanged.`);
