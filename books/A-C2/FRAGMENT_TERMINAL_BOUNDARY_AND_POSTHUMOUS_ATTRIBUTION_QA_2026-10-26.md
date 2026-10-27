# A-C2 — Source-only terminal-boundary and posthumous-authorship audit
Date: 2026-10-26 (Mexico City) | Status: nonproduction research; Claude owns course construction

## Scope and evidence
Read the eight OCR source files and their receipt manifest on `handoff/book-sources`, including first/last page delimiters. This audit **does not** inspect original PDF facsimiles or authorize reproduction, translations, reading choices, assessment keys, or release. Prior A-C2 reports cover cross-issue reprints and August 1911 column interleaving; this report isolates three additional failure modes.

### Finding 1 — February 1911 issue stops mid-article (HIGH; exact source verified)
- Artifact: `pentecostal-testimony-1911-02-source.txt`, blob `569bc845744f65a6de7e7d3ef585777ad8328bf6`.
- Receipt manifest reports **14 PDF pages**; OCR has 14 nonempty form-feed page segments, with last segment headed printed **14 / PENTECOSTAL TESTIMONY**.
- On printed p.14 a distinct article **“BETWEEN TWO FIRES.”** begins. Its last surviving OCR clause is: `The Moody people, and those who hold the suppression theory, condemned this as a fal'-e doctrine,` followed by the page break and end of file.
- This is **not a complete article** in the supplied artifact; likely the issue scan is incomplete or continuation is absent. The OCR alone cannot distinguish missing PDF pages from a missing continuation in another issue. Do **not** treat this article as a self-contained reading or generate questions on its missing conclusion.
- Next: check the original issue facsimile/table of contents and archive holdings for printed pp.15–16 or a documented continuation. Preserve the 14-page file as an incomplete witness; do not silently splice with a different issue.

### Finding 2 — March 1909 fragment has BOTH opening and closing cuts (HIGH; exact source verified)
- Artifact: `pentecostal-testimony-1909-03-source.txt` (8 page segments).
- First surviving printed page is **5** and begins mid-discussion; last is printed **12** and ends mid-sentence: `Here are seven witnesses that exactly "agree," saying in every instance that we are "baptized in the Spirit,"`.
- Existing audit already warns this is pp.5–12 only. Additional terminal cut means neither first nor last boundary can be assumed to coincide with article boundaries. The receipt manifest's 8 pages must not be represented as a complete March 1909 issue.
- Next: use only page-collated **complete interior articles** or obtain missing pp.1–4 and any continuation beyond p.12; require article-level start/end checks.

### Finding 3 — August 1912 is posthumous; issue-level Durham authorship is FALSE (HIGH; source directly states dates)
- Artifact: `pentecostal-testimony-1912-08-source.txt`, blob `c081b9ed1e947125b8934e39831e4402f6b9a29b`.
- Cover says **William H. Durham “Fell Asleep in Jesus, July 7th, 1912.”**; p.2 opens **“IN MEMORIAM”** and records his death. Printed p.16 contains **“SPECIAL NOTICE”** that `F. J. Ewart` and `Harry Van Loon` are pastors in charge after Durham's death.
- Therefore August 1912 **memorial/editorial/new reports cannot all be attributed to Durham**. Durham's genuine earlier articles may be reprinted in this issue (see prior May/August overlap audit); cite original appearance and label **posthumous reprint**, distinct from Ewart/Van Loon and other contributors. A byline or documented reprint is needed before tagging an individual article as authored by Durham.
- Next: assign author + original-publication date + reprint status at **article level**, not issue level. Exclude memorial/administrative passages from a Durham-authored textbook unless explicitly presented as third-party historical testimony.

## Fail-closed ingestion rules for Claude/Robert
1. `source_completeness`: complete issue / partial scan / incomplete article / uncertain. The 1909-03 witness = partial; 1911-02 p14 “Between Two Fires” = incomplete.
2. `article_start_verified` and `article_end_verified` must be true before an excerpt is called a complete article; verify column order against page images.
3. `article_author` is not inherited from `periodical_editor`; `posthumous_reprint` must be distinguished from new editorial material. August 1912 requires article-by-article provenance.
4. No claims that U.S. pre-1931 public-domain status resolves Mexican publication/translation rights; apply Wayne's selection instruction separately from legal/permission review.
5. Do not build or regenerate the private 40-question banks from an OCR fragment until source boundary, article identity, translation fidelity and rights status are reviewed.

## Source index
- `books/A-C2/ISSUES-RECEIVED-2026-10-26.md`
- `books/A-C2/pentecostal-testimony-1909-03-source.txt`
- `books/A-C2/pentecostal-testimony-1911-02-source.txt`
- `books/A-C2/pentecostal-testimony-1912-08-source.txt`
- `books/A-C2/EIGHT_ISSUE_SOURCE_INTEGRITY_AUDIT_2026-10-26.md`

No lesson content, private keys, student records, policy commitments or production files modified.
