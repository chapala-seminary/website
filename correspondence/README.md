# CTS Correspondence Console

A separate Cloudflare Worker that reads CTS's institutional Gmail **read-only**,
files each message into a case once, and shows Dr. Cook only the decisions and
exceptions. Design, policy table, privacy plan and rollout:
[`docs/correspondence-console.md`](../docs/correspondence-console.md) (issue #163).

```
correspondence/
  wrangler.jsonc        its own Worker and D1 database (not deployed by npm run deploy)
  migrations/           the case ledger
  src/index.js          /console pages, cron entry
  src/sync.js           incremental Gmail sync, cursor recovery, retries
  src/gmail.js          read-only Gmail API client and message parsing
  src/ingest.js         one message -> one case update (idempotent)
  src/triage.js         lanes, categories, flags, policy matrix
  src/summary.js        running summary; optional model step, checked
  src/digest.js         dashboard data and the daily digest
  src/relevance.js      which mail in a personal mailbox is the seminary's
  src/policy.js         the versioned correspondence policy and reply check
  src/templates.js      routine questions and their approved answers (EN/ES/FR)
  src/autoreply.js      plan, re-check, shadow or send automatic replies
  src/send.js           the one sending path: gmail.send token, one account
  src/access.js         Cloudflare Access check and roles
  test/                 node --test, on Node's SQLite, synthetic data only
  tools/load-sim.mjs    planning simulation for 100,000 students
```

Test: `npm run test:correspondence`. The only email this sends is an
automatic routine reply, and only when the owner has set automatic replies to
live and approved that template (see section 10a of the design document).
