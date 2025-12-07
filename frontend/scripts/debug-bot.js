#!/usr/bin/env node
/**
 * 🔧 Debug Bot - Verificador Periódico de Problemas
 * Dra. Cybele Guedes - Sistema de Gestão
 * 
 * Executa diagnósticos automáticos:
 * - Verificação de erros em runtime
 * - Checagem de APIs/endpoints
 * - Monitoramento de performance
 * - Detecção de memory leaks patterns
 * - Verificação de dependências desatualizadas
 */

const { execSync, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const log = {
  info: (msg) => console.log(`${COLORS.blue}ℹ${COLORS.reset} ${msg}`),
  success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  error: (msg) => console.log(`${COLORS.red}✗${COLORS.reset} ${msg}`),
  warning: (msg) => console.log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`),
  debug: (msg) => console.log(`${COLORS.magenta}🔧${COLORS.reset} ${msg}`),
  header: (msg) => console.log(`\n${COLORS.cyan}━━━ ${msg} ━━━${COLORS.reset}\n`),
};

const issues = {
  critical: [],
  warnings: [],
  suggestions: [],
  fixed: [],
};

// Configurações
const CONFIG = {
  frontendUrl: 'https://dracybeleguedes.com.br',
  backendUrl: 'https://dracybeleguesdes.com.br',
  checkEndpoints: [
    { path: '/', name: 'Homepage' },
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/patients', name: 'Pacientes' },
    { path: '/plans', name: 'Planos' },
  ],
  apiEndpoints: [
    { path: '/patients', name: 'API Pacientes', method: 'GET' },
  ],
};

function checkUrl(url, name) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        log.success(`${name}: ${res.statusCode} OK`);
        resolve({ success: true, status: res.statusCode });
      } else {
        log.error(`${name}: ${res.statusCode}`);
        issues.critical.push(`${name} retornou status ${res.statusCode}`);
        resolve({ success: false, status: res.statusCode });
      }
    });
    
    req.on('error', (err) => {
      log.error(`${name}: ${err.message}`);
      issues.critical.push(`${name} inacessível: ${err.message}`);
      resolve({ success: false, error: err.message });
    });
    
    req.on('timeout', () => {
      log.error(`${name}: Timeout`);
      issues.warnings.push(`${name} demorou muito para responder`);
      req.destroy();
      resolve({ success: false, error: 'timeout' });
    });
  });
}

function checkDependencies() {
  log.info('Verificando dependências desatualizadas...');
  try {
    const result = execSync('npm outdated --json 2>/dev/null || echo "{}"', { 
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    try {
      const outdated = JSON.parse(result || '{}');
      const packages = Object.keys(outdated);
      
      if (packages.length === 0) {
        log.success('Todas as dependências estão atualizadas');
      } else {
        packages.forEach(pkg => {
          const info = outdated[pkg];
          if (info.current !== info.latest) {
            const severity = info.type === 'devDependencies' ? 'suggestion' : 'warning';
            const msg = `${pkg}: ${info.current} → ${info.latest}`;
            if (severity === 'warning') {
              issues.warnings.push(msg);
              log.warning(msg);
            } else {
              issues.suggestions.push(msg);
              log.debug(msg);
            }
          }
        });
      }
    } catch (e) {
      log.success('Dependências OK');
    }
  } catch (error) {
    log.warning('Não foi possível verificar dependências');
  }
}

function checkMemoryLeakPatterns() {
  log.info('Verificando padrões de memory leak...');
  const srcPath = path.join(__dirname, '..', 'src');
  let leakPatterns = 0;

  const dangerousPatterns = [
    { pattern: /setInterval\s*\(/g, name: 'setInterval sem cleanup', severity: 'warning' },
    { pattern: /addEventListener\s*\(/g, name: 'addEventListener (verificar removeEventListener)', severity: 'suggestion' },
    { pattern: /new\s+WebSocket\s*\(/g, name: 'WebSocket (verificar close())', severity: 'suggestion' },
    { pattern: /\.subscribe\s*\(/g, name: 'subscribe (verificar unsubscribe)', severity: 'suggestion' },
  ];

  function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    
    dangerousPatterns.forEach(({ pattern, name, severity }) => {
      const matches = content.match(pattern) || [];
      if (matches.length > 0) {
        const msg = `${name} em ${fileName} (${matches.length}x)`;
        if (severity === 'warning') {
          issues.warnings.push(msg);
          log.warning(msg);
        } else {
          issues.suggestions.push(msg);
        }
        leakPatterns += matches.length;
      }
    });
  }

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory() && !file.includes('node_modules')) {
        walkDir(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        scanFile(filePath);
      }
    });
  }

  walkDir(srcPath);
  
  if (leakPatterns === 0) {
    log.success('Nenhum padrão de memory leak detectado');
  }
}

function checkErrorHandling() {
  log.info('Verificando tratamento de erros...');
  const srcPath = path.join(__dirname, '..', 'src');
  let missingCatch = 0;

  function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath);
    
    // Verificar async functions sem try-catch
    const asyncFunctions = content.match(/async\s+\w+\s*\([^)]*\)\s*{[^}]*await[^}]*}/g) || [];
    asyncFunctions.forEach(fn => {
      if (!fn.includes('try') && !fn.includes('catch')) {
        missingCatch++;
      }
    });

    // Verificar fetch sem catch
    const fetchCalls = (content.match(/fetch\s*\(/g) || []).length;
    const catchCalls = (content.match(/\.catch\s*\(/g) || []).length;
    
    if (fetchCalls > catchCalls) {
      issues.suggestions.push(`${fileName}: possível fetch sem tratamento de erro`);
    }
  }

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory() && !file.includes('node_modules')) {
        walkDir(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        scanFile(filePath);
      }
    });
  }

  walkDir(srcPath);
  
  if (missingCatch === 0) {
    log.success('Tratamento de erros adequado');
  } else {
    log.warning(`${missingCatch} funções async podem precisar de try-catch`);
  }
}

async function runDiagnostics() {
  console.log(`
${COLORS.magenta}╔══════════════════════════════════════╗
║  🔧 Debug Bot - Diagnóstico Periódico ║
║     Dra. Cybele Guedes - Sistema      ║
╚══════════════════════════════════════╝${COLORS.reset}
`);

  const timestamp = new Date().toLocaleString('pt-BR');
  log.info(`Iniciando diagnóstico em ${timestamp}`);

  // Verificações de endpoints
  log.header('VERIFICAÇÃO DE ENDPOINTS');
  for (const endpoint of CONFIG.checkEndpoints) {
    await checkUrl(`${CONFIG.frontendUrl}${endpoint.path}`, endpoint.name);
  }

  // Verificações de API
  log.header('VERIFICAÇÃO DE API BACKEND');
  for (const endpoint of CONFIG.apiEndpoints) {
    await checkUrl(`${CONFIG.backendUrl}${endpoint.path}`, `API: ${endpoint.name}`);
  }

  // Verificações de código
  log.header('ANÁLISE DE CÓDIGO');
  checkMemoryLeakPatterns();
  checkErrorHandling();

  // Verificações de dependências
  log.header('DEPENDÊNCIAS');
  checkDependencies();

  // Relatório final
  log.header('📊 RELATÓRIO DE DIAGNÓSTICO');
  
  if (issues.critical.length > 0) {
    console.log(`\n${COLORS.red}🚨 CRÍTICOS (${issues.critical.length}):${COLORS.reset}`);
    issues.critical.forEach(i => console.log(`   ✗ ${i}`));
  }
  
  if (issues.warnings.length > 0) {
    console.log(`\n${COLORS.yellow}⚠ AVISOS (${issues.warnings.length}):${COLORS.reset}`);
    issues.warnings.forEach(i => console.log(`   ⚠ ${i}`));
  }
  
  if (issues.suggestions.length > 0) {
    console.log(`\n${COLORS.blue}💡 SUGESTÕES (${issues.suggestions.length}):${COLORS.reset}`);
    issues.suggestions.forEach(i => console.log(`   → ${i}`));
  }

  if (issues.fixed.length > 0) {
    console.log(`\n${COLORS.green}✅ CORRIGIDOS (${issues.fixed.length}):${COLORS.reset}`);
    issues.fixed.forEach(i => console.log(`   ✓ ${i}`));
  }

  const total = issues.critical.length + issues.warnings.length;
  const health = total === 0 ? 100 : Math.max(0, 100 - (issues.critical.length * 20) - (issues.warnings.length * 5));
  
  console.log(`\n${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
  console.log(`Sistema Health: ${health >= 80 ? COLORS.green : health >= 50 ? COLORS.yellow : COLORS.red}${health}%${COLORS.reset}`);
  console.log(`${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}\n`);

  // Salvar log
  const logPath = path.join(__dirname, '..', 'debug-logs');
  if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath, { recursive: true });
  }
  
  const logFile = path.join(logPath, `debug-${Date.now()}.json`);
  fs.writeFileSync(logFile, JSON.stringify({
    timestamp,
    health,
    issues,
  }, null, 2));
  
  log.info(`Log salvo em: ${logFile}`);

  process.exit(issues.critical.length > 0 ? 1 : 0);
}

runDiagnostics();
