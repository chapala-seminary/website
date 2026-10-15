import assert from 'node:assert/strict';
const base=process.env.API_BASE||'http://127.0.0.1:8908';
async function request(path,method='GET',body){const r=await fetch(base+path,{method,headers:{'content-type':'application/json','x-test-grading-mode':'shadow'},body:body?JSON.stringify(body):undefined});assert.ok(r.ok,`${path}: ${r.status}`);return r.json();}
const record=await request('/api/register','POST',{name:'Language Preference Test',email:'language-test@example.test',track:'cert',lang:'fr'});const code=record.code;let code2=null;
try{
 let s=await request('/api/student/'+code);assert.equal(s.student.lang,'fr');
 await request('/api/sync','POST',{code,student:{},lang:'es'});s=await request('/api/student/'+code);assert.equal(s.student.lang,'es');
 await request('/api/sync','POST',{code,student:{},lang:'invalid'});s=await request('/api/student/'+code);assert.equal(s.student.lang,'es');
 const email=await request('/api/email/start','POST',{code,email:'language-test@example.test',lang:'fr'});assert.equal(email.sent,true);assert.ok(email.devCode,'local fixture must not send a real email');s=await request('/api/student/'+code);assert.equal(s.student.lang,'fr');
 // The French link opens the French page, and names the choice so a device that remembers English does not redirect it.
 assert.match(email.devLink,/\/fr\/cts-confirm-email\.html\?cts_lang=fr#token=[0-9a-f]{64}$/);
 code2=(await request('/api/register','POST',{name:'Language Preference Test EN',email:'language-test-en@example.test',track:'cert',lang:'en'})).code;
 const english=await request('/api/email/start','POST',{code:code2,email:'language-test-en@example.test'});
 assert.match(english.devLink,/\/cts-confirm-email\.html#token=/);assert.ok(!english.devLink.includes('cts_lang'));
 // The French verification page: French only, and its form stays French.
 const lookup=await fetch(base+'/fr/verify');const lookupHtml=await lookup.text();assert.equal(lookup.status,200);
 assert.match(lookupHtml,/<html lang="fr">/);assert.match(lookupHtml,/Saisissez le code de vérification/);assert.match(lookupHtml,/action="\/fr\/verify"/);
 for(const term of ['Verify','Verificar','Enter the','Escriba'])assert.ok(!lookupHtml.includes(term),'French verify page shows '+term);
 const go=await fetch(base+'/fr/verify?code=ZZZZZZZZZZ',{redirect:'manual'});assert.equal(go.status,303);assert.equal(go.headers.get('location'),'/fr/verify/ZZZZZZZZZZ');
 const miss=await fetch(base+'/fr/verify/ZZZZZZZZZZ');const missHtml=await miss.text();assert.equal(miss.status,404);assert.match(missHtml,/Aucun certificat/);assert.ok(!missHtml.includes('No certificate'));
 const bilingual=await (await fetch(base+'/verify')).text();assert.match(bilingual,/Enter the certificate verification code/);assert.match(bilingual,/Escriba el código/);
 console.log('PASS — register, sync and verification persist French/Spanish; invalid preferences preserve the saved language; French confirmation links and /fr/verify are French.');
}finally{await request('/api/student/'+code,'DELETE');if(code2)await request('/api/student/'+code2,'DELETE');}
