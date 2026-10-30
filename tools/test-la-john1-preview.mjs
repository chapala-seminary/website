// Review-only regression checks for the unlinked John 1 chapter prototype.
// Run from repository root: node tools/test-la-john1-preview.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const path='src/body/rooms/CTSLAJohn1FullChapterDemo.html';
const source=readFileSync(path,'utf8');
const match=source.match(/<script id="chapter-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'Expected embedded source-data element');
const data=JSON.parse(match[1]);
assert.equal(data.verses.length,51,'Chapter must have all 51 verses');
assert.equal(data.verses.reduce((n,v)=>n+v.w.length,0),826,'Source token count changed — review alignment');
assert.ok(source.includes('aria-pressed'),'Buttons should expose selected state');
assert.ok(source.includes('aria-live="polite"'),'Gloss reader should announce updates');
assert.ok(source.includes('id="translation"'),'Translation reveal expected');
assert.ok(!/<script[^>]+src=|fetch\(|XMLHttpRequest|localStorage|sessionStorage/.test(source),'Should work offline and record no student data');
for(let n=1;n<=51;n++){
  const verse=data.verses[n-1];
  assert.equal(verse.v,n,'Verse order must be consecutive');
  assert.ok(verse.w.length>0,'Missing Greek words at '+n);
  for(const word of verse.w)for(const key of ['t','l','m'])assert.ok(word[key],'Missing '+key+' at verse '+n);
  for(const lang of ['en','es','fr']){
    assert.ok(verse.trans[lang]?.trim(),'Missing '+lang+' draft translation of verse '+n);
    assert.ok(!/\{\{|\\v/.test(verse.trans[lang]),'Unrendered editorial placeholder at '+n+' ('+lang+')');
  }
}
assert.ok(data.source.greek.includes('CC BY 4.0'),'Greek attribution missing');
assert.ok(data.source.annotations.includes('CC BY 4.0'),'Gloss attribution missing');
assert.ok(data.source.translations.includes('UNREVIEWED'),'Critical academic draft status not disclosed');
assert.ok(data.observations['18']?.en.includes('Manuscript'),'John 1:18 reading note required');
console.log('PASS — 51 verses, 826 Greek words, EN/ES/FR draft renderings, licenses and safe standalone preview.');
