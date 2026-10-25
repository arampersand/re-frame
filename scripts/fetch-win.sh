#!/bin/sh
# Windows x64 helpers for the app, from official releases (not committed):
#   vendor/win/codex/          @openai/codex win32-x64 (bin/, codex-resources/ sandbox helpers, codex-path/rg.exe)
#   vendor/win/whisper/        whisper.cpp whisper-cli.exe + DLLs (ggml-org/whisper.cpp release)
#   vendor/win/obsidian-mcp/   obsidian-mcp.exe (lstpsche/obsidian-mcp release, checksum-verified)
set -e
CODEX=${CODEX_VERSION:-0.164.0}; WHISPER=${WHISPER_VERSION:-v1.8.2}; OMCP=${OBSIDIAN_MCP_VERSION:-3.2.1}
ROOT=$(cd "$(dirname "$0")/.." && pwd); OUT="$ROOT/vendor/win"; TMP=$(mktemp -d)
mkdir -p "$OUT"
if [ ! -f "$OUT/codex/bin/codex.exe" ]; then
  (cd "$TMP" && npm pack "@openai/codex@$CODEX-win32-x64" --silent > /dev/null && tar -xzf openai-codex-*.tgz)
  SRC="$TMP/package/vendor/x86_64-pc-windows-msvc"
  rm -rf "$SRC/codex-resources/voice"
  mkdir -p "$OUT/codex" && cp -R "$SRC/." "$OUT/codex/"
  echo "codex win ok"
fi
if [ ! -f "$OUT/whisper/whisper-cli.exe" ]; then
  curl -sL -o "$TMP/w.zip" "https://github.com/ggml-org/whisper.cpp/releases/download/$WHISPER/whisper-bin-x64.zip"
  mkdir -p "$OUT/whisper" && unzip -qj "$TMP/w.zip" 'Release/whisper-cli.exe' 'Release/whisper.dll' 'Release/ggml.dll' 'Release/ggml-base.dll' 'Release/ggml-cpu.dll' -d "$OUT/whisper"
  echo "whisper win ok"
fi
if [ ! -f "$OUT/obsidian-mcp/obsidian-mcp.exe" ]; then
  F="obsidian-mcp-$OMCP-x86_64-pc-windows-msvc.zip"
  curl -sL -o "$TMP/$F" "https://github.com/lstpsche/obsidian-mcp/releases/download/v$OMCP/$F"
  curl -sL -o "$TMP/checksums.sha256" "https://github.com/lstpsche/obsidian-mcp/releases/download/v$OMCP/checksums.sha256"
  (cd "$TMP" && grep " $F\$" checksums.sha256 | shasum -a 256 -c - > /dev/null) || { echo "checksum mismatch $F"; exit 1; }
  mkdir -p "$OUT/obsidian-mcp" && unzip -qj "$TMP/$F" obsidian-mcp.exe -d "$OUT/obsidian-mcp"
  echo "obsidian-mcp win ok"
fi
rm -rf "$TMP"
