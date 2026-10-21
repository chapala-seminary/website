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
const isoUTC = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value)
  && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString() === value.replace(/Z$/, value.includes('.') ? 'Z' : '.000Z');

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

/* CI falls back to the direct hostname when Cloudflare challenges its runner.
   A custom route otherwise disables workers.dev by default. */
ok(prod.workers_dev === true,
  'production preserves its existing workers.dev hostname for exact-release verification');
ok(prod.preview_urls === false,
  'production does not expose unused per-version preview URLs');
ok(prod.env?.beta?.workers_dev === true,
  'beta keeps its workers.dev hostname enabled for exact-release verification');
ok(prod.env?.beta?.preview_urls === false,
  'beta does not expose unused per-version preview URLs');

/* Beta must not write to the students' table. */
const db = (c) => c?.d1_databases?.[0]?.database_name;
ok(db(prod) && db(prod.env?.beta) && db(prod) !== db(prod.env.beta),
  'beta has a database of its own, so testing it cannot touch real records',
  `production: ${db(prod)}, beta: ${db(prod.env?.beta)}`);
const dbid = (c) => c?.d1_databases?.[0]?.database_id;
ok(!dbid(prod) || !dbid(prod.env?.beta) || dbid(prod) !== dbid(prod.env.beta),
  'and it is not the same database under a different name');

/* The staff pages check Cloudflare Access's signature on every request
   (worker/staff.js). ACCESS_JWKS swaps Access's keys for the test suite's own,
   whose private half is in this repository: set on a deployed Worker, anyone
   could sign themselves in to the student roster. */
for (const [name, c] of [['production', prod], ['beta', prod.env?.beta]]) {
  if (!c) continue;
  ok(!c.vars?.ACCESS_JWKS, `${name}: ACCESS_JWKS is not set (it is for the test suite only)`);
  ok(!c.vars?.EMAIL_MODE, `${name}: EMAIL_MODE is not set (it is for the test suite only)`);
  // the activation dates of the required-reading tests, swapped for the suite's (worker/api.js testRequiredFrom)
  ok(!c.vars?.TEST_REQUIRED_FROM, `${name}: TEST_REQUIRED_FROM is not set (it is for the test suite only)`);
  // "A, B <x@y>" is two addresses to a mail server; a name with a comma must be quoted
  for (const k of ['EMAIL_FROM', 'OUTREACH_FROM'])
    ok(!/^[^"]*,[^"]*</.test(c.vars?.[k] || ''), `${name}: ${k} has no unquoted comma in the sender's name`, c.vars?.[k]);
  /* Two schedules, and these two: the daily notes to students, and the
     fifteen-minute run of the pending-grade queue (worker/index.js routes by
     event.cron). */
  ok(JSON.stringify([...(c.triggers?.crons || [])].sort()) === JSON.stringify(['*/15 * * * *', '0 15 * * *']),
    `${name}: two scheduled runs -- daily for the notes to students, every 15 minutes for the grading queue`,
    `found ${JSON.stringify(c.triggers?.crons)}`);
  /* AI grading (worker/grading/): Workers AI is bound as AI, and the fake model
     the suite uses is for test/wrangler.local.jsonc alone. */
  ok(c.ai?.binding === 'AI', `${name}: the Workers AI binding is called AI, which is what the grader reads`, JSON.stringify(c.ai));
  ok(!c.vars?.AI_FAKE, `${name}: AI_FAKE is not set (it replaces the model with a fake, for the test suite only)`);
  ok(['live', 'shadow'].includes(c.vars?.GRADING_MODE), `${name}: GRADING_MODE is "live" or "shadow" (there is no "off")`, JSON.stringify(c.vars?.GRADING_MODE));
  for (const k of ['GRADER_MODEL', 'GRADER_MODEL_FALLBACK', 'GRADER_PROMPT_VERSION'])
    ok(!!c.vars?.[k], `${name}: ${k} is set`);
  ok(c.vars?.GRADER_MODEL !== c.vars?.GRADER_MODEL_FALLBACK, `${name}: the fallback model is a different model`);
}
/* The test harness: the fake model, the live mode, both schedules. */
ok(!!local.vars?.AI_FAKE && local.vars?.GRADING_MODE === 'live', 'the test harness grades with the fake model in live mode');
ok(JSON.stringify([...(local.triggers?.crons || [])].sort()) === JSON.stringify(['*/15 * * * *', '0 15 * * *']),
  'the test harness has both schedules', JSON.stringify(local.triggers?.crons));
/* The AI grader is live on beta and, since Wayne approved the switch on 19 Oct 2026, on production. */
ok(prod.env?.beta?.vars?.GRADING_MODE === 'live', 'beta grades live');
ok(prod.vars?.GRADING_MODE === 'live', 'production grades live (switch approved by Wayne, 19 Oct 2026)');
ok(prod.env?.beta?.vars?.MASTER_TESTS_ACTIVATION === 'beta', 'beta records the new master test activation cutoff once');
ok(prod.vars?.MASTER_TESTS_ACTIVATION !== 'beta', 'production never takes the beta activation cutoff');
ok(!prod.vars?.LEGACY_SYNC_UNTIL || isoUTC(prod.vars.LEGACY_SYNC_UNTIL), 'the production cutover window, when set, ends at an ISO UTC time');
ok(!prod.vars?.LEGACY_SYNC_UNTIL || (isoUTC(prod.vars.LEGACY_SYNC_COHORT_BEFORE) && prod.vars.LEGACY_SYNC_COHORT_BEFORE < prod.vars.LEGACY_SYNC_UNTIL),
  'an open cutover window names the cohort it serves: records registered before an ISO UTC time earlier than its end', [prod.vars?.LEGACY_SYNC_COHORT_BEFORE, prod.vars?.LEGACY_SYNC_UNTIL]);
ok(!prod.env?.beta?.vars?.LEGACY_SYNC_UNTIL && !prod.env?.beta?.vars?.LEGACY_SYNC_COHORT_BEFORE, 'beta takes no browser credit in live mode (no cutover window)');
ok(!local.vars?.LEGACY_SYNC_UNTIL && !local.vars?.LEGACY_SYNC_COHORT_BEFORE, 'the test harness opens the cutover window only per request (x-test-legacy-sync-until, x-test-legacy-cohort-before)');
ok(!prod.vars?.MASTER_TESTS_ACTIVATION || isoUTC(prod.vars.MASTER_TESTS_ACTIVATION), 'production activation is unset or a separate ISO UTC timestamp');
/* Beta answers at beta.chapalaseminary.org, the address the staff pages'
   Access rule covers; production takes no address from this file until the
   cutover changes that on purpose (docs/cutover.md, step 7). */
ok(JSON.stringify(prod.env?.beta?.routes) === JSON.stringify([{ pattern: 'beta.chapalaseminary.org', custom_domain: true }]),
  'beta is attached to beta.chapalaseminary.org as a custom domain', JSON.stringify(prod.env?.beta?.routes));
ok(!prod.routes && !prod.route, 'production claims no address before the cutover', JSON.stringify(prod.routes || prod.route));
ok(prod.env?.beta?.vars?.OUTREACH_MODE !== 'send',
  'beta does not write to students (its students are people testing the site)');
ok(prod.vars?.DIGEST_MODE === 'send', 'production emails the Monday summary');
ok(prod.env?.beta?.vars?.DIGEST_MODE !== 'send',
  'beta does not email a Monday summary (it shared the live inbox and was mistaken for it)');

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
if (DEPLOY && !ENV && !isoUTC(prod.vars?.MASTER_TESTS_ACTIVATION)) {
  console.error('REFUSING TO DEPLOY — set production MASTER_TESTS_ACTIVATION to the approved production release ISO UTC timestamp. Never copy beta or its cutoff.');
  process.exit(1);
}
if (DEPLOY && !target) {
  console.error(`REFUSING TO DEPLOY — wrangler.jsonc has no environment called "${ENV}".`);
  process.exit(1);
}

/* The mode the pages are built in (CTS_GRADING_MODE) and the mode the Worker
   grades in (GRADING_MODE) must be the same thing, or the pages post to routes
   the Worker does not serve, or carry keys the Worker has stopped honouring
   (docs/ai-grading.md, section 1). The deploy scripts say which mode they build
   with: `--mode shadow|live`, and this refuses if the environment disagrees.
   Without --deploy the same agreement is checked from package.json itself. */
const modeAt = process.argv.indexOf('--mode');
const MODE = modeAt >= 0 ? process.argv[modeAt + 1] : null;
const envMode = target?.vars?.GRADING_MODE;
if (DEPLOY) {
  if (!['live', 'shadow'].includes(MODE)) {
    console.error('REFUSING TO DEPLOY — say which grading mode the build uses: --mode live|shadow (the deploy script passes it).');
    process.exit(1);
  }
  if (MODE !== envMode) {
    console.error(`REFUSING TO DEPLOY — the pages would be built in grading mode "${MODE}" but ${targetName} runs GRADING_MODE "${envMode}" (wrangler.jsonc).`);
    console.error('The two must agree: change the deploy script or the environment, not just one of them.');
    process.exit(1);
  }
  console.log(`  grading mode ${MODE}: the build and ${targetName} agree`);
}
{
  const scripts = JSON.parse(fs.readFileSync('package.json', 'utf8')).scripts || {};
  // Beta publishes through deploy:beta:publish (also what the beta workflow runs);
  // deploy:beta wraps it, so the checks follow `npm run <script>` into it.
  const expand = (script, seen = new Set()) => {
    if (seen.has(script)) return '';
    seen.add(script);
    return (scripts[script] || '').replace(/npm run ([\w:-]+)/g, (m, s) => (s === 'build' ? m : `${m} ${expand(s, seen)}`));
  };
  for (const [script, name, c] of [['deploy', 'production', prod], ['deploy:beta', 'beta', prod.env?.beta], ['deploy:beta:publish', 'beta', prod.env?.beta]]) {
    const cmd = expand(script);
    const flag = /--mode\s+(live|shadow)/.exec(cmd)?.[1];
    const builds = [...cmd.matchAll(/CTS_GRADING_MODE=(\w+)/g)].map((m) => m[1]);
    ok(!!flag, `npm run ${script} passes --mode to this check`);
    ok(flag === c?.vars?.GRADING_MODE, `npm run ${script} builds in the mode ${name} grades in`, `--mode ${flag}, GRADING_MODE ${c?.vars?.GRADING_MODE}`);
    ok(builds.length > 0 && builds.every((m) => m === flag), `every CTS_GRADING_MODE in npm run ${script} is the --mode it passes`, `${builds.join(',')} vs ${flag}`);
    ok(/verify-no-keys\.mjs/.test(cmd), `npm run ${script} checks the built pages for keys`);
  }
  ok(/prepare-production-migrations/.test(expand('deploy')), 'production deploy applies pending D1 migrations before it publishes');
  ok(/prepare-beta-migrations/.test(expand('deploy:beta')), 'beta deploy applies pending D1 migrations before it publishes');
}
for (const [name, c] of [['production', prod], ['beta', prod.env?.beta]]) {
  if (!c?.vars?.COORD_ACCESS_AUD) continue;
  ok(c.vars.COORD_ACCESS_AUD !== c.vars.ACCESS_AUD, `${name}: the coordinator sign-in is a different Access application than the staff pages`);
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
