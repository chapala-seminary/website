import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isContentChange, reviewEvidence, approvedBy } from '../tools/release-policy.mjs';
import { checkProduction } from '../tools/check-production-release.mjs';
const jsonChange = (before, after, filename = 'src/content/units/CTS/1.json') => ({ filename, status: 'modified', before: JSON.stringify(before), after: JSON.stringify(after) });
test('question edits are content; JSON scripts, pass rules, unknown fields and new course wiring are technical', () => {
  const unit = { course: 'ots', scripts: ['cts-engine.js'], pass: 90, mc: [{ stem: 'Old wording' }] };
  assert.equal(isContentChange(jsonChange(unit, { ...unit, mc: [{ stem: 'Revised wording' }] })), true);
  for (const update of [{ scripts: ['other.js'] }, { pass: 50 }, { newPolicy: true }, { course: 'different' }])
    assert.equal(isContentChange(jsonChange(unit, { ...unit, ...update })), false);
  assert.equal(isContentChange({ filename: 'src/content/units/CTS/2.json', status: 'added', after: '{}' }), false);
});
test('unknown paths, removed files, renamed files and executable content require Robert', () => {
  for (const filename of ['worker/api.js', 'wrangler.jsonc', '.github/workflows/bypass.yml', 'src/data/grading-policy.json'])
    assert.equal(isContentChange({ filename, status: 'modified' }), false);
  for (const status of ['removed', 'renamed'])
    assert.equal(isContentChange({ filename: 'docs/readers/example.md', status, after: 'Text' }), false);
  for (const after of ['<script>alert(1)</script>', '<p onclick="run()">Text</p>', '<a href="javascript:run()">Text</a>', '<iframe src="https://example.org"></iframe>'])
    assert.equal(isContentChange({ filename: 'docs/readers/example.md', status: 'modified', after }), false);
});
test('offline packets and prose are content; malformed banks fail closed', () => {
  assert.equal(isContentChange({ filename: '_review/swahili/OTS.pdf', status: 'added' }), true);
  assert.equal(isContentChange({ filename: 'docs/readers/new.md', status: 'added', after: 'Academic reading' }), true);
  assert.equal(isContentChange({ filename: 'src/data/readings/genesisreadings.bank.json', status: 'modified', before: '{}', after: '{bad' }), false);
});


test('legacy reader text can change while scripts, attributes and markup remain frozen', () => {
  const filename = 'public/CTS_OTS_Source_digest.html';
  const before = '<html><head><style>p {color:black}</style><script>boot()</script></head><body><p title="A > B">Old wording</p></body></html>';
  assert.equal(isContentChange({ filename, status: 'modified', before, after: before.replace('Old wording', 'Revised translation') }), true);
  for (const after of [before.replace('boot()', 'otherCode()'), before.replace('color:black', 'display:none'), before.replace('A > B', 'A > B" onclick="run()'), before.replace('Old wording', '<iframe src="https://other.test"></iframe>'), before.replace('<p ', '<p onclick="run()" '), before.replace('<script>boot()</script>', '').replace('</body>', '<script>boot()</script></body>')])
    assert.equal(isContentChange({ filename, status: 'modified', before, after }), false);
  assert.equal(isContentChange({ filename, status: 'added', after: before }), false);
});

test('accepted answer maps are academic data; grading settings cannot be smuggled into them', () => {
  const filename = 'src/data/readings/biblereadings.accept.json';
  assert.equal(isContentChange({ filename, status: 'modified', after: JSON.stringify({ 1: { en: ['measure'], es: ['norma'] } }) }), true);
  assert.equal(isContentChange({ filename, status: 'modified', after: JSON.stringify({ passing_score: 2 }) }), false);
  assert.equal(isContentChange({ filename, status: 'modified', after: JSON.stringify({ 1: { en: { code: 'execute' } } }) }), false);
});

test('AI review evidence needs both real links and the exact current commit', () => {
  const sha = 'a'.repeat(40);
  const body = `Review commit: ${sha}\nChatGPT review: https://chatgpt.com/share/real-review\nClaude review: https://claude.ai/share/real-review`;
  assert.equal(reviewEvidence(body, sha), true);
  assert.equal(reviewEvidence(body, 'b'.repeat(40)), false);
  assert.equal(reviewEvidence(body.replace('Claude review:', 'Other:'), sha), false);
  assert.equal(reviewEvidence(body.replace('https://claude.ai/share/real-review', 'https://example.com/review'), sha), false);
});
test('human approvals must cover this SHA and cannot outlive a requested change or dismissal', () => {
  const review = { id: 1, user: { login: 'satoshisound' }, state: 'APPROVED', commit_id: 'head' };
  assert.equal(approvedBy([review], 'satoshisound', 'head'), true);
  assert.equal(approvedBy([review], 'satoshisound', 'other'), false);
  assert.equal(approvedBy([review], 'ChapalaTheological1', 'head'), false);
  for (const state of ['CHANGES_REQUESTED', 'DISMISSED'])
    assert.equal(approvedBy([review, { ...review, id: 2, state }], 'satoshisound', 'head'), false);
  assert.equal(approvedBy([review, { ...review, id: 2, state: 'COMMENTED' }], 'satoshisound', 'head'), true);
});
test('production verification accepts only the exact build stamp and healthy public site', async () => {
  const expected = '2026-10-16 abcdef1';
  const response = (body, status = 200) => new Response(body, { status });
  const passing = async url => url.includes('/version.txt') ? response(expected) : response('{"ok":true}');
  await checkProduction(expected, passing, async () => {});
  for (const invalid of [async () => response('old release'), async () => response('challenge', 403), async url => url.includes('/version.txt') ? response(expected) : response('{"ok":false}')])
    await assert.rejects(checkProduction(expected, invalid, async () => {}));
});

test('production guard rejects dirty, wrong-branch and outdated checkouts before deployment', async () => {
  const { mkdtempSync, writeFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join, resolve } = await import('node:path');
  const { execFileSync } = await import('node:child_process');
  const root = mkdtempSync(join(tmpdir(), 'cts-production-guard-'));
  const git = (cwd, ...args) => execFileSync('git', args, { cwd, stdio: 'pipe' }).toString().trim();
  try {
    git(root, 'init', '--bare', 'origin.git');
    git(root, 'init', '-b', 'main', 'writer');
    const writer = join(root, 'writer'), remote = join(root, 'origin.git');
    git(writer, 'config', 'user.email', 'fixture@example.invalid');
    git(writer, 'config', 'user.name', 'Guard fixture');
    writeFileSync(join(writer, 'release.txt'), 'initial');
    git(writer, 'add', 'release.txt'); git(writer, 'commit', '-m', 'initial');
    git(writer, 'remote', 'add', 'origin', remote); git(writer, 'push', '-u', 'origin', 'main');
    git(root, 'clone', '--branch', 'main', remote, 'candidate');
    const candidate = join(root, 'candidate');
    const script = resolve('tools/verify-production-branch.mjs');
    const env = { ...process.env, GITHUB_ACTIONS: 'false' };
    const verify = () => execFileSync(process.execPath, [script], { cwd: candidate, env, stdio: 'pipe' });
    assert.match(verify().toString(), /matches the current/);
    writeFileSync(join(candidate, 'untracked.txt'), 'dirty');
    assert.throws(verify, /clean, committed/);
    rmSync(join(candidate, 'untracked.txt'));
    git(candidate, 'switch', '-c', 'beta');
    assert.throws(verify, /must come from main/);
    git(candidate, 'switch', 'main');
    writeFileSync(join(writer, 'release.txt'), 'new main');
    git(writer, 'add', 'release.txt'); git(writer, 'commit', '-m', 'advance main'); git(writer, 'push');
    assert.throws(verify, /current origin\/main commit/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('governance API flow requires exact human approvals and tested beta promotion; status targets PR head', async () => {
  const { mkdtempSync, writeFileSync, rmSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { spawnSync } = await import('node:child_process');
  const root = mkdtempSync(join(tmpdir(), 'cts-governance-api-'));
  try {
    const sha = 'a'.repeat(40), repo = 'chapala-seminary/website';
    const evidence = `Review commit: ${sha}\nChatGPT review: https://chatgpt.com/share/review\nClaude review: https://claude.ai/share/review`;
    const review = login => ({ id: login === 'satoshisound' ? 2 : 1, user: { login }, state: 'APPROVED', commit_id: sha });
    const eventPath = join(root, 'event.json');
    writeFileSync(eventPath, JSON.stringify({ pull_request: { number: 23 } }));
    const run = (change = {}, wrapper = false) => {
      const fixture = {
        pr: { merge_commit_sha: 'b'.repeat(40), state: 'open', draft: false, changed_files: 1, body: evidence, base: { ref: 'beta', sha: 'base' }, head: { sha, ref: 'content-edit', repo: { full_name: repo } } },
        files: [{ filename: 'docs/readers/example.md', status: 'modified' }],
        reviews: [review('ChapalaTheological1')],
        beta: { object: { sha } },
        runs: { workflow_runs: [{ head_sha: sha, status: 'completed', conclusion: 'success' }] },
        ...change,
      };
      const loader = `const fixture = ${JSON.stringify(fixture)};
        globalThis.fetch = async (url, options = {}) => {
          const path = new URL(url).pathname;
          let data;
          if (path.includes('/statuses/')) { const status = JSON.parse(options.body); console.log('status:' + status.state + ':' + path.split('/').at(-1)); data = {}; }
          else if (path.endsWith('/pulls/23/files')) data = fixture.files;
          else if (path.endsWith('/pulls/23/reviews')) data = fixture.reviews;
          else if (path.endsWith('/pulls/23')) data = fixture.pr;
          else if (path.includes('/contents/')) data = { type: 'file', encoding: 'base64', size: 16, content: Buffer.from('Academic prose').toString('base64') };
          else if (path.endsWith('/git/ref/heads/beta')) data = fixture.beta;
          else if (path.endsWith('/actions/workflows/beta.yml/runs')) data = fixture.runs;
          else throw new Error('Unexpected API request ' + path);
          return new Response(JSON.stringify(data), { status: 200 });
        };`;
      const preloader = `data:text/javascript,${encodeURIComponent(loader)}`;
      return spawnSync(process.execPath, [wrapper ? 'tools/publish-release-governance.mjs' : 'tools/check-release-governance.mjs'], {
        encoding: 'utf8', env: { ...process.env, NODE_OPTIONS: `--import=${preloader}`, GITHUB_EVENT_PATH: eventPath, GITHUB_REPOSITORY: repo, GH_TOKEN: 'fixture-only', GITHUB_SERVER_URL: 'https://github.com', GITHUB_RUN_ID: '123' },
      });
    };
    const content = run(); assert.equal(content.status, 0, content.stderr);
    assert.notEqual(run({ reviews: [] }).status, 0);
    const tech = { files: [{ filename: 'worker/api.js', status: 'modified' }] };
    assert.notEqual(run(tech).status, 0);
    assert.equal(run({ ...tech, reviews: [review('ChapalaTheological1'), review('satoshisound')] }).status, 0);
    const mainPR = { merge_commit_sha: 'b'.repeat(40), state: 'open', draft: false, changed_files: 1, body: evidence, base: { ref: 'main', sha: 'base' }, head: { sha, ref: 'beta', repo: { full_name: repo } } };
    assert.equal(run({ pr: mainPR }).status, 0);
    assert.notEqual(run({ pr: mainPR, runs: { workflow_runs: [{ head_sha: sha, status: 'completed', conclusion: 'failure' }] } }).status, 0);
    assert.notEqual(run({ pr: mainPR, beta: { object: { sha: 'new-beta' } } }).status, 0);
    assert.notEqual(run({ pr: { ...mainPR, head: { ...mainPR.head, ref: 'unreviewed-feature' } } }).status, 0);
    const ownPR = { ...mainPR, user: { login: 'satoshisound' }, body: '', head: { ...mainPR.head, ref: 'robert-code' } };
    assert.equal(run({ pr: ownPR, ...tech, reviews: [] }).status, 0);
    for (const login of ['ChapalaTheological1', 'chapalatheological-ai'])
      assert.notEqual(run({ pr: { ...ownPR, user: { login } }, ...tech, reviews: [] }).status, 0);
    assert.notEqual(run({ pr: { ...ownPR, head: { ...ownPR.head, repo: { full_name: 'other/fork' } } }, reviews: [] }).status, 0);
    const published = run({}, true);
    assert.equal(published.status, 0, published.stderr);
    assert.match(published.stdout, new RegExp(`status:pending:${sha}`));
    assert.match(published.stdout, new RegExp(`status:success:${sha}`));
    assert.match(published.stdout, new RegExp(`status:success:${'b'.repeat(40)}`));
    const rejected = run({ reviews: [] }, true);
    assert.notEqual(rejected.status, 0);
    assert.match(rejected.stdout, new RegExp(`status:failure:${sha}`));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('the actual workflow resolver refuses policy from an unprotected PR base before checkout', async () => {
  const { readFileSync, mkdtempSync, writeFileSync, chmodSync, rmSync, existsSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { spawnSync } = await import('node:child_process');
  const { parse } = await import('yaml');
  const workflow = parse(readFileSync('.github/workflows/release-governance.yml', 'utf8'));
  const script = workflow.jobs.governance.steps.find(step => step.id === 'policy').run;
  const root = mkdtempSync(join(tmpdir(), 'cts-policy-resolver-'));
  try {
    const fake = join(root, 'gh'), output = join(root, 'output');
    writeFileSync(fake, '#!/bin/sh\nprintf "%s\\n" "$CTS_FIXTURE_POLICY"\n'); chmodSync(fake, 0o755);
    const run = (branch, sha = 'a'.repeat(40), number = '23') => {
      rmSync(output, { force: true });
      return spawnSync('bash', ['-e', '-c', script], { encoding: 'utf8', env: {
        ...process.env, PATH: `${root}:${process.env.PATH}`, GITHUB_OUTPUT: output,
        GITHUB_REPOSITORY: 'chapala-seminary/website', CTS_PR_NUMBER: number,
        CTS_FIXTURE_POLICY: `${branch}\t${sha}`,
      } });
    };
    for (const branch of ['beta', 'main']) {
      assert.equal(run(branch).status, 0);
      assert.equal(readFileSync(output, 'utf8').trim(), `ref=${'a'.repeat(40)}`);
    }
    for (const branch of ['attacker-base', 'main/other', 'refs/heads/main']) {
      assert.notEqual(run(branch).status, 0);
      assert.equal(existsSync(output), false);
    }
    assert.notEqual(run('main', 'not-a-commit').status, 0);
    assert.notEqual(run('main', 'a'.repeat(40), '23; echo unsafe').status, 0);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
