# The Master's textbooks

_3 Oct 2026. Dr. Cook's delivery `CTS-2026.1-Nine-Book-FINAL`: nine textbooks,
English and Spanish, each with a forty-question fill-in-the-blank test, for
nine of the courses. Required reading on the M.Div. and Th.M. tracks; open to
every student._

## What a student sees

| Where | What |
|---|---|
| Every unit of a course that has a textbook (and the page of the two single-page courses, Counseling and Narrative Preaching) | A box under the greeting: the book's name, and the way to its test. |
| The front page, after the course catalog (`index.html#textbooks`) | The nine textbooks, each with the course it belongs to. |
| `CTSTextbook<Name>.html`, the book | What the book is, a contents list, the whole book in English and Spanish (the usual language control), the two PDFs to download, and the way to the test. |
| `CTSTextbook<Name>Test.html`, the test | Twenty questions drawn at random from the forty, on a page that does **not** carry the book, so the browser's Find cannot search it for an answer. Each answer is marked the moment Check (or Enter) is pressed, as a unit's fill-ins are. Eighteen right passes. A failed attempt locks the page for the student's usual wait (2 minutes; 15 on the master's tracks), and the next attempt draws a fresh twenty. A reload mid-attempt brings back the same twenty and the answers typed. A pass is kept, dated, goes to the student record, and the book page says so. |
| On the M.Div. and Th.M. tracks | The course is complete, and its certificate issued, only when the textbook test is passed as well (Dr. Cook, 4 Oct 2026). The last unit's "passed" panel sends the student to the test; the certificate page holds the diploma and says what is missing; passing the test completes the course on the spot. Certificate and Associate students may take the test; nothing of theirs depends on it. |

Which courses:

| Textbook | Course | Pages |
|---|---|---|
| Cults and the Gospel | Cults & World Religions | `CTSTextbookCults` |
| Biblical Counseling | Counseling (Drakeford) | `CTSTextbookCounseling` |
| Counseling Situations | Counseling Situations | `CTSTextbookCounselingSituations` |
| Christian Worship | Worship | `CTSTextbookWorship` |
| Language Appreciation | Language Appreciation | `CTSTextbookLanguage` |
| Narrative Preaching | Narrative Preaching | `CTSTextbookNarrativePreaching` |
| Doctrinal Preaching | Doctrinal Preaching | `CTSTextbookDoctrinalPreaching` |
| Pentecostal and Charismatic Theology | Pentecostalism & the Charismatic Movement | `CTSTextbookPentecostal` |
| The Deaconship (Howell, adapted) | Deacon Family Ministry Plan | `CTSTextbookDeaconship` |

The page names are permanent once the site is live: they are the addresses
students bookmark and the keys their browsers keep a pass under.

## The required-reading tests (Genesis Intensive, World Religions)

Dr. Cook's Add-ons (4 Oct 2026) bind a forty-question bank to each of these
two courses the way a textbook is bound: the same test page, draw, pass mark,
grader, record (`textbook_results`), hold on the master's tracks and gate on
the certificate page, with "required readings" said wherever "textbook"
would be. They sit in the same map (`worker/catalog.json` `textbooks`, kind
`reading`). See `docs/reading-rooms.md`.

A course may have two required tests (9 Oct 2026): its textbook and its
five readings, piloted on Pentecostalism. `worker/catalog.json` lists them on
the course as `tests` (textbook first; a course has at most one reading
test), `public/assets/js/cts-required-tests.js` gives the same list to the
certificate pages, and a master's completion needs every one that counts. A
reading test with `requiredFrom` counts from that moment only, and not for a
master's completion the record held before it (`docs/reading-rooms.md`,
"Master's reading tests").

## Where things live

| Path | What |
|---|---|
| `src/content/textbooks/<slug>.json` | One file per book: its names, the book as HTML in both languages, the PDF paths, and the test (`draw`, `pass`, forty `questions` in the same shape as a unit's fill-ins). Validated by `src/content.config.ts`. **Generated — do not edit by hand.** |
| `src/data/textbooks/<slug>-<lang>.docx` | The Word masters the JSON was made from. The Word file is the master (Dr. Cook's changelog); edit the book there. |
| `public/textbooks/<slug>-<lang>.pdf` | The PDFs students download. |
| `tools/import-textbooks.mjs` | Delivery folder → the three above. Run it again for a content update. |
| `src/pages/[textbook].astro`, `src/pages/[test].astro` | The two pages, from the collection. |
| `src/layouts/Textbook.astro` | Their shared layout (masthead, language control, footer). |
| `public/assets/js/cts-textbook.js` | The language control, the "passed" note on the book page, and the test: the draw, the lock, what is kept. It marks answers with `CTSFill` from `public/assets/js/cts-fill.js`, the unit engine's own fill-in grader. |
| `src/layouts/Unit.astro`, `src/pages/[unit].astro` | The box on every unit of a course with a textbook. |
| `public/CTSCounseling.html`, `public/CTS_Narrative_Preaching.html` | The same box, written in, on the two single-page courses. |
| `src/pages/index.astro` | The front-page section. |
| `tools/verify-textbooks.mjs` | Data and built pages: every book has its course and its pages, every course links to its book, every accepted answer is marked right, the test page is apart from the book, no staff-only file is published. |
| `tools/verify-textbook-test.mjs` | The test page in a browser: the draw, pass at eighteen, fail and lock at seventeen, a fresh draw after the wait, the Spanish control; and the master's rule: all units passed is not complete until the test is, passing it completes the course, the Certificate track is not held. |
| `public/assets/js/cts-textbook-gate.js` | On the thirteen certificate pages of the nine courses (`data-textbook` on `<body>`): on a master's track with the test unpassed, hides the diploma and says why. |
| `migrations/0009_textbooks.sql`, `worker/api.js`, `worker/awards.js` | `textbook_results` in D1; the sync carries passes (earliest time wins) and holds a master's-level completion of a textbook course until its pass is in the record; the Worker refuses the course certificate on a master's track without it. `tools/verify-certificate-unlock.mjs` and `test/api.test.mjs` hold both. |
| `worker/catalog.json` (`textbooks`, and `textbook` on each course) | Which textbook belongs to which course, generated by `gen-worker-catalog.mjs`; the pages and the Worker read the one map. |

Both checks run in `test/run-tests.sh`.

## The rules, and where each is enforced

| Rule (Dr. Cook, 3 Oct 2026) | Where |
|---|---|
| Fill-in-the-blank only, forty per book, three to five accepted answers each | The bank JSON; `import-textbooks.mjs` refuses a question without a blank or with fewer than three answers. |
| Twenty drawn at random per attempt | `cts-textbook.js` (`newDraw`); `verify-textbook-test.mjs`. |
| Eighteen of twenty to pass | `test.pass` in the file, and `CTSFill`'s 90% rule, which is what marks; `verify-textbooks.mjs` holds the two equal. |
| Capitals, accents and punctuation do not count | `fillRight()` in `cts-fill.js`, held equal to the engine's by `tools/verify-fill-single.mjs`. |
| The test is apart from the book | Two pages; `verify-textbooks.mjs` checks no paragraph of the book is on the test page. |
| The test-bank Word and PDF files are for staff only | Never copied; `verify-textbooks.mjs` fails if one is anywhere under `public/`. They stay in the delivery folder, outside the repository. |

## Updating a textbook

A later delivery "comes as content updates in the same format". Then:

```sh
node tools/import-textbooks.mjs <the delivery folder>           # read and report
node tools/import-textbooks.mjs <the delivery folder> --write   # write
npm run build && node tools/verify-textbooks.mjs dist
```

The first run prints, per book and language, how many chapters, sections,
list items and paragraphs came through; compare with the previous delivery
before writing. Commit the JSON, the Word masters and the PDFs together.
Nothing else needs regenerating: the pages, the front-page section and the
sitemap are built from the collection.

To add a tenth book, add a row to `BOOKS` in `import-textbooks.mjs` (number,
slug, page name, the course's catalog card, the bank file, the two titles).

## Known limits and open decisions

- **A textbook pass** is kept in the browser (`cts_textbook_<slug>_passed`
  and the list `cts_textbooks_passed`) and in the student record
  (`textbook_results`, carried by the sync). Dr. Cook's rule (4 Oct 2026):
  required for a master's completion of the course, optional for everyone
  else. A master's student who finished a textbook course before the tests
  existed is held the same way: their completion is recorded once they pass
  the test (completions already in the record are left alone).
- **The textbook pages are open to everyone**, not behind the foundation lock
  (Dr. Cook, 4 Oct 2026): Certificate and Associate students may read and
  take the tests as an extra, and nothing of theirs depends on the result.
- **The two single-page courses** (Counseling, Narrative Preaching) record
  their completion from their own page when the last unit is passed; on a
  master's track the Worker holds that completion until the textbook pass
  arrives, and their certificate pages are gated like the others.
- **The English Deaconship book** was delivered as a Word file "reconstructed
  from the PDF" with no heading styles — every printed line its own
  paragraph. `import-textbooks.mjs` reflows it (chapters from the bold
  numbered lines, sections from short unpunctuated lines, paragraphs rejoined
  at a line that ends a sentence short of the margin) and checks the result
  against the Spanish book's structure (12 chapters, 32 sections: equal). A
  few paragraph breaks may still be wrong. Ask Dr. Cook for a styled Word
  master; the tool will then treat it like the other eight.
- **The editing interface does not offer the textbooks.** The Word file is the
  master; a change goes through it and the import tool.
- Dr. Cook's changelog notes the Spanish books are not word-for-word
  translations of the English (sentences omitted in places) and recommends a
  parity review.
