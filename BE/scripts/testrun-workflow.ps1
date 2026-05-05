param(
    [switch]$StartInfra,
    [string]$GatewayBase = "http://127.0.0.1:8888/api/v1",
    [string]$Username = "",
    [string]$Password = "",
    [int]$TimeoutSec = 8
)

$ErrorActionPreference = "Stop"

try {
  Add-Type -AssemblyName System.Net.Http -ErrorAction Stop
}
catch {
  # Assembly is already available in newer PowerShell runtimes.
}

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

function Test-PortListening {
    param([int]$Port)

    $rows = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -eq $Port }
    return ($rows | Measure-Object).Count -gt 0
}

function Test-HttpEndpoint {
  param(
    [string]$Url,
    [int]$TimeoutSec
  )

  $handler = New-Object System.Net.Http.HttpClientHandler
  $handler.AllowAutoRedirect = $true
  $client = [System.Net.Http.HttpClient]::new($handler)
  $client.Timeout = [TimeSpan]::FromSeconds($TimeoutSec)

  try {
    $response = $client.GetAsync($Url).GetAwaiter().GetResult()
    return [pscustomobject]@{
      ok = $true
      status = [int]$response.StatusCode
      error = $null
    }
  }
  catch {
    return [pscustomobject]@{
      ok = $false
      status = $null
      error = $_.Exception.Message
    }
  }
  finally {
    $client.Dispose()
    $handler.Dispose()
  }
}

function Invoke-NodeJson {
    param(
        [string]$Script,
        [string[]]$Args = @()
    )

  $tmpFile = Join-Path $env:TEMP ("cvconnect-testrun-" + [guid]::NewGuid().ToString() + ".mjs")
  Set-Content -Path $tmpFile -Value $Script -Encoding UTF8

  $oldHttpProxy = $env:HTTP_PROXY
  $oldHttpsProxy = $env:HTTPS_PROXY
  $oldNoProxy = $env:NO_PROXY

  try {
    $env:HTTP_PROXY = ""
    $env:HTTPS_PROXY = ""
    $env:NO_PROXY = "localhost,127.0.0.1,::1"

    $raw = & node $tmpFile @Args
    if ($LASTEXITCODE -ne 0) {
      throw "Node script failed: $raw"
    }

    return ($raw -join "`n" | ConvertFrom-Json)
  }
  finally {
    $env:HTTP_PROXY = $oldHttpProxy
    $env:HTTPS_PROXY = $oldHttpsProxy
    $env:NO_PROXY = $oldNoProxy
    Remove-Item -Path $tmpFile -Force -ErrorAction SilentlyContinue
  }
}

Write-Host "CVConnect workflow testrun" -ForegroundColor Cyan
Write-Host "Repo: $repoRoot"

# 1) Tooling and files
Add-Result -Name "Docker installed" -Passed (Test-Cmd docker) -Details "Required for infra"
Add-Result -Name "Node installed" -Passed (Test-Cmd node) -Details "Required for HTTP probes"
Add-Result -Name "docker-compose.yml exists" -Passed (Test-Path (Join-Path $beRoot "docker-compose.yml")) -Details "BE infra compose"
Add-Result -Name "FE folder exists" -Passed (Test-Path $feRoot) -Details $feRoot

if ($StartInfra) {
    Write-Host "Starting infra containers..." -ForegroundColor Yellow
    Push-Location $beRoot
    try {
        & docker-compose -f (Join-Path $beRoot "docker-compose.yml") up -d | Out-Null
    }
    finally {
        Pop-Location
    }
}

# 2) Infra checks
$infraPorts = @(3306, 5432, 6379, 9094, 27018)
foreach ($p in $infraPorts) {
    Add-Result -Name "Infra port $p listening" -Passed (Test-PortListening -Port $p) -Details "127.0.0.1:$p"
}

# 3) Service port checks
$servicePorts = @(3000, 3001, 8180, 8181, 8182, 8888)
foreach ($p in $servicePorts) {
    Add-Result -Name "Service port $p listening" -Passed (Test-PortListening -Port $p) -Details "127.0.0.1:$p" -Required $false
}

# 4) HTTP probes via PowerShell HttpClient
$probeUrls = @(
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:8888/swagger-ui/index.html',
    'http://127.0.0.1:8180/user/swagger-ui/index.html',
    'http://127.0.0.1:8181/notify/swagger-ui/index.html',
    'http://127.0.0.1:8182/core/swagger-ui/index.html'
)

foreach ($url in $probeUrls) {
    $probe = Test-HttpEndpoint -Url $url -TimeoutSec $TimeoutSec
    if ($probe.ok) {
        Add-Result -Name "HTTP $url" -Passed $true -Details "status=$($probe.status)" -Required $false
    } else {
        Add-Result -Name "HTTP $url" -Passed $false -Details "error=$($probe.error)" -Required $false
    }
}

# 5) Auth + menu workflow probe (real app workflow)
if ($Username -and $Password) {
    $authScript = @'
(async () => {
  const base = process.argv[1];
  const username = process.argv[2];
  const password = process.argv[3];
  const timeoutMs = Number(process.argv[4]) * 1000;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const loginRes = await fetch(base + '/user/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      signal: controller.signal
    });

    const loginText = await loginRes.text();
    let token = '';
    try { token = JSON.parse(loginText)?.data?.token || ""; } catch (_) {}

    if (!token) {
      console.log(JSON.stringify({ ok: false, step: "login", status: loginRes.status, body: loginText.slice(0, 300) }));
      return;
    }

    const menuRes = await fetch(base + '/user/menu/menu-by-role/2', {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token },
      signal: controller.signal
    });

    const menuText = await menuRes.text();
    console.log(JSON.stringify({ ok: menuRes.status === 200, step: "menu", status: menuRes.status, body: menuText.slice(0, 300) }));
  } catch (e) {
    console.log(JSON.stringify({ ok: false, step: "request", error: e?.message || String(e) }));
  } finally {
    clearTimeout(t);
  }
})();
'@

    $auth = Invoke-NodeJson -Script $authScript -Args @($GatewayBase, $Username, $Password, "$TimeoutSec")

    if ($auth.ok) {
        Add-Result -Name "Workflow login -> menu-by-role" -Passed $true -Details "status=$($auth.status)"
    } else {
      $errBody = if ($auth.error) { $auth.error } else { $auth.body }
      Add-Result -Name "Workflow login -> menu-by-role" -Passed $false -Details ("step=" + $auth.step + "; status=" + $auth.status + "; error/body=" + $errBody)
    }
} else {
    Add-Result -Name "Workflow login -> menu-by-role" -Passed $false -Details "Skipped: pass -Username and -Password to run end-to-end auth workflow" -Required $false
}

# 6) Summary
$script:results | Format-Table -AutoSize

$warns = @($script:results | Where-Object { $_.Status -eq "WARN" })
$fails = @($script:results | Where-Object { $_.Status -eq "FAIL" })

if ($warns.Count -gt 0) {
  Write-Host "Warnings:" -ForegroundColor Yellow
  foreach ($w in $warns) {
    Write-Host ("- " + $w.Name + " => " + $w.Details) -ForegroundColor Yellow
  }
}

if ($fails.Count -gt 0) {
  Write-Host "Failures:" -ForegroundColor Red
  foreach ($f in $fails) {
    Write-Host ("- " + $f.Name + " => " + $f.Details) -ForegroundColor Red
  }
}
if ($fails.Count -gt 0) {
    Write-Host "Workflow testrun finished with failures: $($fails.Count)" -ForegroundColor Red
    exit 1
}

Write-Host "Workflow testrun finished: no blocking failures." -ForegroundColor Green
exit 0
