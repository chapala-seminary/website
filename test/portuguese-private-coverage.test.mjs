import assert from 'node:assert/strict';
import {test} from 'node:test';
import {privateFieldCounts} from '../tools/portuguese-private-coverage.mjs';
test('private audit reports counts only, including absent nested rubric translations', () => {
  const result = privateFieldCounts({sa: [{model: {en: 'SECRET MODEL', pt: 'PRIVATE TRANSLATION'}, rubric: [{text: {en: 'SECRET RUBRIC'}}]}], mc: [{answer: 2, why: {en: 'SECRET EXPLANATION', pt: ' '}}]});
  assert.deepEqual(result.model, {total: 1, portuguesePresent: 1, portugueseMissing: 0});
  assert.deepEqual(result.rubric, {total: 1, portuguesePresent: 0, portugueseMissing: 1});
  assert.deepEqual(result.why, {total: 1, portuguesePresent: 0, portugueseMissing: 1});
  assert.doesNotMatch(JSON.stringify(result), /SECRET|PRIVATE|TRANSLATION/);
});
