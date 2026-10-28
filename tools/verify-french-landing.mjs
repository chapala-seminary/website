/* The home page must be wholly French, including states rendered after load.
 * Use synthetic registration data only; API writes are blocked in this check. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'node-html-parser';
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://127.0.0.1:8798';
const root = parse(fs.readFileSync('dist/fr/index.html', 'utf8'));
// The textbook and reading directories are on the Study Library (issue #186).
const library = parse(fs.readFileSync('dist/fr/CTSStudyLibrary.html', 'utf8'));
assert.equal(library.querySelector('html').getAttribute('lang'), 'fr');
assert.equal(library.querySelectorAll('[data-cts-fallback]').length, 0);
// Like the other static pages translated by a dictionary (src/data/french-pages),
// its French is published as a provisional translation for review.
assert.equal(library.querySelector('.topbar .mark .cts-reading').text.trim(), 'Séminaire théologique de Chapala');
assert.ok(library.querySelectorAll('.cts-reading').every(n=>n.getAttribute('lang') === 'fr'));
assert.ok(root.querySelector('a[href^="/fr/CTSStudyLibrary.html"]'), 'the French home page links to the French Study Library');
// The seven foundation courses first, in French.
assert.equal(root.querySelectorAll('#catalog a.fcard').length, 7);
for (const link of root.querySelectorAll('#catalog a.fcard')) assert.ok(link.getAttribute('href').startsWith('/fr/'));
assert.equal(root.querySelector('html').getAttribute('lang'), 'fr');
assert.equal(root.querySelectorAll('[data-cts-fallback]').length, 0);
assert.equal(root.querySelectorAll('.cts-translation-pending').length, 0);
assert.ok(root.querySelectorAll('.cts-reading').every(n=>n.getAttribute('lang') === 'fr'));
assert.equal(root.querySelectorAll('#catalog a.course').length, 65);
// The 45 core textbooks and reading sets; the electives' (slug "elec…") are listed apart as each is added.
const slugs = (d) => fs.readdirSync(d).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5));
const electiveReadings = slugs('src/content/readings').filter((s) => s.startsWith('elec')).length;
const electiveBooks = slugs('src/content/textbooks').filter((s) => s.startsWith('elec')).length;
assert.equal(library.querySelectorAll('#textbooks a.textbook:not(.reading)').length, 45 + electiveBooks);
assert.equal(library.querySelectorAll('#elective-textbooks a.textbook:not(.reading)').length, electiveBooks);
assert.equal(library.querySelectorAll('#required-readings a.textbook.reading').length, 45);
assert.equal(library.querySelectorAll('#elective-readings a.textbook.reading').length, electiveReadings);
assert.equal(library.querySelectorAll('#textbooks a.tb-test-link').length, 90 + electiveReadings + electiveBooks);
assert.ok(root.querySelector('#catalog').text.includes('en anglais, en espagnol et en français'));
// Every course has a French draft, so every card carries the badge.
assert.equal(root.querySelectorAll('#catalog a.course .c-fr').length, 65);
assert.ok(root.querySelector('#programs')?.text.includes('15 cours') || root.text.includes('Niveau master · 15 cours'));
for (const link of root.querySelectorAll('#catalog a.course')) assert.ok(link.getAttribute('href').startsWith('/fr/'));
for (const link of library.querySelectorAll('#textbooks a.textbook')) assert.ok(link.getAttribute('href').startsWith('/fr/'));
for (const node of root.querySelectorAll('script[type="application/ld+json"]')) {
  const data = JSON.parse(node.innerHTML);
  if (data['@type'] === 'FAQPage') {
    assert.equal(data.inLanguage, 'fr');
    assert.equal(data.mainEntity.length, 9);
    assert.ok(data.mainEntity.every(q=>!q.name.startsWith('What ') && q.acceptedAnswer.text));
  }
}
const browser = await chromium.launch();
try {
  // A visible ancestor's text must not contain the other language's hidden
  // source. Keep the existing English/Spanish signup behavior intact.
  for (const lang of ['en', 'es']) {
    const page = await browser.newPage({locale:lang});
    await page.route('**/*', route => {
      const url = route.request().url();
      if (url.includes('/api/')) return route.fulfill({status:503,body:'{}',contentType:'application/json'});
      return url.startsWith(base) ? route.continue() : route.abort();
    });
    await page.goto(`${base}/${lang === 'es' ? 'es/' : ''}index.html?cts_lang=${lang}`);
    await page.locator('#reg-name').fill('Landing fixture');
    await page.locator('#reg-email').fill('landing-fixture@example.invalid');
    await page.locator('#reg-country').selectOption('FR');
    await page.locator('#reg-save').click();
    const text = await page.evaluate(() => [...document.querySelectorAll('#reg-confirm *')]
      .filter(e => e.offsetParent !== null).map(e => e.textContent).join(' '));
    assert.ok(text.includes(lang === 'es' ? 'Certificado de Ministerio' : 'Certificate of Ministry'));
    assert.ok(!text.includes(lang === 'es' ? 'Certificate of Ministry' : 'Certificado de Ministerio'));
    await page.close();
  }
  for (const width of [1280, 390]) {
    const context = await browser.newContext({ extraHTTPHeaders: { 'x-test-grading-mode': 'shadow' }, viewport:{width,height:900},locale:'fr-FR'});
    const page = await context.newPage();
    const errors=[]; page.on('pageerror', e=>errors.push(e.message));
    // Isolate presentation checks from database state and external resources.
    await page.route('**/*', route => {
      const url=route.request().url();
      if (url.includes('/api/')) return route.fulfill({status:503,body:'{}',contentType:'application/json'});
      return url.startsWith(base) ? route.continue() : route.abort();
    });
    await page.goto(`${base}/fr/index.html?cts_lang=fr`);
    await page.locator('#reg-name').waitFor();
    assert.equal(await page.locator('#reg-name').getAttribute('placeholder'), 'Nom complet');
    assert.equal(await page.locator('#reg-country option[value="MX"]').textContent(), 'Mexique');
    assert.equal(await page.locator('#reg-heard option[value="referral"]').textContent(), 'Pasteur ou ami');
    assert.equal(await page.locator('#reg-track option[value="mdiv"]').textContent(), 'Master en théologie pastorale (M.Div.)');
    assert.equal(await page.locator('.cts-language-choices').getAttribute('aria-label'), 'Langue');
    assert.ok(await page.locator('.cts-source-control').innerText().then(t=>t.includes('Afficher l’anglais')));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1));
    await page.locator('#cts-show-source').check();
    assert.ok(await page.locator('#catalog .cts-source').first().isVisible());
    await page.locator('#cts-show-source').uncheck();
    assert.ok(!await page.locator('#catalog .cts-source').first().isVisible());
    let dialog='';page.on('dialog',async d=>{dialog=d.message();await d.dismiss();});
    await page.locator('#reg-save').click();
    assert.equal(dialog, 'Veuillez saisir votre nom');
    await page.locator('#reg-name').fill('French landing fixture');
    await page.locator('#reg-save').click();
    assert.equal(dialog, 'Veuillez sélectionner votre pays');
    await page.locator('#reg-email').fill('not-an-address');
    await page.locator('#reg-save').click();
    assert.equal(dialog, 'Laissez l’e-mail vide pour vous inscrire, ou saisissez une adresse valide afin de récupérer votre code et de recevoir le certificat.');
    await page.locator('#reg-email').fill('');
    await page.locator('#reg-country').selectOption('FR');
    await page.locator('#reg-track').selectOption('mdiv');
    await page.locator('#reg-save').click();
    assert.ok((await page.locator('#reg-confirm').innerText()).includes('Votre inscription est enregistrée'));
    assert.ok((await page.locator('#reg-confirm').innerText()).includes('Master en théologie pastorale'));
    await page.reload();
    assert.ok((await page.locator('#reg-confirm').innerText()).includes('Vous êtes déjà inscrit sur cet appareil'));
    // A synthetic backend result exercises the existing-record UI without
    // reading or modifying any student records.
    await page.evaluate(()=>{
      window.CTS_SYNC={existing:()=>true, emailCode:async()=>({ok:true}), restore:async()=>({ok:false}), available:async()=>false, code:()=> 'CTS-TEST-TEST-TEST'};
      ctsShowExisting();
    });
    assert.ok((await page.locator('#reg-existing').innerText()).includes('Un dossier étudiant existe déjà'));
    await page.locator('#reg-existing-email').click();
    await page.waitForFunction(()=>document.querySelector('#reg-existing-sent').innerText.includes('Envoyé.'));
    await page.locator('#reg-existing-restore').click();
    assert.ok((await page.locator('#reg-existing-note').innerText()).includes('Saisissez d’abord le code'));
    await page.locator('#reg-existing-code').fill('CTS-TEST-TEST-TEST');
    await page.locator('#reg-existing-restore').click();
    await page.waitForFunction(()=>document.querySelector('#reg-existing-note').innerText.includes('Aucun dossier'));
    assert.deepEqual(errors,[]);
    await context.close();
  }
  console.log(`French landing: complete copy, 65 courses, 45 core and ${electiveBooks} elective textbooks, 45 core and ${electiveReadings} elective reading sets, metadata, mobile layout, source toggle and registration states — PASS`);
} finally { await browser.close(); }
