/* The scheduled run: each enabled mailbox, from its cursor, within a budget.
 *
 *   syncAll(env)          every enabled mailbox (the cron calls this)
 *   syncMailbox(env, mb)  one mailbox
 *
 * Stops at once when settings.paused = '1'. Reading never sends anything;
 * after every mailbox is read, processAutoReplies() handles the routine
 * replies that are due (src/autoreply.js), so its "has anyone answered?"
 * check sees the newest mail from all six accounts.
 */
import { accessToken, gmailClient, parseGmail } from './gmail.js';
import { ingestMessage } from './ingest.js';
import { autoSettings, processAutoReplies } from './autoreply.js';

export const BUDGET = 200;            // messages per mailbox per run
export const BOOTSTRAP_DAYS = 14;     // first run: how far back to read
export const RECOVERY_OVERLAP_MS = 86400000;
export const MAX_ATTEMPTS = 6;
const BACKOFF_MIN = [5, 15, 60, 240, 720, 1440];

const nowIso = (env) => (env.NOW ? env.NOW() : new Date().toISOString());
const addMin = (iso, m) => new Date(Date.parse(iso) + m * 60000).toISOString();

export async function settings(env) {
  const rows = (await env.DB.prepare('SELECT key, value FROM settings').all()).results || [];
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

async function ingestId(env, mb, client, id, stats) {
  try {
    const m = parseGmail(mb.id, await client.message(id));
    m.view_url = `https://mail.google.com/mail/?authuser=${encodeURIComponent(mb.address)}#all/${m.provider_thread_id}`;
    const r = await ingestMessage(env, m);
    if (r.duplicate) stats.duplicates++; else if (r.skipped) stats.skipped = (stats.skipped || 0) + 1; else stats.ingested++;
    if (!r.duplicate && !r.skipped && m.internal_ms > (stats.newest || 0)) stats.newest = m.internal_ms;
    await env.DB.prepare('DELETE FROM dead_letters WHERE mailbox_id = ? AND provider_msg_id = ?').bind(mb.id, id).run();
  } catch (e) {
    if (e.status === 404) { stats.gone++; return; }   // deleted before we read it
    stats.failed++;
    const at = nowIso(env);
    const prev = await env.DB.prepare('SELECT attempts FROM dead_letters WHERE mailbox_id = ? AND provider_msg_id = ?').bind(mb.id, id).first();
    const attempts = (prev?.attempts || 0) + 1;
    await env.DB.prepare(`INSERT INTO dead_letters (mailbox_id, provider_msg_id, attempts, last_error, next_try_at, given_up, created_at)
                          VALUES (?, ?, ?, ?, ?, ?, ?)
                          ON CONFLICT(mailbox_id, provider_msg_id) DO UPDATE SET attempts = excluded.attempts,
                            last_error = excluded.last_error, next_try_at = excluded.next_try_at, given_up = excluded.given_up`)
      .bind(mb.id, id, attempts, String(e.message || e).slice(0, 500), addMin(at, BACKOFF_MIN[Math.min(attempts, BACKOFF_MIN.length) - 1]),
        attempts >= MAX_ATTEMPTS ? 1 : 0, at).run();
  }
}

export async function syncMailbox(env, mb) {
  const stats = { mailbox: mb.id, ingested: 0, duplicates: 0, failed: 0, gone: 0, retried: 0, mode: '', more: false };
  const token = await accessToken(env, mb.id);
  const client = env.GMAIL_CLIENT_FACTORY ? env.GMAIL_CLIENT_FACTORY(mb) : gmailClient(env, token);
  let budget = BUDGET;

  // 1. due retries first, so a failure does not wait behind new mail
  const due = (await env.DB.prepare(`SELECT provider_msg_id FROM dead_letters WHERE mailbox_id = ? AND given_up = 0 AND next_try_at <= ? LIMIT 25`)
    .bind(mb.id, nowIso(env)).all()).results || [];
  for (const d of due) { stats.retried++; budget--; await ingestId(env, mb, client, d.provider_msg_id, stats); }

  const saveCursor = (historyId, extra = {}) => env.DB.prepare(
    'UPDATE mailboxes SET history_id = ?, last_internal_ms = MAX(COALESCE(last_internal_ms, 0), ?), last_sync_at = ?, last_error = NULL WHERE id = ?')
    .bind(String(historyId), stats.newest || 0, nowIso(env), mb.id).run();

  // 2. first run, or cursor lost: list by date, then take the current cursor
  const listFrom = async (afterMs, mode) => {
    stats.mode = mode;
    const startHistory = (await client.profile()).historyId;   // taken BEFORE listing: nothing between is missed
    const q = `after:${Math.floor(afterMs / 1000)}`;
    let page, ids = [];
    do { const r = await client.list(q, page); ids.push(...(r.messages || []).map((m) => m.id)); page = r.nextPageToken; } while (page && ids.length < 5000);
    ids.reverse();                                          // oldest first: replies after what they answer
    for (const id of ids) {
      // already stored: skip without a Gmail read and without using budget
      if (await env.DB.prepare('SELECT 1 FROM messages WHERE mailbox_id = ? AND provider_msg_id = ?').bind(mb.id, id).first()) { stats.duplicates++; continue; }
      if (await env.DB.prepare('SELECT 1 FROM skipped_messages WHERE mailbox_id = ? AND provider_msg_id = ?').bind(mb.id, id).first()) { stats.duplicates++; continue; }
      if (budget-- <= 0) { stats.more = true; break; }
      await ingestId(env, mb, client, id, stats);
    }
    // a partial bootstrap keeps no cursor, so the next run lists again (dedup makes that safe)
    if (!stats.more) await saveCursor(startHistory);
    else await env.DB.prepare('UPDATE mailboxes SET last_internal_ms = MAX(COALESCE(last_internal_ms, 0), ?), last_sync_at = ? WHERE id = ?').bind(stats.newest || 0, nowIso(env), mb.id).run();
  };

  const now = Date.parse(nowIso(env));
  if (!mb.history_id) { await listFrom(mb.last_internal_ms ? mb.last_internal_ms - RECOVERY_OVERLAP_MS : now - BOOTSTRAP_DAYS * 86400000, 'bootstrap'); return stats; }

  // 3. normal run: history since the cursor, record by record
  stats.mode = 'history';
  let page, cursor = mb.history_id, last;
  try {
    do {
      const r = await client.history(mb.history_id, page);
      last = r.historyId;
      for (const rec of r.history || []) {
        const ids = (rec.messagesAdded || []).map((a) => a.message.id);
        if (ids.length > budget) { stats.more = true; break; }
        for (const id of ids) { budget--; await ingestId(env, mb, client, id, stats); }
        cursor = rec.id;
      }
      page = stats.more ? null : r.nextPageToken;
    } while (page);
  } catch (e) {
    if (e.status === 404) {   // cursor expired
      await env.DB.prepare('UPDATE mailboxes SET history_id = NULL WHERE id = ?').bind(mb.id).run();
      await listFrom((mb.last_internal_ms || now - BOOTSTRAP_DAYS * 86400000) - RECOVERY_OVERLAP_MS, 'recovery');
      return stats;
    }
    throw e;
  }
  await saveCursor(stats.more ? cursor : (last || cursor));
  return stats;
}

export async function syncAll(env) {
  const s = await settings(env);
  if (s.paused === '1') return { paused: true };
  env.AI_ENABLED = s.ai_enabled === '1';
  env._auto = await autoSettings(env);
  const mbs = (await env.DB.prepare('SELECT * FROM mailboxes WHERE enabled = 1').all()).results || [];
  const out = [];
  for (const mb of mbs) {
    try { out.push(await syncMailbox(env, mb)); }
    catch (e) {
      await env.DB.prepare('UPDATE mailboxes SET last_error = ?, last_sync_at = ? WHERE id = ?').bind(String(e.message || e).slice(0, 500), nowIso(env), mb.id).run();
      out.push({ mailbox: mb.id, error: String(e.message || e) });
    }
  }
  // a mailbox that could not be read might hold the answer that makes an
  // automatic reply unnecessary: no sending in a run with a read failure
  const failedRead = out.some((r) => r.error);
  const auto = failedRead ? { held: 'a mailbox could not be read this run' } : await processAutoReplies(env);
  return { mailboxes: out, auto };
}

export const RETENTION_DAYS = 180;
/** Clear stored excerpts after RETENTION_DAYS; metadata and summaries stay. */
export async function retention(env) {
  const cut = new Date(Date.parse(nowIso(env)) - RETENTION_DAYS * 86400000).toISOString();
  const r = await env.DB.prepare('UPDATE messages SET excerpt = NULL WHERE excerpt IS NOT NULL AND ingested_at < ?').bind(cut).run();
  // the bodies of automatic replies are kept as long as excerpts, then cleared
  await env.DB.prepare("UPDATE auto_replies SET body = NULL WHERE body IS NOT NULL AND updated_at < ?").bind(cut).run();
  // ids of skipped personal mail are only needed while Gmail could list them again
  const skipCut = new Date(Date.parse(nowIso(env)) - 30 * 86400000).toISOString();
  await env.DB.prepare('DELETE FROM skipped_messages WHERE at < ?').bind(skipCut).run();
  return { cleared: r.meta.changes };
}
