/* What the owner sees (issue #163, section 6): exceptions only.
 *
 * The owner's queue holds a case only when someone has to act on it AND the
 * action is not routine: Dr. Cook must decide, it is urgent, it is a
 * technical escalation, a reply is overdue, or a conversation link needs a
 * person's check. Waiting-on-them, resolved and automated mail never appear;
 * they are counted, so the backlog stays visible without being read.
 */
export const SLA_HOURS = { urgent: 24, high: 48, normal: 120, low: 240 };

const hoursSince = (iso, now) => (iso ? (Date.parse(now) - Date.parse(iso)) / 3600000 : 0);

export async function dashboardData(env, now = env.NOW ? env.NOW() : new Date().toISOString()) {
  const db = env.DB;
  const open = (await db.prepare(`SELECT c.*, k.address_norm, k.display_name,
      (SELECT t.mailbox_id || '|' || COALESCE(m.view_url, '') FROM threads t JOIN messages m ON m.thread_id = t.id
        WHERE t.case_id = c.id ORDER BY m.internal_ms DESC LIMIT 1) AS latest,
      (SELECT COUNT(*) FROM threads t WHERE t.case_id = c.id AND t.link_state = 'needs_review') AS unlinked
    FROM cases c JOIN contacts k ON k.id = c.contact_id
    WHERE c.status <> 'resolved' AND c.track <> 'automated'
    ORDER BY CASE c.priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END, c.updated_at`).all()).results || [];

  const sections = { owner: [], escalated: [], overdue: [], review_links: [], pending: [], waiting: [] };
  for (const c of open) {
    const [mailbox, link] = String(c.latest || '|').split('|');
    const age = hoursSince(c.last_inbound_at || c.opened_at, now);
    const row = { id: c.id, who: c.display_name || c.address_norm, address: c.address_norm, track: c.track, category: c.category,
      priority: c.priority, status: c.status, summary: c.summary, next_action: c.next_action, owner_reason: c.owner_reason,
      assignee: c.assignee, age_hours: Math.round(age), mailbox, link, due_at: c.due_at };
    if (c.status === 'waiting_on_them' || c.status === 'scheduled_follow_up') { sections.waiting.push(row); continue; }
    if (c.unlinked) sections.review_links.push(row);
    if (c.needs_owner) sections.owner.push(row);
    else if (c.status === 'escalated') sections.escalated.push(row);
    else if (age > SLA_HOURS[c.priority]) sections.overdue.push(row);
    else sections.pending.push(row);
  }

  const q = async (sql, ...a) => (await db.prepare(sql).bind(...a).first()) || {};
  const since = new Date(Date.parse(now) - 86400000).toISOString();
  const counts = {
    received_24h: (await q(`SELECT COUNT(*) n FROM messages WHERE direction = 'in' AND ingested_at >= ?`, since)).n || 0,
    automated_24h: (await q(`SELECT COUNT(*) n FROM messages WHERE lane IN ('automated','auto_reply') AND ingested_at >= ?`, since)).n || 0,
    resolved_24h: (await q(`SELECT COUNT(*) n FROM case_events WHERE kind IN ('opt_out','staff_update') AND at >= ? AND detail LIKE '%resolved%'`, since)).n || 0,
    bounces_hard: (await q(`SELECT COUNT(*) n FROM suppressions WHERE reason = 'hard_bounce'`)).n || 0,
    bounces_soft_watch: (await q(`SELECT COUNT(*) n FROM suppressions WHERE reason = 'soft_bounce' AND permanent = 0`)).n || 0,
    opt_outs: (await q(`SELECT COUNT(*) n FROM suppressions WHERE reason IN ('opt_out','refusal')`)).n || 0,
    dead_letters: (await q(`SELECT COUNT(*) n FROM dead_letters WHERE given_up = 1`)).n || 0,
    retrying: (await q(`SELECT COUNT(*) n FROM dead_letters WHERE given_up = 0`)).n || 0,
  };
  const byStatus = (await db.prepare(`SELECT track, status, COUNT(*) n FROM cases WHERE track <> 'automated' GROUP BY track, status`).all()).results || [];
  const mailboxes = (await db.prepare('SELECT id, address, enabled, personal, last_sync_at, last_error FROM mailboxes ORDER BY id').all()).results || [];
  const flags = await (await import('./sync.js')).settings(env);
  const auto = await (await import('./autoreply.js')).autoReport(env);
  counts.skipped_personal_24h = (await q(`SELECT COUNT(*) n FROM skipped_messages WHERE at >= ?`, since)).n || 0;
  return { now, sections, counts, byStatus, mailboxes, settings: flags, auto };
}

/** The daily digest as plain text: only what needs a person. */
export function digestText(d) {
  const L = [];
  const n = d.sections.owner.length + d.sections.escalated.length + d.sections.overdue.length + d.sections.review_links.length;
  L.push(`CTS correspondence — ${d.now.slice(0, 10)}`);
  L.push(n ? `${n} item(s) need a person.` : 'Nothing needs you today.');
  const block = (title, rows, show) => {
    if (!rows.length) return;
    L.push('', `${title} (${rows.length})`);
    for (const r of rows.slice(0, 25)) L.push(`- #${r.id} ${r.who} — ${r.category.replace(/_/g, ' ')}, ${r.priority}, ${r.age_hours}h. ${show(r)}${r.link ? `\n  ${r.link}` : ''}`);
  };
  const more = (rows) => rows.length > 25 && L.push(`  …and ${rows.length - 25} more on the console.`);
  block('For Dr. Cook to decide', d.sections.owner, (r) => r.owner_reason || r.next_action); more(d.sections.owner);
  block('Technical escalations (open until verified)', d.sections.escalated, (r) => r.next_action); more(d.sections.escalated);
  block('Replies overdue', d.sections.overdue, (r) => `Assigned: ${r.assignee || 'nobody'}.`); more(d.sections.overdue);
  block('Conversation links to confirm', d.sections.review_links, () => 'Same subject in two mailboxes; not proven to be one conversation.');
  const c = d.counts;
  L.push('', `Routine, handled or waiting: ${d.sections.pending.length} pending reply, ${d.sections.waiting.length} waiting on others.`);
  L.push(`Last 24h: ${c.received_24h} received, ${c.automated_24h} automated (not shown).`);
  L.push(`Do-not-contact: ${c.bounces_hard} failed addresses, ${c.opt_outs} opt-outs; ${c.bounces_soft_watch} delayed addresses being watched.`);
  if (c.dead_letters || c.retrying) L.push(`Messages that could not be read: ${c.retrying} retrying, ${c.dead_letters} need a person.`);
  if (c.skipped_personal_24h) L.push(`Personal mailboxes: ${c.skipped_personal_24h} private message(s) left unread by the console.`);
  if (d.auto) {
    const a = d.auto, since = Date.parse(d.now) - 86400000;
    const recent = a.recent.filter((r) => Date.parse(r.updated_at) >= since);
    L.push('', `Automatic replies (${a.settings.mode}): ${a.counts.sent || 0} sent, ${a.counts.shadow || 0} recorded only, ${a.counts.blocked || 0} held for a person, ${a.counts.superseded || 0} not needed.`);
    for (const r of recent.filter((x) => ['sent', 'shadow', 'blocked', 'unknown', 'failed'].includes(x.status)).slice(0, 40))
      L.push(`- ${r.status === 'shadow' ? 'would send' : r.status}: ${r.display_name || r.to_addr} — ${r.intents.replace(/,/g, ', ')} (${r.language}), case #${r.case_id}${r.reason && r.status !== 'shadow' ? `. ${r.reason}` : ''}`);
  }
  for (const m of d.mailboxes) if (m.last_error) L.push(`Mailbox ${m.id}: ${m.last_error}`);
  if (d.settings.paused === '1') L.push('PAUSED: automatic processing is stopped.');
  return L.join('\n');
}
