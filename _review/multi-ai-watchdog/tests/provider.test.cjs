const assert=require('node:assert/strict');
const fs=require('fs');const path=require('path');const vm=require('vm');
const script=fs.readFileSync(path.join(__dirname,'..','Code.gs'),'utf8');
const captured=[];const props={
 MAX_OUTPUT_TOKENS:'600',OPENAI_API_KEY:'fake',OPENAI_MODEL:'gpt-6.1-sol',
 CLAUDE_API_KEY:'fake',CLAUDE_MODEL:'claude-sonnet-5-5',
 DEEPSEEK_API_KEY:'fake',DEEPSEEK_MODEL:'deepseek-flash',
 OPENAI_USD_PER_M_INPUT_TOKENS:'2',OPENAI_USD_PER_M_OUTPUT_TOKENS:'10',
 CLAUDE_USD_PER_M_INPUT_TOKENS:'2',CLAUDE_USD_PER_M_OUTPUT_TOKENS:'10',
 DEEPSEEK_USD_PER_M_INPUT_TOKENS:'0.5',DEEPSEEK_USD_PER_M_OUTPUT_TOKENS:'2'
};
const context={module:{exports:{}},String,Number,Math,JSON,Error,Date,isFinite,parseInt,RegExp,
 UrlFetchApp:{fetch:(url,args)=>{const body=JSON.parse(args.payload);captured.push({url,headers:args.headers,body});
 if(url.includes('anthropic.com'))return {getResponseCode:()=>200,getContentText:()=>JSON.stringify({content:[{type:'text',text:'Claude [[CTS_DONE]]'}],usage:{input_tokens:24,output_tokens:4}})};
 return {getResponseCode:()=>200,getContentText:()=>JSON.stringify({choices:[{message:{content:'Done [[CTS_DONE]]'}}],usage:{prompt_tokens:24,completion_tokens:4,total_tokens:28}})};
 }}
};vm.runInNewContext(script,context);
const getProp=k=>props[k];const p={getProperty:getProp};
for(const provider of ['openai','claude','deepseek']){
 const res=context.ctsProviderCall_(provider,'Review this paragraph',p);
 assert.ok(res.text.includes('[[CTS_DONE]]'));assert.equal(res.inputTokens,24);assert.equal(res.outputTokens,4);
}
assert.ok(captured[0].url.includes('openai.com'));assert.equal(captured[0].body.max_completion_tokens,600);assert.equal(captured[0].body.max_tokens,undefined);
assert.ok(captured[1].url.includes('anthropic.com'));assert.equal(captured[1].body.max_tokens,600);
assert.ok(captured[2].url.includes('deepseek.com'));assert.equal(captured[2].body.max_tokens,600);
assert.equal(captured[2].body.reasoning_effort,'none');
console.log('PASS: three provider API request shapes and usage parsing (offline mocks)');
