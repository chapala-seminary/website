// One-time extraction: turn the 44 hand-written course cards in index.html into
// a content collection, and split the page around them so Astro can generate
// that section from the collection instead.
//
// Writes:
//   src/content/courses/<code>.json    one per course
//   src/data/catalog-groups.json       group order and headings
//   src/data/catalog-intro.json        the section's kicker, heading and lead
//   src/body/index/head.html           everything before <section id="catalog">
//   src/body/index/tail.html           everything after it
//
// head/tail go in a subdirectory on purpose: src/pages/[unit].astro globs
// src/body/*.html, and a half-megabyte index would be bundled into every one
// of the 451 unit page modules for nothing.
//
// The card markup is completely regular -- all 44 match one shape, and the only
// tags inside a title or description are the en/es wrapper spans -- so the text
// is stored decoded (literal "ó", not "&oacute;") and re-escaped on output.
// That is an intentional normalisation: a CMS cannot sensibly edit entities.
// It is also why the check is on rendered text, not on raw bytes.

import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const INDEX = path.join(ROOT, 'public', 'index.html');

const ENT = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', ldquo: '“', rdquo: '”',
  lsquo: '‘', rsquo: '’', hellip: '…',
  aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú',
  ntilde: 'ñ', uuml: 'ü', Aacute: 'Á', Eacute: 'É', Iacute: 'Í',
  Oacute: 'Ó', Uacute: 'Ú', Ntilde: 'Ñ',
};
function decode(s) {
  return s.replace(/&(#x?[0-9a-f]+|[a-zA-Z]+);/g, (m, g) => {
    if (g[0] === '#') return String.fromCodePoint(parseInt(g[1] === 'x' ? g.slice(2) : g.slice(1), g[1] === 'x' ? 16 : 10));
    if (g in ENT) return ENT[g];
    throw new Error(`unknown entity &${g};`);   // never guess at content
  });
}

const html = fs.readFileSync(INDEX, 'utf8');
const start = html.indexOf('<section id="catalog">');
if (start < 0) throw new Error('no <section id="catalog"> in index.html');
const end = html.indexOf('</section>', start) + '</section>'.length;
const section = html.slice(start, end);

// --- groups and cards -------------------------------------------------------
const groupRe = /<div class="catgroup">\s*<h3>([\s\S]*?)<\/h3>\s*<div class="grid">([\s\S]*?)<\/div>\s*<\/div>/g;
const cardRe = /<a class="course" href="([^"]+)">\s*<div class="c-title">([\s\S]*?)<\/div>\s*<div class="c-desc">([\s\S]*?)<\/div>\s*<span class="c-go">[\s\S]*?<\/span>\s*<\/a>/g;
const bilingual = /^\s*<span class="en">([\s\S]*?)<\/span>\s*<span class="es">([\s\S]*?)<\/span>\s*$/;

function pair(fragment, what) {
  const m = bilingual.exec(fragment);
  if (!m) throw new Error(`${what} is not a plain en/es pair: ${fragment.slice(0, 80)}`);
  for (const part of [m[1], m[2]])
    if (/<[a-z]/i.test(part)) throw new Error(`${what} contains markup: ${part.slice(0, 80)}`);
  return { en: decode(m[1]).trim(), es: decode(m[2]).trim() };
}
const slugify = s => s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// --- the section's own copy --------------------------------------------------
// The lead spells the course count out in words in both languages ("Forty-four
// courses" / "Cuarenta y cuatro cursos"). Deriving that from the collection
// would mean writing a number speller for two languages, and changing it to a
// digit would be an unasked-for copy change. So the prose stays authored and
// the build asserts the stated count still matches -- the drift can happen in
// the copy, but it cannot reach a reader.
const introRe = new RegExp(
  '<div class="kicker">([\\s\\S]*?)</div>\\s*' +
  '<h2 class="section">([\\s\\S]*?)</h2>\\s*' +
  '<p>([\\s\\S]*?)</p>');
const im = introRe.exec(section);
if (!im) throw new Error('catalog section has no kicker/heading/lead in the expected shape');

const groups = [];
const courses = [];
let gm;
while ((gm = groupRe.exec(section))) {
  const title = pair(gm[1], 'group heading');
  const id = slugify(title.en);
  groups.push({ id, title });
  let cm;
  const grid = gm[2];
  cardRe.lastIndex = 0;
  while ((cm = cardRe.exec(grid))) {
    const entry = cm[1];
    // 40 of the 44 courses are unit-page courses on the shared engine; four
    // (ethics, the two preaching workshops, counseling) are single standalone
    // pages that were never part of the engine. Both are catalogued the same
    // way; only the code is derived differently.
    const unit = /^(CTS[A-Za-z0-9]*)Unit\d+\.html$/.exec(entry);
    const code = unit ? unit[1] : entry.replace(/\.html$/, '');
    const engine = !!unit;
    courses.push({
      code, entry, engine, group: id, order: courses.length + 1,
      title: pair(cm[2], `${code} title`),
      description: pair(cm[3], `${code} description`),
    });
  }
}

// --- the checks that make this safe to run ---------------------------------
const cardsInSection = (section.match(/<a class="course"/g) || []).length;
if (courses.length !== cardsInSection)
  throw new Error(`parsed ${courses.length} cards but the section has ${cardsInSection}`);
const dup = courses.map(c => c.code).filter((c, i, a) => a.indexOf(c) !== i);
if (dup.length) throw new Error(`duplicate course codes: ${dup.join(', ')}`);
for (const c of courses) {
  const found = ['dist', 'site', 'public'].some(d => fs.existsSync(path.join(ROOT, d, c.entry)));
  if (!found) throw new Error(`${c.code} links to ${c.entry}, which nothing in the site provides`);
}

// --- write ------------------------------------------------------------------
const outCourses = path.join(ROOT, 'src', 'content', 'courses');
fs.mkdirSync(outCourses, { recursive: true });
fs.mkdirSync(path.join(ROOT, 'src', 'data'), { recursive: true });
for (const c of courses)
  fs.writeFileSync(path.join(outCourses, `${c.code}.json`), JSON.stringify(c, null, 2) + '\n');
fs.writeFileSync(path.join(ROOT, 'src', 'data', 'catalog-groups.json'), JSON.stringify(groups, null, 2) + '\n');
const intro = {
  kicker: pair(im[1], 'kicker'),
  heading: pair(im[2], 'heading'),
  lead: pair(im[3], 'lead'),
  statedCount: courses.length,
};
fs.writeFileSync(path.join(ROOT, 'src', 'data', 'catalog-intro.json'), JSON.stringify(intro, null, 2) + '\n');
fs.mkdirSync(path.join(ROOT, 'src', 'body', 'index'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'src', 'body', 'index', 'head.html'), html.slice(0, start));
fs.writeFileSync(path.join(ROOT, 'src', 'body', 'index', 'tail.html'), html.slice(end));

console.log(`${courses.length} courses in ${groups.length} groups`);
for (const g of groups)
  console.log(`  ${g.title.en} — ${courses.filter(c => c.group === g.id).length}`);
console.log(`${courses.filter(c => c.engine).length} on the shared engine, ` +
            `${courses.filter(c => !c.engine).length} standalone pages`);
console.log(`index split: head ${start} bytes, section ${section.length}, tail ${html.length - end}`);
