/* Take the HTML entities out of the lesson text.
 *
 * The lessons were written as HTML files, where a curly quote had to be
 * spelled &ldquo; because the file's encoding could not be trusted. The JSON
 * they became is UTF-8, so it can simply hold the character -- and an editor
 * looking at a paragraph should see a quotation mark, not &ldquo;. Sveltia
 * shows the field's text; it has no reason to know what an entity is.
 *
 * Three are left alone: &amp;, &lt; and &gt;. The field carries inline markup
 * -- <em>, <strong> -- so it is HTML, and in HTML those three characters mean
 * something other than themselves. Decoding them would change what the text
 * says. Everything else decodes to exactly the character it stood for.
 *
 * WHAT THIS DOES ABOUT TRANSLATION STATE
 *
 * Every translation carries a hash of the source text it was made from, and
 * rewriting the source changes that hash. Left alone, decoding would mark
 * every translation in the course stale -- 462 blocks needing re-translation
 * because a quotation mark changed spelling.
 *
 * So the hash is recomputed. But ONLY for blocks whose translation was current
 * to begin with: a translation that was already stale stays stale. A cleanup
 * pass must not be able to launder that, or "everything is up to date" stops
 * meaning anything.
 *
 *   node tools/decode-entities.mjs CTSHermeneutics --check
 *   node tools/decode-entities.mjs CTSHermeneutics
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { hash } from '../src/lib/lesson.ts';

const COURSE = process.argv[2];
const CHECK = process.argv.includes('--check');
if (!COURSE) { console.error('usage: node tools/decode-entities.mjs <Course> [--check]'); process.exit(2); }

/* The three that must stay spelled out, because in HTML they are syntax. */
const KEEP = /^&(amp|lt|gt|AMP|LT|GT);$/;
const ENTITY = /&(?:[a-zA-Z][a-zA-Z0-9]*|#\d+|#[xX][0-9a-fA-F]+);/g;

/* Decoded by the same parser that reads these pages, so the answer is the
   browser's answer rather than a table this file would have to maintain. */
const memo = new Map();
const decodeOne = (ent) => {
  if (KEEP.test(ent)) return ent;
  if (!memo.has(ent)) {
    const out = parse(`<x>${ent}</x>`).text;
    // an entity the parser does not know comes back unchanged; leave it be
    memo.set(ent, out === ent ? ent : out);
  }
  return memo.get(ent);
};

/* Only the text between tags is touched. Splitting on tags keeps attribute
   values out of it, where an entity may be doing real work. */
const decode = (html) => html.split(/(<[^>]*>)/)
  .map((part, i) => (i % 2 ? part : part.replace(ENTITY, decodeOne)))
  .join('');

const dir = path.join('src', 'content', 'lessons', COURSE);
if (!fs.existsSync(dir)) { console.error(`${COURSE} has not been converted`); process.exit(1); }

let changed = 0, blocks = 0, refreshed = 0, leftStale = 0, files = 0;
const kinds = new Map();

for (const f of fs.readdirSync(dir).filter((f) => /^\d+\.json$/.test(f))
                 .sort((a, b) => parseInt(a) - parseInt(b))) {
  const file = path.join(dir, f);
  const lesson = JSON.parse(fs.readFileSync(file, 'utf8'));
  const src = lesson.sourceLang;
  let touched = false;

  for (const b of lesson.blocks) {
    const words = b.type === 'figure' ? b.caption : b;
    if (!words?.text) continue;

    const before = words.text[src];
    let any = false;
    for (const [lang, value] of Object.entries(words.text)) {
      for (const m of value.match(ENTITY) ?? [])
        if (!KEEP.test(m)) kinds.set(m, (kinds.get(m) ?? 0) + 1);
      const next = decode(value);
      if (next !== value) { words.text[lang] = next; any = true; }
    }
    if (!any) continue;
    blocks++; touched = true;

    /* The source moved, so every translation's provenance has to move with it
       -- but only where it was accurate before. */
    const after = words.text[src];
    if (before !== undefined && after !== before && words.tr) {
      const was = hash(before), now = hash(after);
      for (const tr of Object.values(words.tr)) {
        if (tr.from === was) { tr.from = now; refreshed++; }
        else leftStale++;
      }
    }
  }

  if (!touched) continue;
  files++; changed++;
  if (!CHECK) fs.writeFileSync(file, JSON.stringify(lesson, null, 1) + '\n');
}

const total = [...kinds.values()].reduce((a, b) => a + b, 0);
console.log(`${COURSE}: ${total} entities of ${kinds.size} kinds in ${blocks} block(s) across ${files} unit(s)`);
[...kinds.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
  .forEach(([k, n]) => console.log(`   ${k.padEnd(12)} ${n}`));
if (kinds.size > 8) console.log(`   … and ${kinds.size - 8} more kinds`);
console.log(`${refreshed} translation stamp(s) carried across; ${leftStale} left stale, as they already were`);
console.log(CHECK ? 'nothing was written (--check)' : `rewrote ${files} file(s)`);
