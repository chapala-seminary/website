# Wayne’s reading and examination feedback — 15 October 2026

New work started at beta `d93712da` on `codex/wayne-readings-exam-feedback`.
Beta advanced during implementation; the branch incorporates `83c00bcc`
(AI-grading PR #98) and supports its live and shadow modes.
Issues: [#101](https://github.com/chapala-seminary/website/issues/101),
[#102](https://github.com/chapala-seminary/website/issues/102),
[#103](https://github.com/chapala-seminary/website/issues/103),
[#104](https://github.com/chapala-seminary/website/issues/104).
Robert authorized the changes and coverage of all content, rather than a pilot.
No deployment or merge is part of this change.

## Student behavior

All 45 textbook and 45 required-reading examinations give immediate Correct or
Incorrect feedback without displaying the key. Checked responses remain fixed.
After submission, each missed question has one or two teaching paragraphs and a
link to their context. This applies on English, Spanish and French pages.

The explanations quote existing course teaching in its own language and retain
the author’s perspective. They are source excerpts, rather than newly invented
attributions or generated doctrinal claims. Long source paragraphs are narrowed
to a focused, contiguous passage of complete sentences, generally 90–260 words;
sentences are never rewritten or cut in half. The link retains the full context.
This applies to the post-exam review on every screen size. Assigned readings
themselves retain their full existing wording and length.
The legacy World Religions bank explicitly tests course lessons as well as readers;
its lesson-based explanations are labeled and linked as course lessons. Genesis’s
retained title-definition question likewise cites its explanation in Unit 1.

In live mode, the submitted review uses the server’s final verdicts; pending
grading does not invent a result or use a local answer key. In shadow mode, the
submitted draw, responses and grading languages are saved with the attempt,
so a failed attempt’s review survives a reload. A fresh retake clears the review.
Existing passes, scores, the random draw, wait times, records and activation
schedules are unchanged. Ordinary unit practice keeps its existing feedback.

The catalog lists all available books and readings independently of activation,
with separate examination links. The Torrey page explicitly names the five
assigned excerpts and links to the complete original for optional study
([verified Gutenberg edition](https://www.gutenberg.org/ebooks/52648)).
Shared lesson boxes and reading rooms explain optional honors (three selections)
and master’s assigned readings (all five and a separate exam after activation).
World Religions links its distinct required and honors sets separately.

Native language names have their own language attributes and cannot be rewritten
by browser translation. Fully translated pages request `translate="no"`, preserving
the student’s selected CTS language; pages with missing translation remain
available to browser translation. Existing anchor navigation remains functional
without JavaScript. This is protection against double translation, not proof of
the cause of Wayne’s Android report: that physical device is still untested.

## Maintaining explanations

`tools/exam-review.mjs` finds teaching passages in the generated assigned material.
`src/data/exam-review-references.json` pins each question/language to a question
fingerprint and its source paragraph fingerprint. Normal builds use these exact
references and fail if the question or its selected explanation changes.
No source match is silently substituted during an ordinary build.

Explanations are emitted into content-hashed public JS assets and loaded with the
examination. They are displayed only after submission. These assets contain public
teaching passages; live question data retains no answer keys, and the existing
server remains the authority for grading and course credit. References link to stable paragraph or chapter anchors added to
the reading pages. Explanations are available offline after the page assets load.

To revise a bank or explanation, build the new source pages first (the final
review step may fail on stale references), run
`node tools/exam-review.mjs dist --refresh`, inspect the reference changes and the
source passages in `/private/tmp/cts-review-matches.json`, and rebuild. A refresh
is an editorial operation, not a routine build step. Faculty can adjust a specific
reference to another paragraph in the same cited teaching; source validation
checks its text and link, while faculty review establishes theological suitability.

## Validation

`test/wayne-feedback.test.mjs --static` checks every explanation’s length, source
text and exact primary citation anchor across all 90 banks and three languages.
Focused-passage checks retain Torrey’s relevant teaching without reproducing
the entire long paragraph of divine attributes. Browser cases
exercise Torrey, Systematic Theology readings, Joshua and World Religions in each
language, including checking, submission, reload and a fresh draw after the wait.
Navigation cases cover English, Spanish and French preferences at phone and
tablet widths, the Bible Unit 1 French button, Systematic Theology’s four links,
and World Religions’ separate sets. The repository build and suite are required;
Robert subsequently requested a reviewable PR while the final suite finishes.
`test/wayne-live-feedback.test.mjs` additionally checks
server-only verdicts, delayed grading, private keys and reloads in all three
languages. Source validation also checks each quotation’s actual language,
including projected translations whose outer container retains a source-language
attribute. The inherited staff-grading, single-course live, merge and privacy
checks use fresh Node HTTP connections, like the existing API helpers, to avoid
stale keep-alive sockets after local D1 CLI operations or browser interactions.
Browser and server assertions remain unchanged.
The prose baseline exempts exactly the old bilingual
three-for-honors instruction (hash `YzzO-vNLUe6v`), because that shared interface
copy was intentionally replaced; lesson prose remains protected. Before updating
`lesson-render.json`, a control comparison restored only the old readings box in
466 temporary pages: every element matched the previous fixture. The refreshed
fixture therefore records the approved interface change, without accepting any
unrelated lesson change.
The exam-view guard excludes only the shared reading-requirement/navigation box
from lesson-prose comparisons, like the existing completion note. Its new
paragraph markup must not turn interface guidance into apparent lesson text;
the check still verifies that every actual teaching paragraph hides in exam view.

### Status when the PR was opened

Robert requested the PR before the final full-suite run completed so he could
review and merge into beta. The build passes. Completed checks against the
current product code include 65,878 feedback/navigation/source checks, 66 live
server-verdict checks, 3,262 lesson/exam-view assertions and 5,778 language and
screen-size renders. Content guards confirm 50,396 content comparisons unchanged
and all 26,110 recorded prose blocks retained. French submitted-review layouts
were also visually inspected at 800px and 360px.

The final complete `test/run-tests.sh` run is still in progress; it is not yet
reported as passing. It reuses the unchanged, freshly validated shadow build.

## Startup evidence

CTS was established from the assignment and the verified website remote
`git@github.com:chapala-seminary/website.git`. Instructions read: workspace
`AGENTS.md`; brain `MEMORY.md`, `CLAUDE.md`, `USER.md`, `AGENTS.md`,
`AGENT_RULES.md`, `GIT_WORKFLOW.md`, `projects/website/PROJECT.md` and
`DECISIONS.md`; website `AGENTS.md` and `docs/beta-staging.md`; QA skill
`/Users/macstudio/.codex/skills/qa-session/SKILL.md` and its session reference.
COINCUBE and Website Machine policies do not apply to this separate CTS task;
no shared policy SHA is asserted. No delegated agents were used.
