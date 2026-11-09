// Regression #303: a legacy Associate goal must reach the server on the
// next ordinary poll after apply() queues its explicit reconciliation.
// Synthetic local state + fake API only: no live student data or network.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../public/assets/js/cts-sync.js', import.meta.url), 'utf8');
const settle = async () => { for (let n = 0; n < 8; n++) await new Promise(r => setImmediate(r)); };

function start({ serverGoal = null, studentGoal = 'assoc' } = {}) {
  const stored = new Map([
    ['cts_student', JSON.stringify({ name: 'Synthetic Associate QA', track: 'cert',
      ...(studentGoal === undefined ? {} : { goal: studentGoal }), email: '' })],
    ['cts_track', 'cert'], ['cts_goal', 'assoc'], ['cts_student_code', 'CTS-SYNTHETIC-ONLY']
  ]);
  const session = new Map([['cts_sync_api', '1']]);
  const localStorage = { getItem: k => stored.has(k) ? stored.get(k) : null,
    setItem: (k, v) => { stored.set(k, String(v)); }, removeItem: k => { stored.delete(k); } };
  const sessionStorage = { getItem: k => session.has(k) ? session.get(k) : null,
    setItem: (k, v) => { session.set(k, String(v)); }, removeItem: k => { session.delete(k); } };
  const document = { readyState: 'complete', hidden: false,
    body: { appendChild() {}, prepend() {}, insertBefore() {}, firstChild: null },
    getElementById: () => null, dispatchEvent() {}, addEventListener() {},
    createElement: () => ({ style: {}, children: [], setAttribute() {},
      addEventListener() {}, appendChild() {}, querySelector: () => ({ textContent: '' }) }) };
  const intervals = [], submissions = [];
  const fetch = async (url, opts = {}) => {
    if (url.endsWith('/health')) return { ok: true, json: async () => ({}) };
    if (!url.endsWith('/sync')) throw new Error('Unexpected URL ' + url);
    const payload = JSON.parse(opts.body);
    submissions.push({ goal: payload.student.goal, chosen: !!payload.student.trackChange });
    if (payload.student.trackChange) serverGoal = payload.student.goal;
    return { ok: true, json: async () => ({
      student: { id: 'CTS-SYNTHETIC-ONLY', track: 'cert', goal: serverGoal },
      progress: [], doneCodes: [], completions: []
    }) };
  };
  const window = { addEventListener() {} };
  vm.runInNewContext(source, { window, document, localStorage, sessionStorage, fetch,
    setInterval: cb => { intervals.push(cb); }, CustomEvent: class CustomEvent {} },
    { filename: 'cts-sync.js' });
  return { stored, submissions, serverGoal: () => serverGoal,
    async poll() { intervals[0](); await settle(); } };
}

test('queued Associate goal reaches server on next ordinary poll without navigation', async () => {
  const h = start();
  await settle();
  assert.equal(h.submissions.length, 1);
  assert.equal(h.submissions[0].chosen, false);
  assert.equal(h.serverGoal(), null);
  assert.equal(h.stored.get('cts_track_change'), '1');
  await h.poll();
  assert.equal(h.submissions.length, 2, 'the regular poll must send the update');
  assert.deepEqual(h.submissions[1], { goal: 'assoc', chosen: true });
  assert.equal(h.serverGoal(), 'assoc');
  assert.equal(h.stored.has('cts_track_change'), false, 'server acknowledgment clears pending choice');
});

test('Associate goal saved only in cts_goal is still transmitted', async () => {
  const h = start({ studentGoal: null });
  await settle();
  assert.equal(h.submissions[0].goal, 'assoc');
  await h.poll();
  assert.equal(h.serverGoal(), 'assoc');
});

test('explicit server Certificate choice is not silently changed by a stale Associate browser', async () => {
  const h = start({ serverGoal: '' });
  await settle(); await h.poll();
  assert.equal(h.serverGoal(), '');
  assert.equal(h.submissions.some(s => s.chosen), false);
  assert.equal(h.stored.get('cts_goal'), '');
});
