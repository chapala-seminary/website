/* Deterministic triage (issue #163, sections 4 and 5).
 *
 * Rules run before any model, and decide most mail on their own: the M0
 * baseline of the CTS Gmail inbox (22 Oct 2026, 50 most recent threads) was
 * about four-fifths automated -- GitHub, the site's own completion notices,
 * provider notices, newsletters. None of that should cost a model call or
 * reach the owner's queue.
 *
 * The model, when it is on, may only choose among the categories below and
 * write a summary. It can never lower a category's policy: what needs a
 * person is decided by POLICY, here, from the category and the flags.
 */

/* ---- lanes --------------------------------------------------------------- */

const AUTOMATED_SENDERS = [
  /^(no-?reply|noreply|do-?not-?reply|notifications?|updates?|news(letter)?|mailer|info-noreply)@/,
  /@(github\.com|noreply\.github\.com|accounts\.google\.com|google\.com|microsoft\.com|microsoftadvertising\.com|cloudflare\.com|academia-mail\.com|linkedin\.com|facebookmail\.com)$/,
];
/* The site's own notices: completion notices, weekly digest, certificates. */
const OWN_NOTICE_SENDERS = [/^certificates@chapalaseminary\.org$/];
const BOUNCE_SENDERS = [/^(mailer-daemon|postmaster)@/, /^mail-?delivery/];

const OPT_OUT = [
  /\bunsubscribe\b/i, /\bremove me\b/i, /\bstop (emailing|sending|writing)\b/i, /\bnot interested\b/i,
  /\bdo not (contact|email|write)\b/i, /\bplease don'?t (contact|email|write)\b/i,
  /\bdar(me)? de baja\b/i, /\bno (me )?(escriban|env[ií]en|contacten|vuelvan a escribir)\b/i, /\bno (estoy|estamos) interesad[oa]s?\b/i,
  /\bd[ée]sabonner\b/i, /\bne (plus )?m'?(écrire|envoyer|contacter)\b/i, /\bpas int[ée]ress[ée]\b/i,
  /\bn[ãa]o tenho interesse\b/i, /\bdescadastr/i,
];
const AUTO_REPLY_SUBJECT = /^(auto(matic)? ?reply|respuesta autom[áa]tica|r[ée]ponse automatique|out of (the )?office|fuera de (la )?oficina|absence|read:|le[ií]do:|lu ?:)/i;

/** headers: lower-case header name -> value. */
export function lane(msg, ownAddresses) {
  const from = msg.from_norm;
  const h = msg.headers || {};
  if (ownAddresses.has(from)) {
    if (OWN_NOTICE_SENDERS.some((re) => re.test(from))) return 'automated';
    return 'own_outbound';
  }
  if (OWN_NOTICE_SENDERS.some((re) => re.test(from))) return 'automated';
  if (BOUNCE_SENDERS.some((re) => re.test(from)) || /delivery status notification|undeliverable|returned mail|mail delivery (failed|subsystem)|no se pudo entregar/i.test(msg.subject || '')) {
    return bounceKind(msg.body || msg.excerpt || '');
  }
  if (h['auto-submitted'] && h['auto-submitted'] !== 'no') return AUTO_REPLY_SUBJECT.test(msg.subject || '') ? 'auto_reply' : 'automated';
  if (AUTO_REPLY_SUBJECT.test(msg.subject || '') || h['x-autoreply'] || h['x-autorespond']) return 'auto_reply';
  if (h['list-id'] || h['list-unsubscribe'] || /^(bulk|list|junk)$/i.test(h['precedence'] || '')) return 'automated';
  if (AUTOMATED_SENDERS.some((re) => re.test(from))) return 'automated';
  const text = msg.excerpt || '';
  if (OPT_OUT.some((re) => re.test(text)) && text.length < 600) return 'opt_out';
  return 'human';
}

/** 'bounce_hard' for a permanent failure (5.x.x, user unknown), 'bounce_soft'
 *  for a deferral (4.x.x, mailbox full, try again). Unclear reports count as
 *  soft: a wrong 'soft' costs one more check, a wrong 'hard' loses a contact. */
export function bounceKind(text) {
  const t = String(text);
  if (/\b4\.\d{1,3}\.\d{1,3}\b|temporar|deferred|will retry|try again later|mailbox (is )?full|over quota|retrasad|temporalmente/i.test(t)) return 'bounce_soft';
  if (/\b5\.\d{1,3}\.\d{1,3}\b|user unknown|no such user|does not exist|address (couldn'?t|could not) be found|recipient (address )?rejected|permanent(ly)? fail|no existe|introuvable/i.test(t)) return 'bounce_hard';
  return 'bounce_soft';
}

/** The failed recipient named in a delivery report, if it names one. */
export function bouncedAddress(text) {
  const t = String(text);
  const m = t.match(/(?:Final-Recipient|Original-Recipient):\s*rfc822;\s*<?([^\s<>;]+@[^\s<>;]+)>?/i)
    || t.match(/(?:to|a|delivered to|entregar a)\s+<?([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})>?/i)
    || t.match(/<([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})>/);
  return m ? m[1] : '';
}

/* ---- categories ---------------------------------------------------------- */

export const CATEGORIES = [
  'enrollment_login', 'exam_certificate', 'technical_issue', 'coordinator_offline',
  'faculty_content', 'partnership_accreditation', 'outreach_reply', 'general',
  'security_privacy', 'personal_financial', 'marketing',
];

/* Keyword rules, EN/ES/FR/PT. Order matters: the first strong match wins,
   and the sensitive categories are checked first so that a login question
   that also mentions a lawyer is treated as the lawyer. */
const RULES = [
  ['security_privacy', /\b(hack(ed)?|phishing|stolen|compromis|someone (else )?(logged|used) my|delete my (data|account|information)|privacy|gdpr|borrar mis datos|eliminar mi cuenta|privacidad|suplantaci|supprimer mes donn|vie priv)/i],
  ['personal_financial', /\b(lawyer|attorney|lawsuit|legal action|sue\b|abogad|demanda|avocat|donat|donaci|offering|ofrenda|money|dinero|argent|dinheiro|pay(ment)?|pago|paiement|pagamento|bank|banco|banque|western union|transfer (the )?funds|support (for|of) (my|our) (family|ministry)|ayuda econ[óo]mica|financial (help|support)|sponsor(ship)?|patrocin)/i],
  ['technical_issue', /\b(problem (submitting|sending|with (the|my) (exam|test|lesson|page|quiz))|unable to (submit|open|load|log ?in)|can'?t (open|load)|no puedo (enviar|abrir|entrar)|error|bug|broken|not working|doesn'?t work|won'?t (load|open|submit)|cannot submit|can'?t submit|no funciona|no carga|no (me )?deja|falla|fall[óo]|ne fonctionne pas|bloqu|n[ãa]o funciona|verification (error|failed)|error de verificaci|page (is )?blank|stuck)\b/i],
  ['partnership_accreditation', /\b(accredit|acredit|accr[ée]dit|partnership|alianza|convenio|partenariat|parceria|memorandum|MOU\b|articulation|credit transfer|transfer(ir)? (de )?cr[ée]ditos?|recognition|reconocimiento|reconnaissance|affiliat|afiliaci)/i],
  ['faculty_content', /\b(syllabus|s[íi]labo|lecture notes|apuntes|notes de cours|teach(ing)? (a |the )?(course|class)|ense[ñn]ar (un |el )?curso|contribut|colabor|course material|material(es)? (del|de) curso|professor|profesor|professeur)/i],
  ['coordinator_offline', /\b(coordinator|coordinador|coordonnateur|study group|grupo de estudio|groupe d'?[ée]tude|offline|sin internet|sans internet|electricity|electricidad|[ée]lectricit[ée]|paper exam|examen en papel|print(ed)? (materials|lessons))/i],
  ['exam_certificate', /\b(certificate|certificado|certificat|diploma|degree|t[íi]tulo|dipl[ôo]me|exam|examen|test|prueba|grade|calificaci|transcript|constancia|relev[ée] de notes|honors|honores)/i],
  ['enrollment_login', /\b(register|registrar|inscri|enrol|sign ?up|log ?in|iniciar sesi[óo]n|connexion|student code|c[óo]digo de estudiante|code [ée]tudiant|forgot|olvid[ée]|oubli[ée]|access|acceso|acc[èe]s|verify (my )?email|verificar (mi )?correo)/i],
  ['marketing', /\b(seo|backlinks?|web design|dise[ñn]o web|promote your|grow your (business|audience)|limited time offer|webinar|free trial|special offer)/i],
];

/* Text that tries to talk to the system rather than to the seminary. It is
   kept as evidence, marked, and the case goes to a person. */
const INJECTION = [
  /\b(ignore|disregard|forget) (all |any |the )?(previous|prior|above|earlier) (instructions|rules|messages)/i,
  /\b(you are|act as|pretend to be) (an? )?(ai|assistant|chatgpt|claude|system|administrator)/i,
  /\bsystem prompt\b/i, /\b(reveal|send|give|share) (me )?(the )?(answer key|answers|exam answers|respuestas del examen|password|api key|token)/i,
  /\b(reset|change) (the )?(password|email) (for|of|on) (the )?(account|student)/i,
  /\bauthori[sz]ed by (dr\.? )?(wayne )?cook\b/i, /\bas (the )?(admin|administrator|owner)\b/i,
  /<\s*(script|iframe)\b/i,
];

/* Proposals the console may never answer on the seminary's behalf. */
const COMMITMENT = /\b(grant|award|recogni[sz]e|transfer|accept) (my |our |the )?(credits?|degree|diploma|certificate|hours)|\b(sign|approve|agree to) (the |an? |our )?(agreement|contract|mou|memorandum|partnership|convenio)|\bwould you (be willing to )?(pay|fund|send|sponsor)|\bconvalid/i;

export function classify(text, subject = '') {
  const t = `${subject}\n${text}`;
  for (const [cat, re] of RULES) if (re.test(t)) return { category: cat, by: 'rules' };
  return { category: 'general', by: 'default' };
}

export function flagsFor(text, subject = '') {
  const t = `${subject}\n${text}`;
  const f = [];
  if (INJECTION.some((re) => re.test(t))) f.push('injection');
  if (COMMITMENT.test(t)) f.push('commitment');
  // the mail-app completion report students send from the site: routine record-keeping
  if (/\bCTS (Course|Certificate) Completion\b|\bCTS completion:/i.test(subject)) f.push('completion_report');
  if (/\b(urgent|urgente|asap|lo antes posible|deadline|fecha l[íi]mite|today|hoy)\b/i.test(t)) f.push('urgent_words');
  return f;
}

/* ---- policy -------------------------------------------------------------- */

/* For every category: which track it belongs to, its default priority,
   whether a person must decide, and whether an approved template may ever be
   drafted for it (M2) or sent (M3, only on the owner's allowlist). This table
   is the policy matrix of the architecture document. */
export const POLICY = {
  // track, default priority, review: a person must approve any reply,
  // owner: Dr. Cook decides, draftable: an approved template may be drafted (M2)
  enrollment_login:          { track: 'student_support', priority: 'high',   review: false, owner: false, draftable: true  },
  exam_certificate:          { track: 'student_support', priority: 'normal', review: false, owner: false, draftable: true  },
  technical_issue:           { track: 'student_support', priority: 'high',   review: true,  owner: false, draftable: false, escalate: true },
  coordinator_offline:       { track: 'student_support', priority: 'normal', review: true,  owner: false, draftable: false },
  general:                   { track: 'student_support', priority: 'normal', review: false, owner: false, draftable: true  },
  faculty_content:           { track: 'relations',       priority: 'normal', review: true,  owner: true,  draftable: false },
  partnership_accreditation: { track: 'relations',       priority: 'high',   review: true,  owner: true,  draftable: false },
  outreach_reply:            { track: 'relations',       priority: 'normal', review: false, owner: false, draftable: true  },
  security_privacy:          { track: 'student_support', priority: 'urgent', review: true,  owner: true,  draftable: false },
  personal_financial:        { track: 'relations',       priority: 'high',   review: true,  owner: true,  draftable: false },
  marketing:                 { track: 'automated',       priority: 'low',    review: false, owner: false, draftable: false },
};

/** The decision for one human-lane message: category policy, tightened (never
 *  loosened) by flags. needs_owner: Dr. Cook must decide. review: an
 *  authorized reviewer must approve any reply. */
export function decide(category, flags, { isRelationsContact = false } = {}) {
  const p = POLICY[category] || POLICY.general;
  let owner = p.owner, review = p.review, reason = p.owner ? category.replace(/_/g, ' ') : '';
  let priority = p.priority;
  if (flags.includes('injection')) { owner = true; review = true; reason = 'suspicious instructions in message'; priority = 'urgent'; }
  else if (flags.includes('commitment')) { owner = true; review = true; reason = 'asks CTS to commit (credit, agreement or money)'; if (priority === 'normal') priority = 'high'; }
  if (flags.includes('urgent_words') && priority === 'normal') priority = 'high';
  if (flags.includes('completion_report') && !owner && !p.escalate) priority = 'low';
  const track = category === 'general' && isRelationsContact ? 'relations' : p.track;
  return { needs_owner: owner ? 1 : 0, review, reason, priority, escalate: !!p.escalate, track };
}

/* Lanes that never create work for anyone. */
export const QUIET_LANES = new Set(['automated', 'auto_reply']);
