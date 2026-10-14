# French drafts — beta publication and review packets

Machine drafts of forty-one courses (464 packets, including the WiseSpeak and Counseling Situations page frames) in French, for pastors in Kinshasa (DR Congo).

**Status, 13 October 2026: all forty-one courses are published on beta as French machine drafts**
(review notice shown, pages noindex), together with Old Testament Survey (drafted separately,
see `docs/french-pilot.md`), Narrative Preaching, Counseling and Ethics (folders
`NarrativePreaching`, `Counseling`, `Ethics`), the French interface, French emails and
certificates. Textbooks and required readings follow separately. Robert authorized beta
publication on 12 October. The forty lesson-collection courses are imported into canonical
`src/content`; WiseSpeak uses its packets in its French build. Corrections now go in the
canonical fields (CMS or a branch), not in these packets, except for WiseSpeak and the three
static-page courses, whose French builds read from here. See `docs/french-beta-publication.md`
for editing and provenance. The batch notes below record how the drafts were made; their
"review-only" wording is historical.

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
| `CTSRE` | Ruth et Esther (Ruth and Esther) | 1–9 |
| `CTSGenesis` | Cours intensif sur la Genèse (Genesis Intensive) | 1–12 |
| `CTSBibleCharacters` | Personnages de la Bible (Bible Characters) | 1–12 |
| `CTSBibleCharacters2` | Personnages de la Bible II (Bible Characters II) | 1–11 |
| `CTSParables` | Les paraboles de la Bible (Parables of the Bible) | 1–15 |
| `CTSHS` | La doctrine du Saint-Esprit (The Doctrine of the Holy Spirit) | 1–10 |
| `CTSPentecostal` | Le pentecôtisme et le mouvement charismatique | 1–12 |
| `CTSApol` | Apologétique (Apologetics) | 1–10 |
| `CTSHermeneutics` | Herméneutique (Hermeneutics) | 1–11 |
| `CTSLA` | Initiation aux langues bibliques (Language Appreciation) | 1–11 |
| `CTSAL` | Administration et leadership de l'Église | 1–10 |
| `CTSWorship` | Le culte (Worship) | 1–11 |
| `CTSCE` | Éducation chrétienne (Christian Education) | 1–10 |
| `CTSMissions` | Missions mondiales (World Missions) | 1–10 |
| `CTSCults` | Sectes et religions du monde (Cults) | 1–10 |
| `CTSPT` | Théologie pratique (Practical Theology) | 1–10 |
| `CTSDP` | Prédication doctrinale (Doctrinal Preaching) | 1–10 |
| `CTSEvanPreach` | Prédication d'évangélisation (Evangelistic Preaching) | 1–10 |
| `CTSDeaconFamilyMinistry` | Plan de ministère familial des diacres | 1–10 |
| `CTSCS` | Situations de relation d'aide (Counseling Situations) | 0 (page frame), 1–12 |
| `CTSCG` | Croissance de l'Église (Church Growth) | 1–12 |
| `CTSRadical` | Le christianisme radical (Radical Christianity) | 1–13 |
| `CTSWR` | Les religions du monde (World Religions) | 1–12 |

Each unit has three files:

- `…-review.md`: the readable review document. Questions for Wayne, Bible quotations
  (Louis Segond 1910, ⚠ where it differs from NKJV), terms to confirm, then the lesson,
  multiple choice (✓ = keyed answer), fill-ins and short answers, French above the English.
- `…-fr.json`: the French data for import (lesson blocks by id; `mc`, `fill`, `sa` in
  source order; `notes`).
- `…-source.json`: the English source used (plus Spanish text where supplied).
  Original commits are recorded in the packet reviews. The consolidation manifest
  records the new packets' provenance and subsequent MC alignment.

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

All 464 packets, including the 349 review-only packets, pass the repaired validator.
It supports both original list-form blocks and newer block dictionaries, and
both English keyword field names. Genesis requires eight French keyword groups
when the source has none. WiseSpeak retains its legacy empty packet keywords;
its French build supplies grading keys from `tools/data/french-wisespeak-keywords.json`.
No Batch 2–5 French short-answer prompt passes its own keywords. These checks
do not establish French theological approval.

Run the compatibility and packet regression checks with:

    python3 _review/french/tools/test_validate.py

## Batch 3 (12 Oct 2026)

Life of Christ, 1 Peter, Galatians and Revelation (49 units), made and checked the same way.
Start with **BATCH3-FINDINGS.md**. Life of Christ had no Spanish on the site; its French was made
from the English alone.

## Batch 4 (12 Oct 2026)

Ruth and Esther, Genesis, Bible Characters I and II (44 units). Start with **BATCH4-FINDINGS.md**.
The English Genesis short answers have no keywords (any answer passes); the French Genesis
drafts have 8 keyword groups and a real model answer for each, written from the lesson.

## Batch 5 (13 Oct 2026)

Parables, Holy Spirit, Pentecostalism and Apologetics (47 units). Start with **BATCH5-FINDINGS.md**.
Holy Spirit units 7–10 had scrambled English answer keys; the fix is merged pull request #83. The French
options are in the same order, so the corrected keys serve the French too.

## Consolidated new courses (13 Oct 2026)

163 packets from PRs #76, #79 and #80 add fifteen courses. PR #81 adds no new
course coverage. See **CONSOLIDATION-2026-10-13.md** for the selection and
**CONSOLIDATION-2026-10-13.json** for immutable source commits and MC alignment.
The alternate translations of existing courses were excluded; existing packets,
including the repaired Genesis keyword groups, are retained.

**SUMMARY-batch2.md** through **SUMMARY-batch5.md** preserve the original
reports from all four PRs, including findings on duplicate courses. These are
historical reports: claims of validation and unresolved answer-key problems
must be read with the consolidation status. The 195 Language Appreciation / Holy
Spirit keys and Church Growth 11 MC19 were corrected through #83; Revelation
12 MC19 through #82. Other source-content and theological findings still need review.
