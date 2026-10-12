# Beta staging review — 12 October 2026

Robert authorized technical review, repairs and integration of the 31 open website PRs into `beta`. Production `main` is unchanged. Staging uses https://beta.chapalaseminary.org and its existing separate D1 database. This is technical staging review; it does not replace faculty or French theological review.

## Starting evidence

- Website origin verified: `git@github.com:chapala-seminary/website.git`; reviewed main `2887884726c055e743b2fb6dd6f795af9a3895d4`.
- CTS brain origin verified: `git@github.com:chapala-seminary/brain.git`; reviewed main `bff6115f4104d46215f93db40f6914a5a8d64681`.
- Read workspace AGENTS.md; brain MEMORY.md, CLAUDE.md, USER.md, AGENTS.md, AGENT_RULES.md, GIT_WORKFLOW.md, SECURITY.md, website PROJECT.md/DECISIONS.md; website AGENTS.md. CTS is separate from COINCUBE and Website Machine; their policies/context were not loaded or claimed.
- Every original PR head below is preserved in the integration history. Many PRs are stacked; #64 already contains #35–36, #40–60. Review them as one dependency graph rather than duplicating changes.

## Repairs and deliberate staging boundaries

- Resolved #38–39 conflicts without dropping #64's multiple-choice support, single-page courses, per-reading draws, delayed requirements or completion exemptions. Retained revision-aware World Religions attempts and its separately validated next bank.
- Corrected the five Spanish readers’ declared source language and preserved all reader text across English, Spanish and French routes. Untranslated routes now identify the Spanish fallback accurately.
- Kept the existing World Religions exam bank unchanged. Its replacement stays `active: false`; Spanish readers are available for staging review.
- Removed the October 14 activation of all 79 new requirements: eight delivered banks explicitly remain faculty-review drafts, and the suite refuses their activation. Existing 11 requirements remain in force. Choose a fresh future activation date only after review and a production deployment plan.
- Repaired stale browser fixtures for the 15-course Th.M. diploma, absolute Counseling links, the separate Genesis reading notice and both saved retake timestamps. Added click-through MC textbook coverage (English/Spanish, chapter draws, resume, 17/20 failure, 18/20 pass) and checked that every one of the 1,440 MC questions has exactly one accepted clickable option.
- Isolated reading-requirement tests from the independent Broadus textbook schedule by setting Broadus inactive in that test's context. Production award logic is unchanged by this fixture repair.
- Compared all 466 unit DOMs with a fresh build of main after removing the reviewed test notices and generated question/completion payload: zero unexplained differences. Independent prose check preserves 26,110 blocks. Updated render snapshots for the added notices. Content baseline changed only in the three units corrected by #65.
- Repaired both French validator entry points to accept the list and dictionary packet formats and return a failing exit status for invalid packets. All 115 packets (114 course units and one WiseSpeak frame, across ten courses) pass structural/grading checks. This exceeds the six courses described in the stale #61 PR body.
- French draft files remain outside the content collections. Their source predates #65, so correct the affected draft questions/models and complete theological review before import.
- Added a push-to-beta workflow: install dependencies, build, run the full suite, then deploy with the pinned CTS account. Full Git history is fetched so baseline checks cannot quietly skip. Production has no push-to-main deployment workflow.
- `npm run deploy:beta` requires a clean checkout of `beta` at the exact published `origin/beta` commit. The workflow uses `CTS_BETA_CLOUDFLARE_API_TOKEN`; Robert is adding this secret. No credential belongs in this document or chat.
- Beta keeps outreach and weekly digest off, staging noindex protections, and its own database. Email-service domain onboarding is separate; no test email was sent during review.

## PR inventory (original heads)

| PR | Original head SHA | Staging review |
|---|---|---|
| [#35](https://github.com/chapala-seminary/website/pull/35) | `9766f826ba867794fbe22bd148b1e96ea81b6b3e` | Contained in #40 and #64; multi-test completion rules. |
| [#36](https://github.com/chapala-seminary/website/pull/36) | `e42dc56ce59b327d480de112bc2782b5f8209462` | Contained in #40 and #64; single-course completion fixes. |
| [#37](https://github.com/chapala-seminary/website/pull/37) | `11bde17364d47eb0d36df880d55d3fa2b1e6c808` | Title/link corrections also in #64; original history included with #39. |
| [#38](https://github.com/chapala-seminary/website/pull/38) | `d56e358a9a18a1df87ef59174dd55c76bf5ab250` | Resolved against newer per-reading and multiple-choice implementation; revised WR bank stays inactive. |
| [#39](https://github.com/chapala-seminary/website/pull/39) | `6df78444b290a15e2bbc77e39642eee160e8b05d` | Readers staged for review; exact assignment selections retained from #64. |
| [#40](https://github.com/chapala-seminary/website/pull/40) | `8a10a0b9d5ca0dd03c30ba1fc1cc51b4199352ad` | Combined #35/#36, included through #64. |
| [#41](https://github.com/chapala-seminary/website/pull/41) | `19f9a6523014b9299ebfd70c2235d934fd07c5c4` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#42](https://github.com/chapala-seminary/website/pull/42) | `3d45a074da8e564faf5bc64012a8aed971c8a69c` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#43](https://github.com/chapala-seminary/website/pull/43) | `8bfa8b9841bd1399435f23dad3d3b529daef65c5` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#44](https://github.com/chapala-seminary/website/pull/44) | `36981b716401f142ca66b26c953604853c430ff8` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#45](https://github.com/chapala-seminary/website/pull/45) | `99dfa59d434e4fcce9a9fad1614e16c1a349d65d` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#46](https://github.com/chapala-seminary/website/pull/46) | `17e79f9b8ca80c69fc3583c656ec7838168d9d2e` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#47](https://github.com/chapala-seminary/website/pull/47) | `0a54294984ee15a99c38f1f3a426a63aaacef4ab` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#48](https://github.com/chapala-seminary/website/pull/48) | `ebae1ea78aac74a1a3d98647c3fb79cafe034216` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#49](https://github.com/chapala-seminary/website/pull/49) | `992840e8d3a78b18b1c380186f6b287eb3f6f399` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#50](https://github.com/chapala-seminary/website/pull/50) | `c95a20d071e711582acb158ebb89ffaf8a6d4cd4` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#51](https://github.com/chapala-seminary/website/pull/51) | `6a0f738e742919d35c90310c82c4ad20723de42d` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#52](https://github.com/chapala-seminary/website/pull/52) | `1c210683572b5de58e0aa4957b2d0478e2c8e62d` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#53](https://github.com/chapala-seminary/website/pull/53) | `5ca6112e636e5f4b146044523713da2a99e02195` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#54](https://github.com/chapala-seminary/website/pull/54) | `d23c85be43a3dc18e6c0bdf6b564cc6d7b074b4b` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#55](https://github.com/chapala-seminary/website/pull/55) | `31c4d5b77adce387475be85db07af52fe967b8df` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#56](https://github.com/chapala-seminary/website/pull/56) | `243f909c2f2f963200ecc1c70f7c896d91fdb45e` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#57](https://github.com/chapala-seminary/website/pull/57) | `79fc5346e37e4b7f4f14fa2bcc3d3f9fe28b6769` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#58](https://github.com/chapala-seminary/website/pull/58) | `8bdccd8037ec682ba261e2b887e2ca4a94f2e6e5` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#59](https://github.com/chapala-seminary/website/pull/59) | `6394121c2d4f7ecab0b1cfad546ba11b030fc149` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#60](https://github.com/chapala-seminary/website/pull/60) | `187327d2cb1f7c16b737b9fbb7221be3bd9e8e83` | Contained in #64; textbook/readings content and integration reviewed with the stack. |
| [#61](https://github.com/chapala-seminary/website/pull/61) | `dded369d7cdf940a4f230193e07ddfa65719935f` | Unpublished _review/french drafts only; no import into live French lessons. |
| [#62](https://github.com/chapala-seminary/website/pull/62) | `ebc5ae119fcae0128be573208cb0bdb5440f8d90` | 15-course Th.M. rule staged; production remains on main. |
| [#63](https://github.com/chapala-seminary/website/pull/63) | `364bee680d1011c7e6377092110f2f2b12f26276` | Cloudflare-first email code checked against official API; Resend fallback retained; no email sent. |
| [#64](https://github.com/chapala-seminary/website/pull/64) | `903ac8909002d71ce9e147798272618b975a6be1` | Includes the textbook/reading stack and audit repairs; removed 79 unreviewed scheduled activations. |
| [#65](https://github.com/chapala-seminary/website/pull/65) | `ba33d7a591be0afc83964c2c646ba738826891b7` | Reviewed source corrections; baseline changes confined to CTSNT/5, CTSNT/10 and CTSEvangelism/2. |

## Validation and publication

The final `npm run build` and complete `PORT=8908 npm test` run passed on 12 October 2026 with exit status 0 and no browser skips. This includes 328,251 static language checks, 3,716 grading-policy assertions, 1,492 MC textbook assertions, 601 certificate unlock assertions, 113 PDF assertions, 115 degree-boundary assertions, 3,262 lesson/exam visibility assertions, all 5,772 desktop/mobile language renders, privacy deletion, 43 record-merge checks and seven guessing-throttle checks. Deployment evidence is recorded separately below once publication completes. Initial checks caught the scheduled-review conflict, a fixture dependency on the Broadus schedule, and stale content/render baselines; these were repaired before integration. Earlier sandboxed Worker startup failed because localhost sockets were blocked; the complete suite runs outside that restriction.

Email API reference checked: [Cloudflare Workers email API](https://developers.cloudflare.com/email-service/api/send-emails/workers-api/).

## Promoting beta later

Review the actual beta site with Wayne. Finish content approvals and activation decisions. Open a separate `beta` → `main` PR; rerun the build and complete test suite. Merge and production deployment require Robert's authorization. Do not treat a staging merge as academic approval or a production release.
