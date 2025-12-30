require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const axios = require('axios');
const path = require('path');
const crypto = require('crypto');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// KAIA landing page path
const KAIA_LANDING_PAGE = path.join(__dirname, 'index.html');

// Serve KAIA LPV landing page at root and /app
app.get(['/', '/app'], (req, res) => {
  res.sendFile(KAIA_LANDING_PAGE);
});

// Serve KAIA landing page image (file is .jpg but referenced as .png in HTML)
app.get('/image_18.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'image_18.png.jpg'));
});

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kaia',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Initialize database tables
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create subscriptions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        plan VARCHAR(50),
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    
    // Create payments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        amount DECIMAL(10, 2),
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create single-use test tokens table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS test_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        token VARCHAR(64) UNIQUE NOT NULL,
        email VARCHAR(255),
        status ENUM('unused','used') DEFAULT 'unused',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        used_at TIMESTAMP NULL
      )
    `);

    // Create KAIA 5.0 sequential tokens table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS kaia_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sequential_number INT UNIQUE NOT NULL,
        email VARCHAR(255),
        name VARCHAR(255),
        status ENUM('available','assigned','used','expired') DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        assigned_at TIMESTAMP NULL,
        used_at TIMESTAMP NULL
      )
    `);

    // Create KAIA 5.0 test sessions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS kaia_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        token_id INT NOT NULL,
        user_name VARCHAR(255),
        user_email VARCHAR(255),
        current_state ENUM('auth','disc','sabotadores','qp','report') DEFAULT 'auth',
        disc_answers JSON,
        sabotadores_answers JSON,
        qp_answers JSON,
        final_report LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        FOREIGN KEY (token_id) REFERENCES kaia_tokens(id)
      )
    `);

    // Create reports table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_name VARCHAR(255),
        profession VARCHAR(255),
        report_text LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    connection.release();
    console.log('✓ Tabelas base garantidas (users/subscriptions/payments/reports/kaia_tokens/kaia_sessions)');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error.message);
  }
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// SPA fallback for frontend/dist when navigating client-side routes
// Fallback for SPA routes under /app (works with Express 5)
app.use('/app', (req, res, next) => {
  if (req.method !== 'GET') return next();
  // If no static file matched, serve the SPA index
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.post('/api/subscribe', async (req, res) => {
  const { email, plan } = req.body;
  try {
    const connection = await pool.getConnection();
    
    // Insert or update user
    await connection.execute(
      'INSERT INTO users (email, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)',
      [email, email.split('@')[0]]
    );
    
    // Get user and create subscription
    const [users] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length > 0) {
      await connection.execute(
        'INSERT INTO subscriptions (user_id, plan, status) VALUES (?, ?, ?)',
        [users[0].id, plan, 'active']
      );
    }
    
    connection.release();
    res.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscription error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook placeholder
app.post('/webhook/stripe', (req, res) => {
  res.json({ received: true });
});

// Generate a single-use test link (to be called after purchase/checkout)
// Body: { email?: string }
app.post('/api/test-token', async (req, res) => {
  const { email } = req.body || {};
  const token = crypto.randomBytes(24).toString('hex');
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO test_tokens (token, email, status) VALUES (?, ?, ?)',
      [token, email || null, 'unused']
    );
    connection.release();

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const testLink = `${baseUrl}/?token=${token}`;
    res.json({ success: true, token, testLink });
  } catch (error) {
    console.error('Error generating test token:', error.message);
    res.status(500).json({ success: false, error: 'Failed to generate token' });
  }
});

// Consume a single-use test token
// Body: { token: string }
app.post('/api/consume-token', async (req, res) => {
  const { token } = req.body || {};
  if (!token) {
    return res.status(400).json({ allowed: false, error: 'Token is required' });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT id, status FROM test_tokens WHERE token = ? LIMIT 1',
      [token]
    );

    if (!rows || rows.length === 0) {
      connection.release();
      return res.status(404).json({ allowed: false, error: 'Invalid token' });
    }

    const tokenRow = rows[0];
    if (tokenRow.status !== 'unused') {
      connection.release();
      return res.status(410).json({ allowed: false, error: 'Token already used' });
    }

    await connection.execute(
      "UPDATE test_tokens SET status = 'used', used_at = NOW() WHERE id = ?",
      [tokenRow.id]
    );
    connection.release();
    return res.json({ allowed: true });
  } catch (error) {
    console.error('Error consuming token:', error.message);
    return res.status(500).json({ allowed: false, error: 'Failed to consume token' });
  }
});

// Generate AI Report using Google Gemini
app.post('/api/generate-report', async (req, res) => {
  const { prompt, userData } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ success: false, error: 'Prompt is required' });
  }

  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // System instruction for consistent formatting
    const systemContext = `Você é um especialista em análise comportamental baseado nas metodologias de Shirzad Chamine (Inteligência Positiva), DISC e Análise de Sabotadores. 
Gere relatórios profissionais detalhados em português com estrutura formal e insights acionáveis.
Use o formato exato do dossiê KAIA 5.0 fornecido como exemplo.`;

    const fullPrompt = `${systemContext}\n\n${prompt}`;

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const reportText = response.text();

    // Store report in database
    try {
      const connection = await pool.getConnection();
      await connection.execute(
        `INSERT INTO reports (user_name, profession, report_text, created_at) 
         VALUES (?, ?, ?, NOW())`,
        [userData?.nome || 'Anônimo', userData?.profissao || 'N/A', reportText]
      );
      connection.release();
    } catch (dbError) {
      console.warn('Failed to store report in DB:', dbError.message);
    }

    res.json({
      success: true,
      report: reportText,
      metadata: {
        candidato: userData?.nome,
        profissao: userData?.profissao,
        generated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating AI report:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate report',
      details: error.message
    });
  }
});

// ============================================
// KAIA 5.0 - SECURE LOGIN EDITION ENDPOINTS
// ============================================

// KAIA 5.0 System Prompt
const KAIA_SYSTEM_PROMPT = `[INÍCIO DO PROMPT DO SISTEMA: KAIA 5.0 - SECURE LOGIN EDITION]

1. PERSONA E MISSÃO
Você é a KAIA 5.0 (Knowledge & Artificial Intelligence Auditor), sistema de auditoria comportamental de alta segurança.

2. REGRAS DE OURO (HARD RULES)
- GERAÇÃO DINÂMICA: Jamais repita perguntas. Crie cenários inéditos.
- FLUXO UNITÁRIO: Envie estritamente 1 pergunta por vez.
- LEGENDA PERSISTENTE (UX): Nas fases de escala (Sabotadores/QP), exiba a legenda (1-5) ao final de cada pergunta.
- Responda sempre em português brasileiro.

3. ROTEIRO DE EXECUÇÃO (MÁQUINA DE ESTADOS)

ESTADO 1: FASE DISC (Comportamental)
Formato: 10 Perguntas Situacionais (1 por vez).
Mecânica: 4 Alternativas (A, B, C, D) separadas por linhas em branco.
UX: Avise: "Escolha a alternativa que descreve sua natureza. Não há certo ou errado."
Fim da Fase: Gere o RELATÓRIO PARCIAL DISC (Gráfico ASCII + Perfil).

ESTADO 2: FASE SABOTADORES (Inimigos Internos)
Formato: 10 Afirmações (1 por vez).
REGRA DE LEGENDA: Adicione ao final de CADA pergunta:
(Escala: 1 = Discordo Totalmente | 5 = Concordo Totalmente)
Mecânica: Frases inéditas mapeando os 10 Sabotadores.
Fim da Fase: Gere o RELATÓRIO PARCIAL SABOTADORES.

ESTADO 3: FASE QP (Inteligência Positiva)
Formato: 10 Cenários de Crise (1 por vez).
REGRA DE LEGENDA: Adicione ao final de CADA pergunta:
(Escala: 1 = Reação Negativa/Lenta | 5 = Reação Sábia/Rápida)
Fim da Fase: Gere o RELATÓRIO PARCIAL QP.

ESTADO 4: O DOSSIÊ FINAL (Entrega)
Gere o relatório completo diagramado em Markdown.
Conteúdo Obrigatório:
- Cabeçalho: Dados do usuário.
- Triangulação: DISC x Sabotadores.
- Ishikawa & SWOT Cruzada.
- Plano de Ação 5W2H.

4. BLINDAGEM DE FOCO
Se o usuário tentar desviar: "⚠️ Alerta de Sistema: Protocolo de auditoria em andamento. Mantenha o foco na questão."

[FIM DO PROMPT]`;

// Generate sequential KAIA tokens (Admin endpoint - requires admin key)
app.post('/api/kaia/generate-tokens', async (req, res) => {
  const { count = 10, adminKey } = req.body;
  
  // Basic admin authentication
  const expectedAdminKey = process.env.KAIA_ADMIN_KEY || 'kaia-admin-2024';
  if (adminKey !== expectedAdminKey) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }
  
  // Validate count
  const tokenCount = parseInt(count);
  if (isNaN(tokenCount) || tokenCount < 1 || tokenCount > 100) {
    return res.status(400).json({ success: false, error: 'Count must be between 1 and 100' });
  }
  
  try {
    const connection = await pool.getConnection();
    
    // Get the last sequential number
    const [lastToken] = await connection.execute(
      'SELECT MAX(sequential_number) as last_num FROM kaia_tokens'
    );
    
    let startNum = (lastToken[0]?.last_num || 0) + 1;
    const generatedTokens = [];
    
    for (let i = 0; i < tokenCount; i++) {
      const seqNum = startNum + i;
      await connection.execute(
        'INSERT INTO kaia_tokens (sequential_number, status) VALUES (?, ?)',
        [seqNum, 'available']
      );
      generatedTokens.push(seqNum);
    }
    
    connection.release();
    res.json({
      success: true,
      message: `Generated ${count} tokens`,
      tokens: generatedTokens,
      range: { from: startNum, to: startNum + count - 1 }
    });
  } catch (error) {
    console.error('Error generating KAIA tokens:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Assign token to user after purchase
app.post('/api/kaia/assign-token', async (req, res) => {
  const { email, name } = req.body;
  
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }
  
  try {
    const connection = await pool.getConnection();
    
    // Get next available token
    const [available] = await connection.execute(
      'SELECT id, sequential_number FROM kaia_tokens WHERE status = ? ORDER BY sequential_number ASC LIMIT 1',
      ['available']
    );
    
    if (!available || available.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, error: 'No tokens available' });
    }
    
    const token = available[0];
    
    // Assign to user
    await connection.execute(
      'UPDATE kaia_tokens SET email = ?, name = ?, status = ?, assigned_at = NOW() WHERE id = ?',
      [email, name || null, 'assigned', token.id]
    );
    
    connection.release();
    res.json({
      success: true,
      token: token.sequential_number,
      email: email,
      message: `Token ${token.sequential_number} assigned to ${email}`
    });
  } catch (error) {
    console.error('Error assigning KAIA token:', error.message);
    res.status(500).json({ success: false, error: 'Erro ao atribuir token' });
  }
});

// Validate token for KAIA 5.0 test access
app.post('/api/kaia/validate-token', async (req, res) => {
  const { token, email, name } = req.body;
  
  if (!token || !email || !name) {
    return res.status(400).json({ 
      success: false, 
      error: 'Token, email and name are required' 
    });
  }
  
  // Validate token is a valid number
  const tokenNumber = parseInt(token);
  if (isNaN(tokenNumber) || tokenNumber < 1) {
    return res.status(400).json({ 
      success: false, 
      error: 'Token deve ser um número válido' 
    });
  }
  
  try {
    const connection = await pool.getConnection();
    
    // Find the token
    const [tokens] = await connection.execute(
      'SELECT id, sequential_number, email, status FROM kaia_tokens WHERE sequential_number = ?',
      [tokenNumber]
    );
    
    if (!tokens || tokens.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, error: 'Token inválido' });
    }
    
    const tokenData = tokens[0];
    
    // Check if already used
    if (tokenData.status === 'used') {
      connection.release();
      return res.status(410).json({ success: false, error: 'Token já utilizado' });
    }
    
    // Check if assigned to this email (if assigned)
    if (tokenData.status === 'assigned' && tokenData.email !== email) {
      connection.release();
      return res.status(403).json({ success: false, error: 'Token não corresponde ao email cadastrado' });
    }
    
    // Mark as used
    await connection.execute(
      'UPDATE kaia_tokens SET status = ?, used_at = NOW(), email = ?, name = ? WHERE id = ?',
      ['used', email, name, tokenData.id]
    );
    
    // Create session
    const [sessionResult] = await connection.execute(
      'INSERT INTO kaia_sessions (token_id, user_name, user_email, current_state) VALUES (?, ?, ?, ?)',
      [tokenData.id, name, email, 'disc']
    );
    
    connection.release();
    
    res.json({
      success: true,
      sessionId: sessionResult.insertId,
      user: { name, email },
      message: `✅ Acesso Autorizado. Bem-vindo(a), ${name}!`
    });
  } catch (error) {
    console.error('Error validating KAIA token:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// KAIA 5.0 Chat - Send message and get AI response
app.post('/api/kaia/chat', async (req, res) => {
  const { sessionId, message, conversationHistory = [] } = req.body;
  
  if (!sessionId || !message) {
    return res.status(400).json({ success: false, error: 'Session ID and message required' });
  }
  
  try {
    // Initialize Gemini AI - API key must be set in environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(503).json({ success: false, error: 'Serviço de IA não configurado' });
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Build conversation context
    const conversationContext = conversationHistory.map(msg => 
      `${msg.role === 'user' ? 'Usuário' : 'KAIA'}: ${msg.content}`
    ).join('\n');
    
    const fullPrompt = `${KAIA_SYSTEM_PROMPT}

HISTÓRICO DA CONVERSA:
${conversationContext}

Usuário: ${message}

KAIA 5.0:`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const kaiaResponse = response.text();
    
    res.json({
      success: true,
      response: kaiaResponse,
      sessionId
    });
  } catch (error) {
    console.error('Error in KAIA chat:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Erro ao processar mensagem'
    });
  }
});

// Get session state
app.get('/api/kaia/session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  
  try {
    const connection = await pool.getConnection();
    const [sessions] = await connection.execute(
      'SELECT * FROM kaia_sessions WHERE id = ?',
      [sessionId]
    );
    connection.release();
    
    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    
    res.json({ success: true, session: sessions[0] });
  } catch (error) {
    console.error('Error getting session:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve KAIA 5.0 test page
app.get('/teste-kaia', (req, res) => {
  res.sendFile(path.join(__dirname, 'kaia-test.html'));
});

// Start server
app.listen(PORT, async () => {
  console.log(`✓ Servidor KAIA rodando em http://localhost:${PORT}`);
  console.log('✓ Stripe configurado');
  
  await initializeDatabase();
  console.log('✓ Conectado ao MySQL');
});
