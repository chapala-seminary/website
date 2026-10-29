# D-C2 Calvin *Institutes* — verified chapter workload, D-C1 non-overlap and faculty selection gate (28 Oct 2026)

**Research-only, not approved for student assignment or publication.** This is a quantitative audit of the five exact staged English source files on `handoff/book-sources`; it is not an audit of the currently deployed course, the accepted-answer bank, or the original printed edition.

## Reproducible source inventory

Fetched each of `books/D-C2/reading-{1..5}-source.md` with the `chapalatheological-ai` GitHub connection and split at its actual line-initial `Chapter [Roman].` (vol. I) or `CHAPTER [Roman].` (vol. II) headings. Counts below are whitespace-delimited tokens, including headings and footnote apparatus where present. Each five-file total matches the existing D-C2 `SOURCE.md` manifest.

| Reading / exact GitHub blob | Chapters and whitespace tokens | Total |
| --- | --- | ---: |
| R1 `8c27603ad206ce8243b2e09961a45a5a046ad033` | III:I 2,057; II 21,210; III 11,969 | **35,236** |
| R2 `6bd0bf2fd438784dbddf844a3e724ff4c6b7ced2` | III:IV 19,220; V 5,846; VI 2,187; VII 5,201; VIII 4,289; IX 3,013; X 2,385 | **42,141** |
| R3 `e35e68b6574a93b2331835419eb4a3c8e3ec8008` | III:XIV 8,765; XV 3,958; XVI 2,245; XVII 8,006 | **22,974** |
| R4 `c697551123ee6f68690931b0305a95c3d67a7f4a` | III:XXI 4,718; XXII 6,450; XXIII 7,211 | **18,379** |
| R5 `665b746506c9765bc3e58e04d8ec4fc8ec8e179d` | III:XXIV 10,412; XXV 9,897 | **20,309** |
| **All five** | **19 whole chapters** | **139,039** |

At a purely illustrative continuous 200 words/minute, the staged source alone represents **11.6 reading hours**, excluding note-taking, Scripture consultation, comprehension and examinations. This is **not** a claim about the current live student assignment.

**Footnote preservation hazard:** The vol. II extracts contain end-of-chapter footnote runs (R3: 176 `Footnote n:` entries; R4: 81; R5: 182). Their numbering is not local to each five-reading file; it reflects the source's longer sequence. Selecting chapters must retain each selected chapter's own notes, keep in-text references aligned and avoid blindly renumbering or concatenating notes. The vol. I R1/R2 source does not use that same `Footnote n:` marker. These are source-format observations, not a page-image collation.

## Relationship to D-C1: shared author/book, **not the same assigned chapter text**

D-C1's independently staged five readings total **130,559** tokens and cover Book I I–V, VI–X, XIII–XVIII; Book II I–V; and Book III XI–XIII. D-C2 covers Book III I–X, XIV–XVII, XXI–XXV. **No staged chapter range is shared between D-C1 and D-C2.** The two courses together stage **269,598** tokens from the Calvin/Allen *Institutes*, but the distinct course emphases and chapter scopes should not be conflated with within-course textbook/reading duplication. Neither course's eventual textbook has been fixed; check duplication *again* after faculty approves exact textbook content.

## One illustrative, nonbinding whole-chapter reduction

This is a **faculty discussion option only**. It preserves all of R1 (Spirit, faith, repentance) and R5 (calling, resurrection), but sharply narrows the three intervening readings. Never call it an unabridged *Institutes* or silently replace the five student readings with it.

| Reading | Proposed retained chapters | Original | Proposed | What is lost / must be reassessed |
| --- | --- | ---: | ---: | --- |
| R1 | III:I–III (all) | 35,236 | 35,236 | No chapter removed; R1 remains a long reading, especially faith chapter II (21,210). |
| R2 | III:VII, X | 42,141 | 7,586 | Omits IV–VI, VIII–IX: detailed penance/purgatory polemic, the opening Christian-life argument, bearing the cross and future-life meditation. Rename to **Self-denial and vocation**; revise objectives/questions. |
| R3 | III:XIV, XVI | 22,974 | 11,010 | Omits XV on merit and XVII on law/gospel promises; retain only justification and good works. |
| R4 | III:XXI, XXIII | 18,379 | 11,929 | Omits XXII's detailed scriptural argument for election; the remaining selection cannot be described as covering the full scriptural case. |
| R5 | III:XXIV–XXV (all) | 20,309 | 20,309 | No chapter removed; preserve calling, assurance and resurrection. |
| **TOTAL** | | **139,039** | **86,070** | **38.1% fewer tokens**, still about **7.2 continuous hours** at 200 wpm. |

The choice above deliberately **does not** promise the original course's full objectives. Faculty could instead keep all source chapters, choose a different selection, or assign independent historical companions. A textbook derived from any of these same passages could make a second reading examination redundant. The correct sequence is (1) establish the exact current assigned text and five objectives, (2) approve reading time/independence, (3) version the five readings and textbook, (4) map each *public* question to the approved source, (5) privately validate accepted answers, and (6) translate/review.

## Rights and source integrity — NOT CLEARED

Historical author John Calvin (d. 1564) and English translator John Allen (d. 1839) are beyond Mexico's ordinary life-plus-100-year screen under LFDA Article 29. The historical English text is sourced from Project Gutenberg volumes [45001](https://www.gutenberg.org/ebooks/45001) and [64392](https://www.gutenberg.org/ebooks/64392), which state US public-domain status; **US status alone is not Mexico clearance**. Collate exact edition/title-leaf chronology and page scans, separate original author/translator text from later editorial additions, and assess any third-party translations or newly added notes individually. Source and academic review, rather than this audit, must determine permitted redistribution.

The staged `STUDY-DIGESTS-EN-ES-FR.md` provides **three-language CTS study summaries only**, not complete Spanish or French translations of these 139,039 English source tokens. Do not mark EN/ES/FR full readings complete or copy private examination answers into the public repository.

## Faculty-facing notices (draft only)

**EN:** “D-C2's five staged English readings are nineteen chapters from a single historical translation of Calvin's *Institutes*, not five independent books. The 86,070-word option is a proposed selection that omits entire chapters and requires revised objectives and question-by-question source checks before any student assignment.”

**ES:** «Las cinco lecturas provisionales en inglés de D-C2 abarcan diecinueve capítulos de una sola traducción histórica de la *Institución* de Calvino, no cinco libros independientes. La opción de 86.070 palabras es una selección propuesta que omite capítulos enteros y exige revisar los objetivos y cada pregunta antes de asignarla a estudiantes».

**FR:** «Les cinq lectures anglaises provisoires de D-C2 couvrent dix-neuf chapitres d'une même traduction historique de l’*Institution* de Calvin, et non cinq livres indépendants. L'option de 86 070 mots est une sélection proposée qui omet des chapitres entiers ; les objectifs et chaque question doivent être vérifiés avant toute attribution aux étudiants».

## Controlled handoff / next actions

- **Claude and faculty:** compare D-C2's staged chapter set with the *actual live assigned reading and textbook*, select a defensible reading-hours target and five learning outcomes, and explicitly approve or reject any abridgment. Do not infer a live defect from staged source length.
- **Editorial and rights:** collate print pages and note apparatus; label any abridgment honestly; independently review full EN/ES/FR texts and theological vocabulary; do not treat CTS trilingual digests as translations of the originals.
- **Assessment:** build a nonsecret question-to-approved-source crosswalk, preserve all prior completions, and review accepted answers only in the private `assessment-keys` repository once authorized access is available. No public keys.
- **Release:** no merge, production deployment, grading policy change, student-record change, rights approval or partner commitment follows from this document.

**Strategic control:** publish internally, per elective, a nonsecret *assigned-source contract* containing exact reading version/hash, textbook version/hash, total assigned words/estimated hours, whether companion readings are independent, and faculty/translation approval. Gate source substitutions against the assessment mapping; do not count draft chapter files as completed student materials.
