const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const src=fs.readFileSync(path.join(__dirname,'..','Code.gs'),'utf8');
const fixture=fs.readFileSync(path.join(__dirname,'..','fixtures','Systematic_Theology_13Unit.txt'),'utf8');
const srcId='1eIZt_NA0kg26sRlNUHRul1XaHpOewysY';
const H=['Job ID','Provider','State','Task','Instructions','Source Drive File ID','Unit','Last Heartbeat UTC','Next Run UTC','Attempts','Max Attempts','Approval','Last Output / Checkpoint','Last Error','Updated UTC'];
const L=['UTC','Job ID','Provider','Event','State','Details','Tokens'];
const jobs=[H,['CTS-ST-U01-DS','deepseek','READY','Review Unit 1','Academic audit',srcId,'1','','',0,4,'APPROVED','','','']];
const logs=[L,['2026-10-24','PILOT','none','SETUP','INACTIVE','ready',0]];
const props={CTS_SPREADSHEET_ID:'1nZZ57CnQN0waT0ozUfcpegOCafHO_krWsfFyVZ90eLg',
 ENABLE_LIVE_REQUESTS:'NO',MAX_PILOT_SPEND_USD:'10',REPORT_FOLDER_ID:'private-folder',
 ALLOWLIST_SOURCE_IDS:srcId,DEEPSEEK_API_KEY:'FAKE',DEEPSEEK_MODEL:'deepseek-flash',
 DEEPSEEK_USD_PER_M_INPUT_TOKENS:'0.50',DEEPSEEK_USD_PER_M_OUTPUT_TOKENS:'1.00'};
let calls=0;
function sheet(name, rows){return {getName:()=>name,getDataRange:()=>({getValues:()=>rows.map(x=>x.slice())}),
 getRange:(r,c,n,columns)=>({getValues:()=>[rows[r-1].slice(c-1,c-1+columns)]})};}
const refs={'AI Jobs':sheet('AI Jobs',jobs),'AI Run Log':sheet('AI Run Log',logs)};
const c={module:{exports:{}},Date,Math,String,Number,RegExp,JSON,Error,isFinite,parseInt,
 PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k]})},
 SpreadsheetApp:{openById:()=>({getSheetByName:n=>refs[n]})},
 DriveApp:{getFolderById:id=>{assert.equal(id,'private-folder');return {getName:()=> 'CTS AI Run Reports'}},
 getFileById:id=>{assert.equal(id,srcId);return {getBlob:()=>({getDataAsString:()=>fixture})}}},
 ScriptApp:{getProjectTriggers:()=>[]},Logger:{log(){}},UrlFetchApp:{fetch(){calls++;throw Error('preflight must not call API')}}
};
vm.runInNewContext(src,c);
let outcome=c.ctsPreflight();
assert.equal(outcome.status,'READY_FOR_OPERATOR_REVIEW');assert.equal(outcome.safeMode,true);
assert.equal(outcome.readyJobs.length,1);assert.equal(outcome.readyJobs[0].remainingAttempts,4);
assert.equal(calls,0);
props.DEEPSEEK_MODEL='deepseek-chat';assert.throws(()=>c.ctsPreflight(),/retired/);
props.DEEPSEEK_MODEL='deepseek-flash';
props.ALLOWLIST_SOURCE_IDS='unapproved';assert.throws(()=>c.ctsPreflight(),/approved/);
props.ALLOWLIST_SOURCE_IDS=srcId;
props.REPORT_FOLDER_ID='';assert.throws(()=>c.ctsPreflight(),/REPORT_FOLDER_ID/);
props.REPORT_FOLDER_ID='private-folder';jobs[1][11]='HOLD';
outcome=c.ctsPreflight();assert.equal(outcome.status,'NO_ACTIVE_JOBS');assert.equal(calls,0);
console.log('PASS: read-only installation preflight, vetted source, retired model and report-folder checks');
