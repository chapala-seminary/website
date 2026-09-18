/* Exam engine for CTSHermeneutics (shared by 11 unit pages).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/hermeneutics/unitN.js. */
// ============================================================
  // PER-UNIT CONFIG (the only block that changes between units)
  // ============================================================
  
  
  
  const TOTAL_UNITS = 11;
  
  const FINAL_REDIRECT_URL = "CTSHermeneuticsCertificate.html";
  // U1 only

  // ============================================================
  // ENGINE CONSTANTS (carried unchanged across units)
  // ============================================================
  const COURSE_CODE = "herm";
  const PROGRESS_KEY = "cts_herm_progress";
  const STUDENT_KEY = "cts_student";
  const TRACK_KEY = "cts_track";
  const UNIT_KEY = "cts_herm_u" + UNIT + "_passed";
  const MC_KEY = "cts_herm_u" + UNIT + "_mc_passed";
  const SA_KEY = "cts_herm_u" + UNIT + "_sa_passed";
  const STATE_KEY = "cts_herm_u" + UNIT + "_state";
  const LOCKOUT_KEY = "cts_herm_u" + UNIT + "_lockout";
  const LOCKOUT_SCOPE_KEY = "cts_herm_u" + UNIT + "_lockout_scope";
  const MC_PASS = 18;
  const SA_PASS = 9;
  const LOCKOUT_MS = 15 * 60 * 1000;
  const REDIRECT_MS = 3000;

  // ============================================================
  // MULTIPLE-CHOICE QUESTIONS (exactly 20; A=5, B=5, C=5, D=5)
  // ============================================================
  

  // ============================================================
  // SHORT-ANSWER QUESTIONS (10; split kw_en / kw_es)
  // ============================================================
  

  // ============================================================
  // ENGINE
  // ============================================================
  function getCurrentLang(){ return document.body.classList.contains("lang-es") ? "es" : "en"; }

  function toggleLang(){
    if (document.body.classList.contains("lang-en")){
      document.body.classList.remove("lang-en");
      document.body.classList.add("lang-es");
    } else {
      document.body.classList.remove("lang-es");
      document.body.classList.add("lang-en");
    }
  }

  // ---------- Registration ----------
  function loadRegistration(){
    if (!SHOW_REGISTRATION){
      const card = document.getElementById("registration-card");
      if (card) card.classList.add("hidden");
      return;
    }
    const raw = localStorage.getItem(STUDENT_KEY);
    if (raw){
      try {
        const s = JSON.parse(raw);
        document.getElementById("reg-name").value = s.name || "";
        document.getElementById("reg-email").value = s.email || "";
        document.getElementById("reg-church").value = s.church || "";
        document.getElementById("reg-status").textContent = (getCurrentLang()==="es")
          ? "Registrado como: " + (s.name || "(sin nombre)")
          : "Registered as: " + (s.name || "(no name)");
      } catch(e){}
    }
  }
  function saveRegistration(){
    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const church = document.getElementById("reg-church").value.trim();
    if (!name){
      document.getElementById("reg-status").style.color = "#8b3a2c";
      document.getElementById("reg-status").textContent = (getCurrentLang()==="es")
        ? "Por favor escriba su nombre completo."
        : "Please enter your full name.";
      return;
    }
    localStorage.setItem(STUDENT_KEY, JSON.stringify({name:name,email:email,church:church}));
    document.getElementById("reg-status").style.color = "#3a5a25";
    document.getElementById("reg-status").textContent = (getCurrentLang()==="es")
      ? "Guardado. Bienvenido, " + name + "."
      : "Saved. Welcome, " + name + ".";
  }

  // ---------- Track ----------
  function loadTrack(){
    const t = localStorage.getItem(TRACK_KEY) || "";
    if (t) setTrack(t,true);
    updateSANote();
    updateTrackNote();
  }
  function isMastersLevel(){
    var t = localStorage.getItem(TRACK_KEY);
    return t === "mdiv" || t === "thm";
  }
  function setTrack(t,silent){
    localStorage.setItem(TRACK_KEY,t);
    document.getElementById("track-cert-btn").classList.toggle("selected", t==="cert");
    document.getElementById("track-mdiv-btn").classList.toggle("selected", t==="mdiv");
    document.getElementById("track-thm-btn").classList.toggle("selected", t==="thm");
    // Short answer is available to ALL students. It is only scored for
    // masters tracks (see isMastersLevel/submitExam); Certificate students
    // may take it for practice with no effect on their result.
    document.getElementById("sa-container").classList.remove("hidden");
    updateSANote();
    updateTrackNote();
  }
  function updateSANote(){
    const t = localStorage.getItem(TRACK_KEY) || "";
    const note = document.getElementById("sa-note");
    if (!note) return;
    if (t==="mdiv" || t==="thm"){
      note.style.color = "#3a5a25";
      note.innerHTML = '<span class="lang-en">Counted toward your result: 9 of 10 required to pass.</span><span class="lang-es">Cuenta para su resultado: se requieren 9 de 10 para aprobar.</span>';
    } else {
      note.style.color = "#7a5a3a";
      note.innerHTML = '<span class="lang-en">Open to all students. For Certificate students this section is for practice and is not counted toward your result.</span><span class="lang-es">Disponible para todos los estudiantes. Para estudiantes de Certificado esta sección es de práctica y no cuenta para su resultado.</span>';
    }
  }

  function updateTrackNote(){
    const t = localStorage.getItem(TRACK_KEY) || "";
    const note = document.getElementById("exam-track-note");
    if (!t){
      note.innerHTML = '<span class="lang-en">Choose a track above to begin the exam.</span><span class="lang-es">Escoja una modalidad arriba para comenzar el examen.</span>';
    } else if (t==="cert"){
      note.innerHTML = '<span class="lang-en">Certificate track: 20 multiple-choice questions. Pass at 18 of 20.</span><span class="lang-es">Modalidad Certificado: 20 preguntas de opción múltiple. Aprobación con 18 de 20.</span>';
    } else if (t==="thm"){
      note.innerHTML = '<span class="lang-en">Th.M track: 20 multiple-choice (18 to pass) AND 10 short-answer (9 to pass), independently scored.</span><span class="lang-es">Modalidad Maestría en Teología: 20 de opción múltiple (18 para aprobar) Y 10 de respuesta breve (9 para aprobar), evaluadas de forma independiente.</span>';
    } else {
      note.innerHTML = '<span class="lang-en">M.Div track: 20 multiple-choice (18 to pass) AND 10 short-answer (9 to pass), independently scored.</span><span class="lang-es">Modalidad Maestría: 20 de opción múltiple (18 para aprobar) Y 10 de respuesta breve (9 para aprobar), evaluadas de forma independiente.</span>';
    }
  }

  // ---------- Lockout ----------
  function checkLockout(){
    const lockedUntil = parseInt(localStorage.getItem(LOCKOUT_KEY)||"0",10);
    const scope = localStorage.getItem(LOCKOUT_SCOPE_KEY) || "full";
    const now = Date.now();
    if (lockedUntil > now){
      const exam = document.getElementById("exam-section");
      const lock = document.getElementById("lockout-block");
      // If lockout is SA-only and MC is banked, hide only SA. Else hide whole exam.
      if (scope === "sa"){
        document.getElementById("mc-container").classList.add("hidden");
        document.getElementById("sa-container").classList.add("hidden");
        document.getElementById("submit-btn").classList.add("hidden");
      } else {
        exam.classList.add("hidden");
      }
      lock.classList.remove("hidden");
      document.getElementById("lockout-scope").innerHTML = (scope==="sa")
        ? '<span class="lang-en">Multiple-choice score has been banked. Short-answer retake available after lockout.</span><span class="lang-es">El puntaje de opción múltiple está guardado. El reintento de respuesta breve estará disponible después del bloqueo.</span>'
        : '<span class="lang-en">Both sections must be retaken.</span><span class="lang-es">Ambas secciones deben volver a tomarse.</span>';
      runLockoutTimer(lockedUntil);
      return true;
    } else if (lockedUntil > 0){
      // Lockout expired — clear
      localStorage.removeItem(LOCKOUT_KEY);
      localStorage.removeItem(LOCKOUT_SCOPE_KEY);
    }
    return false;
  }
  function runLockoutTimer(until){
    const el = document.getElementById("lockout-timer");
    function tick(){
      const remain = until - Date.now();
      if (remain <= 0){ location.reload(); return; }
      const m = Math.floor(remain/60000);
      const s = Math.floor((remain%60000)/1000);
      el.textContent = m + ":" + (s<10?"0":"") + s;
      setTimeout(tick,1000);
    }
    tick();
  }

  // ---------- Render questions ----------
  function renderMCQuestions(){
    const c = document.getElementById("mc-questions");
    c.innerHTML = "";
    mcQuestions.forEach((q,i)=>{
      const div = document.createElement("div");
      div.className = "question";
      div.id = "mc-q-" + i;
      let html = '<p class="qtext"><span class="lang-en">'+q.textEn+'</span><span class="lang-es">'+q.textEs+'</span></p>';
      const letters = ["A","B","C","D"];
      letters.forEach((L,idx)=>{
        const id = "mc-"+i+"-"+L;
        html += '<label class="option" id="opt-'+i+'-'+L+'">'
          + '<input type="radio" name="mc-'+i+'" value="'+L+'" onchange="onMCChange('+i+',\''+L+'\')">'
          + '<span class="lang-en">'+q.optionsEn[idx]+'</span>'
          + '<span class="lang-es">'+q.optionsEs[idx]+'</span>'
          + '</label>';
      });
      html += '<div class="feedback hidden" id="fb-'+i+'"></div>';
      div.innerHTML = html;
      c.appendChild(div);
    });
  }
  function renderSAQuestions(){
    const c = document.getElementById("sa-questions");
    c.innerHTML = "";
    kwQuestions.forEach((q,i)=>{
      const div = document.createElement("div");
      div.className = "question";
      div.id = "sa-q-" + i;
      div.innerHTML = '<p class="qtext"><span class="lang-en">'+q.textEn+'</span><span class="lang-es">'+q.textEs+'</span></p>'
        + '<textarea id="sa-'+i+'" oninput="onSAInput('+i+')" placeholder="" aria-label="sa"></textarea>'
        + '<button type="button" class="btn sa-check-btn" onclick="checkSA('+i+')">'
        + '<span class="lang-en">Check answer</span><span class="lang-es">Verificar respuesta</span></button>'
        + '<div class="sa-feedback" id="sa-fb-'+i+'"></div>'
        + '<div class="sa-model hidden" id="sa-model-'+i+'"></div>';
      c.appendChild(div);
    });
  }

  // ---------- Save / restore state ----------
  function saveState(){
    const state = {mc:{}, sa:{}};
    mcQuestions.forEach((q,i)=>{
      const sel = document.querySelector('input[name="mc-'+i+'"]:checked');
      if (sel) state.mc[i] = sel.value;
    });
    kwQuestions.forEach((q,i)=>{
      const el = document.getElementById("sa-"+i);
      if (el && el.value) state.sa[i] = el.value;
    });
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }
  function restoreState(){
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return;
    try {
      const state = JSON.parse(raw);
      Object.keys(state.mc||{}).forEach(i=>{
        const v = state.mc[i];
        const radio = document.querySelector('input[name="mc-'+i+'"][value="'+v+'"]');
        if (radio){ radio.checked = true; }
      });
      Object.keys(state.sa||{}).forEach(i=>{
        const el = document.getElementById("sa-"+i);
        if (el){ el.value = state.sa[i]; renderSAFeedback(parseInt(i,10)); }
      });
    } catch(e){}
  }

  // ---------- MC / SA change handlers ----------
  function onMCChange(i, value){
    saveState();
    renderMCFeedback(i, value);
    var rs = document.getElementsByName("mc-"+i);
    for (var ri=0; ri<rs.length; ri++) rs[ri].disabled = true;
  }
  function renderMCFeedback(i,value){
    const q = mcQuestions[i];
    const fb = document.getElementById("fb-"+i);
    const isCorrect = (value === q.correct);
    // Clear previous highlights
    ["A","B","C","D"].forEach(L=>{
      const opt = document.getElementById("opt-"+i+"-"+L);
      opt.classList.remove("correct-answer","wrong-answer");
    });
    if (isCorrect){
      document.getElementById("opt-"+i+"-"+value).classList.add("correct-answer");
      fb.className = "feedback correct";
      fb.innerHTML = '<span class="lang-en">'+q.correctFeedbackEn+'</span><span class="lang-es">'+q.correctFeedbackEs+'</span>';
    } else {
      document.getElementById("opt-"+i+"-"+value).classList.add("wrong-answer");
      document.getElementById("opt-"+i+"-"+q.correct).classList.add("correct-answer");
      fb.className = "feedback incorrect";
      fb.innerHTML = '<span class="lang-en">'+q.incorrectFeedbackEn+'</span><span class="lang-es">'+q.incorrectFeedbackEs+'</span>';
    }
    fb.classList.remove("hidden");
  }
  function onSAInput(i){
    saveState();
    renderSAFeedback(i);
  }
  // Smart keyword matcher: short keywords (<=4 chars) match as whole words;
  // longer keywords match as a left-anchored prefix (catches inflections).
  function kwHit(text, kw){
    text = (text||"").toLowerCase();
    kw = (kw||"").toLowerCase();
    const esc = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = (kw.length <= 4) ? new RegExp("\\b"+esc+"\\b") : new RegExp("\\b"+esc);
    return re.test(text);
  }
  function gradeSA(i){
    const q = kwQuestions[i];
    const el = document.getElementById("sa-"+i);
    const text = (el ? el.value : "").toLowerCase();
    if (text.length < 100) return false;
    const kws = (getCurrentLang()==="es") ? q.kw_es : q.kw_en;
    let hits = 0;
    kws.forEach(k=>{ if (kwHit(text, k)) hits++; });
    return hits >= 3;
  }
  // Reveal the gold model-answer box under every short-answer question after submit.
  function revealModel(i){
    const q = kwQuestions[i];
    const box = document.getElementById("sa-model-"+i);
    if (!box) return;
    box.innerHTML =
      '<div class="sa-model-label"><span class="lang-en">Correct answer</span><span class="lang-es">Respuesta correcta</span></div>'
      + '<span class="lang-en">'+q.modelEn+'</span><span class="lang-es">'+q.modelEs+'</span>';
    box.classList.remove("hidden");
  }

  function checkSA(i){
    // Available to every track: show keyword/length feedback and reveal the
    // model answer for this one question. Does not submit or score the exam.
    renderSAFeedback(i);
    const el = document.getElementById("sa-"+i);
    const text = (el ? el.value : "").toLowerCase();
    if (text.length >= 100) revealModel(i);
  }

  function revealModels(){
    kwQuestions.forEach((q,i)=>{ revealModel(i); });
  }
  function renderSAFeedback(i){
    const fb = document.getElementById("sa-fb-"+i);
    if (!fb) return;
    const el = document.getElementById("sa-"+i);
    const text = el ? el.value : "";
    if (text.length === 0){
      fb.className = "sa-feedback fail";
      fb.innerHTML = '<span class="lang-en">✗ No answer yet. Type your answer, then check it against the correct answer below.</span><span class="lang-es">✗ Aún no hay respuesta. Escriba su respuesta y compárela con la respuesta correcta abajo.</span>';
      return;
    }
    if (text.length < 100){
      fb.className = "sa-feedback fail";
      fb.innerHTML = '<span class="lang-en">✗ Incorrect — answer too short (at least a few sentences (about 100 characters)). Compare with the correct answer below.</span><span class="lang-es">✗ Incorrecto: la respuesta es demasiado corta (al menos unas cuantas oraciones (unos 100 caracteres)). Compare con la respuesta correcta abajo.</span>';
      return;
    }
    if (gradeSA(i)){
      fb.className = "sa-feedback pass";
      fb.innerHTML = '<span class="lang-en">✓ Correct — your answer includes the key concepts. Compare it with the correct answer below.</span><span class="lang-es">✓ Correcto: su respuesta incluye los conceptos clave. Compárela con la respuesta correcta abajo.</span>';
    } else {
      fb.className = "sa-feedback fail";
      fb.innerHTML = '<span class="lang-en">✗ Not yet — your answer is missing key concepts from the lesson. Study the correct answer below.</span><span class="lang-es">✗ Todavía no: a su respuesta le faltan conceptos clave de la lección. Estudie la respuesta correcta abajo.</span>';
    }
  }

  // ---------- Submit ----------
  function submitExam(){
    const track = localStorage.getItem(TRACK_KEY);
    if (!track){
      alert(getCurrentLang()==="es" ? "Por favor escoja una modalidad antes de enviar." : "Please choose a track before submitting.");
      return;
    }
    const student = localStorage.getItem(STUDENT_KEY);
    if (SHOW_REGISTRATION && !student){
      alert(getCurrentLang()==="es" ? "Por favor complete el registro antes de enviar." : "Please complete registration before submitting.");
      return;
    }

    // Score MC
    let mcScore = 0;
    mcQuestions.forEach((q,i)=>{
      const sel = document.querySelector('input[name="mc-'+i+'"]:checked');
      if (sel){
        renderMCFeedback(i, sel.value);
        if (sel.value === q.correct) mcScore++;
      } else {
        // Mark unanswered as wrong by showing correct answer
        const fb = document.getElementById("fb-"+i);
        ["A","B","C","D"].forEach(L=>{
          const opt = document.getElementById("opt-"+i+"-"+L);
          opt.classList.remove("correct-answer","wrong-answer");
        });
        document.getElementById("opt-"+i+"-"+q.correct).classList.add("correct-answer");
        fb.className = "feedback incorrect";
        fb.innerHTML = '<span class="lang-en">No answer given. '+q.incorrectFeedbackEn+'</span><span class="lang-es">No se dio respuesta. '+q.incorrectFeedbackEs+'</span>';
        fb.classList.remove("hidden");
      }
    });
    const mcBanked = localStorage.getItem(MC_KEY) === "true";
    const mcPassed = mcBanked || (mcScore >= MC_PASS);

    let saScore = 0;
    if (isMastersLevel()){
      kwQuestions.forEach((q,i)=>{
        renderSAFeedback(i);
        if (gradeSA(i)) saScore++;
      });
      revealModels();
    }
    const saPassed = isMastersLevel() ? (saScore >= SA_PASS) : true;

    // Persist MC pass (banking)
    if (mcPassed){
      localStorage.setItem(MC_KEY,"true");
    }
    if (isMastersLevel() && saPassed){
      localStorage.setItem(SA_KEY,"true");
    }

    const fullPassed = mcPassed && saPassed;
    if (fullPassed){
      localStorage.setItem(UNIT_KEY,"true");
      // Update progress JSON
      let progress = {};
      try { progress = JSON.parse(localStorage.getItem(PROGRESS_KEY)||"{}"); } catch(e){}
      progress["unit"+UNIT] = true;
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } else {
      // Determine lockout scope
      if (!mcPassed){
        localStorage.setItem(LOCKOUT_KEY, String(Date.now() + LOCKOUT_MS));
        localStorage.setItem(LOCKOUT_SCOPE_KEY, "full");
      } else if (isMastersLevel() && !saPassed){
        localStorage.setItem(LOCKOUT_KEY, String(Date.now() + LOCKOUT_MS));
        localStorage.setItem(LOCKOUT_SCOPE_KEY, "sa");
      }
    }

    showResults(track, mcScore, mcPassed, saScore, saPassed, fullPassed);
  }

  function showResults(track, mcScore, mcPassed, saScore, saPassed, fullPassed){
    const block = document.getElementById("results-block");
    block.classList.remove("hidden");
    block.className = "results " + (fullPassed ? "pass" : "fail");
    let html = '<h2><span class="lang-en">Results</span><span class="lang-es">Resultados</span></h2>';
    html += '<p><strong><span class="lang-en">Multiple-Choice:</span><span class="lang-es">Opción múltiple:</span></strong> '+mcScore+' / 20 — '
      + (mcPassed
          ? '<span class="lang-en" style="color:#3a5a25;font-weight:600">PASS</span><span class="lang-es" style="color:#3a5a25;font-weight:600">APROBADO</span>'
          : '<span class="lang-en" style="color:#7a2618;font-weight:600">FAIL</span><span class="lang-es" style="color:#7a2618;font-weight:600">REPROBADO</span>')
      + '</p>';
    if (isMastersLevel()){
      html += '<p><strong><span class="lang-en">Short-Answer:</span><span class="lang-es">Respuesta breve:</span></strong> '+saScore+' / 10 — '
        + (saPassed
            ? '<span class="lang-en" style="color:#3a5a25;font-weight:600">PASS</span><span class="lang-es" style="color:#3a5a25;font-weight:600">APROBADO</span>'
            : '<span class="lang-en" style="color:#7a2618;font-weight:600">FAIL</span><span class="lang-es" style="color:#7a2618;font-weight:600">REPROBADO</span>')
        + '</p>';
    }
    if (fullPassed){
      const nextUrl = IS_FINAL_UNIT ? FINAL_REDIRECT_URL : NEXT_UNIT_URL;
      const label = IS_FINAL_UNIT
        ? '<span class="lang-en">View Certificate \u2192</span><span class="lang-es">Ver Certificado \u2192</span>'
        : '<span class="lang-en">Continue to Unit '+(UNIT+1)+' \u2192</span><span class="lang-es">Continuar a la Unidad '+(UNIT+1)+' \u2192</span>';
      const note = '<span class="lang-en">Passed. Study the model answers above before you continue.</span><span class="lang-es">Aprobado. Estudie las respuestas modelo de arriba antes de continuar.</span>';
      html += '<p style="font-weight:600">'+note+'</p>'
            + '<p><a class="btn" href="'+nextUrl+'">'+label+'</a></p>';
    } else {
      const scope = localStorage.getItem(LOCKOUT_SCOPE_KEY);
      const lockMsg = (scope==="sa")
        ? '<span class="lang-en">Multiple-choice has been banked. Review the lesson and retake the short-answer section after the 15-minute lockout.</span><span class="lang-es">La sección de opción múltiple ha sido guardada. Repase la lección y vuelva a tomar la sección de respuesta breve después del bloqueo de 15 minutos.</span>'
        : '<span class="lang-en">Review the lesson and retake the exam after the 15-minute lockout.</span><span class="lang-es">Repase la lección y vuelva a tomar el examen después del bloqueo de 15 minutos.</span>';
      const study = '<span class="lang-en"> Study the model answers above while you wait.</span><span class="lang-es"> Estudie las respuestas modelo de arriba mientras espera.</span>';
      html += '<p style="font-weight:600">'+lockMsg+study+'</p>';
      // No auto-reload: keep the model answers visible. The lockout is enforced on the next submit.
    }
    block.innerHTML = html;
    block.scrollIntoView({behavior:"smooth"});
  }

  function resetExam(){
    const msg = (getCurrentLang()==="es")
      ? "¿Está seguro de que desea reiniciar? Esto borrará todas sus respuestas en esta unidad."
      : "Are you sure you want to reset? This will clear all your answers in this unit.";
    if (!confirm(msg)) return;
    localStorage.removeItem(STATE_KEY);
    // Do NOT clear MC banking, lockout, or progress on reset — that is a separate action.
    location.reload();
  }

  // ---------- Progress grid ----------
  function renderProgressGrid(){
    const grid = document.getElementById("progress-grid");
    let progress = {};
    try { progress = JSON.parse(localStorage.getItem(PROGRESS_KEY)||"{}"); } catch(e){}
    for (let u=1; u<=TOTAL_UNITS; u++){
      const pill = document.createElement("div");
      pill.className = "pill";
      if (progress["unit"+u]) pill.classList.add("done");
      if (u === UNIT) pill.classList.add("current");
      pill.textContent = "U"+u;
      grid.appendChild(pill);
    }
  }

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", function(){
    renderProgressGrid();
    loadRegistration();
    loadTrack();
    renderMCQuestions();
    renderSAQuestions();
    if (!checkLockout()){
      restoreState();
    }
  });
