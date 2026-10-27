# A-C2 source-only QA: May→August 1912 reprint page shift and mixed-article boundaries
**Checked:** 26 October 2026, Mexico City time. **Scope:** archival OCR files on `handoff/book-sources`; no facsimile collation or legal clearance. **Owner:** ChatGPT source verification; Claude retains elective course, translation and bank construction.

## Exact witnesses
- `books/A-C2/pentecostal-testimony-1912-05-source.txt` — Git blob `44723009d9a74ca5735c76d72b1a9dcacd75fc8a`, 109,503 characters, 16 populated form-feed pages.
- `books/A-C2/pentecostal-testimony-1912-08-source.txt` — Git blob `c081b9ed1e947125b8934e39831e4402f6b9a29b`, 103,006 characters, 16 populated form-feed pages.
- Original PDF SHA-256 and byte counts are recorded in `ISSUES-RECEIVED-2026-10-26.md`; PDFs were not independently opened during this pass. The page numbers below are **OCR form-feed / apparent printed page numbers**, not verified facsimile pagination.

## New, specific extraction traps
1. **May p.1 is mixed-content:** it begins with an `EDITORIAL NOTE` and only later introduces the distinct heading `THE FINISHED WORK OF CAL V ARY - IT / MAKES PLAIN THE GREAT WORK / OF REDEMPTION`. The article continues on pp.2–4. **May p.4 also begins a different article**, `THE GREAT CRISIS / THE FIXISHED WORK IS H--\\STE:S-I\",G IT.` A p.1–4 full-page export would include both extraneous editorial and the beginning of a different work.
2. **August p.4 is also mixed-content, but for a different reason:** it opens with the continuation of `PERSONAL TESTIMONY OF PASTOR DURHAM` from August p.3; the **reprinted Finished Work heading** starts only near the **bottom of August p.4**. The reprint continues through August pp.5–7; August p.7 also contains the start of the separate `THE GREAT CRISIS` piece. Thus a naive May p.1→August p.4 or May pp.1–4→August pp.4–7 page-based match misattributes material.
3. **August personal testimony is editorially mediated:** its heading on p.3 includes the parenthetical `(Rewritten and published to Glorify Jesus.)`. This is not evidence that every word is Durham's unedited autograph; a lesson or question must distinguish first-person testimony from a later rewritten publication. The issue is explicitly a posthumous memorial (August p.1 states Durham died 7 July 1912). Do not assign the issue's unsigned memorial/editorial content to Durham without article-level evidence.
4. **May polemic embeds another author's claim:** May p.3 discusses Bishop Horner's book `The Root`. It is Durham's argumentative characterization of a different writer, not an independent CTS-approved statement of Methodist/Wesleyan doctrine. Questions should test the historical author's argument rather than require students to endorse his characterization; confirm the book and quotation against the original before quoting or translating it.

## Independent quantitative cross-issue map
Method: lowercase ASCII letters/numbers, normalize all other characters to spaces, form unique 12-token shingles independently for each populated OCR page, then count **identical** shingles between each May page and all August pages. This is a conservative fingerprint: different OCR errors and page-layout changes reduce matches, and a match is **not** a facsimile-level collation.

| May OCR page | August OCR page | Identical 12-token shingles | Share of May page's unique shingles |
|---|---|---:|---:|
| 2 | 5 | 858 | 64.7% |
| 3 | 6 | 875 | 65.7% |
| 4 | 7 | 503 | 38.7% |
| 5 | 8 | 771 | 57.3% |
| 8 | 9 | 627 | 48.1% |
| 9 | 10 | 522 | 39.1% |
| 10 | 11 | 545 | 41.3% |
| 13 | 14 | 295 | 24.1% |

May p.1 and August p.4 show no 12-token overlap exceeding the 25-shingle reporting threshold despite visibly corresponding headings and opening argument: OCR/layout and mixed-article boundaries defeat simple page-to-page detection. This **does not mean** those pages contain independent texts. Some other May/Aug page pairs overlap as documented in the earlier eight-issue audit; this table shows the strongest actionable shifts, not exhaustive article identities.

## Release-facing source instructions for Claude (no course edits here)
- Give `Finished Work of Calvary—It Makes Plain the Great Work of Redemption` one canonical article ID with **May 1912 original witness pp.1–4** and **August 1912 posthumous reprint witness pp.4–7**. Both issue citations may be retained, but they are **one** evidence source, not two independent five-reading selections.
- Segment **within** May pp.1 and 4 and August pp.4 and 7. Exclude May editorial, August personal testimony, and both beginnings of `Great Crisis` from this article's reading span. The August testimony itself requires a separate editorial-status flag.
- Have a human compare the actual page images by columns, headings, and article endings; correct OCR before EN/ES/FR translation, digests, or 40-question private-bank generation. Do not infer author identity merely from a whole-issue label. Record any actual wording changes between original and reprint.
- For comparative doctrine, label polemical claims as **Durham's 1912 position** and check cited Wesleyan/Holiness opponents in their own sources; do not create falsely neutral questions from an adversarial periodical.
- Mexico reuse and translation rights remain **NOT CLEARED** by this OCR audit or by US pre-1931 public-domain status. Wayne's academic source-selection instruction is acknowledged; qualified legal/rights approval is a separate gate. No primary text, bank answers, student data or release files are included in this report.

**Status:** source-only page-shift and mixed-article gate verified in repository OCR; facsimile fidelity, rights, publication and question-bank gates pending.


## Addendum: “Some Other Phases of Sanctification” is a May-original/August-reprint pair

**Independent source-only verification, 26 Oct 2026.** A-C2's initial source plan (NEW tracker row 228) assigns *Some Other Phases of Sanctification* to **August 1912**. The title is already present in the **May 1912** OCR on page 7 (split across two lines); it reappears in the August 1912 posthumous issue on page 9. In both witnesses, the article ends on a **mixed page** before the separate heading *Speaking in Tongues Is the Evidence of the Baptism in the Holy Spirit* (May page 9; August page 11). Neither full-page range is a clean single article.

Reproducible test on the exact source blobs listed above: locate each article's title using case-insensitive `SOME\\s+OTHER\\s+PHASES\\s+OF\\s+SANCTIFICATION`, stop before the first later `SPEAKING\\s+IN\\s+TONGUES\\s+IS\\s+THE\\s+EVIDENCE`, normalize nonalphanumeric characters to spaces and lowercase, and compare unique 12-token shingles. The **May article span** contains 13,771 OCR characters / 2,564 tokens / 2,553 unique 12-token shingles; the **August span** contains 13,762 characters / 2,588 tokens / 2,577 shingles. **1,562 identical 12-token shingles** overlap (61.2% of May, 60.6% of August). This strongly corroborates a reprint, without proving exact word-for-word identity or author attribution. The remaining differences can reflect OCR, column-order or editorial revisions and require facsimile collation.

**Required canonical record:** `PT-1912-05-p7-some-other-phases-sanctification`; original May witness OCR pp.7–9, posthumous August witness OCR pp.9–11; `reprint_of` links August to May. Keep the May/Aug witnesses in **one** reading/question evidence pool, never two. Segment both mixed ending pages before the separate *Speaking in Tongues* article, and distinguish the start of May p.7/Aug p.9 from the preceding *Great Crisis* material. Correct the first-attested issue in the source citation if Claude selects this work. As with all OCR findings, **no Mexico rights/translation clearance, original-facsimile certification, beta change, or private answer-key approval is asserted**.

**Strategic acceptance test for all 20 electives:** every assigned reading should carry a canonical article ID, first-attested issue/date, any reprint witness, exact title and column boundaries; the five required readings should have **five distinct canonical IDs**. This catches accidental double-counting and bibliographic misdating before EN/ES/FR text or 40-question banks are built.
