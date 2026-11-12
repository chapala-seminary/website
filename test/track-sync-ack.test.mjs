// Regression for #183: a track selection is not saved merely because a
// non-examination page lacks the grading widget. Synthetic local state only.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { test } from 'node:test';

const source = readFileSync(new URL('../public/cts-track.js', import.meta.url), 'utf8');

async function chooseMdiv({ syncResult, withSync = true, registered = true }) {
  const store = new Map([
    ['cts_track', 'cert'],
    ['cts_goal', ''],
    ['cts_student', JSON.stringify({ name: 'Synthetic Student', track: 'cert', goal: '' })]
  ]);
  if (registered) store.set('cts_student_code', 'CTS-TEST-0000-0001');
  const localStorage = {
    getItem: k => store.has(k) ? store.get(k) : null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k)
  };
  let note = null;
  let reloads = 0;
  function button(t) {
    const listeners = {};
    return {
      disabled: false,
      classList: { add() {} },
      getAttribute: k => k === 'data-t' ? t : null,
      addEventListener: (event, fn) => { listeners[event] = fn; },
      click: () => listeners.click()
    };
  }
  const toggle = button(null);
  const choices = ['cert', 'assoc', 'mdiv', 'thm'].map(button);
  const menu = { style: { display: 'none' } };
  const wrap = {
    querySelector: sel => sel === '.tg' ? toggle : sel === '.menu' ? menu : sel === '[role="alert"]' ? note : null,
    querySelectorAll: sel => sel === '.menu button' ? choices : sel === 'button' ? [toggle, ...choices] : [],
    appendChild: el => { note = el; }
  };
  const document = {
    readyState: 'complete',
    documentElement: { lang: 'en', innerHTML: '' },
    head: { appendChild() {} },
    body: {
      classList: { contains: () => false },
      getAttribute: () => null,
      appendChild() {}
    },
    getElementById: () => null,
    createElement: tag => tag === 'div' ? wrap : {
      textContent: '',
      setAttribute() {}
    }
  };
  const window = {};
  if (withSync) window.CTS_SYNC = { sync: () => Promise.resolve(syncResult) };
  // Deliberately no window.CTSGrading: this is a catalog/certificate page.
  vm.runInNewContext(source, { window, document, localStorage, location: {
    reload: () => { reloads++; }
  }, Promise, JSON, Array });
  choices[2].click();
  await new Promise(resolve => setImmediate(resolve));
  return {
    track: store.get('cts_track'),
    studentTrack: JSON.parse(store.get('cts_student')).track,
    reloads,
    alert: note?.textContent || ''
  };
}

test('track change rolls back when sync fails on a non-grading page', async () => {
  const s = await chooseMdiv({ syncResult: null });
  assert.equal(s.track, 'cert');
  assert.equal(s.studentTrack, 'cert');
  assert.equal(s.reloads, 0);
  assert.match(s.alert, /could not be saved/i);
});

test('a page with no sync keeps the local change (nothing to confirm with)', async () => {
  const s = await chooseMdiv({ withSync: false });
  assert.equal(s.track, 'mdiv');
  assert.equal(s.reloads, 1);
});

test('a visitor with no student record keeps the local change', async () => {
  const s = await chooseMdiv({ syncResult: null, registered: false });
  assert.equal(s.track, 'mdiv');
  assert.equal(s.reloads, 1);
  assert.equal(s.alert, '');
});

test('track change rolls back when server still reports Certificate', async () => {
  const s = await chooseMdiv({ syncResult: { student: { track: 'cert', goal: '' } } });
  assert.equal(s.track, 'cert');
  assert.equal(s.reloads, 0);
});

test('track change reloads only after server confirms M.Div', async () => {
  const s = await chooseMdiv({ syncResult: { student: { track: 'mdiv', goal: '' } } });
  assert.equal(s.track, 'mdiv');
  assert.equal(s.studentTrack, 'mdiv');
  assert.equal(s.reloads, 1);
  assert.equal(s.alert, '');
});
