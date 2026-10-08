/* Render every changed page in every generated language on desktop and phone.
 * Source visibility, preference migration and progress are checked separately. */
import fs from 'node:fs';
import { chromium } from 'playwright';
const BASE = process.argv[2] || 'http://127.0.0.1:8897';
const files = fs.readdirSync('.astro/language-base').filter(f => f.endsWith('.html') && !f.startsWith('_'));
const browser = await chromium.launch(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {});
const fails = []; let done = 0;
fails.push = function (...items) {if (this.length < 30) console.log("ISSUE", ...items); return Array.prototype.push.apply(this,items);};
const jobs = files.flatMap(file => ['en','es','fr'].flatMap(lang => [false,true].map(phone => ({file,lang,phone}))));
async function worker() {
  const ctx = await browser.newContext();
  await ctx.route("**/*", route => new URL(route.request().url()).origin === new URL(BASE).origin ? route.continue() : route.abort());
  await ctx.addInitScript(() => {
    // Study-page rendering requires the foundation. Gating itself remains
    // covered by verify-gating; do not bypass its overlay with force-clicks.
    if (!localStorage.getItem('cts_done_codes')) localStorage.setItem('cts_done_codes', JSON.stringify(['CTSOTS','CTSNT','CTSST','CTSEVANGELISM','CTSPM','CTSCH','WISESPEAK']));
  });
  const page = await ctx.newPage();
  let errors;
  page.on('pageerror', e => errors.push(e.message));
  while (jobs.length) {
    const {file,lang,phone} = jobs.shift(); errors = [];
    const label = `${lang}/${file} ${phone ? 'phone' : 'desktop'}`;
    try {
      await page.setViewportSize({width:phone ? 375 : 1280,height:phone ? 760 : 900});
      await page.goto(`${BASE}/${lang === 'en' ? '' : lang + '/'}${file}?cts_lang=${lang}`, {waitUntil:'load', timeout:20000});
      await page.waitForFunction(l => document.body?.dataset.pageLang === l && document.documentElement.lang === l, lang);
      const box = page.locator('#cts-show-source:not([disabled])');
      if (await box.count()) await box.check();
      await page.evaluate(() => {for (const d of document.querySelectorAll('details')) d.open = true;});
      const state = await page.evaluate(() => {
        const visible = el => !!el && el.checkVisibility({checkVisibilityCSS:true});
        const pairs = [...document.querySelectorAll('#lesson .cts-text-pair, main .cts-text-pair')].filter(e => e.querySelector(':scope > .cts-source') && visible(e));
        const pair = pairs.find(e => e.closest('p, li, .question'));
        const a = pair?.querySelector(':scope > .cts-reading')?.getBoundingClientRect();
        const b = pair?.querySelector(':scope > .cts-source')?.getBoundingClientRect();
        const exam = !!pair?.closest('.question, #kwContainer, .cts-fill-q');
        return {lang:document.documentElement.lang, wide:document.documentElement.scrollWidth-innerWidth,
          badExamSources:pairs.filter(e => e.closest('.question, #kwContainer, .cts-fill-q')).filter(e => {
            const reader = e.querySelector(':scope > .cts-reading').getBoundingClientRect(), source = e.querySelector(':scope > .cts-source').getBoundingClientRect();
            return source.top < reader.bottom-1;
          }).length,
          source:pair ? visible(pair.querySelector(':scope > .cts-source')) : null,
          below:!a || !b || b.top >= a.bottom-1, beside:!a || !b || b.left >= a.right-1, exam, controls:document.querySelectorAll('[data-cts-lang]').length,
          wrong:[...document.querySelectorAll('.cts-reading')].filter(e=>visible(e)&&![document.body.dataset.sourceLang,document.body.dataset.pageLang].includes(e.getAttribute('lang'))).length};
      });
      if (state.lang !== lang || state.controls !== 3) fails.push(`${label}: language or controls ${JSON.stringify(state)}`);
      if (state.wide > 1) fails.push(`${label}: sideways scroll ${state.wide}px`);
      if (state.source === false || ((phone || state.exam) && !state.below) || (!phone && !state.exam && !state.beside)) fails.push(`${label}: source text not visible/below translation`);
      if (state.badExamSources) fails.push(`${label}: exam source is not below its wording`);
      if (state.wrong) fails.push(`${label}: unexpected reading language`);
      if (errors.length) fails.push(`${label}: ${errors.join('; ')}`);
    } catch(e) { fails.push(`${label}: ${String(e).slice(0,200)}`); }
    if (++done % 300 === 0) console.log(`  ${done}/${files.length*6} renders`);
  }
  await ctx.close();
}
await Promise.all(Array.from({length:6},worker));
// Explicit choice wins over saved language; query and fragment survive.
const ctx = await browser.newContext(); const p = await ctx.newPage();
await p.goto(`${BASE}/CTSUnit1.html?cts_lang=en`);
await p.evaluate(() => {localStorage.setItem('cts_lang','both'); localStorage.setItem('cts_ots_u1_state',JSON.stringify({mcAnswers:[2,...Array(19).fill(null)],saAnswers:['A saved draft response.',...Array(9).fill('')],fillAnswers:['saved phrase',...Array(9).fill('')]}));});
await p.goto(`${BASE}/CTSUnit1.html?keep=1#lesson`);
await p.waitForURL('**/es/CTSUnit1.html?keep=1#lesson');
if (!(await p.locator('#cts-show-source').isChecked())) fails.push('legacy Both was not migrated to Spanish with source on');
if ((await p.locator('.option[data-mc="0"].selected').getAttribute('data-opt')) !== '2') fails.push('saved MC choice was lost on language navigation');
if ((await p.locator('input[data-fill="0"]').inputValue()) !== 'saved phrase' || (await p.locator('textarea[data-sa="0"]').inputValue()) !== 'A saved draft response.') fails.push('saved fill-in or short-answer draft was lost');
await Promise.all([p.waitForURL(url=>url.pathname === '/CTSUnit1.html' && url.search === '?keep=1' && url.hash === '#lesson'),p.locator('[data-cts-lang="en"]').click()]);
if (await p.evaluate(()=>localStorage.getItem('cts_lang')) !== 'en') fails.push('explicit English choice did not override Spanish memory');
await ctx.close();
// Storage denial still permits explicit navigation and source toggling.
const blocked = await browser.newContext({locale:'es-ES'}); const bp = await blocked.newPage();
await bp.addInitScript(() => {Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked storage');}});});
await bp.goto(`${BASE}/es/CTSUnit1.html?cts_lang=es`); await bp.locator('#cts-show-source').check();
if (await bp.evaluate(()=>document.body.dataset.showSource) !== 'true') fails.push('source switch failed with storage disabled');
await Promise.all([bp.waitForURL(url=>url.pathname === '/CTSUnit1.html'),bp.locator('[data-cts-lang="en"]').click()]);
await bp.reload({waitUntil:'load'});
if (await bp.evaluate(()=>document.documentElement.lang) !== 'en') fails.push('explicit choice was lost on reload with storage denied');
await browser.close();
console.log(`${done} renders across ${files.length} pages × 3 languages × 2 screen sizes`);
if(fails.length){fs.writeFileSync('/tmp/cts-language-browser-failures.txt',fails.join('\n'));console.error(`FAIL — ${fails.length}:\n${fails.slice(0,35).join('\n')}`);process.exitCode=1;}
else console.log('PASS — language pages, source layout, preferences and saved answers.');
