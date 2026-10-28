# D-C1 Calvin *Institutes* — exact chapter workload and faculty shortening gate (28 Oct 2026)

**Status: verified source-only faculty handoff; NOT a changed assignment, student textbook, cleared translation, approved assessment, or rights opinion.** No student records or answer keys are included.

## Problem and evidence

The five D-C1 source readings on `handoff/book-sources` total **130,559 whitespace words**, while the D-C1 manifest describes the textbook as still pending. R3 alone contains 48,959 words and R4 contains 40,479 words; this is an unusually large mandatory reading load for one elective. The five readings are chapter slices of a single historical Calvin/Allen edition, not five independent companion works. A separate textbook built from these passages would risk retesting the same words. This is a **curriculum design question**, not evidence that the live CTS course is defective.

The source manifest is `books/D-C1/SOURCE.md` (blob `e73b66c0f93b06f4401658742a9308e8b2301e4c`). Each reading file was fetched directly from the GitHub research branch on 28 October 2026 and chapter-bounded by its own printed heading. Counts below are reproducible whitespace token counts of the exact files; they are not student-facing word counts.

## Full chapter inventory, exact staged blobs

- **R1** blob `d3d1840ab0ec15d0342e58fc34d7a385afa07457`: I=1,070; II=1,163; III=1,130; IV=1,603; V=6,150. Chapter spans parsed from exact `Chapter [Roman].` body headings; chapter word counts use whitespace tokens, including headings and embedded footnote markers.
- **R2** blob `e6ff57e060dfabec39ac3b0273ab4c90eadaa7fc`: VI=1,793; VII=2,838; VIII=4,488; IX=1,494; X=1,264. Chapter spans parsed from exact `Chapter [Roman].` body headings; chapter word counts use whitespace tokens, including headings and embedded footnote markers.
- **R3** blob `06ce0fbe7c5305bd6eb76b96e2b3d173c6929f13`: XIII=16,261; XIV=9,479; XV=5,795; XVI=5,680; XVII=7,852; XVIII=3,892. Chapter spans parsed from exact `Chapter [Roman].` body headings; chapter word counts use whitespace tokens, including headings and embedded footnote markers.
- **R4** blob `92739ecb474f9c15f7fe17db2d930705e885b033`: I=5,188; II=13,345; III=8,780; IV=2,985; V=10,181. Chapter spans parsed from exact `Chapter [Roman].` body headings; chapter word counts use whitespace tokens, including headings and embedded footnote markers.
- **R5** blob `58867a35ff4c1f93130816c901dccc48e4cf2f48`: XI=11,836; XII=3,758; XIII=2,534. Chapter spans parsed from exact `Chapter [Roman].` body headings; chapter word counts use whitespace tokens, including headings and embedded footnote markers.

## One nonbinding whole-chapter shortening scenario

This is a **faculty option**, not an instruction to silently delete material. It retains at least one entire chapter for each of the five reading themes, and removes entire chapters rather than altering historical wording. It deliberately does **not** claim to preserve all of Calvin's argumentation, especially creation/providence and freedom of will.

| Reading | Theme | Current chapters | Current words | Illustrative retained chapters | Illustrative words | Reduction |
|---|---|---|---:|---|---:|---:|
| R1 | Knowledge of God and ourselves | I, II, III, IV, V | 11,116 | I, III, V | 8,350 | 24.9% |
| R2 | Scripture and testimony of the Spirit | VI, VII, VIII, IX, X | 11,877 | VI, VII, IX | 6,125 | 48.4% |
| R3 | Trinity, creation and providence | XIII, XIV, XV, XVI, XVII, XVIII | 48,959 | XIII | 16,261 | 66.8% |
| R4 | Fall, sin and human will | I, II, III, IV, V | 40,479 | I, IV | 8,173 | 79.8% |
| R5 | Justification by faith | XI, XII, XIII | 18,128 | XI | 11,836 | 34.7% |
| **TOTAL** | | | **130,559** | | **50,745** | **61.1%** |

**Trade-offs requiring academic judgment:** R1 omits chapters II/IV on piety and the corruption of natural knowledge. R2 omits VIII/X on rational arguments and idolatry. R3 retains the long Trinity chapter XIII but drops XIV–XVIII, so its heading must **not** continue promising coverage of creation/providence; it remains 16,261 words. R4 omits the substantial II/III/V debate about freedom and depravity, so its title/learning objectives would need narrowing. R5 retains XI on justification but omits XII–XIII on divine judgment and gratuitous justification. A 50,745-word option is still long and must be evaluated against course level and the existing lesson/exam content.

**Preferred next action:** faculty specify target reading time and five assessable objectives, then choose (A) the full 130,559-word primary-source sequence, (B) an explicitly titled *selected chapters* sequence with all omitted themes removed from assessments, or (C) genuinely independent companion sources. Do not produce a 30,000-word “complete Institutes” or silently imply the selection is exhaustive. The current C-C2/B-C4 duplication audits show why textbook/reading independence must be checked *after* the textbook is fixed.

## Source and Mexico-rights review

The source route is John Calvin's 1559 *Institutes*, English translation by John Allen (d. 1839), in the historical edition transcribed as Project Gutenberg #45001 (catalog: https://www.gutenberg.org/ebooks/45001). Original author Calvin died 1564. Article 29 of Mexico's *Ley Federal del Derecho de Autor* generally protects patrimonial rights for the author's lifetime plus 100 years; see the current 2026 WIPO Lex legislation record https://www.wipo.int/wipolex/es/legislation/details/23966 and the Cámara de Diputados current law https://www.diputados.gob.mx/LeyesBiblio/pdf_mov/Ley_Federal_del_Derecho_de_Autor.pdf . On that preliminary screen the historical Calvin and Allen text is old enough, **but this is not a blanket Mexico clearance**. Verify the exact historical edition and page images, embedded footnotes, possible later editorial additions, source transcription conditions, and rights in newly created Spanish/French translations separately. The source manifest itself warns that the 1813 title-leaf/“sixth American edition” chronology needs collation. No modern editorial or translated material is imported here.

## Proposed EN/ES/FR faculty-facing notices — NOT approved student text

**EN:** “The staged readings are extensive historical chapters from a single translation of Calvin's *Institutes*. The proposed shorter set is an abridged selection, not the complete work. Chapter omissions, study objectives and separate examination coverage must be approved before students are assigned revised readings.”

**ES:** «Las lecturas provisionales son capítulos históricos extensos de una sola traducción de la *Institución de la religión cristiana* de Calvino. La propuesta abreviada es una selección, no la obra completa. Antes de asignar lecturas revisadas, deben aprobarse los capítulos omitidos, los objetivos de estudio y la correspondencia con el examen».

**FR:** «Les lectures provisoires sont de longs chapitres historiques provenant d'une seule traduction de l’*Institution de la religion chrétienne* de Calvin. La version abrégée proposée est une sélection, non l'œuvre intégrale. Les omissions, les objectifs pédagogiques et la correspondance avec l'examen doivent être approuvés avant toute nouvelle attribution».

## Controlled handoff

1. Claude/faculty: review the chapter inventory, compare learning objectives and the current student-facing course, and record Wayne's choice; do not change assigned reading scope without academic approval.
2. Collate exact original printed chapter boundaries, bibliographic title/edition, notes and page references. Hash any approved excerpt and record source version in the nonsecret faculty ledger.
3. Produce EN/ES/FR native materials only from rights-reviewed historical text; independently check theological terms and note all omissions. If Swahili is included, apply the same version gate.
4. Compare each public prompt to the **exact** approved reading and separately check private accepted answers using authorized `assessment-keys` access; no answers in public repos or trackers. Preserve prior student credits.
5. No production deployment, policy change, grade/record modification or publication authorized by this research handoff.

**Strategic opportunity:** track *estimated reading hours per elective* alongside source completeness and duplicate-text classification. A course with 130,559 words of required reading can suppress completion even when enrollment is strong; first verify what is actually assigned on the live site and avoid treating a workload problem as a recruitment problem.
