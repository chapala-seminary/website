/* `device(name)`: one of the student's browsers -- a phone, a laptop, a
 * library computer. Each is a fresh browser profile with its own
 * localStorage, as two real devices have.
 *
 * Every device watches for what a student would hit and a test might not
 * look at: a script error, a dialog nobody expected, a page or file of this
 * site that fails to load, or the Worker answering 500. Any of those fails
 * the test at the end, with the list, even if every step it checked passed.
 * Requests that leave the site are refused, so a journey can never reach a
 * real service.
 */
import { test as base, expect } from '@playwright/test';
import { deleteStudent } from './lib/site.mjs';

export const test = base.extend({
  device: async ({ browser, baseURL }, use, testInfo) => {
    const origin = new URL(baseURL).origin;
    const made = [];
    const make = async (name = `device ${made.length + 1}`, { viewport, staffHeaders } = {}) => {
      const ctx = await browser.newContext({ baseURL, ...(viewport ? { viewport } : {}),
        ...(staffHeaders ? { extraHTTPHeaders: staffHeaders } : {}) });
      await ctx.route('**/*', (r) => (new URL(r.request().url()).origin === origin ? r.fallback() : r.abort('blockedbyclient')));
      // Faster polling for results the Worker finishes later (pending grades).
      await ctx.addInitScript(() => { window.CTS_GRADING_TEST = { pollMs: [400, 800, 1500], codeWaitMs: 20000, timeoutMs: 60000 }; });
      const page = await ctx.newPage();
      const problems = [];
      page.on('pageerror', (e) => problems.push(`script error on ${page.url()}: ${e.message}`));
      page.on('dialog', (d) => { problems.push(`unexpected dialog on ${page.url()}: ${d.message()}`); d.dismiss().catch(() => {}); });
      page.on('response', (r) => {
        const u = new URL(r.url());
        if (u.origin !== origin) return;
        const api = u.pathname.startsWith('/api/');
        // An API may answer 4xx on purpose (a lock is 423, an unknown code 404); a page or file may not.
        if (r.status() >= 500 || (!api && r.status() >= 400)) problems.push(`HTTP ${r.status()} for ${u.pathname}`);
      });
      page.on('requestfailed', (req) => {
        const u = new URL(req.url()), why = req.failure()?.errorText || '';
        // ERR_ABORTED is a navigation cancelling its own requests, not a fault.
        if (u.origin === origin && !/ERR_ABORTED/.test(why)) problems.push(`request failed: ${u.pathname} (${why})`);
      });
      const d = { name, ctx, page, problems };
      made.push(d);
      return d;
    };
    await use(make);
    const found = made.flatMap((d) => d.problems.map((p) => `[${d.name}] ${p}`));
    for (const d of made) await d.ctx.close().catch(() => {});
    if (found.length) testInfo.attach('page-problems.txt', { body: found.join('\n'), contentType: 'text/plain' });
    if (testInfo.status === testInfo.expectedStatus)
      expect(found, 'no script errors, unexpected dialogs or failed requests on any device').toEqual([]);
  },

  /** Student codes made in a test, deleted afterwards (the database is fresh
   *  each run anyway; this keeps one journey from seeing another's students). */
  students: async ({}, use) => {
    const codes = [];
    await use(codes);
    for (const c of codes) await deleteStudent(c);
  },
});

export { expect };
