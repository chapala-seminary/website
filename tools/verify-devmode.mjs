/* Course-tester mode: can staff review every course without finishing the
 * foundation first, and does turning it on ever cost a real student anything?
 *
 * The mechanism is in public/cts-curriculum.js and predates the migration.
 * Nothing checked it. Every other gate on this site is mutation-tested; this
 * one was a feature people relied on and nobody verified, which is the state
 * a feature is in just before it quietly stops working. The design change in
 * particular moves the catalog, the lock overlay and the tester bar, any of
 * which could have broken it without a student ever noticing -- because the
 * only person who would notice is the one reviewing the courses.
 *
 * The last assertion is the one that matters most: a registered student who
 * turns tester mode on must keep every unit they have passed. The code goes
 * out of its way to protect that, so something has to hold it to it.
 *
 *   node tools/verify-devmode.mjs http://127.0.0.1:8798
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const CHROME = process.env.CHROME_PATH;
const LOCKED_COURSE = 'CTSActsUnit1.html';   // locked until the foundation is done
const CORE = ['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK'];

const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const fails = [];
let checks = 0;
const ok = (c, label, detail) => {
  checks++;
  if (!c) fails.push(label + (detail ? `\n        ${detail}` : ''));
};

/* One tab, kept open across several navigations, because persistence across
   pages is half of what is being tested: the flag is set by a query parameter
   on one page and has to still be on for the next. */
async function session(steps) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(`${BASE}/index.html`, { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());
  const out = [];
  for (const step of steps) {
    await page.goto(`${BASE}/${step}`, { waitUntil: 'load' });
    await page.waitForTimeout(900);          // prepTesterEnv reloads once
    out.push(await page.evaluate(() => {
      const cards = [...document.querySelectorAll('a.course')];
      const s = (() => { try { return JSON.parse(localStorage.getItem('cts_student') || 'null'); } catch { return null; } })();
      return {
        cards: cards.length,
        locked: cards.filter((a) => /cts-locked/.test(a.className)).length,
        overlay: !!document.getElementById('cts-lock-overlay'),
        bar: !!document.getElementById('cts-test-bar'),
        barText: (document.getElementById('cts-test-bar') || {}).textContent || '',
        flag: localStorage.getItem('cts_test_mode'),
        tester: !!(s && s._tester),
        name: s && s.name,
        passed: Object.keys(localStorage).filter((k) => /_passed$/.test(k)).sort(),
      };
    }));
  }
  await ctx.close();
  return { out, errs };
}

/* 1. Off by default. If this ever reads 0 locked, tester mode is not the
      thing being tested any more -- the catalog is simply open. */
{
  const { out: [i], errs } = await session(['index.html']);
  ok(i.cards > 0, 'catalog: no course cards rendered — the checks below would pass vacuously');
  ok(i.locked > 0, `catalog with no progress: ${i.locked}/${i.cards} locked, expected some`);
  ok(!i.bar, 'catalog with no progress: the tester bar is showing when tester mode is off');
  ok(!errs.length, 'catalog with no progress: page error', errs[0]);
}

/* 2. ?ctstest=on opens the catalog, and stays on for the next page without
      the parameter -- which is how it is actually used: set it once, then
      click around. */
{
  const { out: [on, next], errs } =
    await session(['index.html?ctstest=on', LOCKED_COURSE]);
  ok(on.flag === '1', 'ctstest=on: the flag was not stored');
  ok(on.locked === 0, `ctstest=on: ${on.locked} course(s) still locked`);
  ok(on.bar, 'ctstest=on: no tester bar, so there is no visible way back out');
  ok(on.tester, 'ctstest=on: no placeholder student seeded — exams will refuse to grade');
  // the placeholder is graded as M.Div.; the bar has to say so, or a reviewer
  // meets master's rules believing they are a Certificate student
  ok(/graded as M\.Div\./.test(on.barText), `ctstest=on: the tester bar does not name the graded track — "${on.barText.slice(0, 80)}"`);
  ok(!next.overlay, `${LOCKED_COURSE} after ctstest=on elsewhere: still covered by the lock overlay`);
  ok(next.bar, `${LOCKED_COURSE}: tester mode did not carry across pages`);
  ok(!errs.length, 'ctstest=on: page error', errs[0]);
}

/* 3. And on a locked course page directly, which is where someone reviewing a
      specific course would put it. */
{
  const { out: [u] } = await session([`${LOCKED_COURSE}?ctstest=on`]);
  ok(!u.overlay, `${LOCKED_COURSE}?ctstest=on: still covered by the lock overlay`);
  ok(u.bar, `${LOCKED_COURSE}?ctstest=on: no tester bar`);
}

/* 4. Off again, and the placeholder student goes with it. A tester account
      left behind would show a student someone else's name. */
{
  const { out: [, off] } = await session(['index.html?ctstest=on', 'index.html?ctstest=off']);
  ok(off.flag === null, 'ctstest=off: the flag is still set');
  ok(off.locked > 0, `ctstest=off: ${off.locked} locked, the catalog stayed open`);
  ok(!off.bar, 'ctstest=off: the tester bar is still showing');
  ok(!off.tester, 'ctstest=off: the placeholder tester account was left behind');
}

/* 5. The one that matters. A real student turns tester mode on -- to look at a
      course they have not unlocked -- and must not lose a single unit they
      have passed. cts-curriculum.js wipes per-unit state to make exams
      re-gradable for the placeholder tester; it must recognise a real student
      and leave them alone. */
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${BASE}/index.html`, { waitUntil: 'load' });
  await page.evaluate((core) => {
    localStorage.clear();
    localStorage.setItem('cts_student', JSON.stringify({ name: 'Real Student', track: 'mdiv' }));
    localStorage.setItem('cts_track', 'mdiv');
    localStorage.setItem('cts_done_codes', JSON.stringify(core.slice(0, 2)));
    localStorage.setItem('cts_ots_u1_mc_passed', '1');
    localStorage.setItem('cts_ots_progress', JSON.stringify({ unit1: true, unit2: true }));
  }, CORE);
  await page.goto(`${BASE}/index.html?ctstest=on`, { waitUntil: 'load' });
  await page.waitForTimeout(900);
  const after = await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('cts_student') || 'null');
    return {
      name: s && s.name,
      tester: !!(s && s._tester),
      passed: localStorage.getItem('cts_ots_u1_mc_passed'),
      progress: localStorage.getItem('cts_ots_progress'),
      done: localStorage.getItem('cts_done_codes'),
      locked: [...document.querySelectorAll('a.course')].filter((a) => /cts-locked/.test(a.className)).length,
    };
  });
  await ctx.close();
  ok(after.name === 'Real Student', `tester mode overwrote a registered student (now "${after.name}")`);
  ok(!after.tester, 'tester mode turned a real student into the placeholder tester account');
  ok(after.passed === '1', 'tester mode erased a unit the student had passed');
  ok(after.progress && /unit2/.test(after.progress), 'tester mode erased a real student\'s course progress');
  ok(after.done && after.done.includes(CORE[0]), 'tester mode erased a real student\'s completed courses');
  ok(after.locked === 0, 'tester mode did not open the catalog for a registered student');
}

await browser.close();

console.log(`${checks} course-tester assertions`);
if (!fails.length) {
  console.log('PASS — ?ctstest=on opens every course, persists, turns off again, ' +
              'and costs a registered student nothing.');
} else {
  console.log(`FAIL — ${fails.length}:`);
  fails.forEach((f) => console.log('  ' + f));
  process.exit(1);
}
