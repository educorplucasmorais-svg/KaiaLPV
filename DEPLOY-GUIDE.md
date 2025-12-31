# 🚀 KAIA 5.0 - GUIA DE DEPLOY COMPLETO

## 📦 Arquivos Necessários para Deploy

| Arquivo | Descrição |
|---------|-----------|
| `server.js` | Backend Node.js/Express |
| `index.html` | Landing page |
| `kaia-test.html` | Página de teste KAIA 5.0 |
| `kaia-report.html` | Página de relatório PDI |
| `vercel.json` | Configuração Vercel |
| `railway.toml` | Configuração Railway |
| `package.json` | Dependências Node.js |

---

## 🔷 DEPLOY NA VERCEL (Recomendado para Frontend + Backend)

### Passo 1: Conectar GitHub
1. Acesse: https://vercel.com/new
2. Clique em **Import Git Repository**
3. Selecione o repositório `educorplucasmorais-svg/KaiaLPV`
4. Branch: `copilot/complete-sync-implementation` (ou `main` após merge)

### Passo 2: Configurações do Projeto
```
Framework Preset: Other
Root Directory: ./
Build Command: (deixar vazio)
Output Directory: ./
Install Command: npm install
```

### Passo 3: Variáveis de Ambiente (Settings > Environment Variables)
```env
# Gemini AI (obrigatório para chat funcionar)
GEMINI_API_KEY=AIzaSyCpwsxWHCIs6t3Bjqm6PrMk6CoIoyMhEfA

# Admin
KAIA_ADMIN_KEY=sua_chave_admin_secreta

# Stripe (opcional - para pagamentos)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# MySQL (opcional - se não usar, funciona sem banco)
DATABASE_URL=mysql://user:pass@host:3306/kaia_db

# Porta (Vercel define automaticamente)
PORT=3001
```

### Passo 4: Deploy
1. Clique em **Deploy**
2. Aguarde ~2 minutos
3. URL gerada: `https://kaia-lpv.vercel.app`

### Rotas Disponíveis na Vercel:
- `/` → Landing page
- `/teste-kaia` → Teste KAIA 5.0
- `/kaia` → Alias do teste
- `/test` → Alias do teste
- `/relatorio` → Relatório PDI
- `/report` → Alias do relatório
- `/pdi` → Alias do relatório
- `/health` → Health check

---

## 🚂 DEPLOY NA RAILWAY (Backend com MySQL)

### Passo 1: Criar Projeto
1. Acesse: https://railway.app/new
2. Clique em **Deploy from GitHub repo**
3. Selecione `educorplucasmorais-svg/KaiaLPV`

### Passo 2: Adicionar MySQL
1. No dashboard, clique em **+ New**
2. Selecione **Database** > **MySQL**
3. Railway criará automaticamente as variáveis `MYSQL_*`

### Passo 3: Variáveis de Ambiente
```env
# Gemini AI
GEMINI_API_KEY=AIzaSyCpwsxWHCIs6t3Bjqm6PrMk6CoIoyMhEfA

# Admin
KAIA_ADMIN_KEY=sua_chave_admin

# MySQL (Railway preenche automaticamente se você adicionou o DB)
DATABASE_URL=${{MySQL.DATABASE_URL}}

# Ou manualmente:
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=5678
DB_USER=root
DB_PASSWORD=xxxx
DB_NAME=railway

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Railway
PORT=3001
NODE_ENV=production
```

### Passo 4: Deploy
1. Railway detecta Node.js automaticamente
2. Executa `npm install` + `npm start`
3. URL gerada: `https://kaia-lpv.railway.app`

---

## 📱 SINCRONIZAR COM VSCODE

```bash
# 1. Abra o terminal no VSCode
cd C:\Users\Pichau\Desktop\KaiaLPV

# 2. Sincronize o branch
git fetch origin
git checkout copilot/complete-sync-implementation
git pull origin copilot/complete-sync-implementation

# 3. Verifique os arquivos
dir kaia-test.html
dir server.js
dir vercel.json

# 4. Instale dependências
npm install

# 5. Teste localmente
node server.js

# 6. Acesse no navegador
# http://localhost:3001/
# http://localhost:3001/teste-kaia
```

---

## 🔑 CREDENCIAIS E TOKENS

### Tokens de Acesso KAIA:
| Token | Descrição | Ação |
|-------|-----------|------|
| `Revelagrupo01testecontrole` | Token Alpha (público) | Fluxo completo do teste |
| `adminrevela` | Token Admin (secreto) | Vai direto para relatório |

### Gemini API:
- **API Key**: `AIzaSyCpwsxWHCIs6t3Bjqm6PrMk6CoIoyMhEfA`
- **Modelo**: `gemini-1.5-flash`

---

## ✅ CHECKLIST PÓS-DEPLOY

- [ ] Acessar URL principal (`/`)
- [ ] Testar página de teste (`/teste-kaia`)
- [ ] Validar botão "🎁 Teste Gratuito"
- [ ] Testar chat com Gemini AI
- [ ] Verificar relatório (`/relatorio`)
- [ ] Testar export PDF
- [ ] Verificar health check (`/health`)

---

## 🐛 TROUBLESHOOTING

### Erro: "Cannot GET /teste-kaia"
```bash
# Servidor desatualizado. Reinicie:
git pull origin copilot/complete-sync-implementation
npm install
node server.js
```

### Erro: "GEMINI_API_KEY not found"
```bash
# Adicione no .env:
GEMINI_API_KEY=AIzaSyCpwsxWHCIs6t3Bjqm6PrMk6CoIoyMhEfA
```

### Erro: "Access denied" no MySQL
- Verifique se DATABASE_URL está correta
- O sistema funciona sem banco (fallback para memória)

---

## 📊 STATUS DO PROJETO

- **18 commits** sincronizados
- **13 tabelas** no banco de dados
- **7 rotas** de páginas
- **5 endpoints** de API
- **Design Premium HD** implementado
- **KAIA 5.0 Deep Triangulation** ativo

**Status**: ✅ PRONTO PARA PRODUCTION! 
