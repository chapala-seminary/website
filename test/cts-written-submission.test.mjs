/* Regression for the live exam submit choreography. No real student, key,
 * database, or model: executes the actual liveSubmit function with a synthetic
 * grading transport. Full Worker+D1+Chromium tests still gate deployment. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync('public/assets/js/cts-engine.js', 'utf8');
const begin = source.indexOf('  function liveSubmit() {');
const end = source.indexOf('  /* The outcome of a submit, or of a poll', begin);
assert.ok(begin !== -1 && end > begin, 'liveSubmit source is present');
const create = new Function('state', 'with (state) {\n' + source.slice(begin, end) + '\nreturn liveSubmit;\n}');

const tick = () => new Promise((resolve) => setTimeout(resolve, 5));
function scenario({ saCount = 10, fillCount = 0, failAt = 0, omitAt = 0, rejectAt = 0 } = {}) {
  const log = { grades: [], submit: 0, errors: [], saves: 0, result: null };
  const fill = Array.from({ length: fillCount }, (_, i) => ({ qid: 'fill-' + i }));
  const sa = Array.from({ length: saCount }, (_, i) => ({ qid: 'sa-' + i }));
  const state = {
    live: { status: 'ready', working: '', attemptId: 'synthetic-attempt', trouble: null, fillRes: {}, saRes: {} },
    fill, sa, fillChecked: new Array(fillCount).fill(false),
    fillAnswers: new Array(fillCount).fill('synthetic fill'),
    saAnswers: new Array(saCount).fill('A synthetic answer with many words used only to test that the transport acknowledges the answer.'),
    unitPassed: false,
    lockedMinutes: () => 0,
    saCounts: () => true,
    renderQuestions: () => {},
    saveState: () => { log.saves++; },
    trouble: (r) => { log.errors.push(r); state.live.working = ''; },
    absorbGraded: (r, questions) => {
      for (const it of r.items) {
        if (questions === sa) state.live.saRes[it.qid] = { verdict: it.verdict };
        if (questions === fill) state.live.fillRes[it.qid] = { verdict: it.verdict };
      }
    },
    applyResult: (r) => { log.result = r; state.live.working = ''; },
    G: { calls: {
      grade: async (attemptId, items) => {
        assert.equal(attemptId, 'synthetic-attempt');
        const n = log.grades.push(items.map((it) => it.qid));
        if (n === rejectAt) throw new Error('synthetic interrupted grade request');
        if (n === failAt) return { ok: false, status: 503, data: { error: 'synthetic outage' } };
        const sent = n === omitAt ? items.slice(0, -1) : items;
        return { ok: true, status: 200, data: { items: sent.map((it) => ({
          qid: it.qid, verdict: it.qid.startsWith('sa-') ? 'met' : 'right'
        })) } };
      },
      submit: async () => {
        log.submit++;
        return { ok: true, data: { status: 'passed' } };
      }
    } }
  };
  return { state, log, run: create(state), wait: tick };
}

test('ten synthetic short answers are acknowledged in separate bounded requests before final submit', async () => {
  const x = scenario();
  x.run(); await x.wait();
  assert.deepEqual(x.log.grades.map((g) => g.length), [5, 5]);
  assert.equal(x.log.submit, 1);
  assert.equal(Object.keys(x.state.live.saRes).length, 10);
  assert.equal(x.log.errors.length, 0);
});

test('a failed second chunk stops submission, preserves the first five, and retries only unacknowledged answers', async () => {
  const x = scenario({ failAt: 2 });
  x.run(); await x.wait();
  assert.equal(x.log.submit, 0);
  assert.equal(Object.keys(x.state.live.saRes).length, 5);
  assert.equal(x.log.errors.length, 1);
  x.run(); await x.wait();
  assert.deepEqual(x.log.grades.map((g) => g.length), [5, 5, 5]);
  assert.equal(x.log.submit, 1);
  assert.equal(Object.keys(x.state.live.saRes).length, 10);
});

test('HTTP 200 without every question receipt is not a successful grading submission', async () => {
  const x = scenario({ omitAt: 1 });
  x.run(); await x.wait();
  assert.equal(x.log.submit, 0);
  assert.equal(x.log.errors.length, 1);
  assert.equal(Object.keys(x.state.live.saRes).length, 0);
  assert.match(x.log.errors[0].data.error, /incomplete grading acknowledgement/);
});

test('interrupted Promise never permits final submit or erases answers', async () => {
  const x = scenario({ rejectAt: 1 });
  const answers = x.state.saAnswers.slice();
  x.run(); await x.wait();
  assert.equal(x.log.submit, 0);
  assert.equal(x.log.errors.length, 1);
  assert.deepEqual(x.state.saAnswers, answers);
});

test('twenty mixed written answers preserve ordering, five per server request', async () => {
  const x = scenario({ saCount: 10, fillCount: 10 });
  x.run(); await x.wait();
  assert.deepEqual(x.log.grades.map((g) => g.length), [5, 5, 5, 5]);
  assert.equal(x.log.submit, 1);
  assert.equal(Object.keys(x.state.live.fillRes).length, 10);
  assert.equal(Object.keys(x.state.live.saRes).length, 10);
});
