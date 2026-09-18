/* Exam engine for CTSAL (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/al/unitN.js. */
const totalUnits = 10;
let currentUnit = UNIT;

const STATE_KEY     = `cts_${COURSE}_u${UNIT}_state`;
const MC_PASS_KEY   = `cts_${COURSE}_u${UNIT}_mc_passed`;
const SA_LOCK_KEY   = `cts_${COURSE}_u${UNIT}_sa_lockout`;
const FULL_LOCK_KEY = `cts_${COURSE}_u${UNIT}_lockout`;


function lockMinutes() {
    try {
        const st = JSON.parse(localStorage.getItem('cts_student') || 'null');
        const t = st && st.track ? st.track : 'certificate';
        return (t === 'mdiv' || t === 'thm') ? 15 : 2;
    } catch (e) { return 2; }
}

let progress = {};
try { progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch(e) { progress = {}; }
let unitPassed = !!progress[`unit${UNIT}`];
let mcPreviouslyPassed = localStorage.getItem(MC_PASS_KEY) === 'true';



function updateProgressGrid() {
    const grid = document.getElementById('progressGrid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 1; i <= totalUnits; i++) {
        let cls = '';
        if (progress[`unit${i}`]) cls = 'completed';
        if (i === currentUnit) cls += ' active';
        grid.innerHTML += `<a href="CTSALUnit${i}.html" class="${cls}" title="${unitTitlesEn[i-1]}">${i}</a>`;
    }
    if (progress[`unit${UNIT}`]) document.getElementById('nextUnitBtn').disabled = false;
}
document.getElementById('nextUnitBtn').onclick = () => { location.href = NEXT_UNIT_URL; };
updateProgressGrid();

function displayStudentGreeting() {
    const student = JSON.parse(localStorage.getItem('cts_student') || 'null');
    if (student && student.name) {
        document.getElementById('studentGreeting').innerHTML = `\u{1F44B} ${student.name}`;
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
    localStorage.setItem('cts_student', JSON.stringify(student));
    localStorage.setItem('cts_track', track);
    document.getElementById('regStatus').innerHTML = "<span style='color:green'>\u2713 Registered successfully!</span>";
    setTimeout(() => { document.getElementById('regCard').style.display = 'none'; displayStudentGreeting(); }, 800);
};

document.getElementById('langToggleBtn').onclick = function() {
    if (document.body.classList.contains('lang-en')) {
        document.body.classList.remove('lang-en'); document.body.classList.add('lang-es');
        this.textContent = 'English';
    } else {
        document.body.classList.remove('lang-es'); document.body.classList.add('lang-en');
        this.textContent = 'Espa\u00f1ol';
    }
    renderQuestions(); checkLockouts();
};




let currentLang = 'en';
let mcAnswers = new Array(20).fill(null);
let kwAnswers = new Array(10).fill("");
let mcRevealed = false;
try {
    const st = JSON.parse(localStorage.getItem(STATE_KEY) || '{}');
    if (Array.isArray(st.mcAnswers) && st.mcAnswers.length === 20) mcAnswers = st.mcAnswers;
    if (Array.isArray(st.kwAnswers) && st.kwAnswers.length === 10) kwAnswers = st.kwAnswers;
} catch(e) {}

function saveState() {
    try { localStorage.setItem(STATE_KEY, JSON.stringify({ mcAnswers, kwAnswers })); } catch(e) {}
}

function checkLockouts() {
    const submitBtn = document.getElementById('submitExamBtn');
    const result = document.getElementById('examResult');
    const notice = document.getElementById('mcBankedNotice');
    const isEs = document.body.classList.contains('lang-es');
    const now = Date.now();
    const fullLock = parseInt(localStorage.getItem(FULL_LOCK_KEY) || '0', 10);
    const saLock = parseInt(localStorage.getItem(SA_LOCK_KEY) || '0', 10);

    if (unitPassed) {
        submitBtn.disabled = true;
        result.innerHTML = isEs
            ? "<span style='color:#1f6b3b'>\u2713 Unidad ya aprobada. Haga clic en el Certificado arriba.</span>"
            : "<span style='color:green'>\u2713 Unit already passed! Click the Certificate above.</span>";
        notice.style.display = 'none';
        return true;
    }
    if (now < fullLock) {
        const m = Math.ceil((fullLock - now) / 60000);
        submitBtn.disabled = true;
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>\u{1F4D6} Tome unos minutos para repasar la lecci\u00f3n de arriba, y luego intente de nuevo. Puede reintentar en ${m} minuto(s). \u00a1Usted puede lograrlo!</span>`
            : `<span style='color:#8a1f1f'>\u{1F4D6} Take a few minutes to review the lesson above, then try again. You can retry in ${m} minute(s) \u2014 you've got this!</span>`;
        notice.style.display = 'none';
        setTimeout(checkLockouts, 30000);
        return false;
    }
    if (mcPreviouslyPassed && now < saLock) {
        const m = Math.ceil((saLock - now) / 60000);
        submitBtn.disabled = true;
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>\u{1F4D6} Opci\u00f3n m\u00faltiple aprobada y guardada. Repase la lecci\u00f3n y las respuestas modelo, y reintente la secci\u00f3n de respuesta corta en ${m} minuto(s).</span>`
            : `<span style='color:#8a1f1f'>\u{1F4D6} Multiple-choice passed and saved. Review the lesson and model answers, then retry the short-answer section in ${m} minute(s).</span>`;
        notice.style.display = 'none';
        setTimeout(checkLockouts, 30000);
        return false;
    }
    submitBtn.disabled = false;
    if (mcPreviouslyPassed) {
        notice.style.display = 'block';
        notice.innerHTML = isEs
            ? "\u2713 MC ya aprobado y guardado. Solo necesita reenviar la secci\u00f3n de respuesta corta (9/10)."
            : "\u2713 MC already passed and banked. Only need to resubmit the short-answer section (9/10).";
    } else {
        notice.style.display = 'none';
    }
    return true;
}

function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    if (!container) return;
    container.innerHTML = '';
    currentLang = document.body.classList.contains('lang-en') ? 'en' : 'es';

    const mcTitle = document.createElement('h3');
    mcTitle.innerHTML = currentLang === 'en' ? 'Multiple Choice (Questions 1\u201320)' : 'Opci\u00f3n M\u00faltiple (Preguntas 1\u201320)';
    container.appendChild(mcTitle);

    if (mcPreviouslyPassed) {
        const banked = document.createElement('div');
        banked.className = 'feedback-text correct';
        banked.style.marginBottom = '15px';
        banked.innerHTML = currentLang === 'en'
            ? '\u2713 Multiple-choice section previously passed. Your answers are preserved below for reference; you may proceed directly to the short-answer section.'
            : '\u2713 Secci\u00f3n de opci\u00f3n m\u00faltiple ya aprobada. Sus respuestas se conservan abajo para referencia; puede pasar directamente a la secci\u00f3n de respuesta corta.';
        container.appendChild(banked);
    }

    const mcReveal = mcRevealed || mcPreviouslyPassed;
    mcQuestions.forEach((q, idx) => {
        const div = document.createElement('div');
        div.className = 'question';
        const qText = document.createElement('p');
        qText.style.fontWeight = 'bold';
        qText.innerHTML = (idx + 1) + '. ' + (currentLang === 'en' ? q.textEn : q.textEs);
        div.appendChild(qText);
        const options = currentLang === 'en' ? q.optionsEn : q.optionsEs;
        const correctLetter = String.fromCharCode(65 + q.correct);
        const answered = !!mcAnswers[idx];
        options.forEach((opt, optIdx) => {
            const letter = String.fromCharCode(65 + optIdx);
            const btn = document.createElement('button');
            btn.className = 'option';
            btn.textContent = `${letter}. ${opt}`;
            if (answered || mcReveal) {
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
        if (answered || mcReveal) {
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
    kwTitle.innerHTML = currentLang === 'en' ? 'Short Answer (21\u201330) \u2014 M.Div. / Th.M. Track' : 'Respuesta Corta (21\u201330) \u2014 M.Div. / Th.M.';
    container.appendChild(kwTitle);

    kwQuestions.forEach((q, idx) => {
        const div = document.createElement('div');
        div.className = 'question';
        const qText = document.createElement('p');
        qText.style.fontWeight = 'bold';
        qText.innerHTML = (mcQuestions.length + idx + 1) + '. ' + (currentLang === 'en' ? q.textEn : q.textEs);
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
                fb.innerHTML = currentLang === 'en' ? 'Please write your own answer first (at least 100 characters), then check it against the model answer below.' : 'Escriba primero su propia respuesta (al menos 100 caracteres), luego comp\u00e1rela con la respuesta modelo abajo.';
                return;
            }
            const hits = kws.filter(k => kwHit(ans, k));
            fb.className = 'feedback-text correct';
            if (hits.length >= 3) {
                fb.innerHTML = currentLang === 'en'
                    ? `\u2713 Well done \u2014 your answer touches ${hits.length} of the lesson's key ideas. Now compare it with the model answer below to deepen your understanding.`
                    : `\u2713 Muy bien \u2014 su respuesta toca ${hits.length} de las ideas clave de la lecci\u00f3n. Ahora comp\u00e1rela con la respuesta modelo abajo para profundizar su comprensi\u00f3n.`;
            } else {
                fb.innerHTML = currentLang === 'en'
                    ? `Good effort \u2014 you have begun the answer. Read the model answer below and notice the key ideas you might add. This is how we learn; there is no penalty.`
                    : `Buen esfuerzo \u2014 ha comenzado la respuesta. Lea la respuesta modelo abajo y note las ideas clave que podr\u00eda a\u00f1adir. As\u00ed aprendemos; no hay penalizaci\u00f3n.`;
            }
            const model = currentLang === 'en' ? (q.modelEn || '') : (q.modelEs || '');
            if (model) {
                modelBox.style.display = 'block';
                modelBox.innerHTML = (currentLang === 'en' ? '<strong>Model answer \u2014 study this:</strong> ' : '<strong>Respuesta modelo \u2014 est\u00fadiela:</strong> ') + model;
            }
        };
        div.appendChild(checkBtn);
        div.appendChild(fb);
        div.appendChild(modelBox);
        container.appendChild(div);
        ta.addEventListener('input', e => { kwAnswers[idx] = e.target.value; saveState(); });
    });
}

function gradeMC() {
    let c = 0;
    for (let i = 0; i < 20; i++) {
        if (mcAnswers[i] === String.fromCharCode(65 + mcQuestions[i].correct)) c++;
    }
    return c;
}

function kwHit(ans, k) {
    k = (k || '').toLowerCase();
    if (!k) return false;
    var WC = '0-9a-z\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00fc';
    var esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var pat = (k.length <= 4)
        ? '(?:^|[^' + WC + '])' + esc + '(?![' + WC + '])'
        : '(?:^|[^' + WC + '])' + esc;
    try { return new RegExp(pat, 'i').test(ans); }
    catch(e) { return ans.indexOf(k) !== -1; }
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

function isMastersLevel(track) { return track === 'mdiv' || track === 'thm'; }

function submitExam() {
    if (!checkLockouts()) return;
    if (unitPassed) return;
    const student = JSON.parse(localStorage.getItem('cts_student') || 'null');
    if (!student || !student.name) {
        alert(currentLang === 'en' ? 'Please register first.' : 'Por favor reg\u00edstrese primero.');
        return;
    }
    const isEs = document.body.classList.contains('lang-es');
    const track = student.track || 'certificate';
    const result = document.getElementById('examResult');
    const mcScore = mcPreviouslyPassed ? 20 : gradeMC();
    const mcOk = mcScore >= 18;
    if (!mcPreviouslyPassed) { mcRevealed = true; renderQuestions(); }

    if (!isMastersLevel(track)) {
        if (mcOk) {
            progress[`unit${UNIT}`] = true;
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
            localStorage.setItem(MC_PASS_KEY, 'true');
            mcPreviouslyPassed = true; unitPassed = true;
            result.innerHTML = isEs
                ? `<span style='color:#1f6b3b'>\u2713 \u00a1APROBADO! ${mcScore}/20. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
                : `<span style='color:green'>\u2713 PASSED! ${mcScore}/20. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
            document.getElementById('nextUnitBtn').disabled = false;
            updateProgressGrid();
        } else {
            localStorage.setItem(FULL_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
            result.innerHTML = isEs
                ? `<span style='color:#8a1f1f'>Obtuvo ${mcScore}/20 (se necesitan 18 para aprobar). \u00a1Est\u00e1 cerca, no se desanime! Repase la lecci\u00f3n de arriba, y vuelva a intentarlo en ${lockMinutes()} minuto(s). Las explicaciones de abajo muestran qu\u00e9 estudiar.</span>`
                : `<span style='color:#8a1f1f'>You scored ${mcScore}/20 (18 needed to pass). You're close \u2014 don't be discouraged! Review the lesson above, then try again in ${lockMinutes()} minute(s). The answer explanations below show what to study.</span>`;
            checkLockouts();
        }
        return;
    }

    const saScore = gradeSA();
    const saOk = saScore >= 9;

    if (mcPreviouslyPassed) {
        if (saOk) {
            progress[`unit${UNIT}`] = true;
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
            unitPassed = true;
            result.innerHTML = isEs
                ? `<span style='color:#1f6b3b'>\u2713 \u00a1APROBADO! MC \u2713 banco + SA ${saScore}/10. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
                : `<span style='color:green'>\u2713 PASSED! MC \u2713 banked + SA ${saScore}/10. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
            document.getElementById('nextUnitBtn').disabled = false;
            updateProgressGrid();
        } else {
            localStorage.setItem(SA_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
            result.innerHTML = isEs
                ? `<span style='color:#8a1f1f'>Su aprobaci\u00f3n de opci\u00f3n m\u00faltiple est\u00e1 a salvo. Respuesta corta: ${saScore}/10 (se necesitan 9). Buen esfuerzo \u2014 repase la lecci\u00f3n y las respuestas modelo abajo, y reintente la secci\u00f3n de respuesta corta en ${lockMinutes()} minuto(s).</span>`
                : `<span style='color:#8a1f1f'>Your multiple-choice pass is safe. Short answer: ${saScore}/10 (9 needed). Good effort \u2014 review the lesson and the model answers below, then try the short-answer section again in ${lockMinutes()} minute(s).</span>`;
            checkLockouts();
        }
        return;
    }

    if (mcOk && saOk) {
        progress[`unit${UNIT}`] = true;
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
        localStorage.setItem(MC_PASS_KEY, 'true');
        mcPreviouslyPassed = true; unitPassed = true;
        result.innerHTML = isEs
            ? `<span style='color:#1f6b3b'>\u2713 \u00a1APROBADO! MC ${mcScore}/20 + SA ${saScore}/10. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
            : `<span style='color:green'>\u2713 PASSED! MC ${mcScore}/20 + SA ${saScore}/10. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
        document.getElementById('nextUnitBtn').disabled = false;
        updateProgressGrid();
    } else if (mcOk && !saOk) {
        localStorage.setItem(MC_PASS_KEY, 'true');
        mcPreviouslyPassed = true;
        localStorage.setItem(SA_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>MC ${mcScore}/20 \u2713 aprobado y guardado. SA ${saScore}/10 (se requiere 9). Secci\u00f3n SA bloqueada ${lockMinutes()} min. Al desbloquear, reenv\u00ede solo la SA \u2014 el MC permanece aprobado.</span>`
            : `<span style='color:#8a1f1f'>MC ${mcScore}/20 \u2713 passed and banked. SA ${saScore}/10 (need 9). SA section locked ${lockMinutes()} min. When unlocked, resubmit SA only \u2014 MC stays passed.</span>`;
        checkLockouts();
    } else {
        localStorage.setItem(FULL_LOCK_KEY, String(Date.now() + lockMinutes() * 60 * 1000));
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>\u2717 Reprobado: MC ${mcScore}/20 + SA ${saScore}/10 (se requiere 18 y 9). Unidad bloqueada ${lockMinutes()} minutos.</span>`
            : `<span style='color:#8a1f1f'>\u2717 Failed: MC ${mcScore}/20 + SA ${saScore}/10 (need 18 and 9). Unit locked ${lockMinutes()} minutes.</span>`;
        checkLockouts();
    }
}

function resetUnit() {
    const isEs = document.body.classList.contains('lang-es');
    const msg = isEs
        ? '\u00bfReiniciar esta unidad?\n\nEsto borrar\u00e1: respuestas en progreso, estado MC aprobado, todos los bloqueos, y el indicador de aprobaci\u00f3n de esta unidad.\n\nEl contenido docente permanece. Esta acci\u00f3n no se puede deshacer.'
        : 'Reset this unit?\n\nThis will clear: in-progress answers, MC-passed state, all lockouts, and this unit\'s pass flag.\n\nTeaching content stays. This cannot be undone.';
    if (!confirm(msg)) return;
    localStorage.removeItem(STATE_KEY);
    localStorage.removeItem(MC_PASS_KEY);
    localStorage.removeItem(SA_LOCK_KEY);
    localStorage.removeItem(FULL_LOCK_KEY);
    delete progress[`unit${UNIT}`];
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    mcAnswers = new Array(20).fill(null);
    kwAnswers = new Array(10).fill("");
    mcPreviouslyPassed = false;
    renderQuestions();
    try { location.reload(); } catch (e) {}
}

document.getElementById('submitExamBtn').onclick = submitExam;
document.getElementById('resetExamBtn').onclick = resetUnit;
renderQuestions();
checkLockouts();
