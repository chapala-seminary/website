# B-C4 correction: OCR angle brackets invalidated the earlier five-reading containment audit
**Independent source-only verification — 2026-10-28.** Research branch only. This is a correction to `books/B-C4/CURRENT_READING_INDEPENDENCE_AUDIT.md`, not a student-facing edit, copyright clearance, or assessment-policy decision.

## Material finding
The 26 October report called B-C4 a *mixed* textbook/reading package (R1 77.70%, R2 1.12%, R3 42.35%, R4 40.07%, R5 99.94%). That conclusion is **incorrect for the exact current files**. A normalization expression `/<[^>]*>/g` treats isolated OCR less-than/greater-than characters as enormous HTML tags. In the textbook it removes **259,364 characters** in just two spurious spans (194,135 and 65,227 characters), plus a harmless two-character `<>` span. It discards approximately **43,817 of 89,103** raw alphanumeric tokens (49.18%), causing false negative containment scores. The first spurious match begins with the OCR fragment `<30urging`; another begins `<^im-`. Neither is an HTML tag.

The source Markdown contains OCR, not HTML. A conservative correction tokenizes lowercase ASCII alphanumeric words **without stripping angle-bracket spans**. The original reading bodies are visibly present in the textbook: for example, the full R2 segment beginning `## Part I, Chapter V: Explanation` and ending before the R3 separator matches the textbook verbatim for **60,954 consecutive characters**. R2 was never an independent text.

## Corrected 12-token exact-shingle containment
| Reading | Raw normalized words | Matched 12-token windows | Total windows | Corrected containment | Earlier reported |
|---|---:|---:|---:|---:|---:|
| B-C4 R1 | 17,384 | 17,358 | 17,373 | **99.9137%** | 77.70% |
| B-C4 R2 | 10,241 | 10,216 | 10,230 | **99.8631%** | 1.12% |
| B-C4 R3 | 25,349 | 25,323 | 25,338 | **99.9408%** | 42.35% |
| B-C4 R4 | 14,641 | 14,614 | 14,630 | **99.8906%** | 40.07% |
| B-C4 R5 | 21,933 | 21,909 | 21,922 | **99.9407%** | 99.94% |

Exact `handoff/book-sources` blobs: textbook `d6f9830654d9332b22a052adb64168b0c63315a1`; R1 `3cbf5c5904efac0bc014cf0f851040b6e83747c6`; R2 `1247e6b51472b976b207d0b927e9f6ef87ad4a07`; R3 `c94481bfd57d05ce4e642403b0999e244a1c5aa4`; R4 `e3fbd09ff68c606d1b934709898f58bf74a35143`; R5 `51decd31a7fe2b706794f337f2480bdce8dc7464`.

## Reproduction and validation
For each file, use `s.toLowerCase().match(/[a-z0-9]+/g) || []` (no unbounded tag-stripping regex), build a set of all consecutive 12-token sequences in the textbook, and count each reading's 12-token windows that appear in the set. The denominator is `reading_tokens.length - 11`. This measures **exact containment**, not semantic overlap or educational independence. File front matter accounts for most unmatched windows. Repeated source claims must be assessed separately.

Cross-check: the same unbounded regex removes **7,150 of 43,545 tokens (16.42%)** from the B-C1 textbook; its corrected R1–R5 containment remains high (**99.037%, 98.562%, 99.521%, 99.310%, 99.334%**) and its earlier duplicate-source classification remains directionally sound. Other sampled textbook files A-C1, B-C2, B-C3, B-C5, C-C2, C-C3, D-C3, D-C4, D-C5 had **zero** tokens removed by that particular expression; C-C4's expected `textbook.md` path does not exist, so it was not tested here. Do not assume all previous audits used this regex; inspect their actual scripts before applying corrections.

## Corrected academic interpretation and handoff
**B-C4 is a textbook-contained five-reading set (category C), not the previously reported mixed case.** All five reading assignments overwhelmingly repeat passages already in the textbook. The manifest's combined-reader statement is broadly correct, though its uncollated 1870 OCR and very large workload still need original-page QA. This does not imply cheating or invalidate any existing award. It does call for faculty to decide whether the separate five-reading examination should be based on genuinely independent companion sources or intentionally integrated as a close-reading assessment. Preserve existing credits and do not silently change testing policy.

**Claude/faculty:** supersede the misleading B-C4 numerical table in the 26 October audit and the aggregate 20-course independence matrix; add a regression fixture with a stray OCR `<` and `>` separated by many paragraphs, ensuring the tokenizer does not erase text. Recompute any earlier source-overlap scores that stripped `<[^>]*>` across newlines. Then perform original 1870 page-image collation, contextualize Broadus's slavery/Confederate history, and separately review Mexican edition/translation rights and EN/ES/FR fidelity. Private answer-bank and student-history review must precede any approved exam change. No answer keys or student information belong in this public handoff.

**Status:** verified research correction only; no beta/main merge, production deployment, exam/grade/record change, email send, or rights approval.
