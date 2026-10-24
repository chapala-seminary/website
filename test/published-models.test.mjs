// Grade every published model with the shipped engine in its own language.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const units = [];
for (const course of fs.readdirSync('src/content/lessons')) {
  for (const file of fs.readdirSync('src/content/lessons/' + course).filter(f => f.endsWith('.json'))) {
    units.push(JSON.parse(fs.readFileSync(`src/content/units/${course}/${file}`, 'utf8')));
  }
}
assert.equal(units.length, 666);  // 466 + 200 denominational elective units (24 Oct 2026)
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
try {
  const page = await browser.newPage();
  await page.setContent('<html lang="fr"><body data-lang="fr" class="lang-fr"><div id="questionsContainer"></div><div id="kwContainer"></div><button id="submitExamBtn"></button><div id="examResult"></div></body></html>');
  await page.evaluate(() => {
    Object.defineProperty(document, 'readyState', { configurable: true, get: () => 'loading' });
    window.CTS_UNIT = { course: 'published-model-check', unit: 1, totalUnits: 1, sourceLang: 'en', langs: ['en', 'es', 'fr'], mc: [], fill: [], sa: [] };
  });
  await page.addScriptTag({ path: path.resolve('public/assets/js/cts-engine.js') });
  await page.evaluate(() => document.dispatchEvent(new Event('DOMContentLoaded')));
  const result = await page.evaluate(units => {
    const engine = window.CTS_ENGINE, failures = [];
    let count = 0;
    const language = code => { document.body.dataset.lang = code; document.body.className = 'lang-' + code; };
    for (const unit of units) {
      for (const [i, question] of unit.sa.entries()) {
        for (const code of ['en', 'es', 'fr']) {
          if (!question.model?.[code]) continue;
          language(code);
          const lists = Array.isArray(question.keywords) ? [question.keywords] : [question.keywords?.[code], question.keywords?.en];
          const hasKeys = lists.some(list => Array.isArray(list) && list.length > 0);
          if (engine.shortAnswerRight(question, question.model[code]) !== hasKeys) failures.push(`${unit.course}/${unit.unit} SA ${i + 1}: ${code} model or missing-key safeguard`);
          count++;
        }
        language('en');
        if (engine.shortAnswerRight(question, '')) failures.push(`${unit.course}/${unit.unit} SA ${i + 1}: empty passes`);
        count++;
      }
      language('fr');
      for (const [i, question] of unit.fill.entries()) {
        const answers = [question.answer.fr, ...(question.accept?.fr || []), question.answer.en].filter(Boolean);
        for (const answer of answers) {
          if (!engine.fillRight(question, answer)) failures.push(`${unit.course}/${unit.unit} fill ${i + 1}: answer rejected`);
          count++;
        }
      }
    }
    return { count, failures };
  }, units);
  assert.deepEqual(result.failures, []);
  console.log(`PASS — ${result.count} published model/source grading checks across ${units.length} units.`);
} finally { await browser.close(); }
