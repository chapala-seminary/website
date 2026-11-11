/* The ministry assignment page (CTS<Course>Paper.html; Dr. Cook, 2 Nov 2026).
 *
 * The student chooses a format and a topic and pastes the paper (a sermon also
 * needs its study notes) into the form, which cts-integrity.js keeps closed
 * until the paper pledge is ticked. The seminary's server scores it with the AI
 * against the rubric (worker/assignments.js):
 *   POST /api/assignment { code, slug, format, topic, lang, body, notes }
 *   GET  /api/assignment?code=&slug=
 * Both go through cts-grading.js (the student code, registration, errors).
 *
 * Kept in this browser (new keys): cts_paper_<slug>_draft { format, topic, body,
 * notes } until it is submitted, and cts_paper_<slug>_passed, the date it met
 * the standard.
 */
(function () {
  "use strict";
  var P = window.CTS_PAPER, G = window.CTSGrading;
  var host = document.getElementById("tb-questions");
  var statusEl = document.getElementById("tb-status"), resultEl = document.getElementById("tb-result");
  if (!P || !host) return;

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }
  function jget(k, d) { try { return JSON.parse(lsGet(k)) || d; } catch (e) { return d; } }
  function esc(v) { return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }
  function t(o) {
    if (window.CTSLanguage) return window.CTSLanguage.bi(o);
    return '<span class="lang-en">' + o.en + '</span><span class="lang-es">' + (o.es || o.en) + '</span><span class="lang-fr">' + (o.fr || o.en) + "</span>";
  }
  function lang() { return (window.CTSLanguage && window.CTSLanguage.lang) || (document.body.classList.contains("lang-es") ? "es" : "en"); }
  function words(s) { s = String(s || "").trim(); return s ? s.split(/\s+/).length : 0; }
  var KEY = { draft: "cts_paper_" + P.slug + "_draft", passed: "cts_paper_" + P.slug + "_passed" };

  var css = document.createElement("style");
  css.textContent = ".tb-ok{color:#1f5a2e;font-weight:700}.tb-bad{color:#8a1f1f;font-weight:700}.tb-wait{color:#6b5a1d}" +
    ".pp-form label{display:block;font-weight:700;margin:14px 0 4px}.pp-form textarea,.pp-form select{width:100%;box-sizing:border-box;font:inherit}" +
    ".pp-formats label{display:inline-block;font-weight:400;margin:4px 16px 4px 0}.pp-count{font-size:.88em;color:#5a6270}" +
    "table.pp-scores{border-collapse:collapse;width:100%;margin:8px 0}table.pp-scores td,table.pp-scores th{border:1px solid #e0ddd4;padding:6px 8px;text-align:left;vertical-align:top}" +
    "table.tb-rubric{border-collapse:collapse;width:100%}table.tb-rubric td,table.tb-rubric th{border:1px solid #e0ddd4;padding:6px 8px;text-align:left;vertical-align:top}";
  document.head.appendChild(css);

  var W = {
    format: { en: "Format", es: "Formato", fr: "Format" },
    study: { en: "A written study", es: "Un estudio escrito", fr: "Une étude écrite" },
    sermon: { en: "A sermon with study notes", es: "Un sermón con notas de estudio", fr: "Un sermon avec notes d’étude" },
    plan: { en: "A teaching plan", es: "Un plan de enseñanza", fr: "Un plan d’enseignement" },
    topic: { en: "Topic", es: "Tema", fr: "Sujet" },
    choose: { en: "Choose a topic", es: "Elija un tema", fr: "Choisissez un sujet" },
    body: { en: "Your paper (paste it here)", es: "Su trabajo (péguelo aquí)", fr: "Votre travail (collez-le ici)" },
    sermonBody: { en: "Your sermon manuscript (paste it here)", es: "Su manuscrito del sermón (péguelo aquí)", fr: "Le manuscrit de votre sermon (collez-le ici)" },
    notes: { en: "Exegetical study notes: the passage's setting and meaning, how it points to Christ, and the sources you used", es: "Notas de estudio exegético: el contexto y el sentido del pasaje, cómo apunta a Cristo y las fuentes que usó", fr: "Notes d’étude exégétique : le contexte et le sens du passage, comment il annonce le Christ, et les sources utilisées" },
    wordsLbl: { en: " words", es: " palabras", fr: " mots" },
    submit: { en: "Submit my paper for grading", es: "Enviar mi trabajo para calificarlo", fr: "Envoyer mon travail pour correction" },
    grading: { en: "Grading your paper… this can take up to a minute.", es: "Calificando su trabajo… puede tardar hasta un minuto.", fr: "Correction de votre travail… cela peut prendre jusqu’à une minute." },
    pending: { en: "Your paper is saved and waiting to be graded. This page will update; you will also be emailed if your email is confirmed.", es: "Su trabajo está guardado y en espera de calificación. Esta página se actualizará; también recibirá un correo si su dirección está confirmada.", fr: "Votre travail est enregistré et attend sa correction. Cette page se mettra à jour ; vous recevrez aussi un courriel si votre adresse est confirmée." },
    passed: { en: "Your paper meets the standard.", es: "Su trabajo cumple el nivel.", fr: "Votre travail atteint le niveau requis." },
    revise: { en: "Not yet at the standard. Read the comments, revise your paper below and submit it again.", es: "Aún no cumple el nivel. Lea los comentarios, revise su trabajo abajo y envíelo de nuevo.", fr: "Pas encore au niveau requis. Lisez les commentaires, révisez votre travail ci-dessous et envoyez-le de nouveau." },
    unavailable: { en: "Your last version could not be graded. Please submit it again.", es: "Su última versión no pudo calificarse. Envíela de nuevo, por favor.", fr: "Votre dernière version n’a pas pu être corrigée. Veuillez l’envoyer de nouveau." },
    review: { en: "If you believe this grade is wrong, you may ask the faculty to review it: email info@chapalaseminary.org with your student code and the name of the course.", es: "Si cree que esta calificación no es correcta, puede pedir que la facultad la revise: escriba a info@chapalaseminary.org con su código de estudiante y el nombre del curso.", fr: "Si vous pensez que cette note est erronée, vous pouvez demander à la faculté de la revoir : écrivez à info@chapalaseminary.org avec votre code d’étudiant et le nom du cours." },
    total: { en: "Score: ", es: "Puntuación: ", fr: "Note : " },
    need: { en: " of 100 (meets the standard at ", es: " de 100 (cumple el nivel con ", fr: " sur 100 (niveau requis : " },
    version: { en: "Version ", es: "Versión ", fr: "Version " },
    part: { en: "Part", es: "Parte", fr: "Partie" },
    pts: { en: "Points", es: "Puntos", fr: "Points" },
    comment: { en: "Comment", es: "Comentario", fr: "Commentaire" },
    overall: { en: "Overall", es: "En general", fr: "Dans l’ensemble" },
    tooShort: { en: "The paper is too short: at least ", es: "El trabajo es demasiado corto: al menos ", fr: "Le travail est trop court : au moins " },
    tooLong: { en: "This box holds at most ", es: "Este cuadro admite como máximo ", fr: "Cette case contient au plus " },
    chars: { en: " characters.", es: " caracteres.", fr: " caractères." },
    needsNotes: { en: "A sermon needs its study notes: at least ", es: "Un sermón necesita sus notas de estudio: al menos ", fr: "Un sermon demande ses notes d’étude : au moins " },
    held: { en: "Part of the paper reads as an instruction to the grader. Remove it and submit again.", es: "Una parte del trabajo se lee como una instrucción al evaluador. Quítela y envíelo de nuevo.", fr: "Une partie du travail se lit comme une consigne adressée au correcteur. Retirez-la et envoyez de nouveau." },
    daily: { en: "You have submitted three versions today. Please try again tomorrow.", es: "Ya envió tres versiones hoy. Inténtelo de nuevo mañana.", fr: "Vous avez envoyé trois versions aujourd’hui. Réessayez demain." },
    noServer: { en: "The seminary's server could not be reached. Your text is kept in this browser; check your connection and try again.", es: "No se pudo contactar con el servidor del seminario. Su texto se guarda en este navegador; revise su conexión e inténtelo de nuevo.", fr: "Le serveur du séminaire n’a pas pu être joint. Votre texte est conservé dans ce navigateur ; vérifiez votre connexion et réessayez." }
  };
  var CRIT = {};
  (P.criteria || []).forEach(function (c) { CRIT[c.id] = c.name; });

  var draft = jget(KEY.draft, { format: P.formats[0], topic: "", body: "", notes: "" });
  var latest = null, polling = null;

  function form() {
    var h = '<div class="pp-form"><label>' + t(W.format) + '</label><div class="pp-formats">';
    P.formats.forEach(function (f) {
      h += '<label><input type="radio" name="pp-format" value="' + f + '"' + (draft.format === f ? " checked" : "") + "> " + t(W[f]) + "</label>";
    });
    h += '</div><label for="pp-topic">' + t(W.topic) + '</label><select id="pp-topic"><option value=""></option>';
    P.topics.forEach(function (tp) { h += '<option value="' + tp.id + '"' + (draft.topic === tp.id ? " selected" : "") + ">" + esc(lang() === "es" ? tp.es : tp.en) + "</option>"; });
    h += "</select>" +
      '<label for="pp-body" id="pp-body-label"></label><textarea id="pp-body" rows="22" maxlength="' + P.maxChars + '">' + esc(draft.body) + "</textarea>" +
      '<div class="pp-count" id="pp-body-count"></div>' +
      '<div id="pp-notes-wrap"><label for="pp-notes">' + t(W.notes) + '</label><textarea id="pp-notes" rows="12" maxlength="' + P.maxNotesChars + '">' + esc(draft.notes) + "</textarea>" +
      '<div class="pp-count" id="pp-notes-count"></div></div>' +
      '<div id="pp-msg" role="alert"></div>' +
      '<p><button type="button" class="btn solid" id="pp-submit">' + t(W.submit) + "</button></p></div>";
    host.innerHTML = h;
    host.querySelector("#pp-topic option").textContent = lang() === "es" ? W.choose.es : lang() === "fr" ? W.choose.fr : W.choose.en;
    sync();
  }
  function sync() {
    var f = draft.format;
    var lbl = host.querySelector("#pp-body-label"); if (lbl) lbl.innerHTML = t(f === "sermon" ? W.sermonBody : W.body);
    var nw = host.querySelector("#pp-notes-wrap"); if (nw) nw.style.display = f === "sermon" ? "" : "none";
    var bc = host.querySelector("#pp-body-count"), nc = host.querySelector("#pp-notes-count");
    if (bc) bc.innerHTML = words(draft.body) + t(W.wordsLbl) + " · " + draft.body.length + " / " + P.maxChars;
    if (nc) nc.innerHTML = words(draft.notes) + t(W.wordsLbl) + " · " + draft.notes.length + " / " + P.maxNotesChars;
  }
  function save() { lsSet(KEY.draft, JSON.stringify(draft)); }
  function msg(html) { var m = host.querySelector("#pp-msg"); if (m) m.innerHTML = html ? '<p class="tb-bad">' + html + "</p>" : ""; }

  function showResult(a) {
    latest = a;
    if (!a) { resultEl.innerHTML = ""; return; }
    var h = '<h3>' + t(W.version) + a.version + "</h3>";
    if (a.status === "pending") {
      h += '<p class="tb-wait">' + t(W.pending) + "</p>";
      if (!polling) polling = setTimeout(refresh, 20000);
    } else if (a.status === "unavailable") {
      h += '<p class="tb-bad">' + t(W.unavailable) + "</p>" + '<p class="pp-review">' + t(W.review) + "</p>";
    } else {
      if (a.status === "passed") lsSet(KEY.passed, String(a.gradedAt || "").slice(0, 10) || new Date().toISOString().slice(0, 10));
      h += '<p class="' + (a.status === "passed" ? "tb-ok" : "tb-bad") + '"><strong>' + (a.status === "passed" ? "&#10003; " + t(W.passed) : t(W.revise)) + "</strong></p>" +
        "<p><strong>" + t(W.total) + a.total + t(W.need) + a.pass + ")</strong></p>" +
        '<table class="pp-scores"><tr><th>' + t(W.part) + "</th><th>" + t(W.pts) + "</th><th>" + t(W.comment) + "</th></tr>";
      (a.scores || []).forEach(function (s) {
        h += "<tr><td>" + (CRIT[s.id] ? t(CRIT[s.id]) : esc(s.id)) + "</td><td>" + s.points + " / " + s.max + "</td><td>" + esc(s.comment) + "</td></tr>";
      });
      h += "</table>" + (a.feedback ? "<p><strong>" + t(W.overall) + ":</strong> " + esc(a.feedback) + "</p>" : "")
        + (a.status === "revise" ? '<p class="pp-review">' + t(W.review) + "</p>" : "");
    }
    resultEl.innerHTML = h;
    var btn = host.querySelector("#pp-submit");
    if (btn) btn.disabled = a.status === "pending" || a.status === "passed";
  }

  function refresh() {
    polling = null;
    if (!G) return;
    G.ensureCode().then(function (code) {
      return G.call("GET", "/assignment?code=" + encodeURIComponent(code) + "&slug=" + encodeURIComponent(P.slug));
    }, function () { return { ok: false, unregistered: true }; }).then(function (r) {
      if (r.unregistered) { statusEl.innerHTML = G.registerHtml(t, true); return; }
      if (!r.ok || !r.data) return;
      var a = r.data.latest;
      // Bring the last version into an empty form, so a student on another device can revise it.
      if (a && !draft.body && a.body) { draft = { format: a.format, topic: a.topic, body: a.body, notes: a.notes || "" }; form(); }
      showResult(a);
    });
  }

  function submit() {
    var btn = host.querySelector("#pp-submit");
    msg("");
    if (!draft.topic) { msg(t(W.choose)); return; }
    if (btn) btn.disabled = true;
    resultEl.innerHTML = '<p class="tb-wait">' + t(W.grading) + "</p>";
    G.ensureCode().then(function (code) {
      return G.call("POST", "/assignment", { code: code, slug: P.slug, format: draft.format, topic: draft.topic, lang: lang(), body: draft.body, notes: draft.format === "sermon" ? draft.notes : "" });
    }, function () { return { ok: false, unregistered: true }; }).then(function (r) {
      if (btn) btn.disabled = false;
      if (r.unregistered) { resultEl.innerHTML = ""; statusEl.innerHTML = G.registerHtml(t, true); return; }
      var d = r.data || {};
      if (r.status === 201 && d.assignment) { lsDel(KEY.draft); showResult(d.assignment); return; }
      showResult(latest);
      if (r.status === 409 && d.assignment) { showResult(d.assignment); return; }
      if (r.status === 429) { msg(t(W.daily)); return; }
      if (r.status === 422 && d.tooShort) { msg(t(W.tooShort) + d.min + t(W.wordsLbl) + " (" + d.words + ")."); return; }
      if (r.status === 422 && d.needsNotes) { msg(t(W.needsNotes) + d.min + t(W.wordsLbl) + "."); return; }
      if (r.status === 422 && d.tooLong) { msg(t(W.tooLong) + d.max + t(W.chars)); return; }
      if (r.status === 422 && d.held) { msg(t(W.held) + (d.match ? "<br><q>" + String(d.match).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }) + "</q>" : "")); return; }
      msg(d.error ? esc(d.error) : t(W.noServer));
    });
  }

  host.addEventListener("input", function (e) {
    var el = e.target;
    if (el.id === "pp-body") draft.body = el.value;
    else if (el.id === "pp-notes") draft.notes = el.value;
    else return;
    save(); sync();
  });
  host.addEventListener("change", function (e) {
    var el = e.target;
    if (el.name === "pp-format") draft.format = el.value;
    else if (el.id === "pp-topic") draft.topic = el.value;
    else return;
    save(); sync();
  });
  host.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("#pp-submit")) submit(); });

  if (!G) { statusEl.innerHTML = '<p class="tb-bad">' + t(W.noServer) + "</p>"; return; }
  form();
  refresh();
})();
