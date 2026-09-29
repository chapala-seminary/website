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
  for (const s of ['JERSON VILLAFUERTE VALVERDE', 'Ministerios Pastorales', 'Con Honores', 'TRAYECTO DE CERTIFICADO',
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
// the Pentateuch, which Dr. Ted Rogers wrote: he is the Course Author on it, not Dr. Cook
{
  const seed = { cts_student: JSON.stringify({ name: 'Ana Lopez', track: 'certificate' }) };
  const en = (await build('CTSPentCertificate.html', 'en', seed)).text;
  ok(has(en, 'FOUNDER & INSTRUCTOR') && has(en, 'COURSE AUTHOR') && en.indexOf('FOUNDER & INSTRUCTOR') < en.indexOf('COURSE AUTHOR'),
    'Pentateuch PDF: Dr. Cook is Founder & Instructor and Dr. Rogers the Course Author');
  ok(!has(en, 'DIRECTOR OF EDUCATION'), 'Pentateuch PDF: Dr. Cook is not labelled the author, nor Dr. Rogers only the director');
  const es = (await build('CTSPentCertificate.html', 'es', seed)).text;
  ok(has(es, 'FUNDADOR E INSTRUCTOR') && has(es, 'AUTOR DEL CURSO'), 'Pentateuch PDF (Spanish): the same roles');
  const other = (await build('CTSPMCertificate.html', 'en', seed)).text;
  ok(other.indexOf('COURSE AUTHOR') < other.indexOf('DIRECTOR OF EDUCATION') && !has(other, 'FOUNDER & INSTRUCTOR'),
    'every other course: Dr. Cook the Course Author, Dr. Rogers the Director of Education');
}
// a degree diploma
{
  const seed = { cts_student: JSON.stringify({ name: 'Ana Lopez', track: 'mdiv' }) };
  const { text, errs } = await build('CTSMDivCertificate.html', 'en', seed);
  ok(!errs.length, 'degree PDF: no page errors', errs.join(' | '));
  ok(pages(text) === 1, 'degree PDF: one page');
  for (const s of ['Be it hereby known that', 'Master of Divinity', 'M.DIV.', 'Given at Chapala, Jalisco']) ok(has(text, s), `degree PDF says "${s}"`);
  const es = (await build('CTSCertificateOfMinistry.html', 'es', seed)).text;
  for (const s of ['Sépase por la presente que', 'Certificado de Ministerio', 'se le otorga el']) ok(has(es, s), `degree PDF (Spanish) says "${s}"`);
}

await browser.close();
console.log(`${checks} assertions on the downloadable PDF certificate`);
if (fails.length) {
  fails.forEach((f) => console.log('  FAIL: ' + f));
  console.log(`FAIL — ${fails.length} of ${checks}`);
  process.exit(1);
}
console.log('PASS — every certificate offers a one-page PDF, in English or Spanish.');
