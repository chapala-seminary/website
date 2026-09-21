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
fs.cpSync('tools/translate-lesson.mjs', path.join(root, 'tools/translate-lesson.mjs'));
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
  ok(/1 block\(s\) translated/.test(out), 'only the stale block is translated');
  ok(/a human translation is stale and will be replaced/.test(out),
     'replacing a person\'s work is announced, not done quietly');
  const after = load();
  ok(after.blocks[0].text.es === 'El primer párrafo.', 'the untouched block keeps its human translation');
  ok(after.blocks[1].tr.es.status === 'machine', 'the stale block is now machine');
  ok(after.blocks[1].tr.es.from === hash('The second paragraph, rewritten.'),
     'and is stamped with the source it was actually made from');
  ok(!isStale(after.blocks[1], 'es', 'en'), 'so it is no longer stale');
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
