# Rubric alignment after the 15 October content merge

Reviewed from website content commits `7856d7e1..219545d5`, against the current
questions, model answers and lessons. Integration base: `16ba251e` (the latest
fetched beta, including the pilot length policy and Wayne's exam-feedback work).

## Coverage

- Compared short-answer prompts and models in all three languages across the
  content-fix range: **544 unit-course questions changed**.
- Rechecked **134 corrected/reworded questions** against their rubric. Reviewed
  the relevant lesson passages when a rubric needed revision.
- The other **410** received replacement EN/ES models in Christian Education,
  Church History, Language Appreciation and Genesis. Spot-checked the first
  and last question of each affected unit (82 items), including their existing
  rubrics. This is a spot-check, not faculty approval of all 410.
- Compared and rechecked **86 changed single-page short answers**: Counseling
  37, Narrative 7, WiseSpeak 34 and Ethics 8. Rubrics remain in
  `src/data/single-rubrics/<course>/<unit>.json`; Narrative and Ethics needed
  no rubric changes in this pass.
- Refreshed **46 rubrics**: 29 unit-course and 17 single-page items. No question,
  model answer, keyword list, lesson or question order was changed.

## What changed

Some rewritten questions still carried the previous question's rubric. The
clearest cases were Ruth and Esther 6 (palace conduct versus an assassination
plot), Systematic Theology 5 (human dignity versus creativity), and Counseling
and WiseSpeak practical questions. Those now assess the revised question.
Other revisions remove demands the question no longer makes, or require the
parts of a list or comparison that it explicitly asks for. Points still follow
the course's own teaching; academic review remains with faculty.

Since AI grading has now been published in live mode on beta (PR #98), revised
rubrics advance from version 1 to **2**, preserving the meaning of any previously
recorded version-1 grades. The handoff's assumption that no live publication had
occurred is no longer current. No remote grade or student record was inspected
or changed in this review.

Question numbers below are **1-based**; API question indexes are one less.

| Course/unit | Refreshed questions |
|---|---|
| CTS/9 | 5 |
| CTS1Peter/7 | 9 |
| CTSBible/3 | 6 |
| CTSEvangelism/5 | 3, 7 |
| CTSHermeneutics/1 | 3 |
| CTSJosh/10 | 5 |
| CTSJosh/5 | 7 |
| CTSNT/1 | 8, 9 |
| CTSPM/4 | 6 |
| CTSPM/8 | 3 |
| CTSRE/6 | 3, 4, 5, 6, 7 |
| CTSST/4 | 1, 6, 9 |
| CTSST/5 | 2, 3, 7, 8 |
| CTSST/6 | 6 |
| CTSWR/7 | 1 |
| CTSWorship/1 | 2 |
| CTSCH/8 | 10 |
| CTSCH/9 | 10 |
| counseling/1 | 9, 10 |
| counseling/5 | 9 |
| counseling/7 | 3, 8 |
| counseling/8 | 3, 8 |
| counseling/9 | 5, 8 |
| counseling/10 | 6, 7, 8, 9 |
| wisespeak/1 | 4 |
| wisespeak/3 | 6, 9 |
| wisespeak/6 | 3 |

## Genesis model filtering

All 120 Genesis short-answer keys retain their source models in EN, ES and FR.
The eval-harness regression also constructs a synthetic legacy unit: repeated
EN/ES placeholders are still omitted, while distinct French answers survive.
The filter itself is unchanged; its comment now describes the repaired content.

## Evaluation and review limits

The three historical paid runs are recorded in
[test/eval-results/README.md](../test/eval-results/README.md). The final run was
partial and its 2.2% weak-answer false-accept rate exceeded the 2% bar. Those
runs predate this rubric refresh; they do not establish the bar for these
version-2 rubrics. No new paid model call was made. Faculty blind grading,
rubric review, French privacy review and production authorization remain open.
The suite also retains 63 French packet warnings about the legacy keyword
grader (some copied prompts match enough keywords). Those packets were not
edited here; the live server's copied-answer checks are tested separately.

## Validation

- `npm run build`: passed.
- Rubric structure: all 5,050 valid.
- Lesson render: all 466 converted pages match the existing fixture.
- Content baseline: 50,396 comparisons passed.
- Prose baseline: 26,110 blocks checked; all recorded blocks remain.
- Eval harness: 23 groups passed, including the Genesis/filter regression.
- Full suite: `PORT=8940 SKIP_SHADOW_BUILD=1 test/run-tests.sh` passed (exit 0), including all 5,778 language renders, real-Worker/browser grading, faculty workflows, privacy, record merging and throttling. No browser checks skipped. The cached shadow build was produced by the first run, which stopped at the sandbox's localhost-listening restriction; the complete rerun had local-server permission.

No baseline was re-recorded: the current fixtures already include the deliberate
15 October content changes, and this pass changes server-only grading data.
