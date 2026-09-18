# Migration tooling

Stage 1 turns each course's unit pages from self-contained HTML (inline CSS +
inline exam engine + inline question data) into:

    site/assets/css/course-<slug>.css     one stylesheet per course
    site/assets/js/engine-<slug>.js       one exam engine per course
    site/data/<slug>/unitN.js             per-unit config + question bank
    site/CTS<Course>UnitN.html            thin page shell

URLs never change. Only the page's own `<style>` and inline `<script>` move.

## consolidate.py

    python3 tools/consolidate.py --course CTS1Peter --slug 1peter           # analyse
    python3 tools/consolidate.py --course CTS1Peter --slug 1peter --apply   # write

Analysis strips per-unit config and question data from each unit's inline
script and checks that what remains is identical across the course. It refuses
to write if it is not, and prints the differing text. The one known piece of
per-unit drift — the "already passed, click <next> above" message, which
hardcodes either `Unit N+1` or, on the final unit, `the Certificate` — is
rewritten to an expression that reproduces both strings exactly.

## verify.mjs

Renders every unit page from the pre-consolidation baseline and from the
working tree, in headless Chromium, and compares them across three states:
fresh, already-passed, and course-unlocked.

Compared per page/state: document title, rendered DOM with `<script>` elements
removed, body class, progress grid, question markup before and after submitting
the exam, result text, submit button state, computed styles of six key
elements, the identity and type of fifteen globals the engine depends on, the
full `cts_*` localStorage snapshot, a viewport screenshot compared byte-for-byte,
and any console error not already present in the baseline.

Wall-clock lock timestamps are masked; nothing else is normalised away.

    # from the repo root
    rm -rf tools/_work && mkdir -p tools/_work/before tools/_work/after
    for n in $(seq 1 12); do
      git show <baseline-sha>:site/CTS1PeterUnit$n.html > tools/_work/before/CTS1PeterUnit$n.html
    done
    # ...copy shared js into before/, copy the current pages + assets into after/
    npm install playwright
    python3 -m http.server 8801 -d tools/_work/before &
    python3 -m http.server 8802 -d tools/_work/after &
    node tools/verify.mjs

Baseline for Stage 1 is commit 24dbaa8 ("Import live site verbatim").
