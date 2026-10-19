/* Every URL still answers the way it always has.
 *
 * This is the check the decision not to use Cloudflare Pages rests on.
 *
 * Pages answers /CTSActsUnit3.html with a 308 to /CTSActsUnit3, and cannot be
 * told not to. The whole site is .html: 801 pages, 8,878 links between them,
 * and an Astro config that sets `build.format: 'file'` for exactly this
 * reason. So it is deployed as a Worker with `html_handling: "none"`, which
 * rewrites nothing -- and therefore also stops resolving "/" to
 * "/index.html", which worker/index.js has to do itself.
 *
 * Both halves are load-bearing and both are easy to get wrong in a way that
 * looks fine until someone opens the front page. A redirect creeping back in
 * would be invisible in a browser and would quietly change every URL the
 * seminary has.
 *
 *   node tools/verify-worker-routing.mjs http://127.0.0.1:8821
 */
import http from 'node:http';
import { registerHooks } from 'node:module';

const BASE = process.argv[2] || 'http://127.0.0.1:8821';

let checks = 0;
const fails = [];
const ok = (cond, what, detail) => {
  checks++;
  if (!cond) fails.push(what + (detail ? `\n        ${detail}` : ''));
};

const hit = async (path) => {
  const r = await fetch(BASE + path, { redirect: 'manual' });
  return { status: r.status, location: r.headers.get('location'), type: r.headers.get('content-type') };
};

/* The thing this whole deployment shape exists for. */
for (const p of ['/CTSActsUnit3.html', '/CTS1PeterUnit1.html', '/CTSActsCertificate.html',
                 '/CTSActsReadings.html', '/CTSPrivacy.html', '/cts-backup.html',
                 '/index.html', '/ethics_unit01.html']) {
  const r = await hit(p);
  ok(r.status === 200 && !r.location,
    `${p} is served, not redirected`, `status ${r.status}${r.location ? ' -> ' + r.location : ''}`);
}

/* "none" turns off index resolution too, so this is the Worker's own work. */
for (const p of ['/', '/admin/', '/ChatGPT_Readings/Stage_5A/']) {
  const r = await hit(p);
  ok(r.status === 200, `${p} resolves to its index.html`, `status ${r.status}`);
}
ok((await hit('/admin')).status === 200, '/admin without the slash reaches the editing interface');

/* Assets, which is what run_worker_first exists to keep in the Worker's path. */
for (const p of ['/assets/css/cts.css', '/assets/js/cts-engine.js', '/assets/js/cts-sync.js',
                 '/cts-curriculum.js', '/sitemap.xml', '/robots.txt', '/llms.txt', '/llms-full.txt',
                 '/CTSNTCourse.html']) {
  const r = await hit(p);
  ok(r.status === 200 && !r.location, `${p} is served`, `status ${r.status}`);
}

/* The API is the Worker's own, and must not be reachable as an asset. */
ok((await hit('/api/health')).status === 200, '/api/health answers');
const missing = await hit('/api/nope');
ok(missing.status === 404, 'an unknown API path is a 404 from the API, not from the assets');

/* And a real miss is still a miss. A not_found_handling that started serving
   a page for everything would make every broken link look fine. */
for (const p of ['/nope.html', '/CTSActsUnit999.html', '/assets/css/nope.css']) {
  const r = await hit(p);
  ok(r.status === 404, `${p} is a 404`, `status ${r.status}`);
}
{
  const r = await fetch(BASE + '/nope.html');
  const body = await r.text();
  ok(r.status === 404 && /not here|no está aquí|n’est pas ici/.test(body),
    'an HTML miss serves the seminary 404 page', `status ${r.status}, ${body.slice(0, 80)}`);
}

const { hostname, port } = new URL(BASE);
const once = (host, path) => new Promise((resolve, reject) => {
  const req = http.request({ hostname, port, path, method: 'GET', headers: { Host: host } }, (res) => {
    res.resume();
    resolve({ status: res.statusCode, location: res.headers.location });
  });
  req.on('error', reject);
  req.end();
});
const www = await once('www.chapalaseminary.org', '/CTSActsUnit3.html');
ok(www.status === 301 && /https:\/\/chapalaseminary\.org\/CTSActsUnit3\.html$/.test(www.location || ''),
  'www 301s to the apex host', `${www.status} ${www.location}`);
const en = await once('chapalaseminary.org', '/en/CTSActsUnit3.html');
// Miniflare rewrites a same-host Location to the local transport's scheme.
// Check its status/host/path here, and the Worker's original HTTPS below.
ok(en.status === 301 && /^https?:\/\/chapalaseminary\.org\/CTSActsUnit3\.html$/.test(en.location || ''),
  '/en/ 301s to the English URL', `${en.status} ${en.location}`);

// workerd accepts JSON imports without attributes; Node needs the attribute.
// The temporary loader lets us execute the actual Worker without changing
// production imports or accepting an HTTP canonical redirect in this check.
const hooks = registerHooks({ load(url, context, next) {
  return next(url, url.endsWith('.json') ? { ...context, importAttributes: { type: 'json' } } : context);
} });
let worker;
try { worker = (await import('../worker/index.js')).default; }
finally { hooks.deregister(); }
for (const path of ['/en', '/en/', '/en/CTSActsUnit3.html?test=1']) {
  const response = await worker.fetch(new Request(`http://chapalaseminary.org${path}`), {}, {});
  const expected = path.startsWith('/en/CTS') ? 'https://chapalaseminary.org/CTSActsUnit3.html?test=1' : 'https://chapalaseminary.org/';
  ok(response.status === 301 && response.headers.get('location') === expected,
    `${path} redirects to HTTPS before local transport rewriting`, response.headers.get('location'));
}

console.log(`${checks} assertions on how URLs are answered`);
if (!fails.length) console.log('PASS — every URL is served at the address it has always had.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach(f => console.log('  ' + f)); process.exitCode = 1; }
