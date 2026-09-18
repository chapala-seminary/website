/* Exam engine for CTSRadical (shared by 2 unit pages).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/radical/unitN.js. */
var _ctsMem={};
  function lsGet(k){try{return localStorage.getItem(k);}catch(e){return (k in _ctsMem)?_ctsMem[k]:null;}}
  function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){_ctsMem[k]=String(v);}}
  function lsDel(k){try{localStorage.removeItem(k);}catch(e){delete _ctsMem[k];}}


const COURSE_PREFIX = "radical_v2";


const IS_LAST_UNIT = false;
const SHOW_REGISTRATION_CARD = false;
const CERT_URL = "CTSRadicalCertificate.html";
const STORAGE_PREFIX = "cts_radical_v2_progress";
const PASS_MC = 18;
const PASS_SA = 9;
const LOCKOUT_MINUTES = 15;
const REDIRECT_SECONDS = 3;

function getStorageKey(suffix) { return `${STORAGE_PREFIX}:${suffix}`; }





// ============================================
// LANGUAGE TOGGLE
// ============================================
function setLanguage(lang) {
    document.body.className = `lang-${lang}`;
    // Section 7 defensive fix: also set inline display directly on every lang-en/lang-es element
    document.querySelectorAll(".lang-en").forEach(el => {
        el.style.display = (lang === "es") ? "none" : "";
    });
    document.querySelectorAll(".lang-es").forEach(el => {
        el.style.display = (lang === "en") ? "none" : "";
    });
    document.querySelectorAll(".lang-btn").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
    lsSet(getStorageKey(`unit${UNIT}_lang`), lang);
}
document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});
(function loadLanguage() {
    const saved = lsGet(getStorageKey(`unit${UNIT}_lang`)) || "en";
    setLanguage(saved);
})();

// ============================================
// REGISTRATION (U1 only)
// ============================================
const regCard = document.getElementById("registrationCard");
if (!SHOW_REGISTRATION_CARD || lsGet("cts_student")) {
    if (regCard) regCard.style.display = "none";
}
document.getElementById("registerBtn").addEventListener("click", () => {
    const name = document.getElementById("studentName").value.trim();
    const track = document.getElementById("studentTrack").value;
    if (!name) {
        const msg = document.body.classList.contains("lang-es")
            ? "Por favor ingrese su nombre."
            : "Please enter your name.";
        alert(msg);
        return;
    }
    lsSet("cts_student", JSON.stringify({ name, track }));
    lsSet("cts_track", track);
    document.getElementById("regSaved").style.display = "block";
    setTimeout(() => { if (regCard) regCard.style.display = "none"; }, 1500);
});

// ============================================
// LOCKOUT CHECK
// ============================================
function checkLockout() {
    const lockExpiry = parseInt(lsGet(getStorageKey(`unit${UNIT}_lockout`)) || "0", 10);
    if (!lockExpiry || Date.now() >= lockExpiry) return false;
    const notice = document.getElementById("lockoutNotice");
    const countdown = document.getElementById("lockoutCountdown");
    notice.classList.add("active");
    document.getElementById("submitBtn").disabled = true;
    const tick = () => {
        const remaining = lockExpiry - Date.now();
        if (remaining <= 0) {
            notice.classList.remove("active");
            document.getElementById("submitBtn").disabled = false;
            lsDel(getStorageKey(`unit${UNIT}_lockout`));
            return;
        }
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        countdown.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
        setTimeout(tick, 1000);
    };
    tick();
    return true;
}

// ============================================
// RENDER QUESTIONS
// ============================================
function renderMC() {
    const container = document.getElementById("mcContainer");
    container.innerHTML = "";
    mcQuestions.forEach((q, idx) => {
        const div = document.createElement("div");
        div.className = "question";
        div.innerHTML = `
            <div class="question-text">${q.text}</div>
            <ul class="options">
                ${q.options.map((opt, i) => `
                    <li><label><input type="radio" name="mc_${idx}" value="${i}"> ${opt}</label></li>
                `).join("")}
            </ul>
            <div class="feedback" id="mcFeedback_${idx}"></div>
        `;
        container.appendChild(div);
        const revealMCQ = (chosen) => {
            const isRight = chosen === q.correct;
            document.querySelectorAll(`input[name="mc_${idx}"]`).forEach((inp2, i2) => {
                const li = inp2.closest('li');
                if (!li) return;
                li.classList.remove('correct-answer', 'wrong-pick');
                if (i2 === q.correct) li.classList.add('correct-answer');
                else if (i2 === chosen) li.classList.add('wrong-pick');
                inp2.disabled = true;
            });
            const feedbackBox = document.getElementById(`mcFeedback_${idx}`);
            if (feedbackBox) {
                feedbackBox.className = `feedback ${isRight ? "correct" : "incorrect"} show`;
                const label = isRight
                    ? (document.body.classList.contains("lang-es") ? "Correcto." : "Correct.")
                    : (document.body.classList.contains("lang-es") ? "Incorrecto." : "Incorrect.");
                feedbackBox.innerHTML = `<strong>${label}</strong>${isRight ? q.correctFeedback : q.incorrectFeedback}`;
            }
        };
        div.querySelectorAll(`input[name="mc_${idx}"]`).forEach(input => {
            input.addEventListener('change', function() {
                if (!this.checked) return;
                lsSet(getStorageKey(`unit${UNIT}_mc${idx}`), this.value);
                revealMCQ(parseInt(this.value));
            });
        });
        const saved = lsGet(getStorageKey(`unit${UNIT}_mc${idx}`));
        if (saved !== null) {
            const radio = div.querySelector(`input[name="mc_${idx}"][value="${saved}"]`);
            if (radio) {
                radio.checked = true;
                const li = radio.closest('li');
                if (li) li.classList.add('selected-neutral');
            }
        }
    });
}

function renderSA() {
    const container = document.getElementById("saContainer");
    container.innerHTML = `<h3 style="color:#4a1e3a;margin-top:2rem;margin-bottom:1rem;border-bottom:2px solid #d4af37;padding-bottom:0.4rem;"><span class="lang-en">Short-Answer Questions</span><span class="lang-es">Preguntas de Respuesta Corta</span></h3>`;
    saQuestions.forEach((q, idx) => {
        const div = document.createElement("div");
        div.className = "question";
        div.innerHTML = `
            <div class="question-text"><span class="lang-en">${q.promptEn}</span><span class="lang-es">${q.promptEs}</span></div>
            <textarea class="sa-input" id="${q.id}" data-idx="${idx}" placeholder="" aria-label="${q.id}"></textarea>
            <button class="sa-check-btn" data-idx="${idx}" type="button" style="margin-top:0.5rem;background:#4a1e3a;color:#d4af37;border:none;padding:0.4rem 1rem;cursor:pointer;font-weight:bold;border-radius:4px;font-family:inherit;font-size:0.9rem;"><span class="lang-en">Check Answer</span><span class="lang-es">Verificar</span></button>
            <div class="feedback" id="saFeedback_${idx}"></div>
        `;
        container.appendChild(div);
        const saved = lsGet(getStorageKey(`unit${UNIT}_sa${idx}`));
        if (saved !== null) div.querySelector("textarea").value = saved;
        // Per-question immediate feedback via Check Answer button (Joshua-style)
        div.querySelector('.sa-check-btn').addEventListener('click', function() {
            const ta = document.getElementById(q.id);
            const ans = (ta.value || '').toLowerCase().trim();
            const fb = document.getElementById(`saFeedback_${idx}`);
            const isEs = document.body.classList.contains('lang-es');
            lsSet(getStorageKey(`unit${UNIT}_sa${idx}`), ta.value);
            if (ans.length < 100) {
                fb.className = 'feedback incorrect show';
                const msg = isEs ? '✗ Escriba una respuesta más completa (al menos unas cuantas oraciones (unos 100 caracteres)).' : '✗ Please write a more complete answer (at least a few sentences (about 100 characters)).';
                fb.innerHTML = `<strong>${msg}</strong>`;
                return;
            }
            const keywords = isEs ? q.kw_es : q.kw_en;
            let matches = 0;
            for (const kw of keywords) {
                const kwLower = kw.toLowerCase();
                const kwWords = kwLower.split(/\s+/).filter(w => w.length > 2);
                const hits = kwWords.filter(w => ans.includes(w)).length;
                if (hits >= Math.max(1, Math.ceil(kwWords.length * 0.4))) matches++;
            }
            const threshold = Math.ceil(keywords.length * 0.4);
            const isRight = matches >= threshold;
            const expLabel = isEs ? 'Explicación modelo:' : 'Model explanation:';
            const verdict = isRight
                ? (isEs ? `✓ Correcto — respuesta sólida (${matches}/${keywords.length} conceptos clave).` : `✓ Correct — solid answer (${matches}/${keywords.length} key concepts).`)
                : (isEs ? `✗ Incorrecto — necesita al menos ${threshold} conceptos clave; obtuvo ${matches}.` : `✗ Incorrect — need at least ${threshold} key concepts; got ${matches}.`);
            fb.className = `feedback ${isRight ? 'correct' : 'incorrect'} show`;
            fb.innerHTML = `<strong>${verdict}</strong><div style="margin-top:0.4rem;"><em>${expLabel}</em><br>${isEs ? q.explanationEs : q.explanationEn}</div>`;
        });
    });
}

renderMC();
renderSA();
checkLockout();

// ============================================
// GRADING
// ============================================
function gradeMC() {
    let correct = 0;
    mcQuestions.forEach((q, idx) => {
        const selected = document.querySelector(`input[name="mc_${idx}"]:checked`);
        const feedbackBox = document.getElementById(`mcFeedback_${idx}`);
        // Section 7 fix: highlight correct option's li green; wrong pick's li red
        const allInputs = document.querySelectorAll(`input[name="mc_${idx}"]`);
        allInputs.forEach((input, i) => {
            const li = input.closest('li');
            if (!li) return;
            li.classList.remove('correct-answer', 'wrong-pick');
            if (i === q.correct) li.classList.add('correct-answer');
        });
        if (!selected) {
            feedbackBox.className = "feedback incorrect show";
            const noAns = document.body.classList.contains("lang-es") ? "Sin respuesta." : "No answer.";
            feedbackBox.innerHTML = `<strong>${noAns}</strong>${q.incorrectFeedback}`;
            return;
        }
        lsSet(getStorageKey(`unit${UNIT}_mc${idx}`), selected.value);
        const isRight = parseInt(selected.value, 10) === q.correct;
        if (!isRight) {
            const wrongLi = selected.closest('li');
            if (wrongLi) wrongLi.classList.add('wrong-pick');
        }
        feedbackBox.className = `feedback ${isRight ? "correct" : "incorrect"} show`;
        const label = isRight
            ? (document.body.classList.contains("lang-es") ? "Correcto." : "Correct.")
            : (document.body.classList.contains("lang-es") ? "Incorrecto." : "Incorrect.");
        feedbackBox.innerHTML = `<strong>${label}</strong>${isRight ? q.correctFeedback : q.incorrectFeedback}`;
        if (isRight) correct++;
    });
    return correct;
}

function gradeSA() {
    let correct = 0;
    const isEs = document.body.classList.contains("lang-es");
    saQuestions.forEach((q, idx) => {
        const ta = document.getElementById(q.id);
        const ans = (ta.value || "").toLowerCase().trim();
        lsSet(getStorageKey(`unit${UNIT}_sa${idx}`), ta.value);
        const feedbackBox = document.getElementById(`saFeedback_${idx}`);
        if (!ans) {
            feedbackBox.className = "feedback incorrect show";
            const noAns = isEs ? "Sin respuesta." : "No answer.";
            feedbackBox.innerHTML = `<strong>${noAns}</strong>${isEs ? q.explanationEs : q.explanationEn}`;
            return;
        }
        if (ans.length < 100) {
            feedbackBox.className = "feedback incorrect show";
            const tooShort = isEs ? "Respuesta demasiado breve (se requieren al menos 100 caracteres)." : "Answer too short (at least 100 characters required).";
            feedbackBox.innerHTML = `<strong>${tooShort}</strong>${isEs ? q.explanationEs : q.explanationEn}`;
            return;
        }
        const keywords = isEs ? q.kw_es : q.kw_en;
        let matches = 0;
        for (const kw of keywords) {
            const kwLower = kw.toLowerCase();
            const kwWords = kwLower.split(/\s+/).filter(w => w.length > 2);
            const hits = kwWords.filter(w => ans.includes(w)).length;
            if (hits >= Math.max(1, Math.ceil(kwWords.length * 0.4))) matches++;
        }
        const threshold = Math.ceil(keywords.length * 0.4);
        const isRight = matches >= threshold;
        feedbackBox.className = `feedback ${isRight ? "correct" : "partial"} show`;
        const label = isRight
            ? (isEs ? "Respuesta aceptable." : "Acceptable answer.")
            : (isEs ? "Respuesta parcial — vea la explicación modelo:" : "Partial answer — see the model explanation:");
        feedbackBox.innerHTML = `<strong>${label}</strong>${isEs ? q.explanationEs : q.explanationEn}`;
        if (isRight) correct++;
    });
    return correct;
}

// ============================================
// SUBMIT
// ============================================
document.getElementById("submitBtn").addEventListener("click", () => {
    const mcScore = gradeMC();
    const saScore = gradeSA();
    const track = lsGet("cts_track") || "cert";
    const isEs = document.body.classList.contains("lang-es");

    const mcBankKey = getStorageKey(`unit${UNIT}_mc_passed`);
    const mcBanked = lsGet(mcBankKey) === "true";
    let mcPass = mcBanked || (mcScore >= PASS_MC);
    if (mcPass) lsSet(mcBankKey, "true");
    let saPass = saScore >= PASS_SA;
    let overallPass = (track === "cert") ? mcPass : (mcPass && saPass);

    const results = document.getElementById("resultsSection");
    const verdictBox = document.getElementById("verdictBox");
    const scoreRow = document.getElementById("scoreRow");
    const redirectNotice = document.getElementById("redirectNotice");

    verdictBox.innerHTML = "";
    scoreRow.innerHTML = "";

    const verdict = document.createElement("div");
    verdict.className = `verdict ${overallPass ? "pass" : "fail"}`;
    if (overallPass) {
        verdict.textContent = isEs
            ? `¡Aprobado! Ha completado la Unidad ${UNIT} — pista ${track === "cert" ? "Certificado" : track === "thm" ? "Th.M." : "M.Div."}.`
            : `Passed! You have completed Unit ${UNIT} on the ${track === "cert" ? "Certificate" : track === "thm" ? "Th.M." : "M.Div."} track.`;
    } else {
        verdict.textContent = isEs
            ? "No aprobado. Revise las explicaciones, espere el bloqueo de 15 minutos y reintente." + (mcPass ? " (Su Opción Múltiple ya está aprobada — solo necesita reintentar la Respuesta Corta.)" : "")
            : "Not yet passed. Review the explanations, wait the 15-minute lockout, and retry." + (mcPass ? " (Your Multiple Choice is already passed — only the Short Answer needs retake.)" : "");
    }
    verdictBox.appendChild(verdict);

    const mcBox = document.createElement("div");
    mcBox.className = "score-box";
    mcBox.innerHTML = `<div class="label">${isEs ? "Opción Múltiple" : "Multiple Choice"}</div><div class="value">${mcScore} / 20</div><div class="threshold">${isEs ? "Necesario" : "Required"}: ${PASS_MC} / 20</div>`;
    scoreRow.appendChild(mcBox);

    if (track !== "cert") {
        const saBox = document.createElement("div");
        saBox.className = "score-box";
        saBox.innerHTML = `<div class="label">${isEs ? "Respuesta Corta" : "Short Answer"}</div><div class="value">${saScore} / 10</div><div class="threshold">${isEs ? "Necesario" : "Required"}: ${PASS_SA} / 10</div>`;
        scoreRow.appendChild(saBox);
    }

    results.classList.add("show");
    results.scrollIntoView({ behavior: "smooth", block: "start" });

    if (overallPass) {
        lsSet(getStorageKey(`unit${UNIT}_passed`), "true");
        const targetUrl = IS_LAST_UNIT ? CERT_URL : NEXT_URL;
        redirectNotice.innerHTML = isEs
            ? `Sus respuestas están marcadas arriba. Repáselas, luego <a href="${targetUrl}" style="color:#7a1f1f;font-weight:bold;">continúe →</a>`
            : `Your answers are marked above. Review them, then <a href="${targetUrl}" style="color:#7a1f1f;font-weight:bold;">continue →</a>`;
    } else {
        const lockUntil = Date.now() + LOCKOUT_MINUTES * 60 * 1000;
        lsSet(getStorageKey(`unit${UNIT}_lockout`), lockUntil.toString());
        setTimeout(checkLockout, 100);
    }
});

// ============================================
// RESET
// ============================================
document.getElementById("resetBtn").addEventListener("click", () => {
    const isEs = document.body.classList.contains("lang-es");
    const confirmMsg = isEs
        ? "¿Está seguro de que desea reiniciar todas las respuestas de esta unidad?"
        : "Are you sure you want to reset all answers for this unit?";
    if (!confirm(confirmMsg)) return;
    for (let i = 0; i < mcQuestions.length; i++) lsDel(getStorageKey(`unit${UNIT}_mc${i}`));
    for (let i = 0; i < saQuestions.length; i++) lsDel(getStorageKey(`unit${UNIT}_sa${i}`));
    lsDel(getStorageKey(`unit${UNIT}_passed`));
    lsDel(getStorageKey(`unit${UNIT}_mc_passed`));
    document.querySelectorAll(`input[type="radio"]`).forEach(r => r.checked = false);
    document.querySelectorAll(`textarea.sa-input`).forEach(t => t.value = "");
    document.querySelectorAll(".feedback").forEach(f => { f.className = "feedback"; f.innerHTML = ""; });
    document.querySelectorAll(".options li").forEach(li => li.classList.remove("correct-answer", "wrong-pick"));
    document.getElementById("resultsSection").classList.remove("show");
});
