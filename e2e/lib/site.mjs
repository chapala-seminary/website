/* The server side of a journey: what the seminary's record says, the local
 * database a step sometimes has to set up, the scheduled runs, and the
 * question banks the student answers from.
 *
 * Journeys read the record through the same API the browser uses
 * (GET /api/student/<code>); they reach into D1 only to set up what a journey
 * cannot do through the site in reasonable time (e.g. a student who already
 * finished eleven courses) or to read what no API shows.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
export const PORT = Number(process.env.E2E_PORT || 8808);
export const BASE = `http://127.0.0.1:${PORT}`;
const STATE = process.env.E2E_STATE || '.wrangler-e2e';
const CONFIG = 'test/wrangler.local.jsonc';

/** Run SQL against the suite's database; returns the rows of each statement.
 *
 *  This writes from a second process while the Worker -- serving several
 *  journeys at once -- writes to the same SQLite file, and SQLite turns a
 *  writer away while another holds the lock (SQLITE_BUSY, "database is
 *  locked"; first seen in CI on beta run 43071560767). That is the test's own
 *  set-up colliding with the site, not the site failing, so a busy database
 *  is tried again a few times. Any other failure says what wrangler said. */
export function db(sql) {
  for (let attempt = 1; ; attempt++) {
    try {
      const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'chapala-students', '--local', '--persist-to', STATE,
        '--config', CONFIG, '--json', '--command', sql], { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 << 20 }).toString();
      return JSON.parse(out.slice(out.indexOf('['))).map((r) => r.results);
    } catch (e) {
      const said = `${e.stdout || ''}\n${e.stderr || ''}`;
      if (attempt < 6 && /SQLITE_BUSY|database is locked/i.test(said)) {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 300 * attempt);
        continue;
      }
      throw new Error(`d1 execute failed (attempt ${attempt}): ${sql.slice(0, 120)}\n${said.trim().split('\n').slice(-12).join('\n')}`);
    }
  }
}
export const rows = (sql) => db(sql)[0];

/** The student's record as the browser receives it. */
export async function record(code) {
  const r = await fetch(`${BASE}/api/student/${encodeURIComponent(code)}`);
  if (!r.ok) throw new Error(`record ${code}: HTTP ${r.status}`);
  return r.json();
}
export const deleteStudent = (code) => fetch(`${BASE}/api/student/${encodeURIComponent(code)}`, { method: 'DELETE' }).catch(() => {});

/** Cloudflare's schedules, fired by hand (wrangler dev --test-scheduled). */
export const cron = {
  grading: async () => (await fetch(`${BASE}/__scheduled?cron=*%2F15+*+*+*+*`)).status,
  daily: async () => (await fetch(`${BASE}/__scheduled?cron=0+15+*+*+*`)).status,
};

/** A unit's questions with their keys, from the merged content the build used. */
export function unitBank(prefix, n) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/units', prefix, `${n}.json`), 'utf8'));
}

/** The course catalog the Worker grades from: unit pages, totals, completion codes. */
export const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'worker/catalog.json'), 'utf8'));

/** Credit the record already holds, as if earned before this journey began.
 *  'legacy' is what credit from before live grading carries; a 'server' row
 *  would also need the passed attempt the server writes with it. */
export function priorUnits(code, course, units) {
  if (!units.length) return;
  db(`INSERT INTO unit_progress (student_id, course, unit, completed_at, source) VALUES ${
    units.map((u) => `('${code}', '${course}', ${u}, '2026-10-01T00:00:00Z', 'legacy')`).join(',')}`);
}
export function priorCourses(code, codes, track) {
  if (!codes.length) return;
  db(`INSERT INTO course_completions (student_id, code, completed_at, track, source) VALUES ${
    codes.map((c) => `('${code}', '${c}', '2026-10-01T00:00:00Z', '${track}', 'legacy')`).join(',')}`);
}

/** Made-up people: unique per run, recognisably synthetic. */
export function person(label) {
  const id = crypto.randomUUID().slice(0, 8);
  return { name: `E2E ${label} ${id}`, email: `e2e-${label.toLowerCase().replace(/\W+/g, '-')}-${id}@example.test` };
}

/* ---- staff: Cloudflare Access, signed with the suite's own test key ------- */
const { key: TEST_JWK } = JSON.parse(fs.readFileSync(path.join(ROOT, 'test/fixtures/access-test-key.json'), 'utf8'));
const b64 = (v) => Buffer.from(typeof v === 'string' ? v : JSON.stringify(v)).toString('base64url');
/** The header Cloudflare Access puts on a signed-in staff member's requests. */
export function staffHeaders(email = 'e2e-staff@example.test') {
  const head = b64({ alg: 'RS256', kid: 'cts-test-1', typ: 'JWT' });
  const now = Math.floor(Date.now() / 1000);
  const body = b64({ aud: ['cts-test-aud'], iss: 'https://cts-test.cloudflareaccess.com', exp: now + 3600, iat: now, email, sub: 'e2e' });
  const sig = crypto.sign('sha256', Buffer.from(`${head}.${body}`), crypto.createPrivateKey({ key: TEST_JWK, format: 'jwk' })).toString('base64url');
  return { 'cf-access-jwt-assertion': `${head}.${body}.${sig}` };
}
