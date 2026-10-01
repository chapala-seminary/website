# The student tracker, and notes to students who go quiet

_28 Sept 2026. Wayne's request of 27 Sept: track each student's courses,
program, location, progress and last activity, and when a student goes about
three weeks without progress, send a short, personal note of encouragement
that also asks whether something on the site got in their way._

The seminary does not need a separate database for this. The site already
keeps one (`docs/student-records.md`): every registered student, every unit
passed, every course completed, every certificate, every notice the seminary
was sent. What this adds is a way to **read** it and the notes themselves.

Nothing below reaches a real student until the live site is the new one
(`docs/cutover.md`). Before then, the only records are beta testers'.

## What Wayne gets

**The roster**, at `/staff/students`, for signed-in staff only: one row per
student with name, email, country, language, program, progress toward the
program (for example `9/12`), foundation courses (`5/7`), courses completed,
completion notices received, units passed, the last unit and when, days since
progress, status (`active`, `quiet`, `not started`, `new`), the last note sent,
whether notes are on, when they registered and how they found the seminary.
Tabs show only the quiet students, or only those who have not started. A
**stop / resume** button on each row turns notes off or on for that student.

- `/staff/students.csv` is the same table for a spreadsheet, or for the CTS
  Student Tracker to read instead of the inbox.
- `/staff/students.json` is the same again, for a program.
- `/staff/notes` shows who the next daily run would write to, and the notes
  themselves in English and Spanish, exactly as a student would get them.

No student code appears on any of these. The code is the key to a student's
whole record.

**Notes to students**, sent by the site once a day at 15:00 UTC (9:00 in
Mexico City), signed by Wayne, from `certificates@chapalaseminary.org`. A
student's reply goes to `info@chapalaseminary.org`.

| note | who gets it | how often |
|---|---|---|
| "How is your study going?" | no unit passed and no course completed for 21 days, program not finished | once per quiet spell: not again until they have made progress and gone quiet again |
| "Getting started" | registered at least 7 days ago, no unit passed | once |

Each note is written in the language the student reads the site in, or in both
(English first) when that is not known. The "quiet" note names the course and
unit they stopped at and links to the next unit. Both ask the student to reply
if something on the site got in their way.

Nobody is written to who has no email, who asked not to be, whose program is
finished, or who is the placeholder account that tester mode creates. At most
40 notes go out in a day, which keeps the whole site under the email service's
free limit of 100 a day.

Every note ends with a link to stop them. The link opens a page with a button,
and only the button stops the notes, because mail scanners open links on their
own. The privacy page (`CTSPrivacy.html`) tells students about the notes.

**A weekly summary**, emailed to `info@chapalaseminary.org` on Mondays, lists:

- the notes sent that week;
- students still quiet six weeks after a note, who may be worth a personal word;
- new students;
- courses completed;
- any notice that failed to send.

## What "last progress" means

It is the last unit passed or course completed. Opening the site without
passing anything does not count: the question is whether a student is moving
forward.

At the cutover, each returning student's history from the old site arrives on
their first visit to the new one, dated that day. So for returning students
the three-week clock starts at the cutover, not at the work they did before.

Each returning student's history arrives as **one** completion notice listing
all of it ("CTS completions: 22 courses — …"), not one email per course.

## Setting up the sign-in (once, by Robert)

**Done 29 Sept 2026.** The team domain is
`chapalatheological.cloudflareaccess.com`. One Access application covers
`chapalaseminary.org/staff` and `beta.chapalaseminary.org/staff`, and lets in
the addresses named in its "Email" policy. `ACCESS_TEAM` and `ACCESS_AUD` are
in `wrangler.jsonc` for both environments. To let someone else in, add their
address to that policy; nothing in the code changes. The steps below are kept
for reference.

The staff pages stay closed ("not set up on this site yet") until Cloudflare
Access is configured. Access is Cloudflare's login gate. It is free for up to
50 people. The people it lets in sign in with a one-time code emailed to them,
with no password to keep. The steps below use the dashboard's labels as of
September 2026, which may have moved.

1. Cloudflare dashboard, **Chapala account** → **Zero Trust**. The first time,
   it asks for a **team name** (for example `chapala`) and a plan; choose the
   free plan. The team name is `ACCESS_TEAM`.
2. **Access → Applications → Add an application → Self-hosted.**
   - Application domain: `chapalaseminary.org`, path `staff`. Add a second
     domain, `beta.chapalaseminary.org`, path `staff`.
   - Policy: **Allow**, include **Emails**: Robert's and Wayne's addresses.
   - Login method: **One-time PIN**.
3. Open the application's **Overview** and copy the **Application Audience
   (AUD) Tag**. That is `ACCESS_AUD`.
4. In `wrangler.jsonc`, add both values to `vars` for production and for beta:
   `"ACCESS_TEAM": "chapala", "ACCESS_AUD": "<the tag>"`.
5. `npm run deploy:beta`, then open `https://beta.chapalaseminary.org/staff/students`.
   Cloudflare asks for an email, sends a code, and shows the roster.

The Worker checks Access's signed token on every staff request: signature,
audience, team and expiry. It does not assume Access is in front of it, because
the Worker also answers at its `workers.dev` address, where the Access rule
does not apply. There, as everywhere, no valid token means no page.

## Switches

In `wrangler.jsonc` `vars`:

| var | production | beta |
|---|---|---|
| `OUTREACH_MODE` | `send` | `off`: nobody is written to; `/staff/notes` still shows who would be |
| `OUTREACH_FROM` | `Wayne Cook at Chapala Theological Seminary <certificates@chapalaseminary.org>` | the same |
| `OUTREACH_REPLY_TO` | not set: falls back to `EMAIL_REPLY_TO` (`info@`) | the same |
| `SITE_ORIGIN` | `https://chapalaseminary.org` | `https://beta.chapalaseminary.org` |

To stop all notes at once, set `OUTREACH_MODE` to `off` and deploy. The
roster and the weekly summary keep working.

Two staff endpoints run the same code by hand. Both need the Access sign-in,
so a plain `curl` is refused:

- `POST /staff/notes/run`: today's notes, now.
- `POST /staff/digest`: the weekly summary as JSON; with `?send=1` it is also
  emailed.

## Where it lives

| file | what |
|---|---|
| `migrations/0008_progress_counts.sql` | `degree_progress` counts only real completions (an empty record showed 1/25) |
| `migrations/0007_levels.sql` | `degree_progress.assoc_done`: courses that count toward the Associate (Associate level or higher) |
| `migrations/0006_retention.sql` | `students.lang`, `students.contact_opt_out_at`, the `outreach` and `contact_tokens` tables, the `student_activity` view |
| `worker/staff.js` | the staff pages and the Access check |
| `worker/outreach.js` | who is written to, the notes, the weekly summary, the stop page, the daily run |
| `worker/notify.js` | completion notices, including the single notice for a returning student's history |
| `test/staff.test.mjs` | 78 assertions (listed under "What is tested") |

## Before the cutover

- Apply the migration to each database:
  `npx wrangler d1 migrations apply chapala-students-beta --env beta --remote`,
  and the same for `chapala-students`.
- Set up Access (above). Done 29 Sept.
- **Wayne reads the notes** at `/staff/notes` on beta. The wording is
  Claude's draft, signed with his name; he should change anything that does
  not sound like him. The text is in `worker/outreach.js`, `note()`.

## What is tested

`test/staff.test.mjs`, in the suite, runs against a real Worker and database
with the suite's own signing key standing in for Access's. That key's private
half is `test/fixtures/access-test-key.json`. It is accepted only by a Worker
whose `ACCESS_JWKS` holds the public half, and `tools/verify-worker-config.mjs`
refuses a deployed config that sets it. It checks:

- every staff page refuses no token, a forged token, another application's
  token, another team's token, an expired token and an altered token;
- the roster, CSV and JSON show a student's program, progress and notices, and
  never a student code;
- a CSV cell a spreadsheet would run as a formula is defused;
- who is written to, and when: nobody after 3 days; a note at three weeks, in
  the student's language, naming the course and linking to the next unit; a
  getting-started note in both languages; no note without an email, after the
  program is finished, or twice in one quiet spell; a new note after new
  progress and a new quiet spell;
- the stop link only acts from its button; stopped students are not written
  to; staff can stop and resume notes, but not from another site;
- deleting a record removes the notes and the stop link;
- the weekly summary and the notes page.

`test/run-tests.sh` also fires the scheduled event and checks that the daily
run completes.
