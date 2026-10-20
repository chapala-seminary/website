// One-time, beta-only D1 migration-history reconciliation.
// Verifies full local migration DDL against actual remote BETA schema before
// recording 0012-0015 as applied. Existing student data is never read.
// After history is correct, Wrangler applies genuine pending 0016-0018.
// Never run this against production. Designed to be safe if rerun.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const DB = 'chapala-students-beta';
const ACCOUNT = '119b0919229edb3185b69f1c6bd04b66';
const DBID = 'ae98d4cb-2d74-4bc4-a0a0-f01c22e95a7b';
const CFG = 'wrangler.jsonc';
if (process.env.GITHUB_REF !== 'refs/heads/beta') throw new Error('Only beta branch may run reconciliation');
if (process.env.CLOUDFLARE_ACCOUNT_ID !== ACCOUNT || !process.env.CLOUDFLARE_API_TOKEN)
  throw new Error('Authorized pinned beta Cloudflare account credentials required');
const config = JSON.parse(fs.readFileSync(CFG, 'utf8').replace(/^\s*\/\/.*$/gm, ''));
const binding = config.env?.beta?.d1_databases?.[0];
if (config.account_id !== ACCOUNT || config.env.beta.account_id !== ACCOUNT ||
    config.env.beta.d1_databases.length !== 1 || binding.database_name !== DB ||
    binding.database_id !== DBID || binding.binding !== 'DB')
  throw new Error('Wrong Cloudflare database or account binding');

function wrangler(args, options = {}) {
  const r = spawnSync('npx', ['wrangler', ...args], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: ACCOUNT }, ...options });
  if (r.error || r.status !== 0) throw new Error('Wrangler failed: ' + args.slice(0,4).join(' ') +
    '\n' + String(r.stderr || r.error || '').slice(0,1500));
  return r.stdout;
}
function sql(command) {
  const output = wrangler(['d1', 'execute', DB, '--remote', '--env', 'beta', '--config', CFG, '--command', command]);
  const m = /\[\s*\{\s*"results"/.exec(output);
  if (!m) throw new Error('Could not parse D1 response as JSON; refusing further action');
  const parsed = JSON.parse(output.slice(m.index));
  if (!Array.isArray(parsed) || parsed.some(x => x.success !== true)) throw new Error('D1 query did not succeed');
  return parsed.flatMap(x => x.results || []);
}
const normal = x => String(x || '').replace(/--[^\n]*/g, '').replace(/\bIF NOT EXISTS\b/g,'')
  .replace(/\s+/g,' ').replace(/\s*;\s*$/,'').trim();
const expectedFiles = ['0012_email_links.sql','0013_test_activation.sql',
  '0014_thm_study_plans.sql','0015_grading.sql'];
const expected = new Map();
for (const filename of expectedFiles) {
  const source = fs.readFileSync('migrations/' + filename, 'utf8').replace(/--[^\n]*/g,'');
  const stmts = source.split(';').map(x=>x.trim()).filter(x=>/^CREATE\s+/i.test(x));
  for (const stmt of stmts) {
    const m = /^CREATE\s+(?:UNIQUE\s+)?(?:TABLE|INDEX|VIEW)\s+(?:IF NOT EXISTS\s+)?([\w]+)/i.exec(stmt);
    if (!m || expected.has(m[1])) throw new Error('Unexpected migration create statement in ' + filename);
    expected.set(m[1], { filename, sql: normal(stmt) });
  }
}
if (expected.size !== 19) throw new Error('Expected 19 migration 0012-0015 creates; got ' + expected.size);
const objects = sql("SELECT type,name,sql FROM sqlite_master WHERE name IN (" +
  [...expected.keys()].map(x=>"'"+x+"'").join(',') + ")");
const actual = new Map(objects.map(x=>[x.name,x]));
for (const [name,obj] of expected) {
  if (!actual.has(name) || normal(actual.get(name).sql) !== obj.sql)
    throw new Error('BETA SCHEMA DRIFT: '+name+' does not exactly match '+obj.filename+'; NO WRITE');
}
const emailCol = sql("SELECT name,type,notnull,dflt_value FROM pragma_table_info('email_challenges') WHERE name='link_hash'");
if (emailCol.length !== 1 || emailCol[0].type.toUpperCase() !== 'TEXT' ||
    Number(emailCol[0].notnull) !== 0 || emailCol[0].dflt_value !== null)
  throw new Error('link_hash column differs from migration 0012');
for (const table of ['course_completions','unit_progress','textbook_results']) {
  const col=sql("SELECT name,type,notnull,dflt_value FROM pragma_table_info('"+table+"') WHERE name='source'");
  if (col.length !== 1 || col[0].type.toUpperCase() !== 'TEXT' || Number(col[0].notnull)!==1 ||
    col[0].dflt_value !== "'legacy'") throw new Error('Source column differs from 0015 in '+table);
}
const history=sql('SELECT name FROM d1_migrations ORDER BY id').map(x=>x.name);
if (!history.includes('0011_code_emails.sql')) throw new Error('Missing expected 0011 history');
if (history.some(x=> /^001[6-8]_/.test(x)))
  throw new Error('A newer migration is already recorded: concurrent change; stop safely');
const groups=sql("SELECT name FROM sqlite_master WHERE name IN ('study_groups','study_group_members','paper_sheets')");
if (groups.length) throw new Error('0017 group tables already exist: concurrent change; stop safely');
// Do NOT log or query individual student records, answers or certificate codes.
console.log('Preflight PASSED: all 19 create objects, columns and migration history exactly match 0012-0015.');
// A recovery bookmark is a read-only operation; abort before any write unless it succeeds.
const bookmark=wrangler(['d1','time-travel','info',DB,'--env','beta','--config',CFG,'--json']).trim();
if (!bookmark || !(/bookmark|0000[0-9a-f-]+/i).test(bookmark))
  throw new Error('Missing Time Travel recovery bookmark; refusing schema history update');
console.log('BETA recovery bookmark (keep in job log): '+bookmark.slice(0,1200));
const missing = expectedFiles.filter(x=>!history.includes(x));
if (missing.length) {
  const names=missing.map(x=>"('"+x+"')").join(',');
  sql('INSERT INTO d1_migrations (name) VALUES '+names+' ON CONFLICT(name) DO NOTHING');
  console.log('Reconciled BETA migration-history entries: '+missing.join(', '));
}
const after=sql('SELECT name FROM d1_migrations ORDER BY id').map(x=>x.name);
if (expectedFiles.some(x=>!after.includes(x))) throw new Error('History reconciliation verification failed');
// Use Wrangler's own migration runner, not a custom one, for unapplied 0016-0018.
// 0016 normalizes beta-only country codes; 0017 adds group tables; 0018 adds attestation.
console.log('Applying 0016-0018 on BETA only through normal Wrangler migrations apply');
const migrate=wrangler(['d1','migrations','apply',DB,'--remote','--env','beta','--config',CFG]);
console.log(migrate.slice(-3000));
const done=sql('SELECT name FROM d1_migrations ORDER BY id').map(x=>x.name);
for (const x of [...expectedFiles,'0016_country_codes.sql','0017_study_groups.sql','0018_paper_attestation.sql'])
  if (!done.includes(x)) throw new Error('Migrations did not finish: '+x);
const own=sql("SELECT name,type FROM pragma_table_info('paper_sheets') WHERE name='attestation'");
if (own.length!==1 || own[0].type.toUpperCase()!=='TEXT')
  throw new Error('Paper attestation column not installed');
console.log('BETA D1 migration reconciliation and 0016-0018 application complete; no production touched.');
