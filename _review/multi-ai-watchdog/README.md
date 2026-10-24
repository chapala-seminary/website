# CTS Multi-AI Watchdog — owner-built pilot v0.2

**Status:** Source code and mock integration tests complete. **Not deployed, not activated, not spending money.** Robert is *not* required during design, coding or offline testing. This pilot does not control consumer ChatGPT, Claude or DeepSeek web sessions: it can resume only API requests the watchdog itself creates.

## What is complete

- Two existing Google Sheets tabs `AI Jobs` and `AI Run Log` plus a `Multi-AI Pilot` coordination tab.
- 13-unit student-facing English *Systematic Theology* review packet held privately in Drive as PDF and `.txt`. **The archived packet may differ from the production site**; verify proposed changes against live course material before deployment. The tests in this archive use **synthetic** course text, not real lessons, so public source code contains no curriculum copies.
- An Apps Script watchdog that runs one approved model call per tick; saves complete responses to a configured Drive folder (append-only), records a compact checkpoint in the sheet, and resends a targeted **Continue from the checkpoint** instruction when no completion marker appears.
- A global on/off switch, per-job approval, daily API-call cap, attempt cap, independent model jobs, no-progress detection, source-file allowlist, lock against concurrent triggers, and stop on `[[CTS_DONE]]`, `[[CTS_BLOCKED]]`, `[[CTS_NEEDS_APPROVAL]]`, or uncertain failure.
- Node tests of all 13 unit boundaries and mocked continuation, approval, completion, logging, full-output storage and budget limits.

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
| `MAX_CALLS_PER_DAY` | Suggested pilot 4, absolute upper bound controlled by operator |
| `MAX_OUTPUT_TOKENS` | Suggested pilot 1600 |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | API key and exact model for OpenAI, if enabled |
| `CLAUDE_API_KEY`, `CLAUDE_MODEL` | API key and exact model for Anthropic, if enabled |
| `DEEPSEEK_API_KEY`, `DEEPSEEK_MODEL` | API key and exact model for DeepSeek, if enabled |
| `ALLOW_UNCERTAIN_RETRY` | Leave unset; only `YES` would retry if a prior API call's outcome was lost, potentially duplicating charges |

4. In the `AI Jobs` sheet, leave `Approval=HOLD` and `State=HOLD` until separately approved. The model credentials alone cannot start work.
5. Once costs, data-sharing destination and credentials are explicitly approved, set `ENABLE_LIVE_REQUESTS=YES`, turn on **one** first-unit job (`Approval=APPROVED`, `State=READY`), and run `ctsWatchdog` once manually. Inspect `AI Run Log` and the report folder for a saved response.
6. After successful verification, run `ctsInstallWatchdogTrigger()` to install a five-minute time trigger. The watchdog automatically continues **only tasks it owns** and only while approvals, limits and conditions permit.
7. Emergency stop: `ENABLE_LIVE_REQUESTS=NO`, or `ctsRemoveWatchdogTrigger()`. Existing jobs and saved reports remain intact.

## Operational safeguards

- **Zero automatic deployment or communication:** The watchdog reviews lessons; it cannot edit the website or contact students.
- **No answer keys or personal student information** are included in model prompts. The source allowlist is still a *human review task*; only approved student-edition text may be added.
- **Costs:** ChatGPT/Claude web subscriptions do not cover these API charges. Set hard budget limits in each provider account before enabling; `MAX_CALLS_PER_DAY` caps attempts, not dollars.
- **Lost call:** If a model API call times out, the result may exist remotely but be unavailable locally. This is flagged for review; no automatic paid retry occurs unless separately opted in with `ALLOW_UNCERTAIN_RETRY=YES`.
- **No progress:** Two identical successive outputs (aside from whitespace) cause `REVIEW_REQUIRED`, rather than an endless loop.
- **Output preservation:** Each successful attempt is saved in a private Drive folder before updating its Sheets checkpoint. The full historical transcript can be recovered from those timestamped Drive files.
- **One job per tick:** A five-minute cadence is only an approximate Apps Script scheduling interval, not continuous execution.
- **App script limitations:** Google Apps Script API permissions and external model connections have not been integration-tested in a live project. Verify provider API compatibility and Google authorization scopes when enabling.

## Offline tests

```bash
node tests/watchdog.test.cjs
node tests/transitions.test.cjs
```

## Handoff boundary

ChatGPT owns the specification, code, offline testing, academic audit protocol and independent-review queue. Bring Robert into the work only if a final production security check or deployment review is necessary; **do not request Robert to debug the pilot now.** The 20 denominational electives and existing textbook/readings work retain their higher priority in the tracker.
