/* Shadow mode (docs/ai-grading.md section 1): the production trial before the
 * switch date. The page and the browser's grading are exactly what they were;
 * this one small script also tells the seminary what was submitted, so the AI
 * can grade the same answers and the two can be compared. The student sees
 * nothing, and nothing here can change a grade, a lock or a page.
 *
 * cts-engine.js and cts-textbook.js announce each submitted attempt as a
 * "cts:submitted" event on document, with
 *   { scope?, answers: [{ kind, index, answer | choice }], clientResult }.
 * The question ids are the contract's (section 2), built here from the page's
 * own address because a shadow-mode page carries no ids: that keeps it
 * byte-for-byte what it was.
 *
 * Fire-and-forget: one POST, errors swallowed, never awaited.
 */
(function () {
  "use strict";
  var API = window.CTS_SYNC_API || "/api";

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* u:<Prefix>/<n> from /CTSJohnUnit3.html (also under /es/ and /fr/). */
  function unitScope() {
    var m = /([^/]+?)Unit(\d+)\.html$/.exec(location.pathname);
    return m ? "u:" + m[1] + "/" + m[2] : null;
  }

  document.addEventListener("cts:submitted", function (ev) {
    try {
      var d = ev.detail || {}, code = get("cts_student_code");
      var scope = d.scope || unitScope();
      if (!code || !scope) return;
      var lang = (document.documentElement.lang || get("cts_lang") || "en").toLowerCase().split("-")[0];
      var answers = (d.answers || []).map(function (a) {
        var o = { qid: a.qid || scope + "/" + a.kind + "/" + a.index };
        if (a.choice != null) o.choice = a.choice;
        if (a.answer != null) o.answer = a.answer;
        return o;
      });
      fetch(API + "/shadow", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: code, scope: scope, lang: lang, answers: answers, clientResult: d.clientResult || null }),
        credentials: "omit",
        keepalive: true
      }).catch(function () {});
    } catch (e) {}
  });
})();
