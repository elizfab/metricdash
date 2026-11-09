# Instalação do Jest — Etapa 04.3

## 1. Objetivo

Configurar o Jest como ferramenta oficial de testes unitários do projeto, substituindo Jasmine/Karma/Vitest, com suporte a componentes, serviços, pipes, diretivas, funções e contratos TypeScript.

## 2. Pré-requisitos

- Projeto Angular 22 gerado com `--minimal` (sem framework de teste).
- TypeScript ~6.0.2.
- Node.js 24.22.0 / npm 11.19.1.

## 3. Versões utilizadas

| Pacote                | Versão   |
| --------------------- | -------- |
| jest                  | 30.5.2   |
| jest-preset-angular   | 17.0.3   |
| jest-environment-jsdom| 30.5.2   |
| @types/jest           | 30.x     |
| ts-node               | 10.9.2   |

Compatibilidade verificada: `jest-preset-angular@17` suporta `jest ^30`, `@angular/* >=20 <23`, `typescript >=5.8` e `jsdom >=26`. O preset foi configurado com `createCjsPreset()` pois o workspace usa `module: "preserve"`.

## 4. Comandos executados

```bash
npm install -D jest@30 jest-preset-angular@17 jest-environment-jsdom@30 @types/jest@30 ts-node
npx jest
npx jest --coverage
```

## 5. Explicação dos comandos

- `npm install -D ...`: instala Jest e o preset oficial Angular como dependências de desenvolvimento.
- `jest-preset-angular`: encapsula o compilador JIT do Angular para rodar componentes em jsdom, com transformador próprio (não utiliza ts-jest diretamente para templates).
- `jest-environment-jsdom`: ambiente de DOM simulado exigido para testes de componentes.
- `ts-node`: suporte a arquivos de configuração TypeScript.
- `npx jest`: executa a suíte de testes.
- `npx jest --coverage`: executa com relatório de cobertura.

## 6. Arquivos criados ou modificados

- `jest.config.mjs` — configuração do Jest.
- `setup-jest.ts` — inicialização do ambiente de testes Angular.
- `tsconfig.spec.json` — TypeScript específico para specs.
- `src/app/app.spec.ts` — teste de exemplo do componente raiz.
- `package.json` — scripts `test`, `test:watch`, `test:coverage`.

## 7. Configurações realizadas

### `jest.config.mjs`

```js
import presets from 'jest-preset-angular/presets/index.js';

const preset = presets.createCjsPreset();

export default {
  ...preset,
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/main.ts'],
  coverageDirectory: 'coverage',
};
```

- `createCjsPreset()`: preset compatível com o `module: "preserve"` do tsconfig raiz.
- `testMatch`: reconhece arquivos `*.spec.ts` em `src/`.
- `collectCoverageFrom`: coleta cobertura de todo o `src/` exceto specs e `main.ts`.

### `setup-jest.ts`

```ts
import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

setupZonelessTestEnv();
```

O projeto Angular 22 é **zoneless** por padrão (não utiliza `zone.js`), portanto o ambiente de teste correto é `setup-env/zoneless`, que registra `provideZonelessChangeDetection()` no `TestBed`.

### `tsconfig.spec.json`

Estende `tsconfig.json`, inclui `src/**/*.spec.ts`, define `types: ["jest", "node"]` e `esModuleInterop: true` (elimina warning do ts-jest).

### Scripts no `package.json`

```json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage"
```

## 8. Como validar

```bash
npm test            # executa os testes
npm run test:coverage  # executa com cobertura
```

## 9. Resultado esperado

- Todos os `*.spec.ts` executam com sucesso.
- Relatório de cobertura gerado em `coverage/`.
- Nenhum resíduo de Jasmine, Karma ou Vitest no projeto.

## 10. Validação executada

- `npx jest` → 1 suite, 1 teste passando (`src/app/app.spec.ts`).
- `npx jest --coverage` → cobertura reportada (app.ts 100%, app.config.ts 0% — sem spec dedicada).
- `grep` por `jasmine|karma|vitest` em `package.json`, `angular.json` e `src/` → sem ocorrências.

## 11. Possíveis problemas e soluções

| Problema | Solução |
| -------- | ------- |
| `Cannot find module 'zone.js'` | O app é zoneless; usar `jest-preset-angular/setup-env/zoneless` em vez de `zone`. |
| Erro de import no `jest.config.mjs` | O preset é CommonJS: importar via `import presets from 'jest-preset-angular/presets/index.js'` e usar `presets.createCjsPreset()`. |
| `Need to call TestBed.initTestEnvironment()` | O módulo `setup-env` só exporta a função; é obrigatório um `setup-jest.ts` chamando `setupZonelessTestEnv()`/`setupZoneTestEnv()`. |
| Warning TS151001 (esModuleInterop) | Adicionar `"esModuleInterop": true` em `tsconfig.spec.json`. |
