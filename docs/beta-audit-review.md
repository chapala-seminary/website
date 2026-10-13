# October beta audit repair review

Production promotion remains held. Review the changes against beta before publication; use a separate production activation date later. No production records are fixtures.

Merged #72 is now published: beta Actions run 38314760308 succeeded and the live version stamp reports `2026-10-12 28fc79c`. A read-only browser check at 390px confirmed all eight reported Spanish routes return 200 with a visible, nonempty body. This confirms that specific repair on live beta; it does not publish the remaining proposal below.

| Audit item | Repair and evidence |
|---|---|
| Eight blank Spanish routes | Merged in website PR #72. Protect the language-page body from legacy copy selectors. The complete local browser sweep checks all 5,778 desktop/phone language renders for a visible, nonempty body. |
| 22 supplied model-answer failures | Merged in #72. Accent folding preserves ñ; four question/model alignments corrected. All 22,219 published model/source checks pass, with the actual browser grader. Models absent from source are not silently invented. |
| 36 multiple-choice textbook exams | All 45 canonical textbook banks are typed fill-ins, with 40 questions, a draw of 20 and 18 required. Schema rejects choice fields. Every supplied key/variant is checked; all 45 standalone pages are checked in English, Spanish and French fallback. Browser grading tests cover failure, retake wait, resume, passing and preservation of older dated passes. |
| 79 staged master’s requirements | The beta flag records one durable server cutoff at publication. Isolated real-Worker/D1 checks cover all 79 activated slugs, both-test gates, earlier master’s exemptions, recovery, unchanged Certificate/Associate policy and stable cutoff after restart. Production has no activation date set. |
| Inconsistent master’s notices | Homepage lists all 45 books and 45 reading tests. Reading rooms separate optional honors from the assigned tests. Unit links and test/certificate status use the actual server activation policy. |
| Unit question-count wording | Ruth & Esther Unit 1’s heading now says 18, matching its bank. Counseling Situations and Pentecostalism have no incorrect explicit count in the current pages. Check all 466 standard banks in three languages against explicit MC heading counts; preserve 90% of the actual section size. One declared instruction hash changed; lesson prose and assessment counts are preserved. |
| Entry-point signup, language and recovery | Standard units collect email. Four legacy pages load sync; three legacy forms bridge their saved profile to the shared record. 162 synthetic browser/Worker checks cover six entry paths in three languages, repeated sync, cross-browser restore, missing email and outage/retry without losing progress. |
| French source-display failure | Missing French exam text is labeled English source without a duplicated source block. 244 browser checks cover First Peter’s two exams on desktop/phone. Source geometry waits for settled fonts/rendering while retaining all visibility/position assertions. The historical fee076a8 failure’s root cause remains unproven; subsequent full source-layout sweeps pass. |
| NT certificate overflow (Wayne’s follow-up) | Allow the certificate flex container to wrap so full-width PDF controls sit below the award. Check all three NT certificate pages in three languages at desktop and phone widths. |
| Bare `/verify` endpoint (Wayne’s follow-up) | Serve a certificate-code lookup form; submitted codes lead to the existing public verification route. Unknown codes remain unverified and escaped. No student recovery code or email is exposed. |

French coursework remains ten draft courses; these repairs do not create French textbook or reading-exam translations or certify theological accuracy. Translated signup labels no longer make an untranslated lesson appear translated. Wayne’s overlapping PR #73 supplied a useful reverse-accent regression case, retained here; its broader commandment keywords are not adopted.

The 430 missing English/Spanish short-answer models are optional feedback work for faculty review, as the audit states. Existing keyword grading remains operative. Do not describe technical checks as faculty approval.

## Live acceptance after review and beta publication

The controlled verification-message receipt already confirmed by Robert is delivery evidence. Local mail tests use log-only or mocked senders and do not prove new external delivery. Once the reviewed repair is deployed to beta, complete the connected workflow:

1. Confirm the live release matches the successful beta Actions commit and `/api/health` exposes exactly 79 activated slugs with one cutoff. Production remains unchanged.
2. Register a controlled beta student through a course entry page; confirm its email and coursework language are saved. Never commit the profile, address or code.
3. Complete the course’s unit assessments and both separate assigned tests at the master’s level. Confirm units alone, or either test alone, cannot issue its master’s course certificate.
4. Request email verification, confirm receipt in only the selected language, redeem a confirmation code or link and verify its saved status. Confirm expired/reused confirmation is rejected.
5. Restore the same record in a second browser using the student code or emailed recovery, retaining progress, language and both test passes.
6. Issue the eligible course certificate, confirm the single-language message and localized links, open public verification and inspect the downloadable PDF. Check an earlier valid master’s completion remains eligible under its server exemption.
7. Delete the controlled beta record when testing is complete; retain only a redacted outcome/build record. Verify deletion preserves browser work and does not silently re-register the student.

Until those live checks are recorded, this is a tested repair proposal, not full live release sign-off. Robert must choose the separate production activation date before production promotion.

Wayne’s second local audit used fee076a and could not inspect the live site. Its deployment timestamps are historical observations, not the current release status. Signup still asks the student to initiate email confirmation; no automatic signup email is introduced by these repairs. The earlier controlled receipt proves delivery, while provider headers and the connected workflow remain live acceptance checks.
