# C-C5 — Wesleyan Ministry and Missions: historical source handoff

**STATUS: FIVE PRIMARY-SOURCE OCR TRANSCRIPTS AND FIVE PROVISIONAL SOURCE-BOUNDED EXCERPTS VERIFIED; FACSIMILE COLLATION, EDITORIAL/RIGHTS APPROVAL, TRANSLATIONS, PRIVATE BANKS AND STUDENT RELEASE PENDING.**

## Text and edition provenance

- **Primary author:** John Wesley (1703–1791).
- **Historical collected edition:** *The Works of the Rev. John Wesley, A.M.*, Vol. II, edited by Thomas Jackson (1783–1874), Methodist Publishing House, London. The source catalog identifies this as the journal covering 2 December 1745 to 5 May 1760. **Exact imprint year of the linked scan must be confirmed against its title page; do not silently infer 1872 from Vol. I.**
- **Catalog:** https://www.whdl.org/en/browse/resources/9880
- **Rights screen:** Both Wesley and Jackson died more than 100 years ago. The catalog labels this item public domain following due diligence. Any later transcriber/editor additions, photographs, modern annotations or separate translations require their own rights review. This is a preliminary source screen, not final legal approval.
- **Method:** Each file below is OCR text extracted directly from the WHDL PDF linked on the catalog, then re-fetched from the nonproduction GitHub handoff branch and verified exactly equal to the extracted text. OCR is **not** corrected or scan-collated.
- **No student exam answers or student information in this source package.**

## Source inventory

| File | OCR characters | OCR whitespace words | GitHub blob SHA-1 | Original scan |
|---|---:|---:|---|---|
| `journal-1746-1749-ocr.txt` | 262,992 | 49,332 | `9171ecc95ade037f059f57dc4180732df50c8f00` | [WHDL PDF](https://www.whdl.org/sites/default/files/resource/book/2.7.1%2520Journal%2520Extract%2520%2528Nov.%25201746%2520-%2520Jul.%25201749%2529_0.pdf?language=en) |
| `journal-1749-1751-ocr.txt` | 227,111 | 41,678 | `71d31aa4e101e4f7e9965af86674fa5a7c8cd483` | [WHDL PDF](https://www.whdl.org/sites/default/files/resource/book/2.8.1%2520Journal%2520Extract%2520%2528Jul.%25201749%2520-%2520Oct.%25201751%2529_0.pdf?language=en) |
| `journal-1751-1754-ocr.txt` | 173,873 | 32,314 | `3b3ae2ee899fbc708d0ab7bac90ad9f2faa690ca` | [WHDL PDF](https://www.whdl.org/sites/default/files/resource/book/2.9.1%2520Journal%2520Extract%2520%2528Nov.%25201751%2520-%2520Oct%25201754%2529_0.pdf?language=en) |
| `journal-1755-1758-ocr.txt` | 304,273 | 56,296 | `0c078ddbdc921dd6828d3388b0ab71786bdae477` | [WHDL PDF](https://www.whdl.org/sites/default/files/resource/book/2.10.1%2520Journal%2520Extract%2520%2528Feb.%25201755%2520-%2520Jun.%25201758%2529_0.pdf?language=en) |
| `journal-1758-1760-ocr.txt` | 211,422 | 39,236 | `502af41ce7b1b8311c65c29c371a2de4041b254d` | [WHDL PDF](https://www.whdl.org/sites/default/files/resource/book/2.11.1%2520Journal%2520Extract%2520%2528Jun.%25201758%2520-%2520May%25201760%2529.pdf?language=en) |

**OCR total:** 218,856 whitespace-delimited tokens across five source scans; this is not a finished textbook or verified prose count. Vol. II has a preceding 1743–1746 scan, deliberately not copied here to avoid overlap with C-C1 (1735–1745). The 1746–1749 scan may include a small 1746 boundary overlap; date boundaries require verification.

## Five exact provisional reading windows (staged 25 October 2026; NOT approved)

Five exact OCR excerpts have been staged on the nonproduction handoff branch and independently checked against the source blobs. Their total is **17,744 OCR whitespace tokens**, not a finished word count or a student reading assignment. See the [five-reading provenance and boundary ledger](./PROVISIONAL-READING-LEDGER-2026-10-25.md), which records each source blob, start/end character offset, reading blob, OCR word count, historical warnings, and release gates. These are five excerpts of Wesley's **one journal**, not five independent source works.

- [R1 — 1747 itinerancy and societies](./reading-1-ocr-provisional.md)
- [R2 — September–October 1749 pastoral visits](./reading-2-ocr-provisional.md)
- [R3 — 1752 field preaching and opposition](./reading-3-ocr-provisional.md)
- [R4 — 1755 society oversight and travel](./reading-4-ocr-provisional.md)
- [R5 — 1758 Irish conference and itinerancy](./reading-5-ocr-provisional.md)

**Date discrepancy:** the 1749–1751 OCR source title reads “1761,” but its internal heading reads “1751”; the scan's printed title must settle this before release. Excerpts omit substantial intervening history, and the textbook/reading overlap and same-work five-reading policy require Wayne's academic decision. **Do not publish raw OCR or generate exams from unassigned passages.**

## Mandatory QA before any course release

1. Verify exact edition/imprint and editor in the scanned title/front matter; confirm each PDF actually belongs to Vol. II.
2. Collate the OCR against page images, especially date headers, place names, biblical references, running heads, footnotes and hyphenated words. Preserve original spellings only where faithful to the scan.
3. Produce a source-bounded approximately 30,000-word English textbook selection and five dated non-overlapping readings, with counts, page spans, and checksum ledger. Do not claim the full 200,000-word source corpus is the coursebook.
4. Prepare English/Spanish/French student materials and five-reading study digests. Translate from the corrected source, not raw OCR.
5. Put 40-question textbook and reading banks **only** in the private assessment-keys repository; no keys on this public handoff branch.
6. Obtain academic and rights approval before publication. No automatic production merge.

## Strategic curriculum caution

Wesley's journal illustrates the development of Methodist itinerancy and pastoral organization in Britain and Ireland; it is not a comprehensive account of later global Wesleyan or Nazarene missions. Supplementary readings should represent broader historical and global perspectives, and historical references to other faiths and peoples should be critically contextualized.
