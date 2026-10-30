// The "Listen to this lesson" button (public/assets/js/cts-listen.js), with the
// browser's speech replaced by a recorder: what would be said, in which
// language, and that it stops when the exam is opened.
//
//   node test/listen.test.mjs http://127.0.0.1:8798
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const BASE = process.argv[2] || process.env.API_BASE || 'http://127.0.0.1:8798';
let checks = 0;
const ok = (v, m) => { assert.ok(v, m); checks++; };

const fakeSpeech = () => {
  const said = []; window.__said = said;
  const voices = [{ name: 'Test English', lang: 'en-US' }, { name: 'Test Español', lang: 'es-MX' }, { name: 'Test Français', lang: 'fr-FR' }];
  let current = null;
  window.SpeechSynthesisUtterance = function (text) { this.text = text; };
  const synth = {
    getVoices: () => voices,
    speak(u) { said.push({ text: u.text, lang: u.lang }); current = u; setTimeout(() => { if (current === u && u.onend) u.onend({}); }, window.__delay || 5); },
    cancel() { current = null; },
    addEventListener() {},
  };
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
};

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(fakeSpeech);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  for (const [path, label, lang, ref] of [
    ['/CTSUnit1.html?cts_lang=en', 'Listen to this lesson', 'en', /chapter 1, verses 26 to 27/],
    ['/es/CTSUnit1.html', 'Escuchar esta lección', 'es', /capítulo 1, versículos 26 al 27/],
    ['/fr/CTSUnit1.html', 'Écouter cette leçon', 'fr', null],
  ]) {
    await page.goto(BASE + path);
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
    const play = page.locator('#cts-listen [data-act="play"]');
    await play.waitFor({ timeout: 10000 });
    ok((await play.innerText()).includes(label), `${path}: the button says ${label}`);
    // it sits before the lesson text
    ok(await page.evaluate(() => {
      const bar = document.getElementById('cts-listen');
      const first = [...document.querySelectorAll('#lesson .cts-reading')].find((e) => !e.closest('[data-cts-chrome], #cts-register'));
      return !!(bar.compareDocumentPosition(first) & Node.DOCUMENT_POSITION_FOLLOWING);
    }), `${path}: the button is at the top of the lesson`);
    await play.click();
    // the whole lesson, to the end: the Listen button comes back
    await page.waitForFunction(() => window.__said.length > 5 && !document.querySelector('#cts-listen [data-act="play"]').hidden, null, { timeout: 60000 });
    const said = await page.evaluate(() => window.__said);
    ok(said.every((s) => s.lang.startsWith(lang)), `${path}: read in ${lang}`);
    ok(said.every((s) => s.text.length <= 270), `${path}: in short parts`);
    const text = said.map((s) => s.text).join(' ');
    if (ref) ok(ref.test(text), `${path}: Bible references are said in words`);
    ok(!/\d+:\d+/.test(text), `${path}: no "1:1" left to read as numbers`);
    ok(!/Register once|Regístrese|Save registration/.test(text), `${path}: the registration box is not read`);
    ok(await page.locator('.cts-listening').count() === 0, `${path}: at the end, nothing is left highlighted`);
    await page.evaluate(() => { window.__said.length = 0; window.__delay = 150; });
    await play.click();
    await page.waitForFunction(() => window.__said.length > 3);
    ok(await page.locator('.cts-listening').count() === 1, `${path}: the paragraph being read is highlighted`);
    // pause, continue, stop
    await page.locator('#cts-listen [data-act="pause"]').click();
    const n = await page.evaluate(() => window.__said.length);
    await page.waitForTimeout(200);
    ok(await page.evaluate(() => window.__said.length) === n, `${path}: pause stops the reading`);
    await page.locator('#cts-listen [data-act="pause"]').click();
    await page.waitForFunction((k) => window.__said.length > k, n, { timeout: 5000 });
    ok(true, `${path}: continue goes on`);
    await page.locator('#cts-listen [data-act="stop"]').click();
    ok(await play.isVisible(), `${path}: stop brings back the Listen button`);
  }

  // The exam is never read, and opening it stops the reading.
  await page.goto(BASE + '/CTSUnit1.html?cts_lang=en');
  await page.locator('#cts-listen [data-act="play"]').click();
  await page.waitForFunction(() => window.__said.length > 3);
  await page.evaluate(() => sessionStorage.setItem('cts_exam_view:' + location.pathname, '1'));
  await page.reload();
  await page.waitForSelector('#questionsContainer', { state: 'attached', timeout: 15000 });
  await page.waitForTimeout(2000);
  ok(await page.evaluate(() => document.body.classList.contains('cts-exam-open')), 'the exam is open');
  ok(!(await page.locator('#cts-listen').isVisible()), 'the Listen button is not shown with the exam');

  // no voice for the page language: said so, nothing read
  const sw = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await sw.addInitScript(fakeSpeech);
  const sp = await sw.newPage();
  await sp.goto(BASE + '/sw/CTSUnit1.html');
  await sp.evaluate(() => sessionStorage.clear());
  await sp.reload();
  await sp.locator('#cts-listen [data-act="play"]').click();
  await sp.waitForTimeout(500);
  ok(/Kifaa hiki hakina sauti ya Kiswahili/.test(await sp.locator('#cts-listen').innerText()), 'no Swahili voice: said so in Swahili');
  ok(await sp.evaluate(() => window.__said.length) === 0, 'and nothing is read in another voice');
  await sw.close();

  assert.deepEqual(errors, [], 'no script errors'); checks++;
} finally { await browser.close(); }
console.log(`PASS — Listen: ${checks} checks.`);
