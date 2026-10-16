// Publish on the current PR head AND its test merge commit: GitHub may require
// the latter when pull_request build checks run on the synthetic merge. Comment
// and pull_request_target events otherwise attach their job to the base SHA.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const number = event.pull_request?.number || event.issue?.number || event.inputs?.pull_request;
if (!/^\d+$/.test(String(number))) throw new Error('A pull request number is required.');
const prefix = `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}`;
async function api(path, body) {
  const response = await fetch(`${prefix}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${process.env.GH_TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) throw new Error(`GitHub status API failed (${response.status}).`);
  return response.json();
}
const pr = await api(`/pulls/${number}`);
if (pr.state !== 'open' || !['beta', 'main'].includes(pr.base.ref)) process.exit(0);
const sha = pr.head.sha;
const targets = [...new Set([sha, pr.merge_commit_sha].filter(Boolean))];
const status = (state, description) => Promise.all(targets.map(target => api(`/statuses/${target}`, {
  state, context: 'CTS release approval', description,
  target_url: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
})));
await status('pending', 'Checking content boundaries and review evidence.');
const result = spawnSync(process.execPath, ['tools/check-release-governance.mjs'], { stdio: 'inherit' });
// Another push during API reads must never authorize the replacement commit.
const current = await api(`/pulls/${number}`);
if (current.head.sha !== sha || current.base.sha !== pr.base.sha || current.merge_commit_sha !== pr.merge_commit_sha || !pr.merge_commit_sha) {
  await status('failure', 'The branch or test merge changed; recheck the current commit.');
  process.exit(1);
}
const passed = !result.error && result.status === 0;
await status(passed ? 'success' : 'failure', passed ? 'Required reviews and content boundaries verified.' : 'Review evidence or required human approval is missing.');
process.exit(passed ? 0 : 1);
