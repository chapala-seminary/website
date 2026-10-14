// Grade every imported French answer with the shipped engine, not a copy.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const units=[];
for(const course of fs.readdirSync('src/content/lessons'))for(const f of fs.readdirSync('src/content/lessons/'+course).filter(x=>x.endsWith('.json'))){const l=JSON.parse(fs.readFileSync(`src/content/lessons/${course}/${f}`,'utf8'));if(l.langs.includes('fr'))units.push(JSON.parse(fs.readFileSync(`src/content/units/${course}/${f}`,'utf8')));}
// Every packet course unit (tools/import-french-drafts.mjs; test/french-import.test.mjs names any missing one)
// plus the 13 Old Testament Survey units drafted by Claude (13 Oct 2026). Count-based so new drafts don't break it.
// Genesis short answers have no keywords in any language (English source); their
// Missing-key models must be rejected; they do not establish correct grading.
assert.ok(units.length>=466,`${units.length} French units`);
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
try{
 const page=await browser.newPage();await page.setContent('<html lang="fr"><body data-lang="fr" class="lang-fr"><div id="questionsContainer"></div><div id="kwContainer"></div><button id="submitExamBtn"></button><div id="examResult"></div></body></html>');
 await page.evaluate(()=>{Object.defineProperty(document,'readyState',{configurable:true,get:()=> 'loading'});window.CTS_UNIT={course:'french-draft-check',unit:1,totalUnits:1,sourceLang:'en',langs:['en','es','fr'],mc:[],fill:[],sa:[]};});
 await page.addScriptTag({path:path.resolve('public/assets/js/cts-engine.js')});await page.evaluate(()=>document.dispatchEvent(new Event('DOMContentLoaded')));
 const result=await page.evaluate(units=>{const e=window.CTS_ENGINE,failures=[];let count=0;for(const u of units){for(const [i,q] of u.sa.entries()){for(const code of ['fr','en']){if(!q.model?.[code])continue;const lists=Array.isArray(q.keywords)?[q.keywords]:[q.keywords?.fr,q.keywords?.en];const hasKeys=lists.some(list=>Array.isArray(list)&&list.length>0);if(e.shortAnswerRight(q,q.model[code])!==hasKeys)failures.push(`${u.course}/${u.unit} sa ${i+1}: ${code} model`);count++;}if(e.shortAnswerRight(q,''))failures.push(`${u.course}/${u.unit} sa ${i+1}: empty passes`);count++;}for(const [i,q] of u.mc.entries()){if(!Array.isArray(q.options?.fr)||q.options.fr.length!==q.options.en.length||!(q.answer>=0&&q.answer<q.options.en.length))failures.push(`${u.course}/${u.unit} mc ${i+1}: French options do not match the English answer key`);count++;}for(const [i,q] of u.fill.entries()){for(const a of [q.answer.fr,...(q.accept?.fr||[]),q.answer.en]){if(!e.fillRight(q,a))failures.push(`${u.course}/${u.unit} fill ${i+1}: answer rejected`);count++;}}}return{count,failures};},units);
 assert.deepEqual(result.failures,[]);console.log(`PASS — ${result.count} French/source grading checks across ${units.length} French draft units.`);
}finally{await browser.close();}
