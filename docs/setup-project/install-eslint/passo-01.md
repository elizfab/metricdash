# Instalação do ESLint — Etapa 04.4

## 1. Objetivo

Configurar o ESLint com integração ao Angular e TypeScript, com regras de tipagem segura, prevenção de código não utilizado, padronização e boas práticas Angular, além de scripts de lint.

## 2. Pré-requisitos

- Projeto Angular 22 inicializado.
- Node.js 24.22.0 / npm 11.19.1.

## 3. Versões utilizadas

| Pacote                       | Versão   |
| ---------------------------- | -------- |
| eslint                       | 10.12.0  |
| @angular-eslint/schematics   | 22.6.0   |
| @angular-eslint/builder      | 22.6.0   |
| @angular-eslint/eslint-plugin| 22.6.0   |
| @angular-eslint/template-parser | 22.6.0 |
| typescript-eslint            | 8.71.0   |
| @eslint/js                   | 10.0.1   |

A linha `angular-eslint` v22 foi selecionada automaticamente pelo schematic por ser compatível com Angular v22.

## 4. Comandos executados

```bash
npx ng add @angular-eslint/schematics --skip-confirmation --defaults
npm run lint
```

## 5. Explicação dos comandos

- `ng add @angular-eslint/schematics`: instala o conjunto `angular-eslint` compatível com a versão do Angular detectada no workspace e gera a configuração flat config (`eslint.config.js`) e o target `lint` no `angular.json`.
- `--skip-confirmation --defaults`: executa sem prompts, usando configurações padrão.
- `npm run lint`: executa o lint via builder `@angular-eslint/builder:lint`.

## 6. Arquivos criados ou modificados

- `eslint.config.js` — configuração flat do ESLint (ESLint 10).
- `angular.json` — target `lint` no projeto e `schematicCollections: ["angular-eslint"]`.
- `package.json` — dependências de desenvolvimento e script `"lint": "ng lint"`.

## 7. Configurações realizadas

`eslint.config.js` gerado pelo schematic:

- `files: ['**/*.ts']`:
  - `eslint.configs.recommended` (regras base do ESLint).
  - `tseslint.configs.recommended` + `tseslint.configs.stylistic` (TypeScript: tipagem segura e estilo).
  - `angular.configs.tsRecommended` (boas práticas Angular para TS).
  - `processor: angular.processInlineTemplates` (lint de templates inline).
  - Regras de seletores: `component-selector` (`app-*`, kebab-case) e `directive-selector` (camelCase, prefixo `app`).
- `files: ['**/*.html']`:
  - `angular.configs.templateRecommended` + `templateAccessibility` (templates e acessibilidade).

Scripts:

```json
"lint": "ng lint"
```

## 8. Como validar

```bash
npm run lint
```

## 9. Resultado esperado

- "All files pass linting." sem erros.
- ESLint disponível para verificação contínua no CI (GitHub Actions — Etapa 05).

## 10. Validação executada

`npm run lint` → "Linting "metricdash"... All files pass linting."

## 11. Possíveis problemas e soluções

| Problema | Solução |
| -------- | ------- |
| Versão do angular-eslint incompatível | Rodar `ng add @angular-eslint/schematics` sem fixar versão — o schematic escolhe a linha compatível. |
| Erros em `eslint.config.js` | O arquivo é CommonJS (`module.exports`); manter o formato gerado pelo schematic. |
| Falsos positivos em templates | Ajustar regras em `angular.configs.templateRecommended` conforme necessário, sem desativar acessibilidade. |
