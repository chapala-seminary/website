import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE = process.argv[2] || 'http://127.0.0.1:8918';
const catalog = JSON.parse(fs.readFileSync('worker/catalog.json'));
const browser = await chromium.launch();
let checks = 0;
try {
 for (const [slug, selector] of [['hermeneutics','#cert-view'],['evanpreach','#certWrap'],['missions','#cert-wrap'],['cs','#certWrap']]) {
  for (const lang of ['en', 'es']) for (const initiallyComplete of [false, true]) {
   const c = catalog.courses[slug];
   const ctx = await browser.newContext();
   const page = await ctx.newPage();
   const student = {id:'CTS-TEST-TEST-TEST',name:'Certificate Sync Test',email:'test@example.invalid',track:'cert',email_verified_at:'2026-10-01T00:00:00Z'};
   const state = (complete) => ({student,progress:c.units.filter((_,i)=>complete||i>0).map(unit=>({course:slug,unit})),doneCodes:[c.code],completions:[{code:c.code,track:'cert',email_verified_at:'2026-10-01T00:00:00Z'}],textbooks:[],certificates:[]});
   let release;
   const pending = new Promise(r=>{release=r;});
   await ctx.addInitScript(({s,lang})=>{localStorage.setItem('cts_student',JSON.stringify(s));localStorage.setItem('cts_student_code',s.id);localStorage.setItem('cts_lang',lang);const interval=window.setInterval.bind(window);window.setInterval=(fn,ms,...args)=>interval(fn,ms===250||ms===500?5:ms,...args);},{s:student,lang});
   await page.route('**/api/**',async route=>{
    const path = new URL(route.request().url()).pathname;
    if(path==='/api/health')return route.fulfill({json:{ok:true}});
    if(path==='/api/sync'){await pending;return route.fulfill({json:state(initiallyComplete)});}
    if(path.startsWith('/api/student/'))return route.fulfill({json:state(true)});
    if(path==='/api/certificate')return route.fulfill({json:{verifyCode:'TESTVERIFY',reissued:true}});
    return route.fulfill({status:503,json:{error:'offline test'}});
   });
   await page.goto(BASE+'/'+catalog.completions[c.code].page);
   assert.equal(await page.locator(selector).isVisible(),false,slug+' initially locked'); checks++;
   // Let both original polling windows expire before progress arrives.
   await page.waitForTimeout(500);
   release();
   await page.waitForFunction(slug=>localStorage.getItem('cts_'+slug+'_progress'),slug);
   if(!initiallyComplete){
    assert.equal(await page.locator(selector).isVisible(),false,slug+' missing required unit remains locked'); checks++;
    assert.equal(await page.evaluate(async code=>(await CTS_SYNC.restore(code)).ok,student.id),true);
   }
   await page.locator(selector).waitFor({state:'visible'}); checks++;
   await page.locator('#cts-cert-pdf').waitFor({state:'visible'}); checks++;
   await page.locator('#cts-cert-verify').waitFor({state:'visible'}); checks++;
   if(slug==='hermeneutics')assert.equal(await page.locator('#locked-view').isVisible(),false);
   // Repeated completed restores must neither relock nor duplicate the progress list.
   await page.evaluate(async code=>CTS_SYNC.restore(code),student.id);
   assert.equal(await page.locator(selector).isVisible(),true); checks++;
   await ctx.close();
  }
 }
 // A restored master's record must still wait for the situations textbook.
 {
  const ctx = await browser.newContext(); const page = await ctx.newPage();
  const student = {id:'CTS-TEST-TEST-TEST',name:'Textbook Hold Test',track:'mdiv'};
  const state = {student,progress:catalog.courses.cs.units.map(unit=>({course:'cs',unit})),doneCodes:[],completions:[],textbooks:[]};
  await ctx.addInitScript(s=>{localStorage.setItem('cts_student',JSON.stringify(s));localStorage.setItem('cts_student_code',s.id);localStorage.setItem('cts_track',s.track);},student);
  await page.route('**/api/**',route=>route.fulfill({json:new URL(route.request().url()).pathname==='/api/health'?{ok:true}:state}));
  await page.goto(BASE+'/CTSCSCertificate.html');
  await page.evaluate(async id=>CTS_SYNC.restore(id),student.id);
  await page.waitForTimeout(600);
  assert.equal(await page.locator('#certWrap').isVisible(),false); checks++;
  assert.equal(await page.locator('#cts-cert-pdf').count(),0); checks++;
  await ctx.close();
 }
 // A course earned at Associate rigor must not appear to be an M.Div award
 // just because the learner later selects M.Div as the CURRENT program.
 // These are synthetic browser records; no student or production data touched.
 for (const scenario of [
   { track:'mdiv', goal:'', expected:'Current program: Master of Divinity (M.Div.)' },
   { track:'cert', goal:'assoc', expected:'Current program: Associate of Divinity' }
 ]) {
   const ctx=await browser.newContext();
   const page=await ctx.newPage();
   const student={
     id:'CTS-TEST-TEST-TEST',name:'Earned Level Test',track:scenario.track,
     goal:scenario.goal,email_verified_at:null
   };
   const state={
     student,
     progress:catalog.courses.hermeneutics.units.map(unit=>({course:'hermeneutics',unit})),
     doneCodes:['CTSHERMENEUTICS'],
     completions:[{code:'CTSHERMENEUTICS',track:'assoc'}],
     textbooks:[],certificates:[]
   };
   await ctx.addInitScript(({s})=>{
     localStorage.setItem('cts_student',JSON.stringify(s));
     localStorage.setItem('cts_student_code',s.id);
     localStorage.setItem('cts_track',s.track);
     if(s.goal)localStorage.setItem('cts_goal',s.goal);
     for(let unit=1;unit<=11;unit++)localStorage.setItem('cts_herm_u'+unit+'_passed','true');
   },{s:student});
   await page.route('**/api/**',route=>{
     const api=new URL(route.request().url()).pathname;
     if(api==='/api/health')return route.fulfill({json:{ok:true}});
     if(api==='/api/sync'||api.startsWith('/api/student/'))
       return route.fulfill({json:state});
     return route.fulfill({status:503,json:{error:'test offline'}});
   });
   await page.goto(BASE+'/CTSHermeneuticsCertificate.html');
   await page.locator('#cert-view').waitFor({state:'visible'});
   const label=await page.locator('#track-label').textContent();
   assert.ok(label.includes(scenario.expected),'current-program label expected '+scenario.expected+'; got '+label);checks++;
   const note=await page.locator('#program-not-credit').textContent();
   assert.ok(note.includes('current enrollment')&&note.includes('not necessarily'),
     'the certificate distinguishes enrollment from the earned credit level');checks++;
   assert.ok(!label.includes('Master of Divinity Track'),
     'a bare M.Div. Track label must not be presented as an earned credential');checks++;
   await ctx.close();
 }
 console.log(`${checks} certificate sync checks passed (initial sync, partial record, subsequent restore, repeat restore).`);
} finally {await browser.close();}
