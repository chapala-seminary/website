// The sitemap is generated now (src/pages/sitemap.xml.ts). This checks it
// against the build, in both directions.
//
// It used to only report, because the inclusion policy was unwritten and a
// tool guessing at one would have quietly enforced a guess. The policy is now
// written down in the generator, so this can hold it to it:
//
//   every course unit, certificate and reading room in the build is listed
//   no reading digest is listed, and no page the generator excludes
//   every listed URL is a page the build actually produces
//
// The last one is what a hand-maintained sitemap gets wrong first, and the
// first is how a whole twelve-unit course (CTSPentecostal) stayed invisible to
// search engines while sitting on the front page.
//
//   node tools/verify-sitemap.mjs [dist]

import fs from 'fs';
import path from 'path';

const DIST = process.argv[2] || 'dist';
const MAP = path.join(DIST, 'sitemap.xml');
if (!fs.existsSync(MAP)) { console.error(`no sitemap at ${MAP} — build first`); process.exit(2); }

// kept in step with src/pages/sitemap.xml.ts
const EXCLUDE = new Set([
  'cts-backup.html', 'CTS_ARCHIVE_INDEX.html', 'START_HERE.html',
  'Apologetics_Self_Contained_Unlocked_Preview.html', 'Romans_Digest_01_Haldane_EN.html',
]);
const isDigest = (f) => /_digest\.html$/i.test(f) || /_Digest_/i.test(f);
const isUnit = (f) => /Unit\d+\.html$/i.test(f) || /^ethics_unit\d+\.html$/i.test(f);
const isCertificate = (f) => /Certificate\.html$/i.test(f);
const isReadingRoom = (f) => /Readings\.html$/i.test(f);

const xml = fs.readFileSync(MAP, 'utf8');
const listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(/^https?:\/\/[^/]+\//, '') || 'index.html');
const listedSet = new Set(listed);
const built = fs.readdirSync(DIST).filter((f) => f.endsWith('.html'));

const fails = [];
const report = (label, items) => {
  if (items.length) fails.push(`${label} (${items.length}):\n      ` + items.sort().slice(0, 12).join('\n      ') +
    (items.length > 12 ? `\n      … and ${items.length - 12} more` : ''));
};

report('listed but the build does not produce them', listed.filter((p) => !fs.existsSync(path.join(DIST, p))));
report('course units missing from the sitemap', built.filter((f) => isUnit(f) && !listedSet.has(f)));
report('certificates missing from the sitemap', built.filter((f) => isCertificate(f) && !listedSet.has(f)));
report('reading rooms missing from the sitemap', built.filter((f) => isReadingRoom(f) && !listedSet.has(f)));
report('reading digests that should not be listed', listed.filter(isDigest));
report('excluded pages that should not be listed', listed.filter((p) => EXCLUDE.has(p)));

// a sitemap of nothing would satisfy every "must not" rule above
if (listed.length < 500) fails.push(`only ${listed.length} URLs — the site has ${built.length} pages, so something is wrong`);

const count = (fn) => built.filter(fn).length;
console.log(`${listed.length} URLs listed; the build has ${built.length} pages`);
console.log(`  units ${count(isUnit)}  certificates ${count(isCertificate)}  reading rooms ${count(isReadingRoom)}` +
            `  digests ${count(isDigest)} (excluded on purpose)`);

if (!fails.length) console.log('PASS — the sitemap matches the build and the stated policy.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach((f) => console.log('  ' + f)); process.exitCode = 1; }
