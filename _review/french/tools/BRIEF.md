# Brief: French draft of one CTS course unit

You are drafting the French edition of one unit of Chapala Theological Seminary
(CTS), a free self-study seminary (English NKJV / Spanish RVG) run by Dr. Wayne
Cook in Mexico. The French edition is for pastors and lay leaders in Kinshasa,
DR Congo, most with little formal training. These are DRAFTS for review by Wayne
and a French-speaking theological reader. Nothing is published.

## Input
`/home/claude/fr/<COURSE>/<COURSE>-unit<N>-source.json`:
- `blocks`: lesson text (`id`, `type`, `en`, and `es_reference` = the existing
  Spanish edition, which shows how the English was already adapted for non-US readers).
- `mc` (20): stem, 4 options, `answer` index, optional `why` explanation.
- `fill` (10): prompt with one `____`, answer, English alternates.
- `sa` (10): prompt, `keywords_en` (usually 8 stems), model answer.

## Output (two files, same folder)
1. `<COURSE>-unit<N>-fr.json`
```json
{"course":"…","unit":N,"source_commit":"<copy from source>",
 "blocks":{"b001":"…French…", "...": "..."},
 "mc":[{"stem":"…","options":["…","…","…","…"],"why":"…"}],
 "fill":[{"prompt":"… ____ …","answer":"…","accept":["…","…","…"]}],
 "sa":[{"prompt":"…","keywords":[["théolog","theolog"],"histor", "..."],"model":"…"}]}
```
Every source block id must appear. Keep `mc`/`fill`/`sa` in the source order and
count. Include `why` only where the source has one. Do not include `answer` in mc
items (the index is shared and must not change).

2. `<COURSE>-unit<N>-review.md` — in ENGLISH, for Wayne and Robert:
   - `## Questions for Wayne` — every place Louis Segond's wording differs from the
     NKJV in a way the lesson or an exam item relies on; any theological
     wording choice you were unsure of. Number them; say what you chose.
   - `## Problems in the English source` — wrong answer keys, `why` explanations
     that belong to a different question, exam items the lesson never teaches,
     model answers that contradict the lesson, factual errors. Give item numbers.
     (Translate faithfully anyway; do not silently "fix" the English meaning,
     except an obviously wrong answer key, which you keep but report.)
   - `## Adaptations` — any US-specific example you adapted for Congolese readers.
   - `## French glossary used` — 5–15 key terms (EN → FR).
   Keep it short. Nothing else.

## Language and Scripture
- Clear, standard, dignified French a Congolese pastor reads easily. Short sentences
  are fine. Address the student with "vous". No anglicisms, no Québécois or
  Belgian regionalisms. Translate meaning, not word order.
- ALL Bible quotations: Louis Segond 1910 (LSG), verbatim. Look up EVERY quoted
  verse with the offline LSG tool (do not use the web, do not quote from memory):
  `python3 /home/claude/fr/tools/lsg.py "Jean 3:16" "Psaume 1:1-3"` (French or
  English book names), or `--search "few exact words"` to locate a verse. Its
  text writes "l'Eternel" without the accent; write "l'Éternel" (and other
  capital accents: "Égypte", "Ésaïe") in the draft, otherwise copy it exactly. Book names and references in French form
  (Genèse, Exode, Lévitique, Nombres, Deutéronome, Josué, Psaumes, Ésaïe, Jean,
  1 Corinthiens…; "Jean 3.16" or "Jean 3:16" — use colon, as the site does).
- Where LSG differs from the NKJV wording the lesson depends on, quote LSG, adjust
  the surrounding sentence so it still makes sense, and list it under Questions.
- Divine name: "l'Éternel" where LSG has it (LSG's rendering of YHWH). If the
  lesson discusses the name YHWH/Yahweh itself, keep that discussion.
- Pronouns for God: lowercase (il, lui), as LSG does. "Saint-Esprit", "Christ",
  "Seigneur", "Parole de Dieu", "Grande Commission" capitalized.
- Keep emoji, HTML tags, attributes and links exactly; translate only visible text.
  Do not add or remove tags. Keep `&nbsp;`/entities as they are.
- Masthead/brand: "Séminaire Théologique de Chapala" for the school name;
  course names in French. "Unité" for Unit.

## Theology (CTS guardrails — do not drift)
- Non-denominational, evangelical. Never call CTS Baptist or any denomination.
- Soteriology Arminian-leaning: conditional election, unlimited atonement,
  resistible grace, faith then new birth. Perseverance/eternal security is an
  OPEN question among evangelicals at CTS — do not render text as affirming or
  denying it more strongly than the English does.
- Eschatology: even-handed among views; do not tilt.
- Never use "mythe"/"mythique" for Scripture's own narratives (comparative use
  for other religions' mythology is fine).
- Do not add content about homosexuality or other topics not in the English.

## Exam rules (the site grades automatically; these matter)
- MC: translate stem, options, why. Option ORDER must stay identical. If an option
  quotes Scripture, use LSG wording consistent with the lesson.
- Fill-in: the French prompt has exactly one `____`. Grading is exact match after
  lowercasing, accent-folding, and dropping ONE leading article (le, la, les, l,
  un, une, des). So the answer is a word or short phrase without article.
  `accept`: 3–5 genuinely correct alternates (synonyms, singular/plural, gender
  forms, the LSG word vs. the common word, hyphen/spacing variants). For a name,
  place, date or number with one clear answer, alternates are optional (spelling
  variants only, e.g. "Moïse"/"Moise" is NOT needed — folding handles accents).
  Make sure the blank is answerable from the French lesson text.
- Short answer: the grader lowercases, strips punctuation, does NOT fold accents,
  and counts a keyword group as hit if any form appears as a SUBSTRING of the
  answer. The student needs 3 hits. Rules:
  - Same number of groups as `keywords_en`.
  - Use stems so inflections match ("promes" → promesse, promesses, promis…
    careful: also check it doesn't catch unrelated words).
  - Every accented stem gets an unaccented twin in the same group:
    `["théolog","theolog"]`, `["alliance"]` needs none.
  - Stems at least 4 letters; check false positives (e.g. "croi" also matches
    "croix"; "foi" matches "foie"/"fois"; "loi" matches "emploi"; "pain" matches
    "peinture"? no — but think about it). Prefer distinctive stems.
  - The French model answer must hit at least 3 groups (aim for 5+), written
    from the French lesson, 2–5 sentences.
  - The prompt text by itself should NOT reach 3 hits.
  - If the English source has no model, write one from the lesson and say so in
    the review file.

## Check before you finish
Run: `python3 /home/claude/fr/tools/validate.py <source.json> <fr.json>`
Fix every ERROR. Review every warning and fix it unless it's a false alarm.
Then reread the whole French lesson once for naturalness and accuracy against
the English. Your final message: one line — unit, validator result, number of
Questions for Wayne, number of English-source problems. Nothing more.

## Settled conventions for the whole French edition (decided 12 Oct 2026 — follow them)
1. When the lesson leans on NKJV wording Segond lacks: quote Segond exactly, then add
   one short sentence on the Hebrew/Greek sense ("le texte hébreu dit littéralement…").
   Do not say "other versions say". Fill-in answers use Segond's word; accept the
   NKJV-sense word too when a student could reasonably give it.
2. Divine name: "l'Éternel" everywhere; "Yahvé" only where the lesson discusses the
   name itself, written "Yahvé (l'Éternel)" at first mention.
3. "God-breathed": quote 2 Timothée 3:16 as Segond ("inspirée de Dieu"); when the
   lesson stresses the image, add "littéralement « soufflée par Dieu »". Fill-ins
   accept both "inspirée" and "soufflée".
4. Priests: Segond's "sacrificateur", "souverain sacrificateur".
5. Names: Segond spellings; fill-ins also accept the familiar form.
6. John 1: "la Parole" (Segond), never "le Verbe".
7. Fixed terms: "couler le moucheron" (Segond, Matt 23:24); "la sainte cène";
   "argument cumulatif"; "Saint-Esprit"; "Grande Commission".
8. Offerings: use the lesson's heading names; mention Segond's name once.
9. Tracks: "Parcours Certificat", "Parcours Associé en divinité", "M.Div.", "Th.M."
   (also "Certificat de ministère" for the 12-course certificate).
   Capitals: lowercase pronouns for God; capitalize titles of Christ the lesson
   capitalizes ("l'Agneau", "le Chef", "le Fils"), as the English does.
10. Short answers: 8 distinct ideas per question; the French prompt must not pass its
   own keywords (the validator warns). This is the standard even where the English
   is weaker.
11. Verse numbers follow the English/NKJV numbering (the offline Segond uses it too),
   including Psalm titles.
12. If the English short answer has NO keywords (keywords_en null, as in Genesis) or a
   placeholder model answer: write 8 French keyword groups in `keywords` and a real
   model answer from the lesson, and note it once in the review file. (Never use a
   separate `keywords_proposed` field.)
13. "Master's track" = "Parcours Master" (not "parcours de maîtrise"/"de master"), matching
   "Parcours Certificat".
