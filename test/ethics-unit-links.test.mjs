import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Regression for #279 / 6 Nov language-page builder fix: source JavaScript
// builds numbered course links with a template literal. Those literal URLs
// must NOT pass through HTML href normalization (which encoded the dollar-brace
// into "$%7B" and sent students to a 404 page). No accounts or exams required.
test('Ethics Unit 1 progression remains intact in generated language pages', () => {
  const original = fs.readFileSync('public/ethics_unit01.html', 'utf8');
  assert.match(original, /const NEXT_UNIT_URL = 'ethics_unit02\.html';/);
  assert.match(original, /nextUnitBtn'\)\.onclick = \(\) => \{ location\.href = NEXT_UNIT_URL; \}/);
  assert.match(original, /href="ethics_unit\$\{String\(i\)\.padStart\(2,'0'\)\}\.html"/);

  for (const lang of ['en', 'es', 'fr', 'sw']) {
    const file = path.join('dist', lang === 'en' ? '' : lang, 'ethics_unit01.html');
    assert.ok(fs.existsSync(file), lang + ': built Ethics Unit 1 exists');
    const page = fs.readFileSync(file, 'utf8');
    assert.match(page, /ethics_unit\$\{String\(i\)\.padStart\(2,'0'\)\}\.html/,
      lang + ': numbered unit destinations still evaluate dynamically');
    assert.doesNotMatch(page, /ethics_unit\$%7B/i,
      lang + ': template-literal href must not be URL-encoded');
    assert.match(page, /const NEXT_UNIT_URL = 'ethics_unit02\.html';/,
      lang + ': direct Next button remains Unit 2');
  }
});
