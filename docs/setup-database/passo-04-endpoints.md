# Passo 04 — Endpoints da API (português)

## Objetivo

Definir o contrato REST que o frontend consumirá — hoje via camada local equivalente, amanhã via API/Supabase.

## Fonte

`public/assets/database/endpoints.md` — especificação completa.

## Resumo das rotas

### Autenticação
`POST /auth/entrar` · `POST /auth/sair` · `GET /auth/eu` · `POST /auth/registro` · `PATCH /auth/perfil`

### CRUDs de configuração (tela Configurações)
- `/dominios`, `/categorias-despesa`, `/formas-pagamento`, `/hoteis`, `/status-viagem`

### Operacionais
- `/viagens` (+ `/viagens/{id}/resumo`, `/lancamentos`, `/hospedagens`)
- `/hospedagens` (CRUD, aninhado em `/viagens/{id}/hospedagens` para criação)
- `/lancamentos` (CRUD + filtros: `ano`, `mes`, `categoriaId`, `viagemId`, `dominioId`, `busca`)

### Relatórios/métricas (charts)
- `/relatorios/resumo-dashboard`
- `/relatorios/resumo-mensal`
- `/relatorios/custo-viagem/{viagemId}`
- `/relatorios/por-categoria`
- `/relatorios/evolucao`
- `/relatorios/comparativo`

### Sistema
- `/configuracoes` (GET/PATCH)

## Regras

- Rotas em **português** (kebab-case), base `/api/v1`.
- Valores em centavos; datas `YYYY-MM-DD`; paginação `?pagina=&tamanhoPagina=`.
- Cálculos sempre no servidor/views — frontend consome séries prontas.
- JWT obrigatório em todos exceto login/registro; RLS por usuário.
- Erros: `{ "erro": { "codigo", "mensagem" } }` em pt-BR.

## Enquanto não há backend

A camada local (serviços Angular) expõe **a mesma interface** — o frontend não muda quando a API chegar. Ver `passo-05-integracao-frontend.md`.
