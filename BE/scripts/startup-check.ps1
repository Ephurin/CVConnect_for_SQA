$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$beRoot = Resolve-Path (Join-Path $scriptRoot "..")
$repoRoot = Resolve-Path (Join-Path $beRoot "..")
$feRoot = Join-Path $repoRoot "FE/company"

$script:results = @()

function Add-Result {
    param(
        [string]$Name,
        [bool]$Passed,
        [string]$Details,
        [bool]$Required = $true
    )

    $script:results += [pscustomobject]@{
        Name = $Name
        Status = if ($Passed) { "PASS" } else { if ($Required) { "FAIL" } else { "WARN" } }
        Required = $Required
        Details = $Details
    }
}

function Test-Cmd {
    param([string]$CommandName)

    return $null -ne (Get-Command $CommandName -ErrorAction SilentlyContinue)
}

Write-Host "CVConnect startup checklist" -ForegroundColor Cyan
Write-Host "Repo: $repoRoot"

# Tooling checks
Add-Result -Name "Git installed" -Passed (Test-Cmd git) -Details "Required for submodules"
Add-Result -Name "Docker installed" -Passed (Test-Cmd docker) -Details "Required for infra and dockerized services"
Add-Result -Name "Node installed" -Passed (Test-Cmd node) -Details "Required for FE"
Add-Result -Name "NPM installed" -Passed (Test-Cmd npm) -Details "Required for FE package scripts"
Add-Result -Name "Java installed" -Passed (Test-Cmd java) -Details "Required for local BE runs"
Add-Result -Name "Maven installed" -Passed (Test-Cmd mvn) -Details "Required for local BE runs"

# Docker daemon check
$dockerReady = $false
if (Test-Cmd docker) {
    try {
        docker info | Out-Null
        $dockerReady = $true
    }
    catch {
        $dockerReady = $false
    }
}
Add-Result -Name "Docker daemon running" -Passed $dockerReady -Details "Start Docker Desktop if this fails"

# Required files and folders
$envPath = Join-Path $beRoot "cvconnect.env"
Add-Result -Name "BE cvconnect.env present" -Passed (Test-Path $envPath) -Details $envPath
Add-Result -Name "BE docker-compose.yml present" -Passed (Test-Path (Join-Path $beRoot "docker-compose.yml")) -Details "Infra compose"
Add-Result -Name "BE docker-compose.app.yml present" -Passed (Test-Path (Join-Path $beRoot "docker-compose.app.yml")) -Details "App compose"

$commonLibGit = Join-Path $beRoot "common-lib/.git"
Add-Result -Name "common-lib submodule initialized" -Passed (Test-Path $commonLibGit) -Details "Run: git submodule update --init BE/common-lib"

# FE local backend settings
$nuxtConfigPath = Join-Path $feRoot "nuxt.config.ts"
$socketPath = Join-Path $feRoot "app/const/socket.ts"
$loginPath = Join-Path $feRoot "app/pages/auth/login.vue"

$nuxtLocal = $false
$socketLocal = $false
$googleLocal = $false

if (Test-Path $nuxtConfigPath) {
    $nuxtText = Get-Content $nuxtConfigPath -Raw
    $nuxtLocal = $nuxtText -match 'target:\s*"http://localhost:8888"'
}
if (Test-Path $socketPath) {
    $socketText = Get-Content $socketPath -Raw
    $socketLocal = $socketText -match 'SOCKET_ENDPOINT\s*=\s*"http://localhost:8888"'
}
if (Test-Path $loginPath) {
    $loginText = Get-Content $loginPath -Raw
    $googleLocal = $loginText -match 'window\.open\("/_api/user/oauth2/authorization/google"\)'
}

Add-Result -Name "FE proxy points to localhost" -Passed $nuxtLocal -Details $nuxtConfigPath
Add-Result -Name "FE socket points to localhost" -Passed $socketLocal -Details $socketPath
Add-Result -Name "FE Google OAuth uses local proxy" -Passed $googleLocal -Details $loginPath -Required $false

# Output
$script:results | Format-Table -AutoSize

$fails = @($script:results | Where-Object { $_.Status -eq "FAIL" })

if ($fails.Count -gt 0) {
    Write-Host "Checklist finished with blocking failures: $($fails.Count)" -ForegroundColor Red
    exit 1
}

Write-Host "Checklist passed. Startup prerequisites look good." -ForegroundColor Green
exit 0
