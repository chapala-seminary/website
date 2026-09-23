/* The page that lets a student see and delete what is held about them.
 *
 * WHY THIS IS CHECKED IN A BROWSER
 *
 * A privacy page whose delete button does not work is worse than no page at
 * all: it tells someone their details are gone when they are not. Every way
 * that can happen is silent -- a renamed endpoint, a client that clears the
 * server's copy but leaves the code behind so the next sync registers the same
 * person again, a section that stays hidden because the API probe was cached.
 * None of it shows up in a build. So this drives the real page against a real
 * Worker and a real database, and asks afterwards whether the record is
 * actually gone.
 *
 *   node tools/verify-privacy.mjs http://127.0.0.1:8795
 *
 * It also refuses to let the page ship with a placeholder contact address,
 * because the one thing a student is told to do when the buttons fail them is
 * write to a person.
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8795';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });

let failed = 0;
const ok = (cond, what, detail) => {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'}  ${what}`);
  if (!cond) { failed++; if (detail) console.log(`        ${detail}`); }
};

const visible = (page, id) => page.evaluate(
  (i) => { const el = document.getElementById(i); return !!el && el.offsetParent !== null; }, id);

/* A student who has registered and passed something, made the way a student
   makes one: through the page, not through the API. */
async function studentDevice() {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${BASE}/synctest.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  /* Seeded the way the site itself writes progress: one key per passed unit.
     Inventing a shape here would test a shape nothing produces. */
  await page.evaluate(() => {
    localStorage.setItem('cts_student', JSON.stringify({
      name: 'Privacy Test Student', email: 'privacy@example.test', country: 'MX', track: 'cert',
    }));
    localStorage.setItem('cts_track', 'cert');
    localStorage.setItem('cts_acts_u1_mc_passed', '1');
    localStorage.setItem('cts_acts_u2_mc_passed', '1');
    localStorage.setItem('cts_done_codes', JSON.stringify(['CTSOTS']));
  });
  await page.evaluate(() => window.CTS_SYNC.sync());
  await page.waitForTimeout(700);
  const code = await page.evaluate(() => window.CTS_SYNC.code());
  return { ctx, page, code };
}

const a = await studentDevice();
ok(typeof a.code === 'string' && a.code.length > 0,
  'a registered student has a record to look at', `code: ${a.code}`);

/* ---- the page, with a record ------------------------------------------- */
const errors = [];
a.page.on('pageerror', (e) => errors.push(e.message));
a.page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await a.page.goto(`${BASE}/CTSPrivacy.html`, { waitUntil: 'domcontentloaded' });
await a.page.waitForTimeout(1200);

ok(await visible(a.page, 'see-card'), 'a student with a record is shown what is held');
ok(await visible(a.page, 'delete-card'), 'and is offered a way to delete it');
ok(!(await visible(a.page, 'no-api')), 'and is not told the seminary holds nothing');
ok(await a.page.textContent('#code-value') === a.code,
  'their own student code is shown, not someone else\'s');

await a.page.click('#show-held');
await a.page.waitForTimeout(500);
const held = await a.page.textContent('#held');
ok(/Privacy Test Student/.test(held), 'the record it shows is the one actually stored', held?.slice(0, 120));
ok(/privacy@example\.test/.test(held), 'including the email address, which is the point');
ok(/(^|\D)2(\D|$)/.test(held), 'and how many units are recorded',
  `what the page showed: ${String(held).replace(/\s+/g, ' ').slice(0, 160)}`);

/* ---- the delete --------------------------------------------------------- */
await a.page.click('#delete-btn');                 // arms
await a.page.waitForTimeout(150);
const stillThere = await (await fetch(`${BASE}/api/student/${encodeURIComponent(a.code)}`)).ok;
ok(stillThere, 'one press does not delete anything — a mis-tap costs nothing');

await a.page.click('#delete-btn');                 // confirms
await a.page.waitForTimeout(900);

const after = await fetch(`${BASE}/api/student/${encodeURIComponent(a.code)}`);
ok(after.status === 404, 'pressing again really removes the record from the seminary',
  `GET /api/student/<code> returned ${after.status}`);
ok(await a.page.evaluate(() => window.CTS_SYNC.code()) === null,
  'and the student code is cleared from the browser with it');
ok(await a.page.evaluate(() => localStorage.getItem('cts_done_codes')) !== null,
  'while the work saved on this device is left alone, as the page promises');

/* The failure that makes the whole page a lie: the record comes back by
   itself, because the name is still in this browser and nothing was told to
   stop. */
await a.page.evaluate(() => window.CTS_SYNC.sync());
await a.page.waitForTimeout(700);
ok(await a.page.evaluate(() => window.CTS_SYNC.code()) === null,
  'and syncing afterwards does not quietly register the same person again');

await a.page.reload({ waitUntil: 'domcontentloaded' });
await a.page.waitForTimeout(1200);
ok(await visible(a.page, 'rejoin-card'),
  'on the next visit the page says this browser is sending nothing');
ok(!(await visible(a.page, 'delete-card')),
  'and does not offer to delete a record that no longer exists');

await a.page.click('#rejoin-btn');
await a.page.waitForTimeout(400);
ok(await a.page.evaluate(() => window.CTS_SYNC.optedOut()) === false,
  'a student who changes their mind can take part again');

/* ---- the page, with nothing to show -------------------------------------- */
const fresh = await browser.newContext();
const f = await fresh.newPage();
/* Not networkidle: the sync client polls on a timer, so the network never
   goes quiet and the wait times out on a page that loaded perfectly. */
await f.goto(`${BASE}/CTSPrivacy.html`, { waitUntil: 'domcontentloaded' });
await f.waitForTimeout(1200);
ok(!(await visible(f, 'see-card')) && !(await visible(f, 'delete-card')),
  'a visitor with no record is offered neither a record nor a delete');

/* ---- both languages ------------------------------------------------------ */
/* The site has shipped a dead Spanish control before, on 409 pages. */
await f.click('#btn-es');
await f.waitForTimeout(200);
const es = await f.evaluate(() => document.body.innerText);
ok(/Su informaci/i.test(es) && !/What is kept, and where/.test(es),
  'the Spanish control switches the page, and the English goes away');
ok(await f.evaluate(() => document.documentElement.lang) === 'es',
  'and the document says it is in Spanish, for a screen reader');

/* ---- what a student is told to do when all else fails -------------------- */
const contact = await f.getAttribute('#contact', 'href');
ok(!!contact && !/example\.(invalid|com|test)|CONTACT@/i.test(contact),
  'the contact address is a real one, not the placeholder',
  `found: ${contact} — set a real address before this page reaches a student`);

ok(errors.length === 0, 'no console errors on the page', errors.slice(0, 3).join(' | '));

await browser.close();
console.log(`\n${failed ? 'FAIL' : 'PASS'} — the page that shows a student their record and deletes it`
  + (failed ? `: ${failed} problem(s)` : ' does both.'));
process.exitCode = failed ? 1 : 0;
