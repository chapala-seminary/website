#!/usr/bin/env node
/* The lesson text of the single-page courses (Biblical Counseling, Narrative
 * Preaching, Pastoral and Christian Ethics, WiseSpeak) in a later language
 * (Swahili first), from the translators' packets. See docs/swahili.md.
 *
 *   node tools/import-language-static.mjs --lang sw --from <packets dir> [--write]
 *
 * These courses are hand-written pages, not lesson files. Their packets
 * (<Course>-page-*.json, <Course>-unit<N>-*.json) give each English passage
 * and its translation. This writes the pairs only -- English wording and its
 * translation, no questions and no answers -- to
 * src/data/interface/static/<lang>/<Course>.json. tools/language-pages.mjs
 * puts each translation beside its English on that language's page; an
 * English passage with no translation (the page changed after the packet) stays
 * English, and the page says it is partly translated. The questions of these
 * pages stay English for now (their page scripts are English/Spanish only).
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const argv = process.argv.slice(2);
const opt = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
const LANG = opt('--lang'), FROM = opt('--from'), WRITE = argv.includes('--write');
if (!LANG || !FROM) { console.error('usage: node tools/import-language-static.mjs --lang sw --from <packets dir> [--write]'); process.exit(2); }

export const STATIC_COURSES = {
  CTSCounseling: ['CTSCounseling.html'],
  CTSNarrative: ['CTS_Narrative_Preaching.html'],
  CTSEthics: Array.from({ length: 10 }, (_, i) => `ethics_unit${String(i + 1).padStart(2, '0')}.html`),
  WiseSpeak: ['CTS_WiseSpeak_Preaching.html'],
};
export const norm = (s) => parse(String(s).replaceAll('\\xa0', ' ')).text.replace(/\s+/g, ' ').trim();

for (const [course, pages] of Object.entries(STATIC_COURSES)) {
  const dir = path.join(FROM, course);
  if (!fs.existsSync(dir)) { console.log(`${course}: no packets`); continue; }
  const pairs = [], missing = [];
  for (const name of fs.readdirSync(dir).filter((n) => n.endsWith('-source.json')).sort()) {
    const source = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
    const tfile = path.join(dir, name.replace('-source.json', `-${LANG}.json`));
    if (!fs.existsSync(tfile)) { missing.push(name); continue; }
    const draft = JSON.parse(fs.readFileSync(tfile, 'utf8'));
    const text = Array.isArray(draft.blocks) ? Object.fromEntries(draft.blocks.map((b) => [b.id, b[LANG] ?? b.text])) : (draft.blocks || {});
    for (const b of source.blocks || []) {
      if (!text[b.id]) { missing.push(`${name} ${b.id}`); continue; }
      pairs.push([norm(b.en), text[b.id]]);
    }
  }
  console.log(`${course}: ${pairs.length} passages${missing.length ? `, ${missing.length} without ${LANG}` : ''}`);
  if (WRITE) {
    const out = `src/data/interface/static/${LANG}/${course}.json`;
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify({ course, pages, lang: LANG, pairs }, null, 1) + '\n');
  }
}
