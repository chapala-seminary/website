# D-C3 — Westminster Confession: measured reading dependence and five-voice replacement gate

**Research only · 26 October 2026 · nonproduction branch · no release, rights, or academic approval**

## What was actually measured

Read six GitHub blobs at `handoff/book-sources/books/D-C3/`. Tokenization: Unicode NFKC, lowercase, split into consecutive letter/number tokens, ignoring punctuation and Markdown formatting. Each unique contiguous 12-token sequence in a reading was checked for exact membership among the textbook's unique 12-token sequences. Percentage = matching unique reading shingles / all unique reading shingles. This is **containment**, not a plagiarism verdict or a measure of theological agreement.

| File | Blob SHA | Normalized words | Unique 12-grams | Textbook containment |
|---|---|---:|---:|---:|
| textbook.md | `687486996cb4c2f176d40ca6823c5858a701aae4` | 12,184 | 12,173 | baseline |
| reading-1.md | `2c570321f3632c65a49b174881c3c8a87d3ffaa9` | 2,489 | 2,478 | **99.11%** |
| reading-2.md | `fe1aecacf18fa69acac5db53fb8c4942e39cb91f` | 2,392 | 2,381 | **98.99%** |
| reading-3.md | `fc9fec82032a214f828db13d8290fec2bfa07f41` | 1,911 | 1,900 | **98.89%** |
| reading-4.md | `8936a5e99c955d3bb813ca43cda7bfdaabcec932` | 3,434 | 3,423 | **99.36%** |
| reading-5.md | `c7219d68f6e9276ffb78e600f53ee9b8288baaf8` | 2,245 | 2,234 | **99.06%** |

All ten reading-to-reading comparisons shared exactly **48 unique 12-token sequences** (common front matter/provenance is a likely cause; this run did not attribute each shared shingle). Thus reading-to-reading uniqueness would **not** establish independence from the textbook. The existing `SOURCE.md` explicitly states that readings partition the same 33 Westminster chapters once each; measured files agree with that design. This is an **assessment-independence issue in staged materials**, not evidence of live-site release or wrongdoing. If Wayne decides a single-primary-source close-reading course is academically appropriate, its assessments must be represented honestly as analysis of one source, not as five independent historical readings. **Preserve previously valid completions.**

Reproduction sketch:
```js
const words = s => s.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
const shingles = (a,n=12) => new Set(Array.from({length:Math.max(0,a.length-n+1)},(_,i)=>a.slice(i,i+n).join(' ')));
const t = shingles(words(textbook));
const r = shingles(words(reading));
const containment = 100 * [...r].filter(x=>t.has(x)).length / r.size;
```

## Five **different historical voices** for independent readings (candidates, not approved selections)

All are **source leads**. Verify a **specific original edition**, original scan pages, faithful English transcription, attribution, and any hosted-site or derivative translation restrictions. Select one coherent **3,000–6,000-word passage** per source *where the work's length permits*; do not pad a shorter confession or catechism to manufacture word counts. A shorter whole primary document may require a separately approved exception or a longer distinct-author companion.

1. **R1 — John Calvin (1509–1564), *Institutes of the Christian Religion*, final Latin 1559; John Allen's historical English translation, 1813.** Candidate: Book I on revelation/Scripture and the knowledge of God, or Book III on justification; select one sustained chapter grouping, not stitched fragments. Source: Project Gutenberg #45001 (Vol. I), https://www.gutenberg.org/ebooks/45001 ; title-page text explicitly identifies Allen and 1813; later US reprint/editorial introductions must be separated. Compare Westminster chapters 1, 11. **Distinct Calvin voice; Calvin's influence on Westminster is historical, not textual independence guaranteed without shingle testing.**

2. **R2 — Guido de Brès (d. 1567), *Belgic Confession* (1561), 37 articles.** Candidate: articles 1–7 (God, revelation, Scripture) or 20–29 (Christ, church, marks of the church); check coherent original passage length. Original French and 1619 Dort revision are **not the same witness**. A contemporary website's declaration that a translation is public domain is not sufficient to establish its translator/edition. Historical 1877 Schaff *Creeds of Christendom* Vol. III is a promising dated translation/scan witness; compare its English to the 1561/1619 text and record which form CTS teaches. Historic scan: https://commons.wikimedia.org/wiki/File:The_creeds_of_Christendom_-_with_a_history_and_critical_notes_(IA_creedschristendo03scha).pdf . Do **not** import modern article headings, hyperlinks, or editorial commentary.

3. **R3 — Heidelberg Catechism (1563), traditionally associated with Zacharias Ursinus and Caspar Olevianus; commission under Frederick III.** Candidate: Lord's Days 1–7 (comfort, misery, deliverance), or a substantial contiguous question range on faith, justification, and gratitude; **do not claim sole Ursinus authorship**. An **1877 printed English tercentenary edition** has a page-indexed scan: https://en.wikisource.org/wiki/Index:Heidelberg_catechism.pdf (index presently marked *to be proofread*). A modern web presentation may contain unlicensed modernization or added Scripture links. Record edition, question numbers, print pages, actual word count, and authorship convention.

4. **R4 — Heinrich Bullinger (1504–1575), *Second Helvetic Confession*, written 1562, published/adopted 1566.** Candidate: chapters on Scripture, providence, covenant/church or ministry, with exact contiguous boundaries determined from the historical witness. The historical English translation in Philip Schaff's *Creeds of Christendom* is described as incorporating older 1586 English translation sections: https://en.wikisource.org/wiki/The_Creeds_of_Christendom:_with_a_History_and_Critical_Notes/Volume_III/Appendix:_The_Second_Helvetic_Confession . **Edition hazard:** this is an appendix of a later revised Schaff edition; verify actual printing date, contributor and original scan before copying; do not silently label it “1877 translation.”

5. **R5 — John Owen (1616–1683), *Of Communion with God the Father, Son, and Holy Ghost* (1657).** Candidate: an uninterrupted portion of Part I on communion with the Father, carefully distinguishing Trinitarian devotion from Westminster's confessional format. An original **1657 scan** is catalogued as a 324-page Wikimedia/Internet Archive microfilm witness: https://commons.wikimedia.org/wiki/File:Of_communion_with_God._1657_(IA_bim_early-english-books-1641-1700_of-communion-with-god_owen-john_1657).pdf . CCEL reading access https://www.ccel.org/ccel/owen/communion.html is **not** a reproduction license for its later edited formatting. Exclude any later appended response/preface unless independently identified.

**Editorial independence caution:** five authors/communities do not guarantee five independently developed doctrinal arguments. Heidelberg and Belgic overlap Calvin in tradition and categories. Compare actual selected passages against Westminster and against one another at 10- and 12-token levels; flag long exact quotation and shared proof texts. This audit is a *text* gate, not a replacement for faculty judgment about substantive independence.

## Original trilingual comparative teaching digest — editorial composition, NOT translated historical source

**EN:** Westminster's 1647 confession systematizes doctrine for a seventeenth-century English and Scottish church settlement. Calvin develops a sustained theological argument; de Brès explains the faith of a persecuted Reformed community; Heidelberg teaches through pastoral questions and answers; Bullinger presents a Swiss church's broad confession; and Owen turns confessional Trinitarian language toward prayer and communion. Their comparison can teach students to distinguish biblical claims, confessional definitions, pastoral application, and the politics of church establishment. Chapters 23 and 31 of the 1647 Westminster text require explicit historical treatment of civil-magistrate powers; CTS does not thereby endorse religious coercion.

**ES:** La confesión de Westminster de 1647 organiza la doctrina en el contexto de los acuerdos eclesiásticos ingleses y escoceses del siglo XVII. Calvino argumenta de forma sistemática; de Brès expone la fe de una comunidad reformada perseguida; Heidelberg enseña mediante preguntas pastorales; Bullinger presenta una confesión de las iglesias suizas; y Owen relaciona la doctrina trinitaria con la comunión espiritual. La comparación ayuda a distinguir la afirmación bíblica, la definición confesional, la aplicación pastoral y las circunstancias políticas. Los capítulos 23 y 31 de Westminster requieren una explicación histórica del poder civil, sin presentarlo como una política actual de CTS.

**FR:** La confession de Westminster de 1647 organise la doctrine dans le contexte ecclésial anglais et écossais du XVIIe siècle. Calvin développe un raisonnement théologique suivi; de Brès présente la foi d'une communauté réformée persécutée; Heidelberg enseigne sous forme de questions pastorales; Bullinger expose une confession des Églises suisses; Owen relie le langage trinitaire à la communion avec Dieu. Leur comparaison permet de distinguer les affirmations bibliques, les définitions confessionnelles, les applications pastorales et le contexte politique. Les chapitres 23 et 31 de Westminster demandent une contextualisation historique du rôle du magistrat civil, sans le présenter comme la position actuelle de CTS.

**Comparative prompts / Preguntas / Questions :**
- R1: How does Calvin's argument about Scripture relate to Westminster chapter 1? / ¿Cómo se relaciona su argumento sobre la Escritura con Westminster 1? / Comment son argument sur l'Écriture se compare-t-il au chapitre 1 de Westminster ?
- R2: What does a confession written under persecution emphasize about the church? / ¿Qué destaca una confesión redactada bajo persecución acerca de la iglesia? / Que souligne une confession rédigée dans un contexte de persécution au sujet de l'Église ?
- R3: How does catechesis differ from a doctrinal declaration? / ¿En qué difiere la catequesis de una declaración doctrinal? / En quoi le catéchisme diffère-t-il d'une déclaration doctrinale ?
- R4: Which church–state claims require historical context? / ¿Qué afirmaciones sobre Iglesia y Estado necesitan contexto histórico? / Quelles affirmations sur l'Église et l'État demandent une contextualisation ?
- R5: How does Owen apply Trinitarian doctrine to spiritual practice? / ¿Cómo aplica Owen la doctrina trinitaria a la práctica espiritual? / Comment Owen applique-t-il la doctrine trinitaire à la vie spirituelle ?

## Rights, source, and release decision ledger

- **Original-work age:** Calvin, de Brès, Ursinus/Olevianus, Bullinger and Owen died centuries ago; original works are strong candidates under Mexico's general life-plus-100 term and historical US publication rules. **Not legal clearance.** Modern translations, introductions, modernizations, editorial apparatus, scans subject to platform conditions, and third-party compilations must be screened separately. The 1877 Schaff edition contains later editions/reprint layers; use a dated scan with explicit bibliographic attribution, not a generic web copy.
- **Per reading required manifest fields:** work, historical author(s), original language, original publication year, exact print edition/year, translator/editor and their death dates where relevant, stable scan URL, scan provider terms, printed page start/end, file page start/end, excerpt start/end quotation anchors, word count, SHA-256 of exact source bytes, 10/12-token overlap report against textbook and other readings, translation provenance, EN/ES/FR editorial QA, Wayne academic and rights signoff.
- **Translation control:** make original ES/FR translations **only** from a verified lawful source witness; do not machine-translate a modern copyrighted translation. Keep exact biblical quotations and doctrinal terms reviewed by a qualified speaker. A trilingual *digest* is not a trilingual *source text*.
- **Assessment control:** do not create purportedly independent 40-question reading banks from the present Westminster slices. Once sources are approved, prepare one 40-question textbook bank and a separate 40-question five-reading set **in private `assessment-keys` only**, with traceable question-to-page mapping, checked answers, translation equivalence and encrypted/authorized handoff. No keys, grades or student data in public commits.
- **Migration control:** keep previously valid completions; compare staging with live beta before claiming student-facing impact. Do not alter main, production, certificates, or track requirements without Wayne.

## Handoff

**Claude:** first resolve Wayne's academic choice between one-primary-source close reading and genuinely independent five-voice readings; then collate one page-addressable candidate per voice and build the full lawful EN/ES/FR package. The candidates above are **not** approved and are not full texts. **Robert:** implement a report-only textbook-to-reading and reading-to-reading containment/manifest check on beta; do not treat a single-source partition as five independent books. **Wayne:** reserve the academic, copyright and release decision. **ChatGPT:** this file records exact staged blob measurements, five catalogued source leads and an original trilingual teaching frame, not full deliverables.
