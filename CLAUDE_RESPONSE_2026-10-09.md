# Claude's review: courses, textbooks and required readings

**Date:** 9 October 2026 · **Reviewer:** Claude, for Dr. Wayne Cook, to be reconciled with Codex
**Code reviewed:** `main` at `2887884` (8 Oct 2026, "French pilot pipeline"), the newest commit on GitHub. Branch `wayne-audit-4` is an older snapshot, and this file is the only thing added to it.
**Scope:** audit only. No course, exam, student-record or application file was changed, and nothing was merged or deployed. The student database was read, never written, and only to count records; no names, emails or codes appear here.

## Summary

- **What works.** The nine textbooks are complete and wired in. So are the two required-reading tests, Genesis Intensive and World Religions. Each has 40 fill-in-the-blank questions; 20 are drawn per attempt and 18 are needed to pass. On the M.Div. and Th.M. tracks, the course is held until its test is passed, and this is enforced in three places:
  - the student's browser;
  - every certificate page of those 11 courses;
  - the Worker. It refuses to record the completion or issue the certificate, and degrees count only recorded completions.
- **The main gap is the requirement, not the code.** 34 of the 45 courses have no required test of any kind. A Master's student completes them by passing the units alone.
  - Required readings exist as tests for 2 courses only.
  - The five readings in every course's reading room are read for *honors*. That attestation is optional and kept only in the student's browser.
  - Only nine textbooks have ever been in this repository (full git history checked). The other courses' textbooks, the book-to-course map and their question sets have **not reached the repository**. That is an integration gap; it does not mean the material was never written.
- **One confirmed defect** lets a Master's student's *browser* count two textbook courses as complete without the textbook test: Counseling and Narrative Preaching, both single-page courses. The official record is not affected (see D1).
- **Data check.** The student record holds **no** Master's-level completions in any of the 11 courses that have a test. So no current student is held by the textbook or reading rule today.

## Course-by-course status (main, 9 Oct 2026)

"Units only" means a Master's completion needs nothing beyond the course's units. "Held until test passed" means the course also waits for its textbook or reading test.

| # | Course (code) | Format | Degree role | Reading room (CTS readings) | Textbook + test | Required-reading test | Master's completion today |
|---|---|---|---|---|---|---|---|
| 1 | 1 Peter Intensive (`CTS1PETER`) | 12 units | Elective | CTS1PeterReadings (5) | — | — | Units only |
| 2 | Acts (`CTSACTS`) | 11 units | M.Div. core | CTSActsReadings (5) | — | — | Units only |
| 3 | Apologetics (`CTSAPOL`) | 10 units | M.Div. core | CTSApolReadings (7 readings) | — | — | Units only |
| 4 | Bible Characters (`CTSBIBLECHARACTERS`) | 12 units | Elective | CTSBibleCharactersReadings (5) | — | — | Units only |
| 5 | Bible Characters II (`CTSBIBLECHARACTERS2`) | 11 units | Elective | CTSBibleCharacters2Readings (5) | — | — | Units only |
| 6 | Christian Education (`CTSCE`) | 10 units | M.Div. core | CTSCEReadings (5) | — | — | Units only |
| 7 | Church Administration & Leadership (`CTSAL`) | 10 units | M.Div. core | CTSALReadings (5) | — | — | Units only |
| 8 | Church Growth (`CTSCG`) | 12 units | Elective | CTSCGReadings (5) | — | — | Units only |
| 9 | Church History (`CTSCH`) | 10 units | Foundation | CTSCHReadings (5) | — | — | Units only |
| 10 | Counseling (`COUNSELING`) | single page | M.Div. core | CTSCounselingReadings (5) | Biblical Counseling (40 Q) | — | Held until test passed |
| 11 | Counseling Situations (`CTSCS`) | 13 units | Elective | CTSCSReadings (5) | Counseling Situations (40 Q) | — | Held until test passed |
| 12 | Cults & World Religions (`CTSCULTS`) | 10 units | Elective | CTSCultsReadings (5) | Cults and the Gospel (40 Q) | — | Held until test passed |
| 13 | Deacon Family Ministry Plan (`CTSDEACONFAMILYMINISTRY`) | 10 units | Elective | CTSDeaconFamilyMinistryReadings (5) | The Deaconship (Howell, adapted) (40 Q) | — | Held until test passed |
| 14 | Doctrinal Preaching (`CTSDP`) | 10 units | Elective | CTSDPReadings (5) | Doctrinal Preaching (40 Q) | — | Held until test passed |
| 15 | Evangelism (`CTSEVANGELISM`) | 13 units | Foundation | CTSEvangelismReadings (5) | — | — | Units only |
| 16 | Evangelistic Preaching (`CTSEVANPREACH`) | 10 units | Elective | CTSEvanPreachReadings (5) | — | — | Units only |
| 17 | Galatians Intensive (`CTSGALATIANS`) | 12 units | Elective | CTSGalatiansReadings (5) | — | — | Units only |
| 18 | Genesis Intensive (`CTSGENESIS`) | 12 units | M.Div. core | CTSGenesisReadings (5) | — | CTSGenesisReadings (40 Q) | Held until test passed |
| 19 | Hermeneutics (`CTSHERMENEUTICS`) | 11 units | M.Div. core | CTSHermeneuticsReadings (5) | — | — | Units only |
| 20 | How We Got the Bible (`CTSBIBLE`) | 10 units | Elective | CTSBibleReadings (5) | — | — | Units only |
| 21 | Joshua (`CTSJOSH`) | 10 units | Elective | CTSJoshReadings (5) | — | — | Units only |
| 22 | Language Appreciation (`CTSLA`) | 11 units | M.Div. core | CTSLAReadings (5) | Language Appreciation (40 Q) | — | Held until test passed |
| 23 | Matthew Intensive (`CTSMATT`) | 13 units | M.Div. core | CTSMattReadings (5) | — | — | Units only |
| 24 | Narrative Preaching (`STORYTEL`) | single page | Elective | CTSNarrativePreachingReadings (5) | Narrative Preaching (40 Q) | — | Held until test passed |
| 25 | New Testament Survey (`CTSNT`) | 12 units | Foundation | CTSNTReadings (5) | — | — | Units only |
| 26 | Old Testament Survey (`CTSOTS`) | 13 units | Foundation | — | — | — | Units only |
| 27 | Parables of the Bible (`CTSPARABLES`) | 15 units | Elective | CTSParablesReadings (5, other layout) | — | — | Units only |
| 28 | Pastoral & Christian Ethics (`ETHICS`) | single page | Elective | CTSEthicsReadings (5) | — | — | Units only |
| 29 | Pastoral Ministries (`CTSPM`) | 12 units | Foundation | CTSPMReadings (5) | — | — | Units only |
| 30 | Pentecostalism & the Charismatic Movement (`CTSPENTECOSTAL`) | 12 units | Elective | CTSPentecostalReadings (5) | Pentecostal and Charismatic Theology (40 Q) | — | Held until test passed |
| 31 | Practical Theology (`CTSPT`) | 10 units | Elective | CTSPTReadings (5) | — | — | Units only |
| 32 | Preaching (`WISESPEAK`) | single page | Foundation | CTSPreachingReadings (5) | — | — | Units only |
| 33 | Psalms (`CTSPSALMS`) | 12 units | M.Div. core | CTSPsalmsReadings (5) | — | — | Units only |
| 34 | Radical Christianity (`CTSRADICAL`) | 13 units | Elective | CTSRadicalReadings (5) | — | — | Units only |
| 35 | Revelation Intensive (`CTSREV`) | 15 units | Elective | CTSRevReadings (5) | — | — | Units only |
| 36 | Romans (`CTSROMANS`) | 10 units | M.Div. core | CTSRomansReadings (5) | — | — | Units only |
| 37 | Ruth & Esther (`CTSRE`) | 9 units | Elective | CTSREReadings (5) | — | — | Units only |
| 38 | Systematic Theology (`CTSST`) | 13 units | Foundation | CTSSTReadings (5) | — | — | Units only |
| 39 | The Gospel of John (`CTSJOHN`) | 12 units | Elective | CTSJohnReadings (5) | — | — | Units only |
| 40 | The Holy Spirit (`CTSHS`) | 10 units | Elective | CTSHSReadings (5) | — | — | Units only |
| 41 | The Life of Christ (`CTSLOC`) | 10 units | Elective | CTSLOCReadings (5) | — | — | Units only |
| 42 | The Pentateuch (`CTSPENT`) | 12 units | Elective | CTSPentReadings (5) | — | — | Units only |
| 43 | World Missions (`CTSMISSIONS`) | 10 units | M.Div. core | CTSMissionsReadings (5) | — | — | Units only |
| 44 | World Religions (`CTSWR`) | 12 units | Elective | CTSWRReadings (5) | — | CTSWRRequired (40 Q) | Held until test passed |
| 45 | Worship (`CTSWORSHIP`) | 11 units | M.Div. core | CTSWorshipReadings (5) | Christian Worship (40 Q) | — | Held until test passed |

Totals:
- 45 courses: 41 unit courses and 4 single-page courses.
- 45 reading rooms. Every room has five CTS readings, except Apologetics, which has seven.
- **9 textbooks**, all with tests.
- **2 required-reading tests**.
- **34 courses with no test at all.**

Degree roles are from `worker/awards.js` (`FOUNDATION`, `MDIV_CORE`).

## How it is built (evidence)

| What | Where |
|---|---|
| The course list, its units and completion codes | `src/content/units/**`, `src/content/courses/*.json` → generated into `worker/catalog.json` (`courses`, `completions`) by `tools/gen-worker-catalog.mjs` |
| Textbooks and their tests | `src/content/textbooks/<slug>.json` (book HTML and 40 questions, `test.draw`=20, `test.pass`=18), made from the Word files in `src/data/textbooks/` by `tools/import-textbooks.mjs`; PDFs in `public/textbooks/` (18) |
| Required-reading tests | `src/data/readings/<slug>.bank.json` and `.accept.json` → `src/content/readings/<slug>.json` via `tools/import-readings.mjs` (`TESTS` table); Genesis and World Religions only |
| Course ↔ test map | `worker/catalog.json` `textbooks` (slug → `code`, `kind`: textbook or reading), and `courses.<slug>.textbook` |
| Pages | `src/pages/[textbook].astro` (the book), `[test].astro` and `[readingtest].astro` (the tests, on pages apart from the text), `[unit].astro` with `src/layouts/Unit.astro` (the test box on every unit), `[room].astro` (the reading rooms) |
| Grading in the browser | `public/assets/js/cts-textbook.js` (`testPage`, `newDraw`, `submit`; 15-minute lock on the master's tracks, `LOCK_MASTERS_MIN`), graded with `public/assets/js/cts-fill.js` |
| Where results are stored | Browser: `cts_textbook_<slug>_passed` and `cts_textbooks_passed`. Server: the D1 table `textbook_results` (`migrations/0009_textbooks.sql`), sent up by `public/assets/js/cts-sync.js` and written in `worker/api.js` `textbookRows` (line 146) |
| The Master's hold in the browser | `public/assets/js/cts-record.js` `textbookHolds` (course not recorded); `public/assets/js/cts-engine.js` `passedPanel` (sends the student to the test); `public/assets/js/cts-textbook-gate.js` (hides the diploma; loaded by all 17 certificate pages of the 11 courses, each with `data-textbook`) |
| The Master's hold on the server | `worker/awards.js` `textbookFor` (129) and `textbookShortfall` (137). Used by `worker/api.js` in the sync (309: the completion is not recorded), the course certificate (387 and 395: refused with 409), and degrees (`degreeShortfall`, which counts only recorded completions) |
| Honors reading | the "Record your reading" attestation in every room, kept as `cts_honors_v1:<code>`, read by `public/assets/js/cts-cert-pdf.js` (line 130) to print *with honors*. It never reaches the Worker and is not a requirement |

## Confirmed defects

### D1. Counseling and Narrative Preaching count as Master's completions in the browser without the textbook test
- **Where:**
  - `public/cts-curriculum.js` `markComplete` (line 239) adds the code to `cts_done_codes`, and to `cts_mdiv_done_codes` or `cts_thm_done_codes` for a Master's student, with no textbook check.
  - It is called when the last unit is passed in `public/CTSCounseling.html` (line 2654, `COUNSELING`) and `public/CTS_Narrative_Preaching.html` (line 1912, `STORYTEL`).
- **Effect:**
  - The browser's degree pages count the course (`public/assets/js/cts-degrees.js`, which reads those lists, line 71), and the course unlocks what it gates. Counseling is an M.Div. core course.
  - The **official record is correct**: the Worker's sync filter (`worker/api.js` 309) refuses the completion, and the certificate endpoint (395) refuses the certificate. So what the student sees and what the seminary records disagree.
  - The course's own certificate page is still held by `cts-textbook-gate.js`.
- **Smallest safe fix:** in `markComplete`, skip the completion while `window.CTSRecord.textbookHolds({ code, textbook })` is true. Or have the two pages record through `CTSRecord.course()` like every unit course: add `STORYTEL` to the `SINGLES` list in `public/assets/js/cts-record.js` (Counseling is already there, line 132). No localStorage key changes.
- **Verify:** a browser check (`tools/verify-fill-single.mjs` is the natural home). A Master's student who passes every unit of Counseling, without the textbook test, should not have `COUNSELING` in `cts_mdiv_done_codes` and should not see it on the M.Div. page. After the test it should. The same for Narrative Preaching. A Certificate student is recorded with no test, as now.

### D2. Required readings are not a Master's requirement in 43 of 45 courses (requirement not yet implemented)
- **Where:**
  - Only `genesisreadings` and `wrreadings` exist (`tools/import-readings.mjs` `TESTS`).
  - The other rooms have only the optional honors attestation, which stays in the browser (above).
  - `docs/reading-rooms.md` documents the rooms as honors reading.
- **Effect:** a Master's student completes 43 courses without any check on the five readings. The 34 courses with no textbook either have no test at all.
- **Code obstacle:** the code allows **one** required test per course. `src/pages/[unit].astro` line 17 and `tools/gen-worker-catalog.mjs` line 159 stop the build if a course has both, and `worker/awards.js` `textbookFor` returns the first test only. So the 9 textbook courses cannot get a reading test without a code change.
- **Smallest safe fix:** already drafted, on draft PR #35 (branch `claude/pentecostal-reading-pilot`, not merged), with Pentecostalism as the pilot:
  - more than one test per course;
  - a 40-question reading bank with 4 drawn from each reading;
  - an activation date;
  - protection of Master's completions recorded before it.
  Then add banks course by course; after the pilot, each is a content-only change.
- **Verify:** see PR #35. The full suite on the Mac has not run yet.

### D3. 36 courses have no textbook in the repository (integration gap)
- **Where:**
  - `src/content/textbooks/` has 9 files.
  - `git log --all` over `src/content/textbooks`, `src/data/textbooks` and `public/textbooks` shows the same 9 were the only ones ever committed. No branch holds more: all are merged or contain nothing of the kind.
- **Do not read this as "never written".** The book-to-course map and textbook question sets mentioned in the handoff are not here. The Google Drive files I could find are about the reading rooms' public-domain shelves, not textbooks:
  - "CTS_Classics_Master_Table";
  - the "Stage 3/4 Assigned Reading Guides";
  - "CTS Digital Library – Catalog and Rights".
- **Smallest safe fix:** supply the map and the Word masters and question sets. Each book then goes in through the existing `tools/import-textbooks.mjs`, with no code change.
- **Verify:** `tools/verify-textbooks.mjs` and `tools/verify-textbook-test.mjs` (already in the suite).

## Needs clarification or source material

1. **The book-to-course map.** Please add it, even as a spreadsheet, with each book's course and the location of its Word or PDF master and question set. This is the single biggest unknown.
2. **Which five readings count for World Religions.** The course has two sets:
   - its room (`src/body/rooms/CTSWRReadings.html`): five CTS digests, used for honors;
   - `CTSWRRequired.html`: five different assigned works, with the existing required test.
   The Cults room also has a World Religions digest. Today the required test covers the `CTSWRRequired` works.
3. **Apologetics has seven readings, not five** (`src/body/rooms/CTSApolReadings.html`). Which five are assigned, or do all seven count?
4. **Th.M. course count.** `worker/awards.js` line 40 says 12 courses; the working requirement Dr. Cook gave is 15. Nothing has been changed; Robert to confirm.
5. **Honors for Master's students.** Dr. Cook has said honors should remain for Certificate and Associate but not apply to Master's students, and the front page should state the Master's requirement. Neither is implemented. The rooms and the front page (`src/pages/index.astro`, the "Master's Textbooks" and "Required Readings" sections) still describe the current rules.
6. **Earlier completions when readings become required.** The PR #35 pilot implements the four agreed cases. The same rule should apply when each later course is activated.

## Limits of the design (known; decide whether they matter)

- **The browser grades, and the server trusts what it is told.**
  - The Worker accepts any pass a browser reports (`worker/api.js` `textbookRows`), as it accepts reported units. A student who edits their browser storage can claim a pass.
  - The questions and answers are in the test page (`window.CTS_TEXTBOOK_TEST`, `src/pages/[test].astro` line 62).
  - The 15-minute lock is in browser storage.
  This is by design for an offline-friendly free seminary (`worker/awards.js` header). Closing it would mean grading on the server, a larger change.
- **Requirements are written in more than one place.**
  - `tools/gen-worker-catalog.mjs` line 141 (`SINGLE`) hard-codes the two single-page textbook courses.
  - `public/assets/js/cts-record.js` `SINGLES` hard-codes Counseling's textbook and omits Narrative Preaching.
  - The 17 certificate pages repeat the course's test in `data-textbook` attributes.
  These agree today; a later change made in only one place would not. PR #35 adds a generated `cts-required-tests.js` that could replace the attributes over time.
- **The live site is behind `main`.** The live `cts-fill.js` is the version from before 7 October (the grader's language work). Deploy the tested `main` before adding new tests on top of it.

## Checked and found sound

- All 9 textbook tests have 40 questions, `draw` 20, `pass` 18, and English and Spanish PDFs. Each test is on a page apart from the book, and every unit of its course links to both (`tools/verify-textbooks.mjs`).
- All 17 certificate pages of the 11 test courses load `cts-textbook-gate.js` with the right test (checked file by file).
- Genesis's own certificate script (`public/cts-genesis-completion.js`) records only once the diploma is visible, and the gate hides it first. `tools/verify-certificate-unlock.mjs` checks that a Master's student without the test is not recorded.
- Degree awards on the server count only recorded completions (`worker/awards.js` `degreeShortfall`), so D1 cannot produce an issued, verifiable degree.

## Open questions for Dr. Cook and Codex

1. Can you share the book-to-course map and the textbook question sets, and where they live?
2. World Religions and Apologetics: which readings are "the five"?
3. Should the browser-trust limits above be accepted, or is server-side grading wanted later?
4. Should D1 be fixed in its own small PR now, separate from the reading-test pilot?

*Not updated: the project "brain" repository, which isn't attached to this session. Its records should note D1–D3 once Dr. Cook and Codex agree.*
