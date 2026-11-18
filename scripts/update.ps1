#Requires -Version 5.1
<#
.SYNOPSIS
Updates this AIO-AGENT checkout to the latest main and reinstalls.
#>
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
& git -C $repo rev-parse --git-dir *> $null
if ($LASTEXITCODE -ne 0) {
    [Console]::Error.WriteLine("$repo is not a git checkout; download the new release and run scripts/install.ps1 from it.")
    exit 1
}
& git -C $repo pull --ff-only
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& (Join-Path $PSScriptRoot 'install.ps1') @args
exit $LASTEXITCODE
