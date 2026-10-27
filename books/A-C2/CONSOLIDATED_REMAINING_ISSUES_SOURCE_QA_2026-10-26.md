# A-C2 consolidated remaining-issues source QA — 26 October 2026

**Scope:** source-fidelity controls for the active A-C2 build. Claude retains course, translation, digest, and private-bank construction. This report does not alter student material, assessment keys, beta, main, or production. Wayne's tracker-row 226 source-use decision is treated as the governing instruction; no additional rights gate is introduced here.

## Exact repository witnesses

| Issue | Source file | Git blob | Character count | Populated OCR pages |
|---|---|---|---:|---:|
| March 1909 fragment | `pentecostal-testimony-1909-03-source.txt` | `0beab6c1505b49a9c190d09c82b18eb5f2639b8b` | 57,149 | 8 |
| February 1911 | `pentecostal-testimony-1911-02-source.txt` | `569bc845744f65a6de7e7d3ef585777ad8328bf6` | 100,278 | 14 |
| January 1912 | `pentecostal-testimony-1912-01-source.txt` | `c8db2b16851d7f17ba7f5c965a42d3e00c939452` | 97,482 | 16 |

The checksummed PDFs remain the visual authority. Findings below are reproducible in the committed OCR and define where facsimile/column collation is required.

## 1. March 1909: three article boundaries inside an eight-page fragment

The supplied artifact begins at printed page 5, not at the issue's first page.

- **Personal Testimony of Pastor Durham** begins partway through the first supplied page, after the continuation of a different article. It then runs across the following supplied pages and ends before the distinct heading **Testimony of a Baptist Pastor** on printed page 8. Whole-page extraction of printed page 5 would therefore mix two works.
- **Testimony of a Baptist Pastor** begins on printed page 8. The OCR places the signature **E. N. BELL.** immediately before the next distinct heading. That signature is evidence for Bell's authorship of this testimony; it must not be attributed to Durham merely because Durham edited the periodical.
- **A Word to Ministers** begins later on printed page 10, after Bell's signature. Its OCR heading is damaged/interleaved (`A Word to Ministers, from a`), and it continues toward the end of the supplied fragment at printed page 12. The exact heading, byline, column order, and end boundary require the page images before the piece is translated or banked.

Required article records:

1. `PT-1909-03-p5-durham-personal-testimony` — start within printed p.5; end before the Baptist-pastor heading on printed p.8.
2. `PT-1909-03-p8-bell-baptist-pastor` — start at the printed p.8 heading; Bell signature before the next article.
3. `PT-1909-03-p10-word-to-ministers` — heading/byline and terminal boundary unresolved pending facsimile.

Do not represent this artifact as a complete March issue, and do not use a full supplied page as an article surrogate without column-level start/end coordinates.

## 2. February 1911 → January 1912: “The Church” is a page-shifted reprint with mixed boundary pages

The original February witness begins **The Church** partway through OCR page 4, after the preceding finished-work discussion. January begins the repeated article partway through OCR page 13, after unrelated preceding material. January page 14 later starts **The Coming Convention in Chicago**. Both the first and last January pages are mixed-content pages.

Independent normalized twelve-token page comparison produced:

| February page | January page | Identical 12-token shingles | Share of February page |
|---:|---:|---:|---:|
| 5 | 14 | 682 | 49.2% |
| 5 | 13 | 240 | 17.3% |
| 4 | 13 | 59 | 4.4% |

This localizes the repeated text primarily to February pp.4–5 and January pp.13–14. It also proves that page-level copying would import neighboring articles. Treat the two appearances as one canonical evidence source:

- canonical ID: `PT-1911-02-p4-church`;
- reprint witness: `PT-1912-01-p13-church-reprint`;
- one reading/evidence pool, not two;
- segment within Feb p.4 and Jan pp.13–14 by column;
- stop the January witness before **The Coming Convention in Chicago**.

The overlap does not prove every word is identical. Facsimile collation should record omissions, additions, or editorial changes rather than silently replacing one witness with the other.

## 3. January 1912: unreadable opening, serial dependence, and unusable tail

- OCR page 1 contains only **74 characters** and no usable title/byline.
- OCR page 2 begins mid-argument. Because the opening page is unreadable, that continuation has no verified title, author, or start boundary and must not be selected as a standalone reading.
- Page 4 begins **What Is the Evidence of the Baptism in the Holy Ghost? No. 3**. The explicit `No. 3` makes it a serial installment. It may be used only with the installment number preserved and with enough context to avoid presenting it as the complete treatment.
- OCR page 16 is severely corrupted. No quotation, translation, digest claim, or assessment evidence should rely on it until the facsimile is transcribed.
- The earlier assignment of **The Finished Work of Calvary—It Makes Plain the Great Work of Redemption** to January is unsupported; that heading is attested in May 1912. January references “finished work” as a doctrine but does not thereby establish that May article title.

## Build-facing controls

Before Claude generates final EN/ES/FR text or either private 40-question bank from these witnesses:

1. store article-level `start_page`, `start_column`, `end_page`, and `end_column`;
2. store author evidence separately from issue editor/publisher;
3. attach reprint witnesses to one canonical article ID;
4. preserve serial installment numbers;
5. reject any candidate whose opening or ending depends on unreadable OCR without manual facsimile transcription;
6. run overlap checks on article text, not whole-issue filenames; and
7. prohibit full-page extraction when a page contains two distinct works.

## Consolidated status

This closes the remaining repository-OCR localization pass for the March 1909 fragment and the February 1911/January 1912 relationship. It does **not** certify facsimile fidelity or academic suitability. The specific unresolved image tasks are: March printed pp.5, 8, 10–12; February pp.4–5; and January pp.1–2, 4, 13–16.
