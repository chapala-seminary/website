/* Give a block a language it never had.
 *
 * Eleven blocks across the site exist in one language only -- a paragraph
 * written in English that was never translated, a heading that exists only in
 * Spanish. Until now the page simply showed nothing there to the other
 * reader, and nothing said so.
 *
 * WHY THIS IS MORE THAN WRITING A STRING INTO A FILE
 *
 * A language renders because the template has a HOLE for it, where its text
 * sat. A language that was never on the page has no hole, so adding the text
 * alone would put it in the data and nowhere else -- and the build would
 * rightly refuse, because a block with Spanish and no Spanish hole is a
 * lesson whose Spanish can never reach a reader.
 *
 * So this also adds the element. It finds the hole the existing language uses,
 * clones the element around it, swaps that element's language marker for the
 * new language's, and puts the pair in straight after. Cloning rather than
 * inventing matters: the site marks language six ways and styles each of them
 * through its own selector, so a hand-written <span class="lang-es"> would be
 * wrong on the pages that use .es-only or #teach-es. The clone is right
 * wherever it lands because it is the page's own markup.
 *
 * Everything written here is marked `machine`, and stamped with the hash of
 * the source it was made from -- so it reads as what it is, shows up in
 * lesson-status.mjs as wanting review, and a later correction sets it to
 * machine-edited and is never overwritten.
 *
 *   node tools/fill-translation.mjs --check
 *   node tools/fill-translation.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { hash } from '../src/lib/lesson.ts';

const CHECK = process.argv.includes('--check');
const DATA = 'tools/data/translations.json';
const ROOT = path.join('src', 'content', 'lessons');

/* The six spellings, so a clone can have its marker swapped whichever one the
   page happens to use. Kept in step with tools/extract-lesson.mjs. */
const MARKERS = [
  ['lang-en', 'lang-es'], ['en-only', 'es-only'], ['block-en', 'block-es'],
  ['teach-en', 'teach-es'], ['en-lbl', 'es-lbl'], ['en', 'es'],
];
const otherName = (name, from, to) => {
  for (const pair of MARKERS) {
    const i = pair.indexOf(name);
    if (i < 0) continue;
    return pair[[from, to].indexOf(to) >= 0 && to !== 'en' ? 1 : 0];
  }
  return null;
};

/* Swap every language marker on an element from one language to the other,
   in whichever of the six spellings it uses. */
function retarget(el, from, to) {
  let changed = false;
  for (const c of [...(el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean)]) {
    for (const pair of MARKERS) {
      const i = pair.indexOf(c);
      if (i < 0) continue;
      const want = pair[to === 'en' ? 0 : 1];
      if (want !== c) { el.classList.remove(c); el.classList.add(want); changed = true; }
    }
  }
  const id = el.getAttribute('id');
  if (id && new RegExp(`-${from}$`).test(id)) { el.setAttribute('id', id.replace(new RegExp(`-${from}$`), `-${to}`)); changed = true; }
  return changed;
}

const jobs = JSON.parse(fs.readFileSync(DATA, 'utf8'));
let done = 0, failed = 0;

for (const job of jobs) {
  const file = path.join(ROOT, job.course, `${job.unit}.json`);
  const where = `${job.course} unit ${job.unit} ${job.block}`;
  if (!fs.existsSync(file)) { console.log(`FAIL ${where}: no such lesson`); failed++; continue; }
  const lesson = JSON.parse(fs.readFileSync(file, 'utf8'));
  const b = lesson.blocks.find((b) => b.id === job.block);
  if (!b) { console.log(`FAIL ${where}: no such block`); failed++; continue; }
  if (b.text[job.lang]?.trim()) { console.log(`skip ${where}: already has ${job.lang}`); continue; }

  const have = Object.keys(b.text).find((l) => b.text[l]?.trim());
  if (!have) { console.log(`FAIL ${where}: the block has no text at all`); failed++; continue; }

  /* Find the element holding the existing language's hole, and clone it. */
  const root = parse(lesson.template, { comment: true });
  const marker = `<!--cts:${b.id}:${have}-->`;
  const holder = root.querySelectorAll('*').find((el) => el.innerHTML.includes(marker)
    && !el.querySelectorAll('*').some((c) => c.innerHTML.includes(marker)));
  if (!holder) { console.log(`FAIL ${where}: cannot find the ${have} hole in the template`); failed++; continue; }

  const clone = parse(holder.outerHTML, { comment: true }).firstChild;
  clone.set_content(`<!--cts:${b.id}:${job.lang}-->`);

  /* Where the clone goes depends on how the page marks language.

     If the element carries the marker itself, the new one goes straight after
     it, with its marker swapped.

     If the marker is on an ANCESTOR -- a <p> inside <div class="lang-en"> --
     then putting the clone next to it would drop Spanish inside the English
     container, where the stylesheet hides it exactly when the reader asks for
     Spanish. It belongs in the Spanish container instead, and the place is
     found by anchoring: take the neighbouring block that DOES have both
     languages, find its hole in the other language, and put the new text
     beside that. The new paragraph then lands where its neighbours say it
     should, not at a guessed index. */
  const holeOf = (id, lang) => {
    const m = `<!--cts:${id}:${lang}-->`;
    return root.querySelectorAll('*').find((el) => el.innerHTML.includes(m)
      && !el.querySelectorAll('*').some((c) => c.innerHTML.includes(m)));
  };
  const idIn = (el) => el?.innerHTML.match(new RegExp(`<!--cts:([A-Za-z0-9_-]+):${have}-->`))?.[1];

  if (retarget(clone, have, job.lang)) {
    holder.insertAdjacentHTML('afterend', clone.outerHTML);
  } else {
    const sibs = holder.parentNode.childNodes.filter((n) => n.tagName);
    const at = sibs.indexOf(holder);
    let placed = false;

    for (let k = at - 1; k >= 0 && !placed; k--) {
      const anchor = holeOf(idIn(sibs[k]), job.lang);
      if (!anchor) continue;
      anchor.insertAdjacentHTML('afterend', clone.outerHTML);
      console.log(`     placed after the ${job.lang} of ${idIn(sibs[k])}`);
      placed = true;
    }
    for (let k = at + 1; k < sibs.length && !placed; k++) {
      const anchor = holeOf(idIn(sibs[k]), job.lang);
      if (!anchor) continue;
      anchor.insertAdjacentHTML('beforebegin', clone.outerHTML);
      console.log(`     placed before the ${job.lang} of ${idIn(sibs[k])}`);
      placed = true;
    }
    if (!placed) {
      console.log(`FAIL ${where}: no neighbouring block has ${job.lang}, so there is nowhere to anchor it`);
      failed++; continue;
    }
  }

  b.text[job.lang] = job.text;
  b.tr = { ...(b.tr ?? {}), [job.lang]: { status: 'machine', from: hash(b.text[have]) } };
  lesson.template = root.toString();

  console.log(`ok   ${where}: added ${job.lang} (${job.text.length} chars) in <${clone.tagName.toLowerCase()} class="${clone.getAttribute('class') ?? ''}">`);
  if (!CHECK) fs.writeFileSync(file, JSON.stringify(lesson, null, 1) + '\n');
  done++;
}

console.log(`\n${done} filled, ${failed} could not be`);
if (CHECK) console.log('nothing was written (--check)');
process.exitCode = failed ? 1 : 0;
