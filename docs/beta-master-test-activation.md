# Beta master’s test activation

The 12 October audit repairs activate all 79 staged textbook/reading requirements on beta. Together with the 11 existing requirements, every one of the 45 courses has two separate tests for M.Div. and Th.M. Each test draws 20 questions and needs 18 correct. Certificate and Associate students remain unaffected. Honors attestation remains optional and cannot replace a test.

## Activation and earlier work

Beta alone has `MASTER_TESTS_ACTIVATION: beta`. The guarded beta deployment creates the policy metadata table with migration `0013_test_activation.sql`, deploys the Worker, and calls its health endpoint. That first request records one cutoff in beta’s database. Subsequent deployments reuse it. Creating a review PR does not activate anything.

The server applies this cutoff only to the 79 catalog entries whose `requiredFrom` is null. A valid master’s completion the server already recorded before the cutoff remains valid, with exemptions restored to other devices. Earlier Certificate/Associate completions, unfinished courses and work only reported after activation do not bypass new master’s requirements. Existing textbook/reading passes are kept.

Production has no activation date set. At the separately authorized production release, set production’s `MASTER_TESTS_ACTIVATION` to that release’s ISO UTC timestamp so the requirements take effect immediately. Keep that cutoff for later deployments. Never use the literal `beta` or copy its October 13 cutoff. The production deployment guard refuses an unset or non-UTC timestamp; `npm run deploy` now applies pending production D1 migrations before publishing, including `0012_email_links.sql` and `0013_test_activation.sql`. Preparing this change does not authorize executing production migrations or deployment.

## Student notices

The catalog now describes all 45 textbooks and 45 separate reading exams. Reading rooms distinguish optional honors reading from master’s assigned-test requirements. Unit links point students to the test page’s current status. Beta’s health response and student state supply the actual activation policy to the browser; the status and certificate gates use that same policy. Offline browsers retain the last fetched policy and progress.

## Verification

`test/beta-activation.test.mjs` launches a separate local Worker using the actual beta flag and a disposable D1 database. It verifies all 79 dates, units-only/book-only/reading-only/both-test completion cases, unchanged Certificate/Associate rules, earlier master’s exemptions, no Certificate-to-master’s exemption, recovery, visible notices and a cutoff unchanged after restart. The main suite still uses the production-like inactive setup, with its existing synthetic policy tests.

The first live beta health check must return 79 activated slugs and one valid date. `tools/check-beta-activation.mjs` verifies this after the guarded deployment. Live student/certificate acceptance checks follow review and beta publication; production remains on hold.
