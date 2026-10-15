// The grading-key rows: one place that turns the content files into the
// `grading_keys` rows (docs/ai-grading.md, section 4).
//
// Used by tools/sync-grading-keys.mjs (writes them to D1) and by the grader
// eval (tools/eval-lib.mjs keyFor), so the eval hands the model exactly the
// data_json the server reads. Pure file reading: no network, no database.
import fs from 'node:fs';
import path from 'node:path';

const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
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
      (u.sa || []).forEach((q, i) => add(`${base}/sa/${i}`, 'sa', 'unit',
        { ...keepOnly(q, ['prompt', 'model', 'keywords']), rubric: q.rubric ?? null }, q.rubric?.v ?? null));
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
