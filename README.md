#  Fonte da Juventude - Sistema de Gestão

Sistema completo para clínica de dermatologia e estética, desenvolvido com React 19 + Spring Boot 3.2 + Java 21 LTS.

##  Funcionalidades

-  **Autenticação**: Login com credenciais master (admin/admin)
-  **Dashboard**: Visão geral de pacientes e planos
-  **Cadastro de Pacientes**: Gestão completa de clientes
-  **Planos de Tratamento**: Seleção de 30+ tratamentos com marcação de essenciais ()
-  **Geração de PDF**: Documentos profissionais com 2 colunas e campos de pagamento
-  **Banco de Dados**: Visualização e download de planos salvos
-  **Configurações**: Painel administrativo

##  Quick Start

### Frontend (Desenvolvimento)
```bash
cd frontend
npm install
npm run dev
# Acesse: http://localhost:5173
```

### Build de Produção
```bash
cd frontend
npm run build
# Arquivos gerados em: dist/
```

##  Credenciais

**Login Master:**
- Email: `admin`
- Senha: `admin`

##  Stack Tecnológica

### Frontend
- **React 19.2.0** - UI framework
- **TypeScript** - Type safety
- **Vite 7.2.4** - Build tool
- **Wouter** - SPA routing
- **Sonner** - Toast notifications
- **TailwindCSS** - Inline styling

### Backend
- **Java 21 LTS** (Microsoft build)
- **Spring Boot 3.2.0** (Web, Security, JPA)
- **MySQL 8** - Database
- **Maven 3.9.11** - Build tool

### Design
- **Cores**: Bege (#e8e0d5), Dourado (#d4af37), Taupe (#8F7169)
- **Fontes**: Cormorant Garamond, Cinzel, Georgia
- **Logos**: Componentes reutilizáveis LogoCG e LogoFJ

##  Estrutura do Projeto

```
fonte-da-juventude-2.0/
 frontend/
    src/
       components/     # LogoCG.tsx, LogoFJ.tsx
       pages/          # 8 páginas principais
       App.tsx         # Routing e layout
       App.css         # Luxury theme
    dist/               # Build de produção 
    vercel.json         # Config Vercel
    package.json
 src/main/
    java/
       controller/     # REST endpoints
       model/          # Entities (User, Patient, Plan)
       service/        # Business logic
       config/         # Security config
    resources/
        application.properties
 target/                 # JAR compilado
 pom.xml                 # Maven config (Java 21)
 railway.toml            # Config Railway
 DEPLOY-GUIDE.md         #  Guia completo de deployment
 README.md               # Este arquivo
```

##  Deployment

### Vercel (Frontend)
```bash
# 1. Push para GitHub
git init
git add .
git commit -m "Deploy Fonte da Juventude"
git remote add origin SEU_REPO
git push -u origin main

# 2. Importar na Vercel
# - Framework: Vite
# - Root: frontend
# - Build: npm run build
# - Output: dist
```

### Railway (Backend)
```bash
# 1. Conectar repositório no Railway
# 2. Adicionar variáveis de ambiente:
SPRING_DATASOURCE_URL=jdbc:mysql://srv1099.hstgr.io:3306/u475858067_revela
SPRING_DATASOURCE_USERNAME=u475858067_revela
SPRING_DATASOURCE_PASSWORD=Admin_123456
```

**Ver guia completo:** `DEPLOY-GUIDE.md`

##  Status do Projeto

- [x] Frontend 100% funcional
- [x] Build de produção OK
- [x] Componentes de logo reutilizáveis
- [x] PDF generation com print nativo
- [x] Autenticação localStorage
- [x] 30+ tratamentos catalogados
- [x] Marcação de essenciais ()
- [x] Backend Spring Boot estruturado
- [x] Configuração deployment

** PRONTO PARA PRODUCTION!**

##  Suporte

Para mais informações, consulte:
- `DEPLOY-GUIDE.md` - Guia detalhado de deployment
- `DEPLOYMENT.md` - Instruções técnicas

---

**Desenvolvido com  para Dra. Cybele Guedes - Dermatologia**
