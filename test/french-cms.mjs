/* A later translated unit must survive CMS save even if Unit 1 has no French. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { parse } from 'yaml';
const root = fs.mkdtempSync(path.join(os.tmpdir(),'cts-fr-cms-'));
try {
  for(const dir of ['tools','public/admin','src/content/lessons/CTS','src/content/units/CTS','src/content/courses'])fs.mkdirSync(path.join(root,dir),{recursive:true});
  fs.symlinkSync(path.resolve('node_modules'),path.join(root,'node_modules'));
  for(const file of ['build-cms-config.mjs','verify-cms-config.mjs'])fs.copyFileSync('tools/'+file,path.join(root,'tools',file));
  for(const n of [1,2])for(const kind of ['lessons','units'])fs.copyFileSync(`src/content/${kind}/CTS/${n}.json`,path.join(root,`src/content/${kind}/CTS/${n}.json`));
  fs.copyFileSync('src/content/courses/CTS.json',path.join(root,'src/content/courses/CTS.json'));
  const lp=path.join(root,'src/content/lessons/CTS/2.json'),lesson=JSON.parse(fs.readFileSync(lp));
  lesson.langs.push('fr');for(const b of lesson.blocks)if(b.text.en!=null){b.text.fr=b.text.en;b.tr={...b.tr,fr:{status:'human',from:'123456789abc'}};}
  fs.writeFileSync(lp,JSON.stringify(lesson));
  const up=path.join(root,'src/content/units/CTS/2.json'),unit=JSON.parse(fs.readFileSync(up));
  for(const section of ['mc','fill','sa'])for(const q of unit[section]){
    for(const field of ['stem','prompt','options','why','answer','accept','keywords','model'])if(q[field]?.en!=null)q[field].fr=q[field].en;
    q.tr={fr:{status:'machine-edited',from:'123456789abc'}};
  }
  fs.writeFileSync(up,JSON.stringify(unit));
  execFileSync('node',['tools/build-cms-config.mjs'],{cwd:root,stdio:'pipe'});
  const output=execFileSync('node',['tools/verify-cms-config.mjs'],{cwd:root,encoding:'utf8'});
  assert.ok(output.includes('OK: every field'));
  const config=parse(fs.readFileSync(path.join(root,'public/admin/config.yml'),'utf8'));
  const exam=config.collections.find(c=>c.name==='units');
  for(const name of ['mc','fill','sa']){
    const review=exam.fields.find(f=>f.name===name).fields.find(f=>f.name==='tr');
    assert.ok(review.fields.find(f=>f.name==='fr').fields.find(f=>f.name==='status').options.some(o=>o.value==='machine-edited'));
  }
  console.log('PASS — CMS retains later-unit French text, keys and provenance; reviewed status is editable.');
} finally {fs.rmSync(root,{recursive:true,force:true});}
