// Called only by the separately authorized production deployment command.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const config = JSON.parse(fs.readFileSync('wrangler.jsonc', 'utf8').replace(/^\s*\/\/.*$/gm, ''));
const account = '119b0919229edb3185b69f1c6bd04b66';
if (config.account_id !== account || config.d1_databases?.length !== 1 ||
    config.d1_databases[0].database_name !== 'chapala-students' || config.d1_databases[0].binding !== 'DB') {
  throw new Error('Production migrations require the pinned CTS production database and account');
}
const result = spawnSync('npx', ['wrangler', 'd1', 'migrations', 'apply', 'chapala-students', '--remote', '--config', 'wrangler.jsonc'], {
  stdio: 'inherit', env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: account },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
