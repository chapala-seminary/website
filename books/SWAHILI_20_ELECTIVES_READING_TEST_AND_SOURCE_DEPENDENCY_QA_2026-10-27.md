# CTS Swahili elective prepublication QA — 27 October 2026
**Status: NONPRODUCTION REVIEW HANDOFF. No approval to publish, merge, alter grades, or change private keys.**
**Scope:** `handoff/swahili-electives` at `b9d08cd1916d145da3972c4f90005e45d9871b1b`; 20 course folders A-C1…D-C5. Read-only inspection by chapalatheological-ai. This audit does not certify translation accuracy, source rights, or private answer-key parity.

## Verified structural check (20/20)
Read all twenty `translations/sw/electives/<CODE>/readings-test.sw.md` files. Each contains exactly 40 consecutively numbered public fill-in prompts, ending at item 40. No student response, student record, or private key was read or changed. The files are staged on a separate branch and are **not live Swahili course pages**.

### Four definite student-facing instruction contradictions
The following headers state or imply that the **40-question pool** has only **four questions per each of five readings** (20 total), although the file actually contains 40:
- `A-C1/readings-test.sw.md`: “maswali 40 ... manne kutoka kwa kila somo kati ya matano.”
- `C-C1/readings-test.sw.md`: “maswali 40, manne kutoka kwa kila somo kati ya matano.”
- `C-C4/readings-test.sw.md`: “maswali 40 ... (manne kutoka kila somo)” before describing the 20-question attempt.
- `C-C5/readings-test.sw.md`: “maswali 40, manne kutoka kila somo” before describing the 20-question attempt.

**Correction proposal:** make the distinction explicit in all four, e.g. “Benki ina maswali 40, manane kutoka kila somo kati ya matano. Katika kila jaribio, maswali 20 huchaguliwa, manne kutoka kila somo. Alama ya kufaulu ni 18/20.” This is *proposed editorial wording*, not an authorized change to examination selection logic. Check the actual selection algorithm before publishing the four-per-reading claim. The other sixteen files passed this narrow 40-item count check; that is not a comprehensive language or assessment review.

## Release-critical source-to-translation dependencies
1. **A-C1 source hold propagates to Swahili.** The Swahili `A-C1/readings-test.sw.md` still contains items 12 and 28, corresponding to the historically unattributed/uncleared witness narratives identified in the existing PC1 source-to-digest-to-public-bank audit; items 7–8 also depend on contributor passages under separate source review. These are *not* safe merely because translated. Do not publish or use them to grade students until source text and derivatives have been replaced/cleared and **new** questions prepared privately. Do not reuse the earlier public illustrative Q12/Q28 replacement drafts, which were marked nondeployable because answer suggestions persist in Git history. See `books/A-C1/PC1_READING_DERIVATIVE_SCRUB_AND_BANK_REPAIR_2026-10-27.md`.
2. **A-C1 clock-time ambiguity requires a private parity test.** `A-C1/NOTES.md` flags reading-test item 18 and claims a language-specific acceptance variant that could accept a different hour under East African Swahili clock notation. This audit verified the public stem and the note, **not** the private `accept_sw` array. Authorized private-key reviewer must inspect and test intended clock-time equivalents, including rejection of wrong-hour variants. Do not publish key strings in this public repository.
3. **B-C1 translation changes blank's grammatical category.** `B-C1/NOTES.md` explicitly says textbook-test item 26 was rewritten from an English verb blank to a Swahili noun blank while `answer_en` retains the English target. The public Swahili question confirms a different blank construction. Verify the private language-specific accept list and the grader's language routing; test correct Swahili answers independently of English answer strings.
4. **C-C1 historically specific office title.** `C-C1/NOTES.md` flags textbook-test item 15's rendering of “Ordinary of Savannah” as a possible ecclesiastical title mismatch. Have a bilingual faculty reviewer compare the historical office, not merely word-level similarity, before approving question/answer parity.
5. **Ethnonym ambiguity across traditions.** `B-C1/NOTES.md` and `C-C1/NOTES.md` both flag “Wahindi” for historical English “Indians” referring to Indigenous peoples of the Americas; a present-day Swahili student may understand people from India. Preserve the source as a historical quotation if necessary but add clear contextual editorial notes and prefer a precise modern label in CTS's own prose, subject to reviewer approval.

## Provenance/rights gate for Swahili
The Swahili branch is a translation of source materials, **not independent source verification or Mexican rights clearance**. Existing PC1–PC5 English source holds (uncollated OCR, mixed articles, unattributed contributors, and derivative public questions) must remain attached to their Swahili descendants. A source correction requires an explicit propagation receipt for EN→ES/FR→SW teaching text→public question stem→**private** language-specific acceptance map, with checks that obsolete passages and question dependencies are absent. Do not distribute printable PDFs as approved academic copies while source or faculty gates remain open.

## Action for Claude / faculty
1. Keep `handoff/swahili-electives` unmerged and Swahili pages unpublished; do not move private keys to public history.
2. Correct the four misleading headers on a reviewed nonproduction branch; assert 40 numbered questions and source grouping; verify the actual 20-draw/4-per-reading behavior.
3. Block the A-C1 held question dependencies and independently author replacement prompts and answer variants in the private workflow after facsimile, rights, and faculty review.
4. Run private grading parity tests for A-C1 reading item 18 and B-C1 textbook item 26, including negative controls; review C-C1 historical office and the Indigenous-people wording.
5. After English source corrections, regenerate affected Swahili content and compare paragraph/source references, not just word counts. Require a qualified Swahili reviewer before release.

**Verification limits:** This is a targeted review of 20 public reading-test files, three `NOTES.md` files, and selected public textbook/readings tests. It does not claim 525,000 translated words are accurate, that the source texts are cleared in Mexico, that private keys match, or that any published page was changed. No answer strings are included here.
