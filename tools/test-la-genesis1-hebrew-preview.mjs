// Regression checks for the unlinked Genesis 1 Hebrew faculty prototype.
// From repository root: node tools/test-la-genesis1-hebrew-preview.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const path='src/body/rooms/CTSLAGenesis1HebrewFullChapterDemo.html';
const html=readFileSync(path,'utf8');
const embedded=html.match(/<script id="genesis-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(embedded,'Embedded Genesis JSON missing');
const data=JSON.parse(embedded[1]);
assert.equal(data.verses.length,31,'Genesis chapter 1 has 31 verses');
let words=0,morphemes=0;
for(let v=1;v<=31;v++){
 const verse=data.verses[v-1];
 assert.equal(verse.v,v,'Verse order mismatched');
 assert.ok(verse.w.length,'Missing verse words: '+v);
 words+=verse.w.length;
 for(const w of verse.w){
  assert.ok(w.t,'Missing Hebrew text in verse '+v);
  assert.ok(Array.isArray(w.parts) && w.parts.length,'Missing morphology in verse '+v);
  assert.equal(w.parts.map(p=>p.t).join(''),w.t,'Morpheme grouping changed in verse '+v);
  for(const p of w.parts)assert.ok(p.t && p.lemma && p.m,'Missing source morphology in verse '+v);
  morphemes+=w.parts.length;
 }
 for(const lng of ['en','es','fr']){
  assert.ok(verse.trans[lng]?.trim(),'Missing draft translation verse '+v+' '+lng);
  assert.ok(!/\{\{|\\v\b/.test(verse.trans[lng]),'Unprocessed editorial markup '+v+' '+lng);
 }
}
assert.equal(words,434,'Unexpected orthographic word count');
assert.equal(morphemes,690,'Unexpected source morpheme count');
assert.ok(html.includes('dir="rtl"') && html.includes('lang="he"'),'Hebrew RTL markers required');
assert.ok(html.includes('aria-pressed') && html.includes('aria-live="polite"'),'Accessible interaction required');
assert.ok(html.includes('<noscript>'),'Basic noninteractive fallback required');
assert.ok(!/<script[^>]+src=|fetch\(|XMLHttpRequest|localStorage|sessionStorage/.test(html),'Offline/no-tracking requirement violated');
assert.ok(data.source.annotations.includes('CC BY 4.0'),'Annotation license attribution missing');
assert.ok(data.source.renderings.includes('ai_draft'),'Draft state disclosure missing');
assert.ok(data.notes['1']?.en.includes('אֱלֹהִים'),'Critical grammatical note missing');
console.log('PASS: Genesis 1, 31 verses, 434 Hebrew words, 690 morphemes, EN/ES/FR drafts, licenses and safe preview.');
