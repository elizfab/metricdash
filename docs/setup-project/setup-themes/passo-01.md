# Setup de Temas (Light/Dark) — Etapa 07.2

## 1. Objetivo

Preparar a arquitetura de temas visuais do MetricDash com os temas Dark (inicial) e Light, compartilhando os mesmos tokens semânticos via CSS Custom Properties.

## 2. Pré-requisitos

- Arquitetura SCSS criada (`setup-scss`).

## 3. Versões utilizadas

| Item        | Versão |
| ----------- | ------ |
| Sass        | via `@angular/build` (dart-sass) |
| CSS Custom Properties | nativo |

## 4. Comandos executados

Nenhum — configuração declarativa em arquivos SCSS.

## 5. Arquivos criados

```text
src/styles/themes/_dark-theme.scss
src/styles/themes/_light-theme.scss
```

## 6. Configurações realizadas

### Tokens semânticos (compartilhados pelos dois temas)

| Token                        | Dark     | Light    |
| ---------------------------- | -------- | -------- |
| `--color-background`         | #171725  | #f4f4f8  |
| `--color-header`             | #242438  | #ffffff  |
| `--color-sidebar`            | #242438  | #ffffff  |
| `--color-surface` (cards)    | #242438  | #ffffff  |
| `--color-surface-secondary`  | #2d2d43  | #ececf2  |
| `--color-border`             | #38384f  | #d8d8e4  |
| `--color-text-primary`       | #fdf7fe  | #1c1c2e  |
| `--color-text-secondary`     | #b8b8cc  | #5c5c72  |
| `--color-accent-pink`        | #e7abd8  | #c2549b  |
| `--color-accent-blue`        | #17b4da  | #0e8fb8  |
| `--color-accent-blue-deep`   | #17405b  | #17405b  |
| `--color-icon`               | #e7abd8  | #c2549b  |
| `--color-icon-background`    | #4a3d54  | #f3e2f0  |
| `--color-warning`            | #ffc506  | #d99a00  |
| `--color-danger`             | #e94d4d  | #d33f3f  |
| `--color-success`            | #4ade80  | #2e9e5b  |
| `--color-info`               | #17b4da  | #0e8fb8  |

### Paleta oficial DARK (documentação-02 §9.3)

Todos os valores da paleta oficial foram mapeados para tokens semânticos: fundo `#171725`, superfícies `#242438`/`#2D2D43`, bordas `#38384F`, textos `#FDF7FE`/`#B8B8CC`, rosa `#E7ABD8`, fundo de ícones `#4A3D54`, azul `#17B4DA`/`#17405B`, amarelo `#FFC506` (alertas), vermelho `#E94D4D` (erros).

### Como os temas são aplicados

- **Dark (inicial):** tokens declarados em `:root` — ativos por padrão.
- **Light:** tokens declarados em `:root[data-theme='light']` — ativados ao definir o atributo `data-theme="light"` no `<html>`.

Componentes devem consumir **somente** as CSS Custom Properties (`var(--color-surface)` etc.), nunca valores hex diretos — assim a troca de tema não exige reescrita de componentes.

### Regras de uso da paleta

- Rosa e azul são as cores de destaque.
- Amarelo reservado para alertas/avisos (`--color-warning`).
- Vermelho para erros (`--color-danger`).
- Não usar todas as cores de destaque simultaneamente em um mesmo componente.
- Contraste verificado: texto claro sobre superfícies escuras (dark) e texto escuro sobre superfícies claras (light).

## 7. Como validar

```bash
npm run build
# No navegador: document.documentElement.setAttribute('data-theme', 'light') alterna o tema.
```

## 8. Resultado esperado

- Tema dark aplicado por padrão.
- Troca para light funcional via atributo `data-theme` (sem UI de seleção, conforme escopo).

## 9. Validação executada

`npm run build` → sucesso; tokens compilados no CSS de produção.

## 10. Possíveis problemas e soluções

| Problema | Solução |
| -------- | ------- |
| Tema light não ativa | Verificar atributo exato `data-theme="light"` no elemento `<html>` (seletor `:root[data-theme='light']`). |
| Componente com cor hardcoded | Substituir hex/rgb por `var(--token)` correspondente. |
| Contraste insuficiente em novo componente | Revisar pares texto/fundo usando os tokens semânticos, não cores de destaque. |
