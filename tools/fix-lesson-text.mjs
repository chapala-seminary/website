// Apply small, exact corrections to lesson text -- typos, accents, a doubled
// word -- listed in a JSON file, and nothing else.
//
//   node tools/fix-lesson-text.mjs <fixes.json>           check every fix
//   node tools/fix-lesson-text.mjs <fixes.json> --write   and apply them
//
// fixes.json is a list of
//   { "course": "CTSActs", "unit": 11, "block": "b021", "lang": "es",
//     "find": "Tiranno", "replace": "Tirano", "why": "spelling" }
//
// A fix is refused unless `find` occurs exactly once in that block's text in
// that language, so a correction cannot land somewhere it was not meant for,
// and nothing is written unless every fix in the file passes.
//
// Translation provenance (src/lib/lesson.ts): each translation records a
// hash of the source text it was made from, and a changed source marks the
// translation out of date. A typo fixed in the source does not make a
// translation wrong, so when the translation was current before the fix, its
// hash is moved to the corrected source and it stays current. A translation
// that was already out of date stays out of date.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const [file, flag] = process.argv.slice(2);
if (!file) { console.error('usage: fix-lesson-text.mjs <fixes.json> [--write]'); process.exit(2); }
const write = flag === '--write';
const hash = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);
const count = (hay, needle) => hay.split(needle).length - 1;

const fixes = JSON.parse(fs.readFileSync(file, 'utf8'));
const lessons = new Map();          // path -> { raw, data }
const problems = [];
let applied = 0, rehashed = 0;

for (const [i, f] of fixes.entries()) {
  const at = `#${i + 1} ${f.course} u${f.unit} ${f.block} ${f.lang}`;
  const p = path.join('src/content/lessons', f.course, `${f.unit}.json`);
  if (!fs.existsSync(p)) { problems.push(`${at}: no lesson ${p}`); continue; }
  if (!lessons.has(p)) { const raw = fs.readFileSync(p, 'utf8'); lessons.set(p, { raw, data: JSON.parse(raw) }); }
  const l = lessons.get(p).data;
  const b = l.blocks.find((x) => x.id === f.block);
  if (!b) { problems.push(`${at}: no block ${f.block}`); continue; }
  const text = b.text[f.lang];
  if (typeof text !== 'string') { problems.push(`${at}: the block has no ${f.lang} text`); continue; }
  if (!f.find || f.find === f.replace) { problems.push(`${at}: empty or no-op fix`); continue; }
  const n = count(text, f.find);
  if (n !== 1) { problems.push(`${at}: "${f.find}" occurs ${n} times in the block, not once`); continue; }
  const next = text.replace(f.find, f.replace);
  if (f.lang === l.sourceLang) {
    for (const t of Object.values(b.tr || {})) {
      if (t.from === hash(text)) { t.from = hash(next); rehashed++; }
    }
  }
  b.text[f.lang] = next;
  applied++;
}

if (problems.length) {
  problems.forEach((x) => console.error('  ' + x));
  console.error(`${problems.length} of ${fixes.length} fix(es) refused; nothing written`);
  process.exit(1);
}
if (write) {
  for (const [p, { raw, data }] of lessons) {
    const indent = /^\{\n {2}"/.test(raw) ? 2 : 1;
    fs.writeFileSync(p, JSON.stringify(data, null, indent) + (raw.endsWith('\n') ? '\n' : ''));
  }
}
console.log(`${applied} fix(es) in ${lessons.size} lesson(s) ${write ? 'written' : 'check passed (add --write)'}; ${rehashed} current translation(s) kept current`);
