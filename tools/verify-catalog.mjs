// Is the generated course catalog the same catalog?
//
// The generated section is smaller than the hand-written one because entities
// were decoded ("&oacute;" -> "ó", "&#8594;" -> "→"): a CMS cannot sensibly
// edit entities, so the collection stores literal characters. That makes a
// byte comparison meaningless and a rendered comparison the honest one.
//
// So both sections are normalised the same way -- entities resolved, whitespace
// between tags collapsed -- and then compared character for character. Same
// tags, same attributes, same order, same text, or it fails.
//
// The reference is the hand-written index.html as it stood in the commit that
// landed the Astro build, read straight out of git so the gate still works in a
// fresh clone. Either side can be overridden with a file path.
//
//   node tools/verify-catalog.mjs                          # git reference vs dist/
//   node tools/verify-catalog.mjs <original.html> <built.html>

import fs from 'fs';
import { execFileSync } from 'child_process';

const REF = 'c257ea2:public/index.html';   // last commit with the catalog hand-written

const ENT = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', ldquo: '“', rdquo: '”',
  lsquo: '‘', rsquo: '’', hellip: '…',
  aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú',
  ntilde: 'ñ', uuml: 'ü', Aacute: 'Á', Eacute: 'É', Iacute: 'Í',
  Oacute: 'Ó', Uacute: 'Ú', Ntilde: 'Ñ',
};
const unknown = new Set();
function decode(s) {
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, g) => {
    if (g[0] === '#') return String.fromCodePoint(parseInt(g[1].toLowerCase() === 'x' ? g.slice(2) : g.slice(1), g[1].toLowerCase() === 'x' ? 16 : 10));
    if (g in ENT) return ENT[g];
    unknown.add(m);
    return m;
  });
}

function read(source) {
  if (source !== REF) return fs.readFileSync(source, 'utf8');
  try {
    return execFileSync('git', ['show', REF], { encoding: 'utf8', maxBuffer: 64 << 20 });
  } catch (e) {
    throw new Error(`could not read the reference catalog from git (${REF}). ` +
                    `Run from inside the repo, or pass a file path.`);
  }
}

function catalog(source) {
  const h = read(source);
  const a = h.indexOf('<section id="catalog">');
  if (a < 0) throw new Error(`${source}: no catalog section`);
  return h.slice(a, h.indexOf('</section>', a) + '</section>'.length);
}

// "&amp;" and "&" must normalise to the same thing, so decode first, then
// collapse the whitespace that only ever sat between tags for readability.
const norm = s => decode(s)
  .replace(/>\s+</g, '><')
  .replace(/\s+/g, ' ')
  .trim();

/* Spanish course names changed on purpose since the catalog was hand-written:
   the seminary's Certificate Maker names (Dr. Cook, 29 Sept 2026: "where the
   website catalog and Certificate Maker differ ... use the terminology from the
   current Certificate Maker"; src/data/certificate-courses.json). Each is
   applied to the reference -- that course's card, its Spanish title, from
   exactly this to exactly that -- so the comparison still fails on anything
   else. [course file, was, is] */
const RENAMED = [
  ["CTS1Peter", "1 Pedro Intensivo", "1 Pedro: Curso Intensivo"],
  ["CTSActs", "Hechos", "Hechos: Curso Intensivo"],
  ["CTSBibleCharacters", "Personajes de la Biblia", "Personajes Bíblicos"],
  ["CTSBibleCharacters2", "Personajes de la Biblia II", "Personajes Bíblicos II"],
  ["CTSWorship", "Adoración", "Adoración Cristiana"],
  ["CTSCults", "Las Sectas y las Religiones del Mundo", "Sectas y Religiones del Mundo"],
  ["CTSDeaconFamilyMinistry", "Plan de Ministerio Familiar del Diácono", "Plan de Ministerio Familiar de Diáconos"],
  ["CTSGalatians", "Gálatas Intensivo", "Gálatas: Curso Intensivo"],
  ["CTSGenesis", "Génesis Intensivo", "Génesis: Curso Intensivo"],
  ["CTSJosh", "Josué", "Josué: Curso Intensivo"],
  ["CTSMatt", "Mateo Intensivo", "Mateo: Curso Intensivo"],
  ["CTS_Narrative_Preaching", "La Predicación Narrativa", "Predicación Narrativa"],
  ["ethics_unit01", "Ética Cristiana", "Ética Pastoral y Cristiana"],
  ["CTSPM", "Ministerios Pastorales", "Ministerio Pastoral"],
  ["CTSPent", "El Pentateuco", "Pentateuco"],
  ["CTS_WiseSpeak_Preaching", "La Predicación", "Predicación"],
  ["CTSRev", "Apocalipsis Intensivo", "Apocalipsis: Curso Intensivo"],
  ["CTSHS", "El Espíritu Santo", "La Doctrina del Espíritu Santo"]
];

/* Courses added since the catalog was hand-written (docs/adding-a-course.md).
   Each one's card is taken out of the built catalog before the comparison --
   after checking it is there exactly once and sits directly after the card it
   was placed behind -- so everything else is still compared character for
   character. [course file, the course file whose card it follows] */
const ADDED = [
  ["CTSParables", "CTSBibleCharacters2"],          // 3 Oct 2026, the 45th course
];
/* The lead spells the course count out in words; the reference says forty-four. */
const COUNT = [
  ["Forty-four courses", "Sixty-five courses"],  // 45 on 3 Oct, 65 on 24 Oct 2026
  ["Cuarenta y cuatro cursos", "Sesenta y cinco cursos"],
  /* 13 Oct 2026: the site is in three languages, so the lead no longer says "bilingual". */
  ["each complete and bilingual.", "each complete, in English, Spanish, and French."],
  ["cada uno completo y bilingüe.", "cada uno completo, en inglés, español y francés."],
];

const [origFile = REF, builtFile = 'dist/index.html'] = process.argv.slice(2);

let o = norm(catalog(origFile));
for (const [key, was, is] of RENAMED) {
  const en = JSON.parse(fs.readFileSync(`src/content/courses/${key}.json`, 'utf8')).title.en;
  const from = `<span class="en">${en}</span><span class="es">${was}</span>`;
  if (o.split(from).length !== 2) { console.log(`FAIL — the reference has no single card "${en} / ${was}" to rename`); process.exit(1); }
  o = o.replace(from, `<span class="en">${en}</span><span class="es">${is}</span>`);
}
for (const [was, is] of COUNT) {
  if (o.split(was).length !== 2) { console.log(`FAIL — the reference does not say "${was}" exactly once`); process.exit(1); }
  o = o.replace(was, is);
}
let b = norm(catalog(builtFile));
/* The redesigned front page (issue #186) adds to the catalog without changing
   a card: the seven foundation courses shown first (a.fcard, checked here and
   then set aside), two short sub-headings, and each group folded in a
   <details> whose <summary> holds the group's heading and a course count.
   Those are taken away so the cards and headings are still compared
   character for character with the hand-written catalog. */
{
  const first = /<div class="foundation-first">[\s\S]*?<\/a><\/div><\/div>/.exec(b);
  const fcards = first ? (first[0].match(/<a class="fcard" href="[^"]+"/g) || []).length : 0;
  if (fcards !== 7) { console.log(`FAIL — the built catalog shows ${fcards} foundation courses first, not 7`); process.exit(1); }
  b = b.replace(first[0], '');
  b = b.replace(/<div class="catsub">[\s\S]*?<\/p><\/div>/g, '');
  b = b.replace(/<details class="catfold"[^>]*><summary>(<h3>[\s\S]*?<\/h3>)<span class="catcount">\d+<\/span><\/summary>/g, '$1');
  b = b.replace(/<\/div><\/details><\/div>/g, '</div></div>');
  if (/<details|<summary|fcard|catsub/.test(b)) { console.log('FAIL — the catalog has redesign markup this check does not know how to set aside'); process.exit(1); }
  console.log('redesign set aside: 7 foundation courses first, folded groups');
}
for (const [key, after] of ADDED) {
  const entry = JSON.parse(fs.readFileSync(`src/content/courses/${key}.json`, 'utf8')).entry;
  const prev = JSON.parse(fs.readFileSync(`src/content/courses/${after}.json`, 'utf8')).entry;
  const card = new RegExp('<a class="course" href="' + entry + '">[\\s\\S]*?</a>').exec(b);
  if (!card || b.split(card[0]).length !== 2) { console.log(`FAIL — the built catalog does not have exactly one card for ${key} (${entry})`); process.exit(1); }
  const before = b.slice(0, card.index);
  if (!new RegExp('<a class="course" href="' + prev + '">[\\s\\S]*?</a>$').test(before)) {
    console.log(`FAIL — ${key}'s card does not directly follow ${after}'s, where it was placed`); process.exit(1);
  }
  b = b.split(card[0]).join('');
  console.log(`added course set aside: ${key}, after ${after}`);
}

/* Whole catalog groups added since (src/data/catalog-groups.json), each set
   aside as one block after checking it holds exactly the cards of its courses,
   in order. 24 Oct 2026: the twenty denominational electives, four groups of
   five, after the last original group. */
const ADDED_GROUPS = [
  'pentecostal-charismatic-electives', 'baptist-electives', 'wesleyan-electives', 'reformed-electives',
];
{
  const groups = JSON.parse(fs.readFileSync('src/data/catalog-groups.json', 'utf8'));
  const cards = fs.readdirSync('src/content/courses').map(f => JSON.parse(fs.readFileSync(`src/content/courses/${f}`, 'utf8')));
  for (const id of ADDED_GROUPS) {
    const g = groups.find(x => x.id === id);
    if (!g) { console.log(`FAIL — catalog group ${id} is not in src/data/catalog-groups.json`); process.exit(1); }
    const head = norm(`<div class="catgroup"><h3><span class="en">${g.title.en}</span>`);
    const at = b.indexOf(head);
    if (at < 0 || b.indexOf(head, at + 1) >= 0) { console.log(`FAIL — the built catalog does not have exactly one "${g.title.en}" group`); process.exit(1); }
    const end = b.indexOf('</div></div>', at) + '</div></div>'.length;
    const block = b.slice(at, end);
    const want = cards.filter(c => c.group === id).sort((x, y) => x.order - y.order).map(c => c.entry);
    const got = [...block.matchAll(/<a class="course" href="([^"]+)"/g)].map(m => m[1]);
    if (want.join() !== got.join()) { console.log(`FAIL — the "${g.title.en}" group shows ${got.join(', ')}; its courses are ${want.join(', ')}`); process.exit(1); }
    b = b.slice(0, at) + b.slice(end);
    console.log(`added group set aside: ${g.title.en} (${got.length} courses)`);
  }
}

const count = s => (s.match(/<a class="course"/g) || []).length;
console.log(`cards: ${count(o)} original, ${count(b)} built`);

if (unknown.size) console.log(`note: entities left as-is on both sides: ${[...unknown].join(' ')}`);

if (o === b) {
  console.log(`PASS — the generated catalog is the hand-written catalog (${o.length} normalised characters).`);
} else {
  let i = 0;
  while (i < o.length && i < b.length && o[i] === b[i]) i++;
  console.log(`FAIL — first difference at normalised character ${i} of ${o.length}/${b.length}`);
  console.log(`  original: ...${o.slice(Math.max(0, i - 90), i + 110)}`);
  console.log(`  built   : ...${b.slice(Math.max(0, i - 90), i + 110)}`);
  process.exitCode = 1;
}
