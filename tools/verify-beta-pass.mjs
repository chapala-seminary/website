/* Dr. Cook's real-device beta pass (30 Sept 2026), each item as a check.
 *
 *   1. A Spanish reader stays in Spanish: every unit page, and every other
 *      page with a language switch, opens in the language last chosen; and
 *      choosing "Both" does not forget it.
 *   2. In Spanish the greeting, the registration dropdowns and the honours
 *      box are Spanish.
 *   3. Fill-ins ignore accents, case and spaces -- a misspelling still fails.
 *   4. A short-answer model answer shows only under a question really
 *      answered, on every track.
 *   6. A passed unit says so, with the course count and the next step, at
 *      the top of the page and in the result.
 *   7. The catalog link goes to the course list.
 *
 *   node tools/verify-beta-pass.mjs http://127.0.0.1:8798
 */
import fs from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const CHROME = process.env.CHROME_PATH;
const fails = [];
let checks = 0;
const ok = (c, m) => { checks++; if (!c) fails.push(m); };
const FOUNDATION = ['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK'];
const html = (f) => fs.readFileSync(`dist/${f}`, 'utf8');
const units = fs.readdirSync('dist').filter((f) => f.endsWith('.html') && html(f).includes('window.CTS_UNIT')).sort();

const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
async function context(seed) {
  const ctx = await browser.newContext({ locale: 'en-US' });
  await ctx.addInitScript((s) => {
    if (sessionStorage.getItem('seeded')) return;
    for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v);
    sessionStorage.setItem('seeded', '1');
  }, seed);
  return ctx;
}
const student = (track) => ({
  cts_student: JSON.stringify({ name: 'Ana Prueba', track }), cts_track: track,
  cts_done_codes: JSON.stringify(FOUNDATION),
});

/* 1. every unit page opens in Spanish, with nothing of any length in English */
{
  const ctx = await context({ ...student('cert'), cts_lang: 'es' });
  const q = [...units];
  await Promise.all([0, 1, 2, 3, 4, 5].map(async () => {
    const p = await ctx.newPage();
    while (q.length) {
      const f = q.shift();
      await p.goto(`${BASE}/${f}`, { waitUntil: 'load' }); await p.waitForTimeout(100);
      const r = await p.evaluate(() => ({
        es: document.body.classList.contains('lang-es'),
        en: [...document.querySelectorAll('.lang-en')].find((e) => e.checkVisibility({ checkVisibilityCSS: true }) && e.textContent.trim().length > 20)?.textContent.trim().slice(0, 50) || null,
      }));
      ok(r.es && !r.en, `${f}: a Spanish reader got English (${r.es ? `"${r.en}"` : 'page in English'})`);
    }
    await p.close();
  }));
  await ctx.close();
}

/* 1b. the pages outside the units that have a switch follow it too */
{
  const ctx = await context({ ...student('cert'), cts_lang: 'es' });
  const p = await ctx.newPage();
  for (const f of ['index.html', 'CTSRomansCertificate.html', 'CTSHSCertificate.html', 'CTSRadicalCertificate.html',
                   'CTS_OTS_Christ-in-the-OT_digest.html', 'CTSOTSReadings.html', 'CTSGenesisCertificate.html']) {
    await p.goto(`${BASE}/${f}`, { waitUntil: 'load' }); await p.waitForTimeout(300);
    const r = await p.evaluate(() => {
      const c = document.body.classList;
      return c.contains('lang-es') || c.contains('show-es') || c.contains('es') || c.contains('spanish') || document.documentElement.lang === 'es';
    });
    ok(r, `${f}: opened in English for a Spanish reader`);
  }
  await ctx.close();
}

/* 1c. source visibility, then the next unit: still Spanish */
{
  const ctx = await context({ ...student('cert'), cts_lang: 'es' });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/CTSUnit1.html`, { waitUntil: 'load' });
  await p.waitForURL('**/es/CTSUnit1.html');
  await p.locator('#cts-show-source').check();
  await p.waitForTimeout(100);
  await p.goto(`${BASE}/CTSUnit2.html`, { waitUntil: 'load' }); await p.waitForTimeout(100);
  ok(await p.evaluate(() => document.body.classList.contains('lang-es')), 'showing the source on one unit sent the next unit back to English');
  await ctx.close();
}

/* 2. greeting, dropdowns, honours box */
{
  const ctx = await context({ ...student('cert'), cts_lang: 'es' });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/CTSUnit2.html`, { waitUntil: 'load' }); await p.waitForTimeout(200);
  const g = await p.evaluate(() => document.getElementById('greeting').textContent);
  ok(/Bienvenido, Ana Prueba — Certificado de Ministerio/.test(g), `the greeting in Spanish reads "${g}"`);
  const box = await p.evaluate(() => [...document.querySelectorAll('[data-cts-rrbox] *')].filter((e) => e.offsetParent !== null && !e.children.length).map((e) => e.textContent.trim()).join(' | '));
  ok(/Lecturas con Honores/.test(box) && !/Honors Readings|Open the Reading Room/.test(box), `the honours box in Spanish reads "${box}"`);
  await ctx.close();
  const ctx2 = await context({ cts_lang: 'es' });
  const h = await ctx2.newPage();
  await h.goto(`${BASE}/index.html`, { waitUntil: 'load' }); await h.waitForTimeout(300);
  const f = await h.evaluate(() => ({
    name: document.getElementById('reg-name').placeholder,
    track: [...document.querySelectorAll('#reg-track option')].map((o) => o.textContent),
    country: document.querySelector('#reg-country option[value="MX"]')?.textContent,
  }));
  ok(f.name === 'Nombre completo' && f.track[0] === 'Certificado de Ministerio' && f.country === 'Mexico · México'.split(' · ')[1],
    `the front-page registration in Spanish reads ${JSON.stringify(f)}`);
  await h.fill('#reg-name', 'Ana Prueba'); await h.selectOption('#reg-country', 'MX'); await h.click('#reg-save');
  const confirm = await h.evaluate(() => [...document.querySelectorAll('#reg-confirm *')].filter((e) => e.offsetParent !== null).map((e) => e.textContent).join(' '));
  ok(/Certificado de Ministerio/.test(confirm) && !/Certificate of Ministry/.test(confirm), `the registration confirmation in Spanish reads "${confirm}"`);
  await ctx2.close();
}

/* 3. Spanish accents, on the Spanish reading page; English is its source. */
{
  const ctx = await context({ ...student('ad'), cts_lang: 'es' });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/es/CTSUnit2.html?cts_lang=es`, { waitUntil: 'load' });
  const r = await p.evaluate(() => {
    const E = window.CTS_ENGINE, q = { answer: { en: 'geography', es: 'geografía' } }, q2 = { answer: { en: 'certainty', es: 'certeza' } }, q3 = { answer: { en: 'year', es: 'año' } };
    return [E.fillRight(q, 'geografia'), E.fillRight(q, '  GEOGRAFÍA '), E.fillRight(q2, 'certexa'), E.fillRight(q3, 'ano'), E.fillRight(q3, 'Año')];
  });
  ok(JSON.stringify(r) === '[true,true,false,false,true]', `fill-in accents: ${JSON.stringify(r)} (want geografia ✓, GEOGRAFÍA ✓, certexa ✗, ano ✗, Año ✓)`);
  await ctx.close();
}

/* 4. model answers only under a real answer -- on the Certificate track, where they are shown on submit */
{
  const ctx = await context(student('cert'));
  const p = await ctx.newPage();
  await p.goto(`${BASE}/CTSUnit2.html`, { waitUntil: 'load' });
  await p.evaluate(() => window.CTS_EXAM_VIEW?.open());
  await p.evaluate(() => {
    const t = document.querySelector('textarea[data-sa="0"]');
    t.value = 'Moses met God at the burning bush and was sent to deliver Israel from Egypt.';
    t.dispatchEvent(new Event('input', { bubbles: true }));
    // eight words is not yet a real attempt (Dr. Cook, 2 Oct: ten words, fifty characters)
    const u = document.querySelector('textarea[data-sa="1"]');
    u.value = 'God gave Moses the commandments on Mount Sinai.';
    u.dispatchEvent(new Event('input', { bubbles: true }));
    window.CTS_ENGINE.controls.submit().click();
  });
  await p.waitForTimeout(300);
  const r = await p.evaluate(() => [...document.querySelectorAll('.question[data-sa]')].map((q) => !!q.querySelector('.model-answer')));
  ok(r[0] === true && r.slice(1).every((x) => !x), `model answers shown under: ${r.map((x, i) => (x ? i + 1 : '')).filter(Boolean).join(', ') || 'none'} (want only 1)`);
  await ctx.close();
}

/* 6. a passed unit says so */
{
  const ctx = await context({ ...student('cert'), cts_ots_progress: JSON.stringify({ unit1: true, unit2: true }) });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/CTSUnit2.html`, { waitUntil: 'load' }); await p.waitForTimeout(200);
  const b = await p.evaluate(() => { const e = document.getElementById('cts-passed-banner'); return e && e.offsetParent !== null ? e.innerText : null; });
  ok(b && /Unit 2 passed/.test(b) && /2 of 13 units/.test(b) && /Go to Unit 3/.test(b), `a passed unit's banner reads ${JSON.stringify(b)}`);
  await p.goto(`${BASE}/CTSUnit3.html`, { waitUntil: 'load' }); await p.waitForTimeout(200);
  ok(await p.evaluate(() => !document.getElementById('cts-passed-banner')), 'an unpassed unit shows a "passed" banner');
  await ctx.close();
}

/* 7. the catalog link */
{
  const ctx = await context(student('cert'));
  const p = await ctx.newPage();
  await p.goto(`${BASE}/CTSOTSCertificate.html`, { waitUntil: 'load' });
  await p.click('a[href="/index.html#catalog"]');
  await p.waitForTimeout(2000);          // the front page scrolls smoothly
  const r = await p.evaluate(() => ({ url: location.pathname + location.hash, top: Math.round(document.getElementById('catalog').getBoundingClientRect().top) }));
  ok(r.url === '/index.html#catalog' && Math.abs(r.top) < 200, `the catalog link from a certificate lands at ${r.url}, the course list ${r.top}px from the top`);
  await ctx.close();
}

/* Audit, 30 Sept: the four program progress pages are readable with no
   courses done -- none is covered by the course lock -- and none offers a
   certificate to print. */
{
  const ctx = await context({ cts_student: JSON.stringify({ name: 'Ana Prueba', track: 'cert' }), cts_track: 'cert' });
  const p = await ctx.newPage();
  for (const f of ['CTSCertificateOfMinistry.html', 'CTSAssociateCertificate.html', 'CTSThMCertificate.html', 'CTSMDivCertificate.html']) {
    await p.goto(`${BASE}/${f}`, { waitUntil: 'load' }); await p.waitForTimeout(300);
    const r = await p.evaluate(() => ({
      lock: !!document.getElementById('cts-lock-overlay'),
      print: [...document.querySelectorAll('button')].some((b) => /print|imprimir/i.test(b.textContent) && b.offsetParent !== null && !b.disabled),
    }));
    ok(!r.lock, `${f}: covered by the course lock with no courses done`);
    ok(!r.print, `${f}: offers a certificate to print with no courses done`);
  }
  await ctx.close();
}

/* Next goes on only once the unit is passed, as on the old site (audit,
   30 Sept; decided 1 Oct). The unit numbers still open any unit. */
{
  const ctx = await context(student('cert'));
  const p = await ctx.newPage();
  let said = null;
  p.on('dialog', (d) => { said = d.message(); d.dismiss(); });
  await p.goto(`${BASE}/CTSBibleUnit1.html`, { waitUntil: 'load' });
  await p.click('#cts-next'); await p.waitForTimeout(500);
  ok(/CTSBibleUnit1\.html$/.test(p.url()) && /pass Unit 1 first/.test(said || ''), `Next before passing Unit 1: went to ${p.url()}, said "${said}"`);
  await p.evaluate(() => localStorage.setItem('cts_bible_progress', JSON.stringify({ unit1: true })));
  await p.reload({ waitUntil: 'load' }); said = null;
  await p.click('#cts-next'); await p.waitForURL(/CTSBibleUnit2\.html$/, { timeout: 5000 }).catch(() => {});
  ok(/CTSBibleUnit2\.html$/.test(p.url()) && !said, `Next after passing Unit 1: went to ${p.url()}`);
  await ctx.close();
}

await browser.close();
console.log(`${checks} assertions on Dr. Cook's beta pass (30 Sept)`);
if (fails.length) { fails.slice(0, 40).forEach((f) => console.log('  FAIL: ' + f)); console.log(`FAIL — ${fails.length}`); process.exit(1); }
console.log('PASS — Spanish carries through, fill-ins ignore accents, model answers wait for a real answer, and progress is plain.');
