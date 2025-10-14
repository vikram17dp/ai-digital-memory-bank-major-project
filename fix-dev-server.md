# Fix Dev Server - Windows Permission Error

## Problem
- EPERM error: `.next/trace` file is locked
- Port 3000 in use
- ChunkLoadError when loading

## Solution Steps

### Step 1: Close All Node Processes
**Option A - Task Manager (Easiest):**
1. Press `Ctrl + Shift + Esc` to open Task Manager
2. Find all "Node.js" processes
3. Right-click each one → "End Task"

**Option B - PowerShell:**
```powershell
# Run this in PowerShell as Administrator
Get-Process node | Stop-Process -Force
```

### Step 2: Delete .next Folder
**Option A - File Explorer:**
1. Navigate to `C:\Users\user\Desktop\ai-memory-bank`
2. Find the `.next` folder
3. Delete it (Shift + Delete for permanent delete)

**Option B - PowerShell:**
```powershell
# If folder is locked, wait 5 seconds then try
Start-Sleep -Seconds 5
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
```

### Step 3: Restart Dev Server
```bash
npm run dev
```

## If Still Having Issues

### Clear Everything:
```bash
# Delete build folders
Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path out -Recurse -Force -ErrorAction SilentlyContinue

# Clear npm cache
npm cache clean --force

# Reinstall node_modules
Remove-Item -Path node_modules -Recurse -Force
npm install

# Start fresh
npm run dev
```

## Quick Fix (Try This First!)

1. **Close VSCode/Editor** (File → Exit)
2. **Open Task Manager** (Ctrl+Shift+Esc)
3. **End all "Node.js" processes**
4. **Delete `.next` folder** manually
5. **Reopen VSCode**
6. **Run:** `npm run dev`

## Expected Result
```
✓ Ready in 3.2s
- Local:    http://localhost:3000
- Network:  http://192.168.1.119:3000
```

Should work without EPERM errors!

