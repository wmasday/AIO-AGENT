# Dot-sourced by the scripts in scripts/. Exits unless Node.js 18 or newer is on PATH.
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    [Console]::Error.WriteLine('AIO-AGENT needs Node.js 18 or newer (20.19 or newer for the Chrome DevTools MCP server): https://nodejs.org')
    exit 1
}
$nodeMajor = [int](& node -p "process.versions.node.split('.')[0]")
if ($nodeMajor -lt 18) {
    [Console]::Error.WriteLine("AIO-AGENT needs Node.js 18 or newer; found $(& node --version).")
    exit 1
}
