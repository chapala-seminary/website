/* One message in, the ledger updated exactly once (issue #163, sections 2-5).
 *
 * ingestMessage(env, msg) is the whole state machine. It is idempotent: the
 * message is claimed by inserting its (mailbox, provider id) row first, and a
 * second call for the same message finds the row and changes nothing. Only
 * the new message is read; the case's summary carries the history.
 *
 * msg (from src/gmail.js, or a test):
 *   { mailbox_id, provider_msg_id, provider_thread_id, rfc_message_id,
 *     in_reply_to, references: [], from, to: [], cc: [], internal_ms,
 *     subject, body, headers: {lower-case: value}, label_ids: [], view_url }
 */
import { normAddress, displayName, addressList, excerpt as makeExcerpt, questionWords, similarity } from './normalize.js';
import { lane as laneOf, bouncedAddress, classify, flagsFor, decide, POLICY, QUIET_LANES } from './triage.js';
import { updateSummary, nextAction, promisesIn, summaryPrompt, checkModelSummary, SUMMARY_PROMPT_VERSION } from './summary.js';

export const DUPLICATE_QUESTION_SIMILARITY = 0.6;
export const SOFT_BOUNCE_REVIEW_AFTER = 3;
const OPEN = "status NOT IN ('resolved')";

const iso = (ms) => new Date(ms).toISOString();
const nowIso = (env) => (env.NOW ? env.NOW() : new Date().toISOString());
const one = (db, sql, ...a) => db.prepare(sql).bind(...a).first();
const all = async (db, sql, ...a) => (await db.prepare(sql).bind(...a).all()).results || [];
const run = (db, sql, ...a) => db.prepare(sql).bind(...a).run();
const subjectKey = (s) => String(s || '').toLowerCase().replace(/^\s*((re|fw|fwd|rv|tr|enc|aw)\s*:\s*)+/i, '').replace(/\s+/g, ' ').trim();

export async function ownAddresses(env) {
  const rows = await all(env.DB, 'SELECT address FROM mailboxes');
  const extra = `${env.OWN_ADDRESSES || ''},${env.OWN_ADDRESSES_EXTRA || ''}`.split(',').map(normAddress).filter(Boolean);
  return new Set([...rows.map((r) => normAddress(r.address)), ...extra]);
}

async function event(db, at, caseId, messageId, actor, kind, detail) {
  await run(db, 'INSERT INTO case_events (case_id, message_id, actor, kind, detail, at) VALUES (?, ?, ?, ?, ?, ?)',
    caseId, messageId, actor, kind, detail == null ? null : JSON.stringify(detail), at);
}

async function contactFor(db, address, name, at, kind = 'unknown') {
  await run(db, `INSERT INTO contacts (address_norm, display_name, kind, created_at, updated_at) VALUES (?, ?, ?, ?, ?)
                 ON CONFLICT(address_norm) DO NOTHING`, address, name || null, kind, at, at);
  return one(db, 'SELECT * FROM contacts WHERE address_norm = ?', address);
}

async function suppress(db, address, reason, permanent, at, messageId, note) {
  await run(db, `INSERT INTO suppressions (address_norm, reason, permanent, soft_count, first_at, last_at, evidence_msg, note)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                 ON CONFLICT(address_norm, reason) DO UPDATE SET soft_count = soft_count + excluded.soft_count,
                   last_at = excluded.last_at, evidence_msg = excluded.evidence_msg`,
    address, reason, permanent ? 1 : 0, reason === 'soft_bounce' ? 1 : 0, at, at, messageId, note || null);
  return one(db, 'SELECT * FROM suppressions WHERE address_norm = ? AND reason = ?', address, reason);
}

export async function isSuppressed(db, address) {
  return one(db, `SELECT reason, permanent, soft_count FROM suppressions WHERE address_norm = ?
                  AND (permanent = 1 OR (reason = 'soft_bounce' AND soft_count >= ?)) LIMIT 1`,
    normAddress(address), SOFT_BOUNCE_REVIEW_AFTER);
}

/* Which case does this message belong to? In order of evidence:
   1. its own mailbox thread already has one;
   2. it replies to (In-Reply-To / References) a message the console knows,
      in any mailbox -- the same conversation across accounts;
   3. otherwise a new case -- unless the counterpart has an open case with
      the same subject in ANOTHER mailbox, in which case the thread is joined
      to it but marked needs_review: plausible, not proven. */
async function findCase(db, msg, threadRow, counterpartId) {
  if (threadRow && threadRow.case_id) return { caseId: threadRow.case_id, link: threadRow.link_state };
  const refs = [msg.in_reply_to, ...(msg.references || [])].filter(Boolean);
  for (const ref of refs.reverse()) {
    const hit = await one(db, `SELECT t.case_id FROM messages m JOIN threads t ON t.id = m.thread_id
                               WHERE m.rfc_message_id = ? AND t.case_id IS NOT NULL LIMIT 1`, ref);
    if (hit) return { caseId: hit.case_id, link: 'linked' };
  }
  if (counterpartId) {
    const key = subjectKey(msg.subject);
    if (key) {
      const cands = await all(db, `SELECT DISTINCT c.id, t.subject, t.mailbox_id FROM cases c JOIN threads t ON t.case_id = c.id
                                   WHERE c.contact_id = ? AND c.${OPEN} AND t.mailbox_id <> ?`, counterpartId, msg.mailbox_id);
      const same = cands.filter((c) => subjectKey(c.subject) === key);
      if (same.length) return { caseId: same[0].id, link: 'needs_review' };
    }
  }
  return { caseId: null, link: 'linked' };
}

async function threadFor(db, msg, at) {
  await run(db, `INSERT INTO threads (mailbox_id, provider_thread_id, subject, created_at) VALUES (?, ?, ?, ?)
                 ON CONFLICT(mailbox_id, provider_thread_id) DO NOTHING`, msg.mailbox_id, msg.provider_thread_id, msg.subject || null, at);
  return one(db, 'SELECT * FROM threads WHERE mailbox_id = ? AND provider_thread_id = ?', msg.mailbox_id, msg.provider_thread_id);
}

async function openCase(db, contactId, decision, category, topic, at) {
  const r = await run(db, `INSERT INTO cases (track, contact_id, topic, category, priority, status, needs_owner, owner_reason, opened_at, updated_at)
                           VALUES (?, ?, ?, ?, ?, 'new', ?, ?, ?, ?)`,
    decision.track, contactId, topic || null, category, decision.priority, decision.needs_owner, decision.reason || null, at, at);
  return r.meta.last_row_id;
}

const PRIORITY_RANK = { urgent: 0, high: 1, normal: 2, low: 3 };
const stricter = (a, b) => (PRIORITY_RANK[a] <= PRIORITY_RANK[b] ? a : b);

async function saveCase(db, c, at) {
  c.next_action = nextAction(c);
  await run(db, `UPDATE cases SET category = ?, priority = ?, status = ?, needs_owner = ?, owner_reason = ?, assignee = ?,
                 summary = ?, facts_json = ?, commitments_json = ?, next_action = ?, last_inbound_at = ?, last_outbound_at = ?,
                 track = ?, updated_at = ? WHERE id = ?`,
    c.category, c.priority, c.status, c.needs_owner, c.owner_reason || null, c.assignee || null,
    c.summary, JSON.stringify(c.facts), JSON.stringify(c.commitments), c.next_action, c.last_inbound_at, c.last_outbound_at,
    c.track, at, c.id);
}

async function loadCase(db, id) {
  const c = await one(db, 'SELECT * FROM cases WHERE id = ?', id);
  c.facts = JSON.parse(c.facts_json || '[]');
  c.commitments = JSON.parse(c.commitments_json || '[]');
  return c;
}

/* Was this question answered before? An earlier inbound message in the same
   case whose question words are close to these, followed by an outbound. */
async function answeredBefore(db, caseId, words, beforeMs) {
  if (!caseId || words.length < 2) return null;
  const prior = await all(db, `SELECT m.question_fp, m.internal_ms FROM messages m JOIN threads t ON t.id = m.thread_id
                               WHERE t.case_id = ? AND m.direction = 'in' AND m.question_fp IS NOT NULL AND m.internal_ms < ?`, caseId, beforeMs);
  for (const p of prior) {
    if (similarity(words, p.question_fp.split(' ')) < DUPLICATE_QUESTION_SIMILARITY) continue;
    const reply = await one(db, `SELECT m.internal_ms FROM messages m JOIN threads t ON t.id = m.thread_id
                                 WHERE t.case_id = ? AND m.direction = 'out' AND m.internal_ms > ? AND m.internal_ms < ?
                                 ORDER BY m.internal_ms LIMIT 1`, caseId, p.internal_ms, beforeMs);
    if (reply) return new Date(reply.internal_ms).toISOString().slice(0, 10);
  }
  return null;
}

async function maybeModel(env, c, excerpt, meta, at, caseId, messageId) {
  if (!env.AI || !env.AI_ENABLED) return null;
  const model = env.SUMMARY_MODEL || '@cf/meta/llama-3.1-8b-instruct-fast';
  try {
    const out = await env.AI.run(model, { messages: summaryPrompt(c, excerpt, meta), max_tokens: 400 });
    const checked = checkModelSummary(out && (out.response ?? out));
    await event(env.DB, at, caseId, messageId, `ai:${model}`, checked ? 'ai_summary' : 'ai_rejected',
      { prompt_version: SUMMARY_PROMPT_VERSION, input_chars: excerpt.length, output: checked });
    return checked;
  } catch (e) {
    await event(env.DB, at, caseId, messageId, `ai:${model}`, 'ai_error', { error: String(e && e.message || e).slice(0, 300) });
    return null;
  }
}

export async function ingestMessage(env, msg) {
  const db = env.DB;
  const at = nowIso(env);
  const own = env._own || (env._own = await ownAddresses(env));
  const from = normAddress(msg.from);
  const to = addressList([...(msg.to || []), ...(msg.cc || [])]);
  const outbound = own.has(from) || (msg.label_ids || []).includes('SENT');
  const ex = makeExcerpt(msg.body);
  const base = { from_norm: from, subject: msg.subject, headers: msg.headers || {}, excerpt: ex, body: msg.body };
  const lane = outbound ? (laneOf(base, own) === 'automated' ? 'automated' : 'own_outbound') : laneOf(base, own);
  const thread = await threadFor(db, msg, at);

  // claim the message: the unique key makes a second delivery a no-op
  const claim = await run(db, `INSERT INTO messages (mailbox_id, provider_msg_id, thread_id, rfc_message_id, in_reply_to, direction,
                               from_norm, to_norm, internal_ms, subject, excerpt, lane, view_url, ingested_at)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                               ON CONFLICT(mailbox_id, provider_msg_id) DO NOTHING`,
    msg.mailbox_id, msg.provider_msg_id, thread.id, msg.rfc_message_id || null, msg.in_reply_to || null,
    outbound ? 'out' : 'in', from, to.join(','), msg.internal_ms, msg.subject || null,
    QUIET_LANES.has(lane) ? null : ex, lane, msg.view_url || null, at);
  if (!claim.meta.changes) return { duplicate: true };
  const messageId = (await one(db, 'SELECT id FROM messages WHERE mailbox_id = ? AND provider_msg_id = ?', msg.mailbox_id, msg.provider_msg_id)).id;

  /* ---- lanes that are not a conversation ---- */
  if (QUIET_LANES.has(lane)) {
    // automated notices: stored for counts, never a case, never in the queue.
    // An auto-reply on a known thread is noted on that case without changing it.
    const known = thread.case_id || (await findCase(db, msg, thread, null)).caseId;
    if (lane === 'auto_reply' && known) {
      const c = await loadCase(db, known);
      Object.assign(c, updateSummary(c, { kind: 'auto_reply', at_ms: msg.internal_ms }));
      await saveCase(db, c, at);
      await event(db, at, known, messageId, 'rules', 'auto_reply', null);
    }
    return { messageId, lane };
  }

  if (lane === 'bounce_hard' || lane === 'bounce_soft') {
    const failed = normAddress(bouncedAddress(msg.body || ''));
    if (!failed) { await event(db, at, null, messageId, 'rules', 'bounce_unparsed', { subject: msg.subject }); return { messageId, lane, needsReview: true }; }
    const s = await suppress(db, failed, lane === 'bounce_hard' ? 'hard_bounce' : 'soft_bounce', lane === 'bounce_hard', at, messageId);
    const contact = await one(db, 'SELECT id FROM contacts WHERE address_norm = ?', failed);
    const cases = contact ? await all(db, `SELECT id FROM cases WHERE contact_id = ? AND ${OPEN}`, contact.id) : [];
    for (const { id } of cases) {
      const c = await loadCase(db, id);
      Object.assign(c, updateSummary(c, { kind: lane, at_ms: msg.internal_ms, who: failed, count: s.soft_count }));
      if (lane === 'bounce_hard') { c.status = 'waiting_on_us'; c.assignee = c.assignee || 'outreach'; c.facts.push(`${failed}: not deliverable`); }
      await saveCase(db, c, at);
      if (lane === 'bounce_hard') await run(db, 'UPDATE cases SET next_action = ? WHERE id = ?', 'Address failed permanently: find and verify another address before any contact.', id);
      await event(db, at, id, messageId, 'rules', lane, { address: failed, soft_count: s.soft_count });
    }
    if (!cases.length) await event(db, at, null, messageId, 'rules', lane, { address: failed, soft_count: s.soft_count });
    return { messageId, lane, address: failed, softCount: s.soft_count };
  }

  /* ---- a conversation: find the counterpart and the case ---- */
  const counterpartAddr = outbound ? to.find((a) => !own.has(a)) : from;
  if (!counterpartAddr) { await event(db, at, null, messageId, 'rules', 'internal_only', null); return { messageId, lane: 'internal' }; }
  const counterpart = await contactFor(db, counterpartAddr, outbound ? '' : displayName(msg.from), at);
  let { caseId, link } = await findCase(db, msg, thread, counterpart.id);

  if (outbound) {
    if (!caseId) {
      // CTS started this conversation (outreach, a reply sent from another
      // account the console does not read yet): a case waiting on them.
      const d = { track: counterpart.kind === 'student' ? 'student_support' : 'relations', priority: 'normal', needs_owner: 0, reason: '' };
      caseId = await openCase(db, counterpart.id, d, 'outreach_reply', msg.subject, at);
      await event(db, at, caseId, messageId, 'rules', 'case_opened', { by: 'outbound' });
    }
    await run(db, 'UPDATE threads SET case_id = ?, link_state = ? WHERE id = ?', caseId, link, thread.id);
    const c = await loadCase(db, caseId);
    const promises = promisesIn(ex);
    Object.assign(c, updateSummary(c, { kind: 'outbound', at_ms: msg.internal_ms, mailbox: msg.mailbox_id, gist: ex.split('\n')[0], promises }));
    c.last_outbound_at = iso(msg.internal_ms);
    // an acknowledgement does not close an escalation; a reply moves the ball to them
    // ...unless CTS just promised something: then the ball is still ours
    if (c.status !== 'escalated') c.status = promises.length ? 'waiting_on_us' : 'waiting_on_them';
    c.promise = promises[0] || null;
    await saveCase(db, c, at);
    await event(db, at, caseId, messageId, 'rules', 'outbound', { mailbox: msg.mailbox_id, promises: promises.length });
    return { messageId, lane, caseId, link };
  }

  if (lane === 'opt_out') {
    await suppress(db, from, 'opt_out', true, at, messageId, 'asked not to be contacted');
    if (!caseId) caseId = await openCase(db, counterpart.id, { track: 'relations', priority: 'low', needs_owner: 0, reason: '' }, 'outreach_reply', msg.subject, at);
    await run(db, 'UPDATE threads SET case_id = ?, link_state = ? WHERE id = ?', caseId, link, thread.id);
    const c = await loadCase(db, caseId);
    Object.assign(c, updateSummary(c, { kind: 'opt_out', at_ms: msg.internal_ms, who: displayName(msg.from) || from }));
    c.status = 'resolved'; c.last_inbound_at = iso(msg.internal_ms);
    await saveCase(db, c, at);
    await event(db, at, caseId, messageId, 'rules', 'opt_out', null);
    return { messageId, lane, caseId };
  }

  /* ---- a person wrote to CTS ---- */
  const flags = flagsFor(ex, msg.subject);
  let { category } = classify(ex, msg.subject);
  const words = questionWords(ex);
  const answeredOn = await answeredBefore(db, caseId, words, msg.internal_ms);
  if (answeredOn) flags.push('duplicate_question');
  const suppressed = await isSuppressed(db, from);
  if (suppressed) flags.push('suppressed_contact');

  let c = caseId ? await loadCase(db, caseId) : null;
  // a reply on a relations case with no stronger signal stays a relations matter
  if (c && category === 'general' && c.category !== 'general') category = c.category;
  if (c && c.category === 'outreach_reply' && ['general', 'enrollment_login', 'exam_certificate'].includes(category) && c.track === 'relations') category = 'outreach_reply';
  const isRelations = (c && c.track === 'relations') || ['faculty', 'partner', 'outreach'].includes(counterpart.kind);
  const d = decide(category, flags, { isRelationsContact: isRelations });

  if (!c) {
    caseId = await openCase(db, counterpart.id, d, category, msg.subject, at);
    await event(db, at, caseId, messageId, 'rules', 'case_opened', { category, flags });
    c = await loadCase(db, caseId);
  }
  await run(db, 'UPDATE threads SET case_id = ?, link_state = ? WHERE id = ?', caseId, link, thread.id);
  await run(db, 'UPDATE messages SET category = ?, question_fp = ?, flags = ? WHERE id = ?',
    category, words.length ? words.join(' ') : null, flags.join(','), messageId);

  // the case only ever gets stricter from a new message
  if (category !== c.category && (POLICY[category]?.owner || POLICY[category]?.review || c.category === 'general' || c.category === 'outreach_reply')) c.category = category;
  c.priority = stricter(d.priority, c.priority);
  if (d.needs_owner && !c.needs_owner) { c.needs_owner = 1; c.owner_reason = d.reason; }
  if (c.track !== 'relations' && d.track === 'relations') c.track = 'relations';
  c.last_inbound_at = iso(msg.internal_ms);
  c.duplicate = !!answeredOn; c.answered_on = answeredOn;
  if (d.escalate || c.status === 'escalated') { c.status = 'escalated'; c.assignee = c.assignee || 'technical'; }
  else c.status = 'waiting_on_us';
  if (answeredOn && !c.needs_owner && c.status !== 'escalated') c.priority = 'low';
  if (link === 'needs_review') flags.push('cross_mailbox_unconfirmed');

  const who = displayName(msg.from) || from.split('@')[0];
  const ev = answeredOn
    ? { kind: 'duplicate_question', at_ms: msg.internal_ms, who, answered_on: answeredOn }
    : { kind: 'inbound', at_ms: msg.internal_ms, who, category, gist: ex.split('\n').find((l) => l.trim()) || '' };
  Object.assign(c, updateSummary(c, ev));

  const model = await maybeModel(env, c, ex, { category, flags, from_kind: counterpart.kind }, at, caseId, messageId);
  if (model) {
    c.summary = model.summary;
    for (const f of model.facts) if (!c.facts.includes(f)) c.facts.push(f);
    // the model may name a category only where the rules found none
    if (category === 'general' && model.category && model.category !== 'general' && c.category === 'general') {
      const d2 = decide(model.category, flags, { isRelationsContact: isRelations });
      c.category = model.category; c.priority = stricter(d2.priority, c.priority);
      if (d2.needs_owner && !c.needs_owner) { c.needs_owner = 1; c.owner_reason = d2.reason; }
      if (d2.escalate) c.status = 'escalated';
    }
  }
  await saveCase(db, c, at);
  await event(db, at, caseId, messageId, 'rules', 'inbound', { category, flags, decision: d, link });
  return { messageId, lane, caseId, category, flags, link, status: c.status, needs_owner: c.needs_owner };
}

/** A person changes a case by hand (status, assignee, due date, seed labels).
 *  Closing an escalation needs evidence that the fix was checked. */
export async function staffUpdate(env, caseId, by, change) {
  const db = env.DB, at = nowIso(env);
  const c = await one(db, 'SELECT * FROM cases WHERE id = ?', caseId);
  if (!c) return { error: 'no such case' };
  const allowed = ['new', 'draft', 'waiting_on_us', 'waiting_on_them', 'scheduled_follow_up', 'resolved', 'escalated'];
  if (change.status && !allowed.includes(change.status)) return { error: 'unknown status' };
  if (change.status === 'resolved' && c.status === 'escalated' && !String(change.evidence || '').trim())
    return { error: 'an escalated case closes only with evidence that the fix was verified' };
  const next = {
    status: change.status || c.status,
    assignee: change.assignee ?? c.assignee,
    due_at: change.due_at ?? c.due_at,
    needs_owner: change.needs_owner == null ? c.needs_owner : (change.needs_owner ? 1 : 0),
    resolution_evidence: change.evidence ?? c.resolution_evidence,
    next_action: change.next_action ?? c.next_action,
  };
  await run(db, `UPDATE cases SET status = ?, assignee = ?, due_at = ?, needs_owner = ?, resolution_evidence = ?, next_action = ?, updated_at = ? WHERE id = ?`,
    next.status, next.assignee, next.due_at, next.needs_owner, next.resolution_evidence, next.next_action, at, caseId);
  await event(db, at, caseId, null, by, 'staff_update', change);
  return { ok: true, case: { ...c, ...next } };
}
