/* "Please confirm your registration" (Wayne, 28 Oct 2026).
 *
 * A one-time note to students who gave an email address but never confirmed
 * it. On 28 Oct, 203 such students; 132 of them had never been sent a
 * confirmation request at all, and others registered while the old mail
 * service was hitting its daily limit. Confirmed students are about three
 * times as likely to have finished a unit (52% against 18%), and a confirmed
 * address is how certificates and lost student codes reach them.
 *
 * The wording is Wayne's: "confirm your registration". They are already
 * registered and may study freely; the note never says otherwise.
 *
 * Each note carries the student's own confirmation link (the same link the
 * site sends from its confirmation page, valid INVITE_DAYS instead of 15
 * minutes, because a letter may sit in an inbox for days). Opening it and
 * pressing "Confirm email" confirms the address; nothing else changes.
 *
 * Sent ONLY by a person pressing the button on /staff/confirm-invite, in
 * batches of at most BATCH, and only where CONFIRM_INVITE_MODE is "send".
 * Each student gets it once (an outreach row, kind 'confirm_invite'). Never to
 * a student who asked not to be written to, has no email, is the tester
 * account, was merged into another record, or is in the middle of confirming
 * already (an unexpired code). "Send me a sample" mails the exact note to the
 * signed-in staff member, with a link that confirms nothing.
 */
import { emailConfigured, emailLogOnly, sendEmail, emailLanguage } from './email.js';

export const INVITE_DAYS = 14;
export const BATCH = 50;
const TESTER_EMAIL = 'tester@chapalaseminary.org';
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const origin = (env) => (env.SITE_ORIGIN || 'https://chapalaseminary.org').replace(/\/+$/, '');
const firstName = (name) => {
  const w = String(name || '').trim().split(/\s+/)[0] || '';
  return /^[\p{L}][\p{L}'’.-]{0,29}$/u.test(w) ? w : '';
};

/** The note, in the student's language (Swahili and unknown read English). */
export function inviteEmail({ name, lang }, { link, stopUrl, site }) {
  lang = emailLanguage(lang);
  const n = firstName(name);
  const host = site.replace(/^https?:\/\//, '');
  const home = lang === 'en' ? `${site}/` : `${site}/${lang}/?cts_lang=${lang}`;
  const t = {
    en: {
      subject: 'Please confirm your registration — Chapala Theological Seminary',
      lines: [
        `Hello${n ? ' ' + n : ''},`, '',
        'Thank you for registering with Chapala Theological Seminary. Please confirm your registration by opening the link below and pressing "Confirm email". This confirms your email address, which is how we send your certificates and how you can recover your student code if you ever lose it.', '',
        'Confirm my registration:', `  ${link}`, '',
        `The link works for ${INVITE_DAYS} days.`, '',
        `If you have not begun yet, start with any of the seven foundation courses on the home page (${home}). They are free, and you may take them in any order.`, '',
        'May the Lord bless your studies,', 'Chapala Theological Seminary', '',
        '--', `You are receiving this because you registered at ${host}. If you did not register, ignore this message. To stop notes about your progress: ${stopUrl}`,
      ],
    },
    es: {
      subject: 'Por favor confirme su registro — Seminario Teológico de Chapala',
      lines: [
        `Hola${n ? ' ' + n : ''}:`, '',
        'Gracias por registrarse en el Seminario Teológico de Chapala. Por favor confirme su registro abriendo el enlace de abajo y pulsando "Confirmar correo". Así se confirma su correo electrónico, que es como le enviamos sus certificados y como puede recuperar su código de estudiante si alguna vez lo pierde.', '',
        'Confirmar mi registro:', `  ${link}`, '',
        `El enlace funciona durante ${INVITE_DAYS} días.`, '',
        `Si todavía no ha comenzado, empiece con cualquiera de los siete cursos de fundamento en la página principal (${home}). Son gratuitos, y puede tomarlos en el orden que prefiera.`, '',
        'Que el Señor bendiga sus estudios,', 'Seminario Teológico de Chapala', '',
        '--', `Recibe este mensaje porque se registró en ${host}. Si usted no se registró, ignore este mensaje. Para no recibir más mensajes sobre su progreso: ${stopUrl}`,
      ],
    },
    // French typography: a no-break space before « : », a narrow one before « ? ».
    fr: {
      subject: 'Veuillez confirmer votre inscription — Séminaire théologique de Chapala',
      lines: [
        `Bonjour${n ? ' ' + n : ''},`, '',
        'Merci de votre inscription au Séminaire théologique de Chapala. Veuillez confirmer votre inscription en ouvrant le lien ci-dessous et en appuyant sur « Confirmer l’adresse e-mail ». Cela confirme votre adresse e-mail : c’est ainsi que nous vous envoyons vos certificats et que vous pouvez récupérer votre code d’étudiant si vous le perdez.', '',
        'Confirmer mon inscription :', `  ${link}`, '',
        `Le lien est valable ${INVITE_DAYS} jours.`, '',
        `Si vous n’avez pas encore commencé, choisissez l’un des sept cours fondamentaux sur la page d’accueil (${home}). Ils sont gratuits, et vous pouvez les suivre dans l’ordre de votre choix.`, '',
        'Que le Seigneur bénisse vos études,', 'Séminaire théologique de Chapala', '',
        '--', `Vous recevez ce message parce que vous vous êtes inscrit sur ${host}. Si vous ne vous êtes pas inscrit, ignorez ce message. Pour ne plus recevoir de messages sur votre progression : ${stopUrl}`,
      ],
    },
  }[lang];
  return { subject: t.subject, text: t.lines.join('\n') };
}

/** Who has not yet been invited and may be. Pure reading. */
export async function invitees(env, asOf = new Date()) {
  const rows = (await env.DB.prepare(
    `SELECT s.id, s.name, s.email, s.lang, s.created_at FROM students s
     WHERE s.merged_into IS NULL AND s.email_verified_at IS NULL AND s.contact_opt_out_at IS NULL
       AND s.email IS NOT NULL AND trim(s.email) <> '' AND lower(s.email) <> ?
       AND NOT EXISTS (SELECT 1 FROM outreach o WHERE o.student_id = s.id AND o.kind = 'confirm_invite' AND o.status = 'sent')
       AND NOT EXISTS (SELECT 1 FROM email_challenges c WHERE c.student_id = s.id AND c.expires_at > ?)
     ORDER BY s.created_at`).bind(TESTER_EMAIL, asOf.toISOString()).all()).results ?? [];
  return rows.filter((r) => EMAIL_RE.test(r.email.trim()));
}

const hex = (bytes) => [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
async function sha(s) {
  return hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))));
}
/* The same hashing worker/api.js uses (hashCode), so /api/email/link accepts it. */
const hashCode = (id, code) => sha(id + ':' + code);

function confirmLink(site, lang, token) {
  lang = emailLanguage(lang);
  const u = new URL((lang === 'en' ? '/' : `/${lang}/`) + 'cts-confirm-email.html', site + '/');
  if (lang !== 'en') u.searchParams.set('cts_lang', lang);
  u.hash = 'token=' + token;   // never sent to the server or in a referrer
  return u.href;
}

async function contactToken(env, studentId) {
  const have = await env.DB.prepare('SELECT token FROM contact_tokens WHERE student_id = ?').bind(studentId).first();
  if (have) return have.token;
  const b = crypto.getRandomValues(new Uint8Array(18));
  const token = btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  await env.DB.prepare('INSERT INTO contact_tokens (token, student_id) VALUES (?, ?) ON CONFLICT(student_id) DO NOTHING').bind(token, studentId).run();
  return (await env.DB.prepare('SELECT token FROM contact_tokens WHERE student_id = ?').bind(studentId).first()).token;
}

/** Send to the next `limit` (at most BATCH) invitees. Only in "send" mode. */
export async function runConfirmInvites(env, { asOf = new Date(), limit = BATCH } = {}) {
  const list = await invitees(env, asOf);
  const take = Math.max(0, Math.min(BATCH, Number(limit) || BATCH));
  if (env.CONFIRM_INVITE_MODE !== 'send') return { mode: 'off', waiting: list.length, results: [] };
  if (!emailConfigured(env)) return { mode: 'send', waiting: list.length, error: 'email is not configured', results: [] };
  const site = origin(env);
  const t = asOf.toISOString(), today = t.slice(0, 10);
  const expires = new Date(asOf.getTime() + INVITE_DAYS * 86400000).toISOString();
  const results = [];
  for (const st of list.slice(0, take)) {
    const token = hex(crypto.getRandomValues(new Uint8Array(32)));
    const unusedCode = hex(crypto.getRandomValues(new Uint8Array(16)));    // the link confirms; there is no code to type
    const email = st.email.trim().toLowerCase();
    let status = 'sent', error = null, msg = null;
    try {
      await env.DB.prepare(
        `INSERT INTO email_challenges (student_id, email, code_hash, link_hash, expires_at, attempts, sent_at, sends_today, sends_day)
         VALUES (?, ?, ?, ?, ?, 0, ?, 1, ?)
         ON CONFLICT(student_id) DO UPDATE SET email = excluded.email, code_hash = excluded.code_hash, link_hash = excluded.link_hash,
           expires_at = excluded.expires_at, attempts = 0, sent_at = excluded.sent_at, sends_today = 1, sends_day = excluded.sends_day`)
        .bind(st.id, email, await hashCode(st.id, unusedCode), await hashCode('email-link', token), expires, t, today).run();
      msg = inviteEmail(st, { link: confirmLink(site, st.lang, token), stopUrl: `${site}/stop-notes/${await contactToken(env, st.id)}`, site });
      await sendEmail(env, { to: email, ...msg });
    } catch (e) {
      status = 'failed'; error = String(e && e.message || e).slice(0, 300);
      await env.DB.prepare('DELETE FROM email_challenges WHERE student_id = ? AND sent_at = ?').bind(st.id, t).run();
    }
    await env.DB.prepare('INSERT INTO outreach (student_id, kind, status, error, sent_at) VALUES (?, ?, ?, ?, ?)')
      .bind(st.id, 'confirm_invite', status, error, t).run();
    results.push({ student: st.name, email, lang: emailLanguage(st.lang), status, ...(error ? { error } : {}),
      ...(emailLogOnly(env) && msg ? { message: msg } : {}) });
  }
  return { mode: 'send', waiting: list.length - results.filter((r) => r.status === 'sent').length, results };
}

/** The exact note, to a staff member, with a link that confirms nothing. */
export async function sendSample(env, to, lang) {
  if (!emailConfigured(env)) return { status: 'skipped', why: 'email is not configured' };
  const site = origin(env);
  const msg = inviteEmail({ name: 'María López', lang }, { link: confirmLink(site, lang, '0'.repeat(64)), stopUrl: `${site}/stop-notes/sample`, site });
  await sendEmail(env, { to, subject: `[SAMPLE] ${msg.subject}`, text: msg.text });
  return { status: 'sent', to, lang: emailLanguage(lang) };
}

/* ---- the staff page ------------------------------------------------------- */

export async function confirmInvitePage(env, user, { esc, html, STYLE }, flash = '') {
  const list = await invitees(env);
  const by = {};
  for (const s of list) by[emailLanguage(s.lang)] = (by[emailLanguage(s.lang)] || 0) + 1;
  const sent = (await env.DB.prepare(`SELECT status, COUNT(*) n FROM outreach WHERE kind = 'confirm_invite' GROUP BY status`).all()).results ?? [];
  const confirmedSince = (await env.DB.prepare(`SELECT COUNT(DISTINCT o.student_id) n FROM outreach o JOIN students s ON s.id = o.student_id
     WHERE o.kind = 'confirm_invite' AND o.status = 'sent' AND s.email_verified_at >= o.sent_at`).first())?.n || 0;
  const site = origin(env);
  const ex = (lang) => { const m = inviteEmail({ name: 'María López', lang }, { link: confirmLink(site, lang, '…'), stopUrl: `${site}/stop-notes/…`, site });
    return `<h3>${lang.toUpperCase()}</h3><pre>Subject: ${esc(m.subject)}\n\n${esc(m.text)}</pre>`; };
  const on = env.CONFIRM_INVITE_MODE === 'send';
  return html(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>CTS confirm-registration note</title><style>${STYLE}</style></head><body>
<h1>"Please confirm your registration"</h1>
<p>Signed in as ${esc(user)}. <a href="/staff/students">Back to the roster</a> · <a href="/staff/notes">Notes to students</a></p>
${flash ? `<p><b>${esc(flash)}</b></p>` : ''}
<p>A one-time note to students who gave an email but never confirmed it. Each student gets it once, with a personal link valid ${INVITE_DAYS} days.</p>
<p><b>Waiting: ${list.length}</b> (English ${by.en || 0}, Spanish ${by.es || 0}, French ${by.fr || 0}). Sent so far: ${sent.map((r) => `${r.n} ${esc(r.status)}`).join(', ') || 'none'}. Confirmed after the note: ${confirmedSince}.</p>
<form method="post" action="/staff/confirm-invite/sample"><p>Send me a sample: <button name="lang" value="en">English</button> <button name="lang" value="es">Spanish</button> <button name="lang" value="fr">French</button> <small>(to ${esc(user)}; its link confirms nothing)</small></p></form>
${on ? `<form method="post" action="/staff/confirm-invite/send"><p><button name="limit" value="${BATCH}">Send to the next ${Math.min(BATCH, list.length)}</button> <small>At most ${BATCH} at a time, to stay within the daily email allowance.</small></p></form>`
     : `<p>Sending to students is OFF on this site (CONFIRM_INVITE_MODE is not "send"). Samples still work.</p>`}
<h2>What the note says</h2>${ex('en')}${ex('es')}${ex('fr')}
</body></html>`);
}
