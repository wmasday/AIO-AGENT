#Requires -Version 5.1
<#
.SYNOPSIS
Installs AIO-AGENT for the coding agents found on this machine.
.DESCRIPTION
Wrapper around scripts/aio.mjs. Run with --help for options.
#>
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'lib/Require-Node.ps1')
& node (Join-Path $PSScriptRoot 'aio.mjs') install @args
exit $LASTEXITCODE
