# CTS research-only audit — B-C2 Unit 10 English ↔ Swahili (26 October 2026)

**Status: HOLD for academic/language/assessment review.** This document contains no student data, exam answers, accepted-answer strings, or private question banks. It is a review artifact on `handoff/book-sources`, **not** authorization to change published lessons or grading.

## Exact source inventory (Google Drive, read 26 October 2026)

- English lesson, *Last Things in Baptist Thought*, 18 Oct 2026: 15,601 extracted characters, 74 paragraphs; Drive document `1GvJ3fsgo4rqKWVD7b9hmWLs548Av_kpWXluX7l4jWf4`.
- Swahili lesson, *Mambo ya Mwisho katika Fikra za Kibaptisti*, 20 Oct 2026: 16,142 extracted characters; Drive document `1PQDEL50INJ1XP7kAjvgcjcsmk7Oh8tiqMsyzycA8vVM`.
- English instructor exam: 16,917 extracted characters; Swahili instructor exam: 17,374. **Instructor document identifiers and answer contents intentionally omitted from this public research report.** Original versions must be pinned in a private export manifest.

## Assessment parity — verified

- English and Swahili instructor examinations each have 20 multiple-choice questions, 10 short-answer questions, and 10 fill-in items.
- All **20 of 20** multiple-choice correct-option **positions** agree between the two source revisions. Each version distributes the positions five per A/B/C/D. This is a structural comparison only, not an independent semantic validation of each distractor.
- All ten fill-in items correspond by tested concept. The Swahili item on the postmillennial view appropriately changes the blank from an English word prefix to a standalone Swahili word before a preposition; the other nine have recognizable matching prompts. No obvious duplicate-word accepted-answer defect of the kind seen in B-C2 Unit 9 was found on manual review of Unit 10.
- **No evidence of secure export, student-page separation, server-side key protection, or live grading behavior was tested.** The instructor files contain private material and must never be copied to the public website repository.

## New high-priority issue — negation-insensitive short-answer rubrics

The *documented* short-answer rubric in both English and Swahili defines each keyword group as satisfied if **any** alternative stem is found in a student's response. Several groups about avoiding predictions of Christ's return include an unqualified word referring to a calendar date. Under that stated rule, a student could endorse predicting a date (the opposite of the lesson) yet receive a keyword-group hit. The problem is inherited from the English rubric and reproduced in Swahili, not simply a mistranslation. This is a **potential false-positive scoring risk**, **not** evidence that production grading uses that algorithm.

**Required before release:** Have the assessment owner test the actual scoring implementation using *synthetic* affirming, negating, and contradictory answers in both languages; remove broad single-word stems from automatic affirmative-credit groups; require semantic/negation-aware review for short answers, with human oversight. Do not retroactively change existing student grades without authorized records review. Apply this check to other elective languages and to pending written-answer appeals as a separate, privacy-controlled process.

## Editorial/source-fidelity flags (not yet corrected)

1. The Swahili discussion of the rapture describes a single return of Christ with the awkward phrase **“wakati wa kurudi mmoja wa Kristo.”** A fluent reviewer should clarify that the intended contrast is between a pretribulation event and the return of Christ understood as one event, without imposing a denominational position.
2. Both language versions say Baptist end-times views have differed “from the beginning,” yet the same lesson dates dispensational systematization to Darby in the nineteenth century. The source author should clarify the historical scope of “from the beginning” rather than imply every named view existed at Baptist origins.
3. The English key verse labels its source NKJV and the Swahili key verse labels SUV. Exact edition-text fidelity and quotation permissions were **not independently established** in this audit.

## Handoff / release gates

- **Claude + Swahili reviewer:** collate the two editorial flags against source intention, Scripture edition and idiomatic Swahili; create versioned, reviewed corrections.
- **Robert + academic assessor:** independently verify rubric false-positive behavior in test environment, document negation-sensitive scoring safeguards, and ensure answer keys never enter public bundles. No production change or grade alteration authorized here.
- **CTS academic authority:** approve final theological framing and reviewed translations. Preserve already earned credit.
- **Next work:** B-C2 whole-course cross-unit rubric scan; then French/Swahili parallel assessments and the 45-core-course Swahili archive inventory.

**Strategic opportunity:** A reusable *contradiction/negation test suite* per assessment language would catch misleading keyword-based grading before students are blocked or wrongly passed, improving both academic integrity and retention. This should be a report-only CI gate until the grading owner signs off.
