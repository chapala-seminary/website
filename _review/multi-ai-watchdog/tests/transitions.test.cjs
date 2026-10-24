const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'..','Code.gs'),'utf8');
const packet=fs.readFileSync(path.join(__dirname,'..','fixtures','Systematic_Theology_13Unit.txt'),'utf8');
const srcId='1eIZt_NA0kg26sRlNUHRul1XaHpOewysY';
const HEAD=['Job ID','Provider','State','Task','Instructions','Source Drive File ID','Unit','Last Heartbeat UTC','Next Run UTC','Attempts','Max Attempts','Approval','Last Output / Checkpoint','Last Error','Updated UTC'];
const LOG=['UTC','Job ID','Provider','Event','State','Details','Tokens'];
class Sheet {
  constructor(name, rows){this.name=name;this.rows=rows.map(x=>x.slice());}
  getDataRange(){return {getValues:()=>this.rows.map(x=>x.slice())};}
  getRange(r,c,nr,nc){return {getValues:()=>Array.from({length:nr},(_,i)=>Array.from({length:nc},(_,j)=>this.rows[r-1+i]?.[c-1+j]||'')),setValues:a=>{for(let i=0;i<nr;i++){this.rows[r-1+i] ||= [];for(let j=0;j<nc;j++)this.rows[r-1+i][c-1+j]=a[i][j];}},setFontWeight(){return this;},setBackground(){return this;}};}
  appendRow(row){this.rows.push(row.slice());}
  setFrozenRows(){}
}
const jobs = new Sheet('AI Jobs',[HEAD,['J1','deepseek','READY','Review Unit 1','Assess the content',srcId,'1','','',0,4,'APPROVED','','','']]);
const log=new Sheet('AI Run Log',[LOG,['2026-10-24','PILOT','none','SETUP','INACTIVE','ready',0]]);
const sheets={'AI Jobs':jobs,'AI Run Log':log};
const ss={getSheetByName:n=>sheets[n],insertSheet:n=>{throw Error('unexpected missing tab '+n)}};
const props={CTS_SPREADSHEET_ID:'1nZZ57CnQN0waT0ozUfcpegOCafHO_krWsfFyVZ90eLg',ENABLE_LIVE_REQUESTS:'NO',ALLOWLIST_SOURCE_IDS:srcId,DEEPSEEK_API_KEY:'FAKE_ONLY',DEEPSEEK_MODEL:'deepseek-chat',MAX_CALLS_PER_DAY:'12',MAX_OUTPUT_TOKENS:'700',REPORT_FOLDER_ID:'test-report-folder'};
let requestCount=0, savedAttempts=[], responseTexts=['Partial, needs more review; CHECKPOINT: checked exposition','Conclusion [[CTS_DONE]]'];
const context={
 module:{exports:{}},Date,Number,String,Math,RegExp,Error,JSON,isFinite,parseInt,
 Logger:{log(){}},
 SpreadsheetApp:{openById:()=>ss},
 PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k]})},
 LockService:{getScriptLock:()=>({tryLock:()=>true,releaseLock(){}})},
 DriveApp: {
   getFileById: id => {assert.equal(id,srcId); return {getBlob:()=>({getDataAsString:()=>packet})};},
   getFolderById: id => {assert.equal(id,'test-report-folder'); return {createFile:(name,txt,mime)=>{savedAttempts.push({name,txt,mime});return {getId:()=>String(savedAttempts.length)};}};}
 },
 UrlFetchApp:{fetch:(url,arg)=>{requestCount++; assert.match(url,/chat\/completions/);assert.equal(arg.method,'post');const body=JSON.parse(arg.payload);assert.match(body.messages[0].content,/Doctrine of Revelation/i);return {getResponseCode:()=>200,getContentText:()=>JSON.stringify({choices:[{message:{content:responseTexts.shift()}}],usage:{total_tokens:800}})};}}
};
vm.runInNewContext(source,context);
// Global kill switch prevents ALL provider calls.
context.ctsWatchdog();assert.equal(requestCount,0);assert.equal(jobs.rows[1][2],'READY');
// First approved call stores checkpoint and queues continuation.
props.ENABLE_LIVE_REQUESTS='YES';context.ctsWatchdog();assert.equal(requestCount,1);assert.equal(jobs.rows[1][2],'CONTINUE');assert.equal(jobs.rows[1][9],1);
assert.match(jobs.rows[1][12],/CHECKPOINT/);assert.equal(savedAttempts.length,1);
// Mock next scheduled tick elapsed; it must send a continuation, not restart blindly.
jobs.rows[1][8]='';context.ctsWatchdog();assert.equal(requestCount,2);assert.equal(jobs.rows[1][2],'DONE');assert.equal(jobs.rows[1][9],2);
// DONE is terminal; subsequent watchdog should not duplicate spend.
context.ctsWatchdog();assert.equal(requestCount,2);
// HOLD authorization stops an otherwise-ready assignment.
jobs.rows[1][2]='READY';jobs.rows[1][11]='HOLD';context.ctsWatchdog();assert.equal(requestCount,2);
assert.equal(log.rows.filter(x=>x[3]==='API_RESULT').length,2);
assert.equal(log.rows.filter(x=>x[3]==='API_STARTED').length,2);
assert.equal(context.ctsDailyCalls_(log),2);
// Repeated, nonprogressing content cannot loop indefinitely.
responseTexts.push('Same finding, no substantive progress', 'Same finding,  no substantive   progress');
jobs.rows[1][2]='READY';jobs.rows[1][11]='APPROVED';jobs.rows[1][9]=0;jobs.rows[1][12]='';jobs.rows[1][8]='';
context.ctsWatchdog(); assert.equal(jobs.rows[1][2],'CONTINUE');
jobs.rows[1][8]='';context.ctsWatchdog();assert.equal(jobs.rows[1][2],'REVIEW_REQUIRED');
assert.equal(requestCount,4);assert.equal(savedAttempts.length,4);
assert.equal(log.rows.filter(x=>x[3]==='NO_PROGRESS').length,1);
// Count dispatches even if a result later fails to save or parse.
assert.equal(context.ctsDailyCalls_(log),4);
props.MAX_CALLS_PER_DAY='4';jobs.rows[1][2]='READY';jobs.rows[1][9]=0;
context.ctsWatchdog();assert.equal(requestCount,4);

console.log('PASS: kill switch, checkpoint/resumption, append-only output, DONE, HOLD, no-progress stop, dispatch budget');
