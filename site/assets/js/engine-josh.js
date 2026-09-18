/* Exam engine for CTSJosh (shared by 2 unit pages).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/josh/unitN.js. */
// =====================================================================
// CTS Joshua — Unit 2 (retrofit to CTS pattern, 2026-05-16)
// MC L3 verified | distribution 5/5/5/5 | split kw_en/kw_es
// =====================================================================


const COURSE = 'josh';

const totalUnits = 10;
let currentUnit = UNIT;

const STATE_KEY     = `cts_${COURSE}_u${UNIT}_state`;
const MC_PASS_KEY   = `cts_${COURSE}_u${UNIT}_mc_passed`;
const SA_LOCK_KEY   = `cts_${COURSE}_u${UNIT}_sa_lockout`;
const FULL_LOCK_KEY = `cts_${COURSE}_u${UNIT}_lockout`;
const PROGRESS_KEY  = `cts_${COURSE}_progress`;

let progress = {};
try { progress = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch(e) { progress = {}; }
let unitPassed = !!progress[`unit${UNIT}`];
let mcPreviouslyPassed = localStorage.getItem(MC_PASS_KEY) === 'true';

const unitTitlesEn = [
    "The Commission (Joshua 1)",
    "Rahab and the Scarlet Cord (Joshua 2)",
    "Crossing the Jordan / Memorial Stones (Joshua 3-4)",
    "Captain of the Lord's Host / Jericho (Joshua 5-6)",
    "Achan's Sin and Ai Restored (Joshua 7-8)",
    "Gibeonite Deception and the Long Day (Joshua 9-10)",
    "Northern Conquest / Kings Defeated (Joshua 11-12)",
    "The Inheritance Allotted (Joshua 13-19)",
    "Cities of Refuge / Altar of Witness (Joshua 20-22)",
    "Choose This Day (Joshua 23-24) - Capstone"
];

function updateProgressGrid() {
    const grid = document.getElementById('progressGrid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 1; i <= totalUnits; i++) {
        let cls = '';
        if (progress[`unit${i}`]) cls = 'completed';
        if (i === currentUnit) cls += ' active';
        grid.innerHTML += `<a href="CTSJoshUnit${i}.html" class="${cls}" title="${unitTitlesEn[i-1]}">${i}</a>`;
    }
    if (progress[`unit${UNIT}`]) document.getElementById('nextUnitBtn').disabled = false;
}
document.getElementById('nextUnitBtn').onclick = () => { location.href = NEXT_UNIT_URL; };
updateProgressGrid();

function displayStudentGreeting() {
    const student = JSON.parse(localStorage.getItem('cts_student') || 'null');
    if (student && student.name) {
        document.getElementById('studentGreeting').innerHTML = `👋 ${student.name}`;
    }
}
displayStudentGreeting();

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

// MC distribution: A=B=C=D=5 (cycle 0,1,2,3 ×5). L3 semantic audit: all 20 verified.


// SA: split kw_en / kw_es per 2026-05-16 rule. Threshold: ≥3 hits per language, length ≥20 chars.


// ---------- State load/save ----------
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

// ---------- Lockout & UI ----------
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
            ? `<span style='color:#1f6b3b'>✓ Unidad ya aprobada. Haga clic en Unidad ${UNIT + 1} arriba.</span>`
            : `<span style='color:green'>✓ Unit already passed! Click Unit ${UNIT + 1} above.</span>`;
        notice.style.display = 'none';
        return true;
    }
    if (now < fullLock) {
        const m = Math.ceil((fullLock - now) / 60000);
        submitBtn.disabled = true;
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>⏰ Bloqueado. Espera ${m} min.</span>`
            : `<span style='color:#8a1f1f'>⏰ Locked. Wait ${m} min.</span>`;
        notice.style.display = 'none';
        setTimeout(checkLockouts, 30000);
        return false;
    }
    if (mcPreviouslyPassed && now < saLock) {
        const m = Math.ceil((saLock - now) / 60000);
        submitBtn.disabled = true;
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>⏰ MC ✓ aprobado. Sección SA bloqueada. Espera ${m} min.</span>`
            : `<span style='color:#8a1f1f'>⏰ MC ✓ passed. SA section locked. Wait ${m} min.</span>`;
        notice.style.display = 'none';
        setTimeout(checkLockouts, 30000);
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
            ? '✓ Multiple-choice section previously passed. Your answers are preserved below for reference; proceed directly to the short-answer section.'
            : '✓ Sección de opción múltiple ya aprobada. Sus respuestas se conservan abajo para referencia; pase directamente a la sección de respuesta corta.';
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
        const mb = document.createElement('div');
        mb.className = 'js-model-box';
        mb.style.cssText = 'display:none;margin-top:10px;padding:10px 12px;background:#fbf3d5;border:1px solid #d4af37;border-radius:8px;';
        mb.innerHTML = (currentLang === 'en'
            ? '<strong>Model answer — study this</strong><br>' + q.modelEn
            : '<strong>Respuesta modelo — estúdiela</strong><br>' + q.modelEs);
        checkBtn.onclick = function() {
            const ans = (ta.value || '').trim().toLowerCase();
            const kws = currentLang === 'es' ? q.kw_es : q.kw_en;
            if (ans.length < 100) {
                fb.className = 'feedback-text incorrect';
                fb.innerHTML = currentLang === 'en' ? 'Please write a more complete answer (at least 20 characters).' : 'Escriba una respuesta más completa (al menos 20 caracteres).';
                return;
            }
            const hits = kws.filter(kw => kwHit(ans, kw)).length;
            if (hits >= 3) {
                fb.className = 'feedback-text correct';
                fb.innerHTML = currentLang === 'en' ? `✓ Solid answer (${hits}/${kws.length} key concepts referenced).` : `✓ Respuesta sólida (${hits}/${kws.length} conceptos clave referenciados).`;
            } else {
                fb.className = 'feedback-text incorrect';
                fb.innerHTML = currentLang === 'en'
                    ? `✗ Need at least 3 key concepts; got ${hits}/${kws.length}. Compare your answer with the model below.`
                    : `✗ Necesita al menos 3 conceptos clave; obtuvo ${hits}/${kws.length}. Compare su respuesta con el modelo abajo.`;
            }
            mb.style.display = 'block';
        };
        div.appendChild(checkBtn);
        div.appendChild(fb);
        div.appendChild(mb);
        container.appendChild(div);
        ta.addEventListener('input', e => { kwAnswers[idx] = e.target.value; saveState(); });
    });
}

// ---------- Grading ----------
function gradeMC() {
    let c = 0;
    for (let i = 0; i < 20; i++) {
        if (mcAnswers[i] === String.fromCharCode(65 + mcQuestions[i].correct)) c++;
    }
    return c;
}

// kwHit: short keywords (<=4 chars) match as whole words; longer keywords match
// as a left-boundary prefix (so intentional stems like 'medita','sacrific' still
// catch inflections, while 'no'/'ed'/'og' no longer match inside longer words).
// Word chars include accented Spanish letters.
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

// Masters-level = M.Div. OR Th.M. Both are graded on MC AND SA.
// Grading must route through this, never through a bare M.Div. check.
function isMastersLevel(track) {
    return track === 'mdiv' || track === 'thm';
}

// ---------- Submit ----------
function submitExam() {
    if (!checkLockouts()) return;
    if (unitPassed) return;

    const student = JSON.parse(localStorage.getItem('cts_student') || 'null');
    if (!student || !student.name) {
        alert(currentLang === 'en' ? 'Please register on Unit 1 first.' : 'Por favor regístrese primero en la Unidad 1.');
        return;
    }
    const isEs = document.body.classList.contains('lang-es');
    const track = student.track || 'certificate';
    const result = document.getElementById('examResult');

    document.querySelectorAll('.js-model-box').forEach(function(e){ e.style.display = 'block'; });

    const mcScore = mcPreviouslyPassed ? 20 : gradeMC();
    const mcOk = mcScore >= 18;
    if (!mcPreviouslyPassed) { mcRevealed = true; renderQuestions(); }

    if (!isMastersLevel(track)) { // certificate / non-Masters: MC only
        if (mcOk) {
            progress[`unit${UNIT}`] = true;
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
            localStorage.setItem(MC_PASS_KEY, 'true');
            mcPreviouslyPassed = true;
            unitPassed = true;
            result.innerHTML = isEs
                ? `<span style='color:#1f6b3b'>✓ ¡APROBADO! ${mcScore}/20. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
                : `<span style='color:green'>✓ PASSED! ${mcScore}/20. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
            document.getElementById('nextUnitBtn').disabled = false;
            updateProgressGrid();
        } else {
            localStorage.setItem(FULL_LOCK_KEY, String(Date.now() + 2 * 60 * 1000));
            result.innerHTML = isEs
                ? `<span style='color:#8a1f1f'>✗ Reprobado: ${mcScore}/20 (se requiere 18). Bloqueado 2 minutos.</span>`
                : `<span style='color:#8a1f1f'>✗ Failed: ${mcScore}/20 (need 18). Locked 2 minutes.</span>`;
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
                ? `<span style='color:#1f6b3b'>✓ ¡APROBADO! MC ✓ banco + SA ${saScore}/10. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
                : `<span style='color:green'>✓ PASSED! MC ✓ banked + SA ${saScore}/10. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
            document.getElementById('nextUnitBtn').disabled = false;
            updateProgressGrid();
        } else {
            localStorage.setItem(SA_LOCK_KEY, String(Date.now() + 15 * 60 * 1000));
            result.innerHTML = isEs
                ? `<span style='color:#8a1f1f'>✗ MC ✓ permanece aprobado. SA reprobada: ${saScore}/10 (se requiere 9). Sección SA bloqueada 15 min.</span>`
                : `<span style='color:#8a1f1f'>✗ MC ✓ stays passed. SA failed: ${saScore}/10 (need 9). SA section locked 15 min.</span>`;
            checkLockouts();
        }
        return;
    }

    if (mcOk && saOk) {
        progress[`unit${UNIT}`] = true;
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
        localStorage.setItem(MC_PASS_KEY, 'true');
        mcPreviouslyPassed = true;
        unitPassed = true;
        result.innerHTML = isEs
            ? `<span style='color:#1f6b3b'>✓ ¡APROBADO! MC ${mcScore}/20 + SA ${saScore}/10. Sus respuestas están marcadas abajo. Repáselas, luego use el botón de arriba para continuar.</span>`
            : `<span style='color:green'>✓ PASSED! MC ${mcScore}/20 + SA ${saScore}/10. Your answers are marked below. Review them, then use the button at the top to continue.</span>`;
        document.getElementById('nextUnitBtn').disabled = false;
        updateProgressGrid();
    } else if (mcOk && !saOk) {
        localStorage.setItem(MC_PASS_KEY, 'true');
        mcPreviouslyPassed = true;
        localStorage.setItem(SA_LOCK_KEY, String(Date.now() + 15 * 60 * 1000));
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>MC ${mcScore}/20 ✓ aprobado y guardado. SA ${saScore}/10 (se requiere 9). Sección SA bloqueada 15 min. Al desbloquear, reenvíe solo la SA — el MC permanece aprobado.</span>`
            : `<span style='color:#8a1f1f'>MC ${mcScore}/20 ✓ passed and banked. SA ${saScore}/10 (need 9). SA section locked 15 min. When unlocked, resubmit SA only — MC stays passed.</span>`;
        checkLockouts();
    } else {
        localStorage.setItem(FULL_LOCK_KEY, String(Date.now() + 2 * 60 * 1000));
        result.innerHTML = isEs
            ? `<span style='color:#8a1f1f'>✗ Reprobado: MC ${mcScore}/20 + SA ${saScore}/10 (se requiere 18 y 9). Unidad bloqueada 2 minutos.</span>`
            : `<span style='color:#8a1f1f'>✗ Failed: MC ${mcScore}/20 + SA ${saScore}/10 (need 18 and 9). Unit locked 2 minutes.</span>`;
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
    localStorage.removeItem(STATE_KEY);
    localStorage.removeItem(MC_PASS_KEY);
    localStorage.removeItem(SA_LOCK_KEY);
    localStorage.removeItem(FULL_LOCK_KEY);
    delete progress[`unit${UNIT}`];
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    location.reload();
}

document.getElementById('submitExamBtn').onclick = submitExam;
document.getElementById('resetExamBtn').onclick = resetUnit;
renderQuestions();
checkLockouts();
