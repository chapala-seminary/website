#!/usr/bin/env node
/* Unit exams whose answer keys live only in the private assessment-keys repo.
 *
 *   node tools/private-units.mjs          write the merged unit files
 *   node tools/private-units.mjs --check  fail if a merged file is missing or stale
 *
 * A course listed under src/content/units-public/<Prefix>/<n>.json is public
 * WITHOUT its keys: multiple-choice questions keep stem and options, short
 * answers keep the prompt, fill-ins keep the prompt. The keys are in the
 * private checkout at units/<Prefix>/<n>.json:
 *
 *   { "mc":   [ { "answer": 2, "why": {...}? } ],          one per public mc, same order
 *     "sa":   [ { "keywords": {...}, "model": {...} } ],    one per public sa
 *     "fill": [ { "answer": {...}, "accept": {...}? } ] }   one per public fill
 *
 * This tool joins the two into src/content/units/<Prefix>/<n>.json, the file
 * every other tool, test and the build already read. Those merged folders are
 * listed in .gitignore, so the keys never enter this public repository. Live
 * pages strip the keys (src/lib/grading-mode.ts) and tools/verify-no-keys.mjs
 * checks dist/. The private checkout is found the same way as for textbooks
 * (tools/grading-keys-lib.mjs resolveKeysRoot): ASSESSMENT_KEYS, else a
 * sibling ../assessment-keys. Without it, a build that has private-key units
 * stops here with a clear message.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PUBLIC = path.join(ROOT, 'src/content/units-public');
const OUT = path.join(ROOT, 'src/content/units');
// 'tr' too: a question's translation stamp hashes its keys, so a public stamp would let the answer be guessed
const KEY_FIELDS = ['answer', 'why', 'keywords', 'model', 'accept', 'correct', 'rubric', 'minHits', 'tr'];
const check = process.argv.includes('--check');

export function keysRoot() {
  const env = process.env.ASSESSMENT_KEYS;
  if (env && env.trim() && fs.existsSync(path.join(env, 'units'))) return path.resolve(env);
  const sib = path.resolve(ROOT, '..', 'assessment-keys');
  if (fs.existsSync(path.join(sib, 'units'))) return sib;
  return null;
}
const fail = (m) => { console.error(`private-units: ${m}`); process.exit(1); };
const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

export function mergeUnit(pub, keys, where = '') {
  const out = { ...pub };
  for (const kind of ['mc', 'sa', 'fill']) {
    const p = pub[kind] || [];
    const k = keys[kind] || [];
    if (p.length !== k.length) throw new Error(`${where}: ${kind} has ${p.length} public questions but ${k.length} private keys`);
    out[kind] = p.map((q, i) => {
      for (const f of KEY_FIELDS) if (q[f] !== undefined) throw new Error(`${where}: public ${kind} ${i + 1} carries "${f}"; keys belong only in assessment-keys`);
      const extra = Object.fromEntries(Object.entries(k[i]).filter(([f]) => KEY_FIELDS.includes(f)));
      return { ...q, ...extra };
    });
  }
  return out;
}

/** The reverse of mergeUnit: a merged unit -> { pub, keys }. Non-question
 *  fields (e.g. the keys file's "source") are kept from the previous files;
 *  a kind the public file never had is not added to it. */
export function splitUnit(merged, prevPub = {}, prevKeys = {}) {
  const pub = { ...merged };
  const keys = { ...prevKeys };
  for (const kind of ['mc', 'sa', 'fill']) {
    const qs = merged[kind] || [];
    if (qs.length || prevPub[kind] !== undefined) pub[kind] = qs.map((q) => Object.fromEntries(Object.entries(q).filter(([f]) => !KEY_FIELDS.includes(f))));
    else delete pub[kind];
    if (qs.length || prevKeys[kind] !== undefined) keys[kind] = qs.map((q) => Object.fromEntries(Object.entries(q).filter(([f]) => KEY_FIELDS.includes(f) && q[f] !== undefined)));
  }
  return { pub, keys };
}

/** The files a tool must write to change the merged unit `file`
 *  (src/content/units/<Prefix>/<n>.json) to `data`, as [[path, text], ...]:
 *  the keyless twin in units-public, its keys in assessment-keys/units, and
 *  the merged file itself so later reads in the same run agree. A course
 *  without a public twin is written as before. Throws without the keys. */
export function unitWrites(file, data) {
  const abs = path.resolve(file);
  const rel = path.relative(OUT, abs);
  const text = (o) => JSON.stringify(o, null, 1) + '\n';
  const [p, f] = rel.split(path.sep);
  if (rel.startsWith('..') || !f || !fs.existsSync(path.join(PUBLIC, p))) return [[abs, text(data)]];
  const keys = keysRoot();
  if (!keys) throw new Error(`${p} keeps its unit keys in assessment-keys; set ASSESSMENT_KEYS or check it out at ../assessment-keys`);
  const pubFile = path.join(PUBLIC, p, f), keyFile = path.join(keys, 'units', p, f);
  const prev = (x) => (fs.existsSync(x) ? readJson(x) : {});
  const { pub, keys: k } = splitUnit(data, prev(pubFile), prev(keyFile));
  return [[pubFile, text(pub)], [keyFile, text(k)], [abs, text(mergeUnit(pub, k, `${p}/${f}`))]];
}

/** Write a merged unit through unitWrites. Returns the paths written. */
export function writeUnit(file, data) {
  const w = unitWrites(file, data);
  for (const [f, t] of w) { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, t); }
  return w.map(([f]) => f);
}

function main() {
  if (!fs.existsSync(PUBLIC)) return;
  const prefixes = fs.readdirSync(PUBLIC).filter((d) => fs.statSync(path.join(PUBLIC, d)).isDirectory()).sort();
  if (!prefixes.length) return;
  const ignore = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8').split('\n').map((l) => l.trim());
  for (const p of prefixes) {
    if (!ignore.includes(`src/content/units/${p}/`)) fail(`.gitignore must list "src/content/units/${p}/" so its merged keys are never committed`);
  }
  const keys = keysRoot();
  if (!keys) fail(`${prefixes.length} course(s) keep their unit keys in the private assessment-keys repo (${prefixes.join(', ')}). Set ASSESSMENT_KEYS or check it out at ../assessment-keys (it needs units/).`);
  let n = 0;
  for (const p of prefixes) {
    const pubDir = path.join(PUBLIC, p);
    const outDir = path.join(OUT, p);
    const files = fs.readdirSync(pubDir).filter((f) => /^\d+\.json$/.test(f));
    if (!check) fs.mkdirSync(outDir, { recursive: true });
    for (const f of files) {
      const kf = path.join(keys, 'units', p, f);
      if (!fs.existsSync(kf)) fail(`missing private keys ${path.join('units', p, f)}`);
      let merged;
      try { merged = mergeUnit(readJson(path.join(pubDir, f)), readJson(kf), `${p}/${f}`); } catch (e) { fail(e.message); }
      const text = JSON.stringify(merged, null, 1) + '\n';
      const dest = path.join(outDir, f);
      if (check) {
        if (!fs.existsSync(dest) || fs.readFileSync(dest, 'utf8') !== text) fail(`${path.relative(ROOT, dest)} is missing or stale; run node tools/private-units.mjs`);
      } else if (!fs.existsSync(dest) || fs.readFileSync(dest, 'utf8') !== text) fs.writeFileSync(dest, text);
      n++;
    }
    if (!check) for (const f of fs.readdirSync(outDir)) if (!files.includes(f)) fs.rmSync(path.join(outDir, f));
  }
  console.log(`private-units: ${check ? 'checked' : 'merged'} ${n} unit(s) in ${prefixes.length} course(s) from ${path.relative(ROOT, keys) || keys}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
