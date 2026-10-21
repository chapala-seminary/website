// The submitted review follows server verdicts, including delayed grading.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {GradingStub,STUB_CODE} from './lib/grading-stub.mjs';
const base=process.argv[2]||'http://127.0.0.1:8798';
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
let checks=0;const ok=(value,label)=>{assert.ok(value,label);checks++;};
try{
  for(const lang of ['en','es','fr'])for(const [slug,pendingCount] of [['doctrines',2],['doctrines',1],['streadings',0]]){
    const scope=(slug==='doctrines'?'tb:':'rd:')+slug;
    const file=slug==='doctrines'?'CTSTextbookFundamentalDoctrinesTest.html':'CTSSTReadingsTest.html';
    const stub=new GradingStub({track:'mdiv',lockMs:15*60*1000});
    const context=await browser.newContext();
    await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.fallback():r.abort());
    await stub.install(context);
    await context.addInitScript(({lang,code})=>{
      window.CTS_GRADING_TEST={pollMs:[100,150],codeWaitMs:1000,timeoutMs:4000};
      localStorage.setItem('cts_student',JSON.stringify({name:'Synthetic Feedback Learner',track:'mdiv'}));
      localStorage.setItem('cts_track','mdiv');localStorage.setItem('cts_student_code',code);
      localStorage.setItem('cts_lang',lang);
    },{lang,code:STUB_CODE});
    const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`${base}/${lang==='en'?'':lang+'/'}${file}?cts_lang=${lang}`);
    await page.waitForSelector('input[data-cts-fill]');
    ok(await page.evaluate(()=>Array.isArray(CTS_TEXTBOOK_TEST.questions) && CTS_TEXTBOOK_TEST.questions.length===0 && CTS_TEXTBOOK_TEST.grading==='live'),`${slug}/${lang}: the live page ships no question bank`);
    await page.locator('input[data-cts-fill]').first().fill('wrong response');
    await page.locator('[data-cts-fill-check="0"]').click();
    await page.waitForSelector('.cts-fill-bad');
    ok(await page.locator('.cts-grade-feedback').count()===0,`${slug}/${lang}: grading explanation withheld while answering`);
    ok(await page.locator('#tb-review article').count()===0,`${slug}/${lang}: teaching review withheld before submission`);
    for(let i=1;i<20;i++)await page.locator('input[data-cts-fill]').nth(i).fill(slug==='doctrines'?(i<=pendingCount?'[[pending]]':'[[ai-accept]]'):'wrong response');
    await page.locator('#tb-submit').click();
    if(slug==='doctrines' && pendingCount===2){
      await page.waitForFunction(()=>localStorage.getItem('cts_textbook_doctrines_pending'));
      ok(await page.locator('#tb-review article').count()===0,`${lang}: pending grading does not invent missed answers`);
      const id=await page.evaluate(()=>localStorage.getItem('cts_textbook_doctrines_pending'));
      stub.settle(id);
      await page.waitForFunction(()=>!!localStorage.getItem('cts_textbook_doctrines_passed'));
      ok(await page.locator('#tb-review article').count()===1,`${lang}: only server-rejected item gets review, AI-accepted wording stays right`);
    }else if(slug==='doctrines'){
      await page.waitForFunction(()=>!!localStorage.getItem('cts_textbook_doctrines_passed'));
      ok(await page.locator('#tb-review article').count()===1,`${lang}: passed threshold does not mark the remaining pending answer wrong`);
    }else{
      await page.waitForSelector('#tb-review article');
      ok(await page.locator('#tb-review article').count()===20,`${lang}: failed server attempt explains every missed question`);
      const until=await page.evaluate(()=>+localStorage.getItem('cts_textbook_streadings_lock'));
      ok(until>Date.now()+14*60*1000,`${lang}: fifteen-minute server lock retained`);
      await page.reload();await page.waitForSelector('#tb-review article');
      ok(await page.locator('#tb-review article').count()===20,`${lang}: failed server review survives reload`);
      ok(await page.locator('#tb-submit').isDisabled(),`${lang}: reload keeps submit locked`);
    }
    ok(errors.length===0,`${slug}/${lang}: no browser exception: ${errors.join('; ')}`);
    ok(stub.log.filter(call=>call.method==='POST' && call.path.endsWith('/submit')).length===1,`${slug}/${lang}: one server submission`);
    await context.close();
  }
  console.log(`PASS — ${checks} live server-verdict, pending-review and no-key checks.`);
}finally{await browser.close();}
