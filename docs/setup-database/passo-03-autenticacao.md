# Passo 03 — Autenticação e Login

## Objetivo

Implementar login no MetricDash usando **Supabase Auth**, com perfil de usuário na tabela `perfis`.

## Como funciona

- O Supabase Auth gerencia `auth.users` (e-mail/senha, JWT, refresh token).
- A tabela `perfis` espelha dados de exibição (`nome`, `tema_preferido`, etc.) vinculados por `auth_user_id`.
- O frontend usa `@supabase/supabase-js`; o Angular Router protege as rotas via guard (a criar na etapa de autenticação).

## Passo a passo no Supabase

1. **Authentication → Providers**: habilitar *Email* (e, opcionalmente, Google/GitHub depois).
2. **Project Settings → API**: copiar `Project URL` e `anon public key`.
3. Guardar em `src/environments/environment.ts` (produção) e `environment.development.ts` (dev) — **nunca commitar secrets reais**; usar variáveis de ambiente ou `.env` local.

```ts
// src/environments/environment.ts
export const environment = {
  production: true,
  supabase: {
    url: 'https://SEU-PROJETO.supabase.co',
    anonKey: 'SUA-ANON-KEY',
  },
};
```

## Sincronização `auth.users` → `perfis`

Duas opções:

**A) Trigger no banco (recomendado):**

```sql
create or replace function criar_perfil()
returns trigger language plpgsql security definer as $$
begin
  insert into perfis (auth_user_id, nome)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', split_part(new.email,'@',1)));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function criar_perfil();
```

**B) No signup do frontend:** após `signUp`, inserir em `perfis` com o `id` retornado.

## Endpoints (frontend ↔ Supabase)

| Ação | Como |
| ---- | ---- |
| Login | `supabase.auth.signInWithPassword({ email, password })` |
| Logout | `supabase.auth.signOut()` |
| Sessão atual | `supabase.auth.getSession()` / `onAuthStateChange` |
| Registro | `supabase.auth.signUp({ email, password, options: { data: { nome } } })` |

Mapeamento para as rotas da API (quando houver backend): `/auth/entrar`, `/auth/sair`, `/auth/eu`, `/auth/registro`, `/auth/perfil`.

## Rotas do frontend

| Rota | Página | Acesso |
| ---- | ------ | ------ |
| `/login` | Login | público |
| `/logout` | Logout | autenticado |
| `/dashboard`, `/lancamentos`, `/viagens`, `/resumo-mensal`, `/configuracoes` | protegidas | guard de autenticação |

## Validação

- Login com usuário criado no Supabase Auth.
- `perfis` populada automaticamente após signup.
- Guard redireciona anônimos para `/login`.
