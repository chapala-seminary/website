/* Checks worker/email.js's choice of sender, with no network and no Worker:
 * Cloudflare's binding first, Resend only when Cloudflare is missing or
 * refuses for a reason that is about Cloudflare, log mode only in the tests.
 *   node tools/verify-email.mjs
 */
import { sendEmail, emailConfigured, emailLogOnly, parseAddress } from '../worker/email.js';

let fails = 0, checks = 0;
const ok = (c, label, extra) => { checks++; if (!c) { fails++; console.log('FAIL', label, extra ?? ''); } };

const FROM = 'Chapala Theological Seminary <certificates@chapalaseminary.org>';
const msg = { to: 'student@example.test', subject: 'S', text: 'T' };
let resendCalls = 0;
globalThis.fetch = async (url, init) => {
  resendCalls++;
  ok(url === 'https://api.resend.com/emails', 'Resend is called at its API', url);
  return new Response(JSON.stringify({ id: 're_1' }), { status: 200 });
};
const cf = (behaviour) => {
  const sent = [];
  return { sent, send: async (m) => { sent.push(m); if (behaviour) { const e = new Error('x'); e.code = behaviour; throw e; } return { messageId: 'cf_1' }; } };
};
const base = { EMAIL_FROM: FROM, EMAIL_REPLY_TO: 'info@chapalaseminary.org' };

ok(JSON.stringify(parseAddress(FROM)) === JSON.stringify({ name: 'Chapala Theological Seminary', email: 'certificates@chapalaseminary.org' }), 'a "Name <address>" sender is split for Cloudflare');
ok(parseAddress('a@b.test').email === 'a@b.test' && !parseAddress('a@b.test').name, 'a bare address has no name');

// 1. Cloudflare available: it sends, Resend is not touched.
{ const EMAIL = cf(); resendCalls = 0;
  const r = await sendEmail({ ...base, EMAIL, RESEND_API_KEY: 'k' }, msg);
  ok(r.via === 'cloudflare' && r.id === 'cf_1', 'with the binding, Cloudflare sends', JSON.stringify(r));
  ok(resendCalls === 0, 'and Resend is not called');
  ok(EMAIL.sent[0].replyTo === 'info@chapalaseminary.org' && EMAIL.sent[0].from.email === 'certificates@chapalaseminary.org', 'reply-to and sender are passed to Cloudflare'); }

// 2. Domain not onboarded yet / quota reached: Resend takes it.
for (const code of ['E_SENDER_DOMAIN_NOT_AVAILABLE', 'E_DAILY_LIMIT_EXCEEDED', 'E_RATE_LIMIT_EXCEEDED', 'E_INTERNAL_SERVER_ERROR']) {
  resendCalls = 0;
  const r = await sendEmail({ ...base, EMAIL: cf(code), RESEND_API_KEY: 'k' }, msg);
  ok(r.via === 'resend' && resendCalls === 1, `${code}: Resend sends instead`, JSON.stringify(r));
}

// 3. A problem with the message itself is not retried at Resend.
for (const code of ['E_RECIPIENT_SUPPRESSED', 'E_VALIDATION_ERROR', 'E_DELIVERY_FAILED']) {
  resendCalls = 0; let threw = null;
  try { await sendEmail({ ...base, EMAIL: cf(code), RESEND_API_KEY: 'k' }, msg); } catch (e) { threw = e; }
  ok(threw && threw.status === 502 && resendCalls === 0, `${code}: fails with 502, Resend not tried`);
}

// 4. Cloudflare refuses and there is no Resend key: a clear failure.
{ let threw = null; try { await sendEmail({ ...base, EMAIL: cf('E_DAILY_LIMIT_EXCEEDED') }, msg); } catch (e) { threw = e; }
  ok(threw && threw.status === 502, 'no fallback configured: the failure is reported, not hidden'); }

// 5. No binding (as today): Resend alone, exactly as before.
{ resendCalls = 0; const r = await sendEmail({ ...base, RESEND_API_KEY: 'k' }, msg);
  ok(r.via === 'resend' && resendCalls === 1, 'without the binding, Resend sends as before'); }

// 6. Nothing configured: 503.
{ let threw = null; try { await sendEmail({ ...base }, msg); } catch (e) { threw = e; }
  ok(threw && threw.status === 503, 'with no way to send, 503'); }

// 7. Log mode is for the test harness only, and never hides a real sender.
ok(emailLogOnly({ EMAIL_MODE: 'log' }) && emailConfigured({ EMAIL_MODE: 'log' }), 'log mode alone: log only');
ok(!emailLogOnly({ EMAIL_MODE: 'log', EMAIL: cf() }), 'log mode with the binding: really sends');
ok(emailConfigured({ EMAIL: cf() }) && !emailConfigured({}), 'configured means a binding, a key or log mode');

console.log(`${checks} checks`);
if (fails) { console.log(`FAIL — ${fails}`); process.exitCode = 1; } else console.log('PASS — Cloudflare first, Resend as the fallback.');
