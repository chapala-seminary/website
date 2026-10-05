/* The reading rooms and the honors page (src/layouts/Room.astro): the
 * language control of a unit page, without the engine.
 *
 * English, Español or Both: the body carries lang-en / lang-es / lang-both
 * and cts.css shows the passages of that language. English and Español are
 * remembered in cts_lang, the key every page shares (cts-lang.js restores it
 * before the room paints); Both is a way of displaying, not a language, so it
 * is not remembered -- the same rule as the units and the textbooks.
 *
 * A room's own scripts that write text in the reader's language (Parables'
 * progress line) listen for "cts-lang" on document to write it again.
 *
 * It also measures the sticky bar, so the count of chosen readings can sit
 * just under it (--cts-nav-h, cts-rooms.css).
 */
(function () {
  "use strict";

  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function langNow() {
    var c = document.body.classList;
    return c.contains("lang-both") ? "both" : c.contains("lang-es") ? "es" : "en";
  }
  function sync(lang) {
    var g = document.querySelectorAll(".cts-seg button[data-lang]");
    for (var i = 0; i < g.length; i++) {
      var on = g[i].getAttribute("data-lang") === lang;
      g[i].classList.toggle("active", on);
      g[i].setAttribute("aria-pressed", on ? "true" : "false");
    }
  }
  function apply(lang) {
    lang = (lang === "es" || lang === "both") ? lang : "en";
    var b = document.body;
    b.classList.remove("lang-en", "lang-es", "lang-both");
    b.classList.add("lang-" + lang);
    if (lang !== "both") { document.documentElement.lang = lang; lsSet("cts_lang", lang); }
    sync(lang);
    try { document.dispatchEvent(new CustomEvent("cts-lang", { detail: lang })); } catch (e) {}
  }

  var g = document.querySelectorAll(".cts-seg button[data-lang]");
  for (var i = 0; i < g.length; i++) (function (n) {
    n.addEventListener("click", function () { apply(n.getAttribute("data-lang")); });
  })(g[i]);
  var now = langNow();
  if (now !== "both") document.documentElement.lang = now;
  sync(now);

  var nav = document.querySelector(".cts-nav");
  function measure() { if (nav) document.documentElement.style.setProperty("--cts-nav-h", nav.offsetHeight + "px"); }
  measure();
  window.addEventListener("resize", measure);
})();
