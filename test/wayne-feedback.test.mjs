/* Wayne's October 15 reports: every explanation is grounded in a real source;
 * submission, reload, language switching and retakes preserve the exam rules.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { parse } from 'node-html-parser';
import { chromium } from 'playwright';
import { leafKey, loadStore } from '../tools/french-readings-lib.mjs';
import { textbookQuestions, readingQuestions } from '../tools/grading-keys-lib.mjs';
const base = process.argv[2] || 'http://127.0.0.1:8798';
const langs = ['en','es','fr'];
let checks=0, passages=0;
const ok=(value,message)=>{assert.ok(value,message);checks++;};
/* Textbook answer/accept live in assessment-keys; public JSON has prompts only. */
const books=['textbooks','readings'].flatMap(kind=>fs.readdirSync(`src/content/${kind}`).filter(f=>f.endsWith('.json')).map(f=>{
  const bank=JSON.parse(fs.readFileSync(`src/content/${kind}/${f}`,'utf8'));
  // a private reading bank (keys: "private") takes its keys from assessment-keys; a public one is as it is
  if(kind!=='textbooks') return {...bank, test:{...bank.test, questions:readingQuestions('.', bank).questions}};
  const {questions:keyed}=textbookQuestions('.', bank.slug);
  const questions=bank.test.questions.map((q,i)=>({...q, answer:keyed[i]?.answer, ...(keyed[i]?.accept?{accept:keyed[i].accept}:{})}));
  return {...bank, test:{...bank.test, questions}};
}));
const documents=new Map(), plainDocuments=new Map();
const documentFor=file=>{if(!documents.has(file)) documents.set(file,parse(fs.readFileSync(`dist/${file}`,'utf8')));return documents.get(file);};
const normal=s=>s.replace(/\s+/g,' ').trim();
for(const bank of books) for(const lang of langs) {
  const file=`${lang==='en'?'':lang+'/'}${bank.page}Test.html`;
  const doc=documentFor(file);
  // A live build keeps the passages off the test page, as JSON only the Worker
  // sends after a pass (answer-disclosure policy, 18 Oct 2026); a shadow build
  // loads them on the page as before.
  const asset=doc.querySelector('script[src^="/assets/exam-review/"]')?.getAttribute('src');
  const kept=`dist/assets/exam-review/${bank.slug}.${lang}.json`;
  ok(asset || fs.existsSync(kept),`${bank.slug}/${lang} has a review asset`);
  let review;
  if(asset){const window={};vm.runInNewContext(fs.readFileSync(`dist${asset}`,'utf8'),{window});review=window.CTS_EXAM_REVIEW;}
  else review=JSON.parse(fs.readFileSync(kept,'utf8'));
  ok(review.slug===bank.slug && review.questions.length===40,`${bank.slug}/${lang}: all forty questions have explanations`);
  for(const [index,item] of review.questions.entries()) {
    ok(item.paragraphs.length>=1&&item.paragraphs.length<=2,`${bank.slug}/${lang}/${index}: one or two paragraphs`);
    const url=new URL(item.href,'https://chapalaseminary.org');
    const source=documentFor(url.pathname.slice(1));
    const cited=source.querySelector(url.hash);
    ok(cited,`${bank.slug}/${lang}/${index}: cited section exists`);
    ok(normal(cited.text).includes(normal(item.paragraphs[0])),`${bank.slug}/${lang}/${index}: primary passage is in the exact linked section`);
    if(bank.slug==='doctrines' && index===14) {
      ok(item.paragraphs[0].split(/\s+/).length<=260,`${lang}: Torrey's long attributes paragraph has a focused review passage`);
      ok(item.paragraphs[0].toLowerCase().includes(bank.test.questions[index].answer[lang].toLowerCase()),`${lang}: Torrey's focused passage retains the relevant teaching`);
    }
    const actualLanguage=cited.querySelector('.cts-reading[lang]')?.getAttribute('lang') || cited.closest('[lang]')?.getAttribute('lang') || source.querySelector('html')?.getAttribute('lang');
    ok(!actualLanguage || item.lang===actualLanguage,`${bank.slug}/${lang}/${index}: teaching quotation declares its actual language`);
    const sourceKey=url.pathname;
    if(!plainDocuments.has(sourceKey)) {
      const content=parse(source.toString());for(const n of content.querySelectorAll('.cts-source'))n.remove();
      plainDocuments.set(sourceKey,normal(content.text));
    }
    const plain=plainDocuments.get(sourceKey);
    for(const p of item.paragraphs) {
      ok(p.length>=35 && normal(p).split(' ').length>=5,`${bank.slug}/${lang}/${index}: explanation is prose, not a bare key`);
      ok(plain.includes(normal(p)),`${bank.slug}/${lang}/${index}: explanation is actually in its cited source`);passages++;
    }
  }
}
// The reading-room notices must describe the same disclosure rule as the
// live Worker: right/wrong while answering; keys and explanations only after
// a pass. This copy used to promise the right answer immediately even after
// the Worker had stopped disclosing it.
{
  const {memory}=loadStore();
  const roomDir='src/body/rooms';
  const expected={
    en:['marked right or wrong at once','after the attempt passes'],
    es:['correcta o incorrecta en seguida','después de aprobar el intento'],
    fr:['correcte ou incorrecte','après la réussite de la tentative'],
  };
  let notices=0;
  for(const file of fs.readdirSync(roomDir).filter(f=>f.endsWith('.html'))){
    const root=parse(fs.readFileSync(`${roomDir}/${file}`,'utf8'));
    for(const id of ['cts-textbook','cts-required']){
      const notice=root.querySelector(`#${id}`);if(!notice)continue;
      notices++;
      const en=notice.querySelector('.lang-en'),es=notice.querySelector('.lang-es');
      for(const [lang,node] of [['en',en],['es',es]]){
        const text=normal(node?.text||'').toLowerCase();
        ok(!/right answer (?:is )?shown|se muestra la correcta|mostrando la respuesta correcta/.test(text),`${file} ${id}: ${lang} does not promise an immediate key`);
        if(id==='cts-textbook' || text.includes(expected[lang][0]))
          for(const phrase of expected[lang])ok(text.includes(phrase),`${file} ${id}: ${lang} states the live review rule`);
      }
      const translated=en&&memory.get(leafKey(en.innerHTML));
      ok(!!translated,`${file} ${id}: French translation follows the current English notice`);
      const fr=normal(translated?.fr||'').toLowerCase();
      ok(!/bonne réponse est indiquée/.test(fr),`${file} ${id}: French does not promise an immediate key`);
      if(id==='cts-textbook' || normal(en?.text||'').toLowerCase().includes(expected.en[0]))
        for(const phrase of expected.fr)ok(fr.includes(phrase),`${file} ${id}: French states the live review rule`);
    }
  }
  ok(notices>=70,'the disclosure-copy check covers the textbook and reading notices',notices);
}
console.log(`PASS — ${passages} teaching passages verified in their linked source sections.`);
if(process.argv.includes('--static'))process.exit(0);
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
try {
  for(const slug of ['doctrines','streadings','joshua','wrreadings']) for(const lang of langs) {
    const bank=books.find(b=>b.slug===slug),ctx=await browser.newContext();
    await ctx.addInitScript(() => { try { sessionStorage.setItem('cts_pledge_all', '1'); } catch (e) {} }); // exam pledge (cts-integrity.js)
    await ctx.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
    const page=await ctx.newPage();
    await page.clock.install();
    await page.addInitScript(()=>{localStorage.setItem('cts_track','mdiv');});
    const url=`${base}/${lang==='en'?'':lang+'/'}${bank.page}Test.html?cts_lang=${lang}`;
    await page.goto(url);await page.waitForSelector('input[data-cts-fill]');
    const draw=await page.evaluate(()=>CTS_TEXTBOOK.draw());
    await page.locator('input[data-cts-fill]').first().fill('synthetic unrelated response');
    await page.locator('[data-cts-fill-check="0"]').click();
    ok((await page.locator('.cts-fill-bad').innerText()).trim()===({en:'✗ Incorrect.',es:'✗ Incorrecto.',fr:'✗ Incorrect.'}[lang]),`${slug}/${lang}: correctness only before submission`);
    ok(await page.locator('input[data-cts-fill]').first().isDisabled(),`${slug}/${lang}: checked response fixed`);
    ok(await page.locator('#tb-review').innerText()==='',`${slug}/${lang}: no explanation before submitting`);
    for(let i=1;i<20;i++)await page.locator('input[data-cts-fill]').nth(i).fill('synthetic unrelated response');
    await page.locator('#tb-submit').click();
    ok(await page.locator('#tb-review article').count()===20,`${slug}/${lang}: every missed question explained after submission`);
    ok(await page.locator('#tb-review blockquote p').count()>=20,`${slug}/${lang}: teaching paragraphs rendered`);
    ok(await page.locator('#tb-review article a').count()===20,`${slug}/${lang}: sources linked`);
    const state=await page.evaluate(s=>({lock:+localStorage.getItem(`cts_textbook_${s}_lock`),review:CTS_TEXTBOOK.state().review}),slug);
    ok(state.lock>Date.now()+14*60*1000,`${slug}/${lang}: master's fifteen-minute wait preserved`);
    await page.reload();await page.waitForSelector('#tb-review article');
    ok(await page.locator('#tb-review article').count()===20,`${slug}/${lang}: submitted review survives reload`);
    ok(await page.locator('#tb-submit').isDisabled(),`${slug}/${lang}: reload does not bypass lock`);
    await page.clock.fastForward(15*60*1000+2500);
    ok(await page.locator('#tb-review article').count()===0,`${slug}/${lang}: retake clears previous review`);
    ok(JSON.stringify(await page.evaluate(()=>CTS_TEXTBOOK.draw()))!==JSON.stringify(draw),`${slug}/${lang}: retake draws a fresh twenty`);
    await ctx.close();
  }
  // Reported routes, storage preferences, native language links and tablet/phone layouts.
  for(const width of [360,800]) for(const stored of langs) {
    const ctx=await browser.newContext({viewport:{width,height:1000},isMobile:true,hasTouch:true});
    await ctx.addInitScript(() => { try { sessionStorage.setItem('cts_pledge_all', '1'); } catch (e) {} }); // exam pledge (cts-integrity.js)
    await ctx.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
    await ctx.addInitScript(value=>{if(!sessionStorage.getItem('seeded')){localStorage.setItem('cts_lang',value);sessionStorage.setItem('seeded','1');}},stored);
    const page=await ctx.newPage();
    await page.goto(`${base}/fr/CTSBibleUnit1.html?cts_lang=fr`);
    ok(new URL(page.url()).pathname === '/fr/CTSBibleUnit1.html',`Bible/${width}/${stored}: direct French URL wins over saved language`);
    ok((await page.locator('h1').innerText()).includes('Pouvons-nous'),`Bible/${width}/${stored}: direct URL visibly French`);
    for(const file of ['index.html','CTSBibleUnit1.html','CTSSTUnit1.html']) {
      await page.goto(`${base}/${file}?cts_lang=en`);
      for(const lang of ['fr','en','es','fr']) {
        await page.locator(`[data-cts-lang="${lang}"]`).click();
        await page.waitForURL(u=>u.pathname===`/${lang==='en'?'':lang+'/'}${file}`);
        ok(await page.locator('html').getAttribute('lang')===lang,`${file}/${width}/${stored}: ${lang} link works`);
        ok(await page.locator('[data-cts-lang][aria-current="page"]').getAttribute('data-cts-lang')===lang,`${file}: selected language agrees`);
      }
      if(file==='CTSBibleUnit1.html') {
        ok((await page.locator('h1').innerText()).includes('Pouvons-nous'),`Bible/${width}/${stored}: visible French, not only French URL`);
        ok(await page.locator('html').getAttribute('translate')==='no','native French protected from browser retranslation');
      }
      if(file==='CTSSTUnit1.html') {
        for(const resource of ['CTSTextbookFundamentalDoctrines.html','CTSTextbookFundamentalDoctrinesTest.html','CTSSTReadings.html','CTSSTReadingsTest.html']) ok(await page.locator(`a[href="/fr/${resource}"]`).count()>0,`ST French links to ${resource}`);
        ok((await page.locator('[data-cts-rrbox]').innerText()).includes('facultative'),'French program guidance visible');
      }
      ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${file}/${width}: no sideways scroll`);
    }
    await page.goto(`${base}/fr/CTSWRUnit1.html`);
    const box=page.locator('[data-cts-rrbox]');
    ok(await box.locator('a[href="/fr/CTSWRRequired.html"]').count()===1,'World Religions distinguishes assigned set');
    ok(await box.locator('a[href="/fr/CTSWRReadings.html"]').count()===1,'World Religions preserves separate honors set');
    await ctx.close();
  }
  console.log(`PASS — ${checks} Wayne feedback, navigation, source and resource checks.`);
} finally {await browser.close();}
