# Portuguese completion — source baseline and delivery backlog

Status: implementation in progress; no native theological acceptance claimed.
Owner: Robert Allen. Executor: Codex. Integration target: beta; the parent
repair session owns the current #406 → #331 → #412 merge/deployment sequence.
This task never pushes or merges beta/main or changes those PR branches.

## Startup receipt (27 November 2026)

CTS website remote verified as chapala-seminary/website; brain remote verified
as chapala-seminary/brain. Read workspace AGENTS.md, brain MEMORY.md then
CLAUDE.md, USER.md, AGENTS.md, AGENT_RULES.md, GIT_WORKFLOW.md, SECURITY.md,
projects/website/PROJECT.md; website AGENTS.md and release runbooks.
Shared policy: tirith-tech/agent-ops reviewed main
b9c38f337e47b8b28cb4605a857266e48b926cd4, verified through GitHub's current-main
commit endpoint; read committed AGENTS.md, README.md, contracts/task.md,
docs/task-routing.md, workflows/delivery.md, workflows/pr-review-repair.md,
workflows/batched-ci.md at that SHA. No CTS company profile exists there.
The local policy fetch failed because its git directory is outside writable
roots; website fetch initially lacked network, then succeeded with escalation.
Actual primary: main, 726ace61bbf8f7d2bbe261a8ccde887237714e82.
Explicit implementation/PR base: beta, d1dda57247c818fad2247351b4196869aa28f0ea.
CTS is outside generic feature-batching adoption. Isolated writer branch:
codex/portuguese-coverage-20261127. Connector identity was satoshisound; new
Robert subsequently authorized satoshisound for beta publication; documentation
PR #418 records both permitted accounts while preserving human production gates.
The 27 November review note was read as a proposal, not canonical policy.

## Reproduce the inventory

From this checkout:

```sh
node --test test/portuguese*coverage.test.mjs
node tools/portuguese-coverage.mjs /tmp/portuguese-coverage.json --built dist
ASSESSMENT_KEYS=/path/to/private/assessment-keys node tools/portuguese-private-coverage.mjs > /tmp/portuguese-private-counts.json
```

The committed `portuguese-coverage.json` records every allowed public source
file's SHA-256 and byte size, candidate content routes, missing/stale JSON
pointers, field-state counts, static-pair counts and binary audit work. It reads
tracked public files only; no private banks, student records or review packets.
It includes legacy bodies, page templates, layouts/components/libraries, reading-room metadata, reader assets,
downloads, dictionaries, browser scripts and Worker service modules. French
reader packets are recorded as reference assets, not extra Portuguese source
fields. Generated routes still require a built-site crawl; candidates are not
an assertion that a URL exists. Every non-measured surface remains explicitly
unaudited. Compare file hashes before reusing the report; regenerate after beta
moves. Tests distinguish missing, stale, machine and reported human status,
and verify blank options and exclusion of key/rubric text.

Refreshed against beta e73359d2bb08db0d6d9939970a6c9483d68edf40 (#406),
merged only into this isolated branch. Manifest source commit
1028d1336bf5ed704f22fa1d18571f73c265ea60 contains that beta plus inventory
tooling/docs; it does not include later #331/#412 changes. At this baseline: 3,152 source/reference files, 86,001 English language fields;
9,155 missing Portuguese fields, 36,046 machine/unreviewed lesson fields,
40,800 other present but unreviewed fields. Missing fields contain 976,537
English source word occurrences, including repeated navigation/metadata. This
is not a unique translation-word count, price quote or schedule. HTML scripts,
linked resources and private keys require additional measured work.

| Collection | Files | Missing language fields |
| --- | ---: | ---: |
| Lessons | 680 | 0 (36,046 machine/unreviewed blocks) |
| Public unit banks | 680 | 400 (unit-title arrays) |
| Textbooks | 66 | 2,934 |
| Reading tests | 66 | 2,772 |
| Papers | 66 | 1,122 |
| Finals | 65 | 975 |
| Course title/description | 66 | 132 |

Source-field gaps may already have dictionary-based display translations;
rendered output must determine visible fallback. Presence does not certify
meaning, answer acceptance or alignment.

## Ordered delivery and acceptance

- [x] Reproducible initial public-source manifest and explicit unknown states.
- [ ] Build/crawl every Portuguese route and freeze the reviewed fallback baseline.
- [ ] Inventory every linked reading resource and download, source rights,
  assigned excerpts and existing accepted Portuguese. De-duplicate source words.
- [x] Reproducible private field/count audit: 877 banks, zero public/private question-count mismatches.
- [ ] Private semantic audit: stable IDs, option positions, fill acceptance, explanations,
  models/rubrics and public-key absence. Export counts/verdicts only.
- [ ] Service tranche: verification/recovery/certificate messages, welcome,
  outreach, appeals, Portuguese links, award names, PDF and public verification.
- [ ] First foundation journey: Old Testament Survey (CTSOTS/CTS), including
  textbook, five assigned readings and every linked reader, tests, paper and
  final; registration, restore, remembered PT and all completion outputs.
- [ ] Remaining foundation courses: NT, Systematic Theology, Evangelism,
  Pastoral Ministry, Church History, Preaching. Each course gets a focused PR.
- [ ] Remaining course tranches, then Counseling/Ethics/Narrative/Preaching
  legacy question paths and static/support/policy/interface gaps.
- [ ] Build, full feature suite, journey suite, phone/desktop visual review,
  English source controls, no published keys; deployed-beta acceptance.
- [ ] Qualified Portuguese/theological review, then Wayne's separate production gate.

Do not translate held source as if accepted: #337 depends on reconciled readings
and private assessment-keys #25; #354 awaits Wayne's Systematic Theology source;
#411 remains Hennis review material. Matos #375–386 are review packets, with
storage/display mapping and question alignment unresolved. Reuse accepted
faculty Portuguese after verifying acceptance and current source mapping. Refresh
#406 Statement of Faith and #412 homepage/SEO sources after the parent's merges.

## Pending faculty decisions

Robert assigned Wayne approval of Portuguese theological wording, glossary and
Scripture edition in this chat. Brazilian Portuguese conventions, terminology
and Scripture quotation permission remain for that review. Retain draft
notices. Do not label machine text approved or invent faculty acceptance.
No paid translation service is authorized. Preserve English source controls,
all storage keys/credit, grading rules, stable question IDs/option order and
activation dates in every tranche. Private grading material stays private.

## Current verification and publication limits

Focused inventory tests pass. The baseline build passed and observed 1,878 Portuguese HTML routes, all declaring
Portuguese, with 157 missing dictionary entries. This is a built-file audit, not
a live interaction claim. The full feature suite is running; independent
review remains pending; this baseline is not ready to merge. No beta deployment or live acceptance is claimed. Robert authorized satoshisound
for beta publication; the separate documentation candidate is PR #418. The source manifest PR is the
first delivery; subsequent tranches stay open until their own acceptance passes.

## First foundation private coverage (counts only)

CTS Old Testament Survey has PT on 260 unit MC explanations, 130 fill answers,
130 short-answer models and 130 keyword maps. Two of 77 optional alternate-answer
maps and 332 rubric language fields lack PT. Its textbook and reading banks each
lack PT on 40 primary-answer and 40 alternate-answer maps. The optional final
lacks PT on ten primary-answer maps, ten alternates, four models and sixteen
rubric fields. Rubric source fallback can be intentional; Wayne must decide the
required language coverage. Counts do not establish answer acceptance, option
meaning or faculty approval. The private audit output remains local.

## Foundation linked-reader backlog refresh (28 November)

The OTS room contains five inline digests, but the masters page additionally
links five separate Part II readers (21,361 English words). Standalone Part I
readers and the complete-books shelf also require coverage and source alignment.
Do not mark the foundation journey complete from the five inline cards alone.
Wayne must approve theological terms and Scripture choices. Existing publisher
Portuguese resources should be linked after availability/rights verification.
