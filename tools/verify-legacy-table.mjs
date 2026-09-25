// cts-engine.js and cts-sync.js each carry the table of the keys the old
// per-course engines wrote (LEGACY). They run on different pages -- the engine
// on unit pages, the sync client everywhere -- and cannot share a file without
// touching every page's script tags, so the table is written twice. This
// fails the moment the two copies differ.
import fs from 'node:fs';
const grab = (f) => {
  const s = fs.readFileSync(f, 'utf8');
  const m = /var LEGACY = \{([\s\S]*?)\n  \};/.exec(s);
  if (!m) { console.error(`${f}: no LEGACY table`); process.exit(1); }
  return m[1].replace(/\/\/.*$/gm, '').replace(/\s+/g, ' ').replace(/'/g, '"').trim();
};
const a = grab('public/assets/js/cts-engine.js'), b = grab('public/assets/js/cts-sync.js');
if (a !== b) { console.error('FAIL — the LEGACY tables in cts-engine.js and cts-sync.js differ'); process.exit(1); }
console.log('PASS — cts-engine.js and cts-sync.js agree on the legacy storage keys.');
