# French translation — batch 3: six topical courses (draft for review)

Prepared 12 Oct 2026 from beta (`0597da9`). The Holy Spirit uses the corrected keys and option
order from PR #74. Nothing here is published.

**Method:** these units follow the shared brief in `tools/BRIEF.md`, including the
edition-wide conventions settled on 12 Oct. Every Bible quotation was checked word for word
against the offline public-domain Louis Segond 1910 text with `tools/lsg.py`. Every unit passes
`tools/validate.py`, and no French short-answer question passes on its own wording. An
independent second pass compared every unit with the English and re-checked the Scripture.

| Course | Units | English words | Questions for Wayne | English-source problems | LSG differences |
|---|---|---|---|---|---|
| La doctrine du Saint-Esprit (The Holy Spirit) | 10 | 17,600 | 46 | 40 | 64 |
| Théologie pratique (Practical Theology) | 10 | 10,400 | 41 | 50 | 45 |
| Sectes et religions du monde (Cults & World Religions) | 10 | 19,000 | 52 | 52 | 53 |
| Prédication doctrinale (Doctrinal Preaching) | 10 | 25,500 | 54 | 61 | 44 |
| Prédication d'évangélisation (Evangelistic Preaching) | 10 | 9,800 | 34 | 59 | 10 |
| Plan de ministère familial des diacres (Deacon & Family Ministry) | 10 | 21,800 | 45 | 34 | 40 |

## Worth Dr. Cook's attention

- **Eternal security (Doctrinal Preaching 4):** the SA7 model answer, in English and French,
  says salvation rests on "the strength of His grip on us". That leans toward eternal security,
  which CTS treats as an open question. It was translated faithfully; keep or soften it in both
  languages?
- **Baptism as a step to salvation:** Evangelistic Preaching 4 and 8 list "be baptized" as the
  third of "Three Steps to Salvation" from Acts 16. It is translated as written and flagged.
- **Proverbs 27:17 (Practical Theology 8):** Segond reads « un homme excite la colère d'un
  homme », the opposite of the lesson's "iron sharpens iron" point.
- **Evangelistic Preaching 5–6:** "form the subject by placing the keyword at the end"
  contradicts the lesson's own examples. SA7 in Unit 2 contradicts the lesson.
- **Short answers that pass by copying the question:** many English prompts pass their own
  keywords (see batch 2). Each case is listed per unit. The French prompts were reworded so
  they don't.

## Still inconsistent (one decision each)

- **Evangelistic Preaching course name:** « Prédication d'évangélisation » (units 1–5, 7) vs
  « Prédication évangélistique » (units 6, 8–10).
- **Deacon & Family Ministry course name:** most units now read « Plan de ministère familial
  des diacres ». Units 1 and 4 were aligned, but confirm the name.
- **Associate track label:** short « Associé : » remains in some units of Cults, Deacon & Family
  Ministry and Practical Theology, against the agreed « Parcours Associé en divinité ».
- **Catalogue button label:** « Catalogue » vs « Catalogue / Catálogo ». This is site-wide,
  so Robert's build may set it anyway.

Each unit's `-review.md` lists its own questions, English-source problems and adaptations.
