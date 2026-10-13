import fs from 'node:fs';
import {parse} from 'node-html-parser';
import {markedLanguage} from '../src/lib/language-content.ts';
import {frenchRuntimeSpans, replaceLiterals, replaceOnce} from './french-static-runtime.mjs';
const norm=s=>parse(String(s).replaceAll('\\xa0',' ')).text.replace(/\s+/g,' ').trim();
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
/* Add a French sibling after each English-marked element whose wording matches
 * a reviewed source block. Shared with the other single-page courses. */
export function insertFrenchBlocks(root, source, label){
 const map=new Map();for(const [key,fr,id] of source){if(!map.has(key))map.set(key,[]);map.get(key).push({fr,id});}
 const found=new Set();
 for(const el of root.querySelectorAll('*')){
  if(markedLanguage(el)!=='en')continue;
  let parent=el.parentNode,inside=false;while(parent){if(markedLanguage(parent)){inside=true;break;}parent=parent.parentNode;}
  if(inside)continue;
  const next=el.nextElementSibling;
  const matches=map.get(norm(el.innerHTML));if(!matches?.length)continue;
  const match=matches.find(m=>!found.has(m.id))||matches[0];found.add(match.id);
  if(next&&markedLanguage(next)==='fr')continue;
  el.insertAdjacentHTML('afterend',`<${el.tagName.toLowerCase()} class="lang-fr">${match.fr}</${el.tagName.toLowerCase()}>`);
 }
 const missing=source.filter(x=>!found.has(x[2]));if(missing.length)throw Error(`${label} missing ${missing.length} blocks: ${missing.map(x=>x[2]).join(', ')}`);
}
/* Page chrome common to the single-page courses (textbook banner). */
export function chromeBlocks(){
 return Object.entries(json('tools/data/french-static-chrome.json').blocks).map(([en,fr],i)=>[norm(en),fr,'chrome-'+i]);
}
export function insertChrome(root, label){
 const all=chromeBlocks();
 const present=all.filter(([key])=>root.querySelectorAll('*').some(el=>markedLanguage(el)==='en'&&norm(el.innerHTML)===key));
 insertFrenchBlocks(root,present,label+' chrome');
}
export function frenchWiseSpeak(root){
 const source=[];const units={};
 const vocabulary=json('tools/data/french-wisespeak-keywords.json');
 const labels=json('tools/data/french-wisespeak-labels.json');
 const ui=json('tools/data/french-wisespeak-ui.json');
 const originals=new Function(root.querySelectorAll('script').find(s=>s.innerHTML.includes('const UNITS = {}')).innerHTML.split('const UNITS = {}')[1].split('// ============= STATE =============')[0].replace(/^/, 'const UNITS = {};')+'return UNITS;')();
 for(let n=0;n<=10;n++){
  const base=`_review/french/WiseSpeak/WiseSpeak-unit${n}`;
  const s=json(base+'-source.json'),f=json(base+'-fr.json');
  const blocks=Array.isArray(f.blocks)?Object.fromEntries(f.blocks.map(b=>[b.id,b.fr])):f.blocks;
  for(const b of s.blocks)source.push([norm(b.en),blocks[b.id],b.id]);
  if(n){
   f.sa.forEach((q,i)=>{const kw=originals[n].essays[i].kw_en||[];q.keywords=kw.map(k=>vocabulary[k]||k);q.labels=kw.map(k=>{if(!labels[k])throw Error('WiseSpeak keyword without a French label: '+k);return labels[k];});});
   units[n]=f;
  }
 }
 insertFrenchBlocks(root,source,'WiseSpeak');
 insertFrenchBlocks(root,Object.entries(ui.extraBlocks).map(([en,fr],i)=>[norm(en),fr,'ws-extra-'+i]),'WiseSpeak extra');
 insertChrome(root,'WiseSpeak');
 // Registration bar: placeholders and track names (values and saved data unchanged).
 for(const [id,text] of Object.entries(ui.registration.placeholders)){const el=root.querySelector('#'+id);if(!el)throw Error('WiseSpeak registration field '+id);el.setAttribute('placeholder',text);el.setAttribute('aria-label',text);}
 const track=root.querySelector('#programTrack');track.setAttribute('aria-label','Parcours');
 for(const option of track.querySelectorAll('option')){const fr=ui.registration.tracks[option.getAttribute('value')];if(!fr)throw Error('WiseSpeak track '+option.getAttribute('value'));option.set_content(fr);}
 // Outline figure: French first, English second (the Spanish lines become English).
 const figure=root.querySelector('figure.cts-figure');
 for(const node of figure.querySelectorAll('text, figcaption span')){const t=node.text;if(!t.trim()||/^(WiseSpeak|I|II|III)$/.test(t))continue;const fr=ui.figure[t];if(fr==null)throw Error('WiseSpeak figure text without French: '+t);node.set_content(fr.replaceAll('&','&amp;').replaceAll('<','&lt;'));}
 figure.querySelector('svg').setAttribute('aria-label','La méthode WiseSpeak');
 const script=root.querySelectorAll('script').find(s=>s.innerHTML.includes('const UNITS = {}'));
 let code=script.innerHTML;
 const patch=`\nconst FRENCH_WISESPEAK=${JSON.stringify(units)};\nfor(const [n,f] of Object.entries(FRENCH_WISESPEAK)){\n UNITS[n].mcq.forEach((q,i)=>{q.textFr=f.mc[i].stem;q.explainFr=f.mc[i].why;q.options.forEach((o,j)=>o.fr=f.mc[i].options[j]);});\n UNITS[n].essays.forEach((q,i)=>{q.promptFr=f.sa[i].prompt;q.rubricFr=f.sa[i].model;q.kw_fr=f.sa[i].keywords;q.kwLabelFr=f.sa[i].labels;});\n const qs=window.CTS_FILL_DATA?.wisespeak?.[n];if(qs)qs.forEach((q,i)=>{q.prompt.fr=f.fill[i].prompt;q.answer.fr=f.fill[i].answer;q.accept??={};q.accept.fr=f.fill[i].accept||[];});\n}\nfor(const [k,fr] of Object.entries(${JSON.stringify(ui.registration.tracks)}))if(TRACK_NAMES[k])TRACK_NAMES[k].fr=fr;\nfunction wiseBi(en,es,fr){return window.CTSLanguage.bi({en,es,fr});}\nconst FRENCH_PRACTICE=${JSON.stringify(ui.practice)}.map(([re,fr])=>[new RegExp(re),fr]);\nfunction frPractice(html){const lines=String(html).split('<br>').map(line=>{const m=/^(• )?([\\s\\S]*)$/.exec(line);const rule=FRENCH_PRACTICE.find(([re])=>re.test(m[2]));return rule?(m[1]||'')+m[2].replace(rule[0],rule[1]):null;});return lines.includes(null)?'':lines.join('<br>');}\n`;
 code=replaceOnce(code,'// ============= STATE =============',patch+'\n// ============= STATE =============','WiseSpeak');
 const pairs=[['${i+1}. ${q.textEn}','${i+1}. ${q.textEs}','${wiseBi((i+1)+". "+q.textEn,(i+1)+". "+q.textEs,(i+1)+". "+q.textFr)}'],['${String.fromCharCode(65+j)}. ${opt.en}','${String.fromCharCode(65+j)}. ${opt.es}','${wiseBi(String.fromCharCode(65+j)+". "+opt.en,String.fromCharCode(65+j)+". "+opt.es,String.fromCharCode(65+j)+". "+opt.fr)}'],['Scenario ${i+1}: ${e.promptEn}','Escenario ${i+1}: ${e.promptEs}','${wiseBi("Scenario "+(i+1)+": "+e.promptEn,"Escenario "+(i+1)+": "+e.promptEs,"Scénario "+(i+1)+" : "+e.promptFr)}'],['${q.explainEn}','${q.explainEs}','${wiseBi(q.explainEn,q.explainEs,q.explainFr)}'],['${e.rubricEn}','${e.rubricEs}','${wiseBi(e.rubricEn,e.rubricEs,e.rubricFr)}']];
 for(const [en,es,out] of pairs)code=code.replaceAll(`<span class="lang-en">${en}</span><span class="lang-es">${es}</span>`,out);
 code=code.replaceAll("const kws = (isEs ? (q.kw_es||[]) : (q.kw_en||[]));", "const kws = q.kw_fr || (isEs ? (q.kw_es||[]) : (q.kw_en||[]));");
 code=replaceOnce(code,'if(!answer || !kw) return false;', 'if(Array.isArray(kw)) return kw.some(k=>kwHit(answer,k));\n  if(!answer || !kw) return false;','WiseSpeak');
 code=replaceOnce(code,'kws.forEach(k=>{ if(kwHit(text, k)) hits++; });', 'kws.forEach((k,i)=>{ if(kwHit(text,k) || kwHit(text,(q.kw_en||[])[i])) hits++; });','WiseSpeak');
 // Feedback names each missing concept as a readable French word, never a keyword stem.
 code=replaceOnce(code,'return kws.filter(k=> k && !kwHit(text, k));', 'return kws.map((k,i)=>({k,i})).filter(({k,i})=> k && !kwHit(text,k) && !kwHit(text,(q.kw_en||[])[i])).map(({k,i})=>({en:String((q.kw_en||[])[i]||k),fr:String((q.kwLabelFr||[])[i]||(q.kw_en||[])[i]||k)}));','WiseSpeak');
 if(code.split("const missEn = miss.join(', ');").length!==3)throw Error('WiseSpeak: expected two missing-concept lists');
 code=code.replaceAll("const missEn = miss.join(', ');","const missEn = miss.map(m=>m.en).join(', '), missFr = miss.map(m=>m.fr).join(', ');");
 // Interface text built at run time, then fixed English literals.
 code=frenchRuntimeSpans(code.replace("el.innerHTML = '<span class=\"lang-en\">'+htmlEn+'</span><span class=\"lang-es\">'+htmlEs+'</span>';","el.innerHTML = wiseBi(htmlEn, htmlEs, frPractice(htmlEn));"),ui.spans,'WiseSpeak','wiseBi');
 code=replaceLiterals(code,ui.literals,'WiseSpeak');
 // Practice checks (never counted): French answers and question words are recognised too.
 const w=ui.practiceWords;
 code=replaceOnce(code,"'cuando','cuándo','donde','dónde','como','cómo','cuanto','cuánto'];","'cuando','cuándo','donde','dónde','como','cómo','cuanto','cuánto',"+w.interrogatives.map(x=>JSON.stringify(x)).join(',')+"];",'WiseSpeak');
 code=replaceOnce(code,"const generic_es = ['cosas','asuntos','puntos'];","const generic_es = ['cosas','asuntos','puntos',"+w.generic.map(x=>JSON.stringify(x)).join(',')+"];",'WiseSpeak');
 code=replaceOnce(code,"const endsInPlural = lower.endsWith('s') || lower.endsWith('es');","const endsInPlural = lower.endsWith('s') || lower.endsWith('es') || lower.endsWith('x');",'WiseSpeak');
 code=replaceOnce(code,"const beliefWords_es = ['entender','saber','creer','sentir','darse cuenta','apreciar'];","const beliefWords_es = ['entender','saber','creer','sentir','darse cuenta','apreciar',"+w.belief.map(x=>JSON.stringify(x)).join(',')+"];",'WiseSpeak');
 code=replaceOnce(code,"const hasPeopleWill = lower.includes('people will') || lower.includes('la gente') || lower.includes('los oyentes');","const hasPeopleWill = lower.includes('people will') || lower.includes('la gente') || lower.includes('los oyentes') || "+JSON.stringify(w.people)+".some(p=>lower.includes(p));",'WiseSpeak');
 code=replaceOnce(code,"const passiveHits = pts.filter(p => p && (passive_en.test(p) || passive_es.test(p)));","const passive_fr = /(^|[^\\p{L}])(est|sont|fut|furent|été|était|étaient)\\s+\\p{L}+(é|ée|és|ées)(?![\\p{L}])/iu;\n  const passiveHits = pts.filter(p => p && (passive_en.test(p) || passive_es.test(p) || passive_fr.test(p)));",'WiseSpeak');
 code=replaceOnce(code,'function checkP1Match(){',`for(const [id,words] of Object.entries(${JSON.stringify(w.match)}))U1_ANSWERS[id].push(...words);\nfunction checkP1Match(){`,'WiseSpeak');
 code=replaceOnce(code,'function normFill(v){',`${JSON.stringify(ui.u7)}.forEach((f,i)=>{U7_FILL[i].fr=f.fr;U7_FILL[i].accept.push(...f.accept);});\nfunction normFill(v){`,'WiseSpeak');
 code=replaceOnce(code,"document.getElementById('certTrack').textContent = t.en;","document.getElementById('certTrack').textContent = t.fr || t.en;",'WiseSpeak');
 script.set_content(code);return source.length;
}
