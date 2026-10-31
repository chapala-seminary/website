// CTS Language Appreciation: ensure experimental labs are reachable without
// changing the five assigned readings, honors attestation or student grading.
// No network, credentials, or private examination keys needed.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const read = path => readFileSync(path,'utf8');
const room=read('src/body/rooms/CTSLAReadings.html');
const labs=[
 ['Greek', 'src/body/rooms/CTSLAJohn1FullChapterDemo.html', 'public/CTSLAJohn1GreekLab.html', 'chapter-data',51,826],
 ['Hebrew','src/body/rooms/CTSLAGenesis1HebrewFullChapterDemo.html','public/CTSLAGenesis1HebrewLab.html','genesis-data',31,434]
];
assert.equal((room.match(/<article class="reading">/g)||[]).length,5,'Keep five assigned readings');
assert.equal((room.match(/data-pick=/g)||[]).length,5,'Keep five honors checkboxes');
assert.equal((room.match(/<!-- CTS-ATTEST:/g)||[]).length,1,'Do not interfere with generated attestation');
assert.equal((room.match(/<!-- CTS-SHELF:/g)||[]).length,1,'Do not interfere with generated optional shelf');
assert.ok(room.indexOf('id="cts-language-labs"')<room.indexOf('<!-- CTS-ATTEST:'),'Show labs after digests and before attestation');
assert.ok(room.includes('Both laboratories are optional and ungraded'),'Keep non-required guidance');
for(const lang of ['lang-en','lang-es','lang-fr'])assert.ok(room.includes(lang),'Missing language tag '+lang);
for(const [lang,sourcePath,publicPath,dataId,expectedVerses,expectedWords] of labs){
 const file=read(publicPath),source=read(sourcePath);
 assert.equal(file,source,lang+': published page must match prototype');
 assert.ok(room.includes('href="/'+publicPath.replace(/^public\//,'')+'"'),lang+': missing room link');
 const dataMatch=file.match(new RegExp('<script id="'+dataId+'" type="application/json">([\\s\\S]*?)</script>'));
 assert.ok(dataMatch,lang+': embedded chapter data missing');
 const data=JSON.parse(dataMatch[1]);
 assert.equal(data.verses.length,expectedVerses,lang+': incomplete chapter');
 assert.equal(data.verses.reduce((sum,v)=>sum+v.w.length,0),expectedWords,lang+': unexpected word count');
 for(const v of data.verses){
  for(const key of ['en','es','fr'])assert.ok(v.trans[key]?.trim(),lang+': missing '+key+' translation in verse '+v.v);
 }
 assert.ok(!/<script[^>]+src=|fetch\(|XMLHttpRequest|localStorage|sessionStorage/.test(file),lang+': must run without network requests or tracking');
}
console.log('PASS: both full-chapter labs match the published assets, Reading 5 links are valid, five readings and honors remain unchanged.');
