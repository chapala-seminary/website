/* Convert a course from its per-course engine to the unified engine.
 *
 *   node tools/unify.mjs --course CTS1Peter --slug 1peter [--apply]
 *
 * Each unit's data file currently declares bare globals in whatever shape that
 * course happened to use. This loads the file, reads those globals, and rewrites
 * it as one window.CTS_UNIT object in the contract cts-engine.js expects. The
 * page then loads cts-engine.js instead of engine-<slug>.js.
 *
 * Nothing is guessed: if a question bank cannot be mapped, the course is
 * reported and left alone.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const SITE = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'site');
const args = Object.fromEntries(process.argv.slice(2).map((a, i, A) =>
  a.startsWith('--') ? [a.slice(2), A[i + 1] && !A[i + 1].startsWith('--') ? A[i + 1] : true] : []).filter(Boolean));

const NAMES = ['DATA', 'CFG', 'mcQuestions', 'kwQuestions', 'saQuestions', 'MC', 'SA', 'MCQ', 'QUESTIONS',
  'unitTitlesEn', 'unitTitlesEs', 'UNIT', 'UNITS', 'TOTAL_UNITS', 'totalUnits',
  'NEXT_URL', 'NEXT_UNIT_URL', 'NEXT_HREF', 'PREV_URL', 'PREV_UNIT_URL', 'PREV_HREF'];

function loadGlobals(file) {
  const code = fs.readFileSync(file, 'utf8') +
    '\n;__out={' + NAMES.map(n => `${n}: typeof ${n}!=="undefined"?${n}:undefined`).join(',') + '};';
  const ctx = { console, window: {}, localStorage: { getItem: () => null, setItem() {} }, document: {}, __out: null };
  vm.createContext(ctx);
  vm.runInContext(code, ctx, { timeout: 5000 });
  return ctx.__out;
}

const first = (...v) => v.find(x => x !== undefined && x !== null);
const pair = (en, es) => (en === undefined && es === undefined) ? undefined : { en: en ?? '', es: es ?? en ?? '' };
const stripNum = s => typeof s === 'string' ? s.replace(/^\s*\d+[.)]\s*/, '') : s;

function biOf(o, ...bases) {
  for (const b of bases) {
    // Some courses write the English in the bare field and only suffix the
    // Spanish: {text, textEs}. Falling through on a present *Es without
    // checking the bare field silently produced empty English text.
    const bare = typeof o[b] === 'string' ? o[b] : undefined;
    const en = o[b + 'En'] ?? o[b + '_en'] ?? bare, es = o[b + 'Es'] ?? o[b + '_es'];
    if (en !== undefined || es !== undefined) return pair(en, es);
    const v = o[b];
    if (v && typeof v === 'object' && ('en' in v || 'es' in v)) return pair(v.en, v.es);
    if (typeof v === 'string') return pair(v, v);
  }
  return undefined;
}

/* CTSPM and CTSWR hide the answer key behind an offset:
     answerIndex(pos) = ((q.c - 7*(pos+3)) % 251 + 251) % 251
   Reading q.c as the index would silently give every question the wrong
   answer, so decode it. The caller passes the question's position. */
function decodeC(q, pos, nOptions) {
  if (typeof q.c !== 'number') return undefined;
  if (q.c >= 0 && q.c < nOptions) return q.c;            // plain index
  const d = ((q.c - 7 * (pos + 3)) % 251 + 251) % 251;
  return (d >= 0 && d < nOptions) ? d : undefined;
}

function mapMC(q, pos) {
  // compact shape used by a few courses: {en,es,oen,oes,c,xen,xes}
  if (typeof q.en === 'string' && Array.isArray(q.oen)) {
    let answer = first(q.correct, q.answer);
    if (typeof answer === 'string') answer = 'ABCDEFGH'.indexOf(answer.toUpperCase());
    if (typeof answer !== 'number') answer = decodeC(q, pos, q.oen.length);
    if (typeof answer !== 'number' || answer < 0 || answer >= q.oen.length) return null;
    return {
      stem: pair(stripNum(q.en), stripNum(q.es)),
      options: { en: q.oen, es: Array.isArray(q.oes) ? q.oes : q.oen },
      answer,
      ...(q.xen !== undefined ? { why: pair(q.xen, q.xes) } : {}),
    };
  }
  const stemRaw = biOf(q, 'stem', 'text', 'prompt', 'q');
  if (!stemRaw) return null;
  const stem = { en: stripNum(stemRaw.en), es: stripNum(stemRaw.es) };
  let oEn = q.optionsEn ?? (q.options && q.options.en) ?? (q.opts && q.opts.en) ??
            (Array.isArray(q.options) ? q.options : undefined) ?? (Array.isArray(q.opts) ? q.opts : undefined);
  let oEs = q.optionsEs ?? (q.options && q.options.es) ?? (q.opts && q.opts.es) ?? oEn;
  // some courses give one array of {en,es} per option rather than two arrays
  if (Array.isArray(oEn) && oEn.length && oEn[0] && typeof oEn[0] === 'object' &&
      ('en' in oEn[0] || 'es' in oEn[0])) {
    oEs = oEn.map(o => o.es ?? o.en);
    oEn = oEn.map(o => o.en ?? o.es);
  }
  if (!Array.isArray(oEn)) return null;
  // a few courses bake the letter into the option text ("A. Paul the Apostle"),
  // sometimes out of order; the engine labels options itself, so strip them
  const labelled = a => Array.isArray(a) && a.length > 1 &&
    a.every(x => typeof x === 'string' && /^\s*[A-H][.)]\s+/.test(x));
  if (labelled(oEn)) oEn = oEn.map(x => x.replace(/^\s*[A-H][.)]\s+/, ''));
  if (labelled(oEs)) oEs = oEs.map(x => x.replace(/^\s*[A-H][.)]\s+/, ''));
  let answer = first(q.correct, q.answer, q.correctIndex);
  if (typeof answer === 'string') answer = 'ABCDEFGH'.indexOf(answer.toUpperCase());
  if (typeof answer !== 'number') answer = decodeC(q, pos, oEn.length);
  if (typeof answer !== 'number' || answer < 0 || answer >= oEn.length) return null;
  const why = biOf(q, 'explanation', 'expl', 'why', 'exp', 'correctFeedback', 'feedback');
  return {
    stem,
    options: { en: oEn, es: Array.isArray(oEs) ? oEs : oEn },
    answer,
    ...(why ? { why } : {}),
  };
}

function mapSA(q) {
  if (typeof q.en === 'string' && (q.men !== undefined || q.ken !== undefined)) {
    return {
      prompt: pair(stripNum(q.en), stripNum(q.es)),
      ...(Array.isArray(q.ken) ? { keywords: { en: q.ken, es: Array.isArray(q.kes) ? q.kes : q.ken } } : {}),
      ...(q.men !== undefined ? { model: pair(q.men, q.mes) } : {}),
    };
  }
  const promptRaw = biOf(q, 'prompt', 'stem', 'text', 'q');
  if (!promptRaw) return null;
  const prompt = { en: stripNum(promptRaw.en), es: stripNum(promptRaw.es) };
  const kEn = q.kw_en ?? (q.keywords && q.keywords.en) ?? (q.kw && q.kw.en) ??
              (Array.isArray(q.keywords) ? q.keywords : undefined) ?? (Array.isArray(q.kw) ? q.kw : undefined);
  const kEs = q.kw_es ?? (q.keywords && q.keywords.es) ?? (q.kw && q.kw.es) ?? kEn;
  const model = biOf(q, 'model', 'answer', 'explanation');
  return {
    prompt,
    ...(Array.isArray(kEn) ? { keywords: { en: kEn, es: Array.isArray(kEs) ? kEs : kEn } } : {}),
    ...(model ? { model } : {}),
  };
}

const course = args.course, slug = args.slug;
if (!course || !slug) { console.error('need --course and --slug'); process.exit(2); }

const unitFiles = fs.readdirSync(SITE)
  .map(f => f.match(new RegExp('^' + course + 'Unit(\\d+)\\.html$')))
  .filter(Boolean).map(m => ({ n: +m[1], file: m[0] })).sort((a, b) => a.n - b.n);
if (!unitFiles.length) { console.error('no units for ' + course); process.exit(2); }

const total = unitFiles.length;
const built = [];
const problems = [];

for (const { n, file } of unitFiles) {
  const dataFile = path.join(SITE, 'data', slug, `unit${n}.js`);
  if (!fs.existsSync(dataFile)) { problems.push(`unit ${n}: no data file (still inline)`); continue; }
  let g;
  try { g = loadGlobals(dataFile); }
  catch (e) { problems.push(`unit ${n}: data file will not evaluate — ${e.message}`); continue; }

  const D = g.DATA && typeof g.DATA === 'object' ? g.DATA : {};
  const rawMC = first(g.mcQuestions, g.MC, g.MCQ, g.QUESTIONS, D.mc) || [];
  const rawSA = first(g.kwQuestions, g.saQuestions, g.SA, D.sa) || [];
  const mc = rawMC.map((q, i) => mapMC(q, i)), sa = rawSA.map(mapSA);
  if (rawMC.length && mc.some(x => x === null)) { problems.push(`unit ${n}: ${mc.filter(x => !x).length}/${mc.length} MC unmapped`); continue; }
  if (rawSA.length && sa.some(x => x === null)) { problems.push(`unit ${n}: ${sa.filter(x => !x).length}/${rawSA.length} SA unmapped`); continue; }
  if (!mc.length && !sa.length) { problems.push(`unit ${n}: no questions found`); continue; }

  built.push({
    n, file, dataFile,
    obj: {
      course: slug, unit: n, totalUnits: total, filePrefix: course,
      prevHref: n > 1 ? `${course}Unit${n - 1}.html` : null,
      nextHref: first(g.NEXT_URL, g.NEXT_UNIT_URL, g.NEXT_HREF,
        n < total ? `${course}Unit${n + 1}.html` : null) ?? null,
      ...(Array.isArray(g.unitTitlesEn) ? { unitTitles: { en: g.unitTitlesEn, es: g.unitTitlesEs || g.unitTitlesEn } } : {}),
      mc, sa,
    },
  });
}

console.log(`${course}: ${built.length}/${total} units mappable` +
  (problems.length ? `\n  problems:\n    ${problems.join('\n    ')}` : ''));
console.log(`  totals: ${built.reduce((a, b) => a + b.obj.mc.length, 0)} MC, ${built.reduce((a, b) => a + b.obj.sa.length, 0)} SA`);

if (!args.apply) { console.log('  (analysis only — pass --apply to write)'); process.exit(problems.length ? 1 : 0); }
if (problems.length) { console.error('  refusing to write: unmapped units'); process.exit(1); }

for (const b of built) {
  fs.writeFileSync(b.dataFile,
    `/* ${course} — unit ${b.n}. Content only; all policy lives in cts-engine.js. */\n` +
    `window.CTS_UNIT = ${JSON.stringify(b.obj, null, 1)};\n`);
  const p = path.join(SITE, b.file);
  let html = fs.readFileSync(p, 'utf8');
  html = html.replace(/<script src="assets\/js\/engine-[^"]+"><\/script>/,
                      '<script src="assets/js/cts-engine.js"></script>');
  fs.writeFileSync(p, html);
}
console.log(`  wrote ${built.length} data files and repointed ${built.length} pages`);
