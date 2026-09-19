// The browser half: does cts-sync.js actually carry a student's progress from
// one device to another, and is it as harmless as it claims when the API is
// not there?
//
//   wrangler pages dev public --port 8798 --d1 DB=chapala-students ...
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
const seed = (page, student, units, done = []) => page.evaluate(([s, u, d]) => {
  localStorage.setItem('cts_student', JSON.stringify(s));
  localStorage.setItem('cts_track', s.track);
  localStorage.setItem('cts_done_codes', JSON.stringify(d));
  u.forEach(([c, n]) => localStorage.setItem(`cts_${c}_u${n}_mc_passed`, '1'));
}, [student, units, done]);
const sync = page => page.evaluate(() => window.CTS_SYNC.sync());
const snap = page => page.evaluate(() => ({
  code: window.CTS_SYNC.code(),
  units: window.CTS_SYNC.snapshot().progress.map(p => `${p.course}:${p.unit}`).sort(),
  done: window.CTS_SYNC.snapshot().doneCodes.slice().sort(),
  name: (JSON.parse(localStorage.getItem('cts_student') || '{}')).name,
}));

/* ---- device one: an existing student, part-way through ------------------- */

const one = await device();
await seed(one.page, { name: 'Ana Ruiz', email: 'ana@example.org', country: 'MX', track: 'cert' },
  [['1peter', 1], ['1peter', 2], ['romans', 1]], ['CTSOTS']);
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
ok(b.done.join(',') === 'CTSOTS', `course completions came back, got ${b.done}`);
ok(b.name === 'Ana Ruiz', 'and so did their name');
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

const gone = await one.page.evaluate(() => window.CTS_SYNC.forget());
ok(gone.ok === true, 'a student can delete their record');
const after = await device();
ok((await after.page.evaluate(c => window.CTS_SYNC.restore(c), a.code)).ok === false,
  'and it is really gone');

await browser.close();
console.log(`${checks} browser assertions against the Worker and D1`);
if (!fails.length) console.log('PASS — progress survives moving to another browser.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach(f => console.log('  ' + f)); process.exitCode = 1; }
