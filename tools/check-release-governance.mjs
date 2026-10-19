import fs from 'node:fs';
import { approvedBy, ROBERT, WAYNE } from './release-policy.mjs';
const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
const repository = process.env.GITHUB_REPOSITORY;
const number = event.pull_request?.number || event.issue?.number || event.inputs?.pull_request;
if (!/^\d+$/.test(String(number))) throw new Error('A pull request number is required.');
const prefix = `/repos/${repository}`;
async function api(path) {
  const response = await fetch(`https://api.github.com${path}`, { headers: { Authorization: `Bearer ${process.env.GH_TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' } });
  if (!response.ok) throw new Error(`GitHub API ${response.status}: ${path}`);
  return response.json();
}
async function pages(path) {
  const all = [];
  for (let page = 1; ; page++) {
    const items = await api(`${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
    all.push(...items);
    if (items.length < 100) return all;
  }
}
const pr = await api(`${prefix}/pulls/${number}`);
if (pr.state !== 'open') { console.log('Pull request is closed; no merge to authorize.'); process.exit(0); }
if (!['beta', 'main'].includes(pr.base.ref)) throw new Error('Only beta and main use this release policy.');
if (pr.base.ref === 'beta') {
  console.log('Beta accepts agent changes without human or AI approval evidence; deployment tests still run.');
  process.exit(0);
}
if (pr.draft) throw new Error('Mark the pull request ready for review first.');
// Robert's own same-repository PRs are exempt from the faculty approval process.
// Use the authenticated GitHub PR author, never commit metadata or body text.
if (pr.user?.login?.toLowerCase() === ROBERT.toLowerCase() && pr.head.repo?.full_name === repository) {
  console.log('Robert-authored PR: faculty approval gate does not apply; build/test checks remain required.');
  process.exit(0);
}
const sha = pr.head.sha;
const reviews = await pages(`${prefix}/pulls/${number}/reviews`);
if (!approvedBy(reviews, WAYNE, sha)) throw new Error('Wayne must approve this exact commit before it is merged. Have the AI open the PR so Wayne can review it.');
if (pr.base.ref === 'main') {
  if (pr.head.repo?.full_name !== repository || pr.head.ref !== 'beta') throw new Error('Production promotion must be a beta-to-main PR.');
  const beta = await api(`${prefix}/git/ref/heads/beta`);
  if (sha !== beta.object.sha) throw new Error('Promotion must use the current beta commit.');
  const runs = await api(`${prefix}/actions/workflows/beta.yml/runs?branch=beta&per_page=100`);
  const run = runs.workflow_runs.find(run => run.head_sha === sha);
  if (!run || run.status !== 'completed' || run.conclusion !== 'success') throw new Error('The exact beta commit must finish its test, deployment and live verification successfully before promotion.');
}
console.log(`Production PR #${number}, ${sha}: Wayne approved the exact tested beta commit.`);
