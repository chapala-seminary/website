/* Exam engine for CTSNT (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/nt/unitN.js. */
const totalUnits = 12; /* 2026-05-23: was 11; corrected to 12 */
let currentUnit = 1;
let progress = JSON.parse(localStorage.getItem('cts_nt_progress')) || {};

function updateProgressGrid() {
    const grid = document.getElementById('progressGrid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 1; i <= totalUnits; i++) {
        let cls = '';
        if (progress[`unit${i}`]) cls = 'completed';
        if (i === currentUnit) cls += ' active';
        grid.innerHTML += `<a href="CTSNTUnit${i}.html" class="${cls}">${i}</a>`;
    }
}
if (PREV_HREF) document.getElementById('prevUnitBtn').onclick = () => { location.href = PREV_HREF; }; else document.getElementById('prevUnitBtn').disabled = true; if (NEXT_HREF) document.getElementById('nextUnitBtn').onclick = () => { location.href = NEXT_HREF; };
document.getElementById('nextUnitBtn').disabled = false;
updateProgressGrid();

function displayStudentGreeting() {
    const student = JSON.parse(localStorage.getItem('cts_student'));
    if (student && student.name) {
        document.getElementById('studentGreeting').innerHTML = `👋 ${student.name}`;
    } else {
        document.getElementById('studentGreeting').innerHTML = `<a href="#" onclick="promptName(); return false;" style="color:#5b3a1f;">⚠️ Please register first</a>`;
    }
}
function promptName() {
    const name = prompt("Welcome to CTS New Testament Survey! Please enter your full name as you'd like it to appear on your certificate:");
    if (name && name.trim().length > 1) {
        localStorage.setItem('cts_student', JSON.stringify({name: name.trim()}));
        displayStudentGreeting();
    }
}
displayStudentGreeting();

// MC answer key audit-targeted distribution: 5A / 5B / 5C / 5D
// Index 0..19 maps to: C,A,D,B,A,D,C,B,A,D,B,C,A,B,D,C,B,A,D,C




let currentLang = 'en';
let mcAnswers = new Array(20).fill(null);
let kwAnswers = new Array(10).fill("");
let mcRevealed = false;
// A passing MC score is banked independently of SA, so a Masters student who
// passes MC but not SA never has to redo MC — only SA is locked/retried.
const MC_PASS_KEY = `cts_nt_u${UNIT}_mc_passed`;
const SA_LOCK_KEY = `cts_nt_u${UNIT}_sa_lockout`;
let mcPreviouslyPassed = localStorage.getItem(MC_PASS_KEY) === 'true';
function activeLockUntil() {
    return mcPreviouslyPassed
        ? parseInt(localStorage.getItem(SA_LOCK_KEY) || '0')
        : parseInt(localStorage.getItem(`cts_nt_u${UNIT}_lockout`) || '0');
}
let lockUntil = activeLockUntil();
let unitPassed = progress[`unit${UNIT}`] || false;

// ===== PER-UNIT CONFIG =====

const TOTAL_UNITS = 12; /* 2026-05-23: was 11; corrected to 12 */

const PASS_THRESHOLD = 0.90;

let currentTrack = localStorage.getItem('cts_track') || 'cert';

function isMastersLevel() { return currentTrack === 'mdiv' || currentTrack === 'thm'; }
function lockMinutes() { return isMastersLevel() ? 15 : 2; }

function normalize(s) { return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
function isEs() { return document.body.classList.contains('lang-es'); }

// kwHit: short keywords (<=4 chars) match as whole words; longer as left-boundary prefix.
// Pass standard is >=3 hits (NOT all keywords).
function kwHit(normAns, kw) {
    kw = normalize(kw);
    if (!kw) return false;
    var WC = '0-9a-z\\u00e0-\\u00ff';
    var esc = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var pat = (kw.length <= 4)
        ? '(?:^|[^' + WC + '])' + esc + '(?![' + WC + '])'
        : '(?:^|[^' + WC + '])' + esc;
    try { return new RegExp(pat, 'i').test(normAns); }
    catch (e) { return normAns.indexOf(kw) !== -1; }
}
function kwHitCount(normAns, keys) { return keys.filter(function(k){ return kwHit(normAns, k); }).length; }

function checkAllUnitsPassed() {
    for (let i = 1; i <= TOTAL_UNITS; i++) { if (!progress[`unit${i}`]) return false; }
    return true;
}

function syncTrackUI() {
    document.querySelectorAll('input[name="ctsTrack"]').forEach(r => { r.checked = (r.value === currentTrack); });
}

function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    if (!container) return;
    container.innerHTML = '';
    const mcTitle = document.createElement('h3');
    mcTitle.innerHTML = isEs() ? 'Opción Múltiple (Preguntas 1–20)' : 'Multiple Choice (Questions 1–20)';
    container.appendChild(mcTitle);
    const mcReveal = mcRevealed || unitPassed || (typeof mcPassed !== 'undefined' && mcPassed) || (typeof mcPreviouslyPassed !== 'undefined' && mcPreviouslyPassed);
    const mcFrozen = unitPassed || (typeof mcPassed !== 'undefined' && mcPassed) || (typeof mcPreviouslyPassed !== 'undefined' && mcPreviouslyPassed);
    mcQuestions.forEach((q, idx) => {
        const div = document.createElement('div');
        div.className = 'question';
        const qText = document.createElement('p');
        qText.style.fontWeight = 'bold';
        qText.innerHTML = (!isEs()) ? q.textEn : q.textEs;
        div.appendChild(qText);
        const options = (!isEs()) ? q.optionsEn : q.optionsEs;
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
            if (!mcFrozen && !answered) {
                btn.onclick = function() {
                    
                    mcAnswers[idx] = letter;
                    renderQuestions();
                };
            }
            div.appendChild(btn);
        });
        if (mcReveal || answered) {
            const fb = document.createElement('div');
            const exp = (!isEs()) ? (q.explanationEn || '') : (q.explanationEs || '');
            if (mcAnswers[idx] === correctLetter) {
                fb.className = 'feedback-text correct';
                fb.innerHTML = ((!isEs()) ? '✓ Correct! ' : '✓ ¡Correcto! ') + exp;
            } else if (mcAnswers[idx]) {
                fb.className = 'feedback-text incorrect';
                fb.innerHTML = ((!isEs()) ? `✗ Incorrect. Correct answer: ${correctLetter}. ` : `✗ Incorrecto. Respuesta correcta: ${correctLetter}. `) + exp;
            } else {
                fb.className = 'feedback-text incorrect';
                fb.innerHTML = ((!isEs()) ? `Not answered. Correct answer: ${correctLetter}. ` : `Sin responder. Respuesta correcta: ${correctLetter}. `) + exp;
            }
            div.appendChild(fb);
        }
        container.appendChild(div);
    });
    const kwTitle = document.createElement('h3');
    kwTitle.style.marginTop = '30px';
    kwTitle.innerHTML = isEs() ? 'Respuesta Corta (Preguntas 21–30) — Pista Maestría en Divinidad' : 'Short Answer (Questions 21–30) — Master of Divinity Track';
    container.appendChild(kwTitle);
    kwQuestions.forEach((q, idx) => {
        const div = document.createElement('div');
        div.className = 'question';
        const qText = document.createElement('p');
        qText.style.fontWeight = 'bold';
        qText.innerHTML = isEs() ? q.textEs : q.textEn;
        div.appendChild(qText);
        const ta = document.createElement('textarea');
        ta.className = 'kw-answer';
        ta.rows = 3;
        ta.placeholder = isEs() ? 'Escriba su respuesta aquí...' : 'Type your answer here...';
        ta.value = kwAnswers[idx];
        div.appendChild(ta);
        const checkBtn = document.createElement('button');
        checkBtn.className = 'small';
        checkBtn.textContent = isEs() ? 'Verificar Respuesta' : 'Check Answer';
        const fb = document.createElement('div');
        fb.className = 'feedback-text';
        fb.style.marginTop = '8px';
        const model = document.createElement('div');
        model.className = 'model-answer';
        model.style.display = 'none';
        checkBtn.onclick = function() {
            const ansRaw = ta.value.trim();
            const ans = normalize(ansRaw);
            const keys = isEs() ? q.kw_es : q.kw_en;
            const hits = kwHitCount(ans, keys);
            if (ansRaw.length < 100) {
                fb.innerHTML = isEs() ? 'Escriba una respuesta más completa (al menos una oración).' : 'Please write a more complete answer (at least a sentence).';
                fb.className = 'feedback-text incorrect';
            } else if (hits >= 3) {
                fb.innerHTML = isEs() ? `✓ ¡Bien! Su respuesta toca ${hits} conceptos clave.` : `✓ Good! Your answer touches ${hits} key concepts.`;
                fb.className = 'feedback-text correct';
                kwAnswers[idx] = ansRaw;
            } else {
                fb.innerHTML = isEs() ? `Va bien — toca ${hits}. Apunte a al menos 3 conceptos clave; revise la lección y vuelva a intentarlo.` : `Good start — you touched ${hits}. Aim for at least 3 key concepts; review the lesson and try again.`;
                fb.className = 'feedback-text incorrect';
            }
            const mk = isEs() ? q.modelEs : q.modelEn;
            if (mk) {
                model.innerHTML = (isEs() ? '<strong>Respuesta modelo — estúdiela:</strong> ' : '<strong>Model answer — study this:</strong> ') + mk;
                model.style.display = 'block';
            }
        };
        div.appendChild(checkBtn);
        div.appendChild(fb);
        div.appendChild(model);
        container.appendChild(div);
        ta.addEventListener('input', e => kwAnswers[idx] = e.target.value);
    });
}

function triggerRedirect() {
    const target = checkAllUnitsPassed() ? 'CTSNTCertificate.html' : NEXT_URL;
    const result = document.getElementById('examResult');
    let seconds = 3;
    function tick() {
        const msg = isEs()
            ? `Redirigiendo a la siguiente unidad en ${seconds}...`
            : `Redirecting to the next unit in ${seconds}...`;
        result.innerHTML = `<div class='redirect-notice'>✅ ${isEs() ? '¡APROBADO!' : 'PASSED!'} ${msg}</div>`;
        if (seconds <= 0) { location.href = target; return; }
        seconds--;
        setTimeout(tick, 1000);
    }
    tick();
}

function submitExam() {
    const result = document.getElementById('examResult');
    if (unitPassed) {
        result.innerHTML = `<span style='color:green'>${isEs() ? '✅ Unidad ya aprobada.' : '✅ Unit already passed!'}</span>`;
        return;
    }
    lockUntil = activeLockUntil();
    if (Date.now() < lockUntil) {
        const wait = Math.ceil((lockUntil - Date.now())/60000);
        result.innerHTML = `<span style='color:red'>${isEs() ? `⏰ Bloqueado por ${wait} minutos más.` : `⏰ Locked for ${wait} more minutes.`}</span>`;
        return;
    }
    const student = JSON.parse(localStorage.getItem('cts_student') || 'null');
    if (!student || !student.name) { promptName(); return; }

    let correctMC = 0;
    mcRevealed = true; renderQuestions();
    for (let i = 0; i < 20; i++) if (mcAnswers[i] === String.fromCharCode(65 + mcQuestions[i].correct)) correctMC++;
    let advCorrect = 0;
    for (let i = 0; i < 10; i++) {
        const ans = normalize(kwAnswers[i] || '');
        const keys = isEs() ? kwQuestions[i].kw_es : kwQuestions[i].kw_en;
        if (kwHitCount(ans, keys) >= 3 && ans.length >= 100) advCorrect++;
    }

    const mcPct = correctMC / 20;
    const saPct = advCorrect / 10;
    const mcPass = mcPct >= PASS_THRESHOLD;
    const saPass = saPct >= PASS_THRESHOLD;

    function passUnit() {
        unitPassed = true;
        progress[`unit${UNIT}`] = true;
        localStorage.setItem('cts_nt_progress', JSON.stringify(progress));
        localStorage.setItem('nt_unit1_passed', 'true');
        localStorage.removeItem(`cts_nt_u${UNIT}_lockout`);
        localStorage.removeItem(SA_LOCK_KEY);
        updateProgressGrid();
        triggerRedirect();
    }

    if (!isMastersLevel()) {
        if (mcPass) {
            passUnit();
        } else {
            const mins = lockMinutes();
            lockUntil = Date.now() + mins*60*1000;
            localStorage.setItem(`cts_nt_u${UNIT}_lockout`, String(lockUntil));
            const breakdown = isEs()
                ? `MC: ${correctMC}/20 (${Math.round(mcPct*100)}%). Necesita 18/20 para Certificado.`
                : `MC: ${correctMC}/20 (${Math.round(mcPct*100)}%). Need 18/20 for Certificate.`;
            result.innerHTML = `<span style='color:red'>${isEs() ? '❌ NO APROBADO.' : '❌ FAILED.'} ${breakdown} ${isEs() ? `Puede reintentar en ${mins} min.` : `You can retry in ${mins} min.`}</span>`;
        }
        return;
    }

    if (mcPreviouslyPassed) {
        if (saPass) {
            passUnit();
        } else {
            const mins = lockMinutes();
            lockUntil = Date.now() + mins*60*1000;
            localStorage.setItem(SA_LOCK_KEY, String(lockUntil));
            const breakdown = isEs()
                ? `MC: ✓ ya guardado — RC: ${advCorrect}/10 (${Math.round(saPct*100)}%). Necesita 9/10.`
                : `MC: ✓ already banked — SA: ${advCorrect}/10 (${Math.round(saPct*100)}%). Need 9/10.`;
            result.innerHTML = `<span style='color:red'>${isEs() ? '❌ NO APROBADO.' : '❌ FAILED.'} ${breakdown} ${isEs() ? `Su opción múltiple está a salvo. Puede reintentar la sección de respuesta corta en ${mins} min.` : `Your multiple-choice pass is safe. You can retry the short-answer section in ${mins} min.`}</span>`;
        }
        return;
    }

    if (mcPass && saPass) {
        localStorage.setItem(MC_PASS_KEY, 'true');
        mcPreviouslyPassed = true;
        passUnit();
    } else if (mcPass && !saPass) {
        localStorage.setItem(MC_PASS_KEY, 'true');
        mcPreviouslyPassed = true;
        const mins = lockMinutes();
        lockUntil = Date.now() + mins*60*1000;
        localStorage.setItem(SA_LOCK_KEY, String(lockUntil));
        const breakdown = isEs()
            ? `MC: ${correctMC}/20 (${Math.round(mcPct*100)}%) ✓ aprobado y guardado — RC: ${advCorrect}/10 (${Math.round(saPct*100)}%). Necesita 9/10.`
            : `MC: ${correctMC}/20 (${Math.round(mcPct*100)}%) ✓ passed and banked — SA: ${advCorrect}/10 (${Math.round(saPct*100)}%). Need 9/10.`;
        result.innerHTML = `<span style='color:red'>${isEs() ? '❌ NO APROBADO.' : '❌ FAILED.'} ${breakdown} ${isEs() ? `Al reintentar en ${mins} min, solo necesitará la sección de respuesta corta — el OM permanece aprobado.` : `When you retry in ${mins} min, you'll only need the short-answer section — MC stays passed.`}</span>`;
    } else {
        const mins = lockMinutes();
        lockUntil = Date.now() + mins*60*1000;
        localStorage.setItem(`cts_nt_u${UNIT}_lockout`, String(lockUntil));
        const breakdown = isEs()
            ? `MC: ${correctMC}/20 (${Math.round(mcPct*100)}%) — RC: ${advCorrect}/10 (${Math.round(saPct*100)}%). Necesita 18/20 Y 9/10 para M.Div.`
            : `MC: ${correctMC}/20 (${Math.round(mcPct*100)}%) — SA: ${advCorrect}/10 (${Math.round(saPct*100)}%). Need 18/20 AND 9/10 for M.Div.`;
        result.innerHTML = `<span style='color:red'>${isEs() ? '❌ NO APROBADO.' : '❌ FAILED.'} ${breakdown} ${isEs() ? `Puede reintentar en ${mins} min.` : `You can retry in ${mins} min.`}</span>`;
    }
}

function resetExam() {
    const msg = isEs()
        ? '¿Restablecer el examen? Esto borrará sus respuestas en pantalla y eliminará el bloqueo de 15 minutos. Las unidades ya aprobadas no se afectan.'
        : 'Reset the exam? This will clear your on-screen answers and remove the 15-minute lockout. Already-passed units are not affected.';
    if (!confirm(msg)) return;
    mcAnswers = new Array(20).fill(null);
    kwAnswers = new Array(10).fill('');
    lockUntil = 0;
    mcPreviouslyPassed = false;
    localStorage.removeItem(`cts_nt_u${UNIT}_lockout`);
    localStorage.removeItem(MC_PASS_KEY);
    localStorage.removeItem(SA_LOCK_KEY);
    document.getElementById('examResult').innerHTML = '';
    renderQuestions();
}

document.getElementById('submitExamBtn').addEventListener('click', submitExam);
document.getElementById('resetExamBtn').addEventListener('click', resetExam);
document.querySelectorAll('input[name="ctsTrack"]').forEach(r => {
    r.addEventListener('change', e => {
        currentTrack = e.target.value;
        localStorage.setItem('cts_track', currentTrack);
    });
});
document.getElementById('langToggleBtn').onclick = function() {
    if (document.body.classList.contains('lang-en')) {
        document.body.className = 'lang-es';
        this.textContent = 'English';
    } else {
        document.body.className = 'lang-en';
        this.textContent = 'Español';
    }
    renderQuestions();
};

syncTrackUI();
renderQuestions();
if (unitPassed) document.getElementById('examResult').innerHTML = `<span style='color:green'>${isEs() ? `✅ Unidad ${UNIT} ya aprobada.` : `✅ Unit ${UNIT} already passed.`}</span>`;
