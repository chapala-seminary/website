/* Re-assessment at a higher level (issue #351, 23 Nov 2026).
 *
 * A unit's "passed" mark in the browser (cts_<course>_progress, or a
 * single-page course's state map) says nothing about the level it was passed
 * at. The unit pages took any passed mark as final and never asked the
 * server for an attempt, so a student who finished a course on the
 * Certificate track and then moved to the M.Div. or Th.M. could not sit the
 * master's assessment the server requires before it raises the completion
 * (worker/grading/attempts.js earnedLevel). The course stayed a Certificate
 * completion and the degree pages, rightly, did not count it.
 *
 * This decides one thing: does the pass already in the browser cover the
 * student's current level? When it does not, the page opens the exam for a
 * fresh attempt at the current level. Nothing is deleted: the earlier pass,
 * the Certificate completion and its certificate all stay; the server keeps
 * every attempt and raises the level only on new live passes.
 *
 * Where the level of a pass comes from, best first:
 *   1. the level stored when the pass was made (new key, written by the pages
 *      from now on: cts_<course>_u<N>_level, or `level` in a state map entry);
 *   2. otherwise, the level the whole course is recorded at in the degree
 *      lists (cts_done_codes / cts_assoc_done_codes / cts_thm_done_codes /
 *      cts_mdiv_done_codes) -- the upgrade case this exists for;
 *   3. otherwise unknown, and the pass is honoured as before. A student part
 *      way through a course is never sent back over units already passed.
 */
(function (root) {
  "use strict";

  var RANK = { cert: 0, assoc: 1, thm: 2 };

  function norm(level) {
    var t = String(level == null ? "" : level).toLowerCase();
    if (t === "mdiv" || t === "thm" || t === "mth" || t === "mtheol" || /master/.test(t)) return "thm";
    if (t === "assoc" || t === "associate" || t === "ad") return "assoc";
    if (t === "cert" || t === "certificate") return "cert";
    return null;
  }

  // the level a student studies at now: track, then the Associate goal
  function currentLevel(track, goal) {
    var t = norm(track);
    if (t === "thm") return "thm";
    if (t === "assoc" || norm(goal) === "assoc") return "assoc";
    return "cert";
  }

  // lists: { done, assoc, thm, mdiv } arrays of codes as stored
  function courseLevel(code, lists) {
    var want = String(code || "").toUpperCase();
    if (!want || !lists) return null;
    function clean(raw) { return String(raw || "").trim().toUpperCase().replace(/\.HTML$/, ""); }
    function has(arr) {
      return (arr || []).some(function (raw) { var up = clean(raw); return up === want || up === want + "CERTIFICATE"; });
    }
    // old certificate pages stored e.g. CTSSTTHMCERTIFICATE, which names the level itself
    function namedMasters(arr) {
      return (arr || []).some(function (raw) {
        var up = clean(raw);
        return /(MDIV|THM|MTH)CERTIFICATE$/.test(up) && up.replace(/(MDIV|THM|MTH)CERTIFICATE$/, "") === want;
      });
    }
    if (has(lists.thm) || has(lists.mdiv)) return "thm";
    if (namedMasters(lists.done) || namedMasters(lists.assoc) || namedMasters(lists.thm) || namedMasters(lists.mdiv)) return "thm";
    if (has(lists.assoc)) return "assoc";
    if (has(lists.done)) return "cert";
    return null;
  }

  /* o: { stored, code, lists, track, goal }
     -> true when the pass in the browser is enough at the current level */
  function covers(o) {
    o = o || {};
    var now = currentLevel(o.track, o.goal);
    var at = norm(o.stored) || courseLevel(o.code, o.lists);
    if (!at) return true;                       // unknown: honoured, as before
    return RANK[at] >= RANK[now];
  }

  var api = { covers: covers, currentLevel: currentLevel, courseLevel: courseLevel, norm: norm };
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.CTSLevelGate = api;
})(typeof window !== "undefined" ? window : null);
