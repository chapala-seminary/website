# B-C3 current textbook/reading duplication audit

**Date:** 2026-10-26  
**Scope:** research-only audit of the files already present on `handoff/book-sources`.  
**Decision status:** evidence for academic review; this file does not authorize publication, assessment changes, or production deployment.

## Finding

All five current B-C3 `reading-*.md` files are, apart from short metadata/header text, contiguous verbatim slices of `textbook.md`. They therefore do **not** presently function as five independent substantive readings.

This confirms the previously suspected textbook-reading duplication with measured file-level evidence. The five historically independent candidates documented elsewhere in this folder should replace the duplicated slices only after original-edition collation, rights review, excerpt selection, translation, question-bank work, and Wayne's academic approval.

## Method

1. Fetched the exact branch copies of `textbook.md` and `reading-1.md` through `reading-5.md`.
2. Normalized case, Markdown links/tags, punctuation, and whitespace.
3. Counted normalized words.
4. Built unique 12-word shingles for each file.
5. Compared every reading with the textbook and measured the longest exact contiguous word run.
6. Also compared reading files to one another to distinguish shared boilerplate from substantive duplication.

This method is conservative: it ignores formatting differences and only counts exact normalized word sequences.

## Results

| File | Normalized words | 12-word shingles also in textbook | Reading shingles matched | Longest exact run |
|---|---:|---:|---:|---:|
| reading-1.md | 10,882 | 10,820 | 99.60% | 10,831 words |
| reading-2.md | 6,361 | 6,300 | 99.23% | 6,311 words |
| reading-3.md | 9,947 | 9,886 | 99.50% | 9,897 words |
| reading-4.md | 4,544 | 4,483 | 98.90% | 4,494 words |
| reading-5.md | 8,988 | 8,927 | 99.99% | 8,938 words |

The textbook contains 40,536 normalized words. The longest exact runs begin after roughly fifty words of per-file front matter, which explains nearly all of the unmatched material.

Cross-reading comparisons showed only small shared boilerplate runs (typically 33 words; maximum 42 words). The readings are different slices of the same textbook rather than five copies of one another.

## Academic and assessment consequence

Until replacement sources are approved:

- do not describe these five files as independent readings;
- do not count an examination based on them as an independent reading assessment;
- do not create or certify private banks that merely retest the same textbook passages;
- preserve any earlier valid student completion under the established grandfathering rule;
- do not delete or overwrite current files before a reviewed migration plan exists.

## Replacement gates

For each proposed R1–R5 replacement:

1. verify author, title, edition, and original page images;
2. select one coherent passage and record printed pages plus exact word count;
3. document U.S./Mexico/provider rights and exclude protected modern translations;
4. run the same overlap test against the textbook and other CTS course materials;
5. prepare independent EN/ES/FR text or an original trilingual digest;
6. create private 40-question banks only after source and academic approval;
7. test migration on beta with synthetic records and preserve historical completions.

## Reproducibility note

The measurements above were produced from these branch blobs on 2026-10-26:

- `textbook.md` — `4287e61d7ca3f9baac22c44565f3192eee645bff`
- `reading-1.md` — `466f2da8e7c98cdbff370d00c1e99b947f4ceaa4`
- `reading-2.md` — `5304d32d55b5edd86c4c378b61af742bdf1a67cc`
- `reading-3.md` — `99f146e2951a106d1b30d134a2c9cc31de17ddcc`
- `reading-4.md` — `283e3d46031b5a7bba0679634581a2db6e095d58`
- `reading-5.md` — `69afc0a97dae3ff6daec3275d2135d63d62d5240`

Re-run the audit whenever any of these blobs changes.
