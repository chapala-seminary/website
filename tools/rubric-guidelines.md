# How to write a grading rubric for a short-answer question

For agents drafting rubrics across the catalog. The format and the reasons are
in `docs/ai-grading.md` section 3; this file is the working method. The pilot
rubrics in `src/content/units/CTSJohn` and `src/content/units/CTSRomans` are
the reference. Read two or three of them before you start.

## What a rubric is for

An AI model reads a student's answer and decides, point by point, whether each
point was made. A question is **met** only when every **essential** point was
made. A student passes the short-answer part with 9 of 10 met. So the
essential points decide who passes. Write them as the judge a faculty member
would be content to defend.

## The format

Add `rubric` to each `sa` item, directly after `model` and before `tr`:

```json
"rubric": { "v": 1, "points": [
  { "id": "a", "essential": true,  "en": "..." },
  { "id": "b", "essential": false, "en": "..." }
] }
```

- 2 to 4 points. Ids are `a`, `b`, `c`, `d`, in that order.
- At least one point is essential. Usually one or two. Three only when the
  question truly asks for three separate things (see "list" questions below).
- `en` is one sentence, a non-empty string, at most 200 characters. English only.
- `v` is 1 for a new rubric.
- Write the data with `JSON.stringify(unit, null, 1) + "\n"`, which is how the
  files are already written, so the diff shows only the added field.
- Check with `node tools/verify-rubrics.mjs` (or `--report` for coverage).

## How to draft

1. Read the lesson (`src/content/lessons/<Prefix>/<n>.json`, English text of
   each block). The lesson is the authority on what this course teaches.
2. Read the question and its English model answer.
3. Ask: **what must a student who read the lesson say to answer this question
   as asked?** Those are the essential points. Pull them from the model answer
   and check them against the lesson.
4. Add 1 to 2 non-essential points for enriching detail the model answer gives
   (an example, a Scripture reference, a named source). These help the grader
   and the faculty reviewer see a strong answer, but a student can pass
   without them.
5. Cut anything that is only an illustration of the lesson's point rather than
   the point itself.

## Rules for a point

- **One checkable claim.** A grader should be able to answer yes or no by
  finding the claim in the answer. No "and" joining two separate ideas, unless
  they are one idea (for example "fully God and fully man").
- **Say the idea, not the wording.** A student who writes the idea in other
  words must still meet it. Include the idea and a clause of meaning, not a
  list of required keywords. Do not require a specific phrase from the lesson.
- **Not so narrow that a right answer fails.** Do not require a name, date,
  number, verse reference or illustration unless the question asks for exactly
  that.
- **Not so broad that restating the question meets it.** "Explains what John
  1:1 teaches" is met by repeating the prompt. State what it teaches.
- **Essential means indispensable to the question as asked.** If the question
  would still be answered well without it, it is non-essential.
- **Be faithful to the lesson.** Where the lesson takes a position (for
  example on Romans 7, on "all Israel", or on baptism), the rubric follows the
  lesson, even if you would answer differently. If the model answer and the
  lesson disagree, follow the lesson and note it in your report.
- **No personal data, no secrets, nothing from students.**

### List and compare questions

When the question asks "list the three...", "contrast X and Y", or "name the
four stages":

- Make one point per required item, up to four, and mark each essential.
- If there are more than four, group related items into one point
  ("Creation groans, believers groan, the Spirit groans" is three points; but
  seven gifts of 12:6-8 are one point "names several of the gifts").
- A "contrast" gets one point per side.

### "What does the illustration show" questions

Several questions ask about an anecdote. Make the *lesson drawn from the
story* essential and the story's details non-essential. A student who gets the
point in other words should not fail for forgetting the name.

## Worked examples

### Good 1: one idea per point, essentials are the bare answer

CTSJohn unit 1, question 2: *What does John 1:3 teach about the Word and
creation, and why does it matter?*

- (essential) All things were made through the Word, and nothing that exists
  was made without Him.
- (essential) This matters because it shows He is God: only God is the Maker of
  everything.
- The One who would be pierced is the same One who made the world.

Why it works: "and why does it matter" is two parts of the question, so there
are two essentials. The nail-pierced-hands line is lovely detail but not
needed.

### Good 2: groups a list so no point is a list

CTSRomans unit 4, question 1: *List and briefly explain the benefits of
justification in Romans 5:1-2.*

- (essential) Peace with God: the hostility is ended; the war between holy God
  and sinner is over.
- (essential) Access by faith into the grace in which we stand: continuing
  entry into God's presence.
- (essential) Hope of the glory of God: a confident expectation of a guaranteed
  future.

Why it works: the question asks for three benefits, so each is its own
essential point. Each carries a clause of meaning, so "peace" alone is not
enough but "no more enmity with God" is.

### Good 3: essentials are the lesson drawn, not the story

CTSJohn unit 4, question 4: *Tell the story of Mary Reed and explain what it
illustrates about the compassion of the Bread of Life.*

- (essential) Mary Reed went to India and, on contracting leprosy herself,
  accepted it and served a colony of lepers whom no one would approach.
- (essential) It illustrates Christlike compassion carried through a
  surrendered life; she served them for decades until she died among them.

Why it works: a student need not remember 1858, Ohio, 1943 or the number of
lepers. They must tell what she did and what it shows.

### Bad 1: too broad, met by repeating the question

- "The student explains what John 1:1 teaches about the Word."

Fix: state the teaching. "The Word is eternal: He already existed in the
beginning and was not made." and "The Word is God in the fullest sense, not a
lesser god or a creature."

### Bad 2: too narrow, fails right answers in other words

- (essential) "John says the Word 'tabernacled' among us, using the exact
  word 'tabernacled'."

Fix: "'Dwelt' means He pitched His tent among us, as God's glory once filled the
tabernacle." and make it non-essential. The essential idea is that the eternal
Word truly became a human being.

### Bad 3: two claims in one point, and a detail made essential

- (essential) "Philip said 200 denarii would not feed them and Andrew found a
  boy with five loaves and two fish and Jesus already knew what He would do."

Why it fails: a student who gets Philip right and mixes up Andrew cannot be
told apart from one who gets it all wrong, because the whole is one yes or no.
It also makes the quantities essential.

Fix: split it. (essential) Philip calculated and despaired of feeding them.
(essential) Andrew found a boy's small lunch but doubted it would help.
Jesus already knew what He would do (non-essential).

## Also remember

- Questions that ask for "Dr. Cook's testimony" or an anecdote are rare. Treat
  the testimony as non-essential detail and the lesson drawn as essential.
- If a model answer looks wrong, thin, or disagrees with the lesson, do not
  fix the model answer. Write the rubric from the lesson and list the problem
  (course, unit, question number, what is off) in your report.
- Do not touch `keywords` or `model`. Do not reorder keys. Do not add `es` or
  `fr` to the rubric.
