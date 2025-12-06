// Script de integração Stripe no Frontend
// Função global para checkout
const API_URL = 'http://localhost:3000/api';

let stripeInstance = null;

// Função para inicializar Stripe
function initStripe() {
    // Carregar Stripe
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    document.head.appendChild(script);

    script.onload = function() {
        // Substitua pela sua chave pública real
        const STRIPE_PUBLIC_KEY = 'pk_live_51SYv1GAM1vKTscTWr76wXB2BMa9F4qqt3yMrs2OHAO6XApwdlQcbpIDUPbFGuqgonmtkb9n2QpYnJSfqu5ddzIz0004InjTVPJ';

        if (STRIPE_PUBLIC_KEY.includes('sua_chave')) {
            console.warn('⚠ Configure a STRIPE_PUBLIC_KEY no stripe-integration.js');
        }

        if (typeof Stripe !== 'undefined') {
            stripeInstance = Stripe(STRIPE_PUBLIC_KEY);
            console.log('✓ Stripe carregado e pronto');
        }
    };
}// Função global de checkout
window.handleCheckout = async function(planId, planName) {
    console.log('handleCheckout chamado com:', planId, planName);
    
    if (!stripeInstance) {
        console.error('Stripe não inicializado ainda');
        alert('⏳ Aguarde um momento... Stripe está carregando.\n\nTente novamente em 2-3 segundos.');
        return;
    }

    const email = prompt('📧 Digite seu email:');
    if (!email || !email.includes('@')) {
        alert('❌ Email inválido. Por favor, tente novamente.');
        return;
    }

    const phone = prompt('📱 Digite seu WhatsApp (com DD, ex: 11987654321):');
    if (!phone || phone.length < 10) {
        alert('❌ WhatsApp inválido. Por favor, tente novamente.');
        return;
    }

    try {
        console.log('✓ Iniciando checkout para:', planName);
        
        const response = await fetch(`${API_URL}/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                planId, 
                email, 
                phone 
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao criar checkout');
        }

        const { sessionId } = await response.json();
        console.log('✓ Session criada:', sessionId);

        // Redirecionar para Stripe Checkout
        const { error } = await stripeInstance.redirectToCheckout({ sessionId });

        if (error) {
            alert('❌ Erro ao processar pagamento:\n' + error.message);
            console.error('Stripe error:', error);
        }
    } catch (error) {
        console.error('❌ Erro no checkout:', error);
        alert('❌ Erro ao processar: ' + error.message);
    }
};

// Verificar status após sucesso
window.checkSubscriptionStatus = async function(sessionId) {
    try {
        const response = await fetch(`${API_URL}/subscription/${sessionId}`);
        const data = await response.json();
        console.log('Status da assinatura:', data);
        
        if (data.status === 'active') {
            alert(' Assinatura ativa! Bem-vindo ao KAIA');
            // Redirecionar para dashboard
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        }
        
        return data;
    } catch (error) {
        console.error('Erro ao verificar assinatura:', error);
    }
};

// Se estiver na página de sucesso
if (window.location.pathname.includes('sucesso')) {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    
    if (sessionId) {
        console.log('Verificando assinatura...', sessionId);
        // Aguardar Stripe carregar
        setTimeout(() => {
            window.checkSubscriptionStatus(sessionId);
        }, 2000);
    }
}

// Inicializar Stripe quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStripe);
} else {
    initStripe();
}
