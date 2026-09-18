/* Exam engine for CTSPent (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/pent/unitN.js. */
// ============================================================
// PER-UNIT CONSTANTS
// ============================================================

const COURSE_PREFIX = "pent";




const CERT_URL = "CTSPentCertificate.html";

// ============================================================
// MULTIPLE CHOICE QUESTIONS (20) — Distribution: A=5, B=5, C=5, D=5
// ============================================================


// ============================================================
// SHORT ANSWER QUESTIONS (10) — split kw_en / kw_es
// ============================================================


// ============================================================
// GLOBAL STATE
// ============================================================
let studentTrack = "cert";
let studentName = "";
let lockoutEnd = null;
let examPassed = false;
const PASS_MC = 18;
const PASS_SA = 9;

function getStorageKey(key) { return `cts_${COURSE_PREFIX}_${key}`; }

// ============================================================
// STATE LOAD/SAVE
// ============================================================
function loadState() {
    const student = localStorage.getItem("cts_student");
    if (student) {
        try {
            const s = JSON.parse(student);
            studentName = s.name || "";
            studentTrack = s.track || "cert";
        } catch(e) {}
    }
    const trackOverride = localStorage.getItem("cts_track");
    if (trackOverride && ["cert","thm","mdiv"].includes(trackOverride)) studentTrack = trackOverride;

    const lock = localStorage.getItem(getStorageKey(`unit${UNIT}_lockout`));
    if (lock && parseInt(lock) > Date.now()) lockoutEnd = parseInt(lock);

    const passedFlag = localStorage.getItem(getStorageKey(`unit${UNIT}_passed`));
    if (passedFlag === "true") examPassed = true;

    const lang = localStorage.getItem(getStorageKey(`unit${UNIT}_lang`)) || "en";
    document.body.className = `lang-${lang}`;

    updateTrackDisplay();
    if (examPassed && !IS_LAST_UNIT) { var nl = document.getElementById("nextLink"); nl.href = NEXT_URL; nl.style.display = "block"; }
    else if (examPassed && IS_LAST_UNIT) window.location.href = CERT_URL;
}

function updateTrackDisplay() {
    const trackMap = { cert: "Certificate", thm: "Th.M.", mdiv: "M.Div." };
    document.getElementById("trackIndicator").innerHTML = `<span class="lang-en">Track: ${trackMap[studentTrack]}</span><span class="lang-es">Vía: ${trackMap[studentTrack]}</span>`;
}

function saveLanguage(lang) {
    localStorage.setItem(getStorageKey(`unit${UNIT}_lang`), lang);
    document.body.className = `lang-${lang}`;
}

// ============================================================
// RENDER QUESTIONS
// ============================================================
function renderQuestions() {
    const mcContainer = document.getElementById("mcQuestions");
    mcContainer.innerHTML = "";
    mcQuestions.forEach((q, idx) => {
        const card = document.createElement("div");
        card.className = "question-card";
        card.innerHTML = `
            <div class="question-text"><span class="lang-en">${q.textEn}</span><span class="lang-es">${q.textEs}</span></div>
            <div class="options" id="mc-${idx}-opts">
                ${q.optionsEn.map((opt, optIdx) => `<label><input type="radio" name="mc${idx}" value="${optIdx}"><span class="lang-en"> ${q.optionsEn[optIdx]}</span><span class="lang-es"> ${q.optionsEs[optIdx]}</span></label>`).join('')}
            </div>
            <div class="feedback" id="mc-${idx}-fb"></div>
        `;
        mcContainer.appendChild(card);
    });

    const saContainer = document.getElementById("saQuestions");
    saContainer.innerHTML = "";
    saQuestions.forEach((q, idx) => {
        const isCert = studentTrack === "cert";
        const card = document.createElement("div");
        card.className = "question-card essay-question";
        card.innerHTML = `
            <div class="question-text"><span class="lang-en">${q.textEn}</span><span class="lang-es">${q.textEs}</span></div>
            <textarea rows="3" id="sa-${idx}" placeholder='${isCert ? "Optional for Certificate track / Opcional para Certificado" : "Type your answer here... / Escriba su respuesta aquí..."}' ></textarea>
            <div class="feedback" id="sa-${idx}-fb"></div>
        `;
        saContainer.appendChild(card);
    });

    attachAutoScore();
    attachSAAutoSave();
    restoreAnswers();
}

// ============================================================
// AUTO-SCORE ON MC CHANGE + SA AUTO-SAVE
// ============================================================
function attachAutoScore() {
    mcQuestions.forEach((q, idx) => {
        const radios = document.querySelectorAll(`input[name="mc${idx}"]`);
        radios.forEach(r => {
            r.addEventListener("change", () => {
                const selected = document.querySelector(`input[name="mc${idx}"]:checked`);
                const fbDiv = document.getElementById(`mc-${idx}-fb`);
                if (selected) {
                    localStorage.setItem(getStorageKey(`unit${UNIT}_mc${idx}`), selected.value);
                    const isCorr = parseInt(selected.value) === q.correct;
                    if (fbDiv) {
                        fbDiv.className = `feedback ${isCorr ? "correct" : "incorrect"}`;
                        fbDiv.innerHTML = isCorr ? `<span class="lang-en">${q.correctFeedbackEn}</span><span class="lang-es">${q.correctFeedbackEs}</span>` : `<span class="lang-en">${q.incorrectFeedbackEn}</span><span class="lang-es">${q.incorrectFeedbackEs}</span>`;
                    }
                    document.querySelectorAll(`input[name="mc${idx}"]`).forEach(x => { x.disabled = true; });
                }
            });
        });
    });
}

function attachSAAutoSave() {
    saQuestions.forEach((q, idx) => {
        const ta = document.getElementById(`sa-${idx}`);
        if (ta) {
            ta.addEventListener("input", () => {
                localStorage.setItem(getStorageKey(`unit${UNIT}_sa${idx}`), ta.value);
            });
        }
    });
}

function restoreAnswers() {
    mcQuestions.forEach((q, idx) => {
        const saved = localStorage.getItem(getStorageKey(`unit${UNIT}_mc${idx}`));
        if (saved !== null) {
            const radio = document.querySelector(`input[name="mc${idx}"][value="${saved}"]`);
            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change'));
            }
        }
    });
    saQuestions.forEach((q, idx) => {
        const saved = localStorage.getItem(getStorageKey(`unit${UNIT}_sa${idx}`));
        if (saved !== null) {
            const ta = document.getElementById(`sa-${idx}`);
            if (ta) ta.value = saved;
        }
    });
}

// ============================================================
// SMART KEYWORD MATCHER (word-boundary; Q24 fairness standard)
//   keywords <=4 chars  -> whole-word match
//   keywords  >4 chars  -> left-anchored prefix (catches inflections)
//   Unicode-aware boundaries incl. Spanish accents
// ============================================================
function kwHit(answer, kw) {
    const a = (answer || "").toLowerCase();
    const k = (kw || "").toLowerCase().trim();
    if (!k) return false;
    const L = "a-z\u00e1\u00e9\u00ed\u00f3\u00fa\u00fc\u00f1";
    const esc = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pat = k.length <= 4
        ? new RegExp(`(^|[^${L}])${esc}([^${L}]|$)`, "i")
        : new RegExp(`(^|[^${L}])${esc}`, "i");
    return pat.test(a);
}

// ============================================================
// GRADE EXAM
// ============================================================
function gradeExam() {
    if (lockoutEnd && lockoutEnd > Date.now()) {
        const min = Math.ceil((lockoutEnd - Date.now()) / 60000);
        alert(`Lockout active. Please wait ${min} minutes. / Bloqueo activo. Espere ${min} minutos.`);
        return false;
    }

    let mcCorrect = 0;
    for (let i = 0; i < mcQuestions.length; i++) {
        const selected = document.querySelector(`input[name="mc${i}"]:checked`);
        const fbDiv = document.getElementById(`mc-${i}-fb`);
        if (selected) {
            const isCorr = parseInt(selected.value) === mcQuestions[i].correct;
            if (isCorr) mcCorrect++;
            fbDiv.className = `feedback ${isCorr ? "correct" : "incorrect"}`;
            fbDiv.innerHTML = isCorr ? `<span class="lang-en">${mcQuestions[i].correctFeedbackEn}</span><span class="lang-es">${mcQuestions[i].correctFeedbackEs}</span>` : `<span class="lang-en">${mcQuestions[i].incorrectFeedbackEn}</span><span class="lang-es">${mcQuestions[i].incorrectFeedbackEs}</span>`;
        } else {
            fbDiv.className = "feedback incorrect";
            fbDiv.innerHTML = "No answer selected. / No seleccionó respuesta.";
        }
    }

    let saPass = true;
    let saCorrectCount = 0;
    if (studentTrack !== "cert") {
        for (let i = 0; i < saQuestions.length; i++) {
            const answer = document.getElementById(`sa-${i}`).value.trim();
            const lang = document.body.className.replace("lang-", "");
            let keywords = lang === "es" ? saQuestions[i].kw_es : saQuestions[i].kw_en;
            if (lang === "both") keywords = [...saQuestions[i].kw_en, ...saQuestions[i].kw_es];
            const hits = keywords.filter(kw => kwHit(answer, kw)).length;
            const passed = hits >= 3 && answer.length >= 100;
            if (passed) saCorrectCount++;
            const fbDiv = document.getElementById(`sa-${i}-fb`);
            const verdict = passed
                ? `<span class="lang-en">✓ Passed — ${hits} key concepts recognized.</span><span class="lang-es">✓ Aprobado — ${hits} conceptos clave reconocidos.</span>`
                : `<span class="lang-en">Not enough yet — ${hits} of 3 key concepts matched (answer must also be ≥100 characters). Compare your answer with the model below.</span><span class="lang-es">Aún insuficiente — ${hits} de 3 conceptos clave (la respuesta también debe tener ≥100 caracteres). Compare su respuesta con el modelo.</span>`;
            const model = `<div class="model-answer"><strong><span class="lang-en">Model answer — study this:</span><span class="lang-es">Respuesta modelo — estúdiela:</span></strong> <span class="lang-en">${saQuestions[i].explanationEn}</span><span class="lang-es">${saQuestions[i].explanationEs}</span></div>`;
            fbDiv.className = `feedback ${passed ? "correct" : "incorrect"}`;
            fbDiv.innerHTML = (answer.length >= 100)
                ? (verdict + model)
                : `<span class="lang-en">Please write your own answer first \u2014 at least a few sentences (30+ characters) \u2014 then submit to compare it with the model answer.</span><span class="lang-es">Escriba primero su propia respuesta \u2014 al menos unas cuantas oraciones (30+ caracteres) \u2014 luego env\u00EDe para compararla con la respuesta modelo.</span>`;
        }
        saPass = saCorrectCount >= PASS_SA;
    }

    const mcPass = mcCorrect >= PASS_MC;
    const overallPass = studentTrack === "cert" ? mcPass : (mcPass && saPass);

    if (overallPass) {
        localStorage.setItem(getStorageKey(`unit${UNIT}_passed`), "true");
        examPassed = true;
        const msg = document.body.className.includes("lang-es") ? `¡Aprobado! Sus respuestas están marcadas abajo. Repáselas, luego use el enlace para continuar.` : `Passed! Your answers are marked below. Review them, then use the link to continue.`;
        alert(msg);
        if (IS_LAST_UNIT) window.location.href = CERT_URL;
        else { var nl = document.getElementById("nextLink"); nl.href = NEXT_URL; nl.style.display = "block"; }
    } else {
        const lockMinutes = (studentTrack === "cert") ? 2 : 15;
        const lockoutTime = Date.now() + lockMinutes * 60 * 1000;
        localStorage.setItem(getStorageKey(`unit${UNIT}_lockout`), lockoutTime);
        lockoutEnd = lockoutTime;
        showLockoutTimer();
        const failMsg = document.body.className.includes("lang-es") ? `No aprobado. Bloqueo de ${lockMinutes} minutos iniciado. (MC: ${mcCorrect}/20${studentTrack !== "cert" ? `, SA: ${saCorrectCount}/10` : ""})` : `Failed. ${lockMinutes}-minute lockout started. (MC: ${mcCorrect}/20${studentTrack !== "cert" ? `, SA: ${saCorrectCount}/10` : ""})`;
        alert(failMsg);
    }
    return overallPass;
}

function showLockoutTimer() {
    const timerDiv = document.getElementById("lockoutTimer");
    if (!lockoutEnd || lockoutEnd <= Date.now()) { timerDiv.style.display = "none"; return; }
    timerDiv.style.display = "block";
    const update = () => {
        const remaining = Math.max(0, Math.ceil((lockoutEnd - Date.now()) / 1000));
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        timerDiv.innerHTML = `<span class="lang-en">Lockout: ${minutes}:${seconds.toString().padStart(2,'0')} remaining</span><span class="lang-es">Bloqueo: ${minutes}:${seconds.toString().padStart(2,'0')} restantes</span>`;
        if (remaining <= 0) { timerDiv.style.display = "none"; lockoutEnd = null; }
        else setTimeout(update, 1000);
    };
    update();
}

// ============================================================
// RESET (bilingual confirm + clear saved answers)
// ============================================================
function resetExam() {
    const isEs = document.body.className.includes("lang-es");
    const msg = isEs ? "¿Reiniciar todas las respuestas? Esto no se puede deshacer." : "Reset all answers? This cannot be undone.";
    if (confirm(msg)) {
        document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
        document.querySelectorAll('textarea').forEach(t => t.value = "");
        document.querySelectorAll('.feedback').forEach(f => { f.className = "feedback"; f.innerHTML = ""; });
        mcQuestions.forEach((q, idx) => localStorage.removeItem(getStorageKey(`unit${UNIT}_mc${idx}`)));
        saQuestions.forEach((q, idx) => localStorage.removeItem(getStorageKey(`unit${UNIT}_sa${idx}`)));
    }
}

// ============================================================
// INIT
// ============================================================
document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => saveLanguage(btn.dataset.lang));
});
document.getElementById("submitBtn").addEventListener("click", gradeExam);
document.getElementById("resetBtn").addEventListener("click", resetExam);

loadState();
renderQuestions();
if (lockoutEnd) showLockoutTimer();
