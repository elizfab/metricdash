# Passo 05 — Layout e Estilos

## Estrutura SCSS atual

```
src/styles/
├── abstracts/_variables.scss   # tokens (cores, espaçamentos, tipografia)
├── base/
│   ├── _reset.scss
│   ├── _typography.scss        # Open Sans
│   └── _metric-dash.scss       # estilos base MetricDash
├── themes/
│   ├── _dark-theme.scss        # ativo
│   └── _light-theme.scss       # preparado
├── vendor/ng-zorro.dark.less   # tema NG-ZORRO
└── styles.scss                 # entry point
```

## Regras

1. **Tokens primeiro:** toda cor/espaçamento vem de `_variables.scss` — nunca hex solto em componente.
2. **View encapsulation:** estilos de componente em `*.component.scss` com `::ng-deep` só quando necessário para sobrescrever NG-ZORRO.
3. **Temas:** usar variáveis CSS (`var(--md-*)`) definidas por `[data-theme]` — o seletor de temas futuro só troca o atributo.
4. **Densidade:** seguir espaçamentos base 4px (4/8/12/16/24/32).

## Grid system

Usar **CSS Grid nativo** via classes utilitárias em `_metric-dash.scss` (sem framework externo):

```scss
.md-grid { display: grid; gap: var(--md-space-4); }
.md-grid--cols-2 { grid-template-columns: repeat(2, 1fr); }
.md-grid--cols-3 { grid-template-columns: repeat(3, 1fr); }
.md-grid--cols-4 { grid-template-columns: repeat(4, 1fr); }
.md-grid--auto { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
@media (max-width: 992px) { .md-grid--cols-3, .md-grid--cols-4 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 576px) { .md-grid--cols-2, .md-grid--cols-3, .md-grid--cols-4 { grid-template-columns: 1fr; } }
```

- Dashboard: cards em `md-grid--cols-4` (total, passagens, hospedagem, viagens) → `cols-2`/`cols-1` no mobile.
- Resumo mensal: tabela full-width + gráficos em `md-grid--cols-2`.
- Formulários CRUD: `md-grid--cols-2` para campos curtos, `cols-1` para descrições.

## Breakpoints

`576px` (mobile), `768px` (tablet), `992px` (desktop), `1200px` (wide) — mobile-first.

## NG-ZORRO no grid

- `nz-row`/`nz-col` **não** usar — padronizar em CSS Grid (`md-grid`) para consistência.
- Sobrescrever tokens Less já feito em `ng-zorro.dark.less`; ajustes finos por componente via `::ng-deep` no `.component.scss` do shell.

## Validação

- `npm run build` sem warnings de estilo.
- Lighthouse/visual: dashboard responsivo nas 4 larguras.
