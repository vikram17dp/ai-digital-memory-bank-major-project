# Memory Bank - Clean Start Script

Write-Host "🧹 Cleaning .next directory..." -ForegroundColor Cyan
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
    Write-Host "✓ Cleaned .next directory" -ForegroundColor Green
} else {
    Write-Host "✓ No .next directory to clean" -ForegroundColor Yellow
}

Write-Host "`n🚀 Starting development server..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

npm run dev
