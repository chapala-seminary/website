# Independent beta work and production promotion

## Daily workflow

1. Use the separate `chapalatheological-ai` account with repository Write access.
   Start from current beta. Push content or code directly to `beta`, or merge a
   beta PR without human review. No dual-AI agreement links are required.
2. The beta Action builds, runs the complete suite, deploys to the separate beta
   Worker/database and verifies the published version and activation policy.
   Failed builds/tests block publication. Check the exact release stamp and
   affected journeys on beta; a failed final probe can follow an actual deploy.
3. When ready, the agent opens `beta` -> `main`. Wayne checks beta and approves
   the exact current commit using `ChapalaTheological1`, then merges. Robert
   review is not required, including for technical changes. New commits need
   fresh tests and Wayne approval. The agent cannot push or merge main.
4. Main Actions tests again and deploys when production auto-deployment has been
   enabled and its environment token is installed. Preserve approved activation
   dates, grading modes and prior student progress.

Robert's `satoshisound` account can approve any PR at its exact current commit,
including technical changes from feature branches or forks. His own PRs need no
second reviewer, regardless of source repository. GitHub does not allow formal
self-approval. Keep his native PR bypass; build/test checks still apply. Wayne and the AI have no production
review bypass. Have the agent open promotions: GitHub does not allow Wayne to
approve a PR authored by his own account.

## Branch settings

Beta allows Robert, Wayne and the Write-enabled AI to push, with no required
PR reviews or pre-push status checks. Its push workflow performs tests before
publication. Force pushes/deletion remain disabled. Production allows only
Robert/Wayne to merge, requires a PR and resolved conversations, and dismisses stale approvals.
Native approval count is zero: the required release-status check enforces
Wayne/Robert approval with Robert's own-PR exception. A generic one-approval
rule creates a misleading self-review blocker and must not be restored. Code Owner approval is not required. The trusted-base
release checker requires Wayne's exact-commit approval and the current beta's
successful deployment run; it does not require Robert or AI-review links.

After this policy is installed on both branches, an administrator runs:

```sh
node tools/configure-release-protection.mjs --apply --checks
```

This enables `CTS build and tests` and `CTS release approval` on main only.
`--apply` without `--checks` installs native rules during rollout; no flags
previews the settings. Do not use the old setup tool, which restores beta reviews
and mandatory Robert review. Synchronize production policy updates back to beta.

## Credentials and first production activation

Use `chapalatheological-ai`, never Wayne's human administrator identity. For
CLI access, `gh api user --jq .login` must show the AI account. Use a fine-grained
token restricted to this repository with Contents and Pull requests read/write,
metadata read, and optional Actions/check read. Grant no Administration or
Workflows access. Keep tokens in the credential store/integration, not files/chat.

Use branch-restricted deployment environments: `beta` permits beta only;
`production` permits main only. Store `CTS_BETA_CLOUDFLARE_API_TOKEN` and
`CTS_PRODUCTION_CLOUDFLARE_API_TOKEN` in their respective environments, scoped
to the CTS Cloudflare account and existing deployment commands. Rotate the old
beta repository token into the beta environment and remove its repository copy.
An agent with Write can otherwise create a workflow that reads repository secrets.

Production automation remains disabled while
`CTS_PRODUCTION_AUTODEPLOY_ENABLED=false`. Installing this policy does not
publish production. Verify the approved production baseline and activation date,
install its environment token, then set the variable to `true` to enable future
main deployments. No local Mac is required after activation.

GitHub branch checks and human reviews are operational safeguards; repository
writers can create workflows/statuses, and administrators can change settings.
Keep production credentials scoped to its main-only environment.
