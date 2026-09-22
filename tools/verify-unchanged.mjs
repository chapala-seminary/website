/* Did a refactor change any page?
 *
 * Point this at a directory of pages built BEFORE a change. It rebuilds
 * nothing; it compares what is in dist/ now against that reference, element
 * by element, in document order. A byte diff would fail on reindentation and
 * an element count would pass while two paragraphs swapped places, so it
 * walks both trees together and reports the first place they disagree.
 *
 *   node tools/verify-unchanged.mjs <reference-dir> [--attrs]
 *
 * Exit 1 on any difference. That is the whole point: a refactor of markup
 * that no one reads is only safe if it is provably invisible.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const ref = process.argv[2];
if (!ref) { console.error('usage: verify-unchanged.mjs <reference-dir>'); process.exit(2); }

/* Whitespace between tags is not content; whitespace inside a sentence is. */
const norm = (s) => s.replace(/\s+/g, ' ').trim();

/* An element's identity for this purpose: its tag, its attributes, and the
   text that belongs to it directly. Class and id are included -- a refactor
   that silently drops a hook the engine binds to would otherwise pass. */
const sig = (el) => {
  const a = Object.entries(el.attributes || {})
    .map(([k, v]) => `${k}=${norm(v)}`).sort().join(' ');
  const own = norm(el.childNodes.filter((n) => !n.tagName).map((n) => n.text).join(''));
  return `${el.tagName.toLowerCase()}[${a}]${own ? '|' + own : ''}`;
};

const walk = (root) => {
  const out = [];
  const rec = (el) => { for (const c of el.childNodes) if (c.tagName) { out.push(sig(c)); rec(c); } };
  rec(root);
  return out;
};

const files = fs.readdirSync(ref).filter((f) => f.endsWith('.html')).sort();
let checked = 0, elements = 0;
const fails = [];

for (const f of files) {
  const now = path.join('dist', f);
  if (!fs.existsSync(now)) { fails.push(`${f}: the page is gone`); continue; }
  const a = walk(parse(fs.readFileSync(path.join(ref, f), 'utf8'), { comment: true }));
  const b = walk(parse(fs.readFileSync(now, 'utf8'), { comment: true }));
  checked++; elements += a.length;
  if (a.length !== b.length) {
    /* Say WHERE, not just that the counts differ. */
    let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
    fails.push(`${f}: ${a.length} elements before, ${b.length} after; first difference at ${i}\n`
      + `      before: ${a[i] ?? '(end)'}\n      after:  ${b[i] ?? '(end)'}`);
    continue;
  }
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) {
    fails.push(`${f}: element ${i} differs\n      before: ${a[i]}\n      after:  ${b[i]}`);
    break;
  }
}

const extra = fs.readdirSync('dist').filter((f) => f.endsWith('.html') && !files.includes(f));
for (const f of extra) fails.push(`${f}: a page appeared that was not there before`);

console.log(`compared ${checked} pages, ${elements.toLocaleString()} elements, against ${ref}`);
if (fails.length) {
  console.error(`\n${fails.length} page(s) changed:\n`);
  for (const m of fails.slice(0, 12)) console.error('  ' + m);
  if (fails.length > 12) console.error(`  ... and ${fails.length - 12} more`);
  process.exit(1);
}
console.log('every page is element-for-element identical');
