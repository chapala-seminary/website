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
import catalog from '../worker/catalog.json' with { type: 'json' };
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
  await p.evaluate(()=>{ localStorage.clear(); localStorage.setItem('cts_student', JSON.stringify({name:'Ana', email:'a-'+Math.random().toString(36).slice(2)+'@x.org', track:'cert'})); localStorage.setItem('cts_track','cert');
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
  // The seminary is told by the Worker when the sync brings this (worker/notify.js,
  // test/api.test.mjs); the old Apps Script Sheet is no longer posted to.
  ok(posts.length===0, 'nothing posted to the old Apps Script Sheet ('+posts.length+')');
  await p.reload(); await p.waitForTimeout(1500);
  ok(posts.length===0, 'nor on a second visit ('+posts.length+')');
  await c.close(); }
// 3. passing the last unit records it (associate: needs SA too)
{ const {c,p,posts}=await ctx();
  await p.goto(BASE+'/CTSActsUnit11.html');
  await p.evaluate(()=>{ localStorage.clear(); localStorage.setItem('cts_student', JSON.stringify({name:'Ben', email:'b-'+Math.random().toString(36).slice(2)+'@x.org', track:'mdiv'})); localStorage.setItem('cts_track','mdiv');
    const pr={}; for(let i=1;i<=10;i++) pr['unit'+i]=true; localStorage.setItem('cts_acts_progress', JSON.stringify(pr)); });
  await p.reload(); await p.waitForTimeout(500);
  ok(!(await p.evaluate(()=>localStorage.getItem('cts_done_codes')||'')).includes('CTSACTS'), 'not recorded before the last unit is passed');
  await p.evaluate(()=>{ const U=window.CTS_UNIT;
    document.querySelectorAll('.question[data-mc]').forEach(q=>{ const i=+q.dataset.mc; q.querySelector(`button.option[data-opt="${U.mc[i].answer}"]`)?.click(); });
    document.querySelectorAll('textarea[data-sa]').forEach(t=>{ const q=U.sa[+t.dataset.sa]; t.value=((q.keywords&&q.keywords.en)||[]).flat().join(' ')+' '+((q.model&&q.model.en)||''); t.dispatchEvent(new Event('input',{bubbles:true})); });
    // the fill-ins count on the master's tracks too (every unit has them since 26 Sept)
    document.querySelectorAll('input[data-fill]').forEach(t=>{ t.value=U.fill[+t.dataset.fill].answer.en; t.dispatchEvent(new Event('input',{bubbles:true})); });
    window.CTS_ENGINE.controls.submit().click(); });
  await p.waitForTimeout(800);
  const s=await p.evaluate(()=>({d:localStorage.getItem('cts_done_codes'), m:localStorage.getItem('cts_mdiv_done_codes'), res:(window.CTS_ENGINE.controls.result()||{}).textContent}));
  ok(/passed|aprobada/i.test(s.res||''), 'last unit passed ('+(s.res||'').slice(0,60)+')');
  ok(s.d && s.d.includes('CTSACTS') && s.m && s.m.includes('CTSACTS'), 'passing the last unit recorded the course on the M.Div. list ('+s.d+' / '+s.m+')');
  ok(posts.length===0, 'and nothing posted to the old Sheet ('+posts.length+')');
  await c.close(); }
/* 4. A student from the old site who finished the foundation and was still
 * locked out (Wayne's tracker, 27 Sept: "the catalog didn't unlock for him at
 * first"). On the old site a course was recorded only when its certificate page
 * was opened, so finished courses whose certificates were never opened left no
 * code -- and no notice. Here: every foundation course passed, nothing
 * recorded, Evangelism only under its old keys, Preaching passed as the
 * nine-unit course it was before 24 Sept. One visit to the front page must
 * record all seven and open the catalog. */
const FOUNDATION = ['CTSOTS', 'CTSNT', 'CTSST', 'CTSEVANGELISM', 'CTSPM', 'CTSCH', 'WISESPEAK'];
function oldSiteFoundation() {
  const seed = { cts_student: JSON.stringify({ name: 'Old Student', email: 'o-' + Math.random().toString(36).slice(2) + '@x.org', track: 'cert' }), cts_track: 'cert' };
  for (const [slug, c] of Object.entries(catalog.courses)) {
    if (!FOUNDATION.includes(c.code)) continue;
    const pr = {}; for (const u of c.units) pr['unit' + u] = true;
    seed[slug === 'evangelism' ? 'cts_ev_progress' : `cts_${slug}_progress`] = JSON.stringify(pr);
  }
  const ws = {}; for (let i = 1; i <= 9; i++) ws[i] = { passed: true };
  seed.cts_wisespeak_state = JSON.stringify(ws);
  return seed;
}
async function seeded(url, seed) {
  const { c, p, posts } = await ctx();
  await p.goto(BASE + '/CTSBeforeYouBegin.html');
  await p.evaluate((s) => { localStorage.clear(); for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, seed);
  await p.goto(BASE + url); await p.waitForTimeout(1500);
  return { c, p, posts };
}
{ const { c, p } = await seeded('/index.html', oldSiteFoundation());
  const d = await p.evaluate(() => JSON.parse(localStorage.getItem('cts_done_codes') || '[]'));
  const missing = FOUNDATION.filter((x) => !d.includes(x));
  ok(!missing.length, 'old-site foundation: the front page records all seven (missing: ' + (missing.join(' ') || 'none') + ')');
  await p.reload(); await p.waitForTimeout(800);
  const locked = await p.evaluate(() => document.querySelectorAll('a.course.cts-locked').length);
  ok(locked === 0, 'old-site foundation: the catalog opens (' + locked + ' locked cards)');
  await c.close(); }
// the same student opening Preaching first: its renumbering must not take the course back
{ const { c, p } = await seeded('/CTS_WiseSpeak_Preaching.html', oldSiteFoundation());
  const d = await p.evaluate(() => JSON.parse(localStorage.getItem('cts_done_codes') || '[]'));
  ok(d.includes('WISESPEAK'), 'nine-unit Preaching finisher opening the Preaching page first keeps the course (' + d.join(' ') + ')');
  await c.close(); }
// and a Preaching student who had NOT finished the nine is not given it
{ const seed = oldSiteFoundation(); const ws = JSON.parse(seed.cts_wisespeak_state); delete ws[9]; seed.cts_wisespeak_state = JSON.stringify(ws);
  const { c, p } = await seeded('/index.html', seed);
  const d = await p.evaluate(() => JSON.parse(localStorage.getItem('cts_done_codes') || '[]'));
  ok(!d.includes('WISESPEAK'), 'eight of nine old Preaching units is not a completion');
  await c.close(); }
await b.close();
console.log(fails.length? 'FAIL '+fails.length : 'PASS — completion is recorded at the last unit, never by the certificate page');
process.exit(fails.length?1:0);
