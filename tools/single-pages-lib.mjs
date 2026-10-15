// The single-page courses -- Counseling, Narrative Preaching, WiseSpeak
// Preaching and Pastoral & Christian Ethics -- read as data.
//
// These courses grade on engines of their own, and their questions live in
// the page's inline script (public/CTSCounseling.html ...) and in
// public/assets/js/fill/<course>.js, not in src/content/units. This module
// reads that data, as it stands, into one normal form that three things share:
//
//   tools/grading-keys-lib.mjs   the `sp:` rows the server grades against
//   tools/single-pages.mjs       the live and shadow builds of the pages
//   tools/verify-rubrics.mjs     the rubric files in src/data/single-rubrics
//
// The pages are not edited: shadow mode serves them exactly as they were.
// Nothing here touches the network or the database.
//
// The scope of a graded section (docs/ai-grading.md, section 2) is
// `sp:<page>`, and its question ids `sp:<page>/<mc|fill|sa>/<i>`:
//
//   ethics        one page per unit      <page> = ethics_unit01 ... ethics_unit10
//   counseling    one page, units 0-10   <page> = CTSCounseling-u0 ... CTSCounseling-u10
//   narrative     one page, units 1-8    <page> = CTS_Narrative_Preaching-u1 ... -u8
//   wisespeak     one page, units 1-10   <page> = CTS_WiseSpeak_Preaching-u1 ... -u10
//
// A unit of a one-page course is a section of the page with its own test, so
// it is its own scope (an attempt, a lock and a pass belong to it).
import fs from 'node:fs';
import path from 'node:path';
import { SINGLES } from '../worker/grading/singles.js';

/* code, course slug, units and lock minutes come from the Worker's own table */
const S = (code) => ({ code, course: SINGLES[code].course, units: SINGLES[code].units,
  ...(SINGLES[code].lockMinutes ? { lockMinutes: SINGLES[code].lockMinutes } : {}) });

export const COURSES = {
  counseling: {
    key: 'counseling', file: 'CTSCounseling.html', folder: 'Counseling', fill: 'counseling', family: 'units',
    ...S('COUNSELING'), page: (n) => `CTSCounseling-u${n}`,
  },
  narrative: {
    key: 'narrative', file: 'CTS_Narrative_Preaching.html', folder: 'NarrativePreaching', fill: 'narrative', family: 'units',
    ...S('STORYTEL'), page: (n) => `CTS_Narrative_Preaching-u${n}`,
  },
  wisespeak: {
    key: 'wisespeak', file: 'CTS_WiseSpeak_Preaching.html', folder: 'WiseSpeak', fill: 'wisespeak', family: 'units',
    ...S('WISESPEAK'), page: (n) => `CTS_WiseSpeak_Preaching-u${n}`,
  },
  ethics: {
    key: 'ethics', files: Array.from({ length: 10 }, (_, i) => `ethics_unit${String(i + 1).padStart(2, '0')}.html`),
    folder: 'Ethics', fill: 'ethics', family: 'ethics',
    ...S('ETHICS'), page: (n) => `ethics_unit${String(n).padStart(2, '0')}`,
  },
};

/** The page files of every course, as { course, file, unit? }. */
export function pageFiles() {
  const out = [];
  for (const c of Object.values(COURSES)) {
    if (c.family === 'ethics') c.files.forEach((file, i) => out.push({ course: c.key, file, unit: i + 1 }));
    else out.push({ course: c.key, file: c.file });
  }
  return out;
}

const read = (f) => fs.readFileSync(f, 'utf8');
const readJson = (f) => JSON.parse(read(f));
const NIX = (s) => String(s ?? '');

/* The inline script that holds a page's questions. */
export function questionScript(html, family) {
  const marker = family === 'ethics' ? 'const mcQuestions' : 'const UNITS = {}';
  for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) if (m[1].includes(marker)) return { code: m[1], index: m.index + '<script>'.length };
  throw new Error(`no inline script holding ${marker}`);
}

/* The question banks of the units pages, evaluated: { n: { mcq, shortAnswer|essays } }. */
function unitsOf(code) {
  const from = code.indexOf('const UNITS = {}');
  const to = code.indexOf('// ============= STATE =============', from);
  if (from < 0 || to < 0) throw new Error('the question data of the page is not where the build expects it');
  return new Function(code.slice(from, to) + '\nreturn UNITS;')();
}
function ethicsOf(code) {
  const mc = new Function(code.slice(code.indexOf('const mcQuestions'), code.indexOf('// Short-answer')) + ';return mcQuestions;')();
  const kwStart = code.indexOf('const kwQuestions');
  const kw = new Function(code.slice(kwStart, code.indexOf('\n];', kwStart) + 3) + ';return kwQuestions;')();
  return { mc, kw };
}
export function fillBank(root, key) {
  const window = {};
  new Function('window', read(path.join(root, `public/assets/js/fill/${key}.js`)))(window);
  return window.CTS_FILL_DATA[key];
}

/* French drafts (tools/french-static-courses.mjs, french-wisespeak.mjs): kept
   only when they line up with the English, question for question. */
function frenchPacket(root, folder, unit) {
  const f = path.join(root, `_review/french/${folder}/${folder}-unit${unit}-fr.json`);
  return fs.existsSync(f) ? readJson(f) : null;
}
const lineUp = (fr, n) => Array.isArray(fr) && fr.length === n;

function withFr(map, fr) { return fr == null || fr === '' ? map : { ...map, fr }; }

/** Every graded section as
 *  { course, page, file, unit, scope, code, courseSlug, units, lockMinutes?,
 *    mc:   [{ stem:{en,es,fr?}, options:{en:[],es:[],fr?:[]}, answer, why:{en,es,fr?} }],
 *    fill: [{ prompt:{...}, answer:{...}, accept?:{...} }],
 *    sa:   [{ prompt:{...}, model:{...}, keywords:{en:[],es:[]} }] }
 *  in page order. `only` limits it to one course key. */
export function singleSections({ root = '.', only = null } = {}) {
  const out = [];
  for (const c of Object.values(COURSES)) {
    if (only && c.key !== only) continue;
    const fills = fillBank(root, c.fill);
    const common = (n) => ({ course: c.key, page: c.page(n), unit: n, scope: `sp:${c.page(n)}`, code: c.code, courseSlug: c.course, units: c.units,
      ...(c.lockMinutes ? { lockMinutes: c.lockMinutes } : {}), file: c.family === 'ethics' ? c.files[n - 1] : c.file });
    if (c.family === 'ethics') {
      c.files.forEach((file, i) => {
        const n = i + 1;
        const { mc, kw } = ethicsOf(questionScript(read(path.join(root, 'public', file)), 'ethics').code);
        const fr = frenchPacket(root, c.folder, n);
        out.push({
          ...common(n),
          mc: mc.map((q, j) => {
            const f = lineUp(fr?.mc, mc.length) && fr.mc[j].options?.length === q.optionsEn.length ? fr.mc[j] : null;
            return { stem: withFr({ en: q.textEn, es: q.textEs }, f?.stem),
              options: { en: q.optionsEn, es: q.optionsEs, ...(f ? { fr: f.options } : {}) }, answer: q.correct,
              why: withFr({ en: q.explanationEn, es: q.explanationEs }, f?.why) };
          }),
          fill: frFill(fills[n] || [], fr),
          sa: kw.map((q, j) => {
            const f = lineUp(fr?.sa, kw.length) ? fr.sa[j] : null;
            return { prompt: withFr({ en: q.textEn, es: q.textEs }, f?.prompt), model: withFr({ en: q.modelEn, es: q.modelEs }, f?.model),
              keywords: { en: q.kw_en || [], es: q.kw_es || [] } };
          }),
        });
      });
      continue;
    }
    const units = unitsOf(questionScript(read(path.join(root, 'public', c.file)), 'units').code);
    for (const n of c.units) {
      const u = units[n];
      if (!u) throw new Error(`${c.file} has no unit ${n}`);
      const fr = frenchPacket(root, c.folder, n);
      const written = u.shortAnswer || u.essays || [];
      out.push({
        ...common(n),
        mc: u.mcq.map((q, j) => {
          const f = lineUp(fr?.mc, u.mcq.length) && fr.mc[j].options?.length === q.options.length ? fr.mc[j] : null;
          return { stem: withFr({ en: q.textEn, es: q.textEs }, f?.stem),
            options: { en: q.options.map((o) => o.en), es: q.options.map((o) => o.es), ...(f ? { fr: f.options } : {}) }, answer: q.correct,
            why: withFr({ en: q.explainEn, es: q.explainEs }, f?.why) };
        }),
        fill: frFill(fills[n] || [], fr),
        sa: written.map((q, j) => {
          const f = lineUp(fr?.sa, written.length) ? fr.sa[j] : null;
          // Counseling: textEn/modelEn. Narrative and WiseSpeak: promptEn, and the rubricEn
          // that shows the student what a strong answer holds -- its model answer.
          const prompt = { en: q.textEn ?? q.promptEn, es: q.textEs ?? q.promptEs };
          const model = { en: q.modelEn ?? q.rubricEn, es: q.modelEs ?? q.rubricEs };
          return { prompt: withFr(prompt, f?.prompt), model: withFr(model, f?.model), keywords: { en: q.kw_en || [], es: q.kw_es || [] } };
        }),
      });
    }
  }
  return out;
}

function frFill(list, fr) {
  const ok = lineUp(fr?.fill, list.length);
  return list.map((q, j) => {
    const o = { prompt: ok ? withFr(q.prompt, fr.fill[j].prompt) : q.prompt, answer: ok ? withFr(q.answer, fr.fill[j].answer) : q.answer };
    if (q.accept || (ok && fr.fill[j].accept?.length)) o.accept = { ...(q.accept || {}), ...(ok && fr.fill[j].accept?.length ? { fr: fr.fill[j].accept } : {}) };
    return o;
  });
}

/* ---- rubrics ---------------------------------------------------------------- */

export const RUBRIC_DIR = 'src/data/single-rubrics';

/** The rubric of every short answer: { scope: [rubric per short answer, in page order] }.
 *  One file per section, src/data/single-rubrics/<course>/<unit>.json, an array
 *  of rubrics (docs/ai-grading.md section 3) in the order of the section's
 *  short answers. A section with no file has none yet. */
export function singleRubrics(root = '.') {
  const out = {};
  for (const c of Object.values(COURSES)) {
    for (const n of c.units) {
      const f = path.join(root, RUBRIC_DIR, c.key, `${n}.json`);
      if (fs.existsSync(f)) out[`sp:${c.page(n)}`] = readJson(f);
    }
  }
  return out;
}

/* ---- the live copy of the data a page carries ------------------------------------ */

/** What a student reads of a section, and nothing else. */
export function publicOf(section) {
  const strip = (m) => m;
  return {
    scope: section.scope,
    mc: section.mc.map((q, i) => ({ qid: `${section.scope}/mc/${i}`, stem: strip(q.stem), options: q.options })),
    fill: section.fill.map((q, i) => ({ qid: `${section.scope}/fill/${i}`, prompt: q.prompt })),
    sa: section.sa.map((q, i) => ({ qid: `${section.scope}/sa/${i}`, prompt: q.prompt })),
  };
}
export { NIX };
