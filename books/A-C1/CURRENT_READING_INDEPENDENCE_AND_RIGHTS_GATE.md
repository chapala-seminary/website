# A-C1 Pentecostal History and Development — independence and rights release gate

**Independent report-only audit | 2026-10-26 | `handoff/book-sources` research branch**

## Decision summary

A-C1 is a mixed case, not a five-reading duplication bundle:

- **Reading 1 is substantially contained in the textbook.** On complete staged files, 90.176% of its exact 12-word shingles occur in `textbook.md`; after removing Markdown headings and provenance blockquotes, body containment is **98.679%**.
- **Readings 2–5 are not substantially contained in the textbook.** Measured containment is 0.000%, 0.000%, 0.125%, and 0.000%.
- The readings do not substantively duplicate one another. The maximum complete-file pairwise containment is 1.016%, caused entirely by repeated CTS provenance/warning language; substantive body overlap is effectively zero.
- Nevertheless, all six files are selections from one historical periodical, *The Apostolic Faith*. They provide chronological documentary breadth, not five independent scholarly voices.
- The existing **Mexico contributor-level rights hold and original-scan fidelity hold remain in force**. This report is not legal advice or publication approval.

The present design therefore contains **one duplicate assessment source (R1)** plus four distinct later-issue primary-source passages. Wayne must decide whether R1 should be replaced, whether the course intentionally uses a periodical close-reading design, and whether independent historical/scholarly voices are required.

## Exact staged evidence

Textbook: `books/A-C1/textbook.md` — *The Apostolic Faith*, Vol. I, Nos. 1–2  
Blob SHA: `a18ba49a7df9395ee8346db5e03d5eb88b21f9d8`  
Normalized full-file word count: **28,431**

| Reading | Issue / staged subject | Blob SHA | Full-file words | Matched 12-word shingles / total | Full-file containment | Longest exact run |
|---|---|---|---:|---:|---:|---:|
| 1 | No. 2 / Pentecostal Baptism Restored | `93e098dc23197a17c410d4147527f1fd8dbe0ecf` | 1,833 | 1,643 / 1,822 | **90.176%** | 1,052 words |
| 2 | No. 3 / Bible Pentecost | `1472a0f812a7c23d9af581f5db59877e3c5b74dc` | 1,164 | 0 / 1,153 | **0.000%** | 8 words |
| 3 | No. 4 / Seven Months of Pentecostal Showers | `2cb3ffb05434732ca10fdad658d7edf10bcdc990` | 995 | 0 / 984 | **0.000%** | 9 words |
| 4 | No. 5 / Beginning of World Wide Revival | `653a286bc293dbf9f6f5bc270e36b2834b499032` | 813 | 1 / 802 | **0.125%** | 12 words |
| 5 | No. 6 / Pentecost Both Sides the Ocean | `c8c9bc696c47faa8f354b8317f87bdda60f41604` | 1,224 | 0 / 1,213 | **0.000%** | 9 words |

### Body-only cross-check

Removing lines beginning with Markdown headings or provenance blockquotes produces:

| Reading | Body words | Matched / total 12-word shingles | Body containment |
|---|---:|---:|---:|
| 1 | 1,676 | 1,643 / 1,665 | **98.679%** |
| 2 | 1,114 | 0 / 1,103 | **0.000%** |
| 3 | 929 | 0 / 918 | **0.000%** |
| 4 | 731 | 1 / 720 | **0.139%** |
| 5 | 1,174 | 0 / 1,163 | **0.000%** |

R1's unmatched portion is small editorial/provenance and omission-boundary material. Its 1,052-word exact run confirms broad reproduction from textbook No. 2. R4's single 12-word match is isolated and does not establish duplication.

## Reading-to-reading overlap

Complete-file pairwise containment of the later reading is:

| Pair | Shared unique 12-word shingles | Later-reading containment |
|---|---:|---:|
| R1–R2 | 0 | 0.000% |
| R1–R3 | 0 | 0.000% |
| R1–R4 | 0 | 0.000% |
| R1–R5 | 0 | 0.000% |
| R2–R3 | 10 | 1.016% |
| R2–R4 | 0 | 0.000% |
| R2–R5 | 10 | 0.824% |
| R3–R4 | 0 | 0.000% |
| R3–R5 | 10 | 0.824% |
| R4–R5 | 0 | 0.000% |

The three ten-shingle results are the same repeated provenance sentence (“transcription checked against scan pending … primary source …”), not periodical body text. Pairwise substantive overlap is therefore effectively zero.

## Rights and source-fidelity gate

The current `SOURCE.md` and `RIGHTS_REVIEW.md` correctly keep publication, translation, and downstream distribution on hold pending contributor-level review and scan collation.

- Mexico's current Federal Copyright Law states that publication in a newspaper or magazine does not remove legal protection (Article 15) and gives named authors a life-plus-100-year patrimonial term (Article 29(I)): https://www.diputados.gob.mx/LeyesBiblio/pdf/LFDA.pdf
- Pre-1931 publication is relevant to U.S. public-domain status but does not independently resolve Mexico contributor terms, authorship, translation/provider restrictions, or faithful-transcription questions.
- Wayne's Option 2 filtering reduces risk by excluding signed or individual first-person material whose author is not established as having died before 1926. It does not replace contributor attribution, original-scan inspection, or legal approval.
- The staged textbook still includes material whose contributor status requires review. Do not translate it or derive questions until a page-level contributor ledger identifies author/unsigned status, issue/page, source scan, excerpt boundaries, death evidence where applicable, and reviewer.
- Preserve an immutable transcription, a separately versioned corrected text, and an emendation ledger. Do not silently repair encoding/OCR against another modern transcription.

## Academic options for Wayne

1. **Intentional periodical close reading:** keep the textbook and four later-issue readings, replace R1 with a nonoverlapping issue or passage, and label the assessment as a chronological primary-source study rather than independent voices.
2. **Independent-voices design:** retain the textbook as the Azusa documentary core and replace all five readings with distinct, page-addressable authors or historians representing different Pentecostal perspectives. Verify exact rights and passage boundaries before adaptation.
3. **Integrated assessment:** treat R1 as part of the textbook and remove its separate nominal reading assessment; this changes the intended academic design and therefore requires Wayne's explicit approval.

In every option, preserve valid prior completions. Do not infer student misconduct or revoke credit from a source-design problem.

## Reproducible method

1. Fetch exact UTF-8 blobs from `handoff/book-sources` using the CTS GitHub AI account.
2. Lowercase, remove Markdown link/tag markup, punctuation and diacritics, and tokenize ASCII alphanumerics.
3. Build the set of all contiguous 12-word sequences in the comparison source.
4. Count reading shingles appearing in the textbook set; record matched/total, percentage and longest exact token run.
5. Repeat for all ten reading pairs.
6. Recalculate a body-only check after removing heading and provenance-blockquote lines.

This detects exact reproduction, not paraphrase or semantic similarity.

**Status:** exact staged English source relationships measured. No staged source edited; no translation, private bank, student record, grade, certificate, production, legal or academic-policy action taken.
