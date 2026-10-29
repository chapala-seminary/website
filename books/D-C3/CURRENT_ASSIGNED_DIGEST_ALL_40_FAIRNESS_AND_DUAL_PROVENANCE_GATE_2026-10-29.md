# D-C3 — CURRENT assigned reading-room versus all 40 public questions: student-fairness and source-identity gate

**29 October 2026 · academic research only · no student records, keys, rights approval, policy change or deployment**

## Independent source snapshot and scope

- Main and beta `src/body/rooms/CTSElecRef3Readings.html` have the same Git blob **`58586470ec05866095c3ea4fbb7c7461f81cc27f`**. It contains five **current CTS-authored digests** (not the staged replacement Westminster excerpts), with five inline English and five inline Spanish digest blocks.
- Main and beta public reading-test manifest `src/content/readings/elecrefthreereadings.json` share blob **`25128a13c8f4fa26cc62e150dd93f539490b38b4`**: 40 public fill-in prompts, 8 per reading, EN/ES/FR/SW prompt fields present 40/40; draw 20, pass 18, four per reading; private answer bank not accessed. `requiredFrom=2026-10-28T06:00:00Z` is configured, but does not prove live Worker enforcement.
- French room overlay `src/data/french-readings/room/CTSElecRef3Readings.json` blob **`40c833bd00ab5eb3704ebfc7021bc54667c03f58`** has 189 entries, **all marked `tr.fr.status=machine`**. Swahili room overlay `src/data/interface/rooms/sw/CTSElecRef3Readings.json` blob **`590f7add3de37753d85a62392367516b80ce6711`** contains five blocks. Presence is not native-language accuracy or grading proof.
- The **previous** nonproduction crosswalk `books/D-C3/BETA_40_PROMPTS_VS_STAGED_WCF_ONLY_SOURCE_CROSSWALK_2026-10-28.md` blob **`5e87e6ba77812bdab544c5d78df0fdd40cc15b56`** classified proposed Westminster-only excerpts as 20 P / 4 M / 16 X. It explicitly did **not** inspect the actual CTS reading room. This report closes that narrow evidentiary gap, without claiming original-source collation or answer verification.
- Live site fetch attempted on 29 October but failed (cache miss); **the deployed page, individual student assignment, runtime enforcement and grading remain unverified**.

## Result: current English assigned digests cover all 40 public question topics

Parsed each of the five **actual assigned English digest bodies** separately, compared all 40 public English question topics with their assigned reading, and located the requested information or completion wording in the relevant digest section. **39 of 40 were located through explicit phrase/topic searches; Q36 was manually checked against the exact discussion in Reading 5, section 3** (punctuation differs from the initial automated search). All 40 have a topical/blank-phrase witness in their assigned **current** English digest. This is **not** a check of the private answer bank, grading aliases, factual accuracy of the historical claims, or ES/FR/SW equivalence.

The table deliberately omits answer words, exact fill-in phrases, and student identifiers. The P/M/X column describes **only the proposed WCF-only replacement source**, not the current digest: **P** = primary Westminster text supports it; **M** = primary text plus interpretive/historical context; **X** = absent from the proposed WCF-only excerpt.

| Public question | Assigned digest | Current English digest section | Proposed WCF-only class | Current assigned-English-digest evidence |
|---:|:---:|:---:|:---:|---|
| 1 | R1 | §1 | X | English digest witness located |
| 2 | R1 | §1 | X | English digest witness located |
| 3 | R1 | §1 | X | English digest witness located |
| 4 | R1 | §2 | X | English digest witness located |
| 5 | R1 | §3 | P | English digest witness located |
| 6 | R1 | §3 | P | English digest witness located |
| 7 | R1 | §3 | P | English digest witness located |
| 8 | R1 | §5 | M | English digest witness located |
| 9 | R2 | introduction | X | English digest witness located |
| 10 | R2 | §2 | P | English digest witness located |
| 11 | R2 | §2 | P | English digest witness located |
| 12 | R2 | §2 | X | English digest witness located |
| 13 | R2 | §3 | P | English digest witness located |
| 14 | R2 | §4 | X | English digest witness located |
| 15 | R2 | §4 | X | English digest witness located |
| 16 | R2 | §6 | P | English digest witness located |
| 17 | R3 | §1 | P | English digest witness located |
| 18 | R3 | §2 | P | English digest witness located |
| 19 | R3 | §2 | X | English digest witness located |
| 20 | R3 | §3 | P | English digest witness located |
| 21 | R3 | §4 | M | English digest witness located |
| 22 | R3 | §4 | P | English digest witness located |
| 23 | R3 | §6 | P | English digest witness located |
| 24 | R3 | §6 | X | English digest witness located |
| 25 | R4 | §1 | P | English digest witness located |
| 26 | R4 | §1 | P | English digest witness located |
| 27 | R4 | §2 | P | English digest witness located |
| 28 | R4 | §3 | M | English digest witness located |
| 29 | R4 | §2 | X | English digest witness located |
| 30 | R4 | §2 | X | English digest witness located |
| 31 | R4 | §6 | M | English digest witness located |
| 32 | R4 | §4 | P | English digest witness located |
| 33 | R5 | §1 | P | English digest witness located |
| 34 | R5 | §1 | P | English digest witness located |
| 35 | R5 | §2 | P | English digest witness located |
| 36 | R5 | §3 | P | English digest witness located |
| 37 | R5 | §3 | X | English digest witness located |
| 38 | R5 | §4 | X | English digest witness located |
| 39 | R5 | §6 | X | English digest witness located |
| 40 | R5 | §6 | X | English digest witness located |

**Reconciliation:** 20 P + 4 M + 16 X = 40 proposed-source classifications; **40/40 current-English-digest witnesses**. The earlier proposed-source mismatch must **not** be reported as a demonstrated current-student unfairness or live examination defect. The distinction is important: a student can reasonably be assessed on an assigned CTS historical digest even where the underlying 1647 confession does not contain the later historical event. However, the CTS historical assertions still require **page-addressable scholarly citations** before they can be treated as independently authenticated primary-source facts.

## New practical quality control: two separate provenance columns

For each examination stem, maintain **(A) the exact paragraph/section in the student-assigned reading version** and **(B) the original historical-source edition/page or a clearly labeled CTS secondary-history citation**. These must never be conflated. A student-fairness preflight can validate A automatically before a new reading version is activated; scholarly source review validates B separately. A question that passes A but lacks B is a **citation-quality hold**, not automatically an exam fairness failure. A question that fails A is a **source-substitution fairness hold** until faculty approve a new reading or question. The private bank's accepted answers/aliases must be version-pinned to the same A contract.

A report-only CI checker can compare `question_id -> assigned_reading_version -> digest_section`, detect missing or moved coverage, and separately report source originality, translator provenance, historical-era mismatch, and textbook-to-reading containment. Do not automatically change a question, grant credit, alter requirements or block existing students on the basis of this research report.

## Source, Mexico-rights and four-language gate

The original 1647 Westminster documents are strong public-domain candidates under Mexico's general **life plus 100 years** economic-rights term (LFDA Art. 29). **Derivative original contributions**, including translations and editorial adaptations, require separate analysis (LFDA Arts. 78–79). Official statute: https://www.diputados.gob.mx/LeyesBiblio/pdf_mov/Ley_Federal_del_Derecho_de_Autor.pdf . Neither the 1647 facsimile nor the upstream JSON transcription was independently page-collated in this run. Do not infer that a current machine translation, website annotation or scanned edition has been legally cleared.

The English digests are CTS-authored and assigned; their historical notes (especially post-1647 history, revisions, missionary biographies and confessional terminology) have not been traced to named scholarly pages. English coverage does **not** establish Spanish/French/Swahili semantic equivalence. French overlay entries explicitly indicate machine status; Swahili block presence does not establish native review. The public test's four-language prompt presence does **not** prove that the private bank accepts equivalent answers in those languages or that server receipt/credit works. Any revisions to source text, translated versions, answers, or student-facing instructions require faculty and Wayne approval.

## Original faculty notices (editorial guidance, not a translation of the historical source)

**EN:** The current English reading room covers the topics tested by all forty public D-C3 reading questions. The earlier 20/4/16 mismatch concerns only the proposed Westminster-only replacement, not the assigned CTS digests. Do not replace the assigned readings without an approved question-to-reading-version map. Independently document historical sources and review the translations and private grading bank.

**ES:** La sala de lecturas actualmente asignada en inglés cubre los temas de las cuarenta preguntas públicas de D-C3. La discrepancia anterior (20/4/16) corresponde únicamente a los extractos propuestos de la Confesión de Westminster, no a los resúmenes del CTS ya asignados. No se deben sustituir las lecturas sin aprobar un mapa de preguntas y versiones. Deben documentarse las fuentes históricas y revisarse las traducciones y el banco privado de calificación.

**FR:** La salle de lecture actuellement assignée en anglais couvre les thèmes des quarante questions publiques de D-C3. L'écart précédent (20/4/16) concerne uniquement les extraits proposés de la Confession de Westminster, et non les résumés du CTS déjà assignés. Il ne faut pas remplacer les lectures sans approuver une correspondance entre questions et versions. Les sources historiques, les traductions et la banque privée de correction restent à vérifier.

## Authorized next steps / holds

1. **Claude and Reformed faculty:** preserve the current digests and all valid historical completions; choose explicitly between (a) one Westminster close-reading model, (b) Westminster plus separately assigned CTS historical context, or (c) five genuinely independent authors. No silent substitution.
2. **Source editor:** original-facsimile collation, exact edition/section and rights provenance, with named scholarly sources for later historical context; validate ES/FR/SW against English and Scripture citations.
3. **Private-key owner only:** version-pin 40 public stems to 40 private answer records and approved source sections; test EN/ES/FR/SW accepted variants, synthetic server receipts and durable completion. Never publish keys or use real student records in tests.
4. **Wayne/faculty:** academic/source/rights/policy signoff before any student-facing replacement or activation adjustment. This research report changes none of them. PR #164 sending remains OFF.
