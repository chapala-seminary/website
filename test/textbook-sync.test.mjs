// Exercise the browser's real sync request against Worker/D1, then recover on
// a new browser. API-only textbook tests missed an omitted request field.
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const BASE=process.env.SYNC_BASE || 'http://127.0.0.1:8798';
assert(['localhost','127.0.0.1'].includes(new URL(BASE).hostname),'local Worker required');
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
let code;
try {
 const first=await browser.newContext(),page=await first.newPage();
 await page.goto(BASE+'/synctest.html');
 const suffix=crypto.randomUUID();
 await page.evaluate(s=>{
  localStorage.setItem('cts_student',JSON.stringify({name:'Textbook Sync Regression '+s,email:'textbook-sync-'+s+'@example.test',track:'mdiv'}));
  localStorage.setItem('cts_track','mdiv');
  // These are the dated keys written by the two independent test pages.
  localStorage.setItem('cts_textbook_newtestament_passed','2026-10-01');
  localStorage.setItem('cts_textbook_ntreadings_passed','2026-10-02');
 },suffix);
 await page.evaluate(()=>window.CTS_SYNC.sync());
 code=await page.evaluate(()=>window.CTS_SYNC.code());assert(code);
 const response=await fetch(BASE+'/api/student/'+code);assert.equal(response.status,200);
 const state=await response.json();
 assert.deepEqual(state.textbooks.map(x=>[x.textbook,x.passed_at]).sort(),[
  ['newtestament','2026-10-01T12:00:00.000Z'],['ntreadings','2026-10-02T12:00:00.000Z']
 ]);
 const second=await browser.newContext(),restored=await second.newPage();await restored.goto(BASE+'/synctest.html');
 assert((await restored.evaluate(c=>window.CTS_SYNC.restore(c),code)).ok);
 assert.deepEqual(await restored.evaluate(()=>[
  localStorage.getItem('cts_textbook_newtestament_passed'),localStorage.getItem('cts_textbook_ntreadings_passed')
 ]),['2026-10-01','2026-10-02']);
 // Re-syncing the recovered device must retain both dated results.
 await restored.evaluate(()=>window.CTS_SYNC.sync());
 const repeated=await(await fetch(BASE+'/api/student/'+code)).json();assert.deepEqual(repeated.textbooks,state.textbooks);
 await first.close();await second.close();
 console.log('PASS real browser textbook/reading sync, dated server results, fresh-browser recovery and repeat sync.');
}finally{
 if(code)await fetch(BASE+'/api/student/'+code,{method:'DELETE'});
 await browser.close();
}
