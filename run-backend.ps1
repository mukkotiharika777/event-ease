# EventEase — Java Spring Boot Backend Runner
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$JavaHome = Join-Path $ScriptDir "tools\jdk21\jdk-21.0.13.1+2"
$MavenBin = Join-Path $ScriptDir "tools\maven\apache-maven-3.9.6\bin"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " EventEase Backend: Java 21 Spring Boot Runner           " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$env:JAVA_HOME = $JavaHome
$env:PATH = "$JavaHome\bin;$MavenBin;$env:PATH"

Set-Location (Join-Path $ScriptDir "backend")
Write-Host "Launching Spring Boot Backend on http://localhost:8080..." -ForegroundColor Green
& "$MavenBin\mvn.cmd" spring-boot:run
