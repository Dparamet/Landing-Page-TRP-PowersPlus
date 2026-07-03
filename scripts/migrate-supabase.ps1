<#
.SYNOPSIS
  Backup / migrate the TRP Powers Plus Supabase database (public schema) to a
  .sql file, and optionally restore it into another Supabase project.

.DESCRIPTION
  Dumps only the `public` schema (the app data) with pg_dump. Supabase-managed
  schemas (auth, storage, ...) are never touched. By default the DATA of
  `admin_profiles` is excluded, because its user_id references auth.users(id)
  which does not exist in a fresh target project (see docs/DB_MIGRATION.md).

  Requires the PostgreSQL client tools `pg_dump` and `psql` on PATH.

.PARAMETER SourceUrl
  Postgres connection URI of the SOURCE project (Supabase > Settings > Database
  > Connection string > URI, Session pooler, port 5432).

.PARAMETER TargetUrl
  Optional. Connection URI of the TARGET project. If given, the dump is restored
  into it after dumping.

.PARAMETER Mode
  'full' (default) = schema + data in one file (run-and-get-everything).
  'data'           = data only; run the migrations on the target FIRST, then this.

.PARAMETER IncludeAdminProfiles
  Include admin_profiles rows in the dump. Only safe if the target already has
  the matching auth.users. Off by default.

.PARAMETER OutFile
  Output .sql path. Defaults to backups/trp_<timestamp>.sql

.PARAMETER SelfTest
  Run the built-in assertions for the argument builder and exit. No DB access.

.EXAMPLE
  # Backup only
  ./scripts/migrate-supabase.ps1 -SourceUrl "postgresql://...old..."

.EXAMPLE
  # Backup + restore into a new project
  ./scripts/migrate-supabase.ps1 -SourceUrl "postgresql://...old..." -TargetUrl "postgresql://...new..."

.EXAMPLE
  # Data-only (target already migrated via supabase/migrations)
  ./scripts/migrate-supabase.ps1 -SourceUrl "postgresql://...old..." -TargetUrl "postgresql://...new..." -Mode data
#>
[CmdletBinding()]
param(
  [string]$SourceUrl,
  [string]$TargetUrl,
  [ValidateSet('full', 'data')][string]$Mode = 'full',
  [switch]$IncludeAdminProfiles,
  [string]$OutFile,
  [switch]$SelfTest
)

$ErrorActionPreference = 'Stop'

# --- Pure logic: build the pg_dump argument list (this is what SelfTest covers) ---
function Build-DumpArgs {
  param(
    [Parameter(Mandatory)][string]$SourceUrl,
    [Parameter(Mandatory)][ValidateSet('full', 'data')][string]$Mode,
    [bool]$IncludeAdminProfiles,
    [Parameter(Mandatory)][string]$OutFile
  )

  $dumpArgs = @('--schema=public', '--no-owner')
  if ($Mode -eq 'data') { $dumpArgs += '--data-only' }
  if (-not $IncludeAdminProfiles) { $dumpArgs += '--exclude-table-data=public.admin_profiles' }
  $dumpArgs += @('--file', $OutFile, $SourceUrl)
  return $dumpArgs
}

# --- Self-test: assert-based, no framework, no DB ---
function Invoke-SelfTest {
  $script:selfTestFailures = 0
  function Assert($cond, $name) {
    if ($cond) { Write-Host "  ok   $name" -ForegroundColor Green }
    else { Write-Host "  FAIL $name" -ForegroundColor Red; $script:selfTestFailures++ }
  }

  Write-Host 'Build-DumpArgs self-test'

  $full = Build-DumpArgs -SourceUrl 'src' -Mode 'full' -IncludeAdminProfiles:$false -OutFile 'o.sql'
  Assert ($full -contains '--schema=public') 'full: dumps only public schema'
  Assert ($full -notcontains '--data-only') 'full: is not data-only'
  Assert ($full -contains '--exclude-table-data=public.admin_profiles') 'full: excludes admin_profiles data by default'
  Assert ($full -contains 'src') 'full: passes source url'
  Assert ($full -contains 'o.sql') 'full: passes out file'

  $data = Build-DumpArgs -SourceUrl 'src' -Mode 'data' -IncludeAdminProfiles:$false -OutFile 'o.sql'
  Assert ($data -contains '--data-only') 'data: is data-only'

  $incl = Build-DumpArgs -SourceUrl 'src' -Mode 'full' -IncludeAdminProfiles:$true -OutFile 'o.sql'
  Assert ($incl -notcontains '--exclude-table-data=public.admin_profiles') 'include flag: keeps admin_profiles data'

  if ($script:selfTestFailures -gt 0) { Write-Host "$script:selfTestFailures assertion(s) failed" -ForegroundColor Red; exit 1 }
  Write-Host 'All assertions passed' -ForegroundColor Green
}

if ($SelfTest) { Invoke-SelfTest; return }

# --- Main flow ---
if (-not $SourceUrl) { throw 'SourceUrl is required (or use -SelfTest).' }

foreach ($tool in 'pg_dump', 'psql') {
  if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
    throw "$tool not found on PATH. Install PostgreSQL client tools or the Supabase CLI."
  }
}

if (-not $OutFile) {
  $backupDir = Join-Path $PSScriptRoot '..\backups'
  New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
  $OutFile = Join-Path $backupDir ("trp_{0}.sql" -f (Get-Date -Format 'yyyyMMdd_HHmmss'))
}

$dumpArgs = Build-DumpArgs -SourceUrl $SourceUrl -Mode $Mode -IncludeAdminProfiles:$IncludeAdminProfiles.IsPresent -OutFile $OutFile

Write-Host "Dumping ($Mode) public schema -> $OutFile" -ForegroundColor Cyan
& pg_dump @dumpArgs
if ($LASTEXITCODE -ne 0) { throw "pg_dump failed (exit $LASTEXITCODE)" }
$sizeKb = [math]::Round((Get-Item $OutFile).Length / 1KB, 1)
Write-Host "Dump complete: $OutFile ($sizeKb KB)" -ForegroundColor Green

if ($TargetUrl) {
  Write-Host 'Restoring into TARGET project...' -ForegroundColor Cyan
  & psql $TargetUrl -v ON_ERROR_STOP=1 -f $OutFile
  if ($LASTEXITCODE -ne 0) { throw "psql restore failed (exit $LASTEXITCODE)" }
  Write-Host 'Restore complete.' -ForegroundColor Green
  if (-not $IncludeAdminProfiles) {
    Write-Host "`nNEXT: create an admin user in the target project's Authentication, then run:" -ForegroundColor Yellow
    Write-Host "  insert into public.admin_profiles (user_id, role) values ('<new-user-uid>', 'owner');" -ForegroundColor Yellow
  }
} else {
  Write-Host "`nBackup only. To restore: ./scripts/migrate-supabase.ps1 -SourceUrl <src> -TargetUrl <dst>" -ForegroundColor DarkGray
}
