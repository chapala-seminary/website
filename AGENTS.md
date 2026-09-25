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
