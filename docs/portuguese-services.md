# Portuguese service tranche — draft for beta review

Owner: Robert Allen. Executor: Codex. Wayne approves Portuguese theological
wording, glossary and Scripture edition; no such approval is claimed here.
This is the service slice of the Portuguese completion assignment, not a claim
that any foundation course or the entire Portuguese site is finished.

## Startup and ownership

Verified CTS website remote: chapala-seminary/website. Read workspace AGENTS.md,
brain MEMORY.md then CLAUDE.md, USER.md, AGENTS.md, AGENT_RULES.md, GIT_WORKFLOW.md,
SECURITY.md, website PROJECT.md/DECISIONS.md/GLOSSARY.md; website AGENTS.md and
beta/content release runbooks. Agent-ops reviewed main pinned to
b9c38f337e47b8b28cb4605a857266e48b926cd4, freshness verified through GitHub after
the outside-workspace policy fetch failed. Read committed AGENTS, README,
contracts/task, docs/task-routing, delivery, pr-review-repair and batched-ci from
that SHA. No CTS profile; generic feature batching is not adopted for CTS.
Actual primary main 726ace61bbf8f7d2bbe261a8ccde887237714e82; explicit PR target
beta, initial base d1dda57247c818fad2247351b4196869aa28f0ea. Isolated branch
codex/portuguese-services-20261127. Startup receipt recorded in task chat before
writes. Parent is sole beta integrator for #406/#331/#412; no beta/main push,
merge, deployment or changes to those branches/ledgers from this task.
Connector and CLI are satoshisound. Robert explicitly requested documentation
allowing this account for beta work; the separate policy proposal is website#418. No watcher is enrolled.

## Change

Portuguese records previously fell back to English for outgoing email, PDF and
public verification. This slice adds PT verification/recovery/certificate,
welcome/outreach, appeal and deferred-grading-result messages. It keeps the
language in links, including queries and fragments, and adds /pt/verify lookup,
redirect, found, absent and revoked pages using the existing public verification
privacy/rate-limiting behavior. Original stored certificate titles stay English;
PT display titles use the existing PT course dictionary. Two absent course names
(Preaching and Islam) are supplied as machine drafts. The Worker catalog and
92 PDF certificate name records now carry PT display titles. Removing the new
PT properties from the generated catalog exactly recovers the previous catalog:
IDs, course/assessment requirements, activation dates and source-language names
are unchanged.

PDFs have PT program names, wording, dates, controls and an English download
option. The certificate registration panel has PT messages and verification
links. The Hermeneutics browser-selected-program warning is retained in PT.
New PT PDF/public verification output carries a translation-review notice.
Course signatures are the existing template assets; their presence is not
faculty approval of these translations. Wayne must review terms such as
Grau Associado em Divindade and Mestrado em Divindade before production.
No grading rules, question banks, student storage or earned credit change here.

## Verification

Focused checks:

```sh
node --test test/portuguese-services.test.mjs
node test/email-language.test.mjs
node test/welcome-email.test.mjs
node test/portuguese-pdf.test.mjs
node tools/gen-worker-catalog.mjs --check
node tools/build-cert-names.mjs --check
npm run build
ASSESSMENT_KEYS=/path/to/private/assessment-keys test/run-tests.sh
npm run test:e2e
```

The focused tests exercise PT messages, fallbacks, localized queries/fragments,
all Worker course display names, preserved stored titles, verification lookup,
redirect/statuses, dates, escaping and revoked-certificate privacy. The PDF test
uses local synthetic data and the actual browser PDF library for six certificate
kinds. Test PDFs remain in /tmp/cts-portuguese-pdfs, outside git. A new journey
checks PT registration, first foundation-unit credit, English source controls
and restoration on a phone. It does not claim textbook/readings/paper/final or
full-course acceptance.

Status: focused checks pass; build/full-suite/journey and independent final review
are in progress. All six final synthetic PDF renders were inspected, including the translation
notice, accented names and program wording; no clipping or overlap was observed. No PR, deployment,
live acceptance or production readiness is claimed. The broader source inventory
and foundation-content/private-key work remain separate slices.

## Review repair

An independent early review found that PT verification was not routed through
worker/index.js. The route and private-path classification now include PT. The
regression test uses the actual entrypoint on the canonical production host,
asserts no static ASSETS fallback and checks no-store/noindex, redirect, missing,
issued, revoked and escaped output. The reviewer independently verified the fix.

Local Wrangler startup initially failed with spawn EBADF. Polling file watching
(CHOKIDAR_USEPOLLING=true, CHOKIDAR_INTERVAL=2000) starts a healthy local Worker;
complete suites are running with that environment. No test assertion is disabled.
