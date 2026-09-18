/* Exam engine for CTSBible (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/bible/unitN.js. */
/* ===== CTS "How We Got the Bible" — Unit 10 — immediate-feedback engine ===== */

function K(s){ return COURSE_PREFIX + s; }

let currentLang = localStorage.getItem('cts_lang') || 'en';
let track = localStorage.getItem('cts_track') || 'cert';
let mcAnswers = new Array(20).fill('');
let kwAnswers = new Array(10).fill('');
let mcPreviouslyPassed = false;
let unitPassed = false;





function saveState(){
  try{
    localStorage.setItem(K('mc'), JSON.stringify(mcAnswers));
    localStorage.setItem(K('sa'), JSON.stringify(kwAnswers));
    localStorage.setItem(K('mcpass'), mcPreviouslyPassed ? '1' : '0');
    localStorage.setItem('cts_track', track);
    localStorage.setItem('cts_lang', currentLang);
  }catch(e){}
}
function restoreState(){
  try{ const a = JSON.parse(localStorage.getItem(K('mc'))); if(Array.isArray(a) && a.length===20) mcAnswers = a; }catch(e){}
  try{ const b = JSON.parse(localStorage.getItem(K('sa'))); if(Array.isArray(b) && b.length===10) kwAnswers = b; }catch(e){}
  mcPreviouslyPassed = localStorage.getItem(K('mcpass')) === '1';
}

function applyLang(){
  document.body.className = 'lang-' + currentLang;
  document.getElementById('langToggleBtn').textContent = currentLang === 'en' ? 'Español' : 'English';
}
function toggleLang(){
  currentLang = currentLang === 'en' ? 'es' : 'en';
  applyLang(); renderMC(); updateMCResult(); renderSA(); saveState();
}

function setTrack(t){ track = t; saveState(); updateTrackUI(); updateCompletion(); }
function updateTrackUI(){
  ['cert','assoc','thm','mdiv'].forEach(function(t){
    const el = document.getElementById('track-' + t);
    if(el) el.classList.toggle('active', track === t);
  });
}

/* Immediate-feedback MC: the first tap on a question locks it, shows right/wrong,
   the correct answer, and a short explanation at once. A running score is shown
   below; when all 20 are answered a pass/fail verdict appears. Reset starts over. */
function renderMC(){
  const container = document.getElementById('mcContainer');
  container.innerHTML = '';
  const allAnswered = mcAnswers.filter(function(a){ return !!a; }).length === 20;
  mcQuestions.forEach(function(q, idx){
    const answered = !!mcAnswers[idx];
    const div = document.createElement('div'); div.className = 'question';
    const p = document.createElement('p'); p.className = 'qtext';
    p.textContent = (idx + 1) + '. ' + (currentLang === 'en' ? q.textEn : q.textEs);
    div.appendChild(p);
    const options = currentLang === 'en' ? q.optionsEn : q.optionsEs;
    const correctLetter = String.fromCharCode(65 + q.correct);
    options.forEach(function(opt, optIdx){
      const letter = String.fromCharCode(65 + optIdx);
      const btn = document.createElement('button'); btn.className = 'option';
      btn.textContent = letter + '. ' + opt;
      if(answered){
        if(optIdx === q.correct) btn.classList.add('correct');
        else if(mcAnswers[idx] === letter) btn.classList.add('wrong');
        btn.disabled = true; btn.style.cursor = 'default';
      } else {
        if(mcAnswers[idx] === letter){ btn.style.background = '#efe7d2'; btn.style.borderColor = '#d4af37'; btn.style.fontWeight = '600'; }
        btn.onclick = function(){
          mcAnswers[idx] = letter;
          saveState();
          renderMC();
          updateMCResult();
        };
      }
      div.appendChild(btn);
    });
    if(answered){
      const fb = document.createElement('div');
      const exp = currentLang === 'en' ? q.explanationEn : q.explanationEs;
      if(mcAnswers[idx] === correctLetter){
        fb.className = 'feedback-text correct';
        fb.textContent = (currentLang === 'en' ? '\u2713 Correct! ' : '\u2713 \u00a1Correcto! ') + exp;
      } else {
        fb.className = 'feedback-text incorrect';
        fb.textContent = (currentLang === 'en'
          ? ('\u2717 Incorrect. Correct answer: ' + correctLetter + '. ')
          : ('\u2717 Incorrecto. Respuesta correcta: ' + correctLetter + '. ')) + exp;
      }
      div.appendChild(fb);
    }
    container.appendChild(div);
  });
}

function updateMCResult(){
  let answered = 0, score = 0;
  mcQuestions.forEach(function(q, idx){
    if(mcAnswers[idx]){
      answered++;
      if(mcAnswers[idx] === String.fromCharCode(65 + q.correct)) score++;
    }
  });
  const res = document.getElementById('mcResult');
  if(answered === 0){ res.style.display = 'none'; res.className = 'result'; res.textContent = ''; updateCompletion(); return; }
  if(answered < 20){
    res.className = 'result progress';
    res.textContent = currentLang === 'en'
      ? ('Answered ' + answered + '/20 \u00b7 ' + score + ' correct so far.')
      : ('Respondidas ' + answered + '/20 \u00b7 ' + score + ' correctas hasta ahora.');
  } else {
    const pass = score >= 18;
    if(pass) mcPreviouslyPassed = true;
    res.className = 'result ' + (pass ? 'pass' : 'fail');
    res.textContent = currentLang === 'en'
      ? ('You scored ' + score + '/20. ' + (pass ? 'Passed (18 required).' : 'Not yet \u2014 18 required. Tap "Reset Exam" to try again.'))
      : ('Obtuviste ' + score + '/20. ' + (pass ? 'Aprobado (se requieren 18).' : 'A\u00fan no \u2014 se requieren 18. Toca "Reiniciar Examen" para intentarlo de nuevo.'));
  }
  saveState();
  updateCompletion();
}

function resetMC(){
  mcAnswers = new Array(20).fill('');
  mcPreviouslyPassed = false;
  saveState();
  renderMC();
  const res = document.getElementById('mcResult');
  res.style.display = 'none'; res.className = 'result'; res.textContent = '';
  updateCompletion();
}

function kwHit(answer, stem){
  const norm = (answer || '').toLowerCase();
  const tokens = norm.split(/[^a-z\u00e0-\u00ff]+/i).filter(Boolean);
  return tokens.some(function(t){ return t.indexOf(stem) === 0; });
}

function saPassState(){
  let allPass = true;
  saQuestions.forEach(function(q, idx){
    const ans = (kwAnswers[idx] || '').trim();
    if(ans.length < 100){ allPass = false; return; }
    let hits = 0;
    q.keywords.forEach(function(k){ if(kwHit(ans, k)) hits++; });
    if(hits < 3) allPass = false;
  });
  return allPass;
}

function gradeSA(){
  saQuestions.forEach(function(q, idx){
    const ans = (kwAnswers[idx] || '').trim();
    const fb = document.getElementById('sa-fb-' + idx);
    if(!fb) return;
    fb.style.display = 'block';
    if(ans.length < 100){
      fb.className = 'feedback-text incorrect';
      fb.textContent = currentLang === 'en'
        ? 'Please write at least a few sentences (about 100 characters) before the model answer is shown.'
        : 'Por favor escribe al menos unas cuantas oraciones (unos 100 caracteres) antes de mostrar la respuesta modelo.';
      return;
    }
    let hits = 0;
    q.keywords.forEach(function(k){ if(kwHit(ans, k)) hits++; });
    const pass = hits >= 3;
    fb.className = 'feedback-text ' + (pass ? 'correct' : 'incorrect');
    const model = currentLang === 'en' ? q.modelEn : q.modelEs;
    const label = pass
      ? (currentLang === 'en' ? ('\u2713 Sufficient (' + hits + ' key ideas). ') : ('\u2713 Suficiente (' + hits + ' ideas clave). '))
      : (currentLang === 'en' ? ('Keep developing (' + hits + '/3 key ideas). ') : ('Sigue desarrollando (' + hits + '/3 ideas clave). '));
    const modelLabel = currentLang === 'en' ? 'Model answer: ' : 'Respuesta modelo: ';
    fb.innerHTML = '<strong>' + label + '</strong><br><em>' + modelLabel + '</em>' + model;
  });
  saveState(); updateCompletion();
}

function renderSA(){
  const c = document.getElementById('saContainer');
  c.innerHTML = '';
  saQuestions.forEach(function(q, idx){
    const div = document.createElement('div'); div.className = 'question';
    const p = document.createElement('p'); p.className = 'qtext';
    p.textContent = (idx + 1) + '. ' + (currentLang === 'en' ? q.promptEn : q.promptEs);
    div.appendChild(p);
    const ta = document.createElement('textarea');
    ta.id = 'sa-input-' + idx; ta.rows = 4; ta.value = kwAnswers[idx] || '';
    ta.placeholder = currentLang === 'en' ? 'Write your answer...' : 'Escribe tu respuesta...';
    ta.oninput = function(){ kwAnswers[idx] = ta.value; saveState(); };
    div.appendChild(ta);
    const fb = document.createElement('div');
    fb.id = 'sa-fb-' + idx; fb.className = 'feedback-text'; fb.style.display = 'none';
    div.appendChild(fb);
    c.appendChild(div);
  });
}

function updateCompletion(){
  const complete = (track === 'cert' || track === 'assoc') ? mcPreviouslyPassed : (mcPreviouslyPassed && saPassState());
  unitPassed = complete;
  const banner = document.getElementById('completionBanner');
  if(complete){
    const trackName = track === 'cert' ? (currentLang === 'en' ? 'Certificate' : 'de Certificado')
                    : track === 'assoc' ? (currentLang === 'en' ? 'Associate' : 'de Asociado')
                    : track === 'thm'  ? 'Th.M.' : 'M.Div.';
    banner.style.display = 'block';
    banner.textContent = currentLang === 'en'
      ? (`\u2705 Unit ${UNIT} complete on the ` + trackName + ' track \u2014 and with it, the whole course. Congratulations.')
      : (`\u2705 Unidad ${UNIT} completada en la v\u00eda ` + trackName + ' \u2014 y con ella, todo el curso. Felicidades.');
  } else {
    banner.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', function(){
  restoreState();
  applyLang();
  updateTrackUI();
  renderMC();
  updateMCResult();
  renderSA();
  updateCompletion();
});
