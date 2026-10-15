// Exercise the actual beta flag, D1 cutoff and completion policy in isolation.
// The main suite continues to use its production-like, inactive configuration.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawn,execFileSync} from 'node:child_process';
import {chromium} from 'playwright';
import catalog from '../worker/catalog.json' with {type:'json'};
const port=Number(new URL(process.env.API_BASE||'http://127.0.0.1:8798').port)+100;
const base=`http://127.0.0.1:${port}`;
const dir=fs.mkdtempSync(path.resolve('.wrangler-activation-'));
const config='test/wrangler.local.jsonc';
const sql=file=>execFileSync('npx',['wrangler','d1','execute','chapala-students','--local','--persist-to',dir,'--config',config,'--file',file],{stdio:'pipe'});
let worker,log,browser,checks=0;
const check=(value,label)=>{assert.ok(value,label);checks++;};
const post=async(route,body)=>{const r=await fetch(base+route,{method:'POST',headers:{'content-type':'application/json','x-test-grading-mode':'shadow'},body:JSON.stringify(body)});return{status:r.status,body:await r.json()};};
const get=async(route)=>(await (await fetch(base+route)).json());
async function start(){
 log=fs.openSync(path.join(dir,'dev.log'),'a');
 worker=spawn('npx',['wrangler','dev','--config',config,'--port',String(port),'--persist-to',dir,'--var','MASTER_TESTS_ACTIVATION:beta'],{stdio:['ignore',log,log],detached:true});
 for(let i=0;i<60;i++){
  try{const r=await fetch(base+'/api/health');if(r.ok)return;}catch{}
  await new Promise(r=>setTimeout(r,500));
 }
 throw new Error('isolated activation Worker did not start');
}
async function stop(){if(worker){try{process.kill(-worker.pid,'SIGTERM');}catch{}await new Promise(r=>worker.once('exit',r));worker=null;fs.closeSync(log);}}
try{
 const migration=path.join(dir,'setup.sql');
 fs.writeFileSync(migration,fs.readdirSync('migrations').filter(f=>f.endsWith('.sql')).sort().map(f=>fs.readFileSync('migrations/'+f,'utf8')).join('\n')+`\n
 INSERT INTO students (id,name,email,track,created_at,updated_at) VALUES
 ('CTS-TEST-0000-0011','Synthetic Older Master','older-master@example.test','mdiv','2001-01-01T00:00:00Z','2001-01-01T00:00:00Z'),
 ('CTS-TEST-0000-0012','Synthetic Older Certificate','older-cert@example.test','mdiv','2001-01-01T00:00:00Z','2001-01-01T00:00:00Z');
 INSERT INTO course_completions(student_id,code,track,completed_at) VALUES
 ('CTS-TEST-0000-0011','CTSOTS','mdiv','2001-01-01T00:00:00Z'),
 ('CTS-TEST-0000-0012','CTSOTS','cert','2001-01-01T00:00:00Z');
 `);
 sql(migration);await start();
 const policy=(await get('/api/health')).requiredFrom;
 check(Object.keys(policy).length===79,'all 79 staged requirements activate');
 check(new Set(Object.values(policy)).size===1,'one cutoff for the cohort');
 const date=Object.values(policy)[0];check(!Number.isNaN(Date.parse(date)),'server records a real cutoff');
 const old=await get('/api/student/CTS-TEST-0000-0011');
 check(old.exemptions.includes('oldtestament') && old.exemptions.includes('otsreadings'),'older master completion exempts both new tests');
 const cert=await get('/api/student/CTS-TEST-0000-0012');
 check(!cert.exemptions.includes('otsreadings'),'earlier Certificate work cannot exempt master work');
 const ots=catalog.courses.ots;const tests=ots.tests;
 const progress=ots.units.map(unit=>({course:'ots',unit,completedAt:new Date().toISOString()}));
 for(const track of ['mdiv','thm','cert','assoc']){
  const reg=await post('/api/register',{name:'Synthetic Activation '+crypto.randomUUID(),email:`activation-${crypto.randomUUID()}@example.test`,track:track==='assoc'?'cert':track,...(track==='assoc'?{goal:'assoc'}:{})});
  check(reg.status===201,'synthetic student registers');const code=reg.body.code;
  const submit=async(passes)=>post('/api/sync',{code,progress,textbooks:passes.map(slug=>({slug,passedAt:new Date().toISOString()})),doneCodes:['CTSOTS'],completionTracks:{CTSOTS:track}});
  let result=await submit([]);
  if(['mdiv','thm'].includes(track)){
   check(!result.body.doneCodes.includes('CTSOTS'),track+': units alone do not complete');
   result=await submit([tests[0]]);check(!result.body.doneCodes.includes('CTSOTS'),track+': book alone does not complete');
   result=await submit([tests[1]]);check(result.body.doneCodes.includes('CTSOTS'),track+': both passes complete');
  }else check(result.body.doneCodes.includes('CTSOTS'),track+': tests remain optional');
  await fetch(base+'/api/student/'+code,{method:'DELETE'});
 }
 // Reading alone must also be insufficient; monotonic merges above tested book first.
 const reg=await post('/api/register',{name:'Synthetic Reading Only',email:'activation-reading-only@example.test',track:'mdiv'});
 const reading=await post('/api/sync',{code:reg.body.code,progress,textbooks:[{slug:tests[1],passedAt:new Date().toISOString()}],doneCodes:['CTSOTS'],completionTracks:{CTSOTS:'mdiv'}});
 check(!reading.body.doneCodes.includes('CTSOTS'),'reading alone does not complete');
 await fetch(base+'/api/student/'+reg.body.code,{method:'DELETE'});
 browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
 const page=await browser.newPage();await page.goto(base+'/CTSUnit1.html?cts_lang=en');
 await page.waitForFunction(()=>Object.keys(JSON.parse(localStorage.getItem('cts_required_from')||'{}')).length===79);
 check(await page.locator('#cts-master-requirements').count()===0,'activation policy loads without injecting a page-top notice');
 await page.evaluate(()=>window.CTS_SYNC.restore('CTS-TEST-0000-0011'));
 check(await page.evaluate(()=>!!localStorage.getItem('cts_textbook_otsreadings_exempt')),'older exemption follows recovery to another browser');
 await browser.close();browser=null;
 await stop();await start();check((await get('/api/health')).requiredFrom.otsreadings===date,'later deployment/restart retains the original cutoff');
 console.log(`PASS — ${checks} actual beta-activation checks: 79 tests, both-test gates, earlier completions, recovery and stable cutoff.`);
}finally{
 if(browser)await browser.close();await stop();fs.rmSync(dir,{recursive:true,force:true});
}
