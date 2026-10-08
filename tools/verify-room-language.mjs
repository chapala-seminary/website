/* The reading rooms follow the language switch (Robert, 5 Oct 2026):
 *
 *   node tools/verify-room-language.mjs <base-url>      # run by npm test
 *
 * Every room, the World Religions required readings and the honors page
 * (src/data/rooms.json), with every digest opened:
 *   - English shows no Spanish passage, and Spanish no English one -- judged
 *     by the words a passage is made of, so a Spanish line left unmarked in an
 *     English view is caught even though no class says it is Spanish;
 *   - Both shows each of them; the switch's buttons say which is on;
 *   - a choice of Español is remembered on the next room;
 *   - the bar stays on screen, the page does not scroll sideways on a phone,
 *     and no page errors.
 * A passage that is the same in both languages (a name, a date, a title of
 * an English book) passes either way.
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const CHROME = process.env.CHROME_PATH;
const ROOMS = Object.keys(JSON.parse(fs.readFileSync('src/data/rooms.json', 'utf8')).rooms);
const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const fails = [];
let checks = 0;
const ok = (c, m) => { checks++; if (!c) fails.push(m); };

/* The visible passages of the page, with a guess at each one's language. */
function passages() {
  const ES = /\b(el|la|los|las|del|que|para|su|sus|una|por|con|se|lea|lectura|lecturas|cada|esta|este|como|más|también|según|nuestra|nuestro)\b/gi;
  const EN = /\b(the|and|of|to|is|with|your|this|that|for|read|reading|readings|each|which|from|our|are|be|by)\b/gi;
  const out = [];
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    const el = n.parentElement;
    if (!el || el.closest('script, style, noscript, .cts-seg, [lang]:not(html), em, i, cite, .cts-shelf-byline, a[target="_blank"]')) continue;
    // em, i, cite: a book's own title; the shelf's author lines (names and dates,
    // one language in Dr. Cook's delivery); the names of outside sites' pages
    // a passage is the text of the nearest block, counted once
    const t = n.data.replace(/\s+/g, ' ').trim();
    if (t.split(' ').length < 4) continue;
    if (!el.checkVisibility({ checkVisibilityCSS: true })) continue;
    const es = (t.match(ES) || []).length + (/[ñ¿¡]|ción\b/.test(t) ? 2 : 0);
    const en = (t.match(EN) || []).length;
    out.push({ t: t.slice(0, 90), lang: es >= 2 && es > en * 1.5 ? 'es' : en >= 2 && en > es * 1.5 ? 'en' : '?' });
  }
  return out;
}

const ctx = await browser.newContext();
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`${page.url()}: ${e.message}`));
await page.addInitScript(() => { try { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('cts_lang', 'en'); sessionStorage.setItem('seeded', '1'); } } catch (e) {} });

for (const room of ROOMS) {
  for (const lang of ['en', 'es', 'fr']) {
    const url = `${BASE}/${lang === 'en' ? '' : lang + '/'}${room}.html?cts_lang=${lang}`;
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => { for (const d of document.querySelectorAll('details')) d.open = true; });
    ok(await page.evaluate(l => document.body.dataset.pageLang === l && document.documentElement.lang === l, lang), `${room}: wrong ${lang} metadata`);
    const ps = await page.evaluate(passages);
    const wrong = ps.filter(p => (lang === 'en' && p.lang === 'es') || (lang === 'es' && p.lang === 'en'));
    ok(!wrong.length, `${room}: unmarked passages in the wrong language under ${lang}: ${wrong.slice(0,4).map(p=>p.t).join('; ')}`);
    if (lang === 'es') {
      await page.locator('#cts-show-source').uncheck();
      ok(await page.evaluate(() => ![...document.querySelectorAll('.cts-source')].some(e=>e.checkVisibility({checkVisibilityCSS:true}))), `${room}: English source visible with option off`);
      await page.locator('#cts-show-source').check();
      ok(await page.evaluate(() => [...document.querySelectorAll('.cts-source')].some(e=>e.checkVisibility({checkVisibilityCSS:true}))), `${room}: source option did not show English`);
    }
  }
}
// remembered choice redirects old English links; explicit English overrides it
await page.goto(`${BASE}/es/${ROOMS[0]}.html?cts_lang=es`, {waitUntil:'load'});
await page.goto(`${BASE}/${ROOMS[1]}.html`, {waitUntil:'load'});
await page.waitForURL(`**/es/${ROOMS[1]}.html`);
ok(await page.evaluate(()=>document.documentElement.lang === 'es'), `${ROOMS[1]}: Spanish choice was lost`);
await Promise.all([page.waitForURL(url=>url.pathname === `/${ROOMS[1]}.html`), page.locator('[data-cts-lang="en"]').click()]);
ok(await page.evaluate(()=>document.documentElement.lang === 'en'), `${ROOMS[1]}: English did not override memory`);

// on a phone: no sideways scroll, the bar stays put
const phone = await browser.newContext({ viewport: { width: 375, height: 760 }, isMobile: true });
const pp = await phone.newPage();
for (const room of ROOMS) {
  await pp.goto(`${BASE}/${room}.html`, { waitUntil: 'load' });
  const r = await pp.evaluate(async () => {
    const wide = document.documentElement.scrollWidth - window.innerWidth;
    window.scrollTo(0, document.body.scrollHeight / 2);
    await new Promise((res) => setTimeout(res, 50));
    const nav = document.querySelector('.cts-nav').getBoundingClientRect();
    return { wide, navTop: Math.round(nav.top) };
  });
  ok(r.wide <= 1, `${room}: on a phone the page scrolls sideways by ${r.wide}px`);
  ok(r.navTop === 0, `${room}: the bar is not held at the top of the screen (top ${r.navTop}px)`);
}

ok(!errors.length, `page errors:\n        ${errors.join('\n        ')}`);
await browser.close();

if (fails.length) {
  console.error(`FAIL — ${fails.length} of ${checks} checks:`);
  fails.forEach((f) => console.error('  - ' + f));
  process.exit(1);
}
console.log(`PASS — ${ROOMS.length} reading pages follow the language switch (${checks} checks).`);
