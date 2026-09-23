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
                 '/cts-curriculum.js', '/sitemap.xml', '/robots.txt']) {
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
  ok((await hit(p)).status === 404, `${p} is a 404`, `status ${(await hit(p)).status}`);
}

console.log(`${checks} assertions on how URLs are answered`);
if (!fails.length) console.log('PASS — every URL is served at the address it has always had.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach(f => console.log('  ' + f)); process.exitCode = 1; }
