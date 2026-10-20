// A note that failed to send is tried again; a note that went out is not repeated.
// worker/outreach.js, against a real Worker and D1.
//
//   API_BASE=http://127.0.0.1:8798 STATE=.wrangler-local CONFIG=test/wrangler.local.jsonc \
//     node test/outreach-retry.test.mjs
//
// A failed send is written straight into the local database, as the daily run
// writes it when the mail service refuses (status 'failed'). Before the fix,
// any outreach row -- failed or not -- stopped that student's note for good.
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
const later = (days) => new Date(Date.now() + days * 86400000).toISOString();
const json = { 'content-type': 'application/json', 'x-test-grading-mode': 'shadow' };
const reg = async (b) => (await (await fetch(BASE + '/api/register', { method: 'POST', headers: json, body: JSON.stringify(b) })).json()).code;
const sync = (b) => fetch(BASE + '/api/sync', { method: 'POST', headers: json, body: JSON.stringify(b) }).then((r) => r.json());

const tag = Math.random().toString(36).slice(2, 7);
const NEW = `Retry New ${tag}`, QUIET = `Retry Quiet ${tag}`;
const newCode = await reg({ name: NEW, email: `retry-new-${tag}@example.test`, track: 'cert' });
const quietCode = await reg({ name: QUIET, email: `retry-quiet-${tag}@example.test`, track: 'cert' });
await sync({ code: quietCode, progress: [{ course: 'acts', unit: 1 }], doneCodes: [] });
ok(newCode && quietCode, 'two fixture students registered');

// One failed getting-started note, and one failed quiet note dated after the
// quiet student's last progress (which, before the fix, counted as "already written").
db(`INSERT INTO outreach (student_id, kind, status, error, sent_at) VALUES
  ('${newCode}', 'not_started', 'failed', 'test: mail service refused', '${later(8)}'),
  ('${quietCode}', 'quiet', 'failed', 'test: mail service refused', '${later(21)}')`);

// Run "as of" a day until both fixtures are reached; other suites may fill the daily cap.
async function runUntil(days, names) {
  const seen = {};
  for (let batch = 0; batch < 20; batch++) {
    const res = await (await fetch(`${BASE}/staff/notes/run?asOf=${later(days)}`, { method: 'POST', headers: STAFF })).json();
    for (const r of res.results) if (names.includes(r.student)) seen[r.student] = r;
    if (names.every((n) => seen[n]) || !res.capped) break;
  }
  return seen;
}

const first = await runUntil(22, [NEW, QUIET]);
ok(first[NEW]?.kind === 'not_started' && first[NEW]?.status === 'sent',
  'a failed getting-started note is tried again the next run', JSON.stringify(first[NEW]));
ok(first[QUIET]?.kind === 'quiet' && first[QUIET]?.status === 'sent',
  'a failed quiet note does not count as having written to that quiet spell', JSON.stringify(first[QUIET]));

const second = await runUntil(23, [NEW, QUIET]);
ok(!second[NEW], 'once a getting-started note has gone out, it is not sent again');
ok(!second[QUIET], 'once a quiet note has gone out, that quiet spell gets no second note');

const rows = db(`SELECT kind, status FROM outreach WHERE student_id IN ('${newCode}', '${quietCode}') ORDER BY id`)[0];
ok(rows.filter((r) => r.status === 'failed').length === 2 && rows.filter((r) => r.status === 'sent').length === 2,
  'the record keeps both the failed attempts and the notes that went out', JSON.stringify(rows));

await fetch(`${BASE}/api/student/${newCode}`, { method: 'DELETE' });
await fetch(`${BASE}/api/student/${quietCode}`, { method: 'DELETE' });

if (fails.length) { console.error(`outreach retry: ${fails.length} of ${checks} checks failed`); for (const f of fails) console.error('  ✗ ' + f); process.exit(1); }
console.log(`outreach retry: ${checks} checks passed`);
