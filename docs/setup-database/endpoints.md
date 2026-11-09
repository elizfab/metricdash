# MetricDash — Especificação de Endpoints (API REST em português)

Contrato inicial da API que atenderá o frontend Angular. Enquanto não houver backend, a camada de persistência local (serviços em `src/app/core/services/`) deverá implementar a **mesma interface**, permitindo troca futura sem reescrever componentes.

**Convenções**

- Base URL futura: `/api/v1`
- Todas as rotas em **português** (kebab-case)
- Datas: `YYYY-MM-DD` · Valores monetários: **centavos** (`*_centavos`, integer)
- Paginação: `?pagina=1&tamanhoPagina=20` → `{ dados, total, pagina, tamanhoPagina }`
- Filtros de `/lancamentos`: `ano`, `mes`, `categoriaId`, `viagemId`, `dominioId`, `busca` (em descrição), `ordenar`, `direcao`
- Cálculos (totais, diárias, consolidações) sempre no servidor — nunca duplicar no frontend.

---

## Autenticação (Supabase Auth)

| Método | Endpoint | Descrição |
| ------ | -------- | --------- |
| POST | `/auth/entrar` | Login (e-mail/senha) via Supabase Auth — retorna sessão JWT |
| POST | `/auth/sair` | Logout — invalida sessão |
| GET | `/auth/eu` | Dados do usuário autenticado + perfil |
| POST | `/auth/registro` | Cadastro inicial de usuário (cria `auth.users` + `perfis`) |
| PATCH | `/auth/perfil` | Atualiza dados do perfil (`nome`, `tema_preferido` etc.) |

> O Supabase Auth gerencia `auth.users`; o frontend consome via `@supabase/supabase-js` (`supabase.auth.signInWithPassword`). A tabela `perfis` espelha dados de exibição.

## Domínios (nichos)

| Método | Endpoint | Descrição |
| ------ | -------- | --------- |
| GET | `/dominios` | Lista domínios ativos (`?incluirInativos=true`) |
| GET | `/dominios/{id}` | Detalhe do domínio |
| POST | `/dominios` | Cria domínio (expansão de nichos) |
| PATCH | `/dominios/{id}` | Atualiza nome/descrição/ativo |

## Categorias de despesa

| Método | Endpoint | Descrição |
| ------ | -------- | --------- |
| GET | `/categorias-despesa?dominioId=` | Lista categorias do domínio |
| POST | `/categorias-despesa` | Cria categoria |
| PATCH | `/categorias-despesa/{id}` | Edita / reordena (`ordem`) |
| DELETE | `/categorias-despesa/{id}` | Remove (bloqueado se houver lançamentos → sugerir `ativo=false`) |

## Formas de pagamento

| Método | Endpoint | Descrição |
| ------ | -------- | --------- |
| GET | `/formas-pagamento` | Lista |
| POST | `/formas-pagamento` | Cria |
| PATCH | `/formas-pagamento/{id}` | Edita |
| DELETE | `/formas-pagamento/{id}` | Remove |

## Hotéis

| Método | Endpoint | Descrição |
| ------ | -------- | --------- |
| GET | `/hoteis?busca=&cidade=` | Lista/busca hotéis (alimenta selects de hospedagem) |
| GET | `/hoteis/{id}` | Detalhe |
| POST | `/hoteis` | Cria (cadastro via frontend) |
| PATCH | `/hoteis/{id}` | Edita |
| DELETE | `/hoteis/{id}` | Remove |

## Status de viagem

| Método | Endpoint | Descrição |
| ------ | -------- | --------- |
| GET | `/status-viagem` | Lista status (workflow da viagem) |
| POST | `/status-viagem` | Cria novo status (evolução do workflow) |
| PATCH | `/status-viagem/{id}` | Edita |

## Viagens

| Método | Endpoint | Descrição |
| ------ | -------- | --------- |
| GET | `/viagens?dominioId=&ano=&statusId=` | Lista viagens |
| GET | `/viagens/{id}` | Detalhe + `dias` calculado |
| POST | `/viagens` | Cria viagem |
| PATCH | `/viagens/{id}` | Edita |
| DELETE | `/viagens/{id}` | Remove |
| GET | `/viagens/{id}/resumo` | **Resumo financeiro da viagem**: total hospedagem, diárias, lançamentos, custo total — via `vw_custo_viagem`, sem duplicar |
| GET | `/viagens/{id}/lancamentos` | Lançamentos vinculados à viagem |
| GET | `/viagens/{id}/hospedagens` | Hospedagens da viagem |

## Hospedagens

| Método | Endpoint | Descrição |
| ------ | -------- | --------- |
| GET | `/hospedagens?viagemId=` | Lista hospedagens |
| POST | `/viagens/{viagemId}/hospedagens` | Cria hospedagem (aninhada à viagem) |
| PATCH | `/hospedagens/{id}` | Edita (recalcula `diarias`/`valor_total_centavos`) |
| DELETE | `/hospedagens/{id}` | Remove |

## Lançamentos (tabela central)

| Método | Endpoint | Descrição |
| ------ | -------- | --------- |
| GET | `/lancamentos` | Lista paginada com filtros (`ano`, `mes`, `categoriaId`, `viagemId`, `dominioId`, `busca`, `ordenar`, `direcao`) |
| GET | `/lancamentos/{id}` | Detalhe |
| POST | `/lancamentos` | Cria lançamento (`valor_total_centavos` calculado no servidor) |
| PATCH | `/lancamentos/{id}` | Edita |
| DELETE | `/lancamentos/{id}` | Remove |

## Relatórios e métricas (somente leitura — alimentam cards e charts)

| Método | Endpoint | Descrição |
| ------ | -------- | --------- |
| GET | `/relatorios/resumo-dashboard?ano=&mes=&dominioId=` | Cards do dashboard: total do mês, por categoria, qtd viagens, média/viagem, média mensal |
| GET | `/relatorios/resumo-mensal?ano=&dominioId=` | Consolidado jan–dez por categoria + total geral + viagens + diárias (mês a mês) — consome `vw_resumo_mensal_categoria` + `vw_resumo_mensal` |
| GET | `/relatorios/custo-viagem/{viagemId}` | Custos agregados da viagem — consome `vw_custo_viagem` |
| GET | `/relatorios/por-categoria?ano=&mes=` | Distribuição por categoria (gráficos de pizza/rosca) |
| GET | `/relatorios/evolucao?ano=&dominioId=` | Evolução mensal de gastos (gráfico de linha) |
| GET | `/relatorios/comparativo?ano=` | Comparativo entre meses e categorias |

## Configurações

| Método | Endpoint | Descrição |
| ------ | -------- | --------- |
| GET | `/configuracoes` | Todas as configurações |
| PATCH | `/configuracoes/{chave}` | Atualiza valor de uma chave |

---

## Regras de API

1. **Autenticação:** todos os endpoints exceto `/auth/entrar` e `/auth/registro` exigem JWT válido (Supabase Auth); RLS garante que cada usuário só vê seus dados.
2. **Validações de entrada:** `quantidade > 0`, `valor_unitario_centavos >= 0`, `check_out > check_in`, datas válidas — rejeitar com `422` e mensagem em pt-BR.
3. **Cálculos no servidor:** `valor_total_centavos`, `diarias`, `dias`, `mes`, `ano` nunca vêm do cliente — são colunas geradas ou views.
4. **Idempotência em seeds:** verificar `configuracoes.seed_aplicado` antes de inserir dados iniciais.
5. **Erros:** `{ "erro": { "codigo": "...", "mensagem": "..." } }` — mensagens em pt-BR.
6. **Filtros combináveis:** todos os filtros funcionam em conjunto.
7. **CRUDs de configuração:** `categorias-despesa`, `formas-pagamento`, `hoteis`, `status-viagem` e `dominios` possuem CRUD completo (tela de Configurações).
8. **Métricas para charts:** `/relatorios/*` retorna séries prontas para os gráficos do dashboard — o frontend não agrega dados brutos.
