/* Honors reading attestations are kept on the record (migration 0020), so
 * "with honors" survives a new device or browser (Dr. Cook, 9 Nov 2026).
 * Through the real Worker and D1. Every name here is made up.
 *
 *   API_BASE=http://127.0.0.1:8798 node test/honors-on-record.test.mjs
 */
const BASE = process.env.API_BASE || 'http://127.0.0.1:8798';
let checks = 0;
const fails = [];
const ok = (cond, label, detail) => { checks++; if (!cond) fails.push(label + (detail === undefined ? '' : `\n        ${JSON.stringify(detail).slice(0, 300)}`)); };
const post = async (p, b) => {
  const r = await fetch(BASE + p, { method: 'POST', headers: { 'content-type': 'application/json', connection: 'close' }, body: JSON.stringify(b) });
  return { status: r.status, body: await r.json().catch(() => null) };
};

const email = `honors-record-${Date.now()}@example.test`;
const me = { name: 'Honors Record Tester', email };
const reg = await post('/api/register', { ...me, track: 'cert' });
const code = reg.body?.code;
ok(reg.status === 201 && code, 'registers', reg);

const acts = JSON.stringify({ name: me.name, date: '9 November 2026', course: 'Acts', works: ['a', 'b', 'c'] });
// 1. a browser's honors reading is kept on the record
let r = await post('/api/sync', { code, student: me, honors: [{ course: 'Acts', data: acts }] });
ok(r.status === 200, 'sync with an honors reading is accepted', r);
const kept = (r.body?.honors || []).find((h) => h.course === 'Acts');
ok(kept && kept.data === acts && kept.recorded_at, 'the record returns it as the browser sent it', r.body?.honors);

// 2. the first attestation stands: another device cannot rewrite it
const other = JSON.stringify({ name: 'Someone Else', date: '1 January 2026', course: 'Acts', works: ['x'] });
r = await post('/api/sync', { code, student: me, honors: [{ course: 'Acts', data: other }] });
ok((r.body?.honors || []).find((h) => h.course === 'Acts')?.data === acts, 'a later copy does not overwrite the first', r.body?.honors);

// 3. a sync without honors (an old device) removes nothing
r = await post('/api/sync', { code, student: me });
ok((r.body?.honors || []).length === 1, 'a sync with no honors keeps the record\'s', r.body?.honors);

// 4. bad entries are ignored, not stored and not an error
r = await post('/api/sync', { code, student: me, honors: [
  { course: '../etc', data: acts }, { course: 'OTS', data: 'not json' }, { course: 'NT', data: 'x'.repeat(5000) }, { course: 'CH' } ] });
ok(r.status === 200 && (r.body?.honors || []).length === 1, 'malformed honors entries are ignored', r.body?.honors);

// 5. a second course adds a row
r = await post('/api/sync', { code, student: me, honors: [{ course: 'OTS', data: JSON.stringify({ name: me.name, course: 'OTS' }) }] });
ok((r.body?.honors || []).map((h) => h.course).sort().join() === 'Acts,OTS', 'a second course is added', r.body?.honors);

if (fails.length) { console.log(`FAIL — honors-on-record: ${fails.length} of ${checks}`); for (const f of fails) console.log('  FAIL: ' + f); process.exit(1); }
console.log(`honors-on-record: ${checks}/${checks} checks passed`);
