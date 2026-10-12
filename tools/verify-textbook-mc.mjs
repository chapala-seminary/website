/* Real typed answers on converted textbook exams: grouped draws, resume, score
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
  for (const [i, q] of book.test.questions.entries()) {
    ok(!q.options, `${book.slug} Q${i + 1}: typed answer, no choices`);
    for (const lang of ['en', 'es']) {
      ok(w.CTSFill.fillRight(q, q.answer[lang]), `${book.slug} Q${i + 1}/${lang}: key accepted`);
      for (const variant of q.accept?.[lang] || []) ok(w.CTSFill.fillRight(q, variant), `${book.slug} Q${i + 1}/${lang}: published variant accepted`);
      ok(!w.CTSFill.fillRight(q, 'unrelated incorrect response'), `${book.slug} Q${i + 1}/${lang}: wrong answer rejected`);
    }
  }
}
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
try {
  // Check every standalone textbook test, including source-language fallback pages.
  const catalogContext = await browser.newContext();
  try {
    await catalogContext.route('**/*', r => new URL(r.request().url()).origin === new URL(BASE).origin ? r.continue() : r.abort());
    const page = await catalogContext.newPage();
    for (const file of fs.readdirSync('src/content/textbooks').sort()) {
      const book = JSON.parse(fs.readFileSync(`src/content/textbooks/${file}`, 'utf8'));
      for (const lang of ['en', 'es', 'fr']) {
        await page.goto(`${BASE}/${lang === 'en' ? '' : lang+'/'}${book.page}Test.html?cts_lang=${lang}`, {waitUntil:'load'});
        await page.waitForSelector('input[data-cts-fill]');
        ok(await page.locator('input[data-cts-fill]').count() === 20, `${book.slug}/${lang}: standalone typed draw of twenty`);
        ok(await page.locator('button[data-cts-mc]').count() === 0, `${book.slug}/${lang}: no multiple-choice answers`);
      }
    }
  } finally { await catalogContext.close(); }
  for (const slug of ['joshua', 'revelationmilligan']) for (const lang of ['en', 'es']) {
    const book = JSON.parse(fs.readFileSync(`src/content/textbooks/${slug}.json`, 'utf8'));
    const prior = await browser.newContext();
    try {
      await prior.route('**/*', r => new URL(r.request().url()).origin === new URL(BASE).origin ? r.continue() : r.abort());
      await prior.addInitScript(({slug, date}) => {
        localStorage.setItem(`cts_textbook_${slug}_passed`, date);
        localStorage.setItem('cts_textbooks_passed', JSON.stringify([slug]));
      }, {slug, date: '2026-10-01'});
      const page = await prior.newPage();
      await page.goto(`${BASE}/${lang === 'en' ? '' : 'es/'}${book.page}Test.html?cts_lang=${lang}`);
      ok(/passed|aprobado/i.test(await page.locator('#tb-status').innerText()), `${slug}/${lang}: previously earned multiple-choice pass remains valid`);
      ok(await page.evaluate(s => localStorage.getItem(`cts_textbook_${s}_passed`), slug) === '2026-10-01', `${slug}/${lang}: original pass date preserved`);
      ok(await page.locator('#tb-submit:disabled').count() === 1, `${slug}/${lang}: previous pass does not require another exam`);
    } finally { await prior.close(); }
    const ctx = await browser.newContext(), errors = [];
    try {
      await ctx.route('**/*', r => new URL(r.request().url()).origin === new URL(BASE).origin ? r.continue() : r.abort());
      await ctx.addInitScript(() => {
        if (sessionStorage.getItem('seeded')) return;
        localStorage.setItem('cts_student', JSON.stringify({ name: 'Synthetic Typed Test', country: 'Test', track: 'mdiv' }));
        localStorage.setItem('cts_track', 'mdiv');
        localStorage.setItem('cts_done_codes', JSON.stringify(['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK']));
        sessionStorage.setItem('seeded', '1');
      });
      const p = await ctx.newPage(); p.on('pageerror', e => errors.push(e.message));
      await p.goto(`${BASE}/${lang === 'en' ? '' : 'es/'}${book.page}Test.html?cts_lang=${lang}`, { waitUntil: 'load' });
      await p.waitForSelector('input[data-cts-fill]');
      ok(await p.locator('input[data-cts-fill]').count() === 20 && await p.locator('button[data-cts-mc]').count() === 0, `${slug}/${lang}: twenty typed questions, no choices`);
      const snapshot = () => p.evaluate(() => ({ bank: window.CTS_TEXTBOOK_TEST, draw: window.CTS_TEXTBOOK.draw() }));
      let current = await snapshot(); const original = current.draw, groups = {};
      for (const i of original) { const c = current.bank.questions[i].chapter; groups[c] = (groups[c] || 0) + 1; }
      ok(new Set(original).size === 20 && Object.values(groups).every(n => n === book.test.perChapter), `${slug}/${lang}: chapter draw`);
      const choose = async (i, right) => {
        const q = current.bank.questions[current.draw[i]];
        await p.locator(`input[data-cts-fill="${i}"]`).fill(right ? q.answer[lang] : 'unrelated incorrect response');
        await p.locator(`button[data-cts-fill-check="${i}"]`).click();
      };
      // Legacy choice attempts stored the selected English text in these same fields.
      await p.evaluate(({slug, answer}) => {
        const key=`cts_textbook_${slug}_state`, old=JSON.parse(localStorage.getItem(key));
        old.fillAnswers=new Array(old.draw.length).fill('');old.fillAnswers[0]=answer;
        old.fillChecked=new Array(old.draw.length).fill(false);old.fillChecked[0]=true;
        localStorage.setItem(key,JSON.stringify(old));
      }, {slug,answer:current.bank.questions[current.draw[0]].answer.en});
      await p.reload({waitUntil:'load'});
      ok(await p.locator('input[data-cts-fill="0"]').inputValue() === current.bank.questions[current.draw[0]].answer.en, `${slug}/${lang}: saved multiple-choice answer resumes as typed answer`);
      ok(await p.locator('.cts-fill-ok').count() === 1, `${slug}/${lang}: previously checked correct answer keeps its mark`);
      await p.evaluate(slug => {
        const key=`cts_textbook_${slug}_state`, old=JSON.parse(localStorage.getItem(key));
        old.fillAnswers=[];old.fillChecked=[];localStorage.setItem(key,JSON.stringify(old));
      },slug);
      await p.reload({waitUntil:'load'});
      await choose(0, false);
      ok(await p.locator('.cts-fill-bad').count() === 1, `${slug}/${lang}: immediate wrong-answer feedback`);
      ok(await p.locator('input[data-cts-fill="0"]:disabled').count() === 1, `${slug}/${lang}: checked answer fixed`);
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
console.log(`PASS — ${checks} typed textbook checks: English/Spanish, five-/ten-chapter draws.`);
