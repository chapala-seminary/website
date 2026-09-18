/* Exam engine for CTSActs (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/acts/unitN.js. */
var _ctsMem={};
  function lsGet(k){try{return localStorage.getItem(k);}catch(e){return (k in _ctsMem)?_ctsMem[k]:null;}}
  function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){_ctsMem[k]=String(v);}}
  function lsDel(k){try{localStorage.removeItem(k);}catch(e){delete _ctsMem[k];}}


const TOTAL_UNITS = 11;



// === MC + SA data (preserved verbatim from upstream) ===




// === Language toggle (3-button group) ===
const langButtons = document.querySelectorAll('.lang-toggle-group button');
function setLang(lang) {
  document.body.classList.remove('lang-en','lang-es','lang-both');
  document.body.classList.add('lang-' + lang);
  langButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
}
langButtons.forEach(btn => btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang'))));

// === Student + Track ===
function readStudent() {
  try { return JSON.parse(lsGet('cts_student') || 'null'); } catch(e) { return null; }
}
function readTrack() {
  const t = lsGet('cts_track');
  if (t === 'cert' || t === 'mdiv' || t === 'thm') return t;
  const st = readStudent();
  if (st && st.track) return st.track;
  return 'cert';
}
function isMdiv() { const t = readTrack(); return t === 'mdiv' || t === 'thm'; }

// === Greeting + track badge ===
function applyStudentUI() {
  const student = readStudent();
  const isEs = document.body.classList.contains('lang-es');
  const greetEl = document.getElementById('studentGreeting');
  const warn = document.getElementById('regWarn');
  const slot = document.getElementById('trackBadgeSlot');
  if (student && student.name) {
    greetEl.innerHTML = '👋 ' + student.name;
    if (warn) warn.classList.add('hidden');
    const track = readTrack();
    const label = track === 'thm' ? 'Th.M.' : (track === 'mdiv' ? 'M.Div' : (isEs ? 'Certificado' : 'Certificate'));
    if (slot) slot.innerHTML = '<span class="track-badge">' + label + '</span>';
  } else {
    greetEl.innerHTML = '<span style="color:#5b3a1f;">' + (isEs ? 'Bienvenido al Intensivo de Hechos' : 'Welcome to the Acts Intensive') + '</span>';
    if (warn) warn.classList.remove('hidden');
    if (slot) slot.innerHTML = '';
  }
}

// === Registration modal (U1 only) ===

function showRegModal() {
  const modal = document.getElementById('regModal');
  if (modal) modal.classList.remove('hidden');
}
function hideRegModal() {
  const modal = document.getElementById('regModal');
  if (modal) modal.classList.add('hidden');
}
const regModal = document.getElementById('regModal');
const openBtn = document.getElementById('openRegBtn');
const openBtn2 = document.getElementById('openRegBtn2');
const saveBtn = document.getElementById('regSaveBtn');
if (openBtn) openBtn.addEventListener('click', showRegModal);
if (openBtn2) openBtn2.addEventListener('click', showRegModal);
if (saveBtn) saveBtn.addEventListener('click', () => {
  const name = (document.getElementById('regName').value || '').trim();
  const email = (document.getElementById('regEmail').value || '').trim();
  const track = (document.querySelector('input[name="regTrack"]:checked') || {}).value || 'cert';
  const isEs = document.body.classList.contains('lang-es');
  if (!name) {
    alert(isEs ? 'Por favor ingrese su nombre completo.' : 'Please enter your full name.');
    return;
  }
  const rec = { name: name, email: email, track: track };
  try {
    lsSet('cts_student', JSON.stringify(rec));
    lsSet('cts_track', track);
  } catch(e) {}
  hideRegModal();
  applyStudentUI();
  applyExamState();
});
// Auto-open modal on U1 if no cts_student present
if (CURRENT_UNIT === 1 && !readStudent()) {
  showRegModal();
}


// === Progress grid ===
let progress = {};
try { progress = JSON.parse(lsGet('cts_acts_progress')) || {}; } catch(e) { progress = {}; }
function updateProgressGrid() {
  const grid = document.getElementById('progressGrid');
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 1; i <= TOTAL_UNITS; i++) {
    let cls = '';
    if (progress['unit' + i]) cls = 'completed';
    if (i === CURRENT_UNIT) cls += ' active';
    grid.innerHTML += '<a href="CTSActsUnit' + i + '.html" class="' + cls + '">' + i + '</a>';
  }
}
updateProgressGrid();
document.getElementById('prevUnitBtn').onclick = () => {};
document.getElementById('nextUnitBtn').onclick = () => { window.location.href = NEXT_URL; };

// === Per-unit state keys ===
const MC_PASSED_KEY = 'cts_acts_u' + CURRENT_UNIT + '_mc_passed';
const SA_PASSED_KEY = 'cts_acts_u' + CURRENT_UNIT + '_sa_passed';
const MC_SCORE_KEY = 'cts_acts_u' + CURRENT_UNIT + '_mc_score';
const LOCK_MC_KEY = 'cts_acts_u' + CURRENT_UNIT + '_lockout';
const LOCK_SA_KEY = 'cts_acts_u' + CURRENT_UNIT + '_sa_lockout';

function mcPassed() { return lsGet(MC_PASSED_KEY) === '1'; }
function saPassed() { return lsGet(SA_PASSED_KEY) === '1'; }
function activeLock() {
  const now = Date.now();
  const mc = parseInt(lsGet(LOCK_MC_KEY) || '0', 10);
  const sa = parseInt(lsGet(LOCK_SA_KEY) || '0', 10);
  if (mcPassed()) { if (now < sa) return { until: sa, scope: 'sa' }; }
  else { if (now < mc) return { until: mc, scope: 'mc' }; }
  return null;
}

// === Render MC ===
const mcContainer = document.getElementById('mcContainer');
mcQuestions.forEach((q, idx) => {
    /* CTS answer-shuffle (anti-gaming): randomize option order on each render */
    (function(){var _o=q.optionsEn,_s=q.optionsEs,_n=_o.length,_p=[],_k,_i,_j,_t;for(_k=0;_k<_n;_k++){_p.push(_k);}for(_i=_n-1;_i>0;_i--){_j=Math.floor(Math.random()*(_i+1));_t=_p[_i];_p[_i]=_p[_j];_p[_j]=_t;}q.optionsEn=_p.map(function(x){return _o[x];});q.optionsEs=_p.map(function(x){return _s[x];});q.correct=_p.indexOf(q.correct);})();
  const qDiv = document.createElement('div');
  qDiv.className = 'question';
  qDiv.id = 'mcq' + (idx + 1);
  let h = '<p class="q"><span class="lang-en">' + q.textEn + '</span><span class="lang-es">' + q.textEs + '</span></p>';
  for (let i = 0; i < 4; i++) {
    const letter = 'ABCD'[i];
    h += '<button class="option" data-mc="' + idx + '" data-opt="' + i + '" type="button">' +
         '<strong>' + letter + '.</strong> ' +
         '<span class="lang-en">' + q.optionsEn[i] + '</span><span class="lang-es">' + q.optionsEs[i] + '</span>' +
         '</button>';
  }
  mcContainer.appendChild(qDiv);
  qDiv.innerHTML = h;
  // Click handler on each option
  qDiv.querySelectorAll('.option').forEach(btn => {
    btn.addEventListener('click', () => {
      if (mcPassed()) return;
      if (qDiv.dataset.answered !== undefined && qDiv.dataset.answered !== '') return;
      const isEs = document.body.classList.contains('lang-es');
      const chosen = parseInt(btn.getAttribute('data-opt'), 10);
      const correct = q.correct;
      qDiv.dataset.answered = String(chosen);
      qDiv.querySelectorAll('.option').forEach(b => {
        const oi = parseInt(b.getAttribute('data-opt'), 10);
        b.classList.remove('correct','wrong'); b.style.background=''; b.style.borderColor=''; b.style.fontWeight='';
        if (oi === correct) b.classList.add('correct');
        else if (oi === chosen) b.classList.add('wrong');
      });
      const oldfb = qDiv.querySelector('.feedback-text'); if (oldfb) oldfb.remove();
      const fb = document.createElement('div');
      if (chosen === correct) { fb.className = 'feedback-text correct'; fb.textContent = isEs ? '✓ ¡Correcto!' : '✓ Correct!'; }
      else { const cL = 'ABCD'[correct]; fb.className = 'feedback-text incorrect'; fb.textContent = (isEs ? '✗ Incorrecto. Respuesta correcta: ' : '✗ Incorrect. Correct answer: ') + cL; }
      qDiv.appendChild(fb);
    });
  });
});

// === Smart keyword matcher (word-boundary, like the other CTS courses) ===
function kwHit(answer, kw){
  if(!kw) return false;
  var a=(answer||'').toLowerCase();
  var k=String(kw).toLowerCase().trim();
  if(!k) return false;
  var esc=k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  var L='0-9a-zA-Z\u00e1\u00e9\u00ed\u00f3\u00fa\u00fc\u00f1';
  var re = k.length<=3 ? new RegExp('(?:^|[^'+L+'])'+esc+'(?!['+L+'])') : new RegExp('(?:^|[^'+L+'])'+esc);
  return re.test(a);
}
function saHits(idx){
  var ta=document.querySelector('.kw-answer[data-sa="'+idx+'"]');
  var q=kwQuestions[idx];
  var isEs=document.body.classList.contains('lang-es');
  var kws=isEs?(q.kwEs||[]):(q.kwEn||[]);
  var ans=(ta&&ta.value)||'';
  var n=0; kws.forEach(function(k){ if(kwHit(ans,k)) n++; });
  return n;
}
function revealSAModel(idx){
  var q=kwQuestions[idx];
  var isEs=document.body.classList.contains('lang-es');
  var box=document.getElementById('saModel'+idx);
  if(!box) return;
  var head=isEs?'Respuesta modelo \u2014 est\u00fadiela':'Model answer \u2014 study this';
  box.innerHTML='<strong>'+head+':</strong><br>'+(isEs?(q.modelEs||''):(q.modelEn||''));
  box.style.display='block';
}

// === Render SA ===
const kwContainer = document.getElementById('kwContainer');
kwQuestions.forEach((q, idx) => {
  const qDiv = document.createElement('div');
  qDiv.className = 'question';
  qDiv.id = 'saq' + (idx + 1);
  qDiv.innerHTML =
    '<p class="q"><span class="lang-en">' + q.textEn + '</span><span class="lang-es">' + q.textEs + '</span></p>' +
    '<textarea class="kw-answer" data-sa="' + idx + '" placeholder=""></textarea>' +
    '<button class="small check-kw-btn" type="button"><span class="lang-en">Check Answer</span><span class="lang-es">Verificar</span></button>' +
    '<div class="feedback-text" id="saFb' + idx + '" style="display:none"></div>' +
    '<div class="sa-model" id="saModel' + idx + '" style="display:none"></div>';
  kwContainer.appendChild(qDiv);
  const btn = qDiv.querySelector('.check-kw-btn');
  const ta = qDiv.querySelector('.kw-answer');
  btn.addEventListener('click', () => {
    const isEs = document.body.classList.contains('lang-es');
    const fb = document.getElementById('saFb' + idx);
    const ans = (ta.value || '').trim();
    if(!ans){
      fb.className = 'feedback-text';
      fb.style.display = 'block';
      fb.textContent = isEs ? 'Escriba su respuesta primero, luego verifique.' : 'Write your answer first, then check.';
      var mb=document.getElementById('saModel'+idx); if(mb) mb.style.display='none';
      qDiv.dataset.answered = '0';
      return;
    }
    if(ans.length < 100){
      fb.className = 'feedback-text';
      fb.style.display = 'block';
      fb.textContent = isEs ? 'Escriba una respuesta m\u00e1s completa (al menos 100 caracteres) antes de verificar.' : 'Write a fuller answer (at least 100 characters) before checking.';
      var mb2=document.getElementById('saModel'+idx); if(mb2) mb2.style.display='none';
      qDiv.dataset.answered = '0';
      return;
    }
    const hits = saHits(idx);
    const ok = hits >= 3;
    qDiv.dataset.answered = ok ? '1' : '0';
    fb.className = 'feedback-text ' + (ok ? 'correct' : 'incorrect');
    fb.style.display = 'block';
    fb.textContent = ok
      ? (isEs ? ('\u2713 Suficientes palabras clave (' + hits + ').') : ('\u2713 Sufficient keywords (' + hits + ').'))
      : (isEs ? ('\u2717 A\u00fan no acreditada. Encontr\u00f3 ' + hits + ' de 3.') : ('\u2717 Not yet credited. Found ' + hits + ' of 3.'));
    revealSAModel(idx);
  });
});

// === UI state machine ===
const mcSection = document.getElementById('mcSection');
const saSection = document.getElementById('saSection');
const statusEl = document.getElementById('examStatus');
const submitBtn = document.getElementById('submitExamBtn');
const resetBtn = document.getElementById('resetExamBtn');
const resultEl = document.getElementById('examResult');

function setStatus(cls, en, es) {
  statusEl.className = 'exam-status ' + cls;
  statusEl.innerHTML = '<span class="lang-en">' + en + '</span><span class="lang-es">' + es + '</span>';
}
function clearStatus() { statusEl.className = 'exam-status hidden'; statusEl.innerHTML = ''; }
function lockMcAsReview() {
  document.querySelectorAll('#mcContainer .question').forEach(q => {
    q.classList.add('review-locked');
    q.querySelectorAll('.option').forEach(b => { b.disabled = true; });
  });
}

function revealMC() {
  const isEs = document.body.classList.contains('lang-es');
  for (let i = 0; i < mcQuestions.length; i++) {
    const qd = document.getElementById('mcq' + (i + 1));
    if (!qd) continue;
    const correct = mcQuestions[i].correct;
    const chosen = (qd.dataset.answered !== undefined && qd.dataset.answered !== '') ? parseInt(qd.dataset.answered, 10) : -1;
    qd.querySelectorAll('.option').forEach(b => {
      const oi = parseInt(b.getAttribute('data-opt'), 10);
      b.classList.remove('correct','wrong'); b.style.background=''; b.style.borderColor=''; b.style.fontWeight='';
      if (oi === correct) b.classList.add('correct');
      else if (oi === chosen) b.classList.add('wrong');
    });
    let fb = qd.querySelector('.feedback-text');
    if (!fb) { fb = document.createElement('div'); qd.appendChild(fb); }
    if (chosen === correct) { fb.className = 'feedback-text correct'; fb.textContent = isEs ? '✓ ¡Correcto!' : '✓ Correct!'; }
    else { const cL = 'ABCD'[correct]; fb.className = 'feedback-text incorrect'; fb.textContent = (isEs ? '✗ Incorrecto. Respuesta correcta: ' : '✗ Incorrect. Correct answer: ') + cL; }
  }
}


function applyExamState() {
  const isEs = document.body.classList.contains('lang-es');
  // SA section is ALWAYS visible
  saSection.style.display = '';
  const badgeEn = document.getElementById('saBadgeEn');
  const badgeEs = document.getElementById('saBadgeEs');
  const noteEn = document.getElementById('saNoteEn');
  const noteEs = document.getElementById('saNoteEs');
  if (isMdiv()) {
    badgeEn.textContent = 'Required for M.Div';
    badgeEs.textContent = 'Requerido para M.Div';
    noteEn.textContent = 'These 10 short-answer questions are required to complete Unit ' + CURRENT_UNIT + ' on the M.Div track. You must pass at 9 of 10.';
    noteEs.textContent = 'Estas 10 preguntas de respuesta corta son requeridas para completar la Unidad ' + CURRENT_UNIT + ' en la vía M.Div. Debe aprobar con 9 de 10.';
  } else {
    badgeEn.textContent = 'Self-study — not graded for Certificate';
    badgeEs.textContent = 'Auto-estudio — no cuenta para Certificado';
    noteEn.textContent = 'These are the M.Div-level questions. Certificate students are welcome to attempt them for self-check; your answers will not affect your Unit ' + CURRENT_UNIT + ' pass status.';
    noteEs.textContent = 'Estas son las preguntas de nivel M.Div. Los estudiantes de Certificado pueden intentarlas para auto-evaluarse; sus respuestas no afectarán el estado de aprobación de la Unidad ' + CURRENT_UNIT + '.';
  }
  const lock = activeLock();
  if (lock) {
    const minsLeft = Math.ceil((lock.until - Date.now()) / 60000);
    submitBtn.disabled = true;
    if (lock.scope === 'mc') {
      setStatus('locked',
        'Exam locked. Try again in ' + minsLeft + ' minute(s). The full exam will reset.',
        'Examen bloqueado. Intente de nuevo en ' + minsLeft + ' minuto(s). El examen completo se reiniciará.');
    } else {
      setStatus('locked',
        'Short-answer section locked. Try again in ' + minsLeft + ' minute(s). Multiple-choice pass is preserved.',
        'Sección de respuesta corta bloqueada. Intente de nuevo en ' + minsLeft + ' minuto(s). Su aprobación de opción múltiple se conserva.');
      lockMcAsReview();
    }
    setTimeout(applyExamState, 30000);
    return;
  }
  submitBtn.disabled = false;
  if (mcPassed()) {
    lockMcAsReview();
    if (isMdiv() && !saPassed()) {
      setStatus('mc-passed',
        'Multiple-choice passed (saved). Complete the 10 short-answer questions to finish Unit ' + CURRENT_UNIT + '.',
        'Opción múltiple aprobada (guardada). Complete las 10 preguntas de respuesta corta para terminar la Unidad ' + CURRENT_UNIT + '.');
    } else if (!isMdiv()) {
      setStatus('mc-passed',
        'Multiple-choice passed. Unit ' + CURRENT_UNIT + ' complete for Certificate track.',
        'Opción múltiple aprobada. Unidad ' + CURRENT_UNIT + ' completa para la vía Certificado.');
    } else {
      clearStatus();
    }
  } else {
    clearStatus();
  }
}

submitBtn.addEventListener('click', () => {
  const isEs = document.body.classList.contains('lang-es');
  const lock = activeLock();
  if (lock) { applyExamState(); return; }

  // Score MC
  let mc = 0;
  for (let i = 0; i < 20; i++) {
    const qd = document.getElementById('mcq' + (i + 1));
    if (qd && qd.dataset.answered !== undefined && parseInt(qd.dataset.answered, 10) === mcQuestions[i].correct) mc++;
  }
  if (mcPassed()) {
    mc = parseInt(lsGet(MC_SCORE_KEY) || '18', 10);
  }
  const mcPass = mc >= 18;
  revealMC();

  // Score SA
  let sa = 0;
  for (let i = 0; i < 10; i++) {
    const qd = document.getElementById('saq' + (i + 1));
    if (qd && qd.dataset.answered === '1') sa++;
  }
  const saPass = sa >= 9;

  if (!isMdiv()) {
    // Certificate track — only MC matters
    if (mcPass) {
      lsSet(MC_PASSED_KEY, '1');
      lsSet(MC_SCORE_KEY, String(mc));
      progress['unit' + CURRENT_UNIT] = true;
      lsSet('cts_acts_progress', JSON.stringify(progress));
      resultEl.style.color = '#1f6b3b';
      resultEl.textContent = (isEs
        ? '¡Aprobado! OM ' + mc + '/20. Unidad ' + CURRENT_UNIT + ' completa. Redirigiendo...'
        : 'Passed! MC ' + mc + '/20. Unit ' + CURRENT_UNIT + ' complete. Redirecting...');
    } else {
      lsSet(LOCK_MC_KEY, String(Date.now() + 15 * 60 * 1000));
      resultEl.style.color = '#8a1f1f';
      resultEl.textContent = (isEs
        ? 'Reprobado: OM ' + mc + '/20. Necesita 18. Bloqueado 15 min.'
        : 'Failed: MC ' + mc + '/20. Need 18. Locked 15 min.');
      submitBtn.disabled = true;
      setTimeout(applyExamState, 30000);
    }
    return;
  }

  // M.Div track
  if (!mcPassed()) {
    if (!mcPass) {
      lsSet(LOCK_MC_KEY, String(Date.now() + 15 * 60 * 1000));
      resultEl.style.color = '#8a1f1f';
      resultEl.textContent = (isEs
        ? 'Reprobado: OM ' + mc + '/20. Necesita 18. Bloqueado 15 min. Examen completo se reiniciará.'
        : 'Failed: MC ' + mc + '/20. Need 18. Locked 15 min. Full exam will reset.');
      submitBtn.disabled = true;
      setTimeout(applyExamState, 30000);
      return;
    }
    lsSet(MC_PASSED_KEY, '1');
    lsSet(MC_SCORE_KEY, String(mc));
  }
  if (saPass) {
    lsSet(SA_PASSED_KEY, '1');
    progress['unit' + CURRENT_UNIT] = true;
    lsSet('cts_acts_progress', JSON.stringify(progress));
    const finalMc = parseInt(lsGet(MC_SCORE_KEY) || '18', 10);
    resultEl.style.color = '#1f6b3b';
    resultEl.textContent = (isEs
      ? '¡Aprobado! OM ' + finalMc + '/20, RC ' + sa + '/10. Unidad ' + CURRENT_UNIT + ' completa. Redirigiendo...'
      : 'Passed! MC ' + finalMc + '/20, SA ' + sa + '/10. Unit ' + CURRENT_UNIT + ' complete. Redirecting...');
  } else {
    lsSet(LOCK_SA_KEY, String(Date.now() + 15 * 60 * 1000));
    resultEl.style.color = '#8a1f1f';
    resultEl.textContent = (isEs
      ? 'RC ' + sa + '/10. Necesita 9. Sección RC bloqueada 15 min. OM permanece aprobada.'
      : 'SA ' + sa + '/10. Need 9. SA section locked 15 min. MC pass preserved.');
    submitBtn.disabled = true;
    setTimeout(applyExamState, 30000);
  }
});

resetBtn.addEventListener('click', () => {
  const isEs = document.body.classList.contains('lang-es');
  const msg = isEs
    ? '¿Reiniciar la Unidad ' + CURRENT_UNIT + '? Esto borrará sus respuestas y el estado de aprobación de OM/RC para esta unidad. (Esto no borra su registro.)'
    : 'Reset Unit ' + CURRENT_UNIT + '? This will clear your answers and MC/SA pass state for this unit. (Does not clear your registration.)';
  if (!window.confirm(msg)) return;
  [MC_PASSED_KEY, SA_PASSED_KEY, LOCK_MC_KEY, LOCK_SA_KEY, MC_SCORE_KEY].forEach(k => lsDel(k));
  if (progress['unit' + CURRENT_UNIT]) {
    delete progress['unit' + CURRENT_UNIT];
    lsSet('cts_acts_progress', JSON.stringify(progress));
  }
  window.location.reload();
});

// Initial render
applyStudentUI();
langButtons.forEach(b => b.addEventListener('click', applyStudentUI));
applyExamState();
