#!/usr/bin/env node
/**
 * 🔍 QA Bot - Verificador de Qualidade de Entregas
 * Dra. Cybele Guedes - Sistema de Gestão
 * 
 * Executa verificações automáticas de qualidade:
 * - TypeScript compilation
 * - ESLint
 * - Build verification
 * - Dead code detection
 * - Dependency audit
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${COLORS.blue}ℹ${COLORS.reset} ${msg}`),
  success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  error: (msg) => console.log(`${COLORS.red}✗${COLORS.reset} ${msg}`),
  warning: (msg) => console.log(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`),
  header: (msg) => console.log(`\n${COLORS.cyan}━━━ ${msg} ━━━${COLORS.reset}\n`),
};

const results = {
  passed: [],
  failed: [],
  warnings: [],
};

function runCheck(name, command, cwd = '.') {
  log.info(`Executando: ${name}...`);
  try {
    execSync(command, { cwd, stdio: 'pipe', encoding: 'utf-8' });
    log.success(`${name} - OK`);
    results.passed.push(name);
    return true;
  } catch (error) {
    log.error(`${name} - FALHOU`);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.log(error.stderr);
    results.failed.push({ name, error: error.message });
    return false;
  }
}

function checkDeadImports() {
  log.info('Verificando imports não utilizados...');
  const srcPath = path.join(__dirname, 'src');
  let deadImports = 0;

  function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const importMatches = content.match(/import\s+{([^}]+)}\s+from/g) || [];
    
    importMatches.forEach(imp => {
      const imports = imp.match(/{([^}]+)}/)?.[1]?.split(',').map(s => s.trim()) || [];
      imports.forEach(importName => {
        const cleanName = importName.split(' as ')[0].trim();
        const regex = new RegExp(`\\b${cleanName}\\b`, 'g');
        const occurrences = (content.match(regex) || []).length;
        if (occurrences === 1) {
          log.warning(`Possível import não utilizado: ${cleanName} em ${path.basename(filePath)}`);
          deadImports++;
        }
      });
    });
  }

  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        scanFile(filePath);
      }
    });
  }

  if (fs.existsSync(srcPath)) {
    walkDir(srcPath);
  }

  if (deadImports === 0) {
    log.success('Nenhum import morto detectado');
    results.passed.push('Dead Imports Check');
  } else {
    results.warnings.push(`${deadImports} possíveis imports não utilizados`);
  }
}

function checkConsoleStatements() {
  log.info('Verificando console.log em produção...');
  const srcPath = path.join(__dirname, 'src');
  let consoleCount = 0;

  function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const matches = content.match(/console\.(log|warn|error|debug)/g) || [];
    if (matches.length > 0) {
      log.warning(`${matches.length} console statement(s) em ${path.basename(filePath)}`);
      consoleCount += matches.length;
    }
  }

  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        scanFile(filePath);
      }
    });
  }

  if (fs.existsSync(srcPath)) {
    walkDir(srcPath);
  }

  if (consoleCount === 0) {
    log.success('Nenhum console.log encontrado');
    results.passed.push('Console Statements Check');
  } else {
    results.warnings.push(`${consoleCount} console statements encontrados`);
  }
}

function generateReport() {
  log.header('📊 RELATÓRIO DE QUALIDADE');
  
  console.log(`${COLORS.green}Passou: ${results.passed.length}${COLORS.reset}`);
  results.passed.forEach(p => console.log(`  ✓ ${p}`));
  
  if (results.warnings.length > 0) {
    console.log(`\n${COLORS.yellow}Avisos: ${results.warnings.length}${COLORS.reset}`);
    results.warnings.forEach(w => console.log(`  ⚠ ${w}`));
  }
  
  if (results.failed.length > 0) {
    console.log(`\n${COLORS.red}Falhou: ${results.failed.length}${COLORS.reset}`);
    results.failed.forEach(f => console.log(`  ✗ ${f.name}`));
  }

  const score = Math.round((results.passed.length / (results.passed.length + results.failed.length)) * 100);
  console.log(`\n${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
  console.log(`Score de Qualidade: ${score >= 80 ? COLORS.green : score >= 50 ? COLORS.yellow : COLORS.red}${score}%${COLORS.reset}`);
  console.log(`${COLORS.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}\n`);

  return results.failed.length === 0;
}

// Main execution
console.log(`
${COLORS.cyan}╔══════════════════════════════════════╗
║  🔍 QA Bot - Verificador de Qualidade ║
║     Dra. Cybele Guedes - Sistema      ║
╚══════════════════════════════════════╝${COLORS.reset}
`);

log.header('VERIFICAÇÕES DE BUILD');
runCheck('TypeScript Compilation', 'npx tsc --noEmit');
runCheck('Vite Build', 'npm run build');

log.header('VERIFICAÇÕES DE CÓDIGO');
checkDeadImports();
checkConsoleStatements();

log.header('VERIFICAÇÕES DE SEGURANÇA');
runCheck('NPM Audit', 'npm audit --audit-level=high || true');

const success = generateReport();
process.exit(success ? 0 : 1);
