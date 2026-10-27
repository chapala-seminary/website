#!/usr/bin/env node
/* An elective's textbook, textbook test and required-reading test in a later
 * language (Swahili first), from the translators' Markdown and their private
 * key file. See docs/swahili.md.
 *
 *   node tools/import-language-books.mjs --lang sw --code B-C1 --from <dir> --keys-file <file> [--write]
 *
 *   <dir>/textbook.sw.md        the book: "## N. Title", then the source line,
 *                               the CTS note and the paragraphs, one Markdown
 *                               paragraph for each paragraph of the English
 *   <dir>/textbook-test.sw.md   forty numbered questions, each with one ______
 *   <dir>/readings-test.sw.md   forty numbered questions on the five readings
 *   <keys-file>                 { textbook: [{ n, answer_en, answer_sw, accept_sw }],
 *                                 readings: [{ id, answer_en, answer_sw, accept_sw }] }
 *                               (assessment-keys, branch swahili-electives:
 *                               translations/sw/electives/<CODE>.keys.sw.json)
 *
 * It writes
 *   src/content/textbooks/<slug>.json    body.<lang> (the English markup, its
 *                                        words in <lang>: same ids, same
 *                                        paragraphs) and each test prompt
 *   src/content/readings/<slug>readings.json   each test prompt
 *   <keys>/textbooks/<slug>.json, <keys>/readings/<slug>readings.json
 *                                        prompt, answer, accept and the stamp
 *                                        tr.<lang> of each question (private)
 * Nothing is written when a count differs, a question has no blank, or the
 * key file's English answer is not the site's: the error says where.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { translationPlan } from './translation-plan.mjs';
import { resolveKeysRoot } from './grading-keys-lib.mjs';
import { prefixOf, TRADITIONS } from './import-electives.mjs';

const argv = process.argv.slice(2);
const opt = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
const LANG = opt('--lang'), CODE = opt('--code'), FROM = opt('--from'), KEYFILE = opt('--keys-file'), WRITE = argv.includes('--write');
if (!LANG || !CODE || !FROM || !KEYFILE) { console.error('usage: node tools/import-language-books.mjs --lang sw --code B-C1 --from <dir> --keys-file <file> [--write]'); process.exit(2); }
const KEYS = resolveKeysRoot();
if (!KEYS) { console.error('set ASSESSMENT_KEYS to the assessment-keys checkout'); process.exit(2); }

const NUM = ['one', 'two', 'three', 'four', 'five'];
const tag = TRADITIONS[CODE[0]].tag, slug = `elec${tag.toLowerCase()}${NUM[+CODE.slice(-1) - 1]}`;
const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const errors = [];
const md = (name) => { const f = path.join(FROM, name); if (!fs.existsSync(f)) { errors.push(`no ${f}`); return ''; } return fs.readFileSync(f, 'utf8'); };
const paragraphs = (text) => text.replace(/\r/g, '').split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
const unesc = (s) => s.replace(/\\([\\`*_{}\[\]()#+\-.!|<>~"'&])/g, '$1');
/* Markdown inline to the book's markup: text, <em> and <strong> only, UTF-8 (no entities). */
function inline(s) {
  let t = unesc(s.replace(/\s+/g, ' ').trim()).replace(/&/g, '＆').replace(/</g, '‹').replace(/>/g, '›');
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*\w])\*(?!\s)(.+?)\*(?!\w)/g, '$1<em>$2</em>').replace(/(^|[^\w])_(?!\s)(.+?)_(?!\w)/g, '$1<em>$2</em>');
  return t.replace(/＆/g, '&amp;').replace(/‹/g, '&lt;').replace(/›/g, '&gt;');
}
/* "1. text" lines, numbered in order across the file. */
function numbered(text, where) {
  const out = [];
  for (const line of text.replace(/\r/g, '').split('\n')) {
    const m = /^\s*(\d+)\\?\.\s+(.*)$/.exec(line);
    if (m) out.push(inline(m[2].replace(/(?:\\?_){3,}/g, '\u2063')).replace(/\u2063/g, '____'));
  }
  out.forEach((q, i) => { if ((q.match(/____/g) || []).length !== 1) errors.push(`${where} question ${i + 1}: needs exactly one blank`); });
  return out;
}
const stamps = (questions) => translationPlan({ sourceLang: 'en', blocks: [] },
  { fill: questions.map((q) => ({ prompt: { en: q.prompt.en }, answer: { en: q.answer.en }, ...(q.accept?.en ? { accept: { en: q.accept.en } } : {}) })) }, LANG).jobs.map((j) => j.stamp);
const sameAnswer = (a, b) => String(a).trim().toLowerCase() === String(b).trim().toLowerCase();

const keyFile = readJson(KEYFILE);
const writes = [];

/* ---------------- the textbook */
const bookFile = `src/content/textbooks/${slug}.json`, bookKeys = path.join(KEYS, 'textbooks', `${slug}.json`);
const book = readJson(bookFile), bookPriv = readJson(bookKeys);
{
  const en = parse(book.body.en).childNodes.filter((n) => n.tagName);
  const sw = paragraphs(md(`textbook.${LANG}.md`));
  const start = sw.findIndex((p) => /^##\s/.test(p));
  const body = start < 0 ? [] : sw.slice(start);
  if (body.length !== en.length) errors.push(`textbook: ${body.length} ${LANG} paragraphs from the first "## " on, ${en.length} in the English`);
  else {
    const out = en.map((node, i) => {
      let text = body[i];
      const heading = /^##\s+(.*)$/.exec(text);
      if ((node.tagName === 'H2') !== !!heading) { errors.push(`textbook paragraph ${i + 1}: a heading in one language only`); return ''; }
      if (heading) text = heading[1];
      const cls = node.getAttribute('class') || '';
      if (cls.includes('muted')) text = text.replace(/^_(.*)_$/s, '$1');                  // the source line, italic in Markdown
      if (cls.includes('cts-note')) text = text.replace(/^\*\*([^*]+:)\*\*\s*/, '$1 ');    // "CTS note:" is plain in the English
      const copy = parse(node.toString()).firstChild;
      copy.set_content(inline(text));
      return copy.toString();
    });
    book.body[LANG] = out.join('');
  }
  const prompts = numbered(md(`textbook-test.${LANG}.md`), 'textbook test');
  const keys = keyFile.textbook || [];
  const qs = book.test.questions, priv = bookPriv.test.questions;
  if (prompts.length !== qs.length || keys.length !== qs.length || priv.length !== qs.length) errors.push(`textbook test: ${prompts.length} ${LANG} questions, ${keys.length} keys, ${qs.length} on the site`);
  else {
    const st = stamps(priv);
    priv.forEach((q, i) => {
      const k = keys[i];
      if (k.chapter != null && k.chapter !== q.chapter) errors.push(`textbook test ${i + 1}: chapter ${k.chapter} in the keys, ${q.chapter} on the site`);
      if (!sameAnswer(k.answer_en, q.answer.en)) errors.push(`textbook test ${i + 1}: the key file's English answer "${k.answer_en}" is not the site's "${q.answer.en}"`);
      if (!k.answer_sw) errors.push(`textbook test ${i + 1}: no ${LANG} answer`);
      q.prompt[LANG] = qs[i].prompt[LANG] = prompts[i];
      q.answer[LANG] = k[`answer_${LANG}`];
      if (q.accept) q.accept[LANG] = (k[`accept_${LANG}`] || []).filter((a) => !sameAnswer(a, k[`answer_${LANG}`]));
      q.tr = { ...(q.tr || {}), [LANG]: { status: 'machine', from: st[i] } };
    });
  }
  writes.push([bookFile, book], [bookKeys, bookPriv]);
}

/* ---------------- the required-reading test */
const rSlug = `${slug}readings`;
const readFile = `src/content/readings/${rSlug}.json`, readKeys = path.join(KEYS, 'readings', `${rSlug}.json`);
if (fs.existsSync(readFile) && fs.existsSync(readKeys)) {
  const reading = readJson(readFile), readPriv = readJson(readKeys);
  const prompts = numbered(md(`readings-test.${LANG}.md`), 'reading test');
  const keys = keyFile.readings || [];
  const qs = reading.test.questions, priv = readPriv.test.questions;
  if (prompts.length !== qs.length || keys.length !== qs.length || priv.length !== qs.length) errors.push(`reading test: ${prompts.length} ${LANG} questions, ${keys.length} keys, ${qs.length} on the site`);
  else {
    const st = stamps(priv);
    priv.forEach((q, i) => {
      const k = keys[i];
      if (!sameAnswer(k.answer_en, q.answer.en)) errors.push(`reading test ${i + 1}: the key file's English answer "${k.answer_en}" is not the site's "${q.answer.en}"`);
      if (!k[`answer_${LANG}`]) errors.push(`reading test ${i + 1}: no ${LANG} answer`);
      q.prompt[LANG] = qs[i].prompt[LANG] = prompts[i];
      q.answer[LANG] = k[`answer_${LANG}`];
      if (q.accept) q.accept[LANG] = (k[`accept_${LANG}`] || []).filter((a) => !sameAnswer(a, k[`answer_${LANG}`]));
      q.tr = { ...(q.tr || {}), [LANG]: { status: 'machine', from: st[i] } };
    });
  }
  writes.push([readFile, reading], [readKeys, readPriv]);
} else errors.push(`no reading test for ${prefixOf(CODE)} (${readFile})`);

/* ---------------- the reading room's five digests
   Kept beside the page, not in it (the room page is generated by
   tools/build-elective-readings.mjs): src/data/interface/rooms/<lang>/<Page>.json
   holds each digest as the English digest's markup with its words in <lang>.
   tools/language-pages.mjs puts them in on that language's page only. */
const roomPage = `${prefixOf(CODE)}Readings`, roomSrc = `src/body/rooms/${roomPage}.html`;
if (fs.existsSync(roomSrc) && fs.existsSync(path.join(FROM, `readings.${LANG}.md`))) {
  const room = parse(fs.readFileSync(roomSrc, 'utf8'), { comment: true });
  const digests = room.querySelectorAll('.lang-en.dg-block');
  // the digests in the Markdown: from each "### " to the next "---" or "## "
  const lines = md(`readings.${LANG}.md`).replace(/\r/g, '').split('\n');
  const parts = []; let cur = null;
  for (const raw of lines) {
    const l = raw.trim();
    if (/^###\s/.test(l) && !/^####/.test(l)) { cur = [l]; parts.push(cur); continue; }
    if (/^---+$/.test(l) || /^##\s/.test(l)) { cur = null; continue; }
    if (cur && l) cur.push(l);
  }
  // a Markdown paragraph is one line here (the handoff writes no wrapped lines)
  if (parts.length !== digests.length) errors.push(`reading room: ${parts.length} ${LANG} digests, ${digests.length} English`);
  else {
    const out = digests.map((d, k) => {
      const leaves = d.querySelectorAll('h1,h2,h3,p,li,div.dg-note,div.dg-reflect').filter((n) => !n.querySelector('p,li,h1,h2,h3'));
      const blocks = parts[k];
      if (blocks.length !== leaves.length) { errors.push(`reading room digest ${k + 1}: ${blocks.length} ${LANG} paragraphs, ${leaves.length} English`); return null; }
      const copy = parse(d.toString(), { comment: true }).firstChild;
      const copyLeaves = copy.querySelectorAll('h1,h2,h3,p,li,div.dg-note,div.dg-reflect').filter((n) => !n.querySelector('p,li,h1,h2,h3'));
      copyLeaves.forEach((n, i) => {
        let t = blocks[i].replace(/^#{3,4}\s+/, '').replace(/^[-*]\s+/, '');
        const num = n.querySelector('.dg-n');
        if (num) { const m = /^(\d+\.)\s*(.*)$/.exec(t); if (!m) errors.push(`reading room digest ${k + 1} heading ${i + 1}: no number`); else { n.set_content(`<span class="dg-n">${m[1]}</span>${inline(m[2]).replace(/<strong>/g, '<b>').replace(/<\/strong>/g, '</b>')}`); return; } }
        n.set_content(inline(t).replace(/<strong>/g, '<b>').replace(/<\/strong>/g, '</b>'));
      });
      copy.setAttribute('class', (copy.getAttribute('class') || '').replace(/\blang-en\b/, `lang-${LANG}`));
      copy.setAttribute('lang', LANG);
      return copy.toString();
    });
    if (out.every(Boolean)) writes.push([`src/data/interface/rooms/${LANG}/${roomPage}.json`, { page: `${roomPage}.html`, lang: LANG, after: '.lang-en.dg-block', blocks: out }]);
  }
}

if (errors.length) { console.error(`${errors.length} problem(s); nothing written:`); errors.slice(0, 40).forEach((e) => console.error('  - ' + e)); process.exit(1); }
if (WRITE) for (const [f, d] of writes) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(d, null, 1) + '\n'); }
console.log(`${CODE} (${slug}): textbook, its test, the reading test and the room's digests in ${LANG} ${WRITE ? 'written' : 'checked; nothing written (add --write)'}.`);
