#  FONTE DA JUVENTUDE - DEPLOYMENT PRONTO

##  Correções Aplicadas
- **Botão PDF corrigido**: Agora gera PDF diretamente na página Plans
- **Componentes de Logo**: LogoCG e LogoFJ criados como componentes reutilizáveis
- **Build de produção**:  Compilado com sucesso (dist/ folder)

##  DEPLOYMENT - FRONTEND (VERCEL)

### Passo 1: Preparar Repositório Git
```bash
git init
git add .
git commit -m "Initial commit - Fonte da Juventude"
git branch -M main
git remote add origin SEU_REPOSITORIO_GITHUB
git push -u origin main
```

### Passo 2: Deploy na Vercel
1. Acesse: https://vercel.com/new
2. Import Git Repository
3. Configurações:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Clique em **Deploy**

### Variáveis de Ambiente (Vercel):
Nenhuma necessária - usa localStorage localmente

---

##  DEPLOYMENT - BACKEND (RAILWAY)

### Opção 1: Railway (Recomendado)
1. Acesse: https://railway.app/new
2. Deploy from GitHub repo
3. Selecione o repositório
4. Adicione **variáveis de ambiente**:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://srv1079.hstgr.io:3306/u318705478_FonteClara?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
   SPRING_DATASOURCE_USERNAME=u318705478_FonteClara
   SPRING_DATASOURCE_PASSWORD=SiteClara2025
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   SPRING_JPA_SHOW_SQL=false
   ```

5. Railway detectará Spring Boot automaticamente
6. Deploy será feito com Java 21

### Opção 2: Hostinger (Alternativa)

#### Build do JAR:
```bash
cd "c:\Users\Pichau\Desktop\Site Clara 2.0\fonte-da-juventude-2.0"
$env:JAVA_HOME = 'C:\jdk21\jdk-21.0.8'
$env:PATH = 'C:\maven\maven-3.9.11\bin;' + $env:PATH
mvn clean package -DskipTests
```

JAR gerado em: `target/kaia-0.0.1-SNAPSHOT.jar`

#### Upload FTP:
1. Use FileZilla ou painel Hostinger
2. Upload do JAR para: `/home/u475858067/public_html/`
3. Configure Tomcat 10 + Java 21
4. Banco de dados já está criado (srv1099.hstgr.io)

---

## 🔑 CREDENCIAIS

### Master Login:
- **Email**: admin
- **Senha**: admin

### Banco de Dados (Hostinger - ATUALIZADO DEZ/2025):
- **Host**: srv1079.hstgr.io
- **Port**: 3306
- **Database**: u318705478_FonteClara
- **Username**: u318705478_FonteClara
- **Password**: SiteClara2025
- **Domínio**: dracybeleguedes.com.br

---

##  ARQUIVOS IMPORTANTES

### Frontend:
- `frontend/dist/` - Build de produção 
- `frontend/vercel.json` - Configuração SPA routing
- `frontend/src/components/LogoCG.tsx` - Logo Cybele Guedes
- `frontend/src/components/LogoFJ.tsx` - Logo Fonte da Juventude

### Backend:
- `target/*.jar` - Backend compilado (após mvn package)
- `src/main/resources/application.properties` - Config DB
- `railway.toml` - Config Railway

### Configuração:
- `DEPLOYMENT.md` - Este guia
- `pom.xml` - Java 21, Spring Boot 3.2.0

---

##  TESTES LOCAIS

### Frontend (localhost:5173):
```bash
cd frontend
npm run dev
```

### Backend (localhost:8080):
```bash
$env:JAVA_HOME = 'C:\jdk21\jdk-21.0.8'
$env:PATH = 'C:\maven\maven-3.9.11\bin;' + $env:PATH
mvn spring-boot:run
```

### Preview Build (localhost:4173):
```bash
cd frontend
npm run build
npm run preview
```

---

##  URLs APÓS DEPLOYMENT

- **Frontend**: https://seu-app.vercel.app
- **Backend Railway**: https://seu-app.railway.app
- **Banco Hostinger**: srv1099.hstgr.io:3306

---

##  PRÓXIMOS PASSOS

1.  Push código para GitHub
2.  Deploy frontend na Vercel
3.  Deploy backend na Railway
4.  Testar credenciais: admin/admin
5.  Verificar PDF generation
6.  Testar CRUD de pacientes e planos

**Status**: PRONTO PARA PRODUCTION! 
