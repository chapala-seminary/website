# Setting up a study-group coordinator

_20 Oct 2026. The pages are in `worker/coord.js`. The plan is
`docs/offline-coordinator.md`._

A coordinator signs in at **chapalaseminary.org/coord**. From there they
enroll learners who have no email, print exams, and type in each learner's
paper answer sheet. The site grades each sheet the way it grades an online
exam, and only after the coordinator confirms that the learner did the work.
Coordinators never see an answer key, which questions were wrong, or any
other group. There is no limit on the number of learners.

Staff see the score, the date, and who entered each sheet at **/staff/groups**,
and can enter a sheet there under the same rules.

Where a learner can have an email, they register on the site themselves. No
extra setup.

Paper sheets are accepted only when the site grades on the server
(`GRADING_MODE` live). This branch already sets production to live. The
running production site stays on shadow until this beta is promoted, and until
then production refuses sheets. Beta already grades live.

## Before the promotion

1. **Coordinator sign-in.** Create the Access application below and put its
   audience tag in `wrangler.jsonc` as `COORD_ACCESS_AUD`, once for production
   and once under `env.beta.vars`. Commit that on beta so the promotion
   carries it. Until the tag is set, `/coord` answers "not set up". The tag
   must not be the staff audience.
2. **Test on beta** with made-up learners, not the real groups. Beta's
   database is not the production record. A beta deploy applies pending
   migrations, including `0017_study_groups.sql` and
   `0018_paper_attestation.sql`.
3. **Promote beta to production** with the usual release. `npm run deploy`
   applies those same migrations to `chapala-students` and publishes the live
   grader. After it is live, create the real groups and enroll there.

## One time: the coordinator sign-in (Cloudflare)

The coordinators get their **own** Cloudflare Access application, separate
from the staff pages, so a coordinator can never open `/staff`. Access seats
are for coordinators, not for learners.

1. Cloudflare dashboard → **Zero Trust** → **Access** → **Applications** →
   **Add an application** → **Self-hosted**.
2. Name: `CTS coordinators`. Domain: `chapalaseminary.org`, path `coord`.
   Add the same again for `beta.chapalaseminary.org`, path `coord`.
3. Policy: **Allow**, **Include → Emails**: the coordinators' email addresses.
   They sign in with a one-time code sent to that address.
4. Save, then copy the application's **Audience (AUD) tag**.
5. Put that tag in `wrangler.jsonc` as `COORD_ACCESS_AUD` for production and
   for beta.

## Each group: two places

1. **Make the group** at **/staff/groups** (staff sign-in): name, country,
   the coordinator's email, course. Old Testament Survey is preselected.
   Kenya uses that course. For Liberia, choose the course those pastors are
   actually sitting. Zambia, Malawi, and Haiti are further groups on this
   same form. Haiti's coordinator is Pastor Emmanuel Julien; his learners
   already have codes, so he adds them on `/coord` instead of enrolling them
   again.
2. **Let the coordinator in**: add the same email to the `CTS coordinators`
   Access policy.

Both are needed. The group alone does not let anyone in, and the Access
policy alone shows "not the coordinator of a study group".

The coordinator's email is not written onto the learners. It stays on the
group. Learners enrolled here have no email address.

## The database

`migrations/0017_study_groups.sql` adds `study_groups`,
`study_group_members`, and `paper_sheets`. `migrations/0018_paper_attestation.sql`
adds the own-work statement on each sheet. Neither file changes an existing
student row.

Production applies both on deploy (`tools/prepare-production-migrations.mjs`).
Beta applies both on deploy (`tools/prepare-beta-migrations.mjs`). To apply
them on beta without a full deploy, from a clean checkout of the published
beta commit:

```
npx wrangler d1 migrations apply chapala-students-beta --remote --env beta
```

Use the pinned account, the same way `npm run deploy:beta` does.

## A sitting, for the coordinator

1. On `/coord`, open **Exams to print** and print the unit's exam in the
   learner's language. Lessons for the foundation courses are the pages
   already on the site. The exam must be this printout: the sheet is graded
   in its order of questions and choices, and it carries an exam version.
2. The learner writes their name and student code, and one letter per
   question. The coordinator signs the statement on the sheet that the
   learner did the work.
3. Later, on `/coord`, choose the learner → **Enter a sheet** → the unit, the
   exam version, the letters (a blank is `X`), and the same statement. The
   result is the score and passed or not.
4. After a sheet that did not pass, the unit waits a short time before the
   next sheet, as online.

Staff can type the same sheet at **/staff/groups**. The result list there
shows the score, the date, and who entered it.

## Not in this version

Certificates for learners with no email (staff will issue them and send the
PDF to the coordinator). Written answers on paper. Haitian Creole. Scanning
sheets. Voiding a sheet that was marked passed by mistake.
