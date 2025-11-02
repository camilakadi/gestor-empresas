# Testes End-to-End com Cypress

## Executando os Testes

### Modo Interativo (Recomendado para desenvolvimento)
```bash
npm run cypress:open
```

Isso abrirá a interface gráfica do Cypress onde você pode:
- Ver todos os testes
- Executar testes individuais
- Ver o navegador executando os testes em tempo real
- Debugar problemas

### Modo Headless (CI/CD)
```bash
npm run cypress:run
```

Executa todos os testes em modo headless (sem interface gráfica).

### Comando Alias
```bash
npm run test:e2e
```

## Estrutura dos Testes

### `empresas.cy.ts`
Testa o fluxo de listagem de empresas:
- ✅ Listagem de cards de empresas
- ✅ Abertura da modal ao clicar em um card
- ✅ Exibição do rendimento na modal
- ✅ Fechamento da modal
- ✅ Loading durante carregamento

### `cadastro.cy.ts`
Testa o fluxo de cadastro de empresas:
- ✅ Preenchimento manual do formulário
- ✅ Busca de CNPJ pela API
- ✅ Preenchimento automático após buscar CNPJ
- ✅ Formatação automática de CNPJ e CEP
- ✅ Validação de campos obrigatórios
- ✅ Mensagem de sucesso após cadastro
- ✅ Tratamento de erros na busca de CNPJ
- ✅ Conversão automática de estado para maiúsculas

## Pré-requisitos

1. **Servidor de desenvolvimento rodando:**
   ```bash
   npm run dev
   ```

2. **Variáveis de ambiente configuradas:**
   Certifique-se de ter o arquivo `.env.local` com as variáveis necessárias.

## Configuração

O Cypress está configurado para:
- Base URL: `http://localhost:3000`
- Viewport: 1280x720
- Vídeos desabilitados (para economizar espaço)
- Screenshots habilitados em caso de falha

## Mocks e Interceptações

Os testes usam `cy.intercept()` para mockar as APIs:
- API de listagem de empresas
- API de busca de rendimento
- API de busca de CNPJ
- API do ViaCEP
- API de cadastro de empresas

Isso garante que os testes sejam rápidos, consistentes e não dependam de serviços externos.

