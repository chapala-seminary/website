/* The CTS Correspondence Policy, versioned (issue #163, founder guardrail of
 * 23 Oct 2026, comment 6365570007).
 *
 * This file is the policy, not a prompt. Every statement an automatic reply
 * may make rests on a FACT below, and every fact carries its standing:
 *
 *   confirmed  -- Dr. Cook said it (date and where noted)
 *   published  -- it is what the live site already tells students (page noted)
 *   proposed   -- written for his approval; may NOT underwrite an automatic send
 *   unverified -- needs checking; may NOT underwrite an automatic send
 *
 * Changing a fact or a rule here changes POLICY_VERSION, which shows on every
 * automatic reply's record. Edits go through a pull request Dr. Cook approves;
 * nothing a correspondent writes, no older sent email and no model output can
 * change what is here.
 *
 * validateReply(text) runs on every automatic reply before it leaves, and is
 * exported for anyone drafting a reply by hand or by model: it blocks the
 * statements CTS must never make on its own (invented limits, accreditation,
 * credit, fees, waivers, promises about paper exams).
 */

export const POLICY_VERSION = '2026-10-23.1';

export const FACTS = {
  free: { status: 'confirmed', source: 'Dr. Cook; the site: "Study is free"', text: 'All CTS study is free: no tuition and no fees.' },
  open_enrollment: { status: 'confirmed', source: 'Dr. Cook, 23 Oct 2026 (#163 comment 6365570007, directive 1)',
    text: 'Anyone may register now. No pilot, cohort, quota, seat limit, waiting list, application or special permission. A group of any size may all register at once, each person individually.' },
  enrollment_separate: { status: 'confirmed', source: 'Dr. Cook, 23 Oct 2026 (directive 2)',
    text: 'Individual enrollment never waits for a partnership, affiliation or recognition agreement; those are discussed separately, by Dr. Cook.' },
  individual_records: { status: 'confirmed', source: 'Dr. Cook, 23 Oct 2026 (directive 3)', text: 'Each student has an individual record and takes the assessments personally.' },
  masters_exams: { status: 'confirmed', source: 'Dr. Cook, Oct 2026', text: "Master's students take the required textbook and reading tests where a course has them; email never waives them." },
  paper_exams_in_development: { status: 'confirmed', source: 'Dr. Cook, 23 Oct 2026 (directive 3)',
    text: 'Paper exams taken offline and photographed are being developed; they are not an operating process and no credit is promised for them yet.' },
  no_accreditation_claim: { status: 'confirmed', source: 'Dr. Cook, 23 Oct 2026 (directive 4); 21 Oct (no doctorate offered)',
    text: 'Never promise accreditation, degree recognition, affiliation, transcript acceptance or transfer credit.' },
  foundation_first: { status: 'published', source: 'CTSBeforeYouBegin.html',
    text: 'Every student begins with the seven foundation courses, in any order; when all seven are complete the whole catalog opens. How We Got the Bible and the Deacon Family Ministry Plan are always open.' },
  retakes: { status: 'published', source: 'CTSBeforeYouBegin.html',
    text: 'If the required score is not reached, review the lesson and try again; after a short wait an exam may be retaken as many times as needed.' },
  recognitions: { status: 'published', source: 'CTSBeforeYouBegin.html',
    text: "Minimums: Certificate of Ministry 12 courses; Th.M. 15; Associate of Divinity 25; M.Div. 30 (20-course core + 10 electives), all at the level each requires." },
  lost_code: { status: 'published', source: 'cts-backup.html; CTSPrivacy.html',
    text: 'A lost student code is recovered with "Email me my code" on the Save / Restore My Progress page: the code goes only to the email on the record.' },
  certificate_email: { status: 'published', source: 'CTSPrivacy.html', text: 'A confirmed email address is needed to claim a certificate; the certificate is sent to it.' },
  languages: { status: 'proposed', source: 'site language switch (English, Español, Français); Swahili and Portuguese not published',
    text: 'Courses are in English and Spanish, and in French; other languages are not available on the site yet.' },
  title_architect: { status: 'confirmed', source: 'Dr. Cook, 23 Oct 2026 (directive 5)', text: 'Dr. Cook signs as "Architect, Chapala Theological Seminary"; never co-director.' },
};

/** A fact may underwrite an automatic send only when Dr. Cook confirmed it or
 *  the live site already says it. */
export const sendable = (factId) => ['confirmed', 'published'].includes(FACTS[factId]?.status);

/* ---- what an outgoing reply must never say on CTS's behalf ------------- */

const RULES = [
  ['invented_limit', /\b(small|pilot|trial|test)\s+(group|cohort|batch|class)\b|\bstart(ing)?\s+(small|with\s+(a\s+few|only|just|a\s+small))|\b(limited|few)\s+(seats|places|spaces|spots|slots)\b|\bonly\s+\d+\s+(students|pastors|ministers|people|leaders)\b|\bquota\b|\bwaiting\s+list\b|\bone\s+(group|cohort)\s+at\s+a\s+time\b/i],
  ['invented_limit', /\bgrupo\s+(piloto|peque[ñn]o\s+(primero|inicial))\b|\bempezar\s+con\s+(pocos|unos\s+pocos|un\s+grupo\s+peque[ñn]o)|\bcupos?\s+(limitados?|disponibles)\b|\bplazas\s+limitadas\b|\blista\s+de\s+espera\b/i],
  ['invented_limit', /\bgroupe\s+(pilote|restreint)\b|\bcommencer\s+(petit|avec\s+quelques)|\bplaces\s+limit[ée]es\b|\bliste\s+d'?attente\b/i],
  ['waits_for_partnership', /\b(wait|waiting)\s+(for|until)\s+(the\s+|our\s+|a\s+)?(partnership|agreement|approval|affiliation|memorandum|mou)\b|\b(after|once)\s+(the\s+|our\s+)?(partnership|agreement|affiliation)\s+is\s+(signed|approved|in\s+place)|\besperar\s+(a\s+)?(que\s+se\s+firme|el\s+convenio|la\s+alianza|la\s+aprobaci[óo]n)|\battendre\s+(l'accord|le\s+partenariat|l'approbation)/i],
  ['accreditation', /\b(is|are|we\s+are|es|somos|est|sommes)\s+(fully\s+|plenamente\s+)?(accredited|acreditad[oa]s?|accr[ée]dit[ée]e?s?)\b|\b(recogni[sz]ed|reconocid[oa]|reconnu)\s+(degree|t[íi]tulo|dipl[ôo]me)\b|\b(degree|t[íi]tulo|dipl[ôo]me)s?\s+(is|are|es|son|est)\s+(recogni[sz]ed|reconocid[oa]s?|reconnus?)\b/i],
  ['credit_promise', /\b(credits?|cr[ée]ditos?|hours|horas)\s+(will|can)\s+(be\s+)?(transfer|accepted|recogni[sz]ed)|\b(will|can)\s+(transfer|accept|recogni[sz]e)\s+(your\s+)?(credits?|courses?|degree)|\bconvalid(ar|aci[óo]n|ados?)\b|\btransfer\s+credit\b|\bcr[ée]ditos?\s+(se\s+)?(transfieren|aceptan|reconocen)/i],
  ['fee', /\$\s?\d|\b\d+\s?(usd|dollars|d[óo]lares|pesos|mxn|euros?)\b|\b(fee|tuition|cuota|colegiatura|matr[íi]cula|frais\s+de\s+scolarit[ée]|frais\s+d'inscription)\s+(of|de|is|es|est)\b/i],
  ['waiver', /\b(waive[ds]?|exempt(ed)?|skip|no\s+need\s+to\s+take)\s+(the\s+|your\s+)?(exam|test|reading|textbook|requirement)s?\b|\b(exento|dispensa(do)?|no\s+necesita\s+(hacer|tomar|presentar))\b|\b(dispens[ée]|exempt[ée])\b/i],
  ['paper_exam_promise', /\b(paper|printed|photograph(ed)?|photo|foto(graf)?|papel|papier|impreso)\b[^.!?]{0,80}\b(exams?|tests?|ex[áa]men(es)?)\b[^.!?]{0,80}\b(graded|will\s+be\s+(graded|marked|credited)|count\s+for\s+credit|calificad|cuentan?\s+para|not[ée]s?|valid[ée]s?)\b/i],
  ['wrong_title', /\bco-?director\b|\bcodirector\b/i],
];

const ALLOWED_LINK_HOSTS = new Set(['chapalaseminary.org', 'www.chapalaseminary.org']);
const ALLOWED_ADDRESSES = new Set(['chapalatheological@gmail.com']);
export const MAX_REPLY_CHARS = 3000;

/** Problems with an outgoing reply; [] means it may go. Paper exams may be
 *  mentioned only as being developed. */
export function validateReply(text) {
  const t = String(text || '');
  const problems = [];
  for (const [rule, re] of RULES) {
    if (rule === 'paper_exam_promise' && /\b(being developed|in development|en desarrollo|se est[áa]n? desarrollando|en cours de d[ée]veloppement)\b/i.test(t)) continue;
    const m = t.match(re);
    if (m && !problems.some((p) => p.rule === rule)) problems.push({ rule, text: m[0] });
  }
  for (const m of t.matchAll(/https?:\/\/([^/\s)>\]]+)[^\s)>\]]*/gi)) {
    const host = m[1].toLowerCase();
    if (!ALLOWED_LINK_HOSTS.has(host)) problems.push({ rule: 'link_not_allowed', text: m[0] });
  }
  for (const m of t.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)) {
    if (!ALLOWED_ADDRESSES.has(m[0].toLowerCase())) problems.push({ rule: 'address_not_allowed', text: m[0] });
  }
  if (t.length > MAX_REPLY_CHARS) problems.push({ rule: 'too_long', text: String(t.length) });
  if (!t.trim()) problems.push({ rule: 'empty', text: '' });
  return problems;
}
