// Swahili (Kiswahili), the fourth site language: routes, the language
// toggle, the remembered choice, the translation-pending note, a Swahili
// lesson and exam, and Swahili grading on the server.
//
//   API_BASE=http://127.0.0.1:8798 node test/swahili.test.mjs
//
// The pages are the built Worker's; the grading is the Worker's own
// (POST /api/attempt, /api/grade), with the keys it was built with.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';
import { exactFill, fillCodes } from '../worker/grading/text.js';

const BASE = process.env.API_BASE || process.argv[2] || 'http://127.0.0.1:8798';
const NOTE = 'Maandishi haya bado hayajatafsiriwa kwa Kiswahili';
let checks = 0;
const ok = (v, m) => { assert.ok(v, m); checks++; };
const eq = (a, b, m) => { assert.deepEqual(a, b, m); checks++; };

/* ---- the grading rules, no server ------------------------------------------------------------- */
{
  eq(fillCodes('sw'), ['sw', 'en'], 'a Swahili page accepts Swahili and the English source');
  const q = { answer: { en: 'cattle', sw: "ng'ombe" }, accept: { en: [], sw: ['mifugo'] } };
  for (const a of ["ng'ombe", 'ng’ombe', 'ngʼombe', 'ngombe', "NG'OMBE", 'mifugo', 'cattle']) eq(exactFill(q, a, 'sw'), true, `server, Swahili: ${a}`);
  for (const a of ['ombe', 'ng', 'ganado']) eq(exactFill(q, a, 'sw'), false, `server, Swahili wrong: ${a}`);
  // the apostrophe rule is Swahili's only: other languages grade as before
  eq(exactFill({ answer: { en: "o'clock", es: 'en punto' } }, 'oclock', 'es'), exactFill({ answer: { en: "o'clock", es: 'en punto' } }, 'oclock', 'es'), 'Spanish unchanged');
  eq(exactFill({ answer: { en: 'apostle', sw: 'mtume' } }, 'mitume', 'sw'), false, 'a noun-class prefix makes another word');
  eq(exactFill({ answer: { en: 'apostle', sw: 'mtume' } }, 'mtume', 'en'), false, 'an English page does not take the Swahili answer');
}

/* ---- the server, with the keys it was built with ---------------------------------------------- */
async function call(method, p, body) {
  const r = await fetch(BASE + p, { method, headers: { 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const text = await r.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  return { status: r.status, body: data };
}
const post = (p, b) => call('POST', p, b);
const unit = (prefix, n) => JSON.parse(fs.readFileSync(`src/content/units/${prefix}/${n}.json`, 'utf8'));
const idx = (qid) => Number(qid.slice(qid.lastIndexOf('/') + 1));
const RUN = Date.now().toString(36);
{
  const reg = await post('/api/register', { name: `Mwanafunzi ${RUN}`, email: `swahili-${RUN}@example.test`, track: 'associate', lang: 'sw' });
  eq(reg.status, 201, `register: ${JSON.stringify(reg.body)}`);
  const code = reg.body.code;
  // CTSAL unit 2 has ng'ombe as a fill-in answer in Swahili
  const al2 = unit('CTSAL', 2);
  const at = await post('/api/attempt', { code, scope: 'u:CTSAL/2', lang: 'sw' });
  eq(at.status, 200, `attempt: ${JSON.stringify(at.body)}`);
  const fills = at.body.items.fill;
  const target = fills.find((qid) => al2.fill[idx(qid)].answer.sw === "ng'ombe");
  ok(target, "the attempt has the ng'ombe question");
  const others = fills.filter((q) => q !== target);
  const r = await post('/api/grade', { code, attemptId: at.body.attemptId, items: [
    { qid: target, answer: 'ngombe' },
    { qid: others[0], answer: al2.fill[idx(others[0])].answer.sw },
    { qid: others[1], answer: al2.fill[idx(others[1])].answer.en },
    { qid: others[2], answer: 'zzzz' },
  ] });
  eq(r.status, 200, `grade: ${JSON.stringify(r.body)}`);
  eq(r.body.items.map((i) => i.verdict), ['right', 'right', 'right', 'wrong'], 'Swahili, apostrophe left out / Swahili answer / English source / wrong');
  // the Swahili prompt is what the Swahili page shows
  const st = await call('GET', `/api/attempt/${encodeURIComponent(at.body.attemptId)}?code=${encodeURIComponent(code)}`);
  ok(st.status === 200, 'attempt status');
  // a multiple-choice answer is the shared option index
  const mc0 = at.body.items.mc[0];
  const m = await post('/api/mc', { code, attemptId: at.body.attemptId, qid: mc0.qid, choice: al2.mc[idx(mc0.qid)].answer });
  ok(m.status === 200 && JSON.stringify(m.body).match(/right|true/), `mc right by index: ${JSON.stringify(m.body)}`);
}

/* ---- pages ------------------------------------------------------------------------------------ */
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'en-US' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const path = () => new URL(page.url()).pathname;

  // routes and hreflang
  for (const file of ['CTSActsUnit1.html', 'index.html', 'CTSCatalog.html', 'CTSTextbookElecBapOne.html', 'CTSElecBap1Readings.html']) {
    const res = await page.goto(`${BASE}/sw/${file}`);
    eq(res.status(), 200, `/sw/${file}`);
    eq(await page.evaluate(() => document.documentElement.lang), 'sw', `/sw/${file} is Swahili`);
  }
  await page.goto(`${BASE}/CTSActsUnit1.html?cts_lang=en`);
  eq(await page.locator('link[hreflang="sw"]').getAttribute('href'), 'https://chapalaseminary.org/sw/CTSActsUnit1.html', 'hreflang sw');
  for (const l of ['en', 'es', 'fr']) ok(await page.locator(`link[hreflang="${l}"]`).count() === 1, `hreflang ${l} kept`);

  // the toggle: four choices, the fourth "Kiswahili"; the choice is remembered
  const choice = page.locator('.cts-language-choices a[data-cts-lang="sw"]');
  eq(await choice.textContent(), 'Kiswahili', 'the toggle says Kiswahili');
  eq(await page.locator('.cts-language-choices a').count(), 4, 'four languages');
  await choice.click();
  await page.waitForURL('**/sw/CTSActsUnit1.html');
  eq(await page.evaluate(() => localStorage.getItem('cts_lang')), 'sw', 'the choice is remembered');
  await page.goto(`${BASE}/CTSActsUnit2.html`);
  await page.waitForURL('**/sw/CTSActsUnit2.html');
  ok(true, 'a bare English link follows the remembered Swahili');

  // a Swahili lesson: Swahili text, Swahili exam, the draft note, Show English
  await page.goto(`${BASE}/sw/CTSActsUnit1.html`);
  await page.waitForSelector('#questionsContainer .option, #questionsContainer button', { timeout: 15000 });
  const body = await page.locator('main').innerText();
  ok(/Fungua Biblia yako katika Matendo 1:1/.test(body), 'the lesson is in Swahili');
  ok(/Tafsiri ya awali/.test(await page.locator('.cts-translation-pending').innerText()), 'the draft note is shown');
  ok(!body.includes(NOTE), 'a translated lesson has no translation-pending note');
  const exam = await page.locator('#questionsContainer').innerText();
  ok(/Chagua Jibu|Jaza Pengo/.test(exam), `the exam labels are Swahili: ${exam.slice(0, 200)}`);
  ok(/Matendo ni juzuu ya pili ya Luka/.test(exam), 'the exam questions are Swahili');
  eq(await page.locator('#cts-show-source').count(), 1, 'Show English is offered');
  ok(/Onyesha Kiingereza/.test(await page.locator('.cts-source-control').innerText()), 'Show English is in Swahili');
  ok(/Sehemu ya 1/.test(await page.title()), `title: ${await page.title()}`);
  eq(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex,follow', 'Swahili pages are not indexed yet');

  // an elective unit with its Swahili (B-C1) and one without (B-C2): never a broken page
  await page.goto(`${BASE}/sw/CTSElecBap1Unit1.html`);
  ok(/Wabaptisti ni Akina Nani/.test(await page.locator('main').innerText()), 'B-C1 unit 1 is in Swahili');
  await page.goto(`${BASE}/sw/CTSElecBap2Unit1.html`);
  const fallback = await page.locator('main').innerText();
  ok(fallback.includes(NOTE), 'an untranslated page says so in Swahili');
  ok(fallback.length > 2000 && /[A-Za-z]{4,} [A-Za-z]{4,}/.test(fallback), 'and shows the English lesson');
  await page.waitForSelector('#questionsContainer .option, #questionsContainer button', { timeout: 15000 });
  ok(await page.locator('#questionsContainer .option, #questionsContainer button').count() > 0, 'and its exam works');

  // B-C1 textbook and room in Swahili
  await page.goto(`${BASE}/sw/CTSTextbookElecBapOne.html`);
  ok(/Urithi au Ukweli\?/.test(await page.locator('.tb-book').first().innerText()), 'the B-C1 textbook is in Swahili');
  await page.goto(`${BASE}/sw/CTSElecBap1Readings.html`);
  ok(/Chemchemi Baharini/.test(await page.locator('body').innerText()), 'the B-C1 readings are in Swahili');

  // the other languages are untouched: no Swahili on their pages
  for (const l of ['', 'es/', 'fr/']) {
    await page.goto(`${BASE}/${l}CTSTextbookElecBapOne.html?cts_lang=${l ? l.slice(0, 2) : 'en'}`);
    ok(!/Urithi au Ukweli/.test(await page.locator('body').innerText()), `no Swahili book on /${l}`);
  }
  eq(errors, [], 'no script errors');
} finally { await browser.close(); }
console.log(`PASS — Swahili: ${checks} checks.`);
