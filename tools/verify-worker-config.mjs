/* The deployed config and the tested config must agree on how a request is
 * answered.
 *
 * test/wrangler.local.jsonc is a copy of wrangler.jsonc, because the real one
 * carries database ids that do not exist until someone has run `d1 create`,
 * and a suite that cannot run until after a deployment is a suite nobody runs.
 * A copy drifts. These are the fields where drift would mean the suite proves
 * something about a site nobody is going to deploy -- URL shape, routing, and
 * which binding the assets are on.
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

/* Comments are legal in a .jsonc and JSON.parse does not know that. */
const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8').replace(/^\s*\/\/.*$/gm, ''));

const prod = read('wrangler.jsonc');
const local = read('test/wrangler.local.jsonc');
const FIELDS = ['html_handling', 'not_found_handling', 'run_worker_first', 'binding'];

let checks = 0;
const fails = [];
const ok = (cond, what, detail) => { checks++; if (!cond) fails.push(what + (detail ? `\n        ${detail}` : '')); };

const envs = [['production', prod.assets], ['beta', prod.env?.beta?.assets], ['the test harness', local.assets]];
for (const [name, assets] of envs) {
  ok(!!assets, `${name} configures static assets`);
  if (!assets) continue;
  for (const f of FIELDS)
    ok(assets[f] === prod.assets[f], `${name}: ${f} matches production`,
      `${name} has ${JSON.stringify(assets[f])}, production has ${JSON.stringify(prod.assets[f])}`);
}

/* The two that would silently undo the reason for not using Pages. */
ok(prod.assets?.html_handling === 'none',
  'html_handling is "none", so .html URLs are served rather than redirected');
ok(prod.assets?.run_worker_first === true,
  'run_worker_first is true, so the staging guard sees asset requests at all');

/* One binding, called DB, per environment. `wrangler d1 create` appends a
   second one to the top-level block -- under the database's own name, not
   DB, and regardless of which environment it was created for. The Worker
   reads env.DB and nothing else, so the extra binding is not merely untidy:
   it is a database the code cannot see, sitting in production, while the
   environment it was meant for still has a placeholder. */
for (const [name, c] of [['production', prod], ['beta', prod.env?.beta]]) {
  if (!c) continue;
  const list = c.d1_databases || [];
  ok(list.length === 1, `${name}: exactly one D1 binding`,
    `${list.length} found: ${list.map((d) => d.binding).join(', ')} — wrangler d1 create appends one; move the id and delete the block`);
  ok(list[0]?.binding === 'DB', `${name}: the D1 binding is called DB, which is what the Worker reads`,
    `found ${JSON.stringify(list[0]?.binding)}`);
}

/* Beta must not write to the students' table. */
const db = (c) => c?.d1_databases?.[0]?.database_name;
ok(db(prod) && db(prod.env?.beta) && db(prod) !== db(prod.env.beta),
  'beta has a database of its own, so testing it cannot touch real records',
  `production: ${db(prod)}, beta: ${db(prod.env?.beta)}`);
const dbid = (c) => c?.d1_databases?.[0]?.database_id;
ok(!dbid(prod) || !dbid(prod.env?.beta) || dbid(prod) !== dbid(prod.env.beta),
  'and it is not the same database under a different name');

/* Anything still spelled PUT-THE-...
 *
 * Only for the environment being deployed. The first version demanded every
 * id in the file, so `npm run deploy:beta` refused because PRODUCTION's
 * database did not exist yet -- which is precisely the order things happen
 * in: beta first, production once beta has been read. */
const DEPLOY = process.argv.includes('--deploy');
const envAt = process.argv.indexOf('--env');
const ENV = envAt >= 0 ? process.argv[envAt + 1] : null;
const target = ENV ? prod.env?.[ENV] : prod;
const targetName = ENV || 'production';
if (DEPLOY && !target) {
  console.error(`REFUSING TO DEPLOY — wrangler.jsonc has no environment called "${ENV}".`);
  process.exit(1);
}

const bad = (v) => !v || /PUT-THE|REPLACE/i.test(String(v));
const unset = [];
if (bad(target?.account_id)) unset.push(`${targetName}: account_id`);
if (bad(target?.d1_databases?.[0]?.database_id)) unset.push(`${targetName}: database_id`);

/* And, for the note in suite mode, everything that is still unfilled anywhere. */
const unsetAnywhere = [];
for (const [name, c] of [['production', prod], ['beta', prod.env?.beta]]) {
  if (!c) continue;
  if (bad(c.account_id)) unsetAnywhere.push(`${name}: account_id`);
  if (bad(c.d1_databases?.[0]?.database_id)) unsetAnywhere.push(`${name}: database_id`);
}

console.log(`${checks} assertions on the deployment configuration`);
if (unset.length && !DEPLOY)
  console.log(`  note: ${unset.length} id(s) not filled in yet (${unset.join(', ')}). `
    + '`npm run deploy` refuses until they are; docs/cutover.md has the order.');
/* The credentials about to be used must actually reach the account named in
   the config.
 *
 * This is the check that was missing when the first `d1 create` here built a
 * database in the wrong Cloudflare account. Without an account_id, wrangler
 * picks one; with an account_id that the credentials cannot reach, it fails,
 * which is fine. The case worth catching is the third one: credentials that
 * reach SEVERAL accounts and a config pointing at the wrong one. There,
 * `wrangler deploy` succeeds -- into the wrong account -- and nothing says a
 * word. So the accounts are read before anything is published.
 */
function accountsWranglerCanReach() {
  const out = execFileSync('npx', ['wrangler', 'whoami'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 120000 });
  /* The table prints one 32-hex account id per row. */
  return { ids: [...out.matchAll(/\b[0-9a-f]{32}\b/g)].map((m) => m[0]), out };
}

if (DEPLOY && !unset.length) {
  const want = target.account_id;
  let reach;
  try { reach = accountsWranglerCanReach(); }
  catch (e) {
    console.error('\nREFUSING TO DEPLOY — could not ask wrangler which account it is using.');
    console.error('`npx wrangler whoami` failed. Log in, or set CLOUDFLARE_API_TOKEN, and try again.');
    console.error(String(e.stderr || e.message).split('\n').slice(0, 4).join('\n'));
    process.exit(1);
  }
  if (!reach.ids.includes(want)) {
    console.error(`\nREFUSING TO DEPLOY — the credentials in use cannot reach ${want}.`);
    console.error(`That is the account wrangler.jsonc names. What they CAN reach: `
      + (reach.ids.join(', ') || '(no account listed)'));
    console.error('\nThe Chapala account needs its own API token: in THAT account, My Profile ->');
    console.error('API Tokens -> Create -> "Edit Cloudflare Workers", then add D1:Edit, then');
    console.error('  export CLOUDFLARE_API_TOKEN=...');
    console.error('wrangler prefers it over the interactive login. docs/cutover.md, step zero.');
    process.exit(1);
  }
  console.log(`  credentials reach ${want}, which is the account this deploys to`);
}

if (unset.length && DEPLOY) {
  console.error(`\nREFUSING TO DEPLOY — ${unset.length} id(s) are still placeholders:`);
  for (const u of unset) console.error('  ' + u);
  console.error('\nThe account id decides WHICH CLOUDFLARE ACCOUNT this is published to, and');
  console.error('this machine has access to more than one. Fill them in in wrangler.jsonc.');
  console.error('The account id is on the dashboard under Workers & Pages, right-hand column.');
  process.exit(1);
}
if (!fails.length) console.log('PASS — what is tested and what is deployed answer requests the same way.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach(f => console.log('  ' + f)); process.exitCode = 1; }
