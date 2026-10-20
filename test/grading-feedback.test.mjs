// Synthetic answers only. Exercise the production model path, including its
// validated rubric evidence; no live model or student records are needed.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';
import { echoesAnswer, shortAnswerFeedback } from '../worker/grading/feedback.js';
import { gradeBatch } from '../worker/grading/model.js';

const unit = JSON.parse(fs.readFileSync('src/content/units/CTS/1.json'));
const key = unit.sa.find((q) => q.prompt.en.includes('Genesis 3:15'));
const answers = {
  en: 'The first gospel promises that the woman’s offspring will crush the serpent. Christ is the promised Redeemer who defeats Satan and sin at the cross.',
  es: 'El primer evangelio promete que la descendencia de la mujer aplastará a la serpiente. Cristo es el Redentor prometido que vence a Satanás y al pecado en la cruz.',
  fr: 'Le premier évangile promet que la descendance de la femme écrasera le serpent. Le Christ est le Rédempteur promis qui vainc Satan et le péché à la croix.',
};
const quotes = {
  en: ['the woman’s offspring will crush the serpent', 'Christ is the promised Redeemer who defeats Satan and sin at the cross'],
  es: ['la descendencia de la mujer aplastará a la serpiente', 'Cristo es el Redentor prometido que vence a Satanás y al pecado'],
  fr: ['la descendance de la femme écrasera le serpent', 'Le Christ est le Rédempteur promis qui vainc Satan et le péché'],
};

async function graded(lang, { verdict = 'met', feedback = answers[lang], contradicts = false, missing = false, kind = 'sa' } = {}) {
  let calls = 0;
  const points = key.rubric.points.map((p, i) => {
    const made = i < (missing ? 1 : 2);
    return { id: p.id, made, quote: made ? quotes[lang][i] : '' };
  });
  const env = {
    AI: { run: async () => { calls++; return { items: [{ qid: 'q', verdict, contradicts, points, feedback }] }; } },
    DB: { prepare: () => ({ bind: () => ({ run: async () => {} }) }) },
  };
  const result = await gradeBatch(env, kind, lang, [{ qid: 'q', key, answer: answers[lang] }]);
  assert.equal(calls, 1, 'feedback correction must not add latency, calls or spend');
  assert.equal(result.unresolved.length, 0);
  return result.results.get('q');
}

for (const lang of ['en', 'es', 'fr']) {
  test(`${lang}: an accepted answer with all points made receives confirmation without invented missing support`, () => {
    const result = { verdict: 'met', feedback: answers[lang], points: key.rubric.points.map((p) => ({ id: p.id, made: true })) };
    const feedback = shortAnswerFeedback(result, answers[lang], lang);
    assert.equal(echoesAnswer(feedback, answers[lang]), false);
    assert.doesNotMatch(feedback, /support|apoyo|appuyer/);
    assert.match(feedback, { en: /understanding/, es: /comprensión/, fr: /compréhension/ }[lang]);
  });
  test(`${lang}: accepted central answer with optional support omitted receives guidance, not an echo`, async () => {
    const r = await graded(lang);
    assert.equal(r.verdict, 'met');
    assert.deepEqual(r.points.map((p) => p.made), [true, true, false]);
    assert.ok(r.feedback.length > 50);
    assert.equal(echoesAnswer(r.feedback, answers[lang]), false);
    assert.match(r.feedback, { en: /To develop.*assigned passage/, es: /Para desarrollar.*pasaje asignado/, fr: /Pour développer.*passage indiqué/ }[lang]);
    assert.equal(r.record.points[0].quote, quotes[lang][0], 'evidence stays in the academic record');
  });
  test(`${lang}: quote-only feedback and a token prefix are replaced`, async () => {
    for (const feedback of [quotes[lang][0], `« ${answers[lang]} »`, `« ${quotes[lang][0]} »`, `You wrote: ${answers[lang]}`]) {
      const r = await graded(lang, { feedback });
      assert.equal(r.verdict, 'met');
      assert.notEqual(r.feedback, feedback);
    }
  });
  test(`${lang}: contradiction remains rejected with a useful next step`, async () => {
    const r = await graded(lang, { verdict: 'not_met', contradicts: true });
    assert.equal(r.verdict, 'not_met');
    assert.equal(echoesAnswer(r.feedback, answers[lang]), false);
    assert.match(r.feedback, { en: /own words/, es: /propias palabras/, fr: /propres mots/ }[lang]);
  });
  test(`${lang}: missing essential points remain partly, not accepted`, async () => {
    // gradeBatch computes the verdict from rubric points, not model prose.
    // The lower-level verdict cases are covered by grading-unit.test.mjs.
    const r = await graded(lang, { verdict: 'partly', missing: true });
    assert.equal(r.verdict, 'partly');
    assert.ok(r.feedback);
  });
}

test('helpful feedback, including an illustrative quote, remains intact', async () => {
  for (const feedback of [
    'You correctly connect the promise to its fulfillment. Add support from the passage to develop the explanation further.',
    'Your phrase “Christ is the promised Redeemer” connects the passage to its fulfillment; explain how the assigned reading supports that connection.',
  ]) assert.equal((await graded('en', { feedback })).feedback, feedback);
});
test('empty feedback or a verdict correction gets guidance consistent with the final verdict', async () => {
  assert.ok((await graded('en', { feedback: '' })).feedback);
  const r = await graded('en', { verdict: 'partly' });
  assert.equal(r.verdict, 'met');
  assert.match(r.feedback, /meets the required points/);
});
test('a pending grade is still held for a person without invented feedback', async () => {
  const r = await graded('en', { verdict: 'pending' });
  assert.equal(r.verdict, 'pending');
  assert.equal(r.held, true);
  assert.equal(r.feedback, '');
});
test('fill-in feedback is unaffected', async () => {
  const r = await graded('en', { verdict: 'wrong', kind: 'fill', feedback: 'Review the kind of place the sentence asks for.' });
  assert.equal(r.verdict, 'wrong');
  assert.equal(r.feedback, 'Review the kind of place the sentence asks for.');
});
