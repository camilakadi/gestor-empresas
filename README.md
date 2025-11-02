# Gestor de Empresas

Sistema de gestão e visualização de empresas desenvolvido com Next.js e Material-UI.

## 🚀 Funcionalidades

- 📋 Listagem de empresas cadastradas
- ➕ Cadastro de novas empresas
- 🔍 Busca automática de dados por CNPJ
- 📍 Busca automática de endereço por CEP
- 💰 Visualização de rendimento das empresas
- ✅ Validação de formulários em tempo real

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- npm
- Variáveis de ambiente configuradas (ver seção [Configuração](#-configuração))

## 🛠️ Instalação

1. Clone o repositório:

```bash
git clone https://github.com/camilakadi/gestor-empresas.git
cd gestor-empresas
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente (veja a seção [Configuração](#-configuração))

## ⚙️ Configuração

Crie um arquivo `.env.local` na raiz do projeto e copie as variáves de ambiente do arquivo `.env.example`.

Cole o seu token na variável `NEXT_PUBLIC_API_TOKEN`.

## 🏃 Como Rodar

### Modo Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000)

### Modo Produção

1. Build do projeto:

```bash
npm run build
```

2. Inicie o servidor:

```bash
npm start
```

## 🧪 Testes

### Testes End-to-End com Cypress

O projeto inclui testes E2E automatizados com Cypress que cobrem:

- Listagem de empresas e abertura de modal de rendimento
- Cadastro de empresas com busca automática de CNPJ
- Validações de formulário
- Formatação automática de campos (CNPJ, CEP)

#### Executar Testes

**Modo Interativo (Recomendado para desenvolvimento):**

```bash
npm run cypress:open
```

Abre a interface gráfica do Cypress onde você pode ver e executar os testes individualmente.

**Modo Headless (CI/CD):**

```bash
npm run cypress:run
```

Executa todos os testes em modo headless (sem interface gráfica).

**Alias:**

```bash
npm run test:e2e
```

#### Pré-requisitos para os Testes

Antes de executar os testes, certifique-se de que:

1. O servidor de desenvolvimento está rodando (`npm run dev`)
2. As variáveis de ambiente estão configuradas corretamente

Os testes usam mocks das APIs, então não dependem de serviços externos reais.

## 📁 Estrutura do Projeto

```
gestor-empresas/
├── src/
│   ├── app/              # Configurações do App Router
│   │   ├── theme/        # Tema Material-UI
│   │   └── globals.css   # Estilos globais
│   ├── components/       # Componentes React
│   │   ├── CompanyCard.tsx
│   │   ├── RendimentoModal.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── pages/            # Páginas da aplicação
│   │   ├── index.tsx     # Listagem de empresas
│   │   ├── cadastro.tsx  # Formulário de cadastro
│   │   ├── _app.tsx      # Configuração do app
│   │   └── _document.tsx # Documento HTML
│   ├── types/            # Definições de tipos TypeScript
│   │   └── company.ts
│   └── utils/            # Funções utilitárias
│       └── formatters.ts # Formatadores de CNPJ e CEP
├── cypress/              # Testes E2E
│   ├── e2e/              # Arquivos de teste
│   ├── fixtures/         # Dados de teste
│   └── support/          # Comandos e configurações
├── public/               # Arquivos estáticos
├── .env.example          # Exemplo de variáveis de ambiente
├── cypress.config.ts     # Configuração do Cypress
└── package.json
```

## 🛠️ Tecnologias Utilizadas

- **Next.js 16** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Material-UI (MUI) 7** - Componentes de interface
- **Cypress** - Testes end-to-end
- **ESLint** - Linting de código

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter
- `npm run cypress:open` - Abre o Cypress em modo interativo
- `npm run cypress:run` - Executa testes em modo headless
- `npm run test:e2e` - Alias para cypress:run

## 🔧 Funcionalidades Técnicas

- Arrow functions em todos os componentes
- Uso de `useCallback` e `useMemo` para otimização
- Validação de CNPJ com algoritmo de dígitos verificadores
- Formatação automática de CNPJ e CEP
- Busca automática de endereço via ViaCEP
- Busca de dados da empresa via API de CNPJ

## 📄 Licença

Este projeto foi desenvolvido por Camila para o teste da empresa Arkmeds.
