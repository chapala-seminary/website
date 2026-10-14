# Release readiness — 14 October 2026

Release remains held. This candidate starts from beta `af4cb3d3` and reconciles
production main `70d2fa61` (including #84, `d4d7bf92`). The previous production
deployment still publicly reports `2026-10-06 431b826`; promotion carries all
changes since that deployed version, not just the beta additions.

## Prepared changes

- Missing short-answer criteria reject automatic passes. Master's submission
  pauses before grading or retake penalties and keeps answers. All 120 Genesis
  questions still need faculty-reviewed criteria; see
  [the containment safeguard](genesis-grading-safeguard.md).
- Main's certificate restore listeners and late-download recovery are retained.
  The three merge conflicts preserve beta's exemptions and French text while
  using the catalog's actual 11 Hermeneutics and 10 Evangelistic Preaching units.
- Production deployment applies pending D1 migrations before Worker publishing.
  The reported missing `0012` and `0013` are in that migration set. A read-only
  production ledger check here returned Cloudflare authorization error `7403`;
  the actual ledger and schema must be verified with CTS-authorized credentials.
- Production deployment refuses an unset or non-UTC activation timestamp.
  Set `MASTER_TESTS_ACTIVATION` to the actual authorized production release's
  ISO UTC timestamp, effective immediately, and retain it on later deployments.
  Do not copy beta's flag or October 13 cutoff. Existing server protections for
  valid earlier master's completions remain intact.
- Beta's post-deploy probe verifies the exact build stamp and all 79 dates.
  A Cloudflare challenge or transport failure can use the direct beta Worker
  hostname. A stale release, bad policy or HTTP 500 remains a failure. A fallback
  warning explicitly leaves custom-domain browser acceptance outstanding.
- Sync-write test instrumentation is installed before the local Worker starts,
  avoiding trigger creation/deletion during requests. This changes test setup
  only; the reported Linux reload failure still needs a Linux rerun.
- The front page and honors page limit optional honors to Certificate and
  Associate students, with matching French drafts. This is a copy correction;
  prior awards and saved honors records are not rewritten.
- Romans identifies eternal security as a perspective to weigh, rather than
  CTS's required position, with a matching machine-drafted French correction.
  Systematic Theology and related theological edits remain
  in the separate active editorial worktree and must be reviewed independently.
- Six Joshua/Language Appreciation certificate pages now use Chapala, Jalisco.

## Local validation

`npm run build` passed: 963 pages in each of English, Spanish and French.
The complete `PORT=19743 test/run-tests.sh` run passed (exit 0), with no
browser checks skipped, including all 5,778 desktop/phone language renders.
Checks include 979 missing-grading checks, 42,855 French/source grading checks,
38,173 published model/source checks, 3,726 assessment-policy assertions,
601 certificate eligibility assertions, 90 certificate-sync checks and 158
PDF assertions. Local registration, cross-browser recovery, textbook/reading
recovery, email link/code handling and certificate registration passed.
The local email mode sends no real messages.

## Acceptance still required

1. Review and publish the final candidate to beta, then verify its build stamp.
2. Complete Genesis's grading criteria and confirm a registered master's learner
   cannot pass blank, unrelated or copied-prompt answers and can pass appropriate
   independent answers in English and Spanish.
3. Use an authorized controlled inbox to check actual confirmation email receipt
   and link/code redemption, recovery in a fresh browser/device, certificate
   issuance, download and public verification on that same deployed candidate.
   Local mail-log tests do not establish delivery. Keep identifiers out of Git.
4. Keep machine-translated French explicitly provisional pending theological
   review, including on a separately scoped English/Spanish release.
   The static French packet check reports 68 existing keyword-overlap warnings
   (copied prompts can meet draft criteria); its technical pass is not faculty
   approval or evidence that every French answer is appropriately graded.
5. At the authorized production release, verify migrations `0012`/`0013`, choose
   its activation timestamp, review the whole production diff, deploy, and check
   production's public version and policy. Production has not been modified here.

Instruction evidence: CTS workspace `AGENTS.md`; brain `MEMORY.md`, `CLAUDE.md`,
`USER.md`, `AGENTS.md`, `AGENT_RULES.md`, `GIT_WORKFLOW.md`, `SECURITY.md`,
`projects/website/PROJECT.md` and the beta activation decision; website
`AGENTS.md` and `docs/beta-staging.md`; QA-session skill and its session/verification
references. The company remote is `chapala-seminary/website`; the COINCUBE and
Website Machine shared-policy routes do not apply to this CTS assignment.
