#!/usr/bin/env bash
# Cross-compile zcoms-console (pure-Go, embedded frontend) for release → dist/.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p dist
for t in linux/amd64 windows/amd64 darwin/arm64; do
  os="${t%/*}"; arch="${t#*/}"; out="dist/zcoms-console-${os}-${arch}"
  [ "$os" = "windows" ] && out="${out}.exe"
  echo "→ $out"
  CGO_ENABLED=0 GOOS="$os" GOARCH="$arch" go build -trimpath -ldflags "-s -w" -o "$out" .
done
