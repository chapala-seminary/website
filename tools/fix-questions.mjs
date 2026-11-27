// Apply corrections to unit-exam questions -- stems, options, explanations,
// short-answer prompts, models and keywords, fill-in prompts and answers, and
// multiple-choice answer keys -- listed in a JSON file, and nothing else.
//
//   node tools/fix-questions.mjs <fixes.json>           check every fix
//   node tools/fix-questions.mjs <fixes.json> --write   and apply them
//
// The questions are split in two (tools/private-units.mjs): the public half in
// src/content/units-public/<Prefix>/<n>.json (stem, options, prompt) and the
// keys in assessment-keys/units/<Prefix>/<n>.json (answer, why, keywords,
// model, accept, and the translation state `tr`). This tool writes each field
// to the file it lives in.
//
// fixes.json is a list of
//   { "course": "CTSNT", "unit": 12, "kind": "mc", "n": 10,
//     "set": { "answer": 2,
//              "why": { "en": "...", "es": "...", "fr": "...", ... } },
//     "why": "lesson b019: the imagery is Old Testament prophecy" }
//
// `n` counts from 1, as the exam shows it. `set` replaces whole fields, per
// language (an object) or outright (a number, for `answer`). A fix may also be
//   { ..., "find": {"en": "Lazy deacons"}, "replace": {"en": "Lay deacons"},
//          "field": "options" }
// for a small change inside one field, refused unless `find` occurs exactly
// once in that field's text in that language.
//
// `set.rubric` replaces a short answer's grading rubric ({points:[{id,
// essential, en}]}); rubrics are English-only and outside the stamp.
//
// Translation state (src/lib/lesson.ts): each question records, per language,
// a hash of the source fields its translation was made from. After the fixes,
// the hash is recomputed. A language changed by the fix becomes
// `machine` from the new source. A language the fix did not touch keeps a
// current status only if the fix was marked "typo": true (a source-only
// spelling fix does not make a translation wrong); otherwise the fix is
// refused, so no translation goes silently out of date.
import fs from 'node:fs';
import path from 'node:path';
import { hash } from '../src/lib/lesson.ts';
import { resolveKeysRoot } from './grading-keys-lib.mjs';

const [file, flag] = process.argv.slice(2);
if (!file) { console.error('usage: fix-questions.mjs <fixes.json> [--write]'); process.exit(2); }
const write = flag === '--write';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const KEYS = resolveKeysRoot();
const PUBLIC_FIELDS = new Set(['stem', 'options', 'prompt']);
const FIELDS = ['stem', 'prompt', 'options', 'why', 'answer', 'accept', 'keywords', 'model'];
const LANGS = ['es', 'fr', 'sw', 'pt', 'ta'];
const fixes = JSON.parse(fs.readFileSync(file, 'utf8'));
const files = new Map();
const load = p => { if (!files.has(p)) files.set(p, JSON.parse(fs.readFileSync(p, 'utf8'))); return files.get(p); };
const errors = [];
const touched = new Map(); // item key -> {pub, key, langs:Set, typo}

const count = (hay, needle) => hay.split(needle).length - 1;
function stampOf(pub, key) {
  const merged = { ...pub, ...key };
  const original = Object.fromEntries(FIELDS.filter(f => merged[f]?.en != null).map(f => [f, merged[f].en]));
  const shared = { ...(typeof merged.answer === 'number' ? { answerIndex: merged.answer } : {}), ...(merged.minHits != null ? { minHits: merged.minHits } : {}) };
  return hash(JSON.stringify({ ...original, ...shared }));
}

for (const [i, fx] of fixes.entries()) {
  const label = `#${i + 1} ${fx.course}/${fx.unit} ${fx.kind} ${fx.n}`;
  const pubPath = path.join(ROOT, 'src/content/units-public', fx.course, `${fx.unit}.json`);
  const keyPath = path.join(KEYS, 'units', fx.course, `${fx.unit}.json`);
  if (!fs.existsSync(keyPath)) { errors.push(`${label}: no keys file`); continue; }
  const pubFile = fs.existsSync(pubPath) ? load(pubPath) : null, keyFile = load(keyPath);
  const pub = pubFile?.[fx.kind]?.[fx.n - 1] ?? {}, key = keyFile[fx.kind]?.[fx.n - 1];
  if (!key) { errors.push(`${label}: no such question`); continue; }
  const id = `${fx.course}/${fx.unit}/${fx.kind}/${fx.n}`;
  const t = touched.get(id) ?? { pub, key, langs: new Set(), typo: true, before: stampOf(pub, key) };
  t.typo = t.typo && !!fx.typo;
  touched.set(id, t);
  const owner = f => (pubFile && PUBLIC_FIELDS.has(f) ? pub : key);
  if (fx.set) for (const [f, v] of Object.entries(fx.set)) {
    if (f === 'rubric') { // English-only grading points, outside the translation stamp
      if (!v || !Array.isArray(v.points) || !v.points.every(pt => pt.id && pt.en)) { errors.push(`${label}: rubric needs points with id and en`); continue; }
      key.rubric = { v: 1, ...v }; continue;
    }
    if (!FIELDS.includes(f)) { errors.push(`${label}: unknown field ${f}`); continue; }
    const o = owner(f);
    if (f === 'answer' && typeof v === 'number') {
      const n = (pub.options ?? key.options)?.en?.length;
      if (!(v >= 0 && v < n)) errors.push(`${label}: answer ${v} out of range`);
      o.answer = v; t.langs.add('*'); continue;
    }
    if (typeof v !== 'object' || Array.isArray(v)) { errors.push(`${label}: ${f} must be per-language`); continue; }
    if (o[f] == null) o[f] = {};
    for (const [lang, val] of Object.entries(v)) {
      if (f === 'options' && (!Array.isArray(val) || val.length !== (o.options.en ?? val).length)) errors.push(`${label}: ${lang} options length`);
      o[f][lang] = val; t.langs.add(lang);
    }
  }
  if (fx.find) {
    const o = owner(fx.field);
    for (const [lang, needle] of Object.entries(fx.find)) {
      const cur = o[fx.field]?.[lang];
      const rep = fx.replace?.[lang];
      if (rep == null) { errors.push(`${label}: no replace for ${lang}`); continue; }
      if (Array.isArray(cur)) {
        const hits = cur.filter(s => count(s, needle) === 1).length, total = cur.reduce((a, s) => a + count(s, needle), 0);
        if (total !== 1) { errors.push(`${label}: "${needle}" found ${total}x in ${fx.field}.${lang}`); continue; }
        o[fx.field][lang] = cur.map(s => s.replace(needle, rep)); void hits;
      } else if (typeof cur === 'string') {
        if (count(cur, needle) !== 1) { errors.push(`${label}: "${needle}" found ${count(cur, needle)}x in ${fx.field}.${lang}`); continue; }
        o[fx.field][lang] = cur.replace(needle, rep);
      } else { errors.push(`${label}: no ${fx.field}.${lang}`); continue; }
      t.langs.add(lang);
    }
  }
}

for (const [id, t] of touched) {
  const now = stampOf(t.pub, t.key);
  if (now === t.before) continue;
  const tr = t.key.tr ?? (t.key.tr = {});
  for (const lang of Object.keys(tr)) {
    const wasCurrent = tr[lang].from === t.before;
    if (t.langs.has(lang)) tr[lang] = { status: 'machine', from: now };
    else if (t.typo && wasCurrent) tr[lang] = { ...tr[lang], from: now };
    else if (wasCurrent) errors.push(`${id}: source changed but ${lang} was not updated (give it, or mark the fix "typo": true)`);
  }
}

if (errors.length) { console.error(errors.join('\n')); console.error(`${errors.length} problem(s); nothing written`); process.exit(1); }
if (write) for (const [p, d] of files) fs.writeFileSync(p, JSON.stringify(d, null, 1) + '\n');
console.log(`${fixes.length} fixes on ${touched.size} questions ${write ? 'written' : 'checked'}`);
