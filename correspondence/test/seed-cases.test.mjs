// The issue's Oct 22 seed examples, as synthetic stand-ins (no real names or
// addresses): each conversation must land in the state the issue names.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { env as makeEnv, mail, CTS, INFO } from './fixtures.mjs';
import { ingestMessage } from '../src/ingest.js';
import { dashboardData } from '../src/digest.js';

const caseOf = (e, id) => e.DB.prepare('SELECT * FROM cases WHERE id = ?').bind(id).first();
async function convo(e, steps) {
  let prev, id;
  for (const s of steps) {
    const m = mail({ thread: s.thread, ...s, replyTo: prev?.rfc_message_id });
    const r = await ingestMessage(e, m);
    id = id || r.caseId; prev = m;
  }
  return id;
}

test('seed: accreditation partner answered positively, CTS thanked them -> waiting on them, not actionable', async () => {
  const e = await makeEnv();
  const id = await convo(e, [
    { from: CTS, to: ['president@seminary.example.edu'], thread: 'S1', subject: 'Partnership proposal', body: 'Dear Dr. President, we would welcome a conversation about accreditation.' },
    { from: 'president@seminary.example.edu', thread: 'S1', subject: 'Re: Partnership proposal', body: 'We are very positive about accreditation of your program and will discuss it at our board.' },
    { from: CTS, to: ['president@seminary.example.edu'], thread: 'S1', subject: 'Re: Partnership proposal', body: 'Thank you very much for your kind response.' },
  ]);
  const c = await caseOf(e, id);
  assert.equal(c.status, 'waiting_on_them');
  assert.equal(c.track, 'relations');
  const d = await dashboardData(e);
  assert.ok(d.sections.waiting.some((x) => x.id === id));
  assert.ok(!d.sections.overdue.some((x) => x.id === id));
});

test('seed: contributors who agreed, with materials requested -> waiting on contributor', async () => {
  const e = await makeEnv();
  for (const [who, body] of [['teacher1@example.edu', 'I agree to contribute lectures to your seminary.'], ['teacher2@example.edu', 'I can teach a Baptist course for you.']]) {
    const id = await convo(e, [
      { from: who, to: [INFO], mailbox: 'cts-info', thread: who, subject: 'Teaching', body },
      { from: INFO, to: [who], mailbox: 'cts-info', thread: who, subject: 'Re: Teaching', body: 'Thank you! Could you send your syllabus or existing notes?' },
    ]);
    assert.equal((await caseOf(e, id)).status, 'waiting_on_them');
  }
});

test('seed: assessment verification error -> open technical escalation, not resolved by acknowledgement', async () => {
  const e = await makeEnv();
  const id = await convo(e, [
    { from: 'student@example.org', thread: 'S3', subject: 'Evangelismo Lección 6', body: 'Tengo un error de verificación en la Lección 6 de Evangelismo.' },
    { from: CTS, to: ['student@example.org'], thread: 'S3', subject: 'Re: Evangelismo Lección 6', body: 'Gracias por avisarnos; lo revisaremos.' },
  ]);
  const c = await caseOf(e, id);
  assert.equal(c.status, 'escalated');
  assert.ok((await dashboardData(e)).sections.escalated.some((x) => x.id === id));
});

test('seed: coordinator without electricity, policy sent -> waiting, not an invitation to keep replying', async () => {
  const e = await makeEnv();
  const id = await convo(e, [
    { from: 'coordinator@example.org', thread: 'S4', subject: 'Groupe d\'étude', body: "Nous n'avons pas d'électricité; comment faire les devoirs hors ligne?" },
    { from: CTS, to: ['coordinator@example.org'], thread: 'S4', subject: 'Re: Groupe d\'étude', body: 'Voici notre politique pour les examens sur papier.' },
  ]);
  const c = await caseOf(e, id);
  assert.equal(c.category, 'coordinator_offline');
  assert.equal(c.status, 'waiting_on_them');
  assert.match(c.next_action, /do not send reminders automatically/);
});
