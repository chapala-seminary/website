#!/usr/bin/env node
/* Put the answer keys on the server (docs/ai-grading.md, section 4).
 *
 *   node tools/sync-grading-keys.mjs --env beta|production|local
 *        [--state DIR] [--dry-run] [--apply-migration]
 *
 * Reads every question that is graded -- the units, the textbook banks and the
 * reading banks -- and makes the `grading_keys` table in D1 match. Only rows
 * whose content_hash differs are written, so a deploy that changed nothing in
 * the questions writes nothing. Rows for questions that no longer exist are
 * deleted (only among the sources this tool manages).
 *
 * WHICH DATABASE. Remote runs go through the same pinned Chapala account every
 * deploy uses: the config's account_id must be the Chapala account, an
 * environment CLOUDFLARE_ACCOUNT_ID naming another account is refused, and
 * wrangler is told the pinned id explicitly. `npm run deploy` and
 * `npm run deploy:beta` have already checked (tools/verify-worker-config.mjs
 * --deploy) that the credentials reach that account. `--env local` goes to the
 * test suite's database (test/wrangler.local.jsonc, --state, default
 * .wrangler-local) and touches no account.
 *
 * MIGRATION. migrations/0015_grading.sql must have been applied. It adds
 * columns, so it is not safe to run twice; with --apply-migration this tool
 * applies it only if the grading_keys table is missing (deploy:beta does).
 *
 * The single-page courses (Counseling, Narrative Preaching, WiseSpeak
 * Preaching, Ethics) are `sp:<page>/<kind>/<i>` and a meta row
 * `sp:<page>/meta/0`; tools/grading-keys-lib.mjs reads them from the pages
 * (tools/single-pages-lib.mjs) and the rubrics from src/data/single-rubrics.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { buildKeyRows } from './grading-keys-lib.mjs';

const ACCOUNT = '119b0919229edb3185b69f1c6bd04b66';          // the Chapala account (wrangler.jsonc)
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : d; };
const ENV = opt('--env', 'local');
const DRY = flag('--dry-run');
const STATE = opt('--state', '.wrangler-local');
const MANAGED = ['u:', 'tb:', 'rd:', 'sp:'];
const CHUNK_BYTES = 3 * 1024 * 1024;

const jsonc = (f) => JSON.parse(fs.readFileSync(f, 'utf8').replace(/^\s*\/\/.*$/gm, ''));
const hash = (text) => crypto.createHash('sha256').update(text).digest('hex').slice(0, 32);
const sql = (v) => (v == null ? 'NULL' : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`);

/* ---- the questions -------------------------------------------------------- */

const rows = buildKeyRows({ root: '.', warn: (m) => console.warn(m) });   // tools/grading-keys-lib.mjs, shared with the grader eval
console.log(`${rows.size} questions in the content`);

/* ---- the database --------------------------------------------------------- */

function target() {
  if (ENV === 'local') {
    return { args: ['d1', 'execute', 'chapala-students', '--local', '--persist-to', STATE, '--config', 'test/wrangler.local.jsonc'], label: `local (${STATE})` };
  }
  const cfg = jsonc('wrangler.jsonc');
  const c = ENV === 'beta' ? cfg.env?.beta : ENV === 'production' ? cfg : null;
  if (!c) throw new Error(`unknown --env ${ENV} (beta, production or local)`);
  if (c.account_id !== ACCOUNT) throw new Error(`REFUSING: wrangler.jsonc ${ENV} account_id is not the pinned Chapala account`);
  if (process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_ACCOUNT_ID !== ACCOUNT)
    throw new Error('REFUSING: CLOUDFLARE_ACCOUNT_ID names a different account than the one wrangler.jsonc pins');
  const db = c.d1_databases?.[0];
  if (!db || /PUT-THE|REPLACE/i.test(db.database_id)) throw new Error(`REFUSING: ${ENV} has no real database_id in wrangler.jsonc`);
  return { args: ['d1', 'execute', db.database_name, ...(ENV === 'beta' ? ['--env', 'beta'] : []), '--remote', '--config', 'wrangler.jsonc'], label: `${ENV} (${db.database_name})` };
}
const T = target();
const run = (extra) => spawnSync('npx', ['wrangler', ...T.args, ...extra], {
  encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: ENV === 'local' ? process.env.CLOUDFLARE_ACCOUNT_ID : ACCOUNT },
});
function query(command) {
  const r = run(['--json', '--command', command]);
  if (r.status !== 0) { const e = new Error((r.stderr || r.stdout || '').slice(0, 800)); e.failed = true; throw e; }
  const out = JSON.parse(r.stdout.slice(r.stdout.indexOf('[')));
  return out[0]?.results ?? [];
}
function execFile(text) {
  const f = path.join(os.tmpdir(), `cts-keys-${process.pid}-${Math.random().toString(36).slice(2)}.sql`);
  fs.writeFileSync(f, text);
  try {
    const r = run(['--file', f]);
    if (r.status !== 0) throw new Error((r.stderr || r.stdout || '').slice(0, 1200));
  } finally { fs.rmSync(f, { force: true }); }
}

console.log(`database: ${T.label}`);
let existing;
try { existing = new Map(query('SELECT qid, content_hash FROM grading_keys').map((r) => [r.qid, r.content_hash])); }
catch (e) {
  if (!/no such table/i.test(e.message)) throw e;
  if (!flag('--apply-migration')) {
    console.error('The grading_keys table is not there. Apply migrations/0015_grading.sql first (it is not safe to run twice):');
    console.error('  npx wrangler d1 migrations apply <database> [--env beta] --remote');
    process.exit(1);
  }
  console.log('applying migrations/0015_grading.sql (the grading tables are missing)');
  if (!DRY) execFile(fs.readFileSync('migrations/0015_grading.sql', 'utf8'));
  existing = new Map();
}

const changed = [...rows.values()].filter((r) => existing.get(r.qid) !== hash(r.data));
const stale = [...existing.keys()].filter((q) => MANAGED.some((p) => q.startsWith(p)) && !rows.has(q));
console.log(`${changed.length} to write, ${rows.size - changed.length} unchanged, ${stale.length} to remove`);
if (DRY || (!changed.length && !stale.length)) process.exit(0);

const now = new Date().toISOString();
const stmt = (r) => `INSERT INTO grading_keys (qid, kind, source, data_json, rubric_version, content_hash, updated_at) VALUES (${sql(r.qid)}, ${sql(r.kind)}, ${sql(r.source)}, ${sql(r.data)}, ${sql(r.rubricVersion)}, ${sql(hash(r.data))}, ${sql(now)}) ON CONFLICT(qid) DO UPDATE SET kind = excluded.kind, source = excluded.source, data_json = excluded.data_json, rubric_version = excluded.rubric_version, content_hash = excluded.content_hash, updated_at = excluded.updated_at;`;
let chunk = '', bytes = 0, files = 0;
const flush = () => { if (chunk) { execFile(chunk); files++; chunk = ''; bytes = 0; } };
for (const r of changed) {
  const s = stmt(r) + '\n';
  if (bytes + s.length > CHUNK_BYTES) flush();
  chunk += s; bytes += s.length;
}
for (let i = 0; i < stale.length; i += 200) {
  const s = `DELETE FROM grading_keys WHERE qid IN (${stale.slice(i, i + 200).map(sql).join(',')});\n`;
  if (bytes + s.length > CHUNK_BYTES) flush();
  chunk += s; bytes += s.length;
}
flush();
console.log(`done: ${changed.length} written, ${stale.length} removed (${files} batch${files === 1 ? '' : 'es'})`);
