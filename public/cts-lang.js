/* Generated language pages use one URL per reader language. The fallback
 * below still supports legacy fixtures and pages outside this build. */
(function () {
  "use strict";
  var body = document.body;
  if (!body || !body.dataset.pageLang) return;
  var codes = ["en", "es", "fr"], current = body.dataset.pageLang;
  var source = body.dataset.sourceLang || "en", file = body.dataset.languagePage;
  var get = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var set = function (k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } };
  var url = new URL(location.href), explicit = url.searchParams.get("cts_lang");
  var stored = get("cts_lang");
  if (stored === "both") { stored = "es"; set("cts_show_source", "true"); }
  var want = codes.includes(explicit) ? explicit : codes.includes(stored) ? stored : current;
  if (!explicit && !stored && current === "en") {
    var browser = (navigator.language || "en").split("-")[0].toLowerCase();
    // French is selectable now, but not a default until the reviewed pilot exists.
    if (browser === "es") want = "es";
  }
  function href(lang) {
    var target = new URL(location.href);
    target.pathname = "/" + (lang === "en" ? "" : lang + "/") + file;
    target.searchParams.set("cts_lang", lang);
    return target.href;
  }
  function choose(lang) {
    if (lang === "both") { set("cts_show_source", "true"); showSource = true; lang = "es"; }
    if (!codes.includes(lang)) return;
    set("cts_lang", lang);
    if (lang === current) { enforce(); return; }
    location.assign(href(lang));
  }
  function bi(text) {
    var target = text[current], actual = target == null || target === "" ? source : current;
    return '<span class="cts-text-pair"><span class="cts-reading" lang="' + actual + '">' +
      (target || text[source] || "") + '</span>' +
      (current !== source && target && text[source] ? '<span class="cts-source" lang="' + source + '">' + text[source] + '</span>' : '') + '</span>';
  }
  window.CTSLanguage = { bi: bi, choose: choose, lang: current, sourceLang: source, storagePath: "/" + file };
  var remembered = set("cts_lang", want);
  if (want !== current) { location.replace(href(want)); return; }
  if (explicit && remembered) {
    url.searchParams.delete("cts_lang");
    history.replaceState(history.state, "", url.href);
  }
  var showSource = get("cts_show_source") === "true";
  function sourceVisibility() {
    body.dataset.showSource = String(current !== source && showSource);
    var box = document.getElementById("cts-show-source");
    if (box) box.checked = body.dataset.showSource === "true";
  }
  function enforce() {
    for (var i = 0; i < codes.length; i++) body.classList.toggle("lang-" + codes[i], codes[i] === current);
    body.classList.remove("lang-both");
    if (body.getAttribute("data-lang") !== current) body.setAttribute("data-lang", current);
    document.documentElement.lang = current;
    sourceVisibility();
    set("cts_lang", current);
  }
  var internal = false;
  document.addEventListener("click", function (event) {
    if (internal) return;
    var node = event.target.closest("[data-cts-lang], [data-cts-legacy-control] button, [data-cts-legacy-control] a");
    if (!node) return;
    var lang = node.dataset.ctsLang || node.dataset.lang;
    if (!lang) lang = current === "es" ? "en" : "es";
    event.preventDefault(); event.stopImmediatePropagation(); choose(lang);
  }, true);
  document.addEventListener("change", function (event) {
    if (event.target.id !== "cts-show-source") return;
    showSource = event.target.checked;
    set("cts_show_source", String(showSource)); sourceVisibility();
    document.dispatchEvent(new CustomEvent("cts-source", { detail: event.target.checked }));
  });
  enforce();
  function ready() {
    enforce();
    // Static certificate/book scripts keep a language in their own state.
    // Let their existing control update that state without URL navigation.
    var legacy = document.querySelector('[data-cts-legacy-control] [data-lang="' + (current === "es" ? "es" : "en") + '"]');
    if (legacy && !window.CTS_ENGINE && !body.classList.contains("cts-room")) { internal = true; legacy.click(); internal = false; }
    enforce();
    document.dispatchEvent(new CustomEvent("cts-lang", { detail: current }));
    var previous = body.className;
    new MutationObserver(function () {
      if (previous === body.className) return;
      enforce(); previous = body.className;
    }).observe(body, { attributes: true, attributeFilter: ["class"] });
  }
  if (document.readyState === "complete") ready(); else window.addEventListener("load", ready);
})();

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
  if (document.body && document.body.dataset.pageLang) return;
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
