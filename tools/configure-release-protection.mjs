// One-time administrator setup, not part of deployment. Preview by default.
// --apply: require human review now, without depending on uninstalled checks.
// --apply --checks: activate required checks after policy is on both branches.
import { execFileSync } from 'node:child_process';
import { ROBERT, WAYNE, BOT } from './release-policy.mjs';
const repo = 'chapala-seminary/website';
const apply = process.argv.includes('--apply');
const checks = process.argv.includes('--checks');
const api = (path, body) => JSON.parse(execFileSync('gh', ['api', path, ...(body ? ['--method', 'PUT', '--input', '-'] : [])], {
  encoding: 'utf8', ...(body ? { input: JSON.stringify(body) } : {}),
}));
const bot = api(`repos/${repo}/collaborators/${BOT}/permission`);
const botCanPush = Boolean(bot.user?.permissions?.push);
const required = checks ? { strict: true, checks: [
  { context: 'CTS build and tests', app_id: 15368 },
  { context: 'CTS release approval', app_id: 15368 },
] } : null;
if (checks) {
  for (const branch of ['beta', 'main'])
    for (const path of ['.github/CODEOWNERS', '.github/workflows/pr-checks.yml', '.github/workflows/release-governance.yml', 'tools/check-release-governance.mjs', 'tools/publish-release-governance.mjs', 'tools/release-policy.mjs'])
      api(`repos/${repo}/contents/${path}?ref=${branch}`);
}
for (const branch of ['beta', 'main']) {
  const users = [ROBERT, WAYNE, ...(branch === 'beta' && botCanPush ? [BOT] : [])];
  const config = {
    required_status_checks: required,
    enforce_admins: true,
    required_pull_request_reviews: {
      dismiss_stale_reviews: true, require_code_owner_reviews: true,
      required_approving_review_count: 1,
      dismissal_restrictions: { users: [ROBERT, WAYNE], teams: [] },
      bypass_pull_request_allowances: { users: [ROBERT], teams: [], apps: [] },
    },
    restrictions: { users, teams: [], apps: [] },
    required_linear_history: false, allow_force_pushes: false, allow_deletions: false,
    required_conversation_resolution: true,
  };
  console.log(`${apply ? 'Applying' : 'Preview'} ${branch}: human PR/Code Owner review (Robert has a named review bypass), stale approvals dismissed, push/merge restricted to ${users.join(', ')}; ${checks ? 'both release checks required' : 'bootstrap: no required check names yet'}.`);
  if (apply) {
    api(`repos/${repo}/branches/${branch}/protection`, config);
    const actual = api(`repos/${repo}/branches/${branch}/protection`);
    if (!actual.enforce_admins?.enabled || actual.required_pull_request_reviews?.required_approving_review_count !== 1 || !actual.required_pull_request_reviews?.require_code_owner_reviews || actual.allow_force_pushes?.enabled || actual.allow_deletions?.enabled)
      throw new Error(`Protection verification failed on ${branch}.`);
    if (!actual.required_pull_request_reviews?.dismiss_stale_reviews || !actual.required_conversation_resolution?.enabled)
      throw new Error(`Stale-review/conversation protection verification failed on ${branch}.`);
    if (actual.required_pull_request_reviews?.bypass_pull_request_allowances?.users?.map(user => user.login.toLowerCase()).join(',') !== ROBERT.toLowerCase())
      throw new Error(`Robert-only review bypass verification failed on ${branch}.`);
    if (checks && (!actual.required_status_checks?.strict || actual.required_status_checks.checks.map(check => `${check.context}:${check.app_id}`).sort().join(',') !== required.checks.map(check => `${check.context}:${check.app_id}`).sort().join(',')))
      throw new Error(`Required-check verification failed on ${branch}.`);
    if (actual.restrictions.users.map(user => user.login.toLowerCase()).sort().join(',') !== users.map(user => user.toLowerCase()).sort().join(','))
      throw new Error(`Push restriction verification failed on ${branch}.`);
  }
}
if (!botCanPush) console.log('Agent has no Write access; it is excluded from beta until the invitation is accepted. Rerun --apply --checks after access is ready.');
