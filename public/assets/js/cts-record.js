/* CTS course completion: the one place a course is recorded as finished.
 *
 * A course is complete when its last unit is passed -- not when the student
 * happens to open the certificate page. Until 24 Sept 2026 the certificate
 * pages (cts-completion.js) did the recording, so a student who passed every
 * unit and never opened the certificate got no completion: the course did not
 * count toward a degree, did not unlock the courses gated on it, and the
 * seminary was never notified. Wayne's audit of the beta flagged it; the
 * certificate pages now only read what is recorded here.
 *
 * Called by the unit engine when a unit is passed and on every unit page load
 * (so a course finished before this existed is picked up), by the Ethics unit
 * pages, and by the front page for every course (the same catch-up, for a
 * student who is done and never opens a unit page again).
 *
 * What recording does -- the same four things the certificate page did, in the
 * same keys, so existing students' records and every page that reads them are
 * unchanged:
 *   cts_done_codes            the code, for course gating and the Worker
 *   cts_assoc_done_codes /
 *   cts_thm_done_codes /
 *   cts_mdiv_done_codes       the code again, at the level it was earned on
 *                             (the degree pages count by level: cts-degrees.js)
 *   cts_degree_courses        the course name, for reading
 *   (the seminary is told by the Worker when the sync brings the completion)
 *
 *   CTSRecord.course({ slug, code, name, page, units })
 *       -> false (not complete), true (already recorded), "new" (recorded now)
 *   CTSRecord.backfill([ ...same shape ])
 *
 * Server-side completion (the Worker validating the units, writing the
 * record and sending the admin email as one event) is the planned next step;
 * this is the browser half of it.
 */
(function () {
  "use strict";
  if (window.CTSRecord) return;

  var mem = {};
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return k in mem ? mem[k] : null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) { mem[k] = String(v); } }
  function list(k) { try { var a = JSON.parse(get(k) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function add(k, v) { var a = list(k); if (a.indexOf(v) === -1) { a.push(v); set(k, JSON.stringify(a)); } }
  function student() { try { return JSON.parse(get("cts_student") || "null") || {}; } catch (e) { return {}; } }

  function trackToken(c) {
    var s = student();
    var t = get("cts_track") || s.track || s.program;
    // The single-page courses also allow registration on their own page.
    if (!t && c && c.registration) t = (json(c.registration, {}) || {}).track;
    t = String(t || "cert").toLowerCase();
    if (t === "mtheol" || t === "mth" || /master of theology/.test(t)) return "thm";
    if (/master of divinity/.test(t)) return "mdiv";
    return t;
  }
  function goalIsAssoc() {
    var t = trackToken(), s = student();
    return t === "ad" || t === "associate" || t === "assoc" ||
           String(get("cts_goal") || s.goal || "").toLowerCase() === "assoc";
  }
  /* The level a course is completed at is kept beside cts_done_codes; the
     Associate's list is new (29 Sept 2026, cts-degrees.js). Before anything is
     recorded, a student already on the Associate path keeps every course
     finished before the list existed -- the same step, run once, as
     cts-degrees.js and cts-curriculum.js take. */
  if (get("cts_assoc_done_codes") === null)
    set("cts_assoc_done_codes", JSON.stringify(goalIsAssoc() ? list("cts_done_codes") : []));

  function json(k, dflt) { try { var v = JSON.parse(get(k) || "null"); return v == null ? dflt : v; } catch (e) { return dflt; } }

  /* The keys the old per-course engines wrote, the same table as cts-engine.js
   * and cts-sync.js (tools/verify-legacy-table.mjs holds all three to it). The
   * engine reads these when a unit page of the course is opened; the front
   * page's catch-up opens no unit page, so without them a student whose
   * progress is still under the old keys -- Evangelism, a foundation course,
   * among them -- was never recorded there, and the catalog stayed locked. */
  var LEGACY = {
    "1peter":               { slug: "1pet" },
    "biblecharacters":      { slug: "CTSBC" },
    "biblecharacters2":     { slug: "CTSBC2" },
    "galatians":            { slug: "gal" },
    "deaconfamilyministry": { slug: "CTSDFM" },
    "evangelism":           { slug: "ev" },
    "hermeneutics":         { slug: "herm",       flag: function (n) { return "cts_herm_u" + n + "_passed"; },         value: "true" },
    "evanpreach":           { slug: "evenpreach", flag: function (n) { return "cts_evenpreach_unit" + n + "_passed"; }, value: "1" },
    "bible":                { flag: function (n) { return "cts_bible_u" + n + "_mcpass"; },      value: "1" },
    "pent":                 { flag: function (n) { return "cts_pent_unit" + n + "_passed"; },    value: "true" },
    "romans":               { flag: function (n) { return "cts_romans_unit" + n + "_passed"; },  value: "true" },
    "re":                   { flag: function (n) { return "re_unit" + n + "_passed"; },          value: "1" },
    "cs":                   { state: "cts_cs_state" },                 // {n: {passed: true}}
    "genesis":              { completion: "genesis" }                  // cts_genesis_uN_completion[_track]
  };
  function legacyPassed(slug, n) {
    var l = LEGACY[slug];
    if (!l) return false;
    if (l.slug) {
      if (get("cts_" + l.slug + "_u" + n + "_mc_passed") === "1") return true;
      if ((json("cts_" + l.slug + "_progress", {}) || {})["unit" + n]) return true;
    }
    if (l.flag) { var v = get(l.flag(n)); if (v === "1" || v === "true" || v === "passed") return true; }
    if (l.state) { var st = json(l.state, {}) || {}; if (st[n] && st[n].passed) return true; }
    if (l.completion) {
      var ks = ["", "_cert", "_mdiv", "_thm"];
      for (var i = 0; i < ks.length; i++) if (json("cts_genesis_u" + n + "_completion" + ks[i], null)) return true;
    }
    return false;
  }

  /* On the M.Div. and Th.M. tracks a course with a Master's textbook is
     complete only when its textbook test is passed as well (Dr. Cook, 4 Oct
     2026); cts-textbook.js records the pass and calls course() again. The
     Certificate and Associate tracks are not held by it.

     A course may require two tests -- its textbook and its five readings
     (9 Oct 2026) -- and is held until each is passed; a pass on one is never
     a pass on the other. The tests come from cts-required-tests.js (generated
     from worker/catalog.json) when the page loads it, else from the course
     object (`tests`, or the older `textbook`). A required-reading test with
     a `requiredFrom` counts only from that moment (null: not yet in force),
     and not for a course the student record held as a master's completion
     before it: the Worker says so, and cts-sync.js keeps it here as
     cts_textbook_<slug>_exempt. The browser never decides that by itself. */
  function mastersTrack(c) { var t = trackToken(c); return t === "mdiv" || t === "thm" || t === "mth"; }
  function textbookPassed(slug) { return !!get("cts_textbook_" + slug + "_passed"); }
  function testsOf(c) {
    if (!c) return [];
    var map = window.CTS_REQUIRED_TESTS, code = String(c.code || "").toUpperCase();
    if (map && code && Object.prototype.hasOwnProperty.call(map, code)) return map[code] || [];
    if (map && code && !c.tests && !c.textbook) return [];
    if (Array.isArray(c.tests)) return c.tests.map(function (t) { return typeof t === "string" ? { slug: t } : t; });
    return c.textbook ? [{ slug: c.textbook, page: c.textbookPage, kind: c.textbookKind || "textbook" }] : [];
  }
  function testCounts(t) {
    if (!t || !("requiredFrom" in t)) return true;
    if (t.requiredFrom == null) return false;
    var from = Date.parse(t.requiredFrom);
    if (isNaN(from) || Date.now() < from) return false;
    return !get("cts_textbook_" + t.slug + "_exempt");
  }
  // the tests still standing between a master's student and this course, in order
  function pendingTests(c) {
    if (!c || !mastersTrack(c)) return [];
    return testsOf(c).filter(function (t) { return t && t.slug && testCounts(t) && !textbookPassed(t.slug); });
  }
  function textbookHolds(c) { return pendingTests(c).length > 0; }

  function complete(c) {
    if (!c) return false;
    if (c.single) return singleComplete(c) && !textbookHolds(c);
    if (!c.slug || !c.units || !c.units.length) return false;
    var p = json("cts_" + c.slug + "_progress", {}) || {};
    for (var i = 0; i < c.units.length; i++)
      if (!p["unit" + c.units[i]] && !legacyPassed(c.slug, c.units[i])) return false;
    return !textbookHolds(c);
  }

  /* The single-page courses keep their own state and record themselves when
   * their page is opened (CTSCurriculum.markComplete). A student who finished
   * one and never opens it again was left out of the front page's catch-up --
   * and for Preaching, a foundation course, that kept the whole catalog locked.
   * Preaching gained a unit 7 on 24 Sept 2026 (its page renumbers 7-9 to 8-10
   * on first load); a student who passed all nine units before that finished
   * the course as it then was, and is not sent back for the new one. */
  var SINGLES = [
    { single: true, code: "WISESPEAK", name: "Preaching", page: "CTSPreachingCertificate.html",
      state: "cts_wisespeak_state", layout: "cts_wisespeak_layout",
      units: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], before: { "": [1, 2, 3, 4, 5, 6, 7, 8, 9] } },
    { single: true, code: "COUNSELING", name: "Counseling", page: "CTSCounselingCertificate.html",
      state: "cts_drakeford_state", registration: "cts_drakeford_reg", units: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], textbook: "counseling" },
    { single: true, code: "STORYTEL", name: "Narrative Preaching", page: "CTSNarrativePreachingCertificate.html",
      state: "cts_storytel_state", registration: "cts_storytel_reg", units: [1, 2, 3, 4, 5, 6, 7, 8], textbook: "narrative" }
  ];
  function singleComplete(c) {
    var st = json(c.state, null);
    if (!st || typeof st !== "object") return false;
    var units = c.units;
    if (c.layout && c.before) {
      var lay = get(c.layout) || "";
      if (c.before[lay]) units = c.before[lay];
    }
    for (var i = 0; i < units.length; i++) if (!(st[units[i]] && st[units[i]].passed)) return false;
    return true;
  }

  /* The seminary used to be told from here, by a post to a Google Apps Script
     that kept the "CTS Completions" Sheet. Since 25 Sept 2026 the Worker tells
     the seminary itself, and records it, when the sync brings the completion
     (worker/notify.js) -- and a returning student's history arrives as one
     notice. The Sheet received nothing after 30 Aug; posting to it as well
     could only add stray emails beside that one notice (Dr. Cook's review,
     29 Sept 2026), so the post is gone. The key stays: the Th.M. and M.Div.
     pages still read it. */
  function notify(c) {
    set("cts_cc_recorded_" + String(c.page || c.code).toLowerCase(), "1");
  }

  function course(c) {
    if (!complete(c)) return false;
    var code = String(c.code).toUpperCase();
    // Notify only for a completion that is new to this student's record. A
    // code already here was recorded before -- on this device, or on another
    // and brought back by the student code -- and was reported then; without
    // this, restoring onto a new phone would report every course again.
    var isNew = list("cts_done_codes").indexOf(code) === -1;
    add("cts_done_codes", code);
    if (c.name) add("cts_degree_courses", c.name);
    if (!isNew) return true;
    // The track is the one the course was finished on. Only a new completion
    // takes it: a student who finished a course on the certificate track and
    // later switched to the M.Div. must not have it counted as master's work.
    var t = trackToken(c);
    if (t === "mdiv") add("cts_mdiv_done_codes", code);
    else if (t === "thm" || t === "mth") add("cts_thm_done_codes", code);
    else if (goalIsAssoc()) add("cts_assoc_done_codes", code);
    notify(c);
    return "new";
  }

  window.CTSRecord = {
    course: course,
    backfill: function (all) {
      var n = 0;
      (all || []).concat(SINGLES).forEach(function (c) { if (course(c)) n++; });
      return n;
    },
    isComplete: complete,
    singleCourse: function (code) {
      for (var i = 0; i < SINGLES.length; i++) if (SINGLES[i].code === code) return SINGLES[i];
      return null;
    },
    // true when only a required test stands between this student and the course
    textbookHolds: textbookHolds,
    // which: [{ slug, page, kind }], textbook first (an empty list when none)
    pendingTests: pendingTests,
    testsOf: testsOf,
  };
})();
