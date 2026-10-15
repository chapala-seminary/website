/* Shadow mode for the single-page courses (docs/ai-grading.md section 1): Counseling,
 * Narrative and WiseSpeak Preaching, and Ethics. The page and its own grading are
 * exactly what they were; this announces each unit the student submits as a
 * "cts:submitted" event, which cts-shadow.js posts to /api/shadow. It wraps the
 * page's own submit function, reads the answers BEFORE it runs (a failed fill-in
 * set is cleared by it) and the outcome after, and changes nothing.
 * Question ids are the contract's: sp:<page>/<mc|fill|sa>/<i>.
 */
(function () {
  "use strict";
  var cfg = window.CTS_SHADOW_SINGLE;
  if (!cfg) return;
  function send(scope, answers, result) {
    try { document.dispatchEvent(new CustomEvent("cts:submitted", { detail: { scope: scope, answers: answers, clientResult: result } })); } catch (e) {}
  }
  function letterIdx(l) { return typeof l === "string" && l ? l.charCodeAt(0) - 65 : null; }

  if (cfg.family === "ethics" && typeof window.submitExam === "function") {
    var origE = window.submitExam;
    window.submitExam = function () {
      var snap = null;
      try {
        var s = JSON.parse(localStorage.getItem("cts_student") || "null");
        if (s && s.name && !unitPassed) snap = {
          mc: mcAnswers.slice(), sa: kwAnswers.slice(),
          fill: (fillState.fillAnswers || []).slice(), fillN: (fillState.fillAnswers || []).length
        };
      } catch (e) {}
      var r = origE.apply(this, arguments);
      try {
        if (snap) {
          var a = [], right = 0;
          snap.mc.forEach(function (l, i) {
            var j = letterIdx(l); if (j == null) return;
            a.push({ kind: "mc", index: i, choice: j }); if (j === mcQuestions[i].correct) right++;
          });
          snap.fill.forEach(function (t, i) { if (String(t || "").trim()) a.push({ kind: "fill", index: i, answer: String(t) }); });
          snap.sa.forEach(function (t, i) { if (String(t || "").trim()) a.push({ kind: "sa", index: i, answer: String(t) }); });
          send(cfg.scope, a, { mc: { right: right, total: mcQuestions.length }, passed: !!unitPassed });
        }
      } catch (e) {}
      return r;
    };
  }

  if (cfg.family === "units" && typeof window.submitUnit === "function") {
    var origU = window.submitUnit;
    window.submitUnit = function (n) {
      var snap = null;
      try {
        var u = state.unitState[n];
        if (state.registration && u && !(u.lockedUntil && u.lockedUntil > Date.now())) snap = {
          mc: (u.mcq || []).slice(), sa: (u[cfg.saKey] || []).slice(), fill: (u.fillAnswers || []).slice(), was: !!u.passed
        };
      } catch (e) {}
      var r = origU.apply(this, arguments);
      try {
        if (snap && !snap.was) {
          var a = [], right = 0;
          snap.mc.forEach(function (j, i) {
            if (j == null) return;
            a.push({ kind: "mc", index: i, choice: j }); if (j === UNITS[n].mcq[i].correct) right++;
          });
          snap.fill.forEach(function (t, i) { if (String(t || "").trim()) a.push({ kind: "fill", index: i, answer: String(t) }); });
          snap.sa.forEach(function (t, i) { if (String(t || "").trim()) a.push({ kind: "sa", index: i, answer: String(t) }); });
          send(cfg.scopePrefix + n, a, { mc: { right: right, total: UNITS[n].mcq.length }, passed: !!state.unitState[n].passed });
        }
      } catch (e) {}
      return r;
    };
  }
})();
