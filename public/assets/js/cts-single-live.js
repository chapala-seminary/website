/* ============================================================================
   Chapala Theological Seminary -- the single-page courses in live mode
   ----------------------------------------------------------------------------
   Counseling, Narrative Preaching, WiseSpeak Preaching and Pastoral & Christian
   Ethics grade on engines of their own (inline in each page). In a page built
   with CTS_GRADING_MODE=live (docs/ai-grading.md) the build (tools/single-pages.mjs)
   takes every answer key out of the page and puts this file in the place of
   those engines' grading. Nothing here grades: each multiple-choice click, fill-in
   and written answer goes to the seminary's server through cts-grading.js, and
   a pass exists only when the server's reply says so.

   What stays the page's own: the lesson, registration, language, unit buttons,
   the progress bar, the certificate -- and the localStorage keys they read
   (cts_drakeford_state, cts_storytel_state, cts_wisespeak_state, cts_ethics_*).
   This file mirrors the server's outcome into them, as cts-engine.js does for
   the unit courses.

   Two families, told apart by how the page is built:
     CTSSingleLive.units(cfg)    Counseling, Narrative, WiseSpeak: one page, a
                                 test per unit section (#mcq_N, #essay_N, #result_N)
     CTSSingleLive.ethics(cfg)   Ethics: one page per unit (#questionsContainer)
   A section is one scope, `sp:<page>`; the first answer to anything is
   kept on the server; the attempt is started on first use, not on page load.
   ========================================================================== */
(function () {
  "use strict";
  var G = window.CTSGrading;
  var C_GOOD = "#1f6b3b", C_BAD = "#8a1f1f", C_WARN = "#8a5a00";

  // ---- storage -------------------------------------------------------------
  var mem = {};
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return k in mem ? mem[k] : null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { mem[k] = String(v); } }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) { delete mem[k]; } }
  function $(id) { return document.getElementById(id); }
  function esc(v) { return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;"); }

  // ---- language ------------------------------------------------------------
  function lang() {
    var b = document.body;
    var l = (window.CTSLanguage && window.CTSLanguage.lang) || (b && b.dataset.pageLang) || document.documentElement.lang || "en";
    l = String(l).toLowerCase().split("-")[0];
    return l === "es" || l === "fr" ? l : "en";
  }
  function bi(map) {
    if (map == null) return "";
    if (typeof map !== "object") return String(map);
    if (window.CTSLanguage && window.CTSLanguage.bi) return window.CTSLanguage.bi(map);
    return Object.keys(map).map(function (k) { return '<span class="lang-' + k + '">' + (map[k] == null ? "" : map[k]) + "</span>"; }).join("");
  }
  var T = {
    passed: { en: "✓ Passed. This unit is recorded.", es: "✓ Aprobado. Esta unidad queda registrada.", fr: "✓ Réussi. Cette unité est enregistrée." },
    notYet: { en: "Not yet passed", es: "Aún no aprobado", fr: "Pas encore réussi" },
    locked: { en: "Locked. Review the lesson and try again in ", es: "Bloqueado. Repase la lección e inténtelo de nuevo en ", fr: "Bloqué. Révisez la leçon et réessayez dans " },
    minutes: { en: " minute(s).", es: " minuto(s).", fr: " minute(s)." },
    mcChecked: { en: "Multiple Choice", es: "Opción múltiple", fr: "Choix multiple" },
    written: { en: "Short Answer", es: "Respuesta corta", fr: "Réponse courte" },
    yourAnswer: { en: "Write your answer…", es: "Escriba su respuesta…", fr: "Écrivez votre réponse…" },
    correct: { en: "&#10003; Correct", es: "&#10003; Correcto", fr: "&#10003; Correct" },
    incorrect: { en: "&#10007; Incorrect", es: "&#10007; Incorrecto", fr: "&#10007; Incorrect" },
    correctAnswer: { en: " — correct answer: ", es: " — respuesta correcta: ", fr: " — bonne réponse : " },
    needMc: { en: "multiple choice", es: "opción múltiple", fr: "choix multiple" },
    needFill: { en: "fill in the blank", es: "complete el espacio", fr: "texte à compléter" },
    needSa: { en: "short answer", es: "respuesta corta", fr: "réponse courte" },
    need: { en: ", need ", es: ", necesita ", fr: ", requis " },
    submit: { en: "Submit", es: "Enviar", fr: "Envoyer" },
    model: { en: "Model answer — study this:", es: "Respuesta modelo — estúdiela:", fr: "Réponse modèle — étudiez-la :" }
  };

  // ---- a section: one scope, one attempt at a time -------------------------
  /* cfg (supplied by the family below):
       scope, keys { attempt, pending }, qids { mc:n, fill:n, sa:n } counts,
       passed(), markPassed(R), lock() -> epoch ms or 0, setLock(l), clearLock(),
       getMc(i), setMc(i,j), getSa(i), setSa(i,t), resetAnswers(),
       save(), draw(), say(html, colour), guess() -> {fill, sa} before the server has said,
       widget() -> the CTSFill widget or null, onFail(), nextHint */
  function Section(cfg) {
    var c = { cfg: cfg, S: null, attemptId: null, status: "idle", mcRes: {}, fillAns: {}, saRes: {}, busy: {},
              working: "", trouble: null, models: null, stopPoll: null, starting: null, mcBanked: false };
    function qid(kind, i) { return cfg.scope + "/" + kind + "/" + i; }
    c.qid = qid;
    function gid(a) { return a.gradeId != null ? a.gradeId : a.grade_id != null ? a.grade_id : null; }
    function info(a) {
      return { verdict: a.verdict, feedback: a.feedback || "", gradeId: gid(a), by: a.gradedBy || a.graded_by || null,
               answer: a.correctAnswer != null ? a.correctAnswer : null, text: a.answerText != null ? a.answerText : null };
    }
    function idxOf(a) { return typeof a === "number" ? a : typeof a === "string" && /^\d+$/.test(a) ? +a : -1; }
    c.lockedMin = function () { var l = cfg.lock(); return l > Date.now() ? Math.max(1, Math.ceil((l - Date.now()) / 60000)) : 0; };
    c.saCounts = function () { return c.S && c.S.needs ? !!c.S.needs.sa : cfg.guess().sa; };
    c.fillCounts = function () { return c.S && c.S.needs ? !!c.S.needs.fill : cfg.guess().fill; };

    function absorb(ans) {
      for (var i = 0; i < cfg.n.mc; i++) {
        var a = ans[qid("mc", i)];
        if (!a || a.choice == null) continue;
        var right = a.verdict ? a.verdict === "right" : !!a.right;
        cfg.setMc(i, +a.choice);
        c.mcRes[qid("mc", i)] = { right: right, answer: a.answer != null ? idxOf(a.answer) : (right ? +a.choice : -1), why: a.why };
      }
      for (var f = 0; f < cfg.n.fill; f++) {
        var fa = ans[qid("fill", f)];
        if (fa && fa.verdict) { fa.qid = qid("fill", f); c.fillAns[fa.qid] = fa; }
      }
      for (var s = 0; s < cfg.n.sa; s++) {
        var sa = ans[qid("sa", s)];
        if (!sa || !sa.verdict) continue;
        c.saRes[qid("sa", s)] = info(sa);
        var t = c.saRes[qid("sa", s)].text;
        if (t != null && !String(cfg.getSa(s) || "").trim()) cfg.setSa(s, t);
      }
      var w = cfg.widget();
      if (w) { w.absorb(Object.keys(c.fillAns).map(function (k) { return c.fillAns[k]; })); }
    }
    c.absorb = absorb;

    function applyAttempt(S) {
      c.S = S; c.attemptId = S.attemptId || null;
      c.mcRes = {}; c.saRes = {}; c.busy = {}; c.fillAns = {};
      var same = lsGet(cfg.keys.attempt) === c.attemptId;
      if (!same) cfg.resetAnswers();          // a new attempt: choices and fill-ins start empty, typed text stays
      lsSet(cfg.keys.attempt, c.attemptId);
      var w = cfg.widget(); if (w && w.resetLive) w.resetLive();
      var banked = S.banked || {};
      c.mcBanked = !!banked.mc;
      var ans = G.verdictsOf(S);
      var whyBy = {};
      ((S.items && S.items.mc) || []).forEach(function (m) { if (m && m.qid) whyBy[m.qid] = m.why; });
      Object.keys(whyBy).forEach(function (k) { if (ans[k] && ans[k].why === undefined) ans[k].why = whyBy[k]; });
      absorb(ans);
      (banked.sa || []).forEach(function (q) {
        var r = c.saRes[q] || (c.saRes[q] = { verdict: "met", feedback: "" });
        r.banked = true; r.verdict = "met";
      });
      var l = G.lockOf(S.lock);
      if (l) cfg.setLock(l); else cfg.clearLock();
      cfg.save();
    }

    function trouble(r, retry) { c.working = ""; c.trouble = { r: r, retry: retry }; cfg.draw(); }

    c.start = function () {
      if (c.stopPoll) { c.stopPoll(); c.stopPoll = null; }
      c.trouble = null; c.working = "";
      if (!G) { c.status = "idle"; trouble({ offline: true }, c.start); return Promise.resolve(false); }
      if (!G.registered()) { c.status = "unregistered"; cfg.draw(); return Promise.resolve(false); }
      if (cfg.passed()) { c.status = "passed"; cfg.draw(); return Promise.resolve(false); }
      c.status = "connecting"; cfg.draw();
      var pid = lsGet(cfg.keys.pending);
      return (pid ? G.calls.status(pid) : Promise.resolve(null)).then(function (pr) {
        if (pr && pr.unregistered) { c.status = "unregistered"; cfg.draw(); return false; }
        if (pr && !pr.ok && (pr.offline || pr.status >= 500 || pr.status === 429)) { c.status = "idle"; trouble(pr, c.start); return false; }
        if (pr && pr.ok && pr.data) {
          var st = String(pr.data.status || "");
          if (st === "pending") { c.pending(pid, pr.data); return false; }
          if (st === "passed") { lsDel(cfg.keys.pending); c.applyResult(pr.data, true); return false; }
          if (st === "failed") { lsDel(cfg.keys.pending); c.applyResult(pr.data, true); }
        } else if (pid) lsDel(cfg.keys.pending);
        return G.calls.attempt(cfg.scope, lang()).then(function (r) {
          if (r.unregistered) { c.status = "unregistered"; cfg.draw(); return false; }
          if (!r.ok) {
            var lk = r.data && r.data.lock;
            if (lk) { var l = G.lockOf(lk); if (l) cfg.setLock(l); c.status = "locked"; cfg.draw(); cfg.watchLock(); return false; }
            c.status = "idle"; trouble(r, c.start); return false;
          }
          var S = r.data || {};
          if (S.status === "passed") { c.pass(S, true); return false; }
          if (S.status === "pending" && S.attemptId) { c.pending(S.attemptId, S); return false; }
          applyAttempt(S);
          c.status = c.lockedMin() ? "locked" : "ready";
          cfg.draw(); cfg.watchLock();
          return c.status === "ready";
        });
      });
    };
    /* Resolves true when the section is ready for an answer. */
    c.ensure = function () {
      if (c.status === "ready") return Promise.resolve(true);
      if (c.status === "passed" || c.status === "pending") return Promise.resolve(false);
      if (c.starting) return c.starting;
      c.starting = c.start().then(function (ok) { c.starting = null; return ok; }, function () { c.starting = null; return false; });
      return c.starting;
    };

    c.mc = function (i, j) {
      var q = qid("mc", i);
      if (cfg.passed() || c.mcBanked || c.busy[q]) return;
      if (cfg.getMc(i) != null && c.mcRes[q]) return;
      if (c.lockedMin()) { cfg.draw(); return; }
      c.busy[q] = true; cfg.draw();
      c.ensure().then(function (ok) {
        if (!ok) { delete c.busy[q]; cfg.draw(); return; }
        if (c.mcRes[q]) { delete c.busy[q]; cfg.draw(); return; }
        G.calls.mc(c.attemptId, q, j).then(function (r) {
          delete c.busy[q];
          if (!r.ok || !r.data) return trouble(r, function () { c.trouble = null; c.mc(i, j); });
          cfg.setMc(i, j);
          var right = !!r.data.right;
          c.mcRes[q] = { right: right, answer: r.data.answer != null ? idxOf(r.data.answer) : (right ? j : -1), why: r.data.why === undefined ? null : r.data.why };
          cfg.save(); cfg.draw();
        });
      });
    };

    c.submit = function () {
      if (cfg.passed() || c.working) return;
      var m = c.lockedMin();
      if (m) { cfg.say(bi(T.locked) + m + bi(T.minutes), C_BAD); return; }
      if (!G.registered()) { c.status = "unregistered"; cfg.draw(); return; }
      c.working = "submitting"; c.trouble = null; cfg.draw();
      c.ensure().then(function (ok) {
        if (!ok) { c.working = ""; cfg.draw(); return; }
        var w = cfg.widget();
        function written() {
          var items = [];
          if (c.saCounts()) for (var i = 0; i < cfg.n.sa; i++) {
            if (!c.saRes[qid("sa", i)] && String(cfg.getSa(i) || "").trim()) items.push({ qid: qid("sa", i), answer: cfg.getSa(i) });
          }
          if (!items.length) return Promise.resolve(true);
          c.working = "reviewing"; cfg.draw();
          var chunks = []; while (items.length) chunks.push(items.splice(0, 10));
          return chunks.reduce(function (p, chunk) {
            return p.then(function (good) {
              if (!good) return false;
              return G.calls.grade(c.attemptId, chunk).then(function (r) {
                if (!r.ok || !r.data) { trouble(r, function () { c.trouble = null; c.submit(); }); return false; }
                var by = {}; (r.data.items || []).forEach(function (it) { if (it && it.qid) by[it.qid] = it; });
                absorb(by); cfg.save();
                return true;
              });
            });
          }, Promise.resolve(true));
        }
        (w ? w.sendUnchecked() : Promise.resolve(true)).then(function (good) {
          if (!good) { c.working = ""; cfg.draw(); return false; }
          return written();
        }).then(function (good) {
          if (!good) return;
          c.working = "submitting"; cfg.draw();
          return G.calls.submit(c.attemptId).then(function (r) {
            if (!r.ok || !r.data) return trouble(r, function () { c.trouble = null; c.submit(); });
            c.working = "";
            c.applyResult(r.data, false);
          });
        });
      });
    };

    c.applyResult = function (R, quiet) {
      absorb(G.verdictsOf(R));
      if (R.models) c.models = R.models;
      var st = String(R.status || "");
      if (st === "passed") return c.pass(R, quiet);
      if (st === "failed") return c.fail(R, quiet);
      return c.pending(c.attemptId, R);
    };

    c.pass = function (R, quiet) {
      c.status = "passed"; c.working = "";
      if (c.stopPoll) { c.stopPoll(); c.stopPoll = null; }
      lsDel(cfg.keys.pending); lsDel(cfg.keys.attempt);
      cfg.clearLock();
      cfg.markPassed(R);
      cfg.say(bi(T.passed), C_GOOD, "pass");
      cfg.draw();
    };

    function part(name, sc, counts) {
      if (!sc || !counts) return null;
      var need = sc.need != null ? sc.need : Math.ceil(sc.total * 0.9);
      if (sc.right >= need) return null;
      var k = { mc: T.needMc, fill: T.needFill, sa: T.needSa }[name];
      var t = " " + sc.right + "/" + sc.total + bi(T.need).replace(/<[^>]+>/g, "") + need;
      return { en: k.en + t, es: k.es + t, fr: k.fr + t };
    }
    c.fail = function (R, quiet) {
      c.status = "failed"; c.working = "";
      lsDel(cfg.keys.pending);
      if (c.stopPoll) { c.stopPoll(); c.stopPoll = null; }
      var l = G.lockOf(R.lock);
      if (l) cfg.setLock(l);
      var sc = R.scores || {};
      var parts = [part("mc", G.scoreOf(sc, "mc"), true), part("fill", G.scoreOf(sc, "fill"), c.fillCounts()), part("sa", G.scoreOf(sc, "sa"), c.saCounts())].filter(Boolean);
      var mins = c.lockedMin();
      var join = function (k) { return parts.length ? " — " + parts.map(function (p) { return p[k]; }).join("; ") : ""; };
      cfg.save();
      cfg.say(bi({ en: "Not yet passed" + join("en") + ". Review the lesson and try again" + (mins ? " in " + mins + " minute(s)" : "") + ".",
                   es: "Aún no aprobado" + join("es") + ". Repase la lección e inténtelo de nuevo" + (mins ? " en " + mins + " minuto(s)" : "") + ".",
                   fr: "Pas encore réussi" + join("fr") + ". Révisez la leçon et réessayez" + (mins ? " dans " + mins + " minute(s)" : "") + "." }), C_BAD, "fail");
      cfg.onFail && cfg.onFail(R);
      cfg.draw(); cfg.watchLock();
    };

    c.pending = function (id, R) {
      c.attemptId = id || c.attemptId;
      c.status = "pending"; c.working = "";
      if (c.attemptId) lsSet(cfg.keys.pending, c.attemptId);
      if (R && (R.answered || R.verdicts)) {
        if (!c.S || c.S.attemptId !== c.attemptId) applyAttempt(Object.assign({}, R, { attemptId: c.attemptId }));
        else absorb(G.verdictsOf(R));
      }
      cfg.say(bi(G.S.submittedPending) + '<span class="small" style="display:block;font-weight:400;color:#000">' + bi(G.S.pendingMore) + "</span>", C_WARN, "fail");
      if (c.stopPoll) c.stopPoll();
      c.stopPoll = G.poll(c.attemptId, function (reply) {
        var st = String(reply.status || "");
        if (st === "pending" || !st) { absorb(G.verdictsOf(reply)); cfg.draw(); return false; }
        c.stopPoll = null;
        c.applyResult(reply, false);
        return true;
      });
      cfg.save(); cfg.draw();
    };

    /* Reset: what was answered is final for the attempt; typing is not. */
    c.reset = function () {
      for (var i = 0; i < cfg.n.sa; i++) if (!c.saRes[qid("sa", i)]) cfg.setSa(i, "");
      cfg.save(); cfg.say("", "#000"); cfg.draw();
    };
    /* The wait is over: the next use starts a fresh attempt. */
    c.afterLock = function () {
      if (c.status === "failed" || c.status === "locked") {
        c.status = "idle"; c.S = null; c.mcRes = {}; c.saRes = {}; c.fillAns = {}; c.busy = {}; c.models = null;
        lsDel(cfg.keys.attempt);
        cfg.resetAnswers(); var w = cfg.widget(); if (w && w.resetLive) w.resetLive();
        cfg.clearLock(); cfg.say("", "#000"); cfg.save(); cfg.draw();
      }
    };

    // ---- drawing helpers shared by both families -------------------------
    c.notes = function () {
      var h = "";
      if (c.status === "unregistered") h += G.registerHtml(bi, false);
      else if (c.status === "connecting") h += '<p class="small" role="status">' + bi(G.S.connecting) + "</p>";
      if (c.working) h += '<p class="small" role="status" style="font-weight:600">' + bi(c.working === "reviewing" ? G.S.reviewing : G.S.submitting) + "</p>";
      if (c.trouble) h += G.troubleHtml(c.trouble.r, bi);
      var m = c.lockedMin();
      if (m && c.status !== "passed") h += '<p class="small" role="status" style="color:' + C_BAD + ';font-weight:600">' + bi(T.locked) + m + bi(T.minutes) + "</p>";
      return h;
    };
    c.closed = function () { return cfg.passed() || c.status === "pending" || c.status === "failed" || !!c.lockedMin() || c.status === "unregistered"; };
    c.verdict = function (kind, qidv, res, i) {
      if (!res) return "";
      var v = res.verdict, col = (v === "right" || v === "met") ? C_GOOD : v === "pending" || v === "partly" ? C_WARN : C_BAD;
      var mark = (v === "right" || v === "met") ? "&#10003; " : v === "pending" ? "" : v === "partly" ? "&#9680; " : "&#10007; ";
      var h = '<div class="feedback show ' + (v === "met" || v === "right" ? "correct" : "incorrect") + '" style="color:' + col + '"><strong>' + mark + bi(G.S[v] || G.S.pending) + "</strong>";
      if (res.banked) h += ' <span class="small" style="font-weight:400">· ' + bi(G.S.kept) + "</span>";
      if (res.feedback) h += '<span class="small cts-grade-feedback" style="display:block;font-weight:400">' + esc(res.feedback) + "</span>";
      h += "</div>";
      if ((v === "not_met" || v === "partly") && !res.banked) {
        var ap = { gradeId: res.gradeId, attemptId: c.attemptId, qid: qidv };
        G.appeal.remember(ap); h += G.appeal.html(ap, bi);
      }
      return h;
    };
    c.mcFeedback = function (i, chosen) {
      var res = c.mcRes[qid("mc", i)];
      if (c.busy[qid("mc", i)]) return '<span role="status">' + bi(G.S.checking) + "</span>";
      if (!res || chosen == null) return "";
      var right = res.right ? chosen : res.answer;
      var h = res.right ? "<strong>" + bi(T.correct) + "</strong>"
        : "<strong>" + bi(T.incorrect) + (right >= 0 ? bi(T.correctAnswer) + String.fromCharCode(65 + right) : "") + "</strong>";
      if (res.why) h += " " + esc(res.why);
      return h;
    };
    return c;
  }

  function wire(root, handlers) {
    handlers.forEach(function (h) {
      root.querySelectorAll(h.sel).forEach(function (n) { n.addEventListener(h.ev, function (e) { h.fn(n, e); }); });
    });
  }

  // ======================================================================
  // Family 1: Counseling, Narrative Preaching, WiseSpeak Preaching
  // ======================================================================
  function units(o) {
    var secs = {};
    function st(n) { return state.unitState[n]; }
    function cfgFor(n) {
      var cfg = {
        scope: o.scopePrefix + n,
        keys: { attempt: "cts_" + o.course + "_u" + n + "_attempt", pending: "cts_" + o.course + "_u" + n + "_pending" },
        n: { mc: (UNITS[n].mcq || []).length, fill: 0, sa: (UNITS[n][o.saKey] || []).length },
        passed: function () { return !!st(n).passed; },
        markPassed: function () {
          st(n).passed = true; st(n).lockedUntil = 0; saveState(); renderUnitNav(); updateProgress();
          if (window.CTS_SYNC) { try { window.CTS_SYNC.sync(); } catch (e) {} }
        },
        lock: function () { return st(n).lockedUntil || 0; },
        setLock: function (l) { st(n).lockedUntil = l.until; },
        clearLock: function () { st(n).lockedUntil = 0; },
        getMc: function (i) { var v = st(n).mcq[i]; return v === undefined ? null : v; },
        setMc: function (i, j) { st(n).mcq[i] = j; },
        getSa: function (i) { return (st(n)[o.saKey] || [])[i] || ""; },
        setSa: function (i, t) { if (!st(n)[o.saKey]) st(n)[o.saKey] = []; st(n)[o.saKey][i] = t; },
        resetAnswers: function () {
          st(n).mcq = st(n).mcq.map(function () { return null; });
          var k = cfg.n.fill;
          st(n).fillAnswers = new Array(k).fill(""); st(n).fillChecked = new Array(k).fill(false);
        },
        save: function () { saveState(); },
        draw: function () { draw(n); },
        say: function (html, colour, cls) {
          var r = $("result_" + n); if (!r) return;
          r.className = "unit-result" + (html ? " show " + (cls || "fail") : "");
          r.innerHTML = html ? '<span style="color:' + colour + '">' + html + "</span>" : "";
        },
        guess: function () {
          var masters = !!state.registration && state.registration.track !== "cert" && !ctsIsAssociate();
          return { fill: ctsIsAssociate() || masters, sa: masters };
        },
        widget: function () { return widget(n); },
        watchLock: function () { watch(n); }
      };
      cfg.n.fill = (window.CTSFill ? CTSFill.questions(o.fillKey, n) : []).length;
      return cfg;
    }
    function sec(n) { return secs[n] || (secs[n] = Section(cfgFor(n))); }
    var widgets = {}, timers = {};
    function widget(n) {
      if (widgets[n]) return widgets[n];
      var qs = window.CTSFill ? CTSFill.questions(o.fillKey, n) : [];
      var mcq = $("mcq_" + n);
      if (!qs.length || !mcq || !st(n)) return null;
      var host = $("fill_" + n);
      if (!host) { host = document.createElement("div"); host.id = "fill_" + n; mcq.after(host); }
      var c = sec(n);
      widgets[n] = CTSFill.mount({
        host: host, questions: qs, state: st(n),
        counts: function () { return c.fillCounts(); },
        lockedUntil: function () { return st(n).lockedUntil || 0; },
        passed: function () { return !!st(n).passed; },
        save: saveState,
        live: { attemptId: function () { return c.attemptId; }, ensure: function () { return c.ensure(); }, onChecked: function () {} }
      });
      return widgets[n];
    }
    function watch(n) {
      if (timers[n]) clearTimeout(timers[n]);
      var l = st(n).lockedUntil || 0;
      if (l > Date.now()) timers[n] = setTimeout(function () { sec(n).afterLock(); }, l - Date.now() + 300);
    }

    function draw(n) {
      var unit = UNITS[n]; if (!unit) return;
      var mcHost = $("mcq_" + n), saHost = $("essay_" + n);
      if (!mcHost) return;
      var c = sec(n), s = st(n), closed = c.closed();
      var h = '<div class="cts-live-notes">' + c.notes() + "</div>";
      unit.mcq.forEach(function (q, i) {
        var chosen = c.cfg.getMc(i), res = c.mcRes[c.qid("mc", i)], answered = chosen != null && !!res, busy = !!c.busy[c.qid("mc", i)];
        var cls = answered ? (res.right ? " correct" : " incorrect") : "";
        h += '<div class="question-card"><div class="question-text">' + (i + 1) + ". " + bi({ en: q.textEn, es: q.textEs, fr: q.textFr }) + '</div><div class="options">';
        q.options.forEach(function (opt, j) {
          h += '<label class="option' + (chosen === j ? " selected" : "") + '"><input type="radio" name="u' + n + "q" + i + '" value="' + j + '" data-live-mc="' + i + "," + j + '"' +
               (chosen === j ? " checked" : "") + (answered || busy || (closed && !answered) || c.mcBanked ? " disabled" : "") + "><span>" +
               String.fromCharCode(65 + j) + ". " + bi({ en: opt.en, es: opt.es, fr: opt.fr }) + "</span></label>";
        });
        h += '</div><div class="feedback' + (answered ? " show" + cls : "") + '" id="fb_' + n + "_" + i + '">' + c.mcFeedback(i, chosen) + "</div></div>";
      });
      mcHost.innerHTML = h;
      wire(mcHost, [{ sel: "input[data-live-mc]", ev: "change", fn: function (inp) { var p = inp.getAttribute("data-live-mc").split(","); c.mc(+p[0], +p[1]); } }]);
      wire(mcHost, [{ sel: "[data-cts-retry]", ev: "click", fn: function () { var t = c.trouble; c.trouble = null; if (t && t.retry) t.retry(); else c.start(); } }]);
      var w = widget(n); if (w) w.render();
      if (saHost && unit[o.saKey]) {
        var counts = c.saCounts(), sh = '<div class="essay-header"><small>' + bi(T.written) + "</small></div>";
        sh += '<div class="essay-optional-note"><span class="small cts-ai-note">' + bi(counts ? G.S.aiNote : G.S.notGraded) + "</span></div>";
        unit[o.saKey].forEach(function (q, i) {
          var res = c.saRes[c.qid("sa", i)], txt = String(c.cfg.getSa(i) || ""), banked = !!(res && res.banked);
          var ro = !!res || closed;
          sh += '<div class="essay-card"><div class="essay-prompt">' + (i + 1) + ". " + bi({ en: q[o.saText.en], es: q[o.saText.es], fr: q[o.saText.fr] }) + "</div>";
          if (banked && !txt.trim()) sh += '<p class="small">' + bi(G.S.keptNoText) + "</p>";
          else sh += '<textarea data-live-sa="' + i + '" placeholder="' + esc(T.yourAnswer[lang()]) + '" aria-label="Short answer"' + (ro ? " readonly" : "") + ">" + txt.replace(/</g, "&lt;") + "</textarea>";
          sh += c.verdict("sa", c.qid("sa", i), res, i);
          if (c.models && c.models[c.qid("sa", i)] && txt.trim()) sh += '<div class="model-answer"><strong>' + bi(T.model) + "</strong> " + bi(c.models[c.qid("sa", i)]) + "</div>";
          sh += "</div>";
        });
        saHost.innerHTML = sh; saHost.style.display = "block";
        wire(saHost, [
          { sel: "textarea[data-live-sa]", ev: "input", fn: function (t) { c.cfg.setSa(+t.getAttribute("data-live-sa"), t.value); saveState(); } }
        ]);
      }
      var sb = document.querySelector('#unit' + n + ' .submit-btn'); if (sb) sb.disabled = !!(c.working || s.passed || c.status === "unregistered");
    }

    // the page's own functions, now live
    window.renderQuiz = function (n) { draw(n); };
    window.answerMCQ = function () {};
    window.fillFor = function (n) { return widget(n); };
    window.submitUnit = function (n) {
      if (!UNITS[n]) return;
      if (!state.registration && !(G && G.registered())) { alert(lang() === "es" ? "Por favor regístrese primero" : lang() === "fr" ? "Veuillez d’abord vous inscrire" : "Please register first"); return; }
      sec(n).submit();
    };
    window.resetUnit = function (n) { sec(n).reset(); };
    G.appeal.onChange(function () { Object.keys(secs).forEach(function (n) { draw(+n); }); });
    document.addEventListener("cts:langchange", function () { Object.keys(secs).forEach(function (n) { draw(+n); }); });

    /* On load: a section the student has begun (an attempt not yet passed) is picked up again,
       so its answers, wait or pending result show; the others start when they are used. */
    function pickUp() {
      o.units.forEach(function (n) {
        if (!UNITS[n] || !st(n)) return;
        var c = sec(n);
        if (!st(n).passed && (lsGet(c.cfg.keys.attempt) || lsGet(c.cfg.keys.pending))) c.start();
        else if ((st(n).lockedUntil || 0) > Date.now()) { c.status = "locked"; watch(n); }
      });
    }
    // the page's own start-up (state, registration) runs after this file: pick up once it has
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", pickUp); else setTimeout(pickUp, 0);
    window.CTS_SINGLE_LIVE = { section: sec };
  }

  // ======================================================================
  // Family 2: Pastoral & Christian Ethics (a page per unit)
  // ======================================================================
  function ethics(o) {
    var N = UNIT;
    var letter = function (j) { return String.fromCharCode(65 + j); };
    function lockFor() {
      var full = parseInt(lsGet(FULL_LOCK_KEY) || "0", 10), sa = mcPreviouslyPassed ? parseInt(lsGet(SA_LOCK_KEY) || "0", 10) : 0;
      return Math.max(full, sa);
    }
    var cfg = {
      scope: o.scope,
      keys: { attempt: "cts_ethics_u" + N + "_attempt", pending: "cts_ethics_u" + N + "_pending" },
      n: { mc: mcQuestions.length, fill: (window.CTSFill ? CTSFill.questions("ethics", N) : []).length, sa: kwQuestions.length },
      passed: function () { return unitPassed; },
      markPassed: function () {
        progress["unit" + UNIT] = true;
        lsSet(PROGRESS_KEY, JSON.stringify(progress)); ctsRecordEthics();
        lsSet(MC_PASS_KEY, "true"); mcPreviouslyPassed = true; unitPassed = true;
        lsDel(SA_LOCK_KEY); lsDel(FULL_LOCK_KEY);
        var nb = $("nextUnitBtn"); if (nb) nb.disabled = false;
        updateProgressGrid();
        // tell the seminary's records and learn from them whether the course is now complete
        if (window.CTS_SYNC) { try { window.CTS_SYNC.sync(); } catch (e) {} }
      },
      lock: lockFor,
      setLock: function (l) {
        lsDel(SA_LOCK_KEY); lsDel(FULL_LOCK_KEY);
        if (l.until > Date.now()) lsSet(l.part === "sa" ? SA_LOCK_KEY : FULL_LOCK_KEY, String(l.until));
        if (l.part === "sa") { lsSet(MC_PASS_KEY, "true"); mcPreviouslyPassed = true; }
      },
      clearLock: function () { lsDel(SA_LOCK_KEY); lsDel(FULL_LOCK_KEY); },
      getMc: function (i) { var v = mcAnswers[i]; return v ? v.charCodeAt(0) - 65 : null; },
      setMc: function (i, j) { mcAnswers[i] = letter(j); },
      getSa: function (i) { return kwAnswers[i] || ""; },
      setSa: function (i, t) { kwAnswers[i] = t; },
      resetAnswers: function () { mcAnswers = new Array(mcQuestions.length).fill(null); var k = cfg.n.fill; fillState.fillAnswers = new Array(k).fill(""); fillState.fillChecked = new Array(k).fill(false); },
      save: function () { saveState(); },
      draw: function () { drawEthics(); },
      say: function (html, colour) { var r = $("examResult"); if (r) r.innerHTML = html ? '<span style="color:' + colour + '">' + html + "</span>" : ""; },
      guess: function () { var t = fillTrack(); var m = isMastersLevel(t); return { fill: ctsIsAssociate() || m, sa: m && !ctsIsAssociate() }; },
      widget: function () { return widget(); },
      watchLock: function () { watch(); }
    };
    var c = Section(cfg), w = null, timer = null;
    function widget() {
      if (w) return w;
      var qs = window.CTSFill ? CTSFill.questions("ethics", N) : [];
      if (!qs.length) return null;
      w = CTSFill.mount({
        host: fillHost, questions: qs, state: fillState,
        counts: function () { return c.fillCounts(); },
        lockedUntil: function () { return lockFor(); },
        passed: function () { return unitPassed; },
        save: saveState,
        live: { attemptId: function () { return c.attemptId; }, ensure: function () { return c.ensure(); }, onChecked: function () {} }
      });
      return w;
    }
    function watch() {
      if (timer) clearTimeout(timer);
      var l = lockFor();
      if (l > Date.now()) timer = setTimeout(function () { c.afterLock(); }, l - Date.now() + 300);
    }
    function drawEthics() {
      var box = $("questionsContainer"); if (!box) return;
      // the French page runs the English branch of the page script, carrying French (tools/french-static-courses.mjs)
      currentLang = document.body.classList.contains("lang-es") ? "es" : "en";
      var closed = c.closed();
      var h = '<div class="cts-live-notes">' + c.notes() + "</div>";
      h += "<h3>" + bi({ en: "Multiple Choice (Questions 1–20)", es: "Opción múltiple (Preguntas 1–20)", fr: "Choix multiple (questions 1 à 20)" }) + "</h3>";
      if (c.mcBanked) h += '<p class="small">' + bi(G.S.mcKept) + "</p>";
      mcQuestions.forEach(function (q, i) {
        var chosen = cfg.getMc(i), res = c.mcRes[c.qid("mc", i)], answered = chosen != null && !!res, busy = !!c.busy[c.qid("mc", i)];
        var right = answered ? (res.right ? chosen : res.answer) : -1;
        h += '<div class="question"><p style="font-weight:bold;">' + (currentLang === "en" ? q.textEn : q.textEs) + "</p>";
        (currentLang === "en" ? q.optionsEn : q.optionsEs).forEach(function (opt, j) {
          var k = "option" + (chosen === j ? " selected" : "") + (answered ? (j === right ? " correct" : j === chosen ? " wrong" : "") : "");
          h += '<button class="' + k + '" type="button" data-live-mc="' + i + "," + j + '"' + (busy || answered || closed || c.mcBanked ? " disabled" : "") + ">" + letter(j) + ". " + opt + "</button>";
        });
        if (busy || answered) h += '<div class="feedback-text ' + (answered ? (res.right ? "correct" : "incorrect") : "") + '">' + c.mcFeedback(i, chosen) + "</div>";
        h += "</div>";
      });
      box.innerHTML = h;
      box.appendChild(fillHost);
      var wd = widget(); if (wd) wd.render();
      var sh = '<h3 style="margin-top:30px;">' + bi({ en: "Short Answer (21–30) — M.Div. / Th.M. Track", es: "Respuesta corta (21–30) — M.Div. / Th.M.", fr: "Réponse courte (21 à 30) — parcours M.Div. / Th.M." }) + "</h3>";
      sh += '<p class="small cts-ai-note">' + bi(c.saCounts() ? G.S.aiNote : G.S.notGraded) + "</p>";
      kwQuestions.forEach(function (q, i) {
        var res = c.saRes[c.qid("sa", i)], txt = String(cfg.getSa(i) || ""), banked = !!(res && res.banked), ro = !!res || closed;
        sh += '<div class="question"><p style="font-weight:bold;">' + (currentLang === "en" ? q.textEn : q.textEs) + "</p>";
        if (banked && !txt.trim()) sh += '<p class="small">' + bi(G.S.keptNoText) + "</p>";
        else sh += '<textarea class="kw-answer" rows="3" data-live-sa="' + i + '" placeholder="' + esc(T.yourAnswer[lang()]) + '"' + (ro ? " readonly" : "") + ">" + txt.replace(/</g, "&lt;") + "</textarea>";
        sh += c.verdict("sa", c.qid("sa", i), res, i).replace(/class="feedback /, 'class="feedback-text ');
        if (c.models && c.models[c.qid("sa", i)] && txt.trim()) sh += '<div class="model-answer"><strong>' + bi(T.model) + "</strong> " + bi(c.models[c.qid("sa", i)]) + "</div>";
        sh += "</div>";
      });
      var tail = document.createElement("div"); tail.id = "cts-live-sa"; tail.innerHTML = sh; box.appendChild(tail);
      wire(box, [
        { sel: "button[data-live-mc]", ev: "click", fn: function (b) { var p = b.getAttribute("data-live-mc").split(","); c.mc(+p[0], +p[1]); } },
        { sel: "textarea[data-live-sa]", ev: "input", fn: function (t) { cfg.setSa(+t.getAttribute("data-live-sa"), t.value); saveState(); } },
        { sel: "[data-cts-retry]", ev: "click", fn: function () { var t = c.trouble; c.trouble = null; if (t && t.retry) t.retry(); else c.start(); } }
      ]);
      var sb = $("submitExamBtn"); if (sb) sb.disabled = !!(c.working || unitPassed || c.status === "unregistered" || c.status === "pending");
      var nt = $("mcBankedNotice"); if (nt) nt.style.display = "none";
      if (unitPassed && !c.working) cfg.say(bi(T.passed), C_GOOD);
    }
    window.renderQuestions = drawEthics;
    window.checkLockouts = function () { drawEthics(); return !unitPassed && !c.lockedMin(); };
    window.submitExam = function () {
      var s = null; try { s = JSON.parse(lsGet("cts_student") || "null"); } catch (e) {}
      if (!(s && s.name)) { alert(lang() === "es" ? "Por favor regístrese primero." : lang() === "fr" ? "Veuillez d’abord vous inscrire." : "Please register first."); return; }
      c.submit();
    };
    window.resetUnit = function () { c.reset(); };
    G.appeal.onChange(drawEthics);
    var sbtn = $("submitExamBtn"), rbtn = $("resetExamBtn");
    if (sbtn) sbtn.onclick = function () { window.submitExam(); };
    if (rbtn) rbtn.onclick = function () { window.resetUnit(); };
    if (!unitPassed && (lsGet(cfg.keys.attempt) || lsGet(cfg.keys.pending))) c.start();
    else if (lockFor() > Date.now()) { c.status = "locked"; watch(); }
    drawEthics();
    window.CTS_SINGLE_LIVE = { section: function () { return c; } };
  }

  window.CTSSingleLive = { units: units, ethics: ethics };
})();
