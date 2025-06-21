# 🧪 Testing Guide

Este projeto implementa uma estratégia abrangente de testes seguindo as melhores práticas de desenvolvimento sênior.

## 📋 Tipos de Testes

### 1. **Testes Unitários** (`__tests__/`)
- **Objetivo**: Testar componentes individuais isoladamente
- **Execução**: `npm run test:unit`
- **Cobertura**: Funções, métodos e classes específicas

### 2. **Testes de Integração** (`__tests__/integration/`)
- **Objetivo**: Testar fluxos completos e interação entre componentes
- **Execução**: `npm run test:integration`
- **Cobertura**: APIs, banco de dados, fluxos de autenticação

### 3. **Testes de Performance** (`__tests__/performance/`)
- **Objetivo**: Validar tempos de resposta e capacidade de carga
- **Execução**: `npm run test:performance`
- **Cobertura**: Latência, throughput, concorrência

### 4. **Testes de Contrato** (`__tests__/contract/`)
- **Objetivo**: Validar estrutura e formato das respostas da API
- **Execução**: Incluído nos testes unitários
- **Cobertura**: Schemas de request/response, headers HTTP

### 5. **Smoke Tests** (`__tests__/smoke/`)
- **Objetivo**: Verificações básicas de funcionamento (health checks)
- **Execução**: Incluído nos testes unitários
- **Cobertura**: Conectividade, rotas básicas, configuração

## 🚀 Comandos Disponíveis

### Execução de Testes
```bash
# Todos os testes
npm test

# Testes unitários apenas
npm run test:unit

# Testes de integração
npm run test:integration

# Testes de performance
npm run test:performance

# Todos os tipos de teste
npm run test:all

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch

# Testes para CI/CD
npm run test:ci
```

### Qualidade de Código
```bash
# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Formatação
npm run format
npm run format:check

# Auditoria de segurança
npm run security:audit

# Verificação pré-commit
npm run pre-commit
```

## 📊 Métricas de Cobertura

### Objetivos Mínimos
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Visualização
```bash
npm run test:coverage
# Abra: coverage/lcov-report/index.html
```

## 🔧 Configuração de Ambiente

### Variáveis de Teste
```env
NODE_ENV=test
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tomo_test
```

### Banco de Dados de Teste
O projeto usa um banco PostgreSQL separado para testes que é:
- Configurado automaticamente antes dos testes
- Limpo após cada teste
- Destruído após a execução completa

## 🏗️ CI/CD Pipeline

### GitHub Actions
O projeto inclui pipeline automatizado que executa:

1. **Qualidade de Código**
   - Linting (ESLint)
   - Type checking (TypeScript)
   - Formatação (Prettier)

2. **Segurança**
   - Audit de dependências
   - Verificação de vulnerabilidades

3. **Testes**
   - Testes unitários
   - Testes de integração
   - Testes de performance
   - Cobertura de código

4. **Build e Deploy**
   - Compilação TypeScript
   - Deploy automático (staging/production)
   - Smoke tests pós-deploy

### Matrix Testing
Testes executados em múltiplas versões do Node.js:
- Node.js 18.x
- Node.js 20.x

## 📝 Escrevendo Novos Testes

### Estrutura Padrão
```typescript
describe('Feature Name', () => {
  beforeAll(async () => {
    // Setup global para o conjunto de testes
  });

  beforeEach(async () => {
    // Setup antes de cada teste
  });

  afterEach(async () => {
    // Limpeza após cada teste
  });

  afterAll(async () => {
    // Limpeza global
  });

  describe('Specific Functionality', () => {
    it('should do something specific', async () => {
      // Arrange
      const input = 'test data';
      
      // Act
      const result = await functionUnderTest(input);
      
      // Assert
      expect(result).toBe('expected output');
    });
  });
});
```

### Boas Práticas

1. **Nomenclatura Clara**
   - Use descrições que expliquem o comportamento esperado
   - Prefira `should` em vez de `test` nas descrições

2. **Isolamento**
   - Cada teste deve ser independente
   - Use mocks para dependências externas

3. **Cobertura**
   - Teste casos de sucesso e falha
   - Inclua edge cases e validações

4. **Performance**
   - Mantenha testes rápidos (< 1s para unitários)
   - Use timeouts apropriados para testes de integração

## 🔍 Debugging

### Executar Teste Específico
```bash
npm test -- __tests__/auth.test.ts
npm test -- --testNamePattern="should login user"
```

### Debug Mode
```bash
npm test -- --detectOpenHandles --forceExit
```

### Logs Detalhados
```bash
npm test -- --verbose
```

## 📈 Métricas e Relatórios

### Coverage Report
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`
- **JSON**: `coverage/coverage-final.json`

### Performance Metrics
Os testes de performance verificam:
- Tempo de resposta < 1s para operações simples
- Tempo de resposta < 500ms para login
- Capacidade de handling de 10+ requests concorrentes

### CI Metrics
- Build time
- Test execution time
- Coverage trends
- Vulnerability reports

## 🚨 Troubleshooting

### Problemas Comuns

1. **Testes falhando por timeout**
   ```bash
   # Aumentar timeout para testes específicos
   jest.setTimeout(30000);
   ```

2. **Problemas de conexão com banco**
   - Verifique se PostgreSQL está rodando
   - Confirme as credenciais em DATABASE_URL

3. **Memory leaks**
   - Use `--detectOpenHandles` para identificar
   - Certifique-se de fechar conexões nos afterAll

4. **Testes flaky**
   - Adicione waits apropriados
   - Use mocks para timing dependente

## 📚 Recursos Adicionais

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [TypeScript Testing](https://typescript-eslint.io/docs/linting/type-linting/)

---

> 💡 **Dica**: Execute `npm run pre-commit` antes de fazer commit para garantir que todos os checks passem no CI/CD.
