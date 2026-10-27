# PR #180 post-merge release-state audit — 26 October 2026

**Status:** merge verified; production deployment **not yet verified**  
**Scope:** read-only release observation. This report does not merge, deploy, approve, or change production.

## Verified merge facts

- Pull request: [#180](https://github.com/chapala-seminary/website/pull/180), authored by `chapalatheological-ai`.
- Approved by `ChapalaTheological1` at 2026-10-27 00:28:40 UTC.
- Merged externally by `ChapalaTheological1` at **2026-10-27 02:33:10 UTC** (26 October, Mexico City).
- Approved PR head: `c6110458213ee676833149a8f30c8b121572ec89`.
- Previous main base: `53e348cdccb7fba0e5346621d0bc3d6c4bc2aecd`.
- Resulting main merge commit: `a5d7b380361e4db1a54b88bf7113f3eaed83ab81`.
- GitHub reports 139 changed files in the merge commit.
- The commit message is `Merge pull request #180 from chapala-seminary/beta` and identifies the approved `c6110458` release candidate.

This confirms that the owner merged the exact PR head that had passed the documented exact-head tests and approval gate. ChatGPT did not perform the merge.

## Production workflow consequence

At merge commit `a5d7b380...`, `.github/workflows/production.yml`:

- triggers on pushes to `main`;
- runs the production job only when `CTS_PRODUCTION_AUTODEPLOY_ENABLED == 'true'`;
- checks out the private assessment-key repository and fails if it is unavailable;
- runs `npm run build` and the full `npm test` suite;
- refuses an outdated or dirty checkout;
- deploys only after those gates; and
- calls `tools/check-production-release.mjs` after deployment.

## Evidence still missing at this snapshot

GitHub's combined-status query for merge commit `a5d7b380...` returned no commit statuses. The available commit-workflow wrapper, which exposes pull-request-triggered runs, returned no run for the new merge commit; that result does **not** establish whether a push-triggered production run is queued, running, skipped by the repository variable, or complete. The connected CTS Gmail account has the merge notice but no production-workflow success/failure notice yet.

Therefore:

1. Do **not** call production deployed, healthy, or failed from the merge alone.
2. Obtain the push-triggered `Test and deploy production` run ID for `a5d7b380...`.
3. Verify private-key checkout, build, full tests, branch guard, deploy, and published-release check all completed successfully.
4. Query the custom-domain health endpoint for the exact deployed release.
5. Repeat the public/private key-exposure audit for this release before declaring the gate complete.

## Scope warning

PR #180 promotes fixed head `c6110458`. Claude's later A-C2/A-C5 source and course work was not part of that approved head unless separately committed before the merge (the PR metadata reviewed here shows the same fixed head as approved). Do not attribute later handoff reports or active elective reconstruction to this release.

PR #164 remains a separate draft, unmerged change; its correspondence sending must remain off.
