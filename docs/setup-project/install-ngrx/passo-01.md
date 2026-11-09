# Instalação do NgRx — Etapa 04.1

## 1. Objetivo

Instalar e configurar o NgRx para gerenciamento de estado global da aplicação, preparando a estrutura inicial sem criar estados de funcionalidades que ainda não existem.

## 2. Pré-requisitos

- Projeto Angular 22 inicializado (Etapa 02).
- Angular Router configurado.
- Node.js 24.22.0 / npm 11.19.1.

## 3. Versões utilizadas

| Pacote               | Versão  |
| -------------------- | ------- |
| @ngrx/store          | 22.0.1  |
| @ngrx/effects        | 22.0.1  |
| @ngrx/entity         | 22.0.1  |
| @ngrx/store-devtools | 22.0.1  |
| @angular/core        | ^22.2.0 |
| rxjs                 | ~7.8.0  |

A versão 22.x do NgRx é a linha oficial compatível com Angular 22 (`peerDependencies`: `@angular/core: ^22.0.0`).

## 4. Comandos executados

```bash
npm install @ngrx/store@22.0.1 @ngrx/effects@22.0.1 @ngrx/entity@22.0.1 @ngrx/store-devtools@22.0.1
```

## 5. Explicação dos comandos

- `npm install <pacotes>@<versão>`: instala as dependências fixadas na versão compatível com o Angular 22, sem usar `--force` ou `--legacy-peer-deps`.

### Avaliação dos pacotes

| Pacote               | Decisão | Justificativa |
| -------------------- | ------- | ------------- |
| `@ngrx/store`        | Instalado | Store global reativo — núcleo do gerenciamento de estado. |
| `@ngrx/effects`      | Instalado | Efeitos colaterais (chamadas HTTP futuras) — padrão da arquitetura NgRx. |
| `@ngrx/entity`       | Instalado | Adaptadores para coleções normalizadas — serão úteis para listas de métricas/indicadores. |
| `@ngrx/store-devtools` | Instalado | Depuração do estado via Redux DevTools em desenvolvimento. |

## 6. Arquivos criados ou modificados

- `package.json` / `package-lock.json` — novas dependências.
- `src/app/app.config.ts` — providers do NgRx adicionados.

## 7. Configurações realizadas

Em `src/app/app.config.ts`, utilizando a API standalone do NgRx:

```ts
provideStore(),
provideEffects(),
provideStoreDevtools({
  maxAge: 25,
  logOnly: !isDevMode(),
  autoPause: true,
  trace: false,
  traceLimit: 75,
}),
```

- `provideStore()`: inicializa o store global (sem reducers de funcionalidades, conforme escopo).
- `provideEffects()`: registra a raiz de efeitos (vazia por enquanto).
- `provideStoreDevtools()`: habilita o DevTools somente fora de produção (`logOnly: !isDevMode()`).

Nenhum estado de funcionalidade foi criado.

## 8. Como validar

```bash
npm run build   # deve compilar sem erros
npm start       # app deve subir; Redux DevTools Extension mostra a store
```

## 9. Resultado esperado

- Build de produção concluído com sucesso.
- Store NgRx disponível para injeção em toda a aplicação.

## 10. Validação executada

`npm run build` → "Application bundle generation complete" (bundle inicial ~228 kB).

## 11. Possíveis problemas e soluções

| Problema | Solução |
| -------- | ------- |
| Conflito de peer dependencies com Angular 22 | Usar a linha `@ngrx/*@22.x`, oficial para Angular 22. |
| `provideStore()` sem reducers | Válido no NgRx standalone; estados de features serão adicionados via `provideState` nas próximas etapas. |
