/* What stops working the day the live site is replaced by this build?
 *
 * The live site is served from a ZIP and has been since before this repo
 * existed. Commit 24dbaa8 is that ZIP, imported byte for byte, so it is the
 * authoritative list of every URL a student can currently reach -- better than
 * crawling, which only finds what is linked.
 *
 * A cutover that 404s a page someone has bookmarked, or that a search engine
 * has indexed, is the one way this migration can cost a student something. So
 * this compares the two inventories and says, by name, what disappears.
 *
 *   node tools/verify-cutover.mjs [<live-file-list>] [dist]
 *
 * With no list it takes one from the import commit itself, so a real clone
 * needs no arguments. A checkout that cannot reach that commit says so and
 * stops, rather than passing against nothing.
 *
 * Exit 1 if anything a reader could reach would stop resolving and is not on
 * the list of things we have decided to drop.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const LIST = args.find((a) => !fs.existsSync(path.join(a, 'index.html')));
const DIST = args.find((a) => fs.existsSync(path.join(a, 'index.html'))) || 'dist';

/* The live site is served from a ZIP, imported verbatim at this commit. */
const IMPORT = '24dbaa8';
let listing;
if (LIST) {
  listing = fs.readFileSync(LIST, 'utf8');
} else {
  try {
    listing = execFileSync('git', ['ls-tree', '-r', '--name-only', IMPORT], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .split('\n').filter((f) => f.startsWith('site/')).map((f) => f.slice(5)).join('\n');
  } catch {
    console.error(`this checkout cannot reach ${IMPORT}, the commit that holds the live site as it `
      + 'is served today, so there is nothing to compare the build against. Either run this in a\n'
      + 'full clone, or pass a file listing every path the live site serves:\n'
      + `  git ls-tree -r --name-only ${IMPORT} | sed 's|^site/||' > live-files.txt`);
    process.exit(2);
  }
  if (!listing.trim()) { console.error(`${IMPORT} has no site/ directory`); process.exit(2); }
}

/* Things whose disappearance is a decision, not an accident. Each one says
   why, because "we meant to" is only worth anything when it is written down
   before the fact. */
const DELIBERATE = [
  [/^assets\/css\/course-.*\.css$/,     'per-course stylesheets — one cts.css replaces 102'],
  [/^assets\/js\/engine-.*\.js$/,       'per-course engines — one cts-engine.js replaces 161'],
  [/^data\/.*\.js$/,                    'per-unit question files — now a content collection'],
  [/^cts-genesis-renderer\.js$/,         'Genesis rendered itself; it uses the one engine now'],
  [/^cts-genesis-unit\d+-data\.js$/,     'Genesis question data — now a content collection'],
];

const norm = (f) => f.replace(/^\.\//, '');
const live = [...new Set(listing.split('\n').map(norm).filter(Boolean))];

const built = new Set();
const walk = (dir, prefix = '') => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, prefix + e.name + '/');
    else built.add(prefix + e.name);
  }
};
walk(DIST);

const gone = live.filter((f) => !built.has(f));
const added = [...built].filter((f) => !live.includes(f));

/* A page is what a reader reaches. Everything else is an asset, and an asset
   that moved is only a problem if a page still points at it -- which the
   build's own markup answers, so it is checked rather than assumed. */
const isPage = (f) => f.endsWith('.html');

const explained = new Map();
const unexplained = [];
for (const f of gone) {
  const rule = DELIBERATE.find(([re]) => re.test(f));
  if (rule) { explained.set(rule[1], (explained.get(rule[1]) || 0) + 1); continue; }
  unexplained.push(f);
}

/* Does anything in the build still ask for a file that will not be there? */
const bodyOf = (f) => fs.readFileSync(path.join(DIST, f), 'utf8');
const stillReferenced = [];
const goneSet = new Set(gone);
for (const f of [...built].filter(isPage)) {
  const html = bodyOf(f);
  for (const m of html.matchAll(/(?:src|href)="(?!https?:|\/\/|#|mailto:|data:)([^"]+)"/g)) {
    const target = norm(m[1].split(/[?#]/)[0].replace(/^\//, ''));
    if (!target) continue;
    if (goneSet.has(target) || (!built.has(target) && live.includes(target)))
      stillReferenced.push(`${f} -> ${target}`);
  }
}

console.log(`live: ${live.length} files   built: ${built.size} files`);
console.log(`\n${gone.length} file(s) the live site serves that the build does not:`);
for (const [why, n] of [...explained].sort((a, b) => b[1] - a[1]))
  console.log(`  ${String(n).padStart(4)}  ${why}`);
if (unexplained.length) {
  const pages = unexplained.filter(isPage), assets = unexplained.filter((f) => !isPage(f));
  console.log(`  ${String(unexplained.length).padStart(4)}  NOT ACCOUNTED FOR (${pages.length} page(s), ${assets.length} asset(s))`);
  for (const f of pages.slice(0, 40)) console.log(`          ${f}`);
  if (pages.length > 40) console.log(`          … and ${pages.length - 40} more pages`);
  for (const f of assets.slice(0, 20)) console.log(`          ${f}`);
  if (assets.length > 20) console.log(`          … and ${assets.length - 20} more assets`);
}
console.log(`\n${added.length} file(s) the build adds that the live site does not have` +
  (added.length ? `, including ${added.filter(isPage).length} page(s)` : ''));

if (stillReferenced.length) {
  console.error(`\n${stillReferenced.length} reference(s) in the BUILT pages point at files that will not exist:`);
  for (const r of stillReferenced.slice(0, 20)) console.error('  ' + r);
}

const fail = unexplained.filter(isPage).length || stillReferenced.length;
if (fail) {
  console.error('\nFAIL — a reader could reach one of these today and could not after the cutover.');
  process.exit(1);
}
console.log('\nOK: every page the live site serves is in the build, and nothing built points at a file that is going away.');
