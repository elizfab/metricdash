# Setup SCSS e Tipografia — Etapa 07.1

## 1. Objetivo

Configurar a fonte Open Sans globalmente e criar a arquitetura SCSS escalável do projeto, com separação por responsabilidades (abstracts, base, themes).

## 2. Pré-requisitos

- Projeto Angular com SCSS (`--style scss`, `inlineStyleLanguage: "scss"`).
- Sass moderno via `angular-sass` (builder `@angular/build`).

## 3. Versões utilizadas

| Item              | Versão |
| ----------------- | ------ |
| Angular           | 22.2.x |
| Sass (dart-sass)  | via `@angular/build` |
| Fonte             | Open Sans (Google Fonts) |

## 4. Comandos executados

Nenhum comando de instalação foi necessário — SCSS já estava configurado pelo Angular CLI. As alterações foram feitas diretamente nos arquivos.

## 5. Arquivos criados ou modificados

```text
src/styles/
├── abstracts/
│   └── _variables.scss      # variáveis Sass: tipografia, espaçamento, formas, layout
├── base/
│   ├── _reset.scss          # reset global
│   └── _typography.scss     # hierarquia tipográfica Open Sans
├── themes/
│   ├── _dark-theme.scss     # tokens do tema dark
│   └── _light-theme.scss    # tokens do tema light
└── styles.scss              # ponto de entrada global
```

Modificados:

- `angular.json` — `styles` passou de `src/styles.scss` para `src/styles/styles.scss`.
- `src/index.html` — `<link>` do Google Fonts (Open Sans) com `preconnect`.
- `src/styles.scss` (antigo) — movido para `src/styles/styles.scss`.

## 6. Configurações realizadas

### Fonte Open Sans

Carregada via `<link>` no `index.html` (pesos 300, 400, 600, 700 + itálico), com `preconnect` para `fonts.googleapis.com` e `fonts.gstatic.com`. A família está definida na variável `$font-family-base` e aplicada ao `body` em `_typography.scss`.

> Alternativa via `@import url(...)` em SCSS foi descartada: regras `@use` do Sass precisam preceder `@import`, e o `@import` CSS resultante ficaria após as regras de tema — solução via `<link>` é mais performática (preconnect + display=swap) e válida.

### Arquitetura SCSS

- **abstracts/_variables.scss**: tokens Sass que não variam por tema — família/ tamanhos/pesos de fonte, espaçamento, border-radius, altura do header e largura da sidebar.
- **base/_reset.scss**: reset moderno (box-sizing, margens, imagens, forms, listas).
- **base/_typography.scss**: hierarquia — `h1`/`h2` (títulos de página), `h3`–`h6` (seções), `p`/`small`/`label` (textos e auxiliares), `button`/`.btn` (botões), classes utilitárias de cor de estado.
- **styles.scss**: ponto de entrada que importa temas → reset → tipografia via `@use`.

### Tema inicial

O tema inicial é **Dark**: os tokens são declarados em `:root` (ver `setup-themes`). O tema Light é ativado via `data-theme="light"` — **sem seletor visual nesta etapa**, apenas arquitetura preparada.

## 7. Como validar

```bash
npm run build        # compila SCSS sem erros
ng serve --port 6080 # conferir fonte e cores no navegador
```

## 8. Resultado esperado

- Build concluído com CSS global gerado.
- Texto renderizado em Open Sans com cores do tema dark.

## 9. Validação executada

`npm run build` → "Application bundle generation complete".

## 10. Possíveis problemas e soluções

| Problema | Solução |
| -------- | ------- |
| `@use rules must be written before any other rules` | Manter `@use` no topo de `styles.scss`; não usar `@import url()` de fontes no SCSS — usar `<link>` no `index.html`. |
| `angular.json` aponta para `src/styles.scss` antigo | Atualizar para `src/styles/styles.scss`. |
| Fonte não carrega offline | Baixar os arquivos woff2 e servir localmente ou usar `@fontsource/open-sans`. |
