# Script de Deploy para Vercel (PowerShell)
# Execute este script para fazer deploy do projeto

Write-Host "🚀 Iniciando deploy para Vercel..." -ForegroundColor Green

# Verifica se a Vercel CLI está instalada
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI não encontrada. Instalando..." -ForegroundColor Yellow
    npm install -g vercel
}

# Verifica se está logado
Write-Host "📋 Verificando login na Vercel..." -ForegroundColor Cyan
vercel whoami

if ($LASTEXITCODE -ne 0) {
    Write-Host "🔐 Faça login na Vercel:" -ForegroundColor Yellow
    vercel login
}

# Deploy
Write-Host "📦 Fazendo deploy..." -ForegroundColor Cyan
$deployType = Read-Host "Deseja fazer deploy para produção? (s/n)"

if ($deployType -eq "s" -or $deployType -eq "S") {
    Write-Host "🚀 Deploy para PRODUÇÃO..." -ForegroundColor Green
    vercel --prod
} else {
    Write-Host "🧪 Deploy para PREVIEW..." -ForegroundColor Yellow
    vercel
}

Write-Host "✅ Deploy concluído!" -ForegroundColor Green
