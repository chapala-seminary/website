// Compare explicit exam-heading counts with the actual published unit banks.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {parse} from 'node-html-parser';
const dir=process.argv[2]||'dist', failures=[];
let units=0, headings=0;
for(const course of fs.readdirSync('src/content/units')) {
 for(const file of fs.readdirSync(`src/content/units/${course}`).filter(f=>f.endsWith('.json'))) {
  const unit=JSON.parse(fs.readFileSync(`src/content/units/${course}/${file}`,'utf8'));
  const page=`${course}Unit${unit.unit}.html`;
  if(!fs.existsSync(`${dir}/${page}`))continue;
  units++;
  for(const lang of ['en','es','fr']) {
   const route=`${dir}/${lang==='en'?'':lang+'/'}${page}`;
   const root=parse(fs.readFileSync(route,'utf8'));
   for(const heading of root.querySelectorAll('h2,h3,h4')) {
    const text=heading.text.replace(/\s+/g,' ');
    if(!/Multiple Choice|Opción Múltiple|choix multiple/i.test(text))continue;
    const stated=/\((\d+)\s*[·:]/.exec(text);
    if(!stated)continue;
    headings++;
    if(Number(stated[1])!==unit.mc.length)failures.push(`${route}: ${stated[1]} stated, ${unit.mc.length} questions`);
   }
  }
 }
}
assert.equal(units,466,'all standard units checked');
assert.deepEqual(failures,[]);
console.log(`PASS — ${units} unit banks in three languages; ${headings} explicit MC headings match actual question counts.`);
