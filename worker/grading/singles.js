/* The single-page courses (docs/ai-grading.md, section 2): Counseling, Narrative
 * Preaching, WiseSpeak Preaching and Pastoral & Christian Ethics grade on
 * engines of their own, and each unit of them is its own scope, `sp:<page>`.
 *
 * A pass on a unit is recorded in unit_progress under `course`; the course is
 * complete when every unit in `units` is, and on the master's tracks when the
 * course's required tests are too (worker/awards.js testsFor). These are the
 * same names the browser's sync uses for these courses' units
 * (public/assets/js/cts-sync.js LEGACY: cts_ethics_progress, cts_drakeford_state,
 * cts_storytel_state, cts_wisespeak_state), so progress made before the switch
 * counts after it.
 *
 * tools/single-pages-lib.mjs builds its course table from this one, and the
 * `sp:<page>/meta/0` rows it writes repeat it for the server to read.
 *
 * `lockMinutes`: Narrative and WiseSpeak Preaching lock a failed unit for 15
 * minutes on every track (their LOCKOUT_MINUTES); Counseling and Ethics lock
 * 15 on the master's tracks and 2 elsewhere, the site's rule.
 */
export const SINGLES = {
  COUNSELING: { course: 'counseling', units: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  STORYTEL: { course: 'storytel', units: [1, 2, 3, 4, 5, 6, 7, 8], lockMinutes: 15 },
  WISESPEAK: { course: 'wisespeak', units: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], lockMinutes: 15 },
  ETHICS: { course: 'ethics', units: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
};
