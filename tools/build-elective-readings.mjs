#!/usr/bin/env node
/* One denominational elective's reading room and its private reading test,
 * from the course's content folder (docs/reading-rooms.md, "Elective reading
 * rooms").
 *
 *   node tools/build-elective-readings.mjs <CODE>            # check only
 *   node tools/build-elective-readings.mjs <CODE> --write
 *     [--content DIR]   default $ELECTIVE_CONTENT or ../elective-content (beside this repo)
 *
 * CODE is A-C1 … D-C5. The course is tools/import-electives.mjs prefixOf(CODE)
 * (A-C1 -> CTSElecPC1); its test slug is elec<tag><one..five>readings
 * (elecpconereadings: letters only, as cts-sync.js requires) and its room
 * <Prefix>Readings.html. <DIR>/<CODE>/ holds
 *   readings.json  five { n, label, title, source, caption, digest } in en, es,
 *                  fr; each digest is the dg-doc HTML of a CTS digest, with the
 *                  same structure in all three languages
 *   bank.json      the forty-question bank (src/data/readings format, with fr)
 *   accept.json    its accepted alternates, keyed by question id (with fr)
 * and, written before this is run, src/data/reading-shelf.json holds the
 * room's further-study shelf (rooms.<Prefix>Readings, with locusFr, nameFr and
 * captionFr beside the English and Spanish).
 *
 * --write, in order:
 *   1. copies bank and accept file to <keys>/readings-src/<slug>.{bank,accept}.json
 *      (the private checkout: ASSESSMENT_KEYS or ../assessment-keys) and adds
 *      the course to src/data/elective-readings.json, the rows
 *      tools/import-readings.mjs reads (private: true, requiredFrom null);
 *      then runs the importer for this test only;
 *   2. writes the room src/body/rooms/<Prefix>Readings.html on the Worship
 *      room's markup (the five cards with their EN and ES digests, the honors
 *      notice, counter and attestation notice, empty CTS-ATTEST and CTS-SHELF
 *      marker pairs), adds it to src/data/rooms.json, and runs
 *      tools/room-test-notices.mjs and tools/reading-rooms.mjs to fill in the
 *      #cts-required notice, the attestation and the shelf;
 *   3. writes the room's French, src/data/french-readings/room/<Prefix>Readings.json:
 *      every digest leaf paired with its French leaf in document order (keyed
 *      by leafKey), and the card lines, notices and shelf; then checks that
 *      every English passage of the room has French;
 *   4. records the room in src/lib/partials.ts READING_ROOM and re-imports the
 *      course's units (tools/import-electives.mjs CODE), which puts the
 *      course-readings box on its ten units; runs tools/private-units.mjs and
 *      tools/gen-worker-catalog.mjs.
 * Then build, and pin the new bank's review passages:
 *   npm run build   (it stops at "Review reference needs editorial refresh")
 *   node tools/exam-review.mjs dist --refresh-missing
 *   npm run build
 * Running it again rewrites the same files the same way.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parse } from 'node-html-parser';
import { fitFrench } from './french-fit.mjs';
import { refuseHeld } from './elective-held.mjs';
import { TRADITIONS, prefixOf } from './import-electives.mjs';
import { resolveKeysRoot } from './grading-keys-lib.mjs';
import { bodyLeaves, translatable, leafKey, markupSegments, loadStore, storeFile, augmentHtml, frenchSpaces, tagProblem } from './french-readings-lib.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
process.chdir(ROOT);
const argv = process.argv.slice(2);
const WRITE = argv.includes('--write');
const opt = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
const CODE = argv.find((a, i) => !a.startsWith('--') && argv[i - 1] !== '--content');
if (!CODE || !/^[A-D]-C[1-5]$/.test(CODE)) { console.error('usage: node tools/build-elective-readings.mjs <A-C1 … D-C5> [--write] [--content DIR]'); process.exit(2); }
refuseHeld(CODE, 'reading room and reading test');
const CONTENT = path.resolve(opt('--content') || process.env.ELECTIVE_CONTENT || path.join(ROOT, '..', 'elective-content'), CODE);
const LANGS = ['en', 'es', 'fr'];
const NUM = ['one', 'two', 'three', 'four', 'five'];
const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const writeJson = (f, d, indent = 1) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(d, null, indent) + '\n'); };
const fails = [];
const fail = (m) => fails.push(m);
const stop = () => { if (fails.length) { console.error(`${fails.length} problem(s); nothing ${WRITE ? 'more ' : ''}written:`); fails.slice(0, 40).forEach((m) => console.error('  ' + m)); process.exit(1); } };
const run = (args) => {
  const r = spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) { console.error(`node ${args.join(' ')} failed:\n${r.stdout}\n${r.stderr}`); process.exit(1); }
  return r.stdout.trim().split('\n').filter(Boolean).slice(-2).join(' | ');
};

/* ---- names ---- */
const prefix = prefixOf(CODE);
const slug = `elec${TRADITIONS[CODE[0]].tag.toLowerCase()}${NUM[+CODE.slice(-1) - 1]}readings`;
const page = `${prefix}Readings`;
const roomFile = `src/body/rooms/${page}.html`;
const cardFile = `src/content/courses/${prefix}.json`;
if (!fs.existsSync(cardFile)) { console.error(`${cardFile} is missing: import the course first (tools/import-electives.mjs)`); process.exit(2); }
const card = readJson(cardFile);
const title = card.title;
const catalog = readJson('worker/catalog.json');
if (!Object.values(catalog.completions).some((c) => c.page === `${prefix}Certificate.html`)) fail(`worker/catalog.json has no completion with the certificate ${prefix}Certificate.html`);
console.log(`${CODE} -> ${prefix} (${title.en}): test ${slug}, room ${page}.html, content ${CONTENT}`);

/* ---- the content ---- */
for (const f of ['readings.json', 'bank.json', 'accept.json']) if (!fs.existsSync(path.join(CONTENT, f))) { console.error(`${path.join(CONTENT, f)} is missing`); process.exit(2); }
const readings = readJson(path.join(CONTENT, 'readings.json'));
const bank = readJson(path.join(CONTENT, 'bank.json'));
const accept = readJson(path.join(CONTENT, 'accept.json'));
if (!Array.isArray(readings) || readings.length !== 5 || readings.some((r, i) => r.n !== i + 1)) fail('readings.json: five readings, n = 1 to 5, in order');
const pairs = new Map();          // leafKey(English) -> French innerHTML
const unwrapped = [];
/* Stored French carries exactly the English tags; extra French italics are
   dropped and reported (tools/french-fit.mjs), any other difference stops the run. */
const fitTagsTo = (en, fr, where) => {
  const r = fitFrench(en, fr);
  for (const d of r.dropped) unwrapped.push(`${where}: ${d}`);
  if (r.problem) fail(`${where}: the French ${r.problem}`);
  return r.fr;
};
const addPair = (en, fr, where) => {
  if (!fr || !String(fr).trim()) { fail(`${where}: no French`); return; }
  fr = frenchSpaces(fitTagsTo(en, fr, where));
  const k = leafKey(en);
  if (pairs.has(k) && pairs.get(k) !== fr) fail(`${where}: the same English has two different French texts`);
  pairs.set(k, fr);
};
for (const r of readings) {
  for (const f of ['label', 'title', 'source', 'caption', 'digest'])
    for (const l of LANGS) if (typeof r[f]?.[l] !== 'string' || !r[f][l].trim()) fail(`reading ${r.n}: no ${l} ${f}`);
  if (fails.length) continue;
  const h2 = LANGS.map((l) => (r.digest[l].match(/<h2\b/g) || []).length);
  if (new Set(h2).size !== 1) fail(`reading ${r.n}: the digest has ${h2.join(' / ')} h2 headings in en / es / fr`);
  for (const l of LANGS) if (!/^<header class="dg-doc">/.test(r.digest[l].trim()) || !/<\/footer>$/.test(r.digest[l].trim())) fail(`reading ${r.n} ${l}: the digest is not a dg-doc (header … footer)`);
  if (/<(script|style|iframe)\b/i.test(LANGS.map((l) => r.digest[l]).join(''))) fail(`reading ${r.n}: a digest carries a script, style or frame`);
  const L = Object.fromEntries(LANGS.map((l) => [l, bodyLeaves(r.digest[l]).list.filter(translatable)]));
  const tags = (l) => L[l].map((e) => e.tagName).join(',');
  if (tags('fr') !== tags('en') || tags('es') !== tags('en')) { fail(`reading ${r.n}: the digest's leaves do not pair (${L.en.length} en, ${L.es.length} es, ${L.fr.length} fr, or their tags differ)`); continue; }
  L.en.forEach((leaf, i) => addPair(leaf.innerHTML, L.fr[i].innerHTML, `reading ${r.n} digest leaf ${i + 1}`));
}
if (bank.questions?.length !== 40) fail(`bank.json: ${bank.questions?.length} questions, not 40`);
for (const q of bank.questions || []) if (!q.fr || !q.answer_fr) fail(`bank.json #${q.id}: no French prompt or answer`);
stop();

/* ---- the room's own text, in three languages ---- */
const byline = (r) => ({ en: `A CTS digest of ${r.source.en}`, es: `Un resumen del STC de ${r.source.es}`, fr: `Un résumé du STC de ${r.source.fr}` });
const ELECTIVES = 'src/data/elective-readings.json';
const elective = fs.existsSync(ELECTIVES) ? readJson(ELECTIVES) : { _: 'The denominational electives\' reading tests and rooms, written by tools/build-elective-readings.mjs; tools/import-readings.mjs reads `tests`. A row\'s `tagline` and `onsite` may be edited here; the tool keeps them.', tests: [] };
const prior = elective.tests.find((t) => t.code === CODE) || {};
/* What the room says about its digests; a course may say more in
   src/data/elective-readings.json (onsite), which is kept. */
const onsite = prior.onsite || {
  en: '<strong>On this site:</strong> Each of the five readings is a Chapala Theological Seminary digest, written by CTS, available in English, Spanish and French here on the site — every one opens directly from this page, with nothing to download. Each card names the work its digest is made from.',
  es: '<strong>En este sitio:</strong> Cada una de las cinco lecturas es un resumen del Seminario Teológico de Chapala, escrito por el STC, disponible en inglés, español y francés aquí en el sitio — cada una se abre directamente desde esta página, sin nada que descargar. Cada tarjeta nombra la obra de la que se hizo su resumen.',
  fr: '<strong>Sur ce site :</strong> chacune des cinq lectures est un résumé du STC, rédigé par le STC et disponible en anglais, en espagnol et en français ici sur le site — tous s’ouvrent directement depuis cette page, sans rien à télécharger. Chaque carte nomme l’œuvre dont son résumé est tiré.',
};
const tagline = prior.tagline || { en: title.en, es: title.es, fr: title.fr };
const row = { code: CODE, slug, page, course: prefix,
  title: { en: `${title.en}: Required Readings`, es: `${title.es}: Lecturas Requeridas` },
  room: { en: `the five readings in the ${title.en} Reading Room`, es: `las cinco lecturas de ${title.es}` },
  tagline, onsite };

/* ---- the room page, on the Worship room's markup ---- */
const MODEL = fs.readFileSync('src/body/rooms/CTSWorshipReadings.html', 'utf8');
const cut = (from, to, where) => {
  const a = MODEL.indexOf(from); const b = to == null ? MODEL.length : MODEL.indexOf(to, a + from.length);
  if (a < 0 || b < 0) { console.error(`the model room CTSWorshipReadings.html changed: no ${where}`); process.exit(2); }
  return MODEL.slice(a, to == null ? b : b + to.length);
};
const honorsNotice = cut('<div class="notice">\n    <span class="lang-en block"><strong>Honors option:</strong>', '\n  </div>', 'honors notice');
const counter = cut('<div class="counter">', '</div>', 'counter');
// the summary and note line, up to and including the opening of the digest's scroll box
const summary = cut('<details class="digest-inline"><summary>', '<div class="dg-scroll">', 'digest summary');
const pick = cut('<label class="pick">', '</label>', 'select box');
const tail = cut('  <div class="notice">\n    <span class="lang-en block"><strong>Honor attestation:</strong>', null, 'attestation notice and script');
const both = (o, tag = 'span', cls = '') => `<${tag} class="lang-en${cls}">${o.en}</${tag}><${tag} class="lang-es${cls}">${o.es}</${tag}>`;
const cardHtml = (r) => `    <article class="reading">
      <div class="num">${both(r.label)}</div>
      <h3>${both(r.title)}</h3>
      <div class="byline">${both(byline(r))}</div>
      <p class="lang-en">${r.caption.en}</p>
      <p class="lang-es">${r.caption.es}</p>
      <div class="actions">
        ${summary}<div class="lang-en block dg-block">
${r.digest.en.trim()}
</div><div class="lang-es block dg-block">
${r.digest.es.trim()}
</div></div></details>
        ${pick}
      </div>
    </article>`;
const roomHtml = `${honorsNotice}

  <div class="notice">
    ${both(onsite, 'span', ' block')}
  </div>

  ${counter}

  <div class="grid" id="cts-readings">

${readings.map(cardHtml).join('\n\n')}

  </div>
<!-- CTS-ATTEST: the honours-reading attestation, written by tools/reading-rooms.mjs; edit there -->
<!-- /CTS-ATTEST -->

<!-- CTS-SHELF: the public-domain shelf, written by tools/reading-rooms.mjs from src/data/reading-shelf.json; edit there -->
<!-- /CTS-SHELF -->

${tail}`;

/* ---- the French for everything on the room that is not a digest ---- */
for (const r of readings) {
  for (const f of ['label', 'title', 'caption']) addPair(r[f].en, r[f].fr, `reading ${r.n} ${f}`);
  const b = byline(r); addPair(b.en, b.fr, `reading ${r.n} byline`);
}
addPair(onsite.en, onsite.fr, 'the "On this site" notice');
const shelf = readJson('src/data/reading-shelf.json').rooms[page];
if (!shelf) fail(`src/data/reading-shelf.json has no shelf for ${page}: write it first (with locusFr, nameFr, captionFr)`);
else {
  for (const e of shelf.entries) for (const [en, fr] of [['locusEn', 'locusFr'], ['nameEn', 'nameFr'], ['captionEn', 'captionFr']]) addPair(e[en], e[fr], `shelf ${e.id} ${en}`);
  const n = shelf.entries.length;
  const W = { 3: ['three', 'trois'], 4: ['four', 'quatre'], 5: ['five', 'cinq'], 6: ['six', 'six'], 7: ['seven', 'sept'], 8: ['eight', 'huit'], 9: ['nine', 'neuf'], 10: ['ten', 'dix'], 12: ['twelve', 'douze'], 14: ['fourteen', 'quatorze'] }[n] || [String(n), String(n)];
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  addPair(`Further Study: ${cap(W[0])} Public-Domain Works`, `Pour aller plus loin : ${W[1]} œuvres du domaine public`, 'shelf heading');
  addPair(`These ${W[0]} works are for further study, for the student who wants to go on reading. They are not part of the honors reading above: that stays as it is &mdash; the five CTS digests, any three read in full and recorded on your honor. All ${W[0]} are in the public domain; each link opens the work online, and most can also be found in the Internet Archive or Project Gutenberg. Most are in English: the Chrome browser can translate a page (right-click, &ldquo;Translate to&hellip;&rdquo;; on a phone, the browser menu).`,
    `Ces ${W[1]} œuvres sont destinées à l’approfondissement, pour l’étudiant qui veut poursuivre sa lecture. Elles ne font pas partie de la lecture avec mention ci-dessus, qui reste inchangée — les cinq résumés du STC, dont trois au choix lus en entier et attestés sur l’honneur. Les ${W[1]} sont du domaine public ; chaque lien ouvre l’œuvre en ligne, et la plupart se trouvent aussi sur Internet Archive ou le Projet Gutenberg. La plupart sont en anglais : le navigateur Chrome peut traduire une page (clic droit, « Traduire en… » ; sur un téléphone, le menu du navigateur).`, 'shelf note');
}
const done = Object.values(catalog.completions).find((c) => c.page === `${prefix}Certificate.html`);
if (done) addPair(`Chapala Theological Seminary &middot; ${done.name} &middot; present or print this page as your honors reading record.`,
  `Séminaire théologique de Chapala · ${title.fr} · présentez ou imprimez cette page comme attestation de votre lecture pour la mention.`, 'attestation record line');
stop();
if (unwrapped.length) console.log(`French italics dropped to match the English tags (${unwrapped.length}):\n  ${unwrapped.join('\n  ')}`);
if (!WRITE) { console.log(`PASS — ${CODE}: five readings pair in three languages; ${pairs.size} French passages ready. Run with --write.`); process.exit(0); }

/* ---- 1. the private bank and the test row ---- */
const keys = resolveKeysRoot('.');
if (!keys) { console.error('the private assessment-keys checkout is missing (ASSESSMENT_KEYS or ../assessment-keys)'); process.exit(2); }
fs.mkdirSync(path.join(keys, 'readings-src'), { recursive: true });
fs.copyFileSync(path.join(CONTENT, 'bank.json'), path.join(keys, 'readings-src', `${slug}.bank.json`));
fs.copyFileSync(path.join(CONTENT, 'accept.json'), path.join(keys, 'readings-src', `${slug}.accept.json`));
elective.tests = [...elective.tests.filter((t) => t.code !== CODE), row].sort((a, b) => a.code.localeCompare(b.code));
writeJson(ELECTIVES, elective, 1);
console.log(`1. bank -> ${path.join(keys, 'readings-src', slug)}.{bank,accept}.json; ${run(['tools/import-readings.mjs', '--write', '--only', slug])}`);

/* ---- 2. the room ---- */
{ // the room as a browser reads it: five cards, each with its digest and, outside it, its select box
  const root = parse(roomHtml, { comment: true });
  const cards = root.querySelectorAll('article.reading');
  if (cards.length !== 5 || cards.some((a) => a.querySelectorAll('details.digest-inline').length !== 1 || a.querySelector('label.pick')?.closest('details')
    || a.querySelectorAll('details .dg-block').length !== 2)) { console.error('2. the room markup is not five cards, each with one digest (EN and ES) and a select box outside it'); process.exit(1); }
}
fs.writeFileSync(roomFile, roomHtml);
const roomsFile = 'src/data/rooms.json';
const rooms = readJson(roomsFile);
const worship = rooms.rooms.CTSWorshipReadings;
rooms.rooms[page] = { course: prefix, title: `CTS ${title.en} — Supplemental Reading Room`, kind: 'room', heading: worship.heading, tagline };
writeJson(roomsFile, rooms, 1);
console.log(`2. ${roomFile}; ${run(['tools/room-test-notices.mjs', '--write'])}; ${run(['tools/reading-rooms.mjs'])}`);

/* ---- 3. the room's French ---- */
const built = fs.readFileSync(roomFile, 'utf8');
const storePath = storeFile('room', page);
const { files } = loadStore();
const others = new Map();     // French already stored for other pages (the shared interface lines)
// shared only with the core rooms and digests: an elective room's store never leans on
// another elective's, so holding or removing one course cannot strip another's French
for (const { file, data } of files) if (path.resolve(file) !== path.resolve(storePath) && !/room[\\/]CTSElec[^\\/]*\.json$/.test(file)) for (const [k, e] of Object.entries(data.entries || {})) if (!others.has(k)) others.set(k, { ...e, key: k, file });
const entries = {};
const missing = [];
/* The textbook notice tools/room-test-notices.mjs puts at the top of the room
   once the course has a textbook (tools/build-elective-textbook.mjs): its
   French in the wording the other rooms' notices use, with the book's own
   French title. */
const tbBook = fs.readdirSync('src/content/textbooks').map((f) => readJson(`src/content/textbooks/${f}`)).find((b) => b.course === prefix);
const tbNoticeFr = (en) => {
  if (!tbBook || !/^<strong>The Master's textbook test:<\/strong>/.test(en) || !/fill-in-the-blank questions/.test(en) || !/It is separate from the reading test/.test(en)) return null;
  return `<strong>Le test du manuel du Master :</strong> lisez <a href="/${tbBook.page}.html">${tbBook.title.fr ?? tbBook.title.en}</a>, puis passez <a href="/${tbBook.page}Test.html">son test</a> : vingt questions à compléter, tirées d’un ensemble de quarante ; dix-huit bonnes réponses suffisent pour réussir. Chaque réponse est immédiatement marquée comme correcte ou incorrecte. Les bonnes réponses et les explications deviennent disponibles après la réussite de la tentative. Il est distinct du test de lecture sur les cinq résumés ci-dessous : réussir l’un ne valide pas l’autre. Dans les parcours M.Div. et Th.M., les deux tests sont en cours de mise en place ; la page de chaque test indique s’il est déjà en vigueur. D’ici là, tout étudiant peut les passer, et une réussite est conservée dans votre dossier.`;
};
for (const s of markupSegments(built)) {
  if (others.has(s.key)) continue;
  const notice = tbNoticeFr(s.en);
  const fr = pairs.get(s.key) ?? (notice && frenchSpaces(notice));
  if (fr == null) { missing.push(`${s.tag}: ${s.en.replace(/<[^>]+>/g, '').slice(0, 90)}`); continue; }
  entries[s.key] = { en: s.en, fr, tr: { fr: { status: 'machine', from: s.key } } };
}
if (missing.length) { console.error(`3. ${missing.length} English passage(s) of the room have no French:`); missing.slice(0, 30).forEach((m) => console.error('   ' + m)); process.exit(1); }
writeJson(storePath, { item: `room:${page}`, source: roomFile, entries }, 1);
const memory = new Map(others); for (const [k, e] of Object.entries(entries)) memory.set(k, { ...e, key: k, file: storePath });
const check = augmentHtml(built, memory);
if (check.missing) { console.error(`3. ${check.missing} English block(s) would stay English on the French room page`); process.exit(1); }
console.log(`3. ${storePath}: ${Object.keys(entries).length} French passages (${check.inserted} French blocks on the room page, none left in English)`);

/* ---- 4. the units link the room ---- */
const partials = 'src/lib/partials.ts';
let ts = fs.readFileSync(partials, 'utf8');
if (!new RegExp(`\\n  ${prefix}: "${page}\\.html",`).test(ts)) {
  const end = ts.indexOf('\n};', ts.indexOf('export const READING_ROOM'));
  ts = ts.slice(0, end) + `\n  ${prefix}: "${page}.html",` + ts.slice(end);
  fs.writeFileSync(partials, ts);
}
const SOURCES = path.join(keys, 'sources', 'denominational');
console.log(`4. READING_ROOM.${prefix}; ${run(['tools/import-electives.mjs', SOURCES, keys, CODE, '--write'])}; ${run(['tools/private-units.mjs'])}; ${run(['tools/gen-worker-catalog.mjs'])}`);
console.log(`Done. Now: npm run build; node tools/exam-review.mjs dist --refresh-missing; npm run build.`);
