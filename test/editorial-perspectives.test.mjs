// Supported alternative readings must pass the shipped engine in each language.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { parse } from 'node-html-parser';

const questions = [
  JSON.parse(fs.readFileSync('src/content/units/CTSActs/6.json', 'utf8')).sa[5],
  JSON.parse(fs.readFileSync('src/content/units/CTSActs/7.json', 'utf8')).sa[8],
];
const answers = {
  en: [
    [
      "God's grace initiates salvation; I understand his choosing as unconditional election. The Gentiles heard the preached gospel and responded in faith, showing that divine sovereignty does not cancel human responsibility.",
      "I read the appointing in light of God's foreknowledge. His grace enables people to respond in faith as they hear the gospel preached. Luke describes the Gentiles rejoicing and believing rather than people saving themselves.",
    ],
    [
      "The Lord's presence with Paul in Corinth removes fear and encourages him to keep preaching. A Reformed pastor may understand God's people as elect, while trusting God for a harvest whose results are not yet visible.",
      "An Arminian missionary can take the same comfort: God is with Paul in Corinth, so he should not be afraid or stop speaking. Keep preaching faithfully and trust God even when the results are hidden.",
    ],
  ],
  es: [
    [
      'La gracia de Dios inicia la salvación; entiendo su elección como incondicional. Los gentiles oyeron el evangelio predicado y respondieron por fe. La soberanía divina no elimina la responsabilidad humana.',
      'Leo la ordenación a la luz de la presciencia de Dios. Su gracia permite responder por fe al evangelio predicado. Lucas describe a los gentiles que se alegran y creen, no a personas que se salvan a sí mismas.',
    ],
    [
      'La presencia del Señor con Pablo en Corinto vence el temor y lo anima a seguir predicando. Un pastor reformado puede entender al pueblo de Dios como elegido y confiar en la cosecha aún no visible.',
      'Un misionero arminiano recibe el mismo aliento: Dios está contigo en Corinto, así que no tengas miedo ni dejes de hablar. Sigue predicando fielmente y confía en Dios aunque los resultados estén ocultos.',
    ],
  ],
  fr: [
    [
      'La grâce de Dieu prend l’initiative du salut ; je comprends son choix comme une élection inconditionnelle. Les païens ont entendu la parole prêchée et ont répondu par la foi. La souveraineté divine ne supprime pas la responsabilité humaine.',
      'Je lis cette destination à la lumière de la prescience de Dieu. Sa grâce permet une réponse par la foi à l’Évangile annoncé. Luc décrit les païens qui se réjouissent et croient, et non des personnes qui se sauvent elles-mêmes.',
    ],
    [
      'La présence du Seigneur avec Paul à Corinthe chasse la peur et l’encourage à continuer de prêcher. Un pasteur réformé peut comprendre ce peuple comme élu, en faisant confiance à Dieu pour une moisson encore cachée.',
      'Un missionnaire arminien reçoit le même réconfort : Dieu est avec toi à Corinthe, alors ne crains pas et continue de parler. Annonce fidèlement l’Évangile et fais confiance à Dieu même si le résultat n’est pas encore visible.',
    ],
  ],
};
let checks = 0;
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
try {
  for (const lang of ['en', 'es', 'fr']) {
    const page = await browser.newPage();
    await page.setContent(`<html lang="${lang}"><body data-lang="${lang}" class="lang-${lang}"><div id="questionsContainer"></div><div id="kwContainer"></div><button id="submitExamBtn"></button><div id="examResult"></div></body></html>`);
    await page.evaluate(() => {
      Object.defineProperty(document, 'readyState', { configurable: true, get: () => 'loading' });
      window.CTS_UNIT = { course: 'editorial-check', unit: 1, totalUnits: 1, sourceLang: 'en', langs: ['en', 'es', 'fr'], mc: [], fill: [], sa: [] };
    });
    await page.addScriptTag({ path: path.resolve('public/assets/js/cts-engine.js') });
    await page.evaluate(() => document.dispatchEvent(new Event('DOMContentLoaded')));
    const results = await page.evaluate(({ questions, answers, lang }) => questions.map((q, i) => ({
      alternatives: answers[i].map(a => window.CTS_ENGINE.shortAnswerRight(q, a)),
      model: window.CTS_ENGINE.shortAnswerRight(q, q.model[lang]),
      blank: window.CTS_ENGINE.shortAnswerRight(q, ''),
      irrelevant: window.CTS_ENGINE.shortAnswerRight(q, 'I enjoy walking outdoors and cooking dinner.'),
      copied: window.CTS_ENGINE.shortAnswerRight(q, q.prompt[lang]),
    })), { questions, answers: answers[lang], lang });
    for (const [i, result] of results.entries()) {
      assert.deepEqual(result, { alternatives: [true, true], model: true, blank: false, irrelevant: false, copied: false }, `${lang} Acts ${i === 0 ? 6 : 7}`);
      checks += 6;
    }
    await page.close();
  }
} finally { await browser.close(); }

// Every built language page must carry its own notice, including direct reader links.
const notice = JSON.parse(fs.readFileSync('src/data/editorial-notices.json', 'utf8')).blaikie;
for (const [lang, prefix, suffix] of [['en', '', 'English'], ['es', 'es/', 'Spanish'], ['fr', 'fr/', 'French']]) {
  for (const file of [`${prefix}CTSJoshReadings.html`, `${prefix}CTSTextbookJoshua.html`, `textbooks/CTSJoshua_Blaikie_${suffix}.html`]) {
    const root = parse(fs.readFileSync(`dist/${file}`, 'utf8'));
    const n = root.querySelector('[data-cts-editorial="blaikie"]');
    assert.ok(n, file);
    const normalize = s => s.replace(/\s+/g, ' ').trim();
    assert.ok(normalize(n.text).includes(normalize(notice.body[lang])), `${file}: translated notice`);
    checks += 2;
  }
  const room = parse(fs.readFileSync(`dist/${prefix}CTSGalatiansReadings.html`, 'utf8'));
  assert.ok(room.querySelector('[data-cts-editorial="perspectives"]'), `${lang}: perspective notice`);
  assert.doesNotMatch(room.text, /our course leans toward|se inclina nuestro curso/);
  checks += 2;
}
console.log(`PASS — ${checks} editorial/alternative-answer checks in EN/ES/FR.`);
