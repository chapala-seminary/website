# The journey suite (`e2e/`)

`test/run-tests.sh` checks each feature on its own: the sync API, the grading
rules, a certificate page, a restore. The journey suite chains them the way a
student meets them: sign up on the front page, sit exams, restore a second
device with the code, change track, ask for a human review. It looks at what
the student sees at each step and at the seminary's record behind it.

It exists because the bugs that reached students lately were all of this
shape, and none was caught by a feature test:

- a degree page showed "0 / 30, not yet eligible" to a student who had
  finished, on a device the student had not used before (#310; found by
  walking through an M.Div. by hand);
- an old phone that still said "Certificate" moved master's students back
  down (#298, #292, #239, #183; found in production data).

## Running it

```bash
npm run build
```

```bash
npm run test:e2e
```

One file, or one test by its title:

```bash
npm run test:e2e -- e2e/two-devices.spec.mjs
```

```bash
npm run test:e2e -- -g "appealed"
```

After a failure, the report has a trace of every step (pages, clicks, network,
console) and a screenshot of each device:

```bash
npx playwright show-report e2e-report
```

It needs what `npm test` needs: the build in `dist/`, the private assessment
keys (`ASSESSMENT_KEYS`, or `../assessment-keys`) and Playwright's Chromium.
It starts its own Worker on port 8808 with a fresh local database in
`.wrangler-e2e/` (`e2e/serve.mjs`), so it can run beside `npm test` (port 8798).
Start-up takes about three minutes, most of it loading the 35,000 grading keys.

## What it covers

| File | The journey |
|---|---|
| `two-devices.spec.mjs` | A Certificate student signs up, passes units on a laptop and a phone, finishes Church History on the laptop; the phone, now behind, shows the Certificate of Ministry and the course certificate. |
| `track-protection.spec.mjs` | The student moves to the M.Div. on the laptop; an old phone that still says Certificate takes the record's track, is graded at master's level, and does not move the record back. Moving down works the same way. |
| `appeal-to-staff.spec.mjs` | A Th.M. student fails a unit by one short answer and appeals it from the page; staff overturn it on the staff grading screen; the student has passed. |
| `spanish-student.spec.mjs` | Sign-up, an exam answered in Spanish and a restore, all on the Spanish pages. |
| `page-health.spec.mjs` | Three pages of every kind (unit, certificates, degree pages, reading rooms and tests, textbook tests, finals, papers, course pages, digests, front and help pages) in English, Spanish, French and Swahili: no script error, console error, failed file or empty title. `E2E_SWEEP=all` opens every page. |

Every device in every test also fails the test on any script error, unexpected
dialog, page or file of the site that fails to load, or a 500 from the Worker
(`e2e/fixtures.mjs`), whether or not the step looked at it.

## Writing a journey

- Use the screens a student uses (`e2e/lib/student.mjs`): `signUp`,
  `restoreWithCode`, `openExam` (pledge and "Take the exam"), `takeUnit`,
  `changeTrack`. If a journey needs a screen that has no helper, write one.
  Reaching past the page (localStorage seeds, `CTS_SYNC.restore`) belongs in
  the feature tests.
- Set up only what would take too long through the site, in the database,
  with `priorUnits` and `priorCourses` (`e2e/lib/site.mjs`), and say so in
  the test. Those writes come from a second process on the Worker's SQLite
  file, and a Worker request that arrives meanwhile fails with HTTP 500. So a
  spec that writes to the database goes in `SEEDS_D1` in
  `playwright.config.mjs`. Specs listed there run on their own, after the
  other specs have finished, and are skipped if any of those failed.
- Check the record through the API the browser uses (`record(code)`).
- Every person is made up (`person()`), with an `example.test` address.
- No retries. A journey that passes on the second try has found a race.

## Known bugs held by the suite

A test marked `test.fail()` describes a bug that is known and not yet fixed.
It is expected to fail, so the suite stays green; when the bug is fixed the
test passes, Playwright reports that as a failure, and the marker must be
removed. Each has a comment saying what the bug is. None is held today.

Found and fixed so far:

- A course certificate page opened on a device that was behind kept showing
  "units still to do" after the record had arrived, until the student
  reloaded: 57 of the 62 course certificate pages with unit pages (found on
  the suite's first run, 10 Nov 2026; measured on every page, 11 Nov). The
  sync client now reports what credit a record brought that the browser
  lacked (`cts-sync-applied`, `detail.credit`), and `cts-certify.js` opens a
  course certificate page again once when that credit is for its course --
  not on the pages that redraw themselves, never while the student types, and
  never twice in 30 seconds. `two-devices.spec.mjs` checks both sides: a
  device that is behind reopens once; one that is up to date does not.

## In CI

`pr-checks.yml` runs the suite as its own job, **CTS journey tests**, beside
**CTS build and tests**, on every pull request to `beta` and `main`.
`beta.yml` runs it beside the feature tests, and publishes to beta only when
both pass. CI keeps no traces, screenshots or report: they hold the answer
keys the journeys type, and this repository's Actions artifacts are public.
Reproduce a CI failure locally, where both are kept.
