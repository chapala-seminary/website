/* A staging host must not be indexable, and must not change the real site.
 *
 * Both halves matter. A middleware that blocks staging but also sets a header
 * on production would quietly de-index the seminary; a middleware that leaves
 * production alone but misses an asset path lets a crawler in the side door.
 *
 * This drives a real server with the Functions loaded, asking for the same
 * paths under two Host headers.
 *
 * It speaks raw HTTP rather than using fetch(), because fetch() SILENTLY
 * DROPS a Host header -- the spec forbids setting it -- so every request
 * arrives as 127.0.0.1, every host looks like staging, and the test passes
 * the half it should fail. That is exactly the shape of bug this file exists
 * to catch, so it is worth saying out loud.
 *
 *   node tools/verify-staging.mjs http://127.0.0.1:8798
 */
import http from 'node:http';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const { hostname, port } = new URL(BASE);

/* One request, with the Host header actually set. Follows a single redirect,
   because Cloudflare Pages answers /x.html with a 308 to /x while a Worker
   with html_handling "none" serves it outright -- and this check has to mean
   the same thing under either. */
const once = (host, path) => new Promise((resolve, reject) => {
  const req = http.request({ hostname, port, path, method: 'GET', headers: { Host: host } }, (res) => {
    const chunks = [];
    res.on('data', (c) => chunks.push(c));
    res.on('end', () => resolve({
      status: res.statusCode,
      header: (n) => res.headers[n.toLowerCase()],
      body: Buffer.concat(chunks).toString('utf8'),
    }));
  });
  req.on('error', reject);
  req.end();
});

const get = async (host, path) => {
  const r = await once(host, path);
  if (r.status >= 300 && r.status < 400 && r.header('location'))
    return await once(host, r.header('location'));
  return r;
};

let checks = 0;
const fails = [];
const ok = (cond, what, detail) => {
  checks++;
  if (!cond) fails.push(what + (detail ? `\n        ${detail}` : ''));
};

const as = (host, path) => get(host, path);

/* Paths chosen to cover every kind of thing served: a generated page, a
   hand-written static page, a stylesheet, a script, the sitemap, the editing
   interface, and the API. An asset that slips through is as indexable as a
   page. */
const PATHS = [
  '/', '/CTSActsUnit3.html', '/CTSPrivacy.html', '/cts-backup.html',
  '/assets/css/cts.css', '/assets/js/cts-engine.js', '/sitemap.xml',
  '/admin/index.html', '/api/health',
];

const STAGING = 'beta.chapalaseminary.org';
const REAL = 'chapalaseminary.org';

for (const p of PATHS) {
  const r = await as(STAGING, p);
  ok((r.header('x-robots-tag') || '').includes('noindex'),
    `staging: ${p} carries noindex`, `status ${r.status}, x-robots-tag: ${r.header('x-robots-tag')}`);
}

for (const p of PATHS) {
  const r = await as(REAL, p);
  ok(!r.header('x-robots-tag'),
    `the real site: ${p} carries no such header`, `status ${r.status}, x-robots-tag: ${r.header('x-robots-tag')}`);
}

/* robots.txt is the one thing that differs in its body. */
const sr = (await as(STAGING, '/robots.txt')).body;
ok(/Disallow: \/\s*$/m.test(sr), 'staging robots.txt refuses everything', sr.split('\n').pop());
ok(/chapalaseminary\.org/.test(sr), 'and says where the real site is');

const rr = (await as(REAL, '/robots.txt')).body;
ok(/^Allow: \/$/m.test(rr), 'the real robots.txt still allows the site', rr.slice(0, 60));
ok(/Disallow: \/admin\//.test(rr), 'and still keeps the editing interface out');

/* An unknown host is staging. Being wrong in this direction costs a day of a
   real site not being indexed; being wrong the other way costs a month of a
   staging site that is. */
const unknown = await as('chapala-seminary.pages.dev', '/CTSActsUnit3.html');
ok((unknown.header('x-robots-tag') || '').includes('noindex'),
  'a host nobody listed is treated as staging, not as the real site');

/* And the bytes are the same either way. The whole repository's guarantee is
   that the built page is what was checked; a middleware that rewrote anything
   would invalidate all of it. */
const a = (await as(REAL, '/CTSActsUnit3.html')).body;
const b = (await as(STAGING, '/CTSActsUnit3.html')).body;
ok(a === b && a.length > 1000,
  'the page itself is byte for byte the same on both', `${a.length} vs ${b.length} bytes`);

console.log(`${checks} assertions on the staging guard`);
if (!fails.length) console.log('PASS — staging is not indexable and the real site is untouched.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach(f => console.log('  ' + f)); process.exitCode = 1; }
