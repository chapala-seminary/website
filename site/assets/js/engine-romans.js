/* Exam engine for CTSRomans (shared by 9 unit pages).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/romans/unitN.js. */
var _ctsMem={};
  function lsGet(k){try{return localStorage.getItem(k);}catch(e){return (k in _ctsMem)?_ctsMem[k]:null;}}
  function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){_ctsMem[k]=String(v);}}
  function lsDel(k){try{localStorage.removeItem(k);}catch(e){delete _ctsMem[k];}}

// ============================================================
// PER-UNIT CONSTANTS
// ============================================================

const COURSE_PREFIX = "romans";




const CERT_URL = "CTSRomansCertificate.html";

// ============================================================
// MULTIPLE CHOICE QUESTIONS (20) — Distribution A=5, B=5, C=5, D=5
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

function loadState() {
    const student = lsGet("cts_student");
    if (student) {
        try {
            const s = JSON.parse(student);
            studentName = s.name || "";
            studentTrack = s.track || "cert";
        } catch(e) {}
    }
    const trackOverride = lsGet("cts_track");
    if (trackOverride && ["cert","thm","mdiv"].includes(trackOverride)) studentTrack = trackOverride;

    const lock = lsGet(getStorageKey(`unit${UNIT}_lockout`));
    if (lock && parseInt(lock) > Date.now()) lockoutEnd = parseInt(lock);

    const passedFlag = lsGet(getStorageKey(`unit${UNIT}_passed`));
    if (passedFlag === "true") examPassed = true;

    const lang = lsGet(getStorageKey(`unit${UNIT}_lang`)) || "en";
    document.body.className = `lang-${lang}`;

    updateTrackDisplay();
    handleRegistrationCard();
}

function handleRegistrationCard() {
    const regSection = document.getElementById("registrationSection");
    if (SHOW_REGISTRATION_CARD && !lsGet("cts_student")) {
        regSection.style.display = "block";
    } else {
        regSection.style.display = "none";
    }
}

function updateTrackDisplay() {
    const trackMap = { cert: "Certificate", thm: "Th.M.", mdiv: "M.Div." };
    document.getElementById("trackIndicator").innerHTML = `<span class="lang-en">Track: ${trackMap[studentTrack]}</span><span class="lang-es">Vía: ${trackMap[studentTrack]}</span>`;
}

function saveLanguage(lang) {
    lsSet(getStorageKey(`unit${UNIT}_lang`), lang);
    document.body.className = `lang-${lang}`;
}

function submitRegistration() {
    const name = document.getElementById("regName").value.trim();
    const trackEl = document.querySelector('input[name="regTrack"]:checked');
    if (!name) {
        const isEs = document.body.className.includes("lang-es");
        alert(isEs ? "Por favor ingrese su nombre." : "Please enter your name.");
        return;
    }
    const track = trackEl ? trackEl.value : "cert";
    lsSet("cts_student", JSON.stringify({ name, track }));
    lsSet("cts_track", track);
    studentName = name;
    studentTrack = track;
    updateTrackDisplay();
    document.getElementById("registrationSection").style.display = "none";
    renderQuestions();
}

function renderQuestions() {
    const mcContainer = document.getElementById("mcQuestions");
    mcContainer.innerHTML = "";
    mcQuestions.forEach((q, idx) => {
        const card = document.createElement("div");
        card.className = "question-card";
        card.innerHTML = `
            <div class="question-text"><span class="lang-en">${q.text}</span><span class="lang-es">${q.textEs}</span></div>
            <div class="options" id="mc-${idx}-opts">
                ${q.options.map((opt, optIdx) => `<label><input type="radio" name="mc${idx}" value="${optIdx}"> <span class="lang-en">${opt}</span><span class="lang-es">${q.optionsEs[optIdx]}</span></label>`).join('')}
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
            <div class="question-text"><span class="lang-en">${mcQuestions.length + idx + 1}. ${q.textEn}</span><span class="lang-es">${mcQuestions.length + idx + 1}. ${q.textEs}</span></div>
            <textarea rows="3" id="sa-${idx}" placeholder='${isCert ? "Optional for Certificate track / Opcional para Certificado" : "Type your answer here... / Escriba su respuesta aquí..."}' ></textarea>
            <button type="button" class="check-kw-btn" data-sa="${idx}"><span class="lang-en">Check Answer</span><span class="lang-es">Verificar</span></button>
            <div class="feedback" id="sa-${idx}-fb"></div>
        `;
        saContainer.appendChild(card);
    });

    attachAutoScore();
    attachSAAutoSave();
    restoreAnswers();
}

function attachAutoScore() {
    mcQuestions.forEach((q, idx) => {
        const radios = document.querySelectorAll(`input[name="mc${idx}"]`);
        radios.forEach(r => {
            r.addEventListener("change", () => {
                const selected = document.querySelector(`input[name="mc${idx}"]:checked`);
                const fbDiv = document.getElementById(`mc-${idx}-fb`);
                if (selected) {
                    lsSet(getStorageKey(`unit${UNIT}_mc${idx}`), selected.value);
                    const isCorr = parseInt(selected.value) === q.correct;
                    if (fbDiv) {
                        fbDiv.className = `feedback ${isCorr ? "correct" : "incorrect"}`;
                        fbDiv.innerHTML = isCorr ? q.correctFeedback : q.incorrectFeedback;
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
                lsSet(getStorageKey(`unit${UNIT}_sa${idx}`), ta.value);
            });
        }
    });
    document.querySelectorAll(".check-kw-btn").forEach(function(btn){
        btn.addEventListener("click", function(){ checkSA(parseInt(btn.getAttribute("data-sa"), 10)); });
    });
}

function restoreAnswers() {
    mcQuestions.forEach((q, idx) => {
        const saved = lsGet(getStorageKey(`unit${UNIT}_mc${idx}`));
        if (saved !== null) {
            const radio = document.querySelector(`input[name="mc${idx}"][value="${saved}"]`);
            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change'));
            }
        }
    });
    saQuestions.forEach((q, idx) => {
        const saved = lsGet(getStorageKey(`unit${UNIT}_sa${idx}`));
        if (saved !== null) {
            const ta = document.getElementById(`sa-${idx}`);
            if (ta) ta.value = saved;
        }
    });
}


// --- Q24 smart keyword matcher (word-boundary regex). Added by fairness pass. ---
function kwHit(answer, kw) {
    if (!kw) return false;
    var a = (answer || "").toLowerCase();
    var k = kw.toLowerCase().trim();
    if (!k) return false;
    var esc = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // unicode-aware-ish boundary: not preceded/followed by a letter or digit
    var L = "0-9a-zA-Záéíóúüñ";
    var re;
    if (k.length <= 4) {
        re = new RegExp("(?:^|[^" + L + "])" + esc + "(?![" + L + "])");
    } else {
        re = new RegExp("(?:^|[^" + L + "])" + esc);
    }
    return re.test(a);
}


function checkSA(idx) {
    var ta = document.getElementById("sa-" + idx);
    var fbDiv = document.getElementById("sa-" + idx + "-fb");
    if (!ta || !fbDiv) return;
    var lang = document.body.className.replace("lang-", "");
    var isEs = lang === "es";
    var answer = (ta.value || "").trim();
    if (!answer) {
        fbDiv.className = "feedback";
        fbDiv.innerHTML = isEs ? "Escriba su respuesta primero, luego verifique." : "Write your answer first, then check.";
        return;
    }
    var keywords = isEs ? saQuestions[idx].kw_es : saQuestions[idx].kw_en;
    if (lang === "both") keywords = [].concat(saQuestions[idx].kw_en, saQuestions[idx].kw_es);
    var hits = keywords.filter(function(kw){ return kwHit(answer, kw); }).length;
    var passed = hits >= 3 && answer.length >= 100;
    fbDiv.className = "feedback " + (passed ? "correct" : "incorrect");
    var _model = isEs ? saQuestions[idx].explanationEs : saQuestions[idx].explanationEn;
    var _hdr = isEs ? "Respuesta modelo — estúdiela" : "Model answer — study this";
    var _verdict = passed
        ? (isEs ? "Suficiente." : "Sufficient.")
        : (isEs ? ("Insuficiente — necesita ≥3 palabras clave y ≥100 caracteres. (" + hits + "/3)") : ("Insufficient — need ≥3 keywords and ≥100 chars. (" + hits + "/3)"));
    fbDiv.innerHTML = "<div>" + _verdict + "</div><div class=\"modelbox\"><strong>" + _hdr + ":</strong><br>" + _model + "</div>";
}

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
            fbDiv.innerHTML = isCorr ? ('<span class="lang-en">'+mcQuestions[i].correctFeedback+'</span><span class="lang-es">'+mcQuestions[i].correctFeedbackEs+'</span>') : ('<span class="lang-en">'+mcQuestions[i].incorrectFeedback+'</span><span class="lang-es">'+mcQuestions[i].incorrectFeedbackEs+'</span>');
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
            fbDiv.className = `feedback ${passed ? "correct" : "incorrect"}`;
            const _model = (lang === "es" ? saQuestions[i].explanationEs : saQuestions[i].explanationEn);
            const _hdr = (lang === "es" ? "Respuesta modelo — estúdiela" : "Model answer — study this");
            const _verdict = passed ? (lang === "es" ? "Suficiente." : "Sufficient.") : (lang === "es" ? "Insuficiente — necesita ≥3 palabras clave y ≥100 caracteres." : "Insufficient — need ≥3 keywords and ≥100 chars.");
            fbDiv.innerHTML = `<div>${_verdict}</div><div class="modelbox"><strong>${_hdr}:</strong><br>${_model}</div>`;
        }
        saPass = saCorrectCount >= PASS_SA;
    }

    const mcPass = mcCorrect >= PASS_MC;
    const overallPass = studentTrack === "cert" ? mcPass : (mcPass && saPass);

    if (overallPass) {
        lsSet(getStorageKey(`unit${UNIT}_passed`), "true");
        examPassed = true;
        const msg = document.body.className.includes("lang-es") ? `¡Aprobado! Redirigiendo a la siguiente unidad...` : `Passed! Redirecting to the next unit...`;
        alert(msg);
    } else {
        const lockoutTime = Date.now() + 15 * 60 * 1000;
        lsSet(getStorageKey(`unit${UNIT}_lockout`), lockoutTime);
        lockoutEnd = lockoutTime;
        showLockoutTimer();
        const failMsg = document.body.className.includes("lang-es") ? `No aprobado. Bloqueo de 15 minutos iniciado. (OM: ${mcCorrect}/20${studentTrack !== "cert" ? `, RC: ${saCorrectCount}/10` : ""})` : `Failed. 15-minute lockout started. (MC: ${mcCorrect}/20${studentTrack !== "cert" ? `, SA: ${saCorrectCount}/10` : ""})`;
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

function resetExam() {
    const isEs = document.body.className.includes("lang-es");
    const msg = isEs ? "¿Reiniciar todas las respuestas? Esto no se puede deshacer." : "Reset all answers? This cannot be undone.";
    if (confirm(msg)) {
        document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
        document.querySelectorAll('textarea').forEach(t => t.value = "");
        document.querySelectorAll('.feedback').forEach(f => { f.className = "feedback"; f.innerHTML = ""; });
        mcQuestions.forEach((q, idx) => lsDel(getStorageKey(`unit${UNIT}_mc${idx}`)));
        saQuestions.forEach((q, idx) => lsDel(getStorageKey(`unit${UNIT}_sa${idx}`)));
    }
}

document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => saveLanguage(btn.dataset.lang));
});
document.getElementById("submitBtn").addEventListener("click", gradeExam);
document.getElementById("resetBtn").addEventListener("click", resetExam);
document.getElementById("regSubmit").addEventListener("click", submitRegistration);

loadState();
renderQuestions();
if (lockoutEnd) showLockoutTimer();
