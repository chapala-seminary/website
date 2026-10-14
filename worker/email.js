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

/** One language per student message. Legacy records default to English. */
export const emailLanguage = value => ['en', 'es', 'fr'].includes(value) ? value : 'en';
const localePage = (page, lang) => (lang === 'en' ? '' : lang + '/') + String(page || '').replace(/^(?:en|es|fr)\//, '');
/* A page link in the student's language. Spanish and French links also name
 * the choice (?cts_lang=), so a device that remembers another language still
 * opens the page in the language of the email (public/cts-lang.js). */
export function languageLink(site, page, lang) {
  lang = emailLanguage(lang);
  const url = `${site}/${localePage(page, lang)}`;
  return lang === 'en' ? url : `${url}?cts_lang=${lang}`;
}
/* French: a no-break space before « : », a narrow one before « ? ! ; ». */
export function verificationEmail(code, link, language) {
  const messages = {
    en: { subject: `Verification code ${code}`, text: `Your Chapala Theological Seminary verification code is ${code}\nEnter it on the email confirmation or certificate page. It expires in 15 minutes.\n${link ? "Or open this link and press Confirm email:\n" + link + "\n\n" : "\n"}If you did not ask for this, ignore this message.` },
    es: { subject: `Código de verificación ${code}`, text: `Su código de verificación del Seminario Teológico de Chapala es ${code}\nEscríbalo en la página de confirmación del correo o del certificado. Vence en 15 minutos.\n${link ? "O abra este enlace y pulse Confirmar correo:\n" + link + "\n\n" : "\n"}Si no lo solicitó, ignore este mensaje.` },
    fr: { subject: `Code de vérification ${code}`, text: `Votre code de vérification du Séminaire théologique de Chapala est ${code}\nSaisissez-le sur la page de confirmation de l’adresse e-mail ou sur la page du certificat. Il expire dans 15 minutes.\n${link ? "Vous pouvez aussi ouvrir ce lien et appuyer sur « Confirmer l’adresse e-mail » :\n" + link + "\n\n" : "\n"}Si vous n’avez pas fait cette demande, ignorez ce message.` },
  };
  return messages[emailLanguage(language)];
}
export function codeEmail({ students, origin, lang }) {
  lang = emailLanguage(lang);
  const page = languageLink(origin || 'https://chapalaseminary.org', 'cts-backup.html', lang);
  const list = students.map(s => `  ${s.name}: ${s.id}`).join('\n');
  return {
    en: { subject: 'Your student code', text: `You asked for your Chapala Theological Seminary student code(s):\n\n${list}\n\nTo restore your progress, open ${page} and enter your code under "Restore from a code". Keep it private, like a password.\n\nIf you did not ask for this, ignore this message.` },
    es: { subject: 'Su código de estudiante', text: `Usted solicitó su(s) código(s) de estudiante del Seminario Teológico de Chapala:\n\n${list}\n\nPara restaurar su progreso, abra ${page} e ingrese su código en "Restaurar desde un código". Manténgalo privado, como una contraseña.\n\nSi no lo solicitó, ignore este mensaje.` },
    fr: { subject: 'Votre code d’étudiant', text: `Vous avez demandé votre code d’étudiant (ou vos codes) du Séminaire théologique de Chapala :\n\n${list}\n\nPour retrouver votre progression, ouvrez ${page} et saisissez votre code sous « Restaurer à partir d’un code ». Gardez-le pour vous, comme un mot de passe.\n\nSi vous n’avez pas fait cette demande, ignorez ce message.` },
  }[lang];
}
export function certificateEmail({ name, award, code, page, origin, lang }) {
  lang = emailLanguage(lang);
  const site = origin || 'https://chapalaseminary.org';
  // The French verification page is /fr/verify (worker/api.js verifyPage).
  const verify = `${site}/${lang === 'fr' ? 'fr/' : ''}verify/${code}`;
  const print = page ? languageLink(site, page, lang) : site;
  return {
    en: { subject: `Your certificate: ${award}`, text: `Dear ${name},\n\nYour certificate from Chapala Theological Seminary is registered:\n\n  ${award}\n  Verification code: ${code}\n  Anyone can check it at ${verify}\n\nTo print it or save it as a PDF, open ${print} on the device where you study.\n\nChapala Theological Seminary` },
    es: { subject: `Su certificado: ${award}`, text: `Estimado/a ${name}:\n\nSu certificado del Seminario Teológico de Chapala está registrado:\n\n  ${award}\n  Código de verificación: ${code}\n  Cualquiera puede comprobarlo en ${verify}\n\nPara imprimirlo o guardarlo como PDF, abra ${print} en el dispositivo donde estudia.\n\nSeminario Teológico de Chapala` },
    fr: { subject: `Votre certificat : ${award}`, text: `Bonjour ${name},\n\nVotre certificat du Séminaire théologique de Chapala est enregistré :\n\n  ${award}\n  Code de vérification : ${code}\n  Chacun peut le vérifier sur ${verify}\n\nPour l’imprimer ou l’enregistrer en PDF, ouvrez ${print} sur l’appareil sur lequel vous étudiez.\n\nSéminaire théologique de Chapala` },
  }[lang];
}
