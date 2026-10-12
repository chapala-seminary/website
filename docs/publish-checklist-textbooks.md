# Publishing the textbooks and reading tests: Robert's checklist

_12 Oct 2026. For the stacked draft pull requests #40 to #49 and #51 to #54, the pull requests on top of #54 (#55, #57, #58, #59), and the separate #50. Nothing here
has been merged or deployed. Dr. Cook approves before anything goes live._

## What is in the stack

The pull requests build on one another, and each one contains everything
below it:

| PR | What it adds |
|---|---|
| #40 | Master's tests: combines #35 and #36, plus NKJV and Spanish fixes |
| #41 | Preaching (WiseSpeak) records through the shared recorder |
| #42–#43 | The eight five-reading tests, open to all and required of no one |
| #44 | Five more reading tests; the full English textbooks for Joshua, Galatians and Romans, with CTS Spanish chapters |
| #45–#46 | The Galatians, Romans and Joshua exams (switched off) |
| #47 | The excerpt-textbook page; 1 Peter |
| #48 | The seven new textbooks ready to publish: multiple-choice exams, Spanish fixed, `tools/activate-required.mjs` |
| #49 | The Acts, Revelation, Psalms and Pentateuch textbooks; Holy Spirit, Doctrines, Parables, Bible Hand-Book and Pastor; six more reading tests; one standard notice per room (`tools/room-test-notices.mjs`) |
| #51 | Church History, Old and New Testament Survey, Life of Christ and Christian Education |
| #52 | Hermeneutics, Apologetics, Evangelistic Preaching, World Missions, Genesis and Matthew |
| #53 | World Religions and Church Administration textbooks; reading tests for the last 22 rooms (every course now has one) |
| #54 | Christian Ethics (Alexander), Preaching (Broadus) and Practical Theology (Collins, *Soul Care*) textbooks; Ethics joins the catalog as a single-page course, code ETHICS. `ethics_certificate.html` gets the certificate gate in #59 |

Five pull requests sit side by side on top of #54. Each contains #54 but not the others:

| PR | What it adds |
|---|---|
| #59 | **Fixes from the 11 Oct audit — merge this one first.** `npm run build` failed on #54: a reading page name could not contain a digit (`CTS1PeterReadings`, `CTSBibleCharacters2Readings`). Unit pages lost their reading-test link when built per language. 70 certificate pages now load `cts-required-tests.js` before `cts-textbook-gate.js`. About 3,300 accepted alternates on 30 reading tests; give-aways reworded; the live Genesis reading test now asks what its five readings teach; Jonah and the juniper tree in the Bible Characters rooms |
| #55 | Radical Christianity textbook (*Holiness Through the Ages*) |
| #57 | Church Growth textbook (Nevius), number 63 |
| #58 | Bible Characters textbook (Whyte, *Adam to Achan*), number 64 |
| #56 | Christian Ethics reading test — its title says not to merge yet |

They all change the generated files (`worker/catalog.json`, `public/assets/js/cts-required-tests.js` and the `?v=` on the certificate pages), so merge them into `claude/textbooks-batch6` one at a time and, after each, take either side of a conflict in those files and rerun:

    node tools/gen-worker-catalog.mjs
    node tools/room-test-notices.mjs --write
    node tools/import-readings.mjs --write

Testing `claude/textbooks-batch6` after those merges tests the whole stack. Bible Characters II still has no textbook: it needs Whyte's later volumes.

**#50 is separate.** It is based on `main` and carries the approved corrections to the nine live textbook exams (`src/data/textbooks/corrections.json`). It can be built, tested and deployed on its own, before or after the stack. #35 to #39 are
older drafts. Check which of them are still needed before merging #40, which
already combines #35 and #36.

## 1. Build and test on the Mac

    git fetch origin
    git switch -c review/textbooks origin/claude/textbooks-batch6
    npm ci
    node tools/gen-worker-catalog.mjs --check      # must say "current"
    npm run build
    test/run-tests.sh

These checks were **not** run in Claude's environment, so they are the ones to
watch:

- [ ] `npm run build`, which applies the schema in `src/content.config.ts`
      to every exam: each answer must be among its choices, at the same place
      in both languages.
- [ ] `test/api.test.mjs` and `test/migration.test.mjs`. Their fixtures
      include M.Div. completions of courses that now have tests (Psalms,
      Joshua, Matthew, Romans…). They should pass as shipped, because every
      new test is `requiredFrom: null`.
- [ ] `tools/verify-fill-single.mjs` and `tools/verify-required-tests.mjs`
      (Playwright, built site).

## 2. Look at the pages (desktop and phone, English and Spanish)

For one excerpt book (Evangelism or Acts) and one full-book textbook (Joshua):

- [ ] The book page shows the readings in both languages and the notice "optional for now".
- [ ] The test page shows "Multiple Choice / Opción múltiple" and 20 questions, 4 from each group (Revelation: 2 from each of its 10 excerpts).
- [ ] A wrong click shows "✗ Incorrect. Answer: …". 18 of 20 passes. 17 of 20 fails and locks the page for the wait.
- [ ] A reload in the middle of an attempt keeps the same 20 questions and the answers given.

For one reading room (Psalms or Revelation):

- [ ] One textbook-test notice at the top and one reading-test notice before the honors card. Both links open.
- [ ] The reading test is fill-in-the-blank and marks each answer at once.

Then:

- [ ] A Certificate or Associate completion is unchanged: no test is needed.
- [ ] A test pass reaches the student record, and the certificate page says what is missing.

## 3. Deploy

    npm run deploy:beta     # then check the pages above on beta
    npm run deploy          # production, after Dr. Cook approves

Only these two commands are used, because they refuse the wrong Cloudflare
account. Never run bare `wrangler`.

- [ ] Open the live URLs and confirm the new pages respond before telling anyone that they are live.

## 4. Make the tests required (a second, separate deploy)

Until this step, every new test is open to everyone and required of no one.
Dr. Cook announces a start date, which must be **after** the deploy that carries it:

    node tools/activate-required.mjs --list
    node tools/activate-required.mjs --at 2026-11-01T06:00:00Z --all-pending            # dry run: lists the tests (74 with #54; 77 with #55, #57 and #58)
    node tools/activate-required.mjs --at 2026-11-01T06:00:00Z --all-pending --write
    npm run build && test/run-tests.sh
    npm run deploy

- [ ] Use `--except <slug>,…` to leave any test optional.
- [ ] Deploy **before** the date: a completion recorded before the date by an older Worker would not know about the requirement.
- [ ] From the date, an M.Div. or Th.M. completion needs both tests. A master's completion that is already on the record is kept (`worker/awards.js` `testCounts`).
- [ ] The room notices do not change. The test pages switch to "required" by themselves.
- [ ] Tell students by email only. Do not use phone or WhatsApp.

## 5. Project notes

- [ ] Merge the brain's draft PR #21 (`project/website-memory-update-textbooks`) once the stack is merged.

## Not in the stack (waiting on Dr. Cook)

- The required-email registration change.
- ChatGPT's drafts: Matthew, World Missions, the Genesis supplement and Hermeneutics.
