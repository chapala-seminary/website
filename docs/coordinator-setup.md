# Setting up a study-group coordinator

_20 Oct 2026. The pages are in `worker/coord.js`; the design is
`docs/offline-coordinator.md` (PR #141); Wayne's decisions are recorded on
that PR: Kenya and Liberia first, Old Testament Survey, Certificate track,
one coordinator per group._

A coordinator signs in at **chapalaseminary.org/coord**. From there they
enroll learners (no email needed), print exams, and type in each learner's
paper answer sheet. The site grades each sheet exactly as it grades an online
exam. Coordinators never see an answer key, which questions were wrong, or
any other group.

Paper sheets are accepted only when the site grades exams on the server
(`GRADING_MODE` live). Until production switches (PR #146), `/coord` on
production lets a coordinator enroll and print but refuses sheets. Beta
already grades live.

## One time: the coordinator sign-in (Cloudflare)

The coordinators get their **own** Cloudflare Access application, separate
from the staff pages, so a coordinator can never open `/staff`.

1. Cloudflare dashboard → **Zero Trust** → **Access** → **Applications** →
   **Add an application** → **Self-hosted**.
2. Name: `CTS coordinators`. Domain: `chapalaseminary.org`, path `coord`.
   Add the same again for `beta.chapalaseminary.org`, path `coord`, to test there.
3. Policy: **Allow**, **Include → Emails**: the coordinators' email addresses.
   They sign in with a one-time code sent to that address.
4. Save, then copy the application's **Audience (AUD) tag**.
5. Put that tag in `wrangler.jsonc` as `COORD_ACCESS_AUD`: once at the top
   level (production) and once under `env.beta.vars`. A beta PR with that
   one change is enough.

Until `COORD_ACCESS_AUD` is set, `/coord` answers "not set up".

## Each group: two places

1. **Make the group** at **/staff/groups** (staff sign-in): name, country,
   the coordinator's email, course (Old Testament Survey is preselected).
2. **Let the coordinator in**: add the same email to the `CTS coordinators`
   Access policy (step 3 above).

Both are needed. The group alone does not let anyone in, and the Access
policy alone shows "not the coordinator of a study group".

## The database

`migrations/0017_study_groups.sql` adds three tables (`study_groups`,
`study_group_members`, `paper_sheets`) and changes nothing that exists.
Production applies it with the other migrations on deploy
(`tools/prepare-production-migrations.mjs`). Beta does not apply migrations on
deploy. Apply this one there by hand; it is safe to run twice:

```
npx wrangler d1 execute chapala-students-beta --remote --env beta --file migrations/0017_study_groups.sql
```

## A sitting, for the coordinator

1. On `/coord`, open **Exams to print** and print the unit's exam in the
   learner's language. Use these printouts: the sheet is graded in their
   order of questions and choices.
2. The learner writes their name and student code, and one letter per
   question on the answer sheet.
3. Later, on `/coord`, choose the learner → **Enter a sheet** → the unit and
   the letters in order (a blank question is `X`). The result is shown at once:
   passed, or not passed with the score.
4. After a sheet that did not pass, the unit waits a short time before the
   next sheet, as online.

## Not in this version

Master's and Associate written answers on paper, certificates for learners
with no email (staff issue them from the record; to be added), Haitian Creole,
scanning sheets.
