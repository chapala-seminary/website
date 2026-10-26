# B-C4 current textbook/reading independence and manifest-consistency audit

**Date:** 2026-10-26  
**Scope:** exact files on `handoff/book-sources/books/B-C4` only.  
**Decision status:** research evidence; no publication, grading, assessment-policy, or production change is authorized.

## Finding

The current B-C4 source package does **not** reproduce the simple relationship stated in `SOURCE.md`.

The manifest says `textbook.md` is a combined, non-overlapping reader assembled from all five `reading-*.md` files. Exact normalized comparison of the current blobs shows a mixed result:

- reading 5 is almost wholly contained in the textbook;
- reading 1 is substantially, but not wholly, contained;
- readings 3 and 4 are only partly contained;
- reading 2 has almost no long exact-sequence containment.

This is both an **assessment-independence risk** and a **manifest/file consistency defect**. It is not proof that the live website contains these files, and it does not invalidate earlier student completions.

## Method

1. Fetched the exact current branch blobs for `textbook.md` and readings 1–5.
2. Lowercased text and removed Markdown links/tags, punctuation, and whitespace differences.
3. Built sets of exact contiguous 1-, 2-, 3-, 5-, 8-, 10-, and 12-word sequences.
4. Measured what percentage of each reading's unique sequences occurs in the textbook.
5. Measured the longest exact contiguous normalized word run.

The 12-word figure is the primary conservative measure. Shorter sequences help distinguish OCR noise or common vocabulary from sustained verbatim containment.

## Results

| Reading | Normalized words | 1-word | 3-word | 5-word | 12-word containment | Longest exact run |
|---|---:|---:|---:|---:|---:|---:|
| reading-1.md | 17,384 | 93.72% | 79.59% | 77.88% | **77.70%** | 13,394 words |
| reading-2.md | 10,241 | 70.63% | 9.66% | 1.52% | **1.12%** | 126 words |
| reading-3.md | 9,798 | 82.73% | 48.04% | 42.63% | **42.35%** | 4,041 words |
| reading-4.md | 14,641 | 80.58% | 45.29% | 40.39% | **40.07%** | 5,861 words |
| reading-5.md | 21,933 | 100.00% | 99.99% | 99.98% | **99.94%** | 21,802 words |

The textbook contains 45,286 normalized words under the same tokenizer.

Reading 2's high single-word overlap but collapse to 1.12% at twelve words indicates shared vocabulary/source context without sustained exact copying in the current blobs. The other four contain multi-thousand-word verbatim runs, so their overlap is substantive rather than coincidental.

## Exact branch blobs

- `textbook.md` — `d6f9830654d9332b22a052adb64168b0c63315a1`
- `reading-1.md` — `3cbf5c5904efac0bc014cf0f851040b6e83747c6`
- `reading-2.md` — `1247e6b51472b976b207d0b927e9f6ef87ad4a07`
- `reading-3.md` — `c94481bfd57d05ce4e642403b0999e244a1c5aa4`
- `reading-4.md` — `e3fbd09ff68c606d1b934709898f58bf74a35143`
- `reading-5.md` — `51decd31a7fe2b706794f337f2480bdce8dc7464`
- `SOURCE.md` — `8bace5f322b482615dcb82f18713129505d0da6b`

Re-run this audit whenever any listed blob changes.

## Required correction path

Before any student-facing release or private question-bank certification:

1. Collate each selection to the original 1870 page images and record printed page spans plus SHA-256.
2. Explain why current textbook/readings do not match the manifest's combined-reader claim.
3. Rebuild the package deterministically from one verified source extraction, or replace the five readings with genuinely independent historical voices.
4. Record exact word counts and repeat 10-/12-word containment tests.
5. Do not treat contained text as a separate independent Master's reading assessment.
6. If Wayne retains same-work, disjoint selections for pedagogical reasons, label them honestly and approve an integrated, nonduplicative assessment design.
7. Preserve earlier valid completions and do not overwrite the current package without a reviewed migration plan.
8. Keep all question keys in the private `assessment-keys` repository.

## Historical-context safeguard

Broadus's work must retain explicit historical context concerning slavery, racism, and his Confederate service. Source collation and public-domain status do not remove the need for academic contextualization.
