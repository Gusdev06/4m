# Script para parar o servidor de desenvolvimento Next.js
# Uso: .\stop-dev.ps1

Write-Host "🛑 Parando todos os processos Node.js..." -ForegroundColor Yellow
$processes = Get-Process -Name node -ErrorAction SilentlyContinue

if ($processes) {
    $processes | Stop-Process -Force
    Write-Host "✅ Processos Node.js encerrados!" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Nenhum processo Node.js encontrado." -ForegroundColor Gray
}

Write-Host "🧹 Limpando arquivos de lock..." -ForegroundColor Cyan
if (Test-Path ".next\dev\lock") {
    Remove-Item ".next\dev\lock" -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Arquivo de lock removido!" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Nenhum arquivo de lock encontrado." -ForegroundColor Gray
}
