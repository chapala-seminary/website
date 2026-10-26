# Swahili elective translation inventory and B-C2-U8 assessment parity — 26 October 2026

**Nonproduction, report-only audit. No answer keys, student information, or private document links are included.**

## Scope and source of counts
- Enumerated Google Drive search results for `Somo SW` and `Mtihani SW` and filtered **document titles**, not incidental full-text matches. Exactly **200 distinct Swahili lesson titles** (`Somo SW`) and **200 distinct instructor-only Swahili examination titles** (`Mtihani SW`) exist, covering each of the **20 denominational elective course codes** (A-C1–A-C5, B-C1–B-C5, C-C1–C-C5, D-C1–D-C5), units **1–10**, with no duplicate course/unit/type title slots in this result. These are **drafts**, not approved student releases.
- Separately read the four 23 October **approved export manifests** for traditions A, B, C and D. Each lists **300** entries: ten units of five courses × six slots (EN lesson, EN exam, ES lesson, ES exam, FR lesson, FR exam). **1,200 total entries**, each of the six slots complete for all 200 course-units. **None of these four manifests includes a Swahili slot.**
- Thus, **draft creation is not the current evidenced Swahili bottleneck for these 20 electives**. The unresolved steps are a *version-pinned, access-controlled Swahili export manifest*, independent translation/Scripture/exam audit, private answer-key separation, secure handoff, beta conversion and release authorization.
- This inventory does **not** cover the separately mentioned **45 Swahili core-course archives**. Their completion count is still unverified; do not conflate those with the 20 electives.

## Independent B-C2 Unit 8 spot audit
Compared Drive English `B-C2-U8 Lesson v1` and `Exam bank + KEY FINAL` with `B-C2-U8 Somo SW v1` and `Mtihani SW v1 + MAJIBU` without copying either key to this public report.

- The English and Swahili exams each contain **20 multiple-choice questions, 80 lettered options, 10 fill-in accepted-answer entries**. All **20 multiple-choice correct-option positions match** between the two instructor files; each answer letter appears five times. This is a **structural and key-position parity PASS for this single unit only**, not a semantic accuracy certificate for 200 units.
- Swahili fill-in items are sensibly localized for the examined pairs: English “limited ___” -> “upatanisho wenye ___”; English “irresistible ___” -> “___ isiyozuilika”; accepted answers change accordingly. An automated literal-English-key equality check would **falsely reject** correct translations; compare the blank's semantic target instead.
- **New faithfulness flag for Claude's review:** In the section on General/Free Will Baptist election, the English quotation from **1 Peter 1:2** is “according to the foreknowledge of God the Father”; the Swahili lesson presents “kwa kujua tangu zamani, **kwa mapenzi** ya Mungu Baba.” The added **“kwa mapenzi”** has no counterpart in the quoted English wording. This could change how the verse is understood in a unit that explicitly compares competing doctrines of election. Verify against the exact licensed **SUV 1 Peter 1:2** text and the source lesson; either quote the edition accurately or label a faithful paraphrase. **No correction has been approved or applied.**
- The already-known `killa` spelling error in this lesson was present; it is **not a new finding** and is not being re-reported as one.
- No native-speaking academic reviewer has signed off; no assessment answer content was exported to a public repository.

## Secure integration checklist for Claude and Robert
1. Build a **separate Swahili export manifest** covering 200 lesson + 200 exam slots, with source file IDs and last-modified/revision metadata **kept private**. Distinguish `sw-lesson` from `sw-exam`; do not treat the presence of a draft as approval.
2. Place instructor exams and answer keys in the **private assessment-key pipeline**, never the public website repo or a public GitHub PR. Verify Drive sharing permissions separately; the present search does **not** prove the documents are publicly accessible or appropriately restricted.
3. Run report-only per-unit EN↔SW meaning, Scripture citation and actual-version quotation, MC option/key-position, accepted-answer semantics, and written-answer rubric checks. Fix in new revisions, retain original versions and previous student credits.
4. Publish only after beta tests and Wayne's academic/rights/release approvals. Keep production PR #170 and correspondence PR #164 independently gated; PR #164 sending OFF.
5. Inventory the **45 core Swahili archives separately** using an authoritative archive manifest and file-level counts. No core-archive percentage should be inferred from this elective inventory.

**Strategic finding:** The elective Swahili drafts are already present at full 200-unit lesson/exam slot coverage. Prioritize the missing **controlled export, QA and private-key integration** rather than commissioning duplicate translations. This is a production-workflow opportunity, not a declaration of course readiness.
