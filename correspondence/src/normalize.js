/* Addresses, message text and redaction (issue #163, section 7).
 *
 * Everything that reaches the database or a model prompt passes through here.
 * Two rules:
 *   1. An address is a contact's identity. Names never are.
 *   2. Text from an email is data. It is cut down to the newest part, capped,
 *      and anything that looks like a secret is replaced before it is kept.
 */

const GMAIL_DOMAINS = new Set(['gmail.com', 'googlemail.com']);

/** 'Pastor X <Test.User+cts@GMail.com>' -> 'testuser@gmail.com'. Gmail ignores dots and
 *  +tags, so those collapse; other providers' local parts are kept as written
 *  (lower-cased), because some of them do treat dots as significant. */
export function normAddress(raw) {
  if (!raw) return '';
  const m = String(raw).match(/<([^>]+)>/);
  let a = (m ? m[1] : String(raw)).trim().toLowerCase().replace(/^mailto:/, '');
  const at = a.lastIndexOf('@');
  if (at < 1) return '';
  let local = a.slice(0, at), domain = a.slice(at + 1).replace(/\.$/, '');
  if (GMAIL_DOMAINS.has(domain)) {
    local = local.split('+')[0].replace(/\./g, '');
    domain = 'gmail.com';
  }
  return `${local}@${domain}`;
}

export function displayName(raw) {
  const m = String(raw || '').match(/^\s*"?([^"<]+?)"?\s*</);
  return m ? m[1].trim() : '';
}

export const addressList = (v) =>
  (Array.isArray(v) ? v : String(v || '').split(','))
    .map(normAddress).filter(Boolean);

/* Lines that start the quoted history in the languages CTS writes in. */
const QUOTE_HEADERS = [
  /^On .{4,120} wrote:\s*$/i,
  /^El .{4,120} escribi[óo]:\s*$/i,
  /^Le .{4,120} a [ée]crit\s*:\s*$/i,
  /^Em .{4,120} escreveu:\s*$/i,
  /^-{2,}\s*(Original Message|Mensaje original|Message d'origine|Forwarded message|Mensaje reenviado)\s*-{2,}/i,
  /^_{8,}\s*$/,
  /^(From|De|Envoyé par|Enviado el|Sent):\s.+/i,
];

/** The newest part of a message: everything before the quoted history,
 *  without '>' lines or a signature block. */
export function newestText(body) {
  const lines = String(body || '').replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  for (const line of lines) {
    if (QUOTE_HEADERS.some((re) => re.test(line.trim()))) break;
    if (/^\s*>/.test(line)) continue;
    if (/^--\s*$/.test(line)) break;
    out.push(line);
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/* Secrets and near-secrets that must never be stored or sent to a model:
   student access codes, passwords, one-time codes, card-like numbers. The
   student-code shape follows the site's codes (letters and digits in groups
   joined by dashes); a false positive costs a few redacted characters. */
const REDACTIONS = [
  [/\b(?:password|contraseña|contrasena|mot de passe|senha|pwd)\s*[:=]?\s*\S+/gi, '[password removed]'],
  [/\b(?:code|c[óo]digo|codigo|PIN)\s*[:#]?\s*[A-Z0-9]{3,}(?:-[A-Z0-9]{2,}){1,4}\b/gi, '[code removed]'],
  [/\b[A-Z0-9]{3,6}(?:-[A-Z0-9]{3,6}){2,4}\b/g, '[code removed]'],
  [/\b\d{6}\b(?=[^\n]{0,40}\b(?:verif|confirm|c[óo]digo|code)\b)/gi, '[code removed]'],
  [/\b(?:\d[ -]?){13,19}\b/g, '[number removed]'],
];

export function redact(text) {
  let t = String(text || '');
  for (const [re, rep] of REDACTIONS) t = t.replace(re, rep);
  return t;
}

export const EXCERPT_MAX = 1500;

/** What the console keeps of a body: newest part, redacted, capped. */
export function excerpt(body, max = EXCERPT_MAX) {
  const t = redact(newestText(body));
  return t.length > max ? t.slice(0, max) + ' …' : t;
}

const STOP = new Set(('the a an and or of to in on for is are was be it this that i you we my your me ' +
  'el la los las de del y o en un una que es por para con mi su se lo le al ' +
  'le la les des et ou en un une est pour avec mon ma je vous nous').split(' '));

/** A short fingerprint of the questions in a message: the sorted content
 *  words of its question sentences. Two messages asking the same thing in
 *  slightly different words share most of these words. */
export function questionWords(text) {
  const qs = String(text || '').split(/(?<=[?¿.!\n])/).filter((s) => /[?¿]/.test(s));
  const words = new Set();
  for (const q of qs)
    for (const w of q.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').match(/[a-z0-9]{3,}/g) || [])
      if (!STOP.has(w)) words.add(w.replace(/(es|s)$/, ''));
  return [...words].sort();
}

export function similarity(a, b) {
  const A = new Set(a), B = new Set(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}
