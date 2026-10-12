# French translation — batch 2: eight M.Div. courses (draft for review)

Prepared 12 Oct 2026 from the beta branch (commit `0597da9`), which already includes the
day's English fixes. Biblical Languages uses the corrected answer keys from PR #74. Nothing
here is published.

| Course | Units | English words | Questions for Wayne | Bible-wording differences flagged |
|---|---|---|---|---|
| Herméneutique (Hermeneutics) | 11 | 26,900 | 63 | 21 |
| Initiation aux langues bibliques (Biblical Languages) | 11 | 37,100 | 75 | 22 |
| Étude approfondie de la Genèse (Genesis) | 12 | 19,900 | 35 | 14 |
| Apologétique (Apologetics) | 10 | 19,200 | 35 | 14 |
| Administration et leadership de l'Église | 10 | 18,700 | 36 | 30 |
| Le culte (Worship) | 11 | 10,900 | 39 | 7 |
| Éducation chrétienne (Christian Education, Andi Cook) | 10 | 31,000 | 51 | 29 |
| Missions mondiales (World Missions) | 10 | 12,900 | 30 | 17 |

**85 units in all.** Each has the full lesson, 20 multiple-choice, 10 fill-in and 10 short-answer
questions in French. The units were made and checked the same way as batch 1:
- Bible quotations follow Louis Segond 1910, looked up online.
- Every unit passes a check that applies the site's own grading rules.
- A second, independent pass compared every unit with the English and fixed about 90
  small problems: wording, a few meaning slips, and keywords that would have marked good
  answers wrong.

## Problems found in the ENGLISH site (affect students now)

1. **Biblical Languages and Holy Spirit answer keys:** 195 wrong keys. Fixed in PR #74.
2. **Genesis has no short-answer keywords at all,** and its ten "model answers" per unit are the
   same generic sentence. Any long-enough answer passes. Real model answers and keywords are
   needed.
3. **Biblical Languages and Christian Education have no short-answer model answers.** The French
   ones were written from the lessons and need checking. Biblical Languages keyword lists
   repeat words (e.g. "Helen Keller" counts as four keywords), so short answers pass too easily.
4. **Worship and Missions:** no multiple-choice explanations in any unit.
5. **Questions that test what the lesson doesn't teach, or contradict it:**
   - Administration 2 (the "two pastors" illustration isn't in the lesson)
   - Apologetics 1 (the Ice-Box Cookie story is missing from the lesson itself)
   - Christian Education 3 (MC 16's keyed answer says the traits "are theory", the opposite
     of the lesson)
   - Worship 6 (Gregorian chant)
   - Hermeneutics 8, 10 and 11 (model answers disagree with the lessons)
6. **Factual slips to look at:**
   - Hermeneutics 11: Joseph was sold for 20 pieces of silver, not 30.
   - Administration 3: Nehemiah rode out one night, not three.
   - Christian Education 1: 2 Timothy is dated AD 46 instead of about AD 64–67.
   - Christian Education 4 MC 13: an angel, not the Spirit, sent Philip.
   - Biblical Languages 11: Paul wrote Romans from Corinth, not "from Rome".
   - Biblical Languages 9: "by faith" occurs fewer than 24 times in Hebrews 11.
   - Worship 3: the lesson says "Baptists hold the free-church tradition", which may not
     suit a non-denominational seminary.

## Decisions for the whole French edition (new in this batch)

- **Currency:** several drafts changed "pesos" to Congolese « francs ». Keep them, or go back to pesos?
- **Mexico references:** examples such as "the Mexican church" are kept as written. Adapt
  them for Kinshasa?
- **Track names:** « Parcours Certificat » vs « Certificat de ministère ». The English uses both.
- **Spellings and terms:** LSG name spellings (Lémec, Hénoc, Jizreel), « intendance » for
  "stewardship", and « l'Éternel » vs « le Seigneur » in New Testament passages.

Each unit's `-review.md` lists its own questions.

## Found while checking: short answers that pass by copying the question

Beta's French checker warns when a short-answer question's own wording already contains enough
keywords to pass. The English site has the same problem: **1,640 of 4,540 English short-answer
questions (36%) pass if the student types the question back** (Spanish: 1,418). Worst: Evangelism
125, Pastoral Ministries 101, Acts 99, Worship 88, 1 Peter 78. The French drafts inherit the same
keyword design (356 of 730 in this batch). Two ways to fix it, for Dr. Cook and Robert to choose:
(a) the engine ignores keywords that appear in the question; (b) the keyword lists are rewritten.
