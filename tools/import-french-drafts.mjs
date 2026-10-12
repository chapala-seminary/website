// Publish Robert-authorized French drafts to beta, retaining source provenance.
import fs from 'node:fs';
import path from 'node:path';
import { translationPlan } from './translation-plan.mjs';
const root='_review/french', write=process.argv.includes('--write');
const corrections=JSON.parse(fs.readFileSync('tools/data/french-beta-corrections.json','utf8'));
const writes=[];let count=0;
for(const course of fs.readdirSync(root).filter(c=>fs.statSync(path.join(root,c)).isDirectory()&&c!=='tools'&&c!=='WiseSpeak')){
 for(const name of fs.readdirSync(path.join(root,course)).filter(n=>n.endsWith('-source.json'))){
  const source=JSON.parse(fs.readFileSync(path.join(root,course,name),'utf8'));
  const draft=JSON.parse(fs.readFileSync(path.join(root,course,name.replace('-source','-fr')),'utf8'));
  const lp=`src/content/lessons/${course}/${source.unit}.json`,up=`src/content/units/${course}/${source.unit}.json`;
  const lesson=JSON.parse(fs.readFileSync(lp,'utf8')),unit=JSON.parse(fs.readFileSync(up,'utf8'));
  const blocks=Array.isArray(draft.blocks)?Object.fromEntries(draft.blocks.map(b=>[b.id,b.fr])):draft.blocks;
  for(const b of lesson.blocks){if(!b.text.en)continue;const old=source.blocks.find(x=>x.id===b.id);if(!old||old.en!==b.text.en)throw Error(`${lp} block ${b.id} changed`);if(!blocks[b.id])throw Error(`${lp} missing ${b.id}`);}
  const why=new Map(source.mc.map((q,i)=>[q.why,draft.mc[i].why]));
  for(const sec of ['mc','fill','sa']){
   if(unit[sec].length!==draft[sec].length)throw Error(`${up} ${sec} count`);
   unit[sec].forEach((q,i)=>{
    const old=source[sec][i],fr=structuredClone(draft[sec][i]);
    for(const field of ['stem','options','why','prompt','answer','accept','keywords','model']){
     if(typeof q[field]==='number')continue;
     const en=q[field]?.en;if(en==null)continue;
     const key=`${course}/${source.unit}/${sec}/${i}/${field}`;
     const oldEn=old[field]??old[field+'_en'];
     if(Object.hasOwn(corrections,key))fr[field]=corrections[key];
     else if(field==='why'&&oldEn!==en){if(!why.has(en))throw Error(`${key} needs correction`);fr[field]=why.get(en);}
     else if(field==='options'&&JSON.stringify(oldEn)!==JSON.stringify(en)){
      if(en.some(v=>!oldEn.includes(v)))throw Error(`${key} new option`);
      fr.options=en.map(v=>draft[sec][i].options[oldEn.indexOf(v)]);
     }else if(JSON.stringify(oldEn??(field==='accept'?[]:null))!==JSON.stringify(en))throw Error(`${key} stale source`);
     if(fr[field]==null)throw Error(`${key} missing French`);
     q[field].fr=fr[field];
    }
    if(sec==='sa'&&!q.model&&fr.model)q.model={fr:fr.model};
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
if(write)for(const [p,data] of writes)fs.writeFileSync(p,JSON.stringify(data,null,1)+'\n');
console.log(`${count} French units ${write?'imported':'validated; nothing written'}.`);
