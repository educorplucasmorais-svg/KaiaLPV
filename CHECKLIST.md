# CHECKLIST - ATIVAR PAGAMENTO KAIA

##  FASE 1: Configuração Stripe (10 min)

- [ ] Acessar https://dashboard.stripe.com
- [ ] Fazer login ou criar conta
- [ ] Copiar Secret Key (sk_test_...)
- [ ] Copiar Public Key (pk_test_...)
- [ ] Acessar Developers > Webhooks
- [ ] Copiar Webhook Secret (whsec_...)

##  FASE 2: Editar Variáveis de Ambiente (2 min)

**Arquivo: C:\Users\Pichau\Desktop\KaiaLPV\.env**

\\\
STRIPE_SECRET_KEY=sk_test_SUA_CHAVE_AQUI
STRIPE_PUBLIC_KEY=pk_test_SUA_CHAVE_AQUI
PORT=3000
WEBHOOK_SECRET=whsec_SUA_CHAVE_AQUI
\\\

- [ ] Secret Key colada
- [ ] Public Key colada
- [ ] Webhook Secret colada
- [ ] Arquivo salvo

##  FASE 3: Atualizar Frontend (2 min)

**Arquivo: C:\Users\Pichau\Desktop\KaiaLPV\stripe-integration.js**

Procure pela linha:
\\\javascript
const STRIPE_PUBLIC_KEY = 'pk_test_sua_chave_publica_aqui';
\\\

Substitua:
\\\javascript
const STRIPE_PUBLIC_KEY = 'pk_test_SUA_CHAVE_REAL_AQUI';
\\\

- [ ] Public Key atualizada

##  FASE 4: Iniciar Servidor (1 min)

**PowerShell:**
\\\powershell
cd C:\Users\Pichau\Desktop\KaiaLPV
npm start
\\\

Você deve ver:
\\\
 Servidor KAIA rodando em http://localhost:3000
 Stripe Key configurada: sk_test_...
\\\

- [ ] Servidor rodando sem erros

##  FASE 5: Testar Checkout (5 min)

1. Abra: http://localhost:3000
2. Clique em "COMEÇAR AGORA" em qualquer plano
3. Digite email: teste@email.com
4. Digite WhatsApp: 11987654321
5. Use card de teste:
   - Número: 4242 4242 4242 4242
   - Data: 12/26
   - CVC: 123

Resultado esperado:
- [ ] Modal de checkout abre
- [ ] Stripe Checkout carrega
- [ ] Pagamento é processado
- [ ] Redireciona para sucesso.html
- [ ] Webhook recebe confirmação

##  FASE 6: Deploy em Produção (Futuro)

Quando pronto para produção:

**Passo 1: Atualizar URLs**

stripe-integration.js:
\\\javascript
const API_URL = 'https://seu-dominio.com/api';
\\\

server.js:
\\\javascript
success_url: 'https://seu-dominio.com/sucesso',
cancel_url: 'https://seu-dominio.com/cancelado'
\\\

**Passo 2: Usar Chaves de Produção**

No Stripe Dashboard:
- Ativar modo de produção
- Copiar Chaves de Produção (sk_live_..., pk_live_...)

**Passo 3: Deploy**

\\\ash
# Vercel
vercel --prod

# Ou Hostinger
npm start
\\\

**Passo 4: Configurar Webhook em Produção**

Stripe Dashboard > Webhooks:
- URL: https://seu-dominio.com/api/webhook
- Eventos: invoice.payment_succeeded, customer.subscription.created, etc

---

**Data de Conclusão:** ___/___/_____

**Assinatura:** ________________________
