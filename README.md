<div align="center">

# MetricDash

### Plataforma para visualização, organização e acompanhamento de métricas, indicadores e informações financeiras.

> *"Eu sou o Dash: MetricDash — Para quem ama métricas e indicadores."*

</div>

---

## Sobre o projeto

O **MetricDash** é uma plataforma frontend para visualização, organização e acompanhamento de métricas, indicadores e informações financeiras.

### Objetivo

Fornecer uma interface moderna, rápida e organizada para o acompanhamento de indicadores, preparada para evoluir com novos painéis e funcionalidades.

---

<main>

## Stack tecnológica

| Camada | Tecnologia |
| ------ | ---------- |
| Framework | Angular 22 (standalone, zoneless) |
| Linguagem | TypeScript (strict) |
| Estilos | Sass/SCSS + CSS Custom Properties |
| Estado | NgRx (store, effects, entity, store-devtools) |
| Componentes | NG-ZORRO + @ant-design/icons-angular |
| Testes | Jest + jest-preset-angular |
| Qualidade | ESLint (angular-eslint) + DangerJS |
| E2E/Screenshots | Playwright |
| CI/CD | GitHub Actions |
| Fonte | Open Sans |

### Ferramentas utilizadas

- **Angular CLI 22.2.3** — scaffolding e build.
- **NgRx 22.0.1** — gerenciamento de estado global.
- **NG-ZORRO 22.2.0** — biblioteca de componentes.
- **Jest 30.5.2** — testes unitários.
- **ESLint 10.12** — lint e boas práticas.
- **DangerJS 14.1.0** — governança de Pull Requests.
- **Playwright 1.65.0** — automação de navegador (screenshots).
- **Prettier 3.8** — formatação de código.

## Estrutura de diretórios

```text
src/
├── app/
│   ├── core/
│   │   ├── interceptors/
│   │   ├── services/
│   │   ├── models/
│   │   ├── types/
│   │   └── enums/
│   ├── shared/
│   │   ├── components/
│   │   └── types/
│   ├── pages/
│   │   ├── dashboard/
│   │   ├── login/
│   │   └── logout/
│   ├── app.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── environments/
│   ├── environment.ts
│   └── environment.development.ts
├── styles/
│   ├── abstracts/
│   ├── base/
│   ├── themes/
│   └── styles.scss
├── index.html
└── main.ts

scripts/
└── screenshots.mjs

docs/
└── setup-project/

.github/
└── workflows/
```

## Como instalar

```bash
git clone https://github.com/elizfab/metricdash.git
cd metricdash
npm ci
```

## Como executar

```bash
npm start          # ng serve na porta 6080
# ou
ng serve --port 6080
```

Acesse `http://localhost:6080`.

## Como testar

```bash
npm test               # executa a suíte Jest
npm run test:watch     # modo watch
npm run test:coverage  # com relatório de cobertura
```

## Como executar o lint

```bash
npm run lint
```

## Como executar os screenshots

```bash
npm run screenshots
```

> Os cenários de captura serão implementados em etapas futuras. No momento, o comando executa a estrutura inicial sem gerar imagens.

## Páginas e rotas

| Rota       | Página    |
| ---------- | --------- |
| `/`        | Apresentação inicial |
| `/dashboard` | Dashboard |
| `/login`   | Login     |
| `/logout`  | Logout    |

## Temas

O tema inicial é **Dark**. O tema **Light** está preparado e pode ser ativado via atributo `data-theme="light"` no elemento `<html>` (sem seletor visual nesta etapa).

</main>

---

## Convenções Git

- **Branches:** `develop` é a base de integração; `main` é preservada. Branches de trabalho usam prefixos `feature/`, `fix/`, `chore/`, `docs/`, `hotfix/` e `refactor/` em kebab-case.
- **Commits em português** com prefixos:

```text
funcionalidade:
correcao:
configuracao:
documentacao:
testes:
refatoracao:
```

Exemplo: `configuracao: adiciona fonte Open Sans ao projeto`

## Fluxo de branches

```text
feature/* ──push──▶ GitHub Actions cria PR automaticamente ──▶ develop
fix/*, chore/*, docs/*, hotfix/*, refactor/* ──▶ PR manual ──▶ develop
hotfix/* ──▶ PR ──▶ main (quando aplicável)
```

## Regras de Pull Requests

- **Template obrigatório:** ao abrir um PR, o GitHub carrega automaticamente `.github/pull_request_template.md` — preencha **todas** as seções (Objetivo, Alterações realizadas, Validações, Evidências, Documentação).
- Título em português com prefixo padronizado (ex.: `Funcionalidade: ...`). Exemplos: `Funcionalidade: criação do dashboard`, `Configuração: instalação do Jest`, `Correção: ajuste nas rotas`.
- Branches de origem: `feature/`, `fix/`, `chore/`, `docs/`, `hotfix/`, `refactor/` — nunca `main` ou `develop`.
- Destino: `develop` (apenas `hotfix/*` pode mirar `main`).
- O **DangerJS** valida automaticamente commits, nome da branch, título, descrição, tamanho do PR, lockfile, `console.log`/`TODO` e arquivos sensíveis — veja `docs/setup-project/install-danger/passo-01.md` §11 para o passo a passo do que preencher.
- O CI executa lint, testes Jest e build em todos os PRs.

## Documentação técnica

Toda instalação e configuração está documentada em [`docs/setup-project/`](docs/setup-project/):

- `setup-git/` — fluxo Git e branches
- `install-angular/` — inicialização do Angular
- `install-ngrx/`, `install-ng-zorro/`, `install-jest/`, `install-eslint/` — ferramentas
- `install-danger/` — DangerJS e automação de PRs
- `install-playwright/` — screenshots
- `setup-scss/`, `setup-themes/` — estilos e temas

## Links

- **Repositório:** https://github.com/elizfab/metricdash
- [Angular](https://angular.dev/) · [NgRx](https://ngrx.io/) · [NG-ZORRO](https://ng.ant.design/) · [Jest](https://jestjs.io/) · [ESLint](https://eslint.org/) · [DangerJS](https://danger.systems/) · [Playwright](https://playwright.dev/)

<footer>

<div align="center">

Feito com Angular, NgRx e muito café — *Para quem ama métricas e indicadores.*

</div>

</footer>
