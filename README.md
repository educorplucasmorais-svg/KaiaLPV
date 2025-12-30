#  KAIA LPV - Sistema Inteligente com IA Generativa

Sistema completo de landing page e teste interativo de KAIA 5.0, com backend robusto em Node.js + Express, integrado com Google Generative AI.

##  🚀 Funcionalidades Principais

-  **Landing Page Responsiva**: Homepage profissional (/)
-  **KAIA 5.0 Test Page**: Interface interativa para teste do sistema (4 rotas disponíveis)
-  **Google Generative AI**: Integração com Gemini para respostas inteligentes
-  **Backend Escalável**: API RESTful com Express.js
-  **Múltiplas Rotas de Acesso**: `/`, `/app`, `/teste-kaia`, `/kaia`, `/test`
-  **Banco de Dados MySQL**: Estrutura completa para usuários, planos e sessões
-  **API Admin**: Endpoints seguros para administração

##  ⚡ Quick Start

### Rodar Localmente (Desenvolvimento)
```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente (.env)
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=kaia
GEMINI_API_KEY=sua_chave_aqui

# 3. Iniciar servidor
npm start
# Acesse: http://localhost:3001
```

### Rotas Disponíveis
| Rota | Descrição |
|------|-----------|
| `http://localhost:3001/` | Landing page principal |
| `http://localhost:3001/app` | Alias para landing page |
| `http://localhost:3001/teste-kaia` | Página de teste KAIA 5.0 |
| `http://localhost:3001/kaia` | Alias curto para teste |
| `http://localhost:3001/test` | Alias alternativo |

##  🔐 Credenciais Padrão

**Admin Panel:**
- Email: `admin@admin.com`
- Senha: `admin`
- Key: `admin@admin.com`

##  📚 Stack Tecnológica

### Frontend
- **HTML5 / CSS3** - Markup e styling
- **JavaScript Vanilla** - Interatividade
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js 4** - Web framework
- **MySQL 8** - Banco de dados relacional
- **Google Generative AI** - IA integrada
- **Axios** - HTTP client
- **CORS** - Cross-origin requests
- **Dotenv** - Variáveis de ambiente

##  📁 Estrutura do Projeto

```
KaiaLPV/
 index.html              # Landing page principal
 kaia-test.html          # Página de teste KAIA 5.0
 server.js               # Backend Express.js
 package.json            # Dependências e scripts
 vercel.json             # Config Vercel
 railway.toml            # Config Railway
 DATABASE.md             # Documentação do banco de dados
 DEPLOY-GUIDE.md         # Guia completo de deployment
 .env.example            # Template variáveis de ambiente
```

##  🚀 Deployment

### Vercel (Recomendado para Production)
```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy automático
vercel deploy

# 3. Variáveis de Ambiente na Vercel:
# - NODE_ENV=production
# - PORT=3001
# - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
# - GEMINI_API_KEY
```

**Status:** ✅ Pronto para Vercel  
**Arquivo Config:** `vercel.json` (configurado)

### Railway (Alternativa)
```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login e deploy
railway login
railway init
railway up

# 3. Configurar variáveis no painel Railway
```

**Configuração:**
- Builder: Dockerfile
- Health Check: /
- Port: 3001

### Localhost (Desenvolvimento)
```bash
npm start
# Acesse: http://localhost:3001
```

##  ✅ Checklist de Status

- [x] Landing page responsiva
- [x] Página de teste KAIA 5.0
- [x] Backend Node.js + Express
- [x] API RESTful funcional
- [x] Integração Google Generative AI
- [x] Banco de dados MySQL estruturado
- [x] Múltiplas rotas de acesso
- [x] Configuração Vercel pronta
- [x] Configuração Railway pronta
- [x] GitHub sincronizado (main branch)

**PRONTO PARA PRODUCTION! 🎉**

##  📖 Documentação Adicional

- [DATABASE.md](./DATABASE.md) - Schema e queries do banco
- [DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md) - Instruções detalhadas de deploy
- [vercel.json](./vercel.json) - Configuração Vercel
- [railway.toml](./railway.toml) - Configuração Railway

##  🤝 Suporte

Para questões técnicas, consulte a documentação ou abra uma issue no GitHub.

---

**Desenvolvido com ❤️ para KAIA 5.0 - Solução Inteligente**
