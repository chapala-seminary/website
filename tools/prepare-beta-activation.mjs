// Called only after the normal beta branch/account deploy guards.
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const account='119b0919229edb3185b69f1c6bd04b66';
const config=JSON.parse(fs.readFileSync('wrangler.jsonc','utf8').replace(/^\s*\/\/.*$/gm,''));
if(config.account_id!==account || config.env?.beta?.vars?.MASTER_TESTS_ACTIVATION!=='beta')throw new Error('CTS beta activation configuration is not pinned');
if(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_ACCOUNT_ID!==account)throw new Error('wrong deployment account');
for (const migration of ['migrations/0013_test_activation.sql', 'migrations/0014_thm_study_plans.sql']) {
  const result=spawnSync('npx',['wrangler','d1','execute','chapala-students-beta','--env','beta','--remote','--config','wrangler.jsonc','--file',migration],{stdio:'inherit',env:{...process.env,CLOUDFLARE_ACCOUNT_ID:account}});
  if(result.status!==0)process.exit(result.status||1);
}
