#  KAIA - Guia de Integração Stripe

##  O que foi criado

\\\
C:\Users\Pichau\Desktop\KaiaLPV\
 server.js ( Backend com Stripe)
 stripe-integration.js (Frontend script)
 .env (Variáveis de ambiente)
 .gitignore
 package.json
 SETUP.md
 KaiaLPV/
     index.html (Landing page com botões de checkout)
     sucesso.html (Página pós-pagamento)
     cancelado.html (Página de cancelamento)
     kaia.html, kaia-fixed.html, test.html (Arquivos anteriores)
     README.md
\\\

##  Configuração Imediata (5 minutos)

### 1 Obter Chaves Stripe
- Acesse: https://dashboard.stripe.com/apikeys
- Copie:
  - **Secret Key**: sk_test_...
  - **Public Key**: pk_test_...

### 2 Obter Webhook Secret
- Dashboard  Developers  Webhooks
- Crie novo endpoint ou use existente
- Copie o signing secret: whsec_...

### 3 Editar .env
\\\
STRIPE_SECRET_KEY=sk_test_sua_chave_aqui
STRIPE_PUBLIC_KEY=pk_test_sua_chave_aqui
PORT=3000
WEBHOOK_SECRET=whsec_sua_chave_aqui
\\\

### 4 Editar stripe-integration.js
Procure por:
\\\javascript
const STRIPE_PUBLIC_KEY = 'pk_test_sua_chave_publica_aqui';
\\\

Substitua pela sua chave pública.

### 5 Iniciar Servidor
\\\ash
npm start
\\\

Acesso:
- Landing: http://localhost:3000
- Health: http://localhost:3000/api/health

##  Testar Checkout

1. Acesse http://localhost:3000
2. Clique em "COMEÇAR AGORA" em qualquer plano
3. Digite email e telefone
4. Use cards de teste:

** Sucesso:**
- Número: 4242 4242 4242 4242
- Data: 12/26
- CVC: 123

** Recusado:**
- Número: 4000 0000 0000 0002

##  Fluxo de Pagamento

\\\
[Usuário clica COMEÇAR AGORA]
        
[Script: handleCheckout(planId)]
        
[Coleta email + WhatsApp]
        
[POST /api/checkout]
        
[Stripe cria session]
        
[Redireciona para Checkout]
        
[Usuário paga]
        
[Stripe redireciona para /sucesso]
        
[Webhook confirma pagamento]
        
[Acesso ativado]
\\\

##  Produção (Deploy Vercel/Hostinger)

### URLs a Atualizar:
\\\javascript
// stripe-integration.js
const API_URL = 'https://seu-dominio.com/api';

// server.js
success_url: 'https://seu-dominio.com/sucesso',
cancel_url: 'https://seu-dominio.com/cancelado'
\\\

### Configurar HTTPS:
- Hostinger: SSL automático 
- Vercel: HTTPS padrão 

### Deploy:
\\\ash
npm run start
# ou
vercel --prod
\\\

### Configurar Webhook em Produção:
- URL: https://seu-dominio.com/api/webhook
- Eventos:
  - invoice.payment_succeeded
  - customer.subscription.created
  - customer.subscription.deleted
  - invoice.payment_failed

##  Endpoints da API

### GET /api/plans
Retorna lista de planos disponíveis

### POST /api/checkout
Cria sessão de checkout
\\\json
{
  "planId": "me-conhecer",
  "email": "usuario@email.com",
  "phone": "11987654321"
}
\\\

### GET /api/subscription/:sessionId
Verifica status da assinatura

### POST /api/webhook
Processa eventos do Stripe (automático)

### GET /api/health
Testa conexão com servidor

##  Troubleshooting

** Erro: "Stripe not defined"**
- stripe-integration.js está carregando?
- Verifique console do navegador

** CORS error**
- CORS está ativado no server.js 
- Verifique URL em stripe-integration.js

** "Invalid API Key"**
- Chave Stripe incorreta no .env
- Regenere no dashboard

** Webhook não funciona**
- Teste: http://localhost:3000/api/health
- Confirme .env carregado
- Reinicie servidor

##  Próximos Passos

1.  Integração Stripe completa
2.  Criar dashboard do usuário
3.  Sistema de autenticação (JWT)
4.  Banco de dados (MySQL/Supabase)
5.  Envio de emails de confirmação
6.  Área de membros com conteúdo exclusivo

##  Suporte

- Stripe Docs: https://stripe.com/docs
- Dashboard: https://dashboard.stripe.com
- Test Cards: https://stripe.com/docs/testing

---

**Última atualização:** 06/12/2024
**Status:**  Pronto para Produção
