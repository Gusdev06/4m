# Guia de Deploy - Vercel

Este projeto está configurado para deploy na Vercel.

## Opção 1: Deploy via Vercel CLI (Recomendado)

1. **Instale a Vercel CLI globalmente:**
   ```bash
   npm i -g vercel
   # ou
   pnpm add -g vercel
   ```

2. **Navegue até a pasta do projeto:**
   ```bash
   cd v0-ip-hone-call-simulation
   ```

3. **Faça login na Vercel:**
   ```bash
   vercel login
   ```

4. **Faça o deploy:**
   ```bash
   vercel
   ```
   
   Para produção:
   ```bash
   vercel --prod
   ```

## Opção 2: Deploy via GitHub + Vercel Dashboard

1. **Crie um repositório no GitHub** (se ainda não tiver)

2. **Faça push do código:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <seu-repositorio-github>
   git push -u origin main
   ```

3. **Conecte no Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "Add New Project"
   - Importe seu repositório do GitHub
   - A Vercel detectará automaticamente que é um projeto Next.js
   - Clique em "Deploy"

## Opção 3: Deploy via Vercel Dashboard (Upload)

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Selecione "Upload"
4. Faça upload da pasta `v0-ip-hone-call-simulation`
5. A Vercel fará o build e deploy automaticamente

## Configurações Importantes

- **Build Command:** `pnpm build`
- **Output Directory:** `.next`
- **Install Command:** `pnpm install`
- **Node Version:** Recomendado Node.js 18.x ou superior

## Variáveis de Ambiente

Se você precisar configurar variáveis de ambiente:
1. No dashboard da Vercel, vá em Settings > Environment Variables
2. Adicione as variáveis necessárias
3. Faça um novo deploy

## Verificações Antes do Deploy

- ✅ Certifique-se de que `pnpm build` funciona localmente
- ✅ Verifique se não há erros de TypeScript (ou configure `ignoreBuildErrors: true` no next.config.mjs)
- ✅ Teste a aplicação localmente com `pnpm dev`

## Após o Deploy

O projeto estará disponível em uma URL como:
`https://seu-projeto.vercel.app`

Você também pode configurar um domínio personalizado nas configurações do projeto na Vercel.
