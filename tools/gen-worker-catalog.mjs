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

// The completion codes and the course names the certificate pages write into
// cts_done_codes / cts_degree_courses, derived exactly as cts-completion.js
// derives them (code from the certificate filename, name from data-course or
// the <title>), plus the pages that call CTSCurriculum.markComplete(code,
// name) directly. The Worker serves this so a device restored from a student
// code can rebuild the name roster the degree pages count, and so the student
// tracker can turn a code into a course name.
const completions = {};
const html = (f) => fs.readFileSync(path.join('public', f), 'utf8');
const unescape = (t) => t.replace(/&mdash;/g, '\u2014').replace(/&ndash;/g, '\u2013').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
for (const f of fs.readdirSync('public').sort()) {
  if (!f.endsWith('.html')) continue;
  const h = html(f);
  // cts-genesis-completion.js is Genesis's copy of cts-completion.js and
  // derives code and name the same way. Skipping it left CTSGENESIS -- an
  // M.Div. core course -- out of the catalog.
  if (/cts-(genesis-)?completion\.js/.test(h)) {
    const lower = f.toLowerCase();
    if (!/certificate\.html$/.test(lower)) continue;
    let code = lower.replace(/(thm|mth|mdiv)?certificate\.html$/, '').toUpperCase();
    if (code === 'ETHICS_') code = 'ETHICS';
    // A page may name its code outright (data-course-code on <body>), as the
    // single-page courses' certificate pages do; cts-completion.js and
    // cts-certify.js read the same attribute.
    const named = /<body[^>]*\sdata-course-code="([A-Za-z0-9_]+)"/.exec(h);
    if (named) code = named[1].toUpperCase();
    // degree pages load the same script but are not courses
    if (['CTSASSOCIATE', 'CTSCERTIFICATEOFMINISTRY', 'CTSMDIV', 'CTSTHM'].includes(code)) continue;
    const explicit = /data-course="([^"]+)"/.exec(h);
    let name;
    if (explicit) name = unescape(explicit[1]).trim();
    else {
      let t = unescape((/<title>([^<]*)<\/title>/.exec(h) || [, ''])[1]).replace(/^\s*CTS\s+/i, '');
      t = t.split(/[\u2014\u2013\-(]/)[0];
      t = t.replace(/certificate.*$/i, '').trim();
      name = t || f.replace(/\.html$/, '');
    }
    const prev = completions[code];
    if (prev && prev.name !== name) { console.error(`${f}: code ${code} named "${name}" but ${prev.page} named it "${prev.name}"`); process.exit(2); }
    // The first certificate page wins (CTSOTSCertificate, not its M.Div.
    // variant) -- unless what is there came from a course page's
    // markComplete, which sorts earlier: the certificate page is the page.
    if (!prev || prev.fromCourse) completions[code] = { name, page: f };
  }
  for (const m of h.matchAll(/markComplete\(\s*'([A-Z0-9_]+)'\s*,\s*'([^']+)'/g)) {
    const [, code, name] = m;
    const prev = completions[code];
    if (prev && prev.name !== name) { console.error(`${f}: code ${code} named "${name}" but ${prev.page} named it "${prev.name}"`); process.exit(2); }
    if (!prev) completions[code] = { name, page: f, fromCourse: true };
  }
}
for (const c of Object.values(completions)) delete c.fromCourse;

// Every unit course is also known by the completion code its certificate page
// writes (the slug "ots" is CTSOTS, "1peter" is CTS1PETER). The Worker needs
// both: unit progress is keyed by slug, completions and degrees by code.
for (const [slug, c] of Object.entries(courses)) {
  const code = 'CTS' + slug.toUpperCase();
  if (!completions[code]) { console.error(`${slug}: no certificate page writes completion code ${code}`); process.exit(2); }
  c.code = code;
}
// And every course a degree requires must be one a page can actually record,
// or that degree can never be awarded. (Wayne's audit of the beta asked about
// WISESPEAK and COUNSELING; they are single-page courses, recorded by code.)
{
  const src = fs.readFileSync('worker/awards.js', 'utf8');
  const listed = new Set([...src.matchAll(/'([A-Z0-9_]+)'/g)].map(m => m[1]));
  const unknown = [...listed].filter(c => !completions[c]);
  if (unknown.length) { console.error(`worker/awards.js requires courses no page records: ${unknown.join(', ')}`); process.exit(2); }
}

const text = JSON.stringify({ generated: 'tools/gen-worker-catalog.mjs -- do not edit', courses, completions }, null, 2) + '\n';
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur !== text) { console.error(`${OUT} is out of date: run node tools/gen-worker-catalog.mjs`); process.exit(1); }
  console.log(`${OUT}: current (${Object.keys(courses).length} courses, ${Object.keys(completions).length} completion codes)`);
} else {
  fs.writeFileSync(OUT, text);
  console.log(`wrote ${OUT}: ${Object.keys(courses).length} courses, ${Object.keys(completions).length} completion codes`);
}
