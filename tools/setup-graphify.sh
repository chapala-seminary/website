#!/usr/bin/env bash
# Install Graphify for Claude Code and build a code-only map of the CTS website.
# Run from a local checkout: bash tools/setup-graphify.sh
set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if ! command -v uv >/dev/null 2>&1; then
  echo 'Graphify needs uv. Install it from https://docs.astral.sh/uv/getting-started/installation/' >&2
  echo 'Then rerun: bash tools/setup-graphify.sh' >&2
  exit 2
fi

# The official PyPI package is graphifyy (two Ys), not similarly named packages.
echo 'Installing the official Graphify CLI in an isolated uv environment...'
uv tool install graphifyy
export PATH="$HOME/.local/bin:$PATH"

if ! command -v graphify >/dev/null 2>&1; then
  echo 'Graphify installed, but its command is not on PATH. Run: uv tool update-shell' >&2
  echo 'Open a fresh terminal, then rerun: bash tools/setup-graphify.sh' >&2
  exit 3
fi

echo 'Registering the Graphify skill with Claude Code (user-level only)...'
graphify claude install

# Avoid committing generated analysis or accidentally including it in searches.
GIT_EXCLUDE="$(git rev-parse --git-path info/exclude 2>/dev/null || true)"
if [ -n "$GIT_EXCLUDE" ]; then
  mkdir -p "$(dirname "$GIT_EXCLUDE")"
  touch "$GIT_EXCLUDE"
  if ! grep -Fxq '/graphify-out/' "$GIT_EXCLUDE"; then
    printf '\n# Locally generated Graphify code map\n/graphify-out/\n' >> "$GIT_EXCLUDE"
  fi
fi

# Explicitly disable every model/API backend. Do not send course data to AI services.
echo 'Creating a local code-only graph (no API calls, no Claude usage)...'
GRAPHIFY_BACKEND=none graphify extract . --code-only

if [ ! -s graphify-out/graph.json ]; then
  echo 'Graphify did not produce graphify-out/graph.json. Check the extract log.' >&2
  exit 4
fi

printf '\nGraphify setup complete on this computer.\n'
graphify --version
printf 'Local graph: %s/graphify-out/graph.json\n' "$ROOT"
printf 'Test: graphify query "how is student course progress calculated?"\n'
printf 'Refresh after code changes: GRAPHIFY_BACKEND=none graphify extract . --code-only\n'
