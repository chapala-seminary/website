/* The name of an award in the student's language.
 *
 * The record keeps the English title the certificate page sent ("New
 * Testament Survey — Certificate of Ministry"); that stays the title of
 * record, for staff and for the tracker. A French student's email and the
 * French /verify page show the same award in French, built from the level,
 * the course and the program named in that title, so a French sentence never
 * carries an English course or program name (French review, 13 Oct 2026, M1).
 * Spanish and English keep the stored title, as before.
 */
import catalog from './catalog.json';

export const PROGRAM_NAMES = {
  certificate: { en: 'Certificate of Ministry', es: 'Certificado de Ministerio', fr: 'Certificat de ministère' },
  associate: { en: 'Associate of Divinity', es: 'Asociado en Divinidad', fr: 'Diplôme associé en théologie' },
  thm: { en: 'Master of Theology (Th.M.)', es: 'Maestría en Teología (Th.M.)', fr: 'Master en théologie (Th.M.)' },
  mdiv: { en: 'Master of Divinity (M.Div.)', es: 'Maestría en Divinidad (M.Div.)', fr: 'Master en théologie pastorale (M.Div.)' },
};

/* The title of record, built on the server from the award and the student's
 * record (ChatGPT's final audit, item B, 18 Oct 2026): browser-supplied
 * wording never reaches a certificate. Same form the pages have always sent
 * (cts-certify.js title/trackLabel), so existing titles and the French and
 * /verify rendering (programIn) are unchanged:
 *   degree  -> "Master of Theology"
 *   course  -> "1 Peter Intensive — Master of Theology" (the student's program)
 * null when the course is unknown. */
const PROGRAM_TITLE = { cert: 'Certificate of Ministry', assoc: 'Associate of Divinity', thm: 'Master of Theology', mdiv: 'Master of Divinity' };
const DEGREE_TITLE = { certificate: 'Certificate of Ministry', associate: 'Associate of Divinity', thm: 'Master of Theology', mdiv: 'Master of Divinity' };
export function officialTitle(level, course, program) {
  if (level !== 'course') return DEGREE_TITLE[level] || null;
  const name = courseTitle(course, 'en');
  return name ? `${name} — ${PROGRAM_TITLE[program] || PROGRAM_TITLE.cert}` : null;
}

/* A course by unit slug ("nt") or completion code ("CTSNT", "WISESPEAK"). */
export function courseTitle(course, lang) {
  const key = String(course || '');
  const unit = catalog.courses[key.toLowerCase()];
  const t = (unit && unit.title) || catalog.completions[key.toUpperCase()]?.title;
  return t ? t[lang] || t.en : null;
}

/* The program a course certificate was earned on, as the page wrote it at the
 * end of the English title (cts-certify.js trackLabel). */
function programIn(title) {
  const t = String(title || '');
  if (/master of divinity/i.test(t)) return 'mdiv';
  if (/master of theology/i.test(t)) return 'thm';
  if (/associate of divinity/i.test(t)) return 'associate';
  if (/certificate of ministry/i.test(t)) return 'certificate';
  return null;
}

/* { level, course, title } -> the award's name in `lang`; the stored title
 * when it cannot be named in that language. */
export function awardTitle(award, lang) {
  const { level, course, title } = award || {};
  if (lang !== 'fr') return title;
  if (level && level !== 'course') return PROGRAM_NAMES[level]?.fr || title;
  const name = courseTitle(course, 'fr');
  if (!name) return title;
  const program = programIn(title);
  return program ? `${name} — ${PROGRAM_NAMES[program].fr}` : name;
}
