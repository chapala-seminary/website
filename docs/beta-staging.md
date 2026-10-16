# Beta staging and production promotion

Staging: https://beta.chapalaseminary.org — branch `beta`, Worker `chapala-seminary-beta`, database `chapala-students-beta`.
Production: https://chapalaseminary.org — branch `main`, Worker `chapala-seminary`, database `chapala-students`.

On beta, the full test harness keeps its historical catalog reference in
`.wrangler-local/ref.html` and serves a temporary copy from `dist/`. It must
leave the tracked root `_reference-index.html` unchanged, including on failure;
the deployment guard checks that the tested checkout is clean. The beta job
allows 75 minutes because the complete browser suite can take over 40 minutes
before publication begins.

## New work

Start from current beta and open a PR with base `beta`. ChatGPT reviews the
academic content, Claude checks it and prepares the change, and Wayne approves
the exact commit. Put the full head SHA and links to both reviews in the PR
using its template. Each new push requires fresh human approval and matching
review evidence. Run `npm run build && npm test`; GitHub also runs a fresh suite.
The agent account may merge content-only PRs after all required checks pass.
Keep related drafts and dependencies identifiable. Language drafts still need
the relevant qualified theological reviewer before production.

The beta Actions workflow runs a fresh build and the complete suite on each push, then uses the guarded publication step of `npm run deploy:beta`. A failed build or test prevents publication. The final public health probe runs after publication, so its failure can leave a published Worker while marking the workflow failed. Check the live `/version.txt` and deployment version before retrying; the probe reports its HTTP status and Cloudflare challenge state. It needs the `beta` environment Actions secret `CTS_BETA_CLOUDFLARE_API_TOKEN`, a deployment token limited to the CTS account `119b0919229edb3185b69f1c6bd04b66`, including Workers deployment/routes, account/zone read and D1 access needed by Wrangler. Set it through GitHub environment secret settings; do not put the value in files, PR descriptions or chat.

Publication and post-deploy verification now have separate Actions steps. CI uses
the guarded `deploy:beta:publish` part of `deploy:beta`, then verifies the exact
build stamp and all 79 activation dates. A challenged or unreachable custom
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

Wayne checks the actual beta release. Content-only means academic text,
translations, question/answer content and readings in the paths listed in
`.github/CODEOWNERS` and `tools/release-policy.mjs`. It excludes scripts, styles,
templates, course wiring, pass thresholds, grading behavior, database changes,
registration, email, configuration and deployment/review rules. New languages
may require code even when their draft packets are content-only. Unknown,
renamed, removed or structurally changed content files require Robert's review.
The gate freezes JSON control fields and conservatively sends executable markup
to Robert. New course/unit wiring needs his review as well. Existing legacy HTML readers
allow text-only corrections while every tag, attribute and script/style body
remains identical. New HTML reader templates, links or markup require Robert;
pure Markdown readings and offline review packets can be added as content. Content does not
include changing the grading engine; changing academic answer keys is content.

For Wayne/agent PRs, technical and mixed changes need Robert's exact-commit
approval as well as Wayne's. Code Owners cover technical and academic paths.
Robert's `satoshisound` account has a named PR-review bypass, and his own
same-repository PRs are exempt from the faculty/AI approval gate. Build and test
checks still apply. Wayne and the AI have no bypass. An agent must never
impersonate a human reviewer.

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

The current beta contains technical changes, so the first complete promotion
still requires Robert's technical approval. New requirements marked as drafts
stay optional. Preserve the approved production activation date on later releases.

## Access and enforcement setup

See [the content release runbook](content-release-workflow.md) for branch rules,
review evidence, Wayne's agent access, deployment tokens and initial rollout.

## October 12 integration

See [the PR review record](beta-staging-review-2026-10-12.md) for all 31 original heads, repairs, content-review boundaries and validation evidence.

## Master’s requirements after the 12 October audit

[Beta activation](beta-master-test-activation.md) records the cutoff in beta when the repaired release is deployed, preserving earlier valid master’s completions. The guarded deploy prepares only the activation metadata migration, then checks all 79 newly activated requirements. Production needs a separately chosen date before promotion.
