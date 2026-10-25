# C-C5 — Wesleyan Ministry and Missions: provisional five-reading extraction ledger (25 October 2026)

**STATUS: FIVE EXACT OCR EXCERPTS STAGED AND RE-FETCHED; NOT CORRECTED, SCAN-COLLATED, RIGHTS-CLEARED, TRANSLATED, EXAMINED OR APPROVED FOR STUDENTS.**

These are **five separate chronological excerpts from Wesley's journal**, not five independent works, and not a complete 1746–1760 history. The source corpus is 218,856 OCR whitespace tokens; the five proposed excerpts together are **17,744 OCR whitespace tokens** (not a corrected word count). Each source file and reading was independently re-fetched from `handoff/book-sources`, and each staged excerpt was verified byte-for-character against its exact source slice. Character offsets are zero-based JavaScript UTF-16 `[start,end)`; GitHub file SHAs are blobs, not approval signatures.

| Reading | Historical focus / starting marker | Exact source file | Source offsets | OCR tokens | Source blob SHA | Verified reading blob SHA |
|---|---|---|---|---:|---|---|
| [R1](./reading-1-ocr-provisional.md) | Itinerant preaching and societies; `Tues. 10.—My brother returned` (1747, month to collate) | `journal-1746-1749-ocr.txt` | `[8544,27018)` | 3,434 | `9171ecc95ade037f059f57dc4180732df50c8f00` | `af3ed2b64808cfe910f52408082f8a0becb1ca06` |
| [R2](./reading-2-ocr-provisional.md) | Pastoral visits; `Fri. September 1` through before `Sun. 22`, 1749 | `journal-1749-1751-ocr.txt` | `[10440,33835)` | 4,273 | `71d31aa4e101e4f7e9965af86674fa5a7c8cd483` | `797768ca1d83bfe335a3b77bb34ba6a8ae84d0bc` |
| [R3](./reading-3-ocr-provisional.md) | Field preaching and opposition; `Sun. 5.—About one I preached at Birstal` (1752, month to collate) | `journal-1751-1754-ocr.txt` | `[18371,37913)` | 3,578 | `3b3ae2ee899fbc708d0ab7bac90ad9f2faa690ca` | `1d495519e19619501372156374103d58fd46f482` |
| [R4](./reading-4-ocr-provisional.md) | Society oversight and travel; `Thur. 10.—I rode to Hayfield`, 1755 | `journal-1755-1758-ocr.txt` | `[8016,26443)` | 3,382 | `0c078ddbdc921dd6828d3388b0ab71786bdae477` | `bfb39eaad411f098894713fe22fc7cacf42e7fb1` |
| [R5](./reading-5-ocr-provisional.md) | Irish conference and itinerancy; `Saturday, June 17`, 1758 | `journal-1758-1760-ocr.txt` | `[143,16815)` | 3,077 | `502af41ce7b1b8311c65c29c371a2de4041b254d` | `45abd60e1c1ec7790c982db8d5698eff247378b8` |

## Audit findings and editorial decisions needed

1. **Exact boundary correction performed:** R2's first extraction cut an entry at “in the afternoon,” before its continuation “Friday. 20”. It was replaced with an extraction ending before `Sun. 22`; the revised file was independently verified. This demonstrates why a date-header-only extractor must also check grammatical continuity.
2. **Chronology is deliberately selective.** Five excerpts are taken from five different source volumes, with substantial omitted years and months between them. Never imply continuous narrative or test students on omitted events. A one-page dated timeline should accompany the eventual course.
3. **OCR edition/date conflict:** The title line of `journal-1749-1751-ocr.txt` says “TO OCTOBER 30, 1761,” while the immediately following journal heading says **1751**. This is likely OCR damage or a source-title discrepancy; inspect the printed title page before any catalog date is certified. The 1746–1749 cover likewise contains `1?49`. Original imprint year for Vol. II remains unverified.
4. **Five readings are not five authors.** All are excerpts of one historical journal and would substantially overlap any textbook assembled from the same journal. Wayne must approve whether same-work readings satisfy the five-reading academic requirement and whether the textbook bank and reading bank test distinct assigned material.
5. **Historical context:** Wesley reports hostile crowds, pastoral discipline, miraculous/providential interpretations, physical illness, other churches, and immigrant communities from his own perspective. These are primary-source claims, not independent verification, contemporary medical advice or current CTS polity.
6. **Mexico rights screen is preliminary.** Wesley (d. 1791) and Jackson (d. 1874) predate Mexico's life-plus-100 threshold, but embedded letters, hymns, other contributors, scan-specific material, modern editions and translations require separate provenance and rights checks. This is not legal clearance.

## Release checklist (all OPEN)

- Verify each WHDL PDF's printed title page, publisher, editor, date, and the actual start/end **printed page numbers** for each excerpt; collate against original page images.
- Proofread OCR, preserve defensible quotations, identify all embedded contributors and mark any passages needing replacement or permission.
- Agree acceptable student workload and independent-versus-same-book reading policy; produce corrected EN source text and only then complete ES/FR translations and original five-reading digests.
- Map each prospective question to an approved, assigned passage; build separate 40-question textbook and reading-set banks **only in the private assessment-keys repository**, which remains inaccessible to the AI account.
- Obtain Wayne's academic and rights authorization before any beta integration or student release. **No production merge or deployment.**

**Handoff:** Claude may use the verified boundaries as a starting point for original-page collation, not as publication-ready text. Source provenance: [C-C5 SOURCE.md](./SOURCE.md).
