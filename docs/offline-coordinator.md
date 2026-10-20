# Coordinator-managed study — first version

_19 Oct 2026. Wayne Cook asked for a way to enroll pastors who have no email
address and no internet-connected phone or computer, starting from groups in
Liberia and Haiti. This note answers that letter. It builds on
[issue 96](https://github.com/chapala-seminary/website/issues/96) (14 Oct 2026,
prison and paper study) and does not open a second design._

_It is a design note. Nothing here is built. Making email optional at
registration is already underway in another change; this note depends on that
change and does not specify it again._

## The smallest thing that keeps the records honest

Start with **one coordinator, one group, and one course on the production
site**, with active learners. Their records, passes, and certificates are the
real ones.

| | |
|---|---|
| Place | Liberia. Six B.Th. leaders are already helping a group. One of them holds the coordinator sign-in. The others teach from paper and do not get accounts. |
| Course | New Testament Survey (`CTSNT`), twelve units. |
| Track | Certificate. On that track the server requires multiple choice only: 18 of 20 right on each unit (`worker/grading/rules.js`). Fill-in and short answer stay on the page for students who are online; they are not required for this first group and nobody transcribes them. |
| Size | The learners already studying with those leaders. Enrollment, a paper exam, a later entry, a failure, and a completion are all real student records. |
| Where it runs | `chapalaseminary.org` and the production database `chapala-students`. Grading is live: a submitted sheet writes credit the same way an online attempt does. |

Haiti is the next group on the same production path, once a coordinator and a
language are named. The site has French pages. It does not have Haitian
Creole. A second coordinator is another production group, not a second design.

No new paid service. Sign-in is the Cloudflare Access gate the staff pages
already use. Access is free for up to 50 people (`docs/student-tracker.md`).
The database is the D1 database the site already has.

## What we already have

| Need | Today |
|---|---|
| A unique learner | `students.id` is a CTS code (`CTS-XXXX-XXXX-XXXX`). The code is the record. Whoever holds it can restore the record (`docs/student-records.md`). |
| A person with no email | Registration still requires an email (`worker/api.js`). The other change makes that optional. A blank email must not be stored as the coordinator's address, and it must not join two people into one record. The current duplicate check is "same email and same name." |
| Staff sign-in | `/staff` is Cloudflare Access for Robert and Wayne. It lists **every** student and hides student codes. A coordinator must not be added to that policy. |
| Grading that counts | In live mode the browser holds no answer key. Multiple choice, fill-in and short answer are graded by the Worker (`docs/ai-grading.md`). Credit is written only by the server. |
| A pass mark | Certificate: multiple choice, 90 percent. Associate adds fill-in. Th.M. and M.Div. add short answer. The track is the one stored on the student, not the one a form claims. |
| A failed sitting | The server locks another submit (2 minutes on the Certificate track, 15 on a master's track) and keeps the attempt. |
| An appeal | A learner can appeal a written verdict. Faculty rule on it at `/staff/grading`. At most three appeals are open at once. |
| A certificate | `POST /api/certificate` refuses an award the record does not support. It also refuses until `email_verified_at` is set, so the seminary can reach the person. The public page `/verify/<code>` shows the name, the award and the date. It shows neither the student code nor an email. The PDF prints the verification code, not the student code. |

## The five requests, and the production answer

### 1. Enrollment without email

Each learner gets their own `students` row and their own code. The enroll form
asks for the name they use, country (`LR` for the Liberia group), and language. It
has no email field. The coordinator's address lives only on the group, in
`study_groups.coordinator_email`.

The other change has to keep two rules while it makes email optional:

- an empty email is empty, not a shared inbox;
- the "same email and same name" merge does not run when the email is empty.

### 2. One coordinator, one group

A new sign-in at `/coord`, a second Access application on
`chapalaseminary.org`, with a policy of the coordinator's email. The Worker
checks that signed-in address itself, the
same way `/staff` checks Access (`worker/staff.js`), and loads only the group
whose `coordinator_email` is that address.

The coordinator can:

- enroll a learner into that group;
- see that group's names, which New Testament Survey units the server has
  passed, and the date of the last pass;
- submit a multiple-choice answer sheet for a learner in that group;
- open a learner's code again, on that page, when a paper copy has been lost.

The coordinator cannot:

- open `/staff` or any other group;
- see emails, notes, or degree progress for anyone outside the group;
- mark a unit passed;
- issue a certificate;
- change an attempt after it is submitted.

Proposed tables, small enough to review in one migration:

```sql
CREATE TABLE study_groups (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  coordinator_email TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE study_group_members (
  group_id INTEGER NOT NULL,
  student_id TEXT NOT NULL,
  enrolled_at TEXT NOT NULL,
  PRIMARY KEY (group_id, student_id)
);
```

`attempts` gains `entered_by`, null when the learner submitted online, and the
coordinator's email when the sheet was entered for them. Existing online
attempts stay null.

### 3. Paper now, entry when there is a connection

The coordinator prints, on a day when a connection is available:

- the twelve lesson pages (`CTSNTUnit1.html` through `CTSNTUnit12.html`);
- each unit's exam page.

Live pages do not contain the answer key (`tools/verify-no-keys.mjs`). Printing
them does not hand the key to the room. The first version does not add a
separate answer-key packet. A key on paper in a church office is how answers
leak, and it would throw away the server grading already used for credit.

Each exam is an answer sheet of twenty letters, A–D, with the learner's name
and code written on it. The coordinator keeps the sheets, supervises the
sitting, and later enters those twenty letters on `/coord`. That is one unit
at a time, not the prose of the short answers.

New Testament Survey is 12 units × 20 multiple-choice items. One learner is
240 letters. Eight learners are 1,920 letters, entered as twenty choices per
unit. That is the work the first group does on the live site. Scanning a
bubble sheet can wait until these learners have used the letter sheet.

### 4. The same academic rules, with an audit

The coordinator's entry is an attempt for that student code. The server grades
it with the same keys, the same 18-of-20 rule, and the same lock as a learner
who clicked the buttons. A failed sheet cannot be edited. After the lock, a
new sitting is a new attempt. A pass is the server's pass.

The coordinator screen shows the score and passed or not. It does not show
which items were wrong and it does not show the key. The item-by-item record
stays in `answer_grades` for Wayne and Robert.

A multiple-choice item is objective, so the appeal that matters here is "the
sheet was typed in wrong." The coordinator does not edit the attempt. They
tell Wayne. Wayne voids that attempt with a note, and the coordinator enters
the sheet again. Written-answer appeals stay on `/staff/grading` and are
outside this first group, because the Certificate track does not require them.

A certificate is not "the coordinator says the group attended." It is still
refused until every unit of the course is in `unit_progress` from those
attempts (`worker/api.js`, `worker/awards.js`).

### 5. Recovery, and the certificate, without a group email

The code is written on the learner's paper and in the coordinator's book at
enrollment. `/coord` can show it again for a member of that group. It is not
put in email, in the weekly digest, or on `/staff/students`.

When a learner later has a browser, they restore on `cts-backup.html` by
typing the code, as any student does. When they later have an email of their
own, they confirm that email on their own record. That address is theirs.
It is not the coordinator's.

Certificates are issued by Wayne or Robert on the production staff pages, from a
staff action that:

- requires the same completed record as `/api/certificate`;
- allows a group member with no verified email, and records who issued it
  and which coordinator will hand it over;
- does not email the learner, because there is no learner address;
- returns the verification code that the PDF already prints.

Wayne sends that one PDF to the coordinator's own address, one learner per
message. The public `/verify/<code>` page is what a church checks. It already
omits the student code.

## What this costs

Nothing new to buy. The production Worker, the production D1 database, and one
Access seat for one coordinator email. Staff time is printing twelve lessons, holding the
sittings, and entering twenty letters per unit per learner. Faculty time is
a void-and-reenter when a sheet was mistyped, and the usual certificate
check when the twelve units are on the record.

## Decisions needed before the code

1. The one coordinator's name and email, for the production Access policy.
2. Confirm the first course is New Testament Survey on the Certificate track,
   so only multiple choice counts.
3. Confirm a learner is identified by the name they give, country, and the
   group. No phone number and no government identity number.
4. Confirm Wayne or Robert will issue the paper certificate from the server
   record when email is absent, and that the coordinator cannot issue it.
5. Confirm the coordinator sees pass or fail and the score, not the missed
   items.
6. Whether all six Liberia leaders enter sheets, or only one. This note
   assumes one sign-in. A second sign-in is another row in Access and another
   `coordinator_email`, still on the same group, only if Wayne asks for it.

## Left for a later version

- Haiti, and any language the site does not already teach in. Same production
  path, another coordinator, once the language of the printed packet is chosen.
- Associate fill-in, and master's short answers, including server-side AI
  grading of transcribed prose. The grading path can take that text later.
  This first group does not collect it.
- A scannable sheet.
- Prison facilities, where the same paper path may apply and the facility's
  own rules on what may be stored still have to be answered (issue 96).

The email-optional registration change has to be on production before a
coordinator enrolls the first learner. The six decisions above are still
needed. After that, the group is created on `chapalaseminary.org` and their
work counts.
