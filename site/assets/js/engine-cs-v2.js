/* Exam engine for CTSCS (shared by 3 unit pages).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/cs/unitN.js. */
const TRACK_NAMES = {cert:{en:"Certificate of Ministry",es:"Certificado de Ministerio"},thm:{en:"Master of Theology",es:"Maestría en Teología"},mdiv:{en:"Master of Divinity",es:"Maestría en Divinidades"}};
const TOTAL_UNITS = 13;            // situations 0..12
// <-- the only thing that changes per file

const fileFor = u => 'CTSCSUnit'+u+'.html';


const state = { registration:null, unitState:{} };
function blankUnit(u){
  return { mcq:new Array((UNITS[u]?.mcq||[]).length).fill(null),
           shortAnswer:new Array((UNITS[u]?.shortAnswer||[]).length).fill(""),
           saChecked:new Array((UNITS[u]?.shortAnswer||[]).length).fill(false),
           passed:false, score:0 };
}
function initState(){ state.unitState[THIS_UNIT] = blankUnit(THIS_UNIT); }
function saveState(){
  try{
    localStorage.setItem('cts_cs_state', JSON.stringify(state.unitState));
    if(state.registration) localStorage.setItem('cts_cs_reg', JSON.stringify(state.registration));
  }catch(e){}
}
function loadState(){
  try{
    const s = localStorage.getItem('cts_cs_state');
    const r = localStorage.getItem('cts_cs_reg');
    if(s){
      const parsed = JSON.parse(s);
      // keep every unit's passed/score (for nav + progress); align THIS unit's answer arrays
      for(const k in parsed) state.unitState[k] = parsed[k];
      const blank = blankUnit(THIS_UNIT);
      state.unitState[THIS_UNIT] = Object.assign(blank, parsed[THIS_UNIT]||{});
      // repair array lengths in case the unit definition changed
      ['mcq','shortAnswer','saChecked'].forEach(key=>{
        const want = blank[key].length;
        const cur = state.unitState[THIS_UNIT][key]||[];
        state.unitState[THIS_UNIT][key] = blank[key].map((d,i)=> (cur[i]!==undefined?cur[i]:d));
      });
    }
    if(r){
      state.registration = JSON.parse(r);
    } else {
      // No local registration yet -- auto-fill from the site-wide student record
      // (set at the seminary's main registration) so a Masters-track student is
      // graded at the correct rigor here without re-registering on this page.
      const shared = JSON.parse(localStorage.getItem('cts_student') || 'null');
      if(shared && shared.name && shared.email){
        const sharedTrack = String(localStorage.getItem('cts_track') || shared.track || shared.program || '').toLowerCase();
        let track = 'cert';
        if(sharedTrack === 'mdiv' || /master of divinity|m\.div/.test(sharedTrack)) track = 'mdiv';
        else if(sharedTrack === 'thm' || sharedTrack === 'mth' || /master of theology|m\.th|th\.m/.test(sharedTrack)) track = 'thm';
        state.registration = { name: shared.name, email: shared.email, country: shared.country || '', track };
        saveState();
      }
    }
  }catch(e){}
}

// ---- registration ----
function renderRegStatus(){
  const el = document.getElementById('regStatus');
  if(state.registration){
    const t = TRACK_NAMES[state.registration.track] || {en:"",es:""};
    el.innerHTML = `<span class="lang-en">Registered: <strong>${state.registration.name}</strong> · ${state.registration.country} · ${t.en}</span>
                    <span class="lang-es">Registrado: <strong>${state.registration.name}</strong> · ${state.registration.country} · ${t.es}</span>`;
    document.getElementById('studentName').value = state.registration.name;
    document.getElementById('studentEmail').value = state.registration.email;
    document.getElementById('studentCountry').value = state.registration.country;
    document.getElementById('programTrack').value = state.registration.track;
  }
}
document.getElementById('saveRegBtn').addEventListener('click',()=>{
  const name=document.getElementById('studentName').value.trim();
  const email=document.getElementById('studentEmail').value.trim();
  const country=document.getElementById('studentCountry').value.trim();
  const track=document.getElementById('programTrack').value;
  if(!name||!email||!country){ alert(document.body.classList.contains('spanish')?'Por favor complete todos los campos':'Please complete all fields'); return; }
  state.registration={name,email,country,track};
  saveState(); renderRegStatus(); renderQuiz(THIS_UNIT);
});

// ---- language ----
document.getElementById('langToggle').addEventListener('click',()=>{
  document.body.classList.toggle('spanish');
  document.getElementById('langToggle').textContent = document.body.classList.contains('spanish')?'🇺🇸 English':'🇪🇸 Español';
  saveLang(); renderUnitNav();
});
function saveLang(){try{localStorage.setItem('cts_lang',document.body.classList.contains('spanish')?'es':'en')}catch(e){}}
function loadLang(){try{ if(localStorage.getItem('cts_lang')==='es'){ document.body.classList.add('spanish'); document.getElementById('langToggle').textContent='🇺🇸 English'; } }catch(e){}}

// ---- cross-file unit nav ----
function renderUnitNav(){
  const nav=document.getElementById('unitNav'); nav.innerHTML='';
  const es=document.body.classList.contains('spanish');
  for(let i=0;i<TOTAL_UNITS;i++){
    const b=document.createElement('button');
    const lbl=UNIT_LABELS[i]?(es?UNIT_LABELS[i].es:UNIT_LABELS[i].en):('Unit '+i);
    b.textContent=(i===0?'':i+'. ')+lbl;
    if(state.unitState[i]?.passed) b.classList.add('passed');
    if(i===THIS_UNIT) b.style.outline='2px solid var(--gold)';
    b.onclick=()=>{ if(i!==THIS_UNIT) location.href=fileFor(i); };
    nav.appendChild(b);
  }
}

// ---- quiz render ----
function renderQuiz(unitNum){
  const unit=UNITS[unitNum]; if(!unit) return;
  const mcqContainer=document.getElementById('mcq_'+unitNum);
  const essayContainer=document.getElementById('essay_'+unitNum);
  if(!mcqContainer) return;
  let html='';
  unit.mcq.forEach((q,i)=>{
    const sel=state.unitState[unitNum].mcq[i];
    html+=`<div class="question-card"><div class="question-text"><span class="lang-en">${i+1}. ${q.textEn}</span><span class="lang-es">${i+1}. ${q.textEs}</span></div><div class="options">`;
    q.options.forEach((opt,j)=>{
      const checked=sel===j?'checked':''; const selc=sel===j?'selected':'';
      html+=`<label class="option ${selc}"><input type="radio" name="u${unitNum}q${i}" value="${j}" ${checked} onchange="answerMCQ(${unitNum},${i},${j})"><span><span class="lang-en">${String.fromCharCode(65+j)}. ${opt.en}</span><span class="lang-es">${String.fromCharCode(65+j)}. ${opt.es}</span></span></label>`;
    });
    html+=`</div><div class="feedback" id="fb_${unitNum}_${i}"></div></div>`;
  });
  mcqContainer.innerHTML=html;
  if(essayContainer && unit.shortAnswer){
    const isCert=state.registration && state.registration.track==='cert';
    const isMasters=state.registration && state.registration.track!=='cert';
    let sh='';
    if(!state.registration){
      sh+=`<div class="essay-optional-note"><span class="lang-en"><strong>Written questions (Master's level):</strong> open to every student; answers are checked gently against the lesson's key ideas. Required for the Master's tracks, optional for the Certificate. Register above to record your track.</span><span class="lang-es"><strong>Preguntas escritas (nivel de Maestría):</strong> abiertas a todo estudiante; las respuestas se revisan con suavidad frente a las ideas clave. Requeridas para las pistas de Maestría, opcionales para el Certificado. Regístrese arriba para registrar su pista.</span></div>`;
    } else if(isCert){
      sh+=`<div class="essay-optional-note"><span class="lang-en"><strong>Optional for Certificate students:</strong> reflection items; they do not count toward your passing score.</span><span class="lang-es"><strong>Opcional para estudiantes del Certificado:</strong> ejercicios de reflexión; no cuentan para su puntaje.</span></div>`;
    } else if(isMasters){
      sh+=`<div class="essay-optional-note"><span class="lang-en"><strong>Required for your track:</strong> aim to touch at least three of the key ideas in each answer. The model answer is shown so you can study it.</span><span class="lang-es"><strong>Requerido para su pista:</strong> procure tocar al menos tres de las ideas clave en cada respuesta. Se muestra la respuesta modelo para que la estudie.</span></div>`;
    }
    unit.shortAnswer.forEach((q,i)=>{
      const ans=(state.unitState[unitNum].shortAnswer||[])[i]||"";
      sh+=`<div class="essay-card"><div class="essay-prompt"><span class="lang-en">${i+1}. ${q.textEn}</span><span class="lang-es">${i+1}. ${q.textEs}</span></div><textarea oninput="saveShortAnswer(${unitNum},${i},this.value)" placeholder="${document.body.classList.contains('spanish')?'Escriba su respuesta (al menos una oración)...':'Write your response (at least one sentence)...'}" aria-label="Short answer">${ans}</textarea><button class="small-check-btn" onclick="checkShortAnswer(${unitNum},${i})"><span class="lang-en">Check Answer</span><span class="lang-es">Verificar Respuesta</span></button><div class="feedback" id="sa_fb_${unitNum}_${i}"></div><div class="model-answer" id="sa_model_${unitNum}_${i}" style="display:none"></div></div>`;
    });
    essayContainer.innerHTML=sh; essayContainer.style.display='block';
    unit.shortAnswer.forEach((q,i)=>{ if((state.unitState[unitNum].saChecked||[])[i]) revealModel(unitNum,i); });
  }
}
function answerMCQ(u,i,j){
  state.unitState[u].mcq[i]=j; saveState();
  document.querySelectorAll(`input[name="u${u}q${i}"]`).forEach(inp=>inp.closest('.option').classList.toggle('selected',inp.checked));
  const q=UNITS[u].mcq[i]; const fb=document.getElementById(`fb_${u}_${i}`);
  if(fb){ if(j===q.correct){ fb.className='feedback show correct'; fb.innerHTML=`<strong><span class="lang-en">✓ Correct</span><span class="lang-es">✓ Correcto</span></strong><span class="lang-en">${q.explainEn}</span><span class="lang-es">${q.explainEs}</span>`; }
    else { const r=String.fromCharCode(65+q.correct); fb.className='feedback show incorrect'; fb.innerHTML=`<strong><span class="lang-en">✗ Incorrect — correct: ${r}</span><span class="lang-es">✗ Incorrecto — correcta: ${r}</span></strong><span class="lang-en">${q.explainEn}</span><span class="lang-es">${q.explainEs}</span>`; } }
}
function saveShortAnswer(u,i,v){ state.unitState[u].shortAnswer[i]=v; if(state.unitState[u].saChecked) state.unitState[u].saChecked[i]=false; saveState(); }
function kwHit(ans,k){
  k=(k||'').toLowerCase(); if(!k) return false;
  var WC='0-9a-z\\u00e1\\u00e9\\u00ed\\u00f3\\u00fa\\u00f1\\u00fc';
  var esc=k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  var pat=(k.length<=4)?'(?:^|[^'+WC+'])'+esc+'(?![' + WC + '])':'(?:^|[^'+WC+'])'+esc;
  try{ return new RegExp(pat,'i').test(ans); }catch(e){ return ans.indexOf(k)!==-1; }
}

function saKeywords(q){ const es=document.body.classList.contains('spanish'); if(es&&q.kw_es&&q.kw_es.length) return q.kw_es; if(!es&&q.kw_en&&q.kw_en.length) return q.kw_en; return q.keywords||[]; }
function revealModel(u,i){
  const q=UNITS[u].shortAnswer[i]; if(!q) return;
  const box=document.getElementById(`sa_model_${u}_${i}`); if(!box) return;
  box.style.display='block';
  box.innerHTML=`<strong><span class="lang-en">Model answer — study this:</span><span class="lang-es">Respuesta modelo — estúdiela:</span></strong> <span class="lang-en">${q.modelEn||''}</span><span class="lang-es">${q.modelEs||''}</span>`;
}
function checkShortAnswer(u,i){
  const q=UNITS[u].shortAnswer[i]; if(!q) return;
  const ans=(state.unitState[u].shortAnswer[i]||"").trim().toLowerCase();
  const fb=document.getElementById(`sa_fb_${u}_${i}`); if(!fb) return;
  if(ans.length<20){ fb.className='feedback show incorrect'; fb.innerHTML=`<strong><span class="lang-en">✗ Please write a fuller answer (at least one full sentence).</span><span class="lang-es">✗ Escriba una respuesta más completa (al menos una oración).</span></strong>`; if(state.unitState[u].saChecked) state.unitState[u].saChecked[i]=false; saveState(); return; }
  const matched=saKeywords(q).filter(kw=>kwHit(ans,kw));
  if(matched.length>=SA_MIN_HITS){ fb.className='feedback show correct'; fb.innerHTML=`<strong><span class="lang-en">✓ Well done — your answer touches ${matched.length} of the lesson's key ideas. Study the model answer below.</span><span class="lang-es">✓ Muy bien — su respuesta toca ${matched.length} de las ideas clave. Estudie la respuesta modelo abajo.</span></strong>`; if(!state.unitState[u].saChecked) state.unitState[u].saChecked=[]; state.unitState[u].saChecked[i]=true; }
  else { fb.className='feedback show incorrect'; fb.innerHTML=`<strong><span class="lang-en">Good start — ${matched.length} of the key ideas; aim for at least ${SA_MIN_HITS}. Read the model answer below and notice ideas you might add.</span><span class="lang-es">Buen comienzo — ${matched.length} de las ideas clave; procure al menos ${SA_MIN_HITS}. Lea la respuesta modelo abajo y note ideas que podría añadir.</span></strong>`; if(state.unitState[u].saChecked) state.unitState[u].saChecked[i]=false; }
  saveState(); revealModel(u,i);
}
function submitUnit(unitNum){
  const unit=UNITS[unitNum]; if(!unit) return;
  if(!state.registration){ alert(document.body.classList.contains('spanish')?'Por favor regístrese primero':'Please register first'); return; }
  let correct=0;
  unit.mcq.forEach((q,i)=>{
    const sel=state.unitState[unitNum].mcq[i]; const fb=document.getElementById(`fb_${unitNum}_${i}`);
    if(sel===null||sel===undefined){ if(fb){fb.className='feedback show incorrect'; fb.innerHTML=`<strong><span class="lang-en">Not answered</span><span class="lang-es">Sin responder</span></strong>`;} return; }
    if(sel===q.correct){ correct++; if(fb){fb.className='feedback show correct'; fb.innerHTML=`<strong><span class="lang-en">Correct</span><span class="lang-es">Correcto</span></strong><span class="lang-en">${q.explainEn}</span><span class="lang-es">${q.explainEs}</span>`;} }
    else { const r=String.fromCharCode(65+q.correct); if(fb){fb.className='feedback show incorrect'; fb.innerHTML=`<strong><span class="lang-en">Incorrect (correct: ${r})</span><span class="lang-es">Incorrecto (correcta: ${r})</span></strong><span class="lang-en">${q.explainEn}</span><span class="lang-es">${q.explainEs}</span>`;} }
  });
  const total=unit.mcq.length; const mcPct=total>0?Math.round(correct/total*100):0;
  let passed=false, saInfo='';
  if(unit.shortAnswer && state.registration.track!=='cert'){
    const sa=unit.shortAnswer; let saCorrect=0;
    sa.forEach((q,i)=>{
      const checked=(state.unitState[unitNum].saChecked||[])[i];
      const ans=((state.unitState[unitNum].shortAnswer||[])[i]||"").trim().toLowerCase();
      if(checked){ saCorrect++; }
      else if(ans.length>=20){
        const matched=saKeywords(q).filter(kw=>kwHit(ans,kw));
        const fb=document.getElementById(`sa_fb_${unitNum}_${i}`);
        if(matched.length>=SA_MIN_HITS){ saCorrect++; if(!state.unitState[unitNum].saChecked) state.unitState[unitNum].saChecked=[]; state.unitState[unitNum].saChecked[i]=true; if(fb){fb.className='feedback show correct'; fb.innerHTML=`<strong><span class="lang-en">✓ ${matched.length} key ideas. Study the model below.</span><span class="lang-es">✓ ${matched.length} ideas clave. Estudie el modelo abajo.</span></strong>`;} }
        else if(fb){ fb.className='feedback show incorrect'; fb.innerHTML=`<strong><span class="lang-en">${matched.length} key ideas; aim for ${SA_MIN_HITS}. See the model below.</span><span class="lang-es">${matched.length} ideas clave; procure ${SA_MIN_HITS}. Vea el modelo abajo.</span></strong>`; }
        revealModel(unitNum,i);
      } else { const fb=document.getElementById(`sa_fb_${unitNum}_${i}`); if(fb){fb.className='feedback show incorrect'; fb.innerHTML=`<strong><span class="lang-en">✗ Not answered.</span><span class="lang-es">✗ Sin responder.</span></strong>`;} }
    });
    const saPct=sa.length>0?Math.round(saCorrect/sa.length*100):0;
    passed=(mcPct>=90)&&(saPct>=90);
    saInfo=` · <span class="lang-en">Written: ${saCorrect}/${sa.length} (${saPct}%)</span><span class="lang-es">Escritas: ${saCorrect}/${sa.length} (${saPct}%)</span>`;
    state.unitState[unitNum].score=Math.min(mcPct,saPct);
  } else { passed=mcPct>=90; state.unitState[unitNum].score=mcPct; }
  state.unitState[unitNum].passed=passed; saveState();
  const isCert=state.registration.track==='cert';
  const result=document.getElementById('result_'+unitNum);
  if(result){ result.className='unit-result show '+(passed?'pass':'fail');
    if(passed){ result.innerHTML=`<span class="lang-en">✓ Passed. Multiple choice: ${correct}/${total} (${mcPct}%)${saInfo}. You may continue to the next situation.</span><span class="lang-es">✓ Aprobado. Opción múltiple: ${correct}/${total} (${mcPct}%)${saInfo}. Puede continuar a la siguiente situación.</span>`; }
    else { const re=isCert?'90% required on the multiple-choice section':'90% required in each section'; const rs=isCert?'Se requiere 90% en opción múltiple':'Se requiere 90% en cada sección'; result.innerHTML=`<span class="lang-en">Multiple choice: ${correct}/${total} (${mcPct}%)${saInfo}. ${re}. Review the feedback and try again.</span><span class="lang-es">Opción múltiple: ${correct}/${total} (${mcPct}%)${saInfo}. ${rs}. Revise y reintente.</span>`; } }
  renderUnitNav(); updateProgress();
}
function resetUnit(unitNum){
  state.unitState[unitNum]=blankUnit(unitNum); saveState(); renderQuiz(unitNum);
  document.querySelectorAll(`#unit${unitNum} .feedback`).forEach(f=>f.className='feedback');
  const result=document.getElementById('result_'+unitNum); if(result) result.className='unit-result';
  renderUnitNav(); updateProgress();
}
function updateProgress(){
  let passed=0; for(let i=0;i<TOTAL_UNITS;i++) if(state.unitState[i]?.passed) passed++;
  const pct=Math.round(passed/TOTAL_UNITS*100);
  document.getElementById('progressFill').style.width=pct+'%';
  document.getElementById('progressFill').textContent=pct+'%';
  document.getElementById('progressText').innerHTML=`<span class="lang-en">${passed} of ${TOTAL_UNITS} situations completed</span><span class="lang-es">${passed} de ${TOTAL_UNITS} situaciones completadas</span>`;
  if(passed===TOTAL_UNITS) document.getElementById('courseComplete').classList.add('show');
}
// init
loadLang(); initState(); loadState(); renderRegStatus(); renderUnitNav(); renderQuiz(THIS_UNIT); updateProgress();
