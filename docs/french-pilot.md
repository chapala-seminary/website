# French pilot: preparation and review

Pilot: Old Testament Survey (`CTS`, progress slug `ots`), starting with Unit 1.
Wayne's Markdown draft remains separate from the canonical course JSON. No
lesson translations or student records are changed by this preparation PR.

## Check the pipeline without paying a provider

```
node tools/translate-lesson.mjs CTS --lang fr --unit 1 --provider tag --dry-run
```

Unit 1 has 87 lesson blocks and 40 questions (20 multiple choice, 10 fill-ins,
10 short answers). One pass includes all source-language text, choices,
explanations, fill answers and alternates, keyword synonym groups and models.
Question provenance (`tr.fr`) hashes all these source fields together, including
the shared multiple-choice answer index and any keyword-hit threshold. The
answer index, option order, synonym grouping and minimum keyword hits remain
unchanged. The build retains extra language keys and rejects mismatched
option counts, missing translated question fields and malformed blanks.

`tag` only prefixes strings to prove their routing. Run a writing demonstration
in a disposable copy, never publish its output. There is no real paid provider
in this tool. Provider choice and estimated cost require Robert's approval.
The CLI prepares every selected unit before writing and restores original
files if a write fails; this is not a substitute for a Git branch and diff.

## Preserve reviewed work

A `human` or `machine-edited` translation is never replaced, even when its
source hash is stale. The tool reports it for review and retains its wording,
status and old hash. Existing translations with no provenance are also
preserved for review. Only missing translations or stale `machine` work are
eligible for automatic replacement. Questions are protected as a whole, so a
corrected answer key cannot be overwritten while refreshing its prompt.

## Bring in Wayne's draft

1. Compare his draft against the supplied source packet and its pinned commit.
2. Have a qualified French theological reader review Scripture against Louis
   Segond 1910 and the terminology against the CTS glossary.
3. Review every fill answer and alternate, and every short-answer keyword
   group and model; confirm the multiple-choice option order and answer index.
4. Map the approved text to existing block IDs and question positions; add
   `fr` to the lesson’s `langs` list. Mark
   reviewed lesson blocks and questions `human` (or `machine-edited`), with
   the hash of the source used for that review. Do not clear stale hashes
   merely to make a report quiet.
5. Regenerate and verify the CMS configuration before any editor save:
   `node tools/build-cms-config.mjs` then `node tools/verify-cms-config.mjs`.
   The generator discovers languages across all lessons, including a language
   first added to a later unit. Exam translation-status controls preserve
   provenance and let an editor mark corrections `human` or `machine-edited`.
6. Build and render the complete unit in EN/ES/FR on desktop and phone; exercise
   French and English answers, source visibility, grading and saved progress.
   Review the diff before publishing. Approve Unit 1 before expanding.

This PR adds French drafts for the shared unit registration/navigation frame
and exam-engine feedback, greeting, counts and retry messages. Course text,
course-specific static exam labels, catalog prose, reading-room content and
student-code dialogs still require French translation. Fallback notices and
`noindex` remain for untranslated French pages. This is preparatory work, not
an approved French course or a completed French interface rollout.
