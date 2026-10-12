// Can a student actually see their code, and use it?
//
// The records API and the sync client were built and tested before anything
// showed a student their code, which meant the whole mechanism was useless in
// practice: a code nobody can read restores nothing. This drives the two
// places it now appears, in a real browser, against a real API.
//
//   node test/code-ui.test.mjs        (run by npm test)

import { chromium } from 'playwright';

const BASE = process.env.SYNC_BASE || 'http://127.0.0.1:8798';
const CHROME = process.env.CHROME_PATH;

let checks = 0; const fails = [];
const ok = (c, label, detail) => { checks++; if (!c) fails.push(label + (detail ? `\n        ${detail}` : '')); };

const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const CODE_RE = /^CTS-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/;

async function device(page_ = '') {
  const ctx = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${BASE}/${page_}`, { waitUntil: 'load' });
  return { ctx, page, errors };
}

/* ---- registering on the front page shows the code ------------------------ */

const one = await device();
await one.page.selectOption('#reg-country', { index: 1 });
await one.page.fill('#reg-name', 'Ana Ruiz');
ok(await one.page.getAttribute('#reg-email', 'required') !== null, 'email is marked required');
for (const lang of ['en', 'es']) {
  await one.page.goto(`${BASE}/${lang === 'es' ? 'es/' : ''}index.html?cts_lang=${lang}`, { waitUntil: 'load' });
  await one.page.selectOption('#reg-country', { index: 1 });
  await one.page.fill('#reg-name', 'Ana Ruiz');
  for (const email of ['', '   ', 'not-an-address', '—', 'a@b.c']) {
    await one.page.fill('#reg-email', email);
    const dialog = one.page.waitForEvent('dialog');
    const clicked = one.page.click('#reg-save');
    const alert = await dialog;
    ok(lang === 'es' ? /correo/.test(alert.message()) : /email/.test(alert.message()), `invalid email gets a ${lang} explanation`);
    await alert.accept(); await clicked;
    ok(await one.page.evaluate(() => !localStorage.getItem('cts_student') && !window.CTS_SYNC.code()),
      `invalid email (${JSON.stringify(email)}) creates no local registration or code`);
  }
}
await one.page.goto(`${BASE}/index.html?cts_lang=en`, { waitUntil: 'load' });
await one.page.selectOption('#reg-country', { index: 1 });
await one.page.fill('#reg-name', 'Ana Ruiz');
await one.page.fill('#reg-email', `ana.code-ui-${Date.now()}@example.org`);
await one.page.click('#reg-save');
await one.page.waitForFunction(() => {
  const el = document.getElementById('reg-code');
  return el && el.style.display === 'block';
}, null, { timeout: 15000 }).catch(() => {});

const shown = await one.page.evaluate(() => {
  const box = document.getElementById('reg-code');
  return { visible: !!box && box.offsetParent !== null,
           code: (document.getElementById('reg-code-value').textContent || '').trim(),
           stored: window.CTS_SYNC && window.CTS_SYNC.code() };
});
ok(shown.visible, 'the code block appears after registering');
ok(CODE_RE.test(shown.code), `the code shown has the documented shape`, `got "${shown.code}"`);
ok(shown.code === shown.stored, 'the code shown is the one actually stored');
ok(one.errors.length === 0, `no page errors: ${one.errors.slice(0, 2).join(' | ')}`);
const CODE = shown.code;

// the copy button has to work without a secure context, which is where many of
// these students are. Guarded, so that when the block is hidden this reports a
// failed assertion rather than dying on a click timeout.
if (shown.visible) {
  await one.page.click('#reg-code-copy');
  await one.page.waitForTimeout(300);
  ok(/Copied|Copiado/.test(await one.page.textContent('#reg-code-copy')),
    'the copy button confirms it copied');
} else {
  ok(false, 'the copy button could not be tested: the code block never appeared');
}

// and it must still be there when they come back
await one.page.reload({ waitUntil: 'load' });
await one.page.waitForFunction(() => {
  const el = document.getElementById('reg-code');
  return el && el.style.display === 'block';
}, null, { timeout: 15000 }).catch(() => {});
ok((await one.page.textContent('#reg-code-value')).trim() === CODE,
  'the code is still shown on a return visit');

/* ---- the Save & Restore page ---------------------------------------------- */

const backup = await one.ctx.newPage();
await backup.goto(`${BASE}/cts-backup.html`, { waitUntil: 'load' });
await backup.waitForFunction(() => {
  const c = document.getElementById('code-card');
  return c && c.style.display === 'block';
}, null, { timeout: 15000 }).catch(() => {});
ok(await backup.evaluate(() => document.getElementById('code-card').offsetParent !== null),
  'the Save & Restore page shows the student-code card');
ok((await backup.textContent('#code-value')).trim() === CODE,
  'and shows this device\'s code');

/* ---- a second device restores from the code ------------------------------- */

// give the first device some progress to carry across
await one.page.evaluate(() => {
  localStorage.setItem('cts_1peter_progress', JSON.stringify({ unit1: true, unit2: true }));
  return window.CTS_SYNC.sync();
});
await one.page.waitForTimeout(500);

const two = await device('cts-backup.html');
await two.page.waitForFunction(() => {
  const c = document.getElementById('code-card');
  return c && c.style.display === 'block';
}, null, { timeout: 15000 }).catch(() => {});
ok(await two.page.evaluate(() => document.getElementById('code-none').offsetParent !== null),
  'a fresh device says it has no code yet');

const restoreUsable = await two.page.evaluate(() =>
  !!document.getElementById('code-restore') && document.getElementById('code-restore').offsetParent !== null);
ok(restoreUsable, 'the restore box is on the page for a student to use');
if (restoreUsable) {
await two.page.fill('#code-input', CODE.toLowerCase().replace(/-/g, ' '));   // as a person would type it
await two.page.click('#code-restore');
await two.page.waitForFunction(() => /Restored|Restaurado|No record|No se encontr/.test(
  document.getElementById('code-note').textContent || ''), null, { timeout: 15000 }).catch(() => {});

const after = await two.page.evaluate(() => ({
  note: document.getElementById('code-note').textContent.trim(),
  cls: document.getElementById('code-note').className,
  code: (document.getElementById('code-value').textContent || '').trim(),
  units: Object.keys(JSON.parse(localStorage.getItem('cts_1peter_progress') || '{}')).length,
}));
ok(/Restored|Restaurado/.test(after.note), `restoring reports success`, `note was "${after.note}"`);
ok(/\bok\b/.test(after.cls), 'and is styled as success, not as a warning');
ok(after.code === CODE, 'the restored device now shows the same code');
ok(after.units === 2, `both passed units came across, got ${after.units}`);
ok(two.errors.length === 0, `no page errors on the restore device: ${two.errors.slice(0, 2).join(' | ')}`);

// a wrong code must say so rather than silently doing nothing
await two.page.fill('#code-input', 'CTS-0000-0000-0001');
await two.page.click('#code-restore');
await two.page.waitForTimeout(1200);
const bad = await two.page.evaluate(() => ({
  note: document.getElementById('code-note').textContent.trim(),
  cls: document.getElementById('code-note').className,
}));
ok(/No record|No se encontr/.test(bad.note), `a wrong code is reported`, `note was "${bad.note}"`);
ok(/warn/.test(bad.cls), 'and is styled as a warning');
}

/* ---- existing students need no email to restore and continue ------------- */
const legacy = await device();
const restored = await legacy.page.evaluate(() => window.CTS_SYNC.restore('CTS-TEST-0000-0001'));
ok(restored.ok, 'an existing student without email can restore their code');
await legacy.page.reload({ waitUntil: 'load' });
ok(await legacy.page.evaluate(() => {
  const student = JSON.parse(localStorage.getItem('cts_student') || '{}');
  return student.name === 'Legacy No Email' && !student.email &&
    document.getElementById('cts-reg-form').style.display === 'none';
}), 'the returning student without email stays registered and is not sent through signup');

await browser.close();
console.log(`${checks} assertions on the student-code interface`);
if (!fails.length) console.log('PASS — a student can see their code and use it on another device.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach((f) => console.log('  ' + f)); process.exitCode = 1; }
