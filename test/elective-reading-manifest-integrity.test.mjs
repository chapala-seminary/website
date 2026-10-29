// Public manifest integrity only. Does NOT inspect private keys, grading, rights, or translations.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const courses = [
  ['elecpconereadings', 'CTSElecPC1'],
  ['elecpctworeadings', 'CTSElecPC2'],
  ['elecpcthreereadings', 'CTSElecPC3'],
  ['elecpcfourreadings', 'CTSElecPC4'],
  ['elecpcfivereadings', 'CTSElecPC5'],
  ['elecbaponereadings', 'CTSElecBap1'],
  ['elecbaptworeadings', 'CTSElecBap2'],
  ['elecbapthreereadings', 'CTSElecBap3'],
  ['elecbapfourreadings', 'CTSElecBap4'],
  ['elecbapfivereadings', 'CTSElecBap5'],
  ['elecwesonereadings', 'CTSElecWes1'],
  ['elecwestworeadings', 'CTSElecWes2'],
  ['elecwesthreereadings', 'CTSElecWes3'],
  ['elecwesfourreadings', 'CTSElecWes4'],
  ['elecwesfivereadings', 'CTSElecWes5'],
  ['elecrefonereadings', 'CTSElecRef1'],
  ['elecreftworeadings', 'CTSElecRef2'],
  ['elecrefthreereadings', 'CTSElecRef3'],
  ['elecreffourreadings', 'CTSElecRef4'],
  ['elecreffivereadings', 'CTSElecRef5'],
];

// Known, OPEN translation debt as of 2026-10-29, tracked in issue #201.
// This explicit baseline prevents unrelated beta work from being blocked, but
// rejects ANY new omission. Native reviewers must approve the missing wording.
// Remove each entry when its prompt is corrected and reviewed. Run --strict
// to require zero omissions before an owner-approved production release.
const knownMissing = [
  'elecrefonereadings:24:sw',
  'elecwestworeadings:27:sw',
].sort();

test('all 20 denominational reading manifests: identity, question distribution, four-language blanks', () => {
  const missing = [];
  const errors = [];
  const seen = new Set();

  for (const [slug, course] of courses) {
    assert.ok(!seen.has(slug), `duplicate slug ${slug}`);
    seen.add(slug);
    const path = `src/content/readings/${slug}.json`;
    const manifest = JSON.parse(readFileSync(path, 'utf8'));
    assert.equal(manifest.slug, slug, `${path}: slug identity`);
    assert.equal(manifest.course, course, `${path}: course identity`);
    assert.equal(manifest.kind, 'reading', `${path}: assessment kind`);
    assert.equal(manifest.keys, 'private', `${path}: private key pointer only`);
    assert.ok(manifest.source?.file?.startsWith('assessment-keys/'), `${path}: private source pointer`);
    const questions = manifest.test?.questions;
    assert.ok(Array.isArray(questions), `${path}: question array`);
    assert.equal(questions.length, 40, `${path}: exactly 40 public questions`);
    const counts = new Map();
    questions.forEach((q, index) => {
      const n = index + 1;
      const reading = Number(q.reading);
      counts.set(reading, (counts.get(reading) || 0) + 1);
      if (!Number.isInteger(reading) || reading < 1 || reading > 5)
        errors.push(`${slug} Q${n}: invalid reading ${q.reading}`);
      for (const lang of ['en', 'es', 'fr', 'sw']) {
        const prompt = q.prompt?.[lang];
        if (typeof prompt !== 'string' || !prompt.trim()) {
          missing.push(`${slug}:${n}:${lang}`);
          continue;
        }
        const blanks = prompt.match(/_{4,}/g) || [];
        if (blanks.length !== 1)
          errors.push(`${slug} Q${n} ${lang}: expected one blank, found ${blanks.length}`);
      }
    });
    for (let reading = 1; reading <= 5; reading++)
      assert.equal(counts.get(reading), 8, `${slug}: reading ${reading} must have 8 questions`);
  }

  assert.deepEqual(errors, [], 'unexpected prompt/distribution defects');
  if (process.argv.includes('--strict')) {
    assert.deepEqual(missing, [], 'strict release gate: missing translated prompts');
  } else {
    assert.deepEqual(missing.sort(), knownMissing,
      'baseline changed: investigate new omission OR remove a fixed item from knownMissing');
    if (missing.length) console.warn(
      `OPEN issue #201: ${missing.length} missing public Swahili prompt(s); native review + strict release gate outstanding`
    );
  }
});
