#Requires -Version 5.1
<#
.SYNOPSIS
Checks rules, skills and MCP servers for each agent AIO-AGENT configured.
.DESCRIPTION
Wrapper around scripts/aio.mjs. Run with --help for options.
#>
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'lib/Require-Node.ps1')
& node (Join-Path $PSScriptRoot 'aio.mjs') doctor @args
exit $LASTEXITCODE
