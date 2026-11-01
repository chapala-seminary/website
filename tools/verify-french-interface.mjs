/* Drive registration, answer feedback and retry states in the real French page. */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://127.0.0.1:8798';
const browser = await chromium.launch();
let checks = 0;
const check = (actual, expected) => { assert.ok(actual.includes(expected), `${expected} absent from ${actual}`); checks++; };
try {
  const page = await browser.newPage();
  await page.addInitScript(() => { try { sessionStorage.setItem('cts_pledge_all', '1'); } catch (e) {} }); // exam pledge (cts-integrity.js)
  await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
  await page.goto(`${base}/fr/CTSUnit1.html?cts_lang=fr`);
  check(await page.locator('#cts-register').innerText(), 'Une seule inscription');
  check(await page.locator('#regTrack option').first().textContent(), 'Certificat de ministère');
  await page.locator('#regName').fill('Interface Test');
  await page.locator('#regEmail').fill('interface-fixture@example.test');
  await page.locator('#regCountry').selectOption('MX');
  await page.locator('#regSave').click();
  check(await page.locator('#greeting').innerText(), 'Bienvenue,');
  await page.locator('#cts-exam-open').click();
  const q = page.locator('.question').first();
  await q.locator('button.option').nth(await page.evaluate(() => window.CTS_UNIT.mc[0].answer)).click();
  check(await q.innerText(), 'Correct');
  await page.evaluate(() => localStorage.setItem('cts_ots_u1_full_lock', String(Date.now() + 120000)));
  await page.reload();
  check(await page.locator('body').innerText(), 'Votre dernière tentative a échoué');
  await page.evaluate(() => {localStorage.removeItem('cts_ots_u1_full_lock');localStorage.setItem('cts_ots_progress',JSON.stringify({unit1:true}));});
  await page.reload();
  check(await page.locator('body').innerText(), 'Unité 1 réussie');
  check(await page.locator('body').innerText(), 'Votre progression est enregistrée');
  // Old Testament Survey is a French draft (13 Oct 2026): the review notice, in French, replaces the old "not available yet" fallback.
  assert.equal(await page.locator('.cts-translation-pending').count(),1);checks++;
  assert.equal(await page.locator('.cts-translation-pending').getAttribute('lang'),'fr');checks++;
  check(await page.locator('.cts-translation-pending').innerText(), 'Traduction provisoire');
  console.log(`${checks} French interface checks — PASS; the French draft notice is shown.`);
} finally { await browser.close(); }
