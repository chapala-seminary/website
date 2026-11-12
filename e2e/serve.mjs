#!/usr/bin/env node
/* The site the journey suite drives: the built Worker and a fresh local D1.
 *
 *   node e2e/serve.mjs            (Playwright starts this; see playwright.config.mjs)
 *
 * The same site test/run-tests.sh builds, on its own port and in its own
 * database folder, so the two suites never share state and can run side by
 * side. Every run starts from an empty database: every migration in order,
 * then the answer keys a deploy would load (docs/ai-grading.md, section 4).
 *
 * Needs dist/ (npm run build) and the private assessment keys
 * (ASSESSMENT_KEYS, or ../assessment-keys), as the main suite does.
 * The Worker's output goes to $E2E_STATE/dev.log, which CI keeps on failure.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
process.chdir(ROOT);
const PORT = Number(process.env.E2E_PORT || 8808);
const STATE = process.env.E2E_STATE || '.wrangler-e2e';
const CONFIG = 'test/wrangler.local.jsonc';

if (!fs.existsSync('dist/index.html')) { console.error("e2e: no dist/ -- run 'npm run build' first"); process.exit(2); }
// Never serve a build that carries answer keys: the journeys test the live site.
execFileSync('node', ['tools/verify-no-keys.mjs', 'dist'], { stdio: 'inherit' });

fs.rmSync(STATE, { recursive: true, force: true });
fs.mkdirSync(STATE, { recursive: true });
const d1 = (...args) => execFileSync('npx', ['wrangler', 'd1', 'execute', 'chapala-students', '--local',
  '--persist-to', STATE, '--config', CONFIG, ...args], { stdio: ['ignore', 'ignore', 'inherit'] });
// Every migration in order, as one file: one wrangler start instead of twenty.
const all = path.join(STATE, 'all-migrations.sql');
fs.writeFileSync(all, fs.readdirSync('migrations').filter((f) => f.endsWith('.sql')).sort()
  .map((m) => `-- ${m}\n${fs.readFileSync(path.join('migrations', m), 'utf8')}\n`).join('\n'));
d1('--file', all);
execFileSync('node', ['tools/sync-grading-keys.mjs', '--env', 'local', '--state', STATE], { stdio: ['ignore', 'ignore', 'inherit'] });

const log = fs.openSync(path.join(STATE, 'dev.log'), 'a');
// --inspector-port: wrangler's default (9229) would collide with the main
// suite's Worker if both run at once.
const dev = spawn('npx', ['wrangler', 'dev', '--config', CONFIG, '--port', String(PORT), '--ip', '127.0.0.1',
  '--inspector-port', String(PORT + 1000), '--persist-to', STATE, '--test-scheduled'],
  { stdio: ['ignore', log, log], detached: false });
console.log(`e2e: Worker starting on http://127.0.0.1:${PORT} (log: ${STATE}/dev.log)`);
const stop = () => { try { dev.kill('SIGTERM'); } catch {} };
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { stop(); process.exit(0); });
process.on('exit', stop);
dev.on('exit', (code) => {
  console.error(`e2e: the Worker exited (${code}); last lines of ${STATE}/dev.log:`);
  console.error(fs.readFileSync(path.join(STATE, 'dev.log'), 'utf8').split('\n').slice(-20).join('\n'));
  process.exit(code || 1);
});
