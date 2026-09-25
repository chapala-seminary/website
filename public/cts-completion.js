/* CTS course-completion tracker -- certificate pages, READ-ONLY (see record())
   Fires once when a course certificate unlocks:
   1) silently records name/course/track/date to the Google Apps Script endpoint (the running count)
   2) offers a one-tap email (with optional student email) to the seminary
   Self-configures from the page: track from filename, course from <title>. */
(function () {
  "use strict";
  var NOTIFY_EMAIL = "chapalatheological@gmail.com";
  var ENDPOINT = "https://script.google.com/macros/s/AKfycbxB02hawCZC6pPkp2mTmdIXL601M7WiWU-0TT-NWo5D1QwwKh_jGyWO_Nz9IaQVp-3qNw/exec";

  var file = (location.pathname.split("/").pop() || "").toLowerCase();
  var recKey = "cts_cc_recorded_" + file;

  function track() {
    // Prefer the student's selected track so generic certificate pages are recorded
    // at the rigor actually completed. Filename remains a fallback for older pages.
    try {
      var s = JSON.parse(localStorage.getItem("cts_student") || "null");
      var st = s && (s.track || s.program) ? String(s.track || s.program).toLowerCase() : "";
      var k = String(localStorage.getItem("cts_track") || "").toLowerCase();
      var v = k || st;
      if (v === "mdiv" || /master of divinity|m\.div/.test(v)) return "Master of Divinity (M.Div.)";
      if (v === "thm" || v === "mth" || /master of theology|m\.th|th\.m/.test(v)) return "Master of Theology (Th.M.)";
      // Associate of Divinity students intentionally sit Certificate-level exams
      // (cts_track stays "cert") toward a 25-course degree goal (cts_goal). Report
      // their actual credential/goal here without changing the exam rigor at all.
      var g = (s && s.goal ? String(s.goal) : "") || String(localStorage.getItem("cts_goal") || "");
      if (g.toLowerCase() === "assoc") return "Associate of Divinity";
    } catch (e) {}
    if (/mdiv/.test(file)) return "Master of Divinity (M.Div.)";
    if (/thm|mth/.test(file)) return "Master of Theology (Th.M.)";
    return "Certificate of Ministry";
  }
  function course() {
    var explicit = (document.body && document.body.getAttribute("data-course")) ||
                   (document.documentElement && document.documentElement.getAttribute("data-course"));
    if (explicit && explicit.trim()) return explicit.trim();   // page may name itself (overrides title parsing)
    var t = (document.title || "").replace(/^\s*CTS\s+/i, "");
    t = t.split(/[\u2014\u2013\-(]/)[0];           // cut at em/en dash, hyphen, or "("
    t = t.replace(/certificate.*$/i, "").trim();
    return t || file.replace(/\.html$/, "");
  }
  function lang() {
    var l = document.body && document.body.getAttribute("data-lang");
    if (l) return l;
    return (document.documentElement.lang || "en").slice(0, 2);
  }
  function visible(el) {
    return !!(el && el.offsetParent !== null && getComputedStyle(el).display !== "none" && getComputedStyle(el).visibility !== "hidden");
  }
  function findName() {
    var sels = ["#studentName", "#certName", "#cert-name", "#student-name", "#name",
                ".cert-name", ".student-name", "[data-student-name]"];
    for (var i = 0; i < sels.length; i++) {
      var el = document.querySelector(sels[i]);
      if (el && visible(el)) {
        var t = (el.textContent || "").replace(/\u00a0/g, " ").trim();
        if (t && t.length > 1) return t;
      }
    }
    return "";
  }
  function diplomaVisible() {
    var sels = ["#diploma", "#cert-wrap", ".diploma", "#certificate", ".certificate", "#cert", ".cert-wrap", ".sheet"];
    for (var i = 0; i < sels.length; i++) {
      var el = document.querySelector(sels[i]);
      if (el && visible(el)) return el;
    }
    return null;
  }

  var STR = {
    en: { reg: "Register your completion with the seminary",
          ph: "Your email (optional)",
          btn: "Notify the seminary",
          done: "Recorded \u2014 thank you." },
    es: { reg: "Registre su finalizaci\u00f3n ante el seminario",
          ph: "Su correo electr\u00f3nico (opcional)",
          btn: "Notificar al seminario",
          done: "Registrado \u2014 gracias." }
  };

  function encode(data) {
    return Object.keys(data).map(function (k) {
      return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
    }).join("&");
  }

  function submitGoogle(payload) {
    try {
      fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(payload)
      }).catch(function () {});
    } catch (e) {}
  }

  function addToRoster(name) {
    // Distinct completed-course roster (track-independent), used by the
    // Associate of Ministry degree certificate to count progress toward 25.
    if (!name) return;
    try {
      var arr = JSON.parse(localStorage.getItem("cts_degree_courses") || "[]");
      if (!Array.isArray(arr)) arr = [];
      var key = String(name).trim();
      if (key && arr.indexOf(key) === -1) {
        arr.push(key);
        localStorage.setItem("cts_degree_courses", JSON.stringify(arr));
      }
    } catch (e) {}
  }

  function recordCode() {
    // stable per-course code from the certificate filename (for cts-curriculum.js gating)
    var code = file.replace(/(thm|mth|mdiv)?certificate\.html$/, "").toUpperCase();
    if (code === "ETHICS_") code = "ETHICS"; // non-standard ethics_certificate.html filename
    if (!code) return;
    try {
      var a = JSON.parse(localStorage.getItem("cts_done_codes") || "[]");
      if (!Array.isArray(a)) a = [];
      if (a.indexOf(code) === -1) { a.push(code); localStorage.setItem("cts_done_codes", JSON.stringify(a)); }
      if (track() === "Master of Divinity (M.Div.)") {
        var m = JSON.parse(localStorage.getItem("cts_mdiv_done_codes") || "[]");
        if (!Array.isArray(m)) m = [];
        if (m.indexOf(code) === -1) { m.push(code); localStorage.setItem("cts_mdiv_done_codes", JSON.stringify(m)); }
      }
      if (track() === "Master of Theology (Th.M.)") {
        var t = JSON.parse(localStorage.getItem("cts_thm_done_codes") || "[]");
        if (!Array.isArray(t)) t = [];
        if (t.indexOf(code) === -1) { t.push(code); localStorage.setItem("cts_thm_done_codes", JSON.stringify(t)); }
      }
    } catch (e) {}
  }

  /* READ-ONLY since 24 Sept 2026. This page no longer records the course as
     complete -- passing the last unit does that (assets/js/cts-record.js),
     and opening a certificate must never create a completion. What is left
     here: the student's own "Notify the seminary" email, and the seminary's
     count for a completion this browser has recorded but not yet reported.
     A degree page (no course code of its own) still reports the award once,
     as it always did. */
  var DEGREE_PAGES = ["CTSASSOCIATE", "CTSCERTIFICATEOFMINISTRY", "CTSMDIV", "CTSTHM"];
  function pageCode() {
    // A page may name its code outright (data-course-code on <body>): the
    // single-page courses' certificate pages record COUNSELING, WISESPEAK and
    // STORYTEL, none of which a filename spells.
    var explicit = document.body && document.body.getAttribute("data-course-code");
    if (explicit && /^[A-Z0-9_]+$/i.test(explicit.trim())) return explicit.trim().toUpperCase();
    var c = file.replace(/(thm|mth|mdiv)?certificate\.html$/, "").replace(/\.html$/, "").toUpperCase();
    return c === "ETHICS_" ? "ETHICS" : c;
  }
  function reportable() {
    var code = pageCode();
    if (DEGREE_PAGES.indexOf(code) !== -1) return true;
    try {
      var a = JSON.parse(localStorage.getItem("cts_done_codes") || "[]");
      return Array.isArray(a) && a.indexOf(code) !== -1;
    } catch (e) { return false; }
  }

  function record(payload, alsoEmail) {
    if (localStorage.getItem(recKey) || !reportable()) {   // never double-count; never report what is not recorded
      if (alsoEmail) openMail(payload);
      return;
    }
    try { localStorage.setItem(recKey, "1"); } catch (e) {}
    submitGoogle(payload);
    var s = STR[lang() === "es" ? "es" : "en"];
    var status = document.getElementById("cts-cc-status");
    if (status) status.textContent = s.done;
    if (alsoEmail) openMail(payload);
  }

  function openMail(p) {
    var subject = "CTS Course Completion: " + p.course + " (" + p.track + ")";
    var body = "Name: " + (p.name || "(not provided)") +
               "\nCourse: " + p.course +
               "\nTrack: " + p.track +
               "\nDate: " + p.date +
               "\nStudent email: " + (p.email || "(not provided)");
    location.href = "mailto:" + NOTIFY_EMAIL +
      "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  function buildPanel(container, ctx) {
    if (document.getElementById("cts-cc-panel")) return;
    var s = STR[lang() === "es" ? "es" : "en"];

    var st = document.createElement("style");
    st.textContent = "@media print{#cts-cc-panel{display:none!important}}" +
      "#cts-cc-panel{margin:22px auto 4px;max-width:460px;text-align:center;font-family:inherit}" +
      "#cts-cc-panel .l{font-size:.9rem;color:#555;margin-bottom:8px}" +
      "#cts-cc-panel input{padding:8px 10px;border:1px solid #bbb;border-radius:4px;font-size:.9rem;width:62%;max-width:240px}" +
      "#cts-cc-panel button{padding:8px 16px;margin-left:6px;border:0;border-radius:4px;background:#4A1E3A;color:#fff;font-size:.9rem;cursor:pointer}" +
      "#cts-cc-status{display:block;margin-top:8px;font-size:.85rem;color:#2c6e49}";
    document.head.appendChild(st);

    var p = document.createElement("div");
    p.id = "cts-cc-panel";
    p.className = "noprint";
    p.innerHTML =
      '<div class="l">' + s.reg + '</div>' +
      '<div><input id="cts-cc-email" type="email" placeholder="' + s.ph + '" autocomplete="email">' +
      '<button id="cts-cc-btn" type="button">' + s.btn + '</button></div>' +
      '<span id="cts-cc-status"></span>';
    container.appendChild(p);

    document.getElementById("cts-cc-btn").addEventListener("click", function () {
      var em = (document.getElementById("cts-cc-email").value || "").trim();
      record({ name: ctx.name(), course: ctx.course, track: ctx.track, date: ctx.date, email: em }, true);
    });

    // Auto-record fallback after 7s if the student doesn't click (count still captured, email blank)
    setTimeout(function () {
      var em = (document.getElementById("cts-cc-email") || {}).value || "";
      record({ name: ctx.name(), course: ctx.course, track: ctx.track, date: ctx.date, email: em.trim() }, false);
    }, 7000);
  }

  function dateStr() {
    var d = new Date();
    return d.toISOString().slice(0, 10);
  }

  function start() {
    var ctx = { course: course(), track: track(), date: dateStr(), name: findName };
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      var dip = diplomaVisible();
      var nm = findName();
      if (dip || nm) {
        clearInterval(iv);
        buildPanel(dip || document.body, ctx);
      } else if (tries > 60) {        // ~30s; give up quietly (page never unlocked)
        clearInterval(iv);
      }
    }, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else { start(); }
})();


/* =================================================================
   CTS "Reading With Honors" prompt  (appended block)
   Chapala Theological Seminary / Seminario Teologico de Chapala
   Shows a link to this course's Supplemental Reading Room and the
   Honors page once a certificate unlocks. Self-gates to certificate
   pages only; renders both languages. Delete this whole block to remove.
   ================================================================= */
(function () {
  "use strict";
  var file = (location.pathname.split("/").pop() || "");
  var IRREG = { "ethics_certificate.html": "Ethics" };   // non-standard cert filenames -> honors code
  var isCert = /certificate\.html$/i.test(file) || IRREG.hasOwnProperty(file.toLowerCase());
  if (!isCert) return;

  var code;
  if (IRREG.hasOwnProperty(file.toLowerCase())) {
    code = IRREG[file.toLowerCase()];
  } else {
    var m = file.match(/^CTS(.+?)(?:MDiv|ThM|Mth)?Certificate\.html$/i);
    if (!m) return;
    code = m[1];
  }
  var isDegree = /^associate$/i.test(code);
  var room = "CTS" + code + "Readings.html";
  var HUB = "cts-honors.html";
  var done = false;
  try { done = !!localStorage.getItem("cts_honors_v1:" + code); } catch (e) {}

  function vis(el) {
    return !!(el && el.offsetParent !== null &&
      getComputedStyle(el).display !== "none" &&
      getComputedStyle(el).visibility !== "hidden");
  }
  function diploma() {
    var sels = ["#diploma", "#cert-wrap", ".diploma", "#certificate", ".certificate", "#cert", ".cert-wrap", ".sheet"];
    for (var i = 0; i < sels.length; i++) {
      var el = document.querySelector(sels[i]);
      if (el && vis(el)) return el;
    }
    return null;
  }

  function build(container) {
    if (document.getElementById("cts-honors-prompt")) return;
    var st = document.createElement("style");
    st.textContent =
      "@media print{#cts-honors-prompt{display:none!important}}" +
      "#cts-honors-prompt{margin:22px auto 8px;max-width:520px;padding:16px 18px;border:1px solid #dcc887;border-top:4px solid #c9a227;border-radius:12px;background:#fbf7ea;font-family:Georgia,'Times New Roman',serif;text-align:center;color:#3a2f1a;line-height:1.5}" +
      "#cts-honors-prompt .hh{font-size:1.06rem;color:#7a5a12;margin-bottom:6px}" +
      "#cts-honors-prompt .bd{font-size:.92rem;color:#5a4a2a;margin-bottom:10px}" +
      "#cts-honors-prompt .es{display:block;opacity:.82;margin-top:3px}" +
      "#cts-honors-prompt .dn{color:#2c6e49;font-size:.95rem;margin-bottom:8px}" +
      "#cts-honors-prompt a{display:inline-block;margin:5px 6px 0;padding:8px 16px;border-radius:22px;text-decoration:none;font-size:.9rem}" +
      "#cts-honors-prompt a.go{background:#5c4326;color:#fff}" +
      "#cts-honors-prompt a.alt{background:transparent;color:#5c4326;border:1px solid #5c4326}";
    document.head.appendChild(st);

    var box = document.createElement("div");
    box.id = "cts-honors-prompt";
    var h = "";
    if (isDegree) {
      h += '<div class="hh">&#10022; Earn your Associate With Honors<span class="es">&#10022; Obtenga su Asociado Con Honores</span></div>';
      h += '<div class="bd">Complete the honors reading in 25 classes and your Associate is awarded With Honors.' +
           '<span class="es">Complete la lectura con honores en 25 clases y su Asociado ser&aacute; otorgado Con Honores.</span></div>';
      h += '<a class="go" href="' + HUB + '">Honors page / P&aacute;gina de Honores &#8599;</a>';
    } else if (done) {
      h += '<div class="dn">&#10003; You have completed this class&rsquo;s honors reading.' +
           '<span class="es">&#10003; Ha completado la lectura con honores de esta clase.</span></div>';
      h += '<div class="bd">It counts toward your degree With Honors.' +
           '<span class="es">Cuenta para su t&iacute;tulo Con Honores.</span></div>';
      h += '<a class="alt" href="' + HUB + '">Honors progress / Progreso &#8599;</a>';
    } else {
      h += '<div class="hh">&#10022; Earn this class With Honors<span class="es">&#10022; Obtenga esta clase Con Honores</span></div>';
      h += '<div class="bd">Read any three works in this course&rsquo;s Supplemental Reading Room and record it on your honor &mdash; it counts toward your degree With Honors.' +
           '<span class="es">Lea tres obras cualesquiera en la Sala de Lecturas Complementarias de este curso y reg&iacute;strelo bajo su honor &mdash; cuenta para su t&iacute;tulo Con Honores.</span></div>';
      h += '<a class="go" href="' + room + '">Reading Room / Sala de Lecturas &#8599;</a>';
      h += '<a class="alt" href="' + HUB + '">Honors progress / Progreso &#8599;</a>';
    }
    box.innerHTML = h;
    container.appendChild(box);
  }

  function start() {
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      var d = diploma();
      if (d) { clearInterval(iv); build(d); }
      else if (tries > 60) { clearInterval(iv); }
    }, 500);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else { start(); }
})();
