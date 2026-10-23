/* The private textbook/reading overlay (tools/grading-keys-lib.mjs) and the
 * export that fills it (tools/export-assessment-keys.mjs). No network. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { buildKeyRows, resolveKeysRoot, textbookQuestions } from '../tools/grading-keys-lib.mjs';

const qid = 'tb:cults/fill/0';
const privateAnswer = textbookQuestions('.', 'cults').questions[0].answer.en;
assert.ok(privateAnswer, 'local assessment-keys checkout must supply cults answers for these tests');

test('public textbook banks omit answer and accept', () => {
  const src = JSON.parse(fs.readFileSync('src/content/textbooks/cults.json', 'utf8'));
  assert.equal(src.test.questions[0].answer, undefined);
  assert.equal(src.test.questions[0].accept, undefined);
  assert.ok(src.test.questions[0].prompt.en);
});

test('without a private checkout textbook sync refuses answerless public banks', () => {
  assert.throws(
    () => buildKeyRows({ root: '.', keysRoot: null }),
    /textbook answers are only in the private assessment-keys checkout/,
  );
});

test('a matching private file supplies the answer and keeps the index', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-keys-'));
  // Full private tree is required: every public textbook omits answers.
  fs.cpSync(resolveKeysRoot('.'), dir, { recursive: true });
  const src = JSON.parse(fs.readFileSync('src/content/textbooks/cults.json', 'utf8'));
  const cultsPath = path.join(dir, 'textbooks', 'cults.json');
  const cults = JSON.parse(fs.readFileSync(cultsPath, 'utf8'));
  cults.test.questions[0] = { ...cults.test.questions[0], answer: { ...cults.test.questions[0].answer, en: 'private-only-angel' } };
  fs.writeFileSync(cultsPath, JSON.stringify(cults));
  const notes = [];
  const rows = buildKeyRows({ root: '.', keysRoot: dir, warn: (m) => notes.push(m) });
  const row = JSON.parse(rows.get(qid).data);
  assert.equal(row.answer.en, 'private-only-angel');
  assert.equal(row.prompt.en, src.test.questions[0].prompt.en);
  const meta = JSON.parse(rows.get('tb:cults/meta/0').data);
  assert.equal(meta.n, src.test.questions.length);
  assert.equal(meta.draw, src.test.draw);
  assert.equal(notes.length, 0);
  const reading = JSON.parse(rows.get('rd:genesisreadings/fill/0').data);
  assert.ok(reading.answer.en);
});

test('a short or mis-named private file cannot replace the public bank', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-keys-'));
  fs.mkdirSync(path.join(dir, 'textbooks'));
  fs.writeFileSync(path.join(dir, 'textbooks', 'cults.json'), JSON.stringify({
    slug: 'other', test: { questions: [{ prompt: { en: 'x' }, answer: { en: 'y' } }] },
  }));
  assert.throws(
    () => buildKeyRows({ root: '.', keysRoot: dir, warn: () => {} }),
    /textbook answers are only in the private assessment-keys checkout|refusing an answerless public fallback/,
  );

  fs.writeFileSync(path.join(dir, 'textbooks', 'cults.json'), JSON.stringify({
    slug: 'cults', test: { questions: [{ prompt: { en: 'x' }, answer: { en: 'short-file' } }] },
  }));
  assert.throws(
    () => buildKeyRows({ root: '.', keysRoot: dir, warn: () => {} }),
    /textbook answers are only in the private assessment-keys checkout|refusing an answerless public fallback/,
  );
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

test('export refuses to write answerless public textbook banks', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-keys-export-'));
  const bad = spawnSync(process.execPath, ['tools/export-assessment-keys.mjs', dir], { encoding: 'utf8' });
  assert.notEqual(bad.status, 0);
  assert.match(bad.stderr, /no longer hold answers|refusing/);
  const inside = spawnSync(process.execPath, ['tools/export-assessment-keys.mjs', 'src/content'], { encoding: 'utf8' });
  assert.notEqual(inside.status, 0);
  assert.match(inside.stderr, /refusing/);
});
