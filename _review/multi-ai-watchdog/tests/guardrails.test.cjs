const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const src=fs.readFileSync(path.join(__dirname,'..','Code.gs'),'utf8');
const context={module:{exports:{}},Date,Math,String,Number,RegExp,JSON,Error,isFinite,parseInt};
vm.runInNewContext(src,context);
const H=['Job ID','Provider','State','Task','Instructions','Source Drive File ID','Unit','Last Heartbeat UTC','Next Run UTC','Attempts','Max Attempts','Approval','Last Output / Checkpoint','Last Error','Updated UTC'];
assert.throws(()=>context.ctsValidateJobTable_([H,['Q1'],['Q1']]),/Duplicate Job ID/);
assert.doesNotThrow(()=>context.ctsValidateJobTable_([H,['Q1'],['Q2'],['']]));
assert.equal(context.ctsClassifyReply_('Finished. [[CTS_DONE]]',1,4,true),'CONTINUE');
assert.equal(context.ctsClassifyReply_('Finished. [[CTS_DONE]]',4,4,true),'REVIEW_REQUIRED');
assert.equal(context.ctsClassifyReply_('Finished. [[CTS_DONE]]',1,4,false),'DONE');
// Exercise a scheduled approved job with an invalid date. It may not be billed.
const rows=[H,['Q1','deepseek','READY','Fake review','Review','allowed','1','','not-a-date',0,2,'APPROVED','','','']];
const logs=[['UTC','Job ID','Provider','Event','State','Details','Tokens']];
const properties={CTS_SPREADSHEET_ID:'1nZZ57CnQN0waT0ozUfcpegOCafHO_krWsfFyVZ90eLg',ENABLE_LIVE_REQUESTS:'YES',MAX_PILOT_SPEND_USD:'10',MAX_CALLS_PER_DAY:'4'};
function sheet(values){return {getDataRange:()=>({getValues:()=>values.map(x=>x.slice())}),getRange:(r,c,n,m)=>({setValues:v=>{values[r-1]=v[0];}}),appendRow:v=>values.push(v)};}
const jobs=sheet(rows),log=sheet(logs);
let paid=0;
const runtime={...context,PropertiesService:{getScriptProperties:()=>({getProperty:k=>properties[k]})},
SpreadsheetApp:{openById:()=>({getSheetByName:n=>n==='AI Jobs'?jobs:log})},
LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock(){}})},
Logger:{log(){}},
UrlFetchApp:{fetch:()=>{paid++;throw Error('must not run')}},
ctsSetup:()=>{}};
vm.runInNewContext(src,runtime);
runtime.ctsSetup=()=>{};
runtime.ctsWatchdog();
assert.equal(paid,0);assert.equal(rows[1][2],'REVIEW_REQUIRED');
assert.equal(logs.at(-1)[3],'INVALID_SCHEDULE');
console.log('PASS: duplicate jobs, forced output truncation, malformed schedules fail closed');
