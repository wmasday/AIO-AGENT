#!/usr/bin/env bash
# AIO-AGENT uninstall for macOS and Linux. Run with --help for options.
set -euo pipefail
dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
# shellcheck source=scripts/lib/require-node.sh
. "$dir/lib/require-node.sh"
exec node "$dir/aio.mjs" uninstall "$@"
