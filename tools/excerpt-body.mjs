#!/usr/bin/env node
/* Rebuilds the page text of an assigned-excerpts textbook from its sources,
 * leaving its exam alone:
 *   docs/readers/textbooks/<slug>/excerpts/{en,es}/{1..N}.md  (five, or ten)
 *     -> src/content/textbooks/<slug>.json  body.en / body.es
 * Each source: "# Title", one source line, then paragraphs ("> " lines and
 * all-bold paragraphs are reviewers' notes and are left out).
 *   node tools/excerpt-body.mjs <slug> [--check]
 */
import fs from 'node:fs';

const [slug, flag] = process.argv.slice(2);
if (!slug) { console.error('usage: excerpt-body.mjs <slug> [--check]'); process.exit(2); }
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) => esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
function parse(md) {
  const blocks = md.replace(/\r/g, '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const title = blocks.shift().replace(/^#+\s*/, '').replace(/^\d+\.\s*/, '');
  const source = blocks.shift() || '';
  const paras = blocks.filter((b) => !b.startsWith('>') && !/^\*\*[^*]+\*\*$/.test(b)).map((b) => b.replace(/\n/g, ' '));
  return { title, source, paras };
}
const dir = `docs/readers/textbooks/${slug}/excerpts`;
const count = fs.readdirSync(`${dir}/en`).filter((f) => /^\d+\.md$/.test(f)).length;
if (!count || fs.readdirSync(`${dir}/es`).filter((f) => /^\d+\.md$/.test(f)).length !== count) { console.error(`${slug}: English and Spanish excerpts do not match`); process.exit(2); }
const body = (lang) => Array.from({ length: count }, (_, k) => k + 1).map((i) => {
  const e = parse(fs.readFileSync(`${dir}/${lang}/${i}.md`, 'utf8'));
  return `<h2 id="${lang}-${i}">${i}. ${inline(e.title)}</h2><p class="small muted">${inline(e.source)}</p>` + e.paras.map((p) => `<p>${inline(p)}</p>`).join('');
}).join('');
const file = `src/content/textbooks/${slug}.json`;
const rec = JSON.parse(fs.readFileSync(file, 'utf8'));
const next = { en: body('en'), es: body('es') };
const same = rec.body.en === next.en && rec.body.es === next.es;
if (flag === '--check') { console.log(same ? `${slug}: page text current` : `${slug}: page text out of date`); process.exit(same ? 0 : 1); }
rec.body = next;
fs.writeFileSync(file, JSON.stringify(rec, null, 2) + '\n');
console.log(`${slug}: page text rebuilt (${next.en.length} / ${next.es.length} characters)`);
