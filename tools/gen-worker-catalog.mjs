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
      // "CTS Romans | Certificate of Completion" and "Chapala Theological
      // Seminary — Counseling Situations · Certificate": the course is the part
      // before the separator, unless that part is the seminary's own name. The
      // old certificate pages cut only at a dash, which is how "Romans |"
      // reached the seminary's count (Dr. Cook's review, 29 Sept 2026). Courses
      // are matched by code everywhere, never by this name; it is for reading.
      const parts = t.split(/[\u2014\u2013\-(|\u00b7]/).map((x) => x.trim()).filter(Boolean);
      t = /^chapala theological seminary$/i.test(parts[0] || '') && parts[1] ? parts[1] : (parts[0] || '');
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
// The course's title in both languages, from the catalog the front page is
// built from (src/content/courses), matched by its first unit page. The
// notes the seminary sends students name the course they stopped in, in the
// student's language (worker/outreach.js).
{
  const titles = {};
  for (const f of fs.readdirSync('src/content/courses')) {
    const j = JSON.parse(fs.readFileSync(path.join('src/content/courses', f), 'utf8'));
    if (j.entry && j.title) titles[j.entry] = j.title;
  }
  for (const [slug, c] of Object.entries(courses)) {
    const t = titles[`${c.pages}Unit${c.units[0]}.html`];
    if (!t?.en || !t?.es) { console.error(`${slug}: no English and Spanish title in src/content/courses for ${c.pages}Unit${c.units[0]}.html`); process.exit(2); }
    c.title = { en: t.en, es: t.es };
  }
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

// The Master's textbooks (src/content/textbooks), by the completion code of the
// course each belongs to: a unit course by its slug, the two single-page
// courses by the code their certificate page names. On the master's tracks the
// course is complete only when the textbook test is passed (worker/awards.js,
// public/assets/js/cts-record.js); the pages and the Worker read this one map.
const textbooks = {};
{
  // Preaching (WiseSpeak) has no textbook test; it is here for its proposed
  // five-reading test (10 Oct 2026), which is staged, not installed.
  const SINGLE = { CTSCounseling: 'COUNSELING', CTS_Narrative_Preaching: 'STORYTEL', CTS_WiseSpeak_Preaching: 'WISESPEAK' };
  const dir = 'src/content/textbooks';
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : []) {
    const t = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const unitCourse = Object.entries(courses).find(([, c]) => c.pages === t.course);
    const code = unitCourse ? unitCourse[1].code : SINGLE[t.course];
    if (!code || !completions[code]) { console.error(`textbook ${t.slug}: its course ${t.course} has no completion code`); process.exit(2); }
    if (unitCourse) (unitCourse[1].tests ??= []).push(t.slug);
    textbooks[t.slug] = { code, page: t.page, title: t.title, kind: 'textbook' };
  }
  // The required-reading tests (src/content/readings, Dr. Cook's Add-ons, 4 Oct
  // 2026) sit in the same map with kind "reading": the Worker and the pages
  // apply one rule to both, and only the words differ.
  //
  // A course may have more than one required test (9 Oct 2026): the Master's
  // five-reading test comes beside a textbook's, and a master's completion
  // needs every one, each passed separately. `tests` lists them, the textbook
  // first. A reading test with a `requiredFrom` counts only from that moment,
  // and not for a master's completion recorded before it (worker/awards.js);
  // null means not yet activated.
  const rdir = 'src/content/readings';
  for (const f of fs.existsSync(rdir) ? fs.readdirSync(rdir).filter((f) => f.endsWith('.json')).sort() : []) {
    const t = JSON.parse(fs.readFileSync(path.join(rdir, f), 'utf8'));
    // A unit course by its slug; a single-page course (no numbered unit
    // record, e.g. Preaching) by the code its certificate page names, as for
    // the textbooks above.
    const unitCourse = Object.entries(courses).find(([, c]) => c.pages === t.course);
    const code = unitCourse ? unitCourse[1].code : SINGLE[t.course];
    if (!code || !completions[code]) { console.error(`required readings ${t.slug}: its course ${t.course} is neither a unit course nor a single-page course with a completion code`); process.exit(2); }
    if (Object.values(textbooks).some((x) => x.code === code && x.kind === 'reading')) { console.error(`required readings ${t.slug}: ${t.course} already has a required-reading test; a course has one`); process.exit(2); }
    if (unitCourse) (unitCourse[1].tests ??= []).push(t.slug);
    if (t.requiredFrom != null && Number.isNaN(Date.parse(t.requiredFrom))) { console.error(`required readings ${t.slug}: requiredFrom is not a date and time: ${t.requiredFrom}`); process.exit(2); }
    textbooks[t.slug] = { code, page: t.page, title: t.title, kind: 'reading',
      ...('requiredFrom' in t ? { requiredFrom: t.requiredFrom } : {}) };
  }
}

// The same requirements for the pages that are not built from the catalog --
// the certificate pages in public/ -- as a script they load before
// cts-textbook-gate.js: by completion code, every test the course requires.
const required = {};
for (const [slug, t] of Object.entries(textbooks))
  (required[t.code] ??= []).push({ slug, page: t.page, kind: t.kind, ...('requiredFrom' in t ? { requiredFrom: t.requiredFrom } : {}) });
const REQUIRED_OUT = 'public/assets/js/cts-required-tests.js';
const requiredText = '/* Generated by tools/gen-worker-catalog.mjs from worker/catalog.json -- do not edit.\n' +
  ' * The tests each course requires on the M.Div. and Th.M. tracks, by completion\n' +
  ' * code: a textbook test, a required-reading test, or both. A test with a\n' +
  ' * requiredFrom counts only from that moment (null: not yet activated); a\n' +
  ' * master\'s completion the student record held before it is not held by it.\n' +
  ' * Read by cts-textbook-gate.js and cts-record.js. */\n' +
  'window.CTS_REQUIRED_TESTS = ' + JSON.stringify(required, null, 1) + ';\n';
/* The certificate pages are hand-written HTML in public/, outside the build's
   fingerprinting (src/lib/version.ts), so a browser could keep last week's
   copy of this script -- one that says a test is not yet in force after it
   is. Each page that loads it names a fingerprint of its contents, written
   here and checked by --check. */
import crypto from 'node:crypto';
const requiredVersion = crypto.createHash('sha256').update(requiredText).digest('hex').slice(0, 10);
const REQUIRED_REF = /assets\/js\/cts-required-tests\.js(\?v=[0-9a-f]+)?/g;
const requiredPages = fs.readdirSync('public').filter((f) => f.endsWith('.html') && fs.readFileSync(path.join('public', f), 'utf8').includes('assets/js/cts-required-tests.js'));
const versioned = (h) => h.replace(REQUIRED_REF, `assets/js/cts-required-tests.js?v=${requiredVersion}`);

const text = JSON.stringify({ generated: 'tools/gen-worker-catalog.mjs -- do not edit', courses, completions, textbooks }, null, 2) + '\n';
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur !== text) { console.error(`${OUT} is out of date: run node tools/gen-worker-catalog.mjs`); process.exit(1); }
  const curRequired = fs.existsSync(REQUIRED_OUT) ? fs.readFileSync(REQUIRED_OUT, 'utf8') : '';
  if (curRequired !== requiredText) { console.error(`${REQUIRED_OUT} is out of date: run node tools/gen-worker-catalog.mjs`); process.exit(1); }
  for (const f of requiredPages) {
    const h = fs.readFileSync(path.join('public', f), 'utf8');
    if (versioned(h) !== h) { console.error(`public/${f} loads an old cts-required-tests.js: run node tools/gen-worker-catalog.mjs`); process.exit(1); }
  }
  console.log(`${OUT}: current (${Object.keys(courses).length} courses, ${Object.keys(completions).length} completion codes)`);
} else {
  fs.writeFileSync(OUT, text);
  fs.writeFileSync(REQUIRED_OUT, requiredText);
  for (const f of requiredPages) {
    const h = fs.readFileSync(path.join('public', f), 'utf8');
    if (versioned(h) !== h) fs.writeFileSync(path.join('public', f), versioned(h));
  }
  console.log(`wrote ${OUT}: ${Object.keys(courses).length} courses, ${Object.keys(completions).length} completion codes`);
}
