#!/usr/bin/env node
/* One denominational elective's textbook and its private textbook test, from
 * the course's content folder (docs/textbooks.md, "Elective textbooks").
 *
 *   node tools/build-elective-textbook.mjs <CODE>            # check only
 *   node tools/build-elective-textbook.mjs <CODE> --write
 *     [--content DIR]   default $ELECTIVE_CONTENT or ../elective-content (beside this repo)
 *
 * CODE is A-C1 … D-C5; the course is tools/import-electives.mjs prefixOf(CODE)
 * (A-C1 -> CTSElecPC1). The book's slug and page are letters only, as
 * cts-sync.js and the textbook routes require: elec<tag><one..five> and
 * CTSTextbookElec<Tag><One..Five> (elecpcone, CTSTextbookElecPCOne).
 * <DIR>/<CODE>/textbook/ holds
 *   chapters.json  five { n, title, source, note?, paragraphs } in en, es, fr;
 *                  the same number of paragraphs in each language; text with
 *                  only <em> and <strong>
 *   bank.json      forty { id, chapter, en, answer_en, es, answer_es, fr, answer_fr },
 *                  eight on each chapter
 *   accept.json    { "<id>": { en, es, fr } } accepted alternates
 *   meta.json      { title, subtitle, credits (en, es, fr), words, rights?, edition? }
 *
 * --write writes
 *   src/content/textbooks/<slug>.json   public: the book in three languages
 *                                       (each chapter an <h2 id="en-N"> -- the
 *                                       French keeps the English ids, as every
 *                                       French book does -- a muted source line,
 *                                       the CTS note, the paragraphs), the test's
 *                                       forty prompts and chapters, draw 20, pass
 *                                       18, four per chapter, requiredFrom null,
 *                                       keys: "private"; no answer, accept or tr
 *                                       on any question
 *   <keys>/textbooks/<slug>.json        private: prompt, answer, accept, chapter
 *                                       and the French stamp of each question
 * keeps a book's number once given (a new book takes the next free one), then
 * runs tools/gen-worker-catalog.mjs and, when the course has its reading room,
 * tools/build-elective-readings.mjs <CODE> --write, which adds the room's
 * textbook notice and its French. Then build, pin the review passages
 * (node tools/exam-review.mjs dist --refresh-missing) and build again.
 * Running it twice writes the same files.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { TRADITIONS, prefixOf } from './import-electives.mjs';
import { resolveKeysRoot, privateReadingLeaks } from './grading-keys-lib.mjs';
import { hash, frenchSpaces } from './french-readings-lib.mjs';
import { questionStamps } from './french-readings.mjs';
import { fitFrench } from './french-fit.mjs';
import { refuseHeld } from './elective-held.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
process.chdir(ROOT);
const argv = process.argv.slice(2);
const WRITE = argv.includes('--write');
const opt = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
const CODE = argv.find((a, i) => !a.startsWith('--') && argv[i - 1] !== '--content');
if (!CODE || !/^[A-D]-C[1-5]$/.test(CODE)) { console.error('usage: node tools/build-elective-textbook.mjs <A-C1 … D-C5> [--write] [--content DIR]'); process.exit(2); }
refuseHeld(CODE, 'textbook');
const DIR = path.join(path.resolve(opt('--content') || process.env.ELECTIVE_CONTENT || path.join(ROOT, '..', 'elective-content')), CODE, 'textbook');
const LANGS = ['en', 'es', 'fr'];
const NUM = ['one', 'two', 'three', 'four', 'five'];
const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const writeJson = (f, d) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(d, null, 1) + '\n'); };
const fails = [];
const fail = (m) => fails.push(m);
const stop = () => { if (fails.length) { console.error(`${fails.length} problem(s); nothing written:`); fails.slice(0, 40).forEach((m) => console.error('  ' + m)); process.exit(1); } };
const run = (args) => {
  const r = spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) { console.error(`node ${args.join(' ')} failed:\n${r.stdout}\n${r.stderr}`); process.exit(1); }
  return r.stdout.trim().split('\n').filter(Boolean).slice(-1).join('');
};
const fold = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim();
const cap = (s) => s[0].toUpperCase() + s.slice(1);

/* ---- names ---- */
const prefix = prefixOf(CODE), tag = TRADITIONS[CODE[0]].tag, num = NUM[+CODE.slice(-1) - 1];
const slug = `elec${tag.toLowerCase()}${num}`;
const page = `CTSTextbookElec${tag}${cap(num)}`;
const out = `src/content/textbooks/${slug}.json`;
if (!fs.existsSync(`src/content/courses/${prefix}.json`)) { console.error(`src/content/courses/${prefix}.json is missing: import the course first`); process.exit(2); }
console.log(`${CODE} -> ${prefix}: textbook ${slug}, pages ${page}.html and ${page}Test.html, content ${DIR}`);

/* ---- the content ---- */
for (const f of ['chapters.json', 'bank.json', 'accept.json', 'meta.json']) if (!fs.existsSync(path.join(DIR, f))) { console.error(`${path.join(DIR, f)} is missing (the textbook may still be in progress)`); process.exit(2); }
const chapters = readJson(path.join(DIR, 'chapters.json'));
const bankFile = readJson(path.join(DIR, 'bank.json'));
const bank = Array.isArray(bankFile) ? bankFile : bankFile.questions;
const accept = readJson(path.join(DIR, 'accept.json'));
const meta = readJson(path.join(DIR, 'meta.json'));
for (const f of ['title', 'subtitle', 'credits']) for (const l of LANGS) if (typeof meta[f]?.[l] !== 'string' || !meta[f][l].trim()) fail(`meta.json: no ${l} ${f}`);
if (!Array.isArray(chapters) || chapters.length !== 5 || chapters.some((c, i) => c.n !== i + 1)) fail('chapters.json: five chapters, n = 1 to 5, in order');
const INLINE = /<(?!\/?(em|strong)>)[^>]*>/;
for (const c of chapters || []) {
  for (const f of ['title', 'source']) for (const l of LANGS) if (typeof c[f]?.[l] !== 'string' || !c[f][l].trim()) fail(`chapter ${c.n}: no ${l} ${f}`);
  if (c.note && LANGS.some((l) => typeof c.note[l] !== 'string' || !c.note[l].trim())) fail(`chapter ${c.n}: the note is not in all three languages`);
  const n = LANGS.map((l) => c.paragraphs?.[l]?.length ?? 0);
  if (!n[0] || new Set(n).size !== 1) fail(`chapter ${c.n}: ${n.join(' / ')} paragraphs in en / es / fr`);
  // The text is HTML: a bare ampersand (old printing's "&c.") is written &amp;.
  // Anything that is a character reference (&mdash;, &#8212;) stays, and the check below refuses it.
  for (const l of LANGS) if (Array.isArray(c.paragraphs?.[l])) c.paragraphs[l] = c.paragraphs[l].map((p) => (typeof p === 'string' ? p.replace(/&(?![a-zA-Z][a-zA-Z0-9]*;|#[0-9]+;|#x[0-9a-fA-F]+;)/g, '&amp;') : p));
  for (const l of LANGS) for (const [i, p] of (c.paragraphs?.[l] || []).entries()) {
    if (typeof p !== 'string' || !p.trim()) fail(`chapter ${c.n} ${l} ¶${i + 1}: empty`);
    else if (INLINE.test(p)) fail(`chapter ${c.n} ${l} ¶${i + 1}: markup other than <em> and <strong>`);
    else if (/<(script|style)/i.test(p) || /&(?!(amp|lt|gt);)[a-zA-Z#]/.test(p)) fail(`chapter ${c.n} ${l} ¶${i + 1}: an entity or script`);
  }
}
if (bank?.length !== 40) fail(`bank.json: ${bank?.length} questions, not 40`);
const per = {};
for (const q of bank || []) {
  per[q.chapter] = (per[q.chapter] || 0) + 1;
  for (const l of LANGS) {
    if (!q[l] || !q[`answer_${l}`]) fail(`bank #${q.id}: no ${l} prompt or answer`);
    else if (q[l].replace(/_{3,}/g, '____').split('____').length !== 2) fail(`bank #${q.id}: not one blank in ${l}`);
  }
}
if ([1, 2, 3, 4, 5].some((c) => per[c] !== 8)) fail(`bank.json: ${JSON.stringify(per)} questions per chapter; eight on each of five`);
for (const id of Object.keys(accept)) if (!/^_/.test(id) && !(bank || []).some((q) => String(q.id) === id)) fail(`accept.json: "${id}" is no question's id`);
stop();

/* ---- the book ---- */
/* Each French passage carries its English tags (tools/french-fit.mjs drops
   extra French italics and says so; anything else stops the run). */
const dropped = [];
// stored French is French-spaced (« », ; : ? !), as tools/french-readings.mjs stores it and the pages show it
const fit = (en, fr, where) => { const r = fitFrench(en, fr); r.dropped.forEach((d) => dropped.push(`${where}: ${d}`)); if (r.problem) fail(`${where}: the French ${r.problem}`); return frenchSpaces(r.fr); };
for (const c of chapters) {
  for (const f of ['title', 'source', 'note']) if (c[f]) c[f] = { ...c[f], fr: fit(c[f].en, c[f].fr, `chapter ${c.n} ${f}`) };
  c.paragraphs = { ...c.paragraphs, fr: c.paragraphs.fr.map((p, i) => fit(c.paragraphs.en[i], p, `chapter ${c.n} ¶${i + 1}`)) };
}
if (dropped.length) console.log(`French italics dropped to match the English tags (${dropped.length}):\n  ${dropped.join('\n  ')}`);
stop();
const idOf = (l) => (l === 'fr' ? 'en' : l);   // a French book keeps the English ids
const body = Object.fromEntries(LANGS.map((l) => [l, chapters.map((c) =>
  `<h2 id="${idOf(l)}-${c.n}">${c.n}. ${c.title[l]}</h2><p class="small muted">${c.source[l]}</p>`
  + (c.note ? `<p class="small cts-note">${c.note[l]}</p>` : '')
  + c.paragraphs[l].map((p) => `<p>${p}</p>`).join('')).join('\n')]));
const blank = (s) => s.replace(/_{3,}/g, '____').trim();
const keyed = bank.map((q) => {
  const alt = accept[String(q.id)] || {};
  const list = (l) => { const seen = new Set([fold(q[`answer_${l}`])]); return (alt[l] || []).filter((a) => { const k = fold(a); if (seen.has(k)) return false; seen.add(k); return true; }); };
  return { prompt: Object.fromEntries(LANGS.map((l) => [l, l === 'fr' ? frenchSpaces(blank(q[l])) : blank(q[l])])), answer: Object.fromEntries(LANGS.map((l) => [l, q[`answer_${l}`]])),
    accept: Object.fromEntries(LANGS.map((l) => [l, list(l)])), chapter: q.chapter };
});
// in chapter order, so the question ids (tb:<slug>/fill/<i>) follow the book
keyed.sort((a, b) => a.chapter - b.chapter);
const stamps = questionStamps(keyed);
keyed.forEach((q, i) => { q.tr = { fr: { status: 'machine', from: stamps[i] } }; });
const previous = fs.existsSync(out) ? readJson(out) : null;
const numbers = fs.readdirSync('src/content/textbooks').filter((f) => f.endsWith('.json') && f !== `${slug}.json`).map((f) => readJson(`src/content/textbooks/${f}`).number);
const number = previous?.number ?? Math.max(0, ...numbers) + 1;
const machine = (en) => ({ fr: { status: 'machine', from: hash(en) } });
const book = {
  slug, page, course: prefix, number,
  title: { en: meta.title.en, es: meta.title.es, fr: frenchSpaces(meta.title.fr) },
  subtitle: { ...meta.subtitle, fr: frenchSpaces(meta.subtitle.fr) }, credits: { ...meta.credits, fr: frenchSpaces(meta.credits.fr) },
  edition: meta.edition || 'Public-domain original / CTS interim elective edition 2026',
  files: { excerpts: true },
  requiredFrom: null,
  keys: 'private',
  tr: { subtitle: machine(meta.subtitle.en), credits: machine(meta.credits.en), body: machine(body.en) },
  body,
  test: { draw: 20, pass: 18, perChapter: 4, questions: keyed.map((q) => ({ prompt: q.prompt, chapter: q.chapter })) },
};
const leaks = privateReadingLeaks(book, out);
if (leaks.length) { leaks.forEach((m) => console.error(m)); process.exit(1); }
const words = Object.fromEntries(LANGS.map((l) => [l, body[l].replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length]));
console.log(`book ${number}: ${chapters.length} chapters, ${words.en} / ${words.es} / ${words.fr} words (en / es / fr); test 40 questions, 8 per chapter${meta.rights ? '; meta.json has a rights note' : ''}`);
if (!WRITE) { console.log(`PASS — ${CODE}: the textbook and its test are sound. Run with --write.`); process.exit(0); }

const keys = resolveKeysRoot('.');
if (!keys) { console.error('the private assessment-keys checkout is missing (ASSESSMENT_KEYS or ../assessment-keys)'); process.exit(2); }
writeJson(out, book);
writeJson(path.join(keys, 'textbooks', `${slug}.json`), { slug, test: { questions: keyed } });
console.log(`wrote ${out} (prompts only) and ${path.join(keys, 'textbooks', slug)}.json (keys); ${run(['tools/gen-worker-catalog.mjs'])}`);
if (fs.existsSync(`src/body/rooms/${prefix}Readings.html`)) console.log(`the reading room: ${run(['tools/build-elective-readings.mjs', CODE, '--write', ...(opt('--content') ? ['--content', opt('--content')] : [])])}`);
console.log('Done. Now: npm run build; node tools/exam-review.mjs dist --refresh-missing; npm run build.');
