// Drive the shipped engine in a browser, with a small multilingual question
// bank. No copy of the normaliser or grader lives in this test.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import path from 'node:path';

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
let checks = 0;
try {
  const page = await browser.newPage();
  await page.setContent('<html lang="fr"><body data-lang="fr" class="lang-fr"><div id="questionsContainer"></div><div id="kwContainer"></div><button id="submitExamBtn"></button><div id="examResult"></div></body></html>');
  await page.evaluate(() => { Object.defineProperty(document, 'readyState', { configurable: true, get: () => 'loading' }); window.CTS_UNIT = { course: 'language-test', unit: 1, totalUnits: 1, sourceLang: 'en', langs: ['en', 'es', 'fr', 'uk'], mc: [], sa: [], fill: [] }; });
  await page.addScriptTag({ path: path.resolve('public/assets/js/cts-engine.js') });
  await page.evaluate(() => document.dispatchEvent(new Event('DOMContentLoaded')));
  const cases = await page.evaluate(() => {
    const e = window.CTS_ENGINE;
    const q = { answer: { en: 'apostle', es: 'apóstol', fr: 'apôtre', uk: 'апостол' }, accept: { fr: ['envoyé'] } };
    const sa = { keywords: { en: ['apost', 'church', ['faith', 'belief']], es: ['apóst', 'iglesia', 'fe'], fr: ['apôtr', 'église', ['foi', 'croyance']] } };
    const out = [];
    const check = (label, actual, expected) => out.push({ label, actual, expected });
    for (const answer of ['apôtre', 'APÔTRE', 'apo\u0302tre', 'apotre', "l'apôtre", 'l’apôtre', 'le apôtre', 'la apôtre', 'les apôtre', 'un apôtre', 'une apôtre', 'des apôtre', 'envoyé', 'apostle', 'the apostle'])
      check(`French fill: ${answer}`, e.fillRight(q, answer), true);
    for (const answer of ['', 'apotr', 'unrelated apostle words', 'apóstol', 'апостол'])
      check(`French wrong fill: ${answer}`, e.fillRight(q, answer), false);
    check('French accented keyword stems', e.shortAnswerRight(sa, 'Les apôtres de cette église enseignent la foi.'), true);
    check('French decomposed accents', e.shortAnswerRight(sa, 'Les apo\u0302tres de cette e\u0301glise enseignent la foi.'), true);
    check('French source answer', e.shortAnswerRight(sa, 'The apostles teach faith in the church.'), true);
    check('Other translation is not accepted', e.shortAnswerRight(sa, 'Los apóstoles de la iglesia enseñan la fe.'), false);
    check('Duplicate translated concept does not give three hits', e.shortAnswerRight(sa, 'apôtre apostle foi'), false);
    check('Synonyms count once', e.shortAnswerRight(sa, 'foi croyance apôtre'), false);
    check('Too few concepts', e.shortAnswerRight(sa, 'apôtre église'), false);
    check('Missing target keys use source', e.shortAnswerRight({ keywords: { en: ['faith'] } }, 'faith'), true);
    check('Unrelated keys do not give a free pass', e.shortAnswerRight({ keywords: { es: ['fe'] } }, ''), false);
    check('Plain legacy keyword array', e.shortAnswerRight({ keywords: ['faith'] }, 'faith'), true);
    check('Punctuation and numbers preserved as before', e.normalise("Faith! 123").trim(), 'faith 123');
    check('Unicode letters preserved', e.normalise('Grâce, cœur, апостол ١٢!').trim(), 'grâce cœur апостол ١٢');
    document.body.className = 'lang-uk'; document.body.dataset.lang = 'uk';
    check('Ukrainian fill', e.fillRight(q, 'апостол'), true);
    check('Cyrillic breve stays distinct', e.fillRight({ answer: { uk: 'край', en: 'edge' } }, 'краи'), false);
    check('Cyrillic decomposed breve composes', e.fillRight({ answer: { uk: 'край', en: 'edge' } }, 'краи\u0306'), true);
    check('Ukrainian misspelling', e.fillRight(q, 'апостолл'), false);
    check('Ukrainian keywords', e.shortAnswerRight({ keywords: { uk: ['апост', 'церкв', 'віра'], en: ['apost', 'church', 'faith'] } }, 'апостоли церкви віра'), true);
    document.body.className = 'lang-es'; document.body.dataset.lang = 'es';
    check('Spanish source short answer', e.shortAnswerRight(sa, 'apostles church faith'), true);
    check('Spanish short answer', e.shortAnswerRight(sa, 'apóstoles iglesia fe'), true);
    check('Spanish fill accents folded', e.fillRight(q, 'el apostol'), true);
    const spanish = { answer: { en: 'year', es: 'año' } };
    check('Spanish ñ is kept', e.fillRight(spanish, 'ano'), false);
    check('Spanish ñ decomposed', e.fillRight(spanish, 'an\u0303o'), true);
    document.body.className = 'lang-en'; document.body.dataset.lang = 'en';
    check('Declared English page accepts its language only', e.fillRight(q, 'apóstol'), false);
    delete window.CTS_UNIT.sourceLang;
    check('Legacy English page still accepts Spanish fill', e.fillRight(q, 'apóstol'), true);
    document.body.className = 'lang-fr'; document.body.dataset.lang = 'fr';
    window.CTS_UNIT.sourceLang = 'es';
    check('Non-English source fill', e.fillRight(q, 'apóstol'), true);
    check('English is not hardcoded as source', e.fillRight(q, 'apostle'), false);
    check('Non-English source short answer', e.shortAnswerRight(sa, 'apóstoles iglesia fe'), true);
    return out;
  });
  for (const { label, actual, expected } of cases) { assert.equal(actual, expected, label); checks++; }
  // MC still uses position when the displayed options are French.
  await page.evaluate(() => { window.CTS_UNIT.mc.push({ stem: { fr: 'Question' }, options: { en: ['Wrong', 'Right'], fr: ['Faux', 'Vrai'] }, answer: 1 }); window.CTS_ENGINE.render(); });
  await page.locator('button.option[data-opt="1"]').click();
  assert.match(await page.locator('button.option[data-opt="1"]').getAttribute('class'), /correct/); checks++;
  assert.equal(await page.locator('button.option[data-opt="1"]').textContent(), 'B. Vrai');
  checks++;
  console.log(`PASS — multilingual engine: ${checks} browser assertions.`);
} finally { await browser.close(); }
