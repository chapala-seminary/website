// One-time administrator setup, not part of deployment. Preview by default.
// --apply: open beta to agents; keep native production review.
// --apply --checks: additionally require production tests and release approval.
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
    required_status_checks: branch === 'main' ? required : null,
    enforce_admins: true,
    required_pull_request_reviews: branch === 'beta' ? null : {
      dismiss_stale_reviews: true, require_code_owner_reviews: false,
      // Keep the PR requirement; the required status enforces actor-specific
      // approval. A generic one-review rule incorrectly blocks Robert's own PRs.
      required_approving_review_count: 0,
      dismissal_restrictions: { users: [ROBERT, WAYNE], teams: [] },
      bypass_pull_request_allowances: { users: [ROBERT], teams: [], apps: [] },
    },
    restrictions: { users, teams: [], apps: [] },
    required_linear_history: false, allow_force_pushes: false, allow_deletions: false,
    required_conversation_resolution: true,
  };
  console.log(`${apply ? 'Applying' : 'Preview'} ${branch}: ${branch === 'beta' ? 'agent pushes, no review gate; tests run before publication' : 'PR required; actor-specific approval via release check; Robert review bypass; ' + (checks ? 'build and release checks required' : 'required checks not activated')}; allowed: ${users.join(', ')}.`);
  if (apply) {
    api(`repos/${repo}/branches/${branch}/protection`, config);
    const actual = api(`repos/${repo}/branches/${branch}/protection`);
    if (!actual.enforce_admins?.enabled || actual.allow_force_pushes?.enabled || actual.allow_deletions?.enabled)
      throw new Error(`Protection verification failed on ${branch}.`);
    if (branch === 'beta') {
      if (actual.required_pull_request_reviews || actual.required_status_checks)
        throw new Error('Beta must allow agent pushes without PR approval or pre-push checks.');
    } else {
      const review = actual.required_pull_request_reviews;
      if (review?.required_approving_review_count !== 0 || review.require_code_owner_reviews || !review.dismiss_stale_reviews)
        throw new Error('Production review verification failed.');
      if (review.bypass_pull_request_allowances?.users?.map(user => user.login.toLowerCase()).join(',') !== ROBERT.toLowerCase())
        throw new Error('Robert-only review bypass verification failed.');
      if (checks && (!actual.required_status_checks?.strict || actual.required_status_checks.checks.map(check => `${check.context}:${check.app_id}`).sort().join(',') !== required.checks.map(check => `${check.context}:${check.app_id}`).sort().join(',')))
        throw new Error('Production required-check verification failed.');
    }
    if (actual.restrictions.users.map(user => user.login.toLowerCase()).sort().join(',') !== users.map(user => user.toLowerCase()).sort().join(','))
      throw new Error(`Push restriction verification failed on ${branch}.`);
  }
}
if (!botCanPush) console.log('Agent has no Write access; it is excluded from beta until the invitation is accepted. Rerun --apply --checks after access is ready.');
