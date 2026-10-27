# A-C2 — December 1909 OCR page-loss and cross-column corruption gate

**Date:** 2026-10-26 (Mexico City)  
**Scope:** source-only QA for Claude's active A-C2 build. No reading, translation, digest, assessment item, answer key, beta file, production file, or student record is changed.

## Evidence examined

- `books/A-C2/ISSUES-RECEIVED-2026-10-26.md`: the December 1909 PDF has 16 pages, SHA-256 `5b53e42af6b2a05f54bb4bc1170d2c98d195a0c82283a1c1b02e71cd1d3a2d85`.
- `books/A-C2/pentecostal-testimony-1909-12-source.txt`: unedited `pdftotext` layer, Git blob `7fa8885e532cfccd13593b5ec75d93931e133aa7`, 92,987 characters.

The PDF itself is outside Git and was not available in this audit. Page-image findings therefore remain for Claude to verify against the checksummed facsimile.

## Newly verified findings

### 1. Four PDF pages have no OCR text: printed/PDF pages 1–2 and 15–16

The text layer contains sixteen page delimiters. Mapping content between delimiters to the 16-page receipt shows:

| PDF page | OCR state | Boundary consequence |
|---|---|---|
| 1 | empty | cover/first-page metadata and any text absent |
| 2 | empty | opening article/title/byline evidence absent |
| 3–14 | populated | discovery only; quality ranges from poor to severely corrupt |
| 15 | empty | continuation/end evidence absent |
| 16 | empty | continuation/end/back-page evidence absent |

This refines the earlier “12/16 OCR-bearing segments” warning: the losses are not scattered harmless blanks. They remove **both ends of the issue's textual witness**.

### 2. The surviving page 3 begins in the middle of an unidentified article

The first populated page starts: “the chance they could ask for ...” and continues a discussion of organizations and the Pentecostal movement. No title or byline precedes it in the surviving OCR. Because pages 1–2 are absent from the text layer, neither title, author, nor article start can be inherited from the issue/editor.

**Gate:** do not use the page-3 opening as a complete or securely attributed reading until the page images establish the title, byline, and start boundary.

### 3. Page 14 is not merely noisy; it interleaves two columns and ends both surviving streams without a reliable conclusion

The last OCR-bearing page mixes at least:

- a first-person testimony about receiving the Holy Spirit; and
- a separately headed item, “A MESSAGE SPOKEN BY ONE CALLED TO CHINA, WHILE UNDER THE POWER OF THE SPIRIT.”

The OCR switches between the two columns line by line. The first stream terminates with the incomplete clause “and against the”; the China-message stream also lacks a verified ending in this text witness. Pages 15–16 have no OCR, so the missing conclusions cannot be recovered from the repository text.

**Gate:** no translation, digest, quotation, or question bank may be generated from this mixed page until it is transcribed column-by-column from the facsimile and continued through pages 15–16.

### 4. Character volume is not evidence of fidelity

All twelve populated pages contain thousands of characters, but page 14 has 228 nonblank OCR lines and severe punctuation/symbol corruption; its apparent volume is partly the product of broken reading order. Page 3 likewise contains hundreds of corruption markers and begins without its source boundary. A word-count or “nonempty page” check would incorrectly pass both.

## Fail-closed source controls

For every candidate article from this issue, require:

1. `facsimile_pages` with exact PDF/printed page numbers.
2. `column_order_verified: true`.
3. `article_start_verified: true` and `article_end_verified: true`.
4. An article-level title and byline; do not inherit authorship from editor or issue.
5. A diplomatic transcription tied to the checksummed PDF, with uncertain readings marked.
6. Confirmation that the candidate does not depend on the OCR-empty pages 1–2 or 15–16 unless those pages have been manually transcribed.
7. Translation and private-bank generation only after the verified source unit is stable.

## Build-safe conclusion

The December 1909 OCR is **not a complete textual surrogate for the 16-page PDF**. It is a discovery aid for pages 3–14, and even there page 14 has demonstrable cross-column contamination. Claude should either image-collate a complete interior article whose start and end both fall within verified pages, or transcribe the missing boundary pages from the checksummed facsimile. Do not use the opening page-3 continuation or either page-14 stream as a self-contained reading.

Wayne's pre-1931 selection instruction is recorded in the receipt manifest; this report makes no legal-rights, translation, publication, academic-suitability, or assessment approval.
