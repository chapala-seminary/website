// Source-level regression witness for issue #184. This test documents the
// effective award gate; it does NOT approve academic activation or deployment.
import assert from 'node:assert/strict';
import catalog from '../worker/catalog.json' with { type: 'json' };
import schedule from '../src/data/required-from.json' with { type: 'json' };
import { testCounts, textbookShortfall } from '../worker/awards.js';
import { activatedTests, PENDING_FACULTY_REVIEW } from '../worker/test-activation.js';

const cutoff = '2026-10-28T06:00:00Z';
const before = '2026-10-28T05:59:59.999Z';
const after = cutoff;
const slugs = Object.keys(schedule).sort();
assert.equal(slugs.length, 40, 'exactly forty explicitly scheduled tests');
assert.equal(slugs.filter(s => s.startsWith('elec')).length, 32, '32 denominational tests');
assert.equal(slugs.filter(s => PENDING_FACULTY_REVIEW.has(s)).length, 8, 'eight foundation/core reading tests');

// activatedTests controls fallback dates only; a catalog date is independently
// enforced by testCounts. An optional-list assertion alone cannot protect awards.
const fallback = activatedTests({ MASTER_TESTS_ACTIVATION: '2026-10-15T05:17:56.813Z' });
for (const slug of slugs) {
  const t = catalog.textbooks[slug];
  assert.ok(t && t.code, `catalog entry for ${slug}`);
  assert.equal(schedule[slug], cutoff, `schedule for ${slug}`);
  assert.equal(t.requiredFrom, cutoff, `catalog date for ${slug}`);
  assert.ok(!(slug in fallback), `explicitly dated ${slug} absent from fallback map`);
  assert.equal(testCounts(slug, t.code, { now: before }), false, `${slug} before cutoff`);
  assert.equal(testCounts(slug, t.code, { now: after }), true, `${slug} at cutoff`);
  assert.equal(testCounts(slug, t.code, {
    now: after, completions: [{ code: t.code, track: 'mdiv', completed_at: before }],
  }), false, `${slug} previously completed master's course grandfathered`);
  assert.equal(testCounts(slug, t.code, {
    now: after, completions: [{ code: t.code, track: 'cert', completed_at: before }],
  }), true, `${slug} certificate-level completion does not exempt master's`);
  assert.equal(testCounts(slug, t.code, {
    now: after, completions: [{ code: t.code, track: 'thm', completed_at: cutoff }],
  }), true, `${slug} completion at cutoff not grandfathered`);
  assert.equal(textbookShortfall(t.code, 'cert', [], { now: after }), null,
    `${slug} does not block certificate-track award`);
  assert.notEqual(textbookShortfall(t.code, 'mdiv', [], { now: after }), null,
    `${slug} has a master's-level test shortfall at cutoff`);
}
console.log('PASS — issue #184: 40 explicit dates govern testCounts at Oct 28 boundary; no faculty or rights approval implied.');
