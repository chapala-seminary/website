# Student records — D1, a Worker, and a sync client

_Stage 2. Built and tested; **not deployed**. The database does not exist yet._

## Why

Registration collects a name, an email, a country and a track, and writes all of
it to `localStorage`. Nothing leaves the browser. A student who clears their
cookies, switches from a laptop to a phone, or reinstalls a browser **loses
their entire degree permanently**, with no recovery path. For a programme whose
M.Div. requires thirty courses, that is the most serious problem in the project.

## The shape

`localStorage` stays in charge. It is instant, it works offline, and it is what
every existing student already has. The database mirrors it.

```
passes a unit  →  localStorage           (instant, offline, unchanged)
               →  POST /api/sync  →  D1  (durable, cross-device)

opens the site on a new phone
               →  enters their student code
               →  GET /api/student/<code>  →  localStorage is rehydrated
```

If the API is down, slow, or absent, the site behaves exactly as it does today.
That is a design constraint, not an aspiration — the tests assert it.

## Identity is a student code

`CTS-XXXX-XXXX-XXXX`, 60 bits, in a 32-character alphabet with no I, L, O or U,
so nothing can be misread between two screens and nothing can spell a word. A
code typed in lower case, without dashes, with spaces, or with an O for a zero
still finds the record.

No email infrastructure, no passwords. The seminary sends no mail, its students
are international and often on poor connections, and a password is one more
thing to lose for a programme most people study once a week.

**The trade-off is real and is not hidden:** the code is a bearer credential.
Whoever holds it holds the record. That is why codes are 60 bits rather than a
counter, why a wrong code and a malformed code get an identical answer (telling
someone they are close is telling them something), and why there is a delete
path. Optional email recovery can be layered on later without changing this.

## Merging is monotonic

A unit passed on any device stays passed, and keeps the **earliest** completion
time either side knows about. Nothing the API does can take progress away from a
student, which is what makes a stale or offline device harmless. Identity
fields are last-writer-wins, because correcting your own name is deliberate and
losing a passed unit is not.

## Endpoints

| | | |
|---|---|---|
| `POST` | `/api/register` | issues a student code |
| `POST` | `/api/sync` | merges a device's state, returns the merged result |
| `GET` | `/api/student/<code>` | rehydrates a device |
| `DELETE` | `/api/student/<code>` | deletes the student and everything attached |
| `POST` | `/api/email/start` | emails a six-digit code to the address given (one a minute, five a day) |
| `POST` | `/api/email/confirm` | stores the address as verified once the code matches (five guesses per code) |
| `POST` | `/api/certificate` | records an award, returns a verification code — **403 `{needs:'email'}` until the student's email is verified** |
| `GET` | `/api/verify/<code>` | JSON |
| `GET` | `/verify/<code>` | **the public verification page** |
| `GET` | `/api/catalog` | public, static: the courses with their units, and every completion code with the course name its certificate page writes |

`/verify/<code>` is the thing a church or an employer opens. It shows the name,
the award and the date, says plainly that the seminary is not accredited, and
shows neither the student code nor their email.

### What a certificate does and does not prove

Grading is still client-side, so a certificate record attests that the seminary
issued a certificate for a name and a course — not that the work was
independently verified. Issuing requires the student's code **and** a record
that supports the award: every unit of the course for a course certificate
(`worker/catalog.json`), and for the degrees the same course counts and
required courses the certificate pages enforce, plus a master's track for the
master's degrees (`worker/awards.js`). A fabricated certificate therefore needs
a fabricated complete record first. Re-printing the same award returns the
same code rather than minting a second one. Server-side grading is the real
fix and is not this table's job.

Closed on 24 Sept (migration `0003_tracker.sql`): a completion now carries
the track it was earned on, taken from the `cts_mdiv_done_codes` /
`cts_thm_done_codes` lists the certificate pages keep, and the sync rebuilds
those lists and the `cts_degree_courses` name roster on a restored device
from the catalog's code → name table. The master's degrees count only
completions earned on a master's track; a completion whose track is unknown
counts as the student's current track.

## For the student tracker

Wayne keeps a private tracker of every student — courses, track, degree
progress, country — and until now filled it from the completion notices the
certificate pages email, which arrive for some students and not others. Once
the site is live he will read the records directly with his own Cloudflare
access. What he needs to know:

**Where.** Cloudflare D1, account `119b0919229edb3185b69f1c6bd04b66` (the
Chapala account). Production database `chapala-students` (bound to the
`chapala-seminary` Worker); beta database `chapala-students-beta`
(`ae98d4cb-2d74-4bc4-a0a0-f01c22e95a7b`, bound to `chapala-seminary-beta`).
Read-only access is all the tracker needs; nothing should write to these
tables except the Worker.

**What.**

| table / view | holds |
|---|---|
| `students` | one row per registered student: `id` (the student code), `name`, `email`, `country` (ISO code as the form collects it), `track` (`cert` \| `thm` \| `mdiv`; the Associate is `cert` with `goal = assoc`), `goal`, `heard` (`search` \| `ai` \| `referral` \| `church` \| `social` \| `other`), `created_at`, `updated_at` |
| `unit_progress` | every unit passed: `course` (storage slug, e.g. `1peter`), `unit`, `completed_at` |
| `course_completions` | every course finished: `code` (e.g. `CTSOTS`), `track` it was earned on, `completed_at` |
| `certificates` | every certificate the site has issued a verification code for (course and degree level), with `revoked_at` |
| `degree_progress` | **the view to read first**: per student, `courses_done`, `foundation_done` (of 7), `masters_done`, `mdiv_core_done` (of 20), `last_completion_at`. Certificate of Ministry = 12 courses incl. all 7 foundation; Associate = 25 incl. foundation; Th.M. = 12 master's-level incl. foundation; M.Div. = 30 master's-level incl. the 20-course core. |

Course codes map to names through `GET /api/catalog` (`completions.CODE.name`);
the names are exactly what the certificate pages write, warts included
(`CTSBIBLE` is "How We Got the Bible |", `CTSCS` is "Chapala Theological
Seminary", because that is how those pages' titles parse).

**Two honest caveats.**

1. `completed_at` is the moment the record reached the seminary, not the day
   the student finished. Progress lived only in browsers until now, with no
   dates; a student who finished twenty courses last year and syncs for the
   first time next month will show twenty completions dated next month. Dates
   are true for anything completed after a student's first sync.
2. Nothing arrives until a student opens the site with the new records live.
   Ken's twenty-two master's courses and Ignacio's twenty-five will appear the
   first time each of them opens any unit page in the browser that holds their
   progress — the sync client registers them and pushes everything up without
   asking. A student whose progress is on a phone they no longer have is not
   recoverable from here; the inbox is the only record of them.

The records also tell the privacy page (`CTSPrivacy.html`) what it shows, and
that page now says the seminary keeps its student roll from them.

## Files

```
migrations/0001_init.sql        students, unit_progress, course_completions, certificates
worker/api.js                   the whole API — a plain fetch handler, no framework, no deps
functions/api/[[path]].js       Pages Functions adapter
functions/verify/[code].js      Pages Functions adapter for the public page
public/assets/js/cts-sync.js    the browser half
test/api.test.mjs               47 assertions against a real Worker and a real D1
test/sync.test.mjs              21 assertions in a real browser, two simulated devices
test/run-tests.sh               npm test
```

`worker/api.js` is a plain fetch handler with no Pages-specific anything, so
moving to a Worker with static assets later is a deploy change, not a rewrite.

## How a student gets their code

Registration issues a code silently. Until something showed it to them, nobody
could restore anything, which made the whole mechanism useless in practice. It
now appears in two places, both hidden until the API is live so that neither
offers a recovery that cannot work yet:

* **The registration card on the front page**, the moment registration saves
  and again on every return visit — the code, a Copy button, and one line
  saying to write it down.
* **The Save & Restore page** (`cts-backup.html`), which already existed to
  protect a student's work with a backup file. It gains a card showing this
  device's code and a box to restore from one typed off another device. The
  card carries no step number, so when it is hidden the page's numbered steps
  still read 1 and 2.

Copying falls back from `navigator.clipboard` to `execCommand`, and finally to
selecting the text, because a secure context is not a given on the webviews
some of these students use.

Restoring only ever adds: a device keeps everything it already had, and the
two sets are merged. `test/code-ui.test.mjs` drives both pages in a browser
against a real API — registering, copying, reloading, and restoring onto a
second device with the code typed in lower case with spaces instead of dashes,
as a person would.

## The client is dormant until the API exists

`cts-sync.js` is already on every unit page, and currently does nothing: it asks
once per tab whether there is an API, remembers the answer, and otherwise stays
quiet. No repeated failing requests, no console noise. **When the database goes
live it starts working by itself**, with no change to 800 pages.

It also never patches `localStorage` and never hooks the exam engine. It takes a
digest of the `cts_*` keys and syncs when that digest changes — a few seconds
slower than a hook, and incapable of breaking an exam.

Existing students are migrated without being asked: on their next visit the
script registers them, gets a code, and pushes their whole `localStorage` up.
Nobody starts over and nobody loses anything.

## What is tested

Both suites run against a real Worker and a real D1, never a stub, because the
question — does a student's progress survive moving to another device — cannot
be answered by a mock.

* progress can only ever be added: an empty sync from a stale device takes
  nothing away, a later timestamp never overwrites an earlier one, and restoring
  onto a device keeps what that device already had
* a code typed in lower case, without dashes, with spaces, or with O for zero
  finds the record; a wrong code is indistinguishable from a malformed one
* the public page escapes what it echoes, and leaks neither code nor email
* with the API unreachable: one probe, no errors, no invented code, and the
  student's own progress untouched
* deleting a record removes its progress, its completions and its certificates

Both were confirmed to **fail** when the behaviour was deliberately broken —
making the merge take the later timestamp, letting a sync delete progress, and
letting a restore clear local keys. A suite that only ever passes is worth
nothing.

## Decided since this was written

1. **The certificate pages** now load the sync client. All 69 of them, checked
   by `tools/verify-certificates.mjs`.
2. **A privacy statement and a delete path.** `CTSPrivacy.html` says what is
   kept and where, shows a student their own record, and deletes it. Linked
   from the footer of every unit page. `tools/verify-privacy.mjs` drives the
   whole thing in a browser against a real Worker, because a delete button that
   does not work is worse than no page at all.

   Building it turned up a defect worth naming: `forget()` deleted the
   seminary's copy but left the student code in the browser, so the next sync
   registered the same person again from the name still in `localStorage` and
   the delete quietly undid itself. It now clears the code and sets an opt-out
   that the client honours until the student says otherwise.
3. **Rate limiting.** Two layers, because the obvious one is thin and the
   natural one is unavailable:
   * A Cloudflare rate limiting rule on `/api/*`. On the Free plan that is one
     rule, matching on path only, counting by IP only, over a fixed ten-second
     window. It stops a flood and nothing slower. `docs/cutover.md` has the
     exact settings.
   * `worker/api.js` counts **failed** lookups per address — 20 in ten minutes,
     then 429 with a `Retry-After`. Failures only, so a class finishing a unit
     together is not throttled while somebody working through guessed codes is.
     Registration is deliberately exempt: a room full of students signing up at
     once is the normal case.

     The Workers rate-limiting binding would have been the natural tool and is
     **not available to Pages Functions**, which is why this is hand-rolled
     against D1. Migration `0002_throttle.sql`; the address is stored hashed,
     because otherwise that table is a log of who used the site and when.

4. **Registering a certificate from the page** (25 Sept, `public/assets/js/cts-certify.js`,
   on every certificate page after the sync client). When a diploma is showing
   and the browser holds a student code, the page asks the Worker for the
   record. Email already verified: it posts `/api/certificate` at once and shows
   the verification code, and prints it as a line inside the diploma
   (`Verification: <code> · chapalaseminary.org/verify/<code>`). Not verified:
   a small panel under the diploma asks for an email, sends the six-digit code,
   confirms it, then registers. The Worker returns the same code for an award
   it has already registered, so a second visit or a second device shows the
   code without asking anything. With no code, no API, or a student who opted
   out, the page is exactly what it was: printable. `tools/verify-certify.mjs`
   drives the whole flow in a browser, including a wrong code, a second
   device, and a degree page.

   Found on the way: a `/api/health` probe cut short by the student navigating
   away was being remembered for the session as "no API", silencing every
   page in the tab. Only an actual answer is remembered now.

## Deploying

The full order, with what to check after each step and how to roll back, is in
**`docs/cutover.md`**. The database part is:

```
npx wrangler d1 create chapala-students
npx wrangler d1 migrations apply chapala-students --remote
# bind D1 = chapala-students to the Pages project (Settings -> Bindings)
```

The binding must be named `DB`; the Worker looks for `env.DB` and answers 503
to everything without it. The Functions deploy with the site, and
`cts-sync.js` notices.
