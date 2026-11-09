# Customização do Tema NG-ZORRO — Tema dos Componentes

## 1. Objetivo

Aplicar a paleta oficial do MetricDash aos componentes do NG-ZORRO, substituindo o CSS estático `ng-zorro-antd.min.css` por um entry Less customizado baseado no tema oficial **dark**, confome a documentação oficial de customização de tema.

Referência oficial: <https://ng.ant.design/docs/customize-theme/en>

## 2. Pré-requisitos

- NG-ZORRO 22.2.0 instalado e configurado (`passo-01.md`).
- Paleta de cores e tokens de tema definidos em `src/styles/themes/`.
- Tema inicial da aplicação: **Dark**.

## 3. Versões utilizadas

| Item | Versão |
| ---- | ------ |
| ng-zorro-antd | 22.2.0 |
| less | 4.x (devDependency) |
| @angular/build | 22.2.x (suporte nativo a `.less`) |

## 4. Como o NG-ZORRO 22 temifica (análise)

A documentação oficial descreve dois métodos:

1. **Less (Method 1):** importar `ng-zorro-antd.less` / `ng-zorro-antd.dark.less` e sobrescrever variáveis `@...` — é o método que dá controle total sobre **todos** os componentes (superfícies, textos, bordas, estados).
2. **CSS Variables:** o pacote também distribui `ng-zorro-antd.variable.css`, que expõe ~43 tokens `--ant-*` (somente cores de destaque/estado). Os fundos e bordas dos componentes continuam estáticos — insuficiente para o tema dark do MetricDash.

**Decisão:** Método 1 (Less) com o tema oficial `dark` como base, pois o tema inicial do MetricDash é dark e a paleta precisa cobrir superfícies, textos e bordas — não apenas cores de destaque.

## 5. Arquivos criados ou modificados

- `src/styles/vendor/ng-zorro.dark.less` — **criado**: entry Less que importa o tema oficial dark e aplica os overrides da paleta MetricDash.
- `angular.json` — `styles` alterado de `./node_modules/ng-zorro-antd/ng-zorro-antd.min.css` para `src/styles/vendor/ng-zorro.dark.less`.
- `package.json` / `package-lock.json` — `less` adicionado como devDependency (exigido pelo `angular-less` do `@angular/build`).

## 6. Configurações realizadas

### Entry Less (`src/styles/vendor/ng-zorro.dark.less`)

```less
@import '../../../node_modules/ng-zorro-antd/ng-zorro-antd.dark.less';

// Overrides MetricDash — Less usa avaliação preguiçosa:
// a última definição de cada variável vence.
@primary-color: #17b4da;
@primary-color-hover: #35c4e8;
@primary-color-active: #0e8fb8;
@body-background: #171725;
@component-background: #242438;
@popover-background: #2d2d43;
@text-color: #fdf7fe;
@text-color-secondary: #b8b8cc;
@border-color-base: #38384f;
@success-color: #4ade80;
@warning-color: #ffc506;
@error-color: #e94d4d;
@font-family: 'Open Sans', Roboto, Arial, sans-serif;
@border-radius-base: 8px;
// ... (layout, menu, table e demais superfícies no arquivo)
```

### Mapeamento paleta MetricDash → variáveis Less

| Token MetricDash | Variável(s) Less |
| ---------------- | ---------------- |
| Azul principal `#17B4DA` | `@primary-color`, `@link-color` (+ hover/active derivados) |
| Background `#171725` | `@body-background`, `@layout-body-background` |
| Cards/superfícies `#242438` | `@component-background`, `@layout-header-background`, `@layout-sider-background`, `@menu-dark-bg` |
| Superfícies secundárias `#2D2D43` | `@popover-background`, `@menu-dark-inline-submenu-bg`, `@table-header-bg`, `@table-row-hover-bg` |
| Bordas `#38384F` | `@border-color-base`, `@border-color-split`, `@popover-customize-border-color` |
| Texto `#FDF7FE` / secundário `#B8B8CC` | `@text-color`, `@heading-color`, `@text-color-secondary` |
| Amarelo `#FFC506` | `@warning-color` (alertas) |
| Vermelho `#E94D4D` | `@error-color` (erros) |
| Verde sucesso | `@success-color` `#4ADE80` |
| Open Sans | `@font-family` |
| Radius 8px | `@border-radius-base` |

### Por que overrides após o `@import`

O Less avalia variáveis de forma preguiçosa: **a última definição no mesmo escopo vence** para todos os usos, mesmo os que aparecem antes no arquivo. Por isso basta importar o tema oficial e redeclarar as variáveis desejadas ao final — exatamente como no exemplo oficial da documentação.

## 7. Como validar

```bash
npm run build
# No CSS gerado (dist/metricdash/browser/styles-*.css), verificar:
#   .ant-btn-primary { background: #17b4da }
#   #171725, #242438, #2d2d43, #38384f, #fdf7fe, #ffc506, #e94d4d presentes
```

## 8. Resultado esperado

- Componentes NG-ZORRO renderizam com a paleta MetricDash dark.
- Build de produção concluído com o bundle Less compilado.

## 9. Validação executada

- `npm run build` → sucesso (bundle inicial ~876 kB; warning de budget apenas).
- CSS de produção inspecionado: `#17b4da`, `#171725`, `#242438`, `#2d2d43`, `#38384f`, `#fdf7fe`, `#b8b8cc`, `#ffc506`, `#e94d4d`, `#4ade80`, `Open Sans` e `#35c4e8`/`#0e8fb8` (hover/active) presentes.
- Regra compilada confirmada: `.ant-btn-primary { ... background:#17b4da }`.

## 10. Limitações e evoluções futuras

- **Tema light dos componentes:** o CSS compilado é estático; alternar NG-ZORRO entre light/dark exige a estratégia de *Theme Dynamic Switching* da documentação oficial (dois bundles Less com `bundleName` + `inject: false` e troca de `<link>` em runtime). Será implementado quando o seletor de temas for desenvolvido.
- Novas variáveis podem ser sobrescritas no mesmo arquivo seguindo o padrão `@variavel: valor;` após o `@import`. A lista completa de variáveis está em `node_modules/ng-zorro-antd/style/themes/default.less` e `dark.less`.
- O `ng-zorro-antd.variable.css` (tokens `--ant-*`) **não** está em uso — foi substituído pela abordagem Less por cobrir todas as superfícies.

## 11. Possíveis problemas e soluções

| Problema | Solução |
| -------- | ------- |
| `Unable to load the "less" stylesheet preprocessor` | Instalar `less` como devDependency (`npm i -D less`). |
| Override não surte efeito | Verificar se a variável foi escrita **depois** do `@import` e se o nome está correto (case-sensitive, com `@`). |
| Cor errada em hover/active | Derivar de `@primary-color` ou definir `@primary-color-hover`/`@primary-color-active` explicitamente. |
| Bundle maior | Esperado: o Less completo substitui o `min.css`; o ganho é a customização total do tema. |
