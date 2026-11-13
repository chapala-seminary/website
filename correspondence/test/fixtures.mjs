// Synthetic mail for the tests. Every address is on example.org / example.edu
// (reserved for documentation); no real student or contact appears in git.
import { d1, clock } from './d1-shim.mjs';

export const CTS = 'chapalatheological@gmail.com';
export const INFO = 'info@chapalaseminary.org';

export async function env(extra = {}) {
  const db = d1();
  const c = clock();
  for (const [id, address] of [['cts-gmail', CTS], ['cts-info', INFO]])
    await db.prepare('INSERT INTO mailboxes (id, address, enabled, created_at) VALUES (?, ?, 1, ?)').bind(id, address, c.now()).run();
  return { DB: db, NOW: c.now, clock: c, OWN_ADDRESSES: 'certificates@chapalaseminary.org', OWN_ADDRESSES_EXTRA: 'staff.person@example.org', ...extra };
}

let n = 0;
/** A message in the console's input shape. */
export function mail(o) {
  n++;
  return {
    mailbox_id: o.mailbox || 'cts-gmail',
    provider_msg_id: o.id || `m${n}`,
    provider_thread_id: o.thread || `t${n}`,
    rfc_message_id: o.rfc || `<msg${n}@example.org>`,
    in_reply_to: o.replyTo || null,
    references: o.refs || (o.replyTo ? [o.replyTo] : []),
    from: o.from,
    to: o.to || [CTS],
    cc: [],
    internal_ms: o.at ? Date.parse(o.at) : Date.parse('2026-10-20T10:00:00Z') + n * 60000,
    subject: o.subject || 'Question',
    body: o.body || '',
    headers: o.headers || {},
    label_ids: o.labels || [],
    view_url: `https://mail.example/${o.thread || n}`,
  };
}
