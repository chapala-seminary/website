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

  function complete(c) {
    if (!c || !c.slug || !c.units || !c.units.length) return false;
    var p;
    try { p = JSON.parse(get("cts_" + c.slug + "_progress") || "{}") || {}; } catch (e) { p = {}; }
    for (var i = 0; i < c.units.length; i++) if (!p["unit" + c.units[i]]) return false;
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
      (all || []).forEach(function (c) { if (course(c)) n++; });
      return n;
    },
    isComplete: complete,
  };
})();
