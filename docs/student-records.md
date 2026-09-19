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
| `POST` | `/api/certificate` | records an award, returns a verification code |
| `GET` | `/api/verify/<code>` | JSON |
| `GET` | `/verify/<code>` | **the public verification page** |

`/verify/<code>` is the thing a church or an employer opens. It shows the name,
the award and the date, says plainly that the seminary is not accredited, and
shows neither the student code nor their email.

### What a certificate does and does not prove

Grading is still client-side, so a certificate record attests that the seminary
issued a certificate for a name and a course — not that the work was
independently verified. Issuing requires the student's code **and** matching
progress rows, so a fabricated certificate needs fabricated progress first, and
re-printing the same award returns the same code rather than minting a second
one. Server-side grading is the real fix and is not this table's job.

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

## Still to decide before this goes live

1. **The certificate pages** write `cts_done_codes` and do not yet load the sync
   script. A student who finishes a course and then opens any unit page still
   gets it synced, so nothing is lost — but the delay is avoidable.
2. **A privacy statement and a delete path in the UI.** `CTS_SYNC.forget()`
   exists; a page that calls it does not. Storing names, emails and countries
   server-side turns a `localStorage` app into a system holding personal data on
   identifiable people across jurisdictions. Small work now, unpleasant later.
3. **Rate limiting.** 60 bits makes guessing a code infeasible, but a
   Cloudflare rate-limiting rule on `/api/*` costs nothing and should exist.

## Deploying

```
npx wrangler d1 create chapala-students
npx wrangler d1 migrations apply chapala-students --remote
# bind D1 = chapala-students to the Pages project (Settings → Bindings)
```

Nothing else. The Functions deploy with the site, and `cts-sync.js` notices.
