# C-C1 / Wes1 — Current assigned-digest fairness, forty public stems, and language/source gates
**29 October 2026 · Independent nonproduction academic research · NO accepted answers, grades, student data, or legal approval**

## Scope and exact version witnesses
- Current `main` and `beta` public reading-test metadata: `src/content/readings/elecwesonereadings.json`, same Git blob `f42219daa4c483b44666fc7c4bd75fae7d685ef0`. Forty English, Spanish, French and Swahili public stems; eight per reading; `requiredFrom: 2026-10-28T06:00:00Z`; draw 20/pass 18. **The private accepted answers and server grading were not accessed.**
- Actually assigned student reading-room HTML: `src/body/rooms/CTSElecWes1Readings.html`, identical on `main` and `beta`, Git blob `88e27f03c86f003b88621b348728d8c56661ccaa`. Five full English and five full Spanish inline CTS digest blocks (`lang-en block dg-block` and `lang-es block dg-block`), each with numbered sections. No full `lang-fr block dg-block` or `lang-sw block dg-block` found in this static source; **runtime overlay, translation quality and grading parity were not tested**. The English room advertises French full digests, so the rendered French claim requires browser/native QA.
- Staged replacement source is a **different artifact**: provisional uncollated 1872 Jackson journal OCR windows in `books/C-C1`. Prior 28 Oct crosswalk found 20 within selected windows, 16 outside, four contextual; that **does not establish a defect in the existing CTS digest-based test**.

## Verified result and method
Each of the 40 public English question topics/blank-contexts was independently located in its **own currently assigned English CTS digest** (reading 1–5), with the section reference below. This is a **student-material witness**, not proof of correct private answer, facsimile quotation, date, historical truth, native-language equivalence, or live credit persistence. Of 40, **28** are straightforward digest narrative witnesses (D), **9** are retrospective/contextual CTS prose (C), and **3** have identifiable digest witnesses but need special source/wording review (R). No current English digest question is classified as absent on this pass. Preserve this distinction if the source changes.

| Public question # | Assigned CTS digest section | Class | Non-answer-bearing evidence / caution |
|---:|---|:---:|---|
| 1 | R1 §1 | C | Oxford circle and family background; retrospective CTS context. |
| 2 | R1 §1 | C | Oxford nickname and method; historical CTS context. |
| 3 | R1 §2 | C | Georgia founder and charitable-colony purpose; contextual history. |
| 4 | R1 §2 | D | Georgia-voyage purpose quoted in the digest. |
| 5 | R1 §3 | D | Voyage departure and ship in the digest. |
| 6 | R1 §4 | D | Moravian leader and ecclesial role in the digest. |
| 7 | R1 §5 | D | Storm contrast and singing in the digest. |
| 8 | R1 §5 | D | Moravian family response in the digest. |
| 9 | R2 §1 | D | Moravian pastor's question in the digest. |
| 10 | R2 §2 | R | Infant baptism is in the digest; the Prayer Book healthy-child rubric must not imply this infant was healthy; check journal facsimile. |
| 11 | R2 §4 | D | Yamacraw conversation and instruction-before-baptism in the digest. |
| 12 | R2 §3 | D | Language study and Jewish parishioners in the digest. |
| 13 | R2 §5 | C | Later end of Georgia slavery prohibition is CTS historical context. |
| 14 | R2 §5 | C | Later anti-slavery publication is CTS retrospective context. |
| 15 | R2 §6 | D | Savannah magistrate's family relationship in digest narrative. |
| 16 | R2 §6 | D | Sophia's marriage in digest narrative. |
| 17 | R3 §2 | D | Early February encounter with Moravian minister in digest. |
| 18 | R3 §2 | D | Instruction to preach faith in digest. |
| 19 | R3 §2 | D | Condemned-prisoner episode in digest. |
| 20 | R3 §4 | D | Fetter Lane small groups in digest. |
| 21 | R3 §4 | D | Charles Wesley's May spiritual experience in digest. |
| 22 | R3 §6 | D | May 24 society meeting location in digest. |
| 23 | R3 §6 | D | Luther preface and Pauline epistle in digest. |
| 24 | R3 §6 | D | Aldersgate experience and timing in digest. |
| 25 | R4 §1 | C | Earlier Whitefield field preaching is background to assigned March–June window. |
| 26 | R4 §2 | D | April 2 open-air preaching account in digest. |
| 27 | R4 §2 | D | First outdoor preaching biblical text in digest. |
| 28 | R4 §3 | C | Kingswood geographic/industrial context in CTS prose. |
| 29 | R4 §3 | R | Digest states 1739 publication; bibliographic distinction among sermon delivery, Bristol printing, London reprint still needs facsimile/edition check. |
| 30 | R4 §5 | D | Bristol Horsefair building and foundation in digest. |
| 31 | R4 §5 | D | Bath confrontation in digest. |
| 32 | R4 §6 | D | Global-parish statement in digest. |
| 33 | R5 §1 | D | Moravian minister and stillness teaching in digest. |
| 34 | R5 §1 | D | Means-of-grace controversy in digest. |
| 35 | R5 §2 | R | Digest contrasts opposing views on degrees of faith; verify negation/polarity across all languages and private variants. |
| 36 | R5 §2 | D | Lord's Supper teaching in digest. |
| 37 | R5 §3 | D | Fetter Lane departure statement in digest. |
| 38 | R5 §4 | D | Foundery relocation in digest. |
| 39 | R5 §6 | C | Later 1742 class organization is retrospective CTS context. |
| 40 | R5 §6 | C | Later 1743 Methodist rules are retrospective CTS context. |

### Highest-priority faculty review
1. **Q10 — infant-baptism wording:** the current CTS digest presents the Prayer Book rule for healthy children alongside the specific baptism. The staged journal audit records that this particular infant was **ill**. Distinguish a general rubric from a biographical claim; verify original diary and Prayer Book before changing any public question or translation.
2. **Q29 — printing chronology:** the current digest states a publication year, while source catalogs distinguish the Bristol edition, later London printing and sermon chronology. Verify the exact primary edition/page before treating the stem as source-certified. Do not change a previously graded item without a reviewed plan.
3. **Q35 — opposite doctrinal propositions:** the digest contrasts the minister's view with Wesley's view on degrees of faith. Native ES/FR/SW review must preserve the negative/positive distinction, and the private bank must independently test all accepted variants.
4. **Historical reach:** Q13, Q14, Q39 and Q40 are supported by CTS editorial narrative covering years outside the narrow staged journal windows. Keep `assigned_digest_version/section` and `original_or_context_source/printed_page` as **separate provenance fields**; never silently replace the current digest with a short OCR excerpt.
5. **Language parity:** 40/40 public stems contain EN/ES/FR/SW fields, but static full digest blocks inspected here are EN/ES only. A runtime translation system may provide more; no claim of live French/Swahili failure follows from static HTML alone. Require a real browser inspection of all five full digest bodies, native-language semantic checks and private synthetic receipt/grade/durable-completion tests.

## Rights and edition screening — not clearance
- WHDL catalog for *Works of John Wesley*, Vol. I identifies Wesley/Jackson, the journal period and an item-specific public-domain due-diligence note: https://tnu.whdl.org/en/browse/resources/9539 . The `books/C-C1/SOURCE.md` handoff identifies a 1872 Jackson edition, but exact scanned-page collation of the provisional OCR is outstanding.
- Official Mexican **Ley Federal del Derecho de Autor**, text current to **DOF 14 May 2026**, Article 29 states author life plus 100 years for economic rights; Articles 78–79 distinguish protected originality in derivative works and translations: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFDA.pdf . Wesley (d. 1791) and Jackson (d. 1874) are favorable preliminary original-author/editor candidates. This does **not** clear modern translations, independently authored notes, quotations, facsimile-specific material or third-party rights. No legal/faculty signoff is implied.
- Existing five journal reading windows are not five independent authorial perspectives, and their chronology has omissions. Faculty must choose whether the academic requirement is **five CTS historical digests** or **five source readings** and verify workload, fair assessment and copyright before replacement.

## EN / ES / FR faculty handoff (draft internal guidance)
**EN:** All forty current English reading-test topics can be located in their presently assigned CTS digests. This does not certify the provisional Jackson OCR extracts as substitutes, nor the private accepted answers or other-language grading. Preserve the current materials and earned credit while the three flagged stems, source pages, language delivery and rights are reviewed.

**ES:** Los cuarenta temas del examen actual en inglés aparecen en los resúmenes del STC que los estudiantes tienen asignados. Esto no certifica que los extractos provisionales del diario de Wesley puedan sustituirlos, ni valida las respuestas privadas o la calificación en otros idiomas. Conserven las lecturas actuales y los créditos obtenidos mientras se revisan las tres preguntas señaladas, las páginas originales, los idiomas y los derechos.

**FR:** Les quarante sujets de l'épreuve actuelle en anglais sont présents dans les synthèses du CTS actuellement attribuées aux étudiants. Cela ne certifie ni le remplacement par les extraits OCR provisoires du journal de Wesley, ni les réponses privées ou la notation dans d'autres langues. Préserver les lectures actuelles et les crédits acquis pendant l'examen des trois questions signalées, des pages originales, des langues et des droits.

## Next gated work
- Faculty: validate Q10/Q29/Q35 and all retrospective historical citations against primary/secondary printed pages, decide digest-versus-source pedagogy and academic workload.
- Claude: inspect **rendered** French/Swahili reading rooms; run report-only source-version/language-parity checks; do not edit student-facing tests or requirements without approval.
- Private assessment-key custodian: validate accepted-answer aliases and explanations, language normalization, and synthetic M.Div./Th.M. test receipt/durable credit/idempotency. No keys in this branch or tracker.
- Legal/source editor: original 1872 page collation and rights review for every derivative/translation/quoted contributor.
- No merge, deployment, email send, source substitution, grade change, or student-record edit authorized by this report.
