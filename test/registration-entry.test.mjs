// Every registration entry point reaches the real local Worker and D1.
// Synthetic profiles only; no outside mail or production records.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.env.API_BASE || 'http://127.0.0.1:8798';
const entries=[
 ['index.html','#reg-name','#reg-email','#reg-save'],
 ['CTSUnit1.html','#regName','#regEmail','#regSave'],
 ['CTSCounseling.html','#studentName','#studentEmail','#saveRegBtn'],
 ['CTS_Narrative_Preaching.html','#studentName','#studentEmail','#saveRegBtn'],
 ['CTS_WiseSpeak_Preaching.html','#studentName','#studentEmail','#saveRegBtn'],
 ['ethics_unit01.html','#regName','#regEmail','#regBtn'],
];
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
let checks=0;
try {
 for(const lang of ['en','es','fr']) for(const [file,nameField,emailField,save] of entries){
  console.log(`Checking ${lang}/${file}`);
  const ctx=await browser.newContext({ extraHTTPHeaders: { 'x-test-grading-mode': 'shadow' } });let code;
  try {
   await ctx.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
   await ctx.addInitScript(()=>localStorage.setItem('cts_done_codes',JSON.stringify(['CTSOTS','CTSNT','CTSST','CTSEVANGELISM','CTSPM','CTSCH','WISESPEAK'])));
   const page=await ctx.newPage();page.on('dialog',d=>d.dismiss());
   await page.goto(`${base}/${lang==='en'?'':lang+'/'}${file}?cts_lang=${lang}`);
   const email=`entry-${crypto.randomUUID()}@example.test`;
   await page.locator(nameField).fill('Synthetic Registration '+crypto.randomUUID());
   if(file==='CTSUnit1.html'){
    await page.locator(save).click();assert.equal(await page.evaluate(()=>localStorage.getItem('cts_student')),null);checks++;
    assert.equal(await page.locator('#regError').isVisible(),true);checks++;
   }
   await page.locator(emailField).fill(email);
   if(await page.locator('#reg-country').count()) await page.locator('#reg-country').selectOption('MX');
   for(const field of ['#studentCountry','#regCountry']) {
    const country=page.locator(field);
    if(await country.count()){
     if((await country.evaluate(el=>el.tagName))==='SELECT') await country.selectOption('MX');
     else await country.fill('MX');
    }
   }
   await page.locator(save).click();
   assert.equal(await page.evaluate(()=>!!window.CTS_SYNC),true,`${lang}/${file}: sync client loaded`);checks++;
   await page.evaluate(()=>window.CTS_SYNC.sync());
   await page.waitForFunction(()=>!!localStorage.getItem('cts_student_code'),null,{timeout:18000});
   code=await page.evaluate(()=>localStorage.getItem('cts_student_code'));
   const state=await (await fetch(base+'/api/student/'+code)).json();
   assert.equal(state.student.email,email,`${lang}/${file}: email reaches the record`);checks++;
   assert.equal(state.student.lang,lang,`${lang}/${file}: coursework language reaches the record`);checks++;
   assert.ok(!state.student.email_verified_at,`${lang}/${file}: study registration doesn't require confirmation`);checks++;
   const again=await page.evaluate(()=>window.CTS_SYNC.sync());
   assert.equal(await page.evaluate(()=>localStorage.getItem('cts_student_code')),code);checks++;
   // A second browser restores exactly this record, not a second registration.
   const second=await browser.newContext({ extraHTTPHeaders: { 'x-test-grading-mode': 'shadow' } });try{
    const recovery=await second.newPage();await recovery.goto(`${base}/cts-backup.html?cts_lang=${lang}`);
    const restored=await recovery.evaluate(c=>window.CTS_SYNC.restore(c),code);
    assert.equal(restored.ok,true);checks++;
    assert.equal(await recovery.evaluate(()=>JSON.parse(localStorage.getItem('cts_student')).email),email);checks++;
   }finally{await second.close();}
  }finally{
   if(code)await fetch(base+'/api/student/'+code,{method:'DELETE'});
   await ctx.close();
  }
 }
 for(const lang of ['en','es','fr']) for(const missing of [false,true]) {
  const context=await browser.newContext({ extraHTTPHeaders: { 'x-test-grading-mode': 'shadow' } });let code, unavailable=!missing;
  try {
   const email=`retry-${crypto.randomUUID()}@example.test`;
   await context.route('**/api/register',route=>unavailable?route.fulfill({status:503,contentType:'application/json',body:'{"error":"temporarily unavailable"}'}):route.continue());
   await context.addInitScript(({email,missing})=>{
    localStorage.setItem('cts_student',JSON.stringify({name:'Synthetic Retry '+crypto.randomUUID(),email:missing?'':email,track:'cert'}));
    localStorage.setItem('cts_ots_progress',JSON.stringify({unit1:true}));
   },{email,missing});
   const page=await context.newPage();await page.goto(`${base}/cts-backup.html?cts_lang=${lang}`);
   if(missing){
    await page.waitForFunction(()=>!!localStorage.getItem('cts_student_code'),null,{timeout:18000});
    code=await page.evaluate(()=>localStorage.getItem('cts_student_code'));
    assert.equal(await page.locator('#cts-registration-problem').count(),0);checks++;
    const state=await (await fetch(base+'/api/student/'+code)).json();
    assert.equal(state.student.email,null);checks++;
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('cts_ots_progress')).unit1),true);checks++;
    await page.locator('#cts-email-optional').waitFor({timeout:18000});
    assert.ok(await page.locator('#cts-email-optional').isVisible());checks++;
    continue;
   }
   await page.locator('#cts-registration-problem').waitFor();
   assert.ok(await page.locator('#cts-registration-problem').innerText());checks++;
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('cts_ots_progress')).unit1),true);checks++;
   assert.equal(await page.evaluate(()=>localStorage.getItem('cts_student_code')),null);checks++;
   unavailable=false;await page.locator('#cts-registration-problem button').click();
   await page.waitForFunction(()=>!!localStorage.getItem('cts_student_code'));
   code=await page.evaluate(()=>localStorage.getItem('cts_student_code'));
   await page.waitForFunction(()=>!document.getElementById('cts-registration-problem'));
   const state=await (await fetch(base+'/api/student/'+code)).json();
   assert.equal(state.student.email,email);checks++;
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('cts_ots_progress')).unit1),true);checks++;
  }finally{if(code)await fetch(base+'/api/student/'+code,{method:'DELETE'});await context.close();}
 }
 console.log(`PASS — ${checks} registration/recovery/retry checks across six entry points in three languages.`);
}finally{await browser.close();}
