// Synthetic students only: faculty approval, fifteen real courses, exams,
// recovery, catalog access and withdrawal through the actual Worker and D1.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { chromium } from 'playwright';
import catalog from '../worker/catalog.json' with { type: 'json' };
const BASE = process.env.API_BASE || 'http://127.0.0.1:8798';
let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks++; };
const post = async (path, body) => {
  const r = await fetch(BASE + path, {method:'POST', headers:{'content-type':'application/json','x-test-grading-mode':'shadow'}, body:JSON.stringify(body)});
  return {status:r.status, body:await r.json()};
};
const get = async path => (await fetch(BASE + path)).json();
const {key} = JSON.parse(fs.readFileSync(new URL('./fixtures/access-test-key.json', import.meta.url)));
const b64 = v => Buffer.from(JSON.stringify(v)).toString('base64url');
const jwt = b64({alg:'RS256',kid:'cts-test-1'})+'.'+b64({aud:['cts-test-aud'],iss:'https://cts-test.cloudflareaccess.com',exp:Math.floor(Date.now()/1000)+600,email:'faculty-plan@example.test'});
const headers = {'cf-access-jwt-assertion':jwt+'.'+crypto.sign('sha256',Buffer.from(jwt),crypto.createPrivateKey({key,format:'jwk'})).toString('base64url'),origin:BASE};
const staff = (path, init={}) => fetch(BASE+path,{...init,headers:{...headers,...init.headers},redirect:'manual'});
const foundation = ['CTSOTS','CTSNT','CTSST','CTSEVANGELISM','CTSPM','CTSCH','WISESPEAK'];
const replaceable = foundation.filter(c=>!['CTSST','WISESPEAK'].includes(c));
const replacements = ['CTSPENTECOSTAL','CTSJOHN','CTSPSALMS','CTSMATT','CTSROMANS'];
const substitutions = Object.fromEntries(replaceable.map((c,i)=>[c,replacements[i]]));
const required = ['CTSST','WISESPEAK',...replacements];
const courses = [...required,...Object.keys(catalog.completions).filter(c=>!foundation.includes(c)&&!required.includes(c))].slice(0,15);
const tag = crypto.randomUUID();
const name = 'Synthetic ThM Plan '+tag;
const registration = await post('/api/register',{name,email:tag+'@example.test',track:'thm'});
check(registration.status===201,'synthetic Th.M. student registers');
const code=registration.body.code;
const row=(await (await staff('/staff/students.json')).json()).find(r=>r.name===name);
const path='/staff/students/'+row.n+'/thm-plan';
const save = (plan, revision=0, extra={}, requestHeaders={}) => staff(path,{method:'POST',headers:requestHeaders,body:new URLSearchParams({revision:String(revision),facultyApproved:'yes',action:'approve',...plan,...extra})});
let browser;
try {
  check((await fetch(BASE+path)).status===403,'student credentials cannot access faculty approvals');
  check((await save(substitutions,0,{}, {origin:'https://other.example'})).status===403,'cross-site approval refused');
  check((await save(substitutions,0,{facultyApproved:''})).status===400,'explicit faculty approval required');
  check((await save({...substitutions,CTSOTS:'CTSST'})).status===400,'foundation courses cannot stand in for the five replacements');
  check((await save({...substitutions,CTSNT:substitutions.CTSOTS})).status===400,'one replacement cannot fill two foundation slots');
  check((await save({...substitutions,CTSOTS:'NOT_A_COURSE'})).status===400,'unknown replacement refused');
  check((await save({...substitutions,CTSOTS:'constructor'})).status===400,'inherited object properties are not CTS courses');
  let state=(await post('/api/sync',{code,thmStudyPlan:{substitutions}})).body;
  check(!state.thmStudyPlan,'public sync cannot self-approve a plan');
  check((await save(substitutions)).status===303,'faculty can save a valid individual plan');
  check((await save(substitutions)).status===409,'a stale faculty form cannot overwrite a newer plan');
  state=await get('/api/student/'+code);
  check(JSON.stringify(state.thmStudyPlan.substitutions)===JSON.stringify(substitutions),'approved plan follows student recovery');
  check(state.completions.length===0,'approval manufactures no completions');
  const challenge=await post('/api/email/start',{code,email:tag+'@example.test'});
  check((await post('/api/email/confirm',{code,verification:challenge.body.devCode})).status===200,'synthetic student confirms email locally');
  const allTests=Object.entries(catalog.textbooks).filter(([,t])=>courses.includes(t.code)).map(([slug])=>slug);
  const progress=Object.entries(catalog.courses).filter(([,c])=>courses.includes(c.code)).flatMap(([course,c])=>c.units.map(unit=>({course,unit})));
  const sync = (done, tests=allTests) => post('/api/sync',{code,progress,doneCodes:done,completionTracks:Object.fromEntries(done.map(c=>[c,'thm'])),textbooks:tests.map(slug=>({slug,passedAt:new Date().toISOString()}))});
  state=(await sync(courses,allTests.filter(s=>s!=='pentecostalreadings'))).body;
  check(!state.completions.some(c=>c.code==='CTSPENTECOSTAL'),'substitution cannot bypass an active required-reading exam');
  check(!state.degrees.thm,'fourteen completed courses do not earn the degree');
  check((await post('/api/certificate',{code,level:'thm',title:'Master of Theology'})).status===409,'server refuses a degree at fourteen courses');
  state=(await sync(courses)).body;
  check(state.completions.length===15&&state.degrees.thm,'fifteen actual master completions with the approved core earn Th.M.');
  check(!state.degrees.mdiv,'the Th.M. exception does not alter M.Div. requirements');
  check(replaceable.every(c=>!state.doneCodes.includes(c)),'substituted foundations are never inserted as passes');
  const award=await post('/api/certificate',{code,level:'thm',title:'Master of Theology'});
  check(award.status===201,'server issues the diploma for fifteen completed courses');
  const roster=(await (await staff('/staff/students.json')).json()).find(r=>r.n===row.n);
  check(roster.foundation==='7/7'&&roster.program_progress==='15/15','staff progress uses approved required courses and fifteen-course total');
  // A lower-level pass cannot satisfy either protected course.
  const module=fs.readFileSync('worker/awards.js','utf8').replace(/import catalog from '\.\/catalog\.json';/,`const catalog=${JSON.stringify(catalog)};`);
  const {degreeShortfall}=await import('data:text/javascript,'+encodeURIComponent(module));
  for(const protectedCode of ['CTSST','WISESPEAK']) {
    const extra=Object.keys(catalog.completions).find(c=>!courses.includes(c)&&!foundation.includes(c));
    const done=[...courses,extra].map(c=>({code:c,track:c===protectedCode?'cert':'thm'}));
    check(degreeShortfall('thm',done,'thm',substitutions)!==null,protectedCode+' cannot be replaced or satisfied at Certificate level');
  }
  browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
  const page=await browser.newPage();
  await page.goto(BASE+'/CTSThMCertificate.html?cts_lang=en');
  await page.evaluate(code=>window.CTS_SYNC.restore(code),code);
  await page.waitForFunction(()=>document.getElementById('totalNum').textContent==='15 / 15');
  check(await page.locator('#printBtn').isEnabled(),'recovered degree becomes available without reloading');
  check((await page.locator('#certName').innerText())===name,'recovered diploma refreshes the student name without reloading');
  check((await page.locator('#reqGrid').innerText()).includes('Systematic Theology')&&(await page.locator('#reqGrid').innerText()).includes('Gospel of John'),'progress names protected courses and actual replacements');
  check((await page.locator('#cts-thm-plan-note').innerText()).includes('15 completed CTS courses'),'student sees full requirement and substitution explanation');
  await page.goto(BASE+'/index.html?cts_lang=en');
  check(await page.locator('a.course.cts-locked').count()===0,'approved student can access replacement courses');
  // A fresh student with the approval and no work can access the catalog,
  // but cannot print a degree. No fabricated completion keys are needed.
  await page.evaluate(()=>{localStorage.setItem('cts_done_codes','[]');localStorage.setItem('cts_thm_done_codes','[]');localStorage.setItem('cts_mdiv_done_codes','[]');});
  await page.reload();
  check(await page.locator('a.course.cts-locked').count()===0,'approval permits study before the replaced foundation is completed');
  const form=await (await staff(path)).text();
  const revision=/name="revision" value="(\d+)"/.exec(form)[1];
  check((await save(substitutions,revision,{action:'withdraw'})).status===303,'faculty can withdraw a plan with an audit revision');
  state=await get('/api/student/'+code);
  check(!state.thmStudyPlan&&state.completions.length===15&&!state.degrees.thm,'withdrawal restores normal rules while preserving all earned courses');
  check((await get('/api/verify/'+award.body.verifyCode)).valid===true,'issued certificate verification survives withdrawal');
  await page.evaluate(code=>window.CTS_SYNC.restore(code),code);
  check(await page.locator('a.course.cts-locked').count()>0,'refresh clears withdrawn plan and restores catalog rules');
  await page.goto(BASE+'/CTSThMCertificate.html?cts_lang=en');
  check(!(await page.locator('#printBtn').isEnabled()),'withdrawal restores standard foundation requirement on degree page');
  check((await page.locator('#totalNum').innerText())==='15 / 15','earned courses remain visible after withdrawal');
  console.log(`PASS — ${checks} Th.M. study-plan API/browser checks.`);
} finally {
  if(browser) await browser.close();
  await fetch(BASE+'/api/student/'+code,{method:'DELETE'});
}
