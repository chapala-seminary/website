/* Chapala Theological Seminary — claiming a certificate.
 *
 * A certificate page unlocks in the browser when the record it reads says the
 * course (or degree) is done. That is what the student prints. This file adds
 * the seminary's half: the certificate is registered with the seminary and
 * gets a verification code, so anyone the student shows it to can check it at
 * /verify/<code>. Registering needs a verified email (students start with
 * only a student code, and a certificate is the moment the seminary needs to
 * be able to reach the person it certified), so the page asks for one, sends
 * a six-digit code to it, and confirms it -- once. After that, every
 * certificate this student claims is registered at once.
 *
 * The Worker side: POST /api/email/start, POST /api/email/confirm and
 * POST /api/certificate (worker/api.js). This is the page side, on every
 * certificate page after cts-sync.js:
 *     <script src="assets/js/cts-certify.js" defer></script>
 *
 * It never stands between the student and the print button. With no API, no
 * student code, or an API that cannot be reached, it shows nothing and the
 * page behaves as it did before student records existed. What it draws goes
 * under the diploma; the one thing it adds INSIDE the diploma is the
 * verification line, once there is a code to print.
 */
(function () {
  'use strict';
  if (window.CTS_CERTIFY) return;

  var API = window.CTS_SYNC_API || '/api';
  var file = (location.pathname.split('/').pop() || '').toLowerCase();

  // ---- which award this page is ---------------------------------------
  // The four degree pages have fixed levels; every other certificate page is
  // a course, and its code comes from the filename the way cts-completion.js
  // and the Worker's catalog derive it (CTS1PeterCertificate.html -> CTS1PETER).
  var DEGREE = { 'ctsmdivcertificate.html': 'mdiv', 'ctsthmcertificate.html': 'thm',
                 'ctsassociatecertificate.html': 'associate', 'ctscertificateofministry.html': 'certificate' };
  function award() {
    if (DEGREE[file]) return { level: DEGREE[file] };
    // A page may name its code outright (the single-page courses' certificate
    // pages do: COUNSELING, WISESPEAK, STORYTEL are not spelled in a filename).
    var explicit = document.body && document.body.getAttribute('data-course-code');
    if (explicit && /^[A-Z0-9_]+$/i.test(explicit.trim())) return { level: 'course', course: explicit.trim().toUpperCase() };
    var code = file.replace(/(thm|mth|mdiv)?certificate\.html$/, '').replace(/\.html$/, '').toUpperCase();
    if (code === 'ETHICS_') code = 'ETHICS';
    return code ? { level: 'course', course: code } : null;
  }

  // ---- storage and language, tolerant like cts-sync.js -----------------
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function parse(s, fb) { try { var v = JSON.parse(s); return v == null ? fb : v; } catch (e) { return fb; } }
  function student() { return parse(get('cts_student'), null) || {}; }
  function isEs() {
    var b = document.body;
    if (!b) return false;
    if (b.classList.contains('es') || b.classList.contains('lang-es')) return true;
    var l = b.getAttribute('data-lang') || document.documentElement.lang || 'en';
    return l.slice(0, 2) === 'es';
  }
  function t(o) { return isEs() ? o.es : o.en; }

  function trackLabel() {
    var s = student();
    var v = String(get('cts_track') || s.track || s.program || '').toLowerCase();
    if (v === 'mdiv' || /master of divinity|m\.div/.test(v)) return { en: 'Master of Divinity', es: 'Maestría en Divinidad' };
    if (v === 'thm' || v === 'mth' || /master of theology|m\.th|th\.m/.test(v)) return { en: 'Master of Theology', es: 'Maestría en Teología' };
    var g = String(get('cts_goal') || s.goal || '').toLowerCase();
    if (g === 'assoc' || v === 'ad' || v === 'associate') return { en: 'Associate of Divinity', es: 'Asociado en Divinidad' };
    return { en: 'Certificate of Ministry', es: 'Certificado de Ministerio' };
  }
  // The title the record keeps: the page's own name for the award, which is
  // what the student sees printed, plus the track for a course certificate.
  function title(a) {
    var explicit = (document.body && document.body.getAttribute('data-course')) || '';
    var tt = explicit.trim() || (document.title || '').replace(/^\s*CTS\s+/i, '').split(/[—–(]/)[0].replace(/certificate.*$/i, '').trim();
    if (a.level !== 'course') return tt || trackLabel().en;
    return (tt || a.course) + ' — ' + trackLabel().en;
  }

  // ---- the diploma, found the way cts-completion.js finds it ------------
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

  // ---- the network ------------------------------------------------------
  function post(path, payload) {
    return fetch(API + path, { method: 'POST', credentials: 'omit',
      headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (b) { return { status: r.status, ok: r.ok, body: b, retry: r.headers.get('retry-after') }; }); });
  }
  function getStudent(code) {
    return fetch(API + '/student/' + encodeURIComponent(code), { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
  }

  // ---- the panel ----------------------------------------------------------
  var S = {
    head:     { en: 'Register this certificate with the seminary', es: 'Registre este certificado ante el seminario' },
    why:      { en: 'A registered certificate gets a verification code that anyone can check at chapalaseminary.org/verify. The seminary needs a confirmed email address first, so it can reach you and send you a copy.',
                es: 'Un certificado registrado recibe un código de verificación que cualquiera puede comprobar en chapalaseminary.org/verify. El seminario necesita primero un correo confirmado, para poder contactarle y enviarle una copia.' },
    email:    { en: 'Your email address', es: 'Su correo electrónico' },
    send:     { en: 'Send me a code', es: 'Enviarme un código' },
    sent:     { en: 'We sent a 6-digit code to', es: 'Enviamos un código de 6 dígitos a' },
    codePh:   { en: '6-digit code', es: 'código de 6 dígitos' },
    confirm:  { en: 'Confirm', es: 'Confirmar' },
    change:   { en: 'Use a different email', es: 'Usar otro correo' },
    working:  { en: 'One moment…', es: 'Un momento…' },
    verified: { en: 'Email confirmed. Registering your certificate…', es: 'Correo confirmado. Registrando su certificado…' },
    done:     { en: 'Registered with the seminary. Verification code:', es: 'Registrado ante el seminario. Código de verificación:' },
    doneSub:  { en: 'It is printed on your certificate. Anyone can check it at', es: 'Está impreso en su certificado. Cualquiera puede comprobarlo en' },
    mailed:   { en: 'A copy has been emailed to', es: 'Se ha enviado una copia por correo a' },
    notYet:   { en: 'The seminary’s record does not yet show every part of this award. Your progress syncs on its own; give it a moment and try again.',
                es: 'El registro del seminario aún no muestra todas las partes de este título. Su progreso se sincroniza solo; espere un momento e inténtelo de nuevo.' },
    retry:    { en: 'Try again', es: 'Intentar de nuevo' },
    bad:      { en: 'That does not look like an email address.', es: 'Eso no parece un correo electrónico.' },
    wrong:    { en: 'That code is not right.', es: 'Ese código no es correcto.' },
    expired:  { en: 'That code has expired. Ask for a new one.', es: 'Ese código venció. Pida uno nuevo.' },
    wait:     { en: 'Please wait a moment before asking for another code.', es: 'Espere un momento antes de pedir otro código.' },
    noMail:   { en: 'Email is not set up on the seminary’s side yet. Your certificate is still yours to print; come back later to register it.',
                es: 'El correo aún no está configurado en el seminario. Su certificado sigue siendo suyo para imprimir; vuelva más tarde para registrarlo.' },
    offline:  { en: 'Could not reach the seminary. Check your connection and try again.', es: 'No se pudo contactar al seminario. Revise su conexión e inténtelo de nuevo.' },
    verifyLine: { en: 'Verification', es: 'Verificación' }
  };

  var root, a, code, state = { step: 'email', email: '', verifyCode: null, emailed: false, msg: null, busy: false };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function verifyUrl(vc) { return location.origin + '/verify/' + encodeURIComponent(vc); }

  function render() {
    if (!root) return;
    var h = '';
    if (state.step === 'done') {
      h += '<div class="cc-ok">' + t(S.done) + ' <code>' + esc(state.verifyCode) + '</code></div>' +
           '<div class="cc-sub">' + t(S.doneSub) + ' <a href="' + esc(verifyUrl(state.verifyCode)) + '">' + esc(verifyUrl(state.verifyCode).replace(/^https?:\/\//, '')) + '</a>' +
           (state.emailed && state.email ? '<br>' + t(S.mailed) + ' <b>' + esc(state.email) + '</b>.' : '') + '</div>';
    } else if (state.step === 'notyet') {
      h += '<div class="cc-head">' + t(S.head) + '</div><div class="cc-sub">' + t(S.notYet) + '</div>' +
           '<div><button type="button" data-act="retry">' + t(S.retry) + '</button></div>';
    } else if (state.step === 'issuing') {
      h += '<div class="cc-sub">' + t(S.verified) + '</div>';
    } else if (state.step === 'code') {
      h += '<div class="cc-head">' + t(S.head) + '</div>' +
           '<div class="cc-sub">' + t(S.sent) + ' <b>' + esc(state.email) + '</b>.</div>' +
           '<div><input id="cts-cert-code" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="one-time-code" placeholder="' + t(S.codePh) + '">' +
           '<button type="button" data-act="confirm">' + t(S.confirm) + '</button></div>' +
           '<div><button type="button" class="link" data-act="change">' + t(S.change) + '</button></div>';
    } else {
      h += '<div class="cc-head">' + t(S.head) + '</div><div class="cc-sub">' + t(S.why) + '</div>' +
           '<div><input id="cts-cert-email" type="email" autocomplete="email" placeholder="' + t(S.email) + '" value="' + esc(state.email) + '">' +
           '<button type="button" data-act="send">' + t(S.send) + '</button></div>';
    }
    if (state.msg) h += '<div class="cc-msg' + (state.msg.err ? ' err' : '') + '">' + t(state.msg) + '</div>';
    root.innerHTML = h;
    root.querySelectorAll('button, input').forEach(function (el) { el.disabled = !!state.busy; });
  }

  // The printable line. One per diploma, added when the code is known and
  // left alone afterwards; the panel itself is hidden in print.
  function stamp(dip, vc) {
    if (!dip || document.getElementById('cts-cert-verify')) return;
    var line = document.createElement('div');
    line.id = 'cts-cert-verify';
    line.innerHTML = '<span class="lang-en">' + S.verifyLine.en + '</span><span class="lang-es">' + S.verifyLine.es + '</span>: ' +
      esc(vc) + ' · ' + esc(verifyUrl(vc).replace(/^https?:\/\//, ''));
    dip.appendChild(line);
  }

  function say(msg, err) { state.msg = msg ? { en: msg.en, es: msg.es, err: !!err } : null; render(); }
  function busy(on) { state.busy = on; render(); }
  function errorFor(r) {
    if (!r) return S.offline;
    if (r.status === 429) return S.wait;
    if (r.status === 410) return S.expired;
    if (r.status === 503) return S.noMail;
    if (r.status === 400 && /email/i.test(r.body && r.body.error || '')) return S.bad;
    if (r.status === 400) return S.wrong;
    var e = r.body && r.body.error;
    return e ? { en: e, es: e } : S.offline;
  }

  function issue(dip) {
    state.step = 'issuing'; state.msg = null; render();
    var payload = { code: code, level: a.level, title: title(a), page: location.pathname.split('/').pop() || '' };
    if (a.level === 'course') payload.course = a.course;
    // Push anything this browser holds first: the record the Worker checks is
    // the one sync keeps, and the student may have arrived straight from the
    // last unit.
    var pre = window.CTS_SYNC && window.CTS_SYNC.sync ? Promise.resolve(window.CTS_SYNC.sync()).catch(function () {}) : Promise.resolve();
    return pre.then(function () { return post('/certificate', payload); }).then(function (r) {
      if (r.ok && r.body && r.body.verifyCode) {
        state.verifyCode = r.body.verifyCode; state.emailed = !!r.body.emailed; state.step = 'done'; render();
        stamp(dip || diploma(), state.verifyCode);
        return;
      }
      if (r.status === 403 && r.body && r.body.needs === 'email') { state.step = 'email'; render(); return; }
      if (r.status === 409) { state.step = 'notyet'; render(); return; }
      state.step = 'notyet'; say(errorFor(r), true);
    }).catch(function () { state.step = 'notyet'; say(S.offline, true); });
  }

  function wire(dip) {
    root.addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-act]');
      if (!b || state.busy) return;
      var act = b.getAttribute('data-act');
      if (act === 'send') {
        var em = (document.getElementById('cts-cert-email').value || '').trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { say(S.bad, true); return; }
        state.email = em; busy(true);
        post('/email/start', { code: code, email: em }).then(function (r) {
          state.busy = false;
          if (r.ok) { state.step = 'code'; state.msg = null; render(); var i = document.getElementById('cts-cert-code'); if (i) i.focus(); }
          else say(errorFor(r), true);
        }).catch(function () { state.busy = false; say(S.offline, true); });
      } else if (act === 'confirm') {
        var v = (document.getElementById('cts-cert-code').value || '').replace(/\D/g, '');
        if (v.length !== 6) { say(S.wrong, true); return; }
        busy(true);
        post('/email/confirm', { code: code, verification: v }).then(function (r) {
          state.busy = false;
          if (r.ok) {
            // The page's own copy of the student, so anything that prefills an
            // email from it shows the confirmed one.
            try { var s = student(); s.email = state.email; localStorage.setItem('cts_student', JSON.stringify(s)); } catch (e) {}
            issue(dip);
          } else say(errorFor(r), true);
        }).catch(function () { state.busy = false; say(S.offline, true); });
      } else if (act === 'change') {
        state.step = 'email'; state.msg = null; render();
      } else if (act === 'retry') {
        issue(dip);
      }
    });
    root.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Enter') return;
      var b = root.querySelector('button[data-act="send"], button[data-act="confirm"]');
      if (b) { ev.preventDefault(); b.click(); }
    });
  }

  function build(dip) {
    if (document.getElementById('cts-cert-panel')) return;
    var st = document.createElement('style');
    st.textContent =
      '@media print{#cts-cert-panel{display:none!important}}' +
      '#cts-cert-panel{margin:18px auto 6px;max-width:520px;padding:14px 18px;border:1px solid #d8c8a8;border-radius:10px;background:#fbf6ea;color:#2a241d;text-align:center;font-family:inherit;line-height:1.45}' +
      '#cts-cert-panel .cc-head{font-weight:700;color:#6d2233;margin-bottom:4px}' +
      '#cts-cert-panel .cc-sub{font-size:.9rem;color:#5a4a2a;margin-bottom:10px}' +
      '#cts-cert-panel .cc-ok{font-weight:700;color:#1f6b3b}#cts-cert-panel .cc-ok code{font:700 1.05rem ui-monospace,Menlo,Consolas,monospace;letter-spacing:.08em;background:#fff;border:1px solid #d8c8a8;border-radius:6px;padding:4px 9px}' +
      '#cts-cert-panel input{padding:8px 10px;border:1px solid #bbb;border-radius:4px;font-size:.95rem;width:60%;max-width:240px}' +
      '#cts-cert-panel button{padding:8px 16px;margin:4px 0 0 6px;border:0;border-radius:4px;background:#6d2233;color:#fff;font-size:.9rem;cursor:pointer}' +
      '#cts-cert-panel button.link{background:none;color:#6d2233;text-decoration:underline;padding:4px}' +
      '#cts-cert-panel button[disabled],#cts-cert-panel input[disabled]{opacity:.6;cursor:default}' +
      '#cts-cert-panel .cc-msg{margin-top:8px;font-size:.88rem;color:#2c6e49}#cts-cert-panel .cc-msg.err{color:#8a1f1f}' +
      '#cts-cert-verify{margin-top:16px;font-size:.78rem;color:#555;letter-spacing:.03em}';
    document.head.appendChild(st);
    root = document.createElement('div');
    root.id = 'cts-cert-panel';
    root.className = 'noprint';
    // Inside the diploma block, where cts-completion.js puts its own panels,
    // so every page lays it out the same way; hidden in print (above). Ahead
    // of the honours-reading invitation when that is already there.
    var honours = dip.querySelector('#cts-honors-prompt');
    if (honours) dip.insertBefore(root, honours); else dip.appendChild(root);
    wire(dip);
    // Pages switch language by toggling a class on <body>; follow it.
    try { new MutationObserver(function () { render(); }).observe(document.body, { attributes: true, attributeFilter: ['class', 'data-lang'] }); } catch (e) {}
  }

  function begin(dip) {
    build(dip);
    state.email = String(student().email || '');
    getStudent(code).then(function (rec) {
      if (!rec) { state.step = 'notyet'; say(S.offline, true); return; }
      // With the email confirmed, register straight away. The Worker hands
      // back the same code for an award it has already registered, so a
      // second visit (or another device) shows the code, no questions asked.
      if (rec.student && rec.student.email_verified_at) { state.email = rec.student.email || state.email; issue(dip); }
      else { state.step = 'email'; render(); }
    });
  }

  function start() {
    a = award();
    if (!a || !window.CTS_SYNC) return;
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      var dip = diploma();
      if (dip) {
        // The code is issued by the first sync, which may still be in flight
        // for a student who just passed the last unit; wait for it a little.
        code = window.CTS_SYNC.code();
        if (code) {
          clearInterval(iv);
          window.CTS_SYNC.available().then(function (up) { if (up) begin(dip); });
        } else if (tries > 60) clearInterval(iv);  // no record: the page is still printable
      } else if (tries > 60) clearInterval(iv);    // ~30 s; the page never unlocked
    }, 500);
  }

  window.CTS_CERTIFY = { award: award, state: function () { return state; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
