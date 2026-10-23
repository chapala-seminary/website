// The mailbox sync against a fake Gmail: incremental history, cursor
// recovery, retries and the kill switch. And the read-only token rule.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { env as makeEnv, CTS } from './fixtures.mjs';
import { syncAll, syncMailbox, BUDGET } from '../src/sync.js';
import { accessToken, parseGmail } from '../src/gmail.js';

const b64 = (s) => Buffer.from(s, 'utf8').toString('base64url');
function gmailMsg(id, thread, from, subject, body, ms, extra = {}) {
  return { id, threadId: thread, internalDate: String(ms), labelIds: extra.labels || ['INBOX'],
    payload: { mimeType: 'multipart/alternative', headers: [
      { name: 'From', value: from }, { name: 'To', value: extra.to || CTS }, { name: 'Subject', value: subject },
      { name: 'Message-ID', value: `<${id}@example.org>` }, ...(extra.headers || [])],
    parts: [{ mimeType: 'text/plain', body: { data: b64(body) } }, { mimeType: 'text/html', body: { data: b64('<p>ignored</p>') } }] } };
}

/** A tiny Gmail: messages, a history log, and a counter of every read. */
function fakeGmail() {
  const g = { msgs: new Map(), log: [], historyId: 100, reads: { message: 0, history: 0, list: 0 }, failNext: new Set(), expired: false };
  g.add = (m) => { g.msgs.set(m.id, m); g.historyId++; g.log.push({ id: String(g.historyId), messagesAdded: [{ message: { id: m.id } }] }); };
  g.client = {
    profile: async () => ({ historyId: String(g.historyId) }),
    history: async (start) => {
      g.reads.history++;
      if (g.expired) { const e = new Error('not found'); e.status = 404; throw e; }
      return { history: g.log.filter((h) => Number(h.id) > Number(start)), historyId: String(g.historyId) };
    },
    list: async (q) => {
      g.reads.list++;
      const after = Number(q.match(/after:(\d+)/)[1]) * 1000;
      return { messages: [...g.msgs.values()].filter((m) => Number(m.internalDate) > after).sort((a, b) => b.internalDate - a.internalDate).map((m) => ({ id: m.id })) };
    },
    message: async (id) => {
      g.reads.message++;
      if (g.failNext.has(id)) { g.failNext.delete(id); const e = new Error('gmail 503'); e.status = 503; throw e; }
      return g.msgs.get(id);
    },
  };
  return g;
}

async function setup() {
  const g = fakeGmail();
  const e = await makeEnv({ GMAIL_CLIENT_ID: 'id', GMAIL_CLIENT_SECRET: 's', GMAIL_REFRESH_TOKEN_CTS_GMAIL: 'r', GMAIL_REFRESH_TOKEN_CTS_INFO: 'r',
    FETCH: async () => new Response(JSON.stringify({ access_token: 't', scope: 'https://www.googleapis.com/auth/gmail.readonly' })),
    GMAIL_CLIENT_FACTORY: () => g.client });
  await e.DB.prepare("UPDATE mailboxes SET enabled = 0 WHERE id = 'cts-info'").run();
  return { g, e, mb: async () => e.DB.prepare("SELECT * FROM mailboxes WHERE id = 'cts-gmail'").first() };
}
const base = Date.parse('2026-10-21T08:00:00Z');

test('first run reads the recent past; later runs read only what is new', async () => {
  const { g, e, mb } = await setup();
  g.add(gmailMsg('a1', 'th1', 'Ana <ana@example.org>', 'Registro', '¿Cómo me registro?', base));
  g.add(gmailMsg('a2', 'th2', 'notifications@github.com', 'CI', 'passed', base + 1000));
  const s1 = await syncMailbox(e, await mb());
  assert.equal(s1.mode, 'bootstrap'); assert.equal(s1.ingested, 2);
  assert.equal((await mb()).history_id, String(g.historyId));
  const before = g.reads.message;
  g.add(gmailMsg('a3', 'th1', 'ana@example.org', 'Re: Registro', 'Gracias. ¿Y el examen?', base + 5000));
  const s2 = await syncMailbox(e, await mb());
  assert.equal(s2.mode, 'history'); assert.equal(s2.ingested, 1);
  assert.equal(g.reads.message - before, 1, 'one new message, one read');
  const s3 = await syncMailbox(e, await mb());
  assert.equal(s3.ingested + s3.duplicates, 0, 'nothing new, nothing read');
});

test('an expired cursor recovers by date with overlap, without double counting', async () => {
  const { g, e, mb } = await setup();
  g.add(gmailMsg('b1', 'th1', 'ana@example.org', 'Q', '¿Pregunta uno?', base));
  await syncMailbox(e, await mb());
  g.add(gmailMsg('b2', 'th1', 'ana@example.org', 'Re: Q', '¿Pregunta dos?', base + 3600000));
  g.expired = true;
  const s = await syncMailbox(e, await mb());
  assert.equal(s.mode, 'recovery');
  assert.equal(s.ingested, 1); assert.equal(s.duplicates, 1);
  assert.equal((await e.DB.prepare('SELECT COUNT(*) n FROM messages').first()).n, 2);
  assert.ok((await mb()).history_id, 'a fresh cursor afterwards');
});

test('a message that fails to read is parked, retried, and the cursor still moves', async () => {
  const { g, e, mb } = await setup();
  await syncMailbox(e, await mb());
  g.add(gmailMsg('c1', 'th9', 'pablo@example.org', 'Hola', '¿Hay curso de Romanos?', base));
  g.failNext.add('c1');
  g.failNext.add('c1-x');
  const s = await syncMailbox(e, await mb());
  assert.equal(s.failed, 1);
  const dl = await e.DB.prepare("SELECT * FROM dead_letters WHERE provider_msg_id = 'c1'").first();
  assert.equal(dl.attempts, 1);
  e.clock.advance(10 * 60000);
  const s2 = await syncMailbox(e, await mb());
  assert.equal(s2.retried, 1); assert.equal(s2.ingested, 1);
  assert.equal(await e.DB.prepare("SELECT * FROM dead_letters WHERE provider_msg_id = 'c1'").first(), null);
});

test('a large backlog is read in budgeted runs and finishes without loss', async () => {
  const { g, e, mb } = await setup();
  for (let i = 0; i < BUDGET + 50; i++) g.add(gmailMsg(`d${i}`, `th${i}`, `s${i}@example.org`, 'Hola', `¿Pregunta ${i}?`, base + i * 1000));
  const s1 = await syncMailbox(e, await mb());
  assert.equal(s1.more, true); assert.equal(s1.ingested, BUDGET);
  const s2 = await syncMailbox(e, await mb());
  assert.equal(s2.ingested, 50);
  assert.equal((await e.DB.prepare('SELECT COUNT(*) n FROM messages').first()).n, BUDGET + 50);
});

test('pause stops everything at once', async () => {
  const { g, e } = await setup();
  g.add(gmailMsg('p1', 'th1', 'ana@example.org', 'Q', 'Hola', base));
  await e.DB.prepare("UPDATE settings SET value = '1' WHERE key = 'paused'").run();
  assert.deepEqual(await syncAll(e), { paused: true });
  assert.equal(g.reads.message + g.reads.list + g.reads.history, 0);
});

test('a token with more than read-only access is refused', async () => {
  const e = { GMAIL_CLIENT_ID: 'i', GMAIL_CLIENT_SECRET: 's', GMAIL_REFRESH_TOKEN_CTS_GMAIL: 'r',
    FETCH: async () => new Response(JSON.stringify({ access_token: 't', scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send' })) };
  await assert.rejects(accessToken(e, 'cts-gmail'), /more than read-only/);
  await assert.rejects(accessToken({}, 'cts-gmail'), /not authorized/);
});

test('Gmail messages are parsed: plain text preferred, delivery reports kept, list headers seen', () => {
  const m = gmailMsg('z', 'tz', '"Pastor, Juan" <j@example.org>', 'Hi', 'Hello', base, { to: 'a@example.org, "B, C" <b@example.org>', headers: [{ name: 'List-Unsubscribe', value: '<x>' }] });
  const p = parseGmail('cts-gmail', m);
  assert.equal(p.body, 'Hello');
  assert.deepEqual(p.to.length, 2);
  assert.ok(p.headers['list-unsubscribe']);
  assert.equal(p.rfc_message_id, '<z@example.org>');
});
