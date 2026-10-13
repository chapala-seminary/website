# French translation — batch 5: eight Bible courses (draft for review)

Prepared 12 Oct 2026 from the beta branch (commit `0597da9`). Nothing here is published.

| Course | Units | English words | Questions for Wayne | Bible-wording differences flagged |
|---|---|---|---|---|
| Cours intensif sur 1 Pierre (1 Peter Intensive) | 12 | 21,400 | 58 | 58 |
| Personnages bibliques (Bible Characters) | 12 | 22,800 | 49 | 59 |
| Personnages bibliques II (Bible Characters II) | 11 | 19,600 | 45 | 55 |
| Cours intensif sur Galates (Galatians Intensive) | 12 | 19,400 | 64 | 84 |
| La vie de Christ (Life of Christ) | 10 | 16,600 | 50 | 61 |
| Les paraboles de la Bible (Parables) | 15 | 36,800 | 82 | 103 |
| Ruth et Esther (Ruth & Esther) | 9 | 21,200 | 51 | 51 |
| Cours intensif sur l'Apocalypse (Revelation Intensive) | 15 | 26,700 | 73 | 137 |

**96 units in all.** Each has the full lesson and all multiple-choice, fill-in and short-answer
questions in French, written to the shared standard in `tools/BRIEF.md`:
- Segond 1910 wording for all Bible text.
- No French short-answer prompt passes its own keywords.
- The edition-wide conventions apply throughout.

## How these were made and checked
- **Drafting.** Revelation units 4–11 and 13–15 were drafted with a lighter model, to save
  usage. All other units were drafted the same way as earlier batches.
- **Automatic checks.** Every unit passes `tools/validate.py`, which applies the site's own
  grading rules (0 errors). A script also compared every Bible quotation recorded in the units'
  notes with the offline Segond 1910 text. All of them match.
- **Exam check.** A separate, lighter check went over every exam item. It confirmed:
  - each French option means the same as its English option, in the same order;
  - the keyed answer is the right one;
  - fill-in answers fit their blanks;
  - short-answer keywords are not loose.

  It made 27 small fixes, mostly keywords hidden inside common words (e.g. « ange » in
  « louange », « égal » in « également », « heure » in « heureux »). This check did not re-read
  the lessons line by line, as earlier batches did. The French reviewer should read the lessons.

## Problems found in the ENGLISH site (affect students now)
1. **Wrong answer key: Revelation Unit 12, MC 19.** The key is "The Bible is unreliable". The
   correct answer is option 2 (index 1): "Setbacks do not disprove the gospel's long-term
   triumph…". Students who answer correctly are marked wrong.
2. **Two correct options: Bible Characters Unit 10, MC 16.** Samuel asks "Whose donkey have I
   taken?" (1 Samuel 12:3), so "donkey" is also right, but only "bribe" is keyed.
3. **Bible Characters II Unit 4, Q5** needs rewording (Wayne's decision). MC 4 and 5 contradict
   the revised lesson.
4. **Factual slips:**
   - **Bible Characters 4:** "Esau lost his blessing because he despised his birthright" merges
     two events (Gen 25 and Gen 27).
   - **Bible Characters 1:** says Scripture describes Adam as having "walked with God". It does
     not.
   - **Bible Characters II 8:** MC 1 asks for Thomas's other name ("Didymus"), which the lesson
     never teaches.
   - **Galatians 12:** *Questions on Doctrine* (1957) was the Adventist leaders' own book, not
     Martin and Barnhouse's conclusion.
   - **Life of Christ 5:** "Moses would die" (Moses had already died).
   - **Ruth & Esther 3:** a quotation credited to Ezekiel 16:8 is Ruth 3:9 (NIV wording), and
     it carries a stray "[b]" footnote mark.
   - **Ruth & Esther 4:** MC 13 says the women "bless Boaz"; in Ruth 4:14 they bless the LORD.
   - **Ruth & Esther 5:** "the only Old Testament book set in the time of the Gentiles" is
     doubtful by the lesson's own definition (Ezra, Nehemiah, Daniel). "Anti-Semitism" is given
     as a purpose of the book, but the lesson does not list it. The MC 18 author name is typed
     as "Conable" instead of Constable.
5. **Model answers that disagree with or go beyond the lesson:**
   - 1 Peter 7 SA 7 ("weaker vessel")
   - Life of Christ 6 SA 10 (reverses "as God / as man")
   - Revelation 13 and 14 (several model answers add material the lessons never teach)
6. **Short answers that pass by copying the question.** This happens in every course, as on the
   rest of the site. Each unit lists its own cases.

## Theology points for Wayne
- **Eternal-security wording.** Revelation 8 and 11 lean toward eternal security ("once and for
  all", "can never be erased"). This is translated as written; does the English need softening?
- **Preterist lean.** Revelation 8, lesson block b021, leans preterist. It is translated faithfully
  and flagged.
- **Segond vs NKJV.** In several places Segond reads differently from the NKJV and the lesson
  depends on the difference. Each one is flagged in its unit's review file. Examples:
  - Job 13:15 in Segond reads almost the opposite of the NKJV (Bible Characters 2).
  - Revelation 15:3: « roi des nations » vs "King of the saints".
  - Revelation 20:4: « revinrent à la vie ».

Each unit's `-review.md` lists its own questions, Bible-wording notes and English problems.
