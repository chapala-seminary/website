/* The one way the console sends mail: an automatic routine reply, from ONE
 * account (SEND_ADDRESS, chapalatheological@gmail.com), through the Gmail API
 * with a token that carries the gmail.send scope and nothing else.
 *
 * The reading tokens (src/gmail.js) still refuse any token that could send;
 * this token is a separate secret, GMAIL_SEND_REFRESH_TOKEN, and is refused
 * here if it can do anything besides send. Never info@chapalaseminary.org or
 * Resend (their daily quota serves the student site), never a personal
 * account.
 *
 * A send is attempted once. Gmail answering 4xx means it did not send
 * ('failed'); a timeout, a network error or a 5xx may have sent it, so the
 * reply is marked 'unknown' and never retried automatically.
 */
const SEND_SCOPE = 'https://www.googleapis.com/auth/gmail.send';

export class SendError extends Error {
  constructor(message, { notSent }) { super(message); this.notSent = !!notSent; }
}

export async function sendAccessToken(env) {
  const f = env.FETCH || fetch;
  if (!env.GMAIL_SEND_REFRESH_TOKEN || !env.GMAIL_CLIENT_ID || !env.GMAIL_CLIENT_SECRET)
    throw new SendError('sending is not authorized (GMAIL_SEND_REFRESH_TOKEN or client secrets missing)', { notSent: true });
  let r;
  try {
    r = await f('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: env.GMAIL_SEND_REFRESH_TOKEN, client_id: env.GMAIL_CLIENT_ID, client_secret: env.GMAIL_CLIENT_SECRET }),
    });
  } catch (e) { throw new SendError(`token refresh failed: ${e.message || e}`, { notSent: true }); }
  if (!r.ok) throw new SendError(`token refresh failed: ${r.status}`, { notSent: true });
  const v = await r.json();
  const scopes = String(v.scope || '').split(/\s+/).filter(Boolean);
  if (scopes.length !== 1 || scopes[0] !== SEND_SCOPE)
    throw new SendError(`the sending token must carry only gmail.send (it has: ${scopes.join(' ') || 'none'}); refusing to use it`, { notSent: true });
  return v.access_token;
}

/* ---- the message ---------------------------------------------------------- */

const utf8b64 = (s) => {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
};
const wrap = (s) => s.replace(/.{1,76}/g, '$&\r\n').trimEnd();
const encWord = (s) => (/^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${utf8b64(s)}?=`);
const clean = (v) => String(v || '').replace(/[\r\n]+/g, ' ').trim();
const angle = (id) => { const v = clean(id); return /^<[^<>\s]+>$/.test(v) ? v : ''; };

/** An RFC 5322 message, plain text, UTF-8. Auto-Submitted tells other
 *  systems' autoresponders not to answer it (RFC 3834). */
export function buildMime({ from, fromName, to, subject, inReplyTo, references = [], body, tag }) {
  const refs = [...references.map(angle), angle(inReplyTo)].filter(Boolean);
  const uniq = [...new Set(refs)].slice(-10);
  const h = [
    `From: ${encWord(clean(fromName))} <${clean(from)}>`,
    `To: <${clean(to)}>`,
    `Reply-To: <${clean(from)}>`,
    `Subject: ${encWord(clean(subject))}`,
    angle(inReplyTo) ? `In-Reply-To: ${angle(inReplyTo)}` : '',
    uniq.length ? `References: ${uniq.join(' ')}` : '',
    'Auto-Submitted: auto-replied',
    tag ? `X-CTS-Auto: ${clean(tag)}` : '',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
  ].filter(Boolean);
  return `${h.join('\r\n')}\r\n\r\n${wrap(utf8b64(String(body).replace(/\r?\n/g, '\r\n')))}\r\n`;
}

const b64url = (s) => utf8b64(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/** Send once. Returns Gmail's { id, threadId }. Throws SendError. */
export async function gmailSend(env, mime, threadId) {
  const token = await sendAccessToken(env);
  const f = env.FETCH || fetch;
  let r;
  try {
    r = await f('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify(threadId ? { raw: b64url(mime), threadId } : { raw: b64url(mime) }),
    });
  } catch (e) { throw new SendError(`send: ${e.message || e}`, { notSent: false }); }
  if (r.status >= 400 && r.status < 500) throw new SendError(`send refused: ${r.status}`, { notSent: true });
  if (!r.ok) throw new SendError(`send: ${r.status}`, { notSent: false });
  return r.json();
}
