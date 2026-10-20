import assert from 'node:assert/strict';
import { blocksReviewAsset } from '../worker/review-assets.js';

const request = (path, headers) => new Request(`https://chapalaseminary.org${path}`, { headers });
for (const path of ['/assets/exam-review/cults.en.abcd.js', '/assets/exam%2Dreview/cults.en.abcd.js', '/assets//exam-review/cults.en.abcd.js']) {
  assert.equal(blocksReviewAsset(request(path), { GRADING_MODE: 'shadow' }), false, `${path}: shadow review JavaScript must load`);
  assert.equal(blocksReviewAsset(request(path), { GRADING_MODE: 'live' }), true, `${path}: live review assets remain private`);
  assert.equal(blocksReviewAsset(request(path, { 'x-test-grading-mode': 'shadow' }), { GRADING_MODE: 'live' }), true, 'a deployed live Worker ignores a downgrade header');
}
for (const mode of ['shadow', 'live']) {
  for (const path of ['/assets/exam-review/cults.en.json', '/assets/exam%2Dreview/cults.en.json', '/assets//exam-review/cults.en.json', '/ASSETS/EXAM-REVIEW/cults.en.json', '/assets/exam-review/'])
    assert.equal(blocksReviewAsset(request(path), { GRADING_MODE: mode }), true, `${mode} ${path}: private JSON/directory stays blocked`);
  assert.equal(blocksReviewAsset(request('/assets/js/cts-engine.js'), { GRADING_MODE: mode }), false, 'ordinary scripts are unaffected');
}
console.log('PASS — shadow review JavaScript loads; live review assets and JSON banks remain private.');
