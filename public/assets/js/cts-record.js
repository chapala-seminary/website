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
 *   cts_mdiv_done_codes /
 *   cts_thm_done_codes        the code again if earned on that master's track
 *   cts_degree_courses        the course name, which the degree pages count
 *   seminary notification     once per course per browser: the Google Apps
 *                             Script endpoint that keeps Wayne's running count
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

  var ENDPOINT = "https://script.google.com/macros/s/AKfycbxB02hawCZC6pPkp2mTmdIXL601M7WiWU-0TT-NWo5D1QwwKh_jGyWO_Nz9IaQVp-3qNw/exec";

  var mem = {};
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return k in mem ? mem[k] : null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) { mem[k] = String(v); } }
  function list(k) { try { var a = JSON.parse(get(k) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function add(k, v) { var a = list(k); if (a.indexOf(v) === -1) { a.push(v); set(k, JSON.stringify(a)); } }
  function student() { try { return JSON.parse(get("cts_student") || "null") || {}; } catch (e) { return {}; } }

  function trackToken() {
    var s = student();
    return String(get("cts_track") || s.track || s.program || "cert").toLowerCase();
  }
  // The label the seminary's count has always used (cts-completion.js).
  function trackLabel() {
    var t = trackToken(), s = student();
    if (t === "mdiv" || /master of divinity|m\.div/.test(t)) return "Master of Divinity (M.Div.)";
    if (t === "thm" || t === "mth" || /master of theology|m\.th|th\.m/.test(t)) return "Master of Theology (Th.M.)";
    var g = String(get("cts_goal") || s.goal || "").toLowerCase();
    if (g === "assoc" || t === "ad" || t === "associate") return "Associate of Divinity";
    return "Certificate of Ministry";
  }

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

  function complete(c) {
    if (!c) return false;
    if (c.single) return singleComplete(c);
    if (!c.slug || !c.units || !c.units.length) return false;
    var p = json("cts_" + c.slug + "_progress", {}) || {};
    for (var i = 0; i < c.units.length; i++)
      if (!p["unit" + c.units[i]] && !legacyPassed(c.slug, c.units[i])) return false;
    return true;
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
      state: "cts_drakeford_state", units: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }
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

  function notify(c) {
    // Same key the certificate pages used, so a course they already reported
    // is never reported twice.
    var key = "cts_cc_recorded_" + String(c.page || c.code).toLowerCase();
    if (get(key)) return;
    set(key, "1");
    var s = student();
    var data = { name: s.name || "", course: c.name, track: trackLabel(),
                 date: new Date().toISOString().slice(0, 10), email: s.email || "" };
    var body = Object.keys(data).map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
    }).join("&");
    try {
      fetch(ENDPOINT, { method: "POST", mode: "no-cors", keepalive: true,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body }).catch(function () {});
    } catch (e) {}
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
    var t = trackToken();
    if (t === "mdiv") add("cts_mdiv_done_codes", code);
    if (t === "thm" || t === "mth") add("cts_thm_done_codes", code);
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
  };
})();
