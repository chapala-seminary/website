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

/* The old site named a completion after its certificate file
   (cts-completion.js: CTSCounselingCertificate.html -> CTSCOUNSELING), and a
   returning student's browser still holds those names. Four of them differ
   from today's codes. The degree pages' own files made codes that are not
   courses at all ("CTS" from CTSThMCertificate.html, "CTSASSOCIATE"); counted,
   they inflated a student's courses (Dr. Cook, 5 Oct 2026). */
export const CODE_ALIASES = {
  CTSCOUNSELING: 'COUNSELING', CTSNARRATIVEPREACHING: 'STORYTEL',
  CTSPREACHING: 'WISESPEAK', ETHICS_: 'ETHICS',
};

/** Today's completion code for a code a browser reports, or null when it is
 *  not a course the seminary offers. Accepts a code, an old certificate-file
 *  code, or a course slug. */
export function canonicalCode(raw) {
  /* The commonest old form keeps the whole certificate file name: production
     held CTSOTSTHMCERTIFICATE, CTSBIBLECERTIFICATE, ETHICS_CERTIFICATE beside
     CTSOTS and CTSBIBLE (5 Oct 2026). certificateLevel() reads the level it
     names. */
  const up = String(raw || '').trim().toUpperCase().replace(/\.HTML$/, '').replace(/(MDIV|THM|MTH)?CERTIFICATE$/, '');
  if (!up) return null;
  if (catalog.completions[up]) return up;
  if (CODE_ALIASES[up]) return CODE_ALIASES[up];
  const c = catalog.courses[up.toLowerCase()] || catalog.courses[up.replace(/^CTS/, '').toLowerCase()];
  return c ? c.code : null;
}

/** The level an old certificate-file code names ('mdiv' for
 *  CTSPSALMSMDIVCERTIFICATE, 'thm' for ...THMCERTIFICATE), or null. */
export function certificateLevel(raw) {
  const m = /(MDIV|THM|MTH)CERTIFICATE(\.HTML)?$/.exec(String(raw || '').trim().toUpperCase());
  return m ? (m[1].toLowerCase() === 'mdiv' ? 'mdiv' : 'thm') : null;
}

/** null when the record supports the award, else a short reason.
 *  `level` is the student's level (studentLevel) and `textbooks` the slugs of
 *  the tests the record holds: on the master's tracks a course with a
 *  required test is not complete until it is passed (Dr. Cook, 4 Oct 2026),
 *  and a course with two -- a textbook and its five readings (9 Oct 2026) --
 *  until both are. `ctx` is what testShortfall needs for a test with an
 *  activation date: { completions, now }. */
export function courseShortfall(slug, unitsDone, level, textbooks, ctx) {
  const need = courseUnits(slug);
  if (!need) return resolveCourse(slug) ? 'no units: check the completion code' : 'unknown course';
  const have = new Set(unitsDone.map(Number));
  const missing = need.filter((u) => !have.has(u));
  if (missing.length) return `units not recorded as passed: ${missing.join(', ')}`;
  return textbookShortfall(resolveCourse(slug).code, level, textbooks, ctx);
}

/** Every test a course requires on the master's tracks, by completion code
 *  (worker/catalog.json `textbooks`): its textbook's, its required readings',
 *  or both, in that order. Empty when it has none. */
export function testsFor(code) {
  const up = String(code || '').toUpperCase();
  const out = [];
  for (const [slug, t] of Object.entries(catalog.textbooks || {})) if (t.code === up) out.push(slug);
  return out.sort((a, b) => (catalog.textbooks[a].kind === 'textbook' ? 0 : 1) - (catalog.textbooks[b].kind === 'textbook' ? 0 : 1));
}
/** The first of them, or null: what "the course's textbook" meant before a
 *  course could have two. */
export function textbookFor(code) { return testsFor(code)[0] ?? null; }

/** Whether a test counts toward a master's completion of `code`, judged by
 *  the seminary's own record (Dr. Cook and ChatGPT's authorization, 9 Oct
 *  2026). A test with no `requiredFrom` -- every textbook, and Genesis and
 *  World Religions -- always counts, as it has since 4 Oct. One whose
 *  `requiredFrom` is null has not been activated and counts for no one. Once
 *  activated it counts, except for a completion of the course the record
 *  already held AT A MASTER'S LEVEL before that moment, with the time the
 *  server itself wrote (course_completions.completed_at): that completion
 *  stays valid without it.
 *    - finished before, reported after: the server's time is after, so the
 *      test counts (Robert may correct a documented exception by hand);
 *    - a Certificate or Associate completion from before, by a student who
 *      has since moved to the M.Div. or Th.M.: its level in the record is
 *      not a master's one, so the test counts;
 *    - started before, not finished: no completion, so the test counts.
 *  ctx.completions: [{ code, track, completed_at }] from the record;
 *  ctx.now: an ISO time, the server's own clock unless a test passes one. */
export function testCounts(slug, code, ctx = {}) {
  const t = (catalog.textbooks || {})[slug];
  if (!t) return false;
  /* ctx.requiredFrom: { slug: time } stands in for the catalog's date. Only
     the test suite passes one (worker/api.js testRequiredFrom); a deployed
     Worker always goes by the catalog. */
  const raw = ctx.requiredFrom && Object.prototype.hasOwnProperty.call(ctx.requiredFrom, slug) ? ctx.requiredFrom[slug]
    : ('requiredFrom' in t ? t.requiredFrom : undefined);
  if (raw === undefined) return true;
  if (raw == null) return false;
  if (Number.isNaN(Date.parse(raw))) return true;      // an unreadable date never lets a test lapse
  const from = new Date(raw).toISOString();
  const now = ctx.now || new Date().toISOString();
  if (when(now) < when(from)) return false;
  return !exemptBefore(code, from, ctx.completions);
}
/** A master's-level completion of `code` the record held before `from`. */
export function exemptBefore(code, from, completions) {
  const up = canonicalCode(code) || String(code || '').toUpperCase();
  return (completions || []).some((c) => c && (canonicalCode(c.code) || String(c.code).toUpperCase()) === up
    && (c.track === 'thm' || c.track === 'mdiv')
    && typeof c.completed_at === 'string' && when(c.completed_at) < when(from));
}
/* Times compared as times: the record writes ISO strings, and SQLite's own
   'YYYY-MM-DD HH:MM:SS' is read as UTC. Unreadable is never "before". */
function when(s) {
  // (no quoted capital letters here: tools/gen-worker-catalog.mjs reads every
  // one in this file as a course code a degree requires)
  const sqlite = /^\d{4}-\d{2}-\d{2} \d/.test(s), zoned = /[zZ]|[+-]\d\d:?\d\d$/.test(s);
  const t = Date.parse(sqlite ? s.replace(' ', String.fromCharCode(84)) + (zoned ? '' : String.fromCharCode(90)) : s);
  return Number.isNaN(t) ? Infinity : t;
}
/** The tests of a course the record holds a master's completion from before
 *  their activation: the student record says so, and the browser shows it
 *  (cts-sync.js keeps it as cts_textbook_<slug>_exempt). */
export function exemptionsFor(completions, ctx = {}) {
  const out = [];
  for (const [slug, t] of Object.entries(catalog.textbooks || {})) {
    const raw = ctx.requiredFrom && Object.prototype.hasOwnProperty.call(ctx.requiredFrom, slug) ? ctx.requiredFrom[slug] : t.requiredFrom;
    if (raw && !Number.isNaN(Date.parse(raw)) && exemptBefore(t.code, new Date(raw).toISOString(), completions)) out.push(slug);
  }
  return out;
}

/** null unless the level is a master's one, the course has a required test
 *  that counts (testCounts), and the record does not hold a pass on it. */
export function textbookShortfall(code, level, textbooks, ctx) {
  if (level !== 'thm' && level !== 'mdiv') return null;
  const have = new Set((textbooks || []).map((t) => String(typeof t === 'string' ? t : t.textbook).toLowerCase()));
  for (const slug of testsFor(code)) {
    if (have.has(slug) || !testCounts(slug, code, ctx)) continue;
    return catalog.textbooks[slug].kind === 'reading'
      ? `required-reading test not recorded as passed: ${slug}`
      : `textbook test not recorded as passed: ${slug}`;
  }
  return null;
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
    const code = canonicalCode(typeof c === 'string' ? c : c.code);
    if (!code) continue;                       // not a course: counts toward nothing
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
