#!/usr/bin/env bash
# Portable wrapper. The Python runner owns localhost serving and reads the library only.
set -eu
LIB="${1:?give the unzipped canonical library folder}"
MODE="${2:-all}"
PORT="${3:-8771}"
HERE="$(cd "$(dirname "$0")" && pwd)"
if [ "$MODE" = quick ]; then
  exec python3 "$HERE/run_tests.py" --library "$LIB" --port "$PORT" --suite node --scripts remediation_browser.py assets_browser.py assets_all_models.py
fi
exec python3 "$HERE/run_tests.py" --library "$LIB" --port "$PORT" --suite all
