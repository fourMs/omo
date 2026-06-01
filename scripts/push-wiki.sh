#!/usr/bin/env bash
# Sync docs/wiki/*.md to https://github.com/fourMs/omo/wiki
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WIKI_SRC="$ROOT/docs/wiki"
REPO="${OMO_WIKI_REPO:-fourMs/omo}"
TMP="${TMPDIR:-/tmp}/omo-wiki-$$"

node "$ROOT/scripts/generate-wiki.mjs"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI required. Install: https://cli.github.com/" >&2
  exit 1
fi

rm -rf "$TMP"
git clone "https://github.com/${REPO}.wiki.git" "$TMP"
cp "$WIKI_SRC"/*.md "$TMP/"
cd "$TMP"
git add -A
if git diff --staged --quiet; then
  echo "Wiki already up to date."
  exit 0
fi
git commit -m "Sync wiki from docs/wiki ($(date -u +%Y-%m-%d))"
git push origin HEAD
echo "Pushed: https://github.com/${REPO}/wiki"
