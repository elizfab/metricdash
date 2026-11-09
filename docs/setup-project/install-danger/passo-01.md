# DangerJS e Governança de Pull Requests — Etapa 05

## 1. Objetivo

Instalar e configurar o DangerJS para validar automaticamente commits, branches, títulos e descrições de Pull Requests, e criar a automação de Pull Requests via GitHub Actions.

## 2. Pré-requisitos

- Repositório Git vinculado ao GitHub (`elizfab/metricdash`).
- Branches `main` e `develop` publicadas.
- Node.js 24.22.0 / npm 11.19.1.
- `ts-node` já instalado (Etapa 04) para executar o `dangerfile.ts`.

## 3. Versões utilizadas

| Ferramenta          | Versão |
| ------------------- | ------ |
| danger              | 14.1.0 |
| ts-node             | 10.9.2 |
| actions/checkout    | v4.2.2 |
| actions/setup-node  | v4.4.0 |
| GitHub Actions      | ubuntu-latest |

## 4. Comandos executados

```bash
npm install -D danger
npx danger local --base main   # validação local do dangerfile
```

## 5. Explicação dos comandos

- `npm install -D danger`: instala o DangerJS como dependência de desenvolvimento.
- `danger local`: executa o `dangerfile.ts` localmente contra um range de commits, permitindo validar a sintaxe e a execução das regras sem um PR real.

## 6. Arquivos criados ou modificados

- `dangerfile.ts` — regras de validação do Danger.
- `package.json` — dependência `danger` e script `"danger": "danger ci"`.
- `.github/workflows/ci.yml` — esteira de validação (lint, testes, build).
- `.github/workflows/danger.yml` — execução do DangerJS em Pull Requests.
- `.github/workflows/auto-pr.yml` — criação automática de PR para branches `feature/*`.

## 7. Configurações realizadas

### 7.1 Dangerfile (`dangerfile.ts`)

Regras implementadas:

| Regra | Tipo | Descrição |
| ----- | ---- | --------- |
| Mensagens de commit | `fail` | Exige prefixo `funcionalidade|correcao|configuracao|documentacao|testes|refatoracao:` + descrição ≥ 10 caracteres; rejeita mensagens genéricas (`ajustes`, `teste`, `update`, `correção` etc.). |
| Idioma dos commits | `warn` | Avisa quando títulos de commit parecem estar em inglês. |
| Nome da branch | `fail` | Exige padrão `feature|fix|chore|docs|hotfix|refactor/<kebab-case>`; bloqueia `main` e `develop` como origem de PR. |
| Destino do PR | `fail` | Exige `develop` como base; apenas `hotfix/*` pode mirar `main`. |
| Título do PR | `fail`/`warn` | Exige prefixo em português (`Funcionalidade:`, `Correção:`, etc.) e descrição clara; avisa se parecer em inglês. |
| Descrição do PR | `fail`/`warn` | Falha se vazia; avisa se faltarem as seções Objetivo, Alterações realizadas, Validações e Documentação. |
| PR grande | `warn` | Alerta acima de 1000 linhas alteradas ou 60 arquivos. |
| Lockfile | `warn` | Alerta divergência entre `package.json` e `package-lock.json`. |
| `console.log`/`TODO`/`FIXME` | `warn` | Alerta sobre linhas adicionadas em código de produção. |
| Docs de configuração | `warn` | Alerta alterações em configs sem documentação em `docs/`. |
| Arquivos sensíveis | `warn` | Alerta alterações em `.env`, chaves e arquivos de credenciais. |

`fail` é usado somente para violações obrigatórias; demais verificações usam `warn`.

### 7.2 GitHub Actions

**`ci.yml`** — executa em PRs para `develop`/`main` e pushes nessas branches:
`npm ci` → `npm run lint` → `npm test` → `npm run build`. Permissão: `contents: read`.

**`danger.yml`** — executa em eventos de PR (`opened`, `synchronize`, `reopened`, `edited`):
`npm ci` → `npx danger ci` com `GITHUB_TOKEN` (permissões `contents: read`, `pull-requests: write`, `issues: write`).

**`auto-pr.yml`** — executa em push para `feature/**`:
1. Verifica se já existe PR aberto para a branch (`gh pr list`).
2. Se não existir, cria PR com destino `develop`, título `Funcionalidade: <descrição-da-branch>` e corpo no modelo padronizado.
3. Não cria PR para `fix/`, `chore/`, `docs/`, `hotfix/`, `refactor/`, `main` ou `develop` (o gatilho só cobre `feature/**`).

Permissões mínimas: `contents: read` + `pull-requests: write`. Usa `secrets.GITHUB_TOKEN` — nenhuma credencial exposta.

## 8. Como validar

```bash
npm run danger          # danger ci (requer contexto de CI/PR)
npx danger local        # validação local do dangerfile
npx eslint dangerfile.ts
```

Validação dos workflows: parse YAML (`python3 -c "import yaml; yaml.safe_load(...)"`) e `bash -n` no script do `auto-pr.yml`.

## 9. Resultado esperado

- `danger local` executa o dangerfile sem erros.
- Em PRs, o Danger comenta violações e falha builds fora do padrão.
- Push em `feature/*` dispara criação automática de PR para `develop` (somente se não houver PR aberto).

## 10. Validação executada

- `npx danger local --base main` → "Danger: ✓ passed review, received no feedback." (dangerfile executa sem erros).
- `npx tsc --noEmit` no `dangerfile.ts` → sem erros de tipagem.
- `npx eslint dangerfile.ts` → sem erros.
- YAMLs validados com parser; script shell do `auto-pr.yml` validado com `bash -n`.

## 11. Limitações

- A criação real de PR pelo workflow `auto-pr.yml` só pode ser validada em um push real de branch `feature/*` no GitHub — não foi simulada (conforme orientação do documento).
- `danger ci` requer contexto de Pull Request; localmente usa-se `danger local`.
- A detecção de idioma é heurística (prefixo obrigatório + presença de acentuação/palavras em português).

## 12. Possíveis problemas e soluções

| Problema | Solução |
| -------- | ------- |
| `danger ci` falha localmente | Esperado fora do CI; usar `danger local` ou `danger pr`. |
| Danger não comenta no PR | Verificar permissões `pull-requests: write` e `issues: write` no workflow. |
| PR duplicado | O workflow verifica PRs abertos antes de criar; PRs fechados não bloqueiam novo PR. |
| `dangerfile.ts` não executa | Garantir `ts-node` instalado e `"danger": "danger ci"` no package.json. |
