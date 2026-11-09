# Passo 03 — Autenticação

Base: `docs/setup-database/passo-03-autenticacao.md`.

## Implementação

1. `auth.service.ts` — wrapper de `supabase.auth` (`entrar`, `sair`, `sessao`, `onAuthStateChange`).
2. `auth.guard.ts` — `CanActivateFn` que verifica sessão; sem sessão → `router.navigate(['/login'])`.
3. `auth.interceptor.ts` — injeta/renova token nas chamadas (se usar API REST; com supabase-js o client já gerencia).
4. Store `auth` — state `{ usuario, perfil, carregando, erro }`; actions `entrar`, `sair`, `sessaoRestaurada`.
5. Página `/login` — `nz-form` (e-mail/senha) → `auth.service.entrar()` → redirect `/dashboard`.
6. Página `/logout` — chama `sair()` → redirect `/login`.

## Rotas protegidas

```ts
{ path: 'dashboard', loadComponent: ..., canActivate: [authGuard] }
{ path: 'lancamentos', ..., canActivate: [authGuard] }
{ path: 'viagens', ..., canActivate: [authGuard] }
{ path: 'resumo-mensal', ..., canActivate: [authGuard] }
{ path: 'configuracoes', ..., canActivate: [authGuard] }
```

## Perfil

Após login, carregar `perfis` por `auth_user_id` → `perfil.service` → store. `tema_preferido` pode alimentar o seletor de temas futuro.

## Validação

- Sem sessão: `/dashboard` redireciona para `/login`.
- Com sessão: login → dashboard carrega.
- Logout → volta para `/login` e sessão invalidada.
