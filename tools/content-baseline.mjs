/* Format-neutral content baseline.
 *
 *   node tools/content-baseline.mjs --write    record what the content is now
 *   node tools/content-baseline.mjs --check    assert it has not changed
 *
 * Why this exists: every check so far has compared the current content against
 * an OLD FORMAT held in git history. That chain works, but it lengthens with
 * each migration and it dies the moment a format is deleted. Stage 2 reshapes
 * these files again, so the useful thing to carry forward is not "the previous
 * file" but the content itself, fingerprinted in a way that does not care what
 * file format it lives in.
 *
 * For each unit it records the number of questions, every answer index, and a
 * digest of each question's normalised text. Text is normalised the same way
 * on both sides -- HTML tags and entities resolved, whitespace collapsed,
 * case folded -- so a reformat is invisible and a wording change is not.
 *
 * Fill-in-the-blank questions are fingerprinted the same way: the prompt and
 * the answer in each language, and the accepted variants. --check also holds
 * two counting rules that do not depend on the recorded baseline:
 *   - a unit that has fill-ins has exactly ten;
 *   - every unit has multiple-choice questions, twenty of them unless the
 *     course is on the short list below of courses written with fewer.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import crypto from 'crypto';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const SITE = path.join(ROOT, 'site');
const OUT = path.join(ROOT, 'tools', 'content-baseline.json');

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: "'",
  lsquo: "'", ldquo: '"', rdquo: '"', mdash: '-', ndash: '-', hellip: '...',
  eacute: 'e', aacute: 'a', iacute: 'i', oacute: 'o', uacute: 'u', ntilde: 'n',
  uuml: 'u', iquest: '?', iexcl: '!' };

function norm(v) {
  return String(v ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? ' ')
    .replace(/&#(\d+);/g, (m, n) => String.fromCharCode(+n))
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')   // fold accents
    .replace(/[^\w\s?!.,;:()/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim().toLowerCase();
}
const digest = (...parts) =>
  crypto.createHash('sha256').update(parts.map(norm).join('\u0001')).digest('hex').slice(0, 16);

function unitFingerprint(U) {
  return {
    mc: U.mc.map(q => ({
      a: q.answer,
      h: digest(q.stem.en, ...(q.options.en || [])),
      hEs: digest(q.stem.es, ...(q.options.es || [])),
    })),
    sa: U.sa.map(q => ({
      h: digest(q.prompt.en),
      k: (q.keywords ? JSON.stringify(q.keywords.en) : '').length,
    })),
    // `accept` is hashed raw (not through norm) so adding a variant shows up
    fill: (U.fill || []).map(q => ({
      h: digest(q.prompt.en, q.answer.en),
      hEs: digest(q.prompt.es, q.answer.es),
      acc: crypto.createHash('sha256').update(JSON.stringify(q.accept || {})).digest('hex').slice(0, 16),
    })),
  };
}

/* Multiple-choice counts that are not twenty, and are meant not to be: the
   courses as written. A course or unit not listed here must have twenty. */
const MC_COUNT = { CTSPentecostal: 7, CTSCS: 10, 'CTSRE/1': 18 };
const FILL_COUNT = 10;
function countProblems(all) {
  const out = [];
  for (const [k, u] of Object.entries(all)) {
    const course = k.split('/')[0];
    const want = MC_COUNT[k] ?? MC_COUNT[course] ?? 20;
    if (!u.mc.length) out.push(`${k}: no multiple-choice questions`);
    else if (u.mc.length !== want) out.push(`${k}: ${u.mc.length} multiple-choice questions, expected ${want}`);
    if (u.fill.length && u.fill.length !== FILL_COUNT) out.push(`${k}: ${u.fill.length} fill-in questions, expected ${FILL_COUNT} or none`);
  }
  return out;
}

/* Reads whichever form the content currently lives in. The whole point of a
   format-neutral baseline is that the gate survives the migration that changes
   the format, so it prefers the Astro collection and falls back to the older
   per-unit scripts. */
function loadAll() {
  const COLL = path.join(ROOT, 'src', 'content', 'units');
  const out = {};

  if (fs.existsSync(COLL)) {
    for (const course of fs.readdirSync(COLL)) {
      const dir = path.join(COLL, course);
      if (!fs.statSync(dir).isDirectory()) continue;
      for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
        const U = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
        out[`${course}/${U.unit}`] = unitFingerprint(U);
      }
    }
    return out;
  }

  const rows = fs.readFileSync(path.join(ROOT, 'tools', 'unified-courses.txt'), 'utf8')
    .trim().split('\n').map(l => l.trim().split(/\s+/));
  for (const [course, slug, n] of rows) {
    for (let u = 0; u <= +n; u++) {
      const f = path.join(SITE, 'data', slug, `unit${u}.js`);
      if (!fs.existsSync(f)) continue;
      const ctx = { window: {}, console };
      vm.createContext(ctx);
      vm.runInContext(fs.readFileSync(f, 'utf8'), ctx);
      const U = ctx.window.CTS_UNIT;
      if (!U) continue;
      out[`${course}/${u}`] = unitFingerprint(U);
    }
  }
  return out;
}

const mode = process.argv[2] || '--check';
const now = loadAll();
const totals = Object.values(now).reduce((a, u) => ({ mc: a.mc + u.mc.length, sa: a.sa + u.sa.length, fill: a.fill + u.fill.length }), { mc: 0, sa: 0, fill: 0 });

if (mode === '--write') {
  fs.writeFileSync(OUT, JSON.stringify({ units: Object.keys(now).length, ...totals, data: now }, null, 0));
  console.log(`recorded ${Object.keys(now).length} units, ${totals.mc} MC, ${totals.sa} SA, ${totals.fill} fill-in -> tools/content-baseline.json`);
} else {
  if (!fs.existsSync(OUT)) { console.error('no baseline recorded; run with --write'); process.exit(2); }
  const base = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  const problems = countProblems(now);
  const keys = new Set([...Object.keys(base.data), ...Object.keys(now)]);
  let compared = 0;
  for (const k of keys) {
    const b = base.data[k], a = now[k];
    if (!b) { problems.push(`${k}: unit is new`); continue; }
    if (!a) { problems.push(`${k}: unit has disappeared`); continue; }
    if (b.mc.length !== a.mc.length) { problems.push(`${k}: MC count ${b.mc.length} -> ${a.mc.length}`); continue; }
    if (b.sa.length !== a.sa.length) { problems.push(`${k}: SA count ${b.sa.length} -> ${a.sa.length}`); continue; }
    for (let i = 0; i < b.mc.length; i++) {
      compared += 3;
      if (b.mc[i].a !== a.mc[i].a) problems.push(`${k}: MC${i + 1} ANSWER ${b.mc[i].a} -> ${a.mc[i].a}`);
      if (b.mc[i].h !== a.mc[i].h) problems.push(`${k}: MC${i + 1} English text changed`);
      if (b.mc[i].hEs !== a.mc[i].hEs) problems.push(`${k}: MC${i + 1} Spanish text changed`);
    }
    for (let i = 0; i < b.sa.length; i++) {
      compared += 2;
      if (b.sa[i].h !== a.sa[i].h) problems.push(`${k}: SA${i + 1} prompt changed`);
      if (b.sa[i].k !== a.sa[i].k) problems.push(`${k}: SA${i + 1} keyword list changed`);
    }
    // a baseline recorded before fill-ins existed has none
    const bf = b.fill || [];
    if (bf.length !== a.fill.length) { problems.push(`${k}: fill-in count ${bf.length} -> ${a.fill.length}`); continue; }
    for (let i = 0; i < bf.length; i++) {
      compared += 3;
      if (bf[i].h !== a.fill[i].h) problems.push(`${k}: fill-in ${i + 1} English prompt or answer changed`);
      if (bf[i].hEs !== a.fill[i].hEs) problems.push(`${k}: fill-in ${i + 1} Spanish prompt or answer changed`);
      if (bf[i].acc !== a.fill[i].acc) problems.push(`${k}: fill-in ${i + 1} accepted answers changed`);
    }
  }
  console.log(`${keys.size} units, ${compared} content comparisons against the recorded baseline`);
  if (!problems.length) console.log('PASS — content is unchanged.');
  else {
    console.log(`FAIL — ${problems.length}:`);
    problems.slice(0, 30).forEach(p => console.log('  ' + p));
    process.exitCode = 1;
  }
}
