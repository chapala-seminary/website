// The grading-key rows: one place that turns the content files into the
// `grading_keys` rows (docs/ai-grading.md, section 4).
//
// Used by tools/sync-grading-keys.mjs (writes them to D1) and by the grader
// eval (tools/eval-lib.mjs keyFor), so the eval hands the model exactly the
// data_json the server reads. Pure file reading: no network, no database.
import fs from 'node:fs';
import path from 'node:path';
import { singleSections, singleRubrics } from './single-pages-lib.mjs';

const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
/* Some units carry one generic sentence as the model answer for every
 * question in a language (CTSGenesis English and Spanish: "A strong answer
 * integrates the unit's biblical concepts..."). Sent to the grader it reads as
 * a real model answer. A language whose model text repeats on three or more
 * of a unit's questions is left out of the key, so the grader falls back to a
 * language with a real model answer (worker/grading/prompt.js pickText). */
function placeholderModels(sa) {
  const generic = new Set();
  for (const l of ['en', 'es', 'fr']) {
    const counts = new Map();
    for (const q of sa) { const t = (q.model?.[l] || '').trim(); if (t) counts.set(t, (counts.get(t) || 0) + 1); }
    if ([...counts.values()].some((n) => n >= 3)) generic.add(l);
  }
  return generic;
}
const dropLangs = (model, langs) => (model && langs.size
  ? Object.fromEntries(Object.entries(model).filter(([l]) => !langs.has(l))) : model);
const keepOnly = (obj, fields) => Object.fromEntries(fields.filter((f) => obj[f] !== undefined).map((f) => [f, obj[f]]));

/** Every question that is graded, as Map qid -> { qid, kind, source, data (JSON string), rubricVersion }.
 *  `root` is the repo root. `units: false` skips the unit banks (the eval only needs units, but
 *  the sync tool wants everything). `warn` receives notes about skipped files. */
export function buildKeyRows({ root = '.', warn = () => {} } = {}) {
  const rows = new Map();
  const add = (qid, kind, source, data, rubricVersion = null) => {
    if (rows.has(qid)) throw new Error(`duplicate question id ${qid}`);
    rows.set(qid, { qid, kind, source, data: JSON.stringify(data), rubricVersion });
  };
  addUnitRows(root, add);
  const catalog = readJson(path.join(root, 'worker/catalog.json'));
  addTestRows(root, catalog, 'src/content/textbooks', 'tb', 'textbook', add, warn);
  addTestRows(root, catalog, 'src/content/readings', 'rd', 'reading', add, warn);
  addSingleRows(root, add);
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

function addTestRows(root, catalog, rel, tag, source, add, warn) {
  const dir = path.join(root, rel);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
    const b = readJson(path.join(dir, f));
    const t = catalog.textbooks[b.slug];
    if (!t || !b.test) { warn(`  skipped ${f}: not a test in worker/catalog.json`); continue; }
    const base = `${tag}:${b.slug}`;
    const qs = b.test.questions || [];
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
