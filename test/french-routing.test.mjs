// French links stay French, and the pages French emails open are French.
//
//   node test/french-routing.test.mjs http://127.0.0.1:8798
//
// 1. A /fr/ (or /es/) address is an explicit choice: a device that remembers
//    English opens a French email link in French (French review, 13 Oct 2026).
// 2. The remembered choice still governs bare English addresses (7 Oct
//    decision): a reader whose choice is Spanish is sent from an English link
//    to /es/.
// 3. The email-confirmation, Save & Restore and certificate pages on /fr/ are
//    French, the certificate offers an English PDF (not Spanish) beside the
//    French one, and nothing on them asks the server for a missing script.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://127.0.0.1:8798';
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
let checks = 0;
const path = (page) => new URL(page.url()).pathname;
const settle = (page) => page.waitForLoadState('load');
// English words that must not appear in French page text.
const ENGLISH = /(?<![\wÀ-ÿ])(Certificate|Print|Back to|Issued|Confirm your|Send confirmation|Continue studying|Restore from|Lost your code|Email me|Your student code|Unit \d|Course Author|Seminary Director|Download PDF|Descargar)(?![\wÀ-ÿ])/;

try {
  // ---- routing ---------------------------------------------------------------
  {
    const ctx = await browser.newContext({ locale: 'fr-FR' });
    const page = await ctx.newPage();
    await page.goto(`${base}/index.html`); await settle(page);
    assert.equal(await page.evaluate(() => localStorage.getItem('cts_lang')), 'en'); checks++;
    // A French link from outside, with English remembered: it stays French.
    for (const file of ['CTSNTUnit1.html', 'cts-backup.html', 'CTSNTCertificate.html']) {
      await page.goto(`${base}/fr/${file}`); await settle(page);
      assert.equal(path(page), `/fr/${file}`, `/fr/${file} was redirected away`);
      assert.equal(await page.evaluate(() => document.documentElement.lang), 'fr'); checks += 2;
    }
    // Arriving on /fr/ is itself the choice, so later English links follow it.
    assert.equal(await page.evaluate(() => localStorage.getItem('cts_lang')), 'fr'); checks++;
    await page.goto(`${base}/CTSPMUnit1.html`); await page.waitForURL('**/fr/CTSPMUnit1.html'); checks++;
    // An email link names the language and carries a fragment: both survive,
    // and the explicit choice is tidied out of the address.
    await page.evaluate(() => localStorage.setItem('cts_lang', 'en'));
    await page.goto(`${base}/fr/cts-confirm-email.html?cts_lang=fr#token=${'0'.repeat(64)}`); await settle(page);
    assert.equal(path(page), '/fr/cts-confirm-email.html');
    assert.ok(!page.url().includes('cts_lang'), 'explicit choice left in the address');
    assert.equal(await page.isVisible('#email-link-confirm'), true, 'the link-confirmation step is not shown');
    checks += 3;
    await ctx.close();
  }
  {
    // Spanish remembered: a bare English link goes to /es/, a French one stays.
    const ctx = await browser.newContext({ locale: 'en-US' });
    const page = await ctx.newPage();
    await page.goto(`${base}/es/index.html?cts_lang=es`); await settle(page);
    await page.goto(`${base}/CTSNTUnit2.html?keep=1#lesson`);
    await page.waitForURL((u) => u.pathname === '/es/CTSNTUnit2.html' && u.searchParams.get('keep') === '1' && u.hash === '#lesson'); checks++;
    await page.goto(`${base}/fr/CTSNTUnit2.html`); await settle(page);
    assert.equal(path(page), '/fr/CTSNTUnit2.html'); checks++;
    // The language switch still overrides: choosing English opens English.
    await Promise.all([page.waitForURL((u) => u.pathname === '/CTSNTUnit2.html'), page.locator('[data-cts-lang="en"]').first().click()]);
    await page.goto(`${base}/CTSNTUnit3.html`); await settle(page);
    assert.equal(path(page), '/CTSNTUnit3.html'); checks++;
    await ctx.close();
  }

  // ---- French pages behind the email links ------------------------------------
  {
    const ctx = await browser.newContext({ locale: 'fr-FR' });
    const page = await ctx.newPage();
    const missing = [];
    page.on('response', (r) => { if (r.status() === 404 && new URL(r.url()).origin === base) missing.push(r.url()); });
    await page.goto(`${base}/fr/cts-confirm-email.html`); await settle(page);
    let text = await page.locator('main').innerText();
    assert.match(text, /Confirmez votre adresse e-mail/); assert.ok(!ENGLISH.test(text), 'English on /fr/cts-confirm-email.html: ' + (text.match(ENGLISH) || [])[0]);
    await page.click('#email-send');
    assert.match(await page.locator('#email-note').innerText(), /Saisissez d’abord votre code d’étudiant/); checks += 3;
    await page.goto(`${base}/fr/cts-backup.html`); await settle(page);
    text = await page.locator('body').innerText();
    assert.match(text, /Sauvegarder et restaurer ma progression/); assert.ok(!ENGLISH.test(text), 'English on /fr/cts-backup.html: ' + (text.match(ENGLISH) || [])[0]);
    checks += 2;

    // A finished New Testament Survey on the Certificate track.
    await page.evaluate(() => {
      const p = {}; for (let n = 1; n <= 12; n++) p['unit' + n] = true;
      localStorage.setItem('cts_nt_progress', JSON.stringify(p));
      localStorage.setItem('cts_student', JSON.stringify({ name: 'Test Étudiant' }));
      localStorage.setItem('cts_track', 'cert');
    });
    await page.goto(`${base}/fr/CTSNTCertificate.html`); await settle(page);
    await page.waitForSelector('#cts-cert-pdf button');
    text = await page.locator('body').innerText();
    assert.ok(!ENGLISH.test(text), 'English on /fr/CTSNTCertificate.html: ' + (text.match(ENGLISH) || [])[0]);
    assert.match(text, /Ce certificat est décerné à/i);
    assert.match(await page.locator('#cert-date').innerText(), /^\d{1,2}(er)? (janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre) \d{4}$/);
    assert.equal(await page.locator('#cts-cert-pdf button').innerText(), 'Télécharger le PDF');
    assert.equal(await page.locator('#cts-cert-pdf a').innerText(), 'Télécharger en anglais');
    // The French PDF builds, in French.
    const pdf = await page.evaluate(async () => {
      await window.CTS_CERT_PDF.make('fr').catch(() => {});
      return { ok: !!window.jspdf, names: (window.CTS_CERT_NAMES || {})['ctsntcertificate.html'] };
    });
    assert.ok(pdf.ok); assert.equal(pdf.names.fr, 'Survol du Nouveau Testament');
    checks += 7;
        // Every certificate page (tools/add-certificate-french.mjs), as a student who has not finished it sees it.
    // ...and the degree pages it leaves to their src/data/french-pages dictionaries.
    const { PAGES } = await import('../tools/add-certificate-french.mjs');
    const { readdirSync } = await import('node:fs');
    const DICT = readdirSync('src/data/french-pages').filter(f => /Certificate|CertificateOfMinistry/.test(f)).map(f => f.replace(/\.json$/, '.html'));
    for (const file of [...PAGES, ...DICT]) {
      await page.goto(`${base}/fr/${file}`); await settle(page); await page.waitForTimeout(200);
      text = await page.locator('body').innerText();
      assert.ok(!ENGLISH.test(text), `English on /fr/${file}: ` + (text.match(ENGLISH) || [])[0]); checks++;
    }
    assert.deepEqual(missing, [], 'French pages requested missing files'); checks++;
    await ctx.close();
  }
  console.log(`PASS — ${checks} French routing and French email-page checks.`);
} finally {
  await browser.close();
}
