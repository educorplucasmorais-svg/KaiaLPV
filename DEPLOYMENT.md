# Fonte da Juventude - Deployment Guide

## Frontend (Vercel)

### Deploy Steps:
1. Build do projeto: `cd frontend && npm run build`
2. Na Vercel:
   - Import Git Repository
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `frontend`

### Variáveis de Ambiente:
Nenhuma necessária (usa localStorage)

## Backend (Railway/Hostinger)

### Railway (Recomendado para início):
1. Conectar repositório GitHub
2. Configuração automática detecta Spring Boot
3. Variáveis de ambiente:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://srv1099.hstgr.io:3306/u475858067_revela
   SPRING_DATASOURCE_USERNAME=u475858067_revela
   SPRING_DATASOURCE_PASSWORD=Admin_123456
   ```

### Hostinger (Alternativa):
1. Upload do JAR via FTP
2. Configurar Tomcat/Java 21
3. Criar banco MySQL no painel

## Credenciais Master
- Email: admin
- Senha: admin

## Portas
- Frontend: 5173 (dev) / 4173 (preview)
- Backend: 8080

