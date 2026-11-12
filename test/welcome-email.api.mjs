// The welcome note through the real Worker and local D1 (worker/api.js
// register -> worker/outreach.js sendWelcome). The suite's config has
// WELCOME_MODE "send" and EMAIL_MODE "log", so nothing really leaves.
//
//   API_BASE=http://127.0.0.1:8798 STATE=.wrangler-local CONFIG=test/wrangler.local.jsonc \
//     node test/welcome-email.api.mjs
import { execFileSync } from './lib/d1-exec.mjs';

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
const json = { 'content-type': 'application/json', 'x-test-grading-mode': 'shadow' };
const reg = async (b) => { const r = await fetch(BASE + '/api/register', { method: 'POST', headers: json, body: JSON.stringify(b) }); return { status: r.status, body: await r.json() }; };
const welcomes = (code) => db(`SELECT kind, status FROM outreach WHERE student_id = '${code}' AND kind = 'welcome'`)[0];
// sent after the response (ctx.waitUntil): give it a moment
async function settle(code, want) {
  for (let i = 0; i < 20; i++) { const w = welcomes(code); if (w.length >= want) return w; await new Promise((r) => setTimeout(r, 250)); }
  return welcomes(code);
}

const tag = Math.random().toString(36).slice(2, 7);
const withEmail = await reg({ name: `Welcome Test ${tag}`, email: `welcome-${tag}@example.test`, track: 'cert', lang: 'es' });
ok(withEmail.status === 201 && withEmail.body.code, `registering with an email works as before (${withEmail.status})`);
const w = await settle(withEmail.body.code, 1);
ok(w.length === 1 && w[0].status === 'sent', 'a welcome note is sent and recorded', JSON.stringify(w));

const noEmail = await reg({ name: `Welcome None ${tag}`, track: 'cert' });
ok(noEmail.status === 201, 'registering without an email works as before');
await new Promise((r) => setTimeout(r, 1500));
ok(welcomes(noEmail.body.code).length === 0, 'no address, no note');

// the same name and email again is the same person: no second record, no second note
const again = await reg({ name: `Welcome Test ${tag}`, email: `welcome-${tag}@example.test`, track: 'cert' });
ok(again.status === 409 && !again.body.code, `a second registration with the same name and email makes no record (${again.status})`);
ok(welcomes(withEmail.body.code).length === 1, 'and sends no second note');

db(`DELETE FROM students WHERE id IN ('${withEmail.body.code}', '${noEmail.body.code}')`);
if (fails.length) {
  console.error(`welcome-email API: ${fails.length} of ${checks} checks failed`);
  for (const f of fails) console.error('  FAIL ' + f);
  process.exit(1);
}
console.log(`welcome-email API: ${checks} checks pass`);
