# Adding a course

_3 Oct 2026. Written for Dr. Cook and the AI tools he works with (Claude Code
and Codex). The first course to go through it is **Parables of the Bible**,
the seminary's 45th course, added the same day (see **Record** at the end).
Parables is used as the example all the way through. For another course,
swap in its own names._

This is a checklist. Do the steps in order and tick them off in the pull
request (see step 12). Each step says which file to touch and how to check it.

---

## Before you start: the rules

These come from `AGENTS.md` and apply to every change in this repository.

1. **One course, one branch, one pull request.** Make a branch named
   `course/parables` from an up-to-date `main`. Never push to `main`. Robert
   reviews the pull request, merges it, and deploys it.
2. **Never deploy.** Do not run `npm run deploy`, `npm run deploy:beta` or any
   `wrangler` command. Robert deploys.
3. **No student data in git.** That means names, emails, student codes,
   database exports and students' written answers.
4. **Names are permanent once the course is live.** These names become web
   addresses and the keys a student's browser saves their progress under:
   - the page names (`CTSParablesUnit1.html` …);
   - the course's short name (`parables`);
   - the completion code (`CTSPARABLES`).

   Choose them carefully now. After the course is live, changing one of them
   would break links or wipe out students' progress.
5. **Lessons and exams stay apart.** The lesson's text goes in one file. That
   unit's exam questions go in a different file (step 3). Never copy exam
   questions into a lesson, and never put teaching into a question file.

### Words used below

| Word | Meaning |
|---|---|
| **unit** | One lesson plus its exam, shown on one page (`CTSParablesUnit3.html`). |
| **short name** | The course's lower-case name with no spaces: `parables`. The site uses it to save each student's progress. |
| **page prefix** | The start of every page name: `CTSParables`. |
| **completion code** | `CTS` + the short name in capitals: `CTSPARABLES`. The certificate page records it when a student finishes, and the degree rules count it. |
| **block** | One piece of lesson text (a heading, a paragraph, a Scripture quotation), in both English and Spanish. |
| **template** | The page layout of a lesson, with a marker where each block's text goes, such as `<!--cts:b012:en-->`. |
| **build** | `npm run build`. It turns the files in `src/` and `public/` into the finished site in `dist/`. It stops with an error if a file is malformed. |
| **the suite** | `test/run-tests.sh`. It runs every check the site has. It takes about 40 minutes. |

### The model course

Copy from **The Gospel of John** (`CTSJohn`, short name `john`). It has 12
units, and each unit has 20 multiple-choice, 10 short-answer and 10
fill-in-the-blank questions. Its certificate page uses the standard progress
key.

Do **not** copy 1 Peter, Galatians, Bible Characters or Hermeneutics. Those
courses still carry old-site progress names. The `LEGACY` lists in
`cts-engine.js` and `cts-sync.js` translate those names, and a new course must
not be added there.

---

## The steps

The Parables names used below:

| Thing | Value |
|---|---|
| short name | `parables` |
| page prefix | `CTSParables` |
| first page | `CTSParablesUnit1.html` |
| certificate page | `CTSParablesCertificate.html` |
| completion code | `CTSPARABLES` (worked out from the certificate page's name, step 4) |
| number of units | written as **N** below |

### 1. The catalog card

Create `src/content/courses/CTSParables.json`:

```json
{"code":"CTSParables","entry":"CTSParablesUnit1.html","engine":true,"group":"bible-survey-and-books","order":19,"title":{"en":"Parables of the Bible","es":"Las Parábolas de la Biblia"},"description":{"en":"…one line in English…","es":"…one line in Spanish…"}}
```

- The `title` must match the names in `src/data/certificate-courses.json`
  exactly. Those names come from the seminary's Certificate Maker.
- `group` is one of the ids in `src/data/catalog-groups.json`.
- `order` is the card's position within its group. 19 puts it after Bible
  Characters II. To put it somewhere else, renumber the cards that follow it.

### 2. The lessons — one file per unit

Create `src/content/lessons/CTSParables/1.json` … `N.json`. Start each one as
a copy of the matching `src/content/lessons/CTSJohn/<n>.json` and change it.
(If the course arrives as finished HTML pages, as Parables did, write a small
import tool instead of editing by hand — `tools/import-parables.mjs` is the
model: it reads the pages, pairs the English and Spanish paragraphs, checks
every question, and writes these files and the ones in step 3.)

- `"course": "CTSParables"`, `"unit": <n>`.
- **`template`**: keep John's layout. That includes the exam section at the
  end: `questionsContainer`, `submitExamBtn`, `resetExamBtn`, `examResult`
  and `mcBankedNotice`. The site draws the exam into that section, so it must
  stay. Add or remove `<h3>`/`<p>` lines to fit the lesson. The English and
  Spanish halves must have the same markers in the same order.
- **`blocks`**: one per marker, each with its English and Spanish text.

  ```json
  {"id":"b013","type":"prose","text":{"en":"…","es":"…"},"tr":{"es":{"status":"human","from":"<12 characters>"}}}
  ```

  - `type` is `heading`, `prose` or `scripture`.
  - Write characters as themselves (`"`, `é`, `—`), not as HTML codes like
    `&eacute;`. The build refuses HTML codes.
  - `tr.es.status` is `human` when a person wrote or checked the Spanish, and
    `machine` when it was machine-translated and nobody has checked it yet.
  - `tr.es.from` records which English the Spanish was made from. Fill it in
    with this command once the English is final (it only touches `from`):

    ```sh
    node -e '
    const fs=require("fs"),c=require("crypto"),d="src/content/lessons/CTSParables";
    for (const f of fs.readdirSync(d)) { const p=d+"/"+f, l=JSON.parse(fs.readFileSync(p,"utf8"));
      for (const b of l.blocks) if (b.text.es!=null) { b.tr=b.tr||{}; b.tr.es={status:(b.tr.es&&b.tr.es.status)||"human",from:c.createHash("sha1").update(b.text.en).digest("hex").slice(0,12)}; }
      fs.writeFileSync(p, JSON.stringify(l,null,1)+"\n"); }'
    ```
- Scripture: NKJV in English and RVG in Spanish, as in every other course.
- Leave the `<!--cts-part:honours-->` line at the end only if the course gets
  a reading room (step 5). Otherwise remove it, or the build will fail.

Check: `node tools/lesson-status.mjs CTSParables` lists every unit, and none
has a missing or out-of-date Spanish block.

### 3. The exam questions — one file per unit

Create `src/content/units/CTSParables/1.json` … `N.json`. Start each one as a
copy of `src/content/units/CTSJohn/<n>.json` and change:

| Field | Value |
|---|---|
| `course` | `"parables"`, the short name. Students' progress is saved under it. |
| `pagePrefix`, `filePrefix` | `"CTSParables"` |
| `unit`, `totalUnits` | this unit's number, and N |
| `title` | `"CTS Parables of the Bible — Unit 3: …"`, with the dash typed as a character. (The older files write `&mdash;`, which the page shows literally in the browser tab; do not copy that.) |
| `styles`, `scripts`, `bodyClass` | as in John (`styles` is unused but required; `[]` is fine). A `?v=…` on a script is ignored — the build fingerprints every script itself. |
| `prevHref` | the previous unit's page; `null` on unit 1 |
| `nextHref` | the next unit's page; on the last unit, `"CTSParablesCertificate.html"` |
| `unitTitles` | the list of all N unit titles, `en` and `es`, the same in every unit |

Then the questions, which are the exam itself:

- **`mc`**: 20 multiple-choice questions.
  - `stem` is the question. `options` are the choices, the same number in
    each language.
  - `answer` counts from 0, so 0 means the first option is right.
  - `why` (optional) explains the right answer.
  - Vary which position holds the right answer.
- **`sa`**: 10 short-answer questions. Each has:
  - a `prompt`;
  - `keywords` in each language, as word stems a good answer would use
    (`"redeem"` also matches "redeemed" and "redemption");
  - a `model` answer, which is shown to the student only after they have
    really tried (at least 10 words / 50 characters).
- **`fill`**: exactly 10 fill-in-the-blank questions. Each `prompt` has
  exactly one blank, written `____`, in each language.
  - `answer` is the word that fills it.
  - `accept` lists other right answers (`"Christ"` for `"Jesus Christ"`), not
    misspellings. Accents are already forgiven.

Write questions about what **this unit's lesson** teaches, so a student who
has read it can answer them.

Check: `npm run build` finishes. A wrong answer number, a missing blank, or
option lists of different lengths will stop it with a message naming the file.

### 4. The certificate page

Copy `public/CTSJohnCertificate.html` to
`public/CTSParablesCertificate.html`, then change it:

- `<title>CTS Parables of the Bible &mdash; Certificate of Completion</title>`.
  The part before the dash becomes the course's name in students' degree
  records, so it must match the catalog title in English.
- `const COURSE = 'parables';`. This **must** be the short name from step 3,
  or the certificate will never unlock.
- `totalUnits`, both lists of unit titles (English and Spanish), and every
  `CTSJohnUnit` link → `CTSParablesUnit`.
- Every visible mention of John, in both languages.

Afterwards, `grep -n -i john public/CTSParablesCertificate.html` should find
nothing.

Then, in `src/data/certificate-courses.json`, change the `parables` entry's
`"catalog": null` to `"catalog": "CTSParables"`. Its names and author are
already there.

### 5. The reading room (optional)

Only if the course has supplementary readings:

- copy `public/CTSJohnReadings.html` to `public/CTSParablesReadings.html` and
  rewrite it;
- add `CTSParables: "CTSParablesReadings.html",` to `READING_ROOM` in
  `src/lib/partials.ts`;
- add a link in `public/cts-honors.html` under the right volume.

Then give it the public-domain shelf and the attestation like the others:
add its entry to `src/data/reading-shelf.json` (or re-extract from a
delivery with `tools/extract-reading-shelf.mjs`) and run
`node tools/reading-rooms.mjs`; its `--check` is in the suite. See
`docs/reading-rooms.md`.

Without a reading room, leave out the `<!--cts-part:honours-->` line in step 2.

### 6. The course colour (optional)

To give the course the same accent colour as its neighbours, add
`body[data-course="parables"]` to one of the lines under "Per-course accent"
in `public/assets/css/cts.css`. Without it, the default colour is used.

### 7. Regenerate the files that are built from the content

Run these. Never edit their output by hand:

```sh
node tools/gen-worker-catalog.mjs   # worker/catalog.json: the server's list of courses
node tools/build-cert-names.mjs     # public/assets/js/cts-cert-names.js: names on PDF certificates
node tools/build-cms-config.mjs     # public/admin/config.yml: the editing screens
```

If `gen-worker-catalog` says "no certificate page writes completion code
CTSPARABLES", the certificate page's file name is wrong (step 4).

### 8. Say "45" where the site says "44"

The site states its number of courses in these places. Change 44 to 45, in
English and Spanish:

- `src/data/catalog-intro.json` (`statedCount`). The build refuses a count
  that differs from the number of course cards.
- `src/body/index/head.html` and `src/body/index/tail.html`
- `public/CTSAbout.html`
- `public/CTSCatalog.html`:
  - the title, the description lines and `numberOfItems`;
  - add the course to the list (`"position": 45`, copying the item above it);
  - add a card in the page body, copying an existing one.
- `tools/verify-degrees.mjs`: the three places that expect exactly 44 course
  IDs and names.

Do **not** change other 44s found by a search. Most are colours or sizes, not
the count of courses.

### 9. Things to leave alone

- **The course lock.** Like every course outside the seven foundation
  courses, Parables stays locked until a student finishes the foundation.
  That happens on its own; do not add it to the open lists in
  `public/cts-curriculum.js`.
- **The degree rules** (`worker/awards.js`, `public/assets/js/cts-degrees.js`).
  A new course counts toward the degrees as an elective with no change. Making
  it a required course is a decision for Dr. Cook and Robert, not part of
  adding it.
- **The `LEGACY` lists** in `cts-engine.js`, `cts-sync.js`, `cts-record.js`.
- **`public/CTS_ARCHIVE_INDEX.html`**, a record of the old site.
- **The sitemap.** It is generated and picks the new pages up by itself.

### 10. Record the new course in the checks

Several checks compare the site with a recording of how it was, so they will
report the new course as "new". First run the build and the check, and read
what it says: **the only complaints should be about Parables.** Then record:

```sh
npm run build
node tools/content-baseline.mjs --check       # expect only "CTSParables/…: unit is new"
node tools/content-baseline.mjs --write
node tools/verify-lesson-render.mjs           # expect only "CTSParablesUnit…: not in the reference"
node tools/verify-lesson-render.mjs record dist
```

(`tools/prose-baseline.mjs` needs nothing: it only guards the older courses'
text.)

If a check complains about **any other course**, stop. Do not record; that
complaint is a real problem. Ask Robert in the pull request.

Two checks, `tools/verify-catalog.mjs` and `tools/verify-gating.mjs`, compare
the front page with the original 44-card front page. Each has an `ADDED` list
of the courses added since; a course not on it is reported as an extra card
and the suite stops partway. So:

- add `["CTSParables", "CTSBibleCharacters2"]` (the course file, and the file
  of the card it follows) to `ADDED` in `tools/verify-catalog.mjs`;
- add `'Parables of the Bible'` (the English title) to `ADDED` in
  `tools/verify-gating.mjs`;
- in `test/fixtures/gating-baseline.json`, raise `cards` to 45 in both
  student states and add the title to the first state's `locked` list, in
  alphabetical order (a new course is locked for a student without the
  foundation and open for one with it; the check asserts both).

The lead's "Forty-four courses" is handled the same way (`COUNT` in
`verify-catalog.mjs`): the next course changes it to forty-six in both
languages.

### 11. Run everything and look at it

```sh
npm run build && test/run-tests.sh
```

Then open the course in a browser with `npm run preview`, in English and in
Spanish. Saving progress to the seminary's server does not work in preview;
that is expected. Check that:

- unit 1 shows the lesson, with "Take the exam" where the exam begins;
- the exam marks a right and a wrong answer correctly;
- **Next** moves on only after the unit is passed;
- after the last unit, the certificate unlocks.

The new course is locked, like every elective. To open it, use course tester
mode (`docs/course-tester-mode.md`): add `?ctstest=` and the tester key to the
address. Dr. Cook has the key. Never write it into a file, a commit or a pull
request.

### 12. Open the pull request

Commit only the files this course added or changed (`git status` shows them).
Push the branch and open a pull request into `main` titled
"Add course: Parables of the Bible". In the description:

- this checklist, ticked;
- the suite's last lines (pass or fail, honestly);
- anything not done, and any check that complained, with its message;
- who wrote or checked the Spanish.

Robert reviews it, merges it, deploys it to the beta site for Dr. Cook to try,
and then publishes it.

---

## Record

| Course | Date | How |
|---|---|---|
| Parables of the Bible (`CTSParables`, 15 units) | 3 Oct 2026 | `tools/import-parables.mjs` from Dr. Cook's delivered pages; every step above; `docs/content-changes.md` §8ae |

## Textbooks

A course's Master's textbook and its test are not part of this list; they
are generated from the Word masters by `tools/import-textbooks.mjs`. See
`docs/textbooks.md`.

## Quick reference: every file a new course touches

| File | New or changed | Step |
|---|---|---|
| `src/content/courses/CTSParables.json` | new | 1 |
| `src/content/lessons/CTSParables/*.json` | new | 2 |
| `src/content/units/CTSParables/*.json` | new | 3 |
| `public/CTSParablesCertificate.html` | new | 4 |
| `src/data/certificate-courses.json` | changed | 4 |
| `public/CTSParablesReadings.html`, `src/lib/partials.ts`, `public/cts-honors.html` | optional | 5 |
| `public/assets/css/cts.css` | optional | 6 |
| `worker/catalog.json`, `public/assets/js/cts-cert-names.js`, `public/admin/config.yml` | regenerated | 7 |
| `src/data/catalog-intro.json`, `src/body/index/head.html`, `src/body/index/tail.html`, `public/CTSAbout.html`, `public/CTSCatalog.html`, `tools/verify-degrees.mjs` | changed | 8 |
| `tools/verify-catalog.mjs`, `tools/verify-gating.mjs`, `test/fixtures/gating-baseline.json` | changed | 10 |
| `tools/content-baseline.json`, `test/fixtures/lesson-render.json` | re-recorded | 10 |
