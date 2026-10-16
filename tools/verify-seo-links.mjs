/* Follow every in-site href on the SEO sample pages. A landing that points
 * at a missing unit is worse than no landing.
 *
 *   node tools/verify-seo-links.mjs [dist]
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const DIST = process.argv[2] || 'dist';
const pages = [
  'index.html', 'es/index.html',
  'CTSNTCourse.html', 'es/CTSNTCourse.html',
  'CTSNTUnit1.html', 'es/CTSNTUnit1.html',
  'CTSAbout.html', 'CTSBeforeYouBegin.html', '404.html',
];
const fails = [];
let checks = 0;
for (const page of pages) {
  const file = path.join(DIST, page);
  if (!fs.existsSync(file)) { fails.push(`missing ${page}`); continue; }
  const root = parse(fs.readFileSync(file, 'utf8'), { comment: true, parseNoneClosedTags: true });
  for (const a of root.querySelectorAll('[href]')) {
    const href = a.getAttribute('href') || '';
    if (!href || /^(?:[a-z]+:|\/\/|#)/i.test(href)) continue;
    const local = href.split(/[?#]/)[0];
    const target = local === '/' ? 'index.html' : local.replace(/^\//, '');
    checks++;
    if (!fs.existsSync(path.join(DIST, target))) fails.push(`${page} -> ${href}`);
  }
}
console.log(`${checks} in-site links on SEO sample pages`);
if (!fails.length) console.log('PASS — every in-site link on the sample pages exists.');
else { console.log(`FAIL — ${fails.length} broken links:\n  ` + fails.slice(0, 20).join('\n  ')); process.exitCode = 1; }
