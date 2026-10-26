# C-C2 current reading-independence audit

**Course:** C-C2 — Wesleyan Theology  
**Scope:** current staged English source files on `handoff/book-sources`  
**Date:** 2026-10-26  
**Status:** nonproduction academic/assessment-quality evidence; not a deployment approval and not a judgment on prior student completions.

## Executive finding

The five current reading files are separate sermon windows, so they have very little 12-word overlap with one another. However, each reading is almost wholly contained in the staged textbook. A reading-vs-reading-only duplicate test would therefore pass while missing the central assessment-independence problem.

The source manifest explicitly says the readings are derived directly from corresponding textbook sections. The measurements below independently quantify that relationship.

## Exact source identities

- `textbook.md` — blob `2919780c500b645de5d9deedee6c4d6f809f4ee9`
- `reading-1.md` — blob `79125bcde2739c90d5d7e217c5e96729330c1678`
- `reading-2.md` — blob `bf3fcbf617c31d750ea323bf2a05731edb705762`
- `reading-3.md` — blob `89b7dc66626783ff0ddc90cd2732ae702b75a78d`
- `reading-4.md` — blob `0a2dd877b8f0f7ac04789b455789e604a7c629f6`
- `reading-5.md` — blob `888a95ec7853caf899a2367061fe242d5bc83295`
- `SOURCE.md` — blob `c22198db9949279ac44de993a806a7503d39e6a5`

## Reproducible method

1. Read the exact UTF-8 GitHub blobs listed above.
2. Normalize text with Unicode NFKC and lowercase it.
3. Tokenize Unicode letters and numbers, retaining internal apostrophes.
4. Build the set of every unique contiguous 12-word sequence in the textbook.
5. For each reading, calculate the percentage of its unique 12-word sequences also found in the textbook.
6. Track consecutive matching 12-word sequences on the same textbook/reading offset to calculate the longest exact contiguous run.
7. Separately compare each reading pair using the same unique 12-word sequences.

Markdown labels and small staging headers remain in the files. That makes the result slightly conservative: most nonmatching material is wrapper text, not independent academic content.

## Textbook-to-reading containment

The normalized textbook contains 49,769 tokens.

| Reading | Normalized tokens | Unique 12-word sequences in textbook | Longest exact contiguous run |
|---|---:|---:|---:|
| R1 | 7,613 | 99.86% | 7,602 words |
| R2 | 11,682 | 99.93% | 11,674 words |
| R3 | 10,117 | 99.90% | 10,107 words |
| R4 | 9,244 | 99.87% | 9,232 words |
| R5 | 11,156 | 99.91% | 11,146 words |

The five readings therefore cannot serve as independent source material from the textbook. A separate reading-set examination built from them would primarily reassess the same underlying text.

## Reading-to-reading comparison

The ten reading pairs share only 0–27 unique 12-word sequences. As a percentage of the smaller reading's unique sequence set, pairwise overlap ranges from 0.00% to 0.36%.

This is the important two-axis QA lesson:

- **Reading vs reading:** appears independent.
- **Textbook vs reading:** fails decisively.
- **Manifest:** confirms the readings are direct textbook windows.

Any automated report must test both axes and reconcile them with the source manifest. Pairwise reading comparison alone is insufficient.

## Required correction gate

Before CTS treats C-C2 as one textbook plus five independent substantive readings:

1. Wayne must decide whether the academic design intentionally uses Wesley's ten sermons twice or requires five genuinely independent voices.
2. If independent readings are required, Claude should propose five distinct works/authors, verify original page-addressable editions, select coherent excerpts, document US/Mexico/provider rights, and obtain academic approval.
3. Re-run textbook-vs-reading, reading-vs-reading, and cross-course overlap checks on the exact approved blobs.
4. Only then create EN/ES/FR readings and private assessment banks.
5. Keep answer keys in the private assessment repository.
6. Preserve earlier valid completions; this audit does not authorize retroactive grade or certificate changes.
7. Do not represent these staged files as live production without separate deployment verification.

## What this audit does not claim

- It does not inspect or certify live production course content.
- It does not approve replacement sources, translations, or rights.
- It does not create or expose assessment answers.
- It does not invalidate historical student work.
