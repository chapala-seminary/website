// Every reading and textbook test now has French (machine drafts): a French
// prompt shows once, with its English source beside it, never duplicated.
// (The English fallback for a missing French prompt has no real page left to test.)
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const base=process.argv[2]||'http://127.0.0.1:8798';
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
let checks=0;
try {
 for(const width of [1280,375]){
  const context=await browser.newContext({ extraHTTPHeaders: { 'x-test-grading-mode': 'shadow' }, viewport:{width,height:900}});
  try{
   await context.addInitScript(()=>localStorage.setItem('cts_show_source','true'));
   const page=await context.newPage();
   for(const file of ['CTSJohnReadingsTest.html','CTSTextbookCultsTest.html']){
    await page.goto(`${base}/fr/${file}?cts_lang=fr`);
    await page.waitForSelector('.cts-fill-q');
    const prompts=await page.locator('.cts-fill-q > p:first-child').evaluateAll(nodes=>nodes.map(node=>({language:node.querySelector('.cts-reading')?.lang,sources:node.querySelectorAll('.cts-source').length,text:node.innerText})));
    assert.equal(prompts.length,20);checks++;
    for(const prompt of prompts){assert.equal(prompt.language,'fr');assert.equal(prompt.sources,1);assert.ok(prompt.text.trim());checks+=3;}
   }
  }finally{await context.close();}
 }
 console.log(`PASS — ${checks} French test-prompt checks: French shown, its English source once, desktop and phone.`);
}finally{await browser.close();}
