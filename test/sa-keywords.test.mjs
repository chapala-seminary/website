// Short-answer keyword repairs (French Batch 2 findings, Oct 2026): John,
// Matthew, Acts and Romans, graded by the shipped engine in its own languages.
//
// Keyword grading counts a group when any of its forms appears anywhere in
// the answer. The report found that 213 of these 460 English prompts passed
// when a student pasted the question back. This test holds the repair:
//   - no prompt passes as its own answer, in English (English list) or
//     Spanish (Spanish or English list, as the Spanish page grades);
//   - every model answer still passes in its language;
//   - correct answers written without sight of the keywords still pass;
//   - the wrong answers the report tested still fail;
//   - no keyword is a filler word that any answer contains.
// It cannot show that an answer is right: keyword matching does not read
// negation or argument. That limit is recorded in
// docs/short-answer-keyword-repairs.md.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const COURSES = ['CTSJohn', 'CTSMatt', 'CTSActs', 'CTSRomans'];
const FIXTURE = JSON.parse(fs.readFileSync('test/fixtures/sa-answers.json', 'utf8'));
// Words every answer contains; as a keyword they score for anything.
const FILLER = new Set(('the a an and or of to in on for with by from at as is are was were be his her him he she it '
  + 'its they them their this that me my we us our you your not no all but so if who what why how when where away '
  + 'against god lord jesus christ el la los las un una y o de del en por para con sin que se su sus lo le les es '
  + 'son fue mi nos dios senor cristo contra fuera').split(' '));
const fold = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

const units = [];
for (const course of COURSES) {
  for (const file of fs.readdirSync(`src/content/units/${course}`).filter(f => f.endsWith('.json'))) {
    units.push({ key: `${course}/${file.replace('.json', '')}`, ...JSON.parse(fs.readFileSync(`src/content/units/${course}/${file}`, 'utf8')) });
  }
}
assert.equal(units.length, 46);

const failures = [];
for (const u of units) {
  u.sa.forEach((q, i) => {
    const en = q.keywords?.en || [], es = q.keywords?.es || [];
    if (en.length < 8 || en.length !== es.length) failures.push(`${u.key} SA ${i + 1}: ${en.length} English / ${es.length} Spanish groups`);
    for (const k of [...en, ...es]) for (const form of [].concat(k)) {
      if (FILLER.has(fold(form))) failures.push(`${u.key} SA ${i + 1}: filler keyword "${form}"`);
    }
  });
}

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
try {
  const page = await browser.newPage();
  await page.setContent('<html lang="en"><body data-lang="en" class="lang-en"><div id="questionsContainer"></div><div id="kwContainer"></div><button id="submitExamBtn"></button><div id="examResult"></div></body></html>');
  await page.evaluate(() => {
    Object.defineProperty(document, 'readyState', { configurable: true, get: () => 'loading' });
    window.CTS_UNIT = { course: 'sa-keyword-check', unit: 1, totalUnits: 1, sourceLang: 'en', langs: ['en', 'es', 'fr'], mc: [], fill: [], sa: [] };
  });
  await page.addScriptTag({ path: path.resolve('public/assets/js/cts-engine.js') });
  await page.evaluate(() => document.dispatchEvent(new Event('DOMContentLoaded')));
  const result = await page.evaluate(({ units, fixture }) => {
    const engine = window.CTS_ENGINE, failures = [];
    const counts = { prompts: 0, models: 0, right: 0, wrong: 0 };
    const language = code => { document.body.dataset.lang = code; document.body.className = 'lang-' + code; };
    const right = (q, text, code) => { language(code); return engine.shortAnswerRight(q, text); };
    for (const u of units) {
      u.sa.forEach((q, i) => {
        const id = `${u.key} SA ${i + 1}`;
        for (const code of ['en', 'es']) {
          if (right(q, q.prompt[code], code)) failures.push(`${id}: the ${code} prompt passes as its own answer`);
          counts.prompts++;
          if (q.model?.[code]) {
            if (!right(q, q.model[code], code)) failures.push(`${id}: the ${code} model answer fails`);
            counts.models++;
          }
        }
        const f = fixture[`${u.key}/${i + 1}`];
        if (!f) return;
        for (const code of ['en', 'es']) {
          for (const text of f.right?.[code] || []) {
            if (!right(q, text, code)) failures.push(`${id}: correct ${code} answer fails: ${text.slice(0, 70)}…`);
            counts.right++;
          }
          for (const text of f.wrong?.[code] || []) {
            if (right(q, text, code)) failures.push(`${id}: wrong ${code} answer passes: ${text}`);
            counts.wrong++;
          }
        }
      });
    }
    return { counts, failures };
  }, { units, fixture: FIXTURE });
  failures.push(...result.failures);
  assert.deepEqual(failures, []);
  const c = result.counts;
  console.log(`PASS — short-answer keywords in John, Matthew, Acts and Romans: ${c.prompts} copied prompts fail, ${c.models} models pass, ${c.right} independent correct answers pass, ${c.wrong} known wrong answers fail.`);
} finally { await browser.close(); }
