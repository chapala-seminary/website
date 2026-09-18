/* cts-lang.js — CTS language auto-default + unified cross-engine persistence
 *
 * Problem: units default to English. Spanish-speaking students who don't spot the
 * on-page language button reach for Chrome auto-translate, which mangles the quiz
 * (e.g. "well" -> "bien"). This makes each unit open in the student's own language
 * and remembers the choice across every course.
 *
 * How: the catalog uses three language engines, but two of them already restore
 * language from localStorage['cts_lang'] in their own init:
 *     - class engine   : <body class="lang-en">    (does NOT persist on its own)
 *     - STATE engine   : plain <body>, startApp()  reads cts_lang
 *     - data-lang engine: <body data-lang="en">    reads cts_lang
 * So the fix is simply to SEED cts_lang (from a saved choice, else the browser
 * language) BEFORE each unit's own init runs. Each engine then restores Spanish
 * itself — no re-render, no button-clicking, no per-engine code. For the class
 * engine (which doesn't read cts_lang) we also set the lang-es body class directly,
 * and mirror any manual toggle back into cts_lang so the choice follows the student
 * into the other engines too.
 *
 * PLACEMENT: include immediately AFTER the opening <body ...> tag, e.g.
 *     <body class="lang-en">
 *     <script src="cts-lang.js"></script>
 * There it runs before the unit's own init/render, so the seed is in place in time
 * and Spanish paints from the first frame (no flash).
 *
 * It never touches answer keys, saved answers, tracks, or any engine internals —
 * only the shared cts_lang key and (for the class engine) the body lang class.
 */
(function () {
  var KEY = 'cts_lang';

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function resolve() {
    var s = lsGet(KEY);
    if (s === 'es' || s === 'en') return s;              // an explicit prior choice wins
    var n = (navigator.language || navigator.userLanguage || '').toLowerCase();
    return n.indexOf('es') === 0 ? 'es' : 'en';          // else default by browser language
  }

  var want = resolve();
  lsSet(KEY, want);  // seed the shared key so each engine's own init restores this language

  // Class engine only: it doesn't read cts_lang, so switch its body class directly.
  // Runs before the unit's inline render, so the quiz renders Spanish with no flash.
  if (want === 'es' && document.body && document.body.classList.contains('lang-en')) {
    document.body.classList.remove('lang-en');
    document.body.classList.add('lang-es');
  }

  // Mirror a manual toggle on class-engine pages back into the shared key, so the
  // choice carries over to the STATE and data-lang courses as well.
  function persist() {
    if (document.body) lsSet(KEY, document.body.classList.contains('lang-es') ? 'es' : 'en');
  }
  function observe() {
    if (!document.body || typeof MutationObserver === 'undefined') return;
    new MutationObserver(persist).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observe);
  else observe();
})();
