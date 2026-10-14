import assert from 'node:assert/strict';
import {verificationEmail,codeEmail,certificateEmail,emailLanguage,languageLink} from '../worker/email.js';
import fs from 'node:fs';
const catalog=JSON.parse(fs.readFileSync('worker/catalog.json','utf8'));
// outreach.js and award-names.js import catalog.json, which plain Node will not
// load without an import attribute; evaluate the pure parts with it supplied.
const pure=(file,from,to,names)=>{const src=fs.readFileSync(file,'utf8');const a=src.indexOf(from),b=to?src.indexOf(to,a):src.length;assert.ok(a>=0&&b>a,`${file}: ${from}`);return new Function('catalog',src.slice(a,b).replaceAll('export function','function').replaceAll('export const','const')+`return {${names}};`)(catalog);};
const {awardTitle,PROGRAM_NAMES}=pure('worker/award-names.js','export const PROGRAM_NAMES',null,'awardTitle,PROGRAM_NAMES');
const outreach=fs.readFileSync('worker/outreach.js','utf8');
const noteStart=outreach.indexOf('export function whereTheyWere');
const noteEnd=outreach.indexOf('/* Who would be written to today');
const {note,whereTheyWere}=new Function('catalog',outreach.slice(noteStart,noteEnd).replaceAll('export function','function')+'return {note,whereTheyWere};')(catalog);
const site='https://beta.chapalaseminary.org';
let checks=0;
// Every course a note can name has a title in each language.
for(const [slug,c] of Object.entries(catalog.courses)){for(const l of ['en','es','fr'])assert.ok(c.title?.[l],`${slug}: no ${l} title`);checks++;}
const enTitles=Object.values(catalog.courses).map(c=>c.title.en).filter(t=>!Object.values(catalog.courses).some(o=>o.title.fr===t));
for(const lang of ['en','es','fr']){
 const messages=[verificationEmail('123456',`${site}/${lang==='en'?'':lang+'/'}cts-confirm-email.html#test`,lang),codeEmail({students:[{name:'Test',id:'TEST-CODE'}],origin:site,lang}),certificateEmail({name:'Test',award:'Test course',code:'TEST',page:'CTSNTCertificate.html',origin:site,lang})];
 const foreign={en:['Su código','Votre code','Estimado/a','Bonjour','cts_lang'],es:['Your Chapala','Votre code','Dear Test','Bonjour'],fr:['Your Chapala','Su código','Dear Test','Estimado/a','appareil de travail','vérifier à','e-mail']}[lang];
 for(const m of messages){assert.ok(m.subject&&m.text);assert.ok(!m.text.includes('----'));for(const term of foreign)assert.ok(!m.text.includes(term),`${lang}: mixed email ${term}`);checks++;}
 const prefix=lang==='en'?'':lang+'/';const query=lang==='en'?'':'?cts_lang='+lang;
 assert.ok(messages[1].text.includes('/'+prefix+'cts-backup.html'+query));assert.ok(messages[2].text.includes('/'+prefix+'CTSNTCertificate.html'+query));
 assert.ok(messages[2].text.includes(lang==='fr'?site+'/fr/verify/TEST':site+'/verify/TEST'));checks+=3;
 // A French sentence names the course in French: a real unit key, not a made-up one.
 for(const kind of ['quiet','not_started']){
  const m=note(kind,{name:'Test',lang,last_unit:'nt 3'},{site,stopUrl:site+'/stop-notes/TEST'});
  assert.ok(m.text.includes('/stop-notes/TEST'));assert.ok(!m.text.includes('----'));assert.ok(!m.text.includes('/'+lang+'/stop-notes'));checks+=3;
  if(kind==='quiet'){assert.ok(m.text.includes(`(${catalog.courses.nt.title[lang]}, `),`${lang}: course name`);assert.ok(m.text.includes(`/${prefix}CTSNTUnit4.html${query}`),`${lang}: next unit link`);checks+=2;}
  else{assert.ok(m.text.includes(`/${prefix}CTSUnit1.html${query}`));checks++;}
  if(lang==='fr'){
   for(const t of enTitles)assert.ok(!m.text.includes(t),`fr ${kind}: English course name ${t}`);
   for(const term of ['Dear','Unit ','Survey','Wayne Cook at','prêt ','arrêté','inscrit ','empêché','bloqué'])assert.ok(!m.text.includes(term),`fr ${kind}: ${term}`);
   checks++;
  }
 }
}
// The French welcome note names Old Testament Survey as the catalog does.
assert.ok(note('not_started',{name:'T',lang:'fr'},{site,stopUrl:'x'}).text.includes(`le ${catalog.courses.ots.title.fr}`));checks++;
// A quiet student with no unit on record still gets a French catalog link.
assert.ok(note('quiet',{name:'T',lang:'fr',last_unit:null},{site,stopUrl:'x'}).text.includes(`${site}/fr/index.html?cts_lang=fr#catalog`));checks++;
assert.equal(whereTheyWere('ots 2','fr').course,catalog.courses.ots.title.fr);checks++;
// Award names: French from the level, course and program; others keep the record.
assert.equal(awardTitle({level:'course',course:'nt',title:'New Testament Survey — Certificate of Ministry'},'fr'),`${catalog.courses.nt.title.fr} — ${PROGRAM_NAMES.certificate.fr}`);
assert.equal(awardTitle({level:'course',course:'WISESPEAK',title:'Preaching — Master of Divinity'},'fr'),`${catalog.completions.WISESPEAK.title.fr} — ${PROGRAM_NAMES.mdiv.fr}`);
assert.equal(awardTitle({level:'thm',title:'Master of Theology'},'fr'),PROGRAM_NAMES.thm.fr);
assert.equal(awardTitle({level:'course',course:'nt',title:'New Testament Survey — Certificate of Ministry'},'es'),'New Testament Survey — Certificate of Ministry');
assert.equal(awardTitle({level:'course',course:'nope',title:'Kept'},'fr'),'Kept');checks+=5;
assert.equal(languageLink(site,'fr/x.html','fr'),site+'/fr/x.html?cts_lang=fr');assert.equal(languageLink(site,'x.html','de'),site+'/x.html');checks+=2;
assert.equal(emailLanguage('de'),'en');assert.equal(emailLanguage(null),'en');assert.equal(verificationEmail('123456').subject,'Verification code 123456');checks+=3;
console.log(`PASS — ${checks} single-language email, course-name and localized-link checks.`);
