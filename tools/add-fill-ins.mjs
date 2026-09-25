// Fill-in-the-blank questions for one course: help draft them from the lesson,
// check them, write them into the unit files, and make a review sheet for the
// course author.
//
//   node tools/add-fill-ins.mjs --course CTS1Peter --lesson 3   the lesson text of
//                                                   unit 3, English and Spanish
//                                                   side by side, to draft from
//   node tools/add-fill-ins.mjs --course CTS1Peter           check the drafts
//                                                   (--units 1,2 checks only those)
//   node tools/add-fill-ins.mjs --course CTS1Peter --write   check, write into
//                                                   src/content/units/<course>/,
//                                                   and write the review sheet
//   node tools/add-fill-ins.mjs --course CTS1Peter --sheet   review sheet only,
//                                                   from the unit files as they are
//
// Modelled on tools/add-short-answer.mjs. The drafts are one file per unit,
// _review/fill-ins/drafts/<course>/<n>.json: an array of ten
//   { prompt: {en, es}, answer: {en, es}, accept?: {en?: [..], es?: [..]} }
// where each prompt has one gap written ____ and each answer is a word or
// short phrase. The wording is a person's (or an AI assistant's) job, working
// from --lesson; the rules below are this tool's. Nothing is written unless
// every unit of the course passes all of them:
//
//   - ten per unit;
//   - one ____ in each language's sentence;
//   - each answer is one to four words and appears in that language's lesson
//     text for the unit, so a student who read the lesson has seen it;
//   - each answer and each accepted alternative is marked right by the
//     engine's own grader -- fillRight() and normalise() are read out of
//     public/assets/js/cts-engine.js, not copied, so the two cannot drift;
//   - the answer is not already sitting in its own sentence.
//
// Wayne Cook reviews the sheet, _review/fill-ins/<course>.md, before any
// further course is drafted.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i === -1 ? null : (args[i + 1] ?? ''); };
const course = opt('--course');
if (!course || !/^[A-Za-z0-9]+$/.test(course)) {
  console.error('usage: add-fill-ins.mjs --course <Course> [--lesson <n> | --write | --sheet]');
  process.exit(2);
}
const UNITS = `src/content/units/${course}`;
const LESSONS = `src/content/lessons/${course}`;
const DRAFTS = `_review/fill-ins/drafts/${course}`;
const SHEET = `_review/fill-ins/${course}.md`;
if (!fs.existsSync(UNITS)) { console.error(`no unit files at ${UNITS}`); process.exit(2); }

// ---- the engine's grader, taken from the engine ---------------------------
const engine = fs.readFileSync('public/assets/js/cts-engine.js', 'utf8');
const fnSource = (name) => {
  const m = new RegExp(`\\n  function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n  \\}`).exec(engine);
  if (!m) { console.error(`cannot find ${name}() in cts-engine.js`); process.exit(2); }
  return m[0];
};
const { normalise, fillRight } = new Function(
  `${fnSource('normalise')}\n${fnSource('fillRight')}\nreturn { normalise, fillRight };`)();
const norm = (s) => normalise(s).trim();

// ---- the course -----------------------------------------------------------
const unitFiles = fs.readdirSync(UNITS).filter((f) => /^\d+\.json$/.test(f))
  .sort((a, b) => parseInt(a) - parseInt(b));
const units = unitFiles.map((f) => ({ file: path.join(UNITS, f), u: JSON.parse(fs.readFileSync(path.join(UNITS, f), 'utf8')) }));

const stripTags = (s) => String(s || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
function lesson(n) {
  const f = path.join(LESSONS, `${n}.json`);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
}
function lessonText(n, lang) {
  const l = lesson(n);
  return l ? l.blocks.map((b) => stripTags(b.text[lang])).join(' \n ') : '';
}

function unitTitle(i) {
  const { u } = units[i];
  return u.unitTitles?.en?.[i] || u.title;
}

// ---- --lesson: the text to draft from --------------------------------------
if (args.includes('--lesson')) {
  const n = opt('--lesson');
  const l = lesson(n);
  if (!l) { console.error(`no lesson ${LESSONS}/${n}.json`); process.exit(2); }
  for (const b of l.blocks) {
    if (!['prose', 'scripture', 'list-item', 'heading'].includes(b.type)) continue;
    console.log(`[${b.id} ${b.type}]`);
    for (const lang of l.langs) if (b.text[lang]) console.log(`  ${lang}: ${stripTags(b.text[lang])}`);
  }
  process.exit(0);
}

// ---- checking --------------------------------------------------------------
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

// ---- the review sheet ------------------------------------------------------
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const withAccept = (q, lang) => {
  const alt = q.accept?.[lang] || [];
  return cell(q.answer[lang]) + (alt.length ? ` (${lang === 'es' ? 'también' : 'also'}: ${alt.map(cell).join(', ')})` : '');
};
function sheet(rows) {
  const total = rows.reduce((a, r) => a + r.fill.length, 0);
  let md = `# Fill-in-the-blank questions — ${course}\n\n`;
  md += `For review by Dr. Wayne Cook, the course author. Generated by \`tools/add-fill-ins.mjs\` `
      + `from the unit files; do not edit this sheet — send corrections and they go into the unit files.\n\n`;
  md += `${rows.length} units, ${total} questions. Each sentence has one gap (____). `
      + `Associate, Th.M. and M.Div. students must get 9 of 10 right in each unit; `
      + `Certificate of Ministry students see them for review only, with the answers shown when they submit.\n\n`;
  md += `**How answers are marked.** The student's answer must be exactly the answer shown (or an "also" `
      + `alternative), in English or Spanish. Capitals, punctuation and extra spaces are ignored; accents and `
      + `spelling are not, so "Pedro", "PEDRO" and "pedro." are all right, but "Pdro" and "Pedro el apóstol" are not.\n\n`;
  md += `**What to check.** For each question: is it fair for a student who read this unit's lesson; is the `
      + `answer the only reasonable one (if not, name the others to accept, or reword); and is the Spanish right.\n`;
  for (const r of rows) {
    md += `\n## ${/^unit\b/i.test(r.title) ? cell(r.title) : `Unit ${r.n} — ${cell(r.title)}`}\n\n`;
    md += `| # | Sentence (English) | Answer (English) | Oración (español) | Respuesta (español) |\n`;
    md += `|---|---|---|---|---|\n`;
    r.fill.forEach((q, i) => {
      md += `| ${i + 1} | ${cell(q.prompt.en)} | ${withAccept(q, 'en')} | ${cell(q.prompt.es)} | ${withAccept(q, 'es')} |\n`;
    });
  }
  return md;
}
function writeSheet(rows) {
  fs.mkdirSync(path.dirname(SHEET), { recursive: true });
  fs.writeFileSync(SHEET, sheet(rows));
  console.log(`wrote ${SHEET}`);
}

if (args.includes('--sheet')) {
  const rows = units.filter(({ u }) => u.fill?.length)
    .map(({ u }) => ({ n: u.unit, title: unitTitle(units.findIndex((x) => x.u === u)), fill: u.fill }));
  if (!rows.length) { console.error(`${course} has no fill-ins yet`); process.exit(1); }
  writeSheet(rows);
  process.exit(0);
}

// ---- check (and --write) -----------------------------------------------------
const write = args.includes('--write');
const only = opt('--units') ? opt('--units').split(',').map(Number) : null;
if (write && only) { console.error('--write writes the whole course; drop --units'); process.exit(2); }
let problems = [];
const rows = [];
units.forEach(({ u }, i) => {
  if (only && !only.includes(u.unit)) return;
  const f = path.join(DRAFTS, `${u.unit}.json`);
  if (!fs.existsSync(f)) { problems.push(`unit ${u.unit}: no draft at ${f}`); return; }
  let draft;
  try { draft = JSON.parse(fs.readFileSync(f, 'utf8')); }
  catch (e) { problems.push(`unit ${u.unit}: ${f} is not valid JSON: ${e.message}`); return; }
  const p = checkUnit(u.unit, draft);
  problems = problems.concat(p);
  rows.push({ n: u.unit, title: unitTitle(i), fill: draft, i });
  console.log(`${course} unit ${u.unit}: ${Array.isArray(draft) ? draft.length : 0} drafted${p.length ? `, ${p.length} problem(s)` : ', ok'}`);
});
if (problems.length) {
  problems.forEach((p) => console.error('  ' + p));
  console.error(`${problems.length} problem(s); nothing written`);
  process.exit(1);
}
if (!write) { console.log('check passed; add --write to apply'); process.exit(0); }

for (const r of rows) {
  const { file, u } = units[r.i];
  // only the three known fields, in a fixed order, so the files diff cleanly
  u.fill = r.fill.map((q) => ({ prompt: { en: q.prompt.en, es: q.prompt.es },
    answer: { en: q.answer.en, es: q.answer.es }, ...(q.accept ? { accept: q.accept } : {}) }));
  fs.writeFileSync(file, JSON.stringify(u, null, 1));
}
console.log(`wrote ${rows.length * 10} fill-in questions into ${UNITS}`);
writeSheet(rows);
