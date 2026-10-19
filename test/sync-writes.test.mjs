// Count real INSERT/UPDATE events in the suite's local D1 database. An unchanged
// value must not merely round-trip correctly: it must avoid the UPDATE itself.
// This test never connects to a remote database or sends email.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const BASE = process.env.API_BASE || 'http://127.0.0.1:8798';
assert(['localhost', '127.0.0.1'].includes(new URL(BASE).hostname), 'local Worker required');
const STATE = process.env.SYNC_WRITE_STATE || '.wrangler-local';
const CONFIG = 'test/wrangler.local.jsonc';
const TABLES = ['unit_progress', 'textbook_results', 'course_completions'];
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-sync-writes-'));
let checks = 0;

function sql(command) {
  // --file avoids putting fixture credentials into command-line arguments.
  const file = path.join(scratch, 'query.sql');
  fs.writeFileSync(file, command, { mode: 0o600 });
  return JSON.parse(execFileSync('node_modules/.bin/wrangler', [
    'd1', 'execute', 'chapala-students', '--local', '--persist-to', STATE,
    '--config', CONFIG, '--file', file, '--json',
  ], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
}
async function post(route, payload) {
  const response = await fetch(BASE + route, {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-test-grading-mode': 'shadow' },
    body: JSON.stringify(payload),
  });
  assert(response.ok, `${route} returned ${response.status}`);
  return response.json();
}
function equal(actual, expected, label) {
  assert.deepEqual(actual, expected, label);
  checks++;
}
function counts() {
  return sql('SELECT table_name, inserts, updates FROM _sync_write_counts ORDER BY table_name;')[0].results;
}
function reset() { sql('UPDATE _sync_write_counts SET inserts = 0, updates = 0;'); }
function expectWrites(inserts, updates, label) {
  equal(counts(), TABLES.slice().sort().map(table_name => ({
    table_name, inserts: inserts[table_name] || 0, updates: updates[table_name] || 0,
  })), label);
}
try {
  // Schema instrumentation is installed before the Worker starts. Changing
  // triggers while it serves requests can reload workerd and cancel a POST.
  assert.equal(counts().length, TABLES.length, 'run the suite fixture setup before this check');
  reset();
  const reg = await post('/api/register', {
    name: 'Sync Write Regression', email: `sync-write-${crypto.randomUUID()}@example.test`, track: 'cert',
  });
  const firstDate = '2025-06-01T12:00:00.000Z';
  const earlierDate = '2025-01-01T12:00:00.000Z';
  const snapshot = {
    code: reg.code, student: { name: 'Sync Write Regression', track: 'cert' },
    progress: Array.from({ length: 100 }, (_, unit) => ({ course: 'ots', unit: unit + 1, completedAt: firstDate })),
    textbooks: [{ slug: 'cults', passedAt: firstDate }],
    doneCodes: ['CTSOTS'], completionTracks: { CTSOTS: 'cert' },
  };
  const first = await post('/api/sync', snapshot);
  expectWrites({ unit_progress: 100, textbook_results: 1, course_completions: 1 }, {}, 'new progress is inserted');
  reset();
  const repeat = await post('/api/sync', snapshot);
  expectWrites({}, {}, 'an identical full snapshot performs no progress, textbook or completion writes');
  equal(repeat.progress, first.progress, 'repeated sync preserves every passed unit');
  equal(repeat.completions, first.completions, 'repeated sync preserves completion time and level');
  equal(repeat.textbooks, first.textbooks, 'repeated sync preserves textbook passes');

  // Browsers normally omit unit dates, so the API generates a new time. That
  // newer time must not cause old passes to be rewritten on each page visit.
  await post('/api/sync', {
    ...snapshot, progress: snapshot.progress.map(({ course, unit }) => ({ course, unit })),
    textbooks: [{ slug: 'cults' }],
  });
  expectWrites({}, {}, 'undated replay performs no writes to existing passes');

  const earlier = await post('/api/sync', {
    ...snapshot, progress: [{ course: 'ots', unit: 1, completedAt: earlierDate }],
    textbooks: [{ slug: 'cults', passedAt: earlierDate }],
  });
  expectWrites({}, { unit_progress: 1, textbook_results: 1 }, 'earlier dates update only the affected passes');
  equal(earlier.progress.find(p => p.unit === 1).completed_at, earlierDate, 'earlier unit date wins');
  equal(earlier.textbooks.find(t => t.textbook === 'cults').passed_at, earlierDate, 'earlier textbook date wins');

  for (const track of ['assoc', 'thm']) {
    reset();
    const raised = await post('/api/sync', { ...snapshot, completionTracks: { CTSOTS: track } });
    expectWrites({}, { course_completions: 1 }, `completion can rise to ${track}`);
    equal(raised.completions.find(c => c.code === 'CTSOTS').track, track, 'earned level is raised');
    equal(raised.completions.find(c => c.code === 'CTSOTS').completed_at,
      first.completions.find(c => c.code === 'CTSOTS').completed_at, 'upgrade retains the original completion date');
  }
  reset();
  for (const track of ['cert', 'assoc', 'thm', 'mdiv']) {
    const stale = await post('/api/sync', { ...snapshot, completionTracks: { CTSOTS: track } });
    equal(stale.completions.find(c => c.code === 'CTSOTS').track, 'thm', 'stale or equal-rank device keeps the earned level');
  }
  expectWrites({}, {}, 'lower, identical and equal-rank completion levels perform no writes');

  // Legacy completions may have no track; fill it once, then skip repeats.
  assert(/^CTS-[0-9A-HJKMNP-TV-Z-]+$/.test(reg.code));
  sql(`UPDATE course_completions SET track = NULL WHERE student_id = '${reg.code}';`);
  reset();
  const legacy = await post('/api/sync', snapshot);
  expectWrites({}, { course_completions: 1 }, 'missing legacy completion level is populated');
  equal(legacy.completions.find(c => c.code === 'CTSOTS').track, 'cert', 'legacy level is restored');
  reset();
  await post('/api/sync', snapshot);
  expectWrites({}, {}, 'populated legacy completion is unchanged on replay');
  console.log(`PASS — ${checks} assertions: unchanged snapshots skip D1 progress writes; earlier dates and higher levels still merge.`);
} finally {
  fs.rmSync(scratch, { recursive: true, force: true });
}
