/* execFileSync, for the tests that write to the suite's database while the
 * local Worker is serving.
 *
 * test/run-tests.sh runs the Worker (wrangler dev, persisted to
 * .wrangler-local/) and many tests change the same SQLite file from a second
 * process with `wrangler d1 execute`. SQLite turns one writer away while
 * another holds the lock: SQLITE_BUSY, "database is locked". That failed the
 * beta deploy run 43065946602 in test/answer-disclosure.test.mjs, with nothing
 * wrong in the site, and was seen locally in test/api.test.mjs.
 * test/legacy-sync-window.test.mjs already retried it on its own; this does
 * the same for every test, so a busy database is tried again and a real
 * failure says what wrangler said instead of printing bytes.
 *
 * A drop-in for node:child_process's execFileSync: any other command is
 * passed straight through, and the database command runs exactly as asked
 * except that its output is kept (never printed) where the caller had
 * discarded it, so a lock can be recognised.
 *
 *   import { execFileSync } from './lib/d1-exec.mjs';
 */
import { execFileSync as run } from 'node:child_process';

const isD1 = (args) => Array.isArray(args) && args.includes('d1') && args.includes('execute');
const BUSY = /SQLITE_BUSY|database is locked/i;

export function execFileSync(file, args, options) {
  if (!isD1(args)) return run(file, args, options);
  const opts = { ...(options || {}) };
  if (opts.stdio === 'ignore') opts.stdio = ['ignore', 'pipe', 'pipe'];
  for (let attempt = 1; ; attempt++) {
    try {
      return run(file, args, opts);
    } catch (e) {
      const said = `${e.stdout || ''}\n${e.stderr || ''}`;
      if (attempt < 6 && BUSY.test(said)) {
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 300 * attempt);
        continue;
      }
      e.message += `\n(attempt ${attempt}) wrangler said:\n${said.trim().split('\n').slice(-12).join('\n')}`;
      throw e;
    }
  }
}
