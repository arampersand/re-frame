#!/bin/sh
# Builds static whisper-cli (whisper.cpp) for both Mac archs into vendor/whisper/<arch>/.
# Needs: git, cmake (brew install cmake), Xcode command line tools. Skips archs already built.
set -e
VERSION=${WHISPER_VERSION:-v1.8.2}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
SRC=${TMPDIR:-/tmp}/whisper.cpp-$VERSION
[ -d "$SRC" ] || git clone -q --depth 1 --branch "$VERSION" https://github.com/ggml-org/whisper.cpp.git "$SRC"
for ARCH in arm64 x64; do
  OUT="$ROOT/vendor/whisper/$ARCH"
  [ -x "$OUT/whisper-cli" ] && { echo "whisper $ARCH already there"; continue; }
  if [ "$ARCH" = arm64 ]; then OSX=arm64; METAL=ON; else OSX=x86_64; METAL=OFF; fi
  cmake -S "$SRC" -B "$SRC/build-$ARCH" -DCMAKE_BUILD_TYPE=Release -DBUILD_SHARED_LIBS=OFF \
    -DCMAKE_OSX_ARCHITECTURES=$OSX -DCMAKE_OSX_DEPLOYMENT_TARGET=13.3 -DGGML_METAL=$METAL \
    -DGGML_METAL_EMBED_LIBRARY=ON -DGGML_NATIVE=OFF -DWHISPER_BUILD_TESTS=OFF -DWHISPER_BUILD_SERVER=OFF > /dev/null
  cmake --build "$SRC/build-$ARCH" -j 8 --target whisper-cli > /dev/null 2>&1
  mkdir -p "$OUT" && cp "$SRC/build-$ARCH/bin/whisper-cli" "$OUT/whisper-cli"
  echo "whisper $ARCH built"
done
