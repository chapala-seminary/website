// Add, move or remove whole blocks of a lesson -- the structural changes
// tools/fix-lesson-text.mjs cannot make, since that tool only rewrites the
// text inside a block.
//
//   node tools/restructure-lesson.mjs <ops.json>           check every op
//   node tools/restructure-lesson.mjs <ops.json> --write   and apply them
//
// ops.json is a list of
//   { "course": "CTSMatt", "unit": 3, "op": "insert", "after": "b015",
//     "blocks": [ { "type": "prose", "tag": "p", "text": { "en": "..", "es": ".." } } ] }
//   { "course": "CTSBibleCharacters", "unit": 4, "op": "move", "block": "b011", "after": "b012" }
//   { "course": "CTSEvanPreach", "unit": 7, "op": "delete", "block": "b040" }
//
// A lesson's template holds every block twice, once per language, each on a
// line of its own inside one element: <p><!--cts:b015:en--></p>. An op is
// refused unless every line it touches has exactly that shape, so a block is
// never pulled out of a table, a list or a figure it belongs to. New blocks get
// the next free ids and a line of their own right after the `after` block in
// both languages, wrapped in `tag` (default p). Their translation is recorded as
// `machine` against the English (src/lib/lesson.ts, TRANSLATION STATE): written
// by a program, for a person to review. Nothing is written unless every op in
// the file passes.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const [file, flag] = process.argv.slice(2);
if (!file) { console.error('usage: restructure-lesson.mjs <ops.json> [--write]'); process.exit(2); }
const write = flag === '--write';
const hash = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);
const TAGS = /^(p|h2|h3|h4|li|blockquote)$/;

const ops = JSON.parse(fs.readFileSync(file, 'utf8'));
const lessons = new Map();
const problems = [];
let done = 0;

/* The template line that carries one block in one language, if it is the
   plain one-element shape; its index and the element's opening tag. */
function lineOf(lines, id, lang) {
  const mark = `<!--cts:${id}:${lang}-->`;
  const at = lines.findIndex((l) => l.includes(mark));
  if (at === -1) return { error: `no ${mark} in the template` };
  if (lines.findIndex((l, i) => i > at && l.includes(mark)) !== -1) return { error: `${mark} appears twice` };
  const m = lines[at].match(/^(\s*)<(\w+)([^>]*)>(<!--cts:\w+:\w+-->)<\/(\w+)>\s*$/);
  if (!m || m[2] !== m[5] || m[4] !== mark) return { error: `${id} (${lang}) is not on a line of its own in one element: ${lines[at].trim().slice(0, 80)}` };
  return { at, indent: m[1] };
}

for (const [i, o] of ops.entries()) {
  const where = `#${i + 1} ${o.course} u${o.unit} ${o.op}`;
  const p = path.join('src/content/lessons', o.course, `${o.unit}.json`);
  if (!fs.existsSync(p)) { problems.push(`${where}: no lesson ${p}`); continue; }
  if (!lessons.has(p)) { const raw = fs.readFileSync(p, 'utf8'); lessons.set(p, { raw, data: JSON.parse(raw) }); }
  const l = lessons.get(p).data;
  const src = l.sourceLang, langs = l.langs;
  let lines = l.template.split('\n');
  const has = (id) => l.blocks.some((b) => b.id === id);

  if (o.op === 'insert') {
    if (!has(o.after)) { problems.push(`${where}: no block ${o.after}`); continue; }
    if (!Array.isArray(o.blocks) || !o.blocks.length) { problems.push(`${where}: no blocks to insert`); continue; }
    let bad = false;
    for (const nb of o.blocks) {
      if (!TAGS.test(nb.tag || 'p')) { problems.push(`${where}: tag "${nb.tag}" not allowed`); bad = true; }
      if (!['prose', 'heading', 'scripture', 'list-item', 'other'].includes(nb.type)) { problems.push(`${where}: type "${nb.type}"`); bad = true; }
      for (const lang of langs) if (!String(nb.text?.[lang] || '').trim()) { problems.push(`${where}: a new block has no ${lang} text`); bad = true; }
    }
    if (bad) continue;
    const newIds = [];
    let last = o.after;
    for (const nb of o.blocks) {
      let n = Math.max(...l.blocks.map((b) => parseInt(String(b.id).replace(/\D/g, ''), 10) || 0)) + 1;
      const id = `b${String(n).padStart(3, '0')}`;
      for (const lang of langs) {
        const pos = lineOf(lines, last, lang);
        if (pos.error) { problems.push(`${where}: ${pos.error}`); bad = true; break; }
        const tag = nb.tag || 'p';
        lines.splice(pos.at + 1, 0, `${pos.indent}<${tag}><!--cts:${id}:${lang}--></${tag}>`);
      }
      if (bad) break;
      const block = { id, type: nb.type, text: Object.fromEntries(langs.map((g) => [g, nb.text[g]])) };
      const tr = {};
      for (const lang of langs) if (lang !== src) tr[lang] = { status: 'machine', from: hash(nb.text[src]) };
      if (Object.keys(tr).length) block.tr = tr;
      // after its predecessor in the list too, so the CMS shows it in reading order
      const k = l.blocks.findIndex((b) => b.id === last);
      l.blocks.splice(k + 1, 0, block);
      newIds.push(id);
      last = id;
    }
    if (bad) continue;
    l.template = lines.join('\n');
    o._ids = newIds;
  } else if (o.op === 'move') {
    if (!has(o.block) || !has(o.after)) { problems.push(`${where}: no block ${has(o.block) ? o.after : o.block}`); continue; }
    let bad = false;
    for (const lang of langs) {
      const from = lineOf(lines, o.block, lang);
      if (from.error) { problems.push(`${where}: ${from.error}`); bad = true; break; }
      const [moved] = lines.splice(from.at, 1);
      const to = lineOf(lines, o.after, lang);
      if (to.error) { problems.push(`${where}: ${to.error}`); bad = true; break; }
      lines.splice(to.at + 1, 0, moved.replace(/^\s*/, to.indent));
    }
    if (bad) continue;
    l.template = lines.join('\n');
    const [b] = l.blocks.splice(l.blocks.findIndex((x) => x.id === o.block), 1);
    l.blocks.splice(l.blocks.findIndex((x) => x.id === o.after) + 1, 0, b);
  } else if (o.op === 'delete') {
    if (!has(o.block)) { problems.push(`${where}: no block ${o.block}`); continue; }
    let bad = false;
    for (const lang of langs) {
      const at = lineOf(lines, o.block, lang);
      if (at.error) { problems.push(`${where}: ${at.error}`); bad = true; break; }
      lines.splice(at.at, 1);
    }
    if (bad) continue;
    l.template = lines.join('\n');
    l.blocks = l.blocks.filter((b) => b.id !== o.block);
  } else {
    problems.push(`${where}: unknown op`); continue;
  }
  done++;
}

if (problems.length) {
  problems.forEach((x) => console.error('  ' + x));
  console.error(`${problems.length} problem(s) in ${ops.length} op(s); nothing written`);
  process.exit(1);
}
for (const o of ops) if (o._ids) console.log(`${o.course} u${o.unit}: new blocks ${o._ids.join(', ')} after ${o.after}`);
if (write) {
  for (const [p, { raw, data }] of lessons) {
    const indent = /^\{\n {2}"/.test(raw) ? 2 : 1;
    fs.writeFileSync(p, JSON.stringify(data, null, indent) + (raw.endsWith('\n') ? '\n' : ''));
  }
}
console.log(`${done} op(s) in ${lessons.size} lesson(s) ${write ? 'written' : 'check passed (add --write)'}`);
