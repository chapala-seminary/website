/* Take out of the templates the markup the build already throws away.
 *
 * WHY THIS IS SAFE, AND WHY IT IS WORTH DOING
 *
 * shell.ts removes a list of page furniture from every lesson body at build
 * time -- unit navigation, the registration card, language toggles, page
 * headers and footers -- because the layout now renders each of those once,
 * correctly, for all 451 pages. So that markup has been in the data and not
 * on the site ever since. It costs nothing at runtime. What it costs is
 * everywhere else: it is a quarter of a megabyte of the lesson files, it
 * shows up in the CMS as text an editor can see and cannot affect, and it
 * makes every measurement of "how much of a lesson is furniture" wrong.
 *
 * This removes exactly what shell.ts removes -- same list, imported from
 * shell.ts rather than copied, same two exceptions (an element whose class is
 * in KEEP, and the element holding the page's only <h1>).
 *
 * It refuses to remove anything containing lesson text. shell.ts never has to
 * make that judgement, because by the time it runs the text is already in the
 * page; here a hole inside a piece of chrome would mean the block has nowhere
 * to go, and renderLesson would then refuse to render the lesson at all. Such
 * cases are reported and left alone.
 *
 * With --with-text it also removes the chrome that DOES hold text: the
 * registration cards, the "Catalog" and "Next Unit" links, "Clear Saved
 * Data". That text is in the same position -- shell.ts deletes it from every
 * page, and the layout renders its own -- but it was showing up in the CMS as
 * dozens of fields per lesson that an editor could change to no effect, which
 * is worse than useless. Every word of it is written to
 * docs/removed-chrome-text.json before it goes, so the deletion is reviewable
 * and reversible without going through the history.
 *
 *   node tools/strip-chrome.mjs [--check] [--with-text] [--only <selector>]
 *
 * Whatever it does, the proof is not in this file: build before, build after,
 * and run tools/verify-unchanged.mjs. If one element of one page moved, that
 * check fails and this was wrong.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { CHROME, KEEP } from '../src/lib/shell.ts';

const args = process.argv.slice(2);
const CHECK = args.includes('--check');
const WITH_TEXT = args.includes('--with-text');
const ARCHIVE = 'docs/removed-chrome-text.json';
const onlyAt = args.indexOf('--only');
const SELECTORS = onlyAt >= 0 ? [args[onlyAt + 1]] : CHROME;

const ROOT = 'src/content/lessons';
const HOLE = /<!--cts(-part)?[:-]/;

const bySelector = new Map();     // selector -> { n, bytes }
const held = [];                  // chrome that holds lesson text
const archive = [];               // every word removed with --with-text
let files = 0, changed = 0, bytes = 0, blocksDropped = 0;

for (const course of fs.readdirSync(ROOT).sort()) {
  for (const file of fs.readdirSync(path.join(ROOT, course)).filter((f) => f.endsWith('.json'))) {
    const p = path.join(ROOT, course, file);
    const lesson = JSON.parse(fs.readFileSync(p, 'utf8'));
    files++;

    const root = parse(lesson.template, { comment: true });
    const h1 = root.querySelector('h1');
    let touched = false;

    for (const sel of SELECTORS) {
      for (const el of root.querySelectorAll(sel)) {
        if (!el.parentNode) continue;                                  // already gone
        const cls = (el.getAttribute('class') || '').split(/\s+/);
        if (cls.some((c) => KEEP.has(c))) continue;                    // shell.ts spares these
        if (h1 && (el === h1 || el.querySelector('h1') === h1)) continue;
        const html = el.outerHTML;
        if (HOLE.test(html) && !WITH_TEXT) { held.push(`${course} unit ${lesson.unit}: ${sel} holds lesson text`); continue; }
        if (HOLE.test(html)) {
          /* Keep the words before removing them. */
          const byId = new Map(lesson.blocks.map((b) => [b.id, b]));
          const text = {};
          for (const [, id] of html.matchAll(/<!--cts:([A-Za-z0-9_-]+):[a-z-]+-->/g))
            if (byId.has(id)) text[id] = byId.get(id).text;
          archive.push({ course, unit: lesson.unit, selector: sel, text });
        }
        const rec = bySelector.get(sel) || { n: 0, bytes: 0 };
        rec.n++; rec.bytes += html.length; bySelector.set(sel, rec);
        bytes += html.length;
        el.remove();
        touched = true;
      }
    }

    if (!touched) continue;
    changed++;
    if (CHECK) continue;
    lesson.template = root.toString();

    /* A block whose hole is gone has nowhere to render, and renderLesson
       refuses to render a lesson whose blocks and template disagree. Drop
       exactly those, and only those: a block is kept if ANY hole for it
       remains, in any language. */
    const before = lesson.blocks.length;
    const live = new Set([...lesson.template.matchAll(/<!--cts:([A-Za-z0-9_-]+):[a-z-]+-->/g)].map((m) => m[1]));
    lesson.blocks = lesson.blocks.filter((b) => live.has(b.id));
    blocksDropped += before - lesson.blocks.length;
    fs.writeFileSync(p, JSON.stringify(lesson, null, 1) + '\n');
  }
}

for (const [sel, r] of [...bySelector].sort((a, b) => b[1].bytes - a[1].bytes))
  console.log(`  ${sel.padEnd(26)} ${String(r.n).padStart(5)} copies  ${(r.bytes / 1024).toFixed(0).padStart(5)} KB`);
console.log(`\n${bytes ? (bytes / 1024).toFixed(0) + ' KB' : 'nothing'} from ${changed} of ${files} lesson files`);
if (held.length) {
  console.log(`\n${held.length} piece(s) of chrome hold lesson text and were left alone:`);
  for (const h of held.slice(0, 10)) console.log('  ' + h);
}
if (blocksDropped) console.log(`${blocksDropped} blocks had no hole left and were dropped with their chrome`);
if (archive.length && !CHECK) {
  fs.writeFileSync(ARCHIVE, JSON.stringify(archive, null, 1) + '\n');
  console.log(`the removed words are kept in ${ARCHIVE} (${archive.length} pieces of chrome)`);
}
if (CHECK) console.log('\n--check: nothing written');
