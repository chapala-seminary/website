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
     Fill in the    Ten sentences a unit, each with one gap. Required on the
     blank          Associate, Th.M. and M.Div. tracks: 9 of 10 (Wayne's rule,
                    25 Sept 2026). An answer is right when, after normalise()
                    below, it is exactly the expected word or phrase, or one of
                    the listed alternatives, in the reader or source language; a leading
                    article ("the", "a", "la", "un"...) makes no difference. Like
                    multiple choice, each is marked the moment the student
                    presses Check (or Enter), with the right answer shown, and
                    stays answered for that attempt (Wayne, 26 Sept 2026). On
                    the Certificate of Ministry they are for the student's own
                    review and do not count.
                    A unit with no fill-ins is graded without them (every unit
                    has ten since 26 Sept 2026; the rule stays for new units).
     Short answer   Required on the Th.M. and M.Div. tracks, 90% of the
                    questions, each credited by keyword coverage (to be
                    replaced by AI grading). On the Certificate of Ministry and
                    the Associate of Divinity the short-answer prompts are for
                    the student's own reflection and do not count; the model
                    answers are shown on submit. (Associate was briefly
                    required to pass them, 24-25 Sept 2026.)
     MC feedback    Every multiple-choice question scores the moment it is
                    clicked, on every track: the chosen option is marked right
                    or wrong and the correct letter is shown. A question, once
                    answered, stays answered for that attempt.
     Lockout        Master's tracks wait 15 minutes after a failed attempt;
                    certificate tracks wait 2 minutes. The next click after the
                    lock has expired starts a fresh attempt. A page opened
                    during the wait says so and counts it down; it does not
                    look like an open exam that ignores clicks.
     Cannot pass   Once enough answers are wrong that the attempt cannot pass,
                    the page says so and points to Submit, which records the
                    attempt and starts the wait. Answered questions cannot be
                    changed, so without this a student who saw three wrong
                    and did not submit had no way forward (Wayne, 5 Oct 2026).
                    Reset on such an attempt is the same as Submit: it does
                    not skip the wait.
     Persistence    A passed multiple-choice section stays passed. A student who
                    passes MC but fails the fill-ins or short answer retries
                    only the written part (fill-ins and short answer together).
                    The unit counts as passed -- cts_<course>_progress -- only
                    when every part that counts on the student's track passes.

   STORAGE
   Keys are unchanged from the per-course engines, so existing students keep
   their progress:
     cts_student, cts_track, cts_done_codes   (site-wide, shared with other JS)
     cts_<course>_progress                    { unit1: true, ... }
     cts_<course>_u<N>_state                  saved answers, mid-exam
                                              (mcAnswers, saAnswers, fillAnswers,
                                              fillChecked)
     cts_<course>_u<N>_mc_passed
     cts_<course>_u<N>_sa_lock                epoch ms. Despite the name: the
                                              lock on the written part after MC
                                              has passed -- fill-ins, short
                                              answer, or both. Not renamed, so
                                              a lock set before stays in force.
     cts_<course>_u<N>_full_lock              epoch ms
   ========================================================================== */
(function () {
  "use strict";

  var U = window.CTS_UNIT;
  if (!U) { console.error("[cts] no CTS_UNIT for this page"); return; }

  // ---- policy ------------------------------------------------------------
  var PASS_RATIO      = 0.90;   // of multiple-choice questions, and of fill-ins and short answer where they count
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
  /* Associate of Divinity students study at certificate rigor (cts_track
     stays "cert", so their lockout is the certificate one) but record the
     degree goal as cts_goal = "assoc". Older course pages' setTrack wrote the
     track itself as "ad"; the Worker's records use "associate". */
  function isAssociate() {
    var s = student(), t = String(track()).toLowerCase();
    if (t === "ad" || t === "associate" || t === "assoc") return true;
    return String(lsGet("cts_goal") || (s && s.goal) || "").toLowerCase() === "assoc";
  }
  /* Short answer counts towards passing on the master's tracks only (Wayne's
     rule, 25 Sept 2026). Still keyword-graded for now. */
  function saCounts() { return isMasters(); }
  /* The ten fill-ins count on every track except the Certificate of Ministry:
     they are the Associate's step up from the Certificate, and the master's
     tracks do them as well as short answer. */
  function fillCounts() { return isAssociate() || isMasters(); }

  /* Passing the last unit is what completes a course -- not opening the
     certificate page (cts-record.js says why). Also run on load, so a course
     finished before this existed is recorded the next time any of its units
     is opened. Then sync straight away: a student who passes the last unit
     and closes the tab should not wait for the next poll. */
  function recordCourse() {
    if (!window.CTSRecord || !U.completion) return;
    if (window.CTSRecord.course(U.completion) === "new" && window.CTS_SYNC) {
      try { window.CTS_SYNC.sync(); } catch (e) {}
    }
  }

  var progress   = jget(KEY.progress, {});

  /* ---- the keys the old engines wrote, and the certificate pages read ----
   *
   * Each certificate page was written against its own course's engine, and
   * several of those engines kept progress under a different slug (1 Peter
   * was "1pet", Galatians "gal") or a different key shape ("re_unit3_passed",
   * "cts_cs_state"). The unified engine standardised on cts_<slug>_progress
   * and cts_<slug>_uN_mc_passed, which left two things behind: a student's
   * progress from before the change, and every certificate page that reads
   * the old keys -- Ruth and Esther sent a finished student back to Unit 1
   * for ever. So: on load, a unit passed under the old keys counts as passed;
   * on a pass, the old keys are written too. tools/verify-certificate-unlock
   * opens every certificate page against a fully-passed student to hold this.
   * Legacy slugs must also be known to cts-sync.js, which maps them back. */
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
  var legacy = LEGACY[U.course] || null;
  function genesisTrack() { var t = track(); return t === "mdiv" ? "mdiv" : (t === "thm" || t === "mth") ? "thm" : "cert"; }
  function legacyPassed(n) {
    if (!legacy) return false;
    if (legacy.slug) {
      if (lsGet("cts_" + legacy.slug + "_u" + n + "_mc_passed") === "1") return true;
      if (jget("cts_" + legacy.slug + "_progress", {})["unit" + n]) return true;
    }
    if (legacy.flag) { var v = lsGet(legacy.flag(n)); if (v === "1" || v === "true" || v === "passed") return true; }
    if (legacy.state) { var st = jget(legacy.state, {}); if (st[n] && st[n].passed) return true; }
    if (legacy.completion) {
      var ks = ["cts_genesis_u" + n + "_completion", "cts_genesis_u" + n + "_completion_cert",
                "cts_genesis_u" + n + "_completion_mdiv", "cts_genesis_u" + n + "_completion_thm"];
      for (var i = 0; i < ks.length; i++) if (jget(ks[i], null)) return true;
    }
    return false;
  }
  function writeLegacy(n) {
    if (!legacy) return;
    if (legacy.slug) {
      lsSet("cts_" + legacy.slug + "_u" + n + "_mc_passed", "1");
      var lp = jget("cts_" + legacy.slug + "_progress", {}); lp["unit" + n] = true;
      lsSet("cts_" + legacy.slug + "_progress", JSON.stringify(lp));
    }
    if (legacy.flag) lsSet(legacy.flag(n), legacy.value);
    if (legacy.state) { var st = jget(legacy.state, {}); st[n] = st[n] || {}; st[n].passed = true; lsSet(legacy.state, JSON.stringify(st)); }
    if (legacy.completion) {
      var c = { course: "genesis", unit: n, completedAt: new Date().toISOString(), track: genesisTrack(), version: 2 };
      lsSet("cts_genesis_u" + n + "_completion_" + c.track, JSON.stringify(c));
      lsSet("cts_genesis_u" + n + "_completion", JSON.stringify(c));
    }
  }
  // import: a unit passed under the old keys is passed
  if (legacy) {
    var imported = false;
    for (var ln = 0; ln <= U.totalUnits; ln++) {
      if (!progress["unit" + ln] && legacyPassed(ln)) { progress["unit" + ln] = true; imported = true; }
    }
    if (imported) lsSet(KEY.progress, JSON.stringify(progress));
    if (progress["unit" + U.unit] && lsGet(KEY.mcPassed) !== "1") lsSet(KEY.mcPassed, "1");
    // and the other way: progress restored from a student code arrives in the
    // new keys only, so give the certificate page its old ones
    for (var wn = 0; wn <= U.totalUnits; wn++) if (progress["unit" + wn] && !legacyPassed(wn)) writeLegacy(wn);
  }

  var unitPassed = !!progress["unit" + U.unit];
  var mcPassed   = lsGet(KEY.mcPassed) === "1";

  /* Model answers for short-answer work: the tracks where it does not count
     see them on submit; tracks whose short answer is graded see them once the
     unit is passed. Multiple choice is corrected on click for everyone. */
  function revealAnswers() { return !saCounts() || unitPassed; }
  /* And only under a question the student has really answered (Dr. Cook's
     beta pass, 30 Sept 2026): answering question 1 and pressing Check showed
     the model answers for the nine left blank -- and anyone can switch to the
     Certificate track, where short answers are shown on submit, and back. A
     real attempt is at least ten words and fifty characters (Dr. Cook, 2 Oct:
     six words was too easy to satisfy). This decides only what is shown; it
     grades nothing. */
  var SA_MIN_WORDS = 10, SA_MIN_CHARS = 50;
  function attempted(text) {
    var t = String(text || "").trim().replace(/\s+/g, " ");
    return t.length >= SA_MIN_CHARS && t.split(" ").length >= SA_MIN_WORDS;
  }


  // ---- language ----------------------------------------------------------
  // Language codes come from the unit and page, so another language does not
  // need another yes/no branch in the grader. "both" remains a legacy mode.
  function sourceLang() { return U.sourceLang || "en"; }
  function languages() {
    return Array.from(new Set(["en", "es", "fr", sourceLang()].concat(U.langs || [])));
  }
  function readerLang() {
    var b = document.body, codes = languages();
    if (b && b.dataset.pageLang) return b.dataset.pageLang;
    var l = (b && b.getAttribute("data-lang")) || document.documentElement.lang || "en";
    if (l === "both" || (b && b.classList.contains("lang-both"))) return "es";
    for (var i = 0; i < codes.length; i++)
      if (b && b.classList.contains("lang-" + codes[i])) return codes[i];
    return l.toLowerCase().split("-")[0];
  }
  function isLanguageMap(o) { return o && typeof o === "object" && !Array.isArray(o); }
  function pick(o) {
    if (o === null || o === undefined) return "";
    return isLanguageMap(o) ? (o[readerLang()] || o[sourceLang()] || o.en || "") : o;
  }
  function bi(o) {
    if (o === null || o === undefined) return "";
    if (!isLanguageMap(o)) return String(o);
    if (document.body && document.body.dataset.pageLang) {
      var reader = readerLang(), source = sourceLang(), target = o[reader];
      var actual = target == null || target === "" ? source : reader;
      var main = target || o[source] || o.en || "";
      return '<span class="cts-text-pair"><span class="cts-reading" lang="' + actual + '">' + main + '</span>' +
        (reader !== source && actual === reader && o[source]
          ? '<span class="cts-source" lang="' + source + '">' + o[source] + '</span>' : '') + '</span>';
    }
    // Fixture and older pages keep their original bilingual convention.
    var codes = U.sourceLang || !["en", "es"].includes(readerLang())
      ? [readerLang(), sourceLang()] : ["en", "es"];
    return Array.from(new Set(codes)).map(function (lang) {
      return '<span class="lang-' + lang + '" lang="' + lang + '">' +
        (o[lang] || o[sourceLang()] || o.en || "") + '</span>';
    }).join("");
  }

  // ---- answers -----------------------------------------------------------
  var mc = U.mc || [], sa = U.sa || [], fill = U.fill || [];
  var saved = jget(KEY.state, {});
  var mcAnswers = Array.isArray(saved.mcAnswers) && saved.mcAnswers.length === mc.length
    ? saved.mcAnswers : new Array(mc.length).fill(null);
  var saAnswers = Array.isArray(saved.saAnswers) && saved.saAnswers.length === sa.length
    ? saved.saAnswers : new Array(sa.length).fill("");
  var fillAnswers = Array.isArray(saved.fillAnswers) && saved.fillAnswers.length === fill.length
    ? saved.fillAnswers : new Array(fill.length).fill("");
  // a checked fill-in has been marked and shows its answer; it cannot change
  var fillChecked = Array.isArray(saved.fillChecked) && saved.fillChecked.length === fill.length
    ? saved.fillChecked : new Array(fill.length).fill(false);
  /* A failed fill-in section is shown for review until its lock ends, then
     the fill-ins start again empty -- their answers have been shown, so the
     old ones cannot simply be kept, and checked answers cannot be changed.
     Held in memory only: after a reload the fresh section is what is saved. */
  var fillReview = null;
  var graded = false;

  function saveState() {
    /* After a failed attempt the answers stay on screen for review but are
       not kept: the next visit starts a fresh attempt. Banked MC is kept. */
    var keepMC = !graded || mcPassed || unitPassed;
    lsSet(KEY.state, JSON.stringify({ mcAnswers: keepMC ? mcAnswers : new Array(mc.length).fill(null),
                                      saAnswers: saAnswers, fillAnswers: fillAnswers,
                                      fillChecked: fillChecked }));
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
    if (isLanguageMap(o)) return pick(o) || [];
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

  /* A passed unit says so plainly, with where to go next (Dr. Cook's beta
     pass, 30 Sept 2026: "it was not obvious where to confirm that the unit
     had actually been recorded"). Shown in the result after passing, and at
     the top of the page whenever a passed unit is opened again. */
  function passedCount() {
    var n = 0;
    for (var u = 1; u <= (U.totalUnits || 0); u++) if (progress["unit" + u]) n++;
    return n;
  }
  function passedPanel() {
    var total = U.totalUnits || 0, n = passedCount(), all = total && n >= total;
    var cert = (U.completion && U.completion.page) || null;
    var nextIsUnit = /Unit\d+\.html$/.test(U.nextHref || "");
    // every unit passed, but on a master's track the course waits for its textbook test
    var tbHold = all && window.CTSRecord && window.CTSRecord.textbookHolds && window.CTSRecord.textbookHolds(U.completion);
    // the same hold for a required-reading test (Genesis, World Religions), in its own words
    var tbReading = tbHold && U.completion.textbookKind === "reading";
    var go = tbHold ? { href: U.completion.textbookPage + "Test.html",
                        en: tbReading ? "Take the required-reading test" : "Take the textbook test",
                        es: tbReading ? "Presentar el examen de lecturas requeridas" : "Presentar el examen del libro" }
      : all && cert ? { href: cert, en: "Go to your course certificate", es: "Ir a su certificado del curso" }
      : nextIsUnit ? { href: U.nextHref, en: "Go to " + nextWhere().en, es: "Ir a la " + nextWhere().es }
      : cert ? { href: cert, en: "See your progress in this course", es: "Ver su progreso en este curso" } : null;
    var h = '<div class="cts-passed" role="status">' +
      '<p class="cts-passed-title">&#10003; ' + bi({ en: "Unit " + U.unit + " passed", es: "Unidad " + U.unit + " aprobada" }) + "</p>" +
      "<p>" + bi({ en: "It is saved to your progress" + (total ? ": " + n + " of " + total + " units of this course passed." : "."),
                   es: "Quedó guardada en su progreso" + (total ? ": " + n + " de " + total + " unidades de este curso aprobadas." : ".") }) + "</p>";
    if (tbHold) h += "<p>" + bi(tbReading
      ? { en: "On the M.Div. and Th.M. tracks the course is complete when the required-reading test is passed as well.",
          es: "En los trayectos M.Div. y Th.M. el curso se completa cuando también se aprueba el examen de lecturas requeridas." }
      : { en: "On the M.Div. and Th.M. tracks the course is complete when the textbook test is passed as well.",
          es: "En los trayectos M.Div. y Th.M. el curso se completa cuando también se aprueba el examen del libro de texto." }) + "</p>";
    if (go) h += '<a class="btn solid" href="' + attr(go.href) + '">' + bi({ en: go.en, es: go.es }) + " &rarr;</a>";
    if (cert && go && go.href !== cert)
      h += ' <a class="btn" href="' + attr(cert) + '">' + bi({ en: "Progress in this course", es: "Progreso en este curso" }) + "</a>";
    return h + "</div>";
  }
  function renderPassedBanner() {
    var g = greetEl(), b = el("cts-passed-banner");
    if (!unitPassed) { if (b) b.remove(); return; }
    if (!g || !g.parentNode) return;
    if (!b) { b = document.createElement("div"); b.id = "cts-passed-banner"; g.parentNode.insertBefore(b, g.nextSibling); }
    b.innerHTML = passedPanel();
  }

  function renderGreeting() {
    var g = greetEl();
    if (!g) return;
    var s = student();
    if (!s || !s.name) { g.textContent = ""; return; }
    var names = pick({
      en: { cert: "Certificate of Ministry", ad: "Associate of Divinity", mdiv: "M.Div.", thm: "Th.M.", mth: "Th.M." },
      es: { cert: "Certificado de Ministerio", ad: "Asociado en Divinidad", mdiv: "M.Div.", thm: "Th.M.", mth: "Th.M." }
    });
    var label = names[track()] || names.cert;
    g.textContent = pick({ en: "Welcome, ", es: "Bienvenido, " }) + s.name + " — " + label;
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
                 "<strong>" + LETTERS(j) + ".</strong> " + bi(document.body.dataset.pageLang && isLanguageMap(q.options) ? Object.fromEntries(Object.keys(q.options).map(function (code) {
                   return [code, q.options[code][j]];
                 })) : opt) + "</button>";
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

    /* Fill in the blank, between multiple choice and short answer. Always
       with its own heading: pages with their own short-answer area have a
       heading for that and none for this. */
    if (fill.length) {
      var counts = fillCounts();
      var locked = !!(lockRemaining(KEY.saLock) || lockRemaining(KEY.fullLock));
      if (fillReview && !locked) fillReview = null;          // the lock is over: start again
      out += "<h3>" + bi({ en: "Fill in the Blank", es: "Complete el espacio en blanco" }) + "</h3>";
      out += '<p class="small">' + (counts
        ? bi({ en: "Type the missing word or phrase and press Check (or Enter) to see at once whether it is right. You need " + needFill() + " of " + fill.length + " to pass.",
               es: "Escriba la palabra o frase que falta y pulse Comprobar (o Intro) para ver en seguida si es correcta. Necesita " + needFill() + " de " + fill.length + " para aprobar." })
        : bi({ en: "For your own review: these do not count on the Certificate track. Press Check (or Enter) to see whether your answer is right.",
               es: "Para su propio repaso: no cuentan en el trayecto de Certificado. Pulse Comprobar (o Intro) para ver si su respuesta es correcta." })) + "</p>";
      fill.forEach(function (q, i) {
        var num = i + 1;
        var given = fillReview ? fillReview[i] : fillAnswers[i];
        var done = !!fillReview || fillChecked[i] || unitPassed;
        out += '<div class="question" data-fill="' + i + '">';
        out += '<p style="font-weight:bold;">' + num + ". " + bi(q.prompt) + "</p>";
        out += '<input type="text" data-fill="' + i + '" autocomplete="off" autocapitalize="off" spellcheck="false"' +
               ' aria-label="' + pick({ en: "Answer ", es: "Respuesta " }) + num + '"' +
               ((done || locked) ? " disabled" : "") +
               ' style="width:100%;max-width:24em;" value="' + attr(given) + '" />';
        if (!done && !locked) {
          out += ' <button type="button" class="btn" data-fill-check="' + i + '">' +
                 bi({ en: "Check", es: "Comprobar" }) + "</button>";
        }
        if (done) {
          var right = unitFillRight(q, given);
          out += right
            ? '<div class="feedback-text correct">' + bi({ en: "&#10003; Correct!", es: "&#10003; ¡Correcto!" }) + "</div>"
            : '<div class="feedback-text incorrect">' +
              bi({ en: (String(given || "").trim() ? "&#10007; Incorrect. " : "") + "Answer: " + attr(q.answer.en),
                   es: (String(given || "").trim() ? "&#10007; Incorrecto. " : "") + "Respuesta: " + attr(q.answer.es) }) + "</div>";
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
          block += attempted(saAnswers[i])
            ? '<div class="model-answer">' + bi(q.model) + "</div>"
            : '<p class="small model-wait">' + bi({
                en: "Write your own answer — a few sentences — and check again to see the model answer.",
                es: "Escriba su propia respuesta — unas cuantas oraciones — y revise de nuevo para ver la respuesta modelo." }) + "</p>";
        }
        block += "</div>";
      });
      if (target === "outSa") outSa = block; else out += block;
    }

    h.innerHTML = '<div id="cts-exam-status" role="status"></div>' + out;
    if (split) hSa.innerHTML = outSa;
    var scope = split ? [h, hSa] : [h];

    scope.forEach(function (node) {
    node.querySelectorAll("button.option").forEach(function (b) {
      b.addEventListener("click", function () {
        if (unitPassed) return;
        if (mcPassed) return;                       // MC already banked
        if (lockRemaining(KEY.fullLock)) { sayLock(); return; }   // still locked out
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
    node.querySelectorAll("input[data-fill]").forEach(function (t) {
      t.addEventListener("input", function () {
        var i = +t.dataset.fill;
        if (fillReview || fillChecked[i] || unitPassed) return;   // answered: stays as it is
        fillAnswers[i] = t.value; saveState();
      });
      t.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.keyCode === 13) { e.preventDefault(); checkFill(+t.dataset.fill, t.value); }
      });
    });
    node.querySelectorAll("button[data-fill-check]").forEach(function (b) {
      b.addEventListener("click", function () {
        var i = +b.dataset.fillCheck, t = node.querySelector('input[data-fill="' + i + '"]');
        checkFill(i, t ? t.value : fillAnswers[i]);
      });
    });
    });
    renderStatus();
  }

  /* Mark one fill-in now, as a multiple-choice click is marked: right or
     wrong, with the answer shown, and fixed for the rest of the attempt. */
  function checkFill(i, value) {
    if (fillReview || fillChecked[i] || unitPassed) return;
    if (lockRemaining(KEY.saLock) || lockRemaining(KEY.fullLock)) { sayLock(); return; }
    if (!String(value || "").trim()) {
      var empty = document.querySelector('input[data-fill="' + i + '"]');
      if (empty) empty.focus();
      return;
    }
    fillAnswers[i] = value;
    fillChecked[i] = true;
    saveState();
    renderQuestions();
    // on to the next one still open
    for (var n = i + 1; n < fill.length; n++) {
      if (!fillChecked[n]) { var next = document.querySelector('input[data-fill="' + n + '"]'); if (next) next.focus(); break; }
    }
  }

  /* ---- what the student needs to know before answering more ------------
     Two states used to be silent (Wayne, 5 Oct 2026). A page opened during
     the wait after a failed attempt looked like an open exam whose answers
     ignored every click. And an attempt with too many wrong answers to pass
     could not be changed -- answered questions are fixed -- yet nothing said
     that Submit is what records it and starts the wait, so a student who saw
     three wrong and did not submit was stuck. Both are said at the top of
     the exam, and beside Submit. */
  function lockedMinutes() { return Math.max(lockRemaining(KEY.fullLock), lockRemaining(KEY.saLock)); }
  function wrongMC() {
    var c = 0;
    mc.forEach(function (q, i) { var a = mcAnswers[i]; if (a !== null && a !== undefined && a !== answerIndex(q)) c++; });
    return c;
  }
  function wrongFill() {
    var c = 0;
    fill.forEach(function (q, i) { if (fillChecked[i] && !unitFillRight(q, fillAnswers[i])) c++; });
    return c;
  }
  // The sections this attempt can no longer pass, or null. Short answer is
  // only known on submit, so it is not judged here.
  function cannotPass() {
    if (unitPassed || graded || lockedMinutes()) return null;
    var en = [], es = [];
    if (!mcPassed && mc.length && wrongMC() > mc.length - needMC()) {
      en.push("multiple choice: " + wrongMC() + " wrong, and " + needMC() + " of " + mc.length + " are needed");
      es.push("opción múltiple: " + wrongMC() + " incorrectas, y se necesitan " + needMC() + " de " + mc.length);
    }
    if (fillCounts() && !fillReview && fill.length && wrongFill() > fill.length - needFill()) {
      en.push("fill in the blank: " + wrongFill() + " wrong, and " + needFill() + " of " + fill.length + " are needed");
      es.push("complete el espacio: " + wrongFill() + " incorrectas, y se necesitan " + needFill() + " de " + fill.length);
    }
    return en.length ? { en: en.join("; "), es: es.join("; ") } : null;
  }
  function lockMessage() {
    var m = lockedMinutes();
    if (!m) return null;
    return lockRemaining(KEY.fullLock)
      ? { en: "Your last attempt did not pass. The exam opens again in " + m + " minute(s), with every question empty. Review the lesson in the meantime.",
          es: "Su último intento no aprobó. El examen se abre de nuevo en " + m + " minuto(s), con todas las preguntas vacías. Mientras tanto, repase la lección." }
      : { en: "Your last attempt did not pass. Your multiple choice is passed and kept; the fill-in and short-answer part opens again in " + m + " minute(s). Review the lesson in the meantime.",
          es: "Su último intento no aprobó. Su opción múltiple está aprobada y se conserva; la parte de completar y respuesta corta se abre de nuevo en " + m + " minuto(s). Mientras tanto, repase la lección." };
  }
  function cannotPassMessage(c) {
    return { en: "This attempt cannot pass now (" + c.en + "). You may finish the questions for practice. Then press Submit to record the attempt: after a " + lockMinutes() + "-minute wait the exam opens again, empty, and you can retake it.",
             es: "Este intento ya no puede aprobar (" + c.es + "). Puede terminar las preguntas como práctica. Luego pulse Enviar para registrar el intento: después de una espera de " + lockMinutes() + " minuto(s) el examen se abre de nuevo, vacío, y puede volver a presentarlo." };
  }
  function notice(msg) {
    return '<p class="cts-exam-status" style="margin:0 0 16px;padding:12px 16px;border-left:4px solid #8a1f1f;background:rgba(138,31,31,.06);color:#8a1f1f;font-weight:600;">' + bi(msg) + "</p>";
  }
  // Fills the notice at the top of the exam, and the line beside Submit
  // unless that holds a graded attempt's result.
  function renderStatus() {
    var top = el("cts-exam-status");
    if (unitPassed) { if (top) top.innerHTML = ""; return; }
    var lockMsg = lockMessage(), c = cannotPass();
    var msg = lockMsg || (c && cannotPassMessage(c));
    if (top) top.innerHTML = msg ? notice(msg) : "";
    if (graded) return;
    if (msg) say(bi(msg), "#8a1f1f");
    else { var r = resultEl(); if (r && r.textContent) say("", "#000"); }
  }
  function sayLock() { var m = lockMessage(); if (m) say(bi(m), "#8a1f1f"); }

  // Once a lock ends, redraw, so disabled fill-ins open again without a reload.
  var unlockTimer = null;
  function redrawAtUnlock() {
    var until = Math.max(parseInt(lsGet(KEY.saLock) || "0", 10), parseInt(lsGet(KEY.fullLock) || "0", 10));
    if (unlockTimer) clearTimeout(unlockTimer);
    if (until > Date.now()) unlockTimer = setTimeout(renderQuestions, until - Date.now() + 250);
  }

  // ---- grading -----------------------------------------------------------
  function gradeMC() {
    var c = 0;
    mc.forEach(function (q, i) { if (mcAnswers[i] === answerIndex(q)) c++; });
    return c;
  }
  function needMC() { return Math.ceil(mc.length * PASS_RATIO); }

  function normalise(s) {
    return " " + String(s || "").toLowerCase().normalize("NFC")
      .replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ") + " ";
  }
  function keywordPass(ks, answer, minHits) {
    if (!ks.length) return true; // unchanged for questions with no keywords
    var a = normalise(answer), hits = 0;
    ks.forEach(function (k) {
      var forms = Array.isArray(k) ? k : [k];
      if (forms.some(function (form) {
        var needle = normalise(form).trim();
        // Existing keywords include stems ("apôtr" matches "apôtres").
        return needle && a.indexOf(needle) !== -1;
      })) hits++;
    });
    return hits >= Math.min(minHits || SA_HIT_MIN, ks.length);
  }
  function shortAnswerRight(q, answer) {
    var ks = q.keywords;
    if (!ks || Array.isArray(ks)) return keywordPass(ks || [], answer, q.minHits);
    var lists = Array.from(new Set([readerLang(), sourceLang()]))
      .map(function (lang) { return ks[lang]; }).filter(Array.isArray);
    // Missing translation keys must not make a required answer a free pass.
    return lists.length > 0 && lists.some(function (list) {
      return keywordPass(list, answer, q.minHits);
    });
  }
  function gradeSA() {
    return sa.filter(function (q, i) { return shortAnswerRight(q, saAnswers[i]); }).length;
  }
  function needSA() { return Math.ceil(sa.length * PASS_RATIO); }

  /* A fill-in is right when the student's words, normalised, are exactly the
     answer or one of the accepted alternatives in the requested languages. Exact, not "contains": typing
     every word in the lesson must not score. */
  function fillRight(q, given, codes) {
    var a = bare(given);
    if (!a) return false;
    var acc = q.accept || {};
    codes = codes || ["en", "es"]; // compatibility for the standalone widget
    var forms = [];
    codes.forEach(function (lang) {
      forms = forms.concat(q.answer && q.answer[lang], acc[lang] || []);
    });
    for (var f = 0; f < forms.length; f++) {
      if (forms[f] && bare(forms[f]) === a) return true;
    }
    return false;
  }
  function unitFillRight(q, given) {
    // Old pages accepted both EN/ES. Language pages declare sourceLang.
    var codes = !U.sourceLang && ["en", "es"].includes(readerLang())
      ? ["en", "es"] : Array.from(new Set([readerLang(), sourceLang()]));
    return fillRight(q, given, codes);
  }
  /* The words compared, less one leading article on either side: a student
     who writes "a hypocrite" or "la gracia" for "hypocrite" or "gracia" has
     the right answer, and the gap often cannot show which article belongs. */
  /* Accents do not decide a fill-in (Dr. Cook's beta pass, 30 Sept 2026):
     "geografia" is "geografía", "inspiracion" is "inspiración" -- on a phone
     the accent is a long-press away. Both sides are folded the same way, so a
     misspelling still fails ("certexa" is not "certeza"). The tilde of ñ is
     kept: "año" and "ano" are different words. */
  function fold(s) {
    s = String(s || "").toLowerCase();
    if (!s.normalize) return s;
    return s.normalize("NFD").replace(/n\u0303/g, "\u00f1").replace(/(\p{Script=Latin})[\u0300-\u036f]+/gu, "$1").normalize("NFC");
  }
  function bare(s) {
    return normalise(fold(s)).trim().replace(/^(?:a|an|the|el|la|los|las|lo|un|una|unos|unas|le|les|l|une|des) (?=\S)/, "");
  }
  function gradeFill() {
    var c = 0;
    fill.forEach(function (q, i) { if (unitFillRight(q, fillAnswers[i])) c++; });
    return c;
  }
  function needFill() { return Math.ceil(fill.length * PASS_RATIO); }
  function attr(v) {
    return String(v || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }

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
    // submitting marks every fill-in, answered or not, as Check would
    for (var fi = 0; fi < fill.length; fi++) fillChecked[fi] = true;
    var mcOK = mcPassed || mc.length === 0 || gradeMC() >= needMC();
    var fillOK = !fillCounts() || fill.length === 0 || gradeFill() >= needFill();
    var fillScore = gradeFill();
    if (!fillOK) {
      // shown for review during the lock; the next attempt starts empty
      fillReview = fillAnswers.slice();
      fillAnswers = new Array(fill.length).fill("");
      fillChecked = new Array(fill.length).fill(false);
    }
    var saOK = !saCounts() || sa.length === 0 || gradeSA() >= needSA();

    if (mcOK && !mcPassed) { lsSet(KEY.mcPassed, "1"); mcPassed = true; }
    saveState();   // a failed attempt's MC answers are shown now but not kept

    if (mcOK && fillOK && saOK) {
      progress["unit" + U.unit] = true;
      lsSet(KEY.progress, JSON.stringify(progress));
      writeLegacy(U.unit);
      unitPassed = true;
      lsDel(KEY.saLock); lsDel(KEY.fullLock);
      recordCourse();
      var r = ensureResult();
      if (r) r.innerHTML = passedPanel();
      renderPassedBanner();
      var nb = el("nextUnitBtn"); if (nb) nb.disabled = false;
    } else {
      // MC banked but the written part failed: lock only the written part
      applyLock(mcOK ? KEY.saLock : KEY.fullLock);
      var mins = lockMinutes();
      // Name every section that fell short, so the student knows what to retry.
      var en = [], es = [];
      if (!mcOK) { en.push("multiple choice " + gradeMC() + "/" + mc.length + ", need " + needMC());
                   es.push("opción múltiple " + gradeMC() + "/" + mc.length + ", necesita " + needMC()); }
      if (!fillOK) { en.push("fill in the blank " + fillScore + "/" + fill.length + ", need " + needFill());
                     es.push("complete el espacio " + fillScore + "/" + fill.length + ", necesita " + needFill()); }
      if (!saOK) { en.push("short answer " + gradeSA() + "/" + sa.length + ", need " + needSA());
                   es.push("respuesta corta " + gradeSA() + "/" + sa.length + ", necesita " + needSA()); }
      var part = { en: " — " + en.join("; "), es: " — " + es.join("; ") };
      say(bi({ en: "Not yet" + part.en + ". Review the lesson and try again in " + mins + " minute(s).",
               es: "Aún no" + part.es + ". Repase la lección e inténtelo de nuevo en " + mins + " minuto(s)." }), "#8a1f1f");
      redrawAtUnlock();
    }
    renderQuestions();
  }

  function reset() {
    /* Reset used to clear a failed attempt without the wait: answer, see too
       many wrong, reset, go again. During the wait it now just says so, and
       on an attempt that cannot pass it does what Submit does. */
    if (unitPassed) return;
    if (lockedMinutes()) { renderStatus(); sayLock(); return; }
    if (cannotPass()) { submit(); return; }
    mcAnswers = new Array(mc.length).fill(null);
    saAnswers = new Array(sa.length).fill("");
    fillAnswers = new Array(fill.length).fill("");
    fillChecked = new Array(fill.length).fill(false);
    fillReview = null;
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
      if (U.nextHref) n.onclick = function () { if (mayGoOn()) location.href = U.nextHref; };
      else n.disabled = true;
    }
    /* Next goes on only once this unit is passed, as it did on the old site
       (Dr. Cook's audit, 30 Sept 2026; Robert's decision, 1 Oct). Like the
       old site, this is the button only: the unit numbers and a typed
       address still open any unit, and the certificate needs every unit. */
    var nx = el("cts-next");
    if (nx) nx.addEventListener("click", function (e) { if (!mayGoOn()) e.preventDefault(); });
  }
  // tester mode (cts-curriculum.js), for the twelve hours it lasts
  function testMode() {
    return lsGet("cts_test_mode") === "1" && Date.now() - (+lsGet("cts_test_mode_at") || 0) < 12 * 3600 * 1000;
  }
  function mayGoOn() {
    if (unitPassed || testMode()) return true;
    alert(pick({ en: "Please pass Unit " + U.unit + " first.",
                 es: "Por favor apruebe la Unidad " + U.unit + " primero." }));
    return false;
  }

  // ---- boot --------------------------------------------------------------
  /* Four courses kept a track picker from their own engines: radio buttons
     (New Testament, Biblical Languages), a drop-down (Ruth & Esther,
     Evangelistic Preaching). None offered the Associate, and none was
     connected to grading -- Ruth & Esther's stored the track as "undefined".
     The track is chosen once, at registration, and the greeting names it, so
     they are hidden (Dr. Cook's audit, 4 Oct 2026). CTSBible's buttons work
     and include the Associate; they stay. */
  function hideOldTrackPickers() {
    function hide(n) { if (n) n.style.display = "none"; }
    hide(el("track-select") && el("track-select").querySelector("input[name=track]") ? el("track-select") : null);
    var r = document.querySelector("input[name=ctsTrack]");
    if (r) for (var p = r.parentNode; p && p !== document.body; p = p.parentNode)
      if (p.className === "track-bar") { hide(p); break; }
    var s = el("trackSel"); if (s) hide(s.parentNode);
    var t = document.querySelector("select#track[onchange]"); if (t) hide(t.parentNode);
  }

  function boot() {
    hideOldTrackPickers();
    renderUnitPills();
    renderRegister();
    wireRegister();
    renderGreeting();
    renderPassedBanner();
    wireNav();
    ensureResult();
    renderQuestions();
    redrawAtUnlock();
    // the countdown in the notice, without redrawing answers being typed
    setInterval(function () { if (lockedMinutes()) renderStatus(); }, 20000);
    recordCourse();   // a course finished before completion moved here

    if (unitPassed) {
      graded = true;
      var rp = ensureResult();
      if (rp) rp.innerHTML = passedPanel();
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
    // the grader itself, so tools/add-fill-ins.mjs's promise -- every drafted
    // answer passes -- can be checked against the page and not a copy
    fillRight: unitFillRight, shortAnswerRight: shortAnswerRight, normalise: normalise,
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
    return readerLang();
  }

  function applyLang(lang) {
    if (document.body.dataset.pageLang && window.CTSLanguage) {
      if (lang !== readerLang() || lang === "both") window.CTSLanguage.choose(lang);
      else { syncLangControls(lang); renderGreeting(); renderPassedBanner(); renderQuestions(); }
      return;
    }
    lang = languages().includes(lang) || lang === "both" ? lang : sourceLang();
    var b = document.body;
    languages().concat(["both"]).forEach(function (code) { b.classList.remove("lang-" + code); });
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
    renderGreeting();          // "Welcome, … — Certificate" stayed English (beta pass, 30 Sept)
    renderPassedBanner();
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
      applyLang(lang || ((readerLang() === "es") ? "en" : "es"));
    });
  }
  define("setLang", applyLang);
  define("toggleLang", function () { applyLang((readerLang() === "es") ? "en" : "es"); });

  define("setTrack", function (t) {
    var map = { masters: "mdiv", master: "mdiv", assoc: "ad", associate: "ad", mth: "thm" };
    var v = map[t] || t;
    // Ruth & Esther's old picker called setTrack() with no argument, which
    // stored the track as "undefined"
    if (!v) return;
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
