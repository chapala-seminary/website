/* The textbook pages: the language control, and on a test page the test.
 *
 * THE TEST (Dr. Cook, 3 Oct 2026)
 *   Twenty questions drawn at random from the book's forty on each attempt;
 *   eighteen right to pass; answers compared without regard to capitals,
 *   accents or punctuation. The questions are fill-in-the-blank only, drawn
 *   and marked by CTSFill (cts-fill.js), which is the unit engine's own
 *   fill-in grader, so a word that passes in a unit passes here.
 *
 *   The page carries the bank as window.CTS_TEXTBOOK_TEST:
 *     { slug, page, kind, title, draw, pass, questions: [{ prompt, answer, accept }] }
 *   kind is "textbook" or "reading": the required-reading tests (Genesis
 *   Intensive, World Religions; Dr. Cook's Add-ons, 4 Oct 2026) are the same
 *   test on the course's readings, and only the words differ.
 *
 * WHAT IS KEPT, in this browser (nothing reaches the seminary's record yet --
 * whether a textbook test counts toward a master's course is Dr. Cook's and
 * Robert's decision; see docs/textbooks.md):
 *   cts_textbook_<slug>_state    { draw: [question indices], fillAnswers,
 *                                 fillChecked, redrawAt }   the attempt in hand
 *   cts_textbook_<slug>_lock     epoch ms: locked after a failed attempt, for
 *                                the same wait as a unit exam on the student's
 *                                track (15 min master's, 2 min otherwise)
 *   cts_textbook_<slug>_passed   the date it was passed
 *   cts_textbooks_passed         every slug passed, for pages that list them
 *
 * A failed attempt is shown for review until the wait is over; the next
 * attempt draws a fresh twenty. Reload mid-attempt and the same twenty come
 * back with the answers so far.
 */
(function () {
  "use strict";

  var mem = {};
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return k in mem ? mem[k] : null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { mem[k] = String(v); } }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) { delete mem[k]; } }
  function jget(k, d) { try { return JSON.parse(lsGet(k)) || d; } catch (e) { return d; } }
  function el(id) { return document.getElementById(id); }
  function isEs() { return !!(document.body && document.body.classList.contains("lang-es")); }
  function bi(o) { if (window.CTSLanguage) return window.CTSLanguage.bi(o); return '<span class="lang-en">' + o.en + '</span><span class="lang-es">' + o.es + "</span>"; }
  function esc(v) { return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }

  // ---- language: the same control as a unit page, without the engine --------
  function applyLang(lang) {
    lang = (lang === "es" || lang === "both") ? lang : "en";
    var b = document.body;
    b.classList.remove("lang-en", "lang-es", "lang-both");
    b.classList.add("lang-" + lang);
    b.setAttribute("data-lang", lang);
    if (lang !== "both") { document.documentElement.lang = lang; lsSet("cts_lang", lang); }
    syncLang(lang);
  }
  function langNow() { return document.body.classList.contains("lang-both") ? "both" : isEs() ? "es" : "en"; }
  function syncLang(lang) {
    var g = document.querySelectorAll("button[data-lang]");
    for (var i = 0; i < g.length; i++) g[i].classList.toggle("active", g[i].getAttribute("data-lang") === lang);
  }
  function wireLang() {
    var g = document.querySelectorAll("button[data-lang]");
    for (var i = 0; i < g.length; i++) (function (n) {
      n.addEventListener("click", function () { applyLang(n.getAttribute("data-lang")); });
    })(g[i]);
    syncLang(langNow());
  }

  // ---- the book page: say whether its test is passed ------------------------
  function bookPage() {
    var slug = document.body.getAttribute("data-textbook");
    var note = el("tb-passed-note");
    if (!slug || !note) return;
    var when = lsGet("cts_textbook_" + slug + "_passed");
    if (!when) return;
    note.hidden = false;
    note.innerHTML = bi({ en: "&#10003; You passed this textbook's test on " + esc(when) + ".",
                          es: "&#10003; Aprobó el examen de este libro el " + esc(when) + "." });
  }

  // ---- the test page -----------------------------------------------------------
  function testPage() {
    var T = window.CTS_TEXTBOOK_TEST;
    if (!T || !window.CTSFill) return;
    var slug = T.slug, n = T.questions.length, reading = T.kind === "reading";
    var W = reading
      ? { passed: { en: "Required-reading test passed", es: "Examen de lecturas requeridas aprobado" }, review: { en: "Go back to the readings", es: "Vuelva a las lecturas" } }
      : { passed: { en: "Textbook test passed", es: "Examen del libro aprobado" }, review: { en: "Review the book", es: "Repase el libro" } };
    var KEY = { state: "cts_textbook_" + slug + "_state", lock: "cts_textbook_" + slug + "_lock", passed: "cts_textbook_" + slug + "_passed" };
    var LOCK_MASTERS_MIN = 15, LOCK_CERT_MIN = 2;
    function track() { var s = jget("cts_student", null); return String(lsGet("cts_track") || (s && s.track) || "cert").toLowerCase(); }
    function isMasters() { var t = track(); return t === "mdiv" || t === "thm" || t === "mth"; }
    function lockUntil() { return parseInt(lsGet(KEY.lock) || "0", 10) || 0; }
    function lockRemaining() { var u = lockUntil(); return u > Date.now() ? Math.ceil((u - Date.now()) / 60000) : 0; }
    function passedOn() { return lsGet(KEY.passed); }

    var state = jget(KEY.state, {});
    var practice = false;             // after a pass: another set, for practice, not recorded
    function save() { lsSet(KEY.state, JSON.stringify(state)); }

    /* A fresh draw: `draw` distinct indices into the bank, in random order.
       A reading test drawn by reading (T.perReading, 9 Oct 2026) takes that
       many from each reading's questions, so every attempt covers all five;
       the twenty are then shuffled together. */
    function shuffle(a) {
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    }
    function newDraw() {
      var idx = [], i;
      if (T.perReading) {
        var groups = {}, order = [];
        for (i = 0; i < n; i++) {
          var r = T.questions[i].reading;
          if (!groups[r]) { groups[r] = []; order.push(r); }
          groups[r].push(i);
        }
        order.forEach(function (r) { idx = idx.concat(shuffle(groups[r]).slice(0, T.perReading)); });
        return shuffle(idx).slice(0, Math.min(T.draw, n));
      }
      for (i = 0; i < n; i++) idx.push(i);
      return shuffle(idx).slice(0, Math.min(T.draw, n));
    }
    function drawOK(d) {
      if (!Array.isArray(d) || d.length !== Math.min(T.draw, n)) return false;
      var seen = {}, per = {};
      for (var i = 0; i < d.length; i++) {
        if (typeof d[i] !== "number" || d[i] < 0 || d[i] >= n || seen[d[i]]) return false;
        seen[d[i]] = 1;
        if (T.perReading) { var r = T.questions[d[i]].reading; per[r] = (per[r] || 0) + 1; if (per[r] > T.perReading) return false; }
      }
      return true;
    }
    function startAttempt() {
      state = { draw: newDraw(), fillAnswers: [], fillChecked: [] };
      save();
    }
    // the attempt in hand, or a new one: after a failed attempt's wait, or if nothing usable is saved
    if (!drawOK(state.draw) || (state.redrawAt && Date.now() >= state.redrawAt && !lockRemaining())) startAttempt();

    var host = el("tb-questions"), status = el("tb-status"), result = el("tb-result");
    var fill = null, unlockTimer = null;

    function mount() {
      var qs = state.draw.map(function (i) { return T.questions[i]; });
      fill = window.CTSFill.mount({
        host: host, questions: qs, state: state,
        counts: function () { return true; },
        lockedUntil: lockUntil,
        passed: function () { return !!passedOn() && !practice; },
        save: save
      });
      fill.render();
      renderStatus();
      scheduleUnlock();
    }

    /* What the seminary's record says about this test for this student
       (9 Oct 2026): not yet in force, or not needed for a master's
       completion the record held before it was. Only said; the test can
       still be taken, and a pass is kept as any pass is. */
    function standing() {
      if ("requiredFrom" in T && T.requiredFrom == null)
        return bi({ en: "This test is being introduced and is not yet required on any track.",
                    es: "Este examen se está introduciendo y aún no es obligatorio en ningún trayecto." });
      if (lsGet("cts_textbook_" + slug + "_exempt"))
        return bi({ en: "Your record already held this course as a master's completion before this test began to count, so it is not required of you for this course. You may still take it.",
                    es: "Su registro ya tenía este curso como finalización de maestría antes de que este examen empezara a contar, así que no se le exige para este curso. Aun así puede presentarlo." });
      return "";
    }
    function renderStatus() {
      var when = passedOn(), m = lockRemaining(), h = "";
      var st = standing();
      if (st && !when) h += '<p class="small muted" id="tb-standing">' + st + "</p>";
      if (when && !practice) {
        h += '<div class="cts-passed"><p class="cts-passed-title">&#10003; ' + bi(W.passed) + "</p>" +
             "<p>" + bi({ en: "Passed on " + esc(when) + ". It is saved in this browser.", es: "Aprobado el " + esc(when) + ". Quedó guardado en este navegador." }) + "</p>" +
             '<button type="button" class="btn" id="tb-practice">' + bi({ en: "Try another twenty, for practice", es: "Otras veinte, para practicar" }) + "</button></div>";
      } else if (m) {
        h += '<div class="exam-status fail">' + bi({ en: "Locked after a failed attempt. " + W.review.en + " and try again in " + m + " minute(s); the next attempt draws a fresh twenty.",
                                                     es: "Bloqueado tras un intento fallido. " + W.review.es + " e inténtelo de nuevo en " + m + " minuto(s); el siguiente intento toma otras veinte." }) + "</div>";
      }
      status.innerHTML = h;
      var pb = el("tb-practice");
      if (pb) pb.addEventListener("click", function () { practice = true; startAttempt(); say(""); mount(); });
      var sb = el("tb-submit"), rb = el("tb-reset");
      var off = !!(when && !practice) || !!m;
      if (sb) sb.disabled = off;
      if (rb) rb.disabled = off;
    }

    // once the wait is over, a new attempt with a new draw, without a reload
    function scheduleUnlock() {
      if (unlockTimer) clearTimeout(unlockTimer);
      var until = lockUntil();
      if (until > Date.now()) unlockTimer = setTimeout(function () { startAttempt(); say(""); mount(); }, until - Date.now() + 600);
    }

    /* After a pass, the course's other required test, if it is still to pass:
       a textbook test and a five-reading test are passed separately. */
    function stillToPass() {
      try {
        var left = (window.CTSRecord && window.CTSRecord.pendingTests && T.completion) ? window.CTSRecord.pendingTests(T.completion) : [];
        left = left.filter(function (t) { return t.slug !== slug; });
        if (!left.length) return "";
        var t = left[0], rd = t.kind === "reading";
        return " " + bi({ en: "The course also needs its " + (rd ? "required-reading test" : "textbook test") + ": ", es: "El curso también necesita su " + (rd ? "examen de lecturas requeridas" : "examen del libro de texto") + ": " })
          + '<a href="/' + esc(t.page) + 'Test.html">' + bi({ en: "take it", es: "preséntelo" }) + "</a>.";
      } catch (e) { return ""; }
    }
    function say(msg, colour) { result.innerHTML = msg ? '<span style="color:' + (colour || "#000") + '">' + msg + "</span>" : ""; }

    function submit() {
      if (lockRemaining()) { renderStatus(); return; }
      if (passedOn() && !practice) return;
      var r = fill.submit();
      var ok = r.score >= T.pass, completedNow = false;
      if (ok) {
        if (!practice) {
          var d = new Date(), when = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
          lsSet(KEY.passed, when);
          var all = jget("cts_textbooks_passed", []); if (all.indexOf(slug) === -1) { all.push(slug); lsSet("cts_textbooks_passed", JSON.stringify(all)); }
          lsDel(KEY.lock); delete state.redrawAt; save();
          /* On the master's tracks the course was waiting for this: record it
             now (cts-record.js) and send the record up (cts-sync.js). The
             single-page courses record themselves on their own page, so for
             them only the pass is sent. */
          try {
            var c = T.completion;
            if (window.CTSRecord && c && !c.single) completedNow = window.CTSRecord.course(c);
            if (window.CTS_SYNC && window.CTS_SYNC.sync) window.CTS_SYNC.sync();
          } catch (e) {}
        }
        say(bi({ en: "&#10003; Passed: " + r.score + " of " + r.n + " right (" + T.pass + " needed)." + (completedNow === "new" ? " That completes the course: " : ""),
                 es: "&#10003; Aprobado: " + r.score + " de " + r.n + " correctas (se necesitan " + T.pass + ")." + (completedNow === "new" ? " Con esto el curso queda completo: " : "") })
            + (completedNow === "new" && T.completion.page ? '<a href="/' + esc(T.completion.page) + '">' + bi({ en: "your certificate", es: "su certificado" }) + "</a>" : "")
            + stillToPass(), "#1f6b3b");
        practice = false;
      } else {
        var mins = isMasters() ? LOCK_MASTERS_MIN : LOCK_CERT_MIN;
        var until = Date.now() + mins * 60000;
        lsSet(KEY.lock, String(until));
        state.redrawAt = until; save();
        say(bi({ en: "Not yet: " + r.score + " of " + r.n + " right, " + T.pass + " needed. " + W.review.en + " and try again in " + mins + " minute(s).",
                 es: "Aún no: " + r.score + " de " + r.n + " correctas; se necesitan " + T.pass + ". " + W.review.es + " e inténtelo de nuevo en " + mins + " minuto(s)." }), "#8a1f1f");
      }
      fill.render();
      renderStatus();
      scheduleUnlock();
    }
    function reset() {
      if (lockRemaining() || (passedOn() && !practice)) return;
      fill.reset(); save(); say(""); fill.render();
    }

    el("tb-submit").addEventListener("click", submit);
    el("tb-reset").addEventListener("click", reset);
    mount();

    window.CTS_TEXTBOOK = { submit: submit, reset: reset, state: function () { return state; }, draw: function () { return state.draw.slice(); } };
  }

  function boot() {
    wireLang();
    bookPage();
    testPage();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
