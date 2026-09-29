// cts-engine.js, cts-sync.js and cts-record.js each carry the table of the
// keys the old per-course engines wrote (LEGACY). They run on different pages
// -- the engine on unit pages, the sync client everywhere, the recorder on
// unit pages and the front page -- and cannot share a file without touching
// every page's script tags, so the table is written three times. This fails
// the moment the copies differ.
import fs from 'node:fs';
const grab = (f) => {
  const s = fs.readFileSync(f, 'utf8');
  const m = /var LEGACY = \{([\s\S]*?)\n  \};/.exec(s);
  if (!m) { console.error(`${f}: no LEGACY table`); process.exit(1); }
  return m[1].replace(/\/\/.*$/gm, '').replace(/\s+/g, ' ').replace(/'/g, '"').trim();
};
const a = grab('public/assets/js/cts-engine.js');
for (const f of ['public/assets/js/cts-sync.js', 'public/assets/js/cts-record.js'])
  if (grab(f) !== a) { console.error(`FAIL — the LEGACY table in ${f} differs from cts-engine.js`); process.exit(1); }
console.log('PASS — cts-engine.js, cts-sync.js and cts-record.js agree on the legacy storage keys.');
