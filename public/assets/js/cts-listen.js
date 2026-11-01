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
  /* Three kinds of page (Dr. Cook, 30 Oct: "do the textbooks as well"):
     a unit (main#lesson) reads its lesson; a textbook (data-textbook-page="book") and a reading room
     (body.cts-room) read what is open on screen, block by block. A textbook's TEST page gets no button. */
  var tbPage = document.body.getAttribute("data-textbook-page");
  var blocks = tbPage === "book" || document.body.classList.contains("cts-room");
  if (tbPage && tbPage !== "book") return;
  var main = document.getElementById(blocks ? "content" : "lesson");
  if (!synth || !window.SpeechSynthesisUtterance || !main) return;

  /* Never read: the frame, and anything that belongs to a test (ChatGPT's review, 30 Oct: exclude every known
     assessment container, not just one). */
  var ASSESS = "#questionsContainer, #tb-questions, #examResult, #examStatus, #mcSection, #saSection, #kwContainer, " +
    "[data-cts-part=\"exam\"], .exam, section.assess, #exam-section, .tb-test, [data-cts-exam], form";
  var CHROME = "[data-cts-chrome], #cts-register, #greeting, .cts-source, script, style, " + ASSESS;
  /* A unit with questions whose lesson and exam were not told apart (cts-exam-view.js did not run): no button. */
  if (!blocks && main.querySelector("#questionsContainer") && !main.querySelector("[data-cts-part]")) return;
  /* cts-exam-view.js (loaded before this file) marks the two parts of the
     page data-cts-part="lesson" / "exam"; where it has, only the lesson part
     is read. The exam's own wording is .cts-reading too. */
  function lessonEls() {
    var parted = !!main.querySelector("[data-cts-part]");
    return Array.prototype.filter.call(main.querySelectorAll(".cts-reading"), function (el) {
      if (el.closest(CHROME)) return false;
      if (parted && !el.closest('[data-cts-part="lesson"]')) return false;
      return !!el.textContent.trim();
    });
  }
  /* Textbooks and rooms: the smallest visible text blocks, minus the contents list and buttons. */
  var BLOCK = "p, h1, h2, h3, h4, h5, li, blockquote, dd, dt, figcaption, td, th, summary";
  function blockEls() {
    return Array.prototype.filter.call(main.querySelectorAll(BLOCK), function (el) {
      if (el.closest(CHROME + ", nav, .tb-toc, .tb-actions, .actions, button, #cts-listen")) return false;
      if (el.querySelector(BLOCK)) return false;                       // read the innermost block once
      return !!el.textContent.trim();
    });
  }
  /* innerText is what is on screen; an empty innerText means nothing visible, never the hidden textContent. */
  function textOf(el) { return blocks && typeof el.innerText === "string" ? el.innerText : el.textContent; }
  function langOf(el) { return (((el.closest("[lang]")) || {}).lang || pageLang).slice(0, 2).toLowerCase(); }
  /* A textbook or room block can hold two passages (English and a translation, "Both"): each visible one is its
     own part, in its own language. */
  function parts(el) {
    if (!blocks) return [el];
    var r = Array.prototype.filter.call(el.querySelectorAll(".cts-reading"), function (x) { return !x.closest(CHROME) && visible(x); });
    return r.length ? r : [el];
  }
  var all = blocks ? blockEls() : lessonEls();
  if (!all.length) return;

  var kind = tbPage === "book" ? "book" : blocks ? "room" : "lesson";
  function docLang() { return (document.documentElement.lang || "en").slice(0, 2).toLowerCase(); }
  var pageLang = docLang();
  var W = {
    en: { voice: "Voice", automatic: "Automatic (browser's choice)", helpTitle: "How to install or change voices", helpText: "On a Samsung Galaxy tablet, open Settings → General management → Text-to-speech output. Choose the speech engine, then its settings to install or change voices. On another Android device, search Settings for Text-to-speech. On iPhone or iPad, open Settings → Accessibility → Spoken Content → Voices. On Windows, open Settings → Time & language → Speech. Return here and refresh. Some installed voices may not appear in this browser.", lesson: "Listen to this lesson", book: "Listen to this textbook", room: "Listen to these readings", pause: "Pause", resume: "Continue", stop: "Stop", speed: "Speed",
          novoice: "This device has no English voice. You can add one in the device's text-to-speech settings.",
          tip: "Choose an available reading voice above. To add voices, open the instructions below.",
          ch: "chapter", v: "verse", vs: "verses", to: "to" },
    es: { voice: "Voz", automatic: "Automática (del navegador)", helpTitle: "Cómo instalar o cambiar las voces", helpText: "En una tableta Samsung Galaxy, abre Ajustes → Administración general → Texto a voz. Elige el motor de voz y entra en sus ajustes para instalar voces. En otros Android, busca Texto a voz en Ajustes. En iPhone o iPad: Ajustes → Accesibilidad → Contenido leído → Voces. En Windows: Configuración → Hora e idioma → Voz. Regresa a la lección y actualiza la página. Algunas voces instaladas quizá no aparezcan en el navegador.", lesson: "Escuchar esta lección", book: "Escuchar este libro de texto", room: "Escuchar estas lecturas", pause: "Pausa", resume: "Continuar", stop: "Detener", speed: "Velocidad",
          novoice: "Este dispositivo no tiene voz en español. Puede añadir una en la configuración de texto a voz del dispositivo.",
          tip: "Elige una voz disponible arriba. Para instalar otras voces, abre las instrucciones.",
          ch: "capítulo", v: "versículo", vs: "versículos", to: "al" },
    fr: { voice: "Voix", automatic: "Automatique (navigateur)", helpTitle: "Installer ou changer les voix", helpText: "Sur une tablette Samsung Galaxy, ouvrez Paramètres → Gestion globale → Synthèse vocale. Choisissez le moteur vocal, puis ses réglages pour installer des voix. Sur un autre Android, cherchez Synthèse vocale dans les paramètres. Sur iPhone ou iPad : Réglages → Accessibilité → Contenu énoncé → Voix. Sur Windows : Paramètres → Heure et langue → Voix. Revenez à la leçon et actualisez la page. Certaines voix installées peuvent ne pas être proposées par le navigateur.", lesson: "Écouter cette leçon", book: "Écouter ce manuel", room: "Écouter ces lectures", pause: "Pause", resume: "Reprendre", stop: "Arrêter", speed: "Vitesse",
          novoice: "Cet appareil n’a pas de voix française. Vous pouvez en ajouter une dans les réglages de synthèse vocale de l’appareil.",
          tip: "Astuce : selon votre appareil, vous pourrez peut-être choisir une autre voix de lecture (par exemple une voix d’homme ou de femme) dans les réglages d’accessibilité ou de synthèse vocale.",
          ch: "chapitre", v: "verset", vs: "versets", to: "à" },
    sw: { voice: "Sauti", automatic: "Chaguo la kivinjari", helpTitle: "Jinsi ya kusakinisha au kubadili sauti", helpText: "Kwenye Samsung Galaxy, fungua Settings → General management → Text-to-speech output. Chagua injini ya sauti, kisha mipangilio yake ili kuongeza sauti. Kwenye Android nyingine, tafuta Text-to-speech ndani ya Settings. Kwenye iPhone au iPad: Settings → Accessibility → Spoken Content → Voices. Kwenye Windows: Settings → Time & language → Speech. Rudi hapa na upakie upya ukurasa. Huenda kivinjari kisionyeshe sauti zote zilizosakinishwa.", lesson: "Sikiliza somo hili", book: "Sikiliza kitabu hiki cha kiada", room: "Sikiliza masomo haya ya kusoma", pause: "Sitisha", resume: "Endelea", stop: "Acha", speed: "Kasi",
          novoice: "Kifaa hiki hakina sauti ya Kiswahili. Unaweza kuongeza moja katika mipangilio ya kusoma maandishi kwa sauti ya kifaa.",
          tip: "Chagua sauti inayopatikana hapo juu. Fungua maelekezo ili kuongeza sauti.",
          ch: "sura ya", v: "mstari wa", vs: "mistari", to: "hadi" }
  };
  var t = W[pageLang] || W.en;
  function label() { return t[kind]; }

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
    /* "chapters 1-7", "Acts 2:42-47" done above; any other plain number range */
    text = text.replace(/\b(\d{1,4})\s*[–—-]\s*(\d{1,4})\b/g, function (_, a, b) { return a + " " + w.to + " " + b; });
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

  function voiceKey(v) { return [v.name, v.lang, v.voiceURI || ""].join("|"); }
  function savedVoice(lang) {
    try { return localStorage.getItem("cts_listen_voice_" + lang) || ""; } catch (_) { return ""; }
  }
  function voiceFor(lang) {
    var vs = synth.getVoices() || [];
    var mine = vs.filter(function (v) { return (v.lang || "").toLowerCase().replace("_", "-").slice(0, 2) === lang; });
    if (!mine.length) return vs.length ? null : undefined;           // null: none for this language; undefined: list not ready
    var wanted = savedVoice(lang);
    var selected = mine.find(function (v) { return voiceKey(v) === wanted; });
    if (selected) return selected;
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
    "#cts-listen select{font-size:1rem;padding:.4rem;max-width:min(78vw,340px)}" +
    "#cts-listen .cts-listen-voice-label{display:flex;flex-wrap:wrap;align-items:center;gap:.45rem}" +
    "#cts-listen .cts-listen-help{flex-basis:100%;font-size:.93rem}" +
    "#cts-listen .cts-listen-help summary{cursor:pointer;text-decoration:underline;min-height:30px}" +
    "#cts-listen .cts-listen-help p{margin:.3rem 0;max-width:720px}" +
    "#cts-listen .cts-listen-msg,#cts-listen .cts-listen-tip{flex-basis:100%;margin:.25rem 0 0}" +
    ".cts-listening{background:rgba(255,214,102,.35);border-radius:4px;box-shadow:0 0 0 3px rgba(255,214,102,.35)}";
  document.head.appendChild(css);

  var bar = document.createElement("div");
  bar.id = "cts-listen";
  bar.setAttribute("data-cts-chrome", "");
  bar.setAttribute("role", "group");
  bar.setAttribute("aria-label", label());
  bar.innerHTML =
    '<button type="button" class="btn solid" data-act="play">🔊 ' + label() + '</button>' +
    '<button type="button" class="btn" data-act="pause" hidden>⏸ ' + t.pause + '</button>' +
    '<button type="button" class="btn" data-act="stop" hidden>⏹ ' + t.stop + '</button>' +
    '<label class="small"><span class="cts-listen-speed">' + t.speed + '</span> <select data-act="rate">' +
    RATES.map(function (r) { return '<option value="' + r + '"' + (r === rate ? " selected" : "") + ">" + String(r).replace(".", pageLang === "en" ? "." : ",") + "×</option>"; }).join("") +
    '</select></label>' +
    '<label class="small cts-listen-voice-label"><span class="cts-listen-voice-title">' + t.voice +
    '</span> <select data-act="voice" aria-label="' + t.voice + '"><option value="">' + t.automatic + '</option></select></label>' +
    '<p class="small muted cts-listen-tip">' + t.tip + '</p>' +
    '<details class="cts-listen-help"><summary class="cts-listen-help-title">' + t.helpTitle +
    '</summary><p class="cts-listen-help-text">' + t.helpText + '</p></details>' +
    '<p class="small muted cts-listen-msg" role="status" aria-live="polite" hidden></p>';
  var top = blocks ? main.firstElementChild : all[0];
  while (top && top.parentElement && top.parentElement !== main) top = top.parentElement;
  main.insertBefore(bar, top || null);
  /* On a unit the control belongs to the lesson part: cts-exam-view.js's own rule hides it the instant the exam
     opens (body.cts-exam-open [data-cts-part=lesson]), not on the next check below. */
  if (!blocks && main.querySelector("[data-cts-part]")) bar.setAttribute("data-cts-part", "lesson");

  var playBtn = bar.querySelector('[data-act="play"]'), pauseBtn = bar.querySelector('[data-act="pause"]'),
      stopBtn = bar.querySelector('[data-act="stop"]'), rateSel = bar.querySelector('[data-act="rate"]'),
      voiceSel = bar.querySelector('[data-act="voice"]'), msg = bar.querySelector(".cts-listen-msg");

  function refreshVoices() {
    var lang = pageLang, wanted = savedVoice(lang);
    var available = (synth.getVoices() || []).filter(function (v) {
      return (v.lang || "").toLowerCase().replace("_", "-").slice(0, 2) === lang;
    });
    while (voiceSel.firstChild) voiceSel.removeChild(voiceSel.firstChild);
    var automatic = document.createElement("option");
    automatic.value = ""; automatic.textContent = t.automatic; voiceSel.appendChild(automatic);
    available.forEach(function (v) {
      var option = document.createElement("option");
      option.value = voiceKey(v); option.textContent = v.name + " (" + v.lang + ")";
      voiceSel.appendChild(option);
    });
    voiceSel.value = available.some(function (v) { return voiceKey(v) === wanted; }) ? wanted : "";
  }
  refreshVoices();

  /* ---- reading ---- */
  var queue = [], at = 0, playing = false, lit = null, gen = 0;
  /* A closed <details> (a reading not yet opened) still has layout boxes in Chrome: not visible. */
  function visible(el) {
    if (!el || !el.getClientRects().length) return false;
    var d = el.closest("details:not([open])");
    if (d && !el.closest("summary")) return false;
    return el.checkVisibility ? el.checkVisibility({ visibilityProperty: true }) : true;
  }
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
    (blocks ? blockEls() : lessonEls()).filter(visible).forEach(function (block) {
      parts(block).forEach(function (el) {
        var lang = langOf(el), text = textOf(el);
        if (!text || !text.trim()) return;
        chunks(spoken(text, lang)).forEach(function (c) { queue.push({ el: el, lang: lang, text: c }); });
      });
    });
  }
  /* Keyboard and screen readers: when the focused button is hidden, focus moves to the one that replaces it. */
  function show(state) {
    var f = document.activeElement, hadFocus = bar.contains(f);
    playBtn.hidden = state !== "idle";
    pauseBtn.hidden = state === "idle";
    stopBtn.hidden = state === "idle";
    playBtn.innerHTML = "🔊 " + label();
    pauseBtn.innerHTML = state === "paused" ? "▶ " + t.resume : "⏸ " + t.pause;
    stopBtn.innerHTML = "⏹ " + t.stop;
    if (hadFocus && f.hidden) (state === "idle" ? playBtn : pauseBtn).focus();
  }
  /* The page's language can change without a reload (textbooks and rooms): the control follows it. */
  function relabel() {
    pageLang = docLang(); t = W[pageLang] || W.en;
    bar.setAttribute("aria-label", label());
    bar.querySelector(".cts-listen-speed").textContent = t.speed;
    bar.querySelector(".cts-listen-tip").textContent = t.tip;
    bar.querySelector(".cts-listen-voice-title").textContent = t.voice;
    voiceSel.setAttribute("aria-label", t.voice);
    bar.querySelector(".cts-listen-help-title").textContent = t.helpTitle;
    bar.querySelector(".cts-listen-help-text").textContent = t.helpText;
    refreshVoices();
    show(playing ? "playing" : pauseBtn.hidden ? "idle" : "paused");
  }
  function say(text) { msg.textContent = text; msg.hidden = !text; }
  function next() {
    if (!playing) return;
    if (at >= queue.length) { stop(); return; }
    var item = queue[at];
    if (!visible(item.el)) { stop(); return; }                       // the lesson was hidden (the exam opened)
    var voice = voiceFor(item.lang);
    /* The device never listed its voices: speak only in the device's own language, which it reads with its own
       voice; any other language could come out in the wrong voice, so it is treated as unavailable. */
    if (voice === undefined && (navigator.language || "").slice(0, 2).toLowerCase() !== item.lang) voice = null;
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
    relabel();
    say("");
    build();
    if (!queue.length) return;
    at = 0; playing = true; show("playing");
    synth.cancel();
    /* Some browsers fill in their voice list a moment after the page loads: wait for it, up to two seconds. */
    if (voiceFor(pageLang) !== undefined) { next(); return; }
    var mine = gen, waited = 0;
    (function wait() {
      if (mine !== gen || !playing) return;
      if (voiceFor(pageLang) !== undefined || waited >= 2000) { next(); return; }
      waited += 200; setTimeout(wait, 200);
    })();
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
  voiceSel.addEventListener("change", function () {
    try {
      if (voiceSel.value) localStorage.setItem("cts_listen_voice_" + pageLang, voiceSel.value);
      else localStorage.removeItem("cts_listen_voice_" + pageLang);
    } catch (_) {}
    if (playing) { gen++; synth.cancel(); next(); }
  });
  if (synth.addEventListener) synth.addEventListener("voiceschanged", refreshVoices);
  else if ("onvoiceschanged" in synth) synth.onvoiceschanged = refreshVoices;
  document.addEventListener("cts-lang", function () { if (playing || !pauseBtn.hidden) stop(); relabel(); });
  window.addEventListener("pagehide", function () { synth.cancel(); });

  /* The control goes with the lesson: hidden when the exam is on screen. */
  function follow() {
    var showing = blocks || (!document.body.classList.contains("cts-exam-open") && all.some(visible));
    bar.hidden = !showing;
    if (!showing && (playing || !pauseBtn.hidden)) stop();
  }
  follow();
  setInterval(follow, 700);
  if (window.MutationObserver) new MutationObserver(follow).observe(document.body, { attributes: true, attributeFilter: ["class"] });
})();
