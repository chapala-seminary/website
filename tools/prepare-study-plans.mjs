// Run only from the account-checked production deploy command. Additive schema
// only; no approval or student completion is created by deployment.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const account = '119b0919229edb3185b69f1c6bd04b66';
const config = JSON.parse(fs.readFileSync('wrangler.jsonc','utf8').replace(/^\s*\/\/.*$/gm,''));
if (config.account_id !== account || (process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_ACCOUNT_ID !== account)) throw new Error('CTS production account is not pinned');
if (!config.d1_databases?.some(db => db.binding === 'DB' && db.database_name === 'chapala-students')) throw new Error('CTS production database is not pinned');
const result = spawnSync('npx',['wrangler','d1','execute','chapala-students','--remote','--config','wrangler.jsonc','--file','migrations/0014_thm_study_plans.sql'],{stdio:'inherit',env:{...process.env,CLOUDFLARE_ACCOUNT_ID:account}});
if (result.status !== 0) process.exit(result.status || 1);
