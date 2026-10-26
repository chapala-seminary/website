# D-C4 source-text corruption ledger — witness comparison, HOLD before EN/ES/FR translation

**Date:** 2026-10-26. **Scope:** staged `textbook.md` and `reading-1.md`–`reading-5.md` on `handoff/book-sources`; this is research-only and does not change the staged source, lessons, assessments, credits or production. **Disposition:** human collation and academic approval required. No modern translation or answer key included.

## Why this matters

The D-C4 `SOURCE.md` accurately identifies the upstream text as an incomplete structured transcription. The staged readings contain **at least ten concrete word-level corruptions**, several of which are inherited from the cited online witness itself. This is a separate problem from the already documented textbook/reading duplication: the damaged words could propagate into three languages, the 40-question banks, and exam grading. A source URL and a valid source checksum prove provenance, **not transcription fidelity**.

Staged source blobs inspected: `textbook.md` `4cba004563ee546d805eca22c58e2482966213a3`; `reading-1.md` `412d8a201e8dad9cb0000613d88c5ef4bf36b2c6`; `reading-2.md` `3c4432255ac56a4e5c0ba608ab1cce5533ca8bd2`; `reading-4.md` `52113abb1a612c040b9a8d828f74381c5997a7ec`; `reading-5.md` `d3dff49ee0022d7ca42abad24d8c06c03804ae02`. This list is not an exhaustive collation.

## Verified candidates — staged phrase → independent textual witness

| # | Staged location and defective wording | Witness-supported reading (not yet facsimile-collated) | Evidence / confidence |
|---|---|---|---|
| 1 | R1 §4, blessing: `are ex mentioned` | `are expressly mentioned` | TrueCovenanter text, Pastors, line 176; high |
| 2 | R1 §5, elders: `join with the minis n the government` | `join with the minister in the government` | TrueCovenanter, Other Church Governours, line 192; high |
| 3 | R2 §13, Jerusalem: `any ma al difference` | `any material difference` | TrueCovenanter, Classical Assemblies, line 298; high |
| 4 | R4 §19, examination rule 2: `original l tongues` | `original tongues` | TrueCovenanter, Examination, line 379; high |
| 5 | R4 §19, examination rule 3: `ecclesiastical his .` | `ecclesiastical history.` | TrueCovenanter, Examination, line 380; high |
| 6 | R4 §19, eligibility: `calling to the holy minister` | `calling to the holy ministry` | TrueCovenanter, Directory for Ordination, line 374; high |
| 7 | R5 §19, ordinary rule 6: `concerning how faith in Christ Jesus` | `concerning his faith in Christ Jesus` | TrueCovenanter, Ordination, line 396; high |
| 8 | R5 §19, ordinary rule 9: `as to their minis n the Lord` | `as to their minister in the Lord` | TrueCovenanter, Ordination, line 402; high |
| 9 | R5 §19, ordinary rule 10: `which we; hold for substance` | `which we hold for substance` | TrueCovenanter, Ordination, line 403; high |
| 10 | R5 §19, ordinary rule 11: `ordained minis n Scotland` | `ordained minister in Scotland` | TrueCovenanter, Ordination, line 405; high |

**Witness:** https://truecovenanter.com/kirkgovt/westminster_assembly_form_of_presbyterial_government.html . The site's editor explicitly says it compares original 1645/1647 printings and has retained some modernization and supplied notes. It is **independent of the cited OpenChristianData/The Westminster Standard staging chain**, but it is still a modern edited transcript, not a substitute for checking the actual historical printed pages.

**Corrupted upstream example:** https://thewestminsterstandard.org/form-of-presbyterial-church-government/ itself displays `ex mentioned`, `minis n`, `ma al`, `original l tongues`, `ecclesiastical his .`, and `concerning how faith`. Consequently, re-fetching the same web witness or re-hashing its JSON would not catch these defects. Comparison witness: https://westminster1647.com/en/formagpi/20/the-directory-for-the-ordination-of-ministers and https://westminster1647.com/en/formagpi/21/the-rules-for-examination also support several corrections.

## Required next steps for Claude / Robert

1. **Before translations or question-bank generation**, collate each proposed correction against page images of a specific 1645/1647 historical edition, recording edition, printed page, image URL, and whether spelling/capitalization is editorially normalized. Do not blindly replace all strings: some apparent anomalies are historical usage, and the witnesses differ in punctuation and proof-text apparatus.
2. Keep an **immutable source** plus a separately versioned, annotated `corrected-reading` derivative; store a machine-readable correction ledger (old string, new string, section, page, witness, reviewer, date, checksum). Do not silently mutate the current course package or overwrite valid student completions.
3. Run report-only scans for exact defective fragments above across `textbook.md`, `reading-*.md`, EN/ES/FR drafts and any answer-bank question stems. Block release if a translated sentence or question depends on an unresolved corrupt passage. Distinguish `SOURCE_TEXT_DEFECT` from `TEXTBOOK_READING_DEPENDENCE` and `MISSING_PROOF_TEXTS`.
4. Preserve the `SOURCE.md` warning that the inline biblical proof-text apparatus is incomplete. Do not infer that a correction to a sentence repairs missing citations.
5. Require Wayne's **academic and source/rights approval** before student-facing replacements. No public or private answer keys are created by this ledger. PR #164 correspondence sending remains OFF.

**Strategic implication:** make witness-fidelity a **fourth independent release gate** beside textbook↔reading overlap, reading↔reading overlap, and manifest↔file consistency. A course can pass all structural checks and still contain upstream transcription errors.
