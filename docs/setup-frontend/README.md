# Setup Frontend — Índice e Mapeamento

Ordem de implementação do frontend do MetricDash, partindo do banco modelado em [`docs/setup-database/`](../setup-database/). Toda a UI usa **NG-ZORRO** (já instalado e tematizado — ver decisão abaixo).

| Ordem | Documento | Escopo |
| ----- | --------- | ------ |
| 00 | [Decisão de UI library](#decisao-ui-library) | NG-ZORRO vs PrimeNG |
| 01 | [Tipos e modelos](./passo-01-tipos-e-modelos.md) | Interfaces TS espelhando o banco |
| 02 | [Serviços e dados](./passo-02-servicos-e-dados.md) | Supabase + services + NgRx |
| 03 | [Autenticação](./passo-03-autenticacao.md) | Login, guard, rotas protegidas |
| 04 | [Componentes reutilizáveis](./passo-04-componentes-reutilizaveis.md) | Cards, accordions, loaders, header/footer, botões, ícones |
| 05 | [Layout e estilos](./passo-05-layout-e-estilos.md) | SCSS, grid template, temas |
| 06 | [Páginas e CRUDs](./passo-06-paginas-e-cruds.md) | Dashboard, lançamentos, viagens, configurações |

## Decisão UI library {#decisao-ui-library}

**Decisão: NG-ZORRO (manter).**

Você entendeu certo — o NG-ZORRO é a escolha correta aqui:

- Já está instalado, configurado (`provideNzI18n`, date adapter) e **tematizado** com a paleta MetricDash (`src/styles/vendor/ng-zorro.dark.less`).
- Tem todos os componentes pedidos: `nz-table` (CRUD), `nz-card`, `nz-collapse` (acordeões), `nz-progress`, `nz-spin`/`nz-skeleton` (loaders), `nz-layout` (header/footer/main), `nz-button`, `nz-icon`, `nz-form`, `nz-select`, `nz-date-picker`.
- Trocar para PrimeNG descartaria o tema Less pronto e o i18n — custo sem ganho.

Ícones: `@ant-design/icons-angular` (já instalado) — manter consistência com o NG-ZORRO.

## O que já existe (base pronta)

- `src/app/core/` — `interceptors/`, `services/`, `models/`, `types/`, `enums/` (vazios, prontos para preencher)
- `src/app/shared/` — `components/`, `types/` (base para reutilizáveis)
- `src/app/pages/` — `dashboard`, `login`, `logout` (standalone)
- `src/styles/` — `abstracts/_variables.scss`, `base/`, `themes/`, `vendor/ng-zorro.dark.less`
- Rotas: `/`, `/dashboard`, `/login`, `/logout` (lazy loading)
- NgRx store/effects/devtools configurados em `app.config.ts`

## Regras transversais

- Componentes **standalone**, strict TS, SCSS, sem `any`.
- Toda lista/tabela usa `nz-table` com paginação e estados (loading/vazio/erro).
- Valores monetários exibidos em `R$` — conversão centavos→reais **somente na camada de apresentação** (pipe `moeda`).
- Todo CRUD segue o mesmo padrão: service → store (opcional) → componente com `nz-form`.
