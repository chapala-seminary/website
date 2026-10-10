// A required-reading test on a single-page course (Preaching / WiseSpeak):
// the catalog generator and the award rule, before any such test is
// installed (10 Oct 2026). The eight proposed reading banks are staged in
// src/data/readings/staged/ and are not imported; this test installs a
// stand-in for Preaching in a scratch copy of the repo, never in the tree.
//
//   node test/single-page-readings.test.mjs
//
// Pure Node, no server, no writes to the working tree.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { register } from 'node:module';

register('data:text/javascript,' + encodeURIComponent(
  `export async function load(url, ctx, next) {
     if (url.endsWith('.json')) return next(url, { ...ctx, importAttributes: { ...ctx.importAttributes, type: 'json' } });
     return next(url, ctx);
   }`));

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let checks = 0;
const fails = [];
function ok(cond, label, detail) {
  checks++;
  if (!cond) fails.push(label + (detail !== undefined ? `\n        ${JSON.stringify(detail)}` : ''));
}

/* A scratch copy holding what the generator reads and writes. The large
   content folders it only reads are linked, not copied. */
function scratch(readings) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-single-readings-'));
  fs.mkdirSync(path.join(dir, 'src/content'), { recursive: true });
  for (const d of fs.readdirSync(path.join(ROOT, 'src/content')))
    if (d !== 'readings') fs.symlinkSync(path.join(ROOT, 'src/content', d), path.join(dir, 'src/content', d));
  fs.cpSync(path.join(ROOT, 'src/content/readings'), path.join(dir, 'src/content/readings'), { recursive: true });
  for (const [name, json] of Object.entries(readings))
    fs.writeFileSync(path.join(dir, 'src/content/readings', name), JSON.stringify(json));
  fs.cpSync(path.join(ROOT, 'public'), path.join(dir, 'public'), { recursive: true });
  fs.cpSync(path.join(ROOT, 'worker'), path.join(dir, 'worker'), { recursive: true });
  return dir;
}
const gen = (dir) => spawnSync(process.execPath, [path.join(ROOT, 'tools/gen-worker-catalog.mjs')], { cwd: dir, encoding: 'utf8' });

const WS = 'wisespeakreadings';
const preaching = { slug: WS, page: 'CTSPreachingReadings', course: 'CTS_WiseSpeak_Preaching', kind: 'reading',
  title: { en: 'Preaching required readings', es: 'Lecturas requeridas de Predicación' }, requiredFrom: null };

/* ---- the generator --------------------------------------------------------- */

const before = JSON.parse(fs.readFileSync(path.join(ROOT, 'worker/catalog.json'), 'utf8'));
const dir = scratch({ [`${WS}.json`]: preaching });
const run = gen(dir);
ok(run.status === 0, 'the generator accepts a reading test on the single-page Preaching course', run.stderr);
const cat = JSON.parse(fs.readFileSync(path.join(dir, 'worker/catalog.json'), 'utf8'));
ok(cat.textbooks[WS]?.code === 'WISESPEAK' && cat.textbooks[WS]?.kind === 'reading', 'it is carried under Preaching\'s completion code WISESPEAK, as a reading test', cat.textbooks[WS]);
ok(cat.textbooks[WS]?.requiredFrom === null, 'and stays inactive: requiredFrom null', cat.textbooks[WS]);
ok(!Object.values(cat.courses).some((c) => (c.tests || []).includes(WS)), 'no unit course is given the test');
ok(JSON.stringify(cat.completions.WISESPEAK) === JSON.stringify(before.completions.WISESPEAK), 'the WISESPEAK completion itself is unchanged');
for (const [slug, t] of Object.entries(before.textbooks)) if (slug !== WS)
  ok(JSON.stringify(cat.textbooks[slug]) === JSON.stringify(t), `existing test ${slug} unchanged`);
ok(JSON.stringify(cat.courses) === JSON.stringify(before.courses), 'every unit course unchanged');
const req = fs.readFileSync(path.join(dir, 'public/assets/js/cts-required-tests.js'), 'utf8');
ok(req.includes('"WISESPEAK"') && req.includes(WS), 'the certificate pages\' copy of the requirements names it under WISESPEAK');

const dup = scratch({ [`${WS}.json`]: preaching, 'wisespeakreadings2.json': { ...preaching, slug: 'wisespeakreadings2' } });
ok(gen(dup).status === 2, 'a second reading test on the same single-page course is refused');
const none = scratch({ 'nowhere.json': { ...preaching, slug: 'nowhere', course: 'CTSNoSuchCourse' } });
ok(gen(none).status === 2, 'a reading test on a course with no completion code is refused');

/* ---- the award rule, against the generated catalog ----------------------- */

const A = await import(path.join(dir, 'worker/awards.js'));
const R = '2026-11-01T00:00:00.000Z', early = '2026-10-20T15:00:00.000Z', late = '2026-11-05T15:00:00.000Z';
const active = (completions = [], now = late) => ({ requiredFrom: { [WS]: R }, now, completions });

ok(JSON.stringify(A.testsFor('WISESPEAK')) === JSON.stringify([WS]), 'Preaching requires the one reading test');
ok(A.testsFor('CTSPSALMS').length === 0, 'a course with no test still requires none');

// inactive, as staged
for (const level of ['cert', 'associate', 'thm', 'mdiv', null])
  ok(A.textbookShortfall('WISESPEAK', level, []) === null, `inactive test: ${level || 'no'} level needs nothing new`);

// active (a date Robert would set)
for (const level of ['cert', 'associate', null])
  ok(A.textbookShortfall('WISESPEAK', level, [], active()) === null, `active test: ${level || 'no'} level unchanged`);
for (const level of ['thm', 'mdiv']) {
  ok(/required-reading test not recorded as passed/.test(A.textbookShortfall('WISESPEAK', level, [], active()) || ''), `active test: ${level} completion held for the reading test`);
  ok(A.textbookShortfall('WISESPEAK', level, [WS], active()) === null, `active test: ${level} completion stands with the pass`);
}
ok(A.textbookShortfall('WISESPEAK', 'mdiv', [], active([], early)) === null, 'before the activation moment it does not count');

// a completion already earned is kept
ok(A.textbookShortfall('WISESPEAK', 'mdiv', [], active([{ code: 'WISESPEAK', track: 'mdiv', completed_at: early }])) === null,
  'an M.Div. Preaching completion recorded before activation needs no reading test');
ok(A.textbookShortfall('WISESPEAK', 'thm', [], active([{ code: 'WISESPEAK', track: 'thm', completed_at: early }])) === null,
  'a Th.M. one likewise');
ok(A.textbookShortfall('WISESPEAK', 'mdiv', [], active([{ code: 'WISESPEAK', track: 'mdiv', completed_at: late }])) !== null,
  'one first recorded after activation does need it');

for (const d of [dir, dup, none]) fs.rmSync(d, { recursive: true, force: true });
if (fails.length) { console.error(`single-page reading tests: ${fails.length} of ${checks} checks FAILED`); for (const f of fails) console.error('  FAIL ' + f); process.exit(1); }
console.log(`single-page reading tests: all ${checks} checks pass`);
