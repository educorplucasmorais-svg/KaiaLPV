# 📚 Backlog de Aprendizado - Deploy de Site do Zero

## 🎯 Projeto: Fonte da Juventude 2.0
**Data:** 07/12/2025  
**Status:** ✅ Deploy Completo

---

## 📋 Checklist Completo de Deploy

### 1. 🏗️ Estrutura do Projeto
- [x] **Frontend:** React 18 + TypeScript + Vite
- [x] **Backend:** Spring Boot 3.2.0 + Java 21
- [x] **Banco de Dados:** MySQL (Hostinger)
- [x] **Estilização:** TailwindCSS

### 2. 🖥️ Desenvolvimento Local
```bash
# Backend (porta 8080)
mvn -DskipTests spring-boot:run

# Frontend (porta 5173/5174)
cd frontend && npm run dev
```

### 3. 🚀 Deploy Backend (Railway)
1. Criar conta no [Railway](https://railway.app)
2. Conectar repositório GitHub
3. Configurar variáveis de ambiente:
   - `SPRING_DATASOURCE_URL`
   - `SPRING_DATASOURCE_USERNAME`
   - `SPRING_DATASOURCE_PASSWORD`
4. Deploy automático via push no GitHub

**Comandos úteis:**
```bash
railway login
railway link
railway up
```

### 4. 🌐 Deploy Frontend (Vercel)
1. Criar conta no [Vercel](https://vercel.com)
2. Instalar CLI: `npm i -g vercel`
3. Fazer login: `npx vercel login`
4. Deploy: `npx vercel --prod`

**Arquivo `vercel.json`:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 5. 🔗 Configuração de Domínio Customizado

#### 5.1 Adicionar domínio na Vercel
```bash
npx vercel domains add seudominio.com.br
npx vercel domains add www.seudominio.com.br
```

#### 5.2 Configurar DNS na Hostinger
1. Acessar: **Domínios** → Seu domínio → **Gerenciar**
2. Ir em: **DNS / Nameservers** → **Registros DNS**
3. Adicionar registros:

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 14400 |
| CNAME | www | cname.vercel-dns.com | 3600 |

#### 5.3 Remover hospedagem conflitante
- Se houver página de parking da Hostinger, excluir o site da seção "Sites"
- Manter apenas o domínio ativo

### 6. ⚠️ Problemas Comuns e Soluções

| Problema | Causa | Solução |
|----------|-------|---------|
| `403 Forbidden` | Domínio em projeto errado | Remover e re-adicionar domínio |
| `ERR_SSL_PROTOCOL_ERROR` | Certificado gerando | Aguardar 2-5 minutos |
| Página Hostinger aparece | Hospedagem ativa | Excluir site da Hostinger |
| Package mismatch (Java) | Pasta ≠ package | Corrigir declaração `package` |

### 7. 🔍 Comandos de Diagnóstico

```bash
# Verificar DNS
nslookup seudominio.com.br 8.8.8.8

# Listar domínios Vercel
npx vercel domains ls

# Inspecionar domínio
npx vercel domains inspect seudominio.com.br

# Testar HTTP
curl -I https://seudominio.com.br
```

---

## 📱 Responsividade (Mobile-First)

### Breakpoints TailwindCSS
```
sm: 640px   (celulares grandes)
md: 768px   (tablets)
lg: 1024px  (laptops)
xl: 1280px  (desktops)
2xl: 1536px (telas grandes)
```

### Padrão Mobile-First
```tsx
// ❌ Errado (Desktop-First)
className="text-2xl sm:text-lg"

// ✅ Correto (Mobile-First)
className="text-lg sm:text-xl md:text-2xl"
```

---

## 🔐 Segurança

- [x] Nunca commitar `.env` com credenciais
- [x] Usar variáveis de ambiente no Railway/Vercel
- [x] CORS configurado para domínios permitidos
- [x] HTTPS automático via Vercel

---

## 📊 Arquitetura Final

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Vercel      │────▶│     Railway     │────▶│    Hostinger    │
│   (Frontend)    │     │    (Backend)    │     │     (MySQL)     │
│  React + Vite   │     │  Spring Boot    │     │    Database     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │
        ▼
┌─────────────────┐
│    Hostinger    │
│    (Domínio)    │
│ dracybeleguedes │
│    .com.br      │
└─────────────────┘
```

---

## ✅ Resultado Final

- **Domínio:** https://dracybeleguedes.com.br
- **Frontend:** Vercel (React + Vite)
- **Backend:** Railway (Spring Boot)
- **Database:** Hostinger MySQL
- **SSL:** ✅ Automático via Vercel

---

*Documento gerado automaticamente pelo Agente Teste1*
