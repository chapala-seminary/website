/* Lift the honours-readings box out of 434 templates into one definition.
 *
 * WHY
 *
 * The box sat in 434 of the 451 lesson templates -- 406 KB -- and every copy
 * reached the built page, so it was not dead markup, it was duplicated
 * markup. Rewording it meant editing 434 files, or re-running extraction from
 * source HTML that no longer matches the site. There was no single place to
 * change it.
 *
 * WHAT IT CHECKS BEFORE IT TOUCHES ANYTHING
 *
 * One definition is only safe if the 434 copies really are one thing. So the
 * tool derives the canonical markup from the first box it finds, substitutes
 * each course's own readings link, and requires EVERY box to equal that,
 * character for character. One mismatch and it writes nothing and says which
 * course and unit disagreed -- because a partial that is nearly right is a
 * silent content regression on whichever page it is wrong for.
 *
 *   node tools/lift-honours-partial.mjs            do it
 *   node tools/lift-honours-partial.mjs --check    verify only, change nothing
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const CHECK = process.argv.includes('--check');
const ROOT = 'src/content/lessons';
const SEL = '[data-cts-rrbox]';
const OUT = 'src/lib/partials.ts';

/* ---- gather every box ---------------------------------------------- */
const found = [];   // { course, unit, file, template, html, href }
for (const course of fs.readdirSync(ROOT).sort()) {
  for (const file of fs.readdirSync(path.join(ROOT, course)).filter((f) => f.endsWith('.json'))) {
    const p = path.join(ROOT, course, file);
    const lesson = JSON.parse(fs.readFileSync(p, 'utf8'));
    const boxes = parse(lesson.template, { comment: true }).querySelectorAll(SEL);
    for (const el of boxes) {
      const a = el.querySelector('a');
      if (!a) { console.error(`${course} unit ${lesson.unit}: an honours box with no link`); process.exit(1); }
      found.push({ course, unit: lesson.unit, path: p, html: el.outerHTML, href: a.getAttribute('href') });
    }
  }
}
if (!found.length) { console.log('no honours boxes left in the templates'); process.exit(0); }

/* ---- one link per course ------------------------------------------- */
const links = new Map();
for (const b of found) {
  if (links.has(b.course) && links.get(b.course) !== b.href) {
    console.error(`${b.course}: two different readings links (${links.get(b.course)} and ${b.href}). `
      + 'The partial takes one link per course, so this has to be settled by hand first.');
    process.exit(1);
  }
  links.set(b.course, b.href);
}

/* ---- the canonical markup, derived not transcribed ------------------ */
const first = found[0];
const HREF = '\u0000HREF\u0000';
const canonical = first.html.split(`href="${first.href}"`).join(`href="${HREF}"`);
if (!canonical.includes(HREF)) { console.error('could not find the link in the first box'); process.exit(1); }

const mismatches = [];
for (const b of found) {
  const expected = canonical.split(HREF).join(b.href);
  if (b.html !== expected) mismatches.push(b);
}
if (mismatches.length) {
  console.error(`${mismatches.length} of ${found.length} boxes are not the same as the rest. Nothing was changed.\n`);
  for (const m of mismatches.slice(0, 5)) {
    const exp = canonical.split(HREF).join(m.href);
    let i = 0; while (i < exp.length && exp[i] === m.html[i]) i++;
    console.error(`  ${m.course} unit ${m.unit}, from character ${i}:`);
    console.error(`    expected: ...${exp.slice(Math.max(0, i - 30), i + 60)}`);
    console.error(`    found:    ...${m.html.slice(Math.max(0, i - 30), i + 60)}`);
  }
  process.exit(1);
}

const bytes = found.reduce((n, b) => n + b.html.length, 0);
console.log(`${found.length} honours boxes across ${links.size} courses, ${(bytes / 1024).toFixed(0)} KB, `
  + 'all identical but for the readings link');

if (CHECK) { console.log('--check: nothing written'); process.exit(0); }

/* ---- write the one definition --------------------------------------- */
/* Split at element boundaries so the file is readable. The pieces are joined
   with no separator, so the rendered markup is the same string it was. */
const chunks = canonical.split(/(?<=>)(?=<)/);
const lit = (s) => '`' + s.split(HREF).join('${href}').replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$(?!\{href\})/g, '\\$') + '`';
const markup = chunks.map(lit).join('\n  + ');

const table = [...links.entries()]
  .map(([c, h]) => `  ${/^[A-Za-z_$][\w$]*$/.test(c) ? c : JSON.stringify(c)}: ${JSON.stringify(h)},`)
  .join('\n');

fs.writeFileSync(OUT, `/* Markup that is the same on every lesson page.
 *
 * A partial is named in a template as <!--cts-part:NAME--> and resolved here
 * when the page is rendered. THIS FILE IS THE SINGLE PLACE THE MARKUP LIVES:
 * edit it here and all ${found.length} pages change together. It was created by
 * tools/lift-honours-partial.mjs, which is kept only so the lift can be
 * re-checked; from here on the file is edited by hand.
 *
 * Why a partial and not an Astro component: the lesson body is handed to the
 * layout as one HTML string and injected with set:html, so a component cannot
 * be placed inside it without cutting the string up. The template already had
 * a mechanism for "something goes here" -- the holes that lesson text fills --
 * and this is the same mechanism with a different kind of filling.
 *
 * WHEN YOU ADD A PARTIAL
 *
 * Add a function to PARTIALS below, put <!--cts-part:your-name--> in the
 * templates that want it, and run \`node tools/verify-partials.mjs\`. An
 * unknown name stops the build rather than rendering a page with a gap.
 */

export interface PartialContext {
  course: string;
  unit: number;
  langs: string[];
}

/* Each course's reading room. Nearly all are <course>Readings.html, but CTS
   points at CTSOTSReadings.html, so the mapping is written out rather than
   computed -- a rule with one exception is a rule waiting to be got wrong. */
export const READING_ROOM: Record<string, string> = {
${table}
};

/* The honours-readings box. Bilingual in the markup itself: the box is not
   language-switched, and it was not before this file existed either. */
export const honoursBox = ({ course }: PartialContext): string => {
  const href = READING_ROOM[course];
  if (!href) throw new Error(\`no reading room is recorded for \${course}, so the honours box cannot be rendered\`);
  return ${markup};
};

export const PARTIALS: Record<string, (ctx: PartialContext) => string> = {
  honours: honoursBox,
};
`);
console.log(`wrote ${OUT}`);

/* ---- replace every box with its hole -------------------------------- */
let files = 0, replaced = 0;
const byFile = new Map();
for (const b of found) (byFile.get(b.path) || byFile.set(b.path, []).get(b.path)).push(b);
for (const [p, boxes] of byFile) {
  const lesson = JSON.parse(fs.readFileSync(p, 'utf8'));
  let t = lesson.template;
  for (const b of boxes) {
    if (!t.includes(b.html)) { console.error(`${p}: the box is not a literal substring of its template`); process.exit(1); }
    t = t.replace(b.html, '<!--cts-part:honours-->');
    replaced++;
  }
  lesson.template = t;
  fs.writeFileSync(p, JSON.stringify(lesson, null, 1) + '\n');
  files++;
}
console.log(`replaced ${replaced} copies in ${files} lesson files with <!--cts-part:honours-->`);
