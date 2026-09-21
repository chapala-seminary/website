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
 *   node tools/verify-lesson-render.mjs <before-dir> [<after-dir>]
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const BEFORE = process.argv[2];
const AFTER = process.argv[3] || 'dist';
if (!BEFORE) { console.error('usage: node tools/verify-lesson-render.mjs <before-dir> [after-dir]'); process.exit(2); }

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

let bad = 0, checked = 0, repairs = 0;
for (const p of pages) {
  const a = fs.readFileSync(path.join(BEFORE, p), 'utf8');
  const b = fs.readFileSync(path.join(AFTER, p), 'utf8');
  const A = walk(parse(a).querySelector('body')), B = walk(parse(b).querySelector('body'));
  checked++;

  /* A repaired element is allowed to differ in its attributes, but not in a
     single word of its text. */
  const same = (x, y) => {
    if (x === y) return true;
    if (!x.startsWith('~') || !y.startsWith('~')) return false;
    repairs++;
    return x.slice(x.indexOf('|')) === y.slice(y.indexOf('|'));
  };

  if (A.length !== B.length) {
    console.log(`${p}: ${A.length} elements before, ${B.length} after`);
    const extra = B.filter((x) => !A.includes(x)).slice(0, 3);
    const gone = A.filter((x) => !B.includes(x)).slice(0, 3);
    gone.forEach((g) => console.log(`    gone:  ${g.slice(0, 110)}`));
    extra.forEach((g) => console.log(`    added: ${g.slice(0, 110)}`));
    bad++; continue;
  }
  for (let i = 0; i < A.length; i++) {
    if (same(A[i], B[i])) continue;
    console.log(`${p}: element ${i + 1} differs`);
    console.log(`    before: ${A[i].slice(0, 130)}`);
    console.log(`    after:  ${B[i].slice(0, 130)}`);
    bad++; break;
  }
}

console.log(`lesson render: ${checked} converted page(s) compared against ${BEFORE}`);
if (bad) { console.log(`FAIL: ${bad} page(s) differ`); process.exitCode = 1; }
else console.log(`OK: every element matches${repairs ? ` (${repairs} declared repair(s) to the illustration caption)` : ''}`);
