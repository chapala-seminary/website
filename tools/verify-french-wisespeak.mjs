import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.argv[2]||'http://127.0.0.1:8910';
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
try{
 const ctx=await browser.newContext();await ctx.addInitScript(()=>{localStorage.setItem('cts_lang','fr');localStorage.setItem('cts_student',JSON.stringify({name:'French Test',email:'french-test@example.invalid',track:'mdiv'}));localStorage.setItem('cts_track','mdiv');localStorage.setItem('cts_done_codes',JSON.stringify(['CTSOTS','CTSNT','CTSST','CTSEVANGELISM','CTSPM','CTSCH','WISESPEAK']));});
 const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/fr/CTS_WiseSpeak_Preaching.html?cts_lang=fr',{waitUntil:'load'});
 await page.waitForSelector('#mcq_1 .question-card');
 const models=await page.evaluate(()=>Object.entries(UNITS).flatMap(([n,u])=>u.essays.map((q,i)=>({unit:n,index:i,fr:gradeEssay(q,q.rubricFr),empty:gradeEssay(q,''),source:gradeEssay(q,q.rubricEn),oldSource:q.rubricEn.length>=120&&q.kw_en.filter(k=>kwHit(q.rubricEn,k)).length>=3}))));
 assert.equal(models.length,100);assert.deepEqual(models.filter(r=>!r.fr||r.empty||(r.oldSource&&!r.source)),[]);
 const q=await page.evaluate(()=>({correct:UNITS[1].mcq[0].correct,stem:UNITS[1].mcq[0].textFr,fill:CTSFill.questions('wisespeak',1)[0].answer.fr,prompt:CTSFill.questions('wisespeak',1)[0].prompt.fr}));
 assert.ok((await page.locator('#mcq_1 .question-text').first().innerText()).includes(q.stem));
 assert.ok((await page.locator('#fill_1 .cts-fill-q p').first().innerText()).includes(q.prompt));
 await page.locator(`input[name="u1q0"][value="${q.correct}"]`).check();
 assert.ok(await page.locator('#fb_1_0').getAttribute('class').then(c=>c.includes('correct')));
 await page.locator('#fill_1 input[data-cts-fill="0"]').fill(q.fill);
 await page.locator('#fill_1 button[data-cts-fill-check="0"]').click();
 assert.ok(await page.locator('#fill_1 .cts-fill-ok').first().isVisible());
 await page.reload({waitUntil:'load'});
 assert.equal(await page.locator('#fill_1 input[data-cts-fill="0"]').inputValue(),q.fill);
 assert.equal(await page.locator(`input[name="u1q0"][value="${q.correct}"]`).isChecked(),true);
 assert.deepEqual(errors,[]);
 console.log('PASS — 100 WiseSpeak French models, source preservation, empty rejection, French MC/fill rendering and grading, saved attempts.');
}finally{await browser.close();}
