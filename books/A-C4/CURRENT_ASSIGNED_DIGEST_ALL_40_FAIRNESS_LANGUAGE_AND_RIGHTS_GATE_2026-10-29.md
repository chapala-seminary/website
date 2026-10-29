# A-C4 current assigned-digest all-40 fairness, language and preliminary rights gate

**Course:** A-C4 — Baptist Worship, Ordinances, and Preaching  
**Scope:** public reading-test manifest and current assigned reading room only  
**Audit date:** 2026-10-29  
**Auditor:** ChatGPT, using the `chapalatheological-ai` GitHub identity for this handoff

## Executive finding

- The public manifest on `main` and `beta` is identical at blob `3605f71555a16db6dedba877ce6fcf04259ccdd9`.
- The current assigned reading room on `main` and `beta` is identical at blob `20d0f8e742229b1289dd1c94ae061498304c2b66`.
- All **40/40 public English prompts** have a direct witness in the prompt's own currently assigned digest section. This is a source-location/fairness finding, not validation of the private accepted answer.
- The public manifest contains **40/40 prompt stems in EN, ES, FR and SW**. The checked static reading-room source contains five full digest bodies in English and five in Spanish, but **zero full French or Swahili digest bodies**. Two small French UI spans do not establish a French reading edition.
- The “five readings” are five CTS digests of different sections of **one** 1870 Broadus volume. They are substantive sections, but not five independent books, articles or scholarly voices.
- The private bank identified by the manifest (`assessment-keys/readings-src/elecbapfourreadings.bank.json`) was not accessed. Accepted variants, explanations, aliases, multilingual equivalence and durable completion remain unverified.
- The 1870 Broadus text is a strong preliminary public-domain candidate: Broadus is cataloged as 1827–1895; Mexico's current LFDA Article 29 gives life plus 100 years and then public domain. This does **not** clear the Internet Archive scan/OCR, later Dargan/Weatherspoon revisions, CTS digest prose, CTS translations, or any third-party editorial matter.
- The room itself says the working transcription has **not yet been collated against page images**. The live CTS textbook page also states that pages 342–343 are missing from the cited scan. Do not treat the source package as finally collated.

## Reproducible evidence

| Artifact | Branches checked | Blob |
|---|---:|---|
| `src/content/readings/elecbapfourreadings.json` | main + beta | `3605f71555a16db6dedba877ce6fcf04259ccdd9` |
| `src/body/rooms/CTSElecBap4Readings.html` | main + beta | `20d0f8e742229b1289dd1c94ae061498304c2b66` |

Manifest settings: draw 20, pass 18, four questions per reading, required-from timestamp `2026-10-28T06:00:00Z`, keys private.

## Forty-prompt non-answer source register

The table deliberately does **not** disclose or infer the accepted fill-in answer. “Direct” means the public digest contains the fact or quotation context required by the public stem.

| Q | Assigned | Digest location | Public-source finding |
|---:|:---:|---|---|
| 1 | R1 | 1. A Preacher-Scholar of the Founding Generation | Direct |
| 2 | R1 | 1. A Preacher-Scholar of the Founding Generation | Direct |
| 3 | R1 | 1. A Preacher-Scholar of the Founding Generation | Direct |
| 4 | R1 | 2. Why Take a Text at All? | Direct |
| 5 | R1 | 3. Rules for Choosing a Text | Direct |
| 6 | R1 | 5. Three Sources of Error | Direct |
| 7 | R1 | 5. Three Sources of Error | Direct |
| 8 | R1 | 7. How to Study a Text | Direct |
| 9 | R2 | 2. Why Preaching Must Explain | Direct |
| 10 | R2 | 2. Why Preaching Must Explain | Direct |
| 11 | R2 | 3. Explaining Texts: Exposition, Narration, Description | Direct |
| 12 | R2 | 4. Explaining Subjects: Definition, Example, Comparison | Direct |
| 13 | R2 | 4. Explaining Subjects: Definition, Example, Comparison | Direct |
| 14 | R2 | 6. Where Illustrations Come From | Direct |
| 15 | R2 | 6. Where Illustrations Come From | Direct |
| 16 | R2 | 7. Cautions in Using Illustration | Direct |
| 17 | R3 | 1. The Preacher as Architect | Direct |
| 18 | R3 | 1. The Preacher as Architect | Direct |
| 19 | R3 | 2. The Introduction: A Porch, Not a Second House | Direct |
| 20 | R3 | 3. The Discussion: Plan, Proposition and Divisions | Direct |
| 21 | R3 | 4. The Conclusion: A River, Not a Marsh | Direct |
| 22 | R3 | 4. The Conclusion: A River, Not a Marsh | Direct |
| 23 | R3 | 6. The Case for Expository Preaching | Direct |
| 24 | R3 | 6. The Case for Expository Preaching | Direct |
| 25 | R4 | 1. Style That Shows the Thought | Direct |
| 26 | R4 | 3. Words the People Know | Direct |
| 27 | R4 | 3. Words the People Know | Direct |
| 28 | R4 | 3. Words the People Know | Direct |
| 29 | R4 | 4. Sentences, Paragraphs and the Right Amount of Words | Direct |
| 30 | R4 | 5. Energy Begins in the Preacher | Direct |
| 31 | R4 | 5. Energy Begins in the Preacher | Direct |
| 32 | R4 | 7. False Energy | Direct |
| 33 | R5 | 1. Three Ways to Deliver a Sermon | Direct |
| 34 | R5 | 1. Three Ways to Deliver a Sermon | Direct |
| 35 | R5 | 2. Reading and Reciting Weighed | Direct |
| 36 | R5 | 3. Free Speaking from Full Preparation | Direct |
| 37 | R5 | 4. Worship Is Not a Porch | Direct |
| 38 | R5 | 5. Scripture, Hymns and Prayer | Direct |
| 39 | R5 | 6. From Public Worship to the Ordinances | Direct |
| 40 | R5 | 6. From Public Worship to the Ordinances | Direct |

**Count:** 40 direct assigned-digest witnesses; 0 unsupported in the checked English room.

## Reading/source design

| Reading | Assigned digest | Broadus source window |
|---:|---|---|
| 1 | Choosing and Interpreting the Text | Part I, chapters 1–2 |
| 2 | Explanation and Illustration | Part I, chapters 5 and 7 |
| 3 | Arrangement and Sermon Form | Part II, chapters 1–3 |
| 4 | Perspicuity and Energy of Style | Part III, chapters 2–3 |
| 5 | Delivery, Public Worship and the Ordinances | Part IV, chapter 1, and Part V |

This supports the current English fairness gate. It does not satisfy an interpretation of “five readings” that requires five independent works, authors or perspectives. Faculty should explicitly approve either:

1. an integrated single-volume Broadus design, preserving the five section digests; or
2. five genuinely independent, rights-cleared works with a new version-pinned question map.

## Language gate

| Layer | EN | ES | FR | SW |
|---|---:|---:|---:|---:|
| Public prompt objects | 40 | 40 | 40 | 40 |
| Full static digest bodies in checked room source | 5 | 5 | 0 | 0 |
| Native semantic QA | open | open | open | open |
| Private accepted-answer parity | unverified | unverified | unverified | unverified |

The room copy advertises English, Spanish and French, but the checked source does not contain five full French digest blocks. Runtime overlays or external translation controls may exist; they require a rendered-route test and cannot be inferred from this static file.

## Preliminary rights gate — not legal approval

1. Open Library's 1870 edition record identifies John Albert Broadus, the 1870 publication, and Internet Archive item `treatiseonprepar00broa`.
2. A Library of Congress catalog record identifies Broadus as 1827–1895.
3. The current Mexican LFDA (last reform 14 May 2026), Article 29, protects patrimonial rights for the author's life plus 100 years and places the work in the public domain after the term. Broadus's 1895 death therefore makes the original 1870 authorial text a strong preliminary public-domain candidate in Mexico.
4. LFDA Articles 78–79 separately protect original material in derivative works and translations. CTS digest prose and translations therefore need provenance/ownership records even when the underlying Broadus text is public domain.
5. Do not silently mix the 1870 first edition with the 1898 Dargan or 1944 Weatherspoon revisions.
6. Preserve page-image citations and complete the missing-page/page-image collation before a source manifest is marked final.

References:
- Current Mexican LFDA: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFDA.pdf
- 1870 edition record: https://openlibrary.org/books/OL23350053M/A_treatise_on_the_preparation_and_delivery_of_sermons.
- CTS public textbook page (for the stated source package and missing-page warning): https://chapalaseminary.org/CTSTextbookElecBapFour.html

## Required next gates

- **Faculty:** approve the integrated Broadus design or replace it with five independent works; preserve already-earned credit.
- **Source owner:** collate each tested assertion and quotation against the 1870 page images, including a resolution for missing pages 342–343; produce a version-pinned manifest with page-level citations.
- **Language reviewers:** verify rendered EN/ES/FR/SW reading availability and semantic equivalence. Do not mark French/Swahili delivered from prompt coverage alone.
- **Private-key custodian:** verify all 40 accepted answers, aliases and explanations against the pinned source; run synthetic draw/pass/fail/retry/durable-completion tests in all supported languages without exposing keys.
- **Rights owner/counsel:** retain the 1870 edition identity and Broadus death evidence; separately document CTS authorship/permission for digests and translations.
- **Release owner:** no production/source/policy changes until faculty/Wayne approval; keep PR #164 sending off.

## Boundaries

No private answer key, student record, grade, production database, email, policy or deployment was changed. This report is an evidence-preserving, non-answer-bearing handoff.
