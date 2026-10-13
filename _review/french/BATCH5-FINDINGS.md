# French Batch 5: what the reviews found

This covers four courses: Parables of the Bible, The Doctrine of the Holy Spirit, Pentecostalism & the Charismatic Movement, and Apologetics (47 units).

I checked every claim about the English site against the newest course files (beta). I dropped the claims that did not hold up and the ones too small to matter.

Already handled: the scrambled answer keys in Holy Spirit 7–10 were fixed in pull request #83.

---

## 1. Wrong answer keys on the live site

These affect students now, in English and Spanish.

**Multiple choice**

| Course / Unit | Question | Problem | Suggested fix |
|---|---|---|---|
| Apologetics 10 | MC 3 | The stem says "the **five** words most apologists forget". The keyed answer, "With meekness and fear", is four words, and b008 says "four small words". (The SA 1 model also says five.) | Change "five" to "four" |
| Apologetics 6 | MC 8 | The keyed answer says Psalm 22 was written "before the Romans invented crucifixion". The Romans did not invent it; they took it over from Persians and Carthaginians. b012 says the same thing. | "…long before crucifixion was practised" |
| Apologetics 7 | MC 13 | The key says West and Lyttelton "both became believers". b018 says only that each concluded the event was genuine and wrote a defence. Historians also think both were already professing Christians. | Key "Each concluded the event was genuine", and soften b018 |
| Apologetics 9 | MC 11 | The "do" vs. "done" slogan is never taught in the lesson. MC 10 also says the gospel "differs from all other religions", but b016 calls the difference "a matter of emphasis… not an absolute line". | Add the slogan to the lesson, or drop MC 11 and reword MC 10 |
| Holy Spirit 8 | MC 1 | The stem says the Spirit is "called the Helper" in Romans 8. That title is from John 14–16; Romans 8:26 only says He "helps". (Pull request #83 did not touch this question.) | "In Romans 8 the Spirit is pictured as the one who…" |

**Fill-in blanks that accept wrong answers**
- Parables 1, Fill 6 ("You are the ____!"): accepts "one" and "guy".
- Parables 2, Fill 8 ("the house of ____"): accepts "Judah". In Isa 5:7, Judah is the plant and Israel is the house.
- Parables 3, Fill 3 ("the two ____", the potter's wheel): accepts "wheels".
- Parables 8, Fill 7 ("Matthew 13 gathers ____ parables"): accepts "several".
- Parables 12: Fill 2 accepts "conscious", Fill 5 accepts "vinegar" and "ointment", and Fill 10 accepts "mission field".
- Parables 14, Fill 3 ("Be ____ of the word"): accepts "followers" and "practitioners".
- Parables 15, Fill 5 ("People ____…"): accepts "should", which changes the meaning.

---

## 2. Other English-site problems worth passing to Robert

**Pentecostalism has only 7 multiple-choice questions per unit.** Every unit, 1–12, has 7 instead of 20, and the score line reads "0 / 7". All other courses in this batch have 20. Either 13 questions per unit are missing, or the course was built short.

**Lesson text missing or out of place**
- Apologetics 1, b018: the Ice-Box Cookie story starts in the middle ("He had thought of everything but one thing"). The part where the man eats the cookies is missing, so MC 5's options ("crumbs", "receipt") make no sense. The Spanish has the same gap.
- Pentecostalism 2, b017: says "four things in turn", but the unit goes "First" through "Sixth and finally" (b043).
- Pentecostalism 7, b040: says prosperity teaching was "examined in an earlier unit". It comes later, in Unit 11.
- Pentecostalism 7, b048: says the next unit covers healing. Unit 8 is the baptism in the Spirit; healing is Unit 9.
- Apologetics 5, b008: calls the documents "the third trail". Unit 1 (b030) makes them the fourth.
- Apologetics 8, b014: says gravity, the electron's charge and cosmic expansion were covered "in Unit Two". Unit 2 covers only Earth-level fine-tuning (the moon, Jupiter, and so on).
- Holy Spirit 2: the catalogue link reads "Catalogue" in some units and "Catalog / Catálogo" in others.

**Explanations ("why" text) that miss the point**
- Parables 3, MC 9 and MC 11: the keyed answers are the Arminian/Wesleyan reading, but both explanations describe the Reformed view instead.
- Parables 9, MC 4: says the explorers got lost "within a quarter mile of home". b009 says a quarter mile from the Royal Geographical Society.
- Parables 13, MC 19: credits the outline to "Wayne Cook's sermon outline". The lesson does not say this.

**Exam items or model answers that go beyond the lesson**
- Parables 7: MC 5's explanation and the SA 2 model and keyword use "mustard seed of faith", which the lesson never mentions. Parables 8, b017 then quotes the Unit 7 student as saying it.
- Apologetics 1, SA 8: asks about Romans 1:18–20, but the lesson teaches only 1:20.
- Apologetics 2: "teleological" and "ontological" (MC 7, 10, 12; SA 2, 4) never appear in the lesson.
- Apologetics 5: "criterion of embarrassment" (MC 13, SA 7) never appears; the lesson says "ring of truth".
- Apologetics 7: MC 4 and the SA 2 model say Jews "switched to" Sunday, a "sociological earthquake". The lesson is more careful and never says "Sunday".
- Apologetics 9, SA 4 model: says that on the atheist's view there is "no real good or evil". The lesson calls atheist moral realism "a serious position, not a bluff". This **contradicts** the lesson.
- Holy Spirit 8, MC 15: calls a point "the conclusion Paul reaches", but in b017 it is the lesson's own conclusion.
- Pentecostalism 1, SA 1 model: says "third-wave evangelicals". The lesson says "later evangelical currents".

**Factual and reference errors in the lessons**
- Parables 1, b035: Amos 7:7 has the Lord standing "on a wall", not "beside" it.
- Parables 11, b015: "the last will be first, and the first last" is the word order of 20:16. In 19:30 it is reversed.
- Parables 14, b019: Leeson's Barings losses were about $1.3 billion, not "nearly a billion".
- Parables 15, b017 and Fills 2 and 4: "insures" should be "ensures".
- Holy Spirit 4, b017: "menservants and maidservants" is Joel 2:29, not 2:28.
- Holy Spirit 5, b017: "they were all amazed" is Acts 2:7 or 2:12, not 2:11.
- Holy Spirit 9 and 10: the lessons quote the **KJV** ("longsuffering… meekness, temperance", "Holy Ghost", "charity never faileth"), not the NKJV.
- Holy Spirit 9, b022: "the greatest gift" is not what 1 Cor 13:13 says (love is the greatest of faith, hope and love).
- Pentecostalism 3, b043: "servants and free" is not in Joel 2. It should be "menservants and maidservants".
- Pentecostalism 6, b038: the Church of God in Christ already existed (c. 1897). It was *reorganized* as Pentecostal after Mason's 1907 visit, not newly formed.
- Pentecostalism 8, b031: the command to "wait in Jerusalem" is Acts 1:4 and Luke 24:49, not Acts 1:8.
- Pentecostalism 9, b027: says "three times the answer was not the healing". 2 Cor 12 has three requests but only one answer.
- Pentecostalism 10, b035: in Acts 21:12 it is Luke's party and the Caesarea believers who plead with Paul, not "the disciples".
- Apologetics 2, b008: "raises a **statue** to an unknown god". Acts 17:23 and the SA 9 model say an altar.
- Apologetics 5, b010 and b012: the *Iliad* survives in well over a thousand copies, not "a few hundred". Also, b012 says "a thousand-year gap" for Caesar, while b010 and MC 3 say about nine hundred years.
- Apologetics 7: b012 has Thomas "fell down", which John 20 does not say. b022 has Jesus "pierced through the heart", but John 19:34 says the side.

**Short-answer keyword grading.** The site needs 3 keyword hits to pass an answer.
- **Students can pass by copying the question.** 100 of the 470 English short-answer prompts in these four courses score 3 or more of their own keywords:
  - Parables: 16 of 150
  - Holy Spirit: 37 of 100
  - Pentecostalism: 9 of 120
  - Apologetics: 38 of 100
- **Keywords that are long exact phrases**, which a correct answer in the student's own words will rarely match: Pentecostalism 4–10 (e.g. "medicine is scarce", "not truly received", "full gospel business men").
- **Keywords the lesson never teaches**: Parables 12 "unclean", Apologetics 4 "lawgiver", Apologetics 9 "ladder", Apologetics 8 "design" and "undercut". Holy Spirit 7, SA 4 still has "remain" and "cast", left over from an older eternal-security wording.

**Pentecostalism course drafts, a small French fix.** Several drafts still say "parcours de maîtrise" or "parcours de master". Convention 13 says "Parcours Master". These still need correcting in the French files; nothing is needed from you.

---

## 3. New decisions for the whole French edition, and theology/fairness flags

These decisions are new. They are not covered by the settled conventions or by Batches 2–4.

1. **Segond's lowercase "esprit" where the lesson sees the Holy Spirit.** Examples: Gen 1:2, Judges, Ps 51:11, Zech 4:6, and Heb 9:14 "par **un** esprit éternel". Heb 9:14 weakens the proof in Holy Spirit 3 and 5 and Pentecostalism 2. Holy Spirit 4 adds one sentence explaining this, but Holy Spirit 1 adds nothing. Should every course add a one-time note: "Segond writes 'esprit' in lowercase, but the context shows it is the Spirit of God"?
2. **A fixed list of Pentecostal and charismatic terms**, so that one form is used in every course:
   - baptême dans le Saint-Esprit
   - signe initial (never "évidence", which in French means "obviousness")
   - parler en langues
   - seconde bénédiction
   - revêtement de puissance
   - cessationniste / continuationniste
   - Renouveau charismatique
   - Troisième Vague
   - évangile de la prospérité (lowercase "é" for the false gospel)

   Approve?
3. **"Godhead".** The drafts use "la Divinité" with a capital for the one divine Being, and "la divinité" in lowercase for "deity" (being God). See Holy Spirit 1, 3 and 10. Is the difference clear enough, or should the second be "la pleine divinité"?
4. **WiseSpeak terms in French** (Parables 15). The drafts use:
   - "question d'approfondissement" for probing question
   - "mot clé" for keyword
   - "sujet" for subject
   - "idée" for idea
   - "objectif" for objective
   - "disposition" for arrangement

   These will come back in the WiseSpeak course, so please confirm them or give your own.
5. **Local Kinshasa church words.** The drafts use:
   - "rétrograde" for backslider (Holy Spirit 7)
   - "le protocole" for ushers (Parables 4)
   - the neutral "Églises indépendantes", where Kinshasa says "Églises de réveil" (Pentecostalism 1)

   Use the local word in each case?
6. **Wrong English fill-in alternates** (section 1) are being left out of the French. Approve as standing practice?

**Spiritual gifts and fairness to Pentecostals.** All of these are faithful translations of the English. The question is whether the English should change.
- **Holy Spirit 1, b005: "Charismatics, cultists, and the older denominations"** puts charismatics next to the cults. Many Kinshasa readers lead charismatic churches. One suggested order: "charismatics, the older denominations, and even the cults".
- **Pentecostalism 10 (b042) and 12 (b027, MC 4):** the course answers "no" to tongues as the required evidence of Spirit-baptism. This is the central doctrine of classical Pentecostal bodies such as the Assemblies of God. Is that the course's settled position, or should it be presented as one view among several?
- **Pentecostalism 11, b033:** says the context of Isa 53:5, "by His stripes", "ties [it] to the healing of our souls". Many Pentecostals hold healing in the atonement (compare Matt 8:17). A suggested wording: "ties it first of all…".
- **Pentecostalism 1, b021:** assumes the reader is not Pentecostal ("many in your congregation may have come out of a Pentecostal church").
- **Pentecostalism 3, 6, 12 (word choices):**
  - "position du modèle" as the name for the pattern view
  - "respectueusement non retenu" for "respectfully declined"
  - "refuser" for "decline"

  A Kinshasa reader should confirm that none of these sounds dismissive.
- **Holy Spirit 6, 7, 9, 10 (spiritual gifts):** the reviewers checked these units and confirm the French keeps the English's even balance between cessationist and continuationist views.

**Other theology and fairness flags**
- **Holy Spirit 2, b007:** "as the Father is named Yahweh". In Scripture YHWH is the name of the one God, and the New Testament applies it to the Son too.
- **Eternal security:**
  - Holy Spirit 8, b019: "He will never leave the work unfinished… will surely complete." The French keeps exactly the English's strength.
  - Holy Spirit 6, b011/b013: "kept by God… bring us safely home". The French keeps exactly the English's strength.
  - Parables 10, b014 and Parables 14, b023: these present the views evenly.
- **Apologetics 2, b008:** "The African builds an altar to the sun" may read as patronizing in Congo. Suggested: "An ancient people builds…".
- **Apologetics 9, SA 4 model** (see section 2): this is harder on atheists than the lesson is.

---

## 4. Unit-specific questions

Each unit's review file (`<course>/<course>-unitN-review.md`) has its own "Questions for Wayne." Numbered questions per course:

- Parables of the Bible: 149 across 15 units
- The Doctrine of the Holy Spirit: 85 across 10 units
- Pentecostalism & the Charismatic Movement: 96 across 12 units
- Apologetics: 67 across 10 units

Most are notes on Segond wording that only need a yes. The ones that need real thought are in section 3.
