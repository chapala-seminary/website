// Wayne, 18 Oct 2026: the eight reading tests awaiting faculty review are
// optional for now. The Worker's list must be exactly the staged manifest's,
// so approving a bank and removing it from one place cannot drift from the other.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { PENDING_FACULTY_REVIEW, activatedTests } from '../worker/test-activation.js';
const manifest = JSON.parse(fs.readFileSync('src/data/readings/staged/academic_manifest.json', 'utf8'));
assert.deepEqual([...PENDING_FACULTY_REVIEW].sort(), manifest.courses.map((c) => c.slug).sort(), 'the optional list matches the faculty-review manifest');
const cutoff = '2026-10-15T05:17:56.813Z';
const live = activatedTests({ MASTER_TESTS_ACTIVATION: cutoff });
assert.equal(Object.keys(live).length, 71, '71 tests required from the production cutoff');
assert.ok([...PENDING_FACULTY_REVIEW].every((slug) => !(slug in live)), 'none of the eight is required');
assert.ok(Object.values(live).every((d) => d === cutoff), 'every other test keeps the production cutoff unchanged');
assert.deepEqual(activatedTests({}), {}, 'nothing is required without an activation date');
console.log('PASS — the eight tests awaiting faculty review are optional; 71 keep the 2026-10-15T05:17:56.813Z cutoff.');
