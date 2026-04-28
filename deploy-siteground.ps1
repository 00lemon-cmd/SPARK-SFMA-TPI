$ErrorActionPreference = "Stop"
$DeployDir = ".\siteground-deploy"

Write-Host "=== Spark SFMA - SiteGround Static Deploy ===" -ForegroundColor Cyan

if (Test-Path $DeployDir) { Remove-Item $DeployDir -Recurse -Force }

Write-Host "`n[1/3] Installing dependencies..." -ForegroundColor Yellow
npm ci --prefer-offline

Write-Host "`n[2/3] Building static export..." -ForegroundColor Yellow
npm run build

Write-Host "`n[3/3] Copying output to deploy folder..." -ForegroundColor Yellow
Copy-Item ".\out" $DeployDir -Recurse

Write-Host "`n=== Build complete! ===" -ForegroundColor Green
Write-Host "Upload the contents of .\siteground-deploy\ into /sfma/ on SiteGround." -ForegroundColor Green
$sizeBytes = (Get-ChildItem $DeployDir -Recurse | Measure-Object -Property Length -Sum).Sum
$sizeMB = [math]::Round($sizeBytes / 1MB, 1)
Write-Host "Total size: $($sizeMB) MB"
