$ErrorActionPreference = 'Stop'
$ScriptDir = Split-Path $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

$BuildDir  = Join-Path $ScriptDir 'build'
$BundleDir = Join-Path $BuildDir  'bundle'
$OutputDir = Join-Path $BuildDir  'outputs'
$PluginName = 'SupernoteDailyNote'

Write-Host '=== Supernote Daily Note — Build ==='

Write-Host '[1/4] Installing dependencies...'
npm install

Write-Host '[2/4] Bundling JS...'
New-Item -ItemType Directory -Force -Path (Join-Path $BundleDir 'assets') | Out-Null
npx react-native bundle `
  --platform android `
  --dev false `
  --entry-file index.js `
  --bundle-output (Join-Path $BundleDir 'index.android.bundle') `
  --assets-dest (Join-Path $BundleDir 'assets')

Write-Host '[3/4] Copying plugin config...'
Copy-Item PluginConfig.json -Destination $BundleDir -Force

Write-Host '[4/4] Packaging .snplg...'
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
$archive = Join-Path $OutputDir "$PluginName.snplg"
Compress-Archive -Path (Join-Path $BundleDir '*') -DestinationPath $archive -Force

Write-Host ''
Write-Host "Done: $archive"
Write-Host ''
Write-Host 'Install: copy the .snplg file to the MyStyle/ folder on your Supernote,'
Write-Host 'then open Settings → Apps → Plugins to enable it.'
