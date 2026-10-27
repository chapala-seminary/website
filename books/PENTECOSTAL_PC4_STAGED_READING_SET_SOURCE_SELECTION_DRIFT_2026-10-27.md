# PC4 staged five-reading set — source-selection drift and assessment dependency gate

**Date:** 27 October 2026 (Mexico City)  
**Scope:** source-only reconciliation of the staged PC4 reading room and public trilingual reading bank. This report changes no student material, private key, grade, beta/main branch, or production deployment. It makes no legal-rights conclusion.

## Exact staged witnesses

- Reading room: `src/body/rooms/CTSElecPC4Readings.html`, beta/release-candidate blob `59725b9886633d111fc9289de36a9f59c42e7605`.
- Public question bank: `src/content/readings/elecpcfourreadings.json`, blob `bcd7af1b9bfcf08e036170c2d8dc2dee8ebc49d1`.
- The bank contains 40 EN/ES/FR fill-in prompts, eight per reading, with `requiredFrom: 2026-10-28T06:00:00Z` and private answers.
- The room accurately warns that its working text is uncorrected OCR, not yet collated with page images, and that quotations/page numbers are provisional. It nevertheless presents five complete trilingual CTS digests and feeds an active public bank.

## Selection drift from the reviewed five-chapter plan

The existing 25–26 October source handoff reviewed one provisional, nonoverlapping five-chapter plan: III, XXIII, XLV, LXXI, and LXXIV. It explicitly labeled those windows **zero facsimile-collated, rights-approved, translated, or student-ready readings** and prohibited examination facts.

The staged reading room uses a materially different plan:

| Staged reading | Staged chapter span | Previously reviewed candidate | Reconciliation result |
|---|---|---|---|
| R1 — “A Worm to Thresh a Mountain” | chapters I–III, about pp. 23–39 | chapter III only | Expanded backward by two chapters. Q1–5 rely substantially on the unreviewed childhood/family portion. |
| R2 — “Three Meetings a Day” | chapter XXII, about pp. 132–139 | chapter XXIII | Different chapter. The staged campaign narrative and Q9–16 were not source-bounded by the prior candidate audit. |
| R3 — “The Poor Despised Mourners’ Bench” | chapter VII, about pp. 58–64 | chapter XLV | Full substitution. The staged Monroeville narrative and Q17–24 were not in the reviewed window. |
| R4 — “A Good Counterfeiter” | chapters XXXIV–XXXV, about pp. 187–203 | chapter LXXI | Full substitution and expansion to two chapters. Q25–32 include precise places, counts, publications, and historically reported medical/spiritual claims from uncollated OCR. |
| R5 — “Your Daughters Shall Prophesy” | chapter LXXI, about pp. 478–486 | chapter LXXIV | Different chapter and now the exact chapter with the unresolved embedded poem/provenance hold. |

Only staged R1 partly overlaps the prior R1 window; staged R5 reuses the prior R4 window. The other staged selections are replacements, not refinements of the reviewed source plan.

## Known contributor/provenance issue now inside staged R5

Chapter LXXI contains the separately circulating poem **“The Starless Crown,”** an earlier stanza, and a following dying-child/ferryman anecdote requiring independent provenance. Existing research established pre-1912 witnesses but not a verified legal author or Mexican translation/reuse status. The room says poems by others are not reproduced, which is a sensible editorial strategy, but the exclusion must be verified against the actual EN/ES/FR digest boundaries and retained quotations. The chapter cannot be treated globally as Woodworth-Etter-authored merely because it appears in her book.

## Assessment dependency

All 40 public prompts derive from digests built before original-page collation. Highest-priority evidence checks are:

- **Q1–8:** names, date, family count, place names, first-sermon text, and quoted labels across the expanded chapters I–III.
- **Q9–16:** exact campaign locations, denominational labels, counts, earthquake comparison, baptism river, and civic venue from the substituted chapter XXII.
- **Q17–24:** exact church identity, duration, quoted claims, follow-up structure, and named historical details from the substituted chapter VII.
- **Q25–32:** exact quotations, place names, distribution count, medical/spiritual-report framing, baptism count, and historical xenolalia terminology across substituted chapters XXXIV–XXXV.
- **Q33–40:** biblical/theological quotations and paraphrases from chapter LXXI; separately verify that none depend on excluded poem/anecdote material.

Because private answers are inaccessible to the AI account, no answer-key parity or variant acceptance is claimed here.

## Material contradiction

The room's own provisional-source warning and the source manifest's fail-closed rules are incompatible with a time-activated examination bank unless the changed chapter plan has been independently facsimile-collated and privately revalidated. The current handoff contains no such correction ledger or academic approval. Five digests from one book also remain an unresolved academic-policy choice and may duplicate the textbook assessment.

## Required fail-closed repair

1. Hold PC4 reading-test activation/promotion until Wayne/faculty approve the exact five-reading plan and the textbook-versus-reading overlap.
2. Produce a new source-selection receipt mapping chapters I–III, XXII, VII, XXXIV–XXXV, and LXXI to exact 1912 printed pages, columns, stable transcript hashes, and contributor exclusions.
3. Verify every poem, hymn, inset report, quoted letter, anecdote, photograph, or later editorial contribution; retain transparent omission notes.
4. Regenerate/review EN/ES/FR digests only from the corrected, rights-disposed source units.
5. Privately revalidate all 40 answer mappings after source correction, starting with Q1–32 and the chapter-LXXI provenance boundary for Q33–40.
6. Preserve historical healing/vision claims as attributed testimony, not verified medical findings or modern medical guidance.
7. Require successful exact-head beta CI only after source, translation, academic, private-key, and owner release gates are satisfied.

## Handoff

- **Claude:** owns the revised source receipt, digest regeneration, and private-bank revalidation.
- **Wayne/faculty:** retain the five-reading, academic framing, rights, and release decisions.
- **ChatGPT:** no beta→main PR, merge, deployment, student-record action, or key publication from this report.
