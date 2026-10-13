# Short-answer keywords: John, Matthew, Acts and Romans (Oct 2026)

The French Batch 2 review (`_review/french/BATCH2-FINDINGS.md`, PR #68) reported that many
short-answer questions in these four courses pass when a student pastes the question back
as the answer, and that some plainly wrong answers pass. This records what was checked, what
changed, how it was tested, and what keyword grading still cannot do.

## How the grader works

`keywordPass` in `public/assets/js/cts-engine.js` lowercases the answer, removes accents and
punctuation, and counts a keyword **group** as found when any of its forms appears anywhere
in the answer — inside a longer word too ("for" is found in "before"). An answer passes with
3 groups (`SA_HIT_MIN`), or fewer when a question has fewer groups. The Spanish page accepts
an answer that reaches 3 on the Spanish list **or** the English list. Short answer counts
only on the Th.M. and M.Div. tracks, where 9 of 10 must pass. None of that was changed:
thresholds, track rules, saved progress and language behaviour are as they were.

## What the report said, reproduced with the shipped engine

Run in Chromium against the real `cts-engine.js`, on `beta` at `28fc79c7`:

| | John | Matthew | Acts | Romans | Total |
|---|---|---|---|---|---|
| English prompt passes as its own answer | 67/120 | 33/130 | 99/110 | 14/100 | **213/460** |
| Spanish prompt passes (Spanish page) | 65/120 | 37/130 | 99/110 | 14/100 | 215/460 |

All five wrong answers the report tested passed (with 4, 4, 3, 3 and 3 groups). The report
was right in every figure.

Across the whole site, 1,760 of 4,660 English prompts pass as their own answer. The other
41 courses were not part of this repair; see "Not done" below.

## What changed

- 411 of the 460 questions have new keyword groups, English and Spanish together. Every
  question keeps 8 groups in each language (Acts Unit 6 SA 1–5 and 7–9 went from 5 to 8).
  `minHits` is untouched.
- Groups are the ideas a correct answer needs, each with the ordinary words students use
  (synonyms, inflections, short phrases), taken mostly from what the lesson teaches **beyond**
  the question's own wording. Words of the question itself were moved out of the groups.
- Filler and over-matching forms are gone: articles, pronouns, prepositions, bare
  god/Christ/Jesus/Lord/Dios/Cristo, and short forms that sit inside common words. Where a
  short word is the idea itself it is written as a phrase ("el rey", "the cup") or kept with a
  note ("law", "joy", "40").
- On the questions the theology review flagged (election, eternal security, Romans 7, Israel
  and the end times), groups use the words of the passage itself, so a student of either
  view can pass. The prompts and models of those questions were not changed.

## How it was tested

Test answers were written by separate agents that saw only the lesson and the question —
never the keywords or model answers. For each of the 460 questions: a full English answer, a
full Spanish answer, and a short (1–2 sentence) English answer. The keyword work used the
full answers; the short answers were held back and only scored.

| Measure | Before | After |
|---|---|---|
| English prompts passing as their own answer | 213/460 | **0/460** (none reaches more than 1 group) |
| Spanish prompts passing (Spanish page) | 215/460 | **0/460** |
| Model answers passing, English / Spanish | 460 / 460 | 460 / 460 |
| Full independent answers passing (EN+ES) | 914/920 | 918/920 |
| Held-back short answers passing (EN) | 411/460 | 430/460 |
| The report's five wrong answers passing | 5/5 | **0/5** |
| Questions that also accept another question's model from the same unit | 243 | 193 |
| Four generic "sermon" answers, passes over all 460 questions (EN / ES) | 18 / 7 | 19 / 10 |
| French draft prompts (PR #68) passing the new English list or their own | — | 0/460 |

Notes on the figures:

- "Before" for the independent answers is the beta keywords on the corrected lessons.
- The two full answers that fail are for Romans Unit 1 SA 9, which was rewritten (F1.5):
  those answers address the old question.
- Of the 30 held-back short answers that fail, 27 are brief but correct answers that do not
  name three of the ideas, and 3 address the rewritten Romans question. In a second round the
  keyword agents were told **which** held-back items failed (not the answers), so the 430 is
  not a fully blind figure.
- The generic answers ("God loves us and Jesus died for our sins, so we must pray, read the
  Bible…") still pass a few questions whose subject really is that general — mostly Acts
  questions about Spirit-empowered witness.

`test/sa-keywords.test.mjs` holds the repair: every copied prompt fails in both languages,
every model passes, 1,348 independent correct answers pass
(`test/fixtures/sa-answers.json`, written for the test, not by students), the five wrong
answers fail, and no filler keyword returns. On the old `beta` content it fails in 855 places.

## What keyword grading still cannot do

Keyword grading counts words; it does not read sentences.

- **Negation.** "Christ does **not** keep His sheep; **no one** can be sure of eternal life"
  uses the same words as a right answer. The five wrong answers now fail because they
  lacked the right ideas, not because the grader understood them. A wrong answer that
  restates the right words and denies them can still pass. This is true of every item; the
  theology-flagged ones (Acts 6 SA 6, John 7 SA 9, Romans 5 SA 3) say so in the review notes.
- **Partial copying.** A student who copies the question and adds two real ideas can still
  pass, since the question itself never scores more than 1 group.
- **Brief correct answers.** About 6% of held-back short correct answers still fail. Students
  can retake; the lesson tells them what is expected.
- **Same-unit overlap.** Questions in one unit share vocabulary, so 193 questions accept a
  neighbouring question's model answer.

## Proposed engine change (not made here)

Separate from this content repair, and for Robert to decide:

1. **Discount words copied from the question.** In `keywordPass`, before counting, remove
   from the answer every run of four or more words that also appears in the question (both
   normalised). A copied question then scores 0 however the groups are written, and a
   student cannot pad an answer with the question. About ten lines, tested by this file's
   fixtures plus copied-prompt-with-additions cases. It would also protect the 41 other
   courses at once.
2. **Optional "must not contain" forms per question** (`exclude`), for the rare item where
   one phrase marks a known wrong answer. Narrow use only; it is still word matching.
3. **Negation and meaning** need the server-side review already planned
   (`brain/projects/website/OPEN_QUESTIONS.md`, question 4: when an AI grader disagrees with
   a keyword pass, flag or revoke). Keyword lists cannot solve this.

## Not done

- The other 41 courses: 1,547 English prompts still pass as their own answer there. The
  engine change above would cover them; repairing them by hand would take the same work as
  here, course by course.
- The French keyword lists in PR #68's drafts were only re-checked where the English
  corrections required it.
