/* Outgoing email, through Resend (decided 25 Sept 2026).
 *
 * Cloudflare's own send_email binding only reaches addresses verified in the
 * seminary's account -- fine for notices to the seminary, useless for a
 * student. Resend sends to anyone from a verified domain; the free plan is
 * 3,000 emails a month and 100 a day, far above what the seminary sends.
 *
 * Configuration (wrangler.jsonc vars + one secret):
 *   RESEND_API_KEY  secret: `npx wrangler secret put RESEND_API_KEY [--env beta]`
 *   EMAIL_FROM      e.g. "Chapala Theological Seminary <certificates@chapalaseminary.org>"
 *   EMAIL_REPLY_TO  where a student's reply goes (the seminary's inbox)
 *   EMAIL_MODE      "log" in the test config only: nothing is sent, and the
 *                   caller is told so, so the suite can finish a verification
 *
 * With no key and no log mode, sending fails loudly (503) rather than
 * pretending a message went out.
 */

export function emailConfigured(env) {
  return !!(env && (env.RESEND_API_KEY || env.EMAIL_MODE === 'log'));
}

/** { to, subject, text, html? } -> { id } | { logged: true }; throws on failure. */
export async function sendEmail(env, msg) {
  if (env.EMAIL_MODE === 'log' && !env.RESEND_API_KEY) {
    console.log('email (log mode):', msg.to, '|', msg.subject);
    return { logged: true };
  }
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    const e = new Error('email is not configured'); e.status = 503; throw e;
  }
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
  return await res.json();
}

/** The verification message, in both languages: the site is bilingual and
 *  the Worker does not know which one the student is reading. */
export function verificationEmail(code) {
  const text =
    `Your Chapala Theological Seminary verification code is ${code}\n` +
    `Enter it on the certificate page. It expires in 15 minutes.\n\n` +
    `Su código de verificación del Seminario Teológico de Chapala es ${code}\n` +
    `Escríbalo en la página del certificado. Vence en 15 minutos.\n\n` +
    `If you did not ask for this, ignore this message. / Si no lo solicitó, ignore este mensaje.`;
  return { subject: `Verification code ${code} · Código de verificación`, text };
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
