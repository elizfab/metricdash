# MetricDash — Diagrama ER (português)

Diagrama entidade-relacionamento do banco de dados, baseado em `docs/setup-database/panel-finance-itau.md`. Todos os elementos em português.

**Motor:** PostgreSQL (Supabase) · **Valores:** centavos (`bigint`) · **Render:** Mermaid `erDiagram`.

## Diagrama

```mermaid
erDiagram
    dominios ||--o{ categorias_despesa : "possui"
    dominios ||--o{ viagens : "agrupa"
    dominios ||--o{ lancamentos : "pertence"
    categorias_despesa ||--o{ lancamentos : "classifica"
    formas_pagamento ||--o{ lancamentos : "paga_com"
    viagens ||--o{ lancamentos : "contem"
    viagens ||--o{ hospedagens : "possui"
    hoteis ||--o{ hospedagens : "hospeda_em"
    hoteis ||--o{ lancamentos : "vincula"
    status_viagem ||--o{ viagens : "define"

    perfis {
        uuid id PK
        uuid auth_user_id UK
        text nome
        text apelido
        text tema_preferido
        boolean ativo
        timestamptz criado_em
        timestamptz atualizado_em
    }

    dominios {
        uuid id PK
        text slug UK
        text nome
        text descricao
        boolean ativo
        timestamptz criado_em
        timestamptz atualizado_em
    }

    categorias_despesa {
        uuid id PK
        uuid dominio_id FK
        text nome
        text slug
        text icone
        int ordem
        boolean ativo
        timestamptz criado_em
        timestamptz atualizado_em
    }

    formas_pagamento {
        uuid id PK
        text nome UK
        text tipo
        boolean ativo
        timestamptz criado_em
        timestamptz atualizado_em
    }

    hoteis {
        uuid id PK
        text nome
        text endereco
        text cidade
        text estado
        time hora_checkin
        time hora_checkout
        numeric classificacao
        boolean ativo
        timestamptz criado_em
        timestamptz atualizado_em
    }

    status_viagem {
        int id PK
        text slug UK
        text nome
        int ordem
        boolean ativo
    }

    viagens {
        uuid id PK
        uuid dominio_id FK
        text identificador
        text origem
        text destino
        date data_inicio
        date data_fim
        int dias
        int status_id FK
        text observacoes
        timestamptz criado_em
        timestamptz atualizado_em
    }

    hospedagens {
        uuid id PK
        uuid viagem_id FK
        uuid hotel_id FK
        date check_in
        date check_out
        int diarias
        bigint valor_diaria_centavos
        bigint valor_total_centavos
        text observacoes
        timestamptz criado_em
        timestamptz atualizado_em
    }

    lancamentos {
        uuid id PK
        uuid dominio_id FK
        uuid categoria_id FK
        uuid forma_pagamento_id FK
        uuid viagem_id FK
        uuid hotel_id FK
        text descricao
        date data_despesa
        numeric quantidade
        bigint valor_unitario_centavos
        bigint valor_total_centavos
        text origem
        text destino
        smallint mes
        smallint ano
        text observacoes
        timestamptz criado_em
        timestamptz atualizado_em
    }

    configuracoes {
        text chave PK
        text valor
        text descricao
        timestamptz atualizado_em
    }
```

## Views (métricas para cards e charts)

```mermaid
flowchart LR
    subgraph Banco["PostgreSQL"]
        L[lancamentos]
        C[categorias_despesa]
        H[hospedagens]
        V[viagens]
        L -->|vw_resumo_mensal_categoria| R1["resumo por mês/categoria"]
        L -->|vw_resumo_mensal| R2["total geral por mês"]
        H -->|vw_custo_viagem| R3["custo por viagem"]
        V --> R3
        L --> R3
    end
    R1 --> API["/relatorios/*"]
    R2 --> API
    R3 --> API
    API --> FE["Dashboard / Gráficos"]
```

## Leitura do modelo

| Tabela | Papel |
| ------ | ----- |
| `perfis` | Perfil do usuário vinculado ao Supabase Auth (`auth.users`) — base do login |
| `dominios` | Nichos/domínios (ex.: `deslocamento-trabalho`) — base para expansão |
| `categorias_despesa` | Categorias por domínio (CRUD em Configurações) |
| `formas_pagamento` | Formas de pagamento (CRUD em Configurações) |
| `hoteis` | Cadastro de hotéis — consumido pelo frontend, referenciado por `hospedagens`/`lancamentos` |
| `status_viagem` | Status da viagem (workflow evolutivo: planejada → em andamento → realizada/cancelada) |
| `viagens` | Viagens; `dias` calculado |
| `hospedagens` | N por viagem; `diarias` e `valor_total_centavos` calculados |
| `lancamentos` | Tabela central; `mes`/`ano`/`valor_total_centavos` calculados |
| `configuracoes` | Chave-valor do sistema |

## Regras atendidas

- Valores em centavos (`bigint`); totais/diárias/dias/mês/ano por **colunas geradas** e **views**.
- `lancamentos.viagem_id` e `hospedagens.viagem_id` N:1 — múltiplos filhos por viagem, custo via `vw_custo_viagem` sem duplicar.
- Ano dos seeds **dinâmico** (`extract(year from current_date)`) — sem configuração manual.
- CRUDs de configuração: `categorias_despesa`, `formas_pagamento`, `hoteis`, `status_viagem`, `dominios`.
- Métricas prontas para charts via views → endpoints `/relatorios/*`.
