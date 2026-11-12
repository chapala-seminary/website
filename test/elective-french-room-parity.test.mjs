// Regression for the 20 denominational elective French reading rooms.
// Checks the generated translation STORE against the actual EN/ES room source,
// not the intermediate src/body HTML's count of lang-fr elements.
// Does NOT certify academic accuracy, source rights, or human review.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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
    } catch (err) { fail(page, `French build check threw: ${err.message}`); }
    rooms++;
  }
}

if (rooms !== 20) fail('all electives', `only ${rooms} of 20 rooms inspected`);
if (failures.length) {
  console.error(`Elective French room parity: ${failures.length} failure(s):\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Elective French room parity: ${rooms}/20 rooms, ${entriesChecked} nonblank bilingual entries, ${machine} machine-status entries; no missing French blocks. Human/rights review NOT certified.`);
}
