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

/* The addresses that ARE the seminary. Everything else -- beta, a preview
   deployment, *.workers.dev -- is staging. See guard() below. */
const CANONICAL = new Set([
  'chapalaseminary.org',
  'www.chapalaseminary.org',
]);

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
  if (res.status !== 404 || /\.[A-Za-z0-9]+$/.test(path)) return res;

  const dir = await env.ASSETS.fetch(new Request(new URL(path + '/index.html', url), request));
  return dir.status === 404 ? res : dir;
}

/* One route table, one place that decides what answers a request. */
async function route(request, env) {
  const path = new URL(request.url).pathname;
  if (path === '/api' || path.startsWith('/api/')) return await handle(request, env);
  if (path === '/verify' || path.startsWith('/verify/')) return await handle(request, env);
  return await asset(request, env);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const canonical = isCanonical(request);

    if (!canonical && url.pathname === '/robots.txt')
      return new Response(STAGING_ROBOTS, {
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'x-robots-tag': 'noindex, nofollow',
          'cache-control': 'no-store',
        },
      });

    const res = await route(request, env);
    if (canonical) return res;

    /* Every response, not only the pages. The first version of this marked
       assets and let the API through, which left /verify/<code> -- an HTML
       page, and the one API route a search engine would actually follow --
       indexable on staging. Headers from the assets service are immutable, so
       the response is rebuilt around the same body. Not one byte of the body
       changes: every check in this repository measures the built page, and a
       staging copy that differed from production would make all of them
       describe something nobody is going to deploy. */
    const out = new Response(res.body, res);
    out.headers.set('x-robots-tag', 'noindex, nofollow');
    return out;
  },
};
