# D-C4 current reading-independence audit

**Course:** D-C4 — Presbyterian Polity and Church Government  
**Scope:** current staged `textbook.md` and `reading-1.md` through `reading-5.md` on `handoff/book-sources`  
**Date:** 2026-10-26  
**Status:** nonproduction assessment-quality evidence; not deployment approval and not authority to revise prior student records.

## Executive finding

All five reading files are nearly complete sections of the staged textbook. Unique 12-word textbook containment ranges from **95.52% to 98.44%**, with exact contiguous runs covering nearly each entire reading.

The readings are non-overlapping partitions, so reading-to-reading overlap is almost zero. A pairwise reading-only duplicate check would therefore pass while completely missing the textbook-reading dependence. The source manifest independently confirms that the five readings cover the textbook's 19 sections exactly once.

## Exact source identities

- `SOURCE.md` — blob `a319fd521e70589b471fe33631dece290d36ee3b`
- `textbook.md` — blob `4cba004563ee546d805eca22c58e2482966213a3`
- `reading-1.md` — blob `412d8a201e8dad9cb0000613d88c5ef4bf36b2c6`
- `reading-2.md` — blob `3c4432255ac56a4e5c0ba608ab1cce5533ca8bd2`
- `reading-3.md` — blob `c0db4e0c1ff9b5ac9a4b6bfdab0363390d52e018`
- `reading-4.md` — blob `52113abb1a612c040b9a8d828f74381c5997a7ec`
- `reading-5.md` — blob `d3dff49ee0022d7ca42abad24d8c06c03804ae02`

## Method

1. Read the exact UTF-8 GitHub blobs listed above.
2. Normalize with Unicode NFKC and lowercase.
3. Tokenize Unicode letters and numbers, retaining internal apostrophes.
4. Build the set of all unique contiguous 12-word sequences in the textbook.
5. Measure the percentage of each reading's unique 12-word sequences found in the textbook.
6. Track consecutive matching 12-word sequences on the same offset to determine the longest exact contiguous run.
7. Separately compare each pair of readings.

Markdown wrapper text remains in the calculation, making the containment figures conservative rather than inflated.

## Textbook-to-reading containment

The normalized textbook contains 5,381 tokens.

| Reading | Tokens | Unique 12-word sequences in textbook | Longest exact run |
|---|---:|---:|---:|
| R1 | 1,081 | 97.85% | 1,058 words |
| R2 | 1,422 | 98.44% | 1,400 words |
| R3 | 809 | 96.42% | 784 words |
| R4 | 836 | 95.52% | 799 words |
| R5 | 1,327 | 96.73% | 1,284 words |

These files do not constitute five academically independent readings from the textbook. A separate reading-set examination based on them would mainly reassess the same historical document.

## Reading-to-reading comparison

Across all ten reading pairs:

- six pairs share zero unique 12-word sequences;
- the remaining pairs share only 1, 3, or 4 sequences;
- maximum overlap is 0.49% of the smaller reading's unique sequence set.

Therefore:

- **reading vs reading** appears independent;
- **textbook vs reading** fails;
- **manifest review** confirms deliberate partitioning.

Report-only CI must test both axes and reconcile the result with the manifest.

## Source and rights boundaries

The manifest identifies the 1645 Westminster Assembly work as the historical source and the OpenChristianData transcription as the staged witness. It also states that proof-text apparatus is incomplete and original-witness collation remains pending. This audit does not certify completeness, edition fidelity, current denominational authority, translation rights, or live deployment.

The directory-related files already present in the course folder are separate staged research material; they are not silently substituted here and require their own academic/source review.

## Required correction gate

1. Wayne must decide whether D-C4 intentionally uses a single-document close-reading model or requires one textbook plus five independent works.
2. If independence is required, Claude should identify five distinct, page-addressable historical voices or denominational polity witnesses; document exact editions, coherent excerpts, US/Mexico/provider/translator rights, and theological context.
3. Re-run textbook-vs-reading, reading-vs-reading, manifest, and cross-course overlap checks on the approved exact blobs.
4. Only after academic and rights approval should EN/ES/FR readings and private assessment banks be completed.
5. Keep all answer keys in private `assessment-keys`.
6. Preserve earlier valid completions; this audit does not authorize retroactive grade or certificate changes.
7. Do not represent staged files as live without separate deployment verification.
