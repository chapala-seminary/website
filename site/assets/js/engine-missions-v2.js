/* Exam engine for CTSMissions (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/missions/unitN.js. */
const TOTAL_UNITS = 10;



// === MC + SA data ===
const mcQuestions = [
    { textEn: "1. Missions ultimately began:", textEs: "1. Las misiones, en última instancia, comenzaron:", optionsEn: ["with William Carey's missionary society", "in the heart of God in eternity", "with the Great Commission in Galilee", "at the day of Pentecost"], optionsEs: ["con la sociedad misionera de William Carey", "en el corazón de Dios en la eternidad", "con la Gran Comisión en Galilea", "en el día de Pentecostés"], correct: 1 },
    { textEn: "2. The Latin phrase missio Dei means:", textEs: "2. La frase latina missio Dei significa:", optionsEn: ["the great commission", "the program of the local church", "the sending of financial support", "the mission of God"], optionsEs: ["la gran comisión", "el programa de la iglesia local", "el envío de apoyo financiero", "la misión de Dios"], correct: 3 },
    { textEn: "3. According to John 20:21, the risen Christ sends His church just as:", textEs: "3. Según Juan 20:21, el Cristo resucitado envía a su iglesia así como:", optionsEn: ["the Father sent Him", "the prophets were sent to Israel", "Moses was sent to Egypt", "the angels are sent to serve"], optionsEs: ["el Padre lo envió a Él", "los profetas fueron enviados a Israel", "Moisés fue enviado a Egipto", "los ángeles son enviados a servir"], correct: 0 },
    { textEn: "4. The lesson teaches that the ultimate goal of missions is:", textEs: "4. La lección enseña que la meta suprema de las misiones es:", optionsEn: ["the numerical growth of the church", "the relief of poverty and suffering", "the glory of God among all the nations", "the rescue of the lost and nothing more"], optionsEs: ["el crecimiento numérico de la iglesia", "el alivio de la pobreza y el sufrimiento", "la gloria de Dios entre todas las naciones", "el rescate de los perdidos y nada más"], correct: 2 },
    { textEn: "5. Habakkuk 2:14 promises that the earth will be filled with the knowledge of:", textEs: "5. Habacuc 2:14 promete que la tierra será llena del conocimiento de:", optionsEn: ["lasting political peace", "the law of Moses", "human progress", "the glory of the LORD"], optionsEs: ["la paz política duradera", "la ley de Moisés", "el progreso humano", "la gloria de Jehová"], correct: 3 },
    { textEn: "6. In Revelation 5:9 the redeemed before the Lamb are gathered from:", textEs: "6. En Apocalipsis 5:9 los redimidos delante del Cordero son reunidos de:", optionsEn: ["the nation of Israel only", "every tribe, tongue, people, and nation", "the wealthiest nations", "the apostolic generation only"], optionsEs: ["solo la nación de Israel", "todo linaje, lengua, pueblo y nación", "las naciones más ricas", "solo la generación apostólica"], correct: 1 },
    { textEn: "7. The lesson says that when the last of the redeemed is gathered in, missions will:", textEs: "7. La lección dice que cuando el último de los redimidos sea recogido, las misiones:", optionsEn: ["simply continue in heaven", "begin all over again", "be over forever, and only worship will remain", "be handed to the angels"], optionsEs: ["simplemente continuarán en el cielo", "comenzarán de nuevo", "habrán terminado para siempre, y solo quedará la adoración", "serán entregadas a los ángeles"], correct: 2 },
    { textEn: "8. Ephesians 2:12 describes those who are without Christ as:", textEs: "8. Efesios 2:12 describe a los que están sin Cristo como:", optionsEn: ["having no hope and without God in the world", "saved by their sincerity", "waiting for a second chance after death", "basically good at heart"], optionsEs: ["sin esperanza y sin Dios en el mundo", "salvos por su sinceridad", "esperando una segunda oportunidad después de la muerte", "buenos de corazón en lo esencial"], correct: 0 },
    { textEn: "9. Romans 3:23 declares that:", textEs: "9. Romanos 3:23 declara que:", optionsEn: ["only a few have sinned", "all have sinned and fall short of the glory of God", "only the Gentiles have sinned", "sin is merely an illusion"], optionsEs: ["solo unos pocos han pecado", "todos pecaron y están destituidos de la gloria de Dios", "solo los gentiles han pecado", "el pecado es solo una ilusión"], correct: 1 },
    { textEn: "10. In Romans 10:13–15, salvation comes by calling on the Lord — but calling requires believing, believing requires hearing, and hearing requires:", textEs: "10. En Romanos 10:13–15, la salvación viene por invocar al Señor — pero invocar requiere creer, creer requiere oír, y oír requiere:", optionsEn: ["a vision from God", "a generous gift", "a preacher who is sent", "a strong feeling"], optionsEs: ["una visión de Dios", "una ofrenda generosa", "un predicador que es enviado", "un sentimiento fuerte"], correct: 2 },
    { textEn: "11. The main point of the Romans 10 chain is that the unreached:", textEs: "11. El punto principal de la cadena de Romanos 10 es que los no alcanzados:", optionsEn: ["will be saved even without the gospel", "have no need of a preacher", "are not truly lost", "cannot believe in One they have never heard of"], optionsEs: ["serán salvos aun sin el evangelio", "no necesitan un predicador", "no están verdaderamente perdidos", "no pueden creer en Aquel de quien nunca han oído"], correct: 3 },
    { textEn: "12. Peter declared in Acts 4:12 that salvation is found in:", textEs: "12. Pedro declaró en Hechos 4:12 que la salvación se halla en:", optionsEn: ["no other name under heaven but Jesus", "sincere religion of any kind", "good works and charity", "many different names"], optionsEs: ["ningún otro nombre bajo el cielo sino Jesús", "la religión sincera de cualquier tipo", "las buenas obras y la caridad", "muchos nombres diferentes"], correct: 0 },
    { textEn: "13. In John 14:6, Jesus describes Himself as:", textEs: "13. En Juan 14:6, Jesús se describe a sí mismo como:", optionsEn: ["a great moral teacher", "one good way among many", "the way, the truth, and the life", "a prophet pointing to God"], optionsEs: ["un gran maestro moral", "un buen camino entre muchos", "el camino, la verdad y la vida", "un profeta que señala a Dios"], correct: 2 },
    { textEn: "14. According to 1 Timothy 2:5, there is one God and one Mediator, who is:", textEs: "14. Según 1 Timoteo 2:5, hay un solo Dios y un solo Mediador, que es:", optionsEn: ["the church speaking for God", "the apostle Peter", "the Holy Spirit", "the Man Christ Jesus"], optionsEs: ["la iglesia hablando por Dios", "el apóstol Pedro", "el Espíritu Santo", "Jesucristo hombre"], correct: 3 },
    { textEn: "15. Because there is only one Way to God, the lesson concludes that missions is:", textEs: "15. Porque hay un solo Camino a Dios, la lección concluye que las misiones son:", optionsEn: ["the most loving thing the church can do", "an optional activity for some", "a cruel and needless errand", "merely a matter of culture"], optionsEs: ["lo más amoroso que la iglesia puede hacer", "una actividad opcional para algunos", "un encargo cruel e innecesario", "meramente un asunto de cultura"], correct: 0 },
    { textEn: "16. 1 Timothy 2:4 teaches that God:", textEs: "16. 1 Timoteo 2:4 enseña que Dios:", optionsEn: ["desires only the elect to be saved", "desires all men to be saved and to come to the knowledge of the truth", "is indifferent to the nations", "wishes Israel alone to be saved"], optionsEs: ["desea que solo los elegidos sean salvos", "desea que todos los hombres sean salvos y vengan al conocimiento de la verdad", "es indiferente a las naciones", "desea que solo Israel sea salvo"], correct: 1 },
    { textEn: "17. 2 Peter 3:9 says the Lord is not willing that:", textEs: "17. 2 Pedro 3:9 dice que el Señor no quiere que:", optionsEn: ["the wicked should ever hear", "any should prosper", "any should perish, but that all should come to repentance", "the gospel should spread too quickly"], optionsEs: ["el impío jamás oiga", "ninguno prospere", "ninguno perezca, sino que todos vengan al arrepentimiento", "el evangelio se extienda demasiado rápido"], correct: 2 },
    { textEn: "18. According to 1 John 2:2, Christ is the propitiation:", textEs: "18. Según 1 Juan 2:2, Cristo es la propiciación:", optionsEn: ["for the elect only", "for the apostles only", "for Israel only", "for our sins, and also for the whole world"], optionsEs: ["solo por los elegidos", "solo por los apóstoles", "solo por Israel", "por nuestros pecados, y también por los de todo el mundo"], correct: 3 },
    { textEn: "19. The lesson teaches that the appointed door through which salvation is received is:", textEs: "19. La lección enseña que la puerta señalada por la cual se recibe la salvación es:", optionsEn: ["faith, for without faith it is impossible to please God", "baptism by itself", "good works", "membership in a church"], optionsEs: ["la fe, porque sin fe es imposible agradar a Dios", "el bautismo por sí solo", "las buenas obras", "la membresía en una iglesia"], correct: 0 },
    { textEn: "20. The closing challenge of the unit is that the God who sends:", textEs: "20. El desafío final de la unidad es que el Dios que envía:", optionsEn: ["has finished with the nations", "is sending still, and calls the church to go, send, and pray", "will gather the nations without using His church", "sends only trained professionals"], optionsEs: ["ha terminado con las naciones", "sigue enviando, y llama a la iglesia a ir, enviar y orar", "reunirá a las naciones sin usar a su iglesia", "envía solo a profesionales capacitados"], correct: 1 }
];



// === Language toggle (3-button group) ===
const langButtons = document.querySelectorAll('.lang-toggle-group button');
function setLang(lang) {
  document.body.classList.remove('lang-en','lang-es','lang-both');
  document.body.classList.add('lang-' + lang);
  langButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-lang') === lang));
}
langButtons.forEach(btn => btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang'))));

// === Student + Track ===
function readStudent() {
  try { return JSON.parse(localStorage.getItem('cts_student') || 'null'); } catch(e) { return null; }
}
function readTrack() {
  const t = localStorage.getItem('cts_track');
  if (t === 'cert' || t === 'mdiv' || t === 'thm') return t;
  const st = readStudent();
  if (st && st.track) return st.track;
  return 'cert';
}
function isMdiv() { const t = readTrack(); return t === 'mdiv' || t === 'thm'; }

// === Greeting + track badge ===
function applyStudentUI() {
  const student = readStudent();
  const isEs = document.body.classList.contains('lang-es');
  const greetEl = document.getElementById('studentGreeting');
  const warn = document.getElementById('regWarn');
  const slot = document.getElementById('trackBadgeSlot');
  if (student && student.name) {
    greetEl.innerHTML = '👋 ' + student.name;
    if (warn) warn.classList.add('hidden');
    const track = readTrack();
    const label = track === 'thm' ? 'Th.M.' : (track === 'mdiv' ? 'M.Div' : (isEs ? 'Certificado' : 'Certificate'));
    if (slot) slot.innerHTML = '<span class="track-badge">' + label + '</span>';
  } else {
    greetEl.innerHTML = '<span style="color:#5b3a1f;">' + (isEs ? 'Bienvenido a Misiones Mundiales' : 'Welcome to World Missions') + '</span>';
    if (warn) warn.classList.remove('hidden');
    if (slot) slot.innerHTML = '';
  }
}

// === Registration modal (U1 only) ===

function showRegModal() {
  const modal = document.getElementById('regModal');
  if (modal) modal.classList.remove('hidden');
}
function hideRegModal() {
  const modal = document.getElementById('regModal');
  if (modal) modal.classList.add('hidden');
}
const regModal = document.getElementById('regModal');
const openBtn = document.getElementById('openRegBtn');
const openBtn2 = document.getElementById('openRegBtn2');
const saveBtn = document.getElementById('regSaveBtn');
if (openBtn) openBtn.addEventListener('click', showRegModal);
if (openBtn2) openBtn2.addEventListener('click', showRegModal);
if (saveBtn) saveBtn.addEventListener('click', () => {
  const name = (document.getElementById('regName').value || '').trim();
  const email = (document.getElementById('regEmail').value || '').trim();
  const track = (document.querySelector('input[name="regTrack"]:checked') || {}).value || 'cert';
  const isEs = document.body.classList.contains('lang-es');
  if (!name) {
    alert(isEs ? 'Por favor ingrese su nombre completo.' : 'Please enter your full name.');
    return;
  }
  const rec = { name: name, email: email, track: track };
  try {
    localStorage.setItem('cts_student', JSON.stringify(rec));
    localStorage.setItem('cts_track', track);
  } catch(e) {}
  hideRegModal();
  applyStudentUI();
  applyExamState();
});
// Auto-open modal on U1 if no cts_student present
if (CURRENT_UNIT === 1 && !readStudent()) {
  showRegModal();
}


// === Progress grid ===
let progress = {};
try { progress = JSON.parse(localStorage.getItem('cts_missions_progress')) || {}; } catch(e) { progress = {}; }
function updateProgressGrid() {
  const grid = document.getElementById('progressGrid');
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 1; i <= TOTAL_UNITS; i++) {
    let cls = '';
    if (progress['unit' + i]) cls = 'completed';
    if (i === CURRENT_UNIT) cls += ' active';
    grid.innerHTML += '<a href="CTSMissionsUnit' + i + '.html" class="' + cls + '">' + i + '</a>';
  }
}
updateProgressGrid();
document.getElementById('prevUnitBtn').onclick = () => {};
document.getElementById('nextUnitBtn').onclick = () => { window.location.href = NEXT_URL; };

// === Per-unit state keys ===
const MC_PASSED_KEY = 'cts_missions_u' + CURRENT_UNIT + '_mc_passed';
const SA_PASSED_KEY = 'cts_missions_u' + CURRENT_UNIT + '_sa_passed';
const MC_SCORE_KEY = 'cts_missions_u' + CURRENT_UNIT + '_mc_score';
const LOCK_MC_KEY = 'cts_missions_u' + CURRENT_UNIT + '_lockout';
const LOCK_SA_KEY = 'cts_missions_u' + CURRENT_UNIT + '_sa_lockout';

function mcPassed() { return localStorage.getItem(MC_PASSED_KEY) === '1'; }
function saPassed() { return localStorage.getItem(SA_PASSED_KEY) === '1'; }
function activeLock() {
  const now = Date.now();
  const mc = parseInt(localStorage.getItem(LOCK_MC_KEY) || '0', 10);
  const sa = parseInt(localStorage.getItem(LOCK_SA_KEY) || '0', 10);
  if (mcPassed()) { if (now < sa) return { until: sa, scope: 'sa' }; }
  else { if (now < mc) return { until: mc, scope: 'mc' }; }
  return null;
}

// === Render MC ===
const mcContainer = document.getElementById('mcContainer');
mcQuestions.forEach((q, idx) => {
    /* CTS answer-shuffle (anti-gaming): randomize option order on each render */
    (function(){var _o=q.optionsEn,_s=q.optionsEs,_n=_o.length,_p=[],_k,_i,_j,_t;for(_k=0;_k<_n;_k++){_p.push(_k);}for(_i=_n-1;_i>0;_i--){_j=Math.floor(Math.random()*(_i+1));_t=_p[_i];_p[_i]=_p[_j];_p[_j]=_t;}q.optionsEn=_p.map(function(x){return _o[x];});q.optionsEs=_p.map(function(x){return _s[x];});q.correct=_p.indexOf(q.correct);})();
  const qDiv = document.createElement('div');
  qDiv.className = 'question';
  qDiv.id = 'mcq' + (idx + 1);
  let h = '<p class="q"><span class="lang-en">' + q.textEn + '</span><span class="lang-es">' + q.textEs + '</span></p>';
  for (let i = 0; i < 4; i++) {
    const letter = 'ABCD'[i];
    h += '<button class="option" data-mc="' + idx + '" data-opt="' + i + '" type="button">' +
         '<strong>' + letter + '.</strong> ' +
         '<span class="lang-en">' + q.optionsEn[i] + '</span><span class="lang-es">' + q.optionsEs[i] + '</span>' +
         '</button>';
  }
  mcContainer.appendChild(qDiv);
  qDiv.innerHTML = h;
  // Click handler on each option
  qDiv.querySelectorAll('.option').forEach(btn => {
    btn.addEventListener('click', () => {
      if (mcPassed()) return;
      if (qDiv.dataset.answered !== undefined && qDiv.dataset.answered !== '') return;
      const isEs = document.body.classList.contains('lang-es');
      const chosen = parseInt(btn.getAttribute('data-opt'), 10);
      const correct = q.correct;
      qDiv.dataset.answered = String(chosen);
      qDiv.querySelectorAll('.option').forEach(b => {
        const oi = parseInt(b.getAttribute('data-opt'), 10);
        b.classList.remove('correct','wrong'); b.style.background=''; b.style.borderColor=''; b.style.fontWeight='';
        if (oi === correct) b.classList.add('correct');
        else if (oi === chosen) b.classList.add('wrong');
      });
      const oldfb = qDiv.querySelector('.feedback-text'); if (oldfb) oldfb.remove();
      const fb = document.createElement('div');
      if (chosen === correct) { fb.className = 'feedback-text correct'; fb.textContent = isEs ? '✓ ¡Correcto!' : '✓ Correct!'; }
      else { const cL = 'ABCD'[correct]; fb.className = 'feedback-text incorrect'; fb.textContent = (isEs ? '✗ Incorrecto. Respuesta correcta: ' : '✗ Incorrect. Correct answer: ') + cL; }
      qDiv.appendChild(fb);
    });
  });
});

// === Smart keyword matcher (word-boundary, like the other CTS courses) ===
function kwHit(answer, kw){
  if(!kw) return false;
  var a=(answer||'').toLowerCase();
  var k=String(kw).toLowerCase().trim();
  if(!k) return false;
  var esc=k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  var L='0-9a-zA-Z\u00e1\u00e9\u00ed\u00f3\u00fa\u00fc\u00f1';
  var re = k.length<=3 ? new RegExp('(?:^|[^'+L+'])'+esc+'(?!['+L+'])') : new RegExp('(?:^|[^'+L+'])'+esc);
  return re.test(a);
}
function revealSAModel(idx){
  var q=kwQuestions[idx];
  var isEs=document.body.classList.contains('lang-es');
  var box=document.getElementById('saModel'+idx);
  if(!box) return;
  var head=isEs?'Respuesta modelo \u2014 est\u00fadiela':'Model answer \u2014 study this';
  box.innerHTML='<strong>'+head+':</strong><br>'+(isEs?(q.modelEs||''):(q.modelEn||''));
  box.style.display='block';
}

// === Render SA ===
const kwContainer = document.getElementById('kwContainer');
kwQuestions.forEach((q, idx) => {
  const qDiv = document.createElement('div');
  qDiv.className = 'question';
  qDiv.id = 'saq' + (idx + 1);
  qDiv.innerHTML =
    '<p class="q"><span class="lang-en">' + q.textEn + '</span><span class="lang-es">' + q.textEs + '</span></p>' +
    '<textarea class="kw-answer" data-sa="' + idx + '" placeholder=""></textarea>' +
    '<button class="small check-kw-btn" type="button"><span class="lang-en">Check Answer</span><span class="lang-es">Verificar</span></button>' +
    '<div class="feedback-text" id="saFb' + idx + '" style="display:none"></div>' +
    '<div class="sa-model" id="saModel' + idx + '" style="display:none"></div>';
  kwContainer.appendChild(qDiv);
  const btn = qDiv.querySelector('.check-kw-btn');
  const ta = qDiv.querySelector('.kw-answer');
  btn.addEventListener('click', () => {
    const isEs = document.body.classList.contains('lang-es');
    const fb = document.getElementById('saFb' + idx);
    const ans = (ta.value || '').trim();
    if(!ans){
      fb.className = 'feedback-text';
      fb.style.display = 'block';
      fb.textContent = isEs ? 'Escriba su respuesta primero, luego verifique.' : 'Write your answer first, then check.';
      var mb=document.getElementById('saModel'+idx); if(mb) mb.style.display='none';
      qDiv.dataset.answered = '0';
      return;
    }
    if(ans.length < 100){
      fb.className = 'feedback-text';
      fb.style.display = 'block';
      fb.textContent = isEs ? 'Escriba una respuesta m\u00e1s completa (al menos 100 caracteres) antes de verificar.' : 'Write a fuller answer (at least 100 characters) before checking.';
      var mb2=document.getElementById('saModel'+idx); if(mb2) mb2.style.display='none';
      qDiv.dataset.answered = '0';
      return;
    }
    const kws = isEs ? (q.kwEs || []) : (q.kwEn || []);
    let hits = 0;
    kws.forEach(k => { if (kwHit(ans, k)) hits++; });
    const ok = hits >= 3;
    qDiv.dataset.answered = ok ? '1' : '0';
    fb.className = 'feedback-text ' + (ok ? 'correct' : 'incorrect');
    fb.style.display = 'block';
    fb.textContent = ok
      ? (isEs ? ('\u2713 Suficientes palabras clave (' + hits + ').') : ('\u2713 Sufficient keywords (' + hits + ').'))
      : (isEs ? ('\u2717 A\u00fan no acreditada. Encontr\u00f3 ' + hits + ' de 3.') : ('\u2717 Not yet credited. Found ' + hits + ' of 3.'));
    revealSAModel(idx);
  });
});

// === UI state machine ===
const mcSection = document.getElementById('mcSection');
const saSection = document.getElementById('saSection');
const statusEl = document.getElementById('examStatus');
const submitBtn = document.getElementById('submitExamBtn');
const resetBtn = document.getElementById('resetExamBtn');
const resultEl = document.getElementById('examResult');

function setStatus(cls, en, es) {
  statusEl.className = 'exam-status ' + cls;
  statusEl.innerHTML = '<span class="lang-en">' + en + '</span><span class="lang-es">' + es + '</span>';
}
function clearStatus() { statusEl.className = 'exam-status hidden'; statusEl.innerHTML = ''; }
function lockMcAsReview() {
  document.querySelectorAll('#mcContainer .question').forEach(q => {
    q.classList.add('review-locked');
    q.querySelectorAll('.option').forEach(b => { b.disabled = true; });
  });
}

function revealMC() {
  const isEs = document.body.classList.contains('lang-es');
  for (let i = 0; i < mcQuestions.length; i++) {
    const qd = document.getElementById('mcq' + (i + 1));
    if (!qd) continue;
    const correct = mcQuestions[i].correct;
    const chosen = (qd.dataset.answered !== undefined && qd.dataset.answered !== '') ? parseInt(qd.dataset.answered, 10) : -1;
    qd.querySelectorAll('.option').forEach(b => {
      const oi = parseInt(b.getAttribute('data-opt'), 10);
      b.classList.remove('correct','wrong'); b.style.background=''; b.style.borderColor=''; b.style.fontWeight='';
      if (oi === correct) b.classList.add('correct');
      else if (oi === chosen) b.classList.add('wrong');
    });
    let fb = qd.querySelector('.feedback-text');
    if (!fb) { fb = document.createElement('div'); qd.appendChild(fb); }
    if (chosen === correct) { fb.className = 'feedback-text correct'; fb.textContent = isEs ? '✓ ¡Correcto!' : '✓ Correct!'; }
    else { const cL = 'ABCD'[correct]; fb.className = 'feedback-text incorrect'; fb.textContent = (isEs ? '✗ Incorrecto. Respuesta correcta: ' : '✗ Incorrect. Correct answer: ') + cL; }
  }
}


function applyExamState() {
  const isEs = document.body.classList.contains('lang-es');
  // SA section is ALWAYS visible
  saSection.style.display = '';
  const badgeEn = document.getElementById('saBadgeEn');
  const badgeEs = document.getElementById('saBadgeEs');
  const noteEn = document.getElementById('saNoteEn');
  const noteEs = document.getElementById('saNoteEs');
  if (isMdiv()) {
    badgeEn.textContent = 'Required for M.Div';
    badgeEs.textContent = 'Requerido para M.Div';
    noteEn.textContent = 'These 10 short-answer questions are required to complete Unit ' + CURRENT_UNIT + ' on the M.Div track. You must pass at 9 of 10.';
    noteEs.textContent = 'Estas 10 preguntas de respuesta corta son requeridas para completar la Unidad ' + CURRENT_UNIT + ' en la vía M.Div. Debe aprobar con 9 de 10.';
  } else {
    badgeEn.textContent = 'Self-study — not graded for Certificate';
    badgeEs.textContent = 'Auto-estudio — no cuenta para Certificado';
    noteEn.textContent = 'These are the M.Div-level questions. Certificate students are welcome to attempt them for self-check; your answers will not affect your Unit ' + CURRENT_UNIT + ' pass status.';
    noteEs.textContent = 'Estas son las preguntas de nivel M.Div. Los estudiantes de Certificado pueden intentarlas para auto-evaluarse; sus respuestas no afectarán el estado de aprobación de la Unidad ' + CURRENT_UNIT + '.';
  }
  const lock = activeLock();
  if (lock) {
    const minsLeft = Math.ceil((lock.until - Date.now()) / 60000);
    submitBtn.disabled = true;
    if (lock.scope === 'mc') {
      setStatus('locked',
        'Exam locked. Try again in ' + minsLeft + ' minute(s). The full exam will reset.',
        'Examen bloqueado. Intente de nuevo en ' + minsLeft + ' minuto(s). El examen completo se reiniciará.');
    } else {
      setStatus('locked',
        'Short-answer section locked. Try again in ' + minsLeft + ' minute(s). Multiple-choice pass is preserved.',
        'Sección de respuesta corta bloqueada. Intente de nuevo en ' + minsLeft + ' minuto(s). Su aprobación de opción múltiple se conserva.');
      lockMcAsReview();
    }
    setTimeout(applyExamState, 30000);
    return;
  }
  submitBtn.disabled = false;
  if (mcPassed()) {
    lockMcAsReview();
    if (isMdiv() && !saPassed()) {
      setStatus('mc-passed',
        'Multiple-choice passed (saved). Complete the 10 short-answer questions to finish Unit ' + CURRENT_UNIT + '.',
        'Opción múltiple aprobada (guardada). Complete las 10 preguntas de respuesta corta para terminar la Unidad ' + CURRENT_UNIT + '.');
    } else if (!isMdiv()) {
      setStatus('mc-passed',
        'Multiple-choice passed. Unit ' + CURRENT_UNIT + ' complete for Certificate track.',
        'Opción múltiple aprobada. Unidad ' + CURRENT_UNIT + ' completa para la vía Certificado.');
    } else {
      clearStatus();
    }
  } else {
    clearStatus();
  }
}

submitBtn.addEventListener('click', () => {
  const isEs = document.body.classList.contains('lang-es');
  const lock = activeLock();
  if (lock) { applyExamState(); return; }

  // Score MC
  let mc = 0;
  for (let i = 0; i < 20; i++) {
    const qd = document.getElementById('mcq' + (i + 1));
    if (qd && qd.dataset.answered !== undefined && parseInt(qd.dataset.answered, 10) === mcQuestions[i].correct) mc++;
  }
  if (mcPassed()) {
    mc = parseInt(localStorage.getItem(MC_SCORE_KEY) || '18', 10);
  }
  const mcPass = mc >= 18;
  revealMC();

  // Score SA
  let sa = 0;
  for (let i = 0; i < 10; i++) {
    const qd = document.getElementById('saq' + (i + 1));
    if (qd && qd.dataset.answered === '1') sa++;
  }
  const saPass = sa >= 9;

  if (!isMdiv()) {
    // Certificate track — only MC matters
    if (mcPass) {
      localStorage.setItem(MC_PASSED_KEY, '1');
      localStorage.setItem(MC_SCORE_KEY, String(mc));
      progress['unit' + CURRENT_UNIT] = true;
      localStorage.setItem('cts_missions_progress', JSON.stringify(progress));
      resultEl.style.color = '#1f6b3b';
      resultEl.textContent = (isEs
        ? '¡Aprobado! OM ' + mc + '/20. Unidad ' + CURRENT_UNIT + ' completa. Redirigiendo...'
        : 'Passed! MC ' + mc + '/20. Unit ' + CURRENT_UNIT + ' complete. Redirecting...');
    } else {
      localStorage.setItem(LOCK_MC_KEY, String(Date.now() + 15 * 60 * 1000));
      resultEl.style.color = '#8a1f1f';
      resultEl.textContent = (isEs
        ? 'Reprobado: OM ' + mc + '/20. Necesita 18. Bloqueado 15 min.'
        : 'Failed: MC ' + mc + '/20. Need 18. Locked 15 min.');
      submitBtn.disabled = true;
      setTimeout(applyExamState, 30000);
    }
    return;
  }

  // M.Div track
  if (!mcPassed()) {
    if (!mcPass) {
      localStorage.setItem(LOCK_MC_KEY, String(Date.now() + 15 * 60 * 1000));
      resultEl.style.color = '#8a1f1f';
      resultEl.textContent = (isEs
        ? 'Reprobado: OM ' + mc + '/20. Necesita 18. Bloqueado 15 min. Examen completo se reiniciará.'
        : 'Failed: MC ' + mc + '/20. Need 18. Locked 15 min. Full exam will reset.');
      submitBtn.disabled = true;
      setTimeout(applyExamState, 30000);
      return;
    }
    localStorage.setItem(MC_PASSED_KEY, '1');
    localStorage.setItem(MC_SCORE_KEY, String(mc));
  }
  if (saPass) {
    localStorage.setItem(SA_PASSED_KEY, '1');
    progress['unit' + CURRENT_UNIT] = true;
    localStorage.setItem('cts_missions_progress', JSON.stringify(progress));
    const finalMc = parseInt(localStorage.getItem(MC_SCORE_KEY) || '18', 10);
    resultEl.style.color = '#1f6b3b';
    resultEl.textContent = (isEs
      ? '¡Aprobado! OM ' + finalMc + '/20, RC ' + sa + '/10. Unidad ' + CURRENT_UNIT + ' completa. Redirigiendo...'
      : 'Passed! MC ' + finalMc + '/20, SA ' + sa + '/10. Unit ' + CURRENT_UNIT + ' complete. Redirecting...');
  } else {
    localStorage.setItem(LOCK_SA_KEY, String(Date.now() + 15 * 60 * 1000));
    resultEl.style.color = '#8a1f1f';
    resultEl.textContent = (isEs
      ? 'RC ' + sa + '/10. Necesita 9. Sección RC bloqueada 15 min. OM permanece aprobada.'
      : 'SA ' + sa + '/10. Need 9. SA section locked 15 min. MC pass preserved.');
    submitBtn.disabled = true;
    setTimeout(applyExamState, 30000);
  }
});

resetBtn.addEventListener('click', () => {
  const isEs = document.body.classList.contains('lang-es');
  const msg = isEs
    ? '¿Reiniciar la Unidad ' + CURRENT_UNIT + '? Esto borrará sus respuestas y el estado de aprobación de OM/RC para esta unidad. (Esto no borra su registro.)'
    : 'Reset Unit ' + CURRENT_UNIT + '? This will clear your answers and MC/SA pass state for this unit. (Does not clear your registration.)';
  if (!window.confirm(msg)) return;
  [MC_PASSED_KEY, SA_PASSED_KEY, LOCK_MC_KEY, LOCK_SA_KEY, MC_SCORE_KEY].forEach(k => localStorage.removeItem(k));
  if (progress['unit' + CURRENT_UNIT]) {
    delete progress['unit' + CURRENT_UNIT];
    localStorage.setItem('cts_missions_progress', JSON.stringify(progress));
  }
  window.location.reload();
});

// Initial render
applyStudentUI();
langButtons.forEach(b => b.addEventListener('click', applyStudentUI));
applyExamState();
