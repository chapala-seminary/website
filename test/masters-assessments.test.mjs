// The master's ministry paper as a course requirement (#318), as the Worker
// applies it (worker/awards.js assessmentsFor, testCounts, textbookShortfall).
// Dr. Cook, 12 Nov 2026: the paper only -- a course's final synthesis exam is
// never required -- and a three-course pilot first (src/data/paper-pilot.json).
//
//   node test/masters-assessments.test.mjs
//
// Pure functions, no server. Every paper ships NOT in force (requiredFrom
// null); these cases give the pilot courses a date through ctx.requiredFrom,
// the stand-in only the test suite uses. The final is dated in them too, to
// show a date never makes a final required.

import { register } from 'node:module';
register('data:text/javascript,' + encodeURIComponent(
  `export async function load(url, ctx, next) {
     if (url.endsWith('.json')) return next(url, { ...ctx, importAttributes: { ...ctx.importAttributes, type: 'json' } });
     return next(url, ctx);
   }`));
const A = await import('../worker/awards.js');
const catalog = (await import('../worker/catalog.json')).default;
const fs = await import('node:fs');
// shipped NOT in force (null) -- or, once Dr. Cook dates one with
// tools/activate-required.mjs, the moment it recorded, and nothing else
const SCHED = fs.existsSync('src/data/required-from.json') ? JSON.parse(fs.readFileSync('src/data/required-from.json', 'utf8')) : {};

let checks = 0;
const fails = [];
function ok(cond, label, detail) {
  checks++;
  if (!cond) fails.push(label + (detail !== undefined ? `\n        ${JSON.stringify(detail)}` : ''));
}

const R = '2026-12-01T00:00:00.000Z';                       // a prospective activation
const before = '2026-11-20T12:00:00.000Z', after = '2026-12-05T12:00:00.000Z';
const PILOT = [
  { code: 'CTSOTS', slug: 'ots', final: 'otsfinal', paper: 'otspaper' },
  { code: 'CTSHERMENEUTICS', slug: 'hermeneutics', final: 'hermeneuticsfinal', paper: 'hermeneuticspaper' },
  { code: 'CTSPM', slug: 'pm', final: 'pmfinal', paper: 'pmpaper' },
];

/* ---- what each pilot course has ---------------------------------------- */

const PILOT_LIST = JSON.parse(fs.readFileSync('src/data/paper-pilot.json', 'utf8')).papers;
ok(JSON.stringify([...PILOT_LIST].sort()) === JSON.stringify(PILOT.map((p) => p.paper).sort()), 'the pilot is Old Testament Survey, Hermeneutics and Pastoral Ministries', PILOT_LIST);
for (const p of PILOT) {
  ok(JSON.stringify(A.assessmentsFor(p.code)) === JSON.stringify([p.paper]), `${p.code}: its paper only, never its final`, A.assessmentsFor(p.code));
  ok(catalog.assessments[p.final]?.kind === 'final', `${p.code}: the final still exists as an optional exam`);
}
// no course lists a final among what it requires
for (const t of Object.values(catalog.assessments)) if (t.kind === 'final') ok(!A.assessmentsFor(t.code).some((s) => catalog.assessments[s].kind === 'final'), `${t.code}: no final among its requirements`);
// every paper ships not in force, unless it is a pilot paper with its recorded moment; a final is never dated
for (const [slug, t] of Object.entries(catalog.assessments)) {
  if (t.kind === 'final') ok(t.requiredFrom === null, `${slug}: a final is never dated`, t.requiredFrom);
  else ok(t.requiredFrom === (SCHED[slug] ?? null) && (t.requiredFrom === null || PILOT_LIST.includes(slug)), `${slug}: requiredFrom is null, or its recorded moment on a pilot paper`, t.requiredFrom);
}
for (const kind of ['finals', 'papers'])
  for (const f of fs.readdirSync(`src/content/${kind}`).filter((x) => x.endsWith('.json'))) {
    const r = JSON.parse(fs.readFileSync(`src/content/${kind}/${f}`, 'utf8'));
    ok(kind === 'finals' ? r.requiredFrom === null : (r.requiredFrom === null || (SCHED[r.slug] === r.requiredFrom && PILOT_LIST.includes(r.slug))), `${r.slug}: requiredFrom ${r.requiredFrom} is not allowed`);
  }
// the textbook tests a course had are unchanged: assessmentsFor is separate from testsFor
ok(!A.testsFor('CTSOTS').some((s) => catalog.assessments[s]), 'testsFor still lists textbook and reading tests only');

/* ---- the acceptance table ---------------------------------------------- */

for (const p of PILOT) {
  // the textbook and reading tests the course also requires, passed, so only the paper is in question
  const tests = A.testsFor(p.code);
  const ctxOn = (completions = [], now = after) => ({ requiredFrom: { [p.final]: R, [p.paper]: R }, now, completions });
  const short = (passed, level, ctx) => A.textbookShortfall(p.code, level, [...tests, ...passed], ctx);

  for (const level of ['mdiv', 'thm']) {
    ok(/ministry paper not recorded as passed/.test(short([], level, ctxOn()) || ''), `${p.code} ${level}, activated: no paper -> not complete`, short([], level, ctxOn()));
    ok(/ministry paper not recorded as passed/.test(short([p.final], level, ctxOn()) || ''), `${p.code} ${level}, activated: a final passed is not the paper -> not complete`, short([p.final], level, ctxOn()));
    ok(short([p.paper], level, ctxOn()) === null, `${p.code} ${level}, activated: paper passed, no final -> complete`, short([p.paper], level, ctxOn()));
    ok(!/final/.test(short([], level, ctxOn()) || ''), `${p.code} ${level}, activated: the final is never named`);
    // before the moment: as today
    ok(short([], level, ctxOn([], before)) === null, `${p.code} ${level}: before activation, the paper is not required`);
    // as shipped (null): as today
    ok(short([], level, { requiredFrom: { [p.final]: null, [p.paper]: null }, now: after, completions: [] }) === null, `${p.code} ${level}: requiredFrom null holds no one`);
    // a completion the record held at a master's level before the moment stays complete
    const earlier = [{ code: p.code, track: level, completed_at: '2026-11-15T10:00:00.000Z' }];
    ok(short([], level, ctxOn(earlier)) === null, `${p.code} ${level}: a master's completion from before activation is protected`);
    // in SQLite's own time format too
    ok(short([], level, ctxOn([{ code: p.code, track: level, completed_at: '2026-11-15 10:00:00' }])) === null, `${p.code} ${level}: protected when the record writes SQLite time`);
    // one recorded after the moment is not protected
    ok(short([], level, ctxOn([{ code: p.code, track: level, completed_at: '2026-12-02T00:00:00.000Z' }])) !== null, `${p.code} ${level}: a completion recorded after activation is not protected`);
    // a Certificate or Associate completion from before does not carry a master's exemption up
    for (const low of ['cert', 'assoc', null])
      ok(short([], level, ctxOn([{ code: p.code, track: low, completed_at: '2026-11-15T10:00:00.000Z' }])) !== null, `${p.code} ${level}: a ${low || 'level-unknown'} completion from before is not a master's exemption`);
    // an unreadable time is never "before"
    ok(short([], level, ctxOn([{ code: p.code, track: level, completed_at: 'yesterday' }])) !== null, `${p.code} ${level}: an unreadable completion time protects nothing`);
    // another course's completion protects nothing here
    ok(short([], level, ctxOn([{ code: 'CTSNT', track: level, completed_at: '2026-11-15T10:00:00.000Z' }])) !== null, `${p.code} ${level}: another course's completion protects nothing`);
  }
  // Certificate and Associate: unchanged, activated or not
  for (const level of ['cert', 'assoc'])
    ok(short([], level, ctxOn()) === null, `${p.code} ${level}: the paper is never required`);

  // an unreadable date never lets the paper lapse (testCounts' existing rule)
  ok(A.textbookShortfall(p.code, 'mdiv', tests, { requiredFrom: { [p.paper]: 'soon' }, now: after, completions: [] }) !== null, `${p.code}: an unreadable activation date still holds`);
  // dating only the final holds no one
  ok(A.textbookShortfall(p.code, 'mdiv', tests, { requiredFrom: { [p.final]: R, [p.paper]: null }, now: after, completions: [] }) === null, `${p.code}: a dated final alone holds no one`);

  /* the whole course: units done, textbook tests passed */
  const units = A.courseUnits(p.slug);
  ok(Array.isArray(units) && units.length > 0, `${p.code}: has units`, units);
  ok(A.courseShortfall(p.slug, units, 'mdiv', tests, ctxOn()) !== null, `${p.code}: course not complete with the units alone once activated`);
  ok(A.courseShortfall(p.slug, units, 'mdiv', [...tests, p.paper], ctxOn()) === null, `${p.code}: course complete with units, tests and paper`);
  ok(/units not recorded/.test(A.courseShortfall(p.slug, units.slice(1), 'mdiv', [...tests, p.paper], ctxOn()) || ''), `${p.code}: the units still come first`);
  ok(A.courseShortfall(p.slug, units, 'mdiv', tests, { requiredFrom: { [p.final]: null, [p.paper]: null }, now: after, completions: [] }) === null, `${p.code}: not in force, the units and tests complete the course, as today`);
}

/* ---- beta's automatic activation never reaches a final or paper -------- */

{
  const { activatedTests } = await import('../worker/test-activation.js');
  const on = activatedTests({ MASTER_TESTS_ACTIVE_FROM: '2026-10-01T00:00:00.000Z' });
  ok(Object.keys(on).length > 0, 'beta activation does activate undated textbook tests (sanity)');
  ok(!Object.keys(on).some((s) => catalog.assessments[s]), 'beta activation never activates a final or paper: only an explicit date does', Object.keys(on).filter((s) => catalog.assessments[s]));
  const { testContext } = await import('../worker/test-context.js');
  const ctx = testContext({ MASTER_TESTS_ACTIVE_FROM: '2026-10-01T00:00:00.000Z' }, []);
  ok(A.textbookShortfall('CTSOTS', 'mdiv', A.testsFor('CTSOTS'), ctx) === null, 'on beta, OT Survey completes without its paper', A.textbookShortfall('CTSOTS', 'mdiv', A.testsFor('CTSOTS'), ctx));
}

/* ---- the student record's exemptions list ------------------------------ */

{
  const done = [{ code: 'CTSOTS', track: 'mdiv', completed_at: '2026-11-15T10:00:00.000Z' }];
  const ex = A.exemptionsFor(done, { requiredFrom: { otsfinal: R, otspaper: R } });
  ok(ex.includes('otspaper') && !ex.includes('otsfinal'), 'the record lists the exempt paper, never the final (cts-sync.js keeps it as cts_textbook_<slug>_exempt)', ex);
  ok(A.exemptionsFor(done, { requiredFrom: Object.fromEntries(Object.keys(catalog.assessments).map((s) => [s, null])) }).filter((s) => catalog.assessments[s]).length === 0, 'not in force, no paper is listed as exempt');
}

if (fails.length) {
  console.error(`masters-assessments: ${fails.length} of ${checks} checks failed`);
  for (const f of fails) console.error('  FAIL ' + f);
  process.exit(1);
}
console.log(`masters-assessments: ${checks} checks pass`);
