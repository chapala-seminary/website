# B-C5 — all 40 public reading prompts vs Carey's staged 1792 source (2026-10-29)

**Research-only faculty handoff.** No answer keys, correct responses, accepted variants, student records, grades, release authorization, or claim of legal clearance. Preserve the current CTS reading room and earned credits.

## Exact inspected inputs
- Beta public reading-test questions: `src/content/readings/elecbapfivereadings.json`, blob `b0236bc4a23ca50363a3db7dd7a33c3ca553d95d`. Forty questions, eight assigned to each reading; all have EN/ES/FR/SW prompt strings. Only `prompt` and `reading` fields in the inspected question objects. The JSON has other root-level metadata that was not evaluated as a private-bank integrity audit.
- Current beta assigned reading room: `src/body/rooms/CTSElecBap5Readings.html`, blob `1783610d02d81a2b754b2d3f0c7240bdf9e7d70f`. It contains CTS-authored digests with historical commentary in addition to excerpts; it is **not** the same thing as the five staged 1792 sections.
- Historical source manifest: `books/B-C5/SOURCE.md`, blob `3980f7dca7b93d61ad527f5decebdcded36c658c`.
- Staged primary source: William Carey, *Enquiry* (1792), Sections I–V, on `handoff/book-sources`. Readings: R1 `ea265b5d9296969daa846590ae071ff53d4a5725`; R2 `41e82f67f0abfa1a5e913b77e16fe5620b502816`; R3 `794cb68351d10540161de73590df1602332e26aa`; R4 `a2e3facf2fc93b6b54d817dbe5d60c9128742d83`; R5 `8f08f935be648c20a216f2684bc626724f46dc4c`.
- Prior independent-reading overlap and candidate-author research: `books/B-C5/INDEPENDENCE_AND_FIVE_VOICE_REPLACEMENT_GATE.md` (blob `9732d3a2a6d9d60dc7383be9ed59d4374267d93b`).

## Conservative result
- **21 DIRECT**: the required historical fact/phrase is found in its assigned staged section.
- **1 PARTIAL**: Carey alludes to the event, but the specific date/person in the prompt is not in the section.
- **18 CTS-CONTEXT / NOT IN STAGED SECTION**: later biography, editorial explanation, or subsequent history in the current CTS digest, not in the specified 1792 source.
- These classifications concern **proposed source substitution**, not proof of an existing defective student examination. Current CTS digests contain added historical context, and students must not lose credit because a proposed research source is narrower.
- **Chronology safeguard:** #16 (1814), #22 (Carey's later Indian work), #23 (1987), #24 (1905), #29–32 (1800–1805), #37 (Oct 1792 society formation), #38 (1815), and #40 (Lottie Moon) cannot be supported as first-person statements in Carey's 1792 publication. Other older events may still be absent from the text. #34 is only a partial witness: an abolition defeat is discussed, but not the question's 1791 date or named sponsor.
- Existing staged R1–R5 are essentially all included in the staged Carey textbook (previous measured 12-token containment 97.82%–99.36%), **not five independent scholarly voices**. The already-researched five-author alternatives require page-image collation, passage selection, faculty approval and separate bank alignment.

## Public-stem crosswalk
**Legend:** D = direct staged primary-source witness; P = partial witness; C = current CTS context, not witnessed in staged 1792 section. Notes are evidence/provenance descriptions, never solutions.

| # | Reading | Status | Public English stem | Evidence/provenance note |
|---:|---:|:---:|---|---|
| 1 | 1 | C | Carey was born in 1761 in the Northamptonshire village of ____. | Carey birthplace and birth year are later biography, not Section I. |
| 2 | 1 | C | As a teenager Carey was apprenticed to a ____. | Apprenticeship is later Carey biography, absent from Section I. |
| 3 | 1 | C | In 1785 Andrew Fuller published The Gospel Worthy of All ____. | Fuller's 1785 title is CTS historical context, not Section I. |
| 4 | 1 | C | In 1784 John Sutcliffe called the churches of his association to a ____ hour of prayer. | 1784 monthly prayer chronology is CTS context; Section I only footnotes Sutcliffe without this date or frequency. |
| 5 | 1 | D | Carey argues that if the command to teach all nations belonged only to the apostles, so did the command to ____. | Carey's apostolic-command/baptism analogy appears in Section I. |
| 6 | 1 | D | The Holy Spirit forbade Paul and Silas to preach in ____. | Paul and Silas's prohibited destination is stated in Section I (historical spelling). |
| 7 | 1 | D | Carey says the many people far from God at home should stir Christians to “____ diligence.” | Section I uses the quoted diligence expression. |
| 8 | 1 | D | Carey called the slave trade on the coasts of Africa “the ____ Slave-Trade.” | Section I explicitly condemns the slave trade in the quoted phrase. |
| 9 | 2 | D | The apostles asked the church to choose seven men, whom Carey calls ____. | Section II describes seven chosen and their ecclesial designation. |
| 10 | 2 | D | Carey calls Paul’s first journey the first “____” on the heathen world. | Section II uses the military metaphor for Paul's first journey. |
| 11 | 2 | D | After their quarrel over Mark, Paul and Barnabas “could not ____ together.” | Section II reports Paul and Barnabas could not continue together. |
| 12 | 2 | D | Tertullian lived “at ____ in Africa.” | Section II locates Tertullian's writing in Africa. |
| 13 | 2 | C | In 1511 the Dominican preacher Antonio de ____ protested against the abuse of indigenous peoples. | 1511 Dominican protest not in Carey's Section II. |
| 14 | 2 | C | John Eliot’s ____ Bible of 1663 was the first Bible printed in America. | John Eliot's 1663 translation not in Section II. |
| 15 | 2 | D | Carey wrote that “none of the moderns have equalled the ____ Brethren.” | Section II explicitly praises the Moravian Brethren. |
| 16 | 2 | C | In 1814 Baptists met in Philadelphia and formed the ____ Convention. | 1814 convention postdates the 1792 work and is absent. |
| 17 | 3 | D | Where he lacked reliable counts, Carey estimated an average number of people “upon a square ____.” | Section III explains population estimation by area. |
| 18 | 3 | D | Carey counted about 44 million ____ in the world, a small fraction of humanity. | Section III lists the historical estimate and religious category; do not teach as modern demography. |
| 19 | 3 | C | Older English Bibles used “heathen” to translate the Greek ethnē, the “____.” | Greek ethnē explanation is CTS contextual teaching, not Carey's Section III. |
| 20 | 3 | D | Carey wrote that these peoples “appear to be as capable of ____ as we are.” | Section III states the quoted claim about capacity; historic terminology requires framing. |
| 21 | 3 | D | Carey thought most violence reported against Europeans came from an affront and was really “____.” | Section III explicitly discusses alleged violence as self-defence after affront. |
| 22 | 3 | C | In India Carey helped translate the Indian epic the ____ into English. | Carey's later Indian translation work cannot appear in his 1792 Section III. |
| 23 | 3 | C | In 1987 a missions congress in ____ spoke of Latin America moving from a mission field to a mission force. | 1987 congress postdates the source by 195 years. |
| 24 | 3 | C | The Baptist World ____, founded in 1905, links Baptist unions on every continent. | 1905 Baptist federation postdates the source. |
| 25 | 4 | D | Carey says distance might have been an excuse before the invention of the mariner’s ____. | Section IV identifies a navigation instrument as the change to travel feasibility. |
| 26 | 4 | D | Carey quotes Isaiah 60:9, where “the ships of ____” bring God’s sons from far. | Section IV quotes Isaiah 60:9 and the named ships. |
| 27 | 4 | D | Traders endure every hardship for the profit of “a few ____.” | Section IV mentions traders' commercial incentive in the quoted phrase. |
| 28 | 4 | D | Carey says a Christian minister is not his own; he is the ____ of God. | Section IV identifies a minister's relation to God in the quoted wording. |
| 29 | 4 | C | In January 1800 Carey, Marshman and Ward settled in ____, a Danish town near Calcutta. | 1800 Serampore settlement postdates the 1792 source. |
| 30 | 4 | C | In 1805 the Serampore missionaries wrote the Serampore Form of ____. | 1805 Serampore covenant postdates the 1792 source. |
| 31 | 4 | C | Carey completed the ____ New Testament in 1801. | 1801 New Testament translation postdates the 1792 source. |
| 32 | 4 | C | The first Bengali convert baptized at Serampore, in December 1800, was the carpenter Krishna ____. | 1800 first Bengali convert postdates the 1792 source. |
| 33 | 5 | D | Carey says the first and most important duty is “fervent and united ____.” | Section V explicitly names the leading duty and united prayer. |
| 34 | 5 | P | In 1791 Parliament rejected the bill of William ____ to end the slave trade. | Section V mentions a defeated abolition effort and Sierra Leona but does NOT name Wilberforce or the 1791 date. |
| 35 | 5 | D | Carey mentions the new free settlement at ____ on the coast of Africa. | Section V names the African free settlement (historical spelling). |
| 36 | 5 | D | Carey compares Christians to a trading ____ that has obtained its charter. | Section V compares mission organization to a chartered trading enterprise. |
| 37 | 5 | C | On 2 October 1792 a small group of ministers formed the Baptist mission society at ____. | 2 Oct 1792 founding event is later than the Enquiry's initial publication and absent from Section V. |
| 38 | 5 | C | Andrew ____ became secretary of the society and served until his death in 1815. | Fuller's service until his 1815 death cannot be stated by the 1792 author. |
| 39 | 5 | D | Carey suggested that people of moderate means give “a ____” of their yearly income. | Section V recommends a proportion of annual increase for moderate incomes. |
| 40 | 5 | C | Lottie Moon served as a Southern Baptist missionary in ____ from 1873 until her death in 1912. | Lottie Moon's nineteenth-/twentieth-century service postdates Carey's 1792 text. |

## Faculty/editorial handoff — English
Keep the presently assigned CTS digests and all earned credits unchanged. Before substituting the five Carey sections or adopting five distinct-author readings, faculty must identify whether each of the 40 prompts tests primary-source text, CTS background, or later historical scholarship. Never attribute later events or CTS summaries to Carey. Label primary text and CTS contextual notes visibly. Confirm the five-reading assessment contract and private accepted-answer variants only after source approval; no public answer keys.

## Nota para el profesorado — Español
Conserven los resúmenes actuales del seminario y todos los créditos ya obtenidos. Antes de sustituirlos por las cinco secciones de Carey o por cinco autores independientes, identifiquen qué preguntas evalúan el texto histórico, cuáles evalúan contexto editorial del seminario y cuáles se refieren a acontecimientos posteriores. No atribuyan a Carey datos posteriores a 1792. Distingan claramente «FUENTE PRIMARIA» y «CONTEXTO DEL SEMINARIO»; revisen las variantes de evaluación en el repositorio privado después de aprobar las fuentes.

## Note aux enseignants — Français
Conservez les synthèses actuellement attribuées et tous les crédits déjà acquis. Avant de les remplacer par les cinq sections de Carey ou par cinq auteurs indépendants, distinguez les questions portant sur la source historique, les commentaires pédagogiques du séminaire et les faits postérieurs. N'attribuez pas à Carey des événements survenus après 1792. Affichez clairement « SOURCE PRIMAIRE » et « CONTEXTE DU SÉMINAIRE » ; vérifiez les variantes de correction dans le dépôt privé après validation des sources.

## Mexico rights / version / translation gate
Carey's 1792 original prose (author died 1834) is a **preliminary** public-domain candidate under Mexico's ordinary author-life-plus-100 framework; this is not an institutional legal opinion or approval. Source scans and digital editions may carry separate contractual terms. Do not copy modern critical apparatus, added annotations or existing ES/FR translations without separate permissions. The Project Gutenberg transcription has not yet been collated to the original 1792 page images, particularly the numerical tables and quoted third-party passages. Verify the currently applicable Mexican legal text, edition, transcription, author/contributor rights, original pagination, and newly commissioned translations before publication. Preserve authentic Baptist missionary perspectives while clearly identifying outdated colonial-era generalizations and avoiding their presentation as present-day facts.

## Recommended nonproduction next steps
1. Faculty chooses either (a) one Carey primary-source close-reading assessment with accurately labelled CTS historical-context questions, or (b) Carey textbook plus five genuinely independent historical voices; do not misrepresent the current five Carey sections as independent authors.
2. Collate original pages, establish edition+page+SHA manifest, identify all later editorial additions, and map every public prompt to an **approved** source version. Run chronology/source-boundary checks in **report-only** mode.
3. Add visible «primary source / CTS context» provenance labels in proposed reading-room drafts, and ensure each question's required information is actually in the material assigned to students. This avoids penalizing learners for facts introduced only in editorial notes.
4. Review EN/ES/FR/SW wording with native-language faculty, then privately inspect grading variants and the 40-question bank after access is granted. Keep accepted answers exclusively in the private assessment repository. Do not modify production, student records or grades without authorization.

**Not completed:** faculty/owner source choice, original scan collation, Mexican legal signoff, full translations, private banks, student-facing changes or deployment.
