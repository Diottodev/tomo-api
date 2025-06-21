# 🔐 Tomo Auth API

API de Autenticação Segura com validação rigorosa de senhas e documentação interativa.

---

## 🚀 Descrição

Este projeto implementa uma API robusta para registro e autenticação de usuários, utilizando validação e autenticação JWT. Inclui requisitos rigorosos de segurança de senhas e tratamento completo de erros.

## ✨ Principais Recursos

- 🔒 **Validação de senhas** (8+ caracteres, maiúscula, número, especial)
- 🎯 **Validação com Zod** para entrada de dados segura
- 🔑 **Autenticação JWT** para proteção de rotas
- 📚 **Documentação** em /docs
- 🧪 **Testes abrangentes** com Jest
- 🏗️ **Arquitetura limpa** baseada em DDD

---

## 🛠️ Tecnologias

- [Fastify](https://www.fastify.io/) - Framework web rápido e eficiente
- [Zod](https://zod.dev/) - Validação de schemas TypeScript-first
- [Knex.js](https://knexjs.org/) - Query builder SQL
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados
- [JWT](https://jwt.io/) - Tokens de autenticação
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Jest](https://jestjs.io/) - Framework de testes

## 📋 Requisitos de Senha

Para garantir segurança, as senhas devem atender aos seguintes critérios:

- ✅ Mínimo de **8 caracteres**
- ✅ Pelo menos **1 letra maiúscula**
- ✅ Pelo menos **1 número**
- ✅ Pelo menos **1 caractere especial** (!@#$%^&* etc.)

## 🚀 Como Usar

### 1. Instalação

```bash
npm install
```

### 2. Configuração

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/tomo_auth
JWT_SECRET=seu_jwt_secret_super_seguro
PORT=8080
```

### 3. Executar Migrações

```bash
npm run migrate
```

### 4. Iniciar Servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

### 5. Acessar Documentação

Abra o navegador em: [http://localhost:8080/docs](http://localhost:8080/docs)

## 📡 Endpoints

| Método | Endpoint    | Descrição                      | Autenticação |
|--------|-------------|--------------------------------|--------------|
| POST   | `/register` | Registrar novo usuário         | ❌           |
| POST   | `/login`    | Fazer login e obter token      | ❌           |
| GET    | `/profile`  | Obter dados do usuário         | ✅           |
| GET    | `/docs`     | Documentação                   | ❌           |

## 🧪 Executar Testes

```bash
npm test
```

## 🔗 Integração Frontend

### Exemplo com Axios (React/Vue/Angular)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Registro
const register = async (email, password) => {
  const response = await api.post('/register', { email, password });
  return response.data;
};

// Login
const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  localStorage.setItem('authToken', response.data.token);
  return response.data;
};

// Perfil (rota protegida)
const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};
```

### Exemplo com Fetch (Vanilla JS)

```javascript
// Login
async function login(email, password) {
  const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  localStorage.setItem('authToken', data.token);
  return data;
}

// Acessar rota protegida
async function getProfile() {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  return await response.json();
}
```

## 🏗️ Arquitetura (Domain-Driven Design)

O projeto segue os princípios do **Domain-Driven Design (DDD)** com uma arquitetura limpa e bem definida:

```
src/
├── app/
│   ├── factories/          # Factories para Dependency Injection
│   └── use-cases/          # Casos de uso (aplicação)
├── domain/
│   ├── entities/           # Entidades de domínio
│   ├── value-objects/      # Value Objects
│   ├── repositories/       # Interfaces de repositórios
│   └── services/           # Serviços de domínio
├── infra/
│   ├── db/                 # Configuração do banco
│   ├── hash/               # Implementação de hash
│   ├── repositories/       # Implementações dos repositórios
│   └── services/           # Implementações dos serviços
├── interfaces/
│   └── http/              # Controllers, rotas e middlewares
├── schemas/               # Validações Zod (entrada de dados)
└── utils/                 # Utilitários
```

### Camadas da Arquitetura

#### **Domain (Domínio)**
- **Entities**: `UserEntity` - Representação do usuário no domínio
- **Value Objects**: `Email`, `Password` - Objetos imutáveis com validação
- **Repositories**: `UserRepository` - Interface para persistência
- **Services**: `UserDomainService` - Regras de negócio complexas

#### **Application (Aplicação)**
- **Use Cases**: `registerUser`, `authenticateUser` - Orquestração de domínio
- **Factories**: `ServiceFactory` - Dependency Injection

#### **Infrastructure (Infraestrutura)**
- **Repositories**: `DatabaseUserRepository` - Implementação com Knex
- **Services**: `BcryptHashService` - Implementação de hash

#### **Interfaces (Interface)**
- **HTTP**: Controllers, rotas, middlewares e documentação

### Benefícios da Arquitetura

- ✅ **Separação de responsabilidades** clara
- ✅ **Independência de frameworks** no domínio
- ✅ **Testabilidade** alta com interfaces bem definidas
- ✅ **Flexibilidade** para mudanças de infraestrutura
- ✅ **Reutilização** de regras de domínio
- ✅ **Manutenibilidade** e escalabilidade

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit suas mudanças: `git commit -m 'Add nova feature'`
4. Push para a branch: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido por [DiottoDev](https://github.com/DiottoDev) para segurança e praticidade**
