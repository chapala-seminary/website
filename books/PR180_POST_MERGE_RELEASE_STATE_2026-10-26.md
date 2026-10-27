# PR #180 post-merge production verification — 26 October 2026

**Status:** exact merged release deployed and verified on the direct Worker hostname; custom-domain browser acceptance remains pending  
**Scope:** post-release evidence only. ChatGPT did not merge, deploy, approve, or change production.

## Exact release identity

- Pull request: [#180](https://github.com/chapala-seminary/website/pull/180), authored by `chapalatheological-ai`.
- Merged externally by `ChapalaTheological1` at **2026-10-27 02:33:10 UTC** (26 October, Mexico City).
- Approved PR head: `c6110458213ee676833149a8f30c8b121572ec89`.
- Resulting main merge commit: `a5d7b380361e4db1a54b88bf7113f3eaed83ab81`.
- Production workflow: [run 40439092559](https://github.com/chapala-seminary/website/actions/runs/40439092559), job `121974811164`.
- Deployed Worker version: `17bbcbbf-09a6-45ef-8380-c56f724a528c`.
- Workflow verification marker: `Production verified: 2026-10-27 a5d7b380`.

## Workflow result

The `production` job completed **successfully**. GitHub reports success for every required step:

1. checkout and runtime setup;
2. dependency installation and Playwright dependencies;
3. private assessment-key checkout;
4. build with private keys;
5. full test suite;
6. clean/current production-checkout guard;
7. deploy of tested `main`; and
8. published-production release verification.

Deployment synchronized **33,241 questions**; the deployment pass found zero remaining writes and 33,241 unchanged questions. It uploaded **1,433** new or modified static assets, reused **3,006**, and reported **4,463** files in `dist`. The Worker was deployed with `GRADING_MODE="live"`.

## Answer-key integrity evidence

The successful release gates reported:

- **1,998** unit pages and **366** test pages with no answer key, accepted answer, model answer, keyword, rubric, explanation, or review passage exposed;
- all **39** single-page course pages and fill data clean;
- **61** private reading banks and **61** private textbook banks checked against public files, with no answer, accept, or `tr` field exposed;
- **765** private reading-bank checks passed;
- **183** built pages with installed private banks checked; and
- **39,960** answer comparisons against the private baseline completed.

These are workflow assertions for the exact merge commit above. No private answer content or credentials are reproduced here.

## Remaining acceptance limitation

The workflow's custom-domain probe to `https://chapalaseminary.org/api/health?release=2026-10-27%20a5d7b380` received **HTTP 403** from a Cloudflare challenge. The workflow then verified the exact release and health successfully on the existing direct Worker hostname.

Accordingly:

- the exact merged release is verified as deployed and healthy on the direct Worker endpoint;
- the release's build, private-key, test, branch, deploy, and published-release gates passed;
- **custom-domain browser acceptance is still required**; do not represent the challenged custom-domain probe as a successful verification.

## Scope warning

PR #180 promotes fixed head `c6110458`. Later A-C2/A-C5 source and course work is not included unless it existed in that fixed head. Do not attribute later handoff reports or active elective reconstruction to this release.

PR #164 remains a separate draft and unmerged change. Its correspondence sending must remain off.
