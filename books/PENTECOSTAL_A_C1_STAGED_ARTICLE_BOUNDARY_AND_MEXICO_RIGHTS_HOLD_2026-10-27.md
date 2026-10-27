# P0 — A-C1 staged Pentecostal textbook: two named testimonies survive the rights filter

**Verified 27 October 2026, source-only/nonproduction audit.** This is an editorial and contributor-provenance finding, **not** a legal opinion, authorization to publish, or assertion that any particular passage remains protected.

## Exact staged artifact

Repository `chapala-seminary/website`, branch `claude/pentecostal-required` (release candidate `da97604b9e7e3f1755c693e9d1da0525e1757c2b`), file `src/content/textbooks/elecpcone.json`, blob `f9803beb3d23ef5e435c2a513e5dd940aa980137`.

- `edition` reads **"Public-domain original / CTS interim elective edition 2026"**.
- `credits.en` states that original scan comparison is **pending**; EN/ES/FR contain full translated reader bodies.
- Every English chapter repeats: **"Signed contributions by authors whose rights are not cleared in Mexico have been left out."**
- That categorical exclusion is **not accurate** for at least two separately identified first-person testimonies in the English staged body.

## Confirmed article-boundary failures (not speculative keyword matches)

| Staged English position (0-based within `body.en`) | Original 1906 issue heading and proof | Editorial implication |
|---|---|---|
| Around character **75,103** (chapter 4), begins `When Rev. Evans and his wife and Sister Florence Crawford...` and continues as an extended first-person testimony. | *The Apostolic Faith*, Vol. I No. 2 (Oct. 1906), separately headed **"BRO. ROSA'S TESTIMONY."**, following **"A PORTUGUESE MINISTER RECEIVES HIS PENTECOST."**; the latter explicitly identifies Rev. **Adolph Rosa**. The source places this testimony between the Rosa introduction and **"GET INTO THE CORNFIELD."** Source lines 65–78: https://azusabooks.org/af/LA02.shtml . | The staged renderer strips the article heading, merges the attributed testimony into an editorial flow, and wrongly asserts that uncleared named contributors were excluded. Rosa's death date and Mexico rights/permission were **not established** in this audit. |
| Around character **108,983** (chapter 5), begins `When my place of worship was taken away from me...` and continues in first person. | Same original issue, separately headed **"BRO. PENDELTON'S TESTIMONY."** (original spelling), after **"SPREADS THE FIRE."** and before **"SPANISH RECEIVE THE PENTECOST."** Source lines 442–456: https://azusabooks.org/af/LA02.shtml . The surrounding text names Bro. Wm. Pendleton, but spelling/identity should be checked against original scan. | Another separately attributed testimony remains in full while the chapter claims signed/individual uncleared work was excluded. Pendleton's death date and rights/permission are **not verified**. |

Both named figures also appear in the staged ES/FR bodies and those bodies reproduce translated material around the corresponding sections (e.g. ES `Cuando el reverendo Evans`, and ES `lugar de culto` / FR `lieu de culte`). This is a **three-language removal/rights decision**, not an English-only edit.

**Secondary contributor flags (not yet independently resolved):** chapter 3 reports a letter from A. G. Garr and reproduces an unattributed interpreted four-line song; chapter 5 contains a long first-person reflection after an Armenian visitor quotation. These require original article-boundary and speaker checks, not an automatic assertion that they are Garr's or Seymour's words. Earlier `books/A-C1/SOURCE.md` already holds the unfiltered reader and notes Garr/Crawford and embedded-quotation risks.

## Mexican legal/provenance screen

The official Mexican LFDA PDF **now states latest reform 14 May 2026** (not 15 January as in some older handoffs): https://www.diputados.gob.mx/LeyesBiblio/pdf/LFDA.pdf . Article 15 says publication in a newspaper does not itself remove protection; Article 29(I) provides an ordinary author term of life plus 100 years, subject to historical term, treaty, and other legal analysis. This audit did **not** locate reliable death evidence or permissions for Rosa or Pendleton and does **not** determine their present copyright status. Modern transcription and CTS translations require their own provenance/reuse review.

## Required safe handoff for Claude / release owner

1. **Keep A-C1 on rights hold**. Do not promote the staged full testimony passages or repeat the categorical "all uncleared contributions excluded" claim without verified contributor records and Wayne's academic/legal approval.
2. Reconcile the exact **original heading → author/speaker → article boundary → source issue/page/column → death/rights/permission → EN/ES/FR action** for Rosa and Pendleton; inspect original 1906 page facsimile, not just the azusabooks HTML transcription.
3. Until cleared, replace their first-person reproduced passages in all three languages with **original CTS contextual commentary plus source links** (or hold them); preserve truthful attribution and distinguish contemporary testimony from established history.
4. Run a **structural provenance gate** for all periodical-derived textbooks: each retained excerpt must have a source-heading/byline/speaker identifier; fail closed on a transition into a first-person article without an approved contributor record. This catches named articles whose headings disappear during HTML flattening, which a simple signature/name scan misses.
5. After any edits, regenerate trilingual student pages, reading-room text and public prompt manifests; privately verify that every exam question remains answerable from the *approved* student text. Keep answer keys in the private repository, never in this public handoff.
6. Replace/qualify `edition: "Public-domain original"` and overconfident exclusion claims until the final source register actually supports them. Obtain owner legal/academic decision before beta; require exact-head beta CI afterward.

**Release state verified during this pass:** `beta` at `c6110458213ee676833149a8f30c8b121572ec89`; `claude/pentecostal-required` two commits ahead/zero behind, not on beta. Private `assessment-keys` remains 404 for chapalatheological-ai. PR #164 remains open draft and non-sending. No beta/main, student records, grades, assessment keys, production or emails changed by this report.
