# Passo 02 — Serviços e Dados

## Cliente Supabase

`src/app/core/services/supabase.service.ts` — instância única de `SupabaseClient` (ver `docs/setup-database/passo-05-integracao-frontend.md` §3).

## Services (um por tabela)

Em `src/app/core/services/`:

| Service | Métodos | Tabela/View |
| ------- | ------- | ----------- |
| `auth.service.ts` | `entrar`, `sair`, `sessao`, `registrar` | Supabase Auth |
| `perfil.service.ts` | CRUD | `perfis` |
| `dominio.service.ts` | CRUD + `listarAtivos` | `dominios` |
| `categoria.service.ts` | CRUD + `listarPorDominio` | `categorias_despesa` |
| `forma-pagamento.service.ts` | CRUD | `formas_pagamento` |
| `hotel.service.ts` | CRUD + `buscar` | `hoteis` |
| `viagem.service.ts` | CRUD + `resumo(id)` | `viagens` + `vw_custo_viagem` |
| `hospedagem.service.ts` | CRUD + `listarPorViagem` | `hospedagens` |
| `lancamento.service.ts` | CRUD + `listar(filtros, paginacao)` | `lancamentos` |
| `relatorio.service.ts` | `resumoDashboard`, `resumoMensal`, `porCategoria`, `evolucao`, `custoViagem` | `vw_*` |
| `configuracao.service.ts` | `listar`, `atualizar(chave, valor)` | `configuracoes` |

## Padrão de implementação

```ts
@Injectable({ providedIn: 'root' })
export class LancamentoService {
  private readonly supabase = inject(SupabaseService);

  listar(filtros: FiltroLancamentos, paginacao: Paginacao): Observable<Pagina<Lancamento>> {
    let q = this.supabase.client
      .from('lancamentos')
      .select('*, categorias_despesa(nome, slug), viagens(identificador)', { count: 'exact' });
    if (filtros.ano) q = q.eq('ano', filtros.ano);
    if (filtros.mes) q = q.eq('mes', filtros.mes);
    if (filtros.categoriaId) q = q.eq('categoria_id', filtros.categoriaId);
    // ... demais filtros
    return from(q.range(...)).pipe(map(r => this.mapear(r)));
  }
}
```

- Retornar `Observable` (RxJS) — integrar com effects NgRx.
- Tratar erros com `catchError` → tipar em `core/types/erro.type.ts` (`{ codigo, mensagem }` pt-BR).
- Enquanto não houver backend, os services podem começar com **dados mock** atrás da mesma interface (facilita trocar depois).

## NgRx (features)

Em `src/app/features/<dominio>/store/`:

- `lancamentos` — actions: `carregar`, `criar`, `editar`, `remover`, `filtrar`; state: `{ itens, pagina, filtros, carregando, erro }`.
- `viagens`, `hospedagens`, `hoteis`, `categorias`, `formas-pagamento`, `dominios`, `status-viagem`, `perfis`, `configuracoes`, `relatorios`.
- Effects chamam os services; reducers puros; selectors memoizados.

## Validação

- `npm test` — spec por service (mock do `SupabaseService`).
- `npm run lint` e `npm run build`.
