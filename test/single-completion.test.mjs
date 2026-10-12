// Exercise the production recorder without a browser, using synthetic storage.
import vm from 'node:vm';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const source=fs.readFileSync(process.env.CTS_RECORD_SOURCE || 'public/assets/js/cts-record.js','utf8');
let checks=0;
for(const code of ['COUNSELING','STORYTEL']) for(const track of ['cert','mdiv','thm','mth']) {
  const storage=new Map([['cts_track',track],['cts_goal','assoc']]);
  const ctx=vm.createContext({window:{},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v))}});
  vm.runInContext(source,ctx);
  const record=ctx.window.CTSRecord, course=record.singleCourse(code);
  const list=k=>JSON.parse(storage.get(k)||'[]');
  const masters=track!=='cert';
  storage.set(course.state,JSON.stringify(Object.fromEntries(course.units.slice(0,-1).map(i=>[i,{passed:true}]))));
  assert.equal(record.course(course),false); checks++;
  assert.deepEqual(list('cts_done_codes'),[]); checks++;
  storage.set(course.state,JSON.stringify(Object.fromEntries(course.units.map(i=>[i,{passed:true}]))));
  assert.equal(!!record.course(course),!masters); checks++;
  assert.equal(list('cts_done_codes').includes(code),!masters); checks++;
  assert.equal(list('cts_degree_courses').includes(course.name),!masters); checks++;
  storage.set(`cts_textbook_${course.textbook}_passed`,'2026-10-10');
  assert.equal(!!record.course(course),true); checks++;
  const key=track==='mdiv'?'cts_mdiv_done_codes':masters?'cts_thm_done_codes':'cts_assoc_done_codes';
  assert.equal(list(key).includes(code),true); checks++;
  // Holds never erase previously earned records, including per-level lists.
  storage.delete(`cts_textbook_${course.textbook}_passed`);
  record.course(course);
  assert.equal(list('cts_done_codes').includes(code),true); checks++;
  assert.equal(list(key).includes(code),true); checks++;
}
// Page-only registrations must use the Master's hold before shared registration.
for(const code of ['COUNSELING','STORYTEL']) for(const track of ['mdiv','mtheol']) {
  const storage=new Map();
  const ctx=vm.createContext({window:{},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v))}});
  vm.runInContext(source,ctx);
  const record=ctx.window.CTSRecord, course=record.singleCourse(code);
  storage.set(course.registration,JSON.stringify({track}));
  storage.set(course.state,JSON.stringify(Object.fromEntries(course.units.map(i=>[i,{passed:true}]))));
  assert.equal(record.course(course),false); checks++;
  storage.set(`cts_textbook_${course.textbook}_passed`,'2026-10-10');
  assert.equal(!!record.course(course),true); checks++;
  assert.equal(JSON.parse(storage.get(track==='mdiv'?'cts_mdiv_done_codes':'cts_thm_done_codes')).includes(code),true); checks++;
}
// Drive the actual page callbacks with a minimal DOM; browser layout is
// covered separately by verify-single-completion.mjs.
for(const code of ['COUNSELING','STORYTEL']) for(const track of ['cert','mdiv','thm']) {
  const storage=new Map([['cts_track',track],['cts_assoc_done_codes','[]']]);
  const nodes=new Map();
  const node=id=>{if(!nodes.has(id))nodes.set(id,{style:{},classList:{add(){},toggle(){}},addEventListener(type,fn){this[type]=fn;}}); return nodes.get(id);};
  const ctx=vm.createContext({window:{},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v))},document:{readyState:'complete',getElementById:node},Date});
  vm.runInContext(source,ctx);
  ctx.CTSRecord=ctx.window.CTSRecord;
  const course=ctx.CTSRecord.singleCourse(code);
  const html=fs.readFileSync(`public/${code==='COUNSELING'?'CTSCounseling.html':'CTS_Narrative_Preaching.html'}`,'utf8');
  const unitState=Object.fromEntries(course.units.map(i=>[i,{passed:false}]));
  ctx.state={unitState,registration:{name:'Synthetic Test',country:'Test',track:track==='thm'?'mtheol':track}};
  ctx.TOTAL_UNITS=8;
  ctx.TRACK_NAMES={cert:{en:'Certificate',es:'Certificado'},mdiv:{en:'M.Div.',es:'M.Div.'},mtheol:{en:'Th.M.',es:'Th.M.'}};
  function save(){storage.set(course.state,JSON.stringify(unitState));}
  save();
  const progress=html.slice(html.indexOf('function updateProgress(){'),html.indexOf('function showCert(unitNum){'));
  vm.runInContext(progress,ctx);
  if(code==='STORYTEL') {
    const callbacks=html.slice(html.lastIndexOf('<script>')+8,html.lastIndexOf('</script>'));
    vm.runInContext(callbacks,ctx);
    const cert=html.slice(html.indexOf('function showCert(unitNum){'),html.indexOf("document.getElementById('certModal').addEventListener"));
    vm.runInContext(cert,ctx);
    ctx.showCert(1);
    ctx.window.ctsStorytelComplete();
    node('cts-st-done').click();
    assert.equal(node('cts-st-done').hidden,true); checks++;
  }
  ctx.updateProgress();
  assert.equal(JSON.parse(storage.get('cts_done_codes')||'[]').includes(code),false); checks++;
  unitState[course.units[0]].passed=true; save(); ctx.updateProgress();
  assert.equal(JSON.parse(storage.get('cts_done_codes')||'[]').includes(code),false); checks++;
  for(const i of course.units)unitState[i].passed=true; save(); ctx.updateProgress();
  assert.equal(JSON.parse(storage.get('cts_done_codes')||'[]').includes(code),track==='cert'); checks++;
  if(code==='STORYTEL') {assert.equal(node('cts-st-hold').hidden,track==='cert'); checks++;}
  storage.set(`cts_textbook_${course.textbook}_passed`,'2026-10-10'); ctx.updateProgress();
  if(code==='STORYTEL') {assert.equal(node('cts-st-hold').hidden,true); checks++;}
  assert.equal(JSON.parse(storage.get('cts_done_codes')||'[]').includes(code),true); checks++;
}
// Preaching (WiseSpeak) records through the same recorder. With no reading test
// configured it completes exactly as before; with one in force it holds a
// Master's student until the test is passed, and an inactive one (null) holds no one.
for(const [from,label] of [[undefined,'none'],[null,'inactive'],['2020-01-01T00:00:00Z','active']]) for(const track of ['cert','mdiv','thm']) {
  const storage=new Map([['cts_track',track],['cts_wisespeak_layout','2']]);
  const win={};
  if(from!==undefined) win.CTS_REQUIRED_TESTS={WISESPEAK:[{slug:'preachingreadings',kind:'reading',requiredFrom:from}]};
  const ctx=vm.createContext({window:win,localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,String(v))}});
  vm.runInContext(source,ctx);
  const record=ctx.window.CTSRecord, course=record.singleCourse('WISESPEAK');
  storage.set(course.state,JSON.stringify(Object.fromEntries(course.units.map(i=>[i,{passed:true}]))));
  const held=label==='active'&&track!=='cert';
  assert.equal(record.textbookHolds(course),held); checks++;
  assert.equal(!!record.course(course),!held); checks++;
  if(held){ storage.set('cts_textbook_preachingreadings_passed','2026-10-10'); assert.equal(!!record.course(course),true); checks++; }
  assert.equal(JSON.parse(storage.get('cts_done_codes')||'[]').includes('WISESPEAK'),true); checks++;
}
const wsHtml=fs.readFileSync('public/CTS_WiseSpeak_Preaching.html','utf8');
assert.ok(wsHtml.indexOf('cts-required-tests.js')<wsHtml.indexOf('assets/js/cts-record.js')); checks++;
assert.ok(wsHtml.includes("CTSRecord.singleCourse('WISESPEAK')")&&wsHtml.includes('id="cts-ws-hold"')); checks++;
console.log(`PASS — ${checks} single-course recorder assertions`);
