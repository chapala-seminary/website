# Beta staging and production promotion

Staging: https://beta.chapalaseminary.org — branch `beta`, Worker `chapala-seminary-beta`, database `chapala-students-beta`.
Production: https://chapalaseminary.org — branch `main`, Worker `chapala-seminary`, database `chapala-students`.

The full test harness keeps its historical catalog reference in
`.wrangler-local/ref.html` and serves a temporary copy from `dist/`. It must
leave the tracked root `_reference-index.html` unchanged, including on failure;
the deployment guard checks that the tested checkout is clean. The beta job
allows 60 minutes because the complete browser suite can take over 40 minutes
before publication begins.

## New work

Start from the latest beta branch and open PRs with base `beta`. Review the change, run `npm run build && npm test` on the Mac, fix failures and merge to beta. Keep related drafts and dependencies identifiable; do not import unreviewed French text into published content.

The beta Actions workflow runs a fresh build and the complete suite on each push, then uses the guarded publication step of `npm run deploy:beta`. A failed build or test prevents publication. The final public health probe runs after publication, so its failure can leave a published Worker while marking the workflow failed. Check the live `/version.txt` and deployment version before retrying; the probe reports its HTTP status and Cloudflare challenge state. It needs repository Actions secret `CTS_BETA_CLOUDFLARE_API_TOKEN`, a deployment token limited to the CTS account `119b0919229edb3185b69f1c6bd04b66`, including Workers deployment/routes, account/zone read and D1 access needed by Wrangler. Set it through GitHub's secret settings; do not put the value in files, PR descriptions or chat.

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

Wayne and Robert check the beta site, including English/Spanish exams, completion, certificates and readings. Faculty approve content and a qualified French theological reader approves French text before import. New requirements marked as drafts stay optional. Choose activation dates after the production deploy that carries them.

Then open a separate PR from `beta` to `main`. Review the complete change and rerun build/tests before promotion. Robert authorizes merging to main and production publishing. From the reviewed main commit, deploy only with `npm run deploy`; production has no automatic push-to-main deployment workflow.

## October 12 integration

See [the PR review record](beta-staging-review-2026-10-12.md) for all 31 original heads, repairs, content-review boundaries and validation evidence.

## Master’s requirements after the 12 October audit

[Beta activation](beta-master-test-activation.md) records the cutoff in beta when the repaired release is deployed, preserving earlier valid master’s completions. The guarded deploy prepares only the activation metadata migration, then checks all 79 newly activated requirements. Production needs a separately chosen date before promotion.
