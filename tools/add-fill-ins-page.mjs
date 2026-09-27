// Fill-in-the-blank questions for the four courses that are not on the unit
// engine -- Counseling, Narrative Preaching, WiseSpeak Preaching and Ethics --
// whose lessons and tests are hand-written HTML pages. Same job and same rules
// as tools/add-fill-ins.mjs, which does this for the engine courses; only
// where the lesson text comes from and where the questions go are different.
//
//   node tools/add-fill-ins-page.mjs --course counseling --lesson 3   the lesson
//                                           text of unit 3, English and Spanish
//   node tools/add-fill-ins-page.mjs --course counseling   check the drafts
//                                           (--units 1,2 checks only those)
//   node tools/add-fill-ins-page.mjs --course counseling --write   check, write
//                                           public/assets/js/fill/<course>.js and
//                                           the review sheet
//
// Drafts: _review/fill-ins/drafts/<course>/<n>.json, ten
//   { prompt: {en, es}, answer: {en, es}, accept?: {en?: [..], es?: [..]} }
// The questions are written to a small data file the page loads with
// public/assets/js/cts-fill.js, not into the pages themselves: the pages are
// half a megabyte or more of hand-written markup, and a data file keeps the
// questions reviewable, diffable and in one place per course.
//
// The grader is read out of public/assets/js/cts-engine.js, as in
// add-fill-ins.mjs, and cts-fill.js must carry the same functions word for
// word (tools/verify-fill-single.mjs checks that).
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

/* Each course: its pages, its units, and where each unit's lesson is. The
   three single-page courses put every unit on one page in <div id="unitN">;
   Ethics has a page per unit. `store` is the name the page already uses for
   its saved state, so the data file lines up with it. */
const COURSES = {
  counseling: { title: 'Counseling (Drakeford)', units: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    page: () => 'CTSCounseling.html', root: (n) => `#unit${n}` },
  narrative: { title: 'Narrative Preaching', units: [1, 2, 3, 4, 5, 6, 7, 8],
    page: () => 'CTS_Narrative_Preaching.html', root: (n) => `#unit${n}` },
  wisespeak: { title: 'WiseSpeak Preaching', units: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    page: () => 'CTS_WiseSpeak_Preaching.html', root: (n) => `#unit${n}` },
  ethics: { title: 'Pastoral & Christian Ethics', units: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    page: (n) => `ethics_unit${String(n).padStart(2, '0')}.html`, root: () => 'body' },
};

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i === -1 ? null : (args[i + 1] ?? ''); };
const course = opt('--course');
const C = COURSES[course];
if (!C) {
  console.error(`usage: add-fill-ins-page.mjs --course <${Object.keys(COURSES).join('|')}> [--lesson <n> | --units a,b | --write]`);
  process.exit(2);
}
const DRAFTS = `_review/fill-ins/drafts/${course}`;
const SHEET = `_review/fill-ins/${course}.md`;
const OUT = `public/assets/js/fill/${course}.js`;

// ---- the engine's grader, taken from the engine ---------------------------
const engine = fs.readFileSync('public/assets/js/cts-engine.js', 'utf8');
const fnSource = (name) => {
  const m = new RegExp(`\\n  function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n  \\}`).exec(engine);
  if (!m) { console.error(`cannot find ${name}() in cts-engine.js`); process.exit(2); }
  return m[0];
};
const { normalise, fillRight } = new Function(
  `${fnSource('normalise')}\n${fnSource('bare')}\n${fnSource('fillRight')}\nreturn { normalise, fillRight };`)();
const norm = (s) => normalise(s).trim();

// ---- the lesson text --------------------------------------------------------
const pages = new Map();
function root(n) {
  const f = C.page(n);
  if (!pages.has(f)) pages.set(f, parse(fs.readFileSync(path.join('public', f), 'utf8')));
  return pages.get(f).querySelector(C.root(n));
}
/* The outermost elements of one language under the unit. Ethics marks <body>
   itself lang-en, so the root's own class does not count. */
function langNodes(r, lang) {
  const out = [];
  const walk = (el) => {
    for (const c of el.childNodes) {
      if (c.nodeType !== 1 || ['SCRIPT', 'STYLE'].includes(c.tagName)) continue;
      if (c.classList?.contains(`lang-${lang}`)) out.push(c); else walk(c);
    }
  };
  walk(r);
  return out;
}
const clean = (s) => s.replace(/\s+/g, ' ').trim();
function lessonText(n, lang) {
  const r = root(n);
  return r ? langNodes(r, lang).map((e) => clean(e.text)).join(' \n ') : '';
}
function unitTitle(n) {
  const r = root(n);
  const h = r && r.querySelector('h1, h2, h3');
  const t = h && langNodes(h, 'en')[0];
  return clean((t || h)?.text || `Unit ${n}`);
}

if (args.includes('--lesson')) {
  const n = Number(opt('--lesson'));
  if (!C.units.includes(n)) { console.error(`${course} has no unit ${n}`); process.exit(2); }
  for (const lang of ['en', 'es']) {
    console.log(`==== ${lang}`);
    for (const e of langNodes(root(n), lang)) { const t = clean(e.text); if (t) console.log(t); }
  }
  process.exit(0);
}

// ---- checking (the rules of add-fill-ins.mjs) --------------------------------
const BLANK = '____';
const words = (s) => norm(s).split(' ').filter(Boolean).length;
const containsWords = (hay, needle) => (' ' + norm(hay) + ' ').includes(' ' + norm(needle) + ' ');

function checkUnit(n, draft) {
  const problems = [];
  if (!Array.isArray(draft)) return [`unit ${n}: draft is not a list`];
  if (draft.length !== 10) problems.push(`unit ${n}: ${draft.length} questions, need 10`);
  const text = { en: lessonText(n, 'en'), es: lessonText(n, 'es') };
  const seen = new Set();
  draft.forEach((q, i) => {
    const at = `unit ${n} q${i + 1}`;
    for (const lang of ['en', 'es']) {
      const p = q?.prompt?.[lang], a = q?.answer?.[lang];
      if (!p || !a) { problems.push(`${at}: no ${lang} sentence or answer`); continue; }
      if (p.split(BLANK).length !== 2) problems.push(`${at}: the ${lang} sentence needs exactly one ${BLANK}`);
      const w = words(a);
      if (w < 1 || w > 4) problems.push(`${at}: the ${lang} answer "${a}" is ${w} words; one to four`);
      if (!containsWords(text[lang], a)) problems.push(`${at}: the ${lang} answer "${a}" is not in the ${lang} lesson text`);
      if (containsWords(p.replace(BLANK, ' '), a)) problems.push(`${at}: the ${lang} answer "${a}" already appears in its own sentence`);
      for (const v of [a, ...(q.accept?.[lang] || [])]) {
        if (!fillRight(q, v)) problems.push(`${at}: the engine would mark "${v}" wrong`);
        if (!fillRight(q, `  ${String(v).toUpperCase()}. `)) problems.push(`${at}: the engine would mark "${v}" wrong in capitals`);
      }
    }
    const key = norm(q?.answer?.en);
    if (seen.has(key)) problems.push(`${at}: the answer "${q.answer.en}" is used twice in this unit`);
    seen.add(key);
    for (const k of Object.keys(q || {})) if (!['prompt', 'answer', 'accept'].includes(k)) problems.push(`${at}: unknown field "${k}"`);
  });
  return problems;
}

// ---- the review sheet ----------------------------------------------------------
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const withAccept = (q, lang) => {
  const alt = q.accept?.[lang] || [];
  return cell(q.answer[lang]) + (alt.length ? ` (${lang === 'es' ? 'también' : 'also'}: ${alt.map(cell).join(', ')})` : '');
};
function sheet(rows) {
  const total = rows.reduce((a, r) => a + r.fill.length, 0);
  let md = `# Fill-in-the-blank questions — ${C.title}\n\n`;
  md += `For review by Dr. Wayne Cook, the course author. Generated by \`tools/add-fill-ins-page.mjs\` `
      + `from the drafts; do not edit this sheet — send corrections and they go into the drafts.\n\n`;
  md += `${rows.length} units, ${total} questions. Each sentence has one gap (____). `
      + `Associate, Th.M. and M.Div. students must get 9 of 10 right in each unit; `
      + `Certificate of Ministry students see them for review only.\n\n`;
  md += `**How answers are marked.** The student's answer must be exactly the answer shown (or an "also" `
      + `alternative), in English or Spanish. Capitals, punctuation, extra spaces and a leading article ("the", "a", "la") are ignored; `
      + `accents and spelling are not. Each answer is marked the moment the student presses Check, and the right answer is then shown.\n`;
  for (const r of rows) {
    md += `\n## Unit ${r.n} — ${cell(r.title)}\n\n`;
    md += `| # | Sentence (English) | Answer (English) | Oración (español) | Respuesta (español) |\n`;
    md += `|---|---|---|---|---|\n`;
    r.fill.forEach((q, i) => {
      md += `| ${i + 1} | ${cell(q.prompt.en)} | ${withAccept(q, 'en')} | ${cell(q.prompt.es)} | ${withAccept(q, 'es')} |\n`;
    });
  }
  return md;
}

// ---- check (and --write) -------------------------------------------------------
const write = args.includes('--write');
const only = opt('--units') ? opt('--units').split(',').map(Number) : null;
if (write && only) { console.error('--write writes the whole course; drop --units'); process.exit(2); }
let problems = [];
const rows = [];
for (const n of C.units) {
  if (only && !only.includes(n)) continue;
  const f = path.join(DRAFTS, `${n}.json`);
  if (!fs.existsSync(f)) { problems.push(`unit ${n}: no draft at ${f}`); continue; }
  let draft;
  try { draft = JSON.parse(fs.readFileSync(f, 'utf8')); }
  catch (e) { problems.push(`unit ${n}: ${f} is not valid JSON: ${e.message}`); continue; }
  const p = checkUnit(n, draft);
  problems = problems.concat(p);
  rows.push({ n, title: unitTitle(n), fill: draft });
  console.log(`${course} unit ${n}: ${Array.isArray(draft) ? draft.length : 0} drafted${p.length ? `, ${p.length} problem(s)` : ', ok'}`);
}
if (problems.length) {
  problems.forEach((p) => console.error('  ' + p));
  console.error(`${problems.length} problem(s); nothing written`);
  process.exit(1);
}
if (!write) { console.log('check passed; add --write to apply'); process.exit(0); }

const data = {};
for (const r of rows) {
  // only the three known fields, in a fixed order, so the file diffs cleanly
  data[r.n] = r.fill.map((q) => ({ prompt: { en: q.prompt.en, es: q.prompt.es },
    answer: { en: q.answer.en, es: q.answer.es }, ...(q.accept ? { accept: q.accept } : {}) }));
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT,
  `/* Fill-in-the-blank questions for ${C.title}, by unit. Written by\n` +
  `   tools/add-fill-ins-page.mjs from _review/fill-ins/drafts/${course}/ --\n` +
  `   change the drafts and re-run it, not this file. Read by cts-fill.js. */\n` +
  `window.CTS_FILL_DATA = window.CTS_FILL_DATA || {};\n` +
  `window.CTS_FILL_DATA[${JSON.stringify(course)}] = ${JSON.stringify(data, null, 1)};\n`);
console.log(`wrote ${rows.length * 10} fill-in questions into ${OUT}`);
fs.writeFileSync(SHEET, sheet(rows));
console.log(`wrote ${SHEET}`);
