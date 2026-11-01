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
