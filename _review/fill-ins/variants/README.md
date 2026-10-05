# Fill-in-the-blank accepted answers — review sheet (4 Oct 2026)

Dr. Cook asked that every fill-in question accept three to five reasonable
answers in each language, as the textbook and required-reading tests do.
Before this pass most of the 5,050 unit fill-ins (466 engine units plus the
four single-page courses) accepted one or two.

**What was done.** For every question short of three, alternatives were
drafted (`<course>.json`: 10,072 proposals), then reviewed strictly, one by
one, against the sentence (`<course>.reviewed.json`). A form was kept only if
a teacher would mark it right without hesitation: a true synonym in that
sentence, singular/plural, a fuller or shorter form of the same name, digits
for a number, a standard alternate spelling, or the same word in another
standard Bible translation for a quoted verse. Anything that is a different
person, place or idea, broader or narrower, a paraphrase, or a Spanish form
that does not agree with the sentence was removed. **2,546 forms were added;
7,512 were removed**, each with its reason in `<course>.removed.txt`.

**Why many questions still have fewer than three.** Most unit fill-ins test
one specific word — a name (Gomer, Potiphar), a place, a term from the
lesson, or a word in a quoted verse. Giving those three "accepted" answers
would mean accepting answers that are wrong. They are listed, per course and
language, in `<course>.short.txt` (written by the drafters; counts there are
from before the review).

**To restore a removed form**, copy it into a variants file in the same shape
(`{ "<course>/<unit>#<n>": { "en": [...], "es": [...] } }`) and run
`node tools/fill-variants.mjs --apply <file>`; for the four single-page
courses, then `node tools/add-fill-ins-page.mjs --course <course> --write`.
`node tools/fill-variants.mjs --check` lists every question still outside 3–5.

| Course | Questions | 3+ in both languages | EN below 3 | ES below 3 | Forms removed in review |
|---|---|---|---|---|---|
| CTS | 130 | 29 | 91 | 99 | 138 |
| CTS1Peter | 120 | 20 | 86 | 93 | 236 |
| CTSAL | 100 | 18 | 69 | 77 | 190 |
| CTSActs | 110 | 16 | 86 | 87 | 88 |
| CTSApol | 100 | 19 | 67 | 80 | 147 |
| CTSBible | 100 | 34 | 55 | 62 | 82 |
| CTSBibleCharacters | 120 | 20 | 93 | 96 | 139 |
| CTSBibleCharacters2 | 110 | 23 | 75 | 83 | 119 |
| CTSCE | 100 | 9 | 85 | 89 | 213 |
| CTSCG | 120 | 28 | 78 | 80 | 127 |
| CTSCH | 100 | 27 | 66 | 61 | 84 |
| CTSCS | 130 | 25 | 88 | 98 | 233 |
| CTSCults | 100 | 11 | 81 | 88 | 121 |
| CTSDP | 100 | 15 | 72 | 81 | 202 |
| CTSDeaconFamilyMinistry | 100 | 17 | 66 | 77 | 154 |
| CTSEvanPreach | 100 | 13 | 80 | 82 | 172 |
| CTSEvangelism | 130 | 31 | 88 | 91 | 220 |
| CTSGalatians | 120 | 13 | 95 | 105 | 214 |
| CTSGenesis | 120 | 25 | 88 | 89 | 148 |
| CTSHS | 100 | 12 | 77 | 84 | 165 |
| CTSHermeneutics | 110 | 21 | 83 | 84 | 200 |
| CTSJohn | 120 | 12 | 100 | 105 | 181 |
| CTSJosh | 100 | 8 | 84 | 86 | 175 |
| CTSLA | 110 | 22 | 83 | 84 | 92 |
| CTSLOC | 100 | 3 | 92 | 96 | 107 |
| CTSMatt | 130 | 17 | 100 | 107 | 189 |
| CTSMissions | 100 | 3 | 88 | 95 | 199 |
| CTSNT | 120 | 15 | 95 | 99 | 112 |
| CTSPM | 120 | 10 | 104 | 103 | 252 |
| CTSPT | 100 | 11 | 77 | 86 | 227 |
| CTSParables | 150 | 127 | 5 | 20 | 14 |
| CTSPent | 120 | 20 | 90 | 97 | 199 |
| CTSPentecostal | 120 | 26 | 85 | 88 | 139 |
| CTSPsalms | 120 | 11 | 102 | 102 | 159 |
| CTSRE | 90 | 18 | 65 | 67 | 119 |
| CTSRadical | 130 | 20 | 95 | 104 | 264 |
| CTSRev | 150 | 11 | 122 | 134 | 163 |
| CTSRomans | 100 | 12 | 72 | 83 | 182 |
| CTSST | 130 | 31 | 83 | 96 | 234 |
| CTSWR | 120 | 20 | 87 | 94 | 147 |
| CTSWorship | 110 | 18 | 80 | 89 | 166 |
| counseling | 110 | 13 | 83 | 93 | 281 |
| narrative | 80 | 12 | 61 | 66 | 130 |
| wisespeak | 100 | 16 | 76 | 81 | 146 |
| ethics | 100 | 12 | 80 | 84 | 243 |
