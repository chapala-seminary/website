# Migration tooling

Stage 1 turns each course's unit pages from self-contained HTML (inline CSS +
inline exam engine + inline question data) into:

    site/assets/css/course-<slug>[-vN].css   stylesheet(s) per course
    site/assets/js/engine-<slug>[-vN].js     exam engine(s) per course
    site/data/<slug>/unitN.js                per-unit config + question bank
    site/CTS<Course>UnitN.html               thin page shell

URLs never change. Only each page's own `<style>` blocks and its largest inline
`<script>` move out.

## consolidate.py

    python3 tools/consolidate.py --course CTSWR --slug wr          # analyse
    python3 tools/consolidate.py --course CTSWR --slug wr --diff   # why variants differ
    python3 tools/consolidate.py --course CTSWR --slug wr --apply  # write

### How it decides what is content and what is engine

It does not rely on declaration names. It compares all of a course's units and
lifts **any top-level declaration whose text differs between them** into the
per-unit data file; everything else is shared engine. This works whatever a
course calls its question bank.

Two rules keep that safe:

* A declaration **missing** from some units is not treated as varying. Absence
  is a structural difference, and those units land in a different engine
  variant instead. (Lifting on absence would move a declaration into the data
  file for units whose dependencies still live in the engine — which produced
  `COURSE is not defined` before this rule existed.)
* The data file loads *before* the engine, so anything a lifted declaration
  depends on is lifted with it (transitive closure over earlier declarations).
  If a lifted declaration **calls a function** at load time, the tool refuses
  the course rather than emit something broken.

### Drift normalised before comparing

Units that differ only by their position in the course are collapsed first:

* prev/next button wiring → one guarded form, hrefs lifted to config
* localStorage keys with the unit number baked in → `` `..._u${UNIT}_...` ``
* `progress.unitN` → ``progress[`unit${UNIT}`]``
* "Unit N" / "Unidad N" inside message strings → `${UNIT}` / `${UNIT + 1}`
* the bilingual "already passed, click <next> above" message, which names
  either "Unit N+1" or, on the final unit, "the Certificate"

Because these normalisers introduce `UNIT`, the data file always declares it,
even for courses whose original code only had `currentUnit`.

### Engine variants

Engines are grouped by content and written one file per group. Units that still
differ — usually because some were built from an older generation of the engine
and lack later fixes — keep their own engine. **Variants are never merged**:
merging would silently give some units behaviour they never had. Reconciling
them is a separate, reviewed decision, and it is far easier once each variant
exists as exactly one file.

## verify.mjs

Renders every unit page from the pre-consolidation baseline and from the working
tree in headless Chromium, and compares them across three states: fresh,
already-passed, and course-unlocked.

    npm install playwright
    python3 -m http.server 8801 -d <baseline tree> &
    python3 -m http.server 8802 -d <working tree> &
    node tools/verify.mjs applied.txt      # lines: "<Course> <slug> <units> <engines>"

Compared per page/state: document title; rendered DOM with `<script>`, `<style>`
and `<link>` removed (those are what the consolidation relocates); body class;
progress grid; question markup before and after submitting the exam; result
text; submit/prev/next button state; whether next is wired; computed styles of
eight selectors; the number of answer options clicked; the full `cts_*`
localStorage snapshot; a settled viewport screenshot compared byte-for-byte;
and any console error not present in the baseline.

Determinism: `Math.random` is seeded and `Date.now` pinned in **both** trees,
because several engines shuffle questions and stamp lock times. Screenshots are
re-captured until two consecutive frames match, and the pixel comparison is
skipped (and counted) if a page never settles, rather than passing silently.

Baseline for Stage 1 is commit 24dbaa8 ("Import live site verbatim").

---

# Stage 2: verifying the built site

Stage 2 generates the unit pages with Astro from `src/content/units/*.json` and
`src/body/*.html`. The Stage 1 tools read `site/data/<slug>/unitN.js`, which the
build no longer produces, so there are build-facing versions of the two browser
suites. They take the unit's questions and answers from `window.CTS_UNIT` on the
loaded page — what the student's browser actually has — rather than from the
source tree. A checker that reads the same source the generator reads can only
confirm the generator agrees with itself.

    npm run build
    python3 -m http.server 8823 -d dist &
    CHROME_PATH=... node tools/audit-controls-built.mjs   # 451 pages
    CHROME_PATH=... node tools/engine-test-built.mjs      # 948 assertions

`CHROME_PATH` is optional; without it Playwright uses its own download.

## audit-controls-built.mjs

Loads every generated unit page and asserts three things a student needs and a
policy test cannot supply for them: a **visible** submit control, a result area,
and a rendered question count matching the unit data. This exists because the
policy suite once fell back to calling the engine directly when it found no
button, which hid an entire course whose pages had no submit control at all.

## engine-test-built.mjs

Two units per course, six browser sessions each, asserting the agreed policy:

    pass mark     90% of the multiple-choice questions, as a ratio
    lockout       master's 15 minutes, certificate 2 minutes
    reveal        certificate sees the answers on submit; master's does not
    persistence   a passed MC section stays passed; a failure records a lock

It answers exactly the pass mark and exactly one below it, so a drift in either
direction fails. It clicks the student's own submit button and never falls back
to the engine API.

## content-baseline.mjs

The regression gate across the whole migration: a format-neutral fingerprint of
every unit — question counts, every answer index, and a digest of the normalised
question and option text in both languages, with HTML tags and entities
resolved, accents folded and whitespace collapsed. It reads the Astro collection
when present and falls back to `site/data/*.js`, so the same recorded baseline
checks both trees.

    node tools/content-baseline.mjs --check     # 451 units, 34,778 comparisons

Record a new baseline only when the content is *meant* to change, and say why in
the commit.

## extract-catalog.mjs

One-time extraction. The front page carried 44 hand-written course cards; this
turns them into `src/content/courses/*.json` plus `src/data/catalog-groups.json`
and `catalog-intro.json`, and splits `index.html` into the two halves that sit
either side of the catalog (`src/body/index/head.html` and `tail.html`).

It refuses to guess. An unknown HTML entity, a card that is not a plain en/es
pair, a card containing markup, a duplicate course code, a link to a page
nothing in the site provides, or a parsed card count that disagrees with the
number of `<a class="course">` in the section all abort the run. Four of the 44
courses (ethics, the two preaching workshops, counseling) are single standalone
pages rather than unit-page courses; they are catalogued the same way and
carry `engine: false`.

Text is stored decoded — literal `ó`, not `&oacute;` — because a CMS cannot
sensibly edit entities. That is why the catalog check compares rendered text
rather than bytes.

## verify-catalog.mjs

    node tools/verify-catalog.mjs                        # git reference vs dist/
    node tools/verify-catalog.mjs <original> <built>

Normalises both catalogs the same way (entities resolved, inter-tag whitespace
collapsed) and compares them character for character: same tags, same
attributes, same order, same text. The reference is `index.html` as it stood in
the last commit where the catalog was hand-written, read out of git so the check
works in a fresh clone.

Confirmed to **fail** on a one-letter change to a course description, then pass
again once reverted.

Three further invariants live in `src/pages/index.astro` and fail the build: the
course count stated in the lead must match the collection, every course's group
must have a heading, and every heading must have courses. The lead spells the
count out in words in two languages, so it stays authored — but it cannot drift
out of step with the catalog unnoticed.

## verify-sitemap.mjs

    node tools/verify-sitemap.mjs [dist]

Fails on a sitemap URL the build does not produce. **Reports, without failing,**
the built pages the sitemap omits — which pages belong in a sitemap is a
decision about the site, not something a tool should infer from the current file
and then quietly enforce.

It currently reports that **CTSPentecostal, a complete twelve-unit course, is
absent from the sitemap** although it is linked from the front page, along with
13 certificate pages, all 44 reading rooms and the 210 digests.

---

# Stage 2: student records

The API, the schema, the browser client and their tests live outside `tools/`
because they ship with the site rather than migrating it:

    migrations/0001_init.sql        the D1 schema
    worker/api.js                   the API — a plain fetch handler, no deps
    functions/                      Pages Functions adapters
    public/assets/js/cts-sync.js    the browser half
    test/run-tests.sh               npm test

    npm run build && npm test

Both suites run against a real Worker and a real D1 — never a stub, because the
question being asked (does a student's progress survive moving to another
device?) cannot be answered by a mock. The browser half needs Chromium; where
it will not start, the runner **says so in a banner naming what went
unverified** rather than skipping quietly.

`docs/student-records.md` covers the design, the trade-offs, what a certificate
does and does not prove, and what is still to decide before it goes live.
