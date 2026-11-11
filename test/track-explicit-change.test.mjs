/* A routine save from an old device must not change a student's track (#298,
 * #292, #239, #183). Through the real Worker and D1:
 *
 *   API_BASE=http://127.0.0.1:8798 node test/track-explicit-change.test.mjs
 *
 * Before: every /api/sync overwrote students.track with the browser's copy, so
 * a phone that still said "cert" demoted an M.Div. student, and the next exams
 * were graded and the next courses recorded at Certificate level.
 * After: only a sync marked trackChange (Change track, the sign-up form)
 * changes the track or goal. Every name here is made up.
 */
const BASE = process.env.API_BASE || 'http://127.0.0.1:8798';
let checks = 0;
const fails = [];
const ok = (cond, label, detail) => { checks++; if (!cond) fails.push(label + (detail === undefined ? '' : `\n        ${JSON.stringify(detail).slice(0, 300)}`)); };
const post = async (p, b) => {
  const r = await fetch(BASE + p, { method: 'POST', headers: { 'content-type': 'application/json', connection: 'close' }, body: JSON.stringify(b) });
  return { status: r.status, body: await r.json().catch(() => null) };
};

const email = `track-explicit-${Date.now()}@example.test`;
const reg = await post('/api/register', { name: 'Track Explicit Tester', email, track: 'mdiv' });
ok(reg.status === 201 && reg.body?.student?.track === 'mdiv', 'registers on M.Div.', reg);
const code = reg.body?.code;
const me = { name: 'Track Explicit Tester', email };

// 1. an old device that still says Certificate saves its copy: the record stays M.Div.
let r = await post('/api/sync', { code, student: { ...me, track: 'cert' } });
ok(r.status === 200 && r.body?.student?.track === 'mdiv', 'a routine save from a "cert" device does not demote the record', r.body?.student);

// 2. ... nor through the goal (Associate is cert + goal "assoc")
r = await post('/api/sync', { code, student: { ...me, track: 'cert', goal: 'assoc' } });
ok(r.body?.student?.track === 'mdiv' && (r.body?.student?.goal || '') === '', 'a routine save cannot set the Associate goal', r.body?.student);

// 3. the student's own choice still works, both ways
r = await post('/api/sync', { code, student: { ...me, track: 'thm', trackChange: true } });
ok(r.body?.student?.track === 'thm', 'Change track to Th.M. is saved', r.body?.student);
r = await post('/api/sync', { code, student: { ...me, track: 'cert', goal: 'assoc', trackChange: true } });
ok(r.body?.student?.track === 'cert' && r.body?.student?.goal === 'assoc', 'Change track to Associate is saved', r.body?.student);

// 4. other details still follow the latest save
r = await post('/api/sync', { code, student: { ...me, country: 'MX', track: 'mdiv' } });
ok(r.body?.student?.track === 'cert' && r.body?.student?.country === 'MX', 'country still updates; track does not', r.body?.student);

// 5. a value that is not a track is still refused, chosen or not
r = await post('/api/sync', { code, student: { ...me, track: 'wizard', trackChange: true } });
ok(r.status === 400, 'an unknown track is refused', r);

console.log(`track-explicit-change: ${checks - fails.length}/${checks} checks passed`);
if (fails.length) { for (const f of fails) console.log('  FAIL ' + f); process.exit(1); }
