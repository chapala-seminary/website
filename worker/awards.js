/* What a certificate requires, checked against the record the seminary holds.
 *
 * Grading happens in the browser, so the server cannot prove the work was
 * done. What it can do is refuse an award the record does not support: a
 * course certificate with units missing, a degree with courses missing. Before
 * this, a course certificate needed only SOME progress in the course and the
 * degree levels needed nothing at all -- which Wayne's review of the beta
 * pointed out, and which was not defensible for a seminary seeking
 * recognition.
 *
 * The rules mirror the certificate pages exactly (CTSCertificateOfMinistry,
 * CTSAssociateCertificate, CTSThMCertificate, CTSMDivCertificate), which are
 * what the student sees. If those change, this must change with them --
 * test/api.test.mjs pins the numbers.
 *
 * A completion carries the track it was earned on (migrations/0003_tracker),
 * because a degree counts only the courses finished at its own level: the
 * Certificate of Ministry and the Associate count every course, the master's
 * degrees only those finished on a master's track. A completion whose track
 * is unknown (recorded before 0003, or from a browser with no master's list)
 * counts as the student's current track, which is the best anyone can do.
 */
import catalog from './catalog.json';

export const FOUNDATION = ['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK'];

export const MDIV_CORE = [
  ...FOUNDATION,
  'CTSHERMENEUTICS', 'CTSLA', 'CTSGENESIS', 'CTSPSALMS', 'CTSMATT', 'CTSROMANS', 'CTSACTS',
  'CTSAPOL', 'COUNSELING', 'CTSAL', 'CTSWORSHIP', 'CTSCE', 'CTSMISSIONS',
];

/* A course counts toward a degree only at the level it was completed on
   (Dr. Cook, 29 Sept 2026): cert < assoc < thm = mdiv. The same table is in
   public/assets/js/cts-degrees.js, for the diploma pages;
   tools/verify-degrees.mjs holds them equal. */
export const DEGREES = {
  certificate: { courses: 12, core: FOUNDATION, levels: ['cert', 'assoc', 'thm', 'mdiv'] },   // Certificate of Ministry
  associate:   { courses: 25, core: FOUNDATION, levels: ['assoc', 'thm', 'mdiv'] },           // Associate of Divinity
  thm:         { courses: 12, core: FOUNDATION, levels: ['thm', 'mdiv'] },                    // Master of Theology
  mdiv:        { courses: 30, core: MDIV_CORE,  levels: ['thm', 'mdiv'] },                    // Master of Divinity
};

/** The level a student's work is done at now: their track, with the
 *  Associate goal (a Certificate-track student aiming at the Associate)
 *  counted as 'assoc'. Used for a completion recorded without a level. */
export function studentLevel(track, goal) {
  const t = String(track || '').toLowerCase();
  if (t === 'mdiv' || t === 'thm') return t;
  if (t === 'mth') return 'thm';
  if (t === 'assoc' || t === 'associate' || t === 'ad' || String(goal || '').toLowerCase() === 'assoc') return 'assoc';
  return 'cert';
}

/** The units a course certificate needs, or null for a course with no units
 *  (unknown, or a single-page course). Accepts the slug or the code. */
export function courseUnits(slugOrCode) {
  const r = resolveCourse(slugOrCode);
  return r && r.units ? r.units : null;
}

/** What a course certificate is checked against:
 *    { slug, code, units }  a unit course -- every unit must be recorded
 *    { code }               a single-page course (Counseling, WiseSpeak,
 *                           Narrative Preaching, Ethics) -- its completion
 *                           code must be recorded, since it keeps no units
 *    null                   not a course the seminary offers
 *  Either name is accepted: unit progress is keyed by slug ("ots"), the
 *  certificate pages and degrees by code ("CTSOTS"). */
export function resolveCourse(slugOrCode) {
  const raw = String(slugOrCode || '').trim();
  const bySlug = catalog.courses[raw.toLowerCase()];
  if (bySlug) return { slug: raw.toLowerCase(), code: bySlug.code, units: bySlug.units };
  const code = raw.toUpperCase();
  for (const [slug, c] of Object.entries(catalog.courses))
    if (c.code === code) return { slug, code, units: c.units };
  return catalog.completions[code] ? { code } : null;
}

/** null when the record supports the award, else a short reason.
 *  `level` is the student's level (studentLevel) and `textbooks` the slugs of
 *  the textbook tests the record holds: on the master's tracks a course with
 *  a textbook is not complete until its test is passed (Dr. Cook, 4 Oct 2026). */
export function courseShortfall(slug, unitsDone, level, textbooks) {
  const need = courseUnits(slug);
  if (!need) return resolveCourse(slug) ? 'no units: check the completion code' : 'unknown course';
  const have = new Set(unitsDone.map(Number));
  const missing = need.filter((u) => !have.has(u));
  if (missing.length) return `units not recorded as passed: ${missing.join(', ')}`;
  return textbookShortfall(resolveCourse(slug).code, level, textbooks);
}

/** The textbook a course requires on the master's tracks, by completion code
 *  (worker/catalog.json), or null. */
export function textbookFor(code) {
  const up = String(code || '').toUpperCase();
  for (const [slug, t] of Object.entries(catalog.textbooks || {})) if (t.code === up) return slug;
  return null;
}

/** null unless the level is a master's one, the course has a textbook, and
 *  the record does not hold a pass on its test. */
export function textbookShortfall(code, level, textbooks) {
  if (level !== 'thm' && level !== 'mdiv') return null;
  const slug = textbookFor(code);
  if (!slug) return null;
  const have = new Set((textbooks || []).map((t) => String(typeof t === 'string' ? t : t.textbook).toLowerCase()));
  return have.has(slug) ? null : `textbook test not recorded as passed: ${slug}`;
}

/** completions: [{code, track}] (a bare code string is taken as track
 *  unknown); track: the student's level now (studentLevel), used where a
 *  completion's own level is unknown. null when the record supports the award. */
export function degreeShortfall(level, completions, track) {
  const d = DEGREES[level];
  if (!d) return 'unknown award';
  const own = studentLevel(track);
  const have = new Set();
  for (const c of completions) {
    const code = String(typeof c === 'string' ? c : c.code).toUpperCase();
    const earned = studentLevel((typeof c === 'string' ? null : c.track) || own);
    if (d.levels.includes(earned)) have.add(code);
  }
  const level_ = level === 'thm' || level === 'mdiv' ? "master's-level " : level === 'associate' ? 'Associate-level ' : '';
  const problems = [];
  if (have.size < d.courses) problems.push(`${have.size} of ${d.courses} ${level_}courses recorded`);
  const core = d.core.filter((c) => !have.has(c));
  if (core.length) problems.push(`required ${level_}courses not recorded: ${core.join(', ')}`);
  return problems.length ? problems.join('; ') : null;
}
