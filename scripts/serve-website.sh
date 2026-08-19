#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8787}"

if command -v npm >/dev/null 2>&1; then
  (cd "${ROOT}" && npm run build:app)
fi

cd "${ROOT}/website"
echo "ach000: http://127.0.0.1:${PORT}"
echo "App:       http://127.0.0.1:${PORT}/app/"
exec python3 -m http.server "${PORT}" --bind 127.0.0.1
