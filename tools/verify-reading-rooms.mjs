/* The reading rooms in a browser (Dr. Cook's Add-ons, 4 Oct 2026):
 *
 *   node tools/verify-reading-rooms.mjs <base-url>      # run by npm test
 *
 * tools/reading-rooms.mjs --check holds the files to the data; this checks
 * the page does what a student needs, in each family of room:
 *   - the five digests and their "select" boxes are still there, the shelf
 *     is below them with the works the data says, and offers no selection;
 *   - in a room given the attestation (the second family): three chosen,
 *     a name and the oath record the reading under cts_honors_v1:<Code>,
 *     the code the certificate PDF reads (cts-cert-pdf.js), with the three
 *     titles; fewer than three, or no name, records nothing and says why;
 *     on the next visit the page says it is recorded;
 *   - in a room that had it (the first family) it still records;
 *   - the World Religions Required Readings page stands beside the room,
 *     names its test, and the test page leads back;
 *   - no page errors.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const CHROME = process.env.CHROME_PATH;
const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const fails = [];
let checks = 0;
const ok = (c, m, d) => { checks++; if (!c) fails.push(m + (d ? `\n        ${d}` : '')); };
const DATA = JSON.parse(fs.readFileSync('src/data/reading-shelf.json', 'utf8')).rooms;
const want = (key) => { const r = DATA[key]; return r.entries.length + (r.panels || []).reduce((s, p) => s + p.entries.length, 0); };

async function open(file, seed = {}) {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`${BASE}/${file}`, { waitUntil: 'load' });
  await p.evaluate((s) => { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, seed);
  await p.reload({ waitUntil: 'load' });
  await p.waitForTimeout(200);
  return { ctx, p, errs };
}

// 1. the second family: World Religions (data-pick boxes), Counseling (plain boxes), Genesis (minified)
for (const [file, code, course] of [['CTSWRReadings.html', 'WR', 'World Religions'], ['CTSCounselingReadings.html', 'Counseling', 'Counseling'], ['CTSGenesisReadings.html', 'Genesis', 'Genesis Intensive']]) {
  const { ctx, p, errs } = await open(file);
  const key = file.replace(/\.html$/, '');
  const boxes = p.locator('main article input[type=checkbox]');
  ok((await boxes.count()) === 5, `${file}: five digests with a select box`, String(await boxes.count()));
  if (DATA[key]) {
    ok((await p.locator('#cts-shelf .cts-shelf-entry').count()) === want(key), `${file}: the shelf shows ${want(key)} works`, String(await p.locator('#cts-shelf .cts-shelf-entry').count()));
    ok((await p.locator('#cts-shelf input[type=checkbox]').count()) === 0, `${file}: the shelf offers no selection`);
    const shelfTop = await p.locator('#cts-shelf').boundingBox(), lastDigest = await p.locator('main article.reading').last().boundingBox();
    ok(shelfTop && lastDigest && shelfTop.y > lastDigest.y, `${file}: the shelf is below the digests`);
    ok(!/course download|in your download/i.test(await p.locator('#cts-shelf').textContent()), `${file}: the shelf says nothing about a download`);
  } else ok((await p.locator('#cts-shelf').count()) === 0, `${file}: no shelf was delivered for it, so none shows`);
  ok(await p.locator('#cts-attest').isVisible(), `${file}: the attestation is on the page`);
  // two chosen, a name, the oath: refused
  await boxes.nth(0).check(); await boxes.nth(1).check();
  await p.locator('#cts-att-name').fill('Test Student');
  await p.locator('#cts-att-oath').check();
  await p.locator('#cts-att-record').click(); await p.waitForTimeout(100);
  ok(await p.evaluate((k) => !localStorage.getItem(k), `cts_honors_v1:${code}`), `${file}: two readings should not record`);
  ok(/three/i.test(await p.locator('#cts-att-msg').textContent()), `${file}: it should say three are needed`);
  // three chosen, no name: refused
  await boxes.nth(2).check();
  await p.locator('#cts-att-name').fill('');
  await p.locator('#cts-att-record').click(); await p.waitForTimeout(100);
  ok(await p.evaluate((k) => !localStorage.getItem(k), `cts_honors_v1:${code}`), `${file}: no name should not record`);
  // three, a name, the oath: recorded under the certificate's code, with the titles
  await p.locator('#cts-att-name').fill('Test Student');
  await p.locator('#cts-att-record').click(); await p.waitForTimeout(200);
  const rec = await p.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), `cts_honors_v1:${code}`);
  ok(rec && rec.name === 'Test Student' && rec.course === course && Array.isArray(rec.works) && rec.works.length === 3 && rec.works.every((w) => w.length > 3), `${file}: the record under cts_honors_v1:${code}`, JSON.stringify(rec));
  ok(rec && !rec.works.some((w) => /\//.test(w)), `${file}: the titles are in one language`, JSON.stringify(rec && rec.works));
  ok(await p.locator('#cts-att-record-card').isVisible() && await p.locator('#cts-att-done').isVisible(), `${file}: the record and the "recorded" note show`);
  ok((await p.evaluate(() => localStorage.getItem('cts_honors_name_v1'))) === 'Test Student', `${file}: the name is kept for the next room`);
  await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(200);
  ok(await p.locator('#cts-att-done').isVisible(), `${file}: on the next visit the page says it is recorded`);
  ok((await p.locator('#cts-att-name').inputValue()) === 'Test Student', `${file}: the name is filled in again`);
  ok(errs.length === 0, `${file}: page errors`, errs[0]);
  await ctx.close();
}

// 2. the first family still records, and has its shelf below the attestation
{
  const { ctx, p, errs } = await open('CTSJohnReadings.html');
  ok((await p.locator('#cts-shelf .cts-shelf-entry').count()) === want('CTSJohnReadings'), 'John: the shelf shows its works');
  const boxes = p.locator('input[data-pick]');
  await boxes.nth(0).check(); await boxes.nth(1).check(); await boxes.nth(2).check();
  await p.locator('#stName').fill('Test Student'); await p.locator('#oath').check();
  await p.evaluate(() => recordReading()); await p.waitForTimeout(200);
  const rec = await p.evaluate(() => JSON.parse(localStorage.getItem('cts_honors_v1:John') || 'null'));
  ok(rec && rec.works && rec.works.length === 3, 'John: still records under cts_honors_v1:John', JSON.stringify(rec));
  await p.locator('button[data-lang="es"]').click();
  ok(await p.locator('#cts-shelf .lang-es').first().isVisible() && !(await p.locator('#cts-shelf .lang-en').first().isVisible()), 'John: the shelf follows the language switch');
  ok(errs.length === 0, 'John: page errors', errs[0]);
  await ctx.close();
}

// 3. World Religions: the Required Readings page beside the room, and its test
{
  const { ctx, p, errs } = await open('CTSWRRequired.html');
  ok((await p.locator('#cts-readings article').count()) === 5, 'WR required: five assigned readings');
  ok((await p.locator('a[href="CTSWRRequiredTest.html"]').count()) >= 1, 'WR required: leads to its test');
  ok((await p.locator('a[href="CTSWRReadings.html"]').count()) >= 1, 'WR required: names the Supplemental Reading Room beside it');
  ok(!/Cults/.test(await p.locator('#cts-readings').textContent()), 'WR required: the readings are not the Cults room');
  await p.goto(`${BASE}/CTSWRRequiredTest.html`, { waitUntil: 'load' }); await p.waitForTimeout(300);
  ok((await p.locator('input[data-cts-fill]').count()) === 20, 'WR test: twenty answer boxes');
  ok((await p.locator('a[href="/CTSWRRequired.html"]').count()) >= 1, 'WR test: leads back to the readings');
  ok(errs.length === 0, 'WR: page errors', errs[0]);
  await ctx.close();
}

await browser.close();
console.log(`${checks} assertions on the reading rooms`);
if (!fails.length) console.log('PASS — the reading rooms show the shelf and record the honours reading, in every family of room.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach((f) => console.log('  ' + f)); process.exit(1); }
