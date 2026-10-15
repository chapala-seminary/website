/* Well-formedness of the SEO sample pages: one html/head/body, one H1,
 * lang, charset, viewport. Not a full VNU run — that flags hundreds of
 * inherited lesson pages this PR does not rewrite.
 *
 *   node tools/verify-seo-html.mjs [dist]
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const DIST = process.argv[2] || 'dist';
const pages = [
  'index.html', 'es/index.html',
  'CTSNTCourse.html', 'es/CTSNTCourse.html',
  'CTSNTUnit1.html', 'es/CTSNTUnit1.html',
];
const fails = [];
let checks = 0;
const ok = (c, m) => { checks++; if (!c) fails.push(m); };
for (const page of pages) {
  const html = fs.readFileSync(path.join(DIST, page), 'utf8');
  const root = parse(html, { comment: true, parseNoneClosedTags: true });
  ok(/^<!doctype html>/i.test(html.trim()), `${page}: doctype`);
  ok(!!root.querySelector('html') && !!root.querySelector('head') && !!root.querySelector('body'), `${page}: html/head/body`);
  ok(!!root.querySelector('meta[charset]'), `${page}: charset`);
  ok(!!root.querySelector('meta[name="viewport"]'), `${page}: viewport`);
  ok(root.querySelectorAll('h1').length === 1, `${page}: exactly one H1`);
  ok(!!root.querySelector('html')?.getAttribute('lang'), `${page}: lang`);
  for (const img of root.querySelectorAll('img')) {
    ok(!!img.getAttribute('alt'), `${page}: img has alt`);
    if (img.getAttribute('src')?.includes('cts-share') || img.getAttribute('src')?.includes('icon'))
      ok(img.getAttribute('width') && img.getAttribute('height'), `${page}: share/icon image has dimensions`);
  }
}
console.log(`${checks} HTML checks`);
if (!fails.length) console.log('PASS — sample pages are well-formed enough to index.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach((f) => console.log('  ' + f)); process.exitCode = 1; }
