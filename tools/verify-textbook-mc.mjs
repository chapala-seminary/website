/* Real clicks on new MC textbook exams: grouped draws, resume, score
   boundaries and retakes. Synthetic state; external requests blocked. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { chromium } from 'playwright';
const BASE = process.argv[2] || 'http://127.0.0.1:8798';
let checks = 0;
const ok = (condition, label) => { assert.ok(condition, label); checks++; };
const w = {};
vm.runInNewContext(fs.readFileSync('public/assets/js/cts-fill.js', 'utf8'), { window: w, document: {}, setTimeout, clearTimeout });
for (const file of fs.readdirSync('src/content/textbooks')) {
  const book = JSON.parse(fs.readFileSync(`src/content/textbooks/${file}`, 'utf8'));
  for (const [i, q] of book.test.questions.entries()) if (q.options)
    ok(q.options.en.filter(opt => w.CTSFill.fillRight(q, opt)).length === 1, `${book.slug} Q${i + 1}: exactly one clickable answer grades right`);
}
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
try {
  for (const slug of ['joshua', 'revelationmilligan']) for (const lang of ['en', 'es']) {
    const book = JSON.parse(fs.readFileSync(`src/content/textbooks/${slug}.json`, 'utf8'));
    const ctx = await browser.newContext(), errors = [];
    try {
      await ctx.route('**/*', r => new URL(r.request().url()).origin === new URL(BASE).origin ? r.continue() : r.abort());
      await ctx.addInitScript(() => {
        if (sessionStorage.getItem('seeded')) return;
        localStorage.setItem('cts_student', JSON.stringify({ name: 'Synthetic MC Test', country: 'Test', track: 'mdiv' }));
        localStorage.setItem('cts_track', 'mdiv');
        localStorage.setItem('cts_done_codes', JSON.stringify(['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK']));
        sessionStorage.setItem('seeded', '1');
      });
      const p = await ctx.newPage(); p.on('pageerror', e => errors.push(e.message));
      await p.goto(`${BASE}/${lang === 'en' ? '' : 'es/'}${book.page}Test.html?cts_lang=${lang}`, { waitUntil: 'load' });
      await p.waitForSelector('button[data-cts-mc]');
      ok(await p.locator('button[data-cts-mc]').count() === 80, `${slug}/${lang}: twenty questions, four choices`);
      const snapshot = () => p.evaluate(() => ({ bank: window.CTS_TEXTBOOK_TEST, draw: window.CTS_TEXTBOOK.draw() }));
      let current = await snapshot(); const original = current.draw, groups = {};
      for (const i of original) { const c = current.bank.questions[i].chapter; groups[c] = (groups[c] || 0) + 1; }
      ok(new Set(original).size === 20 && Object.values(groups).every(n => n === book.test.perChapter), `${slug}/${lang}: chapter draw`);
      const choose = async (i, right) => {
        const q = current.bank.questions[current.draw[i]], answer = q.options.en.indexOf(q.answer.en);
        await p.locator(`button[data-cts-mc="${i}"][data-cts-opt="${right ? answer : (answer + 1) % 4}"]`).click();
      };
      await choose(0, false);
      ok(await p.locator('.cts-fill-bad').count() === 1, `${slug}/${lang}: immediate wrong-answer feedback`);
      ok(await p.locator('button[data-cts-mc="0"]:disabled').count() === 4, `${slug}/${lang}: choice fixed`);
      await choose(1, true);
      const state = () => p.evaluate(s => localStorage.getItem(`cts_textbook_${s}_state`), slug);
      const saved = await state(); await p.reload({ waitUntil: 'load' });
      ok(saved === await state(), `${slug}/${lang}: same draw and answers after reload`);
      for (let i = 2; i < 20; i++) await choose(i, i <= 17);
      await p.locator('#tb-submit').click();
      ok(/17 (of|de) 20/.test(await p.locator('#tb-result').innerText()), `${slug}/${lang}: seventeen fails`);
      const lock = await p.evaluate(s => Number(localStorage.getItem(`cts_textbook_${s}_lock`)), slug);
      ok(lock > Date.now() + 14 * 60000, `${slug}/${lang}: fifteen-minute Master's wait`);
      ok(await p.evaluate(s => !localStorage.getItem(`cts_textbook_${s}_passed`), slug), `${slug}/${lang}: no false pass`);
      await p.evaluate(s => {
        const past = Date.now() - 1000, key = `cts_textbook_${s}_state`, st = JSON.parse(localStorage.getItem(key));
        st.redrawAt = past; localStorage.setItem(key, JSON.stringify(st)); localStorage.setItem(`cts_textbook_${s}_lock`, String(past));
      }, slug);
      await p.reload({ waitUntil: 'load' }); current = await snapshot();
      ok(JSON.stringify(current.draw) !== JSON.stringify(original), `${slug}/${lang}: fresh draw after wait`);
      for (let i = 0; i < 20; i++) await choose(i, i < 18);
      await p.locator('#tb-submit').click();
      ok(/18 (of|de) 20/.test(await p.locator('#tb-result').innerText()), `${slug}/${lang}: eighteen passes`);
      ok(await p.evaluate(s => /^\d{4}-\d{2}-\d{2}$/.test(localStorage.getItem(`cts_textbook_${s}_passed`) || ''), slug), `${slug}/${lang}: dated pass saved`);
      await p.reload({ waitUntil: 'load' });
      ok(/passed|aprobado/i.test(await p.locator('#tb-status').innerText()), `${slug}/${lang}: pass survives reload`);
      ok(errors.length === 0, `${slug}/${lang}: no page errors`);
    } finally { await ctx.close(); }
  }
} finally { await browser.close(); }
console.log(`PASS — ${checks} multiple-choice textbook checks: English/Spanish, five-/ten-chapter draws.`);
