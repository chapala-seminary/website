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

const [origFile = REF, builtFile = 'dist/index.html'] = process.argv.slice(2);

const o = norm(catalog(origFile));
const b = norm(catalog(builtFile));

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
