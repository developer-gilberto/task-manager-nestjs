# Task Manager API

API RESTful construída com Nest.js para criar um sistema de gestão de projetos e tarefas, onde:
- Equipes podem criar projetos e atribuir tarefas aos membros.
- Colaboradores podem ser adicionados ou removidos de um projeto.
- Colaboradores podem comentar e colaborar nas tarefas.
- Gestores podem acompanhar o progresso (status: To Do → In Progress → Done).

## Tecnologias

- **Framework:** NestJS (Node.js)
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Autenticação:** JWT (Passport)
- **Validação:** class-validator / class-transformer
- **Documentação:** Swagger (OpenAPI)
- **Filas:** RabbitMQ (para envio de emails)
- **Cloud:** Cloudinary (upload de imagens)
- **Email:** Nodemailer (com template Handlebars)
- **Testes:** Jest
- **Linting:** Biome

## Pré-requisitos

- Node.js (v22+)
- pnpm (gerenciador de pacotes)
- Docker e Docker Compose
- PostgreSQL (ou use o Docker)
- RabbitMQ (ou use o Docker)
- Cloudinary (opcional, para upload de avatars)

## Instalação

### 1. Clonar o projeto

```bash
git clone https://github.com/developer-gilberto/task-manager-nestjs.git
cd task-manager-nestjs
```

### 2. Criar arquivo .env

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

### 3. Configurar variáveis de ambiente

Edite o arquivo `.env` com suas configurações:

```env
# Banco de Dados
DATABASE_URL=postgresql://postgres:1234@localhost:5432/db-task-manager?schema=public
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1234
POSTGRES_DB=db-task-manager

# JWT
JWT_SECRET=your-secret-jwt

# Ambiente
NODE_ENV=development

# SMTP (Email)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

# URL Base da API
BASE_URL=http://localhost:3000/api/v1
RESET_PASSWORD_PATH=/auth/reset-password

# RabbitMQ
RABBITMQ_URL=amqp://rabbitmq_user:rabbitmq_password@localhost:5672
RABBITMQ_DEFAULT_USER=rabbitmq_user
RABBITMQ_DEFAULT_PASSWORD=rabbitmq_password

# Cloudinary (Opcional)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 4. Iniciar serviços Docker (PostgreSQL e RabbitMQ)

```bash
docker-compose up -d
```

Isso irá iniciar:

- PostgreSQL na porta 5432
- RabbitMQ na porta 5672 (e painel web em 15672)

### 5. Instalar dependências

```bash
pnpm install
```

### 6. Gerar o Prisma Client

```bash
pnpm prisma:generate
```

### 7. Executar migrations

```bash
pnpm prisma:migrate
```

## Executar o projeto

```bash
# Desenvolvimento (com hot-reload)
pnpm run start:dev

# Produção
pnpm run start:prod
```

A API estará disponível em: `http://localhost:3000/api/v1`

## Documentação Swagger

Acesse a documentação interativa em:

- **v1:** `http://localhost:3000/api/v1/docs`
- **v2:** `http://localhost:3000/api/v2/docs`

## Estrutura de Diretórios

```
src/
├── app.module.ts             # Módulo principal
├── main.ts                   # Entry point
├── constants.ts              # Constantes globais
├── prisma.service.ts         # Serviço Prisma
├── modules/
│   ├── auth/                 # Autenticação (signin, signup, JWT)
│   ├── users/                # Gerenciamento de usuários
│   ├── projects/             # Gerenciamento de projetos
│   ├── tasks/                # Gerenciamento de tarefas
│   ├── comments/             # Comentários em tarefas
│   ├── collaborators/        # Colaboradores de projetos
│   └── mail/                 # Envio de emails (RabbitMQ)
├── common/
│   ├── decorators/           # Decoradores customizados
│   ├── dtos/                 # DTOs compartilhados
│   ├── guards/               # Guards (JWT Auth)
│   ├── interceptors/         # Interceptadores
│   ├── services/             # Serviços compartilhados
│   └── swagger/              # Configurações Swagger
└── generated/
    └── prisma/               # Prisma Client gerado
```

## Endpoints Disponíveis

### Health Check

| Método | Endpoint  | Descrição              |
| ------ | --------- | ---------------------- |
| GET    | `/api/v1` | Health check da API v1 |
| GET    | `/api/v2` | Health check da API v2 |

---

### Auth (Autenticação)

| Método | Endpoint                       | Descrição                           |
| ------ | ------------------------------ | ----------------------------------- |
| POST   | `/api/v1/auth/signup`          | Criar nova conta                    |
| POST   | `/api/v1/auth/signin`          | Login (retorna JWT)                 |
| GET    | `/api/v1/auth/protected`       | Rota protegida (teste JWT)          |
| GET    | `/api/v1/auth/me`              | Obter dados do usuário logado       |
| POST   | `/api/v1/auth/forgot-password` | Solicitar redefinição de senha      |
| POST   | `/api/v1/auth/reset-password`  | Redefinir senha com token           |
| PUT    | `/api/v1/auth/change-password` | Alterar senha (requer autenticação) |

#### Exemplos de Requisição

**Signup:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "USER"
  }'
```

**Signin:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Forgot Password:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'
```

**Reset Password:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your-reset-token",
    "new_password": "newpassword123"
  }'
```

**Change Password (autenticado):**

```bash
curl -X PUT http://localhost:3000/api/v1/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "current_password": "oldpassword123",
    "new_password": "newpassword123"
  }'
```

---

### Users (Usuários)

| Método | Endpoint                 | Descrição                           |
| ------ | ------------------------ | ----------------------------------- |
| GET    | `/api/v1/users`          | Listar todos os usuários (paginado) |
| GET    | `/api/v1/users/:user_id` | Obter usuário por ID                |
| POST   | `/api/v1/users`          | Criar novo usuário                  |
| PUT    | `/api/v1/users/:user_id` | Atualizar usuário                   |
| DELETE | `/api/v1/users/:user_id` | Deletar usuário                     |
| POST   | `/api/v1/users/avatar`   | Upload de avatar                    |

#### Exemplos de Requisição

**Listar Usuários:**

```bash
curl -X GET "http://localhost:3000/api/v1/users?page=1&limit=10" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Criar Usuário:**

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "role": "USER"
  }'
```

**Atualizar Usuário:**

```bash
curl -X PUT http://localhost:3000/api/v1/users/<USER_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "name": "Jane Updated",
    "role": "ADMIN"
  }'
```

**Deletar Usuário:**

```bash
curl -X DELETE http://localhost:3000/api/v1/users/<USER_ID> \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Upload Avatar:**

```bash
curl -X POST http://localhost:3000/api/v1/users/avatar \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "file=@avatar.jpg"
```

---

### Projects (Projetos)

| Método | Endpoint                       | Descrição                           |
| ------ | ------------------------------ | ----------------------------------- |
| GET    | `/api/v1/projects`             | Listar todos os projetos (paginado) |
| GET    | `/api/v1/projects/:project_id` | Obter projeto por ID                |
| POST   | `/api/v1/projects`             | Criar novo projeto                  |
| PUT    | `/api/v1/projects/:project_id` | Atualizar projeto                   |
| DELETE | `/api/v1/projects/:project_id` | Deletar projeto                     |

#### Exemplos de Requisição

**Listar Projetos:**

```bash
curl -X GET "http://localhost:3000/api/v1/projects?page=1&limit=10" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Criar Projeto:**

```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "name": "Meu Projeto",
    "description": "Descrição do projeto"
  }'
```

**Obter Projeto (com tarefas):**

```bash
curl -X GET http://localhost:3000/api/v1/projects/<PROJECT_ID> \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Atualizar Projeto:**

```bash
curl -X PUT http://localhost:3000/api/v1/projects/<PROJECT_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "name": "Projeto Atualizado",
    "description": "Nova descrição"
  }'
```

**Deletar Projeto:**

```bash
curl -X DELETE http://localhost:3000/api/v1/projects/<PROJECT_ID> \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

### Tasks (Tarefas)

| Método | Endpoint                                      | Descrição                 |
| ------ | --------------------------------------------- | ------------------------- |
| GET    | `/api/v1/projects/:project_id/tasks`          | Listar tarefas do projeto |
| GET    | `/api/v1/projects/:project_id/tasks/:task_id` | Obter tarefa por ID       |
| POST   | `/api/v1/projects/:project_id/tasks`          | Criar nova tarefa         |
| PUT    | `/api/v1/projects/:project_id/tasks/:task_id` | Atualizar tarefa          |
| DELETE | `/api/v1/projects/:project_id/tasks/:task_id` | Deletar tarefa            |

#### Exemplos de Requisição

**Criar Tarefa:**

```bash
curl -X POST http://localhost:3000/api/v1/projects/<PROJECT_ID>/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "title": "Minha Tarefa",
    "description": "Descrição da tarefa",
    "status": "TO_DO",
    "priority": "HIGH",
    "due_date": "2026-12-31T23:59:59Z"
  }'
```

**Listar Tarefas:**

```bash
curl -X GET "http://localhost:3000/api/v1/projects/<PROJECT_ID>/tasks?page=1&limit=10" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Obter Tarefa (com comentários):**

```bash
curl -X GET http://localhost:3000/api/v1/projects/<PROJECT_ID>/tasks/<TASK_ID> \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Atualizar Tarefa:**

```bash
curl -X PUT http://localhost:3000/api/v1/projects/<PROJECT_ID>/tasks/<TASK_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "title": "Tarefa Atualizada",
    "status": "IN_PROGRESS",
    "priority": "MEDIUM"
  }'
```

**Deletar Tarefa:**

```bash
curl -X DELETE http://localhost:3000/api/v1/projects/<PROJECT_ID>/tasks/<TASK_ID> \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### Enum Values

**TaskStatus:**

- `TO_DO`
- `IN_PROGRESS`
- `DONE`

**TaskPriority:**

- `LOW`
- `MEDIUM`
- `HIGH`

---

### Comments (Comentários)

| Método | Endpoint                                                           | Descrição            |
| ------ | ------------------------------------------------------------------ | -------------------- |
| GET    | `/api/v1/projects/:project_id/tasks/:task_id/comments`             | Listar comentários   |
| GET    | `/api/v1/projects/:project_id/tasks/:task_id/comments/:comment_id` | Obter comentário     |
| POST   | `/api/v1/projects/:project_id/tasks/:task_id/comments`             | Criar comentário     |
| PUT    | `/api/v1/projects/:project_id/tasks/:task_id/comments/:comment_id` | Atualizar comentário |
| DELETE | `/api/v1/projects/:project_id/tasks/:task_id/comments/:comment_id` | Deletar comentário   |

#### Exemplos de Requisição

**Criar Comentário:**

```bash
curl -X POST http://localhost:3000/api/v1/projects/<PROJECT_ID>/tasks/<TASK_ID>/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"content": "Este é um comentário"}'
```

**Listar Comentários:**

```bash
curl -X GET "http://localhost:3000/api/v1/projects/<PROJECT_ID>/tasks/<TASK_ID>/comments?page=1&limit=10" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Atualizar Comentário:**

```bash
curl -X PUT http://localhost:3000/api/v1/projects/<PROJECT_ID>/tasks/<TASK_ID>/comments/<COMMENT_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"content": "Comentário atualizado"}'
```

**Deletar Comentário:**

```bash
curl -X DELETE http://localhost:3000/api/v1/projects/<PROJECT_ID>/tasks/<TASK_ID>/comments/<COMMENT_ID> \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

### Collaborators (Colaboradores)

| Método | Endpoint                                              | Descrição                       |
| ------ | ----------------------------------------------------- | ------------------------------- |
| GET    | `/api/v1/projects/:project_id/collaborators`          | Listar colaboradores            |
| POST   | `/api/v1/projects/:project_id/collaborators`          | Adicionar colaborador           |
| PUT    | `/api/v1/projects/:project_id/collaborators/:user_id` | Atualizar função do colaborador |
| DELETE | `/api/v1/projects/:project_id/collaborators/:user_id` | Remover colaborador             |

#### Exemplos de Requisição

**Adicionar Colaborador:**

```bash
curl -X POST http://localhost:3000/api/v1/projects/<PROJECT_ID>/collaborators \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "user_id": "<USER_ID>",
    "role": "EDITOR"
  }'
```

**Listar Colaboradores:**

```bash
curl -X GET "http://localhost:3000/api/v1/projects/<PROJECT_ID>/collaborators?page=1&limit=10" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Atualizar Função:**

```bash
curl -X PUT http://localhost:3000/api/v1/projects/<PROJECT_ID>/collaborators/<USER_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"role": "VIEWER"}'
```

**Remover Colaborador:**

```bash
curl -X DELETE http://localhost:3000/api/v1/projects/<PROJECT_ID>/collaborators/<USER_ID> \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### Enum Values

**CollaboratorRole:**

- `VIEWER` - Apenas visualização
- `EDITOR` - Pode editar
- `OWNER` - Proprietário

---

## Arquitetura

O projeto segue os princípios do **Domain-Driven Design (DDD)** e utiliza a estrutura modular do NestJS:

```
src/
├── modules/              # Módodos de negócio
│   ├── auth/             # Autenticação e autorização
│   ├── users/            # CRUD de usuários
│   ├── projects/         # CRUD de projetos
│   ├── tasks/            # CRUD de tarefas
│   ├── comments/         # Comentários
│   ├── collaborators/    # Colaboradores
│   └── mail/             # Envio de emails async
├── common/               # Código compartilhado
│   ├── decorators/       # Decoradores customizados
│   ├── guards/           # Guards de autenticação
│   ├── interceptors/     # Interceptadores
│   ├── dtos/             # DTOs de paginação
│   └── services/         # Serviços (Cloudinary, RequestContext)
└── generated/            # Prisma Client
```

### Padrões Utilizados

- **DTOs (Data Transfer Objects):** Para validação e transformação de dados
- **Services:** Lógica de negócio
- **Controllers:** Recebem requisições e delegam aos services
- **Guards:** Proteção de rotas (JWT)
- **Interceptors:** Transformação de resposta
- **Decorators:** Meta-informação em endpoints
- **Pagination:** Cursor-based pagination

## Comandos Úteis

```bash
# Development com hot-reload
pnpm run start:dev

# Build para produção
pnpm run build

# Executar migrations
pnpm prisma:migrate

# Gerar Prisma Client
pnpm prisma:generate

# Linting
pnpm run lint

# Testes unitários
pnpm run test

# Testes com coverage
pnpm run test:cov

# Testes E2E
pnpm run test:e2e
```

## Banco de Dados

### Modelos

- **User** - Usuários do sistema
- **Project** - Projetos criados por usuários
- **Task** - Tarefas pertencentes a projetos
- **Comment** - Comentários em tarefas
- **ProjectCollaborator** - Colaboradores de projetos

### Visualizar Banco com Prisma Studio

```bash
pnpm exec prisma studio
```

## Variáveis de Ambiente

| Variável                | Descrição                         |
| ----------------------- | --------------------------------- |
| `DATABASE_URL`          | String de conexão PostgreSQL      |
| `JWT_SECRET`            | Chave secreta para JWT            |
| `NODE_ENV`              | Ambiente (development/production) |
| `SMTP_HOST`             | Host do servidor SMTP             |
| `SMTP_PORT`             | Porta do servidor SMTP            |
| `SMTP_USER`             | Usuário SMTP                      |
| `SMTP_PASS`             | Senha SMTP                        |
| `RABBITMQ_URL`          | URL de conexão RabbitMQ           |
| `CLOUDINARY_CLOUD_NAME` | Nome cloud Cloudinary             |
| `CLOUDINARY_API_KEY`    | API Key Cloudinary                |
| `CLOUDINARY_API_SECRET` | API Secret Cloudinary             |
| `FRONTEND_URL`          | URL do frontend (para emails)     |

## 🧑‍💻 Desenvolvedor

Feito com ❤️ por **Gilberto Lopes** Full Stack Developer.

### Saiba mais sobre o desenvolvedor

- Email: developer.gilberto@gmail.com
- [Site pessoal](https://gilbertolopes.dev)
- [LinkedIn](https://linkedin.com/in/gilbertolopes-dev)
- [GitHub](https://github.com/developer-gilberto)
- [Instagran](https://www.instagram.com/developer.gilberto/)
