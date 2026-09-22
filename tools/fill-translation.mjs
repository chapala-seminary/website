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
 * It also applies tools/data/edits.json: the handful of changes to what a
 * reader sees that were asked for and approved, each recorded in
 * docs/content-changes.md. They live in a data file rather than in a commit
 * because converting a course is re-runnable, and anything applied by hand
 * afterwards is lost the next time it is. This tool is the step that puts
 * them back.
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

  /* When the language supplied is the lesson's SOURCE language -- two CTSWR
     headings were written in Spanish and their English added here -- the
     language that was already there needs provenance too. Without it, the
     original reads as a translation of nothing and shows up as stale
     forever. It is human, and it now corresponds to this English. */
  if (job.lang === lesson.sourceLang)
    b.tr[have] = { status: 'human', from: hash(job.text) };
  lesson.template = root.toString();

  console.log(`ok   ${where}: added ${job.lang} (${job.text.length} chars) in <${clone.tagName.toLowerCase()} class="${clone.getAttribute('class') ?? ''}">`);
  if (!CHECK) fs.writeFileSync(file, JSON.stringify(lesson, null, 1) + '\n');
  done++;
}

console.log(`\n${done} filled, ${failed} could not be`);
if (CHECK) console.log('nothing was written (--check)');

/* ── Approved edits to what a reader sees ─────────────────────────────────
   Two kinds so far: merging a heading that existed twice in two places into
   one bilingual block, and removing a block outright. Both are described in
   docs/content-changes.md; this is the part that performs them. */
const EDITS = 'tools/data/edits.json';
if (fs.existsSync(EDITS)) {
  for (const e of JSON.parse(fs.readFileSync(EDITS, 'utf8'))) {
    const file = path.join(ROOT, e.course, `${e.unit}.json`);
    const where = `${e.course} unit ${e.unit}`;
    if (!fs.existsSync(file)) { console.log(`FAIL ${where}: no such lesson`); failed++; continue; }
    const l = JSON.parse(fs.readFileSync(file, 'utf8'));

    if (e.op === 'remove') {
      const b = l.blocks.find((b) => b.id === e.block);
      if (!b) { console.log(`skip ${where}: ${e.block} is already gone`); continue; }
      const before = l.template;
      /* The element that held it goes too, or the page keeps an empty
         paragraph where the note was. */
      l.template = l.template.replace(
        new RegExp(`\\n?<${e.holder}><!--cts:${e.block}:\\w+--></${e.holder}>`, 'g'), '');
      if (l.template === before) { console.log(`FAIL ${where}: ${e.block} is not held by a plain <${e.holder}>`); failed++; continue; }
      l.blocks = l.blocks.filter((x) => x.id !== e.block);
      if (!CHECK) fs.writeFileSync(file, JSON.stringify(l, null, 1) + '\n');
      console.log(`ok   ${where}: removed ${e.block} and the <${e.holder}> that held it`);
      done++;
      continue;
    }

    if (e.op === 'merge') {
      const keep = l.blocks.find((b) => b.id === e.keep);
      const absorb = l.blocks.find((b) => b.id === e.absorb);
      if (!keep) { console.log(`FAIL ${where}: no block ${e.keep}`); failed++; continue; }
      if (!absorb) { console.log(`skip ${where}: ${e.absorb} is already merged`); continue; }

      let t = l.template;
      const before = t;
      for (const [id, lang] of [[e.keep, keep.sourceLangOf ?? 'en'], [e.absorb, 'es']]) {
        const el = t.match(new RegExp(`<(\\w+)([^>]*)><!--cts:${id}:\\w+--></\\1>`));
        if (!el) continue;
        t = t.replace(el[0], '');                                  // lift it out
        const target = new RegExp(`(<[^>]*><!--cts:${e.moveBefore}:${id === e.keep ? 'en' : 'es'}-->)`);
        const put = el[0].replace(`cts:${id}:`, `cts:${e.keep}:`);  // one id for both
        t = t.replace(target, put + '$1');                          // and put it back
      }
      if (t === before) { console.log(`FAIL ${where}: the template is not shaped as expected`); failed++; continue; }

      for (const [lang, text] of Object.entries(absorb.text)) keep.text[lang] ??= text;
      /* The merged block's two halves are each other's translation now, so
         the provenance is rewritten to say so rather than pointing at the
         text one of them used to sit beside. */
      keep.tr = {};
      for (const lang of Object.keys(keep.text))
        if (lang !== l.sourceLang) keep.tr[lang] = { status: 'human', from: hash(keep.text[l.sourceLang]) };
      l.blocks = l.blocks.filter((b) => b.id !== e.absorb);
      l.template = t;
      if (!CHECK) fs.writeFileSync(file, JSON.stringify(l, null, 1) + '\n');
      console.log(`ok   ${where}: ${e.absorb} merged into ${e.keep}, both now before ${e.moveBefore}`);
      done++;
      continue;
    }

    console.log(`FAIL ${where}: unknown edit "${e.op}"`);
    failed++;
  }
}

console.log(failed ? `FAIL: ${failed} change(s) could not be applied` : 'all approved content changes are in place');
process.exitCode = failed ? 1 : 0;
