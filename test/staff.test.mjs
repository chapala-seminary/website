// The student tracker's pages and the notes to students (worker/staff.js,
// worker/outreach.js), against a real Worker and D1.
//
//   node test/staff.test.mjs          (API_BASE defaults to http://127.0.0.1:8799)
//
// Time is moved with ?asOf= on the staff endpoints: a student registered a
// moment ago is "three weeks quiet" as of a date three weeks from now. The
// Cloudflare Access login is checked for real -- signature, audience, issuer,
// expiry -- against the suite's own signing key (test/fixtures/access-test-key.json).
import crypto from 'node:crypto';
import fs from 'node:fs';

const BASE = process.env.API_BASE || 'http://127.0.0.1:8799';
let checks = 0;
const fails = [];
const ok = (c, label, detail) => { checks++; if (!c) fails.push(label + (detail ? `\n        ${detail}` : '')); };

/* ---- signing in ------------------------------------------------------------ */
const { key: TEST_JWK } = JSON.parse(fs.readFileSync(new URL('./fixtures/access-test-key.json', import.meta.url), 'utf8'));
const b64 = (v) => Buffer.from(typeof v === 'string' ? v : JSON.stringify(v)).toString('base64url');
function token({ aud = 'cts-test-aud', iss = 'https://cts-test.cloudflareaccess.com', exp = Date.now() / 1000 + 600,
  email = 'staff@example.test', key = crypto.createPrivateKey({ key: TEST_JWK, format: 'jwk' }), kid = 'cts-test-1' } = {}) {
  const head = b64({ alg: 'RS256', kid, typ: 'JWT' });
  const body = b64({ aud: [aud], iss, exp: Math.floor(exp), iat: Math.floor(Date.now() / 1000), email, sub: 'x' });
  return `${head}.${body}.${crypto.sign('sha256', Buffer.from(`${head}.${body}`), key).toString('base64url')}`;
}
const STAFF = { 'cf-access-jwt-assertion': token() };
const staff = (p, init = {}) => fetch(BASE + p, { ...init, headers: { ...STAFF, ...(init.headers || {}) }, redirect: 'manual' });
const later = (days) => new Date(Date.now() + days * 86400000).toISOString();

const other = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey;
for (const [why, headers] of [
  ['no token', {}],
  ['a token signed by some other key', { 'cf-access-jwt-assertion': token({ key: other }) }],
  ['a token for another application', { 'cf-access-jwt-assertion': token({ aud: 'someone-else' }) }],
  ['a token from another team', { 'cf-access-jwt-assertion': token({ iss: 'https://evil.cloudflareaccess.com' }) }],
  ['an expired token', { 'cf-access-jwt-assertion': token({ exp: Date.now() / 1000 - 60 }) }],
  ['a token with its body altered', { 'cf-access-jwt-assertion': token().replace(/\.([^.]+)\./, (m, b) => `.${b64({ ...JSON.parse(Buffer.from(b, 'base64url')), email: 'x@y' })}.`) }],
  ['garbage', { 'cf-access-jwt-assertion': 'a.b.c' }],
]) {
  for (const p of ['/staff/students', '/staff/students.csv', '/staff/students.json', '/staff/notes']) {
    const r = await fetch(BASE + p, { headers });
    ok(r.status === 403, `${p} with ${why} is refused (got ${r.status})`);
  }
  const r = await fetch(BASE + '/staff/notes/run', { method: 'POST', headers });
  ok(r.status === 403, `running the notes with ${why} is refused (got ${r.status})`);
}

/* ---- students to find -------------------------------------------------------- */
const tag = Math.random().toString(36).slice(2, 7);
const reg = async (b) => (await (await fetch(BASE + '/api/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) })).json()).code;
const sync = (b) => fetch(BASE + '/api/sync', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }).then((r) => r.json());

const QUIET = `Quiet ${tag}`, FRESH = `Fresh ${tag}`, NOMAIL = `Nomail ${tag}`, DONE = `Done ${tag}`, SHOUT = `=HYPERLINK("x") ${tag}`;
const quietCode = await reg({ name: QUIET, email: `quiet-${tag}@example.test`, track: 'cert', country: 'MX', lang: 'es' });
await sync({ code: quietCode, progress: [{ course: 'acts', unit: 1 }, { course: 'acts', unit: 2 }], doneCodes: [], lang: 'es' });
await reg({ name: FRESH, email: `fresh-${tag}@example.test`, track: 'mdiv' });
await reg({ name: NOMAIL, track: 'cert' });
const doneCode = await reg({ name: DONE, email: `done-${tag}@example.test`, track: 'cert' });
await sync({ code: doneCode, progress: [{ course: 'acts', unit: 1 }],
  doneCodes: ['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK', 'CTSACTS', 'CTSGENESIS', 'CTSPSALMS', 'CTSMATT', 'CTSROMANS'] });
await reg({ name: 'Course Tester', email: 'tester@chapalaseminary.org', track: 'mdiv' });
await reg({ name: SHOUT, email: `shout-${tag}@example.test`, track: 'thm' });

/* ---- the roster ------------------------------------------------------------ */
{
  const r = await staff('/staff/students');
  const page = await r.text();
  ok(r.status === 200, `the roster opens for a signed-in person (${r.status})`);
  ok(r.headers.get('cache-control') === 'no-store' && /noindex/.test(r.headers.get('x-robots-tag') || ''), 'the roster is never cached or indexed');
  ok(page.includes(QUIET) && page.includes('Acts') && page.includes('Certificate of Ministry'), 'the roster shows a student, their program and last course');
  ok(!page.includes(quietCode) && !page.includes(doneCode), 'the roster never shows a student code');
  ok(!page.includes('Course Tester'), 'the tester placeholder is not on the roster');
  const rows = await (await staff('/staff/students.json')).json();
  const q = rows.find((x) => x.name === QUIET);
  ok(q && q.lang === 'es' && q.country === 'MX' && q.units_passed === 2 && q.status === 'active' && q.program_progress === '0/12',
    'the JSON has language, country, units, status and progress toward the program', JSON.stringify(q));
  const d = rows.find((x) => x.name === DONE);
  ok(d && d.program_progress === '12/12' && d.foundation === '7/7', 'a finished Certificate shows 12/12 and the foundation 7/7', JSON.stringify(d));
  ok(d && d.notices === 12, `and the 12 completion notices the seminary was sent (${d && d.notices})`);
  // confirming an email once wiped this record (worker/api.js, emailConfirm)
  const post = (p, b) => fetch(BASE + p, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }).then((r) => r.json());
  const ch = await post('/api/email/start', { code: doneCode, email: `done-${tag}@example.test` });
  await post('/api/email/confirm', { code: doneCode, verification: ch.devCode });
  const d2 = (await (await staff('/staff/students.json')).json()).find((x) => x.name === DONE);
  ok(d2 && d2.email_verified && d2.notices === 12, `confirming an email keeps the record of notices sent (${d2 && d2.notices})`);
  ok(!JSON.stringify(rows).includes(quietCode), 'the JSON never has a student code');
  const csv = await (await staff('/staff/students.csv')).text();
  ok(/^Name,Email,Country,Language,Program/.test(csv), 'the CSV has a header row');
  ok(csv.includes(`"'=HYPERLINK(""x"") ${tag}"`), 'a name a spreadsheet would run as a formula is defused in the CSV',
    csv.split('\n').find((l) => l.includes('HYPERLINK')));
  ok(!csv.includes(quietCode), 'the CSV never has a student code');
}

/* ---- who gets a note, and when ------------------------------------------------ */
const run = async (days) => (await (await staff(`/staff/notes/run?asOf=${later(days)}`, { method: 'POST' })).json());
const mine = (res) => res.results.filter((x) => x.student.includes(tag));
{
  const none = mine(await run(3));
  ok(!none.length, `three days in, nobody is written to (${none.map((x) => x.student)})`);

  const first = await run(22);
  const got = Object.fromEntries(mine(first).map((x) => [x.student, x]));
  ok(got[QUIET]?.kind === 'quiet' && got[QUIET].status === 'sent', 'three weeks quiet: a note', JSON.stringify(got[QUIET]));
  ok(got[QUIET]?.lang === 'es' && /Estimado\/a Quiet/.test(got[QUIET]?.message?.text || '') && !/Dear /.test(got[QUIET]?.message?.text || ''),
    'in the student\'s language only');
  ok(/Hechos: Curso Intensivo, Unidad 2/.test(got[QUIET]?.message?.text || '') && /CTSActsUnit3\.html/.test(got[QUIET]?.message?.text || ''),
    'naming where they stopped, with a link to the next unit', (got[QUIET]?.message?.text || '').slice(0, 400));
  ok(got[FRESH]?.kind === 'not_started' && got[FRESH]?.lang === 'both' && /Dear Fresh/.test(got[FRESH]?.message?.text || '') && /Estimado\/a Fresh/.test(got[FRESH]?.message?.text || ''),
    'registered and never started: a getting-started note, in both languages when the language is not known');
  ok(!got[NOMAIL], 'no email: no note');
  ok(!got[DONE], 'program finished: no note');
  ok(!got[SHOUT] || got[SHOUT].kind === 'not_started', 'the formula-named student is just a student');
  ok(!first.results.some((x) => x.email === 'tester@chapalaseminary.org'), 'the tester placeholder is never written to');
  ok(/stop-notes\/[A-Za-z0-9_-]{16,}/.test(got[QUIET]?.message?.text || ''), 'every note says how to stop them');

  const again = mine(await run(23));
  ok(!again.some((x) => x.student === QUIET || x.student === FRESH), `one note per quiet spell, one getting-started note (${again.map((x) => x.student)})`);

  // progress again, then quiet again: a new spell, a new note
  await sync({ code: quietCode, progress: [{ course: 'acts', unit: 3, completedAt: later(30) }], doneCodes: [] });
  ok(!mine(await run(40)).some((x) => x.student === QUIET), 'back at work: no note');
  ok(mine(await run(52)).some((x) => x.student === QUIET && x.kind === 'quiet'), 'quiet three weeks again: a second note');

  // the student's own "stop" link: a page with a button, and only the button acts
  const stopUrl = (/stop-notes\/([A-Za-z0-9_-]+)/.exec(got[QUIET].message.text) || [])[1];
  const view = await fetch(`${BASE}/stop-notes/${stopUrl}`);
  ok(view.status === 200 && /<form method="post">/.test(await view.text()), 'the stop link shows a button');
  let rows = await (await staff('/staff/students.json')).json();
  ok(rows.find((x) => x.name === QUIET)?.notes === 'on', 'opening the link alone stops nothing (mail scanners open links)');
  const done = await fetch(`${BASE}/stop-notes/${stopUrl}`, { method: 'POST' });
  ok(done.status === 200 && /Done/.test(await done.text()), 'pressing the button stops the notes');
  rows = await (await staff('/staff/students.json')).json();
  ok(rows.find((x) => x.name === QUIET)?.notes === 'stopped', 'and the roster shows it');
  await sync({ code: quietCode, progress: [{ course: 'acts', unit: 4, completedAt: later(60) }], doneCodes: [] });
  ok(!mine(await run(90)).some((x) => x.student === QUIET), 'a student who asked not to be written to is not');
  // deleting the record takes the notes and the stop link with it
  const gone = await fetch(`${BASE}/api/student/${quietCode}`, { method: 'DELETE' });
  ok(gone.status === 200, `the student can delete their record (${gone.status})`);
  const after = await fetch(`${BASE}/stop-notes/${stopUrl}`);
  ok(/not recognised/.test(await after.text()), 'and their stop link no longer finds anything');
  rows = await (await staff('/staff/students.json')).json();
  ok(!rows.some((x) => x.name === QUIET), 'and they are off the roster');
  const unknown = await fetch(`${BASE}/stop-notes/not-a-real-token-at-all`, { method: 'POST' });
  ok(/not recognised/.test(await unknown.text()), 'an unknown stop link says so and changes nothing');

  // staff can stop and resume notes for one student; not from another site
  const n = rows.find((x) => x.name === SHOUT).n;
  const cross = await staff(`/staff/students/${n}/notes`, { method: 'POST', headers: { origin: 'https://evil.example', 'content-type': 'application/x-www-form-urlencoded' }, body: 'stop=1' });
  ok(cross.status === 403, `a stop posted from another site is refused (${cross.status})`);
  const stop = await staff(`/staff/students/${n}/notes`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'stop=1' });
  ok(stop.status === 303, `staff stop returns to the roster (${stop.status})`);
  rows = await (await staff('/staff/students.json')).json();
  ok(rows.find((x) => x.name === SHOUT)?.notes === 'stopped', 'staff stopped notes for one student');
  await staff(`/staff/students/${n}/notes`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'stop=0' });
  rows = await (await staff('/staff/students.json')).json();
  ok(rows.find((x) => x.name === SHOUT)?.notes === 'on', 'and resumed them');
}

/* ---- the weekly summary and the notes page ------------------------------------ */
{
  const d = await (await staff(`/staff/digest?asOf=${later(28)}`, { method: 'POST' })).json();
  ok(/NOTES SENT TO STUDENTS/.test(d.text) && d.text.includes(FRESH) && /not started after a week/.test(d.text), 'the weekly summary lists the notes sent', d.text.slice(0, 300));
  ok(!d.text.includes('Course Tester') && !d.text.includes(quietCode), 'and never the tester placeholder or a student code');
  const now = await (await staff('/staff/digest', { method: 'POST' })).json();
  ok(/NEW STUDENTS/.test(now.text) && now.text.includes(NOMAIL), 'it lists the week\'s new students');
  const p = await (await staff('/staff/notes')).text();
  ok(/Estimado\/a/.test(p) && /Dear /.test(p) && /Sending is ON/.test(p), 'the notes page shows both notes in both languages, and whether sending is on');
}

console.log(`${checks} assertions on the student tracker and the notes to students`);
if (!fails.length) console.log('PASS — the roster is for staff only, and students are written to when, and only when, they should be.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach((f) => console.log('  ' + f)); process.exitCode = 1; }
