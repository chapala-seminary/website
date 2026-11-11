/* The final synthesis exams' keys (Dr. Cook, 2 Nov 2026): the public file holds
 * prompts only, the private assessment-keys checkout the answers, model answers
 * and rubrics, and the grading rows join them; a built page carries none of the
 * keys (tools/verify-no-keys.mjs). No server, no build:
 *
 *   node --test test/finals-keys.test.mjs
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { finalLeaks, finalQuestions, resolveKeysRoot, buildKeyRows } from '../tools/grading-keys-lib.mjs';

const pub = JSON.parse(fs.readFileSync('src/content/finals/otsfinal.json', 'utf8'));
const keysRoot = resolveKeysRoot('.');
const hasKeys = !!(keysRoot && fs.existsSync(path.join(keysRoot, 'finals', 'otsfinal.json')));

test('the public final holds prompts only', () => {
  assert.deepEqual(finalLeaks(pub), []);
  assert.equal(pub.keys, 'private');
  assert.equal(pub.requiredFrom, null);
  assert.equal(pub.fill.length, 10);
  assert.equal(pub.sa.length, 4);
  for (const q of pub.fill) { assert.ok(q.prompt.en.includes('____') && q.prompt.es.includes('____')); assert.ok(q.part === 1 || q.part === 2); }
  // drawn from both parts of all five readings
  assert.deepEqual([...new Set(pub.fill.map((q) => q.reading))].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual([...new Set(pub.fill.map((q) => q.part))].sort(), [1, 2]);
});

test('a key in the public file is caught', () => {
  const bad = structuredClone(pub);
  bad.fill[0].answer = { en: 'Writings' };
  bad.sa[1].model = { en: 'x' };
  delete bad.keys;
  const leaks = finalLeaks(bad);
  assert.ok(leaks.some((m) => /fill\[0\].*"answer"/.test(m)));
  assert.ok(leaks.some((m) => /sa\[1\].*"model"/.test(m)));
  assert.ok(leaks.some((m) => /keys: "private"/.test(m)));
});

test('without the private file the final is skipped, never graded from the public file', () => {
  const notes = [];
  assert.equal(finalQuestions(null, pub, (m) => notes.push(m)), null);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-finals-'));
  try {
    assert.equal(finalQuestions(dir, pub, (m) => notes.push(m)), null);
    fs.mkdirSync(path.join(dir, 'finals'));
    fs.writeFileSync(path.join(dir, 'finals', 'otsfinal.json'), JSON.stringify({ slug: 'otsfinal', fill: [{ answer: { en: 'x' } }], sa: [] }));
    assert.equal(finalQuestions(dir, pub, (m) => notes.push(m)), null, 'a short private file does not match');
    assert.ok(notes.length >= 3 && notes.every((m) => /not synced/.test(m)));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('with the private file: one row per item, the meta row, rubrics', { skip: !hasKeys && 'no assessment-keys checkout with finals/' }, () => {
  const rows = buildKeyRows({ root: '.', keysRoot });
  const fn = [...rows.keys()].filter((q) => q.startsWith('fn:otsfinal/'));
  assert.equal(fn.length, 15);
  const meta = JSON.parse(rows.get('fn:otsfinal/meta/0').data);
  assert.deepEqual([meta.pass, meta.maxChars, meta.code, meta.kind, meta.page], [{ fill: 9, sa: 3 }, 8000, 'CTSOTS', 'final', 'CTSOTSFinal']);
  for (let i = 0; i < 10; i++) {
    const d = JSON.parse(rows.get(`fn:otsfinal/fill/${i}`).data);
    assert.ok(d.answer.en && d.answer.es, `fill ${i} has an answer`);
    assert.deepEqual(d.prompt, pub.fill[i].prompt, `fill ${i} keeps the public prompt`);
  }
  for (let i = 0; i < 4; i++) {
    const r = rows.get(`fn:otsfinal/sa/${i}`);
    const d = JSON.parse(r.data);
    assert.equal(r.rubricVersion, 1);
    assert.ok(d.model.en.length > 200 && d.model.es.length > 200, `essay ${i} has model answers in English and Spanish`);
    const pts = d.rubric.points;
    assert.ok(pts.length >= 2 && pts.length <= 4 && pts.some((p) => p.essential) && pts.every((p, k) => p.id === 'abcd'[k] && p.en), `essay ${i}: a valid rubric (docs/ai-grading.md section 3)`);
  }
  // the debated-question essay never asks which view is right, and its rubric says so
  assert.match(pub.sa[3].prompt.en, /You are not asked which view is right/);
  assert.match(JSON.parse(rows.get('fn:otsfinal/sa/3').data).rubric.points[0].en, /never judged on which view/);
});

test('a built final page with a key in it fails tools/verify-no-keys.mjs', { skip: !hasKeys && 'no assessment-keys checkout with finals/' }, () => {
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-final-dist-'));
  try {
    const scope = 'fn:otsfinal';
    const data = { slug: 'otsfinal', scope, grading: 'live', fill: pub.fill.map((q, i) => ({ qid: `${scope}/fill/${i}`, prompt: q.prompt })), sa: pub.sa.map((q, i) => ({ qid: `${scope}/sa/${i}`, prompt: q.prompt })) };
    const page = (d, extra = '') => `<!doctype html><html><body><script src="/assets/js/cts-grading.js"></script><script>window.CTS_FINAL = ${JSON.stringify(d)};</script>${extra}</body></html>`;
    fs.writeFileSync(path.join(dist, 'CTSOTSFinal.html'), page(data));
    fs.mkdirSync(path.join(dist, 'es'));
    const model = JSON.parse(fs.readFileSync(path.join(keysRoot, 'finals', 'otsfinal.json'), 'utf8')).sa[0].model.es;
    const leaky = structuredClone(data);
    leaky.fill[0].answer = { en: 'Writings' };
    fs.writeFileSync(path.join(dist, 'es', 'CTSOTSFinal.html'), page(leaky, `<p>${model}</p>`));
    const r = spawnSync(process.execPath, ['tools/verify-no-keys.mjs', '--live', dist], { encoding: 'utf8' });
    const out = r.stdout + r.stderr;
    assert.notEqual(r.status, 0);
    assert.match(out, /es\/CTSOTSFinal\.html: fill\[0\] carries "answer"/);
    assert.match(out, /es\/CTSOTSFinal\.html: a final's model answer/);
    assert.doesNotMatch(out, /\n\s+CTSOTSFinal\.html:/, 'the clean page is not flagged');
  } finally { fs.rmSync(dist, { recursive: true, force: true }); }
});

test('the worker catalog is current and carries the final and the paper outside the required tests', () => {
  const r = spawnSync(process.execPath, ['tools/gen-worker-catalog.mjs', '--check'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const cat = JSON.parse(fs.readFileSync('worker/catalog.json', 'utf8'));
  assert.equal(cat.assessments.otsfinal.kind, 'final');
  assert.equal(cat.assessments.otspaper.kind, 'paper');
  assert.equal(cat.assessments.otspaper.criteria.reduce((n, c) => n + c.points, 0), 100);
  assert.equal(cat.assessments.otspaper.pass, 80);
  assert.ok(!cat.textbooks.otsfinal && !cat.textbooks.otspaper);
});
