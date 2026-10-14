(function () {
  'use strict';
  var el = function (id) { return document.getElementById(id); };
  var lang = document.body.dataset.pageLang || (document.body.classList.contains('lang-es') ? 'es' : 'en');
  var say = function (en, spanish, french) { el('email-note').textContent = lang === 'fr' ? french : lang === 'es' ? spanish : en; };
  // The generated pages translate the body; the tab title is the page's own.
  if (lang === 'fr') document.title = 'Confirmez votre adresse courriel · Séminaire théologique de Chapala';
  // Another email link can open in this same tab without a full navigation.
  window.addEventListener('hashchange', function () {
    if (new URLSearchParams(location.hash.slice(1)).has('token')) location.reload();
  });
  var token = new URLSearchParams(location.hash.slice(1)).get('token');
  if (token) history.replaceState(history.state, '', location.pathname + location.search);
  var code = window.CTS_SYNC && window.CTS_SYNC.code();
  el('email-student-code').hidden = !!code;
  try { el('email-address').value = (JSON.parse(localStorage.getItem('cts_student') || '{}') || {}).email || ''; } catch (e) {}
  function request(path, data, button) {
    button.disabled = true;
    return fetch('/api/email/' + path, { method: 'POST', credentials: 'omit',
      headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().then(function (b) { return { status: r.status, ok: r.ok, body: b }; }); })
      .catch(function () { return { status: 0, ok: false }; })
      .then(function (r) { button.disabled = false; return r; });
  }
  function error(r) {
    if (r.status === 429) say('Please wait before trying again. You can request one email per minute, up to five per day.', 'Espere antes de intentarlo de nuevo. Puede pedir un mensaje por minuto, hasta cinco al día.', 'Veuillez patienter avant de réessayer. Vous pouvez demander un courriel par minute, jusqu’à cinq par jour.');
    else if (r.status === 410 || r.status === 404) say('This confirmation has expired or was already used. Return to your study device to request a new email, or enter your student code here.', 'Esta confirmación venció o ya se usó. Regrese al dispositivo donde estudia para pedir otro correo, o escriba aquí su código de estudiante.', 'Cette confirmation a expiré ou a déjà été utilisée. Retournez sur l’appareil sur lequel vous étudiez pour demander un nouveau courriel, ou saisissez ici votre code d’étudiant.');
    else if (r.status === 400) say('Check the email address or six-digit code and try again.', 'Revise el correo o el código de seis dígitos e inténtelo de nuevo.', 'Vérifiez l’adresse courriel ou le code à six chiffres, puis réessayez.');
    else say('Confirmation is unavailable right now. Try again later; you can keep studying.', 'La confirmación no está disponible ahora. Inténtelo más tarde; puede seguir estudiando.', 'La confirmation n’est pas disponible pour le moment. Réessayez plus tard\u202f; vous pouvez continuer vos études.');
  }
  function confirmed(r) {
    if (!r.ok) { error(r); return false; }
    say('Email confirmed: ' + r.body.email + '. You can continue studying.', 'Correo confirmado: ' + r.body.email + '. Puede seguir estudiando.', 'Adresse courriel confirmée\u00a0: ' + r.body.email + '. Vous pouvez continuer vos études.');
    el('email-request').hidden = true; el('email-link').hidden = true;
    // Link confirmation never restores or signs in the recipient. A code
    // confirmation may refresh only the already-held record on this device.
    if (!token && window.CTS_SYNC && code === window.CTS_SYNC.code()) window.CTS_SYNC.restore(code);
    return true;
  }
  if (token) {
    el('email-link').hidden = false; el('email-request').hidden = true;
    el('email-link-confirm').addEventListener('click', function () {
      request('link', { token: token }, this).then(function (r) {
        if (!confirmed(r)) { el('email-link').hidden = true; el('email-request').hidden = false; }
      });
    });
  }
  el('email-send').addEventListener('click', function () {
    code = (window.CTS_SYNC && window.CTS_SYNC.code()) || el('email-student').value.trim();
    if (!code) { say('Enter your student code first. Enrollment does not require confirmation.', 'Escriba primero su código de estudiante. La inscripción no requiere confirmación.', 'Saisissez d’abord votre code d’étudiant. L’inscription ne demande pas de confirmation.'); return; }
    var field = el('email-address'); field.value = field.value.trim();
    if (!field.reportValidity()) return;
    request('start', { code: code, email: field.value, lang: lang }, this).then(function (r) {
      if (!r.ok) { error(r); return; }
      el('email-code-step').hidden = false;
      say('Sent. Check your inbox and spam folder. Open the link or enter the six-digit code below.', 'Enviado. Revise su bandeja de entrada y la carpeta de spam. Abra el enlace o escriba abajo el código de seis dígitos.', 'Courriel envoyé. Consultez votre boîte de réception et le dossier des courriels indésirables (spam). Ouvrez le lien ou saisissez ci-dessous le code à six chiffres.');
      el('email-code').focus();
    });
  });
  el('email-code-confirm').addEventListener('click', function () {
    var value = el('email-code').value.trim();
    if (!/^\d{6}$/.test(value)) { say('Enter the six-digit code from the email.', 'Escriba el código de seis dígitos del correo.', 'Saisissez le code à six chiffres reçu par courriel.'); return; }
    request('confirm', { code: code, verification: value }, this).then(confirmed);
  });
})();
