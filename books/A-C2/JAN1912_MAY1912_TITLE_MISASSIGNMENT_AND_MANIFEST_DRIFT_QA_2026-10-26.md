# A-C2 source-only correction: January/May 1912 article title, first-page loss, and manifest drift
26 October 2026 — independent ChatGPT QA for Claude's active A-C2 build. **No course text, reading, translation, bank, answer key, beta, or production file is changed.**

## Exact repository witnesses inspected
- `books/A-C2/pentecostal-testimony-1912-01-source.txt`, Git blob `c8db2b16851d7f17ba7f5c965a42d3e00c939452`, 97,482 characters. The source receipt records 16 PDF pages, SHA-256 `3f9aa8f6b45e201dc6effd97be14e50ff31e60709791e7f1c15bfa959e0aefab`. The text has 16 form-feed-delimited page bodies and a terminal empty segment.
- `books/A-C2/pentecostal-testimony-1912-05-source.txt`, Git blob `44723009d9a74ca5735c76d72b1a9dcacd75fc8a`, 109,503 characters. Receipt: 16 PDF pages, SHA-256 `30ea0065b1b9966798bb6c138e23c943b3addecfd446191a4b569fc786f9087a`.
- `books/A-C2/ISSUES-RECEIVED-2026-10-26.md` (blob `f84feadd6b0a64463c35cd67af5379c99e60b4f9`) and `books/A-C2/SOURCE.md` (blob `f65451a6a84af5341a511d487b9776da917e39ad`) as present on `handoff/book-sources` during this review.

## Material correction: article assigned to wrong issue in work instructions
NEW tracker row 228 names **“The Finished Work of Calvary” (Jan 1912)** as a Durham anchor. In the inspected **May 1912 OCR**, PDF page segment 1, a distinct all-capitals article heading reads:
> THE FINISHED WORK OF CAL V ARY - IT / MAKES PLAIN THE GREAT WORK / OF REDEMPTION

It begins after an `EDITORIAL NOTE` on that page and continues across the page break into PDF segment 2. In the inspected **January 1912 OCR**, the phrase `The Finished Work of Calvary` occurs as a reference in a retrospective first-person account (PDF segment 6, roughly character offset 28,200), **not as an identified heading**. January PDF segment 1 yields only 74 OCR characters of near-unreadable masthead debris, and segment 2 begins mid-argument, `standara is hohsess ...`. Thus January's first article heading, beginning, byline, and page-1 wording **cannot be verified from the repository OCR**.

**Do not generate a January 1912 article titled “The Finished Work of Calvary” merely by keyword search or by importing the May title.** If Claude intends the named article, use **May 1912 as the provisional canonical issue** and collate its printed-page/column start, ending, and attribution against the checksummed May PDF. If a distinct January article is intended, inspect the January facsimile first and give its verified heading/author/pages. The August 1912 memorial reprint of May material is the same article family, not independent reading evidence (prior eight-issue audit).

## Additional source hygiene
1. **January first-page failure is an article-boundary failure, not merely a cosmetic OCR defect.** PDF segment 2 begins mid-sentence/argument; segment 1 cannot supply the missing title or opening. A question based on the missing opening cannot be validated by this text. Flag `page1_ocr_missing` and `article_start_unverified` for any January selection that touches the opening.
2. **January “THE CHURCH” is not a new independent article.** Its heading appears in January PDF segment 13, and the prior cross-issue audit verified a substantial February 1911 duplicate (987 shared normalized 12-token shingles). Use a single canonical evidence ID and compare variants visually.
3. **Active-source manifest drift:** `books/A-C2/SOURCE.md` still opens with an old 1915 Seymour-original-not-found status and a Seymour five-focus plan. It does not describe the eight newly supplied Durham issues or Claude's active Durham build. This is a documentation inconsistency, not evidence that Claude's work is wrong. Do not let an importer, reviewer, or future AI treat this old manifest as the current textbook decision. Claude should update it on his own branch with issue-level provenance and article-level canonical IDs once selections are final.
4. **Rights-status drift:** the issue receipt asserts all pre-1931 content is “usable” under Wayne's academic selection rule. That records his decision but is **not independently verified Mexico publication, reproduction, or EN/ES/FR translation clearance**, especially for separately authored material, hymns, and modern edited transcriptions. Preserve the distinction between Wayne's selection instruction and any later qualified legal/rights review. No legal conclusion is made here.

## Fail-closed handoff for Claude and Robert
- Claude owns the active A-C2 readings/textbook/40Q banks (NEW tracker row 230). **This is sources-only**, not a competing digest or question set.
- For each selected article, log `issue_date | PDF_sha256 | printed_pages | PDF_pages | columns | exact_heading | byline | canonical_article_id | first/last sentence | scan_collated | reprint_of | source_rights_status | translation_rights_status`. Require explicit `unknown` where unverified; never fill by inference.
- Robert: add report-only check that rejects a source-manifest heading/date pair absent from the designated issue's verified article ledger, plus checks for `page1_ocr_missing`, cross-issue reprint IDs, and conflicting current-vs-legacy SOURCE.md. Do not change student credit or release gating without authorized review.
- Next verification: visually compare May 1912 PDF segment 1/2 heading and January segment 1/2 before assigning any assessment evidence. No source reproduction or copyright decision is authorized by this note.

**Production separation:** this report is confined to the nonproduction `handoff/book-sources` branch.