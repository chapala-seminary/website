/* Exam engine for CTSCS (shared by 9 unit pages).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/cs/unitN.js. */
const TOTAL_UNITS = 13;

function fileFor(u){ return "CTSCSUnit"+u+".html"; }



let STATE = loadState();
let STATE_SA = loadStateSA();
function loadState(){ try{ return JSON.parse(localStorage.getItem("cts_cs_state")||"{}"); }catch(e){ return {}; } }
function loadStateSA(){ try{ return JSON.parse(localStorage.getItem("cts_cs_state_sa")||"{}"); }catch(e){ return {}; } }
function saveStateSA(){ localStorage.setItem("cts_cs_state_sa", JSON.stringify(STATE_SA)); }
function saveState(){ localStorage.setItem("cts_cs_state", JSON.stringify(STATE)); }

function loadReg(){
  try{
    const r = JSON.parse(localStorage.getItem("cts_cs_reg")||"null");
    if (r) return r;
    // No local registration yet -- auto-fill from the site-wide student record
    // (set at the seminary's main registration) so a Masters-track student is
    // graded at the correct rigor here without re-registering on this page.
    const shared = JSON.parse(localStorage.getItem('cts_student') || 'null');
    if(shared && shared.name && shared.email){
      const sharedTrack = String(localStorage.getItem('cts_track') || shared.track || shared.program || '').toLowerCase();
      let track = 'cert';
      if(sharedTrack === 'mdiv' || /master of divinity|m\.div/.test(sharedTrack)) track = 'mdiv';
      else if(sharedTrack === 'thm' || sharedTrack === 'mth' || /master of theology|m\.th|th\.m/.test(sharedTrack)) track = 'thm';
      const reg = { name: shared.name, email: shared.email, country: shared.country || '', track };
      saveReg(reg);
      return reg;
    }
    return null;
  }catch(e){ return null; }
}
function saveReg(r){ localStorage.setItem("cts_cs_reg", JSON.stringify(r)); }

function applyLang(){ const es = localStorage.getItem("cts_lang")==="es"; document.body.classList.toggle("spanish", es); const b=document.getElementById("langToggle"); if(b) b.textContent = es ? "🇺🇸 English" : "🇪🇸 Español"; }
document.getElementById("langToggle").addEventListener("click", function(){ const es = localStorage.getItem("cts_lang")==="es"; localStorage.setItem("cts_lang", es?"en":"es"); applyLang(); });

function renderReg(){
  const r = loadReg(); const status=document.getElementById("regStatus"); const fields=document.getElementById("regFields");
  if(r && r.name){
    status.innerHTML = "<span class='lang-en'>Registered: </span><span class='lang-es'>Registrado: </span>" + r.name + " · " + r.track;
    fields.style.display="none";
  }
}
document.getElementById("saveRegBtn").addEventListener("click", function(){
  const r = { name:document.getElementById("studentName").value.trim(), email:document.getElementById("studentEmail").value.trim(), country:document.getElementById("studentCountry").value.trim(), track:document.getElementById("programTrack").value };
  if(!r.name){ alert("Please enter your name / Por favor ingrese su nombre"); return; }
  saveReg(r); renderReg();
});

function renderNav(){
  const nav=document.getElementById("unitNav");
  let h="";
  for(let u=0; u<TOTAL_UNITS; u++){
    const st = STATE[u];
    let cls = u===THIS_UNIT ? "current" : (st && st.passed ? "done" : "");
    h += "<a class='"+cls+"' href='"+fileFor(u)+"'>"+UNIT_LABELS[u]+"</a>";
  }
  nav.innerHTML=h;
}

function renderProgress(){
  let done=0; for(let u=0; u<TOTAL_UNITS; u++){ if(STATE[u] && STATE[u].passed) done++; }
  const pct = Math.round(100*done/TOTAL_UNITS);
  const fill=document.getElementById("progressFill"); fill.style.width=pct+"%"; fill.textContent=pct+"%";
  const pt=document.getElementById("progressText");
  pt.innerHTML = "<span class='lang-en'>"+done+" of "+TOTAL_UNITS+" situations completed</span><span class='lang-es'>"+done+" de "+TOTAL_UNITS+" situaciones completadas</span>";
  if(done===TOTAL_UNITS){ document.getElementById("courseComplete").style.display="block"; }
}

function renderQuiz(){
  const u = UNITS[THIS_UNIT]; if(!u) return;
  const mcWrap=document.getElementById("mcq_"+THIS_UNIT);
  let mh="";
  u.mcq.forEach(function(q,qi){
    mh += "<div class='question-card'><p><span class='lang-en'>"+(qi+1)+". "+q.textEn+"</span><span class='lang-es'>"+(qi+1)+". "+q.textEs+"</span></p>";
    q.options.forEach(function(o,oi){
      mh += "<label class='option' data-q='"+qi+"' data-o='"+oi+"'><span class='lang-en'>"+o.en+"</span><span class='lang-es'>"+o.es+"</span></label>";
    });
    mh += "<div class='feedback' id='fb_"+qi+"'></div></div>";
  });
  mcWrap.innerHTML=mh;
  mcWrap.querySelectorAll(".option").forEach(function(el){
    el.addEventListener("click", function(){
      const qi=this.getAttribute("data-q");
      const already=mcWrap.querySelector(".option[data-q='"+qi+"'].correct, .option[data-q='"+qi+"'].incorrect");
      if(already) return;
      const q=u.mcq[qi];
      const oi=parseInt(this.getAttribute("data-o"),10);
      const fb=document.getElementById("fb_"+qi);
      mcWrap.querySelectorAll(".option[data-q='"+qi+"']").forEach(function(s){ s.classList.remove("selected"); });
      this.classList.add("selected");
      if(oi===q.correct){ this.classList.add("correct"); fb.className="feedback show ok"; fb.innerHTML="<span class='lang-en'>Correct. "+q.explainEn+"</span><span class='lang-es'>Correcto. "+q.explainEs+"</span>"; }
      else { this.classList.add("incorrect"); const corr=mcWrap.querySelector(".option[data-q='"+qi+"'][data-o='"+q.correct+"']"); if(corr) corr.classList.add("correct"); fb.className="feedback show no"; fb.innerHTML="<span class='lang-en'>Not quite. "+q.explainEn+"</span><span class='lang-es'>No exactamente. "+q.explainEs+"</span>"; }
    });
  });
  const esWrap=document.getElementById("essay_"+THIS_UNIT);
  let eh="";
  u.shortAnswer.forEach(function(q,qi){
    eh += "<div class='essay-card'><p><span class='lang-en'>"+(u.mcq.length+qi+1)+". "+q.textEn+"</span><span class='lang-es'>"+(u.mcq.length+qi+1)+". "+q.textEs+"</span></p>";
    eh += "<textarea id='sa_"+qi+"' placeholder='Your answer / Su respuesta' aria-label='Your answer / Su respuesta'></textarea>";
    eh += "<button class='small-check-btn' onclick='revealModel("+qi+")'><span class=\"lang-en\">Reveal model answer</span><span class=\"lang-es\">Mostrar respuesta modelo</span></button>";
    eh += "<div class='model-answer' id='model_"+qi+"'><strong><span class=\"lang-en\">Model answer:</span><span class=\"lang-es\">Respuesta modelo:</span></strong><br><span class='lang-en'>"+q.modelEn+"</span><span class='lang-es'>"+q.modelEs+"</span></div></div>";
  });
  esWrap.innerHTML=eh;
}

function revealModel(qi){
  const model=document.getElementById("model_"+qi); if(model) model.classList.add("show");
}

function submitUnit(n){
  const u=UNITS[n]; const reg=loadReg();
  let mcCorrect=0;
  u.mcq.forEach(function(q,qi){
    const sel=document.querySelector("#mcq_"+n+" .option[data-q='"+qi+"'].selected");
    const fb=document.getElementById("fb_"+qi);
    document.querySelectorAll("#mcq_"+n+" .option[data-q='"+qi+"']").forEach(function(el){ el.classList.remove("correct","incorrect"); });
    if(sel){
      const oi=parseInt(sel.getAttribute("data-o"),10);
      if(oi===q.correct){ mcCorrect++; sel.classList.add("correct"); fb.className="feedback show ok"; fb.innerHTML="<span class='lang-en'>Correct. "+q.explainEn+"</span><span class='lang-es'>Correcto. "+q.explainEs+"</span>"; }
      else { sel.classList.add("incorrect"); const corr=document.querySelector("#mcq_"+n+" .option[data-q='"+qi+"'][data-o='"+q.correct+"']"); if(corr) corr.classList.add("correct"); fb.className="feedback show no"; fb.innerHTML="<span class='lang-en'>Not quite. "+q.explainEn+"</span><span class='lang-es'>No exactamente. "+q.explainEs+"</span>"; }
    } else {
      const corr=document.querySelector("#mcq_"+n+" .option[data-q='"+qi+"'][data-o='"+q.correct+"']"); if(corr) corr.classList.add("correct");
      fb.className="feedback show no"; fb.innerHTML="<span class='lang-en'>No answer selected. "+q.explainEn+"</span><span class='lang-es'>No se seleccionó respuesta. "+q.explainEs+"</span>";
    }
  });
  u.shortAnswer.forEach(function(q,qi){ const m=document.getElementById("model_"+qi); if(m) m.classList.add("show"); });
  const mcPct = Math.round(100*mcCorrect/u.mcq.length);
  let passed, msgEn, msgEs, saPct=null;
  if(reg && reg.track!=="cert" && u.shortAnswer.length){
    let saCorrect=0;
    u.shortAnswer.forEach(function(q,qi){
      if(!(STATE_SA[n]&&STATE_SA[n][qi])){
        const ta=document.getElementById("sa_"+qi); const ans=(ta?ta.value:"").trim().toLowerCase();
        if(ans.length>=100){ const matched=saKeywords(q).filter(function(kw){ return kwHit(ans,kw); }); STATE_SA[n]=STATE_SA[n]||{}; STATE_SA[n][qi]=matched.length>=SA_MIN_HITS; }
      }
      if(STATE_SA[n]&&STATE_SA[n][qi]) saCorrect++;
    });
    saPct = Math.round(100*saCorrect/u.shortAnswer.length);
    passed = (mcPct>=90) && (saPct>=90);
    msgEn = "Multiple choice: "+mcPct+"%. Written: "+saCorrect+"/"+u.shortAnswer.length+" ("+saPct+"%).";
    msgEs = "Opción múltiple: "+mcPct+"%. Escritas: "+saCorrect+"/"+u.shortAnswer.length+" ("+saPct+"%).";
  } else {
    passed = mcPct>=90;
    msgEn = "Multiple choice: "+mcPct+"%. Short-answer model answers are shown for your reflection.";
    msgEs = "Opción múltiple: "+mcPct+"%. Las respuestas modelo se muestran para su reflexión.";
  }
  STATE[n] = { passed:passed, mc:mcPct, sa:saPct };
  saveState(); renderNav(); renderProgress();
  const res=document.getElementById("result_"+n);
  res.className = "unit-result show " + (passed?"pass":"fail");
  res.innerHTML = (passed ? "<span class='lang-en'>✓ Unit passed. </span><span class='lang-es'>✓ Unidad aprobada. </span>" : "<span class='lang-en'>Not yet passed (90% needed). </span><span class='lang-es'>Aún no aprobada (se necesita 90%). </span>") + "<span class='lang-en'>"+msgEn+"</span><span class='lang-es'>"+msgEs+"</span>";
}

function resetUnit(n){
  document.querySelectorAll("#mcq_"+n+" .option").forEach(function(el){ el.classList.remove("selected","correct","incorrect"); });
  document.querySelectorAll("#mcq_"+n+" .feedback").forEach(function(el){ el.className="feedback"; el.innerHTML=""; });
  const u=UNITS[n]; u.shortAnswer.forEach(function(q,qi){ const t=document.getElementById("sa_"+qi); if(t) t.value=""; const m=document.getElementById("model_"+qi); if(m) m.classList.remove("show"); });
  delete STATE[n]; saveState(); renderNav(); renderProgress();
  const res=document.getElementById("result_"+n); res.className="unit-result"; res.innerHTML="";
}

applyLang(); renderReg(); renderNav(); renderProgress(); renderQuiz();
