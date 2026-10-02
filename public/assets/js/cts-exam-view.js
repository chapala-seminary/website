/* The lesson and its exam are never on screen together (Dr. Cook's review,
 * 29 Sept 2026, item 7). Every unit page carries both, so a student could
 * use the browser's Find to search the lesson for the words of a question.
 * The page now has two views:
 *
 *   the lesson  -- the teaching, with a "Take the exam" button where the
 *                  exam begins; the questions are hidden;
 *   the exam    -- the questions, with "Back to the lesson" above them;
 *                  the teaching is hidden.
 *
 * Hidden means display:none, which the browser's Find does not search.
 * Answers are kept when a student goes back to the lesson; nothing is
 * graded or reset by switching. The view is remembered for this tab
 * (sessionStorage), so a reload after submitting stays on the exam.
 *
 * This is a stopgap, not security: the answer key is still in the page
 * source until grading moves to the server (the brain's post-cutover TODO).
 *
 * The 451 pages were written by hand over years and do not share one
 * structure: some keep the exam in its own section, some put the lesson and
 * the exam in one card, some have no wrapper at all. So the exam is found by
 * where it starts -- its own section, or the exam heading just above the
 * questions -- and everything in the page before that point is the lesson.
 */
(function () {
  "use strict";
  var main = document.getElementById("lesson");
  var qs = document.getElementById("questionsContainer");
  if (!main || !qs || !main.contains(qs)) return;

  var KEY = "cts_exam_view:" + location.pathname;
  var EXAM_HEAD = /exam|examen|assessment|evaluaci[oó]n|self-check|autoevaluaci[oó]n|multiple.choice|opci[oó]n m[uú]ltiple|questions|preguntas|quiz/i;
  var KEEP = { "cts-register": 1, "greeting": 1 };

  function before(a, b) { return !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING); }

  /* Where the exam starts. */
  function examStart() {
    for (var a = qs.parentElement; a && a !== main; a = a.parentElement)
      if (a.matches("section.exam, div.exam, #exam-section, section.assess")) return a;
    // Walk back from the questions through the page, counting the text
    // passed, and take the earliest exam heading close above them.
    var w = document.createTreeWalker(main, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    w.currentNode = qs;
    var passed = 0, found = null, nearest = null, n;
    while ((n = w.previousNode()) && passed < 1200) {
      if (n.nodeType === 3) { if (!n.parentElement.closest("h1,h2,h3,h4")) passed += n.nodeValue.replace(/\s+/g, " ").trim().length; continue; }
      if (!/^H[1-4]$/.test(n.tagName)) continue;
      if (EXAM_HEAD.test(n.textContent)) found = n;
      else if (!nearest && passed < 300) nearest = n;
    }
    var s = found || nearest || document.getElementById("trackBanner") || qs;
    if (!before(s, qs) && s !== qs) s = qs;
    // a heading alone in its wrapper: take the wrapper
    while (s.parentElement !== main && s.parentElement.textContent.trim() === s.textContent.trim() && s.parentElement.contains(qs) === false) s = s.parentElement;
    return s;
  }

  /* Where the exam ends: the last of its controls in the page. */
  function examEnd() {
    var ids = ["questionsContainer", "kwContainer", "saNote", "mcCheckBtn", "submitExamBtn", "resetExamBtn", "examResult", "completeResult"];
    var end = qs;
    ids.forEach(function (id) { var e = document.getElementById(id); if (e && main.contains(e) && before(end, e)) end = e; });
    return end;
  }

  /* Mark every top-most piece of the page between two points (inclusive of
     `from` when fromIn, of `to` when toIn). Loose text is wrapped so it can
     be hidden too. */
  function wrapText(node) {
    if (node.nodeType !== 3) return node.nodeType === 1 ? node : null;
    if (!node.nodeValue.trim()) return null;
    var s = document.createElement("span"); node.parentNode.insertBefore(s, node); s.appendChild(node); return s;
  }
  function mark(el, part) { if (el && !KEEP[el.id]) el.setAttribute("data-cts-part", part); }
  function markSiblings(first, stop, part) {       // first .. up to (not incl.) stop
    for (var n = first; n && n !== stop; ) { var next = n.nextSibling; mark(wrapText(n), part); n = next; }
  }
  function markBefore(n, part) {
    for (var p = n.previousSibling; p; ) { var prev = p.previousSibling; mark(wrapText(p), part); p = prev; }
  }
  // Everything from `from` to `to`, both included.
  function markRange(from, to, part) {
    if (from.contains(to)) { mark(from, part); return; }
    var common = from.parentNode; while (!common.contains(to)) common = common.parentNode;
    var a = from, b = to;
    mark(a, part);
    while (a.parentNode !== common) { markSiblings(a.nextSibling, null, part); a = a.parentNode; }
    mark(b, part);
    while (b.parentNode !== common) { markBefore(b, part); b = b.parentNode; }
    markSiblings(a.nextSibling, b, part);
  }

  var start = examStart(), end = examEnd();

  // The lesson: everything in the page before the exam starts.
  for (var node = start; node && node !== main; node = node.parentNode) markBefore(node, "lesson");
  // The exam: from its start to its last control.
  markRange(start, end, "exam");

  // The switch, placed where the exam starts.
  var bar = document.createElement("div");
  bar.id = "cts-exam-switch";
  bar.className = "cts-exam-switch";
  start.parentNode.insertBefore(bar, start);

  var css = document.createElement("style");
  css.textContent =
    "body:not(.cts-exam-open) [data-cts-part=exam]{display:none!important}" +
    "body.cts-exam-open [data-cts-part=lesson]{display:none!important}" +
    ".cts-exam-switch{margin:24px 0;padding:18px 20px;border:2px solid var(--gold,#b08324);border-radius:12px;text-align:center}" +
    ".cts-exam-switch p{margin:0 0 12px}" +
    ".cts-exam-switch .cts-exam-aim{font-size:.92em;font-style:italic}" +
    ".cts-exam-switch button{font:inherit;font-weight:700;padding:12px 26px;border-radius:24px;border:0;cursor:pointer;background:var(--gold,#b08324);color:#2a1a0a}";
  document.head.appendChild(css);

  function render(open) {
    bar.innerHTML = open
      ? '<p><span class="lang-en">The lesson is hidden while you take the exam. Your answers are kept if you go back to it.</span>' +
        '<span class="lang-es">La lección está oculta mientras presenta el examen. Sus respuestas se conservan si vuelve a ella.</span></p>' +
        '<button type="button" id="cts-exam-back"><span class="lang-en">Back to the lesson</span><span class="lang-es">Volver a la lección</span></button>'
      : '<p><span class="lang-en">When you are ready, open the exam. The lesson will be hidden while you take it.</span>' +
        '<span class="lang-es">Cuando esté listo, abra el examen. La lección estará oculta mientras lo presenta.</span></p>' +
        // the seminary's view of examinations (Dr. Cook, 1 Oct 2026), where every student sees it
        '<p class="cts-exam-aim"><span class="lang-en">This exam is here to help you learn, not to trick you. If you do not pass the first time, review the lesson and try again &mdash; you may retake it as many times as you need.</span>' +
        '<span class="lang-es">Este examen está para ayudarle a aprender, no para engañarle. Si no aprueba la primera vez, repase la lección e inténtelo de nuevo &mdash; puede volver a presentarlo cuantas veces lo necesite.</span></p>' +
        '<button type="button" id="cts-exam-open"><span class="lang-en">Take the exam</span><span class="lang-es">Presentar el examen</span></button>';
    bar.querySelector("button").addEventListener("click", function () { set(!open, true); });
  }
  function set(open, user) {
    document.body.classList.toggle("cts-exam-open", open);
    try { if (open) sessionStorage.setItem(KEY, "1"); else sessionStorage.removeItem(KEY); } catch (e) {}
    render(open);
    if (user) {
      // below the sticky unit bar, not under it
      var nav = document.querySelector(".cts-nav"), off = nav ? nav.getBoundingClientRect().height : 0;
      window.scrollTo(0, bar.getBoundingClientRect().top + window.pageYOffset - off - 12);
    }
  }
  var wasOpen = false;
  try { wasOpen = sessionStorage.getItem(KEY) === "1"; } catch (e) {}
  set(wasOpen, false);

  window.CTS_EXAM_VIEW = {
    open: function () { set(true, false); },
    close: function () { set(false, false); },
    isOpen: function () { return document.body.classList.contains("cts-exam-open"); }
  };
})();
