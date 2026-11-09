# METRICDASH — INICIALIZAÇÃO DO PROJETO FRONTEND

Atue como Senior Frontend Engineer, especialista em Angular, TypeScript, arquitetura frontend, DevOps, Git, CI/CD, qualidade de código e design systems.

Sua responsabilidade é preparar a estrutura inicial do MetricDash, seguindo rigorosamente as especificações abaixo.

O projeto deverá ser organizado, documentado, testável, versionado e preparado para evoluir.

# 1. CONTEXTO DO PROJETO

**Nome:** MetricDash

**Descrição:** Plataforma para visualização, organização e acompanhamento de métricas, indicadores e informações financeiras.

**Identidade:**

"Eu sou o Dash: MetricDash — Para quem ama métricas e indicadores."

**Stack principal:**

- Angular — última versão estável.
- TypeScript.
- Sass/SCSS.
- NgRx.
- NG-ZORRO.
- Jest.
- ESLint.
- DangerJS.
- Playwright.
- GitHub Actions.
- Open Sans.

## 1.1. Regras gerais

- O frontend deverá ser desenvolvido integralmente em TypeScript.
- Utilizar Sass/SCSS para todos os estilos.
- Utilizar componentes standalone do Angular.
- Utilizar tipagem estrita.
- Não utilizar `any`.
- Não utilizar Jasmine ou Karma.
- Não utilizar TSLint.
- Não instalar dependências sem necessidade.
- Verificar compatibilidade entre todas as ferramentas.
- Não utilizar `--force` ou `--legacy-peer-deps` para contornar incompatibilidades sem autorização.
- Respeitar a arquitetura definida neste documento.

Arquivos de configuração, YAML, JSON e scripts Node.js poderão utilizar seus formatos nativos. O script de screenshots deverá ser `.mjs`, conforme solicitado.

---

# 2. DIRETÓRIOS E DOCUMENTAÇÃO OBRIGATÓRIA

Diretório principal:

`/home/elizabetefabri/repos/projetos-pessoais/finanças`

Repositório:

`https://github.com/elizfab/metricdash.git`

Todas as instalações, configurações e alterações técnicas deverão ser documentadas em:

`/home/elizabetefabri/repos/projetos-pessoais/finanças/docs/setup-project`

Estrutura esperada:

```text
docs/
└── setup-project/
    ├── install-angular/
    │   └── passo-01.md
    ├── setup-git/
    │   └── passo-01.md
    ├── install-ngrx/
    │   └── passo-01.md
    ├── install-ng-zorro/
    │   └── passo-01.md
    ├── install-jest/
    │   └── passo-01.md
    ├── install-eslint/
    │   └── passo-01.md
    ├── install-danger/
    │   └── passo-01.md
    ├── install-playwright/
    │   └── passo-01.md
    ├── setup-scss/
    │   └── passo-01.md
    ├── setup-themes/
    │   └── passo-01.md
    └── setup-project/
        └── passo-01.md
```

Cada documentação deverá conter:

1. Objetivo.
2. Pré-requisitos.
3. Versões utilizadas.
4. Comandos executados.
5. Explicação dos comandos.
6. Arquivos criados ou modificados.
7. Configurações realizadas.
8. Como validar.
9. Resultado esperado.
10. Possíveis problemas e soluções.

Não registrar apenas os comandos. Explicar cada procedimento de maneira didática e técnica.

---

# 3. ETAPA 01 — GIT E ORGANIZAÇÃO DAS BRANCHES

## 3.1. Clonar o repositório

Clonar o repositório:

`https://github.com/elizfab/metricdash.git`

Antes de executar qualquer comando:

- Verificar se o diretório já existe.
- Verificar se o repositório já foi clonado.
- Verificar a branch atual.
- Verificar alterações pendentes.
- Preservar os arquivos existentes.
- Não sobrescrever configurações.

## 3.2. Criar a branch develop

A branch principal de desenvolvimento será:

`develop`

Procedimento:

1. Buscar as referências atualizadas do repositório remoto.
2. Verificar se a branch `develop` já existe localmente.
3. Verificar se existe remotamente.
4. Se não existir, criá-la a partir da branch principal atualizada (`main`).
5. Caso já exista, utilizar a versão remota atualizada, preservando eventuais alterações locais.
6. Fazer checkout para `develop`.
7. Publicar a branch remotamente, caso ainda não esteja publicada e haja autorização de acesso.

A branch `main` deverá ser preservada.

Não realizar desenvolvimento diretamente na `main`.

## 3.3. Estratégia de branches

Adotar a seguinte convenção:

| Prefixo     | Finalidade                 |
| ----------- | -------------------------- |
| `feature/`  | Novas funcionalidades      |
| `fix/`      | Correções                  |
| `chore/`    | Configurações e manutenção |
| `docs/`     | Documentação               |
| `hotfix/`   | Correções urgentes         |
| `refactor/` | Refatorações               |

Exemplos:

```text
feature/initial-dashboard
feature/theme-configuration
fix/angular-routing
chore/setup-jest
docs/project-architecture
```

Toda branch deverá possuir um nome descritivo, utilizando kebab-case.

A branch `develop` será a base de integração das alterações.

A branch `main` será preservada como branch principal de referência.

## 3.4. Commits em português

Todos os títulos e descrições dos commits deverão ser escritos em português.

Utilizar os seguintes prefixos:

```text
funcionalidade:
correcao:
configuracao:
documentacao:
testes:
refatoracao:
```

Exemplos:

```text
configuracao: inicializa projeto Angular na versão estável mais recente

documentacao: registra processo de instalação do Angular

configuracao: adiciona fonte Open Sans ao projeto

configuracao: instala e configura gerenciamento de estado com NgRx

testes: configura ambiente de testes com Jest

configuracao: adiciona validações de qualidade com DangerJS

configuracao: prepara automação de pull requests
```

Regras:

- Mensagens claras e objetivas.
- Não utilizar mensagens genéricas.
- Não utilizar mensagens em inglês.
- Não realizar commits vazios.
- Não misturar alterações sem relação entre si.
- Cada entrega deverá possuir seu commit correspondente.

Antes de cada commit, verificar o `git status`, revisar o diff e validar os arquivos.

Documentar o fluxo Git em:

`docs/setup-project/setup-git/passo-01.md`

---

# 4. ETAPA 02 — ANGULAR

Utilizar a última versão estável do Angular disponível no momento da instalação.

Verificar a compatibilidade com Node.js, TypeScript e todas as dependências.

Configurações:

- Angular standalone.
- TypeScript strict.
- Sass/SCSS.
- Angular Router.
- Estrutura modular.
- Configuração de ambiente.
- Porta 6080.

Executar:

```bash
ng serve --port 6080
```

URL:

`http://localhost:6080`

Criar a documentação:

`docs/setup-project/install-angular/passo-01.md`

COMMIT OBRIGATÓRIO em português.

---

# 5. ETAPA 03 — LIMPEZA DO PROJETO

Remover arquivos padrão que não serão utilizados:

- Imagens de demonstração.
- Logos padrão.
- Componentes de exemplo.
- Estilos desnecessários.
- Arquivos de demonstração.
- Resíduos de configurações antigas.

Remover completamente Jasmine e Karma, incluindo dependências, configurações, scripts e referências.

Não remover recursos necessários ao Angular.

Criar a apresentação inicial:

```html
<h1>Eu sou o Dash: MetricDash</h1>
<p>Para quem ama métricas e indicadores.</p>
```

Configurar:

```html
<title>MetricDash</title>
```

Não desenvolver funcionalidades adicionais.

COMMIT OBRIGATÓRIO em português.

---

# 6. ETAPA 04 — INSTALAÇÃO DAS FERRAMENTAS

## 6.1. NgRx

Instalar e configurar versões compatíveis com Angular.

Avaliar os pacotes necessários:

- @ngrx/effects
- @ngrx/entity
- @ngrx/store
- @ngrx/store-devtools

Preparar a estrutura inicial de gerenciamento de estado.

Não criar estados de funcionalidades que ainda não existem.

Documentar em:

`docs/setup-project/install-ngrx/passo-01.md`

## 6.2. NG-ZORRO

Instalar a biblioteca NG-ZORRO.

Configurar:

- Componentes.
- Estilos.
- Ícones.
- Integração com SCSS.
- Compatibilidade com standalone.

Não desenvolver componentes de negócio.

Documentar em:

`docs/setup-project/install-ng-zorro/passo-01.md`

## 6.3. Jest

Instalar e configurar Jest para testes de:

- Componentes.
- Serviços.
- Pipes.
- Diretivas.
- Funções.
- Tipos e contratos.

Configurar:

- Presets compatíveis com Angular.
- TypeScript.
- Ambiente de testes.
- Cobertura.
- Scripts no package.json.

Não utilizar Jasmine ou Karma.

Documentar em:

`docs/setup-project/install-jest/passo-01.md`

## 6.4. ESLint

Configurar ESLint com integração ao Angular e TypeScript.

Regras iniciais:

- Tipagem segura.
- Prevenção de código não utilizado.
- Padronização.
- Organização.
- Boas práticas Angular.
- Qualidade de código.

Adicionar scripts para lint.

Documentar em:

`docs/setup-project/install-eslint/passo-01.md`

---

# 7. ETAPA 05 — DANGERJS E GOVERNANÇA DE PULL REQUESTS

Instalar e configurar DangerJS para validar automaticamente as contribuições realizadas no repositório.

Objetivo: estabelecer regras de qualidade para commits, branches e Pull Requests antes da integração na `develop`.

## 7.1. Instalação

Instalar DangerJS como dependência de desenvolvimento.

Criar a configuração de regras do DangerJS.

Preferencialmente utilizar:

`dangerfile.ts`

Garantir que a execução do arquivo TypeScript esteja devidamente configurada.

Adicionar os scripts necessários ao `package.json`, por exemplo:

```json
{
  "scripts": {
    "danger": "danger ci"
  }
}
```

Documentar em:

`docs/setup-project/install-danger/passo-01.md`

## 7.2. Validação de mensagens de commit

O Danger deverá verificar os títulos dos commits incluídos no Pull Request.

Padrão permitido:

```text
funcionalidade: descrição da alteração
correcao: descrição da alteração
configuracao: descrição da alteração
documentacao: descrição da alteração
testes: descrição da alteração
refatoracao: descrição da alteração
```

Regras:

- Mensagens em português.
- Prefixo obrigatório.
- Descrição clara.
- Não permitir mensagens vazias.
- Não permitir mensagens genéricas como `ajustes`, `teste`, `update` ou `correção`.

Quando houver mensagens inválidas, apresentar comentários explicando o problema.

## 7.3. Validação do nome das branches

Validar o padrão das branches de origem dos Pull Requests.

Padrões aceitos:

```text
feature/*
fix/*
chore/*
docs/*
hotfix/*
refactor/*
```

A branch `develop` e a branch `main` deverão ser tratadas como branches protegidas, não como branches de trabalho.

Se o nome não respeitar o padrão, apresentar uma mensagem de erro explicativa.

## 7.4. Validação do título do Pull Request

Validar o título do PR.

O título deverá:

- Estar em português.
- Ser claro e descritivo.
- Informar o objetivo da alteração.
- Utilizar um dos prefixos padronizados.

Exemplos:

```text
Funcionalidade: criação da estrutura inicial do dashboard

Configuração: instalação e configuração do Jest

Correção: ajuste na configuração das rotas

Documentação: criação do guia de instalação do projeto
```

Rejeitar títulos genéricos ou vazios.

## 7.5. Validação da descrição do Pull Request

O Danger deverá verificar se a descrição do PR contém:

- Objetivo da alteração.
- Resumo das mudanças.
- Validações executadas.
- Evidências, quando aplicáveis.
- Documentação relacionada.

Utilizar um modelo de descrição:

```markdown
## Objetivo

Descrever o motivo da alteração.

## Alterações realizadas

- Item 1.
- Item 2.

## Validações

- [ ] Build executado.
- [ ] Testes executados.
- [ ] ESLint executado.

## Evidências

Adicionar screenshots quando aplicável.

## Documentação

Informar os arquivos de documentação relacionados.
```

## 7.6. Outras validações recomendadas para Danger

Implementar também as seguintes verificações:

1. Alertar quando um Pull Request possuir alterações excessivamente grandes.
2. Alertar quando houver arquivos de documentação ausentes para alterações de configuração.
3. Alertar sobre arquivos `console.log` adicionados ao código de produção.
4. Alertar sobre comentários `TODO` e `FIXME` adicionados.
5. Alertar quando arquivos de configuração importantes forem modificados sem justificativa na descrição do PR.
6. Verificar se o Pull Request possui uma descrição preenchida.
7. Verificar se o destino do PR é `develop`.
8. Verificar se não existem arquivos de dependências desatualizados em relação ao `package.json`, como divergências no lockfile.
9. Alertar sobre alterações em arquivos sensíveis, como configurações de ambiente e dependências.
10. Verificar se os commits seguem a convenção estabelecida.

Utilizar `warn` para recomendações e `fail` somente para violações obrigatórias.

Não criar regras excessivamente restritivas que dificultem o desenvolvimento.

## 7.7. GitHub Actions — Esteira de validação

Criar os workflows necessários em:

`.github/workflows/`

Configurar a esteira para executar as verificações nos eventos apropriados:

- Pull Requests direcionados à `develop`.
- Pull Requests direcionados à `main`, quando aplicável.
- Pushes em branches de desenvolvimento, conforme necessário.

A esteira deverá executar:

1. Instalação das dependências com `npm ci`.
2. Verificação do ESLint.
3. Execução dos testes Jest.
4. Verificação de build.
5. Execução do DangerJS nos Pull Requests.

Utilizar versões estáveis e fixadas das Actions sempre que possível.

Configurar permissões mínimas necessárias para cada workflow.

Não armazenar tokens ou credenciais no código.

Utilizar GitHub Secrets e variáveis de ambiente quando necessário.

## 7.8. Criação automática de Pull Requests

Configurar uma automação utilizando GitHub Actions.

**Regra principal: somente branches iniciadas com `feature/` poderão gerar Pull Requests automaticamente.**

Exemplo:

```text
feature/initial-dashboard
feature/theme-configuration
feature/financial-overview
```

Comportamento esperado:

1. Quando houver push em uma branch `feature/*`, iniciar o workflow.
2. Verificar se já existe um Pull Request aberto para aquela branch.
3. Caso não exista, criar automaticamente um Pull Request.
4. Definir `develop` como branch de destino.
5. Gerar um título em português, descritivo e compatível com o padrão de PR.
6. Utilizar o modelo de descrição padronizado.
7. Não duplicar Pull Requests existentes.
8. Não criar PR automaticamente para branches `fix/`, `chore/`, `docs/`, `hotfix/` ou `refactor/`.
9. Não criar PR automaticamente para `main` ou `develop`.

O workflow deverá possuir permissão mínima de escrita para Pull Requests.

Utilizar `GITHUB_TOKEN` ou outro mecanismo oficial do GitHub Actions, sem expor credenciais.

O DangerJS deverá validar o PR depois de sua criação.

**Importante:** a criação automática do PR será responsabilidade do GitHub Actions. O DangerJS será responsável pelas validações e comentários de qualidade.

Se não houver autorização ou credenciais disponíveis para testar a criação real do PR, deixar a automação configurada e documentar a limitação. Não simular uma execução bem-sucedida.

Documentar todo o processo em:

`docs/setup-project/install-danger/passo-01.md`

---

# 8. ETAPA 06 — PLAYWRIGHT E ESTRUTURA DE SCREENSHOTS

Preparar o projeto para futuras capturas de tela da aplicação.

Utilizar Playwright como ferramenta de automação de navegador e captura de screenshots.

Instalar a dependência necessária e verificar sua compatibilidade com o ambiente.

## 8.1. package.json

Adicionar exatamente o seguinte script:

```json
{
  "scripts": {
    "screenshots": "node scripts/screenshots.mjs"
  }
}
```

Preservar os demais scripts já existentes.

## 8.2. Criar diretório e arquivo

Criar somente:

```text
scripts/
└── screenshots.mjs
```

O arquivo deverá existir e ser executável por meio de:

```bash
npm run screenshots
```

Nesta etapa:

- Não criar cenários de captura.
- Não criar imagens.
- Não criar pastas adicionais de screenshots.
- Não criar componentes para captura.
- Não implementar fluxos de navegação.
- Não configurar relatórios visuais.
- Não adicionar funcionalidades que ainda não foram solicitadas.

O arquivo deverá conter apenas uma estrutura inicial documentada, informando que a implementação das capturas será realizada posteriormente.

Garantir que o comando possa ser executado sem erros, mesmo sem os cenários de captura implementados.

Documentar em:

`docs/setup-project/install-playwright/passo-01.md`

COMMIT OBRIGATÓRIO em português.

---

# 9. ETAPA 07 — TIPOGRAFIA E ARQUITETURA SCSS

## 9.1. Fonte

Utilizar Open Sans em toda a aplicação.

Configurar a fonte globalmente.

## 9.2. Estrutura de estilos

Criar:

```text
src/styles/
├── abstracts/
│   └── _variables.scss
├── base/
│   ├── _reset.scss
│   └── _typography.scss
├── themes/
│   ├── _light-theme.scss
│   └── _dark-theme.scss
└── styles.scss
```

Responsabilidades:

- abstracts: variáveis e tokens.
- base: reset e tipografia.
- themes: temas visuais.
- styles.scss: ponto de entrada global.

Utilizar Sass moderno, CSS Custom Properties e organização por responsabilidades.

## 9.3. Paleta oficial inicial — DARK

Adotar a seguinte paleta inicial:

| Token                   | Cor     |
| ----------------------- | ------- |
| Background principal    | #171725 |
| Header                  | #242438 |
| Sidebar                 | #242438 |
| Cards                   | #242438 |
| Superfícies secundárias | #2D2D43 |
| Bordas                  | #38384F |
| Texto principal         | #FDF7FE |
| Texto secundário        | #B8B8CC |
| Destaque rosa           | #E7ABD8 |
| Ícones                  | #E7ABD8 |
| Background dos ícones   | #4A3D54 |
| Azul principal          | #17B4DA |
| Azul profundo           | #17405B |
| Amarelo                 | #FFC506 |
| Vermelho                | #E94D4D |

Utilizar o rosa e o azul como cores de destaque.

O amarelo deverá ser reservado para alertas e informações importantes.

O vermelho deverá ser utilizado para erros e situações críticas.

Não utilizar todas as cores simultaneamente em um mesmo componente.

Garantir contraste e legibilidade.

## 9.4. Tema LIGHT

Preparar uma versão clara com:

- Background principal claro.
- Cards brancos.
- Texto escuro.
- Bordas discretas.
- Destaques rosa e azul.
- Estados de alerta, erro e sucesso.

Os dois temas deverão compartilhar os mesmos nomes de tokens semânticos.

O tema inicial será Dark.

Não implementar seletor visual de temas nesta etapa.

Documentar em:

- `docs/setup-project/setup-scss/passo-01.md`
- `docs/setup-project/setup-themes/passo-01.md`

---

# 10. ETAPA 08 — ESTRUTURA DE DIRETÓRIOS

Criar a seguinte organização:

```text
src/
├── app/
│   ├── core/
│   │   ├── interceptors/
│   │   ├── services/
│   │   ├── models/
│   │   ├── types/
│   │   └── enums/
│   │
│   ├── shared/
│   │   ├── components/
│   │   └── types/
│   │
│   ├── pages/
│   │   ├── dashboard/
│   │   ├── login/
│   │   └── logout/
│   │
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.config.ts
│   └── app.routes.ts
│
├── environments/
│   ├── environment.ts
│   └── environment.development.ts
│
├── styles/
│   ├── abstracts/
│   ├── base/
│   ├── themes/
│   └── styles.scss
│
├── index.html
└── main.ts

scripts/
└── screenshots.mjs

docs/
└── setup-project/

.github/
└── workflows/
```

Respeitar as convenções oficiais da versão do Angular instalada.

Não criar arquivos vazios desnecessários.

Não duplicar responsabilidades.

---

# 11. ETAPA 09 — PÁGINAS E ROTAS

Criar as páginas:

## Dashboard

Diretório:

`src/app/pages/dashboard/`

Conteúdo inicial:

```html
<h1>Dashboard</h1>
```

## Login

Diretório:

`src/app/pages/login/`

Conteúdo inicial:

```html
<h1>Login</h1>
```

## Logout

Diretório:

`src/app/pages/logout/`

Criar o componente inicial.

## Rotas

| Rota       | Página    |
| ---------- | --------- |
| /dashboard | Dashboard |
| /login     | Login     |
| /logout    | Logout    |

Utilizar Angular Router e configuração standalone.

Garantir que todas as rotas possam ser acessadas diretamente.

Não implementar autenticação, guards ou redirecionamentos de negócio.

---

# 12. ETAPA 10 — DOCUMENTAÇÃO INICIAL DO PROJETO

Criar uma documentação de apresentação do MetricDash.

O documento deverá possuir:

- Header.
- Main.
- Footer.

Incluir:

1. Nome do projeto.
2. Descrição.
3. Objetivo.
4. Stack tecnológica.
5. Ferramentas utilizadas.
6. Estrutura de diretórios.
7. Como instalar.
8. Como executar.
9. Como testar.
10. Como executar o lint.
11. Como executar os screenshots.
12. Convenções Git.
13. Fluxo de branches.
14. Regras de Pull Requests.
15. Links do repositório e ferramentas oficiais.

Manter uma apresentação profissional e objetiva.

Não criar documentação de funcionalidades futuras.

---

# 13. ETAPA 11 — VALIDAÇÃO FINAL

Executar as validações:

### Angular

- Build.
- Execução na porta 6080.
- Acesso às rotas.

### TypeScript

- Compilação.
- Verificação de tipagem estrita.

### Jest

- Execução dos testes.
- Relatório de cobertura.

### ESLint

- Execução do lint.

### DangerJS

- Validação de configuração.
- Verificação das regras implementadas.

### Playwright

- Verificar instalação.
- Executar o comando `npm run screenshots`.

### Git

- Confirmar branch `develop`.
- Conferir commits.
- Conferir arquivos modificados.
- Confirmar documentação.

### GitHub Actions

- Validar os arquivos YAML.
- Conferir permissões.
- Conferir os eventos configurados.
- Conferir as regras de criação automática de PR.

Não declarar nenhuma validação como concluída sem executá-la.

---

# 14. RESTRIÇÕES DO ESCOPO

Este é o início do projeto.

NÃO desenvolver:

- Dashboard financeiro funcional.
- Gráficos.
- Indicadores.
- Cadastro de despesas.
- CRUD.
- APIs.
- Backend.
- Banco de dados.
- Autenticação.
- Recuperação de senha.
- Permissões.
- Componentes financeiros.
- Seletor funcional de temas.
- Capturas reais de telas.
- Cenários de screenshots.
- Funcionalidades não solicitadas.

Não antecipar próximas etapas.

Se houver incompatibilidade técnica, interromper a instalação correspondente e apresentar o problema e a alternativa antes de alterar as decisões definidas.

---

# 15. RELATÓRIO FINAL

Ao concluir, apresentar:

1. Versões do Angular, Node.js e TypeScript.
2. Versões das dependências instaladas.
3. Estrutura de diretórios criada.
4. Páginas e rotas.
5. Configuração do NgRx.
6. Configuração do NG-ZORRO.
7. Configuração do Jest.
8. Configuração do ESLint.
9. Configuração do DangerJS.
10. Regras de validação implementadas.
11. Automação de Pull Requests.
12. Configuração do Playwright.
13. Arquivos de screenshots criados.
14. Paleta e arquitetura de temas.
15. Documentações criadas.
16. Commits realizados.
17. Resultado das validações.
18. Pendências e impedimentos.

Informar os caminhos completos dos arquivos criados.

## INSTRUÇÃO FINAL

Execute as etapas na ordem apresentada.

Antes de cada alteração, analise o estado atual do repositório.

Não sobrescreva arquivos existentes.

Documente todas as instalações e configurações.

Realize commits com mensagens em português.

Não avance para funcionalidades futuras.

**O resultado esperado é a estrutura inicial do MetricDash em Angular, com TypeScript, Sass, governança Git, automação de Pull Requests, qualidade de código, testes e documentação técnica.**

Implemente somente o escopo descrito neste documento.
