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
/* A static pass first, because the browser pass cannot see this.
   ensureResult() creates #examResult at runtime when a page has none, so if
   src/lib/shell.ts stopped renaming the result area the live DOM would still
   show a canonical id and the audit would pass while every one of those pages
   had quietly lost the element the author wrote. Asking the served HTML
   instead: a page that still carries one of the old spellings and no
   #examResult has not been through the rename. */
const RESULT_ALIASES = ['examStatus','exam-result','statusMsg','exam-status','mcResult',
                        'resultBox','score','result','lockoutTimer','lockout-timer'];
const unrenamed = [];
for (const f of pages) {
  const html = fs.readFileSync(`dist/${f}`, 'utf8');
  if (/id="examResult"/.test(html)) continue;
  const stale = RESULT_ALIASES.filter(a => html.includes(`id="${a}"`))
    .concat(/id="result_\d+"/.test(html) ? ['result_<n>'] : []);
  if (stale.length) unrenamed.push(`${f} (has #${stale[0]}, no #examResult)`);
}
if (unrenamed.length) {
  console.log(`FAIL — ${unrenamed.length} page(s) kept an old result-area id:`);
  unrenamed.slice(0, 8).forEach(x => console.log('  ' + x));
  if (unrenamed.length > 8) console.log(`  … and ${unrenamed.length - 8} more`);
  process.exit(1);
}

/* The greeting, same static reasoning as the result area: the layout always
   renders #greeting, so the live DOM always finds one. What it cannot show is
   a page that ALSO kept its own placeholder -- which used to win, leaving the
   layout's blank and the student greeted in a different place on 29 pages. */
const GREET_ALIASES = ['studentGreeting', 'student-greeting', 'greet', 't-greet'];
const staleGreet = pages.filter((f) => {
  const html = fs.readFileSync(`dist/${f}`, 'utf8');
  return GREET_ALIASES.some((a) => html.includes(`id="${a}"`));
});
if (staleGreet.length) {
  console.log(`FAIL — ${staleGreet.length} page(s) kept a duplicate greeting placeholder:`);
  staleGreet.slice(0, 8).forEach((x) => console.log('  ' + x));
  if (staleGreet.length > 8) console.log(`  … and ${staleGreet.length - 8} more`);
  process.exit(1);
}

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
        const r0 = C?.reset?.();
        const vis = e => !!(e && e.offsetParent !== null);
        const U = window.CTS_UNIT || {};
        /* How the engine FOUND the submit control, not just that it did.
           A control with no id is located by matching its English or Spanish
           label, so rewording or retranslating that button moves it. And a
           control that carries an inline onclick must not also be given a
           listener: both call the same submit(), so the second run saw the
           lockout the first had applied and replaced the student's score with
           "Locked. Try again in N minutes". 32 pages were in that state. */
        /* Not merely "has an id" -- the canonical one. src/lib/shell.ts
           renames the five historical spellings at build time and the engine
           no longer accepts them, so a page arriving with #submitBtn would
           have no submit control at all. Naming the expected id here is what
           stops the alias list growing back. */
        const byId = !!(s && s.id === 'submitExamBtn');
        const resetOk = !r0 || r0.id === 'resetExamBtn';
        /* The result area is created at runtime when a page has none, so the
           question is not whether it exists but whether it is the canonical
           one -- a page still resolving to #statusMsg would mean shell.ts had
           stopped renaming it. */
        const resultOk = !res || res.id === 'examResult';
        /* The containers need no static pass: nothing creates them at runtime,
           so a page that kept an old spelling resolves to nothing and fails on
           `mc` and on the rendered-question counts below. Naming the id is
           what keeps the aliases from creeping back. */
        const hostOk = (!mc || mc.id === 'questionsContainer') &&
                       (!C?.sa?.() || C.sa().id === 'kwContainer');
        const doubleBound = !!(s && s.getAttribute('onclick') && window.__ctsBound?.has(s));
        return { engine: !!window.CTS_ENGINE, submit: !!s, submitVisible: vis(s),
                 result: !!res, mc: !!mc, byId, doubleBound, resetOk, resultOk, hostOk,
                 mcId: mc ? (mc.id || '(none)') : '(none)',
                 resultId: res ? (res.id || '(none)') : '(none)',
                 submitId: s ? (s.id || '(none)') : '(none)',
                 rendered: document.querySelectorAll('.question[data-mc]').length,
                 renderedSa: document.querySelectorAll('textarea[data-sa]').length,
                 wantMc: (U.mc||[]).length, wantSa: (U.sa||[]).length };
      });
      // a unit may legitimately be short-answer only, so compare against what
      // the data actually holds rather than assuming every unit has MC
      const short = r.rendered !== r.wantMc || r.renderedSa !== r.wantSa;
      if(!r.engine || !r.submit || !r.submitVisible || !r.mc || short ||
         !r.byId || !r.resetOk || !r.resultOk || !r.hostOk || r.doubleBound || errs.length)
        bad.push({f, ...r, err: errs[0]?.slice(0,60)});
    }catch(e){ bad.push({f, fatal:String(e).slice(0,60)}); }
    await c.close();
    if(++done%100===0) process.stdout.write(` ${done}/${pages.length}\n`);
  }
}
await Promise.all(Array.from({length:10},work));
await b.close();
console.log(`\n${pages.length} pages audited`);
if(!bad.length) console.log('PASS — every page uses #submitExamBtn, bound once, with a result area and rendered questions.');
else{
  const byCourse={};
  for(const x of bad){const c=x.f.replace(/Unit\d+\.html/,''); (byCourse[c] ||= []).push(x);}
  console.log(`FAIL — ${bad.length} pages:\n`);
  for(const [c,list] of Object.entries(byCourse)){
    const s=list[0];
    const why = [];
    if (s.byId === false) why.push(`submit control is #${s.submitId}, not #submitExamBtn — the engine no longer accepts aliases`);
    if (s.resetOk === false) why.push('reset control is not #resetExamBtn');
    if (s.resultOk === false) why.push(`result area is #${s.resultId}, not #examResult`);
    if (s.hostOk === false) why.push(`question container is #${s.mcId}, not #questionsContainer / #kwContainer`);
    if (s.doubleBound) why.push('submit is bound twice (inline onclick + listener) — the score is replaced by "Locked"');
    console.log(`  ${c}: ${list.length} pages — engine:${s.engine} submit:${s.submit} visible:${s.submitVisible} byId:${s.byId} doubleBound:${s.doubleBound} mcHost:${s.mc} mc:${s.rendered}/${s.wantMc} sa:${s.renderedSa}/${s.wantSa}${s.err?' err:'+s.err:''}${s.fatal?' '+s.fatal:''}`);
    why.forEach(w => console.log(`      ${w}`));
  }
  /* Printing FAIL and exiting 0 is not a failure. test/run-tests.sh runs under
     `set -e` and takes its verdict from the exit code, so for as long as this
     was missing the suite would print this audit's failures and then report
     success. The mutation harness is what noticed: it applied a real defect,
     watched this print FAIL, and still scored it MISSED because the process
     said it was fine. */
  process.exitCode = 1;
}
