// Called only by the beta deployment command. Applies pending D1 migrations
// to the beta database before the Worker is published, the same way
// tools/prepare-production-migrations.mjs does for production. Pass --check
// to confirm the pinned database and account without applying anything.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const config = JSON.parse(fs.readFileSync('wrangler.jsonc', 'utf8').replace(/^\s*\/\/.*$/gm, ''));
const account = '119b0919229edb3185b69f1c6bd04b66';
const beta = config.env?.beta;
const db = beta?.d1_databases?.[0];
if (config.account_id !== account || beta?.d1_databases?.length !== 1 ||
    db?.database_name !== 'chapala-students-beta' || db?.binding !== 'DB') {
  throw new Error('Beta migrations require the pinned CTS beta database and account');
}
if (process.argv.includes('--check')) {
  console.log('Beta migrations target chapala-students-beta on the pinned account.');
  process.exit(0);
}
const result = spawnSync('npx', ['wrangler', 'd1', 'migrations', 'apply', 'chapala-students-beta', '--remote', '--env', 'beta', '--config', 'wrangler.jsonc'], {
  stdio: 'inherit', env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: account },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
