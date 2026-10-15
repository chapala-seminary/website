# Genesis grading safeguard — 14 October 2026

The 120 short-answer questions in `src/content/units/CTSGenesis` have no
keywords. Previously the shared engine accepted any answer, including empty
text, when its keyword list was empty. Some published models are general
rubrics rather than question-specific answers; they are not replacement keys.

The engine now rejects missing, empty and unusable keyword lists. If a
master's exam contains a question without usable criteria in the reader's or
source language, it shows a temporary-unavailability notice and refuses
submission before grading, recording progress or starting a retake lock.
Saved answers remain intact. Certificate and Associate tracks retain their
existing rules; earlier recorded progress is not erased.

This is a containment safeguard, not completed Genesis grading. Genesis
master's exams remain unavailable until faculty-reviewed, question-specific
English/Spanish grading criteria are supplied. Genesis is in the required
M.Div. core; the full release remains held pending that resolution and live
acceptance. Review model answers alongside the prompts and lessons, and test
independent correct answers, incorrect answers, blanks and copied prompts.

`test/missing-sa-grading.test.mjs` exercises the actual shared engine in
Chromium: all 120 Genesis questions in English/Spanish, malformed or unavailable
keys, both master's tracks, preserved answers, no pass or lockout, and the
Certificate review path. `test/published-models.test.mjs` now expects ungraded
models to be rejected rather than accepting missing keys as a success.

Production activation remains unset until the authorized release. Set a separate
ISO UTC timestamp for that production release, as recorded in
`docs/beta-master-test-activation.md`. Prior valid
master's completions remain protected by the existing server policy. The beta
flag and beta cutoff are not production settings.

French remains provisional pending theological review. A separately approved
English/Spanish promotion may proceed only with that draft boundary preserved.

Local regression results do not establish live email receipt, code redemption,
cross-device recovery or certificate issuance on the final deployed candidate.
Record the deployed version and complete those checks with a controlled inbox
before sign-off. Do not store test addresses, student codes or PDFs in Git.
