# French draft publication on beta

Robert authorized publishing Wayne's French drafts on beta on 12 October 2026, with improvements after publication. This changes the earlier review-before-publication sequence for staging. It does not approve a production release or describe the drafts as human-reviewed.

## Courses

| Course | French entry | Units |
|---|---|---:|
| New Testament Survey | /fr/CTSNTUnit1.html | 12 |
| Systematic Theology | /fr/CTSSTUnit1.html | 13 |
| Evangelism | /fr/CTSEvangelismUnit1.html | 13 |
| Pastoral Ministries | /fr/CTSPMUnit1.html | 12 |
| Church History | /fr/CTSCHUnit1.html | 10 |
| How We Got the Bible | /fr/CTSBibleUnit1.html | 10 |
| Pentateuch | /fr/CTSPentUnit1.html | 12 |
| Joshua Intensive | /fr/CTSJoshUnit1.html | 10 |
| Psalms | /fr/CTSPsalmsUnit1.html | 12 |
| WiseSpeak Preaching | /fr/CTS_WiseSpeak_Preaching.html | 10 on one page |
| Old Testament Survey | /fr/CTSUnit1.html | 13 |

117 collection-based units plus the ten-unit WiseSpeak page are translated. Reading rooms and textbooks retain their existing translations/fallbacks.

Old Testament Survey is not one of Wayne's delivered drafts. Claude drafted its 13 units on 13 October 2026 at Robert's request, directly in the canonical `src/content/lessons/CTS` and `src/content/units/CTS` French fields, marked `machine` with source hashes like the other courses. It awaits French theological review. Scripture follows Louis Segond 1910 (with Segond verse numbering where it differs, e.g. Micah 5:1, Hosea 14:5, Isaiah 9:5); a few answer keys follow Segond's wording (for example Daniel 3:25 « un fils des dieux »). Points for the French reviewer, and English-source problems found while translating, were reported to Robert and Wayne on 13 October 2026; the English was not changed. The French pages are graded by the shipped `cts-engine.js`, like every other unit page; `cts-genesis-engine.js` is used only by the Genesis certificate page.

## Provenance and editing

The nine collection-based courses use canonical `src/content/lessons` and `src/content/units` French fields, marked `machine` with source hashes. Edit those fields in the CMS or on a branch; mark actual reviewed corrections `machine-edited` or `human`. `tools/import-french-drafts.mjs --write` is an initial import tool and refuses to overwrite reviewed work. It validates source correspondence, preserves MC answer indexes and maps option order/explanations to the corrected English banks. Specific updates are in `tools/data/french-beta-corrections.json`.

Church History's source has no model answers; its delivered French model answers are imported without inventing English or Spanish models. Optional model fields can exist in one language, and the engine shows a model only when one exists for the reader/source language.

WiseSpeak keeps its original page and saved-progress format. `tools/french-wisespeak.mjs` maps all 511 static draft blocks by their English source and augments only the French build with French exam data. Correct its draft prose, prompts, choices and models in `_review/french/WiseSpeak`. Its source packets omitted the existing essay keys, so the importer derives concept groups from the actual page's English keys and translates them through `tools/data/french-wisespeak-keywords.json`. French and English source answers are accepted without counting a concept twice. Fill answers use French/English on the French route; English/Spanish behavior is unchanged elsewhere.

Draft French pages display a review notice and remain noindex. Existing course gates, pass thresholds, stored progress and optional textbook/reading requirements remain in force. Production main is unchanged.

## Email language

The existing students.lang field now accepts en, es and fr. Registration and progress sync save the current coursework preference, and verification requests can update it. Verification, recovery, certificate and reminder emails select one language; legacy records with no preference default to English. Recovery and printable-certificate links point to the matching language route. No schema migration is needed. Staff summaries remain staff messages.

## Validation

The grading checks exercise every imported French/source answer with the shipped engine. Browser checks cover all language routes and WiseSpeak's model grading, choice feedback, fills and saved attempts. The full build and repository test suite passed on 12 October 2026 with exit 0 and no browser skips, including 7,219 French/source answer checks, all 100 WiseSpeak French models, single-language email/link checks, real Worker language persistence, confirmation-link/code options, credential boundaries, privacy deletion, record merging, throttling and all 5,778 page/language/device renders. The English/Spanish content baseline remains unchanged across 50,396 comparisons; all 208 imported files retain their original source-language data.
