# Twenty denominational electives — public-prompt language coverage and private-key shape audit

**28 October 2026 · research branch only · no changes to exams, grades, student records or production**

## Exact scope and method

Read the **beta** branch public JSON for all **20 elective reading tests** and **19 of 20 elective textbook tests**, across Baptist (5), Wesleyan (5), Pentecostal (5), and Reformed (5) traditions. The remaining textbook `src/content/textbooks/elecwestwo.json` returned no usable content through the connector; **its contents were not verified**. For each readable file, parsed `test.questions`, checked public prompt presence in `en`, `es`, `fr`, `sw`, inspected public question-object field names and the top-level `keys` marker. This is a **static source-shape audit**, not a translation-equivalence test, private-bank review, browser rendering test, deployed-worker audit, or legal clearance.

**Results for 39 readable files (1,560 public prompts):**
- Every readable file has **40** public questions; **1,560/1,560** EN, ES and FR prompt fields are nonempty.
- **1,555/1,560** SW prompt fields are nonempty: **five missing Swahili prompt fields** across five different tests. Two are reading banks and three are textbook banks.
- All 39 readable public JSON files declare `keys:"private"`. Public question objects contain only `prompt` plus `reading` (reading tests) or `chapter` (textbook tests), **no answer/correct-choice fields observed**. This does **not** verify the private key contents, key correctness, or whether keys leak elsewhere.
- Reading-test sources point to `assessment-keys/readings-src/*.bank.json`. The AI account's independent read of `chapala-seminary/assessment-keys` returned GitHub 404, so private bank integrity is **not verified**. Do not circumvent this access control.
- `requiredFrom` dates observed are either `2026-10-28T06:00:00Z` or `2026-10-29T06:00:00Z`. The latter appears on Pentecostal PC1, PC2, PC3 and PC5 reading/textbook tests; PC4 has the earlier date. Static dates do not establish the effective deployed requirement.

## Five exact SW omissions (public question identifiers only; **no answers**)

| Course | Public test | 1-based question | Group | Beta blob SHA | English stem topic, paraphrased |
|---|---|---:|---|---|---|
| D-C1 Reformed | `src/content/readings/elecrefonereadings.json` | **24** | Reading 3 | `1b50a4514d1145f94318286662e163b173926e6f` | Heidelberg Catechism: comfort in life and death |
| C-C2 Wesleyan | `src/content/readings/elecwestworeadings.json` | **27** | Reading 4 | `d6be0d44cd41d1a865aca4883fe35a6d53a5850d` | Repentance before faith; conviction/self-knowledge |
| D-C3 Reformed | `src/content/textbooks/elecrefthree.json` | **22** | Chapter 3 | `fd235a8536a12870fed6f2004f73a8567c2d5b53` | First day of week as the Lord's Day |
| C-C5 Wesleyan | `src/content/textbooks/elecwesfive.json` | **34** | Chapter 5 | `2567fd18439892bdcb78fbb4bd40658ca5879b76` | Wesley on house-to-house pastoral visitation |
| A-C4 Pentecostal | `src/content/textbooks/elecpcfour.json` | **27** | Chapter 4 | `6c61e85598346c0911de0568dcdf2ef9a14a13ef` | New-covenant access within the veil |

The five fields were absent/null, not merely mistranslated in a way this check could detect. A missing SW field may cause an English fallback or a blank prompt depending on the runtime; **neither behavior has been tested**, so do not claim a live student failure. In particular, do not fill these blanks automatically without matching each question to its private keyed response and its approved assigned source; inflected Swahili fill-in-the-blank answers may not match English keys.

## Concrete repair/acceptance gate for Claude and faculty

1. **Source/answer agreement:** identify each question's approved source paragraph, review its intended answer *inside the authorized private bank*, then produce a native-speaker-checked Swahili prompt with equivalent blank and grading normalization. Do not expose keys in the public PR, tracker, or issue comments. Preserve existing completions.
2. **Runtime QA:** for each of the five exact indices, exercise the SW student interface and the answer-validation path with synthetic test accounts, recording whether missing SW currently falls back to EN, blanks, or errors. Do not modify student data.
3. **Report-only CI first:** parse all 40 public elective JSON files; assert each has 40 questions, each question has a nonempty prompt in each *enabled* language, no answer-bearing fields in public objects, and every activated test has a documented source-version receipt. Run as a non-mutating audit initially, then propose a blocking check only with owner approval and green tests.
4. **Complete the blind spot:** obtain `elecwestwo.json` through a bounded authenticated read or local repo checkout; its size prevented a usable full-file connector response. Recompute counts after that file is inspected.
5. **Private review:** independently verify answer-key count, public prompt-to-private answer alignment, language equivalence, and no key exposure in the **private** assessment repository after legitimate access is granted. Current AI account gets GitHub 404. Do not change policy or deploy.

## Trilingual faculty notices (original editorial text, not source translations)

**EN:** A static review of 39 readable public elective test files found five missing Swahili question prompts; English, Spanish and French prompt fields were present for all 1,560 inspected questions. This does not demonstrate whether the student interface fails, nor does it validate answer keys. Please authorize a private answer/source review and native-speaker Swahili correction before changing any examination.

**ES:** Una revisión estática de 39 archivos públicos de exámenes de las materias optativas detectó cinco preguntas sin texto en suajili; los campos en inglés, español y francés estaban presentes en las 1.560 preguntas examinadas. Esto no demuestra un fallo en la interfaz del estudiante ni valida las claves de respuestas. Se requiere revisión privada de las respuestas y fuentes, y corrección por una persona competente en suajili antes de modificar cualquier examen.

**FR:** Un contrôle statique de 39 fichiers publics d'épreuves optionnelles a repéré cinq questions dépourvues de texte swahili ; les champs anglais, espagnols et français étaient présents pour les 1 560 questions examinées. Cela ne prouve pas une défaillance de l'interface étudiante et ne valide pas les corrigés. Une vérification privée des réponses et des sources, suivie d'une correction par une personne compétente en swahili, est nécessaire avant toute modification des épreuves.

**Governance:** PR #164 correspondence sending remains OFF. No private keys, identifiable student records, grades, exam-policy changes, or production changes were involved. This is a precise repair handoff, **not** approval to alter the examination content or requirements.
