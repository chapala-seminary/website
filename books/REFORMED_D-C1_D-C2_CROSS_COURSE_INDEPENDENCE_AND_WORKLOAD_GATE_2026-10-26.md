# D-C1 / D-C2 — cross-course reading independence and workload release gate
**Research-only, 26 October 2026. NOT student-ready; no academic/rights approval or assessment keys.**

## Scope and method
Read all ten *exact current staged GitHub blobs* on `handoff/book-sources`, five in `books/D-C1/` and five in `books/D-C2/`, authenticated as `chapalatheological-ai`. Normalize Unicode text to lowercase alphanumeric word tokens (Unicode letters/numbers, dropping punctuation), form unique contiguous 12-token sequences for each file, and count intersection for all **25 D-C1 × D-C2 pairs**. Percent is intersecting unique sequences divided by the smaller file's unique-sequence count. This detects long exact duplicated passages, not paraphrases, thematic overlap, manuscript fidelity, or edition validity.

## Exact files and normalized counts
| Reading | Unicode-normalized tokens | Current Git blob SHA-1 |
|---|---:|---|
| D-C1 R1 | 11,207 | `d3d1840ab0ec15d0342e58fc34d7a385afa07457` |
| D-C1 R2 | 11,959 | `e6ff57e060dfabec39ac3b0273ab4c90eadaa7fc` |
| D-C1 R3 | 49,385 | `06ce0fbe7c5305bd6eb76b96e2b3d173c6929f13` |
| D-C1 R4 | 40,719 | `92739ecb474f9c15f7fe17db2d930705e885b033` |
| D-C1 R5 | 18,301 | `58867a35ff4c1f93130816c901dccc48e4cf2f48` |
| D-C2 R1 | 35,621 | `8c27603ad206ce8243b2e09961a45a5a046ad033` |
| D-C2 R2 | 42,448 | `6bd0bf2fd438784dbddf844a3e724ff4c6b7ced2` |
| D-C2 R3 | 23,213 | `e35e68b6574a93b2331835419eb4a3c8e3ec8008` |
| D-C2 R4 | 18,549 | `c697551123ee6f68690931b0305a95c3d67a7f4a` |
| D-C2 R5 | 20,574 | `665b746506c9765bc3e58e04d8ec4fc8ec8e179d` |

D-C1 totals **131,571 normalized tokens**; D-C2 totals **140,405 normalized tokens**; **271,976** across ten staged readings. These normalized counts differ from the source manifests' whitespace-token counts and are not claims of student assignment lengths. The longest staged reading is D-C1 R3 (**49,385 tokens**); D-C2 R2 has **42,448**. D-C1 R4 has **40,719**.

## Cross-course overlap: unique 12-token sequences
Rows D-C1 R1–R5; columns D-C2 R1–R5. Each cell = intersection count (percentage of smaller sequence set).

| | D-C2 R1 | R2 | R3 | R4 | R5 |
|---|---:|---:|---:|---:|---:|
| D-C1 R1 | 0 | 0 | 0 | 0 | 0 |
| D-C1 R2 | 1 (0.008%) | 0 | 0 | 0 | 0 |
| D-C1 R3 | 13 (0.037%) | 20 (0.047%) | 0 | 8 (0.043%) | 1 (0.005%) |
| D-C1 R4 | 40 (0.112%) | 0 | 14 (0.060%) | 16 (0.086%) | 12 (0.058%) |
| D-C1 R5 | 13 (0.071%) | 9 (0.049%) | 30 (0.165%) | 0 | 8 (0.044%) |

**Finding:** No cross-course pair exhibits substantial *exact long-passage* duplication (maximum 40 shared unique 12-grams, 0.165% of the smaller set). This supports the existing chapter-range disjointness claims, but does **not** establish five independent authors: all ten readings derive from Calvin's *Institutes* in the historical John Allen English translation. It also does **not** clear the distinct future textbook selections against either course's readings: the ~30k-word textbooks are not finalized.

## Material release risks and actionable recommendations
1. **Excessive staged workload.** These are chapter-range source extracts, not final student-length readings. Assigning all ten unabridged readings would impose ~270k normalized tokens across two electives *before* textbooks, units and exams. This could suppress first-unit participation. Wayne/Claude should approve a target reading workload (for example, a proposed 2–4k words per reading, not an adopted rule), preserve links to full historical sources as optional enrichment, and label all selections as abridged with exact source ranges. Preserve all source files.
2. **Independent-voice distinction.** Five nonoverlapping Calvin passages can support a deliberate *primary-source close-reading* course, but cannot honestly be described as five independent scholarly voices. Academic choice belongs to Wayne. If five distinct voices are required, curate them with separate edition, author, contributor, translator and Mexico rights checks before assessment.
3. **Assessment leakage across overlapping textbooks.** Before writing 40-question banks, version-pin final textbooks and run textbook↔reading and cross-course source *and question-topic* comparisons. Avoid awarding two sets of credit for materially identical content. This is a curriculum concern, not a claim that current live tests overlap.
4. **Stop downstream rework.** The 200 elective Swahili lesson/exam drafts are present, but source/rights and private-export gates remain open. Keep draft translations and keys isolated until final approved EN source revisions are frozen; otherwise source corrections propagate costly retranslation and grading ambiguity.
5. **Rights and textual fidelity HOLD.** Calvin (d.1564) and Allen (d.1839) historical contributions pass a preliminary Mexico life+100 screen, but scan collation, exact 19th-century edition identification, added editorial material, later translations, and Wayne's legal/academic sign-off remain outstanding. This is not a legal opinion.

**Handoff to Claude:** Choose/review proposed per-reading limits with Wayne; collate Allen edition against printed scans, identify five precise student selections for each course and source-page ledger, preserve original blobs, then prepare version-pinned EN/ES/FR materials and *private* banks only after source/rights approval. **Robert:** report-only workload/duplicate-source flags and beta checks, no silent course content change. **Wayne:** decide whether these are five primary-source *passages* or require five independent *voices*; no automatic release.

No student records, private keys, assessment answers, correspondence, merges, or production changes in this report.
