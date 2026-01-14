# Script para iniciar o servidor de desenvolvimento Next.js
# Uso: .\start-dev.ps1

Write-Host "🛑 Parando processos Node.js existentes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "🧹 Limpando arquivos de lock..." -ForegroundColor Cyan
if (Test-Path ".next\dev\lock") {
    Remove-Item ".next\dev\lock" -Force -ErrorAction SilentlyContinue
}

Write-Host "⏳ Aguardando 2 segundos..." -ForegroundColor Gray
Start-Sleep -Seconds 2

Write-Host "🚀 Iniciando servidor de desenvolvimento..." -ForegroundColor Green
npm run dev
