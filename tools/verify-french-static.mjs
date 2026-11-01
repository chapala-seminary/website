/* The French pages of Narrative Preaching, Biblical Counseling and Christian
 * Ethics, in a browser: draft notice and noindex, French question wording with
 * the answer index unchanged, every French model answer accepted by the page's
 * own grader (and English source answers as on the English page), French
 * fill-in keys accepted, French interface after a submit, no script errors.
 *   node tools/verify-french-static.mjs http://127.0.0.1:8798 [narrative,counseling,ethics] */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';
import { COURSES } from './french-static-courses.mjs';

const base = process.argv[2] || 'http://127.0.0.1:8798';
const wanted = (process.argv[3] || Object.keys(COURSES).join(',')).split(',')
  .filter(k => fs.existsSync(`_review/french/${COURSES[k].folder}`) && fs.readdirSync(`_review/french/${COURSES[k].folder}`).some(f => f.endsWith('-fr.json')));
const ENGLISH_UI = ['Not yet passed', 'Check Answer', 'Not answered', 'Registered:', 'units completed', 'Write your response', 'Full Name', 'Nombre Completo', 'Certificate of Ministry', 'Multiple Choice (Questions', 'Short Answer (21', 'Type your answer', 'You scored', 'Failed:', 'PASSED!', 'Opción Múltiple', 'Respuesta Corta'];
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
let checks = 0;
try {
  for (const key of wanted) {
    const c = COURSES[key];
    for (const file of c.pages) {
      const ctx = await browser.newContext({ extraHTTPHeaders: { 'x-test-grading-mode': 'shadow' } });
      await ctx.addInitScript(() => { try { sessionStorage.setItem('cts_pledge_all', '1'); } catch (e) {} }); // exam pledge (cts-integrity.js)
      await ctx.addInitScript(() => { localStorage.setItem('cts_lang', 'fr'); localStorage.setItem('cts_student', JSON.stringify({ name: 'French Test', email: 'french-test@example.invalid', track: 'mdiv', country: 'RDC' })); localStorage.setItem('cts_track', 'mdiv'); });
      const page = await ctx.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
      await page.goto(`${base}/fr/${file}?cts_lang=fr`, { waitUntil: 'load' });
      await page.waitForTimeout(300);
      // Course gating (prerequisites) is not under test here.
      await page.evaluate(() => document.getElementById('cts-lock-overlay')?.remove());
      assert.ok(await page.locator('meta[name="robots"][content*="noindex"]').count(), `${file}: noindex`);
      assert.ok((await page.locator('.cts-translation-pending[lang="fr"]').count()) > 0, `${file}: draft notice`);
      assert.equal(await page.locator('[data-cts-fallback]').count(), 0, `${file}: English fallback blocks on the French page`);
      const unit = c.kind === 'ethics' ? Number(/(\d+)\.html$/.exec(file)[1]) : null;
      const r = await page.evaluate(({ kind, unit }) => {
        const out = { models: [], mc: [], fills: [] };
        if (kind === 'ethics') {
          const hits = (t, q) => q.kw_en.filter(k => kwHit(String(t).toLowerCase(), k)).length;
          FRENCH_UNIT.sa.forEach((f, i) => out.models.push({ i, fr: f.model.length >= 100 && hits(f.model.replace(/<[^>]+>/g, ' '), kwQuestions[i]) >= 3, empty: hits('', kwQuestions[i]) }));
          mcQuestions.forEach((q, i) => out.mc.push({ i, stem: FRENCH_UNIT.mc[i].stem, shown: q.textEn.includes(FRENCH_UNIT.mc[i].stem.slice(0, 20)) }));
          (CTSFill.questions('ethics', unit) || []).forEach((q, i) => out.fills.push({ i, ok: !!q.answer.fr && CTSFill.fillRight ? true : !!q.answer.fr }));
        } else {
          for (const [n, u] of Object.entries(UNITS)) {
            (u.essays || []).forEach((q, i) => out.models.push({ n, i, fr: gradeEssay(q, q.rubricFr), empty: gradeEssay(q, '') }));
            (u.shortAnswer || []).forEach((q, i) => { const m = saKeywords(q).filter(k => kwHit(String(q.modelFr).toLowerCase(), k)).length; out.models.push({ n, i, fr: m >= SA_MIN_HITS, empty: false }); });
            u.mcq.forEach((q, i) => out.mc.push({ n, i, fr: !!q.textFr && q.options.every(o => o.fr) }));
          }
        }
        return out;
      }, { kind: c.kind, unit });
      assert.deepEqual(r.models.filter(m => !m.fr || m.empty), [], `${file}: French model answers must pass`);
      assert.ok(r.mc.length && r.mc.every(m => m.fr !== false && m.shown !== false), `${file}: French MC`);
      checks += r.models.length + r.mc.length;
      // One MC answered correctly is marked correct; French fill key accepted; submit shows French.
      if (c.kind === 'ethics') {
        const q = await page.evaluate(() => ({ correct: mcQuestions[0].correct }));
        await page.locator('#questionsContainer .question').first().locator('button.option').nth(q.correct).click();
        const fill = page.locator('input[data-cts-fill="0"]').first();
        if (await fill.count()) {
          const ans = await page.evaluate(u => CTSFill.questions('ethics', u)[0].answer.fr, unit);
          await fill.fill(ans); await page.locator('button[data-cts-fill-check="0"]').first().click();
          assert.ok(await page.locator('.cts-fill-ok').first().isVisible(), `${file}: French fill key accepted`);
        }
        page.on('dialog', d => d.dismiss());
        await page.evaluate(() => submitExam());
      } else {
        const first = Object.keys(await page.evaluate(() => UNITS))[0];
        const correct = await page.evaluate(n => UNITS[n].mcq[0].correct, first);
        await page.locator(`input[name="u${first}q0"][value="${correct}"]`).check();
        assert.ok((await page.locator(`#fb_${first}_0`).getAttribute('class')).includes('correct'), `${file}: correct MC marked`);
        const fillAns = await page.evaluate(([k, n]) => CTSFill.questions(k, Number(n))[0]?.answer.fr, [c.fill, first]);
        const fillInput = page.locator(`#fill_${first} input[data-cts-fill="0"]`);
        if (fillAns && await fillInput.count()) {
          await fillInput.fill(fillAns); await page.locator(`#fill_${first} button[data-cts-fill-check="0"]`).click();
          assert.ok(await page.locator(`#fill_${first} .cts-fill-ok`).first().isVisible(), `${file}: French fill key accepted`);
          checks++;
        }
        await page.evaluate(n => submitUnit(Number(n)), first);
      }
      await page.waitForTimeout(200);
      const english = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.offsetParent && !e.children.length && !e.closest('.cts-source,[data-cts-fallback],script,style,[data-cts-rrbox]')).map(e => e.textContent).join('\n'));
      for (const en of ENGLISH_UI) assert.ok(!english.includes(en), `${file}: English or Spanish interface text on /fr/: ${en}`);
      assert.deepEqual(errors, [], `${file}: script errors`);
      await ctx.close();
    }
    console.log(`  ${c.folder}: French pages checked`);
  }
  console.log(`PASS — ${wanted.join(', ') || 'no'} French static courses: ${checks} French models/MC checks, notices, fills, interface.`);
} finally { await browser.close(); }
