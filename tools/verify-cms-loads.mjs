/* The editing interface, in a browser.
 *
 * tools/verify-cms-config.mjs checks the config against the content. This
 * checks the other half: that the page actually comes up. The ways it can fail
 * are all quiet ones -- a CDN pin that no longer resolves, a config Sveltia
 * itself rejects, an admin page that 404s because it was never published --
 * and every one of them is discovered by a teacher rather than by a build.
 *
 * It also holds the local-repository affordance in place. That button is how
 * this gets tried without a GitHub account and without deploying an auth
 * Worker, which is the whole reason anyone can look at it this week.
 *
 *   node tools/verify-cms-loads.mjs http://127.0.0.1:8123
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8123';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const page = await browser.newPage();

const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
/* A config the server does not serve is the failure this catches most often. */
const responses = [];
page.on('response', (r) => responses.push([r.url(), r.status()]));

let failed = 0;
const ok = (cond, what) => { console.log(`  ${cond ? 'ok  ' : 'FAIL'}  ${what}`); if (!cond) failed++; };

const res = await page.goto(`${BASE}/admin/`, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(4000);
const text = await page.evaluate(() => document.body.innerText);

ok(res.status() === 200, 'the editing interface is published and returns 200');
ok(/Sveltia CMS/i.test(text), 'the CMS bundle loaded from its pinned version');
ok(responses.some(([u, s]) => u.includes('/admin/config.yml') && s === 200),
   'it fetched its configuration, and the server served it');
ok(/Work with Local Repository/i.test(text),
   'the local-repository option is offered, so it can be tried without GitHub');
ok(/Sign In with/i.test(text), 'GitHub sign-in is offered for everyone else');
/* Sveltia reports a bad config on the page rather than in the console, so the
   text is where an unusable config shows up. */
ok(!/config.*(error|invalid|failed)|failed to (load|parse)/i.test(text),
   'the configuration was accepted, not rejected');
ok(errors.filter((e) => !/favicon/i.test(e)).length === 0,
   `no console errors${errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''}`);

/* The self-check page. It is the thing someone opens when sign-in has already
   failed, so it failing silently is the worst time for it to fail. */
const chk = await page.goto(`${BASE}/admin/check.html`, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(600);
const table = await page.evaluate(() => document.getElementById('env')?.innerText ?? '');
ok(chk.status() === 200, 'the self-check page is published');
ok(/Folder picker available/.test(table),
   'the self-check reports whether this browser has the folder picker at all');
ok(/Counts as localhost/.test(table) && /Secure context/.test(table),
   'and whether the address it was opened from can use it');

await browser.close();
console.log(failed
  ? `FAIL — the editing interface has ${failed} problem(s)`
  : 'PASS — the editing interface loads, reads its config, and offers local editing.');
process.exitCode = failed ? 1 : 0;
