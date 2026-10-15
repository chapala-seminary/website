# Model answers and question fixes: Christian Education (CTSCE) and Church History (CTSCH)

Branch `cf/models-ce-ch`. Findings source: `docs/rubric-review-notes.md` (Group 8 for CTSCE, Group 10 for CTSCH, on the ai-grader branch). Each finding was checked against the current files first.

## Changes

### CTSCE (Christian Education), `src/content/units/CTSCE/1-10.json`
- **All 100 short answers (SA 1-10 in each of 10 units): English and Spanish model answers added.** Before: only a French model (`model.fr`). After: `model.en` and `model.es`, written from the lesson (`src/content/lessons/CTSCE/<n>.json`) and the French model, about the length and level of the French model. Spanish uses the lesson's own terms (Loida, Jehová for the LORD, Sermón del Monte). Why: finding "CTSCE: every English and Spanish model answer is missing (all 100)".
- **CTSCE 8 Q6 (SA 6):** the question said "three rules" for an experiential assignment; the lesson gives four (specific, attainable, followed up, safe and appropriate for minors). Prompt changed to "four rules" in EN, ES and FR; the French model (which gave three and added a fourth as an aside) rewritten to give the four rules plainly; EN and ES models give four.
- **CTSCE 10 Q3 (SA 3):** the question said "four motions" Jesus made with the children; the lesson lists three (arms, hands, blessing; the "four" in the lesson's application paragraph counts teaching points, not motions). Prompt changed to "three motions" in EN, ES and FR. The French model already described the three motions and was kept.
- Models stay faithful to the lesson where it hedges (Voltaire's quote not traceable; Proverbs 22:6 as general wisdom is not in the SA).
- Quotation wording follows the lesson (e.g. Matthew 20:26-27 "minister ... servant" in CTSCE 2 Q10) where the French model used a different rendering.
- CTSCE 9 Q10 Spanish model uses the keyword words "aljaba", "llena", "capstone" so it passes its own list.

### CTSCH (Church History), `src/content/units/CTSCH/1-10.json`
- **All 100 short answers: English and Spanish model answers added** (same method; French models checked against the lesson and found faithful; nothing in them contradicted the lesson). Why: finding "CTSCH model answers exist only in French".
- **CTSCH 10 Q10 (SA 10):** the question asked for "the divorce parallel", which is in neither the lesson nor the French model. The lesson's actual point is the two pressures on the Western church (numerical decline; internal division, with the denominational splits). Prompt now: "Describe the two great pressures facing the Western church today, with examples of the denominational splits." (EN, ES, FR). The French model already answered exactly that and is unchanged. The EN and ES models follow the French model and the lesson's facts. Side effect: the French pasted-prompt no longer passes its own answer (it did before).
- CTSCH 2 Q4 ("Apologists of the 2nd century") lists Tertullian (c. 160-220) and Irenaeus, as the lesson does; left as is, not a conflict with the lesson.

### Translation provenance (`tr`)
`tr.fr.from` is the hash of the English prompt, keywords and model (`tools/translation-plan.mjs`). Adding `model.en` changed every SA stamp, so all 200 SA `tr.fr.from` values were recomputed with `translationPlan`; status stays `machine`. French text I rewrote (CTSCE 8 Q6 prompt and model, CTSCE 10 Q3 prompt, CTSCH 10 Q10 prompt) is `machine` with the new hash. Two French SA models that a human had edited (CTSCH 1 SA 4, CTSCH 2 SA 9) keep status `machine-edited` and their French text; only their stamp moved, because the new English was derived from that French and the lesson. Spanish has no `tr` entries in these courses (as elsewhere); unchanged. `translationPlan` reports no stale or unreviewed items for either course.

## Checks run
- Engine check of every SA (EN, ES, FR): each model passes its own question's keywords: 600 model checks, 0 failures.
- Pasted-prompt check: the same set of prompts passes as its own answer as before my change (CTSCE 40, CTSCH 40 before; CTSCH 39 now, since CTSCH 10 SA 10 fr was fixed). I did not touch keywords: none of my models needed a keyword change. The existing 80 weak-keyword prompts are pre-existing and not in this task's scope.
- `node test/published-models.test.mjs`: PASS. `node test/french-drafts.test.mjs`: PASS. `node test/french-import.test.mjs`: PASS. `node test/french-schema.mjs`, `node test/lesson-translation.mjs`: PASS.
- Not run (shared): full suite, build.

## Left alone
- CTSCH 4 Q4 and CTSCH 8 Q10 (contested doctrine: original sin/predestination; the Calvinist revivalist paradox): follow the lesson; for Wayne. CTSCH 10 Q10 content on women in ministry and denominational splits: the model reports the lesson's facts only; for Wayne.
- No other CTSCE or CTSCH items appear in the notes.

## For the orchestrator
`tools/content-baseline.json` and any fixture holding SA prompts/models need regenerating (not touched). `test/french-import.test.mjs` lists `CTSCH/10 SA 10` in `KNOWN_PROMPT_PASSES`; it no longer needs to be listed (the test still passes).
