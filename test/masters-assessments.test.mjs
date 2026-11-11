// The master's final synthesis exam and ministry paper as course
// requirements (#318, 11 Nov 2026), as the Worker applies them
// (worker/awards.js assessmentsFor, testCounts, textbookShortfall).
//
//   node test/masters-assessments.test.mjs
//
// Pure functions, no server. Every final and paper ships NOT in force
// (requiredFrom null); these cases give the pilot courses a date through
// ctx.requiredFrom, the stand-in only the test suite uses.

import { register } from 'node:module';
register('data:text/javascript,' + encodeURIComponent(
  `export async function load(url, ctx, next) {
     if (url.endsWith('.json')) return next(url, { ...ctx, importAttributes: { ...ctx.importAttributes, type: 'json' } });
     return next(url, ctx);
   }`));
const A = await import('../worker/awards.js');
const catalog = (await import('../worker/catalog.json')).default;

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

for (const p of PILOT) {
  ok(JSON.stringify(A.assessmentsFor(p.code)) === JSON.stringify([p.final, p.paper]), `${p.code}: its final, then its paper`, A.assessmentsFor(p.code));
  ok(catalog.assessments[p.final].requiredFrom === null && catalog.assessments[p.paper].requiredFrom === null, `${p.code}: final and paper ship NOT in force`);
}
// every final and paper in the catalog ships not in force: nothing changes for anyone until Dr. Cook sets a date
for (const [slug, t] of Object.entries(catalog.assessments)) ok(t.requiredFrom === null, `${slug} ships with requiredFrom null`, t.requiredFrom);
// the textbook tests a course had are unchanged: assessmentsFor is separate from testsFor
ok(!A.testsFor('CTSOTS').some((s) => catalog.assessments[s]), 'testsFor still lists textbook and reading tests only');

/* ---- the acceptance table ---------------------------------------------- */

for (const p of PILOT) {
  // the textbook and reading tests the course also requires, passed, so only the final and paper are in question
  const tests = A.testsFor(p.code);
  const ctxOn = (completions = [], now = after) => ({ requiredFrom: { [p.final]: R, [p.paper]: R }, now, completions });
  const short = (passed, level, ctx) => A.textbookShortfall(p.code, level, [...tests, ...passed], ctx);

  for (const level of ['mdiv', 'thm']) {
    ok(/ministry paper not recorded as passed/.test(short([p.final], level, ctxOn()) || ''), `${p.code} ${level}, activated: final passed, paper not -> not complete`, short([p.final], level, ctxOn()));
    ok(/final synthesis exam not recorded as passed/.test(short([p.paper], level, ctxOn()) || ''), `${p.code} ${level}, activated: paper passed, final not -> not complete`, short([p.paper], level, ctxOn()));
    ok(short([p.final, p.paper], level, ctxOn()) === null, `${p.code} ${level}, activated: both passed -> complete`, short([p.final, p.paper], level, ctxOn()));
    ok(/final synthesis exam/.test(short([], level, ctxOn()) || ''), `${p.code} ${level}, activated: neither -> the final is named first`);
    // before the moment: as today
    ok(short([], level, ctxOn([], before)) === null, `${p.code} ${level}: before activation, nothing is required of the final or paper`);
    // as shipped (null): as today
    ok(short([], level, { now: after, completions: [] }) === null, `${p.code} ${level}: requiredFrom null holds no one`);
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
    ok(short([], level, ctxOn()) === null, `${p.code} ${level}: final and paper are never required`);

  // an unreadable date never lets an item lapse (testCounts' existing rule)
  ok(A.textbookShortfall(p.code, 'mdiv', tests, { requiredFrom: { [p.final]: 'soon', [p.paper]: R }, now: after, completions: [] }) !== null, `${p.code}: an unreadable activation date still holds`);
  // activating only the final holds only the final
  ok(A.textbookShortfall(p.code, 'mdiv', [...tests, p.final], { requiredFrom: { [p.final]: R }, now: after, completions: [] }) === null, `${p.code}: final activated alone -- passing it is enough`);

  /* the whole course: units done, textbook tests passed */
  const units = A.courseUnits(p.slug);
  ok(Array.isArray(units) && units.length > 0, `${p.code}: has units`, units);
  ok(A.courseShortfall(p.slug, units, 'mdiv', tests, ctxOn()) !== null, `${p.code}: course not complete with the units alone once activated`);
  ok(A.courseShortfall(p.slug, units, 'mdiv', [...tests, p.final, p.paper], ctxOn()) === null, `${p.code}: course complete with units, tests, final and paper`);
  ok(/units not recorded/.test(A.courseShortfall(p.slug, units.slice(1), 'mdiv', [...tests, p.final, p.paper], ctxOn()) || ''), `${p.code}: the units still come first`);
  ok(A.courseShortfall(p.slug, units, 'mdiv', tests, { now: after, completions: [] }) === null, `${p.code}: as shipped, the units and tests complete the course, as today`);
}

/* ---- beta's automatic activation never reaches a final or paper -------- */

{
  const { activatedTests } = await import('../worker/test-activation.js');
  const on = activatedTests({ MASTER_TESTS_ACTIVE_FROM: '2026-10-01T00:00:00.000Z' });
  ok(Object.keys(on).length > 0, 'beta activation does activate undated textbook tests (sanity)');
  ok(!Object.keys(on).some((s) => catalog.assessments[s]), 'beta activation never activates a final or paper: only an explicit date does', Object.keys(on).filter((s) => catalog.assessments[s]));
  const { testContext } = await import('../worker/test-context.js');
  const ctx = testContext({ MASTER_TESTS_ACTIVE_FROM: '2026-10-01T00:00:00.000Z' }, []);
  ok(A.textbookShortfall('CTSOTS', 'mdiv', A.testsFor('CTSOTS'), ctx) === null, 'on beta, OT Survey completes without its final and paper', A.textbookShortfall('CTSOTS', 'mdiv', A.testsFor('CTSOTS'), ctx));
}

/* ---- the student record's exemptions list ------------------------------ */

{
  const done = [{ code: 'CTSOTS', track: 'mdiv', completed_at: '2026-11-15T10:00:00.000Z' }];
  const ex = A.exemptionsFor(done, { requiredFrom: { otsfinal: R, otspaper: R } });
  ok(ex.includes('otsfinal') && ex.includes('otspaper'), 'the record lists the exempt final and paper (cts-sync.js keeps them as cts_textbook_<slug>_exempt)', ex);
  ok(A.exemptionsFor(done, {}).filter((s) => catalog.assessments[s]).length === 0, 'as shipped, no final or paper is listed as exempt');
}

if (fails.length) {
  console.error(`masters-assessments: ${fails.length} of ${checks} checks failed`);
  for (const f of fails) console.error('  FAIL ' + f);
  process.exit(1);
}
console.log(`masters-assessments: ${checks} checks pass`);
