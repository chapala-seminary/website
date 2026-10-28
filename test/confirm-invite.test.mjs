// "Please confirm your registration" (worker/confirm-invite.js), against a real Worker and D1.
//
//   API_BASE=http://127.0.0.1:8798 STATE=.wrangler-local CONFIG=test/wrangler.local.jsonc \
//     node test/confirm-invite.test.mjs
//
// The test config is in log mode: nothing is mailed, and the run returns the
// message it would have sent, so the link inside it can be opened here.
import crypto from 'node:crypto';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const BASE = process.env.API_BASE || 'http://127.0.0.1:8798';
const STATE = process.env.STATE || '.wrangler-local';
const CONFIG = process.env.CONFIG || 'test/wrangler.local.jsonc';
let checks = 0;
const fails = [];
const ok = (c, label, detail) => { checks++; if (!c) fails.push(label + (detail ? `\n        ${detail}` : '')); };

function db(command) {
  const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'chapala-students', '--local', '--persist-to', STATE, '--config', CONFIG, '--json', '--command', command],
    { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }).toString();
  return JSON.parse(out.slice(out.indexOf('['))).map((r) => r.results);
}

const { key: TEST_JWK } = JSON.parse(fs.readFileSync(new URL('./fixtures/access-test-key.json', import.meta.url), 'utf8'));
const b64 = (v) => Buffer.from(typeof v === 'string' ? v : JSON.stringify(v)).toString('base64url');
function token() {
  const head = b64({ alg: 'RS256', kid: 'cts-test-1', typ: 'JWT' });
  const body = b64({ aud: ['cts-test-aud'], iss: 'https://cts-test.cloudflareaccess.com', exp: Math.floor(Date.now() / 1000 + 600),
    iat: Math.floor(Date.now() / 1000), email: 'staff@example.test', sub: 'x' });
  const key = crypto.createPrivateKey({ key: TEST_JWK, format: 'jwk' });
  return `${head}.${body}.${crypto.sign('sha256', Buffer.from(`${head}.${body}`), key).toString('base64url')}`;
}
const STAFF = { 'cf-access-jwt-assertion': token() };
const json = { 'content-type': 'application/json', 'x-test-grading-mode': 'shadow' };
const reg = async (b) => (await (await fetch(BASE + '/api/register', { method: 'POST', headers: json, body: JSON.stringify(b) })).json()).code;

const tag = Math.random().toString(36).slice(2, 7);
const ES = `Invite Es ${tag}`, EN = `Invite En ${tag}`, STOPPED = `Invite Stopped ${tag}`, NOMAIL = `Invite None ${tag}`;
const esCode = await reg({ name: ES, email: `invite-es-${tag}@example.test`, track: 'cert', lang: 'es' });
const enCode = await reg({ name: EN, email: `invite-en-${tag}@example.test`, track: 'thm' });
const stopCode = await reg({ name: STOPPED, email: `invite-stop-${tag}@example.test`, track: 'cert' });
const noCode = await reg({ name: NOMAIL, track: 'cert' });
ok(esCode && enCode && stopCode && noCode, 'four fixture students registered');
// stop notes the way staff do (no direct database write: that reloads the local Worker)
const roster = async () => (await fetch(BASE + '/staff/students.json', { headers: STAFF })).json();
const rowOf = async (name) => (await roster()).find((r) => r.name === name);
await fetch(`${BASE}/staff/students/${(await rowOf(STOPPED)).n}/notes`, { method: 'POST', headers: { ...STAFF, 'content-type': 'application/x-www-form-urlencoded' }, body: 'stop=1' });

// the page: who is waiting, and the note in three languages
const page = await fetch(BASE + '/staff/confirm-invite', { headers: STAFF });
const html = await page.text();
ok(page.status === 200 && /Please confirm your registration/.test(html) && /Por favor confirme su registro/.test(html) && /Veuillez confirmer votre inscription/.test(html),
  'the staff page shows the note in English, Spanish and French');
ok(!/complete (your )?registration/i.test(html), 'the note never says registration is incomplete');
ok((await fetch(BASE + '/staff/confirm-invite')).status === 403, 'not signed in: no page');

// a sample goes to the signed-in staff member only, and its link confirms nothing
const sample = await fetch(BASE + '/staff/confirm-invite/sample', { method: 'POST', headers: { ...STAFF, 'content-type': 'application/x-www-form-urlencoded' }, body: 'lang=es' });
ok(sample.status === 200 && /Sample \(es\) sent to staff@example\.test/.test(await sample.text()), 'a sample is sent to the staff member');

// send in batches until both fixtures are reached (other suites leave unconfirmed students too)
async function runUntil(names) {
  const seen = {};
  for (let i = 0; i < 30; i++) {
    const r = await (await fetch(BASE + '/staff/confirm-invite/send', { method: 'POST', headers: { ...STAFF, accept: 'application/json' } })).json();
    for (const x of r.results || []) if (names.includes(x.student)) seen[x.student] = x;
    if (names.every((n) => seen[n]) || !(r.results || []).length) break;
  }
  return seen;
}
const first = await runUntil([ES, EN, STOPPED, NOMAIL]);
ok(first[ES]?.status === 'sent' && first[EN]?.status === 'sent', 'unconfirmed students get the note', JSON.stringify(first));
ok(!first[STOPPED], 'a student who asked not to be written to is left out');
ok(!first[NOMAIL], 'a student with no email is left out');
ok(/^Por favor confirme su registro/.test(first[ES]?.message?.subject || ''), 'Spanish reader: Spanish note', first[ES]?.message?.subject);
ok(/^Please confirm your registration/.test(first[EN]?.message?.subject || ''), 'English reader: English note');
ok(/Hola Invite:/.test(first[ES]?.message?.text || ''), 'greets the student by first name');

// the link in the note confirms the address
const link = (first[EN]?.message?.text || '').match(/https?:\/\/\S*cts-confirm-email\.html#token=([a-f0-9]{64})/);
ok(link, 'the note carries a personal confirmation link', first[EN]?.message?.text);
ok(/\/es\/cts-confirm-email\.html\?cts_lang=es#token=/.test(first[ES]?.message?.text || ''), 'the Spanish link opens the Spanish page');
if (link) {
  const r = await fetch(BASE + '/api/email/link', { method: 'POST', headers: json, body: JSON.stringify({ token: link[1] }) });
  const v = await r.json();
  ok(r.status === 200 && v.verified === true, 'opening the link confirms the email', JSON.stringify(v));
  ok((await rowOf(EN))?.email_verified === true, 'the roster shows the email confirmed');
  const again = await fetch(BASE + '/api/email/link', { method: 'POST', headers: json, body: JSON.stringify({ token: link[1] }) });
  ok(again.status === 410, 'the link works once');
}

// nobody gets it twice
const second = await runUntil([ES, EN]);
ok(!second[ES] && !second[EN], 'a student who got the note is not sent it again');
const after = await (await fetch(BASE + '/staff/confirm-invite', { headers: STAFF })).text();
ok(/Confirmed after the note: [1-9]/.test(after), 'the staff page counts confirmations after the note');
if (process.env.STATE) {
  // read-only check of the record, after every request is done
  const rows = db(`SELECT student_id, status FROM outreach WHERE kind = 'confirm_invite' AND student_id IN ('${esCode}', '${enCode}', '${stopCode}', '${noCode}')`)[0];
  ok(rows.length === 2 && rows.every((r) => r.status === 'sent'), 'one record per student who got it', JSON.stringify(rows));
}

for (const c of [esCode, enCode, stopCode, noCode]) await fetch(`${BASE}/api/student/${c}`, { method: 'DELETE' }).catch(() => {});

if (fails.length) { console.error(`confirm-invite: ${fails.length} of ${checks} checks FAILED\n  - ${fails.join('\n  - ')}`); process.exit(1); }
console.log(`confirm-invite: all ${checks} checks pass`);
