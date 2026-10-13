# CTSGenesis Unit 1 — French draft review

## Questions for Wayne

1. **Acts 2 "mighty works of God" (b017, SA8).** LSG Acts 2:11 has "les merveilles de Dieu", and I used that wording. The lesson only alludes to the verse and does not quote it.
2. **Genesis 12:2 "I will make your name great" (b016, MC14, SA4).** I quoted LSG exactly: « je rendrai ton nom grand ». The meaning is the same as the NKJV.
3. **"Literal reader" / "unsophisticated" (b013, MC9).** I rendered these as « le lecteur qui lit le texte au sens littéral » and « un esprit naïf ». "Archetypal" is kept, with a short gloss: « (des figures qui représentent toute l'humanité) ». Please check that this gloss is neutral enough for the even-handed tone of the paragraph.
4. **"Ministers" (b022)** is rendered « serviteurs de Dieu », because « ministres » mostly means government ministers in Kinshasa. **"The Fall"** is rendered « la chute ».
5. **Several SA prompts reworded.** Prompts SA6, SA7 and SA10 are reworded slightly ("créé à l'image de Dieu fonde sa valeur et ses devoirs", "de la faute et de la sanction vers la faveur de Dieu…") so that a prompt cannot pass its own keywords. The meaning is unchanged.

Checker re-verified all Scripture with the offline LSG tool; every quotation matches Segond exactly: Genesis 1:1 (b002, b004), 12:2 (b016) and 12:3 (b010, fill 5). Allusions were also checked: Genesis 3:8-9, 4:15, 6:8, 11:4-9, and Acts 2:6 and 2:11.

## Problems in the English source

1. **SA1–SA10.** Every item has `keywords_en: null`, and every `model` is the same placeholder sentence. Per settled convention 12, the French has 8 real keyword groups in `keywords` per item and a real 3–5 sentence model answer written from the lesson.
2. **MC1–MC20 `why`.** Each one only repeats the correct option and explains nothing. I translated them as they are.
3. **MC19 option D** includes "sin", but the ministry-categories list in b020 does not name sin (sin is taught elsewhere in the lesson). The answer key is still clearly right.
4. **Fill 7** accepts "justice", but the lesson says "holiness". The French no longer accepts « justice » (see Checker's changes); Robert may want to drop it from the English too.

## Checker's changes

- Confirmed the 8-group French keyword sets sit in `keywords` (no `keywords_proposed` field), per convention 12; removed the obsolete Question 1 about that field.
- Tightened SA keyword groups so a plausible wrong answer cannot reach 3 hits: SA3, SA5, SA8, SA9 merged groups of names that a bare list of names would hit (Abraham/Isaac/Jacob/Joseph; Babel/Pentecôte; littéral/chronologie) and added distinct ideas (imperfection, debate, caution, weakness, greatness).
- SA1: replaced the over-broad stem "centr" with "au centre"/"central". SA6: replaced the "image" and "gagn/mérit" groups (they let "dignity earned by obedience" pass) with "répondre de ses actes" and "culture/famille/influence".
- SA9 model: added an opening sentence so it hits the new "imparfait" group. All 10 models hit 7–8 groups; all prompts hit 2 or fewer.
- Fill accept lists: removed « justice » (fill 7; lesson says holiness), « constance » (fill 9) and « conduite »/« direction » (fill 10), which are not what the lesson teaches.
- Scripture: no corrections needed. Lesson text and MC/fill items: no meaning errors found.

## Adaptations

- There were no US-specific examples. The family-ancestry illustration in b004 suits Congolese readers as it is.
- I added a short gloss for "archetypal" in b013 (see Question 4).

## French glossary used

| EN | FR |
|---|---|
| book of beginnings | livre des commencements |
| Creator-creature distinction | distinction entre le Créateur et la créature |
| covenant / covenant promise | alliance / promesse de l'alliance |
| family of promise | famille de la promesse |
| the Fall | la chute |
| image of God | image de Dieu |
| rebellion | rébellion / révolte |
| holiness | sainteté |
| grace | grâce |
| providence | providence |
| patriarchs | patriarches |
| reversal of Babel | renversement de Babel |
| Great Commission | Grande Commission |
| ministers | serviteurs de Dieu |
