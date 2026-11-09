# Instalação do Angular — Etapa 02

## 1. Objetivo

Inicializar o projeto Angular do MetricDash com a última versão estável disponível, utilizando componentes standalone, TypeScript strict, SCSS, Angular Router e execução na porta 6080.

## 2. Pré-requisitos

- Node.js instalado (`v24.22.0`).
- npm instalado (`11.19.1`).
- Angular CLI instalado globalmente (`22.2.3`).
- Git inicializado (Etapa 01 concluída, branch `develop` ativa).
- Repositório remoto `elizfab/metricdash` acessível.

## 3. Versões utilizadas

| Ferramenta          | Versão      |
| ------------------- | ----------- |
| Node.js             | 24.22.0     |
| npm                 | 11.19.1     |
| Angular CLI         | 22.2.3      |
| Angular             | 22.2.x      |
| TypeScript          | ~6.0.2      |
| RxJS                | ~7.8.0      |

## 4. Estado inicial verificado

- Diretório `/home/elizabetefabri/repos/projetos-pessoais/finanças` continha apenas documentação (`documentation.md`, `documentation-02.md`, `docs/`) e `.vscode/`.
- Repositório Git já inicializado na branch `develop`, sem alterações pendentes.
- Nenhuma aplicação Angular existia no diretório.

## 5. Comandos executados

```bash
# Cria a aplicação Angular no diretório atual (workspace raiz)
ng new metricdash \
  --directory . \
  --style scss \
  --routing \
  --skip-git \
  --minimal \
  --package-manager npm \
  --ai-config none

# Valida o build de produção
npm run build

# Valida a execução na porta 6080
npx ng serve --port 6080
```

## 6. Explicação dos comandos e opções

- `ng new metricdash --directory .`: gera a aplicação `metricdash` na raiz do diretório atual, preservando os arquivos de documentação existentes.
- `--style scss`: define SCSS como pré-processador de estilos dos componentes.
- `--routing`: gera `app.routes.ts` e configura o `RouterOutlet`, preparando o Angular Router (usado na Etapa 09).
- `--skip-git`: evita que o CLI crie um novo repositório Git — o repositório já foi inicializado na Etapa 01.
- `--minimal`: gera um workspace mínimo **sem frameworks de teste** (sem Karma/Vitest e sem arquivos `spec.ts`), já que o Jest será configurado manualmente na Etapa 04.
- `--package-manager npm`: garante instalação via npm (npm 11.19.1).
- `--ai-config none`: não gera arquivos de configuração para ferramentas de IA.
- `npm run build`: compila a aplicação para produção e valida o TypeScript strict.
- `npx ng serve --port 6080`: sobe o dev server na porta 6080.

### Configuração adicional

No arquivo `angular.json`, foi adicionada a porta padrão do dev server:

```json
"serve": {
  "builder": "@angular/build:dev-server",
  "options": {
    "port": 6080
  },
  ...
}
```

Assim, `ng serve` e `npm start` já sobem na porta 6080, além do comando documentado `ng serve --port 6080`.

## 7. Arquivos criados ou modificados

Arquivos gerados pelo Angular CLI:

```text
.angular/                  (cache do CLI)
.gitignore
.prettierrc
README.md                  (será substituído na Etapa 10)
angular.json
package.json
package-lock.json
tsconfig.json
tsconfig.app.json
public/favicon.ico
src/index.html
src/main.ts
src/styles.scss
src/app/app.ts
src/app/app.config.ts
src/app/app.routes.ts
.vscode/extensions.json
.vscode/launch.json
.vscode/tasks.json
```

Modificados manualmente:

- `angular.json` — porta `6080` configurada nas opções do `serve`.

## 8. Configurações realizadas

- **Standalone:** padrão do Angular 22 (`--standalone` é o default; componentes não usam NgModules).
- **TypeScript strict:** `"strict": true` no `tsconfig.json` (default do CLI com `--strict`, também default na v22).
- **SCSS:** `inlineStyleLanguage: "scss"` e schematics com `"style": "scss"`.
- **Router:** `provideRouter(routes)` em `app.config.ts` e `RouterOutlet` no componente raiz.
- **Sem framework de teste:** `--minimal` evita resíduos de Karma/Vitest/Jasmine.
- **Porta:** 6080 configurada no `angular.json` e via `--port` no comando.

## 9. Como validar

```bash
npm run build          # deve compilar sem erros
ng serve --port 6080   # deve subir em http://localhost:6080
ng version             # deve exibir Angular CLI 22.x
```

## 10. Resultado esperado

- `npm run build` conclui com "Application bundle generation complete".
- `ng serve --port 6080` responde HTTP 200 em `http://localhost:6080`.
- Aplicação em `develop`, sem alterações fora do escopo.

## 11. Validação executada

- `npm run build` → sucesso (bundle gerado em `dist/metricdash`, ~190 kB inicial).
- `ng serve --port 6080` → HTTP 200 em `http://localhost:6080`, watch mode ativo.

## 12. Possíveis problemas e soluções

| Problema | Solução |
| -------- | ------- |
| `ng new` recusa diretório não vazio | Usar `--directory .` com arquivos não conflitantes; o CLI mescla sem sobrescrever docs. |
| TypeScript 6.x incompatível com alguma ferramenta | Verificar compatibilidade antes de instalar Jest/ESLint/Danger (Etapas 04 e 05). |
| Porta 6080 em uso | Verificar com `lsof -i :6080` e encerrar o processo ou usar `--port` alternativo temporariamente. |
