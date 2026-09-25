/* Can a student register a certificate with the seminary from the page?
 *
 * The Worker side of this (a verified email, then /api/certificate) is
 * covered by test/api.test.mjs. This drives the page side, cts-certify.js, in
 * a browser against the real Worker and D1: a finished student opens their
 * certificate, is asked for an email, gets the six-digit code (the test
 * config returns it in the response instead of sending it), confirms it, and
 * sees the verification code -- on the page and printed on the diploma. Then
 * the checks that matter as much: a second visit and a second device show the
 * same code without asking again, a wrong code is refused, the public verify
 * endpoint recognises the code, and a degree page (built differently from the
 * course pages) works the same way.
 *
 *   node tools/verify-certify.mjs http://127.0.0.1:8798
 */
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const CHROME = process.env.CHROME_PATH;
const catalog = JSON.parse(fs.readFileSync('worker/catalog.json', 'utf8'));

let checks = 0; const fails = [];
const ok = (c, label, detail) => { checks++; if (!c) fails.push(label + (detail ? `\n        ${detail}` : '')); };

const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});

/* Every certificate page must load the script -- the static half. */
const pages = fs.readdirSync('dist').filter((f) => /ertificate\.html$/i.test(f) || f === 'ethics_certificate.html');
const without = pages.filter((f) => !/cts-certify\.js/.test(fs.readFileSync(`dist/${f}`, 'utf8')));
ok(without.length === 0, `${without.length} certificate page(s) do not load cts-certify.js`, without.slice(0, 6).join(' '));

async function device() {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  return { ctx, page, errors };
}

/* A student who has passed every unit of 1 Peter, seeded the way the engine
   writes it and synced so the seminary holds the same. The unit page is
   loaded first because that is where the engine writes the old keys the
   certificate page reads (verify-certificate-unlock.mjs says why). */
const course = catalog.courses['1peter'];
const seed = { name: 'Certify Test', track: 'cert', email: '' };
async function finishedStudent(d, extra = {}) {
  await d.page.goto(`${BASE}/CTS1PeterUnit1.html`, { waitUntil: 'load' });
  await d.page.evaluate(([s, units, extra]) => {
    localStorage.clear();
    localStorage.setItem('cts_student', JSON.stringify(s));
    localStorage.setItem('cts_track', s.track);
    const p = {}; units.forEach((u) => { p['unit' + u] = true; });
    localStorage.setItem('cts_1peter_progress', JSON.stringify(p));
    localStorage.setItem('cts_done_codes', JSON.stringify(['CTS1PETER']));
    for (const [k, v] of Object.entries(extra)) localStorage.setItem(k, v);
  }, [seed, course.units, extra]);
  await d.page.reload({ waitUntil: 'load' });
  await d.page.evaluate(() => window.CTS_SYNC.sync());
  await d.page.waitForTimeout(400);
  return d.page.evaluate(() => window.CTS_SYNC.code());
}

const panelState = (page) => page.evaluate(() => {
  const p = document.getElementById('cts-cert-panel');
  const v = document.getElementById('cts-cert-verify');
  const dip = ['#diploma', '.diploma', '#cert-wrap', '.cert-wrap', '#certificate', '.certificate'].map((s) => document.querySelector(s)).find((e) => e && e.offsetParent !== null);
  return {
    panel: !!p && p.offsetParent !== null,
    text: p ? p.textContent.replace(/\s+/g, ' ').trim() : '',
    email: !!document.getElementById('cts-cert-email'),
    codeBox: !!document.getElementById('cts-cert-code'),
    verifyCode: (p && p.querySelector('.cc-ok code')) ? p.querySelector('.cc-ok code').textContent.trim() : null,
    stamped: !!v && !!dip && dip.contains(v) ? v.textContent.trim() : null,
    err: p && p.querySelector('.cc-msg.err') ? p.querySelector('.cc-msg.err').textContent.trim() : null,
  };
});
const waitFor = (page, fn, ms = 15000) => page.waitForFunction(fn, null, { timeout: ms }).catch(() => {});

/* ---- device one: the whole flow ------------------------------------------ */
const one = await device();
const CODE = await finishedStudent(one);
ok(/^CTS-/.test(CODE || ''), 'the finished student has a student code', `got ${CODE}`);

let devCode = null, startStatus = null;
one.page.on('response', async (r) => {
  if (/\/api\/email\/start$/.test(r.url())) { startStatus = r.status(); try { devCode = (await r.json()).devCode; } catch {} }
});
await one.page.goto(`${BASE}/CTS1PeterCertificate.html`, { waitUntil: 'load' });
await waitFor(one.page, () => document.getElementById('cts-cert-email'));
let s = await panelState(one.page);
ok(s.panel && s.email, 'a finished student with no verified email is asked for one', s.text.slice(0, 120));
ok(!s.stamped, 'nothing is stamped on the diploma before there is a code');

// a malformed address is refused on the page, before any request
await one.page.fill('#cts-cert-email', 'not an address');
await one.page.click('#cts-cert-panel button[data-act="send"]');
await one.page.waitForTimeout(200);
s = await panelState(one.page);
ok(s.err && s.email, 'a malformed email is refused on the page', s.err);

await one.page.fill('#cts-cert-email', 'certify@example.org');
await one.page.click('#cts-cert-panel button[data-act="send"]');
await waitFor(one.page, () => document.getElementById('cts-cert-code'));
s = await panelState(one.page);
ok(startStatus === 200 && s.codeBox, `asking for a code reaches the Worker and moves to the code step (${startStatus})`, s.text.slice(0, 120));
ok(/certify@example\.org/.test(s.text), 'the code step names the address the code went to');
ok(/^\d{6}$/.test(devCode || ''), 'the test Worker handed back the code instead of sending it', `got ${devCode}`);

// the wrong code first
await one.page.fill('#cts-cert-code', devCode === '000000' ? '111111' : '000000');
await one.page.click('#cts-cert-panel button[data-act="confirm"]');
await waitFor(one.page, () => document.querySelector('#cts-cert-panel .cc-msg.err'), 5000);
s = await panelState(one.page);
ok(s.err && s.codeBox, 'a wrong code is refused and the student can try again', s.err);

// then the right one
await one.page.fill('#cts-cert-code', devCode);
await one.page.click('#cts-cert-panel button[data-act="confirm"]');
await waitFor(one.page, () => document.querySelector('#cts-cert-panel .cc-ok code'));
s = await panelState(one.page);
ok(/^[A-Z0-9-]{6,}$/i.test(s.verifyCode || ''), 'confirming the code registers the certificate and shows a verification code', s.text.slice(0, 160));
ok(s.stamped && s.stamped.includes(s.verifyCode) && /\/verify\//.test(s.stamped), 'the verification line is printed inside the diploma', s.stamped);
const VC = s.verifyCode;
ok(one.errors.length === 0, `no page errors on the certificate page: ${one.errors.slice(0, 2).join(' | ')}`);

// the public check recognises it
const pub = await fetch(`${BASE}/api/verify/${encodeURIComponent(VC)}`).then((r) => r.json()).catch(() => null);
ok(pub && pub.valid === true && /1 Peter/.test(pub.title || ''), 'the public verify endpoint recognises the code', JSON.stringify(pub));

// a second visit shows the same code without asking again
await one.page.reload({ waitUntil: 'load' });
await waitFor(one.page, () => document.querySelector('#cts-cert-panel .cc-ok code'));
s = await panelState(one.page);
ok(s.verifyCode === VC && !s.email, 'a second visit shows the same code and asks nothing', s.text.slice(0, 120));

/* ---- device two: the same student, restored by code ---------------------- */
const two = await device();
await finishedStudent(two, { cts_student_code: CODE });
await two.page.goto(`${BASE}/CTS1PeterCertificate.html`, { waitUntil: 'load' });
await waitFor(two.page, () => document.querySelector('#cts-cert-panel .cc-ok code'));
s = await panelState(two.page);
ok(s.verifyCode === VC, 'another device holding the code gets the same certificate, no email asked', s.text.slice(0, 120));
ok(s.stamped && s.stamped.includes(VC), 'and its diploma is stamped too');

/* ---- a degree page, built differently from the course pages -------------- */
// Not eligible: the panel must not appear on a diploma that is not shown.
await two.page.goto(`${BASE}/CTSCertificateOfMinistry.html`, { waitUntil: 'load' });
await two.page.waitForTimeout(1500);
s = await panelState(two.page);
ok(!s.panel, 'a degree page whose diploma is locked shows no registration panel', s.text.slice(0, 80));

// Eligible: twelve courses including the seven foundation courses, recorded
// the way the course pages record them, synced, and the Certificate of
// Ministry registers with the email already confirmed -- no questions.
const FOUNDATION = ['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK'];
const twelve = [...FOUNDATION, ...Object.keys(catalog.completions).filter((c) => !FOUNDATION.includes(c)).slice(0, 5)];
const names = twelve.map((c) => catalog.completions[c].name);
await two.page.goto(`${BASE}/CTS1PeterUnit1.html`, { waitUntil: 'load' });
await two.page.evaluate(([codes, names]) => {
  localStorage.setItem('cts_done_codes', JSON.stringify(codes));
  localStorage.setItem('cts_degree_courses', JSON.stringify(names));
}, [twelve, names]);
await two.page.evaluate(() => window.CTS_SYNC.sync());
await two.page.waitForTimeout(400);
await two.page.goto(`${BASE}/CTSCertificateOfMinistry.html`, { waitUntil: 'load' });
await waitFor(two.page, () => document.querySelector('#cts-cert-panel .cc-ok code'));
s = await panelState(two.page);
ok(/^[A-Z0-9-]{6,}$/i.test(s.verifyCode || '') && s.verifyCode !== VC, 'an eligible degree page registers the degree and shows its own code', s.text.slice(0, 160));
ok(s.stamped && s.stamped.includes(s.verifyCode || '-'), 'and stamps the degree diploma', s.stamped);
const deg = await fetch(`${BASE}/api/verify/${encodeURIComponent(s.verifyCode || 'x')}`).then((r) => r.json()).catch(() => null);
ok(deg && deg.valid === true && deg.level === 'certificate', 'the public check knows it as a Certificate of Ministry', JSON.stringify(deg));
ok(two.errors.length === 0, `no page errors on the degree page: ${two.errors.slice(0, 2).join(' | ')}`);

/* ---- no record at all: the page stays as it was -------------------------- */
const three = await device();
await three.page.goto(`${BASE}/CTS1PeterUnit1.html`, { waitUntil: 'load' });
await three.page.evaluate(([units]) => {
  localStorage.clear();
  localStorage.setItem('cts_sync_off', '1');            // the student opted out of records
  localStorage.setItem('cts_student', JSON.stringify({ name: 'Offline', track: 'cert' }));
  const p = {}; units.forEach((u) => { p['unit' + u] = true; });
  localStorage.setItem('cts_1peter_progress', JSON.stringify(p));
}, [course.units]);
await three.page.reload({ waitUntil: 'load' });
await three.page.goto(`${BASE}/CTS1PeterCertificate.html`, { waitUntil: 'load' });
await three.page.waitForTimeout(2500);
s = await panelState(three.page);
ok(!s.panel, 'with no student code the certificate is printable and nothing is asked', s.text.slice(0, 80));
ok(three.errors.length === 0, `no page errors without a code: ${three.errors.slice(0, 2).join(' | ')}`);

await browser.close();
console.log(`${checks} assertions on registering a certificate from the page`);
if (fails.length) { console.log('FAIL —'); fails.forEach((f) => console.log('  ' + f)); process.exit(1); }
console.log('PASS — a finished student can register a certificate: email once, verification code every time.');
