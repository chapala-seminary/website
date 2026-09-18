/* Exam engine for CTSRev (shared by 13 unit pages).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/rev/unitN.js. */
// =====================================================================
// CTS Revelation Intensive — Unit 1 (How to Read Revelation, Revelation 1:1-8)
// Built on Cook's validated masters engine (from ST11) with two upgrades:
//   (1) per-question Check Answer now uses smart kwHit (was raw indexOf)
//   (2) storage hardening: lsGet/lsSet/lsDel with in-memory _ctsMem fallback
//       (so the engine survives Android content:// browsers that block
//        localStorage).
// Implements: cts_track gating, MC-pass persists, SA-only lockout on
// partial failure, split kw_en/kw_es, mid-exam save/restore, Reset,
// 3s auto-redirect on pass.
// =====================================================================


const COURSE = 'rev';

const totalUnits = 15;
let currentUnit = UNIT;

// ---------- Storage hardening (Android content:// fallback) ----------
var _ctsMem = {};
function lsGet(k){ try { return localStorage.getItem(k); } catch(e){ return (k in _ctsMem) ? _ctsMem[k] : null; } }
function lsSet(k,v){ try { localStorage.setItem(k,v); } catch(e){ _ctsMem[k] = String(v); } }
function lsDel(k){ try { localStorage.removeItem(k); } catch(e){ delete _ctsMem[k]; } }

// localStorage keys
const STATE_KEY     = `cts_${COURSE}_u${UNIT}_state`;
const MC_PASS_KEY   = `cts_${COURSE}_u${UNIT}_mc_passed`;
const SA_LOCK_KEY   = `cts_${COURSE}_u${UNIT}_sa_lock`;
const FULL_LOCK_KEY = `cts_${COURSE}_u${UNIT}_full_lock`;
const PROGRESS_KEY  = `cts_${COURSE}_progress`;

function lockMinutes() {
    try {
        const t = (JSON.parse(lsGet('cts_student') || 'null') || {}).track;
        return (t === 'mdiv' || t === 'thm') ? 15 : 2;
    } catch (e) { return 2; }
}

let progress = {};
try { progress = JSON.parse(lsGet(PROGRESS_KEY) || '{}'); } catch(e) { progress = {}; }
let unitPassed = !!progress[`unit${UNIT}`];
let mcPreviouslyPassed = lsGet(MC_PASS_KEY) === 'true';



function updateProgressGrid() {
    const grid = document.getElementById('progressGrid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 1; i <= totalUnits; i++) {
        let cls = '';
        if (progress[`unit${i}`]) cls = 'completed';
        if (i === currentUnit) cls += ' active';
        grid.innerHTML += `<a href="CTSRevUnit${i}.html" class="${cls}" title="${unitTitlesEn[i-1]}">${i}</a>`;
    }
    if (progress[`unit${UNIT}`]) document.getElementById('nextUnitBtn').disabled = false;
}
document.getElementById('nextUnitBtn').onclick = () => { location.href = NEXT_UNIT_URL; };
updateProgressGrid();

function displayStudentGreeting() {
    const student = JSON.parse(lsGet('cts_student') || 'null');
    if (student && student.name) {
        document.getElementById('studentGreeting').innerHTML = `👋 ${student.name}`;
        document.getElementById('regCard').style.display = 'none';
    }
}
displayStudentGreeting();

document.getElementById('regBtn').onclick = function() {
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const track = document.getElementById('regTrack').value;
    if (!name || !email) {
        document.getElementById('regStatus').innerHTML = "<span style='color:red'>Please fill all fields.</span>";
        return;
    }
    const student = { name, email, track, registered: new Date().toISOString() };
    lsSet('cts_student', JSON.stringify(student));
    document.getElementById('regStatus').innerHTML = "<span style='color:green'>✓ Registered successfully!</span>";
    setTimeout(() => { document.getElementById('regCard').style.display = 'none'; displayStudentGreeting(); }, 800);
};

document.getElementById('langToggleBtn').onclick = function() {
    if (document.body.classList.contains('lang-en')) {
        document.body.classList.remove('lang-en');
        document.body.classList.add('lang-es');
        this.textContent = 'English';
    } else {
        document.body.classList.remove('lang-es');
        document.body.classList.add('lang-en');
        this.textContent = 'Español';
    }
    renderQuestions();
    checkLockouts();
};

// MC answer key distribution audited: A=B=C=D=5 (verified by build script)




// ---------- Mid-exam state save/restore ----------
let currentLang = 'en';
let mcAnswers = new Array(20).fill(null);
let kwAnswers = new Array(10).fill("");
let mcRevealed = false;
try {
    const st = JSON.parse(lsGet(STATE_KEY) || '{}');
    if (Array.isArray(st.mcAnswers) && st.mcAnswers.length === 20) mcAnswers = st.mcAnswers;
    if (Array.isArray(st.kwAnswers) && st.kwAnswers.length === 10) kwAnswers = st.kwAnswers;
} catch(e) {}

function saveState() {
    lsSet(STATE_KEY, JSON.stringify({ mcAnswers, kwAnswers }));
}

// ---------- Lockout check & UI ----------
function checkLockouts() {
    const submitBtn = document.getElementById('submitExamBtn');
    const result = document.getElementById('examResult');
    const notice = document.getElementById('mcBankedNotice');
    const isEs = document.body.classList.contains('lang-es');
    const now = Date.now();
    const fullLock = parseInt(lsGet(FULL_LOCK_KEY) || '0', 10);
    const saLock = parseInt(lsGet(SA_LOCK_KEY) || '0', 10);

    if (unitPassed) {
        submitBtn.disabled = true;
        result.innerHTML = isEs
            ? `<span style='color:#1f6b3b'>✓ Unidad ya aprobada. Haga clic en Unidad ${UNIT + 1} arriba.</span>`
            : `<span style='color:green'>✓ Unit already passed! Click Unit ${UNIT + 1} above.</span>`;
        notice.style.display = 'none';
        return true;
    }
    if (now < fullLock) {
        const m = Math.ceil((fullLock - now) / 60000);
        submitBtn.disabled = true;
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>📖 Tome unos minutos para repasar la lección de arriba, y luego intente de nuevo. Puede reintentar en ${m} minuto(s). ¡Usted puede lograrlo!</span>`
            : `<span style='color:#8a1f1f'>📖 Take a few minutes to review the lesson above, then try again. You can retry in ${m} minute(s) — you've got this!</span>`;
        notice.style.display = 'none';
        setTimeout(checkLockouts, 30000);
        return false;
    }
    if (mcPreviouslyPassed && now < saLock) {
        const m = Math.ceil((saLock - now) / 60000);
        submitBtn.disabled = true;
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>📖 Opción múltiple aprobada y guardada. Repase la lección y las respuestas modelo, y reintente la sección de respuesta corta en ${m} minuto(s). ¡Siga adelante!</span>`
            : `<span style='color:#8a1f1f'>📖 Multiple choice passed and banked. Review the lesson and the model answers, then retry the short-answer section in ${m} minute(s). Keep going!</span>`;
        if (notice) {
            notice.style.display = 'block';
            notice.innerHTML = isEs
                ? "✓ MC ya aprobado y guardado. Solo necesita reenviar la sección de respuesta corta (9/10)."
                : "✓ MC already passed and banked. Only need to resubmit the short-answer section (9/10).";
        }
        return false;
    }
    submitBtn.disabled = false;
    if (mcPreviouslyPassed) {
        notice.style.display = 'block';
        notice.innerHTML = isEs
            ? "✓ MC ya aprobado y guardado. Solo necesita reenviar la sección de respuesta corta (9/10)."
            : "✓ MC already passed and banked. Only need to resubmit the short-answer section (9/10).";
    } else {
        notice.style.display = 'none';
    }
    return true;
}

// ---------- Render ----------
function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    if (!container) return;
    container.innerHTML = '';
    currentLang = document.body.classList.contains('lang-en') ? 'en' : 'es';

    const mcTitle = document.createElement('h3');
    mcTitle.innerHTML = currentLang === 'en' ? 'Multiple Choice (Questions 1–20)' : 'Opción Múltiple (Preguntas 1–20)';
    container.appendChild(mcTitle);

    if (mcPreviouslyPassed) {
        const banked = document.createElement('div');
        banked.className = 'feedback-text correct';
        banked.style.marginBottom = '15px';
        banked.innerHTML = currentLang === 'en'
            ? '✓ Multiple-choice section previously passed. Your answers are preserved below for reference; you may proceed directly to the short-answer section.'
            : '✓ Sección de opción múltiple ya aprobada. Sus respuestas se conservan abajo para referencia; puede pasar directamente a la sección de respuesta corta.';
        container.appendChild(banked);
    }

    const mcReveal = mcRevealed || mcPreviouslyPassed;
    mcQuestions.forEach((q, idx) => {
        const div = document.createElement('div');
        div.className = 'question';
        const qText = document.createElement('p');
        qText.style.fontWeight = 'bold';
        qText.innerHTML = currentLang === 'en' ? q.textEn : q.textEs;
        div.appendChild(qText);
        const options = currentLang === 'en' ? q.optionsEn : q.optionsEs;
        const correctLetter = String.fromCharCode(65 + q.correct);
        const answered = !!mcAnswers[idx];
        options.forEach((opt, optIdx) => {
            const letter = String.fromCharCode(65 + optIdx);
            const btn = document.createElement('button');
            btn.className = 'option';
            btn.textContent = `${letter}. ${opt}`;
            if (mcReveal || answered) {
                if (optIdx === q.correct) btn.classList.add('correct');
                else if (mcAnswers[idx] === letter) btn.classList.add('wrong');
            } else if (mcAnswers[idx] === letter) {
                btn.style.background = '#efe7d2';
                btn.style.borderColor = '#d4af37';
                btn.style.fontWeight = '600';
            }
            if (!mcPreviouslyPassed && !unitPassed && !answered) {
                btn.onclick = function() {
                    
                    mcAnswers[idx] = letter;
                    saveState();
                    renderQuestions();
                };
            }
            div.appendChild(btn);
        });
        if (mcReveal || answered) {
            const fb = document.createElement('div');
            const exp = currentLang === 'en' ? (q.explanationEn || '') : (q.explanationEs || '');
            if (mcAnswers[idx] === correctLetter) {
                fb.className = 'feedback-text correct';
                fb.innerHTML = (currentLang === 'en' ? '✓ Correct! ' : '✓ ¡Correcto! ') + exp;
            } else if (mcAnswers[idx]) {
                fb.className = 'feedback-text incorrect';
                fb.innerHTML = (currentLang === 'en' ? `✗ Incorrect. Correct answer: ${correctLetter}. ` : `✗ Incorrecto. Respuesta correcta: ${correctLetter}. `) + exp;
            } else {
                fb.className = 'feedback-text incorrect';
                fb.innerHTML = (currentLang === 'en' ? `Not answered. Correct answer: ${correctLetter}. ` : `Sin responder. Respuesta correcta: ${correctLetter}. `) + exp;
            }
            div.appendChild(fb);
        }
        container.appendChild(div);
    });

    const kwTitle = document.createElement('h3');
    kwTitle.style.marginTop = '30px';
    kwTitle.innerHTML = currentLang === 'en' ? 'Short Answer (21–30) — M.Div. / Th.M. Track' : 'Respuesta Corta (21–30) — M.Div. / Th.M.';
    container.appendChild(kwTitle);

    kwQuestions.forEach((q, idx) => {
        const div = document.createElement('div');
        div.className = 'question';
        const qText = document.createElement('p');
        qText.style.fontWeight = 'bold';
        qText.innerHTML = currentLang === 'en' ? q.textEn : q.textEs;
        div.appendChild(qText);
        const ta = document.createElement('textarea');
        ta.className = 'kw-answer';
        ta.rows = 3;
        ta.placeholder = currentLang === 'en' ? 'Type your answer...' : 'Escriba su respuesta...';
        ta.value = kwAnswers[idx] || '';
        div.appendChild(ta);
        const checkBtn = document.createElement('button');
        checkBtn.className = 'small';
        checkBtn.textContent = currentLang === 'en' ? 'Check Answer' : 'Verificar';
        const fb = document.createElement('div');
        fb.style.marginTop = '8px';
        const modelBox = document.createElement('div');
        modelBox.className = 'model-answer';
        modelBox.style.display = 'none';
        checkBtn.onclick = function() {
            const ans = (ta.value || '').trim().toLowerCase();
            const kws = currentLang === 'es' ? q.kw_es : q.kw_en;
            if (ans.length < 100) {
                fb.className = 'feedback-text incorrect';
                fb.innerHTML = currentLang === 'en' ? 'Please write your own answer first — at least a few sentences (about 100 characters) — then check it against the model answer below.' : 'Escriba primero su propia respuesta — al menos unas cuantas oraciones (unos 100 caracteres) — luego compárela con la respuesta modelo abajo.';
                return;
            }
            // Smart kwHit matcher (upgrade over ST11's raw indexOf in the live check)
            const hits = kws.filter(kw => kwHit(ans, kw)).length;
            fb.className = 'feedback-text correct';
            if (hits >= 3) {
                fb.innerHTML = currentLang === 'en'
                    ? `✓ Well done — your answer touches ${hits} of the lesson's key ideas. Now compare it with the model answer below to deepen your understanding.`
                    : `✓ Muy bien — su respuesta toca ${hits} de las ideas clave de la lección. Ahora compárela con la respuesta modelo abajo para profundizar su comprensión.`;
            } else {
                fb.innerHTML = currentLang === 'en'
                    ? `Good effort — you have begun the answer. Read the model answer below and notice the key ideas you might add. This is how we learn; there is no penalty.`
                    : `Buen esfuerzo — ha comenzado la respuesta. Lea la respuesta modelo abajo y note las ideas clave que podría añadir. Así aprendemos; no hay penalización.`;
            }
            const model = currentLang === 'en' ? (q.modelEn || '') : (q.modelEs || '');
            if (model) {
                modelBox.style.display = 'block';
                modelBox.innerHTML = (currentLang === 'en'
                    ? '<strong>Model answer — study this:</strong> '
                    : '<strong>Respuesta modelo — estúdiela:</strong> ') + model;
            }
        };
        div.appendChild(checkBtn);
        div.appendChild(fb);
        div.appendChild(modelBox);
        container.appendChild(div);
        ta.addEventListener('input', e => { kwAnswers[idx] = e.target.value; saveState(); });
    });
}

// ---------- Submit ----------
function gradeMC() {
    let c = 0;
    for (let i = 0; i < 20; i++) {
        if (mcAnswers[i] === String.fromCharCode(65 + mcQuestions[i].correct)) c++;
    }
    return c;
}

// kwHit: short keywords (<=4 chars) match as whole words; longer keywords match
// as a left-boundary prefix (so intentional stems like 'prepar','resurrect' still
// catch inflections, while short keys no longer match inside longer words).
function kwHit(ans, k){
  k = (k||'').toLowerCase();
  if(!k) return false;
  var WC = '0-9a-z\\u00e1\\u00e9\\u00ed\\u00f3\\u00fa\\u00f1\\u00fc';
  var esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  var pat = (k.length <= 4)
    ? '(?:^|[^'+WC+'])'+esc+'(?![' + WC + '])'
    : '(?:^|[^'+WC+'])'+esc;
  try { return new RegExp(pat, 'i').test(ans); }
  catch(e){ return ans.indexOf(k) !== -1; }
}

function gradeSA() {
    const isEs = document.body.classList.contains('lang-es');
    let c = 0;
    for (let i = 0; i < 10; i++) {
        const ans = (kwAnswers[i] || '').toLowerCase();
        if (ans.length < 100) continue;
        const kws = isEs ? kwQuestions[i].kw_es : kwQuestions[i].kw_en;
        let hits = 0;
        kws.forEach(k => { if (kwHit(ans, k)) hits++; });
        if (hits >= 3) c++;
    }
    return c;
}

function isMastersLevel(track) {
    return track === 'mdiv' || track === 'thm';
}

function submitExam() {
    if (!checkLockouts()) return;
    if (unitPassed) return;

    const student = JSON.parse(lsGet('cts_student') || 'null');
    if (!student || !student.name) {
        alert(currentLang === 'en' ? 'Please register first.' : 'Por favor regístrese primero.');
        return;
    }
    const isEs = document.body.classList.contains('lang-es');
    const track = student.track || 'certificate';
    const result = document.getElementById('examResult');

    const mcScore = mcPreviouslyPassed ? 20 : gradeMC();
    const mcOk = mcScore >= 18;
    if (!mcPreviouslyPassed) { mcRevealed = true; renderQuestions(); }

    // ----- Certificate track: MC only; SA is ungraded practice -----
    if (!isMastersLevel(track)) {
        if (mcOk) {
            progress[`unit${UNIT}`] = true;
            lsSet(PROGRESS_KEY, JSON.stringify(progress));
            unitPassed = true;
            result.innerHTML = isEs
                ? `<span style='color:#1f6b3b'>✓ ¡APROBADO! MC ${mcScore}/20. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
                : `<span style='color:green'>✓ PASSED! MC ${mcScore}/20. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
            document.getElementById('nextUnitBtn').disabled = false;
            updateProgressGrid();
        } else {
            lsSet(FULL_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
            result.innerHTML = isEs
                ? `<span style='color:#8a1f1f'>MC ${mcScore}/20 (se necesitan 18). Repase la lección y vuelva a intentarlo en ${lockMinutes()} minuto(s).</span>`
                : `<span style='color:#8a1f1f'>MC ${mcScore}/20 (18 needed). Review the lesson and try again in ${lockMinutes()} minute(s).</span>`;
            checkLockouts();
        }
        return;
    }

    // ----- Masters track (M.Div. or Th.M.): MC + SA, both required -----
    const saScore = gradeSA();
    const saOk = saScore >= 9;

    if (mcPreviouslyPassed) {
        if (saOk) {
            progress[`unit${UNIT}`] = true;
            lsSet(PROGRESS_KEY, JSON.stringify(progress));
            unitPassed = true;
            result.innerHTML = isEs
                ? `<span style='color:#1f6b3b'>✓ ¡APROBADO! MC ✓ banco + SA ${saScore}/10. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
                : `<span style='color:green'>✓ PASSED! MC ✓ banked + SA ${saScore}/10. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
            document.getElementById('nextUnitBtn').disabled = false;
            updateProgressGrid();
        } else {
            lsSet(SA_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
            result.innerHTML = isEs
                ? `<span style='color:#8a1f1f'>Su aprobación de opción múltiple está a salvo. Respuesta corta: ${saScore}/10 (se necesitan 9). Buen esfuerzo — repase la lección y las respuestas modelo abajo, y vuelva a intentar la sección de respuesta corta en ${lockMinutes()} minuto(s).</span>`
                : `<span style='color:#8a1f1f'>Your multiple-choice pass is safe. Short answer: ${saScore}/10 (9 needed). Good effort — review the lesson and the model answers below, then try the short-answer section again in ${lockMinutes()} minute(s).</span>`;
            checkLockouts();
        }
        return;
    }

    if (mcOk && saOk) {
        progress[`unit${UNIT}`] = true;
        lsSet(PROGRESS_KEY, JSON.stringify(progress));
        lsSet(MC_PASS_KEY, 'true');
        mcPreviouslyPassed = true;
        unitPassed = true;
        result.innerHTML = isEs
            ? `<span style='color:#1f6b3b'>✓ ¡APROBADO! MC ${mcScore}/20 + SA ${saScore}/10. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
            : `<span style='color:green'>✓ PASSED! MC ${mcScore}/20 + SA ${saScore}/10. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
        document.getElementById('nextUnitBtn').disabled = false;
        updateProgressGrid();
    } else if (mcOk && !saOk) {
        lsSet(MC_PASS_KEY, 'true');
        mcPreviouslyPassed = true;
        lsSet(SA_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>MC ${mcScore}/20 ✓ aprobado y guardado. SA ${saScore}/10 (se requiere 9). Sección SA bloqueada ${lockMinutes()} min. Al desbloquear, reenvíe solo la SA — el MC permanece aprobado.</span>`
            : `<span style='color:#8a1f1f'>MC ${mcScore}/20 ✓ passed and banked. SA ${saScore}/10 (need 9). SA section locked ${lockMinutes()} min. When unlocked, resubmit SA only — MC stays passed.</span>`;
        checkLockouts();
    } else {
        lsSet(FULL_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>✗ Reprobado: MC ${mcScore}/20 + SA ${saScore}/10 (se requiere 18 y 9). Unidad bloqueada ${lockMinutes()} minutos.</span>`
            : `<span style='color:#8a1f1f'>✗ Failed: MC ${mcScore}/20 + SA ${saScore}/10 (need 18 and 9). Unit locked ${lockMinutes()} minutes.</span>`;
        checkLockouts();
    }
}

// ---------- Reset ----------
function resetUnit() {
    const isEs = document.body.classList.contains('lang-es');
    const msg = isEs
        ? '¿Reiniciar esta unidad?\n\nEsto borrará: respuestas en progreso, estado MC aprobado, todos los bloqueos, y el indicador de aprobación de esta unidad.\n\nEl contenido docente permanece. Esta acción no se puede deshacer.'
        : 'Reset this unit?\n\nThis will clear: in-progress answers, MC-passed state, all lockouts, and this unit\'s pass flag.\n\nTeaching content stays. This cannot be undone.';
    if (!confirm(msg)) return;
    lsDel(STATE_KEY);
    lsDel(MC_PASS_KEY);
    lsDel(SA_LOCK_KEY);
    lsDel(FULL_LOCK_KEY);
    delete progress[`unit${UNIT}`];
    lsSet(PROGRESS_KEY, JSON.stringify(progress));
    mcAnswers = new Array(20).fill(null);
    kwAnswers = new Array(10).fill("");
    mcPreviouslyPassed = false;
    unitPassed = false;
    mcRevealed = false;
    renderQuestions();
    try { location.reload(); } catch (e) { /* preview may block reload; screen already reset */ }
}

// ---------- Wire & init ----------
document.getElementById('submitExamBtn').onclick = submitExam;
document.getElementById('resetExamBtn').onclick = resetUnit;
renderQuestions();
checkLockouts();
