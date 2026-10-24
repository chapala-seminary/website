/* French for the reading material: export source packets for translators,
 * apply their translations, and report what is done.
 *
 *   node tools/french-readings.mjs list [--json]
 *   node tools/french-readings.mjs export --out DIR (--all | ITEM...)
 *   node tools/french-readings.mjs apply PACKET.fr.json...
 *   node tools/french-readings.mjs check [--strict]
 *   node tools/french-readings.mjs readers      # remake the French chapter readers
 *
 * An ITEM is one of
 *   textbook:<slug>          src/content/textbooks/<slug>.json: subtitle,
 *                            credits, body, and the test's prompts and answers
 *   reading:<slug>           src/content/readings/<slug>.json: the test
 *   digest:<file>            public/<file>.html, a CTS digest
 *   room:<page>              src/body/rooms/<page>.html: what a reading room
 *                            says beyond its digests and its interface
 *   chapter:<slug>:<n>       an assigned chapter of a textbook read on its own
 *                            page (public/textbooks/*_English.html); <n> is
 *                            the chapter's Roman number, or "front"
 *
 * A packet is { item, type, source, segments: [{ id, context, en, es? }] }.
 * The translator returns the same file with `fr` beside each `en` (a string,
 * or for `accept` a list) and saves it as <name>.fr.json. `apply` re-exports
 * the item, refuses a packet whose English has changed since, validates the
 * French (tags, one blank per prompt, answers) and writes it with machine
 * provenance. Reviewed French (`human`, `machine-edited`) is never replaced.
 * Where things are stored: tools/french-readings-lib.mjs. */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import {
  hash, STORE, DIGEST, storeFile, loadStore, leaves, translatable, leafKey, markupSegments,
  bodyLeaves, frenchBody, tagProblem, normText, frenchSpaces,
} from './french-readings-lib.mjs';
import { translationPlan } from './translation-plan.mjs';
import { readerEditorialNotice } from './editorial-notices.mjs';
import { resolveKeysRoot, textbookQuestions, readingQuestions, isPrivateReading, PRIVATE_READING_FIELDS } from './grading-keys-lib.mjs';

const BLANK = '____';
const PROTECTED = new Set(['human', 'machine-edited']);
const json = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
/* Keep each file's own indentation, so a write changes only what it must. */
function writeJson(file, data) {
  const old = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const indent = /^\{\n( +)"/.exec(old)?.[1].length || 1;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, indent) + '\n');
}
/* Public textbook JSON keeps prompt/chapter/tr; answer/accept live in assessment-keys. */
function loadTextbook(file) {
  const pub = json(file);
  const { questions: keyed } = textbookQuestions('.', pub.slug);
  if (!keyed.every((q) => q?.answer?.en)) {
    throw new Error(`${pub.slug}: textbook answers are only in the private assessment-keys checkout`);
  }
  return {
    ...pub,
    test: {
      ...pub.test,
      questions: pub.test.questions.map((q, i) => ({
        ...q,
        answer: keyed[i].answer,
        ...(keyed[i].accept ? { accept: keyed[i].accept } : {}),
        // a private bank (keys: "private") keeps its question stamps with the keys
        ...(isPrivateReading(pub) && keyed[i].tr ? { tr: keyed[i].tr } : {}),
      })),
    },
  };
}
function publicTextbookQuestions(questions, isPrivate = false) {
  return questions.map(({ answer, accept, tr, ...q }) => (isPrivate || !tr ? q : { ...q, tr }));
}
/* A private bank's keys file keeps each question's chapter and stamp too
   (tools/build-elective-textbook.mjs writes it so). */
function writeTextbookKeys(slug, questions, isPrivate = false) {
  const keysRoot = resolveKeysRoot('.');
  if (!keysRoot) throw new Error(`${slug}: cannot write French textbook answers without assessment-keys`);
  const file = path.join(keysRoot, 'textbooks', `${slug}.json`);
  writeJson(file, {
    slug,
    test: {
      questions: questions.map((q) => ({
        prompt: q.prompt,
        answer: q.answer,
        ...(q.accept ? { accept: q.accept } : {}),
        ...(isPrivate && q.chapter != null ? { chapter: q.chapter } : {}),
        ...(isPrivate && q.tr ? { tr: q.tr } : {}),
      })),
    },
  });
  return file;
}
/* A reading test with its keys: a private bank (keys: "private") joined with
   assessment-keys/readings/<slug>.json, where its answer, accept and French
   stamps (tr, which hash the answer) live; a public one as it is. */
function loadReading(file) {
  const pub = json(file);
  return { ...pub, test: { ...pub.test, questions: readingQuestions('.', pub).questions } };
}
/* ...and written back: the keys and stamps to the private file, the prompts
   (with their French) to the public one -- as tools/import-readings.mjs does. */
function writePrivateReading(file, rec) {
  const keysRoot = resolveKeysRoot('.');
  if (!keysRoot) throw new Error(`${rec.slug}: cannot write French reading answers without assessment-keys`);
  const keep = ['prompt', 'answer', 'accept', 'reading', 'group', 'tr'];
  writeJson(path.join(keysRoot, 'readings', `${rec.slug}.json`), { slug: rec.slug, test: { questions: rec.test.questions.map((q) => Object.fromEntries(keep.filter((k) => q[k] !== undefined).map((k) => [k, q[k]]))) } });
  writeJson(file, { ...rec, test: { ...rec.test, questions: rec.test.questions.map((q) => Object.fromEntries(Object.entries(q).filter(([k]) => !PRIVATE_READING_FIELDS.includes(k)))) } });
}
const fold = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/[^\p{L}\p{N} ]+/gu, ' ').replace(/\s+/g, ' ').trim();

/* ---- the inventory --------------------------------------------------------- */

const TEXTBOOKS = 'src/content/textbooks', READINGS = 'src/content/readings', ROOMS = 'src/body/rooms';
const READERS = 'public/textbooks';
const ROMAN = (s) => [...s].reduce((n, c, i, a) => { const v = { I: 1, V: 5, X: 10, L: 50, C: 100 }[c], w = { I: 1, V: 5, X: 10, L: 50, C: 100 }[a[i + 1]] || 0; return n + (v < w ? -v : v); }, 0);

function readerBooks() {
  const out = [];
  for (const f of fs.readdirSync(TEXTBOOKS).filter((f) => f.endsWith('.json')).sort()) {
    const b = json(path.join(TEXTBOOKS, f));
    if (!b.files?.html) continue;
    const es = fs.readFileSync(path.join('public', b.files.html.es), 'utf8');
    const chapters = [...es.matchAll(/<a href="#chapter-([IVXLC]+)">[^<]*<\/a>\s*<span class="grp">· grupo (\d+)<\/span>/g)].map((m) => ({ n: m[1], group: +m[2] }));
    out.push({ slug: b.slug, book: b, chapters, en: path.join('public', b.files.html.en), es: path.join('public', b.files.html.es) });
  }
  return out;
}
export function inventory() {
  const items = [];
  for (const f of fs.readdirSync(TEXTBOOKS).filter((f) => f.endsWith('.json')).sort())
    items.push({ id: `textbook:${f.slice(0, -5)}`, type: 'textbook', file: path.join(TEXTBOOKS, f) });
  for (const f of fs.readdirSync(READINGS).filter((f) => f.endsWith('.json')).sort())
    items.push({ id: `reading:${f.slice(0, -5)}`, type: 'reading', file: path.join(READINGS, f) });
  for (const f of fs.readdirSync('public').filter((f) => DIGEST.test(f)).sort())
    items.push({ id: `digest:${f.slice(0, -5)}`, type: 'digest', file: path.join('public', f) });
  const rooms = json('src/data/rooms.json').rooms;
  for (const [page, r] of Object.entries(rooms).sort()) if (r.kind !== 'honors')
    items.push({ id: `room:${page}`, type: 'room', file: path.join(ROOMS, `${page}.html`) });
  for (const b of readerBooks()) {
    items.push({ id: `chapter:${b.slug}:front`, type: 'chapter', file: b.en, book: b, chapter: 'front' });
    for (const c of b.chapters) items.push({ id: `chapter:${b.slug}:${c.n}`, type: 'chapter', file: b.en, book: b, chapter: c.n, group: c.group });
  }
  return items;
}
const byId = (id) => {
  const it = inventory().find((i) => i.id === id);
  if (!it) throw new Error(`no item ${id}: see node tools/french-readings.mjs list`);
  return it;
};

/* ---- the interface dictionary (the page frame's, not ours) ------------------ */

let chromeKeysCache = null;
/* Packets carry every English passage of a room, its interface boxes too
   (Robert, 13 Oct 2026: the rooms are to be wholly French). Where the frame's
   dictionary already translates one, the build uses the frame's French
   (tools/french-readings-lib.mjs augmentHtml) and ours stays unused. */
const chromeKeys = () => (chromeKeysCache ??= new Set());

let digestKeysCache = null;
function digestKeys() {
  if (digestKeysCache) return digestKeysCache;
  digestKeysCache = new Set();
  for (const f of fs.readdirSync('public').filter((f) => DIGEST.test(f)))
    for (const s of markupSegments(fs.readFileSync(path.join('public', f), 'utf8'), { chrome: chromeKeys() })) digestKeysCache.add(s.key);
  return digestKeysCache;
}

/* ---- the English of an assigned chapter (Project Gutenberg text) ----------- */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => esc(s).replace(/_([^_]+)_/g, '<em>$1</em>').replace(/\[(\d+)\]/g, '<sup>$1</sup>');
function chapterParts(enFile, n) {
  const root = parse(fs.readFileSync(enFile, 'utf8'));
  const pre = root.querySelector(`#chapter-${n} pre`);
  if (!pre) throw new Error(`${enFile}: no chapter ${n}`);
  const blocks = pre.text.replace(/\r/g, '').split(/\n[ \t]*\n/).map((b) => b.replace(/\s+$/, '')).filter((b) => b.trim());
  const parts = [];
  for (const [i, block] of blocks.entries()) {
    const lines = block.split('\n').filter((l) => l.trim());
    const joined = lines.map((l) => l.trim()).join(' ');
    const indent = Math.min(...lines.map((l) => /^ */.exec(l)[0].length));
    if (i === 0 && /^CHAPTER [IVXLC]+\.?$/.test(joined)) continue;
    if (!parts.length && /^_.*_$/.test(joined)) { parts.push({ kind: 'title', en: inline(joined.replace(/^_|_$/g, '').replace(/\.$/, '')) }); continue; }
    if (/^\[\d+\]/.test(joined)) parts.push({ kind: 'note', en: inline(joined).replace(/^<sup>(\d+)<\/sup>\s*/, '<sup>$1</sup> ') });
    else if (indent >= 4) parts.push({ kind: 'quote', en: inline(joined) });
    else parts.push({ kind: 'p', en: inline(joined) });
  }
  return parts;
}
function bookTitle(enFile) { return parse(fs.readFileSync(enFile, 'utf8')).querySelector('title').text.trim(); }

/* ---- export ---------------------------------------------------------------- */

const questionSegments = (questions, unit) => questions.flatMap((q, i) => {
  const where = q.chapter ? `chapter ${q.chapter}` : q.reading ? `reading ${q.reading}` : q.group ? `reading ${q.group}` : '';
  const n = i + 1, ctx = (what) => `${unit} question ${n}${where ? ` (${where})` : ''}: ${what}`;
  return [
    { id: `q${n}.prompt`, context: ctx('the sentence, with exactly one ____'), en: q.prompt.en, es: q.prompt.es },
    { id: `q${n}.answer`, context: ctx('the word or phrase that fills the blank'), en: q.answer.en, es: q.answer.es },
    { id: `q${n}.accept`, context: ctx('other right answers (a list; may be empty)'), en: q.accept?.en || [], es: q.accept?.es || [] },
  ];
});
export function exportItem(item) {
  const segments = [];
  if (item.type === 'textbook') {
    const b = loadTextbook(item.file);
    for (const f of ['subtitle', 'credits']) if (b[f]?.en) segments.push({ id: f, context: `the book's ${f}, under its title`, en: b[f].en });
    let heading = '';
    bodyLeaves(b.body.en).list.filter(translatable).forEach((leaf, i) => {
      if (/^H[1-6]$/.test(leaf.tagName)) heading = normText(leaf.innerHTML);
      segments.push({ id: `body.${i + 1}`, context: `${leaf.tagName.toLowerCase()}${heading && !/^H/.test(leaf.tagName) ? ` in "${heading.slice(0, 60)}"` : ''}`, en: leaf.innerHTML });
    });
    segments.push(...questionSegments(b.test.questions, 'textbook test'));
  } else if (item.type === 'reading') {
    segments.push(...questionSegments(loadReading(item.file).test.questions, 'required-reading test'));
  } else if (item.type === 'digest' || item.type === 'room') {
    const html = fs.readFileSync(item.file, 'utf8');
    const skip = item.type === 'room' ? digestKeys() : new Set();
    for (const s of markupSegments(html, { chrome: chromeKeys(), skip })) segments.push({ id: `k:${s.key}`, context: s.tag, en: s.en });
  } else if (item.type === 'chapter') {
    if (item.chapter === 'front') segments.push({ id: 'title', context: 'the book\'s title, for the French page (h1)', en: esc(bookTitle(item.file)) });
    else chapterParts(item.file, item.chapter).forEach((p, i) => segments.push({ id: `p${i + 1}`, context: p.kind === 'title' ? `chapter ${item.chapter} title` : p.kind === 'note' ? 'footnote' : p.kind === 'quote' ? 'quotation (often Scripture)' : 'paragraph', en: p.en, kind: p.kind }));
  }
  return { item: item.id, type: item.type, source: item.file, segments };
}
const chars = (packet) => packet.segments.reduce((n, s) => n + (Array.isArray(s.en) ? s.en.join(' ') : s.en).length, 0);
const textChars = (packet) => packet.segments.reduce((n, s) => n + normText(Array.isArray(s.en) ? s.en.join(' ') : s.en).length, 0);

/* ---- validation ------------------------------------------------------------ */

function validate(packet, fresh) {
  const problems = [], warnings = [];
  const ids = (p) => p.segments.map((s) => s.id).join('\n');
  if (ids(packet) !== ids(fresh)) problems.push('the segments differ from a fresh export: the English changed since this packet was made; export again');
  const want = new Map(fresh.segments.map((s) => [s.id, s]));
  for (const s of packet.segments) {
    const f = want.get(s.id);
    if (!f) continue;
    if (JSON.stringify(s.en) !== JSON.stringify(f.en)) { problems.push(`${s.id}: its English differs from the source now; export again`); continue; }
    const fr = s.fr;
    if (s.id.endsWith('.accept')) {
      if (!Array.isArray(fr) || fr.some((a) => typeof a !== 'string' || !a.trim() || a.includes(BLANK) || /</.test(a))) problems.push(`${s.id}: accept is a list of words or phrases (it may be empty)`);
      continue;
    }
    if (typeof fr !== 'string' || !fr.trim()) { problems.push(`${s.id}: no French`); continue; }
    if (s.id.endsWith('.prompt')) {
      if (fr.split(BLANK).length !== 2) problems.push(`${s.id}: a prompt has exactly one ${BLANK}`);
      if (/_{5,}/.test(fr)) problems.push(`${s.id}: the blank is four underscores, ${BLANK}`);
    } else if (s.id.endsWith('.answer')) {
      if (fr.includes(BLANK) || /</.test(fr)) problems.push(`${s.id}: an answer is a word or phrase, without markup`);
    } else {
      const t = tagProblem(s.en, fr);
      if (t) problems.push(`${s.id}: ${t}`);
    }
    if (typeof s.en === 'string' && s.en.split(/\s+/).length > 4 && fold(fr) === fold(s.en)) warnings.push(`${s.id}: the French is the English`);
  }
  // each French answer is about something the French reading says
  return { problems, warnings };
}
function answerWarnings(questions, text, label) {
  const hay = ` ${fold(text)} `;
  return questions.map((q, i) => (q.answer.fr && !hay.includes(` ${fold(q.answer.fr)} `) ? `${label} Q${i + 1}: the French answer "${q.answer.fr}" is not in the French reading` : null)).filter(Boolean);
}

/* ---- apply ----------------------------------------------------------------- */

const machine = (en) => ({ status: 'machine', from: hash(en) });
export function questionStamps(questions) {
  const plain = questions.map((q) => ({ prompt: { en: q.prompt.en }, answer: { en: q.answer.en }, ...(q.accept?.en ? { accept: { en: q.accept.en } } : {}) }));
  const { jobs } = translationPlan({ sourceLang: 'en', blocks: [] }, { fill: plain }, 'fr');
  return jobs.map((j) => j.stamp);
}
function applyQuestions(questions, frOf, report) {
  const stamps = questionStamps(questions);
  questions.forEach((q, i) => {
    const n = i + 1, state = q.tr?.fr;
    if (PROTECTED.has(state?.status)) { report.push(`Q${n}: ${state.status} French kept`); return; }
    q.prompt.fr = frOf(`q${n}.prompt`);
    q.answer.fr = frOf(`q${n}.answer`);
    if (q.accept?.en) q.accept.fr = frOf(`q${n}.accept`);
    q.tr = { ...(q.tr || {}), fr: { status: 'machine', from: stamps[i] } };
  });
}
function applyMemory(item, packet, frOf, report) {
  const file = storeFile(item.type, item.id.split(':')[1]);
  const store = fs.existsSync(file) ? json(file) : { item: item.id, source: item.file, entries: {} };
  for (const s of packet.segments) {
    const key = s.id.slice(2), old = store.entries[key];
    if (PROTECTED.has(old?.tr?.fr?.status)) { report.push(`${s.id}: ${old.tr.fr.status} French kept`); continue; }
    store.entries[key] = { en: s.en, fr: frOf(s.id), tr: { fr: { status: 'machine', from: key } } };
  }
  writeJson(file, store);
  return file;
}
/* One file per chapter (src/data/french-readings/chapter/<slug>.<n>.json),
   so translators working on different chapters of one book never write the
   same file. */
const chapterFile = (slug, n) => storeFile('chapter', `${slug}.${n}`);
function chapterStore(slug) {
  const dir = path.join(STORE, 'chapter'), chapters = {};
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) {
    const m = new RegExp(`^${slug}\\.([A-Za-z]+)\\.json$`).exec(f);
    if (m) chapters[m[1]] = json(path.join(dir, f));
  }
  return { chapters };
}
function applyChapter(item, packet, frOf, report) {
  const slug = item.book.slug, file = chapterFile(slug, item.chapter);
  const en = packet.segments.map((s) => s.en).join('\n');
  const old = fs.existsSync(file) ? json(file) : null;
  if (PROTECTED.has(old?.tr?.fr?.status)) { report.push(`chapter ${item.chapter}: ${old.tr.fr.status} French kept`); return file; }
  writeJson(file, { item: item.id, source: item.file, group: item.group ?? null,
    parts: packet.segments.map((s) => ({ kind: s.kind || 'title', en: s.en, fr: frOf(s.id) })), tr: { fr: machine(en) } });
  const reader = writeReader(item.book, chapterStore(slug));
  if (reader) report.push(`wrote ${reader}`);
  return file;
}

/* The French reader of an assigned-chapters book, made when every chapter is
   translated: the Spanish reader's frame, in French, marked a draft. */
function writeReader(book, store) {
  if (!store.chapters.front || !book.chapters.every((c) => store.chapters[c.n])) return null;
  const es = fs.readFileSync(book.es, 'utf8');
  const head = /<head>[\s\S]*?<\/head>/.exec(es)?.[0];
  if (!head) throw new Error(`${book.es}: no <head> to reuse`);
  const title = store.chapters.front.parts[0].fr;
  const room = /<p class="back"><a href="([^"]+)"/.exec(es)?.[1] || '../index.html';
  const by = /<p class="by">([^<]*)<\/p>/.exec(es)?.[1] || '';
  const frFile = book.book.files.html.en.replace(/_English\.html$/, '_French.html');
  const chapters = book.chapters.map((c) => {
    const parts = store.chapters[c.n].parts;
    const t = parts.find((p) => p.kind === 'title');
    const body = parts.filter((p) => p.kind !== 'title').map((p) => p.kind === 'quote' ? `<blockquote><p>${p.fr}</p></blockquote>` : p.kind === 'note' ? `<p class="fn">${p.fr}</p>` : `<p>${p.fr}</p>`).join('\n');
    return { n: c.n, group: c.group, heading: `Chapitre ${c.n}.${t ? ` ${t.fr}` : ''}`, body };
  });
  const html = `<!DOCTYPE html>
<html lang="fr">
${head.replace(/<title>[\s\S]*?<\/title>/, `<title>${title} — chapitres assignés (traduction provisoire)</title>`).replace('</head>', '<meta name="robots" content="noindex,follow">\n</head>')}
<body>
<div class="wrap">
<p class="back"><a href="${room.replace(/^\.\.\//, '../fr/')}">← Salle de lecture du cours</a> · <a href="${path.basename(book.en)}">English edition</a> · <a href="${path.basename(book.es)}">Edición en español</a></p>
<header class="doc">
<p class="kicker">Manuel de master · chapitres assignés · traduction du STC</p>
<h1>${title}</h1>
<p class="by">${by}</p>
</header>
${readerEditorialNotice(book.slug, 'fr')}<div class="note"><p><b>Traduction provisoire.</b> Traduction automatique publiée pour relecture, paragraphe par paragraphe, des chapitres assignés pour l’examen du manuel de master. Elle conserve les opinions et la terminologie de l’auteur et de son époque, que le STC ne partage pas nécessairement. Les citations bibliques suivent la Bible Louis Segond 1910 lorsque le passage est clairement le même. Les chapitres portent la numérotation de l’édition anglaise.</p></div>
<nav class="toc"><b>Chapitres assignés</b><ol>${chapters.map((c) => `<li><a href="#chapter-${c.n}">${c.heading}</a>${c.group ? ` <span class="grp">· groupe ${c.group}</span>` : ''}</li>`).join('')}</ol></nav>
${chapters.map((c) => `<section id="chapter-${c.n}">\n<h2>${c.heading}</h2>\n${c.body}\n</section>`).join('\n')}
<footer class="doc">Traduction française provisoire du Séminaire théologique de Chapala (Chapala Theological Seminary), 2026, de l’œuvre originale anglaise, qui est du domaine public. <a href="${room.replace(/^\.\.\//, '../fr/')}">Retour à la salle de lecture</a></footer>
</div>
</body>
</html>
`;
  fs.writeFileSync(path.join('public', frFile), html);
  const rec = json(path.join(TEXTBOOKS, `${book.slug}.json`));
  if (rec.files.html.fr !== frFile) { rec.files.html.fr = frFile; writeJson(path.join(TEXTBOOKS, `${book.slug}.json`), rec); }
  return path.join('public', frFile);
}

export function applyPacket(file) {
  const packet = json(file);
  const item = byId(packet.item);
  const fresh = exportItem(item);
  const { problems, warnings } = validate(packet, fresh);
  if (problems.length) return { item: item.id, problems, warnings };
  const fr = new Map(packet.segments.map((s) => [s.id, typeof s.fr === 'string' ? frenchSpaces(s.fr.trim()) : s.fr.map((a) => a.trim())]));
  const frOf = (id) => fr.get(id);
  const report = [];
  let written;
  if (item.type === 'textbook' || item.type === 'reading') {
    const rec = item.type === 'textbook' ? loadTextbook(item.file) : loadReading(item.file);
    if (item.type === 'textbook') {
      for (const f of ['subtitle', 'credits']) if (fr.has(f)) {
        if (PROTECTED.has(rec.tr?.[f]?.fr?.status)) { report.push(`${f}: ${rec.tr[f].fr.status} French kept`); continue; }
        rec[f].fr = frOf(f); (rec.tr ??= {})[f] = { fr: machine(rec[f].en) };
      }
      if (PROTECTED.has(rec.tr?.body?.fr?.status)) report.push(`body: ${rec.tr.body.fr.status} French kept`);
      else {
        const body = packet.segments.filter((s) => s.id.startsWith('body.')).map((s) => frOf(s.id));
        rec.body.fr = frenchBody(rec.body.en, body);
        (rec.tr ??= {}).body = { fr: machine(rec.body.en) };
      }
    }
    applyQuestions(rec.test.questions, frOf, report);
    if (item.type === 'textbook' && !rec.files.html) warnings.push(...answerWarnings(rec.test.questions, rec.body.fr, item.id));
    if (item.type === 'textbook' && rec.files.html) {
      // a commentary read on its own page: its French is in its chapters, applied one by one
      const chapters = Object.values(chapterStore(rec.slug).chapters);
      const text = chapters.flatMap((c) => c.parts.map((p) => p.fr)).join(' ');
      if (text) warnings.push(...answerWarnings(rec.test.questions, text, item.id).map((w) => `${w} (${chapters.length} chapter part(s) in French so far)`));
    }
    if (item.type === 'reading') {
      const { memory } = loadStore();
      const text = [...memory.values()].filter((e) => /^src\/data\/french-readings\/(digest|room)\//.test(e.file)).map((e) => e.fr).join(' ');
      if (text) warnings.push(...answerWarnings(rec.test.questions, text, item.id).map((w) => w + ' (any digest)'));
    }
    if (item.type === 'textbook') {
      const priv = isPrivateReading(rec);
      writeTextbookKeys(rec.slug, rec.test.questions, priv);
      writeJson(item.file, { ...rec, test: { ...rec.test, questions: publicTextbookQuestions(rec.test.questions, priv) } });
    } else if (isPrivateReading(rec)) {
      writePrivateReading(item.file, rec);
    } else {
      writeJson(item.file, rec);
    }
    written = item.file;
  } else if (item.type === 'digest' || item.type === 'room') written = applyMemory(item, packet, frOf, report);
  else written = applyChapter(item, packet, frOf, report);
  return { item: item.id, written, report, warnings, problems: [] };
}

/* ---- status ---------------------------------------------------------------- */

export function status() {
  const { memory, files } = loadStore();
  const rows = [], used = new Set();
  for (const item of inventory()) {
    const packet = exportItem(item);
    let done = 0, stale = 0;
    const total = packet.segments.length;
    if (item.type === 'textbook' || item.type === 'reading') {
      const rec = item.type === 'textbook' ? loadTextbook(item.file) : loadReading(item.file);
      const stamps = questionStamps(rec.test.questions);
      for (const f of ['subtitle', 'credits', 'body']) if (rec[f]?.fr != null) { if (rec.tr?.[f]?.fr?.from !== hash(rec[f].en)) stale++; }
      const segs = (f) => packet.segments.filter((s) => f === 'body' ? s.id.startsWith('body.') : s.id === f).length;
      for (const f of ['subtitle', 'credits', 'body']) if (rec[f]?.fr != null) done += segs(f);
      rec.test.questions.forEach((q, i) => {
        if (q.prompt.fr == null) return;
        done += 3;
        if (q.tr?.fr?.from !== stamps[i]) stale++;
      });
    } else if (item.type === 'chapter') {
      const file = chapterFile(item.book.slug, item.chapter);
      const ch = fs.existsSync(file) ? json(file) : null;
      if (ch) { done = total; if (ch.tr?.fr?.from !== hash(packet.segments.map((s) => s.en).join('\n'))) stale++; }
    } else {
      for (const s of packet.segments) if (memory.has(s.id.slice(2))) { done++; used.add(s.id.slice(2)); }
      // a digest's French serves its copy in a room too
      if (item.type === 'room') for (const s of markupSegments(fs.readFileSync(item.file, 'utf8'), { chrome: chromeKeys() })) if (memory.has(s.key)) used.add(s.key);
    }
    rows.push({ id: item.id, type: item.type, segments: total, done, stale, chars: chars(packet), text: textChars(packet) });
  }
  const orphans = [];
  for (const { file, data } of files) for (const key of Object.keys(data.entries || {})) if (!used.has(key)) orphans.push(`${file}: ${key}`);
  return { rows, orphans };
}

/* ---- command line ---------------------------------------------------------- */

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  const [cmd, ...args] = process.argv.slice(2);
  const flag = (name) => args.includes(name);
  const value = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
  if (cmd === 'list') {
    const rows = inventory().map((it) => { const p = exportItem(it); return { id: it.id, type: it.type, segments: p.segments.length, chars: chars(p), text: textChars(p) }; });
    if (flag('--json')) console.log(JSON.stringify(rows, null, 1));
    else for (const r of rows) console.log(`${r.id.padEnd(58)} ${String(r.segments).padStart(5)} segments ${String(r.text).padStart(8)} characters of English`);
  } else if (cmd === 'export') {
    const out = value('--out');
    if (!out) { console.error('export needs --out DIR (outside the repository: packets are working files)'); process.exit(2); }
    const ids = flag('--all') ? inventory().map((i) => i.id) : args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--out');
    for (const id of ids) {
      const packet = exportItem(byId(id));
      const file = path.join(out, packet.type, `${id.split(':').slice(1).join('.')}.json`);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, JSON.stringify(packet, null, 1) + '\n');
      console.log(`${file}  ${packet.segments.length} segments, ${textChars(packet)} characters`);
    }
  } else if (cmd === 'apply') {
    let failed = 0;
    for (const file of args.filter((a) => !a.startsWith('--'))) {
      const r = applyPacket(file);
      if (r.problems.length) { failed++; console.log(`REFUSED ${r.item} (${file}): ${r.problems.length} problem(s)`); r.problems.slice(0, 40).forEach((p) => console.log(`  ${p}`)); continue; }
      console.log(`applied ${r.item} -> ${r.written}`);
      r.report.forEach((p) => console.log(`  ${p}`));
      r.warnings.forEach((w) => console.log(`  warning: ${w}`));
    }
    process.exit(failed ? 1 : 0);
  } else if (cmd === 'readers') {
    // (Re)make the French reader of every assigned-chapters book whose chapters are all translated.
    for (const b of readerBooks()) console.log(`${b.slug}: ${writeReader(b, chapterStore(b.slug)) || 'not every chapter is in French yet'}`);
  } else if (cmd === 'check') {
    const { rows, orphans } = status();
    const sum = (t) => rows.filter((r) => !t || r.type === t);
    for (const t of ['textbook', 'reading', 'digest', 'room', 'chapter']) {
      const rs = sum(t), done = rs.filter((r) => r.done === r.segments && r.segments).length;
      console.log(`${t.padEnd(9)} ${String(done).padStart(3)} of ${String(rs.length).padStart(3)} items in French; ${rs.filter((r) => r.done && r.done < r.segments).length} partly; ${rs.reduce((n, r) => n + r.stale, 0)} stale`);
    }
    const stale = rows.filter((r) => r.stale);
    stale.forEach((r) => console.log(`  stale: ${r.id} (${r.stale}) -- the English changed after it was translated`));
    orphans.slice(0, 20).forEach((o) => console.log(`  unused French (its English changed?): ${o}`));
    if (flag('--strict') && (stale.length || orphans.length)) process.exit(1);
  } else {
    console.log('usage: node tools/french-readings.mjs list | export --out DIR (--all | ITEM...) | apply FILE.fr.json... | check [--strict] | readers');
    process.exit(cmd ? 2 : 0);
  }
}
