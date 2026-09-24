// The browser half: does cts-sync.js actually carry a student's progress from
// one device to another, and is it as harmless as it claims when the API is
// not there?
//
//   wrangler dev --config test/wrangler.local.jsonc --port 8798 ...
//   node test/sync.test.mjs

import { chromium } from 'playwright';

const BASE = process.env.SYNC_BASE || 'http://127.0.0.1:8798';
// Playwright's own download by default; CHROME_PATH pins a prebuilt binary.
const CHROME = process.env.CHROME_PATH;

let checks = 0; const fails = [];
const ok = (c, label, detail) => { checks++; if (!c) fails.push(label + (detail ? `\n        ${detail}` : '')); };

const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});

// Each context is a separate device: its own localStorage, its own everything.
async function device(page_ = 'synctest.html') {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${BASE}/${page_}`, { waitUntil: 'load' });
  return { ctx, page, errors };
}
const seed = (page, student, units, done = [], mdivDone = [], names = []) => page.evaluate(([s, u, d, m, nm]) => {
  localStorage.setItem('cts_student', JSON.stringify(s));
  localStorage.setItem('cts_track', s.track);
  localStorage.setItem('cts_done_codes', JSON.stringify(d));
  if (m.length) localStorage.setItem('cts_mdiv_done_codes', JSON.stringify(m));
  if (nm.length) localStorage.setItem('cts_degree_courses', JSON.stringify(nm));
  u.forEach(([c, n]) => localStorage.setItem(`cts_${c}_u${n}_mc_passed`, '1'));
}, [student, units, done, mdivDone, names]);
const sync = page => page.evaluate(() => window.CTS_SYNC.sync());
const snap = page => page.evaluate(() => ({
  code: window.CTS_SYNC.code(),
  units: window.CTS_SYNC.snapshot().progress.map(p => `${p.course}:${p.unit}`).sort(),
  done: window.CTS_SYNC.snapshot().doneCodes.slice().sort(),
  name: (JSON.parse(localStorage.getItem('cts_student') || '{}')).name,
  heard: (JSON.parse(localStorage.getItem('cts_student') || '{}')).heard,
  mdivDone: JSON.parse(localStorage.getItem('cts_mdiv_done_codes') || '[]').sort(),
  names: JSON.parse(localStorage.getItem('cts_degree_courses') || '[]').sort(),
}));

/* ---- device one: an existing student, part-way through ------------------- */

const one = await device();
// Ana finished Old Testament Survey on the certificate track and then moved
// to the M.Div. and finished Romans there: two completions, two tracks, and
// the name roster the degree pages count.
await seed(one.page, { name: 'Ana Ruiz', email: 'ana@example.org', country: 'MX', track: 'mdiv', heard: 'church' },
  [['1peter', 1], ['1peter', 2], ['romans', 1]], ['CTSOTS', 'CTSROMANS'], ['CTSROMANS'], ['Old Testament Survey', 'Romans |']);
await sync(one.page);
const a = await snap(one.page);
ok(/^CTS-/.test(a.code || ''), 'an existing student is given a code without being asked', `got ${a.code}`);
ok(a.units.length === 3, `their existing progress is picked up, got ${a.units.join(' ')}`);
ok(one.errors.length === 0, `no page errors: ${one.errors.join(' | ')}`);

// A unit passed after the first sync reaches the server on the next one.
await one.page.evaluate(() => localStorage.setItem('cts_romans_u2_mc_passed', '1'));
await sync(one.page);

/* ---- device two: the same student, a different browser ------------------- */

const two = await device();
const before = await snap(two.page);
ok(before.units.length === 0 && !before.code, 'the second device starts empty');

const restored = await two.page.evaluate(c => window.CTS_SYNC.restore(c), a.code);
ok(restored.ok === true, `restoring from the code succeeds, got ${JSON.stringify(restored)}`);
const b = await snap(two.page);
ok(b.units.join(' ') === '1peter:1 1peter:2 romans:1 romans:2',
  `every passed unit came back, got "${b.units.join(' ')}"`);
ok(b.done.join(',') === 'CTSOTS,CTSROMANS', `course completions came back, got ${b.done}`);
ok(b.name === 'Ana Ruiz', 'and so did their name');
ok(b.heard === 'church', `and how they heard of the seminary, got ${b.heard}`);
ok(b.mdivDone.join(',') === 'CTSROMANS', `the master's-track list came back with only the course earned there, got ${b.mdivDone}`);
ok(b.names.join('|') === 'Old Testament Survey|Romans |', `the course-name roster the degree pages count came back, got ${JSON.stringify(b.names)}`);
ok(b.code === a.code, 'the second device now holds the same student code');

// The restored device must also be able to see the progress grid, which the
// engine reads from cts_<course>_progress rather than the mc_passed flags.
const grid = await two.page.evaluate(() => JSON.parse(localStorage.getItem('cts_1peter_progress') || '{}'));
ok(grid.unit1 === true && grid.unit2 === true, 'the progress map the engine reads is written too');

/* ---- restoring must never cost the device anything it already had -------- */

const three = await device();
await seed(three.page, { name: 'Ana Ruiz', track: 'cert' }, [['galatians', 7]]);
await three.page.evaluate(c => window.CTS_SYNC.restore(c), a.code);
const c3 = await snap(three.page);
ok(c3.units.includes('galatians:7'), 'local progress the server had never seen is still there');
ok(c3.units.includes('1peter:1'), 'and the server\'s progress was added alongside it');

// ...and that local-only unit reaches the server on the next sync.
await sync(three.page);
const four = await device();
await four.page.evaluate(c => window.CTS_SYNC.restore(c), a.code);
ok((await snap(four.page)).units.includes('galatians:7'), 'which then reaches every other device');

/* ---- a wrong code, and an API that is not there -------------------------- */

const five = await device();
const bad = await five.page.evaluate(() => window.CTS_SYNC.restore('CTS-0000-0000-0002'));
ok(bad.ok === false, 'a wrong code is reported as not found');
ok((await snap(five.page)).units.length === 0, 'and changes nothing on the device');

// With no API deployed the script must be dormant, not merely tolerant: one
// probe per tab, then silence. Otherwise every page view on the live site
// would fire a failing request before the database exists.
const down = await device('syncdown.html');
const attempted = [];
down.page.on('request', r => { if (/\/api\//.test(r.url())) attempted.push(r.url()); });
await seed(down.page, { name: 'Offline Student', track: 'cert' }, [['1peter', 1]]);
const r = await sync(down.page);
await down.page.waitForTimeout(500);
ok(r === null, 'with the API unreachable, a sync simply returns nothing');
ok(down.errors.length === 0, `and raises no page errors: ${down.errors.join(' | ')}`);
const d = await snap(down.page);
ok(d.units.join(' ') === '1peter:1' && !d.code,
  'the student\'s own progress is untouched and no code is invented');
await sync(down.page); await sync(down.page);
await down.page.waitForTimeout(300);
const probes = attempted;
ok(probes.length === 1 && /\/api\/health$/.test(probes[0]),
  'with no API deployed it probes once and then stays quiet',
  `requests: ${probes.join(' ') || '(none)'}`);

/* ---- deleting a record --------------------------------------------------- */

const doneBefore = await one.page.evaluate(() => localStorage.getItem('cts_done_codes'));
const gone = await one.page.evaluate(() => window.CTS_SYNC.forget());
ok(gone.ok === true, 'a student can delete their record');
const after = await device();
ok((await after.page.evaluate(c => window.CTS_SYNC.restore(c), a.code)).ok === false,
  'and it is really gone');

/* The code used to stay in the browser after the record was deleted, which
   made the delete a lie twice over: the device still held the student's code
   after they had asked to be forgotten, and every poll from then on posted it
   to an endpoint that answered 404. */
ok(await one.page.evaluate(() => window.CTS_SYNC.code()) === null,
  'the student code is gone from the browser too, not just from the seminary');

/* And it does not come back. push() registers a new student when there is no
   code, so a delete that left the code behind would keep 404ing, while one
   that cleared it must not quietly register the same person again. */
await sync(one.page); await sync(one.page);
await one.page.waitForTimeout(300);
ok(await one.page.evaluate(() => window.CTS_SYNC.code()) === null,
  'and syncing afterwards does not silently register them again');

/* Deleting the seminary's copy is not the same request as erasing the work on
   this device, and must not be treated as one. */
ok(await one.page.evaluate(() => localStorage.getItem('cts_done_codes')) === doneBefore,
  'the progress saved in this browser is left exactly as it was');

/* An opt-out with no way out is not a choice. */
ok(await one.page.evaluate(() => window.CTS_SYNC.optedOut()) === true,
  'the browser reports that it is holding back from the seminary');
await one.page.evaluate(() => window.CTS_SYNC.rejoin());
ok(await one.page.evaluate(() => window.CTS_SYNC.optedOut()) === false,
  'and a student who changes their mind can take part again');
await sync(one.page);
await one.page.waitForTimeout(300);
const rejoined = await one.page.evaluate(() => window.CTS_SYNC.code());
ok(typeof rejoined === 'string' && rejoined.length > 0 && rejoined !== a.code,
  'after rejoining they are registered afresh, with a new code',
  `code after rejoining: ${rejoined}`);

await browser.close();
console.log(`${checks} browser assertions against the Worker and D1`);
if (!fails.length) console.log('PASS — progress survives moving to another browser.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach(f => console.log('  ' + f)); process.exitCode = 1; }
