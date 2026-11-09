# MetricDash — Assets de Banco de Dados

Pacote inicial de modelagem do banco de dados do MetricDash, baseado em [`docs/setup-database/panel-finance-itau.md`](../../../docs/setup-database/panel-finance-itau.md). Todos os elementos em **português**.

## Arquivos

| Arquivo | Conteúdo |
| ------- | -------- |
| [`metricdash-er-diagram.md`](./metricdash-er-diagram.md) | Diagrama ER em Mermaid + views de métricas |
| [`schema.sql`](./schema.sql) | DDL PostgreSQL (Supabase) em português + seeds |
| [`endpoints.md`](./endpoints.md) | Especificação REST com rotas em português |

## Modelo (resumo)

- **Nicho inicial:** `deslocamento-trabalho` (viagens Jaú → São Paulo).
- **Expansão:** `dominios` + `dominio_id` permite novos nichos sem remodelar.
- **Tabelas:** `perfis` (login), `dominios`, `categorias_despesa`, `formas_pagamento`, `hoteis`, `status_viagem`, `viagens`, `hospedagens`, `lancamentos`, `configuracoes`.
- **Views de métricas:** `vw_resumo_mensal_categoria`, `vw_resumo_mensal`, `vw_custo_viagem` — alimentam cards e charts.
- **Dinheiro:** centavos (`bigint`); totais/diárias/dias/mês/ano calculados.
- **Ano dos seeds:** dinâmico (ano corrente do banco) — sem configuração manual.
- **Status da viagem:** tabela `status_viagem` (workflow evolutivo).
- **Login:** Supabase Auth (`auth.users`) + tabela `perfis`.

## Documentação do setup

O passo a passo completo está em [`docs/setup-database/`](../../../docs/setup-database/):

1. `passo-01-modelagem.md` — diagrama e decisões
2. `passo-02-schema-e-seeds.md` — tabelas, views e dados iniciais
3. `passo-03-autenticacao.md` — login com Supabase Auth
4. `passo-04-endpoints.md` — rotas da API em português
5. `passo-05-integracao-frontend.md` — como ligar o Angular ao banco
