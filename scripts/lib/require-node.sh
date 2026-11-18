# shellcheck shell=bash
# Sourced by the scripts in scripts/. Exits unless Node.js 18 or newer is on PATH.
if ! command -v node >/dev/null 2>&1; then
	echo "AIO-AGENT needs Node.js 18 or newer (20.19 or newer for the Chrome DevTools MCP server): https://nodejs.org" >&2
	exit 1
fi
node_major=$(node -p "process.versions.node.split('.')[0]")
if [ "$node_major" -lt 18 ]; then
	echo "AIO-AGENT needs Node.js 18 or newer; found $(node --version)." >&2
	exit 1
fi
