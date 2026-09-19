// The sitemap is hand-maintained, and it has drifted.
//
// Two different things are wrong when a sitemap and a site disagree, and only
// one of them is a defect:
//
//   a listed URL that does not exist   -- always wrong, fails this check
//   a page that is not listed          -- an editorial choice, reported only
//
// Which pages belong in a sitemap (are the Reading Rooms worth indexing? the
// 210 digest pages?) is a decision about the site, not something a tool should
// infer from the current file and then quietly enforce. So this reports and
// lets a person decide.
//
//   node tools/verify-sitemap.mjs [dist]

import fs from 'fs';
import path from 'path';

const DIST = process.argv[2] || 'dist';
const MAP = path.join(DIST, 'sitemap.xml');
if (!fs.existsSync(MAP)) { console.error(`no sitemap at ${MAP} -- build first`); process.exit(2); }

const xml = fs.readFileSync(MAP, 'utf8');
const listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(m => m[1].replace(/^https?:\/\/[^/]+\//, '') || 'index.html');

const dead = listed.filter(p => !fs.existsSync(path.join(DIST, p)));
const built = fs.readdirSync(DIST).filter(f => f.endsWith('.html'));
const listedSet = new Set(listed);
const unlisted = built.filter(p => !listedSet.has(p));

const kind = f =>
  /_digest\.html$/.test(f) ? 'unit digests'
  : /Readings\.html$/.test(f) ? 'reading rooms'
  : /Certificate\.html$/.test(f) ? 'certificates'
  : /Unit\d+\.html$/.test(f) ? 'course units'
  : 'other pages';

console.log(`sitemap lists ${listed.length} URLs; the build has ${built.length} pages`);

if (unlisted.length) {
  const by = {};
  for (const p of unlisted) (by[kind(p)] ||= []).push(p);
  console.log(`\n${unlisted.length} built pages are not in the sitemap:`);
  for (const [k, ps] of Object.entries(by).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${ps.length.toString().padStart(4)}  ${k}`);
    // name them when there are few enough to act on
    if (ps.length <= 15) ps.sort().forEach(p => console.log(`        ${p}`));
  }
  const courses = [...new Set(unlisted.map(p => /^(CTS[A-Za-z0-9]*)Unit\d+\.html$/.exec(p)?.[1]).filter(Boolean))];
  if (courses.length)
    console.log(`\n  Whole courses absent from the sitemap: ${courses.join(', ')}` +
                `\n  These are linked from the front page, so search engines are simply not being told about them.`);
}

if (dead.length) {
  console.log(`\nFAIL — ${dead.length} sitemap URLs point at pages the build does not produce:`);
  dead.slice(0, 20).forEach(p => console.log(`  ${p}`));
  if (dead.length > 20) console.log(`  … and ${dead.length - 20} more`);
  process.exitCode = 1;
} else {
  console.log(`\nPASS — every one of the ${listed.length} sitemap URLs exists in the build.`);
}
