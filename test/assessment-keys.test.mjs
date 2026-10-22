/* The private textbook/reading overlay (tools/grading-keys-lib.mjs) and the
 * export that fills it (tools/export-assessment-keys.mjs). No network. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { buildKeyRows, resolveKeysRoot } from '../tools/grading-keys-lib.mjs';

const qid = 'tb:cults/fill/0';
const publicAnswer = JSON.parse(buildKeyRows({ root: '.', keysRoot: null }).get(qid).data).answer.en;

test('without a private checkout the public bank is the key', () => {
  const row = JSON.parse(buildKeyRows({ root: '.', keysRoot: null }).get(qid).data);
  assert.equal(row.answer.en, publicAnswer);
  assert.ok(row.prompt.en);
});

test('a matching private file replaces the answer and keeps the index', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-keys-'));
  const file = path.join(dir, 'textbooks');
  fs.mkdirSync(file);
  const src = JSON.parse(fs.readFileSync('src/content/textbooks/cults.json', 'utf8'));
  const questions = src.test.questions.map((q) => ({ prompt: q.prompt, answer: q.answer, accept: q.accept, ...(q.chapter != null ? { chapter: q.chapter } : {}) }));
  questions[0] = { ...questions[0], answer: { ...questions[0].answer, en: 'private-only-angel' } };
  fs.writeFileSync(path.join(file, 'cults.json'), JSON.stringify({ slug: 'cults', test: { questions } }));
  const notes = [];
  const rows = buildKeyRows({ root: '.', keysRoot: dir, warn: (m) => notes.push(m) });
  const row = JSON.parse(rows.get(qid).data);
  assert.equal(row.answer.en, 'private-only-angel');
  assert.equal(row.prompt.en, JSON.parse(buildKeyRows({ root: '.', keysRoot: null }).get(qid).data).prompt.en);
  const meta = JSON.parse(rows.get('tb:cults/meta/0').data);
  assert.equal(meta.n, src.test.questions.length);
  assert.equal(meta.draw, src.test.draw);
  assert.equal(notes.length, 0);
  const reading = JSON.parse(rows.get('rd:genesisreadings/fill/0').data);
  const publicReading = JSON.parse(buildKeyRows({ root: '.', keysRoot: null }).get('rd:genesisreadings/fill/0').data);
  assert.equal(reading.answer.en, publicReading.answer.en);
});

test('a short or mis-named private file cannot replace the public bank', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-keys-'));
  fs.mkdirSync(path.join(dir, 'textbooks'));
  fs.writeFileSync(path.join(dir, 'textbooks', 'cults.json'), JSON.stringify({
    slug: 'other', test: { questions: [{ prompt: { en: 'x' }, answer: { en: 'y' } }] },
  }));
  const notes = [];
  const row = JSON.parse(buildKeyRows({ root: '.', keysRoot: dir, warn: (m) => notes.push(m) }).get(qid).data);
  assert.equal(row.answer.en, publicAnswer);
  assert.match(notes.join('\n'), /does not match/);

  fs.writeFileSync(path.join(dir, 'textbooks', 'cults.json'), JSON.stringify({
    slug: 'cults', test: { questions: [{ prompt: { en: 'x' }, answer: { en: 'short-file' } }] },
  }));
  const notes2 = [];
  const again = JSON.parse(buildKeyRows({ root: '.', keysRoot: dir, warn: (m) => notes2.push(m) }).get(qid).data);
  assert.equal(again.answer.en, publicAnswer);
  assert.match(notes2.join('\n'), /cannot delete grading keys/);
});

test('ASSESSMENT_KEYS selects the checkout and an empty value does not', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-keys-env-'));
  const prev = process.env.ASSESSMENT_KEYS;
  process.env.ASSESSMENT_KEYS = dir;
  assert.equal(resolveKeysRoot('.'), path.resolve(dir));
  process.env.ASSESSMENT_KEYS = '  ';
  assert.equal(resolveKeysRoot(fs.mkdtempSync(path.join(os.tmpdir(), 'cts-keys-root-'))), null);
  if (prev === undefined) delete process.env.ASSESSMENT_KEYS; else process.env.ASSESSMENT_KEYS = prev;
});

test('export writes banks outside the repo and refuses to write inside it', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-keys-export-'));
  const ok = spawnSync(process.execPath, ['tools/export-assessment-keys.mjs', dir], { encoding: 'utf8' });
  assert.equal(ok.status, 0, ok.stderr);
  const cults = JSON.parse(fs.readFileSync(path.join(dir, 'textbooks', 'cults.json'), 'utf8'));
  assert.equal(cults.slug, 'cults');
  assert.equal(cults.test.questions.length, 40);
  assert.equal(cults.test.questions[0].answer.en, publicAnswer);
  assert.equal(cults.body, undefined);
  assert.ok(fs.existsSync(path.join(dir, 'readings')));
  assert.ok(fs.existsSync(path.join(dir, 'README.md')));
  const inside = spawnSync(process.execPath, ['tools/export-assessment-keys.mjs', 'src/content'], { encoding: 'utf8' });
  assert.notEqual(inside.status, 0);
  assert.match(inside.stderr, /refusing/);
});
