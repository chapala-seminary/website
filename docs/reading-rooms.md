# The reading rooms

_4 Oct 2026. Dr. Cook's "CTS Add-ons" delivery and his answers to Robert's
questions. The 45 reading rooms (`public/CTS*Readings.html`) keep their five
CTS digests and their honours requirement; each gains a public-domain shelf
for further study and, where it lacked one, the honours-reading attestation.
Two courses gain required readings with a test, under the textbook rule._

## What a student sees

| Where | What |
|---|---|
| Every reading room | The five CTS bilingual digests, as before: pick any three, read them in full, record them on your honour. That is the honours reading, unchanged (Dr. Cook: not "three of fifteen"). |
| Below the digests, in 41 rooms | **Further Study: Ten Public-Domain Works** (six for Revelation, with its two panels on the schools of reading and the millennial views; Systematic Theology has the millennial panel too). Each work: what part to read, author and year, a paragraph on why, and a link that opens it online. No selection boxes, and nothing about a download: the works are not in any course download. |
| In every room | **Record your reading**: your name, the oath, and the three titles chosen above, kept in this browser under the course's code. The 25 rooms that showed both languages at once and had no attestation now have one in the same style; the 20 that had it are unchanged. The certificate PDF reads the record and prints *with honors*. |
| Genesis Intensive | Its room is unchanged and is now linked from every unit (the honours box). It is also the course's **required readings**: the test, `CTSGenesisReadingsTest.html`, draws twenty of forty fill-in-the-blank questions, eighteen to pass. |
| World Religions | A new **Required Readings** page, `CTSWRRequired.html`, with Dr. Cook's five assigned works, beside the existing Supplemental Reading Room (which stays as it is) and distinct from the Cults & World Religions room. Its test is `CTSWRRequiredTest.html`. |
| The two required-reading tests | The same page, rule and record as a Master's textbook test (`docs/textbooks.md`): required for an M.Div. or Th.M. completion of the course and recorded in the student record, optional for Certificate and Associate students, open to everyone. The unit box, the last unit's "passed" panel, the certificate page and the front page all say "required readings" where they would say "textbook". |

Accepted answers: Dr. Cook's banks give one answer per blank; the site accepts
three to five per question in each language (a plural, a fuller name, an
obvious equivalent), so "beginning" passes for "beginnings". Capitals, accents,
punctuation and a leading article never count (`cts-fill.js`).

## Master's reading tests (pilot: Pentecostalism, 9 Oct 2026)

Dr. Cook's requirement, agreed with ChatGPT's review: every Master's course
gets a test on its five assigned readings. It is piloted on Pentecostalism &
the Charismatic Movement before the other courses.

| | |
|---|---|
| The test | `CTSPentecostalReadingsTest.html`: forty fill-in-the-blank questions, eight on each reading in the room, in English and Spanish (`src/data/readings/pentecostalreadings.bank.json`, alternates in `.accept.json`). Each attempt draws twenty, **four from each reading** (`format.questions_per_reading`, `test.perReading`); eighteen right (90%) pass. Each answer is marked at once and a wrong one shows the right answer. Retakes are unlimited after the usual wait (15 minutes on the master's tracks). |
| Two tests on one course | The course keeps its textbook test. On the M.Div. and Th.M. a completion needs both, each passed on its own; a pass on one is never a pass on the other (`textbook_results` keeps one row per test). Certificate and Associate: nothing changes. |
| Not yet in force | `requiredFrom: null` in `tools/import-readings.mjs`. Until Robert sets it, the test is open to everyone and required of no one; the front page does not list it, and its page, the unit box and the room say it is being introduced. |
| Activating it | Robert sets `requiredFrom` in `tools/import-readings.mjs` to the moment the requirement begins (an ISO time, e.g. `2026-11-01T00:00:00Z`) -- **a moment after the deploy that carries it**, so no completion is recorded between the date and the deploy by a Worker that does not yet know it -- runs `node tools/import-readings.mjs --write` and `node tools/gen-worker-catalog.mjs` (which also re-fingerprints the script on the certificate page), then the build and the suite, and deploys. Until that moment nothing changes for anyone. |
| Students already done | A master's completion of the course the record held **before** that moment stands without the reading test. The Worker judges this from its own `course_completions.completed_at` and `track` (`worker/awards.js` `testCounts`), and tells the browser (`exemptions` in the state; kept as `cts_textbook_<slug>_exempt`, never sent back as a pass). Reported after the moment, a Certificate or Associate completion from before by a student now on a master's track, or a course only started: the test is required. Units passed stay passed in every case. |
| Known limits | A completion that was only ever in a browser, never synced, has no server date, so it is not protected (Case 2; Robert may correct a documented case by hand). The browser shows an exemption after the sync that brings it; the gate looks again when it arrives. |
| The room | A notice above the honors invitation tells master's students the test covers all five readings and is separate from honors (any three, recorded). Honors is unchanged. |

Checks: `test/required-tests.test.mjs` (the rule, case by case),
`test/required-tests.api.mjs` (through the Worker, with the test activated in
the suite's configuration only: `TEST_REQUIRED_FROM`),
`tools/verify-required-tests.mjs` (in a browser).

## Where things live

| Path | What |
|---|---|
| `src/data/reading-shelf.json` | The shelf of every room, extracted verbatim from the delivery by `tools/extract-reading-shelf.mjs` (kept so the extraction can be redone). Two captions reworded to drop "in your download". |
| `tools/reading-rooms.mjs` | Writes the shelf and the attestation into the rooms between `CTS-SHELF` and `CTS-ATTEST` markers; `--check` (run by the suite) fails if a room is not what it would write, if a shelf mentions a download or offers a selection, or if a room has no attestation. Run it again after editing the data. |
| `tools/verify-reading-rooms.mjs` | The rooms in a browser: shelf below the digests, attestation records under the certificate's code in each family of room, the World Religions pages lead to each other. |
| `src/data/readings/<slug>.bank.json` | Dr. Cook's two banks, verbatim. **Answer-bearing: never under `public/`.** |
| `src/data/readings/<slug>.accept.json` | The accepted alternates, keyed by question id. Edit here. |
| `tools/import-readings.mjs --write` | Bank + alternates → `src/content/readings/<slug>.json` (the collection; validated by `src/content.config.ts`). |
| `src/pages/[readingtest].astro` | The test page, on the `Textbook` layout with kind `reading-test`. |
| `worker/catalog.json` (`textbooks`, kind `reading`) | Generated by `gen-worker-catalog.mjs`: the reading tests sit in the one map the Worker and the pages apply, beside the textbooks; a course has at most one reading test, and may have a textbook test as well. |
| `public/CTSWRRequired.html` | The World Religions Required Readings page. |
| `public/CTSGenesisCertificate.html`, `public/CTSWRCertificate.html` | Carry `data-textbook-kind="reading"` and load `cts-textbook-gate.js`. |

The honours code a room records under is the certificate page's name
(`CTS<Code>Certificate.html` → `Code`), the same the certificate PDF reads
(`cts-cert-pdf.js`); `reading-rooms.mjs` takes it from `worker/catalog.json`
and refuses a room whose certificate it cannot find.

## The revised World Religions bank (10 Oct 2026) — not yet in force

The current World Religions test does not test the five assigned readings
(ChatGPT's source audit, 10 Oct 2026). A revised bank is ready beside it and
approved under Dr. Cook's delegation: eight questions on each reading, four
drawn from each, 18 of 20 to pass, every answer checked against the linked
edition.

| Path | What |
|---|---|
| `src/data/readings/wrreadings.v2.bank.json` | The revised bank: each question names its `reading` (1–5) and its source passage; `format` gives `questions_per_reading` and the bank `revision`. **Answer-bearing: never under `public/`.** |
| `src/data/readings/wrreadings.v2.accept.json` | Its accepted alternates, keyed by question id. |
| `tools/import-readings.mjs` | The World Religions row's `next: { bank: 'wrreadings.v2', active: false }`. Every run checks the revised bank. Only `active: true` makes `--write` put it in `src/content/readings/wrreadings.json`. `--next-out DIR` writes it elsewhere for the tests. |
| `public/assets/js/cts-textbook.js` | A bank with `perGroup` draws that many from each reading. A bank with a `revision` starts a fresh attempt when a saved one was begun under another revision, or before there was one. The pass, its date and any lock are kept. Banks without them (every textbook, Genesis) are unchanged. |
| `tools/verify-grouped-reading-test.mjs` | The browser check, run by the suite. |

**Not to be switched on before the readings can be read in Spanish** (decision
of 10 Oct 2026; the Spanish readers wait on a rights check). To switch on:
set `active: true`, run `node tools/import-readings.mjs --write`, build, and
run the suite. The test page then says "four on each of the five readings".
A student partway through the old test gets a fresh attempt on the new
questions. Their typed answers belong to the old questions, so they are not
carried over. Passes already recorded, in the browser and on the server,
stand.

## Private reading tests (all tests since 25 Oct 2026)

Every reading test now works this way, the 45 core tests included; their banks are in `assessment-keys/readings-src` (`docs/answer-exposure-audit.md`). The paragraph below was written for the electives.

A new reading test can keep its answers out of this repository, the way the
textbook tests do. The 45 reading tests made before Oct 2026 keep their
answers public; nothing about them changes.

| Path | What |
|---|---|
| `tools/import-readings.mjs` | The test's row says `private: true`. |
| `assessment-keys/readings-src/<slug>.bank.json`, `.accept.json` | The bank and its accepted alternates, in the same format as `src/data/readings/`. They are in the private checkout, never in this repo. |
| `src/content/readings/<slug>.json` | Written by `--write`. It has the prompts, reading numbers, titles, draw and pass, and `keys: "private"`. It has no `answer`, `accept` or `tr`, because the French stamps (`tr`) hash the answer. |
| `assessment-keys/readings/<slug>.json` | Written by `--write`: `{ slug, test: { questions: [{ prompt, answer, accept, reading, tr }] } }`, in the public order. Grading sync, the shadow page and every checking tool join it to the public file (`readingQuestions` in `tools/grading-keys-lib.mjs`). |
| `assessment-keys/exam-review-references.json` | The pinned review passages of private banks. Each one fingerprints the prompt with its answer, so they are not kept in `src/data/exam-review-references.json`. |

The private checkout is `ASSESSMENT_KEYS`, or `../assessment-keys` beside this
repo. Without it the importer, the build and grading sync stop rather than go
on with an answerless bank. The content schema, `tools/verify-no-keys.mjs` and
`test/private-readings.test.mjs` fail if the public file of a private bank
carries an answer, an accepted answer or a stamp.

To add one:

1. Put the bank and accept files in `assessment-keys/readings-src/`.
2. Add the row (`private: true`, `requiredFrom: null`) and run
   `node tools/import-readings.mjs --write`.
3. Run `node tools/gen-worker-catalog.mjs`, then build. The build stops at
   "Review reference needs editorial refresh" until
   `node tools/exam-review.mjs dist --refresh` pins the new bank's passages.
   That command re-pins every bank, so review the diff of the public file.
4. Commit the website files. Commit the keys in the assessment-keys repo.

Faculty-approved alternates go in the `.accept.json` in `readings-src/`, so
that the next import keeps them. `tools/french-readings.mjs apply` writes a
private bank's French answers and stamps to the private file, and its French
prompts to the public one.

The slug must be letters only and end in `readings`: the browser's records
(`cts-sync.js`) accept no digits. An elective's slug starts with `elec`
(e.g. `elecbaponereadings`). `worker/test-activation.js`
(`ELECTIVE_TESTS_PENDING`) keeps every `elec…` test optional: the production
activation date never makes one required. Making one required takes its own
`requiredFrom` date.

## Elective reading rooms (Oct 2026)

Each of the 20 denominational electives gets a reading room and a private
reading test from one command:

    node tools/build-elective-readings.mjs <CODE> --write

`CODE` is A-C1 … D-C5. The course name comes from
`tools/import-electives.mjs` (`prefixOf`: A-C1 → `CTSElecPC1`). The test slug
is `elec<tag><one…five>readings`, e.g. `elecpconereadings`. The room is
`<Prefix>Readings.html`.

Before you run it:

- `../elective-content/<CODE>/` (or `--content DIR`, or `ELECTIVE_CONTENT`)
  holds `readings.json`, `bank.json` and `accept.json`. The five digests are
  in English, Spanish and French, with the same structure in each. The bank
  has French prompts, answers and alternates.
- `src/data/reading-shelf.json` has the room's further-study shelf, with
  `locusFr`, `nameFr` and `captionFr` beside the English and Spanish. Shelf
  works and links come only from the course's source manifest, or follow its
  URL pattern.
- Optionally, `src/data/elective-readings.json` has a `tagline` and an
  `onsite` notice for the course. Without them the tool writes generic ones.

What the tool does:

1. It copies the bank to `assessment-keys/readings-src/`, adds the row to
   `src/data/elective-readings.json` (which `tools/import-readings.mjs`
   reads: private, `requiredFrom: null`), and imports that test only
   (`--only`).
2. It writes the room on the Worship room's markup and adds it to
   `src/data/rooms.json`. Then it runs `room-test-notices.mjs` (the
   `#cts-required` notice) and `reading-rooms.mjs` (attestation and shelf).
3. It writes the room's French, `src/data/french-readings/room/<Prefix>Readings.json`.
   Each digest leaf is paired with its French leaf in document order. The
   card lines, notices and shelf are added, and so is the textbook notice
   once the course has a textbook. The stored French must carry the English
   tags. Where the French italicizes more than the English, the extra
   italics are dropped and reported: first from English words the French
   cites (« dispositions » (*tempers*)), then the shortest emphasis (*ne* …
   *pas*). Where the French joins two phrases the English italicizes
   apart, its longest italic span is split at a space (the page looks the
   same); italics in a parenthetical aside the French adds are dropped.
   A French ordinal set as a superscript the English lacks (XIX<sup>e</sup>)
   is written on the line (XIXe). Each change is reported. It stops if any other tags differ, or if any English passage of
   the room would stay English on the French page. An elective room's store
   shares French only with the core rooms and digests, never with another
   elective's. So holding or removing one course cannot take French away
   from another.
4. It records the room in `src/lib/partials.ts` (`READING_ROOM`) and
   re-imports the course. A unit gets the course-readings box only once its
   room exists. Then it runs `private-units.mjs` and `gen-worker-catalog.mjs`.
   Every certificate page's `cts-required-tests.js` fingerprint changes,
   because the map of required tests changed.

Then build. The first build stops at "Review reference needs editorial
refresh". Run `node tools/exam-review.mjs dist --refresh-missing`. It pins
only questions that have no pin, whose prompt or answer changed, or whose
pinned passage is gone because its text was revised. Every other pin stays
as it is. The
private bank's pins go to `assessment-keys/exam-review-references.json`;
pins already kept there stay there, including a held course's. Then
build again. Running the tool twice gives the same files.

**Held courses.** `src/data/elective-held.json` lists electives held back
from the site, by code, each with its reason. None is held now: A-C1, A-C3
and A-C5 were held for a copyright decision on *The Apostolic Faith*
(24 Oct 2026) and released on 26 Oct 2026, when Wayne allowed material
published before 1931 (tracker row 226). A held course keeps its units and
nothing else:
- both generators refuse its code;
- `import-readings.mjs` skips its row;
- `import-electives.mjs` gives its units no course-readings box;
- `gen-worker-catalog.mjs` fails if it has a textbook, a reading test, a
  room or a `READING_ROOM` entry.

Its private keys may stay in assessment-keys. To lift a hold, remove the
code, run both generators for it, and build.

The front page lists elective reading tests apart from the 45 core ones
(`#elective-readings`). Their test is optional on every track
(`ELECTIVE_TESTS_PENDING`).

## Known limits

- The shelf links straight to a public-domain copy wherever a stable, legal
  one exists (Dr. Cook, 4 Oct 2026): 305 of the 336 delivered web searches
  now open the work itself on the Internet Archive, Project Gutenberg, CCEL
  or the Wesley Center, each checked for title, author, a pre-1930 edition
  and an open (not borrow-only) copy. 31 stay searches: the work is still in
  copyright, or exists online only as a borrow-only or modern reprint.
  `tools/apply-shelf-links.mjs` applies a result file; a few links open the
  first volume of a set or a larger volume containing the work. Seven links
  in the delivery itself were dead (404) and were replaced the same way.
- The World Religions Required Readings page links each of its five works
  directly (the three primary texts separately).
- The Honors Reading Library page (`cts-honors.html`) still describes the
  rooms as "five complete readings", which remains true.
