# D-C5 — 40 public reading prompts: CURRENT beta digests versus staged Baxter excerpts
**Research-only faculty/Claude handoff · 28 October 2026 (Mexico) · no student-facing changes**

## Finding and scope
D-C5 (*Reformed Pastoral Ministry, Preaching, and Missions*) has two distinct proposed study objects. The **current beta reading room** presents five CTS digests of Richard Baxter with historical commentary, whereas the nonproduction handoff branch proposes five long excerpts of Baxter's *The Reformed Pastor*. The beta **public** reading-test JSON contains forty fill-in-the-blank stems, eight per reading. Against the proposed excerpts, this manual topical/quotation crosswalk finds **32 with directly locatable staged-text support (S), one partly supported (M), and seven requiring material outside the staged excerpt (O)**. The seven omitted topics ARE addressed in the present beta digests; the audit does **not** prove a defect in the current student test. No answers or private banks were read.

The seven outside-excerpt stems are **#1, #2, #3, #4, #24, #32, #40**. The partial stem is **#25**: the staged passage supplies the family count but not the parish name. Several other stems paraphrase archaic diction; S means the *topic or quote* is locatable, **not** that the private correct answer or translations were validated.

**Important consequence:** If CTS adopts the separately proposed five-voice readings (Calvin/Owen/Herbert/Bridges/Boston), the current forty Baxter-specific stems cannot simply be carried over. A new source-specific public stem set and privately verified answer bank would be required, while past credits and attempts remain untouched. Replacing current digests with the staged Baxter excerpts without reconciling the eight exceptions would also risk assessment fairness.

## Source identities checked (GitHub blob SHAs)
- Current beta room: `src/body/rooms/CTSElecRef5Readings.html` SHA `6f38470cb681d0e6a7b7314363a1e5e43606fa1c`. Five `<article class="reading">` sections verified. R1 contains Gildas/1641/Acts 20:28; R3 contains 1662/Uniformity; R4 contains Netherlands/Kidderminster; R5 contains Eliot/Algonquian.
- Current beta public reading test: `src/content/readings/elecreffivereadings.json` SHA `f790f9b41bc14f2fa4b7a54cbcb40d3813ec98e1`. 40 public prompts, EN/ES/FR/SW fields, `keys: private`. No private answer-key or grading evidence accessed.
- Staged excerpts `books/D-C5/reading-1.md` … `reading-5.md`, SHAs `c1b3d563a5b39ce3bdfe75fdc1bbcebac43d73ba`, `9cbccf74566b8747a5da963baeed6700814d00ab`, `fe7432a27c470b2bb62c6425c4e9850921086673`, `770bb64c5e19bde336aba227f526692a87967e50`, `e762990c8cb3e29642094feac3ac92e35ab04ecc`. Source manifest `books/D-C5/SOURCE.md`.
- Separate independent-author proposal `books/D-C5/INDEPENDENCE_AND_FIVE_VOICE_GATE.md`; its historical candidates are **not** approved replacement readings.

## All 40 public stem topics mapped to staged Baxter readings
| # | Reading | Public stem topic (no answer key) | Status | Evidence / limitation |
|---:|:---:|---|:---:|---|
| 1 | R1 | Acts 20:28 wording | O | Biblical quotation is not reproduced in staged R1; present in current beta digest. |
| 2 | R1 | Latin original title | O | Gildas Salvianus absent from staged R1; current digest introduces it. |
| 3 | R1 | Meaning of 'reformed' in title | O | Title gloss absent from staged R1; current digest explains it. |
| 4 | R1 | 1641 Kidderminster appointment | O | Biographical chronology absent from staged R1; current digest includes it. |
| 5 | R1 | Tailor in rags analogy | S | Staged R1 contains tailor comparison. |
| 6 | R1 | Minister not saved by office | S | Staged R1 contains relevant quotation. |
| 7 | R1 | Cold heart and preaching | S | Staged R1 contains relevant quotation. |
| 8 | R1 | Study, pray, confer, practice | S | Staged R1 contains relevant exhortation. |
| 9 | R2 | Wrong livelihood motive | S | Staged R2 contains bad-trade quotation. |
| 10 | R2 | Depth of study | S | Staged R2 contains well metaphor. |
| 11 | R2 | Teaching Christ | S | Staged R2 contains teaching quotation. |
| 12 | R2 | Painted-glass sermon analogy | S | Staged R2 contains painted-glass comparison. |
| 13 | R2 | Necessity directs studies | S | Staged R2: 'necessity hath been the conductor of my studies and life'. |
| 14 | R2 | Praying for the congregation | S | Staged R2 contains earnest-prayer quotation. |
| 15 | R2 | Visiting a poor household | S | Staged R2 contains poor man's home example. |
| 16 | R2 | Spoonful in fragile glass | S | Staged R2 contains the image. |
| 17 | R3 | Hearts and orthodoxy | S | Staged R3 contains relevant quotation. |
| 18 | R3 | Ezra and priests' sins | S | Staged R3 contains Ezra example. |
| 19 | R3 | Pride paints the window | S | Staged R3 contains metaphor. |
| 20 | R3 | Pride and evil | S | Staged R3 contains relevant quotation. |
| 21 | R3 | Papal infallibility analogy | S | Staged R3 contains relevant quotation. |
| 22 | R3 | Pride's firstborn metaphor | S | Staged R3 contains relevant quotation. |
| 23 | R3 | Sleepy preacher | S | Staged R3 contains relevant quotation. |
| 24 | R3 | 1662 Act of Uniformity | O | Post-1656 historical context absent from staged R3; present in current beta digest. |
| 25 | R4 | Kidderminster parish family count | M | Staged R4 gives approximately 800 families but does not name Kidderminster in that passage; current digest supplies place. |
| 26 | R4 | Two whole days weekly | S | Staged R4 explicitly says two whole days a week. |
| 27 | R4 | Nathan's rebuke | S | Staged R4 contains direct analogy. |
| 28 | R4 | Grace makes no leaps | S | Staged R4 contains relevant quotation. |
| 29 | R4 | Authority and duty | S | Staged R4 contains power-to-do-duty quotation. |
| 30 | R4 | Spiritual famine in cities | S | Staged R4 explicitly describes spiritual famine. |
| 31 | R4 | Breaking the ice | S | Staged R4 contains phrase. |
| 32 | R4 | Netherlands elder visitation | O | No Netherlands/Holland/Dutch/elders passage in staged R4; current digest adds the example. |
| 33 | R5 | House-to-house ministry | S | Staged R5 contains public and house-to-house wording. |
| 34 | R5 | Physician and plague analogy | S | Staged R5 contains analogy. |
| 35 | R5 | Putting aside studies | S | Staged R5 contains relevant quotation. |
| 36 | R5 | Candle burns | S | Staged R5 contains relevant quotation. |
| 37 | R5 | Duty and comfort | S | Staged R5 contains relevant quotation. |
| 38 | R5 | Preaching to one person | S | Staged R5 contains relevant quotation. |
| 39 | R5 | Writing Acts 20 on study doors | S | Staged R5 contains 'study doors' and 'capital letters'. |
| 40 | R5 | John Eliot Algonquian translation | O | Biographical/mission history absent from staged R5; current digest supplies it. |

## Trilingual faculty/source-version gate
**EN — Proposed faculty notice.** The existing beta examination was written for the five CTS digests, not solely for the five historical excerpts. Preserve the current assessment until a faculty-approved reading version is identified. If adopting excerpts, supply verified coverage for seven missing and one partial stem or revise the public questions and the *private* answer bank together; retest each language and preserve earned credits. If adopting five independent authors, commission an entirely new assessment rather than reusing Baxter quotations.

**ES — Aviso propuesto al profesorado.** El examen actual de beta corresponde a los cinco resúmenes de CTS, no solamente a los cinco extractos históricos. Manténgase la evaluación actual hasta que el profesorado apruebe una versión concreta de las lecturas. Si se adoptan los extractos, debe documentarse el respaldo de siete preguntas sin fuente y una parcialmente respaldada, o revisarse conjuntamente las preguntas públicas y el banco privado; deben verificarse todos los idiomas y conservarse los créditos obtenidos. Si se adoptan cinco autores independientes, será necesario un examen nuevo.

**FR — Avis proposé au corps enseignant.** L'évaluation actuelle de bêta correspond aux cinq synthèses CTS, et non uniquement aux cinq extraits historiques. Il faut conserver l'évaluation actuelle jusqu'à l'approbation d'une version précise des lectures. Si les extraits sont retenus, il faudra justifier sept questions sans appui dans ces extraits et une question partiellement appuyée, ou réviser ensemble les questions publiques et la banque privée; vérifier chaque langue et préserver les crédits acquis. Si cinq auteurs indépendants sont retenus, une nouvelle évaluation sera nécessaire.

## Provenance and Mexico rights — screening, NOT release clearance
Richard Baxter died in 1691, making his seventeenth-century **original authorial text** a strong life-plus-100 public-domain candidate under Mexico's LFDA Article 29. LFDA Articles 78–79 separately protect original contributions to translations/adaptations. The proposed English transcription is derived from a CCEL/ThML pipeline through OpenChristianData; the specific transcription's provider terms, nineteenth-century edition editorial matter, proof-text accuracy and 1656/1835 printed witness still require clearance and collation. Existing CTS EN/ES/FR digests are editorial syntheses; their historical claims need independent citation. Do not assume modern Spanish/French translations are free for republication.

2026-current legal version reference: https://www.wipo.int/wipolex/es/legislation/details/23966 (Mexican LFDA, amended through 14 May 2026). Historical-source witness and derivation: `books/D-C5/SOURCE.md`. This is an academic rights screen, not a legal opinion or permission to publish.

## Required next actions
1. **Faculty/Wayne** decide the authoritative student reading set: (A) five current CTS digests; (B) five Baxter primary-source excerpts; or (C) five historically independent authors. Document the decision without retroactive student-credit changes.
2. **Claude** preserve beta as-is pending that decision. Create a **non-secret source-version contract** per stem (course, reading, exact edition/paragraph, digest SHA, prompt-language completeness, review status); store private correct responses only in `assessment-keys`. Report-only CI should flag mismatched source hashes or missing translations before any migration.
3. **Assessment/faculty** for B: verify #1–4, #24, #25, #32, #40 against approved source pages, replace/augment readings or questions, and test with synthetic accounts; for C: write all forty new source-based stems and verify private banks separately.
4. **Rights/editorial** collate original dated print witnesses, separate later introductions and footnotes, record provider terms, commission independent ES/FR translation review, and approve doctrinal fit. No live swap, student email, exam edit, production merge or deployment authorized by this document.
