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
  const voices = [{ name: 'Test English', lang: 'en-US' }, { name: 'Test English Second', lang: 'en-US' }, { name: 'Test Español', lang: 'es-MX' }, { name: 'Test Français', lang: 'fr-FR' }];
  let current = null;
  window.SpeechSynthesisUtterance = function (text) { this.text = text; };
  const synth = {
    getVoices: () => voices,
    speak(u) { said.push({ text: u.text, lang: u.lang, voice: u.voice && u.voice.name }); current = u; setTimeout(() => { if (current === u && u.onend) u.onend({}); }, window.__delay || 5); },
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
    ok(/(voice|voz|voix)/.test(await page.locator('#cts-listen .cts-listen-tip').innerText()), `${path}: the voice tip is shown`);
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
    const script = await page.evaluate(() => window.CTSListen.script());
    ok(script.length === said.length && script.every((s, i) => s.text === said[i].text), `${path}: CTSListen.script() is what the button reads`);
    ok(!/\d+:\d+/.test(text), `${path}: no "1:1" left to read as numbers`);
    ok(!/\d\s*[–—-]\s*\d/.test(text), `${path}: no "1-7" left to read as a subtraction`);
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
  ok(/mwanamume au ya mwanamke/.test(await sp.locator('#cts-listen .cts-listen-tip').innerText()), 'the voice tip is in Swahili');
  ok(await sp.evaluate(() => window.__said.length) === 0, 'and nothing is read in another voice');
  await sw.close();

  // Textbooks and reading rooms (Dr. Cook, 30 Oct): what is open on screen; never on a test page.
  await page.evaluate(() => { window.__delay = 1; });
  for (const [path, phrase] of [['/CTSTextbookActsStokes.html?cts_lang=en', /Pentecost/], ['/CTSActsReadings.html?cts_lang=en', /readings/i]]) {
    await page.goto(BASE + path);
    await page.evaluate(() => { window.__delay = 1; });
    const p2 = page.locator('#cts-listen [data-act="play"]');
    await p2.waitFor({ timeout: 10000 });
    ok(true, `${path}: the Listen button is there`);
    await p2.click();
    await page.waitForFunction(() => window.__said.length > 2 && !document.querySelector('#cts-listen [data-act="play"]').hidden, null, { timeout: 120000 });
    const t2 = (await page.evaluate(() => window.__said)).map((x) => x.text).join(' ');
    ok(phrase.test(t2), `${path}: the page text is read`);
    ok(!/Your information|All courses/.test(t2), `${path}: the footer is not read`);
  }
  // a reading opened in the room is read; a closed one is not
  await page.goto(BASE + '/CTSActsReadings.html?cts_lang=en');
  const closed = await page.evaluate(() => { const d = document.querySelector('details.digest-inline'); return d ? d.innerText.length : 0; });
  if (closed) {
    const before = await page.evaluate(() => window.CTSListen.script().map((x) => x.text).join(' ').length);
    await page.evaluate(() => { document.querySelector('details.digest-inline').open = true; });
    const after = await page.evaluate(() => window.CTSListen.script().map((x) => x.text).join(' ').length);
    ok(after > before + 200, `an opened reading is read (${before} -> ${after} characters)`);
  }
  for (const t of ['/CTSTextbookActsStokesTest.html?cts_lang=en', '/CTSActsReadingsTest.html?cts_lang=en', '/es/CTSTextbookActsStokesTest.html']) {
    await page.goto(BASE + t);
    await page.waitForTimeout(800);
    ok(await page.locator('#cts-listen').count() === 0, `no Listen button on a test page (${t})`);
  }

  // ChatGPT's review (30 Oct): anything that belongs to a test is never read, wherever it sits; hidden text is
  // never read; each page type has its own label in each language; keyboard focus follows the controls.
  const INJECT = () => {
    const c = document.getElementById('content') || document.getElementById('lesson');
    c.insertAdjacentHTML('beforeend',
      '<div id="tb-questions"><p><span class="cts-reading">SECRET-TBQ answer</span></p></div>' +
      '<div data-cts-part="exam"><p><span class="cts-reading">SECRET-EXAM answer</span></p></div>' +
      '<section class="exam"><p>SECRET-SECTION answer</p></section>' +
      '<form><p>SECRET-FORM answer</p></form>' +
      '<p><span style="display:none">SECRET-HIDDEN text</span></p>');
  };
  for (const path of ['/CTSTextbookActsStokes.html?cts_lang=en', '/CTSActsReadings.html?cts_lang=en', '/es/CTSTextbookActsStokes.html', '/CTSUnit1.html?cts_lang=en']) {
    await page.goto(BASE + path);
    await page.evaluate(() => sessionStorage.clear());
    await page.locator('#cts-listen').waitFor({ state: 'attached', timeout: 10000 });
    await page.evaluate(INJECT);
    const text = (await page.evaluate(() => window.CTSListen.script())).map((x) => x.text).join(' ');
    ok(text.length > 200 && !/SECRET/.test(text), `${path}: no test question, form or hidden text is read`);
  }
  for (const [path, label, lang] of [['/es/CTSTextbookActsStokes.html', 'Escuchar este libro de texto', 'es'],
    ['/fr/CTSActsReadings.html', 'Écouter ces lectures', 'fr'], ['/CTSTextbookActsStokes.html?cts_lang=en', 'Listen to this textbook', 'en'],
    ['/sw/CTSActsReadings.html', 'Sikiliza masomo haya ya kusoma', 'sw']]) {
    await page.goto(BASE + path);
    const btn = page.locator('#cts-listen [data-act="play"]');
    await btn.waitFor({ timeout: 10000 });
    ok((await btn.innerText()).includes(label), `${path}: the button says ${label}`);
    const langs = [...new Set((await page.evaluate(() => window.CTSListen.script())).map((x) => x.lang))];
    ok(langs.includes(lang), `${path}: read in ${lang} (${langs.join(',')})`);
  }
  // Changing language on a textbook goes through the site-wide control (cts-lang.js), which opens the page
  // in the new language: the English narration must stop and the new page must offer Listen in Spanish.
  await page.goto(BASE + '/CTSTextbookActsStokes.html?cts_lang=en');
  await page.evaluate(() => { window.__delay = 350; window.__said.length = 0; });
  const tbPlay = page.locator('#cts-listen [data-act="play"]');
  await tbPlay.click();
  await page.waitForFunction(() => window.__said.length > 1, null, { timeout: 10000 });
  ok(await page.locator('.cts-listening').count() === 1, 'English textbook is being narrated');
  // The old in-page EN/ES/Both buttons are hidden and hand over to the site-wide control.
  ok(await page.evaluate(() => [...document.querySelectorAll('button[data-lang]')].every((b) => !b.offsetParent)), 'legacy textbook language buttons stay hidden');
  await Promise.all([page.waitForURL(/\/es\/CTSTextbookActsStokes\.html/), page.evaluate(() => window.CTSLanguage.choose('es'))]);
  await tbPlay.waitFor({ timeout: 10000 });
  ok(await tbPlay.isVisible(), 'EN→ES opens the Spanish page with Listen idle');
  ok((await tbPlay.innerText()).includes('Escuchar este libro de texto'), 'EN→ES: textbook Listen label is Spanish');
  ok(await page.locator('.cts-listening').count() === 0, 'EN→ES: no paragraph is still marked as being read');
  ok((await page.locator('#cts-listen .cts-listen-tip').innerText()).includes('Consejo'), 'EN→ES: voice tip is Spanish');
  await page.evaluate(() => { window.__said.length = 0; });
  await tbPlay.click();
  await page.waitForFunction(() => window.__said.length > 1, null, { timeout: 10000 });
  ok((await page.evaluate(() => window.__said)).every((v) => v.lang.startsWith('es')), 'Listen on the Spanish page reads Spanish');
  // A same-page language event (as the legacy textbook control now sends) stops and relabels at once.
  await page.evaluate(() => document.dispatchEvent(new CustomEvent('cts-lang', { detail: 'es' })));
  ok(await tbPlay.isVisible(), 'a cts-lang event during playback stops audio and restores Listen');
  ok(await page.locator('.cts-listening').count() === 0, 'a cts-lang event clears the narrated highlight');

  // keyboard: Enter on Listen moves focus to Pause; Enter on Stop moves it back to Listen
  await page.goto(BASE + '/CTSUnit1.html?cts_lang=en');
  await page.evaluate(() => { sessionStorage.clear(); window.__delay = 300; });
  await page.reload();
  await page.evaluate(() => { window.__delay = 300; });
  await page.locator('#cts-listen [data-act="play"]').focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.activeElement && document.activeElement.getAttribute('data-act') === 'pause', null, { timeout: 3000 });
  ok(true, 'keyboard: focus moves to Pause');
  await page.locator('#cts-listen [data-act="stop"]').focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.activeElement && document.activeElement.getAttribute('data-act') === 'play', null, { timeout: 3000 });
  ok(true, 'keyboard: focus returns to Listen after Stop');
  ok(await page.locator('#cts-listen .cts-listen-msg[aria-live="polite"]').count() === 1, 'messages are announced politely');

  // Voice selection is an actual working control, not just a tip about phone settings.
  await page.goto(BASE + '/CTSUnit1.html?cts_lang=en');
  await page.evaluate(() => { sessionStorage.clear(); localStorage.removeItem('cts_listen_voice_en'); window.__said.length = 0; window.__delay = 200; });
  await page.reload();
  const voiceSelect = page.locator('#cts-listen [data-act="voice"]');
  await voiceSelect.waitFor({ timeout: 10000 });
  ok(await voiceSelect.locator('option').count() === 3, 'the voice selector lists automatic and both device English voices');
  const voiceOptions = await voiceSelect.locator('option').allTextContents();
  ok(voiceOptions.some(v => v.includes('Test English Second')), 'a second available English voice is listed');
  await voiceSelect.selectOption({ label: 'Test English Second (en-US)' });
  const pref = await page.evaluate(() => localStorage.getItem('cts_listen_voice_en'));
  ok(pref && pref.includes('Test English Second'), 'the chosen voice is remembered locally');
  await page.locator('#cts-listen [data-act="play"]').click();
  await page.waitForFunction(() => window.__said.length > 0);
  const selectedVoice = await page.evaluate(() => window.__said[0].voice);
  ok(selectedVoice === 'Test English Second', 'the chosen voice actually speaks');
  await page.locator('#cts-listen [data-act="stop"]').click();
  await page.reload();
  ok((await voiceSelect.inputValue()).includes('Test English Second'), 'chosen voice survives reloading the page');
  ok((await page.locator('#cts-listen .cts-listen-help-text').textContent()).includes('General management'), 'the Samsung speech-settings steps are present');
  await voiceSelect.selectOption('');
  ok((await page.evaluate(() => localStorage.getItem('cts_listen_voice_en'))) === null, 'automatic voice selection clears the preference');
  // Switching to Spanish must never offer the user's English-only voice as a Spanish narrator.
  await page.goto(BASE + '/es/CTSUnit1.html');
  const esVoice = page.locator('#cts-listen [data-act="voice"]');
  await esVoice.waitFor({ timeout: 10000 });
  ok((await esVoice.locator('option').allTextContents()).every(x => !x.includes('Test English')), 'Spanish selector excludes English voices');
  ok((await page.locator('#cts-listen .cts-listen-help-title').innerText()).includes('Cómo'), 'Spanish voice setup directions are translated');

  assert.deepEqual(errors, [], 'no script errors'); checks++;
} finally { await browser.close(); }
console.log(`PASS — Listen: ${checks} checks.`);
