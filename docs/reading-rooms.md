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
