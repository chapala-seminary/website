# D-C2 / Ref2 — all 40 public reading prompts versus staged Calvin/Allen and current CTS digests (29 October 2026)

**Research-only faculty gate. No answer keys, accepted variants, student data, live assessment changes, or publication approval.** This document compares the **existing public** reading-question stems against the **proposed chapter-bounded English extracts**, not against any uninspected private bank. It does **not** establish that the current CTS digest-based test is defective.

## Verified inputs and scope

- Beta **and main** public question manifest: `src/content/readings/elecreftworeadings.json`, identical Git blob `6c2b61349b802bddf3da62b5f456a5f465fa3d18`; **40 prompts**, eight per reading, **40/40 nonempty EN/ES/FR/SW prompt fields**, draw 20 (four per reading), pass 18; `keys: private`. The `requiredFrom` field is `2026-10-28T06:00:00Z` (elapsed); **actual live server enforcement and multilingual accepted-answer behavior were not tested**.
- Beta current student reading room: `src/body/rooms/CTSElecRef2Readings.html`, Git blob `2a717254ae639803ce53cb90b86a34c3bc768e5c`. The room contains five CTS digests; this is **not** equivalent to the five long Calvin chapter extracts. The room independently includes the three contextual details flagged below.
- Staged **research branch only**: `books/D-C2/reading-{1..5}-source.md`, blobs R1 `8c27603ad206ce8243b2e09961a45a5a046ad033`; R2 `6bd0bf2fd438784dbddf844a3e724ff4c6b7ced2`; R3 `e35e68b6574a93b2331835419eb4a3c8e3ec8008`; R4 `c697551123ee6f68690931b0305a95c3d67a7f4a`; R5 `665b746506c9765bc3e58e04d8ec4fc8ec8e179d`. The source manifest records **139,039 whitespace tokens** across 19 nonoverlapping Book III chapters, **not final student readings**.
- Source identity: Calvin's `Institutes`, historical John Allen English translation, Project Gutenberg [volume I #45001](https://www.gutenberg.org/ebooks/45001) and [volume II #64392](https://www.gutenberg.org/ebooks/64392). These are **one author/translation in two volumes**, not five independent scholarly voices.
- Method: examined each of 40 public English question stems against its **assigned** staged reading and its actual Book III chapter; checked non-answer textual witnesses (including paraphrases), and separately checked context-only information against the current CTS room. A textual witness is **not** answer validation, printed-page collation, or translation approval.

## Complete non-answer-bearing source crosswalk

**S** = staged chapter provides a direct topical/textual witness, subject to facsimile and faculty checks; **P** = partial: historical detail in public stem comes from CTS digest rather than staged chapter; **C** = CTS digest historical context only, absent from staged chapter. Neither status implies that the current digest-based test is wrong.

| Q | Assigned | Staged Book III chapter | Non-answer evidence / scope | Gate |
|---:|:---:|:---|:---|:---:|
| 1 | R1 | III:I | Christ's union through the Spirit | S |
| 2 | R1 | III:I | Spirit's familial cry | S |
| 3 | R1 | III:II | Scholastic description of faith | S |
| 4 | R1 | III:II | Ground of faith | S |
| 5 | R1 | III:II | Prisoner and partial sunlight analogy | S |
| 6 | R1 | III:III | Faith preceding repentance | S |
| 7 | R1 | III:III | Twofold repentance | S |
| 8 | R1 | III:III | Calvin's definition of repentance | S |
| 9 | R2 | III:IV | Three parts of scholastic penance | S |
| 10 | R2 | III:IV | Papal decree and Lateran council; calendar year is digest context | P |
| 11 | R2 | III:IV | Distinction between wrathful punishment and fatherly discipline | S |
| 12 | R2 | III:V | Indulgence doctrine and surplus merits | S |
| 13 | R2 | III:VI | Gospel as lived doctrine | S |
| 14 | R2 | III:VII | Belonging to God | S |
| 15 | R2 | III:VII | Neighbor-love without intrinsic merit | S |
| 16 | R2 | III:X | Individual vocation | S |
| 17 | R3 | III:XIV | Four categories of persons | S |
| 18 | R3 | III:XIV | Teaching on duties and servants | S |
| 19 | R3 | III:XIV | Efficient cause in salvation | S |
| 20 | R3 | III:XIV | Material cause in salvation | S |
| 21 | R3 | III:XV | Critique of applying a term to works | S |
| 22 | R3 | III:XV | Bernard is cited; identifying his monastery is digest context | P |
| 23 | R3 | III:XVII | Fatherly acceptance of imperfect works | S |
| 24 | R3 | III:XVII | Cornelius's prayers and alms | S |
| 25 | R4 | III:XXI | Danger of speculative curiosity | S |
| 26 | R4 | III:XXI | Scripture and the Spirit's teaching | S |
| 27 | R4 | III:XXI | Definition of predestination | S |
| 28 | R4 | III:XXI | Narrower election within Israel | S |
| 29 | R4 | III:XXII | Holiness in relation to election | S |
| 30 | R4 | III:XXIII | Divine will and justice | S |
| 31 | R4 | III:XXIII | Calvin's description of the decree | S |
| 32 | R4 | CTS R4 digest only | 1551 Jerome Bolsec dispute; absent from staged Calvin chapter text | C |
| 33 | R5 | III:XXIV | Calling discloses election | S |
| 34 | R5 | III:XXIV | Christ as focus for contemplating election | S |
| 35 | R5 | III:XXIV | Apostasy example in the Gospel | S |
| 36 | R5 | III:XXIV | Universal and inward call | S |
| 37 | R5 | III:XXV | Opening resurrection discussion | S |
| 38 | R5 | III:XXV | Millenarian time claim | S |
| 39 | R5 | III:XXV | Ancient philosophers and the highest good | S |
| 40 | R5 | III:XXV | Continuity of resurrected body | S |

**Count check:** 37 S + 2 P (Q10, Q22) + 1 C (Q32) = **40**; five reading groups × eight = 40. The only fully context-only question is Q32. In Q10 the staged source identifies the papal era and Lateran council, but the year **1215** is supplied by the CTS digest; in Q22 the staged text cites Bernard but does not identify him as **of Clairvaux**, which the CTS digest supplies. In Q32 the 1551 **Jerome Bolsec** incident is in the CTS digest, not in staged Calvin Book III XXI–XXIII. These are **conditional mismatches only if** the staged historical chapters replace the current digests without the context.

## Faculty source/version and workload gate

The five proposed source readings total **139,039 tokens** (R1 35,236; R2 42,141; R3 22,974; R4 18,379; R5 20,309), an estimated **11.6 hours at a hypothetical 200 words/minute**, excluding note-taking, Bible study, and exams. The prior whole-chapter reduction proposal remains **86,070 tokens** and would itself require question revalidation. D-C1 and D-C2 staged chapter ranges do **not** overlap, but both draw from Calvin/Allen; this is not five independent perspectives. Do not mark the 139,039 tokens as five finished, translated readings or call an abridgment an unabridged book. Faculty must decide whether the course will use the **current five CTS digests**, an explicitly abridged Calvin reader, or an independently sourced five-voice set, and then define the authoritative source version for assessment.

**Source-level checks:** original printed page images, edition/translator and note apparatus, chapter boundaries, any textual modernization, and the distinct treatment of historical anti-Catholic polemics. No source text or student-facing reading has been replaced. The private assessment repository was **not accessed**; there is no accepted-answer parity claim.

## Mexico rights — preliminary, NOT clearance

Mexico's **Ley Federal del Derecho de Autor, Article 29(I)** provides ordinary author-life plus 100 years for economic rights ([Cámara de Diputados consolidated law](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFDA.pdf); [WIPO Lex](https://www.wipo.int/wipolex/es/legislation/details/19901)). Calvin died **1564**, translator John Allen **1839**, well outside the ordinary term for their historical authorship/translation. Project Gutenberg labels these specific English volumes **public domain in the USA**, which does not by itself determine Mexican rights. This is a **strong preliminary historical-text candidate**, not authorization to redistribute later editors' additions, modern Spanish/French translations, fresh introductions, annotations, cover art, or third-party editions. Separate provenance and permissions for all newly contributed elements; obtain CTS academic/legal approval before public reuse.

## Trilingual faculty decision notices (drafts only)

**EN:** “D-C2 has 37 public questions provisionally witnessed by the proposed Calvin/Allen chapters; two require details currently supplied by the CTS digests, and one historical question (the 1551 Bolsec dispute) is digest-only. The five long extracts are not five independent works. Choose and approve an exact reading version and workload before remapping examinations. English, Spanish, French and Swahili prompts are present, but accepted-answer parity and durable grading are unverified.”

**ES:** «En D-C2, 37 preguntas públicas tienen respaldo provisional en los capítulos propuestos de Calvino/Allen; dos requieren detalles que hoy proporcionan los resúmenes de CTS y una pregunta histórica (la controversia de Bolsec de 1551) depende exclusivamente del resumen. Los cinco extractos extensos no son cinco obras independientes. Es necesario aprobar la versión y la carga de lectura antes de ajustar los exámenes. Hay preguntas en inglés, español, francés y suajili, pero no se ha verificado la equivalencia de respuestas aceptadas ni el registro duradero de las calificaciones».

**FR:** «Pour D-C2, 37 questions publiques ont un appui provisoire dans les chapitres proposés de Calvin/Allen ; deux nécessitent des précisions fournies actuellement par les synthèses CTS et une question historique (le différend Bolsec de 1551) dépend uniquement de la synthèse. Les cinq longs extraits ne sont pas cinq œuvres indépendantes. Il faut approuver une version précise et la charge de lecture avant de modifier les examens. Les questions existent en anglais, espagnol, français et swahili, mais ni la concordance des réponses admises ni la persistance des résultats n'ont été vérifiées».

## Secure handoff / gates

1. **Claude + Reformed faculty:** preserve existing digests and earned credit; choose source contract (exact five reading IDs/hashes, word targets, whether five independent voices are required). Either retain CTS historical context or rewrite Q10/Q22/Q32 only after faculty approval; do not silently remove historically valid teaching.
2. **Editorial and rights:** collate Allen against page images; distinguish source text from digest/editorial statements; confirm Mexican publication/translation rights for each component. Prepare full EN/ES/FR approved readings only after source choice, with native theological review; the existing EN/ES/FR digests are not full translations of the 139k-token English extracts.
3. **Private-bank owner:** on approved version, map 40 public prompts to private accepted variants and review **EN/ES/FR/SW** equivalence; test synthetic submissions for server receipt, durable score/credit and idempotent completion. No answers or student records in the public repo.
4. **Release owner:** treat elapsed `requiredFrom` as a code timestamp only until actual live requirement and grading are verified; no student-facing policy, production deployment, key disclosure, or credit change without Wayne's approval. PR #164 remains a draft and sending must remain off.

**Strategic improvement:** add a *report-only source-contract preflight* for every elective that compares the live room digest hash, proposed five-reading hashes, public prompt version, private-bank version (private CI only), and effective requirement timestamp. A course with source/rights/language gates open should be flagged **before** an assessment requirement becomes student-facing; the preflight must not silently alter grades or policies.
