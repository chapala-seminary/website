# CTS Correspondence Console — architecture and M0/M1 report

Issue #163. Written 22 Oct 2026 by Claude. Status: **M0 complete, M1 built and
tested, nothing deployed.** The code is in `correspondence/`; it is a Worker of
its own and is not touched by `npm run deploy` or `npm run deploy:beta`.

The goal, in one line: Dr. Cook reads a short list of decisions and exceptions,
not the inbox. Every message is read once, filed into a case with a running
summary, and either handled by rule, queued for a reviewer, or put in front of
him — with the reason.

---

## 1. What M0 found (read-only inspection, 22 Oct 2026)

Only aggregate counts are recorded here; no names or addresses.

**ChapalaTheological@gmail.com.** About 200 threads arrived in the last 7 days.
Of the 50 most recent, 40 were automated (GitHub notifications, the site's own
`certificates@` notices, provider notices, newsletters), 1 was CTS's own, and 9
came from people. Mail to `info@chapalaseminary.org` arrives in this same inbox,
so one mailbox covers both addresses for M1.

Of the 9 human messages, the rules in this PR file them as: outreach replies (3,
by thread context), students' completion reports sent from the site's mail link
(3, routine, low priority), one assessment problem (technical escalation), one
faculty offer (Dr. Cook decides), one general question. Two rule gaps found on
real mail were fixed and are now tests (`correspondence/test/rules.test.mjs`).

**The outreach tracker sheet** (CTS Outreach & Partnerships — Master Tracker):
411 contacts. 365 are marked "Awaiting response", 29 "Closed", 9 stuck at
"Sending". Outreach went out from five accounts, most from
`chapalaseminary@gmail.com` (260), then `info@` (83), `chapalatheological@`
(34), and Wayne's two personal accounts (27). The "Awaiting response" figure confirms
the issue's warning: the statuses are not ground truth, and a reply that came
back to a different account than the one that sent is invisible to the sheet.

**The site** already has the pieces to copy: a Worker with D1, Cloudflare Access
staff pages with their own token check (`worker/staff.js`), cron triggers, and
Workers AI for grading. The console reuses those patterns but none of the code.

---

## 2. Architecture

```
 Gmail (read-only)          Cloudflare Worker: cts-correspondence           People
 ────────────────           ──────────────────────────────────────          ──────
 ChapalaTheological ──┐     cron every 10 min                                Dr. Cook
 (info@ forwards here) │      └ sync: history since cursor ─┐                (phone)
 later, on approval:   ├──▶     per message:                │                   ▲
 other CTS accounts ───┘        1 claim (unique id)         ▼                   │
                                2 rules: lane, category, flags        /console (Access)
 site support form (M2) ──────▶ 3 case: link, state, summary  ──▶ D1: cts-correspondence
                                4 optional model summary            cases, threads, messages,
                                5 log every decision                suppressions, events
```

**Separate Worker, separate database.** A fault in the console cannot touch a
student's progress, and the students' database never holds correspondence. The
console will reach student records (M2) only through a server-side lookup that
returns the minimum: whether an address belongs to a registered student, and
the program and course. Never the student code.

**Not Google Sheets.** The case ledger is D1 (SQLite), with uniqueness enforced
by the schema. The tracker sheet stays as a temporary report for the
faculty/partner pipeline only (section 8).

**Not the AI Browser Assistant.** Mail is read by API on a schedule in the
cloud; nothing depends on Wayne's PC being on. Section 9 says where the
assistant fits.

---

## 3. The data (correspondence/migrations/0001_init.sql)

| Table | One row per | Guarantees |
|---|---|---|
| `mailboxes` | approved institutional account | `enabled = 0` until approved; holds the history cursor |
| `contacts` | address | unique normalized address; **names never merge contacts** |
| `cases` | matter with one counterpart | `track` is `student_support` or `relations`, never both; status is one of new / draft / waiting_on_us / waiting_on_them / scheduled_follow_up / resolved / escalated |
| `threads` | Gmail thread in one mailbox | unique (mailbox, thread); `link_state = needs_review` when a cross-mailbox link is plausible but not proven |
| `messages` | provider message | unique (mailbox, message id) — the idempotency key; stores a redacted excerpt only |
| `suppressions` | address × reason | hard bounce / opt-out / refusal are permanent; soft bounces count up and are never made permanent automatically |
| `case_events` | decision | append-only: rule hits, model calls, status changes, human edits, switches |
| `dead_letters` | message that failed to read | retried with backoff (5 min → 24 h), given up after 6 tries and shown on the console |
| `settings` | switch | `paused`, `sending_enabled` (stays 0), `ai_enabled` (0 until approved) |

Addresses are normalized (`normalize.js`): lower-case, and for Gmail the dots
and `+tags` that Gmail itself ignores. Other providers' local parts are kept.

---

## 4. Reading mail incrementally (correspondence/src/sync.js, gmail.js)

- **Scope `gmail.readonly` only.** A token that carries send/modify scope is
  refused at startup (tested). There is no `send_email` binding and no sending
  code in this Worker.
- **First run:** list the last 14 days by date, oldest first; take Gmail's
  history cursor *before* listing so nothing between is lost.
- **Every run after:** `history.list` since the cursor. Each new message is
  fetched once, by id. A thread is never re-read. The cursor moves past a
  history record only after its messages are stored or parked for retry.
- **Expired cursor** (Gmail keeps about a week): list by date from one day
  before the newest stored message. Already-stored ids are skipped without a
  Gmail read; nothing is counted twice (tested).
- **Budget:** 200 messages per mailbox per run, so a backlog drains over
  several runs instead of timing out (tested with 250).
- **Rate limits:** 429 and 5xx are retried with exponential backoff, honoring
  `Retry-After`.

---

## 5. Triage and policy (correspondence/src/triage.js)

Rules first, model second, policy last:

1. **Lane** (no model): CTS's own outbound, automated (list headers, no-reply
   senders, GitHub, the site's notices), auto-reply, bounce (hard/soft), opt-out
   (EN/ES/FR/PT phrases, short messages only), or human.
2. **Category** for human mail, by multilingual keyword rules, the sensitive
   ones checked first.
3. **Flags:** `injection` (text addressed to an AI or claiming authority),
   `commitment` (asks CTS to grant credit, sign, or pay), `urgent_words`,
   `duplicate_question`, `suppressed_contact`, `completion_report`.
4. **Policy matrix** below. Flags can only make a decision stricter.

| Category | Track | Priority | Reviewer must approve reply | Dr. Cook decides | Template allowed (M2/M3) |
|---|---|---|---|---|---|
| enrollment_login | student | high | no | no | yes |
| exam_certificate | student | normal | no | no | yes |
| general | student | normal | no | no | yes |
| outreach_reply | relations | normal | no | no | yes |
| technical_issue | student | high, **escalated** | yes | no | no |
| coordinator_offline | student | normal | yes | no | no |
| faculty_content | relations | normal | yes | **yes** | no |
| partnership_accreditation | relations | high | yes | **yes** | no |
| personal_financial | relations | high | yes | **yes** | no |
| security_privacy | student | urgent | yes | **yes** | no |
| marketing | automated | low | — | — | no |
| *any + injection flag* | | urgent | yes | **yes** | no |
| *any + commitment flag* | | ≥ high | yes | **yes** | no |

State rules the tests hold the code to:

- CTS replies → `waiting_on_them`, and the next action says *do not send
  reminders automatically*. If the reply **promised** something ("le
  enviaremos…"), the case stays `waiting_on_us` and the promise is listed.
- A technical report is `escalated`; an acknowledgement does not change that;
  closing it requires written evidence that the fix was checked.
- A question CTS already answered (same question words, with an outbound reply
  in between) is flagged, dropped to low priority, and the next action points
  to the earlier answer.
- Threads in two mailboxes join on RFC `Message-ID` / `In-Reply-To` evidence.
  Same counterpart + same subject without that evidence is joined but marked
  *link to confirm* on the console.

---

## 6. Summaries and the model (correspondence/src/summary.js)

Each case keeps a running summary of at most five dated sentences, plus facts
and CTS's commitments. It is updated from **the previous summary and the newest
message only**.

The deterministic summary always runs. A model (Workers AI,
`llama-3.1-8b-instruct-fast` by default) runs only when the owner turns
`ai_enabled` on, and then:

- it sees the current summary and the newest excerpt (≤1,500 characters,
  quoted history stripped, codes/passwords/card numbers removed), fenced and
  labelled *untrusted*;
- its reply must be JSON of a fixed shape with a category from the fixed list,
  or it is discarded and the deterministic summary stands;
- it may name a category only where the rules found none, and the policy table
  still decides who must act; it can never relax a rule's decision (tested);
- every call is logged with model, prompt version and input size.

In the simulation (section 10) about 4% of all messages were human mail the
rules could not categorize — the only ones where a model adds a category.

---

## 7. Privacy, security, failure handling

- **Access:** the console is behind its **own** Cloudflare Access application
  (`CONSOLE_ACCESS_AUD`); the Worker checks the token's signature, audience,
  issuer and expiry itself. The site's staff sign-in does not open it (tested).
  No configuration means no page.
- **Roles** (`CONSOLE_ROLES`): owner, reviewer, viewer. Viewers read. Reviewers
  change cases and can **pause**. Only the owner can **resume**.
- **Kill switch:** one button pauses all automatic steps immediately; the next
  scheduled run does nothing, not even read mail (tested).
- **Forms** refuse cross-site posts; pages are `no-store`, `noindex`, no scripts,
  strict content-security policy.
- **What is stored:** metadata, a redacted excerpt of the newest text (none for
  automated mail), summaries. Bodies stay in Gmail. Excerpts are cleared after
  180 days by a daily job; summaries and the event log remain.
- **Never stored or sent to a model:** passwords, student codes, verification
  codes, card-like numbers (redacted before storage); exam answers are never
  requested. No student data is in git: every test uses `example.org`.
- **Untrusted input:** email text never changes permissions; injection-shaped
  text is flagged and sent to the owner.
- **Retries / dead letters / replay:** failed reads are durable rows, retried
  with backoff; because ingest is idempotent, any window can be re-read safely.

---

## 8. The tracker sheet

Kept as a report for the faculty/partner pipeline only. M2 adds a one-way
import of `Contacts` and `Follow-Ups` into `contacts`/`cases` marked *imported,
unverified* — the sheet's status is a hint, not the truth — and its Exclusion
List into `suppressions` as `manual`. After that the database is the source and
a filtered view can be written back to the sheet for reading. Student support
cases never go to the sheet.

---

## 9. The AI Browser Assistant

Useful for supervised, exceptional web tasks the console lists — checking an
institution's website for a corrected address after a hard bounce, or looking
something up on a partner's portal. It reads the console's JSON
(`/console/data.json`) through an Access service token and reports back as a
person would. It is **not** the message queue, not a mail reader, and not a
sender. Basic email processing never depends on it or on Wayne's PC.

---

## 10. Planning for 100,000 students

Assumptions (stated, to be checked against M1's real numbers):

- 0.15 human messages per student per month → 15,000/month (~500/day);
- automated mail about three times that → ~60,000 messages/month in all;
- peak: ten times the hourly average (~800/hour) after an announcement.

Simulation (`node correspondence/tools/load-sim.mjs 20000`, Node's SQLite, the
real migrations and state machine, a 70% automated mix):

| Measure | Result |
|---|---|
| Statements per message | 6.7 on average |
| Local throughput | ~5,000 messages/s |
| Dashboard with ~4,800 open cases | 160 ms, 12 statements |
| Messages a model could add anything to | 4.2% |

What that means at 60,000 messages a month: about 400,000 D1 statements, far
inside the Workers Paid plan the account already has. Gmail API use is a few
units per message against a quota of billions per day. The peak hour is 800
messages against a budget of 200 per mailbox per 10-minute run (1,200/hour).
Workers AI is billed by use beyond a daily free allowance; it is off by
default, and the rules carry most mail without it. M4 repeats this against the
real D1 and real Gmail before any scaling decision.

---

## 10a. All six mailboxes and automatic routine replies (23 Oct 2026)

Wayne, 23 Oct 2026: "Since we advertise using all emails we may need to
include them all. I think it best to automatically respond to students for
routine responses." Then: "check all six" (the personal accounts included;
some may be dropped later). ChatGPT's review is in the tracker, Assistant
Messages row 348; the founder guardrail is #163 comment 6365570007. Built in
`migrations/0002_all_inboxes_auto_reply.sql` and `src/relevance.js`,
`src/policy.js`, `src/templates.js`, `src/autoreply.js`, `src/send.js`.

**Reading.** Each of the six connected Gmail accounts is a mailbox row with its
own read-only token. Two are institutional (ChapalaTheological, chapalaseminary);
four are personal, marked `personal = 1`. info@chapalaseminary.org is an alias,
read wherever it delivers. From a personal mailbox a message enters the ledger
only on evidence that it is the seminary's: it answers a message already in
the ledger, it names the seminary, or its counterpart is a seminary contact and
it speaks of study. Anything else is not stored at all, only its id, so it is
not fetched again (ids cleared after 30 days). The personal addresses are not
in this public repository: the mailbox rows and `OWN_ADDRESSES_EXTRA` are set
in D1 and secrets.

**One message, once.** The same email in two mailboxes (a personal account forwarding to
ChapalaTheological; a CC; a copy in Sent) has the same Message-ID: the second
copy is stored as a copy of the first, joins the same case, and does nothing
else. Cases are still never merged on a sender address alone.

**Automatic replies.** Only from approved templates, never written by a model:
how to start; a group wanting to study (everyone may register now, no limit,
partnership separate); lost student code; retaking exams; course requirements;
is it free; how to get a certificate; languages. English, Spanish and French.
A reply is planned when a student's message asks only these questions, and is
due 30 minutes later. When due it is checked again against everything read from
all six mailboxes: if anyone answered from any account, if the student wrote
again, or if the case became one for Dr. Cook, it is not sent. Never automatic:
partnership, faculty, money, security, doctrine, credit or any commitment;
technical problems (they need diagnosis); offline/coordinator matters;
completion reports and missing certificates; opt-outs; suspicious text; other
languages; mail older than 48 hours; long or many-question letters; and the
follow-up in a case that already had an automatic reply. A thank-you after CTS
answered closes the case without a reply.

**Policy, versioned.** `src/policy.js` lists every fact a template rests on,
each marked confirmed (Dr. Cook), published (the live site says it), proposed
or unverified. A template is sendable only if all its facts are confirmed or
published AND Dr. Cook approved its exact text in the console (the approval is
a hash of the words; any edit needs a new approval). "Languages" rests on a
proposed fact and cannot be sent until he confirms it. Every outgoing text
passes `validateReply()`, which blocks invented limits (pilot, small group
first, quota, waiting list, waiting for a partnership), accreditation and
credit promises, fees, waived exams, promises about paper exams (allowed only
as "being developed"), the wrong title, outside links and addresses.

**Sending.** One account, chapalatheological@gmail.com, with a token that
carries `gmail.send` and nothing else (refused otherwise); reading tokens still
refuse anything that can send. Never info@/Resend, never a personal account.
The reply threads into the student's message (natively when it arrived in the
sending account, by In-Reply-To/References otherwise), is marked
`Auto-Submitted: auto-replied`, and says plainly that it is automatic and that
a reply reaches a person. Each message gets at most one automatic answer (a
unique key on its Message-ID); a send is tried once, and an unconfirmed one is
marked for a person to check Sent, never retried. Daily cap 40. A run in which
any mailbox could not be read sends nothing.

**Switches.** `auto_send`: off (default) → shadow (writes exactly what would
be sent, sends nothing) → live. Only the owner turns it on or approves texts;
any reviewer can turn it off; Pause stops everything. The console's
"Automatic replies" page shows each template, its facts and their standing,
the texts in all three languages, and every reply with its status; the daily
digest lists every reply sent or recorded.

Not built here: the 7/21/42-day inactivity messages (a proposal, not approved;
the site's `worker/outreach.js` already sends at 7 and 21 days), and the
technical-diagnosis workflow of #161 (technical problems are never answered
automatically; they stay escalated for a person).

## 11. Rollout — every step needs Wayne's approval

| Step | What happens | Sends mail? |
|---|---|---|
| **M0** ✔ | this document, the schema, the policy matrix, the baseline | no |
| **M1** (built) | read-only sync of **ChapalaTheological@gmail.com** (covers info@), cases, summaries, dashboard, digest | no |
| M1 shadow week | run beside the weekly manual review; compare what each caught | no |
| M2 (built 23 Oct) | all six Gmail accounts, personal ones filtered to seminary mail; copies across mailboxes | no |
| M3 (built 23 Oct, off) | automatic routine replies: shadow first, then live with each template approved by Wayne (authorized 23 Oct for routine student replies) | only in live, approved templates only |
| later | reviewer drafts in Gmail; sheet import; student-record lookup; site support form | no (drafts only) |
| M4 | load test on real infrastructure; cost, lag, error rates | no |

## 12. Blockers — what only Wayne can do

1. **Google read-only access.** Create a Google Cloud OAuth client and sign in
   once as ChapalaTheological@gmail.com granting `gmail.readonly`. The app must
   be set to *In production* (not *Testing*), or Google expires the refresh
   token every 7 days. Google shows an "unverified app" warning for a personal
   account; that is expected for the owner's own use. Then store
   `GMAIL_CLIENT_ID`, `GMAIL_CLIENT_SECRET` and `GMAIL_REFRESH_TOKEN_CTS_GMAIL`
   as Worker secrets. *Fallback if this is a burden:* a small Apps Script in the
   same account that forwards new-message ids to the console; more moving
   parts, so not the first choice.
2. **Cloudflare:** create the `cts-correspondence` D1 database, put its id in
   `correspondence/wrangler.jsonc`, and create a **separate** Access application
   for the console's hostname naming who may sign in.
3. **Roles:** which email is owner, which are reviewers.
4. **Mailboxes:** decided 23 Oct 2026, all six. Each needs its own read-only
   sign-in (`GMAIL_REFRESH_TOKEN_<ID>`), and ChapalaTheological a second,
   send-only sign-in (`GMAIL_SEND_REFRESH_TOKEN`).
6. **Automatic replies:** read the templates on the console's Automatic
   replies page, approve the ones to use, confirm or correct the "languages"
   fact, watch a shadow week, then switch to live.
5. **Model summaries:** whether to turn `ai_enabled` on after the shadow week.

## 13. Tests

`npm run test:correspondence` (also first in `test/run-tests.sh`): 55 tests, all
passing on 23 Oct 2026 (19 new: personal-mail privacy, copies across mailboxes,
shadow and live sending, approval, superseding answers from any mailbox, never-
automatic cases, unknown sends, caps, the founder regressions (a)–(f), the send
token's scope, header injection, the console's switches); 36 passing on 22 Oct 2026 — every acceptance test in the issue, the four seed
examples (synthetic stand-ins), sync and recovery against a fake Gmail, access
and roles, model-output checks, and the rule set. The SQL was also applied to a
local D1 with wrangler, and the Worker answered `/health` and refused
unauthenticated `/console` in local workerd.
