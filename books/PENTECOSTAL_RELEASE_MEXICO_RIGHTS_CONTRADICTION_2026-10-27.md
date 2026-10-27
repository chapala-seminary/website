# P0 — Pentecostal release: Mexico contributor-rights conflict in staged A-C5 (27 Oct 2026)

**Status: verified source-code/content conflict; legal outcome and publication permission NOT determined. NONPRODUCTION handoff only.** This report does not approve or deploy a course, revise a key, or make a legal decision.

## Exact staged evidence

Read from `chapala-seminary/website`, branch `claude/pentecostal-required`, commit `da97604b9e7e3f1755c693e9d1da0525e1757c2b`:

- `src/content/textbooks/elecpcfive.json` (CTSElecPC5), chapter 1, says it **restored** A. A. Boddy's separately authored tract **“Pentecost in England” / “Speaking in Tongues. Is this of God?”** and a letter by the Iverson sisters. The chapter's own CTS note dates **A. A. Boddy (1854–1930)** and introduces the tract as Boddy's. The text reproduces substantive passages, not merely a title, citation or short scholarly quotation.
- That same chapter claims **“Under the CTS rule of 26 October 2026, everything published before 1931 may be used.”** This is a *curricular rule asserted in the book*, **not** a verified Mexican copyright rule. The book's `edition` field says **“Public-domain original / CTS interim elective edition 2026.”** Its `credits.en` simultaneously admits that original-facsimile collation is pending and the copy was taken from modern reproduction PDFs. These claims should not coexist without author-by-author legal and provenance review.
- `src/content/textbooks/elecpcone.json`, `elecpctwo.json`, and `elecpcthree.json` also carry the broad `edition` label **“Public-domain original / CTS interim elective edition 2026”** while their credits admit uncollated modern transcriptions/OCR. This is not proof that each excerpt is infringing; it is proof that the categorical label is stronger than the recorded verification.
- Existing handoff `books/A-C5/SOURCE.md` explicitly warns that the original paper contains contributors besides Seymour with unverified death/permissions, and says to **avoid reproducing their words** until cleared. That file describes the *handoff branch*, where no student textbook had been staged; the newer *release branch* now contains a textbook. The discrepancy is a process gate, not evidence of a malicious change.

## Rights check — facts versus legal questions

1. **Official Mexican statute**: the Cámara de Diputados LFDA consolidated PDF (last reform 15 Jan 2026), Article 29(I), states an ordinary author's economic-rights term of life plus **100 years**; joint authorship is measured from the last surviving author. Source: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFDA.pdf . Official legal repository also reproduces Art. 29: https://www.ordenjuridico.gob.mx/Documentos/Federal/html/wo17068.html .
2. **Boddy death**: historical biographical account records his death in **1930**: https://revival-library.org/heroes/alexander-boddy/ . The staged course independently states **1854–1930**. On a *simple* life+100 screen, a 1930 death points to **2030**, not to a blanket pre-1931 publication cutoff.
3. **Not a legal determination**: retroactivity, prior public-domain entry, treaties, first-publication jurisdiction, rights ownership, exceptions, and use of a modern reproduction require qualified Mexican-law review. No assertion here that Boddy's specific 1907 tract is definitively protected in Mexico in 2026; the verified conclusion is that **publication year alone does not establish clearance**. The Iverson sisters' death dates and contribution rights have not been verified.
4. **Separate layers**: a historical original's status does not automatically license modern editorial additions, facsimile arrangements, photographs, transcriptions or third-party translations. CTS's new ES/FR translations are derivative uses that should be covered by the underlying-source rights decision.

## Required nonproduction actions for Claude / release owner

1. **Pause promotion of A-C5's long original-source extracts** pending Wayne's source-by-source rights decision. This is a requested editorial release gate, not a GitHub branch change. Do not quietly publish the Boddy tract or Iverson letters under the pre-1931 rule.
2. Prepare a paragraph-level contributor register for the A-C5 textbook and its five reading digests: issue/page, exact article, credited author, author death evidence or explicit permission, original facsimile/modern reproduction terms, US and Mexico screening, EN/ES/FR reproduction/translation decision. Prioritize Boddy and Iverson first, then other separately signed contributions.
3. For unverified contributors, **replace long reproductions** with original CTS commentary, brief attributed discussion, and links to original archive material; or seek permission. Rebuild and re-audit reading tests to ensure questions remain answerable from the *approved* student materials; keep answer maps private.
4. Remove/qualify the **“everything published before 1931 may be used”** assertion and blanket `edition` labels until evidence supports them. The US pre-1931 rule is not a substitute for a Mexican analysis. Do not misrepresent the 2026 CTS policy as national law.
5. Check A-C1, A-C2 and A-C3 contributors and reproduction provenance similarly before their publication. Run post-build and student-view checks; leave beta and production untouched until separate approval, exact-head CI, and private-key verification.
6. Ask Wayne for the **legal/academic approval decision** after a concrete per-contributor table, not for a blanket ruling on all 1906–1912 periodicals. No keys or student information belong in this public handoff.

**Other verified release state at audit time:** beta `c6110458213ee676833149a8f30c8b121572ec89` unchanged; staged `claude/pentecostal-required` `da97604b9e7e3f1755c693e9d1da0525e1757c2b` not yet on beta; no exact-head beta CI for the staged candidate. `PR #164` is draft, non-sending. No merges, deployments, mail or grades performed by this review.
