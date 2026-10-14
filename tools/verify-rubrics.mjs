/* Every short-answer question has a valid grading rubric.
 *
 *   node tools/verify-rubrics.mjs            fail (exit 1) if any sa item lacks one
 *   node tools/verify-rubrics.mjs --report   print coverage per course; never fails
 *
 * The shape is docs/ai-grading.md section 3: {v, points:[{id, essential, en}]}
 * with v an integer >= 1, 2-4 points, ids a-d unique and in order, at least
 * one essential, and each en a non-empty string of at most 200 characters.
 * Not yet part of the build: it will be wired in once every course has rubrics.
 */
import fs from 'node:fs';
import path from 'node:path';

const UNITS = 'src/content/units';
const MAX_EN = 200;
const report = process.argv.includes('--report');

/* null when valid, otherwise the reason */
export function rubricProblem(r) {
  if (!r || typeof r !== 'object') return 'no rubric';
  if (!Number.isInteger(r.v) || r.v < 1) return 'v must be an integer >= 1';
  if (!Array.isArray(r.points) || r.points.length < 2 || r.points.length > 4) return 'needs 2-4 points';
  for (const [i, p] of r.points.entries()) {
    if (!p || typeof p !== 'object') return `point ${i + 1} is not an object`;
    if (p.id !== 'abcd'[i]) return `point ${i + 1} id must be "${'abcd'[i]}" (ids a-d, unique, in order)`;
    if (typeof p.essential !== 'boolean') return `point ${p.id}: essential must be true or false`;
    if (typeof p.en !== 'string' || !p.en.trim()) return `point ${p.id}: en must be a non-empty string`;
    if (p.en.length > MAX_EN) return `point ${p.id}: en is ${p.en.length} chars (max ${MAX_EN})`;
  }
  if (!r.points.some((p) => p.essential)) return 'at least one point must be essential';
  return null;
}

const stats = {};
const offenders = [];
for (const course of fs.readdirSync(UNITS).sort()) {
  const dir = path.join(UNITS, course);
  if (!fs.statSync(dir).isDirectory()) continue;
  const s = (stats[course] = { total: 0, ok: 0 });
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort((a, b) => parseInt(a) - parseInt(b))) {
    const u = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    for (const [i, q] of (u.sa || []).entries()) {
      s.total++;
      const why = rubricProblem(q.rubric);
      if (why) offenders.push(`${course}/${f.replace('.json', '')} sa[${i + 1}]: ${why}`);
      else s.ok++;
    }
  }
}

const total = Object.values(stats).reduce((a, s) => a + s.total, 0);
const ok = Object.values(stats).reduce((a, s) => a + s.ok, 0);

if (report) {
  for (const [c, s] of Object.entries(stats)) console.log(`${c.padEnd(26)} ${String(s.ok).padStart(4)} / ${String(s.total).padEnd(4)} ${s.ok === s.total ? 'done' : ''}`);
  console.log(`\n${ok} of ${total} short-answer questions have a valid rubric`);
  console.log(`${offenders.filter((o) => !o.endsWith('no rubric')).length} have a rubric that is invalid`);
  process.exit(0);
}
if (offenders.length) {
  offenders.slice(0, 50).forEach((o) => console.error(o));
  if (offenders.length > 50) console.error(`... and ${offenders.length - 50} more`);
  console.error(`FAIL: ${offenders.length} of ${total} short-answer questions lack a valid rubric`);
  process.exit(1);
}
console.log(`OK: all ${total} short-answer questions have a valid rubric`);
