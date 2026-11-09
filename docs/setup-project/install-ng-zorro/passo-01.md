# Instalação do NG-ZORRO — Etapa 04.2

## 1. Objetivo

Instalar e configurar a biblioteca de componentes NG-ZORRO para Angular, incluindo estilos globais, ícones e integração com SCSS e componentes standalone.

## 2. Pré-requisitos

- Projeto Angular 22 com SCSS (Etapa 02).
- Node.js 24.22.0 / npm 11.19.1.

## 3. Versões utilizadas

| Pacote                  | Versão  |
| ----------------------- | ------- |
| ng-zorro-antd           | 22.2.0  |
| @ant-design/icons-angular | 22.1.1 |
| @angular/cdk            | 22.2.6 (dependência transitiva) |

A versão 22.x do NG-ZORRO declara `peerDependencies` compatíveis com `@angular/*: ^22.0.0`.

## 4. Comandos executados

```bash
npx ng add ng-zorro-antd@22.2.0 --skip-confirmation --defaults
npm install @ant-design/icons-angular@22.1.1
```

## 5. Explicação dos comandos

- `ng add ng-zorro-antd@22.2.0`: executa o schematic oficial do pacote, que instala a biblioteca, adiciona o CSS global no `angular.json` e registra os providers de i18n e date adapter no `app.config.ts`.
- `--skip-confirmation --defaults`: executa sem prompts interativos, usando os padrões.
- `npm install @ant-design/icons-angular`: instala o pacote de ícones oficial do ecossistema Ant Design, necessário para os componentes de ícone do NG-ZORRO.

## 6. Arquivos criados ou modificados

- `package.json` / `package-lock.json` — `ng-zorro-antd` e `@ant-design/icons-angular`.
- `angular.json` — `"./node_modules/ng-zorro-antd/ng-zorro-antd.min.css"` adicionado à lista `styles` do build.
- `src/app/app.config.ts` — adicionados `provideNzI18n(en_US)`, `registerLocaleData(en)` e `provideNzDateFnsAdapter()`.

## 7. Configurações realizadas

- **Estilos globais:** CSS do NG-ZORRO incluído antes de `src/styles.scss` no `angular.json`.
- **Internacionalização:** locale `en_US` configurado via `provideNzI18n`.
- **Date adapter:** `provideNzDateFnsAdapter()` registra o adaptador de datas.
- **Standalone:** todos os componentes do NG-ZORRO são standalone e podem ser importados diretamente nos componentes (`imports: [NzButtonModule]` etc.).
- **SCSS:** compatível com `inlineStyleLanguage: "scss"` já configurado no workspace.

## 8. Como validar

```bash
npm run build   # deve compilar sem erros
```

## 9. Resultado esperado

- Build concluído; CSS do NG-ZORRO incluído no bundle de estilos.
- Componentes disponíveis para uso futuro (nenhum componente de negócio criado nesta etapa).

## 10. Validação executada

`npm run build` → sucesso. Observação: o bundle inicial de produção passou a ~839 kB (CSS do NG-ZORRO incluído), gerando apenas um *warning* de budget do Angular — sem erro.

## 11. Possíveis problemas e soluções

| Problema | Solução |
| -------- | ------- |
| Estilos do NG-ZORRO não aparecem | Verificar se `ng-zorro-antd.min.css` está listado em `angular.json > projects > metricdash > architect > build > options > styles`. |
| Erro de ícone não encontrado | Instalar `@ant-design/icons-angular` na mesma linha de versão do ecossistema. |
| Componentes sem estilo em testes | Importar o CSS global ou mockar nos testes. |
