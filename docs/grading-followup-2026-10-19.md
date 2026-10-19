# October 16 beta grading follow-up

Status: candidate changes for review, prepared 19 October 2026 from beta
`c560510d`. No beta or production publication in this follow-up.
The source report was supplied by Robert in chat; it describes Old Testament
Survey Unit 1 (Genesis), not a completed Genesis Intensive test.
No real student records or submitted answers were accessed or stored.

## Changes

Short-answer prompt `2026-10-19.1` asks for an explanation of what the student
understood and, where useful, a next step. Evidence quotations stay in the
rubric record rather than serving as feedback. An accepted central answer may
receive advice to develop its support; that advice adds no passing requirement.
The essential-point rules, length policy, pass thresholds and appeals are kept.

The shared model path replaces empty or substantially copied short-answer
feedback with a short, localized explanation and study guidance. It preserves
useful model feedback and the evidence record, makes no additional model calls,
and also applies when the queue finishes a pending answer. Fill-in feedback and
faculty rulings are unaffected. This is a fallback, not a claim that generic
advice can replace faculty-specific teaching feedback in every case.

Textbook submission previously added an offline warning whenever the fill-in
widget could not grade a batch, even if the widget already showed the actual
503 or rate-limit error. There were two warnings and two retry buttons. The
page now retains the widget's accurate warning. A successful widget batch retry
resumes submission in the same sitting, without losing typing or adding a lock.

## Verification and limits

- New model-path regression tests cover Genesis 3:15 acceptance with optional
  support omitted, evidence preservation, quote-only/echo feedback, contradictions,
  missing essential points, pending, empty feedback, verdict correction and
  unaffected fill-in feedback in English, Spanish and French: 19 tests pass.
- New textbook recovery regression: **before**, three failures (duplicate
  warning in each language); **after**, all 30 current recovery checks pass, including preserved
  input, no premature submit/lock, same sitting, retry and reload persistence.
  This uses a local API stub to inject a service failure safely.
- Real Workers AI, synthetic answers: all 18 targeted verdict/feedback cases
  pass across English, Spanish and French for Genesis 3:15, Counseling's
  listening ratio, and WiseSpeak's eight-question exercise. They include an
  independent paraphrase and a substantive error for each question. English
  used a six-answer batch; Spanish/French passed in pairs. Six-answer ES/FR
  REST probes timed out under a **20-second transport deadline**, stricter than
  the deployed model path's 25-second call limit. This does not prove a deployed
  language defect. Both six-answer ES/FR probes also passed with the actual
  25/40-second model deadlines and a longer transport allowance. This still
  does not establish full-course or normal ten-answer batch acceptance.
- Broader real-model sample: 95 synthetic items, 81 model-routed items, with a
  repeatability sample of 12. The sample **fails the false-accept bar**: one of
  eleven negative short answers was accepted. The item is
  `half.CTSPsalms.5.8.1`; both the old and new prompts accept it in three paired
  diagnostic repetitions. The answer conveys love of the law and delight rather
  than duty, but omits the loved-one/voice comparison in the essential rubric.
  This needs faculty review of the label/standard. No label or rubric was changed
  to turn the run green. One French fill-in synonym was also rejected. A sample
  is not the full 2,346-item release evaluation or faculty/language acceptance.
- Manual local in-app browser check: a fresh fictional registration opened the
  Cults textbook test; a wrong synthetic answer displayed Incorrect and offered
  human review; the answer and verdict survived reload. The Worker used its
  test model, not the live AI. No appeal was sent. Screenshot was inspected
  inline; no screenshot or fixture credential was committed.
- Full build passed. The required full suite was attempted and stopped at the
  existing `verify-lesson-render.mjs` baseline mismatch (466 pages, including
  registration/interface markup), before the grading browser suites. Related
  repair is separately proposed in website PR122. This change does not weaken
  or regenerate that baseline. Focused grading suites are recorded below.

Focused grading suites: 202 API assertions, 199 faculty-grading assertions and
165 browser checks against the stubbed grading API and 97 end-to-end browser
checks against the real local Worker/D1 pass. The expanded single-page course
matrix is recorded with the final PR validation results. The UI registration
fixture now supplies the existing required country field; the separate
production-validation checkout was left untouched.

## Open items

1. Confirm the original October 16 textbook page, language, warning text,
   approximate time and triggering action. The reproduced duplicate warning
   is a real recovery defect, but cannot establish the cause of that report.
2. Complete deployed live-binding/faculty acceptance, including full-unit batches
   and pending recovery. Six-answer REST probes and fake-model browser tests
   are different checks; the stricter diagnostic timeout is not a product defect.
3. Faculty review of the Psalm evaluation disagreement; a full evaluation and
   qualified Spanish/French review remain outstanding.
4. Resolve the existing beta validation blocker and obtain the applicable exact
   commit reviews before merge/publication. Current PR124's answer-disclosure
   proposal overlaps the feedback policy; reconcile on integration without
   silently adopting that unmerged policy here.
5. The proposed honor pledge remains a separate recommendation. This change
   does not adopt it or change the examination access rules.

## Startup and artifacts

Company: CTS; workspace `/Users/macstudio/git/chapala-seminary`.
Read workspace and website AGENTS.md, brain MEMORY.md, CLAUDE.md, USER.md,
AGENTS.md, AGENT_RULES.md, GIT_WORKFLOW.md, SECURITY.md, website project/status
and grading decisions; inspected the current website release instructions.
Neither COINCUBE nor Website Machine context was loaded. No company-specific
Agent Ops SHA is claimed. Work is isolated on `codex/grading-followup`.
QA procedure: `/Users/macstudio/.codex/skills/qa-session/SKILL.md` and its
session/findings and fix-verification references. Synthetic local fixtures
remain only in the disposable `.wrangler-local` database and browser context.
Diagnostic output is under `/private/tmp/cts-grading-followup-*`; these paths
are local, temporary evidence, not permanent CI or release artifacts.

## Claude review repairs

Robert authorized the private patch/context review. Claude reviewed
`3aee016108ac6cd8571e7a25e8285ccb0bd56ee5` and identified a medium retry race:
pressing Submit during a widget retry could grade the same batch twice. The
widget now shares one in-flight promise between the two callers. The browser
regression explicitly clicks Submit while the delayed retry is running, counts
grading calls, and verifies a single final submission in EN/ES/FR.

The accepted-answer fallback now gives confirmation when every rubric point is
made. Optional support advice is offered only when an accepted answer omits
another rubric point, and the wording explicitly says “you may.” This changes
no verdict or passing requirement. Focused feedback coverage grows to 19 tests.

Claude also noted that copied-word detection uses fixed thresholds. This is a
bounded safeguard against answer echoes, not a semantic assessment of feedback
quality: a genuine short confirmation can be replaced, and an echo with enough
new wrapping can be retained. Useful explanations are preserved by the existing
regressions; this limitation changes no academic grade and remains documented.

The first Claude review disclosed gaps in startup and supporting-helper reads.
Consult PR127 for the repaired exact-commit review, its coverage and the final
validation results. The required full suite was rerun after these repairs and
still stops at the same 466-page lesson-render baseline mismatch. The full-suite
and faculty evaluation gates above remain separate from code review.


### Late answer during Retry

Claude's follow-up confirmed both prior repairs and found one further edge:
a Submit joining a retry could omit an answer typed into a previously blank
field while that retry ran. The joiner now waits for the shared batch and
then grades any newly typed answers before returning to submission. The new
17-correct-plus-one-late-correct regression fails before this change and passes
afterward. Together with the EN/ES/FR concurrent Retry/Submit cases, all 36
focused recovery checks pass. The additional pass sends only answers that are
still unchecked, preserving the duplicate-request repair.

The 97 real-Worker end-to-end and 75 course/language checks were repeated and
passed on `c3c281df`. The final delta changes only the concurrent join branch;
its focused and full stubbed-UI results and final exact-commit review are
recorded in PR127. No publication or human release approval follows from these
local checks.

Final local build passes. All 171 stubbed browser checks pass on the final
retry repair. The first full UI attempt timed out in the unchanged unit-engine
Enter-key case after 28 checks; an uninterrupted rerun passed without changing
that test. The required full suite again stops at the existing 466-page render
baseline mismatch. No baseline or academic expectation was changed.
