/* Phase 1 SEO: robots, sitemap, hreflang, llms.txt, JSON-LD, titles,
 * a real 404 page, and that private pages are not offered to an index.
 *
 *   node tools/verify-seo.mjs [dist]
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const DIST = process.argv[2] || 'dist';
const SITE = 'https://chapalaseminary.org';
const BOTS = ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Claude-SearchBot', 'Applebot'];
const fails = [];
let checks = 0;
const ok = (cond, what, detail) => {
  checks++;
  if (!cond) fails.push(what + (detail ? `\n        ${detail}` : ''));
};
const read = (p) => fs.readFileSync(path.join(DIST, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(DIST, p));

ok(exists('robots.txt'), 'robots.txt is in the build');
ok(exists('sitemap.xml'), 'sitemap.xml is in the build');
ok(exists('llms.txt'), 'llms.txt is in the build');
ok(exists('llms-full.txt'), 'llms-full.txt is in the build');
ok(exists('404.html'), '404.html is in the build');
ok(exists('CTSNTCourse.html') && exists('es/CTSNTCourse.html'), 'course landings exist in English and Spanish');

const robots = read('robots.txt');
for (const bot of BOTS)
  ok(new RegExp(`User-agent:\\s*${bot}\\b`, 'i').test(robots), `robots.txt names ${bot}`);
ok(/Allow:\s*\//.test(robots), 'robots.txt allows the site');
ok(/Disallow:\s*\/admin\//.test(robots), 'robots.txt keeps /admin/ out');
ok(/Disallow:\s*\/verify/.test(robots), 'robots.txt keeps /verify out');
ok(/Disallow:\s*\/cts-backup\.html/.test(robots), 'robots.txt keeps save-restore out');
ok(/Disallow:\s*\/\*Certificate\.html/.test(robots), 'robots.txt keeps certificate pages out');
ok(/Sitemap:\s*https:\/\/chapalaseminary\.org\/sitemap\.xml/.test(robots), 'robots.txt points at the sitemap');

const sitemap = read('sitemap.xml');
ok(!/Certificate\.html/.test(sitemap), 'sitemap lists no certificate page');
ok(sitemap.includes(`${SITE}/CTSNTCourse.html`), 'sitemap lists an English course landing');
ok(sitemap.includes(`${SITE}/es/CTSNTCourse.html`) || sitemap.includes(`${SITE}/es/CTSNTCourse.html`),
  'Spanish landings are added with the other Spanish URLs');
ok(/hreflang="es"/.test(sitemap) && /hreflang="x-default"/.test(sitemap), 'sitemap has hreflang pairs');
ok(!/student code|\/verify\//i.test(sitemap), 'sitemap has no student-record URL');

const llms = read('llms.txt') + '\n' + read('llms-full.txt');
for (const fact of [
  'not accredited', 'no está acreditado', '65', 'Certificate of Ministry',
  '15', 'info@chapalaseminary.org', 'Common Ground Fellowship',
]) ok(llms.toLowerCase().includes(fact.toLowerCase()), `llms files mention “${fact}”`);
ok(!/\bis accredited\b/i.test(llms) && !/\bestá acreditado\b/i.test(llms.replace(/no está acreditado/gi, '')),
  'llms files do not claim the seminary is accredited');

const samples = [
  ['index.html', 'en'],
  ['es/index.html', 'es'],
  ['CTSNTCourse.html', 'en'],
  ['es/CTSNTCourse.html', 'es'],
  ['CTSNTUnit1.html', 'en'],
  ['es/CTSNTUnit1.html', 'es'],
  ['CTSAbout.html', 'en'],
  ['CTSBeforeYouBegin.html', 'en'],
];

const typesOn = (root) => root.querySelectorAll('script[type="application/ld+json"]').map((s) => {
  try { return JSON.parse(s.innerHTML); } catch { return { '@type': 'INVALID' }; }
});

for (const [route, lang] of samples) {
  ok(exists(route), `${route} exists`);
  if (!exists(route)) continue;
  const root = parse(read(route), { comment: true, parseNoneClosedTags: true });
  const title = root.querySelector('title')?.text.trim() || '';
  const desc = root.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  ok(root.querySelector('html')?.getAttribute('lang') === lang, `${route}: html lang=${lang}`);
  ok(title.length > 0 && title.length <= 60, `${route}: title ≤60`, `"${title}" (${title.length})`);
  ok(desc.length > 0 && desc.length <= 155, `${route}: description ≤155`, `"${desc.slice(0, 80)}" (${desc.length})`);
  ok(root.querySelectorAll('h1').length === 1, `${route}: one H1`);
  ok(root.querySelector('link[rel="canonical"]'), `${route}: canonical`);
  for (const code of ['en', 'es', 'x-default'])
    ok(root.querySelector(`link[hreflang="${code}"]`), `${route}: hreflang ${code}`);
  const en = root.querySelector('link[hreflang="en"]')?.getAttribute('href') || '';
  const es = root.querySelector('link[hreflang="es"]')?.getAttribute('href') || '';
  ok(en.startsWith(SITE) && es.startsWith(SITE + '/es/'), `${route}: hreflang pair points at en and /es/`);
  ok(root.querySelector('meta[property="og:title"]') && root.querySelector('meta[name="twitter:card"]'),
    `${route}: Open Graph and Twitter cards`);
}

const home = typesOn(parse(read('index.html')));
ok(home.some((d) => d['@type'] === 'EducationalOrganization' && d.parentOrganization?.name?.includes('Common Ground')),
  'home JSON-LD has EducationalOrganization with parentOrganization');
ok(home.some((d) => d['@type'] === 'WebSite'), 'home JSON-LD has WebSite');
ok(home.some((d) => d['@type'] === 'FAQPage'), 'home JSON-LD has FAQPage');
ok(!JSON.stringify(home).toLowerCase().includes('"accredited":true'), 'home JSON-LD does not claim accreditation');

const course = typesOn(parse(read('CTSNTCourse.html')));
const courseNode = course.find((d) => d['@type'] === 'Course');
ok(courseNode?.isAccessibleForFree === true, 'course JSON-LD isAccessibleForFree');
ok(courseNode?.offers?.price === 0, 'course JSON-LD offer price is 0');
ok(courseNode?.hasCourseInstance?.courseMode === 'online', 'course JSON-LD instance is online');
ok(course.some((d) => d['@type'] === 'BreadcrumbList'), 'course JSON-LD has BreadcrumbList');

const about = typesOn(parse(read('CTSAbout.html')));
ok(about.some((d) => d['@type'] === 'Person' && /Cook/.test(d.name || '')), 'About JSON-LD has Person for Cook');
ok(about.some((d) => d['@type'] === 'Person' && /Rogers/.test(d.name || '')), 'About JSON-LD has Person for Rogers');

const programs = typesOn(parse(read('CTSBeforeYouBegin.html')));
ok(programs.filter((d) => d['@type'] === 'EducationalOccupationalProgram').length >= 4,
  'programs page has four EducationalOccupationalProgram nodes');
ok(JSON.stringify(programs).includes('not accredited') || JSON.stringify(programs).includes('Not an official'),
  'program JSON-LD says the titles are not official degrees');

const cert = parse(read('CTSNTCertificate.html'));
ok(/noindex/.test(cert.querySelector('meta[name="robots"]')?.getAttribute('content') || ''),
  'a certificate page is noindex');

const lesson = parse(read('CTSNTUnit1.html'));
ok((lesson.querySelector('#lesson')?.text || '').length > 200, 'lesson text is in the HTML, not JS-only');
ok(lesson.querySelector('a[href*="CTSNTCourse"]'), 'lesson page links to the course landing');

console.log(`${checks} SEO assertions`);
if (!fails.length) console.log('PASS — robots, sitemap, hreflang, llms and JSON-LD are present and valid.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach((f) => console.log('  ' + f)); process.exitCode = 1; }
