// The master's ministry paper as a course requirement (#318), through the
// real Worker and a real local D1, for Old Testament Survey. The paper only:
// a final is never required, even dated (Dr. Cook, 12 Nov 2026).
//
//   API_BASE=http://127.0.0.1:8861 STATE=.wrangler-mastersfinal CONFIG=<config> node test/masters-assessments.api.mjs
//
// Needs a Worker whose TEST_REQUIRED_FROM dates otspaper (and otsfinal; the
// suite's own test/wrangler.local.jsonc does not, so every other test sees
// them as shipped: not in force). tools/masters-assessments-config.mjs writes
// such a config from the suite's. A final or paper pass is recorded only by
// the server (worker/grading/attempts.js, worker/assignments.js), and a
// browser cannot claim one (worker/api.js textbookRows), so the passes and
// the "finished before" completion are written straight into the database.

import { execFileSync } from 'node:child_process';
import { register } from 'node:module';
register('data:text/javascript,' + encodeURIComponent(
  `export async function load(url, ctx, next) {
     if (url.endsWith('.json')) return next(url, { ...ctx, importAttributes: { ...ctx.importAttributes, type: 'json' } });
     return next(url, ctx);
   }`));
const A = await import('../worker/awards.js');

const BASE = process.env.API_BASE || 'http://127.0.0.1:8861';
const STATE = process.env.STATE || '.wrangler-mastersfinal';
const CONFIG = process.env.CONFIG || 'test/.wrangler.mastersfinal.jsonc';

let checks = 0;
const fails = [];
function ok(cond, label, detail) {
  checks++;
  if (!cond) fails.push(label + (detail !== undefined ? `\n        ${typeof detail === 'string' ? detail : JSON.stringify(detail)}` : ''));
}
const H = { 'content-type': 'application/json', 'x-test-grading-mode': 'shadow' };
const jpost = async (p, b) => { const r = await fetch(BASE + p, { method: 'POST', headers: H, body: JSON.stringify(b) }); return { status: r.status, body: await r.json().catch(() => null) }; };
const sql = (command) => execFileSync('npx', ['wrangler', 'd1', 'execute', 'chapala-students', '--local', '--persist-to', STATE, '--config', CONFIG, '--command', command], { stdio: ['ignore', 'pipe', 'pipe'] }).toString();

const CODE = 'CTSOTS', COURSE = 'ots', FINAL = 'otsfinal', PAPER = 'otspaper';
const AT = '2026-10-10T12:00:00.000Z';
const units = A.courseUnits(COURSE).map((u) => ({ course: COURSE, unit: u, completedAt: AT }));
const tests = A.testsFor(CODE).map((slug) => ({ slug, passedAt: AT }));
const done = (track) => ({ doneCodes: [CODE], completionTracks: track === 'cert' ? {} : { [CODE]: track } });
const has = (st, track) => (st.completions || []).some((c) => c.code === CODE && (!track || c.track === track));
const pass = (code, slug) => sql(`INSERT OR IGNORE INTO textbook_results (student_id, textbook, passed_at, source) VALUES ('${code}', '${slug}', '${AT}', 'server')`);
let n = 0;
const RUN = Date.now().toString(36);
const student = async (track, extra = {}) => {
  const r = await jpost('/api/register', { name: `Final Paper Tester ${RUN} ${++n} ${track}`, email: `final-paper-${RUN}-${n}-${track}@example.test`, track, ...extra });
  if (r.status !== 201) throw new Error(`register returned ${r.status}: ${JSON.stringify(r.body)}`);
  return r.body.code;
};
const verify = async (code, email) => {
  const s = await jpost('/api/email/start', { code, email });
  return (await jpost('/api/email/confirm', { code, verification: s.body?.devCode })).status === 200;
};

for (const track of ['mdiv', 'thm']) {
  const c = await student(track);
  let st = (await jpost('/api/sync', { code: c, progress: units, textbooks: tests, ...done(track) })).body;
  ok(!has(st), `${track}: units and textbook tests, no paper -> not complete`, st?.completions);
  const forged = (await jpost('/api/sync', { code: c, textbooks: [{ slug: FINAL, passedAt: AT }, { slug: PAPER, passedAt: AT }], ...done(track) })).body;
  ok(!has(forged) && !(forged.textbooks || []).some((t) => t.textbook === FINAL || t.textbook === PAPER), `${track}: a browser claiming the paper is refused`, forged?.textbooks);
  ok(await verify(c, `final-paper-${track}.${Date.now()}@example.org`), `${track}: the student verifies an email (a certificate needs one)`);
  pass(c, FINAL);
  st = (await jpost('/api/sync', { code: c, ...done(track) })).body;
  ok(!has(st), `${track}: a final passed is not the paper -> not complete`, st?.completions);
  const cert = await jpost('/api/certificate', { code: c, level: 'course', course: COURSE, title: 'Old Testament Survey' });
  ok(cert.status === 409 && /ministry paper/.test(cert.body?.error || ''), `${track}: no course certificate meanwhile (${cert.status}: ${cert.body?.error})`);
  pass(c, PAPER);
  st = (await jpost('/api/sync', { code: c, ...done(track) })).body;
  ok(has(st, track), `${track}: paper passed -> complete at the ${track} level`, st?.completions);
  const cert2 = await jpost('/api/certificate', { code: c, level: 'course', course: COURSE, title: 'Old Testament Survey' });
  ok(cert2.status === 201, `${track}: then the course certificate is issued (${cert2.status}: ${cert2.body?.error})`);
}

{ // paper passed, final not: complete (the final is never required, even dated)
  const c = await student('mdiv');
  await jpost('/api/sync', { code: c, progress: units, textbooks: tests, ...done('mdiv') });
  pass(c, PAPER);
  const st = (await jpost('/api/sync', { code: c, ...done('mdiv') })).body;
  ok(has(st, 'mdiv'), 'mdiv: paper passed, final not -> complete', st?.completions);
}

{ // a master's completion the record held before activation stands
  const c = await student('mdiv');
  sql(`INSERT INTO course_completions (student_id, code, completed_at, track, source) VALUES ('${c}', '${CODE}', '2000-06-01T00:00:00.000Z', 'mdiv', 'server')`);
  const st = (await jpost('/api/sync', { code: c, ...done('mdiv') })).body;
  ok(has(st, 'mdiv'), 'a master\'s completion from before activation is kept', st?.completions);
  ok((st.exemptions || []).includes(PAPER) && !(st.exemptions || []).includes(FINAL), 'and the record names the paper as exempt (never the final)', st?.exemptions);
}

for (const [label, extra] of [['cert', {}], ['assoc', { goal: 'assoc' }]]) { // unchanged
  const c = await student('cert', extra);
  const st = (await jpost('/api/sync', { code: c, progress: units, textbooks: [], ...done('cert') })).body;
  ok(has(st), `${label}: completes with the units alone, as before`, st?.completions);
}

if (fails.length) {
  console.error(`masters-assessments API: ${fails.length} of ${checks} checks failed`);
  for (const f of fails) console.error('  FAIL ' + f);
  process.exit(1);
}
console.log(`masters-assessments API: ${checks} checks pass`);
