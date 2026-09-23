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

/* Beta must not write to the students' table. */
const db = (c) => c?.d1_databases?.[0]?.database_name;
ok(db(prod) && db(prod.env?.beta) && db(prod) !== db(prod.env.beta),
  'beta has a database of its own, so testing it cannot touch real records',
  `production: ${db(prod)}, beta: ${db(prod.env?.beta)}`);

const placeholders = [prod, prod.env?.beta].filter(Boolean)
  .filter((c) => /PUT-THE|REPLACE/i.test(c.d1_databases?.[0]?.database_id || ''));

console.log(`${checks} assertions on the deployment configuration`);
if (placeholders.length)
  console.log(`  note: ${placeholders.length} database id(s) are still placeholders — `
    + '`wrangler d1 create` prints the real ones. docs/cutover.md has the order.');
if (!fails.length) console.log('PASS — what is tested and what is deployed answer requests the same way.');
else { console.log(`FAIL — ${fails.length}:`); fails.forEach(f => console.log('  ' + f)); process.exitCode = 1; }
