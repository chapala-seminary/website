/* Exam engine for CTSHS (shared by 10 unit pages).
   Extracted from those pages' inline <script>; per-unit config and
   question banks live in data/hs/unitN.js. */
/* ---- storage hardening (Android content:// safe) ---- */
var _ctsMem={};
function lsGet(k){try{var v=localStorage.getItem(k);return v===null?(k in _ctsMem?_ctsMem[k]:null):v;}catch(e){return k in _ctsMem?_ctsMem[k]:null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}_ctsMem[k]=v;}
function lsDel(k){try{localStorage.removeItem(k);}catch(e){}delete _ctsMem[k];}

/* ---- helpers ---- */
function fold(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function reEsc(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function kwHit(ans,kw){var a=fold(ans),k=fold(kw);if(!k)return false;
  if(k.length<=3){return new RegExp('(^|[^a-z0-9])'+reEsc(k)+'([^a-z0-9]|$)').test(a);}
  return new RegExp('(^|[^a-z0-9])'+reEsc(k)).test(a);}
function saScore(ans,kws){var n=0;for(var i=0;i<kws.length;i++){if(kwHit(ans,kws[i]))n++;}return n;}
function mcCorrectIdx(code,qpos){return(((code-7*(qpos+3))%251)+251)%251;}

var LET=['A','B','C','D'];
var STATE={lang:'en',track:'cert',name:'',mc:[],sa:[],revealed:false};
for(var i=0;i<DATA.mc.length;i++)STATE.mc.push({answered:false,chosen:-1});
for(var j=0;j<DATA.sa.length;j++)STATE.sa.push({checked:false,text:'',hits:0});


function T(){return I18N[STATE.lang];}
function isMasters(){return STATE.track==='mdiv'||STATE.track==='thm';}
function lockMin(){return isMasters()?15:2;}

function $(id){return document.getElementById(id);}

/* ---------- rendering ---------- */
function renderTeaching(){
  $('teach-en').className=STATE.lang==='en'?'':'hide';
  $('teach-es').className=STATE.lang==='es'?'':'hide';
}
function renderChrome(){
  var t=T();
  document.documentElement.lang=STATE.lang;
  $('t-title').textContent=t.title;$('t-unit').innerHTML=t.unit;
  $('langBtn').textContent=t.lang;
  $('t-greet').textContent=t.greet(STATE.name);
  $('t-track').textContent=t.track(STATE.track);
  $('epigraph').textContent=t.epigraph;
  $('t-mc').textContent=t.mc;$('t-sa').textContent=t.sa;
  $('t-saNote').textContent=isMasters()?t.saNoteMast:t.saNoteCert;
  $('completeBtn').textContent=t.complete;
  $('m-h').textContent=t.mh;$('m-p').textContent=t.mp;$('m-nl').textContent=t.mnl;
  $('m-tl').textContent=t.mtl;$('m-go').textContent=t.mgo;
}
function renderMC(){
  var wrap=$('mcWrap');wrap.innerHTML='';
  for(var i=0;i<DATA.mc.length;i++){
    (function(i){
      var q=DATA.mc[i],st=STATE.mc[i];
      var opts=STATE.lang==='en'?q.oen:q.oes;
      var prompt=STATE.lang==='en'?q.en:q.es;
      var expl=STATE.lang==='en'?q.xen:q.xes;
      var correct=mcCorrectIdx(q.c,i);
      var div=document.createElement('div');div.className='q';
      var h='<div class="qn">'+(i+1)+'</div><div class="qp">'+prompt+'</div>';
      div.innerHTML=h;
      for(var o=0;o<4;o++){
        (function(o){
          var b=document.createElement('button');b.type='button';b.className='opt';
          b.innerHTML='<span class="lt">'+LET[o]+'</span>'+opts[o];
          if(st.answered){b.disabled=true;
            if(o===correct)b.className='opt correct';
            else if(o===st.chosen)b.className='opt wrong';}
          else if(st.answered&&o===st.chosen){b.style.background='#efe7d2';b.style.borderColor='#d4af37';b.style.fontWeight='600';}
          b.onclick=function(){if(st.answered)return;
            STATE.mc[i].answered=true;STATE.mc[i].chosen=o;renderMC();};
          div.appendChild(b);
        })(o);
      }
      var e=document.createElement('div');e.className='expl'+(st.answered?' show':'');
      e.textContent=expl;div.appendChild(e);
      wrap.appendChild(div);
    })(i);
  }
}
function renderSA(){
  var wrap=$('saWrap');wrap.innerHTML='';var t=T();
  for(var i=0;i<DATA.sa.length;i++){
    (function(i){
      var q=DATA.sa[i],st=STATE.sa[i];
      var prompt=STATE.lang==='en'?q.en:q.es;
      var model=STATE.lang==='en'?q.men:q.mes;
      var div=document.createElement('div');div.className='q';
      div.innerHTML='<div class="qn">'+(21+i)+'</div><div class="qp">'+prompt+'</div>';
      var ta=document.createElement('textarea');ta.value=st.text;
      ta.oninput=function(){STATE.sa[i].text=ta.value;};
      div.appendChild(ta);
      var btn=document.createElement('button');btn.type='button';btn.className='btn ghost';
      btn.style.marginTop='8px';btn.textContent=t.check;
      var res=document.createElement('div');res.className='sa-res'+(st.checked?' show':'');
      function paint(){
        var kws=STATE.lang==='en'?q.ken:q.kes;
        var hits=saScore(STATE.sa[i].text,kws);STATE.sa[i].hits=hits;
        var pass=hits>=3;
        var verdict=pass?('<span class="sa-verdict pass">'+t.passV+'</span>'):('<span class="sa-verdict soft">'+t.softV+'</span>');
        res.innerHTML=verdict+' &middot; '+t.hitFmt(hits)+
          '<div class="model"><div class="ml">'+t.model+'</div>'+model+'</div>';
        res.className='sa-res show';STATE.sa[i].checked=true;
      }
      btn.onclick=function(){
        if(!STATE.sa[i].text.trim()){res.className='sa-res show';
          res.innerHTML='<span class="sa-verdict soft">'+t.blank+'</span>';return;}
        if(STATE.sa[i].text.trim().length<100){res.className='sa-res show';
          res.innerHTML='<span class="sa-verdict soft">'+t.minLen+'</span>';return;}
        paint();
      };
      if(st.checked&&st.text.trim())paint();
      div.appendChild(btn);div.appendChild(res);
      wrap.appendChild(div);
    })(i);
  }
}
function renderAll(){renderChrome();renderTeaching();renderMC();renderSA();refreshLock();}

/* ---------- completion + lockout ---------- */
function lockedUntil(){var v=lsGet(CFG.lockKey);return v?parseInt(v,10):0;}
function refreshLock(){
  var until=lockedUntil(),now=Date.now();
  var btn=$('completeBtn');
  if(until>now){
    btn.disabled=true;
    var mins=Math.ceil((until-now)/60000);
    $('statusMsg').className='status lock';
    $('statusMsg').textContent=(STATE.lang==='en'?'Locked. Try again in ':'Bloqueado. Reintente en ')+mins+(STATE.lang==='en'?' min.':' min.');
  }else{btn.disabled=false;}
}
function markComplete(){
  var p={};try{p=JSON.parse(lsGet(CFG.progressKey)||'{}');}catch(e){p={};}
  p[CFG.unit]=true;lsSet(CFG.progressKey,JSON.stringify(p));
  var t=T();
  $('statusMsg').className='status ok';$('statusMsg').textContent=t.mGood;
  var nl=$('nextLink');nl.href=CFG.next;nl.textContent=t.nextTxt;nl.className='next';
  $('completeBtn').disabled=true;
}
function onComplete(){
  var t=T();
  if(!isMasters()){STATE.revealed=true;renderMC();markComplete();return;}
  var mcCorrect=0,mcAnswered=0;
  for(var i=0;i<DATA.mc.length;i++){if(STATE.mc[i].answered){mcAnswered++;
    if(STATE.mc[i].chosen===mcCorrectIdx(DATA.mc[i].c,i))mcCorrect++;}}
  var saPass=0;for(var j=0;j<DATA.sa.length;j++){if(STATE.sa[j].hits>=3)saPass++;}
  var needMC=18,needSA=7;
  if(mcAnswered<DATA.mc.length){
    $('statusMsg').className='status warn';
    $('statusMsg').textContent=(STATE.lang==='en'
      ?'Answer all multiple-choice questions first ('+mcAnswered+'/20).'
      :'Responda primero todas las preguntas de opci\u00f3n m\u00faltiple ('+mcAnswered+'/20).');
    return;
  }
  STATE.revealed=true;renderMC();
  if(mcCorrect>=needMC&&saPass>=needSA){markComplete();return;}
  // genuine fail -> lockout
  lsSet(CFG.lockKey,String(Date.now()+lockMin()*60000));
  $('statusMsg').className='status lock';
  $('statusMsg').textContent=(STATE.lang==='en'
    ?('Not yet: MC '+mcCorrect+'/20 (need 18), SA '+saPass+'/10 (need 7). '+t.mShort)
    :('A\u00fan no: OM '+mcCorrect+'/20 (necesita 18), RB '+saPass+'/10 (necesita 7). '+t.mShort));
  refreshLock();
}

/* ---------- init ---------- */
function startApp(){
  STATE.lang=(lsGet('cts_lang')==='es')?'es':'en';
  STATE.name=lsGet('cts_student')||'';
  STATE.track=lsGet('cts_track')||'cert';
  $('langBtn').onclick=function(){STATE.lang=STATE.lang==='en'?'es':'en';
    lsSet('cts_lang',STATE.lang);renderAll();};
  $('completeBtn').onclick=onComplete;
  $('m-go').onclick=function(){
    var nm=$('m-name').value.trim();var tk=$('m-track').value;
    if(!nm){$('m-name').focus();return;}
    STATE.name=nm;STATE.track=tk;
    lsSet('cts_student',nm);lsSet('cts_track',tk);
    $('reg').className='modal hide';renderAll();
  };
  if(CFG.showReg&&(!STATE.name||!lsGet('cts_track'))){
    $('reg').className='modal';$('m-track').value=STATE.track;renderChrome();
  }else{$('reg').className='modal hide';}
  renderAll();
  setInterval(refreshLock,30000);
}
if(typeof document!=='undefined'){
  if(document.readyState!=='loading')startApp();
  else document.addEventListener('DOMContentLoaded',startApp);
}
