/* Does every concept still have one class name?
 *
 * cts.css was written to accept whatever the 451 courses already called
 * things, so its selectors were alias lists: `.card,.box,.sec,.lesson-section,
 * .teaching,.teaching-block` is one surface under six names. That has the cost
 * the id aliases had -- a new page picks any of the six, or a seventh that is
 * styled by nothing, and looks almost right.
 *
 * src/lib/shell.ts renames them at build time. This checks both ends: no built
 * page carries an alias, and the stylesheet no longer names one. Either alone
 * would pass while the other rotted.
 *
 *   node tools/verify-one-class.mjs [dist]
 */
import fs from 'node:fs';

const DIST = process.argv[2] || 'dist';
const CSS = 'public/assets/css/cts.css';

/* canonical -> the names it replaced. Kept in step with CLASS_ALIASES in
   src/lib/shell.ts; a name added there and not here simply is not checked. */
const ALIASES = {
  card: ['box', 'sec', 'lesson-section', 'teaching', 'teaching-block'],
  btn: ['nav-btn', 'toggle-btn', 'submit-exam', 'clear-btn', 'reset-btn', 'btn-reset'],
  actions: ['action-buttons', 'exam-controls', 'controls-bar'],
  scripture: ['pull-quote', 'epigraph', 'verse', 'passage'],
  note: ['translation-note', 'nl', 'sa-note'],
  illustration: ['cts-figure'],
  exam: ['exam-section', 'mc-section', 'sa-section'],
  'exam-status': ['status', 'lockout-timer'],
};
const ALL = Object.values(ALIASES).flat();

const fails = [];

/* 1. The built pages. */
const pages = fs.readdirSync(DIST).filter((f) => /^CTS.*Unit\d+\.html$/.test(f)).sort();
if (!pages.length) fails.push(`no unit pages in ${DIST}/ — nothing was checked`);
const offenders = new Map();
for (const f of pages) {
  const html = fs.readFileSync(`${DIST}/${f}`, 'utf8');
  const classes = new Set();
  for (const m of html.matchAll(/class="([^"]+)"/g))
    for (const c of m[1].split(/\s+/)) classes.add(c);
  for (const a of ALL)
    if (classes.has(a)) offenders.set(a, (offenders.get(a) || 0) + 1);
}
for (const [a, n] of offenders)
  fails.push(`.${a} survives on ${n} built page(s) — shell.ts should have renamed it`);

/* 2. The stylesheet. An alias named here is a rule waiting to disagree with
      the markup: it either matches nothing, or it re-admits the old name. */
const css = fs.readFileSync(CSS, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
for (const a of ALL) {
  // .passage-label is a real, separate class; .passage is not.
  const re = new RegExp(`\\.${a.replace(/[-]/g, '\\-')}(?![\\w-])`);
  if (re.test(css)) fails.push(`${CSS} still styles .${a} — the alias list is growing back`);
}

console.log(`${pages.length} built pages and ${CSS}: ${ALL.length} retired class names checked`);
if (!fails.length) {
  console.log('PASS — every concept has one class name, in the markup and the stylesheet.');
} else {
  console.log(`FAIL — ${fails.length}:`);
  fails.forEach((f) => console.log('  ' + f));
  process.exit(1);
}
