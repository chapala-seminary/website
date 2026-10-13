# CTSGenesis Unit 6 — French draft review notes

Checker re-verified every quotation against the offline LSG (Gen 11:4; 12:1-4; 13:3-4, 13:10; 14:18-20, 14:23; 15:6, 15:17; Jos 24:2; Rom 4:3; Gal 3:8): all exact.

## Questions for Wayne

1. **Gen 12:2 "you shall be a blessing" (b002, b013, b014, b042, MC 6).** LSG: "tu seras une source de bénédiction". I quoted LSG and used "source de bénédiction" throughout; b014 adds "le texte hébreu dit littéralement : « tu seras bénédiction »".
2. **Gen 15:6 "he believed in the LORD, and He accounted it to him for righteousness" (b034, MC 16, Fill 9).** LSG: "Abram eut confiance en l'Éternel, qui le lui imputa à justice." b034 adds one sentence: the Hebrew verb means both believe and trust, and Paul cites it as "Abraham crut à Dieu, et cela lui fut imputé à justice" (Rom 4:3). Fill 9 answer "justice".
3. **Gen 15:17 "smoking oven and burning torch" (b036, Fill 10, SA 9).** LSG: "une fournaise fumante, et des flammes passèrent entre les animaux partagés". I quoted LSG and added "le texte hébreu dit littéralement « un four fumant et une torche de feu »". Fill 10 answer is LSG's "animaux partagés", also accepting "morceaux" (LSG 15:10), "moitiés", "pièces", "animaux".
4. **Gal 3:8 "preached the gospel to Abraham beforehand" (b038, MC 19).** LSG: "a d'avance annoncé cette bonne nouvelle à Abraham". Quoted LSG; added that the Greek verb literally means "announce the gospel beforehand".
5. **Gen 12:1 "land" (b008, Fill 2).** LSG: "le pays que je te montrerai". Fill 2 answer "pays", accepting "terre", "contrée", "territoire".
6. **Melchizedek "priest" (b030, MC 14, MC 18).** Segond's "sacrificateur du Dieu Très-Haut" (convention 4). "A tenth" rendered with LSG's "la dîme de tout".
7. **Gen 14:14 "household" (b028).** Rendered "les hommes de sa maison" (as the Spanish), not quoting LSG's "318 serviteurs".

## Problems in the English source

1. **SA 1–10 have no keywords (`keywords_en` null) and template model answers** (same in all 12 Genesis units). Per convention 12, the French `keywords` holds 8 groups per item and each `model` is a real answer written from the lesson.
2. **MC 10, option D "Offers Isaac on Mount Moriah".** LSG has "pays de Morija" (no "mont"); I wrote "sur une montagne du pays de Morija". Not an error, just noted.
3. **MC `why` fields** simply repeat the correct option; not wrong, but they add nothing.

## Adaptations

None needed; the unit has no US-specific examples.

## French glossary used

- call / calling → l'appel / la vocation
- blessing / to be a blessing → la bénédiction / être une source de bénédiction
- descendants → la descendance (LSG: postérité)
- patriarchal story → l'histoire des patriarches
- tents and altars → les tentes et les autels
- stranger and pilgrim → étranger et voyageur (Héb 11:13)
- God Most High → le Dieu Très-Haut
- priest → sacrificateur
- accounted for righteousness → imputé à justice
- covenant → l'alliance
- smoking oven / burning torch → fournaise fumante / flammes (LSG)
- gospel → l'Évangile / la bonne nouvelle

## Checker's changes

1. Review note on SA keywords corrected: the 8 groups are in `keywords` (convention 12); the old note about a `keywords_proposed` field was stale.
2. SA 1, 3, 4, 5, 8, 10: replaced groups that a wrong answer would hit ("mérit", "parfait", "paiement", "approuv", "salaire", "détail") with negated forms ("pas mérité", "pas un paiement", "n'approuve pas", etc.), so answers stating the opposite no longer score.
3. SA 5: "péché" group given unaccented forms; "famine" group swapped for "responsab" (the prompt's own theme). SA 4: "grâce" group narrowed to "initiative"/"grâce prend". SA 6: choice group narrowed to Abram's generosity.
4. SA 6, 9, 10: replaced weak/duplicate groups ("méchant", "obéissance", "favoris") with ideas from the lesson (nuance/NT view of Lot, God alone takes the commitment, redemption); SA 10 model reworded to hit them.
5. b036: dropped the added detail "chaque morceau étant placé vis-à-vis de l'autre" (not in the English).
6. Fill 4 keeps only "autel" as alternate (validator warning accepted: no other correct form exists).
7. Tested each SA with a plausible wrong answer: none reaches 3 hits; each model hits 8/8; no prompt hits more than 1.
