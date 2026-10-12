# French drafts — foundation courses (for review, not published)

Machine drafts of ten courses (115 packets, including the WiseSpeak page frame) in French, for pastors in Kinshasa (DR Congo).
Old Testament Survey, the seventh, was drafted earlier as the pilot (see `docs/french-pilot.md`).
**Nothing here is read by the build or shown on the site.** Course data in `src/content`
is unchanged.

Start with **SUMMARY.md**: what was done, problems found in the English site, and the
decisions Dr. Cook needs to make for the whole French edition.

## Folders

| Folder | Course | Units |
|---|---|---|
| `CTSNT` | Survol du Nouveau Testament (New Testament Survey) | 1–12 |
| `CTSST` | Théologie systématique (Systematic Theology) | 1–13 |
| `CTSEvangelism` | Évangélisation (Evangelism) | 1–13 |
| `CTSPM` | Ministères pastoraux (Pastoral Ministries) | 1–12 |
| `CTSCH` | Histoire de l'Église (Church History) | 1–10 |
| `WiseSpeak` | WiseSpeak : l'art de la prédication (Preaching) | 0 (page frame), 1–10 |
| `CTSBible` | Comment nous avons reçu la Bible (How We Got the Bible) | 1–10 |
| `CTSPent` | Le Pentateuque (Pentateuch) | 1–12 |
| `CTSJosh` | Cours intensif sur Josué (Joshua Intensive) | 1–10 |
| `CTSPsalms` | Le livre des Psaumes (Psalms) | 1–12 |

Each unit has three files:

- `…-review.md`: the readable review document. Questions for Wayne, Bible quotations
  (Louis Segond 1910, ⚠ where it differs from NKJV), terms to confirm, then the lesson,
  multiple choice (✓ = keyed answer), fill-ins and short answers, French above the English.
- `…-fr.json`: the French data for import (lesson blocks by id; `mc`, `fill`, `sa` in
  source order; `notes`).
- `…-source.json`: the English source used, taken from commit `2887884` (plus the Spanish
  text for reference).

## How the drafts were made and checked

1. Each unit was translated from the English source. Bible quotations follow Louis Segond
   1910, looked up online.
2. `check_french.py` mirrors the site's grader (`public/assets/js/cts-engine.js`). It confirms
   that every block is present, HTML tags match, each fill-in has exactly one blank, option
   counts match, and each French short-answer model passes its own keywords. All 71 units pass.
   Run it with: `python3 check_french.py <unit>-source.json <unit>-fr.json`
3. A second, independent pass compared every unit with the English and fixed about 135
   small problems.

## What an auditor should look for

- **Meaning:** French that says something different from the English (omissions, additions,
  wrong names, dates or numbers).
- **Exams:** multiple-choice options must stay in the English order, because the answer index
  is shared across languages. Fill-in answers must fit the blank, and accepted alternates
  must not be wrong answers. Short-answer keywords must not be so short or loose that a wrong
  answer passes, nor so strict that a correct French answer fails. Keyword matching is
  case-insensitive substring matching, and **accent-sensitive**.
- **Theology:** non-denominational, Arminian-leaning soteriology as in the English.
  Eschatology views are presented even-handedly. Scripture's narratives are never called
  « mythe ».
- **French:** natural, respectful French for Congolese pastors; Louis Segond vocabulary.

Please report findings as text (file, block or question number, problem, suggested
fix). Do not edit the files directly.

## Not yet done

- Review by a French-speaking reader with theological training.
- Import into `src/content` (Robert). Follow `docs/french-pilot.md`: mark the text
  `machine`, add the source hash, and regenerate the CMS config.
- WiseSpeak is still the single-page `public/CTS_WiseSpeak_Preaching.html`, so its block ids
  are sequence numbers within this packet, not lesson-data ids.

## Batch 1 of the remaining courses (12 Oct 2026)

How We Got the Bible, Pentateuch, Joshua and Psalms (44 units). Start with
**BATCH1-FINDINGS.md**. Same file layout as above. Every Bible quotation was checked word
for word against an offline public-domain Louis Segond 1910 text (`tools/lsg.py`; the
text itself is not committed, see the script). Each unit passes `tools/validate.py`
(same grading rules as `check_french.py`, plus checks that a French prompt cannot pass its
own keywords), then had an independent second check. `tools/BRIEF.md` holds the
translation rules and the edition-wide conventions Dr. Cook settled on 12 Oct.

## Technical staging review (12 October)

Both packet formats can be checked with either entry point:

    python3 _review/french/tools/validate.py COURSE-unitN-source.json COURSE-unitN-fr.json
    python3 _review/french/check_french.py COURSE-unitN-source.json COURSE-unitN-fr.json

Both return a nonzero exit status on an error. All 115 packets passed after the validator repair. This checks structure and grading, not theological accuracy. The English corrections in PR #65 postdate the source packets; update affected NT Survey and Evangelism drafts before import. See `docs/beta-staging-review-2026-10-12.md`.
