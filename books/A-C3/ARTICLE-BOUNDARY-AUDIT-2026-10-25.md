# A-C3 — Exact article-boundary and contributor correction (25 October 2026)

**Editorial status: independently checked against the five staged modern reproduction-text files; NOT checked against original facsimile pages; NOT five approved readings, legal clearance, or publication permission.**

## Why this correction matters

The 25 October candidate index deliberately used generous heading windows for discovery, but three windows include text from **different articles or speakers**. Rechecking the actual staged files found two previously unrecognized explicit Seymour signatures and an anonymous visitor report that must not be attributed to Seymour. The five *actual article* windows are substantially shorter than the initial candidate windows. Reusing the initial 6,272-token total as a five-reading workload would be materially misleading.

## Corrected article-only boundaries (zero-based UTF-16, [start,end), within individual files)

| Theme | File and heading | Previous candidate end | Article-only end | Article-only OCR tokens | Boundary / contributor evidence | Rights status |
|---|---|---:|---:|---:|---|---|
| R1 — Spirit baptism | Issue 06, `THE BAPTISM WITH THE HOLY GHOST.` | 134938 | **134938** | **876** | Final initials `-WJ.S.`; next heading `TENNESSEE EVANGELIST WITNESSES.` | Seymour attribution *probable*, original scan pending |
| R2 — gifts and order | Issue 05, `GIFTS OF THE SPIRIT.` | 57358 | **55506** | **760** | Ends `Amen. -W.J.S.`; next independent heading `"BEARING HIS REPROACH."` begins at 55506. The previous 1,096-token window included another article. | Seymour attribution *probable*, original scan pending |
| R3 — discernment | Issue 04, `COUNTERFEITS.` | 54501 | **53093** | **557** | Ends `-W.J. Seymour.`; next independent heading `"SIGNS SHALL FOLLOW."` begins at 53093. The previous 805-token window included a second article. | Seymour signature explicit in reproduction, original scan pending |
| R4 — stewardship | Issue 03, `IN MONEY MATTERS.` | 58247 | **58247** | **588** | Ends `– W.J. Seymour.`; next heading `THE LORD LED HER.` | Seymour signature explicit in reproduction, original scan pending |
| R5 — congregational reporting | Issue 07, `MISSIONS IN LOS ANGELES` | 35684 | **23593** | **626** | Anonymous visitor's shorthand account ends before `The Pentecostal Assembly.` at 23593. The previous 2,907-token window contained other services, first-person testimonies, hymn text, and an extended Seymour speech. | **Anonymous contributor HOLD**; mixed subsequent material separately attributable and not included |

**Corrected article-only total: 3,407 OCR whitespace tokens** (876 + 760 + 557 + 588 + 626), not the discovery-index total of 6,272. The numbers are rough OCR token counts, **not** a course reading allocation.

**Verified source blobs, unchanged:** Issue 03 `15dd291ec4d0c4a96b92ab359bdc219809b6cd18`; 04 `d35b5f3b5fafefc01bbb6c13f0028a196689fbaa`; 05 `45afcd1677542f2b153d7e0d82721b29a7771cbd`; 06 `c84322507ed3af05180900554452dea2d7951138`; 07 `7bb1b6e393515971c961de91c418c688eb5861b0`. The start offsets remain as in the earlier candidate index. End offsets here are the **next article-heading start** in the exact staged UTF-16 text, not printed page coordinates.

## Rights and source integrity: fail closed

- **R1–R4:** Source-reproduction signatures support a working Seymour attribution. His reported death in 1922 is not permission to publish without verifying each signature on the original historical page and checking whether the modern readable reproduction adds protectable transcription, editorial changes, or layout. Mexican rights approval remains Wayne's decision.
- **R5:** The reporter is identified as a visitor, not named. The original source may include editorial framing or other voices. Do **not** treat this report as Seymour-authored or use a life-of-Seymour calculation to clear it.
- **All five:** Original issue scans are linked at the official Apostolic Faith archive (https://www.apostolicfaith.org/library/azusa-papers), but were not downloaded/collated in this audit. The connected tool could retrieve the archive's listing, not the original PDF bytes. Modern source files include repeated website/page labels and OCR artifacts; article-only text is still not certified.
- **Academic distinction:** All five are short newspaper pieces, not five substantive independent readings. A-C1 already uses the same periodical. Do not quietly promote these excerpts to five completed readings, or test the same passage twice. Wayne must approve either a wider source base or an explicitly episode-based reading model.

## Recommended next authorized production steps

1. Acquire original facsimile PDFs for issues 03–07 through the official archive, compare page/column signatures and exact endings, and log corrected original page numbers and scan checksums.
2. Build a **contributor register** with separate entries for the four Seymour-attributed pieces, the anonymous visitor, and each separately authored item in any proposed expansion. Hold uncertain text; do not translate/publish it.
3. Propose five substantial and academically distinct reading sets (potentially more than one verified article per set, or other historical works), with a dated nonoverlap ledger and A-C1 overlap check. Do not infer that one periodical supplies five independent books.
4. After source and rights gates, prepare corrected EN full texts, ES/FR translations, then a source-linked 40-question textbook bank and 40-question reading-set bank **only** in private `assessment-keys`.
5. Keep this file and all other candidate-only records on the nonproduction handoff branch. Wayne retains academic, copyright and release approval.

**Operational blocker:** The authenticated `chapalatheological-ai` account still receives a GitHub 404 for `chapala-seminary/assessment-keys`; do not claim private bank handoff. No keys or student data are present here.
