// Does any page scroll sideways on a phone?
//
// The seminary was built for people studying on their phones, so a page that
// scrolls horizontally is a real defect rather than a cosmetic one -- and it is
// invisible on a laptop, which is where it always gets missed. Three pages had
// it and nobody had noticed:
//
//   the front page   the registration fields sat in a grid column sized by the
//                    longest <option> in the country list, so every field was
//                    522px wide in a 390px viewport
//   CTSBeforeYouBegin  the recognitions table's first column was nowrap
//   CTS_ARCHIVE_INDEX  two columns of long, unbreakable page names
//
// A sample rather than all 800 pages: one unit, one certificate and one reading
// room per course, a few digests, and every standalone page. Pages of the same
// family share a template, so a fourth Genesis unit adds nothing a first does
// not already cover.
//
//   node tools/verify-mobile.mjs <base-url> [dist-dir] [width]

import { chromium } from 'playwright';
import fs from 'fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const DIST = process.argv[3] || 'dist';
const WIDTH = Number(process.argv[4] || 390);      // iPhone 14/15, a common floor
const CHROME = process.env.CHROME_PATH;
const CONCURRENCY = 8;

const family = (f) => {
  let m;
  if ((m = /^(CTS[A-Za-z0-9]*)Unit\d+\.html$/.exec(f))) return `unit:${m[1]}`;
  if ((m = /^(CTS[A-Za-z0-9]*?)(MDiv|ThM)?Certificate\.html$/.exec(f))) return `cert:${m[1]}`;
  if ((m = /^(CTS[A-Za-z0-9]*)Readings\.html$/.exec(f))) return `readings:${m[1]}`;
  if (/_digest/.test(f)) return 'digest';
  return `page:${f}`;                                // standalone pages: all of them
};

const seen = new Map();
// Files beginning with "_" are fixtures the test run drops into dist/ -- the
// pre-migration front page the gating check compares against, above all. They
// are not pages of the site and are not held to its layout.
for (const f of fs.readdirSync(DIST).filter((f) => f.endsWith('.html') && !f.startsWith('_')).sort()) {
  const k = family(f);
  const cap = k === 'digest' ? 5 : 1;
  const got = seen.get(k) || [];
  if (got.length < cap) seen.set(k, [...got, f]);
}
const pages = [...seen.values()].flat();

const bad = [];
const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const queue = pages.slice();

async function worker() {
  while (queue.length) {
    const f = queue.shift();
    const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 844 } });
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE}/${f}`, { waitUntil: 'load', timeout: 20000 });
      await page.waitForTimeout(150);
      const r = await page.evaluate(() => {
        const d = document.documentElement;
        if (d.scrollWidth <= d.clientWidth + 1) return null;
        // name what actually sticks out, so the failure is actionable
        const culprits = [...document.querySelectorAll('body *')]
          .filter((e) => e.getBoundingClientRect().right > d.clientWidth + 1)
          .map((e) => e.tagName.toLowerCase() +
            (e.id ? '#' + e.id : e.className ? '.' + String(e.className).split(' ')[0] : '') +
            '=' + Math.round(e.getBoundingClientRect().width) + 'px');
        return { scrollWidth: d.scrollWidth, culprits: [...new Set(culprits)].slice(0, 4) };
      });
      if (r) bad.push({ f, ...r });
    } catch (e) {
      bad.push({ f, error: String(e).slice(0, 100) });
    }
    await ctx.close();
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
await browser.close();

console.log(`${pages.length} pages checked at ${WIDTH}px (one per template family)`);
if (!bad.length) {
  console.log('PASS — no page scrolls sideways on a phone.');
} else {
  console.log(`FAIL — ${bad.length} scroll sideways:`);
  for (const x of bad.sort((a, b) => a.f.localeCompare(b.f)))
    console.log(`  ${x.f} — ${x.error || `${x.scrollWidth}px wide: ${x.culprits.join('  ')}`}`);
  process.exitCode = 1;
}
