#!/bin/sh
# Downloads obsidian-mcp (MIT, github.com/lstpsche/obsidian-mcp): BM25 search over the brain for Codex.
# Verifies the official checksums. Output: vendor/obsidian-mcp/<arch>/obsidian-mcp (not committed).
set -e
VERSION=${OBSIDIAN_MCP_VERSION:-3.2.1}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
TMP=$(mktemp -d)
curl -sL -o "$TMP/checksums.sha256" "https://github.com/lstpsche/obsidian-mcp/releases/download/v$VERSION/checksums.sha256"
for ARCH in arm64 x64; do
  OUT="$ROOT/vendor/obsidian-mcp/$ARCH"
  [ -x "$OUT/obsidian-mcp" ] && { echo "obsidian-mcp $ARCH already there"; continue; }
  if [ "$ARCH" = arm64 ]; then T=aarch64; else T=x86_64; fi
  F="obsidian-mcp-$VERSION-$T-apple-darwin.tar.gz"
  curl -sL -o "$TMP/$F" "https://github.com/lstpsche/obsidian-mcp/releases/download/v$VERSION/$F"
  (cd "$TMP" && grep " $F\$" checksums.sha256 | shasum -a 256 -c - > /dev/null) || { echo "checksum mismatch for $F"; exit 1; }
  mkdir -p "$OUT" && tar -xzf "$TMP/$F" -C "$OUT" obsidian-mcp && chmod +x "$OUT/obsidian-mcp"
  echo "obsidian-mcp $ARCH ok"
done
rm -rf "$TMP"
