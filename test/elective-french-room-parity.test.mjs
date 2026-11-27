// Regression for the 20 denominational elective French reading rooms.
// Checks the generated translation STORE against the actual EN/ES room source,
// not the intermediate src/body HTML's count of lang-fr elements.
// Does NOT certify academic accuracy, source rights, or human review.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { loadStore, augmentHtml } from '../tools/french-readings-lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(ROOT);
const { files } = loadStore();
// Scope only *elective* room stores to the target. Ordinary reading-room
// stores supply shared notice/chrome translations required by the build;
// excluding all room stores produced six false failures per elective room.
// Another elective must never mask a deleted target-room translation.
const roomPrefix = 'src/data/french-readings/room/';
const electivePrefix = roomPrefix + 'CTSElec';
function roomMemory(allFiles, targetStore) {
  const memory = new Map();
  for (const { file, data } of allFiles) {
    if (file.startsWith(electivePrefix) && file !== targetStore) continue;
    for (const [key, entry] of Object.entries(data.entries || {})) {
      if (!memory.has(key)) memory.set(key, { ...entry, key, file });
    }
  }
  return memory;
}
// Mutation fixture: deleting a target-room entry must not silently fall back
// to the same key supplied by another room. Shared non-room stores remain usable.
{
  const target = roomPrefix + 'CTSElecPC1Readings.json';
  const other = roomPrefix + 'CTSElecPC2Readings.json';
  const shared = 'src/data/french-readings/room/CTSSharedReadings.json';
  const fixture = [
    { file: target, data: { entries: { own: { fr: 'cible' } } } },
    { file: other, data: { entries: { own: { fr: 'autre' }, foreign: { fr: 'étranger' } } } },
    { file: shared, data: { entries: { common: { fr: 'commun' } } } },
  ];
  const before = roomMemory(fixture, target);
  if (before.get('own')?.fr !== 'cible' || before.has('foreign') || before.get('common')?.fr !== 'commun')
    throw new Error('room-scoped translation memory fixture failed');
  delete fixture[0].data.entries.own;
  if (roomMemory(fixture, target).has('own'))
    throw new Error('missing target-room translation was borrowed from another room');
}
const failures = [];
let entriesChecked = 0;
let machine = 0;
let rooms = 0;
let builtRooms = 0;
const fail = (page, message) => failures.push(`${page}: ${message}`);

for (const tradition of ['PC', 'Bap', 'Wes', 'Ref']) {
  for (let n = 1; n <= 5; n++) {
    const page = `CTSElec${tradition}${n}Readings`;
    const source = `src/body/rooms/${page}.html`;
    const store = `src/data/french-readings/room/${page}.json`;
    if (!fs.existsSync(source) || !fs.existsSync(store)) {
      fail(page, `missing ${!fs.existsSync(source) ? source : store}`);
      continue;
    }
    const html = fs.readFileSync(source, 'utf8');
    let data;
    try { data = JSON.parse(fs.readFileSync(store, 'utf8')); }
    catch (err) { fail(page, `invalid JSON: ${err.message}`); continue; }
    if (data.item !== `room:${page}` || data.source !== source)
      fail(page, 'store identity/source does not match the room');
    const entries = Object.entries(data.entries || {});
    if (entries.length < 100) fail(page, `unexpectedly small French store: ${entries.length} entries`);
    for (const [key, entry] of entries) {
      entriesChecked++;
      if (!entry.en?.trim() || !entry.fr?.trim())
        fail(page, `blank EN/FR passage at ${key}`);
      if (!entry.tr?.fr?.status)
        fail(page, `missing French translation provenance at ${key}`);
      if (entry.tr?.fr?.status === 'machine') machine++;
    }
    const cards = (html.match(/<article class="reading">/g) || []).length;
    const digests = (html.match(/<details class="digest-inline">/g) || []).length;
    if (cards !== 5 || digests !== 5)
      fail(page, `expected five reading cards and five digests; got ${cards}/${digests}`);
    // The same insertion engine used by the Astro build. It also recognizes
    // separately translated shared chrome, rather than requiring lang-fr in
    // the EN/ES intermediate source. Any uncovered EN passage is a failure.
    try {
      const result = augmentHtml(html, roomMemory(files, store));
      if (result.missing !== 0) fail(page, `${result.missing} English blocks lack French`);
      if (result.inserted < 5) fail(page, `only ${result.inserted} French blocks inserted`);
      const generated = parse(result.html, { comment: true, parseNoneClosedTags: true });
      const cards = generated.querySelectorAll('article.reading');
      if (cards.length !== 5) fail(page, `generated French source has ${cards.length} reading cards`);
      for (const [i, card] of cards.entries()) {
        const detail = card.querySelector('details.digest-inline');
        const en = detail?.querySelectorAll('.dg-block.lang-en') || [];
        const fr = detail?.querySelectorAll('.dg-block.lang-fr') || [];
        if (en.length !== 1 || fr.length !== 1) {
          fail(page, `reading ${i + 1} has ${en.length} English and ${fr.length} French full digests`);
          continue;
        }
        const text = fr[0].text.trim();
        if (text.length < 1000 || fr[0].querySelectorAll('h2').length < 5 || fr[0].querySelectorAll('p').length < 5)
          fail(page, `reading ${i + 1} French digest is not substantive (${text.length} characters)`);
      }
    } catch (err) { fail(page, `French build check threw: ${err.message}`); }

    // The full build creates the actual /fr/ route from this generated markup.
    // Check that output as well when the test is run after `npm run build`.
    const builtFile = path.join(ROOT, 'dist', 'fr', `${page}.html`);
    if (fs.existsSync(builtFile)) {
      const built = parse(fs.readFileSync(builtFile, 'utf8'), { comment: true, parseNoneClosedTags: true });
      const activeFrench = built.querySelector('[data-cts-lang="fr"][aria-current="page"]');
      const languageChoices = built.querySelector('[role="group"][aria-label="Langue"]');
      const sourceToggle = built.querySelector('#cts-show-source');
      if (built.querySelector('html')?.getAttribute('lang') !== 'fr' || !activeFrench || !languageChoices)
        fail(page, 'generated French route does not expose accessible French language choices');
      if (!sourceToggle || sourceToggle.hasAttribute('disabled') ||
        !sourceToggle.closest('label')?.text.includes('Afficher'))
        fail(page, 'generated French route does not offer an accessible English-source toggle');
      const builtCards = built.querySelectorAll('article.reading');
      if (builtCards.length !== 5) fail(page, `generated French route has ${builtCards.length} reading cards`);
      for (const [i, card] of builtCards.entries()) {
        const frenchTitle = card.querySelector('h3 .cts-reading[lang="fr"]');
        const detail = card.querySelector('details.digest-inline');
        const frenchDigest = detail?.querySelectorAll('.dg-block .cts-reading[lang="fr"]') || [];
        const text = frenchDigest.map((block) => block.text.trim()).join(' ');
        if (!frenchTitle?.text.trim()) fail(page, `reading ${i + 1} has no French card title`);
        if (text.length < 1000 || !detail?.querySelector('.dg-block h2 .cts-reading[lang="fr"]'))
          fail(page, `reading ${i + 1} generated French digest is not substantive (${text.length} characters)`);
      }
      if (!built.querySelector('#cts-att-name') || !built.querySelector('#cts-att-oath') ||
        !built.querySelector('label[for="cts-att-name"] .cts-reading[lang="fr"]') ||
        !built.querySelector('.cts-oath label .cts-reading[lang="fr"]'))
        fail(page, 'generated French route is missing its translated honors controls');
      if (!built.querySelector(`a[href*="/fr/${page}Test.html"]`))
        fail(page, 'generated French route is missing its French reading-test link');
      builtRooms++;
    }
    rooms++;
  }
}

if (rooms !== 20) fail('all electives', `only ${rooms} of 20 rooms inspected`);
if (fs.existsSync(path.join(ROOT, 'dist', 'fr')) && builtRooms !== 20)
  fail('generated French routes', `only ${builtRooms} of 20 built French routes inspected`);
if (failures.length) {
  console.error(`Elective French room parity: ${failures.length} failure(s):\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  const built = builtRooms === 20 ? ', 20 generated French routes checked' : '';
  console.log(`Elective French room parity: ${rooms}/20 rooms${built}, ${entriesChecked} nonblank bilingual entries, ${machine} machine-status entries; five substantive French digests per room. Human/rights review NOT certified.`);
}
