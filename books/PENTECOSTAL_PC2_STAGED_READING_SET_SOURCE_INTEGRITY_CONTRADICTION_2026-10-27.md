# PC2 staged five-reading set — source-integrity and assessment dependency gate

**Date:** 27 October 2026 (Mexico City)  
**Scope:** source-only reconciliation of the staged PC2 reading room and its public trilingual question bank. This report changes no student text, answer key, grade, beta/main branch, or production deployment. It makes no legal-rights conclusion.

## Exact staged witnesses

- Reading room: `src/body/rooms/CTSElecPC2Readings.html`, release-candidate blob `36feb8edca0f4fabdb69e4dea9718fea9fe8878e`.
- Public question bank: `src/content/readings/elecpctworeadings.json`, release-candidate blob `7faa302b806dfbdab3af168bce3691e8470d864f`.
- The bank contains 40 EN/ES/FR fill-in prompts, eight per reading, with `requiredFrom: 2026-10-29T06:00:00Z` and private answers.
- The room presents five CTS-authored digests and repeatedly states that Durham's source text is public domain.

## Existing source gates used for comparison

- `AUG1911_COLUMN_ORDER_AND_ATTRIBUTION_SOURCE_QA_2026-10-26.md`, blob `6a244e5bc215104980f70daddebcd35f1efc0ace`.
- `CONSOLIDATED_REMAINING_ISSUES_SOURCE_QA_2026-10-26.md`, blob `bea2ef5661dd3dc7ef648521595317bded000c75`.
- These reports treat repository OCR as a finding aid on mixed/interleaved pages and require original-facsimile column collation before translation, digesting, or assessment dependence.

## Reconciliation by reading

| Reading | Room's declared source | Existing source finding | Assessment dependency |
|---|---|---|---|
| 1 — “The Third Time He Remained” | March 1909, printed pp. 5–7 | The supplied artifact begins at printed p.5 partway through another article. Durham's testimony must be segmented within p.5 and stopped before the separate Baptist-pastor heading on p.8. Full-page/OCR extraction is not a verified article surrogate. | Q1–8 are already published as trilingual prompts; Q4–8 rely especially on exact names, dates, formulae, or a later memorial witness and must be source-mapped separately. |
| 2 — “Two Experiences, Not Two Works” | August 1911, pp. 5–7 | The article begins after R. J. Scott's separately signed testimony on p.5 and transitions to a new article on p.7. Start/end and column order require facsimile collation. | Q9–16 depend on exact doctrinal wording and historical formulations from this unresolved span. |
| 3 — “Complete in Him” | August 1911 pp. 1–3 plus January 1912 pp. 1–3 | The room openly says the January heading is illegible in scan text. Existing QA is stronger: January OCR p.1 has only 74 characters and no usable title/byline; p.2 begins mid-argument, so the continuation cannot be selected as a standalone reading until the facsimile establishes title, author, and start boundary. | Q21 explicitly treats the January article as having a known opening; the reading and any dependent answers must remain provisional. Q17–24 need passage-level witness mapping rather than a blended two-issue digest assumption. |
| 4 — “Change Its Name” | August 1911, pp. 7–9 | The article begins on p.7, but p.8 has demonstrably interleaved columns. The OCR alternates unrelated clauses and is not a faithful continuous reading order. | Q25–32 depend on exact phrases, names, and arguments from a span containing the verified interleaving defect. |
| 5 — “How It Began and How It Ended” | August 1911, pp. 3–4 | The first-person Azusa narrative continues into p.4 and ends before a separate `TESTIMONY` heading. The following testimony continues to p.5 and is signed R. J. Scott. Existing QA says the Azusa narrative's byline/editorial attribution must be verified from the facsimile. | Q33–38 rely on exact dates, people, locations, and quotations from this mixed-boundary span. Q39–40 invoke later historical claims and require their own cited secondary-source records rather than inheriting the periodical citation. |

## Material contradiction

The staged room and bank are release-shaped and time-activated, but four of five digests directly traverse article boundaries or interleaved OCR already marked unsafe. The fifth blends an August witness with a January continuation whose opening title/byline are unavailable in OCR. Labeling the digests as CTS-authored does not cure false source order, attribution, or unverified precision facts: the derivative content and its assessment answers still depend on those witnesses.

This is therefore a release-critical source-integrity contradiction, not a formatting defect.

## Required fail-closed repair

1. Hold PC2 reading-test activation/promotion until each reading has original-facsimile `start_page`, `start_column`, `end_page`, `end_column`, title, byline evidence, and a stable diplomatic transcription.
2. Separate Durham, R. J. Scott, editorial, memorial, and later-historian evidence at passage level. Do not inherit authorship from issue editor or adjacent page content.
3. Rebuild each CTS digest from the verified derivative, then independently review EN/ES/FR.
4. Invalidate and privately revalidate all 40 answer mappings after source correction. Prioritize Q4–8, Q9–16, Q21, Q25–32, and Q33–40.
5. Keep public question stems free of answer-key material; review the private repository separately under owner-authorized access.
6. Require exact-head beta CI only after source, translation, academic, and owner release gates are satisfied.

## Handoff

- **Claude:** owns the PC2 reading/digest rebuild and private-bank revalidation; use this report as the source exclusion and dependency checklist.
- **Wayne/faculty:** retain academic and release approval, including the decision whether five digests from one periodical constitute five substantive readings.
- **ChatGPT:** no beta→main PR, merge, deployment, student-record action, or answer-key publication from this report.
