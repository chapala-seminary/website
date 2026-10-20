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
 * LIVE MODE (docs/ai-grading.md). Given `live: { attemptId: function () }`
 * the widget holds no key and marks nothing: Check sends the answer to
 * /api/grade through cts-grading.js and draws the verdict and the one line of
 * feedback the server sends back; an answer the model could not settle shows
 * "Saved -- will be graded shortly". Extra methods: absorb(items),
 * sendUnchecked() -> Promise<boolean>, liveScore(). The page decides the pass
 * (the server has), so submit() is not used. Without `live`, nothing changes.
 *
 * The widget retains compatibility with saved multiple-choice attempts, whose
 * selected answer text is checked by the same fillRight(). Canonical textbook
 * and assigned-reading banks use typed fill-ins.
 *
 * normalise(), bare() and fillRight() are cts-engine.js's own, word for word:
 * tools/verify-fill-single.mjs fails if they drift apart.
 */
(function () {
  "use strict";
  var PASS_RATIO = 0.9;

  function normalise(s) {
    return " " + String(s || "").toLowerCase().normalize("NFC")
      .replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ") + " ";
  }

  /* A fill-in is right when the student's words, normalised, are exactly the
     answer or one of the accepted alternatives -- in either language, since a
     student reading both may answer in either. Exact, not "contains": typing
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

  function fillCodes() { return window.CTSLanguage?.lang === "fr" ? ["fr", "en"] : ["en", "es"]; }

  function need(n) { return Math.ceil(n * PASS_RATIO); }
  function esc(v) {
    return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }
  // both languages, always: each page shows one and hides the other with CSS
  function bi(o) { if (window.CTSLanguage) return window.CTSLanguage.bi(o); return '<span class="lang-en">' + o.en + '</span><span class="lang-es">' + o.es + "</span>"; }
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
      ".cts-fill-q .cts-mc{display:block;width:100%;max-width:32em;text-align:left;margin:.3em 0;padding:.5em .8em;border:1px solid #9bb;border-radius:6px;background:#fff}" +
      ".cts-fill-q .cts-mc[disabled]{cursor:default;color:inherit;opacity:1}" +
      ".cts-fill-q .cts-mc.picked-ok{border-color:#1f6b3b;background:#e8f4ec}" +
      ".cts-fill-q .cts-mc.picked-bad{border-color:#8a1f1f;background:#f8e9e9}" +
      ".cts-fill-q .cts-mc.right{border-color:#1f6b3b}" +
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
    var LV = o.live || null, G = window.CTSGrading, res = {}, busy = {}, trouble = null;
    function locked() { return (o.lockedUntil() || 0) > Date.now(); }

    function render() {
      if (!n || !o.host) return;
      style();
      var lock = locked(), passed = o.passed(), counts = o.counts();
      if (review && !lock) review = null;          // the lock is over: start again
      var mc = qs.every(function (q) { return !!q.options; });
      var out = '<div class="cts-fill"><h3>' + (mc ? bi({ en: "Multiple Choice", es: "Opción múltiple", fr: "Choix multiple" }) : bi({ en: "Fill in the Blank", es: "Complete el espacio en blanco", fr: "Questions à compléter" })) + "</h3>";
      out += '<p class="cts-fill-note">' + (mc
        ? bi({ en: "Choose the answer that completes each statement: each choice is marked at once, and a wrong choice shows the right answer. You need " + need(n) + " of " + n + " to pass.",
               es: "Elija la respuesta que completa cada enunciado: cada elección se califica en seguida y, si es incorrecta, se muestra la respuesta correcta. Necesita " + need(n) + " de " + n + " para aprobar.",
               fr: "Choisissez la réponse qui complète chaque phrase\u00a0: chaque choix est corrigé aussitôt et, s\u2019il est faux, la bonne réponse s\u2019affiche. Il faut " + need(n) + " bonnes réponses sur " + n + " pour réussir." })
        : counts
        ? bi({ en: "Type the missing word or phrase and press Check (or Enter) to see at once whether it is right. You need " + need(n) + " of " + n + " to pass.",
               es: "Escriba la palabra o frase que falta y pulse Comprobar (o Intro) para ver en seguida si es correcta. Necesita " + need(n) + " de " + n + " para aprobar.",
               fr: "Saisissez le mot ou l\u2019expression qui manque, puis appuyez sur Vérifier (ou Entrée) pour savoir aussitôt si votre réponse est juste. Il faut " + need(n) + " bonnes réponses sur " + n + " pour réussir." })
        : bi({ en: "For your own review: these do not count on the Certificate track. Press Check (or Enter) to see whether your answer is right.",
               es: "Para su propio repaso: no cuentan en el trayecto de Certificado. Pulse Comprobar (o Intro) para ver si su respuesta es correcta.",
               fr: "Pour vous exercer\u00a0: ces questions ne comptent pas pour le parcours Certificat. Appuyez sur Vérifier (ou Entrée) pour savoir si votre réponse est juste." })) + "</p>";
      if (o.hideAnswers) out += '<p class="cts-fill-note">' + bi({en:"Checking shows Correct or Incorrect and fixes your response for this attempt. Submit the test to read an explanation of each missed question.",es:"Al comprobar verá Correcto o Incorrecto y su respuesta quedará fija en este intento. Envíe el examen para leer una explicación de cada pregunta que no acertó.",fr:"La vérification indique Correct ou Incorrect et fixe votre réponse pour cette tentative. Envoyez l’examen pour lire une explication de chaque question manquée."}) + '</p>';
      qs.forEach(function (q, i) {
        var given = review ? review[i] : st.fillAnswers[i];
        var done = !!review || st.fillChecked[i] || passed;
        var working = !!(LV && busy[q.qid]);
        var prompt = { en: (i + 1) + ". " + esc(q.prompt.en), es: (i + 1) + ". " + esc(q.prompt.es) };
        // An English fallback is source text, not a French translation.
        // Omit the missing target so CTSLanguage does not duplicate it.
        if (q.prompt.fr) prompt.fr = (i + 1) + ". " + esc(q.prompt.fr);
        out += '<div class="cts-fill-q" data-cts-fill="' + i + '"><p>' + bi(prompt) + "</p>";
        if (q.options) {
          q.options.en.forEach(function (opt, k) {
            var chosen = done && given === opt, right = LV ? !!(res[q.qid] && res[q.qid].verdict === "right") : fillRight(q, opt, fillCodes());
            var cls = "cts-mc" + (chosen ? (right ? " picked-ok" : " picked-bad") : (!LV && done && right && !o.hideAnswers ? " right" : ""));
            out += '<button type="button" class="' + cls + '" data-cts-mc="' + i + '" data-cts-opt="' + k + '"' + ((done || lock || working) ? " disabled" : "") + ">" +
                   String.fromCharCode(65 + k) + ". " + bi({ en: esc(opt), es: esc(q.options.es[k]) }) + "</button>";
          });
        } else
        out += '<input type="text" data-cts-fill="' + i + '" autocomplete="off" autocapitalize="off" spellcheck="false"' +
               ' aria-label="' + (isEs() ? "Respuesta " : window.CTSLanguage && window.CTSLanguage.lang === "fr" ? "Réponse " : "Answer ") + (i + 1) + '"' +
               ((done || lock || working) ? " disabled" : "") + ' value="' + esc(given) + '" />';
        if (working) out += ' <span class="cts-fill-wait small" role="status">' + bi(G.S.checking) + "</span>";
        else if (!done && !lock && !q.options) out += '<button type="button" data-cts-fill-check="' + i + '">' + bi({ en: "Check", es: "Comprobar", fr: "Vérifier" }) + "</button>";
        if (done && LV) out += liveVerdict(q, i);
        else if (done) {
          var some = String(given || "").trim();
          out += fillRight(q, given, fillCodes())
            ? '<div class="cts-fill-ok">' + bi({ en: "&#10003; Correct!", es: "&#10003; ¡Correcto!", fr: "&#10003; Correct\u202f!" }) + "</div>"
            : o.hideAnswers
            ? '<div class="cts-fill-bad">' + bi({en:"&#10007; Incorrect.",es:"&#10007; Incorrecto.",fr:"&#10007; Incorrect."}) + '</div>'
            : '<div class="cts-fill-bad">' + bi({ en: (some ? "&#10007; Incorrect. " : "") + "Answer: " + esc(q.answer.en),
                                                 es: (some ? "&#10007; Incorrecto. " : "") + "Respuesta: " + esc(q.answer.es), fr: (some ? "&#10007; Incorrect. " : "") + "Réponse\u00a0: " + esc(q.answer.fr || q.answer.en) }) + "</div>";
        }
        out += "</div>";
      });
      o.host.innerHTML = (LV && trouble ? G.troubleHtml(trouble.r, bi) : "") + out + "</div>";
      if (LV && trouble) {
        var rb = o.host.querySelector("[data-cts-retry]");
        if (rb) rb.addEventListener("click", function () { var t = trouble; trouble = null; render(); t.retry(); });
      }

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
      o.host.querySelectorAll("button[data-cts-mc]").forEach(function (b) {
        b.addEventListener("click", function () {
          var i = +b.getAttribute("data-cts-mc"), k = +b.getAttribute("data-cts-opt");
          check(i, qs[i].options.en[k]);
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
      if (LV) return liveCheck(i, value);
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

    /* ---- live mode ---- */
    function liveVerdict(q, i) {
      var r = res[q.qid];
      if (!r) return "";
      var v = r.verdict, h;
      if (v === "right") h = '<div class="cts-fill-ok">' + bi({ en: "&#10003; Correct!", es: "&#10003; ¡Correcto!", fr: "&#10003; Correct\u202f!" }) + "</div>";
      else if (v === "wrong") h = '<div class="cts-fill-bad">' + bi({ en: "&#10007; Incorrect.", es: "&#10007; Incorrecto.", fr: "&#10007; Incorrect." }) + "</div>";
      else h = '<div class="cts-fill-bad" style="color:#8a5a00">' + bi(G.S.savedPending) + "</div>";
      if (r.feedback && !o.hideAnswers) h += '<p class="small cts-grade-feedback">' + esc(r.feedback) + "</p>";
      if (v === "wrong" && r.answer != null && !o.hideAnswers) h += '<p class="small">' + bi({ en: "Answer: ", es: "Respuesta: ", fr: "Réponse\u00a0: " }) + esc(typeof r.answer === "object" ? (r.answer.en || "") : r.answer) + "</p>";
      if (v === "wrong" && r.by !== "exact" && r.by !== "rule") {
        var ap = { gradeId: r.gradeId, attemptId: LV.attemptId(), qid: q.qid };
        G.appeal.remember(ap);
        h += G.appeal.html(ap, bi);
      }
      return h;
    }
    function absorb(items) {
      (items || []).forEach(function (it) {
        if (!it || !it.qid || !it.verdict) return;
        for (var i = 0; i < n; i++) if (qs[i].qid === it.qid) {
          st.fillChecked[i] = true;
          if (it.answerText != null && !String(st.fillAnswers[i] || "").trim()) st.fillAnswers[i] = it.answerText;
          res[it.qid] = { verdict: it.verdict, feedback: it.feedback || "", gradeId: it.gradeId != null ? it.gradeId : it.grade_id != null ? it.grade_id : null,
                          by: it.gradedBy || it.graded_by || null, answer: it.correctAnswer != null ? it.correctAnswer : null };
        }
      });
    }
    function liveCheck(i, value) {
      var q = qs[i];
      /* A page that starts its attempt on first use (the single-page courses) gives `ensure`:
         the attempt first, then the check. */
      if (LV.ensure && !LV.attemptId() && !busy[q.qid]) {
        if (!String(value || "").trim()) return;
        busy[q.qid] = true; st.fillAnswers[i] = value; o.save(); render();
        LV.ensure().then(function (ok) { delete busy[q.qid]; if (ok) liveCheck(i, value); else render(); });
        return;
      }
      if (st.fillChecked[i] || o.passed() || locked() || busy[q.qid]) return;
      if (!String(value || "").trim()) {
        var empty = o.host.querySelector('input[data-cts-fill="' + i + '"]');
        if (empty) empty.focus();
        return;
      }
      st.fillAnswers[i] = value; busy[q.qid] = true; trouble = null;
      o.save(); render();
      G.calls.grade(LV.attemptId(), [{ qid: q.qid, answer: value }]).then(function (r) {
        delete busy[q.qid];
        if (!r.ok || !r.data) { trouble = { r: r, retry: function () { liveCheck(i, value); } }; render(); return; }
        absorb(r.data.items);
        o.save(); render();
        if (LV.onChecked) LV.onChecked();
        for (var k = i + 1; k < n; k++) {
          if (!st.fillChecked[k]) { var next = o.host.querySelector('input[data-cts-fill="' + k + '"]'); if (next) next.focus(); break; }
        }
      });
    }
    /* Submit marks every answer typed and not yet checked, as Check would, ten
       to a call (the server takes one to ten items). Resolves false if a call
       did not succeed -- the widget then shows the notice with its retry. */
    var uncheckedFlight = null;
    function sendUnchecked() {
      // Retry and Submit can both arrive while this batch is being graded.
      // Join the same work so answers and the eventual submit are not repeated.
      // A joiner may include answers typed into previously blank fields.
      // After the shared batch finishes, grade those before final submission.
      if (uncheckedFlight) return uncheckedFlight.then(function (ok) { return ok ? sendUnchecked() : false; });
      var items = [];
      qs.forEach(function (q, i) { if (!st.fillChecked[i] && String(st.fillAnswers[i] || "").trim()) items.push({ qid: q.qid, answer: st.fillAnswers[i] }); });
      var chunks = []; while (items.length) chunks.push(items.splice(0, 10));
      trouble = null;
      var work = chunks.reduce(function (p, chunk) {
        return p.then(function (ok) {
          if (!ok) return false;
          chunk.forEach(function (c) { busy[c.qid] = true; }); render();
          return G.calls.grade(LV.attemptId(), chunk).then(function (r) {
            chunk.forEach(function (c) { delete busy[c.qid]; });
            if (!r.ok || !r.data) { trouble = { r: r, retry: function () { sendUnchecked().then(function (ok2) { if (ok2 && LV.onChecked) LV.onChecked(true); }); } }; render(); return false; }
            absorb(r.data.items); o.save(); render();
            return true;
          });
        });
      }, Promise.resolve(true));
      uncheckedFlight = work.then(function (ok) { uncheckedFlight = null; return ok; }, function (err) { uncheckedFlight = null; throw err; });
      return uncheckedFlight;
    }
    function liveScore() { var c = 0; qs.forEach(function (q) { if (res[q.qid] && res[q.qid].verdict === "right") c++; }); return c; }

    function score() {
      var c = 0;
      qs.forEach(function (q, i) { if (fillRight(q, st.fillAnswers[i], fillCodes())) c++; });
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

    function resetLive() { res = {}; busy = {}; trouble = null; review = null; }
    return { render: render, submit: submit, reset: reset, n: n,
             absorb: absorb, sendUnchecked: sendUnchecked, liveScore: liveScore, resetLive: resetLive,
             setTrouble: function (r, retry) { trouble = { r: r, retry: retry }; render(); },
             results: function () { return res; } };
  }

  // the unit's questions, or none: a unit without data is graded without them
  function questions(course, unit) {
    var d = window.CTS_FILL_DATA && window.CTS_FILL_DATA[course];
    return (d && d[unit]) || [];
  }

  window.CTSFill = { mount: mount, questions: questions, normalise: normalise, bare: bare, fillRight: fillRight, need: need };
})();
