require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('./KaiaLPV'));

// Dados dos planos
const plans = {
    'me-conhecer': {
        name: 'Me Conhecer',
        price: 4990, // em centavos
        currency: 'BRL',
        features: ['DISC', 'Quociente de Potencial', 'Sabotadores'],
        interval: 'month'
    },
    'crescimento-saudavel': {
        name: 'Crescimento Saudável',
        price: 8990,
        currency: 'BRL',
        features: ['Tudo do plano Me Conhecer', 'Soft Skills', 'Liderança', 'PDI Estruturado'],
        interval: 'month'
    },
    'conselho-bom': {
        name: 'Conselho Bom',
        price: 10990,
        currency: 'BRL',
        features: ['Tudo do plano Crescimento Saudável', 'Consultoria individual (2h)', 'Automação personalizada', 'Até 3 unidades/negócios'],
        interval: 'month'
    }
};

// Rotas
app.get('/api/plans', (req, res) => {
    res.json(plans);
});

// Criar checkout session
app.post('/api/checkout', async (req, res) => {
    try {
        const { planId, email, phone } = req.body;

        if (!planId || !plans[planId]) {
            return res.status(400).json({ error: 'Plano inválido' });
        }

        const plan = plans[planId];

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: email,
            client_reference_id: phone,
            line_items: [
                {
                    price_data: {
                        currency: plan.currency.toLowerCase(),
                        product_data: {
                            name: plan.name,
                            description: plan.features.join(', '),
                            metadata: {
                                plan_id: planId
                            }
                        },
                        unit_amount: plan.price,
                        recurring: {
                            interval: plan.interval
                        }
                    },
                    quantity: 1
                }
            ],
            mode: 'subscription',
            success_url: 'http://localhost:3050/sucesso?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3050/cancelado'
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Erro no checkout:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook para processar eventos do Stripe
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.WEBHOOK_SECRET
        );

        switch (event.type) {
            case 'invoice.payment_succeeded':
                console.log('Pagamento bem-sucedido:', event.data.object.customer);
                // Aqui você pode atualizar seu banco de dados
                break;

            case 'customer.subscription.created':
                console.log('Assinatura criada:', event.data.object.id);
                // Ativar acesso do usuário
                break;

            case 'customer.subscription.deleted':
                console.log('Assinatura cancelada:', event.data.object.id);
                // Revogar acesso do usuário
                break;

            case 'invoice.payment_failed':
                console.log('Pagamento falhou:', event.data.object.customer);
                // Notificar usuário
                break;

            default:
                console.log('Evento não tratado:', event.type);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Erro no webhook:', error);
        res.status(400).json({ error: 'Webhook error' });
    }
});

// Verificar status da subscription
app.get('/api/subscription/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.subscription) {
            const subscription = await stripe.subscriptions.retrieve(session.subscription);
            res.json({
                status: subscription.status,
                currentPeriodEnd: subscription.current_period_end,
                plan: subscription.items.data[0].plan.id
            });
        } else {
            res.status(404).json({ error: 'Assinatura não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`✓ Servidor KAIA rodando em http://localhost:${PORT}`);
    console.log(`✓ Stripe Key configurada: ${process.env.STRIPE_SECRET_KEY.substring(0, 20)}...`);
});
