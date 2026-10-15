# Language Appreciation (CTSLA): model answers and keyword lists

Task: models-la. Scope: `src/content/units/CTSLA/1.json` to `11.json`, the `sa` (short-answer) items only. Findings are from `docs/rubric-review-notes.md` (Group 1). Question numbers are 1-based.

## What changed, all 110 items

- **English and Spanish model answers (`model.en`, `model.es`) written for every item.** Before: only `model.fr` existed. They are written from the lessons (not from the French) at about the length of the French models. Where the lesson names a Bible version, the Spanish quotes it as the Spanish lesson does (Reina-Valera Gomez wording for John 1:14 and Matthew 5:18).
- **Keyword lists rebuilt (`keywords.en`, `keywords.es`).** Before: both lists were the same mixed list, English terms followed by Spanish terms, with many duplicates, many words copied from the question itself, and a few short forms that match inside almost any word (for example `or`, `he`, `h`, `g`, `v`, `p`, `en`). Now: `keywords.en` is English only and `keywords.es` is Spanish only (ASCII-folded matching, so accents are optional), each deduplicated, with words of the question moved out so that the pasted question fails. Every item has 6 to 25 groups (the engine still needs 3 of them, `minHits` unchanged). The French lists were left alone except where listed below.
- **Open-ended notebook items** (Unit 8 Q10, Unit 9 Q10, Unit 10 Q10, Unit 11 Q10) have a "model response" written in the third person. Their keyword groups cover every word or verse a student may pick, but never the words of the question.
- **First-person French models** (they do not fit an exam) were rewritten in the third person where the English now differs: 1.8, 1.10, 3.9, 6.10 (already third person), 8.10, 9.10, 10.3, 10.10, 11.7 to 11.10. Other French models listed in the table below were re-aligned to the English where the English corrects the lesson.
- **Provenance (`tr.fr`).** Every item's `tr.fr.from` was recomputed with the same hash rule as `tools/translation-plan.mjs` (sha-1 of the JSON of `prompt`, `keywords`, `model` in the source language `en`, first 12 hex digits). Status stays `machine`. French text I changed is `machine` with the new hash. French text I did not change (keywords and most models) was restamped to the new English hash after checking that it still says the same thing; this is the same practice as commit `318ea9ae` (John 12 SA9). `tr.es` does not exist for questions in this repo, and I did not add it.

## Factual and wording fixes, by item

| Item | What changed | Why |
|---|---|---|
| 1 Q4 (Koine) | Model follows the lesson: common Greek of streets and markets, lingua franca of the Roman world, not Plato's literary Greek. French model: removed Alexander the Great, "Spain to Persia", the fisherman/merchant/slave list. | Not in Unit 1 (Alexander is Unit 6). |
| 1 Q5 (Aramaic) | Prompt: "four examples" became "three examples" (EN, ES, FR). Model gives Abba, Maranatha, Eli Eli lama sabachthani. French model: removed Talitha koumi. | The lesson names three Aramaic words, not four (Talitha koum, Mark 5:41, is not in it). |
| 2 Q8 (Bet before Aleph) | Prompt rewritten (EN, ES, FR): the first word of Genesis, and what the lesson says about Bet and about Aleph. French model and French keywords: removed "Jewish tradition has long wondered why God did not start with Aleph". | The lesson never asks or answers why the Bible starts with Bet; it says Aleph is silent (the alphabet begins in silence before God speaks), Bet is the first letter of the Bible and means "house". |
| 8 Q8 (pneuma) | Prompt "give one English derivative for each" became "one related English word for each" (EN, ES, FR). Model: pneumatic (wind), pneumonia (breath), spirit through Latin *spiritus*. | The lesson says "spirit" comes from Latin *spiritus*, not from *pneuma*. |
| 9 Q1 (Luther) | French model: removed "the 95 theses followed in 1517". | Not in the lesson. |
| 9 Q8 (Romans 1:16-17) | Prompt "how the four unit words connect" became "how these words connect" (EN, ES, FR). | The prompt names three words (pistis, soteria, dikaiosyne) and asks for four; the lesson itself admits *kyrios* is not in these verses. The model says so. |
| 10 Q7 (Tyndale) | French model: "translated and printed the English New Testament" became "did the same for early modern English". | The lesson does not say he printed the New Testament. |
| 11 Q6 (Unit 5 words) | Model rewritten: Units 3-5 = rest of the Hebrew alphabet and vowel points, Genesis 1:1, six words from Genesis 1, then the seven words of Unit 5 (qadosh, kavod, YHWH, chesed, shalom, torah, berit). French model and French keywords the same. Prompt unchanged. | Finding "CTSLA 11 Q6": the old model said Unit 5 teaches "hesed, shalom, ruach, dabar". Unit 5 teaches the seven words; Unit 11's own summary table (b064) is wrong, see below. |
| 11 Q10 (Spanish prompt) | "el ONE cambio" became "el UNICO cambio". | English word left in the Spanish question. |
| 5 Q2, 6 Q8 (French keywords only) | French groups that were also words of the French question (qadosh, "repete", alpha, omega...) were replaced. | The French question passed its own French list (4 groups). The English and Spanish lists were already fine. |
| 3 Q3 (vowels) | French model: removed "sacred texts were read aloud and learned by heart" and "the writing system was born for a living language". | Not in the lesson. |

Other French models re-aligned to my English: 1.6, 1.7, 1.9, 2.9, 2.10, 3.4, 3.7, 3.10, 4.4 (removed "the Father, the Son and the Holy Spirit, three persons", not in the lesson), 5.10, 6.10, 10.4, 10.10, 11.7 to 11.9, 11.10 (all wording or first-person fixes; no doctrine changed).

## Checks run

- Own check (`shortAnswerRight` from the shipped `public/assets/js/cts-engine.js`, in Chromium): 330 models (110 x EN/ES/FR) pass their language's list; 330 questions (EN, ES, FR, with entities decoded and raw) do not pass as their own answer. 0 failures.
- `node test/published-models.test.mjs`: PASS, 38,393 checks across 466 units.
- `node test/french-import.test.mjs`: PASS (provenance current, 4,540 pasted French prompts fail).
- `node test/french-schema.mjs` PASS; `node test/lesson-translation.mjs` PASS.
- Not run (per brief): full test suite, build, `tools/verify-question-counts.mjs` (needs a build). Fixtures and `tools/content-baseline.json` untouched; the orchestrator should regenerate the baseline (the CTSLA short-answer data changed).

## Findings checked and left alone

- **CTSLA 9 Q6** (forensic justification, "courtroom verb"): the lesson takes this side; the model states it as the lesson does and adds nothing. For Wayne.
- **Whole-course keyword limits** (as in `docs/short-answer-keyword-repairs.md`): matching is by substring, so `he` (Hebrew letter He, 2 Q1), `pe`, `nu`, `mu`, `pi`, `xi`, `eta` hit inside ordinary words. They stay only where the answer *is* the letter name (2 Q1, 3 Q2, 6 Q3, 7 Q2, 7 Q8, 6 Q9); each of those questions has other groups and the pasted question fails.

## Lesson problems found (not fixed here; lessons are the authority; for Wayne)

- **Unit 11, table "The Eleven-Unit Journey" (b062-b069):** it describes Unit 5 as "hesed, shalom, ruach, dabar" (Unit 5 teaches qadosh, kavod, YHWH, chesed, shalom, torah, berit), Units 1-2 as "the textual story" with Jerome, Wycliffe and Tyndale (Unit 1 is orientation, Unit 2 the first ten Hebrew letters), and Units 3-4 as only the Hebrew alphabet (Unit 4 is the six Genesis 1 words). Also "a dozen words" vs thirteen (Unit 5).
- **Unit 9, b014** says Romans 1:16-17 contains all four unit words, but b065 says *kyrios* is not in these verses.
- **Unit 9, b009-b010:** Luther is "in 1515" preparing lectures yet opens Erasmus's Greek text "published just months earlier in 1516". The model gives both dates as the lesson does.
