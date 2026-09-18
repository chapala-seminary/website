/* ============================================================================
   Chapala Theological Seminary — unified exam engine
   ----------------------------------------------------------------------------
   One engine for every course. Reads a single per-unit object, window.CTS_UNIT,
   defined by data/<slug>/unitN.js, which is loaded immediately before this file.

   ASSESSMENT POLICY (seminary-wide, decided 2026-09-18)
     Pass mark      90% of the multiple-choice questions, as a ratio, so a unit
                    may carry any number of questions. Short answer is graded by
                    keyword coverage.
     Lockout        Master's tracks (M.Div., Th.M.) wait 15 minutes after a
                    failed attempt; certificate tracks wait 2 minutes.
     Answer reveal  Certificate tracks see the correct answers when they submit.
                    Master's tracks do not, until the unit is passed.
     Persistence    A passed multiple-choice section stays passed. A student who
                    passes MC but fails short answer retries only short answer.

   The two tracks are deliberately different in difficulty. Certificate study is
   meant to teach through immediate correction; master's study is meant to send
   the student back to the lesson.

   STORAGE
   Keys are unchanged from the per-course engines, so existing students keep
   their progress:
     cts_student, cts_track, cts_done_codes   (site-wide, shared with other JS)
     cts_<course>_progress                    { unit1: true, ... }
     cts_<course>_u<N>_state                  saved answers, mid-exam
     cts_<course>_u<N>_mc_passed
     cts_<course>_u<N>_sa_lock                epoch ms
     cts_<course>_u<N>_full_lock              epoch ms
   ========================================================================== */
(function () {
  "use strict";

  var U = window.CTS_UNIT;
  if (!U) { console.error("[cts] no CTS_UNIT for this page"); return; }

  // ---- policy ------------------------------------------------------------
  var PASS_RATIO      = 0.90;   // of multiple-choice questions
  var SA_HIT_RATIO    = 0.50;   // of a question's keywords, to credit it
  var SA_PASS_RATIO   = 0.70;   // of short-answer questions
  var LOCK_MASTERS_MIN = 15;
  var LOCK_CERT_MIN    = 2;

  // ---- storage, tolerant of blocked localStorage (some Android webviews) --
  var mem = {};
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return k in mem ? mem[k] : null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { mem[k] = String(v); } }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) { delete mem[k]; } }
  function jget(k, d) { try { return JSON.parse(lsGet(k)) || d; } catch (e) { return d; } }

  var KEY = {
    progress: "cts_" + U.course + "_progress",
    state:    "cts_" + U.course + "_u" + U.unit + "_state",
    mcPassed: "cts_" + U.course + "_u" + U.unit + "_mc_passed",
    saLock:   "cts_" + U.course + "_u" + U.unit + "_sa_lock",
    fullLock: "cts_" + U.course + "_u" + U.unit + "_full_lock"
  };

  // ---- student and track -------------------------------------------------
  function student() { return jget("cts_student", null); }
  function track() {
    var s = student();
    return lsGet("cts_track") || (s && s.track) || "cert";
  }
  function isMasters() { var t = track(); return t === "mdiv" || t === "thm" || t === "mth"; }
  function lockMinutes() { return isMasters() ? LOCK_MASTERS_MIN : LOCK_CERT_MIN; }

  var progress   = jget(KEY.progress, {});
  var unitPassed = !!progress["unit" + U.unit];
  var mcPassed   = lsGet(KEY.mcPassed) === "1";

  /* Certificate students are corrected immediately; master's students are sent
     back to the lesson. Once the unit is passed, everyone may review. */
  function revealAnswers() { return !isMasters() || unitPassed; }

  // ---- language ----------------------------------------------------------
  function isEs() {
    var b = document.body;
    if (b && b.classList.contains("lang-es")) return true;
    var l = (b && b.getAttribute("data-lang")) || document.documentElement.lang || "en";
    return l.slice(0, 2) === "es";
  }
  function pick(o) {           // {en,es} | plain value
    if (o === null || o === undefined) return "";
    if (typeof o === "object" && ("en" in o || "es" in o)) return (isEs() ? o.es : o.en) || o.en || "";
    return o;
  }
  function bi(o) {             // both languages, toggled by cts-lang.js
    if (o === null || o === undefined) return "";
    if (typeof o === "object" && ("en" in o || "es" in o)) {
      return '<span class="lang-en">' + (o.en || "") + '</span>' +
             '<span class="lang-es">' + (o.es || o.en || "") + "</span>";
    }
    return String(o);
  }

  // ---- answers -----------------------------------------------------------
  var mc = U.mc || [], sa = U.sa || [];
  var saved = jget(KEY.state, {});
  var mcAnswers = Array.isArray(saved.mcAnswers) && saved.mcAnswers.length === mc.length
    ? saved.mcAnswers : new Array(mc.length).fill(null);
  var saAnswers = Array.isArray(saved.saAnswers) && saved.saAnswers.length === sa.length
    ? saved.saAnswers : new Array(sa.length).fill("");
  var graded = false;

  function saveState() { lsSet(KEY.state, JSON.stringify({ mcAnswers: mcAnswers, saAnswers: saAnswers })); }

  function LETTERS(i) { return "ABCDEFGH".charAt(i); }
  function answerIndex(q) {
    if (typeof q.answer === "number") return q.answer;
    if (typeof q.answer === "string") return "ABCDEFGH".indexOf(q.answer.toUpperCase());
    if (typeof q.correct === "number") return q.correct;
    if (typeof q.correct === "string") return "ABCDEFGH".indexOf(q.correct.toUpperCase());
    return -1;
  }
  function options(q) {
    var o = q.options;
    if (Array.isArray(o)) return o;
    if (o && (o.en || o.es)) return isEs() ? (o.es || o.en) : o.en;
    return [];
  }

  // ---- lockouts ----------------------------------------------------------
  function lockRemaining(key) {
    var until = parseInt(lsGet(key) || "0", 10);
    if (!until || Date.now() >= until) return 0;
    return Math.ceil((until - Date.now()) / 60000);
  }
  function applyLock(key) { lsSet(key, String(Date.now() + lockMinutes() * 60000)); }

  // ---- rendering ---------------------------------------------------------
  function el(id) { return document.getElementById(id); }
  function host() {
    return el("questionsContainer") || el("mcqArea") || el("questions") || el("examArea");
  }

  function renderProgressGrid() {
    var grid = el("progressGrid");
    if (!grid) return;
    var titles = (U.unitTitles && U.unitTitles.en) || U.unitTitlesEn || [];
    var prefix = U.filePrefix || (U.nextHref || "").replace(/Unit\d+\.html$/, "") ||
                 location.pathname.split("/").pop().replace(/Unit\d+\.html$/, "");
    var html = "";
    for (var i = 1; i <= U.totalUnits; i++) {
      var cls = progress["unit" + i] ? "completed" : "";
      if (i === U.unit) cls += " active";
      var t = titles[i - 1] ? ' title="' + String(titles[i - 1]).replace(/"/g, "&quot;") + '"' : "";
      html += '<a href="' + prefix + "Unit" + i + '.html" class="' + cls.trim() + '"' + t + ">" + i + "</a>";
    }
    grid.innerHTML = html;
  }

  function renderGreeting() {
    var g = el("studentGreeting") || el("student-greeting");
    if (!g) return;
    var s = student();
    if (!s || !s.name) { g.textContent = ""; return; }
    var label = { cert: "Certificate", ad: "Associate of Divinity", mdiv: "M.Div.", thm: "Th.M.", mth: "Th.M." }[track()] || "Certificate";
    g.textContent = (isEs() ? "Bienvenido, " : "Welcome, ") + s.name + " — " + label;
  }

  function renderQuestions() {
    var h = host();
    if (!h) return;
    var reveal = revealAnswers(), out = "";

    if (mc.length) {
      out += "<h3>" + bi({ en: "Multiple Choice", es: "Opción Múltiple" }) + "</h3>";
      mc.forEach(function (q, i) {
        out += '<div class="question" data-mc="' + i + '">';
        out += '<p style="font-weight:bold;">' + (i + 1) + ". " + bi(q.stem || q.text || q.prompt) + "</p>";
        options(q).forEach(function (opt, j) {
          var cls = "option";
          /* Master's students are told nothing about correctness on a failed
             attempt -- not even which of their own answers were right, since
             that is still the answer key by elimination. They see only what
             they chose. Certificate students are corrected immediately. */
          if (mcAnswers[i] === j) cls += " selected";
          if (graded && reveal) {
            if (mcAnswers[i] === j) cls += (j === answerIndex(q) ? " correct" : " wrong");
            if (j === answerIndex(q)) cls += " correct";
          }
          out += '<button class="' + cls + '" data-mc="' + i + '" data-opt="' + j + '" type="button">' +
                 "<strong>" + LETTERS(j) + ".</strong> " + bi(opt) + "</button>";
        });
        if (graded && reveal && q.why) {
          out += '<div class="feedback">' + bi(q.why) + "</div>";
        }
        out += "</div>";
      });
    }

    if (sa.length) {
      out += "<h3>" + bi({ en: "Short Answer", es: "Respuesta Corta" }) + "</h3>";
      sa.forEach(function (q, i) {
        out += '<div class="question" data-sa="' + i + '">';
        out += '<p style="font-weight:bold;">' + (i + 1) + ". " + bi(q.prompt || q.stem) + "</p>";
        out += '<textarea data-sa="' + i + '" rows="4" style="width:100%;">' +
               String(saAnswers[i] || "").replace(/</g, "&lt;") + "</textarea>";
        if (graded && reveal && q.model) {
          out += '<div class="model-answer">' + bi(q.model) + "</div>";
        }
        out += "</div>";
      });
    }

    h.innerHTML = out;

    h.querySelectorAll("button.option").forEach(function (b) {
      b.addEventListener("click", function () {
        if (graded && unitPassed) return;
        if (mcPassed) return;                       // MC already banked
        mcAnswers[+b.dataset.mc] = +b.dataset.opt;
        saveState();
        renderQuestions();
      });
    });
    h.querySelectorAll("textarea[data-sa]").forEach(function (t) {
      t.addEventListener("input", function () { saAnswers[+t.dataset.sa] = t.value; saveState(); });
    });
  }

  // ---- grading -----------------------------------------------------------
  function gradeMC() {
    var c = 0;
    mc.forEach(function (q, i) { if (mcAnswers[i] === answerIndex(q)) c++; });
    return c;
  }
  function needMC() { return Math.ceil(mc.length * PASS_RATIO); }

  function normalise(s) {
    return " " + String(s || "").toLowerCase()
      .replace(/[^a-z0-9áéíóúñü\s]/g, " ").replace(/\s+/g, " ") + " ";
  }
  function gradeSA() {
    var c = 0;
    sa.forEach(function (q, i) {
      var ks = q.keywords;
      ks = Array.isArray(ks) ? ks : (ks ? (isEs() ? ks.es : ks.en) : []) || [];
      if (!ks.length) { c++; return; }
      var a = normalise(saAnswers[i]), hits = 0;
      ks.forEach(function (k) { if (a.indexOf(String(k).toLowerCase()) !== -1) hits++; });
      if (hits / ks.length >= SA_HIT_RATIO) c++;
    });
    return c;
  }
  function needSA() { return Math.ceil(sa.length * SA_PASS_RATIO); }

  function say(msg, colour) {
    var r = el("examResult") || el("examStatus");
    if (r) r.innerHTML = '<span style="color:' + colour + '">' + msg + "</span>";
  }

  function submit() {
    var full = lockRemaining(KEY.fullLock), saOnly = lockRemaining(KEY.saLock);
    if (full || saOnly) {
      var m = full || saOnly;
      say(bi({ en: "Locked. Review the lesson and try again in " + m + " minute(s).",
               es: "Bloqueado. Repase la lección e inténtelo de nuevo en " + m + " minuto(s)." }), "#8a1f1f");
      return;
    }

    graded = true;
    var mcOK = mcPassed || mc.length === 0 || gradeMC() >= needMC();
    var saOK = sa.length === 0 || gradeSA() >= needSA();

    if (mcOK && !mcPassed) { lsSet(KEY.mcPassed, "1"); mcPassed = true; }

    if (mcOK && saOK) {
      progress["unit" + U.unit] = true;
      lsSet(KEY.progress, JSON.stringify(progress));
      unitPassed = true;
      lsDel(KEY.saLock); lsDel(KEY.fullLock);
      var where = U.unit < U.totalUnits
        ? { en: "Unit " + (U.unit + 1), es: "Unidad " + (U.unit + 1) }
        : { en: "the Certificate", es: "el Certificado" };
      say(bi({ en: "&#10003; Passed. Continue to " + where.en + " above.",
               es: "&#10003; Aprobado. Continúe a " + where.es + " arriba." }), "#1f6b3b");
      var nb = el("nextUnitBtn"); if (nb) nb.disabled = false;
      renderProgressGrid();
    } else {
      // MC banked but short answer failed: lock only short answer
      applyLock(mcOK ? KEY.saLock : KEY.fullLock);
      var mins = lockMinutes();
      var detail = mc.length
        ? " (" + gradeMC() + "/" + mc.length + ", " + bi({ en: "need", es: "necesita" }) + " " + needMC() + ")"
        : "";
      say(bi({ en: "Not yet" + (mc.length ? " " + gradeMC() + "/" + mc.length + ", need " + needMC() : "") +
                   ". Review the lesson and try again in " + mins + " minute(s).",
               es: "Aún no" + (mc.length ? " " + gradeMC() + "/" + mc.length + ", necesita " + needMC() : "") +
                   ". Repase la lección e inténtelo de nuevo en " + mins + " minuto(s)." }), "#8a1f1f");
    }
    renderQuestions();
  }

  function reset() {
    mcAnswers = new Array(mc.length).fill(null);
    saAnswers = new Array(sa.length).fill("");
    graded = false;
    lsDel(KEY.state);
    renderQuestions();
    say("", "#000");
  }

  // ---- navigation --------------------------------------------------------
  function wireNav() {
    var p = el("prevUnitBtn"), n = el("nextUnitBtn");
    if (p) {
      if (U.prevHref) p.onclick = function () { location.href = U.prevHref; };
      else p.disabled = true;
    }
    if (n) {
      if (U.nextHref) n.onclick = function () { location.href = U.nextHref; };
      else n.disabled = true;
    }
  }

  // ---- boot --------------------------------------------------------------
  function boot() {
    renderProgressGrid();
    renderGreeting();
    wireNav();
    renderQuestions();

    if (unitPassed) {
      graded = true;
      var where = U.unit < U.totalUnits
        ? { en: "Unit " + (U.unit + 1), es: "Unidad " + (U.unit + 1) }
        : { en: "the Certificate", es: "el Certificado" };
      say(bi({ en: "&#10003; Unit already passed! Click " + where.en + " above.",
               es: "&#10003; Unidad ya aprobada. Haga clic en " + where.es + " arriba." }), "#1f6b3b");
      var sb = el("submitExamBtn"); if (sb) sb.disabled = true;
      var nb = el("nextUnitBtn"); if (nb) nb.disabled = false;
      renderQuestions();
    }

    var sb = el("submitExamBtn"); if (sb) sb.addEventListener("click", submit);
    var rb = el("resetExamBtn"); if (rb) rb.addEventListener("click", reset);

    // cts-lang.js toggles body classes; re-render so the active language shows
    document.addEventListener("cts:langchange", renderQuestions);
    var lt = el("langToggleBtn");
    if (lt) lt.addEventListener("click", function () { setTimeout(renderQuestions, 0); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.CTS_ENGINE = { submit: submit, reset: reset, render: renderQuestions, policy: {
    passRatio: PASS_RATIO, lockMasters: LOCK_MASTERS_MIN, lockCert: LOCK_CERT_MIN } };
})();
