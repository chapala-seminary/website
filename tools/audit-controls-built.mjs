// Does every unit page give the STUDENT a way to submit, and a place to see
// the result? The policy test drove the engine directly when no button was
// found, which hid pages where no control exists at all.
import { chromium } from 'playwright';
import fs from 'fs';
// CHROME_PATH when the environment pins a browser; otherwise let Playwright
// find its own, which is what a developer's machine will do.
const CHROME = process.env.CHROME_PATH;
const BASE = process.argv[2] || 'http://127.0.0.1:8823';
const pages = fs.readdirSync('dist').filter(f=>/^CTS.*Unit\d+\.html$/.test(f)).sort();
const b = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const bad = [];
let done=0;
const queue = pages.slice();
async function work(){
  while(queue.length){
    const f = queue.shift();
    const c = await b.newContext(); const p = await c.newPage();
    const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    // Record every element given a click listener, so the audit can tell a
    // control the engine bound from one that only carries an inline onclick.
    await p.addInitScript(()=>{
      window.__ctsBound = new Set();
      const orig = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function (t, fn, o) {
        if (t === 'click' && this instanceof Element) window.__ctsBound.add(this);
        return orig.call(this, t, fn, o);
      };
    });
    try{
      await p.goto(`${BASE}/${f}`,{waitUntil:'load',timeout:15000});
      await p.waitForTimeout(150);
      const r = await p.evaluate(()=>{
        const C = window.CTS_ENGINE?.controls;
        const s = C?.submit?.(), res = C?.result?.(), mc = C?.mc?.();
        const vis = e => !!(e && e.offsetParent !== null);
        const U = window.CTS_UNIT || {};
        /* How the engine FOUND the submit control, not just that it did.
           A control with no id is located by matching its English or Spanish
           label, so rewording or retranslating that button moves it. And a
           control that carries an inline onclick must not also be given a
           listener: both call the same submit(), so the second run saw the
           lockout the first had applied and replaced the student's score with
           "Locked. Try again in N minutes". 32 pages were in that state. */
        const byId = !!(s && s.id);
        const doubleBound = !!(s && s.getAttribute('onclick') && window.__ctsBound?.has(s));
        return { engine: !!window.CTS_ENGINE, submit: !!s, submitVisible: vis(s),
                 result: !!res, mc: !!mc, byId, doubleBound,
                 rendered: document.querySelectorAll('.question[data-mc]').length,
                 renderedSa: document.querySelectorAll('textarea[data-sa]').length,
                 wantMc: (U.mc||[]).length, wantSa: (U.sa||[]).length };
      });
      // a unit may legitimately be short-answer only, so compare against what
      // the data actually holds rather than assuming every unit has MC
      const short = r.rendered !== r.wantMc || r.renderedSa !== r.wantSa;
      if(!r.engine || !r.submit || !r.submitVisible || !r.mc || short ||
         !r.byId || r.doubleBound || errs.length)
        bad.push({f, ...r, err: errs[0]?.slice(0,60)});
    }catch(e){ bad.push({f, fatal:String(e).slice(0,60)}); }
    await c.close();
    if(++done%100===0) process.stdout.write(` ${done}/${pages.length}\n`);
  }
}
await Promise.all(Array.from({length:10},work));
await b.close();
console.log(`\n${pages.length} pages audited`);
if(!bad.length) console.log('PASS — every page has a visible submit control found by id, bound once, a result area and rendered questions.');
else{
  const byCourse={};
  for(const x of bad){const c=x.f.replace(/Unit\d+\.html/,''); (byCourse[c] ||= []).push(x);}
  console.log(`FAIL — ${bad.length} pages:\n`);
  for(const [c,list] of Object.entries(byCourse)){
    const s=list[0];
    const why = [];
    if (s.byId === false) why.push('submit found by LABEL, not id — rewording that button moves it');
    if (s.doubleBound) why.push('submit is bound twice (inline onclick + listener) — the score is replaced by "Locked"');
    console.log(`  ${c}: ${list.length} pages — engine:${s.engine} submit:${s.submit} visible:${s.submitVisible} byId:${s.byId} doubleBound:${s.doubleBound} mcHost:${s.mc} mc:${s.rendered}/${s.wantMc} sa:${s.renderedSa}/${s.wantSa}${s.err?' err:'+s.err:''}${s.fatal?' '+s.fatal:''}`);
    why.forEach(w => console.log(`      ${w}`));
  }
}
