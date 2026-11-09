# Passo 05 — Integração com o Frontend

## Objetivo

Ligar o Angular ao banco (Supabase/Postgres) consumindo as rotas/views em português — com login, CRUDs e métricas para os charts.

## 1. Instalar dependências

```bash
npm i @supabase/supabase-js
# gráficos (etapa de dashboards):
npm i ngx-echarts echarts   # ou ng-zorro charts conforme preferência
```

## 2. Configurar ambientes

`src/environments/environment.ts` e `environment.development.ts`:

```ts
export const environment = {
  production: false,
  supabase: { url: '...', anonKey: '...' },
};
```

> Nunca commitar keys reais — usar variáveis de build ou `.env` fora do repo.

## 3. Cliente Supabase

`src/app/core/services/supabase.service.ts`:

```ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient = createClient(
    environment.supabase.url,
    environment.supabase.anonKey,
  );
}
```

## 4. Modelos TypeScript (em `src/app/core/models/`)

Espelhar as tabelas em português: `perfil.model.ts`, `dominio.model.ts`, `categoria-despesa.model.ts`, `forma-pagamento.model.ts`, `hotel.model.ts`, `status-viagem.model.ts`, `viagem.model.ts`, `hospedagem.model.ts`, `lancamento.model.ts`, `configuracao.model.ts`.

```ts
export interface Lancamento {
  id: string;
  dominio_id: string;
  categoria_id: string;
  forma_pagamento_id?: string | null;
  viagem_id?: string | null;
  hotel_id?: string | null;
  descricao: string;
  data_despesa: string;          // YYYY-MM-DD
  quantidade: number;
  valor_unitario_centavos: number;
  valor_total_centavos: number;  // calculado no banco
  mes: number;
  ano: number;
}
```

## 5. Serviços por domínio (em `src/app/core/services/`)

| Serviço | Responsabilidade |
| ------- | ---------------- |
| `auth.service.ts` | login/logout/sessão via `supabase.auth` |
| `perfil.service.ts` | CRUD de `perfis` |
| `dominio.service.ts` | CRUD de `dominios` |
| `categoria.service.ts` | CRUD de `categorias_despesa` (filtro por domínio) |
| `forma-pagamento.service.ts` | CRUD de `formas_pagamento` |
| `hotel.service.ts` | CRUD de `hoteis` (cadastro no frontend) |
| `viagem.service.ts` | CRUD de `viagens` + resumo (`vw_custo_viagem`) |
| `hospedagem.service.ts` | CRUD de `hospedagens` |
| `lancamento.service.ts` | CRUD de `lancamentos` + filtros |
| `relatorio.service.ts` | métricas: `vw_resumo_mensal_categoria`, `vw_resumo_mensal`, `vw_custo_viagem` → séries para charts |
| `configuracao.service.ts` | GET/PATCH `configuracoes` |

Cada serviço chama `supabase.from('tabela').select/insert/update/delete` (ou `rpc` para views) e mapeia para os models — a interface espelha `endpoints.md`, permitindo trocar Supabase por API REST depois sem mudar componentes.

## 6. Estado (NgRx)

Criar features em `src/app/features/` com `store/` por domínio:

- `lancamentos` — lista paginada + filtros (ano, mês, categoria, viagem, domínio, busca)
- `viagens`, `hospedagens`, `hoteis`, `categorias`, `formas-pagamento`, `dominios`, `status-viagem`, `perfis`, `configuracoes`
- `relatorios` — séries prontas para os charts (consumir views, não agregar no cliente)

Fluxo típico: `component → action → effect → service (Supabase) → reducer → selector → view`.

## 7. Rotas e guard de autenticação

| Rota | Página | Guard |
| ---- | ------ | ----- |
| `/login` | Login | público |
| `/logout` | Logout | auth |
| `/dashboard` | Dashboard + cards + charts | auth |
| `/lancamentos` | CRUD lançamentos | auth |
| `/viagens` | CRUD viagens + hospedagens | auth |
| `/resumo-mensal` | Relatório mensal (charts) | auth |
| `/configuracoes` | CRUDs de configuração | auth |

Criar `auth.guard.ts` (CanActivateFn) que verifica `supabase.auth.getSession()` e redireciona para `/login`.

## 8. Fluxo de cadastro de hotel (exemplo de CRUD vinculado)

1. Tela **Configurações → Hotéis**: formulário → `hotel.service.criar()` → `POST /hoteis` (ou `supabase.from('hoteis').insert`).
2. Na criação de **Hospedagem**: select de `hoteis` (via `hotel.service.listar()`) → `hospedagens.hotel_id` preenchido.
3. Em **Lançamentos**: `hotel_id` opcional vincula despesa avulsa ao hotel.

## 9. Métricas e charts

- Dashboard cards ← `relatorio.service.resumoDashboard(ano, mes, dominioId)` → `vw_resumo_mensal*`.
- Gráfico por categoria ← `vw_resumo_mensal_categoria`.
- Evolução mensal ← `vw_resumo_mensal`.
- Custo por viagem ← `vw_custo_viagem`.
- O frontend **não agrega** — recebe séries prontas e desenha.

## 10. Checklist de implementação

- [ ] `npm i @supabase/supabase-js` (+ lib de gráficos)
- [ ] `environment.ts` / `environment.development.ts` com `supabase.url`/`anonKey`
- [ ] `supabase.service.ts` + `auth.service.ts` + `auth.guard.ts`
- [ ] Models em `core/models/`
- [ ] Services por tabela em `core/services/`
- [ ] Features NgRx por domínio
- [ ] Páginas: login funcional, dashboard com cards/charts, CRUDs, resumo mensal, configurações
- [ ] Testes Jest por service/store; Playwright para fluxos
- [ ] RLS policies no Supabase para isolamento por usuário
