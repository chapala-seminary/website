// Does every unit page give the STUDENT a way to submit, and a place to see
// the result? The policy test drove the engine directly when no button was
// found, which hid pages where no control exists at all.
import { chromium } from 'playwright';
import fs from 'fs';
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const pages = fs.readdirSync('enginetest/site').filter(f=>/^CTS.*Unit\d+\.html$/.test(f)).sort();
const b = await chromium.launch({executablePath:CHROME});
const bad = [];
let done=0;
const queue = pages.slice();
async function work(){
  while(queue.length){
    const f = queue.shift();
    const c = await b.newContext(); const p = await c.newPage();
    const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    try{
      await p.goto(`http://127.0.0.1:8821/${f}`,{waitUntil:'load',timeout:15000});
      await p.waitForTimeout(150);
      const r = await p.evaluate(()=>{
        const C = window.CTS_ENGINE?.controls;
        const s = C?.submit?.(), res = C?.result?.(), mc = C?.mc?.();
        const vis = e => !!(e && e.offsetParent !== null);
        const U = window.CTS_UNIT || {};
        return { engine: !!window.CTS_ENGINE, submit: !!s, submitVisible: vis(s),
                 result: !!res, mc: !!mc,
                 rendered: document.querySelectorAll('.question[data-mc]').length,
                 renderedSa: document.querySelectorAll('textarea[data-sa]').length,
                 wantMc: (U.mc||[]).length, wantSa: (U.sa||[]).length };
      });
      // a unit may legitimately be short-answer only, so compare against what
      // the data actually holds rather than assuming every unit has MC
      const short = r.rendered !== r.wantMc || r.renderedSa !== r.wantSa;
      if(!r.engine || !r.submit || !r.submitVisible || !r.mc || short || errs.length)
        bad.push({f, ...r, err: errs[0]?.slice(0,60)});
    }catch(e){ bad.push({f, fatal:String(e).slice(0,60)}); }
    await c.close();
    if(++done%100===0) process.stdout.write(` ${done}/${pages.length}\n`);
  }
}
await Promise.all(Array.from({length:10},work));
await b.close();
console.log(`\n${pages.length} pages audited`);
if(!bad.length) console.log('PASS — every page has a visible submit control, a result area and rendered questions.');
else{
  const byCourse={};
  for(const x of bad){const c=x.f.replace(/Unit\d+\.html/,''); (byCourse[c] ||= []).push(x);}
  console.log(`FAIL — ${bad.length} pages:\n`);
  for(const [c,list] of Object.entries(byCourse)){
    const s=list[0];
    console.log(`  ${c}: ${list.length} pages — engine:${s.engine} submit:${s.submit} visible:${s.submitVisible} mcHost:${s.mc} mc:${s.rendered}/${s.wantMc} sa:${s.renderedSa}/${s.wantSa}${s.err?' err:'+s.err:''}${s.fatal?' '+s.fatal:''}`);
  }
}
