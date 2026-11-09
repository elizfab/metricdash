# Setup Database — Índice

Passo a passo da modelagem e integração do banco de dados do MetricDash, baseado em [`panel-finance-itau.md`](./panel-finance-itau.md).

| Passo | Documento | Conteúdo |
| ----- | --------- | -------- |
| 01 | [Modelagem e diagrama](./passo-01-modelagem.md) | Diagrama ER, entidades, relacionamentos e decisões |
| 02 | [Schema e seeds](./passo-02-schema-e-seeds.md) | Tabelas, views, dados iniciais e convenções |
| 03 | [Autenticação e login](./passo-03-autenticacao.md) | Supabase Auth + tabela `perfis` |
| 04 | [Endpoints da API](./passo-04-endpoints.md) | Rotas REST em português e regras |
| 05 | [Integração com o frontend](./passo-05-integracao-frontend.md) | Do banco ao Angular: serviços, estado e telas |

## Artefatos

Os arquivos de modelagem estão em `public/assets/database/`:

- `metricdash-er-diagram.md` — diagrama ER (Mermaid)
- `schema.sql` — DDL PostgreSQL/Supabase em português + seeds
- `endpoints.md` — especificação REST em português

## Decisões consolidadas

- **Motor:** PostgreSQL via Supabase (free tier).
- **Idioma:** todos os elementos do banco e das rotas em **português**.
- **Dinheiro:** centavos (`bigint`); totais calculados por colunas geradas e views.
- **Ano dos dados iniciais:** dinâmico (ano corrente do banco) — sem configuração manual.
- **Expansão:** `dominios` permite novos nichos sem remodelar.
- **Login:** Supabase Auth (`auth.users`) + tabela `perfis`.
- **Métricas:** views `vw_*` alimentam endpoints `/relatorios/*` → cards e charts.
