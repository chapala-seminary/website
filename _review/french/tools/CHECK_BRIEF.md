# Brief: independent check of one French unit draft

Another translator drafted this unit following /home/claude/fr/BRIEF.md (read it
first: it holds all the rules). You did not write it. Check it and fix it in place.

Files (in /home/claude/fr/<COURSE>/):
- `<COURSE>-unit<N>-source.json` (English source)
- `<COURSE>-unit<N>-fr.json` (French draft — fix this directly)
- `<COURSE>-unit<N>-review.md` (review notes for Wayne — update it)

## Do
1. **Scripture.** Find every Bible quotation in the French (lesson blocks, exam
   stems, options, fill prompts, models). Look each one up with
   `python3 /home/claude/fr/tools/lsg.py "<ref>"` (or `--search "words"` when no
   reference is given) and make the French match Louis Segond 1910 exactly
   (keep "l'Éternel" with the accent). Partial quotes are fine if the words quoted
   are exact. Where the draft paraphrased but presented it as a quotation, fix it.
   If the review file says verses were "quoted from memory" or "could not be
   checked online", replace that note with the result of your check.
2. **Meaning.** Compare each French block and exam item with the English. Fix
   omissions, additions, mistranslations, untranslated English, and unnatural
   French. Check theology against the guardrails in BRIEF.md.
3. **Exams.** MC option order unchanged; the correct option in French is still
   correct and the distractors still wrong. Fill-ins: answer findable in the
   French lesson; accepted forms right; no wrong answer accepted. Short answers:
   keyword stems distinctive (no matching inside unrelated common words, no stems
   under 4 letters unless a number or name that can't collide); model answer hits
   at least 3; a plausible WRONG answer would not hit 3.
4. Run `python3 /home/claude/fr/tools/validate.py <source> <fr>` until 0 errors;
   handle warnings.
5. Update the review file: remove questions that your fixes settled, add any new
   ones, and add a short `## Checker's changes` list (one line each, at most ~15
   lines; group small wording fixes into one line).

Final message: one line — unit, number of changes, Scripture result (all verified
/ N corrected), validator result.
