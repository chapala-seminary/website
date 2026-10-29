# D-C3 — beta 40 public reading prompts versus staged 1647 Westminster source: version-identity crosswalk

**28 October 2026 · faculty research only · no production, grade, examination, or rights authorization**

## Exact witnesses independently fetched

- **Current beta reading-test prompts:** `src/content/readings/elecrefthreereadings.json`, blob `25128a13c8f4fa26cc62e150dd93f539490b38b4`. Exactly **40 public prompts**, eight per reading, with EN/ES/FR/SW prompt fields present 40/40 each (presence, **not translation quality**). `draw:20`, `pass:18`, `perReading:4`, `keys:"private"`; private bank declared as `assessment-keys/readings-src/elecrefthreereadings.bank.json`. No answer keys fetched or published. `requiredFrom:2026-10-28T06:00:00Z` is a configured date, **not proof of the live Worker or a particular student's effective requirement**.
- **Current beta textbook:** `src/content/textbooks/elecrefthree.json`, blob `fd235a8536a12870fed6f2004f73a8567c2d5b53`. English body has **five editorial sections**: WCF original chapters 1–6, 7–13, 14–22, 23–33, followed by **all 107 Westminster Shorter Catechism questions**. It is **not** the same source package as the staged research textbook. EN/ES/FR/SW bodies exist; credits explicitly label ES/FR as CTS machine-assisted drafts, not faculty-certified source translations. Beta textbook public test also has 40 stems, separate from the reading test.
- **Nonproduction research source:** `books/D-C3/SOURCE.md` blob `0cdafb007811fb01d665f1b679c528ecf15f4379`; staged textbook `books/D-C3/textbook.md` blob `687486996cb4c2f176d40ca6823c5858a701aae4`. The five staged readings are **only** WCF chapters 1–5, 6–12, 13–18, 19–26, 27–33, respectively; they do **not** contain the Shorter Catechism or historical contextual digest. Staged reading blob SHAs: R1 `2c570321f3632c65a49b174881c3c8a87d3ffaa9`; R2 `fe1aecacf18fa69acac5db53fb8c4942e39cb91f`; R3 `fc9fec82032a214f828db13d8290fec2bfa07f41`; R4 `8936a5e99c955d3bb813ca43cda7bfdaabcec932`; R5 `c7219d68f6e9276ffb78e600f53ee9b8288baaf8`.
- Existing staged containment audit `INDEPENDENCE_AND_FIVE_VOICE_GATE.md` reports each reading approximately 99% contained in the staged textbook. The present crosswalk addresses a **different** question: whether each *current beta public prompt* can be answered from the *proposed WCF-only staged reading*.

## Classification and result

**P** = directly supported by the assigned staged WCF section; **M** = source anchor exists but prompt adds an interpretive label or later-history claim; **X** = staged WCF-only reading does not establish the requested fact. These are **evidence-location classifications, not judgments of theological truth, correct answer, or current live-exam fairness**.

**Total: 20 P, 4 M, 16 X**. By reading: R1 3P/1M/4X; R2 4P/0M/4X; R3 5P/1M/2X; R4 4P/2M/2X; R5 4P/0M/4X. In all, **16 of 40** public stems need context **outside** the proposed WCF-only readings, and **four more** mix WCF content with a contextual or interpretive element. A historical CTS digest **may** teach that context; the actual student reading-room content was **not** inspected in this audit. Therefore do not claim that existing students are being tested on unread material.

| # | Reading | Public prompt topic (paraphrased; no answers) | Class | Evidence / reason |
|---:|:---:|---|:---:|---|
| 1 | R1 | First meeting of Westminster Assembly | X | Assembly history, not WCF text |
| 2 | R1 | Solemn League and Covenant (1643) | X | Historical context, not WCF text |
| 3 | R1 | Dissenting Brethren | X | Assembly membership history |
| 4 | R1 | Irish Articles / James Ussher | X | Historical influence, not WCF text |
| 5 | R1 | Good and necessary consequence | P | WCF 1.6 |
| 6 | R1 | Vernacular Bible translation | P | WCF 1.8 |
| 7 | R1 | Supreme Judge / Spirit speaking in Scripture | P | WCF 1.10 |
| 8 | R1 | Passing by / term reprobation | M | WCF 3.7 says pass by; doctrinal label requires gloss |
| 9 | R2 | Federal theology / Latin foedus | X | Terminology/etymology outside WCF |
| 10 | R2 | Voluntary condescension by covenant | P | WCF 7.1 |
| 11 | R2 | Covenant of works | P | WCF 7.2 |
| 12 | R2 | Shorter Catechism: covenant of life | X | Catechism absent from staged WCF-only five readings; present in beta textbook |
| 13 | R2 | Covenant of grace called testament | P | WCF 7.4 |
| 14 | R2 | Johannes Cocceius 1648 publication | X | Later historical bibliography |
| 15 | R2 | Herman Witsius 1677 publication | X | Later historical bibliography |
| 16 | R2 | Faith as sole instrument of justification | P | WCF 11.2 |
| 17 | R3 | Sanctification: irreconcilable war | P | WCF 13.2 |
| 18 | R3 | Saving faith: receiving and resting | P | WCF 14.2 |
| 19 | R3 | Faith as an empty hand | X | Interpretive metaphor, not source wording |
| 20 | R3 | Repentance as evangelical grace | P | WCF 15.1 |
| 21 | R3 | Term supererogation | M | WCF 16.4 has supererogate; technical noun is interpretive |
| 22 | R3 | Unprofitable servants | P | WCF 16.4 |
| 23 | R3 | Assurance not essence of faith | P | WCF 18.3 |
| 24 | R3 | Marrow Controversy (1718–23) | X | Post-1647 Scottish history |
| 25 | R4 | Ceremonial law / church under age | P | WCF 19.3 |
| 26 | R4 | Judicial law / general equity | P | WCF 19.4 |
| 27 | R4 | God alone Lord of conscience | P | WCF 20.2 |
| 28 | R4 | Regulative principle label | M | WCF 21.1 supports principle, later label external |
| 29 | R4 | American revision of 1788 | X | Later revision history |
| 30 | R4 | Adopting Act (1729) | X | Later American Presbyterian history |
| 31 | R4 | Pope/Antichrist phrase and 1903 removal | M | 1647 WCF 25.6 supports historical phrase, 1903 removal external |
| 32 | R4 | Oath / mental reservation | P | WCF 22.4 |
| 33 | R5 | Sacraments as signs and seals | P | WCF 27.1 |
| 34 | R5 | Sacramental union | P | WCF 27.2 |
| 35 | R5 | Immersion not necessary | P | WCF 28.3 |
| 36 | R5 | Body not in, with or under bread | P | WCF 29.7 |
| 37 | R5 | Fencing the table | X | Later practice/explanatory terminology |
| 38 | R5 | Presbytery as governing body | X | Polity beyond explicit WCF 31 wording |
| 39 | R5 | Ashbel Green Simonton in Brazil (1859) | X | Nineteenth-century mission history |
| 40 | R5 | Horace Underwood in Korea (1885) | X | Nineteenth-century mission history |

## Source-identity and assessment gate

1. **Do not replace the beta reading-room materials with the staged WCF-only R1–R5 without a fresh question-to-approved-reading map.** The staged research source contains neither assembly history, later Reformed history, later missions history, nor the Shorter Catechism. In particular, R5 has four contextual stems outside its staged WCF text.
2. **Choose an academic model explicitly:** (a) five guided readings of the WCF, with questions confined to that primary text; (b) historical WCF readings **plus** separately assigned and page-cited context; or (c) five independent historical authors, as proposed in the earlier D-C3 five-voice gate. Do not silently substitute one model for another. The current beta textbook adds the Shorter Catechism, so even option (a) needs a separately documented textbook-versus-reading scope.
3. **Faculty evidence matrix before bank revision:** for each of 40 reading stems, identify approved EN source edition, section/page or assigned historical-digest paragraph, ES and FR source-equivalent passages, translation QA, and effective version/date. Include Swahili review separately if SW is offered. Do not infer that 40/40 language fields implies 40/40 semantic correctness.
4. **Private bank:** public question stems were read only. The private answer bank and answer correctness were **not** accessible or verified. Store any revised bank and evidence keys in `chapala-seminary/assessment-keys` only, with restricted review and no student records in the public repo. Preserve prior valid completions.
5. **Release governance:** this is a research-only handoff. No policy change, student exam requirement change, grade change, or production deployment is authorized. Issue #184 documents the wider Oct 28 activation-gate concern; confirm deployed Worker and exact effective test policy separately.

## Historical-source and Mexico-rights gate

The original 1647 Westminster documents are strong public-domain candidates, but the staged JSON transcription **has not been collated against the original 1647 scan** (see `SOURCE.md`). Do not treat upstream “public domain” metadata as a source-fidelity certification. Mexico's Ley Federal del Derecho de Autor, **Article 29** generally uses the author's life plus 100 years for economic rights; **Articles 78–79** separately protect original contributions in translations and adaptations. Current legal text: https://mexico.justia.com/federales/leyes/ley-federal-del-derecho-de-autor/ (last reform shown May 2026). Rights status is **preliminary**, not legal clearance; verify the historical edition, transcriber/editor additions, hosting terms, translation provenance and attribution before release.

## Original faculty notices (not translations of historical primary text)

**EN:** The current beta textbook combines the Westminster Confession and Shorter Catechism, whereas the proposed five research readings contain only the Confession. Of the 40 public reading-test prompts, 16 require external historical or contextual evidence and four mix primary-source material with additional terminology or chronology. Before replacing readings, approve one versioned syllabus and map each question to material actually assigned. This audit does not establish a defect in the current reading room.

**ES:** El libro de texto actual de beta reúne la Confesión de Westminster y el Catecismo Menor, mientras que las cinco lecturas de investigación propuestas contienen únicamente la Confesión. De las 40 preguntas públicas del examen de lecturas, 16 requieren información histórica o contextual externa y otras cuatro combinan el texto primario con terminología o cronología adicional. Antes de sustituir lecturas, apruébese una versión del programa y vincúlese cada pregunta con el material realmente asignado. Esta revisión no demuestra un defecto en la sala de lecturas actual.

**FR:** Le manuel actuel de la version bêta réunit la Confession de Westminster et le Petit Catéchisme, tandis que les cinq lectures de recherche proposées ne contiennent que la Confession. Parmi les 40 questions publiques de l'épreuve de lecture, 16 nécessitent des renseignements historiques ou contextuels extérieurs et quatre autres mêlent le texte primaire à une terminologie ou à une chronologie complémentaire. Avant toute substitution, il faut approuver une version précise du programme et rattacher chaque question à une lecture effectivement assignée. Cet audit ne démontre pas une défaillance de la salle de lecture actuelle.

**For Claude / faculty:** treat this as a source-identity **hold**, not a request to change live banks. First obtain actual assigned reading-room text and confirm whether the contextual stems are covered. Then bring Wayne a proposed source/version decision with page-cited evidence and rights review. No public answer keys, student data or deploy actions.
