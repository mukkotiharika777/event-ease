# EventEase — Complete Full-Stack Runner
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " EventEase: Plan. Manage. Experience.                     " -ForegroundColor Green
Write-Host " Launching Full-Stack Application (Frontend & Backend)    " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

# 1. Start Java Spring Boot Backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-File", (Join-Path $ScriptDir "run-backend.ps1")

# 2. Start Vite Frontend in current window
Set-Location (Join-Path $ScriptDir "frontend")
Write-Host "Frontend running on http://localhost:3000..." -ForegroundColor Cyan
npm run dev -- --host --port 3000
