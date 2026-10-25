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

## The seven new textbooks, and making tests required (11 Oct 2026)

Joshua (Blaikie), Galatians (Findlay), Romans (Moule), Evangelism (Torrey),
1 Peter, John and Ruth–Esther have public-domain textbooks with a
forty-question typed fill-in-the-blank test each. The 12 October beta audit
repairs convert all 36 newer banks to the same typed format as the original
nine: twenty drawn, eighteen to pass, immediate checking, and the existing
wait after failure. The schema rejects multiple-choice fields in textbook
and reading banks. Prompts, bilingual primary keys, chapter grouping and
stored pass identifiers are preserved. Existing valid passes stay valid.
Capitalization, accents, punctuation and leading articles are handled by the
shared grader; explicit accepted synonyms remain editable per question.


Where the reading is: Joshua, Galatians and Romans link the full English book
and the CTS Spanish assigned chapters (`files.html`); Evangelism (five
chapters), 1 Peter, John and Ruth–Esther carry their assigned readings on the
book page itself (`files: {excerpts: true}`), rebuilt from
`docs/readers/textbooks/<slug>/excerpts/{en,es}/{1..5}.md` by
`node tools/excerpt-body.mjs <slug>` (`--check` to compare).

Three more (11 Oct, ChatGPT's "complete course packages", reviewed by
Claude): Acts (Stokes, five excerpts, Spanish newly translated in full where
the package had a condensed adaptation), Revelation (Milligan, ten short
excerpts -- the opening of ten chapters -- two questions drawn from each) and
Psalms (Maclaren, five selections with the Psalm in his own rendering). Same
standard: typed fill-in-the-blank, assigned readings on the book page. The
Pentateuch textbook (`CTSTextbookPentateuch`, five excerpts from the
Expositor's Bible on each book) is installed with two changes Dr. Cook asked
for on 11 Oct, so as not to offend readers who take a very conservative
view: Dods on Genesis is now his chapter on the covenant with Abram (Gen. 15,
faith counted for righteousness) instead of the Creation chapter, which says
Genesis 1 and 2 cannot be reconciled; and Harper on Deuteronomy is cut to his
exposition of the Shema, leaving out his argument for a late author.
Six more five-reading tests came with them: 1 Peter, John, Ruth–Esther,
Revelation, Psalms, Pentateuch.

Five more, chosen from the Drive library (CTS_Book_0xx) with Dr. Cook's
go-ahead (11 Oct): Torrey, *The Person and Work of the Holy Spirit* (CTSHS);
Torrey, *The Fundamental Doctrines of the Christian Faith* (CTSST); Arnot,
*The Parables of Our Lord* (CTSParables); Angus, *The Bible Hand-Book*
(CTSBible); Harvey, *The Pastor* (CTSPM). Five excerpts each, chosen to
avoid polemic and anything that would trouble very conservative readers.

Five more (11 Oct, same terms): Hurst, *Short History of the Christian
Church* (CTSCH); Boyd, *A Brief Bible History*, Old Testament part (CTS, Old
Testament Survey -- Hurlbut's *Outline Studies* is mostly outlines and says the
Flood was probably not global); Machen, *The Literature and History of New
Testament Times* (CTSNT); Bruce, *The Training of the Twelve* (CTSLOC);
Trumbull, *Teaching and Teachers* (CTSCE).

Six more (11 Oct): Torrey, *How to Study the Bible* (CTSHermeneutics);
Fisher, *The Grounds of Theistic and Christian Belief*, 1902 (CTSApol);
Taylor, *The Ministry of the Word* (CTSEvanPreach); Allen, *Missionary
Methods* (CTSMissions); Dods, *Genesis* -- Abraham, Jacob and Joseph chapters,
not the Creation chapter (CTSGenesis, beside its reading test, which stays
in force as before); Gibson, *Matthew* (CTSMatt).

Two more (11 Oct): Jevons, *An Introduction to the Study of Comparative
Religion* (CTSWR, beside its reading test, which stays in force); Plummer, *The
Pastoral Epistles* (CTSAL). And five-reading tests for the last 22 rooms
(Claude's banks, `tools/import-readings.mjs` batch D), so every course now
has one. Still without a textbook: Bible Characters I and II, Church Growth,
Practical Theology, Radical Christianity (no suitable book in the Drive
library yet).

One more (12 Oct): Alexander, *Christianity and Ethics* (1914), for
Pastoral & Christian Ethics (`ethics_unit01`, completion code ETHICS): five
excerpts on Christ as the pattern of the good life, the Christian motive
(forgiveness, sonship, calling), repentance, faith and obedience, love as the
bond of the virtues, and duties to others. Ethics is outside the unit engine,
so `tools/gen-worker-catalog.mjs` knows it as a single-page course and each of
its ten unit pages carries the textbook box by hand. Its certificate page
(`ethics_certificate.html`) does not yet load `cts-required-tests.js` and
`cts-textbook-gate.js`: that is needed before this test is activated.

And one for Preaching (WiseSpeak, `CTS_WiseSpeak_Preaching`, code
WISESPEAK; 12 Oct): Broadus, *A Treatise on the Preparation and Delivery of
Sermons*, 1898 edition revised by Dargan (`CTSTextbookBroadus`): the
importance of preaching, its four requisites, the duty to interpret the text
truly, application, and expository preaching. It is listed before the
course's five-reading test; Dr. Cook's own WiseSpeak remains the course's
method. The box is written into the single course page.

And Practical Theology (CTSPT; 12 Oct): Kenneth J. Collins, *Soul Care:
Deliverance and Renewal through the Christian Life* (First Fruits Press,
2014), used under its Creative Commons Attribution-NonCommercial 3.0 US
license, which allows translation with credit (`CTSTextbookSoulCare`): sin as
unbelief, the detour of moralism, justification, reading the Scriptures,
prayer. Its English quotes the NIV, as the book does; the Spanish uses the
Reina-Valera 1909.

And Radical Christianity (CTSRadical, code CTSRADICAL; 12 Oct):
*Holiness Through the Ages: An Historical Reader of Christian Writers on
Holiness*, ed. Robert E. Coleman, Robert A. Danielson and Faith E. Parry
(First Fruits Press, 2014; Dr. Cook's upload), used under its Creative
Commons Attribution-NonCommercial 3.0 US license (`CTSTextbookHoliness`).
Five excerpts, one writer each: Whitefield, "The Almost Christian";
Edwards, a selection of his *Resolutions*; Ryle, "Holiness" (the editors'
abridged text); Müller on stewardship; Torrey, *Why God Used D. L. Moody*
(surrender, humility, freedom from the love of money). Chosen away from the
course's five digests (Law, Murray, Bounds, Drummond) and from the book's
writers on entire sanctification, revival technique and women's preaching.
The English keeps each writer's quotations; the Spanish uses the
Reina-Valera 1909.

All thirty-two, and the five-reading tests, are online with
`requiredFrom: null`: open to everyone, required of no one. Dr. Cook wants
them required on the M.Div. and Th.M. tracks once published. To do that:

    node tools/activate-required.mjs --list
    node tools/activate-required.mjs --at 2026-11-01T00:00:00Z --all-pending            # what it would do
    node tools/activate-required.mjs --at 2026-11-01T00:00:00Z --all-pending --write

The moment must be after the deploy that carries it. The tool records it in
`src/data/required-from.json`, sets `requiredFrom` in each textbook record,
re-runs `tools/import-readings.mjs --write` (which reads the same file) and
`tools/gen-worker-catalog.mjs`; then build, suite, deploy. A master's
completion the record already held before that moment is kept
(`worker/awards.js` `testCounts`). `--except <slug>,...` leaves any test
optional.

Each reading room carries one standard notice for each of its tests,
written by `node tools/room-test-notices.mjs --write`; the wording does not
change at activation (the test pages say whether a test is in force).

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

## Where the answer bank lives

A live test page does not include the question bank. The server sends the wording of the twenty questions it drew, and grades them from `grading_keys`. Public textbook JSON keeps prompts (and chapter); `answer` and `accept` live only in the private `chapala-seminary/assessment-keys` checkout that deploy and CI sync from. See `docs/ai-grading.md` section 4. The book text stays on the book page. Reading-test keys remain in this public repo for a later pass. A new bank, including Christian Education, is written only in that private checkout.

## October beta audit conversion

The 36 later banks now use typed fill-ins, with their chapter draws, answer keys and saved-pass identifiers preserved. Every supplied key and accepted variant is checked. Normalization also accepts changes in capitalization, punctuation, Latin accents and one leading article, preserving ñ. Five questions have explicit English/Spanish paraphrase or number variants added after reviewing their prompts; avoid inventing synonyms solely to reach an arbitrary variant count. Further content alternatives remain faculty-review work. Browser checks cover immediate feedback, reload, 17/20 failure, retake wait, 18/20 pass and preservation of older dated multiple-choice passes.

## Elective textbooks (Oct 2026)

Each denominational elective's textbook and test come from one command:

    node tools/build-elective-textbook.mjs <CODE> --write

`CODE` is A-C1 … D-C5. The input is `../elective-content/<CODE>/textbook/`
(or `--content DIR`): `chapters.json`, `bank.json`, `accept.json` and
`meta.json`. The book's slug and page are letters only: A-C1 gives
`elecpcone` and `CTSTextbookElecPCOne`.

- **The public file** is `src/content/textbooks/<slug>.json`. It has the
  book in English, Spanish and French, a French title (`title.fr`, used by
  `frTextbookTitle`) and `files: { excerpts: true }`. Each chapter is an
  `<h2 id="en-N">` (the French keeps the English ids), a muted source line,
  the CTS note (`p.cts-note`) and the paragraphs. It also has the test: 40
  prompts with their chapters, draw 20, pass 18, four per chapter.
  `requiredFrom` is null and `keys` is `"private"`.
- **The keys** are in `assessment-keys/textbooks/<slug>.json`: prompt,
  answer, accept, chapter and each question's French stamp. The stamps hash
  the answers, so for these banks they are kept private. Older textbooks
  keep their stamps public. The content schema and `tools/verify-no-keys.mjs`
  fail if a private textbook's public file carries an answer, an accepted
  answer or a stamp. `tools/french-readings.mjs apply` keeps them private.
- A book keeps its number once it has one. A new book takes the next free
  number.
- The paragraphs are HTML. A bare ampersand, as in the old printers'
  "&c.", is written `&amp;`; any other character reference is refused.

The tool then runs `gen-worker-catalog.mjs`. The textbook comes before the
reading test in the course's `tests`. It is optional on every track
(`ELECTIVE_TESTS_PENDING`). The units link the book through the unit
layout. The front page lists it under `#elective-textbooks`.

If the course has a reading room, the tool also re-runs
`tools/build-elective-readings.mjs <CODE> --write`. That adds the room's
textbook notice and its French. Then build, run
`node tools/exam-review.mjs dist --refresh-missing`, and build again. The
review pins of private banks go to `assessment-keys/exam-review-references.json`.
