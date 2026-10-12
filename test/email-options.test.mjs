// Real Worker/D1 and browser tests for either way of confirming an email.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import { verificationEmail } from '../worker/email.js';
const BASE = process.env.API_BASE || 'http://127.0.0.1:8798';
const STATE = process.env.EMAIL_TEST_STATE || '.wrangler-local';
let checks = 0;
function ok(value, message) { assert.ok(value, message); checks++; }
async function post(path, body) {
  const res = await fetch(BASE + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  return { status: res.status, body: await res.json() };
}
async function student(label) {
  const email = `email-options-${label}-${crypto.randomUUID()}@example.org`;
  const reg = await post('/api/register', { name: 'Email Options ' + label, email, track: 'cert' });
  ok(reg.status === 201 && !reg.body.student.email_verified_at, 'signup is available before confirmation');
  return { code: reg.body.code, email };
}
async function state(code) { return (await (await fetch(BASE + '/api/student/' + code)).json()).student; }
async function challenge(s) {
  const r = await post('/api/email/start', s);
  ok(r.status === 200 && /^\d{6}$/.test(r.body.devCode), 'the existing code method is issued');
  const url = new URL(r.body.devLink);
  const token = new URLSearchParams(url.hash.slice(1)).get('token');
  ok(url.pathname === '/cts-confirm-email.html' && !url.search && /^[a-f0-9]{64}$/.test(token), 'an unguessable link token lives only in the fragment');
  return { ...r.body, token };
}
function update(code, sql) {
  assert.match(code, /^CTS-[0-9A-Z-]+$/);
  execFileSync('npx', ['wrangler', 'd1', 'execute', 'chapala-students', '--local', '--persist-to', STATE,
    '--config', 'test/wrangler.local.jsonc', '--command', `UPDATE email_challenges SET ${sql} WHERE student_id = '${code}'`], { stdio: 'pipe' });
}
const one = await student('link');
const link = await challenge(one);
const message = verificationEmail(link.devCode, link.devLink);
ok(message.text.includes(link.devCode) && message.text.includes(link.devLink) && /Confirm email/.test(message.text) && !/Confirmar correo/.test(message.text), 'one English message includes both methods');
await fetch(link.devLink);
ok(!(await state(one.code)).email_verified_at, 'opening the email URL alone does not confirm');
ok((await post('/api/email/link', { token: link.token })).status === 200, 'the link works without a student code or login');
ok(!!(await state(one.code)).email_verified_at, 'the link stores confirmation');
ok((await post('/api/email/link', { token: link.token })).status === 410, 'the link is single use');
ok((await post('/api/email/confirm', { code: one.code, verification: link.devCode })).status === 404, 'using the link invalidates its code');

const two = await student('code'), codeChallenge = await challenge(two);
ok((await post('/api/email/confirm', { code: two.code, verification: codeChallenge.devCode })).status === 200, 'the six-digit code also works');
ok((await post('/api/email/link', { token: codeChallenge.token })).status === 410, 'using the code invalidates its link');
const legacy = await student('legacy-code'), legacyChallenge = await challenge(legacy);
update(legacy.code, 'link_hash = NULL');
ok((await post('/api/email/confirm', { code: legacy.code, verification: legacyChallenge.devCode })).status === 200,
  'a pending six-digit challenge from before the link migration still works');
const expired = await student('expired'), old = await challenge(expired);
update(expired.code, "expires_at = '2000-01-01T00:00:00.000Z'");
ok((await post('/api/email/link', { token: old.token })).status === 410, 'expired link cannot confirm');
ok((await post('/api/email/confirm', { code: expired.code, verification: old.devCode })).status === 410, 'expired code cannot confirm');
ok(!(await state(expired.code)).email_verified_at, 'expiration leaves the address unverified');

const resent = await student('resent'), first = await challenge(resent);
ok((await post('/api/email/start', resent)).status === 429, 'both options keep the resend wait');
update(resent.code, "sent_at = '2000-01-01T00:00:00.000Z'");
const replacement = await challenge(resent);
ok((await post('/api/email/link', { token: first.token })).status === 410, 'resending invalidates the previous link');
ok((await post('/api/email/link', { token: replacement.token })).status === 200, 'the replacement link works');
const capped = await student('cap'), cap = await challenge(capped);
update(capped.code, "sent_at = '2000-01-01T00:00:00.000Z', sends_today = 5");
ok((await post('/api/email/start', capped)).status === 429, 'daily send limit remains enforced');
for (let i = 0; i < 5; i++) await post('/api/email/confirm', { code: capped.code, verification: cap.devCode === '000000' ? '111111' : '000000' });
ok((await post('/api/email/link', { token: cap.token })).status === 410, 'five wrong code guesses expire both methods');
const racing = await student('race'), race = await challenge(racing);
const results = await Promise.all([
  post('/api/email/link', { token: race.token }),
  post('/api/email/confirm', { code: racing.code, verification: race.devCode }),
]);
ok(results.filter(r => r.status === 200).length === 1, 'simultaneous link/code confirmations have exactly one winner');

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
try {
  for (const lang of ['en', 'es']) {
    const s = await student('browser-' + lang), ctx = await browser.newContext();
    await ctx.addInitScript(s => {
      localStorage.setItem('cts_student_code', s.code);
      localStorage.setItem('cts_student', JSON.stringify({ name: 'Email Options', email: s.email, track: 'cert' }));
    }, s);
    const page = await ctx.newPage();
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${BASE}/${lang === 'es' ? 'es/' : ''}cts-confirm-email.html?cts_lang=${lang}`);
    ok(lang === 'es' ? /Confirme/.test(await page.textContent('h1')) : /Confirm/.test(await page.textContent('h1')), 'general page is available in ' + lang);
    const response = page.waitForResponse(r => r.url().endsWith('/api/email/start'));
    await page.click('#email-send');
    const issued = await (await response).json();
    await page.fill('#email-code', issued.devCode);
    await page.click('#email-code-confirm');
    await page.waitForFunction(() => /Email confirmed|Correo confirmado/.test(document.getElementById('email-note').textContent));
    ok(!!(await state(s.code)).email_verified_at, 'general page confirms with a code in ' + lang);
    ok(errors.length === 0, 'confirmation page has no browser errors');
    await ctx.close();
  }
  const recipient = await student('recipient'), other = await student('other-device'), ch = await challenge(recipient);
  const ctx = await browser.newContext();
  await ctx.addInitScript(s => {
    localStorage.setItem('cts_student_code', s.code);
    localStorage.setItem('cts_student', JSON.stringify({ name: 'Other Student', email: s.email, track: 'cert' }));
    localStorage.setItem('cts_acts_progress', '{"unit1":true}');
  }, other);
  const page = await ctx.newPage();
  await page.goto(ch.devLink);
  ok(!page.url().includes('token'), 'the token is removed from browser history immediately');
  ok(!(await state(recipient.code)).email_verified_at, 'link page waits for an explicit button press');
  await page.click('#email-link-confirm');
  await page.waitForFunction(() => /Email confirmed/.test(document.getElementById('email-note').textContent));
  const held = await page.evaluate(() => ({ code: localStorage.getItem('cts_student_code'), progress: localStorage.getItem('cts_acts_progress') }));
  ok(held.code === other.code && held.progress === '{"unit1":true}', 'cross-device link confirmation leaves the current account and progress intact');
  ok(!!(await state(recipient.code)).email_verified_at, 'the recipient address was confirmed instead');
  await page.goto(old.devLink);
  await page.click('#email-link-confirm');
  await page.waitForFunction(() => /expired|already used/.test(document.getElementById('email-note').textContent));
  ok(await page.locator('#email-send').isVisible(), 'an expired link offers a way to request a fresh confirmation');
  await ctx.close();
} finally { await browser.close(); }
console.log(`PASS — ${checks} checks on code/link confirmation, expiry, replay, resend, limits, concurrency and bilingual browsers.`);
