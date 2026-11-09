# Setup Git — Etapa 01

## 1. Objetivo

Inicializar o repositório Git do MetricDash, publicar a branch `main` e criar a branch `develop` como base de integração do desenvolvimento, seguindo a convenção de branches definida no projeto.

## 2. Pré-requisitos

- Git instalado (`git version 2.34.1`).
- Acesso ao repositório remoto `https://github.com/elizfab/metricdash.git` (autenticado via `gh`/SSH).
- Diretório de trabalho: `/home/elizabetefabri/repos/projetos-pessoais/finanças`.

## 3. Versões utilizadas

| Ferramenta | Versão |
| ---------- | ------ |
| Git        | 2.34.1 |
| GitHub CLI | autenticado (conta `elizabetefabri`) |

## 4. Estado inicial verificado

Antes de qualquer comando, foram verificados:

- O diretório existia e **não** era um repositório Git (`git status` → "not a git repository").
- O repositório remoto existia, porém estava **vazio** (`gh api repos/elizfab/metricdash` → `size: 0`, branch padrão `main`, sem commits).
- O diretório local já continha arquivos de documentação (`documentation.md`, `documentation-02.md`, `docs/init-project.md`).

Como o remoto estava vazio, não havia `main` para clonar; o repositório foi inicializado localmente com `git init -b main` e a branch `main` foi publicada com o commit inicial dos arquivos existentes. Nenhum arquivo foi sobrescrito.

## 5. Comandos executados

```bash
# Inicializa o repositório já na branch main
git init -b main

# Adiciona os arquivos existentes (documentação) e cria o commit inicial
git add -A
git commit -m "documentacao: adiciona documentacao inicial do projeto MetricDash"

# Configura o remoto e publica a main
git remote add origin https://github.com/elizfab/metricdash.git
git push -u origin main

# Cria e publica a branch de desenvolvimento a partir da main atualizada
git checkout -b develop
git push -u origin develop
```

## 6. Explicação dos comandos

- `git init -b main`: inicializa o repositório local já na branch `main`, preservando os arquivos existentes.
- `git add -A` / `git commit`: versiona a documentação inicial do projeto na `main` (commit em português, conforme convenção).
- `git remote add origin`: vincula o diretório local ao repositório remoto `elizfab/metricdash`.
- `git push -u origin main`: publica a `main` e configura o tracking.
- `git checkout -b develop`: cria a branch `develop` a partir da `main` atualizada.
- `git push -u origin develop`: publica a `develop` e configura o tracking.

## 7. Arquivos criados ou modificados

- `.git/` — repositório Git inicializado.
- Nenhum arquivo de projeto foi criado nesta etapa.

## 8. Configurações realizadas

### Convenção de branches

| Prefixo     | Finalidade                 |
| ----------- | -------------------------- |
| `feature/`  | Novas funcionalidades      |
| `fix/`      | Correções                  |
| `chore/`    | Configurações e manutenção |
| `docs/`     | Documentação               |
| `hotfix/`   | Correções urgentes         |
| `refactor/` | Refatorações               |

- `develop` é a base de integração.
- `main` é preservada como branch principal de referência.
- Nenhum desenvolvimento deve ser feito diretamente na `main`.
- Nomes de branches em kebab-case e descritivos.

### Convenção de commits (português)

```text
funcionalidade:
correcao:
configuracao:
documentacao:
testes:
refatoracao:
```

## 9. Como validar

```bash
git branch -a          # deve listar main e develop (local e remota)
git status             # deve mostrar "nothing to commit" na develop
git log --oneline      # deve exibir o commit inicial em português
```

## 10. Resultado esperado

- Repositório local inicializado e vinculado ao remoto.
- Branches `main` e `develop` publicadas no GitHub.
- Branch atual: `develop`.
- Commit inicial em português na `main`.

## 11. Possíveis problemas e soluções

| Problema | Solução |
| -------- | ------- |
| Repositório remoto vazio (sem `main`) | Inicializar localmente com `git init -b main` e publicar a `main` antes de criar a `develop`. |
| Diretório não vazio ao clonar | Como o diretório já continha documentação, optou-se por `git init` + `git remote add` em vez de `git clone`. |
| Erro de autenticação no push | Verificar credenciais com `gh auth status` e `git config --get credential.helper`. |
