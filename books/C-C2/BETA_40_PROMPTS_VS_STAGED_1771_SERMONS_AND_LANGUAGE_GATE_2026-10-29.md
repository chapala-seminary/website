# C-C2 beta 40-prompt source and language gate

**Course:** C-C2 — Wesleyan Theology  
**Date:** 2026-10-29  
**Scope:** public beta reading-test stems versus the exact staged 1771 sermon windows on `handoff/book-sources`  
**Status:** nonproduction evidence only; no accepted answer, private key, grade, credit, or live student record was accessed or changed.

## Exact inputs

- Public beta definition: `src/content/readings/elecwestworeadings.json`, blob `d6be0d44cd41d1a865aca4883fe35a6d53a5850d`
- Public beta room: `src/body/rooms/CTSElecWes2Readings.html`, blob `5cbe72a14d6bcf255874adfc672387639748048e`
- Staged textbook: `books/C-C2/textbook.md`, blob `2919780c500b645de5d9deedee6c4d6f809f4ee9`
- Reading windows: R1 `79125bcde2739c90d5d7e217c5e96729330c1678`; R2 `bf3fcbf617c31d750ea323bf2a05731edb705762`; R3 `89b7dc66626783ff0ddc90cd2732ae702b75a78d`; R4 `0a2dd877b8f0f7ac04789b455789e604a7c629f6`; R5 `888a95ec7853caf899a2367061fe242d5bc83295`
- Public rule observed: 40 stems, draw 20, pass 18, four drawn per reading, required-from `2026-10-28T06:00:00Z`.

## Verified findings

- **36/40 DIRECT:** the prompt proposition is recoverable from its assigned staged sermon window.
- **4/40 CTS CONTEXT:** Q3, Q9, Q13, and Q24 depend on date, attribution, reception, or later institutional context not supplied by the assigned reading window.
- **0 PARTIAL; 0 OUTSIDE THE DOCUMENTED COURSE CONTRACT** under this classification. The four contextual stems have some CTS metadata support, but are not reading-grounded.
- **Language completeness:** EN/ES/FR are present on all 40 stems. Swahili is present on 39/40; **Q27 has no `sw` field**.
- The public file correctly attributes Sermon III to Charles Wesley in Q9, but the assigned R2 excerpt itself omits the original footnote attribution. The staged collected-volume title must not be used to imply that all ten sermons are by John Wesley.
- Existing reproducible containment measurements show R1–R5 are **99.86%–99.93% contained in the textbook**. These are five close-reading windows from one ten-sermon source, not five independent works.

## All-40 non-answer-bearing crosswalk

| Q | Reading | Prompt focus | Classification | Assigned-source locator / gate |
|---:|---:|---|---|---|
| 1 | R1 | grace/faith relation | DIRECT | Sermon I |
| 2 | R1 | character of saving faith | DIRECT | Sermon I |
| 3 | R1 | June 1738 and London meeting chronology | CTS CONTEXT | Absent from R1; date is already flagged as disputed |
| 4 | R1 | servile versus filial fear | DIRECT | Sermon I |
| 5 | R1 | guilt and dominion of sin | DIRECT | Sermon I |
| 6 | R1 | examples of mercy | DIRECT | Sermon I |
| 7 | R1 | marks of the almost Christian | DIRECT | Sermon II |
| 8 | R1 | proverb about intentions | DIRECT | Sermon II |
| 9 | R2 | Charles Wesley authorship and 1742 date | CTS CONTEXT | Contributor correction in SOURCE metadata; original 1771 note still needs scan collation |
| 10 | R2 | meaning of spiritual sleep | DIRECT | Sermon III |
| 11 | R2 | outward righteousness image | DIRECT | Sermon III |
| 12 | R2 | definition of true religion | DIRECT | Sermon III |
| 13 | R2 | St Mary's Oxford date and later reception | CTS CONTEXT | Absent from R2 |
| 14 | R2 | Christianity in heart and life | DIRECT | Sermon IV |
| 15 | R2 | spread of scriptural Christianity | DIRECT | Sermon IV |
| 16 | R2 | Christian polity application | DIRECT | Sermon IV |
| 17 | R3 | justification as pardon | DIRECT | Sermon V |
| 18 | R3 | justification and sanctification | DIRECT | Sermon V |
| 19 | R3 | Romans 4:5 subject | DIRECT | Sermon V |
| 20 | R3 | faith and boasting | DIRECT | Sermon V |
| 21 | R3 | faith and the believer's good | DIRECT | Sermon VI |
| 22 | R3 | covenants of works and grace | DIRECT | Sermon VI |
| 23 | R3 | recipient of covenant of works | DIRECT | Sermon VI |
| 24 | R3 | 1763 Model Deed and doctrinal standards | CTS CONTEXT | Absent from R3; institutional-history claim requires an assigned source |
| 25 | R4 | kingdom in the Holy Spirit | DIRECT | Sermon VII |
| 26 | R4 | orthodoxy without true religion | DIRECT | Sermon VII |
| 27 | R4 | repentance before faith | DIRECT | Sermon VII; public stem lacks Swahili |
| 28 | R4 | kingdom as holiness and happiness | DIRECT | Sermon VII |
| 29 | R4 | motive for works of mercy | DIRECT | Sermon VIII |
| 30 | R4 | Corinthians and remaining sin | DIRECT | Sermon VIII |
| 31 | R4 | involuntary failings | DIRECT | Sermon VIII |
| 32 | R4 | sudden temptation and consent | DIRECT | Sermon VIII |
| 33 | R5 | three spiritual states | DIRECT | Sermon IX |
| 34 | R5 | fear and love across states | DIRECT | Sermon IX |
| 35 | R5 | Romans 7 awakened-state cry | DIRECT | Sermon IX |
| 36 | R5 | Spirit of adoption | DIRECT | Sermon IX |
| 37 | R5 | mistaken assurance | DIRECT | Sermon X |
| 38 | R5 | testimony of the Spirit | DIRECT | Sermon X |
| 39 | R5 | priority of divine witness | DIRECT | Sermon X |
| 40 | R5 | character of true assurance | DIRECT | Sermon X |

## Release gates

1. Faculty must decide whether C-C2 intentionally assigns five close-reading windows from the textbook or requires five genuinely independent substantive readings. Do not label the present windows independent.
2. Provide assigned, page-addressable sources for Q3, Q9, Q13, and Q24, or version those stems out of the reading-grounded pool. Preserve historical student credits.
3. Collate the original 1771 page image for Sermon III's heading/footnote before final attribution display; retain the John/Charles distinction in every language.
4. Add and independently review Q27 Swahili before release; then run native theological review for all EN/ES/FR/SW stems.
5. Only after the source contract is approved should the private assessment bank be checked for parity. Keep keys out of the public repository.
6. Rights remain preliminary: Wesley-era underlying texts appear historically reusable, but modern notes, translations, and site presentation require separate clearance.

No merge, deployment, student-data change, or academic/rights approval is authorized by this report.
