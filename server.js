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
// Serve SPA assets under /app to avoid overriding the root landing page
app.use('/app', express.static(path.join(__dirname, 'frontend/dist')));

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
    console.log('✓ Tabelas base garantidas (users/subscriptions/payments/reports)');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error.message);
  }
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});
// Serve KAIA LPV landing page at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
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

// Start server
app.listen(PORT, async () => {
  console.log(`✓ Servidor KAIA rodando em http://localhost:${PORT}`);
  console.log('✓ Stripe configurado');
  
  await initializeDatabase();
  console.log('✓ Conectado ao MySQL');
});
