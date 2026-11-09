# Passo 06 — Páginas e CRUDs

Ordem sugerida de implementação (cada página = feature em `src/app/features/` ou `pages/`).

## Sequência

| # | Página/rota | Conteúdo | Depende de |
| - | ----------- | -------- | ---------- |
| 1 | `/login` | `nz-form` e-mail/senha → `auth.service` | auth |
| 2 | Shell (header/sidebar/footer) | `nz-layout` + menu | auth |
| 3 | `/dashboard` | cards (`app-stat-card`) + charts | relatórios |
| 4 | `/lancamentos` | `app-data-table` CRUD + filtros | lançamentos |
| 5 | `/viagens` | CRUD viagens + hospedagens + resumo | viagens/hospedagens |
| 6 | `/resumo-mensal` | tabela mensal + gráficos | relatórios |
| 7 | `/configuracoes` | CRUDs: categorias, formas-pagamento, hotéis, status, domínios | todos os cadastros |
| 8 | `/logout` | encerra sessão | auth |

## Padrão de página CRUD

```
features/lancamentos/
├── pages/lancamentos-page/        # lista + filtros + tabela
├── pages/lancamento-form-page/    # criar/editar (nz-form)
├── store/                         # actions, reducer, effects, selectors
└── components/                    # específicos da feature (filtro extra, card resumo)
```

Fluxo: `page → dispatch(carregar) → effect → lancamento.service → reducer → selector → nz-table`.

## Dashboard (cards + charts)

- Cards: total do mês, passagens, hospedagem, # viagens, média/viagem, média mensal.
- Charts (biblioteca a definir — `ngx-echarts` ou charts NG-ZORRO): pizza por categoria, linha evolução mensal, barras passagens×hospedagem.
- Dados via `relatorio.service` → views `vw_*` (séries prontas, sem agregar no cliente).

## Configurações

Abas (`nz-tabs`) ou seções com `nz-collapse`: Categorias, Formas de pagamento, Hotéis, Status de viagem, Domínios, Perfil. Cada uma = `app-data-table` + form modal/página.

## Validação por página

- Jest: spec do componente (render, dispatch de actions) + spec do service.
- Playwright: fluxo feliz de um CRUD quando `scripts/screenshots.mjs` evoluir para cenários.
- `npm run lint`, `npm test`, `npm run build`.
