/* ============================================================================
   Chapala Theological Seminary — unified exam engine
   ----------------------------------------------------------------------------
   One engine for every course. Reads a single per-unit object, window.CTS_UNIT,
   defined by data/<slug>/unitN.js, which is loaded immediately before this file.

   ASSESSMENT POLICY (seminary-wide, decided 2026-09-18, corrected 2026-09-24
   after Wayne's review of the beta restored two behaviours of the original
   per-course engines)
     Pass mark      90% of the multiple-choice questions, as a ratio, so a unit
                    may carry any number of questions.
     Short answer   Required on the master's tracks (M.Div., Th.M.) only, 90%
                    of the questions, each credited by keyword coverage. On the
                    Certificate and Associate tracks the short-answer prompts
                    are for the student's own reflection and do not count; the
                    model answers are shown when the unit is submitted.
     MC feedback    Every multiple-choice question scores the moment it is
                    clicked, on every track: the chosen option is marked right
                    or wrong and the correct letter is shown. A question, once
                    answered, stays answered for that attempt.
     Lockout        Master's tracks wait 15 minutes after a failed attempt;
                    certificate tracks wait 2 minutes. The next click after the
                    lock has expired starts a fresh attempt.
     Persistence    A passed multiple-choice section stays passed. A student who
                    passes MC but fails short answer retries only short answer.

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
  var PASS_RATIO      = 0.90;   // of multiple-choice questions, and of short answer where it counts
  var SA_HIT_MIN      = 3;      // keyword matches needed to credit one answer
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
  /* Where "continue" points: the next unit if the page has one, else the
     certificate. Read from nextHref, not unit+1 < totalUnits, because
     Counseling Situations numbers its units 0..12 and was told to continue
     to a Unit 13 that does not exist. */
  function nextWhere() {
    var m = /Unit(\d+)\.html$/.exec(U.nextHref || "");
    return m ? { en: "Unit " + m[1], es: "Unidad " + m[1] } : { en: "the Certificate", es: "el Certificado" };
  }
  // Short answer counts towards passing on the master's tracks only.
  function saCounts() { return isMasters(); }

  var progress   = jget(KEY.progress, {});
  var unitPassed = !!progress["unit" + U.unit];
  var mcPassed   = lsGet(KEY.mcPassed) === "1";

  /* Model answers for short-answer work: certificate tracks see them when
     they submit; master's tracks, whose short answer is graded, see them once
     the unit is passed. Multiple choice is corrected on click for everyone. */
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

  function saveState() {
    /* After a failed attempt the answers stay on screen for review but are
       not kept: the next visit starts a fresh attempt. Banked MC is kept. */
    var keepMC = !graded || mcPassed || unitPassed;
    lsSet(KEY.state, JSON.stringify({ mcAnswers: keepMC ? mcAnswers : new Array(mc.length).fill(null),
                                      saAnswers: saAnswers }));
  }

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
  /* firstEl() and U_() lived here.
   *
   * firstEl() took a list of ids and returned whichever existed, so a control
   * could be called any of five or eleven things. U_() built the per-unit
   * variants one course used (mcq_1, result_3). Together they let 451
   * independently-built pages keep their own markup, which was the right trade
   * while the pages were being consolidated.
   *
   * It stopped being right once one layout rendered all of them. A new page
   * could pick any accepted name -- or a sixth nobody had taught the engine --
   * and half-work, silently, until a student found it. src/lib/shell.ts now
   * renames every control at build time and each resolver below takes exactly
   * one id. A page that arrives with anything else has no control, and
   * tools/audit-controls-built.mjs says which page and which id.
   */

  /* One name each. src/lib/shell.ts renames the eleven and nine historical
     spellings at build time, in this same order, so the element that wins is
     the one these functions were already choosing. A unit with no short-answer
     section has no kwContainer, and that is not a defect -- 248 units are
     multiple-choice only. */
  function mcHost() { return el("questionsContainer"); }
  function saHost() { return el("kwContainer"); }
  /* One name. src/lib/shell.ts renames whichever of the eleven historical
     spellings a page used -- in this same order, so the element that wins is
     the one this function was already choosing. A page with no result area at
     all still gets one from ensureResult() below. */
  function resultEl() { return el("examResult"); }
  /* One name, no fallback. src/lib/shell.ts renames every page's submit and
     reset control at build time, so the five spellings this used to accept are
     gone from the built site and tools/audit-controls-built.mjs holds all 451
     pages to it.

     The label fallback is gone too, and deliberately. It found the button by
     matching "Submit" or "Enviar" in its text, which meant a translator could
     move a control by rewording it, and it quietly papered over a page that
     had no usable id -- the sort of help that hides the problem it solves.
     A page that reaches here without #submitExamBtn now has no submit control,
     the audit says so by name, and the suite fails. */
  function submitEl() { return el("submitExamBtn"); }
  function resetEl() { return el("resetExamBtn"); }
  /* One name. The layout renders #greeting on every page; src/lib/shell.ts
     strips the empty per-page placeholders that used to compete with it. */
  function greetEl() { return el("greeting"); }

  /* A page with nowhere to print the outcome gets one, created next to the
     submit control. Adding an element at runtime is preferable to rewriting
     twenty pages' markup. */
  function ensureResult() {
    var r = resultEl();
    if (r) return r;
    var host = submitEl(), d = document.createElement("div");
    d.id = "examResult";
    d.style.marginTop = "12px";
    d.style.fontWeight = "600";
    if (host && host.parentNode) host.parentNode.insertBefore(d, host.nextSibling);
    else (mcHost() || document.body).appendChild(d);
    return d;
  }

  /* The shared registration card the layout renders. Every course used to
     carry its own copy; the engine's readReg() still reads five spellings of
     "name" because of that history. This is the one card now, and it is shown
     only to a student who has not registered -- which is nearly always Unit 1
     of their first course, once, ever. */
  function renderRegister() {
    var card = el("cts-register");
    if (!card) return;
    var s = student();
    var done = !!(s && s.name);
    card.hidden = done;
    if (done) return;
    var t = el("regTrack");
    if (t) t.value = track() || "cert";
  }

  function wireRegister() {
    var card = el("cts-register");
    if (!card) return;
    var save = el("regSave");
    if (save) save.addEventListener("click", function () {
      if (!readReg()) {
        var n = el("regName");
        if (n) { n.focus(); n.setAttribute("aria-invalid", "true"); }
        return;
      }
      var t = el("regTrack");
      if (t && t.value) {
        lsSet("cts_track", t.value);
        var st = student();
        if (st) { st.track = t.value; lsSet("cts_student", JSON.stringify(st)); }
      }
      renderRegister();
      renderGreeting();
      renderQuestions();
    });
    var name = el("regName");
    if (name) name.addEventListener("input", function () { name.removeAttribute("aria-invalid"); });
  }

  /* renderProgressGrid() lived here. It painted a row of unit circles into
     whichever of four ids a course used. The sticky nav the layout now renders
     shows the same units with the same completed state, so the in-page grids
     were removed as furniture -- which left this function resolving nothing on
     all 451 pages. Dead code that still runs is worse than none: it reads as a
     feature. renderUnitPills() below is what marks the nav now. */
  function renderUnitPills() {
    var list = el("cts-units");
    if (!list) return;
    var links = list.querySelectorAll("a[data-unit]");
    for (var i = 0; i < links.length; i++) {
      var n = parseInt(links[i].getAttribute("data-unit"), 10);
      if (n !== U.unit && progress["unit" + n]) links[i].classList.add("done");
    }
  }

  function renderGreeting() {
    var g = greetEl();
    if (!g) return;
    var s = student();
    if (!s || !s.name) { g.textContent = ""; return; }
    var label = { cert: "Certificate", ad: "Associate of Divinity", mdiv: "M.Div.", thm: "Th.M.", mth: "Th.M." }[track()] || "Certificate";
    g.textContent = (isEs() ? "Bienvenido, " : "Welcome, ") + s.name + " — " + label;
  }

  function renderQuestions() {
    var hMc = mcHost(), hSa = saHost();
    var split = hSa && hSa !== hMc;          // page has its own short-answer area
    var h = hMc || hSa;
    if (!h) return;
    var reveal = revealAnswers(), out = "", outSa = "";

    if (mc.length) {
      if (!split) out += "<h3>" + bi({ en: "Multiple Choice", es: "Opción Múltiple" }) + "</h3>";
      mc.forEach(function (q, i) {
        out += '<div class="question" data-mc="' + i + '">';
        out += '<p style="font-weight:bold;">' + (i + 1) + ". " + bi(q.stem || q.text || q.prompt) + "</p>";
        /* Answered questions are corrected at once, as the original engines
           did: the chosen option is marked, the right one is marked, and a
           line says which. This is how the courses teach, on every track. */
        var chosen = mcAnswers[i], right = answerIndex(q), answered = chosen !== null && chosen !== undefined;
        options(q).forEach(function (opt, j) {
          var cls = "option";
          if (chosen === j) cls += " selected";
          if (answered) {
            if (j === right) cls += " correct";
            else if (j === chosen) cls += " wrong";
          }
          out += '<button class="' + cls + '" data-mc="' + i + '" data-opt="' + j + '" type="button">' +
                 "<strong>" + LETTERS(j) + ".</strong> " + bi(opt) + "</button>";
        });
        if (answered) {
          out += chosen === right
            ? '<div class="feedback-text correct">' + bi({ en: "&#10003; Correct!", es: "&#10003; ¡Correcto!" }) + "</div>"
            : '<div class="feedback-text incorrect">' + bi({ en: "&#10007; Incorrect. Correct answer: " + LETTERS(right),
                                                            es: "&#10007; Incorrecto. Respuesta correcta: " + LETTERS(right) }) + "</div>";
          if (q.why) out += '<div class="feedback">' + bi(q.why) + "</div>";
        }
        out += "</div>";
      });
    }

    if (sa.length) {
      var target = split ? "outSa" : "out";
      var block = "";
      if (!split) block += "<h3>" + bi({ en: "Short Answer", es: "Respuesta Corta" }) + "</h3>";
      sa.forEach(function (q, i) {
        block += '<div class="question" data-sa="' + i + '">';
        block += '<p style="font-weight:bold;">' + (i + 1) + ". " + bi(q.prompt || q.stem) + "</p>";
        block += '<textarea data-sa="' + i + '" rows="4" style="width:100%;">' +
                 String(saAnswers[i] || "").replace(/</g, "&lt;") + "</textarea>";
        if (graded && reveal && q.model) {
          block += '<div class="model-answer">' + bi(q.model) + "</div>";
        }
        block += "</div>";
      });
      if (target === "outSa") outSa = block; else out += block;
    }

    h.innerHTML = out;
    if (split) hSa.innerHTML = outSa;
    var scope = split ? [h, hSa] : [h];

    scope.forEach(function (node) {
    node.querySelectorAll("button.option").forEach(function (b) {
      b.addEventListener("click", function () {
        if (unitPassed) return;
        if (mcPassed) return;                       // MC already banked
        if (lockRemaining(KEY.fullLock)) return;    // still locked out
        /* The feedback shows the answer, so a question cannot be changed
           within an attempt. A click after a failed attempt's lock has
           expired starts a fresh one. */
        if (graded) { graded = false; mcAnswers = new Array(mc.length).fill(null); say("", "#000"); }
        var i = +b.dataset.mc;
        if (mcAnswers[i] !== null && mcAnswers[i] !== undefined) return;
        mcAnswers[i] = +b.dataset.opt;
        saveState();
        renderQuestions();
      });
    });
    node.querySelectorAll("textarea[data-sa]").forEach(function (t) {
      t.addEventListener("input", function () { saAnswers[+t.dataset.sa] = t.value; saveState(); });
    });
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
      /* Two things matter here, and both were wrong at first:

         1. A keyword must be normalised the same way as the answer. Matching a
            raw keyword against a stripped answer scored zero for every keyword
            carrying an apostrophe or accent -- which is most of them.
         2. An entry may be a STRING or an ARRAY OF SYNONYMS. Some courses
            write one concept per entry with several wordings for it; treating
            that array as a single string never matched anything, so those
            courses could not pass short answer at all. */
      ks.forEach(function (k) {
        var forms = Array.isArray(k) ? k : [k];
        for (var f = 0; f < forms.length; f++) {
          var needle = normalise(forms[f]).trim();
          if (needle && a.indexOf(needle) !== -1) { hits++; return; }
        }
      });
      /* A fixed number of matches, not a proportion of the list. Courses write
         keyword lists of very different lengths -- some are a handful of
         distinct concepts, others two dozen synonyms for one idea -- so a
         percentage rule would grade them on wildly different standards. Three
         matches is what the original engines required. */
      var need = Math.min(q.minHits || SA_HIT_MIN, ks.length);
      if (hits >= need) c++;
    });
    return c;
  }
  function needSA() { return Math.ceil(sa.length * PASS_RATIO); }

  function say(msg, colour) {
    var r = ensureResult();
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
    var saOK = !saCounts() || sa.length === 0 || gradeSA() >= needSA();

    if (mcOK && !mcPassed) { lsSet(KEY.mcPassed, "1"); mcPassed = true; }
    saveState();   // a failed attempt's MC answers are shown now but not kept

    if (mcOK && saOK) {
      progress["unit" + U.unit] = true;
      lsSet(KEY.progress, JSON.stringify(progress));
      unitPassed = true;
      lsDel(KEY.saLock); lsDel(KEY.fullLock);
      var where = nextWhere();
      say(bi({ en: "&#10003; Passed. Continue to " + where.en + " above.",
               es: "&#10003; Aprobado. Continúe a " + where.es + " arriba." }), "#1f6b3b");
      var nb = el("nextUnitBtn"); if (nb) nb.disabled = false;
    } else {
      // MC banked but short answer failed: lock only short answer
      applyLock(mcOK ? KEY.saLock : KEY.fullLock);
      var mins = lockMinutes();
      // Name the section that fell short, so the student knows what to retry.
      var part = !mcOK
        ? { en: " — multiple choice " + gradeMC() + "/" + mc.length + ", need " + needMC(),
            es: " — opción múltiple " + gradeMC() + "/" + mc.length + ", necesita " + needMC() }
        : { en: " — short answer " + gradeSA() + "/" + sa.length + ", need " + needSA(),
            es: " — respuesta corta " + gradeSA() + "/" + sa.length + ", necesita " + needSA() };
      say(bi({ en: "Not yet" + part.en + ". Review the lesson and try again in " + mins + " minute(s).",
               es: "Aún no" + part.es + ". Repase la lección e inténtelo de nuevo en " + mins + " minuto(s)." }), "#8a1f1f");
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
    renderUnitPills();
    renderRegister();
    wireRegister();
    renderGreeting();
    wireNav();
    ensureResult();
    renderQuestions();

    if (unitPassed) {
      graded = true;
      var where = nextWhere();
      say(bi({ en: "&#10003; Unit already passed! Click " + where.en + " above.",
               es: "&#10003; Unidad ya aprobada. Haga clic en " + where.es + " arriba." }), "#1f6b3b");
      var sbp = submitEl(); if (sbp) sbp.disabled = true;
      var nbp = el("nextUnitBtn"); if (nbp) nbp.disabled = false;
      renderQuestions();
    }

    /* A control that already calls the engine from an inline onclick must not
       also get a listener. 32 pages (CTSBible, CTSCS, CTSRE) carry
       onclick="grade()" / "submitUnit(n)" / "gradeSA()" -- all of which are
       this same submit() -- so binding here ran it twice per click. The second
       run saw the lockout the first had just applied and replaced the score
       with "Locked. Try again in N minutes", so a student who failed never
       learned how they did. wireLang() already skips inline-onclick controls
       for the same reason. */
    var sb = submitEl(); if (sb && !sb.getAttribute("onclick")) sb.addEventListener("click", submit);
    var rb = resetEl(); if (rb && !rb.getAttribute("onclick")) rb.addEventListener("click", reset);

    // cts-lang.js seeds the language at load; it does not handle clicks
    document.addEventListener("cts:langchange", renderQuestions);
    var g = document.querySelectorAll("button[data-lang], a[data-lang]");
    for (var gi = 0; gi < g.length; gi++) wireLang(g[gi], g[gi].getAttribute("data-lang"));
    for (var ti = 0; ti < LANG_TOGGLE_IDS.length; ti++) {
      var t = el(LANG_TOGGLE_IDS[ti]);
      if (t && !t.getAttribute("data-lang")) wireLang(t, null);      // null: flip
    }
    var byId = { en: ["langBtnEn", "btnEn", "btn-en"], es: ["langBtnEs", "btnEs", "btn-es"],
                 both: ["langBtnBoth", "btnBoth", "btn-both"] };
    for (var k in byId) if (byId.hasOwnProperty(k))
      for (var bi2 = 0; bi2 < byId[k].length; bi2++) {
        var n = el(byId[k][bi2]);
        if (n && !n.getAttribute("data-lang")) wireLang(n, k);
      }
    syncLangControls(langNow());
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.CTS_ENGINE = {
    submit: submit, reset: reset, render: renderQuestions,
    // exposed so tests drive the same controls the student does, rather than
    // assuming an element id that only some courses use
    controls: { submit: submitEl, reset: resetEl, result: resultEl, mc: mcHost, sa: saHost },
    policy: { passRatio: PASS_RATIO, lockMasters: LOCK_MASTERS_MIN, lockCert: LOCK_CERT_MIN }
  };

  /* ------------------------------------------------------------------ *
   * Compatibility layer
   *
   * Five courses wire their controls with inline onclick attributes that
   * call functions the old per-page engine defined: submitExam(), grade(),
   * setTrack('mdiv') and so on. Publishing those names here keeps those
   * pages working untouched. Editing twenty-odd attributes across their
   * unit pages would risk the lesson content around them for no gain.
   *
   * Only names that are not already taken are defined, so a page that still
   * has its own implementation keeps it.
   * ------------------------------------------------------------------ */
  function define(name, fn) { if (typeof window[name] !== "function") window[name] = fn; }

  define("submitExam", submit);
  define("submitUnit", submit);
  define("grade", submit);
  define("gradeSA", submit);
  define("gradeExam", submit);
  define("resetExam", reset);
  define("resetUnit", reset);
  define("resetMC", reset);
  define("resetMcq", reset);

  /* The page's own language controls come in two shapes, and both used to be
     wired by the per-page inline script that this engine replaced:

       a single toggle  -- #langToggleBtn on 246 pages -- which flips English and
                           Spanish AND swaps its own label between "Español" and
                           "English", so it always names the language it goes to
       a button group   -- [data-lang] on 129 pages -- English / Español / Both,
                           where the chosen button takes an .active class

     The engine published setLang() and toggleLang() as globals for the handful
     of pages carrying an inline onclick, and bound nothing on the rest: pressing
     Español did nothing at all on roughly 440 of the 451 unit pages. It also
     never implemented "both", which those three-button groups depend on. */
  var LANG_TOGGLE_IDS = ["langToggleBtn", "langToggle", "langBtn", "btnLang", "lang-toggle"];

  function langNow() {
    if (document.body.classList.contains("lang-both")) return "both";
    return isEs() ? "es" : "en";
  }

  function applyLang(lang) {
    lang = (lang === "es" || lang === "both") ? lang : "en";
    var b = document.body;
    b.classList.remove("lang-en", "lang-es", "lang-both");
    b.classList.add("lang-" + lang);
    b.setAttribute("data-lang", lang);
    /* Tell the document what language it is actually in. The page is served
       with <html lang="en"> whatever the reader picks, so until now a student
       reading in Spanish had every paragraph announced by a screen reader with
       English pronunciation, and search engines were told the same thing. Not
       set for "both", which is a display mode rather than a language and has
       no valid value here. */
    if (lang !== "both") document.documentElement.lang = lang;
    // "both" is a display mode rather than a language, so it must not overwrite
    // the student's remembered choice that cts-lang.js seeds every page from
    if (lang !== "both") { try { lsSet("cts_lang", lang); } catch (e) {} }
    syncLangControls(lang);
    renderQuestions();
  }

  function syncLangControls(lang) {
    var g = document.querySelectorAll("button[data-lang], a[data-lang]");
    for (var i = 0; i < g.length; i++) {
      var want = g[i].getAttribute("data-lang");
      if (g[i].classList) g[i].classList.toggle("active", want === lang);
      if (g[i].hasAttribute("aria-pressed")) g[i].setAttribute("aria-pressed", String(want === lang));
    }
    for (var j = 0; j < LANG_TOGGLE_IDS.length; j++) {
      var t = el(LANG_TOGGLE_IDS[j]);
      if (t && !t.getAttribute("data-lang")) t.textContent = lang === "es" ? "English" : "Espa\u00f1ol";
    }
  }

  function wireLang(node, lang) {
    // A page that already carries an inline onclick keeps it: binding a second
    // handler would switch twice and look exactly like nothing happening.
    if (!node || node.getAttribute("onclick")) return;
    node.addEventListener("click", function (e) {
      if (node.tagName === "A") e.preventDefault();
      applyLang(lang || (isEs() ? "en" : "es"));
    });
  }
  define("setLang", applyLang);
  define("toggleLang", function () { applyLang(isEs() ? "en" : "es"); });

  define("setTrack", function (t) {
    var map = { masters: "mdiv", master: "mdiv", assoc: "ad", associate: "ad", mth: "thm" };
    var v = map[t] || t;
    lsSet("cts_track", v);
    var st = student();
    if (st) { st.track = v; lsSet("cts_student", JSON.stringify(st)); }
    renderGreeting();
    renderQuestions();
  });

  define("goNext", function () { if (U.nextHref) location.href = U.nextHref; });

  /* Registration field ids differ per course; read whichever are present. */
  function readReg() {
    function val() {
      for (var i = 0; i < arguments.length; i++) {
        var e = el(arguments[i]);
        if (e && typeof e.value === "string" && e.value.trim()) return e.value.trim();
      }
      return "";
    }
    var name = val("regName", "reg-name", "studentName", "m-name", "student-name");
    if (!name) return false;
    var st = student() || {};
    st.name = name;
    st.email = val("regEmail", "reg-email", "studentEmail", "student-email") || st.email || "";
    st.country = val("regCountry", "reg-country", "studentCountry") || st.country || "";
    st.track = st.track || track();
    lsSet("cts_student", JSON.stringify(st));
    renderGreeting();
    return true;
  }
  define("saveRegistration", readReg);
  define("saveReg", readReg);
})();
