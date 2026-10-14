// Shared helpers for the grader eval tools (eval-build, eval-grader,
// eval-blind-sheet, eval-import-human). Pure functions and file reading only:
// no network, no Cloudflare.
//
// An eval item is
//   { id, qid, kind: 'sa'|'fill', lang: 'en'|'es'|'fr', answer,
//     expected: 'met'|'not_met'|'partly'|'pending' (sa) | 'right'|'wrong' (fill),
//     category, source: 'agent'|'fixture'|'derived', expected_by: 'agent',
//     holdout?: string, of?: string, base_category?: string, note?: string }
// `holdout` (fill_synonym only) names an accept entry that the grader must NOT
// be given: the key is built from the content file and then that entry is
// removed, so the answer has to be judged rather than looked up.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const EVAL_DIR = path.join(ROOT, 'test', 'eval');
export const LANGS = ['en', 'es', 'fr'];

// ---- seeded randomness -------------------------------------------------
export function hashSeed(str) {
  let h = 2166136261 >>> 0;
  for (const ch of String(str)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}
export function rng(seed) {
  let a = typeof seed === 'number' ? seed >>> 0 : hashSeed(seed);
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffle(arr, rand) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
export function sample(arr, n, rand) { return shuffle(arr, rand).slice(0, n); }

// ---- text --------------------------------------------------------------
export const wordCount = s => (String(s).trim().match(/\S+/g) || []).length;
// Same idea as the engine's bare(): fold case and accents, drop punctuation,
// and drop one leading article. Used here only to avoid building eval items
// whose answer the server would match by lookup anyway.
export function bare(s) {
  let t = String(s || '').toLowerCase().normalize('NFD')
    .replace(/ñ/g, 'ñ').replace(/[̀-ͯ]/g, '')
    .replace(/[^\p{L}\p{N}ñ ]+/gu, ' ').replace(/\s+/g, ' ').trim();
  return t.replace(/^(?:a|an|the|el|la|los|las|lo|un|una|unos|unas|le|les|l|une|des) (?=\S)/, '');
}

// ---- content -----------------------------------------------------------
const unitCache = new Map();
export function loadUnit(course, n, root = ROOT) {
  const p = path.join(root, 'src', 'content', 'units', course, `${n}.json`);
  if (!unitCache.has(p)) unitCache.set(p, JSON.parse(fs.readFileSync(p, 'utf8')));
  return unitCache.get(p);
}
export function listCourses(root = ROOT) {
  return fs.readdirSync(path.join(root, 'src', 'content', 'units'), { withFileTypes: true })
    .filter(d => d.isDirectory()).map(d => d.name).sort();
}
export function listUnits(course, root = ROOT) {
  return fs.readdirSync(path.join(root, 'src', 'content', 'units', course))
    .filter(f => /^\d+\.json$/.test(f)).map(f => parseInt(f, 10)).sort((a, b) => a - b);
}
export const unitQid = (course, n, kind, i) => `u:${course}/${n}/${kind}/${i}`;
export function parseQid(qid) {
  const m = /^u:([^/]+)\/(\d+)\/(mc|fill|sa)\/(\d+)$/.exec(qid);
  if (!m) throw new Error(`unsupported qid for eval: ${qid} (only unit qids u:<Prefix>/<n>/<kind>/<i>)`);
  return { course: m[1], unit: +m[2], kind: m[3], index: +m[4] };
}

// The grading key for a qid, in the shape contract §6 gives for
// grading_keys.data_json: {prompt, answer, accept, options?, why?, model,
// keywords, rubric}. The sync tool will produce the same shape from the same
// files; keep this function and that one in step.
export function keyFor(qid, root = ROOT) {
  const { course, unit, kind, index } = parseQid(qid);
  const u = loadUnit(course, unit, root);
  const q = (u[kind] || [])[index];
  if (!q) throw new Error(`no such question: ${qid}`);
  const key = { qid, kind, prompt: q.prompt || q.stem };
  for (const f of ['answer', 'accept', 'options', 'why', 'model', 'keywords', 'rubric', 'sourceLang']) if (q[f] !== undefined) key[f] = q[f];
  key.sourceLang = u.sourceLang || 'en';
  return key;
}
// Apply an item's holdout: remove every accept/answer entry that folds to the
// same text, in every language, so the answer cannot be found by lookup.
export function applyHoldout(key, holdout) {
  if (!holdout) return key;
  const k = JSON.parse(JSON.stringify(key));
  const target = bare(holdout);
  for (const l of Object.keys(k.accept || {})) k.accept[l] = k.accept[l].filter(x => bare(x) !== target);
  return k;
}

// ---- items -------------------------------------------------------------
export function readItemFiles(dir = EVAL_DIR) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
  const items = [];
  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (!Array.isArray(data)) throw new Error(`${f}: expected a JSON array of items`);
    for (const it of data) items.push(it);
  }
  return items;
}
export function loadHumanGrades(who, dir = EVAL_DIR) {
  const p = path.join(dir, 'human', `${who}.json`);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
}
const SA_EXPECT = new Set(['met', 'not_met', 'partly', 'pending']);
const FILL_EXPECT = new Set(['right', 'wrong']);
export function validateItem(it) {
  const errs = [];
  for (const f of ['id', 'qid', 'kind', 'lang', 'answer', 'expected', 'category', 'source', 'expected_by']) if (it[f] === undefined || it[f] === '') errs.push(`missing ${f}`);
  if (!['sa', 'fill'].includes(it.kind)) errs.push('bad kind');
  if (!LANGS.includes(it.lang)) errs.push('bad lang');
  if (!['agent', 'fixture', 'derived'].includes(it.source)) errs.push('bad source');
  if (it.kind === 'sa' && !SA_EXPECT.has(it.expected)) errs.push('bad expected for sa');
  if (it.kind === 'fill' && !FILL_EXPECT.has(it.expected)) errs.push('bad expected for fill');
  if (it.qid) { try { const p = parseQid(it.qid); if (p.kind !== it.kind) errs.push('qid kind != kind'); } catch (e) { errs.push(e.message); } }
  return errs;
}
export function positive(expected) { return expected === 'met' || expected === 'right'; }
