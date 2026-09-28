/* Chapala Theological Seminary — the certificate as a PDF.
 *
 * Students were saving their certificates with the browser's print dialog, and
 * on a phone that often came out as a blurry screenshot-sized image, so they
 * wrote to ask for a PDF instead. Spanish-speaking students also wanted the
 * certificate in Spanish. This adds a "Download PDF" button under an unlocked
 * certificate. It builds a vector PDF in the browser -- sharp at any size,
 * letter landscape, one page -- in the language the student is reading the
 * site in (cts-lang.js picks that from their choice or their browser), with a
 * second link for the other language.
 *
 * The design and wording follow the seminary's Certificate Maker (the one the
 * office uses to send certificates by email), so a certificate downloaded here
 * and one sent by the office look the same:
 *   - a course: "This certificate is awarded to … the course …", with the
 *     track, With Honors when the honors reading is done, and the two
 *     signatures;
 *   - a degree (Certificate of Ministry, Associate, Th.M., M.Div.): the
 *     diploma wording.
 * The verification code is printed when cts-certify.js has one.
 *
 * On every certificate page, after cts-certify.js:
 *     <script src="assets/js/cts-cert-pdf.js" defer></script>
 * It loads nothing until the button is pressed; then the PDF library
 * (assets/vendor/jspdf.umd.min.js, jsPDF, MIT) and the course names
 * (cts-cert-names.js). With no unlocked certificate on the page it adds nothing.
 */
(function () {
  'use strict';
  if (window.CTS_CERT_PDF) return;
  window.CTS_CERT_PDF = true;

  var file = (location.pathname.split('/').pop() || '').toLowerCase();
  var DEGREE = { 'ctscertificateofministry.html': 'certificate', 'ctsassociatecertificate.html': 'associate',
                 'ctsthmcertificate.html': 'thm', 'ctsmdivcertificate.html': 'mdiv' };

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function parse(s) { try { return JSON.parse(s); } catch (e) { return null; } }
  function student() { return parse(get('cts_student')) || {}; }
  function pageEs() {
    var b = document.body;
    if (!b) return false;
    if (b.classList.contains('es') || b.classList.contains('lang-es') || b.classList.contains('spanish')) return true;
    var l = b.getAttribute('data-lang') || document.documentElement.lang || '';
    if (l) return l.slice(0, 2) === 'es';
    return get('cts_lang') === 'es';
  }

  // ---- the words -------------------------------------------------------------
  var W = {
    en: {
      school: 'Chapala Theological Seminary',
      awarded: 'This certificate is awarded to',
      course: 'in recognition of the successful completion of the course',
      body: 'having faithfully completed the prescribed course of study and passed all required unit examinations, and is hereby awarded this certificate with all the rights and privileges thereunto appertaining.',
      honors: 'With Honors',
      author: 'Course Author', director: 'Director of Education',
      dateOf: 'Date of Completion: ',
      known: 'Be it hereby known that',
      confer: 'having faithfully completed all the requirements prescribed by the Faculty, is hereby admitted to the degree of',
      conferCert: 'having faithfully completed all the requirements prescribed by the Faculty, is hereby awarded the',
      rights: 'with all the rights, honors, and privileges thereunto appertaining.',
      given: 'Given at Chapala, Jalisco — ',
      professor: 'Professor', semDirector: 'Seminary Director',
      verify: 'Verification code: ',
      button: 'Download PDF', other: 'Descargar en español', busy: 'Preparing…',
      failed: 'The PDF could not be made on this device. Use Print / Save instead.'
    },
    es: {
      school: 'Seminario Teológico de Chapala',
      awarded: 'Este certificado se otorga a',
      course: 'en reconocimiento de haber completado satisfactoriamente el curso',
      body: 'habiendo completado fielmente el plan de estudios prescrito y aprobado todos los exámenes de unidad requeridos, se le otorga este certificado con todos los derechos y privilegios que le corresponden.',
      honors: 'Con Honores',
      author: 'Autor del Curso', director: 'Director de Educación',
      dateOf: 'Fecha de finalización: ',
      known: 'Sépase por la presente que',
      confer: 'habiendo cumplido fielmente todos los requisitos prescritos por la Facultad, se le confiere el grado de',
      conferCert: 'habiendo cumplido fielmente todos los requisitos prescritos por la Facultad, se le otorga el',
      rights: 'con todos los derechos, honores y privilegios que le corresponden.',
      given: 'Otorgado en Chapala, Jalisco — ',
      professor: 'Profesor', semDirector: 'Director del Seminario',
      verify: 'Código de verificación: ',
      button: 'Descargar PDF', other: 'Download in English', busy: 'Preparando…',
      failed: 'No se pudo crear el PDF en este dispositivo. Use Imprimir / Guardar.'
    }
  };
  var TRACK = {
    certificate: { en: 'Certificate Track', es: 'Trayecto de Certificado' },
    associate: { en: 'Associate of Divinity Track', es: 'Trayecto de Asociado en Divinidad' },
    thm: { en: 'Master of Theology Track', es: 'Trayecto de Maestría en Teología' },
    mdiv: { en: 'Master of Divinity Track', es: 'Trayecto de Maestría en Divinidad' }
  };
  var DEGREE_NAME = {
    certificate: { en: 'Certificate of Ministry', es: 'Certificado de Ministerio', abbr: 'C.Min.' },
    associate: { en: 'Associate of Divinity', es: 'Asociado en Divinidad', abbr: 'A.Div.' },
    thm: { en: 'Master of Theology', es: 'Maestría en Teología', abbr: 'Th.M.' },
    mdiv: { en: 'Master of Divinity', es: 'Maestría en Divinidad', abbr: 'M.Div.' }
  };
  var MONTHS = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  };
  function dateText(lang, d) {
    return lang === 'es' ? d.getDate() + ' de ' + MONTHS.es[d.getMonth()] + ' de ' + d.getFullYear()
                         : MONTHS.en[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  // ---- what this certificate is --------------------------------------------
  /* The track a course was finished on: the page says so for the M.Div. and
     Th.M. versions of a course certificate; otherwise the student's own
     track, read the way cts-certify.js reads it. */
  function track() {
    if (/mdivcertificate\.html$/.test(file)) return 'mdiv';
    if (/thmcertificate\.html$/.test(file)) return 'thm';
    var s = student();
    var v = String(get('cts_track') || s.track || s.program || '').toLowerCase();
    if (v === 'mdiv' || /master of divinity|m\.div/.test(v)) return 'mdiv';
    if (v === 'thm' || v === 'mth' || /master of theology|m\.th|th\.m/.test(v)) return 'thm';
    var g = String(get('cts_goal') || s.goal || '').toLowerCase();
    if (g === 'assoc' || v === 'ad' || v === 'associate') return 'associate';
    return 'certificate';
  }
  /* Honors: the class's honors reading is done (cts-completion.js keeps it
     under the same code as the page name: CTSActsCertificate -> Acts). */
  function honors() {
    var code = file === 'ethics_certificate.html' ? 'Ethics'
      : ((location.pathname.split('/').pop() || '').match(/^CTS(.+?)(?:MDiv|ThM|Mth)?Certificate\.html$/i) || [])[1];
    return !!(code && get('cts_honors_v1:' + code));
  }
  // the verification line cts-certify.js adds to the diploma, if any
  function verifyCode() {
    var el = document.getElementById('cts-cert-verify');
    var m = el && el.textContent.match(/:\s*([A-Z0-9-]{4,})\s*·\s*(\S+)/i);
    return m ? { code: m[1], url: m[2] } : null;
  }
  function visible(el) {
    return !!(el && el.offsetParent !== null && getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden');
  }
  function diploma() {
    var sels = ['#diploma', '#cert-wrap', '.diploma', '#certificate', '.certificate', '#cert', '.cert-wrap', '.sheet', '#certCard'];
    for (var i = 0; i < sels.length; i++) {
      var el = document.querySelector(sels[i]);
      if (el && visible(el)) return el;
    }
    return null;
  }

  // ---- loading, only when asked ---------------------------------------------
  function script(src) {
    return new Promise(function (ok, no) {
      var s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = no;
      document.head.appendChild(s);
    });
  }
  function image(src) {
    return new Promise(function (ok, no) {
      var i = new Image();
      i.onload = function () { ok(i); }; i.onerror = no; i.src = src;
    });
  }
  var ready = null;
  function load() {
    if (!ready) {
      ready = Promise.all([
        window.jspdf ? null : script('assets/vendor/jspdf.umd.min.js'),
        window.CTS_CERT_NAMES ? null : script('assets/js/cts-cert-names.js'),
        image('assets/img/sig-cook.png'), image('assets/img/sig-rogers.png')
      ]).then(function (r) { return { cook: r[2], rogers: r[3] }; });
      ready.catch(function () { ready = null; });
    }
    return ready;
  }

  // ---- drawing -----------------------------------------------------------------
  var NAVY = [44, 62, 107], BLUE = [63, 90, 138], GOLD = [168, 138, 62], INK = [31, 36, 51], CREAM = [253, 249, 237];

  function fit(doc, text, font, style, size, maxW) {
    doc.setFont(font, style);
    var s = size;
    while (s > 8) { doc.setFontSize(s); if (doc.getTextWidth(text) <= maxW) break; s -= 0.5; }
    doc.setFontSize(s);
    return s;
  }
  function centre(doc, text, y, opts) {
    doc.text(text, doc.internal.pageSize.getWidth() / 2, y, Object.assign({ align: 'center' }, opts || {}));
  }
  // spaced capitals, centred by hand since spaced text is measured without the spacing
  function spaced(doc, text, y, space) {
    var W2 = doc.internal.pageSize.getWidth() / 2;
    var w = doc.getTextWidth(text) + space * (text.length - 1);
    doc.text(text, W2 - w / 2, y, { charSpace: space });
  }
  function signature(doc, img, cx, y, name, role, lang) {
    var h = 34, w = img.naturalWidth / img.naturalHeight * h;
    if (w > 170) { w = 170; h = w * img.naturalHeight / img.naturalWidth; }
    doc.addImage(img, 'PNG', cx - w / 2, y - h, w, h);
    doc.setDrawColor.apply(doc, INK); doc.setLineWidth(0.8); doc.line(cx - 95, y + 2, cx + 95, y + 2);
    doc.setFont('times', 'bolditalic'); doc.setFontSize(13); doc.setTextColor.apply(doc, NAVY);
    doc.text(name, cx, y + 17, { align: 'center' });
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor.apply(doc, INK);
    var r = role.toUpperCase(), rw = doc.getTextWidth(r) + 0.8 * (r.length - 1);
    doc.text(r, cx - rw / 2, y + 29, { charSpace: 0.8 });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor.apply(doc, BLUE);
    doc.text(W[lang].school, cx, y + 40, { align: 'center' });
  }
  function seal(doc, cx, cy) {
    doc.setFillColor(255, 255, 255); doc.setDrawColor.apply(doc, GOLD); doc.setLineWidth(2.4);
    doc.circle(cx, cy, 30, 'FD');
    doc.setLineWidth(0.6); doc.circle(cx, cy, 25.5, 'S');
    doc.setDrawColor.apply(doc, NAVY); doc.setLineWidth(1.8);
    doc.line(cx, cy - 20, cx, cy - 3); doc.line(cx - 6, cy - 14, cx + 6, cy - 14);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor.apply(doc, GOLD);
    doc.text('CTS', cx, cy + 7, { align: 'center' });
    doc.setFontSize(6); doc.text('CHAPALA', cx, cy + 15, { align: 'center' });
  }
  function frame(doc) {
    var Wp = doc.internal.pageSize.getWidth(), Hp = doc.internal.pageSize.getHeight();
    doc.setFillColor.apply(doc, CREAM); doc.rect(0, 0, Wp, Hp, 'F');
    doc.setDrawColor.apply(doc, NAVY); doc.setLineWidth(12); doc.rect(24, 24, Wp - 48, Hp - 48, 'S');
    doc.setDrawColor.apply(doc, GOLD); doc.setLineWidth(1.6); doc.rect(36, 36, Wp - 72, Hp - 72, 'S');
    return { Wp: Wp, Hp: Hp };
  }
  function footer(doc, lang, sig, y, dateLine, vc, roles) {
    signature(doc, sig.cook, 206, y, 'Wayne Cook, Th.D.', roles[0], lang);
    seal(doc, doc.internal.pageSize.getWidth() / 2, y - 6);
    signature(doc, sig.rogers, 586, y, 'Ted Rogers, D.Min.', roles[1], lang);
    doc.setFont('times', 'normal'); doc.setFontSize(10.5); doc.setTextColor.apply(doc, INK);
    centre(doc, dateLine, y + 62);
    if (vc) {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(110, 110, 110);
      centre(doc, W[lang].verify + vc.code + ' · ' + vc.url, y + 76);
    }
  }

  function coursePdf(doc, lang, sig, who, when) {
    var w = W[lang], f = frame(doc), maxW = f.Wp - 170;
    var names = window.CTS_CERT_NAMES || {};
    var course = names[file] ? names[file][lang] : (document.body.getAttribute('data-course') || '');
    doc.setTextColor.apply(doc, BLUE); doc.setFont('helvetica', 'bold'); doc.setFontSize(8);
    spaced(doc, 'CHAPALA THEOLOGICAL SEMINARY · SEMINARIO TEOLÓGICO DE CHAPALA', 76, 1.2);
    doc.setTextColor.apply(doc, NAVY); doc.setFont('times', 'bold'); doc.setFontSize(23);
    centre(doc, w.school, 104);
    doc.setDrawColor.apply(doc, GOLD); doc.setLineWidth(1.6); doc.line(f.Wp / 2 - 60, 116, f.Wp / 2 + 60, 116);
    doc.setTextColor.apply(doc, BLUE); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
    spaced(doc, w.awarded.toUpperCase(), 136, 1.1);
    var name = String(who).toUpperCase();
    fit(doc, name, 'times', 'bolditalic', 36, maxW);
    doc.setTextColor.apply(doc, GOLD);
    centre(doc, name, 176);
    var nw = Math.min(doc.getTextWidth(name) + 40, maxW);
    doc.setLineWidth(0.8); doc.line(f.Wp / 2 - nw / 2, 186, f.Wp / 2 + nw / 2, 186);
    doc.setTextColor.apply(doc, INK); doc.setFont('times', 'normal'); doc.setFontSize(12);
    centre(doc, w.course, 208);
    fit(doc, course, 'times', 'italic', 28, maxW);
    doc.setTextColor.apply(doc, NAVY);
    centre(doc, course, 240);
    var y = 258;
    if (honors()) {
      doc.setFont('times', 'bolditalic'); doc.setFontSize(14); doc.setTextColor.apply(doc, GOLD);
      centre(doc, w.honors, y + 6); y += 20;
    }
    var band = TRACK[track()][lang].toUpperCase();
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5);
    var bw = doc.getTextWidth(band) + 1.6 * (band.length - 1) + 36;
    doc.setFillColor.apply(doc, BLUE); doc.rect(f.Wp / 2 - bw / 2, y, bw, 19, 'F');
    doc.setTextColor(255, 255, 255);
    spaced(doc, band, y + 13, 1.6);
    doc.setTextColor.apply(doc, INK); doc.setFont('times', 'normal'); doc.setFontSize(11);
    var lines = doc.splitTextToSize(w.body, 500);
    doc.text(lines, f.Wp / 2, y + 42, { align: 'center', lineHeightFactor: 1.4 });
    footer(doc, lang, sig, 466, w.dateOf + dateText(lang, when), verifyCode(), [w.author, w.director]);
  }

  function degreePdf(doc, lang, sig, who, when) {
    var w = W[lang], f = frame(doc), level = DEGREE[file], d = DEGREE_NAME[level], maxW = f.Wp - 170;
    doc.setTextColor.apply(doc, NAVY); doc.setFont('times', 'bold'); doc.setFontSize(24);
    // the seminary's name in the diploma's language, large; the other beneath it
    var big = W[lang].school.toUpperCase();
    fit(doc, big, 'times', 'bold', 24, maxW);
    spaced(doc, big, 92, 2);
    doc.setTextColor.apply(doc, GOLD); doc.setFont('times', 'italic'); doc.setFontSize(12);
    centre(doc, W[lang === 'es' ? 'en' : 'es'].school, 110);
    doc.setDrawColor.apply(doc, GOLD); doc.setLineWidth(0.8); doc.line(f.Wp / 2 - 110, 124, f.Wp / 2 + 110, 124);
    doc.setTextColor(85, 85, 85); doc.setFont('times', 'italic'); doc.setFontSize(13);
    centre(doc, w.known, 150);
    var name = String(who).toUpperCase();
    fit(doc, name, 'times', 'bold', 36, maxW);
    doc.setTextColor(26, 26, 26);
    centre(doc, name, 188);
    doc.setDrawColor.apply(doc, GOLD); doc.setLineWidth(1.4); doc.line(f.Wp / 2 - 140, 199, f.Wp / 2 + 140, 199);
    doc.setTextColor(51, 51, 51); doc.setFont('times', 'normal'); doc.setFontSize(12.5);
    doc.text(doc.splitTextToSize(level === 'certificate' ? w.conferCert : w.confer, 540), f.Wp / 2, 224, { align: 'center', lineHeightFactor: 1.4 });
    doc.setTextColor.apply(doc, NAVY); doc.setFont('times', 'bold'); doc.setFontSize(30);
    centre(doc, d[lang], 278);
    doc.setTextColor.apply(doc, GOLD); doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
    spaced(doc, d.abbr.toUpperCase(), 296, 2.4);
    var y = 318;
    if (honors()) {
      doc.setFont('times', 'bolditalic'); doc.setFontSize(14);
      centre(doc, w.honors, y); y += 18;
    }
    doc.setTextColor(68, 68, 68); doc.setFont('times', 'italic'); doc.setFontSize(11.5);
    centre(doc, w.rights, y + 4);
    footer(doc, lang, sig, 466, w.given + dateText(lang, when), verifyCode(), [w.professor, w.semDirector]);
    doc.setTextColor.apply(doc, GOLD); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
    spaced(doc, 'SOLI DEO GLORIA', 56 + 0, 3);
  }

  function slug(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function make(lang) {
    return load().then(function (sig) {
      var who = (student().name || '').trim() || '—';
      var doc = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' });
      doc.setProperties({ title: W[lang].school, author: W[lang].school, creator: 'chapalaseminary.org' });
      var when = new Date();
      if (DEGREE[file]) degreePdf(doc, lang, sig, who, when); else coursePdf(doc, lang, sig, who, when);
      var what = DEGREE[file] ? DEGREE_NAME[DEGREE[file]].en
        : ((window.CTS_CERT_NAMES || {})[file] || {}).en || 'Course';
      doc.save('CTS-' + slug(what) + '-' + slug(who) + (lang === 'es' ? '-ES' : '') + '.pdf');
    });
  }

  // ---- the button --------------------------------------------------------------
  function addButton(dip) {
    if (document.getElementById('cts-cert-pdf')) return;
    var st = document.createElement('style');
    st.textContent = '@media print{#cts-cert-pdf{display:none!important}}' +
      '#cts-cert-pdf{display:block;width:100%;flex:0 0 100%;box-sizing:border-box;clear:both;text-align:center;margin:16px auto 6px;padding:0 12px;font-family:Georgia,serif}' +
      '#cts-cert-pdf button{background:#2c3e6b;color:#fff;border:0;border-radius:24px;padding:11px 26px;font:inherit;font-size:1rem;font-weight:bold;cursor:pointer}' +
      '#cts-cert-pdf button[disabled]{opacity:.6;cursor:wait}' +
      '#cts-cert-pdf a{display:inline-block;margin-left:14px;color:#2c3e6b;font-size:.9rem}' +
      '#cts-cert-pdf .msg{color:#8a1f1f;font-size:.9rem;margin-top:6px}';
    document.head.appendChild(st);
    var box = document.createElement('div');
    box.id = 'cts-cert-pdf';
    box.className = 'noprint';
    dip.parentNode.insertBefore(box, dip.nextSibling);
    function draw() {
      var lang = pageEs() ? 'es' : 'en', other = lang === 'es' ? 'en' : 'es';
      box.innerHTML = '<button type="button">' + W[lang].button + '</button><a href="#" role="button">' + W[lang].other + '</a><div class="msg"></div>';
      var btn = box.querySelector('button'), alt = box.querySelector('a'), msg = box.querySelector('.msg');
      function go(l) {
        btn.disabled = true; btn.textContent = W[lang].busy; msg.textContent = '';
        make(l).catch(function () { msg.textContent = W[lang].failed; })
          .then(function () { btn.disabled = false; btn.textContent = W[lang].button; });
      }
      btn.onclick = function () { go(lang); };
      alt.onclick = function (e) { e.preventDefault(); go(other); };
    }
    draw();
    // follow the page's language switch
    if (typeof MutationObserver !== 'undefined') {
      var last = pageEs();
      new MutationObserver(function () { if (pageEs() !== last) { last = pageEs(); draw(); } })
        .observe(document.body, { attributes: true, attributeFilter: ['class', 'data-lang'] });
    }
  }

  /* Where the button goes: under the diploma once it is showing. The Th.M.
     and M.Div. diplomas are drawn for print only, and there the enabled print
     button is the sign the award is unlocked, so the button goes by it. */
  function printButton() {
    var bs = document.querySelectorAll('button');
    for (var i = 0; i < bs.length; i++) {
      if (/print|imprimir/i.test(bs[i].textContent) && visible(bs[i]) && !bs[i].disabled) return bs[i];
    }
    return null;
  }
  function anchor() {
    if (DEGREE[file] === 'thm' || DEGREE[file] === 'mdiv') {
      var pb = printButton();
      return pb ? pb.parentNode : null;
    }
    return diploma();
  }

  // A certificate page unlocks after its own script runs; wait for it.
  var tries = 0;
  var iv = setInterval(function () {
    var at = anchor();
    if (at) { clearInterval(iv); addButton(at); }
    else if (++tries > 40) clearInterval(iv);
  }, 250);

  // for tests: build the PDF without saving it
  window.CTS_CERT_PDF = { make: make, track: track, honors: honors, file: file };
})();
