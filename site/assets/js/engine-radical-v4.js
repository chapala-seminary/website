/* Exam engine for CTSRadical (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/radical/unitN.js. */
var _ctsMem={};
  function lsGet(k){try{return localStorage.getItem(k);}catch(e){return (k in _ctsMem)?_ctsMem[k]:null;}}
  function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){_ctsMem[k]=String(v);}}
  function lsDel(k){try{localStorage.removeItem(k);}catch(e){delete _ctsMem[k];}}

// ─── CONSTANTS ───────────────────────────────────────────────



const IS_LAST_UNIT = false;
const SHOW_REGISTRATION_CARD = false;

const LOCKOUT_KEY = `cts_radical_u${UNIT}_lockout`;
const PASS_MC = 18;
const PASS_SA = 9;
const TOTAL_UNITS = 13;
const LOCKOUT_DURATION = 15 * 60 * 1000;
// A passing MC score is banked independently of SA, so a Masters student who
// passes MC but not SA never has to redo MC — only SA is locked/retried.


const REDIRECT_DELAY = 3000;

// ─── STATE ───────────────────────────────────────────────────
let progress = JSON.parse(lsGet(PROGRESS_KEY) || '{}');
let currentLang = 'en';
let mcAnswers = new Array(20).fill(null);
let saAnswers = new Array(10).fill('');
let unitPassed = progress['unit' + UNIT] || false;
let graded = false;

// ─── MC DATA (20 questions, 5/5/5/5 A/B/C/D) ─────────────────


// ─── SA DATA (10 questions) ───────────────────────────────────


// ─── INIT ─────────────────────────────────────────────────────
function getStudentTrack() {
  try {
    const s = JSON.parse(lsGet('cts_student') || '{}');
    return (s.track || 'certificate').toLowerCase();
  } catch(e) { return 'certificate'; }
}

function isMdivTrack() {
  const t = getStudentTrack();
  return t === 'mdiv' || t === 'thmn' || t === 'thm';
}

function setLanguage(lang) {
  currentLang = lang;
  document.body.className = 'lang-' + lang;
  document.querySelectorAll('.lang-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang));
  lsSet(`cts_radical_u${UNIT}_lang`, lang);
  renderMC();
  if (isMdivTrack()) renderSA();
}

function buildProgressGrid() {
  const grid = document.getElementById('progressGrid');
  grid.innerHTML = '';
  for (let i = 1; i <= TOTAL_UNITS; i++) {
    const a = document.createElement('a');
    a.href = 'CTSRadicalUnit' + i + '.html';
    a.textContent = i;
    if (progress['unit' + i]) a.classList.add('completed');
    if (i === UNIT) a.classList.add('active');
    grid.appendChild(a);
  }
  const cert = document.createElement('a');
  cert.href = 'CTSRadicalCertificate.html';
  cert.textContent = '✓';
  cert.title = 'Certificate';
  if (progress.certificate) cert.classList.add('completed');
  grid.appendChild(cert);
}

function displayGreeting() {
  try {
    const s = JSON.parse(lsGet('cts_student') || '{}');
    const el = document.getElementById('student-greeting');
    if (s && s.name) el.textContent = '👤 ' + s.name;
  } catch(e) {}
}

// ─── MC RENDER ────────────────────────────────────────────────
function renderMC() {
  const container = document.getElementById('mc-container');
  container.innerHTML = '';
  mcQuestions.forEach((q, idx) => {
    const div = document.createElement('div');
    div.className = 'question';
    div.id = 'mc-q-' + idx;

    const p = document.createElement('p');
    p.className = 'question-text';
    p.innerHTML = currentLang === 'es' ? q.text_es : q.text_en;
    div.appendChild(p);

    const ul = document.createElement('ul');
    ul.className = 'options';
    const opts = currentLang === 'es' ? q.options_es : q.options_en;
    opts.forEach((opt, oi) => {
      const li = document.createElement('li');
      li.id = 'mc-' + idx + '-' + oi;
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'mc_' + idx;
      input.value = oi;
      if (mcAnswers[idx] === oi) input.checked = true;
      input.addEventListener('change', () => {
        mcAnswers[idx] = oi;
        for (let i2 = 0; i2 < 4; i2++) {
          const li2 = document.getElementById('mc-' + idx + '-' + i2);
          if (!li2) continue;
          li2.classList.remove('correct-answer', 'wrong-pick', 'selected-neutral');
          if (i2 === q.correct) li2.classList.add('correct-answer');
          if (oi === i2 && oi !== q.correct) li2.classList.add('wrong-pick');
        }
        const fb = document.getElementById('mc-fb-' + idx);
        if (fb) {
          const isRight = oi === q.correct;
          fb.className = 'feedback show ' + (isRight ? 'correct' : 'incorrect');
          fb.textContent = isRight
            ? (currentLang === 'es' ? q.correctFeedback_es : q.correctFeedback_en)
            : (currentLang === 'es' ? q.incorrectFeedback_es : q.incorrectFeedback_en);
        }
      });
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + String.fromCharCode(65 + oi) + '. ' + opt));
      li.appendChild(label);
      ul.appendChild(li);
    });
    div.appendChild(ul);

    const fb = document.createElement('div');
    fb.className = 'feedback';
    fb.id = 'mc-fb-' + idx;
    div.appendChild(fb);

    container.appendChild(div);
  });

  if (graded) restoreGradeDisplay();
}

// ─── SA RENDER ────────────────────────────────────────────────
function renderSA() {
  const container = document.getElementById('sa-container');
  container.innerHTML = '';
  document.getElementById('sa-section').style.display = 'block';

  saQuestions.forEach((q, idx) => {
    const div = document.createElement('div');
    div.className = 'question';

    const p = document.createElement('p');
    p.className = 'question-text';
    p.innerHTML = currentLang === 'es' ? q.text_es : q.text_en;
    div.appendChild(p);

    const ta = document.createElement('textarea');
    ta.className = 'kw-answer';
    ta.rows = 4;
    ta.dataset.placeholderEn = 'Write your answer here...';
    ta.dataset.placeholderEs = 'Escriba su respuesta aquí...';
    ta.placeholder = currentLang === 'es' ? ta.dataset.placeholderEs : ta.dataset.placeholderEn;
    ta.value = saAnswers[idx] || '';
    ta.addEventListener('input', e => { saAnswers[idx] = e.target.value; });
    div.appendChild(ta);

    const checkBtn = document.createElement('button');
    checkBtn.className = 'small';
    checkBtn.textContent = currentLang === 'es' ? 'Verificar' : 'Check Answer';
    const fb = document.createElement('div');
    fb.className = 'feedback';
    const exp = document.createElement('div');
    exp.className = 'sa-explanation';
    exp.innerHTML = currentLang === 'es' ? q.explanationEs : q.explanationEn;

    checkBtn.addEventListener('click', () => {
      const ans = (ta.value || '').trim().toLowerCase();
      const kws = currentLang === 'es' ? q.kw_es : q.kw_en;
      const bodyIs = document.body.classList;
      let hits = 0;
      if (bodyIs.contains('lang-both')) {
        const enH = q.kw_en.filter(k => ans.includes(k.toLowerCase())).length;
        const esH = q.kw_es.filter(k => ans.includes(k.toLowerCase())).length;
        hits = Math.max(enH, esH);
      } else {
        hits = kws.filter(k => ans.includes(k.toLowerCase())).length;
      }
      if (ans.length < 100) {
        fb.className = 'feedback show incorrect';
        fb.textContent = currentLang === 'es' ? 'Escriba una respuesta más completa (al menos 100 caracteres).' : 'Please write a more complete answer (at least 100 characters).';
        exp.className = 'sa-explanation';
      } else if (hits >= 3) {
        fb.className = 'feedback show correct';
        fb.textContent = currentLang === 'es' ? '✓ ¡Correcto! Su respuesta incluye los conceptos clave.' : '✓ Correct! Your answer includes the key concepts.';
        exp.className = 'sa-explanation show';
      } else {
        const missing = kws.filter(k => !ans.includes(k.toLowerCase())).slice(0, 3);
        fb.className = 'feedback show incorrect';
        fb.textContent = (currentLang === 'es'
          ? '✗ Necesita al menos 3 conceptos clave. Intente incluir: '
          : '✗ Needs at least 3 key concepts. Try including: ') + missing.join(', ') + '.';
        exp.className = 'sa-explanation show';
      }
    });

    div.appendChild(checkBtn);
    div.appendChild(fb);
    div.appendChild(exp);
    container.appendChild(div);
  });
}

// ─── GRADING ─────────────────────────────────────────────────
function gradeMC() {
  let correct = 0;
  mcQuestions.forEach((q, idx) => {
    const selected = document.querySelector('input[name="mc_' + idx + '"]:checked');
    const selVal = selected ? parseInt(selected.value, 10) : -1;
    const isRight = selVal === q.correct;
    if (isRight) correct++;

    // Highlight correct/wrong
    for (let i = 0; i < 4; i++) {
      const li = document.getElementById('mc-' + idx + '-' + i);
      if (!li) continue;
      li.classList.remove('correct-answer', 'wrong-pick');
      if (i === q.correct) li.classList.add('correct-answer');
      if (selVal === i && !isRight) li.classList.add('wrong-pick');
    }

    // Show feedback
    const fb = document.getElementById('mc-fb-' + idx);
    if (fb) {
      fb.className = 'feedback show ' + (isRight ? 'correct' : 'incorrect');
      fb.textContent = isRight
        ? (currentLang === 'es' ? q.correctFeedback_es : q.correctFeedback_en)
        : (currentLang === 'es' ? q.incorrectFeedback_es : q.incorrectFeedback_en);
    }
  });
  return correct;
}

function gradeSAScore() {
  if (!isMdivTrack()) return 0;
  let correct = 0;
  const bodyIs = document.body.classList;
  saQuestions.forEach((q, idx) => {
    const ans = (saAnswers[idx] || '').toLowerCase();
    if (ans.length < 100) return;
    let hits;
    if (bodyIs.contains('lang-both')) {
      const enH = q.kw_en.filter(k => ans.includes(k.toLowerCase())).length;
      const esH = q.kw_es.filter(k => ans.includes(k.toLowerCase())).length;
      hits = Math.max(enH, esH);
    } else {
      const kws = currentLang === 'es' ? q.kw_es : q.kw_en;
      hits = kws.filter(k => ans.includes(k.toLowerCase())).length;
    }
    if (hits >= 3) correct++;
  });
  return correct;
}

function restoreGradeDisplay() {
  mcQuestions.forEach((q, idx) => {
    for (let i = 0; i < 4; i++) {
      const li = document.getElementById('mc-' + idx + '-' + i);
      if (!li) continue;
      li.classList.remove('correct-answer', 'wrong-pick');
      if (i === q.correct) li.classList.add('correct-answer');
      if (mcAnswers[idx] !== null && mcAnswers[idx] === i && i !== q.correct)
        li.classList.add('wrong-pick');
    }
  });
}

// ─── LOCKOUT ─────────────────────────────────────────────────
function checkLockout() {
  const lockUntil = parseInt(lsGet(mcPreviouslyBanked() ? SA_LOCK_KEY : LOCKOUT_KEY) || '0', 10);
  if (Date.now() < lockUntil) return lockUntil;
  return null;
}
function mcPreviouslyBanked() { return lsGet(MC_PASS_KEY) === 'true'; }

// ─── SUBMIT ──────────────────────────────────────────────────
document.getElementById('submitBtn').addEventListener('click', () => {
  const resultEl = document.getElementById('exam-result');

  if (unitPassed) {
    resultEl.className = 'pass';
    resultEl.innerHTML = currentLang === 'es'
      ? `✓ Unidad ya aprobada. ¡Continúa a la Unidad ${UNIT + 1}!`
      : `✓ Unit already passed! Proceed to Unit ${UNIT + 1}.`;
    document.getElementById('nextBtn').disabled = false;
    return;
  }

  const lockUntil = checkLockout();
  if (lockUntil) {
    const mins = Math.ceil((lockUntil - Date.now()) / 60000);
    resultEl.className = 'locked';
    resultEl.innerHTML = (currentLang === 'es'
      ? '⏰ Bloqueado por ' + mins + ' minuto(s) más.'
      : '⏰ Locked for ' + mins + ' more minute(s).');
    return;
  }

  const student = (() => { try { return JSON.parse(lsGet('cts_student') || '{}'); } catch(e) { return {}; } })();
  if (!student || !student.name) {
    alert(currentLang === 'es' ? 'Por favor regístrese primero.' : 'Please register first.');
    return;
  }

  graded = true;
  const mcScore = gradeMC();
  const isMdiv = isMdivTrack();
  const saScore = isMdiv ? gradeSAScore() : 0;

  const totalPossible = isMdiv ? 30 : 20;
  const totalScore = mcScore + (isMdiv ? saScore : 0);
  const pct = Math.round((totalScore / totalPossible) * 100);

  const mcBankedBefore = mcPreviouslyBanked();
  const mcPassed = mcBankedBefore || (mcScore >= PASS_MC);
  const saPassed = !isMdiv || saScore >= PASS_SA;
  const passed = mcPassed && saPassed;

  if (mcPassed) lsSet(MC_PASS_KEY, 'true');

  if (passed) {
    progress['unit' + UNIT] = true;
    lsSet(PROGRESS_KEY, JSON.stringify(progress));
    lsDel(LOCKOUT_KEY);
    lsDel(SA_LOCK_KEY);
    unitPassed = true;
    resultEl.className = 'pass';
    const scoreLine = mcBankedBefore
      ? (currentLang === 'es'
          ? 'OM: ✓ ya guardado · RC: ' + saScore + '/10.'
          : 'MC: ✓ already banked · SA: ' + saScore + '/10.')
      : ('Score: ' + totalScore + '/' + totalPossible + ' (' + pct + '%).');
    resultEl.innerHTML = '✓ PASSED! ' + scoreLine + ' ' +
      (currentLang === 'es' ? 'Sus respuestas están marcadas abajo. Repáselas, luego continúe cuando esté listo.' : 'Your answers are marked below. Review them, then continue when ready.');
    document.getElementById('nextBtn').disabled = false;
    buildProgressGrid();
  } else if (isMdiv && mcPassed && !saPassed) {
    const lockUntilNew = Date.now() + LOCKOUT_DURATION;
    lsSet(SA_LOCK_KEY, String(lockUntilNew));
    resultEl.className = 'fail';
    let msg = '✗ Score: ' + totalScore + '/' + totalPossible + ' (' + pct + '%). ';
    msg += currentLang === 'es'
      ? 'OM: ✓ ya aprobado y guardado. RC: ' + saScore + '/10 (necesita 9). Su Opción Múltiple está a salvo — solo necesita reintentar la Respuesta Corta. '
      : 'MC: ✓ already passed and banked. SA: ' + saScore + '/10 (need 9). Your Multiple Choice is safe — only the Short Answer needs retake. ';
    msg += currentLang === 'es' ? 'Bloqueado por 15 minutos.' : 'Locked for 15 minutes.';
    resultEl.innerHTML = msg;
  } else {
    const lockUntilNew = Date.now() + LOCKOUT_DURATION;
    lsSet(LOCKOUT_KEY, String(lockUntilNew));
    resultEl.className = 'fail';
    let msg = '✗ Score: ' + totalScore + '/' + totalPossible + ' (' + pct + '%). ';
    if (!mcPassed) msg += (currentLang === 'es' ? 'MC: ' + mcScore + '/20 (necesita 18). ' : 'MC: ' + mcScore + '/20 (need 18). ');
    if (isMdiv && !saPassed) msg += (currentLang === 'es' ? 'SA: ' + saScore + '/10 (necesita 9). ' : 'SA: ' + saScore + '/10 (need 9). ');
    msg += currentLang === 'es' ? 'Bloqueado por 15 minutos.' : 'Locked for 15 minutes.';
    resultEl.innerHTML = msg;
  }
});

// ─── RESET ───────────────────────────────────────────────────
document.getElementById('resetBtn').addEventListener('click', () => {
  const msg = currentLang === 'es'
    ? '¿Reiniciar todas las respuestas? Esto no se puede deshacer.'
    : 'Reset all answers? This cannot be undone.';
  if (!confirm(msg)) return;
  mcAnswers = new Array(20).fill(null);
  saAnswers = new Array(10).fill('');
  graded = false;
  document.getElementById('exam-result').innerHTML = '';
  document.getElementById('exam-result').className = '';
  renderMC();
  if (isMdivTrack()) renderSA();
});

// ─── NAV BUTTONS ─────────────────────────────────────────────
document.getElementById('prevBtn').addEventListener('click', () => { location.href = PREV_URL; });
document.getElementById('nextBtn').addEventListener('click', () => { location.href = NEXT_URL; });
if (unitPassed) document.getElementById('nextBtn').disabled = false;

// ─── LANG BUTTONS ────────────────────────────────────────────
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

// ─── STARTUP ─────────────────────────────────────────────────
(function init() {
  buildProgressGrid();
  displayGreeting();
  if (isMdivTrack()) document.getElementById('sa-section').style.display = 'block';

  const savedLang = lsGet(`cts_radical_u${UNIT}_lang`) || 'en';
  setLanguage(savedLang);

  if (unitPassed) {
    const resultEl = document.getElementById('exam-result');
    resultEl.className = 'pass';
    resultEl.innerHTML = currentLang === 'es'
      ? `✓ Unidad ${UNIT} ya aprobada.`
      : `✓ Unit ${UNIT} already passed.`;
    document.getElementById('nextBtn').disabled = false;
  }
})();
