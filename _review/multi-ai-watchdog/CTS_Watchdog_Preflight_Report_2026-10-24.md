# CTS Multi-AI Watchdog | Preflight Review and Pilot Release Decision

**Date:** October 24, 2026 | **Build:** v0.4 | **Scope:** Google Apps Script pilot

## Overall finding

Offline code review and four mock integration tests have passed. **Not approved for unattended production use. Not installed. No paid API calls made.** A small synthetic-content smoke test is the next safe stage after authenticated account setup and provider billing controls.

## Security & privacy review

- Pass: keys are read from Apps Script Script Properties, not committed to website repository or written to sheets. A separate operator must set those properties.
- Pass: source Drive file ID must be allowlisted; the handler extracts one selected lesson rather than sending a whole file, and rejects text exceeding 32,000 characters.
- Pass: jobs require both APPROVED and READY/CONTINUE, plus a global ENABLE_LIVE_REQUESTS=YES gate before network calls.
- Pass: report outputs are saved to a separate restricted Drive folder, with no student emails, website edits or assessment key access.
- Outstanding: Google Apps Script sharing permissions, student-only source screening, external provider retention policies, and real account authorizations remain unverified. Do not supply copyrighted originals or student records.

## Recovery & reliability review

- Pass: incomplete replies queue a checkpoint-aware Continue; `[[CTS_DONE]]`, BLOCKED and NEEDS_APPROVAL stop appropriately.
- Pass: identical consecutive outputs halt for review; at most four attempts; no automatic retry on ambiguous timeout/stale RUNNING (v0.4 change).
- Pass: full model outputs are append-only Drive files; low-content sheet checkpoint remains available.
- Pass: a new read-only `ctsPreflight()` validates schema, source permissions, report folder, provider model and price settings.
- Outstanding: no live API request, Apps Script trigger, Google authorization, interruption, or provider-specific quota test has been performed.

## Budget review

- Pass: the code enforces MAX_PILOT_SPEND_USD <= $10 and caps one request per tick; it reserves a conservatively estimated amount before HTTP dispatch and enforces daily request count.
- Pass: the model/keys/prices are validated before placing a spending reservation, and DeepSeek retired model IDs are blocked.
- Pass: DeepSeek test defaults to non-thinking mode for predictable text within its small output allowance, while preserving configurable reasoning effort.
- Outstanding: software reservations do not control billing outside this script. The Google account owner must independently set and inspect provider budgets/credit balances and confirm exact applicable token prices.

## Pilot release gates (in order)

1. Google account holder pastes `Code.gs` into **Extensions > Apps Script**, configures the spreadsheet and private report folder, and runs `ctsPreflight()` with live requests disabled.
2. Owner configures a dedicated, low-cap API key and provider billing limit, verifies the exact model/rates, and grants explicit approval to send the *synthetic* source. Never put secrets in Sheets, chat, or public GitHub.
3. Run one synthetic DeepSeek smoke job, inspect saved output and stop/continue transitions and real API bill.
4. After smoke success, run a single student-only real lesson, compare citation/factual quality, stop/restart behavior and expense.
5. Before unattended production operation, have an independent security reviewer (Robert, only at final gate) check deployment scope and permissions. No changes to public website or exam keys.

**Decision:** Offline preflight passes; Google Apps Script install and live integration are **blocked on authenticated account access and billing configuration**, not on source-code readiness.
