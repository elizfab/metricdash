# Passo 02 — Schema e Seeds

## Objetivo

Materializar o modelo em DDL PostgreSQL executável no Supabase, com views de métricas e dados iniciais de dezembro.

## Arquivo

`public/assets/database/schema.sql`

## Como aplicar

1. Criar projeto no [Supabase](https://supabase.com) (free tier).
2. No dashboard: **SQL Editor** → colar o conteúdo de `schema.sql` → **Run**.
3. Ou via `psql`: `psql "$DATABASE_URL" -f public/assets/database/schema.sql`.

## Conteúdo do schema

### Tabelas (10)

`perfis`, `dominios`, `categorias_despesa`, `formas_pagamento`, `hoteis`, `status_viagem`, `viagens`, `hospedagens`, `lancamentos`, `configuracoes`.

### Colunas geradas (cálculos automáticos)

| Tabela | Coluna | Expressão |
| ------ | ------ | --------- |
| `viagens` | `dias` | `data_fim - data_inicio` |
| `hospedagens` | `diarias` | `check_out - check_in` |
| `hospedagens` | `valor_total_centavos` | `diarias * valor_diaria_centavos` |
| `lancamentos` | `valor_total_centavos` | `round(quantidade * valor_unitario_centavos)` |
| `lancamentos` | `mes` / `ano` | `extract` de `data_despesa` |

### Views de métricas (charts/cards)

| View | Alimenta |
| ---- | -------- |
| `vw_resumo_mensal_categoria` | Gráficos por categoria e tabela do resumo mensal |
| `vw_resumo_mensal` | Total geral por mês |
| `vw_custo_viagem` | Custo consolidado por viagem (hospedagem + lançamentos, sem duplicar) |

### Seeds

- `status_viagem`: planejada, em andamento, realizada, cancelada.
- `dominios`: `deslocamento-trabalho`.
- `categorias_despesa`: passagem-onibus, metro, transporte-app, onibus-urbano, alimentacao, estacionamento, outras. **Hospedagem não é categoria** — fica em `hospedagens`.
- `formas_pagamento`: Pix, Crédito, Débito, Dinheiro.
- `viagens`: Viagem 1 (02–04/12), Viagem 2 (09–11/12), Viagem 3 (17–18/12) — **ano corrente dinâmico**.
- `hospedagens`: 3 registros, diária R$ 155,00 (15500 centavos), `hotel_id` nulo até o cadastro via frontend.
- `lancamentos`: passagem ida R$ 85,40 (02/12) e volta R$ 94,66 (04/12).

**Totais esperados:** passagens R$ 180,06 · hospedagem R$ 775,00 · 5 diárias · parcial R$ 955,06.

### Idempotência

`configuracoes.seed_aplicado = 'true'` marca que os seeds rodaram. Em re-execuções, verificar essa chave antes de inserir (ou executar o schema apenas uma vez em ambiente novo).

## Validação

```sql
select * from vw_custo_viagem;                 -- custo por viagem
select * from vw_resumo_mensal_categoria order by ano, mes;  -- por categoria
-- totais: passagens 18006 centavos, hospedagem 77500, diárias 5
```
