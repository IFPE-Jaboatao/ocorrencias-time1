# IFlow API

## Sobre

O backend do iFlow é uma API RESTful desenvolvida com NestJS, estruturada seguindo princípios de arquitetura modular, separação de responsabilidades e boas práticas de segurança e escalabilidade.

A API é responsável por toda a lógica de negócio do sistema, incluindo:

- **Autenticação e Autorização:** Implementação de JWT e estratégias de segurança.
- **Controle de Acesso (RBAC):** Gestão de permissões baseada em perfis de usuário.
- **Gerenciamento de Ocorrências:** Lógica central para registro, edição e fluxo de status das ocorrências acadêmicas.

---

## Tecnologias e versões

| Tecnologia                      | Versão            |
| ------------------------------- | ----------------- |
| **Node.js**                     | v20.x ou superior |
| **NestJS** (`@nestjs/core`)     | v10.0.0           |
| **TypeScript**                  | v5.1.3            |
| **TypeORM**                     | v0.3.28           |
| **MySQL** (`mysql2`)            | v3.22.2           |
| **JWT** (`@nestjs/jwt`)         | v11.0.2           |
| **Multer**                      | v2.1.1            |
| **Swagger** (`@nestjs/swagger`) | v7.4.2            |
| **Jest**                        | v29.7.0           |
| **Class Validator**             | v0.15.1           |

---

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

- Node.js (versão 20 ou superior)
- NPM
- Uma instância ativa do MySQL

---

## Instalação e primeiros passos

### 1. Clone o repositório
```bash
https://github.com/IFPE-Jaboatao/ocorrencias-time1.git
```

### 2. Pré-requisitos
- Copie o arquivo .env.example e renomeie a cópia para .env.
- Edite o arquivo .env com as configurações necessárias para o seu ambiente.

### 3. Configure o banco de dados
- Inicie uma instância MySQL (local, em nuvem ou via Docker).
- Certifique-se de que as credenciais de conexão sejam as mesmas definidas no arquivo .env.

### 4. Acesse a pasta do projeto
```bash
cd backend
```

### 5. Instale as dependências
```bash
npm install
```

---

## Executando localmente

Para iniciar o servidor em modo de desenvolvimento com atualização automática (watch mode):

```bash
npm run start:dev
```

A aplicação estará disponível em: `http://localhost:3000`

---

## Documentação da API

A API utiliza Swagger para documentação automática. Com o servidor rodando, você pode testar os endpoints e visualizar os schemas em:

`http://localhost:3000/api`

---

## Testes `(em desenvolvimento)`
O projeto utiliza o framework **Jest** para garantir a qualidade do código.

**Executar testes unitários:**

```bash
npm run test
```

**Executar testes com relatório de cobertura (Coverage):**

```bash
npm run test:cov
```

---

## Deploy

Para preparar a aplicação para o ambiente de produção:

### 1. Gerar build (compilação TypeScript para JS)

```bash
npm run build
```

### 2. Iniciar versão de produção

```bash
npm run start:prod
```
