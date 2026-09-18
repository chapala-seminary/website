/* Exam engine for CTSPentecostal (shared by 1 unit page).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/pentecostal/unitN.js. */
/* ---------- hardened storage (Android content:// fallback) ---------- */
var _ctsMem = {};
function lsGet(k){ try{ var v = window.localStorage.getItem(k); return v===null ? (k in _ctsMem ? _ctsMem[k] : null) : v; }catch(e){ return (k in _ctsMem) ? _ctsMem[k] : null; } }
function lsSet(k,v){ try{ window.localStorage.setItem(k,v); }catch(e){ _ctsMem[k]=String(v); } _ctsMem[k]=String(v); }
function lsDel(k){ try{ window.localStorage.removeItem(k); }catch(e){} delete _ctsMem[k]; }

var saPassed = {};

/* ---------- language + track ---------- */
function setLang(l){
  document.documentElement.classList.toggle('lang-es', l==='es');
  document.documentElement.classList.toggle('lang-en', l==='en');
  document.documentElement.setAttribute('lang', l);
  document.getElementById('btn-en').setAttribute('aria-pressed', l==='en');
  document.getElementById('btn-es').setAttribute('aria-pressed', l==='es');
  lsSet(SKEY+'_lang', l);
  renderMcqText(); renderSaText(); refreshScore();
}
function setTrack(t){
  document.documentElement.classList.toggle('track-masters', t==='masters');
  document.documentElement.classList.toggle('track-cert', t==='cert');
  document.getElementById('btn-cert').setAttribute('aria-pressed', t==='cert');
  document.getElementById('btn-mast').setAttribute('aria-pressed', t==='masters');
  lsSet(SKEY+'_track', t);
}

/* ---------- MCQ data (correct-answer positions varied: A,C,B,D,B,A,C) ---------- */


var answered = {}; // qi -> chosen index

function buildMcq(){
  var host = document.getElementById('mcq'); host.innerHTML='';
  MCQ.forEach(function(item, qi){
    var card = document.createElement('div'); card.className='qcard'; card.id='q'+qi;
    var num = document.createElement('div'); num.className='qnum';
    num.innerHTML='<span class="seg en">Question '+(qi+1)+'</span><span class="seg es">Pregunta '+(qi+1)+'</span>';
    var stem = document.createElement('div'); stem.className='qstem'; stem.setAttribute('data-role','stem');
    card.appendChild(num); card.appendChild(stem);
    item.opts.forEach(function(o, oi){
      var lab = document.createElement('label'); lab.className='opt'; lab.setAttribute('data-oi',oi);
      var inp = document.createElement('input'); inp.type='radio'; inp.name='q'+qi; inp.value=oi;
      inp.onchange=function(){ answered[qi]=oi; };
      var txt = document.createElement('span'); txt.setAttribute('data-role','opttext');
      lab.appendChild(inp); lab.appendChild(txt); card.appendChild(lab);
    });
    var btn = document.createElement('button'); btn.className='btn'; btn.setAttribute('data-role','checkbtn');
    btn.onclick=function(){ checkOne(qi); };
    var fb = document.createElement('div'); fb.className='fb'; fb.id='fb'+qi;
    card.appendChild(btn); card.appendChild(fb);
    host.appendChild(card);
  });
  renderMcqText();
}
function renderMcqText(){
  var l = document.documentElement.classList.contains('lang-es') ? 'es' : 'en';
  MCQ.forEach(function(item, qi){
    var card = document.getElementById('q'+qi);
    card.querySelector('[data-role="stem"]').textContent = item.q[l];
    card.querySelectorAll('.opt').forEach(function(lab){
      var oi = +lab.getAttribute('data-oi');
      lab.querySelector('[data-role="opttext"]').textContent = item.opts[oi][l];
    });
    card.querySelector('[data-role="checkbtn"]').textContent = (l==='es'?'Comprobar':'Check');
    // re-render feedback if already checked
    if(card.getAttribute('data-checked')==='1'){ paintFeedback(qi, l); }
  });
}
function checkOne(qi){
  if(!(qi in answered)){
    var l = document.documentElement.classList.contains('lang-es') ? 'es' : 'en';
    var fb = document.getElementById('fb'+qi); fb.className='fb no show';
    fb.textContent = (l==='es'?'Elija una respuesta primero.':'Please choose an answer first.');
    return;
  }
  document.getElementById('q'+qi).setAttribute('data-checked','1');
  var l = document.documentElement.classList.contains('lang-es') ? 'es' : 'en';
  paintFeedback(qi, l); refreshScore(); saveState();
}
function paintFeedback(qi, l){
  var item = MCQ[qi]; var card = document.getElementById('q'+qi); var chosen = answered[qi];
  card.querySelectorAll('.opt').forEach(function(lab){
    var oi = +lab.getAttribute('data-oi'); lab.classList.remove('correct','wrong');
    if(oi===item.correct) lab.classList.add('correct');
    else if(oi===chosen) lab.classList.add('wrong');
    var r = lab.querySelector('input'); if(r) r.checked = (oi===chosen);
  });
  var fb = document.getElementById('fb'+qi); var ok = (chosen===item.correct);
  fb.className = 'fb show ' + (ok?'ok':'no');
  var head = ok ? (l==='es'?'Correcto. ':'Correct. ') : (l==='es'?'No exactamente. ':'Not quite. ');
  fb.textContent = head + item.exp[l];
}
function refreshScore(){
  var n=0; MCQ.forEach(function(item,qi){ if(document.getElementById('q'+qi).getAttribute('data-checked')==='1' && answered[qi]===item.correct) n++; });
  document.getElementById('score').textContent = n + ' / ' + MCQ.length;
  updatePentProgress();
}
function updatePentProgress(){
  var mcAll = MCQ.every(function(item,qi){ return document.getElementById('q'+qi).getAttribute('data-checked')==='1' && answered[qi]===item.correct; });
  var track = lsGet(SKEY+'_track') || 'cert';
  var saOk = true;
  if(track === 'masters'){
    saOk = SA.every(function(item, si){ return saPassed[si] === true; });
  }
  if(mcAll && saOk){
    try{var _pp=JSON.parse(lsGet('cts_pentecostal_progress')||'{}');_pp['unit'+UNIT]=true;lsSet('cts_pentecostal_progress',JSON.stringify(_pp));}catch(e){}
  }
}
function resetMcq(){
  answered = {};
  MCQ.forEach(function(item,qi){
    var card=document.getElementById('q'+qi); card.setAttribute('data-checked','0');
    card.querySelectorAll('.opt').forEach(function(l){ l.classList.remove('correct','wrong'); var r=l.querySelector('input'); if(r) r.checked=false; });
    var fb=document.getElementById('fb'+qi); fb.className='fb';
  });
  refreshScore(); lsDel(SKEY+'_mcq');
}

/* ---------- short answer (Q24 fairness: 8 single-concept keywords, 3 = pass, word-boundary matcher) ---------- */
function normalize(s){
  return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
}
function kwHit(answer, kw){
  var toks = normalize(answer).split(' ');
  var k = normalize(kw);
  for(var i=0;i<toks.length;i++){ if(toks[i]===k || toks[i].indexOf(k)===0) return true; }
  return false;
}
function countHits(answer, kws){ var n=0; kws.forEach(function(k){ if(kwHit(answer,k)) n++; }); return n; }



function buildSa(){
  var host=document.getElementById('sa'); host.innerHTML='';
  SA.forEach(function(item, si){
    var card=document.createElement('div'); card.className='qcard'; card.id='sa'+si;
    var num=document.createElement('div'); num.className='qnum';
    num.innerHTML='<span class="seg en">Written '+(si+1)+'</span><span class="seg es">Escrita '+(si+1)+'</span>';
    var stem=document.createElement('div'); stem.className='qstem'; stem.setAttribute('data-role','stem');
    var ta=document.createElement('textarea'); ta.id='ta'+si; ta.setAttribute('aria-label','answer');
    var btnrow=document.createElement('div'); btnrow.style.marginTop='10px'; btnrow.style.display='flex'; btnrow.style.gap='10px'; btnrow.style.flexWrap='wrap';
    var chk=document.createElement('button'); chk.className='btn'; chk.setAttribute('data-role','chk'); chk.onclick=function(){ checkSa(si); };
    var rev=document.createElement('button'); rev.className='btn ghost'; rev.setAttribute('data-role','rev'); rev.onclick=function(){ revealModel(si); };
    btnrow.appendChild(chk); btnrow.appendChild(rev);
    var hit=document.createElement('div'); hit.className='hitline'; hit.id='hit'+si;
    var mod=document.createElement('div'); mod.className='model'; mod.id='mod'+si;
    mod.innerHTML='<div class="mh" data-role="mh"></div><div data-role="mtext"></div>';
    card.appendChild(num); card.appendChild(stem); card.appendChild(ta); card.appendChild(btnrow); card.appendChild(hit); card.appendChild(mod);
    host.appendChild(card);
  });
  renderSaText();
}
function renderSaText(){
  var l = document.documentElement.classList.contains('lang-es') ? 'es' : 'en';
  SA.forEach(function(item, si){
    var card=document.getElementById('sa'+si);
    card.querySelector('[data-role="stem"]').textContent=item.q[l];
    card.querySelector('[data-role="chk"]').textContent=(l==='es'?'Comprobar mi respuesta':'Check my answer');
    card.querySelector('[data-role="rev"]').textContent=(l==='es'?'Ver respuesta modelo':'Reveal model answer');
    card.querySelector('[data-role="mh"]').textContent=(l==='es'?'Respuesta modelo':'Model answer');
    card.querySelector('[data-role="mtext"]').textContent=item.model[l];
    if(card.getAttribute('data-checked')==='1') paintHits(si, l);
  });
}
function checkSa(si){
  var l = document.documentElement.classList.contains('lang-es') ? 'es' : 'en';
  var ans = document.getElementById('ta'+si).value.trim();
  if(ans.length < 100){
    var hit=document.getElementById('hit'+si); hit.className='hitline show';
    hit.innerHTML = (l==='es' ? 'Escriba una respuesta m\u00e1s completa (al menos 100 caracteres) antes de verificar.' : 'Write a fuller answer (at least 100 characters) before checking.');
    return;
  }
  document.getElementById('sa'+si).setAttribute('data-checked','1');
  paintHits(si, l);
  revealModel(si);
  saPassed[si] = countHits(ans, SA[si].kw[l]) >= 3;
  updatePentProgress();
}
function paintHits(si, l){
  var item=SA[si]; var ans=document.getElementById('ta'+si).value;
  var n=countHits(ans, item.kw[l]); var pass = n>=3;
  var hit=document.getElementById('hit'+si); hit.className='hitline show';
  if(l==='es'){
    hit.innerHTML = 'Conceptos clave encontrados: <b>'+n+' de 8</b> &mdash; '+(pass?'aprobado (mínimo 3). Compare con la respuesta modelo abajo.':'aún no (se necesitan 3). Revise su respuesta y la modelo abajo.');
  } else {
    hit.innerHTML = 'Key concepts found: <b>'+n+' of 8</b> &mdash; '+(pass?'pass (minimum 3). Compare with the model answer below.':'not yet (3 needed). Review your answer and the model below.');
  }
}
function revealModel(si){ document.getElementById('mod'+si).classList.add('show'); }

/* ---------- persistence ---------- */
function saveState(){
  try{
    var mcqState={}; MCQ.forEach(function(it,qi){ if(document.getElementById('q'+qi).getAttribute('data-checked')==='1'){ mcqState[qi]=answered[qi]; } });
    lsSet(SKEY+'_mcq', JSON.stringify(mcqState));
  }catch(e){}
}
function restoreState(){
  var l = lsGet(SKEY+'_lang'); if(l) setLang(l);
  var t = lsGet(SKEY+'_track');
  if(!t){
    // No local choice yet on this page -- default from the site-wide track
    // (set at the seminary's main registration) so a Masters-track student
    // is graded at the correct rigor here without re-selecting it locally.
    try{
      var shared = JSON.parse(lsGet('cts_student') || 'null');
      var sharedTrack = String(lsGet('cts_track') || (shared && (shared.track||shared.program)) || '').toLowerCase();
      if(sharedTrack === 'mdiv' || sharedTrack === 'thm' || sharedTrack === 'mth' ||
         /master of divinity|m\.div|master of theology|m\.th|th\.m/.test(sharedTrack)) t = 'masters';
    }catch(e){}
  }
  setTrack(t||'cert');
  try{
    var raw = lsGet(SKEY+'_mcq');
    if(raw){ var st=JSON.parse(raw); var lg=document.documentElement.classList.contains('lang-es')?'es':'en';
      Object.keys(st).forEach(function(qi){ answered[qi]=st[qi]; document.getElementById('q'+qi).setAttribute('data-checked','1'); paintFeedback(+qi, lg); });
      refreshScore();
    }
  }catch(e){}
}

/* ---------- init ---------- */
buildMcq(); buildSa();
restoreState();
