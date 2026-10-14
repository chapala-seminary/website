# Th.M. requirement verification — 14 October 2026

Status: original beta implementation verified in source; live description and
empty-record progress verified in the Codex in-app browser. The individual-plan
repair is prepared on this branch and has not been deployed. Production
promotion is pending.

## Scope and evidence

CTS website, verified remote `git@github.com:chapala-seminary/website.git`.
Fetched `beta` and `main` on 14 October. Audited beta commit
`af4cb3d3bdb325bf0d526eb41975dc86ba5249e3`; the live homepage displays the same
build identifier. Work is isolated on `codex/thm-requirement-audit`.
Instructions read: workspace `AGENTS.md`, brain `MEMORY.md`, `CLAUDE.md`,
`USER.md`, `AGENTS.md`, `AGENT_RULES.md`, `GIT_WORKFLOW.md`, `SECURITY.md`,
`projects/website/PROJECT.md`, website `AGENTS.md` and `docs/beta-staging.md`.
QA skill and its session/findings reference were read. The COINCUBE and Website
Machine policy routes do not apply to this separate CTS assignment; no policy
SHA for either company is claimed.

| Area | Finding | Evidence |
| --- | --- | --- |
| Production description | Still advertises 12 Th.M. courses. | Public homepage retrieved on 14 October. |
| Beta description | 15 master's-level courses, seven foundations plus eight electives. | Live English and French homepages; `src/body/index/head.html`; French landing data. |
| Student progress | Requires 15 courses and seven foundations. Empty record shows 0/15, 0/7, and disables printing. | Live English and Spanish `CTSThMCertificate.html`; `public/assets/js/cts-degrees.js`. |
| Graduation | Server requires 15 distinct recognized CTS courses completed at Th.M./M.Div. level, including the foundation. Unknown codes and duplicate aliases cannot inflate its count. | `worker/awards.js`, `degreeShortfall()` and `canonicalCode()`; `/api/student` uses the same rule. |
| Diploma issuance | `/api/certificate` checks the stored course record with `degreeShortfall()` before issuing the degree. | `worker/api.js`, `issueCertificate()`. |
| Course completion and certificates | New master's completions wait for applicable textbook and separate required-reading passes. Individual course certificates check these too. | `worker/api.js` sync filtering and certificate checks; `worker/awards.js`, `textbookShortfall()`. |
| Prior completions | Sync does not delete existing completions or lower their level. Newly activated tests exempt master's completions recorded before the server's cutoff; Certificate/Associate work does not gain that exemption. | `worker/api.js`; `worker/awards.js`, `exemptBefore()`; activation tests. |

The full count correction already exists in beta commit `98b7e17c` and includes
the browser and server rules as well as the text. Production's tracked rules
still say 12. A homepage-only change would leave production incorrect.

## Individual substitution arrangement

Wayne's supplied clarification permits one qualified applicant to substitute
other CTS courses for five foundation courses. Systematic Theology (`CTSST`)
and Preaching (`WISESPEAK`) remain required. The student must complete **15
actual distinct CTS courses at master's level**, including all applicable
textbook and reading exams. Substitutions do not create completion credits for
the replaced foundation courses and do not reduce the total.

**Initial audit finding (repaired on this branch):** no student-specific substitution mechanism existed.
The published beta audited above required the original seven courses in both
degree rule tables and locked electives until all seven were finished. The
new [staff approval workflow](thm-study-plans.md) addresses catalog access,
progress, server eligibility and issuance for an individually approved plan.
This repair is prepared on this branch and has not been deployed. Faculty must
still supply the actual applicant’s five replacement choices. Do not relax the foundation requirement globally or insert fictitious
foundation completions. Applicant identifiers and records are excluded here.

## Required checks at the next production promotion

- Promote the complete reviewed beta implementation: descriptions, diploma
  page, browser degree rules, Worker rules, catalog/test metadata, sync and
  recovery, and the relevant database migrations. Follow the separate
  beta-to-main review and Robert's production authorization.
- Choose a production-specific activation date for newly introduced exams;
  do not reuse beta's cutoff. Preserve recorded valid earlier completions and
  existing certificate verification records. Take the documented private
  backup before database work.
- Recheck 12 and 14 courses denied, 15 eligible master's courses accepted,
  missing required courses denied, and lower-level work excluded.
- Recheck textbook-only and reading-only completions held, both passes
  accepted, and pre-activation master's completions retained after recovery.
- Verify the individual approved course plan across catalog access, progress
  and issuance after publication. All 15 actual CTS
  completions and both non-substitutable courses must remain mandatory.
- Distinguish retained course completions from a new degree award: 12 retained
  courses do not become a new 15-course degree. Existing verification records
  are not revoked by the count change; reissuing an old degree currently runs
  the new eligibility check first. Any legacy reissue exception needs review.

## Validation and limits

The isolated beta build passed. Actual beta-activation regression passed 21
checks covering all 79 new requirements, separate tests, prior completions,
fresh-browser recovery and a stable cutoff after restart.

Targeted regression results:

- `tools/verify-degrees.mjs`: 115 assertions passed against the built pages
  and server rule functions, including 12/14 denied and 15 accepted.
- `test/api.test.mjs`: 120 assertions passed against a local Worker and D1,
  including degree and course certificate issuance checks.
- `test/required-tests.test.mjs`: 44 checks passed.
- `test/required-tests.api.mjs`: 26 checks passed against the local Worker.
- `test/migration.test.mjs`: 91 returning-student assertions passed against
  the local Worker, including preserved progress and completion levels.
- `test/beta-activation.test.mjs`: 21 checks passed as described above.

Initial sandbox attempts could not start Chromium/local sockets. The successful
runs used approved execution outside that sandbox. An initial migration-test
invocation lacked its required server; the successful rerun used the isolated
Worker at port 8898. Browser degree checks used the static build at port 8897.
Both temporary servers were stopped. Disposable synthetic database files remain
locally under `.wrangler-thm/` and are not part of the proposed patch.

No live
student records were read or modified, and no certificate was issued on a live
environment. Live server policy endpoints were blocked by the available
request/browser paths, so server issuance evidence comes from source and local
Worker tests, not a new live synthetic graduation. This is a focused degree
audit, not complete release sign-off or faculty/translation approval.

## Implementation follow-up

The repair adds a staff-only approval form, append-only private plan history,
student-specific eligibility and progress, recoverable browser display, catalog
access, and withdrawal without deleting earned work. The server ignores
student-submitted approval data. Production and beta deployment commands prepare
the additive schema before the new Worker needs it. See [staff workflow and
regression coverage](thm-study-plans.md). The baseline audit results above apply
to the original beta commit; repair validation is recorded separately.

### Repair validation

`npm run build` and the complete `test/run-tests.sh` passed on 14 October
(local port 8896), without browser skips. This included 5,778 language renders,
3,716 assessment-policy assertions, 601 certificate-unlock assertions, 158 PDF
assertions, 115 degree-boundary assertions, 91 returning-student checks, and
35 new individual-plan API/browser checks. Privacy, account merging and the
rate-limit checks passed too. Existing optional French/editorial warnings are
not faculty or translation approval.

After the final recovered-name refresh adjustment, a fresh build and the
focused degree/individual-plan suites passed again: 115 degree assertions and
36 individual-plan checks, including the name changing without a reload.
Temporary local servers were stopped. No production deployment or real
student-plan approval was performed.
