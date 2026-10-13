## Updated after English corrections (12 Oct 2026)

The English source was corrected in the beta PR. The matching French changes are below. The source snapshot (`-source.json`) was not updated; the corrected English is in the beta PR.

- **F2.9, b019** (new sentence, Paul a Pharisee): + « Il devint pharisien — selon ses propres paroles, plus tard : « j'ai vécu pharisien, selon la secte la plus rigide de notre religion » (Actes 26:5). » (LSG)
- **R1a, b021**: « des naufrages et la lapidation » → « des naufrages et une lapidation »
- **R1b, b036**: « les seize chapitres de sa lettre » → « le reste de sa lettre »
- **F1.5, b028** (name-order claim removed): « Remarquez l'ordre dans lequel Paul place les noms… « Christ-Jésus »… L'alpha et l'oméga. » → « Remarquez comment Paul nomme son Maître. « Jésus » est son nom humain ; « Christ » — l'Oint, le Messie — est son titre… » + Romains 1:3-4 (LSG)
- **F1.5, MC 10 stem**: no change needed; the French already read « de Jésus-Christ ».
- **F1.5, SA 9 prompt**: « Comment Paul utilise-t-il les deux ordres de noms… » → « Comment la salutation de Paul (1:1-7) présente-t-elle à la fois l'humanité et la divinité de Jésus-Christ ? »
- **F1.5, SA 9 model**: alpha/oméga model → « « Jésus » est le nom humain du Sauveur ; « Christ » est son titre… né de la postérité de David, selon la chair… déclaré Fils de Dieu avec puissance… »
- **F1.5, SA 9 keywords** (rule 10, the model no longer fits alpha/oméga): now david/postérité · chair · fils de dieu · résurrection · puissance · déclaré · messie/titre · homme complet/Dieu complet. Model hits 8 of 8; prompt 0.

## Questions for Wayne

1. **Romans 1:1, "bondservant".** Segond has "serviteur de Jésus-Christ". In b027 I quoted Segond and added: "Le mot grec doulos, traduit ici par « serviteur », signifie littéralement « esclave »". Fill 8 uses the answer "serviteur" and also accepts "esclave". MC10's option reads "serviteur, ou esclave (doulos)". SA7 keyword groups include both "esclave" and "propriét/achet".
2. **Romans 1:1, "separated to the gospel".** Segond has "mis à part pour annoncer l'Évangile de Dieu". The lesson's point (consecrated, set apart) still works. In b028, MC16 and Fill 9, "mis à part" means "consacré". Fill 9 accepts "consacré", "sanctifié", "dédié" and "consacrée".
3. **Romans 1:17, "from faith to faith".** Segond has "par la foi et pour la foi". I quoted Segond in b017, b030 and b032. In b032 I added: "le texte grec dit littéralement « de foi en foi »". The lesson reads the phrase as "starting point and finishing line". I kept that reading neutral, without adding any claim either way about perseverance.
4. **Romans 1:16, "the gospel of Christ".** Segond has only "l'Évangile". "Power of God to salvation" is "une puissance de Dieu pour le salut", and "for the Jew first and also for the Greek" is "du Juif premièrement, puis du Grec". MC11 and MC12 follow Segond.
5. **Galatians 1:14, "exceedingly zealous" (b019).** I used Segond's "animé d'un zèle excessif".
6. **b033, "The faith that receives it is itself a gift."** I translated this faithfully as "La foi qui la reçoit est elle-même un don". Some readers may take this sentence in a Calvinist sense, as faith given only to the elect. It sits beside the CTS guardrail "faith then new birth". Do you want to keep it as it stands, or soften it, for example to "même la foi est rendue possible par la grâce"?
7. **Names.** I used Segond's spellings "Phoebé" and "Cenchrées". Fill 7 also accepts "Phébé".

## Problems in the English source

1. **b028, "Jesus Christ" vs. "Christ Jesus".** The lesson says that the salutation (1:1-7) moves from "Jesus Christ" at the start to "Christ Jesus" at the end. That is not true of the NKJV, which ends with "the Lord Jesus Christ" in 1:7. It is not true of Segond either, which has "Jésus-Christ" throughout. "Christ Jesus" appears in 1:1 only in critical-text versions. MC10's stem also says "of Christ Jesus", while b027 says "of Jesus Christ". SA9 depends entirely on this point. I translated b028 and SA9 as written. In MC10 I wrote "Jésus-Christ" to match Segond 1:1.
2. **MC9.** The stem asks for Paul's name "before his conversion". In Acts he is still called Saul until 13:9, years after his conversion. The `why` also teaches that Paul was his Greek/Roman name, which the lesson never says. I translated it as written.
3. **SA1 keyword "Pharis" and model "zealous Pharisee".** The lesson never calls Paul a Pharisee. In French I replaced that group with "persécut", and the model draws only on the lesson. **Updated 12 Oct 2026:** b019 now teaches it (Acts 26:5); the French keywords were left as they are.
4. **SA4 keyword "tower".** The lesson does not mention Luther's "tower experience". I replaced it with "terrifi/peur/crainte" (b014). "faith" and "earn" became broader groups ("par la foi/confian…", "mérit/gagn").
5. **SA10 keyword "justif".** The lesson text never uses "justification". I replaced it with "réveil" (b035). "systemat" now also accepts "argument" and "ligne par ligne" (b016).
6. **SA7.** The groups "ownership" and "owns" are the same idea. I split them into "propriét" and "ne possède rien", and added "maître" and "légal".
7. **b021, "stonings" (plural).** Paul was stoned once (2 Corinthians 11:25). I rendered it as "la lapidation". **Updated 12 Oct 2026:** now « une lapidation », matching the corrected English.
8. **b036, "the next sixteen chapters".** Only fifteen chapters follow chapter 1. I wrote "les seize chapitres de sa lettre". **Updated 12 Oct 2026:** now « le reste de sa lettre », matching the corrected English.
9. **SA groups generally.** I made the French groups 8 distinct ideas, with stems taken from the lesson, following convention 10. No French prompt reaches more than 2 hits. Each model reaches 7 or 8. The validator's one warning is the keyword "57", a date that cannot reasonably collide, so it is a false alarm.

## Adaptations

- "AD" became "apr. J.-C.".
- b015: "Georgia" became "en Géorgie, une colonie anglaise d'Amérique", so that readers do not think of the country in the Caucasus.
- b016: "detonating in human hearts" became "éclater comme une bombe dans le cœur des hommes".
- b028: "He was drafted" became "Il a été enrôlé d'office".
- b043: "Catalog / Catálogo" became "Catalogue".

## French glossary used

| English | French |
|---|---|
| Romans (book) | l'épître aux Romains |
| bondservant (doulos) | serviteur (LSG); littéralement « esclave » |
| separated / set apart | mis à part (LSG); consacré |
| righteousness of God | la justice de Dieu |
| from faith to faith | par la foi et pour la foi (LSG); « de foi en foi » |
| The just shall live by faith | Le juste vivra par la foi |
| gospel | l'Évangile |
| Greek / Gentile | Grec / non-Juif |
| deaconess | diaconesse |
| house churches | Églises de maison |
| revival | réveil |
| heart strangely warmed | cœur étrangement réchauffé |
| Reformation | la Réforme protestante |
| missionary journey | voyage missionnaire |

## Checker's changes

- Scripture: every quotation checked against the offline Segond (Romains 1:1, 1:16-17; Habacuc 2:4; Galates 1:14; Actes 9:4-5; also the allusions to Actes 2:10, Romains 1:8, 16:1). All were already exact; no corrections needed.
- b014: removed the drafter's added hedge ("l'escalier que l'on disait venir du prétoire de Pilate") and restored the English's direct statement, "l'escalier du prétoire de Pilate" (old Question 7 withdrawn).
- MC15: reworded the stem into natural French ("Qui a vécu le moment du « cœur étrangement réchauffé »… ?"); options and order unchanged.
- Soteriology check: b030-b033, MC8, SA3, SA8 follow the English without adding any claim about election or perseverance. b033's "La foi qui la reçoit est elle-même un don" is a faithful rendering; Question 6 stays open for Wayne.
- Exams rechecked: MC keys and order intact; fill answers all findable in the French lesson; no SA prompt reaches 3 of its own keywords, and every model reaches at least 5. The validator's one warning (SA2 keyword "57") is a false alarm.

