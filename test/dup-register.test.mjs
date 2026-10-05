// Registering twice (Wayne, 5 Oct 2026: six students had two records).
//
// A second registration under a name and email that already have a live
// record makes no record; the page offers the code by email instead -- sent
// to that address, never to the page -- and "not me" registers separately.
// Same email, different name registers as before: two people can share an
// address. "Email me my code" answers the same whether or not the address has
// a record, and is throttled.
//
// The API first, then the front page and the Save & Restore page in a browser,
// as a student would use them.
//
//   API_BASE=... DEV_LOG=<wrangler dev log> node test/dup-register.test.mjs
import crypto from 'node:crypto';
import fs from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.API_BASE || 'http://127.0.0.1:8798';
const LOG = process.env.DEV_LOG;
const CHROME = process.env.CHROME_PATH;
let checks = 0;
const fails = [];
const ok = (c, label, detail) => { checks++; if (!c) fails.push(label + (detail ? `\n        ${detail}` : '')); };
const jpost = async (p, b) => {
  const r = await fetch(BASE + p, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) });
  return { status: r.status, body: await r.json().catch(() => null) };
};
const tag = () => crypto.randomBytes(4).toString('hex');
const logged = () => (LOG && fs.existsSync(LOG) ? fs.readFileSync(LOG, 'utf8') : '');
const sentTo = (addr) => logged().split('\n').filter((l) => l.includes('email (log mode):') && l.includes(addr) && /student code/i.test(l)).length;
const settle = () => new Promise((r) => setTimeout(r, 400));

/* ---- the API ------------------------------------------------------------- */
const t = tag();
const email = `dup-${t}@example.org`;
const first = await jpost('/api/register', { name: `Ana ${t}`, email, track: 'cert' });
ok(first.status === 201 && first.body?.code, 'the first registration makes a record', JSON.stringify(first));

const again = await jpost('/api/register', { name: `  ana ${t.toUpperCase()} `.toLowerCase(), email: ` DUP-${t}@Example.org `, track: 'thm' });
ok(again.status === 409 && again.body?.existing === true, 'the same name and email again is paused (case and spaces ignored)', JSON.stringify(again));
ok(!again.body?.code && !JSON.stringify(again.body).includes(first.body?.code), 'and the answer carries no code');

const household = await jpost('/api/register', { name: `Ben ${t}`, email, track: 'cert' });
ok(household.status === 201, 'the same email with a different name registers: two people may share an address');

const separate = await jpost('/api/register', { name: `Ana ${t}`, email, track: 'cert', separate: true });
ok(separate.status === 201 && separate.body?.code !== first.body?.code, '"not me" registers separately');

for (const blank of ['', '—'])
  for (let i = 0; i < 2; i++)
    ok((await jpost('/api/register', { name: `Nadie ${t}`, email: blank, track: 'cert' })).status === 201,
      `no email ("${blank}") is never matched`);

// Email me my code
ok((await jpost('/api/code/email', { email: 'not-an-address' })).status === 400, 'a malformed address is refused');
const known = await jpost('/api/code/email', { email: email.toUpperCase() });
const unknown = await jpost('/api/code/email', { email: `nobody-${t}@example.org` });
ok(known.status === 200 && unknown.status === 200 && JSON.stringify(known.body) === JSON.stringify(unknown.body),
  'the answer is the same whether or not the address has a record', `${JSON.stringify(known)} / ${JSON.stringify(unknown)}`);
if (LOG) {
  await settle();
  ok(sentTo(email) === 1, 'the code is emailed to the address with a record', `${sentTo(email)} sends logged`);
  ok(sentTo(`nobody-${t}@example.org`) === 0, 'and nothing is sent to an address without one');
}
await jpost('/api/code/email', { email });
await jpost('/api/code/email', { email });
const fourth = await jpost('/api/code/email', { email });
ok(fourth.status === 429, 'a fourth request for one address in a day is refused', `got ${fourth.status}`);

/* ---- the student's way through, in a browser ------------------------------ */
const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
async function frontPage() {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  return { ctx, page, errors };
}
async function register(page, name, mail) {
  await page.selectOption('#reg-country', { index: 1 });
  await page.fill('#reg-name', name);
  await page.fill('#reg-email', mail);
  await page.click('#reg-save');
}
const visible = (page, id) => page.evaluate((i) => { const e = document.getElementById(i); return !!e && e.offsetParent !== null; }, id);

const u = tag();
const who = { name: `Carmen ${u}`, mail: `carmen-${u}@example.org` };

const one = await frontPage();
await register(one.page, who.name, who.mail);
await one.page.waitForFunction(() => document.getElementById('reg-code').style.display === 'block', null, { timeout: 15000 }).catch(() => {});
const CODE = await one.page.evaluate(() => window.CTS_SYNC.code());
ok(!!CODE && !(await visible(one.page, 'reg-existing')), 'a first registration gets its code, with no pause');

const two = await frontPage();
await register(two.page, who.name, who.mail);
await two.page.waitForFunction(() => document.getElementById('reg-existing').style.display === 'block', null, { timeout: 15000 }).catch(() => {});
ok(await visible(two.page, 'reg-existing'), 'a second browser, same name and email: the page says a record exists');
ok(!(await visible(two.page, 'reg-code')) && !(await two.page.evaluate(() => window.CTS_SYNC.code())), 'and no code is issued or shown');
ok((await two.page.textContent('#reg-existing-to')) === who.mail, 'it names the address the code would go to');
await two.page.waitForTimeout(6000);   // a poll or more: the pause must not turn into a retry loop
ok(!(await two.page.evaluate(() => window.CTS_SYNC.code())), 'polling does not register it anyway');

await two.page.click('#reg-existing-email');
await two.page.waitForFunction(() => /Sent|Enviado/.test(document.getElementById('reg-existing-sent').textContent), null, { timeout: 10000 }).catch(() => {});
ok(/Sent|Enviado/.test(await two.page.textContent('#reg-existing-sent')), '"Email me my code" says it was sent');
if (LOG) { await settle(); ok(sentTo(who.mail) === 1, 'and the code went to that address'); }

await two.page.fill('#reg-existing-code', CODE.toLowerCase());
await two.page.click('#reg-existing-restore');
await two.page.waitForFunction(() => document.getElementById('reg-code').style.display === 'block', null, { timeout: 15000 }).catch(() => {});
ok((await two.page.evaluate(() => window.CTS_SYNC.code())) === CODE, 'the code from the email continues the one record on this browser');
ok(!(await visible(two.page, 'reg-existing')), 'and the pause is gone');
ok(two.errors.length === 0, `no page errors: ${two.errors.slice(0, 2).join(' | ')}`);

const three = await frontPage();
await register(three.page, who.name, who.mail);
await three.page.waitForFunction(() => document.getElementById('reg-existing').style.display === 'block', null, { timeout: 15000 }).catch(() => {});
await three.page.click('#reg-existing-separate');
await three.page.waitForFunction(() => !!(window.CTS_SYNC && window.CTS_SYNC.code()), null, { timeout: 15000 }).catch(() => {});
const other = await three.page.evaluate(() => window.CTS_SYNC.code());
ok(!!other && other !== CODE, '"Register separately" gives this person a record of their own');

// Save & Restore: "Lost your code?" for anyone, and the pause carried there.
const four = await frontPage();
await register(four.page, who.name, who.mail);
await four.page.waitForFunction(() => document.getElementById('reg-existing').style.display === 'block', null, { timeout: 15000 }).catch(() => {});
await four.page.goto(`${BASE}/cts-backup.html`, { waitUntil: 'load' });
await four.page.waitForFunction(() => document.getElementById('code-card').style.display === 'block', null, { timeout: 15000 }).catch(() => {});
ok(await visible(four.page, 'code-none-existing'), 'Save & Restore explains the pause too');
ok((await four.page.inputValue('#forgot-email')) === who.mail, 'with the address filled in');
await four.page.click('#forgot-send');
await four.page.waitForFunction(() => /on the way|en camino/.test(document.getElementById('forgot-note').textContent), null, { timeout: 10000 }).catch(() => {});
ok(/on the way|en camino/.test(await four.page.textContent('#forgot-note')), '"Lost your code?" sends it');

// A unit page has no place for the choice: one line points to where it is.
await four.page.goto(`${BASE}/CTSSTUnit1.html`, { waitUntil: 'load' });
await four.page.waitForFunction(() => !!document.getElementById('cts-existing-note'), null, { timeout: 15000 }).catch(() => {});
ok(await four.page.evaluate(() => !!document.querySelector('#cts-existing-note a[href="/cts-backup.html"]')),
  'a unit page points a paused student to Save & Restore');

for (const d of [one, two, three, four]) await d.ctx.close();
await browser.close();

console.log(`${checks} checks on registering twice`);
if (fails.length) { console.log('FAIL\n  ' + fails.join('\n  ')); process.exit(1); }
console.log('PASS — one record per student, and the way back to it goes by email.');
