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

  /* The language a page is showing, by whichever convention it uses:
   *   lang-es / lang-en      -- the units, the certificates, the reading rooms
   *   show-es / show-en      -- the digests (their own toggle, see below)
   *   spanish                -- Counseling, Narrative and WiseSpeak Preaching
 *   es                     -- a few certificates (Radical, Th.M., M.Div.)
   * null when the page says nothing definite: lang-both ("Both" is a way of
   * displaying, not a language), or a page with no switch at all. Until 30
   * Sept any change to the body's classes saved "en" unless lang-es was
   * present -- so choosing "Both", or opening a single-page course, quietly
   * reset a Spanish reader to English on the next page (Dr. Cook's beta pass). */
  function showing() {
    var c = document.body && document.body.classList;
    if (!c) return null;
    if (c.contains('lang-both')) return null;
    if (c.contains('lang-es') || c.contains('show-es') || c.contains('spanish') || c.contains('es')) return 'es';
    if (c.contains('lang-en') || c.contains('show-en')) return 'en';
    return null;
  }
  function persist() { var l = showing(); if (l) lsSet(KEY, l); }

  /* The digests switch themselves to English at the end of the page, after
     this has run; put the reader's language back once they have. */
  function digests() {
    var c = document.body && document.body.classList;
    if (!c || !c.contains('show-en') || lsGet(KEY) !== 'es') return;
    c.remove('show-en'); c.add('show-es');
    var bs = document.querySelectorAll('.toggle button[data-lang]');
    for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', bs[i].getAttribute('data-lang') === 'es' ? 'true' : 'false');
  }
  /* Some pages keep a language of their own and apply it as they load -- the
     course certificates remember one per course -- so a Spanish reader
     arriving from a unit met English. Once the page has settled, if it is
     showing English and the reader chose Spanish, press its own Español
     button, so whatever else that button does happens too. */
  function settle() {
    if (lsGet(KEY) !== 'es' || document.body.classList.contains('lang-both')) return;
    // a page that keeps its language in a script says so on <html lang>
    var now = showing() || (document.documentElement.lang || '').slice(0, 2);
    if (now !== 'en') return;
    var b = document.querySelector('button[data-lang="es"], a[data-lang="es"], #esBtn');
    if (b) { b.click(); return; }
    // a single English/Español toggle: pressed once, it shows Spanish
    var t = document.getElementById('langBtn') || document.getElementById('langToggle');
    if (t) { t.click(); return; }
    var c = document.body.classList;
    if (c.contains('lang-en')) { c.remove('lang-en'); c.add('lang-es'); }
  }
  if (document.readyState === 'complete') settle();
  else window.addEventListener('load', settle);

  function observe() {
    digests();
    if (!document.body || typeof MutationObserver === 'undefined') return;
    new MutationObserver(persist).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observe);
  else observe();
})();
