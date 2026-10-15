# models-gen: CTSGenesis short-answer model answers

Finding (rubric-review-notes.md, Group 8): "Genesis units 1 and 4–12: English and Spanish model answers are one-line placeholders; French used."

## What changed
Files: `src/content/units/CTSGenesis/{1,4,5,6,7,8,9,10,11,12}.json`, `sa[0..9]` in each (100 questions).

- Units 1, 8, 10: the English and Spanish model was the same one-line generic sentence for all ten questions ("A strong answer integrates the unit's biblical concepts and keeps the almighty and holy God at the center of Genesis").
- Units 4, 5, 6, 7, 9, 11, 12: the model was a templated instruction ("A strong answer should integrate warning, Cain, sin ... / the unit's biblical concepts ..."), not an answer. These were the same kind of placeholder, so they were replaced too.
- Each is now a real answer of 3–5 sentences (about 50–110 words), written in English and in Spanish from the real French model answer, and checked against the unit's lesson (src/content/lessons/CTSGenesis/<n>.json). Where the lesson words a point differently from the French (for example "household gods" for Rachel's theft, unit 10 Q9), the lesson's wording was used.
- `tr.fr.from` on every changed question was recomputed the way the repo computes it: first 12 hex characters of sha1 over `JSON.stringify({prompt: <en>, model: <en>})` (this reproduces the existing hashes on the untouched units 2 and 3). The French text was not rewritten; the new English was made to agree with it, so the status stays `machine` and the source hash is now current.
- Files are written with `JSON.stringify(unit, null, 1) + "\n"`; the diff touches only `model.en`, `model.es` and `tr.fr.from`.

## Checked and left alone
- Units 2 and 3: English and Spanish models are real answers, no placeholders. No change.
- Other CTSGenesis findings in the notes: none (the only Genesis line is the one above).
- Contested doctrine: none altered. Unit 1 Q5 (literal vs. non-literal readings of Genesis 1–11) and unit 4 Q6/Q9 (the Flood, "curse of Ham") state the lesson's own stance.

## Checks
- CTSGenesis has no keyword lists (`keywords`), so keyword-repair checks do not apply; short answers here are graded without keyword lists, and `test/missing-sa-grading.test.mjs` asserts that missing keys never award a pass.
- Could not run the playwright-based tests (`missing-sa-grading`, `published-models`): the worktree has no node_modules. Instead a script confirmed: 120 questions, no placeholder text left in EN/ES, every `tr.fr.from` equals the recomputed hash, all models 39–106 words.
