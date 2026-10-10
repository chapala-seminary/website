// The rule for a course's required tests, as the Worker applies it
// (worker/awards.js): a textbook test, a five-reading test, or both (Dr. Cook
// and ChatGPT's authorization, 9 Oct 2026), and the protection of master's
// completions the record already held when a reading test was activated.
//
//   node test/required-tests.test.mjs
//
// Pure functions, no server: every case is stated with the time and the
// record it is judged against. test/api.test.mjs drives the same rule through
// the Worker; tools/verify-required-tests.mjs through the pages.

import { register } from 'node:module';
// worker/awards.js imports worker/catalog.json the way the Worker's bundler
// does, without an import attribute; Node needs to be told it is JSON.
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

const CODE = 'CTSPENTECOSTAL', BOOK = 'pentecostal', READ = 'pentecostalreadings';
const R = '2026-11-01T00:00:00.000Z';                 // the activation, as Robert would set it
const before = '2026-10-20T15:00:00.000Z', after = '2026-11-05T15:00:00.000Z';
const active = (completions = [], now = after) => ({ requiredFrom: { [READ]: R }, now, completions });

/* ---- what the course requires ------------------------------------------- */

ok(JSON.stringify(A.testsFor(CODE)) === JSON.stringify([BOOK, READ]), 'Pentecostalism requires its textbook test and its five-reading test, textbook first', A.testsFor(CODE));
ok(A.textbookFor(CODE) === BOOK, 'its textbook is still "the textbook" for anything that asks for one');
ok(JSON.stringify(A.testsFor('CTSGENESIS')) === '["genesisreadings"]', 'Genesis keeps its one required-reading test');
ok(JSON.stringify(A.testsFor('CTSWR')) === '["wrreadings"]', 'World Religions keeps its one required-reading test');
ok(A.testsFor('CTSPSALMS').length === 0, 'a course with no test requires none');
ok(catalog.textbooks[READ].requiredFrom === null, 'the pilot ships NOT in force: requiredFrom is null until Robert activates it', catalog.textbooks[READ]);
ok(!('requiredFrom' in catalog.textbooks.genesisreadings) && !('requiredFrom' in catalog.textbooks.wrreadings),
  'Genesis and World Religions carry no activation date: they have counted since 4 Oct and still do');
ok(JSON.stringify(catalog.courses.pentecostal.tests) === JSON.stringify([BOOK, READ]), 'the catalog lists both tests on the course');

/* ---- as shipped: the reading test is not in force ----------------------- */

ok(A.textbookShortfall(CODE, 'mdiv', [BOOK]) === null, 'not yet activated: an M.Div. completion needs the textbook test only');
ok(/textbook test/.test(A.textbookShortfall(CODE, 'mdiv', [READ]) || ''), 'not yet activated: a reading pass does not stand in for the textbook test');
ok(A.textbookShortfall('CTSGENESIS', 'thm', []) !== null, 'Genesis is held without its reading test, as before');
ok(A.textbookShortfall('CTSGENESIS', 'thm', ['genesisreadings']) === null, 'and complete with it');

/* ---- in force: both tests, each on its own ------------------------------ */

ok(/required-reading test not recorded as passed: pentecostalreadings/.test(A.textbookShortfall(CODE, 'mdiv', [BOOK], active()) || ''),
  'textbook passed, reading test not: the M.Div. completion is held for the reading test');
ok(/textbook test not recorded as passed: pentecostal$/.test(A.textbookShortfall(CODE, 'mdiv', [READ], active()) || ''),
  'reading test passed, textbook not: held for the textbook test');
ok(A.textbookShortfall(CODE, 'mdiv', [BOOK, READ], active()) === null, 'both passed: the M.Div. completion stands');
ok(A.textbookShortfall(CODE, 'thm', [{ textbook: BOOK }, { textbook: READ }], active()) === null, 'both passed, as record rows: the Th.M. completion stands');
ok(A.textbookShortfall(CODE, 'thm', [], active()) !== null, 'neither passed: held');
for (const level of ['cert', 'associate', null])
  ok(A.textbookShortfall(CODE, level, [], active()) === null, `${level || 'no'} level: Certificate and Associate requirements unchanged -- no test needed`);
ok(A.textbookShortfall(CODE, 'mdiv', [BOOK], active([], before)) === null, 'before the activation moment the reading test does not count yet');
ok(A.textbookShortfall('CTSGENESIS', 'mdiv', ['genesisreadings'], active()) === null, 'an activation date on one test changes nothing about another course');

const units = catalog.courses.pentecostal.units;
ok(/units not recorded/.test(A.courseShortfall('pentecostal', units.slice(1), 'mdiv', [BOOK, READ], active()) || ''), 'units are still required first');
ok(/required-reading/.test(A.courseShortfall('pentecostal', units, 'mdiv', [BOOK], active()) || ''), 'all units and the textbook, no reading test: the certificate is refused');
ok(A.courseShortfall('pentecostal', units, 'mdiv', [BOOK, READ], active()) === null, 'all units and both tests: the certificate is supported');

/* ---- the four student-record cases (9 Oct 2026) ------------------------- */

// Case 1: completed before activation, recorded by the server at a master's level.
const case1 = [{ code: CODE, track: 'mdiv', completed_at: before }];
ok(A.textbookShortfall(CODE, 'mdiv', [BOOK], active(case1)) === null, 'Case 1: a master\'s completion the record held before activation needs no reading test');
ok(A.textbookShortfall(CODE, 'thm', [BOOK], active([{ code: CODE, track: 'thm', completed_at: before }])) === null, 'Case 1 on the Th.M. as well');
ok(/textbook test/.test(A.textbookShortfall(CODE, 'mdiv', [], active(case1)) || ''), 'Case 1 protects from the new test only: the textbook rule of 4 Oct is unchanged');
ok(JSON.stringify(A.exemptionsFor(case1, active())) === JSON.stringify([READ]), 'Case 1: the record names the exemption, for the browser to show', A.exemptionsFor(case1, active()));
ok(A.exemptionsFor(case1).length === 0, 'and names none while the test is not activated');
ok(A.textbookShortfall(CODE, 'mdiv', [BOOK], active([{ code: CODE, track: 'mdiv', completed_at: '2026-10-20 15:00:00' }])) === null,
  'Case 1 with the time as SQLite writes it');
ok(A.textbookShortfall(CODE, 'mdiv', [BOOK], active([{ code: 'CTSPENTECOSTALMDIVCERTIFICATE', track: 'mdiv', completed_at: before }])) === null,
  'Case 1 with an old form of the completion code');

// Case 2: finished before, but the server first heard of it after activation.
ok(A.textbookShortfall(CODE, 'mdiv', [BOOK], active([{ code: CODE, track: 'mdiv', completed_at: after }])) !== null,
  'Case 2: a completion the server recorded after activation needs the reading test');
ok(A.textbookShortfall(CODE, 'mdiv', [BOOK], active([{ code: CODE, track: 'mdiv', completed_at: R }])) !== null,
  'Case 2 at the very moment of activation: not before it, so the test counts');
ok(A.textbookShortfall(CODE, 'mdiv', [BOOK], active([{ code: CODE, track: 'mdiv', completed_at: 'yesterday' }])) !== null,
  'an unreadable time is never "before"');

// Case 3: a Certificate or Associate completion from before, now on a master's track.
for (const track of ['cert', 'assoc', null])
  ok(A.textbookShortfall(CODE, 'mdiv', [BOOK], active([{ code: CODE, track, completed_at: before }])) !== null,
    `Case 3: a ${track || 'level-unknown'} completion from before activation does not excuse the M.Div. student from the reading test`);
ok(A.exemptionsFor([{ code: CODE, track: 'cert', completed_at: before }], active()).length === 0, 'Case 3: no exemption is named');

// Case 4: started, not finished, when the test was activated.
ok(A.textbookShortfall(CODE, 'mdiv', [BOOK], active([])) !== null, 'Case 4: no completion in the record, so the reading test is required');
ok(A.textbookShortfall(CODE, 'mdiv', [BOOK], active([{ code: 'CTSGENESIS', track: 'mdiv', completed_at: before }])) !== null,
  'Case 4: another course finished before does not count for this one');

/* ---- what the pages are given ------------------------------------------- */
{
  const fs = await import('node:fs');
  const js = fs.readFileSync(new URL('../public/assets/js/cts-required-tests.js', import.meta.url), 'utf8');
  const win = {};
  new Function('window', js)(win);
  const m = win.CTS_REQUIRED_TESTS || {};
  ok(JSON.stringify(m[CODE]?.map((t) => t.slug)) === JSON.stringify([BOOK, READ]), 'cts-required-tests.js gives the pages both tests', m[CODE]);
  ok(m[CODE]?.[1]?.requiredFrom === null, 'and the reading test\'s activation, not yet set');
  ok(m.COUNSELING?.[0]?.slug === 'counseling' && m.STORYTEL?.[0]?.slug === 'narrative', 'the single-page courses keep their textbooks');
}

if (fails.length) {
  console.log(`FAIL — ${fails.length} of ${checks} required-test checks:`);
  for (const f of fails) console.log('  - ' + f);
  process.exit(1);
}
console.log(`PASS — ${checks} required-test checks: two tests where a course has two, the four record cases, Certificate and Associate unchanged.`);
