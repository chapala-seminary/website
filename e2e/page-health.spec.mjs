/* Every kind of page, in every language, opens cleanly.
 *
 * The site has 1,873 pages per language, written by hand over years and
 * generated since, so a change to one shared script can break a kind of page
 * nobody opened while making it. This opens a few pages of every kind -- unit,
 * course certificate, degree page, reading room and its test, textbook test,
 * final, paper, course page, digest, the front and help pages -- in English,
 * Spanish, French and Swahili, as a registered student and (English) as a
 * first-time visitor, and fails on any script error, console error, unexpected
 * dialog, page or file of the site that does not load, or a page with no title.
 *
 * Three pages of each kind by default: the first, middle and last by name, so
 * a run is repeatable. E2E_SWEEP=all opens every page of every kind (slow;
 * for a nightly run or before a large release).
 */
import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from './fixtures.mjs';
import { person } from './lib/site.mjs';
import { signUp } from './lib/student.mjs';

const DIST = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../dist');
const KINDS = {
  'unit page': /(?:Unit\d+|_unit\d+)\.html$/,
  'course certificate': /^(?!CTS(?:CertificateOfMinistry|AssociateCertificate|ThMCertificate|MDivCertificate)\.html$).*[Cc]ertificate\.html$/,
  'degree page': /^CTS(?:CertificateOfMinistry|AssociateCertificate|ThMCertificate|MDivCertificate)\.html$/,
  'reading room': /Readings\.html$/,
  'reading test': /ReadingsTest\.html$/,
  'textbook test': /^CTSTextbook.*Test\.html$/,
  'final exam': /Final\.html$/,
  'ministry paper': /Paper\.html$/,
  "master's page": /Masters\.html$/,
  'course page': /Course\.html$/,
  'reading digest': /_digest\.html$/,
  'front and help pages': /^(?:index|START_HERE|CTSAbout|cts-backup|cts-honors|cts-confirm-email)\.html$/,
};
const LANGS = ['en', 'es', 'fr', 'sw'];
const ALL = process.env.E2E_SWEEP === 'all';

function sample(lang, re) {
  const dir = lang === 'en' ? DIST : path.join(DIST, lang);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.html') && re.test(f)).sort();
  if (ALL || files.length <= 3) return files;
  return [...new Set([files[0], files[Math.floor(files.length / 2)], files[files.length - 1]])];
}
const urlOf = (lang, f) => `/${lang === 'en' ? '' : lang + '/'}${f}`;

/* One registered student, shared by every page here: the sweep reads pages;
 * the journeys are where state changes. */
let studentState;
test.beforeAll(async ({ browser, baseURL }, testInfo) => {
  test.setTimeout(120_000);
  const ctx = await browser.newContext({ baseURL });
  const page = await ctx.newPage();
  await signUp(page, { ...person('Sweep'), track: 'mdiv' });
  studentState = testInfo.outputPath('student-state.json');
  await ctx.storageState({ path: studentState });
  await ctx.close();
});

async function sweep(device, who, lang, files) {
  const d = await device(`${who}, ${lang}`);
  if (who === 'student') {
    // the registered student's browser storage, on this device
    const { origins } = JSON.parse(fs.readFileSync(studentState, 'utf8'));
    await d.ctx.addInitScript((items) => {
      if (sessionStorage.getItem('__e2e_seeded')) return;
      for (const { name, value } of items) localStorage.setItem(name, value);
      sessionStorage.setItem('__e2e_seeded', '1');
    }, origins[0]?.localStorage || []);
  }
  const consoleErrors = [];
  d.page.on('console', (m) => {
    // ERR_BLOCKED_BY_CLIENT is this suite refusing a request to another site (fixtures.mjs), not the page failing.
    if (m.type() === 'error' && !/ERR_BLOCKED_BY_CLIENT/.test(m.text())) consoleErrors.push(`console error on ${d.page.url()}: ${m.text()}`);
  });
  for (const f of files) {
    await test.step(urlOf(lang, f), async () => {
      const res = await d.page.goto(urlOf(lang, f), { waitUntil: 'load' });
      expect(res?.status(), `${f} answers 200`).toBe(200);
      // Time for the deferred scripts and the first record fetch to run. Not
      // 'networkidle': cts-sync.js keeps polling, so a page is never idle.
      await d.page.waitForTimeout(750);
      expect((await d.page.title()).trim(), `${f} has a title`).not.toBe('');
    });
  }
  d.problems.push(...consoleErrors);
}

for (const [kind, re] of Object.entries(KINDS)) {
  test.describe(kind, () => {
    for (const lang of LANGS) {
      const files = sample(lang, re);
      if (!files.length) continue;
      test(`${lang}: a registered student opens ${files.length} ${files.length === 1 ? 'page' : 'pages'} cleanly`, async ({ device }) => {
        await sweep(device, 'student', lang, files);
      });
    }
    const en = sample('en', re);
    if (en.length) test(`en: a first-time visitor opens ${en.length} ${en.length === 1 ? 'page' : 'pages'} cleanly`, async ({ device }) => {
      await sweep(device, 'visitor', 'en', en);
    });
  });
}
