/* The translation rules, tested by breaking them.
 *
 * A tool that says it will not overwrite a person's work is worth exactly as
 * much as the test that tries to make it. Each case below sets up a lesson in
 * a state the rules have something to say about, runs the real tool over a
 * copy, and checks what came out.
 *
 *   node test/lesson-translation.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { hash, isStale } from '../src/lib/lesson.ts';

const SRC = 'src/content/lessons/CTSHermeneutics';
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-tr-'));
const dir = path.join(root, 'src/content/lessons/CTSTest');
fs.mkdirSync(dir, { recursive: true });
fs.cpSync('src/lib', path.join(root, 'src/lib'), { recursive: true });
fs.mkdirSync(path.join(root, 'tools'), { recursive: true });
for (const tool of ['translate-lesson.mjs', 'translation-plan.mjs']) fs.cpSync('tools/' + tool, path.join(root, 'tools', tool));
const unitDir = path.join(root, 'src/content/units/CTSTest');
fs.mkdirSync(unitDir, { recursive: true });
const exam = () => ({unit:1, mc:[{stem:{en:'Who?',es:'¿Quién?'}, options:{en:['Adam','Noah'],es:['Adán','Noé']}, answer:0,why:{en:'First man',es:'Primer hombre'}}], fill:[{prompt:{en:'The first man was ____.',es:'El primer hombre fue ____.'},answer:{en:'Adam',es:'Adán'},accept:{en:['the man'],es:['el hombre']}}], sa:[{prompt:{en:'Explain.',es:'Explique.'},keywords:{en:[['creation','created'],'God'],es:[['creación','creado'],'Dios']},model:{en:'God created.',es:'Dios creó.'}}]});
const saveExam = (u=exam()) => fs.writeFileSync(path.join(unitDir,'1.json'),JSON.stringify(u));
saveExam();
fs.cpSync('node_modules', path.join(root, 'node_modules'), { recursive: true, dereference: false });

let failed = 0;
const ok = (cond, what) => {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'}  ${what}`);
  if (!cond) failed++;
};

const load = () => JSON.parse(fs.readFileSync(path.join(dir, '1.json'), 'utf8'));
const save = (l) => fs.writeFileSync(path.join(dir, '1.json'), JSON.stringify(l, null, 1));
const run = (...a) => execFileSync('node', [path.join(root, 'tools/translate-lesson.mjs'), 'CTSTest', ...a],
  { cwd: root, encoding: 'utf8' });

/* A small lesson, written out by hand so the test does not depend on the
   contents of a real course. */
const base = () => ({
  course: 'CTSTest', unit: 1, sourceLang: 'en', langs: ['en', 'es'],
  blocks: [
    { id: 'b01', type: 'prose', text: { en: 'The first paragraph.', es: 'El primer párrafo.' },
      tr: { es: { status: 'human', from: hash('The first paragraph.') } } },
    { id: 'b02', type: 'prose', text: { en: 'The second paragraph.', es: 'El segundo párrafo.' },
      tr: { es: { status: 'human', from: hash('The second paragraph.') } } },
    { id: 'b03', type: 'prose', text: { en: 'The third paragraph.', es: 'Una traducción automática que alguien arregló.' },
      tr: { es: { status: 'machine-edited', from: hash('The third paragraph.') } } },
  ],
});

console.log('a current translation is left alone, whoever made it');
save(base());
run('--lang', 'es');
{
  const l = load();
  ok(l.blocks[0].text.es === 'El primer párrafo.', 'the human translation is untouched');
  ok(l.blocks[2].text.es === 'Una traducción automática que alguien arregló.', 'the corrected machine translation is untouched');
  ok(l.blocks.every((b) => b.tr.es.status !== 'machine'), 'nothing was re-marked as machine');
}

console.log('a missing translation is filled in and marked machine');
{
  const l = base();
  save(l);
  run('--lang', 'fr');
  const after = load();
  ok(after.blocks.every((b) => b.text.fr != null), 'every block now has French');
  ok(after.blocks.every((b) => b.tr.fr.status === 'machine'), 'all of it is marked machine');
  ok(after.blocks.every((b) => b.tr.fr.from === hash(b.text.en)), 'each stamp is the hash of its own source');
  ok(after.blocks.every((b) => b.tr.es.status === 'human' || b.tr.es.status === 'machine-edited'),
     'adding a language did not disturb the existing one');
  ok(after.langs.includes('fr'), 'the lesson now lists French');
}

console.log('editing the source makes exactly that block stale');
{
  const l = base();
  l.blocks[1].text.en = 'The second paragraph, rewritten.';
  save(l);
  const stale = l.blocks.map((b) => isStale(b, 'es', 'en'));
  ok(JSON.stringify(stale) === '[false,true,false]', 'one block is stale, the other two are not');

  const out = run('--lang', 'es');
  ok(/human needs review; preserved/.test(out), 'stale human translation is reported for review');
  const after = load();
  ok(after.blocks[1].text.es === l.blocks[1].text.es, 'stale human wording is preserved');
  ok(after.blocks[1].tr.es.status === 'human', 'reviewed status is preserved');
  ok(isStale(after.blocks[1], 'es', 'en'), 'staleness remains visible until human review');
}

console.log('lesson and all exam fields travel together without losing answer structure');
{
  save(base()); saveExam(); run('--lang','fr');
  const u=JSON.parse(fs.readFileSync(path.join(unitDir,'1.json')));
  ok(u.mc[0].answer===0 && u.mc[0].options.fr.length===2, 'MC answer index and option order survive');
  ok(u.fill[0].prompt.fr.includes('____') && u.fill[0].accept.fr.length===1, 'fill prompt, answer and alternates translated together');
  ok(Array.isArray(u.sa[0].keywords.fr[0]) && u.sa[0].model.fr, 'keyword synonym groups and models survive');
  for (const section of ['mc','fill','sa']) ok(u[section][0].tr.fr.status==='machine', section+' provenance recorded');
  u.mc[0].tr.fr.status='human';u.mc[0].answer=1;saveExam(u);
  ok(/mc 1: human needs review; preserved/.test(run('--lang','fr')),'shared MC key changes flag the reviewed translation for review');
  const before=fs.readFileSync(path.join(unitDir,'1.json'),'utf8');run('--lang','fr');
  ok(fs.readFileSync(path.join(unitDir,'1.json'),'utf8')===before,'second pass is idempotent');
  u.fill[0].tr.fr.status='machine-edited';u.fill[0].prompt.en='A changed ____ prompt.';saveExam(u);
  const protectedBefore=JSON.stringify(u.fill[0]);run('--lang','fr');
  ok(JSON.stringify(JSON.parse(fs.readFileSync(path.join(unitDir,'1.json'))).fill[0])===protectedBefore,'stale edited question and its keys stay intact');
  const l=base();l.blocks[2].text.en='Changed source';save(l);run('--lang','es');
  ok(load().blocks[2].text.es===l.blocks[2].text.es,'stale machine-edited lesson stays intact');
  saveExam();
}

console.log('stale machine work refreshes and unmarked work stays safe');
{
  save(base());saveExam();run('--lang','fr');
  const l=load();l.blocks[0].text.en='An updated paragraph.';l.blocks[1].text.fr='Unmarked correction';delete l.blocks[1].tr.fr;save(l);
  run('--lang','fr');
  ok(load().blocks[0].text.fr==='[en->fr] An updated paragraph.','stale machine block refreshes');
  ok(load().blocks[1].text.fr==='Unmarked correction','unmarked existing text is preserved');
  const before=fs.readFileSync(path.join(dir,'1.json'),'utf8');
  const second=base();second.unit=2;fs.writeFileSync(path.join(dir,'2.json'),JSON.stringify(second));
  let rejected=false;try {run('--lang','de');} catch {rejected=true;}
  ok(rejected,'missing exam file rejects the selected batch');
  ok(fs.readFileSync(path.join(dir,'1.json'),'utf8')===before,'earlier unit is not partially written after a later failure');
  fs.unlinkSync(path.join(dir,'2.json'));saveExam();
}

console.log('a dry run writes nothing');
{
  save(base());
  const before = fs.readFileSync(path.join(dir, '1.json'), 'utf8');
  run('--lang', 'fr', '--dry-run');
  ok(fs.readFileSync(path.join(dir, '1.json'), 'utf8') === before, 'the file is byte for byte what it was');
}

console.log('a real course round-trips through the same tool');
{
  fs.cpSync(path.join(SRC, '1.json'), path.join(dir, '1.json'));
  const l = load(); l.course = 'CTSTest'; save(l);
  const n = l.blocks.length;
  run('--lang', 'fr');
  const after = load();
  const words = (b) => (b.type === 'figure' ? b.caption : b);
  ok(after.blocks.length === n, 'no block was added or lost');
  ok(after.blocks.every((b) => words(b).text.fr != null), `all ${n} blocks have French`);
  ok(after.blocks.every((b) => words(b).text.es === words(l.blocks.find((x) => x.id === b.id)).text.es),
     'not one word of the Spanish changed');
}

fs.rmSync(root, { recursive: true, force: true });
console.log(failed ? `\nFAIL — ${failed} assertion(s)` : '\nPASS — the translation rules hold.');
process.exitCode = failed ? 1 : 0;
