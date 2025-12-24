require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Serve KAIA LPV landing page at root (must be before static middleware)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve KAIA landing page at /app as well
app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
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
    
    connection.release();
    console.log('✓ Tabelas base garantidas (users/subscriptions/payments)');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error.message);
  }
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
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

// Start server
app.listen(PORT, async () => {
  console.log(`✓ Servidor KAIA rodando em http://localhost:${PORT}`);
  console.log('✓ Stripe configurado');
  
  await initializeDatabase();
  console.log('✓ Conectado ao MySQL');
});
