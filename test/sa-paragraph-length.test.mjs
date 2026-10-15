// Student-facing paragraph guidance: minimum is enforced only for attempted
// master's short answers. No real student records or submitted text appear here.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const store = new Map([['cts_track', 'thm']]);
const context = {
  window: { CTS_UNIT: { course: 'fixture', unit: 1, totalUnits: 1, mc: [], sa: [], fill: [] } },
  document: { readyState: 'loading', addEventListener() {} },
  localStorage: {
    getItem(key) { return store.get(key) ?? null; },
    setItem(key, val) { store.set(key, String(val)); },
    removeItem(key) { store.delete(key); },
  },
  console,
};
vm.runInNewContext(readFileSync(new URL('../public/assets/js/cts-engine.js', import.meta.url), 'utf8'), context);
const { shortAnswerWordCount: count, firstTooShortShortAnswerIndex: firstShort } = context.window.CTS_ENGINE;
const words = n => Array(n).fill('palabra').join(' ');

assert.equal(count('¡Jesús enseña en español, français et English!'), 7);
assert.equal(count(words(14)), 14);
assert.equal(count(words(15)), 15);
assert.equal(firstShort(['', words(14), words(15)]), 1);
assert.equal(firstShort(['', words(15)]), -1);
assert.equal(firstShort(['', '']), -1); // Existing 90% rule, not a new 100% requirement
store.set('cts_track', 'cert');
assert.equal(firstShort([words(14)]), -1); // Optional work stays optional
store.set('cts_track', 'assoc');
assert.equal(firstShort([words(14)]), -1);
store.set('cts_track', 'mdiv');
assert.equal(firstShort([words(14)]), 0);
console.log('PASS — short-answer paragraph length and track exceptions.');
