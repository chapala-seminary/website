# PC3 — staged five-reading source / assessment dependency audit (27 October 2026)

**NONPRODUCTION EDITORIAL HOLD.** This is a source-evidence and public-question-dependency report, not permission to publish, an answer key, or a legal opinion. Do not use it as a release approval.

## Exact inspected artifacts

- Website `beta` at **da97604b9e7e3f1755c693e9d1da0525e1757c2b** (branch advanced from the earlier c6110458 while this audit was underway).
- Reading room `src/body/rooms/CTSElecPC3Readings.html`, blob `34d251a3c38b146560d4c9d469e178092e5c34ba` (five CTS-authored EN/ES/FR historical digests).
- Public reading manifest `src/content/readings/elecpcthreereadings.json`, blob `22a14a684542141dbdfe051396fb25540a9385f9`. **40 questions, 8 per reading; EN/ES/FR prompts present; 20 drawn, 18 correct required; keys marked private; activation `2026-10-29T06:00:00Z`.**
- Handoff `books/A-C3/SOURCE.md` and `ARTICLE-BOUNDARY-AUDIT-2026-10-25.md` explicitly state that original facsimile collation, contributor rights, five substantive reading approval and private answer verification are **not complete**.
- Original historical archive index: https://www.apostolicfaith.org/library/azusa-papers . The room itself says its quotations were checked only against **modern readable reproductions**, not original issue facsimiles. This audit did not independently collate facsimiles.

## Actual staged five-reading map (not the old provisional index)

| Staged reading | Room's attributed material | Public question dependency | Gate |
|---|---|---|---|
| **1 — Seeking the Promise** | Issue 6 (Feb–Mar 1907), p. 7: `The Baptism with the Holy Ghost` (W.J.S.) **plus** unsigned `Messages in Tongues Interpreted`, `Preserved and Sealed`, editorial note | **Q1–8**; especially Q7–8 depend on **unsigned adjacent contributors/notes**, not Seymour's signed article | Original p.7 article boundaries and source of interpreted messages; contributor/quotation rights and EN/ES/FR collation. |
| **2 — Gifts and Order** | Issue 4 (Dec 1906), p. 2: `Signs Shall Follow`, `The True Pentecost` (both unsigned) | **Q9–16**; Q9–10,13,15 quote source phrases; Q16 uses Mother Wheaton biographical detail | Verify original article signatures/columns and every quote; distinguish editorial historical claim from independently established biography. |
| **3 — Prophecy and Interpretation** | Issue 5 (Jan 1907), p. 2: `Gifts of the Spirit` (W.J.S.) **plus** `Bearing His Reproach`, `God Is His Own Interpreter` (unsigned) | **Q17–24**; Q23–24 depend on an **unsigned** companion article | Do not treat all of p.2 as Seymour-authored; separately verify the signed article's ending and unsigned boundaries. |
| **4 — Holiness and Accountability** | Issue 3 (Nov 1906), pp. 2–4: `In Money Matters` (W. J. Seymour) **plus seven unsigned editorial/teaching items** | **Q25–32**; Q25–26,28–29,32 depend on unsigned items; Q27,30–31 attribute material to Seymour | Map each quoted phrase to the precise original article/page/column, verify distinct voices and translations. |
| **5 — Testing the Spirits** | Issue 4 (Dec 1906), pp. 2,4: `Counterfeits` (W. J. Seymour) **plus** `Question of Meats`, `The Sin Against the Holy Ghost`, editorial notes (unsigned) | **Q33–40**; Q37–40 depend on editorial/unsigned material, not all on Seymour | Verify source article boundaries, provenance of unsigned statements and pastoral context; avoid presenting polemical claims as independently established facts. |

**Index drift requiring a correction:** The 25 October provisional five-candidate index used `MISSIONS IN LOS ANGELES` (anonymous visitor, issue 7) as candidate R5. The staged R5 instead uses Seymour's `Counterfeits` and unsigned material from issue 4. Likewise the index's theme order is not the staged reading order. This is not proof of an error in the new digests, but **the provisional index cannot serve as the final source register or bank provenance**. Preserve an explicit old-candidate → staged-reading crosswalk, and remove any stale release claims of five verified original articles.

**Repeated issue, different article:** Staged R2 and R5 both draw from December 1906 issue 4 and page 2, but their named articles differ. Check article-level overlap, not merely shared issue/page; five digests of one periodical are not automatically five independent academic readings. A-C1 uses the same periodical, so cross-course duplication also needs an owner decision.

## Integrity and rights observations

1. The reading room's own five `Text and collation` notes acknowledge that **original facsimile collation is pending**. The handoff's source-only gate remains open even though the complete trilingual room and 40-question bank are now staged on beta.
2. The public manifest has **20 question stems with explicit quoted phrases or quoted article titles** (Q1,5,7–10,13,15,17,19,21–23,25–26,28–29,32–33,38). This is a *syntactic* count of English quotation marks, not a finding that the other 20 are safe. Many remaining stems depend on exact historical wording too.
3. `W.J.S.` and `W. J. Seymour` in modern reproductions are attribution leads, not proof that surrounding unsigned paragraphs share the same author. An unsigned editorial is **not automatically public-domain or rights-cleared in Mexico**. Distinguish copyright term, provenance of modern reproduction, quotation scope, and original ES/FR CTS commentary.
4. The staged room states that it quotes briefly and is CTS-authored teaching. That may reduce reproduction risk but **does not by itself resolve** article attribution, accuracy of literal translations, original facsimile collation or the Mexican rights decision. Do not infer infringement or clearance.
5. No answer values or proposed answer-bearing replacement questions appear in this report. Public prompts may remain in the public repo; all correct-answer maps, aliases and grading validation belong only in private `assessment-keys`. AI GitHub account cannot currently read private PR #7 (404), so private-bank parity is unverified.

## Concrete handoff to Claude (content and release sessions)

1. **Do not promote PC3** on the strength of the beta branch alone. Obtain Wayne/faculty source/rights and five-reading-policy decisions; confirm the private keys PR #7 independently. Check beta CI on the **exact SHA**; a queued workflow is not a passing build.
2. Collate issue 3 pp.2–4, issue 4 pp.2/4, issue 5 p.2, issue 6 p.7 against original facsimiles, recording original issue/date/page/column, title, signature, start/end, contributor status, exact quote variants and source URLs. Prioritize R1 unsigned interpreted messages; R3 `God Is His Own Interpreter`; R4 multi-article p.3–4; R5 editorial notes.
3. Create a **40-row provenance matrix** keyed by public question number and reading, with source article, passage ID, English witness status, ES/FR translation review, and private answer-map verification flag. Start with Q7–8, Q15–16, Q23–24, Q25–32, Q37–40. Never place answers or accepted aliases in this public matrix.
4. Replace any unverified quotation-dependent items with **new independently authored, private-validated** questions after academic review. Do not recycle proposed public answer concepts from earlier Git history. Rebuild EN/ES/FR source and bank together; test 40 unique stems, 8/reading, 20 draw, 18 pass and language-specific grading without exposing keys.
5. Maintain an **article-level nonoverlap ledger** for PC3 R1–5 and cross-check A-C1. Resolve whether five original CTS analytical digests based on one newspaper meet CTS's required-reading policy; this is an academic owner decision.

**Release status observed during audit:** `beta` now points to `da97604`, but its `Test and deploy beta` workflow run 40513424139 was **queued** at the time checked. Therefore there is no verified successful exact-head beta deployment or authorization to open beta→main PR. PR #164 is a separate draft with sending OFF. No student, grade, answer-key, production or email changes were made by this report.
