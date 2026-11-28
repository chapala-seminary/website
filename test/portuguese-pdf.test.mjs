// Runs the shipped PDF code in Chromium with synthetic local data only.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createServer} from 'node:http';
import {chromium} from 'playwright';

const output = process.env.PT_PDF_OUTPUT || '/tmp/cts-portuguese-pdfs';
fs.mkdirSync(output, {recursive: true});
const server = createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  if (pathname.startsWith('/pt/')) {
    response.setHeader('content-type', 'text/html; charset=utf-8');
    response.end(`<!doctype html><html lang="pt"><body data-page-lang="pt">
      <div id="diploma">Synthetic certificate</div><div><button>Imprimir</button></div>
      <script>localStorage.clear(); localStorage.setItem('cts_student', JSON.stringify({name:'Estudante de Teste Ação'})); localStorage.setItem('cts_track','cert');</script>
      <script src="/assets/js/cts-cert-pdf.js"></script></body></html>`);
    return;
  }
  const file = path.resolve('public', '.' + pathname);
  if (!file.startsWith(path.resolve('public') + path.sep) || !fs.existsSync(file)) {response.writeHead(404).end(); return;}
  response.setHeader('content-type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.png') ? 'image/png' : 'application/octet-stream');
  response.end(fs.readFileSync(file));
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch(process.env.CHROME_PATH ? {executablePath: process.env.CHROME_PATH} : {});
try {
  const page = await browser.newPage();
  for (const file of ['CTSNTCertificate.html', 'CTSHermeneuticsCertificate.html', 'CTSCertificateOfMinistry.html', 'CTSAssociateCertificate.html', 'CTSThMCertificate.html', 'CTSMDivCertificate.html']) {
    await page.goto(`http://127.0.0.1:${server.address().port}/pt/${file}`);
    await page.waitForSelector('#cts-cert-pdf button');
    assert.equal(await page.locator('#cts-cert-pdf button').innerText(), 'Baixar PDF');
    const downloadPromise = page.waitForEvent('download');
    await page.evaluate(() => window.CTS_CERT_PDF.make('pt'));
    const download = await downloadPromise;
    assert.match(download.suggestedFilename(), /-PT\.pdf$/);
    await download.saveAs(path.join(output, file.replace('.html', '.pdf')));
    const names = await page.evaluate(() => window.CTS_CERT_NAMES);
    assert.ok(Object.values(names).every(course => course.pt));
  }
  console.log('PASS — six Portuguese PDFs, localized buttons, filenames and all certificate names. Visual review is separate.');
} finally {await browser.close(); await new Promise(resolve => server.close(resolve));}
