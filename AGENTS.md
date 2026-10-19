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

Wayne, 18 Oct 2026: Claude and ChatGPT own implementation, independent peer
review, fixes and beta testing; Wayne keeps curriculum decisions and every
approval; Robert is an occasional resource for an essential access problem or
an issue the assistants cannot resolve, not a standing required approver.

New work goes through a PR to `beta`, opened from the separate
`chapalatheological-ai` account. Claude and ChatGPT each record their review as
a PR comment naming the exact head commit and a verdict (format in
`.github/pull_request_template.md`); the release check reads those comments,
and a new push makes them stale. `tools/release-policy.mjs` classifies every file:

- **Content** (lesson and exam text, readings, translation tables, and page
  wording or plain markup where every script, style and control stays the
  same): both review records, then Wayne approves the exact commit in GitHub;
  the AI account may then merge to beta after the required checks pass.
- **Technical or mixed** (engine, Worker, database, registration, grading,
  certificates, verification, email, deployment, review policy, unknown paths,
  JSON wiring, new files): Claude and ChatGPT each record a technical-scope
  review of the exact commit, then Wayne approves it in GitHub. Robert's
  approval is accepted in place of the technical AI reviews but is not
  required.

An AI review record is a PR comment. It never counts as a GitHub approval, and
one assistant must never post a record for the other or present itself as a
human reviewer. Robert's `satoshisound` account keeps its named PR-review
bypass for his own same-repository PRs to beta; every PR to main, his too,
needs the production checks and Wayne's approval. The assistants do not use
the bypass.

The AI opens `beta` -> `main` after the exact beta commit has passed deployment
and live verification. Wayne checks beta, approves, then merges using his human
`ChapalaTheological1` account; nothing reaches production without that.
After the initial baseline/token setup, main deploys automatically through
Actions using the production environment secret. Never use Wayne's
administrator login for an agent; his one-time authorization for interim pushes
(18 Oct) ends once `chapalatheological-ai` has Write access. Read
`docs/beta-staging.md` for safeguards, setup and the initial rollout boundary.
A staging merge does not replace faculty or translation review.

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
