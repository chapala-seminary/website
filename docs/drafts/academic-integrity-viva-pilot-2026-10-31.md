# CTS Academic Integrity: Verified-Learning Pilot and Oral Defense Protocol
**Faculty design draft — 31 October 2026. Not an adopted policy; not student-facing.**
**REVISION after Wayne's 400-M.Div.-student scalability objection:** the supervised viva below is now an **exception-only backup protocol**. The default solution is scalable self-grading, not routine faculty interviews. More detail in issue #233.
**Workstream:** https://github.com/chapala-seminary/website/issues/233
**Scope:** Program-level confirmation of independently held knowledge, not machine detection of AI.

## 1. Decision requested of Dr. Cook and Dr. Rogers

**Owner scalability constraint (31 Oct):** 400 simultaneous M.Div. students make required human oral exams per course incompatible with CTS's core self-grading model. **Human oral defenses are OPTIONAL exception/appeal/spot-verification tools, not the default requirement, and are not yet approved as degree gates.** Retain automatic independent grading for every student's main examination workflow. Pilot affordable, secure self-graded credit exams with larger private question banks, server-side unique 20/40 draws for *unit* exams (textbook/reading tests already have draws), adaptive faculty-reviewed applications/follow-ups, and feedback after an attempt rather than per-question disclosures. A human review queue should be small, prioritized and used only on evidence of unusual patterns or randomly sampled opt-in validation, with no automatic misconduct finding. The sampling rate must be budgeted and its limitations disclosed: sampling cannot certify that every unsampled learner was independent. Continue **open self-study** and distinguish ordinary course completion from any separately approved academic verification program. Do not remove any existing completion or impose new requirements retroactively. Until a policy is approved, ordinary current CTS certificates continue unchanged.

We should **not claim unsupervised online exams are AI-proof**. A second screen or browser agent can answer ordinary questions, even when question/answer keys are private. A supervised, genuinely interactive, independently witnessed explanation is more meaningful evidence of student comprehension. Listening to a recording that a student uploads unobserved is **not** identity or anti-AI proof.

### Educational goals
- Allow AI for language assistance, listening, concept explanations, formative quiz practice and study plans.
- Make the boundaries explicit: **independent academic verification** cannot be answered by another person or AI. Permitted disability accommodations should not be construed as cheating.
- Keep free access, mobile use, offline materials, multiple languages and unlimited **learning/practice retakes**.
- Establish a respectful appeal and repeat route without disclosing accusation labels.
- Don't assume rapid completion or sophisticated vocabulary alone proves misconduct.

## 2. Proposed faculty-administered interview (8–12 minutes, not at every unit)

### What happens
1. Staff identifies learner's CTS record privately, checks the account's work, and schedules a low-bandwidth voice call, brief video call or an in-person meeting with an **approved coordinator**. The private student access code must never be read aloud or emailed.
2. Staff selects two random topics from the *actual completed* CTS foundation subjects. The assessor sees an internal question and follow-up set; the student **does not receive the actual questions in advance**. An optional third topic addresses a particular claim in the learner's own earlier written response.
3. Tell the learner that reference materials and AI-generated assistance are not allowed during this verification; provide any registered communication/disability accommodation or interpreter needed. A coordinator should verify personhood with proportionate, non-invasive procedures.
4. Ask a central question, **listen to the first spontaneous explanation**, then introduce an unannounced variation that requires reasoning. For instance: “What changes if the listener disagrees with your reading?” or “Which verse most directly supports the point you just made?” A second device could still supply answers, so the supervising assessor matters.
5. Give supportive clarification if the learner misheard the question; avoid requiring perfect theological terminology, accent, memorized wording or fluency in English.
6. Apply the same analytic rubric to every candidate, record the **minimal rubric outcome and a short reason**, invite a second attempt after feedback if not yet demonstrated; use human review of borderline cases.

### Proposed rubric — each row 0–2 points
| Criterion | 0: Not yet demonstrated | 1: Partly demonstrated | 2: Demonstrated |
|---|---|---|---|
| Textual grounding | Cannot make a relevant connection with the text under discussion | Identifies an appropriate text but doesn't explain the relationship | Uses relevant passage details and explains their connection to the claim |
| Substantive understanding | Confuses the core concept or cannot express it | Captures part but misses an essential distinction | Explains essential idea accurately in their preferred language |
| Adaptive reasoning | Cannot address the unexpected variation | Attempts it but is unclear or inconsistent | Applies the principle meaningfully to new facts |
| Independent conversational engagement | Cannot respond to even basic clarification or follow-up | Responds with support or after clarification | Engages coherently, in real time, in the supervised setting |

**Proposed outcome bands (require faculty approval):** 6–8 = demonstrated; 4–5 = focused follow-up; 0–3 = more study and a new opportunity. A score of zero is **not evidence of AI use**. All accommodation cases require a clinically neutral equivalent rubric, not a penalty for speech or hearing differences. Staff may recommend additional independent evidence rather than inferring an academic integrity breach. Faculty can revise weights or thresholds after pilot observation.

### Example **prototype** challenge topics (do not publish as the final live question bank)
| Existing CTS foundation subject | First prompt | Unexpected follow-up or variation |
|---|---|---|
| Old Testament Survey | Compare the Abrahamic covenant in Genesis 12 with Israel's calling at Sinai in Exodus 19. What is similar and what differs? | How would you explain the purpose of the covenant to someone who thinks it is only a guarantee of personal wealth? |
| New Testament Survey | What are the main concerns of Matthew's Great Commission and Acts 1:8? | If a church says evangelism only involves public sermons, which part of either text challenges it? |
| Systematic Theology | How do Romans 3 and James 2 relate faith, works and salvation? | An anxious convert interprets James to mean God rejects them after every failure. What would you say and why? |
| Evangelism | Describe the gospel in accessible language and explain how you would listen to a person from a different culture. | They disagree with your language about sin; how would you respond respectfully without abandoning your explanation? |
| Pastoral Ministries | A bereaved person says their church has offered only theological clichés. How might you respond pastorally? | They disagree with a scriptural passage you cite: how would you listen and revisit your counsel? |
| Church History | Explain one important cause and one important result of the Protestant Reformation. | A student in a different Christian tradition says your summary is unfair. What would you clarify or amend? |
| Preaching / WiseSpeak | Give a one-sentence main idea for Luke 10:25–37 and outline two textual supporting points. | Why did you choose that main idea instead of treating the story merely as a command to be kind? |

For **graduate-level verification**, add a comparison question (two major interpretations and their evidence), a short literature/source rationale and a pastoral application. Faculty approval and multiple distinct unseen forms are essential: published sample questions are **practice only**.

## 3. Remote, low-bandwidth and accessibility pathways
- **Preferred:** supervised in-person oral exchange at a church/study center with a CTS-approved coordinator, with contemporaneous verification that the student is the person answering.
- **Alternative:** faculty or coordinator phone/WhatsApp **live** voice interview and unpredictable follow-ups. Audio-only is helpful for poor connectivity but has weaker identity assurance; the verifier must confirm identity using a safe prearranged method not involving the student's secret login code, and must check for outside coaching.
- **Accessibility:** approved sign-language interpreter, local-language human interpreter, or **supervised live written responses** for students who cannot communicate orally; document comparability without demanding a medical disclosure.
- **Offline:** question sheets sealed until a coordinator-controlled session, written responses witnessed and photographed/submitted via the protected staff channel, plus short human follow-up where practical. Do not send unseen question bank to students in advance.
- Do **not** require a webcam, invasive device lockdown, screen recording, browser extension, identity document upload, or always-on surveillance as the universal condition for free tuition.

## 4. Data and architecture (design, not yet implemented)

### Proposed separate protected record
`academic_verifications` (private D1) with:
- `verification_id` / `student_id` / `program` / `scope`
- `status`: `scheduled | needs_follow_up | verified | deferred | appealed`
- `method`: `faculty_phone | faculty_video | approved_in_person | supervised_written`
- `assessor_id`, `rubric_version`, `rubric_scores`, `notes_short`
- `created_at`, `completed_at` and audit/appeal references
- optional coordinator approval ID and consent documentation; **no raw voice/video by default**.

Staff-only Cloudflare Access routes authorize creation and audit of verification outcomes, reject student tokens, require trusted proctor identity, prevent forgery/replay, and maintain an append-only audit of outcome changes. This is **not** a replacement for `unit_progress`, `course_completions`, or `textbook_results`.

If adopted, a transcript/degree record can distinguish `courses completed` from `independently verified coursework` without rewriting historic grades. A student must be able to see their own verification status and request an appeal. Whether certificate PDFs should display a verification statement requires **separate owner decision** and faculty/legal review.

### Distinguish practice vs academic-credit testing (later prototype)
- `practice` gives formative immediate feedback, can be retaken without limit and never confers academic credit.
- `credit` should draw **20 from at least 40 instructor-reviewed private questions per unit** by cryptographically secure random selection; store selection and shuffled option order server-side per attempt, resume reliably, grade by the immutable selection and retain fairness parity across language versions.
- In `credit` mode withhold item-by-item correct/incorrect outcomes until the sitting is closed. Grant useful feedback afterward without publishing enough of the bank to make retakes trivial.
- Existing `worker/grading/attempts.js` currently shows the same `scope.qids.mc` on **every unit retry**. Textbook and reading tests already draw 20/40 (`drawFor`); reuse tested architecture in a carefully isolated unit pilot but **do not assume textbook's existing code can be directly reused for MC**. `worker/grading/routes.js` returns each MC's right/wrong status immediately; the policy must be intentionally changed with accessible progress/receipts.
- Stage first in **one core course** with synthetic beta identities. Only expand after objective/translation/rubric QA. Maintain existing student awards and non-retroactive rules.

## 5. Auditable Chrome-assisted red-team test
The user connected Claude to their own Chrome instance. This connection does **not** grant ChatGPT access to Claude or Chrome. The owner or Claude can carry out the following **without** touching production:

1. Create/use an expressly disposable, clearly labeled **isolated beta test record** (or use the existing test suite's local D1 fixtures); make sure it cannot trigger production emails, grading/degree conferral, or staff reporting.
2. Have an automated browser retrieve a unit's displayed questions, answer them with an AI, submit, repeat once, and record *aggregate results only*: success/failure, number of retries, and whether immediate right/wrong signals were reused. **Never dump private answer keys or student credentials into issues.**
3. Repeat with an applied question and an authorized live faculty follow-up. Document whether a human assessor can discern comprehension and what reasonable accommodations change.
4. Produce a short reproducible finding with time, exact beta commit, any test-user cleanup, and suggested mitigations. Do not claim that failing or passing this exercise is proof about students.

## 6. Pilot acceptance and owner approval
- [ ] Wayne and Ted adopt transparent AI/assessment and verified-degree policy prospectively.
- [ ] Two independent assessors try the rubric on at least 5 volunteer or staff simulation cases, review inter-rater agreement and revise prompts.
- [ ] Staff workflow is multilingual and has a genuine low-bandwidth/non-oral equivalent.
- [ ] Single-course 20/40 bank pilot validated on beta, with no answer leaks and no regressions in answer receipts, score persistence, course completion or legacy credits.
- [ ] Privacy notice, appeal process and accommodations published **before** the first affected student is obligated.
- [ ] Faculty review sign-off and the normal production PR exact-SHA GitHub approval before deployment.
- [ ] Academic articulation claims continue to be described as discussions only, unless a partner agrees in writing.

**Do not activate any requirements or withhold awards before owner authorization.**
