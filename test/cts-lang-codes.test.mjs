// Every site language must be switchable: cts-lang.js keeps its own list,
// and a language missing from it makes its toggle button do nothing
// (Portuguese and Tamil, 27 Nov 2026).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SITE_LANGUAGES } from '../src/lib/languages.mjs';

test('cts-lang.js knows every site language', () => {
  const src = readFileSync(new URL('../public/cts-lang.js', import.meta.url), 'utf8');
  const m = src.match(/var codes = \[([^\]]*)\]/);
  assert.ok(m, 'codes list found');
  const codes = JSON.parse('[' + m[1] + ']');
  for (const l of SITE_LANGUAGES) assert.ok(codes.includes(l), `cts-lang.js is missing ${l}`);
});
