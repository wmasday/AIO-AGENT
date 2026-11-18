#!/usr/bin/env bash
# Update this AIO-AGENT checkout to the latest main and reinstall.
set -euo pipefail
dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
repo=$(dirname -- "$dir")
if ! git -C "$repo" rev-parse --git-dir >/dev/null 2>&1; then
	echo "$repo is not a git checkout; download the new release and run scripts/install.sh from it." >&2
	exit 1
fi
git -C "$repo" pull --ff-only
exec "$dir/install.sh" "$@"
