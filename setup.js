#!/usr/bin/env node

/**
 * Script de Setup Inicial
 * Configura o ambiente e verifica dependências
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║       🤖 WhatsApp Bot Negociador - Setup                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);

// Verificar versão do Node.js
function checkNodeVersion() {
  console.log('📌 Verificando versão do Node.js...');
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
  
  if (majorVersion < 16) {
    console.error('❌ Erro: Node.js 16+ é necessário. Versão atual:', nodeVersion);
    process.exit(1);
  }
  
  console.log('✅ Node.js', nodeVersion, '(OK)\n');
}

// Verificar se npm está instalado
function checkNpm() {
  console.log('📌 Verificando npm...');
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log('✅ npm', npmVersion, '(OK)\n');
  } catch (error) {
    console.error('❌ Erro: npm não encontrado');
    process.exit(1);
  }
}

// Criar arquivo .env se não existir
function setupEnvFile() {
  console.log('📌 Configurando arquivo .env...');
  
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');
  
  if (fs.existsSync(envPath)) {
    console.log('ℹ️  Arquivo .env já existe (mantido)\n');
    return;
  }
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Arquivo .env criado a partir do .env.example\n');
    console.log('⚠️  IMPORTANTE: Altere a senha padrão no arquivo .env\n');
  } else {
    console.warn('⚠️  Aviso: .env.example não encontrado\n');
  }
}

// Verificar se node_modules existe
function checkDependencies() {
  console.log('📌 Verificando dependências...');
  
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Instalando dependências (isso pode levar alguns minutos)...\n');
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('\n✅ Dependências instaladas com sucesso\n');
    } catch (error) {
      console.error('❌ Erro ao instalar dependências');
      process.exit(1);
    }
  } else {
    console.log('✅ Dependências já instaladas\n');
  }
}

// Verificar estrutura de diretórios
function checkDirectories() {
  console.log('📌 Verificando estrutura de diretórios...');
  
  const requiredDirs = [
    'src',
    'src/bot',
    'src/public'
  ];
  
  let allOk = true;
  requiredDirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
      console.error(`❌ Diretório ausente: ${dir}`);
      allOk = false;
    }
  });
  
  if (allOk) {
    console.log('✅ Estrutura de diretórios OK\n');
  } else {
    console.error('\n❌ Estrutura de diretórios incompleta');
    process.exit(1);
  }
}

// Verificar arquivos essenciais
function checkEssentialFiles() {
  console.log('📌 Verificando arquivos essenciais...');
  
  const requiredFiles = [
    'package.json',
    'src/server.js',
    'src/bot/whatsapp-bot.js',
    'src/bot/negotiation-flow.js',
    'src/public/index.html',
    'src/public/styles.css',
    'src/public/app.js'
  ];
  
  let allOk = true;
  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Arquivo ausente: ${file}`);
      allOk = false;
    }
  });
  
  if (allOk) {
    console.log('✅ Todos os arquivos essenciais presentes\n');
  } else {
    console.error('\n❌ Arquivos essenciais ausentes');
    process.exit(1);
  }
}

// Exibir informações finais
function showFinalInstructions() {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║       ✅ Setup Concluído com Sucesso!                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

📚 PRÓXIMOS PASSOS:

1️⃣  Inicie o servidor:
   npm start
   
2️⃣  Acesse o dashboard:
   http://localhost:3000 (ou a porta definida no .env)
   
3️⃣  Credenciais:
   Usuário: valor de DASHBOARD_USER no .env
   Senha : valor de DASHBOARD_PASSWORD no .env
   
4️⃣  Escaneie o QR Code com seu WhatsApp

⚠️  IMPORTANTE:
   - Altere a senha padrão no arquivo .env
   - Leia o README.md para informações completas
   - Veja SECURITY.md para práticas de segurança

📖 DOCUMENTAÇÃO:
   README.md         - Documentação completa
   QUICK_START.md    - Guia rápido
   SECURITY.md       - Segurança
   CONTRIBUTING.md   - Como contribuir

🐛 PROBLEMAS?
   - Consulte a seção Troubleshooting no README.md
   - Abra uma issue no GitHub

Boa sorte com o desafio! 🚀
`);
}

// Executar setup
async function runSetup() {
  try {
    checkNodeVersion();
    checkNpm();
    checkDirectories();
    checkEssentialFiles();
    setupEnvFile();
    checkDependencies();
    showFinalInstructions();
  } catch (error) {
    console.error('\n❌ Erro durante o setup:', error.message);
    process.exit(1);
  }
}

// Executar
runSetup();

