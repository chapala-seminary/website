## Questions for Wayne

1. **Genesis 3:15 "seed".** Segond has "postérité". I quoted Segond and added one sentence in b025: "le texte hébreu dit littéralement « semence »". Fill 8 answer is "postérité"; it also accepts "semence", "descendance", "descendants", "lignée".
2. **Genesis 3:1 "Has God indeed said...?"** Segond: "Dieu a-t-il réellement dit...?" Used in b007 and Fill 1. Fill 1 answer is "interdiction"; it also accepts "défense", "restriction", "prohibition", "interdit".
3. **Genesis 3:4 "You will not surely die."** Segond: "Vous ne mourrez point". Fill 2 answer is "mourrez", so the blank sits inside Segond's wording. (Checker: removed the accepted forms "mourez" and "mourir", which are wrong in that slot.)
4. **Genesis 3:12–13.** NKJV "The woman whom You gave to be with me" / "The serpent deceived me". Segond: "La femme que tu as mise auprès de moi" / "Le serpent m'a séduite". b019 now says the serpent "a bien séduit Ève", to match Segond.
5. **Genesis 3:21 "tunics of skin".** Segond: "des habits de peau". Fill 9 answer is "peau"; it also accepts "peaux" and "peaux de bêtes".
6. **Wording choices.** "The Fall" = "la chute" (lowercase, as in common French usage). "God's Covering" in the title = "Dieu qui couvre". In b028, "the decisive provision for sin" = "la réponse décisive que Dieu apporte au péché", because the French "provision" would be an anglicism. In b023 and b033, "ministers" = "serviteurs de Dieu".

## Problems in the English source

1. **SA 1–10: `keywords_en` is null.** No English keyword list exists for any short answer in this unit (the same is true for all 12 Genesis units). I built 8 French keyword groups per question (convention 10). Each French model answer hits 8 of 8, and no French prompt hits more than 1. The current `validate.py` accepts this (no error). Robert will need the site to grade French keywords where the English has none.
2. **MC 17** asks about "Satan's recurring lies", but the lesson only ever says "the serpent". It never identifies the serpent with Satan. I translated it faithfully ("Satan").

## Scripture check

All Segond quotations checked with the offline LSG tool (Gen 3:1, 3:4, 3:9, 3:12, 3:13, 3:15, 3:21; Gen 3:5 for Fill 3): all verbatim. None needed correction.

## Adaptations

None needed. The unit has no US-specific examples.

## French glossary used

- the Fall → la chute
- shame / guilt → la honte / la culpabilité
- false shame / false guilt → fausse honte / fausse culpabilité
- covering / self-covering → couvrir / se couvrir soi-même
- autonomy → l'autonomie
- accountable agents → êtres responsables de leurs actes
- seed (Gen 3:15) → postérité (hébreu « semence »)
- garments/tunics of skin → habits de peau
- typological inference → déduction typologique
- atonement / substitution → expiation / substitution
- the last Adam → le dernier Adam
- new creation → la nouvelle création
- ministers → serviteurs de Dieu

## Checker's changes

- Fill 2: removed "mourez"/"mourir" from accepted answers (wrong in "Vous ne ____ point").
- Fill 3: removed "mauvais"/"maux" (Segond Gen 3:5 has "le bien et le mal"; the plural is wrong in the slot); prompt now matches b008's revised wording.
- b008 / Fill 3: "s'empare du droit" -> "cherche à s'arroger le droit" (English "reaches for", not "seizes").
- b029, MC 20 option C: "pourvoit pour" (anglicism) -> "pourvoit aux besoins de" / "pourvoit à leurs besoins".
- b020: "accepter la faute de ce que d'autres ont fait" -> "accepter d'être blâmé pour ce que d'autres ont fait" (clearer French).
- Validator now warns that Fills 2 and 3 have 0 alternates: false alarm, each slot has one correct form.
- Small wording: b004 colon removed (the list is all of Gen 1–2, not a gloss of "bonne"); b010 "le couple humain comme des machines" -> "l'homme et la femme comme des machines" (agreement); b006 heading and SA 1 prompt "Parole de Dieu" capitalized.
