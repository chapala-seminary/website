# A-C2 eight-issue source-integrity audit — 26 October 2026

**Source-only QA for the active A-C2 build.** No readings, digests, translations, assessment items, answer keys, beta files, or release decisions are changed here. The repository text files are unedited OCR derivatives; the checksummed PDFs remain the visual authority.

## Verified inventory

All eight paths named in `ISSUES-RECEIVED-2026-10-26.md` were fetched successfully from `handoff/book-sources`. Each file has the expected number of form-feed page segments: eight for March 1909 and 14–16 for the other issues. File-level Git blob identities and coarse OCR diagnostics were checked.

| Issue | Git blob | Characters | OCR-bearing page segments | Source warning |
|---|---:|---:|---:|---|
| 1909-03 | `0beab6c1505…` | 57,149 | 8/8 | **Fragment:** the first visible printed folio is p. 5; the eight scan pages cover printed pp. 5–12 in imposed/non-numeric scan order, not a complete issue beginning at p. 1. |
| 1909-12 | `7fa8885e532…` | 92,987 | 12/16 | Four PDF segments have no usable OCR text; the remaining layer is markedly noisier than the other issues. Collate every selected passage to page images. |
| 1910-07 | `e50856f5900…` | 107,159 | 16/16 | OCR generally usable for discovery, not authoritative transcription. |
| 1911-02 | `569bc845744…` | 100,278 | 14/14 | Contains an article later repeated in January 1912; canonicalize before banking. |
| 1911-08 | `aedcbda18a2…` | 102,530 | 16/16 | Richest unique candidate issue; controversial Azusa narrative must be labeled as Durham's account rather than neutral history. |
| 1912-01 | `c8db2b16851…` | 97,482 | 16/16 | First page has only 74 OCR characters; also repeats “The Church” from February 1911. |
| 1912-05 | `44723009d9a…` | 109,503 | 16/16 | Canonical source for several articles reprinted posthumously in August 1912. |
| 1912-08 | `c081b9ed1e94…` | 103,006 | 16/16 | Memorial/reprint issue; not independent evidence for much of its doctrinal content. |

## Duplicate and reprint gates

### May 1912 → August 1912

Normalized twelve-token shingling found **6,597 shared shingles**, equal to **34.25% of the smaller issue's unique twelve-token shingles**. The August memorial issue visibly repeats the following May headings and substantial article text:

- “The Finished Work of Calvary—It Makes Plain the Great Work of Redemption”
- “The Great Crisis: The Finished Work Is Hastening It”
- “Some Other Phases of Sanctification”
- “Speaking in Tongues Is the Evidence of the Baptism in the Holy Spirit”
- “How the Lord Poured Out His Spirit and Worked Among His People”

Treat May 1912 as the canonical textual witness for these articles unless image collation shows a material August revision. The August issue may be used for its memorial frame, unique notices, or unique articles, but must not be counted as an independent doctrinal reading or second evidentiary source for reprinted text.

### February 1911 → January 1912

The article headed **“THE CHURCH”** appears in both files. Normalized comparison found **987 shared twelve-token shingles** (**5.35%** of the smaller issue's shingle set), including long verbatim sequences. Assign one canonical article ID and one assessment evidence pool. A bank must not ask parallel questions as though these were independent works.

## Boundary and OCR controls

1. Do not label March 1909 a complete issue. Cite the supplied artifact as a fragment covering printed pp. 5–12; its “Personal Testimony of Pastor Durham” and “A Word to Ministers” are present, but exact start/end boundaries still require scan collation.
2. Locate an article by heading plus its next independent heading. Keyword hits are unsafe because later issues mention earlier titles and several issues reprint entire articles.
3. Preserve page and column coordinates in the source manifest. A form-feed boundary is a PDF page boundary, not automatically an article boundary.
4. Transcribe selected text from the page image or collate OCR line by line. Preserve uncertain readings explicitly; do not silently normalize names, biblical references, dates, or doctrinal terms.
5. Give each article a stable canonical ID such as `PT-1912-05-p1-finished-work`; attach reprint witnesses to that ID instead of creating duplicate sources.
6. Before bank generation, compute reading-to-reading overlap and fail the build if a reprint or repeated article is counted twice.
7. Keep Durham's criticism of Seymour framed as Durham's side of a historical dispute, as already directed in tracker row 229.

## Build-safe conclusion

The eight repository files are useful for source discovery, but they are **not eight independent complete textual witnesses**. Claude's A-C2 build should proceed only with canonical article IDs, exact visual boundaries, and the duplicate gates above. This audit does not judge academic suitability or authorize publication.
