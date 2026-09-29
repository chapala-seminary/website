/* The seminary's degree rules, in the browser -- the same rules the Worker
 * applies when it issues a diploma (worker/awards.js). The four diploma pages
 * read their progress from here, so the page a student sees and the award the
 * server will sign cannot disagree. tools/verify-degrees.mjs holds the two
 * copies of the course lists equal and tests the boundaries.
 *
 * A course counts toward a degree only at the level it was completed on
 * (Dr. Cook's review, 29 Sept 2026: "Certificate completion must not be
 * automatically counted as Associate or master's completion"):
 *
 *   level    completed on                      counts toward
 *   cert     the Certificate track             Certificate of Ministry
 *   assoc    the Associate goal (MC + fill-ins) Certificate, Associate
 *   thm/mdiv a master's track (+ short answer) all four
 *
 * The browser keeps the level in lists beside cts_done_codes:
 * cts_assoc_done_codes (since 29 Sept), cts_thm_done_codes, cts_mdiv_done_codes.
 * Courses are counted by code, never by name: the names have varied ("Romans |",
 * "Preaching (WiseSpeak)"), the codes have not.
 */
(function () {
  "use strict";
  if (window.CTSDegrees) return;

  var FOUNDATION = ["CTSOTS", "CTSNT", "CTSST", "CTSEVANGELISM", "CTSPM", "CTSCH", "WISESPEAK"];
  var MDIV_CORE = FOUNDATION.concat([
    "CTSHERMENEUTICS", "CTSLA", "CTSGENESIS", "CTSPSALMS", "CTSMATT", "CTSROMANS", "CTSACTS",
    "CTSAPOL", "COUNSELING", "CTSAL", "CTSWORSHIP", "CTSCE", "CTSMISSIONS"
  ]);
  var DEGREES = {
    certificate: { courses: 12, core: FOUNDATION, levels: ["cert", "assoc", "thm", "mdiv"] },
    associate:   { courses: 25, core: FOUNDATION, levels: ["assoc", "thm", "mdiv"] },
    thm:         { courses: 12, core: FOUNDATION, levels: ["thm", "mdiv"] },
    mdiv:        { courses: 30, core: MDIV_CORE,  levels: ["thm", "mdiv"] }
  };

  var mem = {};
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return k in mem ? mem[k] : null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) { mem[k] = String(v); } }
  function list(k) {
    try { var a = JSON.parse(get(k) || "[]"); return Array.isArray(a) ? a.map(function (c) { return String(c).toUpperCase(); }) : []; }
    catch (e) { return []; }
  }
  function goalIsAssoc() {
    var s = {};
    try { s = JSON.parse(get("cts_student") || "null") || {}; } catch (e) {}
    var t = String(get("cts_track") || s.track || "").toLowerCase();
    return t === "ad" || t === "associate" || t === "assoc" ||
           String(get("cts_goal") || s.goal || "").toLowerCase() === "assoc";
  }

  /* Once, the first time this runs in a browser: a student already on the
   * Associate path keeps every course finished before levels were recorded.
   * Until 26 Sept 2026 the Associate was earned at Certificate rigor, so those
   * completions met the Associate's requirements as they then stood. A student
   * who was not on the Associate path gets an empty list -- switching to it
   * later does not carry earlier Certificate work up with it. */
  function grandfather() {
    if (get("cts_assoc_done_codes") !== null) return;
    set("cts_assoc_done_codes", JSON.stringify(goalIsAssoc() ? list("cts_done_codes") : []));
  }
  grandfather();

  /* The highest level each finished course was completed at. A code in any of
     the lists is a completion (the old certificate pages sometimes wrote the
     master's list and not the general one); the later list wins, since the
     lists run from lowest level to highest. */
  function levels() {
    var out = {};
    [["cts_done_codes", "cert"], ["cts_assoc_done_codes", "assoc"],
     ["cts_thm_done_codes", "thm"], ["cts_mdiv_done_codes", "mdiv"]].forEach(function (p) {
      list(p[0]).forEach(function (c) { out[c] = p[1]; });
    });
    return out;
  }

  /* Where a student stands on one degree: the courses that count, the
     required ones still missing, and whether it is earned. */
  function status(degree) {
    var d = DEGREES[degree];
    if (!d) return null;
    var lv = levels(), have = {}, count = 0;
    Object.keys(lv).forEach(function (c) { if (d.levels.indexOf(lv[c]) !== -1) { have[c] = true; count++; } });
    var missing = d.core.filter(function (c) { return !have[c]; });
    return {
      degree: degree, count: count, required: d.courses, have: have,
      core: d.core, coreDone: d.core.length - missing.length, missing: missing,
      earned: count >= d.courses && missing.length === 0
    };
  }

  window.CTSDegrees = {
    FOUNDATION: FOUNDATION, MDIV_CORE: MDIV_CORE, DEGREES: DEGREES,
    grandfather: grandfather, levels: levels, status: status, goalIsAssoc: goalIsAssoc
  };
})();
