# B-C2 Baptist Theology — current reading independence audit

**Independent report-only audit | 2026-10-26 | `handoff/book-sources` research branch**

## Scope and conclusion

This audit compares the staged B-C2 textbook with all five staged required readings and also compares every reading pair. It does **not** certify the live website, source rights, historical transcription fidelity, translations, examinations, or academic sufficiency.

The manifest's narrow structural claim is supported: the five readings use different passages from John L. Dagg's larger *Manual of Theology* than the staged textbook. Four readings have **0.00%** exact 12-word-shingle containment in the textbook; reading 5 has only **0.12%**. Reading-to-reading containment is also low (maximum **0.37%**).

That does **not** make the bundle five independent voices: the textbook and all five readings remain selections from **one author and one larger work**. This is category **B — same work, disjoint passages**, not category A (independent sources) and not category C (readings contained in textbook). Wayne must decide whether this single-author deep-reading design satisfies the intended learning outcomes or whether five distinct Baptist voices are required.

## Exact staged evidence

Textbook: `books/B-C2/textbook.md`  
Blob SHA: `97a741f93a768eb2246a264b45bcdd960506acc1`  
Normalized word count: **29,965**

| Reading | Staged subject / Dagg book | Blob SHA | Normalized words | Matched 12-word shingles / total | Textbook containment | Longest exact run |
|---|---|---|---:|---:|---:|---:|
| 1 | Existence of God / Book II | `c6b2300898551928387cc6dbceeece42755be103` | 2,141 | 0 / 2,130 | **0.00%** | 8 words |
| 2 | Creation / Book III | `1839d0ffdc43c03b437827cbbbf91aa411071dd5` | 2,037 | 0 / 2,026 | **0.00%** | 8 words |
| 3 | States of Christ / Book V | `c1e09a599e802b1236d6cca47203f42bd95c5c6d` | 1,759 | 0 / 1,748 | **0.00%** | 8 words |
| 4 | Covenant of Grace / Book VII | `f5dc8c26ea7a198ab597b90f2007ea09cffac9a9` | 1,887 | 0 / 1,876 | **0.00%** | 8 words |
| 5 | Justification and Adoption / Book VII | `41236a5bacc5d44ff33517f9ec134c1ddcf247fe` | 4,845 | 6 / 4,834 | **0.12%** | 15 words |

The six matched shingles in reading 5 form one short shared run, not broad reproduction. The result is consistent with adjacent theological cross-reference or repeated wording inside one larger work.

## Reading-to-reading exact overlap

For each pair, the percentage below is the later reading's exact 12-word shingles also found in the earlier reading. Template/provenance language was retained, making these conservative upper bounds for substantive overlap.

| Pair | Shared unique 12-word shingles | Later-reading containment |
|---|---:|---:|
| R1–R2 | 6 | 0.30% |
| R1–R3 | 6 | 0.34% |
| R1–R4 | 6 | 0.32% |
| R1–R5 | 5 | 0.10% |
| R2–R3 | 6 | 0.34% |
| R2–R4 | 7 | 0.37% |
| R2–R5 | 5 | 0.10% |
| R3–R4 | 6 | 0.32% |
| R3–R5 | 5 | 0.10% |
| R4–R5 | 18 | 0.37% |

No pair shows broad duplication. Most shared shingles are expected front matter, citation or repeated formulaic language.

## Reproducible method

1. Fetch exact UTF-8 blobs from `handoff/book-sources` through the CTS GitHub AI account.
2. Lowercase; remove Markdown link/tag markup, punctuation and diacritics; split into ASCII alphanumeric word tokens.
3. Build the set of every contiguous 12-word sequence in the comparison source.
4. Count reading shingles present in the textbook set; report matched/total and percentage.
5. Measure the longest contiguous exact token run.
6. Repeat across all ten reading pairs.

This exact-sequence method detects reproduction, not semantic similarity or common doctrine. It can miss paraphrase and modernization. Because the current files are provisional transcriptions, all source-fidelity and page-collation holds remain.

## Academic and release implications

- **No duplicate-assessment defect established:** the current textbook and reading files do not broadly repeat one another.
- **Single-author concentration remains:** six assessed sources all represent Dagg. Separate exams could measure breadth across his system, but not comparison among Baptist voices.
- Tag this course **SAME-WORK CLOSE READING / DISJOINT PASSAGES** unless Wayne approves an independent-voices redesign.
- If the pedagogical purpose is mastery of Dagg, write genuinely nonduplicative learning objectives for each source and avoid presenting the readings as independent authors.
- If the purpose is comparison across the Baptist tradition, replace the five readings with page-addressable sources from distinct authors and document edition, passage boundaries, printed pages, checksum, rights, EN/ES/FR translation review, and private 40-question bank lineage.
- Preserve all valid prior student completions. Do not infer cheating or revoke credit from a source-design audit.

## Remaining holds

- Collate every excerpt against the identified 1871 Library of Congress scan or another original printed witness.
- Resolve the unverified 1857-versus-1871 edition relationship.
- Verify U.S. and Mexico rights plus provider restrictions for the exact transcription.
- Perform full English source-fidelity review before Spanish/French translation or private exam-bank generation.
- Obtain Wayne's academic decision: deliberate one-author survey or five independent Baptist voices.

**Status:** staged English files measured and classified. No staged lesson/readings edited; no translation, private bank, student record, grade, certificate, production or policy change.
