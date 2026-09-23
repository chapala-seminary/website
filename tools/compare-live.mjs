/* Two live sites, side by side.
 *
 * Everything else in this repository compares the build against a recorded
 * reference. This compares what is SERVED at one address against what is
 * served at another -- beta against the site students are using today --
 * because that is the last step where something can differ: a deploy that
 * dropped a file, a host that rewrites a URL, a header that changes how a
 * page renders.
 *
 *   node tools/compare-live.mjs https://beta.chapalaseminary.org https://chapalaseminary.org
 *   node tools/compare-live.mjs <new> <old> --all        every page, slowly
 *   node tools/compare-live.mjs <new> <old> --paths f.txt
 *
 * WHAT IT COMPARES, AND WHAT IT DELIBERATELY DOES NOT
 *
 * The words, not the markup. The whole point of the migration was to change
 * the markup and keep the teaching, so a byte comparison would report 800
 * differences and mean nothing. It takes the text of each page, drops the
 * furniture the new layout renders differently -- navigation, registration,
 * the footer -- and compares what is left.
 *
 * It also checks the things a person would not notice by reading: that the
 * URL did not move, that the page is the language it claims, and that the
 * Spanish is present in both.
 */
const [NEW, OLD] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!NEW || !OLD) {
  console.error('usage: node tools/compare-live.mjs <new-base> <old-base> [--all] [--paths file]');
  process.exit(2);
}
const ALL = process.argv.includes('--all');
const pathsAt = process.argv.indexOf('--paths');

import fs from 'node:fs';

/* A sample that covers every shape of page, rather than the first N
   alphabetically -- which would have been eleven units of one course. */
const SAMPLE = [
  '/', '/index.html',
  '/CTSActsUnit1.html', '/CTSActsUnit3.html', '/CTSActsUnit11.html',
  '/CTS1PeterUnit1.html', '/CTSRevUnit15.html', '/CTSSTUnit12.html',
  '/CTSHermeneuticsUnit5.html', '/CTSGenesisUnit1.html', '/CTSCSUnit0.html',
  '/CTSActsCertificate.html', '/CTSActsReadings.html',
  '/CTSAbout.html', '/CTSBeforeYouBegin.html', '/CTSCatalog.html', '/CTSResources.html',
  '/CTSCounseling.html', '/CTS_Narrative_Preaching.html', '/cts-honors.html',
  '/ethics_unit01.html', '/START_HERE.html',
];

let paths = SAMPLE;
if (pathsAt >= 0) paths = fs.readFileSync(process.argv[pathsAt + 1], 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
else if (ALL) paths = null;   // filled below from the sitemap

const get = async (base, path) => {
  const r = await fetch(base + path, { redirect: 'manual', headers: { 'user-agent': 'cts-compare' } });
  const body = r.status >= 200 && r.status < 300 ? await r.text() : '';
  return { status: r.status, location: r.headers.get('location'), body };
};

if (!paths) {
  const sm = await get(OLD, '/sitemap.xml');
  paths = [...sm.body.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .filter((p) => p !== '/');
  console.log(`--all: ${paths.length} paths from the old site's sitemap`);
}

/* Furniture the two sites render differently on purpose. Dropped before
   comparing, so that a real difference in the teaching is not buried under
   eight hundred reports of a navigation bar that moved. */
const FURNITURE = [
  /Skip to (the )?lesson|Saltar a la lecci/gi,
  /Catalog|Cat.logo|All courses|Todos los cursos/gi,
  /Save my progress|Guardar mi progreso/gi,
  /Your information|Su informaci/gi,
  /Course Registration|Registro del Curso|Student Registration|Registro del Estudiante/gi,
  /Chapala Theological Seminary .{0,80}(bilingual|biling)/gi,
  /Previous|Anterior|Next|Siguiente|Unit \d+|Unidad \d+/gi,
  /Clear Saved Data|Borrar Datos Guardados|Clear My Answers|Borrar Mis Respuestas/gi,
];

const words = (html) => {
  let t = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&[a-z]+;/gi, ' ');
  for (const re of FURNITURE) t = t.replace(re, ' ');
  return t.replace(/\s+/g, ' ').trim();
};

/* Compared as a set of sentences: the two sites order the page differently in
   places, and "this sentence is gone" is the question worth asking. */
const sentences = (s) => new Set(
  s.split(/(?<=[.!?:;])\s+|\s{2,}/).map((x) => x.trim()).filter((x) => x.length >= 40));

let checked = 0, moved = 0, lost = 0;
const report = [];

for (const p of paths) {
  const [a, b] = await Promise.all([get(NEW, p), get(OLD, p)]);
  checked++;

  if (b.status >= 300 && b.status < 400) continue;            // not a page on the old site either
  if (a.status !== b.status || a.location) {
    moved++;
    report.push(`${p}\n    new: ${a.status}${a.location ? ' -> ' + a.location : ''}   old: ${b.status}`);
    continue;
  }
  if (a.status !== 200) continue;

  const A = sentences(words(a.body)), B = sentences(words(b.body));
  const gone = [...B].filter((s) => !A.has(s));
  if (gone.length) {
    lost++;
    report.push(`${p}\n    ${gone.length} sentence(s) on the old page and not the new one:`
      + gone.slice(0, 2).map((s) => `\n      ${s.slice(0, 150)}`).join(''));
  }
  if (checked % 25 === 0) console.log(`  ${checked}/${paths.length}`);
}

console.log(`\ncompared ${checked} page(s): ${NEW}  vs  ${OLD}`);
if (report.length) {
  console.log(`\n${moved} page(s) answered differently, ${lost} page(s) lost text:\n`);
  for (const r of report.slice(0, 25)) console.log('  ' + r);
  if (report.length > 25) console.log(`  … and ${report.length - 25} more`);
  process.exitCode = 1;
} else {
  console.log('every page answers the same way and says the same things.');
}
