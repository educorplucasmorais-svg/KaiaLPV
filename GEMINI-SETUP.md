# Configuração do Google Gemini AI

## 📋 Integração Completa

A integração do Gemini AI está configurada e pronta para gerar relatórios comportamentais personalizados usando o formato KAIA 5.0.

## 🔑 Obter API Key do Gemini

1. Acesse: https://makersuite.google.com/app/apikey
2. Clique em "Create API Key"
3. Copie a chave gerada

## ⚙️ Configurar no Projeto

Edite o arquivo `.env` e substitua:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Por:

```env
GEMINI_API_KEY=AIzaSy... (sua chave real)
```

## 🚀 Como Funciona

### 1. Fluxo Completo
- Usuário preenche nome, profissão, tempo de experiência
- Responde às 9 questões (DISC + Sabotadores + QP)
- Sistema gera prompt master estruturado
- **Chama automaticamente a API do Gemini**
- Exibe relatório completo em modal

### 2. Formato do Relatório Gerado

O Gemini gera um dossiê completo com:

```
🧠 DOSSIÊ DE AUDITORIA COMPORTAMENTAL: KAIA 5.0

1. MENTALIDADE E QP (INTELIGÊNCIA POSITIVA)
   - QP Estimado
   - Diagnóstico
   - Consequências

2. RAIO-X DOS SABOTADORES
   - Top 3 padrões identificados
   - Relação com as escolhas

3. PERFIL DISC INTEGRADO
   - Dominância
   - Sinergia com profissão
   - Conflitos potenciais

4. MATRIZ SWOT PESSOAL
   - Forças / Fraquezas
   - Oportunidades / Ameaças

5. PLANO DE AÇÃO 5W2H (21 DIAS)
   - Ações práticas
   - Roadmap estruturado

6. JSON DE BACKEND
```

### 3. Endpoints Criados

#### POST `/api/generate-report`
```javascript
// Request
{
  "prompt": "prompt master gerado",
  "userData": {
    "nome": "Lucas Silva",
    "profissao": "Gerente de Projetos",
    "tempoArea": "8 anos",
    "respostas": [...],
    "indices": {...},
    "sabotadores_contagem": {...}
  }
}

// Response
{
  "success": true,
  "report": "texto completo do relatório",
  "metadata": {
    "candidato": "Lucas Silva",
    "profissao": "Gerente de Projetos",
    "generated_at": "2025-12-24T..."
  }
}
```

## 💾 Armazenamento

Relatórios são salvos automaticamente na tabela `reports`:
- `user_name`: Nome do candidato
- `profession`: Profissão
- `report_text`: Texto completo gerado
- `created_at`: Data de criação

## 🧪 Testar Localmente

1. Configure a API key no `.env`
2. Reinicie o servidor:
```bash
npm run dev:api
```
3. Acesse `http://localhost:3001`
4. Preencha o formulário e complete o quiz
5. O relatório será gerado automaticamente e exibido em modal

## 📊 Console Debug

Durante o processo, você verá no console do navegador:
```
=== MASTER PROMPT PARA IA ===
(prompt estruturado)

=== DADOS ESTRUTURADOS ===
(JSON completo)

=== RELATÓRIO GERADO PELA IA ===
(output do Gemini)
```

## 🎯 Personalização do Prompt

O prompt master inclui:
- Dados do candidato (nome, profissão, experiência)
- QP calculado
- Perfil DISC dominante
- Top 3 sabotadores
- Todas as respostas detalhadas
- Contexto profissional

O Gemini usa isso para gerar análises ultra-personalizadas focadas na área específica do usuário.

## 🔒 Segurança

- API key armazenada em `.env` (nunca commitar)
- Rate limiting recomendado (adicionar middleware)
- Validação de entrada implementada
- CORS configurado para origens permitidas

## 📝 Próximos Passos

1. Obter API key gratuita do Gemini
2. Substituir no `.env`
3. Testar geração de relatórios
4. Ajustar prompt master conforme necessário
5. Adicionar rate limiting se necessário
