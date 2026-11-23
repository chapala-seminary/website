/* Re-assessment at a higher level (#351): public/assets/js/cts-level-gate.js.
 *
 *   node --test test/level-gate.test.mjs
 *
 * A unit passed on the Certificate track must open again for a student now on
 * the Associate goal or a master's track, so the server can record the
 * higher-level attempts it needs; a pass at the student's level, or one whose
 * level cannot be known, stays final. All codes here are course codes; no
 * student data.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// loaded as the browser loads it: a classic script that sets window.CTSLevelGate
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL('../public/assets/js/cts-level-gate.js', import.meta.url), 'utf8'), sandbox);
const LG = sandbox.window.CTSLevelGate;
const lists = (o = {}) => ({ done: [], assoc: [], thm: [], mdiv: [], ...o });

test('Certificate completion, now on the M.Div.: the unit opens again (the #351 case)', () => {
  assert.equal(LG.covers({ code: 'CTSST', track: 'mdiv', lists: lists({ done: ['CTSST'] }) }), false);
  assert.equal(LG.covers({ code: 'WISESPEAK', track: 'thm', lists: lists({ done: ['WISESPEAK'] }) }), false);
});

test('Certificate completion, now on the Associate goal: opens again', () => {
  assert.equal(LG.covers({ code: 'CTSST', track: 'cert', goal: 'assoc', lists: lists({ done: ['CTSST'] }) }), false);
});

test('Certificate completion, still on the Certificate track: stays passed', () => {
  assert.equal(LG.covers({ code: 'CTSST', track: 'cert', lists: lists({ done: ['CTSST'] }) }), true);
});

test('Course already recorded at master\'s level: stays passed on either master\'s track', () => {
  const l = lists({ done: ['CTSST'], thm: ['CTSST'] });
  assert.equal(LG.covers({ code: 'CTSST', track: 'mdiv', lists: l }), true);
  assert.equal(LG.covers({ code: 'CTSST', track: 'thm', lists: l }), true);
  // an old certificate page's name carries the level itself
  assert.equal(LG.covers({ code: 'CTSST', track: 'mdiv', lists: lists({ done: ['CTSSTTHMCERTIFICATE'] }) }), true);
});

test('A stored level wins over the course lists', () => {
  assert.equal(LG.covers({ stored: 'thm', code: 'CTSST', track: 'mdiv', lists: lists({ done: ['CTSST'] }) }), true);
  assert.equal(LG.covers({ stored: 'cert', code: 'CTSST', track: 'mdiv', lists: lists({ thm: ['CTSST'] }) }), false);
  assert.equal(LG.covers({ stored: 'assoc', code: 'CTSST', track: 'cert', goal: 'assoc', lists: lists() }), true);
});

test('Level unknown (course not complete, nothing stored): the pass is honoured as before', () => {
  assert.equal(LG.covers({ code: 'CTSST', track: 'mdiv', lists: lists() }), true);
  assert.equal(LG.covers({}), true);
});

test('Codes are matched exactly, not by prefix', () => {
  // CTSSTORY-like codes must not count as CTSST
  assert.equal(LG.courseLevel('CTSST', lists({ thm: ['CTSSTORYTEL'] })), null);
  assert.equal(LG.courseLevel('CTSST', lists({ done: ['ctsst.html'] })), 'cert');
});

test('Track spellings the site has used map to the right level', () => {
  for (const t of ['mdiv', 'thm', 'mth', 'mtheol', 'Master of Divinity (M.Div.)']) assert.equal(LG.currentLevel(t), 'thm', t);
  for (const t of ['ad', 'associate', 'assoc']) assert.equal(LG.currentLevel(t), 'assoc', t);
  assert.equal(LG.currentLevel('cert'), 'cert');
  assert.equal(LG.currentLevel(undefined), 'cert');
});
