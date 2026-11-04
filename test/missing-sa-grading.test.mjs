// Missing keys must never award a pass or penalize a learner with a lockout.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
const units = fs.readdirSync('src/content/units/CTSGenesis').map(file => JSON.parse(fs.readFileSync('src/content/units/CTSGenesis/' + file)));
assert.equal(units.flatMap(u => u.sa).length, 120);
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
let checks = 0;
try {
  const page = await browser.newPage();
  await page.addInitScript(() => { try { sessionStorage.setItem('cts_pledge_all', '1'); } catch (e) {} }); // exam pledge (cts-integrity.js)
  await page.route('http://grading.test/**', route => route.fulfill({ contentType: 'text/html', body: '<html lang="en"><body data-lang="en"><div id="questionsContainer"></div><div id="kwContainer"></div><button id="submitExamBtn">Submit</button><div id="examResult"></div></body></html>' }));
  await page.goto('http://grading.test/');
  await page.evaluate(() => {
    localStorage.setItem('cts_track', 'mdiv');
    Object.defineProperty(document, 'readyState', { configurable: true, get: () => 'loading' });
    window.CTS_UNIT = { course: 'missing-keys', unit: 1, totalUnits: 1, sourceLang: 'en', mc: [], fill: [], sa: [{ prompt: { en: 'Explain creation.' }, model: { en: 'God created everything.' } }] };
  });
  await page.addScriptTag({ path: path.resolve('public/assets/js/cts-engine.js') });
  await page.evaluate(() => document.dispatchEvent(new Event('DOMContentLoaded')));
  const results = await page.evaluate(units => {
    const failures = [];
    for (const u of units) for (const q of u.sa) for (const lang of ['en', 'es']) {
      document.body.dataset.lang = lang;
      for (const answer of ['', 'Unrelated words that do not answer the question.', q.prompt[lang], q.model[lang]]) {
        if (window.CTS_ENGINE.shortAnswerRight(q, answer)) failures.push(`${u.unit}: ${lang} missing-key pass`);
      }
    }
    document.body.dataset.lang = 'en';
    for (const keywords of [[], { en: [] }, { en: [''] }, { en: [[' ']] }, { es: ['fe'] }]) {
      if (window.CTS_ENGINE.shortAnswerRight({ keywords }, 'faith')) failures.push('empty or unavailable key passes');
    }
    return failures;
  }, units);
  assert.deepEqual(results, []); checks += 965;
  for (const track of ['mdiv', 'thm']) {
    await page.evaluate(track => { localStorage.setItem('cts_track', track); window.CTS_ENGINE.render(); }, track);
    assert.match(await page.locator('#cts-exam-status').innerText(), /temporarily unavailable/);
    await page.locator('textarea').fill('Saved student work should survive unavailable grading without a pass or lockout.');
    const before = await page.evaluate(() => localStorage.getItem('cts_missing-keys_u1_state'));
    await page.locator('#submitExamBtn').click();
    assert.match(await page.locator('#examResult').innerText(), /temporarily unavailable/);
    assert.equal(await page.evaluate(() => localStorage.getItem('cts_missing-keys_u1_state')), before);
    for (const key of ['cts_missing-keys_progress', 'cts_missing-keys_u1_full_lock', 'cts_missing-keys_u1_sa_lock']) {
      assert.equal(await page.evaluate(key => localStorage.getItem(key), key), null);
    }
    checks += 6;
  }
  await page.evaluate(() => { localStorage.setItem('cts_track', 'cert'); window.CTS_ENGINE.render(); });
  assert.doesNotMatch(await page.locator('#cts-exam-status').innerText(), /temporarily unavailable/);
  await page.locator('#submitExamBtn').click();
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('cts_missing-keys_progress')).unit1), true);
  checks += 2;
  console.log(`PASS — ${checks} missing-grading checks: all 120 Genesis questions reject automatic passes, master submission preserves work without lockout, Certificate review remains available.`);
} finally { await browser.close(); }
