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
const { memory } = loadStore();
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
      const result = augmentHtml(html, memory);
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
