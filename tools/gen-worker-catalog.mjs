// worker/catalog.json: what the Worker knows about the courses, so it can
// refuse a certificate the record does not support.
//
//   node tools/gen-worker-catalog.mjs          rewrite it from src/content/units
//   node tools/gen-worker-catalog.mjs --check  exit 1 if it is out of date
//
// The client grades; the server only sees which units it was told were passed.
// This file lets it at least insist on ALL of them. It is generated from the
// same unit files the pages are built from, so the two cannot disagree, and
// --check runs in the test suite so a new course cannot ship without it.
import fs from 'node:fs';
import path from 'node:path';

const UNITS = 'src/content/units';
const OUT = 'worker/catalog.json';

const courses = {};
for (const dir of fs.readdirSync(UNITS).sort()) {
  for (const f of fs.readdirSync(path.join(UNITS, dir))) {
    if (!/^\d+\.json$/.test(f)) continue;
    const j = JSON.parse(fs.readFileSync(path.join(UNITS, dir, f), 'utf8'));
    const slug = j.course;
    if (!slug || !Number.isInteger(j.totalUnits) || !Number.isInteger(j.unit)) {
      console.error(`${dir}/${f}: missing course/unit/totalUnits`); process.exit(2);
    }
    const c = courses[slug] ??= { pages: dir, totalUnits: j.totalUnits, units: [] };
    if (c.totalUnits !== j.totalUnits) { console.error(`${dir}/${f}: totalUnits ${j.totalUnits} != ${c.totalUnits}`); process.exit(2); }
    c.units.push(j.unit);
  }
}
for (const [slug, c] of Object.entries(courses)) {
  // Units are listed, not assumed to be 1..N: Counseling Situations starts at
  // a Unit 0, so "count >= totalUnits" would be the wrong test there.
  c.units.sort((a, b) => a - b);
  if (c.units.length !== c.totalUnits) {
    console.error(`${slug}: ${c.units.length} unit files but totalUnits ${c.totalUnits}`); process.exit(2);
  }
}

const text = JSON.stringify({ generated: 'tools/gen-worker-catalog.mjs -- do not edit', courses }, null, 2) + '\n';
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur !== text) { console.error(`${OUT} is out of date: run node tools/gen-worker-catalog.mjs`); process.exit(1); }
  console.log(`${OUT}: current (${Object.keys(courses).length} courses)`);
} else {
  fs.writeFileSync(OUT, text);
  console.log(`wrote ${OUT}: ${Object.keys(courses).length} courses`);
}
