# Setup do Projeto — Visão Geral

## 1. Objetivo

Documentar a configuração final do projeto MetricDash, consolida­ndo as etapas de inicialização e as ferramentas adotadas.

## 2. Pré-requisitos

- Node.js 24.x e npm 11.x.
- Git.
- Acesso ao repositório `elizfab/metricdash`.

## 3. Versões utilizadas

| Item | Versão |
| ---- | ------ |
| Angular | 22.2.x |
| Angular CLI | 22.2.3 |
| TypeScript | ~6.0.2 |
| NgRx | 22.0.1 |
| NG-ZORRO | 22.2.0 |
| Jest | 30.5.2 |
| jest-preset-angular | 17.0.3 |
| ESLint | 10.12.0 |
| angular-eslint | 22.6.0 |
| DangerJS | 14.1.0 |
| Playwright | 1.65.0 |
| Open Sans | Google Fonts |

## 4. Comandos executados (resumo)

```bash
ng new metricdash --directory . --style scss --routing --skip-git --minimal --package-manager npm
npm install @ngrx/store@22.0.1 @ngrx/effects@22.0.1 @ngrx/entity@22.0.1 @ngrx/store-devtools@22.0.1
npx ng add ng-zorro-antd@22.2.0 --skip-confirmation --defaults
npm install @ant-design/icons-angular@22.1.1
npm install -D jest@30 jest-preset-angular@17 jest-environment-jsdom@30 @types/jest@30 ts-node
npx ng add @angular-eslint/schematics --skip-confirmation --defaults
npm install -D danger
npm install -D @playwright/test@1.65.0
```

## 5. Arquivos de configuração principais

| Arquivo | Finalidade |
| ------- | ---------- |
| `angular.json` | Build/serve (porta 6080), estilos, fileReplacements de environments, target lint |
| `tsconfig.json` / `tsconfig.app.json` / `tsconfig.spec.json` | TypeScript strict (app) e specs Jest |
| `jest.config.mjs` + `setup-jest.ts` | Testes unitários (preset CJS, ambiente zoneless) |
| `eslint.config.js` | Flat config ESLint + angular-eslint |
| `dangerfile.ts` | Regras de governança de PRs |
| `.github/workflows/{ci,danger,auto-pr}.yml` | CI, Danger e criação automática de PRs |
| `src/styles/` | Arquitetura SCSS + temas dark/light |
| `src/environments/` | Variáveis de ambiente (fileReplacements no build de dev) |
| `scripts/screenshots.mjs` | Estrutura inicial de screenshots (Playwright) |

## 6. Como validar o setup completo

```bash
npm ci
npm run lint
npm test
npm run build
npm run screenshots
npx danger local
```

## 7. Resultado esperado

Aplicação MetricDash executando em `http://localhost:6080`, com rotas `/dashboard`, `/login` e `/logout`, tema dark inicial, pipeline de qualidade (lint + Jest + build + Danger) configurada no GitHub Actions.

## 8. Documentação relacionada

Cada ferramenta possui documento detalhado em `docs/setup-project/`:

- `setup-git/passo-01.md`
- `install-angular/passo-01.md`
- `install-ngrx/passo-01.md`
- `install-ng-zorro/passo-01.md`
- `install-jest/passo-01.md`
- `install-eslint/passo-01.md`
- `install-danger/passo-01.md`
- `install-playwright/passo-01.md`
- `setup-scss/passo-01.md`
- `setup-themes/passo-01.md`

## 9. Possíveis problemas e soluções

| Problema | Solução |
| -------- | ------- |
| Porta 6080 ocupada | `lsof -i :6080` e encerrar o processo, ou `ng serve --port <outra>`. |
| Erro de peer dependency | Usar as versões fixadas documentadas; não usar `--force`/`--legacy-peer-deps`. |
| Testes não encontram componentes | Garantir `setup-jest.ts` com `setupZonelessTestEnv()` (app zoneless). |
