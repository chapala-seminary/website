import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
// Complete French words of four letters or fewer allowed as whole-word keywords.
const WORDS=new Set(['but','idée','lien','coût','coup','mort','huit','égal','exil','yeux','fait','vite','peur','feu','œil','dieu','grec','sain','juif','loi','laïc','luc','sens','plan','gens','ton','lieu','même','lent','âme','voix','erre','mot','mots','cède','zèle']);
const base=process.argv[2]||'http://127.0.0.1:8910';
const browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
try{
 const ctx=await browser.newContext();await ctx.addInitScript(()=>{localStorage.setItem('cts_lang','fr');localStorage.setItem('cts_student',JSON.stringify({name:'French Test',email:'french-test@example.invalid',track:'mdiv'}));localStorage.setItem('cts_track','mdiv');localStorage.setItem('cts_done_codes',JSON.stringify(['CTSOTS','CTSNT','CTSST','CTSEVANGELISM','CTSPM','CTSCH','WISESPEAK']));});
 const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/fr/CTS_WiseSpeak_Preaching.html?cts_lang=fr',{waitUntil:'load'});
 await page.waitForSelector('#mcq_1 .question-card');
 const models=await page.evaluate(()=>Object.entries(UNITS).flatMap(([n,u])=>u.essays.map((q,i)=>({unit:n,index:i,fr:gradeEssay(q,q.rubricFr),empty:gradeEssay(q,''),source:gradeEssay(q,q.rubricEn),oldSource:q.rubricEn.length>=120&&q.kw_en.filter(k=>kwHit(q.rubricEn,k)).length>=3}))));
 assert.equal(models.length,100);assert.deepEqual(models.filter(r=>!r.fr||r.empty||(r.oldSource&&!r.source)),[]);
 const q=await page.evaluate(()=>({correct:UNITS[1].mcq[0].correct,stem:UNITS[1].mcq[0].textFr,fill:CTSFill.questions('wisespeak',1)[0].answer.fr,prompt:CTSFill.questions('wisespeak',1)[0].prompt.fr}));
 assert.ok((await page.locator('#mcq_1 .question-text').first().innerText()).includes(q.stem));
 assert.ok((await page.locator('#fill_1 .cts-fill-q p').first().innerText()).includes(q.prompt));
 await page.locator(`input[name="u1q0"][value="${q.correct}"]`).check();
 assert.ok(await page.locator('#fb_1_0').getAttribute('class').then(c=>c.includes('correct')));
 await page.locator('#fill_1 input[data-cts-fill="0"]').fill(q.fill);
 await page.locator('#fill_1 button[data-cts-fill-check="0"]').click();
 assert.ok(await page.locator('#fill_1 .cts-fill-ok').first().isVisible());
 await page.reload({waitUntil:'load'});
 assert.equal(await page.locator('#fill_1 input[data-cts-fill="0"]').inputValue(),q.fill);
 assert.equal(await page.locator(`input[name="u1q0"][value="${q.correct}"]`).isChecked(),true);
 // Runtime interface is French: progress, steps, essay check, submit result, certificate track.
 const fold=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'');
 const vocab=JSON.parse(fs.readFileSync('tools/data/french-wisespeak-keywords.json','utf8'));
 const dead=Object.entries(vocab).flatMap(([k,v])=>[].concat(v).filter(x=>fold(x).length<=4&&!WORDS.has(x)).map(x=>k+':'+x));
 assert.deepEqual(dead,[],'French keyword forms of 4 letters or fewer must be complete words');
 const labels=new Set(Object.values(JSON.parse(fs.readFileSync('tools/data/french-wisespeak-labels.json','utf8'))));
 await page.locator('#essay_1 textarea').first().fill('Je pense que cette personne devrait réfléchir encore longuement avant de répondre à la question posée par le diacre de son église locale.');
 await page.locator('#essay_1 .essay-check-btn').first().click();
 const rub=await page.locator('#rub_1_0 .cts-reading').first().innerText();
 assert.match(rub,/^✗ Incomplet — il manque des notions clés dans votre réponse : /);
 const missing=rub.split(' : ')[1].split('. ')[0].split(', ');
 assert.ok(missing.length&&missing.every(m=>labels.has(m)),'missing concepts are readable French labels: '+missing);
 await page.evaluate(()=>submitUnit(2));
 const visible=await page.evaluate(()=>[...document.querySelectorAll('.cts-reading')].filter(e=>e.offsetParent).map(e=>e.textContent).join('\n'));
 for(const fr of ['Pas encore réussi','Étape 1','unité(s) terminée(s) sur 10','Inscrit :','Master en théologie pastorale (M.Div.)','Sans réponse','Vérifier la réponse','Mises en situation à courte dissertation','Un délai de 15 minutes'])assert.ok(visible.includes(fr),'French interface text: '+fr);
 const english=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.offsetParent&&!e.children.length&&!e.closest('.cts-source,[data-cts-fallback]')).map(e=>e.textContent).join('\n'));
 for(const en of ['Not yet passed','Check Answer','Step 1','Not answered','Registered:','units completed','Write your response','Full Name','Nombre Completo','Certificate of Ministry','Master of Divinity','PASO 1','El Tema','Un método'])assert.ok(!english.includes(en),'English or Spanish interface text on /fr/: '+en);
 assert.equal(await page.locator('#studentName').getAttribute('placeholder'),'Nom complet');
 await page.evaluate(()=>showCert(1));
 assert.equal(await page.evaluate(()=>document.getElementById('certTrack').textContent),'Master en théologie pastorale (M.Div.)');
 // Practice feedback (never counted) is French; French question words are recognised.
 await page.evaluate(()=>{document.getElementById('p2_idea').value='prière';document.getElementById('p2_pq').value='Pourquoi la prière est-elle nécessaire ?';checkP2PQ();});
 assert.match(await page.locator('#p2_pq_fb .cts-reading').innerText(),/^C’est bien — l’interrogatif est présent/);
 assert.deepEqual(errors,[]);
 console.log('PASS — 100 WiseSpeak French models, source preservation, empty rejection, French MC/fill rendering and grading, saved attempts, French runtime interface and certificate track, readable missing concepts, no dead keyword stems.');
}finally{await browser.close();}
