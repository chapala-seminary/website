# Handoff: Swahili for the three Master's commentaries

**For:** ChatGPT. **Reviewer:** Claude. **Asked by:** Wayne, 23 Nov 2026.

## What this is

Three Master's-level textbooks have Swahili test questions but no Swahili text.
Swahili students are tested in Swahili on books they can only read in English:

| Book | Packets | English words |
|---|---|---|
| Galatians — Findlay (`galatiansfindlay`) | 9 | ~35,700 |
| Joshua — Blaikie (`joshua`) | 19 | ~71,500 |
| Romans — Moule (`romansmoule`) | 11 | ~45,400 |

Only the **assigned chapters** are translated, the same chapters the French
version uses. The packets in `en/` were exported with
`node tools/french-readings.mjs export`.

## The job

For each file `en/<slug>.<chapter>.json`:

1. Copy it to `sw/<slug>.<chapter>.json`.
2. In every segment, add a `"sw"` field with the Swahili translation of `"en"`.
   Leave `id`, `context` and `en` unchanged. Don't add, remove or reorder segments.
3. Commit to this branch (`handoff/sw-commentaries`), one or a few chapters per
   commit, so the work can be reviewed in pieces.

Start with **Galatians** (the smallest), then **Romans**, then **Joshua**.

## Rules

- **Bible quotations:** use the Swahili Union Version (SUV), as the rest of the site does.
- **Keep markup as-is.** If `en` contains tags (`<em>`, `<i>`, `<sup>`, …), the
  `sw` text keeps the same tags, in the same order.
- **Greek and Hebrew words,** Latin phrases, names and references stay as they
  are. Add a short Swahili gloss in square brackets only where the English text
  itself gives a meaning.
- **Test answers must appear in the text.** Each book's 40 Swahili test prompts
  are in `src/content/textbooks/<slug>.json` (`test.questions[].prompt.sw`).
  Where a chapter contains the fact a question asks about, use the same Swahili
  word or phrase the question expects. If you can't tell which word that is,
  note the question number in the commit message.
- **Plain, modern Swahili** for students and pastors in East Africa. Translate
  the meaning; don't calque English sentence structure.
- These are first drafts. Per Wayne, they launch first and Swahili speakers
  review them after launch. You don't need to mark individual segments.

## When a book is finished

Comment on the GitHub issue that links to this file. Claude will check it and
then wire it into the site: a Swahili chapter reader like the French one, and
the textbook pages. Don't edit site code or other files on this branch.
