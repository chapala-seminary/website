import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// A donation must not be a gate to seminary work and cannot claim a tax benefit.
// Test the complete built site in every generated language, no network or payment required.
test('donation page and quiet footer remain safe in all four locales', () => {
 for(const lang of ['en','es','fr','sw']){
  const prefix=lang==='en'?'':lang+'/';
  const support=fs.readFileSync(path.join('dist',prefix,'CTSSupport.html'),'utf8');
  const home=fs.readFileSync(path.join('dist',prefix,'index.html'),'utf8');
  const study=fs.readFileSync(path.join('dist',prefix,'CTSStudyLibrary.html'),'utf8');
  assert.match(home,/cts-support-footer/);
  assert.match(study,/cts-support-footer/);
  assert.match(home,/href="(?:\/[^"]*\/)?CTSSupport\.html"/);
  assert.match(support,/https:\/\/cash\.app\/\$Cookww/);
  assert.match(support,new RegExp('<html\\s+lang="'+lang+'"'));
  assert.match(support,new RegExp('class="locale" lang="'+lang+'"'));
  assert.doesNotMatch(support,/https:\/\/py\.pl|PayPal/i,'fixed one-time PayPal request must not be published');
  assert.doesNotMatch(support,/<form\b|<input\b|name="(?:card|cc-number|amount)"/i,'do not collect payment info');
  assert.doesNotMatch(support,/tax.deductible donation|tax.deductible gift/i,'do not claim donor deduction');
  assert.match(support,/rel="noopener noreferrer"/);
 }
});

test('donations are not inserted into exams and registration',()=>{
 const pages=['CTSUnit1.html','CTSSTUnit1.html','CTSTextbookBroadusTest.html'];
 for(const name of pages){
  let p=path.join('dist',name);if(!fs.existsSync(p))continue;
  const text=fs.readFileSync(p,'utf8');
  assert.doesNotMatch(text,/cts-support-footer|cash\.app\/\$Cookww|\bSupport Our Ministry\b/);
 }
});
