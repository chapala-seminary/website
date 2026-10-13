## Updated after English corrections (12 Oct 2026)

The English source was corrected in the beta PR. The matching French changes are below. The source snapshot (`-source.json`) was not updated; the corrected English is in the beta PR.

- **A6b, b020** ('official' -> 'governor'): « Le premier haut fonctionnaire romain converti » → « Le premier gouverneur romain converti »
- **F1.3, b021** (Name change at 13:13; Paul usually, not always, first): « Remarquez qu'à partir d'Actes 13:13 Luc cesse de dire « Barnabas et Saul » et commence à dire « Paul et ses compagnons ». » → « Remarquez qu'en Actes 13:13 Luc cesse de dire « Barnabas et Saul » et dit « Paul et ses compagnons ». Désormais, il nomme le plus souvent Paul en prem… »
- **A6a, b036** (Not 'first ecumenical council'): « est le premier concile œcuménique de l'histoire de l'Église. » → « est le premier concile de l'Église connu de l'histoire, près de trois siècles avant celui de Nicée, le premier des conciles œcuméniques. »
- **F1.3, MC 6 stem** (Stem asks what Luke calls the team at 13:13): « À partir d'Actes 13:13, Luc change la manière de nommer l'équipe. À partir de la Pamphylie, on les appelle : » → « En Actes 13:13, Luc nomme l'équipe d'une manière nouvelle, avec Paul à sa tête. Il les appelle : »
- **F2.17, SA 10 model** ('first journey' moved to the Cyprus clause): « Bar-Jésus tente d'arrêter le message à Chypre et il est frappé » → « Bar-Jésus tente d'arrêter le message à Chypre, pendant le premier voyage, et il est frappé »
- **F2.17, SA 10 model** (Split placed as the second journey began): « en produisant deux équipes au lieu d'une, sur ce premier voyage et au-delà. » → « en produisant deux équipes au lieu d'une au début du deuxième voyage. »

# CTSActs Unit 6 — French draft review

All quotations were checked against the offline LSG tool, and re-checked independently by the checker (all 21 quoted passages match Segond verbatim): Actes 13:1-13, 13:38-39, 13:46-48, 14:8-15, 14:18-23, 14:27, 15:1-2, 15:10-11, 15:19-20, 15:37-41, 16:1-5, 2 Timothée 4:11 (and 2 Timothée 1:5 for Loïs/Eunice).

## Questions for Wayne

1. **Acts 13:48, "appointed to eternal life" (b028, MC11, Fill 4, SA6).** Segond: "tous ceux qui étaient destinés à la vie éternelle crurent". I quoted Segond and added one sentence: the Greek says literally "établis (ou rangés) pour la vie éternelle". MC11's correct option is "Destinés (établis)".
2. **Acts 14:12, Zeus and Hermes (b031, b032, MC13).** Segond uses the Latin names: "Ils appelaient Barnabas Jupiter, et Paul Mercure". The prose keeps Zeus/Hermès and adds one sentence quoting Segond. MC13's correct option reads "Hermès et Zeus (Mercure et Jupiter dans Segond)". The distractor "Apollon et Mercure" now partly overlaps with Segond's correct name (Mercure). Should it be replaced with something like "Apollon et Arès"?
3. **Acts 15:2, "no small dissension" (b035).** Segond: "un débat et une vive discussion". I quoted this, then translated the lesson's note on *stásis*.
4. **Acts 15:39, "sharp contention" (b039).** Segond: "Ce dissentiment fut assez vif…". I added this quotation after the lesson's word *paroxysmos*. Exam items use "vif désaccord" / "vive contestation".
5. **Acts 14:8, "crippled from his mother's womb" (b031, MC12).** Segond: "boiteux de naissance". I used this in both places.
6. **Acts 15:19, "not trouble" (b037).** Segond: "qu'on ne crée pas des difficultés à ceux des païens…". I quoted it as is.
7. **"Gentiles."** I used Segond's "païens" throughout, with the gloss "c'est-à-dire les non-Juifs" at the first mention (b028). Acts 14:27 keeps Segond's "nations".
8. **Names.** These follow Segond: Manahen, Elymas (no accent), Perge (Fill 3 accepts "Perga"), Loïs, Silas (accepts "Silvain"), Barnabas (SA keywords also accept "Barnabé"). "John Mark" is "Jean-Marc" in the prose.
9. **Election wording (b028, SA6 model).** The English says "the Lord knows His own, and He calls them", and the SA6 model says the elect were chosen "before they ever responded" and "marked out for eternal life in advance". Read alone, this leans toward unconditional election. On the other hand, the model also grounds election in "foreknowledge". I translated it faithfully ("prescience souveraine et antérieure"). Does this fit CTS's conditional-election position?
10. **Fill 10.** The answer is "à genoux" ("missionary work begins on its knees"). The grader drops "à", so "genoux" is also accepted. It also accepts "en prière", "par la prière" and "dans la prière".
11. **Fill 6, "Judaizers".** I used "judaïsants" (accepts judaïsant, judaïseurs).
12. **b047, "by sinners alone".** This phrase is odd in English too. I rendered it literally: "par des pécheurs seulement". Did you mean "for sinners"?

## Problems in the English source

1. **SA keyword counts.** Eight of the ten SA items (all except SA6 and SA10) have only 5 `keywords_en` groups. Settled convention 10 asks for 8, but the validator errors if the French count differs from the English. I kept 5 distinct groups for each; the checker replaced generic groups (e.g. "paul", "église", "mission", "appel") with more distinctive ones. Robert: the English needs 8 groups (or the validator needs to allow it) before the French can follow convention 10.
2. **SA self-hits.** In the English, the prompt alone passes its own keywords in SA1, 3, 5, 6, 7, 8, 9 and 10. I reworded the French prompts so that none scores 3 hits (SA4 scores 1).
3. **b021.** "From Acts 13:13 onward Luke… starts calling them 'Paul and his party.'" This is overstated: Luke still says "Barnabas and Paul" at 14:12, 14:14, 15:12 and 15:25. MC6 depends on this claim. **Updated 12 Oct 2026:** corrected in the English (beta PR) and in the French; see the update section at the top.
4. **b036.** It calls the Jerusalem Council "the first ecumenical council in the history of the church". That title normally belongs to Nicaea (325). **Updated 12 Oct 2026:** corrected in the English (beta PR) and in the French; see the update section at the top.
5. **b020.** It calls Sergius Paulus "the first Roman official to convert in the Acts narrative". Cornelius the centurion (Acts 10) came earlier, though "official" can be read narrowly. **Updated 12 Oct 2026:** corrected in the English (beta PR) and in the French; see the update section at the top.
6. **b037.** "Old Camel Knees" and James "praying for Israel" come from Hegesippus (via Eusebius), not Scripture. "Senior pastor" is anachronistic. Translated as written.
7. **b024.** "Dying for the Lord" (Mark's martyrdom) is tradition, but the lesson states it as fact.
8. **b035.** It glosses *stásis* as "a riot". In Acts 15:2 the word means dissension.
9. **SA10 model.** It says the Paul–Barnabas split produced two teams "on this first journey". The split happened after the first journey, at the start of the second. Translated faithfully.
10. **SA3 / SA9 models.** These use facts the unit never teaches: Barnabas vouching for Paul in Jerusalem (Acts 9), and James being "respected even by unbelieving Jews".
11. **b049.** "Galatia" is used for Pisidian Antioch, Iconium, Lystra and Derbe without explanation (fine, just noting it).

## Adaptations

- "Three hundred miles" (b015) became "près de cinq cents kilomètres".
- "Malarial swamps" (b023) became "marécages… infestés de paludisme".
- The nickname "Old Camel Knees" became « Genoux de chameau ».
- The map colour "oxblood" became "rouge sang-de-bœuf".

## French glossary used

- Gentiles → païens (non-Juifs)
- Judaizers → judaïsants
- Jerusalem Council → concile de Jérusalem
- proconsul → proconsul
- sorcerer / magician → magicien
- laying on of hands → imposition des mains
- elders → anciens
- yoke → joug
- election / appointed → élection / destinés
- justified / forgiveness of sins → justifié / pardon des péchés
- tribulations → tribulations
- sharp contention → vif désaccord (Segond: dissentiment)
- mentor / protégé → mentor / disciple
- stoning → lapidation (lapider)

## Checker's changes

- Scripture: all quotations re-checked with the LSG tool; all verified, none corrected.
- b017: "reposent l'une sur l'autre, comme sur une pierre angulaire" (mixed image) → "se superposent… comme les pierres d'un angle de mur".
- b027: removed repeated "phrase… en une seule phrase"; b040: clearer rendering of "Paul wrote 2 Timothy asking for him".
- MC9 stem: reworded so the correct option reads naturally ("ce qui vous est annoncé, c'est :").
- SA1: "divers/origine" → diversit/afric/niger/cyrène (avoid generic "divers"/"origine").
- SA2: replaced generic "église", "appel", "mission" groups with église locale/imposition, ambition/illusion, humain/programme (the two dangers the lesson names).
- SA3: "paul" → "compagnons / barnabas et saul"; "tête" dropped from the leadership group (too common).
- SA4: "marc" → seconde chance/patience; "utile" → "m'est utile / utile pour le ministère" (so "Marc était inutile" no longer hits).
- SA5: "sermon/prédication" group → David/Israël/patriarches/Exode (the sermon's historical structure).
- SA6: duplicate "souverain" group → "responsabilit" (human responsibility, as the model says).
- SA7: "lystre" → popularité/opinion/plaire; SA8: "la loi/moïse" → grâce/fardeau; SA9: "concile" → respect/piété; SA10: "jérusalem" → aveugle/proconsul (Bar-Jésus episode).
- Tested each SA: model hits all groups (5 or 8), prompt hits 0, sample wrong answers hit at most 2.
