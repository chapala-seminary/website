# Pentecostal A-C3 staged textbook — contributor-rights reconciliation

**Date:** 27 October 2026 (Mexico City)  
**Scope:** Exact staged branch `claude/pentecostal-required`, file `src/content/textbooks/elecpcthree.json`, compared with the existing nonproduction A-C3 source/rights records. This is an evidence audit, not a legal conclusion or publication approval. No release, course, answer key, student record, or production branch was changed.

## Verified staged-publication facts

The staged textbook is a trilingual reproduction/translation package sourced from *The Apostolic Faith*, Vol. I, Nos. 3–7 (November 1906–April 1907):

- English body: **177,977 characters / approximately 32,542 whitespace words**.
- Five chapter headings; Spanish and French full bodies are also present.
- Edition label: **“Public-domain original / CTS interim elective edition 2026.”**
- Credits say the text comes from readable reproduction PDFs and that original-facsimile collation is still pending.
- Activation is set to `2026-10-29T06:00:00Z`.

The staged English body contains explicit signed material from at least these separately named contributors:

| Contributor signature/name found in staged body | Existing A-C3 handoff status |
|---|---|
| W. J. Seymour / W.J.S. | Individual passages still require exact original-page/signature and edition verification. |
| G. B. Cashwell | Death date corroborated, but exact byline/page and edition screen required. |
| W. H. Durham | Death date corroborated; only Durham-authored items, not whole periodicals, were considered potentially reusable. |
| A. S. Worrell | Death date corroborated; identity/byline and edition must be verified. |
| Albert Norton | Death date supported; original authorship and exact page still required. |
| Anonymous visitor report under “MISSIONS IN LOS ANGELES” | Existing article-boundary audit places this on **HOLD** and expressly forbids treating it as Seymour-authored. |

This directly conflicts with the staged editorial note that signed or first-person contributions whose Mexican rights were not cleared “have been left out.” At least Cashwell, Durham, Worrell, and Norton signatures remain in the staged public text.

## Existing source-handoff gates contradicted by staging

The current A-C3 `SOURCE.md` states:

1. contributor rights and original-scan collation are **not approved**;
2. the readable reproduction is not a certified diplomatic transcript;
3. only passages with proven author/rights should be selected, otherwise CTS should link the source and write original commentary;
4. the five candidate pieces are not five approved readings or a cleared textbook.

The article-boundary audit narrows five provisional pieces to **3,407 OCR tokens**. Four are Seymour-signed/probable but still pending original-facsimile verification; the fifth is an anonymous visitor report on hold. The staged English body is roughly **32,542 words**, far beyond that provisional, unapproved set and includes additional named contributors.

## Release significance

The issue is not merely a broad “old periodical” label. The staged release:

- presents a large mixed-contributor reproduction as a public-domain original;
- contains named contributions the source handoff explicitly says still need contributor-by-contributor screening;
- relies on modern readable reproduction text whose exact relationship to original facsimiles is not yet collated;
- translates the material into Spanish and French before those source/rights gates are documented as passed.

Publication year alone does not resolve contributor authorship, edition/transcription rights, or Mexican reuse status. Wayne must make the legal/academic decision after a contributor register and exact source-page evidence; this audit does not decide copyright status.

## Safe remediation before beta

1. **Do not promote A-C3 as currently staged** until the contributor register, original-page signatures, facsimile collation, and Mexican rights review are complete.
2. Reconcile every retained extract against issue/page/column, signature, author identity, death evidence, modern-reproduction provenance, and intended reuse/translation basis.
3. Remove or hold the anonymous visitor report and every contributor entry lacking a completed record.
4. If timely clearance is impractical, replace long reproductions with original CTS historical analysis and source links; then rebuild assessment prompts so no answer depends on removed text.
5. Change student-facing “public-domain original” wording unless and until the full mixed-contributor/edition claim is documented.
6. After any source change, regenerate EN/ES/FR materials, reconcile private banks without exposing answers, advance beta, and require exact-head CI. No prior approval or CI result should carry over to a changed release head.

**Operational state at this audit:** `beta` remained `c6110458213ee676833149a8f30c8b121572ec89`; `claude/pentecostal-required` was two commits ahead and zero behind. Private assessment-key PR #7 remained owner-only. PR #164 sending must remain off.
