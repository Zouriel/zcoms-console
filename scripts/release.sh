#!/usr/bin/env bash
# Build the Angular UI into web/ (embedded via go:embed), then cross-compile
# zcoms-console. Pure-Go server (no cgo). Asset names match the installer's
# platformAsset() (amd64→x64). Outputs to dist/.
set -euo pipefail
cd "$(dirname "$0")/.."
BIN=zcoms-console; PKG=.

# Rebuild the embedded web UI. Requires node/npm; the committed web/ bundle is
# the fallback so a Go-only environment can still produce a working binary.
if command -v npx >/dev/null 2>&1; then
  echo "→ building web UI (Angular 22 + ui library)…"
  ( cd webapp && npm ci --no-audit --no-fund --silent && npx ng build )
else
  echo "⚠️  npx not found — embedding the committed web/ bundle as-is"
fi

mkdir -p dist
for t in linux/amd64/x64 windows/amd64/x64 darwin/arm64/arm64; do
  IFS=/ read -r os arch asset <<<"$t"
  out="dist/${BIN}-${os}-${asset}"
  [ "$os" = "windows" ] && out="${out}.exe"
  echo "→ $out"
  CGO_ENABLED=0 GOOS="$os" GOARCH="$arch" go build -trimpath -ldflags "-s -w" -o "$out" "$PKG"
done
echo "done. artifacts in dist/"
