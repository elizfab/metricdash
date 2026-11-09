# Instalação do Playwright — Etapa 06

## 1. Objetivo

Preparar o projeto para futuras capturas de tela da aplicação utilizando Playwright como ferramenta de automação de navegador, sem implementar cenários de captura nesta etapa.

## 2. Pré-requisitos

- Projeto Angular inicializado (Etapas 01–05).
- Node.js 24.22.0 / npm 11.19.1.

## 3. Versões utilizadas

| Pacote              | Versão |
| ------------------- | ------ |
| @playwright/test    | 1.65.0 |
| Node.js             | 24.22.0 |

## 4. Comandos executados

```bash
npm install -D @playwright/test@1.65.0
npm run screenshots
```

## 5. Explicação dos comandos

- `npm install -D @playwright/test`: instala o Playwright como dependência de desenvolvimento. O pacote `@playwright/test` inclui a biblioteca de automação (`chromium`, `firefox`, `webkit`) e o test runner — a instalação dos binários de navegador (`npx playwright install`) foi **intencionalmente adiada**, pois nenhum cenário de captura será executado nesta etapa.
- `npm run screenshots`: executa `node scripts/screenshots.mjs`.

## 6. Arquivos criados ou modificados

- `scripts/screenshots.mjs` — estrutura inicial documentada do script de screenshots.
- `package.json` — script `"screenshots": "node scripts/screenshots.mjs"`.
- `package-lock.json` — nova dependência.

## 7. Configurações realizadas

- Script `screenshots` adicionado ao `package.json`, preservando todos os demais scripts.
- `scripts/screenshots.mjs` criado com:
  - Documentação do propósito e do status (implementação pendente).
  - Constante `BASE_URL` com override via `SCREENSHOT_BASE_URL` (padrão `http://localhost:6080`).
  - Comentários `TODO` descrevendo a estrutura planejada para etapas futuras.
  - Execução segura que termina com código 0 sem gerar capturas.

Não foram criados: cenários de captura, imagens, pastas de screenshots, componentes de captura, fluxos de navegação ou relatórios visuais.

## 8. Como validar

```bash
npm run screenshots   # deve exibir as mensagens informativas e sair com código 0
```

## 9. Resultado esperado

- O comando executa sem erros.
- Nenhuma imagem ou pasta de screenshots é gerada.

## 10. Validação executada

`npm run screenshots` → saída:

```text
[screenshots] Estrutura inicial carregada.
[screenshots] Nenhum cenário de captura implementado ainda.
[screenshots] URL base prevista: http://localhost:6080
```

Exit code 0, sem geração de arquivos.

## 11. Possíveis problemas e soluções

| Problema | Solução |
| -------- | ------- |
| `browserType.launch: Executable doesn't exist` | Executar `npx playwright install chromium` quando os cenários forem implementados. |
| Script falha ao importar `@playwright/test` | Verificar se a dependência está em `devDependencies` e rodar `npm ci`. |
