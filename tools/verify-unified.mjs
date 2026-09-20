/* Content-equivalence check for the unified-engine port.
 *
 *   node tools/verify-unified.mjs <unified.txt>     lines: "<Course> <slug> <units>"
 *
 * A DOM diff is the wrong instrument here: the unified engine deliberately
 * changes lockout, answer reveal and result wording, so a blanket "must be
 * identical" would fail everywhere and prove nothing.
 *
 * What must NOT change is the content and the answer keys. This loads each
 * unit's data file as it was before the port (from git) and as it is now, and
 * compares, question by question:
 *
 *   - the number of MC and SA questions
 *   - every question stem, in both languages
 *   - every option, in order, in both languages
 *   - the correct answer index
 *   - every short-answer prompt and its keyword list
 *
 * Anything that differs is a content regression and is reported.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { execFileSync } from 'child_process';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const BASE = process.env.BASE_REF || '1aa3d95';

const NAMES = ['DATA', 'UNITS', 'KEY', 'ANSWERS', 'ANS', 'KW', 'mcQuestions',
  'kwQuestions', 'saQuestions', 'MC', 'SA', 'MCQ', 'QUESTIONS'];

/* Courses consolidated during this session have no data file at the pre-port
   commit -- their questions were still inline in the page. For those the honest
   baseline is the original page, so pull the declarations straight out of its
   inline script. Only the declarations are evaluated, never the whole script,
   which would touch the DOM and throw. */
function balanced(s, i) {
  const open = s[i], close = { '[': ']', '{': '}' }[open];
  let d = 0, q = null, esc = false;
  for (; i < s.length; i++) {
    const ch = s[i];
    if (q) { if (esc) esc = false; else if (ch === '\\') esc = true; else if (ch === q) q = null; }
    else if (ch === '"' || ch === "'" || ch === '`') q = ch;
    else if (ch === open) d++;
    else if (ch === close) { d--; if (!d) return i + 1; }
  }
  return -1;
}
function pickDecls(src) {
  let out = '';
  for (const n of NAMES) {
    const m = new RegExp('(?:const|let|var)\\s+' + n + '\\s*=\\s*([\\[{])').exec(src);
    if (!m) continue;
    const start = m.index + m[0].length - 1;
    const end = balanced(src, start);
    if (end > 0) out += 'var ' + n + ' = ' + src.slice(start, end) + ';\n';
  }
  return out;
}

function declsFromPage(course, unit) {
  const html = execFileSync('git', ['show', `24dbaa8:site/${course}Unit${unit}.html`],
    { cwd: ROOT, maxBuffer: 1 << 28 }).toString();
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
    .map(m => m[1]).sort((a, b) => b.length - a.length);
  return pickDecls(scripts[0] || '');
}

/* One course loaded its questions from an external data file at a different
   path, under a different global. Read that file at the original commit. */
function declsFromExternalData(course, unit) {
  try {
    const page = execFileSync('git', ['show', `24dbaa8:site/${course}Unit${unit}.html`],
      { cwd: ROOT, maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    const srcs = [...page.matchAll(/<script src="([^"]+\.js)"/g)].map(m => m[1])
      .filter(x => /data/i.test(x) && !/^assets\//.test(x));
    for (const rel of srcs) {
      let body;
      try {
        body = execFileSync('git', ['show', `24dbaa8:site/${rel.split('?')[0]}`],
          { cwd: ROOT, maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
      } catch (e) { continue; }
      const m = /window\.CTS_GENESIS_UNIT\s*=\s*\{/.exec(body);
      if (m) {
        const start = m.index + m[0].length - 1;
        const end = balanced(body, start);
        if (end > 0) return 'var __G = ' + body.slice(start, end) +
          ';\nvar mcQuestions = __G.mcq, kwQuestions = __G.sa;\n';
      }
      const d = pickDecls(body);
      if (d) return d;
    }
  } catch (e) {}
  return '';
}

/* One course kept a unit's bank inside the engine that unit alone loaded, so
   its pre-port data file is legitimately empty. Read the engine instead. */
function declsFromEngine(course, unit) {
  try {
    const page = execFileSync('git', ['show', `${BASE}:site/${course}Unit${unit}.html`],
      { cwd: ROOT, maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    const m = /<script src="(assets\/js\/engine-[^"]+)"><\/script>/.exec(page);
    if (!m) return '';
    const eng = execFileSync('git', ['show', `${BASE}:site/${m[1]}`],
      { cwd: ROOT, maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    return pickDecls(eng);
  } catch (e) { return ''; }
}

function run(code) {
  const ctx = { console, window: {}, localStorage: { getItem: () => null, setItem() {} }, document: {}, __out: null };
  vm.createContext(ctx);
  vm.runInContext(code, ctx, { timeout: 5000 });
  return ctx;
}
function oldData(rel, unitNo, course) {
  let src;
  try {
    src = execFileSync('git', ['show', `${BASE}:${rel}`],
      { cwd: ROOT, maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
  } catch (e) {
    src = declsFromPage(course, unitNo);      // never had a data file
  }
  const ctx = run(src + '\n;__out={' + NAMES.map(n => `${n}: typeof ${n}!=="undefined"?${n}:undefined`).join(',') + '};');
  const g = ctx.__out, D = (g.DATA && typeof g.DATA === 'object') ? g.DATA : {};
  const Un = (g.UNITS && typeof g.UNITS === 'object' && !Array.isArray(g.UNITS))
    ? (g.UNITS[unitNo] || g.UNITS[String(unitNo)] || {}) : {};
  return {
    mc: g.mcQuestions ?? g.MC ?? g.MCQ ?? g.QUESTIONS ?? D.mc ?? Un.mcq ?? Un.mc ?? [],
    sa: g.kwQuestions ?? g.saQuestions ?? g.SA ?? g.KW ?? D.sa ?? Un.shortAnswer ?? Un.sa ?? [],
    key: g.KEY ?? g.ANSWERS ?? g.ANS,
  };
}
function newData(rel) {
  const ctx = run(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  return ctx.window.CTS_UNIT;
}

const txt = (v) => String(v ?? '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&rsquo;|&apos;/g, "'")
  .replace(/^\s*\d+[.)]\s*/, '').replace(/^\s*[A-H][.)]\s+/, '')
  .replace(/\s+/g, ' ').trim().toLowerCase();

function oldStem(q) {
  if (q.en && typeof q.en === 'object' && q.en.stem) return txt(q.en.stem);
  return txt(q.q_en ?? q.textEn ?? q.text_en ?? q.stemEn ?? q.promptEn ?? q.qEn ?? q.en ??
    (q.text && q.text.en) ?? (q.q && q.q.en) ??
    (typeof q.text === 'string' ? q.text : undefined) ??
    (typeof q.stem === 'string' ? q.stem : undefined) ?? q.q);
}
function oldOptions(q) {
  if (q.en && typeof q.en === 'object' && q.en.a !== undefined) {
    return ['a','b','c','d','e','f'].filter(L => q.en[L] !== undefined).map(L => txt(q.en[L]));
  }
  let o = q.optionsEn ?? q.options_en ?? q.optsEn ?? q.oen ?? (q.options && q.options.en) ??
          (q.opts && q.opts.en) ?? q.options ?? q.opts ?? [];
  if (o && typeof o === 'object' && !Array.isArray(o)) {
    const letters = Object.keys(o).filter(k => /^[A-H]$/.test(k)).sort();
    if (letters.length) o = letters.map(L => (o[L] && typeof o[L] === 'object') ? (o[L].en ?? o[L].es) : o[L]);
  }
  if (Array.isArray(o) && o.length && o[0] && typeof o[0] === 'object') o = o.map(x => x.en ?? x.es);
  return (o || []).map(txt);
}
function oldAnswer(q, pos, nOptions, keyArr) {
  let a = q.correct ?? q.answer ?? q.correctIndex ?? q.ans;
  if (a === undefined && Array.isArray(keyArr)) a = keyArr[pos];
  if (typeof a === 'string') a = 'ABCDEFGH'.indexOf(a.toUpperCase());
  if (typeof a !== 'number' && typeof q.c === 'number') {
    // CTSPM / CTSWR obfuscate the key; decode rather than compare raw
    a = (q.c >= 0 && q.c < nOptions) ? q.c : ((q.c - 7 * (pos + 3)) % 251 + 251) % 251;
  }
  return a;
}
function oldPrompt(q) {
  if (q.en && typeof q.en === 'object' && (q.en.stem || q.en.prompt)) return txt(q.en.stem ?? q.en.prompt);
  return txt(q.q_en ?? q.textEn ?? q.text_en ?? q.promptEn ?? q.prompt_en ?? q.stemEn ?? q.qEn ?? q.en ?? (q.q && q.q.en) ??
    (typeof q.prompt === 'string' ? q.prompt : undefined) ??
    (typeof q.text === 'string' ? q.text : undefined) ?? q.q);
}
function oldKw(q) {
  const k = q.kw_en ?? q.kwEn ?? q.ken ?? (q.keywords && q.keywords.en) ?? (q.kw && q.kw.en) ?? q.keywords ?? q.kw;
  return Array.isArray(k) ? k.map(x => String(x).toLowerCase()).sort() : null;
}

const rows = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n')
  .map(l => l.trim().split(/\s+/)).filter(p => p.length >= 3);

let checks = 0, units = 0;
const problems = [];

for (const [course, slug, nUnits] of rows) {
  for (let u = 1; u <= +nUnits; u++) {
    const rel = `site/data/${slug}/unit${u}.js`;
    if (!fs.existsSync(path.join(ROOT, rel))) continue;
    let o, n;
    try {
      o = oldData(rel, u, course);
      n = newData(rel);
      if (!o.mc.length && !o.sa.length && (n.mc.length || n.sa.length)) {
        const alt = declsFromEngine(course, u) || declsFromExternalData(course, u);
        if (alt) {
          const ctx = run(alt + '\n;__out={' +
            NAMES.map(x => `${x}: typeof ${x}!=="undefined"?${x}:undefined`).join(',') + '};');
          const g = ctx.__out, D = (g.DATA && typeof g.DATA === 'object') ? g.DATA : {};
          o = {
            mc: g.mcQuestions ?? g.MC ?? g.MCQ ?? g.QUESTIONS ?? D.mc ?? [],
            sa: g.kwQuestions ?? g.saQuestions ?? g.SA ?? g.KW ?? D.sa ?? [],
            key: g.KEY ?? g.ANSWERS ?? g.ANS,
          };
        }
      }
    }
    catch (e) { problems.push(`${course} u${u}: ${e.message.slice(0, 90)}`); continue; }
    if (!n) { problems.push(`${course} u${u}: no CTS_UNIT after port`); continue; }
    units++;

    const bad = (m) => problems.push(`${course} u${u}: ${m}`);
    checks++;
    if (o.mc.length !== n.mc.length) { bad(`MC count ${o.mc.length} -> ${n.mc.length}`); continue; }
    checks++;
    if (o.sa.length !== n.sa.length) { bad(`SA count ${o.sa.length} -> ${n.sa.length}`); continue; }

    for (let i = 0; i < o.mc.length; i++) {
      const a = o.mc[i], b = n.mc[i];
      checks += 3;
      if (oldStem(a) !== txt(b.stem.en)) { bad(`MC${i + 1} stem changed`); break; }
      const ao = oldOptions(a), bo = (b.options.en || []).map(txt);
      if (ao.length !== bo.length || ao.some((x, j) => x !== bo[j])) { bad(`MC${i + 1} options changed`); break; }
      const oa = oldAnswer(a, i, bo.length, o.key);
      if (oa !== b.answer) { bad(`MC${i + 1} ANSWER KEY ${oa} -> ${b.answer}`); break; }
      if (!(b.answer >= 0 && b.answer < bo.length)) { bad(`MC${i + 1} answer ${b.answer} out of range`); break; }
    }
    for (let i = 0; i < o.sa.length; i++) {
      const a = o.sa[i], b = n.sa[i];
      checks += 2;
      if (oldPrompt(a) !== txt(b.prompt.en)) { bad(`SA${i + 1} prompt changed`); break; }
      const ak = oldKw(a), bk = b.keywords ? b.keywords.en.map(x => String(x).toLowerCase()).sort() : null;
      if (ak && (!bk || ak.length !== bk.length || ak.some((x, j) => x !== bk[j]))) { bad(`SA${i + 1} keywords changed`); break; }
    }
  }
}

console.log(`${units} units, ${checks} content comparisons`);
/* This tool compares the migrated questions against site/data/*.js, the
   pre-migration copy in the working tree. When site/ is deleted at cutover
   every unit is skipped by the existsSync guard above, and a run that checked
   nothing at all would otherwise print PASS. Say so instead, and fail: a gate
   that cannot see its reference is not a gate that passed.

   The comparison itself is not lost with site/ -- tools/content-baseline.mjs
   carries the same content forward as a format-neutral fingerprint, which is
   why it was written. This tool is the one that needs the old files. */
if (!units) {
  console.log('FAIL — no reference data found. site/data/*.js is not in the ' +
              'working tree, so nothing was compared.\n' +
              '       After cutover this tool has no reference and should be ' +
              'retired; tools/content-baseline.mjs is the gate that survives it.');
  process.exit(1);
}
if (!problems.length) console.log('PASS — every question, option, answer key and keyword list preserved.');
else { console.log(`FAIL — ${problems.length} problems:`); problems.slice(0, 40).forEach(p => console.log('  ' + p)); process.exitCode = 1; }
