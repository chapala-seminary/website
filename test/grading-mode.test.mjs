// ChatGPT's final audit, item C: once live grading is on, nothing can switch a
// request back to the old browser-reported credit. The test-only header is
// honoured only by a Worker holding AI_FAKE (test/wrangler.local.jsonc; never
// deployed -- tools/verify-worker-config.mjs).
import assert from 'node:assert/strict';
import { gradingMode, isLive } from '../worker/grading/mode.js';
const req = (h) => new Request('https://example.test/api/sync', { headers: h ? { 'x-test-grading-mode': h } : {} });
assert.equal(gradingMode({ GRADING_MODE: 'live' }, req('shadow')), 'live', 'a deployed live Worker ignores the test header');
assert.equal(gradingMode({ GRADING_MODE: 'live', AI_FAKE: '' }, req('shadow')), 'live', 'an empty AI_FAKE does not enable it');
assert.equal(gradingMode({ GRADING_MODE: 'live', AI_FAKE: '1' }, req('shadow')), 'shadow', 'only the test Worker honours it');
assert.equal(gradingMode({ GRADING_MODE: 'shadow' }, req('live')), 'shadow', 'and a shadow Worker cannot be made live by a header');
assert.equal(gradingMode({}, req()), 'shadow', 'unset is the old behaviour');
assert.equal(isLive({ GRADING_MODE: 'LIVE' }, req()), false, 'only the exact value "live" turns it on');
console.log('PASS — live grading cannot be switched off by a request outside the test Worker.');
