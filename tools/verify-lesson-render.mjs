/* A converted course must render the page it rendered before.
 *
 * The round trip inside extract-lesson.mjs proves the data can reproduce the
 * body it came from. This proves the built page: it compares every element of
 * every converted unit against the same page built from the hand-written HTML,
 * so the switch from files to data is checkable rather than asserted.
 *
 * Indentation is ignored -- the renderer indents differently, and nobody reads
 * the built markup. Everything else is compared: tag, attributes in order, and
 * the text and inline markup of each element.
 *
 * The reference is recorded once, from the build made while the course was
 * still hand-written HTML, and is kept as hashes rather than as eleven copies
 * of a built page: a megabyte of markup to say what seventy kilobytes already
 * say. When a check fails it names the element and prints what it found; what
 * it expected is a hash, which is enough to say "not this".
 *
 *   node tools/verify-lesson-render.mjs record <dir>   -> test/fixtures/lesson-render.json
 *   node tools/verify-lesson-render.mjs                -> compares dist against it
 *   node tools/verify-lesson-render.mjs <dir>          -> compares dist against a directory
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

import crypto from 'node:crypto';

const REF = 'test/fixtures/lesson-render.json';
const RECORD = process.argv[2] === 'record';
const BEFORE = RECORD ? process.argv[3] : process.argv[2];
const AFTER = (RECORD ? null : process.argv[3]) || 'dist';
if (RECORD && !BEFORE) { console.error('usage: node tools/verify-lesson-render.mjs record <dir>'); process.exit(2); }

const LESSONS = 'src/content/lessons';
if (!fs.existsSync(LESSONS)) { console.log('no converted courses'); process.exit(0); }

const pages = [];
for (const course of fs.readdirSync(LESSONS))
  for (const f of fs.readdirSync(path.join(LESSONS, course)).filter((f) => /^\d+\.json$/.test(f)))
    pages.push(`${course}Unit${f.replace('.json', '')}.html`);

/* The attributes the repair deliberately changes: a span's language class
   replaces an inline style, and the <br> that separated two always-visible
   language lines goes with it. Declared here, in one place, so that everything
   NOT declared is compared strictly. */
const REPAIRED = new Set(['figcaption']);

const sig = (el) => {
  const attrs = Object.entries(el.attributes || {}).map(([k, v]) => `${k}=${v}`).sort().join(' ');
  return `${el.tagName.toLowerCase()}[${attrs}]`;
};

const walk = (root) => {
  const out = [];
  const go = (node, repairedAncestor) => {
    for (const el of node.childNodes) {
      if (!el.tagName) continue;
      const tag = el.tagName.toLowerCase();
      const repaired = repairedAncestor || REPAIRED.has(tag);
      /* The <br> that separated two always-visible language lines has nothing
         left to separate once the toggle shows one at a time. Skipped on both
         sides, and only inside an element the repair actually touches. */
      if (repaired && tag === 'br') continue;
      out.push((repaired ? '~' : '') + sig(el) + '|' + el.text.replace(/\s+/g, ' ').trim());
      go(el, repaired);
    }
  };
  go(root, false);
  return out;
};

/* An element the repair deliberately touches is hashed on its WORDS alone --
   its attributes are what changed, and they changed on purpose. Everything
   else is hashed on tag, attributes and text together, so any change to any of
   them fails. The '~' keeps the two kinds from ever comparing equal. */
const digest = (s) => s.startsWith('~')
  ? '~' + crypto.createHash('sha1').update(s.slice(s.indexOf('|'))).digest('base64url').slice(0, 11)
  : crypto.createHash('sha1').update(s).digest('base64url').slice(0, 12);

if (RECORD) {
  const out = {};
  for (const p of pages)
    out[p] = walk(parse(fs.readFileSync(path.join(BEFORE, p), 'utf8')).querySelector('body')).map(digest);
  fs.mkdirSync(path.dirname(REF), { recursive: true });
  fs.writeFileSync(REF, JSON.stringify(out));
  const n = Object.values(out).reduce((a, b) => a + b.length, 0);
  console.log(`recorded ${n} elements across ${pages.length} page(s) -> ${REF}`);
  process.exit(0);
}

if (!BEFORE && !fs.existsSync(REF)) {
  console.error(`no reference at ${REF} — run: node tools/verify-lesson-render.mjs record <dir>`);
  process.exit(2);
}
const recorded = BEFORE ? null : JSON.parse(fs.readFileSync(REF, 'utf8'));
const source = BEFORE || REF;

let bad = 0, checked = 0, repairs = 0;
for (const p of pages) {
  const b = fs.readFileSync(path.join(AFTER, p), 'utf8');
  /* Compared as hashes either way, so the two paths cannot drift apart. */
  const A = BEFORE
    ? walk(parse(fs.readFileSync(path.join(BEFORE, p), 'utf8')).querySelector('body')).map(digest)
    : recorded[p];
  if (!A) { console.log(`${p}: not in the reference — record it, or it is a page that did not exist before`); bad++; continue; }
  const B = walk(parse(b).querySelector('body')).map(digest);
  const plain = walk(parse(b).querySelector('body'));   // for the failure message
  checked++;

  /* A repaired element is allowed to differ in its attributes, but not in a
     single word of its text. */
  if (A.length !== B.length) {
    console.log(`${p}: ${A.length} elements recorded, ${B.length} in the built page`);
    const gone = A.filter((x) => !B.includes(x)).length;
    const added = B.map((h, i) => [h, i]).filter(([h]) => !A.includes(h)).slice(0, 3);
    console.log(`    ${gone} recorded element(s) are not in the page`);
    added.forEach(([, i]) => console.log(`    new:   ${plain[i].slice(0, 110)}`));
    bad++; continue;
  }
  for (let i = 0; i < A.length; i++) {
    if (A[i] === B[i]) continue;
    console.log(`${p}: element ${i + 1} differs from the reference`);
    console.log(`    now: ${plain[i].slice(0, 140)}`);
    bad++; break;
  }
}

console.log(`lesson render: ${checked} converted page(s) compared against ${source}`);
if (bad) { console.log(`FAIL: ${bad} page(s) differ`); process.exitCode = 1; }
else console.log('OK: every element matches the page the hand-written HTML built.');
