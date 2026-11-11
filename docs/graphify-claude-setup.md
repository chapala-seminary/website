# Graphify for CTS Claude Code — safe local pilot

**Purpose:** Help Claude Code on the $20 Pro plan locate related source files without repeatedly reading the entire CTS repository. Graphify cannot expand Claude usage limits or guarantee savings. This is **not** a browser extension and is **not** a CTS production dependency.

Official project: <https://github.com/Graphify-Labs/graphify>. The official PyPI package is `graphifyy` (double y); the command is `graphify`. Do not install similarly named packages or subscribe to paid Graphify Cloud for this test.

## Where this must be installed

Run the commands **on the Mac or other actual computer where Claude Code uses the `chapala-seminary/website` checkout**. A GitHub PR cannot install a program on that computer. Do not install Graphify on the live website, student computers, or Cloudflare/Oracle merely to satisfy this checklist.

The original shell installer was withdrawn from this pilot after SonarQube reported a new-code security issue on PR #317; without the exact diagnostic, we will not dismiss the warning. These documented manual commands instead follow the official upstream setup.

## One-time manual setup

From the CTS website checkout on the Claude Code host, verify `uv` first:

```sh
uv --version
```

If `uv` is missing on a Mac using Homebrew: `brew install uv`. Otherwise follow <https://docs.astral.sh/uv/getting-started/installation/>. Verify the official upstream source and package version before installing third-party code.

```sh
uv tool install graphifyy
graphify --version
graphify claude install
```

If `graphify` is not on PATH, run `uv tool update-shell`, reopen the terminal, and retry. `graphify claude install` installs the Claude Code integration into the current **user profile**, not into the CTS website repository.

Exclude generated graphs locally; this changes only the checkout's Git metadata, not tracked files:

```sh
mkdir -p .git/info
printf '\n/graphify-out/\n' >> .git/info/exclude
```

Create a code-only graph, explicitly disabling **all LLM backends** and query logging:

```sh
GRAPHIFY_BACKEND=none GRAPHIFY_QUERY_LOG_DISABLE=1 graphify extract . --code-only
```

Check that `graphify-out/graph.json` exists and contains data. Do not use full documentation, PDF, images, media, `--deep` or paid semantic extraction in this pilot.

## Measure whether it actually helps CTS

Ask Claude Code to use `/graphify` or the local map before searching the entire tree, and try the read-only question:

```sh
GRAPHIFY_BACKEND=none GRAPHIFY_QUERY_LOG_DISABLE=1 graphify query "student course progress"
```

Check whether Graphify identifies `worker/awards.js` and `public/assets/js/cts-degrees.js`, then verify the actual code. Record whether this finds the correct files, and compare approximate token/tool usage against a normal investigation. The upstream marketing savings figure is not a CTS benchmark.

After code changes, refresh locally without LLM calls:

```sh
GRAPHIFY_BACKEND=none GRAPHIFY_QUERY_LOG_DISABLE=1 graphify extract . --code-only
```

## Privacy and rollback

**Never index or query private student records, D1 exports, production credentials, `.env` files, private assessment keys, or student emails.** Graphify code parsing runs locally, but document and media extraction can invoke models; keep this pilot code-only. `graphify query` logs question text by default, so use `GRAPHIFY_QUERY_LOG_DISABLE=1` with each invocation. Inspect the installed Claude skill before using it on sensitive work.

On the **same computer**:

```sh
graphify claude uninstall
uv tool uninstall graphifyy
```

Remove `graphify-out/` locally if desired. Uninstallation does not touch CTS student grades or live website.

## Release boundary

This documentation-only pilot may be reviewed for **beta**. No site runtime, grading, Cloudflare, Oracle, certificates, or student records should change. Do not promote beta to main solely for Graphify. If the security scan still fails, inspect the precise rule rather than bypass it with exclusions.
