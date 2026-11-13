/* Automatic routine replies (Wayne, 23 Oct 2026; issue #163 founder policy).
 *
 * Two steps, so nothing is answered in haste and nothing twice:
 *
 *   planAutoReply(env, ...)    when a student's message is filed: if it asks
 *                              only routine questions this file knows, an
 *                              auto_replies row is written, 'pending', due
 *                              after auto_delay_min minutes.
 *   processAutoReplies(env)    each run, after every mailbox is read: each due
 *                              row is checked again against everything now in
 *                              the ledger (did a person or another assistant
 *                              answer, from ANY of the mailboxes? did the
 *                              student write again? did the case become one
 *                              for Dr. Cook?), then shadowed or sent.
 *
 * settings.auto_send: 'off' plans nothing; 'shadow' records the exact reply
 * that would go and sends nothing; 'live' sends, but only templates Dr. Cook
 * approved, resting only on confirmed or published facts, past the policy
 * check, within the daily cap. settings.paused stops all of it.
 *
 * Never answered automatically: anything for Dr. Cook (partnership, faculty,
 * money, security, doctrine, credit, commitments), technical problems
 * (they need diagnosis, not an acknowledgment), offline/coordinator matters,
 * completion reports and certificate claims, opt-outs, suspicious text,
 * questions the templates do not cover, languages without templates, old
 * mail, and a second message in a case that already had an automatic reply.
 */
import { TEMPLATES, LANGS, detectIntents, detectLanguage, THANKS_ONLY, templateStanding, templateVersion, render, replySubject } from './templates.js';
import { POLICY_VERSION, validateReply } from './policy.js';
import { buildMime, gmailSend } from './send.js';
import { updateSummary } from './summary.js';

export const AUTO_CATEGORIES = new Set(['enrollment_login', 'exam_certificate', 'general']);
const BLOCKING_FLAGS = ['injection', 'commitment', 'suppressed_contact', 'duplicate_question', 'completion_report', 'cross_mailbox_unconfirmed'];
export const MAX_AGE_HOURS = 48;          // older mail (a first read of past weeks) is never auto-answered
export const MAX_CHARS = 1200;            // a long letter deserves a person
export const ONE_PER_CASE_DAYS = 14;      // one automatic reply per case; the follow-up goes to a person
export const STALE_SENDING_MIN = 15;

const nowIso = (env) => (env.NOW ? env.NOW() : new Date().toISOString());
const one = (db, sql, ...a) => db.prepare(sql).bind(...a).first();
const all = async (db, sql, ...a) => (await db.prepare(sql).bind(...a).all()).results || [];
const run = (db, sql, ...a) => db.prepare(sql).bind(...a).run();
const addMin = (iso, m) => new Date(Date.parse(iso) + m * 60000).toISOString();

export async function autoSettings(env) {
  const rows = await all(env.DB, 'SELECT key, value FROM settings');
  const s = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  let approved = {};
  try { approved = JSON.parse(s.approved_templates || '{}'); } catch { approved = {}; }
  const requested = ['off', 'shadow', 'live'].includes(s.auto_send) ? s.auto_send : 'off';
  const mode = requested === 'live' && env.M2_RELEASE_GATE !== 'M2_SEND_APPROVED' ? 'off' : requested;
  return { mode, paused: s.paused === '1',
    cap: Number(s.auto_daily_cap) || 40, delay: Number(s.auto_delay_min) || 30, approved };
}

async function event(db, at, caseId, messageId, kind, detail) {
  await run(db, 'INSERT INTO case_events (case_id, message_id, actor, kind, detail, at) VALUES (?, ?, ?, ?, ?, ?)',
    caseId, messageId, 'auto', kind, detail == null ? null : JSON.stringify(detail), at);
}

/** Why this message may not get an automatic reply ([] = it may). */
function staticReasons({ c, category, flags, contact, link, excerpt, intents, lang, ageHours }) {
  const r = [];
  if (c.track !== 'student_support') r.push('not a student matter');
  if (c.needs_owner) r.push('for Dr. Cook');
  if (c.status === 'escalated') r.push('technical problem: needs diagnosis by a person');
  if (!AUTO_CATEGORIES.has(category)) r.push(`category ${category}`);
  for (const f of flags) if (BLOCKING_FLAGS.includes(f)) r.push(`flag ${f}`);
  if (link === 'needs_review') r.push('conversation link unconfirmed');
  if (['faculty', 'partner', 'outreach'].includes(contact.kind)) r.push(`contact is ${contact.kind}`);
  if (!intents.length) r.push('no routine question recognized');
  if (intents.length > 2) r.push('too many questions for templates');
  if (!LANGS.includes(lang)) r.push(lang ? `no templates in ${lang}` : 'language unclear');
  if (excerpt.length > MAX_CHARS) r.push('long message');
  const q = (excerpt.match(/\?/g) || []).length;
  if (q > intents.length + 1) r.push('more questions than the templates answer');
  if (ageHours > MAX_AGE_HOURS) r.push('message too old');
  return r;
}

export async function planAutoReply(env, { caseId, messageId, msg, excerpt, category, flags, contact, link }) {
  const db = env.DB, at = nowIso(env);
  const s = env._auto || await autoSettings(env);
  if (s.mode === 'off') return {};
  const c = await one(db, 'SELECT * FROM cases WHERE id = ?', caseId);
  const text = excerpt || '';
  const intents = detectIntents(text, msg.subject);
  const lang = detectLanguage(`${msg.subject || ''}\n${text}`) || '';
  const ageHours = (Date.parse(at) - msg.internal_ms) / 3600000;

  // "thank you" after CTS answered: nothing to answer; the case can rest
  if (!intents.length && THANKS_ONLY.test(text.trim()) && c.track === 'student_support' && !c.needs_owner && c.status !== 'escalated'
      && !flags.some((f) => ['injection', 'commitment'].includes(f))) {
    const prev = await one(db, `SELECT m.direction FROM messages m JOIN threads t ON t.id = m.thread_id
                                WHERE t.case_id = ? AND m.id <> ? AND m.copy_of IS NULL AND m.internal_ms <= ? ORDER BY m.internal_ms DESC LIMIT 1`, caseId, messageId, msg.internal_ms);
    if (prev && prev.direction === 'out') {
      if (s.mode === 'live') {
        await run(db, "UPDATE cases SET status = 'resolved', next_action = '', updated_at = ? WHERE id = ?", at, caseId);
        await event(db, at, caseId, messageId, 'no_reply_needed', { reason: 'thanks after a reply' });
        return { status: 'resolved', action: 'no_reply_needed' };
      }
      await event(db, at, caseId, messageId, 'would_close', { reason: 'thanks after a reply' });
      return { action: 'would_close' };
    }
  }

  const reasons = staticReasons({ c, category, flags, contact, link, excerpt: text, intents, lang, ageHours });
  const earlier = await one(db, `SELECT id FROM auto_replies WHERE case_id = ? AND status IN ('sent','shadow','sending','unknown','pending') AND created_at >= ? LIMIT 1`,
    caseId, new Date(Date.parse(at) - ONE_PER_CASE_DAYS * 86400000).toISOString());
  if (earlier) reasons.push('case already had an automatic reply; a person answers the follow-up');
  if (reasons.length) {
    if (intents.length || category !== 'general') await event(db, at, caseId, messageId, 'auto_skip', { intents, lang, reasons });
    return { action: 'skip', reasons };
  }

  const idem = msg.rfc_message_id || `${msg.mailbox_id}:${msg.provider_msg_id}`;
  const due = addMin(new Date(Math.max(msg.internal_ms, Date.parse(at) - 86400000)).toISOString(), s.delay);
  const ins = await run(db, `INSERT INTO auto_replies (idem_key, case_id, message_id, contact_id, intents, template_version, policy_version, language,
                             to_addr, subject, status, not_before, created_at, updated_at)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?) ON CONFLICT(idem_key) DO NOTHING`,
    idem, caseId, messageId, contact.id, intents.join(','), intents.map(templateVersion).join(','), POLICY_VERSION, lang,
    contact.address_norm, replySubject(msg.subject, lang), due < at ? at : due, at, at);
  if (!ins.meta.changes) return { action: 'already_planned' };
  await run(db, 'UPDATE cases SET next_action = ? WHERE id = ?',
    `Automatic reply (${intents.map((i) => TEMPLATES[i].title).join('; ')}) due ${due.slice(11, 16)} UTC unless someone answers first.`, caseId);
  await event(db, at, caseId, messageId, 'auto_planned', { intents, lang, due, mode: s.mode });
  return { action: 'planned', intents, lang };
}

/* ---- the second step, each run ----------------------------------------- */

async function supersededBy(db, row, trig) {
  const addr = row.to_addr;
  const answered = await one(db, `SELECT m.mailbox_id FROM messages m WHERE m.direction = 'out' AND m.internal_ms > ?
                                  AND instr(',' || COALESCE(m.to_norm, '') || ',', ',' || ? || ',') > 0 LIMIT 1`, trig.internal_ms, addr);
  if (answered) return `already answered from ${answered.mailbox_id}`;
  const again = await one(db, `SELECT 1 FROM messages WHERE direction = 'in' AND copy_of IS NULL AND from_norm = ? AND internal_ms > ? LIMIT 1`, addr, trig.internal_ms);
  if (again) return 'the student wrote again; a person will read both';
  const other = await one(db, `SELECT id FROM auto_replies WHERE contact_id = ? AND id <> ? AND status IN ('sent','shadow','sending','unknown') AND updated_at >= ? LIMIT 1`,
    row.contact_id, row.id, new Date(Date.parse(row.created_at) - 72 * 3600000).toISOString());
  if (other) return 'this person had an automatic reply in the last 3 days';
  return '';
}

async function liveReasons(db, row) {
  const c = await one(db, 'SELECT * FROM cases WHERE id = ?', row.case_id);
  const r = [];
  if (!c) return ['case gone'];
  if (c.needs_owner) r.push('case is now for Dr. Cook');
  if (c.status === 'escalated') r.push('case is now a technical problem');
  if (c.status === 'resolved') r.push('case was closed');
  if (c.track !== 'student_support') r.push('case is no longer a student matter');
  const sup = await one(db, `SELECT reason FROM suppressions WHERE address_norm = ? AND (permanent = 1 OR soft_count >= 3) LIMIT 1`, row.to_addr);
  if (sup) r.push(`address suppressed (${sup.reason})`);
  return r;
}

async function setRow(db, id, status, at, extra = {}) {
  await run(db, 'UPDATE auto_replies SET status = ?, reason = ?, body = COALESCE(?, body), sent_provider_id = COALESCE(?, sent_provider_id), updated_at = ? WHERE id = ?',
    status, extra.reason ?? null, extra.body ?? null, extra.sent ?? null, at, id);
}

async function needsPerson(db, caseId, at, why) {
  await run(db, "UPDATE cases SET next_action = ?, status = CASE WHEN status IN ('waiting_on_them','resolved') THEN 'waiting_on_us' ELSE status END, updated_at = ? WHERE id = ?",
    `Reply needed: the automatic reply did not go (${why}).`, at, caseId);
}

export async function processAutoReplies(env) {
  const db = env.DB, at = nowIso(env);
  const s = await autoSettings(env);
  const stats = { mode: s.mode, shadow: 0, sent: 0, blocked: 0, superseded: 0, failed: 0, unknown: 0, capped: 0 };
  if (s.paused) return { ...stats, paused: true };

  // a send that started and never finished may have gone: never retried
  for (const r of await all(db, "SELECT * FROM auto_replies WHERE status = 'sending' AND updated_at < ?", addMin(at, -STALE_SENDING_MIN))) {
    await setRow(db, r.id, 'unknown', at, { reason: 'send started but not confirmed; check Sent before answering' });
    await needsPerson(db, r.case_id, at, 'unconfirmed send; check the Sent folder first');
    await event(db, at, r.case_id, r.message_id, 'auto_unknown', { id: r.id });
    stats.unknown++;
  }
  if (s.mode === 'off') return stats;

  const done24 = (await one(db, `SELECT COUNT(*) n FROM auto_replies WHERE status IN (${s.mode === 'live' ? "'sent','sending','unknown'" : "'shadow'"}) AND updated_at >= ?`,
    addMin(at, -1440))).n;
  let room = s.cap - done24;
  const due = await all(db, "SELECT * FROM auto_replies WHERE status = 'pending' AND not_before <= ? ORDER BY not_before, id LIMIT 100", at);

  for (const row of due) {
    const trig = await one(db, 'SELECT m.*, k.display_name FROM messages m JOIN contacts k ON k.address_norm = m.from_norm WHERE m.id = ?', row.message_id);
    const sup = await supersededBy(db, row, trig);
    if (sup) { await setRow(db, row.id, 'superseded', at, { reason: sup }); await event(db, at, row.case_id, row.message_id, 'auto_superseded', { reason: sup }); stats.superseded++; continue; }
    const live = await liveReasons(db, row);
    if (live.length) { await setRow(db, row.id, 'superseded', at, { reason: live.join('; ') }); await event(db, at, row.case_id, row.message_id, 'auto_superseded', { reason: live }); stats.superseded++; continue; }

    const intents = row.intents.split(',');
    // the texts must still be the ones planned: an edit in between needs a new plan
    if (intents.map(templateVersion).join(',') !== row.template_version) {
      await setRow(db, row.id, 'blocked', at, { reason: 'template text changed after planning' });
      await needsPerson(db, row.case_id, at, 'template changed'); stats.blocked++; continue;
    }
    const body = render(intents, row.language, trig.display_name);
    const problems = validateReply(`${row.subject}\n${body}`);
    if (problems.length) {
      const why = `policy check: ${problems.map((p) => `${p.rule} "${p.text}"`).join('; ')}`;
      await setRow(db, row.id, 'blocked', at, { reason: why, body });
      await needsPerson(db, row.case_id, at, why);
      await event(db, at, row.case_id, row.message_id, 'auto_blocked', { problems });
      stats.blocked++; continue;
    }
    if (room <= 0) { stats.capped++; continue; }

    if (s.mode === 'shadow') {
      await setRow(db, row.id, 'shadow', at, { body, reason: intents.map((i) => templateStanding(i, s.approved)).filter((x) => !x.ok).map((x) => x.reason).join('; ') || null });
      await event(db, at, row.case_id, row.message_id, 'auto_shadow', { id: row.id, intents });
      // the reply was not sent: the case still needs one
      await run(db, 'UPDATE cases SET next_action = ? WHERE id = ?', 'Reply needed (shadow mode: the automatic reply was only recorded, not sent).', row.case_id);
      stats.shadow++; room--; continue;
    }

    // live
    const standing = intents.map((i) => [i, templateStanding(i, s.approved)]).filter(([, x]) => !x.ok);
    if (standing.length) {
      const why = standing.map(([i, x]) => `${i}: ${x.reason}`).join('; ');
      await setRow(db, row.id, 'blocked', at, { reason: why, body });
      await needsPerson(db, row.case_id, at, why); stats.blocked++; continue;
    }
    const claim = await run(db, "UPDATE auto_replies SET status = 'sending', body = ?, updated_at = ? WHERE id = ? AND status = 'pending'", body, at, row.id);
    if (!claim.meta.changes) continue;
    room--;
    const from = env.SEND_ADDRESS;
    try {
      if (!from) throw Object.assign(new Error('SEND_ADDRESS not set'), { notSent: true });
      const refs = [trig.rfc_message_id].filter(Boolean);
      const thread = trig.mailbox_id === env.SEND_MAILBOX
        ? (await one(db, 'SELECT provider_thread_id FROM threads WHERE id = ?', trig.thread_id))?.provider_thread_id : undefined;
      const mime = buildMime({ from, fromName: { en: 'Chapala Theological Seminary', es: 'Seminario Teológico de Chapala', fr: 'Séminaire Théologique de Chapala' }[row.language],
        to: row.to_addr, subject: row.subject, inReplyTo: trig.rfc_message_id, references: refs, body, tag: `${row.intents}; policy ${row.policy_version}` });
      const res = await (env.GMAIL_SEND || gmailSend)(env, mime, thread);
      await setRow(db, row.id, 'sent', at, { sent: res && res.id });
      const c = await one(db, 'SELECT * FROM cases WHERE id = ?', row.case_id);
      const sum = updateSummary({ summary: c.summary, facts: JSON.parse(c.facts_json || '[]'), commitments: JSON.parse(c.commitments_json || '[]') },
        { kind: 'outbound', at_ms: Date.parse(at), mailbox: 'automatic reply', gist: intents.map((i) => TEMPLATES[i].title).join('; ') });
      await run(db, "UPDATE cases SET status = 'waiting_on_them', summary = ?, last_outbound_at = ?, next_action = ?, updated_at = ? WHERE id = ?",
        sum.summary, at, 'Wait for their reply; a follow-up goes to a person.', at, row.case_id);
      await event(db, at, row.case_id, row.message_id, 'auto_sent', { id: row.id, intents, gmail_id: res && res.id, policy: row.policy_version });
      stats.sent++;
    } catch (e) {
      const notSent = !!e.notSent;
      await setRow(db, row.id, notSent ? 'failed' : 'unknown', at, { reason: String(e.message || e).slice(0, 300) });
      await needsPerson(db, row.case_id, at, notSent ? 'sending failed' : 'unconfirmed send; check the Sent folder first');
      await event(db, at, row.case_id, row.message_id, notSent ? 'auto_failed' : 'auto_unknown', { error: String(e.message || e).slice(0, 300) });
      if (notSent) stats.failed++; else stats.unknown++;
    }
  }
  return stats;
}

/** For the console and digest. */
export async function autoReport(env) {
  const db = env.DB, at = nowIso(env);
  const s = await autoSettings(env);
  const since = addMin(at, -1440);
  const counts = Object.fromEntries((await all(db, 'SELECT status, COUNT(*) n FROM auto_replies WHERE updated_at >= ? GROUP BY status', since)).map((r) => [r.status, r.n]));
  const recent = await all(db, `SELECT a.*, k.display_name FROM auto_replies a JOIN contacts k ON k.id = a.contact_id ORDER BY a.updated_at DESC, a.id DESC LIMIT 60`);
  const templates = Object.entries(TEMPLATES).map(([id, t]) => ({ id, title: t.title, version: templateVersion(id), facts: t.facts, standing: templateStanding(id, s.approved) }));
  return { settings: s, counts, recent, templates };
}
