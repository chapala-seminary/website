# Answer exposure audit: the core courses

_25 Oct 2026. Branch `claude/core-keys-private`; keys branch
`core-keys-private` in `chapala-seminary/assessment-keys`._

This repository is public on GitHub. The private repository
`chapala-seminary/assessment-keys` holds answer keys. Until now only the 20
denominational electives kept everything there. This audit looks at the 45
core courses (their textbook tests, reading tests and unit exams). It asks
two things:

- What reaches a student's browser?
- What is in this public repository that a student could use to recover an
  answer?

"Derived from an answer" means anything computed from the answer, such as a
hash. A short hash of a prompt and its answer can be reversed by trying
likely words. So it counts as the answer.

## Summary

| | Before | Now |
|---|---|---|
| Browser, live mode (beta and production) | No keys. Answers arrive only with a passed attempt. | Unchanged. |
| Unit exams, 41 courses, 466 files | Every key public in `src/content/units` | Keys in `assessment-keys/units` |
| Reading tests, 45 tests, 1,800 questions | Answers, accepted answers and French stamps public | In `assessment-keys/readings` |
| Reading test sources (`src/data/readings`) | Public | In `assessment-keys/readings-src` |
| Textbook tests, 45 books, 1,800 questions | Answers already private; French stamps public | Stamps in `assessment-keys/textbooks` |
| Review pins, 10,800 | Public | In `assessment-keys/exam-review-references.json` |
| Content baseline | Every MC answer index and fill-in answer hash public | Answer-free fingerprints only |
| Staged banks, corrections, faculty ledgers | Public | In `assessment-keys` |
| Single-page courses (Counseling, Narrative, WiseSpeak, Ethics) | Keys in `public/` page sources | **Unchanged**; needs a design change |
| Review packets (`_review/fill-ins`, `_review/french/CTS*`) | Keys public | In `assessment-keys/review` |
| Grader eval set (`test/eval`) | Keys quoted | **Unchanged**; see "Not moved" |
| Git history | | **Still holds everything above.** See "History". |

## (a) What must reach the browser

Grading is on the server. Production and beta build in `live` mode
(`docs/ai-grading.md` section 1). In that mode:

- Unit, textbook and reading test pages carry no answer, accepted answer,
  explanation, model answer, keyword list, rubric or MC answer index.
  `tools/verify-no-keys.mjs dist` checks this on every build. A textbook or
  reading test page ships no question bank at all; the server sends the
  wording of the questions it drew.
- During an attempt, and after a failed one, the server says only right or
  wrong.
- After a **passed** attempt the server sends the right answers, the
  explanations and the review passages for the questions drawn in that
  attempt. This is the answer-disclosure policy Wayne approved on 18 Oct
  2026. It is the only point where keys reach a browser, and it is by design.
- Review passages are written to `dist/assets/exam-review/*.json`. The Worker
  refuses that folder to a browser (`worker/index.js`). Only the Worker reads
  them.
- The WiseSpeak practice exercises (`U1_ANSWERS`, `U7_FILL`) keep their
  answers on the page on purpose. They never count for credit.

Nothing here is obfuscated, because nothing needs to be: the browser grades
nothing in live mode.

`shadow` mode is the exception. It builds the pages as they were before
server grading, with keys inlined, and grades in the browser. It is used by
the test suite only (production left it on 19 Oct 2026). A shadow build must
never be deployed. Nothing in this change alters either mode.

**Nothing in (a) needed fixing.**

## (b) What was public but did not need to be

Everything below was in this public repository, never in a live page. None of
it is needed in a browser. All of it is build or review data.

### Moved in this change

1. **Unit exam keys of the 41 unit-based core courses**
   (`src/content/units/<Prefix>/<n>.json`, 466 files). These carried:
   - 9,320 MC answer indexes and their explanations;
   - 4,660 fill-in answers with their accepted answers;
   - 4,660 short-answer model answers, keywords and rubrics;
   - the per-question French and Spanish stamps.

   They now use the electives' mechanism (`docs/denominational-electives.md`):
   - the questions without keys are in `src/content/units-public/<Prefix>/`;
   - the keys are in `assessment-keys/units/<Prefix>/`;
   - `tools/private-units.mjs` joins them before every build into
     `src/content/units/<Prefix>/`, which `.gitignore` now lists.

   The joined files are byte-for-byte the files that were committed, so the
   build, the grading-key sync and every test read the same data as before.
2. **Reading test keys of the 45 core reading tests**
   (`src/content/readings/<slug>.json`). These carried answers, accepted
   answers and French stamps (`tr`, a hash of prompt and answer). Each file
   now says `keys: "private"` and keeps only prompts, reading numbers, titles,
   draw and pass mark. The keys are in `assessment-keys/readings/<slug>.json`,
   the way the elective reading tests already worked
   (`docs/reading-rooms.md`, "Private reading tests"). Joined again, every
   question is identical to the one that was committed.
3. **The reading banks they were imported from** (`src/data/readings/*.bank.json`,
   `*.accept.json`, the revised World Religions bank and the eight staged
   banks in `staged/`). These are now in `assessment-keys/readings-src/`
   (`staged/` beside it). `tools/import-readings.mjs` treats every row as
   private. `tools/wr-readers.mjs` and `tools/verify-staged-readings.mjs` read
   the banks from there. The staged manifest stays public; it holds file
   hashes, not answers.
4. **The French stamps of the 45 core textbook tests**
   (`src/content/textbooks/<slug>.json`). Their answers were already private;
   their stamps hashed those answers. Each book now says `keys: "private"`, and
   the stamps are in `assessment-keys/textbooks/<slug>.json`, as for the
   elective books.
5. **The 10,800 exam-review pins** (`src/data/exam-review-references.json`).
   Each one fingerprints a prompt together with its answer, and names the
   paragraph that holds the answer. They are now in
   `assessment-keys/exam-review-references.json`, and the public file is gone.
   `tools/exam-review.mjs` no longer needs it.
6. **The content baseline** (`tools/content-baseline.json`). It recorded
   every MC answer index and a hash of every fill-in answer, so that a changed
   answer would be noticed. It now records only question text, as it already
   did for the electives. The guard against an answer changing by accident is
   therefore weaker; see the recommendations.
7. **Textbook test corrections and drafts.** These are now in
   `assessment-keys/textbooks-src/`:
   - `src/data/textbooks/corrections.json` set textbook answers;
   - `src/data/textbooks/staged/*.json` are draft banks;
   - `docs/textbooks-staged/*` are faculty ledgers that quote each answer.

   Faculty answer ledgers for the eight staged reading banks
   (`docs/readings-staged/faculty_*`) moved to
   `assessment-keys/readings-src/staged/faculty/`.

8. **Review packets of the unit courses.** These are now in
   `assessment-keys/review/`:
   - `_review/fill-ins/` held the drafted fill-ins, Wayne's review sheets
     and accepted-answer variants;
   - `_review/french/CTS*/` held the French translation packets of the 40
     unit courses, with every key.

   `tools/import-french-drafts.mjs`, `tools/add-fill-ins.mjs`,
   `tools/add-fill-ins-page.mjs`, `tools/fill-variants.mjs` and
   `test/french-import.test.mjs` read them from there.

`tools/verify-no-keys.mjs` now fails if:
- any reading or textbook bank is not private;
- any unit folder lacks its keyless public twin;
- a review pin is kept in this repository.

### Not moved, and why

- **The single-page courses** (Counseling, Narrative Preaching, WiseSpeak
  Preaching, Pastoral & Christian Ethics). Their exams, with every key, are in
  the page sources in `public/` (`CTSCounseling.html`,
  `CTS_Narrative_Preaching.html`, `CTS_WiseSpeak_Preaching.html`,
  `ethics_unit01.html` to `ethics_unit10.html`), in
  `public/assets/js/fill/*.js`, in `src/data/single-rubrics/`, and in their
  French packets in `_review/french/{Counseling,Ethics,NarrativePreaching,WiseSpeak}`.

  The live build strips the keys before the pages are published, so students
  do not get them from the site. But anyone can read them on GitHub. Fixing
  this is a design change: these pages are served exactly as written in
  shadow mode (`tools/single-pages-lib.mjs`). The fix is to move their
  questions into unit files, as the other courses have. Then the private-units
  mechanism covers them too.
- **The grader eval set** (`test/eval/*.json`). It quotes unit keys to measure
  the AI grader. `tools/eval-lib.mjs` already leaves private courses out when
  it builds a new set. The committed set should move to assessment-keys
  together with the eval tools' path.
- **Prose that names answers.** Some findings and decision notes quote
  questions with their answers (for example `_review/french/BATCH*-FINDINGS.md`
  and `docs/batch2-findings-disposition.md`). They are not data, but they are
  worth a reading pass.

## History

Moving files does not remove them from git history. Every key listed above
can still be read from earlier commits of this public repository, and from
any fork or clone made before today. The new layout keeps **future** keys
private: new questions, changed answers and new courses. Two options would
also protect the existing keys:

1. **Rewrite history** (for example with `git filter-repo`) to drop the
   answer-bearing paths. Then force-push every branch and ask everyone with a
   clone to re-clone. Forks and old clones keep the data. This breaks every
   open pull request and every recorded commit SHA, including the release
   approvals in `docs/beta-staging.md`.
2. **Rotate the questions.** Write new questions, or new draws from larger
   banks, for the exams that count most (the master's tests first). This is
   faculty work, but it is the only way to make the published keys worthless.

## Recommendations for Wayne

1. **Merge `core-keys-private` into `main` of `assessment-keys` before this
   website branch reaches beta.** The beta and pull-request Actions check out
   `assessment-keys` at `main`. Without these keys the build stops (on
   purpose) rather than build exams with no answers.
2. **Exam editing in the CMS.** The editor (Sveltia) edits files that are in
   git. The joined unit files are not in git any more, so core-course exams
   can no longer be edited there; lessons still can. Exam keys are edited in
   `assessment-keys`, as for the electives. If exam editing in the CMS
   matters, the follow-up is a CMS collection that edits only the question
   wording in `units-public`.
3. **Decide about history.** Option 1 or option 2 above, or neither. For a
   free seminary whose credit is not sold, rotating the master's-track
   questions over time may be enough.
4. **Single-page courses.** Converting the four single-page courses to unit
   files is the one design change needed to take their keys out of this
   repository.
5. **Tools that write unit keys.** `src/content/units` is now rebuilt from
   `assessment-keys` before every build, so a change written there is lost.
   `tools/apply-accepts.mjs` (approved synonyms from the staff grading page)
   now writes accepted answers to `assessment-keys/units`. Older tools that
   still write `src/content/units` directly must have their result copied to
   `assessment-keys/units` until they are changed the same way:
   `tools/add-fill-ins.mjs`, `tools/fill-variants.mjs --apply`,
   `tools/import-french-drafts.mjs --write` and `tools/translate-lesson.mjs`.
   The electives already had this limit.
6. **A private answer baseline.** The public content baseline no longer
   notices a changed answer. A copy that records answers could live in
   `assessment-keys` and be checked when it is present.
7. **Do not re-run `tools/import-readings.mjs --write` without reading its
   diff.** Its banks now carry a `revision` for 32 tests whose published
   files have none. Writing would add one, and a new revision restarts a
   student's unfinished attempt. This is old drift, not part of this change,
   but the importer is now the only way to rewrite these files.
