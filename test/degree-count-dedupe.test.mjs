// A course counts once on the diploma pages, as the Worker counts it: old
// certificate-file codes (CTSOTSCERTIFICATE beside CTSOTS) and names that are
// not course codes do not inflate the count (a student's page showed 14
// courses where the record had 8, 29 Oct 2026). Synthetic local state only.
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const names = readFileSync(new URL('../public/assets/js/cts-cert-names.js', import.meta.url), 'utf8');
const degrees = readFileSync(new URL('../public/assets/js/cts-degrees.js', import.meta.url), 'utf8');

function statusWith(lists, { withNames = true } = {}) {
  const store = new Map(Object.entries(lists).map(([k, v]) => [k, JSON.stringify(v)]));
  const localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
  const window = {};
  if (withNames) new Function('window', names)(window);
  return new Function('window', 'localStorage', degrees + '; return window.CTSDegrees;')(window, localStorage);
}

const seven = ['WISESPEAK', 'CTSOTS', 'CTSBIBLE', 'CTSEVANGELISM', 'CTSNT', 'CTSPM', 'CTSST'];
const oldFiles = ['CTSOTSCERTIFICATE', 'CTSNTCERTIFICATE', 'CTSBIBLECERTIFICATE', 'CTSSTCERTIFICATE', 'CTSEVANGELISMCERTIFICATE', 'CTSPMCERTIFICATE'];

test('old certificate-file codes and non-codes count once', () => {
  const d = statusWith({ cts_done_codes: [...seven, ...oldFiles, 'Preaching'], cts_assoc_done_codes: ['CTSCH'] });
  const st = d.status('certificate');
  assert.equal(st.count, 8);
  assert.deepEqual(Object.keys(st.have).sort(), [...seven, 'CTSCH'].sort());
});

test('a ...MDIVCERTIFICATE code keeps the level it names', () => {
  const d = statusWith({ cts_done_codes: ['CTSOTSMDIVCERTIFICATE'], cts_assoc_done_codes: [] });
  assert.equal(d.status('mdiv').have.CTSOTS, true);
});

test('without the names list the duplicates still collapse', () => {
  const d = statusWith({ cts_done_codes: ['CTSOTS', 'CTSOTSCERTIFICATE'], cts_assoc_done_codes: [] }, { withNames: false });
  assert.equal(d.status('certificate').count, 1);
});
