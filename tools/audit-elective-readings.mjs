#!/usr/bin/env node
/** Read-only quality screen for the 20 denominational electives.
 * Usage: node tools/audit-elective-readings.mjs [--root PATH] [--course D-C4|CTSElecRef4] [--json] [--strict] [--beta]
 *
 * Two layouts:
 *  - packages (handoff/book-sources): books/<A-C1..D-C5>/textbook.md and reading-1..5.md;
 *  - the site (beta, --beta, or automatically when there is no books/ folder):
 *    each elective's textbook text (src/content/textbooks/<slug>.json, body.en)
 *    and the five English digests in its reading room (src/body/rooms/<page>.html).
 *    A digest is a short CTS summary, so word targets do not apply; instead each
 *    digest is also checked for naming the textbook's own book as its source
 *    (SAME_SOURCE_AS_TEXTBOOK), which paraphrase would hide from the overlap count.
 * This is a screening tool, NOT a rights, translation, or academic approval.
 * --strict exits 2 if a reading is substantially contained in its textbook;
 * default is report-only because existing handoff packages are drafts.
 * It never opens assessment banks or writes output files.
 */
import fs from 'node:fs';
import path from 'node:path';

const CODES = ['A', 'B', 'C', 'D'].flatMap(letter =>
  Array.from({ length: 5 }, (_, index) => `${letter}-C${index + 1}`));
const args = process.argv.slice(2);
const flag = name => args.includes(name);
const value = name => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const root = path.resolve(value('--root') || process.cwd());
const only = value('--course');
const BETA = flag('--beta') || (!fs.existsSync(path.join(root, 'books')) && fs.existsSync(path.join(root, 'src/content/textbooks')));
// the site's electives, by course code (CTSElecBap1 ...), each with its textbook and reading-room files
const SITE = BETA ? (() => {
  const dir = (d) => path.join(root, 'src/content', d);
  const load = (d) => fs.readdirSync(dir(d)).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(dir(d), f), 'utf8')));
  const books = load('textbooks').filter(t => /^CTSElec/.test(t.course || ''));
  const rooms = new Map(load('readings').filter(r => /^CTSElec/.test(r.course || '')).map(r => [r.course, r]));
  return new Map(books.map(t => [t.course, { textbook: t, readings: rooms.get(t.course) }]).sort(([a], [b]) => a.localeCompare(b)));
})() : null;
if (BETA) CODES.splice(0, CODES.length, ...SITE.keys());
if (only && !CODES.includes(only)) {
  console.error(`Unknown course ${only}; expected one of ${CODES.join(', ')}`);
  process.exit(2);
}
const N = 10;
const CONTAINMENT_THRESHOLD = 0.80;
const CROSS_THRESHOLD = 0.80;
const MIN_WINDOWS = 100;

function tokens(markdown) {
  const body = markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .split('\n').filter(line => !/^\s*(?:#{1,6}\s|Back to top\.?\s*$|(?:Source|Provenance|Status):\s)/i.test(line))
    .join(' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, ' ');
  return body.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
}
const ENTITY = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', hellip: '…' };
function htmlText(html) {
  return String(html || '').replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, g) => g[0] === '#' ? String.fromCodePoint(parseInt(g[1].toLowerCase() === 'x' ? g.slice(2) : g.slice(1), g[1].toLowerCase() === 'x' ? 16 : 10)) : (ENTITY[g] ?? m));
}
// the significant words of a book's title (before any date or subtitle)
const titleWords = (t) => (String(t || '').split(/[(:—]/)[0].normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).filter(w => w.length > 3 && !/^\d+$/.test(w));
function windows(words) {
  const set = new Set();
  for (let i = 0; i + N <= words.length; i++) set.add(words.slice(i, i + N).join('\u0001'));
  return set;
}
function containment(a, b) {
  if (!a.size) return null;
  let shared = 0;
  for (const window of a) if (b.has(window)) shared++;
  return { shared, total: a.size, ratio: shared / a.size };
}
function readCourse(code) {
  const dir = path.join(root, 'books', code);
  const out = { course: code, textbookWords: null, readings: [], warnings: [] };
  const textbookPath = path.join(dir, 'textbook.md');
  if (!fs.existsSync(textbookPath)) {
    out.warnings.push('MISSING_TEXTBOOK');
    return { out, shingles: [] };
  }
  const bookWords = tokens(fs.readFileSync(textbookPath, 'utf8'));
  const bookWindows = windows(bookWords);
  out.textbookWords = bookWords.length;
  const shingles = [];
  for (let i = 1; i <= 5; i++) {
    const name = `reading-${i}.md`;
    const file = path.join(dir, name);
    if (!fs.existsSync(file)) {
      out.readings.push({ reading: i, status: 'MISSING' });
      out.warnings.push(`MISSING_READING_${i}`);
      continue;
    }
    const words = tokens(fs.readFileSync(file, 'utf8'));
    const readingWindows = windows(words);
    const match = containment(readingWindows, bookWindows);
    const highOverlap = match && match.total >= MIN_WINDOWS && match.ratio >= CONTAINMENT_THRESHOLD;
    const sizeAdvisory = words.length < 3000 ? 'BELOW_3000_WORD_TARGET' :
      words.length > 6000 ? 'ABOVE_6000_WORD_TARGET' : null;
    out.readings.push({ reading: i, words: words.length,
      unique10WordWindows: readingWindows.size,
      textbookOverlap: match && { shared: match.shared, total: match.total,
        percentage: +(100 * match.ratio).toFixed(2) },
      highOverlap: !!highOverlap, sizeAdvisory });
    if (highOverlap) out.warnings.push(`READING_${i}_DUPLICATES_TEXTBOOK`);
    if (sizeAdvisory) out.warnings.push(`READING_${i}_${sizeAdvisory}`);
    shingles.push({ course: code, reading: i, windows: readingWindows });
  }
  return { out, shingles };
}

/* The site layout: the textbook's English text, and each of the reading room's
   English digests (<div class="lang-en block dg-block">, up to the Spanish one). */
function readSiteCourse(code) {
  const { textbook, readings } = SITE.get(code);
  const out = { course: code, textbook: textbook.title?.en, textbookWords: null, readings: [], warnings: [] };
  const bookWords = tokens(htmlText(textbook.body?.en));
  if (!bookWords.length) { out.warnings.push('MISSING_TEXTBOOK_TEXT'); return { out, shingles: [] }; }
  out.textbookWords = bookWords.length;
  const bookWindows = windows(bookWords), bookTitle = titleWords(textbook.title?.en);
  const roomFile = readings && path.join(root, 'src/body/rooms', `${readings.page}.html`);
  if (!roomFile || !fs.existsSync(roomFile)) { out.warnings.push('MISSING_READING_ROOM'); return { out, shingles: [] }; }
  const room = fs.readFileSync(roomFile, 'utf8');
  const blocks = room.split(/<div class="lang-en block dg-block">/).slice(1).map(b => b.split(/<div class="lang-es block/)[0]);
  if (blocks.length !== 5) out.warnings.push(`EXPECTED_5_DIGESTS_FOUND_${blocks.length}`);
  const shingles = [];
  blocks.forEach((block, k) => {
    const i = k + 1;
    const title = htmlText((/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(block) || [])[1]).replace(/\s+/g, ' ').trim();
    const src = htmlText((/<p class="dg-src">([\s\S]*?)<\/p>/.exec(block) || [])[1]).replace(/\s+/g, ' ').trim();
    const words = tokens(htmlText(block));
    const readingWindows = windows(words);
    const match = containment(readingWindows, bookWindows);
    const highOverlap = match && match.total >= MIN_WINDOWS && match.ratio >= CONTAINMENT_THRESHOLD;
    const stem = (w) => w.replace(/s$/, '');
    const srcWords = new Set((src.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).map(stem));
    const sameSource = bookTitle.length >= 2 && bookTitle.filter(w => srcWords.has(stem(w))).length / bookTitle.length >= 0.5;
    /* The digest's quotations from its original (6+ words, in curly or straight
       quotes): found in the textbook text, the digest covers passages the
       student has already read in the textbook. */
    const norm = (t) => (t.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).join(' ');
    const bookFlat = ' ' + bookWords.join(' ') + ' ';
    const quotes = [...htmlText(block).matchAll(/[“"]([^”"]{25,400})[”"]/g)].map(m => norm(m[1])).filter(q => q.split(' ').length >= 6);
    const quotesInTextbook = quotes.filter(q => bookFlat.includes(' ' + q + ' ')).length;
    out.readings.push({ reading: i, title, source: src, words: words.length,
      unique10WordWindows: readingWindows.size,
      textbookOverlap: match && { shared: match.shared, total: match.total, percentage: +(100 * match.ratio).toFixed(2) },
      highOverlap: !!highOverlap, sameSource, quotes: quotes.length, quotesInTextbook });
    if (highOverlap) out.warnings.push(`READING_${i}_DUPLICATES_TEXTBOOK`);
    if (sameSource) out.warnings.push(`READING_${i}_SAME_SOURCE_AS_TEXTBOOK`);
    if (quotes.length && quotesInTextbook / quotes.length >= 0.5) out.warnings.push(`READING_${i}_QUOTES_TEXTBOOK_PASSAGES`);
    shingles.push({ course: code, reading: i, windows: readingWindows });
  });
  return { out, shingles };
}

const all = CODES.map(BETA ? readSiteCourse : readCourse);
const cross = [];
const readings = all.flatMap(x => x.shingles);
for (let i = 0; i < readings.length; i++) {
  for (let j = i + 1; j < readings.length; j++) {
    const a = readings[i], b = readings[j];
    if (a.course === b.course || Math.min(a.windows.size, b.windows.size) < MIN_WINDOWS) continue;
    const small = a.windows.size <= b.windows.size ? a : b;
    const large = small === a ? b : a;
    const m = containment(small.windows, large.windows);
    if (m.ratio >= CROSS_THRESHOLD) cross.push({
      smaller: `${small.course}/${BETA ? 'digest' : 'reading'}-${small.reading}${BETA ? '' : '.md'}`,
      larger: `${large.course}/${BETA ? 'digest' : 'reading'}-${large.reading}${BETA ? '' : '.md'}`,
      shared: m.shared, smallerWindows: m.total,
      percentage: +(100 * m.ratio).toFixed(2)
    });
  }
}
const courses = all.map(x => x.out).filter(x => !only || x.course === only);
const report = { source: BETA ? path.join(root, 'src (site layout: textbooks + reading-room digests)') : path.join(root, 'books'), algorithm: `${N}-word normalized window containment`,
  thresholds: { overlapPercent: 80, minWindows: MIN_WINDOWS, ...(BETA ? { sameSourceTitleWords: 0.75 } : { readingWordsAdvisory: [3000, 6000] }) },
  caveat: 'Flags are review leads, not copyright clearance or proof of source independence; historic quotations and translations need human review.',
  courses, crossCourse: cross.filter(x => !only || x.smaller.startsWith(only + '/') || x.larger.startsWith(only + '/')) };
if (flag('--json')) console.log(JSON.stringify(report, null, 2));
else {
  for (const course of courses) {
    console.log(`${course.course}: textbook ${course.textbookWords ?? 'MISSING'} words${course.textbook ? ` (${course.textbook})` : ''}${course.warnings.some(w => w.startsWith('MISSING') || w.startsWith('EXPECTED')) ? ` [${course.warnings.filter(w => w.startsWith('MISSING') || w.startsWith('EXPECTED')).join(', ')}]` : ''}`);
    for (const r of course.readings) console.log(`  R${r.reading}: ${r.words ?? 'MISSING'} words; ${r.textbookOverlap?.percentage ?? 'n/a'}% textbook containment${r.highOverlap ? ' [DUPLICATION]' : ''}${r.sameSource ? ' [SAME SOURCE AS TEXTBOOK]' : ''}${r.quotes ? `; quotes found in textbook ${r.quotesInTextbook}/${r.quotes}` : ''}${r.sizeAdvisory ? ` [${r.sizeAdvisory}]` : ''}${r.title ? `  — ${r.title}` : ''}`);
  }
  console.log(`Cross-course reading pairs >=80% containment: ${report.crossCourse.length}`);
  for (const x of report.crossCourse) console.log(`  ${x.smaller} in ${x.larger}: ${x.percentage}%`);
  console.log('Screen only; original-edition, rights, translation and faculty gates remain.');
}
if (flag('--strict') && courses.some(c => c.warnings.some(w => w.includes('DUPLICATES_TEXTBOOK') || w.includes('SAME_SOURCE_AS_TEXTBOOK')))) process.exitCode = 2;
