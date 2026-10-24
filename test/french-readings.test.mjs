/* French reading material (tools/french-readings.mjs): the stored French is
 * sound, the French pages show it as a draft, and the English and Spanish
 * pages do not change.
 *
 *   node test/french-readings.test.mjs              # data and built pages (dist/)
 *   node test/french-readings.test.mjs <base-url>   # the French tests in a browser
 *
 * Data: every French body keeps its English's markup passage for passage;
 * every French prompt has one blank; every answer key -- French and English
 * -- is marked right by the shipped grader on the French page, and a wrong
 * answer is not; every stored passage carries machine-or-reviewed provenance
 * and the same tags as its English. Built: each French page with French
 * reading content is noindex with the draft notice, shows the French with the
 * English as its source, and the English and Spanish pages carry none of it.
 * Stale French (its English changed) is reported, not failed: lessons work
 * the same way, and `node tools/french-readings.mjs check` lists it. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { parse } from 'node-html-parser';
import { bodyLeaves, translatable, tagProblem, loadStore, DIGEST, roomKey, chromeRoomKeys } from '../tools/french-readings-lib.mjs';
import { status } from '../tools/french-readings.mjs';
import { textbookQuestions, readingQuestions } from '../tools/grading-keys-lib.mjs';

const BASE = process.argv[2];
let checks = 0;
const ok = (c, m) => { assert.ok(c, m); checks++; };
const json = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const records = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => json(path.join(dir, f)));
const books = records('src/content/textbooks').map((b) => {
  const { questions: keyed } = textbookQuestions('.', b.slug);
  // Keep public prompt/tr; only answer/accept come from assessment-keys --
  // and, for a private bank (keys: "private"), the French stamps too.
  const questions = b.test.questions.map((q, i) => ({
    ...q,
    answer: keyed[i]?.answer,
    ...(keyed[i]?.accept ? { accept: keyed[i].accept } : {}),
    ...(b.keys === 'private' && keyed[i]?.tr ? { tr: keyed[i].tr } : {}),
  }));
  return { ...b, test: { ...b.test, questions } };
});
// a private reading bank (keys: "private") is checked with its keys from assessment-keys
const readings = records('src/content/readings').map((r) => ({ ...r, test: { ...r.test, questions: readingQuestions('.', r).questions } }));
const french = [...books, ...readings].filter((r) => r.body?.fr || r.test.questions.some((q) => q.prompt.fr));

if (!BASE) {
  // ---- the data ----------------------------------------------------------------
  const w = {};
  vm.runInNewContext(fs.readFileSync('public/assets/js/cts-fill.js', 'utf8'), { window: w, document: {}, setTimeout, clearTimeout });
  const right = (q, a) => w.CTSFill.fillRight(q, a, ['fr', 'en']);
  for (const r of french) {
    if (r.body?.fr) {
      const en = bodyLeaves(r.body.en).list, fr = bodyLeaves(r.body.fr).list;
      ok(en.length === fr.length, `${r.slug}: the French body has ${fr.length} passages, the English ${en.length}`);
      en.forEach((l, i) => ok(l.tagName === fr[i]?.tagName && !tagProblem(l.innerHTML, fr[i].innerHTML) || !translatable(l),
        `${r.slug}: French passage ${i + 1} does not keep its English markup`));
      ok(['human', 'machine', 'machine-edited'].includes(r.tr?.body?.fr?.status), `${r.slug}: the French body has no provenance`);
    }
    for (const [i, q] of r.test.questions.entries()) {
      if (q.prompt.fr == null) continue;
      const at = `${r.slug} Q${i + 1}`;
      ok(q.prompt.fr.split('____').length === 2, `${at}: the French prompt has one blank`);
      ok(q.tr?.fr?.status && q.tr.fr.from?.length === 12, `${at}: no French provenance`);
      ok(right(q, q.answer.fr), `${at}: the French key is marked wrong`);
      ok(right(q, q.answer.en), `${at}: the English key is marked wrong on the French page`);
      for (const a of q.accept?.fr || []) ok(right(q, a), `${at}: the accepted French "${a}" is marked wrong`);
      ok(!right(q, 'réponse sans rapport'), `${at}: an unrelated answer is marked right`);
      // English and Spanish pages grade as before: French is not accepted there
      ok(w.CTSFill.fillRight(q, q.answer.en, ['en', 'es']), `${at}: the English page no longer accepts its key`);
    }
  }
  const { files } = loadStore();
  for (const { file, data } of files) for (const [key, e] of Object.entries(data.entries || {})) {
    ok(['human', 'machine', 'machine-edited'].includes(e.tr?.fr?.status) && e.tr.fr.from === key, `${file} ${key}: no provenance`);
    ok(!tagProblem(e.en, e.fr), `${file} ${key}: the French does not keep the English tags`);
  }
  const { rows, orphans } = status();
  const stale = rows.filter((r) => r.stale);
  if (stale.length || orphans.length) console.log(`  note: ${stale.length} item(s) with stale French, ${orphans.length} unused stored passage(s): node tools/french-readings.mjs check`);

  // ---- the built pages -----------------------------------------------------------
  if (!fs.existsSync('dist/fr')) { console.log('  (no dist/: run npm run build to check the pages)'); }
  else {
    const pages = new Map();
    for (const r of french) {
      const fields = Object.keys(r.tr || {});
      // a passage the same in both languages ("Introduction.") is not a sample, as for the rooms below
      // (or in French and Spanish: a signature, "W. J. Seymour.")
      const enLeaves = r.body?.en ? bodyLeaves(r.body.en).list : [], esLeaves = r.body?.es ? bodyLeaves(r.body.es).list : [];
      if (fields.length) pages.set(`${r.page}.html`, r.body?.fr ? bodyLeaves(r.body.fr).list.map((l, i) => [l, enLeaves[i], esLeaves[i]])
        .filter(([l, e, s]) => translatable(l) && l.text.trim() !== e?.text.trim() && l.text.trim() !== s?.text.trim()).map(([l]) => l.text.trim()) : []);
      pages.set(`${r.page}Test.html`, []);
    }
    for (const { data } of files) {
      const id = data.item.split(':')[1];
      const page = data.item.startsWith('digest:') ? `${id}.html` : data.item.startsWith('room:') ? `${id}.html` : null;
      // A book title kept in English is the same on every page: not a sample;
      // nor is a room's interface, which its own dictionary (_rooms.json) translates.
      if (page) pages.set(page, Object.values(data.entries).filter((e) => parse(e.fr).text.trim() !== parse(e.en).text.trim() && !chromeRoomKeys().has(roomKey(e.en)))
        .map((e) => parse(e.fr).text.trim()).filter((t) => t.length > 40).slice(0, 3));
    }
    // A digest's French also appears in the room that shows it.
    for (const f of fs.readdirSync('dist').filter((f) => /Readings\.html$/.test(f)))
      if (!pages.has(f) && /class="cts-reading" lang="fr">/.test(fs.readFileSync(path.join('dist/fr', f), 'utf8'))) pages.set(f, []);
    for (const [page, sample] of pages) {
      const fr = fs.readFileSync(path.join('dist/fr', page), 'utf8');
      const root = parse(fr);
      ok(/<meta name="robots" content="noindex/.test(fr), `fr/${page}: a draft French page must be noindex`);
      ok(root.querySelectorAll('.cts-translation-pending[lang="fr"]').some((n) => n.text.startsWith('Traduction provisoire')), `fr/${page}: no draft notice`);
      ok(!root.querySelectorAll('.cts-translation-pending').some((n) => !n.text.startsWith('Traduction provisoire') && /not available|pas encore disponible/.test(n.text)), `fr/${page}: still says its French is not available`);
      const shown = root.querySelectorAll('.cts-reading[lang="fr"]').map((n) => n.text).join('\n');
      for (const s of sample) ok(shown.includes(s.slice(0, 60)), `fr/${page}: French passage not shown: ${s.slice(0, 60)}`);
      if (sample.length) ok(root.querySelectorAll('.cts-reading[lang="fr"] + .cts-source[lang="en"]').length > 0, `fr/${page}: the English source is not beside the French`);
      for (const lang of ['', 'es']) {
        const other = fs.readFileSync(path.join('dist', lang, page), 'utf8');
        const contentOnly = parse(other);
        // Language names declare their own language even on another edition.
        for (const choice of contentOnly.querySelectorAll('[data-cts-lang]')) choice.remove();
        ok(!/(?<![a-z-])lang="fr"|class="[^"]*\blang-fr\b/.test(contentOnly.toString().replace(/<script[\s\S]*?<\/script>/g, '')), `${lang || 'en'}/${page}: carries French teaching markup`);
        for (const s of sample) ok(!other.includes(s.slice(0, 60)), `${lang || 'en'}/${page}: shows French text`);
        ok(!/Traduction provisoire/.test(other), `${lang || 'en'}/${page}: shows the French draft notice`);
      }
    }
    // the test stands apart from the book in French too (the browser's Find)
    for (const r of books.filter((b) => b.body.fr && !b.files?.html)) { // a book read on its own page has no body text here
      const test = fs.readFileSync(path.join('dist/fr', `${r.page}Test.html`), 'utf8');
      // as tools/verify-textbooks.mjs does for EN/ES: a question may quote one of
      // the book's sentences; a whole paragraph is the book itself
      const sample = bodyLeaves(r.body.fr).list.filter((l) => l.tagName === 'P' && l.text.trim().length > 220)
        .filter((_, i) => i % 5 === 0).map((l) => l.text.trim().slice(0, 160));
      ok(sample.length && !sample.some((t) => test.includes(t)), `fr/${r.page}Test.html carries the French book's text`);
    }
    console.log(`  ${pages.size} French reading page(s) checked`);
  }
  console.log(`${checks} French reading checks — PASS; French stored with provenance, keys graded, drafts marked, English and Spanish untouched.`);
} else {
  // ---- in a browser: a French test page, answered in French and in English --------
  const { chromium } = await import('playwright');
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  try {
    for (const r of french.filter((r) => r.test.questions.some((q) => q.prompt.fr)).slice(0, 4)) {
      const ctx = await browser.newContext({ extraHTTPHeaders: { 'x-test-grading-mode': 'shadow' } });
      await ctx.route('**/*', (route) => (route.request().url().startsWith(BASE) ? route.continue() : route.abort()));
      const p = await ctx.newPage();
      const errors = [];
      p.on('pageerror', (e) => errors.push(e.message));
      await p.goto(`${BASE}/fr/${r.page}Test.html?cts_lang=fr`, { waitUntil: 'load' });
      await p.evaluate(() => { localStorage.setItem('cts_student', JSON.stringify({ name: 'T', track: 'cert' })); });
      await p.reload({ waitUntil: 'load' });
      const T = await p.evaluate(() => window.CTS_TEXTBOOK_TEST), d = await p.evaluate(() => window.CTS_TEXTBOOK.draw());
      const first = T.questions[d[0]], second = T.questions[d[1]];
      const q0 = await p.locator('[data-cts-fill="0"] .cts-reading').first().textContent();
      ok(q0.includes(first.prompt.fr.split('____')[0].trim().slice(0, 20)), `fr/${r.page}Test.html: the question is not shown in French: ${q0}`);
      const answer = async (i, text) => {
        await p.locator(`input[data-cts-fill="${i}"]`).fill(text);
        await p.locator(`button[data-cts-fill-check="${i}"]`).click();
        return p.locator(`div[data-cts-fill="${i}"]`).innerText();
      };
      ok(/Correct/.test(await answer(0, first.answer.fr.toUpperCase())), `fr/${r.page}Test.html: the French answer is marked wrong`);
      ok(/Correct/.test(await answer(1, second.answer.en)), `fr/${r.page}Test.html: the English answer is marked wrong`);
      const wrong = await answer(2, 'xyzzy');
      const verdict = await p.locator('div[data-cts-fill="2"] .cts-fill-bad').innerText();
      ok(verdict.trim() === '✗ Incorrect.' && !/Réponse\s*:/.test(wrong), `fr/${r.page}Test.html: a wrong answer must show correctness only`);
      ok(errors.length === 0, `fr/${r.page}Test.html: ${errors[0]}`);
      // the English page still asks in English, and still takes English answers
      await p.goto(`${BASE}/${r.page}Test.html?cts_lang=en`, { waitUntil: 'load' });
      const e0 = await p.locator('[data-cts-fill="0"]').first().innerText();
      const Te = await p.evaluate(() => window.CTS_TEXTBOOK_TEST), de = await p.evaluate(() => window.CTS_TEXTBOOK.draw());
      ok(e0.includes(Te.questions[de[0]].prompt.en.split('____')[0].trim().slice(0, 20)) && !e0.includes(Te.questions[de[0]].prompt.fr.split('____')[0].trim().slice(0, 20)), `${r.page}Test.html: the English page is not in English`);
      await ctx.close();
    }
  } finally { await browser.close(); }
  console.log(`${checks} French reading-test browser checks — PASS; French questions, French and English answers accepted.`);
}
