#!/usr/bin/env node
/* Put the fill-in answers the faculty approved into the course content
 * (docs/ai-grading.md, sections 4 and 9).
 *
 *   node tools/apply-accepts.mjs <file> [--content DIR] [--dry-run]
 *
 * <file> is what /staff/grading/synonyms.json ("Download approved synonyms")
 * gives:
 *
 *   { "version": 1, "approved": [ { "qid": "u:CTSJohn/1/fill/0", "lang": "en", "text": "Gen" } ] }
 *
 * Each approved answer is added to the `accept` list, in that language, of the
 * fill-in the qid names, so it becomes an exact match from the next deploy
 * (and the sync of grading keys puts it on the server). The qid forms are the
 * ones in docs/ai-grading.md section 2:
 *
 *   u:<Prefix>/<n>/fill/<i>   <content>/units/<Prefix>/<n>.json       fill[i]
 *   tb:<slug>/fill/<i>        <keys>/textbooks/<slug>.json            test.questions[i]
 *                             (private assessment-keys; public textbook JSON
 *                             no longer holds answer/accept)
 *   rd:<slug>/fill/<i>        <content>/readings/<slug>.json          test.questions[i]
 *
 * IDEMPOTENT. An answer the item already accepts, or that is its answer, once
 * both are compared the way the grader compares them (same text rules as
 * worker/grading/text.js: case, accents, punctuation, a leading article), is
 * left alone, so running it twice changes nothing.
 *
 * FORMATTING. A file is rewritten only if it changes, and only in the way it
 * was already written: the tool reads it, finds the indent (1 or 2 spaces) and
 * final newline that reproduce the file byte for byte, and writes with the same.
 * A file that does not round-trip is not touched, and the run fails, rather than
 * reformat a whole bank to add one word. Units are JSON.stringify(x, null, 1)+"\n".
 *
 * --content DIR   the content root, default src/content (a copy, in the tests)
 * --keys DIR      private assessment-keys root for textbook accepts
 *                 (default: ASSESSMENT_KEYS or ../assessment-keys)
 * --dry-run       say what would change, write nothing
 */
import fs from 'node:fs';
import path from 'node:path';
import { bare, fillCodes } from '../worker/grading/text.js';
import { resolveKeysRoot } from './grading-keys-lib.mjs';

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const file = argv.find((a, i) => !a.startsWith('--') && argv[i - 1] !== '--content' && argv[i - 1] !== '--keys');
const CONTENT = opt('--content', 'src/content');
const KEYS = opt('--keys', resolveKeysRoot('.'));
const DRY = flag('--dry-run');
if (!file) { console.error('usage: node tools/apply-accepts.mjs <file> [--content DIR] [--keys DIR] [--dry-run]'); process.exit(2); }

const LANGS = ['en', 'es', 'fr'];
const MAX = 80;                       // the longest fill-in the server takes

let input;
try { input = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { console.error(`cannot read ${file}: ${e.message}`); process.exit(2); }
const approved = Array.isArray(input) ? input : input.approved;
if (!Array.isArray(approved)) { console.error('the file has no "approved" list'); process.exit(2); }

/** The content file and the path to the item for a qid, or null. */
function locate(qid) {
  let m;
  if ((m = /^u:([A-Za-z0-9_]{1,40})\/(\d{1,3})\/fill\/(\d+)$/.exec(qid)))
    return { file: path.join(CONTENT, 'units', m[1], `${m[2]}.json`), items: (o) => o.fill, i: +m[3] };
  if ((m = /^tb:([a-z0-9]{2,60})\/fill\/(\d+)$/.exec(qid))) {
    if (!KEYS) return null;
    return { file: path.join(KEYS, 'textbooks', `${m[1]}.json`), items: (o) => o.test?.questions, i: +m[2] };
  }
  if ((m = /^rd:([a-z0-9]{2,60})\/fill\/(\d+)$/.exec(qid)))
    return { file: path.join(CONTENT, 'readings', `${m[1]}.json`), items: (o) => o.test?.questions, i: +m[2] };
  return null;
}

/** The indent and final newline that reproduce `text`, or null. */
function style(text, obj) {
  for (const indent of [1, 2]) for (const nl of ['\n', '']) if (JSON.stringify(obj, null, indent) + nl === text) return { indent, nl };
  return null;
}

const files = new Map();             // path -> { text, obj, style, changed }
const report = { added: [], already: [], unknown: [], invalid: [], files: [] };

for (const a of approved) {
  const qid = String(a?.qid ?? ''), lang = String(a?.lang ?? ''), text = String(a?.text ?? '').trim();
  if (!LANGS.includes(lang) || !text || text.length > MAX) { report.invalid.push(`${qid} ${lang} ${JSON.stringify(text).slice(0, 40)}`); continue; }
  const at = locate(qid);
  if (!at || !fs.existsSync(at.file)) { report.unknown.push(qid); continue; }
  if (!files.has(at.file)) {
    const raw = fs.readFileSync(at.file, 'utf8');
    const obj = JSON.parse(raw);
    files.set(at.file, { raw, obj, style: style(raw, obj), changed: false });
  }
  const f = files.get(at.file);
  const item = at.items(f.obj)?.[at.i];
  if (!item || !item.answer) { report.unknown.push(qid); continue; }
  // already an answer, or accepted: compared as the grader compares (the reader's language and the source's)
  const have = [];
  for (const code of fillCodes(lang)) have.push(item.answer[code], ...((item.accept && item.accept[code]) || []));
  if (have.some((h) => h && bare(h) === bare(text))) { report.already.push(`${qid} ${lang} ${text}`); continue; }
  if (!item.accept) {
    // keep the key order: accept sits right after answer
    const entries = Object.entries(item), at2 = entries.findIndex(([k]) => k === 'answer') + 1;
    entries.splice(at2, 0, ['accept', {}]);
    for (const k of Object.keys(item)) delete item[k];
    for (const [k, v] of entries) item[k] = v;
  }
  (item.accept[lang] ??= []).push(text);
  f.changed = true;
  report.added.push(`${qid} ${lang} ${text}`);
}

let failed = false;
for (const [p, f] of files) {
  if (!f.changed) continue;
  if (!f.style) { console.error(`REFUSING ${p}: it is not written as JSON.stringify(x, null, 1 or 2) plus a newline, so a rewrite would reformat it`); failed = true; continue; }
  report.files.push(p);
  if (!DRY) fs.writeFileSync(p, JSON.stringify(f.obj, null, f.style.indent) + f.style.nl);
}

console.log(`${DRY ? 'would add' : 'added'} ${report.added.length}, already there ${report.already.length}, unknown question ${report.unknown.length}, unusable ${report.invalid.length}; files changed: ${report.files.length}`);
for (const line of report.added) console.log('  + ' + line);
for (const q of report.unknown) console.log('  ? no such fill-in: ' + q);
for (const q of report.invalid) console.log('  ! unusable entry: ' + q);
if (report.files.length && !DRY) console.log('Next: node tools/content-baseline.mjs --write (it fingerprints accept lists; note it in docs/content-changes.md), then npm run build && test/run-tests.sh.');
process.exit(failed || report.unknown.length || report.invalid.length ? 1 : 0);
