/* The final synthesis exam page (CTS<Course>Final.html; Dr. Cook, 2 Nov 2026).
 *
 * The page carries the prompts only (window.CTS_FINAL: { slug, scope, pass,
 * maxChars, fill: [{ qid, prompt }], sa: [{ qid, prompt }] }). Everything is
 * graded by the server through cts-grading.js (docs/ai-grading.md section 7):
 *   POST /api/attempt { scope: "fn:<slug>" }   start or resume
 *   POST /api/grade                            a fill-in, or one essay, at a time
 *   POST /api/attempt/<id>/submit              the result: passed, failed (locked) or pending
 * The reply says right or wrong (met / not yet) and nothing more until the
 * attempt passes (the answer-disclosure policy).
 *
 * Kept in this browser (new keys, nothing older is read or changed):
 *   cts_final_<slug>_draft    { qid: text } what the student has typed, not yet graded
 *   cts_final_<slug>_passed   the date the server recorded a pass
 */
(function () {
  "use strict";
  var F = window.CTS_FINAL, G = window.CTSGrading;
  var host = document.getElementById("tb-questions");
  var statusEl = document.getElementById("tb-status"), resultEl = document.getElementById("tb-result");
  var submitBtn = document.getElementById("fn-submit");
  if (!F || !host) return;

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function jget(k, d) { try { return JSON.parse(lsGet(k)) || d; } catch (e) { return d; } }
  function esc(v) { return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
  function t(o) {
    if (window.CTSLanguage) return window.CTSLanguage.bi(o);
    return '<span class="lang-en">' + o.en + '</span><span class="lang-es">' + (o.es || o.en) + '</span><span class="lang-fr">' + (o.fr || o.en) + "</span>";
  }
  function lang() {
    var l = window.CTSLanguage && window.CTSLanguage.lang;
    if (l) return l;
    return document.body.classList.contains("lang-es") ? "es" : "en";
  }
  var KEY = { draft: "cts_final_" + F.slug + "_draft", passed: "cts_final_" + F.slug + "_passed" };
  var draft = jget(KEY.draft, {});
  var W = {
    fill: { en: "Fill in the blanks", es: "Complete los espacios", fr: "Complétez les phrases" },
    essays: { en: "Written questions", es: "Preguntas escritas", fr: "Questions écrites" },
    check: { en: "Check", es: "Comprobar", fr: "Vérifier" },
    send: { en: "Send this answer for grading", es: "Enviar esta respuesta para calificarla", fr: "Envoyer cette réponse pour correction" },
    right: { en: "Correct", es: "Correcto", fr: "Correct" },
    wrong: { en: "Not correct", es: "Incorrecto", fr: "Incorrect" },
    met: { en: "Meets the standard", es: "Cumple el nivel", fr: "Atteint le niveau requis" },
    partly: { en: "Does not yet meet the standard", es: "Aún no cumple el nivel", fr: "N’atteint pas encore le niveau requis" },
    pending: { en: "Saved — it will be graded shortly", es: "Guardada: se calificará en breve", fr: "Enregistrée : elle sera corrigée sous peu" },
    banked: { en: "Met in an earlier attempt — kept", es: "Cumplida en un intento anterior: se conserva", fr: "Réussie lors d’une tentative précédente : conservée" },
    chars: { en: " characters", es: " caracteres", fr: " caractères" },
    tooLong: { en: "This answer is too long. Shorten it to ", es: "Esta respuesta es demasiado larga. Acórtela a ", fr: "Cette réponse est trop longue. Réduisez-la à " },
    expand: { en: "This answer is too short to evaluate. Please expand it to explain your understanding of the question.", es: "Esta respuesta es demasiado corta para evaluarla. Amplíela para explicar su comprensión de la pregunta.", fr: "Cette réponse est trop courte pour être évaluée. Développez-la pour expliquer votre compréhension de la question." },
    wait: { en: "Grading… this can take up to a minute.", es: "Calificando… puede tardar hasta un minuto.", fr: "Correction… cela peut prendre jusqu’à une minute." },
    passed: { en: "You passed the final synthesis exam.", es: "Aprobó el examen final de síntesis.", fr: "Vous avez réussi l’examen final de synthèse." },
    failed: { en: "Not passed this time. Review the course and try again after the wait.", es: "Esta vez no aprobó. Repase el curso e inténtelo de nuevo después de la espera.", fr: "Pas réussi cette fois. Revoyez le cours et réessayez après le délai." },
    pendingAll: { en: "Submitted — some answers are still being graded. This page will update.", es: "Enviado: algunas respuestas aún se están calificando. Esta página se actualizará.", fr: "Envoyé : certaines réponses sont encore en cours de correction. Cette page se mettra à jour." },
    locked: { en: "You may try again after ", es: "Puede intentarlo de nuevo después de las ", fr: "Vous pourrez réessayer après " },
    noServer: { en: "This exam is graded by the seminary's server, which could not be reached. Check your connection and reload the page.", es: "Este examen lo califica el servidor del seminario, que no respondió. Revise su conexión y recargue la página.", fr: "Cet examen est corrigé par le serveur du séminaire, qui n’a pas répondu. Vérifiez votre connexion et rechargez la page." },
    notReady: { en: "This exam is not open yet: its answer keys are not on the server. Please try again later.", es: "Este examen aún no está abierto: sus claves no están en el servidor. Inténtelo más tarde.", fr: "Cet examen n’est pas encore ouvert : ses corrigés ne sont pas sur le serveur. Réessayez plus tard." },
    score: { en: "Fill-ins right: ", es: "Respuestas correctas: ", fr: "Bonnes réponses : " },
    essayScore: { en: " · written answers that meet the standard: ", es: " · respuestas escritas que cumplen el nivel: ", fr: " · réponses écrites au niveau requis : " },
    of: { en: " of ", es: " de ", fr: " sur " },
    needOf: { en: " (needed: ", es: " (se necesitan: ", fr: " (requis : " }
  };

  var css = document.createElement("style");
  css.textContent = ".tb-ok{color:#1f5a2e;font-weight:700}.tb-bad{color:#8a1f1f;font-weight:700}.tb-wait{color:#6b5a1d}" +
    ".fn-item{margin:0 0 18px}.fn-in{min-width:14em;max-width:100%}.fn-text{width:100%;box-sizing:border-box;font:inherit}.fn-v{margin-top:6px}";
  document.head.appendChild(css);

  var state = { attemptId: null, answered: {}, banked: [], busy: false, open: false };

  function verdictHtml(a) {
    if (!a) return "";
    if (a.banked) return '<span class="tb-ok">&#10003; ' + t(W.banked) + "</span>";
    var v = a.verdict;
    if (v === "right") return '<span class="tb-ok">&#10003; ' + t(W.right) + "</span>";
    if (v === "wrong") return '<span class="tb-bad">&#10007; ' + t(W.wrong) + "</span>";
    if (v === "met") return '<span class="tb-ok">&#10003; ' + t(W.met) + "</span>";
    if (v === "pending") return '<span class="tb-wait">' + t(W.pending) + "</span>";
    return '<span class="tb-bad">&#10007; ' + t(W.partly) + "</span>";
  }

  function render() {
    var h = '<h3>' + t(W.fill) + "</h3><ol class=\"fn-fill\">";
    F.fill.forEach(function (q) {
      var a = state.answered[q.qid];
      var val = a && a.answerText != null ? a.answerText : draft[q.qid] || "";
      var done = !!a && a.verdict !== "pending";
      h += '<li class="fn-item" data-qid="' + esc(q.qid) + '"><p>' + t(q.prompt).replace(/____/g, "<span class=\"tb-blank\">____</span>") + "</p>" +
        '<input type="text" maxlength="80" class="fn-in" value="' + esc(val) + '"' + (done ? " disabled" : "") + ' autocomplete="off">' +
        ' <button type="button" class="btn secondary fn-check"' + (done ? " disabled" : "") + ">" + t(W.check) + "</button>" +
        '<div class="fn-v" role="status">' + verdictHtml(a) + "</div></li>";
    });
    h += "</ol><h3>" + t(W.essays) + '</h3><ol class="fn-sa">';
    F.sa.forEach(function (q) {
      var a = state.answered[q.qid] || (state.banked.indexOf(q.qid) >= 0 ? { banked: true } : null);
      var val = a && a.answerText != null ? a.answerText : draft[q.qid] || "";
      var done = !!a && a.verdict !== "pending";
      h += '<li class="fn-item" data-qid="' + esc(q.qid) + '"><p>' + t(q.prompt) + "</p>" +
        '<textarea class="fn-text" rows="12" maxlength="' + F.maxChars + '"' + (done ? " disabled" : "") + ">" + esc(val) + "</textarea>" +
        '<div class="small muted fn-count">' + val.length + " / " + F.maxChars + t(W.chars) + "</div>" +
        '<button type="button" class="btn secondary fn-send"' + (done ? " disabled" : "") + ">" + t(W.send) + "</button>" +
        '<div class="fn-v" role="status">' + verdictHtml(a) + "</div></li>";
    });
    host.innerHTML = h + "</ol>";
  }

  function itemEl(qid) { return host.querySelector('.fn-item[data-qid="' + qid + '"]'); }
  function say(el, html) { if (el) el.innerHTML = html; }

  function adopt(reply) {
    state.answered = (G && G.verdictsOf(reply)) || reply.answered || {};
    if (reply.banked && reply.banked.sa) state.banked = reply.banked.sa;
    for (var q in state.answered) if (state.answered[q] && state.answered[q].banked && state.banked.indexOf(q) < 0) state.banked.push(q);
  }

  function lockText(lock) {
    var l = G && G.lockOf(lock);
    if (!l) return "";
    return " " + t(W.locked) + esc(new Date(l.until).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })) + ".";
  }

  function showResult(r) {
    if (!r || !r.status) return;
    var s = r.scores || {};
    var line = s.fill ? t(W.score) + s.fill.right + t(W.of) + s.fill.total + t(W.needOf) + s.fill.need + ")" : "";
    if (s.sa) line += t(W.essayScore) + s.sa.right + t(W.of) + s.sa.total + t(W.needOf) + s.sa.need + ")";
    if (r.status === "passed") {
      lsSet(KEY.passed, new Date().toISOString().slice(0, 10));
      say(resultEl, '<p class="tb-ok"><strong>&#10003; ' + t(W.passed) + "</strong></p><p>" + line + "</p>");
    } else if (r.status === "failed") {
      say(resultEl, '<p class="tb-bad"><strong>' + t(W.failed) + lockText(r.lock) + "</strong></p><p>" + line + "</p>");
    } else if (r.status === "pending") {
      say(resultEl, "<p>" + t(W.pendingAll) + "</p><p>" + line + "</p>");
      if (G && r.attemptId) G.poll(r.attemptId, function (again) { if (again.status !== "pending") { adopt(again); render(); showResult(again); return true; } return false; });
    }
    if (submitBtn) submitBtn.disabled = r.status !== "open";
  }

  function start() {
    if (!G) { say(statusEl, '<p class="tb-bad">' + t(W.noServer) + "</p>"); return; }
    G.calls.attempt(F.scope, lang()).then(function (r) {
      if (r.unregistered) { say(statusEl, G.registerHtml(t, true)); return; }
      if (r.status === 423 && r.data) { say(statusEl, '<p class="tb-bad">' + t(W.failed) + lockText(r.data.lock) + "</p>"); host.innerHTML = ""; if (submitBtn) submitBtn.disabled = true; return; }
      if (r.status === 400 && r.data && /keys/.test(r.data.error || "")) { say(statusEl, '<p class="tb-bad">' + t(W.notReady) + "</p>"); return; }
      if (!r.ok || !r.data) { say(statusEl, '<p class="tb-bad">' + t(W.noServer) + "</p>"); return; }
      state.attemptId = r.data.attemptId;
      adopt(r.data);
      state.open = r.data.status === "open";
      say(statusEl, "");
      render();
      if (!state.open) G.calls.status(state.attemptId).then(function (s) { if (s.ok && s.data) { adopt(s.data); render(); showResult(s.data); } });
    });
  }

  function grade(qid, answer, vEl, btn, input) {
    if (state.busy || !state.attemptId) return;
    state.busy = true;
    if (btn) btn.disabled = true;
    say(vEl, '<span class="tb-wait">' + t(W.wait) + "</span>");
    G.calls.grade(state.attemptId, [{ qid: qid, answer: answer }]).then(function (r) {
      state.busy = false;
      if (r.status === 422 && r.data) {
        if (btn) btn.disabled = false;
        if (r.data.tooLong) say(vEl, '<span class="tb-bad">' + t(W.tooLong) + r.data.max + t(W.chars) + ".</span>");
        else say(vEl, '<span class="tb-bad">' + t(W.expand) + "</span>");
        if (input) input.focus();
        return;
      }
      if (!r.ok || !r.data || !r.data.items) { if (btn) btn.disabled = false; say(vEl, '<span class="tb-bad">' + t(W.noServer) + "</span>"); return; }
      var it = r.data.items[0];
      state.answered[qid] = { verdict: it.verdict, banked: it.banked, answerText: answer, gradeId: it.gradeId };
      delete draft[qid]; lsSet(KEY.draft, JSON.stringify(draft));
      if (input && it.verdict !== "pending") input.disabled = true;
      if (btn && it.verdict === "pending") btn.disabled = true;
      say(vEl, verdictHtml(state.answered[qid]));
    });
  }

  host.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("button") : null;
    if (!b) return;
    var li = b.closest(".fn-item"), qid = li && li.getAttribute("data-qid");
    if (!qid) return;
    var input = li.querySelector(".fn-in, .fn-text");
    var text = input ? input.value : "";
    if (!text.trim()) { input && input.focus(); return; }
    grade(qid, text, li.querySelector(".fn-v"), b, input);
  });
  host.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.classList && e.target.classList.contains("fn-in")) { e.preventDefault(); var b = e.target.parentNode.querySelector(".fn-check"); if (b) b.click(); }
  });
  host.addEventListener("input", function (e) {
    var el = e.target, li = el.closest && el.closest(".fn-item");
    if (!li) return;
    draft[li.getAttribute("data-qid")] = el.value;
    lsSet(KEY.draft, JSON.stringify(draft));
    var c = li.querySelector(".fn-count");
    if (c) c.innerHTML = el.value.length + " / " + F.maxChars + t(W.chars);
  });
  if (submitBtn) submitBtn.addEventListener("click", function () {
    if (!state.attemptId || state.busy) return;
    state.busy = true; submitBtn.disabled = true;
    G.calls.submit(state.attemptId).then(function (r) {
      state.busy = false;
      if (!r.ok || !r.data) { submitBtn.disabled = false; say(resultEl, '<p class="tb-bad">' + t(W.noServer) + "</p>"); return; }
      adopt(r.data); render(); showResult(r.data);
    });
  });

  render();
  start();
})();
