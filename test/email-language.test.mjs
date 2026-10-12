import assert from 'node:assert/strict';
import {verificationEmail,codeEmail,certificateEmail,emailLanguage} from '../worker/email.js';
import fs from 'node:fs';
const outreach=fs.readFileSync('worker/outreach.js','utf8');
const start=outreach.indexOf('export function note(');
const helpers=outreach.slice(outreach.indexOf('export function whereTheyWere'),start);
const note=new Function('catalog', (helpers+outreach.slice(start,outreach.indexOf('\n}\n',start)+3)).replaceAll('export function','function')+'return note;')(JSON.parse(fs.readFileSync('worker/catalog.json','utf8')));
let checks=0;
for(const lang of ['en','es','fr']){
 const messages=[verificationEmail('123456','https://beta.chapalaseminary.org/cts-confirm-email.html#test',lang),codeEmail({students:[{name:'Test',id:'TEST-CODE'}],origin:'https://beta.chapalaseminary.org',lang}),certificateEmail({name:'Test',award:'Test course',code:'TEST',page:'CTSNTCertificate.html',origin:'https://beta.chapalaseminary.org',lang})];
 const foreign={en:['Su código','Votre code','Estimado/a','Bonjour'],es:['Your Chapala','Votre code','Dear Test','Bonjour'],fr:['Your Chapala','Su código','Dear Test','Estimado/a']}[lang];
 for(const m of messages){assert.ok(m.subject&&m.text);assert.ok(!m.text.includes('----'));for(const term of foreign)assert.ok(!m.text.includes(term),`${lang}: mixed email ${term}`);checks++;}
 const prefix=lang==='en'?'':lang+'/';assert.ok(messages[1].text.includes('/'+prefix+'cts-backup.html'));assert.ok(messages[2].text.includes('/'+prefix+'CTSNTCertificate.html'));assert.ok(messages[2].text.includes('/verify/TEST'));checks+=3;
 for(const kind of ['quiet','not_started']){const m=note(kind,{name:'Test',lang,last_unit:'CTSNT 1'},{site:'https://beta.chapalaseminary.org',stopUrl:'https://beta.chapalaseminary.org/api/stop/TEST'});assert.ok(m.text.includes('/api/stop/TEST'));assert.ok(!m.text.includes('----'));assert.ok(!m.text.includes('/'+lang+'/api/'));checks++;}
}
assert.equal(emailLanguage('de'),'en');assert.equal(emailLanguage(null),'en');assert.equal(verificationEmail('123456').subject,'Verification code 123456');checks+=3;
console.log(`PASS — ${checks} single-language email and localized-link checks.`);
