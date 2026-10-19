// Exercise the harness's actual setup and exit traps in disposable Git checkouts.
// A passing suite must not dirty beta before the guarded deployment.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';

const root = process.cwd();
const source = fs.readFileSync(process.argv[2] || 'test/run-tests.sh', 'utf8');
const start = source.indexOf('HAVE_REFERENCE=\n');
const end = source.indexOf('# The local database', start);
assert.ok(start >= 0 && end > start, 'reference setup is present');
const setup = source.slice(start, end);
const serverTrap = source.split('\n').find(l => l.startsWith("trap 'kill $DEV $SHADOW_PID"));
assert.ok(serverTrap, 'server cleanup trap is present');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'cts-reference-'));
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
let checks = 0;
try {
  for (const history of [true, false]) {
    const cwd = path.join(scratch, history ? 'full' : 'shallow');
    if (history) {
      git(root, 'clone', '--shared', '--no-checkout', root, cwd);
      git(cwd, 'sparse-checkout', 'set', '--no-cone', '/_reference-index.html', '/.gitignore');
      git(cwd, 'checkout', 'HEAD');
    } else {
      fs.mkdirSync(cwd);
      git(cwd, 'init', '-q');
      fs.writeFileSync(path.join(cwd, '.gitignore'), 'dist/\n.wrangler-local/\n');
      fs.writeFileSync(path.join(cwd, '_reference-index.html'), 'tracked fixture\n');
      git(cwd, 'add', '.gitignore', '_reference-index.html');
      git(cwd, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'fixture');
    }
    const file = path.join(cwd, '_reference-index.html');
    for (const edited of [false, true]) {
      if (edited) fs.appendFileSync(file, 'local work must survive\n');
      const before = fs.readFileSync(file, 'utf8');
      const status = git(cwd, 'status', '--porcelain');
      for (const server of [false, true]) for (const code of [0, 7]) {
        fs.mkdirSync(path.join(cwd, '.wrangler-local'), { recursive: true });
        fs.mkdirSync(path.join(cwd, 'dist'), { recursive: true });
        for (const f of ['synctest.html', 'syncdown.html', '_reference-index.html']) fs.writeFileSync(path.join(cwd, 'dist', f), 'temporary');
        const shell = `set -eu\nSTATE=.wrangler-local\n${setup}\nprintf '%s' "$HAVE_REFERENCE" > "$STATE/have-ref"\n${server ? `DEV=0\nSHADOW_PID=0\nkill() { return 0; }\n${serverTrap}` : ''}\nexit ${code}\n`;
        const result = spawnSync('bash', ['-c', shell], { cwd, encoding: 'utf8' });
        assert.equal(result.status, code, result.stderr);
        assert.equal(fs.readFileSync(file, 'utf8'), before, 'exit cleanup changed the tracked reference');
        assert.equal(git(cwd, 'status', '--porcelain'), status, 'harness dirtied the checkout');
        assert.equal(fs.readFileSync(path.join(cwd, '.wrangler-local/have-ref'), 'utf8'), history ? '1' : '');
        for (const f of ['synctest.html', 'syncdown.html', '_reference-index.html']) assert.ok(!fs.existsSync(path.join(cwd, 'dist', f)), 'temporary fixture leaked');
        if (history) assert.ok(fs.statSync(path.join(cwd, '.wrangler-local/ref.html')).size > 0, 'catalog reference missing');
        checks++;
      }
    }
  }
} finally { fs.rmSync(scratch, { recursive: true, force: true }); }
console.log(`PASS — ${checks} reference setup/cleanup cases: clean and edited files, both traps, success and failure, with and without history.`);
