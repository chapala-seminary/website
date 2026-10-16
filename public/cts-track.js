/* CTS "Change track" control.
   Appears (bottom-left, screen only) once a student has registered, letting them
   switch between Certificate of Ministry / Associate of Divinity / Master of Divinity
   / Master of Theology at any time. Writes cts_track using the token this page expects
   (handles mth/thm). Associate of Divinity is certificate-level study toward a 25-course
   degree, so it sets the certificate rigor and records the goal (cts_goal); the other
   choices clear that goal. Then reloads so the new rigor and certificate routing take effect. */
(function () {
  "use strict";
  var KEY = "cts_track";

  function studentTrack() {
    try {
      var s = JSON.parse(localStorage.getItem("cts_student") || "null");
      if (s && typeof s === "object" && s.track) return s.track;
    } catch (e) {}
    return "";
  }

  // Show the control only once a student has registered — the track may be stored
  // as the standalone key OR inside the student record (Joshua, Matthew, etc.).
  if (!localStorage.getItem(KEY) && !studentTrack()) return;

  function curr() { return localStorage.getItem(KEY) || studentTrack() || "cert"; }

  function studentGoal() {
    try {
      var s = JSON.parse(localStorage.getItem("cts_student") || "null");
      if (s && typeof s === "object" && s.goal) return s.goal;
    } catch (e) {}
    return "";
  }
  function currGoal() { return localStorage.getItem("cts_goal") || studentGoal() || ""; }

  function mthToken() {
    // Some courses store Master of Theology as 'thm', others as 'thm'. Match this page.
    try {
      var h = document.documentElement.innerHTML;
      if (/value=["']thm["']|['"]thm['"]/.test(h)) return "thm";
    } catch (e) {}
    return "thm";
  }

  function pageLang() {
    var b = document.body, c = b && b.classList;
    var p = b && b.getAttribute("data-page-lang");
    if (p) return p.slice(0, 2);
    if (c && (c.contains("lang-es") || c.contains("show-es") || c.contains("spanish"))) return "es";
    if (c && (c.contains("lang-en") || c.contains("lang-both") || c.contains("show-en"))) return "en";
    var l = (b && b.getAttribute("data-lang")) || document.documentElement.lang || "en";
    return l.slice(0, 2);
  }
  var LABELS = {
    es: { tg: "Cambiar plan", cert: "Certificado de Ministerio", assoc: "Asociado en Divinidad", mdiv: "Maestr\u00eda en Divinidad", thm: "Maestr\u00eda en Teolog\u00eda" },
    fr: { tg: "Changer de parcours", cert: "Certificat de minist\u00e8re", assoc: "Dipl\u00f4me associ\u00e9 en th\u00e9ologie", mdiv: "Master en th\u00e9ologie pastorale (M.Div.)", thm: "Master en th\u00e9ologie (Th.M.)" },
    en: { tg: "Change track", cert: "Certificate of Ministry", assoc: "Associate of Divinity", mdiv: "Master of Divinity", thm: "Master of Theology" }
  };
  function labels() { return LABELS[pageLang()] || LABELS.en; }
  /* The labels follow the page's language switch; they were fixed at load, so
     "Change track" stayed English on a page switched to Spanish (Dr. Cook's
     beta pass, 30 Sept 2026). */
  function relabel(wrap) {
    var L = labels();
    wrap.querySelector(".tg").textContent = L.tg + " \u25BE";
    Array.prototype.forEach.call(wrap.querySelectorAll(".menu button"), function (b) { b.textContent = L[b.getAttribute("data-t")]; });
  }

  function build() {
    if (document.getElementById("cts-track-ctl") || !document.body) return;
    var L = labels();

    var st = document.createElement("style");
    st.textContent =
      "@media print{#cts-track-ctl{display:none!important}}" +
      "#cts-track-ctl{position:fixed;left:10px;bottom:10px;z-index:99999;font:13px/1.3 Georgia,serif}" +
      "#cts-track-ctl .tg{background:#4A1E3A;color:#fff;border:0;border-radius:4px;padding:6px 11px;cursor:pointer;opacity:.92;box-shadow:0 1px 4px rgba(0,0,0,.25)}" +
      "#cts-track-ctl .menu{display:none;margin-top:6px;background:#fff;border:1px solid #ccc;border-radius:4px;box-shadow:0 3px 10px rgba(0,0,0,.18);overflow:hidden;min-width:200px}" +
      "#cts-track-ctl .menu button{display:block;width:100%;text-align:left;padding:9px 13px;border:0;background:#fff;cursor:pointer;white-space:nowrap;font:inherit}" +
      "#cts-track-ctl .menu button:hover{background:#f0e8ee}" +
      "#cts-track-ctl .menu button.cur{font-weight:700;color:#4A1E3A}" +
      "#cts-track-ctl .menu button.cur:after{content:' \\2713'}";
    document.head.appendChild(st);

    var wrap = document.createElement("div");
    wrap.id = "cts-track-ctl";
    wrap.className = "noprint";
    wrap.innerHTML =
      '<button class="tg" type="button">' + L.tg + ' \u25BE</button>' +
      '<div class="menu">' +
        '<button data-t="cert">' + L.cert + '</button>' +
        '<button data-t="assoc">' + L.assoc + '</button>' +
        '<button data-t="mdiv">' + L.mdiv + '</button>' +
        '<button data-t="thm">' + L.thm + '</button>' +
      '</div>';
    document.body.appendChild(wrap);
    if (typeof MutationObserver !== "undefined")
      new MutationObserver(function () { relabel(wrap); }).observe(document.body, { attributes: true, attributeFilter: ["class", "data-lang"] });

    var menu = wrap.querySelector(".menu");
    wrap.querySelector(".tg").addEventListener("click", function () {
      menu.style.display = (menu.style.display === "block") ? "none" : "block";
    });

    var c = curr();
    var goal = currGoal();
    var currentSel = (goal === "assoc") ? "assoc" : c;   // the choice currently in effect
    Array.prototype.forEach.call(wrap.querySelectorAll(".menu button"), function (b) {
      var t = b.getAttribute("data-t");
      if (t === currentSel) b.classList.add("cur");
      b.addEventListener("click", function () {
        var sel = b.getAttribute("data-t");
        if (sel === currentSel) { menu.style.display = "none"; return; }
        // Associate of Divinity = certificate rigor + a 25-course degree goal;
        // the other choices set their own rigor and clear the goal.
        var newGoal = (sel === "assoc") ? "assoc" : "";
        var newTrack = (sel === "assoc") ? "cert" : (sel === "thm" ? mthToken() : sel);
        var oldTrack = localStorage.getItem(KEY), oldGoal = localStorage.getItem('cts_goal');
        localStorage.setItem(KEY, newTrack);
        localStorage.setItem("cts_goal", newGoal);
        // Some courses (Joshua, Matthew, Pentateuch) read the track from the
        // student record instead of the standalone key — update that too.
        try {
          var s = JSON.parse(localStorage.getItem("cts_student") || "null");
          if (s && typeof s === "object") {
            var oldStudentTrack = s.track, oldStudentGoal = s.goal;
            s.track = newTrack;
            s.goal = newGoal;
            localStorage.setItem("cts_student", JSON.stringify(s));
          }
        } catch (e) {}
        // Persist the profile before the new page resumes its server sitting.
        // Reloading first raced the periodic sync and retained the old rigor.
        var sync = window.CTS_SYNC && window.CTS_SYNC.sync;
        Array.prototype.forEach.call(wrap.querySelectorAll('button'), function (button) { button.disabled = true; });
        function failed() {
          if (oldTrack === null) localStorage.removeItem(KEY); else localStorage.setItem(KEY, oldTrack);
          if (oldGoal === null) localStorage.removeItem('cts_goal'); else localStorage.setItem('cts_goal', oldGoal);
          var current = JSON.parse(localStorage.getItem('cts_student') || 'null');
          if (current && s) { current.track = oldStudentTrack; current.goal = oldStudentGoal; localStorage.setItem('cts_student', JSON.stringify(current)); }
          Array.prototype.forEach.call(wrap.querySelectorAll('button'), function (button) { button.disabled = false; });
          menu.style.display = 'none';
          var note = wrap.querySelector('[role="alert"]');
          if (!note) { note = document.createElement('p'); note.setAttribute('role', 'alert'); wrap.appendChild(note); }
          note.textContent = pageLang() === 'es' ? 'No se pudo guardar el cambio de plan. Revise su conexión e inténtelo de nuevo. Sus respuestas se conservan.'
            : pageLang() === 'fr' ? 'Le changement de parcours n’a pas pu être enregistré. Vérifiez votre connexion et réessayez. Vos réponses sont conservées.'
            : 'The track change could not be saved. Check your connection and try again. Your answers are kept.';
        }
        Promise.resolve(sync ? sync() : null).then(function (state) {
          if (window.CTSGrading && (!state || !state.student || state.student.track !== newTrack || (state.student.goal || '') !== newGoal)) return failed();
          location.reload();
        }, failed);
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
