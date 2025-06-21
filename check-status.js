#!/usr/bin/env node

/**
 * Script para verificar o status dos testes e do pipeline
 * Usage: node check-status.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando status do projeto Tomo API...\n');

// Verificar se estamos no diretório correto
const packagePath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packagePath)) {
  console.error('❌ Arquivo package.json não encontrado. Execute este script na raiz do projeto.');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
console.log(`📦 Projeto: ${packageJson.name} v${packageJson.version}\n`);

// Verificar status do Git
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  if (gitStatus.trim()) {
    console.log('⚠️  Há arquivos não commitados:');
    console.log(gitStatus);
  } else {
    console.log('✅ Repositório limpo - todos os arquivos commitados');
  }
  
  const lastCommit = execSync('git log -1 --oneline', { encoding: 'utf8' }).trim();
  console.log(`📝 Último commit: ${lastCommit}\n`);
} catch (error) {
  console.log('⚠️  Não foi possível verificar status do Git\n');
}

// Verificar dependências
try {
  console.log('📚 Verificando dependências...');
  execSync('npm ls --depth=0', { stdio: 'pipe' });
  console.log('✅ Todas as dependências estão instaladas\n');
} catch (error) {
  console.log('⚠️  Há problemas com as dependências. Execute: npm install\n');
}

// Executar linting
try {
  console.log('🔍 Executando verificação de lint...');
  const lintOutput = execSync('npm run lint', { encoding: 'utf8' });
  console.log('✅ Lint passou sem erros críticos\n');
} catch (error) {
  console.log('❌ Problemas de lint encontrados. Execute: npm run lint:fix\n');
}

// Executar verificação de tipos
try {
  console.log('🔧 Verificando tipos TypeScript...');
  execSync('npm run type-check', { stdio: 'pipe' });
  console.log('✅ Verificação de tipos passou\n');
} catch (error) {
  console.log('❌ Erros de tipos encontrados\n');
}

// Executar testes
try {
  console.log('🧪 Executando testes...');
  const testStart = Date.now();
  const testOutput = execSync('npm test', { encoding: 'utf8' });
  const testTime = Date.now() - testStart;
  
  // Extrair informações dos testes
  const testResults = testOutput.match(/Test Suites: (\d+) passed, (\d+) total/);
  const testCounts = testOutput.match(/Tests:\s+(\d+) passed, (\d+) total/);
  
  if (testResults && testCounts) {
    const [, passedSuites, totalSuites] = testResults;
    const [, passedTests, totalTests] = testCounts;
    
    console.log(`✅ Testes passaram: ${passedTests}/${totalTests} testes em ${passedSuites}/${totalSuites} suítes`);
    console.log(`⏱️  Tempo de execução: ${(testTime / 1000).toFixed(2)}s\n`);
  } else {
    console.log('✅ Testes executados com sucesso\n');
  }
} catch (error) {
  console.log('❌ Alguns testes falharam\n');
  process.exit(1);
}

// Verificar arquivos importantes
const importantFiles = [
  '.github/workflows/ci-cd.yml',
  'jest.config.ts',
  'eslint.config.js',
  'tsconfig.json',
  'TESTING.md',
  'DEPLOYMENT.md'
];

console.log('📁 Verificando arquivos importantes...');
importantFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - AUSENTE`);
  }
});

console.log('\n🎉 Verificação concluída!');
console.log('\n💡 Para verificar o status do CI/CD:');
console.log('   - Acesse: https://github.com/Diottodev/tomo-api/actions');
console.log('   - Ou instale o GitHub CLI: gh run list');

console.log('\n🚀 Comandos úteis:');
console.log('   npm test                 # Executar todos os testes');
console.log('   npm run test:coverage    # Executar com cobertura');
console.log('   npm run lint:fix         # Corrigir problemas de lint');
console.log('   npm run test:integration # Apenas testes de integração');
