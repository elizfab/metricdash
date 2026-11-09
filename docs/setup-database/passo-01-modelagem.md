# Passo 01 — Modelagem e Diagrama

## Objetivo

Definir a estrutura relacional do banco do MetricDash cobrindo o nicho inicial (despesas de viagens de trabalho Jaú → São Paulo) e preparado para expansão a outros nichos.

## Diagrama

Ver `public/assets/database/metricdash-er-diagram.md` (Mermaid renderizável).

## Entidades

| Tabela | Papel |
| ------ | ----- |
| `perfis` | Perfil do usuário vinculado ao Supabase Auth — base do login |
| `dominios` | Nichos (ex.: `deslocamento-trabalho`) — chave de expansão |
| `categorias_despesa` | Categorias por domínio (CRUD em Configurações) |
| `formas_pagamento` | Formas de pagamento (CRUD em Configurações) |
| `hoteis` | Cadastro de hotéis — alimentado pelo frontend, referenciado por hospedagens/lançamentos |
| `status_viagem` | Workflow da viagem (planejada → em andamento → realizada/cancelada) |
| `viagens` | Viagens; `dias` calculado |
| `hospedagens` | N por viagem; `diarias`/`valor_total_centavos` calculados |
| `lancamentos` | Lançamentos de despesas (tabela central) |
| `configuracoes` | Chave-valor do sistema |

## Relacionamentos principais

- `viagens` 1—N `hospedagens` e 1—N `lancamentos` (uma viagem tem vários filhos).
- `lancamentos` N—1 `categorias_despesa`, `formas_pagamento`, `viagens` (opcional), `hoteis` (opcional), `dominios`.
- `hospedagens` N—1 `viagens`, N—1 `hoteis` (opcional).
- `categorias_despesa` N—1 `dominios`; `viagens`/`lancamentos` N—1 `dominios`.
- `viagens` N—1 `status_viagem`.
- `perfis` 1—1 `auth.users` (Supabase Auth).

## Decisões

1. **Hospedagem fora de `lancamentos`:** diárias de viagem ficam em `hospedagens`; despesas avulsas de hotel podem usar `lancamentos.hotel_id`. Evita dupla contagem.
2. **Status como tabela:** `status_viagem` em vez de enum fixo — permite evoluir o workflow sem migration.
3. **`dominios`:** todo lançamento/viagem/categoria pertence a um nicho — expansão sem remodelar.
4. **Cálculos no banco:** colunas geradas (`dias`, `diarias`, `valor_total_centavos`, `mes`, `ano`) + views — o frontend nunca recalcula totais.
5. **Ano dinâmico:** seeds usam `extract(year from current_date)` — dados de dezembro sempre caem no ano corrente, sem dependência de configuração.
6. **Tudo em português:** tabelas, colunas, comentários e rotas.

## Validação

- Diagrama renderiza no Mermaid.
- Todas as regras do documento-fonte estão mapeadas (ver `passo-02-schema-e-seeds.md`).
