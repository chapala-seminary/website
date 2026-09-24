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
 * Known limit: course_completions records that a course was finished, not on
 * which track. The master's degrees therefore also require the student to be
 * on a master's track now. A student who finished courses on the certificate
 * track and then switched would pass this check; the pages have the same gap
 * (they keep a separate cts_mdiv_done_codes the sync does not yet carry).
 */
import catalog from './catalog.json';

export const FOUNDATION = ['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK'];

export const MDIV_CORE = [
  ...FOUNDATION,
  'CTSHERMENEUTICS', 'CTSLA', 'CTSGENESIS', 'CTSPSALMS', 'CTSMATT', 'CTSROMANS', 'CTSACTS',
  'CTSAPOL', 'COUNSELING', 'CTSAL', 'CTSWORSHIP', 'CTSCE', 'CTSMISSIONS',
];

export const DEGREES = {
  certificate: { courses: 12, core: FOUNDATION, masters: false },   // Certificate of Ministry
  associate:   { courses: 25, core: FOUNDATION, masters: false },   // Associate of Divinity
  thm:         { courses: 12, core: FOUNDATION, masters: true },    // Master of Theology
  mdiv:        { courses: 30, core: MDIV_CORE,  masters: true },    // Master of Divinity
};

const MASTERS = new Set(['thm', 'mdiv']);

/** The units a course certificate needs, or null for a course the Worker
 *  does not know (single-page courses record a completion code, not units). */
export function courseUnits(slug) {
  const c = catalog.courses[String(slug || '').toLowerCase()];
  return c ? c.units : null;
}

/** null when the record supports the award, else a short reason. */
export function courseShortfall(slug, unitsDone) {
  const need = courseUnits(slug);
  if (!need) return 'unknown course';
  const have = new Set(unitsDone.map(Number));
  const missing = need.filter((u) => !have.has(u));
  return missing.length ? `units not recorded as passed: ${missing.join(', ')}` : null;
}

export function degreeShortfall(level, doneCodes, track) {
  const d = DEGREES[level];
  if (!d) return 'unknown award';
  const have = new Set(doneCodes.map((c) => String(c).toUpperCase()));
  const problems = [];
  if (have.size < d.courses) problems.push(`${have.size} of ${d.courses} courses recorded`);
  const core = d.core.filter((c) => !have.has(c));
  if (core.length) problems.push(`required courses not recorded: ${core.join(', ')}`);
  if (d.masters && !MASTERS.has(String(track || '').toLowerCase())) problems.push('student is not on a master\'s track');
  return problems.length ? problems.join('; ') : null;
}
