# Individual Th.M. course substitutions

The normal Th.M. requires 15 distinct CTS courses completed at master's level,
including the seven foundation courses. Faculty may approve the individual
arrangement supplied on 14 October 2026: five other CTS courses replace five
foundation courses. Systematic Theology and Preaching cannot be replaced.
Required textbook and separate reading exams still apply to every course taken.

## Staff workflow

1. Sign in to `/staff/students` through the existing Cloudflare Access gate.
2. Open the student's name to view their Th.M. course-plan form. Confirm the
   correct student and that their current program is Th.M.
3. Select a faculty-approved replacement for each of Old Testament Survey,
   New Testament Survey, Evangelism, Pastoral Ministries and Church History.
   Each replacement must be a different CTS course outside the foundation.
4. Confirm faculty approval and save. This does not complete any courses or
   waive exams. The actual applicant's five replacement choices must come
   from faculty; the software does not choose them automatically.
5. Have the student sync or recover their record. Their catalog opens for
   study, and the Th.M. progress page lists the seven actual required courses
   in the approved plan, with a 15-course total. The staff roster uses the
   same plan when counting required courses.

Only the Th.M. foundation changes for that individual. Certificate, Associate
and M.Div. requirements remain unchanged. Fifteen distinct eligible courses
must be completed; a replacement cannot create a second credit for the course
it replaces. The server checks its own approval record at degree issuance,
ignoring approvals sent by the student browser.

## Changes and preservation

Each approval or withdrawal appends a revision in `thm_study_plans`, with the
staff identity and date. Stale forms cannot overwrite a newer revision. To
withdraw, confirm faculty approval and choose **Withdraw plan**. The next
student sync replaces the cached plan and restores the ordinary foundation
rules without removing earned courses, exam passes or existing certificate
verification records. No new exceptions to prior degree reissuance are added.

Plans are private student records: never export or commit them to Git. Their
rows are removed with a student's self-service record deletion. A merge of
duplicate student accounts does not automatically transfer an individual
approval: faculty must confirm the plan on the retained account.

## Deployment

Migration `0014_thm_study_plans.sql` creates only an empty approval-history
table and index. It does not modify completions, exam passes or certificates.
The guarded beta deploy applies it alongside the existing activation-table
migration. The guarded production deploy applies this additive migration
after the build and before publishing the new Worker. Deployments need the
same pinned CTS account and D1 permissions as the existing beta deploy.

Production promotion still requires Robert's authorization, a separately
chosen exam activation date, and the [complete promotion checklist](thm-15-course-audit.md).
Installing this code does not approve any real applicant's plan. No student
identity or private replacement selection is included in this change.

## Verification

`test/thm-study-plans.api.mjs` exercises the real Worker, local D1 and Chromium:
staff authentication, cross-site rejection, validation, stale revisions,
self-approval rejection, required exams, fourteen-course denial, fifteen-course
issuance, protected courses, fresh-browser recovery, catalog access and
withdrawal without losing courses or invalidating existing verification.
It runs within `test/run-tests.sh`. Existing degree, migration and activation
tests continue to cover the ordinary program and older valid completions.
