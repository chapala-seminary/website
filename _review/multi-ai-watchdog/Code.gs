/**
 * CTS Multi-AI Watchdog — Google Apps Script pilot, version 0.2 (2026-10-24)
 *
 * Safe by default: No API requests unless Script Property
 * ENABLE_LIVE_REQUESTS=YES AND each job's Approval cell is APPROVED.
 *
 * This resumes API-driven assignments by sending a checkpoint-aware follow-up.
 * It CANNOT type "Continue" into an unrelated DeepSeek/Claude/ChatGPT web chat.
 */
var CTS = {
  jobsTab: 'AI Jobs', logTab: 'AI Run Log',
  jobHeaders: ['Job ID','Provider','State','Task','Instructions','Source Drive File ID','Unit',
               'Last Heartbeat UTC','Next Run UTC','Attempts','Max Attempts','Approval',
               'Last Output / Checkpoint','Last Error','Updated UTC'],
  logHeaders: ['UTC','Job ID','Provider','Event','State','Details','Tokens'],
  maxSourceCharacters: 32000,
  maxOutputCellCharacters: 22000,
  staleRunningMinutes: 15,
  minimumContinuationMinutes: 5
};

function ctsSpreadsheetId_() {
  var id=String(PropertiesService.getScriptProperties().getProperty('CTS_SPREADSHEET_ID')||'').trim();
  if (!/^[A-Za-z0-9_-]{20,}$/.test(id)) throw new Error('CTS_SPREADSHEET_ID missing or malformed');
  return id;
}

function ctsSetup() {
  var spreadsheet = SpreadsheetApp.openById(ctsSpreadsheetId_());
  ctsEnsureTab_(spreadsheet, CTS.jobsTab, CTS.jobHeaders);
  ctsEnsureTab_(spreadsheet, CTS.logTab, CTS.logHeaders);
  Logger.log('CTS sheets are ready. No APIs or triggers have been activated.');
}

function ctsEnsureTab_(spreadsheet, title, headers) {
  var tab = spreadsheet.getSheetByName(title) || spreadsheet.insertSheet(title);
  var first = tab.getRange(1,1,1,headers.length).getValues()[0];
  if (first.every(function(x){return x === '';})) {
    tab.getRange(1,1,1,headers.length).setValues([headers]);
    tab.setFrozenRows(1);
    tab.getRange(1,1,1,headers.length).setFontWeight('bold').setBackground('#e6eaeb');
  } else if (JSON.stringify(first) !== JSON.stringify(headers)) {
    throw new Error('Schema mismatch in tab ' + title + '; manual review required');
  }
  return tab;
}

function ctsInstallWatchdogTrigger() {
  // Do not call until the operator has reviewed API keys, permissions and expenses.
  var existing = ScriptApp.getProjectTriggers().filter(function(t){
    return t.getHandlerFunction() === 'ctsWatchdog';
  });
  if (existing.length) { Logger.log('Watchdog trigger already installed'); return; }
  ScriptApp.newTrigger('ctsWatchdog').timeBased().everyMinutes(5).create();
  Logger.log('5-minute watchdog trigger installed; live sending still requires explicit opt-in');
}

function ctsRemoveWatchdogTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t){
    if (t.getHandlerFunction() === 'ctsWatchdog') ScriptApp.deleteTrigger(t);
  });
  Logger.log('CTS watchdog trigger removed');
}

/** Run automatically via installed trigger, or manually from Apps Script editor. */
function ctsWatchdog() {
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty('ENABLE_LIVE_REQUESTS') !== 'YES') {
    Logger.log('Dry run: ENABLE_LIVE_REQUESTS is not YES; no network requests.');
    return;
  }
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;
  try {
    ctsSetup();
    var ss = SpreadsheetApp.openById(ctsSpreadsheetId_());
    var jobs = ss.getSheetByName(CTS.jobsTab);
    var log = ss.getSheetByName(CTS.logTab);
    if (ctsDailyCalls_(log) >= ctsPositiveInt_(props.getProperty('MAX_CALLS_PER_DAY'),12)) {
      Logger.log('Daily API call cap reached'); return;
    }
    var values = jobs.getDataRange().getValues();
    var now = new Date();
    for (var i=1;i<values.length;i++) {
      var row = values[i].map(function(x){return x === null ? '' : String(x);});
      var state = row[2].toUpperCase().trim();
      if (!row[0] || row[11].toUpperCase().trim() !== 'APPROVED') continue;
      if (state === 'RUNNING') {
        var heartbeat = ctsReadDate_(row[7]);
        if (!heartbeat || now.getTime() - heartbeat.getTime() > CTS.staleRunningMinutes*60000) {
          // Remote execution may have finished, but response was lost. Bounded retry.
          row[2] = props.getProperty('ALLOW_UNCERTAIN_RETRY') === 'YES' && ctsPositiveInt_(row[9],0) < ctsPositiveInt_(row[10],4) ? 'CONTINUE' : 'REVIEW_REQUIRED';
          row[13] = 'Prior API call may have completed remotely but reply was lost; review before any retry to avoid duplicate billing';
          row[14] = now.toISOString();
          ctsWriteRow_(jobs,i+1,row);
          ctsLog_(log,row[0],row[1],'STALE_RECOVERY',row[2],row[13],0);
          state = row[2];
        } else continue;
      }
      if (state !== 'READY' && state !== 'CONTINUE') continue;
      var due = ctsReadDate_(row[8]);
      if (due && now < due) continue;
      ctsExecuteJob_(jobs,log,i+1,row,props,now);
      break; // Exactly one paid call per watchdog tick.
    }
  } finally { lock.releaseLock(); }
}

function ctsExecuteJob_(jobs,log,rowNumber,row,props,now) {
  var jobId = row[0], provider = row[1].toLowerCase().trim();
  var maxAttempts = ctsPositiveInt_(row[10],4);
  var attempts = ctsPositiveInt_(row[9],0);
  if (attempts >= maxAttempts) {
    row[2] = 'REVIEW_REQUIRED'; row[13] = 'Maximum continuation attempts reached';
    row[14] = now.toISOString(); ctsWriteRow_(jobs,rowNumber,row);
    ctsLog_(log,jobId,provider,'ATTEMPT_LIMIT',row[2],row[13],0); return;
  }
  try {
    if (['openai','claude','deepseek'].indexOf(provider) === -1)
      throw new Error('Unsupported provider; use openai, claude or deepseek');
    var text = ctsGetVettedLesson_(row[5],row[6],props);
    var previousOutput = String(row[12] || '');
    var prompt = ctsBuildPrompt_(row[3],row[4],text,attempts>0 ? previousOutput : '');
    row[2] = 'RUNNING'; row[7] = now.toISOString(); row[14] = now.toISOString();
    row[9] = attempts+1; row[13] = '';
    ctsWriteRow_(jobs,rowNumber,row);
    // Log *before* HTTP dispatch: failed/time-out attempts count toward the daily cap.
    ctsLog_(log,jobId,provider,'API_STARTED','RUNNING','Attempt '+(attempts+1)+'/'+maxAttempts,0);
    var result = ctsProviderCall_(provider,prompt,props);
    if (!result.text || !result.text.trim()) throw new Error('Provider returned empty text');
    // Never silently discard full model responses: persist append-only attempt files.
    ctsSaveAttempt_(jobId,provider,attempts+1,result.text,props);
    if (previousOutput && ctsSameReply_(previousOutput,result.text)) {
      row[12]=result.text.slice(-CTS.maxOutputCellCharacters);
      row[2]='REVIEW_REQUIRED'; row[13]='Repeated output with no new progress';
      row[7]=new Date().toISOString(); row[14]=row[7];
      ctsWriteRow_(jobs,rowNumber,row);
      ctsLog_(log,jobId,provider,'NO_PROGRESS','REVIEW_REQUIRED',row[13],result.tokens||0);
      return;
    }
    row[12] = result.text.slice(-CTS.maxOutputCellCharacters);
    row[7] = new Date().toISOString(); row[14] = row[7];
    var decision = ctsClassifyReply_(result.text,attempts+1,maxAttempts);
    row[2] = decision;
    if (decision === 'CONTINUE') {
      row[8] = new Date(Date.now()+CTS.minimumContinuationMinutes*60000).toISOString();
    } else { row[8] = ''; }
    row[13] = decision === 'REVIEW_REQUIRED' ? 'Output incomplete after attempt cap' : '';
    ctsWriteRow_(jobs,rowNumber,row);
    ctsLog_(log,jobId,provider,'API_RESULT',decision,
      'Attempt '+(attempts+1)+'/'+maxAttempts+'; '+result.text.slice(0,160),result.tokens||0);
  } catch(e) {
    row[13] = String(e && e.message || e).slice(0,450);
    row[2] = 'REVIEW_REQUIRED'; // Fail closed: do not repeatedly spend money on errors.
    row[14] = new Date().toISOString();
    ctsWriteRow_(jobs,rowNumber,row);
    ctsLog_(log,jobId,provider,'CALL_ERROR',row[2],row[13],0);
  }
}

function ctsSameReply_(previous,current) {
  var normalize=function(s){return String(s||'').replace(/\s+/g,' ').trim();};
  return normalize(previous)===normalize(current);
}

function ctsSaveAttempt_(jobId,provider,attemptNumber,content,props) {
  var folderId=String(props.getProperty('REPORT_FOLDER_ID')||'').trim();
  if (!folderId) throw new Error('REPORT_FOLDER_ID missing: cannot preserve a full independent review');
  var name=String(jobId).replace(/[^A-Za-z0-9_-]/g,'_')+'__'+String(provider).replace(/[^A-Za-z0-9_-]/g,'_')+
    '__attempt-'+attemptNumber+'__'+new Date().toISOString().replace(/[:.]/g,'-')+'.txt';
  var folder=DriveApp.getFolderById(folderId);
  // Create-only. A retry creates another file rather than overwriting a past review.
  return folder.createFile(name,String(content),'text/plain').getId();
}

function ctsGetVettedLesson_(fileId,unit,props) {
  var allowed = String(props.getProperty('ALLOWLIST_SOURCE_IDS')||'').split(',').map(function(s){return s.trim();});
  if (!fileId || allowed.indexOf(String(fileId).trim()) === -1)
    throw new Error('Source file is not explicitly approved in ALLOWLIST_SOURCE_IDS');
  var text = DriveApp.getFileById(fileId).getBlob().getDataAsString('UTF-8');
  var content = ctsExtractUnit_(text,parseInt(unit,10));
  if (!content || content.length < 1500) throw new Error('Expected full student lesson not found');
  if (content.length > CTS.maxSourceCharacters) throw new Error('Source unit too long; divide into smaller jobs');
  return content;
}

function ctsExtractUnit_(whole,unit) {
  if (!Number.isInteger(unit) || unit<1 || unit>100) throw new Error('Invalid unit number');
  var marker = new RegExp('^={10,} UNIT '+unit+':[^\\n]*={10,}\\s*$','m');
  var found = marker.exec(whole);
  if (!found) throw new Error('Course packet unit '+unit+' not found');
  var start=found.index + found[0].length;
  var next=/^={10,} UNIT \d+:[^\n]*={10,}\s*$/gm;
  next.lastIndex=start;
  var match=next.exec(whole);
  return whole.slice(start,match ? match.index : whole.length).trim();
}

function ctsBuildPrompt_(task,instructions,lesson,checkpoint) {
  var text='You are performing a READ-ONLY independent CTS academic review. Do not invent facts or claim to have read other units. Do not reveal student data or answer keys.\n'
    +'Task: '+task+'\nInstructions: '+instructions+'\n'
    +'For each finding: cite a specific passage in the provided unit, why it matters, and a proposed correction. Separate factual errors from legitimate denominational interpretations.\n'
    +'Finish with exactly one of these tags: [[CTS_DONE]] when complete, [[CTS_NEEDS_APPROVAL]] for a decision reserved to the rector, or [[CTS_BLOCKED]] if evidence is missing.\n'
    +'If output length forces you to stop, provide a compact CHECKPOINT describing what remains and omit the done tag; the dispatcher will send a CONTINUE prompt automatically.\n'
    +'\n=== STUDENT-FACING UNIT CONTENT ===\n'+lesson+'\n=== END UNIT ===\n';
  if (checkpoint) text+='\n=== YOUR PREVIOUS ANSWER / CHECKPOINT ===\n'+checkpoint+
    '\n=== CONTINUE INSTRUCTION ===\nContinue exactly where you left off, do not repeat earlier findings; complete the remaining analysis and mark completion with [[CTS_DONE]].\n';
  return text;
}

function ctsClassifyReply_(txt,attempt,maxAttempts) {
  var finalText=String(txt||'').trim();
  if (/\[\[CTS_NEEDS_APPROVAL\]\]$/.test(finalText)) return 'WAITING_APPROVAL';
  if (/\[\[CTS_BLOCKED\]\]$/.test(finalText)) return 'BLOCKED';
  if (/\[\[CTS_DONE\]\]$/.test(finalText)) return 'DONE';
  return attempt>=maxAttempts?'REVIEW_REQUIRED':'CONTINUE';
}

function ctsProviderCall_(provider,content,props) {
  var base,body,headers,response,maxTokens=ctsPositiveInt_(props.getProperty('MAX_OUTPUT_TOKENS'),1600);
  if (provider === 'claude') {
    var claudeKey=props.getProperty('CLAUDE_API_KEY'), cm=props.getProperty('CLAUDE_MODEL');
    if (!claudeKey || !cm) throw new Error('Claude API key or model not configured');
    base='https://api.anthropic.com/v1/messages';
    headers={'x-api-key':claudeKey,'anthropic-version':'2023-06-01'};
    body={model:cm,max_tokens:maxTokens,messages:[{role:'user',content:content}]};
  } else {
    var isOpenAI=provider==='openai', key=props.getProperty(isOpenAI?'OPENAI_API_KEY':'DEEPSEEK_API_KEY');
    var model=props.getProperty(isOpenAI?'OPENAI_MODEL':'DEEPSEEK_MODEL');
    if (!key || !model) throw new Error(provider+' API key or model not configured');
    base=isOpenAI?'https://api.openai.com/v1/chat/completions':'https://api.deepseek.com/chat/completions';
    headers={Authorization:'Bearer '+key};
    body={model:model,max_tokens:maxTokens,messages:[{role:'user',content:content}]};
  }
  response=UrlFetchApp.fetch(base,{method:'post',contentType:'application/json',headers:headers,
    payload:JSON.stringify(body),muteHttpExceptions:true});
  var status=response.getResponseCode(), data=JSON.parse(response.getContentText());
  if (status<200 || status>=300) throw new Error(provider+' HTTP '+status+' '+JSON.stringify(data.error||{}).slice(0,220));
  if (provider==='claude') {
    return {text:(data.content||[]).filter(function(c){return c.type==='text';}).map(function(c){return c.text||'';}).join('\n'),
      tokens:((data.usage||{}).input_tokens||0)+((data.usage||{}).output_tokens||0)};
  }
  return {text:((((data.choices||[])[0]||{}).message||{}).content)||'',tokens:(data.usage||{}).total_tokens||0};
}

function ctsWriteRow_(tab,rowNumber,row) {
  if (row.length!==CTS.jobHeaders.length) throw new Error('Job schema mismatch');
  tab.getRange(rowNumber,1,1,row.length).setValues([row]);
}
function ctsLog_(tab,id,provider,event,state,details,tokens) {
  tab.appendRow([new Date().toISOString(),id,provider,event,state,String(details||''),tokens||0]);
}
function ctsDailyCalls_(tab) {
  var today=new Date().toISOString().slice(0,10), values=tab.getDataRange().getValues();
  var count=0;
  for (var i=1;i<values.length;i++)
    if (String(values[i][0]).slice(0,10)===today && ['API_STARTED'].indexOf(String(values[i][3]))>=0) count++;
  return count;
}
function ctsReadDate_(x) {
  if (!x) return null;
  var d=new Date(x);return isNaN(d.getTime())?null:d;
}
function ctsPositiveInt_(val,fallback) {
  if (val === null || val === undefined || String(val).trim() === '') return fallback;
  var v=Number(val);return isFinite(v)&&v>=0&&Math.floor(v)===v ? v : fallback;
}
if (typeof module !== 'undefined' && module.exports) {
 module.exports={ctsClassifyReply_,ctsExtractUnit_,ctsBuildPrompt_,ctsReadDate_,ctsPositiveInt_,ctsSameReply_};
}
