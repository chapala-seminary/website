/* Gmail, read-only (issue #163, section 1).
 *
 * The console reads each approved mailbox through the Gmail API with the
 * gmail.readonly scope: it can see mail and nothing else -- no sending, no
 * labels, no deleting. Sending is not in this Worker at all until M3.
 *
 * Incremental: after the first run, only Gmail's history since the stored
 * cursor is read, one history record at a time, and the cursor advances past
 * a record only once its messages are stored (or parked in dead_letters for a
 * retry). A message is fetched once, by id; a thread is never re-read.
 *
 * Expired cursor: Gmail keeps history for about a week. If the cursor is too
 * old (404), the console lists messages from a day before the newest one it
 * stored and ingests them again; ingestMessage() ignores the ones it has, so
 * the overlap costs reads but cannot double-count.
 *
 * Secrets (wrangler secret put, per environment):
 *   GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET            the Google Cloud OAuth client
 *   GMAIL_REFRESH_TOKEN_<MAILBOX ID, upper, -→_>    one per approved mailbox
 */
const API = 'https://gmail.googleapis.com/gmail/v1/users/me';
const RETRIES = 3;

export function tokenName(mailboxId) {
  return 'GMAIL_REFRESH_TOKEN_' + mailboxId.toUpperCase().replace(/[^A-Z0-9]/g, '_');
}

async function fetchRetry(env, url, init, tries = RETRIES) {
  const f = env.FETCH || fetch;
  let wait = 500;
  for (let i = 0; ; i++) {
    const r = await f(url, init);
    if (r.status !== 429 && r.status < 500) return r;
    if (i >= tries) return r;
    const ra = Number(r.headers?.get?.('retry-after'));
    await (env.SLEEP || ((ms) => new Promise((ok) => setTimeout(ok, ms))))(ra ? ra * 1000 : wait);
    wait *= 2;
  }
}

export async function accessToken(env, mailboxId) {
  const refresh = env[tokenName(mailboxId)];
  if (!refresh || !env.GMAIL_CLIENT_ID || !env.GMAIL_CLIENT_SECRET) throw new Error(`mailbox ${mailboxId} is not authorized (missing ${tokenName(mailboxId)} or client secrets)`);
  const r = await fetchRetry(env, 'https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh, client_id: env.GMAIL_CLIENT_ID, client_secret: env.GMAIL_CLIENT_SECRET }),
  });
  if (!r.ok) throw new Error(`token refresh for ${mailboxId} failed: ${r.status}`);
  const v = await r.json();
  if (v.scope && /gmail\.(send|modify|compose|insert)|mail\.google\.com/.test(v.scope))
    throw new Error(`token for ${mailboxId} carries more than read-only access (${v.scope}); refusing to use it`);
  return v.access_token;
}

export function gmailClient(env, token) {
  const get = async (path) => {
    const r = await fetchRetry(env, API + path, { headers: { authorization: `Bearer ${token}` } });
    if (r.status === 404) { const e = new Error('not found'); e.status = 404; throw e; }
    if (!r.ok) { const e = new Error(`gmail ${path.split('?')[0]}: ${r.status}`); e.status = r.status; throw e; }
    return r.json();
  };
  return {
    profile: () => get('/profile'),
    history: (start, pageToken) => get(`/history?startHistoryId=${encodeURIComponent(start)}&historyTypes=messageAdded&maxResults=100${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`),
    list: (q, pageToken) => get(`/messages?q=${encodeURIComponent(q)}&maxResults=100&includeSpamTrash=false${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`),
    message: (id) => get(`/messages/${encodeURIComponent(id)}?format=full`),
  };
}

/* ---- turning a Gmail message into the console's shape ------------------- */

const b64 = (s) => {
  const bin = atob(String(s || '').replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
};
const stripHtml = (h) => String(h).replace(/<(style|script)[\s\S]*?<\/\1>/gi, '').replace(/<br\s*\/?>|<\/p>|<\/div>/gi, '\n')
  .replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"');

function bodyOf(payload) {
  let plain = '', html = '', report = '';
  const walk = (p) => {
    if (!p) return;
    const type = (p.mimeType || '').toLowerCase();
    if (p.body && p.body.data) {
      if (type === 'text/plain' && !plain) plain = b64(p.body.data);
      else if (type === 'text/html' && !html) html = b64(p.body.data);
      else if (type === 'message/delivery-status' || type === 'text/rfc822-headers') report += '\n' + b64(p.body.data);
    }
    (p.parts || []).forEach(walk);
  };
  walk(payload);
  return (plain || stripHtml(html)) + report;
}

export function parseGmail(mailboxId, m) {
  const headers = {};
  for (const h of m.payload?.headers || []) {
    const k = h.name.toLowerCase();
    if (!(k in headers)) headers[k] = h.value;
  }
  const split = (v) => (v ? v.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((s) => s.trim()).filter(Boolean) : []);
  return {
    mailbox_id: mailboxId,
    provider_msg_id: m.id,
    provider_thread_id: m.threadId,
    rfc_message_id: headers['message-id'] || null,
    in_reply_to: headers['in-reply-to'] || null,
    references: (headers['references'] || '').split(/\s+/).filter(Boolean),
    from: headers['from'] || '',
    to: split(headers['to']),
    cc: split(headers['cc']),
    internal_ms: Number(m.internalDate),
    subject: headers['subject'] || '',
    body: bodyOf(m.payload),
    headers: pick(headers, ['auto-submitted', 'list-id', 'list-unsubscribe', 'precedence', 'x-autoreply', 'x-autorespond']),
    label_ids: m.labelIds || [],
    view_url: `https://mail.google.com/mail/u/0/#all/${m.threadId}`,
  };
}
const pick = (o, ks) => Object.fromEntries(ks.filter((k) => k in o).map((k) => [k, o[k]]));
