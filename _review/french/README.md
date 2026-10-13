# French drafts — beta publication and review packets

Machine drafts of fourteen courses (161 packets, including the WiseSpeak page frame) in French, for pastors in Kinshasa (DR Congo).
The first ten courses (115 packets) are published on beta. The four Batch 2 courses
(46 packets) remain review-only drafts and are not imported or displayed on the site.
Old Testament Survey was drafted separately as the pilot (see `docs/french-pilot.md`).
Robert authorized beta publication of the first ten courses on 12 October. Nine courses
are imported into canonical `src/content`; WiseSpeak uses these packets in its
French build. See `docs/french-beta-publication.md` for editing and provenance.

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
| `CTSJohn` | L'Évangile de Jean (Gospel of John) | 1–12 |
| `CTSMatt` | Cours intensif sur Matthieu (Matthew Intensive) | 1–13 |
| `CTSActs` | Cours intensif sur les Actes (Acts Intensive) | 1–11 |
| `CTSRomans` | L'Épître aux Romains (Romans) | 1–10 |
| `CTSLOC` | La vie du Christ (Life of Christ) | 1–10 |
| `CTS1Peter` | Cours intensif sur 1 Pierre (1 Peter Intensive) | 1–12 |
| `CTSGalatians` | Cours intensif sur Galates (Galatians Intensive) | 1–12 |
| `CTSRev` | Cours intensif sur l'Apocalypse (Revelation Intensive) | 1–15 |

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
   counts match, and each French short-answer model passes its own keywords. All 115 packets pass.
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
- Human review of the published beta drafts and subsequent corrections.
  Collection imports are marked `machine` with source hashes; the CMS config is regenerated.
- Review and a separate import/publication change for the four Batch 2 courses.
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

## Batch 2 (12 Oct 2026)

John, Matthew, Acts and Romans (46 units), made and checked the same way as batch 1.
Start with **BATCH2-FINDINGS.md**. These are new translations of existing courses.
The Batch 2 PR does not change the earlier Batch 1 packets. These four courses
remain review-only until a separate import/publication change.

## Technical staging review (12 October)

Both packet formats can be checked with either entry point:

    python3 _review/french/tools/validate.py COURSE-unitN-source.json COURSE-unitN-fr.json
    python3 _review/french/check_french.py COURSE-unitN-source.json COURSE-unitN-fr.json

Both return a nonzero exit status on an error. All 115 packets passed after the validator repair. This checks structure and grading, not theological accuracy. The English corrections in PR #65 postdate the source packets. The beta importer applies explicit corrections to the published NT Survey and Evangelism fields while retaining the original packets as review history. See `docs/beta-staging-review-2026-10-12.md`.

The additional 46 Batch 2 packets also pass the repaired `tools/validate.py`
validator with 27 warnings and no errors. No French short-answer prompt passes
its own keywords. These checks do not establish French theological approval.

## Batch 3 (12 Oct 2026)

Life of Christ, 1 Peter, Galatians and Revelation (49 units), made and checked the same way.
Start with **BATCH3-FINDINGS.md**. Life of Christ had no Spanish on the site; its French was made
from the English alone.
