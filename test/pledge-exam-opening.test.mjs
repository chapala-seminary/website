import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// #282: exercise the actual shipped integrity script with a small DOM/event
// fixture. In particular, the real exam-view click handler must NOT fire when
// the checkbox is clear, even though the button remains focusable.
test('Spanish unit exam explains an unchecked pledge, then opens on approval', () => {
  const script = fs.readFileSync('public/assets/js/cts-integrity.js', 'utf8');
  const storage = new Map();
  class El {
    constructor() {
      this.attributes = {};
      this.handlers = {};
      this.classList = { toggle() {} };
      this.children = [];
      this.checked = false;
      this.textContent = '';
      this.innerHTML = '';
    }
    setAttribute(key, value) { this.attributes[key] = value; }
    getAttribute(key) { return this.attributes[key] ?? null; }
    appendChild(child) { this.children.push(child); }
    addEventListener(type, fn, capture = false) {
      (this.handlers[type] ||= []).push({ fn, capture: !!capture });
    }
    querySelectorAll() { return []; }
    closest() { return null; }
    focus() { this.focused = true; }
  }
  const checkbox = new El();
  const need = new El();
  const button = new El();
  let opened = 0;
  button.addEventListener('click', () => opened++); // installed by cts-exam-view BEFORE integrity
  const promptList = [];
  const bar = new El();
  bar.parentNode = { insertBefore() {} };
  bar.querySelector = (selector) => selector === '#cts-exam-open' ? button
    : selector === '.cts-pledge' ? (bar.pledge || null) : null;
  button.parentNode = { insertBefore(box) { bar.pledge = box; } };
  const lesson = new El();
  const document = {
    readyState: 'complete',
    head: { appendChild() {} },
    createElement(tag) {
      const el = new El();
      if (tag === 'div') {
        el.querySelector = selector => selector === 'input' ? checkbox
          : selector === '.cts-pledge-need' ? need : null;
        const append = el.appendChild.bind(el);
        el.appendChild = child => { append(child); if (child.className === 'cts-pledge-prompt') promptList.push(child); };
      }
      return el;
    },
    getElementById(id) {
      return id === 'cts-exam-switch' ? bar : id === 'lesson' ? lesson : null;
    },
  };
  const context = {
    document,
    location: { pathname: '/es/CTSPMUnit1.html' },
    window: { CTSLanguage: { bi: text => text.es } },
    sessionStorage: {
      getItem: k => storage.get(k) ?? null,
      setItem: (k,v) => storage.set(k,v),
      removeItem: k => storage.delete(k),
    },
    MutationObserver: class { observe() {} },
  };
  vm.runInNewContext(script, context);
  assert.equal(button.disabled, false, 'button must not be natively disabled/inert');
  assert.equal(button.getAttribute('aria-disabled'), 'true');
  assert.ok(bar.pledge, 'the pledge checkbox is rendered');
  assert.equal(promptList.length, 1);
  function click() {
    const ev = {
      stopped: false,
      preventDefault() { this.prevented = true; },
      stopImmediatePropagation() { this.stopped = true; },
    };
    const h = button.handlers.click || [];
    for (const entry of [...h.filter(x => x.capture), ...h.filter(x => !x.capture)]) {
      if (ev.stopped) break;
      entry.fn(ev);
    }
    return ev;
  }
  const refused = click();
  assert.equal(refused.prevented, true);
  assert.equal(opened, 0, 'never opens the exam without the pledge');
  assert.equal(checkbox.focused, true, 'focus moves to the checkbox');
  assert.match(promptList[0].innerHTML, /Antes de abrir el examen/);
  checkbox.checked = true;
  for (const item of checkbox.handlers.change || []) item.fn();
  assert.equal(button.getAttribute('aria-disabled'), 'false');
  click();
  assert.equal(opened, 1, 'the existing exam-open handler now works');
});
