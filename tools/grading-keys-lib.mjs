// The grading-key rows: one place that turns the content files into the
// `grading_keys` rows (docs/ai-grading.md, section 4).
//
// Used by tools/sync-grading-keys.mjs (writes them to D1) and by the grader
// eval (tools/eval-lib.mjs keyFor), so the eval hands the model exactly the
// data_json the server reads. Pure file reading: no network, no database.
import { SITE_LANGUAGES } from '../src/lib/languages.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { singleSections, singleRubrics } from './single-pages-lib.mjs';

const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
/* Legacy or newly imported units may carry one generic sentence as the model
 * answer for every question in a language. The original Genesis placeholders
 * were replaced on 15 Oct 2026. Sent to the grader a placeholder reads as
 * a real model answer. A language whose model text repeats on three or more
 * of a unit's questions is left out of the key, so the grader falls back to a
 * language with a real model answer (worker/grading/prompt.js pickText). */
function placeholderModels(sa) {
  const generic = new Set();
  for (const l of SITE_LANGUAGES) {
    const counts = new Map();
    for (const q of sa) { const t = (q.model?.[l] || '').trim(); if (t) counts.set(t, (counts.get(t) || 0) + 1); }
    if ([...counts.values()].some((n) => n >= 3)) generic.add(l);
  }
  return generic;
}
const dropLangs = (model, langs) => (model && langs.size
  ? Object.fromEntries(Object.entries(model).filter(([l]) => !langs.has(l))) : model);
const keepOnly = (obj, fields) => Object.fromEntries(fields.filter((f) => obj[f] !== undefined).map((f) => [f, obj[f]]));

/* A private checkout of the textbook and reading banks, when one is present.
 * ASSESSMENT_KEYS wins. Otherwise a sibling ../assessment-keys that already
 * has textbooks/. Absent means the public content files, so a deploy that
 * does not have the private repo yet keeps grading the banks it has. */
export function resolveKeysRoot(root = '.') {
  const fromEnv = process.env.ASSESSMENT_KEYS;
  if (typeof fromEnv === 'string' && fromEnv.trim() && fs.existsSync(fromEnv)) return path.resolve(fromEnv);
  const sibling = path.resolve(root, '..', 'assessment-keys');
  if (fs.existsSync(path.join(sibling, 'textbooks'))) return sibling;
  return null;
}

/** Every question that is graded, as Map qid -> { qid, kind, source, data (JSON string), rubricVersion }.
 *  `root` is the repo root. `keysRoot` is the private textbook/reading checkout
 *  (resolveKeysRoot when omitted). Pass null to read the public files only.
 *  `warn` receives notes about skipped files. */
export function buildKeyRows({ root = '.', warn = () => {}, keysRoot } = {}) {
  const rows = new Map();
  const add = (qid, kind, source, data, rubricVersion = null) => {
    if (rows.has(qid)) throw new Error(`duplicate question id ${qid}`);
    rows.set(qid, { qid, kind, source, data: JSON.stringify(data), rubricVersion });
  };
  const keys = keysRoot === undefined ? resolveKeysRoot(root) : keysRoot;
  addUnitRows(root, add);
  const catalog = readJson(path.join(root, 'worker/catalog.json'));
  addTestRows(root, catalog, 'src/content/textbooks', 'tb', 'textbook', add, warn, keys);
  addTestRows(root, catalog, 'src/content/readings', 'rd', 'reading', add, warn, keys);
  addSingleRows(root, add);
  return rows;
}

/** Only the reading-test rows (rd:<slug>/...), from `root`'s src/content/readings
 *  and the catalog given (worker/catalog.json shape). For the tests. */
export function readingKeyRows({ root = '.', catalog, keysRoot = null, warn = () => {} }) {
  const rows = new Map();
  addTestRows(root, catalog, 'src/content/readings', 'rd', 'reading', (qid, kind, source, data, rubricVersion = null) => {
    if (rows.has(qid)) throw new Error(`duplicate question id ${qid}`);
    rows.set(qid, { qid, kind, source, data: JSON.stringify(data), rubricVersion });
  }, warn, keysRoot);
  return rows;
}

/** Only the unit rows (u:<Prefix>/<n>/<kind>/<i>), which is all the eval grades. */
export function buildUnitKeyRows({ root = '.' } = {}) {
  const rows = new Map();
  addUnitRows(root, (qid, kind, source, data, rubricVersion = null) => {
    if (rows.has(qid)) throw new Error(`duplicate question id ${qid}`);
    rows.set(qid, { qid, kind, source, data: JSON.stringify(data), rubricVersion });
  });
  return rows;
}

function addUnitRows(root, add) {
  const dir = path.join(root, 'src/content/units');
  for (const prefix of fs.readdirSync(dir).sort()) {
    if (!fs.statSync(path.join(dir, prefix)).isDirectory()) continue;
    for (const f of fs.readdirSync(path.join(dir, prefix)).filter((x) => /^\d+\.json$/.test(x))) {
      const n = Number(f.replace('.json', ''));
      const u = readJson(path.join(dir, prefix, f));
      const base = `u:${prefix}/${n}`;
      (u.mc || []).forEach((q, i) => add(`${base}/mc/${i}`, 'mc', 'unit', { prompt: q.stem, options: q.options, answer: q.answer, why: q.why ?? null }));
      (u.fill || []).forEach((q, i) => add(`${base}/fill/${i}`, 'fill', 'unit', keepOnly(q, ['prompt', 'answer', 'accept'])));
      const generic = placeholderModels(u.sa || []);
      (u.sa || []).forEach((q, i) => add(`${base}/sa/${i}`, 'sa', 'unit',
        { ...keepOnly({ ...q, model: dropLangs(q.model, generic) }, ['prompt', 'model', 'keywords']), rubric: q.rubric ?? null }, q.rubric?.v ?? null));
    }
  }
}

export const hasAnswers = (qs) => Array.isArray(qs) && qs.length > 0 && qs.every((q) => q?.answer && typeof q.answer === 'object' && q.answer.en);

/* Private reading banks (docs/reading-rooms.md, "Private reading tests"). A
 * public src/content/readings/<slug>.json that says `keys: "private"` holds
 * prompts, reading numbers and titles only; answer, accept and the French
 * stamps (tr, which hash the answer) are in <keys>/readings/<slug>.json.
 * The 45 reading tests made before Oct 2026 keep their answers public. */
export const PRIVATE_READING_FIELDS = ['answer', 'accept', 'tr'];
export const isPrivateReading = (pub) => pub?.keys === 'private';

/** What a public reading (or textbook) file for a private bank must not
 *  carry: a list of problems, empty when the file is clean. A private
 *  textbook (keys: "private") follows the same rule. */
export function privateReadingLeaks(pub, where = pub?.slug || 'reading') {
  const out = [];
  if (!isPrivateReading(pub)) out.push(`${where}: a private reading bank must say keys: "private" in its public file`);
  for (const [i, q] of (pub?.test?.questions || []).entries())
    for (const f of PRIVATE_READING_FIELDS) if (q && q[f] !== undefined) out.push(`${where} #${i + 1}: the public file carries "${f}"; it belongs only in assessment-keys`);
  return out;
}

/** A reading test's questions with their keys. A public bank that holds its
 *  answers (the 45 existing tests) is returned as it is. A private one is
 *  joined, question by question, with the private checkout; without it, or
 *  with a private file that does not match, this throws rather than hand on
 *  an answerless bank. `pubOrSlug` is the parsed public file or its slug. */
export function readingQuestions(root, pubOrSlug, warn = () => {}, keysRoot) {
  const pub = typeof pubOrSlug === 'string' ? readJson(path.join(root, 'src/content/readings', `${pubOrSlug}.json`)) : pubOrSlug;
  const publicQs = pub.test?.questions || [];
  if (!isPrivateReading(pub) && hasAnswers(publicQs)) return { reading: pub, questions: publicQs, fromPrivate: false };
  const keys = keysRoot === undefined ? resolveKeysRoot(root) : keysRoot;
  const overlay = overlayQuestions(keys, 'src/content/readings', `${pub.slug}.json`, pub.slug, publicQs, warn);
  if (!overlay || overlay.length !== publicQs.length || !hasAnswers(overlay)) {
    throw new Error(`${pub.slug}.json: reading answers are only in the private assessment-keys checkout (readings/${pub.slug}.json, ${publicQs.length} questions); set ASSESSMENT_KEYS or place ../assessment-keys beside this repo`);
  }
  const questions = publicQs.map((q, i) => ({ ...q, ...keepOnly(overlay[i], ['prompt', 'answer', 'accept', 'reading', 'group', 'tr']) }));
  return { reading: pub, questions, fromPrivate: true };
}

/* textbooks/<file> or readings/<file> in the private checkout. The public
 * file still supplies draw, pass and the catalog code. Question order is the
 * id, so a private file with a different length is ignored while the public
 * bank still has questions: sync deletes a grading_keys row whose qid is
 * gone, and a short file would drop answers students are still graded on.
 * Public textbook banks may omit answer/accept; then the private overlay is
 * required and an answerless public fallback is refused. */
export function overlayQuestions(keysRoot, rel, file, slug, publicQs, warn = () => {}) {
  if (!keysRoot) return null;
  const kind = rel.endsWith('readings') ? 'readings' : 'textbooks';
  const p = path.join(keysRoot, kind, file);
  if (!fs.existsSync(p)) return null;
  let o;
  try { o = readJson(p); } catch (e) { warn(`  ${file}: assessment-keys file does not parse (${e.message}); using the public bank`); return null; }
  if (o.slug && o.slug !== slug) { warn(`  ${file}: assessment-keys slug "${o.slug}" does not match "${slug}"; using the public bank`); return null; }
  const qs = o.test?.questions || o.questions;
  if (!Array.isArray(qs)) { warn(`  ${file}: assessment-keys file has no questions; using the public bank`); return null; }
  if (publicQs.length && qs.length !== publicQs.length) {
    if (!hasAnswers(publicQs)) {
      warn(`  ${file}: assessment-keys has ${qs.length} questions and the public bank has ${publicQs.length}; refusing an answerless public fallback`);
      return null;
    }
    warn(`  ${file}: assessment-keys has ${qs.length} questions and the public bank has ${publicQs.length}; using the public bank so a short file cannot delete grading keys`);
    return null;
  }
  return qs;
}

/** Public textbook file plus private answers when the checkout is present. */
export function textbookQuestions(root, slug, warn = () => {}) {
  const file = `${slug}.json`;
  const pub = readJson(path.join(root, 'src/content/textbooks', file));
  const publicQs = pub.test?.questions || [];
  const overlay = overlayQuestions(resolveKeysRoot(root), 'src/content/textbooks', file, slug, publicQs, warn);
  return { book: pub, questions: overlay || publicQs, fromPrivate: !!overlay };
}

function addTestRows(root, catalog, rel, tag, source, add, warn, keysRoot) {
  const dir = path.join(root, rel);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
    const b = readJson(path.join(dir, f));
    const t = catalog.textbooks[b.slug];
    if (!t || !b.test) { warn(`  skipped ${f}: not a test in worker/catalog.json`); continue; }
    const base = `${tag}:${b.slug}`;
    const publicQs = b.test.questions || [];
    const overlay = overlayQuestions(keysRoot, rel, f, b.slug, publicQs, warn);
    const qs = overlay || publicQs;
    if (tag === 'tb' && !hasAnswers(qs)) {
      throw new Error(`${f}: textbook answers are only in the private assessment-keys checkout; set ASSESSMENT_KEYS or place ../assessment-keys beside this repo`);
    }
    // a private reading bank (keys: "private") the same way: never graded from an answerless public file
    if (tag === 'rd' && !hasAnswers(qs)) {
      throw new Error(`${f}: reading answers are only in the private assessment-keys checkout; set ASSESSMENT_KEYS or place ../assessment-keys beside this repo`);
    }
    add(`${base}/meta/0`, 'meta', source, {
      draw: b.test.draw ?? null, pass: b.test.pass ?? null, perReading: b.test.perReading ?? null, perChapter: b.test.perChapter ?? null,
      n: qs.length, code: t.code, kind: t.kind, page: t.page,
    });
    qs.forEach((q, i) => add(`${base}/fill/${i}`, 'fill', source,
      { ...keepOnly(q, ['prompt', 'answer', 'accept']), group: q.reading ?? q.chapter ?? null }));
  }
}
/* The single-page courses (Counseling, Narrative and WiseSpeak Preaching,
 * Ethics): `sp:<page>/<kind>/<i>`, one scope per graded section, and a meta row
 * `sp:<page>/meta/0` with what a pass records. The questions are read from the
 * pages as they are (tools/single-pages-lib.mjs); the rubrics from
 * src/data/single-rubrics. The key shapes are the unit rows' own. */
function addSingleRows(root, add) {
  const rubrics = singleRubrics(root);
  for (const sec of singleSections({ root })) {
    const base = sec.scope;
    add(`${base}/meta/0`, 'meta', 'single', {
      code: sec.code, course: sec.courseSlug, unit: sec.unit, units: sec.units, page: sec.page, file: sec.file,
      ...(sec.lockMinutes ? { lockMinutes: sec.lockMinutes } : {}),
    });
    sec.mc.forEach((q, i) => add(`${base}/mc/${i}`, 'mc', 'single', { prompt: q.stem, options: q.options, answer: q.answer, why: q.why ?? null }));
    sec.fill.forEach((q, i) => add(`${base}/fill/${i}`, 'fill', 'single', keepOnly(q, ['prompt', 'answer', 'accept'])));
    const generic = placeholderModels(sec.sa);
    sec.sa.forEach((q, i) => {
      const rubric = rubrics[base]?.[i] ?? null;
      add(`${base}/sa/${i}`, 'sa', 'single',
        { ...keepOnly({ ...q, model: dropLangs(q.model, generic) }, ['prompt', 'model', 'keywords']), rubric }, rubric?.v ?? null);
    });
  }
}
