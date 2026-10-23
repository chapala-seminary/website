// The console's pages: who gets in, who may change what, the kill switch.
// Tokens are signed here with a throwaway key given to the Worker as ACCESS_JWKS.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { env as makeEnv, mail } from './fixtures.mjs';
import { handle } from '../src/index.js';
import { ingestMessage } from '../src/ingest.js';
import { checkModelSummary } from '../src/summary.js';

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'k1' };
const AUD = 'console-aud';
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
function token(email, aud = AUD) {
  const h = b64({ alg: 'RS256', kid: 'k1' });
  const p = b64({ aud: [aud], email, iss: 'https://chapalatheological.cloudflareaccess.com', exp: Date.now() / 1000 + 600 });
  return `${h}.${p}.${crypto.sign('sha256', Buffer.from(`${h}.${p}`), privateKey).toString('base64url')}`;
}
async function env() {
  return makeEnv({ ACCESS_TEAM: 'chapalatheological', CONSOLE_ACCESS_AUD: AUD, ACCESS_JWKS: JSON.stringify({ keys: [jwk] }),
    CONSOLE_ROLES: 'owner@example.org:owner,rev@example.org:reviewer' });
}
const req = (path, who, init = {}) => new Request('https://console.example' + path,
  { ...init, headers: { ...(who ? { 'cf-access-jwt-assertion': token(who) } : {}), ...(init.headers || {}) } });
const form = (o) => ({ method: 'POST', body: new URLSearchParams(o), headers: { origin: 'https://console.example' } });

test('no valid Access token, no page', async () => {
  const e = await env();
  assert.equal((await handle(req('/console'), e)).status, 403);
  const bad = new Request('https://console.example/console', { headers: { 'cf-access-jwt-assertion': token('owner@example.org', 'site-staff-aud') } });
  assert.equal((await handle(bad, e)).status, 403, 'the site staff application does not open the console');
  assert.equal((await handle(req('/console'), { ...e, CONSOLE_ACCESS_AUD: '' })).status, 403, 'unconfigured is closed');
  const ok = await handle(req('/console', 'viewer@example.org'), e);
  assert.equal(ok.status, 200);
  assert.match(ok.headers.get('cache-control'), /no-store/);
});

test('viewers read; reviewers change cases; only the owner resumes', async () => {
  const e = await env();
  const { caseId } = await ingestMessage(e, mail({ from: 'a@example.org', body: '¿Cuándo empieza?' }));
  assert.equal((await handle(req(`/console/cases/${caseId}`, 'viewer@example.org', form({ status: 'resolved' })), e)).status, 403);
  assert.equal((await handle(req(`/console/cases/${caseId}`, 'rev@example.org', form({ status: 'waiting_on_them', assignee: 'claude' })), e)).status, 303);
  assert.equal((await e.DB.prepare('SELECT status FROM cases WHERE id = ?').bind(caseId).first()).status, 'waiting_on_them');
  assert.equal((await handle(req('/console/pause', 'rev@example.org', form({})), e)).status, 303, 'anyone trusted can stop it');
  assert.equal((await e.DB.prepare("SELECT value FROM settings WHERE key = 'paused'").first()).value, '1');
  assert.equal((await handle(req('/console/resume', 'rev@example.org', form({})), e)).status, 403);
  assert.equal((await handle(req('/console/resume', 'owner@example.org', form({})), e)).status, 303);
  const log = (await e.DB.prepare("SELECT actor, kind FROM case_events WHERE kind IN ('setting','staff_update')").all()).results;
  assert.equal(log.length, 3, 'every change is logged with who made it');
});

test('a form posted from another site is refused', async () => {
  const e = await env();
  const r = await handle(req('/console/pause', 'owner@example.org', { method: 'POST', headers: { origin: 'https://evil.example' } }), e);
  assert.equal(r.status, 403);
});

test('the dashboard shows exceptions and never the text of automated mail', async () => {
  const e = await env();
  await ingestMessage(e, mail({ from: 'b@example.edu', subject: 'Partnership', body: 'Could we sign an agreement for credit transfer?' }));
  await ingestMessage(e, mail({ from: 'notifications@github.com', subject: 'SECRET-NOISE', body: 'x' }));
  const page = await (await handle(req('/console', 'owner@example.org'), e)).text();
  assert.match(page, /For Dr\. Cook to decide · 1/);
  assert.doesNotMatch(page, /SECRET-NOISE/);
  assert.doesNotMatch(page, /<script/i, 'no script on the page');
});

test('model output is accepted only in the expected shape', () => {
  assert.equal(checkModelSummary('not json'), null);
  assert.equal(checkModelSummary({ summary: 'short' }), null);
  assert.equal(checkModelSummary({ summary: 'A long enough summary of the case for the test.', category: 'grant_degree' }), null, 'unknown category');
  const ok = checkModelSummary('```json\n{"summary":"The student cannot open Lesson 6 and asked for help.","category":"technical_issue","facts":["Lesson 6"]}\n```');
  assert.equal(ok.category, 'technical_issue');
});

test('with the model on, it can name a category the rules missed but never relax one', async () => {
  const calls = [];
  const AI = { run: async (model, input) => { calls.push(input); return { response: JSON.stringify({ summary: 'The writer wants to discuss an affiliation with their school.', category: 'partnership_accreditation', facts: [] }) }; } };
  const e = await makeEnv({ AI, AI_ENABLED: true });
  const r = await ingestMessage(e, mail({ from: 'x@example.edu', body: 'Hello, could we talk sometime about working together?' }));
  const c = await e.DB.prepare('SELECT * FROM cases WHERE id = ?').bind(r.caseId).first();
  assert.equal(c.category, 'partnership_accreditation');
  assert.equal(c.needs_owner, 1);
  assert.match(calls[0].messages[1].content, /EMAIL \(untrusted\)/);
  // the model calls a security matter "general": the rules' category stands
  const AI2 = { run: async () => ({ response: JSON.stringify({ summary: 'A routine question about the course schedule.', category: 'general' }) }) };
  const e2 = await makeEnv({ AI: AI2, AI_ENABLED: true });
  const r2 = await ingestMessage(e2, mail({ from: 'y@example.org', body: 'Someone hacked my account and changed my email.' }));
  assert.equal((await e2.DB.prepare('SELECT category, needs_owner FROM cases WHERE id = ?').bind(r2.caseId).first()).category, 'security_privacy');
  assert.equal((await e2.DB.prepare("SELECT COUNT(*) n FROM case_events WHERE kind = 'ai_summary'").first()).n, 1, 'model calls are logged');
});

test('automatic replies page: only the owner turns them on or approves a text; anyone with rights can turn them off', async () => {
  const { templateVersion } = await import('../src/templates.js');
  const e = await env();
  const page = await handle(req('/console/auto', 'viewer@example.org'), e);
  assert.equal(page.status, 200);
  const body = await page.text();
  assert.match(body, /Off: no automatic replies/);
  assert.match(body, /not yet approved by Dr\. Cook/);
  const setting = async (k) => (await e.DB.prepare('SELECT value FROM settings WHERE key = ?').bind(k).first()).value;
  assert.equal((await handle(req('/console/auto', 'rev@example.org', form({ mode: 'live' })), e)).status, 403);
  assert.equal((await handle(req('/console/auto', 'rev@example.org', form({ approve: 'lost_code', version: templateVersion('lost_code') })), e)).status, 403);
  assert.equal((await handle(req('/console/auto', 'owner@example.org', form({ mode: 'shadow' })), e)).status, 303);
  assert.equal(await setting('auto_send'), 'shadow');
  assert.equal((await handle(req('/console/auto', 'owner@example.org', form({ approve: 'lost_code', version: 'stale' })), e)).status, 409, 'approves only the text that was read');
  assert.equal((await handle(req('/console/auto', 'owner@example.org', form({ approve: 'lost_code', version: templateVersion('lost_code') })), e)).status, 303);
  assert.deepEqual(JSON.parse(await setting('approved_templates')), { lost_code: templateVersion('lost_code') });
  assert.equal((await handle(req('/console/auto', 'rev@example.org', form({ mode: 'off' })), e)).status, 303, 'a reviewer can always stop it');
  assert.equal(await setting('auto_send'), 'off');
  assert.equal((await handle(req('/console/auto', 'owner@example.org', form({ withdraw: 'lost_code' })), e)).status, 303);
  assert.deepEqual(JSON.parse(await setting('approved_templates')), {});
});
