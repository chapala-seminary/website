// The exam pledge and the note for AI assistants (Dr. Cook, 31 Oct 2026):
// loaded on unit pages and on textbook/reading tests, worded in every
// interface language, and never naming AI in what students see.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const read = (p) => readFileSync(p, 'utf8');
const js = read('public/assets/js/cts-integrity.js');
assert.ok(read('src/layouts/Unit.astro').includes("/assets/js/cts-integrity.js"), 'Unit pages load cts-integrity.js');
assert.ok(read('src/layouts/Textbook.astro').includes("/assets/js/cts-integrity.js"), 'Textbook and reading tests load cts-integrity.js');
const sw = JSON.parse(read('src/data/interface/sw.json'));
const en = (name) => { const m = js.match(new RegExp('var ' + name + ' = \\{\\s*en: "((?:[^"\\\\]|\\\\.)*)"')); assert.ok(m, name); return JSON.parse('"' + m[1] + '"'); };
for (const name of ['PLEDGE', 'VERSE', 'NEEDED']) {
  const text = en(name);
  assert.ok(sw[text], `Swahili wording for ${name}`);
  const block = js.slice(js.indexOf('var ' + name), js.indexOf('};', js.indexOf('var ' + name)));
  for (const l of ['en:', 'es:', 'fr:']) assert.ok(block.includes(l), `${name} has ${l}`);
  for (const l of ['en:', 'es:', 'fr:']) assert.ok(!/\bAI\b|artificial|IA\b|inteligencia/i.test(block), `${name} does not mention AI to students`);
}
assert.ok(/class(Name)? *= *"cts-sr-note"|\.className = "cts-sr-note"/.test(js), 'AI note is visually hidden');
assert.ok(js.includes('aria-describedby') && js.includes('cts-assessment-policy'), 'AI note on submit buttons and in the page head');
console.log('PASS: exam pledge and AI note are wired into unit and test pages in EN/ES/FR/SW.');
// The final synthesis exam and the ministry paper (Dr. Cook, 2 Nov 2026): both pages are built on the
// Textbook layout (so they load cts-integrity.js) and mount into #tb-questions, which the pledge guards;
// the paper carries its own pledge wording, in English, Spanish and French, and never names AI to students.
for (const [route, kind] of [['src/pages/[final].astro', 'final'], ['src/pages/[paper].astro', 'paper']]) {
  const page = read(route);
  assert.ok(page.includes("import Textbook from '../layouts/Textbook.astro'") && page.includes(`<Textbook kind="${kind}"`), `${route} uses the Textbook layout`);
  assert.ok(page.includes('id="tb-questions"'), `${route} mounts into #tb-questions, where the pledge and AI note go`);
}
assert.ok(read('src/pages/[paper].astro').includes('data-pledge="paper"'), 'the paper page asks for the paper pledge');
assert.ok(!read('src/pages/[final].astro').includes('data-pledge='), 'the final takes the exam pledge');
assert.ok(js.includes('host.getAttribute("data-pledge") === "paper"'), 'cts-integrity.js reads the paper pledge from the host');
for (const name of ['PAPER_PLEDGE', 'PAPER_NEEDED']) {
  const block = js.slice(js.indexOf('var ' + name), js.indexOf('};', js.indexOf('var ' + name)));
  for (const l of ['en:', 'es:', 'fr:']) assert.ok(block.includes(l), `${name} has ${l}`);
  assert.ok(!/\bAI\b|artificial|IA\b|inteligencia/i.test(block), `${name} does not mention AI to students`);
}
assert.ok(/This paper is my own work/.test(js) && /Este trabajo es obra mía/.test(js), 'the paper pledge says the paper is the student\'s own work, in English and Spanish');
console.log('PASS: the final exam and the ministry paper carry the pledge (the paper its own) and the AI note.');

