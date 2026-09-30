/* Form text in the reader's language (Dr. Cook's beta pass, 30 Sept 2026:
 * in Spanish the registration fields still read English first).
 *
 * A dropdown option or a placeholder cannot hold the <span class="lang-en">
 * pairs the rest of the page uses, so these carried both languages in one
 * line: "Trinidad and Tobago · Trinidad y Tobago". This shows the half for
 * the language on screen, and both again in the "Both" view:
 *
 *   data-en / data-es on an <input> or <option>   -- used as given;
 *   otherwise an option's "English · Español"      -- split at the middle dot.
 *
 * It follows the page's own switch: it watches <body>'s class.
 */
(function () {
  "use strict";
  function lang() {
    var c = document.body.classList;
    if (c.contains("lang-both")) return "both";
    return c.contains("lang-es") || c.contains("es") ? "es" : "en";
  }
  function pick(en, es, l) { return l === "es" ? es : l === "both" ? en + " · " + es : en; }
  function relabel() {
    var l = lang();
    document.querySelectorAll("[data-es]").forEach(function (e) {
      var en = e.getAttribute("data-en"), es = e.getAttribute("data-es");
      if (en == null) { en = e.tagName === "OPTION" ? e.textContent : e.getAttribute("placeholder"); e.setAttribute("data-en", en); }
      var t = pick(en, es, l);
      if (e.tagName === "OPTION") e.textContent = t; else e.setAttribute("placeholder", t);
    });
    document.querySelectorAll("select[data-bilingual] option:not([data-es])").forEach(function (o) {
      var both = o.getAttribute("data-both") || o.textContent;
      o.setAttribute("data-both", both);
      var i = both.indexOf(" · ");
      o.textContent = i < 0 || l === "both" ? both : l === "es" ? both.slice(i + 3) : both.slice(0, i);
    });
  }
  function start() {
    relabel();
    if (typeof MutationObserver !== "undefined")
      new MutationObserver(relabel).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
