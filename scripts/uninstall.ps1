#Requires -Version 5.1
<#
.SYNOPSIS
Removes AIO-AGENT and restores the files it backed up.
.DESCRIPTION
Wrapper around scripts/aio.mjs. Run with --help for options.
#>
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'lib/Require-Node.ps1')
& node (Join-Path $PSScriptRoot 'aio.mjs') uninstall @args
exit $LASTEXITCODE
