# CTS Multi-AI Watchdog — owner-built pilot v0.4

**Status:** Four offline test suites completed; source code and mock integration tests complete. The checks have not been run in a live Google Apps Script project. **Not deployed, not activated, not spending money.** Robert is *not* required during design, coding or offline testing. This pilot does not control consumer ChatGPT, Claude or DeepSeek web sessions: it can resume only API requests the watchdog itself creates.

## What is complete

- Two existing Google Sheets tabs `AI Jobs` and `AI Run Log` plus a `Multi-AI Pilot` coordination tab.
- 13-unit student-facing English *Systematic Theology* review packet held privately in Drive as PDF and `.txt`. **The archived packet may differ from the production site**; verify proposed changes against live course material before deployment. The tests in this archive use **synthetic** course text, not real lessons, so public source code contains no curriculum copies.
- An Apps Script watchdog that runs one approved model call per tick; saves complete responses to a configured Drive folder (append-only), records a compact checkpoint in the sheet, and resends a targeted **Continue from the checkpoint** instruction when no completion marker appears.
- A global on/off switch, per-job approval, daily API-call cap, **$10 absolute software budget ceiling** and conservative per-call dollar reservations, attempt cap, independent model jobs, no-progress detection, source-file allowlist, lock against concurrent triggers, and stop on `[[CTS_DONE]]`, `[[CTS_BLOCKED]]`, `[[CTS_NEEDS_APPROVAL]]`, or uncertain failure.
- Node tests of 13 synthetic unit boundaries, synthetic fixtures and mocked continuation, approval, completion, logging, full-output storage, daily call cap and $10 spending cap. All tests are offline, with no real model network calls.

## Installation boundary

The GitHub branch holds a **tested source-code prototype only**, not an installed Google Apps Script project. The available connected Google Workspace tools can edit Sheets and Drive, but do **not** create or configure Apps Script projects or secrets. Installation therefore remains a separate user-authorized account action; it does not require Robert during development.

## Manual-install roadmap (no Robert needed to complete the source code)

1. Open the existing CTS Operations Tracker, choose **Extensions → Apps Script**, then paste `Code.gs`. If that editor is inaccessible, preserve this package for later deployment. No production website changes are necessary.
2. Run `ctsSetup()` to check the two data tabs. This step accesses the linked spreadsheet; it does not spend money or contact any models.
3. Set Apps Script **Script Properties** as follows, keeping secrets out of Google Sheets and GitHub:

| Name | Meaning |
| --- | --- |
| `CTS_SPREADSHEET_ID` | The verified operations tracker ID (private property, not hard-coded source) |
| `ENABLE_LIVE_REQUESTS` | `NO` by default; leave off until authorized |
| `ALLOWLIST_SOURCE_IDS` | Comma-separated, independently screened student-only Google Drive **text** file IDs |
| `REPORT_FOLDER_ID` | A restricted Drive folder ID where every model response is saved as a separate text file |
| `MAX_CALLS_PER_DAY` | Suggested pilot 4; pause after the set number of calls per UTC day |
| `MAX_PILOT_SPEND_USD` | **Set to 10 or less**. Absent, zero or greater than 10 prevents calls. A conservative upper-bound reservation is permanently logged before each API attempt, even if the result is lost. |
| `OPENAI_USD_PER_M_INPUT_TOKENS` / `OPENAI_USD_PER_M_OUTPUT_TOKENS` | Official prices in USD per million tokens for the **exact configured OpenAI model** and processing tier; required for that provider. |
| `CLAUDE_USD_PER_M_INPUT_TOKENS` / `CLAUDE_USD_PER_M_OUTPUT_TOKENS` | Same, for the exact Claude model. |
| `DEEPSEEK_USD_PER_M_INPUT_TOKENS` / `DEEPSEEK_USD_PER_M_OUTPUT_TOKENS` | Same, for DeepSeek. Use the **highest price potentially applicable**, including peak tariffs. |
| `MAX_OUTPUT_TOKENS` | Suggested pilot 1600 |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | API key and exact model for OpenAI, if enabled |
| `CLAUDE_API_KEY`, `CLAUDE_MODEL` | API key and exact model for Anthropic, if enabled |
| `DEEPSEEK_API_KEY`, `DEEPSEEK_MODEL` | API key and active model ID (`deepseek-flash` or `deepseek-v4-pro`) |
| `DEEPSEEK_REASONING_EFFORT` | `none` (pilot default), `low`, `high` or `max`. Start with `none` to avoid exhausting small output limits on hidden reasoning. |
| `ALLOW_UNCERTAIN_RETRY` | **Ignored in v0.4**: uncertain responses ALWAYS pause for review |

4. Run `ctsPreflight()` while `ENABLE_LIVE_REQUESTS=NO`. It validates headers, report folder, budget, and each currently-approved job **without contacting any AI API**. If there are no approved jobs, it returns `NO_ACTIVE_JOBS`, which is expected.
5. In the `AI Jobs` sheet, leave `Approval=HOLD` and `State=HOLD` until separately approved. The model credentials alone cannot start work.
6. Once costs, data-sharing destination and credentials are explicitly approved, set `ENABLE_LIVE_REQUESTS=YES`, turn on **one** first-unit job (`Approval=APPROVED`, `State=READY`), and run `ctsWatchdog` once manually. Inspect `AI Run Log` and the report folder for a saved response.
7. After successful verification, run `ctsInstallWatchdogTrigger()` to install a five-minute time trigger. The watchdog automatically continues **only tasks it owns** and only while approvals, limits and conditions permit.
8. Emergency stop: `ENABLE_LIVE_REQUESTS=NO`, or `ctsRemoveWatchdogTrigger()`. Existing jobs and saved reports remain intact.

## Operational safeguards

- **Zero automatic deployment or communication:** The watchdog reviews lessons; it cannot edit the website or contact students.
- **No answer keys or personal student information** are included in model prompts. The source allowlist is still a *human review task*; only approved student-edition text may be added.
- **Costs:** ChatGPT/Claude web subscriptions do not cover these API charges. The watchdog refuses calls once conservative *reserved* spending would breach its $10 ceiling (based on user-entered model prices and bounded tokens). This is not a provider-level guarantee: verify rates, add provider billing/credit caps, use dedicated API keys, and remember charges from other callers do not appear in our sheet. The price settings deliberately do not rely on an AI-guessed model price.
- **Lost call:** If a model API call times out, the result may exist remotely but be unavailable locally. This is ALWAYS flagged for human review, without automatic retry. The obsolete `ALLOW_UNCERTAIN_RETRY` property is ignored.
- **No progress:** Two identical successive outputs (aside from whitespace) cause `REVIEW_REQUIRED`, rather than an endless loop.
- **Output preservation:** Each successful attempt is saved in a private Drive folder before updating its Sheets checkpoint. The full historical transcript can be recovered from those timestamped Drive files.
- **Strict per-job attempt limit:** v0.4 enforces at most four attempts regardless of spreadsheet entries.
- **One job per tick:** A five-minute cadence is only an approximate Apps Script scheduling interval, not continuous execution.
- **App script limitations:** Google Apps Script API permissions and external model connections have not been integration-tested in a live project. Verify provider API compatibility and Google authorization scopes when enabling.

## Offline tests

```bash
node tests/watchdog.test.cjs
node tests/transitions.test.cjs
node tests/provider.test.cjs
node tests/preflight.test.cjs
```

## Handoff boundary

ChatGPT owns the specification, code, offline testing, academic audit protocol and independent-review queue. Bring Robert into the work only if a final production security check or deployment review is necessary; **do not request Robert to debug the pilot now.** The 20 denominational electives and existing textbook/readings work retain their higher priority in the tracker.

## Public-facing completion report

When a reviewer sends `[[CTS_DONE]]`, its full answer is stored in the restricted report Drive folder, and the job becomes `DONE`. The watchdog never sends student emails, commits academic changes, or publishes the course. Cross-model reconciliation happens **only after independent reports have been saved**.

## Provider documents used

- OpenAI Chat Completions: https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create
- OpenAI model pricing: https://developers.openai.com/api/docs/pricing
- Anthropic Messages: https://platform.claude.com/docs/en/api/messages/create
- DeepSeek Chat Completions: https://api-docs.deepseek.com/api/create-chat-completion/

The OpenAI request uses `max_completion_tokens` for current reasoning-model compatibility. Claude and DeepSeek use `max_tokens`. Exact supported models and rates are verified again at activation.

## Preflight findings and remaining owner action (2026-10-24)

Four offline suites pass and model names were checked against current vendor documentation. A mock provider request is **not** a live integration test. GitHub source does not install an Apps Script project; Google Drive connector cannot configure Apps Script or secret properties. No Google browser session is currently authenticated for assisted setup. A Google-account owner must authorize access to the Apps Script project and store the secrets privately. Do not paste API keys into chat, GitHub, or Sheets.

**First safe exercise:** leave all three real course-review jobs HOLD. Once installed, run `ctsPreflight` with global switch NO; then run a single synthetic lesson smoke test with one explicitly approved job and a model whose pricing and account billing limit have been confirmed. Confirm the report artifact, log reservation, and continuation behavior before testing any copyrighted or student-facing course materials.
