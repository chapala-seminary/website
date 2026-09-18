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
