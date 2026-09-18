/* Exam engine for CTSPM (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/pm/unitN.js. */
const totalUnits = 12;

let progress = JSON.parse(localStorage.getItem('cts_pm_progress')) || {};

function updateProgressGrid() {
    const grid = document.getElementById('progressGrid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 1; i <= totalUnits; i++) {
        let cls = '';
        if (progress[`unit${i}`]) cls = 'completed';
        if (i === currentUnit) cls += ' active';
        grid.innerHTML += `<a href="CTSPMUnit${i}.html" class="${cls}">${i}</a>`;
    }
}
if (PREV_HREF) document.getElementById('prevUnitBtn').onclick = () => { location.href = PREV_HREF; }; else document.getElementById('prevUnitBtn').disabled = true;
if (NEXT_HREF) document.getElementById('nextUnitBtn').onclick = () => { location.href = NEXT_HREF; };
updateProgressGrid();

// cts_track gating: 'certificate' grades MC only (1-20); 'mdiv' grades all 30
const ctsTrack = localStorage.getItem('cts_track') || 'cert';
function displayTrackBanner() {
    const banner = document.getElementById('trackBanner');
    if (ctsTrack === 'mdiv') {
        banner.innerHTML = `<span class="lang-en">🎓 <strong>M.Div. Track:</strong> You must answer all 30 questions. Threshold: 90%.</span><span class="lang-es">🎓 <strong>M.Div. / Th.M.:</strong> Debe responder las 30 preguntas. Umbral: 90%.</span>`;
    } else {
        banner.innerHTML = `<span class="lang-en">📜 <strong>Certificate Track:</strong> Answer questions 1–20. Threshold: 90% (18 of 20 correct).</span><span class="lang-es">📜 <strong>Certificado:</strong> Responda las preguntas 1–20. Umbral: 90% (18 de 20 correctas).</span>`;
    }
    banner.style.display = 'block';
}
displayTrackBanner();

function displayStudentGreeting() {
    const student = JSON.parse(localStorage.getItem('cts_student'));
    if (student && student.name) {
        document.getElementById('studentGreeting').innerHTML = `👋 ${student.name}`;
    } else {
        document.getElementById('studentGreeting').innerHTML = `<a href="CTSPMUnit1.html" style="color:#5b3a1f;">⚠️ Please register first</a>`;
        document.getElementById('regWarning').style.display = 'block';
    }
}
displayStudentGreeting();





let currentLang = 'en';
let mcAnswers = new Array(20).fill(null);
let kwAnswers = new Array(10).fill("");
let mcRevealed = false;
let lockUntil = 0;
let unitPassed = progress[`unit${UNIT}`] || false;
// A passing MC score is banked independently of SA, so a Masters student who
// passes MC but not SA never has to redo MC — only SA is locked/retried.
const MC_PASS_KEY = `cts_pm_u${UNIT}_mc_passed`;
const SA_LOCK_KEY = `cts_pm_u${UNIT}_sa_lockout`;
let mcPreviouslyPassed = localStorage.getItem(MC_PASS_KEY) === 'true';
function activeLockUntil() {
    return mcPreviouslyPassed
        ? (parseInt(localStorage.getItem(SA_LOCK_KEY) || '0', 10) || 0)
        : (parseInt(localStorage.getItem(`cts_pm_u${UNIT}_lockout`) || '0', 10) || 0);
}
lockUntil = activeLockUntil();

// Recovers the correct option index for an MC question. Answers are stored
// encoded (field 'c') so the key is not plainly readable in the page source;
// it is decoded only when a student selects a choice or submits the exam.
function answerIndex(qpos) { return ((mcQuestions[qpos].c - 7*(qpos+3)) % 251 + 251) % 251; }
function normalize(s) { return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
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
function isMastersLevel(track) { return track === 'mdiv' || track === 'thm'; }
function lockMinutes(track) { return isMastersLevel(track) ? 15 : 2; }

function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    if (!container) return;
    container.innerHTML = '';
    const mcTitle = document.createElement('h3');
    mcTitle.innerHTML = currentLang === 'en' ? 'Multiple Choice (Questions 1–20)' : 'Opción Múltiple (Preguntas 1–20)';
    container.appendChild(mcTitle);
    const mcReveal = mcRevealed || unitPassed || (typeof mcPassed !== 'undefined' && mcPassed) || (typeof mcPreviouslyPassed !== 'undefined' && mcPreviouslyPassed);
    const mcFrozen = unitPassed || (typeof mcPassed !== 'undefined' && mcPassed) || (typeof mcPreviouslyPassed !== 'undefined' && mcPreviouslyPassed);
    mcQuestions.forEach((q, idx) => {
        const div = document.createElement('div');
        div.className = 'question';
        const qText = document.createElement('p');
        qText.style.fontWeight = 'bold';
        qText.innerHTML = (currentLang === 'en') ? q.textEn : q.textEs;
        div.appendChild(qText);
        const options = (currentLang === 'en') ? q.optionsEn : q.optionsEs;
        const correctLetter = String.fromCharCode(65 + answerIndex(idx));
        const answered = !!mcAnswers[idx];
        options.forEach((opt, optIdx) => {
            const letter = String.fromCharCode(65 + optIdx);
            const btn = document.createElement('button');
            btn.className = 'option';
            btn.textContent = `${letter}. ${opt}`;
            if (mcReveal || answered) {
                if (optIdx === answerIndex(idx)) btn.classList.add('correct');
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
            const exp = (currentLang === 'en') ? (q.explEn || '') : (q.explEs || '');
            if (mcAnswers[idx] === correctLetter) {
                fb.className = 'feedback-text correct';
                fb.innerHTML = ((currentLang === 'en') ? '✓ Correct! ' : '✓ ¡Correcto! ') + exp;
            } else if (mcAnswers[idx]) {
                fb.className = 'feedback-text incorrect';
                fb.innerHTML = ((currentLang === 'en') ? `✗ Incorrect. Correct answer: ${correctLetter}. ` : `✗ Incorrecto. Respuesta correcta: ${correctLetter}. `) + exp;
            } else {
                fb.className = 'feedback-text incorrect';
                fb.innerHTML = ((currentLang === 'en') ? `Not answered. Correct answer: ${correctLetter}. ` : `Sin responder. Respuesta correcta: ${correctLetter}. `) + exp;
            }
            div.appendChild(fb);
        }
        container.appendChild(div);
    });
    const student = JSON.parse(localStorage.getItem('cts_student') || '{}');
    const masters = student && isMastersLevel(student.track);
    {
    const kwTitle = document.createElement('h3');
    kwTitle.style.marginTop = '30px';
    kwTitle.innerHTML = currentLang === 'en' ? 'Short Answer (21–30)' : 'Respuesta Corta (21–30)';
    container.appendChild(kwTitle);
    const kwNote = document.createElement('p');
    kwNote.style.marginBottom = '12px';
    kwNote.style.fontStyle = 'italic';
    if (masters) {
        kwNote.innerHTML = currentLang === 'en'
            ? 'M.Div./Th.M. track: these are graded as part of your exam (9 of 10 required).'
            : 'Vía M.Div./Th.M.: estas se califican como parte de su examen (se requieren 9 de 10).';
    } else {
        kwNote.innerHTML = currentLang === 'en'
            ? 'Optional practice for Certificate students — answer freely and study the model answers. These do not affect your pass or fail.'
            : 'Práctica opcional para estudiantes de Certificado — responda libremente y estudie las respuestas modelo. Estas no afectan si aprueba o no.';
    }
    container.appendChild(kwNote);
    if (ctsTrack === 'certificate') {
        const skipNote = document.createElement('p');
        skipNote.style.fontStyle = 'italic';
        skipNote.style.color = '#5b3a1f';
        skipNote.innerHTML = currentLang === 'en' ? 'Certificate students may skip questions 21–30. They are not required for your track.' : 'Estudiantes de certificado pueden omitir las preguntas 21–30. No son requeridas para su programa.';
        container.appendChild(skipNote);
    }
    kwQuestions.forEach((q, idx) => {
        const div = document.createElement('div');
        div.className = 'question';
        const qText = document.createElement('p');
        qText.style.fontWeight = 'bold';
        qText.innerHTML = currentLang === 'en' ? q.textEn : q.textEs;
        div.appendChild(qText);
        const textarea = document.createElement('textarea');
        textarea.className = 'kw-answer';
        textarea.rows = 3;
        textarea.placeholder = currentLang === 'en' ? 'Type your answer here...' : 'Escriba su respuesta aquí...';
        textarea.value = kwAnswers[idx];
        div.appendChild(textarea);
        const checkBtn = document.createElement('button');
        checkBtn.className = 'small';
        checkBtn.textContent = currentLang === 'en' ? 'Check Answer' : 'Verificar Respuesta';
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'feedback-text';
        feedbackDiv.style.marginTop = '8px';
        checkBtn.onclick = function() {
            const answer = textarea.value.trim().toLowerCase();
            const bodyCls = document.body.classList;
            const isEs = bodyCls.contains('lang-es');
            const isBoth = bodyCls.contains('lang-both');
            const enHits = q.kw_en.filter(kw => kwHit(normalize(answer), kw)).length;
            const esHits = q.kw_es.filter(kw => kwHit(normalize(answer), kw)).length;
            const hits = isBoth ? Math.max(enHits, esHits) : (isEs ? esHits : enHits);
            const activeKws = isBoth ? (esHits > enHits ? q.kw_es : q.kw_en) : (isEs ? q.kw_es : q.kw_en);
            const missing = activeKws.filter(kw => !kwHit(normalize(answer), kw));
            if (answer.length < 100) {
                feedbackDiv.innerHTML = currentLang === 'en' ? 'Please write a more complete answer (at least a sentence).' : 'Escriba una respuesta más completa (al menos una oración).';
                feedbackDiv.className = 'feedback-text incorrect';
            } else if (hits >= 3) {
                feedbackDiv.innerHTML = currentLang === 'en' ? '✓ Correct! Your answer includes the key concepts.' : '✓ ¡Correcto! Su respuesta incluye los conceptos clave.';
                feedbackDiv.className = 'feedback-text correct';
                kwAnswers[idx] = answer;
            } else {
                feedbackDiv.innerHTML = currentLang === 'en' ? `✗ Needs at least 3 key concepts. Try including: ${missing.slice(0,3).join(', ')}.` : `✗ Necesita al menos 3 conceptos clave. Intente incluir: ${missing.slice(0,3).join(', ')}.`;
                feedbackDiv.className = 'feedback-text incorrect';
            }
        };
        div.appendChild(checkBtn);
        div.appendChild(feedbackDiv);
        container.appendChild(div);
        textarea.addEventListener('input', (e) => { kwAnswers[idx] = e.target.value; });
    });
    }
}

function submitExam() {
    if (unitPassed) {
        document.getElementById('examResult').innerHTML = currentLang === 'en' ? "<span style='color:green'>✅ Unit already passed!</span>" : "<span style='color:green'>✅ ¡Unidad ya aprobada!</span>";
        document.getElementById('nextUnitBtn').disabled = false;
        return;
    }
    lockUntil = activeLockUntil();
    if (Date.now() < lockUntil) {
        let wait = Math.ceil((lockUntil - Date.now()) / 60000);
        document.getElementById('examResult').innerHTML = currentLang === 'en' ? `<span style='color:red'>⏰ Locked for ${wait} more minutes.</span>` : `<span style='color:red'>⏰ Bloqueado por ${wait} minutos más.</span>`;
        return;
    }
    const student = JSON.parse(localStorage.getItem('cts_student'));
    if (!student || !student.name) {
        alert(currentLang === 'en' ? "Please register first on Unit 1." : "Por favor regístrese primero en la Unidad 1.");
        return;
    }
    let correctMC = 0;
    mcRevealed = true; renderQuestions();
    for (let i = 0; i < 20; i++) if (mcAnswers[i] === String.fromCharCode(65 + answerIndex(i))) correctMC++;

    let total, mcGatePass, saGatePass, advCorrect = 0;
    const isMasters = !(ctsTrack === 'certificate' || ctsTrack === 'cert');
    if (!isMasters) {
        // Certificate: MC only, 90% threshold (18 of 20)
        mcGatePass = correctMC >= 18; saGatePass = true;
        total = correctMC / 20;
    } else {
        // M.Div./Th.M.: independent gates — 18/20 MC AND 9/10 SA
        const bodyClsSA = document.body.classList;
        const isEsSA = bodyClsSA.contains('lang-es');
        const isBothSA = bodyClsSA.contains('lang-both');
        for (let i = 0; i < 10; i++) {
            let ans = kwAnswers[i].toLowerCase();
            if (ans.length < 100) continue;
            const enHits = kwQuestions[i].kw_en.filter(kw => kwHit(normalize(ans), kw)).length;
            const esHits = kwQuestions[i].kw_es.filter(kw => kwHit(normalize(ans), kw)).length;
            const hits = isBothSA ? Math.max(enHits, esHits) : (isEsSA ? esHits : enHits);
            if (hits >= 3) advCorrect++;
        }
        mcGatePass = correctMC >= 18; saGatePass = advCorrect >= 9;
        total = (correctMC / 20) * 0.5 + (advCorrect / 10) * 0.5;

        if (mcPreviouslyPassed) {
            if (saGatePass) {
                unitPassed = true;
                progress[`unit${UNIT}`] = true;
                localStorage.setItem('cts_pm_progress', JSON.stringify(progress));
                localStorage.setItem('pm_unit9_passed', 'true');
                localStorage.removeItem(`cts_pm_u${UNIT}_lockout`);
                localStorage.removeItem(SA_LOCK_KEY);
                document.getElementById('examResult').innerHTML = currentLang === 'en' ? `<span style='color:green'>✅ PASSED. MC: ✓ already banked · SA: ${advCorrect}/10. Unit 9 completed! Your answers are marked below. Review them, then use the button at the top to continue.</span>` : `<span style='color:green'>✅ APROBADO. OM: ✓ ya guardado · RC: ${advCorrect}/10. ¡Unidad 9 completada!</span>`;
                document.getElementById('nextUnitBtn').disabled = false;
                updateProgressGrid();
            } else {
                lockUntil = Date.now() + 15 * 60 * 1000;
                localStorage.setItem(SA_LOCK_KEY, String(lockUntil));
                document.getElementById('examResult').innerHTML = currentLang === 'en' ? `<span style='color:red'>❌ MC: ✓ already banked · SA: ${advCorrect}/10 (need 9). Your multiple-choice pass is safe. Short-answer section locked for 15 minutes.</span>` : `<span style='color:red'>❌ OM: ✓ ya guardado · RC: ${advCorrect}/10 (necesita 9). Bloqueado 15 minutos.</span>`;
                startTimer();
            }
            return;
        }
    }

    if (mcGatePass && saGatePass) {
        unitPassed = true;
        progress[`unit${UNIT}`] = true;
        localStorage.setItem('cts_pm_progress', JSON.stringify(progress));
        localStorage.setItem('pm_unit9_passed', 'true');
        localStorage.removeItem(`cts_pm_u${UNIT}_lockout`);
        localStorage.removeItem(SA_LOCK_KEY);
        document.getElementById('examResult').innerHTML = currentLang === 'en' ? `<span style='color:green'>✅ PASSED (${Math.round(total * 100)}%). Unit 9 completed! Your answers are marked below. Review them, then use the button at the top to continue.</span>` : `<span style='color:green'>✅ APROBADO (${Math.round(total * 100)}%). ¡Unidad 9 completada! Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`;
        document.getElementById('nextUnitBtn').disabled = false;
        updateProgressGrid();
    } else if (isMasters && mcGatePass && !saGatePass) {
        localStorage.setItem(MC_PASS_KEY, 'true');
        mcPreviouslyPassed = true;
        lockUntil = Date.now() + 15 * 60 * 1000;
        localStorage.setItem(SA_LOCK_KEY, String(lockUntil));
        document.getElementById('examResult').innerHTML = currentLang === 'en' ? `<span style='color:red'>❌ MC: ${correctMC}/20 ✓ passed and banked. SA ${advCorrect}/10 (need 9). When you retry in 15 minutes, you'll only need the short-answer section — MC stays passed.</span>` : `<span style='color:red'>❌ OM: ${correctMC}/20 ✓ aprobado y guardado. RC ${advCorrect}/10 (necesita 9). Al reintentar en 15 minutos, solo necesitará la sección de respuesta corta.</span>`;
        startTimer();
    } else {
        lockUntil = Date.now() + 15 * 60 * 1000;
        localStorage.setItem(`cts_pm_u${UNIT}_lockout`, String(lockUntil));
        document.getElementById('examResult').innerHTML = currentLang === 'en' ? `<span style='color:red'>❌ FAILED (${Math.round(total * 100)}% &lt; 90%). Locked for 15 minutes.</span>` : `<span style='color:red'>❌ REPROBADO (${Math.round(total * 100)}% &lt; 90%). Bloqueado por 15 minutos.</span>`;
        startTimer();
    }
}

function resetExam() {
    if (!confirm(currentLang === 'en' ? 'Clear all answers and start over?' : '¿Borrar todas las respuestas y empezar de nuevo?')) return;
    mcAnswers = new Array(20).fill(null);
    kwAnswers = new Array(10).fill("");
    document.getElementById('examResult').innerHTML = '';
    renderQuestions();
}

function startTimer() {
    let existing = document.getElementById('unitTimer');
    if (existing) existing.remove();
    let timerEl = document.createElement('div');
    timerEl.id = 'unitTimer';
    timerEl.style.marginTop = '10px';
    document.getElementById('examResult').after(timerEl);
    let interval = setInterval(() => {
        let remaining = lockUntil - Date.now();
        if (remaining <= 0 || unitPassed) { clearInterval(interval); if (document.getElementById('unitTimer')) document.getElementById('unitTimer').remove(); return; }
        let mins = Math.floor(remaining / 60000);
        let secs = Math.floor((remaining % 60000) / 1000);
        let timerDiv = document.getElementById('unitTimer');
        if (timerDiv) timerDiv.innerText = `⏱️ Locked: ${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

document.getElementById('submitExamBtn').addEventListener('click', submitExam);
document.getElementById('resetExamBtn').addEventListener('click', resetExam);
document.querySelectorAll('.lang-toggle-group .toggle-btn').forEach(btn => {
    btn.onclick = function() {
        const lang = this.getAttribute('data-lang');
        document.body.classList.remove('lang-en','lang-es','lang-both');
        document.body.classList.add('lang-' + lang);
        currentLang = (lang === 'es') ? 'es' : 'en';
        renderQuestions();
    };
});

renderQuestions();
if (unitPassed) {
    document.getElementById('examResult').innerHTML = currentLang === 'en' ? `<span style='color:green'>✅ Unit ${UNIT} already passed.</span>` : `<span style='color:green'>✅ Unidad ${UNIT} ya aprobada.</span>`;
    document.getElementById('nextUnitBtn').disabled = false;
}
