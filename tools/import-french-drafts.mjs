// Publish Robert-authorized French drafts to beta, retaining source provenance.
// Usage: node tools/import-french-drafts.mjs [--write] [--course=CTSActs,CTSJohn]
// Units that already have French (lesson langs include fr) are published: they are
// edited in the CMS, never re-imported. Where the English changed after a packet was
// made, the French comes from an explicit correction in tools/data/french-*-corrections.json
// (keys COURSE/UNIT/block/ID, COURSE/UNIT/SECTION/INDEX/FIELD; an mc .../answer key
// confirms that a corrected answer index selects the same French option).
import fs from 'node:fs';
import path from 'node:path';
import { translationPlan } from './translation-plan.mjs';
const root='_review/french', write=process.argv.includes('--write');
const only=process.argv.find(a=>a.startsWith('--course='))?.slice(9).split(',');
const corrections={};
for(const file of fs.readdirSync('tools/data').filter(f=>/^french-.*-corrections\.json$/.test(f)).sort())
 for(const [key,value] of Object.entries(JSON.parse(fs.readFileSync('tools/data/'+file,'utf8')))){
  if(Object.hasOwn(corrections,key))throw Error(`${key} corrected twice (${file})`);corrections[key]=value;
 }
const used=new Set(),seen=new Set(),writes=[];let count=0,skipped=0;
const correct=key=>{used.add(key);return corrections[key];};
for(const course of fs.readdirSync(root).filter(c=>fs.statSync(path.join(root,c)).isDirectory()&&c!=='tools'&&c!=='WiseSpeak')){
 if(only&&!only.includes(course))continue;
 for(const name of fs.readdirSync(path.join(root,course)).filter(n=>n.endsWith('-source.json'))){
  const source=JSON.parse(fs.readFileSync(path.join(root,course,name),'utf8'));
  const draft=JSON.parse(fs.readFileSync(path.join(root,course,name.replace('-source','-fr')),'utf8'));
  const lp=`src/content/lessons/${course}/${source.unit}.json`,up=`src/content/units/${course}/${source.unit}.json`;
  const lesson=JSON.parse(fs.readFileSync(lp,'utf8')),unit=JSON.parse(fs.readFileSync(up,'utf8'));
  const unitKey=`${course}/${source.unit}`;seen.add(unitKey);
  if(lesson.langs.includes('fr')){skipped++;continue;}
  const blocks=Array.isArray(draft.blocks)?Object.fromEntries(draft.blocks.map(b=>[b.id,b.fr])):{...draft.blocks};
  for(const b of lesson.blocks){
   if(!b.text.en)continue;
   const key=`${unitKey}/block/${b.id}`,old=source.blocks.find(x=>x.id===b.id);
   if(Object.hasOwn(corrections,key))blocks[b.id]=correct(key);
   else if(!old||old.en!==b.text.en)throw Error(`${lp} block ${b.id} changed; needs correction ${key}`);
   if(!blocks[b.id])throw Error(`${lp} missing ${b.id}`);
  }
  const why=new Map(source.mc.map((q,i)=>[q.why,draft.mc[i].why]));
  for(const sec of ['mc','fill','sa']){
   if(unit[sec].length!==draft[sec].length)throw Error(`${up} ${sec} count`);
   unit[sec].forEach((q,i)=>{
    const old=source[sec][i],fr=structuredClone(draft[sec][i]);
    // The answer index is shared across languages; a changed key must be confirmed.
    if(sec==='mc'&&q.answer!==old.answer){const key=`${unitKey}/mc/${i}/answer`;if(correct(key)!==q.answer)throw Error(`${key} answer ${old.answer}->${q.answer} needs confirmation`);}
    for(const field of ['stem','options','why','prompt','answer','accept','keywords','model']){
     if(typeof q[field]==='number')continue;
     const en=q[field]?.en;if(en==null)continue;
     const key=`${unitKey}/${sec}/${i}/${field}`;
     const oldEn=old[field]??old[field+'_en'];
     if(Object.hasOwn(corrections,key))fr[field]=correct(key);
     else if(field==='why'&&oldEn!==en){if(!why.has(en))throw Error(`${key} needs correction`);fr[field]=why.get(en);}
     else if(field==='options'&&JSON.stringify(oldEn)!==JSON.stringify(en)){
      if(en.some(v=>!oldEn.includes(v)))throw Error(`${key} new option`);
      fr.options=en.map(v=>draft[sec][i].options[oldEn.indexOf(v)]);
     }else if(JSON.stringify(oldEn??(field==='accept'?[]:null))!==JSON.stringify(en))throw Error(`${key} stale source`);
     if(fr[field]==null)throw Error(`${key} missing French`);
     if(field==='options'&&fr.options.length!==en.length)throw Error(`${key} option count`);
     q[field].fr=fr[field];
    }
    if(sec==='sa'&&!q.model&&fr.model)q.model={fr:Object.hasOwn(corrections,`${unitKey}/sa/${i}/model`)?correct(`${unitKey}/sa/${i}/model`):fr.model};
    if(sec==='fill'&&fr.accept?.length){q.accept??={};q.accept.fr=fr.accept;}
   });
  }
  // Compute hashes before filling block text, preserving any existing reviewed work.
  const plan=translationPlan(lesson,JSON.parse(fs.readFileSync(up,'utf8')),'fr');
  if(plan.protectedItems.length)throw Error(plan.protectedItems.join('\n'));
  for(const b of lesson.blocks)if(b.text.en)b.text.fr=blocks[b.id];
  const finalPlan=translationPlan(JSON.parse(fs.readFileSync(lp,'utf8')),JSON.parse(fs.readFileSync(up,'utf8')),'fr');
  for(const job of finalPlan.jobs){
   const target=job.label.startsWith('block ')?lesson.blocks.find(b=>b.id===job.label.slice(6)):unit[job.label.split(' ')[0]][Number(job.label.split(' ')[1])-1];
   target.tr={...target.tr,fr:{status:'machine',from:job.stamp}};
  }
  lesson.langs=[...new Set([...lesson.langs,'fr'])];writes.push([lp,lesson],[up,unit]);count++;
 }
}
// A correction for a unit being imported that was never applied is a stale or mistyped key.
const unused=Object.keys(corrections).filter(k=>!used.has(k)&&writes.some(([p])=>p.startsWith(`src/content/lessons/${k.split('/').slice(0,2).join('/')}.json`)));
if(unused.length)throw Error(`unused corrections:\n${unused.join('\n')}`);
if(write)for(const [p,data] of writes)fs.writeFileSync(p,JSON.stringify(data,null,1)+'\n');
console.log(`${count} French units ${write?'imported':'validated; nothing written'}; ${skipped} already published units skipped.`);
