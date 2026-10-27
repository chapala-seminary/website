# A-C2 source-only QA: July 1910 serial dependence, bylines, and claims
Date: 2026-10-26 (Mexico City). Nonproduction research for Claude's active A-C2 build. This is NOT a source-rights opinion, facsimile collation, student text, translation, or assessment bank.

## Exact witnesses read
- `books/A-C2/pentecostal-testimony-1910-07-source.txt`, Git blob `e50856f5900d9732c7eccd932f57692820019b91`: 107,159 characters, 16 populated form-feed-separated OCR page segments plus trailing empty segment. Issue header reads Chicago, July 1, 1910, Vol. 1, No. 5.
- `books/A-C2/pentecostal-testimony-1909-12-source.txt`, Git blob `7fa8885e532cfccd13593b5ec75d93931e133aa7`: 92,987 characters, 16 page positions; pages 1–2 and 15–16 have no OCR text. Source OCR is visibly noisy. Page positions are PDF/OCR positions, not independently verified facsimile pagination.

## Reproducible observations
1. July 1910 p1 starts `THE GREAT CRISIS NUMBER TWO.` after an `EDITORIAL` and states that No. 4 previously printed an article headed `The Great Crisis, What Is the Plan of God?` The sequel continues across OCR p2–4, with p5 starting a separately headed `A TESTIMONY Ff-.OM INDIA.` **This is explicitly a serial sequel**, not an independent treatment. The preceding December 1909 OCR is missing its first two page positions and surviving p3 begins mid-sentence; the first essay's opening/title cannot be verified from the supplied text. December OCR does contain the phrase `This, then, is. the great crisis` on p4, supporting topical linkage but NOT a complete, collated first installment.
2. July OCR p5 has an India correspondence headed `A TESTIMONY Ff-.OM INDIA`, dated Bombay, January 23, 1910, addressed to Durham and signed `CHRJ:STIAN SHOONMAKER.` Its first-person assertions belong to this correspondent, **not automatically to Durham**. `OUR CANADIAN TOUR` begins separately later on p5. Keep distinct article and author IDs.
3. July OCR p12 opens `A PROPHETIC MESSAGE` explicitly attributed to Mrs. R. J. Semple in Belfast, then changes to `DOCTOR DIXON ANSWERED.` These are distinct voices/genres; page-based ingestion could wrongly treat Semple's prophecy as Durham's article.
4. July OCR p6–7 includes `THE MIRACULOUS, INSTANTANEOUS HEALING OF MABEL SIPES, FROM CONSUMPTION`, making historical medical/healing claims. These are periodical testimonies, not independently verified diagnoses, cures, or medical advice. Historical study must not suggest substituting prayer for appropriate medical care.
5. The tenth OCR page begins `19 PENTECOSTAL TESTIMONY` although surrounding positions show p9 and p11; this is a **probable OCR page-number misrecognition**, not a verified printed p19. Use PDF page position and image check rather than the noisy numeral.
6. July p10–11 `OUR FOREIGN MISSIONARIES` lists several missionaries and support claims; it is a composite institutional notice, not automatically five separately verified mission accounts. Do not treat named people as authors of the notice.

## Required gates before A-C2 EN/ES/FR texts or 40Q banks
- Record a canonical serial ID for the December 1909 `Great Crisis` and July 1910 `Great Crisis Number Two` pair. If July sequel is chosen, label it as Durham's side of a historical controversy **only after byline/image verification**; do not count both installments as independent voices. The missing December first pages make a complete two-part narrative unverified.
- Collate original page images, column order, start/end headings and signatures for July pp1–5 and pp11–12; verify the probable p10 numeral. Version-pin any corrected derivative while preserving raw OCR.
- Give separately attributed material (Schoonmaker, Semple, and other letters/testimonies) article-level author/genre metadata. Historical healing and end-times assertions need neutral context, not institutional endorsement.
- Apply the separately recorded US/Mexico/provider/contributor/translation rights and academic-release gates. Wayne's pre-1931 selection rule is not itself verified Mexico reuse/translation clearance. No key, student data, beta/main change, or release authorization is included here.

## Strategic observation
**Serial-dependence QA** should complement the existing OCR, page/column, source-witness, and textbook/reading-overlap gates: a passage may be textually nonduplicative yet depend on a prior installment that is absent or incomplete. Flag `No. 4`, `continued`, `number two`, and references to earlier articles for manual source verification before translation and examination generation.
