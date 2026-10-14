#!/usr/bin/env node
// Builds the DERIVED parts of the grader eval set, deterministically.
//
//   node tools/eval-build.mjs [--seed cts-eval-1] [--check]
//
// Writes test/eval/gen-*.json:
//   gen-fixture.json         fixture + terse   from test/fixtures/sa-answers.json
//   gen-copied.json          copied            every SA prompt pasted back
//   gen-fill-synonym.json    fill_synonym      an accept entry held out of the key
//   gen-fill-near-miss.json  fill_near_miss    another answer from the same lesson
//   gen-fill-misspelling.json fill_misspelling one-letter typos that should pass
//
// The hand-written parts (half, contradict, padded, translated, injection,
// typos that become other words) live in test/eval/hand-*.json and are not
// touched here. Same inputs and seed give byte-identical output; --check
// rebuilds in memory and fails if the files on disk differ (used by tests).
// Everything is agent-written or derived from agent-written files. No student
// text exists anywhere in this set.
import fs from 'node:fs';
import path from 'node:path';
import {
  ROOT, EVAL_DIR, LANGS, rng, shuffle, sample, bare, wordCount,
  listCourses, listUnits, loadUnit, unitQid,
} from './eval-lib.mjs';

const args = process.argv.slice(2);
const flag = n => args.includes(`--${n}`);
const opt = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : d; };
const SEED = opt('seed', 'cts-eval-1');
const FIXTURE_COURSES = ['CTSMatt', 'CTSJohn', 'CTSActs', 'CTSRomans'];

const mk = (id, qid, kind, lang, answer, expected, category, source, extra = {}) =>
  ({ id, qid, kind, lang, answer, expected, category, source, expected_by: 'agent', ...extra });

// ---- fixture + terse -----------------------------------------------------
function buildFixture() {
  const fx = JSON.parse(fs.readFileSync(path.join(ROOT, 'test/fixtures/sa-answers.json'), 'utf8'));
  const keys = Object.keys(fx).filter(k => k !== '_about').sort((a, b) => {
    const [pa, pb] = [a.split('/'), b.split('/')];
    return pa[0].localeCompare(pb[0]) || (+pa[1] - +pb[1]) || (+pa[2] - +pb[2]);
  });
  const toQid = k => { const [c, u, n] = k.split('/'); return unitQid(c, +u, 'sa', +n - 1); };
  const fixture = [], terseCands = [], esFirst = [];
  for (const k of keys) {
    const qid = toQid(k), e = fx[k], tag = k.replace(/\//g, '.');
    (e.right?.en || []).forEach((a, i) => {
      if (i === 0) fixture.push(mk(`fx.${tag}.en.r0`, qid, 'sa', 'en', a, 'met', 'fixture', 'fixture'));
      else if (wordCount(a) >= 15 && wordCount(a) <= 25) terseCands.push(mk(`terse.${tag}.en.r${i}`, qid, 'sa', 'en', a, 'met', 'terse', 'fixture'));
    });
    (e.right?.es || []).slice(0, 1).forEach(a => esFirst.push(mk(`fx.${tag}.es.r0`, qid, 'sa', 'es', a, 'met', 'fixture', 'fixture')));
    for (const lang of LANGS) (e.wrong?.[lang] || []).forEach((a, i) => fixture.push(mk(`fx.${tag}.${lang}.w${i}`, qid, 'sa', lang, a, 'not_met', 'fixture', 'fixture')));
  }
  const r = rng(SEED + ':fixture');
  const es = sample(esFirst, 60, r).sort((a, b) => a.id.localeCompare(b.id));
  const terse = sample(terseCands, 10, rng(SEED + ':terse')).sort((a, b) => a.id.localeCompare(b.id));
  return [...fixture, ...es, ...terse];
}

// ---- copied ---------------------------------------------------------------
function allSa() {
  const out = [];
  for (const c of listCourses()) for (const n of listUnits(c)) {
    loadUnit(c, n).sa.forEach((q, i) => out.push({ course: c, unit: n, i, qid: unitQid(c, n, 'sa', i), prompt: q.prompt }));
  }
  return out;
}
function buildCopied() {
  const sa = allSa();
  const items = [];
  for (const q of sa.filter(x => FIXTURE_COURSES.includes(x.course))) {
    items.push(mk(`copy.${q.course}.${q.unit}.${q.i}.en`, q.qid, 'sa', 'en', q.prompt.en, 'not_met', 'copied', 'derived'));
  }
  const others = sample(sa.filter(x => !FIXTURE_COURSES.includes(x.course)), 200, rng(SEED + ':copied'));
  others.sort((a, b) => a.qid.localeCompare(b.qid, 'en', { numeric: true }));
  others.forEach((q, idx) => {
    const lang = LANGS[idx % 3];   // 67 en, 67 es, 66 fr
    items.push(mk(`copy.${q.course}.${q.unit}.${q.i}.${lang}`, q.qid, 'sa', lang, q.prompt[lang], 'not_met', 'copied', 'derived'));
  });
  return items;
}

// ---- fill -----------------------------------------------------------------
function allFill() {
  const out = [];
  for (const c of listCourses()) for (const n of listUnits(c)) {
    loadUnit(c, n).fill.forEach((q, i) => out.push({ course: c, unit: n, i, q, qid: unitQid(c, n, 'fill', i) }));
  }
  return out;
}
const forms = (q, lang) => [q.answer?.[lang], ...(q.accept?.[lang] || [])].filter(Boolean);
const allForms = q => LANGS.flatMap(l => forms(q, l));
const letters = s => /^[\p{L}]+$/u.test(s);

function buildFillSynonym(fills) {
  const cands = [];
  for (const f of fills) for (const lang of LANGS) {
    const acc = f.q.accept?.[lang] || [];
    if (acc.length < 2) continue;
    const answerBare = new Set(allForms({ answer: f.q.answer, accept: {} }).map(bare));
    const seen = new Set();
    const good = acc.filter(x => {
      const b = bare(x);
      if (b.length < 3 || answerBare.has(b) || seen.has(b)) return false;
      seen.add(b);
      return true;
    });
    // something else must still be on the list after the hold-out, so the
    // key is not left empty of alternatives for a reason that has nothing to do with the model
    if (good.length) cands.push({ f, lang, good });
  }
  const r = rng(SEED + ':syn');
  // 120 en, 90 es, 90 fr, spread over courses: shuffle, then cap per course.
  const quota = { en: 120, es: 90, fr: 90 }, perCourse = { en: {}, es: {}, fr: {} }, chosen = [];
  for (const c of shuffle(cands, r)) {
    const l = c.lang;
    if (quota[l] <= 0) continue;
    if ((perCourse[l][c.f.course] || 0) >= 6) continue;
    perCourse[l][c.f.course] = (perCourse[l][c.f.course] || 0) + 1;
    quota[l]--;
    const hold = c.good[Math.floor(r() * c.good.length)];
    chosen.push(mk(`syn.${c.f.course}.${c.f.unit}.${c.f.i}.${l}`, c.f.qid, 'fill', l, hold, 'right', 'fill_synonym', 'derived', { holdout: hold }));
  }
  return chosen.sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
}

const shape = s => (/\d/.test(s) ? 'num' : 'alpha') + ':' + Math.min(3, (s.match(/\S+/g) || []).length) + ':' + (/^\p{Lu}/u.test(s) ? 'cap' : 'low');
function buildNearMiss(fills) {
  const byUnit = new Map();
  for (const f of fills) { const k = `${f.course}/${f.unit}`; (byUnit.get(k) || byUnit.set(k, []).get(k)).push(f); }
  const r = rng(SEED + ':near');
  const quota = { en: 80, es: 60, fr: 60 }, perCourse = { en: {}, es: {}, fr: {} }, out = [];
  for (const f of shuffle(fills, r)) {
    const lang = LANGS[Math.floor(r() * 3)];
    if (quota[lang] <= 0 || !f.q.answer?.[lang]) continue;
    if ((perCourse[lang][f.course] || 0) >= 5) continue;
    const mine = new Set(allForms(f.q).map(bare));
    const cand = (byUnit.get(`${f.course}/${f.unit}`) || []).filter(o => o !== f && o.q.answer?.[lang]).map(o => o.q.answer[lang])
      .filter(a => { const b = bare(a); return b.length >= 3 && !mine.has(b) && ![...mine].some(m => m.includes(b) || b.includes(m)); });
    if (!cand.length) continue;
    const same = cand.filter(a => shape(a) === shape(f.q.answer[lang]));
    const pool = same.length ? same : null;       // no weak matches: a near miss should look like the answer
    if (!pool) continue;
    const wrong = pool[Math.floor(r() * pool.length)];
    perCourse[lang][f.course] = (perCourse[lang][f.course] || 0) + 1;
    quota[lang]--;
    out.push(mk(`near.${f.course}.${f.unit}.${f.i}.${lang}`, f.qid, 'fill', lang, wrong, 'wrong', 'fill_near_miss', 'derived'));
  }
  return out.sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
}

function typo(word, r) {
  const w = [...word];
  const inner = w.length - 2;                       // never touch first or last letter
  const pos = 1 + Math.floor(r() * inner);
  const kind = Math.floor(r() * 4);
  const near = { a: 's', e: 'r', i: 'o', o: 'p', u: 'y', s: 'd', t: 'r', n: 'm', r: 'e', l: 'k', d: 's', c: 'v', m: 'n', h: 'g', g: 'f', p: 'o', b: 'v' };
  if (kind === 0) w.splice(pos, 1);                                   // omission
  else if (kind === 1) w.splice(pos, 0, w[pos]);                      // doubled letter
  else if (kind === 2 && w[pos] !== w[pos + 1] && pos + 1 < w.length - 1) [w[pos], w[pos + 1]] = [w[pos + 1], w[pos]]; // swap
  else w[pos] = near[w[pos]] || (w[pos] === 'z' ? 'x' : String.fromCharCode(w[pos].charCodeAt(0) + 1));
  return w.join('');
}
function buildMisspelling(fills) {
  const r = rng(SEED + ':typo');
  const quota = { en: 32, es: 24, fr: 24 }, out = [];
  for (const f of shuffle(fills, r)) {
    const lang = LANGS[Math.floor(r() * 3)];
    const ans = f.q.answer?.[lang];
    if (quota[lang] <= 0 || !ans || !letters(ans) || ans.length < 6 || ans.length > 14) continue;
    const t = typo(ans, r);
    const known = new Set(allForms(f.q).map(bare));
    if (t === ans || known.has(bare(t))) continue;
    quota[lang]--;
    out.push(mk(`typo.${f.course}.${f.unit}.${f.i}.${lang}`, f.qid, 'fill', lang, t, 'right', 'fill_misspelling', 'derived', { note: `one-letter typo of "${ans}"` }));
  }
  return out.sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
}

// ---- main -------------------------------------------------------------------
const fills = allFill();
const files = {
  'gen-fixture.json': buildFixture(),
  'gen-copied.json': buildCopied(),
  'gen-fill-synonym.json': buildFillSynonym(fills),
  'gen-fill-near-miss.json': buildNearMiss(fills),
  'gen-fill-misspelling.json': buildMisspelling(fills),
};
let bad = 0;
for (const [name, items] of Object.entries(files)) {
  const text = JSON.stringify(items, null, 1) + '\n';
  const p = path.join(EVAL_DIR, name);
  if (flag('check')) {
    if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== text) { console.error(`STALE ${name}: rerun tools/eval-build.mjs`); bad++; }
  } else {
    fs.mkdirSync(EVAL_DIR, { recursive: true });
    fs.writeFileSync(p, text);
    console.log(`${name}: ${items.length} items`);
  }
}
if (bad) process.exit(1);
