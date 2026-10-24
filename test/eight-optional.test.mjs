// Wayne, 18 Oct 2026: the eight reading tests awaiting faculty review are
// optional for now. The Worker's list must be exactly the staged manifest's,
// so approving a bank and removing it from one place cannot drift from the other.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { PENDING_FACULTY_REVIEW, ELECTIVE_TESTS_PENDING, activatedTests } from '../worker/test-activation.js';
import catalog from '../worker/catalog.json' with { type: 'json' };
const manifest = JSON.parse(fs.readFileSync('src/data/readings/staged/academic_manifest.json', 'utf8'));
assert.deepEqual([...PENDING_FACULTY_REVIEW].sort(), manifest.courses.map((c) => c.slug).sort(), 'the optional list matches the faculty-review manifest');
const cutoff = '2026-10-15T05:17:56.813Z';
const live = activatedTests({ MASTER_TESTS_ACTIVATION: cutoff });
assert.equal(Object.keys(live).length, 71, '71 tests required from the production cutoff');
assert.ok([...PENDING_FACULTY_REVIEW].every((slug) => !(slug in live)), 'none of the eight is required');
assert.ok(Object.values(live).every((d) => d === cutoff), 'every other test keeps the production cutoff unchanged');
assert.deepEqual(activatedTests({}), {}, 'nothing is required without an activation date');
// The elective tests (Oct 2026): optional when they arrive, whatever the cutoff.
assert.ok(Object.keys(catalog.textbooks).filter((slug) => ELECTIVE_TESTS_PENDING.has(slug)).every((slug) => !(slug in live)), 'no elective test in the catalog is required');
assert.ok(ELECTIVE_TESTS_PENDING.has('elecbaponereadings') && ELECTIVE_TESTS_PENDING.has('elecpc') && !ELECTIVE_TESTS_PENDING.has('evangelismreadings') && !ELECTIVE_TESTS_PENDING.has('selecreadings') && !ELECTIVE_TESTS_PENDING.has(undefined), 'the elective set is exactly the slugs that start with "elec"');
const withElectives = { ...catalog.textbooks,
  elecbaponereadings: { code: 'CTSELECBAP1', kind: 'reading', requiredFrom: null },
  elecpconebook: { code: 'CTSELECPC1', kind: 'textbook', requiredFrom: null } };
const later = activatedTests({ MASTER_TESTS_ACTIVATION: cutoff }, withElectives);
assert.ok(!('elecbaponereadings' in later) && !('elecpconebook' in later), 'a new elective reading or textbook test with requiredFrom null is not made required');
assert.deepEqual(later, live, 'adding elective tests changes nothing else');
console.log('PASS — the eight tests awaiting faculty review and every elective test (slug "elec…") are optional; 71 keep the 2026-10-15T05:17:56.813Z cutoff.');
