import assert from 'node:assert/strict';
const base=process.env.API_BASE||'http://127.0.0.1:8908';
async function request(path,method='GET',body){const r=await fetch(base+path,{method,headers:{'content-type':'application/json'},body:body?JSON.stringify(body):undefined});assert.ok(r.ok,`${path}: ${r.status}`);return r.json();}
const record=await request('/api/register','POST',{name:'Language Preference Test',email:'language-test@example.test',track:'cert',lang:'fr'});const code=record.code;
try{
 let s=await request('/api/student/'+code);assert.equal(s.student.lang,'fr');
 await request('/api/sync','POST',{code,student:{},lang:'es'});s=await request('/api/student/'+code);assert.equal(s.student.lang,'es');
 await request('/api/sync','POST',{code,student:{},lang:'invalid'});s=await request('/api/student/'+code);assert.equal(s.student.lang,'es');
 const email=await request('/api/email/start','POST',{code,email:'language-test@example.test',lang:'fr'});assert.equal(email.sent,true);assert.ok(email.devCode,'local fixture must not send a real email');s=await request('/api/student/'+code);assert.equal(s.student.lang,'fr');
 console.log('PASS — register, sync and verification persist French/Spanish; invalid preferences preserve the saved language.');
}finally{await request('/api/student/'+code,'DELETE');}
