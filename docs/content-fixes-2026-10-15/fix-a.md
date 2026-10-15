# Content fixes: fix-a (non-doctrinal findings, 12 courses)

Source: `docs/rubric-review-notes.md` on the ai-grader branch. Every change was
made in English, Spanish and French together. Each changed question's French
provenance (`tr.fr`) was recomputed with `translationPlan` from
`tools/translation-plan.mjs` (status `machine`, new source hash); a re-run
shows no stale `sa` item in any touched unit.

## Changes

| Course / item | Before -> after | Why |
|---|---|---|
| CTSRomans 2 Q8 | Model said the law is a "schoolmaster" driving sinners to Christ (not in lesson). Now: knowledge of sin, disease image, absolute standard, every mouth stopped. | Detail not in the lesson |
| CTSRomans 9 Q9 | Model added "kingdom bigger than disputes that divided churches", "do not destroy the work of God for food", "unity more important than winning". Now only the lesson's points (14:17, menu/calendar, strong/weak, pursue peace and edification). | Detail not in the lesson |
| CTSRomans 10 Q6 | "Rufus's mother had been 'a mother' to Paul" -> "my mother too" (EN, ES; FR already right). | Loose detail; lesson quotes "my mother too" |
| CTS1Peter 7 Q7 | "Weaker vessel in physical strength" -> lesson's reading (not worth less or less able; precious, handled with care; prayers hindered). | Contradicted the lesson |
| CTS1Peter 7 Q9 | Question and model cited "the grandfather's account"; the lesson has no grandfather. Question now names the story (godly woman, husband honking the horn). Model rewritten from the lesson. Keywords: "life"/"win" replaced by "patien"/"nag" (ES "pacien"/"regañ", FR "patien"/"harcel") so the new prompt does not pass pasted back. | Unsupported source; prompt must still fail |
| CTSBibleCharacters2 6 Q7 | First-person ("my wife") -> third person ("Wayne's wife"). | First-person model in an exam |
| CTSWR 7 Q1 | Thin model; said Buddhism had no identifiable founder (lesson says only Hinduism). Now fuller, from the lesson (Nanak, 1469, Hindu/Muslim tension, "no Hindu, no Muslim", nine Gurus). | Thin model; fact error |
| CTSWR 7 Q2 | Expanded from the lesson: Mughal rule, suspicion/violence, Nanak's message, third way, partly right and partly wrong. | Thin model |
| CTSWR 11 Q1 | Model described the situation but not why attention differs. Now answers the question from the lesson (occasional visitor vs. present in family, neighborhood, congregation; core attention; Areopagus aim). | Did not answer its question |
| CTSCults 4 Q9 | Dropped the closing verdict ("gravely in question") and "Critics reply" -> "Others reply"; model now covers only the challenge and the Church's reply, as asked. "overwhelmingly" -> "consistently" per lesson. | Stance beyond the question |
| CTSActs 10 Q8 | Model said to stay with the ship as the meaning of 27:31 and to leave "the wreckage". Now: stay when the Lord has not released you, let go of grief, grievance, failure, dead relationship released long ago; ES/FR matched. | Contradicted the lesson |

## Checked and left alone

- Romans 8 Q8 (all Israel saved); Galatians 6 Q2, 9-12; 1 Peter 6 Q6, 9 Q3 and Q8 (contested; Wayne).
- Revelation 2 Q7 and unit 1 Q2 (kenotic Christology), 8, 12-14 (millennium).
- CTSLOC 8 (ark lost, empty Holy of Holies: the lesson's own stated position).
- Cults 8 (Roman Catholicism: the lesson's Reformed position).
- Acts 6 Q6; Parables 1, 2, 3, 8, 14, 15 Q10; Missions 1 Q6, Q8, 3, 5, 7-10 Q10 (contested or personal, no content error named).
- Bible Characters 2, 8 Q9: the model is already third person; Rick's words are a quotation from the lesson. Unchanged.
- CTSJohn: no non-doctrinal finding was named; nothing changed. A scan of all twelve courses found no literal entities, "imminent" or "Conable".

## Checks run

- `node test/sa-keywords.test.mjs` (John, Romans, Acts included): PASS.
- `node test/published-models.test.mjs` (every model passes in en/es/fr, all 466 units): PASS.
- A per-course check of the twelve courses with the shipped engine: 0 model answers fail in en, es or fr (4,200 models). No touched question newly passes its own prompt. Pasted-prompt passes that existed before this work remain in untouched questions across these courses (for example CTS1Peter 7 Q7, CTSCults 4 Q9 ES); they are not new and were left for the keyword-repair pass.
