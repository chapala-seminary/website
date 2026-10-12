/* Outgoing email: Cloudflare Email Service first, Resend as the fallback.
 *
 * Decided 25 Sept 2026: Resend, because Cloudflare's send_email binding then
 * reached only addresses verified in the seminary's account. Revised 12 Oct
 * 2026 (Dr. Cook): Cloudflare Email Service now sends to any recipient on
 * Workers Paid, which the seminary has had since 11 Oct, with 3,000 emails a
 * month included -- while Resend's free plan stops at 100 a day, a limit the
 * site reached on 9 Oct.
 *
 * Order of attempts:
 *   1. env.EMAIL (the send_email binding), when it exists;
 *   2. Resend, when RESEND_API_KEY is set -- used if there is no binding, or
 *      if Cloudflare refuses for a reason that is about Cloudflare rather
 *      than the message (domain not yet onboarded, a quota, a rate limit, a
 *      temporary error). Email Service is in beta and new accounts start on a
 *      small daily quota that grows, so Resend's 100 a day stays as a cushion.
 *
 * Configuration (wrangler.jsonc):
 *   send_email      [{ "name": "EMAIL" }]  -- the Cloudflare binding
 *   RESEND_API_KEY  secret, optional now:  `npx wrangler secret put RESEND_API_KEY [--env beta]`
 *   EMAIL_FROM      e.g. "Chapala Theological Seminary <certificates@chapalaseminary.org>"
 *   EMAIL_REPLY_TO  where a student's reply goes (the seminary's inbox)
 *   EMAIL_MODE      "log" in the test config only: nothing is sent, and the
 *                   caller is told so, so the suite can finish a verification
 *
 * Before the binding can reach students, chapalaseminary.org must be onboarded
 * once in the dashboard: Compute > Email Service > Email Sending > Onboard
 * Domain (it adds SPF, DKIM and bounce records on cf-bounce.chapalaseminary.org
 * and a DMARC record). Until then Cloudflare answers E_SENDER_DOMAIN_NOT_AVAILABLE
 * and every message goes through Resend, exactly as before.
 *
 * With no way to send and no log mode, sending fails loudly (503) rather than
 * pretending a message went out.
 */

const hasCloudflare = (env) => !!(env && env.EMAIL && typeof env.EMAIL.send === 'function');

export function emailConfigured(env) {
  return !!(env && (hasCloudflare(env) || env.RESEND_API_KEY || env.EMAIL_MODE === 'log'));
}

/** True only in the test harness: log mode with nothing that could really send. */
export function emailLogOnly(env) {
  return !!(env && env.EMAIL_MODE === 'log' && !env.RESEND_API_KEY && !hasCloudflare(env));
}

/** "Name <a@b>" -> { name, email }; a bare address -> { email }. */
export function parseAddress(s) {
  const m = /^\s*"?([^"<]*?)"?\s*<\s*([^>\s]+)\s*>\s*$/.exec(s || '');
  if (m) return m[1] ? { name: m[1], email: m[2] } : { email: m[2] };
  return { email: String(s || '').trim() };
}

/* Cloudflare's refusals that say nothing is wrong with the message itself, so
   Resend may still deliver it. A bad address, a suppressed recipient or an
   outright delivery failure would fail at Resend too, and are not retried. */
const FALL_BACK_ON = new Set([
  'E_SENDER_DOMAIN_NOT_AVAILABLE', 'E_SENDER_NOT_VERIFIED', 'E_RECIPIENT_NOT_ALLOWED',
  'E_DAILY_LIMIT_EXCEEDED', 'E_RATE_LIMIT_EXCEEDED', 'E_INTERNAL_SERVER_ERROR',
]);

async function viaCloudflare(env, msg) {
  const r = await env.EMAIL.send({
    from: parseAddress(env.EMAIL_FROM),
    to: msg.to,
    subject: msg.subject,
    text: msg.text,
    ...(msg.html ? { html: msg.html } : {}),
    ...(env.EMAIL_REPLY_TO ? { replyTo: env.EMAIL_REPLY_TO } : {}),
  });
  return { id: r && r.messageId, via: 'cloudflare' };
}

async function viaResend(env, msg) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [msg.to],
      subject: msg.subject,
      text: msg.text,
      ...(msg.html ? { html: msg.html } : {}),
      ...(env.EMAIL_REPLY_TO ? { reply_to: env.EMAIL_REPLY_TO } : {}),
    }),
  });
  if (!res.ok) {
    // Resend's error body names the problem (unverified domain, bad key,
    // quota). Log it; the student is told only that sending failed.
    console.error('resend error', res.status, (await res.text()).slice(0, 500));
    const e = new Error('the email could not be sent'); e.status = 502; throw e;
  }
  return { ...(await res.json()), via: 'resend' };
}

/** { to, subject, text, html? } -> { id, via } | { logged: true }; throws on failure. */
export async function sendEmail(env, msg) {
  if (emailLogOnly(env)) {
    console.log('email (log mode):', msg.to, '|', msg.subject);
    return { logged: true };
  }
  if (!env.EMAIL_FROM || !(hasCloudflare(env) || env.RESEND_API_KEY)) {
    const e = new Error('email is not configured'); e.status = 503; throw e;
  }
  if (hasCloudflare(env)) {
    try {
      return await viaCloudflare(env, msg);
    } catch (err) {
      const code = err && err.code;
      console.error('cloudflare email error', code || '', String((err && err.message) || err).slice(0, 300));
      if (!(env.RESEND_API_KEY && FALL_BACK_ON.has(code))) {
        const e = new Error('the email could not be sent'); e.status = 502; throw e;
      }
    }
  }
  return await viaResend(env, msg);
}

/** The verification message, in both languages: the site is bilingual and
 *  the Worker does not know which one the student is reading. */
export function verificationEmail(code, link) {
  const text =
    `Your Chapala Theological Seminary verification code is ${code}\n` +
    `Enter it on the email confirmation or certificate page. It expires in 15 minutes.\n` +
    (link ? `Or open this link and press Confirm email:\n${link}\n\n` : '\n') +
    `Su código de verificación del Seminario Teológico de Chapala es ${code}\n` +
    `Escríbalo en la página de confirmación del correo o del certificado. Vence en 15 minutos.\n` +
    (link ? `O abra este enlace y pulse Confirmar correo:\n${link}\n\n` : '\n') +
    `If you did not ask for this, ignore this message. / Si no lo solicitó, ignore este mensaje.`;
  return { subject: `Verification code ${code} · Código de verificación`, text };
}

/** A student's code, sent to the address on their record when they ask for
 *  it ("Email me my code"). Every live record with the address is listed, by
 *  name: two people may share one inbox. Both languages, like the others. */
export function codeEmail({ students, origin }) {
  const page = `${origin || 'https://chapalaseminary.org'}/cts-backup.html`;
  const list = students.map((s) => `  ${s.name}: ${s.id}`).join('\n');
  const one = students.length === 1;
  const text =
    `You asked for your Chapala Theological Seminary student code${one ? '' : 's'}:\n\n${list}\n\n` +
    `To continue with your progress on this device, open ${page} and enter the code under ` +
    `"Restore from a code". Keep it private, like a password.\n\n` +
    `----\n\n` +
    `Usted solicitó su${one ? '' : 's'} código${one ? '' : 's'} de estudiante del Seminario Teológico de Chapala:\n\n${list}\n\n` +
    `Para continuar con su progreso en este dispositivo, abra ${page} y escriba el código en ` +
    `"Restaurar desde un código". Manténgalo en privado, como una contraseña.\n\n` +
    `If you did not ask for this, ignore this message. / Si no lo solicitó, ignore este mensaje.`;
  return { subject: 'Your student code · Su código de estudiante', text };
}

/** The student's own copy of a certificate they just claimed: what it is for,
 *  the code anyone can check it by, and where to print it. Plain text in both
 *  languages, like the verification message. `page` is the certificate page's
 *  filename when the browser said which one it was on, so the link goes back
 *  to the printable diploma; `origin` is the site the request came in on. */
export function certificateEmail({ name, award, code, page, origin }) {
  const site = origin || 'https://chapalaseminary.org';
  const verify = `${site}/verify/${code}`;
  const print = page ? `${site}/${page}` : site;
  const text =
    `Dear ${name},\n\n` +
    `Your certificate from Chapala Theological Seminary is registered:\n\n` +
    `  ${award}\n` +
    `  Verification code: ${code}\n` +
    `  Anyone can check it at ${verify}\n\n` +
    `To print it or save it as a PDF, open ${print} on the device where you study.\n\n` +
    `----\n\n` +
    `Estimado/a ${name}:\n\n` +
    `Su certificado del Seminario Teológico de Chapala está registrado:\n\n` +
    `  ${award}\n` +
    `  Código de verificación: ${code}\n` +
    `  Cualquiera puede comprobarlo en ${verify}\n\n` +
    `Para imprimirlo o guardarlo como PDF, abra ${print} en el dispositivo donde estudia.\n\n` +
    `Chapala Theological Seminary · Seminario Teológico de Chapala`;
  return { subject: `Your certificate: ${award} · Su certificado`, text };
}
