# Production Post-Release Assessment-Key Integrity Check

**Date:** 2026-10-26  
**Scope:** read-only verification of the production release created from protected `main` commit `53e348cdccb7fba0e5346621d0bc3d6c4bc2aecd`  
**Workflow:** [Test and deploy production — run 40375463180](https://github.com/chapala-seminary/website/actions/runs/40375463180)  
**Production version:** `c8db5fc0-a53a-4aa5-83e2-2d6bff3c5a72`

## Conclusion

The available release evidence supports a **PASS** for the public/private assessment-key boundary at the deployed commit. The public build was checked for answer-bearing fields before deployment, the private key checkout was present for server-side key synchronization, and the custom-domain health endpoint returned `{"ok":true,...}` for the release query.

This is a technical integrity result, not an academic approval of individual questions, translations, rubrics, grades, completions, or certificates.

## Verified evidence

### Exact release identity

- Protected `main` resolves to `53e348cdccb7fba0e5346621d0bc3d6c4bc2aecd`.
- PR #175 changed only `.github/workflows/production.yml`; it was merged externally at head `bc5b43ef83442b5114152131db744ae39862d5f7`.
- Workflow run 40375463180 completed successfully.
- The production guard reported that the deploy matched the current `origin/main` commit.
- Direct Worker release verification reported: `Production verified: 2026-10-26 53e348cd`.
- A separate browser read of `https://chapalaseminary.org/api/health?release=2026-10-26%2053e348cd` returned an `ok: true` health response on the custom domain.

### Private checkout and live build boundary

The workflow:

1. checked out `chapala-seminary/assessment-keys` into the runner-only `.assessment-keys` directory using the production secret;
2. required the private `units/` directory before continuing;
3. set `ASSESSMENT_KEYS` only inside the workflow environment;
4. merged and checked 666 private unit banks across 61 courses;
5. built in `GRADING_MODE=live`;
6. ran the key-exposure verifier before deployment;
7. synchronized grading keys server-side; and
8. deployed only after the protected-branch, clean-checkout and test gates passed.

The recursive public Git tree for the exact deployed commit contains 4,330 entries and no committed `.assessment-keys` directory.

### Key-exposure verification

The live-build verifier reported:

- **1,998 unit pages** and **366 test pages** carried no answer key, accepted-answer list, model answer, keyword, rubric, explanation, or review passage;
- **39 single-page course pages** and their fill-in data carried no such key material;
- **61 private reading banks** and **61 private textbook banks** had public files with no `answer`, `accept`, or answer-fingerprint `tr` fields;
- **765 private-reading checks** passed, covering prompt-only public files, private overlays, grading behavior, and key-free live pages;
- **183 built pages** using installed private banks were checked;
- **39,960 answer comparisons** against the private baseline found the content unchanged;
- open and failed attempts disclosed only right/wrong status, while detailed review remained available only after a pass;
- 66 live server-verdict, pending-review, and no-key checks passed;
- live pages and the real Worker graded, locked, collected, and credited together; and
- the deployment reran the live-build exposure verifier immediately before the Cloudflare deploy.

### Deployment and health

- 1,793 assets were uploaded; 2,646 were already present.
- Cloudflare reported `GRADING_MODE=live`.
- The Worker and scheduled triggers deployed successfully.
- The direct Worker hostname verified the exact release.
- The workflow's own custom-domain HTTP probe received a Cloudflare challenge, but an independent browser read subsequently reached the custom-domain health endpoint and received `ok: true`.

## Important limits

- This check does not expose or inspect the private answer values.
- It does not validate the academic correctness of questions, accepted aliases, translations, or rubrics.
- It does not prove that every future commit will preserve the boundary; the same gates must remain mandatory.
- A health response verifies the release endpoint, not every student path or every live examination transaction.
- Known B-C2 rubric-alias findings remain under separate academic review.

## Next safe checks

1. Keep the public exposure verifier mandatory in the production deployment command.
2. Keep the private repository token restricted to the production workflow.
3. Run synthetic, non-student grading probes for the known B-C2 rubric-alias cases without changing earlier credit.
4. Preserve the existing rule that missing or mismatched private overlays fail closed for answerless public banks.
5. Re-run this release-boundary audit after any change to the build, grading-key synchronization, review assets, or private-repository checkout.
