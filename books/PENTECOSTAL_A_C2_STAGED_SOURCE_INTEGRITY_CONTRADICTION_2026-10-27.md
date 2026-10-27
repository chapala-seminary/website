# Pentecostal A-C2 staged source-integrity contradiction — 27 October 2026

**Scope:** release-source reconciliation only. This report does not change student material, assessment keys, beta, main, production, grades, certificates, or correspondence. It does not make a legal conclusion. It records a conflict between the staged A-C2 textbook and the existing A-C2 source QA so Claude and Wayne can resolve it before promotion.

## Exact repository witnesses

- Staged textbook: `src/content/textbooks/elecpctwo.json` on `claude/pentecostal-required`, blob `f0c9a08d4e8de3d04056846320102a5ce97a07a7` as fetched 27 October 2026.
- Source manifest: `books/A-C2/SOURCE.md` on `handoff/book-sources`.
- Governing source QA: `books/A-C2/CONSOLIDATED_REMAINING_ISSUES_SOURCE_QA_2026-10-26.md`.

## Verified conflict

The staged textbook is not merely a short CTS synthesis. It contains full trilingual bodies:

| Language | Body characters | Approximate words |
|---|---:|---:|
| English | 189,887 | 35,472 |
| Spanish | 197,141 | 34,714 |
| French | 208,706 | 34,840 |

The staged edition label is `Public-domain original / CTS interim elective edition 2026`. Its credits simultaneously state that the text comes from cleaned OCR that is **not yet collated with the page images**.

Chapter 5 reproduces `A Word to Ministers, from a Minister` and states that CTS restored its first-page two-column order “by a line table.” The existing consolidated QA reaches the opposite readiness conclusion for that same March 1909 article:

- the OCR heading is damaged/interleaved;
- the exact heading, byline, column order, and ending require the page images;
- the piece must not be translated or banked before that facsimile check.

The public staged bank already depends on this unresolved article:

- question 33 asks what ministers need and is drawn from its opening;
- question 35 asks what ministry becomes when ministers seek to please people.

Those prompts exist in English, Spanish, and French. A later source correction could therefore change both student text and private answer evidence.

## Other verified source-status inconsistencies

1. The source manifest still labels A-C2 a source/replacement proposal rather than a finished textbook.
2. The staged book incorporates an unsigned `In Memoriam` while the edition label broadly says “Public-domain original.” This report does not decide its legal status; the contributor/provenance record should identify the author status rather than imply that Durham’s 1912 death resolves every item in the compilation.
3. The staged credits correctly disclose uncollated OCR, but the student-facing text and assessment bank treat the affected selection as settled enough for required testing.

## Required release disposition

1. **Hold the “A Word to Ministers” reproduction and dependent questions 33 and 35** until the original page images establish heading, authorship/byline, column sequence, and end boundary.
2. Preserve the line-table reconstruction as an auditable artifact: source image references, transcription rows, column assignment, and reviewer.
3. After facsimile verification, regenerate EN/ES/FR text and privately revalidate both answer keys against the corrected evidence.
4. Replace the broad edition label with precise item-level provenance/status wording, or obtain Wayne’s explicit source/rights approval for the exact compiled contents.
5. Do not promote A-C2 merely because the other Durham selections may be usable; the bank already samples the unresolved article.

## Release implication

This is a source-fidelity and assessment-evidence blocker for the staged A-C2 candidate. It does not by itself override Wayne’s prior source-use decision or determine copyright status. The contradiction can be closed by facsimile-backed transcription plus item-level provenance and private-key revalidation.
