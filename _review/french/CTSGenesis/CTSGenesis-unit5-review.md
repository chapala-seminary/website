## Questions for Wayne

1. **Short-answer keywords.** The English has `keywords_en: null` and placeholder models for all 10 SA items. Per convention 12, the French has 8 real keyword groups in `keywords` and a real model answer for each item (each model hits 8 of 8; each prompt hits 0).
2. **Hebrews 11:5, "translated" (b010, Fill 4).** Segond has "fut enlevé pour qu'il ne vît point la mort". Following convention 1, I quoted Segond and added "Le mot grec signifie littéralement « transporté »". Fill 4 answer: "enlevé". It also accepts "transporté", "pris", "emporté" and "enlevé au ciel".
3. **Genesis 8:21, "inclination of the human heart" (b014).** Segond has "les pensées du coeur de l'homme sont mauvaises". The lesson only alludes to the verse, so I wrote "les pensées du cœur de l'homme restent mauvaises".
4. **Genesis 5:24, "he was not, for God took him" (b002, b004, b009, Fill 2).** Segond: "puis il ne fut plus, parce que Dieu le prit". The heading reads « Dieu le prit ». Fill 2 answer: "prit".
5. **Genesis 5 refrain "and he died" (b004, Fill 1).** Segond: "puis il mourut". Fill 1 answer: "mourut".
6. **Genesis 6:8 (b012, Fill 5).** Segond: "trouva grâce aux yeux de l'Éternel", which matches the NKJV. Fill 5 answer: "grâce".
7. **Acts 2:11, "mighty works of God" (b028, MC16, SA8).** I used Segond's "les merveilles de Dieu".
8. **Names.** I used Segond's "Hénoc" from Genesis throughout. Segond's Hebrews 11:5 spells it "Enoch", and SA10 accepts both spellings. "Babel", "Abram/Abraham" and "Lémec" follow Segond.
9. **Masthead.** "Cours intensif sur la Genèse" (the form used in Units 2–4, 6, 10–12). Units 1, 7, 8 and 9 use other forms; the course needs one.

Checker re-verified all Scripture quoted in the French against the offline LSG: Gen 5:5 (refrain), 5:24, 6:8, 6:9, 11:4, 11:5, 12:2, 12:3; Heb 11:5; Acts 2:11; Matt 28:19. All exact; none needed correction.

## Problems in the English source

1. **SA1–10.** `keywords_en` is null and every `model` is the same template sentence, not an actual answer. The French has real keywords and models written from the lesson (see Question 1).
2. **MC1–20 `why`.** Each one only repeats the correct option. I translated them as they are.
3. **MC5, option C ("seventh from Adam").** This comes from Jude 14 and is never taught in the lesson. It is only a distractor, so the key is unaffected.
4. **MC1, option C ("built a city named after his son").** In Genesis 4:17, Cain built the city and named it after his son Enoch, a different Enoch. This could confuse students, but the key is right.

## Adaptations

None needed. "Platforms" (b032) became "tribunes", and "missions as an optional department" (b030) became "une activité facultative", because the French "département" means a government department.

## French glossary used

| EN | FR |
|---|---|
| walk with God | marcher avec Dieu / la marche avec Dieu |
| fellowship | communion |
| refrain of death | refrain de la mort |
| translated (Heb 11:5) | enlevé (grec « transporté ») |
| table of nations | table des nations |
| theological geography | géographie théologique |
| self-exaltation | exaltation de soi-même |
| proud autonomy | autonomie orgueilleuse |
| confusion and scattering | confusion et dispersion |
| redemptive reversal | renversement rédempteur |
| election / mission | élection / mission |
| channel of blessing | canal de bénédiction |
| the Fall | la chute |
| Great Commission | Grande Commission |

## Checker's changes

- Scripture: all quotations verified exact against LSG; no corrections.
- b012 / Fill 5: moved "d'abord" before the Segond quotation (it read as part of the verse); Fill 5 no longer accepts "grâce de Dieu" (ungrammatical in the blank).
- Fill 1: dropped "mourir"; Fill 9: dropped "descendre" (infinitives do not fit the sentence).
- SA4: name group narrowed to "faire un nom" phrases (bare "un nom" could match any answer).
- SA6: bare "grand" replaced with "nom grand"/"rendre grand" (it matched "grandeur", "grande tour").
- SA7: "abandon" group now needs the negation ("n'abandonne pas", "espérance") so a wrong answer saying God abandoned the nations doesn't score; "nations" group (in the prompt's topic) replaced with "bénédiction/bénies".
- SA8: "effac" and "uniform" groups now need the negation ("n'efface", "pas uniforme", "diversité") so the opposite claim doesn't score.
- Fill 6 has no alternates (technical two-word term; accents folded by grader) — validator warning accepted as a false alarm.
