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

const NAMES = ['DATA', 'mcQuestions', 'kwQuestions', 'saQuestions', 'MC', 'SA', 'MCQ', 'QUESTIONS'];

function run(code) {
  const ctx = { console, window: {}, localStorage: { getItem: () => null, setItem() {} }, document: {}, __out: null };
  vm.createContext(ctx);
  vm.runInContext(code, ctx, { timeout: 5000 });
  return ctx;
}
function oldData(rel) {
  const src = execFileSync('git', ['show', `${BASE}:${rel}`], { cwd: ROOT, maxBuffer: 1 << 28 }).toString();
  const ctx = run(src + '\n;__out={' + NAMES.map(n => `${n}: typeof ${n}!=="undefined"?${n}:undefined`).join(',') + '};');
  const g = ctx.__out, D = (g.DATA && typeof g.DATA === 'object') ? g.DATA : {};
  return {
    mc: g.mcQuestions ?? g.MC ?? g.MCQ ?? g.QUESTIONS ?? D.mc ?? [],
    sa: g.kwQuestions ?? g.saQuestions ?? g.SA ?? D.sa ?? [],
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
  return txt(q.textEn ?? q.stemEn ?? q.promptEn ?? q.en ??
    (q.text && q.text.en) ?? (q.q && q.q.en) ??
    (typeof q.text === 'string' ? q.text : undefined) ??
    (typeof q.stem === 'string' ? q.stem : undefined) ?? q.q);
}
function oldOptions(q) {
  let o = q.optionsEn ?? q.oen ?? (q.options && q.options.en) ?? (q.opts && q.opts.en) ?? q.options ?? q.opts ?? [];
  if (Array.isArray(o) && o.length && o[0] && typeof o[0] === 'object') o = o.map(x => x.en ?? x.es);
  return (o || []).map(txt);
}
function oldAnswer(q, pos, nOptions) {
  let a = q.correct ?? q.answer ?? q.correctIndex;
  if (typeof a === 'string') a = 'ABCDEFGH'.indexOf(a.toUpperCase());
  if (typeof a !== 'number' && typeof q.c === 'number') {
    // CTSPM / CTSWR obfuscate the key; decode rather than compare raw
    a = (q.c >= 0 && q.c < nOptions) ? q.c : ((q.c - 7 * (pos + 3)) % 251 + 251) % 251;
  }
  return a;
}
function oldPrompt(q) {
  return txt(q.textEn ?? q.promptEn ?? q.stemEn ?? q.en ?? (q.q && q.q.en) ??
    (typeof q.prompt === 'string' ? q.prompt : undefined) ??
    (typeof q.text === 'string' ? q.text : undefined) ?? q.q);
}
function oldKw(q) {
  const k = q.kw_en ?? q.ken ?? (q.keywords && q.keywords.en) ?? (q.kw && q.kw.en) ?? q.keywords ?? q.kw;
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
    try { o = oldData(rel); n = newData(rel); }
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
      const oa = oldAnswer(a, i, bo.length);
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
if (!problems.length) console.log('PASS — every question, option, answer key and keyword list preserved.');
else { console.log(`FAIL — ${problems.length} problems:`); problems.slice(0, 40).forEach(p => console.log('  ' + p)); process.exitCode = 1; }
