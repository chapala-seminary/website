# A-C5 / PC5 — all 40 public reading prompts versus five provisional Azusa source windows

**29 October 2026 | Research-only, non-answer-bearing, no student-facing change | NOT a faculty, legal, or release approval**

## Scope and verified inputs

- Public beta reading-question manifest `src/content/readings/elecpcfivereadings.json`, blob `5d941abf225b7451b865666fb85d9cf3c632e37d`, 40 public question prompts, four languages, 8 prompts per reading, draw 20 / pass 18 / four drawn per reading, private keys referenced but **not accessed**. Its explicit `requiredFrom` is `2026-10-29T06:00:00Z` (elapsed as of this audit); this verifies source configuration, **not** live server enforcement.
- Current beta student reading room `src/body/rooms/CTSElecPC5Readings.html`, blob `73a74a48942f6ab6c2d8d4aba0879da7703243c2`. It assigns **five original CTS study digests**, synthesizing different 1907–08 issue passages plus later historical explanation. The digests are not identical to the five proposed primary-source windows below. The room contains a blanket pre-1931 reuse statement that is **not sufficient** to clear separately authored contributions in Mexico.
- Six staged modern-reproduction issue transcriptions (not original-facsimile-collated): No. 8 `110e83d64c13ec2ba1cf54e24b07444e44c75804`; No. 9 `1df0e8678dc0cf0b483519bd97ca1e75022050f8`; No. 10 `ac708ae3e6902f423e28c1a560eef4c8625515dc`; No. 11 `4ba5ac1883a4c1d71faa03dd18d8918ac58ca8d0`; No. 12 `5ef43a13e6e6bebef3682b397fa73f928eb12054`; No. 13 `7aedd4c62e54e4d9f350ee1c56615cb45decb3d9`.
- Proposed window coordinates are UTF-16 zero-based/end-exclusive from the 26 October five-candidate source map; **all five are from one periodical**, and contributor-specific rights remain unresolved.

| Proposed window | Issue | UTF-16 range | Heading |
|---|---|---|---|
| R1 | 11 | `[300,6153)` | PENTECOST SPREADS TO OTHER LANDS |
| R2 | 8 | `[27790,30859)` | AT AZUSA MISSION |
| R3 | 11 | `[15543,18989)` | PENTECOSTAL MISSIONARY REPORTS |
| R4 | 12 | `[19223,22594)` | THE APOSTOLIC FAITH MISSION |
| R5 | 13 | `[59071,62807)` | THE LORD IS SENDING MISSIONARIES |

## Reproducible public-stem anchor audit — not an answer audit

For each public prompt, selected one **visible, non-answer-bearing anchor phrase from its English question**. Searched case-insensitively for that literal phrase in (a) its proposed reading window, (b) other four windows, and (c) the six entire staged issue transcripts. This is a *triage* screen only: a positive anchor is **not proof that the specific answer is supported**; a negative anchor can reflect synonyms, OCR, an editorial paraphrase, or material outside these windows. No blanks were filled and no private answers were accessed.

**Results:** 4/40 anchors occur in their assigned proposed window; 8/40 occur in at least one *different* proposed window (these groups overlap); 29/40 occur in none of the five proposed windows. All 40/40 public prompts contain one blank in EN, ES, FR and SW. The **current CTS digest-based exam is not thereby shown defective**; the concern is transplanting its questions unchanged onto a different reading set.

| Q | Assigned | Non-answer anchor from public prompt | Anchor in assigned proposed window? | Other proposed window(s) with anchor | Entire staged issue(s) with anchor |
|---:|:---:|---|:---:|---|---|
| 01 | R1 | Spokane | No literal hit | R3, R5 | 9, 11, 13 |
| 02 | R1 | foreign speech | No literal hit | — | — |
| 03 | R1 | Lucy Farrow | No literal hit | — | — |
| 04 | R1 | Johnsonville | No literal hit | R3 | 11 |
| 05 | R1 | Unlocked by Prayer | No literal hit | — | 8 |
| 06 | R1 | Garr | Yes (lexical only) | — | 8, 9, 11 |
| 07 | R1 | Hong Kong | Yes (lexical only) | — | 11, 13 |
| 08 | R1 | His character | No literal hit | — | 13 |
| 09 | R2 | office work | No literal hit | — | 9 |
| 10 | R2 | Teacher of | No literal hit | — | 9, 13 |
| 11 | R2 | credentials | No literal hit | — | 9 |
| 12 | R2 | first thing in every assembly | No literal hit | — | 9 |
| 13 | R2 | To the Baptized Saints | No literal hit | — | 9 |
| 14 | R2 | grocery | No literal hit | — | 11 |
| 15 | R2 | Who May Prophesy | No literal hit | — | 12 |
| 16 | R2 | Assemblies of God | No literal hit | — | — |
| 17 | R3 | $200 | No literal hit | — | 8 |
| 18 | R3 | free paper | No literal hit | — | 9 |
| 19 | R3 | editor's name | No literal hit | — | — |
| 20 | R3 | Clara | No literal hit | — | 9 |
| 21 | R3 | North China | Yes (lexical only) | — | 11, 12, 13 |
| 22 | R3 | free will | No literal hit | R4 | 10, 11, 12 |
| 23 | R3 | parlor | No literal hit | — | 9, 11 |
| 24 | R3 | God has made us | No literal hit | — | 11 |
| 25 | R4 | undenominational | No literal hit | — | 11 |
| 26 | R4 | Love, Faith | No literal hit | — | 10, 12, 13 |
| 27 | R4 | every mission | No literal hit | — | 11 |
| 28 | R4 | old Mission | No literal hit | — | 12 |
| 29 | R4 | little cottage | No literal hit | — | 13 |
| 30 | R4 | Oregon | No literal hit | — | 10 |
| 31 | R4 | Jennie | No literal hit | — | 8, 12 |
| 32 | R4 | Hot Springs | No literal hit | — | — |
| 33 | R5 | Portland | No literal hit | R4 | 8, 9, 10, 12, 13 |
| 34 | R5 | Portland | No literal hit | R4 | 8, 9, 10, 12, 13 |
| 35 | R5 | let it be understated | No literal hit | R4 | 12 |
| 36 | R5 | England | Yes (lexical only) | R1, R3 | 8, 9, 11, 12, 13 |
| 37 | R5 | Ramabai | No literal hit | — | 10, 13 |
| 38 | R5 | Zion City | No literal hit | — | 8, 9, 10, 13 |
| 39 | R5 | Romana | No literal hit | — | — |
| 40 | R5 | Virginia | No literal hit | R3 | 11 |

## Concrete source-version conflicts for faculty to inspect

1. **Q01 and Q04:** the public R1 prompts concern Spokane and Johnsonville, but those anchors appear in proposed **R3** (issue 11, missionary-report window), not the proposed R1 window (issue 11, international-spread window). The current CTS R1 digest cites missionary-report material from issue 11 and other issues; that is a different source contract.
2. **Q33–Q35:** the public R5 prompts concern the Portland reporting correction. The proposed **R4** window (issue 12) includes the Portland correction and its call for cautious reporting; proposed **R5** (issue 13) is a composite missionary-correspondence section about Egypt, Ceylon, Ireland, South Africa and Palestine. This is a direct **reading-assignment mismatch** if the proposed windows replace the CTS digests unchanged. Do not include the missing-word responses in public corrections.
3. **Q22 and Q40:** their visible anchors appear in a *different* candidate window, not their assigned one. Anchor evidence alone does not establish the full historical question's answer.
4. **Q16 and Q32** explicitly refer to developments later than the 1906–08 source corpus (later Assemblies of God policy and 1914 organizational founding). **Q39** invokes later historical synthesis concerning Mexico. These require an expressly assigned, rights-cleared historical context source or revised questions; they cannot simply be attributed to an early Azusa issue.
5. The current room's five digests include historiography, later developments and contextual summaries. The provisional five source windows total only 3,411 normalized words, have mixed contributors and no separate approved textbook. This is **not** five independent scholarly works, nor a completed five-reading package.

## Mexico and edition-rights gate — NOT clearance

The existing `books/A-C5/SOURCE.md` and contributor-specific R5 decomposition identify multiple named, jointly named, unsigned and institutional contributors. William J. Seymour's 1922 death does **not** establish rights for all their work. Mexico's LFDA Art. 29 life-plus-100-years framework, joint authorship, anonymous works, translation rights, and modern reproduction/editorial rights require item-by-item review. This audit did **not** authenticate each contributor, inspect original facsimile columns, obtain permissions, or issue legal clearance. The historical newspaper is not a blanket public-domain text for Mexican publication.

**EN faculty gate:** Keep the current digest version and existing earned credits unchanged while deciding whether PC5 is (a) a CTS historical-digest course, (b) five periodical close readings with carefully attributed voices, or (c) five independent author/work readings. Freeze the exact source version, then revise only the questions not supported by that approved version, using private accepted variants and synthetic grading tests.

**ES — puerta de revisión docente:** Mantener intactos los resúmenes actuales y los créditos ya obtenidos. Decidir si PC5 utilizará (a) cinco resúmenes históricos del STC, (b) cinco lecturas documentales de la misma publicación con atribución individual, o (c) cinco obras independientes. Registrar la versión exacta de las fuentes; después cotejar las 40 preguntas y validar las respuestas aceptadas **solo en el repositorio privado**. La antigüedad del periódico no constituye por sí sola autorización para reproducir o traducir todas las contribuciones en México.

**FR — validation pédagogique:** Préserver les synthèses actuelles et les acquis des étudiants. Choisir explicitement entre (a) cinq synthèses historiques du CTS, (b) cinq extraits de la même revue avec attribution précise, ou (c) cinq œuvres indépendantes. Verrouiller la version documentaire, vérifier les 40 questions et contrôler les variantes de réponses **uniquement dans le dépôt privé**. La date ancienne de publication ne suffit pas à autoriser la reproduction ou la traduction de toutes les contributions au Mexique.

**Four-language grading:** The public bank contains EN/ES/FR/SW question text, but this alone does not prove that the server accepts native FR/SW answer variants. The generic English/Spanish instructions and French instructions should be checked against actual private accepted variants and synthetic durable pass/credit, not assumed correct.

## Recommended production-independent verification

- Claude/faculty: use this 40-row table as a **screen**, then collate the original facsimile page/column, author/byline, exact version and context for each retained question; label primary-source claims as claims. Resolve R5 multi-contributor rights separately.
- Claude/private-key owner: compare 40 public stems and reading assignments with the **private** bank without exporting answers. Run synthetic EN/ES/FR/SW grading and durable-credit tests, including the requiredFrom boundary. Keep PR #164 sending off.
- Future source-version preflight (report-only until approved): assert `course+reading_id+source_version+rights_status+question_bank_version` alignment; flag historical events after source dates and any missing language accepted-variant coverage. Never silently change assessment requirements, earned credit, or student records.
- Wayne/faculty must approve source selection, Mexican rights disposition, translation, assessment changes and release. No public-bank answers, grades, student data, production merge or deployment in this report.
