/* Fill-in-the-blank questions for the courses that are not on the unit engine
 * (Counseling, Narrative Preaching, WiseSpeak Preaching, Ethics). Each of
 * those pages has its own test code; this draws and marks the fill-ins inside
 * a unit the way cts-engine.js does for every other course, and the page's own
 * submit decides what a pass is and whether to lock.
 *
 *   var f = CTSFill.mount({
 *     host:        the element to draw into,
 *     questions:   the unit's ten { prompt, answer, accept? } (from
 *                  public/assets/js/fill/<course>.js, CTS_FILL_DATA),
 *     state:       an object the page saves; fillAnswers and fillChecked
 *                  are kept on it,
 *     counts:      function () -> do the fill-ins count for this student?
 *                  (Associate, Th.M., M.Div.: yes; Certificate: no),
 *     lockedUntil: function () -> epoch ms the unit's written part is
 *                  locked until, or 0,
 *     passed:      function () -> has the unit been passed?
 *     save:        function () -> save the page's state
 *   });
 *   f.render();             draw (again)
 *   f.submit()  -> { ok, score, need, n, counted }   mark all; on a counted
 *                  failure the answers are shown for review until the lock
 *                  ends, and the next attempt starts empty -- the page must
 *                  set its lock
 *   f.reset();              clear the answers
 *
 * normalise(), bare() and fillRight() are cts-engine.js's own, word for word:
 * tools/verify-fill-single.mjs fails if they drift apart.
 */
(function () {
  "use strict";
  var PASS_RATIO = 0.9;

  function normalise(s) {
    return " " + String(s || "").toLowerCase()
      .replace(/[^a-z0-9áéíóúñü\s]/g, " ").replace(/\s+/g, " ") + " ";
  }

  /* A fill-in is right when the student's words, normalised, are exactly the
     answer or one of the accepted alternatives -- in either language, since a
     student reading both may answer in either. Exact, not "contains": typing
     every word in the lesson must not score. */
  function fillRight(q, given) {
    var a = bare(given);
    if (!a) return false;
    var acc = q.accept || {};
    var forms = [q.answer && q.answer.en, q.answer && q.answer.es]
      .concat(acc.en || [], acc.es || []);
    for (var f = 0; f < forms.length; f++) {
      if (forms[f] && bare(forms[f]) === a) return true;
    }
    return false;
  }
  /* The words compared, less one leading article on either side: a student
     who writes "a hypocrite" or "la gracia" for "hypocrite" or "gracia" has
     the right answer, and the gap often cannot show which article belongs. */
  function bare(s) {
    return normalise(s).trim().replace(/^(?:a|an|the|el|la|los|las|lo|un|una|unos|unas) (?=\S)/, "");
  }

  function need(n) { return Math.ceil(n * PASS_RATIO); }
  function esc(v) {
    return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }
  // both languages, always: each page shows one and hides the other with CSS
  function bi(o) { return '<span class="lang-en">' + o.en + '</span><span class="lang-es">' + o.es + "</span>"; }
  function isEs() {
    var b = document.body;
    return !!b && (b.classList.contains("spanish") || b.classList.contains("lang-es"));
  }

  // one small stylesheet of its own: the four pages style questions differently
  function style() {
    if (document.getElementById("cts-fill-style")) return;
    var s = document.createElement("style");
    s.id = "cts-fill-style";
    s.textContent =
      ".cts-fill{margin:1.2em 0}" +
      ".cts-fill h3{margin:.4em 0}" +
      ".cts-fill-note{font-size:.92em;color:#444}" +
      ".cts-fill-q{margin:.9em 0}" +
      ".cts-fill-q p{font-weight:bold;margin:.2em 0 .4em}" +
      ".cts-fill-q input{width:100%;max-width:24em;box-sizing:border-box;padding:.35em;font:inherit}" +
      ".cts-fill-q button{margin:.3em 0 0 .3em;padding:.35em .9em;font:inherit;cursor:pointer}" +
      ".cts-fill-ok{color:#1f6b3b;font-weight:bold;margin-top:.3em}" +
      ".cts-fill-bad{color:#8a1f1f;font-weight:bold;margin-top:.3em}";
    (document.head || document.documentElement).appendChild(s);
  }

  function mount(o) {
    var qs = o.questions || [], n = qs.length, st = o.state;
    if (!Array.isArray(st.fillAnswers) || st.fillAnswers.length !== n) st.fillAnswers = new Array(n).fill("");
    // a checked fill-in has been marked and shows its answer; it cannot change
    if (!Array.isArray(st.fillChecked) || st.fillChecked.length !== n) st.fillChecked = new Array(n).fill(false);
    /* A failed section is shown for review until its lock ends, then starts
       again empty. Held in memory only: after a reload the fresh section is
       what is saved. */
    var review = null, timer = null;
    function locked() { return (o.lockedUntil() || 0) > Date.now(); }

    function render() {
      if (!n || !o.host) return;
      style();
      var lock = locked(), passed = o.passed(), counts = o.counts();
      if (review && !lock) review = null;          // the lock is over: start again
      var out = '<div class="cts-fill"><h3>' + bi({ en: "Fill in the Blank", es: "Complete el espacio en blanco" }) + "</h3>";
      out += '<p class="cts-fill-note">' + (counts
        ? bi({ en: "Type the missing word or phrase and press Check (or Enter) to see at once whether it is right. You need " + need(n) + " of " + n + " to pass.",
               es: "Escriba la palabra o frase que falta y pulse Comprobar (o Intro) para ver en seguida si es correcta. Necesita " + need(n) + " de " + n + " para aprobar." })
        : bi({ en: "For your own review: these do not count on the Certificate track. Press Check (or Enter) to see whether your answer is right.",
               es: "Para su propio repaso: no cuentan en el trayecto de Certificado. Pulse Comprobar (o Intro) para ver si su respuesta es correcta." })) + "</p>";
      qs.forEach(function (q, i) {
        var given = review ? review[i] : st.fillAnswers[i];
        var done = !!review || st.fillChecked[i] || passed;
        out += '<div class="cts-fill-q" data-cts-fill="' + i + '"><p>' + bi({ en: (i + 1) + ". " + esc(q.prompt.en), es: (i + 1) + ". " + esc(q.prompt.es) }) + "</p>";
        out += '<input type="text" data-cts-fill="' + i + '" autocomplete="off" autocapitalize="off" spellcheck="false"' +
               ' aria-label="' + (isEs() ? "Respuesta " : "Answer ") + (i + 1) + '"' +
               ((done || lock) ? " disabled" : "") + ' value="' + esc(given) + '" />';
        if (!done && !lock) out += '<button type="button" data-cts-fill-check="' + i + '">' + bi({ en: "Check", es: "Comprobar" }) + "</button>";
        if (done) {
          var some = String(given || "").trim();
          out += fillRight(q, given)
            ? '<div class="cts-fill-ok">' + bi({ en: "&#10003; Correct!", es: "&#10003; ¡Correcto!" }) + "</div>"
            : '<div class="cts-fill-bad">' + bi({ en: (some ? "&#10007; Incorrect. " : "") + "Answer: " + esc(q.answer.en),
                                                 es: (some ? "&#10007; Incorrecto. " : "") + "Respuesta: " + esc(q.answer.es) }) + "</div>";
        }
        out += "</div>";
      });
      o.host.innerHTML = out + "</div>";

      o.host.querySelectorAll("input[data-cts-fill]").forEach(function (t) {
        t.addEventListener("input", function () {
          var i = +t.getAttribute("data-cts-fill");
          if (review || st.fillChecked[i] || o.passed()) return;   // answered: stays as it is
          st.fillAnswers[i] = t.value; o.save();
        });
        t.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.keyCode === 13) { e.preventDefault(); check(+t.getAttribute("data-cts-fill"), t.value); }
        });
      });
      o.host.querySelectorAll("button[data-cts-fill-check]").forEach(function (b) {
        b.addEventListener("click", function () {
          var i = +b.getAttribute("data-cts-fill-check"), t = o.host.querySelector('input[data-cts-fill="' + i + '"]');
          check(i, t ? t.value : st.fillAnswers[i]);
        });
      });

      // once the lock ends, draw again, so the fill-ins open without a reload
      if (timer) clearTimeout(timer);
      var until = o.lockedUntil() || 0;
      if (until > Date.now()) timer = setTimeout(render, until - Date.now() + 250);
    }

    /* Mark one fill-in now, as a multiple-choice click is marked: right or
       wrong, with the answer shown, and fixed for the rest of the attempt. */
    function check(i, value) {
      if (review || st.fillChecked[i] || o.passed() || locked()) return;
      if (!String(value || "").trim()) {
        var empty = o.host.querySelector('input[data-cts-fill="' + i + '"]');
        if (empty) empty.focus();
        return;
      }
      st.fillAnswers[i] = value;
      st.fillChecked[i] = true;
      o.save();
      render();
      // on to the next one still open
      for (var k = i + 1; k < n; k++) {
        if (!st.fillChecked[k]) { var next = o.host.querySelector('input[data-cts-fill="' + k + '"]'); if (next) next.focus(); break; }
      }
    }

    function score() {
      var c = 0;
      qs.forEach(function (q, i) { if (fillRight(q, st.fillAnswers[i])) c++; });
      return c;
    }

    function submit() {
      var counted = !!o.counts();
      if (!n) return { ok: true, score: 0, need: 0, n: 0, counted: counted };
      // submitting marks every fill-in, answered or not, as Check would
      for (var i = 0; i < n; i++) st.fillChecked[i] = true;
      var s = score(), ok = !counted || s >= need(n);
      if (!ok) {
        // shown for review during the lock; the next attempt starts empty
        review = st.fillAnswers.slice();
        st.fillAnswers = new Array(n).fill("");
        st.fillChecked = new Array(n).fill(false);
      }
      o.save();
      return { ok: ok, score: s, need: need(n), n: n, counted: counted };
    }

    function reset() {
      review = null;
      st.fillAnswers = new Array(n).fill("");
      st.fillChecked = new Array(n).fill(false);
    }

    return { render: render, submit: submit, reset: reset, n: n };
  }

  // the unit's questions, or none: a unit without data is graded without them
  function questions(course, unit) {
    var d = window.CTS_FILL_DATA && window.CTS_FILL_DATA[course];
    return (d && d[unit]) || [];
  }

  window.CTSFill = { mount: mount, questions: questions, normalise: normalise, bare: bare, fillRight: fillRight, need: need };
})();
