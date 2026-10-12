/* Regression for the Counseling and Narrative course completion paths.
 * Run against the built site: node tools/verify-single-completion.mjs <base>
 * Synthetic localStorage only; no real student data or external requests.
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
let checks = 0;
const courses = [
  { code: 'COUNSELING', slug: 'counseling', state: 'cts_drakeford_state', reg: 'cts_drakeford_reg', page: 'CTSCounseling.html', cert: 'CTSCounselingCertificate.html', units: Array.from({length:11}, (_,i)=>i) },
  { code: 'STORYTEL', slug: 'narrative', state: 'cts_storytel_state', reg: 'cts_storytel_reg', page: 'CTS_Narrative_Preaching.html', cert: 'CTSNarrativePreachingCertificate.html', units: Array.from({length:8}, (_,i)=>i+1) }
];
async function open(c, track, count, textbook=false, existing=false, assoc=false) {
  const ctx = await browser.newContext();
  const seed = {
    cts_student: JSON.stringify({name:'Synthetic Completion Test', country:'Test', track, goal:assoc?'assoc':''}),
    cts_track: track,
    cts_done_codes: JSON.stringify(['CTSOTS','CTSNT','CTSST','CTSEVANGELISM','CTSPM','CTSCH','WISESPEAK', ...(existing?[c.code]:[])]),
    cts_mdiv_done_codes: JSON.stringify(existing&&track==='mdiv'?[c.code]:[]),
    cts_thm_done_codes: JSON.stringify(existing&&track==='thm'?[c.code]:[]),
    cts_assoc_done_codes:'[]',
    [c.state]:JSON.stringify(Object.fromEntries(c.units.slice(0,count).map(i=>[i,{passed:true}]))),
    [c.reg]:JSON.stringify({name:'Synthetic Completion Test',country:'Test',track:track==='thm'?'mtheol':track}),
  };
  if(assoc) seed.cts_goal='assoc';
  if(textbook) seed[`cts_textbook_${c.slug}_passed`]='2026-10-10';
  await ctx.addInitScript(s=>{if(!sessionStorage.getItem('seeded')) {for(const [k,v] of Object.entries(s))localStorage.setItem(k,v); sessionStorage.setItem('seeded','1');}},seed);
  await ctx.route('**/*', route=> new URL(route.request().url()).origin===new URL(BASE).origin ? route.continue():route.abort());
  const page = await ctx.newPage();
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto(`${BASE}/${c.page}`, {waitUntil:'load'});
  assert.deepEqual(errors,[],`${c.code}: page errors`); checks++;
  return {ctx,page};
}
async function expectCredit(page,c,track,expected,assoc=false) {
  const r=await page.evaluate(code=>Object.fromEntries(['cts_done_codes','cts_mdiv_done_codes','cts_thm_done_codes','cts_assoc_done_codes','cts_degree_courses'].map(k=>[k,JSON.parse(localStorage.getItem(k)||'[]')])),c.code);
  assert.equal(r.cts_done_codes.includes(c.code),expected,`${c.code} ${track}: general credit`); checks++;
  for(const [k,wanted] of [['cts_mdiv_done_codes',track==='mdiv'],['cts_thm_done_codes',track==='thm'],['cts_assoc_done_codes',assoc]]) {
    assert.equal(r[k].includes(c.code),expected&&wanted,`${c.code} ${track}: ${k}`); checks++;
  }
  if(!expected) {assert.equal(r.cts_degree_courses.includes(c.code==='COUNSELING'?'Counseling':'Narrative Preaching'),false); checks++;}
}
try {
  for(const c of courses) {
    for(const track of ['mdiv','thm']) for(const pass of [false,true]) {
      const {ctx,page}=await open(c,track,c.units.length,pass);
      if(c.code==='STORYTEL') await page.locator('#cts-st-done').click();
      await expectCredit(page,c,track,pass);
      if(c.code==='STORYTEL') {assert.equal(await page.locator('#cts-st-hold').isVisible(),!pass); checks++;}
      if(c.code==='COUNSELING') {
        // A held Master's student is pointed to the textbook test, not to a held certificate.
        assert.equal(await page.locator('#cts-cn-hold').isVisible(),!pass,`COUNSELING ${track}: hold note`); checks++;
        assert.equal(await page.locator('#cts-cn-hold a[href="CTSTextbookCounselingTest.html"]').first().isVisible(),!pass,`COUNSELING ${track}: hold link`); checks++;
        assert.equal(await page.locator('#cts-cn-certlink').isVisible(),pass,`COUNSELING ${track}: certificate link`); checks++;
      }
      await page.goto(`${BASE}/${c.cert}`,{waitUntil:'load'});
      assert.equal(await page.locator('#cts-textbook-hold').isVisible(),!pass); checks++;
      if(!pass) assert.equal(await page.locator('#diploma, #cert-wrap, .diploma, #certificate, .certificate, #cert, .cert-wrap, .sheet, #certCard').first().isVisible(),false);
      await page.goto(`${BASE}/${c.page}`,{waitUntil:'load'});
      // A later textbook pass catches up on reload, without another unit exam.
      if(!pass) {
        await page.evaluate(slug=>localStorage.setItem(`cts_textbook_${slug}_passed`,'2026-10-10'),c.slug);
        await page.reload({waitUntil:'load'});
        await expectCredit(page,c,track,true);
        if(c.code==='COUNSELING') {assert.equal(await page.locator('#cts-cn-hold').isVisible(),false,'COUNSELING: note gone after the pass'); checks++;}
      }
      await ctx.close();
    }
    for(const assoc of [false,true]) {
      const {ctx,page}=await open(c,'cert',c.units.length,false,false,assoc);
      await expectCredit(page,c,'cert',true,assoc);
      // Certificate and Associate students are never shown a Master's hold.
      const hold=c.code==='COUNSELING'?'#cts-cn-hold':'#cts-st-hold';
      assert.equal(await page.locator(hold).isVisible(),false,`${c.code} cert${assoc?' (Associate)':''}: no hold note`); checks++;
      await ctx.close();
    }
    for(const track of ['mdiv','thm']) {
      const {ctx,page}=await open(c,track,c.units.length,false,true);
      const key=track==='mdiv'?'cts_mdiv_done_codes':'cts_thm_done_codes';
      assert.equal(await page.evaluate(({key,code})=>JSON.parse(localStorage.getItem(key)).includes(code),{key,code:c.code}),true); checks++;
      await ctx.close();
    }
    const {ctx,page}=await open(c,'cert',c.units.length-1);
    await expectCredit(page,c,'cert',false);
    await ctx.close();
  }
  const c=courses[1];
  for(const track of ['cert','mdiv','thm']) for(const count of [0,1]) {
    const {ctx,page}=await open(c,track,count,true);
    assert.equal(await page.locator('#cts-st-done').isVisible(),false); checks++;
    // Neither forced button dispatch, direct callback nor the unit certificate
    // may produce course credit before all units are passed.
    await page.evaluate(()=>{document.getElementById('cts-st-done').click(); window.ctsStorytelComplete(); showCert(1);});
    await expectCredit(page,c,track,false);
    // Completing the last unit exposes the button and records the course.
    await page.evaluate(()=>{for(let i=1;i<=TOTAL_UNITS;i++)state.unitState[i].passed=true; saveState(); updateProgress();});
    assert.equal(await page.locator('#cts-st-done').isVisible(),true); checks++;
    await expectCredit(page,c,track,true);
    await ctx.close();
  }
  console.log(`PASS — ${checks} single-course completion assertions`);
} finally {await browser.close();}
