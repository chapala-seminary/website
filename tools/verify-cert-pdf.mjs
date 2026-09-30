/* The downloadable PDF certificate (public/assets/js/cts-cert-pdf.js).
 *
 * Students asked for their certificates as sharp PDFs, and in Spanish. This
 * checks that every certificate page offers it, that the course names it uses
 * are the catalog's (tools/build-cert-names.mjs --check), and -- by building
 * real PDFs in a browser -- that a course certificate and a degree diploma
 * each come out as one page, in the language asked for, with the student's
 * name, the course or degree, the track, honors when earned, the date and the
 * verification code. verify-certificate-unlock.mjs checks the button appears
 * with an unlocked diploma and never without one.
 *
 *   node tools/verify-cert-pdf.mjs http://127.0.0.1:8798
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const CHROME = process.env.CHROME_PATH;
const fails = [];
let checks = 0;
const ok = (c, label, detail) => { checks++; if (!c) fails.push(label + (detail ? `\n        ${detail}` : '')); };

// ---- static ---------------------------------------------------------------------
const certs = fs.readdirSync('public').filter((f) => /certificate/i.test(f) && f.endsWith('.html'));
for (const f of certs) {
  const n = (fs.readFileSync(`public/${f}`, 'utf8').match(/<script src="assets\/js\/cts-cert-pdf\.js" defer><\/script>/g) || []).length;
  ok(n === 1, `${f} loads cts-cert-pdf.js once`, `found ${n}`);
}
try { execFileSync('node', ['tools/build-cert-names.mjs', '--check'], { stdio: 'pipe' }); ok(true); }
catch (e) { ok(false, 'cts-cert-names.js matches the catalog', String(e.stderr || e.message).trim()); }
ok(/jsPDF/.test(fs.readFileSync('public/assets/vendor/jspdf.umd.min.js', 'utf8').slice(0, 400)), 'the jsPDF library is in place, with its licence header');

// ---- building PDFs ------------------------------------------------------------------
const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});

/* Open a certificate page with a student in storage and build its PDF through
   the page's own code, catching the bytes instead of saving a file. */
async function build(page, lang, seed, verify) {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`${BASE}/${page}`, { waitUntil: 'load' });
  await p.evaluate((s) => { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, seed);
  await p.reload({ waitUntil: 'load' });
  const text = await p.evaluate(async ([lang, verify]) => {
    if (verify) {                       // the line cts-certify.js adds once registered
      const d = document.createElement('div'); d.id = 'cts-cert-verify';
      d.textContent = 'Verification code: ' + verify + ' · chapalaseminary.org/verify/' + verify;
      document.body.appendChild(d);
    }
    const s = document.createElement('script'); s.src = 'assets/vendor/jspdf.umd.min.js';
    document.head.appendChild(s); await new Promise((r) => { s.onload = r; });
    let bytes = null;
    window.jspdf.jsPDF.API.save = function () { bytes = this.output(); return this; };
    await window.CTS_CERT_PDF.make(lang);
    return bytes;
  }, [lang, verify]);
  await ctx.close();
  return { text: text || '', errs };
}
const pages = (t) => (t.match(/\/Type \/Page\b(?!s)/g) || []).length;
const has = (t, s) => t.includes(s);

// a course, in Spanish, with honors and a verification code
{
  const seed = { cts_student: JSON.stringify({ name: 'Jerson Villafuerte Valverde', track: 'certificate' }) };
  seed['cts_honors_v1:PM'] = '1';
  const { text, errs } = await build('CTSPMCertificate.html', 'es', seed, 'AB12-CD34');
  ok(!errs.length, 'course PDF: no page errors', errs.join(' | '));
  ok(text.startsWith('%PDF-'), 'course PDF: a PDF is produced');
  ok(pages(text) === 1, 'course PDF: one page', `pages: ${pages(text)}`);
  for (const s of ['JERSON VILLAFUERTE VALVERDE', 'Ministerio Pastoral', 'Con Honores', 'PROGRAMA: CERTIFICADO DE MINISTERIO',
    'Seminario Teológico de Chapala', 'Fecha de finalización', 'AB12-CD34', 'Wayne Cook, Th.D.', 'Ted Rogers, D.Min.']) {
    ok(has(text, s), `course PDF (Spanish) says "${s}"`);
  }
  ok(!has(text, 'Pastoral Ministries'), 'course PDF (Spanish) is not in English');
  ok((text.match(/\/Subtype \/Image/g) || []).length >= 2, 'course PDF: both signatures are embedded');
}
// the same course in English, no honors, on the M.Div. version of the page
{
  const seed = { cts_student: JSON.stringify({ name: 'Ana Lopez', track: 'certificate' }) };
  const { text } = await build('CTSPMMDivCertificate.html', 'en', seed);
  for (const s of ['ANA LOPEZ', 'Pastoral Ministries', 'MASTER OF DIVINITY TRACK', 'Date of Completion']) ok(has(text, s), `course PDF (English) says "${s}"`);
  ok(!has(text, 'With Honors'), 'course PDF: no honors unless the honors reading is done');
}
/* Who signs, as the Certificate Maker lays it out (src/data/certificate-courses.json):
   the author on the left, the Seminary Director on the right. */
{
  const seed = { cts_student: JSON.stringify({ name: 'Ana Lopez', track: 'certificate' }) };
  const order = (t, a, b) => has(t, a) && has(t, b) && t.indexOf(a) < t.indexOf(b);
  const pm = (await build('CTSPMCertificate.html', 'en', seed)).text;
  ok(order(pm, 'Wayne Cook, Th.D.', 'Ted Rogers, D.Min.') && order(pm, 'COURSE AUTHOR', 'SEMINARY DIRECTOR') && !has(pm, 'FOUNDER'),
    'a course Dr. Cook wrote: Dr. Cook, Course Author; Dr. Rogers, Seminary Director');
  ok(!has(pm, 'DIRECTOR OF EDUCATION'), 'the director signs as Seminary Director, as the Certificate Maker has it');
  const pent = (await build('CTSPentCertificate.html', 'en', seed)).text;
  ok(order(pent, 'Ted Rogers, D.Min.', 'Wayne Cook, Th.D.') && order(pent, 'COURSE AUTHOR · SEMINARY DIRECTOR', 'FOUNDER'),
    'the Pentateuch, which Dr. Rogers wrote: Dr. Rogers, Course Author and Director; Dr. Cook, Founder');
  const pentEs = (await build('CTSPentCertificate.html', 'es', seed)).text;
  ok(has(pentEs, 'AUTOR DEL CURSO · DIRECTOR DEL SEMINARIO') && has(pentEs, 'FUNDADOR') && has(pentEs, 'Pentateuco'), 'the same in Spanish');
  const rom = (await build('CTSRomansCertificate.html', 'en', seed)).text;
  ok(order(rom, 'Wayne Cook, Th.D.', 'Ted Rogers, D.Min.') && order(rom, 'COURSE AUTHOR', 'COURSE AUTHOR · SEMINARY DIRECTOR'),
    'Romans, by both: each signs as Course Author');
  const re = (await build('CTSRECertificate.html', 'en', seed)).text;
  ok(has(re, 'Glenda Rogers') && !has(re, 'Wayne Cook, Th.D.') && order(re, 'COURSE AUTHOR', 'SEMINARY DIRECTOR') && has(re, 'Ruth and Esther'),
    'Ruth and Esther: Glenda Rogers, Course Author, by name; Dr. Rogers, Seminary Director');
  const imgs = (t) => (t.match(/\/Subtype \/Image/g) || []).length;   // a PNG with transparency counts twice
  ok(imgs(re) > 0 && imgs(re) < imgs(pm), `and only the one signature on file is an image (${imgs(re)} image objects, ${imgs(pm)} with two)`);
  const ce = (await build('CTSCECertificate.html', 'es', seed)).text;
  ok(has(ce, 'Andi Cook') && has(ce, 'Educación Cristiana'), 'Christian Education: Andi Cook, Course Author');
}
// a degree diploma
{
  const seed = { cts_student: JSON.stringify({ name: 'Ana Lopez', track: 'mdiv' }) };
  const { text, errs } = await build('CTSMDivCertificate.html', 'en', seed);
  ok(!errs.length, 'degree PDF: no page errors', errs.join(' | '));
  ok(pages(text) === 1, 'degree PDF: one page');
  for (const s of ['Be it hereby known that', 'Master of Divinity', 'M.DIV.', 'Given at Chapala, Jalisco']) ok(has(text, s), `degree PDF says "${s}"`);
  const es = (await build('CTSCertificateOfMinistry.html', 'es', seed)).text;
  for (const s of ['Por la presente se hace constar que', 'Certificado de Ministerio', 'se le otorga el']) ok(has(es, s), `degree PDF (Spanish) says "${s}"`);
}

await browser.close();
console.log(`${checks} assertions on the downloadable PDF certificate`);
if (fails.length) {
  fails.forEach((f) => console.log('  FAIL: ' + f));
  console.log(`FAIL — ${fails.length} of ${checks}`);
  process.exit(1);
}
console.log('PASS — every certificate offers a one-page PDF, in English or Spanish.');
