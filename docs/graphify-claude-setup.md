# Graphify for Claude Code — CTS development (pilot)

**Purpose:** Make routine source-code exploration less costly on the $20 Claude Pro plan by building a local, reusable dependency map. This is an **optional developer tool**, not a change to courses, examinations, databases, or production deployments. It cannot raise Claude subscription limits, and savings must be measured rather than assumed.

Official source: <https://github.com/Graphify-Labs/graphify>. The published Python package is `graphifyy`, whereas the command is `graphify`. Do not install unrelated similarly named packages or sign up for paid Graphify Cloud to try this.

## One-time install (on the actual computer where Claude Code runs)

From the `chapala-seminary/website` checkout:

```sh
bash tools/setup-graphify.sh
```

Requirements: `uv` installed, connectivity to download the official package, and a Claude Code installation. If `uv` is absent, follow <https://docs.astral.sh/uv/getting-started/installation/> and rerun. This script installs the isolated CLI to the **current user**, registers the Graphify skill in Claude Code, and builds a **code-only, local graph** using `GRAPHIFY_BACKEND=none`. It does not need or use an Anthropic/OpenRouter API key. It installs nothing on the CTS public website, Cloudflare, or Oracle unless run there explicitly.

It should produce `graphify-out/graph.json`, with optional `GRAPH_REPORT.md` and `graph.html`. Graphify honors the repository `.gitignore`: private D1 exports, local secrets, and ignored answer banks must remain excluded. The script adds `/graphify-out/` to the checkout's `.git/info/exclude` (local only); never commit generated graph files or data exports to GitHub. Do not run the full documentation/media semantic pass without checking privacy and model costs.

## Test with Claude

Open Claude Code in this checkout and ask it first to use `graphify query` to locate relevant parts of the code instead of reading every source file. A useful test is:

```sh
graphify --version
GRAPHIFY_BACKEND=none graphify query "how is student course progress calculated?"
```

If the graph is stale after changes:

```sh
GRAPHIFY_BACKEND=none graphify extract . --code-only
```

Compare one actual CTS bug investigation with and without Graphify. Record whether Claude found the right files and approximately how many messages/tokens were used. Graphify's marketing claims do **not** establish CTS-specific savings.

## Safety and rollback

Graphify's Claude integration adds local instructions/hooks; it must not be installed on a production web server. The installer intentionally makes **no Git commits**, changes **no website source**, and does **not** add a Git post-commit hook or always-on scanning. Changes in source control should use the usual beta PR and test procedure. To remove the integration on the computer where it was installed:

```sh
graphify claude uninstall
uv tool uninstall graphifyy
```

Remove `graphify-out/` separately if you no longer need the generated graph. The Graphify package may maintain query logs under the user's cache directory; do not include student personally identifiable information in graph queries.
