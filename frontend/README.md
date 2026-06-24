# 🎨 iFlow — Frontend Web (Next.js)

Este é o ecossistema de interface do **iFlow**, uma plataforma moderna e responsiva voltada para o registro e acompanhamento de ocorrências acadêmicas. O frontend foi desenvolvido utilizando práticas modernas de arquitetura de componentes, desacoplamento de serviços e controle rígido de sessões por nível de acesso (RBAC).

---

## 🚀 Tecnologias e Ferramentas Utilizadas

* **Framework Principal:** Next.js (App Router) com TypeScript.
* **Estilização & Componentes:** Tailwind CSS + Flowbite React (UI limpa, moderna e responsiva).
* **Animações de Interface:** Framer Motion (Transições fluidas de estado e animações na Navbar).
* **Ícones:** React Icons (Pacote Hi - Heroicons).
* **Comunicação com a API:** Axios (Instância centralizada com interceptors).

---
## 📐 Design e Prototipagem (Figma)

O desenvolvimento da interface foi totalmente guiado pelo protótipo de alta fidelidade construído no Figma, garantindo consistência visual, escolha assertiva da paleta de cores institucional e design focado na experiência do usuário (UX).

* 🔗 **[Acessar Protótipo do iFlow no Figma](https://figma.com/design/f5LjbE5Gqy4mk1byAqGe5d/iflow)**
* **Componentização:** A estrutura de blocos e cards do Figma foi convertida em componentes reutilizáveis no Next.js utilizando o ecossistema do Tailwind e Flowbite, respeitando os grids responsivos planejados para dispositivos móveis e desktops.
---
## ⚙️ Arquitetura de Software & Padrões

### 1. Autenticação e Guarda de Rotas (Middleware)
O sistema implementa autenticação baseada em tokens JWT armazenados com segurança no `localStorage` sob a chave `auth_token`. 
* **`src/middleware.ts`:** Intercepta as requisições de rotas para garantir que usuários não autenticados sejam redirecionados ao `/login`.
* **`AuthContext.tsx`:** Provedor global que expõe o estado do usuário logado, suas permissões e funções de controle de sessão (`login`, `logout`).

### 2. Controle de Acesso Baseado em Funções (RBAC)
A interface se adapta dinamicamente ao nível de privilégio do usuário logado (`admin`, `professor`, `aluno`, `responsavel`). 
A **Navbar flutuante** filtra de forma cirúrgica quais botões de ação e visualização devem ser renderizados usando mapeamento lógico de papéis (*roles*).

### 3. Blindagem contra Hydration Mismatch (SSR/CSR)
Para evitar conflitos de renderização e inconsistência de dados (como formatação de fusos horários e datas vindas da API entre o Servidor Node e o Navegador), todos os Dashboards críticos utilizam uma trava de montagem de ciclo de vida (`montado: boolean`), garantindo estabilidade visual completa e eliminação de travamentos de Hydration.

---

## 📁 Estrutura de Pastas do Módulo

```text
src/
├── app/
│   ├── login/                  # Tela de Autenticação com tratamento de CORS
│   ├── historico-ocorrencias/  # Listagem blindada com filtro global de busca
│   ├── dashboard/
│   │   ├── admin/              # Controle de perfis e métricas gerais em tempo real
│   │   ├── professor/          # Visão de lançamentos recentes e atalhos rápidos
│   │   ├── aluno/              # Ficha comportamental com Timeline cronológica
│   │   └── responsavel/        # Mapeamento de dependentes e validação de abas
│   ├── layout.tsx              # Estrutura global e injeção do Provedor de Autenticação
│   └── page.tsx                # Redirecionador inteligente de Home
├── components/                 # Componentes reutilizáveis (Navbar, ListaUsuarios, etc.)
├── contexts/                   # Context API para gerenciamento de Estados Globais
└── services/
    └── api.ts                  # Instância centralizada do Axios para consumo do NestJS

```

---

## 🔄 Consumo de Endpoints Integrados (NestJS)

O frontend consome ativamente a API Restful do iFlow. As principais integrações finalizadas incluem:

* `POST /auth/login` -> Inicialização de sessão e persistência do token.
* `GET /ocorrencias?limit=50` -> Alimentação da tabela geral com paginação implícita e headers de autenticação (`Bearer Token`).
* `GET /ocorrencias/dashboard` -> Agregação de métricas de dados analíticos (`total`, `pendentes`, `taxaResolucao`) renderizados nos cards dinâmicos do Admin e Professor.
* `GET /aluno/ocorrencias` -> Captura da cronologia comportamental do estudante logado.
* `GET /responsavel/ocorrencias` -> Resgate dos registros pedagógicos vinculados aos dependentes cadastrados (Tratado com resiliência a falhas HTTP 404).

---

## 🔧 Como Executar o Projeto Localmente

1. Entre no diretório correspondente ao frontend:
```bash
cd front

```


2. Instale as dependências mapeadas no `package.json`:
```bash
npm install

```


3. Configure o arquivo de variáveis de ambiente (`.env.local`) apontando para a URL da sua API:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001

```


4. Inicie o servidor de desenvolvimento local:
```bash
npm run dev

```


5. Abra [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) no seu navegador.

---

## 🔀 Boas Práticas de versionamento adotadas

O gerenciamento do código-fonte segue estritamente a convenção de **Conventional Commits** para manter o histórico claro e auditável:

* `feat(nome-modulo):` Para introdução de novas telas ou integrações de API.
* `fix(modulo):` Para correções de tipagens TypeScript ou bugs estruturais de HTML.
* `ui/ux:` Ajustes de alinhamentos, grids e espaçamentos com base no Figma.

---
