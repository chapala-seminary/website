/* Can a teacher reach every word of the lesson?
 *
 * A lesson is a template with holes plus the blocks that fill them. Anything
 * still written INTO the template is on the page and out of reach -- it
 * renders, so no other check notices, and a teacher who opens the unit in the
 * CMS simply cannot find it. That is how ten thousand characters of CTSST's
 * Spanish sat frozen while every gate was green.
 *
 * So this walks the templates and requires that every remaining scrap of text
 * is page furniture, named in the list below. The list is the whole argument:
 * these are the things a CMS should NOT offer to edit, because the layout
 * renders them and there are hundreds of copies. Everything else must be a
 * block.
 *
 *   node tools/verify-editable.mjs           # pass or fail
 *   node tools/verify-editable.mjs --list    # and show what is frozen
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const ROOT = 'src/content/lessons';
const LIST = process.argv.includes('--list');

/* Page furniture: rendered by the layout or filled by the engine, repeated on
   every page, and not a teacher's to edit. Kept in step with the same list in
   tools/extract-lesson.mjs. */
const FURNITURE = {
  'the registration form': '#cts-register,#regCard,#registration-card,.reg-form,select,option,label,input',
  'the exam and its results': '#exam-section,#results-block,#lockout-block,#questionsContainer,#kwContainer,#examResult,#track-card',
  'navigation and controls': 'nav,.nav-bar,.toolbar,.topbar,.langbar,.unitnav,.cts-unitnav,.progress-grid,button',
  'the honours-readings box': '[data-cts-rrbox]',
  'the masthead and footer': 'footer,.crest,.credits',
  'engine notices': '#greeting,#storageWarning,#testBanner,.storage-error,.test-banner',
  'scripts and styles': 'script,style',
};
const ALL = Object.values(FURNITURE).join(',');

const norm = (s) => s.replace(/\s+/g, ' ').trim();
let frozen = 0, loose = 0, blocks = 0, inBlocks = 0;
const kinds = new Map(), stray = [];

for (const course of fs.readdirSync(ROOT).sort()) {
  for (const f of fs.readdirSync(path.join(ROOT, course)).filter((f) => /^\d+\.json$/.test(f))) {
    const l = JSON.parse(fs.readFileSync(path.join(ROOT, course, f), 'utf8'));
    blocks += l.blocks.length;
    for (const b of l.blocks)
      for (const v of Object.values(b.text)) inBlocks += norm(parse('<x>' + v + '</x>').text).length;

    const root = parse(l.template, { comment: true });
    const furniture = new Set();
    for (const el of root.querySelectorAll(ALL))
      { furniture.add(el); el.querySelectorAll('*').forEach((d) => furniture.add(d)); }

    for (const el of root.querySelectorAll('*')) {
      if (el.innerHTML.includes('<!--cts:')) continue;
      if (el.childNodes.some((n) => n.tagName && n.text.trim())) continue;
      const t = norm(el.text);
      if (!t) continue;
      frozen += t.length;
      if (furniture.has(el)) {
        const which = Object.entries(FURNITURE)
          .find(([, sel]) => sel.split(',').some((s) => { try { return el.matches(s) || el.closest(s); } catch { return false; } }))?.[0] ?? 'furniture';
        const k = kinds.get(which) ?? { chars: 0, n: 0, sample: t.slice(0, 54) };
        k.chars += t.length; k.n++; kinds.set(which, k);
      } else {
        loose += t.length;
        stray.push(`${course} unit ${l.unit}: <${el.tagName.toLowerCase()}> ${t.slice(0, 70)}`);
      }
    }
  }
}

const pct = (a, b) => Math.round((a / (a + b)) * 1000) / 10;
console.log(`${blocks.toLocaleString()} editable blocks holding ${inBlocks.toLocaleString()} characters`);
console.log(`${frozen.toLocaleString()} characters remain in the page templates:`);
for (const [what, k] of [...kinds.entries()].sort((a, b) => b[1].chars - a[1].chars))
  console.log(`  ${String(k.chars).padStart(6)}  ${String(k.n).padStart(5)}x  ${what}`);
console.log(`\n${pct(inBlocks, loose)}% of the lesson text is editable`
  + ` (${pct(inBlocks, frozen)}% counting the furniture as lesson text)`);

if (LIST && stray.length) stray.slice(0, 20).forEach((s) => console.log('   ' + s));

if (loose) {
  console.log(`\nFAIL: ${loose.toLocaleString()} characters are frozen in a template and are NOT page furniture.`);
  console.log('They are on the page and no teacher can edit them. Run with --list to see them.');
  process.exitCode = 1;
} else {
  console.log('\nOK: everything still in a template is page furniture, by name.');
}
