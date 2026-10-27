# Pentecostal four-course reading-exam localization preflight — 27 October 2026

**Scope:** Read-only examination of the exact staged website branch `claude/pentecostal-required` before its planned beta release. This is a nonproduction, source-only handoff to Claude; it does not edit Claude's course content, student records, answer keys, or release branches. The private assessment-keys repository and PR #7 were inaccessible to the AI account (GitHub 404); no private-key validation is claimed.

## Verified manifest-level finding

All four new Pentecostal required-reading bank JSON files contain 40 questions each, and each question has `en`, `es`, and `fr` prompt text. However **none** of the four files has a `fr` entry in either its top-level `title` or `room` object. Both fields have only `en` and `es`. This is a verified *data-level omission*, not yet proof of a user-visible defect: the page renderer might supply independent French strings. Test the actual rendered French exam introduction, course title, and reading-room description before release.

Exact staged paths and blob SHAs:
- `src/content/readings/elecpconereadings.json` — `2e73d26817797f3591d33f808b419675de18c06b`
- `src/content/readings/elecpctworeadings.json` — `7faa302b806dfbdab3af168bce3691e8470d864f`
- `src/content/readings/elecpcthreereadings.json` — `22a14a684542141dbdfe051396fb25540a9385f9`
- `src/content/readings/elecpcfivereadings.json` — `8fd9c378802bb459f34efdc0795aad9c9ff81418`

## Proposed French metadata for editorial review (not automatically approved)

| Slug | `title.fr` | `room.fr` |
|---|---|---|
| elecpconereadings | Histoire et développement du pentecôtisme : lectures obligatoires | les cinq lectures de la salle de lecture « Histoire et développement du pentecôtisme » |
| elecpctworeadings | Théologie pentecôtiste et charismatique : lectures obligatoires | les cinq lectures de la salle de lecture « Théologie pentecôtiste et charismatique » |
| elecpcthreereadings | Le Saint-Esprit, les dons spirituels et le discernement : lectures obligatoires | les cinq lectures de la salle de lecture « Le Saint-Esprit, les dons spirituels et le discernement » |
| elecpcfivereadings | Leadership pastoral pentecôtiste et missions mondiales : lectures obligatoires | les cinq lectures de la salle de lecture « Leadership pastoral pentecôtiste et missions mondiales » |

Minor English data error in `elecpcthreereadings.json`: `room.en` currently says `the five readings in the The Holy Spirit, Spiritual Gifts, and Discernment Reading Room` (double 'the'). Fix if this field is actually rendered; avoid changing strings if they are deliberately part of a stable snapshot without corresponding tests.

## Release acceptance and student-retention safeguards

1. In a beta browser, select French and inspect each of the four reading-exam pages and their reading-room links, checking the heading, room description, questions, and answer-entry instructions. Record actual UI evidence before calling the omission a defect. Verify `fr` title/room fallback is intentional or add translated fields and rerun the generator/tests.
2. Confirm the eight private key maps in assessment-keys PR #7 correspond to the eight staged public banks by slug, question count/order, and language-specific accepted responses (e.g., `March/marzo/mars`). The public manifests alone cannot establish correct grading. Keep private keys out of the website repo.
3. Eight new Pentecostal tests have `requiredFrom=2026-10-29T06:00:00Z` (midnight Mexico City, 29 Oct). **If the release is delayed beyond that instant**, they may become mandatory immediately upon deployment, rather than allowing an introductory window. This is a conditional timing risk; verify server behavior and ask Wayne to decide whether to retain or reschedule the effective date before the owner-approved release.
4. The release remains blocked: at the 27 Oct 01:xx Mexico City check, `beta` was identical to `c6110458213ee676833149a8f30c8b121572ec89`; `claude/pentecostal-required` was two commits ahead and zero behind. No exact-head beta CI has run for the new release branch. Do not open beta→main PR until beta moves and its exact-head workflow succeeds.

**Strategic improvement:** introduce a pre-release EN/ES/FR metadata completeness assertion for *each new required test* (including title/room) plus a private-bank slug/answer-variant reconciliation report that emits counts only. This catches translation regressions without exposing answers. Any acceptance changes remain with Claude/Robert; academic, timing and legal decisions remain with Wayne.


## Verified renderer trace — 27 October 2026

A source-path trace on `claude/pentecostal-required` resolves the French metadata question:

- `src/pages/[readingtest].astro` supplies the French page title through `frReadingsTitle(reading.course)` and the French introduction/room phrase through `frReadingsRoom(reading.course, reading.page)`.
- `src/lib/french-titles.ts` builds both values from the canonical French course title and also supplies the French exam browser title.
- `public/assets/js/cts-textbook.js` does not consume the manifest's top-level `title` or `room` fields for the question interface; the question prompts use their language-specific prompt data.

Therefore, the missing manifest-level `title.fr` and `room.fr` entries are not a verified French user-interface defect in this renderer. Treat adding them as optional data completeness, not a release blocker. The independent English `elecpcthreereadings.json` `room.en` phrase with doubled “the” remains a confirmed generator/data typo and should be corrected before beta if that metadata is retained.
