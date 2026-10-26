# C-C1 — Seven-segment source-boundary audit, workload and trilingual contextual bridge
**26 October 2026 | NONPRODUCTION research only | no source correction, translation release, exam keys, student records or deployment**

## Scope and reproducibility
I independently fetched the exact four raw OCR source files and six provisional selection files from `handoff/book-sources/books/C-C1/` as `chapalatheological-ai`. The six selection files contain **seven** ```text``` source blocks: R1, R2a, R2b, R3a, R3b, R4, R5. Each was compared with the raw source's recorded **zero-based JavaScript UTF-16 character offsets**. This is a **raw-source-to-staged-selection** test, NOT verification against the printed 1872 facsimile.

| Segment | Raw source blob SHA-1 | Source UTF-16 [start,end) | Raw chars | Staged text match |
|---|---|---|---:|---|
| R1 | `957a507d9ba1f0f1eba72330f865be5d1ec9ee80` | [29257,43752) | 14,495 | exact after trailing-newline trim; Markdown block omits one final LF |
| R2a | same source 1 | [43752,67623) | 23,871 | exact |
| R2b | same source 1 | [134544,157933) | 23,389 | exact |
| R3a | `b80bc00b8e386890d942e3fc0cf3cbb9c3bbedaa` | [9017,26978) | 17,961 | exact |
| R3b | same source 2 | [54710,60370) | 5,660 | exact |
| R4 | `5e964602bfba9662dd5b101f88483f16b24f1335` | [84230,106034) | 21,804 | exact |
| R5 | `db37dc8b142b926ea004cd6e3a31ebd2b682094a` | [7538,36079) | 28,541 | exact |

**Result:** six of seven staged blocks are byte-for-byte identical to their raw offset windows; R1 is identical after trimming a single trailing newline. No substantive source alteration detected. This does **not** establish historical OCR correctness or Mexico rights.

## Independent overlap and workload audit
Method: for each reading group, concatenate its staged raw source blocks (R2 and R3 each have two), lowercase, tokenize Unicode letters/digits, then compare sets of contiguous **12-token** strings. No headings, provenance text, or Markdown were included. Counts differ from whitespace OCR counts because punctuation and broken OCR tokens are handled differently.

| Reading group | Normalized tokens | Unique 12-token shingles | Share of total assigned tokens |
|---|---:|---:|---:|
| R1 — voyage | 2,700 | 2,689 | 10.9% |
| R2 — Georgia (two noncontiguous windows) | 8,676 | 8,665 | **34.9%** |
| R3 — Böhler/Aldersgate (two noncontiguous windows) | 4,349 | 4,338 | 17.5% |
| R4 — Bristol | 3,964 | 3,953 | 15.9% |
| R5 — societies | 5,194 | 5,142 | 20.9% |
| **Total** | **24,883** | — | 100% |

Across the **ten** reading-pair comparisons, nine have **zero** common unique 12-token sequences. R3/R4 share **11** overlapping shingles (0.254% of R3 and 0.278% of R4), all belonging to one repeated biblical quotation of **John 5:25**, not duplicate historical narrative. This supports **passage disjointness**, not independent authorship: all five readings still come from Wesley's one journal. A final textbook has **not** been staged, so textbook-to-reading containment cannot yet be calculated.

## Three concrete editorial blockers discovered
1. **R3a ends mid-transition.** Its exact window stops immediately after the complete sentence ending “shall never be extinguished.” but includes a dangling **“On ”** before the next entry. Propose stopping three characters earlier, subject to a facsimile check and reissued versioned derivative. Do not silently edit the raw source or change an approved student text.
2. **R3b begins inside a numbered argument.** The block starts with paragraph **13** (“I continued thus to seek it”) and the prior paragraphs, including paragraph 12 on Böhler, Scripture, and testimony, are outside the assigned R3b window. It is contextually misleading to present the extract as self-contained or to label its opening as a fresh 24 May journal heading. Add a clearly original bridge note or expand the boundary after printed-page collation.
3. **R2 is disproportionately long and skips history.** It represents **34.9%** of the total assigned tokens and consists of February–June 1736 plus December 1737, with approximately seventeen months omitted. The heading must say “selected Georgia episodes,” not imply continuous coverage. A five-reading workload and learning-objective review is needed before assignment.

The adjacent OCR phrase **“On Wednesday, 36”** occurs **after** R3a's current stop offset and is not within that staged reading. The previous ledger's description of this as an uncertain terminal date should be refined: it is an **adjacent source-OCR error** requiring facsimile collation if the window is extended.

## Original student-facing contextual bridge draft — not a translation of Wesley's source

### English (editorial draft)
The selections trace a change in Wesley's ministry, not a simple story of uninterrupted success. The Georgia episodes include disputes and a departure; the later London passages show Wesley debating what it means to trust Christ and to have assurance. The Aldersgate account is embedded in that longer debate and should not be read as an isolated formula that every Christian must experience in precisely the same way. Wesley's reports are a valuable firsthand witness to his own understanding, but a journal is also selective and interpretive. When studying Bristol field preaching, ask how the audience, venue, and practice of ministry changed, and how Wesley described the responses he observed. His account does not establish every reported experience as an independently verified event. Compare the account with Scripture and with other Christian traditions respectfully.

Discussion prompts: (1) What changed between Georgia and Bristol? (2) How does the surrounding Böhler discussion alter an isolated reading of Aldersgate? (3) Which claims are firsthand observations, which are interpretations, and which are reported speech?

### Español (borrador editorial original)
Estas selecciones muestran cambios en el ministerio de Wesley, no una historia de éxitos ininterrumpidos. Los episodios de Georgia incluyen conflictos y una salida; los pasajes posteriores de Londres muestran su debate sobre la confianza en Cristo y la seguridad de la fe. El relato de Aldersgate pertenece a esa conversación más amplia y no debe convertirse en una fórmula que todos los cristianos tengan que experimentar exactamente igual. El diario es un testimonio importante de la perspectiva de Wesley, pero también selecciona e interpreta los acontecimientos. Al estudiar la predicación al aire libre en Bristol, pregúntese cómo cambiaron el público, el lugar y la práctica ministerial. La narración no verifica de forma independiente todas las experiencias descritas. Compare sus afirmaciones con las Escrituras y trate con respeto otras tradiciones cristianas.

Preguntas de estudio: (1) ¿Qué cambió entre Georgia y Bristol? (2) ¿Cómo modifica el contexto de Böhler la lectura de Aldersgate? (3) ¿Qué afirmaciones son observaciones directas, interpretaciones o palabras atribuidas a terceros?

### Français (brouillon éditorial original)
Ces extraits retracent une évolution du ministère de Wesley plutôt qu'une succession ininterrompue de réussites. Les épisodes de Géorgie comprennent des conflits et un départ; les passages londoniens montrent ensuite Wesley réfléchissant à la confiance en Christ et à l'assurance de la foi. Le récit d'Aldersgate appartient à cette discussion plus large: il ne faut pas en faire un modèle d'expérience identique imposé à tous les chrétiens. Le journal témoigne de la compréhension personnelle de Wesley, mais il sélectionne et interprète aussi les événements. Pour la prédication en plein air à Bristol, demandez-vous comment le public, le lieu et la pratique du ministère ont changé. Le récit ne constitue pas une vérification indépendante de chaque expérience rapportée. Comparez les affirmations avec les Écritures tout en respectant les autres traditions chrétiennes.

Questions d'étude : (1) Qu'est-ce qui a changé entre la Géorgie et Bristol ? (2) En quoi le contexte des échanges avec Böhler éclaire-t-il Aldersgate ? (3) Quelles affirmations sont des observations directes, des interprétations ou des paroles rapportées ?

**These three notes are newly written explanatory commentary, not a licensed or corrected translation of Wesley's journal. Native ES/FR academic review is still required. They contain no exam questions or answer keys.**

## Rights and release gate
The underlying journal author John Wesley (d. 1791) and historical editor Thomas Jackson (d. 1874) pass a **preliminary** Mexican life-plus-100 screen. The currently amended Mexican LFDA is listed by WIPO Lex as updated through **14 May 2026**: https://www.wipo.int/wipolex/es/legislation/details/23966 . Article 29 addresses economic-term expiration; Articles 18–21 address moral rights and attribution/integrity. These facts do **not** independently clear quoted letters, other contributors, scan-provider conditions, modern layout, or a future translation. This is source-risk triage, not legal authorization.

Primary edition/catalog: https://www.whdl.org/en/browse/resources/9539 . Every exact printed page, disputed date, name, and contributor must be checked against the 1872 facsimile before any text is released.

## Handoff
- **Claude / source editor:** independently reproduce the seven offset checks; repair the dangling R3a transition only in a new versioned derivative; supply a page-collated R3b context bridge; label R2's 17-month gap and rebalance its 34.9% workload; obtain a native review of the three original notes.
- **Robert / beta QA:** add report-only gates for (a) a reading beginning with a dependent pronoun or numbered continuation, (b) dangling terminal words, (c) noncontiguous source windows presented as continuous, (d) unusually uneven reading lengths, and (e) reused Scripture mistaken for historical-source duplication.
- **Wayne:** decide whether five distinct episodes from **one author** satisfy the mandatory five-reading learning outcomes, or whether independent Methodist voices are required; retain academic and rights approval.
- **Assessment:** no private 40-question bank is created or implied; prepare it only after corrected approved EN/ES/FR source texts and question alignment. No existing student credit is affected.
