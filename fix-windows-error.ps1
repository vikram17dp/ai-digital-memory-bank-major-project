# Fix Windows EPERM Error - AI Memory Bank
Write-Host "🔧 Fixing Windows Permission Errors..." -ForegroundColor Cyan

# Step 1: Stop all Node processes
Write-Host "`n1️⃣ Stopping Node.js processes..." -ForegroundColor Yellow
try {
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "✅ Node processes stopped" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ No Node processes found" -ForegroundColor Gray
}

# Step 2: Wait for files to unlock
Write-Host "`n2️⃣ Waiting for files to unlock..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Write-Host "✅ Files should be unlocked now" -ForegroundColor Green

# Step 3: Delete .next folder
Write-Host "`n3️⃣ Deleting .next folder..." -ForegroundColor Yellow
if (Test-Path .next) {
    try {
        Remove-Item -Path .next -Recurse -Force -ErrorAction Stop
        Write-Host "✅ .next folder deleted" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Could not delete .next folder. Please delete it manually." -ForegroundColor Red
        Write-Host "   Location: $PWD\.next" -ForegroundColor Gray
    }
} else {
    Write-Host "ℹ️ .next folder doesn't exist" -ForegroundColor Gray
}

# Step 4: Start dev server
Write-Host "`n4️⃣ Starting development server..." -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
npm run dev

