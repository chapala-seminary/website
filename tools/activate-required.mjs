#!/usr/bin/env node
/* Makes Master's tests required from a given moment: the textbook tests and
 * five-reading tests that are in this checkout but "required of no one"
 * (requiredFrom null). Dr. Cook (11 Oct 2026): on the M.Div. and Th.M. tracks
 * the readings must be read and their test passed, and the textbook read and
 * its test passed, for the course to be complete.
 *
 * From that moment a master's completion of the course needs the pass -- except
 * a master's completion the student's record already held before it
 * (worker/awards.js testCounts; docs/reading-rooms.md, "Master's reading
 * tests"). Certificate and Associate students are never held.
 *
 *   node tools/activate-required.mjs --list
 *   node tools/activate-required.mjs --at 2026-11-01T00:00:00Z --all-pending [--except actsreadings,...]
 *   node tools/activate-required.mjs --at 2026-11-01T00:00:00Z joshua,joshuareadings
 *     ... add --write to change the files; without it, says what it would do.
 *
 * The moment must be in the future and AFTER the deploy that carries it, so no
 * completion is recorded between the date and the deploy by a Worker that does
 * not yet know it. With --write it records the date in
 * src/data/required-from.json, sets requiredFrom in each textbook's
 * src/content/textbooks/<slug>.json, re-runs tools/import-readings.mjs --write
 * (which reads the same file for the reading tests) and
 * tools/gen-worker-catalog.mjs. Then: build, test suite, deploy.
 * A test already in force is never changed here; one scheduled for a moment
 * not yet reached is moved to the new --at (so the start can be brought
 * forward or put back before it arrives).
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const val = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const SCHEDULE = 'src/data/required-from.json';

const load = (dir) => fs.readdirSync(dir).filter((f) => f.endsWith('.json'))
  .map((f) => ({ file: `${dir}/${f}`, rec: JSON.parse(fs.readFileSync(`${dir}/${f}`, 'utf8')) }));
const tests = [
  ...load('src/content/textbooks').map((t) => ({ ...t, kind: 'textbook' })),
  ...load('src/content/readings').map((t) => ({ ...t, kind: 'reading' })),
].map((t) => ({ ...t, slug: t.rec.slug, course: t.rec.course, state: !('requiredFrom' in t.rec) ? 'always' : t.rec.requiredFrom === null ? 'pending' : t.rec.requiredFrom }));

if (flag('--list') || !args.length) {
  for (const t of tests.sort((a, b) => a.course.localeCompare(b.course) || a.kind.localeCompare(b.kind)))
    console.log(`${t.slug.padEnd(22)} ${t.kind.padEnd(8)} ${t.course.padEnd(26)} ${t.state === 'always' ? 'in force (since its install)' : t.state === 'pending' ? 'pending: in this checkout, required of no one (live only once deployed)' : `required from ${t.state}`}`);
  process.exit(0);
}

const at = val('--at');
if (!at || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(\.\d+)?Z$/.test(at) || Number.isNaN(Date.parse(at))) {
  console.error('--at must be a UTC moment, e.g. 2026-11-01T00:00:00Z'); process.exit(2);
}
if (Date.parse(at) <= Date.now()) { console.error(`${at} is not in the future; pick a moment after the deploy`); process.exit(2); }

/* A test scheduled for a moment not yet reached can be moved; once its moment
   has passed it is in force and is never changed here. */
const movable = (t) => t.state === 'pending' || (t.state !== 'always' && Date.parse(t.state) > Date.now());
const except = new Set((val('--except') || '').split(',').filter(Boolean));
const named = args.filter((a, i) => !a.startsWith('--') && !['--at', '--except'].includes(args[i - 1])).flatMap((a) => a.split(',')).filter(Boolean);
let chosen;
if (flag('--all-pending')) chosen = tests.filter((t) => movable(t) && !except.has(t.slug));
else {
  if (!named.length) { console.error('name the tests (slugs) or say --all-pending'); process.exit(2); }
  chosen = named.map((s) => tests.find((t) => t.slug === s) || (console.error(`no test called ${s}`), process.exit(2)));
}
for (const s of except) if (!tests.some((t) => t.slug === s)) { console.error(`--except: no test called ${s}`); process.exit(2); }
const notPending = chosen.filter((t) => !movable(t));
if (notPending.length) { console.error(`already in force, left alone: ${notPending.map((t) => t.slug).join(', ')}`); chosen = chosen.filter(movable); }
if (!chosen.length) { console.error('nothing to activate'); process.exit(1); }

console.log(`Required on the M.Div. and Th.M. tracks from ${at}:`);
for (const t of chosen) console.log(`  ${t.slug} (${t.kind}, ${t.course})`);
if (except.size) console.log(`Left optional: ${[...except].join(', ')}`);
if (!flag('--write')) { console.log('Nothing written (add --write).'); process.exit(0); }

const schedule = fs.existsSync(SCHEDULE) ? JSON.parse(fs.readFileSync(SCHEDULE, 'utf8')) : {};
for (const t of chosen) {
  schedule[t.slug] = at;
  if (t.kind === 'textbook') { t.rec.requiredFrom = at; fs.writeFileSync(t.file, JSON.stringify(t.rec, null, 2) + '\n'); }
}
fs.writeFileSync(SCHEDULE, JSON.stringify(Object.fromEntries(Object.entries(schedule).sort()), null, 2) + '\n');
if (chosen.some((t) => t.kind === 'reading')) execFileSync('node', ['tools/import-readings.mjs', '--write'], { stdio: 'inherit' });
execFileSync('node', ['tools/gen-worker-catalog.mjs'], { stdio: 'inherit' });
console.log(`Written. Now: npm run build && test/run-tests.sh, then deploy BEFORE ${at}.`);
