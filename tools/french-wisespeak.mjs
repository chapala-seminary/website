import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {markedLanguage} from '../src/lib/language-content.ts';
const norm=s=>parse(String(s).replaceAll('\\xa0',' ')).text.replace(/\s+/g,' ').trim();
export function frenchWiseSpeak(root){
 const source=[];const units={};
 const vocabulary=JSON.parse(fs.readFileSync('tools/data/french-wisespeak-keywords.json','utf8'));
 const originals=new Function(root.querySelectorAll('script').find(s=>s.innerHTML.includes('const UNITS = {}')).innerHTML.split('const UNITS = {}')[1].split('// ============= STATE =============')[0].replace(/^/, 'const UNITS = {};')+'return UNITS;')();
 for(let n=0;n<=10;n++){
  const base=`_review/french/WiseSpeak/WiseSpeak-unit${n}`;
  const s=JSON.parse(fs.readFileSync(base+'-source.json','utf8')),f=JSON.parse(fs.readFileSync(base+'-fr.json','utf8'));
  const blocks=Array.isArray(f.blocks)?Object.fromEntries(f.blocks.map(b=>[b.id,b.fr])):f.blocks;
  for(const b of s.blocks)source.push([norm(b.en),blocks[b.id],b.id]);
  if(n){
    f.sa.forEach((q,i)=>{q.keywords=(originals[n].essays[i].kw_en||[]).map(k=>vocabulary[k]||k);});
    units[n]=f;
  }
 }
 const map=new Map();for(const [key,fr,id] of source){if(!map.has(key))map.set(key,[]);map.get(key).push({fr,id});}
 const found=new Set();
 for(const el of root.querySelectorAll('*')){
  if(markedLanguage(el)!=='en')continue;
  let parent=el.parentNode,inside=false;while(parent){if(markedLanguage(parent)){inside=true;break;}parent=parent.parentNode;}
  if(inside)continue;
  const matches=map.get(norm(el.innerHTML));if(!matches?.length)continue;
  const match=matches.find(m=>!found.has(m.id))||matches[0];found.add(match.id);
  el.insertAdjacentHTML('afterend',`<${el.tagName.toLowerCase()} class="lang-fr">${match.fr}</${el.tagName.toLowerCase()}>`);
 }
 const missing=source.filter(x=>!found.has(x[2]));if(missing.length)throw Error(`WiseSpeak missing ${missing.length} blocks: ${missing.map(x=>x[2]).join(', ')}`);
 const script=root.querySelectorAll('script').find(s=>s.innerHTML.includes('const UNITS = {}'));
 let code=script.innerHTML;
 const patch=`\nconst FRENCH_WISESPEAK=${JSON.stringify(units)};\nfor(const [n,f] of Object.entries(FRENCH_WISESPEAK)){\n UNITS[n].mcq.forEach((q,i)=>{q.textFr=f.mc[i].stem;q.explainFr=f.mc[i].why;q.options.forEach((o,j)=>o.fr=f.mc[i].options[j]);});\n UNITS[n].essays.forEach((q,i)=>{q.promptFr=f.sa[i].prompt;q.rubricFr=f.sa[i].model;q.kw_fr=f.sa[i].keywords;});\n const qs=window.CTS_FILL_DATA?.wisespeak?.[n];if(qs)qs.forEach((q,i)=>{q.prompt.fr=f.fill[i].prompt;q.answer.fr=f.fill[i].answer;q.accept??={};q.accept.fr=f.fill[i].accept||[];});\n}\nfunction wiseBi(en,es,fr){return window.CTSLanguage.bi({en,es,fr});}\n`;
 code=code.replace('// ============= STATE =============',patch+'\n// ============= STATE =============');
 const pairs=[['${i+1}. ${q.textEn}','${i+1}. ${q.textEs}','${wiseBi((i+1)+". "+q.textEn,(i+1)+". "+q.textEs,(i+1)+". "+q.textFr)}'],['${String.fromCharCode(65+j)}. ${opt.en}','${String.fromCharCode(65+j)}. ${opt.es}','${wiseBi(String.fromCharCode(65+j)+". "+opt.en,String.fromCharCode(65+j)+". "+opt.es,String.fromCharCode(65+j)+". "+opt.fr)}'],['Scenario ${i+1}: ${e.promptEn}','Escenario ${i+1}: ${e.promptEs}','${wiseBi("Scenario "+(i+1)+": "+e.promptEn,"Escenario "+(i+1)+": "+e.promptEs,"Scénario "+(i+1)+": "+e.promptFr)}'],['${q.explainEn}','${q.explainEs}','${wiseBi(q.explainEn,q.explainEs,q.explainFr)}'],['${e.rubricEn}','${e.rubricEs}','${wiseBi(e.rubricEn,e.rubricEs,e.rubricFr)}']];
 for(const [en,es,out] of pairs)code=code.replaceAll(`<span class="lang-en">${en}</span><span class="lang-es">${es}</span>`,out);
 code=code.replaceAll("const kws = (isEs ? (q.kw_es||[]) : (q.kw_en||[]));", "const kws = q.kw_fr || (isEs ? (q.kw_es||[]) : (q.kw_en||[]));");
 code=code.replace('if(!answer || !kw) return false;', 'if(Array.isArray(kw)) return kw.some(k=>kwHit(answer,k));\n  if(!answer || !kw) return false;');
 code=code.replace('kws.forEach(k=>{ if(kwHit(text, k)) hits++; });', 'kws.forEach((k,i)=>{ if(kwHit(text,k) || kwHit(text,(q.kw_en||[])[i])) hits++; });');
 code=code.replace('return kws.filter(k=> k && !kwHit(text, k));', 'return kws.filter((k,i)=> k && !kwHit(text,k) && !kwHit(text,(q.kw_en||[])[i]));');
 script.set_content(code);return source.length;
}
