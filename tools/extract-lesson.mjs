/* One course's hand-written HTML -> lesson data a person can edit.
 *
 * The model, and why it is shaped the way it is, is documented in
 * src/lib/lesson.ts. This is the one-way trip that gets a course into it, plus
 * the proof that the trip lost nothing: the data is rendered back to markup
 * and compared with the file it came from, element by element. A course is
 * only converted if that comparison is clean.
 *
 *   node tools/extract-lesson.mjs CTSHermeneutics --check   # compare only
 *   node tools/extract-lesson.mjs CTSHermeneutics           # and write
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { hash, renderLesson } from '../src/lib/lesson.ts';

const COURSE = process.argv[2];
const CHECK = process.argv.includes('--check');
if (!COURSE) { console.error('usage: node tools/extract-lesson.mjs <CoursePrefix> [--check]'); process.exit(2); }

const LANGS = ['en', 'es'];              // the first is the source language
const SOURCE = LANGS[0];
const OUT_DIR = path.join('src', 'content', 'lessons', COURSE);

/* Engine furniture: rendered by the page, not written by a teacher. Named by
   id rather than by position, because position is exactly what varied in the
   hand-written files. */
const CHROME_IDS = new Set(['track-card', 'lockout-block',
                            'exam-section', 'results-block']);

/* Markup the build already throws away. Unit 1 carried its own registration
   card; the layout has rendered that once for every page since the cutover, so
   shell.ts strips it and it has not reached a student in weeks. Carrying it
   into the lesson data would import a copy of something the site no longer
   has -- and it is the only reason the furniture is not identical across all
   eleven units. */
const DISCARD_IDS = new Set(['registration-card']);

/* Likewise the catalogue link every body opens with: the navigation has
   provided it since the cutover, and shell.ts removes this one. */
const DISCARD = (el) => el.tagName.toLowerCase() === 'a'
  && /index\.html/.test(el.getAttribute('href') || '');

/* A block's type comes from what it is, not what tag it landed in. */
function typeOf(el) {
  const tag = el.tagName.toLowerCase();
  const cls = el.getAttribute('class') || '';
  if (tag === 'figure') return 'figure';
  if (cls.includes('unit-title')) return 'title';
  if (cls.includes('unit-sub')) return 'subtitle';
  if (cls.includes('scripture')) return 'scripture';
  if (/^h[1-6]$/.test(tag)) return 'heading';
  if (tag === 'p' || tag === 'div') return 'prose';
  return null;
}

const langSpan = (el, lang) =>
  el.querySelector(`.lang-${lang}`) || el.querySelector(`.${lang}-only`);

const unstyled = [];      // elements repaired on the way in; reported below

function textOf(el, where) {
  const text = {};
  for (const l of LANGS) {
    const s = langSpan(el, l);
    if (s) text[l] = s.innerHTML.trim();
  }
  if (Object.keys(text).length) return text;

  /* Hermeneutics' one illustration captions itself with two <span>s that carry
     inline styles instead of .lang-en / .lang-es, so both languages show at
     once and the toggle does not reach them. Taking them in language order
     puts the caption under the same rule as every other block on the site --
     a repair, not a guess: it applies only where the element holds exactly one
     span per language and none of them is tagged with a language. */
  const spans = el.childNodes.filter((n) => n.tagName && n.tagName.toLowerCase() === 'span');
  if (spans.length === LANGS.length && !spans.some((s) => /lang-|-only/.test(s.getAttribute('class') || ''))) {
    LANGS.forEach((l, i) => { text[l] = spans[i].innerHTML.trim(); });
    if (where) unstyled.push(where);
    return text;
  }
  return null;
}

/* Everything on the site today was written by a person, in step with the
   English beside it, so it starts as `human` at the current source hash. */
function trOf(text) {
  const from = hash(text[SOURCE]);
  const tr = {};
  for (const l of LANGS) if (l !== SOURCE && text[l] != null) tr[l] = { status: 'human', from };
  return Object.keys(tr).length ? tr : undefined;
}

const files = fs.readdirSync('src/body')
  .filter((f) => new RegExp(`^${COURSE}Unit\\d+\\.html$`).test(f))
  .sort((a, b) => +a.match(/\d+/)[0] - +b.match(/\d+/)[0]);
if (!files.length) { console.error(`no unit bodies for ${COURSE}`); process.exit(1); }

const norm = (s) => s.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();

const lessons = [];
const chromeSeen = new Map();
let problems = [];

for (const f of files) {
  const src = fs.readFileSync(path.join('src/body', f), 'utf8');
  const root = parse(src);
  const unit = +f.match(/\d+/)[0];

  const container = root.querySelector('div.container');
  if (!container) { problems.push(`${f}: no div.container`); continue; }

  const blocks = [];
  const before = [], after = [];
  let seenLesson = false;
  let n = 0;

  /* The masthead title is content -- it is the course's name in two languages
     -- even though it sits in the page furniture. */
  const headerH1 = root.querySelector('header h1');
  if (headerH1) {
    const text = textOf(headerH1);
    if (text) blocks.push({ id: 'masthead', type: 'masthead', text, tr: trOf(text) });
  }

  for (const el of container.childNodes.filter((n) => n.tagName)) {
    const id = el.getAttribute('id') || '';
    if (DISCARD_IDS.has(id)) continue;
    if (CHROME_IDS.has(id)) { (seenLesson ? after : before).push(el.outerHTML); continue; }

    const type = typeOf(el);
    if (type === 'figure') {
      const cap = el.querySelector('figcaption');
      const capText = cap ? textOf(cap, `${f}: the illustration caption now follows the language toggle`) : null;
      if (cap) cap.remove();
      blocks.push({
        id: 'fig' + (++n), type: 'figure',
        /* The illustration is kept verbatim, attributes and all. It is a
           hand-drawn SVG, not prose; a teacher edits its caption, and a
           designer edits the drawing. */
        attrs: Object.entries(el.attributes).map(([k, v]) => `${k}="${v}"`).join(' '),
        svg: el.innerHTML.trim(),
        ...(capText ? { caption: { text: capText, tr: trOf(capText) } } : {}),
      });
      seenLesson = true;
      continue;
    }

    if (el.tagName.toLowerCase() === 'article') {
      for (const child of el.childNodes.filter((n) => n.tagName)) {
        const t = typeOf(child);
        const text = textOf(child);
        if (!t || !text) { problems.push(`${f}: unhandled <${child.tagName.toLowerCase()}> in the lesson`); continue; }
        const anchor = child.getAttribute('id');
        blocks.push({ id: 'b' + String(++n).padStart(2, '0'), type: t,
                      ...(anchor ? { anchor } : {}), text, tr: trOf(text) });
      }
      seenLesson = true;
      continue;
    }

    const text = textOf(el);
    if (type && text) {
      blocks.push({ id: type === 'title' || type === 'subtitle' ? type : 'b' + String(++n).padStart(2, '0'),
                    type, text, tr: trOf(text) });
      continue;
    }
    problems.push(`${f}: unhandled <${el.tagName.toLowerCase()}${id ? '#' + id : ''}>`);
  }

  /* Everything after the container: the course footer and the honours-readings
     notice. Content, but course-level content -- the same words on all eleven
     pages -- so it belongs beside the furniture rather than in each lesson. */
  const tail = root.childNodes
    .filter((n) => n.tagName && n !== container && !DISCARD(n)
                && n.tagName.toLowerCase() !== 'header')
    .map((n) => n.outerHTML);

  const shared = { before: before.join('\n'), after: after.join('\n'), tail: tail.join('\n') };
  chromeSeen.set(norm(shared.before + '|' + shared.after + '|' + shared.tail), shared);

  lessons.push({ file: f, lesson: { course: COURSE, unit, sourceLang: SOURCE, langs: LANGS, blocks }, shared, src });
}

if (chromeSeen.size !== 1)
  problems.push(`the shared page parts are not identical across units (${chromeSeen.size} variants) — they cannot be stored once`);

/* THE PROOF. Render the data back and compare it with the file it came from.
   Compared as parsed elements rather than as strings, so indentation is not
   mistaken for loss, and per element, so a count that matches while two
   paragraphs swapped places is still a failure. */
/* Two attributes are normalised away before comparing: a span's language class
   and a span's inline style. Those are exactly what the repair above rewrites,
   and nothing else -- the words, the <em>s and <strong>s, and every other
   class and attribute are compared as they stand, so a lost sentence or a
   dropped emphasis still fails. */
const wash = (html) => html.replace(/<span\b([^>]*)>/g, (m, attrs) => {
  const kept = attrs.replace(/\s*class="(?:lang-\w+|\w+-only)"/g, '').replace(/\s*style="[^"]*"/g, '');
  return `<span${kept}>`;
}).replace(/<\/span><br\s*\/?><span>/g, '</span><span>');
  /* ...and the <br> that stacked two always-visible language lines, which has
     nothing to separate once only one of them is shown at a time. */

const leaves = (html) => parse(html).querySelectorAll('h1,h2,h3,p,div.scripture,figcaption')
  .filter((el) => !el.querySelector('h1,h2,h3,p,div.scripture,figcaption'))
  .map((el) => el.tagName.toLowerCase() + '|' + (el.getAttribute('class') || '') + '|' + wash(norm(el.innerHTML)));

for (const { file, lesson, shared, src } of lessons) {
  const back = renderLesson(lesson, shared);
  /* The markup the build already discards is taken off the other side of the
     comparison too, or dropping it would read as loss. */
  const kept = parse(src);
  for (const id of DISCARD_IDS) kept.querySelectorAll(`#${id}`).forEach((el) => el.remove());
  kept.querySelectorAll('a').forEach((el) => { if (DISCARD(el)) el.remove(); });
  const a = leaves(kept.toString()), b = leaves(back);
  if (a.length !== b.length) { problems.push(`${file}: ${a.length} elements in, ${b.length} out`); continue; }
  for (let i = 0; i < a.length; i++)
    if (a[i] !== b[i]) { problems.push(`${file}: element ${i + 1} differs\n    was: ${a[i].slice(0, 120)}\n    now: ${b[i].slice(0, 120)}`); break; }
}

const nb = lessons.reduce((t, l) => t + l.lesson.blocks.length, 0);
console.log(`${COURSE}: ${lessons.length} units, ${nb} blocks, languages [${LANGS.join(', ')}]`);
if (problems.length) {
  console.log(`FAIL — ${problems.length} problem(s):`);
  problems.slice(0, 12).forEach((p) => console.log('  ' + p));
  if (problems.length > 12) console.log(`  … and ${problems.length - 12} more`);
  process.exit(1);
}
console.log('round trip: every element renders back to the markup it came from');
unstyled.forEach((u) => console.log('  fixed — ' + u));

if (CHECK) process.exit(0);

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const { lesson } of lessons)
  fs.writeFileSync(path.join(OUT_DIR, `${lesson.unit}.json`), JSON.stringify(lesson, null, 1) + '\n');
fs.writeFileSync(path.join(OUT_DIR, '_shared.json'),
  JSON.stringify([...chromeSeen.values()][0], null, 1) + '\n');
console.log(`wrote ${lessons.length} lessons + the shared page parts to ${OUT_DIR}/`);
