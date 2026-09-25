/* Where a course becomes complete (Claude's audit of the beta, item 7).
 *
 * Passing the last unit completes a course; opening its certificate page must
 * not. assets/js/cts-record.js is the one place that records it; the front
 * page catches up courses finished before that existed; the seminary is
 * notified once, for a completion new to the record. The Apps Script endpoint
 * is intercepted, so nothing reaches the real count.
 *
 *   node tools/verify-completion.mjs http://127.0.0.1:8798
 */
import { chromium } from 'playwright';
const BASE = process.argv[2] || 'http://127.0.0.1:8798';
const CHROME = process.env.CHROME_PATH;
const b = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
// Acts: a course whose certificate page reads the engine's own keys, so the
// certificate can be opened directly without first visiting a unit page.
const fails=[]; const ok=(c,m)=>{ console.log((c?'ok   ':'FAIL ')+m); if(!c) fails.push(m); };
async function ctx(){ const c=await b.newContext(); const p=await c.newPage(); const posts=[]; 
  await p.route('https://script.google.com/**', r=>{ posts.push(r.request().postData()); r.fulfill({status:200,body:''}); });
  return {c,p,posts}; }
// 1. certificate page with all units passed but nothing recorded: stays read-only
{ const {c,p,posts}=await ctx();
  await p.goto(BASE+'/CTSActsCertificate.html'); 
  await p.evaluate(()=>{ localStorage.clear(); localStorage.setItem('cts_student', JSON.stringify({name:'Ana', email:'a@x.org', track:'cert'})); localStorage.setItem('cts_track','cert');
    const pr={}; for(let i=1;i<=11;i++) pr['unit'+i]=true; localStorage.setItem('cts_acts_progress', JSON.stringify(pr)); });
  await p.reload(); await p.waitForTimeout(9000);
  const ls=await p.evaluate(()=>({d:localStorage.getItem('cts_done_codes'), r:localStorage.getItem('cts_degree_courses'),
    shown:[...document.querySelectorAll('#diploma,#cert-wrap,.diploma,#certificate,.certificate,#cert,.cert-wrap,.sheet')].some(e=>e.offsetParent!==null)}));
  ok(ls.shown, 'the certificate still unlocks from the unit record');
  ok(!ls.d || !ls.d.includes('CTSACTS'), 'opening the certificate page did not record the course ('+ls.d+')');
  ok(posts.length===0, 'certificate page sent no seminary count for an unrecorded course ('+posts.length+')');
  // 2. front page catch-up records it and notifies once
  await p.goto(BASE+'/index.html'); await p.waitForTimeout(1500);
  const ls2=await p.evaluate(()=>({d:localStorage.getItem('cts_done_codes'), r:localStorage.getItem('cts_degree_courses')}));
  ok(ls2.d && ls2.d.includes('CTSACTS'), 'front page catch-up recorded CTSACTS ('+ls2.d+')');
  ok(ls2.r && ls2.r.includes('Acts Intensive'), 'and the degree roster name ('+ls2.r+')');
  ok(posts.length===1 && /course=Acts/.test(posts[0]||''), 'and notified the seminary once ('+posts.length+')');
  await p.reload(); await p.waitForTimeout(1500);
  ok(posts.length===1, 'a second visit does not notify again ('+posts.length+')');
  await c.close(); }
// 3. passing the last unit records it (associate: needs SA too)
{ const {c,p,posts}=await ctx();
  await p.goto(BASE+'/CTSActsUnit11.html');
  await p.evaluate(()=>{ localStorage.clear(); localStorage.setItem('cts_student', JSON.stringify({name:'Ben', email:'b@x.org', track:'mdiv'})); localStorage.setItem('cts_track','mdiv');
    const pr={}; for(let i=1;i<=10;i++) pr['unit'+i]=true; localStorage.setItem('cts_acts_progress', JSON.stringify(pr)); });
  await p.reload(); await p.waitForTimeout(500);
  ok(!(await p.evaluate(()=>localStorage.getItem('cts_done_codes')||'')).includes('CTSACTS'), 'not recorded before the last unit is passed');
  await p.evaluate(()=>{ const U=window.CTS_UNIT;
    document.querySelectorAll('.question[data-mc]').forEach(q=>{ const i=+q.dataset.mc; q.querySelector(`button.option[data-opt="${U.mc[i].answer}"]`)?.click(); });
    document.querySelectorAll('textarea[data-sa]').forEach(t=>{ const q=U.sa[+t.dataset.sa]; t.value=((q.keywords&&q.keywords.en)||[]).flat().join(' ')+' '+((q.model&&q.model.en)||''); t.dispatchEvent(new Event('input',{bubbles:true})); });
    window.CTS_ENGINE.controls.submit().click(); });
  await p.waitForTimeout(800);
  const s=await p.evaluate(()=>({d:localStorage.getItem('cts_done_codes'), m:localStorage.getItem('cts_mdiv_done_codes'), res:(window.CTS_ENGINE.controls.result()||{}).textContent}));
  ok(/Passed|Aprobado/.test(s.res||''), 'last unit passed ('+(s.res||'').slice(0,60)+')');
  ok(s.d && s.d.includes('CTSACTS') && s.m && s.m.includes('CTSACTS'), 'passing the last unit recorded the course on the M.Div. list ('+s.d+' / '+s.m+')');
  ok(posts.length===1, 'and notified once ('+posts.length+')');
  await c.close(); }
await b.close();
console.log(fails.length? 'FAIL '+fails.length : 'PASS — completion is recorded at the last unit, never by the certificate page');
process.exit(fails.length?1:0);
