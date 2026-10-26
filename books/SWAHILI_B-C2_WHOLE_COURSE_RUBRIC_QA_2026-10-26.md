# Swahili B-C2 whole-course written-answer rubric audit

Date: 2026-10-26  
Scope: B-C2 Units 1–10, English and Swahili private instructor exam documents  
Environment: source-document review only; no production grader execution

## Executive result

All 20 private instructor exam documents were read (10 English and 10 Swahili). Each document contains 10 substantive written-answer prompts, for 200 prompt/rubric pairs reviewed in total.

A deterministic rubric-integrity defect pattern appears in eight prompts across six units: the same accepted alias is present in two separate scoring groups within one prompt. If the production scorer counts group hits independently without deduplicating the matched evidence, one student word or phrase could satisfy two required points. The live grader was not tested, so this report identifies a source-level risk, not a confirmed production scoring result.

## Affected locations

- Unit 3: Swahili SA1
- Unit 4: Swahili SA7
- Unit 6: English SA2 and Swahili SA2
- Unit 7: Swahili SA6
- Unit 8: Swahili SA1
- Unit 10: English SA8, English SA10, and Swahili SA9

There are nine duplicate-alias collisions across these eight prompts because one prompt contains two separate collisions.

## Control observations

- Units 1, 2, 5, and 9 had no exact same-alias collision across separate scoring groups in either language under this scan.
- The audit did not publish model answers, accepted aliases, student data, or answer keys.
- This scan does not establish that any historic grade was wrong.
- Unit 10's previously reported broad/negation-insensitive date-term risk remains separate from the exact duplicate-group defect documented here.

## Required private verification before release

1. Run synthetic tests against the actual grader for each affected prompt, including:
   - one duplicated term alone;
   - a negated or contradictory sentence containing that term;
   - three genuinely distinct required points.
2. Confirm whether a single text span can increment more than one rubric group.
3. If confirmed, deduplicate matched evidence in scorer logic and remove repeated aliases from later groups in versioned private banks.
4. Have an academic reviewer approve any rubric change and preserve/review earlier student credit rather than silently regrading.
5. Extend the same exact-alias collision scan to the other 19 elective courses and all language banks.

## Release posture

Hold affected rubric deployment until private synthetic testing and academic review are complete. No production change, grade change, key publication, merge, or deployment was performed by this audit.
