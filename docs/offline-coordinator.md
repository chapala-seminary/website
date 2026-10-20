# Coordinator-managed study

_20 Oct 2026. This is the plan the site now follows. It matches the pages
merged in pull request 148, and Wayne Cook's letter the same day about the
groups in Liberia, Zambia, Malawi, and Kenya. Haiti stays the group already
named on 20 Oct: Pastor Emmanuel Julien, French, Old Testament Survey, with
learners who registered themselves._

The aim is real credit for learners who have no email, no device, or no
reliable internet, without a lower passing mark.

## Two ways in

**A free email, where that is possible.** At a group meeting the coordinator
helps the learner create an email address, and the learner registers on the
site like anyone else. Nothing new is required for that. Registration already
allows an empty email, and an empty email does not merge two people. A real
address of the learner's own is still the better record when they can have one.

**The coordinator's account, when they cannot.** One coordinator signs in at
`/coord` and enrolls as many learners as are ready. There is no cap. One
hundred learners in one group is the same feature as ten. Each learner gets
their own student code and their own record.

## What is stored, and what is not

The coordinator's email is the sign-in for the group. It is stored on
`study_groups.coordinator_email`, and again on each paper sheet as the person
who entered it. It is not copied onto each learner.

Putting that one address on every learner would make the quiet-student notes,
"email me my code," and a later certificate all go to the same inbox. A
verified address also cannot be replaced, so a learner who later has an email
of their own could not put it on the record. The group row and the sheet
already say which coordinator is responsible. That is the record Wayne asked
for, without sharing one inbox.

A learner enrolled here has no email, the Certificate track, the group's
country, and their own code. The code is shown once, and again on `/coord` if
the paper copy is lost. It is not put in a URL.

Someone who already registered, including under their own email, is added with
`/coord/add` and that same code. A learner already in a group is not added to
a second one.

## The groups

Each group is one coordinator, one country, and one course. Staff create it
at `/staff/groups`. Old Testament Survey is the course the form offers first,
because that is what Kenya already has printed. Choose another course when
the group is studying something else. Liberia's leaders have been in New
Testament Survey; set that group's course to New Testament Survey if that is
the exam they are sitting.

| Group | What is already known |
|---|---|
| Kenya | Overseer Samson Ogamba. Old Testament Survey is printed. |
| Liberia | Moses's group. One sign-in for the group. |
| Zambia | Same path. Name the coordinator and the course when the group is created. |
| Malawi | Same path. Name the coordinator and the course when the group is created. |
| Haiti | Pastor Emmanuel Julien. French. Old Testament Survey. Learners already registered: add them by code. |

The seven foundation courses already have printable lessons. Nothing new is
built for those packets. The exam the learner sits is printed from
`/coord/exam`, in English, Spanish, or French, because that printout is the
order the sheet is graded in, and it carries an exam version. A sheet from an
older printout is refused before anything is written. The printout has no
answer key. Haitian Creole is not on the site.

## Paper, or the coordinator's device

On a day with a connection, the learner can sit the ordinary exam on the
coordinator's device, signed in with their own code. That attempt is theirs.
It does not need a paper sheet.

On paper, the coordinator keeps the sheets and later types the twenty letters.
A blank is the letter X. The server grades the sheet with the same keys, the
same 18-of-20 rule, and the same lock as an online Certificate exam. Credit
is written only after that grading. The coordinator sees the score and passed
or not. They do not see which items were wrong, and they cannot mark a unit
passed by typing a score.

The printed exam asks the coordinator to sign this statement, and the entry
form asks for it again:

> I confirm that this learner completed this exam as their own work.

Without that confirmation, nothing is recorded and the unit is not locked.
The statement is stored with the sheet.

Staff see, at `/staff/groups`, each sheet's learner, unit, score, pass or
not, date, who entered it, and that the statement was confirmed. They do not
see the letters or the key on that list. Staff can enter a sheet themselves,
through the same grading. That is the one feature for "us or the coordinator":
letters in, server grade, then credit. `entered_by` is the coordinator's
address or the staff member's address, whichever person typed the sheet.

A failed sheet can be entered again after the lock (two minutes on the
Certificate track). A sheet that passed by mistype cannot yet be voided.
That void is still a staff action to add before a large group sits exams.

## Master's and Associate learners

A paper sheet is refused for anyone who is not on the Certificate track,
before anything is written. Multiple choice alone cannot pass a master's
unit, and must not lock one. Those learners still take their unit exams on
the website, on a device, with their own code.

Textbook exams and reading exams stay required, the same as for every other
student on that track. This pathway does not waive them, and it does not
transcribe written answers. Associate fill-in and master's short answers on
paper wait.

## Certificates

Not in this version. A pass on the record is. A certificate is still refused
until the learner has a verified email of their own, and the coordinator
cannot issue one.

The next change is a staff action: the same completion rule as today, allowed
for a group member with no verified email, one PDF sent to the coordinator's
own address for that learner, for the coordinator to print and hand over.
The public verification page already shows the name, the award, and the date,
and does not show the student code.

## Where it runs

Real learners belong on `chapalaseminary.org` and `chapala-students`, after
this beta is promoted. Grading on that promotion is live: pull request 146 is
on beta, and the production setting in this branch is `live`. A sheet is
refused unless the running site grades live, so a sheet cannot write credit
on the old shadow production.

Beta is the test before that promotion. It has its own database. Do not
enroll the real groups there. The setup steps are in
`docs/coordinator-setup.md`.
