// Student-records API tests, run against a real Worker with a real D1.
//
//   wrangler dev --local --port 8799 --persist-to .wrangler-state
//   wrangler d1 execute chapala-students --local --persist-to .wrangler-state --file migrations/0001_init.sql
//   node test/api.test.mjs
//
// These assert behaviour a student depends on -- that progress can never go
// backwards, that a code typed with the wrong case or a letter O still finds
// the record -- and behaviour an attacker probes, like whether a wrong code is
// distinguishable from an unknown one.

const BASE = process.env.API_BASE || 'http://127.0.0.1:8799';

let checks = 0;
const fails = [];
function ok(cond, label, detail) {
  checks++;
  if (!cond) fails.push(label + (detail ? `\n        ${detail}` : ''));
}
const post = (p, b, init = {}) => fetch(BASE + p, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b), ...init });
const get = p => fetch(BASE + p);

async function jget(p) { const r = await get(p); return { status: r.status, body: await r.json().catch(() => null) }; }
async function jpost(p, b) { const r = await post(p, b); return { status: r.status, body: await r.json().catch(() => null) }; }

/* ---- registration -------------------------------------------------------- */

for (const [payload, why] of [
  [{}, 'no name'],
  [{ name: 'A' }, 'no track'],
  [{ name: 'A', track: 'wizard' }, 'unknown track'],
  [{ name: 'x'.repeat(200), track: 'cert' }, 'name over the length cap'],
  [{ name: '   ', track: 'cert' }, 'whitespace-only name'],
]) {
  const r = await jpost('/api/register', payload);
  ok(r.status === 400, `register with ${why} should be rejected, got ${r.status}`);
}

const reg = await jpost('/api/register', {
  name: 'María de la Cruz', email: 'maria@example.org', country: 'MX', track: 'mdiv', goal: 'pastoral ministry',
});
ok(reg.status === 201, `register returned ${reg.status}`);
const CODE = reg.body?.code;
ok(/^CTS-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/.test(CODE || ''),
  `student code has the documented shape`, `got ${CODE}`);
ok(reg.body?.student?.name === 'María de la Cruz', 'the name survives a round trip with its accents');

const second = await jpost('/api/register', { name: 'Someone Else', track: 'cert' });
ok(second.body?.code && second.body.code !== CODE, 'two registrations get different codes');

/* ---- sync and merge ------------------------------------------------------ */

ok((await jpost('/api/sync', { code: 'CTS-0000-0000-0000', progress: [] })).status === 404,
  'syncing an unknown code is refused');
ok((await jpost('/api/sync', { progress: [] })).status === 400, 'syncing with no code is refused');

const T_LATE = '2026-06-01T10:00:00.000Z';
const T_EARLY = '2026-01-15T08:30:00.000Z';

await jpost('/api/sync', {
  code: CODE,
  progress: [{ course: '1peter', unit: 1, completedAt: T_LATE }, { course: '1peter', unit: 2, completedAt: T_LATE }],
  doneCodes: ['CTSOTS'],
});

// The same unit, completed earlier on another device. The earlier time must win.
let s = await jpost('/api/sync', {
  code: CODE,
  progress: [{ course: '1peter', unit: 1, completedAt: T_EARLY }],
  doneCodes: ['CTSNT'],
});
const find = (st, course, unit) => st.progress.find(p => p.course === course && p.unit === unit);
ok(find(s.body, '1peter', 1)?.completed_at === T_EARLY, 'the earlier completion time wins');
ok(!!find(s.body, '1peter', 2), 'a unit missing from this sync is NOT dropped');
ok(s.body.doneCodes.join(',') === 'CTSNT,CTSOTS', `done codes are the union, got ${s.body.doneCodes}`);

// A stale device that knows nothing must not be able to erase anything.
s = await jpost('/api/sync', { code: CODE, progress: [], doneCodes: [] });
ok(s.body.progress.length === 2 && s.body.doneCodes.length === 2,
  'an empty sync from a stale device takes nothing away');

// And a later time for an already-recorded unit must not move it forward.
s = await jpost('/api/sync', { code: CODE, progress: [{ course: '1peter', unit: 1, completedAt: T_LATE }] });
ok(find(s.body, '1peter', 1)?.completed_at === T_EARLY, 'a later completion time does not overwrite an earlier one');

// Identity is last-writer-wins; that is a deliberate difference from progress.
s = await jpost('/api/sync', { code: CODE, student: { name: 'María Cruz', track: 'thm' } });
ok(s.body.student.name === 'María Cruz' && s.body.student.track === 'thm', 'the student can correct their own details');
ok(s.body.student.email === 'maria@example.org', 'fields the client omits are left alone, not blanked');

// Garbage in the progress array is skipped, not fatal, and not stored.
s = await jpost('/api/sync', {
  code: CODE,
  progress: [null, 'nope', { course: '', unit: 3 }, { course: 'ok', unit: -1 }, { course: 'ok', unit: 1.5 },
    { course: 'romans', unit: 4 }],
});
ok(s.status === 200 && find(s.body, 'romans', 4), 'a valid row is stored alongside invalid ones');
ok(!s.body.progress.some(p => p.course === 'ok'), 'invalid rows are not stored');

/* ---- how students actually type a code ----------------------------------- */

const bare = CODE.replace(/-/g, '');
for (const [typed, why] of [
  [CODE.toLowerCase(), 'lower case'],
  [bare, 'no dashes'],
  [CODE.replace(/-/g, ' '), 'spaces instead of dashes'],
  [` ${CODE} `, 'surrounding whitespace'],
]) {
  const r = await jget(`/api/student/${encodeURIComponent(typed)}`);
  ok(r.status === 200 && r.body?.student?.id === CODE, `a code typed with ${why} still finds the record`);
}

// The alphabet has no I, L, O or U precisely so these substitutions are safe.
const confused = CODE.replace(/0/g, 'O').replace(/1/g, 'I');
if (confused !== CODE) {
  const r = await jget(`/api/student/${encodeURIComponent(confused)}`);
  ok(r.status === 200, 'O typed for zero and I typed for one still find the record');
}

const unknown = await jget('/api/student/CTS-0000-0000-0001');
const malformed = await jget('/api/student/not-a-code');
ok(unknown.status === 404 && malformed.status === 404 &&
   JSON.stringify(unknown.body) === JSON.stringify(malformed.body),
  'a wrong code and a malformed code are indistinguishable');

/* ---- certificates and public verification -------------------------------- */

ok((await jpost('/api/certificate', { code: CODE, level: 'course', course: 'nosuchcourse', title: 'X' })).status === 409,
  'a certificate cannot be issued for a course with no recorded progress');
ok((await jpost('/api/certificate', { code: CODE, level: 'sainthood', title: 'X' })).status === 400,
  'an unknown award level is refused');

const cert = await jpost('/api/certificate', { code: CODE, level: 'course', course: '1peter', title: '1 Peter Intensive' });
ok(cert.status === 201, `issuing a certificate returned ${cert.status}`);
const VC = cert.body?.verifyCode;
ok(/^[0-9A-HJKMNP-TV-Z]{10}$/.test(VC || ''), `verification code has the documented shape, got ${VC}`);

const again = await jpost('/api/certificate', { code: CODE, level: 'course', course: '1peter', title: '1 Peter Intensive' });
ok(again.body?.verifyCode === VC && again.body?.reissued === true,
  'printing the same certificate twice does not mint a second verification code');

const v = await jget(`/api/verify/${VC}`);
ok(v.status === 200 && v.body?.valid === true && v.body?.name === 'María Cruz',
  'the verification API confirms a real certificate under the current name');
ok((await jget('/api/verify/ZZZZZZZZZZ')).status === 404, 'an unknown verification code is not confirmed');

const page = await get(`/verify/${VC}`);
const html = await page.text();
ok(page.status === 200 && /text\/html/.test(page.headers.get('content-type') || ''), 'the public page renders HTML');
ok(html.includes('María Cruz') && html.includes('1 Peter Intensive'), 'the page shows the award');
ok(!html.includes(CODE) && !html.includes('maria@example.org'),
  'the public page leaks neither the student code nor their email');

const missPage = await get('/verify/ZZZZZZZZZZ');
ok(missPage.status === 404, 'an unknown code returns 404, not a blank confirmation');
ok(/No certificate has been issued/.test(await missPage.text()), 'and says so in plain language');

// A code is echoed onto the page, so it is an injection surface.
const xss = await get('/verify/' + encodeURIComponent('<script>alert(1)</script>'));
ok(!(await xss.text()).includes('<script>alert(1)</script>'), 'a code containing markup is escaped, not executed');

/* ---- malformed requests --------------------------------------------------- */

ok((await fetch(BASE + '/api/sync', { method: 'POST', headers: { 'content-type': 'text/plain' }, body: '{}' })).status === 415,
  'a non-JSON content type is refused');
ok((await fetch(BASE + '/api/sync', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{oops' })).status === 400,
  'a malformed JSON body is refused');
ok((await get('/api/nothing')).status === 404, 'an unknown endpoint is a 404');
ok((await fetch(BASE + `/api/student/${CODE}`, { method: 'PUT' })).status === 405, 'an unsupported method is a 405');

/* ---- deletion ------------------------------------------------------------- */

const del = await fetch(BASE + `/api/student/${CODE}`, { method: 'DELETE' });
ok(del.status === 200, `delete returned ${del.status}`);
ok((await jget(`/api/student/${CODE}`)).status === 404, 'the record is gone after deletion');
ok((await jget(`/api/verify/${VC}`)).status === 404, 'and so are the certificates issued from it');
ok((await fetch(BASE + `/api/student/${CODE}`, { method: 'DELETE' })).status === 404,
  'deleting twice is a 404, not an error');

/* -------------------------------------------------------------------------- */

console.log(`${checks} assertions against a live Worker and D1`);
if (!fails.length) console.log('PASS — the student-records API behaves as specified.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach(f => console.log('  ' + f)); process.exitCode = 1; }
