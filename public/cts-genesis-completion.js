/* CTS course-completion tracker
   Fires once when a course certificate unlocks:
   1) silently records name/course/track/date to the Google Apps Script endpoint (the running count)
   2) offers a one-tap email (with optional student email) to the seminary
   Self-configures from the page: track from filename, course from <title>. */
(function () {
  "use strict";
  var NOTIFY_EMAIL = "chapalatheological@gmail.com";
  var ENDPOINT = "https://script.google.com/macros/s/AKfycbzJxatN3_7Dl6WwyZHWDRqO_EiLNY7SGQaZPFECY9QiVyqmoAe7qDVqiPzQo2R2S0IrAg/exec";

  var file = (location.pathname.split("/").pop() || "").toLowerCase();

  function track() {
    try {
      var s = JSON.parse(localStorage.getItem("cts_student") || "null");
      var t = s && s.track ? String(s.track).toLowerCase() : "";
      if (t === "mdiv" || t === "m.div" || t === "m.div.") return "Master of Divinity (M.Div.)";
      if (t === "thm" || t === "mth" || t === "m.th" || t === "m.th.") return "Master of Theology (Th.M.)";
    } catch (e) {}
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
    if (!code) return;
    try {
      var a = JSON.parse(localStorage.getItem("cts_done_codes") || "[]");
      if (!Array.isArray(a)) a = [];
      if (a.indexOf(code) === -1) { a.push(code); localStorage.setItem("cts_done_codes", JSON.stringify(a)); }
      // Genesis is a required M.Div. core course. Record M.Div.-level completion
      // in the same degree-tracking array used by the shared completion script.
      if (track() === "Master of Divinity (M.Div.)") {
        var m = JSON.parse(localStorage.getItem("cts_mdiv_done_codes") || "[]");
        if (!Array.isArray(m)) m = [];
        if (m.indexOf(code) === -1) { m.push(code); localStorage.setItem("cts_mdiv_done_codes", JSON.stringify(m)); }
      }
      // Genesis may also be selected as a Th.M. elective. Record Th.M.-level
      // completion in the same degree-tracking array used elsewhere.
      if (track() === "Master of Theology (Th.M.)") {
        var th = JSON.parse(localStorage.getItem("cts_thm_done_codes") || "[]");
        if (!Array.isArray(th)) th = [];
        if (th.indexOf(code) === -1) { th.push(code); localStorage.setItem("cts_thm_done_codes", JSON.stringify(th)); }
      }
    } catch (e) {}
  }

  function record(payload, alsoEmail) {
    var recKey = 'cts_cc_recorded_' + file + '_' + String(payload.track || '').toLowerCase().replace(/[^a-z0-9]+/g,'_');
    addToRoster(payload.course);                   // count toward the degree (idempotent)
    recordCode();                                  // stable code for prerequisite gating (idempotent)
    if (localStorage.getItem(recKey)) {            // never double-count
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


