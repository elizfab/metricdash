# Passo 04 — Componentes Reutilizáveis

Criar em `src/app/shared/components/` (standalone). Todos com NG-ZORRO + tema escuro já aplicado.

## Inventário

| Componente | Seletor | NG-ZORRO base | Uso |
| ---------- | ------- | ------------- | --- |
| `app-page-header` | `<app-page-header>` | `nz-page-header` / layout custom | Título + ações da página |
| `app-data-table` | `<app-data-table>` | `nz-table` | CRUDs: colunas, paginação, ações editar/excluir |
| `app-stat-card` | `<app-stat-card>` | `nz-card` + ícone | Cards de métricas do dashboard |
| `app-filter-bar` | `<app-filter-bar>` | `nz-form` + `nz-select`/`nz-date-picker` | Filtros (ano, mês, categoria, viagem, domínio) |
| `app-empty-state` | `<app-empty-state>` | `nz-empty` | Estado vazio padronizado |
| `app-loading` | `<app-loading>` | `nz-spin` + `nz-skeleton` | Loading de tabelas/cards |
| `app-error-state` | `<app-error-state>` | `nz-result`/`nz-alert` | Erro padronizado com retry |
| `app-confirm-dialog` | service | `nz-modal` (ModalService) | Confirmação de exclusão |
| `app-money` | pipe | — | `{{ valorCentavos | moeda }}` → `R$ 1.234,56` |

## Elementos já cobertos pelo NG-ZORRO (não recriar)

- **Acordeões** → `nz-collapse` (ex.: detalhes de viagem, seções de configurações)
- **Barra de progresso** → `nz-progress` (ex.: orçamento por categoria, % do mês)
- **Loaders** → `nz-spin`, `nz-skeleton`
- **Header/Footer/Main** → `nz-layout` + `nz-header`/`nz-footer`/`nz-content` no shell do app
- **Botões** → `nz-button` (`nzType="primary"`, `nzDanger`, `nzLoading`)
- **Ícones** → `@ant-design/icons-angular` (`nz-icon` + `IconDirective`)

## Padrão de botão

| Ação | Tipo |
| ---- | ---- |
| Primária (salvar, confirmar, novo) | `nzType="primary"` |
| Secundária/cancelar | default |
| Excluir | `nzDanger` + confirmação via `nz-modal` |
| Ações em tabela | `nzType="link"` pequeno |

## Ícones (Ant Design)

Usar os equivalentes já existentes: `plus` (novo), `edit`/`form` (editar), `delete` (excluir), `search` (filtro), `car`/`subway`/`coffee`/`environment` (categorias — mapeados no seed), `home`/`bank`/`dollar`/`calendar`/`user`/`setting`/`logout`/`menu-fold` para chrome.

## Layout base (shell)

```html
<nz-layout>
  <nz-header><app-header /></nz-header>
  <nz-layout>
    <nz-sider><app-sidebar /></nz-sider>
    <nz-content><router-outlet /></nz-content>
  </nz-layout>
  <nz-footer><app-footer /></nz-footer>
</nz-layout>
```

- `app-header`: logo MetricDash + tema + usuário + logout.
- `app-sidebar`: menu de rotas (dashboard, lançamentos, viagens, resumo, configurações).
- `app-footer`: versão/créditos.

## Validação

- Cada componente com spec Jest (render + inputs/outputs principais).
- `npm run lint` (angular-eslint pega a11y de templates).
