/* ============================================================================
   Chapala Theological Seminary — the grading client (live mode)
   ----------------------------------------------------------------------------
   Loaded only by pages built with CTS_GRADING_MODE=live (docs/ai-grading.md).
   In live mode the page carries no answer keys and the browser grades
   nothing: every multiple-choice click, fill-in and written answer goes to the
   seminary's server, and credit exists only when the server has written it.

   This file is the part the three screens share -- the unit engine
   (cts-engine.js), the fill-in widget (cts-fill.js) and the textbook and
   reading tests (cts-textbook.js):

     the calls            attempt, mc, grade, submit, status, appeal
     the student's code   from cts-sync.js; a registered student with no code
                          yet is registered first, as cts-sync.js always does
     every sentence a student sees, in English, Spanish and French
     the "Request a human review" link and its small form
     polling for a result still pending, with backoff

   Nothing here touches the page's own markup or the localStorage keys the
   certificate pages read: the screens mirror the server's answer into those.

   Tests can shorten the waits: window.CTS_GRADING_TEST = { pollMs: [..],
   codeWaitMs: n } before this file loads.
   ========================================================================== */
(function () {
  "use strict";

  var API = (window.CTS_SYNC_API) || "/api";
  var TEST = window.CTS_GRADING_TEST || {};
  // Deferred scripts run while readyState is interactive, before later
  // deferred dependencies (including cts-sync.js) have executed.
  var pageReady = new Promise(function (resolve) {
    if (document.readyState === 'loading' || (document.readyState === 'interactive' && document.currentScript && document.currentScript.defer))
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    else resolve();
  });

  // ---- storage, tolerant of blocked localStorage -------------------------
  var mem = {};
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return k in mem ? mem[k] : null; } }
  function jget(k, d) { try { return JSON.parse(lsGet(k)) || d; } catch (e) { return d; } }

  // ---- the student ------------------------------------------------------
  function student() { return jget("cts_student", null); }
  function registered() { var s = student(); return !!(s && s.name); }
  function code() { return lsGet("cts_student_code") || (window.CTS_SYNC && window.CTS_SYNC.code && window.CTS_SYNC.code()) || null; }

  function fail(kind, extra) { var e = { kind: kind }; if (extra) for (var k in extra) e[k] = extra[k]; return e; }

  /* A code to grade under. A student who has registered in this browser but
     has no code yet (the first visit after registering) is registered now,
     the way cts-sync.js does it on its own schedule; we only wait for it. A
     visitor who has not registered at all is sent to register: rejected with
     kind "unregistered", which each screen answers with the site's own
     registration prompt. */
  function ensureCode() { return pageReady.then(readyCode); }
  function readyCode() {
    var c = code();
    if (c) return Promise.resolve(c);
    if (!registered()) return Promise.reject(fail("unregistered"));
    // deleted their record, or paused on "you already have a record": the
    // registration prompt, not a wait for a code that will not come
    if (lsGet("cts_sync_off") === "1" || lsGet("cts_reg_existing")) return Promise.reject(fail("unregistered"));
    if (!window.CTS_SYNC || !window.CTS_SYNC.sync) return Promise.reject(fail("offline"));
    var waitMs = TEST.codeWaitMs != null ? TEST.codeWaitMs : 20000, t0 = Date.now(), tries = 0;
    try { window.CTS_SYNC.sync(); } catch (e) {}
    return new Promise(function (resolve, reject) {
      (function look() {
        var c2 = code();
        if (c2) return resolve(c2);
        if (Date.now() - t0 > waitMs) return reject(fail("offline"));
        if (++tries % 8 === 0) { try { window.CTS_SYNC.sync(); } catch (e) {} }
        setTimeout(look, 250);
      })();
    });
  }

  // ---- the calls -----------------------------------------------------------
  /* Always resolves: { ok, status, data } for any answer from the server,
     { ok: false, offline: true } when none came. The caller decides what to
     say; nothing is graded here and nothing is retried silently. */
  function call(method, path, body) {
    var ctl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, TEST.timeoutMs || 60000) : null;
    return fetch(API + path, {
      method: method,
      headers: body === undefined ? undefined : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "omit",
      signal: ctl ? ctl.signal : undefined
    }).then(function (r) {
      if (timer) clearTimeout(timer);
      return r.json().catch(function () { return null; }).then(function (data) { return { ok: r.ok, status: r.status, data: data }; });
    }, function () {
      if (timer) clearTimeout(timer);
      return { ok: false, offline: true, status: 0, data: null };
    });
  }
  function withCode(fn) {
    return ensureCode().then(fn, function (e) { return { ok: false, offline: e.kind === "offline", unregistered: e.kind === "unregistered", status: 0, data: null }; });
  }
  var calls = {
    attempt: function (scope, lang) { return withCode(function (c) { return call("POST", "/attempt", { code: c, scope: scope, lang: lang }); }); },
    mc: function (attemptId, qid, choice) { return withCode(function (c) { return call("POST", "/mc", { code: c, attemptId: attemptId, qid: qid, choice: choice }); }); },
    grade: function (attemptId, items) { return withCode(function (c) { return call("POST", "/grade", { code: c, attemptId: attemptId, items: items }); }); },
    submit: function (attemptId) { return withCode(function (c) { return call("POST", "/attempt/" + encodeURIComponent(attemptId) + "/submit", { code: c }); }); },
    status: function (attemptId) { return withCode(function (c) { return call("GET", "/attempt/" + encodeURIComponent(attemptId) + "?code=" + encodeURIComponent(c)); }); },
    appeal: function (o) { return withCode(function (c) { return call("POST", "/appeal", { code: c, gradeId: o.gradeId, attemptId: o.attemptId, qid: o.qid, note: o.note || "" }); }); }
  };

  // ---- reading the server's answers ---------------------------------------
  /* lock: { until, kind } -> { until: epoch ms, part: "sa" | "full" }, or null.
     until may be an ISO date or epoch (seconds or milliseconds). kind names
     which local key the lock is mirrored into: the written part only ("sa",
     "written") or the whole unit (anything else). */
  function lockOf(l) {
    if (!l || !l.until) return null;
    var u = l.until;
    if (typeof u === "string" && /^\d+$/.test(u)) u = +u;
    var ms = typeof u === "number" ? (u < 1e12 ? u * 1000 : u) : Date.parse(u);
    if (!ms || isNaN(ms)) return null;
    return { until: ms, part: /^(sa|written)/i.test(String(l.kind || "")) ? "sa" : "full" };
  }
  /* One part's score from a reply's `scores`, whichever way it is written:
     { mc: { right, total } } or { mc_right, mc_total } or { mcRight, mcTotal };
     short answers say met for right. */
  function scoreOf(scores, part) {
    if (!scores) return null;
    var o = scores[part], right, total, need;
    if (o && typeof o === "object") {
      right = o.right != null ? o.right : o.met != null ? o.met : o.correct;
      total = o.total != null ? o.total : o.of;
      need = o.need != null ? o.need : o.needed;
    }
    var P = part, w = part === "sa" ? ["sa_met", "saMet"] : [part + "_right", part + "Right"];
    if (right == null) right = scores[w[0]] != null ? scores[w[0]] : scores[w[1]];
    if (total == null) total = scores[P + "_total"] != null ? scores[P + "_total"] : scores[P + "Total"];
    if (typeof o === "number" && right == null) right = o;
    if (right == null || total == null) return null;
    return { right: +right, total: +total, need: need != null ? +need : null };
  }
  /* The verdicts a reply carries, as { qid: { verdict, feedback, ... } }. */
  function verdictsOf(reply) {
    if (!reply) return {};
    var v = reply.answered || reply.verdicts || {};
    if (Array.isArray(v)) { var m = {}; v.forEach(function (x) { if (x && x.qid) m[x.qid] = x; }); return m; }
    return v;
  }

  // ---- polling a pending result -----------------------------------------
  /* GET the attempt again, a little slower each time, while the page is open.
     `onReply(reply)` returns true to stop. Returns a function that stops it. */
  function poll(attemptId, onReply) {
    var steps = TEST.pollMs || [5000, 10000, 20000, 40000, 60000, 120000];
    var i = 0, timer = null, stopped = false;
    function next() {
      if (stopped) return;
      timer = setTimeout(function () {
        if (stopped) return;
        calls.status(attemptId).then(function (r) {
          if (stopped) return;
          if (r.ok && r.data && onReply(r.data)) return;
          i = Math.min(i + 1, steps.length - 1);
          next();
        });
      }, steps[Math.min(i, steps.length - 1)]);
    }
    next();
    return function () { stopped = true; if (timer) clearTimeout(timer); };
  }

  // ---- every sentence, in three languages ----------------------------------
  var S = {
    expansion: {
      en: "Your answer is too short to evaluate. Please expand your response to explain your understanding of the question.",
      es: "Su respuesta es demasiado corta para evaluarla. Amplíe su respuesta para explicar su comprensión de la pregunta.",
      fr: "Votre réponse est trop courte pour être évaluée. Veuillez la développer pour expliquer votre compréhension de la question.",
      sw: "Jibu lako ni fupi mno kuweza kutathminiwa. Tafadhali liongeze ili ueleze unavyolielewa swali."
    },
    connecting: { en: "Connecting to the seminary…", es: "Conectando con el seminario…", fr: "Connexion au séminaire…" },
    checking: { en: "Checking…", es: "Comprobando…", fr: "Vérification…" },
    reviewing: { en: "Reviewing your written answers…", es: "Revisando sus respuestas escritas…", fr: "Correction de vos réponses écrites…" },
    submitting: { en: "Recording your attempt…", es: "Registrando su intento…", fr: "Enregistrement de votre tentative…" },
    savedPending: { en: "Saved — will be graded shortly.", es: "Guardada: se calificará en breve.", fr: "Enregistrée : elle sera corrigée sous peu." },
    submittedPending: { en: "Submitted — grading pending.", es: "Enviado: calificación pendiente.", fr: "Envoyé : correction en attente." },
    pendingMore: {
      en: "You can go on to the next unit. This unit gives no credit until it is graded. This page checks for the result while it is open, and again the next time you open it.",
      es: "Puede pasar a la unidad siguiente. Esta unidad no da crédito hasta que se califique. Esta página busca el resultado mientras está abierta, y de nuevo la próxima vez que la abra.",
      fr: "Vous pouvez passer à l’unité suivante. Cette unité ne donne aucun crédit tant qu’elle n’est pas corrigée. Cette page cherche le résultat tant qu’elle est ouverte, et de nouveau à votre prochaine visite."
    },
    resultReady: { en: "Your result is ready.", es: "Su resultado está listo.", fr: "Votre résultat est prêt." },
    register: {
      en: "To take these questions you need a student record. Register in the box above, or restore your record with your student code.",
      es: "Para responder estas preguntas necesita un registro de estudiante. Regístrese en el cuadro de arriba, o recupere su registro con su código de estudiante.",
      fr: "Pour répondre à ces questions, il vous faut un dossier d’étudiant. Inscrivez-vous dans le cadre ci-dessus, ou retrouvez votre dossier avec votre code étudiant."
    },
    registerPage: {
      en: "To take this test you need a student record. Register on the home page, or restore your record with your student code.",
      es: "Para presentar este examen necesita un registro de estudiante. Regístrese en la página principal, o recupere su registro con su código de estudiante.",
      fr: "Pour passer cet examen, il vous faut un dossier d’étudiant. Inscrivez-vous sur la page d’accueil, ou retrouvez votre dossier avec votre code étudiant."
    },
    registerHome: { en: "Register", es: "Registrarse", fr: "S’inscrire" },
    registerRestore: { en: "Restore my record", es: "Recuperar mi registro", fr: "Retrouver mon dossier" },
    // A lost response does not establish whether the server saved a grade.
    offline: {
      en: "We could not confirm the grading result. Check your connection and try again. Your answers are saved.",
      es: "No pudimos confirmar el resultado de la calificación. Revise su conexión e inténtelo de nuevo. Sus respuestas están guardadas.",
      fr: "Nous n’avons pas pu confirmer le résultat de la correction. Vérifiez votre connexion et réessayez. Vos réponses sont conservées."
    },
    serverError: {
      en: "The grading service had a problem. Your answers are saved; please try again to check the result.",
      es: "El servicio de calificación tuvo un problema. Sus respuestas están guardadas; inténtelo de nuevo para comprobar el resultado.",
      fr: "Le service de correction a rencontré un problème. Vos réponses sont conservées ; réessayez pour vérifier le résultat."
    },
    throttled: {
      en: "Too many answers were checked in a short time. Please wait a few minutes and try again.",
      es: "Se comprobaron demasiadas respuestas en poco tiempo. Espere unos minutos e inténtelo de nuevo.",
      fr: "Trop de réponses ont été vérifiées en peu de temps. Attendez quelques minutes et réessayez."
    },
    unknownStudent: {
      en: "The seminary could not find your student record. Restore it with your student code, then try again.",
      es: "El seminario no encontró su registro de estudiante. Recupérelo con su código de estudiante e inténtelo de nuevo.",
      fr: "Le séminaire n’a pas trouvé votre dossier d’étudiant. Retrouvez-le avec votre code étudiant, puis réessayez."
    },
    retry: { en: "Try again", es: "Reintentar", fr: "Réessayer" },
    // the verdicts
    right: { en: "Correct", es: "Correcto", fr: "Correct" },
    wrong: { en: "Incorrect", es: "Incorrecto", fr: "Incorrect" },
    met: { en: "Meets the standard", es: "Cumple el estándar", fr: "Répond à l’exigence" },
    partly: { en: "Partly", es: "En parte", fr: "En partie" },
    not_met: { en: "Does not meet the standard", es: "No cumple el estándar", fr: "Ne répond pas à l’exigence" },
    pending: { en: "Pending", es: "Pendiente", fr: "En attente" },
    kept: { en: "Kept from your earlier attempt", es: "Conservada de su intento anterior", fr: "Conservée de votre tentative précédente" },
    keptNoText: {
      en: "Your answer is on record and met the standard.",
      es: "Su respuesta consta en su registro y cumplió el estándar.",
      fr: "Votre réponse figure dans votre dossier et répondait à l’exigence."
    },
    mcKept: {
      en: "Your multiple choice is passed and kept.",
      es: "Su opción múltiple está aprobada y se conserva.",
      fr: "Votre réussite au choix multiple est conservée."
    },
    // the open statement about who grades
    aiNote: {
      en: "Please answer each question in a short paragraph that demonstrates your understanding of the material. Written answers are graded by an AI assistant against the course’s standards. You may ask for a human review of any result.",
      es: "Responda cada pregunta en un párrafo breve que demuestre su comprensión del material. Un asistente de IA califica las respuestas escritas según los estándares del curso. Puede pedir una revisión humana de cualquier resultado.",
      fr: "Veuillez répondre à chaque question par un court paragraphe qui démontre votre compréhension du cours. Les réponses écrites sont corrigées par un assistant d’IA selon les exigences du cours. Vous pouvez demander une révision par une personne pour n’importe quel résultat."
    },
    notGraded: {
      en: "For your own reflection: written answers do not count on your track and are not graded.",
      es: "Para su propia reflexión: las respuestas escritas no cuentan en su trayecto y no se califican.",
      fr: "Pour votre réflexion personnelle : les réponses écrites ne comptent pas dans votre parcours et ne sont pas corrigées."
    },
    // appeals
    appealLink: { en: "Request a human review", es: "Pedir una revisión humana", fr: "Demander une révision par une personne" },
    appealNote: { en: "Note for the reviewer (optional)", es: "Nota para quien revise (opcional)", fr: "Note pour le correcteur (facultatif)" },
    appealSend: { en: "Send request", es: "Enviar la solicitud", fr: "Envoyer la demande" },
    appealCancel: { en: "Cancel", es: "Cancelar", fr: "Annuler" },
    appealSending: { en: "Sending…", es: "Enviando…", fr: "Envoi…" },
    appealSent: {
      en: "Human review requested. A faculty grader will look at this answer, and their ruling is final.",
      es: "Revisión humana solicitada. Un calificador del profesorado revisará esta respuesta, y su decisión es definitiva.",
      fr: "Révision demandée. Un correcteur du corps professoral examinera cette réponse, et sa décision est définitive."
    },
    appealLimit: {
      en: "You already have three reviews waiting. Wait for a ruling before asking for another.",
      es: "Ya tiene tres revisiones en espera. Espere una decisión antes de pedir otra.",
      fr: "Vous avez déjà trois révisions en attente. Attendez une décision avant d’en demander une autre."
    },
    appealFail: {
      en: "We could not send the request. Please try again.",
      es: "No pudimos enviar la solicitud. Inténtelo de nuevo.",
      fr: "Nous n’avons pas pu envoyer la demande. Réessayez."
    }
  };

  function plain(bi, key) { return bi(S[key]); }

  /* What to say for a call that did not succeed, from { ok:false, ... }. */
  function troubleKey(r) {
    if (r.unregistered) return "register";
    if (r.status === 422 && r.data && r.data.needsExpansion) return "expansion";
    if (r.offline) return "offline";
    if (r.status === 429) return "throttled";
    if (r.status === 404 || r.status === 401 || r.status === 403) return "unknownStudent";
    return "serverError";
  }

  /* A notice with a retry button. `bi` renders a language map as the screen
     does; the button is wired by the caller through [data-cts-retry]. */
  function troubleHtml(r, bi, attrs) {
    var key = troubleKey(r);
    return '<div class="cts-grade-trouble" role="alert" style="margin:12px 0;padding:12px 16px;border-left:4px solid #8a1f1f;background:rgba(138,31,31,.06);color:#8a1f1f;font-weight:600">' +
      bi(S[key]) + (key === "register" || key === "unknownStudent" ? "" :
        ' <button type="button" class="btn" data-cts-retry' + (attrs ? " " + attrs : "") + ">" + bi(S.retry) + "</button>") + "</div>";
  }

  // Use the server's question IDs; the browser does not duplicate word rules.
  var expansionSerial = 0;
  function clearExpansion(field) {
    var note = field._ctsExpansionNote;
    if (!note) return;
    field.removeAttribute("aria-invalid");
    var ids = (field.getAttribute("aria-describedby") || "").split(/\s+/).filter(function (id) { return id && id !== note.id; });
    if (ids.length) field.setAttribute("aria-describedby", ids.join(" ")); else field.removeAttribute("aria-describedby");
    note.remove(); field._ctsExpansionNote = null;
  }
  function showExpansion(reply, fields) {
    var wanted = reply && reply.data && reply.data.needsExpansion;
    if (!Array.isArray(wanted)) return;
    var first = null;
    fields.forEach(function (entry) {
      var field = entry.field;
      if (!field || wanted.indexOf(entry.qid) < 0) return;
      clearExpansion(field);
      var note = document.createElement("p");
      note.id = "cts-sa-expansion-" + (++expansionSerial);
      note.className = "small cts-sa-too-short";
      note.setAttribute("role", "alert"); note.textContent = S.expansion[(document.documentElement.lang || "en").split("-")[0]] || S.expansion.en;
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", ((field.getAttribute("aria-describedby") || "") + " " + note.id).trim());
      field.insertAdjacentElement("afterend", note); field._ctsExpansionNote = note;
      field.addEventListener("input", function clear() { clearExpansion(field); field.removeEventListener("input", clear); });
      if (!first) first = field;
    });
    if (first) first.focus();
  }

  function esc(v) { return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }

  /* The registration prompt, for a visitor with no student record. Pages that
     carry the registration card (units) point at it; the test pages, which do
     not, point at the home page. Both point at the restore page, where a
     student with a code gets their record back. */
  function registerHtml(bi, onTestPage) {
    return '<div class="cts-grade-register" role="status" style="margin:12px 0;padding:12px 16px;border-left:4px solid #b08324;background:#fbf6ea;color:#2a241d">' +
      "<p>" + bi(onTestPage ? S.registerPage : S.register) + "</p><p>" +
      (onTestPage ? '<a class="btn solid" href="/index.html#register">' + bi(S.registerHome) + "</a> " : "") +
      '<a class="btn" href="/cts-backup.html">' + bi(S.registerRestore) + "</a></p></div>";
  }

  // ---- appeals --------------------------------------------------------------
  /* "Request a human review" beside an answer that did not meet the standard.
     Where the form is open, and what has been sent, is kept here, because the
     screens redraw themselves on every change. */
  var appeals = {};            // key -> { open, note, state: "sending" | "sent" | "error" | "limit" }
  var redraw = function () {};
  function appealKey(it) { return String(it.attemptId || "") + "|" + String(it.qid || ""); }
  function appealHtml(it, bi) {
    var k = appealKey(it), a = appeals[k] || {}, h = "";
    var data = ' data-cts-appeal-key="' + esc(k) + '"';
    if (a.state === "sent") return '<p class="small cts-appeal-sent" role="status">' + bi(S.appealSent) + "</p>";
    if (a.open) {
      h += '<div class="cts-appeal-form"' + data + ">" +
        '<label class="small">' + bi(S.appealNote) + '<br><textarea rows="2" maxlength="500" style="width:100%;max-width:32em" data-cts-appeal-note' + data + ">" + esc(a.note) + "</textarea></label><br>";
      if (a.state === "sending") h += '<span class="small">' + bi(S.appealSending) + "</span>";
      else h += '<button type="button" class="btn" data-cts-appeal-send' + data + ">" + bi(S.appealSend) + '</button> <button type="button" class="btn" data-cts-appeal-cancel' + data + ">" + bi(S.appealCancel) + "</button>";
      if (a.state === "limit") h += '<p class="small" role="alert" style="color:#8a1f1f">' + bi(S.appealLimit) + "</p>";
      if (a.state === "error") h += '<p class="small" role="alert" style="color:#8a1f1f">' + bi(S.appealFail) + "</p>";
      return h + "</div>";
    }
    return '<p class="small cts-appeal"><button type="button" class="linklike" data-cts-appeal-open' + data +
      ' style="background:none;border:0;padding:0;color:#6d2233;text-decoration:underline;cursor:pointer;font:inherit">' + bi(S.appealLink) + "</button></p>";
  }
  var appealItems = {};        // key -> { gradeId, attemptId, qid }: remembered when drawn
  function appealRemember(it) { appealItems[appealKey(it)] = it; }
  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? e.target.closest("[data-cts-appeal-open],[data-cts-appeal-send],[data-cts-appeal-cancel]") : null;
    if (!t) return;
    var k = t.getAttribute("data-cts-appeal-key"), a = appeals[k] = appeals[k] || {};
    if (t.hasAttribute("data-cts-appeal-open")) { a.open = true; a.state = null; redraw(); }
    else if (t.hasAttribute("data-cts-appeal-cancel")) { a.open = false; a.state = null; redraw(); }
    else if (t.hasAttribute("data-cts-appeal-send")) {
      var it = appealItems[k]; if (!it) return;
      a.state = "sending"; redraw();
      calls.appeal({ gradeId: it.gradeId, attemptId: it.attemptId, qid: it.qid, note: a.note }).then(function (r) {
        if (r.ok) a.state = "sent";
        else a.state = r.status === 429 || (r.data && /limit|three|3/i.test(String(r.data.error || ""))) ? "limit" : "error";
        redraw();
      });
    }
  });
  document.addEventListener("input", function (e) {
    var t = e.target;
    if (t && t.hasAttribute && t.hasAttribute("data-cts-appeal-note")) {
      var k = t.getAttribute("data-cts-appeal-key"); (appeals[k] = appeals[k] || {}).note = t.value;
    }
  });

  window.CTSGrading = {
    live: true,
    api: API,
    call: call, calls: calls,
    code: code, registered: registered, ensureCode: ensureCode,
    lockOf: lockOf, scoreOf: scoreOf, verdictsOf: verdictsOf,
    poll: poll,
    S: S, plain: plain, esc: esc,
    showExpansion: showExpansion, clearExpansion: clearExpansion,
    troubleHtml: troubleHtml, troubleKey: troubleKey, registerHtml: registerHtml,
    appeal: { html: appealHtml, remember: appealRemember, onChange: function (fn) { redraw = fn; } }
  };
})();
