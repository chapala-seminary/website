/* The denominational electives held back from the site
 * (src/data/elective-held.json). One place for the generators, the importers
 * and the catalog check to ask. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const FILE = path.join(ROOT, 'src/data/elective-held.json');
const TAGS = { A: 'PC', B: 'Bap', C: 'Wes', D: 'Ref' };   // tools/import-electives.mjs TRADITIONS

/** { code: reason } */
export const HELD = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')).held || {} : {};
export const isHeld = (code) => Object.hasOwn(HELD, code);
/** The course prefix of a code (A-C1 -> CTSElecPC1), as tools/import-electives.mjs prefixOf. */
export const prefixOfCode = (code) => `CTSElec${TAGS[code[0]]}${code.slice(-1)}`;
export const heldPrefixes = () => new Set(Object.keys(HELD).map(prefixOfCode));
/** Stop a generator asked to build a held course. */
export function refuseHeld(code, what) {
  if (!isHeld(code)) return;
  console.error(`${code} is held (src/data/elective-held.json): ${HELD[code]}\nNot built while the hold stands: its ${what}.`);
  process.exit(2);
}
