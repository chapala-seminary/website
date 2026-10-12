/* A course certificate on the M.Div. and Th.M. tracks waits for the course's
 * textbook test (Dr. Cook, 4 Oct 2026). Loaded by the certificate pages of
 * the nine courses that have a Master's textbook, each of which names it:
 *     <body data-textbook="cults" data-textbook-page="CTSTextbookCults">
 * The page's own script decides the units are done and shows the diploma; if
 * the student is on a master's track and the test is not passed, this hides
 * the diploma and says what is missing. cts-certify.js registers only a
 * visible diploma, and the Worker refuses the award on its own
 * (worker/awards.js), so nothing is issued meanwhile. The Certificate and
 * Associate tracks are not held.
 *
 * A course may require two tests -- its textbook and its five readings (9 Oct
 * 2026). When the page also loads cts-required-tests.js (generated from
 * worker/catalog.json), the tests come from there, by the certificate's
 * completion code, and the diploma waits for every one that counts: a
 * required-reading test with a `requiredFrom` counts from that moment (null:
 * not yet in force), and not where the student record held a master's
 * completion of the course before it (cts_textbook_<slug>_exempt, kept by
 * cts-sync.js from what the Worker says). Without that script the page's own
 * data-textbook attributes are the one test, as before.
 */
(function () {
  "use strict";
  var b = document.body;
  var slug = b && b.getAttribute("data-textbook"), page = b && b.getAttribute("data-textbook-page");
  // data-textbook-kind="reading": a required-reading test (Genesis, World Religions), the same hold in its own words
  var reading = b && b.getAttribute("data-textbook-kind") === "reading";
  /* The certificate's completion code, as tools/gen-worker-catalog.mjs derives
     it: named on <body>, or from the page's file name. */
  function pageCode() {
    var named = b && b.getAttribute("data-course-code");
    if (named) return named.toUpperCase();
    var f = String(location.pathname.split("/").pop() || "").toLowerCase();
    var c = f.replace(/(thm|mth|mdiv)?certificate\.html$/, "").toUpperCase();
    return c === "ETHICS_" ? "ETHICS" : c;
  }
  var map = window.CTS_REQUIRED_TESTS, code = pageCode();
  var tests = map && code && Object.prototype.hasOwnProperty.call(map, code) ? map[code]
    : (slug && page ? [{ slug: slug, page: page, kind: reading ? "reading" : "textbook" }] : []);
  if (!tests.length) return;
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function counts(t) {
    if (!("requiredFrom" in t)) return true;
    if (t.requiredFrom == null) return false;
    var from = Date.parse(t.requiredFrom);
    if (isNaN(from) || Date.now() < from) return false;
    return !get("cts_textbook_" + t.slug + "_exempt");
  }
  function pending() { return tests.filter(function (t) { return counts(t) && !get("cts_textbook_" + t.slug + "_passed"); }); }
  function track() {
    var s = {}; try { s = JSON.parse(get("cts_student") || "null") || {}; } catch (e) {}
    return String(get("cts_track") || s.track || s.program || "").toLowerCase();
  }
  function masters() { var t = track(); return t === "mdiv" || t === "thm" || t === "mth" || /master/.test(t); }
  function isEs() { return !!(b.classList.contains("lang-es") || b.classList.contains("es") || b.classList.contains("spanish")); }
  /* Every element the certificate scripts take for the diploma (cts-certify.js,
     cts-completion.js, cts-emblem.js use the same list): some pages wrap it in
     a second container, and a visible wrapper is a visible diploma to them. */
  var SELS = "#diploma, #cert-wrap, .diploma, #certificate, .certificate, #cert, .cert-wrap, .sheet, #certCard";
  function diplomas() { return Array.prototype.slice.call(document.querySelectorAll(SELS)); }
  var note = null, shown = null;      // what the page shows now: the observer must find nothing to change
  function gate() {
    var left = masters() ? pending() : [];
    var hold = left.length > 0;
    var dips = diplomas();
    if (!dips.length) return;
    var dip = dips[0];
    /* Hidden by this script only while the test is still to pass; when it is
       passed each element gets back exactly the inline display the page's own
       script gave it (several pages show the diploma by setting it). Nothing
       is touched unless it has to change: the observer below fires on every
       change, including this function's own. */
    var print = document.querySelector("#printBtn, #cts-cert-pdf");
    (print ? dips.concat([print]) : dips).forEach(function (d) {
      if (hold) {
        if (d.getAttribute("data-cts-gate") === null) { d.setAttribute("data-cts-gate", d.style.display); }
        if (d.style.display !== "none") d.style.display = "none";
      } else if (d.getAttribute("data-cts-gate") !== null) {
        var was = d.getAttribute("data-cts-gate");
        d.removeAttribute("data-cts-gate");
        if (d.style.display !== was) d.style.display = was;
      }
    });
    if (hold && !note) {
      note = document.createElement("div");
      note.id = "cts-textbook-hold";
      note.setAttribute("role", "status");
      note.style.cssText = "max-width:760px;margin:18px auto;padding:16px 20px;border:2px solid #b08324;border-radius:12px;background:#fbf6ea;color:#2a241d;font-family:Georgia,serif;line-height:1.5";
      dip.parentNode.insertBefore(note, dip);
    }
    if (!note) return;
    /* Some pages hide the diploma's whole wrapper until the units are done
       (Doctrinal Preaching), and the note went with it, so a master's student
       there never learned the test was needed. Put it before the outermost
       hidden wrapper instead. */
    if (hold && note.offsetParent === null) {
      var top = null;
      for (var a = note.parentNode; a && a !== b; a = a.parentNode)
        if (window.getComputedStyle(a).display === "none") top = a;
      if (top && note.nextSibling !== top) top.parentNode.insertBefore(note, top);
    }
    var state = (hold ? "hold" : "clear") + ":" + (isEs() ? "es" : "en") + ":" + left.map(function (t) { return t.slug; }).join(",");
    if (state === shown) return;
    shown = state;
    note.style.display = hold ? "" : "none";
    if (!hold) return;
    if (left.length > 1) {
      var tb = left.filter(function (t) { return t.kind !== "reading"; })[0] || left[0];
      var rd = left.filter(function (t) { return t.kind === "reading"; })[0] || left[1];
      note.innerHTML = isEs()
        ? "<strong>Faltan dos exámenes.</strong> En los trayectos M.Div. y Th.M. este curso se completa, y su certificado se emite, cuando también se aprueban el examen del libro de texto y el examen de lecturas requeridas; cada uno se aprueba por separado. " +
          '<a href="' + tb.page + 'Test.html">Examen del libro</a> &nbsp;·&nbsp; <a href="' + rd.page + 'Test.html">Examen de lecturas requeridas</a>'
        : "<strong>Two tests are still to pass.</strong> On the M.Div. and Th.M. tracks this course is complete, and its certificate issued, when the textbook test and the required-reading test are both passed as well; each is passed on its own. " +
          '<a href="' + tb.page + 'Test.html">The textbook test</a> &nbsp;·&nbsp; <a href="' + rd.page + 'Test.html">The required-reading test</a>';
      return;
    }
    reading = left[0].kind === "reading";
    page = left[0].page;
    note.innerHTML = reading
      ? (isEs()
        ? "<strong>Falta el examen de lecturas requeridas.</strong> En los trayectos M.Div. y Th.M. este curso se completa, y su certificado se emite, cuando también se aprueba el examen de lecturas requeridas. " +
          '<a href="' + page + 'Test.html">Presentar el examen</a> &nbsp;·&nbsp; <a href="' + page + '.html">Las lecturas</a>'
        : "<strong>The required-reading test is still to pass.</strong> On the M.Div. and Th.M. tracks this course is complete, and its certificate issued, when the required-reading test is passed as well. " +
          '<a href="' + page + 'Test.html">Take the test</a> &nbsp;·&nbsp; <a href="' + page + '.html">The readings</a>')
      : isEs()
      ? "<strong>Falta el examen del libro de texto.</strong> En los trayectos M.Div. y Th.M. este curso se completa, y su certificado se emite, cuando también se aprueba el examen del libro de texto. " +
        '<a href="' + page + 'Test.html">Presentar el examen del libro</a> &nbsp;·&nbsp; <a href="' + page + '.html">Leer el libro</a>'
      : "<strong>The textbook test is still to pass.</strong> On the M.Div. and Th.M. tracks this course is complete, and its certificate issued, when the textbook test is passed as well. " +
        '<a href="' + page + 'Test.html">Take the textbook test</a> &nbsp;·&nbsp; <a href="' + page + '.html">Read the textbook</a>';
  }
  function start() {
    gate();
    // the page's own script may draw the diploma after this runs, and the language switches by a class on <body>
    try { new MutationObserver(gate).observe(document.body, { attributes: true, childList: true, subtree: true, attributeFilter: ["class", "style", "data-lang"] }); } catch (e) {}
    // and when the sync brings a pass or an exemption from the student record (cts-sync.js)
    document.addEventListener("cts-sync-applied", function () { shown = null; gate(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
