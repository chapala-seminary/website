/* The seminary as a Worker with static assets.
 *
 * WHY NOT CLOUDFLARE PAGES
 *
 * Pages answers /CTSActsUnit3.html with a 308 to /CTSActsUnit3, and there is
 * no way to turn that off. All 801 pages here end in .html, there are 8,878
 * links between them, and `build.format: 'file'` exists in the Astro config
 * for the sole purpose of keeping those URLs exactly as students and search
 * engines already have them. A Worker with `html_handling` set serves them
 * as asked, so the promise the whole migration was built on survives the
 * deployment.
 *
 * ROUTING
 *
 * `run_worker_first` is true, so every request comes through here, including
 * static assets. That is deliberate and it costs an invocation per request:
 * with the default, assets are served without the Worker ever running, and
 * the staging guard below would protect nothing -- the HTML pages, which are
 * the whole indexing problem, would go straight out.
 */
import { handle } from './api.js';
import { handleStaff } from './staff.js';
import { scheduled, stopNotes } from './outreach.js';
import { runQueue } from './grading/queue.js';

const GRADING_CRON = '*/15 * * * *';
async function gradingRun(env) {
  try { console.log('grading queue', JSON.stringify(await runQueue(env))); }
  catch (e) { console.error('grading queue error', e && e.stack || e); }
}

/* The address that IS the seminary. www 301s here. Everything else -- beta,
   a preview deployment, *.workers.dev -- is staging. See guard() below. */
const APEX = 'chapalaseminary.org';
const CANONICAL = new Set([APEX]);

const STAGING_ROBOTS = `# This is not the seminary.
#
# It is a staging copy of chapalaseminary.org, kept so the site can be checked
# before it is published. Please do not index it. The real site is:
#
#   https://chapalaseminary.org/

User-agent: *
Disallow: /
`;

/* A staging copy is 800 pages identical to the real site on a public address,
 * with a robots.txt that says Allow: / and no canonical tags to say which
 * copy is real. Left alone, Google indexes both, the staging copy can outrank
 * the real one, and undoing that takes weeks -- which for a seminary whose
 * entire reach is people finding it is a bad way to lose a month.
 *
 * X-Robots-Tag is used rather than robots.txt alone because it keeps a page
 * OUT of an index, where robots.txt only asks for it not to be crawled.
 *
 * A host missing from CANONICAL is treated as staging. That is the safe
 * direction to be wrong in: the cost is a real site that is not indexed and
 * someone noticing within a day, rather than a staging site that is indexed
 * and nobody noticing for a month.
 */
const isCanonical = (request) =>
  CANONICAL.has(new URL(request.url).hostname.toLowerCase());

const PRIVATE_PATH = /^(?:\/(?:es|fr))?\/(?:admin|verify|staff)(?:\/|$)|(?:\/(?:es|fr))?\/(?:cts-backup|cts-confirm-email)\.html$|Certificate\.html$/i;
const isPrivatePath = (path) => PRIVATE_PATH.test(path);

const SECURITY = {
  'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'SAMEORIGIN',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
};

function cacheControl(path) {
  if (isPrivatePath(path) || path === '/api' || path.startsWith('/api/') || path.startsWith('/staff') || path.startsWith('/verify'))
    return 'no-store';
  if (/^\/assets\/.+\.(?:js|css|png|jpe?g|webp|woff2)$/i.test(path)) return 'public, max-age=86400';
  if (path === '/' || path.endsWith('.html') || path.endsWith('/')
      || path === '/robots.txt' || path === '/sitemap.xml'
      || path === '/llms.txt' || path === '/llms-full.txt')
    return 'public, max-age=300, must-revalidate';
  return null;
}

function decorate(res, path, { staging }) {
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(SECURITY)) out.headers.set(k, v);
  const cache = cacheControl(path);
  if (cache) out.headers.set('cache-control', cache);
  if (staging || isPrivatePath(path)) out.headers.set('x-robots-tag', 'noindex, nofollow');
  return out;
}

/* Fetch a static asset, resolving a directory to its index.html.
 *
 * `html_handling` is "none", so the assets service does no rewriting at all:
 * /CTSActsUnit3.html is served exactly as asked, which is the entire reason
 * for deploying this way. The cost is that it also stops resolving "/" to
 * "/index.html" -- the catalog, the front page of the seminary, answered 404
 * in the first test of this config. So that one piece of classic static-server
 * behaviour is done here, where it is visible and checked, rather than taken
 * on trust from a setting that does several things at once.
 *
 * A path ending in "/" is a directory. A path with no extension that misses is
 * tried as one -- that is how /admin reaches the editing interface. Neither
 * can affect a .html URL, which is matched and served before either runs. */
async function asset(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path.endsWith('/'))
    return await env.ASSETS.fetch(new Request(new URL(path + 'index.html', url), request));

  const res = await env.ASSETS.fetch(request);
  if (res.status !== 404) return res;

  if (!/\.[A-Za-z0-9]+$/.test(path)) {
    const dir = await env.ASSETS.fetch(new Request(new URL(path + '/index.html', url), request));
    if (dir.status !== 404) return dir;
  }

  /* A real HTML miss gets the seminary's 404 page and status 404. Assets
     keep the empty 404 so a missing stylesheet is not a web page. */
  if (path.endsWith('.html') || !/\.[A-Za-z0-9]+$/.test(path)) {
    const page = await env.ASSETS.fetch(new Request(new URL('/404.html', url), request));
    if (page.status === 200)
      return new Response(page.body, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } });
  }
  return res;
}

/* One route table, one place that decides what answers a request. */
async function route(request, env, ctx) {
  const path = new URL(request.url).pathname;
  if (path === '/api' || path.startsWith('/api/')) return await handle(request, env, ctx);
  if (path === '/verify' || path.startsWith('/verify/')) return await handle(request, env);
  // The verification page in a reader's language: /fr/verify (worker/api.js).
  if (/^\/(?:es|fr)\/verify(?:\/|$)/.test(path)) return await handle(request, env);
  if (path === '/staff' || path.startsWith('/staff/')) return await handleStaff(request, env);
  let m;
  if ((m = /^\/stop-notes\/([^/]+)$/.exec(path)) && env.DB) return await stopNotes(request, env, decodeURIComponent(m[1]));
  return await asset(request, env);
}

export default {
  // Two schedules (wrangler.jsonc triggers.crons):
  //   every 15 minutes   the pending-grade queue (worker/grading/queue.js)
  //   once a day         notes to students who have gone quiet, and on Mondays
  //                      the seminary's weekly summary (worker/outreach.js)
  // An event with no cron (a manual trigger) is the daily run, as it always was.
  scheduled: (event, env, ctx) => ctx.waitUntil(event.cron === GRADING_CRON ? gradingRun(env) : scheduled(event, env)),

  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();

    if (host === 'www.' + APEX) {
      url.hostname = APEX;
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    const canonical = isCanonical(request);
    if (canonical && (url.pathname === '/en' || url.pathname === '/en/' || url.pathname.startsWith('/en/'))) {
      const rest = url.pathname === '/en' || url.pathname === '/en/' ? '/' : url.pathname.slice(3);
      return Response.redirect(`https://${APEX}${rest}${url.search}`, 301);
    }

    if (!canonical && url.pathname === '/robots.txt')
      return decorate(new Response(STAGING_ROBOTS, {
        headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
      }), url.pathname, { staging: true });

    const res = await route(request, env, ctx);
    /* Headers change; the body does not. Staging and production must stay
       byte-identical so every page check still describes what is deployed. */
    return decorate(res, url.pathname, { staging: !canonical });
  },
};
