# KAIA - Landing Page com Integração de Pagamento

##  Setup Rápido

### 1. Configurar Stripe
1. Acesse [stripe.com](https://stripe.com)
2. Crie uma conta (testando com chaves de teste)
3. Copie as chaves no dashboard:
   - **Secret Key**: sk_test_...
   - **Public Key**: pk_test_...
   - **Webhook Secret**: whsec_...

### 2. Configurar Variáveis de Ambiente
Edite o arquivo .env:
\\\
STRIPE_SECRET_KEY=sk_test_seu_secret_key
STRIPE_PUBLIC_KEY=pk_test_seu_public_key
PORT=3000
WEBHOOK_SECRET=whsec_seu_webhook_secret
\\\

### 3. Atualizar Chave Pública no Frontend
No arquivo KaiaLPV/index.html, procure por:
\\\html
<script src="stripe-integration.js"></script>
\\\

E atualize o arquivo stripe-integration.js:
\\\javascript
const STRIPE_PUBLIC_KEY = 'pk_test_SUA_CHAVE_PUBLICA_AQUI';
\\\

### 4. Iniciar Servidor
\\\ash
npm start
\\\

Acesse:
- Landing Page: http://localhost:3000
- Webhook Tester: http://localhost:3000/api/health

##  Estrutura

\\\
KaiaLPV/
 index.html (Landing Page)
 server.js (Backend Express + Stripe)
 stripe-integration.js (Frontend Script)
 .env (Variáveis de ambiente)
 .gitignore
 package.json
\\\

##  Fluxo de Pagamento

1. Usuário clica em "Começar Agora"
2. Fornece email e WhatsApp
3. Redireciona para Stripe Checkout
4. Após pagamento bem-sucedido:
   - Assinatura criada automaticamente
   - Webhook confirma pagamento
   - Usuário recebe acesso

##  Testar com Stripe (Cards de Teste)

### Pagamento com Sucesso:
- Cartão: 4242 4242 4242 4242
- Data: Qualquer futura
- CVC: Qualquer número

### Pagamento Recusado:
- Cartão: 4000 0000 0000 0002

##  Webhooks

Configue o webhook no Stripe Dashboard:

**URL do Webhook**: \https://seu-dominio.com/api/webhook\

**Eventos para monitorar**:
- \invoice.payment_succeeded\
- \customer.subscription.created\
- \customer.subscription.deleted\
- \invoice.payment_failed\

##  Verificar Status

GET \/api/subscription/{sessionId}\ - Retorna status da assinatura

##  Deploy no Vercel/Hostinger

1. Atualize URLs em stripe-integration.js:
   \\\javascript
   const API_URL = 'https://seu-dominio.com/api';
   \\\

2. Configure HTTPS (obrigatório para Stripe)

3. Deploy:
   \\\ash
   vercel --prod
   \\\

##  Troubleshooting

**Erro: Invalid CORS**
- Confirme que CORS está ativado no server.js

**Erro: Stripe not defined**
- Adicione script Stripe antes de stripe-integration.js

**Webhook não funciona**
- Confirme STRIPE_SECRET_KEY está correta
- Teste em http://localhost:3000/api/health

##  Documentação Oficial

- [Stripe Docs](https://stripe.com/docs)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Webhooks](https://stripe.com/docs/webhooks)
