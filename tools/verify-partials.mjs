/* Are the partials and the templates still talking about the same things?
 *
 * Three ways this can rot, all of them silent:
 *   - a template names a partial that does not exist  -> a gap in the page
 *   - a partial exists that nothing names             -> markup nobody sees
 *   - a course uses the honours box but has no reading room recorded
 *
 * The first is caught at build time too, by renderLesson. This runs without
 * a build so it can be part of a quick check.
 */
import fs from 'node:fs';
import path from 'node:path';
import { PARTIALS, READING_ROOM } from '../src/lib/partials.ts';

const ROOT = 'src/content/lessons';
const RE = /<!--cts-part:([a-z0-9-]+)-->/g;

const used = new Map();          // name -> count
const byCourse = new Map();      // name -> Set(course)
const fails = [];

for (const course of fs.readdirSync(ROOT).sort()) {
  for (const file of fs.readdirSync(path.join(ROOT, course)).filter((f) => f.endsWith('.json'))) {
    const p = path.join(ROOT, course, file);
    const lesson = JSON.parse(fs.readFileSync(p, 'utf8'));

    for (const [, name] of lesson.template.matchAll(RE)) {
      used.set(name, (used.get(name) || 0) + 1);
      if (!byCourse.has(name)) byCourse.set(name, new Set());
      byCourse.get(name).add(course);
      if (!PARTIALS[name]) fails.push(`${course} unit ${lesson.unit}: names a partial "${name}" that partials.ts does not define`);
    }

    /* The lift is only finished if no copy was left behind. */
    if (lesson.template.includes('data-cts-rrbox'))
      fails.push(`${course} unit ${lesson.unit}: still has an honours box written out in its template`);
  }
}

for (const name of Object.keys(PARTIALS))
  if (!used.has(name)) fails.push(`partials.ts defines "${name}", which no template names`);

for (const course of byCourse.get('honours') || [])
  if (!READING_ROOM[course]) fails.push(`${course} uses the honours box but has no reading room in READING_ROOM`);

for (const [name, n] of [...used].sort())
  console.log(`  ${name.padEnd(12)} ${String(n).padStart(4)} pages, ${byCourse.get(name).size} courses, one definition`);

if (fails.length) {
  console.error(`\n${fails.length} problem(s):`);
  for (const f of fails.slice(0, 20)) console.error('  ' + f);
  process.exit(1);
}
console.log('partials and templates agree');
