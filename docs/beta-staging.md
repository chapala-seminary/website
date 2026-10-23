# Beta staging and production promotion

## Production verification and Bot Fight Mode

Production already answers on
`https://chapala-seminary.chapalatheological.workers.dev`. Cloudflare's free
Bot Fight Mode can challenge GitHub's public-domain health request and cannot
make path-specific exceptions. Keep that protection enabled. The production
verifier may use the existing direct Worker hostname only after a confirmed
Cloudflare challenge or a network failure. It rechecks both the exact release
stamp and healthy JSON there; a real HTTP error, stale build or unhealthy
response still fails. Check the custom domain from a normal browser too.
The read-only **Diagnose production verification** Action can test the verifier
without redeploying. Per-version preview URLs remain disabled.

## Temporary CI unblock — Robert, 19 October 2026

On 19 Oct 2026 Robert promoted beta and deployed before the remaining CI
repairs, with the `CTS build and tests` merge check temporarily advisory on
main and a repository variable, `CTS_PRODUCTION_SKIP_TESTS`, that skipped the
production Action's full test suite. That bypass is removed (20 Oct 2026): the
production Action always runs `npm test` before it deploys, whatever the
variable says. Restore the required build/test merge check on main with the
governance setup script; `CTS release approval` and human-only main access
remain required.

Staging: https://beta.chapalaseminary.org — branch `beta`, Worker `chapala-seminary-beta`, database `chapala-students-beta`.
Production: https://chapalaseminary.org — branch `main`, Worker `chapala-seminary`, database `chapala-students`.

On beta, the full test harness keeps its historical catalog reference in
`.wrangler-local/ref.html` and serves a temporary copy from `dist/`. It must
leave the tracked root `_reference-index.html` unchanged, including on failure;
the deployment guard checks that the tested checkout is clean. The beta job
allows 75 minutes because the complete browser suite can take over 40 minutes
before publication begins.

## New work

Agents may push content or code to current `beta` directly, or use a PR when
that helps organize the change. No human review, Code Owner approval, Robert
approval or ChatGPT/Claude agreement links are required for beta. Keep changes
focused and run `npm run build && npm test`. The push workflow tests again
before publishing. Check the deployed version, health and affected journeys on
beta. Language drafts still need qualified faculty acceptance before production.

The beta Actions workflow runs a fresh build and the complete suite on each push, then uses the guarded publication step of `npm run deploy:beta`. A failed build or test prevents publication. The final public health probe runs after publication, so its failure can leave a published Worker while marking the workflow failed. Check the live `/version.txt` and deployment version before retrying; the probe reports its HTTP status and Cloudflare challenge state. It needs the `beta` environment Actions secret `CTS_BETA_CLOUDFLARE_API_TOKEN`, a deployment token limited to the CTS account `119b0919229edb3185b69f1c6bd04b66`, including Workers deployment/routes, account/zone read and D1 access needed by Wrangler. Set it through GitHub environment secret settings; do not put the value in files, PR descriptions or chat. Before build and test it checks out the private `chapala-seminary/assessment-keys` repo with repository secret `ASSESSMENT_KEYS_TOKEN` (read-only on that repo) and sets `ASSESSMENT_KEYS` when that checkout has `textbooks/`. Public textbook JSON no longer holds `answer`/`accept`, so that checkout is required for the suite and for deploy sync. The checkout step uses `continue-on-error`; a missing token fails later with a clear message. The deploy log should say textbook and reading keys came from the private checkout.

Publication and post-deploy verification now have separate Actions steps. CI uses
the guarded `deploy:beta:publish` part of `deploy:beta`, then verifies the exact
build stamp and all 71 activation dates (79 staged tests less the eight awaiting faculty review, Wayne 18 Oct 2026). The beta configuration explicitly enables
`workers_dev` for this fallback and disables unused version preview URLs.
Wrangler otherwise disables workers.dev when the custom route is present.
The Worker still verifies signed Access tokens on staff endpoints. Probe
errors identify the failing hostname, including a fallback failure. A challenged or unreachable custom
domain can be checked on the same Worker's direct hostname, with an explicit
warning that custom-domain browser acceptance remains pending. A wrong release,
bad activation policy or HTTP 500 still fails verification. The deployment and
probe outcomes are visible separately; check them before retrying a red run.

For a manual staging deployment, use a clean checkout of the exact published beta commit:

    git fetch origin
    git switch beta
    git pull --ff-only origin beta
    npm run build && npm test
    npm run deploy:beta

The beta deploy command verifies branch, published commit, clean working tree and the pinned Cloudflare account. It preserves the existing beta custom domain, separate D1 database, noindex guard, outreach off and digest off. Do not attach production records to beta or use real student records as fixtures.

## Review and promotion

For the Th.M., use the [15-course verification and promotion checklist](thm-15-course-audit.md).
Promote the complete browser/server requirement change and preserve valid prior
completions. The [individual substitution workflow](thm-study-plans.md) supports faculty-approved
plans across access, progress and issuance. It retains 15 actual CTS courses,
Systematic Theology, Preaching and the required exams. Configure the actual
applicant’s plan only after faculty supplies the five replacement choices.

Wayne checks the actual beta release and decides when it is ready. Code and
content follow the same staging process; no Robert review is required for
promotion. The production check requires Wayne's approval of the exact current
beta commit and a successful beta test/deployment/verification run. Pasted AI
review links are optional context, not a merge requirement. Code Owners are
advisory. Robert's exact-commit approval authorizes any PR, including feature/fork PRs.
His own PRs need no other reviewer. Native PR approval count is zero; the
required release check enforces the account-specific approval policy, with
build/test checks still required.

The agent opens a separate PR from current `beta` to `main` after that exact
commit's beta deployment and live verification are green. Wayne reviews beta,
approves the head commit, and taps Merge with `ChapalaTheological1`. Main is
restricted to the human release accounts, not the agent. The production Action
runs a fresh build/full suite, checks that the checkout still matches current
main, then calls the existing account-checked `npm run deploy`. It verifies the
public build stamp and health separately afterwards. A failed test prevents
deployment; a failed final probe can mean deployment happened but verification
failed. Inspect the two steps before retrying. The workflow preserves the checked-in grading mode and activation timestamp;
it does not approve a grading-mode switch or reset activation dates.

New requirements marked as drafts stay optional. Preserve the approved production activation date on later releases.

## Access and enforcement setup

See [the content release runbook](content-release-workflow.md) for branch rules,
review evidence, Wayne's agent access, deployment tokens and initial rollout.

## October 12 integration

See [the PR review record](beta-staging-review-2026-10-12.md) for all 31 original heads, repairs, content-review boundaries and validation evidence.

## Master’s requirements after the 12 October audit

[Beta activation](beta-master-test-activation.md) records the cutoff in beta when the repaired release is deployed, preserving earlier valid master’s completions. The guarded deploy prepares only the activation metadata migration, then checks all 71 newly activated requirements (the eight awaiting faculty review stay optional). Production needs a separately chosen date before promotion.
