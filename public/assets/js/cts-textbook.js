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
 *
 * LIVE MODE (docs/ai-grading.md, a page that says grading: "live"). The page
 * carries every question's words and id but no key, and no draw: the server
 * draws the twenty (POST /api/attempt names them), grades each answer
 * (CTSFill, live), and decides the pass on Submit. This browser then mirrors
 * the outcome into the keys above. A pass shows only when the server says so;
 * a result still being graded shows "Submitted -- grading pending" and is
 * collected later (cts_textbook_<slug>_pending holds the attempt). There is no
 * practice set after a pass: a draw is the server's to make, and a second
 * attempt would be a second record.
 *
 * A BANK DRAWN BY READING (World Religions, revised 10 Oct 2026). When the
 * bank says `perGroup` and each question its `group`, every attempt takes
 * perGroup questions from each group -- four from each of the five readings
 * -- and shuffles them together; a saved attempt that does not is drawn
 * afresh. Such a bank also carries a `revision`, kept with the attempt as
 * state.rev: an attempt saved under another revision (or none) was begun on
 * other questions, whose numbers now point at different ones, so it is set
 * aside for a fresh draw before anything is shown or graded. Only the attempt
 * in hand is replaced: the pass, its date and any lock are left as they are.
 * A bank without them (every textbook, Genesis) draws as it always has.
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
                          es: "&#10003; Aprobó el examen de este libro el " + esc(when) + ".",
                          fr: "&#10003; Vous avez réussi l\u2019examen de ce manuel le " + esc(when) + "." });
  }

  // ---- the test page -----------------------------------------------------------
  function testPage() {
    var T = window.CTS_TEXTBOOK_TEST;
    if (!T || !window.CTSFill) return;
    var LIVE = T.grading === "live", G = window.CTSGrading;
    var slug = T.slug, n = T.questions.length, reading = T.kind === "reading";
    var W = reading
      ? { passed: { en: "Required-reading test passed", es: "Examen de lecturas requeridas aprobado", fr: "Examen des lectures obligatoires réussi" }, review: { en: "Go back to the readings", es: "Vuelva a las lecturas", fr: "Relisez les lectures" } }
      : { passed: { en: "Textbook test passed", es: "Examen del libro aprobado", fr: "Examen du manuel réussi" }, review: { en: "Review the book", es: "Repase el libro", fr: "Relisez le manuel" } };
    var KEY = { state: "cts_textbook_" + slug + "_state", lock: "cts_textbook_" + slug + "_lock", passed: "cts_textbook_" + slug + "_passed", pending: "cts_textbook_" + slug + "_pending" };
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
    var PER = T.perGroup || 0, REV = T.revision || null, GROUPS = {};
    if (PER) for (var gi = 0; gi < n; gi++) { var g = T.questions[gi].group; (GROUPS[g] = GROUPS[g] || []).push(gi); }
    function newDraw() {
      var idx = [], i;
      if (PER) {
        Object.keys(GROUPS).forEach(function (g) { idx = idx.concat(shuffle(GROUPS[g].slice()).slice(0, PER)); });
        return shuffle(idx);
      }
      if (T.perReading || T.perChapter) {
        var groups = {}, order = [];
        for (i = 0; i < n; i++) {
          var r = T.perChapter ? T.questions[i].chapter : T.questions[i].reading;
          if (!groups[r]) { groups[r] = []; order.push(r); }
          groups[r].push(i);
        }
        order.forEach(function (r) { idx = idx.concat(shuffle(groups[r]).slice(0, T.perReading || T.perChapter)); });
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
        if (PER) { var g = T.questions[d[i]].group; per[g] = (per[g] || 0) + 1; }
        if (T.perReading || T.perChapter) { var r = T.perChapter ? T.questions[d[i]].chapter : T.questions[d[i]].reading; per[r] = (per[r] || 0) + 1; if (per[r] > (T.perReading || T.perChapter)) return false; }
      }
      if (PER) for (var k in GROUPS) if (per[k] !== PER) return false;
      return true;
    }
    function startAttempt() {
      state = { draw: newDraw(), fillAnswers: [], fillChecked: [] };
      if (REV) state.rev = REV;
      save();
    }
    /* the attempt in hand, or a new one: after a failed attempt's wait, if
       nothing usable is saved, or if it was begun on another revision of the bank */
    var changedRevision = false, hadOldAttempt = false;
    if (!LIVE) {
      changedRevision = REV && state.rev !== REV;
      hadOldAttempt = changedRevision && Array.isArray(state.draw) && state.draw.length > 0;
      // A corrected bank must not retain a failed-attempt wait from its old questions.
      // The independent pass key and server completion record are never cleared.
      if (changedRevision && T.resetWaitOnRevision) lsDel(KEY.lock);
      if (!drawOK(state.draw) || changedRevision || (state.redrawAt && Date.now() >= state.redrawAt && !lockRemaining())) startAttempt();
    }

    var host = el("tb-questions"), status = el("tb-status"), result = el("tb-result");
    var fill = null, unlockTimer = null;

    function mount() {
      var qs = (Array.isArray(state.draw) ? state.draw : []).map(function (i) { return T.questions[i]; });
      fill = window.CTSFill.mount({
        host: host, questions: qs, state: state, hideAnswers: true,
        counts: function () { return true; },
        lockedUntil: lockUntil,
        passed: function () { return !!passedOn() && !practice; },
        save: save,
        live: LIVE ? { attemptId: function () { return L.attemptId; }, onChecked: function (resumingSubmit) {
          renderStatus();
          if (resumingSubmit) liveSubmit();
        } } : null
      });
      fill.render();
      renderStatus();
      scheduleUnlock();
      renderReview();
    }

    /* What the seminary's record says about this test for this student
       (9 Oct 2026): not yet in force, or not needed for a master's
       completion the record held before it was. Only said; the test can
       still be taken, and a pass is kept as any pass is. */
    function standing() {
      var active = {}; try { active = JSON.parse(lsGet("cts_required_from") || "{}"); } catch (e) {}
      if ("requiredFrom" in T && T.requiredFrom == null && !active[slug])
        return bi({ en: "This test is being introduced and is not yet required on any track.",
                    es: "Este examen se está introduciendo y aún no es obligatorio en ningún trayecto.",
                    fr: "Cet examen est en cours d\u2019introduction et n\u2019est encore obligatoire dans aucun parcours." });
      if (lsGet("cts_textbook_" + slug + "_exempt"))
        return bi({ en: "Your record already held this course as a master's completion before this test began to count, so it is not required of you for this course. You may still take it.",
                    es: "Su registro ya tenía este curso como finalización de maestría antes de que este examen empezara a contar, así que no se le exige para este curso. Aun así puede presentarlo.",
                    fr: "Votre dossier comptait déjà ce cours comme validé au niveau master avant que cet examen ne commence à compter\u202f; il n\u2019est donc pas exigé de vous pour ce cours. Vous pouvez tout de même le passer." });
      return "";
    }
    function renderStatus() {
      if (LIVE) return renderLiveStatus();
      var when = passedOn(), m = lockRemaining(), h = "";
      var st = standing();
      if (hadOldAttempt && T.resetWaitOnRevision) h += '<p class="small" id="tb-revised">' + bi(when ? {
        en: "These questions have been updated to match the assigned reading. Your previous pass is still valid. You may try the updated questions for practice.",
        es: "Estas preguntas se han actualizado para ajustarse a la lectura asignada. Su aprobación anterior sigue siendo válida. Puede intentar las preguntas actualizadas para practicar.",
        fr: "Ces questions ont été actualisées pour correspondre à la lecture assignée. Votre réussite antérieure reste valable. Vous pouvez essayer les nouvelles questions pour vous exercer."
      } : {
        en: "These questions have been updated to match the assigned reading. Your unfinished attempt has restarted and its waiting period has been removed. Any previous pass is kept.",
        es: "Estas preguntas se han actualizado para ajustarse a la lectura asignada. Su intento pendiente se ha reiniciado y se ha eliminado su período de espera. Se conserva toda aprobación anterior.",
        fr: "Ces questions ont été actualisées pour correspondre à la lecture assignée. Votre tentative inachevée a recommencé et son délai d’attente a été supprimé. Toute réussite antérieure est conservée."
      }) + '</p>';
      if (st && !when) h += '<p class="small muted" id="tb-standing">' + st + "</p>";
      if (when && !practice) {
        h += '<div class="cts-passed"><p class="cts-passed-title">&#10003; ' + bi(W.passed) + "</p>" +
             "<p>" + bi({ en: "Passed on " + esc(when) + ". It is saved in this browser.", es: "Aprobado el " + esc(when) + ". Quedó guardado en este navegador.", fr: "Réussi le " + esc(when) + ". Ce résultat est enregistré dans ce navigateur." }) + "</p>" +
             '<button type="button" class="btn" id="tb-practice">' + bi({ en: "Try another twenty, for practice", es: "Otras veinte, para practicar", fr: "Vingt autres questions, pour vous exercer" }) + "</button></div>";
      } else if (m) {
        h += '<div class="exam-status fail">' + bi({ en: "Locked after a failed attempt. " + W.review.en + " and try again in " + m + " minute(s); the next attempt draws a fresh twenty.",
                                                     es: "Bloqueado tras un intento fallido. " + W.review.es + " e inténtelo de nuevo en " + m + " minuto(s); el siguiente intento toma otras veinte.",
                                                     fr: "Examen bloqué après une tentative non réussie. " + W.review.fr + " et réessayez dans " + m + " minute(s)\u202f; la tentative suivante tire vingt nouvelles questions." }) + "</div>";
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
      if (until > Date.now()) unlockTimer = setTimeout(function () { if (LIVE) { say(""); liveStart(); return; } startAttempt(); say(""); mount(); }, until - Date.now() + 600);
    }

    /* After a pass, the course's other required test, if it is still to pass:
       a textbook test and a five-reading test are passed separately. */
    function stillToPass() {
      try {
        var left = (window.CTSRecord && window.CTSRecord.pendingTests && T.completion) ? window.CTSRecord.pendingTests(T.completion) : [];
        left = left.filter(function (t) { return t.slug !== slug; });
        if (!left.length) return "";
        var t = left[0], rd = t.kind === "reading";
        return " " + bi({ en: "The course also needs its " + (rd ? "required-reading test" : "textbook test") + ": ", es: "El curso también necesita su " + (rd ? "examen de lecturas requeridas" : "examen del libro de texto") + ": ", fr: "Le cours exige aussi " + (rd ? "l\u2019examen des lectures obligatoires" : "l\u2019examen du manuel") + "\u00a0: " })
          + '<a href="/' + esc(t.page) + 'Test.html">' + bi({ en: "take it", es: "preséntelo", fr: "passez-le" }) + "</a>.";
      } catch (e) { return ""; }
    }
    function say(msg, colour) { result.innerHTML = msg ? '<span style="color:' + (colour || "#000") + '">' + msg + "</span>" : ""; }

    // Review is generated from assigned teaching paragraphs, not answer keys.
    // It is deliberately separate from CTSFill's per-item correctness display.
    function renderReview() {
      var reviewHost = el("tb-review");
      if (!reviewHost) {
        reviewHost = document.createElement("section"); reviewHost.id = "tb-review";
        reviewHost.className = "tb-review";
        result.parentNode.appendChild(reviewHost);
      }
      var snapshot = state.review, bank = window.CTS_EXAM_REVIEW;
      reviewHost.innerHTML = "";
      if (!snapshot || !Array.isArray(snapshot.draw) || (!Array.isArray(snapshot.answers) && !Array.isArray(snapshot.missed))) return;
      if (LIVE && !snapshot.missed) return;
      var codes = snapshot.codes || (window.CTSLanguage && window.CTSLanguage.lang === "fr" ? ["fr", "en"] : ["en", "es"]);
      var items = "";
      snapshot.draw.forEach(function (index, position) {
        var q = T.questions[index];
        if (!q || (snapshot.missed ? !snapshot.missed[position] : window.CTSFill.fillRight(q, snapshot.answers[position], codes))) return;
        // Live: the passages hold the answers, so the page has none of its own; the
        // server sends them with an attempt that passed (snapshot.passages, by qid).
        // A failed attempt lists what was missed, with the way back to the book.
        var passage = LIVE ? (snapshot.passages && snapshot.passages[q.qid]) || null : bank && bank.slug === slug && bank.questions[index];
        items += '<article class="tb-review-item"><h3>' + bi({en:"Question " + (position+1),es:"Pregunta " + (position+1),fr:"Question " + (position+1)}) + '</h3><p>' + bi({en:esc(q.prompt.en),es:esc(q.prompt.es),fr:q.prompt.fr ? esc(q.prompt.fr) : undefined}) + '</p>';
        if (passage) {
          items += '<p>' + bi(passage.kind === 'lesson' ? {en:"The course lesson explains this question’s principle or context:",es:"La lección del curso explica el principio o contexto de esta pregunta:",fr:"La leçon du cours explique le principe ou le contexte de cette question :"} : {en:"The assigned reading explains this question’s principle or context:",es:"La lectura asignada explica el principio o contexto de esta pregunta:",fr:"La lecture assignée explique le principe ou le contexte de cette question :"}) + '</p><blockquote lang="' + esc(passage.lang) + '">';
          passage.paragraphs.forEach(function (paragraph) { items += '<p>' + esc(paragraph) + '</p>'; });
          items += '</blockquote><p><a href="' + esc(passage.href) + '">' + bi({en:"Read in context: ",es:"Leer en contexto: ",fr:"Lire dans son contexte : "}) + esc(passage.heading) + '</a></p>';
        } else {
          items += '<p><a href="/' + esc(T.page) + '.html">' + bi(W.review) + '</a></p>';
        }
        items += '</article>';
      });
      if (!items) return;
      if (LIVE && !snapshot.passages) {
        // a failed live attempt: the questions missed, and where to study them -- no passage, no answer
        reviewHost.innerHTML = '<h2>' + bi({en:"Questions to review",es:"Preguntas para repasar",fr:"Questions à revoir"}) + '</h2><p>' + bi({en:"Study these in the assigned material before another attempt. The explanations are shown once the test is passed.",es:"Estúdielas en el material asignado antes de otro intento. Las explicaciones se muestran cuando se aprueba el examen.",fr:"Étudiez-les dans le matériel assigné avant une nouvelle tentative. Les explications s’affichent une fois l’examen réussi."}) + '</p>' + items;
        return;
      }
      reviewHost.innerHTML = '<h2>' + bi({en:"Learn from the questions you missed",es:"Aprenda de las preguntas que no acertó",fr:"Apprenez des questions manquées"}) + '</h2><p>' + bi({en:"Read each explanation, then revisit its assigned section before another attempt. These passages retain the reading author’s perspective.",es:"Lea cada explicación y vuelva a su sección asignada antes de otro intento. Estos pasajes conservan la perspectiva del autor de la lectura.",fr:"Lisez chaque explication, puis revenez à la section assignée avant une nouvelle tentative. Ces passages conservent le point de vue de l’auteur de la lecture."}) + '</p>' + items;
    }

    function submit() {
      if (LIVE) return liveSubmit();
      if (lockRemaining()) { renderStatus(); return; }
      if (passedOn() && !practice) return;
      var sentAnswers = state.draw.map(function (bi, k) { return { qid: (reading ? "rd:" : "tb:") + slug + "/fill/" + bi, answer: state.fillAnswers[k] }; })
        .filter(function (a) { return String(a.answer || "").trim(); });
      var submittedAnswers = state.fillAnswers.slice();
      var r = fill.submit();
      var reviewCodes = window.CTSLanguage && window.CTSLanguage.lang === "fr" ? ["fr", "en"] : ["en", "es"];
      state.review = { draw: state.draw.slice(), answers: submittedAnswers, codes: reviewCodes,
        missed: state.draw.map(function (index,position) { return !window.CTSFill.fillRight(T.questions[index],submittedAnswers[position],reviewCodes); }) };
      save();
      var ok = r.score >= T.pass, completedNow = false;
      /* Shadow mode: cts-shadow.js posts what was submitted to /api/shadow.
         Grades nothing; no listener, no effect. */
      try { document.dispatchEvent(new CustomEvent("cts:submitted", { detail: { scope: (reading ? "rd:" : "tb:") + slug, answers: sentAnswers,
        clientResult: { passed: ok, fill: { right: r.score, total: r.n } } } })); } catch (e) {}
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
                 es: "&#10003; Aprobado: " + r.score + " de " + r.n + " correctas (se necesitan " + T.pass + ")." + (completedNow === "new" ? " Con esto el curso queda completo: " : ""),
                 fr: "&#10003; Réussi\u00a0: " + r.score + " bonnes réponses sur " + r.n + " (" + T.pass + " requises)." + (completedNow === "new" ? " Le cours est ainsi terminé\u00a0: " : "") })
            + (completedNow === "new" && T.completion.page ? '<a href="/' + esc(T.completion.page) + '">' + bi({ en: "your certificate", es: "su certificado", fr: "votre certificat" }) + "</a>" : "")
            + stillToPass(), "#1f6b3b");
        practice = false;
      } else {
        var mins = isMasters() ? LOCK_MASTERS_MIN : LOCK_CERT_MIN;
        var until = Date.now() + mins * 60000;
        lsSet(KEY.lock, String(until));
        state.redrawAt = until; save();
        say(bi({ en: "Not yet: " + r.score + " of " + r.n + " right, " + T.pass + " needed. " + W.review.en + " and try again in " + mins + " minute(s).",
                 es: "Aún no: " + r.score + " de " + r.n + " correctas; se necesitan " + T.pass + ". " + W.review.es + " e inténtelo de nuevo en " + mins + " minuto(s).",
                 fr: "Pas encore\u00a0: " + r.score + " bonnes réponses sur " + r.n + "\u202f; il en faut " + T.pass + ". " + W.review.fr + " et réessayez dans " + mins + " minute(s)." }), "#8a1f1f");
      }
      fill.render();
      renderStatus();
      renderReview();
      scheduleUnlock();
    }
    function reset() {
      if (LIVE) return liveReset();
      if (lockRemaining() || (passedOn() && !practice)) return;
      delete state.review; fill.reset(); save(); say(""); fill.render(); renderReview();
    }

    /* ---- LIVE MODE: the server draws, grades and decides -------------------- */
    var L = { S: null, attemptId: null, status: "loading", trouble: null, working: "", stopPoll: null };
    var STR = {
      pendingTest: { en: "Your result will appear here when it is graded. You may leave this page: it is checked again the next time you open it.",
                     es: "Su resultado aparecerá aquí cuando se califique. Puede salir de esta página: se vuelve a comprobar la próxima vez que la abra.",
                     fr: "Votre résultat apparaîtra ici une fois corrigé. Vous pouvez quitter cette page : il est vérifié de nouveau à votre prochaine visite." }
    };
    function bankIndex(qid) {
      var m = /\/fill\/(\d+)$/.exec(String(qid));
      var i = m ? +m[1] : -1;
      return i >= 0 && i < n && T.questions[i].qid === qid ? i : -1;
    }
    function itemsOf(S) {
      var map = G.verdictsOf(S);
      return Object.keys(map).map(function (qid) { return Object.assign({ qid: qid }, map[qid]); });
    }
    function setLock(lock) {
      var l = G.lockOf(lock);
      if (l && l.until > Date.now()) { lsSet(KEY.lock, String(l.until)); state.redrawAt = l.until; }
      else { lsDel(KEY.lock); delete state.redrawAt; }
      save();
    }
    function liveTrouble(r, retry) { L.working = ""; L.trouble = { r: r, retry: retry }; renderStatus(); }

    function renderLiveStatus() {
      var when = passedOn(), m = lockRemaining(), h = "";
      var st = standing();
      if (st && !when) h += '<p class="small muted" id="tb-standing">' + st + "</p>";
      if (L.status === "unregistered") h += G.registerHtml(bi, true);
      else if (L.status === "connecting" || L.status === "loading") h += '<p class="small" role="status">' + bi(G.S.connecting) + "</p>";
      if (L.working) h += '<p class="small" role="status" style="font-weight:600">' + bi(L.working === "reviewing" ? G.S.reviewing : G.S.submitting) + "</p>";
      if (L.trouble) h += G.troubleHtml(L.trouble.r, bi);
      if (when) {
        h += '<div class="cts-passed"><p class="cts-passed-title">&#10003; ' + bi(W.passed) + "</p>" +
             "<p>" + bi({ en: "Passed on " + esc(when) + ". It is saved in your record.", es: "Aprobado el " + esc(when) + ". Quedó guardado en su registro.", fr: "Réussi le " + esc(when) + ". Ce résultat est enregistré dans votre dossier." }) + "</p></div>";
      } else if (L.status === "pending") {
        h += '<div class="exam-status" role="status"><p style="color:#8a5a00;font-weight:600">' + bi(G.S.submittedPending) + "</p><p class=\"small\">" + bi(STR.pendingTest) + "</p></div>";
      } else if (m) {
        h += '<div class="exam-status fail">' + bi({ en: "Locked after a failed attempt. " + W.review.en + " and try again in " + m + " minute(s); the next attempt draws a fresh twenty.",
                                                     es: "Bloqueado tras un intento fallido. " + W.review.es + " e inténtelo de nuevo en " + m + " minuto(s); el siguiente intento toma otras veinte.",
                                                     fr: "Examen bloqué après une tentative non réussie. " + W.review.fr + " et réessayez dans " + m + " minute(s) ; la tentative suivante tire vingt nouvelles questions." }) + "</div>";
      }
      if (L.status === "ready" || L.status === "pending") h += '<p class="small muted cts-ai-note">' + bi(G.S.aiNote) + "</p>";
      status.innerHTML = h;
      var rb = status.querySelector("[data-cts-retry]");
      if (rb) rb.addEventListener("click", function () { var t = L.trouble; L.trouble = null; renderStatus(); if (t && t.retry) t.retry(); else liveStart(); });
      var off = !!when || !!m || L.status !== "ready" || !!L.working;
      var sb = el("tb-submit"), rs = el("tb-reset");
      if (sb) sb.disabled = off;
      if (rs) rs.disabled = off;
    }

    function liveStart() {
      if (L.stopPoll) { L.stopPoll(); L.stopPoll = null; }
      L.trouble = null; L.working = "";
      if (!G.registered()) { L.status = "unregistered"; return renderStatus(); }
      if (passedOn()) { L.status = "passed"; return renderStatus(); }
      L.status = "connecting"; renderStatus();
      var pid = lsGet(KEY.pending);
      (pid ? G.calls.status(pid) : Promise.resolve(null)).then(function (pr) {
        if (pr && pr.unregistered) { L.status = "unregistered"; return renderStatus(); }
        if (pr && !pr.ok && (pr.offline || pr.status >= 500 || pr.status === 429)) { L.status = "ready"; return liveTrouble(pr, liveStart); }
        if (pr && pr.ok && pr.data) {
          var st = String(pr.data.status || "");
          if (st === "pending") return livePending(pid, pr.data);
          if (st === "passed") { lsDel(KEY.pending); return livePass(pr.data); }
          if (st === "failed") { lsDel(KEY.pending); liveFail(pr.data); }
        } else if (pid) lsDel(KEY.pending);
        G.calls.attempt(T.scope, serverLang()).then(function (r) {
          if (r.unregistered) { L.status = "unregistered"; return renderStatus(); }
          if (!r.ok) {
            var lk = r.data && r.data.lock;
            if (lk) { setLock(lk); L.status = "ready"; mount(); renderStatus(); scheduleUnlock(); return; }
            L.status = "ready"; return liveTrouble(r, liveStart);
          }
          var S = r.data || {};
          if (S.status === "pending" && S.attemptId) return livePending(S.attemptId, S);
          var idx = (((S.items || {}).fill) || []).map(bankIndex).filter(function (i) { return i >= 0; });
          if (!idx.length) { L.status = "ready"; return liveTrouble({ status: 500 }, liveStart); }
          L.S = S; L.attemptId = S.attemptId;
          if (state.attemptId !== S.attemptId) { state.fillAnswers = []; state.fillChecked = []; delete state.review; }
          state.draw = idx; state.attemptId = S.attemptId;
          setLock(S.lock);
          L.status = "ready";
          mount();
          fill.absorb(itemsOf(S));
          save(); fill.render(); renderStatus(); scheduleUnlock();
        });
      });
    }
    function serverLang() { var l = document.documentElement.lang; return l === "es" || l === "fr" ? l : (document.body.classList.contains("lang-es") ? "es" : window.CTSLanguage && window.CTSLanguage.lang === "fr" ? "fr" : "en"); }

    function liveSubmit() {
      if (lockRemaining()) { renderStatus(); return; }
      if (passedOn() || L.status !== "ready" || L.working) return;
      L.trouble = null; L.working = "reviewing"; renderStatus();
      function again() { L.trouble = null; liveSubmit(); }
      fill.sendUnchecked().then(function (ok) {
        // The fill widget already shows the actual error and owns its retry.
        // Do not turn a service error or rate limit into a second offline notice.
        if (!ok) { L.working = ""; renderStatus(); return; }
        L.working = "submitting"; renderStatus();
        return G.calls.submit(L.attemptId).then(function (r) {
          if (!r.ok || !r.data) return liveTrouble(r, again);
          L.working = "";
          applyResult(r.data);
        });
      });
    }
    function applyResult(R) {
      fill.absorb(itemsOf(R));
      var st = String(R.status || "");
      if (st === "passed") return livePass(R);
      if (st === "failed") return liveFail(R);
      return livePending(L.attemptId, R);
    }
    function scoreText(R) {
      var sc = G.scoreOf(R && R.scores, "fill"), right = sc ? sc.right : fill.liveScore(), total = sc ? sc.total : state.draw.length;
      return { right: right, total: total };
    }
    function captureLiveReview(R) {
      var verdicts = G.verdictsOf(R), draw = (state.draw || []).slice();
      if (!draw.length) return;
      state.review = { draw: draw, missed: draw.map(function (index) {
        var grade = verdicts[T.questions[index].qid];
        return !grade || grade.verdict === "wrong";
      }) };
      if (R && R.status === "passed" && R.reviews) state.review.passages = R.reviews;
      save(); renderReview();
    }
    function livePass(R) {
      captureLiveReview(R);
      var d = new Date(), when = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
      lsSet(KEY.passed, when); lsDel(KEY.pending);
      var all = jget("cts_textbooks_passed", []); if (all.indexOf(slug) === -1) { all.push(slug); lsSet("cts_textbooks_passed", JSON.stringify(all)); }
      lsDel(KEY.lock); delete state.redrawAt; save();
      L.status = "passed"; L.working = "";
      if (L.stopPoll) { L.stopPoll(); L.stopPoll = null; }
      var completedNow = false;
      try {
        var c = T.completion;
        if (R && R.courseDone && window.CTSRecord && c && !c.single) completedNow = window.CTSRecord.course(c);
        if (window.CTS_SYNC && window.CTS_SYNC.sync) window.CTS_SYNC.sync();
      } catch (e) {}
      var sc = scoreText(R);
      say(bi({ en: "&#10003; Passed: " + sc.right + " of " + sc.total + " right (" + T.pass + " needed)." + (completedNow === "new" ? " That completes the course: " : ""),
               es: "&#10003; Aprobado: " + sc.right + " de " + sc.total + " correctas (se necesitan " + T.pass + ")." + (completedNow === "new" ? " Con esto el curso queda completo: " : ""),
               fr: "&#10003; Réussi : " + sc.right + " bonnes réponses sur " + sc.total + " (" + T.pass + " requises)." + (completedNow === "new" ? " Le cours est ainsi terminé : " : "") })
          + (completedNow === "new" && T.completion.page ? '<a href="/' + esc(T.completion.page) + '">' + bi({ en: "your certificate", es: "su certificado", fr: "votre certificat" }) + "</a>" : "")
          + stillToPass(), "#1f6b3b");
      if (fill) fill.render();
      renderStatus();
    }
    function liveFail(R) {
      captureLiveReview(R);
      lsDel(KEY.pending);
      if (L.stopPoll) { L.stopPoll(); L.stopPoll = null; }
      var l = G.lockOf(R.lock), mins = isMasters() ? LOCK_MASTERS_MIN : LOCK_CERT_MIN;
      if (l) setLock(R.lock); else { var until = Date.now() + mins * 60000; lsSet(KEY.lock, String(until)); state.redrawAt = until; save(); }
      mins = lockRemaining() || mins;
      L.status = "ready"; L.working = "";
      var sc = scoreText(R);
      say(bi({ en: "Not yet: " + sc.right + " of " + sc.total + " right, " + T.pass + " needed. " + W.review.en + " and try again in " + mins + " minute(s).",
               es: "Aún no: " + sc.right + " de " + sc.total + " correctas; se necesitan " + T.pass + ". " + W.review.es + " e inténtelo de nuevo en " + mins + " minuto(s).",
               fr: "Pas encore : " + sc.right + " bonnes réponses sur " + sc.total + " ; il en faut " + T.pass + ". " + W.review.fr + " et réessayez dans " + mins + " minute(s)." }), "#8a1f1f");
      if (fill) fill.render();
      renderStatus(); scheduleUnlock();
    }
    function livePending(id, R) {
      L.attemptId = id || L.attemptId; L.status = "pending"; L.working = "";
      if (L.attemptId) lsSet(KEY.pending, L.attemptId);
      if (R && fill && (R.answered || R.verdicts)) fill.absorb(itemsOf(R));
      say(bi(G.S.submittedPending), "#8a5a00");
      if (L.stopPoll) L.stopPoll();
      L.stopPoll = G.poll(L.attemptId, function (reply) {
        var st = String(reply.status || "");
        if (st === "pending" || !st) { if (fill) { fill.absorb(itemsOf(reply)); fill.render(); } return false; }
        L.stopPoll = null; lsDel(KEY.pending);
        if (st === "passed") livePass(reply); else { L.status = "ready"; liveFail(reply); }
        return true;
      });
      if (fill) fill.render();
      renderStatus();
    }
    function liveReset() {
      if (lockRemaining() || passedOn() || L.status !== "ready") return;
      // checked answers are final for the attempt; what was typed and not checked can be cleared
      for (var i = 0; i < state.draw.length; i++) if (!state.fillChecked[i]) state.fillAnswers[i] = "";
      save(); say(""); fill.render();
    }

    el("tb-submit").addEventListener("click", submit);
    el("tb-reset").addEventListener("click", reset);
    mount();
    if (LIVE) {
      if (G) { G.appeal.onChange(function () { if (fill) fill.render(); }); liveStart(); }
      else { L.status = "ready"; liveTrouble({ offline: true }, function () { location.reload(); }); }
    }
    document.addEventListener("cts-sync-applied", renderStatus);

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
