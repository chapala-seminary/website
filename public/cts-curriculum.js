/* CTS curriculum gating
   ------------------------------------------------------------------
   One file, loaded site-wide (beside cts-track.js). It enforces the
   seminary's prerequisite rule and powers the locked/open state of the
   catalog and of each course page.

   RULE
   - Seven "foundation" courses are required of every student:
       Old Testament Survey, New Testament Survey, Systematic Theology,
       Evangelism, Pastoral Ministries, Church History, Preaching (WiseSpeak).
   - Every OTHER course stays locked until all seven foundation courses
     are completed.
   - Deacon Family Ministry Plan is the one exception: always open.
   - Preaching (WiseSpeak) is itself a foundation course, so finishing the
     foundation also satisfies the rule that WiseSpeak precedes Doctrinal
     Preaching and Evangelistic Preaching.

   COMPLETION SIGNAL
   - When any course certificate unlocks, cts-completion.js records a stable
     CODE (the certificate filename minus its Th.M./M.Div./Certificate parts,
     upper-cased) into localStorage "cts_done_codes".
   - WiseSpeak (which has no standard certificate) records the code WISESPEAK
     from its own "mark complete" control.
   - Gating reads that code list. It is track-independent: completing a
     foundation course at any level (certificate or master's) satisfies it.
*/
(function () {
  "use strict";

  // ---- foundation courses, by completion CODE (upper-case, filename-derived)
  var CORE = ["CTSOTS", "CTSNT", "CTSST", "CTSEVANGELISM", "CTSPM", "CTSCH", "WISESPEAK"];

  // ---- catalog entry files that are NEVER locked (the 7 core + the Deacons exception)
  var OPEN_ENTRY = {
    "ctsunit1.html": 1,                       // Old Testament Survey
    "ctsbibleunit1.html": 1,                  // How We Got the Bible (opened per request)
    "ctsntunit1.html": 1,                     // New Testament Survey
    "ctsstunit1.html": 1,                     // Systematic Theology
    "ctsevangelismunit1.html": 1,             // Evangelism
    "ctspmunit1.html": 1,                     // Pastoral Ministries
    "ctschunit1.html": 1,                     // Church History
    "cts_wisespeak_preaching.html": 1,        // Preaching (WiseSpeak)
    "ctsdeaconfamilyministryunit1.html": 1    // Deacon Family Ministry (exception)
  };

  // ---- course-page prefixes that are NEVER locked (units of the always-open courses)
  //      prefix = filename with a trailing  UnitN.html  removed
  var OPEN_PREFIX = {
    "cts": 1,                       // Old Testament Survey units (CTSUnit1.html ...)
    "ctsbible": 1,                  // How We Got the Bible (opened per request)
    "ctsnt": 1,
    "ctsst": 1,
    "ctsevangelism": 1,
    "ctspm": 1,
    "ctsch": 1,
    "ctsdeaconfamilyministry": 1
  };
  var OPEN_FILE = { "cts_wisespeak_preaching": 1 };   // extensionless (see file())

  // Normalize the current page name so gating works whether the URL ends in
  // ".html", a trailing "/", or nothing at all (this worker serves extensionless
  // URLs like /CTSUnit1 as well as /CTSUnit1.html). All lookups below use the
  // extensionless, lower-cased form.
  function file() {
    var p = (location.pathname || "").toLowerCase().replace(/\/+$/, "");   // drop trailing slash(es)
    var last = p.split("/").pop() || "";
    return last.replace(/\.html$/, "");                                     // drop a trailing .html
  }

  function codes() {
    try {
      var a = JSON.parse(localStorage.getItem("cts_done_codes") || "[]");
      return Array.isArray(a) ? a : [];
    } catch (e) { return []; }
  }
  function coreComplete() {
    var have = codes();
    for (var i = 0; i < CORE.length; i++) if (have.indexOf(CORE[i]) === -1) return false;
    return true;
  }

  // ---- tester override -------------------------------------------------
  // Unlocks the whole catalog regardless of progress, for course testers.
  // Turn on : visit any page with  ?test=on  or  ?ctstest=on   (persists across the site)
  // Turn off: tap the top "test mode" bar, or visit any page with  ?test=off / ?ctstest=off
  // The flag lives in this browser only (localStorage); change TEST_PARAM
  // below if you ever want a different, less guessable switch.
  var TEST_KEY = "cts_test_mode";
  var TEST_PARAM = "ctstest";
  function testActive() { try { return localStorage.getItem(TEST_KEY) === "1"; } catch (e) { return false; } }
  function applyTestParam() {
    var q = (location.search || "") + "&" + (location.hash || "");
    var m = q.match(new RegExp("[?&#](?:" + TEST_PARAM + "|test)=(on|off|1|0)", "i"));
    if (!m) return;
    var v = m[1].toLowerCase();
    try {
      if (v === "on" || v === "1") localStorage.setItem(TEST_KEY, "1");
      else localStorage.removeItem(TEST_KEY);
    } catch (e) {}
  }
  applyTestParam();

  // In test mode, unit exams still require a registered student (they bail at
  // "Please register first"), so the answer key / correct-incorrect feedback never
  // shows. Seed a clearly-labeled placeholder student so quizzes grade and reveal
  // answers while testing. It is removed again when test mode is turned off.
  // ---- tester environment prep -------------------------------------------------
  // In test mode the unit exams otherwise (a) require a registered student and (b) refuse
  // to re-grade a unit that was previously passed or is in a retry lockout. All of that is
  // read from localStorage while the page parses — before this deferred script runs — so we
  // fix it once per tab session: seed a placeholder student and wipe per-unit pass/lock/
  // progress state, then reload once so the page reads the clean state. A real registered
  // student is never touched (their progress and lockouts are left exactly as they are).
  function prepTesterEnv() {
    if (!testActive()) return;
    // Never touch a real student's data. If someone is already registered on this
    // browser and is not the placeholder tester account, test mode still unlocks
    // the catalog for viewing (see coreComplete()||testActive() below) but must not
    // wipe any *_progress/*_passed/*_state/*_lock/*_lockout keys — those are that
    // student's real, earned progress. Only reset/reseed for an actual tester
    // session (nobody registered yet, or the placeholder tester itself).
    try {
      var existing = JSON.parse(localStorage.getItem("cts_student") || "null");
      if (existing && existing.name && !existing._tester) return;
    } catch (e) {}
    // Per-unit exam state across all engine families: *_progress *_passed *_state
    // *_full_lock *_sa_lock *_lockout. Reset it on every unit so a previously-passed or
    // locked unit re-grades. Deliberately leaves cts_student (identity), cts_track,
    // cts_done_codes and cts_degree_courses alone, so a registered student keeps their
    // name and earned certificates; only the per-unit exam flags reset.
    var PAT = /_(progress|passed|state|lock|lockout)$/;
    var hadStale = false, stillStale = true, seededOk = false;
    try {
      Object.keys(localStorage).forEach(function (k) { if (PAT.test(k)) { hadStale = true; localStorage.removeItem(k); } });
      stillStale = Object.keys(localStorage).some(function (k) { return PAT.test(k); });
    } catch (e) { return; }
    // Seed a full M.Div. tester only when nobody is registered, and confirm it persisted.
    // Two engines exist: one reads student.track ('mdiv'), the other student.program
    // ('Master of Divinity') and also requires student.email — so cover both.
    try {
      var s = JSON.parse(localStorage.getItem("cts_student") || "null");
      if (!s || !s.name) {
        localStorage.setItem("cts_student", JSON.stringify({
          name: "Course Tester", email: "tester@chapalaseminary.org", country: "—",
          track: "mdiv", program: "Master of Divinity",
          registered: new Date().toISOString(), _tester: true
        }));
        if (!localStorage.getItem("cts_track")) localStorage.setItem("cts_track", "mdiv");
        var v = JSON.parse(localStorage.getItem("cts_student") || "null");
        seededOk = !!(v && v._tester);
      }
    } catch (e) {}
    // Reload once so parse-time readers (unitPassed, lockouts, student) see the clean state.
    // Only reload if the change actually persisted — if storage is unavailable nothing
    // persists, hadStale&&!stillStale and seededOk are both false, so there is no reload loop.
    if ((hadStale && !stillStale) || seededOk) location.reload();
  }
  prepTesterEnv();

  // turn the tester override on/off (used by the unlock box and the top bar)
  function enableTest()  {
    // Tester mode must be an intentional action, not a stray tap on the small,
    // unlabeled unlock control still shown on locked cards/pages for CTS staff.
    try {
      if (!confirm("Enable course-tester mode?\n\nThis is for CTS staff testing only and will not affect your saved progress.")) return;
    } catch (e) {}
    try { localStorage.setItem(TEST_KEY, "1"); } catch (e) {} location.reload();
  }
  function disableTest() {
    try {
      localStorage.removeItem(TEST_KEY);
      var s = JSON.parse(localStorage.getItem("cts_student") || "null");
      if (s && s._tester) localStorage.removeItem("cts_student");    // drop the placeholder tester, keep real students
    } catch (e) {}
    location.reload();
  }

  // public helper (used by WiseSpeak, and available for any page)
  window.CTSCurriculum = {
    coreComplete: coreComplete,
    testActive: testActive,
    testMode: function (on) {                 // console toggle: CTSCurriculum.testMode(true|false)
      try { if (on === false) localStorage.removeItem(TEST_KEY); else localStorage.setItem(TEST_KEY, "1"); } catch (e) {}
    },
    done: codes,
    markComplete: function (code, name) {
      if (code) {
        try {
          var a = JSON.parse(localStorage.getItem("cts_done_codes") || "[]");
          if (!Array.isArray(a)) a = [];
          code = String(code).toUpperCase();
          if (a.indexOf(code) === -1) { a.push(code); localStorage.setItem("cts_done_codes", JSON.stringify(a)); }
          var tr = String(localStorage.getItem("cts_track") || "").toLowerCase();
          try {
            var ss = JSON.parse(localStorage.getItem("cts_student") || "null");
            if (!tr && ss && ss.track) tr = String(ss.track).toLowerCase();
          } catch (x) {}
          if (tr === "mdiv") {
            var md = JSON.parse(localStorage.getItem("cts_mdiv_done_codes") || "[]");
            if (!Array.isArray(md)) md = [];
            if (md.indexOf(code) === -1) { md.push(code); localStorage.setItem("cts_mdiv_done_codes", JSON.stringify(md)); }
          }
          if (tr === "thm") {
            var th = JSON.parse(localStorage.getItem("cts_thm_done_codes") || "[]");
            if (!Array.isArray(th)) th = [];
            if (th.indexOf(code) === -1) { th.push(code); localStorage.setItem("cts_thm_done_codes", JSON.stringify(th)); }
          }
        } catch (e) {}
      }
      if (name) {                         // also feed the distinct-name roster (Associate degree count)
        try {
          var r = JSON.parse(localStorage.getItem("cts_degree_courses") || "[]");
          if (!Array.isArray(r)) r = [];
          if (r.indexOf(name) === -1) { r.push(name); localStorage.setItem("cts_degree_courses", JSON.stringify(r)); }
        } catch (e) {}
      }
    }
  };

  function isEs() {
    var b = document.body;
    if (b) {
      var d = b.getAttribute("data-lang"); if (d) return d.slice(0, 2) === "es";
      if (b.classList.contains("lang-es")) return true;
      if (b.classList.contains("lang-en")) return false;
    }
    return (document.documentElement.lang || "en").slice(0, 2) === "es";
  }

  var T = {
    badge:  { en: "Locked", es: "Bloqueado" },
    legend: { en: "\uD83D\uDD12 Locked courses open once you complete the seven required foundation courses listed above.",
              es: "\uD83D\uDD12 Los cursos bloqueados se abren al completar los siete cursos de fundamento indicados arriba." },
    lockTitle: { en: "This course is locked", es: "Este curso está bloqueado" },
    lockBody:  { en: "Complete the seven foundation courses first — Old Testament Survey, New Testament Survey, Systematic Theology, Evangelism, Pastoral Ministries, Church History, and Preaching. Once those are done, the whole catalog opens.",
                 es: "Complete primero los siete cursos de fundamento — Panorama del Antiguo Testamento, Panorama del Nuevo Testamento, Teología Sistemática, Evangelismo, Ministerios Pastorales, Historia de la Iglesia y Predicación. Una vez completados, todo el catálogo se abre." },
    toCat:   { en: "Go to the course catalog", es: "Ir al catálogo de cursos" },
    toGuide: { en: "Read \u201CBefore You Begin\u201D", es: "Leer \u00ABAntes de Comenzar\u00BB" }
  };
  function t(o) { return isEs() ? o.es : o.en; }

  // ---------- catalog page: grey + badge the locked course cards ----------
  function gateCatalog() {
    var cards = document.querySelectorAll("a.course");
    if (!cards.length) return false;
    var open = coreComplete() || testActive();

    var st = document.createElement("style");
    st.textContent =
      "a.course.cts-locked{opacity:.55;filter:grayscale(.65)}" +
      "a.course.cts-locked .cts-lk-wrap{position:absolute;top:8px;right:8px;display:flex;flex-direction:column;align-items:flex-end;gap:7px;z-index:2}" +
      "a.course.cts-locked .cts-lk{background:#4A1E3A;color:#fff;font:600 11px/1 Georgia,serif;letter-spacing:.04em;padding:4px 8px;border-radius:20px;display:inline-flex;align-items:center;gap:4px}" +
      "a.course.cts-locked .cts-lk-key{width:22px;height:22px;padding:0;background:transparent;border:1.5px solid #9b8f97;border-radius:3px;position:relative;cursor:pointer;-webkit-tap-highlight-color:transparent}" +
      "a.course.cts-locked .cts-lk-key::after{content:'';position:absolute;top:50%;left:50%;width:4px;height:4px;border-radius:50%;background:#9b8f97;transform:translate(-50%,-50%)}" +
      "a.course.cts-locked .cts-lk-key:active{border-color:#4A1E3A}" +
      "a.course.cts-locked .cts-lk-key:active::after{background:#4A1E3A}" +
      ".cts-lock-legend{max-width:760px;margin:0 auto 18px;padding:10px 14px;background:#faf6f9;border:1px solid #e7d8e4;border-radius:8px;color:#5a3550;font-size:.92rem;text-align:center}";
    document.head.appendChild(st);

    cards.forEach(function (a) {
      var href = (a.getAttribute("href") || "").toLowerCase();
      if (OPEN_ENTRY[href] || open) return;          // always-open, or foundation finished
      a.classList.add("cts-locked");
      if (getComputedStyle(a).position === "static") a.style.position = "relative";
      var wrap = document.createElement("span");
      wrap.className = "cts-lk-wrap";
      var b = document.createElement("span");
      b.className = "cts-lk";
      b.innerHTML = "\uD83D\uDD12 <span>" + t(T.badge) + "</span>";
      wrap.appendChild(b);
      var key = document.createElement("button");        // discreet, unlabeled tester unlock
      key.type = "button";
      key.className = "cts-lk-key";
      key.setAttribute("aria-label", "");
      key.setAttribute("tabindex", "-1");
      key.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); enableTest(); });
      wrap.appendChild(key);
      a.appendChild(wrap);
      a.setAttribute("href", "CTSBeforeYouBegin.html");   // a click explains the path
      a.setAttribute("title", t(T.lockBody));
    });

    if (!open) {
      var sec = cards[0].closest("section") || cards[0].parentNode;
      var grid = cards[0].parentNode;
      var leg = document.createElement("div");
      leg.className = "cts-lock-legend";
      leg.textContent = t(T.legend);
      grid.parentNode.insertBefore(leg, grid);
    }
    return true;
  }

  // ---------- course page: block a locked course with an overlay ----------
  function gateCoursePage() {
    var f = file();
    if (!f || f === "index" || f === "ctsbeforeyoubegin") return;
    if (/certificate$/.test(f)) return;                // certificates gate themselves on their own course
    if (OPEN_FILE[f]) return;                          // WiseSpeak etc.
    var prefix = f.replace(/unit\d+$/, "");
    if (OPEN_PREFIX[prefix]) return;                   // a unit of an always-open course
    if (prefix === f && !/unit\d+$/.test(f)) {         // not a recognizable course unit page — leave alone
      // (allows misc/non-course pages through)
    }
    if (coreComplete() || testActive()) return;        // foundation done (or tester override) — everything open

    // locked: cover the page
    var ov = document.createElement("div");
    ov.id = "cts-lock-overlay";
    ov.setAttribute("style",
      "position:fixed;inset:0;z-index:2147483600;background:#f6f1f4;display:flex;align-items:center;justify-content:center;padding:24px;overflow:auto");
    ov.innerHTML =
      '<div style="max-width:560px;text-align:center;font-family:Georgia,serif;color:#3a2233">' +
        '<div style="font-size:46px;margin-bottom:6px">\uD83D\uDD12</div>' +
        '<h2 style="color:#4A1E3A;margin:0 0 12px;font-size:1.5rem">' + t(T.lockTitle) + '</h2>' +
        '<p style="font-size:1.02rem;line-height:1.6;margin:0 0 22px">' + t(T.lockBody) + '</p>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">' +
          '<a href="index.html#catalog" style="background:#4A1E3A;color:#fff;text-decoration:none;padding:11px 22px;border-radius:26px;font-weight:bold">' + t(T.toCat) + '</a>' +
          '<a href="CTSBeforeYouBegin.html" style="background:#fff;color:#4A1E3A;border:1px solid #4A1E3A;text-decoration:none;padding:11px 22px;border-radius:26px;font-weight:bold">' + t(T.toGuide) + '</a>' +
        '</div>' +
        // discreet, unlabeled tester unlock — tap to open the whole catalog
        '<div style="margin-top:34px;display:flex;justify-content:center">' +
          '<button id="cts-keybox" type="button" aria-label="" ' +
            'style="width:22px;height:22px;padding:0;background:transparent;border:1.5px solid #c8b6c2;border-radius:3px;position:relative;cursor:pointer">' +
            '<span style="position:absolute;top:50%;left:50%;width:4px;height:4px;border-radius:50%;background:#c8b6c2;transform:translate(-50%,-50%)"></span>' +
          '</button>' +
        '</div>' +
      '</div>';
    var put = function () {
      document.body.appendChild(ov);
      document.body.style.overflow = "hidden";
      var box = document.getElementById("cts-keybox");
      if (box) box.addEventListener("click", function (e) { e.preventDefault(); enableTest(); });
    };
    if (document.body) put(); else document.addEventListener("DOMContentLoaded", put);
  }

  // ---------- tester bar: a reliable, quiet "test mode" strip across the top ----------
  //   Top + full width so it actually shows on phones; the old bottom-corner ribbon
  //   could sit off-screen behind the mobile nav bar. Tap anywhere on it to exit.
  function showTestBar() {
    var put = function () {
      if (document.getElementById("cts-test-bar") || !document.body) return;
      var es = isEs();
      var d = document.createElement("div");
      d.id = "cts-test-bar";
      d.setAttribute("role", "button");
      d.setAttribute("tabindex", "0");
      d.setAttribute("style",
        "position:fixed;top:0;left:0;right:0;z-index:2147483640;" +
        "background:#e7d9ab;color:#5c4a1c;border-bottom:1px solid #cdbf8d;" +
        "font:600 12px/1 Georgia,serif;letter-spacing:.07em;text-transform:uppercase;" +
        "text-align:center;padding:11px 14px;cursor:pointer");
      d.textContent = es ? "Modo prueba activo \u2014 el progreso de la unidad se reinicia en cada carga \u2014 toque para salir"
                         : "Test mode on \u2014 unit progress resets on every reload \u2014 tap to exit";
      d.title = es ? "En modo prueba, el estado de aprobado/bloqueado de cada unidad se borra automáticamente cada vez que la página se carga, para que pueda volver a probarla. Esto no afecta a los estudiantes reales."
                   : "In test mode, each unit's passed/locked state is automatically cleared every time the page loads, so you can re-test it. This does not affect real students.";
      var leave = function (e) { if (e) e.preventDefault(); disableTest(); };
      d.addEventListener("click", leave);
      d.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " " || e.keyCode === 13) leave(e); });
      document.body.appendChild(d);
    };
    if (document.body) put(); else document.addEventListener("DOMContentLoaded", put);
  }

  function run() {
    if (testActive()) showTestBar();
    if (!gateCatalog()) gateCoursePage();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();


/* CTS build stamp -----------------------------------------------------
   Visible version marker injected on every page that loads this file,
   plus a canonical /version.txt at the site root. Purpose: when a tester
   reports a problem, we can tell at a glance whether they are on the
   current deploy or a stale one. Bump BUILD (and version.txt) each deploy. */
(function () {
  var BUILD = "2026-09-15-testerbar1";
  function stamp() {
    if (document.getElementById("cts-build-stamp")) return;
    if (!document.body) return;
    var el = document.createElement("div");
    el.id = "cts-build-stamp";
    el.textContent = "build " + BUILD;
    el.title = "Deployed build of this site. Open /version.txt to confirm the live version.";
    el.style.cssText =
      "position:fixed;bottom:3px;right:6px;z-index:2147483646;" +
      "font:10px/1.4 ui-monospace,Menlo,Consolas,monospace;" +
      "color:#8a8f96;background:rgba(255,255,255,.66);" +
      "padding:1px 6px;border-radius:6px;pointer-events:none;" +
      "letter-spacing:.02em;max-width:62vw;overflow:hidden;" +
      "white-space:nowrap;text-overflow:ellipsis;";
    document.body.appendChild(el);
    /* Prefer the freshly-fetched canonical version over this (cacheable) JS. */
    try {
      fetch("version.txt?t=" + Date.now(), { cache: "no-store" })
        .then(function (r) { return r.ok ? r.text() : null; })
        .then(function (t) {
          if (!t) return;
          t = t.trim().split("\n")[0].trim();
          if (t) el.textContent = "build " + t;
        })
        .catch(function () {});
    } catch (e) {}
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", stamp);
  else stamp();
})();
