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
 * Each part is checked on its own. A part whose counts differ from the
 * English stays in English; a question whose English answer in the key file
 * is not the site's stays in English; a digest whose paragraphs do not pair
 * stays in English. Everything left out is listed.
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

const keyFile = readJson(KEYFILE);
const writes = [], notes = [], done = [];
/* Each part (the book, its test, the reading test, the room) is imported on
   its own: a part with a problem is left in English and listed; the others
   are still written. */
function part(name, fn) {
  const before = errors.length;
  const apply = fn();
  if (errors.length > before) { notes.push(`${name}: left in English (${errors.length - before} problem(s))`); return; }
  apply(); done.push(name);
}
const norm = (a) => String(a ?? '').normalize('NFC').replace(/[‘’ʼ`]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();
const sameAnswer = (a, b) => norm(a) === norm(b);

/* The test questions: a question whose English answer in the key file is not
   the site's (the English was revised after translation) stays in English. */
function questions(label, prompts, keys, qs, priv) {
  if (prompts.length !== qs.length || keys.length !== qs.length || priv.length !== qs.length) { errors.push(`${label}: ${prompts.length} ${LANG} questions, ${keys.length} keys, ${qs.length} on the site`); return () => {}; }
  const st = stamps(priv);
  const plan = [];
  priv.forEach((q, i) => {
    const k = keys[i];
    if (!sameAnswer(k.answer_en, q.answer.en)) { notes.push(`${label} ${i + 1}: the key file's English answer "${k.answer_en}" is not the site's "${q.answer.en}"; this question stays in English`); return; }
    if (!k[`answer_${LANG}`]) { notes.push(`${label} ${i + 1}: no ${LANG} answer; stays in English`); return; }
    plan.push(() => {
      q.prompt[LANG] = qs[i].prompt[LANG] = prompts[i];
      q.answer[LANG] = k[`answer_${LANG}`];
      if (q.accept) q.accept[LANG] = (k[`accept_${LANG}`] || []).filter((a) => !sameAnswer(a, k[`answer_${LANG}`]));
      q.tr = { ...(q.tr || {}), [LANG]: { status: 'machine', from: st[i] } };
    });
  });
  return () => plan.forEach((f) => f());
}

/* ---------------- the textbook */
const bookFile = `src/content/textbooks/${slug}.json`, bookKeys = path.join(KEYS, 'textbooks', `${slug}.json`);
const book = readJson(bookFile), bookPriv = readJson(bookKeys);
part('textbook', () => {
  const en = parse(book.body.en).childNodes.filter((n) => n.tagName);
  const sw = paragraphs(md(`textbook.${LANG}.md`));
  const start = sw.findIndex((p) => /^##\s/.test(p));
  const body = start < 0 ? [] : sw.slice(start);
  // chapter by chapter (each from its h2 / "## "): a chapter whose paragraphs
  // do not pair one to one keeps its English, marked lang="en"
  const chapters = (list, isHead) => list.reduce((acc, x) => { if (isHead(x) || !acc.length) acc.push([]); acc.at(-1).push(x); return acc; }, []);
  const enCh = chapters(en, (n) => n.tagName === 'H2'), swCh = chapters(body, (t) => /^##\s/.test(t));
  if (enCh.length !== swCh.length) { errors.push(`textbook: ${swCh.length} ${LANG} chapters, ${enCh.length} in the English`); return () => {}; }
  let kept = 0;
  const out = enCh.map((nodes, c) => {
    if (nodes.length !== swCh[c].length) { notes.push(`textbook chapter ${c + 1}: ${swCh[c].length} ${LANG} paragraphs, ${nodes.length} English; this chapter stays in English`); return nodes.map((n) => { const copy = parse(n.toString()).firstChild; copy.setAttribute('lang', 'en'); return copy.toString(); }).join(''); }
    kept++;
    return nodes.map((node, i) => {
      let text = swCh[c][i];
      const heading = /^##\s+(.*)$/.exec(text);
      if ((node.tagName === 'H2') !== !!heading) { errors.push(`textbook chapter ${c + 1} paragraph ${i + 1}: a heading in one language only`); return ''; }
      if (heading) text = heading[1];
      const cls = node.getAttribute('class') || '';
      if (cls.includes('muted')) text = text.replace(/^_(.*)_$/s, '$1');                  // the source line, italic in Markdown
      if (cls.includes('cts-note')) text = text.replace(/^\*\*([^*]+:)\*\*\s*/, '$1 ');    // "CTS note:" is plain in the English
      const copy = parse(node.toString()).firstChild;
      copy.set_content(inline(text));
      return copy.toString();
    }).join('');
  });
  if (!kept) { errors.push('textbook: no chapter pairs with the English'); return () => {}; }
  return () => { book.body[LANG] = out.join(''); };
});
part('textbook test', () => questions('textbook test', numbered(md(`textbook-test.${LANG}.md`), 'textbook test'), keyFile.textbook || [], book.test.questions, bookPriv.test.questions));
writes.push([bookFile, book], [bookKeys, bookPriv]);

/* ---------------- the required-reading test */
const rSlug = `${slug}readings`;
const readFile = `src/content/readings/${rSlug}.json`, readKeys = path.join(KEYS, 'readings', `${rSlug}.json`);
if (fs.existsSync(readFile) && fs.existsSync(readKeys)) {
  const reading = readJson(readFile), readPriv = readJson(readKeys);
  part('reading test', () => questions('reading test', numbered(md(`readings-test.${LANG}.md`), 'reading test'), keyFile.readings || [], reading.test.questions, readPriv.test.questions));
  writes.push([readFile, reading], [readKeys, readPriv]);
} else notes.push(`no reading test for ${prefixOf(CODE)} (${readFile})`);

/* ---------------- the reading room's five digests
   Kept beside the page, not in it (the room page is generated by
   tools/build-elective-readings.mjs): src/data/interface/rooms/<lang>/<Page>.json
   holds each digest as the English digest's markup with its words in <lang>.
   tools/language-pages.mjs puts them in on that language's page only. A digest
   whose paragraphs do not pair one to one with the English stays English. */
const roomPage = `${prefixOf(CODE)}Readings`, roomSrc = `src/body/rooms/${roomPage}.html`;
if (fs.existsSync(roomSrc) && fs.existsSync(path.join(FROM, `readings.${LANG}.md`))) part('reading room', () => {
  const room = parse(fs.readFileSync(roomSrc, 'utf8'), { comment: true });
  const digests = room.querySelectorAll('.lang-en.dg-block');
  // The digests in the Markdown: each from its "## Somo la N" heading (or, in
  // older files, its "### " title) to the next digest or "---". Headings of
  // any level inside a digest are its section headings.
  const lines = md(`readings.${LANG}.md`).replace(/\r/g, '').split('\n').map((l) => l.trim());
  const isDigest = (l) => /^##\s+\S+(\s+\S+)?\s+\d+\s*:/.test(l) && !/^##\s+\d/.test(l);
  let parts = [], cur = null;
  for (const l of lines) {
    if (isDigest(l)) { cur = [l]; parts.push(cur); continue; }
    if (/^---+$/.test(l)) { cur = null; continue; }
    if (cur && l) cur.push(l);
  }
  if (!parts.length) {            // no "## Somo" headings: one digest per "### " title
    for (const l of lines) {
      if (/^###\s/.test(l) && !/^####/.test(l) && !/^###\s+\d/.test(l)) { cur = [l]; parts.push(cur); continue; }
      if (/^---+$/.test(l) || /^##\s/.test(l)) { cur = null; continue; }
      if (cur && l) cur.push(l);
    }
  }
  if (parts.length !== digests.length) { errors.push(`reading room: ${parts.length} ${LANG} digests, ${digests.length} English`); return () => {}; }
  // Within a digest, the English begins at its title (h1): start the Swahili at
  // its "### " title when it has one, else at the "## Somo" line itself.
  const candidates = (blocks) => {
    const out = [];
    const t3 = blocks.findIndex((b, i) => i > 0 && /^###\s/.test(b) && !/^#{3,4}\s+\d/.test(b));
    if (t3 > 0) out.push(blocks.slice(t3));
    out.push([blocks[0].replace(/^##\s+[^:]*:\s*/, '### '), ...blocks.slice(1)]);
    out.push(blocks);
    return out;
  };
  // Otherwise pair by structure: the head (title, subtitle, source line,
  // tags) and, from the "word before you read" note on, the body one to one.
  // Tags that do not pair keep their English wording.
  const structural = (blocks, leaves) => {
    const noteEn = leaves.findIndex((n) => n.tagName === 'DIV' && /dg-note/.test(n.getAttribute('class') || ''));
    let noteSw = blocks.findIndex((b) => /neno kabla ya kusoma/i.test(b));
    if (noteSw < 0) noteSw = blocks.findIndex((b, i) => i > 0 && /^(\*\*|\*|_)[^*_]{2,60}[.:](\*\*|\*|_)/.test(b));
    if (noteEn < 0 || noteSw < 0) return null;
    const tail = blocks.slice(noteSw);
    if (tail.length !== leaves.length - noteEn) return null;
    // Walking back from the note: the tags (a run of "- " lines, or one line of
    // tags joined by " · "), then the source line, the subtitle and the title.
    const enHead = leaves.slice(0, noteEn), tags = enHead.filter((n) => n.tagName === 'LI');
    let i = noteSw - 1, tagText = null;
    if (/^[-*]\s+/.test(blocks[i])) { const run = []; while (i >= 0 && /^[-*]\s+/.test(blocks[i])) run.unshift(blocks[i--].replace(/^[-*]\s+/, '')); tagText = run; }
    else if (/ · /.test(blocks[i]) && !/neno/i.test(blocks[i])) { tagText = blocks[i--].replace(/^[^:·]{1,30}:\S*\s*/, '').replace(/^[*_]+|[*_]+$/g, '').split(' · '); }
    if (!tagText || tagText.length !== tags.length) tagText = tags.map((n) => n.innerHTML);
    const nonTags = enHead.length - tags.length;          // the title, subtitle and source line
    if (i + 1 < nonTags) return null;
    const head = blocks.slice(i + 1 - nonTags, i + 1).map((b, j) => (j === 0
      ? '### ' + b.replace(/^#{2,6}\s+(?:[^:]*\d\s*:\s*)?/, '').replace(/^\*\*(.*)\*\*$/s, '$1')
      : b.replace(/^[*_](.*)[*_]$/s, '$1')));
    return [...head, ...tagText, ...tail];
  };
  const leavesOf = (d) => d.querySelectorAll('h1,h2,h3,p,li,div.dg-note,div.dg-reflect').filter((n) => !n.querySelector('p,li,h1,h2,h3'));
  const out = digests.map((d, k) => {
    const blocks = structural(parts[k], leavesOf(d)) || candidates(parts[k]).find((c) => c.length === leavesOf(d).length);
    if (!blocks) { notes.push(`reading room digest ${k + 1}: ${parts[k].length} ${LANG} paragraphs, ${leavesOf(d).length} English; stays in English`); return null; }
    const copy = parse(d.toString(), { comment: true }).firstChild;
    let bad = false;
    leavesOf(copy).forEach((n, i) => {
      const t = blocks[i].replace(/^#{2,6}\s+/, '').replace(/^[-*]\s+/, '');
      const b = (h) => h.replace(/<strong>/g, '<b>').replace(/<\/strong>/g, '</b>');
      const num = n.querySelector('.dg-n');
      if (num) { const bold = /^\*\*\d+\..*\*\*$/.test(t); const m = /^(\d+\.)\s*(.*)$/.exec(bold ? t.slice(2, -2) : t); if (!/^#{2,6}\s/.test(blocks[i]) && !bold) { bad = true; return; } n.set_content(`<span class="dg-n">${m ? m[1] : num.innerHTML}</span>${b(inline(m ? m[2] : t))}`); return; }
      n.set_content(b(inline(t)));
    });
    if (bad) { notes.push(`reading room digest ${k + 1}: its headings do not pair with the English; stays in English`); return null; }
    copy.setAttribute('class', (copy.getAttribute('class') || '').replace(/\blang-en\b/, `lang-${LANG}`));
    copy.setAttribute('lang', LANG);
    return copy.toString();
  });
  if (!out.some(Boolean)) { errors.push('reading room: no digest pairs with the English'); return () => {}; }
  // an English digest without its pair gets an empty block: language-pages then shows the English there
  return () => writes.push([`src/data/interface/rooms/${LANG}/${roomPage}.json`, { page: `${roomPage}.html`, lang: LANG, after: '.lang-en.dg-block', blocks: out.map((x) => x ?? '') }]);
});

for (const e of errors) console.log('  - ' + e);
for (const n of notes) console.log('  * ' + n);
if (WRITE && done.length) for (const [f, d] of writes) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(d, null, 1) + '\n'); }
console.log(`${CODE} (${slug}): ${done.length ? done.join(', ') : 'nothing'} in ${LANG}${WRITE ? ' written' : ' checked (add --write)'}.`);
