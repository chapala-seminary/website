// The course name, in English and Spanish, for every course certificate page,
// for the downloadable PDF certificate (public/assets/js/cts-cert-pdf.js).
//
//   node tools/build-cert-names.mjs          write public/assets/js/cts-cert-names.js
//   node tools/build-cert-names.mjs --check  fail if that file is out of date
//
// Names come from the catalog (src/content/courses/*.json), the same names the
// front page shows, so a course renamed there is renamed on its certificate.
// A certificate page is matched to its course by filename: CTSActsCertificate,
// CTSActsMDivCertificate and CTSActsThMCertificate are all Acts. The few pages
// whose filename does not follow the course's are listed below.
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'public/assets/js/cts-cert-names.js';
const DEGREES = new Set(['ctsmdivcertificate.html', 'ctsthmcertificate.html',
  'ctsassociatecertificate.html', 'ctscertificateofministry.html']);
const ODD = {                       // certificate page base -> catalog file
  CTSOTS: 'CTS',
  CTSNarrativePreaching: 'CTS_Narrative_Preaching',
  CTSPreaching: 'CTS_WiseSpeak_Preaching',
  ethics_certificate: 'ethics_unit01',
};

const courses = {};
for (const f of fs.readdirSync('src/content/courses')) {
  courses[f.replace(/\.json$/, '')] = JSON.parse(fs.readFileSync(path.join('src/content/courses', f), 'utf8'));
}

const names = {};
const problems = [];
for (const f of fs.readdirSync('public').filter((f) => /certificate/i.test(f) && f.endsWith('.html')).sort()) {
  if (DEGREES.has(f.toLowerCase())) continue;
  const base = f === 'ethics_certificate.html' ? 'ethics_certificate' : f.replace(/(MDiv|ThM)?Certificate\.html$/, '');
  const c = courses[ODD[base] || base];
  if (!c) { problems.push(`${f}: no catalog entry for "${base}"`); continue; }
  names[f.toLowerCase()] = { en: c.title.en, es: c.title.es };
}
if (problems.length) { problems.forEach((p) => console.error('  ' + p)); process.exit(1); }

const text = '/* The course name on each course certificate, English and Spanish, for the\n' +
  '   downloadable PDF (cts-cert-pdf.js). Written by tools/build-cert-names.mjs from\n' +
  '   the catalog, src/content/courses -- change the catalog and re-run it. */\n' +
  'window.CTS_CERT_NAMES = ' + JSON.stringify(names, null, 1) + ';\n';

if (process.argv.includes('--check')) {
  const now = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (now !== text) { console.error(`${OUT} is out of date — run: node tools/build-cert-names.mjs`); process.exit(1); }
  console.log(`${OUT}: ${Object.keys(names).length} certificate pages, up to date`);
} else {
  fs.writeFileSync(OUT, text);
  console.log(`wrote ${Object.keys(names).length} certificate pages to ${OUT}`);
}
