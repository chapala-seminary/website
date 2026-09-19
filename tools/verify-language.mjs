// Does pressing Español actually put the page into Spanish — on every page?
//
// The unified engine replaced per-page inline scripts that each wired their own
// language control. It published setLang() and toggleLang() as globals for the
// handful of pages with an inline onclick and bound nothing on the rest, so the
// Spanish toggle silently did nothing on most of the site. Nothing caught it:
// the Stage 1 harness compared pages in their default state and never pressed
// the button.
//
// The site has at least six shapes of language control -- a single toggle that
// renames itself, three-button English/Español/Both groups, id-named buttons,
// inline onclick handlers -- so this presses whatever the student would press
// and checks the page text actually changed.
//
//   node tools/verify-language.mjs <base-url> [dist-dir]

import { chromium } from 'playwright';
import fs from 'fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const DIST = process.argv[3] || 'dist';
const CHROME = process.env.CHROME_PATH;
const CONCURRENCY = 8;

const pages = fs.readdirSync(DIST).filter((f) => /^CTS.*Unit\d+\.html$/.test(f)).sort();
const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const fails = [];
let done = 0;

const queue = pages.slice();
async function worker() {
  while (queue.length) {
    const f = queue.shift();
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    try {
      await page.goto(`${BASE}/${f}`, { waitUntil: 'load', timeout: 20000 });
      await page.evaluate(() => { localStorage.clear(); localStorage.setItem('cts_lang', 'en'); });
      await page.reload({ waitUntil: 'load', timeout: 20000 });
      await page.waitForTimeout(250);

      const before = await page.evaluate(() => document.body.innerText);
      const pressed = await page.evaluate(() => {
        // whatever a Spanish-speaking student would press
        const els = [...document.querySelectorAll('button, a, [onclick]')];
        const es = els.find((e) => {
          const t = (e.textContent || '').trim();
          return t.length < 40 && /espa[nñ]ol/i.test(t);
        });
        if (!es) return null;
        es.click();
        return (es.textContent || '').trim().slice(0, 30);
      });
      await page.waitForTimeout(400);
      const after = await page.evaluate(() => {
        // Every fragment the site marks as English, in all five of its
        // spellings. In Spanish none of them should be on screen.
        const sel = '.lang-en, .en-only, .block-en, .teach-en, .pane.en, #teach-en';
        const visible = [...document.querySelectorAll(sel)].filter((e) => {
          if (e.closest('.cts-seg')) return false;   // the control's own label
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && (e.textContent || '').trim().length > 0;
        });
        return {
          text: document.body.innerText,
          cls: document.body.className,
          english: visible.length,
        };
      });

      if (!pressed) fails.push(`${f}: no Español control on the page`);
      else if (before === after.text)
        fails.push(`${f}: pressed "${pressed}" and nothing changed (body class "${after.cls}")`);
      // Text changing is not the same as the page being in Spanish. 55 pages
      // carried no language class and, once their own stylesheet was gone,
      // showed both languages stacked -- which this check called a pass,
      // because Spanish had indeed appeared. It now asks the question the
      // student would: is the English gone?
      else if (after.english > 0)
        fails.push(`${f}: still showing ${after.english} English block(s) after pressing "${pressed}" (body class "${after.cls}")`);
      if (errs.length) fails.push(`${f}: page error — ${errs[0].slice(0, 90)}`);
    } catch (e) {
      fails.push(`${f}: ${String(e).slice(0, 90)}`);
    }
    await ctx.close();
    if (++done % 100 === 0) process.stdout.write(`  ${done}/${pages.length}\n`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
await browser.close();

console.log(`${pages.length} unit pages: pressed the Spanish control on each`);
if (!fails.length) console.log('PASS — every page switches to Spanish.');
else {
  console.log(`FAIL — ${fails.length}:`);
  fails.sort().slice(0, 25).forEach((f) => console.log('  ' + f));
  if (fails.length > 25) console.log(`  … and ${fails.length - 25} more`);
  process.exitCode = 1;
}
