# AGENTS.md — chapalaseminary.org

This repo is the website of **Chapala Theological Seminary (CTS)**, a free,
bilingual (EN/ES) online seminary. Project memory — status, decisions, open
questions, glossary — lives in the **brain**, a sibling repo:
`../brain` (`github.com/chapala-seminary/brain`).

## Before you start

1. Read `../brain/MEMORY.md`, then `../brain/projects/website/PROJECT.md`.
2. Unfamiliar term? `../brain/projects/website/GLOSSARY.md`.
3. Touching a past decision? Check `../brain/projects/website/DECISIONS.md`
   first; don't silently reverse one.

If `../brain` is missing, clone it next to this repo:
`git clone git@github.com:chapala-seminary/brain.git ../brain`.

## When you finish

If your work changed the project's status, a decision, an open question or a
risk, update the brain **on a branch** (`project/website-memory-update`), run
`./scripts/validate-memory.sh` there, and say so in your summary. Never commit
to the brain's `main`. The rules are in `../brain/AGENT_RULES.md`.

## Staging and release

Agents using `chapalatheological-ai` may push code and content directly to
`beta`, or merge beta PRs, without human review or dual-AI agreement evidence.
Start from current beta and keep changes focused. The beta Action builds,
tests, deploys and verifies the release; a failed build/test blocks publication.
Test the published beta site before promoting.

The agent opens `beta` -> `main` after the exact beta commit's deployment and
live verification pass. Wayne approves that commit and merges using his human
`ChapalaTheological1` account. Robert's approval is not required. A new beta
commit needs fresh testing and Wayne approval. The AI cannot push or merge main.
Robert's `satoshisound` account may approve any PR at its current commit,
regardless of author or source branch. His own PRs need no second reviewer;
GitHub cannot formally self-approve. Build/test checks still apply.
Keep human and AI accounts separate. Main deployment uses Actions once its
existing production baseline/token/enablement setup is complete. Read
`docs/beta-staging.md` and `docs/content-release-workflow.md`.

## Rules for this repo

- **Commit only your own files.** Several sessions work in this tree at once;
  check `git status` and leave other people's changes alone.
- **Two Cloudflare accounts are reachable from this machine.** Only deploy with
  `npm run deploy` / `npm run deploy:beta` — they refuse to run against the
  wrong account. Never run bare `wrangler` commands without the pinned account.
- **Never put student data anywhere in git** — names, emails, student codes, D1
  exports, short-answer text.
- **Don't break URLs.** Every page keeps its `.html` name; `tools/verify-cutover.mjs` guards this.
- **Don't lose student progress.** `localStorage` keys are a contract.
- Before committing: `npm run build && test/run-tests.sh`. Build on the Mac —
  `node_modules` are macOS binaries.
- Plain language: define a term or don't use it.

## Cursor Cloud specific instructions

GitHub Actions and Cloud Agents use Node 24 (pinned in the environment install
at 24.22.0). The VM image also has Node 22, and that binary is earlier on
`PATH` than `/usr/local/bin`. The install therefore uses nvm and links `node`,
`npm`, `npx`, and `corepack` from `/usr/local/cargo/bin`, which is already
ahead of the image Node. `node -v` should print `v24.22.0`.

- `npm ci`, then `npx playwright install --with-deps chromium`. The suite
  launches Playwright's Chromium.
- The dev server started on boot is `npm run dev -- --host 0.0.0.0 --port 4321`.
- The site students use is the built Worker and a local D1 database, not the
  Astro dev server. `npm run build`, apply `migrations/*.sql` with
  `npx wrangler d1 execute` against `test/wrangler.local.jsonc`, then
  `npx wrangler dev --config test/wrangler.local.jsonc`. `npm test` does this
  on port 8798 and deletes `.wrangler-local` at the start.
- Do not run `npm run deploy` or `npm run deploy:beta` from a Cloud Agent.
