# Content release access and enforcement

## GitHub safeguards and their limits

Protect both branches: require PRs, one approving review, Code Owner review,
dismiss stale approvals, resolved review conversations, and no force pushes or
deletion, including for administrators. Required checks are `CTS build and tests`
and `CTS release approval`. Main allows merges only by `satoshisound` and
`ChapalaTheological1`; beta additionally allows `chapalatheological-ai` once it
has Write access. Only `satoshisound` has a named PR-review bypass. His own same-repository PRs
are exempt from the faculty/AI approval check, while build/test checks still
apply. `ChapalaTheological1` and `chapalatheological-ai` have no bypass.

The governance workflow reads policy from the trusted base branch, never runs
PR code with its token, checks the entire file list and publishes its status on
the current PR head and its GitHub's temporary test merge. Review submissions rerun it; after updating evidence or a
missed review event, comment on the PR or use its manual Run workflow input.
A new push invalidates review evidence and approvals for the previous commit. After a
production promotion, synchronize main back into beta through a reviewed PR
before the next change so strict branch checks remain up to date. For main, it
also requires the exact beta SHA's successful deployment workflow.

GitHub can check named human approvals, file ownership, tests, and recorded
review links. It cannot prove that ChatGPT and Claude actually performed the
reviews or agreed. Wayne checks the linked evidence. This is an operational
review gate, not isolation from a malicious repository writer: a writer can
create other Actions workflows/statuses, and org administrators can change
settings. Keep the agent's account and credentials separate, grant no admin
rights or bypass, and protect deployment credentials with branch-restricted
environments. Stronger independent AI identity enforcement would require
separate authenticated reviewer integrations.

## Wayne's agent access and deployment secrets

1. Keep `ChapalaTheological1` for Wayne's own reviews and production merges.
   Do not sign the AI into this administrator account or share its token.
2. Before granting the agent Write, put fresh deployment tokens in the `beta`
   and `production` GitHub environments (Settings -> Environments). Their
   deployment branch policies allow only `beta` and `main`, respectively.
   Store `CTS_BETA_CLOUDFLARE_API_TOKEN` in beta and
   `CTS_PRODUCTION_CLOUDFLARE_API_TOKEN` in production. Limit each Cloudflare
   token to the CTS account and the Workers/routes, account/zone read, D1 and
   other permissions required by the existing deploy command. Do not reuse a
   personal multi-account token. The Actions environment supplies credentials;
   Wayne and the AI never need them in a local session.
3. The old beta token is currently a repository secret. Rotate it into the
   branch-restricted beta environment, then remove the repository-level copy.
   Do this before granting Write: branch restrictions alone do not prevent a
   writer creating another workflow that reads a repository secret.
4. In Settings -> Collaborators and teams, invite `chapalatheological-ai` with
   **Write**, not Maintain or Admin. Accept the invitation while signed into
   that account. After the invitation is accepted, add the agent to beta's protected-branch
   allowed-push list by rerunning the protection command below. It never adds
   the agent to main's allowed list.
5. Authenticate Claude's GitHub integration as `chapalatheological-ai`. For a
   terminal session, verify `gh api user --jq .login` prints that login. A
   fine-grained token should select only this repo, with Contents and Pull
   requests read/write and metadata read; omit Administration and Workflows.
   Read Actions/check results if the integration needs that permission. Store
   the token in the OS credential store or integration, never files or chat.
6. Claude creates and merges the approved content PR to beta. Wayne checks the
   deployed beta version and merges the approved promotion PR from his tablet.
   Any branch-protection refusal is resolved through review, not bypass.

## Initial rollout

The workflow, policy files and matching branch settings must be installed on
both beta and main before this process is fully active. After both setup PRs
are merged, an administrator runs the following from this repo:

```sh
node tools/configure-release-protection.mjs --apply --checks
```

 The script refuses
to require the checks until the policy files exist on both branches. Running
without `--apply` previews the settings. `--apply` without `--checks` installs
the initial human-review protections with Robert’s named exception. The initial setup PRs use native reviews with Robert’s named bypass; the base branch has no governance script yet, so its setup step
issues no `CTS release approval` status. Full enforcement starts after both PRs
are installed and the administrator activates the required checks. The initial main
installation is a narrowly scoped technical setup PR, not a promotion of all
pending beta work. During initial setup, enable only checks that already exist on
the protected branch; then add both required check names after installation.
Production auto-deployment starts disabled (`CTS_PRODUCTION_AUTODEPLOY_ENABLED`
repository variable is `false`). Current main is behind beta and must not be
published merely to install this workflow. After Robert approves and installs
the current production baseline on main, preserves its approved activation date,
and the production environment token is set, an administrator sets this variable
to `true` in Settings -> Secrets and variables -> Actions -> Variables. Future
main merges deploy automatically. Until then, the production job is skipped.
The existing beta repository secret remains usable during token migration; the
environment secret takes precedence once installed.
The Swahili pilot branch currently holds offline reviewer packets. Its eventual
site integration needs a fresh PR from current beta, with human language review;
any required new language engine wiring comes to Robert.

GitHub references: [required-check behavior](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks),
[deployment environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments),
and [secret scope and precedence](https://docs.github.com/en/actions/reference/security/secrets).
