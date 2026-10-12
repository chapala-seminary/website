#!/usr/bin/env node
/** Verify an independent Master's book exam against its CTS digest exam.
 * Use: node verify_exam_separation.mjs TEXTBOOK_BANK.json DIGEST_BANK.json BOOK.html
 * Read only; no package installs, grade changes, or student records.
 */
import fs from 'node:fs';
const [bookPath, digestPath, htmlPath]=process.argv.slice(2);
if(!bookPath || !digestPath || !htmlPath){
 console.error('Usage: node verify_exam_separation.mjs textbook.json digest.json full_english_book.html');process.exit(2);
}
const book=JSON.parse(fs.readFileSync(bookPath,'utf8'));
const digest=JSON.parse(fs.readFileSync(digestPath,'utf8'));
const html=fs.readFileSync(htmlPath,'utf8');
const raw=(q,lang)=>q.answer?.[lang]??q['answer_'+lang]??'';
const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').replace(/\s+/g,' ').trim();
const compact=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'');
const entityDecode=s=>String(s).replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16)))
 .replace(/&#([0-9]+);/g,(_,n)=>String.fromCodePoint(Number(n)))
 .replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&nbsp;/g,' ')
 .replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const extractChapters=()=>{
 const chapters=new Map();
 for(const m of html.matchAll(/<section\s+id="chapter-([IVXLC]+)"[^>]*>([\s\S]*?)<\/section>/g)){
  const rawText=entityDecode(m[2].replace(/<[^>]+>/g,' ').replace(/_/g,''));
  chapters.set(m[1],norm(rawText));
 }
 return chapters;
};
const errors=[]; const err=x=>errors.push(x);
if(book.questions?.length!==40)err('textbook: expected 40 questions');
if(digest.questions?.length!==40)err('digest: expected 40 questions');
const qs=book.questions||[], other=digest.questions||[];
const chapters=extractChapters();
const qids=new Set(), answers={en:new Map(),es:new Map()};
const digestAnswers={en:new Set(other.map(q=>norm(raw(q,'en')))),es:new Set(other.map(q=>norm(raw(q,'es'))))};
const exclusions=new Set(['of','the','and','de','del','la','los','las','el','una','uno','un','por','con']);
const digestTokens={en:new Set(),es:new Set()};
for(const lang of ['en','es']) for(const a of digestAnswers[lang]) for(const w of a.split(' ')) if(w.length>=4&&!exclusions.has(w)) digestTokens[lang].add(w);
for(const q of qs){
 if(qids.has(q.id))err('duplicate ID '+q.id);
 qids.add(q.id);
 for(const lang of ['en','es']){
  const a=norm(raw(q,lang)), question=q.prompt?.[lang]??q[lang];
  if(!a)err(`${q.id}: missing ${lang} answer`);
  if(typeof question!=='string'||question.split('____').length!==2)err(`${q.id}: ${lang} exactly one blank required`);
  if(answers[lang].has(a))err(`${q.id}: repeats ${lang} answer from ${answers[lang].get(a)}: ${a}`);
  answers[lang].set(a,q.id);
  if(digestAnswers[lang].has(a))err(`${q.id}: ${lang} primary answer duplicates digest: ${a}`);
  if(question&&norm(question.replace(/____/g,' ')).split(' ').includes(a))err(`${q.id}: ${lang} answer revealed by prompt`);
  for(const w of a.split(' ')) if(w.length>=4 && !exclusions.has(w) && digestTokens[lang].has(w))err(`${q.id}: ${lang} answer word repeated from digest: ${w}`);
 }
 if(!q.source_chapter || !q.source_quote)err(`${q.id}: no chapter/quotation ledger`);
 else {
  const ch=chapters.get(q.source_chapter);
  if(!ch)err(`${q.id}: source chapter ${q.source_chapter} missing from HTML`);
  else if(!ch.includes(norm(q.source_quote.replace(/_/g,''))))err(`${q.id}: claimed source quote not found in assigned chapter`);
  if(!norm(q.source_quote).includes(norm(raw(q,'en'))))err(`${q.id}: source quote does not include English answer`);
 }
}
for(let g=1;g<=5;g++)if(qs.filter(q=>Number(q.group??q.reading_group)===g).length!==8)err(`group ${g}: expected eight questions`);
if(book.exam_format?.questions_per_attempt!==20 || book.exam_format?.passing_score!==18)err('expected draw 20 and pass 18');
console.log(`${qs.length} textbook questions, ${other.length} digest questions, ${chapters.size} book chapters checked.`);
if(errors.length){errors.forEach(e=>console.error('FAIL '+e));process.exit(1)}
console.log('PASS: shape, 5x8 groups, 20/18, bilingual answers, no lexical answer overlap, and all 40 quoted sentences located in their stated book chapters.');
console.log('NOTE: semantic equivalence, translation quality, defensible accepted variants, grading and deployment still require review.');
