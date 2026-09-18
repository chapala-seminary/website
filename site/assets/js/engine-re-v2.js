/* Exam engine for CTSRE (shared by 4 unit pages).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/re/unitN.js. */
var _ctsMem={};
function lsGet(k){ try{var v=localStorage.getItem(k);return v===null?(_ctsMem[k]!==undefined?_ctsMem[k]:null):v;}catch(e){return _ctsMem[k]!==undefined?_ctsMem[k]:null;} }
function lsSet(k,v){ try{localStorage.setItem(k,v);}catch(e){} _ctsMem[k]=v; }
function lsDel(k){ try{localStorage.removeItem(k);}catch(e){} delete _ctsMem[k]; }



function getTrack(){ return lsGet('cts_track')||'cert'; }
function isMastersLevel(){ var t=getTrack(); return t==='mdiv'||t==='thm'||t==='mth'; }
function lockMinutes(){ return isMastersLevel()?15:2; }

function setLang(l){
  document.body.setAttribute('data-lang',l); lsSet('cts_lang',l);
  document.getElementById('btnEn').classList.toggle('active',l==='en');
  document.getElementById('btnEs').classList.toggle('active',l==='es');
}
function saveReg(){
  var nm=document.getElementById('regName').value.trim();
  if(!nm) return;
  lsSet('cts_student',nm);
  document.getElementById('regOk').textContent=(document.body.getAttribute('data-lang')==='es'?'  Guardado: ':'  Saved: ')+nm;
  renderGreet();
}
function renderGreet(){
  var nm=lsGet('cts_student'); var es=document.body.getAttribute('data-lang')==='es';
  document.getElementById('greet').textContent = nm ? (es?('Estudiante: '+nm):('Student: '+nm)) : '';
}
function setTrack(){ lsSet('cts_track',document.getElementById('track').value); renderTrackNote(); renderSAmode(); }
function renderTrackNote(){
  var es=document.body.getAttribute('data-lang')==='es';
  document.getElementById('trackNote').textContent = isMastersLevel()
    ? (es?'Programa de maestría: la sección de respuesta breve CUENTA para aprobar.':'Masters track: the short-answer section COUNTS toward passing.')
    : (es?'Certificado: la respuesta breve es práctica y no decide su aprobación.':'Certificate: short answer is practice and does not gate your pass.');
}
function renderSAmode(){
  var es=document.body.getAttribute('data-lang')==='es';
  document.getElementById('saMode').textContent = isMastersLevel()
    ? (es?'Cuenta para su calificación (maestría).':'Counts toward your grade (masters).')
    : (es?'Práctica: estudíela, pero no afecta su aprobación (certificado).':'Practice: study it, but it does not affect your pass (certificate).');
}
function kwHit(kw,text){
  kw=kw.toLowerCase().trim(); text=(text||'').toLowerCase();
  var e=kw.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  var re=(kw.length<=3)?new RegExp('\\b'+e+'\\b'):new RegExp('\\b'+e);
  return re.test(text);
}
function saHits(kws,ans){ var h=0; for(var i=0;i<kws.length;i++){ if(kwHit(kws[i],ans))h++; } return h; }

function renderMC(){
  var c=document.getElementById('mc'); c.innerHTML='';
  MC.forEach(function(q,qi){
    var d=document.createElement('div'); d.className='q';
    var stem=document.createElement('div'); stem.className='stem';
    stem.innerHTML='<span class="en">'+(qi+1)+'. '+q.stemEn+'</span><span class="es">'+(qi+1)+'. '+q.stemEs+'</span>';
    d.appendChild(stem);
    ['A','B','C','D'].forEach(function(L,oi){
      var o=document.createElement('div'); o.className='opt'; o.id='mc'+qi+L;
      o.innerHTML='<span class="en">'+L+'. '+q.optionsEn[oi]+'</span><span class="es">'+L+'. '+q.optionsEs[oi]+'</span>';
      o.addEventListener('click',function(){ pickMC(qi,L); });
      d.appendChild(o);
    });
    var bw=document.createElement('div'); bw.style.marginTop='8px';
    var b=document.createElement('button'); b.className='secondary';
    b.innerHTML='<span class="en">Check</span><span class="es">Revisar</span>';
    b.addEventListener('click',function(){ checkMC(qi); });
    bw.appendChild(b); d.appendChild(bw);
    var fb=document.createElement('div'); fb.className='fb'; fb.id='mcfb'+qi; d.appendChild(fb);
    c.appendChild(d);
  });
}
var mcPick={};
function pickMC(qi,L){ mcPick[qi]=L; ['A','B','C','D'].forEach(function(X){document.getElementById('mc'+qi+X).classList.remove('sel');}); document.getElementById('mc'+qi+L).classList.add('sel'); }
function markMC(qi){
  var q=MC[qi], pick=mcPick[qi];
  ['A','B','C','D'].forEach(function(X){document.getElementById('mc'+qi+X).classList.remove('correct','wrong');});
  if(pick===q.answer){ document.getElementById('mc'+qi+pick).classList.add('correct'); }
  else { if(pick) document.getElementById('mc'+qi+pick).classList.add('wrong'); document.getElementById('mc'+qi+q.answer).classList.add('correct'); }
  var fb=document.getElementById('mcfb'+qi); fb.className='fb '+(pick===q.answer?'ok':'no');
  fb.innerHTML='<span class="en">'+(pick===q.answer?'Correct. ':'Answer: '+q.answer+'. ')+q.whyEn+'</span><span class="es">'+(pick===q.answer?'Correcto. ':'Respuesta: '+q.answer+'. ')+q.whyEs+'</span>';
}
function checkMC(qi){
  var es=document.body.getAttribute('data-lang')==='es';
  if(!mcPick[qi]){ var fb=document.getElementById('mcfb'+qi); fb.className='fb no'; fb.textContent=es?'Elija una opción primero.':'Pick an option first.'; return; }
  markMC(qi);
}

function renderSA(){
  var c=document.getElementById('sa'); c.innerHTML='';
  SA.forEach(function(q,qi){
    var d=document.createElement('div'); d.className='q';
    var stem=document.createElement('div'); stem.className='stem';
    stem.innerHTML='<span class="en">'+(MC.length+qi+1)+'. '+q.promptEn+'</span><span class="es">'+(MC.length+qi+1)+'. '+q.promptEs+'</span>';
    d.appendChild(stem);
    var ta=document.createElement('textarea'); ta.id='sa'+qi; ta.placeholder='...'; d.appendChild(ta);
    var bw=document.createElement('div'); bw.style.marginTop='8px';
    var b=document.createElement('button'); b.className='secondary';
    b.innerHTML='<span class="en">Check Answer</span><span class="es">Revisar</span>';
    b.addEventListener('click',function(){ checkSA(qi); });
    bw.appendChild(b); d.appendChild(bw);
    var fb=document.createElement('div'); fb.className='fb'; fb.id='safb'+qi; d.appendChild(fb);
    var mo=document.createElement('div'); mo.className='model'; mo.id='samodel'+qi;
    mo.innerHTML='<b><span class="en">Model answer — study this:</span><span class="es">Respuesta modelo &#9873; &mdash; est&uacute;diela:</span></b><br><span class="en">'+q.modelEn+'</span><span class="es">'+q.modelEs+'</span>';
    d.appendChild(mo);
    c.appendChild(d);
  });
}
function checkSA(qi){
  var ans=document.getElementById('sa'+qi).value.trim();
  var fb=document.getElementById('safb'+qi); var es=document.body.getAttribute('data-lang')==='es';
  if(!ans){ fb.className='fb no'; fb.textContent=es?'Escriba una respuesta antes de revisar.':'Please write an answer before checking.'; return; }
  if(ans.length<100){ fb.className='fb no'; fb.textContent=es?'Escriba una respuesta más completa (mínimo 100 caracteres).':'Write a fuller answer (100 characters minimum).'; return; }
  var q=SA[qi]; var hits=Math.max(saHits(q.keywords.en,ans),saHits(q.keywords.es,ans));
  if(hits>=3){ fb.className='fb ok'; fb.textContent=(es?'Aprobado — ':'Pass — ')+hits+(es?' de 8 conceptos.':' of 8 key concepts.'); }
  else { fb.className='fb no'; fb.textContent=(es?'Aún no — ':'Not yet — ')+hits+(es?' de 8 (necesita 3).':' of 8 (need 3).'); }
  if(hits>=3) document.getElementById('samodel'+qi).classList.add('show');
}

function isLocked(){
  var until=parseInt(lsGet('cts_re_u'+UNIT+'_lockout')||'0',10);
  return until>Date.now()? until : 0;
}
function grade(){
  var es=document.body.getAttribute('data-lang')==='es';
  var until=isLocked();
  if(until){ var mins=Math.ceil((until-Date.now())/60000);
    var r0=document.getElementById('result'); r0.className='result fail';
    r0.textContent=(es?'Bloqueado. Intente de nuevo en ':'Locked out. Try again in ')+mins+(es?' min.':' min.'); return; }
  var mcCorrect=0;
  MC.forEach(function(q,qi){ markMC(qi); if(mcPick[qi]===q.answer) mcCorrect++; });
  var saPass=0;
  SA.forEach(function(q,qi){
    var ans=document.getElementById('sa'+qi).value.trim(); var fb=document.getElementById('safb'+qi);
    if(!ans){ fb.className='fb no'; fb.textContent=es?'Sin respuesta.':'No answer given.'; }
    else if(ans.length<100){ fb.className='fb no'; fb.textContent=es?'Respuesta demasiado breve (mínimo 100 caracteres).':'Answer too short (100 characters minimum).'; }
    else { var hits=Math.max(saHits(q.keywords.en,ans),saHits(q.keywords.es,ans));
      if(hits>=3){ saPass++; fb.className='fb ok'; fb.textContent=(es?'Aprobado — ':'Pass — ')+hits+'/8.'; }
      else { fb.className='fb no'; fb.textContent=(es?'Debajo — ':'Below — ')+hits+'/8.'; } }
    document.getElementById('samodel'+qi).classList.add('show');
  });
  var mcPct=Math.round(mcCorrect/MC.length*100), mcOk=mcPct>=90;
  var masters=isMastersLevel(), saOk=saPass>=9;
  var pass = masters ? (mcOk&&saOk) : mcOk;
  var r=document.getElementById('result');
  if(pass){
    r.className='result pass';
    var saLine = masters ? ((es?' Respuesta breve: ':' Short answer: ')+saPass+'/'+SA.length+'.') : (es?' (Respuesta breve: práctica.)':' (Short answer: practice.)');
    r.innerHTML='<b>'+(es?('Unidad '+UNIT+' aprobada.'):('Unit '+UNIT+' passed.'))+'</b> '+(es?'Opción múltiple: ':'Multiple choice: ')+mcCorrect+'/'+MC.length+' ('+mcPct+'%).'+saLine;
    lsSet('re_unit'+UNIT+'_passed','1');
    lsSet('cts_re_progress',String(Math.max(UNIT,parseInt(lsGet('cts_re_progress')||'0',10))));
    lsDel('cts_re_u'+UNIT+'_lockout');
    document.getElementById('nextBtn').disabled=false;
  } else {
    r.className='result fail';
    var why=[]; if(!mcOk) why.push((es?'opción múltiple ':'multiple choice ')+mcPct+'% ('+(es?'necesita 90%':'need 90%')+')');
    if(masters&&!saOk) why.push((es?'respuesta breve ':'short answer ')+saPass+'/'+SA.length);
    var lk=lockMinutes(); lsSet('cts_re_u'+UNIT+'_lockout',String(Date.now()+lk*60000));
    r.innerHTML='<b>'+(es?'Aún no aprobada.':'Not yet passed.')+'</b> '+why.join('; ')+'. '+(es?('Espere '+lk+' min y reintente.'):('Wait '+lk+' min and retry.'));
    document.getElementById('nextBtn').disabled=true;
  }
  r.scrollIntoView({behavior:'smooth',block:'center'});
}
function goNext(){ if(NEXT_URL) window.location.href=NEXT_URL; }

(function(){
  setLang(lsGet('cts_lang')||'en');
  var t=getTrack(); document.getElementById('track').value=t;
  renderGreet(); renderTrackNote(); renderSAmode(); renderMC(); renderSA();
  var rn=document.getElementById('regName'); if(rn&&lsGet('cts_student')) rn.value=lsGet('cts_student');
  if(lsGet('re_unit'+UNIT+'_passed')==='1') document.getElementById('nextBtn').disabled=false;
})();
