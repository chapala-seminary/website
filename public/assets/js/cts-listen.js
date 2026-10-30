/* Listen to this lesson (Dr. Cook, 30 Oct 2026): a button at the top of the
 * lesson that reads it aloud with the voice the student's own device already
 * has (the browser's speech synthesis). No audio files, no server, no cost.
 * Stage 2 -- downloadable MP3s made on the seminary's server -- comes later.
 *
 * What is read: the lesson's own text, the visible .cts-reading elements in
 * main#lesson, in page order, each in its own language (lang attribute). The
 * frame (registration, textbook boxes, navigation) is not read, and neither
 * is the exam: the lesson and the exam are never on screen together
 * (cts-exam-view.js), and reading stops the moment the lesson is hidden, so
 * the exam cannot be taken with the lesson playing.
 *
 * Built at run time, not in the layout: tools/verify-lesson-source.mjs
 * allows nothing new in front of the lesson in the built page.
 *
 * Pause is "stop and remember where": speechSynthesis.pause() is unreliable
 * on Android. Text is spoken a few sentences at a time, because some
 * browsers silently stop a long utterance after about fifteen seconds.
 *
 * localStorage: cts_listen_rate (the speed chosen), nothing else.
 */
(function () {
  "use strict";
  var synth = window.speechSynthesis;
  var main = document.getElementById("lesson");
  if (!synth || !window.SpeechSynthesisUtterance || !main) return;

  var CHROME = "[data-cts-chrome], #cts-register, #greeting, #questionsContainer, .cts-source, script, style";
  /* cts-exam-view.js (loaded before this file) marks the two parts of the
     page data-cts-part="lesson" / "exam"; where it has, only the lesson part
     is read. The exam's own wording is .cts-reading too. */
  function lessonEls() {
    var parted = !!main.querySelector("[data-cts-part]");
    return Array.prototype.filter.call(main.querySelectorAll(".cts-reading"), function (el) {
      if (el.closest(CHROME) || el.closest('[data-cts-part="exam"]')) return false;
      if (parted && !el.closest('[data-cts-part="lesson"]')) return false;
      return !!el.textContent.trim();
    });
  }
  var all = lessonEls();
  if (!all.length) return;

  var pageLang = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
  var W = {
    en: { listen: "Listen to this lesson", pause: "Pause", resume: "Continue", stop: "Stop", speed: "Speed",
          novoice: "This device has no English voice. You can add one in the device's text-to-speech settings.",
          ch: "chapter", v: "verse", vs: "verses", to: "to" },
    es: { listen: "Escuchar esta lección", pause: "Pausa", resume: "Continuar", stop: "Detener", speed: "Velocidad",
          novoice: "Este dispositivo no tiene voz en español. Puede añadir una en la configuración de texto a voz del dispositivo.",
          ch: "capítulo", v: "versículo", vs: "versículos", to: "al" },
    fr: { listen: "Écouter cette leçon", pause: "Pause", resume: "Reprendre", stop: "Arrêter", speed: "Vitesse",
          novoice: "Cet appareil n’a pas de voix française. Vous pouvez en ajouter une dans les réglages de synthèse vocale de l’appareil.",
          ch: "chapitre", v: "verset", vs: "versets", to: "à" },
    sw: { listen: "Sikiliza somo hili", pause: "Simama kidogo", resume: "Endelea", stop: "Acha", speed: "Kasi",
          novoice: "Kifaa hiki hakina sauti ya Kiswahili. Unaweza kuongeza moja katika mipangilio ya kusoma maandishi kwa sauti ya kifaa.",
          ch: "sura ya", v: "mstari wa", vs: "mistari", to: "hadi" }
  };
  var t = W[pageLang] || W.en;

  /* Bible versions and references, said the way a reader would say them. */
  var VERSIONS = { NKJV: "New King James Version", KJV: "King James Version", ESV: "English Standard Version",
    NIV: "New International Version", NASB: "New American Standard Bible", CSB: "Christian Standard Bible",
    RVG: "Reina Valera Gómez", RVR1960: "Reina Valera 1960", RVR60: "Reina Valera 1960", NVI: "Nueva Versión Internacional",
    LSG: "Louis Segond", SUV: "Union Version" };
  function spoken(text, lang) {
    var w = W[lang] || W.en;
    text = text.replace(/\b(\d{1,3}):(\d{1,3})(?:\s*[–—-]\s*(\d{1,3})(?!:))?/g, function (_, c, a, b) {
      return w.ch + " " + c + ", " + (b ? w.vs + " " + a + " " + w.to + " " + b : w.v + " " + a);
    });
    text = text.replace(/\b(NKJV|KJV|ESV|NIV|NASB|CSB|RVR1960|RVR60|RVG|NVI|LSG|SUV)\b/g, function (m) { return VERSIONS[m]; });
    return text.replace(/\s+/g, " ").trim();
  }
  /* A few sentences at a time, never more than about 220 characters. */
  function chunks(text) {
    var out = [], cur = "";
    (text.match(/[^.!?…;:]+[.!?…;:]*\s*/g) || [text]).forEach(function (s) {
      s = s.trim(); if (!s) return;
      while (s.length > 260) {
        var cut = s.lastIndexOf(", ", 220); if (cut < 80) cut = s.lastIndexOf(" ", 220); if (cut < 40) cut = 220;
        if (cur) { out.push(cur); cur = ""; }
        out.push(s.slice(0, cut + 1).trim()); s = s.slice(cut + 1).trim();
      }
      if (cur && (cur + " " + s).length > 220) { out.push(cur); cur = s; } else cur = cur ? cur + " " + s : s;
    });
    if (cur) out.push(cur);
    return out;
  }

  function voiceFor(lang) {
    var vs = synth.getVoices() || [];
    var mine = vs.filter(function (v) { return (v.lang || "").toLowerCase().replace("_", "-").slice(0, 2) === lang; });
    if (!mine.length) return vs.length ? null : undefined;           // null: none for this language; undefined: list not ready
    var region = { en: /en-us/i, es: /es-(mx|us|419)/i, fr: /fr-fr/i, sw: /sw/i }[lang];
    function score(v) {
      return (/natural|neural|premium|enhanced|google/i.test(v.name) ? 2 : 0) + (region && region.test(v.lang) ? 1 : 0) + (v.default ? 0.5 : 0);
    }
    return mine.sort(function (a, b) { return score(b) - score(a); })[0];
  }

  var RATES = [0.8, 1, 1.25];
  var rate = 1;
  try { var saved = parseFloat(localStorage.getItem("cts_listen_rate")); if (RATES.indexOf(saved) >= 0) rate = saved; } catch (e) {}

  /* ---- the control ---- */
  var css = document.createElement("style");
  css.textContent =
    "#cts-listen[hidden],#cts-listen [hidden]{display:none!important}" +
    "#cts-listen{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin:0 0 1rem}" +
    "#cts-listen .btn{font-size:1.05rem;padding:.55rem 1rem}" +
    "#cts-listen select{font-size:1rem;padding:.4rem}" +
    "#cts-listen .cts-listen-msg{flex-basis:100%;margin:.25rem 0 0}" +
    ".cts-listening{background:rgba(255,214,102,.35);border-radius:4px;box-shadow:0 0 0 3px rgba(255,214,102,.35)}";
  document.head.appendChild(css);

  var bar = document.createElement("div");
  bar.id = "cts-listen";
  bar.setAttribute("data-cts-chrome", "");
  bar.setAttribute("role", "group");
  bar.setAttribute("aria-label", t.listen);
  bar.innerHTML =
    '<button type="button" class="btn solid" data-act="play">🔊 ' + t.listen + '</button>' +
    '<button type="button" class="btn" data-act="pause" hidden>⏸ ' + t.pause + '</button>' +
    '<button type="button" class="btn" data-act="stop" hidden>⏹ ' + t.stop + '</button>' +
    '<label class="small">' + t.speed + ' <select data-act="rate">' +
    RATES.map(function (r) { return '<option value="' + r + '"' + (r === rate ? " selected" : "") + ">" + String(r).replace(".", pageLang === "en" ? "." : ",") + "×</option>"; }).join("") +
    '</select></label><p class="small muted cts-listen-msg" hidden></p>';
  var top = all[0];
  while (top.parentElement && top.parentElement !== main) top = top.parentElement;
  main.insertBefore(bar, top);

  var playBtn = bar.querySelector('[data-act="play"]'), pauseBtn = bar.querySelector('[data-act="pause"]'),
      stopBtn = bar.querySelector('[data-act="stop"]'), rateSel = bar.querySelector('[data-act="rate"]'),
      msg = bar.querySelector(".cts-listen-msg");

  /* ---- reading ---- */
  var queue = [], at = 0, playing = false, lit = null, gen = 0;
  function visible(el) { return !!(el && el.getClientRects().length); }
  function light(el) {
    if (lit) lit.classList.remove("cts-listening");
    lit = el ? (el.closest("p, li, h1, h2, h3, h4, blockquote, td") || el) : null;
    if (lit) {
      lit.classList.add("cts-listening");
      var r = lit.getBoundingClientRect();
      if (r.top < 60 || r.bottom > window.innerHeight - 40) lit.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }
  function build() {
    queue = [];
    lessonEls().filter(visible).forEach(function (el) {
      var lang = ((el.closest("[lang]") || {}).lang || pageLang).slice(0, 2).toLowerCase();
      chunks(spoken(el.textContent, lang)).forEach(function (c) { queue.push({ el: el, lang: lang, text: c }); });
    });
  }
  function show(state) {
    playBtn.hidden = state !== "idle";
    pauseBtn.hidden = state === "idle";
    stopBtn.hidden = state === "idle";
    pauseBtn.innerHTML = state === "paused" ? "▶ " + t.resume : "⏸ " + t.pause;
  }
  function say(text) { msg.textContent = text; msg.hidden = !text; }
  function next() {
    if (!playing) return;
    if (at >= queue.length) { stop(); return; }
    var item = queue[at];
    if (!visible(item.el)) { stop(); return; }                       // the lesson was hidden (the exam opened)
    var voice = voiceFor(item.lang);
    if (voice === null) {
      if (item.lang === pageLang) { stop(); say((W[item.lang] || t).novoice); return; }
      at++; next(); return;                                         // a passage in another language this device cannot read
    }
    var u = new SpeechSynthesisUtterance(item.text);
    u.lang = voice ? voice.lang : item.lang;
    if (voice) u.voice = voice;
    u.rate = rate;
    var mine = ++gen;
    u.onend = function () { if (mine === gen && playing) { at++; next(); } };
    u.onerror = function (e) { if (mine === gen && playing && e.error !== "interrupted" && e.error !== "canceled") { at++; next(); } };
    light(item.el);
    synth.speak(u);
  }
  function play() {
    say("");
    build();
    if (!queue.length) return;
    at = 0; playing = true; show("playing");
    synth.cancel();
    /* Some browsers fill in their voice list a moment after the page loads. */
    if (voiceFor(pageLang) === undefined) setTimeout(next, 400); else next();
  }
  function pause() {
    if (playing) { playing = false; gen++; synth.cancel(); show("paused"); }
    else { playing = true; show("playing"); next(); }
  }
  function stop() {
    playing = false; gen++; synth.cancel(); at = 0; light(null); show("idle");
  }

  /* What would be read, for tools that make the downloadable recordings
     (stage 2): the same text, in the same order, as the button reads. */
  window.CTSListen = {
    script: function () {
      build();
      return queue.map(function (q) {
        var b = q.el.closest("[data-cts-block]");
        return { lang: q.lang, text: q.text, block: b ? b.getAttribute("data-cts-block") : "" };
      });
    }
  };

  playBtn.addEventListener("click", play);
  pauseBtn.addEventListener("click", pause);
  stopBtn.addEventListener("click", stop);
  rateSel.addEventListener("change", function () {
    rate = parseFloat(rateSel.value) || 1;
    try { localStorage.setItem("cts_listen_rate", String(rate)); } catch (e) {}
    if (playing) { gen++; synth.cancel(); next(); }                 // say the current part again at the new speed
  });
  if (synth.addEventListener) synth.addEventListener("voiceschanged", function () {});
  window.addEventListener("pagehide", function () { synth.cancel(); });

  /* The control goes with the lesson: hidden when the exam is on screen. */
  function follow() {
    var showing = !document.body.classList.contains("cts-exam-open") && all.some(visible);
    bar.hidden = !showing;
    if (!showing && (playing || !pauseBtn.hidden)) stop();
  }
  follow();
  setInterval(follow, 700);
})();
